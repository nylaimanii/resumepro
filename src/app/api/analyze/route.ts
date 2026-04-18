import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { scoreResume } from "@/lib/scoring";
import { getAIAnalysis } from "@/lib/groq/analyze";
import { computeContentHash } from "@/lib/hash";
import { checkAndIncrementAnalysisQuota } from "@/lib/rate-limit";

const BodySchema = z.object({
  resume_id: z.string().uuid(),
  job_title: z.string().min(1),
  company: z.string().optional(),
  job_description: z.string().min(100),
  job_url: z.string().url().optional().or(z.literal("")),
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
    const { resume_id, job_title, company, job_description, job_url } = parsed.data;

    const { data: resume } = await supabase
      .from("resumes")
      .select("id, raw_text")
      .eq("id", resume_id)
      .eq("user_id", user.id)
      .single();
    if (!resume) return NextResponse.json({ error: "resume not found" }, { status: 404 });

    const content_hash = await computeContentHash(resume.raw_text, job_description);

    const { data: cached } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", user.id)
      .eq("content_hash", content_hash)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (cached) {
      return NextResponse.json({
        analysis_id: cached.id,
        resume_id: cached.resume_id,
        job_target_id: cached.job_target_id,
        ats_score: cached.ats_score,
        score_breakdown: cached.score_breakdown,
        keywords_matched: cached.keywords_matched,
        keywords_missing: cached.keywords_missing,
        red_flags: cached.red_flags,
        ai_summary: (cached.suggestions as { summary?: string }[])?.[0]?.summary ?? "",
        suggestions: cached.suggestions,
        cached: true,
      });
    }

    const quota = await checkAndIncrementAnalysisQuota(user.id, supabase);
    if (!quota.allowed) {
      return NextResponse.json(
        { error: "daily limit reached", resets_at: quota.resetsAt },
        { status: 429 }
      );
    }

    const { data: jobTarget } = await supabase
      .from("job_targets")
      .insert({
        user_id: user.id,
        resume_id,
        job_title,
        company: company ?? null,
        job_description,
        job_url: job_url || null,
      })
      .select("id")
      .single();

    const scoreResult = scoreResume(resume.raw_text, job_description);

    const aiResult = await getAIAnalysis({
      resumeText: resume.raw_text,
      jdText: job_description,
      scoreBreakdown: scoreResult.score_breakdown,
      redFlags: scoreResult.red_flags,
      missingKeywords: scoreResult.keywords_missing.map((k) => k.keyword),
    });

    const suggestionsWithSummary = [
      { summary: aiResult.summary },
      ...aiResult.suggestions,
    ];

    const { data: analysis } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        resume_id,
        job_target_id: jobTarget?.id ?? null,
        ats_score: scoreResult.ats_score,
        score_breakdown: scoreResult.score_breakdown,
        keywords_matched: scoreResult.keywords_matched,
        keywords_missing: scoreResult.keywords_missing,
        suggestions: suggestionsWithSummary,
        red_flags: scoreResult.red_flags,
        content_hash,
      })
      .select("id")
      .single();

    return NextResponse.json({
      analysis_id: analysis?.id,
      resume_id,
      job_target_id: jobTarget?.id ?? null,
      ats_score: scoreResult.ats_score,
      score_breakdown: scoreResult.score_breakdown,
      keywords_matched: scoreResult.keywords_matched,
      keywords_missing: scoreResult.keywords_missing,
      red_flags: scoreResult.red_flags,
      ai_summary: aiResult.summary,
      suggestions: aiResult.suggestions,
      cached: false,
    });
  } catch (err) {
    console.error("analyze error:", err);
    return NextResponse.json({ error: "analysis failed" }, { status: 500 });
  }
}
