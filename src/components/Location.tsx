import Section from "./Section";
import { invite } from "@/data/invite";

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block w-full rounded-xl border px-4 py-3 text-sm text-center hover:bg-gray-50"
    >
      {label}
    </a>
  );
}

export default function Location() {
  const loc = invite.location;

  return (
    <Section>
      <h2 className="text-lg font-semibold text-center mb-6">오시는 길</h2>

      <div className="text-sm text-center text-gray-700 space-y-2 mb-6">
        <p className="font-medium">{invite.venue}</p>
        <p>{loc.address}</p>
      </div>

      {/* 지도 미리보기: API 없이 Google Maps Embed (가장 안정적) */}
      <div className="rounded-2xl overflow-hidden border mb-6">
        <iframe
          title="map"
          className="w-full h-72"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            loc.address
          )}&output=embed`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LinkButton href={loc.googleMapUrl} label="구글지도" />
      </div>

      <div className="mt-8 text-xs text-gray-500 leading-relaxed">
        <p className="mb-2">
          * 길찾기 버튼을 누르면 해당 앱/웹으로 이동합니다.
        </p>
        <p>* iPhone에서는 ‘카카오내비’가 설치되어 있어야 앱으로 열립니다.</p>
      </div>
    </Section>
  );
}
