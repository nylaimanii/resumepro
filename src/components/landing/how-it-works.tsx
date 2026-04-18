const STEPS = [
  {
    n: 1,
    title: "upload",
    description: "drop in your pdf or docx. we extract the text.",
  },
  {
    n: 2,
    title: "target a job",
    description: "paste the job description or a job url.",
  },
  {
    n: 3,
    title: "get your score",
    description: "six metrics, explained. see exactly what to fix.",
  },
  {
    n: 4,
    title: "apply + export",
    description: "one-click fixes, then download an ats-clean pdf.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">how it works</h2>
          <p className="text-slate-500">from upload to ats-ready in under two minutes.</p>
        </div>

        <div className="relative flex flex-col md:flex-row gap-8 md:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex-1 flex flex-col md:items-center relative">
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[calc(50%+20px)] right-0 h-px bg-slate-200 z-0" />
              )}
              <div className="flex md:flex-col md:items-center gap-4 md:gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-slate-900">{step.n}</span>
                </div>
                <div className="md:text-center">
                  <h3 className="font-semibold text-slate-900 text-sm">{step.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 max-w-[160px]">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
