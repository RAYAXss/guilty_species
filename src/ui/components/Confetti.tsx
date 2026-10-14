import { motion, useReducedMotion } from "motion/react";

const COLORS = ["#ffc83d", "#2358e8", "#1f9f74", "#e2591f", "#9a3fd0"];
const COUNT = 28;

/** One-shot victory burst. Deterministic layout, skipped with reduced motion. */
export function Confetti() {
  if (useReducedMotion()) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      {Array.from({ length: COUNT }, (_, i) => {
        const angle = (i / COUNT) * Math.PI * 2;
        const dist = 120 + ((i * 37) % 90);
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-24 block h-3 w-2 rounded-sm"
            style={{ background: COLORS[i % COLORS.length] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist + 70, opacity: 0, rotate: 360 + i * 20 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
