"use client";

import { useState } from "react";

const gameLabels = { tic_tac_toe: "〇✕ゲーム", othello: "オセロ", gomoku: "五目並べ" } as const;
type GameType = keyof typeof gameLabels;
type Cell = "user" | "ai" | null;
type MoveResponse = { error?: string; board?: Cell[]; result?: "win" | "lose" | "draw"; cpuMove?: number | null; recommendedMove?: number | null };
const sizes: Record<GameType, number> = { tic_tac_toe: 9, othello: 64, gomoku: 225 };
const initialOthello = (): Cell[] => { const board: Cell[] = Array(64).fill(null); board[27] = "ai"; board[28] = "user"; board[35] = "user"; board[36] = "ai"; return board; };
const othelloDirections = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function getOthelloLegalMoves(board: Cell[]): number[] {
  return board.flatMap((cell, index) => {
    if (cell !== null) return [];
    const row = Math.floor(index / 8); const column = index % 8;
    const valid = othelloDirections.some(([rowDelta, columnDelta]) => {
      let nextRow = row + rowDelta; let nextColumn = column + columnDelta; let opponentCount = 0;
      while (nextRow >= 0 && nextRow < 8 && nextColumn >= 0 && nextColumn < 8) {
        const nextCell = board[nextRow * 8 + nextColumn];
        if (nextCell === "ai") opponentCount += 1;
        else return opponentCount > 0 && nextCell === "user";
        nextRow += rowDelta; nextColumn += columnDelta;
      }
      return false;
    });
    return valid ? [index] : [];
  });
}

export default function GamesPanel() {
  const [game, setGame] = useState<GameType>("tic_tac_toe");
  const [board, setBoard] = useState<Cell[]>(() => Array(9).fill(null));
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<number[]>([]);
  const [recommendedMove, setRecommendedMove] = useState<number | null>(null);
  function selectGame(next: GameType) { setGame(next); setBoard(next === "othello" ? initialOthello() : Array(sizes[next]).fill(null)); setResult(""); setHistory([]); setRecommendedMove(next === "gomoku" ? 112 : null); }
  async function move(index: number) {
    if (board[index] !== null || result) return;
    const response = await fetch("/api/game", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gameType: game, board, index }) });
    const data = await response.json() as MoveResponse;
    if (!response.ok) { setResult(data.error ?? "ゲームに失敗しました。"); return; }
    if (!data.board) return;
    setBoard(data.board); setHistory((previous) => [...previous, index, ...(data.cpuMove === null || data.cpuMove === undefined ? [] : [data.cpuMove])]); setRecommendedMove(data.recommendedMove ?? null);
    if (data.result) setResult(data.result === "win" ? "あなたの勝ち！" : data.result === "lose" ? "ごっちの勝ち！" : "引き分け！");
  }
  const isOthello = game === "othello";
  const isGomoku = game === "gomoku";
  const legalMoves = isOthello ? getOthelloLegalMoves(board) : [];
  const counts = isOthello ? { user: board.filter((cell) => cell === "user").length, ai: board.filter((cell) => cell === "ai").length } : null;
  const gomokuCounts = isGomoku ? { user: board.filter((cell) => cell === "user").length, ai: board.filter((cell) => cell === "ai").length } : null;
  return <section className="care card"><h2>ミニゲーム</h2><div className="game-tabs">{(Object.keys(gameLabels) as GameType[]).map((type) => <button className={game === type ? "selected" : "secondary"} key={type} onClick={() => selectGame(type)}>{gameLabels[type]}</button>)}</div>{isOthello && <div className="othello-info"><div><strong>8×8</strong><span>黒が先手</span></div><div><strong>{counts?.user}</strong><span>黒</span></div><div><strong>{counts?.ai}</strong><span>白</span></div><div><strong>ふつう</strong><span>CPUの強さ</span></div><div><strong>黒</strong><span>あなたの色</span></div></div>}{isGomoku && <div className="othello-info"><div><strong>15×15</strong><span>黒が先手</span></div><div><strong>{gomokuCounts?.user}</strong><span>黒</span></div><div><strong>{gomokuCounts?.ai}</strong><span>白</span></div><div><strong>ふつう</strong><span>CPUの強さ</span></div><div><strong>黒</strong><span>あなたの色</span></div></div>}<div className={`board board-${game}`}>{board.map((cell, index) => {
    const isLegal = isOthello && legalMoves.includes(index);
    const isRecommended = isGomoku && recommendedMove === index;
    return <button className={`cell${isOthello && cell ? " othello-disc" : ""}${isLegal ? " legal-move" : ""}${isRecommended ? " recommended-move" : ""}`} key={index} onClick={() => void move(index)} aria-label={isOthello ? `${index + 1}マス目${cell === "user" ? "黒" : cell === "ai" ? "白" : isLegal ? "打てる場所" : "空き"}` : isGomoku && isRecommended ? `${index + 1}マス目おすすめ` : `${index + 1}マス目`}>
      {isOthello || isGomoku ? <span className={cell === "user" ? "disc-black" : cell === "ai" ? "disc-white" : ""} /> : cell === "user" ? "○" : cell === "ai" ? "×" : ""}
    </button>;
  })}</div>{(isOthello || isGomoku) && <div className="othello-footer">{isGomoku && <span>おすすめの手: <strong>{recommendedMove === null ? "ありません" : `${Math.floor(recommendedMove / 15) + 1}行 ${recommendedMove % 15 + 1}列`}</strong></span>}{isOthello && <span>打てる場所: <strong>{legalMoves.length}</strong></span>}<span>棋譜: {history.length ? history.map((moveIndex, moveNumber) => `${moveNumber % 2 === 0 ? "黒" : "白"}${Math.floor(moveIndex / (isGomoku ? 15 : 8)) + 1}-${moveIndex % (isGomoku ? 15 : 8) + 1}`).join(" → ") : "まだありません"}</span></div>}{result && <p>{result}</p>}<button className="secondary" onClick={() => selectGame(game)}>最初から</button></section>;
}
