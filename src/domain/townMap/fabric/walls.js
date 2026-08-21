/**
 * domain/townMap/fabric/walls.js — THE WALL-TRACE LAW (§161m.1).
 *
 * ⭐⭐ "WALLS ARE SHAPED BY HISTORIC PRECEDENT, BECAUSE A WALL WAS THE MOST EXPENSIVE
 * THING A TOWN EVER BUILT." The trace DERIVES; it is never drawn freehand. Six rules,
 * each implemented below and each citing its source:
 *
 *  1 CIRCUIT ECONOMY   every metre cost a fortune, so the wall hugs the fabric tight
 *                      with a banded working margin — and THE HIGH-WATER LAW sizes it to
 *                      the extent that PAID for it, not to today's occupancy. A shrunken
 *                      city keeps the circuit its peak built.
 *  2 TERRAIN SERVICE   the trace follows defensible ground from the §5.-1 substrate: it
 *                      climbs to ridge lines and refuses marsh it could skirt.
 *  3 WATER AS A FLANK  a §5.0b BANKSIDE town closes a HALF-RING against the river. The
 *                      water is the fourth wall; the waterfront gets a water gate and
 *                      lighter works. This is the single most-missed real-world rule and
 *                      it is why so many generated maps look wrong on a river.
 *  4 GATES ARE EXPENSIVE WEAKNESSES  few, placed where the weighted roads actually run,
 *                      each a tower pair.
 *  5 FORM BY KIND      a palisade runs simpler and rounder (banked earth and timber with
 *                      a ditch outside); a stone circuit runs TOWER-TO-TOWER in
 *                      straight-ish curtains with angle turns.
 *  6 THE DITCH         dug where the ground allows and the tier affords it.
 *
 * ⛔ WALL MATERIAL IS NOT A CANONICAL FIELD, and that is stated rather than guessed.
 * `defenseProfile` carries NO construction vocabulary — the walls predicate is boolean
 * and readiness is defensive TERRAIN, not masonry. So palisade-vs-stone derives from the
 * walls strings/objects where the dossier carries any, else from tier and readiness under
 * a DOCUMENTED PRECEDENCE. The precedence is written here once and cited at its use.
 *
 * ⭐ SEAM W-1: WHEN THE FABRIC IS LIT, THE FABRIC OWNS WALL GEOMETRY. The landed
 * `fortifications.walls` is a fixed-radius octagon (radius ≈ EXTENT+50) that cannot know
 * where a given settlement actually grew; fitted to an accreted plan it cuts straight
 * through the fabric. This module consumes the wall TRUTH — presence, strength, readiness
 * — and RE-DERIVES the ring. The legacy octagon stays byte-frozen on the v1/v2 paths.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare.
 */

import { fabricRng } from './fabricRng.js';
import { resampleClosed, offsetPolygonOutward, chaikin, absArea, distToPolyline, guardSimpleRing, nestAround } from './fabricGeometry.js';
import { sampleAt } from './substrate.js';
import { boundEpoch, densify } from './epochAxis.js';
import { cosI, sinI, TRIG_N } from './trigTable.js';
import { deriveRuns, runBand, laneLineFor } from './wallRuns.js';

/**
 * WALL FORMS. `facets` is how many straight runs the circuit is built in — a stone
 * curtain is built tower-to-tower and is therefore ANGULAR; an earth-and-timber bank
 * follows the ground and is therefore ROUND. `towerEvery` is the tower interval in
 * facets; `smooth` is how many corner-cutting rounds the trace takes.
 * @type {Readonly<Record<string, { facets: number, towerEvery: number, smooth: number, ditch: boolean, weight: number }>>}
 */
export const WALL_FORMS = Object.freeze({
  palisade: { facets: 30, towerEvery: 6, smooth: 2, ditch: true, weight: 2 },
  bank:     { facets: 26, towerEvery: 8, smooth: 2, ditch: true, weight: 2 },
  stone:    { facets: 20, towerEvery: 2, smooth: 0, ditch: true, weight: 4 },
  citywall: { facets: 26, towerEvery: 2, smooth: 0, ditch: true, weight: 5 },
});

/**
 * ⭐ THE MATERIAL PRECEDENCE, documented because the field does not exist:
 *   1. the dossier's own walls STRING/OBJECT where it carries one (the only real source);
 *   2. otherwise TIER — a village that walls itself banks earth and plants timber; a town
 *      raises stone if it can; a city and above builds a stone circuit, because by the
 *      time a settlement is that size the wall is also its charter's proof;
 *   3. readiness nudges within the tier band — a fortified-terrain settlement invests.
 * @param {any} settlement @param {string} tier @returns {{ form: string, source: string }}
 */
export function wallForm(settlement, tier) {
  const dp = (settlement && settlement.defenseProfile) || {};
  const stated = typeof dp.walls === 'string' ? dp.walls
    : dp.walls && typeof dp.walls === 'object' && typeof dp.walls.material === 'string' ? dp.walls.material : '';
  if (stated) {
    const s = stated.toLowerCase();
    if (/palisade|timber|stockade|wood/.test(s)) return { form: 'palisade', source: `dossier walls '${stated}'` };
    if (/earth|bank|ditch|rampart/.test(s)) return { form: 'bank', source: `dossier walls '${stated}'` };
    if (/stone|masonry|ashlar|brick/.test(s)) return { form: tier === 'city' || tier === 'metropolis' ? 'citywall' : 'stone', source: `dossier walls '${stated}'` };
  }
  const readiness = String(dp.defensiveTerrain || dp.readiness || '').toLowerCase();
  const invests = /fortified|sheltered/.test(readiness);
  if (tier === 'city' || tier === 'metropolis') return { form: 'citywall', source: `tier precedence (${tier}) — no material field exists on defenseProfile` };
  if (tier === 'town') return { form: invests ? 'stone' : 'palisade', source: `tier precedence (town) + readiness '${readiness || 'unstated'}'` };
  return { form: 'palisade', source: `tier precedence (${tier}) — below town a circuit is banked earth and timber` };
}

