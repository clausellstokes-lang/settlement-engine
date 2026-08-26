#!/usr/bin/env node
/**
 * harness/laneE1/needleDiscriminator.mjs — ⭐⭐⭐ REG-E1 · **THE ONE MEASURE THAT SEPARATES A
 * DRAWING ARTIFACT FROM AN HONESTLY ELONGATED SETTLEMENT — AND THE METHOD THAT CANNOT DELIVER IT.**
 *
 * ⛔⛔ **WHY EVERY EARLIER CENSUS STALLED HERE, AND IT IS NOT THEIR FAULT.** DRESS-1b's
 * `ringSanity` measures the ring's SHAPE (fill, min-area-rect aspect, convexity, self-crossing).
 * REG-E1's `needleCensus` measures the ring against the extent its own record froze. **Neither can
 * answer the question THE PROMISE actually asks, because a long thin RING and a long thin TOWN
 * produce identical readings on both.** A low inradius and a low disc-fill are consequences of
 * narrowness, never evidence about its cause. Four readers, two censuses and a standing fence all
 * stopped at exactly that line.
 *
 * ⭐⭐⭐ **THE DISCRIMINATOR: WHERE DID THE CIRCUIT'S LENGTH COME FROM?** `raiseWrap` traces the
 * circuit as `convexHull` of the vertices of the pieces standing at the raise. A convex hull is the
 * right operator for a connected built form and the wrong one for a compact core with a few
 * detached outlying clumps — it spans the gaps and reports the span as a wall. So ask whether the
 * hull's LENGTH is carried by the whole piece set or by its extremes (`discriminate` below):
 *   `stretch`  hull span over the span of the CENTRAL 85 % of pieces. ≈1 distributed, ≫1 stretched.
 *   `trimLoss` the share of the span lost when the outermost `TRIM` pieces at EACH end are removed.
 *   `maxGap`   the largest empty interval along that axis — the wall standing over nothing.
 *
 * ⭐⭐ **MEASURED, ON THE RAISE-EPOCH PIECE SETS, BY INSTRUMENTING `raiseWrap` (REG-E1; the figures
 * were then independently reproduced by a skeptic arm from its own instrumented copy):**
 *   `metropolis` E1  135 pieces · span 708.6 · core85 259.4 · **stretch 2.73** · trim-15 span
 *                    **108.0 (85 % of the span gone)** · three axis gaps of 285.3 / 133.6 / 133.2.
 *                    ⇒ **ARTIFACT.** A ~110-unit core stretched ~6.6× by ~30 outlying pieces.
 *   `metropolis` E0  17 pieces · span 122.3 · **largest gap 100.5 = 82 % of the span** — two clumps.
 *                    ⇒ **ARTIFACT** (n is too small for the percentile arm; the gap is the reading).
 *   `city` E0        73 pieces · span 252.9 · core85 242.5 · **stretch 1.04** · trim-15 span 230.6
 *                    (**9 % lost**). ⇒ **HONEST.** The settlement of year 5 really was that long,
 *                    and the hull encloses it faithfully. ⛔ SMOOTHING IT WOULD FALSIFY LIVED
 *                    HISTORY — THE PROMISE binds, and this is the leaf the fence was RIGHT about.
 *
 * ⛔⛔ **AND THE METHOD BELOW IS RECORDED BECAUSE IT DOES NOT WORK — SO THE NEXT LANE DOES NOT
 * RE-INVENT AND RE-TRUST IT.** `raiseWrap` publishes the ring but NOTHING about the point set it
 * hulled, which is the deeper reason this defect outlived four readers. The obvious way round is
 * DESIGN_SPINE A1.4's own stated property — *"a frame = the same fold on the TRUNCATED ledger —
 * prefix closure preserved because the fold is append-only"* — so build the partition on the
 * epochs BEFORE the raise and read its pieces. **IT IS NOT THE SAME FABRIC.** Measured here, with
 * the control this file refuses to run without: on `metropolis` E1 the truncated fold yields
 * **2,179 pieces against the 135 `raiseWrap` actually saw**, and re-hulling them gives min-rect
 * aspect **1.27 against the published ring's 22.79**. The epoch targets are re-derived from the
 * ledger it is handed, so truncating the ledger changes every earlier epoch's growth.
 *
 * ⭐ **THE CHEAP FIX FOR WHOEVER TAKES DESIGN_SPINE §8's PANEL QUESTION P2:** publish the hull's
 * own inputs on the wrap (a count and this measure). It is additive, it is invisible to
 * `wrapDigest` (which hashes index/year/provenance/frozenRadius/bandWidth/outer/inner/gates/
 * waterGates/bandFaces and nothing else), and it makes the artifact-vs-honest discrimination
 * available to the gate instead of to an instrumented copy.
 *
 * Usage: node harness/laneE1/needleDiscriminator.mjs [--leaves=a,b] [--json=<path>]
 *        EXITS 3 whenever the reconstruction control disagrees with the published ring — which,
 *        at this base, it does on every leaf. That is the point of the file.
 * ⚠ ARM IT in the SHELL (REG-F0 J-F0-3). ⚠ Costs one extra partition build per circuit.
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { convexHull } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { liveFaces, faceCentroid, faceRing } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { measureRing } from '../laneDRESS1B/ringSanity.mjs';

/** ⭐ A form whose central 85 % occupies under half its own hull's length is stretched by its
 *  extremes, not by itself. Derived from the ratio, not fitted to the corpus. */
