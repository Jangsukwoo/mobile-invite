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

  // Google Maps Embed URL 생성
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
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

        {/* 지도 미리보기: API 없이 Google Maps Embed */}
        <div
          className="rounded-xl overflow-hidden border-2 border-[#e8e3d8] shadow-md mb-6 bg-[#f5f5f5] relative"
          style={{ minHeight: "300px" }}
        >
          {isMounted && (
            <iframe
              title="map"
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
              style={{
                border: 0,
                width: "100%",
                height: "400px",
                display: "block",
              }}
            />
          )}
          {!isMounted && (
            <div className="w-full h-[400px] flex items-center justify-center text-[#8b7a6a]">
              지도를 불러오는 중...
            </div>
          )}
        </div>

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
          <p>* 모바일에서는 지도가 보이지 않을 경우 위 버튼을 눌러주세요.</p>
        </div>
      </div>
    </Section>
  );
}
