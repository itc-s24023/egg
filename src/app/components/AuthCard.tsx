"use client";

import type { FormEvent } from "react";

type AuthCardProps = {
  mode: "login" | "register";
  email: string;
  password: string;
  error: string;
  signingIn: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToggleMode: () => void;
  onGoogleLogin: () => void;
};

export default function AuthCard({
  mode,
  email,
  password,
  error,
  signingIn,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleMode,
  onGoogleLogin,
}: AuthCardProps) {
  const isLogin = mode === "login";

  return (
    <main className="auth">
      <section className="card">
        <p className="eyebrow">AI ごっち</p>
        <h1>あなただけの相棒を育てよう</h1>
        <p>話しかけたり、お世話をしたりしてキャラクターを育てます。</p>
        <form onSubmit={onSubmit}>
          <label>
            メールアドレス
            <input type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} required />
          </label>
          <label>
            パスワード
            <input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              minLength={8}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button>{isLogin ? "ログイン" : "アカウントを作成"}</button>
        </form>
        <button className="link" onClick={onToggleMode}>
          {isLogin ? "初めての方はこちら" : "ログインに戻る"}
        </button>
        <button className="google-login" type="button" onClick={onGoogleLogin} disabled={signingIn}>
          {signingIn ? "Googleに接続中..." : "Googleでログイン"}
        </button>
      </section>
    </main>
  );
}
