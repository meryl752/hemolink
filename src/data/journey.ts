export type JourneyStep = {
  id: string;
  time: string;
  duration: string;
  title: string;
  body: string;
  tip: string;
};

export const JOURNEY: JourneyStep[] = [
  {
    id: "accueil",
    time: "0 min",
    duration: "5 min",
    title: "L’accueil",
    body: "On vérifie votre pièce d’identité et on vous remet un questionnaire. Rien d’hostile : c’est le début d’un protocole pensé pour vous et pour le receveur. Asseyez-vous, respirez, remplissez sans vous presser.",
    tip: "Prenez une pièce d’identité en cours de validité. Sans elle, le don ne peut pas avoir lieu.",
  },
  {
    id: "entretien",
    time: "5 min",
    duration: "10 min",
    title: "L’entretien médical",
    body: "Un professionnel de santé relit vos réponses, prend votre tension, parfois un petit test d’hémoglobine. C’est le moment de tout dire — un voyage, un traitement, une fatigue. Un report n’est pas un jugement.",
    tip: "Préparez vos dates (dernier don, voyages, tatouages). L’honnêteté protège quelqu’un que vous ne rencontrerez jamais.",
  },
  {
    id: "prelevement",
    time: "15 min",
    duration: "10 min",
    title: "Le don",
    body: "Vous êtes allongé. Une désinfection, une piqûre, puis le silence du tubulure. Pour le sang total, comptez une dizaine de minutes. Vous pouvez fermer les yeux. L’équipe reste à portée de voix.",
    tip: "Regardez ailleurs si les aiguilles vous impressionnent. Serrez une balle, respirez lentement. Vous n’êtes pas le premier.",
  },
  {
    id: "repos",
    time: "25 min",
    duration: "15 min",
    title: "La collation",
    body: "C’est obligatoire, et c’est souvent le moment préféré. Jus, café, biscuits, un vrai temps pour que votre corps se rééquilibre. Ne partez pas en courant : ces quinze minutes font partie du don.",
    tip: "Buvez davantage que d’habitude le reste de la journée. Évitez sport intense, sauna, et charge lourde jusqu’au lendemain.",
  },
  {
    id: "apres",
    time: "45 min",
    duration: "—",
    title: "Et après",
    body: "Vous repartez avec un pansement et, parfois, une étrange légèreté. Le plasma se reconstitue en 48 h, les globules en quelques semaines. Dans 3 ou 4 mois, selon votre profil, la porte sera de nouveau ouverte.",
    tip: "Gardez le bras sans effort pendant une heure. Si un bleu apparaît, c’est fréquent. Un malaise tardif ? Allongez-vous, hydratez-vous, appelez si besoin.",
  },
];

export const PREP = {
  avant: [
    "Dormez suffisamment la veille.",
    "Prenez un vrai repas, riche en fer si possible.",
    "Buvez de l’eau — beaucoup.",
    "Évitez l’alcool dans les 24 heures.",
    "Apportez une pièce d’identité.",
  ],
  pendant: [
    "Signalez tout inconfort, immédiatement.",
    "Respirez, ne bloquez pas vos épaules.",
    "Vous pouvez interrompre à tout moment.",
  ],
  apres: [
    "Restez le temps de la collation.",
    "Rehydratez-vous toute la journée.",
    "Pas de sport intense avant le lendemain.",
    "Gardez le pansement au moins 2 heures.",
  ],
};
