import { motion } from "motion/react";
import { Frown, PartyPopper, Play, Star } from "lucide-react";
import type { Difficulty } from "../../domain/puzzle/types";
import { CHARACTER_CATALOG } from "../../domain/characters/catalog";
import { DIFFICULTY_ORDER, type GameState } from "../../application/game/session";
import { characterRange } from "../../domain/generator/difficulty";
import { CharacterCard } from "../components/CharacterCard";
import { motionTokens } from "../tokens/motion";

interface Props {
  state: GameState;
  onSetCount: (n: number) => void;
  onSetDifficulty: (d: Difficulty) => void;
  onStart: () => void;
}

const HERO = [
  { id: "elara", say: "Varek ment, j'en suis sûre.", tilt: -6 },
  { id: "gorak", say: "Le coupable n'est pas un pacifiste.", tilt: 0 },
  { id: "varek", say: "Gorak dit la vérité.", tilt: 6 },
].map((h) => ({ ...h, character: CHARACTER_CATALOG.find((c) => c.id === h.id)! }));

export function MenuScreen({ state, onSetCount, onSetDifficulty, onStart }: Props) {
  const { difficulty, characterCount, lastResult } = state;
  const level = DIFFICULTY_ORDER.indexOf(difficulty);
  const { min, max } = characterRange(difficulty);
  const counts = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <motion.main
      className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center gap-5 px-3 pb-8 pt-6 sm:gap-8 sm:px-4 sm:pb-10 sm:pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.duration.normal }}
    >
      <header className="text-center">
        <h1 className="font-display text-4xl font-extrabold leading-[0.95] sm:text-7xl">Fantasy Deduction</h1>
        <p className="mx-auto mt-2 max-w-md text-base font-semibold sm:mt-3 sm:text-lg text-muted">
          Chaque créature affirme quelque chose. Les règles disent qui dit vrai. Un seul suspect tient jusqu'au bout.
        </p>
      </header>

      <div aria-hidden className="grid w-full max-w-2xl grid-cols-3 gap-2 pt-6 sm:gap-6 sm:pt-10">
        {HERO.map((h, i) => (
          <div key={h.id} style={{ rotate: `${h.tilt}deg`, marginTop: h.tilt === 0 ? 0 : 14 }}>
            <ul>
              <CharacterCard character={h.character} statement={h.say} index={i} preview />
            </ul>
          </div>
        ))}
      </div>

      {lastResult && (
        <motion.p
          role="status"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={motionTokens.spring.lively}
          className={`flex items-center gap-2 rounded-2xl border-[3px] px-4 py-2 text-lg font-bold ${
            lastResult === "won" ? "border-success bg-pacifiste-soft text-success" : "border-danger bg-belliqueux-soft text-danger"
          }`}
        >
          {lastResult === "won" ? <PartyPopper size={22} aria-hidden /> : <Frown size={22} aria-hidden />}
          {lastResult === "won"
            ? `Coupable démasqué ! Niveau suivant : ${difficulty}.`
            : `Manche perdue. Tu retentes au niveau ${difficulty}.`}
        </motion.p>
      )}

      <section className="w-full max-w-2xl rounded-card border-[3px] border-ink bg-white p-4 shadow-[0_6px_0_#1d1a4a] sm:p-5">
        <h2 id="level-label" className="font-display text-xl font-extrabold">
          Niveau
        </h2>
        <div role="radiogroup" aria-labelledby="level-label" className="mt-2 grid grid-cols-4 gap-1.5 sm:gap-2">
          {DIFFICULTY_ORDER.map((d, i) => {
            const current = i === level;
            return (
              <button
                key={d}
                role="radio"
                aria-checked={current}
                onClick={() => onSetDifficulty(d)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-[3px] min-h-11 px-1 py-2 text-center text-xs font-bold transition sm:text-base ${
                  current ? "border-ink bg-sun shadow-[0_4px_0_#1d1a4a]" : "border-ink/15 bg-white text-muted hover:border-ink"
                }`}
              >
                <span className="flex" aria-hidden>
                  {Array.from({ length: i + 1 }, (_, k) => (
                    <Star key={k} size={14} className={current ? "fill-ink" : ""} />
                  ))}
                </span>
                {d}
              </button>
            );
          })}
        </div>

        <h2 id="count-label" className="mt-4 font-display text-lg font-extrabold sm:mt-5 sm:text-xl">
          Créatures dans la manche
        </h2>
        <div role="radiogroup" aria-labelledby="count-label" className="mt-2 flex flex-wrap gap-2">
          {counts.map((n) => (
            <button
              key={n}
              role="radio"
              aria-checked={n === characterCount}
              onClick={() => onSetCount(n)}
              className={`size-11 rounded-2xl border-[3px] font-display text-xl font-bold transition ${
                n === characterCount ? "border-ink bg-primary text-white shadow-[0_4px_0_#1d1a4a]" : "border-ink/20 bg-white hover:border-ink"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          onClick={onStart}
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-primary px-6 py-3 font-display text-xl sm:mt-6 sm:py-4 sm:text-2xl font-bold text-white shadow-[0_6px_0_#1d1a4a] transition active:translate-y-1 active:shadow-[0_2px_0_#1d1a4a]"
        >
          <Play size={24} className="fill-white" aria-hidden />
          Lancer la manche
        </button>
      </section>
    </motion.main>
  );
}
