import { Gauge, GitCompare, FileDown, Mail, Zap, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Gauge,
    title: "deterministic ats scoring",
    description:
      "every score comes from measurable factors — keyword match, quantified impact, action verbs, structure. no black box.",
  },
  {
    icon: GitCompare,
    title: "before / after diffs",
    description:
      "ai doesn't just tell you a bullet is weak. it shows you the original next to the improved version, one click to apply.",
  },
  {
    icon: FileDown,
    title: "real pdf export",
    description:
      "ats-parseable pdfs that real applicant tracking systems can read. single-column templates only.",
  },
  {
    icon: Mail,
    title: "tailored cover letters",
    description:
      "generate cover letters tied to your resume + job description. tone slider controls the voice.",
  },
  {
    icon: Zap,
    title: "smart caching",
    description:
      "re-analyze the same resume + job in under a second. we cache results so you're not waiting on ai every time.",
  },
  {
    icon: Lock,
    title: "private by default",
    description:
      "row-level security on every table. your resumes never touch another user's account.",
  },
];

export function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 py-20 space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
          built for people who actually want the job
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          every feature has a reason. nothing here is filler.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.title} className="border-slate-200 shadow-none">
              <CardContent className="pt-6 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Icon className="h-4.5 w-4.5 text-slate-700" size={18} />
                </div>
                <h3 className="font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
