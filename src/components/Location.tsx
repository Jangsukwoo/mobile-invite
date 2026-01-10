"use client";

import { useEffect, useState, useRef } from "react";
import Section from "./Section";
import { invite } from "@/data/invite";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

function MapIcon({ type }: { type: "tmap" | "kakao" | "naver" | "google" }) {
  const icons = {
    tmap: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
          fill="#FF6B00"
        />
      </svg>
    ),
    kakao: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M12 3C7.03 3 3 6.58 3 11c0 2.5 1.62 4.71 4.07 5.93l-.87 3.25 3.43-2.26c.46.05.93.08 1.37.08 4.97 0 9-3.58 9-8s-4.03-8-9-8z"
          fill="#3C1E1E"
        />
      </svg>
    ),
    naver: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"
          fill="#03C75A"
        />
      </svg>
    ),
    google: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          fill="#4285F4"
        />
      </svg>
    ),
  };

  return icons[type];
}

function LinkButton({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon?: "tmap" | "kakao" | "naver" | "google";
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={href}
      onClick={onClick ? handleClick : undefined}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-[#d4c4b0] px-4 py-3 text-sm text-center text-[#6b5d4a] hover:bg-[#f0ede5] transition-colors font-light"
    >
      {icon && <MapIcon type={icon} />}
      {label}
    </a>
  );
}

export default function Location() {
  const loc = invite.location;
  const [isMounted, setIsMounted] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!loc.latitude || !loc.longitude) {
      console.error("좌표 정보가 없습니다.");
      setMapLoaded(false);
      return;
    }

    // Google Maps API 키 (fallback 포함)
    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyC69K-tY1IoQTquNXQjz1QLFoMYOlJWo7g";

    console.log("=== Google Maps Debug ===");
    console.log("API Key (exists):", !!apiKey);
    console.log("API Key (first 10):", apiKey?.substring(0, 10) + "...");
    console.log("Latitude:", loc.latitude);
    console.log("Longitude:", loc.longitude);

    if (!apiKey) {
      console.error("Google Maps API 키가 설정되지 않았습니다.");
      setMapLoaded(false);
      return;
    }

    // Google Maps API 로드 확인 및 지도 생성
    const loadGoogleMap = () => {
      // 이미 Google Maps API가 로드되어 있으면 바로 사용
      if (window.google && window.google.maps) {
        console.log("Google Maps API 이미 로드됨");
        createMap();
        return;
      }

      // 이미 스크립트가 로드 중이면 대기
      if (
        document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')
      ) {
        console.log("Google Maps API 스크립트 로드 중, 대기...");
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogle);
            createMap();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkGoogle);
          if (!googleMapRef.current) {
            console.warn("Google Maps API 로드 타임아웃");
            setMapLoaded(false);
          }
        }, 10000);

        return;
      }

      // Google Maps API 스크립트 로드
      const script = document.createElement("script");
      const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=ko&region=KR`;
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;

      console.log(
        "Google Maps API 스크립트 로드 시작:",
        scriptUrl.replace(apiKey, "API_KEY_HIDDEN")
      );

      script.onload = () => {
        console.log("Google Maps API 스크립트 로드 완료");
        if (window.google && window.google.maps) {
          console.log("Google Maps API 사용 가능");
          createMap();
        } else {
          console.error("Google Maps API를 로드할 수 없습니다.");
          setMapLoaded(false);
        }
      };
      script.onerror = (error) => {
        console.error("Google Maps API 스크립트 로드 실패:", error);
        console.error("API URL:", scriptUrl.replace(apiKey, "API_KEY_HIDDEN"));
        setMapLoaded(false);
      };
      document.head.appendChild(script);
    };

    const createMap = () => {
      if (!mapRef.current) {
        console.error("지도 컨테이너가 없습니다.");
        return;
      }

      if (googleMapRef.current) {
        console.warn("지도가 이미 생성되었습니다.");
        return;
      }

      try {
        console.log("지도 생성 시작:", loc.latitude, loc.longitude);

        const mapOptions = {
          center: {
            lat: loc.latitude!,
            lng: loc.longitude!,
          },
          zoom: 17,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: false,
          zoomControl: true,
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
          },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_TOP,
          },
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        googleMapRef.current = map;

        // 마커 생성
        const marker = new window.google.maps.Marker({
          position: {
            lat: loc.latitude!,
            lng: loc.longitude!,
          },
          map: map,
          title: invite.venue,
          animation: window.google.maps.Animation.DROP,
        });

        // 정보창 생성
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 14px 16px; text-align: center; min-width: 220px; max-width: 280px;">
              <div style="font-weight: 500; color: #5a4a3a; font-size: 15px; margin-bottom: 8px; font-family: 'Noto Serif KR', serif; letter-spacing: -0.02em;">
                ${invite.venue}
              </div>
              <div style="color: #8b7a6a; font-size: 13px; line-height: 1.6; font-family: 'Noto Sans KR', sans-serif; font-weight: 300; letter-spacing: -0.01em;">
                ${loc.address}
              </div>
            </div>
          `,
        });

        // 마커 클릭 시 정보창 표시
        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        // 처음 로드 시 정보창 자동 표시
        infoWindow.open(map, marker);

        console.log("Google Maps 지도 생성 성공");
        setMapLoaded(true);
      } catch (error) {
        console.error("Google Maps 생성 실패:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        setMapLoaded(false);
      }
    };

    // 약간의 지연 후 지도 컨테이너가 준비될 때까지 대기
    const waitForContainer = setTimeout(() => {
      if (!mapRef.current) {
        console.error("지도 컨테이너를 찾을 수 없습니다.");
        setMapLoaded(false);
        return;
      }

      console.log("Map Ref 준비됨");
      // 지도 로드 시작
      loadGoogleMap();
    }, 500);

    return () => {
      clearTimeout(waitForContainer);
      if (googleMapRef.current) {
        googleMapRef.current = null;
      }
    };
  }, [isMounted, loc.latitude, loc.longitude, loc.address, invite.venue]);

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

        {/* Google Maps 지도 미리보기 */}
        {isMounted && loc.latitude && loc.longitude ? (
          <div
            className="rounded-xl overflow-hidden border border-[#d4c4b0] shadow-md bg-white relative mb-6"
            style={{ height: "450px", width: "100%" }}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#faf9f6] z-10">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b7a6a] mb-3"></div>
                  <div className="text-[#8b7a6a] text-sm mb-2">
                    지도를 불러오는 중...
                  </div>
                  <div className="text-xs text-[#8b7a6a] mt-2">
                    잠시만 기다려주세요
                  </div>
                </div>
              </div>
            )}
            <div
              ref={mapRef}
              style={{ height: "100%", width: "100%" }}
              className="rounded-xl"
            />
          </div>
        ) : (
          <div className="w-full h-[450px] flex items-center justify-center text-[#8b7a6a] rounded-xl border border-[#e8e3d8] bg-[#faf9f6] mb-6">
            좌표 정보가 없습니다.
          </div>
        )}

        {/* 지도 선택 버튼 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {loc.tmapUrl && (
            <LinkButton
              href={loc.tmapUrl}
              label="티맵"
              icon="tmap"
              onClick={(e) => {
                e.preventDefault();
                // 티맵 앱 딥링크 (앱이 설치되어 있으면 앱이 열림)
                // 좌표를 포함한 경로 안내 링크
                const tmapLink = `tmap://route?goalname=${encodeURIComponent(
                  "메종드아나하"
                )}&goalx=127.036&goaly=37.5017`;
                window.location.href = tmapLink;
              }}
            />
          )}
          {loc.naverMapUrl && (
            <LinkButton
              href={loc.naverMapUrl}
              label="네이버지도"
              icon="naver"
            />
          )}
          {loc.kakaoMapUrl && (
            <LinkButton href={loc.kakaoMapUrl} label="카카오맵" icon="kakao" />
          )}
          <LinkButton href={loc.googleMapUrl} label="구글지도" icon="google" />
        </div>

        {/* 교통편 정보 */}
        {loc.transportation && (
          <div className="mt-10 space-y-6">
            {/* 지하철 */}
            {loc.transportation.subway &&
              loc.transportation.subway.length > 0 && (
                <div className="text-left space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-6 h-6 text-[#5a4a3a]"
                    >
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <path d="M4 12h16M8 4v16M16 4v16" />
                    </svg>
                    <h3
                      className="text-lg font-normal text-[#5a4a3a]"
                      style={{ fontFamily: "serif" }}
                    >
                      지하철
                    </h3>
                  </div>
                  <ul className="space-y-2 pl-8">
                    {loc.transportation.subway.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-[#6b5d4a] font-light leading-relaxed"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* 버스 */}
            {loc.transportation.bus && loc.transportation.bus.length > 0 && (
              <div className="text-left space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6 text-[#5a4a3a]"
                  >
                    <path d="M4 6h16M4 10h16M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 6l-1 4h18l-1-4M6 14h12" />
                  </svg>
                  <h3
                    className="text-lg font-normal text-[#5a4a3a]"
                    style={{ fontFamily: "serif" }}
                  >
                    버스
                  </h3>
                </div>
                <ul className="space-y-2 pl-8">
                  {loc.transportation.bus.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-[#6b5d4a] font-light leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 자가용 */}
            {loc.transportation.car && (
              <div className="text-left space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6 text-[#5a4a3a]"
                  >
                    <path d="M5 17h14v-3H5v3zM16 8h-8V5h8v3zM4 10h16M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  </svg>
                  <h3
                    className="text-lg font-normal text-[#5a4a3a]"
                    style={{ fontFamily: "serif" }}
                  >
                    자가용
                  </h3>
                </div>
                <p className="text-sm text-[#6b5d4a] font-light leading-relaxed pl-8">
                  {loc.transportation.car}
                </p>
              </div>
            )}

            {/* 도보 */}
            {loc.transportation.walking &&
              loc.transportation.walking.length > 0 && (
                <div className="text-left space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-6 h-6 text-[#5a4a3a]"
                    >
                      <circle cx="12" cy="5" r="2" />
                      <path d="M9 22v-7l-2-2v-5l5-2 5 2v5l-2 2v7" />
                      <path d="M15 10l-3-1-3 1" />
                    </svg>
                    <h3
                      className="text-lg font-normal text-[#5a4a3a]"
                      style={{ fontFamily: "serif" }}
                    >
                      도보
                    </h3>
                  </div>
                  <ul className="space-y-2 pl-8">
                    {loc.transportation.walking.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-[#6b5d4a] font-light leading-relaxed"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

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
