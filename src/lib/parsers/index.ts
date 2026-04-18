import { parsePdf } from "./pdf";
import { parseDocx } from "./docx";

export async function parseResumeFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  switch (file.type) {
    case "application/pdf":
      return parsePdf(buffer);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return parseDocx(buffer);
    default:
      throw new Error("unsupported file type — only pdf and docx");
  }
}
