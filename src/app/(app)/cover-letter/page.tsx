import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";

export default async function CoverLettersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: letters } = await supabase
    .from("cover_letters")
    .select("id, tone, word_count, created_at, job_target_id, job_targets(job_title, company)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">cover letters</h1>
            <p className="text-sm text-muted-foreground mt-0.5">tailored letters for each application</p>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href="/cover-letter/new">
            <Plus className="h-4 w-4 mr-1.5" />
            new cover letter
          </Link>
        </Button>
      </div>

      {!letters || letters.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border rounded-lg">
          <p className="font-medium">no cover letters yet</p>
          <p className="text-sm mt-1">generate your first one based on any resume</p>
          <Button asChild className="mt-4" size="sm">
            <Link href="/cover-letter/new">generate one now</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {letters.map((l) => {
            const jtRaw = l.job_targets;
            const jt = (Array.isArray(jtRaw) ? jtRaw[0] : jtRaw) as { job_title: string; company?: string } | null;
            return (
              <div
                key={l.id}
                className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {jt?.job_title ?? "—"}{jt?.company ? ` @ ${jt.company}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {l.word_count} words · {formatDistanceToNow(new Date(l.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs capitalize">{l.tone}</Badge>
                  <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                    <Link href={`/cover-letter/${l.id}`}>open</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
