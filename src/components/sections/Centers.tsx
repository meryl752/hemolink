"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  CENTERS,
  KIND_LABEL,
  TYPE_LABEL,
  WEEKDAY_LABEL,
  APPOINTMENT_LABEL,
  type Center,
  type Weekday,
} from "@/data/centers";
import { Icon } from "@/components/ui/Icon";
import {
  emptySubscribe,
  filterCenters,
  getClientFlag,
  getServerFlag,
  isCenterOpen,
  mapsUrl,
  prefersReducedMotion,
  todayHoursLabel,
} from "@/lib/utils";

export function Centers() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{
    center: Center;
    km: number | null;
  } | null>(null);
  const deferredQuery = useDeferredValue(query);
  const searching = query !== deferredQuery;
  const looking = deferredQuery.trim().length > 0;

  const results = useMemo(
    () =>
      filterCenters(CENTERS, {
        query: deferredQuery,
        city: "all",
        type: "all",
        openOnly: false,
      }).map((center) => ({ center, km: null as number | null })),
    [deferredQuery],
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  const reset = () => {
    setQuery("");
  };

  return (
    <section id="centres" className="relative overflow-x-clip bg-hero text-ink">
      <div className="mx-auto max-w-[1440px] px-5 pt-12 pb-24 md:px-8 md:pt-16 md:pb-32 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10">
            <h2 className="max-w-[16ch] shrink-0 font-display text-[clamp(2rem,4.4vw,4.2rem)] leading-[0.96] font-medium tracking-[-0.03em]">
              <span className="block">Le centre le plus</span>
              <span className="block">proche de vous.</span>
            </h2>

            <form
              className="w-full max-w-xl lg:max-w-none lg:w-[min(100%,40rem)]"
              onSubmit={(e) => e.preventDefault()}
              role="search"
            >
              <label className="relative block">
                <span className="sr-only">Recherche</span>
                <Icon
                  name="search"
                  className="pointer-events-none absolute top-1/2 left-5 z-20 size-5 -translate-y-1/2 text-ink/40"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ville, nom, adresse…"
                  className="relative z-10 w-full rounded-full bg-white py-4 pr-6 pl-14 text-[16px] text-ink outline-none placeholder:text-ink/45 md:py-[1.15rem] md:text-[17px]"
                />
              </label>
            </form>
          </div>

        {looking ? (
          <p className="mt-8 text-[13px] text-ink/40" aria-live="polite">
            {searching
              ? "Recherche…"
              : `${results.length} centre${results.length > 1 ? "s" : ""}`}
          </p>
        ) : null}

        {!looking ? null : searching ? (
          <div className="mt-8 flex gap-4 overflow-hidden" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-64 w-[min(70vw,16rem)] shrink-0 animate-pulse rounded-[2rem] border border-ink/10 bg-white/40"
              />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="mt-10">
            <p className="font-display text-[1.85rem] leading-tight tracking-[-0.03em]">
              Aucun centre ne correspond.
            </p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Essayez une autre ville, un nom de centre, ou une adresse.
            </p>
            <button
              type="button"
              className="mt-6 text-[15px] text-ink underline decoration-ink/25 underline-offset-4"
              onClick={reset}
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <>
            <CenterCarousel
              results={results}
              onOpen={(item) => setSelected(item)}
            />
          </>
        )}

        {selected ? (
          <CenterModal
            center={selected.center}
            km={selected.km}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </div>
    </section>
  );
}

function formatKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

function CenterCarousel({
  results,
  onOpen,
}: {
  results: Array<{ center: Center; km: number | null }>;
  onOpen: (item: { center: Center; km: number | null }) => void;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(results.length > 1);

  const syncButtons = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 12);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 12);
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
  }, [results, syncButtons]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const gap = 16;
    const amount = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.7;
    el.scrollBy({
      left: direction * amount,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <div className="mt-8">
      <ul
        ref={scroller}
        className="center-scroller flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1"
      >
        {results.map((item) => (
          <li key={item.center.id} className="w-[min(70vw,16rem)] shrink-0 snap-start">
            <CenterCard
              center={item.center}
              km={item.km}
              onOpen={() => onOpen(item)}
            />
          </li>
        ))}
      </ul>
      {results.length > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink disabled:opacity-30"
            aria-label="Centre précédent"
          >
            <Icon name="arrowLeft" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink disabled:opacity-30"
            aria-label="Centre suivant"
          >
            <Icon name="arrowRight" className="size-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function CenterCard({
  center,
  km,
  onOpen,
}: {
  center: Center;
  km: number | null;
  onOpen: () => void;
}) {
  const image = center.image;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-ink/10 text-left outline-none"
      aria-haspopup="dialog"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="16rem"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-hero/35" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hero/90 via-hero/55 to-transparent px-3 pb-3 pt-10">
        <h3 className="font-display text-[1.15rem] leading-[1.08] font-medium tracking-[-0.03em] text-ink md:text-[1.25rem]">
          {center.name}
        </h3>
        <p className="mt-1.5 text-[13px] text-ink-soft">
          {center.city}
          {km !== null ? ` · ${formatKm(km)}` : ""}
        </p>
      </div>
    </button>
  );
}

function CenterModal({
  center,
  km,
  onClose,
}: {
  center: Center;
  km: number | null;
  onClose: () => void;
}) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientFlag,
    getServerFlag,
  );
  const open = isClient ? isCenterOpen(center) : null;
  const hours = isClient ? todayHoursLabel(center) : "Horaires du jour";
  const image = center.image;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-5 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-ink/55 backdrop-blur-2xl backdrop-saturate-50"
        aria-label="Fermer"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`center-dialog-${center.id}`}
        className="relative z-10 max-h-[90vh] w-full max-w-[34rem] overflow-y-auto bg-hero text-ink"
      >
        <div className="relative h-52 w-full overflow-hidden md:h-64">
          <Image
            src={image}
            alt={center.name}
            fill
            sizes="34rem"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-hero/25" />
        </div>
        <div className="px-6 py-6 md:px-8 md:py-8">
          <p className="text-[11px] tracking-[0.18em] text-ink/40 uppercase">
            {KIND_LABEL[center.kind]}
            {km !== null ? ` · ${formatKm(km)}` : ""}
          </p>
          <h3
            id={`center-dialog-${center.id}`}
            className="mt-2 font-display text-[1.85rem] leading-[1.08] font-medium tracking-[-0.03em]"
          >
            {center.name}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            {center.address}
            <br />
            {center.postalCode} {center.city}
          </p>

          <div className="mt-6 flex flex-col gap-2 text-[15px]">
            <p>
              <span className={open === null ? "text-ink/40" : open ? "text-ink" : "text-ink/40"}>
                {open === null ? "…" : open ? "Ouvert" : "Fermé"}
              </span>
              <span className="text-ink/30"> · </span>
              <span className="text-ink-soft">Aujourd’hui {hours}</span>
            </p>
            <p className="text-ink-soft">{APPOINTMENT_LABEL[center.appointment]}</p>
            <p className="text-ink-soft">
              {center.types.map((t) => TYPE_LABEL[t]).join(" · ")}
            </p>
            <a
              href={`tel:${center.phone.replace(/\s/g, "")}`}
              className="text-ink-soft hover:text-ink"
            >
              {center.phone}
            </a>
            {center.note && <p className="text-[13px] text-ink/45">{center.note}</p>}
          </div>

          <ul className="mt-6 space-y-1 text-[13px] text-ink-soft">
            {(Object.keys(WEEKDAY_LABEL) as unknown as Weekday[])
              .sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
              .map((day) => {
                const h = center.hours[day];
                return (
                  <li key={day} className="flex justify-between gap-4">
                    <span>{WEEKDAY_LABEL[day]}</span>
                    <span>{h ? `${h.open} – ${h.close}` : "Fermé"}</span>
                  </li>
                );
              })}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={mapsUrl(center)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[3.2rem] items-center bg-ink px-5 font-display text-[1.15rem] leading-none font-medium tracking-[-0.03em] text-hero"
            >
              Itinéraire
            </a>
            {center.email ? (
              <a
                href={`mailto:${center.email}`}
                className="text-[15px] underline decoration-ink/20 underline-offset-4 hover:decoration-ink/60"
              >
                Écrire
              </a>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto inline-flex items-center gap-2 text-[15px] text-ink/50"
            >
              <Icon name="close" className="size-5" />
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
