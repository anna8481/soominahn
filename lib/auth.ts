// HMAC-signed session token (Web Crypto — works in both Node and Edge runtimes)

export const COOKIE_NAME = "soom_admin";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return bufToHex(sig);
}

export async function createSessionToken(secret: string): Promise<string> {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const sig = await sign(String(exp), secret);
  return `${exp}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = await sign(exp, secret);
  if (sig.length !== expected.length) return false;
  // constant-time compare
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (diff !== 0) return false;
  return Number(exp) > Date.now();
}
