import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionUserId } from "@/src/lib/security";
import { growthStage } from "@/src/lib/game";
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  const { choice, gameType = "rock_paper_scissors", board, index } = await request.json() as { choice?: "rock" | "paper" | "scissors"; gameType?: string; board?: Array<string | null>; index?: number };
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  const character = await prisma.character.findUnique({ where: { userId }, include: { status: true } });
  if (!character?.status) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });
  if (["tic_tac_toe", "othello", "gomoku"].includes(gameType)) {
    const size = gameType === "tic_tac_toe" ? 9 : gameType === "othello" ? 64 : 225;
    if (!board || board.length !== size || !Number.isInteger(index) || typeof index !== "number" || index < 0 || index >= size || board[index] !== null) {
      return NextResponse.json({ error: "不正な盤面です。" }, { status: 400 });
    }
    const selectedIndex = index;
    const next = [...board]; next[selectedIndex] = "user";
    const lines = gameType === "tic_tac_toe"
      ? [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
      : [];
    const hasGomokuWinner = (mark: string) => {
      if (gameType !== "gomoku") return false;
      for (let row = 0; row < 15; row++) for (let column = 0; column < 15; column++) {
        for (const [dr, dc] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
          if (Array.from({ length: 5 }).every((_, offset) => {
            const nextRow = row + dr * offset; const nextColumn = column + dc * offset;
            return nextRow >= 0 && nextRow < 15 && nextColumn >= 0 && nextColumn < 15 && next[nextRow * 15 + nextColumn] === mark;
          })) return true;
        }
      }
      return false;
    };
    const hasWinner = (mark: string) => lines.some((line) => line.every((cell) => next[cell] === mark)) || hasGomokuWinner(mark);
    let result: "win" | "lose" | "draw" | null = hasWinner("user") ? "win" : null;
    const empty = next.map((cell, cellIndex) => cell === null ? cellIndex : -1).filter((cellIndex) => cellIndex >= 0);
    if (!result && empty.length) next[empty[Math.floor(Math.random() * empty.length)]] = "ai";
    if (!result && hasWinner("ai")) result = "lose";
    if (!result && !next.includes(null)) result = "draw";
    if (result) {
      const experienceDelta = result === "win" ? 15 : result === "draw" ? 8 : 3;
      await prisma.$transaction([
        prisma.miniGameResult.create({ data: { characterId: character.id, gameType, result, experienceDelta, friendshipDelta: result === "win" ? 5 : 2 } }),
        prisma.character.update({ where: { id: character.id }, data: { experience: { increment: experienceDelta } } }),
        prisma.characterStatus.update({ where: { characterId: character.id }, data: { friendship: Math.min(100, character.status.friendship + 2) } }),
      ]);
    }
    return NextResponse.json({ board: next, result });
  }
  if (gameType !== "rock_paper_scissors") return NextResponse.json({ error: "不正なゲームです。" }, { status: 400 });
  if (!choice || !["rock", "paper", "scissors"].includes(choice)) return NextResponse.json({ error: "不正な選択です。" }, { status: 400 });
  const options = ["rock", "paper", "scissors"] as const;
  const opponent = options[Math.floor(Math.random() * options.length)];
  const result = choice === opponent ? "draw" : (choice === "rock" && opponent === "scissors") || (choice === "paper" && opponent === "rock") || (choice === "scissors" && opponent === "paper") ? "win" : "lose";
  const experienceDelta = result === "win" ? 15 : result === "draw" ? 8 : 3;
  const nextExperience = character.experience + experienceDelta;
  await prisma.$transaction([
    prisma.miniGameResult.create({ data: { characterId: character.id, gameType: "rock_paper_scissors", result, experienceDelta, friendshipDelta: result === "win" ? 5 : 2 } }),
    prisma.character.update({ where: { id: character.id }, data: { experience: nextExperience, growthStage: growthStage(nextExperience) } }),
    prisma.characterStatus.update({ where: { characterId: character.id }, data: { friendship: Math.min(100, character.status.friendship + (result === "win" ? 5 : 2)) } }),
  ]);
  return NextResponse.json({ opponent, result });
}
