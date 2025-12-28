import Cover from "@/components/Cover";
import Greeting from "@/components/Greeting";
import Info from "@/components/Info";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Contact from "@/components/Contact";
import Account from "@/components/Account";
import Share from "@/components/Share";

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      <Cover />
      <Greeting />
      <Info />
      <Gallery />
      <Location />
      <Contact />
      <Account />
      <Share />
    </main>
  );
}
