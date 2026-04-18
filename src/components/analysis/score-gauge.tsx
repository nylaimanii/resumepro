"use client";

import { useEffect, useState } from "react";
import { scoreColor } from "@/lib/colors";
import { Badge } from "@/components/ui/badge";

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreGauge({ score, size = 200 }: { score: number; size?: number }) {
  const [animated, setAnimated] = useState(false);
  const colors = scoreColor(score);
  const offset = CIRCUMFERENCE * (1 - (animated ? score : 0) / 100);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, []);

  const strokeColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="16" />
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 800ms ease-out" }}
        />
        <text x="100" y="95" textAnchor="middle" dominantBaseline="middle" className="font-bold" fontSize="36" fontWeight="700" fill="currentColor">
          {score}
        </text>
        <text x="100" y="120" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#6b7280">
          ats score
        </text>
      </svg>
      <Badge
        variant="secondary"
        className={`${colors.text} ${colors.bg} border-0 capitalize`}
      >
        {colors.label}
      </Badge>
    </div>
  );
}
