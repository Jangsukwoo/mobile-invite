"use client";

import { useState } from "react";
import Section from "./Section";
import { invite } from "@/data/invite";

// 계좌번호를 깔끔하게 포맷팅 (띄어쓰기, 하이픈, ~ 모두 제거하여 붙여서 표시)
function formatAccountNumberForDisplay(number: string): string {
  return number.replace(/[\s\-~]/g, "");
}

// 계좌번호를 깔끔하게 포맷팅 (공백, 하이픈 제거)
function formatAccountNumber(number: string): string {
  return number.replace(/[\s-~]/g, "");
}

// 복사용 계좌번호 (공백, 하이픈 제거)
function getCopyText(bank: string, number: string): string {
  const cleanNumber = formatAccountNumber(number);
  return `${bank} ${cleanNumber}`;
}

function CopyButton({ bank, number }: { bank: string; number: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const copyText = getCopyText(bank, number);
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard가 막힌 환경(일부 브라우저/보안 설정) 대비: fallback
      const textarea = document.createElement("textarea");
      textarea.value = copyText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={onCopy}
      className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
        copied
          ? "bg-[#5a4a3a] text-white"
          : "bg-white border-2 border-[#d4c4b0] text-[#6b5d4a] hover:bg-[#f0ede5] hover:border-[#c4b4a0]"
      }`}
      type="button"
    >
      {copied ? "✓ 복사됨" : "복사"}
    </button>
  );
}

export default function Account() {
  return (
    <Section>
      <div className="text-center space-y-6">
        <h2
          className="text-2xl font-bold text-[#5a4a3a] tracking-wide"
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

        <div className="space-y-6">
          {invite.accounts.map((group) => (
            <div key={group.group} className="space-y-4">
              <h3 className="text-lg font-medium text-[#5a4a3a] text-left">
                {group.group} 계좌번호
              </h3>
              <div className="space-y-4">
                {group.items.map((acc, idx) => (
                  <div
                    key={`${acc.number}-${idx}-${acc.holder}`}
                    className="rounded-xl bg-white border border-[#e8e3d8] p-5 shadow-sm"
                  >
                    {acc.bank && acc.number ? (
                      <>
                        <div className="mb-3">
                          <p
                            className="text-lg font-bold text-[#5a4a3a] mb-2 tracking-[-0.02em]"
                            style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), -apple-system, sans-serif" }}
                          >
                            {acc.holder}
                          </p>
                          <p className="text-base font-medium text-[#5a4a3a] mb-1">
                            {acc.bank}
                          </p>
                          <p className="text-lg font-semibold text-[#5a4a3a] tracking-wide">
                            {formatAccountNumberForDisplay(acc.number)}
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <CopyButton bank={acc.bank} number={acc.number} />
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <p className="text-sm text-[#8b7a6a] font-light">
                          {acc.holder}
                        </p>
                        <p className="text-xs text-[#8b7a6a] font-light mt-1">
                          (계좌번호 추후 업데이트)
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
