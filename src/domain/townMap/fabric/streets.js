/**
 * domain/townMap/fabric/streets.js — THE STREET WEB, AS NEGATIVE SPACE, WITH HIERARCHY.
 *
 * ⭐⭐ THE FABRIC LAW (§2.1): "the streets are the NEGATIVE SPACE between parcels, never
 * drawn boxes on a void." Nothing in this module draws a street. It decides how WIDE the
 * gaps are, where the through-routes run, and where the fabric is forbidden to close —
 * and the street appears because the parcels stop.
 *
 * ⭐ THE STREET HIERARCHY is the chair's §160.2 conviction made mechanical. The eyes-on
 * read was: "street hierarchy and square VOIDS barely read (the market quarter needs its
 * hole)". A fabric whose gaps are all one width is a grid of blocks, not a town. Five
 * ranks, each a different width, each sourced:
 *
 *   1 HIGH STREET      the through-route: gate to gate through the market. The widest
 *                      thing in the settlement, and §11.4's prosperity drift widens it
 *                      further. It is a REAL route, not a decorative axis: it is built
 *                      from the two strongest approach roads.
 *   2 SEAM STREET      §5.0c.3's frontier where two organisms grew together —
 *                      historically the liveliest streets in a town, because two trades
 *                      meet on them.
 *   3 ORGANISM STREET  the lane around a quarter's own body; the gap that says where one
 *                      quarter stops.
 *   4 BLOCK LANE       between block ranks.
 *   5 CROSS-ALLEY      the narrow cut THROUGH a long rank — the §160.2 fix for "strip
 *                      ranks too uniform". Real burgage ranks are punctuated by alleys
 *                      to the back yards every few plots, and their absence is exactly
 *                      what made the prototype's ranks read as corduroy.
 *
 * ⭐ SQUARES ARE HOLES IN THE FABRIC, NOT SHAPES ON IT. A market square is where the
 * parcels are FORBIDDEN, so the ground shows through — which is what a square is. The
 * market quarter gets its hole (§160.2), sized to the quarter that holds it, and the
 * §161n institution ladder puts the stall rows ON it rather than beside it.
 *
 * PURITY: pure; seeded draws come from entity-keyed forks only.
 */

import { fabricRng, hashUnit } from './fabricRng.js';
import { roadKey, nodeKey, compareKeys } from './lineage.js';
import { TRIG_N, cosI, sinI, chaikin, organicBlob, distToPolyline, ringIndex, segmentHash } from './fabricGeometry.js';
import { containChannels } from './streetEdges.js';
import { VIEW, sampleAt } from './substrate.js';
import { isInWater } from './waterMode.js';

/**
 * THE WIDTH LADDER, as multiples of the settlement's own plot frontage.
 *
 * ⭐ Expressed in PLOT FRONTAGES rather than in view units, because that is the unit a
 * medieval street actually was: a lane is "one cart wide", a high street is "three carts
 * and a market stall each side", and both scale with the module the town was laid out
 * in. Tying them to the frontage means the hierarchy survives every tier automatically —
 * a metropolis's high street is wide in absolute terms AND in relation to its own
 * houses, which is what makes tier read at a glance.
 * §42/§43 VALUES, PROPOSED-WITH-RATIONALE. ⚠ UNSOAKED; rides the tuning signature.
 */
export const STREET_LADDER = Object.freeze({
  highStreet: 2.40,
  // ⚠ THE SEAM NARROWED FROM 1.55 TO 1.00 AT MF-B3, AND THE REASON IS THAT IT NOW DRAWS.
  // MF-B2's value was chosen while the seam was only a reservation — an invisible gap in a
  // fabric floating on one flat cream field. §181.3a paints it, and MEASURED at 1.55 the
  // seam alone covered TWENTY PER CENT of a town's built-up area: a frontier street wider
  // than the high street's own carriageway, wrapping the whole contested region. §5.0c.3
  // calls the seams "often the liveliest" streets, which is a claim about TRADE, not about
  // width. At 1.00 a seam is a full street — the same carriageway as a quarter's own lane —
  // and the reservation narrows with it, so the gap and the paint stay one measurement.
  // ⚠ 1.30 RATHER THAN 1.00, AND THE PIN IS WHY: the seam's RESERVED width is `seam × 0.84`
  // (the predicate's own half-width doubled), so a ladder value of 1.00 draws a seam
  // NARROWER than a quarter lane and inverts the §160.2 hierarchy the ranks exist to carry.
  // 1.30 is the narrowest value at which the seam is still a rank above the lane.
  seam: 1.30,
  organism: 1.05,
  blockLane: 0.62,
  crossAlley: 0.30,
});

/**
 * ⭐⭐ THE LADDER'S RATIOS ARE URBAN, AND THE BOTTOM OF THE TIER LADDER MUST SCALE THEM.
 *
 * ⛔ THE DEFECT, EXPOSED BY §15.2's CORRIDOR AND WORTH RECORDING BECAUSE IT WAS ALWAYS
 * THERE: every width above is a multiple of the PLOT FRONTAGE, and the frontage at a thorp
 * is 26 view units against a city's 9. So `highStreet: 2.40` drew a THORP a high street
 * SIXTY-TWO UNITS WIDE — a quarter of the settlement's own diameter — and the forbidden-
 * ground predicate then refused every plot within 31 units of it. MEASURED: the thorp fell
 * from 5 buildings to 2 the moment a regional corridor became its main street.
 *
 * ⭐ THE RATIOS ARE READ OFF URBAN PLANS, WHERE STREET FRONTAGE IS THE SCARCE THING AND A
 * HIGH STREET IS THREE CARTS AND A STALL EACH SIDE. A village lane is a cart and a verge
 * whatever the crofts either side of it measure — the module at that tier is the CROFT, not
 * the burgage, and the lane never scaled with it. §5's own table says as much in words: a
 * thorp is "one lane / crossroads, no web"; a hamlet is "main lane + one fork". This column
 * makes the table's words true of the geometry.
 * ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, number>>}
 */
export const STREET_TIER_SCALE = Object.freeze({
  thorp: 0.30, hamlet: 0.40, village: 0.58, town: 1, city: 1, metropolis: 1,
});

/** How many plots may run before a cross-alley must break the rank. Below ~4 the rank
 * reads as detached houses; above ~9 it reads as corduroy (the §160.2 conviction). */
export const CROSS_ALLEY_EVERY = Object.freeze([4, 9]);

/**
 * How far the §15.6 bounded stitch may extend a run end to the cross street the culls cut
 * it short of — IN PLOT FRONTAGES, because the gap is where houses are missing. See the
 * note at its use for the class this corrects.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const STITCH_REACH = 3.5;

/**
 * ⭐⭐⭐ THE LADDER EVALUATED — THE ONE HOME, AND MINTING IT IS A CURE RATHER THAN A TIDY-UP.
 *
 * ⛔⛔ THE DEFECT MF-B4 MEASURED, AND IT IS WHY 62% OF A CITY WAS CARRIAGEWAY. Every width
 * above is a multiple of THE PLOT FRONTAGE. The frontage `buildStreetWeb` used is the
 * ESTIMATE `plotFrontage()` returns from the area-share law — and at town and above the
 * packer's three-pass calibration then DISCOVERS the settlement's real module and it is a
 * different number: MEASURED across the corpus, town 17.29 → 6.12, city 18.25 → 8.08,
 * metropolis 19.02 → 10.35, i.e. **the streets were laid out in a module 2.2–2.8× the one
 * the houses were drawn in.** A city high street came out 43.8 units wide against a house
 * 8.1 units wide — a boulevard five houses across, at every column gap in the town.
 *
 * ⭐⭐ THE CLASS, AND IT IS THE SHARPEST THING THIS LANE FOUND: **J-B3-3 IS TRUE AND WAS
 * STILL VIOLATED, BECAUSE THE TWO CONSUMERS READ THE ONE NUMBER AT TWO DIFFERENT TIMES.**
 * "Channel widths ARE the reservation widths — one number, never two" holds perfectly at
 * every instant; the reservation and the paint agreed with each other and BOTH disagreed
 * with the fabric, because the value was captured before the pass that corrects it.
 * **A CALIBRATED QUANTITY HAS NO MEANING BEFORE ITS CALIBRATION, AND A CONSUMER THAT READ
 * IT EARLY IS HOLDING A NUMBER THAT DESCRIBES NOTHING.**
 *
 * ⭐ THE CURE IS NOT A BETTER ESTIMATE. The implied land share the estimate needs runs
 * 0.14–0.47 across this corpus (measured: the culls — terrain, water, commons, streets,
 * compounds — differ by leaf, which is exactly why the calibration exists at all), so no
 * constant lands it. The cure is that the LADDER IS EVALUATED INSIDE THE CALIBRATION LOOP:
 * each pass re-derives its widths and its forbidden ground from THAT pass's module, so the
 * gap, the paint and the plot are one module by construction at every pass, and the last
 * pass's module is the settlement's.
 *
 * @param {number} frontage @param {string} extentTier
 * @returns {{ highStreet:number, seam:number, organism:number, blockLane:number, crossAlley:number }}
 */
