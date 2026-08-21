/**
 * domain/townMap/fabric/fields.js — THE OPEN-FIELD SYSTEM (§16, §161a, §2.2), AS TRUTH.
 *
 * ⭐⭐⭐ THE CHAIR'S §16 RULING IS THE SHAPE OF THIS FILE. §157's standing critique banned
 * "radial sunburst fields"; hf3 — a NAMED reference — has village-oriented fields. The
 * ruling split them: **what is banned is TERRAIN-BLIND GEOMETRIC SYMMETRY; what is LAW is
 * the historical OPEN-FIELD SYSTEM.** Four clauses, four mechanisms here:
 *
 *   §16.1 FIELDS TILE THE WORKING LAND CONTIGUOUSLY — no floating parcel islands, no bare
 *         gaps inside the arable zone; a hedgerow/baulk boundary between every parcel.
 *   §16.2 STRIPS ORIENT TOWARD THEIR SETTLEMENT — but DEFORMED by the §5.-1 substrate:
 *         they follow contours on slopes and kink along roads. Perfect radial symmetry
 *         remains banned, and the deformation is what makes the difference.
 *   §16.3 THE LANE NETWORK SERVES THE FIELDS — field lanes branch from the village roads
 *         out to the furlongs, along the baulks. A village is connected to its living.
 *   §16.4 (the village centre) is §5's business and lives in streets.js.
 *
 * ⛔⛔ THE DEFECT §16.1 NAMES, MEASURED. MF-B2's furlongs were a lattice of INDEPENDENTLY
 * JITTERED CENTRES, each drawn at 0.52–0.96 of its own cell. So between every pair of
 * neighbours lay a wedge of bare ground, and any cell the ranking skipped left a hole:
 * MEASURED on the village exemplar, the drawn furlongs covered 0.44 of the arable zone they
 * claimed and 110 of them floated as islands in it. hf3's countryside has no bare ground in
 * it at all — every acre belongs to a furlong, and the furlongs meet at their baulks.
 *
 * ⭐⭐ THE CURE IS ONE LINE OF GEOMETRY AND IT IS WORTH RECORDING AS A CLASS: **JITTER THE
 * SHARED VERTICES, NOT THE CENTRES.** A lattice whose CORNERS are displaced (each corner
 * once, shared by the four cells that meet there) still TILES EXACTLY — no gaps, no
 * overlaps — while every cell becomes an irregular quadrilateral. A lattice whose CENTRES
 * are displaced cannot tile at all. The irregularity that reads as hand-drawn and the
 * contiguity the law requires are not in tension; they were in tension only because the
 * jitter was applied to the wrong object.
 *
 * ⭐ AND THE ZONE IS CLOSED BEFORE IT IS DRAWN. Ranking cells by tillage leaves single-cell
 * holes wherever one cell scored a hair under its neighbours — which is a bare gap INSIDE
 * the arable zone, exactly what §16.1 forbids. A morphological CLOSING (any refused cell
 * with three or more worked neighbours is worked) removes them, and the count is reported:
 * a hole that survives is a hole with a reason — the sea, the town, sheer rock.
 *
 * ⭐⭐ THE RANKING-NOT-THRESHOLD LAW STANDS, from MF-B2 (the fjord that had nothing to eat):
 *   1 DEMAND   the settlement's own food economy says how much tilled ground it needs.
 *   2 SUPPLY   every candidate cell is SCORED for tillage rather than admitted or refused.
 *   3 ALLOCATE take cells in score order until the demand is met or the supply runs out.
 *   4 DECLARE  where the leaf cannot feed the settlement, the DEFICIT IS RECORDED.
 * A hard threshold answers "is this cell ideal?"; the map has to answer "where did these
 * people grow their food?", and those are different questions with different failure modes.
 *
 * ⛔ WHY THIS LIVES IN THE FABRIC AND NOT IN THE LENS. MF-B1b derived the countryside inside
 * `renderFolio.mjs` — a §161a TRUTH CLAIM in a harness file no pin could reach, where a
 * second lens would have had to re-derive it and could have disagreed.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare. Every draw is a
 * hash of (seed, feature identity, purpose) per §15.4.
 */

import { hashUnit } from './fabricRng.js';
import { TRIG_N, cosI, sinI, centroid, clipHalfPlane, bearingIndex, distToPolyline }
  from './fabricGeometry.js';
import { VIEW, sampleAt } from './substrate.js';
import { buildableAt, bodyRefusal } from './groundRefusal.js';

/**
 * ⭐ THE FOOD DEMAND, in the leaf's own units. §42/§43 VALUE, DERIVED.
 *
 * Pre-industrial subsistence runs at roughly one to one-and-a-half acres of arable per
 * head under a two- or three-field rotation (a third to a half of it fallow in any year).
 * The leaf's scale comes from the drawing's own module: a burgage frontage is a ROD
 * (≈5 m), which is the scale bar's stated unit, so one view unit is `5 / plotFrontage`
 * metres and an acre (4,047 m²) is `4047 / (5/frontage)²` square view units.
 *
 * ⚠ THE HONEST CONSEQUENCE, STATED UP FRONT: at every tier this demand EXCEEDS the leaf.
 * A 512-soul village needs ~2 km² of arable and its leaf covers ~0.15 km². That is not a
 * bug in the arithmetic — it is the true relationship between a settlement and its
 * hinterland. What the demand buys is the DEFICIT: the share of its own food the leaf can
 * be seen to grow.
 */
export const ACRES_PER_SOUL = 1.2;

/** Square metres in an acre. */
const ACRE_M2 = 4047;

/** Metres per plot frontage — the scale bar's own unit (a rod). */
export const METRES_PER_FRONTAGE = 5;

/**
 * ⭐⭐ §16.1's "THE §161a FOOD ECONOMY SETS HOW MUCH LAND WORKS" — the share of the leaf's
 * WORKABLE ground a settlement actually puts under the plough, by what it eats by.
 *
 * ⛔ WHY A DEMAND FIGURE ALONE CANNOT DO THIS JOB. The demand above exceeds the frame at
 * every tier, so an allocation that stops at the demand never stops: every settlement
 * ploughs every workable cell, and a FISHING town is drawn farming its whole valley. The
 * dossier already says what it eats by (`food-economy`, compiled at §15.1 as
 * tillage | fish | trade), and that fact has to reach the ground or it is a source with no
 * expression. A fjord town's fields are the home closes and the valley floor; the rest of
 * its workable ground stays rough pasture because nobody there is a ploughman.
 * §42/§43 VALUES, PROPOSED-WITH-RATIONALE. ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, number>>}
 */
export const FOOD_ECONOMY_TILLAGE = Object.freeze({
  tillage: 1.00,
  trade: 0.74,
  fish: 0.46,
});

/**
 * The relief amplitude a NORMALIZED slope of 1.0 corresponds to at the TILLAGE thresholds
 * below — i.e. the landform whose steepest ground is exactly at the plough's limit.
 * §42/§43 VALUE: 0.30 is gentle rolling country (`forest` sits at 0.30, `riverside` 0.26,
 * `hills` 0.52), which is the landscape whose worst slope a team can still just work.
 * Every other family's slopes rescale against it. ⚠ UNSOAKED; rides the tuning signature.
 */
export const REFERENCE_RELIEF = 0.30;

