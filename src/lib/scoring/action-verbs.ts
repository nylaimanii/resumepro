import { getBullets, startsWithVerb } from "./utils";
import { ACTION_VERBS } from "./skill-taxonomy";

export function scoreActionVerbs(resumeText: string): {
  score: number;
  strong_bullets: number;
  total_bullets: number;
  weak_bullet_starts: string[];
} {
  const bullets = getBullets(resumeText);

  if (bullets.length < 3) {
    return { score: 50, strong_bullets: 0, total_bullets: bullets.length, weak_bullet_starts: [] };
  }

  const strong = bullets.filter((b) => startsWithVerb(b, ACTION_VERBS));
  const weak = bullets.filter((b) => !startsWithVerb(b, ACTION_VERBS));

  const score = Math.round((strong.length / bullets.length) * 100);

  return {
    score,
    strong_bullets: strong.length,
    total_bullets: bullets.length,
    weak_bullet_starts: weak.slice(0, 5).map((b) => b.slice(0, 100)),
  };
}
