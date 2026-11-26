import { NextResponse } from "next/server";
import { ensureUserAndCharacter, getAdminAuth, isAdminConfigured } from "@/src/lib/firestore";
import { setSession } from "@/src/lib/security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let idToken: unknown;
  try {
    ({ idToken } = await request.json() as { idToken?: unknown });
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }
  if (typeof idToken !== "string" || !idToken || idToken.length > 10_000) {
    return NextResponse.json({ error: "Firebase認証情報を確認できませんでした。" }, { status: 401 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({
      error: "Firebase Admin SDKの認証情報が未設定です。.env に GOOGLE_APPLICATION_CREDENTIALS、または FIREBASE_CLIENT_EMAIL と FIREBASE_PRIVATE_KEY を設定してください。",
    }, { status: 503 });
  }

  try {
    const identity = await getAdminAuth().verifyIdToken(idToken, true);
    if (!identity.email) {
      return NextResponse.json({ error: "メールアドレスが確認できるFirebaseアカウントを使用してください。" }, { status: 401 });
    }
    await ensureUserAndCharacter(identity.uid, identity.email);
    await setSession(idToken);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const errorCode = typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : error instanceof Error ? error.name : "unknown";
    console.error(`Firebase sign-in setup failed (${errorCode})`);
    return NextResponse.json({
      error: "Firebase認証またはFirestoreへの接続に失敗しました。Admin SDKの資格情報とFirestoreの有効化を確認してください。",
    }, { status: 503 });
  }
}
