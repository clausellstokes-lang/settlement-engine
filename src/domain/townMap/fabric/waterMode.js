/**
 * domain/townMap/fabric/waterMode.js — THE WATER-RELATIONSHIP LAW (§5.0b).
 *
 * ⭐ "HAS A RIVER" NEVER DEFAULTS TO "THE RIVER BISECTS THE TOWN."
 *
 * The reference generators' model-prior is default-bisection, and the chair recorded it
 * as a DEFECT TO OVERRIDE — it is on the standing critique list beside concentric drift
 * and sunburst fields. Historically, bridging or fording a river was among the most
 * expensive things a settlement could do, so a town that straddles its water EARNED
 * that, and the fabric must make it earn it here too.
 *
 * FOUR MODES, each with real fabric consequences:
 *   THROUGH   the river crosses the fabric; bridges become street continuations; wards
 *             split by bank. THE RAREST MODE, and it must be paid for.
 *   BANKSIDE  the town sits ON one bank; the waterfront is an EDGE (quays, mills, a
 *             water gate); the far bank stays countryside or holds a small bridgehead.
 *   NEAR      the river is a WALK away: the town sits on the rise or the road and is
 *             connected to its landing, mill or washing place by a lane. The water
 *             crosses the frame's COUNTRYSIDE, not the town.
 *   DRY       no watercourse: wells and cisterns gain prominence instead, and the well
 *             head becomes the thing the square is built around.
 *
 * WHAT PAYS FOR "THROUGH" — three things at once, because all three were needed in
 * reality: the traffic to justify a crossing (trade access), the population to build and
 * maintain one, and a river small enough at this point to bridge (the substrate's own
 * flow at the crossing). A metropolis on a major route straddles its river; a village on
 * the same river has a ford and sits on one side of it.
 *
 * ⭐ THE ONE-DECIDER RULE HOLDS: this module never decides WHETHER water exists. That is
 * siteGenesis's, through the landed model's `frame.water`. This decides only the
 * RELATIONSHIP, given that the water is there.
 *
 * DETERMINISM: pure; one bounded seeded roll on the near/bankside margin, from an
 * entity-keyed fork.
 */

import { fabricRng, keyedRandom } from './fabricRng.js';
import { chaikin, distToPolyline, ringIndex } from './fabricGeometry.js';
import { VIEW, sampleAt, drainageTrace, meanderChannel } from './substrate.js';
// ⚠ THE SHORE COMES FROM `relief.js` AND THE EDGE IS NEW — waterMode → relief → {substrate,
// umbrella, fabricGeometry, fabricRng}, all of which are upstream of waterMode already, so the
// fabric's module graph stays acyclic (pinned by derivationGraph.walker.test.js).
import { shoreContour } from './relief.js';

/**
 * ⭐⭐⭐ MF-PERF1 · WHERE THE WATER ACTUALLY RUNS — the DRAWN watercourse, lifted out of the
 * assembly and seated beside the relationship it is the input to.
 *
 * ⚠ IT IS A MOVE, NOT A CHANGE. Every line below stood in `buildFabric.js` stage 0 and is
 * carried across verbatim; the whole corpus is byte-identical across the move. It is here
 * because `buildFabric.js` stood at 791 effective lines against the 800 domain ceiling with
 * MF-W0's hazard note reading *"the next member added to the assembly breaks the ratchet"* —
 * and because this module is already the one home for what the water IS to this settlement.
 *
 * THE ONE-DECIDER RULE IS UNTOUCHED: `siteGenesis`, through the landed model's `frame.water`,
 * decides WHETHER there is water. The substrate decides WHERE. This composes the two.
 *
 * @param {Object} a
 * @param {any} a.modelWater  the LANDED model's `frame.water` — the only thing that says whether
 * @param {any} a.sub         the substrate (the heightfield the drainage and the shore come from)
 * @param {{seed:any, variant:number}} a.seeding
 * @param {number} a.builtRadius
 * @param {string} a.meanderKey  `fork('meander')` — composed by the assembly's ONE fork home
 * @returns {{kind:string, line:Array<[number,number]>, width:number, body?:any, seaShare?:number}|null}
 */
