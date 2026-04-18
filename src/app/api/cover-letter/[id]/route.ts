import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const PatchSchema = z.object({
  content: z.string().min(1),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "invalid request" }, { status: 400 });

    const word_count = parsed.data.content.split(/\s+/).filter(Boolean).length;

    const { data } = await supabase
      .from("cover_letters")
      .update({ content: parsed.data.content, word_count })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (err) {
    console.error("cover-letter patch error:", err);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { error } = await supabase
      .from("cover_letters")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: "delete failed" }, { status: 500 });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("cover-letter delete error:", err);
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
}
