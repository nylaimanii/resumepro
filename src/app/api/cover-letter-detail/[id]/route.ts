import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { data: cl } = await supabase
      .from("cover_letters")
      .select("id, content, word_count, tone, created_at, resume_id, job_target_id, job_targets(job_title, company, job_description)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!cl) return NextResponse.json({ error: "not found" }, { status: 404 });

    const jtRaw = cl.job_targets;
    const jt = (Array.isArray(jtRaw) ? jtRaw[0] : jtRaw) as {
      job_title: string;
      company?: string;
      job_description: string;
    } | null;

    return NextResponse.json({
      letter: {
        id: cl.id,
        content: cl.content,
        word_count: cl.word_count,
        tone: cl.tone,
        created_at: cl.created_at,
        job_targets: jt ? { job_title: jt.job_title, company: jt.company } : null,
      },
      regen_context: jt
        ? {
            resume_id: cl.resume_id,
            job_target_id: cl.job_target_id ?? undefined,
            job_title: jt.job_title,
            company: jt.company ?? "",
            job_description: jt.job_description,
          }
        : null,
    });
  } catch (err) {
    console.error("cover-letter-detail error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
