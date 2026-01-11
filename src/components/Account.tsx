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
      className="rounded-lg border-2 border-[#d4c4b0] px-3 py-2 text-xs text-[#6b5d4a] hover:bg-[#f0ede5] transition-colors font-light"
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
      <div className="text-center space-y-6">
        <h2
          className="text-2xl font-light text-[#5a4a3a] tracking-wide"
          style={{ fontFamily: "serif" }}
        >
          마음 전하실 곳
        </h2>
        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>
        <p className="text-sm text-[#6b5d4a] text-center mb-8 leading-relaxed font-light">
          참석이 어려우신 분들을 위해 계좌 정보를 함께 안내드립니다.
          <br />
          마음을 전해주시는 모든 분들께 진심으로 감사드립니다.
        </p>

        <div className="space-y-3">
          {invite.accounts.map((group) => {
            const isOpen = openGroup === group.group;

            return (
              <div
                key={group.group}
                className="rounded-xl border-2 border-[#e8e3d8] overflow-hidden bg-white/50 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : group.group)}
                  className="w-full px-5 py-4 flex items-center justify-between text-sm text-[#5a4a3a] hover:bg-[#f0ede5] transition-colors"
                >
                  <span className="font-normal">{group.group}</span>
                  <span className="text-[#8b7a6a]">
                    {isOpen ? "닫기" : "열기"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t-2 border-[#e8e3d8] px-5 py-4 space-y-3 bg-white/30">
                    {group.items.map((acc, idx) => (
                      <div
                        key={`${acc.number}-${idx}-${acc.holder}`}
                        className="rounded-xl bg-[#faf9f6] border border-[#e8e3d8] p-4 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          {acc.bank && acc.number ? (
                            <>
                              <p className="text-xs text-[#8b7a6a]">
                                {acc.holder}
                              </p>
                              <p className="text-sm font-normal break-all mt-1 text-[#5a4a3a]">
                                {acc.number} {acc.bank}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-[#8b7a6a] font-light">
                              {acc.holder} (계좌번호 추후 업데이트)
                            </p>
                          )}
                        </div>

                        {acc.bank && acc.number && <CopyButton text={acc.number} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
