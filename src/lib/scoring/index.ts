import { matchKeywords, type KeywordMatch } from "./keywords";
import { scoreQuantification } from "./quantification";
import { scoreActionVerbs } from "./action-verbs";
import { scoreSections } from "./sections";
import { scoreLength } from "./length";
import { scoreParseability } from "./parseability";
import { detectRedFlags, type RedFlag } from "./red-flags";

export type { KeywordMatch, RedFlag };

export type ScoreResult = {
  ats_score: number;
  score_breakdown: {
    keyword_coverage: number;
    quantification: number;
    action_verbs: number;
    section_completeness: number;
    length: number;
    parseability: number;
  };
  keywords_matched: KeywordMatch[];
  keywords_missing: KeywordMatch[];
  red_flags: RedFlag[];
};

export function scoreResume(resumeText: string, jdText: string): ScoreResult {
  const keywords = matchKeywords(resumeText, jdText);
  const quant = scoreQuantification(resumeText);
  const verbs = scoreActionVerbs(resumeText);
  const sections = scoreSections(resumeText);
  const length = scoreLength(resumeText);
  const parse = scoreParseability(resumeText);

  const breakdown = {
    keyword_coverage: keywords.score,
    quantification: quant.score,
    action_verbs: verbs.score,
    section_completeness: sections.score,
    length: length.score,
    parseability: parse.score,
  };

  const ats_score = Math.round(
    breakdown.keyword_coverage  * 0.30 +
    breakdown.quantification    * 0.20 +
    breakdown.action_verbs      * 0.15 +
    breakdown.section_completeness * 0.15 +
    breakdown.length            * 0.10 +
    breakdown.parseability      * 0.10
  );

  return {
    ats_score,
    score_breakdown: breakdown,
    keywords_matched: keywords.matched,
    keywords_missing: keywords.missing,
    red_flags: detectRedFlags(resumeText),
  };
}
