/**
 * domain/townMap/fabric/partitionState.js — ⭐⭐⭐ CAR-STATE-BRIDGE · **THE §10 MARKS TAKE THEIR
 * PLACES ON THE PARTITION** (ODQ §710.6).
 *
 * ⭐⭐ WHAT THIS FILE IS FOR, AND THE READER WHO FOUND IT. DRESS-2 W1 carried `fabric.stateMarks`
 * across the bridge to the dress page and every census it wrote came back green. A fresh-context
 * reader with no project knowledge convicted it in one pass, of the siege and plague plates:
 *
 *   *"three short parallel black strokes float in open country north-west of the wall, touching
 *    nothing, at no gate, no road, no building… I cannot assign it a meaning."*
 *
 * ⭐⭐ **THE CLASS: EVERY CENSUS THAT WAVE WROTE ASKED WHETHER THE MARK EXISTS. NOT ONE ASKED
 * WHETHER IT IS ON THE THING IT MEANS.** A count, a roster bijection and a tone ratio are all
 * satisfied by ink in the wrong place.
 *
 * ⛔⛔ THE CAUSE, MEASURED. `deriveStateMarks` anchors on the LEGACY fabric — `walls[].gates`,
 * `web.roads`, `meta.centre`, `meta.builtRadius` — while the dress page draws the PARTITION's wall
 * band, ways and water. Same coordinate space, DIFFERENT GEOMETRY. At `c4d772590`:
 *   siege        9 tents derived, **0 inside the fitted page**
 *   siege        barredGate **81.5 u from the nearest DRAWN band = 16.1 road widths**
 *   plague       one quarantineBar off-page, the other 16.1 rw out
 *   migration    2 of 4 watch-fires off-page and **1 of 4 inside the water polygon**
 *   city         **12 of 12 camp huts INSIDE the coast polygon** — the reader saw them in the bay
 *   famine       6 empty stalls, ALL on the page and ALL correctly placed
 * ⭐ **THE FAMINE ROW IS THE CONTROL THAT PROVES THE DIAGNOSIS.** Its stalls anchor to the market,
 * which BOTH geometries put in the same place. The one family anchored to something the two
 * surfaces agree about is the one family that lands correctly — so it is NOT MOVED here (below).
 *
 * ═══ ⭐⭐⭐ WHY THIS FILE EXISTS RATHER THAN A FIX IN EITHER OBVIOUS PLACE ═══
 * §710.6 recorded two cures and ruled both outside a dress car's boundary:
 *   (a) re-derive `fabric.stateMarks` against the partition — but `renderFolio` §15b and
 *       `groundRefusal`'s drawn-body census also consume it, so the shipped corpus render moves
 *       and the folio dormancy claim goes with it;
 *   (b) re-anchor at DRAW time in `partitionDress` — a renderer deciding where a world fact
 *       belongs, which `partitionView`'s own law forbids outright.
 * ⭐⭐ **THERE IS A THIRD LAYER AND THIS TREE ALREADY HAS ITS PRECEDENT.** `partitionSeating.js`
 * is a DOMAIN pass that READS the projected page and decides where institutions sit; it is called
 * beside `projectPage` and handed to the dress as plain data. This file is its sibling for the §10
 * register. `fabric.stateMarks` is READ AND NEVER WRITTEN, so folio dormancy holds **by
 * construction rather than by argument**; and the renderer still decides nothing, because a domain
 * pass at the seating layer decides — which is where page-aware placement already lives.
 *
 * ═══ ⭐⭐ THE ONE LAW, STATED ONCE FOR EVERY OUTWARD FAMILY ═══
 * **A family's NEAR EDGE stands at its own §10 standoff beyond the DRAWN gate, along the drawn
 * outward normal, on ground the map actually shows.** Every standoff below is `stateMarks.js`'s
 * own pair, re-read against `page.bound.radius` — the settlement's own drawn extent — instead of
 * against `meta.builtRadius`, which is a LEGACY quantity 1.7× larger on `siege` (323.7 vs 185.9).
 * ⛔ **NO CONSTANT IS MINTED HERE.** Every number is either (a) `stateMarks.js`'s own, re-read
 * against the drawn bound, or (b) a PULL in `partitionSeating`'s own weights-not-walls idiom.
 *
 * ⭐ AND THE FAMILY'S SHAPE IS TRANSFORMED, NEVER RE-DERIVED. Each body/mark family is moved by a
 * RIGID transform — rotation plus translation — from the legacy anchor frame to the drawn one, so
 * every per-tent decision the fabric made (jitter, size, row spacing, bearing) is carried across
 * verbatim. The bridge decides WHERE THE ANCHOR IS; the fabric still decides the mark. That is
 * also why this module opens no random stream and mints no fork key: there is nothing to re-roll.
 *
 * PURITY: pure functions. No Date, no Math.random, no rng of any kind, no runtime trig
 * (`bearingIndex` reads the frozen table), no localeCompare.
 */

import { pointInPolygon, distToSegment, bearingIndex } from './fabricGeometry.js';

export const PARTITION_STATE_SCHEMA_VERSION = 1;

/**
 * ⭐⭐ THE §10 STANDOFFS, EACH COPIED FROM `stateMarks.js`'s OWN SITE AND RE-READ AGAINST THE
 * DRAWN BOUND. `frontages` and `radiusShare` are the two arms of the `Math.max` the shipped
 * derivation already takes; only the radius it is a share OF changes, from the legacy built
 * radius to the radius the page is actually fitted to.
 * @type {Readonly<Record<string,{frontages:number, radiusShare:number, cite:string}>>}
 */
