# DESIGN.md

# Fantasy Deduction Game — Design System

## 1. Design direction

The game should feel like:

> A modern fantasy card game mixed with a detective board game.

The visual identity should be:

- friendly;
- colorful;
- mysterious;
- tactile;
- expressive;
- premium;
- approachable.

Avoid overly dark fantasy aesthetics.

Avoid making the interface look like a traditional RPG inventory.

---

# 2. Visual hierarchy

Every screen should have:

```text
Context
   ↓
Main information
   ↓
Player decision
   ↓
Secondary information
```

The player should immediately understand what matters.

---

# 3. Color philosophy

Colors have semantic meaning.

Suggested semantic system:

```text
Primary
Fantasy / exploration

Secondary
Mystery / investigation

Success
Truth / confirmed

Warning
Uncertainty / suspicious

Danger
Wrong deduction / danger

Neutral
Unknown / unresolved
```

Do not rely exclusively on color.

Every important state should also use:

- icon;
- label;
- shape;
- text;
- or position.

---

# 4. Character cards

Character cards are one of the most important UI elements.

They should contain:

```text
Portrait
Name
Species
Alignment
Status
```

Example:

```text
┌───────────────────────┐
│                       │
│       PORTRAIT        │
│                       │
├───────────────────────┤
│  THAROK               │
│  Orc                   │
│                       │
│  ⚔ Belliqueux         │
│                       │
│  Suspect              │
└───────────────────────┘
```

The card must remain readable at small sizes.

---

# 5. Alignment badges

Initial alignments:

### Pacifiste

Visual language:

- calm;
- soft;
- peaceful;
- organic.

### Belliqueux

Visual language:

- energetic;
- strong;
- angular;
- aggressive.

### Vengeur

Visual language:

- mysterious;
- intense;
- occult;
- sharp.

Do not rely on color alone to distinguish them.

---

# 6. Statement cards

Statements should visually communicate:

```text
WHO
+
WHAT
+
CONFIDENCE / STATUS
```

Example:

```text
ELARA

"Le dragon dit la vérité."

────────────────

Indice
```

Statements should be easy to compare.

---

# 7. Evidence system

Evidence can have states:

```text
unknown
considered
confirmed
rejected
contradictory
```

Each state should have a visual representation.

Example:

```text
Unknown
○

Considered
◐

Confirmed
✓

Rejected
×

Contradictory
!
```

Icons are illustrative only; final iconography should remain consistent with the chosen icon library.

---

# 8. Investigation board

The main deduction screen should feel like an investigation board.

Possible structure:

```text
┌─────────────────────────────────────────────┐
│ Puzzle #042                  2 truths       │
├─────────────────────────────────────────────┤
│                                             │
│   SUSPECTS                                  │
│                                             │
│   [Elf] [Orc] [Dragon] [Human] [Necrolas] │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   STATEMENTS                                │
│                                             │
│   [statement] [statement] [statement]      │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   RULES                                     │
│                                             │
│   [Exactly 2 characters tell the truth]     │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│                 FIND CULPRIT                │
│                                             │
└─────────────────────────────────────────────┘
```

The layout must remain responsive.

---

# 9. Motion

Motion should be subtle but expressive.

Recommended animation vocabulary:

### Card entrance

Short stagger.

### Selection

Small elevation + scale.

### Elimination

Card moves/fades into an eliminated state.

### Reveal

Card flips or transitions into a confirmed state.

### Victory

Short celebratory animation.

### Navigation

Smooth shared-layout transition when appropriate.

Avoid infinite animations unless they communicate an active state.

---

# 10. Motion tokens

Use semantic animation tokens rather than arbitrary durations.

Conceptually:

```ts
motion = {
  instant,
  fast,
  normal,
  slow,

  spring: {
    snappy,
    soft,
    lively
  }
}
```

The exact values should be centralized.

---

# 11. Reduced motion

When reduced motion is enabled:

- remove large translations;
- remove excessive scaling;
- avoid parallax;
- prefer opacity transitions;
- keep state changes understandable.

Reduced motion must never remove important feedback.

---

# 12. Typography

Typography should be:

- highly readable;
- slightly playful;
- modern.

Use a distinctive display font sparingly.

Body text should prioritize readability.

Do not use fantasy fonts for paragraphs.

---

# 13. Surfaces

Use a hierarchy:

```text
background
surface
elevated surface
interactive surface
selected surface
```

Cards should feel tactile without excessive shadows.

---

# 14. Borders and radius

Use a consistent radius scale.

Characters cards should have stronger visual identity than generic UI containers.

Avoid giving every element a giant rounded rectangle.

---

# 15. Responsive design

Primary targets:

- desktop;
- tablet;
- mobile.

On mobile:

```text
Suspects
↓
Selected suspect
↓
Statements
↓
Rules
↓
Action
```

The player should never need horizontal scrolling for the main gameplay.

---

# 16. Feedback

Correct action:

- positive;
- immediate;
- subtle.

Incorrect action:

- clear;
- informative;
- non-punitive unless game rules require punishment.

Victory:

- visually memorable.

Defeat:

- informative and encouraging.

---

# 17. Inspiration

Reference libraries:

- Motion UI
- KokonutUI
- OriginKit
- Manus

Use these for:

- interaction quality;
- animation principles;
- component composition;
- modern layout;
- polished micro-interactions.

Do not copy their branding.

Do not copy their visual identity.

The game must develop its own visual language.

---

# 18. Core design principle

The interface must make deduction easier.

Never add visual complexity that makes the logic harder to understand.

The best UI is the one that makes the player think:

> "Je commence à comprendre."

rather than:

> "Où est le bouton ?"