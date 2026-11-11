import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import type { TutorialLesson } from "../../domain/tutorial/tutorial";
import { motionTokens } from "../tokens/motion";

interface Props {
  lesson: TutorialLesson;
  step: number;
  onStep: (step: number) => void;
}

/** Guided reasoning for a tutorial lesson, one step at a time. */
export function TutorialCoach({ lesson, step, onStep }: Props) {
  const current = lesson.steps[step]!;
  const last = lesson.steps.length - 1;
  const nav = "inline-flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-ink/25 bg-inset hover:border-ink disabled:opacity-35";

  return (
    <section aria-labelledby="coach-title" className="rounded-card border-2 border-primary bg-surface p-3 text-ink shadow-[0_4px_0_#07050d]">
      <div className="flex items-center justify-between gap-2">
        <h2 id="coach-title" className="flex items-center gap-2 font-display text-base font-extrabold">
          <Lightbulb className="size-5 text-primary" aria-hidden />
          {lesson.title}
        </h2>
        <span className="text-sm font-bold tabular-nums text-muted">
          {step + 1}/{lesson.steps.length}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button onClick={() => onStep(step - 1)} disabled={step === 0} aria-label="Étape précédente" className={nav}>
          <ChevronLeft size={20} aria-hidden />
        </button>
        <motion.p
          key={step}
          aria-live="polite"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: motionTokens.duration.fast }}
          className="min-w-0 flex-1 text-[0.95rem] font-semibold leading-snug"
        >
          {current.text}
        </motion.p>
        <button onClick={() => onStep(step + 1)} disabled={step === last} aria-label="Étape suivante" className={nav}>
          <ChevronRight size={20} aria-hidden />
        </button>
      </div>
    </section>
  );
}
