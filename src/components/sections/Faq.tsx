"use client";

import { KeyboardEvent, useId, useState } from "react";
import { FAQ } from "@/data/faq";
import { Icon } from "@/components/ui/Icon";

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
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-24 lg:px-12">
        <div className="relative mx-auto mt-6 max-w-[42rem]">
          <div className="faq-ring pointer-events-none absolute inset-0" aria-hidden="true" />
          <svg
            className="pointer-events-none absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] overflow-visible"
            aria-hidden="true"
          >
            <rect
              className="faq-vein-trail"
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="34"
              ry="30"
              fill="none"
              strokeWidth="1.5"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <h2 className="relative z-10 mx-auto w-fit -translate-y-1/2 bg-hero px-8 py-1.5 text-center font-display text-[clamp(1.45rem,2.4vw,2.15rem)] leading-[1.08] font-medium tracking-[-0.03em] md:px-12 md:py-2">
            <span className="block">Des réponses à vos</span>
            <span className="block">diverses préoccupations</span>
          </h2>

          <div
            className="relative z-10 -mt-3 flex flex-col gap-3 px-5 pb-8 md:px-9 md:pb-10"
            data-faq
          >
            {FAQ.map((item, index) => {
              const expanded = open === item.id;
              const panelId = `${baseId}-${item.id}`;
              return (
                <article
                  key={item.id}
                  className="rounded-[1.35rem] bg-white px-6 md:rounded-[1.5rem] md:px-7"
                >
                  <h3>
                    <button
                      type="button"
                      data-faq-trigger
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      id={`${panelId}-btn`}
                      onClick={() => setOpen(expanded ? null : item.id)}
                      onKeyDown={(e) => onKey(e, index)}
                      className="flex min-h-[3.75rem] w-full items-center justify-between gap-4 py-4 text-left md:min-h-[4.25rem] md:py-5"
                    >
                      <span className="font-display text-[1.08rem] leading-snug font-medium tracking-[-0.02em] md:text-[1.2rem]">
                        {item.question}
                      </span>
                      <Icon
                        name={expanded ? "close" : "plus"}
                        className="size-[1.15rem] shrink-0 text-ink/35"
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={`${panelId}-btn`}
                    hidden={!expanded}
                    className="pb-5 pr-9 md:pb-6"
                  >
                    <p className="text-[14px] leading-relaxed text-ink-soft md:text-[15px]">
                      {item.answer}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
