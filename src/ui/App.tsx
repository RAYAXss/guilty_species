import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { Settings } from "lucide-react";
import type { GameState } from "../application/game/session";
import { TUTORIAL_LESSONS } from "../domain/tutorial/tutorial";
import { audio } from "../infrastructure/audio/audio";
import { loadVolumes, saveVolumes } from "../infrastructure/persistence/settingsStorage";
import { CardsBackground } from "./components/CardsBackground";
import { SettingsDialog } from "./components/SettingsDialog";
import { useGame } from "./hooks/useGame";
import { CampaignScreen } from "./screens/CampaignScreen";
import { GameScreen } from "./screens/GameScreen";
import { MenuScreen } from "./screens/MenuScreen";

function roundPath(state: GameState, puzzle: { difficulty: string; seed: number }): string {
  if (state.mode === "campaign") return `/campagne/${state.levelId}`;
  if (state.mode === "tutorial") return `/tutoriel/${state.lessonId}`;
  return `/round=${puzzle.difficulty}_${puzzle.seed.toString(36)}`;
}

function screenPath(state: GameState): string {
  if (state.screen === "playing" && state.round) return roundPath(state, state.round.puzzle);
  return state.screen === "campaign" ? "/campagne" : "/";
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
        className="w-full max-w-sm rounded-card border-2 border-sun bg-surface p-5 text-center text-ink shadow-[0_6px_0_#07050d]"
      >
        <p id="quit-title" className="font-display text-lg font-extrabold">Quitter cette manche ?</p>
        <p id="quit-desc" className="mt-2 text-sm font-semibold text-muted">
          Vous êtes sûr ? Vous ne pourrez pas revenir sur ce round.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 rounded-2xl border-[3px] border-ink/20 bg-inset px-4 py-2.5 font-bold text-ink hover:border-ink"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl border-[3px] border-ink bg-danger px-4 py-2.5 font-bold text-white shadow-[0_4px_0_#07050d] active:translate-y-1 active:shadow-[0_1px_0_#07050d]"
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [volumes, setVolumes] = useState(loadVolumes);

  useEffect(() => {
    audio.setVolumes(volumes);
    saveVolumes(volumes);
  }, [volumes]);

  // Browsers allow sound only after a user gesture.
  useEffect(() => {
    const unlock = () => audio.unlock();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => audio.playMusic(state.screen === "playing" ? "game" : "menu"), [state.screen]);

  const feedbackKind = state.feedback?.kind;
  useEffect(() => {
    if (feedbackKind) audio.playSfx(feedbackKind === "won" ? "win" : feedbackKind === "lost" ? "lose" : "wrong");
  }, [feedbackKind, state.round?.attemptsLeft]);

  // Sync URL with game state: going deeper pushes (so "back" can be intercepted), returning to the menu replaces.
  useEffect(() => {
    const path = screenPath(state);
    if (location.pathname === path) return;
    if (state.screen === "menu") history.replaceState(null, "", path);
    else history.pushState(null, "", path);
  }, [state]);

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
        history.pushState(null, "", roundPath(s, s.round.puzzle));
        setConfirmBack(true);
      } else if (s.screen === "campaign") {
        game.openMenu();
      } else if (location.pathname !== "/") {
        history.replaceState(null, "", "/");
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
      <CardsBackground dim={state.screen === "playing"} />

      <button
        onClick={() => {
          audio.playSfx("click");
          setSettingsOpen(true);
        }}
        aria-label="Réglages"
        className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-40 inline-flex size-11 items-center justify-center rounded-lg border-2 border-sun/50 bg-surface text-ink hover:border-sun sm:right-4"
      >
        <Settings size={20} aria-hidden />
      </button>

      <AnimatePresence mode="wait">
        {state.screen === "menu" ? (
          <MenuScreen
            key="menu"
            state={state}
            onSetCount={game.setCharacterCount}
            onSetDifficulty={game.setDifficulty}
            onStart={game.start}
            onOpenCampaign={game.openCampaign}
            onStartTutorial={() => game.startTutorial(TUTORIAL_LESSONS[0]!.id)}
          />
        ) : state.screen === "campaign" ? (
          <CampaignScreen key="campaign" state={state} onStartLevel={game.startLevel} onBack={game.openMenu} />
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

      {settingsOpen && <SettingsDialog volumes={volumes} onChange={setVolumes} onClose={() => setSettingsOpen(false)} />}

      {confirmBack && (
        <ConfirmQuitDialog onCancel={() => setConfirmBack(false)} onConfirm={handleConfirmQuit} />
      )}
    </MotionConfig>
  );
}
