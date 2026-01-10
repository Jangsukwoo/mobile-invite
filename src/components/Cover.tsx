import { invite } from "@/data/invite";

export default function Cover() {
  return (
    <section
      id="cover-section"
      className="min-h-[60vh] flex flex-col justify-center items-center text-center px-6 bg-[#faf9f6] border-y border-[#e8e3d8]/50"
    >
      <div className="space-y-4">
        <p className="text-xs tracking-widest mb-4 text-[#8b7a6a] uppercase">
          Wedding Invitation
        </p>

        <h1
          className="text-3xl sm:text-4xl font-light mb-4 text-[#5a4a3a] tracking-wide"
          style={{ fontFamily: "serif" }}
        >
          {invite.groom} ♥ {invite.bride}
        </h1>

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
