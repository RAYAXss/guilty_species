/** Seed for a fresh game. The only place where non-determinism enters. */
export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
