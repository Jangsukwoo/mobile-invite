"use client";

import { useEffect } from "react";
import Section from "./Section";

export default function Comments() {
  useEffect(() => {
    // 중복 로드 방지
    if (document.querySelector('script[data-giscus="true"]')) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-giscus", "true");

    // ✅ 너가 준 값 그대로 적용
    script.setAttribute("data-repo", "SeokwooJ/mobile-invite");
    script.setAttribute("data-repo-id", "R_kgDOQwDfJA");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOQwDfJM4C0T9d");

    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");

    // giscus는 이 div를 찾아 렌더링함
    const container = document.querySelector(".giscus");
    if (container) container.appendChild(script);
  }, []);

  return (
    <Section>
      <h2 className="text-lg font-semibold text-center mb-6">축하 메시지</h2>
      <div className="giscus" />
      <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
        * 댓글 작성/반응은 GitHub 로그인이 필요할 수 있어요.
      </p>
    </Section>
  );
}
