import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { hashPassword, setSession } from "@/src/lib/security";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as { email?: string; password?: string };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length < 8) {
      return NextResponse.json({ error: "メールアドレスと8文字以上のパスワードを入力してください。" }, { status: 400 });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) {
      return NextResponse.json({ error: "このメールアドレスは登録済みです。" }, { status: 409 });
    }
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail, passwordHash: hashPassword(password),
        character: { create: { name: "ごっち", status: { create: {} } } },
      },
    });
    await setSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Registration failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "認証サービスに接続できません。データベースを起動して再試行してください。" }, { status: 503 });
  }
}