export const STATE_STANDOFF = Object.freeze({
  siegeCamp: { frontages: 5, radiusShare: 0.16, cite: '§10.12 — a besieging camp stood beyond bowshot of the walls' },
  lazar: { frontages: 8, radiusShare: 0.22, cite: '§10.13 — the lazar house is held far out beyond the last gate' },
  watchFire: { frontages: 3, radiusShare: 0.10, cite: '§10.15 — watch-fires where the roads come in' },
  gateCamp: { frontages: 3.5, radiusShare: 0.09, cite: '§10.A11 — a migrant camp outside the busiest gate' },
  trampled: { frontages: 0, radiusShare: 0.30, cite: '§10.12 — the fields on the approach the war comes by' },
});

/**
 * ⭐ EVERY §10 KIND THIS MODULE CAN RECEIVE, RULED — anchored-here, or NOT MOVED with a reason.
 * A kind with no row would be silently passed through, which is exactly the silence `stateMarks`'
 * own `STRESSOR_DISPOSITION` exists to prevent one layer up. The roster is walked by the gate.
 * @type {Readonly<Record<string,{family:string, reason:string}>>}
 */
export const STATE_ANCHOR_DISPOSITION = Object.freeze({
  // ── the outward families: their anchor is a GATE and their meaning is "outside it"
  tent: { family: 'siegeCamp', reason: 'the besiegers stand off the invested gate' },
  camphut: { family: 'gateCamp', reason: 'the migrant camp stands outside the busiest gate' },
  lazar: { family: 'lazar', reason: 'the lazar house is held out beyond a gate' },
  watchFire: { family: 'watchFire', reason: 'a kept fire where an approach road comes in' },
  trampled: { family: 'trampled', reason: 'the field the war crossed, on the approach' },
  // ── the AT-gate families: the whole meaning is "this gate is shut"
  barredGate: { family: 'gateOne', reason: '§10.12 bars the ONE gate the besieger invests' },
  quarantineBar: { family: 'gateAll', reason: '§10.13 bars EVERY gate against the pestilence' },
  // ── the in-town families
  barricade: { family: 'lane', reason: 'a barricade stands ACROSS a lane in the least-ordered quarter' },
  billet: { family: 'seat', reason: 'an occupier quarters itself on the government — beside the seated institution' },
  // ── ⛔ NOT MOVED, AND THE REASON IS A MEASUREMENT, NOT A PREFERENCE.
  //    `page.voids` is **100 % `court`** on every leaf of the corpus — the partition publishes NO
  //    market face at all, so there is nothing on this surface for a market mark to anchor to.
  //    The legacy `web.squares[0]` is the only market EITHER geometry has, and it is the one both
  //    surfaces put in the same place: it is why famine was the control that proved the diagnosis.
  //    Moving it would break the control and could not improve the placement. → REPORTED.
  emptyStall: { family: 'market', reason: 'NOT MOVED — the partition publishes no market face; the legacy market is the anchor both geometries agree about' },
  publicWork: { family: 'market', reason: 'NOT MOVED — as emptyStall: the public work stands on the same market place' },
});

/** The families whose members are NOT re-anchored, by name, so the walker can state the split. */
export const UNMOVED_FAMILIES = Object.freeze(['market']);

/**
 * ⭐⭐ GROUND IS PHYSICAL AND OUTRANKS EVERY PREFERENCE — `partitionSeating.PHYSICAL_PULL`
 * restated for this pass. *"A quay is on the water or it is not a quay"*; a tent is on land or it
 * is not a tent. It is a PULL and not a refusal, so a leaf with nowhere good still places its
 * marks somewhere statable and the census reports the shortfall rather than the mark vanishing.
 */
export const GROUND_PULL = 1000;

/** The road an army — or a war, or a migration — comes by is the biggest road. A weight. */
export const ARTERY_PULL = 1;

/**
 * ⭐⭐ A GATE OF THE DRAWN CIRCUIT IS A GATE; A WAY FACE CARRYING THE FLAG WITH NO WALL BESIDE IT
 * IS A STREET. Strong — it is what "the gate it invests" means — but UNDER `GROUND_PULL`, because
 * an army with a proper gate and no ground is still an army with nowhere to camp. Weights, never
 * walls (§640.3): a leaf whose only roomy approach is uncircuited still places its camp, and the
 * census says so rather than the mark vanishing.
 */
export const CIRCUIT_PULL = 10;

/**
 * ⭐⭐ **HOW FAR FROM THE DRAWN WALL A GATE MAY STAND AND STILL BE A GATE OF IT — ONE PREDICATE,
 * ONE HOME.** Stated in ROAD WIDTHS for §179's reason: a gate passage is about a road wide at
 * every tier, so a mark that means *"this gate is shut"* has to sit within a couple of road widths
 * of the drawn wall to mean it. `statePlacementCensus` IMPORTS this rather than spelling it again
 * (§262.2(a) / G-34: a second spelling is free to drift from the first).
 *
 * ⛔ AND THE EXACT TEST WAS TRIED FIRST AND FOUND TOO NARROW, WHICH IS WORTH THE ROOM. The
 * partition is planar, so a gate face seated IN a band face shares its edge and the face-to-band
 * distance is **exactly 0.000000** — measured, **40 of 49 corpus gates read exactly zero** and the
 * other nine read 2.7–63.5 units. It is a beautiful test and it convicts the right leaves
 * (`metropolis` f1379 stands **12.0 road widths** from any wall). But `siege` f441 reads 6.6 u —
 * **1.3 road widths, visually AT the wall** — because the drawn circuit is FRAGMENTED into 15 band
 * faces and that gate falls in a gap between two of them. An exact-adjacency rule calls a gate in
 * a gap "not a gate", which is a fact about the band's fragmentation and not about the town. So
 * the operative predicate is the METRIC one and the exact figure is published beside it.
 */
