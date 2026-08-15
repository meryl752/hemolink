"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#eligibilite", label: "Éligibilité" },
  { href: "#centres", label: "Centres" },
  { href: "#parcours", label: "Parcours" },
  { href: "#comprendre", label: "Comprendre" },
  { href: "#reserves", label: "Réserves" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 transition-[opacity,transform] duration-300 ease-out",
        hidden && "-translate-y-4 opacity-0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1440px] items-center gap-6 px-5 pt-11 pb-5 md:px-8 lg:px-12 lg:pt-14",
          !hidden && "pointer-events-auto",
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
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          <Icon name={open ? "close" : "menu"} className="size-6 text-ink" />
        </button>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="pointer-events-auto bg-hero px-5 py-8 lg:hidden"
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-3.5 font-display text-3xl text-ink"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
