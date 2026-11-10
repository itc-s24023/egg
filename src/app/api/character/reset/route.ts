import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionUserId } from "@/src/lib/security";

function serializeBigInts<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_, item) => typeof item === "bigint" ? item.toString() : item)) as T;
}

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  const current = await prisma.character.findUnique({ where: { userId } });
  if (!current) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });
  const character = await prisma.$transaction(async (tx) => {
    await tx.character.delete({ where: { id: current.id } });
    return tx.character.create({ data: { userId, name: "ごっち", status: { create: {} } }, include: { status: true, messages: true } });
  });
  return NextResponse.json({ character: serializeBigInts(character) });
}
