import Section from "./Section";
import { invite } from "@/data/invite";

export default function Gallery() {
  return (
    <Section>
      <h2 className="text-lg font-semibold text-center mb-6">Gallery</h2>

      <div className="grid grid-cols-2 gap-3">
        {invite.gallery.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`gallery-${idx}`}
            className="rounded-lg object-cover"
          />
        ))}
      </div>
    </Section>
  );
}
