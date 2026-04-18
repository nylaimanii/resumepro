export function scoreParseability(resumeText: string): {
  score: number;
  issues: string[];
} {
  const issues: string[] = [];

  if (!resumeText || resumeText.trim().length < 100) {
    return { score: 0, issues: ["resume text is too short or empty"] };
  }

  const letters = (resumeText.match(/[a-zA-Z]/g) ?? []).length;
  const specials = (resumeText.match(/[^a-zA-Z0-9\s.,!?;:'"()\-]/g) ?? []).length;
  if (letters > 0 && specials / letters > 0.3) {
    issues.push("special characters may indicate tables or columns — ATS parsers struggle with these");
  }

  const lines = resumeText.split(/\n/);
  const tabbedLines = lines.filter((l) => (l.match(/\t/g) ?? []).length >= 2).length;
  if (tabbedLines > 3) {
    issues.push("tabbed columns detected — use single-column layout for better ATS compatibility");
  }

  const decorative = /[■▪◆▸►▶→•◦‣⁃]/g;
  const decorativeCount = (resumeText.match(decorative) ?? []).length;
  if (decorativeCount > 5) {
    issues.push("decorative symbols may confuse ATS parsers — use plain bullet characters");
  }

  const pipeLines = lines.filter((l) => (l.match(/\|/g) ?? []).length >= 2).length;
  if (pipeLines > 2) {
    issues.push("pipe-delimited tables detected — convert to plain text lists");
  }

  if (/page\s*1\s*of\s*\d|page\s*\d+/i.test(resumeText)) {
    issues.push("page break artifacts detected — remove page numbers from body text");
  }

  const score = Math.max(0, 100 - issues.length * 15);
  return { score, issues };
}
