/**
 * i12-tangential.mjs — REG-I0 · INSTRUMENT 12 · ⛔ THE TANGENTIAL-OR-CLEAR CENSUS.
 *
 * Built by CAR-INSTRUMENTS (ODQ §657.2) against review I18: *"Tangential-or-clear census (§645.2)
 * minted, never built — sole tree match is a comment in densification.mjs:94; its own embargo bars
 * asserting walls-end-districts from eyes alone, so one of the review's yardstick laws is
 * instrument-unverifiable."*
 *
 * ═══════════════ THE LAW ═══════════════
 * §575.1, the owner's directive, TWO LIMBS: buildings nearest the wall either
 *   (A) align TANGENTIALLY to the wall's local curve, or
 *   (B) leave CLEAR SPACE on both sides of the wall.
 * They are REGIME-DEPENDENT and the regime derives from the settlement's own facts: regime B is
 * the military-active wall (intervallum kept clear inside, cleared defensive zone outside);
 * regime A is the long-peace encroachment wall (plots back onto the circuit, so the wall IS
 * their back wall). §645.2 adds the third clause and the embargo: *"every building within reach
 * of the wall is tangential to its curve OR has clear ground both sides (§575's law verbatim),
 * and NO body's footprint crosses the line; zeros valid only with a planted-violation control.
 * Until this census runs green with its control, the wall-ends-districts claim is not to be
 * asserted from eyes alone."*
 *
 * ═══════════════ THREE CLAUSES, COUNTED SEPARATELY AND NEVER MERGED ═══════════════
 *   C1 · CROSSING          a body whose FOOTPRINT intersects the wall line. A violation outright,
 *                          whichever limb it might otherwise have claimed.
 *   C2 · TANGENT-OR-CLEAR  a body within REACH is lawful iff
 *                            (A) its own axis lies within BAND° of the wall's LOCAL tangent, or
 *                            (B) it stands clear (d ≥ CLEAR on its side) AND the stretch of wall
 *                                it faces is clear on BOTH sides — nothing within CLEAR_IN inside
 *                                or CLEAR_OUT outside, anywhere along that stretch.
 *                          ⭐ Limb B is a property of the STRETCH, not of the body, and that is
 *                          what makes the law falsifiable rather than tautological: a body sitting
 *                          in the intervallum destroys limb B for its whole stretch, so every
 *                          non-tangential neighbour on that stretch is convicted with it — which
 *                          is exactly §575.1's regime B ("kept clear for troop movement").
 *   C3 · CONTINUITY        §645.1's own read, measured rather than eyeballed: the owner's catch was
 *                          "fabric CONTINUOUS across the wall line (same grain both sides)". So the
 *                          tangential SHARE is reported separately for the inside and outside
 *                          cohorts of each wall. This clause SCORES NOTHING — it is not in §575 —
 *                          but a wall whose two cohorts agree at a LOW tangential share is the
 *                          §645.1 finding in numbers.
 *
 * ═══════════════ EVERY THRESHOLD IS DERIVED FROM THE FABRIC, NOT CHOSEN ═══════════════
 * The wall publishes its own band decomposition, and it is already frontage-derived — MEASURED,
 * not assumed: on `town` `bandParts.outer` = 4.8241 = frontage exactly, and `bandParts.inner`
 * = 2.4120 = frontage/2; on `city` `inner` = 2.6797 = frontage/2 likewise.
 *   half      = w.bandParts.half              the wall band's own half-width (its physical extent)
 *   inner     = w.bandParts.inner             the intervallum / wall-lane width
 *   outer     = w.bandParts.outer             the glacis (≈ frontage where glacisClear, ≈0 where not)
 *   CLEAR_IN  = half + inner                  regime B's inside clearance
 *   CLEAR_OUT = half + outer                  regime B's outside clearance
 *   PLOT_DEPTH= the leaf's own MEDIAN parcel depth, measured perpendicular to each parcel's own
 *               `plotLine` — the depth of one plot row, and the natural meaning of "nearest"
 *   REACH     = half + max(inner, outer) + PLOT_DEPTH
 * Every one of these is reported IN FRONTAGES beside its map-unit value so the derivation is
 * legible and comparable across leaves.
 *
 * ⚠ AND NO VERDICT IS HOSTAGE TO ONE CONSTANT. `--sweep` reports the violation counts over a grid
 * of REACH multipliers × tangency BANDs, so a reader can see whether a zero is a property of the
 * fabric or of a threshold.
 *
 * ═══════════════ TWO DEFINITIONS OF "THE LINE", REPORTED SEPARATELY ═══════════════
 * `w.polygon` is the DRAWN ring (shifted off the claim centreline by `bandParts.shift`) and
 * `w.claimLine` is the circuit's own claim line — on `town` they differ by ~1.2 units. §648.3
 * banked "a ratio over two definitions of one wet set" as an instrument-defect class, so both are
 * measured and neither is merged into the other: `drawn` is the primary (it is the ink the eye
 * judges) and `claim` rides beside it as the cross-check.
 *
 * ⛔ OLD-CORE RINGS ARE NOT WALLS. §250.5: a superseded circuit is not a wall any more, so it
 * cannot be straddled or encroached upon — i10's straddle census already excludes them and this
 * one follows. They are measured anyway and reported on their own non-scoring row, because review
 * B4 says the relict rings are a live defect of a different kind.
 *
 * Usage: node i12-tangential.mjs --wt=<worktree> [--leaves=ALL|a,b] [--json=<out>] [--sweep]
 *        node i12-tangential.mjs --wt=<worktree> --controls
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { r2, r4 } from './lib/geom.mjs';
import { drawnBodySet } from './i10-censuses.mjs';

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';

export const TANGENT_BAND_DEG = 15;   // L-REG-31's own provisional band, borrowed for tangency
export const ASPECT_MIN = 1.25;       // below this a footprint has no axis to align — EXEMPT, not lawful
export const REACH_MULT = 1.0;

/* ─────────────────────── geometry (local; lib/geom.mjs is shared and left alone) ─────────────────────── */
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const hyp = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export function segClosest(p, a, b) {
  const vx = b[0] - a[0], vy = b[1] - a[1];
  const L2 = vx * vx + vy * vy;
  if (L2 === 0) return { d: hyp(p, a), t: 0 };
  let t = ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / L2;
  t = Math.max(0, Math.min(1, t));
  return { d: Math.hypot(p[0] - (a[0] + t * vx), p[1] - (a[1] + t * vy)), t };
}