export const GATE_BAND_REACH_RW = 3;

/**
 * ⭐ CARRY THE FABRIC'S OWN CHOICE ACROSS THE BRIDGE WHERE THE GROUND ALLOWS. `stateMarks` already
 * chose WHICH gate is invested; re-choosing it from scratch would be this pass forming a second
 * opinion about a decision the truth layer already took. So proximity to the legacy anchor is a
 * pull — under ground, over nothing.
 */
export const PROXIMITY_PULL = 0.5;

const inAnyRing = (p, rings) => {
  for (const r of rings) if (pointInPolygon(p[0], p[1], r)) return true;
  return false;
};

const dToRings = (p, rings) => {
  let best = Infinity;
  for (const r of rings) {
    for (let i = 0; i < r.length; i++) {
      const a = r[i]; const b = r[(i + 1) % r.length];
      const d = distToSegment(p[0], p[1], a[0], a[1], b[0], b[1]);
      if (d < best) best = d;
    }
  }
  return best;
};

const ringsOf = (list) => (list || []).map((o) => o && o.ring).filter((r) => Array.isArray(r) && r.length > 2);

/**
 * ⭐⭐⭐ THE PAGE READ — every anchor the §10 register can want, taken off the PROJECTED PAGE and
 * nothing else. It takes no partition module: a page frame is plain data, which is what keeps this
 * file's node in the stage manifest free of new edges.
 *
 * ⚠ THE APPROACH ROSTER FALLS BACK TO THE ARTERIES WHEN A LEAF HAS NO DRAWN GATE, and that is the
 * shipped derivation's own fallback restated: *"where a settlement has no circuit the roads' own
 * exits stand in for gates — a camp invests the way IN, walled or not."* Measured: `thorp` draws
 * **0 gates, 0 band faces and exactly 1 artery way**, so without this arm its one mark has no
 * anchor at all.
 *
 * @param {any} page a `PARTITION_PAGE_FRAME` from `projectPage`
 * @param {{frontage?:number, roadWidth?:number}} [facts]
 */
