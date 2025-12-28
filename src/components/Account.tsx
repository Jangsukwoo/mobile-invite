"use client";

import { useState } from "react";
import Section from "./Section";
import { invite } from "@/data/invite";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard가 막힌 환경(일부 브라우저/보안 설정) 대비: fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <button
      onClick={onCopy}
      className="rounded-lg border px-3 py-2 text-xs hover:bg-gray-50"
      type="button"
    >
      {copied ? "복사됨!" : "복사"}
    </button>
  );
}

export default function Account() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <Section>
      <h2 className="text-lg font-semibold text-center mb-3">마음 전하실 곳</h2>
      <p className="text-xs text-gray-500 text-center mb-8 leading-relaxed">
        축하의 마음만으로도 충분합니다.
        <br />
        계좌번호는 눌러서 확인하고 복사할 수 있어요.
      </p>

      <div className="space-y-3">
        {invite.accounts.map((group) => {
          const isOpen = openGroup === group.group;

          return (
            <div
              key={group.group}
              className="rounded-2xl border overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenGroup(isOpen ? null : group.group)}
                className="w-full px-5 py-4 flex items-center justify-between text-sm"
              >
                <span className="font-medium">{group.group}</span>
                <span className="text-gray-500">
                  {isOpen ? "닫기" : "열기"}
                </span>
              </button>

              {isOpen && (
                <div className="border-t px-5 py-4 space-y-3">
                  {group.items.map((acc, idx) => (
                    <div
                      key={`${acc.number}-${idx}`}
                      className="rounded-xl bg-gray-50 p-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          {acc.bank} · {acc.holder}
                        </p>
                        <p className="text-sm font-medium break-all mt-1">
                          {acc.number}
                        </p>
                      </div>

                      <CopyButton text={acc.number} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
