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
      return joinOperands(p.operands, characters, ", et ");
    case "or":
      return joinOperands(p.operands, characters, ", ou ");
  }
}

export function renderStatement(p: LogicalPredicate, characters: readonly Character[]): string {
  return `${renderPredicate(p, characters)}.`;
}

/** Lowercases the generic openers ("Le coupable...") of operands that follow another clause; names stay capitalized. */
function joinOperands(operands: LogicalPredicate[], characters: readonly Character[], sep: string): string {
  return operands
    .map((o, i) => {
      const text = renderPredicate(o, characters);
      return i === 0 ? text : text.replace(/^(Le coupable|Il est faux)/, (m) => m.toLowerCase());
    })
    .join(sep);
}
