#!/usr/bin/env node
/**
 * harness/laneE1/hullConvexity.mjs — ⭐⭐⭐ REG-E1 · **HOW MUCH OF THE EMPTY INTERIOR IS THE HULL'S
 * CONVEXITY, ISOLATED FROM HISTORY.** Chartered by the chair's second addendum to §717.
 *
 * ⛔ **A SINGLE BUILT-TO-ENCLOSED RATIO AVERAGES THREE DIFFERENT CAUSES.** `hollowCensus` separates
 * the chair's first taxonomy (under-subdivision / honest optimism / pomerium). This one separates
 * the cause that taxonomy cannot see, because it is purely geometric and touches no record:
 *
 *   **CONVEXITY.** `raiseWrap` encloses the built faces with `convexHull`, so **every concavity in
 *   the settlement's shape becomes wall interior by construction** — on any plan that is elongated,
 *   lobed, or bent around a river, the wall wraps tracts of nothing with no reference to history.
 *
 * ⭐ **THE MEASURE.** Against the built pieces' own footprint, two enclosures:
 *   `convex`  the convex hull of the built piece centroids — what `raiseWrap` does.
 *   `snug`    a morphological CLOSING of the same set at one stated reach: the region within
 *             `REACH_ROADWIDTHS` road widths of some built piece. This is the concave/alpha
 *             enclosure, computed by rasterising rather than by a hull library, so it needs no
 *             alpha parameter beyond the reach and can represent lobes and bends.
 *   **`convexityGap` = 1 − snug/convex is the share of the convex enclosure that a snug enclosure
 *   would NOT have wrapped. That number is the defect, isolated: it contains no history at all.**
 *
 * ⚠ **THE REACH IS DECLARED, NOT DERIVED, and the column is printed at three reaches so a reader
 * can see how much the verdict depends on it.** A reach far below the piece spacing would report a
 * lace of holes; far above, it converges on the convex hull. Stated in ROAD WIDTHS because that is
 * the estate's own tier-varying unit.
 *
 * ⚠ SURFACE: the partition (`buildSettledPartition`), which is what the JUDGED dress page draws.
 * The legacy line's per-tier re-fit of the ring to TODAY's radius is a different mechanism on a
 * different surface and is deliberately EXCLUDED here.
 *
 * ⚠ ARM IT in the SHELL (REG-F0 J-F0-3).
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { convexHull, pointInPolygon } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { liveFaces, faceArea, faceCentroid } from '../../src/domain/townMap/fabric/partitionArrangement.js';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);
/** The reaches the closing is reported at, in ROAD WIDTHS. The middle one is the headline. */
const REACHES = [2, 3, 5];
/** Raster step, in road widths. Fine enough that a street does not close over. */
const STEP = 0.5;

const PIECE = new Set(['WARD', 'BLOCK', 'PLOT']);

function ringArea(r) {
  let s = 0;
  for (let i = 0; i < r.length; i++) { const a = r[i]; const b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1]; }
  return Math.abs(s / 2);
}

/** Area within `reach` of some point in `pts`, on a raster of `step`. */
function closingArea(pts, reach, step, bb) {
  const nx = Math.ceil((bb.x1 - bb.x0 + 2 * reach) / step);
  const ny = Math.ceil((bb.y1 - bb.y0 + 2 * reach) / step);
  const x0 = bb.x0 - reach; const y0 = bb.y0 - reach;
  // bucket the points so the inner loop is local rather than O(cells × points)
  const cell = Math.max(reach, step);
  const bucket = new Map();
  const key = (i, j) => `${i}|${j}`;
  for (const p of pts) {
    const i = Math.floor((p[0] - x0) / cell); const j = Math.floor((p[1] - y0) / cell);
    const k = key(i, j);
    if (!bucket.has(k)) bucket.set(k, []);
    bucket.get(k).push(p);
  }
  const r2 = reach * reach;
  let hits = 0;
  for (let gy = 0; gy < ny; gy++) {
    const py = y0 + (gy + 0.5) * step;
    for (let gx = 0; gx < nx; gx++) {
      const px = x0 + (gx + 0.5) * step;
      const bi = Math.floor((px - x0) / cell); const bj = Math.floor((py - y0) / cell);
      let hit = false;
      for (let di = -1; di <= 1 && !hit; di++) {
        for (let dj = -1; dj <= 1 && !hit; dj++) {
          const b = bucket.get(key(bi + di, bj + dj));
          if (!b) continue;
          for (const q of b) {
            const dx = q[0] - px; const dy = q[1] - py;
            if (dx * dx + dy * dy <= r2) { hit = true; break; }
          }
        }
      }
      if (hit) hits++;
    }
  }
  return hits * step * step;
}

