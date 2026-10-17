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
"Un de mes voisins est coupable."
```

The player must determine which combination of truth/lie assignments satisfies every rule.

Only one culprit should remain.

---

## 🗺️ Fantolia

Every character lives in one of six regions of Fantolia: Forêt mystique, Montagnes glacées, Désert aride, Marais des brumes, Plaines dorées and Terres d'ombre.

Two characters are **neighbors** when their regions share a border (never the same region). Clues such as *"Un de mes voisins est coupable"* or *"Aucun voisin de Gorak n'est coupable"* rely on this. The **Carte** button opens the map: pick a creature to highlight its region and the bordering ones.

Borders are domain data (`src/domain/world/fantolia.ts`); the drawing lives in `src/ui/tokens/fantolia.ts`.

## 📜 Rules and clues

- Characters never name a species. When they talk about the culprit's temperament they use plain words (« d'un naturel paisible », « d'un tempérament guerrier », « animé par la vengeance »); the words *pacifiste / belliqueux / vengeur* stay on the cards and in the rules.
- Count rules: exact (`Exactement 2 personnages disent la vérité`, `Exactement 1 personnage ment`) or ranges from *difficile* (`1 ou 2 personnages disent la vérité`).
- Culprit count, from *expert*: `Il y a 2 coupables` or `Il y a 1 ou 2 coupables`. Without this rule there is exactly one culprit. With several culprits, "culprit" predicates mean "at least one culprit" (and `expected: false` means none).
- Levels add creatures, not clues: still one statement per character and one count rule. *Difficile* and *expert* also reject puzzles whose wrong hypotheses are all obviously off (`analyzePuzzle().nearMisses`, tuned in `DIFFICULTY_PARAMS`); uniqueness is never relaxed.

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