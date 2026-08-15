"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { PRODUCTS } from "@/data/impact";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap-client";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/utils";

registerGsap();

export function Impact() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".impact-title", {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        ease: "editorial",
        scrollTrigger: {
          trigger: ".impact-title",
          start: "top 78%",
        },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const pinEl = pin.current;
        const trackEl = track.current;
        if (!pinEl || !trackEl) return;

        const getTravel = () =>
          Math.max(0, trackEl.scrollWidth - window.innerWidth);

        const tween = gsap.to(trackEl, {
          x: () => -getTravel(),
          ease: "none",
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: () => `+=${getTravel() + window.innerHeight * 0.25}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        const refresh = () => ScrollTrigger.refresh();
        requestAnimationFrame(refresh);
        window.addEventListener("load", refresh);

        return () => {
          window.removeEventListener("load", refresh);
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(trackEl, { clearProps: "transform" });
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="comprendre" ref={root} className="relative bg-hero text-ink">
      <div ref={pin} className="impact-pin">
        <div className="mx-auto max-w-[1440px] px-5 pt-24 md:px-8 md:pt-32 lg:px-12">
          <h2 className="impact-title max-w-[20ch] font-display text-[clamp(2.6rem,6.2vw,5.4rem)] leading-[0.94] font-medium tracking-[-0.03em]">
            Prélevons et
            <br />
            <span className="text-silver">donnons pour sauver !</span>
          </h2>
        </div>

        <div className="mt-14 overflow-hidden pb-24 md:pb-32">
          <div
            ref={track}
            className="impact-track flex w-max gap-2 will-change-transform px-8 md:gap-2.5 md:px-10 lg:gap-3 lg:px-12"
          >
            {PRODUCTS.map((product) => (
              <article
                key={product.id}
                className="impact-product relative flex h-[30rem] w-[calc((100vw-4rem-1rem)/3)] shrink-0 items-end overflow-hidden rounded-[1.25rem] bg-hero p-7 md:h-[36rem] md:w-[calc((100vw-5rem-1.25rem)/3)] md:p-8 lg:h-[40rem] lg:w-[calc((100vw-6rem-1.5rem)/3)] lg:max-w-[30rem] lg:p-10"
              >
                <div className="impact-card-photo pointer-events-none absolute inset-0">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 85vw"
                    className="object-cover object-[50%_20%]"
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-hero via-hero/90 to-transparent"
                  aria-hidden="true"
                />
                <h3 className="relative z-10 max-w-[24ch] font-display text-[clamp(1.35rem,1.9vw,1.85rem)] leading-[1.15] font-medium tracking-[-0.02em] text-balance text-ink">
                  {product.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
