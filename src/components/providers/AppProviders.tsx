"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";

registerGsap();

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    let lenis: Lenis | null = null;
    let onTick: ((time: number) => void) | null = null;

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        autoRaf: false,
        duration: 1.15,
        touchMultiplier: 1.4,
      });
      lenis.on("scroll", ScrollTrigger.update);
      onTick = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
    };

    const stop = () => {
      if (onTick) gsap.ticker.remove(onTick);
      onTick = null;
      lenis?.destroy();
      lenis = null;
    };

    const sync = () => {
      if (mq.matches) start();
      else stop();
      ScrollTrigger.refresh();
    };

    const onResize = () => ScrollTrigger.refresh();

    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", onResize);

    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", onResize);
      stop();
    };
  }, []);

  return children;
}
