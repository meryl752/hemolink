"use client";

import { KeyboardEvent, useId, useState } from "react";
import { FAQ } from "@/data/faq";
import { Icon } from "@/components/ui/Icon";

const VEIN =
  "M268 42 C 210 28, 128 48, 72 78 C 28 118, 36 210, 24 318 C 14 428, 38 522, 86 568 C 168 612, 310 598, 400 604 C 512 612, 648 596, 718 552 C 776 508, 762 400, 774 292 C 784 188, 758 108, 712 72 C 652 38, 572 32, 532 44";

export function Faq() {
  const [open, setOpen] = useState<string | null>(null);
  const baseId = useId();

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const buttons = Array.from(
      event.currentTarget
        .closest("[data-faq]")
        ?.querySelectorAll<HTMLButtonElement>("[data-faq-trigger]") ?? [],
    );
    if (event.key === "ArrowDown") {
      event.preventDefault();
      buttons[(index + 1) % buttons.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      buttons[(index - 1 + buttons.length) % buttons.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      buttons[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      buttons[buttons.length - 1]?.focus();
    }
  };

  return (
    <section id="faq" className="bg-hero text-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="relative mx-auto max-w-[52rem] px-4 py-10 md:px-10 md:py-14">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full text-ink"
            viewBox="0 0 800 640"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="faq-vein"
              d={VEIN}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="faq-vein-trail"
              d={VEIN}
              fill="none"
              strokeWidth="1.9"
              strokeLinecap="round"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <h2 className="relative z-10 mx-auto w-fit bg-hero px-4 text-center font-display text-[clamp(1.45rem,2.4vw,2.15rem)] leading-[1.08] font-medium tracking-[-0.03em]">
            <span className="block">Des réponses à vos</span>
            <span className="block">diverses préoccupations</span>
          </h2>

          <div className="relative z-10 mx-auto mt-8 max-w-xl" data-faq>
            {FAQ.map((item, index) => {
              const expanded = open === item.id;
              const panelId = `${baseId}-${item.id}`;
              return (
                <div key={item.id} className="border-t border-ink/10 first:border-t-0">
                  <h3>
                    <button
                      type="button"
                      data-faq-trigger
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      id={`${panelId}-btn`}
                      onClick={() => setOpen(expanded ? null : item.id)}
                      onKeyDown={(e) => onKey(e, index)}
                      className="flex w-full items-center justify-between gap-4 py-3.5 text-left md:py-4"
                    >
                      <span className="font-display text-[1.05rem] leading-snug font-medium tracking-[-0.02em] md:text-[1.15rem]">
                        {item.question}
                      </span>
                      <Icon
                        name={expanded ? "close" : "plus"}
                        className="size-[1.15rem] text-ink/35"
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={`${panelId}-btn`}
                    hidden={!expanded}
                    className="pb-4 pr-8"
                  >
                    <p className="text-[14px] leading-relaxed text-ink-soft">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
