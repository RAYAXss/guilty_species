import { describe, expect, it } from "vitest";
import { CHARACTER_CATALOG } from "../characters/catalog";
import { ALIGNMENTS } from "../characters/types";
import { evaluatePredicate } from "../statements/predicate";
import { renderRule } from "../rules/rule";
import { solve } from "../solver/solve";
import { DIFFICULTY_PARAMS } from "./difficulty";
import { generatePuzzle, PuzzleGenerationError } from "./generate";
import type { Difficulty } from "../puzzle/types";

const difficulties = Object.keys(DIFFICULTY_PARAMS) as Difficulty[];

describe("generatePuzzle", () => {
  it.each(difficulties)("produces unique, solver-verified puzzles (%s)", (difficulty) => {
    for (let seed = 1; seed <= 15; seed++) {
      const { puzzle, solution } = generatePuzzle({ difficulty, seed });
      const solutions = solve(puzzle);
      expect(solutions).toHaveLength(1);
      expect(solutions[0]).toEqual(solution);
      expect(puzzle.characters).toHaveLength(DIFFICULTY_PARAMS[difficulty].characterCount);
    }
  });

  it("is reproducible with the same seed", () => {
    expect(generatePuzzle({ difficulty: "normal", seed: 99 })).toEqual(generatePuzzle({ difficulty: "normal", seed: 99 }));
  });

  it("gives different puzzles for different seeds", () => {
    const a = generatePuzzle({ difficulty: "normal", seed: 1 }).puzzle;
    const b = generatePuzzle({ difficulty: "normal", seed: 2 }).puzzle;
    expect(a).not.toEqual(b);
  });

  it("never selects characters with weight 0", () => {
    const catalog = CHARACTER_CATALOG.map((c) => (c.id === "elara" ? { ...c, weight: 0 } : c));
    for (let seed = 1; seed <= 30; seed++) {
      const { puzzle } = generatePuzzle({ difficulty: "facile", seed, catalog });
      expect(puzzle.characters.map((c) => c.id)).not.toContain("elara");
    }
  });

  it("does not leak the culprit and keeps predicates authoritative", () => {
    const { puzzle, solution } = generatePuzzle({ difficulty: "difficile", seed: 5 });
    expect(puzzle).not.toHaveProperty("culpritId");
    // Every statement matches its speaker's truthfulness in the real world.
    for (const s of puzzle.statements) {
      const holds = evaluatePredicate(s.predicate, puzzle.characters, solution);
      if (solution.assignments[s.characterId]) expect(holds).toBe(true);
    }
  });

  it("never produces a composite clue over a single subject (tautology)", () => {
    for (let seed = 1; seed <= 60; seed++) {
      const { puzzle } = generatePuzzle({ difficulty: "expert", seed });
      for (const s of puzzle.statements) {
        const p = s.predicate;
        if (p.type === "or" || p.type === "and") {
          const [x, y] = p.operands as [typeof p, typeof p];
          expect(JSON.stringify({ ...x, expected: 0 })).not.toBe(JSON.stringify({ ...y, expected: 0 }));
        }
      }
    }
  });

  it("throws when no unique puzzle can be generated", () => {
    expect(() => generatePuzzle({ difficulty: "facile", seed: 1, maxAttempts: 0 })).toThrow(PuzzleGenerationError);
  });

  it("renders readable French rules", () => {
    expect(renderRule({ type: "alignmentTruth", alignment: "belliqueux", quantifier: "all", truthful: true })).toBe(
      "Tous les belliqueux disent la vérité.",
    );
    expect(ALIGNMENTS).toContain("vengeur");
  });
});