/**
 * THE WORKING MARGIN — how far outside the built edge the wall stands, as a share of the
 * built radius. §42/§43 VALUE, DERIVED from circuit economy: the margin is the ground the
 * town needs OUTSIDE its houses (a wall walk, a mustering lane, room to repair) and
 * nothing more, because every extra metre was money. It shrinks with tier, because a
 * larger circuit is proportionally more expensive per soul defended.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const WALL_MARGIN = Object.freeze({ village: 0.115, town: 0.090, city: 0.070, metropolis: 0.058 });

/**
 * ⭐⭐⭐ §200 THE WALL BAND — THE RESERVED GROUND OF THE CIRCUIT (owner catch, chair directive
 * ODQ §200: "you are overlapping buildings" said again, of the wall).
 *
 * ⛔⛔ WHAT WAS WRONG, AND IT IS THE §195.0 CLASS ONE SURFACE FURTHER OUT. The wall was drawn
 * as a STROKE by the lens and was never a CLAIM in the derivation: `traceWalls` ran at stage 5
 * and `enforceGround` at stage 3d, so no footprint was ever asked to keep off the circuit and
 * neither drawn-geometry census could see the circuit at all. MEASURED before this cure, at
 * the ink that actually draws: **408 drawn bodies standing inside a wall band across the
 * corpus** — 24 at the town, 64 at the city, 49 at the metropolis, 64 at the high-water leaf,
 * penetrating up to 2.10 view units. The owner saw it in the b6 town zoom.
 *
 * ⭐ THE BAND IS A DOMAIN FACT, NOT AN INK FACT, and that is the whole architectural point.
 * If the reserved width lived in the lens, every lens would reserve a different width and the
 * derivation would be answerable to none of them. The circuit publishes ONE band; the lens's
 * stroke must fit inside it (pinned), so the ink can never cover ground the law did not reserve.
 *
 * THE BAND'S THREE PARTS, each historical:
 *  1. THE WALL ITSELF — a real thickness. A stone city curtain is thicker than a village's
 *     banked palisade, which is `WALL_FORMS[form].weight` restated as ground.
 *  2. THE INTERVALLUM (inside) — the clear lane behind the wall. Rome's own word for it. No
 *     town let its houses grow against the inner face where the garrison had to run, the
 *     engines had to stand and a fired roof would have taken the wall-walk with it.
 *  3. THE GLACIS (outside) — cleared ground before the stones, ALREADY LEGISLATED by §5.0e.3
 *     as an ORDER read: a militarily serious town keeps it clear; a lax one lets lean-tos
 *     accrete. So the outer clearance is not a constant — it is the same seriousness dial the
 *     faubourg law already reads, and the lean-to is its licensed exception (see §200.2).
 *
 * ⚠ §42/§43 VALUES, ARGUED, UNSOAKED; they ride the tuning signature.
 */
export const WALL_BAND = Object.freeze({
  /** The lens's own wall ink law, RESTATED so the band can never be thinner than the stroke
   *  that draws it. These three numbers are `INK_SCALE.wall` and `INK_CLAMP.wall`. */
  inkShare: 0.42, inkFloor: 1.8, inkCeil: 4.2,
  /** ⚠ THE STROKE'S OWN SHARE, WHICH IS NOT `inkShare` AND THE DIFFERENCE WAS LOAD-BEARING.
   *  `inkShare` 0.42 is what the STONES are scaled by; the lens strokes the wall at
   *  `INK_SCALE.wall` = 0.55 and clamps it to [1.8, 4.6]. Restating 0.42 as if it were the
   *  stroke is what let the ink hang over the reservation — see wallBand's side floor. */
  strokeShare: 0.55, strokeCeil: 4.6,
  /** How much thicker than the lightest form's stroke a heavier circuit's stones are. */
  perWeight: 0.09,
  /** The intervallum — the clear lane behind the wall — in FRONTAGES. */
  intervallum: 0.50,
  /** The glacis at FULL military seriousness, in FRONTAGES. */
  glacis: 1.00,
});

/**
 * ⭐⭐ THE RESERVED BAND OF A CIRCUIT, AND IT IS ASYMMETRIC BECAUSE THE HISTORY IS.
 *
 * The intervallum is INSIDE and the glacis is OUTSIDE, and they are not the same size — so a
 * symmetric reservation would either push the intramural fabric back by a glacis it never
 * owed, or let the wall foot be built against where the town kept it clear. The claim the
 * ground law consumes is therefore the band's own CENTRELINE — the true ring offset outward
 * by half the difference — carrying the band's full width. For a straight run that is exact;
 * at the corners it is the same approximation every offset polygon in this file already makes.
 *
 * ⭐⭐ AND THE GLACIS IS BINARY, WHICH RESOLVES §200.2's ABUTTING VARIANT WITHOUT AN
 * EXEMPTION. §5.0e.3 already legislates the wall foot as an ORDER read: a militarily serious
 * town keeps its glacis CLEAR, a lax one lets lean-tos accrete against the stones. So the
 * outer reservation is not a continuous dial — **THE GLACIS IS EXACTLY THE LEAN-TO'S
 * ABSENCE.** A town with a clear glacis reserves it in full and grows no lean-tos; a town
 * that grew lean-tos never had one, so there is nothing out there to reserve and the lean-to
 * ABUTS the stones legally rather than being excused from a band it stands in. One law, two
 * expressions, and no census exemption to forget.
 *
 * @param {{form:string, kind:string}} circuit
 * @param {number} frontage the drawn module — every other width in the fabric is in these
 * @param {boolean} glacisClear §5.0e.3's own wall-foot tell
 * @returns {{stone:number, inner:number, outer:number, width:number, half:number, shift:number}}
 */
