"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TemplateModern } from "./templates/template-modern";
import { TemplateClassic } from "./templates/template-classic";
import { TemplateMinimal } from "./templates/template-minimal";
import type { ResumeData } from "@/lib/types/resume";

type Template = "modern" | "classic" | "minimal";

const TEMPLATES: { id: Template; label: string }[] = [
  { id: "modern", label: "modern" },
  { id: "classic", label: "classic" },
  { id: "minimal", label: "minimal" },
];

export function LivePreview({
  data,
  template,
  resumeId,
  onTemplateChange,
}: {
  data: ResumeData;
  template: Template;
  resumeId: string;
  onTemplateChange: (t: Template) => void;
}) {
  const [downloading, setDownloading] = useState(false);

  async function downloadPdf() {
    setDownloading(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, template }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "pdf export failed");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.personal.name || "resume"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("pdf export failed");
    } finally {
      setDownloading(false);
    }
  }

  const TemplateComponent = template === "classic" ? TemplateClassic : template === "minimal" ? TemplateMinimal : TemplateModern;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Tabs value={template} onValueChange={(v) => onTemplateChange(v as Template)}>
          <TabsList className="h-8">
            {TEMPLATES.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="text-xs px-3 h-6">{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={downloadPdf} disabled={downloading}>
          <Download className="h-3.5 w-3.5" />
          {downloading ? "generating…" : "download pdf"}
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto bg-gray-100 dark:bg-gray-900" style={{ height: "calc(100vh - 200px)" }}>
        <div style={{ transform: "scale(0.72)", transformOrigin: "top left", width: "138.9%", pointerEvents: "none" }}>
          <TemplateComponent data={data} />
        </div>
      </div>
    </div>
  );
}
