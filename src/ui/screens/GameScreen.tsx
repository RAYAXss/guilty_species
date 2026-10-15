import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Gavel, Heart, MousePointerClick } from "lucide-react";
import { MAX_ATTEMPTS, nextDifficulty, type GameState } from "../../application/game/session";
import { CharacterCard, type CardState } from "../components/CharacterCard";
import { ResultDialog } from "../components/ResultDialog";
import { RulesBoard } from "../components/RulesBoard";
import { motionTokens } from "../tokens/motion";

interface Props {
  state: GameState;
  onAccuse: (id: string) => void;
  onDismissFeedback: () => void;
  onQuit: () => void;
}

export function GameScreen({ state, onAccuse, onDismissFeedback, onQuit }: Props) {
  const { round, feedback, difficulty } = state;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  if (!round) return null;

  const { puzzle, innocentIds, attemptsLeft } = round;
  const selected = puzzle.characters.find((c) => c.id === selectedId);
  const stateOf = (id: string): CardState => (innocentIds.includes(id) ? "innocent" : id === selectedId ? "selected" : "idle");

  const accuse = () => {
    if (!selected) return;
    onAccuse(selected.id);
    setSelectedId(null);
  };

  return (
    <motion.main
      className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-3 px-3 pb-6 pt-3 sm:gap-5 sm:px-4 sm:pb-8 sm:pt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.duration.normal }}
    >
      <header className="flex items-center justify-between gap-2 sm:gap-3">
        <button
          onClick={onQuit}
          aria-label="Quitter la manche"
          className="inline-flex size-11 shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-sun/50 bg-surface text-ink font-bold hover:border-sun sm:size-auto sm:px-4 sm:py-2"
        >
          <ArrowLeft size={18} aria-hidden />
          <span className="hidden sm:inline">Quitter la manche</span>
        </button>
        <h1 className="min-w-0 truncate text-center font-display text-base font-extrabold sm:text-2xl">
          Niveau {difficulty} <span className="text-dim">· {puzzle.characters.length} créatures</span>
        </h1>
        <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-surface text-ink px-2 py-1.5 text-sm font-bold sm:gap-1 sm:px-3 sm:py-2 sm:text-base" role="status">
          {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
            <Heart
              key={i}
              aria-hidden
              className={`size-[18px] sm:size-[22px] ${i < attemptsLeft ? "fill-danger text-danger" : "text-ink/25"}`}
            />
          ))}
          <span className="ml-1 hidden sm:inline">
            {attemptsLeft} essai{attemptsLeft > 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <RulesBoard rules={puzzle.rules} />

      <section aria-label="Suspects" className="flex-1 pb-2 sm:pb-4">
        <ul className="grid grid-cols-2 gap-x-3 gap-y-5 pt-5 sm:justify-center sm:gap-x-5 sm:gap-y-8 sm:pt-10 sm:[grid-template-columns:repeat(auto-fit,minmax(9.5rem,14rem))]">
          {puzzle.characters.map((c, i) => (
            <CharacterCard
              key={c.id}
              index={i}
              character={c}
              statement={puzzle.statements.filter((s) => s.characterId === c.id).map((s) => s.text).join(" ")}
              state={stateOf(c.id)}
              onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
            />
          ))}
        </ul>
      </section>

      <div className="sticky bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-20 flex items-center justify-between gap-2 rounded-lg border-2 border-sun bg-surface text-ink p-2 shadow-[0_4px_0_#07050d] sm:bottom-4 sm:gap-3 sm:rounded-card sm:p-3 sm:shadow-[0_6px_0_#07050d]">
        <p className="flex min-w-0 flex-1 items-center gap-2 px-1 text-sm font-bold sm:px-2 sm:text-base" aria-live="polite">
          <MousePointerClick className="size-[18px] shrink-0 text-primary sm:size-5" aria-hidden />
          <span className="min-w-0 truncate">{selected ? `Suspect : ${selected.name}` : "Choisis un suspect."}</span>
        </p>
        <button
          onClick={accuse}
          disabled={!selected || !!feedback}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md border-2 border-ink bg-primary px-3.5 py-1.5 font-display text-base font-bold text-white shadow-[0_4px_0_#07050d] sm:gap-2 sm:rounded-lg sm:px-6 sm:py-3 sm:text-xl sm:shadow-[0_5px_0_#07050d] transition enabled:active:translate-y-1 enabled:active:shadow-[0_1px_0_#07050d] disabled:cursor-not-allowed disabled:border-ink/20 disabled:bg-ink/10 disabled:text-muted disabled:shadow-none"
        >
          <Gavel size={20} aria-hidden />
          Accuser
        </button>
      </div>

      {feedback && (
        <ResultDialog
          feedback={feedback}
          characters={puzzle.characters}
          difficulty={difficulty}
          nextDifficulty={nextDifficulty(difficulty)}
          onContinue={onDismissFeedback}
        />
      )}
    </motion.main>
  );
}
