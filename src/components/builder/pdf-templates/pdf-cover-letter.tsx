import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 72,
    paddingBottom: 72,
    paddingLeft: 72,
    paddingRight: 72,
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  contact: {
    fontSize: 9,
    color: "#555555",
  },
  date: {
    marginBottom: 16,
    fontSize: 10,
    color: "#555555",
  },
  recipient: {
    marginBottom: 20,
  },
  recipientLine: {
    fontSize: 11,
    marginBottom: 2,
  },
  paragraph: {
    marginBottom: 12,
    textAlign: "justify" as const,
  },
  signoff: {
    marginTop: 20,
  },
  signoffLine: {
    fontSize: 11,
    marginBottom: 16,
  },
  signerName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
});

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function CoverLetterPDF({
  content,
  name,
  email,
  phone,
  location,
  hiringManager,
  company,
}: {
  content: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  hiringManager?: string;
  company: string;
}) {
  const contactParts = [email, phone, location].filter(Boolean);
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          {contactParts.length > 0 && (
            <Text style={styles.contact}>{contactParts.join(" · ")}</Text>
          )}
        </View>

        <Text style={styles.date}>{formatDate(new Date())}</Text>

        <View style={styles.recipient}>
          {hiringManager && (
            <Text style={styles.recipientLine}>{hiringManager}</Text>
          )}
          <Text style={styles.recipientLine}>{company}</Text>
        </View>

        {paragraphs.map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}

        <View style={styles.signoff}>
          <Text style={styles.signoffLine}>Sincerely,</Text>
          <Text style={styles.signerName}>{name}</Text>
        </View>
      </Page>
    </Document>
  );
}