/** distance from p to a POLYLINE, plus the index of the nearest segment and that segment's heading */
export function toLine(p, line) {
  let best = { d: Infinity, i: -1, t: 0 };
  for (let i = 0; i < line.length - 1; i++) {
    const { d, t } = segClosest(p, line[i], line[i + 1]);
    if (d < best.d) best = { d, i, t };
  }
  const a = line[best.i], b = line[best.i + 1];
  return {
    ...best, ang: Math.atan2(b[1] - a[1], b[0] - a[0]),
    foot: [a[0] + best.t * (b[0] - a[0]), a[1] + best.t * (b[1] - a[1])],
  };
}

export function segsCross(p1, p2, p3, p4) {
  const d = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

/** does the closed polygon's BOUNDARY cross the polyline anywhere? */
export function polyCrossesLine(poly, line) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    for (let j = 0; j < line.length - 1; j++) if (segsCross(a, b, line[j], line[j + 1])) return true;
  }
  return false;
}

/**
 * THE BODY'S OWN AXIS, DERIVED FROM ITS POLYGON — never read off a stamp the fabric wrote.
 * Minimum-area bounding rectangle by the rotating-calipers identity (a min-area rect has a side
 * flush with an edge of the hull, and testing every EDGE of the polygon is a superset of that).
 * Returns the LONG side's heading and the aspect ratio; a near-square body has no axis to align
 * and is reported EXEMPT rather than quietly counted lawful.
 */
export function bodyAxis(poly) {
  let best = null;
  for (let i = 0; i < poly.length; i++) {
    const e = sub(poly[(i + 1) % poly.length], poly[i]);
    const L = Math.hypot(e[0], e[1]);
    if (L < 1e-9) continue;
    const ux = e[0] / L, uy = e[1] / L;
    let lo1 = Infinity, hi1 = -Infinity, lo2 = Infinity, hi2 = -Infinity;
    for (const p of poly) {
      const a = p[0] * ux + p[1] * uy, b = -p[0] * uy + p[1] * ux;
      if (a < lo1) lo1 = a; if (a > hi1) hi1 = a;
      if (b < lo2) lo2 = b; if (b > hi2) hi2 = b;
    }
    const w = hi1 - lo1, h = hi2 - lo2, area = w * h;
    if (!best || area < best.area) best = { area, w, h, ang: Math.atan2(uy, ux) };
  }
  if (!best) return { ang: null, aspect: 1 };
  const long = Math.max(best.w, best.h), short = Math.min(best.w, best.h);
  // the long side's heading: the edge direction if w is the longer, else its perpendicular
  const ang = best.w >= best.h ? best.ang : best.ang + Math.PI / 2;
  return { ang, aspect: short > 1e-9 ? long / short : Infinity, long, short };
}

/** the acute angle between two undirected headings, in degrees, folded into [0,90] */
export const foldDeg = (a, b) => {
  let d = ((a - b) * 180) / Math.PI;
  d = ((d % 180) + 180) % 180;
  return d > 90 ? 180 - d : d;
};

export function polyCentroid(poly) {
  let A = 0, cx = 0, cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length];
    const f = x1 * y2 - x2 * y1;
    A += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f;
  }
  if (Math.abs(A) < 1e-12) {
    return [poly.reduce((s, p) => s + p[0], 0) / poly.length, poly.reduce((s, p) => s + p[1], 0) / poly.length];
  }
  return [cx / (3 * A), cy / (3 * A)];
}

/* ─────────────────────── the derived thresholds ─────────────────────── */