export function stateAnchorReader(page, facts = {}) {
  const bound = (page && page.bound) || { cx: 0, cy: 0, radius: 1 };
  const R = bound.radius > 0 ? bound.radius : 1;
  const cx = bound.cx; const cy = bound.cy;
  const frontage = Number.isFinite(facts.frontage) && facts.frontage > 0 ? facts.frontage : R * 0.02;
  const rw = Number.isFinite(facts.roadWidth) && facts.roadWidth > 0 ? facts.roadWidth : R * 0.03;

  const bandRings = ringsOf(page.band);
  const waterRings = ringsOf(page.water);
  const fieldRings = ringsOf(page.fields);
  const wayRings = ringsOf(page.ways);
  const laneRings = ringsOf((page.ways || []).filter((w) => w.rank === 'lane' || w.rank === 'street'));
  const massRings = ringsOf(page.masses);

  /** @type {Array<{face:number, rank:string, at:number[], out:{dx:number,dy:number}, dGate:number}>} */
  const approaches = [];
  for (const g of (page.gates || [])) {
    if (!Array.isArray(g.at) || !Number.isFinite(g.at[0])) continue;
    const dx = g.at[0] - cx; const dy = g.at[1] - cy;
    const L = Math.sqrt(dx * dx + dy * dy) || 1;
    // ⭐⭐ IS THIS A GATE OF THE DRAWN CIRCUIT, OR ONLY A WAY FACE THAT CARRIES THE FLAG? The
    //   question has an EXACT answer and no dial: the partition is planar, so a gate face
    //   adjacent to the band SHARES ITS EDGE and the face-to-band distance is **0.000000**.
    //   Measured over the corpus, 40 of 49 drawn gates read exactly zero and the other nine read
    //   2.7–63.5 units — `metropolis` f1379 stands **12.0 road widths from any wall**. A bar drawn
    //   across such a "gate" is three strokes in a street, which is the very reading that
    //   convicted this register in the first place.
    const wf = (page.ways || []).find((w) => w.face === g.face);
    let faceToBand = Infinity;
    if (wf && Array.isArray(wf.ring)) {
      for (const v of wf.ring) { const d = dToRings(v, bandRings); if (d < faceToBand) faceToBand = d; }
    }
    approaches.push({
      face: g.face, rank: g.rank || 'street', at: [g.at[0], g.at[1]],
      out: { dx: dx / L, dy: dy / L }, dGate: L,
      ring: (wf && Array.isArray(wf.ring)) ? wf.ring : null,
      inCircuit: bandRings.length ? dToRings([g.at[0], g.at[1]], bandRings) <= rw * GATE_BAND_REACH_RW : true,
      /** ⭐ the EXACT adjacency figure, published beside the operative predicate — see the note on
       *  `GATE_BAND_REACH_RW`. `0` means the gate face shares an edge with a drawn band face. */
      faceToBand,
      bandReachRw: bandRings.length ? dToRings([g.at[0], g.at[1]], bandRings) / rw : 0,
    });
  }
  if (!approaches.length) {
    // the arteries' own outward tips — the way OUT of an unwalled place
    for (const w of (page.ways || [])) {
      if (w.rank !== 'artery' || !Array.isArray(w.ring) || w.ring.length < 3) continue;
      // ⛔ WHERE THE ROAD LEAVES THE SETTLEMENT, NOT WHERE IT ENDS. The first spelling took the
      //   ring's furthest vertex, and a way face runs to the FRONTIER — measured, `thorp`'s
      //   artery reaches well past its own bound, so every mark hung off it landed off the page
      //   and its `onGround` read 0.00. The gate a wall would have drawn is the point at which
      //   the road crosses the settlement's own extent, so that is the point taken here.
      let best = null; let bd = -1;
      for (const p of w.ring) {
        const d = Math.hypot(p[0] - cx, p[1] - cy);
        if (d <= R && d > bd) { bd = d; best = p; }
      }
      if (!best) {
        // the whole face lies beyond the bound: take its nearest vertex, which is the crossing
        let nd = Infinity;
        for (const p of w.ring) {
          const d = Math.hypot(p[0] - cx, p[1] - cy);
          if (d < nd) { nd = d; best = p; }
        }
      }
      if (!best) continue;
      const dx = best[0] - cx; const dy = best[1] - cy;
      const L = Math.sqrt(dx * dx + dy * dy) || 1;
      // A leaf with no drawn band has no circuit to be in or out of; the way IS the way in.
      approaches.push({
        face: w.face, rank: 'artery', at: [best[0], best[1]], out: { dx: dx / L, dy: dy / L },
        dGate: L, ring: w.ring, inCircuit: !bandRings.length, faceToBand: bandRings.length ? dToRings(best, bandRings) : 0,
      });
    }
  }
  // A total order before any argmax runs — face id breaks every tie, as the seating pass does.
  approaches.sort((a, b) => a.face - b.face);

  const onLand = (p) => !inAnyRing(p, waterRings);
  const inDisc = (p) => Math.hypot(p[0] - cx, p[1] - cy) <= R;
  /** ⚠ THE PAGE, NOT THE DISC. `frame` is the square the fit inscribes the disc in, so its corners
   *  reach R√2 — a mark can be DRAWN and yet outside the settlement's own extent. Reading the
   *  frame to ask *"is this drawn?"* is not a framing decision; widening it would be, and §710.4
   *  puts that on the owner's docket. */
  const F = (page && page.frame) || { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R };
  const inFrame = (p) => p[0] >= F.x && p[0] <= F.x + F.w && p[1] >= F.y && p[1] <= F.y + F.h;
  const inField = (p) => inAnyRing(p, fieldRings);
  const inWay = (p) => inAnyRing(p, wayRings);
  /** ⭐ INTRAMURAL, IN `partitionSeating`'s OWN SPELLING: inside any circuit's INNER ring. */
  const innerRings = ((page && page.wraps) || [])
    .map((w) => w && w.inner).filter((r) => Array.isArray(r) && r.length > 2);
  const extramural = (p) => !inAnyRing(p, innerRings);
  /** the drawn ground a mark may stand on: on land, inside the extent the page draws, off the road */
  /**
   * ⭐⭐⭐ **THE GROUND A §10 MARK MAY STAND ON, AND EVERY CLAUSE IS A DEFECT THIS CAR MEASURED.**
   *   · `inFrame` — `thorp`'s trampled patch and `siege`'s nine tents were off the page;
   *   · `onLand`  — `city`'s TWELVE camp huts were inside the coast polygon, all twelve;
   *   · `!inWay`  — `stateMarks`' own note: *"the besieger has not blockaded the road by pitching
   *                 a tent in it"*, re-satisfied against the DRAWN way faces;
   *   · `!inMass` — a camp is not pitched on somebody's roof;
   *   · `extramural` — ⛔⛔ **THE ONE THIS CAR'S OWN FIRST SPELLING FAILED.** `city`'s best-scoring
   *                 gate was `f39` at **0.11 R** — an INNER-circuit gate — so a camp placed
   *                 "outside" it landed **inside the outer wall**. §10.12's besiegers and §10.A11's
   *                 migrants are outside the town by definition, and the test is exact:
   *                 `partitionSeating`'s own intramural spelling, `pointInPolygon` against every
   *                 wrap's INNER ring.
   * ⚠ `inDisc` is deliberately NOT a clause. The disc is the settlement's extent; the FRAME is
   *   what is drawn, and the question a placement census asks is whether the mark is drawn.
   */
  const onGround = (p) => inFrame(p) && onLand(p) && !inWay(p) && !inAnyRing(p, massRings) && extramural(p);

  /** @param {string} family @returns {number} the standoff in world units, from the DRAWN bound */
  const standOf = (family) => {
    const s = STATE_STANDOFF[family];
    if (!s) return 0;
    return Math.max(frontage * s.frontages, R * s.radiusShare);
  };

  return {
    centre: { cx, cy },
    R,
    frontage,
    rw,
    bandRings,
    waterRings,
    fieldRings,
    wayRings,
    laneRings,
    approaches,
    onLand,
    inDisc,
    inFrame,
    inField,
    extramural,
    innerRings,
    massRings,
    inWay,
    onGround,
    standOf,
    dToBand: (p) => (bandRings.length ? dToRings(p, bandRings) : Infinity),
  };
}

/** The centroid of a point list. */
function meanOf(pts) {
  let x = 0; let y = 0;
  for (const p of pts) { x += p[0]; y += p[1]; }
  return [x / pts.length, y / pts.length];
}

/**
 * ⭐⭐ THE RIGID RE-SEAT. Express a family in the LOCAL FRAME of the anchor it was derived
 * against — `u` along that anchor's outward normal, `v` across it — then re-emit it in the DRAWN
 * anchor's frame with its near edge at `stand`, shifted `side` across the road.
 *
 * ⛔ THE LATERAL SHIFT IS NOT DECORATION: `stateMarks.js`'s own comment records that its first
 * spelling put nine tents ACROSS the approach road and the ground law refused eight of nine —
 * *"the besieger has not blockaded the road by pitching a tent in it."* That offset was a legacy
 * number (`frontage × 2.6`) measured against a road the page does not draw, so here the law is
 * re-satisfied against the DRAWN way faces instead: both hands are scored and the one that keeps
 * the family out of the roadway wins.
 *
 * @param {number[][]} pts the family's own vertices, in world space
 * @param {{cx:number,cy:number}} legacyCentre the centre the LEGACY derivation measured from
 * @param {{at:number[], out:{dx:number,dy:number}}} anchor the DRAWN anchor
 * @param {number} stand the standoff, world units
 * @param {number} side the lateral shift, world units (signed)
 */
