export function scoreLength(resumeText: string): {
  score: number;
  word_count: number;
  recommendation: string;
} {
  const word_count = resumeText.split(/\s+/).filter(Boolean).length;

  if (word_count >= 400 && word_count <= 800) {
    return { score: 100, word_count, recommendation: "within the ideal range" };
  }
  if ((word_count >= 300 && word_count < 400) || (word_count > 800 && word_count <= 1000)) {
    return { score: 80, word_count, recommendation: word_count < 400
      ? "a bit short — consider adding measurable impact"
      : "slightly long — trim redundant bullets" };
  }
  if ((word_count >= 200 && word_count < 300) || (word_count > 1000 && word_count <= 1200)) {
    return { score: 60, word_count, recommendation: word_count < 300
      ? "too short — flesh out your experience with concrete examples"
      : "too long — aim for one page unless you have 10+ years of experience" };
  }
  return {
    score: 30,
    word_count,
    recommendation: word_count < 200
      ? "very short — your resume needs significantly more content"
      : "too long — aim for one page unless senior; ruthlessly cut old or irrelevant experience",
  };
}
