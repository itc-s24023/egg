import { NextResponse } from "next/server";
import { characterRef, historyCollection, serializeFirestore, Timestamp } from "@/src/lib/firestore";
import { getSessionUserId } from "@/src/lib/security";
import { getJapanDayStart } from "@/src/lib/date";

export const runtime = "nodejs";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });

  const dayStart = Timestamp.fromDate(getJapanDayStart());
  const [characterSnapshot, messagesSnapshot, careSnapshot, gamesSnapshot, todayCareSnapshot] = await Promise.all([
    characterRef(userId).get(),
    historyCollection(userId, "messages").orderBy("createdAt", "asc").limit(20).get(),
    historyCollection(userId, "careActions").get(),
    historyCollection(userId, "miniGameResults").orderBy("createdAt", "desc").limit(1).get(),
    historyCollection(userId, "careActions").where("createdAt", ">=", dayStart).get(),
  ]);
  if (!characterSnapshot.exists) return NextResponse.json({ character: null });

  const character = characterSnapshot.data()!;
  const messages = messagesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const careActions = careSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() })) as Array<{
      id: string;
      actionType: string;
      createdAt: Timestamp;
    }>;
  careActions.sort((left, right) => right.createdAt.toMillis() - left.createdAt.toMillis());
  const relevantCare = careActions.filter((action) => action.actionType === "feed" || action.actionType === "play");
  const miniGameResults = gamesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<{
    id: string;
    createdAt: Timestamp;
  }>;
  const lastFeed = careActions.find((action) => action.actionType === "feed")?.createdAt;
  const messagesSinceFeed = lastFeed
    ? await historyCollection(userId, "messages").where("createdAt", ">", lastFeed).get()
    : await historyCollection(userId, "messages").get();
  const userMessages = messagesSinceFeed.docs.filter((doc) => doc.get("role") === "user").length;
  const assistantMessages = messagesSinceFeed.docs.filter((doc) => doc.get("role") === "assistant").length;
  const lastPlay = careActions.find((action) => action.actionType === "play")?.createdAt;
  const latestGameAt = miniGameResults[0]?.createdAt;
  const canPlay = Boolean(latestGameAt && (!lastPlay || latestGameAt.toMillis() > lastPlay.toMillis()));
  const sleepsToday = todayCareSnapshot.docs.filter((doc) => doc.get("actionType") === "sleep").length;

  return NextResponse.json(serializeFirestore({
    character: {
      ...character,
      id: characterSnapshot.id,
      messages,
      careActions: relevantCare.slice(0, 2),
      miniGameResults,
    },
    canFeed: userMessages > 0 && assistantMessages > 0,
    canPlay,
    canSleep: sleepsToday < 2,
    sleepsToday,
  }));
}
