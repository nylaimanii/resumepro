import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TEMPLATES = [
  { id: "modern", name: "modern", description: "clean sans-serif, thin rules, uppercase section labels. best for tech and product roles.", tag: "most popular" },
  { id: "classic", name: "classic", description: "serif body, centered header, horizontal rules. best for finance, consulting, and law.", tag: "traditional" },
  { id: "minimal", name: "minimal", description: "maximum whitespace, small caps labels, no decoration. best for design and creative roles.", tag: "minimal" },
] as const;

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: latestResume } = await supabase
    .from("resumes")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">templates</h1>
          <p className="text-sm text-muted-foreground">all templates are single-column and ats-safe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TEMPLATES.map((t) => (
          <Card key={t.id}>
            <CardHeader className="pb-2">
              <div className="h-32 bg-muted rounded-md flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-muted-foreground/30 uppercase tracking-widest">{t.name}</span>
              </div>
              <CardTitle className="text-base capitalize flex items-center justify-between">
                {t.name}
                <span className="text-xs font-normal text-muted-foreground">{t.tag}</span>
              </CardTitle>
              <CardDescription className="text-xs">{t.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              {latestResume ? (
                <Button asChild className="w-full" size="sm" variant="outline">
                  <Link href={`/builder/${latestResume.id}?template=${t.id}`}>
                    use this template
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full" size="sm" variant="outline">
                  <Link href="/analyze">upload resume first</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
