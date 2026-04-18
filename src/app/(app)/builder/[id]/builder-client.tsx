"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { BuilderForm } from "@/components/builder/builder-form";
import { LivePreview } from "@/components/builder/live-preview";
import { Input } from "@/components/ui/input";
import type { ResumeData } from "@/lib/types/resume";

type Template = "modern" | "classic" | "minimal";
type SaveStatus = "idle" | "saving" | "saved" | "error";

export function BuilderClient({
  resumeId,
  title: initialTitle,
  initialData,
  needsParsing,
}: {
  resumeId: string;
  title: string;
  initialData: ResumeData;
  needsParsing: boolean;
}) {
  const [data, setData] = useState<ResumeData>(initialData);
  const [template, setTemplate] = useState<Template>("modern");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [title, setTitle] = useState(initialTitle);
  const [parsing, setParsing] = useState(needsParsing);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!needsParsing) return;
    fetch("/api/parse-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_id: resumeId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.parsed_json) setData(d.parsed_json);
        else toast.error("parsing failed — starting with blank builder");
      })
      .catch(() => toast.error("parse error"))
      .finally(() => setParsing(false));
  }, [needsParsing, resumeId]);

  const save = useCallback(
    async (d: ResumeData) => {
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/save-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume_id: resumeId, parsed_json: d }),
        });
        setSaveStatus(res.ok ? "saved" : "error");
      } catch {
        setSaveStatus("error");
      }
    },
    [resumeId]
  );

  function handleChange(d: ResumeData) {
    setData(d);
    setSaveStatus("idle");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(d), 2000);
  }

  const statusLabel = saveStatus === "saving" ? "saving…" : saveStatus === "saved" ? "saved" : saveStatus === "error" ? "save failed" : "";

  if (parsing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-sm font-medium">parsing resume…</div>
          <div className="text-xs text-muted-foreground">extracting sections with ai, one moment</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b px-4 py-2.5 flex items-center gap-3 bg-background sticky top-0 z-10">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-7 w-48 text-sm border-0 shadow-none focus-visible:ring-0 p-0 font-medium"
        />
        {statusLabel && (
          <span className={`text-xs ml-auto ${saveStatus === "error" ? "text-red-500" : "text-muted-foreground"}`}>
            {statusLabel}
          </span>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="overflow-y-auto border-r p-4 space-y-3" style={{ maxHeight: "calc(100vh - 48px)" }}>
          <BuilderForm data={data} resumeId={resumeId} onChange={handleChange} />
        </div>
        <div className="p-4 lg:sticky lg:top-12 overflow-auto" style={{ maxHeight: "calc(100vh - 48px)" }}>
          <LivePreview data={data} template={template} resumeId={resumeId} onTemplateChange={setTemplate} />
        </div>
      </div>
    </div>
  );
}
