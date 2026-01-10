"use client";

import { useState, useEffect, useRef } from "react";
import { invite } from "@/data/invite";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [musicUrl, setMusicUrl] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // basePath 자동 감지 (GitHub Pages용)
    if (typeof window === "undefined" || !invite.music?.url) {
      if (invite.music?.url) {
        // SSR 환경에서는 그대로 사용 (개발 환경)
        setMusicUrl(invite.music.url.replace(/ /g, "%20"));
      }
      return;
    }

    let url = invite.music.url;

    // 절대 경로가 아니면 basePath 추가
    if (
      url.startsWith("/") &&
      !url.startsWith("//") &&
      !url.startsWith("http")
    ) {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";

      // 로컬 개발 환경이 아닌 경우 basePath 추가
      if (!isLocalhost) {
        // 프로덕션 환경에서는 항상 basePath 추가
        url = `/mobile-invite${url}`;
      }
      // 로컬 환경에서는 그대로 사용
    }

    // 파일명 공백을 URL 인코딩
    url = url.replace(/ /g, "%20");
    setMusicUrl(url);

    // 디버깅용 콘솔 로그
    console.log("=== Music Player Debug ===");
    console.log("Original URL:", invite.music.url);
    console.log("Final Music URL:", url);
    console.log("Current pathname:", pathname);
    console.log("Current hostname:", hostname);
    console.log("Full URL:", window.location.href);
  }, []);

  useEffect(() => {
    // 브라우저 자동재생 정책 때문에 사용자 상호작용 후에만 재생 가능
    if (audioRef.current && !hasInteracted && musicUrl) {
      audioRef.current.volume = 0.5;
    }
  }, [hasInteracted, musicUrl]);

  const togglePlay = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((error) => {
        console.error("Audio play failed:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  // 음악 파일이 없으면 플레이어 숨김
  if (!invite.music?.url) {
    console.warn("Music URL not found in invite data");
    return null;
  }

  // musicUrl이 아직 설정되지 않았어도 플레이어는 표시 (로딩 중)
  const isReady = musicUrl.length > 0;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end gap-2">
        {/* 음악 정보 */}
        {isPlaying && isReady && (
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-[#e8e3d8] text-xs text-[#6b5d4a] whitespace-nowrap">
            {invite.music.title || "Morning with U"}
          </div>
        )}

        {/* 플레이어 컨트롤 - 항상 표시 */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-[#e8e3d8]">
          {/* 음소거 버튼 - musicUrl이 있을 때만 표시 */}
          {isReady && (
            <button
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0ede5] transition-colors text-[#6b5d4a]"
              aria-label={isMuted ? "음소거 해제" : "음소거"}
            >
              {isMuted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-13.5 0L3 12m0 0l2.25-2.25M3 12l2.25 2.25m0 0L3 17.25m2.25-5.25l13.5 0M9 9.75v.375c0 .621.504 1.125 1.125 1.125H12v6h-1.875c-.621 0-1.125.504-1.125 1.125v.375M9 15h6m-6-4.5h6m-3-6V3m0 18v-1.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                  />
                </svg>
              )}
            </button>
          )}

          {/* 재생/일시정지 버튼 - 항상 표시 */}
          <button
            onClick={togglePlay}
            disabled={!isReady}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-colors shadow-md ${
              isReady ? "bg-[#5a4a3a] hover:bg-[#4a3d30]" : "bg-gray-400 cursor-not-allowed"
            }`}
            aria-label={isPlaying ? "일시정지" : isReady ? "재생" : "로딩 중..."}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 ml-0.5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 오디오 요소 - musicUrl이 있을 때만 렌더링 */}
      {isReady && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          preload="auto"
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            const audio = e.target as HTMLAudioElement;
            console.error("=== Audio Load Error ===");
            console.error("Error:", e);
            console.error("Failed URL:", musicUrl);
            console.error("Audio src:", audio.src);
            console.error("Current URL:", window.location.href);
            console.error("Pathname:", window.location.pathname);
            console.error("Hostname:", window.location.hostname);
          }}
          onLoadedData={() => {
            console.log("✅ Audio loaded successfully:", musicUrl);
          }}
          onCanPlay={() => {
            console.log("✅ Audio can play:", musicUrl);
          }}
        />
      )}
    </div>
  );
}
