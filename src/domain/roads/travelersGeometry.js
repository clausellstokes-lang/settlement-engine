/**
 * roads/travelersGeometry.js — pure geometry for THE TRAVELERS OVERLAY (§13). Position a
 * moving thing (army column / migrant column / named envoy) along the polyline between its
 * path's settlement placements, at a derived fraction t ∈ [0,1], plus the heading for a
 * direction chevron.
 *
 * FIRST-PAINT LAW: a LAZY LEAF importing ONLY the kernel clamp primitive (code-quality-4:
 * the ONE clamp01), read only from the lazy TravelersLayer. Pure, total, deterministic — the
 * derived-at-render discipline (ChainEdges).
 *
 * @enforced-by tests/domain/roadsTravelersGeometry.test.js
 */
import { clamp01 } from '../../kernel/math.js';

// Re-exported so TravelersLayer + tests import the ONE clamp primitive from this leaf.
export { clamp01 };

/**
 * The fraction travelled between two ticks: (now − depart) / (arrive − depart), clamped [0,1].
 * A zero/negative span ⇒ 0. Pure.
 * @param {number} now @param {number} depart @param {number} arrive @returns {number}
 */
export function progress01(now, depart, arrive) {
  const span = Number(arrive) - Number(depart);
  if (!(span > 0)) return 0;
  return clamp01((Number(now) - Number(depart)) / span);
}

/**
 * The point at fraction t along a polyline of {x,y} points, plus the heading (degrees, 0 = east,
 * clockwise as y grows down — SVG convention) of the segment it lands on. Null when fewer than
 * two valid points. Pure.
 * @param {Array<{x:number,y:number}>} pts  the path nodes (already resolved to map XY)
 * @param {number} t  fraction [0,1]
 * @returns {{ x:number, y:number, angleDeg:number, from:{x:number,y:number}, to:{x:number,y:number} }|null}
 */
export function pointAlongPath(pts, t) {
  const p = Array.isArray(pts) ? pts.filter((q) => q && Number.isFinite(q.x) && Number.isFinite(q.y)) : [];
  if (p.length < 2) return null;
  const segs = p.length - 1;
  // Cumulative segment lengths so t distributes by DISTANCE, not by node count (a long hop
  // reads as a long stretch of road, matching the eye).
  const segLen = [];
  let total = 0;
  for (let i = 0; i < segs; i += 1) {
    const dx = p[i + 1].x - p[i].x; const dy = p[i + 1].y - p[i].y;
    const len = Math.hypot(dx, dy);
    segLen.push(len); total += len;
  }
  const target = clamp01(t) * total;
  let acc = 0; let i = 0;
  if (total > 0) {
    for (; i < segs; i += 1) { if (acc + segLen[i] >= target || i === segs - 1) break; acc += segLen[i]; }
  }
  const a = p[i]; const b = p[i + 1];
  const local = segLen[i] > 0 ? clamp01((target - acc) / segLen[i]) : 0;
  const x = a.x + (b.x - a.x) * local;
  const y = a.y + (b.y - a.y) * local;
  const angleDeg = Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
  return { x, y, angleDeg, from: a, to: b };
}

/**
 * A small direction chevron (an arrowhead) as an SVG points string, centred at (x,y), pointing
 * along angleDeg. Pure — deterministic path data. @param {number} x @param {number} y
 * @param {number} angleDeg @param {number} [size] @returns {string} */
export function chevronPoints(x, y, angleDeg, size = 5) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad); const sin = Math.sin(rad);
  // tip forward, two barbs back — in local (along, perp) space then rotated.
  const local = [[size, 0], [-size, size * 0.7], [-size, -size * 0.7]];
  return local
    .map(([ax, ay]) => `${(x + ax * cos - ay * sin).toFixed(2)},${(y + ax * sin + ay * cos).toFixed(2)}`)
    .join(' ');
}
