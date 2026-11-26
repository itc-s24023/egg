import { NextResponse } from "next/server";
import { characterRef, getDb, initialCharacter, serializeFirestore } from "@/src/lib/firestore";
import { getSessionUserId } from "@/src/lib/security";

export const runtime = "nodejs";

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });

  const ref = characterRef(userId);
  const current = await ref.get();
  if (!current.exists) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });

  await getDb().recursiveDelete(ref);
  const character = initialCharacter();
  await ref.create(character);
  return NextResponse.json({
    character: serializeFirestore({ ...character, id: ref.id, messages: [] }),
  });
}
