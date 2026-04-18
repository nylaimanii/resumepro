"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, PenLine, X } from "lucide-react";
import { BuilderForm } from "@/components/builder/builder-form";
import { LivePreview } from "@/components/builder/live-preview";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ResumeData } from "@/lib/types/resume";

type Template = "modern" | "classic" | "minimal";
type SaveStatus = "idle" | "saving" | "saved" | "error";
type MobileTab = "edit" | "preview";

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
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const [bannerDismissed, setBannerDismissed] = useState(false);
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
      {/* desktop banner */}
      {!bannerDismissed && (
        <div className="lg:hidden bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-3">
          <p className="text-xs text-amber-800">builder works best on desktop — switch to a larger screen for live preview</p>
          <button
            onClick={() => setBannerDismissed(true)}
            aria-label="dismiss banner"
            className="text-amber-600 hover:text-amber-900 shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* top bar */}
      <div className="border-b px-4 py-2.5 flex items-center gap-3 bg-background sticky top-0 z-10">
        <Link href="/dashboard" aria-label="back to dashboard" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-7 w-36 sm:w-48 text-sm border-0 shadow-none focus-visible:ring-0 p-0 font-medium"
        />
        <div className="ml-auto flex items-center gap-2">
          {statusLabel && (
            <span className={`text-xs ${saveStatus === "error" ? "text-red-500" : "text-muted-foreground"}`}>
              {statusLabel}
            </span>
          )}
          <Link
            href={`/cover-letter/new?resume_id=${resumeId}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <PenLine className="h-3.5 w-3.5" />
            write cover letter
          </Link>
        </div>
      </div>

      {/* mobile tab switcher */}
      <div className="lg:hidden flex border-b bg-background">
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-none h-9 text-xs font-medium ${mobileTab === "edit" ? "border-b-2 border-foreground" : "text-muted-foreground"}`}
          onClick={() => setMobileTab("edit")}
        >
          edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-none h-9 text-xs font-medium ${mobileTab === "preview" ? "border-b-2 border-foreground" : "text-muted-foreground"}`}
          onClick={() => setMobileTab("preview")}
        >
          preview
        </Button>
      </div>

      {/* panels */}
      <div className="flex-1 lg:grid lg:grid-cols-2 gap-0">
        <div
          className={`${mobileTab === "edit" ? "block" : "hidden"} lg:block overflow-y-auto border-r p-4 space-y-3`}
          style={{ maxHeight: "calc(100vh - 88px)" }}
        >
          <BuilderForm data={data} resumeId={resumeId} onChange={handleChange} />
        </div>
        <div
          className={`${mobileTab === "preview" ? "block" : "hidden"} lg:block p-4 lg:sticky lg:top-12 overflow-auto`}
          style={{ maxHeight: "calc(100vh - 88px)" }}
        >
          <LivePreview data={data} template={template} resumeId={resumeId} onTemplateChange={setTemplate} />
        </div>
      </div>
    </div>
  );
}
