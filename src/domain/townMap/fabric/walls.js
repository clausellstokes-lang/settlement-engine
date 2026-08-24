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
import { segmentCrossings, segmentTouchesImpassable } from './cliffs.js';
// ⭐ ODQ §590/§598 · THE RAMPART GRAMMAR AND THE §575 BAND REGIME. Both are guarded on
// `args.rampart`, so an unarmed build runs the byte-identical legacy trace — the same
// two-layered dormancy §577's cliff arm established one wave down.
import { deriveRampartWorks, regimeLane } from './rampartWorks.js';

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
  // ⭐ ODQ §577 · THE ESCARPMENT, OR `null` WHEN THE FEATURE IS NOT ARMED. Every §577 branch
  // below is guarded on it, so an unarmed build runs the byte-identical legacy trace.
  const cliffs = args.cliffs && args.cliffs.edges && args.cliffs.edges.length ? args.cliffs : null;
  // ⭐⭐ ODQ §590/§598 · THE RAMPART, OR `null` WHEN THE FEATURE IS NOT ARMED. It carries the
  // §575 regime the caller derived once for the whole settlement — derived THERE and not here,
  // because a regime is a fact about the TOWN (its war, its peace, its purse) and deriving it
  // per ring would let a city's two circuits disagree about the same history.
  const rampart = args.rampart && args.rampart.regime ? args.rampart : null;

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
    const watered = halfRing
      ? ring.filter(([x, y]) => distToPolyline(x, y, water.line) > water.width * 1.1)
      : ring;
    if (watered.length < 3) continue;

    // ── ⭐⭐⭐ 3b · ODQ §577 · **THE SEGMENTED CIRCUIT: THE WALL TERMINATES AT THE CLIFF, AND AN
    //    END-WORK STANDS AT EACH TERMINUS.**
    //
    // ⭐ IT IS RULE 3 AGAIN, ON THE OTHER IMPASSABLE FACT. "Nobody paid to wall the side the
    // river already defended" is §161m.3; §205.3 says the same of relief in its own words —
    // *"a cliff flank needs NO wall — drawing one is the violation"* — and `wallRuns` has
    // carried the `terrain-surrender` policy for it since CX-13 (no towers, a parapet, no ditch,
    // no lane). What was missing was the TERMINATION: the run policy could thin a curtain that
    // crossed a scarp, but nothing could stop the curtain and start it again beyond, because
    // nothing in the fabric published where the scarp's EDGE was. `cliffs.js` publishes it.
    //
    // ⭐⭐ THE TERMINUS COMES FROM THE ESCARPMENT'S OWN GEOMETRY, NOT FROM THE DROPPED VERTEX.
    // That distinction is the whole difference between consuming a boundary and consuming a
    // flag: the wall stops exactly where its line MEETS the brink, so moving the relief field
    // moves the terminus — which is the differential a value-ignoring read cannot produce.
    // ⚠ THE FALLBACK IS COUNTED RATHER THAN HIDDEN. Corner-cutting can pull a traced edge just
    // inside the cell it bounds, so a boundary segment can fail to cross it; the midpoint stands
    // in, and `cliffFallbacks` reports how often — a terminus set that was ALL fallbacks would
    // be a read that never touched the edge geometry, and the figure is what makes that visible.
    // ⚠ THE REFUSAL IS SEPARATED FROM THE CUT AND CARRIED, not folded into a null. A circuit
    // that hit the §577 floor took the LEGACY path byte for byte — which is what we want — but a
    // reader who saw only "no cut" could not tell that from "no cliff", and those are different
    // facts about a town. The refusal rides the reason string.
    //
    // ⛔⛔ **AND THE CUT RUNS AFTER THE NESTING, WHICH IS A CORRECTION MEASUREMENT FORCED.** My
    // first spelling cut the ring and THEN handed it to `nestAround` — and `nestAround` MOVES
    // vertices (its arm 1 pushes a facet outward past a superseded ring's poking vertex), so a
    // wall the cut had lifted off a scarp could be pushed straight back onto one. MEASURED over
    // 35 leaves: **12 drawn segments still over impassable relief**, with 4 of the 10 cliff
    // leaves clean and 6 carrying 1–5 — the multi-epoch ones. ⭐ THE CLASS IS ALREADY WRITTEN IN
    // THIS FILE, forty lines up, about `boundEpoch`: *"the closure runs LAST because every step
    // above it can lose ground"*. **A GEOMETRIC GUARANTEE HOLDS ONLY IF NOTHING MOVES THE
    // GEOMETRY AFTER IT.**
    // ⚠ The nesting is UNTOUCHED and still receives a CLOSED ring: §301.5's law is about two
    //   polygons, and handing it a segmented one would be asking it a question it cannot answer.
    if (watered.length < 3) continue;
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
    /** The circuit as it would stand if the cliff were not the fourth wall — closed, nested,
     *  and the subject of both the §577 cut below and the containment exemption further down. */
    const nestedFull = superseded ? nestAround(watered, superseded) : watered;
    const cliffRead = cliffs ? terminateAtCliffs(nestedFull, cliffs) : null;
    const cliffCut = cliffRead && !cliffRead.refused ? cliffRead : null;
    const nested = cliffCut ? cliffCut.ring : nestedFull;
    if (nested.length < 3) continue;

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
      // ⭐⭐ §577: A POINT THE CLIFF TERMINATION DROPPED IS **DEFENDED**, NOT ABANDONED — the
      // scarp is the wall there, exactly as the river is at a half-ring. ⚠ AND THE EXEMPTION IS
      // THE FILTER'S OWN ACT, NEVER A DISTANCE, for the reason stated eight lines above about
      // the water: **AN EXEMPTION EXPRESSED AS A TOLERANCE IS A SECOND SPELLING OF THE RULE IT
      // EXCUSES.** The honest test is the rule itself — the un-terminated circuit contained this
      // point and only the cliff cut dropped it.
      if (cliffCut && pointInRing(nestedFull, p[0], p[1])) continue;
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
      // ⭐⭐ §577 · WHICH VERTICES ARE CLIFF TERMINI. They index `nested`, and the indices survive
      // `nestAround` because it MOVES vertices in place and never adds or removes one (see its
      // `next = cur.slice()`). A run classifier that could not see them would type the parapet at
      // the brink as `new-cutting` and tower it — the §205.3 violation the whole rule forbids.
      cliffTerminalIdx: cliffCut ? cliffCut.terminalIdx : null,
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
    // ── ⭐⭐⭐ 5b · §577 · THE END-WORK AT EACH TERMINUS. "Tower/gate works at each terminus" is
    //    the rule's second half and it is not decoration: a curtain that simply STOPS presents an
    //    open end to anyone who can reach the brink, so every real segmented circuit closed its
    //    ends with a work. The kind is `angle` — `wallRuns.TOWER_TYPES`' own member for a tower
    //    that is a fact about a JUNCTION rather than a spacing — because a terminus is exactly
    //    that: the junction of masonry and ground.
    // ⚠ IT RE-USES THE EXISTING TOWER VOCABULARY RATHER THAN MINTING A TENTH KIND, which
    //    `wallRuns`' totality walker would red for, and rightly: a new tower type is a ruling.
    // ⚠ AND IT OBEYS THE GATE RULE ABOVE — a terminus that lands on a gate takes no second work.
    const terminalWorks = [];
    for (const t of (cliffCut ? cliffCut.termini : [])) {
      let atGate = false;
      for (const g of gates) {
        if (Math.sqrt((t.x - g.x) * (t.x - g.x) + (t.y - g.y) * (t.y - g.y)) < gateR) { atGate = true; break; }
      }
      if (atGate) continue;
      towers.push(/** @type {[number,number]} */ ([t.x, t.y]));
      towerTypes.push('angle');
      terminalWorks.push({ ...t, key: `cliffEnd.E${e.index}.${t.key}`, work: 'angle' });
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
      // ⭐⭐ AND THE SAME PUBLICATION FOR THE CLIFF, FOR THE SAME REASON: a census must be able
      // to tell "the wall never reached here" from "the scarp defends here", and a distance
      // exemption would have to be tuned to fit. `closedPolygon` is the circuit as it would
      // stand if neither the river NOR the cliff were the fourth wall.
      closedPolygon: halfRing ? ring : (cliffCut ? nestedFull : nested),
      // ⭐⭐⭐ §577 · THE TERMINI AND THEIR END-WORKS, PUBLISHED ON THE RING. A consumer asking
      // "where does this circuit stop, and why" gets the point, the escarpment edge it stopped
      // at, and whether the point came from the edge's own geometry or from the counted fallback.
      //
      // ⛔⛔ THEY ARE SPREAD CONDITIONALLY, AND THE FIRST SPELLING WAS A **MEASURED** DORMANCY
      // LEAK. Written as four unconditional keys (`cliffTermini: cliffCut ? x : []`, and three
      // zeros beside it), every circuit in the estate gained four properties whether or not the
      // feature was armed — and the flag-off fabric digest MOVED on all six proof fixtures
      // against the sealed base, including `plains`, which has no crag cell anywhere. The wall's
      // own `contentHash` stayed identical, which is exactly why it was nearly invisible:
      // `ringsText` does not serialize these fields, so the node's staleness detector was blind
      // to a change every consumer of the fabric object could see.
      // ⭐ THE CLASS, and it is worth the paragraph because a default value LOOKS like dormancy:
      // **AN ABSENT FEATURE THAT STILL PUBLISHES ITS ZERO IS NOT DORMANT.** `[]` and `0` are
      // values, and a published value is a byte. The dormant circuit carries no cliff key at all.
      ...(cliffCut ? {
        cliffTermini: terminalWorks,
        // ⭐⭐⭐ §577's OWN INK CONTRACT: the polygon EDGES that are NOT wall. The ring stays
        // CLOSED because everything downstream of it — `pointInRing`, the §200 band, §232's
        // district partition, the nesting law — is written for a closed ring, and opening it
        // would be a far larger change than the rule asks for. What §577 actually rules is that
        // the CURTAIN stops: so the chord across the scarp is published as not-wall and
        // `wallCircuit.circuitDrawnRuns` breaks the drawn line there, exactly as it already
        // breaks it at an open gate. ⚠ Indices into `polygon`; edge i is polygon[i]→polygon[i+1].
        cliffChordEdges: cliffCut.chordEdges,
        cliffSegments: cliffCut.segments,
        cliffDropped: cliffCut.dropped,
        cliffFallbacks: cliffCut.fallbacks,
      } : {}),
      reason: `${form} circuit (${source}); EPOCH ${e.index} of ${list.length}, traced against`
        + ` its own fabric at ${(e.extent * 100).toFixed(0)}% of today's extent; margin`
        + ` ${margin.toFixed(1)} units on the ${scale.extentTier} high-water extent`
        + `${e.extent < 0.995 ? '; VINTAGE — the fabric beyond this ring was built AFTER it (§15.7)' : '; vintage unknown or contemporary — traced on today\'s fabric, UNDERSTATED rather than invented'}`
        + `; BOUNDED — ${bound.pushed} facet(s) held out (worst ${bound.worst.toFixed(2)}u), ${residual} epoch point(s) left outside (§240.1)`
        + `${halfRing ? '; HALF-RING — the river is the fourth wall' : ''}`
        + `${cliffCut ? `; SEGMENTED (§577) — ${cliffCut.segments} cliff crossing(s) terminated the`
          + ` curtain, ${cliffCut.dropped} vertex/vertices stood on impassable relief and were`
          + ` surrendered to it, ${terminalWorks.length} end-work(s) raised`
          + `; ${terminalWorks.filter((t) => t.via === 'edge').length} terminus/termini placed by the drawn escarpment, ${terminalWorks.filter((t) => t.via === 'mask').length} by its cell mask (the two halves of one artifact — see cliffs.segmentTouchesImpassable)` : ''}`
        + `${cliffRead && cliffRead.refused ? `; §577 ${cliffRead.refused}` : ''}`
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
    // ⭐⭐⭐ §575 · THE REGIME'S ONE EFFECT ON GROUND, AND IT ONLY EVER FREES (rampartWorks'
    // `regimeLane`). ⚠ THE RUN IS **COPIED**, NEVER MUTATED: `run.lane` is read by exactly two
    // functions (`runBand` and `laneLineFor` — measured across src, harness and tests), so a
    // local copy at those two call sites is the whole rule, and the published run object stays
    // the fact the run chain derived. Mutating it would put the regime inside `ringsText`'s
    // run column by a side door, on a wave whose dormancy claim is byte-identity.
    const gatedRuns = new Set();
    if (rampart) {
      for (const g of (c.gates || [])) {
        let bi = 0, bd = Infinity;
        for (let i = 0; i < c.polygon.length; i++) {
          const d = (c.polygon[i][0] - g.x) ** 2 + (c.polygon[i][1] - g.y) ** 2;
          if (d < bd) { bd = d; bi = i; }
        }
        gatedRuns.add(c.runOfVertex[bi]);
      }
    }
    let laneDropped = 0;
    for (let j = 0; j < (c.runs || []).length; j++) {
      const run = c.runs[j];
      const eff = rampart ? regimeLane(run, rampart.regime, gatedRuns.has(j)) : { lane: run.lane, changed: false };
      if (eff.changed) laneDropped++;
      const view = eff.changed ? { ...run, lane: eff.lane } : run;
      const rb = runBand(band, view);
      runBands.push(rb);
      const line = laneLineFor(view, c.polygon, rb);
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

    // ── ⭐⭐⭐ ODQ §590/§598 · **THE RAMPART WORKS.** Derived HERE and not in the trace loop
    //    because a band is a fact about the STONES, and the stones' thickness (`runBands[j].stone`)
    //    is only known once §200's band pass has run — which is this scope and no other.
    // ⚠⚠ THEY ARE SPREAD CONDITIONALLY, for the reason §577's own termini row records at length:
    //    **AN ABSENT FEATURE THAT STILL PUBLISHES ITS ZERO IS NOT DORMANT.** `[]` and `0` are
    //    values, and a published value is a byte. The dormant circuit carries no rampart key.
    if (rampart) {
      const works = deriveRampartWorks({
        ring: c.polygon, runs: c.runs || [], runOfVertex: c.runOfVertex || [],
        runBands, gates: c.gates || [], towers: c.towers || [], towerTypes: c.towerTypes || [],
        terminalWorks: c.cliffTermini || [], halfRing: c.halfRing, form: c.form,
        // ⭐ THE GROUND THE WORKS MUST STAND ON. Both predicates are the fabric's OWN — a second
        // spelling of "is this water" or "is this a scarp" is the §230 family's whole shape.
        cliffs, water,
        // The band's own stones — the SAME number the reservation was computed from, so the ink
        // and the claim cannot disagree about how thick this wall is (walls' own §5 W2 law).
        stone: band.stone, seeding, epoch: c.epoch,
      });
      // ⭐ §614.2 · THE WEAR GRADE, AND AN OLD CORE IS ONE GRADE WORSE BY CONSTRUCTION. A
      // superseded circuit is not the wall the town mans; §250.5's fossil law says the old thing
      // BECOMES the new thing, and a ring the demotion has not yet reached is the in-between state
      // — still standing, no longer maintained. ⚠ It only ever worsens: nothing here can make a
      // ring read better-kept than the settlement's own upkeep earned.
      const wearOrder = ['kept', 'weathered', 'crumbling'];
      const baseWear = (rampart.wear && rampart.wear.grade) || 'kept';
      const grade = c.kind === 'old-core'
        ? wearOrder[Math.min(wearOrder.length - 1, wearOrder.indexOf(baseWear) + 1)]
        : baseWear;
      c.rampart = {
        regime: rampart.regime,
        wear: { ...(rampart.wear || {}), grade, ringGrade: grade, settlementGrade: baseWear },
        rung: works.rung.rung,
        plate: works.rung.plate,
        dress: works.rung,
        turnCut: works.turnCut,
        joints: works.joints,
        // §161m.3 · the ring edges the water defends — published as NOT-WALL, exactly as §577
        // publishes `cliffChordEdges`. The ring itself is unchanged.
        wetEdges: works.wetEdges,
        gatehouses: works.gatehouses,
        // ⭐ THE BAND'S HALF-WIDTH **PER RUN**, published so the lens offsets the drawn line by a
        // number it never computes itself. One rule, one home — the §230 family's own cure.
        bandHalfOfRun: runBands.map((b) => b.stone / 2),
        // ⭐⭐⭐ **THE OUTER LIMIT OF ANY RAMPART MARK, AND IT IS §200’s OWN NUMBER.** `wallBand`
        // guarantees containment on EACH FACE by flooring the side at `inkHalf` (MF-B8b: *a
        // reservation wider than the stroke can still be offset from it; containment is a
        // two-sided claim*). So a mark may reach `inkHalf` from the line and not one unit more —
        // and a merlon tick standing proud of the stones is exactly the mark that would break it.
        // ⚠ MEASURED at the coastal city, whose town keeps no glacis: the outer reservation is
        // `sideFloor` = 0.05 units beyond the stones. A comb drawn 1.4 units proud would have put
        // ink 1.35 units onto ground no law reserved — the §200 defect, re-created by ornament.
        inkHalfOfRun: runBands.map((b) => b.inkHalf),
        laneDropped,
        stats: works.stats,
      };
      c.reason += `; ${works.reason}`
        + `; ${(rampart.wear || {}).reason || ''}${c.kind === 'old-core' && grade !== baseWear ? ` — and ONE GRADE WORSE because this is a superseded circuit nobody mans: ${grade.toUpperCase()}` : ''}`
        + (laneDropped ? `; §575 ${rampart.regime.toUpperCase()} — ${laneDropped} run(s) gave up the wall-side lane to the fabric` : `; §575 ${rampart.regime.toUpperCase()} — every lane-carrying run keeps its intervallum`);
    }
  }

  // ⚠ BACK TO OUTERMOST FIRST. The walk is inside-out for the nesting law; the CONTRACT is
  //   `rings[0]` is the working circuit, and every consumer in the tree reads it that way.
  circuits.reverse();
  return circuits;
}

