"use client";

import { useState, useEffect, useRef } from "react";
import Section from "./Section";
import { invite } from "@/data/invite";

export default function Gallery() {
  const savedScrollY = useRef<number>(0);
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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const SWIPE_THRESHOLD = 50; // px
  const TRANSITION_DURATION = 400; // ms

  function onTouchStart(e: React.TouchEvent) {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  }

  function onTouchMove(e: React.TouchEvent) {
    setTouchEndX(e.targetTouches[0].clientX);
  }

  function onTouchEnd() {
    if (touchStartX === null || touchEndX === null) return;
    if (isTransitioning) return; // 전환 중이면 무시

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

  // 배경 스크롤 잠금 (ref로 저장하여 복원 신뢰성 확보)
  useEffect(() => {
    if (open) {
      savedScrollY.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollY.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const y = savedScrollY.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
    }
    return () => {
      const y = savedScrollY.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
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

      {/* 라이트박스 - 모바일 viewport 이슈 방지 (100dvh), 사진 잘림 방지 */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          style={{ height: "100dvh", minHeight: "-webkit-fill-available" }}
        >
          {/* 닫기 */}
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 z-10 text-white text-2xl"
            aria-label="close"
          >
            ✕
          </button>

          {/* 이전 */}
          <button
            onClick={prev}
            className="absolute left-2 z-10 text-white text-3xl px-2"
            aria-label="prev"
          >
            ‹
          </button>

          {/* 다음 */}
          <button
            onClick={next}
            className="absolute right-2 z-10 text-white text-3xl px-2"
            aria-label="next"
          >
            ›
          </button>

          <p className="absolute bottom-5 z-10 text-white text-xs opacity-70 whitespace-nowrap px-4">
            좌우로 스와이프하여 넘길 수 있어요
          </p>

          {/* 이미지 - touch-action: pan-y로 세로 스크롤 허용, 가로는 스와이프 */}
          <div
            className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-auto p-2 overscroll-contain"
            style={{ touchAction: "pan-y" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
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
                  animation: `fadeOut${direction === "right" ? "Left" : "Right"} ${TRANSITION_DURATION}ms ease-in-out`,
                }}
              />
            )}
            {/* 새 이미지 (페이드 인 + 슬라이드) - object-contain으로 잘림 방지 */}
            <img
              key={`current-${index}`}
              src={images[index]}
              alt={`viewer-${index}`}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              loading="eager"
              decoding="async"
              style={{
                animation: `fadeInSlide${direction === "right" ? "Right" : "Left"} ${TRANSITION_DURATION}ms ease-in-out`,
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </Section>
  );
}
