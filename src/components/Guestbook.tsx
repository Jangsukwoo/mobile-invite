"use client";

import { useEffect, useMemo, useState } from "react";
import Section from "./Section";
import { auth, db } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

type Message = {
  id: string;
  name: string;
  text: string;
  createdAt?: Timestamp;
};

export default function Guestbook() {
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  const colRef = useMemo(() => collection(db, "guestbook"), []);

  useEffect(() => {
    // ✅ 사용자에게 “로그인 화면” 없이, 앱이 뒤에서 익명 로그인
    signInAnonymously(auth)
      .then(() => setReady(true))
      .catch(() => setReady(true)); // 실패해도 화면은 보이게
  }, []);

  useEffect(() => {
    const q = query(colRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: Message[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          name: data.name ?? "",
          text: data.text ?? "",
          createdAt: data.createdAt,
        };
      });
      setMessages(list);
    });

    return () => unsub();
  }, [colRef]);

  async function submit() {
    if (!ready) return;
    const n = name.trim();
    const t = text.trim();
    if (!n || !t) return;

    setSending(true);
    try {
      await addDoc(colRef, {
        name: n.slice(0, 20),
        text: t.slice(0, 300),
        createdAt: serverTimestamp(),
      });
      setText("");
    } finally {
      setSending(false);
    }
  }

  return (
    <Section>
      <h2 className="text-lg font-semibold text-center mb-3">축하 메시지</h2>
      <p className="text-xs text-gray-500 text-center mb-6">
        닉네임만 입력하고 자유롭게 남겨주세요 🙂
      </p>

      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="닉네임 (예: 철수)"
          className="w-full rounded-xl border px-4 py-3 text-sm"
          maxLength={20}
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="축하 메시지"
          className="w-full rounded-xl border px-4 py-3 text-sm h-28 resize-none"
          maxLength={300}
        />

        <button
          type="button"
          onClick={submit}
          disabled={!ready || sending}
          className="w-full rounded-xl bg-gray-900 text-white px-4 py-3 text-sm disabled:opacity-50"
        >
          {sending ? "등록 중..." : "등록하기"}
        </button>
      </div>

      <div className="mt-10 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="rounded-2xl border p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{m.name}</p>
              <p className="text-xs text-gray-500">
                {m.createdAt
                  ? new Date(m.createdAt.toMillis()).toLocaleString("ko-KR")
                  : ""}
              </p>
            </div>
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
              {m.text}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
