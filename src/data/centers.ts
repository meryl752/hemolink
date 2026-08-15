export type DonationType = "sang" | "plasma" | "plaquettes";

export type CenterKind = "chu" | "hopital-reference" | "hopital-zone";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DayHours = {
  open: string;
  close: string;
} | null;

export type Center = {
  id: string;
  name: string;
  kind: CenterKind;
  city: string;
  department: string;
  address: string;
  postalCode: string;
  phone: string;
  email?: string;
  lat: number;
  lng: number;
  types: DonationType[];
  appointment: "sur-rdv" | "sans-rdv" | "mixte";
  hours: Record<Weekday, DayHours>;
  image: string;
  note?: string;
};

export const KIND_LABEL: Record<CenterKind, string> = {
  chu: "Centre hospitalier universitaire",
  "hopital-reference": "Hôpital de référence",
  "hopital-zone": "Hôpital de zone",
};

export const TYPE_LABEL: Record<DonationType, string> = {
  sang: "Sang total",
  plasma: "Plasma",
  plaquettes: "Plaquettes",
};

export const APPOINTMENT_LABEL: Record<Center["appointment"], string> = {
  "sur-rdv": "Sur rendez-vous",
  "sans-rdv": "Sans rendez-vous",
  mixte: "Avec ou sans rendez-vous",
};

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
  0: "Dimanche",
};

const WEEKDAYS: Record<Weekday, DayHours> = {
  1: { open: "08:00", close: "16:00" },
  2: { open: "08:00", close: "16:00" },
  3: { open: "08:00", close: "16:00" },
  4: { open: "08:00", close: "16:00" },
  5: { open: "08:00", close: "15:30" },
  6: { open: "08:30", close: "12:00" },
  0: null,
};

export const CITIES = [
  "Abomey",
  "Abomey-Calavi",
  "Cotonou",
  "Natitingou",
  "Ouidah",
  "Parakou",
  "Porto-Novo",
  "Tanguiéta",
] as const;

