import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScoreGauge } from "@/components/analysis/score-gauge";
import { ScoreBreakdown } from "@/components/analysis/score-breakdown";
import { AISummary } from "@/components/analysis/ai-summary";
import { SuggestionsList } from "@/components/analysis/suggestions-list";
import { KeywordPanel } from "@/components/analysis/keyword-panel";
import { RedFlags } from "@/components/analysis/red-flags";
import { AnalysisHeader } from "@/components/analysis/analysis-header";
import { Button } from "@/components/ui/button";
import type { Suggestion } from "@/lib/groq/analyze";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*, resumes(title), job_targets(job_title, company, created_at)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!analysis) notFound();

  const stored = (analysis.suggestions ?? []) as Array<{ summary?: string } & Partial<Suggestion>>;
  const aiSummary = stored[0]?.summary ?? "";
  const suggestions = stored.slice(1).filter((s): s is Suggestion => Boolean(s.id));

  const resume = analysis.resumes as { title: string } | null;
  const jobTarget = analysis.job_targets as { job_title: string; company?: string; created_at: string } | null;

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <AnalysisHeader
        resumeTitle={resume?.title ?? "resume"}
        jobTitle={jobTarget?.job_title ?? "—"}
        company={jobTarget?.company ?? undefined}
        createdAt={analysis.created_at}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-center">
            <ScoreGauge score={analysis.ats_score} />
          </div>
          <ScoreBreakdown breakdown={analysis.score_breakdown} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {aiSummary && <AISummary summary={aiSummary} />}
          {suggestions.length > 0 && (
            <SuggestionsList suggestions={suggestions} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeywordPanel
          matched={analysis.keywords_matched ?? []}
          missing={analysis.keywords_missing ?? []}
        />
        <RedFlags flags={analysis.red_flags ?? []} />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="outline" disabled>export pdf</Button>
        <Button asChild>
          <Link href={`/builder/${analysis.resume_id}`}>edit in builder</Link>
        </Button>
      </div>
    </main>
  );
}
