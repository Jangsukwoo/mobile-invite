export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-6 py-16 max-w-2xl mx-auto bg-[#faf9f6] border-y border-[#e8e3d8]/50">
      {children}
    </section>
  );
}
