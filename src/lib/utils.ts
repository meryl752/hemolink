import type { Center, DonationType, Weekday } from "@/data/centers";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const emptySubscribe = () => () => {};

export function getClientFlag(): boolean {
  return true;
}

export function getServerFlag(): boolean {
  return false;
}

export { emptySubscribe };

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getParisNow(): Date {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Porto-Novo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "0";

  return new Date(
    Number(get("year")),
    Number(get("month")) - 1,
    Number(get("day")),
    Number(get("hour")),
    Number(get("minute")),
  );
}

export function getParisWeekday(date = getParisNow()): Weekday {
  return date.getDay() as Weekday;
}

function parseMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function isCenterOpen(center: Center, at = getParisNow()): boolean {
  const hours = center.hours[at.getDay() as Weekday];
  if (!hours) return false;
  const now = at.getHours() * 60 + at.getMinutes();
  return now >= parseMinutes(hours.open) && now < parseMinutes(hours.close);
}

export function todayHoursLabel(center: Center, at = getParisNow()): string {
  const hours = center.hours[at.getDay() as Weekday];
  if (!hours) return "Fermé aujourd’hui";
  return `${hours.open} – ${hours.close}`;
}

export function matchesQuery(center: Center, query: string): boolean {
  const hay = [
    center.name,
    center.city,
    center.address,
    center.postalCode,
    center.department,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(query.trim().toLowerCase());
}

export function filterCenters(
  centers: Center[],
  opts: {
    query: string;
    city: string;
    type: DonationType | "all";
    openOnly: boolean;
  },
): Center[] {
  return centers.filter((center) => {
    if (opts.query && !matchesQuery(center, opts.query)) return false;
    if (opts.city !== "all" && center.city !== opts.city) return false;
    if (opts.type !== "all" && !center.types.includes(opts.type)) return false;
    if (opts.openOnly && !isCenterOpen(center)) return false;
    return true;
  });
}

export function mapsUrl(center: Center): string {
  return `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;
}

export function distanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
