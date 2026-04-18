import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  resume_id: z.string().uuid(),
  parsed_json: z.record(z.string(), z.unknown()),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "invalid request" }, { status: 400 });

    const { data } = await supabase
      .from("resumes")
      .update({ parsed_json: parsed.data.parsed_json })
      .eq("id", parsed.data.resume_id)
      .eq("user_id", user.id)
      .select("updated_at")
      .single();

    return NextResponse.json({ updated_at: data?.updated_at });
  } catch (err) {
    console.error("save-resume error:", err);
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }
}
