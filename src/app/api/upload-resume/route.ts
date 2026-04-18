import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseResumeFile } from "@/lib/parsers";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null)?.trim();

    if (!file) return NextResponse.json({ error: "no file provided" }, { status: 400 });
    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "file exceeds 10mb limit" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "only pdf and docx files are supported" }, { status: 400 });
    }

    const storagePath = `${user.id}/${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("resume-files")
      .upload(storagePath, arrayBuffer, { contentType: file.type });

    if (uploadError) {
      console.error("storage upload error:", uploadError);
      return NextResponse.json({ error: "file upload failed" }, { status: 500 });
    }

    let rawText: string;
    try {
      rawText = await parseResumeFile(file);
    } catch (parseError) {
      await supabase.storage.from("resume-files").remove([storagePath]);
      const msg = parseError instanceof Error ? parseError.message : "parse failed";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { data: resume, error: insertError } = await supabase
      .from("resumes")
      .insert({ user_id: user.id, title, raw_text: rawText, source_file_url: storagePath })
      .select("id")
      .single();

    if (insertError || !resume) {
      console.error("db insert error:", insertError);
      await supabase.storage.from("resume-files").remove([storagePath]);
      return NextResponse.json({ error: "failed to save resume" }, { status: 500 });
    }

    await supabase.storage.from("resume-files").remove([storagePath]);
    await supabase.from("resumes").update({ source_file_url: null }).eq("id", resume.id);

    return NextResponse.json({
      resume_id: resume.id,
      title,
      preview: rawText.slice(0, 300),
    });
  } catch (err) {
    console.error("upload-resume unhandled error:", err);
    return NextResponse.json({ error: "something went wrong" }, { status: 500 });
  }
}
