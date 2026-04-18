export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[*_~`#>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function getBullets(resumeText: string): string[] {
  const lines = resumeText.split(/\n/);
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isBulletMarker = /^[•\-\*\u2022\u25aa\u25cf]/.test(trimmed);
    if (isBulletMarker) {
      bullets.push(trimmed.replace(/^[•\-\*\u2022\u25aa\u25cf]\s*/, "").trim());
      continue;
    }

    const words = trimmed.split(/\s+/);
    const startsWithCap = /^[A-Z]/.test(trimmed);
    if (startsWithCap && words.length >= 5 && words.length <= 40) {
      bullets.push(trimmed);
    }
  }

  return bullets.filter((b) => b.length > 0);
}

export function hasNumber(text: string): boolean {
  return /\d/.test(text);
}

export function hasPercentage(text: string): boolean {
  return /%|\bpercent\b/i.test(text);
}

export function hasDollarAmount(text: string): boolean {
  return /\$|\busd\b|\bdollars?\b/i.test(text);
}

export function startsWithVerb(bullet: string, verbs: string[]): boolean {
  const stripped = bullet.replace(/^[•\-\*\u2022\u25aa\u25cf]\s*/, "").trim();
  const firstWord = stripped.split(/\s+/)[0]?.toLowerCase() ?? "";
  return verbs.includes(firstWord);
}
