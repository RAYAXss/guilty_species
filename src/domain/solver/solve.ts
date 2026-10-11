import type { Puzzle, Solution } from "../puzzle/types";
import { evaluatePredicate } from "../statements/predicate";
import { evaluateRule } from "../rules/rule";

export const MAX_SOLVABLE_CHARACTERS = 14;

/**
 * Exhaustive solver, independent from the generator. It only looks at the Puzzle
 * (what the player sees) and returns every consistent world.
 *
 * A world is consistent when:
 *  - each character tells the truth  <=>  all of their statements hold;
 *  - every global rule holds.
 */
export function solve(puzzle: Puzzle): Solution[] {
  const { characters, statements, rules } = puzzle;
  const n = characters.length;
  if (n > MAX_SOLVABLE_CHARACTERS) {
    throw new Error(`Solver supports at most ${MAX_SOLVABLE_CHARACTERS} characters`);
  }
  const solutions: Solution[] = [];

  for (let mask = 0; mask < 1 << n; mask++) {
    const assignments: Record<string, boolean> = {};
    characters.forEach((c, i) => {
      assignments[c.id] = (mask & (1 << i)) !== 0;
    });

    for (const culprit of characters) {
      const world: Solution = { culpritId: culprit.id, assignments };
      const statementsConsistent = characters.every((c) => {
        const allHold = statements
          .filter((s) => s.characterId === c.id)
          .every((s) => evaluatePredicate(s.predicate, characters, world));
        return allHold === assignments[c.id];
      });
      if (statementsConsistent && rules.every((r) => evaluateRule(r, characters, world))) {
        solutions.push({ culpritId: culprit.id, assignments: { ...assignments } });
      }
    }
  }
  return solutions;
}

export function hasUniqueSolution(puzzle: Puzzle): boolean {
  return solve(puzzle).length === 1;
}

/** "Qui peut être le coupable ?" */
export function possibleCulprits(puzzle: Puzzle): string[] {
  return [...new Set(solve(puzzle).map((s) => s.culpritId))];
}
