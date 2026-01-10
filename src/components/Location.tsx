import Section from "./Section";
import { invite } from "@/data/invite";

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block w-full rounded-xl border-2 border-[#d4c4b0] px-4 py-3 text-sm text-center text-[#6b5d4a] hover:bg-[#f0ede5] transition-colors font-light"
    >
      {label}
    </a>
  );
}

export default function Location() {
  const loc = invite.location;

  return (
    <Section>
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-light text-[#5a4a3a] tracking-wide" style={{ fontFamily: 'serif' }}>
          오시는 길
        </h2>
        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>

        <div className="text-base text-center text-[#6b5d4a] space-y-3 font-light mb-6">
          <p className="text-lg font-normal">{invite.venue}</p>
          <p className="text-sm text-[#8b7a6a]">{loc.address}</p>
        </div>

        {/* 지도 미리보기: API 없이 Google Maps Embed (가장 안정적) */}
        <div className="rounded-xl overflow-hidden border-2 border-[#e8e3d8] shadow-md mb-6">
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

        <div className="grid grid-cols-1 gap-3">
          <LinkButton href={loc.googleMapUrl} label="구글지도로 길찾기" />
        </div>

        <div className="mt-6 text-xs text-[#8b7a6a] leading-relaxed">
          <p className="mb-1">
            * 길찾기 버튼을 누르면 해당 앱/웹으로 이동합니다.
          </p>
          <p>* iPhone에서는 '카카오내비'가 설치되어 있어야 앱으로 열립니다.</p>
        </div>
      </div>
    </Section>
  );
}