/**
 * ⭐⭐ HOW MANY DRAWN SHAPES THE COUNTRYSIDE MAY SPEND — AND THE DIAL IS §5's OWN
 * FRAME-COMPOSITION WALK, NOT THE ACCENT BAND.
 *
 * ⛔ THE ACCENT BAND WAS THE OBVIOUS DIAL AND IT IS THE WRONG ONE. §9.3's accent ration
 * says how much DETAIL a tier carries; it says nothing about how much of the leaf is
 * countryside. MEASURED, the two come apart badly at both ends: a village's fabric costs
 * ~500 primitives and leaves most of the ceiling unspent, while a city's costs 2,000 and
 * leaves ~200 — an 8:1 spread the accent band (0.92 vs 0.58) is nowhere near.
 *
 * ⭐ §5 ALREADY STATES THE RIGHT ONE: "frame-composition ratio walks 90:10 → 15:85 in
 * VISUAL WEIGHT" — a thorp is an incident in the countryside, a metropolis is a world with
 * countryside at its edges. That IS the countryside's share of the leaf, per tier.
 * @type {Readonly<Record<string, number>>}
 */
export const COUNTRYSIDE_SHARE = Object.freeze({
  thorp: 0.90, hamlet: 0.82, village: 0.72, town: 0.45, city: 0.22, metropolis: 0.15,
});

/** The op ceiling the whole leaf is drawn inside (§160.1's primitive-grain metric). */
export const OP_CEILING = 2200;

/**
 * The share of the ceiling the countryside's OWN share may claim.
 *
 * ⚠ RE-MEASURED AT MF-B3, AND ITS OWN DOCSTRING ORDERED THE RE-MEASUREMENT: "RE-MEASURE if
 * the fabric's op cost moves." §181.3a's street web is a NEW first-class consumer of the
 * leaf's ink — seven ranks of carriageway where MF-B2 drew the block ground instead — and
 * the constant was fitted before it existed. Held at 0.37 the fjord finished 132 primitives
 * over the ceiling; the value below is the measured one at which every exemplar in the
 * corpus lands under it with the web, the fabric, the relief pass and the chrome all drawn.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const FIELD_OP_SHARE = 0.30;

/**
 * ⭐ THE LATTICE CORNER JITTER, as a share of the pitch — the whole of §16.1's contiguity.
 * At 0 the countryside is graph paper; at 0.5 two neighbouring corners could cross and the
 * tiling would fold. 0.44 is strongly irregular and provably fold-free at that bound (a
 * corner moves at most 0.22 of a pitch, and a quad needs a corner to travel past its own
 * diagonal to turn concave). The derivation still CHECKS, and a cell that comes back
 * non-convex is drawn whole rather than sliced — reported, never silently mis-sliced.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const LATTICE_JITTER = 0.44;

export const TILLAGE = Object.freeze({
  // Slope: the plough's own limit. Below `easy` costs nothing; above `terraceMax` the
  // ground is pasture, waste or rock whatever the settlement's hunger.
  easy: 0.16,
  terrace: 0.34,          // above this the strips must be TERRACED to be worked at all
  terraceMax: 0.66,
  // Wetness: a water meadow is good ground; a marsh is not.
  wetBest: 0.30,
  wetMax: 0.74,
  // How far the plough team walked. Beyond this the furlongs give out to waste and wood —
  // the classic day's-work limit, in units of the settlement's own extent.
  reach: 3.4,
});

/**
 * @typedef {Object} FieldParcel
 * @property {string} key
 * @property {Array<[number,number]>} polygon   the STRIP
 * @property {number} furlong      which furlong block it belongs to
 * @property {number} ang          the ploughing direction (trig index)
 * @property {number} tone         0..5 flat wash bucket
 * @property {boolean} terraced    worked on a slope that needed retaining
 * @property {number} score        the tillage score of its ground
 */

/**
 * Derive the open-field system.
 *
 * @param {Object} args
 * @returns {Object}
 */
