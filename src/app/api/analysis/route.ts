import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionUserId } from "@/src/lib/security";
import { getPersonalityType } from "@/src/lib/character-image";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  const character = await prisma.character.findUnique({
    where: { userId },
    include: {
      status: true,
      messages: { where: { role: "user" }, orderBy: { createdAt: "desc" }, take: 100 },
    },
  });
  if (!character) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });
  const text = character.messages.map((message) => message.content).join(" ");
  const topics = ["食べ物", "ゲーム", "学校", "仕事", "音楽", "動物"].map((topic) => ({
    topic, count: (text.match(new RegExp(topic, "gi")) ?? []).length,
  })).filter((topic) => topic.count > 0).sort((a, b) => b.count - a.count);
  if (character.growthStage === "たまご") {
    return NextResponse.json({ personalityType: "?", topics });
  }
  const personalityType = character.status
    ? getPersonalityType(character.name, character.status)
    : "ひだまり型";
  await prisma.$transaction([
    prisma.character.update({ where: { id: character.id }, data: { personalityType, favoriteTopics: topics } }),
    prisma.personalityAnalysis.create({ data: { characterId: character.id, personalityType, topicSummary: topics, analysisSourceCount: character.messages.length } }),
  ]);
  return NextResponse.json({ personalityType, topics });
}
