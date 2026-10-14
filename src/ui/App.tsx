import { useEffect } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { useGame } from "./hooks/useGame";
import { GameScreen } from "./screens/GameScreen";
import { MenuScreen } from "./screens/MenuScreen";

export function App() {
  const game = useGame();
  const { state } = game;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.screen]);
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
            onQuit={game.quit}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
