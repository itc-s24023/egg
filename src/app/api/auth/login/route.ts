import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { setSession, verifyPassword } from "@/src/lib/security";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as { email?: string; password?: string };
    const user = email ? await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } }) : null;
    if (!user || !password || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "メールアドレスまたはパスワードが正しくありません。" }, { status: 401 });
    }
    await setSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Login failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "認証サービスに接続できません。データベースを起動して再試行してください。" }, { status: 503 });
  }
}