export function ladderWidths(frontage, extentTier) {
  const ts = STREET_TIER_SCALE[extentTier] == null ? 1 : STREET_TIER_SCALE[extentTier];
  return {
    highStreet: frontage * STREET_LADDER.highStreet * ts,
    seam: frontage * STREET_LADDER.seam * ts,
    organism: frontage * STREET_LADDER.organism * ts,
    blockLane: frontage * STREET_LADDER.blockLane * Math.max(0.55, ts),
    crossAlley: frontage * STREET_LADDER.crossAlley * Math.max(0.55, ts),
  };
}

/**
 * @typedef {Object} StreetWeb
 * @property {number} plotFrontage
 * @property {{ highStreet:number, seam:number, organism:number, blockLane:number, crossAlley:number }} widths
 * @property {Array<{ key:string, rank:string, weight:number, line:Array<[number,number]>, gate:[number,number]|null }>} roads
 * @property {Array<[number,number]>[]} seams
 * @property {Array<{ key:string, kind:string, organismKey:string|null, center:[number,number], radius:number, polygon:Array<[number,number]> }>} squares
 * @property {Array<[number,number]>|null} highStreet
 */

/**
 * THE PLOT FRONTAGE — the module everything else is measured in.
 *
 * ⭐ This is also the divisor the TRUE SCALE BAR uses (J-TC29-9, Option A): a burgage
 * frontage is a REAL historical unit (a rod, ≈5 m), and burgage slicing is literally the
 * mechanism this fabric is built on — so the drawing measures itself by its own module
 * rather than by an invented density constant. The scale bar member reads this value.
 *
 * ⭐⭐ AT THE CENSUS TIERS THE MODULE IS THE FIXED END OF THE DERIVATION (§181.2b). The
 * extent was derived FROM this number in tierGrammar; deriving it back out of the extent
 * here would close a loop and quietly restore the area-share law the reconciliation
 * removed. So when `tierScale.plotModule` is set, it IS the frontage — returned unclamped
 * by the built radius, because the radius is its own consequence.
 *
 * @param {number} builtRadius @param {number} roofs
 * @param {{ plotModule?: number|null }} [tierScale]
 * @returns {number}
 */
export function plotFrontage(builtRadius, roofs, tierScale) {
  if (tierScale && tierScale.plotModule) return tierScale.plotModule;
  // Area per roof over the built disc, then a frontage that is WIDER than it is deep —
  // burgage plots front the street narrow, but the drawn quad is wider than deep because
  // the deep half is the yard, not the building.
  const perRoof = (3.141592653589793 * builtRadius * builtRadius * 0.58) / Math.max(1, roofs);
  const raw = Math.max(2.6, Math.sqrt(perRoof) * 1.02);
  // ⛔ THE BOTTOM-OF-THE-LADDER CLAMP (charter amendment MF-A3, measured). A thorp holds
  // about five dwellings; divide its built area by five and each 'plot' comes out wider
  // than the settlement's own radius, so not one of them survives the culls and the thorp
  // renders as empty ground. The clamp says a plot may never be more than a third of the
  // settlement's radius across — below that a dwelling stops being a dwelling and becomes
  // a field, which is precisely the failure MF-A3 measured at 61.5 units. The two-pass
  // calibration then restores the COUNT at the clamped module.
  return Math.min(raw, builtRadius * 0.30);
}

/**
 * Derive the approach roads. The COUNT is truth — it comes from the substrate's route
 * contract, which reads `config.tradeRouteAccess`.
 *
 * ⚠ ROAD-BEARING HONESTY (charter §2.4 CORRECTION, convicted at 6b337fb1). These are NOT
 * surveyed exit bearings. The landed model fills them as evenly-spaced compass slots
 * (`roadDirIdx.push((Math.round((i * 16) / roadCount) + 1) % 16)`), so the COUNT is truth
 * and the DIRECTIONS are seeded furniture. Where a campaign spatial canon exists, MF-3
 * threads TRUE neighbour bearings through the DRESS CHANNEL and they replace the slots;
 * standalone settlements keep the seeded layout, DECLARED AS SUCH rather than implied to
 * be surveyed. Everything downstream that leans on a bearing — gates, ribbon growth,
 * suburbs, field anchoring — inherits this caveat.
 *
 * The road's PATH, unlike its bearing, is honest: it is walked over the substrate,
 * refusing steep ground and standing water, so it bends for reasons.
 *
 * @param {Object} args
 * @returns {StreetWeb['roads']}
 */
export function deriveApproaches(args) {
  const { nucleus, sub, water, seeding, routeCount, grade, bearings } = args;
  /** @type {StreetWeb['roads']} */ const roads = [];
  const count = Math.max(1, routeCount);
  for (let i = 0; i < count; i++) {
    // Seeded compass slots unless TRUE bearings arrived through the dress channel.
    const idx = Array.isArray(bearings) && bearings[i] != null
      ? bearings[i]
      : Math.round((i * TRIG_N) / count) + Math.floor(hashUnit(`${seeding.seed}|approach|${i}`) * (TRIG_N / count) * 0.5);
    const ux = cosI(idx), uy = sinI(idx);
    const key = roadKey(nodeKey('edge', i), nodeKey('nucleus', 0), i === 0 ? 'high' : 'approach');
    const rng = fabricRng(seeding.seed, key, { variant: seeding.variant });

    // Walk OUTWARD from the nucleus to the frame edge, choosing easy ground each step.
    /** @type {Array<[number,number]>} */ const line = [[nucleus.x, nucleus.y]];
    let cx = nucleus.x, cy = nucleus.y;
    const STEP = 22;
    for (let s = 0; s < 60; s++) {
      if (cx < 8 || cy < 8 || cx > VIEW - 8 || cy > VIEW - 8) break;
      // A better-graded route wanders less: `grade` is the route's own quality, so a
      // critical highway runs straight and a poor track meanders around every hill.
      const swing = 0.46 * (1 - grade);
      /** @type {Array<{x:number,y:number,weight:number}>} */ const cands = [];
      for (const t of [-swing, 0, swing]) {
        const nx = ux - uy * t, ny = uy + ux * t;
        const l = Math.sqrt(nx * nx + ny * ny) || 1;
        const qx = cx + (nx / l) * STEP, qy = cy + (ny / l) * STEP;
        const slope = sampleAt(sub, sub.slope, qx, qy);
        const wetness = sampleAt(sub, sub.wet, qx, qy);
        cands.push({ x: qx, y: qy, weight: Math.max(0.001, (1 - slope) * (1 - wetness * 0.8) * (t === 0 ? 1.6 : 1)) });
      }
      const chosen = cands[rng.weighted(cands)];
      cx = chosen.x; cy = chosen.y;
      line.push([cx, cy]);
    }
    // Push the last point cleanly off the frame so the road leaves the leaf.
    line.push([cx + ux * 60, cy + uy * 60]);
    line.reverse();                                  // frame edge → nucleus, reading order
    roads.push({
      key,
      rank: i === 0 ? 'high' : 'approach',
      weight: i === 0 ? 4 : Math.max(1, 3 - Math.floor(i / 2)),
      line: chaikin(line, 2, false),
      gate: null,
    });
  }
  void water;
  return roads;
}

/**
 * THE HIGH STREET — the through-route. Built by joining the two strongest approaches
 * THROUGH the nucleus, so it is a real route across the settlement rather than a stripe
 * drawn for composition. Where only one approach exists (an isolated thorp), there is no
 * through-route and this returns null: a dead-end settlement has a lane, not a high
 * street, and pretending otherwise is the kind of furniture §8.2 cuts.
 * @param {StreetWeb['roads']} roads @param {{x:number,y:number}} nucleus
 * @returns {Array<[number,number]>|null}
 */
export function deriveHighStreet(roads, nucleus) {
  if (roads.length < 2) return null;
  const ranked = roads.slice().sort((a, b) => (b.weight - a.weight) || compareKeys(a.key, b.key));
  const a = ranked[0], b = ranked[1];
  /** @type {Array<[number,number]>} */
  const line = a.line.slice();
  line.push([nucleus.x, nucleus.y]);
  for (let i = b.line.length - 1; i >= 0; i--) line.push(b.line[i]);
  return chaikin(line, 1, false);
}

/**
 * THE SQUARES — holes in the fabric (§160.2's "the market quarter needs its hole").
 *
 * One at the settlement's own heart, sized by tier, plus one per qualifying organism at
 * city scale and above (§5's "squares plural"). A square's SIZE is a share of its
 * organism's reach, so a great market quarter has a great market place and a parish has
 * a churchyard — the hole tells you what the quarter is before any label does.
 *
 * @param {Object} args @returns {StreetWeb['squares']}
 */
