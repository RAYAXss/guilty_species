import type { Character, CharacterAlignment } from "../characters/types";
import type { Solution } from "../puzzle/types";

/** Global constraints known by the player. Data, not special-case code. */
export type Rule =
  | { type: "truthCount"; count: number }
  | { type: "alignmentTruth"; alignment: CharacterAlignment; quantifier: "all" | "atLeastOne"; truthful: boolean }
  | { type: "culpritAlignment"; alignment: CharacterAlignment }
  | { type: "culpritTruth"; truthful: boolean };

export function evaluateRule(rule: Rule, characters: readonly Character[], world: Solution): boolean {
  const tellsTruth = (id: string) => world.assignments[id] === true;
  switch (rule.type) {
    case "truthCount":
      return characters.filter((c) => tellsTruth(c.id)).length === rule.count;
    case "alignmentTruth": {
      const group = characters.filter((c) => c.alignment === rule.alignment);
      const matches = (c: Character) => tellsTruth(c.id) === rule.truthful;
      return rule.quantifier === "all" ? group.every(matches) : group.some(matches);
    }
    case "culpritAlignment":
      return characters.find((c) => c.id === world.culpritId)?.alignment === rule.alignment;
    case "culpritTruth":
      return tellsTruth(world.culpritId) === rule.truthful;
  }
}

export function renderRule(rule: Rule): string {
  switch (rule.type) {
    case "truthCount":
      return rule.count === 1 ? "Exactement 1 personnage dit la vérité." : `Exactement ${rule.count} personnages disent la vérité.`;
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

function plural(word: string): string {
  return /[sx]$/.test(word) ? word : `${word}s`;
}