const num = (v) => Math.round(v).toLocaleString('en-US');
const rows = [];
console.log('══ HOW MUCH OF THE WALL\'S INTERIOR IS THE HULL\'S CONVEXITY? ══');
console.log('convex = convex hull of the built pieces (what raiseWrap draws) · snug = the same set');
console.log(`closed at ${REACHES.join('/')} road widths · gap = 1 − snug/convex, the share a snug`);
console.log('enclosure would NOT have wrapped. It contains NO history.\n');
console.log(`${'leaf'.padEnd(12)}${'pieces'.padStart(7)}${'ring'.padStart(10)}${'convex'.padStart(10)}`
  + `${'snug@2'.padStart(10)}${'snug@3'.padStart(10)}${'snug@5'.padStart(10)}`
  + `${'gap@2'.padStart(7)}${'gap@3'.padStart(7)}${'gap@5'.padStart(7)}`
  + `${'LOSSin'.padStart(8)}${'LOSS%'.padStart(7)}`);

for (const key of leaves) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  if (!P.wraps.length) { console.log(`${key.padEnd(12)}  NO WRAPS`); rows.push({ leaf: key, wraps: 0 }); continue; }
  const arr = P.arrangement;
  const w = P.wraps[P.wraps.length - 1];
  const ring = w.outer.map((p) => [p[0], p[1]]);
  const rw = input.roadWidth || 5;

  const pts = [];
  let lossArea = 0; let lossN = 0;
  for (const f of liveFaces(arr)) {
    const c = faceCentroid(arr, f.id);
    if (!pointInPolygon(c[0], c[1], ring)) continue;
    if (PIECE.has(f.cls)) pts.push(c);
    // ⭐ THE CHAIR'S OWN DISCRIMINATOR FOR HONEST DECLINE: `partitionDecline` re-classes lost
    //   ground to LOSSREGION IN PLACE, so emptiness that is a LOSSREGION is history and emptiness
    //   that is bare FIELD inside a convex bulge is this file's subject.
    if (f.cls === 'LOSSREGION') { lossArea += Math.abs(faceArea(arr, f.id)); lossN++; }
  }
  if (pts.length < 3) { console.log(`${key.padEnd(12)}  too few pieces`); continue; }
  const hull = convexHull(pts.map((p) => [p[0], p[1]]));
  const convex = hull && hull.length >= 3 ? ringArea(hull) : 0;
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (const p of pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  const bb = { x0, y0, x1, y1 };
  const snug = REACHES.map((k) => closingArea(pts, k * rw, STEP * rw, bb));
  const gaps = snug.map((s) => (convex > 0 ? 1 - s / convex : 0));
  const ringA = ringArea(ring);
  rows.push({ leaf: key, wrap: w.index, pieces: pts.length, roadWidth: rw, ringArea: ringA,
    convexArea: convex, reaches: REACHES, snug, convexityGap: gaps, lossArea, lossN,
    lossShareOfRing: ringA > 0 ? lossArea / ringA : 0 });
  console.log(`${key.padEnd(12)}${String(pts.length).padStart(7)}${num(ringA).padStart(10)}`
    + `${num(convex).padStart(10)}${snug.map((s) => num(s).padStart(10)).join('')}`
    + `${gaps.map((g) => `${(100 * g).toFixed(0)}%`.padStart(7)).join('')}`
    + `${String(lossN).padStart(8)}${`${(100 * lossArea / ringA).toFixed(1)}%`.padStart(7)}`);
}
const out = arg('json', '');
if (out) { writeFileSync(out, JSON.stringify(rows, null, 1)); console.log(`\nwrote ${out}`); }
