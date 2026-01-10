import Cover from "@/components/Cover";
import Greeting from "@/components/Greeting";
import Info from "@/components/Info";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Contact from "@/components/Contact";
import Account from "@/components/Account";
import Share from "@/components/Share";
import Guestbook from "@/components/Guestbook";
import CoverHero from "@/components/CoverHero";

export default function Home() {
  return (
    <main className="bg-[#faf9f6] text-[#5a4a3a] min-h-screen">
      <CoverHero />
      <Cover />
      <Greeting />
      <Info />
      <Gallery />
      <Location />
      <Contact />
      <Account />
      <Share />
      <Guestbook />
    </main>
  );
}
