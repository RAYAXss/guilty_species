import type { Character } from "../characters/types";
import { findCharacter, type LogicalPredicate } from "./predicate";

/** Builds the player-facing French text from the predicate (never the reverse). */
export function renderPredicate(p: LogicalPredicate, characters: readonly Character[]): string {
  const name = (id: string) => findCharacter(characters, id).name;
  switch (p.type) {
    case "characterTruth":
      return p.expected ? `${name(p.characterId)} dit la vérité` : `${name(p.characterId)} ment`;
    case "culpritIs":
      return p.expected ? `Le coupable est ${name(p.characterId)}` : `Le coupable n'est pas ${name(p.characterId)}`;
    case "culpritAlignment":
      return p.expected ? `Le coupable est ${p.alignment}` : `Le coupable n'est pas ${p.alignment}`;
    case "culpritSpecies":
      return p.expected ? `Le coupable est de l'espèce ${p.species}` : `Le coupable n'est pas de l'espèce ${p.species}`;
    case "not":
      return `Il est faux que : ${renderPredicate(p.operand, characters)}`;
    case "and":
      return p.operands.map((o) => renderPredicate(o, characters)).join(", et ");
    case "or":
      return p.operands.map((o) => renderPredicate(o, characters)).join(", ou ");
  }
}

export function renderStatement(p: LogicalPredicate, characters: readonly Character[]): string {
  return `${renderPredicate(p, characters)}.`;
}
