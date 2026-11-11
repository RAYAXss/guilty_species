import type { Character, CharacterAlignment, Stat } from "../characters/types";
import { findCharacter, type LogicalPredicate } from "./predicate";

export interface RenderContext {
  /** When the speaker talks about themselves ("plus fort que moi"). */
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

export const STAT_LABEL: Record<Stat, string> = { strength: "force", intelligence: "intelligence" };
const STAT_COMPARATIVE: Record<Stat, string> = { strength: "plus fort", intelligence: "plus intelligent" };

function normalizeCtx(ctx?: RenderContext | string): { speakerId?: string; multi: boolean } {
  if (typeof ctx === "string") return { speakerId: ctx, multi: false };
  return { speakerId: ctx?.speakerId, multi: ctx?.multiCulprit === true };
}

/** Builds the player-facing French text from the predicate (never the reverse). */
export function renderPredicate(p: LogicalPredicate, characters: readonly Character[], ctx?: RenderContext | string): string {
  const { speakerId, multi } = normalizeCtx(ctx);
  const name = (id: string) => findCharacter(characters, id).name;
  switch (p.type) {
    case "characterTruth":
      return p.expected ? `${name(p.characterId)} dit la vérité` : `${name(p.characterId)} ment`;
    case "culpritIs":
      // The speaker accuses or clears themselves: "Je suis coupable", never "Le coupable est Gorak" in Gorak's mouth.
      if (p.characterId === speakerId) return p.expected ? "Je suis coupable" : "Je ne suis pas coupable";
      if (multi) return p.expected ? `${name(p.characterId)} est coupable` : `${name(p.characterId)} n'est pas coupable`;
      return p.expected ? `Le coupable est ${name(p.characterId)}` : `Le coupable n'est pas ${name(p.characterId)}`;
    case "culpritAlignment":
      if (multi) return p.expected ? `Au moins un coupable est ${TRAIT[p.alignment]}` : `Aucun coupable n'est ${TRAIT[p.alignment]}`;
      return p.expected ? `Le coupable est ${TRAIT[p.alignment]}` : `Le coupable n'est pas ${TRAIT[p.alignment]}`;
    case "culpritSpecies":
      if (multi) return p.expected ? `Au moins un coupable est de l'espèce ${p.species}` : `Aucun coupable n'est de l'espèce ${p.species}`;
      return p.expected ? `Le coupable est de l'espèce ${p.species}` : `Le coupable n'est pas de l'espèce ${p.species}`;
    case "culpritStatAtLeast": {
      const amount = p.expected ? `${p.value} ou plus` : `moins de ${p.value}`;
      const label = STAT_LABEL[p.stat];
      if (multi) return p.expected ? `Au moins un coupable a ${amount} en ${label}` : `Aucun coupable n'a ${p.value} ou plus en ${label}`;
      return `Le coupable a ${amount} en ${label}`;
    }
    case "culpritStatAbove": {
      const who = p.characterId === speakerId ? "moi" : name(p.characterId);
      const than = `${STAT_COMPARATIVE[p.stat]} ${/^[aeiouyàâéèêëïîôùûüh]/i.test(who) ? `qu'${who}` : `que ${who}`}`;
      if (multi) return p.expected ? `Au moins un coupable est ${than}` : `Aucun coupable n'est ${than}`;
      return p.expected ? `Le coupable est ${than}` : `Le coupable n'est pas ${than}`;
    }
    case "not":
      return `Il est faux que : ${renderPredicate(p.operand, characters, ctx)}`;
    case "and":
      return joinOperands(p.operands, characters, ", et ", ctx);
    case "or":
      return joinOperands(p.operands, characters, ", ou ", ctx);
  }
}

export function renderStatement(p: LogicalPredicate, characters: readonly Character[], ctx?: RenderContext | string): string {
  return `${renderPredicate(p, characters, ctx)}.`;
}

/** Lowercases the generic openers (and "Je") of operands that follow another clause; names stay capitalized. */
function joinOperands(operands: LogicalPredicate[], characters: readonly Character[], sep: string, ctx?: RenderContext | string): string {
  return operands
    .map((o, i) => {
      const text = renderPredicate(o, characters, ctx);
      return i === 0 ? text : text.replace(/^(Le coupable|Il est faux|Au moins un|Aucun|Je )/, (m) => m.toLowerCase());
    })
    .join(sep);
}
