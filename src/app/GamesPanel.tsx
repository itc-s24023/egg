"use client";

import { useState } from "react";

type GamesPanelProps = {
  onGameComplete?: () => void;
};

const gameLabels = { tic_tac_toe: "〇✕ゲーム", othello: "オセロ", gomoku: "五目並べ" } as const;
type GameType = keyof typeof gameLabels;
const sizes: Record<GameType, number> = { tic_tac_toe: 9, othello: 64, gomoku: 225 };
const initialOthello = () => { const board = Array<string | null>(64).fill(null); board[27] = "ai"; board[28] = "user"; board[35] = "user"; board[36] = "ai"; return board; };

export default function GamesPanel({ onGameComplete }: GamesPanelProps) {
  const [game, setGame] = useState<GameType>("tic_tac_toe");
  const [board, setBoard] = useState<Array<string | null>>(() => Array(9).fill(null));
  const [result, setResult] = useState("");
  const [thinking, setThinking] = useState(false);
  function selectGame(next: GameType) { setGame(next); setBoard(next === "othello" ? initialOthello() : Array(sizes[next]).fill(null)); setResult(""); setThinking(false); }
  async function move(index: number) {
    if (board[index] !== null || result || thinking) return;
    setThinking(true);
    try {
      const response = await fetch("/api/game", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gameType: game, board, index }) });
      const data = await response.json();
      if (!response.ok) { setResult(data.error); return; }
      setBoard(data.board);
      onGameComplete?.();
      if (data.result) setResult(data.result === "win" ? "あなたの勝ち！" : data.result === "lose" ? "ごっちの勝ち！" : "引き分け！");
    } finally {
      setThinking(false);
    }
  }
  return <section className="care card"><h2>ミニゲーム</h2><div className="game-tabs">{(Object.keys(gameLabels) as GameType[]).map((type) => <button className={game === type ? "selected" : "secondary"} key={type} onClick={() => selectGame(type)}>{gameLabels[type]}</button>)}</div><div className={`board board-${game}`}>{board.map((cell, index) => <button className="cell" key={index} disabled={thinking} onClick={() => void move(index)}>{cell === "user" ? "○" : cell === "ai" ? "×" : ""}</button>)}</div>{thinking && <p className="thinking" role="status">ごっちが考え中…</p>}{result && <p>{result}</p>}<button className="secondary" onClick={() => selectGame(game)}>最初から</button></section>;
}
