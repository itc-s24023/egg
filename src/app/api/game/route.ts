import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionUserId } from "@/src/lib/security";
import { growthStage } from "@/src/lib/game";

const othelloDirections = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
type OthelloCell = "user" | "ai" | null;

function othelloFlips(board: OthelloCell[], index: number, player: "user" | "ai"): number[] {
  if (board[index] !== null) return [];
  const opponent = player === "user" ? "ai" : "user";
  const row = Math.floor(index / 8);
  const column = index % 8;
  const flips: number[] = [];
  for (const [rowDelta, columnDelta] of othelloDirections) {
    const line: number[] = [];
    let nextRow = row + rowDelta;
    let nextColumn = column + columnDelta;
    while (nextRow >= 0 && nextRow < 8 && nextColumn >= 0 && nextColumn < 8) {
      const nextIndex = nextRow * 8 + nextColumn;
      if (board[nextIndex] === opponent) line.push(nextIndex);
      else {
        if (line.length && board[nextIndex] === player) flips.push(...line);
        break;
      }
      nextRow += rowDelta;
      nextColumn += columnDelta;
    }
  }
  return flips;
}

function othelloLegalMoves(board: OthelloCell[], player: "user" | "ai"): number[] {
  return board.flatMap((cell, index) => cell === null && othelloFlips(board, index, player).length ? [index] : []);
}

function makeOthelloMove(board: OthelloCell[], index: number, player: "user" | "ai"): OthelloCell[] {
  const next = [...board];
  next[index] = player;
  for (const flip of othelloFlips(board, index, player)) next[flip] = player;
  return next;
}

function othelloCounts(board: OthelloCell[]) {
  return { user: board.filter((cell) => cell === "user").length, ai: board.filter((cell) => cell === "ai").length };
}

function othelloResult(board: OthelloCell[]): "win" | "lose" | "draw" | null {
  if (board.includes(null) && (othelloLegalMoves(board, "user").length || othelloLegalMoves(board, "ai").length)) return null;
  const counts = othelloCounts(board);
  return counts.user > counts.ai ? "win" : counts.user < counts.ai ? "lose" : "draw";
}

function chooseOthelloCpuMove(board: OthelloCell[], moves: number[]): number {
  const corners = new Set([0, 7, 56, 63]);
  return moves.reduce((best, move) => {
    const score = (corners.has(move) ? 100 : 0) + othelloFlips(board, move, "ai").length * 5;
    const bestScore = (corners.has(best) ? 100 : 0) + othelloFlips(board, best, "ai").length * 5;
    return score > bestScore ? move : best;
  }, moves[0]);
}

type GomokuCell = "user" | "ai" | null;

function hasGomokuWinner(board: GomokuCell[], player: "user" | "ai"): boolean {
  for (let row = 0; row < 15; row++) for (let column = 0; column < 15; column++) {
    for (const [rowDelta, columnDelta] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
      let count = 0;
      for (let offset = 0; offset < 5; offset++) {
        const nextRow = row + rowDelta * offset;
        const nextColumn = column + columnDelta * offset;
        if (nextRow < 0 || nextRow >= 15 || nextColumn < 0 || nextColumn >= 15) break;
        if (board[nextRow * 15 + nextColumn] !== player) break;
        count += 1;
      }
      if (count === 5) return true;
    }
  }
  return false;
}

function gomokuCounts(board: GomokuCell[]) {
  return { user: board.filter((cell) => cell === "user").length, ai: board.filter((cell) => cell === "ai").length };
}