export function deriveWatercourse(a) {
  const { modelWater, sub, seeding, builtRadius, meanderKey } = a;
  const seed = seeding.seed, variant = seeding.variant;
  // ⭐ §5 W1 EXIT 6 · THE WORKED WATERFRONT. The settlement's own seat and reach, so the
  // detail scale of both the sea and the channel can be damped where the town works them.
  // ⚠ IT IS THE LANDED MODEL'S SKELETON ANCHOR, NOT THE DERIVED NUCLEUS, and the reason is
  // causal rather than convenient: the water is derived at STAGE 0 and the nucleus is found
  // by a suitability field that READS the water, so a damping keyed on the nucleus would be
  // a cycle. The anchor is the settlement's own seat as the landed model states it, which is
  // the best statement of "where the town is" that exists before the town does.
  // ⚠ AN ABSENT ANCHOR DAMPS NOTHING and says so — never a guessed centre (a wrong worked
  // reach would straighten the wrong stretch of shore, which is worse than a wild one).
  const worked = a.worked && Number.isFinite(a.worked.x) && Number.isFinite(a.worked.y)
    ? { x: a.worked.x, y: a.worked.y, r: builtRadius }
    : null;
  if (modelWater && modelWater.kind === 'river') {
    const trace = drainageTrace(sub);
    // ⭐⭐⭐ THE MEANDER LAW (chair directive §193.3). The trace is a D8 lattice walk, so its
    // bearings are eight compass directions and its turns are multiples of 45° — MEASURED,
    // 81% of this town's river lay within 4° of an axis, in one 692-unit ruled line. Chaikin
    // cannot cure that (smoothing a straight line returns a straight line); the channel has
    // to be given the meander its valley permits. See substrate.meanderChannel — and note it
    // SMOOTHS ONCE ITSELF, which is why there is no chaikin call left on this path.
    const width = 7 + builtRadius * 0.030;
    const line = trace.length >= 4
      ? meanderChannel(sub, trace, meanderKey, { width, worked })
      : meanderChannel(sub, (modelWater.path || []).map((p) => [p[0], p[1]]), meanderKey, { width, worked });
    return { kind: 'river', line, width, worked, workedReach: line.workedReach || null };
  }
  if (modelWater && modelWater.kind === 'coast') {
    // ⭐⭐ THE SEA IS A CONTOUR OF THE GROUND, NOT A RULED EDGE (§9.5b, relief.js's header).
    // The landed model's coast is a two-point path; jittering it produces a wobbly ruler
    // and, drawn as a stroke, an ocean that is invisible at a glance — which is precisely
    // what the fjord exemplar exposed. The substrate already knows where the low ground
    // is, so the shore is TRACED from it and the sea is a BODY. The one-decider rule is
    // untouched: the landed model still says WHETHER there is sea; this says only where it
    // reaches, exactly as the river has always done.
    const shore = shoreContour(sub, seeding, worked);
    if (shore) {
      return {
        kind: 'coast', line: shore.line, body: shore.body, width: 10, seaShare: shore.share,
        // §5 W1 exit 6's two scales and the damping measurement, carried out whole.
        coarse: shore.coarse, scales: shore.scales, detail: shore.detail, worked,
      };
    }
    // HONEST FALLBACK: ground with no low contour that reaches the frame has no sea to
    // draw. Recorded rather than invented — a straight ruled edge would be a fabrication.
    const base = (modelWater.path || []).map((p) => [p[0], p[1]]);
    /** @type {Array<[number,number]>} */ const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      // ⚠ THIS IS THE ONE SITE WHERE THE DROPPED SALT WAS **ACTIVE** RATHER THAN LATENT, and
      // MF-ARCH measured why: every other affected mechanic's INPUTS also carry the variant,
      // so its output moved at a reroll anyway. This fallback's input is the LANDED model's
      // two-point coast path, which is variant-invariant — so the jitter was identical at
      // every reroll. ⚠ THE CORPUS DOES NOT EXERCISE IT (every coastal leaf finds a shore
      // contour), so the cure is provable by construction and not by a moved sha.
      const jitter = (keyedRandom(seed, 'coast', 'jitter', i, { variant }) - 0.5) * 52;
      pts.push([
        base[0][0] + (base[1][0] - base[0][0]) * t,
        base[0][1] + (base[1][1] - base[0][1]) * t + jitter,
      ]);
    }
    return { kind: 'coast', line: chaikin(pts, 3, false), body: null, width: 10 };
  }
  return null;
}