export function buildFields(args) {
  const {
    sub, inTown, inWater, centre, extent, population, frontage, accentBand, tier, seeding,
  } = args;
  const roads = args.roads || [];
  const foodEconomy = String(args.foodEconomy || 'tillage');
  const key = `${String(seeding.seed)}|fields${seeding.variant ? `|v${seeding.variant}` : ''}`;

  // ── 1 · DEMAND, in square view units.
  // ⛔⛔ THE SCALE IS NO LONGER MINTED HERE (MF-B6, §11.12a). `METRES_PER_FRONTAGE / frontage`
  // reads the DRAWN burgage frontage as one rod, which is a distance only where the fabric
  // is 1:1 with the housing census — thorp, hamlet and village. Above that a drawn plot
  // stands for R households of ground and the reading collapses: it made the metropolis
  // come out with FEWER metres per unit than the town. The ONE home is measure.js; an
  // absent measure falls back to the old reading so a caller built before the mint still
  // works, and SAYS SO rather than inventing a scale (the same declared-degradation rule
  // `tillageScore` already applies to an absent one).
  const metresPerUnit = args.measure && Number.isFinite(args.measure.metresPerUnit)
    ? args.measure.metresPerUnit
    : METRES_PER_FRONTAGE / Math.max(0.5, frontage);
  const unitsPerAcre = ACRE_M2 / (metresPerUnit * metresPerUnit);
  const demandUnits = Math.max(0, population) * ACRES_PER_SOUL * unitsPerAcre;

  // ── 2 · THE LATTICE. ⭐ CORNER-JITTERED, so the cells TILE (see the header).
  //
  // ⭐⭐ AND THE FURLONG'S SIZE IS DERIVED FROM THE INK THE PARISH MAY SPEND, which is the
  // second half of §16.1 and the part that is easy to miss. A tiling is only contiguous ON
  // THE PAGE if the drawing can afford to draw ALL of it: MEASURED with a fixed pitch, the
  // town's arable zone came to 408 furlong blocks against an op budget of 297, so the
  // budget stopped two-thirds of the way through the zone and left exactly the bare gaps
  // the ruling forbids — a zone contiguous as a FACT and holed as a DRAWING.
  // ⭐ THE CLASS: when a law is about what the reader SEES, satisfying it in the derivation
  // is not satisfying it. The grain has to be chosen so the whole claim fits the ink.
  //
  // ⚠ TWO PASSES, A FIXED COUNT — never a loop to a tolerance, which would make the
  // countryside's byte content depend on a threshold being met (the same determinism hazard
  // the packer's own three-pass calibration refuses).
  const share = COUNTRYSIDE_SHARE[tier] == null ? 0.45 : COUNTRYSIDE_SHARE[tier];
  const opBudget = Math.round(OP_CEILING * share * FIELD_OP_SHARE);
  const tillageFactor = FOOD_ECONOMY_TILLAGE[foodEconomy] == null ? 1 : FOOD_ECONOMY_TILLAGE[foodEconomy];
  // Each drawn furlong costs its hedge, its lands and its share of the hedgerow trees.
  // §42/§43 VALUE, MEASURED on the corpus: 3.4 primitives per furlong at the ration below.
  // ⚠ RAISED FROM 3.4 AT MF-B3: a furlong worth drawing carries THREE OR MORE LANDS, and
  // at 3.4 the budget bought many small furlongs of two fat wedges apiece — the strip is
  // what the eye reads as agriculture (hf3's countryside is nothing else), so the grain is
  // chosen to afford the lands rather than to maximize the number of holdings.
  const OPS_PER_FURLONG = 5.0;
  const affordable = Math.max(8, Math.round(opBudget / OPS_PER_FURLONG));

  const layZone = (pitch) => {
    const n = Math.ceil(VIEW / pitch) + 2;
    const vert = (i, j) => /** @type {[number,number]} */ ([
      i * pitch + (hashUnit(`${key}|vx|${i}|${j}`) - 0.5) * pitch * LATTICE_JITTER,
      j * pitch + (hashUnit(`${key}|vy|${i}|${j}`) - 0.5) * pitch * LATTICE_JITTER,
    ]);
    const cellOf = (i, j) => [vert(i, j), vert(i + 1, j), vert(i + 1, j + 1), vert(i, j + 1)];
    /** @type {Array<any>} */ const sites = [];
    let drySites = 0;
    for (let j = -1; j <= n; j++) {
      for (let i = -1; i <= n; i++) {
        const poly = cellOf(i, j);
        const c = centroid(poly);
        const cx = c[0], cy = c[1];
        if (cx < -pitch || cy < -pitch || cx > VIEW + pitch || cy > VIEW + pitch) continue;
        // ⛔ THE TWO ABSOLUTES, and they are the only ones. Nobody ploughs the sea, and
        // nobody ploughs the ground their own houses stand on.
        if (inWater(cx, cy)) continue;
        if (inTown(cx, cy)) continue;
        drySites++;
        const score = tillageScore(sub, cx, cy, centre, extent, metresPerUnit);
        if (score <= 0) continue;
        sites.push({
          i, j, cx, cy, score, poly,
          priority: drawPriority(score, cx, cy, centre, extent),
          terraced: sampleAt(sub, sub.slope, cx, cy) > TILLAGE.terrace,
        });
      }
    }
    // ── 3 · THE ARABLE ZONE. Score order, capped by what the settlement eats by (§16.1).
    //
    // ⚠ THE ORDER IS A TOTAL ORDER, ties broken on the lattice index, so the allocation is
    // byte-stable: a sort that left equal-scoring cells in hash order would make the
    // countryside depend on the iteration order of a Map.
    sites.sort((a, b) => (b.score - a.score) || (a.j - b.j) || (a.i - b.i));
    const worked = sites.slice(0, Math.max(1, Math.round(sites.length * tillageFactor)));
    /** @type {Map<string, any>} */ const zone = new Map();
    for (const s of worked) zone.set(`${s.i}|${s.j}`, s);

    // ── 3b · THE CLOSING (§16.1: "no bare-ground gaps inside the arable zone").
    // A cell that scored a hair under its neighbours leaves a HOLE in the worked land, which
    // is precisely the thing the ruling forbids. Any refused cell with three or more worked
    // orthogonal neighbours is worked — one pass, a fixed neighbourhood, no iteration.
    // ⭐ A HOLE THAT SURVIVES IS A HOLE WITH A REASON: the sea, the town, or ground that
    // scored zero — sheer rock, standing water, past the plough team's day.
    let gapsFilled = 0;
    for (const s of sites) {
      const k = `${s.i}|${s.j}`;
      if (zone.has(k)) continue;
      let around = 0;
      if (zone.has(`${s.i - 1}|${s.j}`)) around++;
      if (zone.has(`${s.i + 1}|${s.j}`)) around++;
      if (zone.has(`${s.i}|${s.j - 1}`)) around++;
      if (zone.has(`${s.i}|${s.j + 1}`)) around++;
      if (around >= 3) { zone.set(k, s); gapsFilled++; }
    }
    return { sites, zone, drySites, gapsFilled, vert, pitch };
  };

  const pitch0 = clamp(frontage * 5.5, 46, 118);
  let lay = layZone(pitch0);
  // The second pass re-grains the parish so the whole worked zone fits the ink. Area scales
  // as pitch², so the correction is a square root — the same shape as the packer's.
  const pitch1 = clamp(pitch0 * Math.sqrt(Math.max(1, lay.zone.size) / affordable), 40, 260);
  if (Math.abs(pitch1 - pitch0) > pitch0 * 0.06) lay = layZone(pitch1);
  const { zone, drySites, gapsFilled, vert, pitch } = lay;

  // ── 3c · THE GREAT FIELDS (§16.2's deformation clause, and the §157 ban's real teeth).
  //
  // ⛔⛔ ORIENTING EVERY FURLONG INDIVIDUALLY ON THE VILLAGE IS THE SUNBURST, and MEASURING
  // it says so: on PLAINS the terrain deformation is near zero (relief 0.16, so the slope
  // term never leaves its dead band), and a per-furlong bearing to the centre then draws a
  // continuous fan — precisely the "terrain-blind geometric symmetry" §157 convicted and
  // §16 re-banned. The clause "strips orient toward their settlement" cannot be applied at
  // the furlong, because that is not the unit the orientation belonged to.
  //
  // ⭐⭐ IT BELONGED TO THE GREAT FIELD, AND HISTORY HANDS THE MECHANISM OVER WHOLE. An
  // open-field parish was divided into TWO OR THREE GREAT FIELDS — the rotation itself, one
  // of them fallow each year (the same rotation `ACRES_PER_SOUL` already prices). Each great
  // field is a body of furlongs sharing ONE prevailing grain; the change of grain at a field
  // boundary is the most characteristic mark on a real open-field map. So the bearing to the
  // village is taken ONCE PER FIELD, deformed by the ground under THAT field, and every
  // furlong in it inherits the grain with only a local slope, a road kink and a few degrees
  // of its own. Two or three coherent domains, never a fan.
  const greatFields = layGreatFields({
    zone, centre, extent, sub, key, metresPerUnit,
    count: foodEconomy === 'tillage' ? 3 : 2,
  });

  // The drawing order is the RATION's order (near and good first), not the ranking's — see
  // `drawPriority` for why the two had to come apart.
  const zoneOrdered = [...zone.values()].sort(
    (a, b) => (b.priority - a.priority) || (a.j - b.j) || (a.i - b.i),
  );

  // ── 4 · SUPPLY, measured over the WHOLE worked zone.
  //
  // ⛔⛔ THE SUPPLY IS MEASURED ON THE GROUND, NOT ON THE OP BUDGET — and getting this
  // wrong the first time produced a PRINTED FALSEHOOD. With the budget counted as the
  // supply, the fjord reported "THE LEAF FEEDS 0% OF THIS SETTLEMENT" — a statement about
  // its GROUND that was actually a statement about how many shapes the ink budget could
  // afford. ⭐ THE CLASS: when a drawing shows a SAMPLE of a derived quantity, the quantity
  // must be measured over the whole population and the sample declared as a sample.
  let supplyUnits = 0;
  for (const s of zoneOrdered) supplyUnits += polyArea(s.poly);

  // ── 5 · THE STRIPS.
  //
  // ⭐⭐ EVERY WORKED FURLONG IS DRAWN; ONLY ITS SUBDIVISION IS RATIONED. That ordering is
  // the whole of §16.1's contiguity on the page: the first pass gives each furlong in the
  // zone its own closed shape and its hedge, so the worked land has no holes in it at any
  // budget; the remainder buys LANDS inside the near furlongs, which is exactly what a
  // surveyor detailed and what makes the home fields read as ploughed rather than as
  // pasture. A budget that ran out used to delete furlongs; now it only coarsens them.
  /** @type {FieldParcel[]} */ const parcels = [];
  /** @type {Array<Array<[number,number]>>} */ const hedges = [];
  /** @type {Array<{x:number,y:number,r:number}>} */ const trees = [];
  let drawnUnits = 0;
  // ⭐ THE COVERAGE HAS TO SEPARATE TWO SHORTFALLS OR IT MEASURES NEITHER. A furlong at the
  // settlement's edge legitimately loses the lands that fall under the first houses — that
  // is the TOWN, not a hole in the fields. A furlong in the open losing area would be the
  // §16.1 defect. So the interior is measured on its own, and it must be TOTAL.
  let interiorDrawn = 0, interiorSupply = 0, clippedLands = 0, edgeFurlongs = 0;
  let refusedLands = 0, refusedSupply = 0;
  let terracedFurlongs = 0;
  let furlongs = 0;
  let nonConvex = 0;

  // PASS 1 — the whole zone, one close apiece.
  /** @type {Array<{site:any, ang:number, fk:string}>} */ const drawn = [];
  for (const site of zoneOrdered) {
    const fk = `${key}|f|${site.i}|${site.j}`;
    const gf = greatFields.fieldFor(site.cx, site.cy);
    const ang = furlongBearing(sub, site, gf, roads, pitch, fk);
    drawn.push({ site, ang, fk, greatField: gf.index });
    hedges.push(site.poly);
    furlongs++;
    if (site.terraced) terracedFurlongs++;
  }
  let spent = furlongs;                             // one hedge apiece

  // PASS 2 — the LANDS, in ration order, until the ink runs out.
  //
  // ⚠ EVERY REMAINING FURLONG'S OWN CLOSE IS RESERVED BEFORE THIS ONE IS SUBDIVIDED. Without
  // that reservation the near furlongs would spend the whole budget on their lands and the
  // far ones would have no shape at all — the very hole this restructure removes, arriving
  // through the other door.
  for (let fi = 0; fi < drawn.length; fi++) {
    const { site, ang, fk } = drawn[fi];
    const convex = isConvexRing(site.poly);
    if (!convex) nonConvex++;
    // The best ground was divided among more holders; the far outfield is one close.
    const wanted = 3 + Math.floor(hashUnit(`${fk}|n`) * 4 * (0.4 + site.score * 0.6));
    const reservedForRest = drawn.length - fi - 1;
    const strips = (convex && spent + wanted + reservedForRest <= opBudget)
      ? Math.max(1, wanted) : 1;
    const bands = strips > 1 ? sliceConvex(site.poly, ang, strips, fk) : [site.poly];
    let edgeClipped = false;
    const drawnBefore = drawnUnits;
    const refusedBefore = refusedSupply;
    for (let s = 0; s < bands.length; s++) {
      const poly = bands[s];
      if (!poly || poly.length < 3) continue;
      // ⚠ THE FURLONG IS ADMITTED AT THE CELL AND THE LANDS ARE ADMITTED AT THE STRIP.
      // A cell whose centre is out of town can still reach INTO it, and nobody ploughs the
      // ground their houses stand on — so a land that falls under the town or in the water
      // is not emitted. That leaves no gap INSIDE the arable zone (§16.1's actual claim):
      // what it leaves is the town's own edge, and the lens paints the urban wash OVER the
      // fields, so the boundary reads as the settlement rather than as bare ground.
      // ⚠ THE TEST IS THE CENTROID **AND** EVERY CORNER. A land whose area centroid is
      // clear can still have a corner under the first houses, and the claim the pin holds
      // is about the LAND, not about its middle.
      // ⛔ AND THE SAMPLE IS DENSER THAN THE CORNERS ALONE (MF-B4). MF-B4's inversion derives
      // the settlement outline from the block runs, so the town's edge is no longer a smooth
      // blob — it has real BAYS between its quarters, narrower than a land. A strip can
      // straddle such a bay with every CORNER outside the town and its middle inside it, and
      // that is a land ploughed through somebody's back garden. MEASURED: one land at
      // (311.8, 70.0) on the b2-fields fixture, with all four corners clear.
      // ⭐ THE CLASS, AND IT IS THE SAME ONE §17.4 IS ABOUT ONE LEVEL DOWN: A PREDICATE ABOUT
      // GROUND, SAMPLED AT A FEW POINTS OF A SHAPE, IS NOT A PREDICATE ABOUT THE SHAPE — and
      // which points are enough depends on how wrinkled the OTHER shape has become.
      const bc = centroid(poly);
      let intrudes = inTown(bc[0], bc[1]) || inWater(bc[0], bc[1]);
      if (!intrudes) {
        // The vertex mean, which is a different point from the area centroid on any polygon
        // that is not a parallelogram — and it is the point the §16 pin happens to test.
        let mx = 0, my = 0;
        for (const q of poly) { mx += q[0] / poly.length; my += q[1] / poly.length; }
        if (inTown(mx, my) || inWater(mx, my)) intrudes = true;
      }
      if (!intrudes) {
        for (let qi = 0; qi < poly.length && !intrudes; qi++) {
          const q = poly[qi], r = poly[(qi + 1) % poly.length];
          if (inTown(q[0], q[1]) || inWater(q[0], q[1])) { intrudes = true; break; }
          // The edge MIDPOINT: a bay narrower than the land enters through an edge, not
          // through a corner.
          const ex = (q[0] + r[0]) / 2, ey = (q[1] + r[1]) / 2;
          if (inTown(ex, ey) || inWater(ex, ey)) intrudes = true;
        }
      }
      if (intrudes) { clippedLands++; edgeClipped = true; continue; }
      // ⭐⭐⭐ §5 W1 EXIT 2 + EXIT 4 · **AND THE GROUND ITSELF REFUSES THE PLOUGH, ASKED OF THE
      // LAND'S OWN BODY.** `tillageScore` refuses at the furlong's CENTROID, and a furlong is
      // 40–110 view units across — FOUR TO ELEVEN substrate cells — so a furlong whose middle
      // is workable tiles right over the crags on its flanks. That is the whole of §5 W1 exit
      // 4's acceptance failure in one sentence: `laneMFW1SUB-receipt.md` §6.2, *"`mountain`
      // reads as rocky ridges in FARMLAND, because the field patchwork still tiles the entire
      // leaf including the steep ground."*
      // ⭐ THE CLASS, for the FOURTH time in this fabric (§17.4's plot centre, §200's claim,
      // §5 W1 exit 2's back-house, and now the land): **A PREDICATE ABOUT GROUND, SAMPLED AT A
      // POINT, IS NOT A PREDICATE ABOUT A SHAPE** — the note ten lines above says exactly this
      // about the TOWN and did not extend it to the LAND, because the ground was not yet a
      // shared claim. It is now, and `bodyRefusal` is the one home that answers it.
      // ⚠ REFUSED, NOT CLIPPED. A land is a UNIT of tenure — one holder's strip in one
      // furlong — so half a land is not a smaller land, it is a different fact. The furlong's
      // remaining lands still draw, which is what a real parish looks like where a crag comes
      // through it.
      if (bodyRefusal(sub, poly)) {
        refusedLands++;
        // ⭐⭐ AND THE REFUSED LAND LEAVES THE INTERIOR-COVERAGE DENOMINATOR, WHICH IS A
        // DECISION AND NOT AN ADJUSTMENT. §16.1's claim is *"no bare-ground gaps inside the
        // arable zone"*, and the closing pass's own note already states the boundary:
        // *"A HOLE THAT SURVIVES IS A HOLE WITH A REASON: the sea, the town, or ground that
        // scored zero — sheer rock, standing water."* A land the GROUND refuses is that third
        // reason arriving as a body test rather than as a centroid score. Charging it to
        // coverage would set §16.1 against §5 W1 exit 2 and demand the plough cover ground
        // the fabric refuses. MEASURED: the pin read 0.967 against its 0.995 floor on the
        // mountain leaf, purely from this.
        // ⚠ IT IS SUBTRACTED, NOT IGNORED — `refusedLands` publishes the count, so a
        // successor can see how much ground left the denominator and why.
        refusedSupply += polyArea(poly);
        continue;
      }
      parcels.push({
        key: `${fk}|s${s}`,
        polygon: poly,
        furlong: site.j * 4096 + site.i,
        ang,
        // ⭐ THE TONE IS THE FURLONG'S, NOT THE STRIP'S. A furlong was sown to ONE crop in
        // a given year — that is what a common field IS — and MF-B2's per-strip roll made
        // the countryside read as television static rather than as a parish under a
        // rotation. The per-strip variation that remains is the minority of lands whose
        // holder sowed differently, which is the honest exception rather than the rule.
        tone: hashUnit(`${fk}|${s}|t`) < 0.22
          ? Math.floor(hashUnit(`${fk}|${s}|t2`) * 6)
          : Math.floor(hashUnit(`${fk}|tone`) * 6),
        terraced: site.terraced,
        score: site.score,
        greatField: drawn[fi].greatField,
      });
      drawnUnits += polyArea(poly);
      spent++;
    }

    if (edgeClipped) edgeFurlongs++;
    else {
      interiorDrawn += drawnUnits - drawnBefore;
      // The interior supply is the furlong's ground MINUS the ground the law refuses.
      interiorSupply += Math.max(0, polyArea(site.poly) - (refusedSupply - refusedBefore));
    }

    // HEDGEROW TREES on the furlong's own boundary, rationed by the tier's accent band.
    // ⚠ CHARGED TO THE SAME BUDGET: a hedgerow tree is one drawn shape exactly like a
    // strip, and leaving them off the ledger is how an op budget silently fails to be one.
    if (spent + reservedForRest + 3 < opBudget && hashUnit(`${fk}|tr`) < 0.42 * accentBand) {
      const count = 1 + Math.floor(hashUnit(`${fk}|trn`) * 2);
      spent += count;
      for (let t = 0; t < count; t++) {
        const e = Math.floor(hashUnit(`${fk}|te${t}`) * 4);
        const a = site.poly[e], b = site.poly[(e + 1) % 4];
        const u = 0.2 + hashUnit(`${fk}|tu${t}`) * 0.6;
        trees.push({
          x: a[0] + (b[0] - a[0]) * u,
          y: a[1] + (b[1] - a[1]) * u,
          r: 2.4 + hashUnit(`${fk}|tr${t}`) * 2.2,
        });
      }
    }
  }

  // ── 6 · THE FIELD LANES (§16.3) — "a village is connected to its living."
  const lanes = fieldLanes({ zone, vert, roads, centre, inTown, key, pitch });

  const met = demandUnits > 0 ? Math.min(1, supplyUnits / demandUnits) : 1;
  // ⭐⭐ THE FIGURE THAT ACTUALLY DISTINGUISHES ONE TERRAIN FROM ANOTHER. `demandMet` is
  // arithmetically true and rhetorically useless: a leaf is a WINDOW roughly 300 m across,
  // a parish is kilometres, so EVERY settlement's frame grows a low single-digit share of
  // what it eats. What the reader can see, and what §161a is about, is `arableShare` — how
  // much of this leaf's DRY LAND is actually under the plough. ⭐ THE CLASS: a ratio whose
  // denominator is outside the frame cannot be a headline about what is inside it.
  // ⚠ COUNTED IN CELLS, NOT AREA. A tiled cell covers its whole lattice square, so the
  // count and the area now agree — but the count is still the ratio the sentence claims.
  const arableShare = drySites > 0 ? zone.size / drySites : 0;
  const hungry = met < 1;
  return {
    parcels,
    hedges,
    trees,
    lanes,
    demandUnits,
    supplyUnits,
    drawnUnits,
    demandMet: met,
    arableShare,
    arableCells: zone.size,
    dryCells: drySites,
    gapsFilled,
    nonConvex,
    tillageFactor,
    foodEconomy,
    coverage: supplyUnits > 0 ? drawnUnits / supplyUnits : 0,
    // The claim §16.1 actually makes: away from the settlement's own edge, the drawing
    // covers the worked land ENTIRELY.
    interiorCoverage: interiorSupply > 0 ? interiorDrawn / interiorSupply : 1,
    edgeFurlongs,
    clippedLands,
    // §5 W1 exit 4: lands the GROUND refused, area-true. Reported separately from
    // `clippedLands` (which is the TOWN's refusal) because they are different facts.
    refusedLands,
    refusedSupply,
    terracedShare: furlongs > 0 ? terracedFurlongs / furlongs : 0,
    furlongs,
    reason: `${(arableShare * 100).toFixed(0)}% of this leaf's dry ground is under the plough`
      + ` (${zone.size} of ${drySites} furlong blocks; the ${foodEconomy} economy works`
      + ` ${(tillageFactor * 100).toFixed(0)}% of what the ground would carry`
      + `${gapsFilled ? `; ${gapsFilled} single-cell holes CLOSED so the worked land is contiguous` : ''}`
      + `${edgeFurlongs ? `; ${edgeFurlongs} furlongs run up against the settlement and lose ${clippedLands} lands to it` : ''}`
      + `${refusedLands ? `; ${refusedLands} lands REFUSED BY THE GROUND — the plough stops at the crag and at the marsh (§5 W1 exit 2)` : ''})`
      + `${terracedFurlongs ? `, ${terracedFurlongs} of ${furlongs} drawn furlongs TERRACED — the ground had to be held to be farmed` : ''}`
      + `${hungry
        ? `. The leaf is a WINDOW on the hinterland, and a settlement of this size eats more than any one frame can grow; the balance is the parish beyond the margin.`
        : `. The settlement's hunger does not claim all of it — the surplus is pasture, wood and waste.`}`,
  };
}

