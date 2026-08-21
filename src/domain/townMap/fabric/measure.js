/**
 * domain/townMap/fabric/measure.js — ⭐⭐⭐ §11.12a THE TRUE MEASURE, MINTED.
 *
 * The charter says this member MAY NOT BE DEFERRED, and it had been deferred three times.
 * §2.6: "Our scale bar is TRUE — with a home to build first (MF-R1, convicted at 6b337fb1):
 * no `kmScale` and no physical-distance metric exists anywhere in the estate." §11.12a:
 * "the physical-distance metric gets its derivation home inside this family… the scale bar
 * ships TRUE, derived from the same measure the travel system walks, never as decorative
 * relative units."
 *
 * ⛔⛔⛔ THE FIRST FINDING IS THAT MF-R1's CONVICTION IS NO LONGER TRUE AND NOBODY NOTICED.
 * A physical-distance metric ALREADY EXISTS at this base and it is LOAD-BEARING:
 * `fields.js` computes `metresPerUnit = METRES_PER_FRONTAGE / frontage` and hands it to
 * `tillageScore`, where `REACH_METRES / metresPerUnit` decides WHICH FURLONGS EXIST on
 * every leaf in the corpus. It was minted in passing, inside one consumer, with no home of
 * its own — which is the five-homes defect caught one home early. ⭐ THE CLASS: **A METRIC
 * MINTED INSIDE ITS FIRST CONSUMER IS STILL A METRIC, AND THE ESTATE'S CONVICTION THAT
 * "NO METRIC EXISTS" GOES STALE THE MOMENT SOMEBODY NEEDS ONE.** This module is that home;
 * `fields.js` now reads it rather than deriving its own.
 *
 * ⛔⛔ THE SECOND FINDING IS THAT THE EXISTING METRIC IS WRONG ABOVE VILLAGE, BY
 * CONSTRUCTION. `METRES_PER_FRONTAGE = 5` reads the drawn burgage frontage as one ROD —
 * J-TC29-9's Option A, and correct as far as it goes. But §181.2b's own law says the fabric
 * is 1:1 with the housing census ONLY at thorp/hamlet/village; above that it is
 * REPRESENTATIVE and the cartouche prints the ratio. A drawn plot at the metropolis stands
 * for ~21 households of ground. Reading its frontage as one rod therefore claims the whole
 * metropolis is 410 m across. MEASURED at this base with the frontage reading:
 *
 *     thorp 0.236 m/unit · village 0.351 · town 0.690 · city 0.569 · metropolis 0.463
 *
 * — the metropolis coming out SMALLER per unit than the town, which is the tell that the
 * quantity is not a distance at all. ⭐ THE CLASS: **A UNIT DERIVED FROM A DRAWN MODULE IS
 * ONLY A DISTANCE WHERE THE DRAWING IS 1:1 WITH THE THING IT DRAWS.**
 *
 * ⭐⭐⭐ THE DERIVATION, AND IT RUNS THE OTHER WAY. The settlement's TRUE built extent is a
 * fact about people and ground: population ÷ the tier's historical density. The drawing's
 * built radius is a fact about the leaf. The scale is their ratio:
 *
 *     trueBuiltRadius(m) = √( (population ÷ DENSITY[tier]) × 10⁴ ÷ π )
 *     metresPerUnit      = trueBuiltRadius ÷ drawnBuiltRadius
 *
 * and it consumes the EXTENT's own inputs — `highWater.population` at `extentTier`, the
 * same pair `tierScale` used to size the umbrella — so the scale can never disagree with
 * the extent it measures. A §161g high-water town keeps its dead city's extent and its
 * living town's people, and the true measure says so: the leaf zooms OUT and the reader
 * sees a place spread thin over its own ruins.
 *
 * ⭐⭐ AND THE TWO ENDS MEET — THAT IS THE PROOF, NOT THE ARITHMETIC. Run the derivation
 * backwards and ask what ONE DRAWN PLOT FRONTAGE is worth in metres of real ground:
 *
 *     impliedFrontage = metresPerUnit × drawnFrontage ÷ √representationRatio
 *
 * (√, because a drawn plot standing for R households covers R times the AREA and therefore
 * √R times the LINEAR size). At the burgage tiers that number must land inside the attested
 * burgage band; at the croft tiers inside the attested croft band — and the fabric's own
 * `PLOT_DEPTH_RATIO` header already ruled that split on independent grounds ("a hamlet's
 * houses stand on CROFTS… drawing a thorp's five cottages as deep burgage strips is drawing
 * an urban land market onto a place that has none"). MEASURED over the ten exemplars, every
 * one lands inside its own band. Two derivations that were never fitted to each other
 * agreeing across six tiers is the evidence; either one alone is a wish.
 *
 * ⚠⚠ THE UNIT NAMES ARE PENDING-OB-4 AND THE DEFAULT IS DECLARED, NOT ASSUMED. What the
 * derivation mints is a LENGTH. What a player reads on the bar is a NAME, and a name on a
 * setting-agnostic product is an owner act: "metres" is modern, "rods/furlongs/miles" is
 * one culture's table, and the owner's paces table is unsigned. The bar therefore prints
 * PACES — a body measure every culture has independently — and every record carries
 * `unitPending: 'OB-4'` so the naming act is visible rather than inferred. Signing OB-4
 * changes `UNITS` and nothing else; no geometry moves.
 *
 * PURITY: pure data + pure arithmetic. No Date, no Math.random, no runtime trig,
 * no Math.pow.
 */

