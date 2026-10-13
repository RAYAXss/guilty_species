import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Ban, Check, Quote } from "lucide-react";
import type { Character } from "../../domain/characters/types";
import { alignmentStyle } from "../tokens/alignment";
import { motionTokens } from "../tokens/motion";
import { AlignmentBadge } from "./AlignmentBadge";
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
      <motion.button
        type="button"
        disabled={innocent}
        tabIndex={preview ? -1 : undefined}
        aria-hidden={preview || undefined}
        aria-pressed={preview ? undefined : selected}
        aria-label={preview ? undefined : `${character.name}, ${character.species}, ${align.label}${innocent ? ", innocent" : ""}`}
        onClick={() => onSelect?.(character.id)}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        initial="rest"
        animate="rest"
        whileHover={canPop ? "hover" : "rest"}
        whileFocus={canPop ? "hover" : "rest"}
        whileTap={canPop && !preview ? { scale: 0.97 } : undefined}
        style={canPop ? { rotateX, rotateY, transformPerspective: 800 } : undefined}
        className={`relative flex h-full w-full cursor-pointer flex-col rounded-card border-[3px] bg-surface p-2.5 text-left transition-colors disabled:cursor-default ${
          selected ? "border-primary shadow-[0_8px_0_#2358e8]" : "border-ink/10 shadow-[0_6px_0_rgba(29,26,74,0.14)]"
        }`}
      >
        {/* Portrait window */}
        <span className="relative block h-44">
          <span
            className="absolute inset-0 block overflow-hidden"
            style={{ borderRadius: "var(--radius-window)", background: `linear-gradient(165deg, ${align.soft}, #ffffff 130%)` }}
          >
            <span className="absolute -right-6 -top-8 block size-28 rounded-full opacity-25" style={{ background: align.solid }} />
            <span className="absolute -bottom-10 -left-8 block size-24 rounded-full opacity-15" style={{ background: align.solid }} />
          </span>
          <motion.span
            className="absolute inset-0 flex items-end justify-center"
            variants={{ rest: { clipPath: FRAME }, hover: { clipPath: POPPED } }}
            transition={motionTokens.spring.snappy}
            style={{ clipPath: FRAME }}
          >
            <motion.span
              className={`block w-[78%] origin-bottom ${innocent ? "grayscale opacity-60" : ""}`}
              variants={{
                rest: { y: 0, scale: 1, filter: "drop-shadow(0 0 0 rgba(29,26,74,0))" },
                hover: { y: -10, scale: 1.45, filter: "drop-shadow(0 10px 8px rgba(29,26,74,0.28))" },
              }}
              transition={motionTokens.spring.lively}
            >
              <Portrait species={character.species} alignment={character.alignment} className="block h-auto w-full" />
            </motion.span>
          </motion.span>

          {selected && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={motionTokens.spring.lively}
              className="absolute -right-2 -top-2 grid size-8 place-items-center rounded-full border-2 border-white bg-primary text-white"
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
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-lg border-[3px] border-danger bg-white/90 px-2 py-0.5 font-display text-lg font-extrabold text-danger"
            >
              <Ban size={18} strokeWidth={3} aria-hidden />
              Innocent
            </motion.span>
          )}
        </span>

        <span className="mb-3 mt-3 block px-1">
          <span className="block font-display text-2xl font-extrabold leading-none">{character.name}</span>
          <span className="mt-1 block text-[0.95rem] font-semibold capitalize text-muted">{character.species}</span>
          <span className="mt-2 block">
            <AlignmentBadge alignment={character.alignment} />
          </span>
        </span>

        <span className="mt-auto flex gap-2 rounded-2xl bg-bg p-3 text-[0.95rem] font-semibold leading-snug">
          <Quote size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden />
          <span>{statement}</span>
        </span>
      </motion.button>
    </motion.li>
  );
}
