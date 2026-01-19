"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, increment, updateDoc } from "firebase/firestore";

export default function VisitorCounter() {
  const [todayVisitors, setTodayVisitors] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
        const today = new Date().toISOString().split("T")[0];
        console.log("방문자 수 추적: 오늘 날짜", today);
        
        // 로컬 스토리지에서 오늘 이미 방문했는지 확인
        const visitedToday = localStorage.getItem(`visited_${today}`);
        console.log("방문자 수 추적: 오늘 방문 기록", visitedToday);
        
        // 현재 방문자 수 가져오기
        const visitorRef = doc(db, "visitors", today);
        const visitorSnap = await getDoc(visitorRef);
        
        let currentCount = 0;
        
        if (visitorSnap.exists()) {
          currentCount = visitorSnap.data().count || 0;
          console.log("방문자 수 추적: 기존 카운트", currentCount);
        } else {
          console.log("방문자 수 추적: 오늘 첫 방문자");
        }
        
        // 오늘 처음 방문한 경우에만 카운트 증가
        if (!visitedToday) {
          if (visitorSnap.exists()) {
            // increment는 서버 사이드 연산이므로 updateDoc 사용
            await updateDoc(visitorRef, {
              count: increment(1),
              lastUpdated: new Date().toISOString(),
            });
            currentCount += 1;
            console.log("방문자 수 추적: 카운트 증가", currentCount);
          } else {
            await setDoc(visitorRef, {
              count: 1,
              date: today,
              lastUpdated: new Date().toISOString(),
            });
            currentCount = 1;
            console.log("방문자 수 추적: 새 문서 생성", currentCount);
          }
          
          // 로컬 스토리지에 오늘 방문 기록 저장
          localStorage.setItem(`visited_${today}`, "true");
        } else {
          console.log("방문자 수 추적: 이미 오늘 방문함, 카운트 증가 안 함");
        }
        
        setTodayVisitors(currentCount);
      } catch (error: any) {
        console.error("방문자 수 추적 오류:", error);
        console.error("에러 코드:", error?.code);
        console.error("에러 메시지:", error?.message);
        setTodayVisitors(null);
      } finally {
        setIsLoading(false);
      }
    };

    trackVisitor();
  }, []);

  // 오늘 날짜 포맷팅
  const today = new Date();
  const todayFormatted = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-[#8b7a6a] font-light">
          Today
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <p className="text-xs text-[#8b7a6a] font-light">
        Today {todayFormatted} · {todayVisitors !== null ? todayVisitors.toLocaleString() : "-"}
      </p>
    </div>
  );
}
