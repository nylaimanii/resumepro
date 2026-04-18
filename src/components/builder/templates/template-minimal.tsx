import type { ResumeData } from "@/lib/types/resume";

export function TemplateMinimal({ data }: { data: ResumeData }) {
  const { personal, summary, experience, education, skills, projects, certifications } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.github].filter(Boolean);

  return (
    <div className="bg-white font-sans text-[9.5px] text-gray-800 w-[8.5in] min-h-[11in] px-14 py-12 leading-relaxed">
      <div className="mb-6">
        <h1 className="text-[16px] font-bold mb-0.5">{personal.name || "Your Name"}</h1>
        {personal.title && <p className="text-[10px] text-gray-500 mb-1">{personal.title}</p>}
        <p className="text-[8.5px] text-gray-400">{contact.join("  /  ")}</p>
      </div>

      {summary && (
        <div className="mb-5">
          <p className="text-[7.5px] font-bold tracking-[0.2em] uppercase text-gray-300 mb-2">About</p>
          <p className="text-[9.5px] text-gray-600 leading-relaxed">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-5">
          <p className="text-[7.5px] font-bold tracking-[0.2em] uppercase text-gray-300 mb-2">Experience</p>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[9.5px]">{exp.role}, {exp.company}</span>
                <span className="text-[8.5px] text-gray-400">{exp.start_date} – {exp.current ? "now" : exp.end_date}</span>
              </div>
              <ul className="mt-0.5 space-y-0.5">
                {exp.bullets.map((b, i) => <li key={i} className="text-[9px] pl-3 text-gray-600 before:content-['–'] before:mr-1.5 before:text-gray-300">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-5">
          <p className="text-[7.5px] font-bold tracking-[0.2em] uppercase text-gray-300 mb-2">Education</p>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline mb-1.5">
              <span className="font-semibold text-[9.5px]">{edu.degree} — {edu.school}</span>
              <span className="text-[8.5px] text-gray-400">{edu.end_date || edu.start_date}</span>
            </div>
          ))}
        </div>
      )}

      {skills.categories.some(c => c.items.length > 0) && (
        <div className="mb-5">
          <p className="text-[7.5px] font-bold tracking-[0.2em] uppercase text-gray-300 mb-2">Skills</p>
          {skills.categories.map((cat) => cat.items.length > 0 ? (
            <p key={cat.id} className="text-[9.5px] text-gray-600">{cat.items.join("  ·  ")}</p>
          ) : null)}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-5">
          <p className="text-[7.5px] font-bold tracking-[0.2em] uppercase text-gray-300 mb-2">Projects</p>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <span className="font-semibold text-[9.5px]">{proj.name}</span>
              <ul className="mt-0.5 space-y-0.5">
                {proj.bullets.map((b, i) => <li key={i} className="text-[9px] pl-3 text-gray-600 before:content-['–'] before:mr-1.5 before:text-gray-300">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="mb-5">
          <p className="text-[7.5px] font-bold tracking-[0.2em] uppercase text-gray-300 mb-2">Certifications</p>
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline mb-1">
              <span className="font-semibold text-[9.5px]">{cert.name}</span>
              <span className="text-[8.5px] text-gray-400">{cert.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