/**
 * ⭐⭐⭐ §5 W1 EXIT 3 · `waterBearing` — THE BEARING THE WATER HOLDS ON THIS LEAF, **DERIVED
 * FROM SUBSTRATE GEOMETRY AND NEVER STORED.**
 *
 * ⛔⛔ WHY "DERIVED" IS THE WHOLE OF THE CRITERION AND NOT A COMPLIANCE DETAIL. A bearing
 * MINTED at generation and persisted would be a **seed-permanent world fact**, and THE
 * PROMISE governs those: a minted bearing is a claim about the world that can never
 * afterwards be wrong, and ODQ §251.5 already refused wind and sun bearings on exactly that
 * ground. `laneMFINT1-receipt.md` §3.2.3 refused the NEIGHBOUR bearing for the same reason —
 * *"a bearing does not exist anywhere in the dossier, and minting one is a seed-permanent
 * world fact under THE PROMISE."* ⭐ **THE WATER'S BEARING IS LAWFUL PRECISELY BECAUSE IT IS
 * NOT MINTED: it is a reading of ground that already exists**, so it cannot contradict a
 * later truth — if the ground changes, the reading changes with it, which is what a
 * derivation IS and what a stored fact can never be.
 *
 * THE TWO KINDS, and each reads the geometry the substrate produced:
 *   RIVER  the chord of the drawn channel, head to mouth. The channel is the drainage
 *          trace of the heightfield (`drainageTrace`), meandered and run out to the frame,
 *          so the bearing is the direction the LAND drains — not a hash and not a choice.
 *   COAST  the bearing from the dry ground's centroid to the sea body's centroid: the
 *          direction the water lies IN. The sea body is the traced level contour of the
 *          same heightfield (`shoreContour`), so this too is the ground speaking.
 *
 * ⚠ THE ANGLE IS COMPUTED WITHOUT RUNTIME TRIGONOMETRY (the purity law). `deg` is derived
 * from the unit vector by a rational octant reduction with a fixed-order polynomial for
 * `atan` on [0,1] — `+ − × ÷` only, cross-machine identical.
 * ⚠ `deg` IS A COMPASS BEARING IN THE VIEW FRAME: 0 = toward the top of the leaf (−y), 90 =
 * toward the right (+x), clockwise. Stated because a y-down frame inverts the intuition.
 *
 * @param {{kind:string, line:Array<[number,number]>, body?:any}|null} water
 * @param {import('./substrate.js').Substrate} sub
 * @returns {{ kind:string, deg:number, dx:number, dy:number, chord:number,
 *   from:[number,number], to:[number,number], source:string, reason:string }|null}
 */
export function waterBearing(water, sub) {
  if (!water) return null;
  /** @type {[number,number]} */ let from;
  /** @type {[number,number]} */ let to;
  let source;
  if (water.kind === 'coast' && water.body && water.body.length >= 3) {
    // The sea's own centroid against the DRY ground's centroid. Both are read off the
    // traced contour, so a leaf whose height field moves moves both.
    const sea = polyCentroid(water.body);
    const dry = dryCentroid(sub, water.body);
    from = dry; to = sea;
    source = 'the dry ground\'s centroid to the traced sea body\'s centroid';
  } else if (water.line && water.line.length >= 2) {
    from = [water.line[0][0], water.line[0][1]];
    to = [water.line[water.line.length - 1][0], water.line[water.line.length - 1][1]];
    source = water.kind === 'coast'
      ? 'the traced shore line\'s own chord (no sea body: the declared fallback)'
      : 'the drawn channel\'s chord, headwater to mouth';
  } else {
    return null;
  }
  const vx = to[0] - from[0], vy = to[1] - from[1];
  const chord = Math.sqrt(vx * vx + vy * vy);
  if (chord < 1e-9) return null;
  const ux = vx / chord, uy = vy / chord;
  const deg = compassDeg(ux, uy);
  return {
    kind: water.kind,
    deg,
    dx: ux,
    dy: uy,
    chord,
    from,
    to,
    source,
    reason: `§5 W1 exit 3 · waterBearing ${deg.toFixed(1)}° (compass, y-down frame): `
      + `${source}. DERIVED from the substrate's own geometry on every read and never stored `
      + '— a minted bearing would be a seed-permanent world fact under THE PROMISE (§251.5).',
  };
}

