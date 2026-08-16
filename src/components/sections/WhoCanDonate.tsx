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
      const mm = gsap.matchMedia();
      const reduce = prefersReducedMotion();

      mm.add("(min-width: 1024px)", () => {
        const pinEl = pin.current;
        const card = root.current?.querySelector<HTMLElement>(".who-card");
        const beats = gsap.utils.toArray<HTMLElement>(".who-card .who-beat");
        if (!pinEl || !card || beats.length === 0) return;

        const hideLeft = (el: HTMLElement) => -el.offsetWidth;
        const parkRight = (el: HTMLElement) => card.offsetWidth - el.offsetWidth;
        const hideRight = () => card.offsetWidth;

        if (reduce) {
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
      });

      mm.add("(max-width: 1023px)", () => {
        const sheet = root.current?.querySelector<HTMLElement>(".who-sheet");
        const track = root.current?.querySelector<HTMLElement>(".who-vein-wrap");
        const svg = track?.querySelector<SVGElement>("svg");
        const vein = root.current?.querySelector<SVGPathElement>(".who-vein-path");
        const nodes = gsap.utils.toArray<HTMLElement>(".who-node");
        if (!sheet) return;

        const layoutVein = () => {
          if (!track || !svg) return;
          const dots = gsap.utils.toArray<HTMLElement>(".who-dot", sheet);
          if (dots.length < 2) return;
          const trackRect = track.getBoundingClientRect();
          const first = dots[0].getBoundingClientRect();
          const last = dots[dots.length - 1].getBoundingClientRect();
          const y1 = first.top + first.height / 2 - trackRect.top;
          const y2 = last.top + last.height / 2 - trackRect.top;
          svg.style.top = `${y1}px`;
          svg.style.height = `${Math.max(y2 - y1, 1)}px`;
          svg.style.bottom = "auto";
        };

        layoutVein();
        requestAnimationFrame(layoutVein);
        void document.fonts?.ready.then(layoutVein);
        const ro = new ResizeObserver(layoutVein);
        ro.observe(sheet);
        ScrollTrigger.addEventListener("refreshInit", layoutVein);

        if (reduce) {
          if (vein) gsap.set(vein, { drawSVG: "100%" });
          return () => {
            ro.disconnect();
            ScrollTrigger.removeEventListener("refreshInit", layoutVein);
          };
        }

        gsap.from(".who-title", {
          y: 20,
          autoAlpha: 0,
          duration: 0.7,
          ease: "editorial",
          scrollTrigger: {
            trigger: ".who-title",
            start: "top 82%",
          },
        });

        if (vein) {
          gsap.set(vein, { drawSVG: "0%" });
          gsap.to(vein, {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: sheet,
              start: "top 78%",
              end: "bottom 58%",
              scrub: 0.55,
              onRefresh: layoutVein,
            },
          });
        }

        gsap.from(nodes, {
          autoAlpha: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "editorial",
          scrollTrigger: {
            trigger: sheet,
            start: "top 72%",
          },
        });

        return () => {
          ro.disconnect();
          ScrollTrigger.removeEventListener("refreshInit", layoutVein);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="criteres" ref={root} className="relative bg-hero text-ink">
      <div
        ref={pin}
        className="who-pin flex min-h-svh items-center max-lg:min-h-0"
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-5 pt-24 pb-10 md:gap-16 md:px-8 md:pt-32 md:pb-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-12 xl:gap-20">
          <h2 className="who-title w-full max-w-[min(100%,28rem)] shrink-0 font-display text-[clamp(2.4rem,5.2vw,4.6rem)] leading-[0.96] font-medium tracking-[-0.03em] max-lg:text-[min(2.25rem,calc((100vw-2.5rem)/12.4))]">
            <span className="hidden whitespace-nowrap lg:block">
              Il vous suffit de
            </span>
            <span className="mt-[0.06em] hidden whitespace-nowrap lg:block">
              respecter ces
            </span>
            <span className="mt-[0.06em] hidden whitespace-nowrap text-silver lg:block">
              conditions.
            </span>
            <span className="block whitespace-nowrap lg:hidden">
              Il vous suffit de
            </span>
            <span className="mt-[0.06em] block whitespace-nowrap text-silver lg:hidden">
              respecter ces conditions.
            </span>
          </h2>

          <article className="who-sheet relative w-full overflow-hidden rounded-[1.4rem] bg-white px-6 py-9 lg:hidden">
            <div className="who-vein-wrap relative">
              <svg
                className="pointer-events-none absolute top-0 left-0 h-full w-[10px]"
                viewBox="0 0 10 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  className="who-vein-path veil-path"
                  d="M5 0 L5 100"
                  opacity="0.55"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <ol className="space-y-9">
                {BEATS.map((beat) => (
                  <li
                    key={beat.rest}
                    className="who-node grid grid-cols-[10px_1fr] items-start gap-x-4 gap-y-2.5"
                  >
                    <p className="col-start-2 font-display text-[0.95rem] leading-none font-medium tracking-[-0.02em] text-ink/50">
                      {beat.lead}
                    </p>
                    <span
                      className="who-dot relative z-10 col-start-1 row-start-2 size-[10px] self-center justify-self-center rounded-full bg-blood ring-[3px] ring-white"
                      aria-hidden="true"
                    />
                    <p className="col-start-2 row-start-2 font-display text-[2.15rem] leading-[0.94] font-medium tracking-[-0.03em] text-blood">
                      {beat.rest}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </article>

          <article className="who-card relative hidden h-[22rem] w-full max-w-[40rem] overflow-hidden rounded-[1.4rem] bg-white md:h-[26rem] lg:block lg:h-[28rem] lg:max-w-[46rem] lg:translate-x-8 xl:translate-x-14">
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
