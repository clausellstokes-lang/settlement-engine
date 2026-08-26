/**
 * domain/townMap/fabric/partitionConstruct.js — ⭐⭐⭐ SPINE-1 · DESIGN_SPINE §3a–§3d under
 * **Amendment A1.4** · **THE EPOCH FOLD: THE LEDGER'S HISTORY BECOMES ONE PLANAR SUBDIVISION.**
 *
 * A1.4 rules the shape of this file in one sentence: *"the ledger remains the pure DATA pre-stage;
 * the PARTITION CONSTRUCTOR is a single-shot stage that FOLDS the ledger's epochs inside one build
 * (one construction per build; a frame = the same fold on the truncated ledger — prefix closure
 * preserved because the fold is append-only)."* So there is exactly one entry point, it runs once,
 * and it walks `ledger.epochs` in order appending into ONE arrangement (A1.6).
 *
 * THE FOUR ACTS, in the order §3 gives them:
 *   3a FOUNDING     — the frame in the typed form its origin demands
 *   3b ACCRETION    — plan units added at the frontier; **the way network GROWS as the gaps**
 *   3c THE WALL     — the wrap traced from piece enclosure, facet-resampled, inserted, gates minted
 *   3d UNDER A WRAP — infill first, then TYPED extramural emission stamped at emission
 *
 * ⭐⭐⭐ **A2.1 SUPERSEDES THE PLAN-UNIT SPELLING: THE ADDING RULE IS ONE RECURSION.**
 * The first build of this file made an R-MORPH "atomic street block" the piece-adding quantum —
 * a patch, a way, two plot series. Amendment A2.1 (§676) replaces it with the STOP-RULE GUILLOTINE
 * (`subdivide` below): one recursion whose COARSE cuts open gaps (the way network) and whose FINE
 * cuts are gapless (party walls), halting on a per-piece area threshold. It is strictly better on
 * this lane's own measurements — the patch spelling left 5,943 geometric refusals and 13 proper
 * crossings on the town leaf; the recursion cuts inside bounded faces and does neither — and it
 * makes A1.2's aggregation the exact inverse of the cut that generated the run.
 *
 * ⭐⭐ **THE ORGANIC GUARD, AND A2.2 CLOSES IT.**
 * §3b says irregularity *"is a property of the PIECE-ADDING rule per origin type … never a
 * post-hoc jitter"*, and the panel's morphology lens measured what happens when a rule satisfies
 * that sentence and still combs: at the seal `parcels.js:404-413` lays rows×cols with its own
 * "ROW JITTER" INSIDE the piece-adding loop under ONE `grainAngle` per organism, and the shipped
 * organic and regularized leaves are statistically the same fabric (median nearest-neighbour axial
 * difference 0.03° both; an engine-comb control measures 0.00°, a grown plan-unit quilt 2.29°, an
 * i.i.d. post-hoc jitter 17.28°). The separating property is **ORIENTATION-DOMAIN STRUCTURE** —
 * domain granularity well below ward size, within-domain drift small but nonzero, between-domain
 * diversity high. So the quantum here is R-MORPH's *atomic street-block*: **one way + its two plot
 * series + their back lanes**, each unit drawing its OWN bearing and module, with a small drift
 * INSIDE the unit. A comb cannot be rebuilt from it because no two units share a bearing.
 * A2.2 rules the metrics: roundness gradient centre→edge · junction-degree mix (T vs X share) ·
 * **cut-angle variance BY RECURSION DEPTH** — and never spectral or jitter metrics. All three are
 * decision statistics, and this constructor moves no vertex after placing it, so *"never post-hoc
 * jitter"* (§3b) is enforceable rather than aspirational: a coordinate-noise op class inside this
 * file is a conviction. ⚠ THE CENSUS ITSELF IS REPORTED, NOT MINTED AS AN EXIT — A1's exit set does
 * not carry it and adding one is the chair's call.
 *
 * ⚠ WATER, EXACTLY AS FAR AS A1.5 GOES AND NO FURTHER. §3e is SPINE-2's. Here the watercourse is a
 * **REFUSAL MASK**: no way, plot or wrap facet is minted inside the wet band, refusals are COUNTED,
 * and the frontier vertices a unit stopped at carry `bank`. That is A1.5's *"corridors terminate at
 * bank/frontier nodes by the partition's own construction"* — and it makes §1's *"no WAY edge
 * spans WATER"* zero BY CONSTRUCTION with a plantable control. The `WATER` face class and the
 * `CROSSING` edge type are RESERVED and minted zero; SPINE-2 fills them.
 *
 * PURITY: pure. Every draw is `keyedRandom`, which is a string hash with no stream — this module
 * opens NO `fabricRng` fork, so the fabric's pinned stateful-stream total does not move.
 */

import { keyedRandom } from './fabricRng.js';
import { convexHull, resampleClosed } from './fabricGeometry.js';
import { annotate, beatEvent } from './growthAnnotation.js';
import {
  addVertex, chordInFace, createArrangement, cutFaceByLine, cutWay, faceArea, faceCentroid,
  faceRing, insertRing, liveFaces, locateFace, mintPiece, seedRegion, WAY_RANKS,
} from './partitionArrangement.js';
import { CROSSING_LAW, cutWatercourse, mintCrossings, mintQuays } from './partitionWater.js';
import { declineEpoch, publishLosses, reclaimEpoch } from './partitionDecline.js';

export const PARTITION_SCHEMA_VERSION = 1;

/**
 * ⭐⭐ THE ORIGIN TYPES, and the enum is R-MORPH's two-level typology carried WHOLE rather than
 * §2's lossy three-slot version. The panel's morphology lens convicted the collapse by name:
 * `POLYFOCAL` and `DISPERSED_HAMLET_SCATTER` were dropped outright and three distinct forms were
 * bundled into one "linear/green/row" slot.
 * ⚠ **TYPED BY R-MORPH, WEIGHTED BY NOBODY.** R-MORPH's own labelling discipline says it *"mints
 * no probabilities"*, so the doc's "weights grade until fetched-CONFIRMED" over-promised. These are
 * a CLOSED ENUM the caller selects from; SPINE-1 mints no prevalence prior and no weight table.
 */
export const ORIGIN_FORMS = Object.freeze(['NUCLEATED_CROSSROADS', 'ROW_SINGLE', 'ROW_DOUBLE_FACING',
  'GREEN_VILLAGE', 'STREET_VILLAGE', 'POLYFOCAL', 'DISPERSED_HAMLET_SCATTER']);

/** The planned modes, likewise R-MORPH's. `COMPOSITE` is recovered per-act across epochs. */
export const PLAN_MODES = Object.freeze(['PLANTED_GRID', 'PLANTED_SPINE', 'ORGANIC_PLAN_UNIT_QUILT',
  'COMPOSITE']);

/** The way widths, by rank, as a multiple of the settlement's road width. */
export const RANK_WIDTH = Object.freeze({ artery: 1.0, street: 0.72, lane: 0.5, path: 0.34 });

/**
 * ⭐⭐ **A2.1's TWO STRUCTURAL CONSTANTS.**
 * `LOT_FLOOR_RATIO` converts an epoch's plot BUDGET into the recursion's floor area: the ground a
 * lot finally occupies is bigger than area÷count because the gaps (the way network) are cut out of
 * the same ground. ⚠ MEASURED, not guessed — see the receipt's floor-calibration row.
 * `SUBDIVIDE_DEPTH_CAP` is a refusal, not a tuning dial: a recursion that has not halted in this
 * many levels has a degenerate face and the census should see the piece rather than a stack blow.
 */
export const LOT_FLOOR_RATIO = 1.75;
export const SUBDIVIDE_DEPTH_CAP = 24;

/**
 * ⭐⭐⭐ **THE LOT FLOOR, IN ROAD-WIDTH² — A1.2's BAND, MADE GENERATIVE.** A1.2 pins the page band
 * at **2.7–4.6 rw²** (the reference's own, under road-width normalisation). A2.1 says the band is
 * MANUFACTURED by the halt condition, so the floor is spelled in the band's own unit and the
 * census becomes a VERIFIER of the mechanism rather than a legislator against it.
 * ⚠ PROPOSED; calibrated by measurement (see the receipt's band row), rides the tuning signature.
 */
export const LOT_FLOOR_RW2 = 0.9;

/**
 * ⭐⭐⭐ **THE MASS TARGET — WHERE A1.2's BAND IS ACTUALLY MANUFACTURED, and it is the GAP BAR, not
 * the lot floor.** A party run ends where a GAP cut stopped happening, so the run's area is the
 * area at which the gap bar last failed — which means the PAGE MASS's size band is a property of
 * the gap bar and of nothing else. The first spelling used the reference's own heavy-tailed bar
 * (`area > aMin/(u₁·u₂)`) and the page came back with a band ratio of 2.2–3.9 against the
 * reference's measured 1.71; a bar drawn about the band centre with the ward's size chaos puts the
 * masses where A1.2 pins them, and the §6 page census then VERIFIES the mechanism (A2.1) instead of
 * arguing with it.
 * ⚠ PROPOSED; rides the chair's signature and the owner's tuning re-signature.
 */
export const MASS_TARGET_RW2 = 3.6;

/**
 * ⭐ DENSIFICATION UNDER A STANDING WRAP. §3d's infill genuinely makes SMALLER tenure than open
 * accretion — that is what densification IS — so the floor scales down rather than being abandoned.
 * ⚠ PROPOSED; rides the tuning signature.
 */
export const INFILL_FLOOR_SCALE = 0.62;

const DEG = Math.PI / 180;

/**
 * ⛔⛔ **EVERY DRAW CALLS `keyedRandom` DIRECTLY, WITH ITS MECHANIC ID AS A LITERAL, AND THAT IS A
 * REGISTRY REQUIREMENT RATHER THAN A STYLE.** The stage-manifest walker derives a node's
 * `randomNamespaces` from the string LITERALS passed to `keyedRandom`/`hashUnit`/`fabricRng` **at
 * the call site**. A local `draw(seed, key, mechanic, i)` helper hides every one of them: the
 * literal is an argument to `draw`, the walker sees only a variable, and the node registers ZERO
 * namespaces while minting ten. That is the silent half of the class REG-5 banked — *a new
 * key-minting derivation owes both registries* — and the version of it that no walker convicts,
 * because a derived empty set matches a declared empty set perfectly.
 *
 * ⚠ `keyedRandom` is a pure string hash with NO stream, so this module opens no `fabricRng` fork
 * and the fabric's pinned stateful-stream total does not move.
 */

/** Facet a ring to a form's own economy — the turn distribution is a property of the FORM. */
function facetRing(ring, facets) {
  const n = Math.max(6, Math.round(facets));
  return resampleClosed(ring, n);
}

/**
 * ⭐⭐⭐ **THE WATERCOURSE INDEX — GROW-A's OPENING PERF ACT (ODQ §681.4), AND THE MEASUREMENT MOVED
 * THE TARGET.** §681.4 assigns the fjord's +15.6 % (3,169.6 ms against the town's 532.1 ms) to *"the
 * predicted `chordInFace` bbox pre-filter"*. **THAT PREDICTION IS REFUTED BY EXECUTION.** A V8 CPU
 * profile of the fjord's own build (`--cpu-prof`, warm, this seal) reads:
 *
 * ```
 * inWater            self  5,468.8 ms   70.1 % of 7,800.9 ms sampled
 * segTouchesWater    self      5.2 ms   incl  1,055.7 ms
 * chordInFace        self      1.5 ms   incl      4.6 ms   ← 0.06 %
 * boundaryCrossings  self      5.4 ms   incl      5.4 ms
 * ```
 *
 * A pre-filter on a 4.6 ms path cannot cure a 2.6-second overrun. The cost is the REFUSAL MASK: a
 * LINEAR scan of the whole watercourse polyline per query, and the fjord's coast carries **556
 * points** against a river leaf's 290 — while `segTouchesWater` asks the question once per half unit
 * of every candidate chord. The town pays it 290-fold, the fjord 556-fold, and the metropolis (which
 * has **no water at all**) does not pay it, which is why the biggest leaf is the third fastest.
 *
 * ⭐⭐ THE CURE IS AN INDEX, NOT A TOLERANCE, AND IT IS **EXACT**. Segments are bucketed by bbox into
 * a uniform grid; a query scans only the cells its own `[x±half, y±half]` box touches. If a segment
 * lies within `half` of the point, its closest point `q` is inside BOTH the segment's bbox and the
 * query box, so `q`'s cell is indexed for that segment and is scanned — no segment within tolerance
 * can be missed. The per-segment arithmetic is untouched, so the boolean is bit-identical to the
 * linear scan's `best <= half`; the whole-line bbox is a strictly conservative early-out on top.
 * ⚠ The index rides `state`, never a module-level cache: this file stays pure, and a second leaf in
 * the same process cannot read the first leaf's river.
 */
const WATER_INDEX_CELLS = 48;

/** Build the watercourse's bucket grid once per fold. Null where the leaf carries no channel. */
function buildWaterIndex(water) {
  const w = water;
  if (!w || !w.line || w.line.length < 2) return null;
  let lox = Infinity; let loy = Infinity; let hix = -Infinity; let hiy = -Infinity;
  for (const p of w.line) {
    if (p[0] < lox) lox = p[0]; if (p[0] > hix) hix = p[0];
    if (p[1] < loy) loy = p[1]; if (p[1] > hiy) hiy = p[1];
  }
  const span = Math.max(hix - lox, hiy - loy, 1);
  // A cell no smaller than the channel's own width: a query box is then a handful of buckets rather
  // than a second linear scan wearing a grid's clothes.
  const cell = Math.max(span / WATER_INDEX_CELLS, Math.max(1, w.width || 1));
  /** @type {Map<string, number[]>} */ const buckets = new Map();
  for (let i = 0; i + 1 < w.line.length; i++) {
    const [ax, ay] = w.line[i]; const [bx, by] = w.line[i + 1];
    const gx0 = Math.floor(Math.min(ax, bx) / cell); const gx1 = Math.floor(Math.max(ax, bx) / cell);
    const gy0 = Math.floor(Math.min(ay, by) / cell); const gy1 = Math.floor(Math.max(ay, by) / cell);
    for (let gy = gy0; gy <= gy1; gy++) {
      for (let gx = gx0; gx <= gx1; gx++) {
        const k = `${gx}|${gy}`;
        const b = buckets.get(k);
        if (b) b.push(i); else buckets.set(k, [i]);
      }
    }
  }
  return { cell, lox, loy, hix, hiy, buckets, segments: w.line.length - 1 };
}

