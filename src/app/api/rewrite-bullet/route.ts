import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rewriteBullet } from "@/lib/groq/rewrite";

const BodySchema = z.object({
  bullet: z.string().min(10).max(500),
  job_title: z.string().optional(),
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

    const rewritten = await rewriteBullet(parsed.data.bullet, { jobTitle: parsed.data.job_title });
    return NextResponse.json({ rewritten });
  } catch (err) {
    console.error("rewrite-bullet error:", err);
    return NextResponse.json({ error: "rewrite failed" }, { status: 500 });
  }
}
