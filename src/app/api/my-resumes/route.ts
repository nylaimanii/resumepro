import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { data: resumes } = await supabase
      .from("resumes")
      .select("id, title, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ resumes: resumes ?? [] });
  } catch (err) {
    console.error("my-resumes error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
