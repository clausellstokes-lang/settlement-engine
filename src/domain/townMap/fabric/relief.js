/**
 * domain/townMap/fabric/relief.js — §9.5b THE RELIEF LAW: the land as a character.
 *
 * ⭐⭐ "A FORCED-RECONCILIATION SETTLEMENT WHOSE TERRAIN DRAMA IS INVISIBLE IN THE RENDER
 * FAILS ACCEPTANCE REGARDLESS OF GEOMETRIC CORRECTNESS." The §5.-1 substrate was already
 * derived, sampled and obeyed by every placement decision — and none of it reached the
 * paint. A fjord town rendered as flat plains with no sea. This module is the DERIVATION
 * half of the cure: it turns the heightfield into the era's own relief marks, and the lens
 * draws them. Nothing here is decoration; every mark cites a substrate reading.
 *
 * THE IDIOMS, each a pre-industrial drafting convention (§9.5 ERA LAW):
 *   HILL PROFILES   the little rounded "molehill" signs of period maps, on ground that
 *                   rises but is not steep. Drawn as a bump with hatch on its shaded side.
 *   HACHURES        short strokes running DOWN the slope, denser and longer where the
 *                   ground is steeper. The surveyor's own way of saying "steep" without
 *                   shading. NEVER hillshading — each stroke is a LINE, not a gradient.
 *   CRAG HATCHING   angular cross-hatch on exposed stone: steep AND rocky ground.
 *   TERRACE LINES   contour-following lines where a settlement had to cut its ground
 *                   level. §161b's visible work, on the ground that forced it.
 *   FORM LINES      broad contours over the open country — the map's sense of height.
 *   MARSH TICKS     the reed-tuft convention where standing water sits.
 *   THE WATER BODY  §5.0b's mode, as a REGION rather than a line. See shoreContour below.
 *
 * ⭐⭐ THE SHORE IS A CONTOUR OF THE GROUND, NOT A DRAWN LINE — and that is what makes a
 * fjord look like a fjord. The landed model's coast is a straight two-point path with a
 * seeded wobble, which draws an ocean as a ruled edge. The substrate already knows where
 * the low ground is: a fjord's shape is `ramp` (a shelf falling to one edge) crossed with
 * `trough` (a through-going valley), and the sea level contour of that field IS a deep
 * cove between headlands. Tracing it costs one mask walk and produces the landform for
 * free, in every family, forever. THE ONE-DECIDER RULE HOLDS: siteGenesis decides WHETHER
 * there is sea; this decides only WHERE it reaches, exactly as the river already does.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare, no Math.pow.
 */

import { hashUnit } from './fabricRng.js';
import { VIEW, sampleAt } from './substrate.js';
import { REFUSAL } from './groundRefusal.js';
import { traceMask, OUTER_SIGN, organicRing } from './umbrella.js';
import { absArea } from './fabricGeometry.js';

export { organicRing };

/** @typedef {[number, number]} Point */

/**
 * THE SEA SHARE — how much of the leaf open water takes, as a share of the frame.
 *
 * §42/§43 VALUE, DERIVED rather than chosen: it reads the family's own `ramp` term, which
 * IS the statement "this land falls away to a shelf". A family with no ramp that
 * nonetheless carries sea (a strand behind dunes) gets the floor; a fjord's deep shelf
 * gets the ceiling. The floor exists because a sea that covers a tenth of the leaf reads
 * as a pond, and the ceiling because §2.2's dressed ground must still dominate the frame.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const SEA_SHARE = Object.freeze({ floor: 0.13, perRamp: 0.20 });

/** Marks are RATIONED (§9.3). These are the ceilings per mark family, before the tier's
 * own accent band scales them down. A relief pass that draws every steep cell is a
 * texture, not a drawing. */
export const MARK_BUDGET = Object.freeze({
  hachure: 240, crag: 90, hill: 70, terrace: 26, formLine: 16, marsh: 90, waterStroke: 30,
});

/**
 * Slope thresholds, in the substrate's own normalized-to-local-maximum units.
 *
 * ⚠⚠ `marsh` IS NOT A LOCAL VALUE AND MUST NOT BECOME ONE. It is `groundRefusal.REFUSAL
 * .standingWater`, imported rather than re-spelled, because **the law and the picture have to
 * agree about water**: a reed tuft drawn where a house may stand — or a house standing where
 * the reader sees reeds — is the same defect from the two ends. `sub.wet` is an ABSOLUTE
 * field (unlike `sub.slope`), so the two can share one number honestly; the slope bands
 * cannot, and `groundRefusal.js`'s header states why in full.
 * ⭐ The import direction is deliberate: `groundRefusal` imports only `substrate.js`, so the
 * fabric layer stays acyclic (the module-graph pin holds it).
 */
export const RELIEF_BANDS = Object.freeze({
  hillLo: 0.16, hillHi: 0.42, hachure: 0.38, crag: 0.60, terrace: 0.30,
  marsh: REFUSAL.standingWater,
});