/** Area-weighted centroid of a closed ring. */
function polyCentroid(ring) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length];
    const f = p[0] * q[1] - q[0] * p[1];
    a += f; cx += (p[0] + q[0]) * f; cy += (p[1] + q[1]) * f;
  }
  if (Math.abs(a) < 1e-12) {
    let sx = 0, sy = 0;
    for (const p of ring) { sx += p[0]; sy += p[1]; }
    return /** @type {[number,number]} */ ([sx / ring.length, sy / ring.length]);
  }
  return /** @type {[number,number]} */ ([cx / (3 * a), cy / (3 * a)]);
}

/** The centroid of the cells the sea body does NOT cover — the land's own middle. */
function dryCentroid(sub, body) {
  const idx = ringIndex(body);
  let sx = 0, sy = 0, n = 0;
  for (let j = 0; j < sub.n; j++) {
    for (let i = 0; i < sub.n; i++) {
      const x = (i + 0.5) * sub.cell, y = (j + 0.5) * sub.cell;
      if (idx.contains(x, y)) continue;
      sx += x; sy += y; n++;
    }
  }
  if (!n) return /** @type {[number,number]} */ ([VIEW / 2, VIEW / 2]);
  return /** @type {[number,number]} */ ([sx / n, sy / n]);
}

/**
 * A compass bearing in degrees from a unit vector, with NO runtime trigonometry.
 * 0 = −y (up the page), 90 = +x, clockwise. `atanUnit` is a fixed 5-term odd polynomial on
 * [0,1], accurate to ~1e-4 rad, which is far finer than any decision taken on this figure.
 */
function compassDeg(ux, uy) {
  // Convert to (east, north) with north = −y, then reduce to an octant.
  const e = ux, nn = -uy;
  const ae = e < 0 ? -e : e, an = nn < 0 ? -nn : nn;
  const t = ae <= an ? (an === 0 ? 0 : ae / an) : (ae === 0 ? 0 : an / ae);
  const a = atanUnit(t) * (180 / Math.PI);
  let d = ae <= an ? a : 90 - a;               // angle from the nearer axis, 0..45 → 0..90
  if (nn >= 0 && e >= 0) d = d;                // NE quadrant
  else if (nn < 0 && e >= 0) d = 180 - d;      // SE
  else if (nn < 0 && e < 0) d = 180 + d;       // SW
  else d = 360 - d;                            // NW
  return d >= 360 ? d - 360 : d;
}

/** atan(t) for t in [0,1], odd polynomial, `+ − × ÷` only. */
function atanUnit(t) {
  const t2 = t * t;
  return t * (0.9998660 + t2 * (-0.3302995 + t2 * (0.1801410 + t2 * (-0.0851330 + t2 * 0.0208351))));
}

/** The four modes. @type {ReadonlyArray<'through'|'bankside'|'near'|'dry'>} */
export const WATER_MODES = Object.freeze(['through', 'bankside', 'near', 'dry']);

/**
 * THE CROSSING BUDGET — what a settlement must muster before its fabric may straddle a
 * watercourse. §42/§43 VALUES, PROPOSED-WITH-RATIONALE; each is an argument:
 *
 *  popFloor    a bridge is a public work. Below town scale the settlement is a ford or a
 *              ferry, not a bridge town — so the floor sits at the town population band.
 *  routeFloor  0..1 from tradeRouteAccess. Nobody bridges a river for local traffic; the
 *              crossing exists because a ROUTE needed it, which is also why crossing
 *              towns are so often named for their crossing.
 *  flowCeiling the substrate's own flow at the crossing point. A trunk river at full
 *              accumulation is a different engineering problem from a tributary, and the
 *              settlement that straddles the big one has to be very large indeed.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const CROSSING_BUDGET = Object.freeze({
  popFloor: 900,
  routeFloor: 0.55,
  flowCeiling: 0.86,
});

/** tradeRouteAccess → 0..1 crossing justification. */
const ROUTE_WEIGHT = Object.freeze({
  none: 0, isolated: 0, poor: 0.15, limited: 0.25, moderate: 0.5, road: 0.5,
  river: 0.72, good: 0.68, port: 0.7, crossroads: 0.95, major: 0.9,
  excellent: 0.88, critical: 1,
});