function chooseGomokuMove(board: GomokuCell[], player: "user" | "ai"): number | null {
  const empty = board.flatMap((cell, index) => cell === null ? [index] : []);
  const winningMove = empty.find((move) => {
    const next = [...board];
    next[move] = player;
    return hasGomokuWinner(next, player);
  });
  if (winningMove !== undefined) return winningMove;
  const opponent = player === "user" ? "ai" : "user";
  const blockingMove = empty.find((move) => {
    const next = [...board];
    next[move] = opponent;
    return hasGomokuWinner(next, opponent);
  });
  if (blockingMove !== undefined) return blockingMove;
  return empty.sort((left, right) => {
    const leftDistance = Math.abs(Math.floor(left / 15) - 7) + Math.abs(left % 15 - 7);
    const rightDistance = Math.abs(Math.floor(right / 15) - 7) + Math.abs(right % 15 - 7);
    return leftDistance - rightDistance;
  })[0] ?? null;
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  const { choice, gameType = "rock_paper_scissors", board, index } = await request.json() as { choice?: "rock" | "paper" | "scissors"; gameType?: string; board?: Array<string | null>; index?: number };
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  const character = await prisma.character.findUnique({ where: { userId }, include: { status: true } });
  if (!character?.status) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });
  if (gameType === "othello") {
    if (!board || board.length !== 64 || typeof index !== "number" || !Number.isInteger(index) || index < 0 || index >= 64 || board.some((cell) => cell !== null && cell !== "user" && cell !== "ai")) {
      return NextResponse.json({ error: "不正な盤面です。" }, { status: 400 });
    }
    const selectedIndex = index;
    const othelloBoard = board as OthelloCell[];
    const userFlips = othelloFlips(othelloBoard, selectedIndex, "user");
    if (!userFlips.length) return NextResponse.json({ error: "そこには置けません。打てる場所を選んでください。" }, { status: 400 });
    let next = makeOthelloMove(othelloBoard, selectedIndex, "user");
    let result = othelloResult(next);
    if (!result) {
      const cpuMoves = othelloLegalMoves(next, "ai");
      if (cpuMoves.length) next = makeOthelloMove(next, chooseOthelloCpuMove(next, cpuMoves), "ai");
      result = othelloResult(next);
    }
    const counts = othelloCounts(next);
    const legalMoves = result ? [] : othelloLegalMoves(next, "user");
    if (result) {
      const experienceDelta = result === "win" ? 15 : result === "draw" ? 8 : 3;
      await prisma.$transaction([
        prisma.miniGameResult.create({ data: { characterId: character.id, gameType, result, experienceDelta, friendshipDelta: result === "win" ? 5 : 2 } }),
        prisma.character.update({ where: { id: character.id }, data: { experience: { increment: experienceDelta }, growthStage: growthStage(character.experience + experienceDelta) } }),
        prisma.characterStatus.update({ where: { characterId: character.id }, data: { friendship: Math.min(100, character.status.friendship + (result === "win" ? 5 : 2)) } }),
      ]);
    }
    return NextResponse.json({ board: next, result, counts, legalMoves });
  }
  if (gameType === "gomoku") {
    if (!board || board.length !== 225 || typeof index !== "number" || !Number.isInteger(index) || index < 0 || index >= 225 || board[index] !== null || board.some((cell) => cell !== null && cell !== "user" && cell !== "ai")) {
      return NextResponse.json({ error: "不正な盤面です。" }, { status: 400 });
    }
    const selectedIndex = index;
    let next = [...board] as GomokuCell[];
    next[selectedIndex] = "user";
    let result: "win" | "lose" | "draw" | null = hasGomokuWinner(next, "user") ? "win" : null;
    let cpuMove: number | null = null;
    if (!result) {
      cpuMove = chooseGomokuMove(next, "ai");
      if (cpuMove === null) result = "draw";
      else {
        next[cpuMove] = "ai";
        if (hasGomokuWinner(next, "ai")) result = "lose";
        else if (!next.includes(null)) result = "draw";
      }
    }
    const counts = gomokuCounts(next);
    const recommendedMove = result ? null : chooseGomokuMove(next, "user");
    if (result) {
      const experienceDelta = result === "win" ? 15 : result === "draw" ? 8 : 3;
      await prisma.$transaction([
        prisma.miniGameResult.create({ data: { characterId: character.id, gameType, result, experienceDelta, friendshipDelta: result === "win" ? 5 : 2 } }),
        prisma.character.update({ where: { id: character.id }, data: { experience: { increment: experienceDelta }, growthStage: growthStage(character.experience + experienceDelta) } }),
        prisma.characterStatus.update({ where: { characterId: character.id }, data: { friendship: Math.min(100, character.status.friendship + (result === "win" ? 5 : 2)) } }),
      ]);
    }
    return NextResponse.json({ board: next, result, counts, cpuMove, recommendedMove });
  }
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
