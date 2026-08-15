import { cn } from "@/lib/utils";

export function Logo({
  className,
  light = false,
  compact = false,
}: {
  className?: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 40"
        className={compact ? "h-6 w-[18px]" : "h-8 w-6"}
        aria-hidden="true"
        fill="none"
      >
        <path
          d="M16 2C16 2 4 16.2 4 24.5C4 31.4 9.4 37 16 37C22.6 37 28 31.4 28 24.5C28 16.2 16 2 16 2Z"
          className={light ? "fill-foam" : "fill-blood"}
        />
        <path
          d="M12.2 18.5C13.8 14.8 16 12 16 12"
          stroke={light ? "#F4EDE4" : "#fff9f4"}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
      <span
        className={cn(
          "font-display font-medium tracking-tight",
          compact ? "text-[1.15rem]" : "text-[1.35rem]",
          light ? "text-foam" : "text-ink",
        )}
      >
        HemoLink
      </span>
    </span>
  );
}