/** How close the nucleus must sit to the channel to count as BANKSIDE rather than NEAR,
 * as a fraction of the frame. A town is "on" its river when its market can smell it. */
export const BANKSIDE_REACH = 0.085;

/**
 * @typedef {Object} WaterRelationship
 * @property {'through'|'bankside'|'near'|'dry'} mode
 * @property {string|null} kind             'river' | 'coast' | null (the landed water kind)
 * @property {Array<[number,number]>|null} line   the watercourse in view space
 * @property {number} width
 * @property {[number, number]|null} crossing     where the fabric meets the water
 * @property {number} bankSide              +1 / −1: which side of the line the town sits
 * @property {string} reason
 * @property {{ population:number, route:number, flow:number, distance:number }} inputs
 */

/**
 * Derive the water relationship.
 *
 * @param {{ kind: string, line: Array<[number,number]>, width: number } | null} water
 *        the watercourse geometry (from the landed frame.water, meandered)
 * @param {{ x: number, y: number }} nucleus
 * @param {any} settlement
 * @param {import('./substrate.js').Substrate} sub
 * @param {{ seed: string|number, variant?: number }} seeding
 * @returns {WaterRelationship}
 */
export function deriveWaterMode(water, nucleus, settlement, sub, seeding) {
  // ⭐ §5 W1 EXIT 6 · THE TWO-SCALE ROWS TRAVEL WITH THE RELATIONSHIP.
  // ⛔ THE RELATIONSHIP IS A NEW OBJECT, NOT A DECORATION OF THE WATERCOURSE, and every row
  // the watercourse carries has to be carried across BY NAME or it is silently dropped —
  // which is exactly what happened to `scales`, `coarse`, `detail` and `worked` on their
  // first run: the census printed an EMPTY two-scale section and nothing failed. ⭐ THE
  // CLASS: **a rebuild-into-a-new-object is a whitelist, and a row nobody added to the
  // whitelist reads as a feature that was never built.**
  const carried = water ? {
    coarse: water.coarse || null,
    scales: water.scales || null,
    detail: water.detail || null,
    worked: water.worked || null,
    workedReach: water.workedReach || null,
  } : { coarse: null, scales: null, detail: null, worked: null, workedReach: null };
  const population = Number.isFinite(settlement?.population) ? Number(settlement.population) : 0;
  const access = String(settlement?.config?.tradeRouteAccess || '').toLowerCase();
  const route = ROUTE_WEIGHT[access] == null ? 0.5 : ROUTE_WEIGHT[access];

  if (!water || !Array.isArray(water.line) || water.line.length < 2) {
    return {
      ...carried,
      mode: 'dry',
      kind: null,
      line: null,
      width: 0,
      crossing: null,
      bankSide: 1,
      reason: 'no watercourse in the frame — the settlement lives on wells and cisterns, and its well head carries the prominence a landing would have had',
      inputs: { population, route, flow: 0, distance: Infinity },
    };
  }

  // The nearest point of the watercourse to the nucleus — the settlement's own reach to
  // its water, and the crossing candidate.
  let nearest = water.line[0], best = Infinity;
  for (const p of water.line) {
    const dx = p[0] - nucleus.x, dy = p[1] - nucleus.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < best) { best = d; nearest = p; }
  }
  const distance = distToPolyline(nucleus.x, nucleus.y, water.line);
  const flow = sampleAt(sub, sub.flow, nearest[0], nearest[1]);

  // Which side of the water the nucleus sits on — a stable sign from the cross product
  // against the local channel direction. Every bankside decision downstream reads it.
  let bankSide = 1;
  {
    let bi = 0, bd = Infinity;
    for (let i = 0; i < water.line.length; i++) {
      const dx = water.line[i][0] - nucleus.x, dy = water.line[i][1] - nucleus.y;
      const d = dx * dx + dy * dy;
      if (d < bd) { bd = d; bi = i; }
    }
    const a = water.line[Math.max(0, bi - 1)], b = water.line[Math.min(water.line.length - 1, bi + 1)];
    const cross = (b[0] - a[0]) * (nucleus.y - a[1]) - (b[1] - a[1]) * (nucleus.x - a[0]);
    bankSide = cross >= 0 ? 1 : -1;
  }

  // A coast is never crossed and never "near" in the river sense: the town is ON its
  // shore or it is not a coastal town.
  if (water.kind === 'coast') {
    return {
      ...carried,
      mode: 'bankside',
      kind: 'coast',
      line: water.line,
      // ⭐ THE BODY, carried from the shore contour (§9.5b). A coast that travels as a LINE
      // can only ever be drawn as a line, which is how a fjord town came to be rendered
      // with no sea in it. The region travels with the relationship so that every consumer
      // — the "is this water" absolute, the wall's half-ring, the lens — asks the same
      // polygon rather than each re-deriving a side test from the same open polyline.
      body: water.body || null,
      width: water.width,
      crossing: null,
      bankSide,
      reason: 'coastal: the shore is an EDGE, not a division — quays and the water gate face it and the fabric stops at the tide line',
      inputs: { population, route, flow, distance },
    };
  }

  const earnsCrossing = population >= CROSSING_BUDGET.popFloor
    && route >= CROSSING_BUDGET.routeFloor
    && flow <= CROSSING_BUDGET.flowCeiling;

  if (earnsCrossing) {
    return {
      ...carried,
      mode: 'through',
      kind: 'river',
      line: water.line,
      width: water.width,
      crossing: [nearest[0], nearest[1]],
      bankSide,
      reason: `EARNED a crossing: ${population} souls on a ${access || 'road'} route at a bridgeable reach (flow ${flow.toFixed(2)}) — the bridge is the reason the town is here, and the streets continue across it`,
      inputs: { population, route, flow, distance },
    };
  }

  if (distance <= VIEW * BANKSIDE_REACH) {
    return {
      ...carried,
      mode: 'bankside',
      kind: 'river',
      line: water.line,
      width: water.width,
      crossing: [nearest[0], nearest[1]],
      bankSide,
      reason: `bankside: the fabric reaches the water (${Math.round(distance)} units) but never pays for a crossing — a working waterfront on one side, countryside on the other`,
      inputs: { population, route, flow, distance },
    };
  }

  // NEAR — and it is a seeded margin, because the difference between "a short walk" and
  // "on the bank" is a matter of where the good ground happened to be.
  const rng = fabricRng(seeding.seed, 'water-mode', { variant: seeding.variant });
  const margin = rng.range(0.9, 1.35);
  if (distance <= VIEW * BANKSIDE_REACH * margin) {
    return {
      ...carried,
      mode: 'bankside',
      kind: 'river',
      line: water.line,
      width: water.width,
      crossing: [nearest[0], nearest[1]],
      bankSide,
      reason: `bankside by a margin: the settlement sits ${Math.round(distance)} units from the channel — close enough that its yards run down to the bank`,
      inputs: { population, route, flow, distance },
    };
  }

  return {
    ...carried,
    mode: 'near',
    kind: 'river',
    line: water.line,
    width: water.width,
    crossing: [nearest[0], nearest[1]],
    bankSide,
    reason: `near: the water is ${Math.round(distance)} units off — the town sits on the rise or the road and reaches its landing and mill by a lane; the river crosses the COUNTRYSIDE, not the town`,
    inputs: { population, route, flow, distance },
  };
}

