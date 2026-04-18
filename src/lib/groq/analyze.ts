import { z } from "zod";
import { groq, MODEL_SMART } from "./client";
import { SYSTEM_SUGGESTIONS } from "./prompts";
import type { ScoreBreakdown } from "@/lib/types/database";
import type { RedFlag } from "@/lib/scoring";

const SuggestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(["keywords", "impact", "structure", "language", "tailoring"]),
  severity: z.enum(["high", "medium", "low"]),
  description: z.string(),
  original: z.string().nullable(),
  improved: z.string().nullable(),
});

const AnalysisResponseSchema = z.object({
  summary: z.string(),
  suggestions: z.array(SuggestionSchema),
});

export type Suggestion = z.infer<typeof SuggestionSchema>;
export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

async function callGroq(userMessage: string, temperature: number): Promise<AnalysisResponse> {
  const completion = await groq.chat.completions.create({
    model: MODEL_SMART,
    response_format: { type: "json_object" },
    temperature,
    max_tokens: 2000,
    messages: [
      { role: "system", content: SYSTEM_SUGGESTIONS },
      { role: "user", content: userMessage },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);
  return AnalysisResponseSchema.parse(parsed);
}

export async function getAIAnalysis(input: {
  resumeText: string;
  jdText: string;
  scoreBreakdown: ScoreBreakdown;
  redFlags: RedFlag[];
  missingKeywords: string[];
}): Promise<AnalysisResponse> {
  const resume = input.resumeText.slice(0, 6000);
  const jd = input.jdText.slice(0, 3000);

  const userMessage = `RESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jd}\n\nSCORE BREAKDOWN:\n${JSON.stringify(input.scoreBreakdown, null, 2)}\n\nRED FLAGS:\n${input.redFlags.map((f) => `- [${f.severity}] ${f.message}`).join("\n")}\n\nTOP MISSING KEYWORDS:\n${input.missingKeywords.slice(0, 15).join(", ")}`;

  try {
    return await callGroq(userMessage, 0.4);
  } catch {
    return await callGroq(userMessage, 0.2);
  }
}