/** Is a world point inside the watercourse's wet band? The construction refusal mask. */
function inWater(state, x, y, pad) {
  const w = state.input.water;
  if (!w || !w.line || w.line.length < 2) return false;
  const half = (w.width || 0) / 2 + (w.pad || 0) + (pad || 0);
  if (!(half > 0)) return false;
  const ix = state.waterIndex;
  if (!ix) return false;
  // (1) THE WHOLE-LINE BBOX — the early-out that answers most of a settlement's ground at once.
  if (x < ix.lox - half || x > ix.hix + half || y < ix.loy - half || y > ix.hiy + half) return false;
  // (2) ONLY THE CELLS THE QUERY BOX TOUCHES, with the linear scan's own per-segment arithmetic.
  const gx0 = Math.floor((x - half) / ix.cell); const gx1 = Math.floor((x + half) / ix.cell);
  const gy0 = Math.floor((y - half) / ix.cell); const gy1 = Math.floor((y + half) / ix.cell);
  for (let gy = gy0; gy <= gy1; gy++) {
    for (let gx = gx0; gx <= gx1; gx++) {
      const b = ix.buckets.get(`${gx}|${gy}`);
      if (!b) continue;
      for (const i of b) {
        const [ax, ay] = w.line[i]; const [bx, by] = w.line[i + 1];
        const dx = bx - ax; const dy = by - ay;
        const L2 = dx * dx + dy * dy;
        let t = L2 > 0 ? ((x - ax) * dx + (y - ay) * dy) / L2 : 0;
        t = t < 0 ? 0 : (t > 1 ? 1 : t);
        const px = ax + dx * t; const py = ay + dy * t;
        if (Math.hypot(x - px, y - py) <= half) return true;
      }
    }
  }
  return false;
}

/** Does the segment a→b touch the wet band anywhere? Sampled at the arrangement's own resolution. */
function segTouchesWater(state, a, b, pad) {
  const w = state.input.water;
  if (!w || !w.line) return false;
  const ix = state.waterIndex;
  if (!ix) return false;
  const half = (w.width || 0) / 2 + (w.pad || 0) + (pad || 0);
  // ⭐ THE SEGMENT'S OWN BBOX AGAINST THE CHANNEL'S — a chord that cannot reach the water at any
  //   parameter is answered without sampling it at all. Conservative, so no touch is missed.
  if (half > 0 && (Math.max(a[0], b[0]) < ix.lox - half || Math.min(a[0], b[0]) > ix.hix + half
    || Math.max(a[1], b[1]) < ix.loy - half || Math.min(a[1], b[1]) > ix.hiy + half)) return false;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(2, Math.ceil(L / 0.5));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    if (inWater(state, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, pad)) return true;
  }
  return false;
}

/**
 * A ring of `n` facets around a centre — the founding extent's own outline.
 * ⛔⛔ **NO WOBBLE. A2.2 FORBIDS COORDINATE NOISE IN THE CONSTRUCTOR** and the first spelling of
 * this function carried exactly the banned thing: a per-facet radius jitter on a circle. The
 * reference contains ZERO coordinate noise; its irregularity is entirely decision statistics. The
 * extent is a clean polygon and every irregularity a reader sees comes from what is CUT inside it.
 */
function discRing(cx, cy, r, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return out;
}

/**
 * ⭐⭐⭐ **THE FOLD.** One construction per build; epochs APPEND.
 * ⚠ NAMED `buildSettledPartition` AND NOT `buildPartition`: `organismFields.js` has exported a
 * `buildPartition` since the organism era and the assembly imports it. Two exports with one name in
 * one importer is a syntax error, and the near-miss is worse — a reader who greps `buildPartition`
 * finds the organism grid.
 *
 * @param {Object} input
 * @param {string} input.seed
 * @param {any}    input.ledger        a `growthLedger` artifact — the pure data pre-stage
 * @param {{cx:number,cy:number,radius:number,settlementRadius?:number}} input.extent
 *   `radius` is the HINTERLAND extent the countryside is seeded on; `settlementRadius` is the
 *   settlement's OWN built extent, carried through so the view can fit the page to the
 *   settlement without re-deriving the ratio between them (DRESS-FRAME).
 * @param {string} input.originForm    one of ORIGIN_FORMS
 * @param {string} [input.planMode]    one of PLAN_MODES
 * @param {number} input.roadWidth     the settlement's own road width (the rw of A1.2's rw² band)
 * @param {number} input.bodyTarget    the REPRESENTATIVE body count the substrate holds (A1.1)
 * @param {{line:Array<number[]>,width:number,pad?:number}|null} [input.water]
 * @param {{facets:number,width:number}|null} [input.wallForm]
 * @param {number} [input.epochCap]    fold at most this many epochs (the perf harness's dial)
 */
export function buildSettledPartition(input) {
  const seed = String(input.seed || 'partition-seedless');
  const ledger = input.ledger;
  const epochs = (ledger && ledger.epochs) || [];
  const arr = createArrangement();
  const state = {
    arr,
    seed,
    input,
    /** @type {Record<string, any>} */ annotations: {},
    /** @type {Array<any>} */ wraps: [],
    /** @type {Array<any>} */ gates: [],
    /** @type {Array<any>} */ units: [],
    /** @type {Array<any>} */ emissions: [],
    /** @type {Array<any>} */ quarters: [],
    /**
     * ⭐⭐⭐ ⟦CAR-FOUND, ODQ §718.2⟧ **WHAT EACH EPOCH ASKED FOR AND COULD NOT BUILD.** One row per
     * folded epoch, appended at the epoch's close. See `recordDemand` for why this channel exists
     * and why it is a RECORD rather than a mechanism.
     */
    /** @type {Array<any>} */ demands: [],
    waterRefusals: 0,
    gateEconomyRefusals: 0,
    sprawlRefusals: 0,
    emissionRefusals: 0,
    lastYear: 0,
    plots: 0,
    epoch: 0,
    order: 0,
    rootWard: -1,
    rootFace: -1,
    /** @type {Array<{face:number,at:number[],bearing:number}>} */ wayIndex: [],
    /** ⭐ A2.1's CUT RECORD. `runs` mints party-run ids at gapless cuts; `blockOfRun` is the BLOCK
     *  piece a run belongs to, so A1.2's stage-1 dissolve READS the run rather than re-finding it. */
    runs: 0,
    blocks: 0,
    develops: 0,
    /** @type {Map<string,number>} */ blockOfRun: new Map(),
    laneWidth: (input.roadWidth || 5) * RANK_WIDTH.lane,
    /** ⭐⭐ SPINE-2 · §3e's and §3f's own records. */
    /** @type {Array<any>} */ crossings: [],
    /** @type {Array<any>} */ quays: [],
    /** @type {Array<any>} */ losses: [],
    /** @type {any} */ waterCut: null,
    /** @type {Array<number[]>|null} */ waterRing: null,
    /** @type {Array<any>|null} */ waterStations: null,
    /** ⭐ THE REFUSAL MASK'S INDEX, built ONCE per fold — see `buildWaterIndex`. It rides the state
     *  rather than a module cache so the file stays pure and no leaf can read another leaf's river. */
    waterIndex: buildWaterIndex(input.water),
    crossingRefusals: 0,
    quayRefusals: 0,
    /** ⭐ A6.1's STAMP, PUBLISHED ON THE STATE so §3e's and §3f's modules mint through the SAME
     *  annotation home the fold does. A second `annotate` call site elsewhere would be a second
     *  emission vocabulary, which is the class L-REG-26 binds every wave against. */
    stamp: null,
  };
  state.stamp = (key, beat, epoch, sourceEvent) => stamp(state, key, beat, epoch, sourceEvent);

  const cap = Number.isFinite(input.epochCap) ? Math.min(input.epochCap, epochs.length) : epochs.length;
  let prevYear = 0;
  for (let k = 0; k < cap; k++) {
    state.epoch = k;
    state.order = 0;
    const ep = epochs[k];
    state.lastYear = ep.year;
    // ⭐⭐ ONE BUDGET PER EPOCH, SPENT ONCE. The ledger's population at K, scaled to the
    // REPRESENTATIVE substrate (A1.1), minus what the partition already holds. Accretion, infill
    // and emission all draw on THIS number — the first spelling gave infill its own budget and the
    // town leaf grew 530 bodies out of a 1,197-body settlement in seven plan units, because infill
    // was spending the same souls accretion had already spent.
    // ⭐⭐⭐ **§3f · THE LEDGER'S DIRECTION DECIDES WHICH HALF OF THE MACHINE RUNS.**
    // ⛔⛔ TWO SPELLINGS WERE MEASURABLY WRONG BEFORE THIS ONE, AND BOTH ARE WORTH THE LINES:
    //  (1) keying decline on `epochTarget − plots < 0` — the stop-rule recursion routinely finishes
    //      an epoch a few plots over budget, so the TOWN leaf minted 4 LossRegions out of a
    //      monotonically RISING ledger. The map invented a history the record does not hold, which
    //      is the one thing §3f may never do.
    //  (2) letting the recovery clock spend in a FALLING epoch — abandonment and the re-target then
    //      fight each other every epoch and the highwater leaf minted 483 regions for 238 faces,
    //      243 of them reclaimed in the middle of a collapse. Recovery is PRESSURE-driven, and a
    //      shrinking settlement has none.
    // So: the ledger's own population direction picks the half, and the SIZE of each is the
    // distance between what the ledger asks for and what the partition holds — never a rate.
    const rising = k === 0 || ep.population >= epochs[k - 1].population;
    /** ⭐⭐⭐ **§3f · A RECORDED DISASTER BURNS WHETHER OR NOT THE POPULATION FELL** (A1.4, ODQ §683):
     *  *"born at a RECORDED disaster (monotone seeds included: 192/200 seeds carry dated disasters
     *  with no trajectory fall — debris never keys to falling population)"*. Before the ledger's
     *  channel was filled, the ONLY birth condition here was a falling epoch, so every monotone
     *  world's fires and floods left no mark on its ground at all. */
    const recordedLosses = (ep.lossRegions || []).filter((L) => L.provenance === 'recorded');
    const target = epochTarget(state, ep);
    if (state.losses.length) {
      reclaimEpoch(state, ep, ep.year - prevYear, rising ? Math.max(0, target - state.plots) : 0);
    }
    let budget = Math.max(0, target - state.plots);
    // ⭐⭐⭐ ⟦CAR-FOUND⟧ THE EPOCH'S OPENING POSITION, TAKEN BEFORE ONE ACT OF ITS GROWTH RUNS.
    //   `demand` is what this epoch asked the ground for; whatever is left in `budget` at the
    //   close is what the ground refused to give it. Both were computed here already — only the
    //   second was thrown away. See `recordDemand`.
    const openPlots = state.plots;
    const demand = budget;
    const openRefusals = refusalTally(state);
    // ⭐⭐⭐ **§684.3 · THE RAISE PRECEDES ITS EPOCH'S GROWTH.** A wall is built around what EXISTS,
    // and that epoch's growth then ANSWERS it — infill inside the new band, typed emission outside.
    // The wrap is therefore computed and frozen HERE, before one accretion or infill act of this
    // epoch runs, and the growth branch below reads `state.wraps.length` with this epoch's circuit
    // already standing.
    // ⛔⛔ **THIS IS THE ROOT CURE OF J-GROWA-12, AND THE ROOT IS THE ORDER, NOT THE EMISSION.**
    // While the raise ran AFTER the growth, an epoch that raised its FIRST wall took the `accrete`
    // branch (no wrap stood when the branch was chosen), so that epoch's ledger emission acts were
    // never asked for — one act dropped per walled leaf, MEASURED as 12 of 132 corpus-wide, every
    // one of them at a raise epoch. Asking for them where they used to be — after the raise, with
    // the epoch's budget already spent by accretion — was BUILT AND MEASURED by GROW-A and cost the
    // metropolis 2,650 → 1,698 plots: a one-soul emission at a spent-budget epoch still carved a
    // development patch out of the open frontier, and `pickHost`'s largest-face order never
    // recovered the ground. Under this order that state cannot arise: at a walled epoch `accrete`
    // does not run at all, so the emission never competes with it for the largest face, and the
    // budget the emission draws on is the epoch's own, unspent.
    // ⚠ **EPOCH 0 IS THE ONE EXCEPTION AND IT IS STRUCTURAL, NOT A CARVE-OUT.** `raiseWrap` traces
    // the hull of the BUILT PIECES; before `foundingFrame` seeds the root face there are no faces at
    // all, so a raise here would fall through the `pts.length < 8` floor and the circuit event would
    // be LOST SILENTLY. The founding frame runs first and the raise follows it within the same
    // epoch — still ahead of every later epoch's growth. MEASURED: **0 of 18 corpus leaves carry a
    // circuit event at epoch 0** (earliest is the metropolis at epoch 6), so this branch changes no
    // leaf's drawing today; it exists so a record that does date a founding wall cannot lose it.
    if (k > 0) for (const ce of (ep.circuitEvents || [])) raiseWrap(state, ep, ce);
    if (k === 0) {
      budget = foundingFrame(state, ep, budget);
      for (const ce of (ep.circuitEvents || [])) raiseWrap(state, ep, ce);
    } else if (!rising) {
      // ⭐⭐ **§3f · PIECES EMPTY → ABANDON.** Exactly as many pieces as the ledger's own fall no
      // longer holds souls for — the partition is brought TO the record, never past it.
      // ⚠ …OR AS MANY AS THE RECORD'S OWN DATED DISASTERS ASK FOR, WHICHEVER IS GREATER: a recorded
      //   great fire is not allowed to go undrawn because the population happened to fall by less.
      declineEpoch(state, ep, Math.max(recordedLosses.length, Math.max(0, state.plots - target)));
    } else if (state.wraps.length) {
      // ⭐ §3d · UNDER A STANDING WRAP THERE IS NO FREE ACCRETION. Growth is INFILL, and only then
      // does a TYPED act put souls outside — never untyped sprawl.
      const share = ep.plotSetDelta > 0 ? (ep.intramuralDelta || 0) / ep.plotSetDelta : 1;
      budget -= infill(state, ep, Math.round(budget * share));
      for (const em of (ep.emissions || [])) budget -= emit(state, ep, em, budget);
    } else budget -= accrete(state, ep, budget);
    // ⭐⭐ THE RISING EPOCH'S OWN DISASTERS, AFTER its growth — the fire takes ground the settlement
    //    has, which includes what it built this epoch. In a FALLING epoch the branch above already
    //    consumed them, so this cannot double-birth.
    if (rising && recordedLosses.length) declineEpoch(state, ep, recordedLosses.length);
    // ⚠ THE RAISE USED TO STAND HERE, AFTER THE GROWTH. §684.3 moved it ahead of the growth branch
    //   above; J-GROWA-12's dropped act is cured there and the reason is written at the new site.
    for (const qm of (ep.quarterMints || [])) mintQuarter(state, ep, qm);
    // ⭐⭐ **§3e · THE CROSSINGS AND THE QUAYS ARE EPOCH ACTS.** A ford is as old as the site; a
    // bridge is a public work a settlement grows into (`CROSSING_BUDGET.popFloor`), so it is minted
    // at the FIRST epoch whose population can pay for it and never re-minted. The quays follow the
    // waterfront the settlement has actually built, which is why they are asked every epoch and
    // answer only where the ground says yes.
    if (state.waterStations && state.crossings.length < CROSSING_LAW.maxPerLeaf) {
      state.crossings.push(...mintCrossings(state, ep, ep.population));
    }
    if (state.waterStations) state.quays.push(...mintQuays(state, ep));
    reconcileTenure(state, ep);
    prevYear = ep.year;
    // ⛔⛔ **THIS LINE WAS `void budget;`** — the epoch's unspent demand, computed and DISCARDED.
    recordDemand(state, ep, { target, demand, openPlots, remainder: budget, openRefusals, rising });
  }

  sweepGateEconomy(state);
  return publish(state, cap);
}

