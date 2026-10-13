import { motion } from "motion/react";
import { ArrowRight, RotateCcw, Search } from "lucide-react";
import type { Character } from "../../domain/characters/types";
import type { Difficulty } from "../../domain/puzzle/types";
import type { Feedback } from "../../application/game/session";
import { motionTokens } from "../tokens/motion";
import { Confetti } from "./Confetti";
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
  const culprit = feedback.kind === "retry" ? undefined : find(feedback.culpritId);
  const accused = feedback.kind === "retry" ? find(feedback.accusedId) : undefined;

  const copy = {
    retry: {
      title: "Cette créature est innocente.",
      body: `${accused?.name ?? "Ce suspect"} n'est pas le coupable. Il te reste un dernier essai.`,
      cta: "Reprendre l'enquête",
      Icon: Search,
      accent: "bg-sun",
    },
    won: {
      title: "Coupable démasqué !",
      body: `C'était bien ${culprit?.name}. Niveau suivant : ${nextDifficulty}.`,
      cta: "Retour au menu",
      Icon: ArrowRight,
      accent: "bg-pacifiste-soft",
    },
    lost: {
      title: "Manche perdue",
      body: `Le coupable était ${culprit?.name}. Tu retentes au niveau ${difficulty}.`,
      cta: "Retour au menu",
      Icon: RotateCcw,
      accent: "bg-belliqueux-soft",
    },
  }[feedback.kind];

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4"
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
        className="relative w-full max-w-md rounded-card border-[3px] border-ink bg-surface p-6 text-center shadow-[0_8px_0_#1d1a4a]"
      >
        {feedback.kind === "won" && <Confetti />}
        {culprit && (
          <motion.div
            initial={{ y: 40, scale: 0.7 }}
            animate={{ y: 0, scale: 1 }}
            transition={motionTokens.spring.lively}
            className={`mx-auto -mt-2 mb-3 w-40 overflow-hidden rounded-3xl border-[3px] border-ink ${copy.accent}`}
          >
            <Portrait species={culprit.species} alignment={culprit.alignment} className="block w-full" />
          </motion.div>
        )}
        <h2 id="result-title" className="font-display text-3xl font-extrabold leading-tight">
          {copy.title}
        </h2>
        <p id="result-body" className="mx-auto mt-2 max-w-xs text-lg font-semibold text-muted">
          {copy.body}
        </p>
        <button
          autoFocus
          onClick={onContinue}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-primary px-6 py-3 font-display text-xl font-bold text-white shadow-[0_5px_0_#1d1a4a] transition active:translate-y-1 active:shadow-[0_1px_0_#1d1a4a]"
        >
          {copy.cta}
          <copy.Icon size={20} aria-hidden />
        </button>
      </motion.div>
    </motion.div>
  );
}