export function wallBand(circuit, frontage, glacisClear) {
  const spec = WALL_FORMS[circuit.form] || WALL_FORMS.palisade;
  const strokeOfLightestForm = Math.max(WALL_BAND.inkFloor, Math.min(WALL_BAND.inkCeil, frontage * WALL_BAND.inkShare));
  // ⭐ THE STONES ARE AT LEAST THE INK. A band thinner than the stroke that draws it would
  // let the lens cover ground the law never reserved — the §200 defect re-created one level
  // down — so the lightest form's band EQUALS its stroke and every heavier form exceeds it.
  const stone = strokeOfLightestForm * (1 + Math.max(0, spec.weight - 2) * WALL_BAND.perWeight);
  // An old core standing inside a later ring is not the working circuit any more: its
  // intervallum was built over generations ago, which is exactly why §11.1's growth rings
  // read as a change of GRAIN rather than as an open lane. Its band is its stones.
  const working = circuit.kind !== 'old-core';
  // ⭐⭐⭐ MF-B8b · THE RESERVATION MUST CONTAIN THE STROKE ON **EACH FACE**, NOT MERELY BE
  // WIDER THAN IT — and MF-B7's pin, which compares the band's WIDTH against the stroke's
  // width, passes happily while the ink hangs over the reservation on one side.
  //
  // ⛔ MEASURED at b8, on the leaves whose towns kept no glacis (the outer part is then 0 by
  // §5.0e.3, correctly): the band is 5.42 units wide against a 2.89-unit stroke — twice the
  // ink, so the pin is green — but the band's centreline is offset INWARD by 1.31, so only
  // `stone/2` = 1.400 units of it lie outside the drawn line while the stroke's outer half is
  // 1.445. The lens drew 0.045 units at the city, 0.042 at the metropolis and **0.312 at the
  // polycentric town** onto ground no law reserved. ⭐ THE CLASS: **A RESERVATION WIDER THAN
  // THE STROKE CAN STILL BE OFFSET FROM IT; CONTAINMENT IS A TWO-SIDED CLAIM.**
  //
  // The floor is applied to the SIDE, never to the band, so a serious town's glacis and a lax
  // town's absent one are both untouched wherever they already exceed the ink.
  const inkHalf = Math.max(WALL_BAND.inkFloor, Math.min(WALL_BAND.strokeCeil, frontage * WALL_BAND.strokeShare)) / 2;
  const sideFloor = Math.max(0, inkHalf - stone / 2);
  const inner = Math.max(working ? frontage * WALL_BAND.intervallum : 0, sideFloor);
  const outer = Math.max(working && glacisClear ? frontage * WALL_BAND.glacis : 0, sideFloor);
  const width = stone + inner + outer;
  return { stone, inner, outer, width, half: width / 2, shift: (outer - inner) / 2, inkHalf };
}

/**
 * @typedef {Object} WallCircuit
 * @property {string} kind      'main' | 'old-core' | 'new-core'
 * @property {string} form
 * @property {Array<[number,number]>} polygon
 * @property {Array<[number,number]>} towers
 * @property {Array<{ x:number, y:number, dx:number, dy:number, key:string, bricked:boolean }>} gates
 * @property {Array<[number,number]>|null} ditch
 * @property {boolean} halfRing
 * @property {number} weight
 * @property {string} reason
 */

/**
 * Trace a settlement's wall circuit.
 * @param {Object} args @returns {WallCircuit[]}
 */
/**
 * ⭐⭐ ⟦§301.6⟧ **THE TERRAIN SERVICE'S SEARCH NEIGHBOURHOOD**, as unit offsets scaled by the
 * bounded reach. Eight bearings at a HALF and a FULL radius, plus the origin — seventeen
 * candidates over a real disc, where the search used to walk nine points down one ±45° line.
 *
 * ⚠ THE ORIGIN IS FIRST AND THAT IS DELIBERATE. The tie-break is "first strictly-better wins",
 * so a vertex whose neighbourhood offers nothing better than the ground it already stands on
 * stays exactly where the resample put it.
 * ⚠ NO RUNTIME TRIG: the bearings are read off `trigTable`, the fabric's one home for an angle.
 */
export const PULL_BEARINGS = 8;
export const PULL_RADII = Object.freeze([0.5, 1]);
/** @type {Array<[number,number]>} */
export const PULL_OFFSETS = Object.freeze((() => {
  /** @type {Array<[number,number]>} */ const out = [[0, 0]];
  for (const r of PULL_RADII) {
    for (let k = 0; k < PULL_BEARINGS; k++) {
      const a = Math.round((k * TRIG_N) / PULL_BEARINGS) % TRIG_N;
      out.push(/** @type {[number,number]} */ ([cosI(a) * r, sinI(a) * r]));
    }
  }
  return out;
})());