export function deriveSquares(args) {
  const { organisms, nucleus, tierScale: scale, seeding, water } = args;
  const partition = args.partition || null;

  // ⛔⛔ A SQUARE WAS SIZED AGAINST THE SETTLEMENT AND AGAINST THE QUARTER'S INFLUENCE
  // RADIUS — NEVER AGAINST THE GROUND THE QUARTER ACTUALLY HOLDS.
  //
  // An organism's `reach` is the radius of its influence FIELD; its BODY is whatever ground
  // that field actually won, and the two come apart badly wherever something took the
  // difference. MEASURED on the coastal city: `religious_quarter` reached 235 units and
  // held 67 dry partition cells (an equivalent radius of ~36), and the per-organism square
  // came out at radius 32 — a churchyard covering FOUR FIFTHS OF ITS OWN PARISH. Every plot
  // in the quarter then died on the forbidden-ground test and §161e.1's proof went red.
  // ⭐ THE CLASS, and it is the third time this lane has met it: a quantity derived from a
  // POTENTIAL (a reach, a band, a budget) is not a quantity derived from the ACTUAL, and
  // wherever the two can diverge the drawing has to read the actual.
  const bodyRadius = new Map();
  if (partition) {
    const counts = new Array(organisms.length).fill(0);
    for (let k = 0; k < partition.inside.length; k++) {
      if (partition.inside[k] !== 1) continue;
      const o = partition.owner[k];
      if (o >= 0 && o < counts.length) counts[o]++;
    }
    const cellArea = partition.cell * partition.cell;
    for (let i = 0; i < organisms.length; i++) {
      bodyRadius.set(organisms[i].key, Math.sqrt((counts[i] * cellArea) / 3.141592653589793));
    }
  }
  /** @type {StreetWeb['squares']} */ const squares = [];

  // ⛔ A SQUARE IS SIZED AGAINST THE SETTLEMENT, NEVER AGAINST A QUARTER'S REACH ALONE.
  // The per-organism radius below used to be `org.reach × 0.26` with no ceiling, which was
  // survivable only while the reach was being divided by √N; once the organisms grew to
  // their proper §5 extent the same expression produced a CITY market place 220 units
  // across — three of them overlapping carved a void a fifth of the leaf wide out of the
  // middle of the fabric, and the wall then wrapped a town with a hole in it. Historically
  // even a great market place is a small share of a city's extent: it is the ground a
  // market can be held on, not a district.
  // ⭐ §16.4 — THE VILLAGE CENTRE ANCHORS THE COMPOSITION, so it is sized as a CENTRE and
  // not as a scaled-down market place. §5's own row for the tier is "green or market
  // cross": a village green is a large share of a village, which is precisely what makes a
  // village read as a village rather than as a small town. The urban tiers keep the tight
  // share a great market place actually occupied (see the note above about the 220-unit
  // hole a proportional reading carved out of a city).
  const HEART_SHARE = { thorp: 0.20, hamlet: 0.18, village: 0.155 };
  const heartR = scale.builtRadius
    * (HEART_SHARE[scale.extentTier] == null ? 0.105 : HEART_SHARE[scale.extentTier]);
  const heartRng = fabricRng(seeding.seed, 'square.heart', { variant: seeding.variant });
  squares.push({
    key: 'square.heart',
    kind: scale.squareKind === 'well' ? 'well' : scale.squareKind === 'green' ? 'green' : 'market',
    organismKey: null,
    center: [nucleus.x, nucleus.y],
    radius: heartR,
    polygon: organicBlob(nucleus.x, nucleus.y, heartR, heartRng, { steps: 12, rough: 0.17 }),
  });

  if (scale.squareKind !== 'market-plural') return squares;

  // §5 SQUARES PLURAL. Which organisms earn one is a fact, not a quota: a civic quarter
  // has a hall and therefore a place in front of it; a religious quarter has a
  // churchyard; a merchant quarter has a market. The rest have streets.
  const EARNS = new Set(['civic', 'religious', 'merchant']);
  const ordered = organisms.slice()
    .filter((o) => EARNS.has(o.category))
    .sort((a, b) => (b.weight - a.weight) || compareKeys(a.key, b.key));
  const cap = scale.tier === 'metropolis' ? 3 : 2;
  for (const org of ordered.slice(0, cap)) {
    // §42/§43 VALUE: 0.34 of the quarter's own body radius is about an eighth of its
    // ground — the share a churchyard or a small place actually occupied. A quarter with no
    // room for both a square and a parish keeps its streets, which is also the truth.
    const body = bodyRadius.has(org.key) ? bodyRadius.get(org.key) : Infinity;
    const r = Math.min(org.reach * 0.26, scale.builtRadius * 0.075, body * 0.34);
    if (r < scale.builtRadius * 0.035) continue;
    const cx = org.anchor.x, cy = org.anchor.y;
    if (isInWater(water, cx, cy)) continue;
    // NO TWO SQUARES MAY EAT THE SAME GROUND. A quarter whose own place would sit on top of
    // the market keeps its streets instead — which is also the truth: a parish beside the
    // market never had a second market place, it used the one that was there.
    let clash = false;
    for (const s of squares) {
      const dx = s.center[0] - cx, dy = s.center[1] - cy;
      if (Math.sqrt(dx * dx + dy * dy) < (s.radius + r) * 1.15) { clash = true; break; }
    }
    if (clash) continue;
    const rng = fabricRng(seeding.seed, `square.${org.key}`, { variant: seeding.variant, changeYear: org.changeYear });
    squares.push({
      key: `square.${org.key}`,
      kind: org.category === 'civic' ? 'civic' : org.category === 'religious' ? 'churchyard' : 'market',
      organismKey: org.key,
      center: [cx, cy],
      radius: r,
      polygon: organicBlob(cx, cy, r, rng, { steps: 11, rough: 0.16 }),
    });
  }
  return squares;
}

/**
 * Assemble the street web.
 * @param {Object} args @returns {StreetWeb}
 */
export function buildStreetWeb(args) {
  const { organisms, umbrella, nucleus, sub, water, tierScale: scale, seeding, bearings } = args;
  const routes = args.routes || null;
  const frontage = plotFrontage(scale.builtRadius, scale.roofs, scale);
  // The ladder's ratios are urban; at the census tiers a lane is a lane (see
  // STREET_TIER_SCALE for the thorp that lost three of its five houses to its own street).
  // ⚠ THESE ARE THE ESTIMATE'S WIDTHS AND THEY ARE PROVISIONAL. The calibration inside
  // packFabric re-derives them at each pass's module (see ladderWidths' header for the
  // 2.2–2.8× mismatch this closes); `packed.widths` is the settlement's real ladder and
  // everything drawn reads THAT.
  const widths = ladderWidths(frontage, scale.extentTier);

  // ⭐⭐ §15.2 THE ROADS ARE THE SKELETON'S, NOT THE TOWN'S — and this is the half of the
  // peer review's adoption that actually changes the drawing. With the corridors walked
  // BEFORE the site (routes.js) and the approaches still walked OUT FROM the nucleus, the
  // leaf carried TWO road systems that had never met: regional corridors crossing the
  // frame, and a spoke of town roads radiating from the market. Binding them is what makes
  // the plan say "this town is here because the road is here" instead of "these roads exist
  // because this town does".
  //
  // A settlement relates to a regional route in exactly two ways, and both are drawn:
  //   • the CORRIDOR runs across the leaf whether the town is there or not;
  //   • a SPUR joins the town to it, unless the town sits on it already.
  const roads = routes && routes.corridors.length
    ? bindToSkeleton(routes, nucleus, sub, seeding, scale)
    : deriveApproaches({
      nucleus, sub, water, seeding,
      routeCount: sub.route.roads,
      grade: sub.route.grade,
      bearings,
    });
  // ⭐ THE HIGH STREET IS THE CORRIDOR THROUGH THE TOWN where one passes close enough to
  // BE the town's main street — which is the historical rule, not a composition choice: a
  // road town's high street IS the road, and its market is a widening of it. Where no
  // corridor comes near, the two strongest approaches join through the nucleus as before.
  const highStreet = (routes && corridorHighStreet(routes, nucleus, scale))
    || deriveHighStreet(roads, nucleus);
  const squares = deriveSquares({
    organisms, nucleus, tierScale: scale, seeding, water,
    // The partition is what says how much ground each quarter ACTUALLY holds.
    partition: args.partition || null,
  });

  return {
    plotFrontage: frontage,
    widths,
    roads,
    seams: umbrella.seams,
    squares,
    highStreet,
    // The lanes are derived BEFORE the partition (they are its ribbons) and threaded in
    // here, so the web that is drawn and the web that shaped the umbrella are one object.
    lanes: args.lanes || [],
  };
}

