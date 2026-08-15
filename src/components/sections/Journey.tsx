import Image from "next/image";

const PHASES = [
  {
    id: "avant",
    title: "Avant",
    body: "Dormez, un vrai repas, beaucoup d’eau. Une pièce d’identité le jour J — sans elle, pas de don.",
    image: "/hero/lieu.jpg",
    imageAlt: "Hall d’un centre de don",
    className:
      "static md:absolute md:top-[6%] md:left-[2%] md:max-w-[28rem] lg:top-[8%] lg:left-[3%]",
    align: "end",
    imageClass: "aspect-[4/5] w-full md:w-[9.5rem] lg:w-[12rem]",
  },
  {
    id: "prelevement",
    title: "Prélèvement",
    body: "Une dizaine de minutes allongé. L’équipe reste là : dites-le si ça cloche. Vous pouvez arrêter à tout moment.",
    image: "/hero/deroule.jpg",
    imageAlt: "Prélèvement au centre de don",
    className:
      "static md:absolute md:bottom-[7%] md:left-[6%] md:max-w-[30rem] lg:bottom-[8%] lg:left-[9%]",
    align: "end",
    imageClass: "aspect-[3/4] w-full md:w-[12rem] lg:w-[15rem]",
  },
  {
    id: "soins",
    title: "Soins",
    body: "L’infirmier comprime, pose le pansement, et s’assure que vous tenez bien. Vous n’avez rien à gérer seul.",
    image: "/hero/medecin-2.png",
    imageAlt: "Soins après le prélèvement",
    className:
      "static md:absolute md:top-[4%] md:right-[2%] md:max-w-[30rem] lg:top-[5%] lg:right-[4%]",
    align: "end",
    imageClass: "aspect-[3/4] w-full md:w-[13rem] lg:w-[17rem]",
  },
  {
    id: "apres",
    title: "Après",
    body: "Quinze minutes de collation. Gardez le pansement deux heures, hydratez-vous, et laissez le sport pour le lendemain.",
    image: "/hero/medecin-a.png",
    imageAlt: "Temps de repos après le don",
    className:
      "static md:absolute md:right-[8%] md:bottom-[7%] md:max-w-[26rem] lg:right-[11%] lg:bottom-[9%]",
    align: "end",
    imageClass: "aspect-square w-full md:w-[8rem] lg:w-[10rem]",
  },
] as const;

export function Journey() {
  return (
    <section id="parcours" className="bg-hero text-ink">
      <div className="relative mx-auto max-w-[1440px] px-5 py-24 md:min-h-[56rem] md:px-8 md:py-32 lg:min-h-[62rem] lg:px-12">
        <div className="relative z-10 mx-auto max-w-[34rem] md:absolute md:top-1/2 md:left-1/2 md:max-w-[22rem] md:-translate-x-1/2 md:-translate-y-1/2 lg:max-w-[26rem]">
          <h2 className="font-display text-[clamp(1.55rem,2.6vw,2.35rem)] leading-[1.08] font-medium tracking-[-0.03em]">
            <span className="block text-silver">Une expérience</span>
            <span className="mt-[0.04em] block text-ink">de 45 min</span>
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-12 md:mt-0 md:contents">
          {PHASES.map((phase) => (
            <article
              key={phase.id}
              className={`flex gap-4 ${phase.align === "end" ? "items-end" : "items-start"} ${phase.className}`}
            >
              <figure
                className={`relative shrink-0 overflow-hidden rounded-[1.25rem] ${phase.imageClass}`}
              >
                <Image
                  src={phase.image}
                  alt={phase.imageAlt}
                  fill
                  sizes="17rem"
                  className="object-cover"
                />
              </figure>
              <div className="min-w-0 md:max-w-[16rem] lg:max-w-[18rem]">
                <h3 className="font-display text-[1.55rem] leading-[1.05] font-medium tracking-[-0.03em] text-blood md:text-[1.75rem]">
                  {phase.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft md:text-[16px]">
                  {phase.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