/** Clamp to 0..1. */
function unit(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/**
 * The height quantile of a substrate — the level below which `share` of the ground lies.
 * A sort of a copy, numeric only, so the order is total and platform-independent.
 * @param {import('./substrate.js').Substrate} sub @param {number} share @returns {number}
 */
export function heightQuantile(sub, share) {
  const vals = Array.prototype.slice.call(sub.height);
  vals.sort((a, b) => a - b);
  const k = Math.floor(unit(share) * (vals.length - 1));
  return vals[k];
}

/**
 * THE DOWNSLOPE DIRECTION at a view-space point — a unit vector pointing downhill, plus
 * the local gradient magnitude. Central differences on the height field; `+ - * /` and
 * `Math.sqrt` only.
 * @param {import('./substrate.js').Substrate} sub @param {number} x @param {number} y
 * @returns {{ dx:number, dy:number, mag:number }}
 */
export function downslope(sub, x, y) {
  const n = sub.n;
  let i = Math.floor(x / sub.cell), j = Math.floor(y / sub.cell);
  if (i < 1) i = 1; else if (i > n - 2) i = n - 2;
  if (j < 1) j = 1; else if (j > n - 2) j = n - 2;
  const gx = (sub.height[j * n + i + 1] - sub.height[j * n + i - 1]) / 2;
  const gy = (sub.height[(j + 1) * n + i] - sub.height[(j - 1) * n + i]) / 2;
  const mag = Math.sqrt(gx * gx + gy * gy);
  if (mag === 0) return { dx: 1, dy: 0, mag: 0 };
  return { dx: -gx / mag, dy: -gy / mag, mag };
}

/**
 * @typedef {Object} Shore
 * @property {Point[]} body      the closed water region, view space
 * @property {Point[]} line      the WET EDGE only — the ring minus its frame-edge run
 * @property {number} level      the height contour the shore was traced at
 * @property {number} share      the share of the frame the body actually covers
 */

/**
 * ⭐⭐⭐ §5 W1 EXIT 6 · TRACE THE SHORE — **AT TWO SCALES, WITH THE DETAIL DAMPED AT THE
 * WORKED WATERFRONT.**
 *
 * THE LARGE SCALE is the traced level contour of the heightfield: a cove between headlands
 * on a fjord, a shallow bight on a strand. It is a fact about the GROUND and it is the shape
 * a reader recognises the landform by.
 *
 * THE DETAIL SCALE is `organicRing`'s per-vertex displacement: the wrinkle of a wild shore —
 * the rocks, the little inlets, the un-surveyed edge.
 *
 * ⭐⭐ AND THE DETAIL IS DAMPED WHERE THE SETTLEMENT WORKS ITS WATERFRONT, WHICH IS A
 * PHYSICAL CLAIM AND NOT A DRAWING CONVENTION. A worked shore is revetted, quayed, piled and
 * cut straight — that is what a quay IS — so its small-scale sinuosity FALLS while the large
 * shape it sits in does not move at all. The two scales therefore come apart exactly where
 * the town is, and that separation is the measurement §5 W1 exit 6 asks for.
 *
 * ⚠⚠ AND THE ATTENUATION IS WHY THE ASYMMETRY MAY NOT BE A RULE. ATLAS banned prior #10 is a
 * HARDCODED bank split; §5 W1 exit 6 requires the through leaves' ~70/30 to arrive as a
 * CONSEQUENCE. It does: the worked bank is straightened, so its frontage is continuous and
 * accretes; the wild bank keeps its meander lobes, which break frontage into pockets. **No
 * line anywhere says 70/30, and the counterfactual — remove the damping and the asymmetry
 * must weaken — is the only thing that can tell the two apart.**
 *
 * @param {import('./substrate.js').Substrate} sub
 * @param {{ seed: string|number, variant?: number }} seeding
 * @param {{ x:number, y:number, r:number }} [worked]  the settlement's own seat and reach
 * @returns {Shore|null}
 */
export function shoreContour(sub, seeding, worked = null) {
  const share = unit(SEA_SHARE.floor + (sub.shape.ramp || 0) * SEA_SHARE.perRamp);
  const level = heightQuantile(sub, share);
  const n = sub.n;
  const isSea = (i, j) => sub.height[j * n + i] <= level;
  const loops = traceMask(isSea, n, sub.cell);
  if (!loops.length) return null;

  // The sea is the OUTER loop with the largest area that touches the frame boundary.
  // ⛔ THE EDGE TEST IS WHAT SEPARATES A SEA FROM A LAKE. Without it, a mountain family's
  // deepest interior basin wins on area and the settlement is drawn beside an ocean that
  // has no connection to anywhere — the exact class of incoherence §161a exists to refuse.
  const EDGE = sub.cell * 0.51;
  let best = null, bestArea = 0;
  for (const l of loops) {
    if (l.signedArea * OUTER_SIGN <= 0) continue;
    let touches = false;
    for (const p of l.ring) {
      if (p[0] <= EDGE || p[1] <= EDGE || p[0] >= VIEW - EDGE || p[1] >= VIEW - EDGE) { touches = true; break; }
    }
    if (!touches) continue;
    const a = absArea(l.ring);
    if (a > bestArea) { bestArea = a; best = l.ring; }
  }
  if (!best) return null;

  // ⛔⛔ THE SEA MUST RUN CLEANLY OFF THE FRAME, AND THE ORGANIC WOBBLE WAS STOPPING IT.
  //
  // `organicRing` displaces every vertex along its own outward normal before corner-cutting
  // — the de-staircasing cure, and exactly right on the parts of a coastline that are
  // coastline. On the run of the ring that IS THE EDGE OF THE PAGE it is wrong: the
  // displacement pushes those vertices alternately in and out across the frame, so the sea
  // ends in a SCALLOPED FRINGE with lobes of bare paper showing between it and the border.
  // At plan scale that fringe reads, unmistakably, as a line of handwriting along the top of
  // the leaf — which is how it was found: as "stray text bleeding at the top of the fjord".
  //
  // ⭐ THE CLASS, and it is §2.3's continuity law arriving for the sea. The river was cured
  // the same way and for the same reason: the leaf is a WINDOW on the world, so anything
  // that leaves the frame must leave it, not stop just short of it and wobble. The wobble
  // belongs to the SHORE; the frame is not a shore, it is the edge of the paper.
  // ⭐ THE TWO SCALES, BUILT SEPARATELY SO BOTH CAN BE MEASURED. `coarse` is the large shape
  // with the detail term set to ZERO — same trace, same smoothing, no wrinkle — so a pin can
  // compare the two rather than take the claim on trust.
  const shoreKey = `${String(seeding.seed)}|shore`;
  const wf = waterfrontDamping(worked, best);
  const coarse = snapToFrame(organicRing(best, sub.cell, shoreKey, 0, 2), sub.cell * 1.6);
  const body = snapToFrame(
    organicRing(best, sub.cell, shoreKey, SHORE_DETAIL.amplitude, 2, wf ? wf.damp : null), sub.cell * 1.6,
  );

  // THE WET EDGE: the run of the ring that is NOT the frame boundary. Everything
  // downstream that asks "which side is the town on" must ask it of the real shore, never
  // of the corner of the page.
  /** @type {Point[]} */ const line = [];
  for (const p of body) {
    const onFrame = p[0] <= EDGE * 2 || p[1] <= EDGE * 2 || p[0] >= VIEW - EDGE * 2 || p[1] >= VIEW - EDGE * 2;
    if (!onFrame) line.push(p);
    else if (line.length && line[line.length - 1] !== null) line.push(/** @type {any} */ (null));
  }
  const runs = [];
  let run = [];
  for (const p of line) {
    if (p === null) { if (run.length > 1) runs.push(run); run = []; } else run.push(p);
  }
  if (run.length > 1) runs.push(run);
  runs.sort((a, b) => b.length - a.length);

  const wet = runs.length ? runs[0] : body;
  return {
    body,
    coarse,
    line: wet,
    level,
    share: bestArea / (VIEW * VIEW),
    // ⭐ THE MEASUREMENT §5 W1 EXIT 6 IS GRADED ON, taken here rather than reconstructed by a
    // probe: the shore's sinuosity NEAR the worked waterfront against AWAY from it, plus the
    // two scales' own sinuosities so "two measurable scales" is a number and not a claim.
    scales: shoreScales(coarse, body, wet, wf),
    quay: wf ? wf.quay : null,
    detail: { amplitude: SHORE_DETAIL.amplitude, damped: !!wf, floor: SHORE_DETAIL.workedFloor, reach: SHORE_DETAIL.reach, quay: wf ? wf.quay : null },
  };
}

/**
 * ⭐ THE DETAIL SCALE'S OWN VALUES. §42/§43, ARGUED:
 *  `amplitude` 0.42 of a cell — unchanged, so an undamped leaf is byte-identical to before.
 *  `workedFloor` 0.12 — a quay is not perfectly straight (it has steps, slips and a boat
 *      strand), so the damping floors above zero rather than ruling the shore flat.
 *  `reach` 1.15 of the built radius — the waterfront a settlement WORKS runs a little beyond
 *      the fabric itself: the strand, the net-drying ground and the upstream mill are outside
 *      the last house and are still worked ground.
 * ⚠ UNSOAKED; ride the tuning signature.
 */
export const SHORE_DETAIL = Object.freeze({ amplitude: 0.42, workedFloor: 0.12, reach: 1.15 });

/**
 * ⭐⭐ THE ATTENUATION IS MEASURED FROM **THE QUAY**, NOT FROM THE SEAT, and the difference is
 * the whole mechanism.
 *
 * ⛔ THE FIRST SPELLING KEYED IT ON DISTANCE FROM THE SETTLEMENT'S SEAT, and MEASURED that
 * damped almost nothing: on the coastal city the seat sits **197 view units inland** of its own
 * shore, so the nearest shore point already stood at t = 0.44 of the reach and came back with
 * a damping of 0.479 — a mean of 0.862 over the whole worked stretch, i.e. a 14% reduction
 * that the large shape's own variation swamped. ⭐ THE CLASS: **a settlement's WATERFRONT is
 * not its CENTRE, and a radius drawn from the centre reaches the water already spent.** A town
 * whose market place is a quarter-mile from the river still has a fully built quay.
 *
 * So the damping is keyed on the point of the traced ring NEAREST the seat — the quay — and
 * falls off ALONG the shore from there. Smoothstep rather than a step, because a worked shore
 * does not stop at a line: the quay becomes a strand becomes a bank.
 *
 * @param {{x:number,y:number,r:number}|null} worked
 * @param {Point[]} ring the traced contour the quay is found on
 * @returns {{ damp:(x:number,y:number)=>number, quay:[number,number], reach:number }|null}
 */
function waterfrontDamping(worked, ring) {
  if (!worked || !(worked.r > 0) || !ring || !ring.length) return null;
  let qx = ring[0][0], qy = ring[0][1], best = Infinity;
  for (const p of ring) {
    const dx = p[0] - worked.x, dy = p[1] - worked.y;
    const d = dx * dx + dy * dy;
    if (d < best) { best = d; qx = p[0]; qy = p[1]; }
  }
  const R = worked.r * SHORE_DETAIL.reach;
  return {
    quay: /** @type {[number,number]} */ ([qx, qy]),
    reach: R,
    damp: (x, y) => {
      const dx = x - qx, dy = y - qy;
      const t = Math.sqrt(dx * dx + dy * dy) / R;
      if (t >= 1) return 1;
      const sm = t * t * (3 - 2 * t);                     // 0 at the quay, 1 at the reach
      return SHORE_DETAIL.workedFloor + (1 - SHORE_DETAIL.workedFloor) * sm;
    },
  };
}

/**
 * SINUOSITY over a sliding window — path length divided by chord length. A window is used
 * rather than the whole line because sinuosity over a whole coastline is dominated by the
 * large shape; the question here is how wrinkly the line is AT each place.
 * @param {Point[]} line @param {number} win samples per window
 */
function sinuosityProfile(line, win) {
  /** @type {Array<{x:number,y:number,s:number}>} */ const out = [];
  for (let i = 0; i + win < line.length; i++) {
    let path = 0;
    for (let k = i; k < i + win; k++) {
      const dx = line[k + 1][0] - line[k][0], dy = line[k + 1][1] - line[k][1];
      path += Math.sqrt(dx * dx + dy * dy);
    }
    const cx = line[i + win][0] - line[i][0], cy = line[i + win][1] - line[i][1];
    const chord = Math.sqrt(cx * cx + cy * cy);
    if (chord < 1e-6) continue;
    out.push({ x: (line[i][0] + line[i + win][0]) / 2, y: (line[i][1] + line[i + win][1]) / 2, s: path / chord });
  }
  return out;
}

const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);

