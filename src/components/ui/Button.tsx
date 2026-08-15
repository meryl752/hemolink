"use client";

import { ComponentProps, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap-client";
import { cn, prefersReducedMotion } from "@/lib/utils";

registerGsap();

type Variant = "primary" | "ghost" | "night" | "gold";

const styles: Record<Variant, string> = {
  primary:
    "bg-navy text-foam hover:bg-navy/85 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.55)]",
  ghost:
    "bg-transparent text-ink border border-ink/15 hover:border-ink/40 hover:bg-ink/[0.03]",
  night:
    "bg-foam text-night hover:bg-blush",
  gold:
    "bg-gold text-night hover:bg-[#d4b57c]",
};

type Props = ComponentProps<"a"> & {
  variant?: Variant;
  asButton?: boolean;
};

export function Button({
  variant = "primary",
  className,
  children,
  asButton,
  ...props
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) {
        return;
      }

      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

      const onMove = (event: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = event.clientX - (rect.left + rect.width / 2);
        const relY = event.clientY - (rect.top + rect.height / 2);
        xTo(relX * 0.22);
        yTo(relY * 0.28);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: ref },
  );

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300 will-change-transform",
    styles[variant],
    className,
  );

  if (asButton) {
    return (
      <a ref={ref} className={classes} role="button" {...props}>
        {children}
      </a>
    );
  }

  return (
    <a ref={ref} className={classes} {...props}>
      {children}
    </a>
  );
}
