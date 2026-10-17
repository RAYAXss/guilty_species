import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Ban, Check, MapPin, Quote } from "lucide-react";
import type { Character } from "../../domain/characters/types";
import { alignmentStyle } from "../tokens/alignment";
import { speciesColors } from "../tokens/species";
import { motionTokens } from "../tokens/motion";
import { AlignmentBadge } from "./AlignmentBadge";
import { REGION_NAMES } from "../../domain/world/fantolia";
import { portraitSrc } from "../tokens/portrait";
import { Portrait } from "./Portrait";

export type CardState = "idle" | "selected" | "innocent";

interface Props {
  character: Character;
  statement: string;
  state?: CardState;
  index?: number;
  /** Decorative card (menu hero): not focusable, not clickable. */
  preview?: boolean;
  onSelect?: (id: string) => void;
}

const FRAME = "inset(0% 0% 0% 0% round 16px)";
// Negative insets let the character leave the frame through the top and the sides.
const POPPED = "inset(-46% -12% 0% -12% round 16px)";

export function CharacterCard({ character, statement, state = "idle", index = 0, preview = false, onSelect }: Props) {
  const reduce = useReducedMotion();
  const innocent = state === "innocent";
  const selected = state === "selected";
  const align = alignmentStyle[character.alignment];
  const colors = speciesColors(character.species);
  // A div for decorative previews: never focusable, so no aria-hidden/focus conflict.
  const Tag = (preview ? motion.div : motion.button) as typeof motion.button;
  const canPop = !innocent && !reduce;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), motionTokens.spring.soft);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), motionTokens.spring.soft);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!canPop) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.li
      className="relative h-full list-none"
      style={{ zIndex: selected ? 10 : 0 }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.94 }}
      animate={{ opacity: 1, y: selected && !reduce ? -8 : 0, scale: 1 }}
      transition={{ ...motionTokens.spring.soft, delay: index * motionTokens.stagger }}
    >
      <Tag
        type="button"
        disabled={innocent}
        aria-pressed={preview ? undefined : selected}
        aria-label={preview ? undefined : `${character.name}, ${character.species}, ${align.label}, ${REGION_NAMES[character.region]}${innocent ? ", innocent" : ""}`}
        onClick={() => onSelect?.(character.id)}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        initial="rest"
        animate={canPop && selected ? "hover" : "rest"}
        whileHover={canPop ? "hover" : "rest"}
        whileFocus={canPop ? "hover" : "rest"}
        whileTap={canPop && !preview ? { scale: 0.97 } : undefined}
        style={{
          ...(canPop ? { rotateX, rotateY, transformPerspective: 800 } : {}),
          ...(selected ? {} : { borderColor: `${colors.solid}66` }),
        }}
        className={`group relative flex h-full w-full cursor-pointer flex-col rounded-card border-2 bg-surface text-ink p-1.5 text-left sm:p-2.5 transition-colors disabled:cursor-default ${
          selected ? "border-sun shadow-[0_0_0_2px_#d1a03a,0_8px_18px_rgba(0,0,0,0.55)]" : "border-ink/25 shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
        }`}
      >
        {/* Portrait window */}
        <span className="relative block h-28 sm:h-44">
          <span
            className="absolute inset-0 block overflow-hidden"
            style={{ borderRadius: "var(--radius-window)", background: `linear-gradient(165deg, ${colors.soft}, #d9c79c 130%)` }}
          >
            <span className="absolute -right-6 -top-8 block size-20 rounded-full opacity-25 sm:size-28" style={{ background: colors.solid }} />
            <span className="absolute -bottom-10 -left-8 block size-24 rounded-full opacity-15" style={{ background: colors.solid }} />
          </span>
          <motion.span
            className="absolute inset-0 flex items-end justify-center"
            variants={{ rest: { clipPath: FRAME }, hover: { clipPath: POPPED } }}
            transition={motionTokens.spring.snappy}
            style={{ clipPath: FRAME }}
          >
            <motion.span
              className={`block w-[78%] origin-bottom transition-[filter] duration-200 ${
                innocent ? "grayscale opacity-60" : "group-hover:drop-shadow-[0_10px_8px_rgba(29,26,74,0.28)] group-focus-visible:drop-shadow-[0_10px_8px_rgba(29,26,74,0.28)]"
              }`}
              variants={{
                rest: { y: 0, scale: 1 },
                hover: { y: -10, scale: 1.45 },
              }}
              transition={motionTokens.spring.lively}
            >
              <Portrait
                species={character.species}
                alignment={character.alignment}
                name={character.name}
                src={portraitSrc(character)}
                className="block h-auto w-full"
              />
            </motion.span>
          </motion.span>

          {selected && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={motionTokens.spring.lively}
              className="absolute -right-1.5 -top-1.5 grid size-7 sm:-right-2 sm:-top-2 sm:size-8 place-items-center rounded-full border-2 border-surface bg-primary text-white"
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

        <span className="mb-2 mt-2 block px-0.5 sm:mb-3 sm:mt-3 sm:px-1">
          <span className="block truncate font-display text-base font-bold leading-none tracking-wide sm:text-xl">{character.name}</span>
          <span className="mt-0.5 block text-xs font-semibold capitalize text-muted sm:mt-1 sm:text-[0.95rem]">{character.species}</span>
          <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-muted sm:text-sm">
            <MapPin className="size-3.5 shrink-0 sm:size-4" aria-hidden />
            <span className="truncate">{REGION_NAMES[character.region]}</span>
          </span>
          <span className="mt-1.5 block sm:mt-2">
            <AlignmentBadge alignment={character.alignment} />
          </span>
        </span>

        <span className="mt-auto flex gap-1.5 rounded-md bg-inset p-2 text-[0.8rem] font-semibold leading-snug sm:gap-2 sm:rounded-lg sm:p-3 sm:text-[0.95rem]">
          <Quote className="mt-0.5 size-3.5 shrink-0 text-primary sm:size-4" aria-hidden />
          <span>{statement}</span>
        </span>
      </Tag>
    </motion.li>
  );
}
