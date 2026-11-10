import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionUserId } from "@/src/lib/security";

const apiBaseUrl = process.env.NVIDIA_API_BASE_URL ?? "https://integrate.api.nvidia.com/v1";
 const model = process.env.NVIDIA_MODEL ?? "nvidia/nemotron-3.5-bolt-e4b";
const nvidiaTimeoutMs = 15_000;
const nvidiaMaxAttempts = 3;
const maxHistoryMessages = 6;
const maxHistoryMessageChars = 300;
const maxPromptChars = 4_000;
const maxOutputTokens = 256;

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("status" in error)) return undefined;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

async function generateNvidiaResponse(
  prompt: string,
  characterName: string,
  personalityType: string | null,
): Promise<string> {
  for (let attempt = 1; attempt <= nvidiaMaxAttempts; attempt += 1) {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), nvidiaTimeoutMs);
    try {
      const response = await fetch(`${apiBaseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        },
        signal: abortController.signal,
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: `あなたはAIごっちのキャラクター「${characterName}」です。性格は${personalityType ?? "やさしい"}。短く親しみやすい日本語で返答してください。`,
            },
            { role: "user", content: prompt },
          ],
          max_tokens: maxOutputTokens,
        }),
      });
      if (!response.ok) {
        const error = new Error(`NVIDIA API returned ${response.status}`);
        Object.assign(error, { status: response.status });
        throw error;
      }
      const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const reply = data.choices?.[0]?.message?.content?.trim() ?? "";
      if (!reply) throw new Error("NVIDIA API returned an empty response");
      return reply;
    } catch (error) {
      const status = getErrorStatus(error);
      const retryable = status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
      if (!retryable || attempt === nvidiaMaxAttempts) throw error;
      const delay = 1000 * (2 ** (attempt - 1)) + Math.floor(Math.random() * 500);
      await new Promise((resolve) => setTimeout(resolve, delay));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error("NVIDIA API request failed");
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  const { message } = await request.json() as { message?: string };
  if (!userId) return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  if (!message?.trim() || message.length > 2000) return NextResponse.json({ error: "メッセージを入力してください。" }, { status: 400 });
  const character = await prisma.character.findUnique({ where: { userId }, include: { status: true } });
  if (!character) return NextResponse.json({ error: "キャラクターが見つかりません。" }, { status: 404 });
  const recentMessages = await prisma.conversationMessage.findMany({
    where: { characterId: character.id },
    orderBy: { createdAt: "desc" },
    take: maxHistoryMessages,
  });
  const history = recentMessages.reverse()
    .map((item) => `${item.role === "user" ? "ユーザー" : "キャラクター"}: ${item.content.slice(0, maxHistoryMessageChars)}`)
    .join("\n");
  const prompt = `これまでの会話:
${history ? `${history}\n` : ""}ユーザー: ${message.trim()}`.slice(0, maxPromptChars);
  let reply: string;
  if (!process.env.NVIDIA_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "AI機能の設定が完了していません。" }, { status: 503 });
    }
    reply = "お話しできてうれしいよ！もっと聞かせてね。";
  } else {
    try {
      reply = await generateNvidiaResponse(prompt, character.name, character.personalityType);
    } catch (error) {
      const errorStatus = getErrorStatus(error);
      console.error("NVIDIA API request failed", error instanceof Error ? error.message : "unknown error");
      if (errorStatus === 403 || (error instanceof Error && error.message.includes("PERMISSION_DENIED"))) {
        return NextResponse.json({ error: "NVIDIA APIの認証または権限を確認してください。" }, { status: 503 });
      }
      if (errorStatus === 410) {
        return NextResponse.json({ error: "NVIDIA APIのPublic API Endpointsが利用できません。NVIDIA API Catalogで利用権限を確認してください。" }, { status: 503 });
      }
      if (errorStatus === 404) {
        return NextResponse.json({ error: "NVIDIA APIで指定したモデルが見つかりません。NVIDIA_MODELをCatalogのモデルIDに設定してください。" }, { status: 502 });
      }
      if (error instanceof Error && (error.name === "AbortError" || error.message.includes("aborted"))) {
        return NextResponse.json({ error: "AIの応答に時間がかかっています。しばらくしてから再試行してください。" }, { status: 504 });
      }
      if (errorStatus === 503 || errorStatus === 429) {
        return NextResponse.json({ error: "NVIDIA APIが混雑しています。少し待ってから再試行してください。" }, { status: 503 });
      }
      return NextResponse.json({ error: "NVIDIA APIへの接続に失敗しました。しばらくしてから再試行してください。" }, { status: 502 });
    }
  }
  await prisma.$transaction([
    prisma.conversationMessage.create({ data: { characterId: character.id, role: "user", content: message.trim() } }),
    prisma.conversationMessage.create({ data: { characterId: character.id, role: "assistant", content: reply } }),
    prisma.characterStatus.update({ where: { characterId: character.id }, data: { friendship: Math.min(100, (character.status?.friendship ?? 0) + 2) } }),
  ]);
  return NextResponse.json({ reply });
}