export function reseatFamily(pts, legacyCentre, anchor, stand, side) {
  if (!pts.length) return [];
  const c = meanOf(pts);
  let ux = c[0] - legacyCentre.cx; let uy = c[1] - legacyCentre.cy;
  const L = Math.sqrt(ux * ux + uy * uy);
  // A family sitting exactly on the legacy centre has no radial frame of its own; the drawn
  // anchor's own outward normal stands in, which reduces the transform to a translation.
  if (L === 0) { ux = anchor.out.dx; uy = anchor.out.dy; } else { ux /= L; uy /= L; }
  const uv = pts.map((p) => {
    const dx = p[0] - legacyCentre.cx; const dy = p[1] - legacyCentre.cy;
    return [dx * ux + dy * uy, -dx * uy + dy * ux];
  });
  let u0 = Infinity;
  for (const q of uv) if (q[0] < u0) u0 = q[0];
  const ox = anchor.out.dx; const oy = anchor.out.dy;
  return uv.map(([u, v]) => {
    const uu = u - u0 + stand; const vv = v + side;
    return [anchor.at[0] + ox * uu - oy * vv, anchor.at[1] + oy * uu + ox * vv];
  });
}

/** The half-width of a family across its own radial frame, used to size the lateral shift. */
function halfWidthOf(pts, legacyCentre) {
  if (pts.length < 2) return 0;
  const c = meanOf(pts);
  let ux = c[0] - legacyCentre.cx; let uy = c[1] - legacyCentre.cy;
  const L = Math.sqrt(ux * ux + uy * uy) || 1;
  ux /= L; uy /= L;
  let lo = Infinity; let hi = -Infinity;
  for (const p of pts) {
    const v = -(p[0] - legacyCentre.cx) * uy + (p[1] - legacyCentre.cy) * ux;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  return (hi - lo) / 2;
}

/**
 * ⭐⭐⭐ PLACE ONE OUTWARD FAMILY: the argmax over (drawn approach × which hand of the road), with
 * GROUND as the dominant weight and the fabric's own chosen anchor as a secondary pull.
 * @returns {{pts:number[][], approach:any, side:number, onGround:number, score:number}|null}
 */
function placeOutward(pts, geo, family, legacyCentre, legacyAt) {
  if (!pts.length || !geo.approaches.length) return null;
  const stand = geo.standOf(family);
  const half = halfWidthOf(pts, legacyCentre);
  // Beside the road by a road width, either hand — and 0 as well, because a family narrower than
  // the roadway it stands beside has no reason to be pushed off centre and the score decides.
  const sides = [0, half + geo.rw, -(half + geo.rw)];
  let best = null;
  for (const a of geo.approaches) {
    const room = (geo.R - (a.dGate + stand)) / geo.R;
    const artery = a.rank === 'artery' ? 1 : 0;
    const circuit = a.inCircuit ? 1 : 0;
    const prox = legacyAt
      ? 1 - Math.min(1, Math.hypot(a.at[0] - legacyAt[0], a.at[1] - legacyAt[1]) / (2 * geo.R))
      : 0;
    for (const side of sides) {
      const moved = reseatFamily(pts, legacyCentre, a, stand, side);
      let ok = 0;
      for (const p of moved) if (geo.onGround(p)) ok++;
      const share = ok / moved.length;
      const score = GROUND_PULL * share + CIRCUIT_PULL * circuit + ARTERY_PULL * artery
        + PROXIMITY_PULL * prox + room;
      if (!best || score > best.score) best = { pts: moved, approach: a, side, onGround: share, score };
    }
  }
  return best;
}

/**
 * ⭐⭐ SEAT A ROUND PATCH **ON A DRAWN FIELD FACE**, on the outward side of an approach.
 *
 * The strongest form of "on the thing it means" available on this surface: the mark is not placed
 * at a distance from something, it is placed INSIDE the face whose class IS the thing. Its radius
 * is capped by the face's own inradius, so the patch cannot leave the field it marks, and the
 * census's assertion becomes containment rather than proximity.
 *
 * ⚠ A face whose centroid falls outside its own ring (a horseshoe) is skipped rather than seated —
 * the inradius of such a ring is not a radius the patch can trust.
 *
 * @returns {{at:number[], r:number, face:number, onGround:number}|null}
 */
function seatOnField(geo, page, approach, wantR) {
  const fields = (page.fields || []).filter((f) => Array.isArray(f.ring) && f.ring.length > 2);
  let best = null;
  for (const f of fields) {
    const c = meanOf(f.ring);
    if (!pointInPolygon(c[0], c[1], f.ring)) continue;
    // the outward side of the approach — the fields the war crossed to get here
    // ⚠ THE OUTWARD TEST IS TAKEN FROM THE SETTLEMENT'S CENTRE, NOT FROM THE APPROACH POINT. The
    //   approach point already sits at the town's edge, so "outward of it AND on the page" is very
    //   nearly the empty set — which is exactly what `thorp` measured (0 of 25 fields qualified).
    //   The question the mark asks is which SIDE of the town the war came by, and that is a
    //   direction from the centre.
    const sx = c[0] - geo.centre.cx; const sy = c[1] - geo.centre.cy;
    if (sx * approach.out.dx + sy * approach.out.dy <= 0) continue;
    if (!geo.inFrame(c) || !geo.onLand(c) || geo.inWay(c)) continue;
    const ax = c[0] - approach.at[0]; const ay = c[1] - approach.at[1];
    // the face's own inradius: how big a patch it can hold without leaving itself
    let inr = Infinity;
    for (let i = 0; i < f.ring.length; i++) {
      const a = f.ring[i]; const b = f.ring[(i + 1) % f.ring.length];
      const d = distToSegment(c[0], c[1], a[0], a[1], b[0], b[1]);
      if (d < inr) inr = d;
    }
    if (!(inr > 0)) continue;
    const r = Math.min(wantR, inr);
    // how squarely the field sits on the approach ray, and how far out along it
    const along = ax * approach.out.dx + ay * approach.out.dy;
    const across = Math.abs(-ax * approach.out.dy + ay * approach.out.dx);
    const probe = [c,
      [c[0] + approach.out.dx * r, c[1] + approach.out.dy * r],
      [c[0] - approach.out.dx * r, c[1] - approach.out.dy * r],
      [c[0] - approach.out.dy * r, c[1] + approach.out.dx * r],
      [c[0] + approach.out.dy * r, c[1] - approach.out.dx * r]];
    let g = 0;
    for (const p of probe) {
      if (geo.inFrame(p) && geo.onLand(p) && !geo.inWay(p) && pointInPolygon(p[0], p[1], f.ring)) g++;
    }
    const share = g / probe.length;
    const score = GROUND_PULL * share
      + PROXIMITY_PULL * (1 - Math.min(1, across / geo.R))
      + (r / Math.max(wantR, 1e-9))
      + ARTERY_PULL * (1 - Math.min(1, along / geo.R));
    if (!best || score > best.score || (score === best.score && f.face < best.face)) {
      best = { at: c, r, face: f.face, onGround: share, score };
    }
  }
  return best;
}

/** Group a body/mark list by family, preserving order. */
function familyOf(kind) {
  const row = STATE_ANCHOR_DISPOSITION[kind];
  return row ? row.family : null;
}

/**
 * ⭐⭐⭐ **RE-ANCHOR THE §10 REGISTER ONTO THE DRAWN PAGE.**
 *
 * @param {any} page a `PARTITION_PAGE_FRAME`
 * @param {any} state `fabric.stateMarks` — READ, never written
 * @param {{frontage?:number, roadWidth?:number, centre?:{x:number,y:number}, seats?:any[]}} facts
 * @returns {any} the same artifact shape with every movable family re-anchored, plus `anchoring`
 */
export function anchorStateMarks(page, state, facts = {}) {
  if (!state) return state;
  const geo = stateAnchorReader(page, facts);
  const legacyCentre = {
    cx: facts.centre && Number.isFinite(facts.centre.x) ? facts.centre.x : geo.centre.cx,
    cy: facts.centre && Number.isFinite(facts.centre.y) ? facts.centre.y : geo.centre.cy,
  };
  const bodies = Array.isArray(state.bodies) ? state.bodies : [];
  const marks = Array.isArray(state.marks) ? state.marks : [];
  /** @type {Array<{family:string, n:number, onGround:number, at?:number[], face?:number, why:string}>} */
  const anchoring = [];

  // ── the LEGACY anchor each family was derived against, read off what the fabric publishes.
  //    `barredGate`/`quarantineBar` carry the legacy gate outright; everything else is located by
  //    its own centroid, which is all `reseatFamily` needs.
  const legacyGate = marks.find((m) => m.kind === 'barredGate' || m.kind === 'quarantineBar') || null;
  const legacyAt = legacyGate ? [legacyGate.x, legacyGate.y] : null;

  /* ── 1 · THE BODY FAMILIES ─────────────────────────────────────────────────────────────── */
  /** @type {Map<string, any[]>} */ const bodyByFamily = new Map();
  const outBodies = [];
  for (const b of bodies) {
    const key = String(b.key || '');
    // `state.*` is a §10 expression; `colonize.*` is §18.4 market infill and belongs to the
    // market furniture, not to the state register — the discriminator the fabric already
    // publishes (DRESS-2's J-D2-3: a KIND list goes stale, the KEY is what `stateMarks` writes).
    if (!key.startsWith('state.') || !Array.isArray(b.polygon) || b.polygon.length < 3) { outBodies.push(b); continue; }
    const fam = key.startsWith('state.billet.') ? 'seat' : familyOf(b.kind);
    if (!fam || UNMOVED_FAMILIES.includes(fam)) { outBodies.push(b); continue; }
    const hit = bodyByFamily.get(fam);
    if (hit) hit.push(b); else bodyByFamily.set(fam, [b]);
  }
  for (const fam of [...bodyByFamily.keys()].sort()) {
    const group = bodyByFamily.get(fam);
    const flat = [];
    for (const b of group) for (const p of b.polygon) flat.push(p);
    let moved = null;
    if (fam === 'seat') {
      // ⚠ THE OCCUPATION BILLET. Its legacy anchor is a LANDMARK; the drawn analogue is a SEATED
      //   institution (`partitionSeating`). No corpus leaf expresses `occupied`, so this arm is
      //   exercised by fixture rather than by the corpus — and it is written rather than left
      //   legacy-anchored because a family with no page anchor is the defect this car cures.
      const seats = Array.isArray(facts.seats) ? facts.seats.filter((s) => Number.isFinite(s.x) && Number.isFinite(s.y)) : [];
      if (seats.length) {
        const seat = seats.slice().sort((a, b2) => (b2.area || 0) - (a.area || 0) || a.face - b2.face)[0];
        const c = meanOf(flat);
        const dx = seat.x - c[0]; const dy = seat.y - c[1];
        moved = { pts: flat.map((p) => [p[0] + dx, p[1] + dy]), approach: null, side: 0, onGround: 1, score: 0 };
        anchoring.push({ family: fam, n: group.length, onGround: 1, at: [seat.x, seat.y], why: 'beside the strongest seated institution' });
      }
    } else {
      moved = placeOutward(flat, geo, fam, legacyCentre, legacyAt);
      if (moved) {
        anchoring.push({
          family: fam, n: group.length, onGround: moved.onGround, at: moved.approach.at,
          face: moved.approach.face,
          why: `${STATE_STANDOFF[fam] ? STATE_STANDOFF[fam].cite : fam}; near edge at ${geo.standOf(fam).toFixed(1)} u beyond the drawn ${moved.approach.rank}`,
        });
      }
    }
    if (!moved) { for (const b of group) outBodies.push(b); continue; }
    let i = 0;
    for (const b of group) {
      const poly = b.polygon.map(() => moved.pts[i++]);
      outBodies.push({ ...b, polygon: poly });
    }
  }

  /* ── 2 · THE MARK FAMILIES ─────────────────────────────────────────────────────────────── */
  const outMarks = [];
  /** @type {Map<string, any[]>} */ const markByFamily = new Map();
  for (const m of marks) {
    const fam = familyOf(m.kind);
    if (!fam || UNMOVED_FAMILIES.includes(fam)) { outMarks.push(m); continue; }
    const hit = markByFamily.get(fam);
    if (hit) hit.push(m); else markByFamily.set(fam, [m]);
  }

  // ── 2a · AT-GATE FAMILIES. The whole meaning of these two is WHERE they are, so nothing is
  //        transformed: the mark is re-issued AT a drawn gate with the drawn outward normal.
  //        ⚠ The bearing is the RADIAL one and not the gate face's own long axis: measured, that
  //        axis is ACROSS the road on 3 of the 12 corpus gates (`|cos| = 0.017–0.122`) because a
  //        gate ring under one road width wide has an arbitrary longest diagonal.
  for (const fam of ['gateOne', 'gateAll']) {
    const group = markByFamily.get(fam);
    if (!group || !group.length) continue;
    if (!geo.approaches.length) { for (const m of group) outMarks.push(m); continue; }
    // §10.13's "every gate" is every gate OF THE CIRCUIT. Where a leaf draws no band it has no
    // circuit and every way in stands.
    const circuit = geo.approaches.filter((a) => a.inCircuit);
    const roster = circuit.length ? circuit : geo.approaches;
    if (fam === 'gateAll') {
      // §10.13 bars EVERY gate. The COUNT therefore follows the DRAWN circuit rather than the
      // legacy one — measured, `plague` **2 → 3** and `polycentric` **1 → 6**, against 3 and 8
      // way faces carrying the gate flag. That is the law being satisfied for the first time, not
      // a count inflated to look busier: the legacy circuit's gate roster is simply a different
      // and smaller set of gates than the one the page draws.
      const proto = group[0];
      for (const a of roster) {
        outMarks.push({ ...proto, x: a.at[0], y: a.at[1], dx: a.out.dx, dy: a.out.dy });
      }
      anchoring.push({ family: fam, n: roster.length, onGround: 1, why: `§10.13 — every one of the ${roster.length} gate(s) of the DRAWN circuit is barred (of ${geo.approaches.length} way face(s) flagged gate; the legacy circuit offered ${group.length})` });
    } else {
      // §10.12 bars the ONE gate the besieger invests — and it must be the gate the CAMP took,
      // or the bar and the camp are two answers to one question. The camp's own placement is
      // read back out of `anchoring` so the two cannot disagree.
      const camp = anchoring.find((r) => r.family === 'siegeCamp');
      const a = camp && Number.isFinite(camp.face)
        ? geo.approaches.find((x) => x.face === camp.face) || roster[0]
        : roster[0];
      for (const m of group) outMarks.push({ ...m, x: a.at[0], y: a.at[1], dx: a.out.dx, dy: a.out.dy });
      anchoring.push({ family: fam, n: group.length, onGround: 1, at: a.at, face: a.face, why: '§10.12 — the invested gate, and it is the gate the camp took' });
    }
  }

  // ── 2b · THE WATCH-FIRES. One per approach road, at the §10.15 standoff, on ground. The COUNT
  //        is the fabric's own — the shipped derivation caps at four — and approaches whose fire
  //        would stand in water or off the drawn extent are passed over rather than counted out.
  {
    const group = markByFamily.get('watchFire');
    if (group && group.length) {
      const stand = geo.standOf('watchFire');
      const cands = geo.approaches
        .map((a) => ({ a, p: [a.at[0] + a.out.dx * stand, a.at[1] + a.out.dy * stand] }))
        .map((c) => ({ ...c, ok: geo.onGround(c.p) }));
      const good = cands.filter((c) => c.ok);
      const use = good.length >= group.length ? good : good.concat(cands.filter((c) => !c.ok));
      let i = 0; let ok = 0;
      for (const m of group) {
        const c = use[i % Math.max(1, use.length)];
        i++;
        if (!c) { outMarks.push(m); continue; }
        if (c.ok) ok++;
        outMarks.push({ ...m, x: c.p[0], y: c.p[1] });
      }
      anchoring.push({ family: 'watchFire', n: group.length, onGround: group.length ? ok / group.length : 1, why: `${STATE_STANDOFF.watchFire.cite}; ${good.length} of ${cands.length} drawn approach(es) offer ground` });
    }
  }

  // ── 2c · ⭐⭐ THE TRAMPLED FIELD, AND IT IS THE FAMILY THAT TAUGHT THIS CAR ITS OWN LESSON.
  //        The first spelling here placed the patch at `R × 0.30` beyond the drawn gate — the
  //        shipped derivation's own offset, re-read against the drawn bound — and MEASURED
  //        `thorp` STILL off the page at `onGround 0.00`. The reason is structural and it is the
  //        framing law again: `thorp` is OPEN, its bound IS its built extent, and its ways run to
  //        the frontier, so ANY fixed offset beyond the way's outer tip lands outside the page.
  //        ⭐ **THE CURE IS TO ANCHOR ON THE THING THE MARK MEANS RATHER THAN ON A DISTANCE FROM
  //        IT.** A trampled field is a FIELD, and the page publishes FIELD faces. The patch is
  //        seated ON a drawn field face, on the outward side of the approach the war comes by, and
  //        sized so it cannot leave the face it marks — no offset and no clamp. The assertion a
  //        census can then make is the strong one: *the whole patch lies inside one drawn field.*
  //        ⛔ ITS BEARING IS ALSO RE-ISSUED: `stateMarks` publishes a TRIG INDEX and the dress
  //        read it as DEGREES — see `partitionDress`'s own note at the trampled branch.
  {
    const group = markByFamily.get('trampled');
    if (group && group.length) {
      // "the approach the war comes by" — the biggest road, and the one the fabric already chose
      // where the ranks tie. No ground term here: the ground question is answered by the FIELD.
      let A = null;
      for (const a of geo.approaches) {
        const prox = legacyAt ? 1 - Math.min(1, Math.hypot(a.at[0] - legacyAt[0], a.at[1] - legacyAt[1]) / (2 * geo.R)) : 0;
        const score = ARTERY_PULL * (a.rank === 'artery' ? 1 : 0) + PROXIMITY_PULL * prox;
        if (!A || score > A.score) A = { a, score };
      }
      const patchR = geo.standOf('trampled') * 0.8;
      let ok = 0; let at = null; let face = null; let seated = 0;
      for (const m of group) {
        const best = A ? seatOnField(geo, page, A.a, patchR) : null;
        if (!best) { outMarks.push(m); continue; }
        seated++;
        if (best.onGround >= 1) ok++;
        at = best.at; face = best.face;
        outMarks.push({ ...m, x: best.at[0], y: best.at[1], r: best.r, ang: bearingIndex(A.a.out.dx, A.a.out.dy) });
      }
      anchoring.push({
        family: 'trampled', n: group.length, onGround: group.length ? ok / group.length : 1, at, face,
        why: `${STATE_STANDOFF.trampled.cite}; seated ON a drawn FIELD face (${seated}/${group.length}),`
          + ` patch radius capped by that face against a nominal ${patchR.toFixed(1)} u`,
      });
    }
  }

  // ── 2d · THE BARRICADE. It stands ACROSS a lane, and the lane it stands across is the DRAWN
  //        one nearest the quarter the fabric already chose — so this pass carries the truth
  //        layer's decision rather than re-taking it, and opens no stream to re-take it with.
  {
    const group = markByFamily.get('lane');
    if (group && group.length) {
      const lanes = (page.ways || []).filter((w) => (w.rank === 'lane' || w.rank === 'blockLane')
        && Array.isArray(w.ring) && w.ring.length > 2);
      let ok = 0;
      for (const m of group) {
        let best = null;
        for (const w of lanes) {
          let c = [0, 0];
          for (const p of w.ring) { c[0] += p[0] / w.ring.length; c[1] += p[1] / w.ring.length; }
          const dd = Math.hypot(c[0] - m.x, c[1] - m.y);
          if (!best || dd < best.dd || (dd === best.dd && w.face < best.w.face)) best = { w, c, dd };
        }
        if (!best) { outMarks.push(m); continue; }
        ok++;
        // the lane's own long axis — a barricade lies ACROSS it, which the dress derives from dx/dy
        let bi = 0; let bj = 0; let bd = -1;
        const r = best.w.ring;
        for (let i = 0; i < r.length; i++) {
          for (let j = i + 1; j < r.length; j++) {
            const dd = (r[i][0] - r[j][0]) ** 2 + (r[i][1] - r[j][1]) ** 2;
            if (dd > bd) { bd = dd; bi = i; bj = j; }
          }
        }
        outMarks.push({ ...m, x: best.c[0], y: best.c[1], dx: r[bj][0] - r[bi][0], dy: r[bj][1] - r[bi][1] });
      }
      anchoring.push({ family: 'lane', n: group.length, onGround: group.length ? ok / group.length : 1, why: `across the drawn lane nearest the quarter the fabric chose (${lanes.length} lane face(s) drawn)` });
    }
  }

  const moved = anchoring.reduce((s, r) => s + r.n, 0);
  return {
    ...state,
    schemaVersion: PARTITION_STATE_SCHEMA_VERSION,
    bodies: outBodies,
    marks: outMarks,
    /** ⭐ THE PASS'S OWN RECORD — which family took which drawn anchor, and how much of it landed
     *  on ground. A census reads this beside the geometry so a green can be attributed. */
    anchoring: Object.freeze(anchoring.map(Object.freeze)),
    anchorReason: `§10 register re-anchored onto the drawn page: ${anchoring.length} family/families,`
      + ` ${moved} mark(s)/body(ies) moved onto ${geo.approaches.length} drawn approach(es)`
      + ` about a bound of ${geo.R.toFixed(1)} u.`
      + ` UNMOVED: ${UNMOVED_FAMILIES.join(', ')} — the partition publishes no market face,`
      + ` and the legacy market is the one anchor both geometries agree about.`,
  };
}