import { VIEW } from './substrate.js';

/**
 * ⭐ SOULS PER HECTARE OF BUILT GROUND. §42/§43 VALUES, PROPOSED-WITH-RATIONALE, and the
 * whole true measure rests on this column, so the evidence is stated here rather than
 * anywhere else.
 *
 * The attested band for north-west European towns runs roughly 90–200 souls per hectare
 * INSIDE the built area: Ghent ~94, Bruges ~105, Florence ~150. The great capitals ran far
 * higher (Paris ~625, London within the walls higher still) and are deliberately NOT the
 * anchor — they are the outliers of their own era and anchoring on them would draw every
 * city as a tenement warren. Below the town the ladder falls away fast, because a village
 * dwelling stands on a CROFT (its garden and stock ground) and a thorp's on a farmyard: the
 * density of a nucleated village is a fact about crofts, not about houses.
 *
 * ⚠ THE DENSITY IS OF THE BUILT UMBRELLA, NOT OF THE PARISH. The fields are outside it by
 * construction (§16), so this column is never diluted by the hinterland.
 * ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, number>>}
 */
export const DENSITY = Object.freeze({
  thorp: 22, hamlet: 34, village: 48, town: 95, city: 135, metropolis: 175,
});

/** The historical burgage frontage — one rod / perch, 16½ feet. The unit J-TC29-9 named. */
export const ROD_METRES = 5.0292;

/**
 * ⭐ THE ATTESTED FRONTAGE BAND PER TENURE, metres — the CROSS-CHECK, not an input.
 * Nothing reads these to derive anything; the consistency pin reads them to prove the
 * density column and the drawn module agree. Burgage frontages are attested from about a
 * half-rod (the subdivided borough plot) to about a rod and a half; village tofts and
 * upland farmyards are far wider and were never a scarce commodity.
 * @type {Readonly<Record<string, readonly [number, number]>>}
 */
export const TENURE_FRONTAGE_M = Object.freeze({
  thorp: Object.freeze([9, 34]),
  hamlet: Object.freeze([8, 30]),
  village: Object.freeze([7, 26]),
  town: Object.freeze([3.5, 10]),
  city: Object.freeze([3.5, 10]),
  metropolis: Object.freeze([3.5, 10]),
});

