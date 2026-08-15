import { Centers } from "@/components/sections/Centers";
import { Closer } from "@/components/sections/Closer";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Impact } from "@/components/sections/Impact";
import { Journey } from "@/components/sections/Journey";
import { Reserves } from "@/components/sections/Reserves";
import { WhoCanDonate } from "@/components/sections/WhoCanDonate";

export default function HomePage() {
  return (
    <main id="contenu">
      <Hero />
      <WhoCanDonate />
      <Centers />
      <Journey />
      <Impact />
      <Reserves />
      <Faq />
      <Closer />
    </main>
  );
}
