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
"[project]/src/app/api/game/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/game.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(request) {
    const userId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUserId"])();
    const { choice, gameType = "rock_paper_scissors", board, index } = await request.json();
    if (!userId) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "ログインが必要です。"
    }, {
        status: 401
    });
    const character = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].character.findUnique({
        where: {
            userId
        },
        include: {
            status: true
        }
    });
    if (!character?.status) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "キャラクターが見つかりません。"
    }, {
        status: 404
    });
    if ([
        "tic_tac_toe",
        "othello",
        "gomoku"
    ].includes(gameType)) {
        const size = gameType === "tic_tac_toe" ? 9 : gameType === "othello" ? 64 : 225;
        if (!board || board.length !== size || !Number.isInteger(index) || typeof index !== "number" || index < 0 || index >= size || board[index] !== null) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "不正な盤面です。"
            }, {
                status: 400
            });
        }
        const selectedIndex = index;
        const next = [
            ...board
        ];
        next[selectedIndex] = "user";
        const lines = gameType === "tic_tac_toe" ? [
            [
                0,
                1,
                2
            ],
            [
                3,
                4,
                5
            ],
            [
                6,
                7,
                8
            ],
            [
                0,
                3,
                6
            ],
            [
                1,
                4,
                7
            ],
            [
                2,
                5,
                8
            ],
            [
                0,
                4,
                8
            ],
            [
                2,
                4,
                6
            ]
        ] : [];
        const hasGomokuWinner = (mark)=>{
            if (gameType !== "gomoku") return false;
            for(let row = 0; row < 15; row++)for(let column = 0; column < 15; column++){
                for (const [dr, dc] of [
                    [
                        1,
                        0
                    ],
                    [
                        0,
                        1
                    ],
                    [
                        1,
                        1
                    ],
                    [
                        1,
                        -1
                    ]
                ]){
                    if (Array.from({
                        length: 5
                    }).every((_, offset)=>{
                        const nextRow = row + dr * offset;
                        const nextColumn = column + dc * offset;
                        return nextRow >= 0 && nextRow < 15 && nextColumn >= 0 && nextColumn < 15 && next[nextRow * 15 + nextColumn] === mark;
                    })) return true;
                }
            }
            return false;
        };
        const hasWinner = (mark)=>lines.some((line)=>line.every((cell)=>next[cell] === mark)) || hasGomokuWinner(mark);
        let result = hasWinner("user") ? "win" : null;
        const empty = next.map((cell, cellIndex)=>cell === null ? cellIndex : -1).filter((cellIndex)=>cellIndex >= 0);
        if (!result && empty.length) next[empty[Math.floor(Math.random() * empty.length)]] = "ai";
        if (!result && hasWinner("ai")) result = "lose";
        if (!result && !next.includes(null)) result = "draw";
        if (result) {
            const experienceDelta = result === "win" ? 15 : result === "draw" ? 8 : 3;
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction([
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].miniGameResult.create({
                    data: {
                        characterId: character.id,
                        gameType,
                        result,
                        experienceDelta,
                        friendshipDelta: result === "win" ? 5 : 2
                    }
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].character.update({
                    where: {
                        id: character.id
                    },
                    data: {
                        experience: {
                            increment: experienceDelta
                        }
                    }
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].characterStatus.update({
                    where: {
                        characterId: character.id
                    },
                    data: {
                        friendship: Math.min(100, character.status.friendship + 2)
                    }
                })
            ]);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            board: next,
            result
        });
    }
    if (gameType !== "rock_paper_scissors") return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "不正なゲームです。"
    }, {
        status: 400
    });
    if (!choice || ![
        "rock",
        "paper",
        "scissors"
    ].includes(choice)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "不正な選択です。"
    }, {
        status: 400
    });
    const options = [
        "rock",
        "paper",
        "scissors"
    ];
    const opponent = options[Math.floor(Math.random() * options.length)];
    const result = choice === opponent ? "draw" : choice === "rock" && opponent === "scissors" || choice === "paper" && opponent === "rock" || choice === "scissors" && opponent === "paper" ? "win" : "lose";
    const experienceDelta = result === "win" ? 15 : result === "draw" ? 8 : 3;
    const nextExperience = character.experience + experienceDelta;
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].miniGameResult.create({
            data: {
                characterId: character.id,
                gameType: "rock_paper_scissors",
                result,
                experienceDelta,
                friendshipDelta: result === "win" ? 5 : 2
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].character.update({
            where: {
                id: character.id
            },
            data: {
                experience: nextExperience,
                growthStage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["growthStage"])(nextExperience)
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].characterStatus.update({
            where: {
                characterId: character.id
            },
            data: {
                friendship: Math.min(100, character.status.friendship + (result === "win" ? 5 : 2))
            }
        })
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        opponent,
        result
    });
}
}),
"[project]/src/lib/game.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "careEffects",
    ()=>careEffects,
    "clamp",
    ()=>clamp,
    "growthStage",
    ()=>growthStage
]);
const careEffects = {
    feed: {
        experience: 10,
        hunger: 20,
        energy: 0,
        friendship: 2
    },
    play: {
        experience: 15,
        hunger: -5,
        energy: -10,
        friendship: 8
    },
    sleep: {
        experience: 8,
        hunger: -2,
        energy: 25,
        friendship: 3
    }
};
function growthStage(experience) {
    if (experience >= 300) return "せいちょう";
    if (experience >= 100) return "こども";
    return "たまご";
}
function clamp(value) {
    return Math.max(0, Math.min(100, value));
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0d13-2sr61ezn._.js.map