/**
 * ⭐⭐ THE TWO SCALES AND THE DAMPING, AS FOUR NUMBERS A PIN CAN ASSERT ON.
 *  `coarseSinuosity` / `detailSinuosity` — the large shape's and the drawn shore's, over the
 *      SAME window. Two scales exist when the second materially exceeds the first.
 *  `near` / `far` — the drawn shore's fine-window sinuosity inside and outside the worked
 *      reach. The damping works when `near < far`.
 * ⚠ `near` IS null WHEN NO WORKED REACH WAS SUPPLIED, and null is not 0. A caller that read
 *   a missing measurement as a passing one would be the completeness ladder's own defect.
 */
function shoreScales(coarse, body, wet, wf) {
  // ⛔ THE FIRST SPELLING COMPARED TWO DIFFERENT WINDOWS and returned "the large shape is
  // wrigglier than the small one", which is only a statement about window size. ⭐ THE CLASS:
  // **two curves are comparable only at the same window; a sinuosity without its window is
  // not a number.**
  //
  // ⛔⛔ AND THE SECOND SPELLING WAS WORSE, BECAUSE IT ALMOST WORKED. With both windows equal,
  // the drawn shore's ABSOLUTE local sinuosity near the town was compared with its absolute
  // local sinuosity away from it — and MEASURED, the coastal city read `near 1.1301 > far
  // 1.1178`, i.e. "the damping made the shore MORE wrinkly", while the fjord on the same code
  // read the other way. Neither number was wrong: **the large shape is not uniformly bendy,
  // and where the town sits is not a random sample of it** — a settlement seats itself in a
  // BIGHT, which is a bendy stretch of coast, so the two populations differ before any
  // displacement is added. ⭐ THE CLASS, and it is this programme's own most expensive one in
  // a new costume: **A AND B MEASURED IN TWO PLACES DIFFER FOR EVERY REASON, NOT ONLY YOURS.**
  //
  // ⭐⭐ THE CURE IS A PAIRED DIFFERENCE, AND IT IS EXACT HERE BY CONSTRUCTION. `coarse` and
  // `body` are the SAME traced ring through the SAME `chaikin(…, 2)` — one with the detail
  // amplitude at 0, one with it on — so they are INDEX-ALIGNED point for point. The detail
  // term at a station is therefore `body.s[i] − coarse.s[i]`, with the large shape subtracted
  // off rather than assumed away, and the damping is `excessNear < excessFar` on a statistic
  // that is zero everywhere the displacement is zero.
  const FINE = 8, COARSE = 40;
  const fineBody = sinuosityProfile(body, FINE);
  const fineCoarse = sinuosityProfile(coarse, FINE);
  const bodyCoarse = sinuosityProfile(body, COARSE);
  const fineWet = sinuosityProfile(wet, FINE);
  const paired = Math.min(fineBody.length, fineCoarse.length);
  /** @type {number[]} */ const near = []; /** @type {number[]} */ const far = [];
  /** @type {number[]} */ const excess = [];
  const EDGE = 8;
  const R = wf ? worker(wf) : null;
  for (let i = 0; i < paired; i++) {
    const p = fineBody[i];
    // ⚠ THE FRAME RUN IS NOT SHORE. `snapToFrame` rules those vertices flush to the border,
    // so their sinuosity is 1 by construction and would dilute both populations equally —
    // which is worse than it sounds, because it drags the DIFFERENCE toward zero and would
    // make a working damping look like a weak one.
    if (p.x <= EDGE || p.y <= EDGE || p.x >= VIEW - EDGE || p.y >= VIEW - EDGE) continue;
    const d = p.s - fineCoarse[i].s;
    excess.push(d);
    if (!R) continue;
    (R(p.x, p.y) ? near : far).push(d);
  }
  return {
    window: { fine: FINE, coarse: COARSE },
    // ⚠ BOTH AT THE **FINE** WINDOW — the large shape and the drawn shore, measured the same
    // way, so their difference IS the detail term. `bodyCoarseSinuosity` is the drawn shore at
    // the coarse window: the LARGE shape's own reading, which the damping must not move.
    coarseSinuosity: mean(fineCoarse.map((p) => p.s)),
    detailSinuosity: mean(fineBody.map((p) => p.s)),
    wetSinuosity: mean(fineWet.map((p) => p.s)),
    bodyCoarseSinuosity: mean(bodyCoarse.map((p) => p.s)),
    detailExcess: mean(excess),
    samples: { fine: fineBody.length, paired: excess.length, near: near.length, far: far.length },
    excessNear: near.length ? mean(near) : null,
    excessFar: far.length ? mean(far) : null,
    quay: wf ? wf.quay : null,
    status: !wf ? 'NOT APPLICABLE (no worked reach supplied)'
      : !near.length ? 'NOT APPLICABLE (no shore inside the worked reach)'
        : !far.length ? 'NOT APPLICABLE (the whole shore is inside the worked reach)'
          : 'MEASURED',
  };
}

