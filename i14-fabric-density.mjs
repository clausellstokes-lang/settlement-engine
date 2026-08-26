/**
 * i14-fabric-density.mjs — DRESS-FABRIC · **THE INK-TO-WHITE AREA CENSUS.**
 *
 * ⭐⭐ WHY IT EXISTS. §697.3(i) claimed by eye that *"the reference spends its page on buildings;
 * ours spends roughly as much area on inter-building white as on fabric"*, and §698.2(iii) left
 * that claim as the one axis **still unmeasured**. §698 had already refuted the two claims beside
 * it (shape complexity, size spread) BY PARSING THE ARTIFACT. This instrument exists so the last
 * one is never argued by eye again.
 *
 * ═══ WHAT IT MEASURES, AND WHERE IT ASKS ═══
 * SPINE-3's banked class: *a census must ask at the surface the reader sees, not the surface the
 * data model prefers.* So every figure below is taken from **RASTERISED PAINTED AREA** off the
 * emitted SVG — the union a viewer's eye integrates — never from summed vector polygon areas,
 * which double-count every overlap and cannot express a hole. `PxMask.fillPolys` applies ONE
 * winding rule across all subpaths of a `<path>`, which is exactly how a renderer paints it.
 *
 *   ROW 1 · TOFT DENSITY      built / (built ∪ yard)
 *           "how much of the settled block is roof" — the direct measure of §697.2's *"separated
 *           on all four sides by a white gap as wide as the building itself"*. A gap that wide
 *           puts this near 0.25; touching terraces put it near 0.85.
 *   ROW 2 · QUARTER DENSITY   built / (built ∪ yard ∪ void ∪ street)
 *           ⭐ THE ROW THE REFERENCE FIGURE IS COMPARABLE TO. MFCG's `districts` are quarters
 *           WITH their internal streets and courts; this denominator is that same region.
 *   ROW 3 · PAGE BUDGET       settled / page, and field / page
 *           §697.3(iii): Grimfall gives its whole sheet to the town (zero fields); ours is a
 *           green disc with a settlement in it.
 *   ROW 4 · SHAPES            per-mass vertices and area quartiles — re-measured every run so
 *           §698.1's exoneration is never inherited on trust.
 *   ROW 5 · ROTATION          the dominant-edge angle histogram and the modal-20°-window share,
 *           by count AND by area, plus the min-area-rect angle as an independent second reading.
 *
 * ═══ ⛔ THE REFERENCE TARGET, AND EXACTLY HOW FAR IT IS EVIDENCE ═══
 * CLEAN-ROOM (§668/§673): the reference's published NUMBERS are facts; its code and its maps are
 * not ours to touch. Everything below comes from `dissect/mfcg-everrise-census.json`, which holds
 * per-building area QUARTILES but **no mean**, so the mean is RECONSTRUCTED and the reconstruction
 * is declared rather than hidden:
 *
 *   n = 616 · p25 171.9 · p50 225.5 · p75 295.8 · min 46.1 · max 2922.6
 *   districts (8) total area 349,715
 *
 *   lognormal fit:  σ = ln(p75/p25)/1.349 = ln(1.7207)/1.349 = 0.4023
 *                   mean = p50·exp(σ²/2) = 225.5 × 1.0843 = 244.5
 *   built total ≈ 616 × 244.5 = 150,612   →   QUARTER DENSITY ≈ 0.431
 *
 * ⚠ AND ITS BAND, because a single number from a fitted mean would overclaim. Substituting each
 * measured quartile for the mean brackets it: p25 → 0.303 · p50 → 0.397 · p75 → 0.521. The tail
 * (max 2922.6 = 13× the median) is heavier than lognormal, so the true mean sits at or ABOVE the
 * fit. **TARGET 0.43, BAND 0.38–0.52.** Anything inside that band is at reference parity on this
 * axis and no further density is owed by this measurement.
 *
 * CONTROLS (--controls): five plants, each declaring what it must move and what it must leave
 * alone. Two of them (c) and (d) exist because a density census that cannot tell a SHRUNKEN
 * building from a WIDENED yard is measuring one number where there are two.
 *
 * Usage: node i14-fabric-density.mjs --dir=<renderDir> [--leaves=a,b] [--json=<path>]
 *        node i14-fabric-density.mjs --controls
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { classify, assertViewBox, frameTransform, PxMask } from './lib/classify.mjs';
import { subpaths } from './lib/svg.mjs';
import { absArea, r4, stats } from './lib/geom.mjs';

export const MASK_N = 2000;

/** ⭐ THE REFERENCE TARGET — derivation in the header; band, never a point, and stated as one. */
export const REFERENCE = Object.freeze({
  source: 'dissect/mfcg-everrise-census.json (Everrise Gate, size-25, MFCG 0.11.5)',
  buildings: 616,
  districtArea: 349715,
  meanAreaFit: 244.5,
  quarterDensity: 0.431,
  band: [0.38, 0.52],
  bracket: { p25: 0.303, p50: 0.397, p75: 0.521 },
});

