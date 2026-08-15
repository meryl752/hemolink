"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { PRODUCTS } from "@/data/impact";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap-client";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { prefersReducedMotion } from "@/lib/utils";

registerGsap();

export function Impact() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncButtons = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    syncButtons();
    el.addEventListener("scroll", syncButtons, { passive: true });
    window.addEventListener("resize", syncButtons);
    return () => {
      el.removeEventListener("scroll", syncButtons);
      window.removeEventListener("resize", syncButtons);
    };
  }, [syncButtons]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("article");
    const amount = card
      ? card.getBoundingClientRect().width + 12
      : el.clientWidth * 0.82;
    el.scrollBy({
      left: direction * amount,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

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
      const trackEl = track.current;

      mm.add("(max-width: 1023px)", () => {
        if (!trackEl) return;
        gsap.set(trackEl, { clearProps: "transform,x" });
      });

      mm.add("(min-width: 1024px)", () => {
        const pinEl = pin.current;
        if (!pinEl || !trackEl) return;

        gsap.set(trackEl, { x: 0 });

        const getTravel = () =>
          Math.max(0, trackEl.scrollWidth - window.innerWidth);

        const tween = gsap.to(trackEl, {
          x: () => -getTravel(),
          ease: "none",
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: () => `+=${getTravel() + window.innerHeight * 0.35}`,
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
        trackEl.querySelectorAll("img").forEach((img) => {
          if (!img.complete) img.addEventListener("load", refresh, { once: true });
        });

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
          <h2 className="impact-title max-w-[20ch] font-display text-[clamp(2.6rem,6.2vw,5.4rem)] leading-[0.94] font-medium tracking-[-0.03em] max-lg:text-[2.35rem]">
            Prélevons et
            <br />
            <span className="text-silver">donnons pour sauver !</span>
          </h2>
        </div>

        <div
          ref={scroller}
          className="impact-scroller mt-14 w-full min-w-0 max-w-[100vw] snap-x snap-proximity overflow-x-auto overflow-y-hidden pb-6 scroll-px-5 md:scroll-px-8 lg:overflow-hidden lg:pb-32 lg:snap-none lg:scroll-px-0"
        >
          <div
            ref={track}
            className="impact-track flex w-max gap-3 px-5 md:px-8 lg:px-12 lg:will-change-transform"
          >
            {PRODUCTS.map((product) => (
              <article
                key={product.id}
                className="impact-product relative flex h-[24.5rem] w-[min(78vw,20.5rem)] shrink-0 snap-start items-end overflow-hidden rounded-[1.25rem] bg-hero p-6 md:h-[28rem] md:w-[min(70vw,22rem)] md:p-7 lg:h-[40rem] lg:w-[calc((100vw-6rem-1.5rem)/3)] lg:max-w-[30rem] lg:p-10"
              >
                <div className="impact-card-photo pointer-events-none absolute inset-0">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 78vw"
                    draggable={false}
                    className={product.imageFit}
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-hero via-hero/90 to-transparent"
                  aria-hidden="true"
                />
                <h3 className="relative z-10 max-w-[24ch] font-display text-[1.5rem] leading-[1.15] font-medium tracking-[-0.02em] text-balance text-ink md:text-[1.65rem] lg:text-[clamp(1.35rem,1.9vw,1.85rem)]">
                  {product.title}
                </h3>
              </article>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pb-16 lg:hidden">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink disabled:opacity-30"
            aria-label="Carte précédente"
          >
            <Icon name="arrowLeft" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink disabled:opacity-30"
            aria-label="Carte suivante"
          >
            <Icon name="arrowRight" className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
