import { ALIGNMENTS, type Character } from "../characters/types";
import { CHARACTER_CATALOG } from "../characters/catalog";
import type { Difficulty, Puzzle, Solution, Statement } from "../puzzle/types";
import { evaluatePredicate, type LogicalPredicate } from "../statements/predicate";
import { renderStatement } from "../statements/render";
import { evaluateRule, type Rule } from "../rules/rule";
import { solve } from "../solver/solve";
import { createRng, pickOne, randomInt, shuffle, type Rng } from "../../infrastructure/random/rng";
import { weightedSample } from "../../infrastructure/random/weighted";
import { DIFFICULTY_PARAMS, type DifficultyParams } from "./difficulty";

export interface GenerateOptions {
  difficulty: Difficulty;
  seed: number;
  /** Injectable catalog (defaults to the built-in one). */
  catalog?: readonly Character[];
  maxAttempts?: number;
}

export interface GeneratedPuzzle {
  puzzle: Puzzle;
  /** Kept server-side: the player never receives it with the puzzle. */
  solution: Solution;
  attempts: number;
}

export class PuzzleGenerationError extends Error {}

export function generatePuzzle(options: GenerateOptions): GeneratedPuzzle {
  const { difficulty, seed, catalog = CHARACTER_CATALOG, maxAttempts = 500 } = options;
  const params = DIFFICULTY_PARAMS[difficulty];
  const rng = createRng(seed);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const candidate = tryBuild(rng, params, catalog);
    if (!candidate) continue;
    const { characters, world, rules, statements } = candidate;
    const puzzle: Puzzle = { id: `puzzle-${difficulty}-${seed}`, seed, difficulty, characters, statements, rules };

    // Never ship a puzzle that has not passed the solver.
    const solutions = solve(puzzle);
    if (solutions.length === 1) {
      return { puzzle, solution: world, attempts: attempt };
    }
  }
  throw new PuzzleGenerationError(`No unique puzzle found in ${maxAttempts} attempts (seed ${seed})`);
}

function tryBuild(rng: Rng, params: DifficultyParams, catalog: readonly Character[]) {
  const characters = weightedSample(rng, catalog, params.characterCount);

  // Culprit + truth assignment (the "world").
  const culprit = pickOne(rng, characters);
  const truthCount = randomInt(rng, 1, characters.length - 1);
  const truthful = new Set(shuffle(rng, characters).slice(0, truthCount).map((c) => c.id));
  const assignments: Record<string, boolean> = {};
  for (const c of characters) assignments[c.id] = truthful.has(c.id);
  const world: Solution = { culpritId: culprit.id, assignments };

  const rules = buildRules(rng, params, characters, world, truthCount);
  const statements = buildStatements(rng, params, characters, world);
  if (!statements) return null;
  return { characters, world, rules, statements };
}

function buildRules(rng: Rng, params: DifficultyParams, characters: Character[], world: Solution, truthCount: number): Rule[] {
  const rules: Rule[] = [{ type: "truthCount", count: truthCount }];
  const options: Rule[] = [
    { type: "culpritTruth", truthful: world.assignments[world.culpritId] === true },
    ...ALIGNMENTS.flatMap<Rule>((alignment) => [
      { type: "culpritAlignment", alignment },
      { type: "alignmentTruth", alignment, quantifier: "all", truthful: true },
      { type: "alignmentTruth", alignment, quantifier: "all", truthful: false },
      { type: "alignmentTruth", alignment, quantifier: "atLeastOne", truthful: true },
      { type: "alignmentTruth", alignment, quantifier: "atLeastOne", truthful: false },
    ]),
  ];
  // Only keep rules that are true in the world and not vacuous (group must exist).
  const valid = options.filter(
    (r) =>
      evaluateRule(r, characters, world) &&
      (r.type !== "alignmentTruth" || characters.some((c) => c.alignment === r.alignment)),
  );
  rules.push(...shuffle(rng, valid).slice(0, params.extraRules));
  return rules;
}

function atomicCandidates(characters: Character[], speakerId: string): LogicalPredicate[] {
  const others = characters.filter((c) => c.id !== speakerId);
  return [
    ...others.flatMap<LogicalPredicate>((c) => [
      { type: "characterTruth", characterId: c.id, expected: true },
      { type: "characterTruth", characterId: c.id, expected: false },
    ]),
    ...characters.flatMap<LogicalPredicate>((c) => [
      { type: "culpritIs", characterId: c.id, expected: true },
      { type: "culpritIs", characterId: c.id, expected: false },
    ]),
    ...ALIGNMENTS.flatMap<LogicalPredicate>((alignment) => [
      { type: "culpritAlignment", alignment, expected: true },
      { type: "culpritAlignment", alignment, expected: false },
    ]),
    ...[...new Set(characters.map((c) => c.species))].flatMap<LogicalPredicate>((species) => [
      { type: "culpritSpecies", species, expected: false },
    ]),
  ];
}

function buildStatements(rng: Rng, params: DifficultyParams, characters: Character[], world: Solution): Statement[] | null {
  const statements: Statement[] = [];
  for (const speaker of characters) {
    const tellsTruth = world.assignments[speaker.id] === true;
    const atoms = atomicCandidates(characters, speaker.id);
    for (let i = 0; i < params.statementsPerCharacter; i++) {
      // Truthful speakers: every statement true. Liars: the first one must be false.
      const mustBe: boolean | null = tellsTruth ? true : i === 0 ? false : null;
      const composites: LogicalPredicate[] = [];
      const [a, b] = shuffle(rng, atoms);
      if (a && b) {
        composites.push({ type: "or", operands: [a, b] }, { type: "and", operands: [a, b] }, { type: "not", operand: a });
      }
      const matches = (p: LogicalPredicate) => mustBe === null || evaluatePredicate(p, characters, world) === mustBe;
      const usableAtoms = atoms.filter(matches);
      const usableComposites = composites.filter(matches);
      const useComposite = usableComposites.length > 0 && rng() < params.compositeChance;
      const pool = useComposite ? usableComposites : usableAtoms;
      if (pool.length === 0) return null;
      const predicate = pickOne(rng, pool);
      statements.push({
        id: `${speaker.id}-s${i}`,
        characterId: speaker.id,
        predicate,
        text: renderStatement(predicate, characters),
      });
    }
  }
  return statements;
}
