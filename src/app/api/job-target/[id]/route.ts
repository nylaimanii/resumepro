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

    const { data } = await supabase
      .from("job_targets")
      .select("id, job_title, company, job_description")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (err) {
    console.error("job-target get error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
