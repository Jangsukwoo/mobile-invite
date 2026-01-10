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
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);

    // Google Maps API 키 확인
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || !mapRef.current || !loc.latitude || !loc.longitude) {
      console.warn("Google Maps API 키가 없거나 좌표가 없습니다.");
      return;
    }

    // Google Maps API 로드 확인 및 지도 생성
    const loadGoogleMap = () => {
      // 이미 Google Maps API가 로드되어 있으면 바로 사용
      if (window.google && window.google.maps) {
        createMap();
        return;
      }

      // 이미 스크립트가 로드 중이면 대기
      if (
        document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')
      ) {
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
        }, 5000);

        return;
      }

      // Google Maps API 스크립트 로드
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=ko&region=KR&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          createMap();
        } else {
          console.error("Google Maps API를 로드할 수 없습니다.");
          setMapLoaded(false);
        }
      };
      script.onerror = (error) => {
        console.error("Google Maps API 로드 실패:", error);
        setMapLoaded(false);
      };
      document.head.appendChild(script);
    };

    const createMap = () => {
      if (!mapRef.current || googleMapRef.current) return;

      try {
        const mapOptions = {
          center: {
            lat: loc.latitude!,
            lng: loc.longitude!,
          },
          zoom: 17,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#e8e3d8" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#5a4a3a" }],
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
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
          title: loc.address,
          animation: window.google.maps.Animation.DROP,
        });

        // 정보창 생성
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; text-align: center;">
              <div style="font-weight: 600; color: #5a4a3a; font-size: 14px; margin-bottom: 4px;">
                ${invite.venue}
              </div>
              <div style="color: #8b7a6a; font-size: 12px;">
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

        setMapLoaded(true);
      } catch (error) {
        console.error("Google Maps 생성 실패:", error);
        setMapLoaded(false);
      }
    };

    // 약간의 지연 후 지도 로드 시도
    const timer = setTimeout(() => {
      loadGoogleMap();
    }, 100);

    return () => {
      clearTimeout(timer);
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
            className="rounded-xl overflow-hidden border-2 border-[#d4c4b0] shadow-lg bg-white relative mb-6"
            style={{ height: "450px", width: "100%" }}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5] z-10">
                <div className="text-center">
                  <div className="text-[#8b7a6a] text-sm mb-2">
                    {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                      ? "지도를 불러오는 중..."
                      : "Google Maps API 키가 필요합니다."}
                  </div>
                  {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                    <p className="text-xs text-[#8b7a6a] mt-2">
                      .env.local 파일에 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY를
                      설정해주세요.
                    </p>
                  )}
                </div>
              </div>
            )}
            <div
              ref={mapRef}
              style={{ height: "100%", width: "100%" }}
              className="rounded-lg"
            />
          </div>
        ) : (
          <div className="w-full h-[450px] flex items-center justify-center text-[#8b7a6a] rounded-xl border-2 border-[#e8e3d8] bg-[#f5f5f5] mb-6">
            좌표 정보가 없습니다.
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
