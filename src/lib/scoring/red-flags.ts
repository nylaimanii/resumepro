import { WEAK_PHRASES, FILLER_WORDS } from "./skill-taxonomy";
import { getBullets } from "./utils";

export type RedFlag = {
  type: "vague_phrase" | "weak_start" | "unquantified_bullet" | "filler_word" | "passive_voice" | "buzzword";
  severity: "low" | "medium" | "high";
  message: string;
  excerpt?: string;
};

export function detectRedFlags(resumeText: string): RedFlag[] {
  const flags: RedFlag[] = [];
  const lower = resumeText.toLowerCase();

  for (const phrase of WEAK_PHRASES) {
    if (lower.includes(phrase)) {
      flags.push({
        type: "vague_phrase",
        severity: "medium",
        message: `vague phrase detected: "${phrase}"`,
        excerpt: phrase,
      });
    }
    if (flags.length >= 10) return flags;
  }

  const fillerFound = FILLER_WORDS.filter((w) => {
    const pattern = new RegExp(`\\b${w}\\b`, "i");
    return pattern.test(resumeText);
  });
  if (fillerFound.length > 0) {
    flags.push({
      type: "filler_word",
      severity: "low",
      message: `found ${fillerFound.length} filler word${fillerFound.length > 1 ? "s" : ""}: ${fillerFound.join(", ")}`,
    });
  }
  if (flags.length >= 10) return flags;

  const passivePatterns = [
    /was \w+ed by/gi,
    /were \w+ed by/gi,
    /is being \w+ed/gi,
    /has been \w+ed/gi,
    /had been \w+ed/gi,
  ];
  for (const pattern of passivePatterns) {
    const matches = resumeText.match(pattern);
    if (matches) {
      flags.push({
        type: "passive_voice",
        severity: "medium",
        message: `passive voice detected: "${matches[0]}" — rewrite with an active action verb`,
        excerpt: matches[0],
      });
      if (flags.length >= 10) return flags;
    }
  }

  const bullets = getBullets(resumeText);
  const unquantified = bullets.filter((b) => !/\d|%|\$|\bpercent\b/i.test(b)).slice(0, 3);
  for (const bullet of unquantified) {
    flags.push({
      type: "unquantified_bullet",
      severity: "high",
      message: "bullet lacks measurable impact — add numbers, percentages, or scale",
      excerpt: bullet.slice(0, 100),
    });
    if (flags.length >= 10) return flags;
  }

  return flags;
}
