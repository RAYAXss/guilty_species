import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Dices, Frown, GraduationCap, Map as MapIcon, PartyPopper, Play, Star } from "lucide-react";
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
  onOpenCampaign: () => void;
  onStartTutorial: () => void;
}

/** A hand of three cards: the speaker in front, two suspects fanned behind. */
const HERO = [
  { id: "elara", say: "", rotate: -8, x: "-40%", y: "1.5rem" },
  { id: "varek", say: "", rotate: 8, x: "40%", y: "1.5rem" },
  { id: "gorak", say: "Le coupable est plus fort que moi.", rotate: 0, x: "0%", y: "0rem" },
].map((h) => ({ ...h, character: CHARACTER_CATALOG.find((c) => c.id === h.id)! }));

const MODE_BUTTON =
  "relative flex w-full items-center gap-3 rounded-card border-2 p-4 text-left shadow-[0_6px_0_#07050d] transition active:translate-y-1 active:shadow-[0_2px_0_#07050d]";

export function MenuScreen({ state, onSetCount, onSetDifficulty, onStart, onOpenCampaign, onStartTutorial }: Props) {
  const { difficulty, characterCount, lastResult } = state;
  const reduce = useReducedMotion();
  // Coming back from a free round: keep its settings open.
  const [freeOpen, setFreeOpen] = useState(lastResult !== null);
  const campaignStars = Object.values(state.progress).reduce((a, b) => a + b, 0);
  const level = DIFFICULTY_ORDER.indexOf(difficulty);
  const { min, max } = characterRange(difficulty);
  const counts = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <motion.main
      className="relative mx-auto flex min-h-dvh max-w-md flex-col items-center gap-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.duration.normal }}
    >
      <header className="flex h-11 w-full items-center pr-14">
        <h1 className="font-display text-2xl font-extrabold tracking-wide text-sun">Guilty Species</h1>
      </header>

      {/* isolate: the fan has its own stacking context, so it can never cover the buttons below. */}
      <div aria-hidden className="relative isolate grid w-full justify-items-center pb-8 pt-1">
        {/* Torchlight pooling on the table under the hand. */}
        <div className="absolute inset-x-6 bottom-2 -z-10 h-24 rounded-[50%] bg-sun/25 blur-2xl" />
        {HERO.map((h, i) => (
          <motion.div
            key={h.id}
            className="col-start-1 row-start-1 w-[40%]"
            style={{ transformOrigin: "50% 100%", zIndex: i }}
            initial={reduce ? false : { rotate: 0, x: "0%", y: "1.5rem", opacity: 0 }}
            animate={{ rotate: h.rotate, x: h.x, y: h.y, opacity: 1 }}
            transition={{ ...motionTokens.spring.soft, delay: 0.15 + i * motionTokens.stagger }}
          >
            <ul className={h.say ? "drop-shadow-[0_14px_18px_rgba(0,0,0,0.6)]" : "brightness-90"}>
              <CharacterCard character={h.character} statement={h.say} index={i} preview />
            </ul>
          </motion.div>
        ))}
      </div>

      {lastResult && (
        <motion.p
          role="status"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={motionTokens.spring.lively}
          className={`flex w-full items-center gap-2 rounded-lg border-2 px-4 py-2 font-bold ${
            lastResult === "won" ? "border-success bg-pacifiste-soft text-success" : "border-danger bg-belliqueux-soft text-danger"
          }`}
        >
          {lastResult === "won" ? <PartyPopper size={22} aria-hidden /> : <Frown size={22} aria-hidden />}
          {lastResult === "won" ? `Coupable démasqué ! Niveau suivant : ${difficulty}.` : `Manche perdue. Tu retentes au niveau ${difficulty}.`}
        </motion.p>
      )}

      <nav aria-label="Modes de jeu" className="relative z-10 grid w-full gap-3">
        <button onClick={onOpenCampaign} className={`${MODE_BUTTON} border-sun bg-primary text-white`}>
          <MapIcon className="size-10 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block font-display text-xl font-extrabold">Campagne</span>
            <span className="block text-sm font-semibold text-white/85">Retrouve le Cœur de Fantolia, région après région.</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 font-bold" aria-label={`${campaignStars} étoiles`}>
            <Star size={18} className="fill-sun text-sun" aria-hidden />
            {campaignStars}
          </span>
        </button>

        <section className="rounded-card border-2 border-sun bg-surface text-ink shadow-[0_6px_0_#07050d]">
          <button
            onClick={() => setFreeOpen((v) => !v)}
            aria-expanded={freeOpen}
            aria-controls="free-play"
            className="flex w-full items-center gap-3 p-4 text-left"
          >
            <Dices className="size-10 shrink-0 text-primary" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block font-display text-xl font-extrabold">Jeu libre</span>
              <span className="block text-sm font-semibold text-muted">Une nouvelle énigme à chaque manche.</span>
            </span>
            <ChevronDown className={`size-6 shrink-0 transition-transform ${freeOpen ? "rotate-180" : ""}`} aria-hidden />
          </button>

          <AnimatePresence initial={false}>
            {freeOpen && (
              <motion.div
                id="free-play"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: motionTokens.duration.normal }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  <h2 id="level-label" className="font-display text-lg font-extrabold">
                    Niveau
                  </h2>
                  <div role="radiogroup" aria-labelledby="level-label" className="mt-2 grid grid-cols-4 gap-1.5">
                    {DIFFICULTY_ORDER.map((d, i) => {
                      const current = i === level;
                      return (
                        <button
                          key={d}
                          role="radio"
                          aria-checked={current}
                          onClick={() => onSetDifficulty(d)}
                          className={`flex min-h-11 flex-col items-center gap-1 rounded-lg border-2 px-1 py-2 text-center text-xs font-bold transition ${
                            current ? "border-ink bg-sun shadow-[0_4px_0_#07050d]" : "border-ink/20 bg-inset text-muted hover:border-ink"
                          }`}
                        >
                          <span className="flex" aria-hidden>
                            {Array.from({ length: i + 1 }, (_, k) => (
                              <Star key={k} size={12} className={current ? "fill-ink" : ""} />
                            ))}
                          </span>
                          {d}
                        </button>
                      );
                    })}
                  </div>

                  <h2 id="count-label" className="mt-4 font-display text-lg font-extrabold">
                    Personnages dans la manche
                  </h2>
                  <div role="radiogroup" aria-labelledby="count-label" className="mt-2 flex flex-wrap gap-2">
                    {counts.map((n) => (
                      <button
                        key={n}
                        role="radio"
                        aria-checked={n === characterCount}
                        onClick={() => onSetCount(n)}
                        className={`size-11 rounded-lg border-2 font-display text-xl font-bold transition ${
                          n === characterCount ? "border-ink bg-primary text-white shadow-[0_4px_0_#07050d]" : "border-ink/20 bg-inset hover:border-ink"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={onStart}
                    className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-ink bg-primary px-6 py-3 font-display text-xl font-bold text-white shadow-[0_6px_0_#07050d] transition active:translate-y-1 active:shadow-[0_2px_0_#07050d]"
                  >
                    <Play size={22} className="fill-white" aria-hidden />
                    Lancer la manche
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <button onClick={onStartTutorial} className={`${MODE_BUTTON} border-sun/60 bg-surface/90 text-ink`}>
          <GraduationCap className="size-10 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block font-display text-xl font-extrabold">Tutoriel</span>
            <span className="block text-sm font-semibold text-muted">Trois énigmes guidées pour apprendre à enquêter.</span>
          </span>
        </button>
      </nav>
    </motion.main>
  );
}
