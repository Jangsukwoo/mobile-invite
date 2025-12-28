"use client";

import { useState, useEffect } from "react";
import Section from "./Section";
import { invite } from "@/data/invite";

export default function Gallery() {
  const images = invite.gallery;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

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
      <h2 className="text-lg font-semibold text-center mb-6">사진</h2>

      {/* 썸네일 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openViewer(i)}
            className="aspect-square overflow-hidden rounded-lg"
          >
            <img
              src={src}
              alt={`gallery-${i}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
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

          {/* 이미지 */}
          <img
            src={images[index]}
            alt={`viewer-${index}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </Section>
  );
}