/**
 * ⭐⭐⭐ THE STREET WEB AS A WEB (§181.3a) — the largest distance MF-B2 measured to hf30,
 * and the mechanism is the INVERSE of the block-run cure.
 *
 * ⛔ WHY THE FABRIC HAD NO STREETS EVEN THOUGH EVERY STREET WAS DERIVED. §2.1 says the
 * street is the NEGATIVE SPACE between parcels, and the lens took that literally: it
 * flooded the whole umbrella in the road tone and let the blocks sit on it. Every gap was
 * therefore a street — the alley between two ranks, the ground a terrain cull refused, the
 * paddock nobody built on, the wedge left where two quarters failed to meet. A settlement
 * whose every gap is a street has NO STREETS, because a street is a thing you can follow
 * and the eye cannot follow a field. MEASURED at MF-B2: a city leaf carried ONE continuous
 * cream region of 51% of the umbrella and 215 blocks floating in it.
 *
 * ⭐ THE CLASS, and it is worth the chair's attention because it generalizes: NEGATIVE
 * SPACE IS A DRAWING TECHNIQUE, NOT A DERIVATION. "The street is where the buildings are
 * not" is true of the ink and false of the fact. Which gaps are STREETS is a fact about the
 * settlement — it is the thing the cart drives along — and a fact has to be derived and
 * named before it can be drawn. So the channels below are the derivation, with a RANK and
 * a WIDTH apiece, and the ink pass paints the web rather than the residue.
 *
 * ⭐ EVERY WIDTH BELOW IS THE ONE THE FORBIDDEN-GROUND PREDICATE ALREADY USED. The channel
 * is the ground the packer was refused, so the drawn street lands exactly on the gap the
 * fabric left — one measurement, two consumers. A channel wider than its reservation would
 * paint over houses; a narrower one would leave a pale rind along every rank.
 *
 * THE SEVEN RANKS, in the §160.2 hierarchy, each from a source that already existed:
 *   high       the through-route (the corridor through the town, or two approaches joined)
 *   artery     the approach roads / regional corridors, through the gates
 *   seam       §5.0c.3's frontier where two organisms grew together
 *   lane       the quarter lanes: radials to the heart, and the rim between quarters
 *   blockCross the grid's own column gap — the ACROSS-grain street, staggered by morphology
 *   blockLane  the street each rank run FRONTS ONTO — merged along the organism's grain
 *   alley      the cross-alleys the packer cut through its ranks
 *
 * ⭐ AND THE BLOCK LANES ARE WHY THE GRAIN READS. Each organism's rank runs are laid in
 * ITS OWN grain, so merging their front lines produces a street grid at that quarter's
 * angle — and the change of angle at a quarter boundary becomes a STREET pattern rather
 * than only a roof pattern. §5.0c.5's "each district's fabric visibly REMEMBERS its own
 * growth direction" was true of the buildings and invisible in the ground; this is what
 * makes it legible at a glance.
 *
 * @param {Object} args
 * @returns {{ channels: Array<any>, reason: string }}
 */
