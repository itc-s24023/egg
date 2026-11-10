module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security.ts [app-route] (ecmascript)");
;
;
;
const apiBaseUrl = process.env.NVIDIA_API_BASE_URL ?? "https://integrate.api.nvidia.com/v1";
const model = process.env.NVIDIA_MODEL ?? "nvidia/nemotron-3.5-bolt-e4b";
const nvidiaTimeoutMs = 15_000;
const nvidiaMaxAttempts = 3;
const maxHistoryMessages = 6;
const maxHistoryMessageChars = 300;
const maxPromptChars = 4_000;
const maxOutputTokens = 256;
function getErrorStatus(error) {
    if (typeof error !== "object" || error === null || !("status" in error)) return undefined;
    const status = error.status;
    return typeof status === "number" ? status : undefined;
}
async function generateNvidiaResponse(prompt, characterName, personalityType) {
    for(let attempt = 1; attempt <= nvidiaMaxAttempts; attempt += 1){
        const abortController = new AbortController();
        const timeout = setTimeout(()=>abortController.abort(), nvidiaTimeoutMs);
        try {
            const response = await fetch(`${apiBaseUrl}/chat/completions`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: `Bearer ${process.env.NVIDIA_API_KEY}`
                },
                signal: abortController.signal,
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "system",
                            content: `あなたはAIごっちのキャラクター「${characterName}」です。性格は${personalityType ?? "やさしい"}。短く親しみやすい日本語で返答してください。`
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: maxOutputTokens
                })
            });
            if (!response.ok) {
                const error = new Error(`NVIDIA API returned ${response.status}`);
                Object.assign(error, {
                    status: response.status
                });
                throw error;
            }
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content?.trim() ?? "";
            if (!reply) throw new Error("NVIDIA API returned an empty response");
            return reply;
        } catch (error) {
            const status = getErrorStatus(error);
            const retryable = status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
            if (!retryable || attempt === nvidiaMaxAttempts) throw error;
            const delay = 1000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 500);
            await new Promise((resolve)=>setTimeout(resolve, delay));
        } finally{
            clearTimeout(timeout);
        }
    }
    throw new Error("NVIDIA API request failed");
}
async function POST(request) {
    const userId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUserId"])();
    const { message } = await request.json();
    if (!userId) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "ログインが必要です。"
    }, {
        status: 401
    });
    if (!message?.trim() || message.length > 2000) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "メッセージを入力してください。"
    }, {
        status: 400
    });
    const character = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].character.findUnique({
        where: {
            userId
        },
        include: {
            status: true
        }
    });
    if (!character) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "キャラクターが見つかりません。"
    }, {
        status: 404
    });
    const recentMessages = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].conversationMessage.findMany({
        where: {
            characterId: character.id
        },
        orderBy: {
            createdAt: "desc"
        },
        take: maxHistoryMessages
    });
    const history = recentMessages.reverse().map((item)=>`${item.role === "user" ? "ユーザー" : "キャラクター"}: ${item.content.slice(0, maxHistoryMessageChars)}`).join("\n");
    const prompt = `これまでの会話:
${history ? `${history}\n` : ""}ユーザー: ${message.trim()}`.slice(0, maxPromptChars);
    let reply;
    if (!process.env.NVIDIA_API_KEY) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        reply = "お話しできてうれしいよ！もっと聞かせてね。";
    } else {
        try {
            reply = await generateNvidiaResponse(prompt, character.name, character.personalityType);
        } catch (error) {
            const errorStatus = getErrorStatus(error);
            console.error("NVIDIA API request failed", error instanceof Error ? error.message : "unknown error");
            if (errorStatus === 403 || error instanceof Error && error.message.includes("PERMISSION_DENIED")) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "NVIDIA APIの認証または権限を確認してください。"
                }, {
                    status: 503
                });
            }
            if (errorStatus === 410) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "NVIDIA APIのPublic API Endpointsが利用できません。NVIDIA API Catalogで利用権限を確認してください。"
                }, {
                    status: 503
                });
            }
            if (errorStatus === 404) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "NVIDIA APIで指定したモデルが見つかりません。NVIDIA_MODELをCatalogのモデルIDに設定してください。"
                }, {
                    status: 502
                });
            }
            if (error instanceof Error && (error.name === "AbortError" || error.message.includes("aborted"))) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "AIの応答に時間がかかっています。しばらくしてから再試行してください。"
                }, {
                    status: 504
                });
            }
            if (errorStatus === 503 || errorStatus === 429) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "NVIDIA APIが混雑しています。少し待ってから再試行してください。"
                }, {
                    status: 503
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "NVIDIA APIへの接続に失敗しました。しばらくしてから再試行してください。"
            }, {
                status: 502
            });
        }
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].conversationMessage.create({
            data: {
                characterId: character.id,
                role: "user",
                content: message.trim()
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].conversationMessage.create({
            data: {
                characterId: character.id,
                role: "assistant",
                content: reply
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].characterStatus.update({
            where: {
                characterId: character.id
            },
            data: {
                friendship: Math.min(100, (character.status?.friendship ?? 0) + 2)
            }
        })
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        reply
    });
}
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/lib/security.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSession",
    ()=>clearSession,
    "getSessionUserId",
    ()=>getSessionUserId,
    "hashPassword",
    ()=>hashPassword,
    "hashToken",
    ()=>hashToken,
    "setSession",
    ()=>setSession,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const cookieName = "ai-gocchi-session";
const secret = ()=>process.env.SESSION_SECRET ?? "development-only-change-me";
function hashPassword(password) {
    const salt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(16).toString("hex");
    return `${salt}:${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["scryptSync"])(password, salt, 64).toString("hex")}`;
}
function verifyPassword(password, stored) {
    const [salt, digest] = stored.split(":");
    if (!salt || !digest) return false;
    const actual = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["scryptSync"])(password, salt, 64);
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(actual, Buffer.from(digest, "hex"));
}
function hashToken(token) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(token).digest("hex");
}
async function setSession(userId) {
    const payload = Buffer.from(`${userId}.${Date.now()}`).toString("base64url");
    const signature = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", secret()).update(payload).digest("base64url");
    (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])()).set(cookieName, `${payload}.${signature}`, {
        httpOnly: true,
        sameSite: "lax",
        secure: ("TURBOPACK compile-time value", "development") === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30
    });
}
async function getSessionUserId() {
    const value = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])()).get(cookieName)?.value;
    if (!value) return null;
    const [payload, signature] = value.split(".");
    if (!payload || !signature) return null;
    const expected = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", secret()).update(payload).digest("base64url");
    if (signature.length !== expected.length || !(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(Buffer.from(signature), Buffer.from(expected))) return null;
    return Buffer.from(payload, "base64url").toString().split(".")[0] ?? null;
}
async function clearSession() {
    (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])()).delete(cookieName);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0hviauuvowwex._.js.map