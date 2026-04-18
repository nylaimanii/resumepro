import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="bg-slate-900 py-24 text-center px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
          ready to land more interviews?
        </h2>
        <p className="text-slate-400 text-lg">
          free forever. no credit card. take 30 seconds to try.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white text-slate-900 hover:bg-slate-100 px-10 font-semibold w-full sm:w-auto"
        >
          <Link href="/auth/signup">get started free</Link>
        </Button>
      </div>
    </section>
  );
}
