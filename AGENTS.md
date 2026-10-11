# AGENTS.md

## Project

Fantasy deduction board game built with Node.js, TypeScript and React.

The project is a digital adaptation of a logic-based social deduction board game set in an original fantasy universe.

---

## Core rule

The game engine is the source of truth.

React must never contain the core deduction logic.

Do not duplicate game rules between frontend and backend.

---

## Before modifying code

Always:

1. Inspect the existing architecture.
2. Identify the relevant module.
3. Reuse existing project conventions.
4. Read related tests.
5. Make the smallest coherent change.
6. Run the relevant tests.
7. Run type checking.
8. Verify the UI if the change affects presentation.

---

## Architecture

Prefer this separation:

```text
src/
  domain/
    characters/
    statements/
    rules/
    puzzle/
    solver/
    generator/

  application/
    game/
    puzzle/

  infrastructure/
    random/
    persistence/

  ui/
    components/
    screens/
    hooks/
```

Adapt this structure to the existing repository if a better established convention already exists.

Do not introduce a second architecture unnecessarily.

---

## Domain rules

Domain logic must be:

- deterministic when given a seed;
- independently testable;
- independent from React;
- independent from browser APIs;
- independent from visual components.

Prefer pure functions.

---

## Puzzle validity

Every generated puzzle must satisfy:

```text
solutions.length === 1
```

Reject puzzles with:

```text
solutions.length === 0
solutions.length > 1
```

Never ship a puzzle that has not passed the solver.

---

## Randomness

Random generation must be isolated.

Avoid calling `Math.random()` throughout the domain.

Prefer an injectable random source.

This allows:

- deterministic tests;
- reproducible bugs;
- seeded puzzles;
- debugging.

---

## Weighted characters

Character selection supports weights.

Weights influence selection probability only.

Weights must not alter logical validity.

A character with:

```ts
weight: 0
```

must never be randomly selected.

Negative weights are invalid.

---

## Statements

Never make the displayed text the source of truth.

Bad:

```ts
statement: "Le dragon ment"
```

Preferred:

```ts
{
  text: "...",
  predicate: ...
}
```

The predicate represents the actual logical meaning.

The text represents how that predicate is presented to the player.

---

## UI

UI must be:

- playful;
- readable;
- responsive;
- accessible;
- visually consistent.

Avoid:

- excessive gradients;
- excessive shadows;
- unnecessary animations;
- tiny text;
- overloaded cards.

---

## Motion

Motion must communicate state.

Good uses:

- entering cards;
- selection;
- elimination;
- reveal;
- success;
- failure;
- navigation.

Bad uses:

- infinite decorative animations;
- animation on every hover;
- distracting background movement.

Always respect reduced-motion preferences.

---

## Components

Prefer reusable components.

A component should not contain unrelated business logic.

Avoid giant components.

If a component becomes difficult to understand, split it by responsibility.

---

## Tests

Every new domain rule requires tests.

Every solver change requires regression tests.

Every generator change requires tests ensuring puzzle uniqueness.

UI changes should not require rewriting domain tests.

---

## Git

Commits should be small and meaningful.

Prefer:

```text
feat: add weighted character selection
feat: add puzzle solver
feat: add character cards
fix: reject ambiguous puzzles
test: cover truth constraint solver
refactor: isolate random generator
```

Avoid:

```text
update stuff
fix things
changes
final
```

---

## Documentation

Update documentation when:

- architecture changes;
- a new gameplay concept is introduced;
- a new generation rule is added;
- a new developer workflow is required.

Do not create documentation for trivial implementation details.

---

## Important

Do not optimize prematurely.

Do not over-engineer.

Do not introduce dependencies without justification.

Do not copy external UI libraries blindly.

Do not sacrifice readability for abstraction.