"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToneSlider } from "@/components/cover-letter/tone-slider";

type Resume = { id: string; title: string };

export default function NewCoverLetterPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto p-8 text-sm text-muted-foreground">loading…</div>}>
      <NewCoverLetterForm />
    </Suspense>
  );
}

function NewCoverLetterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledResumeId = searchParams.get("resume_id") ?? "";
  const prefilledJobTargetId = searchParams.get("job_target_id") ?? "";

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeId, setResumeId] = useState(prefilledResumeId);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState(50);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch("/api/my-resumes")
      .then((r) => r.json())
      .then((d) => {
        setResumes(d.resumes ?? []);
        if (!prefilledResumeId && d.resumes?.length > 0) {
          setResumeId(d.resumes[0].id);
        }
      })
      .catch(() => toast.error("failed to load resumes"));
  }, [prefilledResumeId]);

  useEffect(() => {
    if (!prefilledJobTargetId) return;
    fetch(`/api/job-target/${prefilledJobTargetId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.job_title) setJobTitle(d.job_title);
        if (d.company) setCompany(d.company);
        if (d.job_description) setJobDescription(d.job_description);
      })
      .catch(() => {});
  }, [prefilledJobTargetId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resumeId) return toast.error("select a resume");
    if (jobDescription.length < 100) return toast.error("job description must be at least 100 characters");

    setGenerating(true);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_id: resumeId,
          job_target_id: prefilledJobTargetId || undefined,
          job_title: jobTitle,
          company,
          job_description: jobDescription,
          hiring_manager: hiringManager || undefined,
          tone,
        }),
      });
      const data = await res.json();
      if (res.status === 429) {
        toast.error("daily limit reached — try again tomorrow");
        return;
      }
      if (!res.ok) throw new Error(data.error);
      router.push(`/cover-letter/${data.cover_letter_id}`);
    } catch {
      toast.error("generation failed — please try again");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">new cover letter</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">cover letter details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="resume">resume</Label>
              <Select value={resumeId} onValueChange={setResumeId} required>
                <SelectTrigger id="resume">
                  <SelectValue placeholder="select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="jobTitle">job title</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="software engineer"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="acme corp"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hiringManager">hiring manager</Label>
              <Input
                id="hiringManager"
                value={hiringManager}
                onChange={(e) => setHiringManager(e.target.value)}
                placeholder="leave blank if unknown"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jd">job description</Label>
              <Textarea
                id="jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="paste the full job description here (min 100 chars)"
                className="min-h-[140px]"
                required
              />
            </div>

            <ToneSlider value={tone} onChange={setTone} />

            <Button type="submit" className="w-full" disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  generating…
                </>
              ) : (
                "generate cover letter"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
