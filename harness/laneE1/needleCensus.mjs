#!/usr/bin/env node
/**
 * harness/laneE1/needleCensus.mjs — ⭐⭐⭐ REG-E1 · **THE NEEDLE, AGAINST THE RECORD BEHIND IT.**
 *
 * ⛔ THE ONE QUESTION. `ringSanity` already measures a wrap ring's SHAPE (DRESS-1b) and convicts
 * `metropolis` E1 at min-rect aspect 22.79. What it cannot ask is whether that shape is what the
 * RECORD asked for. This census puts the two side by side:
 *
 *   THE RECORD  `growthLedger`'s circuit event — `year`, `provenance`, and **`frozenRadius`, the
 *               settlement's own built radius at the raise**. That scalar is the whole of what
 *               history states about a circuit's extent; the ledger's own sentence is
 *               *"its extent is frozen at the built radius of that year"*.
 *   THE DRAWING `raiseWrap`'s ring — the convex hull of the pieces whose CENTROID falls inside
 *               that radius, facet-resampled and radially clamped.
 *
 * ⭐ THE DECIDING COLUMN IS `inR/R`: the largest circle about the settlement's own centre that the
 * drawn ring contains, over the radius the record froze. A circuit that encloses the settlement at
 * radius R has `inR/R ≈ 1`. A ring reading 0.1 is not a narrow circuit — it is a ring that does not
 * enclose what the record says it enclosed.
 *
 * Usage: node harness/laneE1/needleCensus.mjs [--leaves=a,b] [--json=<path>]
 * ⚠ ARM IT: `REG_FABRIC_OPTS` is read at MODULE LOAD (REG-F0 J-F0-3) — export it before `node`.
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { pointInPolygon } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { liveFaces, faceArea, faceCentroid } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { measureRing } from '../laneDRESS1B/ringSanity.mjs';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

/** Distance from `p` to the ring's boundary (min over segments) — signed by containment. */
function distToRing(ring, p) {
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const vx = b[0] - a[0]; const vy = b[1] - a[1];
    const wx = p[0] - a[0]; const wy = p[1] - a[1];
    const L2 = vx * vx + vy * vy;
    const t = L2 > 0 ? Math.max(0, Math.min(1, (wx * vx + wy * vy) / L2)) : 0;
    const dx = wx - vx * t; const dy = wy - vy * t;
    const d = Math.hypot(dx, dy);
    if (d < best) best = d;
  }
  return best;
}

/** The ring's own max radius about `c`. */
function circumR(ring, c) {
  let m = 0;
  for (const p of ring) m = Math.max(m, Math.hypot(p[0] - c[0], p[1] - c[1]));
  return m;
}

/** Even-odd area of a ring on a grid, and the share of it covered by the given faces. */
function ringArea(ring) {
  let s = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return Math.abs(s / 2);
}

export function leafOf(key) {
  const spec = CORPUS.find((s) => s.key === key);
  if (!spec) throw new Error(`NO_SUCH_LEAF ${key}`);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  return { P: buildSettledPartition(input), input, fabric, settlement, model };
}

/**
 * ⭐⭐ **THE BUILT-TO-ENCLOSED RATIO (V2).** The area of the PIECE faces (WARD/BLOCK/PLOT — the
 * arrangement's own `PIECE_CLASSES`) whose centroid falls inside the OUTERMOST wrap's ring, over
 * that ring's own enclosed area. ⚠ It is a PLACEMENT measure, not an existence count: a piece is
 * counted only where it actually stands.
 */
function builtToEnclosed(P, ring) {
  const arr = P.arrangement;
  const acc = { WARD: 0, BLOCK: 0, PLOT: 0, VOID: 0, WAY: 0, WATER: 0, FIELD: 0, WALLBAND: 0, other: 0 };
  const cnt = { WARD: 0, BLOCK: 0, PLOT: 0, VOID: 0, WAY: 0, WATER: 0, FIELD: 0, WALLBAND: 0, other: 0 };
  for (const f of liveFaces(arr)) {
    const c = faceCentroid(arr, f.id);
    if (!pointInPolygon(c[0], c[1], ring)) continue;
    const k = Object.prototype.hasOwnProperty.call(acc, f.cls) ? f.cls : 'other';
    acc[k] += Math.abs(faceArea(arr, f.id));
    cnt[k]++;
  }
  return { acc, cnt, enclosed: ringArea(ring) };
}

const f2 = (v) => (Number.isFinite(v) ? v.toFixed(2) : '∞');
const f3 = (v) => (Number.isFinite(v) ? v.toFixed(3) : '∞');
const num = (v) => Math.round(v).toLocaleString('en-US');

