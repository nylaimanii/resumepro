import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BuilderClient } from "./builder-client";
import type { ResumeData } from "@/lib/types/resume";
import { EMPTY_RESUME } from "@/lib/types/resume";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: resume } = await supabase
    .from("resumes")
    .select("id, title, parsed_json, raw_text")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!resume) redirect("/dashboard");

  return (
    <BuilderClient
      resumeId={resume.id}
      title={resume.title}
      initialData={(resume.parsed_json as ResumeData | null) ?? EMPTY_RESUME}
      needsParsing={!resume.parsed_json}
    />
  );
}