/**
 * ⭐⭐ §3a · THE FOUNDING FRAME. The site becomes the initial frame **in the typed form its origin
 * demands** — a nucleated cluster at a crossing, a row along one way, a planned plat when the
 * history holds a dated founding act.
 *
 * ⚠ THE ROOT FACE IS SEEDED AT THE **FINAL** EXTENT AND CONSUMED FORWARD. That is what makes the
 * fold append-only: no epoch ever re-cuts the outline, so a frozen wrap and an emitted delta stay
 * exactly where the epoch that made them put them (A1.6 / §3g's prefix closure).
 */
function foundingFrame(state, ep, budget) {
  const { arr, seed, input } = state;
  const ex = input.extent;
  const outline = discRing(ex.cx, ex.cy, ex.radius, 24);
  state.rootFace = seedRegion(arr, outline, {
    faceClass: 'FIELD', edgeType: 'BOUND', frontier: true, key: 'extent',
  });
  state.rootWard = mintPiece(arr, 'WARD', -1, null, {
    name: null, epoch: 0, reason: 'the founding ward — name-rights are EARNED at a tier threshold',
  });
  stamp(state, `ward.${state.rootWard}`, 'FOUNDING', ep, 'history.founding.age');

  // ⭐⭐⭐ **§3e · THE WATER IS CUT BEFORE ONE WAY IS LAID, BECAUSE THE RIVER IS OLDER THAN THE
  // TOWN.** Once the channel is a WATER face bounded by BANK edges, §1's *"no WAY edge spans
  // WATER"* stops being a rule the constructor must remember and becomes a consequence of the
  // substrate: every later act is a chord inside ONE bank's ground, and a chord inside a face
  // cannot reach across a face that is not it. The refusal mask stays anyway — it answers for the
  // marsh wetness beyond the drawn channel, which is `sub.wet`'s question and not the channel's.
  state.waterCut = cutWatercourse(state, ep);

  const bearing = keyedRandom(seed, 'founding', 'bearing', 0) * 360;
  const form = input.originForm || 'NUCLEATED_CROSSROADS';
  const rw = input.roadWidth || 5;
  // ⭐ THE FRAME'S BEARING IS RE-DRAWN UNTIL THE SITE ACCEPTS IT. A settlement on a river has its
  // spine ALONG the water, not across it — so a refused bearing is re-drawn rather than dropped,
  // and the site therefore SHAPES the founding frame instead of merely vetoing it.
  for (let attempt = 0; attempt < 12; attempt++) {
    const b = bearing + attempt * 15;
    const spines = foundingSpines(form, [ex.cx, ex.cy], b, ep.builtRadius || ex.radius * 0.3);
    let laid = 0;
    for (const [i, sp] of spines.entries()) {
      const host = locateFace(arr, sp.at[0], sp.at[1]);
      if (host < 0) continue;
      if (layWay(state, host, sp.at, sp.dir, rw * RANK_WIDTH.artery, 'artery', `found.${i}`, ep)) laid++;
    }
    if (laid) break;
  }
  // ⭐ THE FOUNDING VOID. A market/green is a piece whose EMPTINESS is the point (§1) — it is cut
  // as ground at the frame's own crossing, never furnished here (the vocabulary is REG-4's).
  const voidAt = [ex.cx, ex.cy];
  const vf = locateFace(arr, voidAt[0], voidAt[1]);
  if (vf >= 0 && arr.faces[vf].cls !== 'WAY' && !inWater(state, voidAt[0], voidAt[1])) {
    const side = Math.max(rw * 2.2, Math.sqrt(faceArea(arr, vf)) * 0.34);
    const cut = carveVoid(state, vf, voidAt, side, form === 'GREEN_VILLAGE' ? 'green' : 'market', ep);
    if (cut < 0) state.waterRefusals += 0;
  }
  // the founding epoch's own plot budget, spent by the same recursion every later epoch uses
  return Math.max(0, budget - accrete(state, ep, budget));
}

/**
 * ⭐⭐ **THE EPOCH'S TENURE RECONCILIATION.** A face can be split by an act that is not a
 * subdivision — the wrap's ring insertion cuts straight through whatever it crosses — and the new
 * half inherits its parent's CLASS but deliberately not its PIECE (see `splitFaceChain`'s guard, and
 * the reason: one piece owning two faces would make A1.2's identity bijection false at the
 * substrate). So at the close of every epoch each piece-less piece face is given its own tenure,
 * under the sibling's block, and STAMPED.
 * ⛔ THIS IS A REPAIR STEP AND IT IS NAMED AS ONE. The containment census counted 11 piece-less plot
 * faces on the town leaf before it existed; leaving them to be swept up silently at publication is
 * exactly the write-that-survives-one-path class this estate keeps paying for.
 */
function reconcileTenure(state, ep) {
  const { arr } = state;
  for (const f of liveFaces(arr)) {
    if (f.piece >= 0) continue;
    if (f.cls === 'PLOT') {
      const block = neighbourBlock(state, f.id);
      const pid = mintPiece(arr, 'PLOT', f.id, block, { reconciled: true });
      state.plots++;
      stamp(state, `plot.${pid}`, 'INFILL', ep,
        `tenure reconciled at the close of epoch ${state.epoch} — the piece was split by an act`
        + ' that was not a subdivision');
    } else if (f.cls === 'VOID' && !state.annotations[`void.${f.id}`]) {
      stamp(state, `void.${f.id}`, 'INFILL', ep, `a void left by an epoch-${state.epoch} act`);
    } else if (f.cls === 'WAY' && !state.annotations[`way.${f.id}`] && !state.annotations[`gate.${f.id}`]) {
      stamp(state, `way.${f.id}`, 'INFILL', ep, `a way face split by an epoch-${state.epoch} act`);
    } else if (f.cls === 'WALLBAND' && !state.annotations[`wallband.${f.id}`]) {
      stamp(state, `wallband.${f.id}`, 'CIRCUIT_RAISED', ep,
        `band ground split by an epoch-${state.epoch} act`);
    } else if (f.cls === 'WATER' && !state.annotations[`water.${f.id}`]) {
      // ⭐⭐ SPINE-2 · A WATER FACE SPLIT BY A LATER ACT OWES A FRESH ANNOTATION FOR THE SAME
      //   REASON A RE-CLASSED BAND FACE DOES: its parent's key names a face it no longer is, and
      //   A6.1's walker counts the new half as an orphan. A wrap crossing the river and a bridge
      //   both do exactly this split.
      stamp(state, `water.${f.id}`, 'INFILL', ep,
        `water ground split by an epoch-${state.epoch} act — a crossing, a quay or a wrap`);
    } else if (f.cls === 'LOSSREGION' && !state.annotations[`loss.${f.id}`]) {
      stamp(state, `loss.${f.id}`, 'ABANDONMENT', ep,
        `abandoned ground split by an epoch-${state.epoch} act`);
    }
  }
}

/** The BLOCK piece of a neighbouring plot, or a fresh one under the root ward. */
function neighbourBlock(state, fid) {
  const { arr } = state;
  let h = arr.faces[fid].he;
  const start = h;
  let guard = 0;
  do {
    const he = arr.halfEdges[h];
    const nb = arr.faces[arr.halfEdges[he.twin].face];
    if (nb && nb.piece >= 0 && arr.pieces[nb.piece].cls === 'PLOT') {
      return arr.pieces[nb.piece].parent;
    }
    h = he.next;
    if (++guard > 4096) break;
  } while (h !== start);
  return mintPiece(arr, 'BLOCK', -1, state.rootWard, { reconciled: true });
}

/** The founding spines each origin form demands. Typed, closed, and no weights are minted. */
function foundingSpines(form, at, bearing, r) {
  const b = bearing * DEG;
  const u = [Math.cos(b), Math.sin(b)];
  const v = [-u[1], u[0]];
  switch (form) {
    case 'ROW_SINGLE':
    case 'STREET_VILLAGE':
      return [{ at, dir: u }];
    case 'ROW_DOUBLE_FACING':
      return [{ at, dir: u }];
    case 'GREEN_VILLAGE':
      return [{ at, dir: u }, { at: [at[0] + v[0] * r * 0.6, at[1] + v[1] * r * 0.6], dir: u }];
    case 'POLYFOCAL':
      return [
        { at: [at[0] - u[0] * r * 0.45, at[1] - u[1] * r * 0.45], dir: v },
        { at: [at[0] + u[0] * r * 0.45, at[1] + u[1] * r * 0.45], dir: v },
        { at, dir: u },
      ];
    case 'DISPERSED_HAMLET_SCATTER':
      return [{ at, dir: u }];
    case 'NUCLEATED_CROSSROADS':
    default:
      return [{ at, dir: u }, { at, dir: v }];
  }
}

/** Cut a square-ish VOID out of a face — the market/green whose emptiness is the point. */
function carveVoid(state, fid, at, side, kind, ep) {
  const { arr } = state;
  const half = side / 2;
  let cur = fid;
  const dirs = [[1, 0], [0, 1]];
  for (const d of dirs) {
    for (const s of [1, -1]) {
      const p = [at[0] - d[1] * 0 + d[0] * 0, at[1]];
      const off = [at[0] + (-d[1]) * 0, at[1]];
      void p; void off;
      const q = [at[0] + d[0] * 0 + (-d[1]) * s * half, at[1] + d[1] * 0 + d[0] * s * half];
      const res = cutFaceByLine(arr, cur, q, d, { type: 'BOUND', key: `void.${kind}` });
      if (!res) return -1;
      const keep = res.faces.find((f) => {
        const c = faceCentroid(arr, f);
        return Math.abs(c[0] - at[0]) <= half + 1e-6 && Math.abs(c[1] - at[1]) <= half + 1e-6;
      });
      cur = keep === undefined ? res.faces[0] : keep;
    }
  }
  arr.faces[cur].cls = 'VOID';
  arr.faces[cur].attrs = { ...arr.faces[cur].attrs, voidKind: kind };
  const pid = mintPiece(arr, 'BLOCK', cur, state.rootWard, { voidKind: kind });
  void pid;
  stamp(state, `void.${cur}`, 'FOUNDING', ep, `the founding ${kind} at the frame's crossing`);
  return cur;
}

