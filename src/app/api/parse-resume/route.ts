import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { parseResumeText } from "@/lib/groq/parse-resume";

const BodySchema = z.object({ resume_id: z.string().uuid() });

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "invalid request" }, { status: 400 });

    const { data: resume } = await supabase
      .from("resumes")
      .select("id, raw_text, parsed_json")
      .eq("id", parsed.data.resume_id)
      .eq("user_id", user.id)
      .single();

    if (!resume) return NextResponse.json({ error: "resume not found" }, { status: 404 });
    if (resume.parsed_json) return NextResponse.json({ parsed_json: resume.parsed_json });

    const parsedData = await parseResumeText(resume.raw_text);

    await supabase
      .from("resumes")
      .update({ parsed_json: parsedData })
      .eq("id", resume.id);

    return NextResponse.json({ parsed_json: parsedData });
  } catch (err) {
    console.error("parse-resume error:", err);
    return NextResponse.json({ error: "parse failed" }, { status: 500 });
  }
}
