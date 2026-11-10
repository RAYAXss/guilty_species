import type { Character } from "../../domain/characters/types";

/**
 * Where a character's portrait lives: square illustrations (864x864 sources in `art/portraits/<id>.png`, outside public/ so they are never shipped).
 * `character.portrait` wins (path relative to /public or absolute URL);
 * otherwise the app loads the 480px WebP built from the source, `public/portraits/card/<id>.webp`.
 */
export function portraitSrc(character: Pick<Character, "id" | "portrait">): string {
  const base = import.meta.env.BASE_URL;
  if (character.portrait) {
    return /^(https?:)?\/\//.test(character.portrait) ? character.portrait : `${base}${character.portrait.replace(/^\//, "")}`;
  }
  return `${base}portraits/card/${character.id}.webp`;
}

/** Small WebP version (256px) for decorative uses like the 3D background. */
export function portraitThumbSrc(character: Pick<Character, "id" | "portrait">): string {
  return character.portrait ? portraitSrc(character) : `${import.meta.env.BASE_URL}portraits/thumbs/${character.id}.webp`;
}
