"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Section from "./Section";
import { invite } from "@/data/invite";

export default function Gallery() {
  const savedScrollY = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // basePath 자동 감지 (GitHub Pages용)
    if (typeof window === "undefined") {
      setImages(invite.gallery);
      return;
    }

    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    const processedImages = invite.gallery.map((src) => {
      // 절대 경로가 아니면 basePath 추가
      if (
        src.startsWith("/") &&
        !src.startsWith("//") &&
        !src.startsWith("http")
      ) {
        // 로컬 개발 환경이 아닌 경우 basePath 추가
        if (!isLocalhost) {
          return `/mobile-invite${src}`;
        }
      }
      return src;
    });

    setImages(processedImages);

    // 첫 2개만 preload (과한 preload가 스크롤 멈춤 원인)
    const preloadImages = processedImages.slice(0, 2);
    preloadImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
    });
  }, []);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const SWIPE_THRESHOLD = 50;
  const TRANSITION_DURATION = 350;

  function onTouchStart(e: React.TouchEvent) {
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current || isTransitioning) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = touchStartRef.current.x - endX;
    const deltaY = touchStartRef.current.y - endY;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) next();
      else prev();
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
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection("left");
    setPrevIndex(index);
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  }

  function next() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection("right");
    setPrevIndex(index);
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  }

  useEffect(() => {
    if (open) {
      savedScrollY.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollY.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const y = savedScrollY.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      requestAnimationFrame(() => window.scrollTo(0, y));
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      requestAnimationFrame(() => window.scrollTo(0, savedScrollY.current));
    };
  }, [open]);

  return (
    <Section>
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-[#5a4a3a] tracking-wide" style={{ fontFamily: 'serif' }}>
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
                loading={i < 4 ? "eager" : "lazy"}
                fetchPriority={i < 2 ? "high" : "low"}
                className="w-full h-full object-cover"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </div>

      {/* 라이트박스 - document.body에 포탈로 렌더하여 다른 요소 위에 확실히 덮음 */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-black flex flex-col"
            style={{
              zIndex: 99999,
              height: "100dvh",
              minHeight: "-webkit-fill-available",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
          {/* 상단 바: 닫기 버튼 항상 보이게 (safe-area) */}
          <div
            className="shrink-0 flex justify-end items-center px-4 py-3"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <button
              onClick={closeViewer}
              className="w-12 h-12 flex items-center justify-center text-white text-2xl rounded-full active:bg-white/20"
              aria-label="close"
            >
              ✕
            </button>
          </div>

          {/* 이미지 영역: 풀화면, 가로 스와이프만 처리 (세로 스크롤 방지) */}
          <div
            className="flex-1 min-h-0 flex items-center justify-center p-2 overflow-hidden select-none"
            style={{ touchAction: "pan-x" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* 이전 이미지 (페이드 아웃) */}
            {isTransitioning && prevIndex !== index && (
              <img
                key={`prev-${prevIndex}`}
                src={images[prevIndex]}
                alt={`viewer-prev-${prevIndex}`}
                className="absolute max-w-full max-h-full w-auto h-auto object-contain"
                style={{
                  animation: `fadeOut${direction === "right" ? "Left" : "Right"} ${TRANSITION_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
                }}
              />
            )}
            <img
              key={`current-${index}`}
              src={images[index]}
              alt={`viewer-${index}`}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              loading="eager"
              decoding="async"
              style={{
                animation: `fadeInSlide${direction === "right" ? "Right" : "Left"} ${TRANSITION_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
              }}
              draggable={false}
            />
          </div>

          {/* 하단 바: 이전/다음 + 안내 */}
          <div
            className="shrink-0 flex items-center justify-between px-4 py-4"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <button
              onClick={prev}
              className="w-12 h-12 flex items-center justify-center text-white text-3xl active:bg-white/20 rounded-full"
              aria-label="prev"
            >
              ‹
            </button>
            <span className="text-white text-xs opacity-70">좌우 스와이프로 넘기기</span>
            <button
              onClick={next}
              className="w-12 h-12 flex items-center justify-center text-white text-3xl active:bg-white/20 rounded-full"
              aria-label="next"
            >
              ›
            </button>
          </div>
        </div>,
          document.body
        )}
    </Section>
  );
}