/**
 * ⭐⭐ §16.2 — THE FURLONG'S BEARING: ORIENTED ON THE SETTLEMENT, DEFORMED BY THE GROUND.
 *
 * This is the clause the whole ruling turns on, so the three terms are worth naming:
 *
 *  1 THE VILLAGE IS WHERE THE PLOUGH TEAMS LIVE, so a furlong's lands run with their
 *    ACCESS toward it — an exact bearing, not a seeded angle (MF-B2's was `hashUnit × 1024`,
 *    which is why its countryside read as confetti rather than as a parish).
 *  2 THE CONTOUR OVERRULES IT ON A SLOPE. Ploughing straight down a hillside washes the
 *    soil off it; every hill farmer in history worked ACROSS the fall, and the strips bend
 *    to the contour in proportion to how steep the ground is. That is also precisely what
 *    §157's ban is protecting: terrain-blind symmetry is the cliché, and terrain-deformed
 *    orientation is the history.
 *  3 A ROAD KINKS IT. A furlong beside a road runs its lands along the road, because the
 *    headland is where the cart turns.
 *
 * ⚠ AND A SEEDED RESIDUAL REMAINS, DELIBERATELY. Two neighbouring furlongs never agreed
 * exactly; a few degrees of hashed difference is what keeps the patchwork from reading as
 * a fan even where the ground is flat and the roads are far.
 */
