"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { EligibilityForm } from "@/components/sections/EligibilityQuiz";
import { gsap, SplitText, registerGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";

registerGsap();

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const title = root.current?.querySelector<HTMLElement>(".hero-title-ink");
      const silver = root.current?.querySelector(".hero-silver-a");
      const stack = root.current?.querySelector<HTMLElement>(".hero-stack");
      const copy = root.current?.querySelector<HTMLElement>(".hero-copy");
      const photo = root.current?.querySelector<HTMLElement>(".hero-photo");
      const imgA = root.current?.querySelector<HTMLElement>(".hero-img-a");
      const imgB = root.current?.querySelector<HTMLElement>(".hero-img-b");
      const copyMid = root.current?.querySelector<HTMLElement>(".hero-copy-mid");
      const midLines = root.current?.querySelectorAll<HTMLElement>(
        ".hero-mid-line",
      );
      const copyB = root.current?.querySelector<HTMLElement>(".hero-copy-b");
      const front = root.current?.querySelector<HTMLElement>(".hero-front");
      if (
        !title ||
        !silver ||
        !stack ||
        !copy ||
        !photo ||
        !imgA ||
        !imgB ||
        !copyMid ||
        !midLines ||
        !copyB ||
        !front
      )
        return;

      const mm = gsap.matchMedia();

      mm.add("(max-width: 1023px)", () => {
        const lines = gsap.utils.toArray<HTMLElement>(".hero-intro-line > span");
        if (lines.length) {
          gsap.from(lines, {
            yPercent: 115,
            rotateZ: 4,
            stagger: 0.07,
            duration: 1.15,
            ease: "editorial",
          });
        }
      });

      mm.add("(min-width: 1024px)", () => {
        const sangMark = title.querySelector(".hero-sang");
        if (sangMark) sangMark.replaceWith(...Array.from(sangMark.childNodes));

        const split = new SplitText(title, { type: "chars,words,lines" });
        split.words.forEach((word) => {
          if (word.textContent?.trim() === "sang") {
            word.classList.add("hero-sang");
          }
        });
        split.lines.forEach((line) => {
          (line as HTMLElement).style.overflow = "hidden";
          (line as HTMLElement).style.display = "block";
        });

        gsap
          .timeline({ defaults: { ease: "editorial" } })
          .from(split.chars, {
            yPercent: 115,
            rotateZ: 6,
            stagger: 0.018,
            duration: 1.15,
          })
          .from(silver, { y: 24, autoAlpha: 0, duration: 0.9 }, "-=0.55")
          .fromTo(
            photo,
            { autoAlpha: 0.65 },
            { autoAlpha: 1, duration: 1.2 },
            0.15,
          );

        gsap.set(imgA, { transformOrigin: "50% 45%" });
        gsap.set(imgB, { autoAlpha: 0 });
        gsap.set(copyMid, { autoAlpha: 0 });
        gsap.set(midLines, { autoAlpha: 0, y: 28 });
        gsap.set(copyB, { autoAlpha: 0 });
        gsap.set(stack, {
          x: 0,
          y: 0,
          autoAlpha: 1,
          alignItems: "flex-start",
        });

        const slide = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        const shiftRight = () =>
          Math.max(0, front.clientWidth - stack.offsetWidth);

        // 1 — formulaire + titre initial disparaissent
        slide.to(stack, { autoAlpha: 0, y: -20, ease: "none", duration: 0.28 }, 0);

        // 2 — l’infirmière en vert s’efface
        slide.to(imgA, { autoAlpha: 0, ease: "none", duration: 0.32 }, 0.18);

        // 3 — le cadre photo se place à gauche
        slide.to(
          photo,
          {
            x: () => -(window.innerWidth - photo.offsetWidth),
            ease: "none",
            duration: 0.95,
          },
          0.18,
        );

        // 4 — texte seul au centre
        slide.to(copyMid, { autoAlpha: 1, ease: "none", duration: 0.1 }, 0.52);
        midLines.forEach((line, i) => {
          slide.to(
            line,
            { autoAlpha: 1, y: 0, ease: "none", duration: 0.22 },
            0.54 + i * 0.14,
          );
        });

        // 5 — le message s’efface
        slide.to(
          copyMid,
          { autoAlpha: 0, y: -16, ease: "none", duration: 0.28 },
          1.28,
        );

        // 6 — formulaire au-dessus du texte final, à droite
        slide.set(copy, { autoAlpha: 0 }, 1.5);
        slide.set(copyB, { autoAlpha: 1 }, 1.5);
        slide.set(
          stack,
          { alignItems: "flex-end", x: shiftRight, y: 24 },
          1.5,
        );
        slide.to(imgB, { autoAlpha: 1, ease: "none", duration: 0.35 }, 1.52);
        slide.to(stack, { autoAlpha: 1, y: 0, ease: "none", duration: 0.38 }, 1.72);

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="hero" ref={root} className="relative bg-hero">
      <div className="hero-intro relative min-h-svh overflow-hidden bg-hero lg:hidden">
        <div className="hero-intro-photo pointer-events-none absolute inset-0">
          <Image
            src="/hero/medecin-2.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[52%_12%]"
            aria-hidden="true"
          />
        </div>

        <h1 className="absolute bottom-10 left-8 z-10 w-[calc(100%-4rem)] text-left font-display text-[min(3.5rem,calc((100vw-4rem)/9.5))] leading-[0.94] font-medium tracking-[-0.035em] md:bottom-12 md:left-12">
          <span className="hero-intro-line block overflow-hidden">
            <span className="block whitespace-nowrap text-ink">Votre premier</span>
          </span>
          <span className="hero-intro-line block overflow-hidden">
            <span className="block whitespace-nowrap text-ink">
              don de <span className="hero-sang">sang</span>
            </span>
          </span>
          <span className="hero-intro-line mt-[0.08em] block overflow-hidden">
            <span className="hero-silver block whitespace-nowrap">
              en toute confiance !
            </span>
          </span>
        </h1>
      </div>

      <div className="max-lg:min-h-0 min-h-[100svh] lg:h-[340vh]">
        <div className="hero-stage relative isolate min-h-[100svh] overflow-hidden max-lg:min-h-0 max-lg:overflow-visible lg:sticky lg:top-0 lg:h-svh">
          <div className="hero-photo hero-photo-mask pointer-events-none absolute top-0 right-0 z-0 h-full w-[min(62vw,820px)] max-lg:relative max-lg:right-auto max-lg:h-[52svh] max-lg:w-full max-lg:overflow-hidden">
            <div className="hero-img-a absolute inset-0">
              <Image
                src="/hero/medecin-a.png"
                alt="Médecin"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-[48%_12%] max-lg:hidden"
              />
              <Image
                src="/hero/medecin-mobile.png"
                alt="Infirmière regardant le formulaire"
                fill
                priority
                sizes="100vw"
                className="object-cover object-[50%_42%] lg:hidden"
              />
            </div>
            <div className="hero-img-b absolute inset-0 opacity-0 max-lg:hidden">
              <Image
                src="/hero/medecin-2.png"
                alt="Médecin"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-[50%_12%]"
              />
            </div>
          </div>

          <div className="hero-front pointer-events-none relative z-20 mx-auto flex min-h-[100svh] max-w-[1440px] items-end px-5 pb-10 max-lg:min-h-0 max-lg:-mt-14 max-lg:items-stretch max-lg:pb-16 md:px-8 lg:absolute lg:inset-0 lg:px-12 lg:pb-16">
            <div className="hero-stack flex w-max max-w-full flex-col items-start gap-12 max-lg:w-full max-lg:gap-0 lg:gap-14">
              <div className="pointer-events-auto max-lg:w-full">
                <EligibilityForm />
              </div>

              <div className="relative max-lg:hidden">
                <h1 className="hero-copy max-w-full font-display text-[clamp(3.4rem,8.5vw,7.05rem)] leading-[0.94] font-medium tracking-[-0.03em]">
                  <span className="hero-title-ink block text-ink">
                    Votre premier
                    <br />
                    don de <span className="hero-sang">sang</span>
                  </span>
                  <span className="hero-silver hero-silver-a mt-[0.08em] block whitespace-nowrap">
                    en toute confiance !
                  </span>
                </h1>
                <p className="hero-copy-b pointer-events-none absolute top-0 right-0 text-right font-display text-[clamp(2.7rem,5.8vw,4.85rem)] leading-[0.94] font-medium tracking-[-0.03em] text-ink opacity-0 max-lg:hidden">
                  <span className="block whitespace-nowrap">Ce geste simple</span>
                  <span className="hero-silver mt-[0.08em] block whitespace-nowrap">
                    peut déjà sauver des vies.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="hero-copy-mid pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-[1440px] items-center justify-center px-5 opacity-0 max-lg:hidden md:px-8 lg:px-12">
            <p className="text-center font-display text-[clamp(2.8rem,6.4vw,5.4rem)] leading-[0.96] font-medium tracking-[-0.03em] text-ink">
              <span className="hero-mid-line block whitespace-nowrap">
                Une action aussi simple
              </span>
              <span className="hero-mid-line mt-[0.06em] block whitespace-nowrap">
                que bénéfique
              </span>
              <span className="hero-mid-line hero-silver mt-[0.08em] block whitespace-nowrap">
                à tout le monde.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
