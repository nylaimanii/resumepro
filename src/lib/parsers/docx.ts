import mammoth from "mammoth";

export async function parseDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  const trimmed = result.value.trim();
  if (trimmed.length < 100) {
    throw new Error("could not extract text — file may be scanned or image-based");
  }
  return trimmed;
}
