export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ: FaqItem[] = [
  {
    id: "douleur",
    question: "S’agit-il d’une opération douloureuse ?",
    answer:
      "La piqûre se sent, comme une prise de sang. Ensuite, la plupart des personnes décrivent une sensation de pression plus qu’une douleur. Si vous êtes anxieux, dites-le : l’équipe est habituée, et vous n’êtes pas « trop sensible » — vous êtes simplement humain.",
  },
  {
    id: "temps",
    question: "Combien de temps dure réellement un don ?",
    answer:
      "Comptez environ 45 minutes porte à porte, collations comprises. Le prélèvement lui-même dure une dizaine de minutes pour le sang total. Vous pouvez lire, répondre à un message, ou simplement regarder le plafond. C’est court. Vraiment.",
  },
  {
    id: "vertige",
    question: "Peut-on faire un malaise pendant le prélèvement ?",
    answer:
      "Le malaise existe, il est rare, et il est pris en charge sur place. On vous allonge, on surveille, on vous fait boire. Manger avant, arriver hydraté, et rester allongé le temps qu’on vous le demande : voilà déjà l’essentiel pour l’éviter.",
  },
  {
    id: "sante",
    question: "Le don fatigue-t-il pendant plusieurs jours ?",
    answer:
      "Le volume prélevé est d’environ 450 ml — votre corps le reconstitue. Beaucoup de gens reprennent leur journée. Évitez juste le sport intense et les efforts lourds dans les heures qui suivent. Si vous vous sentez faible, dites-le avant de partir.",
  },
  {
    id: "tatouage",
    question: "Un tatouage ou un piercing récent empêche-t-il de donner ?",
    answer:
      "Un tatouage ou un piercing récent entraîne généralement un report de quelques mois, le temps d’écarter tout risque infectieux. Ce n’est pas un refus définitif. Notez la date : le simulateur d’éligibilité de cette page ne couvre pas ce critère, l’entretien médical si.",
  },
  {
    id: "medicaments",
    question: "Peut-on donner si l’on suit un traitement ?",
    answer:
      "La plupart des traitements n’empêchent pas le don. Certains le reportent, très peu l’interdisent. Ne vous auto-excluez pas sur un forum. L’entretien médical est fait pour ça : une liste, une date, une décision claire.",
  },
  {
    id: "premier",
    question: "Faut-il déjà connaître le déroulement pour un premier don ?",
    answer:
      "Tout le parcours est guidé. On vous explique chaque étape, on vérifie votre identité, un médecin vous reçoit, puis l’équipe s’occupe du prélèvement. Vous n’avez rien à improviser. Le seul rôle, c’est d’arriver, de répondre honnêtement, et de rester le temps de la collation.",
  },
];