export function furlongBearing(sub, site, greatField, roads, pitch, fk) {
  // The great field's own prevailing grain — derived once, for the whole field.
  let ang = greatField.grain;

  // THE LOCAL FALL. A furlong on a steeper patch than its field's average bends further
  // toward the contour: ploughing straight down a hillside washes the soil off it, and
  // every hill farmer in history worked ACROSS the fall.
  const h = Math.max(4, pitch * 0.35);
  const gx = sampleAt(sub, sub.height, site.cx + h, site.cy) - sampleAt(sub, sub.height, site.cx - h, site.cy);
  const gy = sampleAt(sub, sub.height, site.cx, site.cy + h) - sampleAt(sub, sub.height, site.cx, site.cy - h);
  const contour = bearingIndex(-gy, gx);
  const relief = sub.shape && sub.shape.relief ? sub.shape.relief : 0.3;
  const slope = sampleAt(sub, sub.slope, site.cx, site.cy) * (relief / REFERENCE_RELIEF);
  const wSlope = slope <= TILLAGE.easy ? 0
    : Math.min(1, (slope - TILLAGE.easy) / Math.max(0.001, TILLAGE.terrace - TILLAGE.easy));
  ang = axialBlend(ang, contour, wSlope * 0.62);

  // THE ROAD KINK (§16.2). Only a road that actually passes this furlong deforms it — the
  // headland is where the cart turns, so the lands run with the way past them.
  let bestD = Infinity, roadAng = -1;
  for (const rd of roads) {
    const line = rd.line || rd;
    if (!line || line.length < 2) continue;
    const d = distToPolyline(site.cx, site.cy, line);
    if (d >= bestD || d > pitch * 0.9) continue;
    bestD = d;
    let segBest = Infinity, sa = -1;
    for (let i = 0; i < line.length - 1; i++) {
      const mx = (line[i][0] + line[i + 1][0]) / 2, my = (line[i][1] + line[i + 1][1]) / 2;
      const dd = (mx - site.cx) * (mx - site.cx) + (my - site.cy) * (my - site.cy);
      if (dd < segBest) { segBest = dd; sa = bearingIndex(line[i + 1][0] - line[i][0], line[i + 1][1] - line[i][1]); }
    }
    roadAng = sa;
  }
  if (roadAng >= 0) ang = axialBlend(ang, roadAng, 0.55 * (1 - bestD / (pitch * 0.9)));

  // The residual: a few degrees of hashed disagreement between neighbours. Two furlongs in
  // one field never agreed exactly, and without this the field reads as one ruled hatch.
  const jitter = Math.round((hashUnit(`${fk}|aj`) - 0.5) * TRIG_N * 0.055);
  return ((ang + jitter) % TRIG_N + TRIG_N) % TRIG_N;
}

