import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionUserId } from "@/src/lib/security";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  const character = await prisma.character.findUnique({
    where: { userId },
    include: { messages: { where: { role: "user" }, orderBy: { createdAt: "desc" }, take: 100 } },
  });
  if (!character) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });
  const text = character.messages.map((message) => message.content).join(" ");
  const topics = ["食べ物", "ゲーム", "学校", "仕事", "音楽", "動物"].map((topic) => ({
    topic, count: (text.match(new RegExp(topic, "gi")) ?? []).length,
  })).filter((topic) => topic.count > 0).sort((a, b) => b.count - a.count);
  const personalityType = text.length > 200 ? "おしゃべり好き" : text.includes("!") || text.includes("！") ? "元気いっぱい" : "ものしずか";
  await prisma.$transaction([
    prisma.character.update({ where: { id: character.id }, data: { personalityType, favoriteTopics: topics } }),
    prisma.personalityAnalysis.create({ data: { characterId: character.id, personalityType, topicSummary: topics, analysisSourceCount: character.messages.length } }),
  ]);
  return NextResponse.json({ personalityType, topics });
}
