export default function Hud({ hud, onRestart }) {
  const restart = (e) => { onRestart(); e.currentTarget.blur(); };
  return (
    <>
      <div className="hud left">
        <button className="ib dark" onClick={restart}>◀</button>
        <span className="pill">STAGE 1 / 5</span>
        <button className="ib dark" onClick={restart}>▶</button>
      </div>

      <div className="hud right">
        <div><small>DISTANCE</small><b>{hud.dist} m</b></div>
        <div><small>SPEED</small><b>{hud.spd} km/h</b></div>
        <div>
          <small>NITRO</small>
          <div className="nitro"><i style={{ width: hud.nitro + '%' }} /></div>
        </div>
        <button className="ib" title="Restart (R)" onClick={restart}>⟳</button>
      </div>

      <div className="help">
        <kbd>D</kbd>/<kbd>→</kbd> Drive <kbd>A</kbd>/<kbd>←</kbd> Tilt <kbd>W</kbd>/<kbd>↑</kbd> Jump <kbd>SPACE</kbd> Nitro <kbd>R</kbd> Restart
      </div>
    </>
  );
}
