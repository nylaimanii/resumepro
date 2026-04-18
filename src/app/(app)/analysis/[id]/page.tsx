import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!analysis) redirect("/dashboard");

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>analysis result — ats score: {analysis.ats_score}/100</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto bg-muted rounded p-4 max-h-[70vh]">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </main>
  );
}
