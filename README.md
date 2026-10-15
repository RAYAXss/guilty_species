# Guilty Species

A fantasy logic and deduction board game built with Node.js, TypeScript and React.

## 🎲 Concept

Five fantasy creatures.

Multiple statements.

A set of logical rules.

One culprit.

Your job is to determine who is guilty by connecting the statements and eliminating impossible candidates.

Unlike a traditional guessing game, the solution is not based on luck.

Every valid puzzle has exactly one logical solution.

---

## 🧙 The World

The game takes place in an original fantasy universe populated by creatures such as:

- Humans
- Orcs
- Elves
- Dragons
- Necrolas
- Goblins
- Golems
- and other original creatures

Each character belongs to a behavioral alignment:

- 🕊️ Pacifiste
- ⚔️ Belliqueux
- 🩸 Vengeur

---

## 🧠 Gameplay

A typical puzzle provides:

### Characters

A group of suspicious fantasy creatures.

### Statements

Each character makes one or more statements.

### Rules

Global constraints define how many characters tell the truth or how different characters relate to one another.

### Deduction

The player compares all available information and eliminates impossible candidates.

### Solution

There must always be exactly one valid culprit.

---

## ⚖️ Example

Imagine five characters:

```text
Elara      Elf
Gorak      Orc
Thalion    Human
Varek      Dragon
Neris      Necrolas
```

The puzzle might tell you:

```text
Exactly two characters are telling the truth.

Elara says:
"Varek is lying."

Gorak says:
"Neris is the culprit."

Thalion says:
"Elara is telling the truth."

Varek says:
"Gorak is lying."

Neris says:
"The culprit is not a dragon."
```

The player must determine which combination of truth/lie assignments satisfies every rule.

Only one culprit should remain.

---

## 🧩 Puzzle Engine

The puzzle engine is independent from the React interface.

It is responsible for:

- generating puzzles;
- generating statements;
- applying constraints;
- solving puzzles;
- validating uniqueness;
- calculating difficulty;
- handling weighted character selection;
- supporting deterministic seeds.

---

## 🎴 Weighted Characters

Characters can have different generation weights.

Example:

| Character | Weight |
|---|---:|
| Human | 5 |
| Elf | 5 |
| Orc | 3 |
| Necrolas | 2 |
| Dragon | 1 |

Weights control how often characters appear.

They do not change the logical rules of the game.

---

## 🛠️ Tech Stack

- Node.js
- TypeScript
- React
- Motion
- Tailwind CSS / existing UI system
- Automated tests

---

## 🎨 Design

The visual identity combines:

- fantasy card games;
- modern board games;
- investigation interfaces;
- friendly colorful UI;
- subtle motion.

Animation and interaction inspiration:

- Motion UI
- KokonutUI
- OriginKit
- Manus

The project uses these references as inspiration rather than copying their designs.

---

## 🧪 Testing

The puzzle engine is tested independently from the UI.

Important guarantees:

```text
A valid puzzle has exactly one solution.
```

The generator must reject:

```text
0 solutions
```

and:

```text
2+ solutions
```

---

## 🚧 Roadmap

### Phase 1

- [ ] Project setup
- [ ] Character model
- [ ] Alignment system
- [ ] Statement model
- [ ] Basic logical predicates
- [ ] Puzzle solver
- [ ] Puzzle generator
- [ ] Uniqueness validation

### Phase 2

- [ ] Character cards
- [ ] Statement cards
- [ ] Rule cards
- [ ] Investigation screen
- [ ] Suspect selection
- [ ] Victory state
- [ ] Failure state

### Phase 3

- [ ] Difficulty system
- [ ] Weighted characters
- [ ] Seeded puzzles
- [ ] Hint system
- [ ] Puzzle explanations

### Future

- [ ] Daily puzzles
- [ ] Timed mode
- [ ] Multiplayer
- [ ] Custom puzzle creation
- [ ] Campaign mode
- [ ] More fantasy factions