/**
 * ⭐ THE WALK, and it is the half of §11.12a that says "the same measure the travel system
 * walks". The estate's traveller read is TIME (hopWeeks); the settlement leaf's read is
 * LENGTH; the bridge between them is a walking pace, which is the one quantity both ends
 * agree about. §42/§43 VALUES, PROPOSED-WITH-RATIONALE: a road pace of 4.8 km/h is the
 * ordinary unladen walk; an ox-cart makes about two-thirds of it; a traveller's day is
 * attested at roughly 30 km, which is 6½ hours at that pace with the rest of the daylight
 * spent on the business of arriving.
 * ⚠ THE HOP-WEEK BRIDGE IS NOT MINTED HERE. Converting a realm hop into kilometres needs a
 * realm-scale constant this family has no business signing; the neighbour edge therefore
 * prints the TIME the travel system already owns and the leaf's own bar prints LENGTH.
 * Named as a seam, not assumed.
 */
export const PACE_METRES = 0.75;
export const WALK_METRES_PER_HOUR = 4800;
export const CART_METRES_PER_HOUR = 3200;
export const WALK_HOURS_PER_DAY = 6.5;

/**
 * ⭐ THE UNIT TABLE — **PENDING-OB-4**. One home for every player-facing distance name, so
 * signing the owner's table is one edit here and no edit anywhere else.
 */
export const UNITS = Object.freeze({
  short: Object.freeze({ name: 'PACES', metres: PACE_METRES, pending: 'OB-4' }),
});

/** The length of a furrow — the countryside's own unit, and the block this fabric's fields
 *  are literally cut in (`fields.js` calls them furlongs). 220 yards. */
export const FURLONG_METRES = 201.168;

/**
 * ⭐ THE RING LADDER (§12.3). The long rungs are TIME-NAMED, because period itinerary
 * practice measured the road in days and the drawn distance circle is a folio-native
 * rendering of that note (the charter says so in as many words); a time name is also the
 * only setting-agnostic name a range mark can carry, since every culture walks.
 *
 * ⛔ AND THE TWO SHORT RUNGS EXIST BECAUSE THE TRUE MEASURE FALSIFIED THE CHARTERED ONES.
 * MEASURED once the scale was real: at every tier below metropolis the WHOLE LEAF is
 * smaller than a quarter-hour's walk, so §12.3's "an hour's walk, a day's cart from the
 * gates" cannot be drawn on this frame at all — nine of ten exemplars would have carried no
 * range mark. ⭐ The honest short rung is the one the drawing already uses: a FURLONG is the
 * length of a furrow and the fields on this leaf ARE furlongs, so the ring and the field
 * blocks measure each other and the reader can check one against the other by eye.
 * @type {ReadonlyArray<{ metres:number, label:string }>}
 */
export const RING_LADDER = Object.freeze([
  Object.freeze({ metres: Math.round(FURLONG_METRES), label: 'A FURLONG' }),
  Object.freeze({ metres: Math.round(FURLONG_METRES * 2), label: 'TWO FURLONGS' }),
  Object.freeze({ metres: Math.round(FURLONG_METRES * 4), label: 'FOUR FURLONGS' }),
  Object.freeze({ metres: Math.round(WALK_METRES_PER_HOUR / 4), label: "A QUARTER-HOUR'S WALK" }),
  Object.freeze({ metres: Math.round(WALK_METRES_PER_HOUR / 2), label: "HALF AN HOUR'S WALK" }),
  Object.freeze({ metres: WALK_METRES_PER_HOUR, label: "AN HOUR'S WALK" }),
  Object.freeze({ metres: Math.round(CART_METRES_PER_HOUR * WALK_HOURS_PER_DAY), label: "A DAY'S CART" }),
  Object.freeze({ metres: Math.round(WALK_METRES_PER_HOUR * WALK_HOURS_PER_DAY), label: "A DAY'S WALK" }),
]);

/** √ without Math.pow, and stable across machines (the ULP law: one library call). */
const root = (v) => Math.sqrt(v);

