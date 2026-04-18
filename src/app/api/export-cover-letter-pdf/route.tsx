import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ResumeData } from "@/lib/types/resume";

const BodySchema = z.object({
  cover_letter_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "invalid request" }, { status: 400 });

    const { data: cl } = await supabase
      .from("cover_letters")
      .select("content, resume_id, job_target_id, resumes(title, parsed_json), job_targets(company, job_title)")
      .eq("id", parsed.data.cover_letter_id)
      .eq("user_id", user.id)
      .single();

    if (!cl) return NextResponse.json({ error: "cover letter not found" }, { status: 404 });

    const resumeRaw = cl.resumes;
    const resume = (Array.isArray(resumeRaw) ? resumeRaw[0] : resumeRaw) as { title: string; parsed_json: unknown } | null;
    const jtRaw = cl.job_targets;
    const jt = (Array.isArray(jtRaw) ? jtRaw[0] : jtRaw) as { company: string; job_title: string } | null;

    const personal = (resume?.parsed_json as ResumeData | null)?.personal;
    const name = personal?.name || resume?.title || "candidate";
    const company = jt?.company || "company";

    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { CoverLetterPDF } = await import("@/components/builder/pdf-templates/pdf-cover-letter");

    const element = (
      <CoverLetterPDF
        content={cl.content}
        name={name}
        email={personal?.email}
        phone={personal?.phone}
        location={personal?.location}
        company={company}
      />
    );

    const buffer = await renderToBuffer(element);
    const filename = `cover-letter-${company.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("export-cover-letter-pdf error:", err);
    return NextResponse.json({ error: "pdf generation failed" }, { status: 500 });
  }
}
