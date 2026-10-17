import { useCallback, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { pts, isGap, H, START, END, CRATE_X } from './constants';

const { Engine, Bodies, Body, Composite, Constraint, Query } = Matter;
const KEYMAP = { KeyD: 'd', ArrowRight: 'd', KeyA: 'a', ArrowLeft: 'a', KeyW: 'w', ArrowUp: 'w', Space: 'n' };
const deg = (r) => (r * 180) / Math.PI;

export default function useGame(refs) {
  const [status, setStatus] = useState({ state: 'play', reason: null }); // reason: flip | fell | win
  const [hud, setHud] = useState({ dist: 0, spd: 0, nitro: 100 });
  const keys = useRef({});
  const api = useRef({ init: () => {} });

  const setKey = useCallback((key, v) => { keys.current[key] = v; }, []);
  const restart = useCallback(() => api.current.init(), []);

  useEffect(() => {
    const { world, body, wheelR, wheelF, flame, mts, clouds, crates: crateEls } = refs;
    const k = keys.current;
    const engine = Engine.create();
    engine.gravity.y = 1.1;
    let car, wheels, terrain, crates, fails, nitro, state, camX, camY, cd, frame = 0, raf;

    function init() {
      Composite.clear(engine.world, false);
      terrain = [];
      for (let i = 0; i < pts.length - 1; i++) {
        if (isGap(i)) continue;
        const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
        const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1);
        terrain.push(Bodies.rectangle((x1 + x2) / 2 - Math.sin(a) * 15, (y1 + y2) / 2 + Math.cos(a) * 15, L + 8, 30,
          { isStatic: true, angle: a, friction: 1 }));
      }
      Composite.add(engine.world, terrain);

      const g = { group: -1 }, y0 = H(START) - 60;
      const chassis = Bodies.rectangle(START, y0, 124, 30, { collisionFilter: g, density: 0.003, friction: 0.4 });
      const mkWheel = (dx) => Bodies.circle(START + dx, y0 + 22, 23,
        { collisionFilter: g, friction: 1.2, frictionStatic: 2, density: 0.0025, restitution: 0, frictionAir: 0.005 });
      const wr = mkWheel(-42), wf = mkWheel(42);
      const springs = [[wr, -42], [wf, 42]].map(([w, dx]) =>
        Constraint.create({ bodyA: chassis, pointA: { x: dx, y: 22 }, bodyB: w, stiffness: 0.55, damping: 0.25, length: 0 }));
      Composite.add(engine.world, [chassis, wr, wf, ...springs]);
      car = chassis; wheels = [wr, wf];

      crates = CRATE_X.map((x) => Bodies.rectangle(x, H(x) - 60, 40, 40, { density: 0.0006, friction: 0.6 }));
      Composite.add(engine.world, crates);

      fails = 0; nitro = 100; state = 'play'; cd = 0; camX = START - 300; camY = y0 - 330;
      setStatus({ state: 'play', reason: null });
    }

    function end(reason) { state = 'over'; setStatus({ state: 'over', reason }); }
    const grounded = () => wheels.some((w) => Query.collides(w, terrain).length > 0);

    function render() {
      const p = car.position;
      camX += (p.x - 300 - camX) * 0.12;
      camY += (p.y - 320 - camY) * 0.08;
      world.current.setAttribute('transform', `translate(${-camX},${-camY})`);
      body.current.setAttribute('transform', `translate(${p.x},${p.y}) rotate(${deg(car.angle)})`);
      [[wheelR, wheels[0]], [wheelF, wheels[1]]].forEach(([r, w]) =>
        r.current.setAttribute('transform', `translate(${w.position.x},${w.position.y}) rotate(${deg(w.angle)})`));
      crates.forEach((c, i) =>
        crateEls.current[i]?.setAttribute('transform', `translate(${c.position.x},${c.position.y}) rotate(${deg(c.angle)})`));
      mts.current.setAttribute('transform', `translate(${-((camX * 0.25) % 660)},0)`);
      clouds.current.setAttribute('transform', `translate(${-((camX * 0.1) % 1100)},0)`);
      if (++frame % 5 === 0) {
        setHud({
          dist: Math.max(0, Math.round((p.x - START) / 10)),
          spd: Math.round(Math.hypot(car.velocity.x, car.velocity.y) * 3.2),
          nitro: Math.round(nitro),
        });
      }
    }

    function loop() {
      if (state === 'play') {
        const g = grounded();
        if (k.d) wheels.forEach((w) => Body.setAngularVelocity(w, Math.min(w.angularVelocity + 0.03, 0.6)));
        if (k.a) Body.setAngularVelocity(car, car.angularVelocity - 0.007);
        if (k.w && g && cd <= 0) { Body.setVelocity(car, { x: car.velocity.x * 1.08, y: -11 }); cd = 40; }
        cd--;
        const boost = k.n && nitro > 0;
        if (boost) {
          Body.applyForce(car, car.position, { x: Math.cos(car.angle) * 0.02, y: Math.sin(car.angle) * 0.02 });
          nitro = Math.max(0, nitro - 0.7);
        } else nitro = Math.min(100, nitro + 0.1);
        flame.current.setAttribute('opacity', boost ? 1 : 0);

        Engine.update(engine, 1000 / 60);

        const a = ((car.angle + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
        fails = Math.abs(a) > 2.1 && g ? fails + 1 : Math.abs(a) > 2.1 ? fails + 0.3 : 0;
        if (car.position.y > H(car.position.x) + 380) end('fell');   // fell into a gap
        else if (fails > 35) end('flip');
        else if (car.position.x > END) end('win');
      }
      render();
      raf = requestAnimationFrame(loop);
    }

    const onDown = (e) => {
      if (state === 'over') { init(); e.preventDefault(); return; }
      if (e.code === 'KeyR') { init(); return; }
      if (KEYMAP[e.code]) { k[KEYMAP[e.code]] = true; e.preventDefault(); }
    };
    const onUp = (e) => { if (KEYMAP[e.code]) k[KEYMAP[e.code]] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    api.current.init = init;
    init();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, hud, restart, setKey };
}
