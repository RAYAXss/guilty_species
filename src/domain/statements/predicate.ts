import type { Character, CharacterAlignment } from "../characters/types";
import type { Solution } from "../puzzle/types";
import { neighborsOf } from "../world/fantolia";

/**
 * Logical meaning of a statement. Composable.
 * With several culprits, "culprit" predicates mean "at least one culprit" (and `expected: false` means "none").
 */
export type LogicalPredicate =
  | { type: "characterTruth"; characterId: string; expected: boolean }
  | { type: "culpritIs"; characterId: string; expected: boolean }
  | { type: "culpritAlignment"; alignment: CharacterAlignment; expected: boolean }
  /** A culprit lives in a region bordering the region of `characterId`. */
  | { type: "culpritNeighborOf"; characterId: string; expected: boolean }
  | { type: "not"; operand: LogicalPredicate }
  | { type: "and"; operands: LogicalPredicate[] }
  | { type: "or"; operands: LogicalPredicate[] };

export function findCharacter(characters: readonly Character[], id: string): Character {
  const found = characters.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown character: ${id}`);
  return found;
}

/** Pure evaluation of a predicate in a candidate world. */
export function evaluatePredicate(
  predicate: LogicalPredicate,
  characters: readonly Character[],
  world: Solution,
): boolean {
  switch (predicate.type) {
    case "characterTruth":
      return (world.assignments[predicate.characterId] === true) === predicate.expected;
    case "culpritIs":
      return world.culpritIds.includes(predicate.characterId) === predicate.expected;
    case "culpritAlignment":
      return (
        world.culpritIds.some((id) => findCharacter(characters, id).alignment === predicate.alignment) ===
        predicate.expected
      );
    case "culpritNeighborOf": {
      const neighbors = neighborsOf(characters, predicate.characterId);
      return world.culpritIds.some((id) => neighbors.some((n) => n.id === id)) === predicate.expected;
    }
    case "not":
      return !evaluatePredicate(predicate.operand, characters, world);
    case "and":
      return predicate.operands.every((p) => evaluatePredicate(p, characters, world));
    case "or":
      return predicate.operands.some((p) => evaluatePredicate(p, characters, world));
  }
}