/**
 * Is a point on the far bank — the side the settlement did NOT grow on? BANKSIDE and
 * NEAR growth refuse the far side entirely (that is what the mode MEANS); THROUGH
 * permits it. This is the predicate the organism accretion consults.
 * @param {WaterRelationship} rel @param {number} x @param {number} y @returns {boolean}
 */
export function isFarBank(rel, x, y) {
  if (!rel.line || rel.mode === 'through' || rel.mode === 'dry') return false;
  // ⛔ A SEA HAS NO FAR BANK INSIDE THE FRAME. Running the side test against a TRACED
  // coastline reports every headland beyond the nearest shore segment as "the far bank" and
  // forbids the settlement from growing along its own peninsula. For a coast the only
  // absolute is the water itself.
  if (rel.kind === 'coast') return isInWater(rel, x, y);
  let bi = 0, bd = Infinity;
  for (let i = 0; i < rel.line.length; i++) {
    const dx = rel.line[i][0] - x, dy = rel.line[i][1] - y;
    const d = dx * dx + dy * dy;
    if (d < bd) { bd = d; bi = i; }
  }
  const a = rel.line[Math.max(0, bi - 1)], b = rel.line[Math.min(rel.line.length - 1, bi + 1)];
  const cross = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
  return (cross >= 0 ? 1 : -1) !== rel.bankSide;
}