/** Lay one way through a face, refusing the watercourse. Returns the way face or -1. */
function layWay(state, fid, at, dir, width, rank, key, ep) {
  const { arr, input } = state;
  // ⛔⛔ THE WATER TEST IS ON THE **CHORD**, NOT ON THE EXTENT DIAMETER. Testing a full-diameter
  // segment refuses every line through a riverside town — measured: the town leaf's founding
  // arteries were all refused and it drew ZERO plots. The chord is the ground the cut will
  // actually make into a way, so it is the ground §1's "no WAY edge spans WATER" is about.
  const chord = chordInFace(arr, fid, at, dir);
  if (!chord) { state.waterRefusals += 0; return null; }
  // ⚠⚠ **THE PAD IS THE WAY'S OWN HALF-WIDTH, AND WITHOUT IT THE INVARIANT FAILS ON REAL LEAVES.**
  // A way is a GAP WITH WIDTH (§1): testing only its centreline lets the kerbs dip into the
  // watercourse while the centreline stays dry. Measured before the pad: 1, 4 and 1 way faces with
  // a ring vertex inside the wet band on town-2, highwater and year-100 — three of eighteen leaves
  // reding a structural invariant on a technicality that was really a missing half-width.
  if (segTouchesWater(state, chord[0], chord[1], width / 2)) { state.waterRefusals++; return null; }
  // ⛔⛔ **AND THE KERBS ARE TESTED AS THEMSELVES, BECAUSE THE PAD IS NOT THE WHOLE ANSWER
  // (GROW-A-RESUME).** `cutWay` cuts TWO chords at ±width/2, and each is bracketed by ITS OWN pair
  // of boundary crossings — a kerb can therefore run further than the centreline chord does and
  // reach ground the padded centreline test never looked at. ⚠ MEASURED: with the carriageway-probe
  // cure landing ways that used to be refused, the `year-018` leaf came back E1 RED with exactly
  // **one** way face carrying a ring vertex inside the wet band (face 531 at 367.6, 635.0) while
  // planarity, coverage, containment and the wall arms were all clean. The pad answers for the
  // kerb's OFFSET; only the kerb's own chord answers for its EXTENT.
  const kl = Math.hypot(dir[0], dir[1]) || 1;
  const kn = [-dir[1] / kl, dir[0] / kl];
  const kh = Math.max(width, 2 / 1000) / 2;
  for (const s of [1, -1]) {
    const kerb = chordInFace(arr, fid, [at[0] + kn[0] * s * kh, at[1] + kn[1] * s * kh], dir);
    if (kerb && segTouchesWater(state, kerb[0], kerb[1], 0)) { state.waterRefusals++; return null; }
  }
  // ⭐⭐ **A1.3's GATE ECONOMY, ENFORCED AT CUT TIME.** *"Gates mint for major ways at the raise;
  // thereafter a way may NOT cross the band ungated — later ways dead-end at the band, divert to a
  // gate, or a recorded act mints a postern."* A chord that would cross a STANDING band is refused
  // here rather than cut and then convicted by the census; the refusal is counted so the number a
  // reader sees is the number of times the economy actually bound.
  if (chordCrossesStandingBand(state, chord)) { state.gateEconomyRefusals++; return null; }
  const res = cutWay(arr, fid, at, dir, width, { rank, key });
  if (!res) return null;
  stamp(state, `way.${res.way}`, state.wraps.length ? 'INFILL' : 'FOUNDING', ep,
    `the ${rank} laid as the gap between the pieces added at epoch ${state.epoch}`);
  state.wayIndex.push({ face: res.way, at: faceCentroid(arr, res.way), bearing: Math.atan2(dir[1], dir[0]) / DEG });
  return res;
}

/**
 * ⭐⭐⭐ §3b · ACCRETION, BY PLAN UNIT. The budget for the epoch is the ledger's own plot-set
 * delta scaled to the REPRESENTATIVE substrate (A1.1) — this module mints no sizing law of its
 * own, `tierScale` remains the sole sizer, and `bodyTarget` arrives from the caller who read it.
 */
function accrete(state, ep, want) {
  const { arr } = state;
  const before = state.plots;
  let budget = Math.max(0, want);
  let attempts = 0;
  while (budget > 0 && attempts < ACCRETION_HOST_CAP) {
    attempts++;
    const host = pickHost(state, ep);
    if (host < 0) break;
    const made = developGround(state, host, ep, budget, 1);
    if (made <= 0) { arr.faces[host].attrs = { ...arr.faces[host].attrs, exhausted: true }; continue; }
    budget -= made;
  }
  return state.plots - before;
}

/** How many open faces one epoch may take before it stops looking. A refusal, not a dial. */
export const ACCRETION_HOST_CAP = 64;

/**
 * ⭐ THE SEVEN TYPED REFUSAL COUNTERS THE FOLD ALREADY KEEPS, READ AS ONE TALLY so an epoch's
 * share of each can be taken as a DELTA rather than re-counted. Six are the counters `publish`
 * has always emitted; `geometric` is `arr.refusals`' length, which `publish` emits as an array.
 * ⚠ ONE HOME. A second spelling of this list is how a new counter gets published corpus-wide and
 * silently omitted from the per-epoch record.
 */
function refusalTally(state) {
  return {
    water: state.waterRefusals,
    gateEconomy: state.gateEconomyRefusals,
    sprawl: state.sprawlRefusals,
    emission: state.emissionRefusals,
    crossing: state.crossingRefusals,
    quay: state.quayRefusals,
    geometric: state.arr.refusals.length,
  };
}

const REFUSAL_KINDS = Object.freeze(['water', 'gateEconomy', 'sprawl', 'emission', 'crossing', 'quay', 'geometric']);

/**
 * ⭐⭐⭐ ⟦CAR-FOUND, ODQ §718.2⟧ **THE EPOCH RECORDS WHAT IT COULD NOT BUILD.**
 *
 * ⛔⛔ THE DEFECT, AND IT WAS ONE CHARACTER OF CODE. The fold computed a real
 * grow-until-you-cannot loop — `accrete` exits on quota-met, on `pickHost` returning −1, or on
 * `ACCRETION_HOST_CAP`, flagging barren hosts `exhausted` — and then threw the answer away with
 * `void budget;`. `publish` emitted six refusal counters **with no target and no remainder term
 * anywhere**, so *"epoch one hit deadlock with forty houses unbuilt"* was a fact the generator
 * knew and destroyed, and **a deadlocked epoch was indistinguishable in the artifact from an epoch
 * that had nothing to build.** The rolling-forward behaviour is GOOD and is untouched: the next
 * epoch's `budget = max(0, target − plots)` still re-asks for the shortfall. It was the SILENCE
 * that was the defect.
 *
 * ⭐⭐ **THIS IS A RECORD, NOT A MECHANISM, AND THE DISTINCTION IS THE CHAIR'S RULING (§718.2).**
 * The owner asked whether population should EMERGE from geometry. The chair ruled NO — a standing
 * rule forbids inventing a trajectory the record never had, and a geometry-driven population would
 * make a town rich for reasons that never entered its chronicle, with the dossier and the map
 * printing two different numbers from two authorities. **What makes such systems feel emergent is
 * not invented population; it is that REFUSALS ARE RECORDED.** So nothing here feeds back: not one
 * figure below is read by any act of the fold, no population is derived from any of it, and the
 * drawing at this lane's tip is byte-identical with and without this channel. It is a LEDGER.
 *
 * ⛔ AND IT INTRODUCES NO REJECTION LOOP. Every refusal in this constructor stays a LOCAL drop
 * with a published counter — never a whole-build restart — which is the right shape for something
 * that must produce a map deterministically inside a 2,500 ms budget.
 *
 * ⚠ `built` MAY BE NEGATIVE, deliberately: a FALLING epoch abandons pieces, and a record that
 * clamped that to zero would hide the one thing a decline epoch has to say.
 */
function recordDemand(state, ep, o) {
  const closeRefusals = refusalTally(state);
  /** @type {Record<string, number>} */ const refused = {};
  let refusedTotal = 0;
  for (const k of REFUSAL_KINDS) {
    const d = closeRefusals[k] - o.openRefusals[k];
    refused[k] = d;
    refusedTotal += d;
  }
  const built = state.plots - o.openPlots;
  const deficit = Math.max(0, o.remainder);
  state.demands.push(Object.freeze({
    epoch: state.epoch,
    year: ep.year,
    /** The REPRESENTATIVE body count this epoch's population implies (`epochTarget`). */
    target: o.target,
    /** What the partition already held when the epoch opened. */
    held: o.openPlots,
    /** ⭐ THE ASK: `max(0, target − held)`. Zero on an epoch that had nothing to build. */
    demand: o.demand,
    /** What the epoch actually put on the ground. Negative in a falling epoch. */
    built,
    /** ⭐⭐ THE DEFICIT: what it asked for and the ground refused. The number that was discarded. */
    deficit,
    /** ⭐ The share of its own ask the epoch met. `null` where it asked for nothing — an epoch
     *  with no demand is NOT a 100 % epoch, and recording it as one is the lie this record
     *  exists to prevent. */
    metShare: o.demand > 0 ? Math.round((1 - deficit / o.demand) * 1e6) / 1e6 : null,
    /** ⛔ THE ONE PREDICATE A READER SHOULD ASK: did this epoch ask for ground and not get it? */
    deadlocked: o.demand > 0 && deficit > 0,
    rising: !!o.rising,
    /** ⭐ THIS EPOCH'S OWN SHARE of each typed refusal, as a delta — the same six `publish` emits
     *  cumulatively, plus the geometric refusals, so a deficit can be READ against what refused. */
    refused: Object.freeze(refused),
    refusedTotal,
    reason: o.demand <= 0
      ? `epoch ${state.epoch} (year ${ep.year}) asked for no new ground — it holds ${o.openPlots}`
        + ` against a target of ${o.target}`
      : deficit > 0
        ? `epoch ${state.epoch} (year ${ep.year}) asked for ${o.demand} and the ground gave`
          + ` ${built}: ${deficit} unbuilt. ${refusedTotal} typed refusal(s) this epoch`
          + ` (${REFUSAL_KINDS.filter((k) => refused[k]).map((k) => `${k} ${refused[k]}`).join(', ') || 'none — the frontier simply ran out'})`
        : `epoch ${state.epoch} (year ${ep.year}) built all ${o.demand} it asked for`,
  }));
}

/** The REPRESENTATIVE body count this epoch's population implies. `tierScale` remains the sole
 *  sizer; `bodyTarget` is the count the caller read from it, and this only shares it out by year. */
function epochTarget(state, ep) {
  const led = state.input.ledger;
  const finalPop = Math.max(1, led.epochs[led.epochs.length - 1].population);
  return Math.round((state.input.bodyTarget || 0) * (ep.population / finalPop));
}

/**
 * The host for the next plan unit: the largest live FIELD face inside this epoch's built radius
 * that is not exhausted and not in the water. ⚠ ORDER IS BY (area desc, faceId asc) — a total,
 * data-only order, so the construction cannot depend on iteration order.
 */
function pickHost(state, ep) {
  const { arr, input } = state;
  const R = ep.builtRadius || input.extent.radius;
  const cx = input.extent.cx; const cy = input.extent.cy;
  let best = -1; let bestA = 0;
  for (const f of liveFaces(arr)) {
    if (f.cls !== 'FIELD') continue;
    if (f.attrs && f.attrs.exhausted) continue;
    // ⭐⭐ THE REACH TEST IS ON THE FACE'S **NEAREST POINT**, NOT ITS CENTROID, and the difference
    // is the whole of accretion. The first spelling tested the centroid: one way across the seeded
    // disc leaves two flanks whose centroids sit far outside a young epoch's built radius, so the
    // town found no host at all after its second plan unit and grew the other 1,073 bodies by
    // bisecting plots. A face is reachable when the settlement's ground TOUCHES it.
    if (nearestRingDistance(arr, f.id, cx, cy) > R) continue;
    const c = faceCentroid(arr, f.id);
    if (inWater(state, c[0], c[1])) continue;
    // ⛔ NO WAY MAY CROSS A STANDING BAND (A1.3's gate economy). A host inside the band's ground
    // is refused outright rather than cut and then repaired.
    if (f.attrs && f.attrs.inBand) continue;
    const a = faceArea(arr, f.id);
    if (a > bestA || (a === bestA && best >= 0 && f.id < best)) { bestA = a; best = f.id; }
  }
  return bestA > 0 ? best : -1;
}

/**
 * ⭐⭐⭐ **ONE PLAN UNIT** — R-MORPH's atomic street-block, and the piece-adding QUANTUM.
 * A unit draws its OWN bearing and its OWN frontage module; the plots inside it drift by a few
 * degrees and a third of a module. Two units never share a bearing, which is the property that
 * makes the fabric a quilt rather than a comb.
 *
 * ⭐⭐ **`noGap` IS §3d's OWN SENTENCE, NOT A DIAL** (GROW-A-RESUME). *"Growth is infill — plot
 * subdivision and court infill"*: subdividing an existing TENURE piece makes a party wall, never a
 * new lane through somebody's holding. The distinction was invisible while the gap cut refused on a
 * rounding coin-flip; the moment the refusal cure made those cuts land, the metropolis started
 * spending its densification budget cutting CARRIAGEWAYS inside single plots — ground that then
 * holds nobody — and its plot count fell away from the ledger's own target. Court infill on OPEN
 * intramural ground still lays gaps: a back-court lane is exactly what that act is for.
 *
 * @returns {number} plots added
 */
function developGround(state, host, ep, budget, floorScale, intramuralOnly, noGap) {
  const { arr } = state;
  if (budget <= 0) return 0;
  const area = faceArea(arr, host);
  if (!(area > 0)) return 0;
  const ward = wardDials(state, host);
  // ⭐⭐ **THE FLOOR IS THE BAND, AND THE BUDGET IS THE GROUND.** The stop threshold is spelled in
  // road-width² so the size band is manufactured (A2.1); the ledger's plot budget then decides how
  // much GROUND is developed, not how big a lot is.
  // ⛔ THE FIRST SPELLING DERIVED THE FLOOR FROM area÷budget AND IT WAS MEASURABLY WRONG: with the
  // whole extent as the host, the town's lots came out at ~330 u² against a reference band of
  // 69–118 u² — a threefold miss, and the page census would have been arguing with the mechanism
  // instead of checking it.
  const rw = state.input.roadWidth || 5;
  const aMin = LOT_FLOOR_RW2 * rw * rw * (floorScale || 1);
  const wantArea = budget * aMin * LOT_FLOOR_RATIO;
  const patch = area > wantArea * 1.6 ? carveDevelopmentPatch(state, host, wantArea) : host;
  if (patch < 0) return 0;
  const box = {
    made: 0, budget, aMin, gapBar: MASS_TARGET_RW2 * rw * rw * (floorScale || 1), ward, ep,
    intramuralOnly: !!intramuralOnly,
  };
  subdivide(state, patch, box, 0, !noGap, `d${state.develops++}`);
  return box.made;
}

/**
 * ⭐⭐ CARVE THE EPOCH'S DEVELOPMENT PATCH out of open ground: halve the host toward the frontier
 * until the piece is about the size the budget asks for. ⚠ THIS IS WHAT KEEPS GROWTH FROM BEING
 * LOPSIDED — a depth-first recursion over the whole extent would build one corner of the settlement
 * completely and leave the rest as field, because the budget cuts the recursion off mid-descent.
 */