export function traceWalls(args) {
  const {
    hasWalls, settlement, umbrella, tierScale: scale, sub, water, web, seeding,
  } = args;
  if (!hasWalls || !umbrella.components.length) return [];

  const { form, source } = wallForm(settlement, scale.extentTier);
  const spec = WALL_FORMS[form] || WALL_FORMS.palisade;
  const margin = (WALL_MARGIN[scale.extentTier] || 0.10) * scale.builtRadius;
  const frontage = args.frontage || 8;
  const glacisClear = args.glacisClear !== false;
  const threat = threatRead(settlement, glacisClear, spec);
  // ⭐ THE CIRCUIT'S BODY IS THE FABRIC CLOSED AT THE WALL'S OWN ECONOMICS (MF-B4), not the
  // drawn outline — see builtUmbrella's circuit note for the wall that walked into every bay
  // of its own town the moment the umbrella started following the block runs.
  const fallback = args.circuitBody || umbrella.components[0];
  // ⭐⭐⭐ ODQ §240 · ONE RING PER EPOCH, EACH TRACED FROM ITS OWN EPOCH'S FABRIC. The list
  // arrives already ordered OUTERMOST FIRST, so `rings[0]` is the working circuit exactly as
  // it has always been. An unwalled epoch (the suburb) is not in it: it has no wall by
  // definition, which is what makes the fabric beyond the last ring a CONSEQUENCE.
  const ladder = (args.epochBodies || []).filter((e) => e.body && e.body.length > 2);
  const list = ladder.length ? ladder : [{ index: 0, kind: 'main', extent: 1, body: fallback }];

  /** @type {WallCircuit[]} */ const circuits = [];
  // ⭐⭐⭐ §301.5 · **THE TRACE RUNS INNERMOST FIRST, AND THE ORDER IS A LAW RATHER THAN A LOOP
  //    DETAIL.** `list` arrives OUTERMOST FIRST (`rings[0]` is the working circuit and every
  //    consumer expects that), so the walk is reversed and the output reversed back.
  // ⛔⛔ WHY: the ring-nesting cure must run in ONE direction only. §240.4 — the inertia seam —
  //    forbids a later ring from re-deriving an earlier epoch, and a repair that pulled the
  //    superseded ring in to clear its successor red that pin directly. **A ring may depend on
  //    the epochs BEFORE it and never on the epochs after it**, which is also the history: a
  //    town that builds a new outer wall does not go back and move its old one. Tracing
  //    innermost first is what makes the dependency point that way.
  // ⚠ NOTHING ELSE IN THE LOOP DEPENDS ON TRACE ORDER, and that was checked rather than assumed:
  //    each epoch draws from its OWN keyed stream (`wall.epoch.${index}`, §240.4's own cure),
  //    `priorRing` is taken from `list` by index and not from the traced set, and the ditch's
  //    owner is `e.kind !== 'old-core'` — a fact about the epoch, not about who was traced first.
  for (let step = list.length - 1; step >= 0; step--) {
    const li = step;
    const e = list[li];
    // ⚠⚠ §240.4 THE EPOCH BOUNDARY IS AN INERTIA SEAM, AND THE STREAM IS WHERE IT BREAKS. One
    // rng walked in ring order means adding a later circuit re-rolls every gate of an earlier
    // one — the inertia law broken at epoch granularity. Each epoch draws from its OWN KEY.
    const rng = fabricRng(seeding.seed, `wall.epoch.${e.index}`, { variant: seeding.variant });
    // ⭐⭐⭐ THE EPOCH AT THE WALL'S OWN RESOLUTION, AND THIS IS WHERE "COMPLETELY BOUNDS" GETS
    // ITS MEANING (§240.1). Resample by ARC LENGTH — index subsampling of a lumpy outline is
    // uneven on an elongated plan, and the wall then cuts chords across its own suburbs.
    // ⛔ AND A 20-FACET CURTAIN CANNOT CONTAIN A 2,300-POINT OUTLINE EXACTLY: MEASURED, every
    // local repair I tried left tens of points out, because the polygon has no degrees of
    // freedom left. ⭐ THE CLASS: **A CONTAINMENT CLAIM MUST BE MADE AT THE RESOLUTION THE
    // BOUNDARY IS ALLOWED TO HAVE.** FORM BY KIND (rule 5) says a stone curtain runs
    // tower-to-tower in straight-ish runs, so the chord across a bay is the LAW, not an
    // artifact — and the ground beyond that chord was never inside this epoch's wall. The
    // hull IS the epoch, and the fabric between the hull and the raw body is the next one.
    const hull = resampleClosed(e.body, spec.facets);
    // ⚠ THE CLOSURE AND THE RESIDUAL BOTH WORK ON A DENSIFIED COPY, never on the 20-odd facet
    // vertices alone — see epochAxis.densify for the one-body sliver that measurement exposed
    // and for the confounded negative result that nearly buried it.
    const dense = densify(hull, Math.max(1, margin * 0.2));
    let perim = hull;

    // ── 2 TERRAIN SERVICE: pull each facet vertex toward the best defensible ground within
    //    a bounded search — up onto the rise, off the marsh. Bounded so the trace still
    //    HUGS the fabric (rule 1); a wall that wandered to the best ridge in the frame
    //    would cost more than the town was worth.
    // ⚠⚠ AND TERRAIN SERVICE IS SUBORDINATE TO CONTAINMENT. The search reaches 1.5 margins and
    // only ONE is offset back, so an unguarded pull can seat a facet INSIDE the fabric it is
    // supposed to bound — which is where MF-ARCH's 6.8% came from. A candidate standing in the
    // epoch is refused: the wall may climb the rise, it may not walk through the town.
    // ⛔⛔ ⟦§301.6 / MF-D0 RAISED-7⟧ **THE SEARCH USED TO LOOK DOWN ONE DIAGONAL, AND IT WAS A
    //    MEASURED PRODUCER OF FOLDED WALLS.** The nine candidates were `ox = x + s`, `oy = y + s`
    //    for the SAME `s` — nine points on a single ±45° line through the vertex. So the wall's
    //    terrain service could only ever look NORTH-EAST or SOUTH-WEST, whatever the wall was
    //    doing there, and two neighbouring facet vertices offered the same one-dimensional menu
    //    could be pulled PAST one another. MEASURED at MF-D0 stage by stage
    //    (`laneMFD0-stage.log`): **4 of the corpus's 12 self-crossing circuit segments** —
    //    `city` E1 and `migration` E1 both read `hull 0 -> pull 2`, the ring simple when it left
    //    the arc-length resample and crossing before the offset was called at all.
    // ⭐ THE CLASS, and it is worth the sentence because it is not a typo: **A SEARCH OVER A
    //    ONE-PARAMETER FAMILY IS NOT A SEARCH OVER A NEIGHBOURHOOD**, and nothing about the
    //    spelling `x + s, y + s` announces that it has collapsed two dimensions into one. D0
    //    refused the invalid RESULT with the kernel guard and left the search alone by name,
    //    because re-aiming it is trace behaviour and the kernel rode alone. §301.6 gives it here.
    // ⭐⭐ THE RE-AIM: EIGHT BEARINGS AT TWO RADII, PLUS STAYING PUT. Seventeen candidates over a
    //    real neighbourhood of the same bounded reach — nothing about the budget, the score, the
    //    containment refusal or the tie-break changes. The bearings come from `trigTable`, the
    //    fabric's ONE home for an angle (the purity law forbids runtime trig outright), and the
    //    scan order is fixed, so the first best candidate wins exactly as before.
    // ⚠⚠ AND TERRAIN SERVICE IS STILL SUBORDINATE TO CONTAINMENT: a candidate standing inside the
    //    epoch is refused, INCLUDING the origin. A vertex whose whole neighbourhood is inside the
    //    fabric does not move at all, which is the pre-existing behaviour preserved exactly.
    const reachOut = margin * 1.5;
    perim = perim.map(([x, y]) => {
      let bx = x, by = y, best = -Infinity;
      for (let c = 0; c < PULL_OFFSETS.length; c++) {
        const ox = x + PULL_OFFSETS[c][0] * reachOut;
        const oy = y + PULL_OFFSETS[c][1] * reachOut;
        if (pointInRing(hull, ox, oy)) continue;
        const h = sampleAt(sub, sub.height, ox, oy);
        const wet = sampleAt(sub, sub.wet, ox, oy);
        const score = h * 1.0 - wet * 1.8;
        if (score > best) { best = score; bx = ox; by = oy; }
      }
      return /** @type {[number,number]} */ ([bx, by]);
    });
    // ⭐⭐⭐ §287.12 · THE KERNEL GUARD, AND THE SECOND PRODUCER OF A CROSSING WALL.
    // ⛔ MEASURED at MF-D0, stage by stage (`laneMFD0-stage.log`): the pull introduces 4 of the
    // corpus's 12 self-crossing circuit segments — `city` E1 and `migration` E1 both read
    // `hull 0 -> pull 2`, so the ring is SIMPLE when it leaves the arc-length resample and
    // crossing before the offset is called at all. The cause is the search itself: the nine
    // candidates are taken along a SINGLE ±45° diagonal (`ox = x + s`, `oy = y + s` for the
    // same `s`), so two neighbouring facet vertices can be pulled PAST one another.
    // ⚠ THE DIAGONAL IS NOT CURED HERE and saying so is the point — re-aiming the search is a
    // trace-behaviour change that would move leaves this micro-wave's declared shift has not
    // measured, and §278 rules that the kernel rides ALONE. What the guard does is refuse the
    // INVALID RESULT, exception-only: a pull that produced a simple ring is untouched, and its
    // leaf is byte-identical.
    perim = guardSimpleRing(perim);

    let ring = offsetPolygonOutward(perim, margin, 1.5);
    if (spec.smooth > 0) ring = chaikin(ring, spec.smooth, true);

    // ── ⭐⭐⭐ §240.1 THE WALL COMPLETELY BOUNDS ITS EPOCH, and the closure runs LAST because
    //    every step above it can lose ground: the terrain pull reaches 1.5 margins and only
    //    one is offset back, and the corner-cutting smooth pulls the curtain inside its own
    //    facets. ⛔ MEASURED — running it before the offset left 141 bodies of 15,168 walled
    //    OUT of their own epoch. It is one-shot and local, never an iteration.
    const bound = boundEpoch(ring, dense);
    ring = bound.ring;

    // ── 3 WATER AS A FLANK: a BANKSIDE settlement closes a HALF-RING. The water is the
    //    fourth wall — nobody paid to wall the side the river already defended.
    const halfRing = water.mode === 'bankside' && water.line != null;
    /** @type {Array<[number,number]>} */
    const traced = halfRing
      ? ring.filter(([x, y]) => distToPolyline(x, y, water.line) > water.width * 1.1)
      : ring;
    if (traced.length < 3) continue;
    // ── ⭐⭐⭐ §301.5 · **THE RING-NESTING LAW.** A superseded circuit lies strictly inside its
    //    successor. The list is OUTERMOST FIRST, so the ring already pushed is this one's
    //    successor — the only pair the law is about. See `fabricGeometry.nestInside` for the
    //    stage attribution that put the cure here, and for the feasibility measurement that
    //    proves pulling this ring in cannot walk its own epoch out of it.
    // ⚠ IT RUNS BEFORE the residual, the gates, the towers and the run chain, because a ring and
    //   its furniture must be facts about the SAME polygon — a nest applied after them would be
    //   the §195.0 class again, an overlay drawn after the law ran.
    // The ring traced immediately before this one is the epoch this one SUPERSEDES — the only
    // pair the nesting law is about. It does not move; this one goes round it.
    const superseded = circuits.length ? circuits[circuits.length - 1].polygon : null;
    const nested = superseded ? nestAround(traced, superseded) : traced;

    // ⭐⭐⭐ THE CIRCUIT REPORTS ITS OWN CONTAINMENT RESIDUAL, measured HERE because this is the
    // only scope that holds both the epoch's hull and the half-ring predicate. A point of the
    // epoch dropped by the water flank is DEFENDED, not abandoned — the river is the fourth
    // wall (rule 3) — so it is exempt BY THE FILTER'S OWN PREDICATE, never by a tolerance.
    // ⛔ AND THE EXEMPTION IS THE FILTER'S OWN ACT, NOT A DISTANCE. My first spelling exempted
    // points within 1.1 water widths of the centreline and left ONE point convicted on the
    // city: the dropped arc BULGES, so ground the river plainly defends can sit further from
    // the line than the filter's own threshold. ⭐ THE CLASS: **AN EXEMPTION EXPRESSED AS A
    // TOLERANCE IS A SECOND SPELLING OF THE RULE IT EXCUSES.** The honest test is the rule
    // itself: the closed circuit contained this point and only the water flank dropped it.
    let residual = 0;
    for (const p of dense) {
      if (pointInRing(nested, p[0], p[1])) continue;
      if (halfRing && pointInRing(ring, p[0], p[1])) continue;
      residual++;
    }

    // ── 4 GATES: where the weighted roads actually cross THIS ring. Few and expensive.
    // ⚠ ⟦SW-1d⟧ THE EPOCH GOES IN, because a gate key is a DERIVED KEY and every ring cuts its
    //   gates from the SAME weighted road web — see `cutGates`'s own header for the 12 collisions
    //   of 38 this closes.
    const gates = cutGates(nested, web.roads, scale, rng, e.index);

    // ── ⭐⭐⭐ 4b · §5 W2 · THE RUN CHAIN (CX-13, ODQ §251.4b). The boundary is segmented BY
    //    CAUSE into runs from the closed set of nine, each carrying its own tower policy,
    //    thickness, ditch policy and wall-side-street setback. See wallRuns.js for the priority
    //    order and for the 102.8-unit chord this replaces.
    const chain = deriveRuns({
      ring: nested,
      hull,
      sub,
      water,
      seats: args.institutionSeats || [],
      margin,
      roads: web.roads,
      // ⛔⛔ THE OLDER WORK, AND MY FIRST SPELLING BROKE §240.4's INERTIA SEAM — THE PIN CAUGHT
      // IT AND THE FIX IS A CORRECTION OF DIRECTION, NOT A TOLERANCE. I first passed the
      // PREVIOUSLY TRACED circuit, and this list arrives OUTERMOST FIRST, so epoch 0's re-use
      // classification was reading epoch 1's wall — **a wall re-using a work that would not be
      // built for another two centuries.** MEASURED by the §240.4 pin: adding a later ring
      // changed epoch 0's tower set. ⭐ THE CLASS: **AN "EARLIER" READ TAKEN FROM AN ITERATION
      // ORDER RATHER THAN FROM THE HISTORY IS WHATEVER THE LOOP HAPPENS TO VISIT FIRST.**
      // The older work is the NEXT-INNER epoch's own OUTLINE — a fact that exists before ANY
      // circuit is traced, which is what keeps the chain acyclic and the seam intact.
      priorRing: li + 1 < list.length ? list[li + 1].body : null,
      halfRing,
      form,
      spec,
      seeding,
      epoch: e.index,
      threat,
      frontage,
      laneWidth: frontage * WALL_BAND.intervallum,
    });
    // ⭐ THE VERTEX → RUN MAP IS PUBLISHED, and it is the ONE mapping the lens, the ditch, the
    // claim set and every census share. Two spellings of "which run owns this vertex" is the
    // shape every divergence in this programme has had (§230's whole family).
    /** @type {number[]} */ const runOfVertex = new Array(nested.length).fill(0);
    chain.runs.forEach((r, j) => { for (const k of r.idx) runOfVertex[k] = j; });

    // ── 5 TOWERS, PER RUN. `none` on terrain-surrender and water runs; `clustered` facing the
    //    approach; `sparse` elsewhere; positions SEEDED-IRREGULAR inside the run.
    // ⛔ WHAT THIS REPLACES: `for (i = 0; i < traced.length; i += spec.towerEvery)` — EVEN
    //    SPACING BY INDEX, which is ATLAS banned prior #7 by name and was neither the
    //    seeded-irregular policy §214 asks for nor §259.3's corner rule.
    /** @type {Array<[number,number]>} */ const towers = [];
    /** @type {string[]} */ const towerTypes = [];
    const gateR = scale.builtRadius * 0.06;
    for (const run of chain.runs) {
      for (const t of run.towers) {
        let atGate = false;
        for (const g of gates) {
          if (Math.sqrt((t.x - g.x) * (t.x - g.x) + (t.y - g.y) * (t.y - g.y)) < gateR) { atGate = true; break; }
        }
        if (atGate) continue;
        towers.push(/** @type {[number,number]} */ ([t.x, t.y]));
        towerTypes.push(t.kind);
      }
    }

    // ── 6 THE DITCH, where the ground allows and the tier affords it.
    // ⭐ AND IT BELONGS TO THE **WORKING** CIRCUIT. An old core's ditch was filled in and built
    // over generations ago — the same reading that makes its band its stones (§11.1's growth
    // rings are a change of GRAIN, not an open lane). Before the epoch axis the ditch was dug
    // round whichever ring happened to be traced FIRST, which on a two-ring leaf was the OLD
    // one: a moat round the disused core and none round the wall the city actually mans.
    const working = e.kind !== 'old-core';
    const affordsDitch = working && spec.ditch && (scale.extentTier !== 'village' || rng.chance(0.4));
    const ditch = affordsDitch ? offsetPolygonOutward(nested, margin * 0.42, 1.5) : null;

    circuits.push({
      kind: e.kind,
      form,
      polygon: nested,
      towers,
      towerTypes,
      // ⭐⭐ THE RUN CHAIN, ON THE RING. `runs[j].idx` indexes `polygon`, and `runOfVertex`
      // inverts it — so a consumer never has to guess which run a piece of wall belongs to.
      runs: chain.runs,
      runOfVertex,
      runCounts: chain.counts,
      runReason: chain.reason,
      gates,
      ditch,
      halfRing,
      weight: spec.weight,
      // ⚠ THE EPOCH IS ON THE RING, so a consumer can name WHICH version of the wall it reads.
      epoch: e.index,
      vintageRatio: e.extent,
      // The epoch this ring bounds, at the ring's own resolution, and the proof that it does.
      epochHull: hull,
      containmentResidual: residual,
      // ⭐⭐ THE CIRCUIT AS IT WOULD STAND IF THE RIVER WERE NOT THE FOURTH WALL. Published so a
      // census can tell "the wall never reached here" from "the water defends here" — MEASURED,
      // every body a half-ring leaf reported outside its own epoch was on the water flank, at
      // 8 to 77 units from the centreline, and a DISTANCE exemption would have had to be tuned
      // to fit them. ⭐ THE CLASS again: **AN EXEMPTION EXPRESSED AS A TOLERANCE IS A SECOND
      // SPELLING OF THE RULE IT EXCUSES** — so the census gets the rule itself.
      closedPolygon: halfRing ? ring : nested,
      reason: `${form} circuit (${source}); EPOCH ${e.index} of ${list.length}, traced against`
        + ` its own fabric at ${(e.extent * 100).toFixed(0)}% of today's extent; margin`
        + ` ${margin.toFixed(1)} units on the ${scale.extentTier} high-water extent`
        + `${e.extent < 0.995 ? '; VINTAGE — the fabric beyond this ring was built AFTER it (§15.7)' : '; vintage unknown or contemporary — traced on today\'s fabric, UNDERSTATED rather than invented'}`
        + `; BOUNDED — ${bound.pushed} facet(s) held out (worst ${bound.worst.toFixed(2)}u), ${residual} epoch point(s) left outside (§240.1)`
        + `${halfRing ? '; HALF-RING — the river is the fourth wall' : ''}`
        + `${gates.filter((g) => g.bricked).length ? `; ${gates.filter((g) => g.bricked).length} gate(s) bricked under the demotion grammar` : ''}`,
    });
  }
  if (!circuits.length) return [];

  // ── ⭐⭐⭐ §200 · EVERY CIRCUIT PUBLISHES ITS RESERVED BAND, and the CLAIM LINE the ground
  //    law will treat as forbidden ground. Publishing it here — on the circuit, in the
  //    domain — is what makes the wall a claim the censuses can see. See wallBand's header.
  for (const c of circuits) {
    const band = wallBand(c, frontage, glacisClear);
    c.band = band.half;
    // ⚠ `bandParts` REMAINS THE **RING'S** BAND AND THAT IS DELIBERATE. §232's district
    // partition asks WHICH SIDE OF THE WALL a point is on, which is a fact about the circuit as
    // a whole; the per-run bands below govern CLEARANCE, which is a fact about each run. Making
    // the partition per-run would let a district's side flip along one wall.
    c.bandParts = band;
    // The claim's centreline: the ring pushed outward by half the inner/outer difference, so
    // one symmetric band covers an asymmetric reservation exactly on the straight runs.
    c.claimLine = Math.abs(band.shift) < 1e-6 ? c.polygon : offsetPolygonOutward(c.polygon, band.shift, 1.5);
    // ── ⭐⭐⭐ §5 W2 exit 4 · **THE PER-RUN BAND, AND THE WALL-SIDE STREET AS A SETBACK.**
    //    7/7 walled plates show a wall-side street on SOME runs and 0/7 on EVERY run, so a
    //    global intervallum reserves a band the corpus never draws — and §200's clearance
    //    census reds on correct output unless its exemption keys to RUN TYPE.
    //    ⚠ THE EXEMPTION ONLY EVER FREES GROUND: a run without a lane reserves LESS than the
    //    whole-ring band did, never more.
    /** @type {Array<any>} */ const runBands = [];
    /** @type {Array<any>} */ const laneLines = [];
    for (const run of (c.runs || [])) {
      const rb = runBand(band, run);
      runBands.push(rb);
      const line = laneLineFor(run, c.polygon, rb);
      if (line) laneLines.push({ key: `wallLane.${c.kind}.${run.key}`, run: run.type, width: rb.inner, line });
    }
    c.runBands = runBands;
    // ⭐⭐ §239.2's ENGINEERING GAIN, MADE CONCRETE: the wall-side lane's carriageway is EXACTLY
    // the ground the band already reserves, so "no building touches the wall" is a CONSEQUENCE
    // OF GEOMETRY rather than a policed rule, and every gate necessarily meets the street web.
    c.wallLanes = laneLines;
    c.laneRuns = runBands.filter((b) => b.lane).length;
    c.abuttedRuns = runBands.filter((b) => !b.lane).length;
    c.reason += `; §200 BAND ${band.width.toFixed(1)}u reserved (stones ${band.stone.toFixed(1)}`
      + ` + intervallum ${band.inner.toFixed(1)} inside + glacis ${band.outer.toFixed(1)} outside`
      + `${glacisClear ? '' : ' — NO GLACIS: this wall foot carries lean-tos (§5.0e.3), which abut the stones lawfully'})`
      + `; PER RUN — ${c.laneRuns} run(s) carry the wall-side street, ${c.abuttedRuns} abut the inner face lawfully`
      + `; ${c.runReason}`;
  }

  // ⚠ BACK TO OUTERMOST FIRST. The walk is inside-out for the nesting law; the CONTRACT is
  //   `rings[0]` is the working circuit, and every consumer in the tree reads it that way.
  circuits.reverse();
  return circuits;
}

