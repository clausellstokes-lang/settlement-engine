#!/usr/bin/env node
/**
 * harness/laneDRESS1B/ringSanity.mjs — ⭐⭐⭐ DRESS-1b · THE WRAP-RING SANITY CENSUS,
 * chartered at ODQ §688.3(iii).
 *
 * ⭐ WHAT IT ASKS, AND WHY THE FILL RATIO IS NOT THE QUESTION.
 * A fresh reader called the metropolis wall circuit "two overlapping needle-thin spindles … a
 * rendering fault". DRESS-1 measured `area / bbox = 0.077` on metropolis wrap E1 and put a
 * hypothesis on record: a SELF-FOLDED ring. A fill ratio cannot settle that. A convex sliver and a
 * folded figure-eight both read as a small fill — and they are DIFFERENT DEFECTS with different
 * owners, so a census that reports only the fill sends a constructor car hunting the wrong bug.
 *
 * This census therefore measures the fold DIRECTLY (does any non-adjacent pair of ring edges
 * properly cross?) and reports the fill as a symptom beside it, plus three discriminators:
 *
 *   1 · SIGNED vs EVEN-ODD AREA. A figure-eight's two lobes carry OPPOSITE signs, so its shoelace
 *       area cancels toward zero while the region a reader (and `pointInPolygon`) actually sees
 *       stays large. `evenOdd / |signed| ≫ 1` is the fingerprint of cancellation; ≈ 1 says the
 *       ring genuinely encloses only that much, i.e. a true sliver.
 *   2 · OBB FILL — |area| over the MINIMUM-AREA enclosing rectangle rather than the axis-aligned
 *       one. This one is theorem-backed: every convex region fills at least ½ of its min-area
 *       rectangle. The wrap is traced `convexHull → facetRing`, so an OBB fill below ½ is proof
 *       the ring is not convex, independent of any tuned floor. The axis-aligned fill has no such
 *       floor — a diagonal needle is convex and reads near zero — which is exactly why DRESS-1's
 *       0.077 could not, on its own, convict anything.
 *   3 · REFLEX TURNS, collinearity-tolerant (a resample puts many samples on ONE hull edge, so a
 *       naive cross-product test would call every one of them a defect).
 *
 * ⛔ THE CONTROLS ARE PART OF THE INSTRUMENT, NOT A SEPARATE ERRAND (`--controls`). Identical
 * readings are what a DEAD instrument returns, so the census refuses to be believed on a clean
 * corpus until it has been shown convicting a planted fold on a REAL corpus ring and clearing the
 * same ring unmodified in the same process.
 *
 * Usage:
 *   node dress1b-ring/ringSanity.mjs [--leaves=a,b] [--json=<path>] [--controls] [--dump=<leaf:Ei:side>]
 *
 * Run FROM the lane tree (it imports the tree's own geometry, never a fork of it).
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { convexHull, pointInPolygon } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { liveFaces, faceCentroid } from '../../src/domain/townMap/fabric/partitionArrangement.js';

/* ─────────────────────────────────────────────────────────────────────── THE RULES ── */
/** A non-adjacent proper crossing. HARD: a ring that crosses itself does not bound a solid. */
const RULE_SIMPLE = 'zero non-adjacent proper edge crossings';
/** Symptom floor against the AXIS-ALIGNED bbox — the figure DRESS-1 reported. Tuned, not derived. */
const FILL_FLOOR = 0.25;
/** ⭐ DERIVED, NOT TUNED: a convex region fills ≥ ½ of its min-area rectangle. 0.45 is ½ less an
 *  fp/resample margin, so a red here is a CONVEXITY failure and not a taste call. */
const OBB_FILL_FLOOR = 0.45;
/** Even-odd area over |signed| area. > 1.15 means the shoelace is CANCELLING against itself. */
const CANCEL_BAR = 1.15;
/** ⭐ THE RULE THAT NAMES THE DEFECT RATHER THAN ITS SYMPTOM. `fill` is measured against the
 *  AXIS-ALIGNED bbox, so a ring that merely lies on a diagonal reads low without being wrong;
 *  the elongation of the ring's own MINIMUM-AREA rectangle is orientation-free. Bar set at 8.0:
 *  the corpus's healthiest wrap reads 1.03 and its most elongated PASSING wrap 4.11, so 8.0 sits
 *  a factor of ~1.9 clear of both the highest pass and the lowest fail (22.79). */
