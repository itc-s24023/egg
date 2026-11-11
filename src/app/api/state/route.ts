import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionUserId } from "@/src/lib/security";
import { getJapanDayStart } from "@/src/lib/date";

function serializeBigInts<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_, item) => typeof item === "bigint" ? item.toString() : item)) as T;
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  const character = await prisma.character.findUnique({
    where: { userId },
    include: {
      status: true,
      messages: { orderBy: { createdAt: "asc" }, take: 20 },
      careActions: {
        where: { actionType: { in: ["feed", "play"] } },
        orderBy: { createdAt: "desc" },
        take: 2,
      },
      miniGameResults: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!character) return NextResponse.json({ character: null });
  const lastFeedAt = character.careActions[0]?.createdAt;
  const messageTimeFilter = lastFeedAt ? { createdAt: { gt: lastFeedAt } } : {};
  const [userMessages, assistantMessages] = await Promise.all([
    prisma.conversationMessage.count({ where: { characterId: character.id, role: "user", ...messageTimeFilter } }),
    prisma.conversationMessage.count({ where: { characterId: character.id, role: "assistant", ...messageTimeFilter } }),
  ]);
  const canFeed = userMessages > 0 && assistantMessages > 0;
  const lastPlayAt = character.careActions.find((action) => action.actionType === "play")?.createdAt;
  const latestGameAt = character.miniGameResults[0]?.createdAt;
  const canPlay = Boolean(latestGameAt && (!lastPlayAt || latestGameAt > lastPlayAt));
  const sleepsToday = await prisma.careAction.count({
    where: { characterId: character.id, actionType: "sleep", createdAt: { gte: getJapanDayStart() } },
  });
  return NextResponse.json({
    character: serializeBigInts(character),
    canFeed,
    canPlay,
    canSleep: sleepsToday < 2,
    sleepsToday,
  });
}
