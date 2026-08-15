"use client";

import { FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  evaluateEligibility,
  type EligibilityResult,
  type Sex,
} from "@/lib/eligibility";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

type Step = "sex" | "age" | "weight" | "last" | "result";

const STEPS: Step[] = ["sex", "age", "weight", "last", "result"];

export function EligibilityForm({ className }: { className?: string }) {
  const [step, setStep] = useState<Step>("sex");
  const [sex, setSex] = useState<Sex | null>(null);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [neverDonated, setNeverDonated] = useState(false);
  const [lastDonation, setLastDonation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const ageTimer = useRef<number>(0);
  const weightTimer = useRef<number>(0);

  const index = STEPS.indexOf(step);
  const analyzing = step === "result" && pending;
  const printed = step === "result" && !pending && !!result;

  const go = (next: Step) => {
    setError(null);
    setStep(next);
  };

  const run = (overrides?: { neverDonated?: boolean; lastDonation?: string }) => {
    if (!sex) return;
    const never = overrides?.neverDonated ?? neverDonated;
    const last = overrides?.lastDonation ?? lastDonation;
    setPending(true);
    setStep("result");
    window.setTimeout(() => {
      setResult(
        evaluateEligibility({
          sex,
          age: Number(age),
          weight: Number(weight),
          lastDonation: never || !last ? null : new Date(last),
        }),
      );
      setPending(false);
    }, 900);
  };

  const pickSex = (value: Sex) => {
    setSex(value);
    setError(null);
    go("age");
  };

  const onAge = (value: string) => {
    setAge(value);
    setError(null);
    window.clearTimeout(ageTimer.current);
    const n = Number(value);
    if (!value || Number.isNaN(n) || n < 1 || n > 120) return;
    ageTimer.current = window.setTimeout(
      () => go("weight"),
      value.length >= 2 ? 480 : 1000,
    );
  };

  const onWeight = (value: string) => {
    setWeight(value);
    setError(null);
    window.clearTimeout(weightTimer.current);
    const n = Number(value);
    if (!value || Number.isNaN(n) || n < 1 || n > 400) return;
    weightTimer.current = window.setTimeout(
      () => go("last"),
      value.length >= 2 ? 480 : 1000,
    );
  };

  const reset = () => {
    window.clearTimeout(ageTimer.current);
    window.clearTimeout(weightTimer.current);
    setStep("sex");
    setSex(null);
    setAge("");
    setWeight("");
    setNeverDonated(false);
    setLastDonation("");
    setError(null);
    setResult(null);
    setPending(false);
  };

  return (
    <form
      id="eligibilite"
      onSubmit={(event: FormEvent) => event.preventDefault()}
      className={cn(
        "quiz-screen flex w-full max-w-[28rem] shrink-0 flex-col rounded-[1.25rem] bg-white px-7 py-8 text-left text-ink md:max-w-[30rem] md:px-8 md:py-9",
        className,
      )}
      aria-label="Test d’éligibilité"
    >
      <Logo compact className="mb-6 hidden self-start lg:inline-flex" />

      {step !== "result" ? (
        <h2 className="font-display text-[clamp(1.85rem,2.4vw,2.35rem)] leading-[1.12] font-medium tracking-[-0.03em]">
          Utiliser ce formulaire pour tester votre aptitude à faire un don de
          sang
        </h2>
      ) : null}

      {(step !== "result" && index > 0) || printed ? (
        <div className="mt-6">
          {step !== "result" && index > 0 ? (
            <button
              type="button"
              onClick={() => go(STEPS[index - 1])}
              className="text-[14px] font-medium text-ink/45 outline-none focus-visible:outline-none"
            >
              Retour
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="text-[14px] font-medium text-ink/45 outline-none focus-visible:outline-none"
            >
              Recommencer
            </button>
          )}
        </div>
      ) : null}

      <div className="mt-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {step === "sex" && (
              <fieldset>
                <legend className="mb-3 text-[13px] font-medium tracking-[0.04em] text-ink/50 uppercase">
                  Vous êtes
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => pickSex("homme")}
                    className={cn(
                      "rounded-xl border px-4 py-5 text-center font-display text-[1.15rem] leading-none font-medium tracking-[-0.02em] outline-none transition-colors focus-visible:outline-none",
                      sex === "homme"
                        ? "border-ink bg-white text-ink"
                        : "border-ink/15 bg-white text-ink hover:border-ink/40",
                    )}
                    aria-pressed={sex === "homme"}
                  >
                    Un homme
                  </button>
                  <button
                    type="button"
                    onClick={() => pickSex("femme")}
                    className={cn(
                      "rounded-xl border px-4 py-5 text-center font-display text-[1.15rem] leading-none font-medium tracking-[-0.02em] outline-none transition-colors focus-visible:outline-none",
                      sex === "femme"
                        ? "border-ink bg-white text-ink"
                        : "border-ink/15 bg-white text-ink hover:border-ink/40",
                    )}
                    aria-pressed={sex === "femme"}
                  >
                    Une femme
                  </button>
                </div>
              </fieldset>
            )}

            {step === "age" && (
              <div>
                <label
                  htmlFor="age"
                  className="mb-3 block text-[13px] font-medium tracking-[0.04em] text-ink/50 uppercase"
                >
                  Quel âge avez-vous&nbsp;?
                </label>
                <div className="flex min-h-[3.5rem] w-full items-center rounded-xl border border-ink/15 bg-white px-4">
                  <input
                    id="age"
                    name="age"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => onAge(e.target.value)}
                    className="w-full bg-transparent font-display text-[1.65rem] leading-none font-medium tracking-[-0.03em] text-ink outline-none focus-visible:outline-none placeholder:text-ink/30"
                    placeholder="32"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {step === "weight" && (
              <div>
                <label
                  htmlFor="weight"
                  className="mb-3 block text-[13px] font-medium tracking-[0.04em] text-ink/50 uppercase"
                >
                  Et votre poids&nbsp;?
                </label>
                <div className="flex min-h-[3.5rem] w-full items-center rounded-xl border border-ink/15 bg-white px-4">
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    inputMode="decimal"
                    min={1}
                    max={400}
                    value={weight}
                    onChange={(e) => onWeight(e.target.value)}
                    className="w-full bg-transparent font-display text-[1.65rem] leading-none font-medium tracking-[-0.03em] text-ink outline-none focus-visible:outline-none placeholder:text-ink/30"
                    placeholder="62"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {step === "last" && (
              <div>
                <p className="mb-3 text-[13px] font-medium tracking-[0.04em] text-ink/50 uppercase">
                  Dernier don
                </p>
                <label className="flex cursor-pointer items-center gap-3 text-[15px] text-ink">
                  <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={neverDonated}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setNeverDonated(checked);
                        if (checked) {
                          setLastDonation("");
                          setError(null);
                          run({ neverDonated: true, lastDonation: "" });
                        }
                      }}
                      className="peer absolute inset-0 z-10 cursor-pointer opacity-0 outline-none"
                    />
                    <span className="size-5 rounded-[5px] border border-ink/25 peer-checked:hidden" />
                    <span className="hidden peer-checked:block">
                      <Icon name="check" className="size-6 text-ink" />
                    </span>
                  </span>
                  <span>Je n’ai jamais donné</span>
                </label>
                <input
                  id="last"
                  type="date"
                  value={lastDonation}
                  disabled={neverDonated}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLastDonation(value);
                    setNeverDonated(false);
                    if (!value) return;
                    const d = new Date(value);
                    if (Number.isNaN(d.getTime())) {
                      setError("La date n’est pas valide.");
                      return;
                    }
                    if (d > new Date()) {
                      setError("La date ne peut pas être dans le futur.");
                      return;
                    }
                    setError(null);
                    run({ neverDonated: false, lastDonation: value });
                  }}
                  className="mt-3 min-h-[3.5rem] w-full rounded-xl border border-ink/15 bg-white px-4 font-display text-[1.15rem] text-ink outline-none focus-visible:outline-none disabled:opacity-35"
                />
              </div>
            )}

            {step === "result" && (
              <div aria-live="polite">
                {analyzing || !result ? (
                  <p className="font-display text-[1.65rem] leading-[1.1] font-medium tracking-[-0.03em] text-ink">
                    Lecture en cours.
                  </p>
                ) : (
                  <ResultCopy result={result} />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p role="alert" className="mt-3 text-[14px] text-blood">
            {error}
          </p>
        )}
      </div>

      <p className="mt-8 text-[13px] leading-snug text-ink/40">
        Seul un entretien médical professionnel peut confirmer l’aptitude au
        don.
      </p>
    </form>
  );
}