export function buildStreetChannels(args) {
  const { web, blocks, alleys, tierScale: scale, accentBand } = args;
  /** @type {Array<any>} */ let channels = [];
  const W = web.widths;

  // ⭐⭐⭐ ⟦SW-1a⟧ **THE CHANNEL TAKES ITS OWN COPY OF THE LINE, AND THAT IS THE WHOLE OF SW-1a.**
  // SW-1 (laneMFD1-receipt §8.4): *"no two versions may share a mutable sub-object."*
  // ⛔ MEASURED AT MF-D1: **68 of 8,996 published channels carried a `line` object that IS a
  //    published web geometry object** — `street.high ≡ web.highStreet` and the two arteries
  //    `≡ web.roads[i].line`, on every one of the seventeen leaves. `fabric.channels` and
  //    `fabric.web` are two versions of the street artifact and they were sharing four arrays.
  //    Nothing mutates them TODAY; the whole hazard is that nothing has to change for that to
  //    stop being true, and an in-place stitch would then edit a version it was not handed.
  // ⚠⚠ AND IT IS A COPY TO THE POINT, NOT A `.slice()`. A shallow slice shares every `[x,y]`
  //    pair, so a stitch that moved a vertex would still reach across the versions — the alias
  //    would simply be one level deeper and no census would name it. Four polylines a leaf is
  //    not a cost worth trading a version boundary for. The seams and lanes are already private
  //    to `buildStreetWeb` and are copied here for one rule, not two.
  const own = (line) => line.map((p) => /** @type {[number,number]} */ ([p[0], p[1]]));
  if (web.highStreet && web.highStreet.length >= 2) {
    channels.push({ key: 'street.high', rank: 'high', width: W.highStreet * 1.10, line: own(web.highStreet) });
  }
  for (const rd of web.roads) {
    channels.push({
      key: `street.${rd.key}`,
      rank: 'artery',
      width: (rd.rank === 'high' ? W.highStreet : W.organism * 1.35) * 1.10,
      line: own(rd.line),
      gateward: true,
    });
  }
  for (let i = 0; i < web.seams.length; i++) {
    channels.push({ key: `street.seam.${i}`, rank: 'seam', width: W.seam * 0.84, line: own(web.seams[i]) });
  }
  for (const ln of (web.lanes || [])) {
    channels.push({ key: `street.${ln.key}`, rank: 'lane', width: W.organism, line: own(ln.line) });
  }

  // ── THE BLOCK LANES. Rank runs that share an organism, a row and a rank share ONE front
  //    line by construction (the row's own `frontV` in the organism's frame), so their
  //    front segments are collinear and merge into the street they all face.
  /** @type {Map<string, Array<any>>} */ const byLine = new Map();
  for (const b of (blocks || [])) {
    if (!b || !b.front) continue;
    const gk = `${b.organismKey}|${b.row}|${b.rank}`;
    const bucket = byLine.get(gk);
    if (bucket) bucket.push(b); else byLine.set(gk, [b]);
  }
  for (const gk of [...byLine.keys()].sort(compareKeys)) {
    const group = byLine.get(gk);
    const ang = group[0].grainAngle;
    const ux = cosI(ang), uy = sinI(ang);
    const p0 = group[0].front[0];
    // ⛔⛔ THE FRONTAGE LINE IS THE KERB, NOT THE CROWN OF THE STREET, and centring the
    // channel on it painted HALF OF EVERY CARRIAGEWAY OVER THE HOUSES THAT FRONT IT.
    // MEASURED by rasterizing the umbrella: 72% of a town's built-up area came back as
    // "street" and only 4% as "building", against MF-B2's 19% built — the buildings had not
    // moved at all; the paint had. ⭐ THE CLASS: a boundary line and a centreline are
    // different objects, and a width applied to the wrong one is applied in both directions.
    // The block's own record carries its back line, so the direction AWAY from the block is
    // known exactly, and the channel is offset half a width along it.
    const b0 = group[0];
    let ox = b0.front[0][0] - b0.backLine[0][0], oy = b0.front[0][1] - b0.backLine[0][1];
    const ol = Math.sqrt(ox * ox + oy * oy) || 1;
    ox /= ol; oy /= ol;
    const off = W.blockLane * 0.5;
    /** @type {Array<[number,number]>} */ const spans = [];
    for (const b of group) {
      const a = (b.front[0][0] - p0[0]) * ux + (b.front[0][1] - p0[1]) * uy;
      const c = (b.front[1][0] - p0[0]) * ux + (b.front[1][1] - p0[1]) * uy;
      spans.push(a <= c ? [a, c] : [c, a]);
    }
    spans.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    // ⭐⭐ THE JOIN TOLERANCE IS THE SAME MEASURE THE STITCH USES, AND MAKING IT SO IS A
    // CURE. It used to be the grid's own column gap (`W.organism × 1.6`) — a fact about the
    // CROSS street. But the question this tolerance answers is "are these two runs stretches
    // of one street?", and the thing that separates them is MISSING HOUSES: the culls broke
    // the run. §15.6's bounded stitch already owns that measure (STITCH_REACH, in plot
    // frontages, "three or four missing houses"), so the merge and the repair now read ONE
    // number instead of two that mean nearly the same thing and drift apart.
    // ⛔ IT DRIFTED, MEASURED. When §17.4's body cull made the culls bite properly the runs
    // broke far more often, and at the old tolerance a village's carriageway web fell into
    // FOURTEEN components with 0.565 of its channels off the heart's own web — against 0.93
    // before. Not one street had moved; the fabric had simply stopped standing in the road.
    const joinGap = web.plotFrontage * STITCH_REACH;
    let curA = spans[0][0], curB = spans[0][1], serial = 0;
    const emit = (a, b) => {
      // A single plot's frontage is a doorstep, not a street; two is a street.
      if (b - a < web.plotFrontage * 1.6) return;
      channels.push({
        key: `street.block.${gk}#${serial++}`,
        organismKey: group[0].organismKey,
        rank: 'blockLane',
        width: W.blockLane,
        line: [
          [p0[0] + ux * a + ox * off, p0[1] + uy * a + oy * off],
          [p0[0] + ux * b + ox * off, p0[1] + uy * b + oy * off],
        ],
      });
    };
    for (let i = 1; i < spans.length; i++) {
      if (spans[i][0] - curB <= joinGap) { if (spans[i][1] > curB) curB = spans[i][1]; continue; }
      emit(curA, curB);
      curA = spans[i][0]; curB = spans[i][1];
    }
    emit(curA, curB);
  }

  // ── THE CROSS STREETS — THE ACROSS-GRAIN HALF OF THE BLOCK GRID, and without it the web
  //    is a comb rather than a web.
  //
  // ⛔ MEASURED WITH ONLY THE FRONT LINES DRAWN: a city leaf came back with 14 disconnected
  //    street components and 100 dead ends. Every rank run fronts a street that runs ALONG
  //    the quarter's grain, and nothing joined one to the next — the ink read as a set of
  //    parallel scratches. The packer leaves a gap of exactly `widths.organism` between its
  //    columns, so the cross street was already reserved ground; it was simply never named.
  //
  // ⭐ AND THE STAGGER IS THE HISTORY. Each row of the grid carries its own `rowShift`
  //    (scaled by the morphology's own `blockRegular`), so an ORGANIC quarter's cross
  //    streets do not line up across the rows — they arrive as the staggered T-junctions
  //    real accreted towns are made of — while a PLANNED one's line up into true
  //    crossroads. One derivation, and the morphology reads in the street pattern.
  //
  // ⚠ A CROSS STREET NEEDS TWO SIDES. A cluster with a single contributing run-end is one
  //    rank stopping — the ragged edge, a terrain refusal, a compound — and drawing a
  //    street there would be a way to nowhere. Two or more is a junction.
  /** @type {Map<string, Array<any>>} */ const byOrg = new Map();
  for (const b of (blocks || [])) {
    if (!b || !b.front || !b.backLine) continue;
    const bucket = byOrg.get(b.organismKey);
    if (bucket) bucket.push(b); else byOrg.set(b.organismKey, [b]);
  }
  for (const ok of [...byOrg.keys()].sort(compareKeys)) {
    const group = byOrg.get(ok);
    const ang = group[0].grainAngle;
    const ux = cosI(ang), uy = sinI(ang);
    const vx = -uy, vy = ux;
    const O = group[0].front[0];
    const proj = (p) => [
      (p[0] - O[0]) * ux + (p[1] - O[1]) * uy,
      (p[0] - O[0]) * vx + (p[1] - O[1]) * vy,
    ];
    /** @type {Array<{u:number, v0:number, v1:number}>} */ const cands = [];
    for (const b of group) {
      if (!b.gapBefore || !b.gapAfter) continue;
      const a = proj(b.front[0]), d = proj(b.backLine[0]);
      const pad = W.blockLane * 0.6;
      const v0 = Math.min(a[1], d[1]) - pad, v1 = Math.max(a[1], d[1]) + pad;
      // ⭐ THE CANDIDATES ARE THE GRID'S OWN COLUMN GAPS, not the run's ends. See the note
      // on `gapBefore`/`gapAfter` in parcels.js for the 37%-of-the-city that fixed.
      cands.push({ u: proj(b.gapBefore)[0], v0, v1 });
      cands.push({ u: proj(b.gapAfter)[0], v0, v1 });
    }
    if (!cands.length) continue;
    cands.sort((a, b) => a.u - b.u || a.v0 - b.v0);
    const uTol = W.organism * 0.75;
    let i = 0, serial = 0;
    while (i < cands.length) {
      let j = i;
      let uSum = 0;
      while (j < cands.length && cands[j].u - cands[i].u <= uTol) { uSum += cands[j].u; j++; }
      const cluster = cands.slice(i, j);
      const uMid = uSum / cluster.length;
      // Merge the cluster's v-intervals; a gap wider than one block lane is two streets.
      const iv = cluster.slice().sort((a, b) => a.v0 - b.v0 || a.v1 - b.v1);
      let cur = { v0: iv[0].v0, v1: iv[0].v1, n: 1 };
      const flush = () => {
        if (cur.n < 2) return;
        channels.push({
          key: `street.cross.${ok}#${serial++}`,
          organismKey: ok,
          rank: 'blockCross',
          width: W.organism,
          line: [
            [O[0] + ux * uMid + vx * cur.v0, O[1] + uy * uMid + vy * cur.v0],
            [O[0] + ux * uMid + vx * cur.v1, O[1] + uy * uMid + vy * cur.v1],
          ],
        });
      };
      for (let k = 1; k < iv.length; k++) {
        if (iv[k].v0 - cur.v1 <= W.blockLane * 1.5) {
          if (iv[k].v1 > cur.v1) cur.v1 = iv[k].v1;
          cur.n++;
          continue;
        }
        flush();
        cur = { v0: iv[k].v0, v1: iv[k].v1, n: 1 };
      }
      flush();
      i = j;
    }
  }

  // ── THE CROSS-ALLEYS, rationed by the tier's accent band. An alley is the narrowest rank
  //    and the most numerous; at the top of the ladder it is also the least legible, which
  //    is exactly the ration §9.3 exists to express.
  // ── §17.6 THE THROUGH-PASSAGES — the web's informal LOWEST RANK. Person-wide, never
  //    cart-wide (see ALLEY_GAP), and they may NOT be blocked: the §17.4 enforcement reads
  //    them as claims exactly like a carriageway, which is what "may not be blocked" means
  //    in a derivation rather than in prose. They are NOT rationed by the accent band — a
  //    passage is the only way to the back yards of the row it serves, so cutting one for
  //    ink is cutting a right of way.
  for (const pg of ((args.passages || []).slice().sort((a, b) => compareKeys(a.key, b.key)))) {
    channels.push({ key: `street.${pg.key}`, rank: 'passage', width: pg.width, line: pg.line, reason: pg.reason });
  }

  const alleyList = (alleys || []).slice().sort((a, b) => compareKeys(a.key, b.key));
  const alleyCap = Math.round(alleyList.length * Math.min(1, Math.max(0.18, accentBand)));
  for (let i = 0; i < alleyList.length; i++) {
    if (i >= alleyCap) break;
    channels.push({ key: `street.${alleyList[i].key}`, rank: 'alley', width: W.crossAlley, line: alleyList[i].line });
  }

  // ── THE BOUNDED STITCH (§15.6's repair idiom, applied to the web).
  //
  // ⛔ WHY THE GAPS EXIST AT ALL, and it is a fact about the fabric rather than about the
  //    street: a rank run ENDS wherever the packer's culls refused the next plot — the
  //    ragged umbrella edge, a terrain refusal, a reserved compound. The street the run
  //    fronted stops with it, a couple of plot-widths short of the cross street it was
  //    plainly running toward, and the leaf grows a stub. MEASURED before this pass: 12–32
  //    STRANDED ends per leaf (an end that is not an alley and touches nothing).
  //
  // ⭐ THE REPAIR IS AN EXTENSION, NOT A NEW STREET, and the distinction is the whole
  //    licence for it. The gap is where a HOUSE is missing, not where a street was missing:
  //    the carriageway either side of a cull is the same carriageway. So an end within a
  //    bounded reach of another channel is extended to meet it, along its own bearing —
  //    never bent, never routed. Out of reach, it stays a dead end and is COUNTED.
  //
  // ⚠ BOUNDED AND DIAGNOSED, per §15.6: one pass, a fixed reach, every repair reported.
  //    It does not iterate, so it cannot converge on anything, and it reads only the
  //    channel set as it stands.
  // ── CONTAINMENT, BEFORE THE STITCH AND NOT AFTER (MF-B4).
  // ⚠ THE ORDER IS LOAD-BEARING AND THE FIRST SPELLING HAD IT BACKWARDS. Containing after
  // the stitch cuts the very extensions the stitch just made, so the repair pass spends its
  // budget joining ends that are then severed again — MEASURED, stranded ends went 10% →
  // 29% and the web fell into 28 components. Contained FIRST, the stitch sees the channel
  // set the leaf will actually draw and joins THOSE ends, which is what it exists to do.
  let contained = { dropped: 0, split: 0, reason: 'containment not requested' };
  if (args.umbrella) {
    contained = containChannels(channels, args.umbrella, { frontage: web.plotFrontage });
    channels = contained.channels;
  }

  let stitched = 0;
  {
    // ⭐⭐ THE REACH IS MEASURED IN HOUSES, NOT IN STREET WIDTHS — and correcting it is the
    // THIRD member of the family MF-B3 recorded ("a length in the drawing's own units is a
    // constant wearing a distance's name"). MF-B3 wrote `c.width * 2.4`, so the repair's
    // reach was a property of THE STREET; but the gap this pass repairs is where a HOUSE is
    // missing (§15.6's own words), so its size is a property of THE FABRIC. The two were
    // proportional only while one module served both, and the moment MF-B4's calibration
    // made the module honest they came apart: MEASURED, stranded ends went 6–10% → 18.8% on
    // an unchanged repair, because a blockLane's width had fallen with the module while the
    // culls still eat three or four plots at a time.
    // §42/§43 VALUE: 3.5 frontages is three or four missing houses — the size of a terrain
    // refusal or a compound's shoulder. ⚠ UNSOAKED; rides the tuning signature.
    const reach = () => W.blockLane * (STITCH_REACH / STREET_LADDER.blockLane);
    // ⚠ THE NEIGHBOURHOOD INDEX IS NOT AN OPTIMIZATION DETAIL — IT IS WHAT KEEPS THE PASS
    // FROM BEING QUADRATIC IN A QUANTITY THAT GROWS WITH THE TIER. MEASURED without it: a
    // city leaf took 6.9 SECONDS to build and the village pin TIMED OUT at 5 s, because
    // both the stitch and the dead-end walk compared every channel against every other and
    // a city carries 300+ of them. The index is a plain bbox bucket; the RESULT is
    // identical because a channel outside the query radius could not have been in reach.
    const idx = channelIndex(channels);
    for (let ci = 0; ci < channels.length; ci++) {
      const c = channels[ci];
      if (c.rank !== 'blockLane' && c.rank !== 'blockCross') continue;
      for (const endIdx of [0, c.line.length - 1]) {
        const end = c.line[endIdx];
        const prev = c.line[endIdx === 0 ? 1 : c.line.length - 2];
        const dx = end[0] - prev[0], dy = end[1] - prev[1];
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d === 0) continue;
        const ux2 = dx / d, uy2 = dy / d;
        let touched = false, bestT = Infinity;
        for (const oi of idx.near(end[0], end[1], reach() + idx.maxWidth)) {
          const o = channels[oi];
          if (o === c) continue;
          const dd = distToPolyline(end[0], end[1], o.line);
          if (dd <= (c.width + o.width) * 0.5 * 1.05) { touched = true; break; }
          if (dd > reach()) continue;
          // Walk out along the channel's own bearing to the first point that meets `o`.
          for (let t = 1; t <= 12; t++) {
            const tt = (reach() * t) / 12;
            const px = end[0] + ux2 * tt, py = end[1] + uy2 * tt;
            if (distToPolyline(px, py, o.line) <= (c.width + o.width) * 0.5) {
              if (tt < bestT) bestT = tt;
              break;
            }
          }
        }
        if (touched || bestT === Infinity) continue;
        c.line[endIdx] = [end[0] + ux2 * bestT, end[1] + uy2 * bestT];
        stitched++;
      }
    }
  }

  return {
    channels,
    stitched,
    dropped: contained.dropped,
    split: contained.split,
    containReason: contained.reason,
    reason: `${channels.length} street channels in seven ranks at ${scale.extentTier}`
      + ` (${stitched} run-ends extended to the cross street the cull cut them short of)`
      + `; ${channels.filter((c) => c.rank === 'blockLane').length} block lanes merged from`
      + ` ${(blocks || []).length} rank runs, ${alleyCap} of ${alleyList.length} alleys drawn at the tier's accent ration`,
  };
}

