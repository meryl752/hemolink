"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
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
  cn,
  emptySubscribe,
  filterCenters,
  getClientFlag,
  getServerFlag,
  isCenterOpen,
  mapsUrl,
  prefersReducedMotion,
  todayHoursLabel,
} from "@/lib/utils";

function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function Centers() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{
    center: Center;
    km: number | null;
  } | null>(null);
  const committed = useDebouncedValue(query, 420);
  const looking = committed.trim().length > 0;
  const [panelOpen, setPanelOpen] = useState(false);
  const [compactSearch, setCompactSearch] = useState(true);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const directoryTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setCompactSearch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const results = useMemo(() => {
    if (!committed.trim()) return [];
    return filterCenters(CENTERS, {
      query: committed,
      city: "all",
      type: "all",
      openOnly: false,
    }).map((center) => ({ center, km: null as number | null }));
  }, [committed]);

  const [shown, setShown] = useState(results);
  const display = looking ? results : shown;

  useEffect(() => {
    if (looking) {
      setPanelOpen(true);
      setShown(results);
      return;
    }
    setPanelOpen(false);
    const id = window.setTimeout(() => setShown([]), 560);
    return () => window.clearTimeout(id);
  }, [looking, results]);

  useEffect(() => {
    if (!selected && !directoryOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (selected) setSelected(null);
      else {
        setDirectoryOpen(false);
        window.setTimeout(() => directoryTrigger.current?.focus(), 0);
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [selected, directoryOpen]);

  return (
    <section id="centres" className="relative overflow-x-clip bg-hero text-ink">
      <div className="mx-auto max-w-[1440px] px-5 pt-12 pb-24 md:px-8 md:pt-16 md:pb-32 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10">
            <h2 className="max-w-[18ch] shrink-0 font-display text-[clamp(2rem,4.4vw,4.2rem)] leading-[0.96] font-medium tracking-[-0.03em]">
              <span className="block">Recherchez le centre</span>
              <span className="block">le plus proche de vous.</span>
            </h2>

            <div className="w-full max-w-xl lg:max-w-none lg:w-[min(100%,40rem)]">
              <form onSubmit={(e) => e.preventDefault()} role="search">
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
                    placeholder={
                      compactSearch
                        ? "Taper pour trouver un centre…"
                        : "Taper pour trouver un centre près de chez vous…"
                    }
                    className="relative z-10 w-full rounded-full bg-white py-4 pr-6 pl-14 text-[16px] text-ink outline-none placeholder:text-ink/75 md:py-[1.15rem] md:text-[17px]"
                  />
                </label>
              </form>
              <button
                ref={directoryTrigger}
                type="button"
                onClick={() => setDirectoryOpen(true)}
                className="mt-4 inline-flex min-h-[3.1rem] w-full items-center justify-center gap-2 rounded-full bg-ink px-6 font-display text-[1.1rem] leading-none font-medium tracking-[-0.03em] text-hero transition-colors hover:bg-ink/85 lg:w-auto"
                aria-haspopup="dialog"
                aria-expanded={directoryOpen}
              >
                Aller à tous les centres
                <Icon name="arrowRight" className="size-4" />
              </button>
            </div>
          </div>

        <div className={`centers-results ${panelOpen ? "is-open" : ""}`}>
          <div>
            <div className="mt-8 rounded-[1.75rem] bg-white px-5 py-6 md:mt-10 md:rounded-[2rem] md:px-8 md:py-8">
              <div
                key={looking ? committed : "idle"}
                className="centers-results-body"
              >
                <p className="text-[13px] text-ink/40" aria-live="polite">
                  {`${display.length} centre${display.length > 1 ? "s" : ""}`}
                </p>

                {display.length === 0 ? (
                  <div className="mt-6 flex justify-center px-4 py-4 text-center">
                    <p className="max-w-[22ch] font-display text-[1.2rem] leading-[1.2] font-medium tracking-[-0.03em] md:text-[1.35rem]">
                      Votre zone n’est pas encore prise en compte&nbsp;!
                    </p>
                  </div>
                ) : (
                  <CenterCarousel
                    results={display}
                    onOpen={(item) => setSelected(item)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {directoryOpen ? (
          <AllCentersModal
            onClose={() => {
              setDirectoryOpen(false);
              window.setTimeout(() => directoryTrigger.current?.focus(), 0);
            }}
          />
        ) : null}

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
    <div className="mt-5">
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
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-xl border border-ink/10 text-left outline-none"
      aria-haspopup="dialog"
    >
      <Image
        src={center.image}
        alt=""
        fill
        quality={90}
        sizes="(max-width: 1023px) 70vw, 16rem"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent px-3 pt-16 pb-3">
        <h3 className="font-display text-[1.15rem] leading-[1.08] font-medium tracking-[-0.03em] text-hero md:text-[1.25rem]">
          {center.name}
        </h3>
        <p className="mt-1.5 text-[13px] text-hero/75">
          {center.city}
          {km !== null ? ` · ${formatKm(km)}` : ""}
        </p>
      </div>
    </button>
  );
}

function weekdaysInOrder(): Weekday[] {
  return (Object.keys(WEEKDAY_LABEL) as unknown as Weekday[]).sort(
    (a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b),
  );
}

function CenterDetailCard({
  center,
  km,
  titleId,
  onClose,
  wide = false,
}: {
  center: Center;
  km: number | null;
  titleId: string;
  onClose?: () => void;
  wide?: boolean;
}) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientFlag,
    getServerFlag,
  );
  const open = isClient ? isCenterOpen(center) : null;
  const hours = isClient ? todayHoursLabel(center) : "Horaires du jour";

  return (
    <article
      className={cn(
        "center-detail-card bg-hero text-ink",
        wide
          ? "flex h-full flex-col overflow-hidden rounded-[2rem] md:flex-row md:rounded-[2.5rem]"
          : "flex max-h-[90vh] flex-col overflow-y-auto rounded-[3rem]",
      )}
      data-lenis-prevent
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          wide
            ? "h-40 w-full md:h-auto md:w-[46%] md:min-w-[46%]"
            : "h-52 w-full md:h-64",
        )}
      >
        <Image
          src={center.image}
          alt={center.name}
          fill
          quality={90}
          sizes={wide ? "(max-width: 1023px) 92vw, 28rem" : "(max-width: 1023px) 88vw, 34rem"}
          className="object-cover"
        />
      </div>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          wide ? "px-5 py-5 md:px-8 md:py-7" : "px-6 py-6 md:px-8 md:py-8",
        )}
      >
        <p className="text-[11px] tracking-[0.18em] text-ink/40 uppercase">
          {KIND_LABEL[center.kind]}
          {km !== null ? ` · ${formatKm(km)}` : ""}
        </p>
        <h3
          id={titleId}
          className={cn(
            "mt-2 font-display leading-[1.08] font-medium tracking-[-0.03em]",
            wide ? "text-[1.55rem] md:text-[1.85rem]" : "text-[1.85rem]",
          )}
        >
          {center.name}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          {center.address}
          <br />
          {center.postalCode} {center.city}
        </p>

        <div className={cn("flex flex-col gap-2 text-[15px]", wide ? "mt-5 md:mt-6" : "mt-6")}>
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
          {center.note ? <p className="text-[13px] text-ink/45">{center.note}</p> : null}
        </div>

        <ul
          className={cn(
            "text-[13px] text-ink-soft",
            wide ? "mt-5 grid grid-cols-2 gap-x-5 gap-y-1 md:mt-6" : "mt-6 space-y-1",
          )}
        >
          {weekdaysInOrder().map((day) => {
            const h = center.hours[day];
            return (
              <li key={day} className="flex justify-between gap-3">
                <span>{WEEKDAY_LABEL[day]}</span>
                <span>{h ? `${h.open} – ${h.close}` : "Fermé"}</span>
              </li>
            );
          })}
        </ul>

        <div
          className={cn(
            "flex flex-wrap items-center gap-3",
            wide ? "mt-auto pt-6" : "mt-8",
          )}
        >
          <a
            href={mapsUrl(center)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[3.1rem] items-center rounded-full bg-ink px-6 font-display text-[1.1rem] leading-none font-medium tracking-[-0.03em] text-hero transition-colors hover:bg-ink/85"
          >
            Itinéraire
          </a>
          {center.email ? (
            <a
              href={`mailto:${center.email}`}
              className="inline-flex min-h-[3.1rem] items-center rounded-full border border-ink/15 px-6 font-display text-[1.1rem] leading-none font-medium tracking-[-0.03em] text-ink transition-colors hover:border-ink/40 hover:bg-ink/[0.04]"
            >
              Écrire
            </a>
          ) : null}
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="ml-auto inline-flex min-h-[3.1rem] items-center gap-2 rounded-full px-5 font-display text-[1.05rem] leading-none font-medium tracking-[-0.03em] text-ink/55 transition-colors hover:bg-ink/[0.05] hover:text-ink"
            >
              <Icon name="close" className="size-4" />
              Fermer
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function AllCentersModal({ onClose }: { onClose: () => void }) {
  const scroller = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

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

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("scroll", syncButtons);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", syncButtons);
    };
  }, [syncButtons]);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const gap = window.matchMedia("(min-width: 768px)").matches ? 24 : 16;
    const amount = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.85;
    el.scrollBy({
      left: direction * amount,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollByCard(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollByCard(1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [scrollByCard]);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-stretch justify-center p-2 md:p-4 lg:p-6">
      <button
        type="button"
        className="center-modal-backdrop absolute inset-0 bg-ink/45 backdrop-blur-sm"
        aria-label="Fermer"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-centers-title"
        className="center-modal-card relative z-10 flex h-full w-full max-w-[1600px] flex-col overflow-hidden rounded-[1.75rem] bg-white text-ink md:rounded-[2.5rem]"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 px-5 pt-4 pb-3 md:px-8 md:pt-6 md:pb-4">
          <div>
            <h2
              id="all-centers-title"
              className="font-display text-[clamp(1.7rem,3.4vw,3.1rem)] leading-[0.96] font-medium tracking-[-0.03em]"
            >
              Tous les centres
            </h2>
            <p className="mt-2 text-[13px] text-ink/40">
              {CENTERS.length} centre{CENTERS.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink/40 hover:bg-ink/[0.04]"
            aria-label="Fermer"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          <ul
            ref={scroller}
            className="center-scroller centers-directory-scroller absolute inset-x-0 top-0 bottom-[4.75rem] flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-5 md:bottom-[5.25rem] md:gap-6 md:px-8"
            data-lenis-prevent
          >
            {CENTERS.map((center) => (
              <li
                key={center.id}
                className="h-full w-[min(92vw,56rem)] shrink-0 snap-start"
              >
                <CenterDetailCard
                  center={center}
                  km={null}
                  wide
                  titleId={`directory-center-${center.id}`}
                />
              </li>
            ))}
          </ul>

          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3 md:bottom-4">
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
        </div>
      </div>
    </div>,
    document.body,
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
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-5 py-8">
      <button
        type="button"
        className="center-modal-backdrop absolute inset-0 bg-ink/55 backdrop-blur-2xl backdrop-saturate-50"
        aria-label="Fermer"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`center-dialog-${center.id}`}
        className="center-modal-card relative z-10 w-full max-w-[34rem]"
      >
        <CenterDetailCard
          center={center}
          km={km}
          titleId={`center-dialog-${center.id}`}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}