/** The worked-reach membership test — distance from THE QUAY, matching the damping itself.
 *  ⚠ A membership test keyed on a different centre from the damping would split the
 *  populations along a line the mechanism does not act on, which is a measurement that cannot
 *  see its own effect. */
function worker(wf) {
  return (x, y) => {
    const dx = x - wf.quay[0], dy = y - wf.quay[1];
    return Math.sqrt(dx * dx + dy * dy) <= wf.reach;
  };
}


/**
 * Snap a ring's near-frame vertices ONTO the frame. Anything within `band` of an edge is
 * pulled flush to it, so the run of the ring that is the page's border is a straight border
 * and not a decorated one. See the note at its use.
 * @param {Array<[number,number]>} ring @param {number} band
 */
function snapToFrame(ring, band) {
  return ring.map(([x, y]) => {
    let nx = x, ny = y;
    if (x <= band) nx = 0; else if (x >= VIEW - band) nx = VIEW;
    if (y <= band) ny = 0; else if (y >= VIEW - band) ny = VIEW;
    return /** @type {[number,number]} */ ([nx, ny]);
  });
}

/**
 * @typedef {Object} ReliefMarks
 * @property {Array<{x:number,y:number,dx:number,dy:number,len:number}>} hachures
 * @property {Array<{x:number,y:number,r:number,ang:number}>} crags
 * @property {Array<{x:number,y:number,r:number,dx:number,dy:number}>} hills
 * @property {Array<Point[]>} terraces
 * @property {Array<Point[]>} formLines
 * @property {Array<{x:number,y:number}>} marsh
 * @property {number} relief         the measured spread this pass was drawn against
 * @property {string} reason
 */