function carveDevelopmentPatch(state, host, wantArea) {
  const { arr, input } = state;
  const seat = frontierSeat(state, host, input.roadWidth || 5, 0);
  let cur = host;
  for (let guard = 0; guard < 14; guard++) {
    if (faceArea(arr, cur) <= wantArea * 1.6) break;
    const e = longestRingEdge(faceRing(arr, cur));
    if (!e) break;
    const mid = [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2];
    const ex = e.b[0] - e.a[0]; const ey = e.b[1] - e.a[1];
    const L = Math.hypot(ex, ey) || 1;
    const res = cutFaceByLine(arr, cur, mid, [-ey / L, ex / L],
      { type: 'BOUND', key: `patch${state.develops}.${guard}` });
    if (!res) break;
    const keep = nearestFaceIn(state, res.faces, seat);
    if (keep < 0) break;
    cur = keep;
  }
  return arr.faces[cur] && arr.faces[cur].cls === 'FIELD' ? cur : -1;
}

/**
 * ⭐⭐⭐ **A2.1 · THE STOP-RULE GUILLOTINE.** One recursion makes the whole fabric: coarse cuts open
 * GAPS (typed `WAY` at lane rank — the way network is what the gaps are), fine cuts are GAPLESS
 * (typed party `BOUND`), and the recursion HALTS when a piece falls under a threshold drawn per
 * piece from the ward's floor scaled by `2^(4·chaosSize·(u−0.5))`.
 *
 * ⭐⭐ **SUBDIVISION AND AGGREGATION ARE ONE LAW, WRITTEN FROM OPPOSITE ENDS.** A1.2's stage-1
 * dissolve says *"generalize REG-1's fusion as a face-set DISSOLVE of interior party BOUND edges
 * along a run"*. Because the edge TYPE is minted at cut time, a party run is exactly the set of
 * faces a gapless sub-recursion produced — the view does not have to REDISCOVER runs, it reads the
 * cut record. `partitionView.js` consumes `arr.cutRuns`.
 *
 * ⚠ **THE ANGLE DEVIATION IS SUPPRESSED AT THE FINEST SCALE** and that one line carries most of the
 * gestalt: chaos belongs to the street pattern, never to the house rectangle. Under 4× the stop
 * area the cut is exactly perpendicular to the longest edge, so the lots the eye actually reads are
 * clean quads even in a chaotic ward. A2.2's guard measures precisely this — cut-angle variance BY
 * RECURSION DEPTH — and it is a decision statistic, never coordinate noise: no vertex is ever moved
 * after it is placed.
 */
function subdivide(state, fid, box, depth, allowGap, key) {
  const { arr, seed } = state;
  if (box.made >= box.budget || depth > SUBDIVIDE_DEPTH_CAP) { return; }
  const area = faceArea(arr, fid);
  const ward = box.ward;
  // THE HALT: a per-piece threshold, lognormal-ish about the ward's floor.
  const stopArea = box.aMin * Math.pow(2, 4 * ward.chaosSize * (keyedRandom(seed, key, 'stop', 0) - 0.5));
  if (area < stopArea) { emitLot(state, fid, box, key); return; }

  const ring = faceRing(arr, fid);
  const e = longestRingEdge(ring);
  if (!e) { emitLot(state, fid, box, key); return; }
  const tCut = 0.5 + (keyedRandom(seed, key, 'cut', 0) - 0.5) * 0.8 * ward.chaosGrid;
  const at = [e.a[0] + (e.b[0] - e.a[0]) * tCut, e.a[1] + (e.b[1] - e.a[1]) * tCut];
  // ⚠ SUPPRESSED under 4× the stop area — see the header.
  const phi = area < stopArea * 4 ? 0
    : (keyedRandom(seed, key, 'cut', 1) - 0.5) * (Math.PI / 6) * ward.chaosGrid;
  const ex = e.b[0] - e.a[0]; const ey = e.b[1] - e.a[1];
  const L = Math.hypot(ex, ey) || 1;
  const nx = -ey / L; const ny = ex / L;
  const dir = [nx * Math.cos(phi) - ny * Math.sin(phi), nx * Math.sin(phi) + ny * Math.cos(phi)];
  if (inWater(state, at[0], at[1])) { state.waterRefusals++; emitLot(state, fid, box, key); return; }

  let kids = null;
  // ⚠ A GAP IS ONLY ATTEMPTED WHEN THE PIECE CAN HOLD ONE. Asking for a carriageway inside a face
  // barely wider than the lane costs a refusal every time and always falls through to the gapless
  // cut anyway — 228 of them on the town leaf before this guard.
  if (allowGap && area > Math.pow(state.laneWidth * 4, 2)) {
    const cut = layWay(state, fid, at, dir, state.laneWidth, depth <= 1 ? 'street' : 'lane', key, box.ep);
    if (cut) {
      kids = cut.flanks;
      // ⭐⭐ A GAP **ENDS** A PARTY RUN AND STARTS A BLOCK. The two sides of an alley are different
      // built masses (so A1.2's stage-1 dissolve stops at the gap) and each side is a new BLOCK —
      // the ground between ways, which is what stage-2 chunking is allowed to group runs within.
      for (const k of kids) {
        arr.faces[k].attrs = { ...arr.faces[k].attrs, run: null, block: `b${state.blocks++}` };
      }
    }
  }
  if (!kids) {
    const res = cutFaceByLine(arr, fid, at, dir, { type: 'BOUND', key: `${key}.b` });
    if (!res) { emitLot(state, fid, box, key); return; }
    kids = res.faces;
    // ⭐ THE PARTY RUN, RECORDED AT THE CUT. Both children belong to the run their parent belongs
    // to; a fresh run id is minted when the parent had none.
    const run = arr.faces[fid].attrs.run || `r${state.runs++}`;
    for (const k of kids) arr.faces[k].attrs = { ...arr.faces[k].attrs, run };
  }
  for (const [i, k] of kids.entries()) {
    if (box.made >= box.budget) break;
    // ⭐⭐ GAPS ONLY ABOVE THE MASS TARGET. Below it the cuts go gapless and the piece becomes ONE
    // party run — so this line is what puts the page mass inside A1.2's band.
    const bar = box.gapBar * Math.pow(2, 2 * ward.chaosSize * (keyedRandom(seed, `${key}.${i}`, 'gapbar', 0) - 0.5));
    const childGap = faceArea(arr, k) > bar;
    subdivide(state, k, box, depth + 1, childGap, `${key}.${i}`);
  }
}

/** The recursion's leaf: a tenure piece, or — at the ward's emptiness rate — a VOID. */
function emitLot(state, fid, box, key) {
  const { arr, seed } = state;
  if (arr.faces[fid].cls !== 'FIELD' && arr.faces[fid].cls !== 'BLOCK') return;
  // ⛔⛔ **§3d's LAW, ENFORCED AT THE LEAF: UNDER A STANDING WRAP, INFILL STAYS INSIDE IT.**
  // *"growth is infill … then TYPED extramural emission ONLY"* — never untyped sprawl. A large open
  // face whose CENTROID is intramural can still reach past the band, and the recursion would then
  // put lots outside a standing circuit with no act behind them. Measured before this guard: 19, 2,
  // 4 and 10 untyped extramural lots on the town, city, metropolis and year-100 leaves — which is
  // exactly REG-4's `sprawl` predicate, non-zero.
  if (box.intramuralOnly) {
    const c = faceCentroid(arr, fid);
    const wrap = state.wraps[state.wraps.length - 1];
    if (wrap && !inRing(wrap.outer, c)) { state.sprawlRefusals++; return; }
  }
  if (keyedRandom(seed, key, 'empty', 0) < box.ward.emptiness) {
    arr.faces[fid].cls = 'VOID';
    arr.faces[fid].attrs = { ...arr.faces[fid].attrs, voidKind: 'court' };
    stamp(state, `void.${fid}`, state.wraps.length ? 'INFILL' : 'FOUNDING', box.ep,
      `a courtyard left unbuilt at the ward's emptiness rate`);
    return;
  }
  // ⭐⭐ EVERY LEAF BELONGS TO A RUN — a lot with no party neighbour is a run of ONE. Leaving
  // singletons out of the record makes the run census read 1 on a town of a thousand lots and
  // gives A1.2's dissolve nothing to consume for most of the page.
  const run = arr.faces[fid].attrs.run || `r${state.runs++}`;
  const block = arr.faces[fid].attrs.block || `b${state.blocks++}`;
  arr.faces[fid].attrs = { ...arr.faces[fid].attrs, run, block };
  let blockPiece = state.blockOfRun.get(block);
  if (blockPiece === undefined) {
    blockPiece = mintPiece(arr, 'BLOCK', -1, state.rootWard, { block });
    state.blockOfRun.set(block, blockPiece);
  }
  // ⭐⭐⭐ **THE FACE'S PREVIOUS TENURE IS RETIRED HERE, AT THE ONE POINT A FACE BECOMES A PLOT
  // UNDER A NEW PIECE (GFOLD, §684.3).** Infill de-classes a standing plot to FIELD so the
  // recursion can re-cut it, and reclamation hands a ruin back as FIELD; when the recursion then
  // emits a lot on that ground the face gets a NEW piece, and its old `plot.<piece>` key is left
  // asserting that a piece which owns no drawing is a plot with a founding beat.
  // ⛔⛔ THE CENSUS CANNOT SEE THIS: `walkTotality` walks the DRAWN roster and never asks whether an
  // annotation still has a drawing behind it, so a stray is neither an orphan nor an `unknown`.
  // MEASURED over the 18-leaf corpus at the GROW-A seal: **14,136 stray annotations, 13,240 of them
  // on the metropolis alone** — its published annotation map was 16,586 entries for a 2,633-plot
  // settlement. The retirement is placed HERE rather than at the two callers because this is the
  // chokepoint every re-development flows through; a per-caller fix is the shape that leaves the
  // third caller broken.
  const prior = arr.faces[fid].piece;
  if (prior >= 0) delete state.annotations[`plot.${prior}`];
  const pid = mintPiece(arr, 'PLOT', fid, blockPiece, { run, block });
  arr.faces[fid].cls = 'PLOT';
  state.plots++;
  box.made++;
  stamp(state, `plot.${pid}`, state.wraps.length ? 'INFILL' : 'FOUNDING', box.ep,
    `epoch ${state.epoch} subdivision, stop-rule leaf`);
}

/** The longest edge of a ring — the guillotine's own axis. */
function longestRingEdge(ring) {
  let best = null; let bl = -1;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L > bl) { bl = L; best = { a, b, length: L }; }
  }
  return best;
}

/**
 * ⭐⭐ THE WARD'S FOUR DIALS — A2.1's dress-parameter tuple, sourced from what SPINE-1 actually
 * holds. ⚠ WARD **KIND** IS NOT A SPINE-1 INPUT: A1.5 keeps institution seating its own car, so the
 * kind-by-kind table (craftsmen · merchant · patriciate · slum · administration · military) is
 * NOT minted here. What is minted is the morphology-sourced base, with the u²-skewed draw that
 * gives in-band variety. The kind table is CAR-SEATING's to add on top.
 */
function wardDials(state, fid) {
  const { seed, input } = state;
  const key = `ward.${arr_faceWard(state, fid)}`;
  const u = keyedRandom(seed, key, 'ward', 0);
  const base = input.planMode === 'PLANTED_GRID' ? 0.12
    : (input.planMode === 'COMPOSITE' ? 0.34 : 0.58);
  return {
    chaosGrid: base + 0.3 * u * u,
    chaosSize: 0.3 + 0.5 * keyedRandom(seed, key, 'ward', 1),
    // ⚠ 3–15 %, not the reference's 3–25 %: our leaves are TENURE pieces with a lifecycle, and an
    // emptiness that high turned a third of the metropolis into courtyards (1,164 of 3,348).
    emptiness: 0.03 + 0.12 * keyedRandom(seed, key, 'ward', 2),
  };
}

/** Which ward a face belongs to — the root until quarters are minted. */
function arr_faceWard(state, fid) {
  const p = state.arr.faces[fid].piece;
  return p >= 0 ? p : state.rootWard;
}

/**
 * The bearing of the nearest way to a point, in degrees, or null — the T-junction bias's input.
 * ⚠ READ FROM THE INDEX THE CUT ITSELF WROTE. Re-deriving a way's bearing from its face ring is
 * both slower and less true: the ring is the CARRIAGEWAY, whose longest edge after later cuts need
 * not be the way's own axis.
 */
function nearestWayBearing(state, p) {
  let best = null; let bd = Infinity;
  for (const w of state.wayIndex) {
    const d = Math.hypot(w.at[0] - p[0], w.at[1] - p[1]);
    if (d < bd) { bd = d; best = w.bearing; }
  }
  return best;
}

/**
 * The distance from (cx,cy) to the nearest point of a face's boundary — **segments, not vertices.**
 * ⛔⛔ THE VERTEX-ONLY SPELLING WAS A SILENT ZERO. A founding way cut clean across the seeded disc
 * leaves two flanks whose only vertices are on the RIM: the kerb runs rim to rim and passes through
 * the settlement centre, but no vertex is near it. The village leaf therefore reported every open
 * face as out of reach of an 88-unit built radius and drew **zero plots with zero refusals** — the
 * worst shape of failure, because nothing at all complains.
 */
function nearestRingDistance(arr, fid, cx, cy) {
  const ring = faceRing(arr, fid);
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const ex = b[0] - a[0]; const ey = b[1] - a[1];
    const L2 = ex * ex + ey * ey;
    let s = L2 > 0 ? ((cx - a[0]) * ex + (cy - a[1]) * ey) / L2 : 0;
    s = s < 0 ? 0 : (s > 1 ? 1 : s);
    const d = Math.hypot(cx - (a[0] + ex * s), cy - (a[1] + ey * s));
    if (d < best) best = d;
  }
  return best;
}