/** the leaf's own median plot DEPTH — the extent of each parcel perpendicular to its own plotLine */
export function plotDepth(fabric) {
  const ds = [];
  for (const p of fabric.parcels || []) {
    if (!p.polygon || p.polygon.length < 3 || !p.plotLine || p.plotLine.length < 2) continue;
    const e = sub(p.plotLine[1], p.plotLine[0]);
    const L = Math.hypot(e[0], e[1]);
    if (L < 1e-9) continue;
    const nx = -e[1] / L, ny = e[0] / L;
    let lo = Infinity, hi = -Infinity;
    for (const q of p.polygon) { const t = q[0] * nx + q[1] * ny; if (t < lo) lo = t; if (t > hi) hi = t; }
    ds.push(hi - lo);
  }
  if (!ds.length) return null;
  ds.sort((a, b) => a - b);
  return ds[Math.floor(ds.length / 2)];
}

export function thresholds(fabric, w, reachMult = REACH_MULT) {
  const bp = w.bandParts || {};
  const F = fabric.wallCircuit.frontage || null;
  const half = bp.half != null ? bp.half : (w.band || 0);
  const inner = bp.inner != null ? bp.inner : 0;
  const outer = bp.outer != null ? bp.outer : 0;
  const depth = plotDepth(fabric) || (F ? F * 2 : half * 2);
  const reach = (half + Math.max(inner, outer) + depth) * reachMult;
  const inF = (v) => (F ? r4(v / F) : null);
  return {
    frontage: r4(F), half: r4(half), inner: r4(inner), outer: r4(outer), plotDepth: r4(depth),
    clearIn: r4(half + inner), clearOut: r4(half + outer), reach: r4(reach), reachMult,
    inFrontages: { half: inF(half), inner: inF(inner), outer: inF(outer), plotDepth: inF(depth), reach: inF(reach) },
  };
}

/* ─────────────────────── the census ─────────────────────── */

/**
 * @param lineKind 'drawn' (w.polygon, the ink) or 'claim' (w.claimLine, the circuit's own line)
 */
