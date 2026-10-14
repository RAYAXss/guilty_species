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
      className="mx-auto flex min-h-screen max-w-6xl flex-col gap-5 px-4 pb-8 pt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.duration.normal }}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onQuit}
          className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink/20 bg-white px-4 py-2 font-bold hover:border-ink"
        >
          <ArrowLeft size={18} aria-hidden />
          Quitter la manche
        </button>
        <h1 className="font-display text-2xl font-extrabold">
          Niveau {difficulty} <span className="text-muted">· {puzzle.characters.length} créatures</span>
        </h1>
        <div className="flex items-center gap-1 rounded-2xl bg-white px-3 py-2 font-bold" role="status">
          {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
            <Heart
              key={i}
              size={22}
              aria-hidden
              className={i < attemptsLeft ? "fill-danger text-danger" : "text-ink/25"}
            />
          ))}
          <span className="ml-1">
            {attemptsLeft} essai{attemptsLeft > 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <RulesBoard rules={puzzle.rules} />

      <section aria-label="Suspects" className="flex-1 pb-4">
        <ul className="grid justify-center gap-x-5 gap-y-8 pt-10 [grid-template-columns:repeat(auto-fit,minmax(9.5rem,14rem))]">
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

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-card border-[3px] border-ink bg-white p-3 shadow-[0_6px_0_#1d1a4a]">
        <p className="flex items-center gap-2 px-2 font-bold" aria-live="polite">
          <MousePointerClick size={20} className="text-primary" aria-hidden />
          {selected ? `Suspect choisi : ${selected.name}` : "Choisis un suspect pour l'accuser."}
        </p>
        <button
          onClick={accuse}
          disabled={!selected || !!feedback}
          className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-primary px-6 py-3 font-display text-xl font-bold text-white shadow-[0_5px_0_#1d1a4a] transition enabled:active:translate-y-1 enabled:active:shadow-[0_1px_0_#1d1a4a] disabled:cursor-not-allowed disabled:border-ink/20 disabled:bg-ink/10 disabled:text-muted disabled:shadow-none"
        >
          <Gavel size={20} aria-hidden />
          {selected ? `Accuser ${selected.name}` : "Accuser"}
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
