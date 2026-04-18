export async function computeContentHash(resumeText: string, jdText: string): Promise<string> {
  const data = new TextEncoder().encode(resumeText + "|||" + jdText);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.slice(0, 32);
}
