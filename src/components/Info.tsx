import Section from "./Section";
import { invite } from "@/data/invite";

export default function Info() {
  return (
    <Section>
      <h2 className="text-lg font-semibold text-center mb-6">예식 안내</h2>

      <div className="text-sm text-center text-gray-700 space-y-2">
        <p>{invite.date}</p>
        <p>{invite.time}</p>
        <p>{invite.venue}</p>
      </div>
    </Section>
  );
}
