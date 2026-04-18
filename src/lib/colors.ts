export function scoreColor(score: number): {
  text: string;
  bg: string;
  ring: string;
  label: string;
} {
  if (score >= 80) return { text: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-500", label: "strong" };
  if (score >= 60) return { text: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-500", label: "ok" };
  return { text: "text-red-600", bg: "bg-red-50", ring: "ring-red-500", label: "weak" };
}