/**
 * DERIVE THE RELIEF MARKS.
 *
 * ⭐ THE MARKS ARE SAMPLED ON A JITTERED LATTICE, NOT ON THE GRID. Marking every k-th cell
 * produces a visible comb — a texture that reads as machine output, which is the opposite
 * of the drafting hand §9 asks for. The sample point is offset inside its own cell by a
 * hash of its coordinates, so the marks scatter the way a hand scatters them and still
 * derive from exactly the cell they sit in.
 *
 * @param {Object} args
 * @param {import('./substrate.js').Substrate} args.sub
 * @param {(x:number,y:number)=>boolean} args.inTown   inside the built umbrella
 * @param {(x:number,y:number)=>boolean} args.inWater
 * @param {number} args.accentBand
 * @param {{ seed: string|number, variant?: number }} args.seeding
 * @returns {ReliefMarks}
 */
export function buildRelief(args) {
  const { sub, accentBand, seeding } = args;
  const inTown = args.inTown || (() => false);
  const inWater = args.inWater || (() => false);
  const key = `${String(seeding.seed)}|relief${seeding.variant ? `|v${seeding.variant}` : ''}`;
  const rock = sub.shape.rockBias || 0;

  /** @type {ReliefMarks} */
  const out = {
    hachures: [], crags: [], hills: [], terraces: [], formLines: [], marsh: [],
    relief: 0,
    reason: '',
  };

  // The measured spread the whole pass is scaled by: a floodplain gets a whisper of
  // form line and nothing else; a mountain gets its hachures. A pass that draws the same
  // marks at every relief would be furniture (§8.2).
  let lo = Infinity, hi = -Infinity;
  for (let k = 0; k < sub.height.length; k++) {
    const h = sub.height[k];
    if (h < lo) lo = h;
    if (h > hi) hi = h;
  }
  const relief = hi - lo;
  out.relief = relief;

  const n = sub.n;
  const STRIDE = 2;
  /** @type {Array<{x:number,y:number,s:number,h:number,w:number,pri:number}>} */ const cells = [];
  for (let j = 1; j < n - 1; j += STRIDE) {
    for (let i = 1; i < n - 1; i += STRIDE) {
      const jx = hashUnit(`${key}|jx|${i}|${j}`), jy = hashUnit(`${key}|jy|${i}|${j}`);
      const x = (i + jx) * sub.cell, y = (j + jy) * sub.cell;
      if (inWater(x, y)) continue;
      const s = sampleAt(sub, sub.slope, x, y);
      const h = sampleAt(sub, sub.height, x, y);
      const w = sampleAt(sub, sub.wet, x, y);
      cells.push({ x, y, s, h, w, pri: hashUnit(`${key}|pri|${i}|${j}`) });
    }
  }
  // ⭐⭐⭐ THE RATION IS SPENT ON THE STEEPEST GROUND, NOT ON A RANDOM SUBSET OF ELIGIBLE
  // GROUND — and this one line is the whole of §9.5b's acceptance failure.
  //
  // ⛔⛔ WHAT WAS THERE AND WHY IT COULD NOT DRAW A LANDFORM. The sort was
  // `(a.pri - b.pri)` — a HASH — and every mark family then took the first N cells off the
  // front of it. That is a UNIFORM RANDOM SAMPLE of every cell above the threshold, so the
  // 204 hachures MEASURED on the `mountain` leaf were scattered evenly over all of its steep
  // ground instead of massed on any of it. A hachure field is not a texture: it reads as
  // terrain only where the strokes CROWD, because the convention's whole grammar is that
  // density means steepness. Spread the same 204 strokes uniformly and the reader sees
  // scrub. ⭐ MF-W0 looked at the plate and wrote "NO RELIEF IS DRAWN … only scrub ticks" on
  // a leaf that had derived 204 hachures and 72 crag marks — the marks were all there and
  // the SELECTION had destroyed the information they carried.
  //
  // ⭐⭐ THE CLASS, AND IT IS WORTH BANKING BECAUSE IT LOOKS LIKE CORRECTNESS: **A RATION
  // SPENT UNIFORMLY OVER AN ELIGIBLE SET IS A RATION SPENT ON NOTHING.** The hash sort was
  // introduced for a real reason — a row-major walk biases marks into the top of the leaf —
  // and it fixed that defect by destroying the signal along with the bias. The correct order
  // is the one the mark's own grammar names: steepest first, so that when the budget runs
  // out it runs out on the gentlest ground, which is where the convention wants no marks.
  //
  // ⚠ THE ANTI-COMB JITTER IS UNTOUCHED. `pri` still breaks ties, so equal-slope cells do
  // not order by scan position, and the sample POINT inside each cell is still hash-offset —
  // the marks scatter within the ground they belong to and no longer scatter across ground
  // they do not. The order is total (slope, then hash, then coordinates) and therefore
  // byte-stable.
  cells.sort((a, b) => (b.s - a.s) || (a.pri - b.pri) || (a.x - b.x) || (a.y - b.y));

  const band = unit(accentBand);

  // ⭐⭐ THE RATION IS ALSO BOUNDED BY HOW MUCH STEEP GROUND THERE ACTUALLY IS, and that is a
  // DERIVATION rather than a second dial. The relief SPREAD says how much vertical range the
  // leaf covers; it says nothing about how much of the leaf is scarp. A river terrace with a
  // 0.33 spread is one bluff and a lot of flat, and rationing it as though a third of the
  // ground were steep buys strokes with nowhere to put them — which is how they end up in the
  // fields, which is how they read as scrub. `steepShare` is measured on the same sampled
  // cells the marks are chosen from, so the ration and the subject are the same population.
  //
  // ⚠ THE FLOOR EXISTS SO A GENUINELY STEEP LEAF IS NEVER STARVED, and the ceiling is 1 —
  // this term can only ever REMOVE marks the ground could not carry, never add any.
  // ⭐ IT IS ALSO WHAT KEEPS §217's PER-TIER OP CEILING HONEST WITHOUT TOUCHING THE RATCHET:
  // MEASURED, the §161a resource cure raised `hamlet`'s relief 0.154 → 0.327 and its
  // uncapped hachure ration from 52 to 110, which put the leaf 13 primitives OVER its pinned
  // ceiling. The ratchet only shrinks and raising it is owner-gated, so the cure had to come
  // from the derivation. It does: hamlet is a gentle leaf with a small steep fraction and
  // the ration now says so.
  let steepN = 0, hillN = 0;
  for (const c of cells) {
    if (c.s >= RELIEF_BANDS.hachure) steepN++;
    else if (c.s >= RELIEF_BANDS.hillLo) hillN++;
  }
  const steepShare = cells.length ? steepN / cells.length : 0;
  // ⚠ THE HILL SIGN GETS THE SAME TREATMENT AND FOR THE SAME REASON — and leaving it out
  // was measurably wrong, not merely inconsistent. The molehill belongs on "ground that
  // rises but is not steep", so its ration must be proportional to how much of THAT band
  // exists. MEASURED: rationing hachures alone still left `hamlet` 2 primitives over its
  // ceiling, because a hill sign costs THREE primitives (the profile plus two flank hatches)
  // and the uncapped ration had put 41 of them on a leaf whose mid-slope band is small.
  // ⭐ THE POINT IS THAT BOTH TERMS ARE THE SAME ARGUMENT: a mark family's ration is
  // proportional to the ground that family is a picture of.
  const hillShare = cells.length ? hillN / cells.length : 0;
  // Normalized against a QUARTER of the leaf being scarp, which is the point at which the
  // convention's own density ceiling (MARK_BUDGET) is the binding constraint rather than the
  // ground. Above that the ground can carry the full ration and this term stops biting.
  const steepRation = unit(steepShare * 4);
  const hillRation = unit(hillShare * 4);

  const budget = {
    hachure: Math.round(MARK_BUDGET.hachure * band * unit(relief * 1.4) * steepRation),
    crag: Math.round(MARK_BUDGET.crag * band * unit(rock * 1.3) * unit(relief * 1.4) * steepRation),
    hill: Math.round(MARK_BUDGET.hill * band * unit(relief * 1.8) * hillRation),
    marsh: Math.round(MARK_BUDGET.marsh * band),
  };

  for (const c of cells) {
    const town = inTown(c.x, c.y);
    if (c.w >= RELIEF_BANDS.marsh && !town) {
      if (out.marsh.length < budget.marsh) out.marsh.push({ x: c.x, y: c.y });
      continue;
    }
    if (town) continue;                      // the town's own ground is drawn by the fabric
    if (c.s >= RELIEF_BANDS.crag && rock >= 0.34) {
      if (out.crags.length < budget.crag) {
        out.crags.push({
          x: c.x, y: c.y,
          r: sub.cell * (1.0 + hashUnit(`${key}|cr|${Math.round(c.x)}|${Math.round(c.y)}`) * 1.1),
          ang: Math.floor(hashUnit(`${key}|ca|${Math.round(c.x)}|${Math.round(c.y)}`) * 64),
        });
      }
      continue;
    }
    if (c.s >= RELIEF_BANDS.hachure) {
      if (out.hachures.length < budget.hachure) {
        const d = downslope(sub, c.x, c.y);
        // Stroke LENGTH carries the steepness — the hachure convention's own grammar:
        // long strokes on a scarp, short ticks on a gentle fall.
        out.hachures.push({ x: c.x, y: c.y, dx: d.dx, dy: d.dy, len: sub.cell * (0.55 + c.s * 1.25) });
      }
      continue;
    }
    if (c.s >= RELIEF_BANDS.hillLo && c.s < RELIEF_BANDS.hillHi && c.h > lo + relief * 0.42) {
      if (out.hills.length < budget.hill) {
        const d = downslope(sub, c.x, c.y);
        out.hills.push({
          x: c.x, y: c.y,
          r: sub.cell * (0.75 + hashUnit(`${key}|hr|${Math.round(c.x)}|${Math.round(c.y)}`) * 0.75),
          dx: d.dx, dy: d.dy,
        });
      }
    }
  }

  // ── FORM LINES AND TERRACES. Both are contours of the same field; what separates them
  //    is WHERE they run. A contour over open country is a form line (the map's sense of
  //    height); the same contour crossing ground the settlement had to cut is a TERRACE —
  //    §161b's visible work, drawn where the work actually was.
  const levels = Math.max(3, Math.min(7, Math.round(2 + relief * 6)));
  for (let li = 1; li <= levels; li++) {
    const q = li / (levels + 1);
    const level = lo + relief * q;
    const loops = traceMask((i, j) => sub.height[j * n + i] >= level, n, sub.cell);
    for (const l of loops) {
      if (l.signedArea * OUTER_SIGN <= 0) continue;
      if (l.ring.length < 12) continue;
      const ring = organicRing(l.ring, sub.cell, `${key}|contour|${li}|${Math.round(l.ring[0][0])}`, 0.34, 2);
      // Split the ring into the runs that sit on ground worth drawing, so a form line
      // stops where the ground goes flat instead of ringing a puddle.
      /** @type {Point[]} */ let run = [];
      /** @type {boolean} */ let runTown = false;
      const flush = () => {
        if (run.length >= 5) (runTown ? out.terraces : out.formLines).push(run);
        run = []; runTown = false;
      };
      for (const p of ring) {
        const s = sampleAt(sub, sub.slope, p[0], p[1]);
        const town = inTown(p[0], p[1]);
        const keep = town ? s >= RELIEF_BANDS.terrace : s >= RELIEF_BANDS.hillLo;
        if (!keep || inWater(p[0], p[1])) { flush(); continue; }
        if (run.length && town !== runTown) flush();
        runTown = town;
        run.push(p);
      }
      flush();
    }
    if (out.terraces.length >= MARK_BUDGET.terrace && out.formLines.length >= MARK_BUDGET.formLine) break;
  }
  out.terraces = rationed(out.terraces, MARK_BUDGET.terrace, `${key}|ter`);
  out.formLines = rationed(out.formLines, Math.round(MARK_BUDGET.formLine * band), `${key}|fl`);

  out.reason = `relief ${relief.toFixed(3)} on '${sub.family}' (rock ${rock.toFixed(2)}): `
    + `${out.hachures.length} hachures, ${out.crags.length} crag marks, ${out.hills.length} hill profiles, `
    + `${out.terraces.length} terrace runs, ${out.formLines.length} form lines, ${out.marsh.length} reed ticks`;
  return out;
}

