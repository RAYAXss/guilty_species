import type { Character, CharacterAlignment } from "../characters/types";
import type { LogicalPredicate } from "../statements/predicate";
import type { Rule } from "../rules/rule";

export type Difficulty = "facile" | "normal" | "difficile" | "expert";

export interface Statement {
  id: string;
  characterId: string;
  /** Presentation only. The predicate is authoritative. */
  text: string;
  predicate: LogicalPredicate;
}

/** What the player sees: never contains the culprit. */
export interface Puzzle {
  id: string;
  seed: number;
  difficulty: Difficulty;
  characters: Character[];
  statements: Statement[];
  rules: Rule[];
}

/** One possible state of the world: a culprit + who tells the truth. */
export interface Solution {
  culpritId: string;
  /** characterId -> tells the truth */
  assignments: Record<string, boolean>;
}

export type { CharacterAlignment };
