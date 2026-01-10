import Section from "./Section";
import { invite } from "@/data/invite";

export default function Info() {
  return (
    <Section>
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-light text-[#5a4a3a] tracking-wide" style={{ fontFamily: 'serif' }}>
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
      </div>
    </Section>
  );
}
