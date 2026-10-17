export const STEP = 130;      // road segment length (px)
export const END = 9000;      // finish line x
export const START = 200;     // car spawn x

// Road gaps: the segment starting at each x is removed. Add/remove values (multiples of STEP from -400).
export const GAPS = new Set([2200, 4410, 5580, 7400]);

export const CRATE_X = [1500, 1560, 2600, 2640, 2680, 3900, 4000, 5200, 5240, 6300, 7300];

// terrain height at x
export const H = (x) => {
  if (x < 700) return 500;
  const t = x - 700;
  return 500 + 120 * Math.sin(t / 520) + 75 * Math.sin(t / 230 + 1) - Math.min(t / 40, 120);
};

export const pts = [];
for (let x = -400; x <= END + 600; x += STEP) pts.push([x, H(x)]);

export const isGap = (i) => GAPS.has(pts[i][0]);
