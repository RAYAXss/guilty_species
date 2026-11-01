import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { useGame } from "./hooks/useGame";
import { GameScreen } from "./screens/GameScreen";
import { MenuScreen } from "./screens/MenuScreen";

function roundPath(puzzle: { difficulty: string; seed: number }): string {
  return `/round=${puzzle.difficulty}_${puzzle.seed.toString(36)}`;
}

function ConfirmQuitDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="quit-title"
        aria-describedby="quit-desc"
        className="w-full max-w-sm rounded-card border-[3px] border-ink bg-white p-5 text-center shadow-[0_6px_0_#1d1a4a]"
      >
        <p id="quit-title" className="font-display text-lg font-extrabold">Quitter cette manche ?</p>
        <p id="quit-desc" className="mt-2 text-sm font-semibold text-muted">
          Vous êtes sûr ? Vous ne pourrez pas revenir sur ce round.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 rounded-2xl border-[3px] border-ink/20 bg-white px-4 py-2.5 font-bold hover:border-ink"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl border-[3px] border-ink bg-danger px-4 py-2.5 font-bold text-white shadow-[0_4px_0_#1d1a4a] active:translate-y-1 active:shadow-[0_1px_0_#1d1a4a]"
          >
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const game = useGame();
  const { state } = game;
  const stateRef = useRef(state);
  stateRef.current = state;

  const [confirmBack, setConfirmBack] = useState(false);

  // Sync URL with game state.
  useEffect(() => {
    if (state.screen === "playing" && state.round) {
      const path = roundPath(state.round.puzzle);
      if (location.pathname !== path) {
        history.pushState(null, "", path);
      }
    } else {
      if (location.pathname !== "/") {
        history.replaceState(null, "", "/");
      }
    }
  }, [state.screen, state.round]);

  // Intercept browser back while playing.
  useEffect(() => {
    const onPop = () => {
      const s = stateRef.current;
      if (s.screen === "playing" && s.round) {
        // Round already over (won/lost dialog showing): treat back as "continue".
        if (s.feedback && s.feedback.kind !== "retry") {
          game.dismissFeedback();
          return;
        }
        // Re-push to keep the player on the round URL.
        history.pushState(null, "", roundPath(s.round.puzzle));
        setConfirmBack(true);
      } else {
        if (location.pathname !== "/") {
          history.replaceState(null, "", "/");
        }
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [game]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.screen]);

  const handleConfirmQuit = () => {
    setConfirmBack(false);
    game.quit();
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {state.screen === "menu" ? (
          <MenuScreen key="menu" state={state} onSetCount={game.setCharacterCount} onSetDifficulty={game.setDifficulty} onStart={game.start} />
        ) : (
          <GameScreen
            key={state.round?.puzzle.id}
            state={state}
            onAccuse={game.accuse}
            onDismissFeedback={game.dismissFeedback}
            onQuit={() => setConfirmBack(true)}
          />
        )}
      </AnimatePresence>

      {confirmBack && (
        <ConfirmQuitDialog onCancel={() => setConfirmBack(false)} onConfirm={handleConfirmQuit} />
      )}
    </MotionConfig>
  );
}