/**
 * ⭐⭐ THE GREAT FIELDS — the two or three bodies of the rotation, and the unit §16.2's
 * "orient toward their settlement" actually belongs to.
 *
 * Each field takes a seat on a ring about the village at a SEEDED, DELIBERATELY UNEVEN
 * bearing and distance (an even fan of three would be the symmetry the ban is about), and a
 * furlong joins the field whose seat is nearest. The field's grain is then the bearing from
 * ITS OWN body to the village — access runs home, which is the clause's substance —
 * deformed by the ground under that body.
 */
export function layGreatFields(args) {
  const { zone, centre, extent, sub, key, count, metresPerUnit } = args;
  const K = Math.max(1, count);
  /** @type {Array<{index:number,x:number,y:number,grain:number,cx:number,cy:number}>} */
  const seats = [];
  for (let k = 0; k < K; k++) {
    const b = Math.round(((k + hashUnit(`${key}|gf|${k}|b`) * 0.72 - 0.36) * TRIG_N) / K);
    const r = extent * (1.05 + hashUnit(`${key}|gf|${k}|r`) * 0.85);
    seats.push({
      index: k,
      x: centre.x + cosI(((b % TRIG_N) + TRIG_N) % TRIG_N) * r,
      y: centre.y + sinI(((b % TRIG_N) + TRIG_N) % TRIG_N) * r,
      grain: 0, cx: 0, cy: 0,
    });
  }
  // The field's BODY is the furlongs that joined it, so the grain is taken from where the
  // field actually lies rather than from where its seat was thrown.
  const sums = seats.map(() => ({ x: 0, y: 0, n: 0 }));
  const nearest = (x, y) => {
    let best = 0, bd = Infinity;
    for (const s of seats) {
      const d = (s.x - x) * (s.x - x) + (s.y - y) * (s.y - y);
      if (d < bd) { bd = d; best = s.index; }
    }
    return best;
  };
  for (const s of zone.values()) {
    const k = nearest(s.cx, s.cy);
    sums[k].x += s.cx; sums[k].y += s.cy; sums[k].n++;
  }
  for (const seat of seats) {
    const acc = sums[seat.index];
    seat.cx = acc.n ? acc.x / acc.n : seat.x;
    seat.cy = acc.n ? acc.y / acc.n : seat.y;
    const base = bearingIndex(centre.x - seat.cx, centre.y - seat.cy);
    const h = Math.max(8, extent * 0.5);
    const gx = sampleAt(sub, sub.height, seat.cx + h, seat.cy) - sampleAt(sub, sub.height, seat.cx - h, seat.cy);
    const gy = sampleAt(sub, sub.height, seat.cx, seat.cy + h) - sampleAt(sub, sub.height, seat.cx, seat.cy - h);
    const contour = bearingIndex(-gy, gx);
    const relief = sub.shape && sub.shape.relief ? sub.shape.relief : 0.3;
    const slope = sampleAt(sub, sub.slope, seat.cx, seat.cy) * (relief / REFERENCE_RELIEF);
    const w = slope <= TILLAGE.easy ? 0
      : Math.min(1, (slope - TILLAGE.easy) / Math.max(0.001, TILLAGE.terrace - TILLAGE.easy));
    // ⚠ THE FIELD'S OWN SEEDED TURN. Even a flat parish's fields did not point exactly at
    // the church: the great fields took their grain from the boundaries and drainage that
    // were already there. A sixth of a quadrant of hashed turn is what stops K fields
    // reading as K spokes.
    const turn = Math.round((hashUnit(`${key}|gf|${seat.index}|t`) - 0.5) * TRIG_N * 0.16);
    seat.grain = ((axialBlend(base, contour, w) + turn) % TRIG_N + TRIG_N) % TRIG_N;
  }
  void metresPerUnit;
  return {
    seats,
    fieldFor(x, y) { return seats[nearest(x, y)]; },
  };
}

/**
 * Blend two AXIAL directions (a ploughing direction is the same line at 0° and 180°, so the
 * blend must run on the half-circle or two furlongs pointing the same way would average to
 * a right angle).
 */
function axialBlend(a, b, w) {
  if (w <= 0) return a;
  const H = TRIG_N / 2;
  let d = ((b - a) % H + H) % H;
  if (d > H / 2) d -= H;
  return ((a + Math.round(d * w)) % TRIG_N + TRIG_N) % TRIG_N;
}

/**
 * Slice a convex ring into `count` parallel bands along direction `ang`. The bands TILE the
 * ring exactly — each is the ring clipped between two parallel half-planes and consecutive
 * bands share their cut line — which is what makes the strips contiguous inside the furlong
 * the way the furlongs are contiguous inside the parish.
 * ⚠ The boundaries are JITTERED but MONOTONE: a strip is never a ruler's width, and two
 * neighbours' lands meet at a baulk that wanders — but the offsets stay sorted, so no band
 * can invert and no ground can be claimed twice.
 */
export function sliceConvex(poly, ang, count, fk) {
  const nx = -sinI(ang), ny = cosI(ang);           // the strip NORMAL (strips run along ang)
  let lo = Infinity, hi = -Infinity;
  for (const p of poly) {
    const t = p[0] * nx + p[1] * ny;
    if (t < lo) lo = t;
    if (t > hi) hi = t;
  }
  const span = hi - lo;
  if (!(span > 0)) return [poly];
  /** @type {number[]} */ const cuts = [lo];
  for (let k = 1; k < count; k++) {
    const base = lo + (span * k) / count;
    cuts.push(base + (hashUnit(`${fk}|cut|${k}`) - 0.5) * (span / count) * 0.34);
  }
  cuts.push(hi);
  /** @type {Array<Array<[number,number]>>} */ const out = [];
  for (let k = 0; k < count; k++) {
    // Clip to t >= cuts[k] and t <= cuts[k+1]. `clipHalfPlane` keeps the side where the
    // dot product against the outward normal is <= 0.
    let band = clipHalfPlane(poly, nx * cuts[k], ny * cuts[k], -nx, -ny);
    band = band ? clipHalfPlane(band, nx * cuts[k + 1], ny * cuts[k + 1], nx, ny) : null;
    if (band && band.length >= 3) out.push(band);
  }
  return out.length ? out : [poly];
}

