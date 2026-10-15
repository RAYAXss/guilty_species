import type { CharacterAlignment } from "../../domain/characters/types";

/** Presentation data for alignments. Domain only knows the ids. */
export const alignmentStyle: Record<
  CharacterAlignment,
  { label: string; solid: string; soft: string; text: string; bg: string; border: string; radius: string }
> = {
  pacifiste: { label: "Pacifiste", solid: "#2f8f6b", soft: "#cfe3cb", text: "text-pacifiste", bg: "bg-pacifiste-soft", border: "border-pacifiste", radius: "rounded-full" },
  belliqueux: { label: "Belliqueux", solid: "#c4501f", soft: "#efcdb0", text: "text-belliqueux", bg: "bg-belliqueux-soft", border: "border-belliqueux", radius: "rounded-md" },
  vengeur: { label: "Vengeur", solid: "#7e3fb5", soft: "#dbc8ee", text: "text-vengeur", bg: "bg-vengeur-soft", border: "border-vengeur", radius: "rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm" },
};
