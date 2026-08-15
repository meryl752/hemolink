"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";

registerGsap();

export function VeinProgress() {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const path = ref.current?.querySelector("path");
      if (!path || prefersReducedMotion()) return;

      gsap.set(path, { drawSVG: "0%" });
      gsap.to(path, {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div
      className="pointer-events-none fixed left-3 top-0 z-40 hidden h-screen w-8 md:left-5 lg:block"
      aria-hidden="true"
    >
      <svg
        ref={ref}
        viewBox="0 0 24 1000"
        className="h-full w-6"
        preserveAspectRatio="none"
      >
        <path
          d="M12 0 C18 80, 6 160, 12 240 C18 320, 6 400, 12 480 C18 560, 6 640, 12 720 C18 800, 6 880, 12 1000"
          className="veil-path"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}
