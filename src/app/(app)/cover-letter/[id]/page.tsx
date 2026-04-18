"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CoverLetterEditor } from "@/components/cover-letter/cover-letter-editor";

type Letter = {
  id: string;
  content: string;
  word_count: number;
  tone: string;
  created_at: string;
  job_targets?: { job_title: string; company?: string } | null;
};

export default function CoverLetterPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [regenBody, setRegenBody] = useState<{
    resume_id: string;
    job_target_id?: string;
    job_title: string;
    company: string;
    job_description: string;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/cover-letter-detail/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setLetter(d.letter);
          setRegenBody(d.regen_context);
        }
      })
      .catch(() => toast.error("failed to load cover letter"));
  }, [id]);

  async function handleSave(content: string) {
    const res = await fetch(`/api/cover-letter/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("save failed");
  }

  async function handleRegenerate(tone: number) {
    if (!regenBody) return;
    const res = await fetch("/api/cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...regenBody, tone }),
    });
    if (res.status === 429) {
      toast.error("daily limit reached");
      return;
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setLetter((prev) => prev ? { ...prev, content: data.content, word_count: data.word_count, tone: data.tone } : prev);
    toast.success("cover letter regenerated");
  }

  async function handleDelete() {
    const res = await fetch(`/api/cover-letter/${id}`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      router.push("/cover-letter");
    } else {
      toast.error("delete failed");
    }
  }

  if (notFound) {
    return (
      <main className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-muted-foreground">cover letter not found</p>
        <Link href="/cover-letter" className="text-sm underline mt-2 block">back to cover letters</Link>
      </main>
    );
  }

  if (!letter) {
    return (
      <main className="max-w-2xl mx-auto p-8 text-center text-muted-foreground text-sm">
        loading…
      </main>
    );
  }

  const jt = letter.job_targets;
  const breadcrumb = jt ? `${jt.company ? jt.company + " — " : ""}${jt.job_title}` : "cover letter";

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/cover-letter" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground">cover letters</p>
          <h1 className="text-lg font-semibold">{breadcrumb}</h1>
        </div>
      </div>

      <CoverLetterEditor
        letter={letter}
        onSave={handleSave}
        onRegenerate={handleRegenerate}
        onDelete={handleDelete}
      />
    </main>
  );
}
