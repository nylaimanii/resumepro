"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type UploadResult = { resume_id: string; title: string; preview: string };

export default function AnalyzePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">upload your resume</h1>

      {!result ? (
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
          <UploadDropzone title={title} onSuccess={setResult} />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">parsed successfully</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-medium">{result.title}</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono bg-muted rounded p-3">
              {result.preview}…
            </p>
            <Button onClick={() => router.push(`/analyze/${result.resume_id}/job`)}>
              continue →
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