/** Is a point IN the channel? Nothing is ever built there, in any mode.
 * @param {WaterRelationship} rel @param {number} x @param {number} y @returns {boolean} */
export function isInWater(rel, x, y) {
  if (!rel.line) return false;
  if (rel.kind === 'coast') {
    // ⚠ THE BODY'S BOUNDING BOX, MEMOIZED ON THE RELATIONSHIP ITSELF. This predicate is
    // called once per candidate plot, once per field cell and four times per drawn land, so
    // on a coastal city it runs hundreds of thousands of times against a traced shoreline of
    // many vertices — MEASURED at 0.52 s of a city build. A point outside the body's bbox is
    // outside the body, exactly, so the guard changes no answer anywhere.
    if (rel.body && rel.body.length >= 3) {
      let bb = rel.__bodyBox;
      if (!bb) {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const p of rel.body) {
          if (p[0] < x0) x0 = p[0];
          if (p[1] < y0) y0 = p[1];
          if (p[0] > x1) x1 = p[0];
          if (p[1] > y1) y1 = p[1];
        }
        bb = { x0, y0, x1, y1 };
        // Non-enumerable so the memo never reaches a hash, a golden or a serialization —
        // a cache that changes an object's own key set is a determinism hazard.
        Object.defineProperty(rel, '__bodyBox', { value: bb, enumerable: false, writable: false });
      }
      if (x < bb.x0 || x > bb.x1 || y < bb.y0 || y > bb.y1) return false;
    }
    // ⭐ THE BODY IS THE ANSWER WHEN THERE IS ONE. The side test below is a fallback that
    // is only correct for a shore that is roughly a straight edge — on a traced coastline
    // with a deep cove it reports the whole headland as sea, because "the far side of the
    // nearest segment" is not a containment test. A polygon knows what is inside it.
    // ⭐ THE BODY'S OWN Y-BANDED INDEX, memoized beside the bbox and under the same rule:
    // NON-ENUMERABLE, so a cache can never reach a hash, a golden or a serialization.
    if (rel.body && rel.body.length >= 3) {
      let ix = rel.__bodyIdx;
      if (!ix) {
        ix = ringIndex([rel.body]);
        Object.defineProperty(rel, '__bodyIdx', { value: ix, enumerable: false, writable: false });
      }
      return ix.contains(x, y);
    }
    return isFarBankRaw(rel, x, y);
  }
  return distToPolyline(x, y, rel.line) < rel.width * 0.62;
}

/** Even-odd point-in-ring, local (the sea body is emphatically not convex). */
function pointInRing(poly, px, py) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if ((yi > py) !== (yj > py)) {
      const x = (xj - xi) * (py - yi) / (yj - yi) + xi;
      if (px < x) inside = !inside;
    }
  }
  return inside;
}

/** The raw side test, used by the coast case where "far bank" IS the water. */
function isFarBankRaw(rel, x, y) {
  let bi = 0, bd = Infinity;
  for (let i = 0; i < rel.line.length; i++) {
    const dx = rel.line[i][0] - x, dy = rel.line[i][1] - y;
    const d = dx * dx + dy * dy;
    if (d < bd) { bd = d; bi = i; }
  }
  const a = rel.line[Math.max(0, bi - 1)], b = rel.line[Math.min(rel.line.length - 1, bi + 1)];
  const cross = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
  return (cross >= 0 ? 1 : -1) !== rel.bankSide;
}
