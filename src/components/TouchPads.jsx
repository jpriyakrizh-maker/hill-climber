const PADS = [
  ['◀', 'a', { left: 14 }],
  ['▶', 'd', { left: 84 }],
  ['⬆', 'w', { right: 84 }],
  ['🔥', 'n', { right: 14 }],
];

export default function TouchPads({ setKey }) {
  return (
    <>
      {PADS.map(([label, key, pos]) => (
        <button
          key={key}
          className="pad"
          style={pos}
          onPointerDown={(e) => { e.preventDefault(); setKey(key, true); }}
          onPointerUp={() => setKey(key, false)}
          onPointerLeave={() => setKey(key, false)}
          onPointerCancel={() => setKey(key, false)}
        >
          {label}
        </button>
      ))}
    </>
  );
}
