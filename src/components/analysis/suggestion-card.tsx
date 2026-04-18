"use client";

import { ArrowDown, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Suggestion } from "@/lib/groq/analyze";

const severityStyle: Record<string, string> = {
  high:   "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low:    "bg-slate-50 text-slate-600 border-slate-200",
};

export function SuggestionCard({
  suggestion,
  onApply,
  onSkip,
  applied,
  skipped,
}: {
  suggestion: Suggestion;
  onApply: (s: Suggestion) => void;
  onSkip: (s: Suggestion) => void;
  applied?: boolean;
  skipped?: boolean;
}) {
  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2.5">
        <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
          <Check className="h-3.5 w-3.5" />
          applied: {suggestion.title}
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onSkip(suggestion)}>
          undo
        </Button>
      </div>
    );
  }

  if (skipped) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-muted/50 border px-4 py-2.5">
        <span className="text-sm text-muted-foreground line-through">{suggestion.title}</span>
        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onApply(suggestion)}>
          undo
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="pt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={`text-xs border ${severityStyle[suggestion.severity]}`} variant="outline">
            {suggestion.severity}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {suggestion.category}
          </Badge>
          <span className="text-sm font-semibold">{suggestion.title}</span>
        </div>

        <p className="text-sm text-muted-foreground">{suggestion.description}</p>

        {suggestion.original && suggestion.improved ? (
          <div className="space-y-1.5 rounded-md overflow-hidden border text-xs font-mono">
            <div className="bg-red-50 dark:bg-red-950/20 px-3 py-2 text-red-700 dark:text-red-400">
              <span className="text-xs font-sans font-semibold text-red-500 uppercase tracking-wide block mb-1">original</span>
              {suggestion.original}
            </div>
            <div className="flex justify-center py-1 bg-muted/30">
              <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 text-emerald-700 dark:text-emerald-400">
              <span className="text-xs font-sans font-semibold text-emerald-600 uppercase tracking-wide block mb-1">improved</span>
              {suggestion.improved}
            </div>
          </div>
        ) : null}

        <div className="flex justify-end gap-2 pt-1">
          {suggestion.original && suggestion.improved ? (
            <>
              <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => onSkip(suggestion)}>
                skip
              </Button>
              <Button size="sm" className="text-xs h-8 gap-1.5" onClick={() => onApply(suggestion)}>
                <Check className="h-3 w-3" /> apply
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => onSkip(suggestion)}>
              got it
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
