import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">404</p>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">page not found</h1>
        <p className="text-slate-500 max-w-sm">
          this page doesn&apos;t exist or may have been moved.
        </p>
      </div>
      <Button asChild variant="outline" className="border-slate-300">
        <Link href="/">back to home</Link>
      </Button>
    </main>
  );
}
