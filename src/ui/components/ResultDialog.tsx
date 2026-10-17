import { motion } from "motion/react";
import { ArrowRight, RotateCcw, Search } from "lucide-react";
import type { Character } from "../../domain/characters/types";
import type { Difficulty } from "../../domain/puzzle/types";
import type { Feedback } from "../../application/game/session";
import { motionTokens } from "../tokens/motion";
import { Confetti } from "./Confetti";
import { portraitSrc } from "../tokens/portrait";
import { Portrait } from "./Portrait";

interface Props {
  feedback: Feedback;
  characters: Character[];
  difficulty: Difficulty;
  nextDifficulty: Difficulty;
  onContinue: () => void;
}

export function ResultDialog({ feedback, characters, difficulty, nextDifficulty, onContinue }: Props) {
  const find = (id: string) => characters.find((c) => c.id === id);
  const culprits = feedback.kind === "retry" ? [] : feedback.culpritIds.map(find).filter((c): c is Character => !!c);
  const accused = feedback.kind === "retry" ? feedback.accusedIds.map(find).filter((c): c is Character => !!c) : [];
  const culpritNames = culprits.map((c) => c.name).join(" et ");
  const accusedNames = accused.map((c) => c.name).join(" et ");
  const retryBody =
    feedback.kind !== "retry"
      ? ""
      : feedback.correctCount === 0
        ? `${accusedNames || "Ce suspect"} ${accused.length > 1 ? "sont innocents" : "est innocent"}. Il te reste un dernier essai.`
        : `${feedback.correctCount} suspect${feedback.correctCount > 1 ? "s" : ""} sur ${accused.length} ${feedback.correctCount > 1 ? "sont" : "est"} bien coupable${feedback.correctCount > 1 ? "s" : ""}. Il te reste un dernier essai.`;

  const copy = {
    retry: {
      title: feedback.kind === "retry" && feedback.correctCount > 0 ? "Une contradiction subsiste." : accused.length > 1 ? "Ces créatures sont innocentes." : "Cette créature est innocente.",
      body: retryBody,
      cta: "Reprendre l'enquête",
      Icon: Search,
      accent: "bg-sun",
    },
    won: {
      title: culprits.length > 1 ? "Coupables démasqués !" : "Coupable démasqué !",
      body: `C'était bien ${culpritNames}. Niveau suivant : ${nextDifficulty}.`,
      cta: "Retour au menu",
      Icon: ArrowRight,
      accent: "bg-pacifiste-soft",
    },
    lost: {
      title: "Manche perdue",
      body: `${culprits.length > 1 ? "Les coupables étaient" : "Le coupable était"} ${culpritNames}. Tu retentes au niveau ${difficulty}.`,
      cta: "Retour au menu",
      Icon: RotateCcw,
      accent: "bg-belliqueux-soft",
    },
  }[feedback.kind];

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionTokens.duration.fast }}
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="result-title"
        aria-describedby="result-body"
        initial={{ scale: 0.8, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={motionTokens.spring.lively}
        className="relative w-full max-w-md rounded-card border-2 border-sun bg-surface text-ink p-4 text-center sm:p-6 shadow-[0_8px_0_#07050d]"
      >
        {feedback.kind === "won" && <Confetti />}
        {culprits.length > 0 && (
          <div className="mx-auto -mt-2 mb-3 flex justify-center gap-2">
            {culprits.map((culprit) => (
              <motion.div
                key={culprit.id}
                initial={{ y: 40, scale: 0.7 }}
                animate={{ y: 0, scale: 1 }}
                transition={motionTokens.spring.lively}
                className={`${culprits.length > 1 ? "w-24 sm:w-32" : "w-28 sm:w-40"} overflow-hidden rounded-xl border-2 border-ink ${copy.accent}`}
              >
                <Portrait species={culprit.species} alignment={culprit.alignment} name={culprit.name} src={portraitSrc(culprit)} className="block w-full" />
              </motion.div>
            ))}
          </div>
        )}
        <h2 id="result-title" className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
          {copy.title}
        </h2>
        <p id="result-body" className="mx-auto mt-2 max-w-xs text-base sm:text-lg font-semibold text-muted">
          {copy.body}
        </p>
        <button
          autoFocus
          onClick={onContinue}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-ink bg-primary px-5 py-2.5 font-display text-lg sm:mt-5 sm:px-6 sm:py-3 sm:text-xl font-bold text-white shadow-[0_5px_0_#07050d] transition active:translate-y-1 active:shadow-[0_1px_0_#07050d]"
        >
          {copy.cta}
          <copy.Icon size={20} aria-hidden />
        </button>
      </motion.div>
    </motion.div>
  );
}