/**
 * ⭐⭐ THE THREAT READ — how hard this circuit expects to be pushed, on 0…1, from facts the
 * dossier already carries and NOT from a dial.
 *
 * ⛔ THERE IS NO MILITARY SCORE ON `defenseProfile` — `walls.js`'s own header says so in terms
 * ("the walls predicate is boolean and readiness is defensive TERRAIN, not masonry"). So the
 * read is assembled from three facts that DO exist, each with its own argument:
 *   • THE GLACIS ORDER (§5.0e.3). A town that keeps open ground before its stones is a town
 *     that expects to need it — this is the same seriousness dial the faubourg law reads.
 *   • THE FORM'S OWN WEIGHT. A city curtain is not built by a settlement at peace with its
 *     neighbours; the masonry precedence in `wallForm` is itself an investment reading.
 *   • THE STATED READINESS, where the dossier carries one.
 * ⚠ It is used ONLY to choose how densely a CLUSTERED run towers and whether its towers are
 * beaked. It never decides whether there is a wall, where it runs, or how many rings there are.
 */
export function threatRead(settlement, glacisClear, spec) {
  const dp = (settlement && settlement.defenseProfile) || {};
  const readiness = String(dp.defensiveTerrain || dp.readiness || '').toLowerCase();
  let t = 0;
  if (glacisClear) t += 0.45;
  t += Math.min(0.40, Math.max(0, (spec.weight - 2)) * 0.135);
  if (/fortified|contested|hostile|exposed|frontier/.test(readiness)) t += 0.20;
  return t > 1 ? 1 : t;
}