function ResultCopy({ result }: { result: EligibilityResult }) {
  const label =
    result.status === "eligible"
      ? "Éligible"
      : result.status === "wait"
        ? "Délai non écoulé"
        : "Non éligible";

  return (
    <div>
      <p className="font-display text-[1rem] font-medium tracking-[0.16em] text-ink/45 uppercase">
        {label}
      </p>
      <h3 className="mt-2 font-display text-[2.1rem] leading-[1.08] font-medium tracking-[-0.03em]">
        {result.title}
      </h3>
      {result.status !== "ineligible" && (
        <p className="mt-4 text-[1.15rem] leading-relaxed text-ink-soft">
          {result.message}
        </p>
      )}
      {result.status === "ineligible" && (
        <ul className="mt-4 space-y-1.5 text-[1.1rem]">
          {result.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}
      {result.status === "wait" && (
        <p className="mt-4 font-display text-[1.28rem] leading-none tracking-[-0.03em]">
          Encore {result.daysRemaining} jour{result.daysRemaining > 1 ? "s" : ""}
        </p>
      )}
      {result.status !== "ineligible" && (
        <a
          href="#centres"
          className="mt-6 inline-flex min-h-[3.1rem] w-full items-center justify-center rounded-xl bg-ink px-6 font-display text-[1.15rem] leading-none font-medium tracking-[-0.03em] text-hero outline-none transition-colors hover:bg-ink/85 focus-visible:outline-none"
        >
          Trouver un centre
        </a>
      )}
    </div>
  );
}
