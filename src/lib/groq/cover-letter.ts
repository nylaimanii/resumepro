import { z } from "zod";
import { groq, MODEL_SMART } from "./client";
import type { ResumeData } from "@/lib/types/resume";

export type ToneLabel = "formal" | "professional" | "conversational";

export function toneFromNumber(n: number): ToneLabel {
  if (n <= 33) return "formal";
  if (n <= 66) return "professional";
  return "conversational";
}

const CoverLetterResponseSchema = z.object({
  content: z.string(),
});

const SYSTEM_PROMPT = `you write tailored cover letters. three short paragraphs (opening, value, close), 220-320 words, in first person. use the candidate's real experience from their resume — never invent facts, companies, metrics, or dates. match the requested tone exactly:

formal: measured, structured, "dear hiring manager" opener, full sentences, no contractions
professional: direct but warm, standard business voice, some contractions ok
conversational: natural, confident, clear opinions, contractions fine, can open with the hook instead of "dear"

respond ONLY with valid json: { "content": "full cover letter with \\n\\n between paragraphs" }`;

async function callGroq(
  userMessage: string,
  temperature: number
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: MODEL_SMART,
    response_format: { type: "json_object" },
    temperature,
    max_tokens: 900,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);
  return CoverLetterResponseSchema.parse(parsed).content;
}

export async function generateCoverLetter(input: {
  resumeText: string;
  parsedResume?: ResumeData | null;
  jobTitle: string;
  company: string;
  jobDescription: string;
  hiringManager?: string;
  tone: number;
}): Promise<{ content: string; word_count: number }> {
  const toneLabel = toneFromNumber(input.tone);
  const temperature = toneLabel === "formal" ? 0.3 : toneLabel === "professional" ? 0.5 : 0.7;

  const userMessage = `tone: ${toneLabel}

company: ${input.company}
role: ${input.jobTitle}
hiring manager: ${input.hiringManager || "not provided"}

job description:
${input.jobDescription}

candidate resume:
${input.resumeText.slice(0, 5000)}`;

  let content: string;
  try {
    content = await callGroq(userMessage, temperature);
  } catch {
    content = await callGroq(userMessage, 0.3);
  }

  const word_count = content.split(/\s+/).filter(Boolean).length;
  return { content, word_count };
}