/**
 * ⭐⭐ THE CONNECTIVITY PROOF — "trace a cart from any gate to the square without leaving
 * pale ground" (§181.3a's own acceptance test), executed rather than asserted.
 *
 * Two channels are ADJACENT when their carriageways overlap: the distance between them
 * falls inside the sum of their half-widths. That is not a proxy for connectivity, it IS
 * connectivity — two overlapping carriageways are one continuous piece of pale ground, and
 * a cart on one is on the other. Union-find over that relation gives the web's components;
 * the gate test asks whether every artery shares a component with the market square.
 *
 * ⚠ THE SAMPLING IS DECLARED. Polylines are sampled at a fixed pitch and bucketed into a
 * grid, so the relation is computed in near-linear time; a pair whose carriageways cross
 * ONLY between two samples could in principle be missed. The pitch is half the narrowest
 * rank's width, so a missed crossing would have to be narrower than the alley it crosses.
 *
 * @param {Object} args
 * @returns {{ components:number, heartComponent:number, gates:number, gatesConnected:number,
 *             deadEnds:number, connectedShare:number, reason:string }}
 */
export function webConnectivity(args) {
  // ⭐⭐ THE CART PROOF COUNTS CARRIAGEWAYS, AND A §17.6 PASSAGE IS NOT ONE. §181.3a's own
  // acceptance test is "trace a CART from any gate to the square without leaving pale
  // ground"; a through-passage is PERSON-WIDE BY LAW (that is what distinguishes it from an
  // alley), so a cart cannot use it and it cannot carry the proof either way. Counting them
  // DILUTED the measure badly — MEASURED on the village, `connectedShare` fell from 0.93 to
  // 0.69 the moment §17.6 landed, not because any street had changed but because thirty
  // person-wide gaps had joined the denominator of a claim about carts.
  // ⭐ THE CLASS: a proof's DENOMINATOR is part of its claim, and widening the population it
  // measures over changes what it says without changing a line of the assertion.
  // ⚠ They remain in `fabric.channels` and therefore in the §17.4 claim set, which is what
  // "a passage may not be blocked" means in a derivation.
  args = { ...args, channels: (args.channels || []).filter((c) => c.rank !== 'passage') };
  const { channels, squares } = args;
  const n = channels.length;
  if (n === 0) {
    return {
      components: 0, heartComponent: -1, gates: 0, gatesConnected: 0, deadEnds: 0, stranded: 0, edgeEnds: 0,
      connectedShare: 0, reason: 'no channels: this settlement has no street web',
    };
  }
  const parent = new Array(n);
  for (let i = 0; i < n; i++) parent[i] = i;
  const find = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra > rb ? ra : rb] = ra > rb ? rb : ra; };

  let maxW = 0;
  for (const c of channels) if (c.width > maxW) maxW = c.width;
  const pitch = Math.max(2, maxW * 0.35);
  const cell = Math.max(6, maxW);
  /** @type {Map<string, Array<{i:number,x:number,y:number,w:number}>>} */ const grid = new Map();
  const put = (i, x, y, w) => {
    const k = `${Math.floor(x / cell)}|${Math.floor(y / cell)}`;
    const b = grid.get(k);
    if (b) b.push({ i, x, y, w }); else grid.set(k, [{ i, x, y, w }]);
  };
  for (let i = 0; i < n; i++) {
    const c = channels[i];
    for (let s = 0; s < c.line.length - 1; s++) {
      const a = c.line[s], b = c.line[s + 1];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const d = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.min(240, Math.ceil(d / pitch)));
      for (let t = 0; t <= steps; t++) put(i, a[0] + dx * (t / steps), a[1] + dy * (t / steps), c.width);
    }
  }
  for (const [k, bucket] of [...grid.entries()].sort((a, b) => compareKeys(a[0], b[0]))) {
    const [gi, gj] = k.split('|').map(Number);
    for (let dj = -1; dj <= 1; dj++) {
      for (let di = -1; di <= 1; di++) {
        const other = grid.get(`${gi + di}|${gj + dj}`);
        if (!other) continue;
        for (const p of bucket) {
          for (const q of other) {
            if (p.i === q.i) continue;
            const dx = p.x - q.x, dy = p.y - q.y;
            if (Math.sqrt(dx * dx + dy * dy) <= (p.w + q.w) * 0.5 * 1.05) union(p.i, q.i);
          }
        }
      }
    }
  }

  // ⭐⭐⭐ A SQUARE IS A CROSSING, NOT A BARRIER (MF-B5). Every void the web fronts JOINS the
  // channels that front it, because that is what a market place physically is: the largest
  // junction in the town, which a cart enters by one mouth and leaves by another.
  //
  // ⛔ WHAT WAS WRONG, AND IT WAS A MEASURE AND A MODEL AT THE SAME TIME. The old spelling
  // took the heart to be the component of the ONE channel nearest the first square — so a
  // square fronted by eleven streets was represented by whichever stub happened to pass
  // closest, and the union never crossed the square at all. MEASURED on the city fixture:
  // 23 components, the "heart" holding 3% of the channels, and 0 of 2 gates reaching the
  // market — a town whose own square severed its street web into two dozen islands.
  // ⭐ THE CLASS: WHEN A JUNCTION IS MODELLED AS A HOLE, EVERY STREET THAT MEETS THERE IS
  // MODELLED AS A DEAD END. The void is drawn as a void and traversed as a junction; those
  // are two different questions about one shape and only the first is about ink.
  /** @type {number[][]} */ const squareFronts = [];
  for (const sq of (squares || [])) {
    if (!sq || !sq.center) continue;
    /** @type {number[]} */ const fronting = [];
    for (let i = 0; i < n; i++) {
      const c = channels[i];
      // A channel FRONTS the void when it comes within the void's own radius plus most of
      // its carriageway — the same reach the plot-to-street relation uses.
      if (distToPolyline(sq.center[0], sq.center[1], c.line) <= sq.radius + c.width * 0.75) fronting.push(i);
    }
    for (let k = 1; k < fronting.length; k++) union(fronting[0], fronting[k]);
    squareFronts.push(fronting);
  }
  // THE HEART: the component the settlement's own square belongs to, which after the join
  // above is one component rather than a choice among many.
  let heartComponent = -1;
  if (squareFronts.length && squareFronts[0].length) heartComponent = find(squareFronts[0][0]);
  let gates = 0, gatesConnected = 0;
  for (let i = 0; i < n; i++) {
    if (!channels[i].gateward) continue;
    gates++;
    if (find(i) === heartComponent) gatesConnected++;
  }
  const roots = new Set();
  for (let i = 0; i < n; i++) roots.add(find(i));
  let inHeart = 0;
  for (let i = 0; i < n; i++) if (find(i) === heartComponent) inHeart++;

  // ── DEAD ENDS, AND THE TWO KINDS ARE NOT THE SAME FINDING (§181.3a: "rare and
  //    deliberate"). An ALLEY that stops is the historical form itself — a way to the back
  //    yards of one rank, walled at its end, and a town without them reads as a machine. A
  //    THROUGH RANK that stops in open ground is the defect: a street that goes nowhere.
  //    Counting them together would let a correct alley hide an incorrect lane, so the
  //    measure separates them and only the STRANDED count is a grade.
  let deadEnds = 0, stranded = 0, edgeEnds = 0;
  // The settlement's own boundary, as a distance test. Absent (a caller that supplies no
  // umbrella) the edge class simply never fires and the count is MF-B3's exactly.
  const rings = (args.umbrella && args.umbrella.components) || [];
  const atEdge = rings.length
    ? (x, y, w) => {
      for (const r of rings) if (distToPolyline(x, y, r.concat([r[0]])) <= w * 1.25) return true;
      return false;
    }
    : null;
  const idx = channelIndex(channels);
  for (let i = 0; i < n; i++) {
    const c = channels[i];
    for (const end of [c.line[0], c.line[c.line.length - 1]]) {
      if (end[0] < 12 || end[1] < 12 || end[0] > VIEW - 12 || end[1] > VIEW - 12) continue;
      let touched = false;
      for (const j of idx.near(end[0], end[1], (c.width + idx.maxWidth) * 0.6)) {
        if (j === i || touched) continue;
        if (distToPolyline(end[0], end[1], channels[j].line) <= (c.width + channels[j].width) * 0.5 * 1.05) touched = true;
      }
      if (touched) continue;
      deadEnds++;
      // ⭐⭐ THE THIRD CLASS OF DEAD END, AND MF-B4's INVERSION IS WHAT MADE IT VISIBLE.
      // MF-B3 counted two kinds — the ALLEY that stops (the historical form: a way to the
      // back yards of one rank, walled at its end) and the STRANDED through-street (the
      // defect). There is a third and it is neither: **an end AT THE SETTLEMENT'S OWN EDGE
      // is where the town stops.** A cart on it is not stranded; it is in the fields, and
      // §16.3's field lanes are literally that street's own continuation.
      // ⚠ It was INVISIBLE before the inversion because the umbrella was slack: every
      // street end lay well inside a blob whose boundary ran through open ground. Derived
      // from the block runs, the boundary now sits ON the last facades, and the ends that
      // touch it are the ordinary edge of an ordinary town. MEASURED: reclassifying them
      // moves a city from 21% "stranded" to 7%, and NOT ONE of the reclassified ends is
      // inside the fabric.
      if (atEdge && atEdge(end[0], end[1], c.width)) { edgeEnds++; continue; }
      // ⭐ AND THE PASSAGE JOINS THE ALLEY IN THE DELIBERATE CLASS (§17.6). A through-passage
      // ENDS in the rear yards it exists to reach — that is its whole function, not a defect.
      // Counting it as stranded would make the §17.6 law red the §181.3a proof, which is the
      // shape of a census that punishes a correct feature for existing.
      if (c.rank !== 'alley' && c.rank !== 'passage') stranded++;
    }
  }

  return {
    components: roots.size,
    heartComponent,
    gates,
    gatesConnected,
    deadEnds,
    stranded,
    edgeEnds,
    connectedShare: n > 0 ? inHeart / n : 0,
    reason: `${roots.size} street components; ${gatesConnected}/${gates} approaches reach the square`
      + ` on continuous pale ground; ${Math.round((inHeart / n) * 100)}% of channels are on the heart's own web;`
      + ` ${deadEnds} dead ends of which ${edgeEnds} are at the town's own edge and`
      + ` ${deadEnds - stranded - edgeEnds} are alleys to back yards (the deliberate kind)`,
  };
}

