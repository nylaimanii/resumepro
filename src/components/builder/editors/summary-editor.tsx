"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SectionEditor } from "../section-editor";

export function SummaryEditor({
  summary,
  resumeId,
  jobTitle,
  onChange,
}: {
  summary: string;
  resumeId: string;
  jobTitle?: string;
  onChange: (s: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleAI() {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, job_title: jobTitle || "Professional" }),
      });
      const data = await res.json();
      if (data.summary) onChange(data.summary);
      else toast.error(data.error ?? "summary generation failed");
    } catch {
      toast.error("network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionEditor title="Summary">
      <div className="space-y-2">
        <Textarea
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="A brief professional summary…"
          rows={4}
          maxLength={500}
          className="text-sm resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{summary.length}/500</span>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={handleAI} disabled={loading}>
            <Sparkles className="h-3 w-3" />
            {loading ? "writing…" : "write with ai"}
          </Button>
        </div>
      </div>
    </SectionEditor>
  );
}
