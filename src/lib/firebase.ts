// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 Firebase 설정 (공개 OK)
const firebaseConfig = {
  apiKey: "AIzaSyDGG_To7PUIbUISPSP-qjLjhHvAczxfSKk",
  authDomain: "mobile-invite.firebaseapp.com",
  projectId: "mobile-invite",
  storageBucket: "mobile-invite.firebasestorage.app",
  messagingSenderId: "442689800696",
  appId: "1:442689800696:web:5581ff6a28acc1a6f5ee0d",
  measurementId: "G-WVK7K0BMRZ",
};

// ✅ 중복 초기화 방지 (Next.js 필수 패턴)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ 우리가 실제로 쓸 것들
export const auth = getAuth(app);
export const db = getFirestore(app);

// ❌ analytics는 쓰지 않음 (SSR/정적 환경 오류 방지)
