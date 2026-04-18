import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { scoreColor } from "@/lib/colors";
import { PenLine } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: analyses }, { count }, { data: profile }, { data: coverLetters }, { count: clCount }] = await Promise.all([
    supabase
      .from("analyses")
      .select("id, ats_score, created_at, resume_id, resumes(title), job_targets(job_title, company)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("profiles")
      .select("daily_analyses_used")
      .eq("id", user.id)
      .single(),
    supabase
      .from("cover_letters")
      .select("id, tone, word_count, created_at, job_targets(job_title, company)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("cover_letters")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const total = count ?? 0;
  const totalCl = clCount ?? 0;
  const dailyUsed = profile?.daily_analyses_used ?? 0;
  const avgScore =
    analyses && analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + a.ats_score, 0) / analyses.length)
      : null;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
        </div>
        <form action="/auth/logout" method="POST">
          <Button variant="ghost" size="sm" type="submit">sign out</Button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">total analyses</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-3xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">average score</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {avgScore !== null ? (
              <p className={`text-3xl font-bold ${scoreColor(avgScore).text}`}>{avgScore}</p>
            ) : (
              <p className="text-3xl font-bold text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">cover letters</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-3xl font-bold">{totalCl}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">today&apos;s usage</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-3xl font-bold">{dailyUsed}<span className="text-base font-normal text-muted-foreground">/10</span></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div>
              <p className="font-semibold">analyze a new resume</p>
              <p className="text-sm text-muted-foreground">upload a pdf or docx and paste a job description</p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/analyze">upload resume</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div>
              <p className="font-semibold">write a cover letter</p>
              <p className="text-sm text-muted-foreground">tailored to any job in under 30 seconds</p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/cover-letter/new">
                <PenLine className="h-4 w-4 mr-1.5" />
                new letter
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">recent cover letters</h2>
          <Button asChild variant="ghost" size="sm" className="text-xs h-7">
            <Link href="/cover-letter">view all</Link>
          </Button>
        </div>
        {!coverLetters || coverLetters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            <p className="text-sm">no cover letters yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {coverLetters.map((cl) => {
              const jtRaw = cl.job_targets;
              const jt = (Array.isArray(jtRaw) ? jtRaw[0] : jtRaw) as { job_title: string; company?: string } | null;
              return (
                <div
                  key={cl.id}
                  className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {jt?.job_title ?? "—"}{jt?.company ? ` @ ${jt.company}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cl.word_count} words · {formatDistanceToNow(new Date(cl.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs capitalize">{cl.tone}</Badge>
                    <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                      <Link href={`/cover-letter/${cl.id}`}>open</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3">recent analyses</h2>
        {!analyses || analyses.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border rounded-lg">
            <p className="font-medium">no analyses yet</p>
            <p className="text-sm mt-1">upload your first resume to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {analyses.map((a) => {
              const resumeRaw = a.resumes;
              const resume = (Array.isArray(resumeRaw) ? resumeRaw[0] : resumeRaw) as { title: string } | null;
              const jtRaw = a.job_targets;
              const jt = (Array.isArray(jtRaw) ? jtRaw[0] : jtRaw) as { job_title: string; company?: string } | null;
              const colors = scoreColor(a.ats_score);
              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {jt?.job_title ?? "—"}{jt?.company ? ` @ ${jt.company}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {resume?.title} · {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className={`${colors.text} ${colors.bg} border-0 tabular-nums`}>
                      {a.ats_score}
                    </Badge>
                    <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                      <Link href={`/analysis/${a.id}`}>view</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                      <Link href={`/builder/${a.resume_id}`}>edit</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
