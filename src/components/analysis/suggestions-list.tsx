"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SuggestionCard } from "./suggestion-card";
import type { Suggestion } from "@/lib/groq/analyze";

type Status = "pending" | "applied" | "skipped";
type Filter = "all" | "high" | "medium" | "low";

const ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function SuggestionsList({ suggestions }: { suggestions: Suggestion[] }) {
  const [states, setStates] = useState<Record<string, Status>>(() =>
    Object.fromEntries(suggestions.map((s) => [s.id, "pending"]))
  );
  const [filter, setFilter] = useState<Filter>("all");

  function apply(s: Suggestion) {
    setStates((p) => ({ ...p, [s.id]: "applied" }));
    toast.success("applied — you can edit in the builder");
  }

  function skip(s: Suggestion) {
    setStates((p) => ({ ...p, [s.id]: p[s.id] === "applied" ? "pending" : "skipped" }));
  }

  const sorted = [...suggestions].sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);
  const filtered = filter === "all" ? sorted : sorted.filter((s) => s.severity === filter);

  const countBySeverity = (sev: Filter) =>
    sev === "all" ? suggestions.length : suggestions.filter((s) => s.severity === sev).length;

  const appliedCount = Object.values(states).filter((s) => s === "applied").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList className="h-8">
            {(["all", "high", "medium", "low"] as Filter[]).map((f) => (
              <TabsTrigger key={f} value={f} className="text-xs gap-1.5 px-3 h-6">
                {f}
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
                  {countBySeverity(f)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <span className="text-xs text-muted-foreground">
          applied {appliedCount} of {suggestions.length}
        </span>
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <SuggestionCard
            key={s.id}
            suggestion={s}
            onApply={apply}
            onSkip={skip}
            applied={states[s.id] === "applied"}
            skipped={states[s.id] === "skipped"}
          />
        ))}
      </div>
    </div>
  );
}
