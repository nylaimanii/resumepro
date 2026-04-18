"use client";

import { PersonalEditor } from "./editors/personal-editor";
import { SummaryEditor } from "./editors/summary-editor";
import { ExperienceEditor } from "./editors/experience-editor";
import { EducationEditor } from "./editors/education-editor";
import { SkillsEditor } from "./editors/skills-editor";
import { ProjectsEditor } from "./editors/projects-editor";
import { CertificationsEditor } from "./editors/certifications-editor";
import type { ResumeData } from "@/lib/types/resume";

export function BuilderForm({
  data,
  resumeId,
  onChange,
}: {
  data: ResumeData;
  resumeId: string;
  onChange: (d: ResumeData) => void;
}) {
  return (
    <div className="space-y-3">
      <PersonalEditor data={data.personal} onChange={(personal) => onChange({ ...data, personal })} />
      <SummaryEditor
        summary={data.summary}
        resumeId={resumeId}
        jobTitle={data.personal.title}
        onChange={(summary) => onChange({ ...data, summary })}
      />
      <ExperienceEditor experiences={data.experience} onChange={(experience) => onChange({ ...data, experience })} />
      <EducationEditor education={data.education} onChange={(education) => onChange({ ...data, education })} />
      <SkillsEditor skills={data.skills} onChange={(skills) => onChange({ ...data, skills })} />
      <ProjectsEditor projects={data.projects} onChange={(projects) => onChange({ ...data, projects })} />
      <CertificationsEditor certifications={data.certifications} onChange={(certifications) => onChange({ ...data, certifications })} />
    </div>
  );
}
