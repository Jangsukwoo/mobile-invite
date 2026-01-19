"use client";

import { useEffect, useState } from "react";
import Section from "./Section";
import { invite } from "@/data/invite";

export default function Info() {
  const [daysLeft, setDaysLeft] = useState(0);
  const weddingDate = new Date("2026-03-28T17:00:00");

  useEffect(() => {
    const calculateDaysLeft = () => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    };

    calculateDaysLeft();
    const interval = setInterval(calculateDaysLeft, 1000 * 60 * 60); // 매 시간 업데이트

    return () => clearInterval(interval);
  }, []);

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const year = 2026;
  const month = 2; // 3월 (0-based)
  const day = 28;

  // 달력 생성 (3월)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: (number | null)[] = [];

  // 빈 칸 추가
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // 날짜 추가
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <Section>
      <div className="text-center space-y-6">
        <h2
          className="text-2xl font-bold text-[#5a4a3a] tracking-wide"
          style={{ fontFamily: "serif" }}
        >
          예식 안내
        </h2>
        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>

        <div className="text-base text-center text-[#6b5d4a] space-y-3 font-light">
          <p className="text-lg">{invite.date}</p>
          <p className="text-lg">{invite.time}</p>
          <div className="pt-3">
            <p className="text-sm text-[#8b7a6a] mb-2">장소</p>
            <p>{invite.venue}</p>
          </div>
        </div>

        {/* 달력과 D-day */}
        <div className="pt-8 space-y-6">
          {/* 달력 */}
          <div className="max-w-[280px] mx-auto">
            <div className="rounded-xl border-2 border-[#d4c4b0] bg-white/50 p-4 shadow-sm">
              <div className="text-center mb-3">
                <p className="text-lg font-normal text-[#5a4a3a]">
                  {year % 100}년 {month + 1}월
                </p>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((d) => (
                  <div
                    key={d}
                    className="text-xs text-[#8b7a6a] font-normal py-1 text-center"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, idx) => (
                  <div
                    key={idx}
                    className={`
                      aspect-square flex items-center justify-center text-xs
                      ${
                        date === day
                          ? "bg-[#5a4a3a] text-white rounded-full font-medium"
                          : date
                          ? "text-[#6b5d4a] font-light"
                          : ""
                      }
                    `}
                  >
                    {date}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* D-day */}
          <div className="py-4">
            <p className="text-sm text-[#8b7a6a] mb-2">결혼식까지</p>
            <div className="flex items-center justify-center gap-2">
              <span className="handwrite text-3xl sm:text-4xl text-[#5a4a3a] font-medium">
                D-{daysLeft}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
