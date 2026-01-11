"use client";

import { useState } from "react";
import Section from "./Section";

type NoticeTab = "식권" | "주차" | "기타";

export default function Notice() {
  const [activeTab, setActiveTab] = useState<NoticeTab>("식권");

  const tabs: NoticeTab[] = ["식권", "주차", "기타"];

  return (
    <Section>
      <div className="text-center space-y-6">
        <h2
          className="text-2xl font-light text-[#5a4a3a] tracking-wide"
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
          {activeTab === "식권" && (
            <div className="text-sm text-[#6b5d4a] font-light leading-relaxed">
              <p className="text-center leading-relaxed">
                식사권은 축의금 데스크에서 필요한 수량만큼 받으실 수 있습니다. :)
              </p>
            </div>
          )}

          {activeTab === "주차" && (
            <div className="text-sm text-[#6b5d4a] font-light leading-relaxed">
              <p className="text-center text-[#8b7a6a] mb-4">
                주차 안내 내용은 추후 업데이트됩니다.
              </p>
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
