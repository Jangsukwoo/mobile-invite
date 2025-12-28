import Section from "./Section";
import { invite } from "@/data/invite";

export default function Greeting() {
  return (
    <Section>
      <p className="text-sm leading-relaxed whitespace-pre-line text-center text-gray-700">
        {invite.message.trim()}
      </p>
    </Section>
  );
}
