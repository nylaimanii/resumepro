import { extractText } from "unpdf";

export async function parsePdf(buffer: Buffer): Promise<string> {
  const uint8 = new Uint8Array(buffer);
  const result = await extractText(uint8, { mergePages: true });
  const text = Array.isArray(result.text)
    ? result.text.join("\n")
    : result.text;
  const trimmed = text.trim();
  if (trimmed.length < 100) {
    throw new Error("could not extract text — file may be scanned or image-based");
  }
  return trimmed;
}
