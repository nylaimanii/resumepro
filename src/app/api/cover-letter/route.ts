import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementAnalysisQuota } from "@/lib/rate-limit";
import { generateCoverLetter, toneFromNumber } from "@/lib/groq/cover-letter";
import type { ResumeData } from "@/lib/types/resume";

const BodySchema = z.object({
  resume_id: z.string().uuid(),
  job_target_id: z.string().uuid().optional(),
  job_title: z.string().min(1),
  company: z.string().min(1),
  job_description: z.string().min(100),
  hiring_manager: z.string().optional(),
  tone: z.number().min(0).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid request", details: parsed.error.flatten() }, { status: 400 });
    }
    const { resume_id, job_target_id, job_title, company, job_description, hiring_manager, tone } = parsed.data;

    const quota = await checkAndIncrementAnalysisQuota(user.id, supabase);
    if (!quota.allowed) {
      return NextResponse.json({ error: "daily limit reached", resets_at: quota.resetsAt }, { status: 429 });
    }

    const { data: resume } = await supabase
      .from("resumes")
      .select("id, raw_text, parsed_json")
      .eq("id", resume_id)
      .eq("user_id", user.id)
      .single();
    if (!resume) return NextResponse.json({ error: "resume not found" }, { status: 404 });

    let jtId = job_target_id;
    if (!jtId) {
      const { data: jt } = await supabase
        .from("job_targets")
        .insert({
          user_id: user.id,
          resume_id,
          job_title,
          company,
          job_description,
        })
        .select("id")
        .single();
      jtId = jt?.id;
    }

    const result = await generateCoverLetter({
      resumeText: resume.raw_text,
      parsedResume: resume.parsed_json as ResumeData | null,
      jobTitle: job_title,
      company,
      jobDescription: job_description,
      hiringManager: hiring_manager,
      tone,
    });

    const toneLabel = toneFromNumber(tone);

    const { data: coverLetter } = await supabase
      .from("cover_letters")
      .insert({
        user_id: user.id,
        resume_id,
        job_target_id: jtId ?? null,
        content: result.content,
        tone: toneLabel,
        word_count: result.word_count,
      })
      .select("id, created_at")
      .single();

    return NextResponse.json({
      cover_letter_id: coverLetter?.id,
      content: result.content,
      word_count: result.word_count,
      tone: toneLabel,
      created_at: coverLetter?.created_at,
    });
  } catch (err) {
    console.error("cover-letter error:", err);
    return NextResponse.json({ error: "generation failed" }, { status: 500 });
  }
}
