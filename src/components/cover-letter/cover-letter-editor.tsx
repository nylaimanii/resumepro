"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ToneSlider } from "@/components/cover-letter/tone-slider";

type Letter = {
  id: string;
  content: string;
  word_count: number;
  tone: string;
  created_at: string;
};

export function CoverLetterEditor({
  letter: initial,
  onSave,
  onRegenerate,
  onDelete,
}: {
  letter: Letter;
  onSave: (content: string) => Promise<void>;
  onRegenerate: (tone: number) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [content, setContent] = useState(initial.content);
  const [wordCount, setWordCount] = useState(initial.word_count);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenTone, setRegenTone] = useState(
    initial.tone === "formal" ? 0 : initial.tone === "conversational" ? 100 : 50
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (val: string) => {
      setContent(val);
      setWordCount(val.split(/\s+/).filter(Boolean).length);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        onSave(val).catch(() => toast.error("autosave failed"));
      }, 2000);
    },
    [onSave]
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleExportPdf() {
    try {
      const res = await fetch("/api/export-cover-letter-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cover_letter_id: initial.id }),
      });
      if (!res.ok) throw new Error("pdf failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cover-letter.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("pdf export failed");
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      await onRegenerate(regenTone);
    } catch {
      toast.error("regeneration failed");
    } finally {
      setRegenerating(false);
    }
  }

  const minRead = Math.ceil(wordCount / 200);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {wordCount} words · ~{minRead} min read
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {initial.tone}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "copied" : "copy"}
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={handleExportPdf}>
              <Download className="h-3 w-3" />
              export pdf
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                  delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>delete cover letter?</AlertDialogTitle>
                  <AlertDialogDescription>
                    this cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={onDelete}
                  >
                    delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[420px] font-serif text-sm leading-relaxed resize-none"
          placeholder="your cover letter will appear here..."
        />

        <div className="border-t pt-4 space-y-3">
          <ToneSlider value={regenTone} onChange={setRegenTone} />
          <Button
            className="w-full"
            variant="outline"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            {regenerating ? "regenerating…" : "regenerate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
