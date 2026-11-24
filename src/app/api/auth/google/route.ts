import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { setSession } from "@/src/lib/security";

type FirebaseAccount = {
  localId?: string;
  email?: string;
  emailVerified?: boolean;
};

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json() as { idToken?: string };
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!idToken || !apiKey) {
      return NextResponse.json({ error: "Firebase Authenticationの設定が完了していません。" }, { status: 503 });
    }

    const verification = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
    if (!verification.ok) {
      return NextResponse.json({ error: "Google認証情報を確認できませんでした。" }, { status: 401 });
    }

    const result = await verification.json() as { users?: FirebaseAccount[] };
    const account = result.users?.[0];
    if (!account?.localId || !account.email || account.emailVerified !== true) {
      return NextResponse.json({ error: "メールアドレスが確認済みのGoogleアカウントを使用してください。" }, { status: 401 });
    }

    const email = account.email.trim().toLowerCase();
    const existingByUid = await prisma.user.findUnique({ where: { firebaseUid: account.localId } });
    const existingByEmail = await prisma.user.findUnique({ where: { email } });

    const user = existingByUid
      ? await prisma.user.update({
          where: { id: existingByUid.id },
          data: { email, firebaseUid: account.localId },
        })
      : existingByEmail
        ? await prisma.user.update({
            where: { id: existingByEmail.id },
            data: { firebaseUid: account.localId },
          })
        : await prisma.user.create({
            data: {
              email,
              firebaseUid: account.localId,
              character: { create: { name: "ごっち", status: { create: {} } } },
            },
          });

    await setSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Google login failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Google認証サービスに接続できません。" }, { status: 503 });
  }
}
