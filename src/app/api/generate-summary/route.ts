import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateSummary } from "@/lib/groq/rewrite";

const BodySchema = z.object({
  resume_id: z.string().uuid(),
  job_title: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid request" }, { status: 400 });
    }

    const { data: resume } = await supabase
      .from("resumes")
      .select("raw_text")
      .eq("id", parsed.data.resume_id)
      .eq("user_id", user.id)
      .single();
    if (!resume) return NextResponse.json({ error: "resume not found" }, { status: 404 });

    const summary = await generateSummary(resume.raw_text, parsed.data.job_title);
    return NextResponse.json({ summary });
  } catch (err) {
    console.error("generate-summary error:", err);
    return NextResponse.json({ error: "summary generation failed" }, { status: 500 });
  }
}
