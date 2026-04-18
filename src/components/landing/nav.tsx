"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "features", href: "#features" },
  { label: "how it works", href: "#how-it-works" },
  { label: "demo", href: "#demo" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 100);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200 transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-slate-900 shrink-0">
          resumepro
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="ghost" size="sm" className="text-slate-700">
            <Link href="/auth/login">sign in</Link>
          </Button>
          <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
            <Link href="/auth/signup">get started free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
