import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Ban, BicepsFlexed, Brain, Check, Quote } from "lucide-react";
import type { Character } from "../../domain/characters/types";
import { alignmentStyle } from "../tokens/alignment";
import { motionTokens } from "../tokens/motion";
import { AlignmentSymbol } from "./AlignmentBadge";
import { portraitSrc } from "../tokens/portrait";
import { Portrait } from "./Portrait";

export type CardState = "idle" | "selected" | "innocent";

interface Props {
  character: Character;
  /** Empty for a portrait-only card (menu fan). */
  statement: string;
  state?: CardState;
  index?: number;
  /** Decorative card (menu hero): not focusable, not clickable. */
  preview?: boolean;
  /** Tutorial: draws attention to this card. */
  highlight?: boolean;
  onSelect?: (id: string) => void;
}

function StatChip({ Icon, short, label, value }: { Icon: typeof Brain; short: string; label: string; value: number }) {
  return (
    <span className="flex items-center gap-1 rounded-md bg-inset px-1.5 py-0.5 text-xs font-extrabold sm:text-sm" title={`${label} : ${value}/10`}>
      <Icon className="size-3.5 text-primary sm:size-4" aria-hidden />
      <span aria-hidden className="text-muted">{short}</span>
      <span className="tabular-nums">{value}</span>
      <span className="sr-only">{`${label} ${value} sur 10`}</span>
    </span>
  );
}

export function CharacterCard({ character, statement, state = "idle", index = 0, preview = false, highlight = false, onSelect }: Props) {
  const reduce = useReducedMotion();
  const innocent = state === "innocent";
  const selected = state === "selected";
  const align = alignmentStyle[character.alignment];
  // A div for decorative previews: never focusable, so no aria-hidden/focus conflict.
  const Tag = (preview ? motion.div : motion.button) as typeof motion.button;
  // Mouse-only 3D tilt of the whole card; touch taps just select.
  const canTilt = !innocent && !reduce && !preview;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), motionTokens.spring.soft);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), motionTokens.spring.soft);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!canTilt || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const ring = selected
    ? "border-sun shadow-[0_0_0_3px_#d1a03a,0_0_26px_rgba(232,170,70,0.55),0_14px_24px_rgba(0,0,0,0.6)]"
    : highlight
      ? "border-primary shadow-[0_0_0_3px_#8f2d3c,0_8px_16px_rgba(0,0,0,0.5)]"
      : "border-[#b8975a] shadow-[0_5px_12px_rgba(0,0,0,0.5)]";

  // Selecting animates the whole card: it lifts out of the row with a short tilt, then settles.
  const lift = reduce
    ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
    : selected
      ? { opacity: 1, y: -10, scale: [1, 1.07, 1.04], rotate: [0, -2.5, 1.5, 0] }
      : { opacity: 1, y: highlight ? -6 : 0, scale: 1, rotate: 0 };

  return (
    <motion.li
      className="relative h-full list-none"
      style={{ zIndex: selected ? 10 : 0 }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.94 }}
      animate={lift}
      transition={{ ...motionTokens.spring.soft, delay: index * motionTokens.stagger, scale: { duration: 0.35 }, rotate: { duration: 0.45 } }}
    >
      <Tag
        type="button"
        disabled={innocent}
        aria-pressed={preview ? undefined : selected}
        aria-label={
          preview
            ? undefined
            : `${character.name}, ${character.species}, ${align.label}, force ${character.strength}, intelligence ${character.intelligence}${innocent ? ", innocent" : ""}`
        }
        onClick={() => onSelect?.(character.id)}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        whileTap={!innocent && !preview && !reduce ? { scale: 0.97 } : undefined}
        style={canTilt ? { rotateX, rotateY, transformPerspective: 800 } : undefined}
        className={`relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-card border-2 bg-surface text-left text-ink transition-[border-color,box-shadow] duration-200 disabled:cursor-default ${ring}`}
      >
        {/* The illustration carries its own scene: shown whole, square, edge to edge. */}
        <span className="relative block">
          <Portrait
            species={character.species}
            alignment={character.alignment}
            name={character.name}
            src={portraitSrc(character)}
            className={`block w-full transition duration-300 ${innocent ? "opacity-60 grayscale" : ""}`}
          />
          <AlignmentSymbol alignment={character.alignment} />
          {/* Name banner over the bottom of the art. */}
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-2 pb-1.5 pt-6 text-surface sm:px-3 sm:pb-2">
            <span className="truncate font-display text-base font-bold leading-none tracking-wide drop-shadow sm:text-xl">{character.name}</span>
            <span className="shrink-0 text-xs font-semibold capitalize text-surface/80 sm:text-sm">{character.species}</span>
          </span>

          {selected && (
            <motion.span
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={motionTokens.spring.lively}
              className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full border-2 border-surface bg-primary text-white sm:size-8"
            >
              <Check size={18} strokeWidth={3.5} aria-hidden />
              <span className="sr-only">Suspect choisi</span>
            </motion.span>
          )}
          {innocent && (
            <motion.span
              initial={{ scale: 2.2, opacity: 0, rotate: -24 }}
              animate={{ scale: 1, opacity: 1, rotate: -12 }}
              transition={motionTokens.spring.lively}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-lg border-2 border-danger bg-surface/90 px-1.5 py-0.5 font-display text-sm font-extrabold text-danger sm:px-2 sm:text-lg"
            >
              <Ban size={18} strokeWidth={3} aria-hidden />
              Innocent
            </motion.span>
          )}
        </span>

        <span className="flex flex-1 flex-col gap-1.5 p-1.5 sm:gap-2 sm:p-2.5">
          <span className="flex items-center justify-between gap-1">
            <StatChip Icon={BicepsFlexed} short="FOR" label="Force" value={character.strength} />
            <StatChip Icon={Brain} short="INT" label="Intelligence" value={character.intelligence} />
          </span>

          {statement && (
            <span className="mt-auto flex gap-1.5 rounded-md bg-inset p-2 text-[0.85rem] font-semibold leading-snug sm:gap-2 sm:rounded-lg sm:p-3 sm:text-[0.95rem]">
              <Quote className="mt-0.5 size-3.5 shrink-0 text-primary sm:size-4" aria-hidden />
              <span>{statement}</span>
            </span>
          )}
        </span>
      </Tag>
    </motion.li>
  );
}
