"use client";

import { useEffect, useState } from "react";
import Section from "./Section";
import { invite } from "@/data/invite";

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block w-full rounded-xl border-2 border-[#d4c4b0] px-4 py-3 text-sm text-center text-[#6b5d4a] hover:bg-[#f0ede5] transition-colors font-light"
    >
      {label}
    </a>
  );
}

export default function Location() {
  const loc = invite.location;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 네이버지도 링크용 URL
  const naverMapLinkUrl =
    loc.naverMapUrl ||
    `https://map.naver.com/v5/search/${encodeURIComponent(loc.address)}`;

  // 구글지도 Embed - 네이버지도와 카카오맵 iframe embed가 제한적이어서 구글지도 사용
  const googleMapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    loc.address
  )}&output=embed&hl=ko&z=16`;

  return (
    <Section>
      <div className="text-center space-y-6">
        <h2
          className="text-2xl font-light text-[#5a4a3a] tracking-wide"
          style={{ fontFamily: "serif" }}
        >
          오시는 길
        </h2>
        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>

        <div className="text-base text-center text-[#6b5d4a] space-y-3 font-light mb-6">
          <p className="text-lg font-normal">{invite.venue}</p>
          <p className="text-sm text-[#8b7a6a]">{loc.address}</p>
        </div>

        {/* 네이버지도 링크 + 구글지도 iframe 표시 */}
        {isMounted ? (
          <div className="space-y-4">
            {/* 네이버지도 링크 (클릭 가능한 카드) - 가장 위에 표시 */}
            <a
              href={naverMapLinkUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl overflow-hidden border-2 border-[#03C75A] shadow-md bg-white relative hover:shadow-lg transition-all group"
            >
              <div className="w-full h-[160px] bg-[linear-gradient(to_bottom_right,#03C75A,#02B350)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22 fill=%22%23fff%22/%3E%3C/svg%3E')]"></div>
                <div className="relative text-center z-10 px-4">
                  <div className="text-white text-xl font-bold mb-1">
                    네이버지도
                  </div>
                  <div className="text-white/95 text-sm mb-3">
                    {loc.address}
                  </div>
                  <div className="bg-white/25 backdrop-blur-sm rounded-full px-5 py-2 text-xs text-white font-medium group-hover:bg-white/35 transition-colors inline-block">
                    클릭하여 네이버지도에서 보기 →
                  </div>
                </div>
              </div>
            </a>

            {/* 구글지도 iframe (지도 미리보기) - 네이버지도 iframe embed 제한으로 구글지도 사용 */}
            <div
              className="rounded-xl overflow-hidden border-2 border-[#e8e3d8] shadow-md bg-[#f5f5f5] relative"
              style={{ minHeight: "350px" }}
            >
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[#5a4a3a] text-xs px-2 py-1 rounded z-10 font-medium">
                지도 미리보기
              </div>
              <iframe
                title="google-map"
                width="100%"
                height="400"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={googleMapEmbedUrl}
                style={{
                  border: 0,
                  width: "100%",
                  height: "400px",
                  display: "block",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-[400px] flex items-center justify-center text-[#8b7a6a] rounded-xl border-2 border-[#e8e3d8] bg-[#f5f5f5] mb-6">
            지도를 불러오는 중...
          </div>
        )}

        {/* 지도 선택 버튼 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {loc.naverMapUrl && (
            <LinkButton href={loc.naverMapUrl} label="네이버지도" />
          )}
          {loc.kakaoMapUrl && (
            <LinkButton href={loc.kakaoMapUrl} label="카카오맵" />
          )}
          <LinkButton href={loc.googleMapUrl} label="구글지도" />
        </div>

        <div className="mt-6 text-xs text-[#8b7a6a] leading-relaxed">
          <p className="mb-1">
            * 지도 버튼을 누르면 해당 앱/웹으로 이동합니다.
          </p>
          <p>* 지도가 보이지 않을 경우 위 버튼을 눌러주세요.</p>
        </div>
      </div>
    </Section>
  );
}
