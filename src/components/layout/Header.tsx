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
  const items = useRef<HTMLElement[]>([]);
  const closing = useRef(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      const panelEl = panel.current;
      if (!panelEl) return;

      const mm = gsap.matchMedia();
      mm.add("(max-width: 1023px)", () => {
        items.current = gsap.utils.toArray<HTMLElement>(".menu-item");
        gsap.set(panelEl, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(items.current, { y: 18, autoAlpha: 0 });

        return () => {
          gsap.killTweensOf([panelEl, items.current]);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const setMenu = contextSafe((next: boolean) => {
    const panelEl = panel.current;
    const links = items.current;
    if (!panelEl) return;

    closing.current = !next;
    setOpen(next);

    if (prefersReducedMotion()) {
      gsap.set(panelEl, {
        autoAlpha: next ? 1 : 0,
        pointerEvents: next ? "auto" : "none",
      });
      gsap.set(links, { y: 0, autoAlpha: next ? 1 : 0 });
      closing.current = false;
      return;
    }

    gsap.killTweensOf([panelEl, links]);

    if (next) {
      gsap.set(panelEl, { pointerEvents: "auto" });
      gsap.to(panelEl, {
        autoAlpha: 1,
        duration: 0.42,
        ease: "power2.out",
        force3D: true,
      });
      gsap.fromTo(
        links,
        { y: 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.48,
          stagger: 0.038,
          ease: "power3.out",
          overwrite: true,
          force3D: true,
        },
      );
      return;
    }

    gsap.to(links, {
      y: 10,
      autoAlpha: 0,
      duration: 0.26,
      stagger: 0.018,
      ease: "power2.in",
      overwrite: true,
    });
    gsap.to(panelEl, {
      autoAlpha: 0,
      duration: 0.36,
      delay: 0.06,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(panelEl, { pointerEvents: "none" });
        closing.current = false;
        if (window.scrollY > 16) setHidden(true);
      },
    });
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
      if (open || closing.current) {
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
        "pointer-events-none fixed inset-x-0 top-0 z-50 transition-[opacity,transform] duration-300 ease-out lg:hidden",
        hidden && !open && "-translate-y-4 opacity-0",
      )}
    >
      <div
        ref={panel}
        id="menu-mobile"
        className="pointer-events-none invisible fixed inset-0 z-10 bg-hero lg:hidden"
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
          "relative z-20 mx-auto flex max-w-[1440px] items-center gap-6 px-5 pb-4 pt-[max(3.75rem,calc(env(safe-area-inset-top)+2.9rem))] md:px-8 lg:px-12 lg:pt-14",
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
          <span className="relative size-6">
            <Icon
              name="menu"
              className={cn(
                "absolute inset-0 size-6 text-ink transition-opacity duration-300 ease-out",
                open ? "opacity-0" : "opacity-100",
              )}
            />
            <Icon
              name="close"
              className={cn(
                "absolute inset-0 size-6 text-ink transition-opacity duration-300 ease-out",
                open ? "opacity-100" : "opacity-0",
              )}
            />
          </span>
        </button>
      </div>
    </header>
  );
}