/**
 * ⭐⭐ §16.3 — THE FIELD LANES. "The lane network serves the fields: field lanes branch from
 * the village roads to the furlongs — a village is connected to its living."
 *
 * ⭐ THE LANES RUN ON THE BAULKS, and that is the whole mechanism. A field track never cut
 * across a holding — it ran along the boundary between them, which is exactly the lattice's
 * own edges. So a lane is a WALK ON THE LATTICE VERTEX GRAPH: it starts where a road leaves
 * the town, and steps corner to corner outward through the worked land. Nothing has to be
 * routed around anything, because the tiling's edges are already the ways between fields.
 *
 * ⭐ AND IT IS ALSO THE STREET WEB'S CONTINUATION (§2.3's continuity law). The town's roads
 * stop being streets at the last house; the lanes are what they become.
 */
function fieldLanes(args) {
  const { zone, vert, roads, centre, inTown, key, pitch } = args;
  /** @type {Array<{key:string, line:Array<[number,number]>}>} */ const lanes = [];
  const has = (i, j) => zone.has(`${i}|${j}`);
  const nearestVertex = (x, y) => [Math.round(x / pitch), Math.round(y / pitch)];

  let serial = 0;
  // ⛔ A GREEDY WALK WITH NO MEMORY DOUBLES BACK, and on a lattice that draws a CLOSED
  // RECTANGLE — a field track that goes right, down, left and up to where it started. Three
  // of them appeared on the village leaf as little white boxes floating in the corn. A track
  // is a path, so the walk keeps the vertices it has used and never returns to one.
  /** @type {Set<string>} */ const used = new Set();
  const walk = (i0, j0, steps, lk, depth, from) => {
    // ⭐ THE LANE BEGINS AT THE ROAD, NOT AT THE NEAREST CORNER OF THE LATTICE. Snapping the
    // root to a vertex can leave the track starting most of a furlong from the road it is
    // supposed to leave, and it then reads as a white scratch lying in the corn rather than
    // as a way out of the village. Starting the polyline AT the road point and stepping to
    // the vertex makes the connection the drawing's, not the reader's inference.
    /** @type {Array<[number,number]>} */ const line = from ? [from, vert(i0, j0)] : [vert(i0, j0)];
    let i = i0, j = j0;
    used.add(`${i}|${j}`);
    for (let s = 0; s < steps; s++) {
      /** @type {Array<{i:number,j:number,w:number}>} */ const cands = [];
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ni = i + di, nj = j + dj;
        const v = vert(ni, nj);
        if (v[0] < -pitch || v[1] < -pitch || v[0] > VIEW + pitch || v[1] > VIEW + pitch) continue;
        // A lane runs BETWEEN worked land: at least one of the two cells the edge divides
        // must be a furlong, or the track is going into the waste.
        const touches = (di !== 0)
          ? (has(Math.min(i, ni), j) || has(Math.min(i, ni), j - 1))
          : (has(i, Math.min(j, nj)) || has(i - 1, Math.min(j, nj)));
        // ⚠ THE FIRST TWO STEPS MAY CROSS UNWORKED GROUND. A lane must get OUT of the
        // settlement's own collar before it reaches a furlong, and the town's edge cells are
        // by definition not furlongs — MEASURED, requiring worked land from step one gave
        // the TOWN, the CITY and the FJORD no field lanes at all while the village kept
        // five, purely because a village's fields start at its hedges and a town's do not.
        if (!touches && s >= 2) continue;
        // ⛔ AND IT NEVER RE-ENTERS THE TOWN (MF-B4). The root is chosen outside the fabric,
        // but nothing checked the STEPS — and once MF-B4's inversion derived the umbrella
        // from the block runs, the settlement's edge stopped being a smooth blob and grew
        // real bays between its quarters, so an outward walk could cross back through one.
        // MEASURED: the village's lanes came back with two vertices inside the town, which
        // reads as a farm track ploughing straight through somebody's back yard.
        // ⭐ THE CLASS: a predicate applied to a walk's ROOT is not applied to its PATH, and
        // a shape that was convex enough to make the difference invisible will not stay so.
        if (inTown(v[0], v[1])) continue;
        if (used.has(`${ni}|${nj}`)) continue;
        const from = vert(i, j);
        const dOut = Math.sqrt((v[0] - centre.x) ** 2 + (v[1] - centre.y) ** 2)
          - Math.sqrt((from[0] - centre.x) ** 2 + (from[1] - centre.y) ** 2);
        // Outward is what a field lane does; the hash breaks ties so it wanders like one.
        cands.push({ i: ni, j: nj, w: dOut + hashUnit(`${lk}|${s}|${di}|${dj}`) * pitch * 0.55 });
      }
      if (!cands.length) break;
      cands.sort((a, b) => b.w - a.w || a.j - b.j || a.i - b.i);
      const nxt = cands[0];
      i = nxt.i; j = nxt.j;
      used.add(`${i}|${j}`);
      line.push(vert(i, j));
      // A BRANCH, once, and shallow: a track forks to serve two furlong blocks and stops.
      if (depth === 0 && s > 1 && cands.length > 1 && hashUnit(`${lk}|br|${s}`) < 0.30) {
        walk(cands[1].i, cands[1].j, Math.max(2, Math.round(steps * 0.45)), `${lk}|b${s}`, 1);
      }
    }
    // A two- or three-point stub is not a lane; it is a mark. Four points is a track that
    // goes somewhere, and anything shorter is dropped rather than drawn.
    if (line.length >= 4) lanes.push({ key: `fieldlane.${serial++}`, line });
  };

  for (const rd of roads) {
    const line = rd.line || rd;
    if (!line || line.length < 2) continue;
    // Where this road stops being a street: the first point along it that is out of town.
    let root = null;
    for (const p of line) {
      if (inTown(p[0], p[1])) continue;
      const d = Math.sqrt((p[0] - centre.x) ** 2 + (p[1] - centre.y) ** 2);
      if (!root || d < root.d) root = { p, d };
    }
    if (!root) continue;
    // ⚠ AND THE LANE MUST START AT THE ROAD. A root snapped to a lattice vertex can land a
    // pitch away from the road it is supposed to leave, and the track then floats in the
    // fields joined to nothing — §16.3's whole claim is that the village is CONNECTED to its
    // living, so a lane that starts nowhere is worse than no lane.
    const [i0, j0] = nearestVertex(root.p[0], root.p[1]);
    const v0 = vert(i0, j0);
    const gap = Math.sqrt((v0[0] - root.p[0]) ** 2 + (v0[1] - root.p[1]) ** 2);
    // ⚠ ONE FURLONG, not three-quarters of one: a lattice vertex can lie up to ~0.93 of a
    // pitch from an arbitrary point (half a diagonal plus the corner jitter), and the
    // tighter gate silently gave the TOWN, the CITY and the FJORD no field lanes at all
    // while reporting nothing. A whole pitch still means "the track starts at the road",
    // because a pitch IS one furlong.
    if (gap > pitch) continue;
    walk(i0, j0, 7, `${key}|lane|${lanes.length}`, 0, root.p);
  }
  return lanes;
}