/* ─────────────────────────── group geometry, in frame units ─────────────────────────── */

/**
 * Every subpath emitted inside `<g id=…>`, mapped into the 0..1000 space `PxMask` addresses.
 * ⚠ Grouped BY ELEMENT, because the winding rule is per-`<path>` and a census that flattened
 * every subpath into one bag would paint an outer-plus-inner pair solid instead of holed.
 */
export function groupPaths(els, XF, id) {
  const out = [];
  for (const r of els) {
    if (!r.groups.includes(id) || !r.t.attrs.d) continue;
    const polys = subpaths(r.t.attrs.d)
      .filter((sp) => sp.poly.length > 2)
      .map((sp) => sp.poly.map(XF.pt));
    if (polys.length) out.push(polys);
  }
  return out;
}

export function maskOf(els, XF, ids, n = MASK_N) {
  const M = new PxMask(n);
  for (const id of ids) for (const polys of groupPaths(els, XF, id)) M.fillPolys(polys);
  return M;
}

const union = (...ms) => {
  const out = new PxMask(ms[0].n);
  for (const m of ms) for (let i = 0; i < out.a.length; i++) if (m.a[i]) out.a[i] = 1;
  return out;
};

/* ─────────────────────────── shape + rotation, per drawn mass ─────────────────────────── */

/** the closing vertex SVG's `Z` implies is not a vertex; a ring that repeats its first point is 1 short */
function ringOf(poly) {
  const p = poly.slice();
  if (p.length > 1) {
    const a = p[0], b = p[p.length - 1];
    if (Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9) p.pop();
  }
  return p;
}

const DEG = 180 / Math.PI;
/** angle of a segment, folded to [0,180) — a wall has no head and no tail */
const edgeAngle = (a, b) => { const t = Math.atan2(b[1] - a[1], b[0] - a[0]) * DEG; return ((t % 180) + 180) % 180; };

/** the LONGEST edge's bearing — §698.2(i)'s own quantity, reproduced rather than re-invented */
export function dominantEdge(ring) {
  let best = -1, ang = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L > best) { best = L; ang = edgeAngle(a, b); }
  }
  return { angle: ang, len: best };
}

/**
 * ⭐ THE INDEPENDENT SECOND READING: the minimum-area rectangle's own bearing, by rotating
 * calipers over the convex hull. A longest-edge reading can be moved by one long spur on an
 * otherwise square shape; the min-rect cannot. Two readings that agree are a measurement.
 */
export function obbAngle(ring) {
  const pts = ring.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  if (pts.length < 3) return null;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [];
  for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  const hi = [];
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  const hull = lo.slice(0, -1).concat(hi.slice(0, -1));
  if (hull.length < 3) return null;
  let bestA = Infinity, bestAng = 0;
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i], b = hull[(i + 1) % hull.length];
    const th = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const c = Math.cos(-th), s = Math.sin(-th);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of hull) {
      const x = p[0] * c - p[1] * s, y = p[0] * s + p[1] * c;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    const A = (x1 - x0) * (y1 - y0);
    if (A < bestA) { bestA = A; bestAng = (x1 - x0) >= (y1 - y0) ? th : th + Math.PI / 2; }
  }
  return ((bestAng * DEG) % 180 + 180) % 180;
}