/** Where a plan unit sits inside its host: the ring point nearest the core, pulled inward. */
function frontierSeat(state, fid, rw, minPull) {
  const { arr, input } = state;
  const cx = input.extent.cx; const cy = input.extent.cy;
  const ring = faceRing(arr, fid);
  let seat = ring[0]; let bd = Infinity;
  for (const p of ring) {
    const d = Math.hypot(p[0] - cx, p[1] - cy);
    if (d < bd) { bd = d; seat = p; }
  }
  const cc = faceCentroid(arr, fid);
  const dx = cc[0] - seat[0]; const dy = cc[1] - seat[1];
  const L = Math.hypot(dx, dy) || 1;
  const pull = Math.min(L * 0.6, Math.max(rw * 2.4, minPull || 0));
  return [seat[0] + (dx / L) * pull, seat[1] + (dy / L) * pull];
}

/** The face in `list` whose centroid is nearest `p`, or -1. */
function nearestFaceIn(state, list, p) {
  const { arr } = state;
  let best = -1; let bd = Infinity;
  for (const f of list) {
    if (!arr.faces[f] || !arr.faces[f].alive) continue;
    const c = faceCentroid(arr, f);
    const d = Math.hypot(c[0] - p[0], c[1] - p[1]);
    if (d < bd) { bd = d; best = f; }
  }
  return best;
}

/**
 * ⭐⭐⭐ §3c · **THE WALL EVENT**, under A1.3. The wrap's trace is derived from the PIECE ENCLOSURE
 * and then **RESAMPLED TO THE FORM'S FACET ECONOMY**; the band is a THIN FACE; gates mint for major
 * ways at the raise and the gate economy binds every later way.
 *
 * ⚠ THE TRACE IS A NEW EDGE CYCLE, NOT A WALK ALONG PIECE EDGES, AND THE PANEL MEASURED WHY. A
 * trace literally following the boundaries of a 1,016–2,290-parcel town carries hundreds-to-
 * thousands of fabric-determined vertices; the reference's own main circuits carry 25 and 37, ours
 * 43–120, and REG-2's tower rhythm keys on the ring's own p75 turn quantile. Inserting the ring
 * makes it coincident with face boundaries — §1's *"a WALL edge coincides with face boundaries
 * only"* becomes true because inserting the ring CREATES those boundaries.
 */
function raiseWrap(state, ep, ce) {
  const { arr, input } = state;
  const form = input.wallForm || { facets: 26, width: (input.roadWidth || 5) * 0.42 };
  // (1) THE PIECE ENCLOSURE — the hull of the built pieces' own vertices, which is what makes the
  //     chord across a bay lawful: circuit economy is a property of the enclosure, not of a face.
  const pts = [];
  for (const f of liveFaces(arr)) {
    // ⚠ **PIECES ONLY, NEVER WAYS.** §3c says the wrap encloses the BUILT faces; a way face is a
    // gap, and including one puts the enclosure wherever that gap happens to reach.
    if (f.cls !== 'PLOT' && f.cls !== 'VOID' && f.cls !== 'BLOCK') continue;
    const c = faceCentroid(arr, f.id);
    if (Math.hypot(c[0] - input.extent.cx, c[1] - input.extent.cy) > ce.frozenRadius) continue;
    for (const p of faceRing(arr, f.id)) pts.push(p);
  }
  if (pts.length < 8) return;
  const hull = convexHull(pts);
  if (!hull || hull.length < 4) return;
  // (2) FACET-RESAMPLE to the form's economy, then hold the trace INSIDE the seeded extent.
  // ⚠ A wrap point outside the extent has no face to be inserted into and the whole ring is lost —
  // the clamp is COUNTED so a reader can tell a wrap that fitted from one that was held.
  const rim = input.extent.radius * 0.9;
  let clamped = 0;
  const hold = (ring) => ring.map(([x, y]) => {
    const dx = x - input.extent.cx; const dy = y - input.extent.cy;
    const L = Math.hypot(dx, dy);
    if (L <= rim) return [x, y];
    clamped++;
    return [input.extent.cx + (dx / L) * rim, input.extent.cy + (dy / L) * rim];
  });
  const outer = hold(facetRing(hull, form.facets));
  const inner = hold(facetRing(shrinkRing(outer, form.width, input.extent), form.facets));
  const idx = state.wraps.length;
  const oIns = insertRing(arr, outer, { type: 'WALL', key: `wrap.E${idx}.out`, attrs: { wrap: idx, side: 'outer' } });
  const iIns = insertRing(arr, inner, { type: 'WALL', key: `wrap.E${idx}.in`, attrs: { wrap: idx, side: 'inner' } });
  // (3) THE BAND IS A THIN FACE (A1.3): every face between the two rings becomes WALLBAND ground,
  //     except a MAJOR way's carriageway, which becomes a GATE.
  const band = [];
  const gates = [];
  const waterGates = [];
  for (const f of liveFaces(arr)) {
    const c = faceCentroid(arr, f.id);
    if (!inRing(outer, c) || inRing(inner, c)) continue;
    // ⛔⛔ **A1.3's S2-M1 · THE WALL TERMINATES AT THE BANK; IT DOES NOT CROSS THE WATER.**
    // *"WALL×WATER gains its invariant + law: a wall face terminates at a bank with a WATER GATE or
    // TERMINUS WORK … the half-ring is a lawful wall face whose fourth side IS the bank."*
    // ⚠ MEASURED BEFORE THIS GUARD, AND IT IS WHY THE GUARD EXISTS: the band loop took EVERY face
    // in the annulus, so the stretch of river inside the band became WALLBAND ground — a wall built
    // across a river. `censusWater`'s bank-separates arm convicted it as 32 bank edges with dry
    // ground on both sides on the `crossing` leaf, and the water body lost 819 u² of its area
    // between the raise and the fold's end. The water face is LEFT AS WATER and carries the gate.
    if (f.cls === 'WATER') {
      f.attrs = { ...f.attrs, waterGate: true, wrap: idx };
      waterGates.push(f.id);
      stamp(state, `water.${f.id}`, 'CIRCUIT_RAISED', ep,
        `the wrap of year ${ce.year} reached the water here — a WATER GATE, because a wall`
        + ' terminates at its bank (A1.3 S2-M1) and does not dam the channel');
      continue;
    }
    if (f.cls === 'WAY' && (f.attrs.rank === 'artery' || f.attrs.rank === 'street')) {
      f.attrs = { ...f.attrs, gate: true, wrap: idx };
      gates.push(f.id);
      stamp(state, `gate.${f.id}`, 'CIRCUIT_RAISED', ep,
        `a ${f.attrs.rank} crossed the wrap at its raise in year ${ce.year}`);
      continue;
    }
    // ⚠ A MINOR WAY IS **SEVERED**, NOT GATED — A1.3's gate economy: gates are few and expensive.
    const wasWay = f.cls === 'WAY';
    // ⭐⭐⭐ **WHAT THE BAND SWALLOWS STOPS BEING COUNTED, AND ITS OLD KEY STOPS BEING TRUE (GFOLD,
    // §684.3).** The ring is inserted through whatever it crosses, so a PLOT inside the annulus
    // becomes WALLBAND ground. Two bookkeeping halves were missing and the raise moving ahead of
    // the epoch's growth is what surfaced them, because the band now closes around the settlement's
    // OLDEST pieces instead of around a frontier that epoch had just built:
    //   (1) `state.plots` was never decremented, so the published count drifted ABOVE the live PLOT
    //       faces — MEASURED at the seal as +205 over the corpus, on 13 of 13 walled leaves and on
    //       NONE of the 5 unwalled ones, which is how the cause was identified.
    //   (2) the face kept its `plot.<piece>` annotation — a sentence asserting that a piece which
    //       is now wall is a plot with a founding beat. ⛔ AND IT IS INVISIBLE TO THE CENSUS:
    //       `walkTotality` walks the DRAWN roster and never asks whether an annotation still has a
    //       drawing behind it, so a stray is never an orphan and never an `unknown`. The only
    //       instrument in the estate that can trip over one is E9's plant, and it did.
    // The line below already said the law — *"a re-classed face owes a FRESH annotation; its old key
    // names a class it no longer is"* — and stamped the fresh key without retiring the stale one.
    if (f.cls === 'PLOT') { state.plots--; delete state.annotations[`plot.${f.piece}`]; }
    else if (f.cls === 'VOID') delete state.annotations[`void.${f.id}`];
    else if (wasWay) delete state.annotations[`way.${f.id}`];
    f.cls = 'WALLBAND';
    f.attrs = { ...f.attrs, wrap: idx, inBand: true, severed: wasWay };
    band.push(f.id);
    // ⚠ A RE-CLASSED FACE OWES A **FRESH** ANNOTATION. Its old key names a class it no longer is,
    // so the A6.1 walker would count it as an orphan — 41 of them on the town leaf before this.
    stamp(state, `wallband.${f.id}`, 'CIRCUIT_RAISED', ep,
      wasWay ? `a minor way severed at the raise of year ${ce.year} — the gate economy is few and`
        + ' expensive' : `the band's own ground, reserved at the raise of year ${ce.year}`);
  }
  // ⛔ §202's NO-OPENING FLOOR: a circuit with no opening is not a circuit. If the economy left
  //    none, the widest crossing way is forced open — recorded, never silent.
  let forced = null;
  if (!gates.length && band.length) {
    let widest = -1; let wa = 0;
    for (const fid of band) {
      const a = faceArea(arr, fid);
      if (a > wa) { wa = a; widest = fid; }
    }
    if (widest >= 0) {
      arr.faces[widest].cls = 'WAY';
      arr.faces[widest].attrs = { ...arr.faces[widest].attrs, gate: true, forced: true, rank: 'street' };
      gates.push(widest);
      forced = widest;
      stamp(state, `gate.${widest}`, 'CIRCUIT_RAISED', ep, '§202: a circuit with no opening is not a circuit');
    }
  }
  // ⭐⭐⭐ **A2.3 · DERIVED-WRAP GATE MINTING — THE §3c HISTORY-SILENT CASE, AND ONLY THAT CASE.**
  // A2.3's last sentence is the whole rule: *"Recorded history always wins where it speaks."* So
  // this runs only where the circuit event's own provenance says the record did NOT name the raise;
  // where it did, the gates above are the history's and nothing here touches them.
  const derived = ce.provenance !== 'recorded'
    ? mintDerivedGates(state, ep, ce, { idx, outer, inner, band, gates })
    : { candidates: 0, chosen: 0, suppressed: 0, roadsplit: 0, unreachable: 0, provenance: 'recorded' };

  const wrap = Object.freeze({
    index: idx,
    a23: Object.freeze(derived),
    epoch: state.epoch,
    /** ⛔ THE YEAR IS REQUIRED BY THE SCHEMA — A1.3's vintage honesty. A wrap with no year cannot
     *  be minted here, which is the §11.11 stamp defect excluded structurally. */
    year: ce.year,
    provenance: ce.provenance,
    frozenRadius: ce.frozenRadius,
    facets: form.facets,
    bandWidth: form.width,
    outer: Object.freeze(outer.map((p) => Object.freeze(p.slice()))),
    inner: Object.freeze(inner.map((p) => Object.freeze(p.slice()))),
    gates: Object.freeze(gates.slice()),
    /** ⭐ A1.3 S2-M1's own class, published so a reader can tell a circuit that MET water from one
     *  that never did — and so the dress car has the roster hf313's water gate needs. */
    waterGates: Object.freeze(waterGates.slice()),
    bandFaces: Object.freeze(band.slice()),
    forcedGate: forced,
    clampedFacets: clamped,
    insertion: Object.freeze({
      outerSegments: oIns.segments, outerRetyped: oIns.retyped, outerRefused: oIns.refused,
      innerSegments: iIns.segments, innerRetyped: iIns.retyped, innerRefused: iIns.refused,
    }),
    reason: `the circuit recorded at year ${ce.year} (${ce.provenance}), traced from the piece`
      + ` enclosure at frozen radius ${ce.frozenRadius.toFixed(3)} and resampled to the form's`
      + ` ${form.facets}-facet economy; ${gates.length} gate(s) minted for major ways at the raise`,
  });
  state.wraps.push(wrap);
  state.gates.push(...gates);
  stamp(state, `wall.E${idx}`, 'CIRCUIT_RAISED', ep, `wall-built-year (${ce.provenance})`);
}

/**
 * ⭐⭐ **A2.3's GATE SPACING, IN RING ARC-LENGTH.** A gate every `GATE_SPACING_FACETS` facets of the
 * wrap's own economy. It is spelled in FACETS rather than in units because the facet economy is
 * already the form's own scale (A1.3: *"the turn distribution is a property of the FORM"*), so a
 * 26-facet citywall and a 30-facet palisade space their gates by the same rule at their own sizes.
 * ⚠ PROPOSED; rides the tuning signature.
 */
export const GATE_SPACING_FACETS = 5;

/**
 * ⭐⭐⭐ **A2.3 · THE THREE RULES SPINE-1 DEFERRED, BUILT.** Verbatim: *"Gate candidates = wrap
 * vertices where ≥2 interior pieces meet; spacing by cycle decimation (choose one, suppress
 * neighbours); every gate carries a GATE-ROAD GUARANTEE (split the outer piece if no outgoing
 * corridor exists); street-reachability is a rejection gate."*
 *
 * Each of the three is a separate loop below and each publishes its own count, because a
 * decimation that suppressed everything and a reachability test that rejected everything both
 * produce the same zero as a wrap that simply had no candidates.
 */