export function tangentialCensus(fabric, w, S, {
  bandDeg = TANGENT_BAND_DEG, reachMult = REACH_MULT, lineKind = 'drawn',
  extraBodies = [], aspectMin = ASPECT_MIN, returnRows = false, closeRing = false,
} = {}) {
  const T = thresholds(fabric, w, reachMult);
  const base = (lineKind === 'claim' ? w.claimLine : w.polygon) || w.polygon;
  if (!base || base.length < 2) return { applicable: false, status: 'NO LINE on this wall' };
  // ⚠⚠ THE RING IS PUBLISHED OPEN AND USED CLOSED, AND THE CENSUS MUST NOT PICK ONE SILENTLY.
  // `pointIn(w.polygon, …)` — which i10 and the shipped law both use — closes the ring implicitly,
  // but the vertex list does NOT repeat its first point: measured end-gaps run 0.3 u (town) to
  // 43.7 u (metropolis) on perimeters of 1,800–3,100 u, and `halfRing` does not predict it
  // (metropolis/polycentric/crossing all report halfRing=false with gaps of 43.7/11.5/27.6).
  // A half-ring's gap is the RIVER and no stone is drawn across it, so closing would invent
  // crossings; a full ring's gap is a hole in the vertex list. DEFAULT IS OPEN — the census must
  // never convict a body of crossing ink that was never laid — and `--xcheck` reports the closed
  // reading beside it as its own row, never merged (the §648.3 two-definitions discipline).
  const line = closeRing && (base[0][0] !== base[base.length - 1][0] || base[0][1] !== base[base.length - 1][1])
    ? [...base, base[0]] : base;
  const closed = w.closedPolygon && w.closedPolygon.length > 2 ? w.closedPolygon : line;
  const bodies = [...drawnBodySet(fabric), ...extraBodies];

  // pass 1 · place every body against the line
  const near = [];
  let crossing = 0;
  const crossers = [];
  for (const b of bodies) {
    const c = polyCentroid(b.poly);
    const hit = toLine(c, line);
    if (hit.d > T.reach + 40) continue;                       // cheap reject well outside the annulus
    const inside = S.pointIn(closed, c[0], c[1]);
    const crosses = polyCrossesLine(b.poly, line);
    if (crosses) { crossing++; if (crossers.length < 20) crossers.push({ key: b.key, kind: b.kind, c: [r2(c[0]), r2(c[1])], d: r4(hit.d) }); }
    if (hit.d > T.reach && !crosses) continue;
    const ax = bodyAxis(b.poly);
    near.push({
      key: b.key, kind: b.kind, c, d: hit.d, seg: hit.i, tangentAng: hit.ang, foot: hit.foot, inside, crosses,
      axis: ax.ang, aspect: ax.aspect,
      delta: ax.ang == null ? null : foldDeg(ax.ang, hit.ang),
    });
  }

  // pass 2 · the STRETCH clearance profile — per segment, the closest intruder on each side
  const nSeg = line.length - 1;
  const minIn = new Array(nSeg).fill(Infinity), minOut = new Array(nSeg).fill(Infinity);
  for (const b of near) {
    const arr = b.inside ? minIn : minOut;
    if (b.d < arr[b.seg]) arr[b.seg] = b.d;
  }
  // the stretch is the arc within REACH of arclength either way
  const segLen = [];
  for (let i = 0; i < nSeg; i++) segLen.push(hyp(line[i], line[i + 1]));
  const stretchClear = (si) => {
    let acc = 0;
    for (let j = si; j >= 0 && acc <= T.reach; j--) {
      if (minIn[j] < T.clearIn || minOut[j] < T.clearOut) return false;
      acc += segLen[j];
    }
    acc = 0;
    for (let j = si; j < nSeg && acc <= T.reach; j++) {
      if (minIn[j] < T.clearIn || minOut[j] < T.clearOut) return false;
      acc += segLen[j];
    }
    return true;
  };

  // pass 3 · the verdict per body
  let lawfulA = 0, lawfulB = 0, exemptSquare = 0;
  const offenders = [];
  const cohort = { inside: { n: 0, tangential: 0, deltas: [] }, outside: { n: 0, tangential: 0, deltas: [] } };
  for (const b of near) {
    const co = b.inside ? cohort.inside : cohort.outside;
    if (b.delta != null && b.aspect >= aspectMin) { co.n++; co.deltas.push(b.delta); if (b.delta <= bandDeg) co.tangential++; }
    if (b.crosses) { b.verdict = 'CROSSING'; continue; }
    if (b.aspect < aspectMin) { exemptSquare++; b.verdict = 'EXEMPT_NO_AXIS'; continue; }
    if (b.delta != null && b.delta <= bandDeg) { lawfulA++; b.verdict = 'LAWFUL_A_TANGENTIAL'; continue; }
    const clearEnough = b.inside ? b.d >= T.clearIn : b.d >= T.clearOut;
    if (clearEnough && stretchClear(b.seg)) { lawfulB++; b.verdict = 'LAWFUL_B_CLEAR'; continue; }
    b.verdict = clearEnough ? 'VIOLATION_STRETCH_NOT_CLEAR' : 'VIOLATION_IN_CLEAR_ZONE_NOT_TANGENTIAL';
    if (offenders.length < 30) {
      offenders.push({ key: b.key, kind: b.kind, c: [r2(b.c[0]), r2(b.c[1])], d: r4(b.d), delta: r4(b.delta), aspect: r4(b.aspect), inside: b.inside, verdict: b.verdict });
    }
  }
  const violations = near.filter((b) => b.verdict && b.verdict.startsWith('VIOLATION')).length;
  const med = (xs) => (xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : null);

  return {
    applicable: true, wallKind: w.kind, form: w.form, lineKind, lineVertices: line.length,
    thresholds: T, bandDeg, aspectMin,
    bodiesConsidered: bodies.length, withinReach: near.length,
    c1Crossing: crossing, crossers,
    c2: { lawfulTangential: lawfulA, lawfulClear: lawfulB, exemptNoAxis: exemptSquare, violations },
    c3Continuity: {
      inside: { n: cohort.inside.n, tangentialShare: cohort.inside.n ? r4(cohort.inside.tangential / cohort.inside.n) : null, medianDelta: r2(med(cohort.inside.deltas)) },
      outside: { n: cohort.outside.n, tangentialShare: cohort.outside.n ? r4(cohort.outside.tangential / cohort.outside.n) : null, medianDelta: r2(med(cohort.outside.deltas)) },
    },
    offenders,
    // ⚠ the offender list is CAPPED at 30 for the report, so a control must never read its plant
    // out of it — `rows` is the uncapped truth and exists for exactly that reason.
    rows: returnRows ? near : undefined,
    pass: crossing === 0 && violations === 0,
  };
}

/** the uncapped verdict for one body key — what a planted control must read */
export const verdictOf = (res, key) => (res.rows || []).find((b) => b.key === key);

/** every leaf's working circuits (old-core measured separately, never scored — §250.5) */
export function leafCensus(fabric, S, opts = {}) {
  const walls = fabric.walls || [];
  const working = walls.filter((w) => w.kind !== 'old-core');
  const relict = walls.filter((w) => w.kind === 'old-core');
  return {
    name: fabric.meta.name, tier: fabric.meta.tier,
    working: working.map((w) => tangentialCensus(fabric, w, S, opts)),
    relictNonScoring: relict.map((w) => tangentialCensus(fabric, w, S, opts)),
  };
}

export async function sealed(wt) {
  const H = (p) => pathToFileURL(join(wt, p)).href;
  const [ex, ea, fg] = await Promise.all([
    import(H('harness/exemplars.mjs')),
    import(H('src/domain/townMap/fabric/epochAxis.js')),
    import(H('src/domain/townMap/fabric/fabricGeometry.js')),
  ]);
  return { buildOne: ex.buildOne, CORPUS: ex.CORPUS, pointIn: ea.pointIn, centroid: fg.centroid };
}

/* ─────────────────────── controls ─────────────────────── */

/**
 * ⛔ §645.2's OWN RULE: "zeros valid only with a planted-violation control." Four plants, and the
 * set is chosen so the instrument must both CONVICT and ACQUIT — a census that convicts everything
 * is as dead as one that convicts nothing.
 */
