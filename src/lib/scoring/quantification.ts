import { getBullets, hasNumber, hasPercentage, hasDollarAmount } from "./utils";

function isQuantified(bullet: string): boolean {
  if (hasPercentage(bullet) || hasDollarAmount(bullet)) return true;
  if (hasNumber(bullet)) return true;
  if (/\b\d+x\b|\btimes\b|\bfold\b/i.test(bullet)) return true;
  return false;
}

export function scoreQuantification(resumeText: string): {
  score: number;
  bullets_with_metrics: number;
  total_bullets: number;
  unquantified_bullets: string[];
} {
  const bullets = getBullets(resumeText);

  if (bullets.length < 3) {
    return { score: 50, bullets_with_metrics: 0, total_bullets: bullets.length, unquantified_bullets: [] };
  }

  const quantified = bullets.filter(isQuantified);
  const unquantified = bullets.filter((b) => !isQuantified(b));

  const score = Math.round((quantified.length / bullets.length) * 100);

  return {
    score,
    bullets_with_metrics: quantified.length,
    total_bullets: bullets.length,
    unquantified_bullets: unquantified.slice(0, 5).map((b) => b.slice(0, 120)),
  };
}