const SLIVER_ASPECT_MAX = 8.0;
/** ⭐ THE BAND'S REALISED WIDTH over the width the form DECLARED. Derived from two already-
 *  controlled figures (|area| and perimeter), so it inherits their liveness rather than needing a
 *  plant of its own: bandArea = |outer| − |inner|, meanWidth = bandArea / mean perimeter. */
const BAND_WIDTH_FLOOR = 0.70;

/* ───────────────────────────────────────────────────────────────────── GEOMETRY ── */
const cross3 = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

function signedArea(r) {
  let s = 0;
  for (let i = 0; i < r.length; i++) {
    const a = r[i]; const b = r[(i + 1) % r.length];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
}

function bboxOf(r) {
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (const p of r) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

function perimeter(r) {
  let s = 0;
  for (let i = 0; i < r.length; i++) {
    const a = r[i]; const b = r[(i + 1) % r.length];
    s += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  return s;
}

/**
 * Every NON-ADJACENT pair of ring edges, tested for a PROPER crossing (both segments strictly
 * straddle each other's supporting line). Touches and collinear overlaps are counted separately:
 * a resample legitimately puts consecutive samples on one hull edge, so treating contact as a
 * crossing would convict a healthy ring. O(n²) — n is 26.
 */
function selfIntersections(r) {
  const n = r.length;
  const scale = Math.max(1, perimeter(r));
  const EPS = 1e-9 * scale * scale;
  const sgn = (v) => (v > EPS ? 1 : (v < -EPS ? -1 : 0));
  const onSeg = (p, q, x) => Math.min(p[0], q[0]) - 1e-9 <= x[0] && x[0] <= Math.max(p[0], q[0]) + 1e-9
    && Math.min(p[1], q[1]) - 1e-9 <= x[1] && x[1] <= Math.max(p[1], q[1]) + 1e-9;
  const proper = []; const touches = [];
  for (let i = 0; i < n; i++) {
    const p1 = r[i]; const p2 = r[(i + 1) % n];
    for (let j = i + 1; j < n; j++) {
      // adjacency in a CLOSED ring: j===i+1, and the (0, n-1) wrap-around pair
      if (j === i + 1 || (i === 0 && j === n - 1)) continue;
      const p3 = r[j]; const p4 = r[(j + 1) % n];
      const d1 = sgn(cross3(p3, p4, p1)); const d2 = sgn(cross3(p3, p4, p2));
      const d3 = sgn(cross3(p1, p2, p3)); const d4 = sgn(cross3(p1, p2, p4));
      if (d1 * d2 < 0 && d3 * d4 < 0) {
        // exact crossing point, for the report
        const a1 = p2[1] - p1[1]; const b1 = p1[0] - p2[0]; const c1 = a1 * p1[0] + b1 * p1[1];
        const a2 = p4[1] - p3[1]; const b2 = p3[0] - p4[0]; const c2 = a2 * p3[0] + b2 * p3[1];
        const det = a1 * b2 - a2 * b1;
        const at = det !== 0 ? [(b2 * c1 - b1 * c2) / det, (a1 * c2 - a2 * c1) / det] : null;
        proper.push({ i, j, at: at ? [Number(at[0].toFixed(3)), Number(at[1].toFixed(3))] : null });
      } else if ((d1 === 0 && onSeg(p3, p4, p1)) || (d2 === 0 && onSeg(p3, p4, p2))
        || (d3 === 0 && onSeg(p1, p2, p3)) || (d4 === 0 && onSeg(p1, p2, p4))) {
        touches.push({ i, j });
      }
    }
  }
  return { proper, touches };
}

/** Rotating calipers over the ring's own convex hull — the estate's `convexHull`, not a fork. */
function minAreaRect(r) {
  const h = convexHull(r.map((p) => [p[0], p[1]]));
  if (!h || h.length < 3) return { w: 0, h: 0, area: 0, angle: 0 };
  let best = null;
  for (let i = 0; i < h.length; i++) {
    const a = h[i]; const b = h[(i + 1) % h.length];
    const ex = b[0] - a[0]; const ey = b[1] - a[1];
    const L = Math.hypot(ex, ey);
    if (L === 0) continue;
    const ux = ex / L; const uy = ey / L;
    let u0 = Infinity; let u1 = -Infinity; let v0 = Infinity; let v1 = -Infinity;
    for (const p of h) {
      const u = p[0] * ux + p[1] * uy; const v = -p[0] * uy + p[1] * ux;
      if (u < u0) u0 = u; if (u > u1) u1 = u;
      if (v < v0) v0 = v; if (v > v1) v1 = v;
    }
    const w = u1 - u0; const ht = v1 - v0; const area = w * ht;
    if (!best || area < best.area) best = { w, h: ht, area, angle: Math.atan2(uy, ux) };
  }
  return best || { w: 0, h: 0, area: 0, angle: 0 };
}

/**
 * The area a READER sees: the even-odd region, estimated on a grid with the estate's OWN
 * `pointInPolygon`. A folded ring's shoelace cancels; this does not.
 */
function evenOddArea(r, cells = 600) {
  const bb = bboxOf(r);
  if (!(bb.w > 0) || !(bb.h > 0)) return 0;
  const nx = cells; const ny = cells;
  const dx = bb.w / nx; const dy = bb.h / ny;
  let inside = 0;
  for (let iy = 0; iy < ny; iy++) {
    const py = bb.y0 + (iy + 0.5) * dy;
    for (let ix = 0; ix < nx; ix++) {
      if (pointInPolygon(bb.x0 + (ix + 0.5) * dx, py, r)) inside++;
    }
  }
  return inside * dx * dy;
}

/** Reflex turns, tolerant of the collinear samples a resample legitimately produces. */
function reflexTurns(r) {
  const n = r.length;
  const orient = Math.sign(signedArea(r)) || 1;
  let reflex = 0; let collinear = 0;
  for (let i = 0; i < n; i++) {
    const a = r[(i - 1 + n) % n]; const b = r[i]; const c = r[(i + 1) % n];
    const ux = b[0] - a[0]; const uy = b[1] - a[1];
    const vx = c[0] - b[0]; const vy = c[1] - b[1];
    const La = Math.hypot(ux, uy); const Lb = Math.hypot(vx, vy);
    if (La === 0 || Lb === 0) { collinear++; continue; }
    const sinT = (ux * vy - uy * vx) / (La * Lb);
    if (Math.abs(sinT) < 1e-9) collinear++;
    else if (Math.sign(sinT) !== orient) reflex++;
  }
  return { reflex, collinear };
}

function dupPoints(r) {
  let d = 0;
  for (let i = 0; i < r.length; i++) {
    const a = r[i]; const b = r[(i + 1) % r.length];
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-9) d++;
  }
  return d;
}

/* ────────────────────────────────────────────────────────────────── THE MEASURE ── */
export function measureRing(ring) {
  const r = ring.map((p) => [p[0], p[1]]);
  const bb = bboxOf(r);
  const sa = signedArea(r);
  const si = selfIntersections(r);
  const obb = minAreaRect(r);
  const eo = evenOddArea(r);
  const rt = reflexTurns(r);
  const bboxArea = bb.w * bb.h;
  const fill = bboxArea > 0 ? Math.abs(sa) / bboxArea : 0;
  const obbFill = obb.area > 0 ? Math.abs(sa) / obb.area : 0;
  const cancel = Math.abs(sa) > 1e-9 ? eo / Math.abs(sa) : Infinity;
  const fails = [];
  if (si.proper.length > 0) fails.push('SELF-INTERSECTS');
  if (fill < FILL_FLOOR) fails.push('FILL');
  if (obbFill < OBB_FILL_FLOOR) fails.push('NOT-CONVEX(obb)');
  const obbAspect = Math.min(obb.w, obb.h) > 0 ? Math.max(obb.w, obb.h) / Math.min(obb.w, obb.h) : Infinity;
  if (!(obbAspect <= SLIVER_ASPECT_MAX)) fails.push('SLIVER');
  return {
    verts: r.length,
    dupEdges: dupPoints(r),
    bbox: { w: bb.w, h: bb.h },
    aspect: bb.h > 0 && bb.w > 0 ? Math.max(bb.w, bb.h) / Math.min(bb.w, bb.h) : Infinity,
    signedArea: sa,
    absArea: Math.abs(sa),
    fill,
    obb: { w: obb.w, h: obb.h, area: obb.area, aspect: obbAspect },
    obbFill,
    evenOddArea: eo,
    cancelRatio: cancel,
    perimeter: perimeter(r),
    crossPairs: si.proper.length,
    firstCross: si.proper[0] || null,
    allCrosses: si.proper,
    touchPairs: si.touches.length,
    reflex: rt.reflex,
    collinear: rt.collinear,
    fails,
    verdict: fails.length === 0 ? 'PASS' : `FAIL(${fails.join('+')})`,
  };
}

/* ─────────────────────────────────────────────────────────────────── THE DRIVER ── */
const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const has = (n) => process.argv.includes(`--${n}`);
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

export function buildLeaf(key) {
  const spec = CORPUS.find((s) => s.key === key);
  if (!spec) throw new Error(`NO_SUCH_LEAF ${key}`);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  return { P: buildSettledPartition(input), input, fabric };
}

/** DRESS-1's "plots inside" column, re-derived, so the subject identity is provable not assumed. */
function plotsInside(P, ring) {
  let total = 0; let inside = 0;
  for (const f of liveFaces(P.arrangement)) {
    if (f.cls !== 'PLOT') continue;
    total++;
    const c = faceCentroid(P.arrangement, f.id);
    if (pointInPolygon(c[0], c[1], ring)) inside++;
  }
  return { inside, total };
}

const f2 = (v) => (Number.isFinite(v) ? v.toFixed(2) : '∞');
const f3 = (v) => (Number.isFinite(v) ? v.toFixed(3) : '∞');
const num = (v) => Math.round(v).toLocaleString('en-US');

function rowLine(key, tag, m, pi) {
  return `${key.padEnd(12)} ${tag.padEnd(7)} ${String(m.verts).padStart(3)}  `
    + `${(`${Math.round(m.bbox.w)}x${Math.round(m.bbox.h)}`).padStart(9)} ${f2(m.aspect).padStart(5)}  `
    + `${num(m.absArea).padStart(9)} ${f3(m.fill).padStart(6)} ${f3(m.obbFill).padStart(6)} `
    + `${(`${Math.round(m.obb.w)}x${Math.round(m.obb.h)}`).padStart(9)} ${f2(m.obb.aspect).padStart(6)} ${f2(m.cancelRatio).padStart(6)} `
    + `${String(m.crossPairs).padStart(3)} ${String(m.reflex).padStart(3)} `
    + `${(pi ? `${pi.inside}/${pi.total}` : '').padStart(10)}  ${m.verdict}`;
}

const HEAD = `${'leaf'.padEnd(12)} ${'wrap'.padEnd(7)} ${'n'.padStart(3)}  ${'bbox'.padStart(9)} `
  + `${'asp'.padStart(5)}  ${'|area|'.padStart(9)} ${'fill'.padStart(6)} ${'obbF'.padStart(6)} `
  + `${'minRect'.padStart(9)} ${'obbAsp'.padStart(6)} ${'cancel'.padStart(6)} ${'crs'.padStart(3)} ${'rfx'.padStart(3)} `
  + `${'plotsIn'.padStart(10)}  verdict`;

/* ══════════════════════════════════════════════════════════════════ CONTROLS ══ */
/**
 * ⛔ THE LIVE-INSTRUMENT PROOF. Five plants, each with a DECLARED expectation, on the REAL corpus
 * ring wherever a real ring will do. The census's clean readings mean nothing until these run.
 */
function controls() {
  console.log('══ CONTROL BENCH — every plant declares what it must return before it is run ══\n');
  const results = [];
  const { P } = buildLeaf('metropolis');
  const base = P.wraps[P.wraps.length - 1].outer.map((p) => [p[0], p[1]]);

  const check = (name, ring, want, why) => {
    const m = measureRing(ring);
    const ok = (want.simple === null || (m.crossPairs === 0) === want.simple)
      && (want.fillOk === null || (m.fill >= FILL_FLOOR) === want.fillOk);
    results.push({ name, ok, m });
    console.log(`   ${name}`);
    console.log(`      ${why}`);
    console.log(`      → verts ${m.verts}  |area| ${num(m.absArea)}  evenOdd ${num(m.evenOddArea)}`
      + `  fill ${f3(m.fill)}  obbFill ${f3(m.obbFill)}  cancel ${f2(m.cancelRatio)}`
      + `  crossings ${m.crossPairs}${m.firstCross ? ` (first edges ${m.firstCross.i}×${m.firstCross.j} at ${JSON.stringify(m.firstCross.at)})` : ''}`
      + `  reflex ${m.reflex}  → ${m.verdict}`);
    console.log(`      ${ok ? '✔ INSTRUMENT LIVE — returned what the plant demanded' : '⛔ INSTRUMENT DEAD OR MIS-CALIBRATED — did not return what the plant demanded'}\n`);
    return ok;
  };

  // (b) first, the NEGATIVE control: the untouched corpus ring must read clean.
  check('(b) NEGATIVE · metropolis last wrap, outer, UNMODIFIED',
    base, { simple: true, fillOk: true },
    'a real corpus ring, straight from the build, with nothing done to it');

  // (a) the POSITIVE control: swap two vertices of that same ring.
  const swapped = base.map((p) => [p[0], p[1]]);
  const iA = 0; const iB = Math.floor(base.length / 2);
  const t = swapped[iA]; swapped[iA] = swapped[iB]; swapped[iB] = t;
  check(`(a) POSITIVE · the SAME ring with vertices ${iA} and ${iB} SWAPPED`,
    swapped, { simple: false, fillOk: null },
    'an ordering failure — exactly the shape the folded-ring hypothesis alleges');

  // (a2) a one-vertex fold: a single vertex flung across the ring.
  const flung = base.map((p) => [p[0], p[1]]);
  const bb = bboxOf(base);
  flung[3] = [bb.x0 + bb.w * 0.5, bb.y0 + bb.h * 1.4];
  check('(a2) POSITIVE · the SAME ring with ONE vertex flung outside it',
    flung, { simple: false, fillOk: null },
    'a single stray vertex — the cheapest possible fold, and the easiest for a census to miss');

  // (c) a textbook bowtie: signed area must cancel to ~0 while even-odd stays large.
  check('(c) POSITIVE · a textbook BOWTIE (100x100, two equal lobes)',
    [[0, 0], [100, 100], [100, 0], [0, 100]], { simple: false, fillOk: false },
    'the cancellation fingerprint: |signed| ≈ 0 while the even-odd region is half the bbox');

  // (d) ⭐ THE DISCRIMINATOR: a SIMPLE convex diagonal needle with a tiny fill. If the census
  //     called this a fold it would be conflating the symptom with the defect.
  check('(d) NEGATIVE-BUT-LOW-FILL · a SIMPLE convex diagonal needle',
    [[0, 0], [2, 0], [402, 400], [400, 400]], { simple: true, fillOk: false },
    'convex and simple, yet fill ≈ 0.005 — proves LOW FILL DOES NOT IMPLY A FOLD,'
    + ' and its min-area rect is what the SLIVER rule must convict it on instead');

  // ⭐⭐ (f)/(g) THE TIGHTEST PAIR: the plant goes on the SUSPECT RING ITSELF. metropolis E1.outer
  //     carries 17 COLLINEAR vertices, and a crossing test that tolerates collinearity is exactly
  //     the kind that could be blind on that ring and nowhere else. So the question "if E1.outer
  //     WERE folded, would this instrument say so?" is answered on E1.outer and not by analogy.
  const e1 = P.wraps.find((w) => w.index === 1).outer.map((p) => [p[0], p[1]]);
  check('(g) NEGATIVE · metropolis E1 OUTER — THE SUSPECT RING — unmodified',
    e1, { simple: true, fillOk: false },
    'the ring DRESS-1 measured at fill 0.077; it must read SIMPLE and still fail on fill/sliver');
  const e1swap = e1.map((p) => [p[0], p[1]]);
  const s1 = 4; const s2 = 17;
  const tt = e1swap[s1]; e1swap[s1] = e1swap[s2]; e1swap[s2] = tt;
  check(`(f) POSITIVE · THE SUSPECT RING with vertices ${s1} and ${s2} SWAPPED`,
    e1swap, { simple: false, fillOk: null },
    'the same ring, folded on purpose, with its 17 collinear vertices left in place');

  // (e) ⭐ THE SLIVER RULE'S OWN NEGATIVE CONTROL — a fat convex ring must NOT trip it, or the
  //     rule would be convicting the corpus rather than measuring it.
  check('(e) NEGATIVE · a regular 26-gon (radius 300)',
    Array.from({ length: 26 }, (_, i) => [300 * Math.cos((i * 2 * Math.PI) / 26), 300 * Math.sin((i * 2 * Math.PI) / 26)]),
    { simple: true, fillOk: true },
    'the fattest ring a 26-facet economy can trace — every rule must clear it');

  const live = results.filter((x) => x.ok).length;
  console.log(`CONTROL_BENCH ${live}/${results.length} plants returned their declared reading`
    + ` — ${live === results.length ? 'the census is LIVE' : '⛔ DO NOT BELIEVE THE CENSUS'}\n`);
  return live === results.length;
}

/* ══════════════════════════════════════════════════════════════════ THE CENSUS ══ */
function census() {
  console.log(`FILL_FLOOR ${FILL_FLOOR}   OBB_FILL_FLOOR ${OBB_FILL_FLOOR} (derived: a convex region fills ≥ ½ its min-area rect)`);
  console.log(`RULES · ${RULE_SIMPLE} · fill ≥ ${FILL_FLOOR} · obbFill ≥ ${OBB_FILL_FLOOR}`
    + ` · min-area-rect aspect ≤ ${SLIVER_ASPECT_MAX} (SLIVER)\n`);
  console.log(HEAD);
  console.log('-'.repeat(HEAD.length));
  const rows = [];
  let wrapCount = 0; let failCount = 0; let unwalled = 0;
  for (const key of leaves) {
    const { P } = buildLeaf(key);
    if (!P.wraps.length) {
      unwalled++;
      console.log(`${key.padEnd(12)} ${'—'.padEnd(7)} ${'  -'}  ${'—'.padStart(9)} ${'—'.padStart(5)}  ${'—'.padStart(9)}${' '.repeat(30)}   NO WRAPS`);
      rows.push({ leaf: key, wraps: 0 });
      continue;
    }
    for (const w of P.wraps) {
      for (const side of ['outer', 'inner']) {
        const ring = w[side].map((p) => [p[0], p[1]]);
        const m = measureRing(ring);
        const pi = plotsInside(P, ring);
        wrapCount++;
        if (m.fails.length) failCount++;
        console.log(rowLine(key, `E${w.index}.${side === 'outer' ? 'o' : 'i'}`, m, pi));
        rows.push({
          leaf: key, wrap: w.index, side, year: w.year, facets: w.facets,
          bandWidth: w.bandWidth, clampedFacets: w.clampedFacets, frozenRadius: w.frozenRadius,
          plotsInside: pi.inside, plotsTotal: pi.total, ...m,
        });
      }
    }
  }
  console.log('-'.repeat(HEAD.length));
  console.log(`CENSUS rings=${wrapCount} failing=${failCount} unwalled_leaves=${unwalled} leaves=${leaves.length}`);

  /* ── THE BAND, which is the thing a reader actually SEES as the wall ──────────────────────
   * The two rings are traced independently (`facetRing(shrinkRing(outer, …))`) and `shrinkRing`
   * moves each point RADIALLY toward the extent centre — not along the ring's own inward normal.
   * Where an edge runs nearly radially the displacement is almost PARALLEL to that edge, so the
   * band across it collapses. That is invisible in either ring's own numbers and visible here. */
  console.log(`\n── THE BAND · realised width against the width the form declared (floor ${BAND_WIDTH_FLOOR})`);
  console.log(`${'leaf/wrap'.padEnd(16)}${'declared'.padStart(9)}${'bandArea'.padStart(10)}${'meanW'.padStart(8)}${'ratio'.padStart(7)}${'obbAsp'.padStart(8)}  verdict`);
  const byWrap = new Map();
  for (const r of rows) {
    if (!r.side) continue;
    const k = `${r.leaf}|E${r.wrap}`;
    if (!byWrap.has(k)) byWrap.set(k, {});
    byWrap.get(k)[r.side] = r;
  }
  let bandFails = 0;
  for (const [k, v] of byWrap) {
    if (!v.outer || !v.inner) continue;
    const ba = v.outer.absArea - v.inner.absArea;
    const mp = (v.outer.perimeter + v.inner.perimeter) / 2;
    const mw = mp > 0 ? ba / mp : 0;
    const ratio = v.outer.bandWidth > 0 ? mw / v.outer.bandWidth : 0;
    const bad = ratio < BAND_WIDTH_FLOOR;
    if (bad) bandFails++;
    v.outer.bandMeanWidth = mw; v.outer.bandRatio = ratio;
    console.log(k.padEnd(16) + v.outer.bandWidth.toFixed(2).padStart(9) + Math.round(ba).toLocaleString('en-US').padStart(10)
      + mw.toFixed(3).padStart(8) + ratio.toFixed(3).padStart(7) + f2(v.outer.obb.aspect).padStart(8)
      + `  ${bad ? '⛔ BAND UNDER-WIDTH' : 'ok'}`);
  }
  console.log(`BAND wraps=${byWrap.size} under-width=${bandFails}`
    + ` — the deficit tracks the ring's own elongation, which is `
    + `\`shrinkRing\`'s radial displacement acting along the edge instead of across it`);
  failCount += bandFails;
  const bad = rows.filter((r) => r.fails && r.fails.length);
  if (bad.length) {
    console.log('\n⛔ EVERY FAILING RING, IN FULL:');
    for (const r of bad) {
      console.log(`   ${r.leaf} E${r.wrap}.${r.side}  ${r.verdict}`);
      console.log(`      verts ${r.verts} (dup-edges ${r.dupEdges}, collinear ${r.collinear}, reflex ${r.reflex})`
        + `  bbox ${Math.round(r.bbox.w)}x${Math.round(r.bbox.h)} asp ${f2(r.aspect)}`);
      console.log(`      |signed| ${num(r.absArea)}  evenOdd ${num(r.evenOddArea)}  cancel ${f2(r.cancelRatio)}`
        + `  fill ${f3(r.fill)}  obb ${Math.round(r.obb.w)}x${Math.round(r.obb.h)} (asp ${f2(r.obb.aspect)}) obbFill ${f3(r.obbFill)}`);
      console.log(`      crossings ${r.crossPairs}${r.crossPairs ? `  first ${r.firstCross.i}×${r.firstCross.j} at ${JSON.stringify(r.firstCross.at)}` : ''}`
        + `  touches ${r.touchPairs}  clampedFacets ${r.clampedFacets}  bandWidth ${f2(r.bandWidth)}`);
      if (r.crossPairs) console.log(`      all crossing edge pairs: ${r.allCrosses.map((c) => `${c.i}×${c.j}`).join(' ')}`);
    }
  }
  const out = arg('json', '');
  if (out) { writeFileSync(out, JSON.stringify(rows, null, 1)); console.log(`\nwrote ${out}`); }
  return failCount;
}

/* ─────────────────────────────────────────────────────────────────────── main ── */
/** ⚠ MAIN IS GUARDED. `measureRing`/`buildLeaf` are exported so a probe (or a later test) can
 *  reuse the exact instrument rather than fork it — and an unguarded main would make every such
 *  import silently re-run the whole 18-leaf census. It bit this file once during its own build. */
const IS_MAIN = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
const dump = IS_MAIN ? arg('dump', '') : '';
if (!IS_MAIN) { /* imported as a library — measure nothing, print nothing */ } else if (dump) {
  const [lk, wi, side] = dump.split(':');
  const { P } = buildLeaf(lk);
  const w = P.wraps.find((x) => `E${x.index}` === wi);
  const ring = w[side || 'outer'].map((p) => [p[0], p[1]]);
  console.log(JSON.stringify({
    leaf: lk, wrap: wi, side: side || 'outer', year: w.year, facets: w.facets,
    bandWidth: w.bandWidth, clampedFacets: w.clampedFacets, frozenRadius: w.frozenRadius,
    ring: ring.map((p) => [Number(p[0].toFixed(4)), Number(p[1].toFixed(4))]),
    measure: (() => { const m = measureRing(ring); delete m.allCrosses; return m; })(),
  }, null, 1));
} else {
  let ok = true;
  if (has('controls')) ok = controls();
  const failing = census();
  process.exitCode = (!ok || failing) ? 1 : 0;
}