/**
 * A circular histogram over `period` degrees in 10° bins, with the modal 20° window and the
 * normalised entropy.
 *
 * ⛔⛔ **THE FOLD IS THE MEASUREMENT, AND THE FIRST SPELLING OF THIS FUNCTION UNDERSTATED THE
 * CLUSTERING BY HALF.** Read over [0,180) the city's dominant edges make TWO peaks 90° apart
 * (40–50 at 26.6 % and 130–140 at 31.9 %) and the modal-20° share reads **0.4375**. Those are not
 * two orientations: they are the two axes of ONE orthogonal grid, because a rectangle's "longest
 * edge" flips to the perpendicular the moment the rectangle is slightly wider than tall. Folded to
 * [0,90) — **the GRID BEARING, which is a rectangle's actual identity** — the same data reads
 * **0.815 in one 20° window**, which is §698.2(i)'s 82 % reproduced at this tip. A census that
 * reported 0.4375 as "the clustering" would have declared the fabric half as aligned as it is and
 * this lane would have sized its cure against a number that was an artefact of its own fold.
 */
export function angleSpread(samples, period = 180) {
  const NB = period / 10;
  const bins = new Array(NB).fill(0);
  const wbins = new Array(NB).fill(0);
  let W = 0;
  for (const s of samples) {
    const a = ((s.angle % period) + period) % period;
    const k = Math.min(NB - 1, Math.max(0, Math.floor(a / 10)));
    bins[k] += 1; wbins[k] += s.w; W += s.w;
  }
  const n = samples.length;
  let bestC = -1, bestCk = 0, bestW = -1;
  for (let k = 0; k < NB; k++) {
    const c = bins[k] + bins[(k + 1) % NB];
    const w = wbins[k] + wbins[(k + 1) % NB];
    if (c > bestC) { bestC = c; bestCk = k; }
    if (w > bestW) { bestW = w; }
  }
  /** circular entropy, normalised to 1 at a flat spread — one number for "how spread" */
  let H = 0;
  for (const b of bins) { if (!b) continue; const p = b / n; H -= p * Math.log(p); }
  return {
    period,
    bins,
    n,
    modalWindowDeg: [bestCk * 10, bestCk * 10 + 20],
    modalWindowShare: n ? r4(bestC / n) : null,
    modalWindowShareByArea: W ? r4(bestW / W) : null,
    entropyNorm: n ? r4(H / Math.log(NB)) : null,
  };
}

/* ─────────────────────────────────── the census ─────────────────────────────────── */

