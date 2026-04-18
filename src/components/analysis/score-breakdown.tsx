"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { scoreColor } from "@/lib/colors";
import type { ScoreBreakdown } from "@/lib/types/database";

const ROWS: { key: keyof ScoreBreakdown; label: string; weight: string }[] = [
  { key: "keyword_coverage",    label: "keyword match",      weight: "30%" },
  { key: "quantification",      label: "quantified impact",  weight: "20%" },
  { key: "action_verbs",        label: "action verbs",       weight: "15%" },
  { key: "section_completeness",label: "structure",          weight: "15%" },
  { key: "length",              label: "length",             weight: "10%" },
  { key: "parseability",        label: "parseability",       weight: "10%" },
];

export function ScoreBreakdown({ breakdown }: { breakdown: ScoreBreakdown }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">score breakdown</CardTitle>
        <CardDescription>how each factor contributes to your total</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {ROWS.map(({ key, label, weight }) => {
          const score = breakdown[key];
          const colors = scoreColor(score);
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{weight}</span>
                </div>
                <span className={`font-semibold tabular-nums ${colors.text}`}>{score}</span>
              </div>
              <Progress value={score} className="h-1.5" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
