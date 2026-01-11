"use client";

import { useState, useEffect } from "react";
import Section from "./Section";
import { invite } from "@/data/invite";

export default function Gallery() {
  const images = invite.gallery;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const SWIPE_THRESHOLD = 50; // px

  function onTouchStart(e: React.TouchEvent) {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  }

  function onTouchMove(e: React.TouchEvent) {
    setTouchEndX(e.targetTouches[0].clientX);
  }

  function onTouchEnd() {
    if (touchStartX === null || touchEndX === null) return;

    const delta = touchStartX - touchEndX;

    if (delta > SWIPE_THRESHOLD) {
      // 왼쪽으로 스와이프 → 다음
      next();
    } else if (delta < -SWIPE_THRESHOLD) {
      // 오른쪽으로 스와이프 → 이전
      prev();
    }
  }

  function openViewer(i: number) {
    setIndex(i);
    setOpen(true);
  }

  function closeViewer() {
    setOpen(false);
  }

  function prev() {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  // 배경 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <Section>
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-light text-[#5a4a3a] tracking-wide" style={{ fontFamily: 'serif' }}>
          갤러리
        </h2>
        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>

        {/* 썸네일 그리드 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openViewer(i)}
              className="aspect-square overflow-hidden rounded-xl border-2 border-[#e8e3d8] shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={src}
                alt={`gallery-${i}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* 라이트박스 */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* 닫기 */}
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label="close"
          >
            ✕
          </button>

          {/* 이전 */}
          <button
            onClick={prev}
            className="absolute left-2 text-white text-3xl px-2"
            aria-label="prev"
          >
            ‹
          </button>

          {/* 다음 */}
          <button
            onClick={next}
            className="absolute right-2 text-white text-3xl px-2"
            aria-label="next"
          >
            ›
          </button>

          <p className="absolute bottom-5 text-white text-xs opacity-70">
            좌우로 스와이프하여 넘길 수 있어요
          </p>

          {/* 이미지 */}
          <img
            src={images[index]}
            alt={`viewer-${index}`}
            className="max-w-full max-h-full object-contain"
            loading="eager"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        </div>
      )}
    </Section>
  );
}
