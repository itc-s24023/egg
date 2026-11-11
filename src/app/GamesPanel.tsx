"use client";

import { useState } from "react";

const gameLabels = { tic_tac_toe: "〇✕ゲーム", othello: "オセロ", gomoku: "五目並べ" } as const;
type GameType = keyof typeof gameLabels;
const sizes: Record<GameType, number> = { tic_tac_toe: 9, othello: 64, gomoku: 225 };
const initialOthello = () => { const board = Array<string | null>(64).fill(null); board[27] = "ai"; board[28] = "user"; board[35] = "user"; board[36] = "ai"; return board; };

export default function GamesPanel({ onGameComplete }: { onGameComplete: () => void }) {
  const [game, setGame] = useState<GameType>("tic_tac_toe");
  const [board, setBoard] = useState<Array<string | null>>(() => Array(9).fill(null));
  const [result, setResult] = useState("");
  function selectGame(next: GameType) { setGame(next); setBoard(next === "othello" ? initialOthello() : Array(sizes[next]).fill(null)); setResult(""); }
  async function move(index: number) {
    if (board[index] !== null || result) return;
    const response = await fetch("/api/game", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gameType: game, board, index }) });
    const data = await response.json();
    if (!response.ok) { setResult(data.error); return; }
    setBoard(data.board);
    if (data.result) {
      setResult(data.result === "win" ? "あなたの勝ち！" : data.result === "lose" ? "ごっちの勝ち！" : "引き分け！");
      onGameComplete();
    }
  }
  return <section className="care card"><h2>ミニゲーム</h2><div className="game-tabs">{(Object.keys(gameLabels) as GameType[]).map((type) => <button className={game === type ? "selected" : "secondary"} key={type} onClick={() => selectGame(type)}>{gameLabels[type]}</button>)}</div><div className={`board board-${game}`}>{board.map((cell, index) => {
    const isOthello = game === "othello";
    return <button className={`cell${isOthello && cell ? " othello-disc" : ""}`} key={index} onClick={() => void move(index)} aria-label={isOthello ? `${index + 1}マス目${cell === "user" ? "黒" : cell === "ai" ? "白" : "空き"}` : `${index + 1}マス目`}>
      {isOthello ? <span className={cell === "user" ? "disc-black" : cell === "ai" ? "disc-white" : ""} /> : cell === "user" ? "○" : cell === "ai" ? "×" : ""}
    </button>;
  })}</div>{result && <p>{result}</p>}<button className="secondary" onClick={() => selectGame(game)}>最初から</button></section>;
}
