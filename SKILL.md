# SKILL.md

# Fantasy Deduction Game Skill

## Purpose

This skill defines how to create, validate and extend deduction puzzles for the fantasy board game.

---

# 1. Domain vocabulary

## Character

A character is a fantasy entity participating in the puzzle.

Properties may include:

- id;
- name;
- species;
- alignment;
- weight;
- description;
- portrait;
- statements.

---

## Alignment

Initial alignments:

```text
pacifiste
belliqueux
vengeur
```

Alignments are domain data.

They should not be hard-coded into UI components.

---

# 2. Statement model

A statement contains two separate concepts:

```text
Logical meaning
+
Player-facing text
```

Example:

```ts
{
  id: "statement-01",
  characterId: "orc-01",
  text: "Le dragon ment.",
  predicate: {
    type: "characterTruth",
    characterId: "dragon-01",
    expected: false
  }
}
```

The predicate is authoritative.

The text is presentation.

---

# 3. Rules

Rules describe global constraints.

Examples:

```text
Exactly 2 characters tell the truth.
Exactly 3 characters lie.
At least one pacifist tells the truth.
The culprit is belligerent.
The culprit is not the dragon.
```

Rules must be composable.

Avoid implementing every possible rule as a special-case function.

Prefer a predicate/constraint system.

---

# 4. Puzzle generation

Generation should follow:

```text
Select characters
        ↓
Select culprit
        ↓
Create world state
        ↓
Create constraints
        ↓
Generate statements
        ↓
Validate
        ↓
Solve
        ↓
Check uniqueness
        ↓
Calculate difficulty
```

If validation fails:

```text
discard puzzle
```

Do not attempt to patch an invalid puzzle after generation unless the repair mechanism itself is deterministic and tested.

---

# 5. Solver

The solver must be independent from the generator.

This is important.

The generator creates the puzzle.

The solver attempts to solve the puzzle as if it were the player.

This prevents the generator from accidentally assuming information that the player does not have.

---

# 6. Uniqueness

A valid puzzle must have exactly one solution.

```ts
const solutions = solve(puzzle);

if (solutions.length !== 1) {
  reject(puzzle);
}
```

This rule is mandatory.

---

# 7. Difficulty

Difficulty should eventually be derived from measurable properties.

Potential factors:

- number of characters;
- number of statements;
- number of rules;
- number of candidate solutions before final deduction;
- logical dependency depth;
- number of required deductions;
- redundancy of clues.

Avoid defining difficulty only as:

```text
easy = 3 characters
hard = 10 characters
```

Two puzzles with the same number of characters can have very different difficulty.

---

# 8. Weighted content

Use weighted random selection.

Example:

```text
Human      5
Elf        4
Orc        3
Dragon     1
Necrolas   2
```

The weight is generation metadata.

It must not affect logical evaluation.

---

# 9. Seeds

Support seeded generation.

Example:

```ts
generatePuzzle({
  difficulty: "normal",
  seed: 12345
});
```

A seed must reproduce the same puzzle.

This is essential for debugging.

---

# 10. Adding a new rule

When adding a new rule:

1. Define its data representation.
2. Define its logical evaluation.
3. Add unit tests.
4. Add generator support if needed.
5. Add solver support.
6. Test contradictory cases.
7. Test ambiguous cases.
8. Test valid cases.
9. Test puzzle uniqueness.

Do not add a rule only to the frontend.

---

# 11. Adding a new character

When adding a character:

1. Create the character data.
2. Assign an alignment.
3. Assign a weight.
4. Add portrait metadata if available.
5. Add possible statement templates.
6. Test generation.
7. Test that the character does not create impossible puzzles.

No character should require custom React logic.

---

# 12. UI implementation

Use reusable components such as:

```text
CharacterCard
StatementCard
RuleCard
SuspectGrid
EvidencePanel
DeductionBoard
TruthBadge
AlignmentBadge
PuzzleHeader
GameResult
```

Components should receive data through props.

---

# 13. Animation skill

Use Motion for meaningful transitions.

Recommended patterns:

- staggered character cards;
- card selection;
- shared layout transitions;
- reveal animations;
- success celebration;
- elimination animation.

Motion should be configurable from central tokens.

Use reduced-motion alternatives.

---

# 14. Design references

Use these references as inspiration:

- Motion UI
- KokonutUI
- OriginKit
- Manus

Motion is particularly useful for physics-based React transitions and layout animation.

KokonutUI can be considered for reusable React/Tailwind animated components, especially card and interaction patterns.

OriginKit can inspire the project's approach to structured, configurable and agent-friendly components.

Never copy an external design literally.

---

# 15. Design philosophy

The player should feel:

```text
"I am investigating."
```

Not:

```text
"I am filling out a form."
```

The interface should encourage:

- observation;
- comparison;
- deduction;
- experimentation;
- discovery.

---

# 16. Failure states

An incorrect answer should provide feedback without immediately revealing the solution unless the game mode explicitly allows it.

Potential feedback:

```text
"Cette créature est innocente."
```

or:

```text
"Une contradiction subsiste."
```

Avoid exposing the complete reasoning unless requested by the game mode.

---

# 17. Future extensibility

The system should eventually support:

- new fantasy species;
- new alignments;
- new rule types;
- custom puzzles;
- procedural puzzles;
- handcrafted puzzles;
- daily puzzles;
- difficulty levels;
- puzzle seeds;
- multiplayer;
- timed mode;
- hint system;
- explanation/replay mode.

Do not implement all of these now.

Build foundations that do not prevent them later.