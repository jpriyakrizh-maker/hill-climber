const TEXT = {
  flip: { tag: '● ACCIDENT DETECTED!', title: 'STAGE 1 FAILED', msg: 'Your hill climber flipped over! Tap anywhere or press ANY key to restart.' },
  fell: { tag: '● FELL INTO THE GAP!', title: 'STAGE 1 FAILED', msg: 'You fell down the broken road! Jump (W) or use nitro to cross. Tap anywhere or press ANY key to restart.' },
  win: { tag: '★ FINISH LINE!', title: 'STAGE 1 CLEARED', msg: 'Great driving! Tap anywhere or press ANY key to play again.' },
};

export default function GameOverlay({ status, onRestart }) {
  if (status.state !== 'over') return null;
  const t = TEXT[status.reason];
  return (
    <div className="overlay" onPointerDown={onRestart}>
      <div className="box">
        <span className="tag">{t.tag}</span>
        <div className="title">{t.title}</div>
        <p>{t.msg}</p>
        <button className="restart" onPointerDown={(e) => e.stopPropagation()} onClick={onRestart}>
          ⟳ RESTART STAGE (R / SPACE)
        </button>
      </div>
    </div>
  );
}
