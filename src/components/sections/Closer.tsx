import { Logo } from "@/components/layout/Logo";

export function Closer() {
  return (
    <section className="bg-hero text-ink">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-5 pt-24 pb-12 md:px-8 md:pt-32 md:pb-16 lg:px-12">
        <p className="max-w-[18ch] text-center font-display text-[clamp(2.1rem,5vw,4.6rem)] leading-[1.08] font-medium tracking-[-0.03em]">
          Foncez, donnez du{" "}
          <span className="text-blood">sang</span>{" "}
          <svg
            viewBox="0 0 32 40"
            className="inline-block h-[0.78em] w-[0.58em] translate-y-[-0.06em] align-baseline"
            aria-hidden="true"
            fill="none"
          >
            <path
              d="M16 2C16 2 4 16.2 4 24.5C4 31.4 9.4 37 16 37C22.6 37 28 31.4 28 24.5C28 16.2 16 2 16 2Z"
              className="fill-blood"
            />
            <path
              d="M12.2 18.5C13.8 14.8 16 12 16 12"
              stroke="#fff9f4"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>{" "}
          pour sauver des vies.
        </p>
        <Logo compact className="mt-14 md:mt-16" />
        <p className="mt-5 max-w-[34ch] text-center text-[13px] leading-snug text-ink/40">
          Seul un entretien médical professionnel peut confirmer l’aptitude au
          don.
        </p>
      </div>
    </section>
  );
}
