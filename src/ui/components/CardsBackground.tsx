import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CHARACTER_CATALOG } from "../../domain/characters/catalog";
import { portraitThumbSrc } from "../tokens/portrait";

const SCENE_CARDS = CHARACTER_CATALOG.map((c) => ({ name: c.name, image: portraitThumbSrc(c) }));

/** Static scattered cards: used when motion is reduced or WebGL is unavailable. */
const STATIC_CARDS = [
  { id: "aldric", x: "3%", y: "8%", rotate: -18, scale: 0.7 },
  { id: "mira", x: "80%", y: "5%", rotate: 14, scale: 0.6 },
  { id: "brumm", x: "7%", y: "55%", rotate: 22, scale: 0.55 },
  { id: "ondine", x: "78%", y: "45%", rotate: -12, scale: 0.65 },
  { id: "karn", x: "82%", y: "78%", rotate: 8, scale: 0.5 },
  { id: "neris", x: "2%", y: "82%", rotate: -25, scale: 0.6 },
].map((c) => ({ ...c, character: CHARACTER_CATALOG.find((ch) => ch.id === c.id)! }));

/** Floating character cards behind every screen (three.js, loaded in its own chunk). */
export function CardsBackground({ dim }: { dim: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (reduce) return;
    let dispose = () => {};
    let cancelled = false;
    import("../scene/cardsScene")
      .then(({ mountCardsScene }) => {
        if (cancelled || !ref.current) return;
        dispose = mountCardsScene(ref.current, SCENE_CARDS);
      })
      .catch(() => setFallback(true));
    return () => {
      cancelled = true;
      dispose();
    };
  }, [reduce]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-opacity duration-500 ${dim ? "opacity-20" : "opacity-55"}`}
    >
      {reduce || fallback ? (
        STATIC_CARDS.map((card) => (
          <motion.div
            key={card.id}
            className="absolute w-28 sm:w-36"
            style={{ left: card.x, top: card.y, rotate: card.rotate, scale: card.scale }}
          >
            <div className="overflow-hidden rounded-2xl border-4 border-sun bg-surface">
              <img src={portraitThumbSrc(card.character)} alt="" className="aspect-square w-full object-cover" />
            </div>
          </motion.div>
        ))
      ) : (
        <div ref={ref} className="size-full" />
      )}
    </div>
  );
}
