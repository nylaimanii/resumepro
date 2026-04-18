const SECTION_PATTERNS: { name: string; pattern: RegExp; weight: number }[] = [
  { name: "experience",  pattern: /\b(experience|employment|work history|professional experience)\b/i, weight: 3 },
  { name: "education",   pattern: /\b(education|academic)\b/i, weight: 3 },
  { name: "skills",      pattern: /\b(skills|technologies|technical skills|tech stack)\b/i, weight: 3 },
  { name: "summary",     pattern: /\b(summary|profile|objective|about)\b/i, weight: 0.5 },
  { name: "projects",    pattern: /\b(projects|personal projects|side projects)\b/i, weight: 0.5 },
];

const MAX_WEIGHT = 10;

export function scoreSections(resumeText: string): {
  score: number;
  sections_found: string[];
  sections_missing: string[];
} {
  const found: string[] = [];
  const missing: string[] = [];
  let totalWeight = 0;

  for (const section of SECTION_PATTERNS) {
    if (section.pattern.test(resumeText)) {
      found.push(section.name);
      totalWeight += section.weight;
    } else {
      missing.push(section.name);
    }
  }

  const score = Math.round((totalWeight / MAX_WEIGHT) * 100);
  return { score, sections_found: found, sections_missing: missing };
}