/**
 * ⭐⭐⭐ CUT A RING'S OWN GATES — and this function exists because the copy was a real defect
 * the §202 access flood exposed, on every two-ring leaf in the corpus.
 *
 * ⛔⛔ THE LATER CIRCUIT WAS BEING HANDED THE VINTAGE CIRCUIT'S GATE LIST. The gates were
 * derived by crossing the roads against `traced` — the INNER ring — and then passed verbatim
 * to an outer ring standing tens of units further out. MEASURED, distance from each gate to
 * ITS OWN ring: city 71.7 / 120.2 / 62.5 / 1.3 · metropolis 21.7 · highwater 4.4 / 32.8. So
 * the outer circuit had **no opening anywhere on it** — an unbroken wall round a city nobody
 * could enter — and the lens's gate BREAK and its two piers were drawn floating in the fabric
 * a hundred units from the stones.
 *
 * ⭐ THE CLASS, worth the sentence: **A DERIVED FEATURE COPIED TO A SECOND HOST KEEPS ITS
 * FIRST HOST'S COORDINATES.** A gate is not a property of a town, it is a property of a
 * CIRCUIT — the place one particular ring is crossed by one particular road — and the moment
 * a second ring existed the shared list became a claim about geometry that was never checked.
 * Nothing could red: no census had the wall in its set (that is §200's finding), and a gate
 * off its ring draws as a break in nothing.
 */
