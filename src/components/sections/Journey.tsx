import Image from "next/image";

const PHASES = [
  {
    id: "avant",
    title: "Avant",
    body: "Dormez, un vrai repas, beaucoup d’eau. Une pièce d’identité le jour J — sans elle, pas de don.",
    image: "/journey/avant.jpg",
    imageAlt: "Un vrai repas avant le don",
    className:
      "static lg:absolute lg:top-[8%] lg:left-[3%] lg:max-w-[28rem]",
    imageClass: "aspect-[4/3] w-full lg:aspect-[4/5] lg:w-[12rem]",
    imageFit: "object-cover object-[50%_60%]",
  },
  {
    id: "prelevement",
    title: "Prélèvement",
    body: "Une dizaine de minutes allongé. L’équipe reste là : dites-le si ça cloche. Vous pouvez arrêter à tout moment.",
    image: "/journey/prelevement.jpg",
    imageAlt: "Bras au repos pendant le don, pansement en place",
    className:
      "static lg:absolute lg:bottom-[8%] lg:left-[9%] lg:max-w-[30rem]",
    imageClass: "aspect-[4/3] w-full lg:aspect-[3/4] lg:w-[15rem]",
    imageFit: "object-cover object-[45%_35%]",
  },
  {
    id: "soins",
    title: "Soins",
    body: "L’infirmier comprime, pose le pansement, et s’assure que vous tenez bien. Vous n’avez rien à gérer seul.",
    image: "/journey/soins.jpg",
    imageAlt: "Compresse posée sur le bras après le prélèvement",
    className:
      "static lg:absolute lg:top-[5%] lg:right-[4%] lg:max-w-[30rem]",
    imageClass: "aspect-[4/3] w-full lg:aspect-[3/4] lg:w-[17rem]",
    imageFit: "object-cover object-[55%_50%]",
  },
  {
    id: "apres",
    title: "Après",
    body: "Quinze minutes de collation. Gardez le pansement deux heures, hydratez-vous, et laissez le sport pour le lendemain.",
    image: "/journey/apres.jpg",
    imageAlt: "Jus d’orange pour la collation après le don",
    className:
      "static lg:absolute lg:right-[11%] lg:bottom-[9%] lg:max-w-[26rem]",
    imageClass: "aspect-[4/3] w-full lg:aspect-square lg:w-[10rem]",
    imageFit: "object-cover object-center",
  },
] as const;

export function Journey() {
  return (
    <section id="parcours" className="bg-hero text-ink">
      <div className="relative mx-auto max-w-[1440px] px-5 py-24 lg:min-h-[62rem] lg:px-12 lg:py-32 md:px-8 md:py-32">
        <div className="relative z-10 mx-auto max-w-[34rem] lg:absolute lg:top-1/2 lg:left-1/2 lg:max-w-[30rem] lg:-translate-x-1/2 lg:-translate-y-1/2">
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.95rem)] leading-[1.08] font-medium tracking-[-0.03em] max-lg:text-[3.1rem]">
            <span className="block text-silver">Une expérience</span>
            <span className="mt-[0.04em] block text-ink">de 45 min</span>
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-12 max-lg:gap-14 lg:mt-0 lg:contents">
          {PHASES.map((phase) => (
            <article
              key={phase.id}
              className={`flex gap-4 max-lg:flex-col max-lg:gap-4 lg:items-end ${phase.className}`}
            >
              <figure
                className={`relative shrink-0 overflow-hidden rounded-[1.25rem] max-lg:order-2 ${phase.imageClass}`}
              >
                <Image
                  src={phase.image}
                  alt={phase.imageAlt}
                  fill
                  quality={90}
                  sizes="(max-width: 1023px) 100vw, 17rem"
                  className={phase.imageFit}
                />
              </figure>
              <div className="min-w-0 max-lg:contents lg:max-w-[18rem]">
                <h3 className="font-display text-[1.55rem] leading-[1.05] font-medium tracking-[-0.03em] text-blood max-lg:order-1 max-lg:text-[1.7rem] md:text-[1.75rem]">
                  {phase.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft max-lg:order-3 max-lg:mt-0 md:text-[16px]">
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
