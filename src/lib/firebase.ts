"use client";

import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

function getFirebaseApp() {
  if (!hasFirebaseConfig) {
    throw new Error("Firebaseの環境変数が設定されていません。");
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const firestore = hasFirebaseConfig ? getFirestore(getFirebaseApp()) : null;

export async function signInWithGoogle(): Promise<string> {
  const result = await signInWithPopup(getAuth(getFirebaseApp()), new GoogleAuthProvider());
  return result.user.getIdToken();
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!(await isSupported())) return null;
  return getAnalytics(getFirebaseApp());
}
