import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/types/resume";

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9.5, color: "#222", paddingHorizontal: 54, paddingVertical: 48 },
  name: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  contact: { fontSize: 8.5, color: "#666", marginBottom: 18 },
  sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", letterSpacing: 2, color: "#999", textTransform: "uppercase", marginBottom: 6, marginTop: 14 },
  entryRow: { flexDirection: "row", justifyContent: "space-between" },
  entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  entryMeta: { fontSize: 8.5, color: "#888" },
  bullet: { fontSize: 9, marginBottom: 1.5, paddingLeft: 10, color: "#333" },
  summary: { fontSize: 9.5, color: "#444", lineHeight: 1.6, marginBottom: 6 },
  skills: { fontSize: 9, color: "#444", lineHeight: 1.7 },
  entry: { marginBottom: 8 },
});

export function MinimalPDF({ data }: { data: ResumeData }) {
  const { personal, summary, experience, education, skills, projects, certifications } = data;
  const contactParts = [personal.email, personal.phone, personal.location, personal.linkedin, personal.github].filter(Boolean);

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <Text style={s.name}>{personal.name || "Your Name"}</Text>
        {personal.title && <Text style={{ ...s.entryMeta, marginBottom: 2, fontSize: 10 }}>{personal.title}</Text>}
        <Text style={s.contact}>{contactParts.join("  /  ")}</Text>

        {summary ? (
          <View>
            <Text style={s.sectionLabel}>About</Text>
            <Text style={s.summary}>{summary}</Text>
          </View>
        ) : null}

        {experience.length > 0 && (
          <View>
            <Text style={s.sectionLabel}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={s.entry}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{exp.role}, {exp.company}</Text>
                  <Text style={s.entryMeta}>{exp.start_date} – {exp.current ? "now" : exp.end_date}</Text>
                </View>
                {exp.bullets.map((b, i) => <Text key={i} style={s.bullet}>– {b}</Text>)}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View>
            <Text style={s.sectionLabel}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={s.entry}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{edu.degree} — {edu.school}</Text>
                  <Text style={s.entryMeta}>{edu.end_date || edu.start_date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {skills.categories.some(c => c.items.length > 0) && (
          <View>
            <Text style={s.sectionLabel}>Skills</Text>
            {skills.categories.map((cat) =>
              cat.items.length > 0 ? (
                <Text key={cat.id} style={s.skills}>{cat.items.join("  ·  ")}</Text>
              ) : null
            )}
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <Text style={s.sectionLabel}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={s.entry}>
                <Text style={s.entryTitle}>{proj.name}</Text>
                {proj.bullets.map((b, i) => <Text key={i} style={s.bullet}>– {b}</Text>)}
              </View>
            ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View>
            <Text style={s.sectionLabel}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={s.entryRow}>
                <Text style={s.entryTitle}>{cert.name}</Text>
                <Text style={s.entryMeta}>{cert.date}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
