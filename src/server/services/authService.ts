import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminUG2026";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 horas

interface TokenEntry {
  expires: number;
}

// En Next.js cada route handler (/api/auth, /api/lab, /api/upload) puede
// compilarse como un módulo independiente (sobre todo en `next dev`), por lo
// que un `Map` a nivel de módulo NO se comparte entre rutas: el token emitido
// en /api/auth no sería visible en /api/lab (→ 401). Guardarlo en globalThis
// garantiza una única instancia por proceso.
const globalForAuth = globalThis as unknown as {
  __lisbActiveTokens?: Map<string, TokenEntry>;
};

const activeTokens: Map<string, TokenEntry> =
  globalForAuth.__lisbActiveTokens ??
  (globalForAuth.__lisbActiveTokens = new Map<string, TokenEntry>());

export function validateAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function generateSessionToken(): string {
  const payload = `${Date.now()}:${crypto.randomBytes(16).toString("hex")}`;
  return Buffer.from(payload).toString("base64url");
}

export function registerToken(token: string): void {
  activeTokens.set(token, { expires: Date.now() + TOKEN_TTL_MS });
}

export function verifySessionToken(token: string | null): boolean {
  if (!token) return false;
  const entry = activeTokens.get(token);
  if (!entry) return false;
  if (entry.expires < Date.now()) {
    activeTokens.delete(token);
    return false;
  }
  return true;
}

export function revokeToken(token: string | null): void {
  if (token) activeTokens.delete(token);
}

export { ADMIN_PASSWORD };