function mintDerivedGates(state, ep, ce, w) {
  const { arr } = state;
  const out = {
    candidates: 0, chosen: 0, suppressed: 0, roadsplit: 0, unreachable: 0, wet: 0,
    provenance: ce.provenance,
  };
  // ── (1) CANDIDATES · a band face where ≥ 2 interior PIECES meet its inner side ───────────────
  const cands = [];
  for (const fid of w.band) {
    const f = arr.faces[fid];
    if (!f || !f.alive || f.cls !== 'WALLBAND') continue;
    let pieces = 0;
    let outerWay = false;
    let h = f.he; const start = h; let guard = 0;
    do {
      const he = arr.halfEdges[h];
      const nb = arr.faces[arr.halfEdges[he.twin].face];
      if (nb && nb.alive) {
        const c = faceCentroid(arr, nb.id);
        const isIn = inRing(w.inner, c);
        if (isIn && (nb.cls === 'PLOT' || nb.cls === 'VOID' || nb.cls === 'BLOCK')) pieces++;
        if (!isIn && nb.cls === 'WAY') outerWay = true;
      }
      h = he.next;
      if (++guard > 100000) break;
    } while (h !== start);
    if (pieces >= 2) {
      // ⛔⛔ **A DERIVED GATE IS A WAY, SO §1's "NO WAY EDGE SPANS WATER" BINDS IT — AND IT DID NOT
      // (GROW-A-RESUME).** `mintDerivedGates` re-classes BAND ground to `WAY`, a path `layWay` never
      // touches, so the watercourse refusal that guards every other way had no say here. A1.3's
      // S2-M1 already gives the wall's meeting with water its own class — a WATER GATE on the water
      // face — so a derived STREET gate on wet band ground is a second, unlawful spelling of it.
      // ⚠ MEASURED: `year-018` E1 RED on exactly one face — 531, `derivedGate: true`, a ring vertex
      // 7.94 units from a channel centreline of half-width 8.356 — with planarity, coverage,
      // containment, no-vertex-on-edge and both wall arms clean. The test is on the face's RING,
      // which is the geometry the census reads.
      if (faceRing(arr, fid).some((p) => inWater(state, p[0], p[1]))) { out.wet++; continue; }
      cands.push({ fid, pieces, outerWay, at: faceCentroid(arr, fid) });
    }
  }
  out.candidates = cands.length;
  if (!cands.length) return out;

  // ── (2) CYCLE DECIMATION · choose one, suppress its neighbours ───────────────────────────────
  // ⚠ THE CYCLE IS THE WRAP'S OWN RING, so candidates are ordered by ANGLE about the extent centre
  //   rather than by face id — a decimation over insertion order would space gates by the order the
  //   constructor happened to cut faces, which is not a cycle at all.
  const cx = state.input.extent.cx; const cy = state.input.extent.cy;
  cands.sort((a, b) => Math.atan2(a.at[1] - cy, a.at[0] - cx) - Math.atan2(b.at[1] - cy, b.at[0] - cx));
  const arc = (2 * Math.PI) / Math.max(1, w.outer.length);
  const minSep = arc * GATE_SPACING_FACETS;
  const chosen = [];
  let lastAng = -Infinity;
  for (const c of cands) {
    const ang = Math.atan2(c.at[1] - cy, c.at[0] - cx) + Math.PI;
    if (ang - lastAng < minSep) { out.suppressed++; continue; }
    // ── (3) STREET-REACHABILITY · a rejection gate, and it is a REJECTION and not a preference ──
    // A gate that opens onto ground no way reaches is a hole in a wall. The test is structural: is
    // any WAY face reachable from the candidate's inner side without leaving the wrap?
    if (!reachesStreet(state, c.fid, w.inner)) { out.unreachable++; continue; }
    lastAng = ang;
    chosen.push(c);
  }

  for (const c of chosen) {
    const f = arr.faces[c.fid];
    if (!f || !f.alive || f.cls !== 'WALLBAND') continue;
    f.cls = 'WAY';
    f.attrs = { ...f.attrs, gate: true, wrap: w.idx, rank: 'street', derivedGate: true, inBand: true };
    w.gates.push(c.fid);
    state.gates.push(c.fid);
    out.chosen++;
    stamp(state, `gate.${c.fid}`, 'CIRCUIT_RAISED', ep,
      `A2.3 derived-wrap gate: ${c.pieces} interior pieces meet the band here and the raise of year`
      + ` ${ce.year} carries no recorded gate — chosen by cycle decimation at ${GATE_SPACING_FACETS}`
      + ' facets, and the street-reachability test passed');
    // ── (4) THE GATE-ROAD GUARANTEE · split the outer piece when no corridor leaves ─────────────
    if (!c.outerWay) {
      const dx = c.at[0] - cx; const dy = c.at[1] - cy;
      const L = Math.hypot(dx, dy) || 1;
      const beyond = [c.at[0] + (dx / L) * (state.input.roadWidth || 5) * 2.5,
        c.at[1] + (dy / L) * (state.input.roadWidth || 5) * 2.5];
      const host = locateFace(arr, beyond[0], beyond[1]);
      if (host >= 0 && (arr.faces[host].cls === 'FIELD' || arr.faces[host].cls === 'PLOT')) {
        const was = arr.faces[host].cls;
        if (was === 'PLOT') arr.faces[host].cls = 'FIELD';
        const road = layWay(state, host, beyond, [dx / L, dy / L],
          (state.input.roadWidth || 5) * RANK_WIDTH.street, 'street', `gateroad.${c.fid}`, ep);
        if (road) out.roadsplit++;
        else if (was === 'PLOT') arr.faces[host].cls = was;
      }
    }
  }
  return out;
}

/** Is any WAY face reachable from this band face's INNER side? A2.3's rejection gate. */
function reachesStreet(state, fid, innerRing) {
  const { arr } = state;
  const seen = new Set([fid]);
  const queue = [fid];
  let guard = 0;
  while (queue.length && guard++ < 400) {
    const cur = queue.shift();
    let h = arr.faces[cur].he; const start = h; let g2 = 0;
    do {
      const he = arr.halfEdges[h];
      const nb = arr.faces[arr.halfEdges[he.twin].face];
      if (nb && nb.alive && nb.cls !== 'OUTER' && !seen.has(nb.id)) {
        const c = faceCentroid(arr, nb.id);
        if (inRing(innerRing, c)) {
          if (nb.cls === 'WAY') return true;
          seen.add(nb.id);
          queue.push(nb.id);
        }
      }
      h = he.next;
      if (++g2 > 100000) break;
    } while (h !== start);
  }
  return false;
}

/**
 * ⭐⭐ **THE GATE ECONOMY'S CLOSING SWEEP.** Every way face that ends up in a standing band's own
 * annulus is either a GATE or it is not a way at all. The raise handles the ways that existed when
 * it happened and `layWay` refuses new ones — but a way face can also arrive in the annulus by
 * being SPLIT by a later wrap's insertion, which is neither of those paths. One sweep at the end of
 * the fold closes the class, and it is a construction act with its own stamp rather than a census
 * exemption. ⚠ MEASURED: one such face on the metropolis leaf, and it was the last ungated crossing.
 */
function sweepGateEconomy(state) {
  const { arr } = state;
  if (!state.wraps.length) return;
  for (const f of liveFaces(arr)) {
    if (f.cls !== 'WAY' || (f.attrs && f.attrs.gate)) continue;
    const c = faceCentroid(arr, f.id);
    const w = state.wraps.find((x) => inRing(x.outer, c) && !inRing(x.inner, c));
    if (!w) continue;
    const rank = (f.attrs && f.attrs.rank) || 'lane';
    if (rank === 'artery' || rank === 'street') {
      f.attrs = { ...f.attrs, gate: true, wrap: w.index, sweptOpen: true };
      state.gates.push(f.id);
      stamp(state, `gate.${f.id}`, 'CIRCUIT_RAISED', null,
        `a ${rank} found crossing the band of year ${w.year} after the raise — gated by the sweep`);
    } else {
      f.cls = 'WALLBAND';
      f.attrs = { ...f.attrs, wrap: w.index, inBand: true, severed: true };
      stamp(state, `wallband.${f.id}`, 'CIRCUIT_RAISED', null,
        `a ${rank} severed at the band of year ${w.year} — the gate economy is few and expensive`);
    }
  }
}

/** Shrink a ring toward the extent centre by `d` world units — the band's inner edge. */
function shrinkRing(ring, d, extent) {
  return ring.map(([x, y]) => {
    const dx = x - extent.cx; const dy = y - extent.cy;
    const L = Math.hypot(dx, dy) || 1;
    const s = Math.max(0.02, (L - d) / L);
    return [extent.cx + dx * s, extent.cy + dy * s];
  });
}

/** Would this chord cross a standing wrap's band ground? Sampled at the band's own width. */
function chordCrossesStandingBand(state, chord) {
  if (!state.wraps.length) return false;
  const L = Math.hypot(chord[1][0] - chord[0][0], chord[1][1] - chord[0][1]);
  const n = Math.max(2, Math.ceil(L / 1.0));
  for (const w of state.wraps) {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const p = [chord[0][0] + (chord[1][0] - chord[0][0]) * t,
        chord[0][1] + (chord[1][1] - chord[0][1]) * t];
      if (inRing(w.outer, p) && !inRing(w.inner, p)) return true;
    }
  }
  return false;
}