/** Keep the LONGEST `n` polylines — a ration that keeps the marks that carry the most
 * information rather than the ones that happened to be traced first. Ties break on a hash
 * so the choice is total and stable. */
function rationed(lines, n, key) {
  if (lines.length <= n) return lines;
  return lines
    .map((l, i) => ({ l, i, len: l.length, h: hashUnit(`${key}|${i}`) }))
    .sort((a, b) => (b.len - a.len) || (a.h - b.h))
    .slice(0, Math.max(0, n))
    .sort((a, b) => a.i - b.i)
    .map((r) => r.l);
}

/**
 * THE WATER STROKES — the period convention for open water: lines PARALLEL TO THE SHORE,
 * closest together at the edge and fading seaward. Drawn as lines inside the ink hierarchy
 * (§9.5b's "flat washes + ink only"), never as a gradient standing in for depth.
 * @param {Point[]} shoreLine @param {number} count @param {number} pitch
 * @param {number} side  +1/−1: which way is seaward
 * @returns {Array<Point[]>}
 */
export function waterStrokes(shoreLine, count, pitch, side, inWater) {
  /** @type {Array<Point[]>} */ const out = [];
  if (!shoreLine || shoreLine.length < 6) return out;

  // ⛔⛔ THE SPINE MUST BE SMOOTHED AND DECIMATED BEFORE IT IS OFFSET, AND SKIPPING THAT
  // TURNED THE SEA INTO A SCRIBBLE. A traced shoreline carries a vertex every few units
  // with high local curvature, and offsetting a polyline outward by more than its own
  // radius of curvature makes the offset CROSS ITSELF — at every cove, on every stroke, so
  // the further out the line the worse the tangle. The first fjord render came back with
  // the open water covered in loops. Two corrections, both necessary: DECIMATE to a stride
  // long enough that the curvature the strokes see is gentle, and CLIP each stroke to the
  // water so a stroke that swings back over the land is cut rather than drawn.
  const STRIDE = Math.max(3, Math.round(shoreLine.length / 46));
  /** @type {Point[]} */ const spine = [];
  for (let i = 0; i < shoreLine.length; i += STRIDE) spine.push(shoreLine[i]);
  if (spine[spine.length - 1] !== shoreLine[shoreLine.length - 1]) spine.push(shoreLine[shoreLine.length - 1]);
  if (spine.length < 4) return out;

  const wet = typeof inWater === 'function' ? inWater : () => true;
  const n = Math.min(count, MARK_BUDGET.waterStroke);
  for (let k = 1; k <= n; k++) {
    // The offsets OPEN UP as they go out: tight at the water's edge, loose in the deep.
    // That is the convention's whole read.
    const d = pitch * k * (1 + k * 0.16);
    /** @type {Point[]} */ let run = [];
    for (let i = 0; i < spine.length; i++) {
      const p = spine[i];
      const a = spine[Math.max(0, i - 1)], b = spine[Math.min(spine.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0];
      const l = Math.sqrt(nx * nx + ny * ny);
      if (l === 0) continue;
      nx = (nx / l) * side; ny = (ny / l) * side;
      const q = /** @type {Point} */ ([p[0] + nx * d, p[1] + ny * d]);
      if (!wet(q[0], q[1])) { if (run.length >= 3) out.push(run); run = []; continue; }
      run.push(q);
    }
    if (run.length >= 3) out.push(run);
  }
  return out;
}
