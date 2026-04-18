"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RedFlag } from "@/lib/scoring";

const severityDot: Record<RedFlag["severity"], string> = {
  high:   "bg-red-500",
  medium: "bg-amber-500",
  low:    "bg-slate-400",
};

export function RedFlags({ flags }: { flags: RedFlag[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? flags : flags.slice(0, 5);
  const hidden = flags.length - 5;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          red flags
          {flags.length > 0 && (
            <Badge variant="destructive" className="text-xs">{flags.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {flags.length === 0 ? (
          <div className="flex items-center gap-2 text-emerald-600 py-2">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">no red flags detected</span>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((flag, i) => (
              <div key={i} className="flex gap-3">
                <span className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${severityDot[flag.severity]}`} />
                <div className="min-w-0">
                  <p className="text-sm">{flag.message}</p>
                  {flag.excerpt && (
                    <blockquote className="mt-1 border-l-2 border-muted pl-3 text-xs italic text-muted-foreground">
                      {flag.excerpt}
                    </blockquote>
                  )}
                </div>
              </div>
            ))}
            {!showAll && hidden > 0 && (
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowAll(true)}>
                show {hidden} more
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
