"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KeywordMatch } from "@/lib/scoring";

function groupByCategory(keywords: KeywordMatch[]) {
  return keywords.reduce<Record<string, KeywordMatch[]>>((acc, kw) => {
    const cat = kw.category ?? "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(kw);
    return acc;
  }, {});
}

export function KeywordPanel({
  matched,
  missing,
}: {
  matched: KeywordMatch[];
  missing: KeywordMatch[];
}) {
  const matchedGroups = groupByCategory(matched);
  const missingGroups = groupByCategory(missing);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              matched ({matched.length})
            </p>
            {matched.length === 0 ? (
              <p className="text-sm text-muted-foreground">no matches found</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(matchedGroups).map(([cat, kws]) => (
                  <div key={cat}>
                    <p className="text-xs text-muted-foreground capitalize mb-1.5">{cat}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {kws.map((kw) => (
                        <Badge key={kw.keyword} variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0">
                          {kw.keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
              missing from resume ({missing.length})
            </p>
            {missing.length === 0 ? (
              <p className="text-sm text-emerald-600">all job keywords present</p>
            ) : (
              <>
                <div className="space-y-3 mb-3">
                  {Object.entries(missingGroups).map(([cat, kws]) => (
                    <div key={cat}>
                      <p className="text-xs text-muted-foreground capitalize mb-1.5">{cat}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {kws.map((kw) => (
                          <Badge key={kw.keyword} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100 border-0">
                            {kw.keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  add these if you have the experience — don&apos;t fake it
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
