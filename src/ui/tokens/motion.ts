/** Central animation tokens. Components never hardcode durations or springs. */
export const motionTokens = {
  duration: { instant: 0.08, fast: 0.18, normal: 0.3, slow: 0.55 },
  spring: {
    snappy: { type: "spring", stiffness: 520, damping: 32 },
    soft: { type: "spring", stiffness: 220, damping: 26 },
    lively: { type: "spring", stiffness: 340, damping: 15 },
  },
  stagger: 0.06,
} as const;
