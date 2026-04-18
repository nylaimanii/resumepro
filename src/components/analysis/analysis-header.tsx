"use client";

import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

export function AnalysisHeader({
  resumeTitle,
  jobTitle,
  company,
  createdAt,
}: {
  resumeTitle: string;
  jobTitle: string;
  company?: string;
  createdAt: string;
}) {
  const ago = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-1.5 text-sm font-medium flex-wrap">
          <span>{resumeTitle}</span>
          <span className="text-muted-foreground">for</span>
          <span>{jobTitle}</span>
          {company && (
            <>
              <span className="text-muted-foreground">@</span>
              <span>{company}</span>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">analyzed {ago}</p>
      </div>
      <Button variant="ghost" size="sm" disabled className="text-xs shrink-0" title="coming soon">
        re-analyze
      </Button>
    </div>
  );
}
