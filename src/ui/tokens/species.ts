/** Card colors per creature type (presentation only). */
export const speciesStyle: Record<string, { soft: string; solid: string }> = {
  humain: { soft: "#ffe2c6", solid: "#f08a3c" },
  elfe: { soft: "#fff1b3", solid: "#e0b000" },
  orc: { soft: "#cfe9b8", solid: "#5f9a3a" },
  dragon: { soft: "#ffc9bd", solid: "#e2452e" },
  "nécrolas": { soft: "#d9d3f5", solid: "#5a4bb5" },
  gobelin: { soft: "#e6f5a8", solid: "#8fb81f" },
  sylphe: { soft: "#c9ecff", solid: "#2f9bd6" },
  troll: { soft: "#cfdde6", solid: "#587a92" },
  golem: { soft: "#e4dfd4", solid: "#8a8373" },
  vampire: { soft: "#f5c6d3", solid: "#a3173f" },
};
export const speciesColors = (species: string) => speciesStyle[species] ?? speciesStyle["humain"]!;
