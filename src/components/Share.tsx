"use client";

import { useMemo, useState } from "react";
import Section from "./Section";
import { invite } from "@/data/invite";

const fallbackSite = {
  title: "모바일 청첩장",
  description: "",
  url: "https://seokwooj.github.io/mobile-invite/",
};

export default function Share() {
  const [copied, setCopied] = useState(false);

  const site = (invite as any).site ?? fallbackSite;

  const url = useMemo(() => {
    if (typeof window === "undefined") return site.url;
    return window.location.href;
  }, [site.url]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  async function shareNative() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: site.title,
          text: site.description,
          url,
        });
      } else {
        await copyLink();
      }
    } catch {
      // 사용자가 취소해도 에러로 떨어질 수 있어 무시
    }
  }

  return (
    <Section>
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-light text-[#5a4a3a] tracking-wide" style={{ fontFamily: 'serif' }}>
          공유하기
        </h2>
        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>
        <p className="text-xs text-[#8b7a6a] text-center mb-8 leading-relaxed">
          링크를 복사해서 카카오톡, 문자, 인스타 DM 등으로 공유할 수 있어요.
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={copyLink}
            className="w-full rounded-xl border-2 border-[#d4c4b0] px-4 py-3 text-sm text-center text-[#6b5d4a] hover:bg-[#f0ede5] transition-colors font-light"
          >
            {copied ? "링크가 복사됐어요!" : "링크 복사"}
          </button>

          <button
            type="button"
            onClick={shareNative}
            className="w-full rounded-xl bg-[#5a4a3a] text-white px-4 py-3 text-sm text-center hover:bg-[#4a3d30] transition-colors font-light"
          >
            휴대폰 공유 열기
          </button>
        </div>

        <div className="mt-6 text-xs text-[#8b7a6a] text-center break-all">
          {url}
        </div>
      </div>
    </Section>
  );
}
