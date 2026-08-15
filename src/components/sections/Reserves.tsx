"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  LEVEL_LABEL,
  RESERVES,
  type BloodGroup,
  type ReserveLevel,
} from "@/data/reserves";
import { gsap, registerGsap } from "@/lib/gsap-client";
import { cn, prefersReducedMotion } from "@/lib/utils";

registerGsap();

const WASH: Record<ReserveLevel, string> = {
  critique: "bg-blood/45",
  tendu: "bg-ink/25",
  stable: "bg-ink/12",
  confortable: "bg-silver/50",
};

const DROP_ROWS: BloodGroup[][] = [
  ["O-"],
  ["O+", "B-"],
  ["A-", "B+", "A+"],
  ["AB-", "AB+"],
];

const BY_GROUP = Object.fromEntries(
  RESERVES.map((item) => [item.group, item]),
) as Record<BloodGroup, (typeof RESERVES)[number]>;

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
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="blood-drop" clipPathUnits="objectBoundingBox">
            <path d="M0.5 0C0.5 0 0.06 0.38 0.06 0.62C0.06 0.84 0.26 1 0.5 1C0.74 1 0.94 0.84 0.94 0.62C0.94 0.38 0.5 0 0.5 0Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="mx-auto flex max-w-[1440px] flex-col-reverse items-center justify-center gap-10 px-5 pt-24 pb-24 md:px-8 md:pt-32 md:pb-32 lg:flex-row lg:items-center lg:gap-16 lg:px-12">
        <h2 className="max-w-[14ch] shrink-0 text-center font-display text-[clamp(2rem,4.4vw,4.2rem)] leading-[0.96] font-medium tracking-[-0.03em] lg:text-left">
          <span className="block">Le sang ne se stocke</span>
          <span className="block text-silver">pas longtemps.</span>
        </h2>

        <div className="reserve-mosaic flex w-full max-w-[22rem] shrink-0 flex-col items-center lg:max-w-[26rem]">
          {DROP_ROWS.map((row, rowIndex) => (
            <ul
              key={row.join("-")}
              className={cn(
                "flex items-start justify-center gap-1.5 md:gap-2",
                rowIndex > 0 && "-mt-3 md:-mt-4",
                rowIndex === 0 && "mb-0",
              )}
            >
              {row.map((group) => {
                const item = BY_GROUP[group];
                const tip = rowIndex === 0;
                return (
                  <li
                    key={item.group}
                    className={cn(
                      tip
                        ? "w-[4.6rem] md:w-[5.6rem] lg:w-[6.2rem]"
                        : "w-[5.15rem] md:w-[6.35rem] lg:w-[7rem]",
                    )}
                  >
                    <article
                      className="reserve-tile relative aspect-[4/5] bg-white [clip-path:url(#blood-drop)]"
                      aria-label={`${item.group}, ${LEVEL_LABEL[item.level]}`}
                    >
                      <div
                        className={cn(
                          "reserve-wash absolute inset-x-0 bottom-0 origin-bottom",
                          WASH[item.level],
                        )}
                        style={{ height: `${Math.round(item.fill * 100)}%` }}
                      />
                      <div className="relative z-10 flex h-full flex-col items-center justify-center pt-[28%]">
                        <p
                          className={cn(
                            "font-display leading-none font-medium tracking-[-0.05em]",
                            tip
                              ? "text-[0.95rem] md:text-[1.15rem]"
                              : "text-[1.05rem] md:text-[1.35rem]",
                          )}
                        >
                          {item.group}
                        </p>
                        <p className="mt-1 text-[6px] tracking-[0.12em] text-ink/45 uppercase md:text-[8px]">
                          {LEVEL_LABEL[item.level]}
                        </p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
