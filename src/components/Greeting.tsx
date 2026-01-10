import Section from "./Section";
import { invite } from "@/data/invite";

export default function Greeting() {
  return (
    <Section>
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-light text-[#5a4a3a] tracking-wide" style={{ fontFamily: 'serif' }}>
          인사말
        </h2>
        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>
        <p className="text-base leading-relaxed whitespace-pre-line text-center text-[#6b5d4a] font-light">
          {invite.message.trim()}
        </p>
      </div>
    </Section>
  );
}
