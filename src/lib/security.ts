import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "ai-gocchi-session";
const secret = () => process.env.SESSION_SECRET ?? "development-only-change-me";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) return false;
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(digest, "hex"));
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function setSession(userId: string): Promise<void> {
  const payload = Buffer.from(`${userId}.${Date.now()}`).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  (await cookies()).set(cookieName, `${payload}.${signature}`, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24,
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const value = (await cookies()).get(cookieName)?.value;
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return Buffer.from(payload, "base64url").toString().split(".")[0] ?? null;
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(cookieName);
}
