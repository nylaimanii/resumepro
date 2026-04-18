"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type UploadResult = { resume_id: string; title: string; preview: string };

interface Props {
  onSuccess: (data: UploadResult) => void;
  title: string;
  disabled?: boolean;
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} kb`
    : `${(bytes / 1024 / 1024).toFixed(1)} mb`;
}

export function UploadDropzone({ onSuccess, title, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  function validate(f: File) {
    if (!ALLOWED_TYPES.includes(f.type)) {
      toast.error("only pdf and docx files are supported");
      return false;
    }
    if (f.size > MAX_SIZE) {
      toast.error("file exceeds 10mb limit");
      return false;
    }
    return true;
  }

  function pickFile(f: File) {
    if (validate(f)) setFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) pickFile(f);
  }

  async function handleUpload() {
    if (!file || !title.trim()) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title.trim());
    try {
      const res = await fetch("/api/upload-resume", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "upload failed");
        return;
      }
      onSuccess(data);
    } catch {
      toast.error("network error — please try again");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-lg border-2 border-dashed p-6 sm:p-12 text-center cursor-pointer transition-colors",
          dragOver && "border-primary bg-accent/10",
          file && !uploading && "border-green-500 bg-green-50 dark:bg-green-950/20",
          uploading && "opacity-60 cursor-not-allowed",
          !file && !dragOver && "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <Check className="h-8 w-8 text-green-500" />
            <p className="font-medium text-sm">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
            {!uploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-sm">drop resume here or click to browse</p>
            <p className="text-xs text-muted-foreground">pdf or docx · max 10mb</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
      />

      {file && (
        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={uploading || !title.trim() || disabled}
        >
          {uploading ? "uploading + parsing…" : "upload + parse resume"}
        </Button>
      )}
    </div>
  );
}