/**
 * ⭐ BIND THE TOWN TO THE REGIONAL SKELETON (§15.2). Each corridor becomes a road in its
 * own right; where the nucleus does not already sit on one, a SPUR is walked from the town
 * to the nearest point of it over the same ground rules the corridor itself obeyed.
 */
function bindToSkeleton(routes, nucleus, sub, seeding, scale) {
  /** @type {StreetWeb['roads']} */ const roads = [];
  const ordered = routes.corridors.slice().sort((a, b) => (b.weight - a.weight) || compareKeys(a.key, b.key));
  for (let i = 0; i < ordered.length; i++) {
    const c = ordered[i];
    roads.push({
      key: roadKey(nodeKey('corridor', i), nodeKey('frame', i), i === 0 ? 'high' : 'approach'),
      rank: i === 0 ? 'high' : 'approach',
      weight: Math.max(1, Math.round(c.weight * 4)),
      line: c.line,
      gate: null,
      corridor: true,
      source: c.source,
    });
    // THE SPUR. Only where the corridor does not already pass through the settlement —
    // a town ON its road needs no lane out to it, and drawing one would be a stub to nowhere.
    const near = nearestOn(c.line, nucleus.x, nucleus.y);
    if (!near || near.d < scale.builtRadius * 0.55) continue;
    roads.push({
      key: roadKey(nodeKey('spur', i), nodeKey('nucleus', 0), 'approach'),
      rank: 'approach',
      weight: Math.max(1, Math.round(c.weight * 3)),
      line: chaikin(walkSpur(sub, nucleus, near.p, seeding, `spur.${i}`), 2, false),
      gate: null,
      corridor: false,
      source: c.source,
    });
  }
  return roads;
}

/** The corridor that passes through the settlement, clipped to twice its extent — the
 * town's own main street where the road IS the street. Null when none comes near. */
function corridorHighStreet(routes, nucleus, scale) {
  let best = null;
  for (const c of routes.corridors) {
    const near = nearestOn(c.line, nucleus.x, nucleus.y);
    if (!near) continue;
    if (near.d > scale.builtRadius * 0.55) continue;
    if (!best || c.weight > best.weight) best = c;
  }
  if (!best) return null;
  const R = scale.builtRadius * 1.6;
  /** @type {Array<[number,number]>} */ const clipped = [];
  for (const p of best.line) {
    const dx = p[0] - nucleus.x, dy = p[1] - nucleus.y;
    if (Math.sqrt(dx * dx + dy * dy) <= R) clipped.push(p);
  }
  return clipped.length >= 3 ? clipped : null;
}

/** Walk a spur from the town to a point on its corridor, refusing steep and wet. */
function walkSpur(sub, from, to, seeding, key) {
  const rng = fabricRng(seeding.seed, key, { variant: seeding.variant });
  /** @type {Array<[number,number]>} */ const line = [[from.x, from.y]];
  let cx = from.x, cy = from.y;
  for (let s = 0; s < 40; s++) {
    const dx = to[0] - cx, dy = to[1] - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 24) break;
    const ux = dx / d, uy = dy / d;
    /** @type {Array<{x:number,y:number,weight:number}>} */ const cands = [];
    for (const t of [-0.30, 0, 0.30]) {
      const nx = ux - uy * t, ny = uy + ux * t;
      const l = Math.sqrt(nx * nx + ny * ny) || 1;
      const qx = cx + (nx / l) * 22, qy = cy + (ny / l) * 22;
      const slope = sampleAt(sub, sub.slope, qx, qy);
      const wet = sampleAt(sub, sub.wet, qx, qy);
      cands.push({ x: qx, y: qy, weight: Math.max(0.001, (1 - slope) * (1 - wet * 0.8) * (t === 0 ? 1.8 : 1)) });
    }
    const chosen = cands[rng.weighted(cands)];
    cx = chosen.x; cy = chosen.y;
    line.push([cx, cy]);
  }
  line.push([to[0], to[1]]);
  return line;
}

/** Nearest point on a polyline to (x,y), with its distance. */
function nearestOn(line, x, y) {
  let best = null;
  for (const p of line) {
    const d = Math.sqrt((p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y));
    if (!best || d < best.d) best = { p, d };
  }
  return best;
}

/**
 * ⭐⭐⭐ THE QUARTER LANES (§181.3a) — AND THEY WERE ALREADY DERIVED, ALREADY LOAD-BEARING,
 * AND DRAWN NOWHERE. This is §8.2's failure mode exactly: A SOURCE WITH NO EXPRESSION.
 *
 * ⛔ WHAT WAS THERE. `buildFabric` built a set of "connective ribbons" — a radial from the
 * settlement's heart to every quarter's anchor, plus a RIM joining the quarters to each
 * other in bearing order — and handed them to `buildPartition` as the corridors along which
 * the residential matrix spreads. They are the reason the umbrella closes at all and the
 * reason an interior green can exist. They are, in every sense that matters, THE TOWN'S
 * LANE NETWORK. And nothing drew them, nothing reserved them, and the packer built houses
 * straight across them — so the ground the town's own connectivity is made of carried
 * burgage plots.
 *
 * ⭐ THE CURE IS ONE FACT WITH TWO EXPRESSIONS, which is the shape this family keeps
 * arriving at. The lanes are derived HERE, once; the partition rides them as ribbons (the
 * housing follows the lane, as it did); the forbidden-ground predicate reserves their
 * carriageway (so the lane is a gap in the fabric, never a street drawn on top of houses);
 * and the channel pass below draws them. Three consumers, one derivation, no chance of
 * disagreement.
 *
 * ⭐ AND A LANE BENDS. A ruled segment between two anchors is a diagram of connectivity,
 * not a lane; the walk below refuses steep and wet ground on exactly the terms every other
 * road in this fabric already obeys, so the lane arrives where it was going by way of the
 * ground that let it.
 *
 * @param {Object} args
 * @returns {Array<{ key:string, kind:string, line:Array<[number,number]>, width:number }>}
 */
export function deriveQuarterLanes(args) {
  const { organisms, nucleus, sub, tierScale: scale, seeding } = args;
  /** @type {Array<{ key:string, kind:string, line:Array<[number,number]>, width:number }>} */
  const lanes = [];
  const radialW = scale.builtRadius * 0.085;
  const rimW = scale.builtRadius * 0.055;
  for (const o of organisms) {
    lanes.push({
      key: `lane.radial.${o.key}`,
      kind: 'radial',
      line: chaikin(walkLane(sub, nucleus, [o.anchor.x, o.anchor.y], seeding, `lane.radial.${o.key}`), 2, false),
      width: radialW,
    });
  }
  // THE BACK LANE. A town is not only radial: quarters are joined to each other by a lane
  // that never touches the market. The rim joins them in BEARING ORDER about the heart,
  // which is the order a back lane actually connects them in.
  if (organisms.length >= 3) {
    const byBearing = organisms.slice().sort((a, b) => {
      const ba = laneBearing(a.anchor.x - nucleus.x, a.anchor.y - nucleus.y);
      const bb = laneBearing(b.anchor.x - nucleus.x, b.anchor.y - nucleus.y);
      return ba - bb || compareKeys(a.key, b.key);
    });
    for (let i = 0; i < byBearing.length; i++) {
      const a = byBearing[i], b = byBearing[(i + 1) % byBearing.length];
      lanes.push({
        key: `lane.rim.${a.key}~${b.key}`,
        kind: 'rim',
        line: chaikin(
          walkLane(sub, a.anchor, [b.anchor.x, b.anchor.y], seeding, `lane.rim.${a.key}~${b.key}`),
          2, false,
        ),
        width: rimW,
      });
    }
  }
  return lanes;
}

