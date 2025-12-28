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
    <div className="rounded-2xl border p-5">
      <div className="text-center mb-4">
        <p className="text-xs text-gray-500">{roleLabel}</p>
        <p className="text-base font-semibold mt-1">{name}</p>
        <p className="text-sm text-gray-600 mt-1">{tel}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${telNormalized}`}
          className="rounded-xl bg-gray-900 text-white text-sm py-3 text-center"
        >
          전화하기
        </a>

        <a
          href={`sms:${telNormalized}`}
          className="rounded-xl border text-sm py-3 text-center hover:bg-gray-50"
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
      <h2 className="text-lg font-semibold text-center mb-6">연락하기</h2>

      <div className="space-y-4">
        <ContactCard roleLabel="신랑" name={groom.name} tel={groom.tel} />
        <ContactCard roleLabel="신부" name={bride.name} tel={bride.tel} />
      </div>

      <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
        * 버튼을 누르면 휴대폰 기본 전화/문자 앱이 열립니다.
      </p>
    </Section>
  );
}
