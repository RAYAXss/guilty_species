import type { Character } from "../../domain/characters/types";

/**
 * Where a character's PNG portrait lives.
 * `character.portrait` wins (path relative to /public or absolute URL);
 * otherwise we follow the convention `public/portraits/<id>.png`.
 */
export function portraitSrc(character: Pick<Character, "id" | "portrait">): string {
  const base = import.meta.env.BASE_URL;
  if (character.portrait) {
    return /^(https?:)?\/\//.test(character.portrait) ? character.portrait : `${base}${character.portrait.replace(/^\//, "")}`;
  }
  return `${base}portraits/${character.id}.png`;
}
