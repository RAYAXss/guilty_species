import type { Difficulty } from "../puzzle/types";
import type { LogicalPredicate } from "../statements/predicate";
import type { Rule } from "../rules/rule";
import type { RegionId } from "../world/fantolia";

/** A puzzle stored as logic only: the displayed text is re-rendered from the predicates. */
export interface FrozenPuzzle {
  id: string;
  difficulty: Difficulty;
  characterIds: string[];
  statements: { characterId: string; predicate: LogicalPredicate }[];
  rules: Rule[];
}

export interface Chapter {
  region: RegionId;
  title: string;
  /** Shown when the chapter is first reached. */
  lore: string;
}

export interface Level {
  id: string;
  region: RegionId;
  title: string;
  /** The case, told to the player before the round. */
  story: string;
}

/** levelId -> best stars earned (1..3). */
export type CampaignProgress = Record<string, number>;
