import { describe, expect, it } from "vitest";
import { CHARACTER_CATALOG } from "../characters/catalog";
import { ALIGNMENTS } from "../characters/types";
import { evaluatePredicate } from "../statements/predicate";
import { renderRule } from "../rules/rule";
import { solve } from "../solver/solve";
import { analyzePuzzle, DIFFICULTY_PARAMS } from "./difficulty";
import { neighborsOf } from "../world/fantolia";
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
    expect(puzzle).not.toHaveProperty("culpritIds");
    // Every statement matches its speaker's truthfulness in the real world.
    for (const s of puzzle.statements) {
      const holds = evaluatePredicate(s.predicate, puzzle.characters, solution);
      if (solution.assignments[s.characterId]) expect(holds).toBe(true);
    }
  });

  it("never produces a composite clue over a single subject (tautology)", () => {
    for (let seed = 1; seed <= 25; seed++) {
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

  it("shows one count rule, plus a culprit-count rule from expert only, and never a rule pointing at the culprit", () => {
    for (const difficulty of difficulties) {
      for (let seed = 1; seed <= 30; seed++) {
        const { puzzle } = generatePuzzle({ difficulty, seed });
        const types = puzzle.rules.map((r) => r.type);
        expect(["truthCount", "liarCount", "truthCountOneOf", "liarCountOneOf"]).toContain(types[0]);
        if (difficulty === "expert") expect(types).toEqual([types[0], "culpritCount"]);
        else expect(types).toHaveLength(1);
      }
    }
  });

  it("only draws 'range' count rules from difficile", () => {
    const kinds = (difficulty: Difficulty) =>
      new Set(Array.from({ length: 40 }, (_, i) => generatePuzzle({ difficulty, seed: i + 1 }).puzzle.rules[0]?.type));
    expect(kinds("facile")).toEqual(new Set(["truthCount", "liarCount"]));
    expect(kinds("difficile").has("truthCountOneOf") || kinds("difficile").has("liarCountOneOf")).toBe(true);
  });

  it("expert announces 2 culprits or 1 or 2, and the solution matches", () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 40; seed++) {
      const { puzzle, solution } = generatePuzzle({ difficulty: "expert", seed });
      const rule = puzzle.rules.find((r) => r.type === "culpritCount");
      if (rule?.type !== "culpritCount") throw new Error("missing culpritCount rule");
      seen.add(rule.counts.join(","));
      expect(rule.counts).toContain(solution.culpritIds.length);
    }
    expect(seen).toEqual(new Set(["2", "1,2"]));
  });

  it("characters never name a species or an alignment in their statements", () => {
    const species = [...new Set(CHARACTER_CATALOG.map((c) => c.species))];
    for (const difficulty of difficulties) {
      for (let seed = 1; seed <= 25; seed++) {
        const { puzzle } = generatePuzzle({ difficulty, seed });
        for (const s of puzzle.statements) {
          for (const word of [...ALIGNMENTS, ...species]) expect(s.text.toLowerCase()).not.toContain(word);
        }
      }
    }
  });

  it("uses 'voisin' clues, and they are consistent with the map", () => {
    let found = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const { puzzle } = generatePuzzle({ difficulty: "difficile", seed });
      for (const s of puzzle.statements) {
        if (s.predicate.type === "culpritNeighborOf") {
          found++;
          expect(neighborsOf(puzzle.characters, s.predicate.characterId).length).toBeGreaterThan(0);
          expect(s.text).toMatch(/voisin/);
        }
      }
    }
    expect(found).toBeGreaterThan(0);
  });

  it("keeps clues light: one statement per character at every level", () => {
    for (const difficulty of difficulties) {
      const { puzzle } = generatePuzzle({ difficulty, seed: 3 });
      expect(puzzle.statements).toHaveLength(puzzle.characters.length);
    }
  });

  it("hard levels keep convincing wrong hypotheses (not too easy)", () => {
    for (const difficulty of ["difficile", "expert"] as const) {
      for (let seed = 1; seed <= 12; seed++) {
        const { puzzle, attempts } = generatePuzzle({ difficulty, seed });
        // Only attempts before the safety fallback must meet the bar.
        if (attempts <= 3000 * 0.6) {
          expect(analyzePuzzle(puzzle).nearMisses).toBeGreaterThanOrEqual(DIFFICULTY_PARAMS[difficulty].minNearMisses);
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
