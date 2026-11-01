import type { Character, CharacterAlignment } from "../characters/types";
import type { Solution } from "../puzzle/types";

/** Global constraints known by the player. Data, not special-case code. */
export type Rule =
  | { type: "truthCount"; count: number }
  | { type: "liarCount"; count: number }
  /** "1 ou 2 personnages disent la vérité": the real count is one of `counts`. */
  | { type: "truthCountOneOf"; counts: number[] }
  | { type: "liarCountOneOf"; counts: number[] }
  /** Number of culprits. Without this rule, there is exactly one culprit. */
  | { type: "culpritCount"; counts: number[] }
  | { type: "alignmentTruth"; alignment: CharacterAlignment; quantifier: "all" | "atLeastOne"; truthful: boolean }
  | { type: "culpritAlignment"; alignment: CharacterAlignment }
  | { type: "culpritTruth"; truthful: boolean };

/** Allowed numbers of culprits (defaults to exactly one). */
export function culpritCountsOf(rules: readonly Rule[]): number[] {
  const rule = rules.find((r) => r.type === "culpritCount");
  return rule?.type === "culpritCount" ? [...rule.counts] : [1];
}

export function evaluateRule(rule: Rule, characters: readonly Character[], world: Solution): boolean {
  const tellsTruth = (id: string) => world.assignments[id] === true;
  const truthful = characters.filter((c) => tellsTruth(c.id)).length;
  const liars = characters.length - truthful;
  switch (rule.type) {
    case "truthCount":
      return truthful === rule.count;
    case "liarCount":
      return liars === rule.count;
    case "truthCountOneOf":
      return rule.counts.includes(truthful);
    case "liarCountOneOf":
      return rule.counts.includes(liars);
    case "culpritCount":
      return rule.counts.includes(world.culpritIds.length);
    case "alignmentTruth": {
      const group = characters.filter((c) => c.alignment === rule.alignment);
      const matches = (c: Character) => tellsTruth(c.id) === rule.truthful;
      return rule.quantifier === "all" ? group.every(matches) : group.some(matches);
    }
    case "culpritAlignment":
      return world.culpritIds.some((id) => characters.find((c) => c.id === id)?.alignment === rule.alignment);
    case "culpritTruth":
      return world.culpritIds.every((id) => tellsTruth(id) === rule.truthful);
  }
}

export function renderRule(rule: Rule): string {
  switch (rule.type) {
    case "truthCount":
      return rule.count === 1 ? "Exactement 1 personnage dit la vérité." : `Exactement ${rule.count} personnages disent la vérité.`;
    case "liarCount":
      return rule.count === 1 ? "Exactement 1 personnage ment." : `Exactement ${rule.count} personnages mentent.`;
    case "truthCountOneOf":
      return `${orList(rule.counts)} personnages disent la vérité.`;
    case "liarCountOneOf":
      return `${orList(rule.counts)} personnages mentent.`;
    case "culpritCount":
      return rule.counts.length === 1
        ? rule.counts[0] === 1
          ? "Il y a 1 coupable."
          : `Il y a ${rule.counts[0]} coupables.`
        : `Il y a ${orList(rule.counts)} coupables.`;
    case "alignmentTruth": {
      const verb = rule.truthful ? "disent la vérité" : "mentent";
      return rule.quantifier === "all"
        ? `Tous les ${plural(rule.alignment)} ${verb}.`
        : `Au moins un ${rule.alignment} ${rule.truthful ? "dit la vérité" : "ment"}.`;
    }
    case "culpritAlignment":
      return `Le coupable est ${rule.alignment}.`;
    case "culpritTruth":
      return rule.truthful ? "Le coupable dit la vérité." : "Le coupable ment.";
  }
}

/** [1, 2] -> "1 ou 2"; [1, 2, 3] -> "1, 2 ou 3". */
function orList(counts: readonly number[]): string {
  const sorted = [...counts].sort((a, b) => a - b).map(String);
  return sorted.length <= 1 ? (sorted[0] ?? "") : `${sorted.slice(0, -1).join(", ")} ou ${sorted[sorted.length - 1]}`;
}

function plural(word: string): string {
  return /[sx]$/.test(word) ? word : `${word}s`;
}
