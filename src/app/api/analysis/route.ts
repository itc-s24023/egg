import { NextResponse } from "next/server";
import { characterRef, getDb, historyCollection, Timestamp } from "@/src/lib/firestore";
import { getSessionUserId } from "@/src/lib/security";
import { getPersonalityType } from "@/src/lib/character-image";

export const runtime = "nodejs";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });

  const charRef = characterRef(userId);
  const [characterSnapshot, messageSnapshot] = await Promise.all([
    charRef.get(),
    historyCollection(userId, "messages").where("role", "==", "user").get(),
  ]);
  if (!characterSnapshot.exists) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });

  const character = characterSnapshot.data()!;
  const recentMessages = messageSnapshot.docs
    .sort((left, right) => (right.get("createdAt") as Timestamp).toMillis() - (left.get("createdAt") as Timestamp).toMillis())
    .slice(0, 100);
  const text = recentMessages.map((message) => String(message.get("content") ?? "")).join(" ");
  const topics = ["食べ物", "ゲーム", "学校", "仕事", "音楽", "動物"].map((topic) => ({
    topic,
    count: (text.match(new RegExp(topic, "gi")) ?? []).length,
  })).filter((topic) => topic.count > 0).sort((a, b) => b.count - a.count);
  if (character.growthStage === "たまご") {
    return NextResponse.json({ personalityType: "?", topics });
  }

  const personalityType = getPersonalityType(character.name, character.status ?? {
    brightness: 50,
    logic: 50,
    humor: 50,
    politeness: 50,
  });
  const now = Timestamp.now();
  const batch = getDb().batch();
  batch.update(charRef, { personalityType, favoriteTopics: topics, updatedAt: now });
  batch.create(historyCollection(userId, "analyses").doc(), {
    personalityType,
    topicSummary: topics,
    analysisSourceCount: recentMessages.length,
    createdAt: now,
  });
  await batch.commit();
  return NextResponse.json({ personalityType, topics });
}
