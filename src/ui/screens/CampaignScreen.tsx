import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Lock, Play, Star, X } from "lucide-react";
import type { GameState } from "../../application/game/session";
import { CHAPTERS, LEVELS, isUnlocked, levelPuzzle } from "../../domain/campaign/campaign";
import type { Level } from "../../domain/campaign/types";
import { REGION_NAMES, type RegionId } from "../../domain/world/fantolia";
import { MAP_VIEWBOX, regionStyle } from "../tokens/fantolia";
import { motionTokens } from "../tokens/motion";

interface Props {
  state: GameState;
  onStartLevel: (levelId: string) => void;
  onBack: () => void;
}

const FOG = "#2a2340";
const FOG_INK = "#7a70a0";
/** Markers sit on the map's inner side of each name (below on the top row, above on the bottom row), so the trail never crosses a label. */
const markerOf = (region: RegionId): [number, number] => {
  const [x, y] = regionStyle[region].label;
  return [x, y < MAP_VIEWBOX.height / 2 ? y + 40 : y - 44];
};

export function CampaignScreen({ state, onStartLevel, onBack }: Props) {
  const { progress } = state;
  const levelsOf = (region: RegionId) => LEVELS.filter((l) => l.region === region);
  const reached = (region: RegionId) => isUnlocked(progress, levelsOf(region)[0]!.id);
  const latest = [...CHAPTERS].reverse().find((c) => reached(c.region)) ?? CHAPTERS[0]!;
  const [region, setRegion] = useState<RegionId>(latest.region);
  const [intro, setIntro] = useState<Level | null>(null);
  const chapter = CHAPTERS.find((c) => c.region === region)!;
  const totalStars = Object.values(progress).reduce((a, b) => a + b, 0);

  return (
    <motion.main
      className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-4 px-3 pb-8 pt-3 sm:gap-6 sm:px-4 sm:pt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.duration.normal }}
    >
      <header className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          aria-label="Retour au menu"
          className="inline-flex size-11 shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-sun/50 bg-surface font-bold text-ink hover:border-sun sm:size-auto sm:px-4 sm:py-2"
        >
          <ArrowLeft size={18} aria-hidden />
          <span className="hidden sm:inline">Menu</span>
        </button>
        <h1 className="min-w-0 truncate text-center font-display text-lg font-extrabold sm:text-3xl">Le Cœur de Fantolia</h1>
        <p className="flex shrink-0 items-center gap-1 rounded-lg border-2 border-sun/50 bg-surface px-2.5 py-1.5 font-bold text-ink" aria-label={`${totalStars} étoiles sur ${LEVELS.length * 3}`}>
          <Star size={18} className="fill-sun text-sun" aria-hidden />
          {totalStars}/{LEVELS.length * 3}
        </p>
      </header>

      <svg
        viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
        className="mx-auto block h-auto w-full max-w-[min(100%,72dvh)] rounded-card border-2 border-sun bg-[#1b1630]"
        role="group"
        aria-label="Carte du voyage à travers Fantolia"
      >
        {/* Layers: regions, then the trail, then labels and markers on top. */}
        {CHAPTERS.map((c) => {
          const open = reached(c.region);
          const current = c.region === region;
          const select = () => open && setRegion(c.region);
          return (
            <polygon
              key={c.region}
              points={regionStyle[c.region].points}
              fill={open ? regionStyle[c.region].fill : FOG}
              stroke={current ? "#d1a03a" : "#07050d"}
              strokeWidth={current ? 6 : 2}
              strokeLinejoin="round"
              role={open ? "button" : undefined}
              tabIndex={open ? 0 : undefined}
              aria-label={open ? `${REGION_NAMES[c.region]}, ${c.title}` : undefined}
              aria-pressed={open ? current : undefined}
              className={open ? "cursor-pointer outline-none focus-visible:stroke-[#d1a03a]" : undefined}
              onClick={select}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select();
                }
              }}
            />
          );
        })}

        {CHAPTERS.slice(1).map((c, i) => {
          const [x1, y1] = markerOf(CHAPTERS[i]!.region);
          const [x2, y2] = markerOf(c.region);
          const walked = reached(c.region);
          return (
            <line
              key={c.region}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={walked ? "#8f2d3c" : FOG_INK}
              strokeWidth={5}
              strokeDasharray={walked ? undefined : "2 12"}
              strokeLinecap="round"
              pointerEvents="none"
            />
          );
        })}

        {CHAPTERS.map((c, i) => {
          const [lx, ly] = regionStyle[c.region].label;
          const [mx, my] = markerOf(c.region);
          const open = reached(c.region);
          return (
            <g key={c.region} pointerEvents="none">
              <text
                x={lx}
                y={ly + 4}
                textAnchor="middle"
                className={`font-display text-[18px] font-bold ${open ? "fill-[#1f1830]" : "fill-[#7a70a0]"}`}
              >
                {open ? REGION_NAMES[c.region] : "Terre inconnue"}
              </text>
              <circle cx={mx} cy={my} r={20} fill={open ? "#8f2d3c" : FOG} stroke={open ? "#f2e6c9" : FOG_INK} strokeWidth={3} />
              <text x={mx} y={my + 8} textAnchor="middle" className={`font-display text-[22px] font-bold ${open ? "fill-[#f2e6c9]" : "fill-[#7a70a0]"}`}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      <motion.section
        key={region}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTokens.spring.soft}
        aria-labelledby="chapter-title"
        className="rounded-card border-2 border-sun bg-surface p-4 text-ink shadow-[0_6px_0_#07050d] sm:p-5"
      >
        <h2 id="chapter-title" className="font-display text-xl font-extrabold sm:text-2xl">
          {chapter.title}
        </h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted">{REGION_NAMES[region]}</p>
        <p className="mt-3 flex gap-2 text-base font-semibold leading-relaxed">
          <BookOpen className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
          <span>{chapter.lore}</span>
        </p>

        <ol className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
          {levelsOf(region).map((level, i) => {
            const open = isUnlocked(progress, level.id);
            const stars = progress[level.id] ?? 0;
            return (
              <li key={level.id}>
                <button
                  disabled={!open}
                  onClick={() => setIntro(level)}
                  aria-label={open ? `${level.title}${stars ? `, ${stars} étoiles` : ""}` : `${level.title}, verrouillé`}
                  className="group flex w-full flex-col items-center gap-1.5 rounded-lg border-2 border-ink/20 bg-inset p-2 text-center transition enabled:hover:border-ink disabled:cursor-not-allowed disabled:opacity-55 sm:p-3"
                >
                  <span
                    className={`grid size-12 place-items-center rounded-full border-2 font-display text-xl font-extrabold sm:size-14 ${
                      open ? "border-ink bg-primary text-white shadow-[0_4px_0_#07050d]" : "border-ink/30 bg-surface text-muted"
                    }`}
                  >
                    {open ? i + 1 : <Lock size={20} aria-hidden />}
                  </span>
                  <span className="flex gap-0.5" aria-hidden>
                    {[0, 1, 2].map((k) => (
                      <Star key={k} className={`size-4 ${k < stars ? "fill-sun text-sun" : "text-ink/25"}`} />
                    ))}
                  </span>
                  <span className="line-clamp-2 text-xs font-bold leading-tight sm:text-sm">{level.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </motion.section>

      {intro && <LevelIntro level={intro} onClose={() => setIntro(null)} onStart={() => onStartLevel(intro.id)} />}
    </motion.main>
  );
}

function LevelIntro({ level, onClose, onStart }: { level: Level; onClose: () => void; onStart: () => void }) {
  const startRef = useRef<HTMLButtonElement>(null);
  const puzzle = levelPuzzle(level.id);

  useEffect(() => {
    startRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionTokens.duration.fast }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
        aria-describedby="intro-story"
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={motionTokens.spring.soft}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-card border-2 border-sun bg-surface p-5 text-center text-ink shadow-[0_8px_0_#07050d] sm:p-6"
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-2 top-2 inline-flex size-11 items-center justify-center rounded-lg text-muted hover:text-ink"
        >
          <X size={20} aria-hidden />
        </button>
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{REGION_NAMES[level.region]}</p>
        <h2 id="intro-title" className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">
          {level.title}
        </h2>
        <p id="intro-story" className="mt-3 text-base font-semibold leading-relaxed sm:text-lg">
          {level.story}
        </p>
        <p className="mt-3 text-sm font-bold text-muted">
          {puzzle.characters.length} témoins · niveau {puzzle.difficulty}
        </p>
        <button
          ref={startRef}
          onClick={onStart}
          className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg border-2 border-ink bg-primary px-6 py-3 font-display text-xl font-bold text-white shadow-[0_5px_0_#07050d] transition active:translate-y-1 active:shadow-[0_1px_0_#07050d]"
        >
          <Play size={22} className="fill-white" aria-hidden />
          Enquêter
        </button>
      </motion.div>
    </motion.div>
  );
}
