import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  resume_id: z.string().uuid(),
  template: z.enum(["modern", "classic", "minimal"]).default("modern"),
});

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
      .select("title, parsed_json, raw_text")
      .eq("id", parsed.data.resume_id)
      .eq("user_id", user.id)
      .single();

    if (!resume) return NextResponse.json({ error: "resume not found" }, { status: 404 });

    const data = resume.parsed_json;
    if (!data) return NextResponse.json({ error: "resume not parsed yet — open the builder first" }, { status: 400 });

    const { renderToBuffer } = await import("@react-pdf/renderer");

    let element;
    if (parsed.data.template === "classic") {
      const { ClassicPDF } = await import("@/components/builder/pdf-templates/pdf-template-classic");
      element = <ClassicPDF data={data as never} />;
    } else if (parsed.data.template === "minimal") {
      const { MinimalPDF } = await import("@/components/builder/pdf-templates/pdf-template-minimal");
      element = <MinimalPDF data={data as never} />;
    } else {
      const { ModernPDF } = await import("@/components/builder/pdf-templates/pdf-template-modern");
      element = <ModernPDF data={data as never} />;
    }

    const buffer = await renderToBuffer(element);
    const filename = (resume.title || "resume").replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      },
    });
  } catch (err) {
    console.error("export-pdf error:", err);
    return NextResponse.json({ error: "pdf generation failed" }, { status: 500 });
  }
}