export function fabricCensus(svgPath, lens = 'parchment') {
  const { els, src } = classify(svgPath, lens);
  const frame = assertViewBox(src);
  const XF = frameTransform(frame);

  const built = maskOf(els, XF, ['dress-masses']);
  const yard = maskOf(els, XF, ['dress-yards']);
  const street = maskOf(els, XF, ['dress-street']);
  const voids = maskOf(els, XF, ['dress-voids']);
  const field = maskOf(els, XF, ['dress-fields']);
  const water = maskOf(els, XF, ['dress-water']);
  const band = maskOf(els, XF, ['dress-band']);

  const toft = union(built, yard);
  const quarter = union(built, yard, voids, street);
  const settled = union(built, yard, voids, street, band);
  const page = MASK_N * MASK_N;

  const cBuilt = built.count();
  const cToft = toft.count();
  const cQuarter = quarter.count();
  const cSettled = settled.count();

  /* ── shapes + rotation, per drawn mass ── */
  const masses = [];
  for (const polys of groupPaths(els, XF, 'dress-masses')) {
    for (const poly of polys) {
      const ring = ringOf(poly);
      if (ring.length < 3) continue;
      const A = absArea(ring);
      masses.push({ verts: ring.length, area: A, dom: dominantEdge(ring), obb: obbAngle(ring) });
    }
  }
  /** the way network's own bearings — one per drawn carriageway face, weighted by its area */
  const wayBearings = [];
  for (const polys of groupPaths(els, XF, 'dress-street')) {
    for (const poly of polys) {
      const ring = ringOf(poly);
      if (ring.length < 3) continue;
      wayBearings.push({ angle: dominantEdge(ring).angle, w: absArea(ring) });
    }
  }
  const areas = masses.map((m) => m.area).sort((a, b) => a - b);
  const q = (p) => (areas.length ? areas[Math.min(areas.length - 1, Math.floor(p * areas.length))] : null);
  const vs = masses.map((m) => m.verts);
  const vhist = {};
  for (const v of vs) vhist[v] = (vhist[v] || 0) + 1;

  return {
    plate: svgPath.split('/').pop(),
    frame: { x: frame.x, y: frame.y, w: frame.w, h: frame.h },
    /* ROW 1–3 · the ink census */
    ink: {
      builtPx: cBuilt,
      toftPx: cToft,
      quarterPx: cQuarter,
      settledPx: cSettled,
      fieldPx: field.count(),
      waterPx: water.count(),
      pagePx: page,
      toftDensity: cToft ? r4(cBuilt / cToft) : null,
      quarterDensity: cQuarter ? r4(cBuilt / cQuarter) : null,
      settledShareOfPage: r4(cSettled / page),
      fieldShareOfPage: r4(field.count() / page),
      inkToWhiteInQuarter: cQuarter ? r4(cBuilt / (cQuarter - cBuilt || 1)) : null,
    },
    /* ROW 4 · shapes */
    shape: {
      n: masses.length,
      vertsMean: vs.length ? r4(vs.reduce((a, b) => a + b, 0) / vs.length) : null,
      vertsMin: vs.length ? Math.min(...vs) : null,
      vertsMax: vs.length ? Math.max(...vs) : null,
      vertsHist: vhist,
      areaP25: r4(q(0.25)), areaP50: r4(q(0.50)), areaP75: r4(q(0.75)),
      areaSpread: q(0.25) ? r4(q(0.75) / q(0.25)) : null,
    },
    /* ROW 5 · rotation — the GRID BEARING is primary; see angleSpread's header for why */
    rotation: {
      gridBearing: angleSpread(masses.map((m) => ({ angle: m.dom.angle, w: m.area })), 90),
      gridBearingObb: angleSpread(masses.filter((m) => m.obb != null).map((m) => ({ angle: m.obb, w: m.area })), 90),
      dominantEdge: angleSpread(masses.map((m) => ({ angle: m.dom.angle, w: m.area }))),
      minAreaRect: angleSpread(masses.filter((m) => m.obb != null).map((m) => ({ angle: m.obb, w: m.area }))),
      /**
       * ⭐⭐ THE WAY NETWORK'S OWN BEARING SPREAD, MEASURED ON THE SAME PLATE AND IN THE SAME UNIT.
       * This is the row that decides whether a fabric bearing taken FROM THE FRONTING STREET would
       * be a spread at all: if the streets are themselves on one grid, there is nothing structural
       * to inherit and the only remaining source would be noise — which A2.2 convicts.
       */
      ways: angleSpread(wayBearings.map((a) => ({ angle: a.angle, w: a.w })), 90),
    },
    _stats: stats(areas),
  };
}

/* ─────────────────────────────── the control bench ─────────────────────────────── */

/**
 * ⛔ EVERY PLANT DECLARES WHAT IT MUST MOVE **AND** WHAT IT MUST LEAVE ALONE. A census that only
 * declares what should move cannot tell a live arm from an arm that moves on everything.
 */
