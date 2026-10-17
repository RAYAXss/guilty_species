import { describe, expect, it } from "vitest";
import type { Character } from "../characters/types";
import type { Puzzle, Statement } from "../puzzle/types";
import type { Rule } from "../rules/rule";
import { evaluatePredicate } from "../statements/predicate";
import { possibleCulprits, solve } from "./solve";

const chars: Character[] = [
  { id: "a", name: "A", species: "elfe", alignment: "pacifiste", region: "foret", weight: 1 },
  { id: "b", name: "B", species: "orc", alignment: "belliqueux", region: "montagnes", weight: 1 },
  { id: "c", name: "C", species: "dragon", alignment: "vengeur", region: "desert", weight: 1 },
];

const stmt = (characterId: string, predicate: Statement["predicate"]): Statement => ({
  id: `${characterId}-s0`,
  characterId,
  text: "",
  predicate,
});

const make = (statements: Statement[], rules: Rule[]): Puzzle => ({
  id: "t", seed: 0, difficulty: "facile", characters: chars, statements, rules,
});

describe("solve", () => {
  it("finds a unique solution", () => {
    // A: "C is the culprit"; B: "A lies"; C: "A tells the truth". Exactly 1 truth.
    const puzzle = make(
      [
        stmt("a", { type: "culpritIs", characterId: "c", expected: true }),
        stmt("b", { type: "characterTruth", characterId: "a", expected: false }),
        stmt("c", { type: "characterTruth", characterId: "a", expected: true }),
      ],
      [{ type: "truthCount", count: 1 }, { type: "culpritAlignment", alignment: "belliqueux" }],
    );
    const solutions = solve(puzzle);
    expect(solutions).toHaveLength(1);
    expect(solutions[0]?.culpritIds).toEqual(["b"]);
    expect(solutions[0]?.assignments).toEqual({ a: false, b: true, c: false });
  });

  it("returns 0 solutions for contradictory puzzles", () => {
    const puzzle = make(
      [
        stmt("a", { type: "culpritIs", characterId: "a", expected: true }),
        stmt("b", { type: "culpritIs", characterId: "b", expected: true }),
        stmt("c", { type: "culpritIs", characterId: "c", expected: true }),
      ],
      [{ type: "truthCount", count: 2 }],
    );
    expect(solve(puzzle)).toHaveLength(0);
  });

  it("returns several solutions for ambiguous puzzles", () => {
    const puzzle = make(
      [
        stmt("a", { type: "culpritAlignment", alignment: "vengeur", expected: false }),
        stmt("b", { type: "culpritAlignment", alignment: "vengeur", expected: false }),
        stmt("c", { type: "culpritAlignment", alignment: "vengeur", expected: false }),
      ],
      [{ type: "truthCount", count: 3 }],
    );
    expect(solve(puzzle).length).toBeGreaterThan(1);
    expect(possibleCulprits(puzzle).sort()).toEqual(["a", "b"]);
  });

  it("evaluates composite predicates and alignment rules", () => {
    const puzzle = make(
      [
        stmt("a", { type: "or", operands: [
          { type: "culpritIs", characterId: "b", expected: true },
          { type: "culpritIs", characterId: "c", expected: true },
        ] }),
        stmt("b", { type: "not", operand: { type: "culpritIs", characterId: "b", expected: true } }),
        stmt("c", { type: "culpritIs", characterId: "b", expected: true }),
      ],
      [
        { type: "alignmentTruth", alignment: "vengeur", quantifier: "all", truthful: true },
        { type: "culpritAlignment", alignment: "belliqueux" },
      ],
    );
    const solutions = solve(puzzle);
    expect(solutions.every((s) => s.culpritIds.join() === "b")).toBe(true);
    expect(solutions).toHaveLength(1);
  });

  it("handles a neighbor clue (a in forêt only borders b in montagnes)", () => {
    // A: "un de mes voisins est coupable" (b is a's only neighbor); B: "a est coupable"; C: "a ment".
    const puzzle = make(
      [
        stmt("a", { type: "culpritNeighborOf", characterId: "a", expected: true }),
        stmt("b", { type: "culpritIs", characterId: "a", expected: true }),
        stmt("c", { type: "characterTruth", characterId: "a", expected: false }),
      ],
      [{ type: "truthCount", count: 2 }],
    );
    const solutions = solve(puzzle);
    expect(solutions).toHaveLength(1);
    expect(solutions[0]?.culpritIds).toEqual(["a"]);
  });

  describe("several culprits", () => {
    const clues = [
      stmt("a", { type: "culpritIs", characterId: "b", expected: true }),
      stmt("b", { type: "culpritIs", characterId: "b", expected: false }),
      stmt("c", { type: "culpritAlignment", alignment: "pacifiste", expected: true }),
    ];

    it("defaults to exactly one culprit", () => {
      expect(solve(make(clues, [])).every((s) => s.culpritIds.length === 1)).toBe(true);
    });

    it("explores culprit sets allowed by the culpritCount rule", () => {
      const sizes = (counts: number[]) =>
        new Set(solve(make(clues, [{ type: "culpritCount", counts }])).map((s) => s.culpritIds.length));
      expect(sizes([2])).toEqual(new Set([2]));
      expect(sizes([1, 2])).toEqual(new Set([1, 2]));
    });

    it("reads culprit predicates as 'at least one culprit' / 'none'", () => {
      const world = { culpritIds: ["a", "c"], assignments: { a: true, b: false, c: true } };
      const eval_ = (p: Statement["predicate"]) => evaluatePredicate(p, chars, world);
      expect(eval_({ type: "culpritIs", characterId: "c", expected: true })).toBe(true);
      expect(eval_({ type: "culpritIs", characterId: "b", expected: true })).toBe(false);
      expect(eval_({ type: "culpritAlignment", alignment: "belliqueux", expected: false })).toBe(true);
      expect(eval_({ type: "culpritAlignment", alignment: "vengeur", expected: true })).toBe(true);
    });
  });
});
