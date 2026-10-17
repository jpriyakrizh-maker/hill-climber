import { pts, isGap, CRATE_X } from '../game/constants';

// static road pieces (gaps are skipped)
const segs = [];
for (let i = 0; i < pts.length - 1; i++) {
  if (isGap(i)) continue;
  const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
  segs.push({ x1, y1, x2, y2 });
}

let hills = 'M0,560 L0,470';
for (let i = 0; i <= 14; i++) hills += ` L${i * 100},${450 + (i % 3) * 18}`;
hills += ' L1400,560Z';

const Wheel = () => (
  <>
    <circle r="23" fill="#1a1a22" />
    <circle r="15" fill="#e8c547" stroke="#7a6a2a" strokeWidth="2" />
    {[0, 1, 2, 3, 4, 5].map((a) => (
      <line key={a} x1="0" y1="0" x2={Math.cos((a * Math.PI) / 3) * 15} y2={Math.sin((a * Math.PI) / 3) * 15} stroke="#3a7fd0" strokeWidth="3" />
    ))}
    <circle r="4" fill="#223" />
  </>
);

const CarBody = ({ flameRef }) => (
  <>
    <path d="M-45,-14 L-30,-48 L20,-48 L30,-14" fill="none" stroke="#14202e" strokeWidth="3" />
    <circle cx="-8" cy="-30" r="9" fill="#2f6fe0" />
    <rect x="-1" y="-42" width="16" height="14" fill="#dfe6ee" rx="3" />
    <rect x="-62" y="-16" width="124" height="30" rx="12" fill="#1d8fe0" stroke="#0f5f9f" strokeWidth="2" />
    <rect x="-50" y="-9" width="90" height="6" rx="3" fill="#5cc0ff" />
    <circle cx="58" cy="-3" r="4" fill="#ffe85c" />
    <polygon ref={flameRef} points="-62,-6 -95,0 -62,6" fill="#ff8a1c" opacity="0" />
  </>
);

export default function Scene({ refs }) {
  return (
    <svg className="scene" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a7fd8" />
          <stop offset="1" stopColor="#7fd0ff" />
        </linearGradient>
        <g id="cloud">
          <ellipse rx="70" ry="28" fill="#fff" />
          <ellipse cx="-40" cy="8" rx="45" ry="22" fill="#f4f9ff" />
          <ellipse cx="38" cy="6" rx="50" ry="24" fill="#fff" />
          <ellipse cy="-18" rx="40" ry="24" fill="#fff" />
        </g>
        <g id="mt">
          <polygon points="0,0 110,-190 220,0" fill="#454a62" />
          <polygon points="110,-190 220,0 120,0" fill="#363b52" />
          <polygon points="110,-190 85,-150 110,-158 135,-148" fill="#fff" />
        </g>
      </defs>

      <rect width="1000" height="560" fill="url(#sky)" />
      <circle cx="860" cy="90" r="34" fill="#ffd93b" />

      <g ref={refs.clouds}>
        {Array.from({ length: 8 }, (_, i) => (
          <use key={i} href="#cloud" x={i * 220} y={60 + ((i * 47) % 110)} transform={`scale(${0.8 + (i % 3) * 0.25})`} />
        ))}
      </g>
      <g ref={refs.mts}>
        {Array.from({ length: 8 }, (_, i) => (
          <use key={i} href="#mt" x={i * 330} y={540 + (i % 2) * 10} />
        ))}
      </g>
      <path d={hills} fill="#0b4a3a" />

      <g ref={refs.world}>
        <g>
          {segs.map(({ x1, y1, x2, y2 }) => (
            <g key={x1}>
              <polygon points={`${x1},${y1} ${x2},${y2} ${x2},${y2 + 70} ${x1},${y1 + 70}`} fill="#5f9a12" stroke="#5f9a12" strokeWidth="1" />
              <line x1={x1} y1={y1 + 10} x2={x2} y2={y2 + 10} stroke="#26343c" strokeWidth="14" />
              <line x1={x1} y1={y1 + 10} x2={x2} y2={y2 + 10} stroke="#e8c547" strokeWidth="3" strokeDasharray="16 14" />
              <line x1={x1} y1={y1 - 1} x2={x2} y2={y2 - 1} stroke="#2ecc71" strokeWidth="4" />
            </g>
          ))}
        </g>
        <g>
          {CRATE_X.map((x, i) => (
            <rect key={x} ref={(el) => (refs.crates.current[i] = el)} x="-20" y="-20" width="40" height="40" fill="#c8642a" stroke="#7a3a14" strokeWidth="3" />
          ))}
        </g>
        <g ref={refs.wheelR}><Wheel /></g>
        <g ref={refs.wheelF}><Wheel /></g>
        <g ref={refs.body}><CarBody flameRef={refs.flame} /></g>
      </g>
    </svg>
  );
}