/**
 * ⭐⭐⭐ ODQ §577 · **TERMINATE A CIRCUIT AT ITS CLIFF CROSSINGS.** Rule 3's mechanism, applied to
 * the other impassable fact.
 *
 * THE THREE ACTS, and each is the water flank's own act one law over:
 *  1. DROP the vertices standing on impassable relief. `cliffs.onImpassable` is the predicate,
 *     and it is the SAME cell set the escarpment edges were traced from — so a vertex is never
 *     dropped for a cliff that has no boundary to terminate on.
 *  2. TERMINATE at the crossing. Where the wall's own line meets the escarpment, that point is
 *     the end of the curtain. It comes from `cliffCrossing` — the edge's geometry — so the
 *     terminus MOVES when the relief moves.
 *  3. RESUME beyond. The walk continues on the far side, which is what makes this a SEGMENTED
 *     circuit rather than a shortened one.
 *
 * ⛔⛔ AND IT REFUSES RATHER THAN EMPTIES. A circuit whose vertices are almost all on impassable
 * ground is a TRACE DEFECT, not a segmented wall: dropping them would leave two or three points
 * and every downstream reader (`pointInRing`, the band, the run chain) would be operating on a
 * sliver. ⭐ THE CLASS this estate has paid for repeatedly: **A FILTER WITH NO FLOOR PRODUCES AN
 * ARTIFACT NO CONSUMER DECLARED** — the bricked-gate roll is the same shape (`cutGates`' own
 * note). So the floor is explicit and the refusal is reported, never silent.
 *
 * ⚠ THE RING IS CLOSED, so a run of impassable vertices can straddle index 0. The walk therefore
 * ROTATES to a passable vertex first — the same reason `wallRuns.deriveRuns` starts its coalesce
 * at the first type CHANGE. Without it the run containing index 0 is cut in two and the circuit
 * reports a terminus pair it does not have.
 *
 * @param {Array<[number,number]>} ring the circuit as the water flank left it
 * @param {{edges:Array<any>, mask:Uint8Array, n:number, cell:number}} cliffs
 * @returns {{ ring:Array<[number,number]>, termini:Array<any>, terminalIdx:number[],
 *   segments:number, dropped:number, fallbacks:number, refused:string|null }|null}
 */
