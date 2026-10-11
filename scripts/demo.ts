import { generatePuzzle, renderRule, type Difficulty } from "../src";

const difficulty = (process.argv[2] ?? "normal") as Difficulty;
const seed = Number(process.argv[3] ?? 12345);
const { puzzle, solution, attempts } = generatePuzzle({ difficulty, seed });

console.log(`# ${puzzle.id} (${attempts} tentative(s))\n`);
for (const c of puzzle.characters) console.log(`- ${c.name} (${c.species}, ${c.alignment})`);
console.log("\nRègles :");
for (const r of puzzle.rules) console.log(`  * ${renderRule(r)}`);
console.log("\nAffirmations :");
for (const s of puzzle.statements) {
  console.log(`  ${puzzle.characters.find((c) => c.id === s.characterId)?.name} : « ${s.text} »`);
}
console.log(`\nCoupable : ${solution.culpritId}`);
