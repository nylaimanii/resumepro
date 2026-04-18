"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">something went wrong</h1>
        {error.message && (
          <p className="text-sm text-slate-400 font-mono max-w-md">{error.message}</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline" className="border-slate-300">
          try again
        </Button>
        <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white">
          <Link href="/dashboard">back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
