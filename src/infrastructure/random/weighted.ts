import type { Rng } from "./rng";

export interface Weighted {
  weight: number;
}

/** Throws on negative / non-finite weights. Weight 0 is valid (never selected). */
export function assertValidWeights(items: readonly Weighted[]): void {
  for (const item of items) {
    if (!Number.isFinite(item.weight) || item.weight < 0) {
      throw new Error(`Invalid weight: ${item.weight}`);
    }
  }
}

/** Weighted sampling without replacement. Items with weight 0 are never returned. */
export function weightedSample<T extends Weighted>(rng: Rng, items: readonly T[], count: number): T[] {
  assertValidWeights(items);
  const pool = items.filter((i) => i.weight > 0);
  if (count > pool.length) {
    throw new Error(`Cannot select ${count} items: only ${pool.length} have a positive weight`);
  }
  const picked: T[] = [];
  for (let n = 0; n < count; n++) {
    const total = pool.reduce((sum, i) => sum + i.weight, 0);
    let roll = rng() * total;
    let index = pool.findIndex((i) => (roll -= i.weight) < 0);
    if (index === -1) index = pool.length - 1; // float safety
    picked.push(pool.splice(index, 1)[0] as T);
  }
  return picked;
}