export const CENTERS: Center[] = [
  {
    id: "chic-calavi",
    name: "Centre Hospitalier International de Calavi (CHIC)",
    kind: "hopital-reference",
    city: "Abomey-Calavi",
    department: "Atlantique",
    address: "À proximité du Tribunal de première instance d’Abomey-Calavi",
    postalCode: "Abomey-Calavi",
    phone: "+229 01 21 40 01 11",
    email: "contact@chichopital.bj",
    lat: 6.471019,
    lng: 2.341593,
    types: ["sang", "plasma", "plaquettes"],
    appointment: "sur-rdv",
    hours: {
      1: { open: "08:00", close: "17:00" },
      2: { open: "08:00", close: "17:00" },
      3: { open: "08:00", close: "17:00" },
      4: { open: "08:00", close: "17:00" },
      5: { open: "08:00", close: "17:00" },
      6: null,
      0: null,
    },
    image: "/centers/chic.jpg",
    note: "Plus grand hôpital moderne du pays. Prise de rendez-vous au +229 01 21 40 01 11, du lundi au vendredi.",
  },
  {
    id: "cnhu-hkm",
    name: "CNHU-HKM",
    kind: "chu",
    city: "Cotonou",
    department: "Littoral",
    address: "Avenue Jean-Paul II, Cadjèhoun, face au Palais de la Présidence",
    postalCode: "01 BP 386",
    phone: "+229 01 21 30 06 56",
    lat: 6.355069,
    lng: 2.412151,
    types: ["sang", "plasma", "plaquettes"],
    appointment: "mixte",
    hours: {
      1: { open: "08:00", close: "16:00" },
      2: { open: "08:00", close: "16:00" },
      3: { open: "08:00", close: "16:00" },
      4: { open: "08:00", close: "16:00" },
      5: { open: "08:00", close: "16:00" },
      6: { open: "08:00", close: "12:30" },
      0: null,
    },
    image: "/centers/cnhu-hkm.jpg",
    note: "Centre national hospitalier universitaire Hubert Koutoukou Maga. L’hôpital assure une permanence 24 h/24 ; le don se fait aux horaires d’accueil.",
  },
  {
    id: "homel-chu-mel",
    name: "HOMEL (CHU-MEL)",
    kind: "chu",
    city: "Cotonou",
    department: "Littoral",
    address: "Rue Roi Dako Donou, quartier Tokpa Xoxo",
    postalCode: "01 BP 107",
    phone: "+229 01 95 63 31 00",
    email: "homelag@gmail.com",
    lat: 6.36154,
    lng: 2.43772,
    types: ["sang", "plasma"],
    appointment: "mixte",
    hours: WEEKDAYS,
    image: "/centers/chu-mel.jpg",
    note: "Centre hospitalier universitaire de la mère et de l’enfant Lagune. Spécialisé mère-enfant.",
  },
  {
    id: "chu-parakou",
    name: "CHU de Parakou (CHUP)",
    kind: "chu",
    city: "Parakou",
    department: "Borgou",
    address: "Tronçon marché Arzèkè – Université, quartier Banikanni",
    postalCode: "Parakou",
    phone: "+229 01 23 61 07 17",
    lat: 9.3372,
    lng: 2.6303,
    types: ["sang", "plasma", "plaquettes"],
    appointment: "mixte",
    hours: WEEKDAYS,
    image: "/centers/chu-parakou.jpg",
    note: "Grand pôle sanitaire du nord du pays (CHUD Borgou-Alibori / CHU de Parakou).",
  },
  {
    id: "chud-oueme",
    name: "CHUD-Ouémé",
    kind: "chu",
    city: "Porto-Novo",
    department: "Ouémé",
    address: "Rue de l’Inspection, 4e arrondissement, face au jardin des plantes",
    postalCode: "01 BP 52",
    phone: "+229 01 20 21 35 90",
    lat: 6.473889,
    lng: 2.613056,
    types: ["sang", "plasma"],
    appointment: "mixte",
    hours: WEEKDAYS,
    image: "/centers/chud-oueme.jpg",
    note: "Hôpital départemental de référence de la capitale. Tél. également 20 21 35 91 et 20 21 35 92.",
  },
  {
    id: "hz-calavi",
    name: "Hôpital de Zone d’Abomey-Calavi",
    kind: "hopital-zone",
    city: "Abomey-Calavi",
    department: "Atlantique",
    address: "Abomey-Calavi / Sô-Ava, à moins d’un kilomètre du CHIC",
    postalCode: "BP 1673",
    phone: "+229 01 21 36 17 28",
    email: "hzcalavi9@gmail.com",
    lat: 6.472425,
    lng: 2.342688,
    types: ["sang"],
    appointment: "sans-rdv",
    hours: WEEKDAYS,
    image: "/centers/hz-calavi.jpg",
    note: "Centre hospitalier universitaire de zone Abomey-Calavi / Sô-Ava. Autre ligne : +229 01 60 30 49 99.",
  },
  {
    id: "hz-ouidah",
    name: "Hôpital de Zone de Ouidah",
    kind: "hopital-zone",
    city: "Ouidah",
    department: "Atlantique",
    address: "Quartier Gbèna, 2e arrondissement, face à l’église catholique",
    postalCode: "01 BP 6060",
    phone: "+229 01 21 34 10 10",
    lat: 6.3631,
    lng: 2.0853,
    types: ["sang"],
    appointment: "sans-rdv",
    hours: WEEKDAYS,
    image: "/centers/hz-ouidah.jpg",
    note: "Structure sanitaire clé de la côte. Autre ligne : +229 01 21 34 16 76.",
  },
  {
    id: "tanguieta-sjd",
    name: "Hôpital Saint Jean de Dieu de Tanguiéta",
    kind: "hopital-zone",
    city: "Tanguiéta",
    department: "Atacora",
    address: "RNIE 3, Tanguiéta",
    postalCode: "BP 07",
    phone: "+229 01 23 83 00 11",
    email: "ohsjdtanguieta@yahoo.fr",
    lat: 10.624579,
    lng: 1.268154,
    types: ["sang", "plasma"],
    appointment: "mixte",
    hours: WEEKDAYS,
    image: "/centers/tanguieta.jpg",
    note: "Hôpital de zone réputé dans l’Atacora. Autre ligne : +229 01 99 32 13 13.",
  },
  {
    id: "chd-zou",
    name: "CHD Zou-Collines",
    kind: "hopital-reference",
    city: "Abomey",
    department: "Zou",
    address: "Quartier Djègbé, Abomey",
    postalCode: "BP 02",
    phone: "+229 01 22 50 18 24",
    lat: 7.1826,
    lng: 1.9912,
    types: ["sang", "plasma"],
    appointment: "mixte",
    hours: WEEKDAYS,
    image: "/centers/chd-zou.jpg",
    note: "Centre hospitalier départemental du Zou et des Collines. Pôle de référence du centre du pays. Autre ligne : +229 01 97 63 34 93.",
  },
  {
    id: "hz-natitingou",
    name: "Hôpital de Zone de Natitingou",
    kind: "hopital-zone",
    city: "Natitingou",
    department: "Atacora",
    address: "Natitingou, Atacora",
    postalCode: "BP 14",
    phone: "+229 01 23 82 14 17",
    lat: 10.3042,
    lng: 1.3796,
    types: ["sang"],
    appointment: "sans-rdv",
    hours: WEEKDAYS,
    image: "/centers/hz-natitingou.jpg",
    note: "Hôpital de zone de la capitale de l’Atacora. Autre ligne : +229 01 95 53 93 30.",
  },
];
