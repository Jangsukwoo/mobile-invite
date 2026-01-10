"use client";

import { invite } from "@/data/invite";
import FallingFlowers from "./FallingFlowers";

export default function CoverHero() {
  const coverImage =
    invite.cover?.image ?? invite.gallery?.[0] ?? "images/cover.jpg";

  const handleScrollDown = () => {
    // ID로 직접 다음 섹션 찾기
    const coverSection = document.getElementById("cover-section");
    if (coverSection) {
      coverSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // ID를 찾을 수 없으면 화면 높이만큼 스크롤
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#faf9f6]">
      {/* 편지지 느낌의 배경 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(250,249,246,0.95),rgba(240,238,230,0.98))] z-0" />

      {/* 편지지 텍스처 */}
      <div
        className="absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* 꽃 흩날림 */}
      <FallingFlowers count={18} />

      {/* 사진 영역 */}
      <div className="relative z-20 flex min-h-[100svh] items-center justify-center px-0 sm:px-4 py-0 sm:py-20">
        <div className="relative w-full h-[100svh] sm:h-auto sm:max-w-[560px]">
          {/* 사진 */}
          <div className="relative w-full h-full">
            <img
              src={coverImage}
              alt="cover"
              className="
                w-full
                h-full
                object-cover
                sm:rounded-2xl
                sm:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                sm:border-2
                sm:border-[#e8e3d8]
              "
            />

            {/* 사진 안 이름 (우아한 필기체) */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between pointer-events-none">
              <span
                className="
                  handwrite
                  text-[22px]
                  sm:text-[28px]
                  text-white
                  drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]
                  font-medium
                "
              >
                {invite.groom}
              </span>

              <span
                className="
                  handwrite
                  text-[22px]
                  sm:text-[28px]
                  text-white
                  drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]
                  font-medium
                "
              >
                {invite.bride}
              </span>
            </div>

            {/* Two become one 텍스트 애니메이션 */}
            <div className="absolute top-4 sm:top-8 left-1/2 transform -translate-x-1/2 pointer-events-none w-full px-4 sm:px-6">
              <div className="text-center">
                <span
                  className="
                    handwrite
                    text-[28px]
                    sm:text-[40px]
                    text-white
                    drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]
                    font-medium
                    inline-block
                    opacity-0
                    animate-[writeReveal_2s_ease-out_1s_forwards]
                  "
                >
                  Two become one
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 버튼 */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-2 text-[#8b7a6a]/70 hover:text-[#8b7a6a] transition-colors group cursor-pointer"
        aria-label="다음 섹션으로 스크롤"
      >
        <span className="text-xs tracking-widest">SCROLL</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 animate-bounce group-hover:scale-110 transition-transform"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
          />
        </svg>
      </button>
    </section>
  );
}
