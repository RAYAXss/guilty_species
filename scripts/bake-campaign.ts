/**
 * Re-bakes campaign levels with the current generator, keeping each level's cast and difficulty
 * (stories name their characters). Usage: npx tsx scripts/bake-campaign.ts [levelId...]
 * Without ids, re-bakes every level. Prints the full FROZEN_PUZZLES file to stdout.
 */
import { CHARACTER_CATALOG } from "../src/domain/characters/catalog";
import { FROZEN_PUZZLES } from "../src/domain/campaign/frozen-puzzles";
import type { FrozenPuzzle } from "../src/domain/campaign/types";
import { generatePuzzle } from "../src/domain/generator/generate";
import { culpritCountsOf } from "../src/domain/rules/rule";

const only = process.argv.slice(2);

function bake(frozen: FrozenPuzzle): FrozenPuzzle {
  const cast = frozen.characterIds.map((id) => CHARACTER_CATALOG.find((c) => c.id === id)!);
  for (let seed = 1; seed < 500; seed++) {
    try {
      const { puzzle } = generatePuzzle({ difficulty: frozen.difficulty, seed, catalog: cast, characterCount: cast.length, maxAttempts: 400 });
      // Keep the level's culprit count: stories rely on it (« Les voleurs pourraient être deux »).
      if (JSON.stringify(culpritCountsOf(puzzle.rules)) !== JSON.stringify(culpritCountsOf(frozen.rules))) continue;
      return {
        id: frozen.id,
        difficulty: frozen.difficulty,
        characterIds: puzzle.characters.map((c) => c.id),
        statements: puzzle.statements.map((s) => ({ characterId: s.characterId, predicate: s.predicate })),
        rules: puzzle.rules,
      };
    } catch {
      // Try the next seed.
    }
  }
  throw new Error(`Could not bake ${frozen.id}`);
}

const baked = FROZEN_PUZZLES.map((p) => (only.length === 0 || only.includes(p.id) ? bake(p) : p));
console.log(`import type { FrozenPuzzle } from "./types";

// Baked once from the generator (scripts/bake-campaign.ts), then frozen: campaign levels never change when the generator does.
export const FROZEN_PUZZLES: readonly FrozenPuzzle[] = ${JSON.stringify(baked, null, 2)};`);
