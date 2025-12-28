"use client";

import { useEffect, useMemo, useState } from "react";
import Section from "./Section";
import { auth, db } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

type Message = {
  id: string;
  uid: string;
  name: string;
  text: string;
  createdAt?: any;
};

const COOLDOWN_MS = 20_000;
const COOLDOWN_KEY = "guestbook_last_submit_at";

export default function Guestbook() {
  const [ready, setReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const colRef = useMemo(() => collection(db, "guestbook"), []);

  // 1) 익명 로그인
  useEffect(() => {
    signInAnonymously(auth)
      .then(() => setReady(true))
      .catch((e: any) => {
        setReady(false);
        setErrorMsg(`익명 로그인 실패: ${String(e?.code || e?.message || e)}`);
      });
  }, []);

  // 2) 실시간 목록
  useEffect(() => {
    const q = query(colRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Message[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            uid: data.uid ?? "",
            name: data.name ?? "",
            text: data.text ?? "",
            createdAt: data.createdAt,
          };
        });
        setMessages(list);
      },
      (e: any) => {
        setErrorMsg(
          `Firestore 읽기 실패: ${String(e?.code || e?.message || e)}`
        );
      }
    );

    return () => unsub();
  }, [colRef]);

  // 3) 등록
  async function submit() {
    setErrorMsg(null);

    if (!ready) {
      setErrorMsg("연결 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      setErrorMsg(
        "인증 정보를 가져오지 못했어요. 새로고침 후 다시 시도해주세요."
      );
      return;
    }

    const n = name.trim();
    const t = text.trim();

    if (!n || !t) {
      setErrorMsg("닉네임과 메시지를 입력해주세요.");
      return;
    }

    // 쿨다운(도배 방지)
    const last = Number(localStorage.getItem(COOLDOWN_KEY) || "0");
    const now = Date.now();
    const remain = COOLDOWN_MS - (now - last);
    if (remain > 0) {
      setErrorMsg(
        `잠시만요! ${Math.ceil(remain / 1000)}초 후에 다시 작성할 수 있어요.`
      );
      return;
    }

    setSending(true);
    try {
      await addDoc(colRef, {
        uid,
        name: n.slice(0, 20),
        text: t.slice(0, 300),
        createdAt: serverTimestamp(),
      });

      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setText("");
      // 닉네임은 보통 유지하는 게 편해서 name은 유지
    } catch (e: any) {
      setErrorMsg(`Firestore 쓰기 실패: ${String(e?.code || e?.message || e)}`);
    } finally {
      setSending(false);
    }
  }

  // 4) 수정 저장
  async function saveEdit(id: string) {
    setErrorMsg(null);

    const uid = auth.currentUser?.uid;
    if (!uid) {
      setErrorMsg("인증 정보를 가져오지 못했어요.");
      return;
    }

    const t = editingText.trim();
    if (!t) {
      setErrorMsg("수정할 내용을 입력해주세요.");
      return;
    }

    setSavingEdit(true);
    try {
      await updateDoc(doc(db, "guestbook", id), {
        text: t.slice(0, 300),
      });
      setEditingId(null);
      setEditingText("");
    } catch (e: any) {
      setErrorMsg(`수정 실패: ${String(e?.code || e?.message || e)}`);
    } finally {
      setSavingEdit(false);
    }
  }

  const myUid = auth.currentUser?.uid ?? null;

  return (
    <Section>
      <h2 className="text-lg font-semibold text-center mb-3">축하 메시지</h2>
      <p className="text-xs text-gray-500 text-center mb-6">
        닉네임만 입력하고 자유롭게 남겨주세요 🙂
      </p>

      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      {/* 작성 폼 */}
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
          {sending ? "등록 중..." : ready ? "등록하기" : "연결 중..."}
        </button>
      </div>

      {/* 목록 */}
      <div className="mt-10 space-y-3">
        {messages.map((m) => {
          const isMine = myUid && m.uid === myUid;
          const isEditing = editingId === m.id;

          return (
            <div key={m.id} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{m.name}</p>

                {isMine && !isEditing && (
                  <button
                    type="button"
                    className="text-xs text-gray-600 underline"
                    onClick={() => {
                      setEditingId(m.id);
                      setEditingText(m.text);
                    }}
                  >
                    수정
                  </button>
                )}
              </div>

              {!isEditing ? (
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                  {m.text}
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm h-24 resize-none"
                    maxLength={300}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-xl bg-gray-900 text-white py-2 text-sm disabled:opacity-50"
                      disabled={savingEdit}
                      onClick={() => saveEdit(m.id)}
                    >
                      {savingEdit ? "저장 중..." : "저장"}
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-xl border py-2 text-sm"
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