/**
 * ⭐ THE TILLAGE SCORE — the ranking that replaced the threshold.
 *
 * Every term is a read of the substrate, and the function returns 0 ONLY for ground that
 * cannot be farmed by anyone at any price (sheer rock, standing water, past the plough
 * team's day). Everything else gets a number, so the allocation always has somewhere to
 * go and a settlement is never drawn starving on ground it plainly farmed.
 */
export function tillageScore(sub, x, y, centre, extent, metresPerUnit) {
  // ⛔⛔ THE SLOPE FIELD IS NORMALIZED PER-PLACE, AND TILLAGE IS AN ABSOLUTE QUESTION.
  // `sub.slope` divides by the steepest cell PRESENT, which is exactly right for the
  // question the rest of the fabric asks it ("is this the flattest ground hereabouts?").
  // A PLOUGH TEAM does not read it that way: an ox cannot pull a share up a one-in-three
  // whether or not the next hill is steeper. MEASURED with the normalized field: a FJORD
  // came back 87% workable and a plains village 97% — no spread at all.
  // ⭐ THE CLASS: a field normalized for one consumer's frame of reference is a CONSTANT
  // for a consumer whose question is absolute.
  const slope = sampleAt(sub, sub.slope, x, y)
    * ((sub.shape && sub.shape.relief ? sub.shape.relief : 0.3) / REFERENCE_RELIEF);
  const wet = sampleAt(sub, sub.wet, x, y);
  const height = sampleAt(sub, sub.height, x, y);

  // ⭐⭐ THE TWO ABSOLUTES ARE NOW ONE QUESTION, ASKED OF THE ONE HOME (§5 W1 exit 2).
  // This function had noticed the per-leaf normalization problem (see the note above) and
  // cured it with `relief / REFERENCE_RELIEF` — a rescale by the family's DECLARED relief,
  // which is not the same as the ground's MEASURED gradient. `groundRefusal.absoluteGrade`
  // undoes the actual divisor, so the refusal is the same fact for the plough as for the
  // house. **The ploughland may not tile ground the fabric refuses** — that sentence IS
  // §5 W1 exit 4's acceptance failure, and this line is where it stops being true.
  if (!buildableAt(sub, x, y)) return 0;             // sheer rock, or standing water
  if (slope > TILLAGE.terraceMax) return 0;          // past the plough team, though a house could stand
  if (wet > TILLAGE.wetMax) return 0;                // too wet to plough, though not yet marsh

  // SLOPE: full marks to the valley floor, then a real cost, then the terrace band where
  // the ground is workable only because somebody built walls to hold it.
  const slopeTerm = slope <= TILLAGE.easy ? 1
    : slope <= TILLAGE.terrace ? 1 - ((slope - TILLAGE.easy) / (TILLAGE.terrace - TILLAGE.easy)) * 0.45
      : 0.55 - ((slope - TILLAGE.terrace) / (TILLAGE.terraceMax - TILLAGE.terrace)) * 0.40;

  // WETNESS: a damp meadow is the BEST ground there is; a bog is not. The peak sits at
  // `wetBest` rather than at zero, which is why a floodplain village's fields hug its
  // river instead of avoiding it.
  const wetTerm = wet <= TILLAGE.wetBest
    ? 0.62 + (wet / TILLAGE.wetBest) * 0.38
    : 1 - ((wet - TILLAGE.wetBest) / (TILLAGE.wetMax - TILLAGE.wetBest)) * 0.85;

  // THE LEE SIDE. Low ground in the shelter of the high is warmer, deeper-soiled and
  // out of the wind — the ground a farmer actually chose.
  const leeTerm = 0.72 + (1 - height) * 0.28;

  // ⛔⛔ THE DAY'S WORK IS A DISTANCE, AND IT WAS BEING MEASURED IN VIEW UNITS.
  // MF-B2 wrote `reachOut = max(200, extent × 3.4)` — 200 VIEW UNITS as the floor. But a
  // view unit is a different number of METRES at every tier, because the leaf zooms with
  // the settlement (§5): at a thorp the module is ~26 units to the rod, so 200 units is
  // THIRTY-EIGHT METRES, and the thorp was drawn with its fields stopping a bowshot from
  // its own doors. MEASURED: 22 of 110 dry furlong blocks worked on a PLAINS thorp, against
  // §5's own row for that tier — "fields dominate".
  // ⭐ THE CLASS, and it is the third member of a family this lane keeps meeting: a length
  // in the drawing's own units is a CONSTANT wearing a distance's name. The plough team's
  // day is a fact about legs, so it is stated in metres and converted at the leaf's scale.
  // ⚠ A CALLER WITH NO SCALE GETS NO CULL, AND THAT IS THE DECLARED BEHAVIOUR. The reach is
  // a distance in METRES, so it cannot be evaluated without the leaf's own metres-per-unit.
  // Rather than invent one (which would be a wrong cull wearing a right name — exactly the
  // defect this parameter exists to fix), an absent scale leaves the reach UNBOUNDED: the
  // ground's own terms still decide, and nothing is refused for being far.
  const dx = x - centre.x, dy = y - centre.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  const scaled = Number.isFinite(metresPerUnit) && metresPerUnit > 0;
  const reachOut = scaled ? REACH_METRES / metresPerUnit : Infinity;
  if (d > reachOut) return 0;
  const reachTerm = scaled ? 1 - (d / reachOut) * 0.25 : 1;

  return slopeTerm * wetTerm * leeTerm * reachTerm;
}

/**
 * ⭐ THE OUTER FURLONG OF A REAL PARISH, in metres. §42/§43 VALUE, PROPOSED-WITH-RATIONALE:
 * the common-field parish was walked out and back in a working day with a team, which puts
 * the far lands at roughly a mile and a half. Every one of our leaves is a window narrower
 * than that, so the term is a gentle decay inside the frame and a hard zero nowhere the
 * reader can see — which is the truth, rather than an artefact of the frame's own size.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const REACH_METRES = 2400;

/**
 * ⭐⭐ WHAT THE GROUND IS WORTH vs WHAT THE SURVEYOR DETAILS — and they are two questions.
 *
 * ⛔ MF-B2 folded the day's-work term into the tillage score, so ONE number carried both
 * "is this ground good?" and "is this ground near?". That made the arable EXTENT depend on
 * the drawing's centre — a §161a truth claim taking an argument from composition.
 * ⭐ The split: `tillageScore` is a fact about the ground alone; `drawPriority` is the
 * RATION — a surveyor details the home fields his patron walks and generalizes the far ones
 * to their outline. Same allocation the LOD merge makes inside the town, from the other
 * side of the wall.
 */
export function drawPriority(score, x, y, centre, extent) {
  const dx = x - centre.x, dy = y - centre.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  const near = 1 / (1 + d / Math.max(60, extent * 1.6));
  return score * (0.35 + near * 0.65);
}

/** Is this ring convex? The slice pass is exact on convex rings only, so a cell that comes
 * back concave is drawn whole and COUNTED rather than sliced into wrong ground. */
function isConvexRing(poly) {
  let sign = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], c = poly[(i + 2) % poly.length];
    const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (cr === 0) continue;
    const s = cr > 0 ? 1 : -1;
    if (sign === 0) sign = s; else if (s !== sign) return false;
  }
  return true;
}

function polyArea(poly) {
  let a = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    a += poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1];
  }
  return a < 0 ? -a / 2 : a / 2;
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