const PLANTS = [
  {
    id: 'a', kind: 'NEG', why: 'the plate unmodified — the reading every other plant is measured against',
    edit: (s) => s,
    want: { toftMoves: false, rotMoves: false, shapeMoves: false },
  },
  {
    id: 'b', kind: 'POS', why: 'every built footprint scaled 0.5 about its own centroid — DENSITY falls, ROTATION must not move',
    edit: (s) => scaleGroup(s, 'dress-masses', 0.5),
    want: { toftMoves: true, toftDir: -1, rotMoves: false, shapeMoves: true },
  },
  {
    id: 'c', kind: 'POS', why: 'every built footprint scaled 1.35 — DENSITY rises. ⭐ the arm that separates a shrunken building from a widened yard: (b) and (c) move ROW 1 in OPPOSITE directions while ROW 5 stands still',
    edit: (s) => scaleGroup(s, 'dress-masses', 1.35),
    want: { toftMoves: true, toftDir: +1, rotMoves: false, shapeMoves: true },
  },
  {
    id: 'd', kind: 'POS', why: 'every YARD scaled 1.4 and the buildings untouched — ROW 1 must fall with the SAME built pixel count. Without this plant a density drop is ambiguous between the two causes',
    edit: (s) => scaleGroup(s, 'dress-yards', 1.4),
    want: { toftMoves: true, toftDir: -1, rotMoves: false, shapeMoves: false, builtPxSame: true },
  },
  /**
   * ⛔⛔ **(e) AND (f) FAILED ON THEIR FIRST RUN AND THE FAULT WAS IN MY DECLARATION, NOT THE ARM.**
   * I declared `toftMoves: false` on both, reasoning *"a rotation is an isometry"*. It is — of the
   * SHAPE. It is **not** an isometry of the shape's OVERLAP with another shape: a footprint turned
   * about its own centroid swings out of the yard it sits in, so `built ∪ yard` grows and ROW 1
   * falls (e: 0.8182 → 0.6835; f: → 0.6872). `builtPx` moves too (79,797 → 75,946), because
   * neighbouring footprints that overlapped after the turn cancel under the even-odd rule the
   * renderer actually uses. **Corrected here rather than tidied**, and it is the reason (f) is worth
   * keeping: its ROTATION verdict (Δ 0.0224, below the 0.05 bar) is the arm behaving correctly while
   * every other column moves, which is what a negative control is for.
   */
  {
    id: 'e', kind: 'POS', why: 'every built footprint rotated by a per-mass angle spread over 90° — ROTATION must spread; the AREA quartiles must NOT move (that part IS an isometry) and ROW 1 falls for the overlap reason above',
    edit: (s) => rotateGroup(s, 'dress-masses'),
    want: { toftMoves: true, toftDir: -1, rotMoves: true, shapeMoves: false },
  },
  {
    id: 'f', kind: 'NEG', why: '⭐ THE ROTATION ARM\'S OWN NEGATIVE: every footprint rotated by the SAME angle (37°). A census that reported this as "spread" would be measuring the axis, not the variety — and it is the sharper plant precisely because ROW 1 and builtPx DO move while ROW 5 stands still',
    edit: (s) => rotateGroup(s, 'dress-masses', 37),
    want: { toftMoves: true, toftDir: -1, rotMoves: false, shapeMoves: false },
  },
];

/** rewrite one group's `d` attribute through a per-subpath affine about that subpath's centroid */
function editGroupD(src, groupId, fn) {
  const gi = src.indexOf(`<g id="${groupId}">`);
  if (gi < 0) throw new Error(`NO_GROUP ${groupId}`);
  const ge = src.indexOf('</g>', gi);
  const head = src.slice(0, gi), body = src.slice(gi, ge), tail = src.slice(ge);
  const out = body.replace(/ d="([^"]*)"/g, (m, d) => {
    const sps = subpaths(d);
    if (!sps.length) return m;
    const parts = [];
    for (const sp of sps) {
      const ring = ringOf(sp.poly);
      if (ring.length < 3) { parts.push(sp.d); continue; }
      const moved = fn(ring, parts.length);
      parts.push(`M${moved.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join('L')}Z`);
    }
    return ` d="${parts.join('')}"`;
  });
  return head + out + tail;
}
const centroidOf = (ring) => {
  let sx = 0, sy = 0;
  for (const p of ring) { sx += p[0]; sy += p[1]; }
  return [sx / ring.length, sy / ring.length];
};
function scaleGroup(src, groupId, k) {
  return editGroupD(src, groupId, (ring) => {
    const [cx, cy] = centroidOf(ring);
    return ring.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
  });
}
function rotateGroup(src, groupId, fixedDeg = null) {
  let seq = 0;
  return editGroupD(src, groupId, (ring) => {
    const [cx, cy] = centroidOf(ring);
    const deg = fixedDeg == null ? ((seq++ * 37) % 90) : fixedDeg;
    const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
    return ring.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
  });
}

