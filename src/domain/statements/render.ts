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
export function renderPredicate(p: LogicalPredicate, characters: readonly Character[], ctx: RenderContext = {}): string {
  const name = (id: string) => findCharacter(characters, id).name;
  const multi = ctx.multiCulprit === true;
  switch (p.type) {
    case "characterTruth":
      return p.expected ? `${name(p.characterId)} dit la vérité` : `${name(p.characterId)} ment`;
    case "culpritIs":
      if (multi) return p.expected ? `${name(p.characterId)} est coupable` : `${name(p.characterId)} n'est pas coupable`;
      return p.expected ? `Le coupable est ${name(p.characterId)}` : `Le coupable n'est pas ${name(p.characterId)}`;
    case "culpritAlignment":
      if (multi) return p.expected ? `Au moins un coupable est ${TRAIT[p.alignment]}` : `Aucun coupable n'est ${TRAIT[p.alignment]}`;
      return p.expected ? `Le coupable est ${TRAIT[p.alignment]}` : `Le coupable n'est pas ${TRAIT[p.alignment]}`;
    case "culpritNeighborOf": {
      const self = p.characterId === ctx.speakerId;
      if (self) return p.expected ? "Un de mes voisins est coupable" : "Aucun de mes voisins n'est coupable";
      return p.expected ? `Un voisin de ${name(p.characterId)} est coupable` : `Aucun voisin de ${name(p.characterId)} n'est coupable`;
    }
    case "not":
      return `Il est faux que : ${renderPredicate(p.operand, characters, ctx)}`;
    case "and":
      return joinOperands(p.operands, characters, ctx, ", et ");
    case "or":
      return joinOperands(p.operands, characters, ctx, ", ou ");
  }
}

export function renderStatement(p: LogicalPredicate, characters: readonly Character[], ctx: RenderContext = {}): string {
  return `${renderPredicate(p, characters, ctx)}.`;
}

/** Lowercases the generic openers ("Le coupable...") of operands that follow another clause; names stay capitalized. */
function joinOperands(operands: LogicalPredicate[], characters: readonly Character[], ctx: RenderContext, sep: string): string {
  return operands
    .map((o, i) => {
      const text = renderPredicate(o, characters, ctx);
      return i === 0 ? text : text.replace(/^(Le coupable|Il est faux|Un de mes|Un voisin|Aucun|Au moins un)/, (m) => m.toLowerCase());
    })
    .join(sep);
}
