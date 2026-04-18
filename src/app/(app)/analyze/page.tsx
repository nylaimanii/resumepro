"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UploadResult = { resume_id: string; title: string; preview: string };

export default function AnalyzePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  async function handleAnalyze() {
    if (!uploadResult) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_id: uploadResult.resume_id,
          job_title: jobTitle,
          company: company || undefined,
          job_description: jobDescription,
          job_url: jobUrl || undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 429) {
        const resetsAt = data.resets_at ? new Date(data.resets_at).toLocaleTimeString() : "tomorrow";
        toast.error(`daily limit reached — resets at ${resetsAt}`);
        return;
      }
      if (!res.ok) {
        toast.error(data.error ?? "analysis failed");
        return;
      }
      router.push(`/analysis/${data.analysis_id}`);
    } catch {
      toast.error("network error — please try again");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <h1 className="text-2xl font-bold">upload your resume</h1>

      {!uploadResult ? (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">resume title</Label>
            <Input
              id="title"
              placeholder="e.g. software engineer v3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <UploadDropzone title={title} onSuccess={setUploadResult} />
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600 text-base">resume parsed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium mb-2">{uploadResult.title}</p>
              <p className="text-xs text-muted-foreground font-mono bg-muted rounded p-2 line-clamp-3">
                {uploadResult.preview}…
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>target job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="job_title">job title <span className="text-destructive">*</span></Label>
                <Input
                  id="job_title"
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">company</Label>
                <Input
                  id="company"
                  placeholder="e.g. Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="job_description">
                  job description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="job_description"
                  placeholder="paste the full job description here…"
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="job_url">job url</Label>
                <Input
                  id="job_url"
                  type="url"
                  placeholder="https://..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleAnalyze}
                disabled={analyzing || !jobTitle.trim() || jobDescription.trim().length < 100}
              >
                {analyzing ? "analyzing…" : "analyze resume"}
              </Button>
              {jobDescription.trim().length > 0 && jobDescription.trim().length < 100 && (
                <p className="text-xs text-muted-foreground">job description must be at least 100 characters</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
