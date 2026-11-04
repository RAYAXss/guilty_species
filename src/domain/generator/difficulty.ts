import type { Difficulty, Puzzle } from "../puzzle/types";
import { solve } from "../solver/solve";

/** Which global "how many tell the truth / lie" rules a level may draw. */
export type CountRuleKind = "truthCount" | "liarCount" | "truthCountOneOf" | "liarCountOneOf";

/** Difficulty is driven by parameters, never by duplicated code. */
export interface DifficultyParams {
  /** Default number of characters for this difficulty. */
  characterCount: number;
  /** Allowed range: more characters = more culprit hypotheses to check, so it is part of the difficulty. */
  minCharacters: number;
  maxCharacters: number;
  statementsPerCharacter: number;
  /** Extra rules on top of the mandatory count rule. */
  extraRules: number;
  /** Probability that a statement is a composite (and / or / not). */
  compositeChance: number;
  /** Minimum suspects the rules alone must leave (ignoring statements). */
  minRulesOnlySuspects: number;
  /** Maximum allowed redundant clues (statements + extra rules). 0 = every clue is needed. */
  maxRedundantClues: number;
  /** Possible sets of allowed culprit counts. Each inner array is one possible "culprit count" rule. */
  culpritCountChoices: readonly (readonly number[])[];
  /** Which count-rule kinds this difficulty may draw from. */
  countRules: readonly CountRuleKind[];
  /** Whether "culpritNeighborOf" predicates can appear in statements. */
  neighborClues: boolean;
}

const EXACT: readonly CountRuleKind[] = ["truthCount", "liarCount"];
const ANY: readonly CountRuleKind[] = ["truthCount", "liarCount", "truthCountOneOf", "liarCountOneOf"];

export const DIFFICULTY_PARAMS: Record<Difficulty, DifficultyParams> = {
  facile: { characterCount: 4, minCharacters: 3, maxCharacters: 4, statementsPerCharacter: 1, extraRules: 0, compositeChance: 0, minRulesOnlySuspects: 2, maxRedundantClues: Infinity, culpritCountChoices: [[1]], countRules: EXACT, neighborClues: false },
  normal: { characterCount: 5, minCharacters: 4, maxCharacters: 5, statementsPerCharacter: 1, extraRules: 0, compositeChance: 0, minRulesOnlySuspects: 2, maxRedundantClues: Infinity, culpritCountChoices: [[1]], countRules: EXACT, neighborClues: true },
  difficile: { characterCount: 6, minCharacters: 5, maxCharacters: 6, statementsPerCharacter: 1, extraRules: 0, compositeChance: 0.3, minRulesOnlySuspects: 2, maxRedundantClues: 2, culpritCountChoices: [[1]], countRules: ANY, neighborClues: true },
  expert: { characterCount: 8, minCharacters: 6, maxCharacters: 9, statementsPerCharacter: 1, extraRules: 0, compositeChance: 0.5, minRulesOnlySuspects: 2, maxRedundantClues: 4, culpritCountChoices: [[1], [1, 2]], countRules: ANY, neighborClues: true },
};

export function characterRange(difficulty: Difficulty): { min: number; max: number } {
  const { minCharacters, maxCharacters } = DIFFICULTY_PARAMS[difficulty];
  return { min: minCharacters, max: maxCharacters };
}

export function clampCharacterCount(difficulty: Difficulty, count: number): number {
  const { min, max } = characterRange(difficulty);
  return Math.min(max, Math.max(min, Math.round(count)));
}

export interface PuzzleAnalysis {
  /** Hypotheses (culprit set + truth values) consistent with the clues alone, i.e. before the count rule. */
  hypotheses: number;
  /** Wrong hypotheses that miss the count rule by exactly one: the traps that look right at first glance. */
  nearMisses: number;
}

/** Truth counts allowed by the puzzle's count rule (the rule is mandatory for generated puzzles). */
function allowedTruthCounts(rules: Puzzle["rules"], total: number): number[] {
  for (const r of rules) {
    if (r.type === "truthCount") return [r.count];
    if (r.type === "truthCountOneOf") return r.counts;
    if (r.type === "liarCount") return [total - r.count];
    if (r.type === "liarCountOneOf") return r.counts.map((c) => total - c);
  }
  return [];
}

/** Measures how much work the player has left once the clues are read; never needs the secret solution. */
export function analyzePuzzle(puzzle: Puzzle): PuzzleAnalysis {
  const total = puzzle.characters.length;
  const allowed = allowedTruthCounts(puzzle.rules, total);
  const cluesOnly = solve({ ...puzzle, rules: puzzle.rules.filter((r) => r.type === "culpritCount") });
  const truthful = (assignments: Record<string, boolean>) => Object.values(assignments).filter(Boolean).length;
  const gap = (count: number) => Math.min(...allowed.map((a) => Math.abs(a - count)));
  return {
    hypotheses: cluesOnly.length,
    nearMisses: cluesOnly.filter((w) => gap(truthful(w.assignments)) === 1).length,
  };
}
