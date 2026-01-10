"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Section from "./Section";
import { invite } from "@/data/invite";
import "leaflet/dist/leaflet.css";

// Leaflet은 SSR을 지원하지 않으므로 동적 import로 클라이언트에서만 로드
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Leaflet 마커 아이콘 설정은 useEffect에서 처리

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

    // Leaflet 마커 아이콘 설정 (Next.js에서 필요) - 더 예쁜 커스텀 마커
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        delete (L.default.Icon.Default.prototype as any)._getIconUrl;

        // 더 예쁜 커스텀 마커 사용 (빨간색 핀)
        const customIcon = L.default.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        L.default.Marker.prototype.options.icon = customIcon;
      });
    }
  }, []);

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

        {/* Leaflet 지도 미리보기 - API 키 불필요, 모바일에서도 작동 */}
        {isMounted && loc.latitude && loc.longitude ? (
          <div
            className="rounded-xl overflow-hidden border-2 border-[#d4c4b0] shadow-lg bg-white relative mb-6"
            style={{ height: "450px", width: "100%" }}
          >
            <MapContainer
              center={[loc.latitude!, loc.longitude!]}
              zoom={17}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
              scrollWheelZoom={false}
              className="rounded-lg"
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={19}
              />
              <Marker position={[loc.latitude!, loc.longitude!]}>
                <Popup
                  className="custom-popup"
                  autoClose={false}
                  closeOnClick={false}
                >
                  <div className="text-sm font-semibold text-[#5a4a3a] py-1">
                    {invite.venue}
                  </div>
                  <div className="text-xs text-[#8b7a6a]">{loc.address}</div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="w-full h-[450px] flex items-center justify-center text-[#8b7a6a] rounded-xl border-2 border-[#e8e3d8] bg-[#f5f5f5] mb-6">
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
