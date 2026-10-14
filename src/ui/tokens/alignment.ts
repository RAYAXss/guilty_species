import type { CharacterAlignment } from "../../domain/characters/types";

/** Presentation data for alignments. Domain only knows the ids. */
export const alignmentStyle: Record<
  CharacterAlignment,
  { label: string; solid: string; soft: string; text: string; bg: string; border: string; radius: string }
> = {
  pacifiste: { label: "Pacifiste", solid: "#1f9f74", soft: "#c9f3e2", text: "text-pacifiste", bg: "bg-pacifiste-soft", border: "border-pacifiste", radius: "rounded-full" },
  belliqueux: { label: "Belliqueux", solid: "#e2591f", soft: "#ffd9c4", text: "text-belliqueux", bg: "bg-belliqueux-soft", border: "border-belliqueux", radius: "rounded-md" },
  vengeur: { label: "Vengeur", solid: "#9a3fd0", soft: "#ecd2fb", text: "text-vengeur", bg: "bg-vengeur-soft", border: "border-vengeur", radius: "rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm" },
};
