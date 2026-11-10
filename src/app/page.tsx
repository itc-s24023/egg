"use client";

import { useEffect, useState, type FormEvent } from "react";
import "./styles.css";
import AuthCard from "./components/AuthCard";
import CarePanel from "./components/CarePanel";
import CharacterSummary from "./components/CharacterSummary";
import ChatPanel from "./components/ChatPanel";
import RpsPanel from "./components/RpsPanel";
import SettingsPanel from "./components/SettingsPanel";
import StatusCard from "./components/StatusCard";
import GamesPanel from "./GamesPanel";
import type { Analysis, AppState } from "./types";

export default function Home() {
  const [auth, setAuth] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<AppState | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const load = async () => {
    const response = await fetch("/api/state");
    if (response.ok) setState(await response.json());
  };

  useEffect(() => {
    void load();
  }, []);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch(`/api/auth/${auth}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error);
    else await load();
  }

  async function care(action: "feed" | "play" | "sleep") {
    const response = await fetch("/api/care", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (response.ok) await load();
  }

  async function chat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error);
    else {
      setMessage("");
      await load();
    }
    setSending(false);
  }

  async function playRps(choice: "rock" | "paper" | "scissors") {
    const response = await fetch("/api/game", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ choice }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error);
    else {
      setGameResult(
        `相手は${data.opponent}。${
          data.result === "win" ? "あなたの勝ち！" : data.result === "lose" ? "あなたの負け…" : "引き分け！"
        }`,
      );
      await load();
    }
  }

  async function analyze() {
    const response = await fetch("/api/analysis");
    const data = await response.json();
    if (!response.ok) setError(data.error);
    else setAnalysis(data);
  }

  async function resetCharacter() {
    if (!window.confirm("育成データと会話履歴をすべて初期化しますか？")) return;
    const response = await fetch("/api/character/reset", { method: "POST" });
    if (response.ok) {
      setAnalysis(null);
      await load();
    }
  }

  if (!state?.character) {
    return (
      <AuthCard
        mode={auth}
        email={email}
        password={password}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={submitAuth}
        onToggleMode={() => setAuth(auth === "login" ? "register" : "login")}
      />
    );
  }

  const { character } = state;
  return (
    <main className="dashboard">
      <header>
        <div>
          <p className="eyebrow">AI ごっち</p>
          <h1>{character.name}のお部屋</h1>
        </div>
        <button
          className="secondary"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            setState(null);
          }}
        >
          ログアウト
        </button>
      </header>
      <CharacterSummary character={character} />
      <StatusCard character={character} />
      <CarePanel onCare={(action) => void care(action)} />
      <RpsPanel result={gameResult} onPlay={(choice) => void playRps(choice)} />
      <GamesPanel />
      <ChatPanel
        character={character}
        message={message}
        sending={sending}
        error={error}
        onMessageChange={setMessage}
        onSubmit={chat}
      />
      <SettingsPanel analysis={analysis} onAnalyze={() => void analyze()} onReset={() => void resetCharacter()} />
    </main>
  );
}
