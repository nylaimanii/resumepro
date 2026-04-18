"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AISummary({ summary, cached }: { summary: string; cached?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-slate-500" />
            ai summary
          </CardTitle>
          {cached && (
            <Badge variant="secondary" className="text-xs text-muted-foreground">
              cached result
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
