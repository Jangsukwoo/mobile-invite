"use client";

import { useEffect, useState, useRef } from "react";
import Section from "./Section";
import { invite } from "@/data/invite";

declare global {
  interface Window {
    kakao: any;
  }
}

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
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current || !loc.latitude || !loc.longitude) {
      return;
    }

    // 카카오맵 SDK 로드 확인 및 지도 생성
    const loadKakaoMap = () => {
      // 카카오맵 SDK가 이미 로드되어 있으면 바로 사용
      if (window.kakao && window.kakao.maps) {
        createMap();
        return;
      }

      // SDK가 이미 로드 중이면 스크립트 추가하지 않음
      if (document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]')) {
        // 스크립트가 로드 중이면 로드 완료까지 대기
        const checkKakao = setInterval(() => {
          if (window.kakao && window.kakao.maps) {
            clearInterval(checkKakao);
            window.kakao.maps.load(() => {
              createMap();
            });
          }
        }, 100);
        return;
      }

      // SDK가 없으면 직접 로드 시도
      // 카카오맵 API 키 (환경변수에서 가져오거나 없으면 기본 사용)
      const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || "";
      const script = document.createElement("script");
      script.src = apiKey
        ? `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`
        : `//dapi.kakao.com/v2/maps/sdk.js?autoload=false`;
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            createMap();
          });
        } else {
          console.warn("카카오맵 SDK를 로드할 수 없습니다. 링크로만 이동 가능합니다.");
          setMapLoaded(false);
        }
      };
      script.onerror = () => {
        console.warn("카카오맵 SDK 로드 실패. 링크로만 이동 가능합니다.");
        setMapLoaded(false);
      };
      document.head.appendChild(script);
    };

    const createMap = () => {
      if (!mapContainerRef.current || mapRef.current) return;

      try {
        const container = mapContainerRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(loc.latitude!, loc.longitude!),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapRef.current = map;

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(
          loc.latitude!,
          loc.longitude!
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 커스텀 오버레이로 장소명 표시
        const overlayContent = `
          <div style="padding:8px 12px;background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);font-size:12px;font-weight:bold;color:#333;white-space:nowrap;">
            ${loc.address}
          </div>
        `;

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: overlayContent,
          yAnchor: 2.2,
        });
        customOverlay.setMap(map);

        setMapLoaded(true);
      } catch (error) {
        console.error("카카오맵 생성 실패:", error);
        setMapLoaded(false);
      }
    };

    // 약간의 지연 후 SDK 로드 시도
    const timer = setTimeout(() => {
      loadKakaoMap();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [isMounted, loc.latitude, loc.longitude, loc.address]);

  // 네이버지도 링크용 URL
  const naverMapLinkUrl =
    loc.naverMapUrl ||
    `https://map.naver.com/v5/search/${encodeURIComponent(loc.address)}`;

  // 카카오맵 Embed URL (좌표 기반)
  const kakaoMapEmbedUrl =
    loc.latitude && loc.longitude
      ? `https://map.kakao.com/link/map/${encodeURIComponent(loc.address)},${
          loc.latitude
        },${loc.longitude}`
      : null;

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

            {/* 카카오맵 지도 미리보기 */}
            {loc.latitude && loc.longitude ? (
              <div className="space-y-2">
                <div
                  ref={mapContainerRef}
                  className="rounded-xl overflow-hidden border-2 border-[#FEE500] shadow-md bg-[#f5f5f5] relative"
                  style={{ width: "100%", height: "400px", minHeight: "400px" }}
                >
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5]">
                      <div className="text-center">
                        <div className="text-[#8b7a6a] text-sm mb-2">
                          지도를 불러오는 중...
                        </div>
                        {kakaoMapEmbedUrl && (
                          <a
                            href={kakaoMapEmbedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block bg-[#FEE500] text-black px-4 py-2 rounded-full text-xs font-medium hover:bg-[#FDD835] transition-colors"
                          >
                            카카오맵에서 보기
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {kakaoMapEmbedUrl && (
                  <a
                    href={kakaoMapEmbedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-xl border-2 border-[#FEE500] bg-[#FEE500] px-4 py-3 text-sm text-center text-black hover:bg-[#FDD835] transition-colors font-medium"
                  >
                    카카오맵에서 자세히 보기 →
                  </a>
                )}
              </div>
            ) : (
              // 좌표가 없을 경우 링크 카드만 표시
              kakaoMapEmbedUrl && (
                <a
                  href={kakaoMapEmbedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl overflow-hidden border-2 border-[#FEE500] shadow-md bg-white relative hover:shadow-lg transition-all group"
                >
                  <div className="w-full h-[160px] bg-[linear-gradient(to_bottom_right,#FEE500,#FDD835)] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22 fill=%22%23000%22/%3E%3C/svg%3E')]"></div>
                    <div className="relative text-center z-10 px-4">
                      <div className="text-black text-xl font-bold mb-1">
                        카카오맵
                      </div>
                      <div className="text-black/90 text-sm mb-3">
                        {loc.address}
                      </div>
                      <div className="bg-black/20 backdrop-blur-sm rounded-full px-5 py-2 text-xs text-black font-medium group-hover:bg-black/30 transition-colors inline-block">
                        클릭하여 카카오맵에서 보기 →
                      </div>
                    </div>
                  </div>
                </a>
              )
            )}
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
