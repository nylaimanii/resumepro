import { z } from "zod";
import { groq, MODEL_SMART } from "./client";
import type { ResumeData } from "@/lib/types/resume";

const schema = `{
  "personal": { "name": "", "title": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "website": "" },
  "summary": "",
  "experience": [{ "id": "uuid", "company": "", "role": "", "location": "", "start_date": "", "end_date": "", "current": false, "bullets": [] }],
  "education": [{ "id": "uuid", "school": "", "degree": "", "field": "", "location": "", "start_date": "", "end_date": "", "gpa": "" }],
  "skills": { "categories": [{ "id": "uuid", "name": "Skills", "items": [] }] },
  "projects": [{ "id": "uuid", "name": "", "description": "", "link": "", "tech": [], "bullets": [] }],
  "certifications": [{ "id": "uuid", "name": "", "issuer": "", "date": "" }]
}`;

const BulletSchema = z.array(z.string());
const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string().optional().default(""),
  start_date: z.string(),
  end_date: z.string(),
  current: z.boolean().default(false),
  bullets: BulletSchema,
});
const EducationSchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string(),
  field: z.string().optional().default(""),
  location: z.string().optional().default(""),
  start_date: z.string(),
  end_date: z.string(),
  gpa: z.string().optional(),
});
const SkillsCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(z.string()),
});
const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().default(""),
  link: z.string().optional().default(""),
  tech: z.array(z.string()),
  bullets: BulletSchema,
});
const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string().optional().default(""),
  date: z.string().optional().default(""),
});

const ResumeDataSchema = z.object({
  personal: z.object({
    name: z.string(),
    title: z.string().optional().default(""),
    email: z.string().optional().default(""),
    phone: z.string().optional().default(""),
    location: z.string().optional().default(""),
    linkedin: z.string().optional().default(""),
    github: z.string().optional().default(""),
    website: z.string().optional().default(""),
  }),
  summary: z.string().optional().default(""),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.object({ categories: z.array(SkillsCategorySchema) }),
  projects: z.array(ProjectSchema),
  certifications: z.array(CertificationSchema),
});

function injectIds(data: unknown): unknown {
  if (typeof data !== "object" || data === null) return data;
  if (Array.isArray(data)) return data.map(injectIds);
  const obj = data as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    result[k] = injectIds(v);
  }
  if (!result.id) result.id = crypto.randomUUID();
  return result;
}

async function call(text: string, temperature: number): Promise<ResumeData> {
  const completion = await groq.chat.completions.create({
    model: MODEL_SMART,
    response_format: { type: "json_object" },
    temperature,
    max_tokens: 3000,
    messages: [
      {
        role: "system",
        content: `you extract structured data from resumes. respond ONLY with valid json matching this exact shape: ${schema}. fill best-effort; use empty strings for missing fields, empty arrays for missing sections. never invent facts. for skills, group all skills under a single category named "Skills".`,
      },
      { role: "user", content: `extract structured data from this resume:\n\n${text.slice(0, 8000)}` },
    ],
  });
  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);
  const withIds = injectIds(parsed) as Record<string, unknown>;
  if (!withIds.skills || !(withIds.skills as Record<string, unknown>).categories) {
    (withIds as Record<string, unknown>).skills = { categories: [{ id: crypto.randomUUID(), name: "Skills", items: [] }] };
  }
  return ResumeDataSchema.parse(withIds) as ResumeData;
}

export async function parseResumeText(rawText: string): Promise<ResumeData> {
  try {
    return await call(rawText, 0.1);
  } catch {
    return await call(rawText, 0.1);
  }
}
