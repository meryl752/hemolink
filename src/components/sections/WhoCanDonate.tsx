"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";

registerGsap();

const BEATS = [
  { lead: "Avoir entre", rest: "18 et 65 ans" },
  { lead: "Peser au moins", rest: "50 kg" },
  { lead: "Dernière prise de sang", rest: "3 ou 4 mois" },
] as const;

export function WhoCanDonate() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const pinEl = pin.current;
      const card = root.current?.querySelector<HTMLElement>(".who-card");
      const beats = gsap.utils.toArray<HTMLElement>(".who-beat");
      if (!pinEl || !card || beats.length === 0) return;

      const hideLeft = (el: HTMLElement) => -el.offsetWidth;
      const parkRight = (el: HTMLElement) => card.offsetWidth - el.offsetWidth;
      const hideRight = () => card.offsetWidth;

      if (prefersReducedMotion()) {
        beats.forEach((beat) => {
          const a = beat.querySelector<HTMLElement>(".who-line-a");
          const b = beat.querySelector<HTMLElement>(".who-line-b");
          if (a) gsap.set(a, { x: 0 });
          if (b) gsap.set(b, { x: 0 });
        });
        return;
      }

      beats.forEach((beat) => {
        const a = beat.querySelector<HTMLElement>(".who-line-a");
        const b = beat.querySelector<HTMLElement>(".who-line-b");
        if (!a || !b) return;
        gsap.set(a, { x: hideLeft(a) });
        gsap.set(b, { x: hideRight() });
      });

      const travel = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: () => `+=${window.innerHeight * 3.2}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      beats.forEach((beat, i) => {
        const a = beat.querySelector<HTMLElement>(".who-line-a");
        const b = beat.querySelector<HTMLElement>(".who-line-b");
        if (!a || !b) return;

        const isLast = i === beats.length - 1;

        travel.to(a, { x: () => parkRight(a), duration: 1 });
        travel.to(b, { x: 0, duration: 1 }, "-=0.82");

        if (isLast) return;

        travel.to(a, { x: hideRight, duration: 0.7 }, "+=0.28");
        travel.to(b, { x: () => hideLeft(b), duration: 0.7 }, "<");
      });

      const refresh = () => ScrollTrigger.refresh();
      requestAnimationFrame(refresh);

      return () => {
        travel.scrollTrigger?.kill();
        travel.kill();
      };
    },
    { scope: root },
  );

  return (
    <section id="criteres" ref={root} className="relative bg-hero text-ink">
      <div ref={pin} className="who-pin flex min-h-svh items-center">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-5 pt-24 pb-10 md:gap-16 md:px-8 md:pt-32 md:pb-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-12 xl:gap-20">
          <h2 className="who-title w-full max-w-[min(100%,28rem)] shrink-0 font-display text-[clamp(2.4rem,5.2vw,4.6rem)] leading-[0.96] font-medium tracking-[-0.03em]">
            <span className="block whitespace-nowrap">Il vous suffit de</span>
            <span className="mt-[0.06em] block whitespace-nowrap">
              respecter ces
            </span>
            <span className="mt-[0.06em] block whitespace-nowrap text-silver">
              conditions.
            </span>
          </h2>

          <article className="who-card relative h-[22rem] w-full max-w-[40rem] overflow-hidden rounded-[1.4rem] bg-white md:h-[26rem] lg:h-[28rem] lg:max-w-[46rem] lg:translate-x-8 xl:translate-x-14">
            {BEATS.map((beat) => (
              <div key={beat.rest} className="who-beat pointer-events-none absolute inset-0">
                <p className="who-line-a absolute top-[22%] left-0 whitespace-nowrap px-7 font-display text-[clamp(1.35rem,2.1vw,1.85rem)] leading-none font-medium tracking-[-0.03em] text-silver md:px-9">
                  {beat.lead}
                </p>
                <p className="who-line-b absolute top-[46%] left-0 max-w-[calc(100%-1.5rem)] px-7 font-display text-[clamp(2.85rem,5.4vw,4.85rem)] leading-[0.92] font-medium tracking-[-0.04em] text-blood italic md:px-9">
                  {beat.rest}
                </p>
              </div>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}
