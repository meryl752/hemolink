export type BloodGroup = "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-";

export type ReserveLevel = "critique" | "tendu" | "stable" | "confortable";

export type Reserve = {
  group: BloodGroup;
  level: ReserveLevel;
  fill: number;
  note: string;
};

export const LEVEL_LABEL: Record<ReserveLevel, string> = {
  critique: "Critique",
  tendu: "Tendu",
  stable: "Stable",
  confortable: "Confortable",
};

export const RESERVES: Reserve[] = [
  {
    group: "O-",
    level: "critique",
    fill: 0.22,
    note: "Donneur universel. Chaque poche compte vraiment.",
  },
  {
    group: "O+",
    level: "tendu",
    fill: 0.38,
    note: "Le groupe le plus demandé. Les stocks tournent vite.",
  },
  {
    group: "B-",
    level: "tendu",
    fill: 0.41,
    note: "Groupe rare. Les délais de reconstitution sont longs.",
  },
  {
    group: "A-",
    level: "tendu",
    fill: 0.46,
    note: "Utile pour plusieurs patients, y compris en urgence.",
  },
  {
    group: "B+",
    level: "stable",
    fill: 0.62,
    note: "Niveau correct, mais le sang ne se conserve que 42 jours.",
  },
  {
    group: "A+",
    level: "stable",
    fill: 0.71,
    note: "Bon niveau. La régularité des dons reste essentielle.",
  },
  {
    group: "AB-",
    level: "stable",
    fill: 0.68,
    note: "Groupe peu fréquent. Le plasma AB est particulièrement précieux.",
  },
  {
    group: "AB+",
    level: "confortable",
    fill: 0.84,
    note: "Receveur universel. Le besoin existe surtout en plasma.",
  },
];