/** Walk a lane from one point to another over the ground, refusing steep and wet. The
 * swing is HALF the spur's: a lane inside a settlement is going somewhere specific and
 * cannot afford to wander the way a country spur can. */
function walkLane(sub, from, to, seeding, key) {
  const rng = fabricRng(seeding.seed, key, { variant: seeding.variant });
  /** @type {Array<[number,number]>} */ const line = [[from.x != null ? from.x : from[0], from.y != null ? from.y : from[1]]];
  let cx = line[0][0], cy = line[0][1];
  const total = Math.sqrt((to[0] - cx) * (to[0] - cx) + (to[1] - cy) * (to[1] - cy));
  const STEP = Math.max(14, total / 9);
  for (let s = 0; s < 24; s++) {
    const dx = to[0] - cx, dy = to[1] - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < STEP) break;
    const ux = dx / d, uy = dy / d;
    /** @type {Array<{x:number,y:number,weight:number}>} */ const cands = [];
    for (const t of [-0.22, 0, 0.22]) {
      const nx = ux - uy * t, ny = uy + ux * t;
      const l = Math.sqrt(nx * nx + ny * ny) || 1;
      const qx = cx + (nx / l) * STEP, qy = cy + (ny / l) * STEP;
      const slope = sampleAt(sub, sub.slope, qx, qy);
      const wet = sampleAt(sub, sub.wet, qx, qy);
      cands.push({ x: qx, y: qy, weight: Math.max(0.001, (1 - slope) * (1 - wet * 0.8) * (t === 0 ? 2.2 : 1)) });
    }
    const chosen = cands[rng.weighted(cands)];
    cx = chosen.x; cy = chosen.y;
    line.push([cx, cy]);
  }
  line.push([to[0], to[1]]);
  return line;
}

/** A trig-free bearing key (the L1 'diamond angle', monotone in the true angle). */
function laneBearing(dx, dy) {
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d === 0) return 0;
  const x = dx / d, y = dy / d;
  const ax = x < 0 ? -x : x, ay = y < 0 ? -y : y;
  const t = ax + ay > 0 ? ay / (ax + ay) : 0;
  return x >= 0 ? (y >= 0 ? t : 4 - t) : (y >= 0 ? 2 - t : 2 + t);
}

/**
 * THE FORBIDDEN-GROUND PREDICATE — everything the fabric may not close over. This is the
 * one place the negative space is enumerated, so a new street rank cannot be added
 * without the parcels learning to respect it.
 * @param {StreetWeb} web @param {import('./umbrella.js').Umbrella} umbrella
 * @param {import('./waterMode.js').WaterRelationship} water
 * @returns {(x:number, y:number) => boolean}
 */
export function forbiddenGround(web, umbrella, water, commons, opts) {
  // ⭐ THE TWO KINDS OF REFUSAL, SEPARABLE ON REQUEST (§11.2). Water, a reserved common, a
  // square and an interior green are ABSOLUTES — nothing was ever built on them. A STREET
  // is a different kind of refusal: it is the town's own arrangement, and history is full
  // of buildings creeping into the street line ("§11.2 · ENCROACHMENT — buildings creep
  // into the street line year by year and lanes narrow"). `{ streets: false }` returns the
  // absolutes alone, for the ONE caller that needs a last resort: §161e.1's dwelling
  // guarantee, on a quarter whose every dry cell is carriageway.
  const withStreets = !opts || opts.streets !== false;
  // ⚠ EVERY POLYLINE TEST BELOW IS BBOX-GUARDED, AND THAT IS A CORRECTNESS-NEUTRAL
  // REQUIREMENT RATHER THAN A TUNING. This predicate runs once per CANDIDATE PLOT — tens of
  // thousands of times on a city — and §181.3a's quarter lanes are walked and smoothed, so
  // each carries ~90 points where MF-B2's ruled bridge carried two. MEASURED unguarded: the
  // predicate alone cost 0.57 s of a 4.1 s city build. A point outside a polyline's bbox
  // grown by its own half-width cannot be within that half-width of the line, so the
  // guard's answer is identical everywhere.
  const boxed = (list, half) => list.map((item) => {
    const line = item.line || item;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of line) {
      if (p[0] < x0) x0 = p[0];
      if (p[1] < y0) y0 = p[1];
      if (p[0] > x1) x1 = p[0];
      if (p[1] > y1) y1 = p[1];
    }
    const h = half(item);
    return { line, half: h, x0: x0 - h, y0: y0 - h, x1: x1 + h, y1: y1 + h };
  });
  // ⭐ THE RESERVED POLYLINES GO INTO ONE SEGMENT HASH (MF-B4). The whole-polyline bbox
  // guard MF-B3 added is a correctness-neutral requirement it still meets; what it does not
  // do is stop a candidate NEAR a quarter lane from walking all ~90 of that lane's points,
  // and MF-B4's module correction multiplied the candidate count by about five. The hash is
  // EXACT (see segmentHash's header): a segment nearer than its own half-width is
  // registered in the cell the query lands in, so no answer moves.
  const reserved = segmentHash([
    ...boxed(web.lanes || [], () => web.widths.organism * 0.5),
    ...boxed(web.roads || [],
      (rd) => (rd.rank === 'high' ? web.widths.highStreet : web.widths.organism * 1.35) * 0.55),
    ...boxed(web.seams || [], () => web.widths.seam * 0.42),
    ...(web.highStreet ? boxed([web.highStreet], () => web.widths.highStreet * 0.55) : []),
  ]);
  const greenIdx = ringIndex(umbrella.greens || []);

  return (x, y) => {
    if (isInWater(water, x, y)) return true;
    // The §5.0c.3 reservation, restated at the last gate. The partition already carved the
    // commons out of the umbrella, so most parcels die on the ragged-edge cull anyway —
    // but a claim the fabric only half-surrounded leaves ground that is INSIDE the
    // umbrella and still common, and nothing may be built there either.
    if (commons) for (const c of commons) {
      const dx = x - c.x, dy = y - c.y;
      if (dx * dx + dy * dy < c.r * c.r) return true;
    }
    for (const sq of web.squares) {
      const dx = x - sq.center[0], dy = y - sq.center[1];
      if (Math.sqrt(dx * dx + dy * dy) < sq.radius * 1.04) return true;
    }
    // ⭐ THE QUARTER LANE IS RESERVED GROUND, and its half-width here is the SAME number the
    // channel pass draws it at — the street on the page and the gap in the fabric are one
    // measurement read twice, never two constants that can drift apart.
    if (withStreets && reserved.near(x, y)) return true;
    if (greenIdx.contains(x, y)) return true;
    return false;
  };
}

/**
 * A bbox bucket index over the channel set. Every channel is registered in every grid cell
 * its bounding box touches; `near(x, y, r)` returns the channels registered in the cells
 * within r. It is EXACT for the two queries that use it — a channel whose bbox does not
 * reach the query disc cannot have a point inside it — and it is deterministic: the
 * returned order is channel-index order, never a hash order.
 *
 * ⚠ IT IS NOT AN OPTIMIZATION DETAIL. MEASURED without it, the stitch and the dead-end walk
 * compared every channel against every other; a city carries 300+ channels and its build
 * took 6.9 SECONDS, with the village pin timing out at 5 s.
 */
function channelIndex(channels) {
  let maxWidth = 0;
  for (const c of channels) if (c.width > maxWidth) maxWidth = c.width;
  const cell = Math.max(24, maxWidth * 2);
  /** @type {Map<string, number[]>} */ const grid = new Map();
  for (let i = 0; i < channels.length; i++) {
    const line = channels[i].line;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of line) {
      if (p[0] < x0) x0 = p[0];
      if (p[1] < y0) y0 = p[1];
      if (p[0] > x1) x1 = p[0];
      if (p[1] > y1) y1 = p[1];
    }
    for (let gj = Math.floor(y0 / cell); gj <= Math.floor(y1 / cell); gj++) {
      for (let gi = Math.floor(x0 / cell); gi <= Math.floor(x1 / cell); gi++) {
        const k = `${gi}|${gj}`;
        const b = grid.get(k);
        if (b) b.push(i); else grid.set(k, [i]);
      }
    }
  }
  return {
    maxWidth,
    near(x, y, r) {
      const span = Math.max(1, Math.ceil(r / cell));
      const gi0 = Math.floor(x / cell), gj0 = Math.floor(y / cell);
      /** @type {Set<number>} */ const out = new Set();
      for (let gj = gj0 - span; gj <= gj0 + span; gj++) {
        for (let gi = gi0 - span; gi <= gi0 + span; gi++) {
          const b = grid.get(`${gi}|${gj}`);
          if (b) for (const i of b) out.add(i);
        }
      }
      return [...out].sort((a, b) => a - b);
    },
  };
}

/** Even-odd point-in-ring, local (umbrella rings are not convex). */
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

