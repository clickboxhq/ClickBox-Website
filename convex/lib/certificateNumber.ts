// Crockford-style base32 alphabet, ambiguous characters (0/O, 1/I/L) removed.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function randomSegment(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function generateCertificateNumber(programCode: string, issueDate: number): string {
  const year = new Date(issueDate).getUTCFullYear();
  const code = programCode.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "GEN";
  return `CB-${year}-${code}-${randomSegment(6)}`;
}
