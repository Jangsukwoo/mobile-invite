"use client";

import { useState, useEffect } from "react";
import Section from "./Section";

type NoticeTab = "주차" | "ATM" | "식권" | "기타";

const ATM_IMAGE = "images/atm-guide.PNG";
const PARKING_IMAGE = "images/parking-guide.PNG";

export default function Notice() {
  const [activeTab, setActiveTab] = useState<NoticeTab>("주차");
  const [atmImageSrc, setAtmImageSrc] = useState(ATM_IMAGE);
  const [parkingImageSrc, setParkingImageSrc] = useState(PARKING_IMAGE);

  const tabs: NoticeTab[] = ["주차", "ATM", "식권", "기타"];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
    const base = isLocalhost ? "" : "/mobile-invite";
    setAtmImageSrc(base ? `${base}/${ATM_IMAGE}` : `/${ATM_IMAGE}`);
    setParkingImageSrc(base ? `${base}/${PARKING_IMAGE}` : `/${PARKING_IMAGE}`);
  }, []);

  return (
    <Section>
      <div className="text-center space-y-6">
        <h2
          className="text-2xl font-bold text-[#5a4a3a] tracking-wide"
          style={{ fontFamily: "serif" }}
        >
          안내사항
        </h2>
        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>

        {/* 탭 버튼 */}
        <div className="flex gap-2 justify-center border-b-2 border-[#e8e3d8] pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-3 text-sm font-light transition-colors relative
                ${
                  activeTab === tab
                    ? "text-[#5a4a3a] font-normal"
                    : "text-[#8b7a6a] hover:text-[#6b5d4a]"
                }
              `}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5a4a3a] -mb-[2px]"></div>
              )}
            </button>
          ))}
        </div>

        {/* 탭 내용 */}
        <div className="min-h-[200px] text-left pt-6">
          {activeTab === "ATM" && (
            <div className="text-sm text-[#6b5d4a] font-light leading-relaxed space-y-4">
              <p className="text-center leading-relaxed">
                ATM기기는 접수대 통로 끝 쪽에 준비되어 있습니다.
              </p>
              <p className="text-center leading-relaxed text-[#8b7a6a]">
                또는, 1층 세븐일레븐 내에 ATM기기를 이용하실 수 있습니다
              </p>
              <div className="rounded-xl overflow-hidden border border-[#e8e3d8]">
                <img
                  src={atmImageSrc}
                  alt="ATM 안내 사진"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          {activeTab === "식권" && (
            <div className="text-sm text-[#6b5d4a] font-light leading-relaxed">
              <p className="text-center leading-relaxed">
                식사권은 축의금 데스크에서 필요한 수량만큼 받으실 수 있습니다. :)
              </p>
            </div>
          )}

          {activeTab === "주차" && (
            <div className="text-sm text-[#6b5d4a] font-light leading-relaxed space-y-4">
              <p className="text-center leading-relaxed">
                연회장 입구 안내데스크에서 2시간 등록해드립니다.
              </p>
              <p className="text-center leading-relaxed">
                주차장은 지하 2층부터 지하 5층이며 2시간 초과시 10분당 1,000원이 부과됩니다.
              </p>
              <div className="rounded-xl overflow-hidden border border-[#e8e3d8]">
                <img
                  src={parkingImageSrc}
                  alt="주차 안내 사진"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          {activeTab === "기타" && (
            <div className="text-sm text-[#6b5d4a] font-light leading-relaxed">
              <p className="text-center text-[#8b7a6a] mb-4">
                기타 안내 내용은 추후 업데이트됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
