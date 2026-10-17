import { ALIGNMENTS, type Character } from "../characters/types";
import { CHARACTER_CATALOG } from "../characters/catalog";
import type { Difficulty, Puzzle, Solution, Statement } from "../puzzle/types";
import { evaluatePredicate, type LogicalPredicate } from "../statements/predicate";
import { renderStatement } from "../statements/render";
import { evaluateRule, type Rule } from "../rules/rule";
import { neighborsOf } from "../world/fantolia";
import { solve } from "../solver/solve";
import { createRng, pickOne, randomInt, shuffle, type Rng } from "../../infrastructure/random/rng";
import { weightedSample } from "../../infrastructure/random/weighted";
import { analyzePuzzle, DIFFICULTY_PARAMS, type DifficultyParams } from "./difficulty";

export interface GenerateOptions {
  difficulty: Difficulty;
  seed: number;
  /** Overrides the difficulty's default number of characters. */
  characterCount?: number;
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
  const { difficulty, seed, catalog = CHARACTER_CATALOG, maxAttempts = 3000 } = options;
  const params: DifficultyParams = {
    ...DIFFICULTY_PARAMS[difficulty],
    ...(options.characterCount !== undefined && { characterCount: options.characterCount }),
  };
  const rng = createRng(seed);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const candidate = tryBuild(rng, params, catalog);
    if (!candidate) continue;
    const { characters, world, rules, statements } = candidate;
    const puzzle: Puzzle = { id: `puzzle-${difficulty}-${params.characterCount}-${seed}`, seed, difficulty, characters, statements, rules };

    // Never ship a puzzle that has not passed the solver.
    // Uniqueness is never negotiable. The "not too easy" bar is only relaxed for the last attempts
    // so an unlucky seed still yields a (valid) puzzle instead of an error.
    const solutions = solve(puzzle, 2);
    const hardEnough = attempt > maxAttempts * 0.6 || analyzePuzzle(puzzle).nearMisses >= params.minNearMisses;
    if (solutions.length === 1 && hardEnough) {
      return { puzzle, solution: world, attempts: attempt };
    }
  }
  throw new PuzzleGenerationError(`No unique puzzle found in ${maxAttempts} attempts (seed ${seed})`);
}

function tryBuild(rng: Rng, params: DifficultyParams, catalog: readonly Character[]) {
  const characters = weightedSample(rng, catalog, params.characterCount);

  // Culprit(s) + truth assignment (the "world").
  const culpritCounts = pickOne(rng, params.culpritCountChoices);
  const culpritCount = Math.min(pickOne(rng, culpritCounts), characters.length - 1);
  const culpritSet = new Set(shuffle(rng, characters).slice(0, culpritCount).map((c) => c.id));
  const culpritIds = characters.filter((c) => culpritSet.has(c.id)).map((c) => c.id);
  const truthCount = randomInt(rng, 1, characters.length - 1);
  const truthful = new Set(shuffle(rng, characters).slice(0, truthCount).map((c) => c.id));
  const assignments: Record<string, boolean> = {};
  for (const c of characters) assignments[c.id] = truthful.has(c.id);
  const world: Solution = { culpritIds, assignments };

  const rules = buildRules(rng, params, characters, world, truthCount, culpritCounts);
  const statements = buildStatements(rng, params, characters, world, culpritCounts.some((n) => n > 1));
  if (!statements) return null;
  return { characters, world, rules, statements };
}

/** The mandatory "how many tell the truth / lie" rule, as an exact count or a "1 ou 2" range. */
function buildCountRule(rng: Rng, params: DifficultyParams, total: number, truthCount: number): Rule {
  const kind = pickOne(rng, params.countRules);
  const liarCount = total - truthCount;
  // A second possible value next to the real one, kept inside [1, total - 1].
  const range = (real: number): number[] => {
    const others = [real - 1, real + 1].filter((v) => v >= 1 && v <= total - 1);
    return [real, pickOne(rng, others)].sort((a, b) => a - b);
  };
  switch (kind) {
    case "truthCount":
      return { type: "truthCount", count: truthCount };
    case "liarCount":
      return { type: "liarCount", count: liarCount };
    case "truthCountOneOf":
      return { type: "truthCountOneOf", counts: range(truthCount) };
    case "liarCountOneOf":
      return { type: "liarCountOneOf", counts: range(liarCount) };
  }
}

function buildRules(
  rng: Rng,
  params: DifficultyParams,
  characters: Character[],
  world: Solution,
  truthCount: number,
  culpritCounts: readonly number[],
): Rule[] {
  const rules: Rule[] = [buildCountRule(rng, params, characters.length, truthCount)];
  // Several culprits are announced; a single culprit is the default and needs no rule.
  if (!(culpritCounts.length === 1 && culpritCounts[0] === 1)) {
    rules.push({ type: "culpritCount", counts: [...culpritCounts] });
  }
  const options: Rule[] = [
    { type: "culpritTruth", truthful: world.culpritIds.every((id) => world.assignments[id] === true) },
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
  // "Voisin" clues only make sense for someone who has at least one neighbor in this puzzle.
  const withNeighbors = characters.filter((c) => neighborsOf(characters, c.id).length > 0);
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
    ...withNeighbors.flatMap<LogicalPredicate>((c) => [
      { type: "culpritNeighborOf", characterId: c.id, expected: true },
      { type: "culpritNeighborOf", characterId: c.id, expected: false },
    ]),
  ];
}

function buildStatements(rng: Rng, params: DifficultyParams, characters: Character[], world: Solution, multiCulprit: boolean): Statement[] | null {
  const statements: Statement[] = [];
  for (const speaker of characters) {
    const tellsTruth = world.assignments[speaker.id] === true;
    const atoms = atomicCandidates(characters, speaker.id);
    for (let i = 0; i < params.statementsPerCharacter; i++) {
      // Truthful speakers: every statement true. Liars: the first one must be false.
      const mustBe: boolean | null = tellsTruth ? true : i === 0 ? false : null;
      const composites: LogicalPredicate[] = [];
      // Composite clues must combine two different subjects ("Elara ment ou Elara dit vrai" is a useless tautology).
      const shuffled = shuffle(rng, atoms);
      const a = shuffled[0];
      const b = a && shuffled.find((x) => subjectOf(x) !== subjectOf(a));
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
        text: renderStatement(predicate, characters, { speakerId: speaker.id, multiCulprit }),
      });
    }
  }
  return statements;
}

/** What a predicate talks about, used to avoid composites over a single subject. */
function subjectOf(p: LogicalPredicate): string {
  switch (p.type) {
    case "characterTruth":
      return `truth:${p.characterId}`;
    case "culpritIs":
      return `culprit:${p.characterId}`;
    case "culpritAlignment":
      return `alignment:${p.alignment}`;
    case "culpritNeighborOf":
      return `neighbor:${p.characterId}`;
    default:
      return p.type;
  }
}