async function controls(wt, S, leafKey) {
  const { fabric } = S.buildOne(S.CORPUS.find((s) => s.key === leafKey));
  const w = (fabric.walls || []).find((x) => x.kind !== 'old-core');
  if (!w) { process.stdout.write(`⛔ leaf '${leafKey}' has no working circuit — pick a walled leaf\n`); process.exitCode = 1; return null; }
  const T = thresholds(fabric, w);
  const line = w.polygon;
  const live = [];

  const B0 = tangentialCensus(fabric, w, S);
  process.stdout.write(`P0 baseline (${leafKey}/${w.kind})  withinReach=${B0.withinReach}  C1 crossing=${B0.c1Crossing}  C2 violations=${B0.c2.violations}`
    + `  (lawfulA=${B0.c2.lawfulTangential} lawfulB=${B0.c2.lawfulClear} exempt=${B0.c2.exemptNoAxis})\n`);
  process.stdout.write(`   thresholds: reach=${T.reach} (${T.inFrontages.reach} frontages)  clearIn=${T.clearIn}  clearOut=${T.clearOut}  plotDepth=${T.plotDepth}  frontage=${T.frontage}\n`);

  // a site mid-line, and the local tangent there
  const si = Math.floor((line.length - 1) / 2);
  const a = line[si], b = line[si + 1];
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux;
  const rect = (cx, cy, theta, L, W) => {
    const cx1 = Math.cos(theta), sy1 = Math.sin(theta);
    return [[-L / 2, -W / 2], [L / 2, -W / 2], [L / 2, W / 2], [-L / 2, W / 2]]
      .map(([x, y]) => [cx + x * cx1 - y * sy1, cy + x * sy1 + y * cx1]);
  };
  const L = Math.max(6, T.plotDepth), W = Math.max(2, T.plotDepth * 0.4);

  // P1 · a body laid ACROSS the line — C1 must count exactly one more
  const across = { key: 'CONTROL.crossing', kind: 'control', poly: rect(mid[0], mid[1], ang + Math.PI / 2, T.clearIn * 2 + L, W) };
  const P1 = tangentialCensus(fabric, w, S, { extraBodies: [across] });
  process.stdout.write(`P1 body laid ACROSS the line   C1 crossing=${P1.c1Crossing} (baseline ${B0.c1Crossing})\n`);
  live.push(['P1 C1 counts a footprint laid across the wall, exactly one more', P1.c1Crossing === B0.c1Crossing + 1]);

  // P2 · a PERPENDICULAR body inside the clear zone, not touching the line — C2 must convict it.
  // ⚠⚠ BITTEN, AND THE BITE IS RECORDED: the first plant used the same L as P1 and on `city`
  // (clearIn 5.47, plotDepth 3.99) a 6-unit body centred at clearIn/2 REACHED BACK ACROSS THE
  // LINE and was correctly filed as CROSSING — so C2 never moved and the control read BROKEN when
  // the instrument was right. The plant must be sized to the clear zone it is meant to stand in.
  const off = T.clearIn * 0.5;
  const pL = Math.max(1.2, Math.min(L, T.clearIn * 0.7));
  const pW = Math.max(0.4, pL * 0.35);
  const perpC = [mid[0] + nx * off, mid[1] + ny * off];
  const inSide = S.pointIn(w.closedPolygon || line, perpC[0], perpC[1]);
  const perpC2 = inSide ? perpC : [mid[0] - nx * off, mid[1] - ny * off];
  const perp = { key: 'CONTROL.perpendicular', kind: 'control', poly: rect(perpC2[0], perpC2[1], ang + Math.PI / 2, pL, pW) };
  const P2 = tangentialCensus(fabric, w, S, { extraBodies: [perp], returnRows: true });
  const p2row = verdictOf(P2, 'CONTROL.perpendicular');
  process.stdout.write(`P2 PERPENDICULAR in the clear zone  C2 violations=${P2.c2.violations} (baseline ${B0.c2.violations})`
    + `  planted-body verdict=${p2row ? p2row.verdict : '(NOT SEEN AT ALL)'}  d=${p2row ? r4(p2row.d) : '?'} Δ=${p2row ? r2(p2row.delta) : '?'}\n`);
  // ⚠ NOT "exactly one more": a body standing in the clear zone also DESTROYS limb B for its
  // neighbours on that stretch, so the count may rise by more — that coupling is the law working
  // (P6 proves it directly), and demanding +1 exactly here would be demanding the law be wrong.
  live.push(['P2 C2 convicts a perpendicular body standing in the clear zone, with the clear-zone verdict',
    P2.c2.violations > B0.c2.violations && !!p2row && p2row.verdict === 'VIOLATION_IN_CLEAR_ZONE_NOT_TANGENTIAL']);

  // P3 · the SAME body turned TANGENTIAL — the instrument must ACQUIT it (limb A)
  const tang = { key: 'CONTROL.tangential', kind: 'control', poly: rect(perpC2[0], perpC2[1], ang, pL, pW) };
  const P3 = tangentialCensus(fabric, w, S, { extraBodies: [tang], returnRows: true });
  const p3row = verdictOf(P3, 'CONTROL.tangential');
  process.stdout.write(`P3 the SAME body turned TANGENTIAL  C2 violations=${P3.c2.violations} (baseline ${B0.c2.violations})  lawfulA=${P3.c2.lawfulTangential} (baseline ${B0.c2.lawfulTangential})`
    + `  planted-body verdict=${p3row ? p3row.verdict : '(NOT SEEN)'} Δ=${p3row ? r2(p3row.delta) : '?'}\n`);
  // ⚠ the violations delta is PRINTED but not asserted: a tangential body still occupies the clear
  // zone, so it can still cost its neighbours limb B. Limb A acquits the BODY, not the stretch.
  live.push(['P3 the instrument ACQUITS the same body turned tangential (limb A is real, not a rubber stamp)',
    P3.c2.lawfulTangential === B0.c2.lawfulTangential + 1 && !!p3row && p3row.verdict === 'LAWFUL_A_TANGENTIAL']);

  // P4 · a perpendicular body FAR outside reach — must change nothing at all
  const farC = [mid[0] + nx * (T.reach * 4), mid[1] + ny * (T.reach * 4)];
  const far = { key: 'CONTROL.far', kind: 'control', poly: rect(farC[0], farC[1], ang + Math.PI / 2, L, W) };
  const P4 = tangentialCensus(fabric, w, S, { extraBodies: [far] });
  process.stdout.write(`P4 perpendicular FAR outside reach  C1=${P4.c1Crossing} C2 violations=${P4.c2.violations} withinReach=${P4.withinReach} (baseline ${B0.withinReach})\n`);
  live.push(['P4 a body beyond REACH changes nothing — the census is bounded, not indiscriminate',
    P4.c1Crossing === B0.c1Crossing && P4.c2.violations === B0.c2.violations && P4.withinReach === B0.withinReach]);

  // P5 · the axis derivation itself, on synthetic shapes with a known answer
  const axA = bodyAxis(rect(0, 0, 0.3, 20, 4));
  const axB = bodyAxis(rect(0, 0, 0.3 + Math.PI / 2, 20, 4));
  process.stdout.write(`P5 axis derivation   a 20×4 rect at 0.3 rad → ang=${r4(axA.ang)} aspect=${r2(axA.aspect)}  |  turned 90° → Δ=${r2(foldDeg(axA.ang, axB.ang))}°\n`);
  live.push(['P5 bodyAxis recovers a known long axis (±0.5°) and its aspect', Math.abs(foldDeg(axA.ang, 0.3)) < 0.5 && Math.abs(axA.aspect - 5) < 0.01]);
  live.push(['P5 bodyAxis separates two rectangles turned 90° apart', Math.abs(foldDeg(axA.ang, axB.ang) - 90) < 0.5]);
  const sq = bodyAxis(rect(0, 0, 0.3, 10, 10));
  live.push(['P5 a SQUARE is reported as having no usable axis (aspect < the exemption floor)', sq.aspect < ASPECT_MIN]);

  // P6 · LIMB B IS A PROPERTY OF THE STRETCH, and this is the plant that proves it rather than
  // asserting it: take a body the census currently ACQUITS under limb B, slip an intruder into the
  // clear zone on ITS stretch, and the acquitted body must flip to VIOLATION_STRETCH_NOT_CLEAR.
  const B0r = tangentialCensus(fabric, w, S, { returnRows: true });
  const victim = (B0r.rows || []).find((b) => b.verdict === 'LAWFUL_B_CLEAR');
  if (victim) {
    const dir = [victim.c[0] - victim.foot[0], victim.c[1] - victim.foot[1]];
    const dl = Math.hypot(dir[0], dir[1]) || 1;
    const site = [victim.foot[0] + (dir[0] / dl) * (T.clearIn * 0.35), victim.foot[1] + (dir[1] / dl) * (T.clearIn * 0.35)];
    const intruder = { key: 'CONTROL.intruder', kind: 'control', poly: rect(site[0], site[1], victim.tangentAng, Math.max(2, T.plotDepth * 0.5), Math.max(1, T.plotDepth * 0.25)) };
    const P6 = tangentialCensus(fabric, w, S, { extraBodies: [intruder], returnRows: true });
    const after = verdictOf(P6, victim.key);
    process.stdout.write(`P6 stretch coupling   victim ${victim.key.slice(0, 46)} (d=${r4(victim.d)}, seg ${victim.seg}) was LAWFUL_B_CLEAR → now ${after ? after.verdict : '(GONE)'}`
      + `   lawfulB ${B0.c2.lawfulClear}→${P6.c2.lawfulClear}, violations ${B0.c2.violations}→${P6.c2.violations}\n`);
    live.push(['P6 limb B is a property of the STRETCH — an intruder in the clear zone convicts an acquitted neighbour on that stretch',
      !!after && after.verdict === 'VIOLATION_STRETCH_NOT_CLEAR' && P6.c2.lawfulClear < B0.c2.lawfulClear]);
  } else {
    // ⚠ NO HABITAT IS A LEAF PROPERTY, NOT AN INSTRUMENT DEFECT — and it is reported rather than
    // blessed (the i10 B3b precedent). `year-100` holds 2 bodies within reach of its whole
    // circuit: a wall standing in open ground, which is review I8's own finding, not a dead arm.
    // The row is therefore NOT pushed — an unexercised clause must not be counted as proven — and
    // the suite prints the gap so a reader chasing a green knows which leaf exercised what.
    process.stdout.write(`P6 stretch coupling   ⚠ NO HABITAT on '${leafKey}' — this circuit acquits NOBODY under limb B (${B0.withinReach} bodies within reach of the whole circuit),\n`
      + `                      so the coupling has nothing to convict here. UNEXERCISED, not proven. Re-run --controls on a populous walled leaf.\n`);
  }

  process.stdout.write('\n── LIVENESS · a zero is what a DEAD instrument returns (§645.2: "zeros valid only with a planted-violation control")\n');
  for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
  const ok = live.every((l) => l[1]);
  process.stdout.write(`\nI12_CONTROLS ${ok ? 'LIVE' : 'BROKEN'}\n`);
  if (!ok) process.exitCode = 1;
  return { leaf: leafKey, baseline: B0, P1, P2, P3, P4, liveness: live };
}

