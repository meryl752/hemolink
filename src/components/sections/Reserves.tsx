"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { LEVEL_LABEL, RESERVES, type ReserveLevel } from "@/data/reserves";
import { gsap, registerGsap } from "@/lib/gsap-client";
import { cn, prefersReducedMotion } from "@/lib/utils";

registerGsap();

const WASH: Record<ReserveLevel, string> = {
  critique: "bg-blood/45",
  tendu: "bg-ink/25",
  stable: "bg-ink/12",
  confortable: "bg-silver/50",
};

const DROP_POS: Record<
  (typeof RESERVES)[number]["group"],
  { left: string; top: string; size: string }
> = {
  "O-": { left: "50%", top: "18%", size: "23%" },
  "O+": { left: "36%", top: "37%", size: "25%" },
  "B-": { left: "64%", top: "37%", size: "25%" },
  "A-": { left: "24%", top: "56%", size: "25%" },
  "B+": { left: "50%", top: "55%", size: "25%" },
  "A+": { left: "76%", top: "56%", size: "25%" },
  "AB-": { left: "37%", top: "75%", size: "25%" },
  "AB+": { left: "63%", top: "75%", size: "25%" },
};

export function Reserves() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".reserve-wash", {
        scaleY: 0,
        transformOrigin: "bottom center",
        stagger: 0.06,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".reserve-mosaic", start: "top 78%" },
      });
      gsap.from(".reserve-tile", {
        y: 18,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "editorial",
        scrollTrigger: { trigger: ".reserve-mosaic", start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="reserves" ref={root} className="bg-hero text-ink">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14 px-5 pt-24 pb-24 md:px-8 md:pt-32 md:pb-32 lg:flex-row lg:items-center lg:justify-between lg:gap-20 lg:px-12">
        <h2 className="max-w-[14ch] font-display text-[clamp(2rem,4.4vw,4.2rem)] leading-[0.96] font-medium tracking-[-0.03em]">
          <span className="block">Le sang ne se stocke</span>
          <span className="block text-silver">pas longtemps.</span>
        </h2>

        <div className="reserve-mosaic relative aspect-[32/40] w-full max-w-[22rem] self-start lg:max-w-[26rem] lg:self-center">
          <svg
            viewBox="0 0 32 40"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M16 2C16 2 4 16.2 4 24.5C4 31.4 9.4 37 16 37C22.6 37 28 31.4 28 24.5C28 16.2 16 2 16 2Z"
              className="fill-blood/10"
            />
          </svg>
          <ul className="absolute inset-0">
          {RESERVES.map((item) => {
            const pos = DROP_POS[item.group];
            return (
              <li
                key={item.group}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: pos.left, top: pos.top, width: pos.size }}
              >
                <article
                  className="reserve-tile relative aspect-square overflow-hidden rounded-full bg-white"
                  aria-label={`${item.group}, ${LEVEL_LABEL[item.level]}`}
                >
                  <div
                    className={cn(
                      "reserve-wash absolute inset-x-0 bottom-0 origin-bottom",
                      WASH[item.level],
                    )}
                    style={{ height: `${Math.round(item.fill * 100)}%` }}
                  />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center px-1">
                    <p className="font-display text-[1.05rem] leading-none font-medium tracking-[-0.05em] md:text-[1.35rem]">
                      {item.group}
                    </p>
                    <p className="mt-1 text-[7px] tracking-[0.14em] text-ink/45 uppercase md:text-[8px]">
                      {LEVEL_LABEL[item.level]}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
          </ul>
        </div>
      </div>
    </section>
  );
}
