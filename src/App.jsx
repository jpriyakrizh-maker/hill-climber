import { useRef } from 'react';
import useGame from './game/useGame';
import Scene from './components/Scene';
import Hud from './components/Hud';
import TouchPads from './components/TouchPads';
import GameOverlay from './components/GameOverlay';

export default function App() {
  // DOM refs the physics loop writes to directly (no React re-render at 60fps)
  const refs = {
    world: useRef(null),
    body: useRef(null),
    wheelR: useRef(null),
    wheelF: useRef(null),
    flame: useRef(null),
    mts: useRef(null),
    clouds: useRef(null),
    crates: useRef([]),
  };
  const { status, hud, restart, setKey } = useGame(refs);

  return (
    <div className="stage">
      <Scene refs={refs} />
      <Hud hud={hud} onRestart={restart} />
      <TouchPads setKey={setKey} />
      <GameOverlay status={status} onRestart={restart} />
    </div>
  );
}
