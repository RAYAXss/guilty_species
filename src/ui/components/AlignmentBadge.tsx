import { Flame, Leaf, Swords } from "lucide-react";
import type { CharacterAlignment } from "../../domain/characters/types";
import { alignmentStyle } from "../tokens/alignment";

const icons = { pacifiste: Leaf, belliqueux: Swords, vengeur: Flame } as const;

/** Icon + label + shape: never relies on color alone. */
export function AlignmentBadge({ alignment }: { alignment: CharacterAlignment }) {
  const s = alignmentStyle[alignment];
  const Icon = icons[alignment];
  return (
    <span className={`inline-flex items-center gap-1 border-2 px-2 py-0.5 text-sm font-bold ${s.bg} ${s.text} ${s.border} ${s.radius}`}>
      <Icon size={15} strokeWidth={2.5} aria-hidden />
      {s.label}
    </span>
  );
}
