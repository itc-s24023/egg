import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionUserId } from "@/src/lib/security";

function serializeBigInts<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_, item) => typeof item === "bigint" ? item.toString() : item)) as T;
}

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  try {
    const current = await prisma.character.findUnique({ where: { userId } });
    if (!current) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });

    const character = await prisma.$transaction(async (tx) => {
      await tx.conversationMessage.deleteMany({ where: { characterId: current.id } });
      await tx.careAction.deleteMany({ where: { characterId: current.id } });
      await tx.miniGameResult.deleteMany({ where: { characterId: current.id } });
      await tx.personalityAnalysis.deleteMany({ where: { characterId: current.id } });
      await tx.characterStatus.upsert({
        where: { characterId: current.id },
        create: { characterId: current.id },
        update: {
          hunger: 70,
          energy: 70,
          friendship: 0,
          brightness: 50,
          logic: 50,
          humor: 50,
          politeness: 50,
        },
      });
      return tx.character.update({
        where: { id: current.id },
        data: {
          name: "ごっち",
          growthStage: "たまご",
          experience: 0,
          personalityType: null,
          favoriteTopics: {},
          startedAt: new Date(),
          diedAt: null,
        },
        include: { status: true, messages: true },
      });
    });
    return NextResponse.json({ character: serializeBigInts(character) });
  } catch (error) {
    console.error("Character reset failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "育成データを初期化できませんでした。" }, { status: 503 });
  }
}