const rows = [];
const v2rows = [];
console.log('══ A · THE CIRCUIT, AGAINST THE RECORD BEHIND IT ══');
console.log(`${'leaf'.padEnd(12)}${'wrap'.padEnd(5)}${'year'.padStart(6)}${'provenance'.padStart(15)}`
  + `${'R(rec)'.padStart(8)}${'inR'.padStart(8)}${'inR/R'.padStart(7)}${'outR/R'.padStart(7)}`
  + `${'minRect'.padStart(10)}${'obbAsp'.padStart(7)}${'|area|'.padStart(10)}${'/piR^2'.padStart(8)}`
  + `${'clmp'.padStart(5)}  centre-in`);
for (const key of leaves) {
  const { P, input, fabric } = leafOf(key);
  const cx = input.extent.cx; const cy = input.extent.cy;
  for (const w of P.wraps) {
    const ring = w.outer.map((p) => [p[0], p[1]]);
    const m = measureRing(ring);
    const inside = pointInPolygon(cx, cy, ring);
    const inR = inside ? distToRing(ring, [cx, cy]) : 0;
    const outR = circumR(ring, [cx, cy]);
    const R = w.frozenRadius;
    const discArea = Math.PI * R * R;
    const row = {
      leaf: key, wrap: w.index, year: w.year, provenance: w.provenance, frozenRadius: R,
      centreInside: inside, inRadius: inR, outRadius: outR, inShare: inR / R, outShare: outR / R,
      absArea: m.absArea, areaShare: m.absArea / discArea, obbW: m.obb.w, obbH: m.obb.h,
      obbAspect: m.obb.aspect, verts: m.verts, clampedFacets: w.clampedFacets,
      bandWidth: w.bandWidth, facets: w.facets, verdict: m.verdict,
      builtRadius: fabric.meta.builtRadius, extentRadius: input.extent.radius,
      rim: input.extent.radius * 0.9,
    };
    rows.push(row);
    console.log(`${key.padEnd(12)}${`E${w.index}`.padEnd(5)}${String(w.year).padStart(6)}`
      + `${String(w.provenance).padStart(15)}${f2(R).padStart(8)}${f2(inR).padStart(8)}`
      + `${f3(inR / R).padStart(7)}${f3(outR / R).padStart(7)}`
      + `${`${Math.round(m.obb.w)}x${Math.round(m.obb.h)}`.padStart(10)}${f2(m.obb.aspect).padStart(7)}`
      + `${num(m.absArea).padStart(10)}${f3(m.absArea / discArea).padStart(8)}`
      + `${String(w.clampedFacets).padStart(5)}  ${inside ? 'yes' : '⛔ NO'}   ${m.verdict}`);
  }
}

console.log('\n══ B · BUILT-TO-ENCLOSED, INSIDE THE OUTERMOST CIRCUIT ══');
console.log(`${'leaf'.padEnd(12)}${'enclosed'.padStart(11)}${'pieces'.padStart(11)}${'built%'.padStart(8)}`
  + `${'ways%'.padStart(7)}${'water%'.padStart(7)}${'field%'.padStart(7)}${'band%'.padStart(7)}${'void%'.padStart(7)}`
  + `${'nPiece'.padStart(7)}`);
for (const key of leaves) {
  const { P } = leafOf(key);
  if (!P.wraps.length) { console.log(`${key.padEnd(12)}${'—'.padStart(11)}  NO WRAPS`); v2rows.push({ leaf: key, wraps: 0 }); continue; }
  const w = P.wraps[P.wraps.length - 1];
  const ring = w.outer.map((p) => [p[0], p[1]]);
  const b = builtToEnclosed(P, ring);
  const piece = b.acc.WARD + b.acc.BLOCK + b.acc.PLOT;
  const nPiece = b.cnt.WARD + b.cnt.BLOCK + b.cnt.PLOT;
  const pc = (v) => `${(100 * v / b.enclosed).toFixed(1)}`;
  v2rows.push({
    leaf: key, wrap: w.index, enclosed: b.enclosed, piece, nPiece, acc: b.acc, cnt: b.cnt,
    builtShare: piece / b.enclosed,
  });
  console.log(`${key.padEnd(12)}${num(b.enclosed).padStart(11)}${num(piece).padStart(11)}`
    + `${pc(piece).padStart(8)}${pc(b.acc.WAY).padStart(7)}${pc(b.acc.WATER).padStart(7)}`
    + `${pc(b.acc.FIELD).padStart(7)}${pc(b.acc.WALLBAND).padStart(7)}${pc(b.acc.VOID).padStart(7)}`
    + `${String(nPiece).padStart(7)}`);
}

const out = arg('json', '');
if (out) { writeFileSync(out, JSON.stringify({ circuits: rows, builtToEnclosed: v2rows }, null, 1)); console.log(`\nwrote ${out}`); }
