"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Logo } from "./Logo";
import { Icon } from "@/components/ui/Icon";
import { gsap, registerGsap } from "@/lib/gsap-client";
import { cn, prefersReducedMotion } from "@/lib/utils";

registerGsap();

const LINKS = [
  { href: "#eligibilite", label: "Éligibilité" },
  { href: "#centres", label: "Centres" },
  { href: "#parcours", label: "Parcours" },
  { href: "#comprendre", label: "Comprendre" },
  { href: "#reserves", label: "Réserves" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      const panelEl = panel.current;
      if (!panelEl) return;

      const mm = gsap.matchMedia();
      mm.add("(max-width: 1023px)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".menu-item");
        const reduce = prefersReducedMotion();

        gsap.set(panelEl, {
          autoAlpha: 0,
          pointerEvents: "none",
          clipPath: "inset(0 0 100% 0)",
        });
        gsap.set(items, { y: 28, autoAlpha: 0 });

        if (reduce) {
          tl.current = gsap
            .timeline({ paused: true })
            .set(panelEl, { autoAlpha: 1, pointerEvents: "auto", clipPath: "none" })
            .set(items, { y: 0, autoAlpha: 1 });
          return () => {
            tl.current?.kill();
            tl.current = null;
          };
        }

        tl.current = gsap
          .timeline({
            paused: true,
            defaults: { ease: "editorial" },
            onReverseComplete: () => {
              gsap.set(panelEl, { pointerEvents: "none" });
            },
          })
          .set(panelEl, { pointerEvents: "auto" })
          .to(
            panelEl,
            { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", duration: 0.72 },
            0,
          )
          .to(
            items,
            { y: 0, autoAlpha: 1, stagger: 0.055, duration: 0.7 },
            0.18,
          );

        return () => {
          tl.current?.kill();
          tl.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const setMenu = contextSafe((next: boolean) => {
    setOpen(next);
    if (next) tl.current?.play();
    else tl.current?.reverse();
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setMenu]);

  useEffect(() => {
    const onScroll = () => {
      if (open) {
        setHidden(false);
        return;
      }
      setHidden(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header
      ref={root}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 transition-[opacity,transform] duration-300 ease-out",
        hidden && !open && "-translate-y-4 opacity-0",
      )}
    >
      <div
        ref={panel}
        id="menu-mobile"
        className="pointer-events-none fixed inset-0 z-10 bg-hero opacity-0 lg:hidden"
        aria-hidden={!open}
      >
        <nav
          className="flex h-full flex-col justify-end px-5 pt-32 pb-16 md:px-8"
          aria-label="Mobile"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="menu-item py-2.5 font-display text-[2.35rem] leading-[1.05] font-medium tracking-[-0.03em] text-ink"
              onClick={() => setMenu(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div
        className={cn(
          "relative z-20 mx-auto flex max-w-[1440px] items-center gap-6 px-5 pt-11 pb-5 md:px-8 lg:px-12 lg:pt-14",
          (!hidden || open) && "pointer-events-auto",
        )}
      >
        <a href="#hero" className="shrink-0" aria-label="HemoLink, retour en haut">
          <Logo compact />
        </a>

        <nav
          className="ml-20 hidden items-center gap-7 lg:flex"
          aria-label="Sections"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[17px] text-silver transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="ml-auto flex h-10 w-10 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setMenu(!open)}
        >
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          <span
            className={cn(
              "flex size-6 items-center justify-center transition-transform duration-500 ease-out",
              open && "rotate-90",
            )}
          >
            <Icon name={open ? "close" : "menu"} className="size-6 text-ink" />
          </span>
        </button>
      </div>
    </header>
  );
}
