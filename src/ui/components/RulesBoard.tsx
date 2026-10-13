import { Crosshair, MessageCircleQuestion, Scale, ScrollText, Users } from "lucide-react";
import { motion } from "motion/react";
import { renderRule, type Rule } from "../../domain/rules/rule";
import { motionTokens } from "../tokens/motion";

const icons = {
  truthCount: Scale,
  alignmentTruth: Users,
  culpritAlignment: Crosshair,
  culpritTruth: MessageCircleQuestion,
} as const;

/** Always visible above the cards: rules must be consultable at any time. */
export function RulesBoard({ rules }: { rules: Rule[] }) {
  return (
    <section aria-labelledby="rules-title" className="rounded-card border-[3px] border-ink bg-sun/90 p-4 shadow-[0_6px_0_#1d1a4a]">
      <h2 id="rules-title" className="flex items-center gap-2 font-display text-xl font-extrabold">
        <ScrollText size={22} aria-hidden />
        Règles de la manche
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule, i) => {
          const Icon = icons[rule.type];
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...motionTokens.spring.soft, delay: i * motionTokens.stagger }}
              className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 text-base font-bold"
            >
              <Icon size={22} className="shrink-0 text-primary" aria-hidden />
              {renderRule(rule)}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
