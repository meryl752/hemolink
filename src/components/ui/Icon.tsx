import { cn } from "@/lib/utils";

const ICONS = {
  menu: "/icons/menu-02-stroke-rounded.svg",
  close: "/icons/x-stroke-rounded.svg",
  plus: "/icons/plus-stroke-rounded.svg",
  search: "/icons/search-02-stroke-rounded.svg",
  check: "/icons/checkmark-square-03-stroke-rounded.svg",
  arrowLeft: "/icons/arrow-left-02-stroke-rounded.svg",
  arrowRight: "/icons/arrow-right-02-stroke-rounded.svg",
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-5 shrink-0 bg-current", className)}
      style={{
        mask: `url(${ICONS[name]}) center / contain no-repeat`,
        WebkitMask: `url(${ICONS[name]}) center / contain no-repeat`,
      }}
    />
  );
}
