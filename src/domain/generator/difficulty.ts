import type { Difficulty } from "../puzzle/types";

/** Difficulty is driven by parameters, never by duplicated code. */
export interface DifficultyParams {
  /** Default number of characters for this difficulty. */
  characterCount: number;
  /** Allowed range: more characters = more culprit hypotheses to check, so it is part of the difficulty. */
  minCharacters: number;
  maxCharacters: number;
  statementsPerCharacter: number;
  /** Extra rules on top of the mandatory truthCount rule. */
  extraRules: number;
  /** Probability that a statement is a composite (and / or / not). */
  compositeChance: number;
}

export const DIFFICULTY_PARAMS: Record<Difficulty, DifficultyParams> = {
  facile: { characterCount: 4, minCharacters: 3, maxCharacters: 4, statementsPerCharacter: 1, extraRules: 1, compositeChance: 0 },
  normal: { characterCount: 5, minCharacters: 4, maxCharacters: 5, statementsPerCharacter: 1, extraRules: 1, compositeChance: 0 },
  difficile: { characterCount: 6, minCharacters: 5, maxCharacters: 6, statementsPerCharacter: 1, extraRules: 1, compositeChance: 0.3 },
  expert: { characterCount: 8, minCharacters: 6, maxCharacters: 8, statementsPerCharacter: 1, extraRules: 2, compositeChance: 0.5 },
};

export function characterRange(difficulty: Difficulty): { min: number; max: number } {
  const { minCharacters, maxCharacters } = DIFFICULTY_PARAMS[difficulty];
  return { min: minCharacters, max: maxCharacters };
}

export function clampCharacterCount(difficulty: Difficulty, count: number): number {
  const { min, max } = characterRange(difficulty);
  return Math.min(max, Math.max(min, Math.round(count)));
}
