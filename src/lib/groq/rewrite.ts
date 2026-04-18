import { z } from "zod";
import { groq, MODEL_FAST } from "./client";
import { SYSTEM_BULLET_REWRITE, SYSTEM_SUMMARY_WRITER } from "./prompts";

const RewriteSchema = z.object({ rewritten: z.string() });
const SummarySchema = z.object({ summary: z.string() });

export async function rewriteBullet(
  bullet: string,
  context?: { jobTitle?: string }
): Promise<string> {
  const userMessage = context?.jobTitle
    ? `job title: ${context.jobTitle}\n\nbullet: ${bullet}`
    : `bullet: ${bullet}`;

  const completion = await groq.chat.completions.create({
    model: MODEL_FAST,
    response_format: { type: "json_object" },
    temperature: 0.5,
    max_tokens: 150,
    messages: [
      { role: "system", content: SYSTEM_BULLET_REWRITE },
      { role: "user", content: userMessage },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = RewriteSchema.parse(JSON.parse(raw));
  return parsed.rewritten;
}

export async function generateSummary(resumeText: string, jobTitle: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: MODEL_FAST,
    response_format: { type: "json_object" },
    temperature: 0.5,
    max_tokens: 300,
    messages: [
      { role: "system", content: SYSTEM_SUMMARY_WRITER },
      { role: "user", content: `job title: ${jobTitle}\n\nresume:\n${resumeText.slice(0, 4000)}` },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = SummarySchema.parse(JSON.parse(raw));
  return parsed.summary;
}
