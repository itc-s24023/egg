import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionUserId } from "@/src/lib/security";
import { growthStage } from "@/src/lib/game";

const ticTacToeLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function chooseTicTacToeMove(board: Array<string | null>): number {
  const empty = board.flatMap((cell, index) => cell === null ? [index] : []);
  const winningMove = (mark: string) => ticTacToeLines.find((line) => {
    const marks = line.filter((cell) => board[cell] === mark).length;
    const vacant = line.find((cell) => board[cell] === null);
    return marks === 2 && vacant !== undefined;
  })?.find((cell) => board[cell] === null);
  if (Math.random() > 0.3) {
    const move = winningMove("ai") ?? winningMove("user");
    if (move !== undefined) return move;
    if (board[4] === null) return 4;
    const corners = [0, 2, 6, 8].filter((index) => board[index] === null);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  }
  return empty[Math.floor(Math.random() * empty.length)];
}

function chooseGomokuMove(board: Array<string | null>): number {
  const empty = board.flatMap((cell, index) => cell === null ? [index] : []);
  const findThreat = (mark: string) => {
    for (const index of empty) {
      const candidate = [...board]; candidate[index] = mark;
      for (let row = 0; row < 15; row++) for (let column = 0; column < 15; column++) {
        for (const [dr, dc] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
          if (Array.from({ length: 5 }).every((_, offset) => {
            const nextRow = row + dr * offset; const nextColumn = column + dc * offset;
            return nextRow >= 0 && nextRow < 15 && nextColumn >= 0 && nextColumn < 15 && candidate[nextRow * 15 + nextColumn] === mark;
          })) return index;
        }
      }
    }
    return undefined;
  };
  if (Math.random() > 0.3) return findThreat("ai") ?? findThreat("user") ?? empty[Math.floor(Math.random() * empty.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}

function getOthelloFlips(board: Array<string | null>, index: number, mark: "user" | "ai"): number[] {
  if (board[index] !== null) return [];
  const row = Math.floor(index / 8); const column = index % 8; const opponent = mark === "ai" ? "user" : "ai";
  const flips: number[] = [];
  for (const [dr, dc] of directions) {
    const line: number[] = [];
    let nextRow = row + dr; let nextColumn = column + dc;
    while (nextRow >= 0 && nextRow < 8 && nextColumn >= 0 && nextColumn < 8 && board[nextRow * 8 + nextColumn] === opponent) {
      line.push(nextRow * 8 + nextColumn); nextRow += dr; nextColumn += dc;
    }
    if (line.length && nextRow >= 0 && nextRow < 8 && nextColumn >= 0 && nextColumn < 8 && board[nextRow * 8 + nextColumn] === mark) flips.push(...line);
  }
  return flips;
}

function chooseOthelloMove(board: Array<string | null>): { index: number; flips: number[] } | null {
  const moves = board.flatMap((_, index) => {
    const flips = getOthelloFlips(board, index, "ai");
    return flips.length ? [{ index, flips }] : [];
  });
  if (!moves.length) return null;
  if (Math.random() <= 0.3) return moves[Math.floor(Math.random() * moves.length)];
  return moves.sort((a, b) => b.flips.length - a.flips.length)[0];
}

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
    const next = [...board];
    if (gameType === "othello") {
      const userFlips = getOthelloFlips(next, selectedIndex, "user");
      if (!userFlips.length) return NextResponse.json({ error: "そこには置けません。" }, { status: 400 });
      next[selectedIndex] = "user";
      userFlips.forEach((cell) => { next[cell] = "user"; });
    } else {
      next[selectedIndex] = "user";
    }
    const lines = gameType === "tic_tac_toe" ? ticTacToeLines : [];
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
    if (!result && empty.length) {
      if (gameType === "tic_tac_toe") next[chooseTicTacToeMove(next)] = "ai";
      else if (gameType === "gomoku") next[chooseGomokuMove(next)] = "ai";
      else {
        const move = chooseOthelloMove(next);
        if (move) { next[move.index] = "ai"; move.flips.forEach((cell) => { next[cell] = "ai"; }); }
        else {
          const userMoves = next.flatMap((_, cell) => getOthelloFlips(next, cell, "user").length ? [cell] : []);
          if (userMoves.length === 0) result = "draw";
        }
      }
    }
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
    await new Promise((resolve) => setTimeout(resolve, 600));
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