export const STRETCH_BAR = 2.0;
/** Pieces trimmed from EACH end. The corpus's two cases separate by an order of magnitude here. */
export const TRIM = 15;

/**
 * ⭐⭐⭐ THE PURE MEASURE — exported so a caller with a REAL raise-epoch point set (an instrumented
 * `raiseWrap`, or a future published `hullSources`) gets the verdict without forking this file.
 * @param {Array<[number,number]>} pts piece centroids as the hull saw them
 */
export function discriminate(pts) {
  const n = pts.length;
  if (n < 3) return null;
  const mx = pts.reduce((s, p) => s + p[0], 0) / n;
  const my = pts.reduce((s, p) => s + p[1], 0) / n;
  let sxx = 0; let syy = 0; let sxy = 0;
  for (const p of pts) { sxx += (p[0] - mx) ** 2; syy += (p[1] - my) ** 2; sxy += (p[0] - mx) * (p[1] - my); }
  const ang = 0.5 * Math.atan2(2 * (sxy / n), (sxx / n) - (syy / n));
  const us = pts.map((p) => (p[0] - mx) * Math.cos(ang) + (p[1] - my) * Math.sin(ang)).sort((a, b) => a - b);
  const span = us[n - 1] - us[0];
  const k = Math.round(n * 0.075);
  const core = (n - 1 - k > k) ? us[n - 1 - k] - us[k] : span;
  const t = Math.min(TRIM, Math.max(1, Math.floor(n / 8)));
  const trimmed = (n - 1 - t > t) ? us[n - 1 - t] - us[t] : span;
  let maxGap = 0;
  for (let i = 0; i + 1 < n; i++) maxGap = Math.max(maxGap, us[i + 1] - us[i]);
  const stretch = core > 0 ? span / core : Infinity;
  const trimLoss = span > 0 ? 1 - trimmed / span : 0;
  const gapShare = span > 0 ? maxGap / span : 0;
  return {
    n, span, core, trimmed, maxGap, stretch, trimLoss, gapShare, trimUsed: t,
    verdict: (stretch >= STRETCH_BAR || trimLoss >= 0.5 || gapShare >= 0.6) ? 'ARTIFACT' : 'HONEST',
  };
}

/* ─────────────────────────────────────────────────────────────────── the refuted method ── */
const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);
const f2 = (v) => (Number.isFinite(v) ? v.toFixed(2) : '∞');

