import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionUserId } from "@/src/lib/security";

function serializeBigInts<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_, item) => typeof item === "bigint" ? item.toString() : item)) as T;
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  const character = await prisma.character.findUnique({ where: { userId }, include: { status: true, messages: { orderBy: { createdAt: "desc" }, take: 20 } } });
  return NextResponse.json({ character: serializeBigInts(character) });
}
