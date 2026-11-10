import type { RegionId } from "../world/fantolia";

export const ALIGNMENTS = ["pacifiste", "belliqueux", "vengeur"] as const;
export type CharacterAlignment = (typeof ALIGNMENTS)[number];

/** Numeric traits printed on the cards (1 to 10). Clues compare them. */
export const STATS = ["strength", "intelligence"] as const;
export type Stat = (typeof STATS)[number];
export const STAT_MIN = 1;
export const STAT_MAX = 10;

export interface Character {
  id: string;
  name: string;
  species: string;
  alignment: CharacterAlignment;
  /** Lore only (campaign map): never used by clues. */
  region: RegionId;
  strength: number;
  intelligence: number;
  /** Generation metadata only: never affects logical evaluation. */
  weight: number;
  description?: string;
  portrait?: string;
}