console.log('══ THE TRUNCATED-LEDGER RECONSTRUCTION, WITH THE CONTROL THAT REFUTES IT ══');
console.log('A verdict is printed ONLY where the re-hulled set reproduces the published ring.\n');
console.log(`${'leaf'.padEnd(12)}${'wrap'.padEnd(5)}${'traced?'.padStart(8)}${'rePieces'.padStart(9)}`
  + `${'reHullAsp'.padStart(11)}${'ringAsp'.padStart(9)}  CONTROL`);
const rows = [];
let disagreements = 0; let checked = 0;
for (const key of leaves) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  if (!P.wraps.length) continue;
  const ledger = input.ledger;
  for (const w of P.wraps) {
    const ce = (ledger.epochs || []).flatMap((e) => e.circuitEvents || []).find((e) => e.index === w.index);
    if (!ce) { console.log(`${key.padEnd(12)}E${w.index}  ⛔ NO LEDGER EVENT`); continue; }
    const pre = buildSettledPartition({ ...input, ledger: { ...ledger, epochs: ledger.epochs.slice(0, ce.epoch) } });
    const arr = pre.arrangement;
    const cs = []; const hullPts = [];
    for (const f of liveFaces(arr)) {
      if (f.cls !== 'PLOT' && f.cls !== 'VOID' && f.cls !== 'BLOCK') continue;
      const c = faceCentroid(arr, f.id);
      if (Math.hypot(c[0] - input.extent.cx, c[1] - input.extent.cy) > ce.frozenRadius) continue;
      cs.push(c);
      for (const p of faceRing(arr, f.id)) hullPts.push(p);
    }
    const hull = hullPts.length >= 3 ? convexHull(hullPts) : null;
    const hm = hull && hull.length >= 3 ? measureRing(hull.map((p) => [p[0], p[1]])) : null;
    const rm = measureRing(w.outer.map((p) => [p[0], p[1]]));
    // ⛔ THE CONTROL. The reconstruction is only usable if re-hulling its set reproduces the ring
    //    the constructor published. 10 % on the min-area-rect aspect is generous by design.
    const agrees = !!hm && Math.abs(hm.obb.aspect - rm.obb.aspect) <= 0.1 * Math.max(1, rm.obb.aspect);
    checked++;
    if (!agrees) disagreements++;
    const D = discriminate(cs);
    rows.push({ leaf: key, wrap: w.index, epoch: ce.epoch, rePieces: cs.length,
      reHullAspect: hm ? hm.obb.aspect : null, ringAspect: rm.obb.aspect, agrees, reconstructed: D });
    console.log(`${key.padEnd(12)}${`E${w.index}`.padEnd(5)}${'no'.padStart(8)}${String(cs.length).padStart(9)}`
      + `${f2(hm ? hm.obb.aspect : NaN).padStart(11)}${f2(rm.obb.aspect).padStart(9)}  `
      + (agrees ? `✔ usable — verdict ${D ? D.verdict : 'n/a'}`
        : '⛔ REFUTED — this is NOT the fabric the constructor hulled, so no verdict is reported'));
  }
}
console.log(`\nRECONSTRUCTION CONTROL ${disagreements}/${checked} circuits DISAGREE with the published ring.`);
console.log(disagreements
  ? '⛔ THE TRUNCATED-LEDGER METHOD IS REFUTED. The raise-epoch piece set is unavailable from the\n'
    + '   published partition; recovering it needs `raiseWrap` to publish its hull inputs (see the\n'
    + '   file header). The measured verdicts in the header came from an INSTRUMENTED constructor.'
  : '✔ the reconstruction reproduces every published ring — the verdicts above may be believed.');
const out = arg('json', '');
if (out) { writeFileSync(out, JSON.stringify(rows, null, 1)); console.log(`wrote ${out}`); }
process.exitCode = disagreements ? 3 : 0;