function cutGates(ring, roads, scale, rng, epoch) {
  // ⛔⛔ ⟦SW-1d⟧ **THE KEY CARRIES ITS EPOCH, AND WITHOUT IT 12 OF THE CORPUS'S 38 GATE KEYS
  //    COLLIDE** (MF-D1 §8.4 ARM C: city 3, metropolis 4, highwater 2, migration 3). Every ring
  //    of a multi-epoch settlement cuts its gates from the same weighted road web, so the main
  //    circuit's gate on the north road and the old core's gate on the SAME north road were both
  //    `gate.road.north` — one key, two positions, on one leaf.
  // ⭐ THE AUTHOR ALREADY KNEW THE SHAPE: `circuitDemotion` prefixes `E${epoch}` on every fossil
  //    key it mints for exactly this reason, and the ring street, the round, the garden, the
  //    widening and the stub are all epoch-scoped. The gate was the one that was not.
  // ⚠ A DERIVED KEY IS UNIQUE ACROSS THE ARTIFACT OR IT IS NOT A KEY — SW-1d, stated once.
  /** @type {WallCircuit['gates']} */ const gates = [];
  for (const road of roads) {
    let hit = null, hitDir = [1, 0];
    for (let i = 0; i < road.line.length - 1; i++) {
      const a = road.line[i], b = road.line[i + 1];
      // The crossing is the first road vertex INSIDE the ring whose predecessor was out.
      const aIn = pointInRing(ring, a[0], a[1]);
      const bIn = pointInRing(ring, b[0], b[1]);
      if (!aIn && bIn) {
        hit = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        const dx = b[0] - a[0], dy = b[1] - a[1];
        const l = Math.sqrt(dx * dx + dy * dy) || 1;
        hitDir = [dx / l, dy / l];
        break;
      }
    }
    if (!hit) continue;
    gates.push({
      x: hit[0], y: hit[1], dx: hitDir[0], dy: hitDir[1],
      key: `gate.E${epoch}.${road.key}`,
      // ⭐ §161g: a demoted settlement's surplus gates are BRICKED — a high-water circuit
      // with a shrunken population cannot man every gate it once did.
      bricked: scale.highWater.demoted && rng.chance(Math.min(0.6, scale.highWater.deficit)),
    });
  }
  // ⛔⛔ §161g SAYS **SURPLUS** GATES ARE BRICKED, AND THE ROLL COULD BRICK THEM ALL.
  // Each gate took an independent chance, so a two-gate circuit on a badly demoted
  // settlement bricked BOTH: MEASURED on the high-water leaf, whose main circuit came back
  // `BRICKED, BRICKED` — a walled town with no way in or out, its whole intramural fabric
  // sealed from its own countryside. The §202 access flood is what found it (232 buildings
  // unreachable, 24% of the leaf's open ground in the street network's component); nothing
  // else could, because a bricked gate draws as a correct and rather handsome mark.
  // ⭐ THE CLASS: **AN INDEPENDENT PER-MEMBER ROLL ON A SET WITH A FLOOR HAS NO FLOOR.**
  // "Surplus" is a statement about the REMAINDER, so the remainder is what the derivation
  // has to hold: a circuit keeps its busiest gate open however far the settlement has fallen.
  // The road web arrives weight-ordered, so the first gate cut is the one on the best road.
  if (gates.length && gates.every((g) => g.bricked)) gates[0].bricked = false;

  // ⭐⭐ AND A CIRCUIT WITH NO OPENING IS NOT A CIRCUIT (§202, the access law read at the
  // wall). Where no road crosses this ring — a later circuit whose roads all bend, a
  // half-ring whose crossings fell on the water flank — the settlement still has to be
  // enterable, so the ring takes ONE gate at the vertex nearest the road web, and says so.
  if (!gates.length && roads.length) {
    let best = null, bestD = Infinity, bestDir = [1, 0];
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i];
      for (const road of roads) {
        for (const q of road.line) {
          const d = (p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]);
          if (d < bestD) {
            bestD = d; best = p;
            const nx = ring[(i + 1) % ring.length][0] - ring[i][0];
            const ny = ring[(i + 1) % ring.length][1] - ring[i][1];
            const l = Math.sqrt(nx * nx + ny * ny) || 1;
            bestDir = [-ny / l, nx / l];   // through the wall, not along it
          }
        }
      }
    }
    if (best) gates.push({ x: best[0], y: best[1], dx: bestDir[0], dy: bestDir[1], key: `gate.E${epoch}.forced`, bricked: false });
  }
  return gates;
}