export function terminateAtCliffs(ring, cliffs) {
  const n = ring.length;
  if (!cliffs || n < 4) return null;

  // ── 1 · THE AUGMENTED PATH: every ring vertex, PLUS every escarpment crossing on every facet.
  //
  // ⛔⛔ A VERTEX-ONLY TEST WAS THE **CENTRE-TEST DEFECT ONE SURFACE OUT**, and it was measured
  // before it was cured. Testing only `onImpassable(vertex)` cut a 20-facet circuit against a
  // 96² raster whose escarpment is a LACE of 18–37 regions: MEASURED over 35 leaves, the
  // terminated circuits still put **209 drawn segments across impassable relief** (down from 257
  // — an 18% cure that reads like a working one). ⭐ `groundRefusal.bodyRefusal`'s header states
  // the general form for the OTHER consumer of this same law: *"a thin body crossing a refused
  // cell without putting a vertex or a cell centre in it is still caught"* — step 3, the one a
  // naive rasterizer omits. A facet crossing a scarp between its ends is exactly that body.
  // **THE CLASS: A PREDICATE SAMPLED AT VERTICES MEASURES THE VERTICES, NOT THE LINE.**
  //
  // ⚠ The crossings enter as PATH NODES rather than as a flag, because a crossing is where the
  // curtain may lawfully stop: the terminus is a point on the drawn escarpment, not near one.
  /** @type {Array<{p:[number,number], edge:any, vertex:boolean}>} */ const path = [];
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n];
    path.push({ p: a, edge: null, vertex: true });
    for (const x of segmentCrossings(cliffs, a[0], a[1], b[0], b[1])) {
      path.push({ p: x.point, edge: x.edge, vertex: false });
    }
  }
  const m = path.length;
  if (m < 4) return null;

  // ── 2 · THE FINE WALK — CLASSIFY AT THE SUBSTRATE'S OWN CELL PITCH, NOT AT THE NODES.
  //
  // ⛔⛔ AND THE MIDPOINT-PER-NODE-SEGMENT TEST WAS **STILL** WRONG, BY A MEASURED SIX. With
  // crossings inserted and midpoints classified, 35 leaves came back with 257 → 6 over-cliff
  // drawn segments and 4 fallback termini — a 97.7% cure that stubbornly would not close.
  // ⭐ THE CAUSE IS A DISAGREEMENT BETWEEN TWO HALVES OF ONE ARTIFACT, and naming it is the
  // finding: `cliffs.edges` is CORNER-CUT (`CLIFF.smooth`), which pulls the drawn line up to half
  // a cell INSIDE the cells it bounds, while `cliffs.mask` is those cells exactly. So a facet can
  // clip a masked corner **without crossing the smoothed polyline at all** — no crossing node is
  // inserted, the node-segment midpoint reads passable, and the piece is drawn over the scarp.
  // ⭐⭐ THE CURE IS THE SAME WALK `bodyRefusal` ALREADY PRESCRIBES: step the line at the CELL
  // PITCH and let any impassable sample condemn its piece. The fine walk is used for
  // CLASSIFICATION ONLY — the emitted ring keeps the circuit's own vertices plus two boundary
  // points per segment — so the wall's facet count, its run chain and its tower spacing are
  // untouched by the resolution of the test. **A TEST'S RESOLUTION AND AN ARTIFACT'S RESOLUTION
  // ARE DIFFERENT QUESTIONS**, and conflating them is how a correct test becomes a 300-vertex wall.
  const PITCH = cliffs.cell * 0.5;
  /** @type {Array<{p:[number,number], at:number}>} */ const fine = [];
  for (let i = 0; i < m; i++) {
    const a = path[i].p, b = path[(i + 1) % m].p;
    fine.push({ p: a, at: i });
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.ceil(len / PITCH));
    for (let k = 1; k < steps; k++) {
      const t = k / steps;
      fine.push({ p: /** @type {[number,number]} */ ([a[0] + dx * t, a[1] + dy * t]), at: -1 });
    }
  }
  const F = fine.length;
  /** @type {boolean[]} */ const bad = new Array(F);
  let cut = 0;
  for (let i = 0; i < F; i++) {
    const a = fine[i].p, b = fine[(i + 1) % F].p;
    // ⭐ EXACT, NOT SAMPLED — see `cliffs.segmentTouchesImpassable` for the three rounds of
    // sampled refinement that converged on 5 and stopped, and for why a tolerance would have
    // been a number fitted to this corpus.
    bad[i] = segmentTouchesImpassable(cliffs, a[0], a[1], b[0], b[1]);
    if (bad[i]) cut++;
  }
  // ⭐ NOTHING TO DO IS THE COMMON CASE AND IT RETURNS `null`, NOT AN EMPTY RESULT — so a walled
  // leaf whose circuit never meets a scarp takes the byte-identical legacy path even with the
  // feature armed. The dormancy is therefore two-layered: unarmed, and armed-but-untouched.
  if (cut === 0) return null;
  // THE FLOOR. A circuit almost entirely on impassable ground is a TRACE DEFECT, not a segmented
  // wall; cutting it would leave a sliver every downstream reader is unprepared for. ⭐ THE CLASS
  // this estate has paid for repeatedly (`cutGates`' bricked-gate roll is the same shape):
  // **A FILTER WITH NO FLOOR PRODUCES AN ARTIFACT NO CONSUMER DECLARED.** Reported, never silent.
  if (F - cut < 8) {
    return {
      ring, termini: [], terminalIdx: [], chordEdges: [], segments: 0, dropped: 0, fallbacks: 0,
      refused: `REFUSED — ${cut} of ${F} sampled circuit pieces stand on impassable relief; a wall`
        + ' almost entirely on a scarp is a trace defect, not a segmented circuit, so the'
        + ' termination is NOT applied and the fact is recorded (§577 floor)',
    };
  }

  // ⚠ ROTATE TO A CHAIN START — a passable piece whose PREDECESSOR is impassable. Starting at
  // merely "the first passable one" splits the chain straddling index 0 in two, and the circuit
  // then reports a terminus pair the ground never put there (`wallRuns.deriveRuns` coalesces from
  // the first type CHANGE for the identical reason).
  let z = -1;
  for (let i = 0; i < F; i++) if (!bad[i] && bad[(i - 1 + F) % F]) { z = i; break; }
  if (z < 0) return null;

  /** @type {Array<[number,number]>} */ const out = [];
  /** @type {Array<any>} */ const termini = [];
  /** @type {number[]} */ const terminalIdx = [];
  /** @type {number[]} */ const chordEdges = [];
  let segments = 0, fallbacks = 0, kept = 0;

  /** One terminus record. `at` is where the curtain stops or resumes; `toward` gives its facing —
   *  the direction the masonry runs from it, which is what an end-work is oriented by. */
  // ⭐⭐ **A TERMINUS NAMES ITS ESCARPMENT WHICHEVER HALF OF THE ARTIFACT PLACED IT**, and the
  // two halves are both legitimate rather than a good case and a bad one:
  //   `via: 'edge'` — the curtain met the DRAWN escarpment line, so the terminus is an analytic
  //                   crossing and carries that edge's own key and kind.
  //   `via: 'mask'` — the cell traversal condemned the piece without the smoothed line being
  //                   crossed, which happens wherever corner-cutting has pulled the drawn line
  //                   inside the cells it bounds. The GROUND is the authority on where a wall may
  //                   stand, so this is the correct stop; the edge is then named by proximity.
  // ⚠⚠ THE FIELD WAS FIRST CALLED `fallback`, AND THE NAME BECAME A LIE THE MOMENT THE TEST
  // BECAME EXACT: MEASURED, mask-derived termini went from 4 of ~400 to roughly HALF of them, so
  // a reader taking `fallback` at face value would have read the primary mechanism as a defect
  // rate. `fallback` is kept as an alias for the same boolean because a receipt already quotes
  // it, and `via` is what a consumer should read. ⭐ THE CLASS: **A FIELD NAMED FOR ITS RARITY
  // BECOMES MISINFORMATION WHEN THE MECHANISM CHANGES.**
  const nearestEdge = (at) => {
    let best = null, bd = Infinity;
    for (const e of cliffs.edges) {
      const d = distToPolyline(at[0], at[1], e.line);
      if (d < bd) { bd = d; best = e; }
    }
    // ⚠ BOUNDED. An edge two cells away is not the edge this wall stopped at; naming it anyway
    // would put a confident attribution on a coincidence.
    return best && bd <= cliffs.cell * 2 ? best : null;
  };
  const terminus = (node, at, toward) => {
    const dx0 = toward[0] - at[0], dy0 = toward[1] - at[1];
    const l = Math.sqrt(dx0 * dx0 + dy0 * dy0) || 1;
    const onEdge = node && node.edge ? node.edge : null;
    if (!onEdge) fallbacks++;
    const edge = onEdge || nearestEdge(at);
    return {
      x: at[0], y: at[1], dx: dx0 / l, dy: dy0 / l,
      // ⚠ THE KEY IS THE ESCARPMENT EDGE PLUS THE TERMINUS' OWN POSITION, never an ordinal —
      // SW-1d again. Two termini on one edge are two facts and must not share a key.
      key: `${edge ? edge.key : 'cliff.unnamed'}@${Math.round(at[0])},${Math.round(at[1])}`,
      edge: edge ? edge.key : 'cliff.unnamed',
      kind: edge ? edge.kind : 'brink',
      via: onEdge ? 'edge' : 'mask',
      fallback: !onEdge,
    };
  };
  const nodeAt = (fi) => (fine[fi].at >= 0 ? path[fine[fi].at] : null);

  // ── 3 · WALK THE CHAINS OF PASSABLE GROUND. A chain covering fine pieces s…e is emitted as its
  //    START boundary, the circuit's OWN vertices strictly inside it, and its END boundary.
  let q = 0;
  while (q < F) {
    if (bad[(z + q) % F]) { q++; continue; }
    const s = q;
    let e = q;
    while (e + 1 < F && !bad[(z + e + 1) % F]) e++;
    const si = (z + s) % F, ei = (z + e + 1) % F;
    const p0 = fine[si].p, p1 = fine[ei].p;
    const inner = [];
    for (let t = s + 1; t <= e; t++) {
      const fi = (z + t) % F;
      if (fine[fi].at >= 0) { inner.push(fine[fi].p); kept++; }
    }
    // ⚠ A CHAIN WITH NO ROOM IS NOT A RUN OF WALL. Two boundary points a hair apart would add a
    // degenerate facet and a pair of end-works to a piece of ground no masonry stands on.
    const span = Math.sqrt((p1[0] - p0[0]) * (p1[0] - p0[0]) + (p1[1] - p0[1]) * (p1[1] - p0[1]));
    if (!inner.length && span < PITCH) { q = e + 1; continue; }
    terminalIdx.push(out.length);
    termini.push(terminus(nodeAt(si), p0, inner.length ? inner[0] : p1));
    out.push(p0);
    for (const p of inner) out.push(p);
    terminalIdx.push(out.length);
    termini.push(terminus(nodeAt(ei), p1, out[out.length - 1]));
    out.push(p1);
    // THE CHORD: the edge leaving this chain's last point spans ground the wall surrendered.
    chordEdges.push(out.length - 1);
    segments++;
    q = e + 1;
  }
  if (out.length < 4) {
    return {
      ring, termini: [], terminalIdx: [], chordEdges: [], segments: 0, dropped: 0, fallbacks: 0,
      refused: `REFUSED — the cut left only ${out.length} point(s); see the §577 floor`,
    };
  }

  return {
    ring: out,
    termini,
    terminalIdx,
    chordEdges,
    segments,
    // ⚠ `dropped` COUNTS THE CIRCUIT'S OWN VERTICES, not the fine samples — the fine walk is a
    // test resolution and reporting it as a wall figure would inflate every receipt tenfold.
    dropped: n - kept,
    fallbacks,
    refused: null,
  };
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
