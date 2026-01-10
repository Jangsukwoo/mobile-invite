import Section from "./Section";
import { invite } from "@/data/invite";

function normalizeTel(tel: string) {
  // tel: 링크용으로 하이픈/공백 제거
  return tel.replace(/[^0-9+]/g, "");
}

function ContactCard({
  roleLabel,
  name,
  tel,
}: {
  roleLabel: string;
  name: string;
  tel: string;
}) {
  const telNormalized = normalizeTel(tel);

  return (
    <div className="rounded-xl border-2 border-[#e8e3d8] bg-white/50 p-5 shadow-sm">
      <div className="text-center mb-4">
        <p className="text-xs text-[#8b7a6a]">{roleLabel}</p>
        <p className="text-lg font-normal text-[#5a4a3a] mt-2">{name}</p>
        <p className="text-sm text-[#6b5d4a] mt-1">{tel}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${telNormalized}`}
          className="rounded-xl bg-[#5a4a3a] text-white text-sm py-3 text-center hover:bg-[#4a3d30] transition-colors font-light"
        >
          전화하기
        </a>

        <a
          href={`sms:${telNormalized}`}
          className="rounded-xl border-2 border-[#d4c4b0] text-[#6b5d4a] text-sm py-3 text-center hover:bg-[#f0ede5] transition-colors font-light"
        >
          문자하기
        </a>
      </div>
    </div>
  );
}

export default function Contact() {
  const { groom, bride } = invite.contacts;

  return (
    <Section>
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-light text-[#5a4a3a] tracking-wide" style={{ fontFamily: 'serif' }}>
          연락하기
        </h2>
        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>

        <div className="space-y-4">
          <ContactCard roleLabel="신랑" name={groom.name} tel={groom.tel} />
          <ContactCard roleLabel="신부" name={bride.name} tel={bride.tel} />
        </div>

        <p className="text-xs text-[#8b7a6a] text-center mt-6 leading-relaxed">
          * 버튼을 누르면 휴대폰 기본 전화/문자 앱이 열립니다.
        </p>
      </div>
    </Section>
  );
}
