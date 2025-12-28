import { invite } from "@/data/invite";

export default function Cover() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
      <p className="text-sm tracking-widest mb-4">WEDDING INVITATION</p>

      <h1 className="text-3xl font-semibold mb-2">
        {invite.groom} ♥ {invite.bride}
      </h1>

      <p className="text-sm text-gray-600 mt-4">
        {invite.date}
        <br />
        {invite.time}
      </p>
    </section>
  );
}
