import type { Difficulty } from "../puzzle/types";

/** Difficulty is driven by parameters, never by duplicated code. */
export interface DifficultyParams {
  characterCount: number;
  statementsPerCharacter: number;
  /** Extra rules on top of the mandatory truthCount rule. */
  extraRules: number;
  /** Probability that a statement is a composite (and / or / not). */
  compositeChance: number;
}

export const DIFFICULTY_PARAMS: Record<Difficulty, DifficultyParams> = {
  facile: { characterCount: 4, statementsPerCharacter: 1, extraRules: 1, compositeChance: 0 },
  normal: { characterCount: 5, statementsPerCharacter: 1, extraRules: 1, compositeChance: 0 },
  difficile: { characterCount: 6, statementsPerCharacter: 1, extraRules: 1, compositeChance: 0.3 },
  expert: { characterCount: 8, statementsPerCharacter: 1, extraRules: 2, compositeChance: 0.5 },
};
