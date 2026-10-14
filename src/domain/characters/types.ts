export const ALIGNMENTS = ["pacifiste", "belliqueux", "vengeur"] as const;
export type CharacterAlignment = (typeof ALIGNMENTS)[number];

export interface Character {
  id: string;
  name: string;
  species: string;
  alignment: CharacterAlignment;
  /** Generation metadata only: never affects logical evaluation. */
  weight: number;
  description?: string;
  portrait?: string;
}
