export type Sex = "homme" | "femme";

export type EligibilityInput = {
  age: number;
  weight: number;
  sex: Sex;
  lastDonation: Date | null;
};

export type EligibilityResult =
  | {
      status: "eligible";
      title: string;
      message: string;
    }
  | {
      status: "ineligible";
      title: string;
      message: string;
      reasons: string[];
    }
  | {
      status: "wait";
      title: string;
      message: string;
      nextDate: Date;
      daysRemaining: number;
    };

const MIN_AGE = 18;
const MAX_AGE = 65;
const MIN_WEIGHT = 50;
const DELAY_MONTHS: Record<Sex, number> = {
  homme: 3,
  femme: 4,
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const day = result.getDate();
  result.setMonth(result.getMonth() + months);
  if (result.getDate() < day) {
    result.setDate(0);
  }
  return startOfDay(result);
}

function diffInDays(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function evaluateEligibility(
  input: EligibilityInput,
  today = new Date(),
): EligibilityResult {
  const reasons: string[] = [];

  if (!Number.isFinite(input.age)) {
    reasons.push("L’âge renseigné n’est pas valide.");
  } else if (input.age < MIN_AGE) {
    reasons.push(
      `Il faut avoir au moins ${MIN_AGE} ans pour donner. Vous avez indiqué ${input.age} ans.`,
    );
  } else if (input.age > MAX_AGE) {
    reasons.push(
      `Le don n’est plus possible après ${MAX_AGE} ans révolus selon les critères de cette page. Vous avez indiqué ${input.age} ans.`,
    );
  }

  if (!Number.isFinite(input.weight)) {
    reasons.push("Le poids renseigné n’est pas valide.");
  } else if (input.weight < MIN_WEIGHT) {
    reasons.push(
      `Le poids minimum requis est de ${MIN_WEIGHT} kg. Vous avez indiqué ${input.weight} kg.`,
    );
  }

  if (reasons.length > 0) {
    return {
      status: "ineligible",
      title: "Pas cette fois — et ce n’est pas un échec",
      message:
        "Ces critères sont là pour protéger à la fois la personne qui donne et celle qui reçoit. Si votre situation évolue, vous pourrez revenir.",
      reasons,
    };
  }

  if (input.lastDonation) {
    const delay = DELAY_MONTHS[input.sex];
    const nextDate = addMonths(input.lastDonation, delay);
    const remaining = diffInDays(today, nextDate);

    if (remaining > 0) {
      return {
        status: "wait",
        title: "Encore un peu de patience",
        message: `Le délai minimum après un don est de ${delay} mois pour un${input.sex === "femme" ? "e femme" : " homme"}. Votre prochain créneau possible : ${formatLongDate(nextDate)}.`,
        nextDate,
        daysRemaining: remaining,
      };
    }
  }

  return {
    status: "eligible",
    title: "Vous pouvez prendre rendez-vous",
    message:
      "Sur le papier, rien ne s’y oppose. La confirmation définitive se fait toujours lors de l’entretien médical, le jour J — c’est normal, et c’est pour vous protéger.",
  };
}
