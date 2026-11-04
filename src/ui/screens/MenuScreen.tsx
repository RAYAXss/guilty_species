import { motion } from "motion/react";
import { Frown, Map as MapIcon, PartyPopper, Play, Star } from "lucide-react";
import type { Difficulty } from "../../domain/puzzle/types";
import { CHARACTER_CATALOG } from "../../domain/characters/catalog";
import { DIFFICULTY_ORDER, type GameState } from "../../application/game/session";
import { characterRange } from "../../domain/generator/difficulty";
import { CharacterCard } from "../components/CharacterCard";
import { motionTokens } from "../tokens/motion";
import { portraitSrc } from "../tokens/portrait";

interface Props {
  state: GameState;
  onSetCount: (n: number) => void;
  onSetDifficulty: (d: Difficulty) => void;
  onStart: () => void;
  onOpenCampaign: () => void;
}

const HERO = [
  { id: "elara", say: "Varek ment, j'en suis sûre.", tilt: -6 },
  { id: "gorak", say: "Un de mes voisins est coupable.", tilt: 0 },
  { id: "varek", say: "Gorak dit la vérité.", tilt: 6 },
].map((h) => ({ ...h, character: CHARACTER_CATALOG.find((c) => c.id === h.id)! }));

const BG_CARDS = [
  { id: "aldric", x: "3%", y: "8%", rotate: -18, scale: 0.7 },
  { id: "mira", x: "88%", y: "5%", rotate: 14, scale: 0.6 },
  { id: "brumm", x: "7%", y: "55%", rotate: 22, scale: 0.55 },
  { id: "ondine", x: "85%", y: "45%", rotate: -12, scale: 0.65 },
  { id: "karn", x: "92%", y: "78%", rotate: 8, scale: 0.5 },
  { id: "neris", x: "2%", y: "82%", rotate: -25, scale: 0.6 },
  { id: "pip", x: "45%", y: "90%", rotate: 5, scale: 0.55 },
  { id: "sombrelame", x: "70%", y: "88%", rotate: -10, scale: 0.5 },
].map((c) => ({ ...c, character: CHARACTER_CATALOG.find((ch) => ch.id === c.id)! }));

export function MenuScreen({ state, onSetCount, onSetDifficulty, onStart, onOpenCampaign }: Props) {
  const { difficulty, characterCount, lastResult } = state;
  const campaignStars = Object.values(state.progress).reduce((a, b) => a + b, 0);
  const level = DIFFICULTY_ORDER.indexOf(difficulty);
  const { min, max } = characterRange(difficulty);
  const counts = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <motion.main
      className="relative mx-auto flex min-h-dvh max-w-5xl flex-col items-center gap-5 px-3 pb-8 pt-6 sm:gap-8 sm:px-4 sm:pb-10 sm:pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.duration.normal }}
    >
      {/* Scattered portrait cards in the background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden opacity-[0.08]">
        {BG_CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            className="absolute w-28 sm:w-36"
            style={{ left: card.x, top: card.y }}
            initial={{ opacity: 0, scale: 0.3, rotate: card.rotate * 2 }}
            animate={{ opacity: 1, scale: card.scale, rotate: card.rotate }}
            transition={{ delay: 0.15 * i, duration: 0.8, type: "spring", stiffness: 80, damping: 14 }}
          >
            <div className="overflow-hidden rounded-2xl border-4 border-ink bg-surface shadow-xl">
              <img src={portraitSrc(card.character)} alt="" className="aspect-[3/4] w-full object-cover" />
            </div>
          </motion.div>
        ))}
      </div>

      <header className="relative text-center">
        <h1 className="font-display text-4xl font-extrabold leading-[0.95] sm:text-7xl">Fantasy Deduction</h1>
        <p className="mx-auto mt-2 max-w-md text-base font-semibold sm:mt-3 sm:text-lg text-muted">
          Chaque créature affirme quelque chose. La règle dit combien disent vrai. Un seul suspect tient jusqu'au bout.
        </p>
      </header>

      <div
        aria-hidden
        className="grid w-full max-w-2xl auto-rows-fr grid-cols-2 gap-3 pt-6 sm:grid-cols-3 sm:gap-6 sm:pt-10 [&>*:last-child]:col-span-2 [&>*:last-child]:mx-auto [&>*:last-child]:w-[calc(50%-0.375rem)] sm:[&>*:last-child]:col-span-1 sm:[&>*:last-child]:mx-0 sm:[&>*:last-child]:w-auto"
      >
        {HERO.map((h, i) => (
          <div key={h.id} className="h-full" style={{ rotate: `${h.tilt}deg` }}>
            <ul className="h-full">
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
          className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-lg font-bold ${
            lastResult === "won" ? "border-success bg-pacifiste-soft text-success" : "border-danger bg-belliqueux-soft text-danger"
          }`}
        >
          {lastResult === "won" ? <PartyPopper size={22} aria-hidden /> : <Frown size={22} aria-hidden />}
          {lastResult === "won"
            ? `Coupable démasqué ! Niveau suivant : ${difficulty}.`
            : `Manche perdue. Tu retentes au niveau ${difficulty}.`}
        </motion.p>
      )}

      <button
        onClick={onOpenCampaign}
        className="relative flex w-full max-w-2xl items-center gap-3 rounded-card border-2 border-sun bg-primary p-4 text-left text-white shadow-[0_6px_0_#07050d] transition active:translate-y-1 active:shadow-[0_2px_0_#07050d] sm:gap-4 sm:p-5"
      >
        <MapIcon className="size-10 shrink-0 sm:size-12" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-display text-xl font-extrabold sm:text-2xl">Campagne</span>
          <span className="block text-sm font-semibold text-white/85 sm:text-base">
            Le Cœur de Fantolia a été volé. Suis la piste à travers les six régions.
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 font-bold" aria-label={`${campaignStars} étoiles`}>
          <Star size={18} className="fill-sun text-sun" aria-hidden />
          {campaignStars}
        </span>
      </button>

      <section className="relative w-full max-w-2xl rounded-card border-2 border-sun bg-surface text-ink p-4 shadow-[0_6px_0_#07050d] sm:p-5">
        <h2 className="font-display text-2xl font-extrabold">Jeu libre</h2>
        <p className="text-sm font-semibold text-muted">Une nouvelle énigme à chaque manche.</p>
        <h2 id="level-label" className="mt-4 font-display text-xl font-extrabold">
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
                className={`flex flex-col items-center gap-1 rounded-lg border-2 min-h-11 px-1 py-2 text-center text-xs font-bold transition sm:text-base ${
                  current ? "border-ink bg-sun shadow-[0_4px_0_#07050d]" : "border-ink/20 bg-inset text-muted hover:border-ink"
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
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-ink bg-primary px-6 py-3 font-display text-xl sm:mt-6 sm:py-4 sm:text-2xl font-bold text-white shadow-[0_6px_0_#07050d] transition active:translate-y-1 active:shadow-[0_2px_0_#07050d]"
        >
          <Play size={24} className="fill-white" aria-hidden />
          Lancer la manche
        </button>
      </section>
    </motion.main>
  );
}
