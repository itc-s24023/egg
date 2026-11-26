import { cookies } from "next/headers";
import { getAdminAuth } from "@/src/lib/firestore";

const cookieName = "ai-gocchi-session";
const sessionMaxAgeMs = 5 * 24 * 60 * 60 * 1000;

export async function setSession(idToken: string): Promise<void> {
  const sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn: sessionMaxAgeMs });
  (await cookies()).set(cookieName, sessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeMs / 1000,
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const value = (await cookies()).get(cookieName)?.value;
  if (!value) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(value, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(cookieName);
}