/**
 * ⛔⛔ `wallVintageRatio` LIVED HERE AND IT HAS MOVED TO `epochAxis.deriveEpochs` — deliberately,
 * and the move is the §240 cure rather than tidying.
 *
 * ⭐ ITS NAME WAS TRUE OF ITS CALLERS' BELIEF AND FALSE OF ITS CODE. It read "the extent the
 * settlement had when its circuit was built", and its numerator was a CONSTANT — the town
 * threshold — so the recorded year only ever decided WHETHER a vintage exists, never how large
 * it was. Four waves consumed it as a per-settlement measurement of growth. The epoch ladder
 * keeps the honest half (the tier threshold IS the extent at which a circuit is earned) and
 * generalizes it: one threshold per circuit, read from §5's own footprint bands, in one home.
 *
 * ⭐⭐ AND THE CONCENTRIC-DECORATION ARMS WENT WITH IT. Two ad-hoc multi-ring branches lived
 * here — one shrinking today's outline about its centroid for the vintage ring, one taking a
 * convex-ish hull of the largest partition cells for a metropolis old core. Both drew an older
 * wall as a FUNCTION OF THE MODERN SILHOUETTE, which is the §157 defect the second of them
 * names in its own comment. `epochCircuitRing` traces each ring from its own epoch's cells.
 */

/** Even-odd point-in-ring. */
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

/** The circuit's enclosed area — reported so the economy claim is checkable. */
export function circuitArea(circuit) { return absArea(circuit.polygon); }

/**
 * ⛔⛔ `wallClaims` LIVED HERE AND IT HAS MOVED TO `wallCircuit.circuitClaims` — deliberately,
 * and the move IS the §230 cure rather than tidying.
 *
 * MF-B7 cured the gate split inside this file ("splitting a polyline by dropping vertices
 * removes a length that depends on the vertex spacing, not on the opening's width") and left
 * the LENS splitting the drawn line by dropping vertices, in `renderFolio`. One rule, two
 * spellings, one of them cured — so the ink and the reservation opened at different widths on
 * every walled leaf, and no census could see it because each surface measured its own copy.
 *
 * ⭐⭐ THE RULE NOW HAS ONE HOME AND ONE GATE RADIUS (`wallCircuit.splitAtGates`,
 * `wallCircuit.GATE_RADIUS_SHARE`), reached through accessors that verify the circuit's
 * content hash. A consumer cannot publish a second reading of where the wall opens, because
 * there is no second implementation to call.
 */
