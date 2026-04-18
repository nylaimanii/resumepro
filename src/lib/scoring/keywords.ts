import { SKILL_TAXONOMY } from "./skill-taxonomy";
import { normalize } from "./utils";

export type KeywordMatch = {
  keyword: string;
  category: string;
  found_in_resume: boolean;
  count_in_resume: number;
  count_in_jd: number;
};

function countOccurrences(text: string, keyword: string): number {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped}\\b`, "gi");
  return (text.match(pattern) ?? []).length;
}

export function extractKeywords(text: string): string[] {
  const normalized = normalize(text);
  const found: string[] = [];

  for (const [, skills] of Object.entries(SKILL_TAXONOMY)) {
    for (const skill of skills as readonly string[]) {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`\\b${escaped}\\b`, "i");
      if (pattern.test(normalized) && !found.includes(skill)) {
        found.push(skill);
      }
    }
  }

  return found.sort();
}

export function matchKeywords(
  resumeText: string,
  jdText: string
): { matched: KeywordMatch[]; missing: KeywordMatch[]; score: number } {
  const resumeNorm = normalize(resumeText);
  const jdNorm = normalize(jdText);
  const jdKeywords = extractKeywords(jdText);

  if (jdKeywords.length === 0) {
    return { matched: [], missing: [], score: 50 };
  }

  const matched: KeywordMatch[] = [];
  const missing: KeywordMatch[] = [];

  for (const keyword of jdKeywords) {
    const category =
      (Object.entries(SKILL_TAXONOMY).find(([, skills]) =>
        (skills as readonly string[]).includes(keyword)
      )?.[0]) ?? "other";

    const countInResume = countOccurrences(resumeNorm, keyword);
    const countInJd = countOccurrences(jdNorm, keyword);
    const entry: KeywordMatch = {
      keyword,
      category,
      found_in_resume: countInResume > 0,
      count_in_resume: countInResume,
      count_in_jd: countInJd,
    };

    if (countInResume > 0) {
      matched.push(entry);
    } else {
      missing.push(entry);
    }
  }

  const score = Math.round((matched.length / jdKeywords.length) * 100);
  return { matched, missing, score };
}
