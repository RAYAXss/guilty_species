import { Crosshair, MessageCircleQuestion, Scale, ScrollText, UserSearch, Users } from "lucide-react";
import { motion } from "motion/react";
import { renderRule, type Rule } from "../../domain/rules/rule";
import { motionTokens } from "../tokens/motion";

const icons = {
  truthCount: Scale,
  liarCount: Scale,
  truthCountOneOf: Scale,
  liarCountOneOf: Scale,
  culpritCount: UserSearch,
  alignmentTruth: Users,
  culpritAlignment: Crosshair,
  culpritTruth: MessageCircleQuestion,
} as const;

/** Always visible above the cards: rules must be consultable at any time. */
export function RulesBoard({ rules }: { rules: Rule[] }) {
  return (
    <section aria-labelledby="rules-title" className="rounded-card border-2 border-sun bg-surface text-ink p-3 shadow-[0_4px_0_#07050d] sm:p-4 sm:shadow-[0_6px_0_#07050d]">
      <h2 id="rules-title" className="flex items-center gap-2 font-display text-base font-extrabold sm:text-xl">
        <ScrollText className="size-5 sm:size-[22px]" aria-hidden />
        Règles de la manche
      </h2>
      <ul className="mt-2 grid gap-1.5 sm:mt-3 sm:gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule, i) => {
          const Icon = icons[rule.type];
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...motionTokens.spring.soft, delay: i * motionTokens.stagger }}
              className="flex items-center gap-2 rounded-md bg-inset px-2.5 py-2 text-sm font-bold sm:gap-3 sm:rounded-lg sm:px-3 sm:py-2.5 sm:text-base"
            >
              <Icon className="size-5 shrink-0 text-primary sm:size-[22px]" aria-hidden />
              {renderRule(rule)}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
