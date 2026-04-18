import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-20 lg:py-32 text-center space-y-8">
      <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full">
        ✨ now with ai-powered analysis
      </div>

      <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.08]">
        the resume tool that actually tells you what&apos;s wrong
      </h1>

      <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        ats scoring based on real metrics. ai suggestions you can apply with one click. free, forever.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
          <Link href="/auth/signup">get started free</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8">
          <a href="#demo">try the demo</a>
        </Button>
      </div>

      <p className="text-sm text-slate-400">
        deterministic scoring · 6 measurable factors · no credit card required
      </p>
    </section>
  );
}
