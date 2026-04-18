import type { ResumeData } from "@/lib/types/resume";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-[11px] font-bold border-b border-gray-700 pb-0.5 mb-2">{label}</h2>
      {children}
    </div>
  );
}

export function TemplateClassic({ data }: { data: ResumeData }) {
  const { personal, summary, experience, education, skills, projects, certifications } = data;
  const contact = [personal.email, personal.phone, personal.location].filter(Boolean);
  const links = [personal.linkedin, personal.github, personal.website].filter(Boolean);

  return (
    <div className="bg-white font-serif text-[10.5px] text-gray-900 w-[8.5in] min-h-[11in] px-14 py-12 leading-snug">
      <div className="text-center mb-6">
        <h1 className="text-[20px] font-bold mb-1">{personal.name || "Your Name"}</h1>
        {personal.title && <p className="text-[11px] italic text-gray-500 mb-1">{personal.title}</p>}
        {contact.length > 0 && <p className="text-[9.5px] text-gray-500">{contact.join("  ·  ")}</p>}
        {links.length > 0 && <p className="text-[9.5px] text-gray-400 mt-0.5">{links.join("  ·  ")}</p>}
      </div>

      {summary && (
        <Section label="Summary">
          <p className="text-[10.5px] text-gray-700 leading-relaxed">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section label="Professional Experience">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[10.5px]">{exp.role}</span>
                <span className="text-[9.5px] italic text-gray-500">{exp.start_date}{exp.end_date ? ` – ${exp.current ? "Present" : exp.end_date}` : ""}</span>
              </div>
              <p className="text-[9.5px] italic text-gray-500 mb-1">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
              <ul className="space-y-0.5">
                {exp.bullets.map((b, i) => <li key={i} className="text-[10px] pl-4 before:content-['•'] before:mr-1.5">{b}</li>)}
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
                <span className="font-bold">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</span>
                <span className="text-[9.5px] italic text-gray-500">{edu.end_date || edu.start_date}</span>
              </div>
              <p className="text-[9.5px] italic text-gray-500">{edu.school}{edu.location ? `, ${edu.location}` : ""}{edu.gpa ? `  ·  GPA: ${edu.gpa}` : ""}</p>
            </div>
          ))}
        </Section>
      )}

      {skills.categories.some(c => c.items.length > 0) && (
        <Section label="Skills">
          {skills.categories.map((cat) => cat.items.length > 0 ? (
            <p key={cat.id} className="text-[10px] mb-0.5"><span className="font-bold">{cat.name}:</span> {cat.items.join(", ")}</p>
          ) : null)}
        </Section>
      )}

      {projects.length > 0 && (
        <Section label="Projects">
          {projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <p className="font-bold">{proj.name}{proj.tech.length > 0 ? ` (${proj.tech.join(", ")})` : ""}</p>
              <ul className="space-y-0.5">
                {proj.bullets.map((b, i) => <li key={i} className="text-[10px] pl-4 before:content-['•'] before:mr-1.5">{b}</li>)}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section label="Certifications">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline mb-1">
              <span className="font-bold">{cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}</span>
              <span className="text-[9.5px] italic text-gray-400">{cert.date}</span>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