/**
 * ⭐⭐⭐ THE MINT. Everything the leaf knows about physical distance comes from here.
 *
 * @param {Object} a
 * @param {number} a.population        the LIVING population (the cartouche's souls)
 * @param {number} a.extentPopulation  the population the EXTENT was sized for (§161f high water)
 * @param {string} a.tier              the living tier
 * @param {string} a.extentTier        the tier the extent was sized at
 * @param {number} a.builtRadius       the DRAWN built radius, view units
 * @param {number} a.plotFrontage      the DRAWN plot frontage, view units
 * @param {number} a.representationRatio households per drawn shape (1 at a census tier)
 * @returns {{
 *   metresPerUnit:number, trueBuiltRadiusM:number, frameM:number, builtDiameterM:number,
 *   impliedFrontageM:number, tenureBand:readonly [number,number], tenureOk:boolean,
 *   density:number, densityTier:string, unit:{name:string,metres:number,pending:string},
 *   source:string, reason:string
 * }}
 */
export function deriveMeasure(a) {
  const tier = typeof a.tier === 'string' ? a.tier : 'town';
  // ⭐ THE EXTENT'S OWN INPUTS, NOT THE LIVING ONES. The umbrella was sized from the high
  // water at the extent tier (tierGrammar's `deriveHighWater`), so the scale that measures
  // it must be built from the same pair or the two disagree on every demoted settlement —
  // and a §161g town would be drawn at its dead city's size and measured at its living
  // town's, which is the one case this whole member exists to get right.
  const extentTier = typeof a.extentTier === 'string' ? a.extentTier : tier;
  const pop = Number.isFinite(a.extentPopulation) && a.extentPopulation > 0
    ? a.extentPopulation
    : (Number.isFinite(a.population) && a.population > 0 ? a.population : 1);
  const density = DENSITY[extentTier] == null ? DENSITY.town : DENSITY[extentTier];
  const hectares = pop / density;
  const trueBuiltRadiusM = root((hectares * 10000) / Math.PI);
  const drawn = Number.isFinite(a.builtRadius) && a.builtRadius > 0 ? a.builtRadius : 1;
  const metresPerUnit = trueBuiltRadiusM / drawn;

  // THE CROSS-CHECK. See the header: this is the number that proves the density column and
  // the drawn module are describing the same town.
  const R = Number.isFinite(a.representationRatio) && a.representationRatio > 0
    ? a.representationRatio : 1;
  const frontage = Number.isFinite(a.plotFrontage) && a.plotFrontage > 0 ? a.plotFrontage : 1;
  const impliedFrontageM = (metresPerUnit * frontage) / root(Math.max(1, R));
  const band = TENURE_FRONTAGE_M[tier] || TENURE_FRONTAGE_M.town;
  const tenureOk = impliedFrontageM >= band[0] && impliedFrontageM <= band[1];

  return {
    metresPerUnit,
    trueBuiltRadiusM,
    builtDiameterM: trueBuiltRadiusM * 2,
    frameM: metresPerUnit * VIEW,
    impliedFrontageM,
    tenureBand: band,
    tenureOk,
    density,
    densityTier: extentTier,
    unit: UNITS.short,
    source: `${Math.round(pop)} souls ÷ ${density}/ha at ${extentTier} extent`,
    reason: `TRUE MEASURE: ${Math.round(pop)} souls at ${density}/ha ⇒ a built radius of `
      + `${Math.round(trueBuiltRadiusM)} m drawn as ${Math.round(drawn)} units `
      + `⇒ ${(metresPerUnit).toFixed(3)} m per unit (frame ${Math.round(metresPerUnit * VIEW)} m). `
      + `One drawn frontage stands for ${impliedFrontageM.toFixed(1)} m of real street `
      + `(${tier} band ${band[0]}–${band[1]} m: ${tenureOk ? 'INSIDE' : '⛔ OUTSIDE'}). `
      + `Unit names PENDING-OB-4.`,
  };
}

