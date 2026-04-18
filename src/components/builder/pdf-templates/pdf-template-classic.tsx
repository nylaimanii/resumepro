import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/types/resume";

const s = StyleSheet.create({
  page: { fontFamily: "Times-Roman", fontSize: 10.5, color: "#1a1a1a", paddingHorizontal: 54, paddingVertical: 48 },
  header: { alignItems: "center", marginBottom: 14 },
  name: { fontSize: 20, fontFamily: "Times-Bold", textAlign: "center", marginBottom: 2 },
  title: { fontSize: 11, textAlign: "center", color: "#444", marginBottom: 4, fontFamily: "Times-Italic" },
  contact: { fontSize: 9, textAlign: "center", color: "#555", marginBottom: 2 },
  rule: { borderBottomWidth: 1.5, borderBottomColor: "#333", marginBottom: 8 },
  thinRule: { borderBottomWidth: 0.5, borderBottomColor: "#aaa", marginTop: 2, marginBottom: 8 },
  sectionLabel: { fontSize: 11, fontFamily: "Times-Bold", marginBottom: 2, letterSpacing: 0.5 },
  entryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  entryTitle: { fontFamily: "Times-Bold", fontSize: 10.5 },
  entryMeta: { fontSize: 9.5, color: "#666", fontFamily: "Times-Italic" },
  bullet: { fontSize: 10, marginBottom: 2, paddingLeft: 12 },
  summary: { fontSize: 10.5, color: "#333", lineHeight: 1.5, marginBottom: 12 },
  section: { marginBottom: 12 },
  skills: { fontSize: 10, lineHeight: 1.6 },
});

export function ClassicPDF({ data }: { data: ResumeData }) {
  const { personal, summary, experience, education, skills, projects, certifications } = data;
  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  const linkParts = [personal.linkedin, personal.github, personal.website].filter(Boolean);

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{personal.name || "Your Name"}</Text>
          {personal.title && <Text style={s.title}>{personal.title}</Text>}
          {contactParts.length > 0 && <Text style={s.contact}>{contactParts.join("  ·  ")}</Text>}
          {linkParts.length > 0 && <Text style={s.contact}>{linkParts.join("  ·  ")}</Text>}
        </View>

        {summary ? (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Summary</Text>
            <View style={s.rule} />
            <Text style={s.summary}>{summary}</Text>
          </View>
        ) : null}

        {experience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Professional Experience</Text>
            <View style={s.rule} />
            {experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{exp.role}</Text>
                  <Text style={s.entryMeta}>{exp.start_date}{exp.end_date ? ` – ${exp.current ? "Present" : exp.end_date}` : ""}</Text>
                </View>
                <Text style={s.entryMeta}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</Text>
                {exp.bullets.map((b, i) => <Text key={i} style={s.bullet}>• {b}</Text>)}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Education</Text>
            <View style={s.rule} />
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{edu.degree}{edu.field ? `, ${edu.field}` : ""}</Text>
                  <Text style={s.entryMeta}>{edu.end_date || edu.start_date}</Text>
                </View>
                <Text style={s.entryMeta}>{edu.school}{edu.location ? `, ${edu.location}` : ""}{edu.gpa ? `  ·  GPA: ${edu.gpa}` : ""}</Text>
              </View>
            ))}
          </View>
        )}

        {skills.categories.some(c => c.items.length > 0) && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Skills</Text>
            <View style={s.rule} />
            {skills.categories.map((cat) =>
              cat.items.length > 0 ? (
                <Text key={cat.id} style={s.skills}>{cat.name}: {cat.items.join(", ")}</Text>
              ) : null
            )}
          </View>
        )}

        {projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Projects</Text>
            <View style={s.rule} />
            {projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 6 }}>
                <Text style={s.entryTitle}>{proj.name}{proj.tech.length > 0 ? ` (${proj.tech.join(", ")})` : ""}</Text>
                {proj.bullets.map((b, i) => <Text key={i} style={s.bullet}>• {b}</Text>)}
              </View>
            ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Certifications</Text>
            <View style={s.rule} />
            {certifications.map((cert) => (
              <View key={cert.id} style={s.entryRow}>
                <Text style={s.entryTitle}>{cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}</Text>
                <Text style={s.entryMeta}>{cert.date}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
