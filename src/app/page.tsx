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
import { FirebaseError } from "firebase/app";
import {
  registerWithEmail,
  signInWithEmail,
  signOutFromFirebase,
} from "@/src/lib/firebase";

type ApiResponse = { error?: string };

async function readJson<T>(response: Response): Promise<T | null> {
  const body = await response.text();
  if (!body.trim()) return null;
  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

export default function Home() {
  const [auth, setAuth] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<AppState | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [gameResultType, setGameResultType] = useState<"win" | "lose" | "draw" | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const load = async () => {
    const response = await fetch("/api/state");
    if (response.ok) {
      const data = await readJson<AppState>(response);
      if (data) setState(data);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSigningIn(true);
    try {
      const idToken = auth === "register"
        ? await registerWithEmail(email, password)
        : await signInWithEmail(email, password);
      await completeFirebaseLogin(idToken);
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSigningIn(false);
    }
  }

  function getAuthErrorMessage(authError: unknown): string {
    if (!(authError instanceof FirebaseError)) {
      return "認証を完了できませんでした。時間をおいて再試行してください。";
    }
    switch (authError.code) {
      case "auth/email-already-in-use":
        return "このメールアドレスは既にFirebaseに登録されています。ログインしてください。";
      case "auth/invalid-email":
        return "メールアドレスの形式を確認してください。";
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "メールアドレスまたはパスワードが正しくありません。";
      case "auth/weak-password":
        return "パスワードは8文字以上で設定してください。";
      case "auth/operation-not-allowed":
        return "Firebase ConsoleでAuthenticationのメール/パスワードまたはGoogleプロバイダーを有効にしてください。";
      case "auth/network-request-failed":
        return "Firebaseに接続できません。ネットワークとFirebaseの設定を確認してください。";
      case "auth/too-many-requests":
        return "ログイン試行が多すぎます。しばらく待ってから再試行してください。";
      case "auth/unauthorized-domain":
        return "Firebase Authenticationの承認済みドメインに、このサイトのドメインを追加してください。";
      case "auth/invalid-api-key":
        return "FirebaseのAPIキーが正しくありません。.envのNEXT_PUBLIC_FIREBASE_API_KEYを確認してください。";
      case "auth/popup-blocked":
        return "ブラウザーのポップアップを許可してから再試行してください。";
      case "auth/popup-closed-by-user":
        return "Googleログインがキャンセルされました。";
      default:
        return "認証を完了できませんでした。Firebase Authenticationの設定を確認してください。";
    }
  }

  async function completeFirebaseLogin(idToken: string) {
    const response = await fetch("/api/auth/firebase", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const data = await readJson<ApiResponse>(response);
    if (!response.ok) {
      setError(data?.error ?? "Firebaseログインに失敗しました。");
      return;
    }
    await load();
  }

  async function googleLogin() {
    setError("");
    setSigningIn(true);
    try {
      const { signInWithGoogle } = await import("@/src/lib/firebase");
      const idToken = await signInWithGoogle();
      await completeFirebaseLogin(idToken);
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSigningIn(false);
    }
  }

  async function care(action: "feed" | "play" | "sleep") {
    setError("");
    const response = await fetch("/api/care", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await readJson<ApiResponse>(response);
    if (response.ok) await load();
    else setError(data?.error ?? "お世話の実行に失敗しました。");
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
    const data = await readJson<ApiResponse>(response);
    if (!response.ok) setError(data?.error ?? "メッセージの送信に失敗しました。");
    else {
      setMessage("");
      await load();
    }
    setSending(false);
  }

  async function playRps(choice: "rock" | "paper" | "scissors") {
    setGameResult("");
    setGameResultType(null);
    const response = await fetch("/api/game", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ choice }),
    });
    const data = await readJson<ApiResponse & { opponent?: string; result?: "win" | "lose" | "draw" }>(response);
    if (!response.ok) setError(data?.error ?? "ゲームの実行に失敗しました。");
    else if (data?.opponent && data.result) {
      setGameResultType(data.result);
      setGameResult(
        `相手は${data.opponent}。${
          data.result === "win" ? "あなたの勝ち！" : data.result === "lose" ? "負けても大丈夫。次はきっと勝てるよ！" : "引き分け！"
        }`,
      );
      await load();
    }
  }

  async function analyze() {
    const response = await fetch("/api/analysis");
    const data = await readJson<Analysis & ApiResponse>(response);
    if (!response.ok) setError(data?.error ?? "分析に失敗しました。");
    else if (data) setAnalysis(data);
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
        signingIn={signingIn}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={submitAuth}
        onToggleMode={() => setAuth(auth === "login" ? "register" : "login")}
        onGoogleLogin={() => void googleLogin()}
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
            await signOutFromFirebase();
            setState(null);
          }}
        >
          ログアウト
        </button>
      </header>
      <CharacterSummary character={character} />
      <StatusCard character={character} />
      <CarePanel
        canFeed={state.canFeed}
        canPlay={state.canPlay}
        canSleep={state.canSleep}
        sleepsToday={state.sleepsToday}
        onCare={(action) => void care(action)}
      />
      <RpsPanel result={gameResult} resultType={gameResultType} onPlay={(choice) => void playRps(choice)} />
      <GamesPanel onGameComplete={() => void load()} />
      <ChatPanel
        character={character}
        message={message}
        sending={sending}
        error={error}
        onMessageChange={setMessage}
        onSubmit={chat}
      />
      <SettingsPanel
        analysis={analysis}
        growthStage={character.growthStage}
        personalityType={character.personalityType}
        onAnalyze={() => void analyze()}
        onReset={() => void resetCharacter()}
      />
    </main>
  );
}
