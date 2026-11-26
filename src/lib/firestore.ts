import "server-only";

import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Timestamp, getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  const existing = getApps().find((app) => app.name === "ai-gocchi");
  if (existing) return existing;

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId) throw new Error("FIREBASE_PROJECT_ID または NEXT_PUBLIC_FIREBASE_PROJECT_ID が必要です。");

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    }, "ai-gocchi");
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ credential: applicationDefault(), projectId }, "ai-gocchi");
  }
  throw new Error("Firebase Admin SDKの認証情報が未設定です。GOOGLE_APPLICATION_CREDENTIALSまたはFIREBASE_CLIENT_EMAILとFIREBASE_PRIVATE_KEYを設定してください。");
}

export function isAdminConfigured(): boolean {
  return Boolean(
    (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
    || process.env.GOOGLE_APPLICATION_CREDENTIALS,
  );
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getDb() {
  return getFirestore(getAdminApp());
}

export { Timestamp };

export function serializeFirestore<T>(value: T): T {
  if (value instanceof Timestamp) return value.toDate().toISOString() as T;
  if (Array.isArray(value)) return value.map(serializeFirestore) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeFirestore(item)]),
    ) as T;
  }
  return value;
}

export type CharacterStatus = {
  hunger: number;
  energy: number;
  friendship: number;
  brightness: number;
  logic: number;
  humor: number;
  politeness: number;
  updatedAt: Timestamp;
};

export type CharacterData = {
  name: string;
  growthStage: string;
  experience: number;
  personalityType: string | null;
  favoriteTopics: Array<{ topic: string; count: number }>;
  startedAt: Timestamp;
  diedAt: Timestamp | null;
  status: CharacterStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export function characterRef(uid: string) {
  return getDb().doc(`users/${uid}/characters/main`);
}

export function historyCollection(
  uid: string,
  collection: "messages" | "careActions" | "miniGameResults" | "analyses",
) {
  return characterRef(uid).collection(collection);
}

export function initialCharacter(now = Timestamp.now()): CharacterData {
  return {
    name: "ごっち",
    growthStage: "たまご",
    experience: 0,
    personalityType: null,
    favoriteTopics: [],
    startedAt: now,
    diedAt: null,
    status: {
      hunger: 70,
      energy: 70,
      friendship: 0,
      brightness: 50,
      logic: 50,
      humor: 50,
      politeness: 50,
      updatedAt: now,
    },
    createdAt: now,
    updatedAt: now,
  };
}

export async function ensureUserAndCharacter(uid: string, email: string): Promise<void> {
  const db = getDb();
  const userRef = db.doc(`users/${uid}`);
  const charRef = characterRef(uid);
  const now = Timestamp.now();
  await db.runTransaction(async (transaction) => {
    const [user, character] = await Promise.all([
      transaction.get(userRef),
      transaction.get(charRef),
    ]);
    if (!user.exists) transaction.create(userRef, { email, createdAt: now, updatedAt: now });
    else if (user.get("email") !== email) transaction.update(userRef, { email, updatedAt: now });
    if (!character.exists) transaction.create(charRef, initialCharacter(now));
  });
}