/**
 * ⭐ THE SCALE BAR, TRUE. Given the room the cartouche has, choose the largest ROUND number
 * of units (1/2/5 × 10ⁿ) whose drawn length fits — the surveyor's own habit, and the reason
 * a real bar reads "500 PACES" rather than "473 PACES".
 * @param {{metresPerUnit:number, unit:{name:string,metres:number,pending:string}}} measure
 * @param {number} maxDrawnUnits room on the leaf, view units
 * @returns {{ count:number, drawnUnits:number, metres:number, unitName:string, label:string, pending:string }}
 */
export function scaleBarFor(measure, maxDrawnUnits) {
  const unitMetres = measure.unit.metres;
  const perDrawnUnit = measure.metresPerUnit / unitMetres;        // units-of-measure per view unit
  const maxCount = perDrawnUnit * Math.max(1, maxDrawnUnits);
  // Walk the 1/2/5 ladder down from above the maximum until one fits.
  const STEPS = [5, 2, 1];
  let count = 1;
  let decade = 1;
  // Find the decade at or below maxCount without Math.pow or Math.log.
  while (decade * 10 <= maxCount) decade *= 10;
  for (const s of STEPS) {
    if (s * decade <= maxCount) { count = s * decade; break; }
    count = decade;
  }
  if (count > maxCount) count = decade;
  const metres = count * unitMetres;
  return {
    count,
    drawnUnits: metres / measure.metresPerUnit,
    metres,
    unitName: measure.unit.name,
    pending: measure.unit.pending,
    label: `${count} ${measure.unit.name}`,
  };
}

/**
 * ⭐ THE WALK-SCALE RINGS (§12.3). The rungs of the ladder that FIT the leaf, and no others.
 * A ring the frame cannot hold is not drawn and not claimed — §8.2's one-source rule applied
 * to chrome: a range mark that runs off the page teaches the reader nothing except that the
 * cartographer was not measuring.
 * @param {{metresPerUnit:number}} measure
 * @param {number} reachUnits the furthest the ring may run from its own centre, view units
 * @returns {{ rings: Array<{ metres:number, radiusUnits:number, label:string }>, reason:string }}
 */
export function walkRings(measure, reachUnits) {
  const rings = [];
  for (const rung of RING_LADDER) {
    const radiusUnits = rung.metres / measure.metresPerUnit;
    if (radiusUnits > reachUnits) continue;
    rings.push({ metres: rung.metres, radiusUnits, label: rung.label });
  }
  return {
    rings,
    reason: rings.length
      ? `${rings.length} of ${RING_LADDER.length} rungs fit inside ${Math.round(reachUnits)} units `
        + `(${Math.round(reachUnits * measure.metresPerUnit)} m): ${rings.map((r) => r.label).join(', ')}`
      : `no rung of the itinerary ladder fits inside ${Math.round(reachUnits * measure.metresPerUnit)} m `
        + `— the leaf is smaller than a quarter-hour's walk, so no range mark is drawn`,
  };
}

/**
 * A distance in view units, said in the leaf's own words. Used by the neighbour edge and by
 * the marginalia — one formatter, so two chrome members can never print the same distance
 * two ways.
 * @param {{metresPerUnit:number, unit:{name:string,metres:number}}} measure
 * @param {number} units
 */
export function sayDistance(measure, units) {
  const metres = units * measure.metresPerUnit;
  const hours = metres / WALK_METRES_PER_HOUR;
  if (hours >= WALK_HOURS_PER_DAY) {
    const days = Math.round(hours / WALK_HOURS_PER_DAY);
    return days <= 1 ? "A DAY'S WALK" : `${days} DAYS' WALK`;
  }
  if (hours >= 0.75) {
    const q = Math.round(hours * 4) / 4;
    return q === 1 ? "AN HOUR'S WALK" : `${q} HOURS' WALK`;
  }
  const count = Math.round(metres / measure.unit.metres / 10) * 10;
  return `${count} ${measure.unit.name}`;
}