function runControls(basePlate) {
  const src0 = readFileSync(basePlate, 'utf8');
  const tmp = join(process.env.TMPDIR || '/tmp', `.i14-plant-${process.pid}.svg`);
  const read = (s) => { writeFileSync(tmp, s); return fabricCensus(tmp); };
  const ref = read(src0);
  const rows = [];
  let pass = 0;
  for (const P of PLANTS) {
    const got = read(P.edit(src0));
    const dToft = got.ink.toftDensity - ref.ink.toftDensity;
    const dRot = got.rotation.gridBearing.modalWindowShare - ref.rotation.gridBearing.modalWindowShare;
    const dShape = got.shape.areaP50 - ref.shape.areaP50;
    const toftMoved = Math.abs(dToft) > 0.01;
    const rotMoved = Math.abs(dRot) > 0.05;
    const shapeMoved = ref.shape.areaP50 ? Math.abs(dShape / ref.shape.areaP50) > 0.02 : false;
    const ok = toftMoved === P.want.toftMoves
      && rotMoved === P.want.rotMoves
      && shapeMoved === P.want.shapeMoves
      && (P.want.toftDir == null || Math.sign(dToft) === P.want.toftDir)
      && (!P.want.builtPxSame || got.ink.builtPx === ref.ink.builtPx);
    if (ok) pass++;
    rows.push({
      id: P.id, kind: P.kind, ok, why: P.why,
      toftDensity: got.ink.toftDensity, dToft: r4(dToft),
      builtPx: got.ink.builtPx,
      modalWindowShare: got.rotation.gridBearing.modalWindowShare, dRot: r4(dRot),
      areaP50: got.shape.areaP50,
    });
  }
  return { plate: basePlate.split('/').pop(), ref, rows, pass, of: PLANTS.length };
}

/* ─────────────────────────────────── CLI ─────────────────────────────────── */

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = arg('dir', null);
  const jsonOut = arg('json', null);
  if (process.argv.includes('--controls')) {
    const plate = arg('plate', join(dir || '.', 'city-city-parchment.svg'));
    const R = runControls(plate);
    for (const r of R.rows) {
      console.log(`${r.ok ? '✔' : '✘'} (${r.id}) ${r.kind.padEnd(3)} toft ${String(r.toftDensity).padEnd(6)} Δ${String(r.dToft).padEnd(8)} builtPx ${String(r.builtPx).padEnd(8)} modal20 ${String(r.modalWindowShare).padEnd(7)} Δ${String(r.dRot).padEnd(8)} p50 ${r.areaP50}`);
      console.log(`      ${r.why}`);
    }
    console.log(`\nCONTROL_BENCH ${R.pass}/${R.of} — ${R.pass === R.of ? 'the census is LIVE' : '⛔ AN ARM IS DEAD OR A DECLARATION IS WRONG'}`);
    if (jsonOut) writeFileSync(jsonOut, JSON.stringify(R, null, 2));
    process.exit(R.pass === R.of ? 0 : 1);
  }
  if (!dir) { console.error('need --dir=<renderDir> or --controls'); process.exit(2); }
  const only = arg('leaves', '') ? arg('leaves', '').split(',') : null;
  const files = readdirSync(dir).filter((f) => f.endsWith('.svg'))
    .filter((f) => !only || only.some((k) => f.startsWith(`${k}-`)));
  const all = [];
  console.log('leaf                    n  toft   quarter  settled% field%   vMean  spread  GRID20   window     entropy  WAY20');
  for (const f of files.sort()) {
    const C = fabricCensus(join(dir, f));
    all.push(C);
    const R = C.rotation.gridBearing;
    console.log(`${f.replace('-parchment.svg', '').padEnd(22)} ${String(C.shape.n).padStart(4)}`
      + `  ${String(C.ink.toftDensity).padEnd(6)} ${String(C.ink.quarterDensity).padEnd(8)}`
      + ` ${String(r4(C.ink.settledShareOfPage)).padEnd(8)} ${String(r4(C.ink.fieldShareOfPage)).padEnd(7)}`
      + ` ${String(C.shape.vertsMean).padEnd(6)} ${String(C.shape.areaSpread).padEnd(7)}`
      + ` ${String(R.modalWindowShare).padEnd(8)} ${String(R.modalWindowDeg.join('–')).padEnd(10)} ${String(R.entropyNorm).padEnd(8)} ${C.rotation.ways.modalWindowShare}`);
  }
  const qds = all.map((c) => c.ink.quarterDensity).filter((x) => x != null);
  const inBand = qds.filter((x) => x >= REFERENCE.band[0] && x <= REFERENCE.band[1]).length;
  console.log(`\nREFERENCE quarter density ${REFERENCE.quarterDensity} (band ${REFERENCE.band.join('–')}) — `
    + `OURS in band on ${inBand} of ${qds.length} leaves`);
  if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ reference: REFERENCE, leaves: all }, null, 2));
}
