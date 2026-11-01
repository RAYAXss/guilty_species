import type { Character, CharacterAlignment } from "../characters/types";
import { findCharacter, type LogicalPredicate } from "./predicate";

export interface RenderContext {
  /** When the speaker talks about themselves ("mes voisins"). */
  speakerId?: string;
  /** More than one culprit is possible: "Au moins un coupable…" instead of "Le coupable…". */
  multiCulprit?: boolean;
}

/**
 * Alignment words (pacifiste, belliqueux, vengeur) stay on the cards and rules:
 * characters never say them. They describe the culprit's temperament instead.
 */
const TRAIT: Record<CharacterAlignment, string> = {
  pacifiste: "d'un naturel paisible",
  belliqueux: "d'un tempérament guerrier",
  vengeur: "animé par la vengeance",
};

/** Builds the player-facing French text from the predicate (never the reverse). */
export function renderPredicate(p: LogicalPredicate, characters: readonly Character[], speakerId?: string): string {
  const name = (id: string) => findCharacter(characters, id).name;
  const de = (n: string) => /^[aeiouyàâéèêëïîôùûüæœh]/i.test(n) ? `d'${n}` : `de ${n}`;
  switch (p.type) {
    case "characterTruth":
      return p.expected ? `${name(p.characterId)} dit la vérité` : `${name(p.characterId)} ment`;
    case "culpritIs":
      if (multi) return p.expected ? `${name(p.characterId)} est coupable` : `${name(p.characterId)} n'est pas coupable`;
      return p.expected ? `Le coupable est ${name(p.characterId)}` : `Le coupable n'est pas ${name(p.characterId)}`;
    case "culpritAlignment":
      return p.expected ? `Le coupable est ${p.alignment}` : `Le coupable n'est pas ${p.alignment}`;
    case "culpritSpecies":
      return p.expected ? `Le coupable est de l'espèce ${p.species}` : `Le coupable n'est pas de l'espèce ${p.species}`;
    case "culpritNeighborOf": {
      const own = p.characterId === speakerId;
      const subject = own ? "un de mes voisins" : `un voisin ${de(name(p.characterId))}`;
      return p.expected ? `Le coupable est ${subject}` : `Le coupable n'est pas ${subject}`;
    }
    case "not":
      return `Il est faux que : ${renderPredicate(p.operand, characters, speakerId)}`;
    case "and":
      return joinOperands(p.operands, characters, ", et ", speakerId);
    case "or":
      return joinOperands(p.operands, characters, ", ou ", speakerId);
  }
}

export function renderStatement(p: LogicalPredicate, characters: readonly Character[], speakerId?: string): string {
  return `${renderPredicate(p, characters, speakerId)}.`;
}

/** Lowercases the generic openers ("Le coupable...") of operands that follow another clause; names stay capitalized. */
function joinOperands(operands: LogicalPredicate[], characters: readonly Character[], sep: string, speakerId?: string): string {
  return operands
    .map((o, i) => {
      const text = renderPredicate(o, characters, speakerId);
      return i === 0 ? text : text.replace(/^(Le coupable|Il est faux)/, (m) => m.toLowerCase());
    })
    .join(sep);
}
