import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1 space-y-2">
            <p className="font-semibold text-slate-900">resumepro</p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[180px]">
              the resume tool that actually tells you what&apos;s wrong.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wide">product</p>
            <ul className="space-y-1.5">
              {[
                { label: "features", href: "#features" },
                { label: "demo", href: "#demo" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wide">legal</p>
            <ul className="space-y-1.5">
              {[
                { label: "privacy", href: "#" },
                { label: "terms", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wide">built by</p>
            <a
              href="https://nyla-portfolio-xi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              nyla
            </a>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400">© 2026 resumepro. all rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
