import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "AIごっち",
  description: "あなただけのAIキャラクターを育てるゲーム",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
