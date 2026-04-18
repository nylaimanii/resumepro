import type { ResumeData } from "@/lib/types/resume";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-1.5">{label}</p>
      {children}
    </div>
  );
}

export function TemplateModern({ data }: { data: ResumeData }) {
  const { personal, summary, experience, education, skills, projects, certifications } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.github, personal.website].filter(Boolean);

  return (
    <div className="bg-white font-sans text-[10px] text-gray-900 w-[8.5in] min-h-[11in] px-12 py-10 leading-snug">
      <div className="mb-5">
        <h1 className="text-[22px] font-bold mb-0.5">{personal.name || "Your Name"}</h1>
        {personal.title && <p className="text-[11px] text-gray-500 mb-1">{personal.title}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[9px] text-gray-500">
          {contact.map((c, i) => <span key={i}>{c}</span>)}
        </div>
        <hr className="mt-3 border-gray-200" />
      </div>

      {summary && (
        <Section label="Summary">
          <p className="text-[10px] text-gray-700 leading-relaxed">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section label="Experience">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[10.5px]">{exp.role}{exp.company ? ` — ${exp.company}` : ""}</span>
                <span className="text-[9px] text-gray-500">{exp.start_date}{exp.end_date ? ` – ${exp.current ? "Present" : exp.end_date}` : ""}</span>
              </div>
              {exp.location && <p className="text-[9px] text-gray-400 mb-1">{exp.location}</p>}
              <ul className="space-y-0.5 mt-1">
                {exp.bullets.map((b, i) => <li key={i} className="text-[10px] pl-3 before:content-['•'] before:mr-1.5 before:text-gray-400">{b}</li>)}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section label="Education">
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[10.5px]">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                <span className="text-[9px] text-gray-500">{edu.start_date}{edu.end_date ? ` – ${edu.end_date}` : ""}</span>
              </div>
              <p className="text-[9px] text-gray-500">{edu.school}{edu.location ? `, ${edu.location}` : ""}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
            </div>
          ))}
        </Section>
      )}

      {skills.categories.some(c => c.items.length > 0) && (
        <Section label="Skills">
          {skills.categories.map((cat) => cat.items.length > 0 ? (
            <p key={cat.id} className="text-[10px] mb-0.5"><span className="font-semibold">{cat.name}:</span> {cat.items.join(", ")}</p>
          ) : null)}
        </Section>
      )}

      {projects.length > 0 && (
        <Section label="Projects">
          {projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[10.5px]">{proj.name}</span>
                {proj.link && <span className="text-[9px] text-gray-400">{proj.link}</span>}
              </div>
              {proj.tech.length > 0 && <p className="text-[9px] text-gray-400 mb-1">{proj.tech.join(", ")}</p>}
              <ul className="space-y-0.5">
                {proj.bullets.map((b, i) => <li key={i} className="text-[10px] pl-3 before:content-['•'] before:mr-1.5 before:text-gray-400">{b}</li>)}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section label="Certifications">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline mb-1">
              <span className="font-semibold text-[10px]">{cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}</span>
              <span className="text-[9px] text-gray-400">{cert.date}</span>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
