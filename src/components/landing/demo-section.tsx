"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "@/components/analysis/score-gauge";
import { scoreResume } from "@/lib/scoring";

const SAMPLE_RESUME = `John Smith
Software Engineer | john@example.com | San Francisco, CA

EXPERIENCE
Senior Engineer, Acme Corp (2021-present)
- Built microservices architecture
- Worked on the team
- Helped with deployments

Engineer, StartupCo (2019-2021)
- Developed features
- Fixed bugs

EDUCATION
B.S. Computer Science, State University, 2019

SKILLS
JavaScript, React, Node.js`;

const SAMPLE_JD = `Senior Software Engineer — Backend Focus

We are looking for a senior software engineer to join our platform team.

Requirements:
- 4+ years of experience in backend engineering
- Strong proficiency in TypeScript, Node.js, and Python
- Experience with microservices architecture and distributed systems
- Familiarity with AWS, Docker, and Kubernetes
- Strong SQL skills and experience with PostgreSQL
- Experience with CI/CD pipelines and DevOps practices
- Excellent communication and collaboration skills

Nice to have:
- Experience with React or similar frontend frameworks
- Contributions to open source projects`;

type DemoResult = {
  score: number;
  redFlags: { message: string; severity: string }[];
};

export function DemoSection() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<DemoResult | null>(null);

  function runDemo() {
    const r = resume.trim() || SAMPLE_RESUME;
    const j = jd.trim() || SAMPLE_JD;
    const out = scoreResume(r, j);
    setResult({
      score: out.ats_score,
      redFlags: out.red_flags.slice(0, 3),
    });
  }

  function useSample() {
    setResume(SAMPLE_RESUME);
    setJd(SAMPLE_JD);
  }

  return (
    <section id="demo" className="max-w-4xl mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
          try it without signing up
        </h2>
        <p className="text-slate-500">
          paste your resume + a job description. scoring runs in your browser — no api call, no account.
        </p>
      </div>

      <Card className="border-slate-200 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-sm font-semibold text-slate-700">sample inputs</CardTitle>
            <button
              onClick={useSample}
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors underline underline-offset-2 text-left sm:text-right"
            >
              use sample data
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">resume excerpt</label>
              <Textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="paste your resume text here (or leave blank to use sample data)"
                className="min-h-[180px] text-xs font-mono resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">job description</label>
              <Textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="paste the job description here (or leave blank to use sample data)"
                className="min-h-[180px] text-xs font-mono resize-none"
              />
            </div>
          </div>

          <Button
            onClick={runDemo}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
          >
            see a sample score
          </Button>

          {result && (
            <div className="border-t border-slate-100 pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <ScoreGauge score={result.score} size={160} />
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-semibold text-slate-800">top issues found</p>
                  {result.redFlags.length === 0 ? (
                    <p className="text-sm text-slate-500">no major red flags — nice work.</p>
                  ) : (
                    <ul className="space-y-2">
                      {result.redFlags.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Badge
                            variant="secondary"
                            className={`text-xs shrink-0 mt-0.5 ${
                              f.severity === "high"
                                ? "bg-red-50 text-red-700"
                                : f.severity === "medium"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {f.severity}
                          </Badge>
                          <span className="text-sm text-slate-700">{f.message}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center space-y-3">
                <p className="text-sm font-medium text-slate-800">
                  sign up to see the full analysis + ai suggestions
                </p>
                <p className="text-xs text-slate-500">
                  keyword gaps, actionable rewrites, cover letter generation — all free.
                </p>
                <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                  <Link href="/auth/signup">get the full analysis →</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
