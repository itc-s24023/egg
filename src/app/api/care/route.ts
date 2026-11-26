import { NextResponse } from "next/server";
import {
  characterRef,
  getDb,
  historyCollection,
  serializeFirestore,
  Timestamp,
} from "@/src/lib/firestore";
import { clamp, careEffects, growthStage, personalityTypeAtHatch, type CareType } from "@/src/lib/game";
import { getSessionUserId } from "@/src/lib/security";
import { getJapanDayStart } from "@/src/lib/date";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });

  const { action } = await request.json() as { action?: CareType };
  if (!action || !(action in careEffects)) return NextResponse.json({ error: "不正なお世話です。" }, { status: 400 });

  const charRef = characterRef(userId);
  const characterSnapshot = await charRef.get();
  const character = characterSnapshot.data();
  if (!characterSnapshot.exists || !character?.status) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });

  const careRef = historyCollection(userId, "careActions");
  const careHistory = await careRef.get();
  const latestActionTime = (actionType: string) => careHistory.docs
    .filter((doc) => doc.get("actionType") === actionType)
    .map((doc) => doc.get("createdAt") as Timestamp)
    .sort((left, right) => right.toMillis() - left.toMillis())[0];
  if (action === "feed") {
    const lastFeedAt = latestActionTime("feed");
    const messages = lastFeedAt
      ? await historyCollection(userId, "messages").where("createdAt", ">", lastFeedAt).get()
      : await historyCollection(userId, "messages").get();
    if (!messages.docs.some((doc) => doc.get("role") === "user") || !messages.docs.some((doc) => doc.get("role") === "assistant")) {
      return NextResponse.json({ error: "ごはんをあげるには、AIと1回会話してください。" }, { status: 400 });
    }
  }
  if (action === "play") {
    const lastPlayAt = latestActionTime("play");
    const latestGameSnapshot = await historyCollection(userId, "miniGameResults").orderBy("createdAt", "desc").limit(1).get();
    const latestGameAt = latestGameSnapshot.docs[0]?.get("createdAt") as Timestamp | undefined;
    if (!latestGameAt || (lastPlayAt && latestGameAt.toMillis() <= lastPlayAt.toMillis())) {
      return NextResponse.json({ error: "遊ぶには、じゃんけんやミニゲームを1回プレイしてください。" }, { status: 400 });
    }
  }
  if (action === "sleep") {
    const todayCare = await careRef.where("createdAt", ">=", Timestamp.fromDate(getJapanDayStart())).get();
    if (todayCare.docs.filter((doc) => doc.get("actionType") === "sleep").length >= 2) {
      return NextResponse.json({ error: "寝かせるのは1日2回までです。明日また利用できます。" }, { status: 400 });
    }
  }

  const effect = careEffects[action];
  const updated = await getDb().runTransaction(async (transaction) => {
    const freshSnapshot = await transaction.get(charRef);
    const freshCharacter = freshSnapshot.data();
    if (!freshSnapshot.exists || !freshCharacter?.status) throw new Error("Character disappeared during care action");
    const now = Timestamp.now();
    const nextExperience = freshCharacter.experience + effect.experience;
    const status = freshCharacter.status;
    const nextStatus = {
      ...status,
      hunger: clamp(status.hunger + effect.hunger),
      energy: clamp(status.energy + effect.energy),
      friendship: clamp(status.friendship + effect.friendship),
      updatedAt: now,
    };
    const personalityType = freshCharacter.growthStage === "たまご" && nextExperience >= 150
      ? personalityTypeAtHatch(freshCharacter.name, nextStatus)
      : freshCharacter.personalityType;
    transaction.create(careRef.doc(), {
      actionType: action,
      experienceDelta: effect.experience,
      hungerDelta: effect.hunger,
      energyDelta: effect.energy,
      friendshipDelta: effect.friendship,
      createdAt: now,
    });
    transaction.update(charRef, {
      experience: nextExperience,
      growthStage: growthStage(nextExperience),
      personalityType,
      status: nextStatus,
      updatedAt: now,
    });
    return nextStatus;
  });
  return NextResponse.json({ status: serializeFirestore(updated) });
}