/** Even-odd point-in-ring in world units. */
function inRing(ring, p) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
    if ((yi > p[1]) !== (yj > p[1])
      && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * ⭐⭐ §3d · UNDER A STANDING WRAP the growth is INFILL — plot subdivision and court infill inside
 * the standing ring, before any soul settles outside it.
 */
function infill(state, ep, want) {
  const { arr, input } = state;
  const wrap = state.wraps[state.wraps.length - 1];
  const before = state.plots;
  if (want <= 0) return 0;
  // ⭐⭐ §3d's ORDER, AND IT IS NOT ARBITRARY: **court infill first, plot subdivision after.** Open
  // intramural ground takes the same stop-rule recursion at a FINER floor — which is where an old
  // town's back-court lanes come from — and only when the wrap holds no open ground does growth
  // start dividing tenure.
  const open = liveFaces(arr)
    .filter((f) => f.cls === 'FIELD' && !(f.attrs && f.attrs.inBand)
      && inRing(wrap.inner, faceCentroid(arr, f.id)))
    .sort((a, b) => faceArea(arr, b.id) - faceArea(arr, a.id) || a.id - b.id);
  for (const f of open) {
    if (state.plots - before >= want) break;
    const c0 = faceCentroid(arr, f.id);
    if (inWater(state, c0[0], c0[1])) { state.waterRefusals++; continue; }
    developGround(state, f.id, ep, want - (state.plots - before), 1, true);
  }
  // Then tenure subdivision, largest plots first — the same recursion at a finer floor.
  const hosts = liveFaces(arr)
    .filter((f) => f.cls === 'PLOT' && inRing(wrap.inner, faceCentroid(arr, f.id)))
    .sort((a, b) => faceArea(arr, b.id) - faceArea(arr, a.id) || a.id - b.id);
  for (const f of hosts) {
    if (state.plots - before >= want) break;
    const c = faceCentroid(arr, f.id);
    if (inWater(state, c[0], c[1])) { state.waterRefusals++; continue; }
    // ⚠ THE SAME RECURSION, AT A DENSIFIED FLOOR — never an ad-hoc threshold. The first spelling
    // used `area ÷ 3` here, which is not a floor at all: it makes lots relative to whatever it was
    // handed, and on the town leaf (where most epochs are under a standing wrap) it drove the
    // median plot to 0.73 rw² against a 3.6 rw² floor the census would then have argued with.
    //
    // ⛔⛔ **AND THE DE-CLASS MUST BE UNDONE WHEN THE DENSIFICATION YIELDS NOTHING —
    // GROW-A-RESUME.** Densification opens a standing plot back into FIELD so the recursion can
    // re-cut it. When the recursion then emits nothing — most often because `emitLot`'s draw came in
    // under the ward's EMPTINESS rate and made a courtyard instead — the plot is simply GONE; and
    // because the loop's progress test (`state.plots - before >= want`) is a NET count, a
    // break-even host never advances it, so the loop grinds through the ENTIRE intramural plot
    // roster and applies a 3–15 % destruction rate to every plot, EVERY EPOCH. ⚠ MEASURED the
    // moment the refusal cure below made gap cuts start succeeding (so each host yielded one lot
    // instead of several): the metropolis's courtyards went **178 → 624** and its plots
    // **2,669 → 174** — the partition SHRANK for twenty straight epochs while the ledger's
    // population tripled. **A host that cannot be densified keeps its tenure** — that is what
    // infill means — and the courtyard's stray annotation goes back with it.
    const wasAttrs = arr.faces[f.id].attrs;
    arr.faces[f.id].cls = 'FIELD';
    state.plots--;
    const made = developGround(state, f.id, ep, Math.min(4, want - (state.plots - before)),
      INFILL_FLOOR_SCALE, true, true);
    if (made <= 0) {
      arr.faces[f.id].cls = 'PLOT';
      arr.faces[f.id].attrs = wasAttrs;
      delete state.annotations[`void.${f.id}`];
      state.plots++;
    }
  }
  return state.plots - before;
}

/** Souls per drawn body — the representative ratio the caller's `bodyTarget` implies (A1.1). */
function denom(state) {
  const led = state.input.ledger;
  const finalPop = led.epochs[led.epochs.length - 1].population;
  return Math.max(1, finalPop / Math.max(1, state.input.bodyTarget || 1));
}

/**
 * ⭐⭐ §3d · **TYPED EXTRAMURAL EMISSION, STAMPED AT EMISSION.** The ledger already typed the act
 * (`emit.origin`); the constructor places it at the matching anchor — a gate first, then a road,
 * then the frontier — and the READER verifies (A1.5's generator-writes/reader-checks direction).
 */
function emit(state, ep, act, budget) {
  const { arr, input } = state;
  const wrap = state.wraps[state.wraps.length - 1];
  // ⭐⭐⭐ **"GATE FIRST, THEN A ROAD, THEN THE FRONTIER" — AND TWO OF THE THREE WERE MISSING
  // (GROW-A-RESUME).** The header has said all three since SPINE-1. What the code did was take ONE
  // anchor — `wrap.gates[state.emissions.length % wrap.gates.length]` — and the first face
  // `locateFace` happened to return there; if that face was a PLOT, a WALLBAND or the ring's own
  // ground, the whole typed act returned **0 with nothing counted**.
  // ⛔⛔ AND THE ROTATION WAS KEYED ON **SUCCESSES**, so a blocked gate blocked FOREVER: every
  // refused act re-picked the same index and failed for the same reason. MEASURED: `town-2` drew
  // **0 of its 7** typed emission acts, all six reachable ones refused at one gate; the metropolis
  // drew 6 of 30 and the town 1 of 10. Those are the souls §3d says must leave a saturated circuit,
  // and dropping them is why a settlement whose ledger triples could not grow — the room was
  // outside and the act to use it was being discarded, silently.
  // ⭐ NOW: every gate is tried, then every way, each with the FRONTIER walk behind it, and a
  // genuine failure — no open ground anywhere — is COUNTED as `emissionRefusals`.
  const anchor = emissionAnchor(state, wrap, act);
  if (!anchor) { state.emissionRefusals++; return 0; }
  const host = anchor.host;
  const before = state.plots;
  const souls = Math.max(1, Math.min(Math.max(0, budget), Math.round(act.souls / denom(state))));
  developGround(state, host, ep, souls, 1);
  const rec = Object.freeze({
    key: act.key,
    epoch: state.epoch,
    year: act.year,
    souls: act.souls,
    origin: act.origin,
    anchorKind: anchor.kind,
    at: Object.freeze(anchor.at.slice()),
    plots: state.plots - before,
    /** ⭐ THE STAMP IS THE KERNEL'S; `deriveFaubourgOrigins` is the VERIFIER (A1.5). */
    stampedBy: 'partitionConstruct.emit',
    reason: `${act.souls} souls settled extramurally, typed '${act.origin}', anchored at the`
      + ` ${anchor.kind} the standing circuit of year ${wrap.year} left them`,
  });
  state.emissions.push(rec);
  stamp(state, `emit.${rec.key}`, 'FAUBOURG_EMITTED', ep, act.reason || 'a saturated circuit');
  return state.plots - before;
}

/**
 * ⭐⭐ **THE FRONTIER LEG.** From the anchor, step outward along the ray from the settlement centre
 * over open FIELD ground that is not band ground and not wet. The walk is bounded by the seeded
 * extent, so it terminates; a walk that finds nothing returns −1 and the caller counts the refusal
 * rather than losing the act.
 * ⚠ THE STEP IS THE ROAD WIDTH, so the search grain is the settlement's own, not a constant.
 *
 * ⭐⭐⭐ **THE ORDER IS `pickHost`'s OWN — (area desc, faceId asc) — AND THAT IS THE SECOND HALF OF
 * THE J-GROWA-12 CURE (§684.3).** The walk used to return the FIRST open face it stepped onto, so
 * the estate carried TWO host-choosers spelling ONE law two different ways: accretion took the
 * LARGEST reachable open face, emission took whichever one the ray happened to touch first. That
 * difference is what let a small act permanently throttle a large one. `developGround` carves a
 * patch sized to the act (`carveDevelopmentPatch` halves the host toward its frontier until the
 * piece is about the size the budget asks for), so a **2-plot act leaves the frontier it stood on
 * cut into slivers**, and the next act's first-hit walk lands on one of them.
 * ⛔⛔ MEASURED AT THE METROPOLIS'S LAST EPOCH, with the raise already moved ahead of the growth:
 * 133 open FIELD faces stood outside the wrap holding 1,227,216 u², the largest 180,310 u² — and
 * the first-hit walk handed three of the five gates faces of **25, 14 and 92 u²** while the LARGEST
 * face on the SAME RAY measured 85,493, 47,771 and 110,445. An 87-plot act wants 3,819 u²; a 25 u²
 * sliver holds one lot. The corpus's 30 metropolis acts asked for 1,105 plots and drew 637.
 * ⚠ THE WALK STILL STOPS AT THE EXTENT AND STILL PREFERS THE RAY — only the tie between the faces
 * the ray actually crosses is broken by ground rather than by arrival, so a faubourg still lands on
 * the gate's own side of the settlement. No threshold and no constant is minted here.
 */
function frontierHost(state, at) {
  const { arr, input } = state;
  const rw = input.roadWidth || 5;
  const cx = input.extent.cx; const cy = input.extent.cy;
  const dx = at[0] - cx; const dy = at[1] - cy;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L; const uy = dy / L;
  const reach = Math.max(0, input.extent.radius * 0.98 - L);
  let best = -1; let bestA = 0;
  for (let s = 0; s <= reach; s += rw) {
    const p = [at[0] + ux * s, at[1] + uy * s];
    if (inWater(state, p[0], p[1])) continue;
    const f = locateFace(arr, p[0], p[1]);
    if (f < 0) continue;
    const face = arr.faces[f];
    if (face.cls !== 'FIELD') continue;
    // ⚠ `inBand` IS THE WALL'S OWN GROUND AND IS REFUSED; `exhausted` IS **NOT** CHECKED, AND THE
    //   DISTINCTION IS MEASURED. `exhausted` is `accrete`'s own bookkeeping — *"this host produced
    //   nothing at the budget I offered"* — not a property of the ground. Refusing it here made the
    //   `town-2` leaf drop **6 of its 7** typed emission acts, because open country an early epoch
    //   had probed at a small budget was permanently closed to every later faubourg.
    if (face.attrs && face.attrs.inBand) continue;
    const a = faceArea(arr, f);
    if (a > bestA || (a === bestA && best >= 0 && f < best)) { bestA = a; best = f; }
  }
  return bestA > 0 ? best : -1;
}

/**
 * Where a typed emission lands: **gate → road → frontier**, the estate's own resolution order, and
 * every candidate is tried until one has open ground behind it.
 * ⚠ THE ROTATION OFFSET IS THE NUMBER OF ACTS ATTEMPTED, NOT SUCCEEDED — so a blocked gate is
 * stepped past instead of re-chosen. It exists for VARIETY (successive faubourgs prefer different
 * gates), never for reachability, which is the frontier walk's job.
 * @returns {{kind:string, at:number[], host:number}|null}
 */
function emissionAnchor(state, wrap, act) {
  const { arr, input } = state;
  const reach = (input.roadWidth || 5) * 3.2;
  const out = (fid, kind) => {
    const c = faceCentroid(arr, fid);
    const dx = c[0] - input.extent.cx; const dy = c[1] - input.extent.cy;
    const L = Math.hypot(dx, dy) || 1;
    const at = [c[0] + (dx / L) * reach, c[1] + (dy / L) * reach];
    const host = frontierHost(state, at);
    return host < 0 ? null : { kind, at, host };
  };
  /** @type {Array<[number[], string]>} */ const tiers = [];
  if (act.origin === 'gate' || act.origin === 'road' || !act.origin) {
    tiers.push([wrap.gates.slice(), 'gate']);
  }
  tiers.push([liveFaces(arr).filter((f) => f.cls === 'WAY').map((f) => f.id), 'road']);
  const spin = state.emissions.length + state.emissionRefusals;
  for (const [ids, kind] of tiers) {
    if (!ids.length) continue;
    for (let i = 0; i < ids.length; i++) {
      const hit = out(ids[(spin + i) % ids.length], kind);
      if (hit) return hit;
    }
  }
  return null;
}

/** ⭐ §3f-GROW · QUARTER MINTING — a named quarter is EARNED at a tier threshold. */
function mintQuarter(state, ep, qm) {
  const { arr } = state;
  const pid = mintPiece(arr, 'WARD', -1, state.rootWard, {
    tier: qm.tier, year: qm.year, earned: true, reason: qm.reason,
  });
  state.quarters.push({ piece: pid, tier: qm.tier, year: qm.year, epoch: state.epoch });
  stamp(state, `ward.${pid}`, 'QUARTER_MINT', ep, `tier threshold '${qm.tier}' crossed`);
}

/** ⭐⭐⭐ A6.1 EMISSION, AT CREATION (A1.7's M3 — SPINE-1 owns it, not SPINE-2). */
function stamp(state, key, beat, ep, sourceEvent) {
  // ⚠ A NULL EPOCH IS THE CLOSING SWEEP'S, and it stamps `derived-frozen` rather than borrowing the
  // last epoch's provenance: the act happened at the fold's end, not in a year the ledger records.
  const prov = ep && ep.provenance ? ep.provenance : (ep === null ? 'derived-frozen' : 'interpolated');
  const year = ep ? ep.year : state.lastYear;
  state.annotations[key] = annotate({
    appearanceEpoch: state.epoch,
    withinEpochOrder: state.order++,
    provenance: prov,
    beatEvents: [beatEvent(beat, year, sourceEvent, prov)],
  });
}

/** Publish the partition. Frozen, counted, and every figure a reader can re-derive. */
function publish(state, foldedEpochs) {
  const { arr, input } = state;
  const byClass = {};
  for (const f of liveFaces(arr)) byClass[f.cls] = (byClass[f.cls] || 0) + 1;
  const byEdge = {};
  for (const e of arr.edges) byEdge[e.type] = (byEdge[e.type] || 0) + 1;
  return Object.freeze({
    artifactKind: 'SETTLED_GROUND_PARTITION',
    schemaVersion: PARTITION_SCHEMA_VERSION,
    arrangement: arr,
    /** ⭐ THE EXTENT THIS PARTITION WAS SEEDED ON, echoed so a VIEW can fit a page to the
     *  settlement rather than to the hinterland. It is the input verbatim; nothing derives from
     *  it here. */
    extent: Object.freeze({ ...input.extent }),
    faceCounts: Object.freeze(byClass),
    edgeCounts: Object.freeze(byEdge),
    wraps: Object.freeze(state.wraps.slice()),
    gates: Object.freeze(state.gates.slice()),
    /** ⭐ A2.1's CUT RECORD, published so A1.2's dissolve can READ the runs the cuts generated
     *  instead of re-discovering them. One row per party run: its BLOCK piece and its member
     *  faces, in cut order. */
    blocks: Object.freeze([...state.blockOfRun.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([block, piece]) => Object.freeze({ block, piece }))),
    runCount: state.runs,
    emissions: Object.freeze(state.emissions.slice()),
    quarters: Object.freeze(state.quarters.slice()),
    /** ⭐⭐ SPINE-2 · §3e's own record: what the water cut, what it crossed, what moored on it. */
    water: Object.freeze({
      cut: state.waterCut ? Object.freeze({ ...state.waterCut, faces: Object.freeze(state.waterCut.faces.slice()) }) : null,
      ring: state.waterRing ? Object.freeze(state.waterRing.map((p) => Object.freeze(p.slice()))) : null,
      stations: state.waterStations ? state.waterStations.length : 0,
      crossingRefusals: state.crossingRefusals,
      quayRefusals: state.quayRefusals,
    }),
    crossings: Object.freeze(state.crossings.slice()),
    quays: Object.freeze(state.quays.slice()),
    /** ⭐⭐ SPINE-2 · §3f's own record, under GROW-A's reserved schema. */
    losses: publishLosses(state),
    annotations: Object.freeze({ ...state.annotations }),
    plots: state.plots,
    foldedEpochs,
    /**
     * ⭐⭐⭐ ⟦CAR-FOUND, ODQ §718.2⟧ **WHAT EVERY EPOCH ASKED FOR AND WHAT IT COULD NOT BUILD** —
     * one row per folded epoch, in fold order, alongside the six refusal counters below and in the
     * same shape. See `recordDemand` for the ruling this implements and for why nothing reads it.
     * ⛔ Before this channel, `plots` and `foldedEpochs` were published with **no target and no
     * remainder term anywhere**, so a deadlocked epoch was indistinguishable from an epoch that
     * had nothing to build.
     */
    demand: Object.freeze(state.demands.slice()),
    /** ⭐ THE ROLL-UP, so a reader is not obliged to fold 36 rows to learn whether the ground ever
     *  refused this settlement anything. Every figure re-derivable from `demand` above. */
    demandTotals: Object.freeze({
      epochs: state.demands.length,
      asked: state.demands.reduce((n, d) => n + d.demand, 0),
      built: state.demands.reduce((n, d) => n + Math.max(0, d.built), 0),
      deficit: state.demands.reduce((n, d) => n + d.deficit, 0),
      deadlockedEpochs: state.demands.filter((d) => d.deadlocked).length,
      worstEpoch: state.demands.reduce((w, d) => (w && w.deficit >= d.deficit ? w : d), null)
        ? state.demands.reduce((w, d) => (w && w.deficit >= d.deficit ? w : d), null).epoch : null,
    }),
    waterRefusals: state.waterRefusals,
    gateEconomyRefusals: state.gateEconomyRefusals,
    sprawlRefusals: state.sprawlRefusals,
    emissionRefusals: state.emissionRefusals,
    refusals: Object.freeze(arr.refusals.slice()),
    ranks: WAY_RANKS,
    reason: `${state.plots} plot(s) folded from`
      + ` ${foldedEpochs} ledger epoch(s) in ${state.runs} party run(s) across`
      + ` ${state.blockOfRun.size} block(s);`
      + ` ${state.wraps.length} wrap(s) with`
      + ` ${state.gates.length} gate(s); ${state.emissions.length} typed emission(s);`
      + ` ${(byClass.WATER || 0)} water face(s) over ${state.waterStations ? state.waterStations.length : 0}`
      + ` bank station(s) with ${state.crossings.length} typed crossing(s)`
      + ` (${state.crossings.map((c) => c.kind).join(', ') || 'none'}) and ${state.quays.length} quay(s);`
      + ` ${state.losses.length} LossRegion(s);`
      + ` ${state.waterRefusals} act(s) refused by the watercourse,`
      + ` ${state.gateEconomyRefusals} by the gate economy,`
      + ` ${state.sprawlRefusals} by §3d's no-untyped-sprawl law,`
      + ` ${state.emissionRefusals} typed emission act(s) that found no open ground;`
      + ` ${arr.refusals.length} geometric refusal(s).`
      + ` ⟦demand⟧ ${state.demands.reduce((n, d) => n + d.demand, 0)} plot(s) asked for across`
      + ` ${state.demands.length} epoch(s), ${state.demands.reduce((n, d) => n + d.deficit, 0)}`
      + ` unbuilt in ${state.demands.filter((d) => d.deadlocked).length} deadlocked epoch(s)`,
  });
}

/** Re-exported so a caller can add a vertex to a published partition's arrangement in a probe. */
export { addVertex };
