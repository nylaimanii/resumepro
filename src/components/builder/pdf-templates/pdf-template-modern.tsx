import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/types/resume";

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", paddingHorizontal: 48, paddingVertical: 40 },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  title: { fontSize: 11, color: "#555", marginBottom: 6 },
  contact: { fontSize: 9, color: "#666", flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  contactItem: { marginRight: 12 },
  rule: { borderBottomWidth: 1, borderBottomColor: "#ddd", marginBottom: 10 },
  sectionLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, color: "#888", textTransform: "uppercase", marginBottom: 6 },
  entryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  entryMeta: { fontSize: 9, color: "#777" },
  bullet: { fontSize: 9.5, marginBottom: 2, paddingLeft: 10 },
  summary: { fontSize: 10, color: "#333", marginBottom: 14, lineHeight: 1.5 },
  section: { marginBottom: 14 },
  skills: { fontSize: 9.5, lineHeight: 1.6 },
});

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((b, i) => (
        <Text key={i} style={s.bullet}>• {b}</Text>
      ))}
    </View>
  );
}

export function ModernPDF({ data }: { data: ResumeData }) {
  const { personal, summary, experience, education, skills, projects, certifications } = data;
  const contactParts = [personal.email, personal.phone, personal.location, personal.linkedin, personal.github, personal.website].filter(Boolean);

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <Text style={s.name}>{personal.name || "Your Name"}</Text>
        {personal.title && <Text style={s.title}>{personal.title}</Text>}
        <View style={s.contact}>
          {contactParts.map((c, i) => <Text key={i} style={s.contactItem}>{c}</Text>)}
        </View>
        <View style={s.rule} />

        {summary ? (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Summary</Text>
            <Text style={s.summary}>{summary}</Text>
          </View>
        ) : null}

        {experience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{exp.role}{exp.company ? ` — ${exp.company}` : ""}</Text>
                  <Text style={s.entryMeta}>{exp.start_date}{exp.end_date ? ` – ${exp.current ? "Present" : exp.end_date}` : ""}</Text>
                </View>
                {exp.location ? <Text style={s.entryMeta}>{exp.location}</Text> : null}
                <Bullets items={exp.bullets} />
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</Text>
                  <Text style={s.entryMeta}>{edu.start_date}{edu.end_date ? ` – ${edu.end_date}` : ""}</Text>
                </View>
                <Text style={s.entryMeta}>{edu.school}{edu.location ? `, ${edu.location}` : ""}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</Text>
              </View>
            ))}
          </View>
        )}

        {skills.categories.length > 0 && skills.categories.some(c => c.items.length > 0) && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Skills</Text>
            {skills.categories.map((cat) => (
              cat.items.length > 0 ? (
                <Text key={cat.id} style={s.skills}>{cat.name}: {cat.items.join(", ")}</Text>
              ) : null
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 6 }}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{proj.name}</Text>
                  {proj.link ? <Text style={s.entryMeta}>{proj.link}</Text> : null}
                </View>
                {proj.tech.length > 0 && <Text style={s.entryMeta}>{proj.tech.join(", ")}</Text>}
                <Bullets items={proj.bullets} />
              </View>
            ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={s.entryRow}>
                <Text style={s.entryTitle}>{cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}</Text>
                {cert.date ? <Text style={s.entryMeta}>{cert.date}</Text> : null}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
