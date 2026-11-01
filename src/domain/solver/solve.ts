import type { Puzzle, Solution } from "../puzzle/types";
import { evaluatePredicate, type LogicalPredicate } from "../statements/predicate";
import { culpritCountsOf, evaluateRule } from "../rules/rule";

export const MAX_SOLVABLE_CHARACTERS = 14;

const popcount = (n: number) => {
  let c = 0;
  for (let x = n; x; x &= x - 1) c++;
  return c;
};

const mentionsTruth = (p: LogicalPredicate): boolean => {
  switch (p.type) {
    case "characterTruth":
      return true;
    case "not":
      return mentionsTruth(p.operand);
    case "and":
    case "or":
      return p.operands.some(mentionsTruth);
    default:
      return false;
  }
};

/**
 * Exhaustive solver, independent from the generator. It only looks at the Puzzle
 * (what the player sees) and returns every consistent world.
 *
 * A world is consistent when:
 *  - the number of culprits is allowed (one, unless a culpritCount rule says otherwise);
 *  - each character tells the truth  <=>  all of their statements hold;
 *  - every global rule holds.
 *
 * `limit` stops the search early (uniqueness checks only need to know about a 2nd solution).
 */
export function solve(puzzle: Puzzle, limit = Infinity): Solution[] {
  const { characters, statements, rules } = puzzle;
  const n = characters.length;
  if (n > MAX_SOLVABLE_CHARACTERS) {
    throw new Error(`Solver supports at most ${MAX_SOLVABLE_CHARACTERS} characters`);
  }
  const allowedCounts = culpritCountsOf(rules);
  const culpritMasks: number[] = [];
  for (let m = 1; m < 1 << n; m++) if (allowedCounts.includes(popcount(m))) culpritMasks.push(m);

  // A character whose statements never mention anyone's truthfulness is fully decided by the culprits:
  // only the others ("free") need their truth value enumerated.
  const spoken = characters.map((c) => statements.filter((s) => s.characterId === c.id));
  const free = characters.map((_, i) => i).filter((i) => spoken[i]!.some((s) => mentionsTruth(s.predicate)));

  const solutions: Solution[] = [];
  for (const cm of culpritMasks) {
    const culpritIds = characters.filter((_, i) => (cm & (1 << i)) !== 0).map((c) => c.id);
    const assignments: Record<string, boolean> = {};
    // Fixed characters first: their statements do not read `assignments`.
    const base: Solution = { culpritIds, assignments };
    characters.forEach((c, i) => {
      if (!free.includes(i)) assignments[c.id] = spoken[i]!.every((s) => evaluatePredicate(s.predicate, characters, base));
    });

    for (let fm = 0; fm < 1 << free.length; fm++) {
      free.forEach((ci, k) => {
        assignments[characters[ci]!.id] = (fm & (1 << k)) !== 0;
      });
      const world: Solution = { culpritIds, assignments };
      const consistent = free.every(
        (ci) => spoken[ci]!.every((s) => evaluatePredicate(s.predicate, characters, world)) === assignments[characters[ci]!.id],
      );
      if (consistent && rules.every((r) => evaluateRule(r, characters, world))) {
        solutions.push({ culpritIds, assignments: { ...assignments } });
        if (solutions.length >= limit) return solutions;
      }
    }
  }
  return solutions;
}

export function hasUniqueSolution(puzzle: Puzzle): boolean {
  return solve(puzzle, 2).length === 1;
}

/** "Qui peut être coupable ?" */
export function possibleCulprits(puzzle: Puzzle): string[] {
  return [...new Set(solve(puzzle).flatMap((s) => s.culpritIds))];
}
