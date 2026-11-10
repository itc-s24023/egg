import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { clamp, careEffects, growthStage, type CareType } from "@/src/lib/game";
import { getSessionUserId } from "@/src/lib/security";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  const { action } = await request.json() as { action?: CareType };
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  if (!action || !(action in careEffects)) return NextResponse.json({ error: "不正なお世話です。" }, { status: 400 });
  const character = await prisma.character.findUnique({ where: { userId }, include: { status: true } });
  if (!character?.status) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });
  const effect = careEffects[action];
  const updated = await prisma.$transaction(async (tx) => {
    const nextExperience = character.experience + effect.experience;
    await tx.careAction.create({ data: { characterId: character.id, actionType: action, experienceDelta: effect.experience, hungerDelta: effect.hunger, energyDelta: effect.energy, friendshipDelta: effect.friendship } });
    await tx.character.update({ where: { id: character.id }, data: { experience: nextExperience, growthStage: growthStage(nextExperience) } });
    return tx.characterStatus.update({ where: { characterId: character.id }, data: { hunger: clamp(character.status!.hunger + effect.hunger), energy: clamp(character.status!.energy + effect.energy), friendship: clamp(character.status!.friendship + effect.friendship) } });
  });
  return NextResponse.json({ status: updated });
}
