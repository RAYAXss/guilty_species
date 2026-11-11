/** Regions of Fantolia. Lore only: the campaign travels along their borders. */
export const REGION_IDS = ["foret", "montagnes", "desert", "marais", "plaines", "ombres"] as const;
export type RegionId = (typeof REGION_IDS)[number];

export const REGION_NAMES: Record<RegionId, string> = {
  foret: "Forêt mystique",
  montagnes: "Montagnes glacées",
  desert: "Désert aride",
  marais: "Marais des brumes",
  plaines: "Plaines dorées",
  ombres: "Terres d'ombre",
};

/** Pairs of regions sharing a border (undirected). */
const BORDERS: readonly (readonly [RegionId, RegionId])[] = [
  ["foret", "montagnes"],
  ["montagnes", "desert"],
  ["foret", "marais"],
  ["montagnes", "plaines"],
  ["desert", "ombres"],
  ["marais", "plaines"],
  ["plaines", "ombres"],
];

export function adjacentRegions(region: RegionId): RegionId[] {
  return BORDERS.flatMap(([a, b]) => (a === region ? [b] : b === region ? [a] : []));
}

export function areNeighbors(a: RegionId, b: RegionId): boolean {
  return adjacentRegions(a).includes(b);
}