/* ─────────────────────── driver ─────────────────────── */
async function run(S, keys, opts) {
  const rows = [];
  process.stdout.write(`  ${'leaf'.padEnd(12)} ${'wall'.padEnd(10)} ${'reach'.padEnd(7)} ${'nearW'.padEnd(6)} ${'CROSS'.padEnd(6)} ${'VIOL'.padEnd(6)} ${'lawA'.padEnd(5)} ${'lawB'.padEnd(5)} ${'exmpt'.padEnd(6)} tangShare in|out\n`);
  for (const k of keys) {
    const spec = S.CORPUS.find((s) => s.key === k);
    if (!spec) { process.stderr.write(`SKIP unknown leaf '${k}'\n`); continue; }
    const { fabric } = S.buildOne(spec);
    const L = leafCensus(fabric, S, opts);
    rows.push({ key: k, ...L });
    for (const c of [...L.working, ...L.relictNonScoring]) {
      if (!c.applicable) continue;
      const tag = c.wallKind === 'old-core' ? `${c.wallKind}*` : c.wallKind;
      process.stdout.write(`  ${k.padEnd(12)} ${tag.padEnd(10)} ${String(c.thresholds.reach).padEnd(7)} ${String(c.withinReach).padEnd(6)}`
        + ` ${String(c.c1Crossing).padEnd(6)} ${String(c.c2.violations).padEnd(6)} ${String(c.c2.lawfulTangential).padEnd(5)} ${String(c.c2.lawfulClear).padEnd(5)} ${String(c.c2.exemptNoAxis).padEnd(6)}`
        + ` ${String(c.c3Continuity.inside.tangentialShare).padEnd(6)}|${c.c3Continuity.outside.tangentialShare}\n`);
    }
  }
  const scoring = rows.flatMap((r) => r.working).filter((c) => c.applicable);
  const totals = {
    leaves: rows.length, scoringCircuits: scoring.length,
    withinReach: scoring.reduce((a, c) => a + c.withinReach, 0),
    c1Crossing: scoring.reduce((a, c) => a + c.c1Crossing, 0),
    c2Violations: scoring.reduce((a, c) => a + c.c2.violations, 0),
    lawfulTangential: scoring.reduce((a, c) => a + c.c2.lawfulTangential, 0),
    lawfulClear: scoring.reduce((a, c) => a + c.c2.lawfulClear, 0),
    exemptNoAxis: scoring.reduce((a, c) => a + c.c2.exemptNoAxis, 0),
    relictCrossing: rows.flatMap((r) => r.relictNonScoring).filter((c) => c.applicable).reduce((a, c) => a + c.c1Crossing, 0),
    relictViolations: rows.flatMap((r) => r.relictNonScoring).filter((c) => c.applicable).reduce((a, c) => a + c.c2.violations, 0),
  };
  return { rows, totals, pass: totals.c1Crossing === 0 && totals.c2Violations === 0 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const wt = arg('wt', `${HERE}/../laneBRIDGE-tree`);
  const json = arg('json', null);
  const S = await sealed(wt);
  const bandDeg = Number(arg('band', TANGENT_BAND_DEG));
  const reachMult = Number(arg('reachMult', REACH_MULT));
  const lineKind = arg('line', 'drawn');

  if (process.argv.includes('--controls')) {
    const res = await controls(wt, S, arg('leaf', 'town'));
    if (json && res) writeFileSync(json, JSON.stringify(res, null, 2));
  } else if (process.argv.includes('--xcheck')) {
    // ⚠ THREE DEFINITIONS OF "THE LINE", REPORTED SIDE BY SIDE AND NEVER MERGED (§648.3's banked
    // defect class). If the three agree, the choice was immaterial and the headline figure is
    // robust; if they diverge, the divergence IS the finding and no single number should be quoted.
    const keys = (arg('leaves', 'ALL') === 'ALL' ? S.CORPUS.map((s) => s.key) : arg('leaves', 'ALL').split(','));
    const defs = [['drawn-OPEN  (primary)', { lineKind: 'drawn', closeRing: false }],
      ['drawn-CLOSED       ', { lineKind: 'drawn', closeRing: true }],
      ['claimLine-OPEN     ', { lineKind: 'claim', closeRing: false }]];
    const acc = defs.map(() => ({ c1: 0, c2: 0, near: 0 }));
    for (const k of keys) {
      const spec = S.CORPUS.find((s) => s.key === k); if (!spec) continue;
      const { fabric } = S.buildOne(spec);
      for (const w of (fabric.walls || []).filter((x) => x.kind !== 'old-core')) {
        defs.forEach(([, o], i) => {
          const r = tangentialCensus(fabric, w, S, { bandDeg, reachMult, ...o });
          if (r.applicable) { acc[i].c1 += r.c1Crossing; acc[i].c2 += r.c2.violations; acc[i].near += r.withinReach; }
        });
      }
    }
    process.stdout.write('── LINE-DEFINITION CROSS-CHECK · scoring circuits only, never merged\n');
    process.stdout.write(`  ${'definition'.padEnd(22)} ${'C1 crossing'.padStart(12)} ${'C2 violations'.padStart(14)} ${'within reach'.padStart(13)}\n`);
    defs.forEach(([n], i) => process.stdout.write(`  ${n.padEnd(22)} ${String(acc[i].c1).padStart(12)} ${String(acc[i].c2).padStart(14)} ${String(acc[i].near).padStart(13)}\n`));
    if (json) writeFileSync(json, JSON.stringify({ defs: defs.map(([n], i) => ({ definition: n.trim(), ...acc[i] })), leaves: keys }, null, 2));
    process.stdout.write('I12_XCHECK_DONE\n');
  } else if (process.argv.includes('--sweep')) {
    // ⚠ NO VERDICT HOSTAGE TO ONE CONSTANT — the grid is the honest form of a threshold.
    const keys = (arg('leaves', 'town,city') === 'ALL' ? S.CORPUS.map((s) => s.key) : arg('leaves', 'town,city').split(','));
    const built = [];
    for (const k of keys) { const spec = S.CORPUS.find((s) => s.key === k); if (spec) built.push([k, S.buildOne(spec).fabric]); }
    process.stdout.write('── SENSITIVITY GRID · C1 crossing / C2 violations, over reach × tangency band\n');
    process.stdout.write(`  ${'reach×'.padEnd(8)}` + [10, 15, 20, 30].map((b) => `band ${b}°`.padEnd(14)).join('') + '\n');
    const grid = [];
    for (const rm of [0.5, 1.0, 1.5, 2.0]) {
      let lineOut = `  ${String(rm).padEnd(8)}`;
      for (const bd of [10, 15, 20, 30]) {
        let c1 = 0, c2 = 0;
        for (const [, f] of built) for (const w of (f.walls || []).filter((x) => x.kind !== 'old-core')) {
          const r = tangentialCensus(f, w, S, { bandDeg: bd, reachMult: rm });
          if (r.applicable) { c1 += r.c1Crossing; c2 += r.c2.violations; }
        }
        grid.push({ reachMult: rm, bandDeg: bd, c1, c2 });
        lineOut += `${c1}/${c2}`.padEnd(14);
      }
      process.stdout.write(`${lineOut}\n`);
    }
    if (json) writeFileSync(json, JSON.stringify({ grid, leaves: keys }, null, 2));
    process.stdout.write('I12_SWEEP_DONE\n');
  } else {
    const leaves = arg('leaves', 'town,city');
    const keys = leaves === 'ALL' ? S.CORPUS.map((s) => s.key) : leaves.split(',').map((s) => s.trim()).filter(Boolean);
    process.stdout.write(`── THE TANGENTIAL-OR-CLEAR CENSUS (§645.2 · §575.1) · band=${bandDeg}°  reach×${reachMult}  line=${lineKind}\n`);
    const res = await run(S, keys, { bandDeg, reachMult, lineKind });
    const t = res.totals;
    process.stdout.write(`\nC1 · FOOTPRINTS CROSSING THE WALL LINE   = ${t.c1Crossing}   (scoring circuits: ${t.scoringCircuits} on ${t.leaves} leaves)\n`);
    process.stdout.write(`C2 · TANGENT-OR-CLEAR VIOLATIONS         = ${t.c2Violations} of ${t.withinReach} bodies within reach`
      + `  (lawful A tangential ${t.lawfulTangential} · lawful B clear ${t.lawfulClear} · exempt no-axis ${t.exemptNoAxis})\n`);
    process.stdout.write(`      relict (old-core, NON-SCORING per §250.5): crossing=${t.relictCrossing} violations=${t.relictViolations}\n`);
    if (json) writeFileSync(json, JSON.stringify(res, null, 2));
    process.stdout.write(`I12_${res.pass ? 'PASS' : 'FAIL'}\n`);
    // ⛔ C4: the verdict is the exit status too.
    if (!res.pass) process.exitCode = 1;
  }
}
