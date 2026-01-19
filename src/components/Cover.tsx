"use client";

import { invite } from "@/data/invite";
import { useEffect, useRef, useState } from "react";

export default function Cover() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cover-section"
      className={`min-h-[60vh] flex flex-col justify-center items-center text-center px-6 bg-[#faf9f6] border-y border-[#e8e3d8]/50 transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="space-y-4">
        <p className="text-xs tracking-widest mb-4 text-[#8b7a6a] uppercase">
          Wedding Invitation
        </p>

        <h1
          className="text-2xl sm:text-4xl font-bold mb-4 text-[#5a4a3a] tracking-wide whitespace-nowrap px-2"
          style={{ fontFamily: "serif", fontWeight: 700 }}
        >
          {invite.groom} ♥ {invite.bride}
        </h1>

        <div className="mb-4">
          <p className="text-base text-[#6b5d4a] font-light leading-relaxed">
            장광용의 아들 장석우
            <br />
            박덕영 김정임의 딸 박주영
          </p>
        </div>

        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>

        <p className="text-base text-[#6b5d4a] mt-6 font-light leading-relaxed">
          {invite.date}
          <br />
          {invite.time}
        </p>
      </div>
    </section>
  );
}
