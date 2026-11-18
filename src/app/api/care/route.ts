import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { clamp, careEffects, growthStage, type CareType } from "@/src/lib/game";
import { getSessionUserId } from "@/src/lib/security";
import { getJapanDayStart } from "@/src/lib/date";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  const { action } = await request.json() as { action?: CareType };
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  if (!action || !(action in careEffects)) return NextResponse.json({ error: "不正なお世話です。" }, { status: 400 });
  const character = await prisma.character.findUnique({ where: { userId }, include: { status: true } });
  if (!character?.status) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });
  if (action === "feed") {
    const lastFeed = await prisma.careAction.findFirst({
      where: { characterId: character.id, actionType: "feed" },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    const [userMessages, assistantMessages] = await Promise.all([
      prisma.conversationMessage.count({ where: { characterId: character.id, role: "user", ...(lastFeed ? { createdAt: { gt: lastFeed.createdAt } } : {}) } }),
      prisma.conversationMessage.count({ where: { characterId: character.id, role: "assistant", ...(lastFeed ? { createdAt: { gt: lastFeed.createdAt } } : {}) } }),
    ]);
    if (userMessages < 1 || assistantMessages < 1) {
      return NextResponse.json({ error: "ごはんをあげるには、AIと1回会話してください。" }, { status: 400 });
    }
  }
  if (action === "play") {
    const [lastPlay, latestGame] = await Promise.all([
      prisma.careAction.findFirst({ where: { characterId: character.id, actionType: "play" }, orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
      prisma.miniGameResult.findFirst({ where: { characterId: character.id }, orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    ]);
    if (!latestGame || (lastPlay && latestGame.createdAt <= lastPlay.createdAt)) {
      return NextResponse.json({ error: "遊ぶには、じゃんけんやミニゲームを1回プレイしてください。" }, { status: 400 });
    }
  }
  if (action === "sleep") {
    const sleepsToday = await prisma.careAction.count({
      where: { characterId: character.id, actionType: "sleep", createdAt: { gte: getJapanDayStart() } },
    });
    if (sleepsToday >= 2) {
      return NextResponse.json({ error: "寝かせるのは1日2回までです。明日また利用できます。" }, { status: 400 });
    }
  }
  const effect = careEffects[action];
  const updated = await prisma.$transaction(async (tx) => {
    const nextExperience = character.experience + effect.experience;
    await tx.careAction.create({ data: { characterId: character.id, actionType: action, experienceDelta: effect.experience, hungerDelta: effect.hunger, energyDelta: effect.energy, friendshipDelta: effect.friendship } });
    await tx.character.update({ where: { id: character.id }, data: { experience: nextExperience, growthStage: growthStage(nextExperience) } });
    return tx.characterStatus.update({ where: { characterId: character.id }, data: { hunger: clamp(character.status!.hunger + effect.hunger), energy: clamp(character.status!.energy + effect.energy), friendship: clamp(character.status!.friendship + effect.friendship) } });
  });
  return NextResponse.json({ status: updated });
}
