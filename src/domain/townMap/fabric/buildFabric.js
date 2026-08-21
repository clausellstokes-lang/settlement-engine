/**
 * domain/townMap/fabric/buildFabric.js — THE ASSEMBLY.
 *
 * `buildFabric(settlement, model, options)` is a PURE, view-time projection: the same
 * (settlement, mapEdits, style) yields byte-identical output forever. It persists
 * nothing; THE PROMISE is untouched.
 *
 * ⭐⭐ THE COMPOSITION-ORDER LAW (§175.1) IS THE SHAPE OF THIS FILE, and the stage
 * comments below are load-bearing rather than decorative — each stage may read only what
 * the stages above it produced:
 *
 *   0 GROUND         substrate → water → suitability → nuclei → subseeds   (§5.-1)
 *   1 CONSTITUTION   roster math ONLY, no geometry                          (§161l)
 *   2 ANCHORING      category-level only, per organism, independently       (§5.0c.1)
 *   3 GROWTH         accretion → fields → partition → umbrella → streets → parcels
 *   4 SEATING        ONE greedy seeded pass, toward already-seated only     (§175.1)
 *   5 CIRCUIT        the wall, which needs everything above it             (§161m.1)
 *
 * ⭐ THE ENTRY SEAM: the fabric is a function of (settlement, LANDED MODEL). It consumes
 * the landed model's truth — `meta.tier/terrain/tradeAccess/hasWalls`, `frame.water`,
 * `districts[].id/category/wealth`, `buildings[].anchorKey/districtId` — rather than
 * re-deriving placement. No new engine reads were required by the prototype and none are
 * required here.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare, no ambient rng.
 */

import { fabricRng, hashUnit, fabricForkKey } from './fabricRng.js';
import { compareKeys, institutionKey } from './lineage.js';
import { absArea, distToPolyline, offsetLine, pointInPolygon } from './fabricGeometry.js';
import { buildSubstrate, measuredRelief, reliefField as reliefFieldOf, resourceCoherence, VIEW } from './substrate.js';
import { suitabilityField, findNuclei, connectingRoads, ribbonPoints, waterBlindSeat } from './suitability.js';
import { selectMorphology } from './morphology.js';
import { deriveWaterMode, deriveWatercourse, isInWater as isInWaterRel, waterBearing as waterBearingOf } from './waterMode.js';
import { buildableMask } from './groundRefusal.js';
import { tierScale } from './tierGrammar.js';
import { attributeInstitutions, growOrganisms, organismCentroid, derivePrecincts } from './organisms.js';
import { buildPartition } from './organismFields.js';
import { buildUmbrella, circularity } from './umbrella.js';
import { deriveBuiltUmbrella, faceTheVoids } from './builtUmbrella.js';
import { claimClipper, enforceGround, overlapping } from './groundLaw.js';
import { TOUCH_EPS } from './reservedGround.js';
import { sweepLateBodies, sweepStateBodies } from './lateGround.js';
import { frontInstitutions, attachSolids } from './institutionShapes.js';
import { waterClaims, deriveBridges, moorWaterBound, deriveWaterGates, clipFieldsToWater } from './waterWorks.js';
import { tenurePattern, seatWorksiteHabitation, seatKeepers, buildFaubourgs, GLACIS_THRESHOLD, faubourgSeriousness } from './habitation.js';
import { reserveCommons, enclosureRead, inCommons } from './commons.js';
import { buildRelief, waterStrokes } from './relief.js';
import { buildFields } from './fields.js';
import { deriveMeasure } from './measure.js';
import { buildImmersion } from './immersion.js';
import { deriveStateMarks, stressorKeysOf, DANGER_STRESSORS } from './stateMarks.js';
import { marketColonization, presentYear } from './snapshot.js';
import { compileSpatialRecord } from './compile.js';
import { buildRouteSkeleton, corridorPull } from './routes.js';
import { buildWorks } from './terraform.js';
import { buildStreetWeb, forbiddenGround, deriveQuarterLanes, buildStreetChannels, webConnectivity, ladderWidths } from './streets.js';
import { deriveOutlyingLanes } from './streetEdges.js';
import { packFabric, mergeDistantMatrix, buildShantyFringe } from './parcels.js';
import { buildLandmarks, powerWeb, classify, isDispersed } from './institutions.js';
import { seatInstitutions } from './seating.js';
import {
  circuitClaims, publishCircuitRings, circuitInputsFrom, deriveWallCircuit, wallStandingFor,
  circuitWallLanes,
} from './wallCircuit.js';
import { demoteCircuits, reserveFossils, sitedDemotion } from './circuitDemotion.js';
import { wallMeta } from './wallRuns.js';
import { compoundDiscs, compoundGround } from './compoundGround.js';
import { partitionAtTheWall } from './districtPartition.js';
import { censusLeaf } from './leafCensus.js';
import { governFabricSurfaces } from './publication.js';

/** The engine's own prosperity vocabulary — never FTG's squalid→aristocratic (§8.2). */
const PROSPERITY_RANK = Object.freeze({
  Destitute: 0, Poor: 1, Struggling: 1, Moderate: 2,
  Comfortable: 3, Prosperous: 4, Wealthy: 5, Thriving: 5,
});

/**
 * How many unhoused peers of one category FOUND their own district (§161l founding rule).
 * §42/§43 VALUE, PROPOSED-WITH-RATIONALE: three is the smallest number that reads as a
 * quarter rather than as a coincidence — two smelters are neighbours, three are a trade.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const FOUNDING_QUORUM = 3;

/**
 * The partition grid's resolution.
 *
 * ⛔ RAISED FROM 64 TO 128 (MF-B1b), AND THE REASON IS THE OUTLINE, NOT THE CLICK REGION.
 * The old note read "a click region accurate to ~16 view units is finer than any pointer,
 * and halving it would quadruple the trace for nothing" — true about POINTERS and wrong
 * about INK. The umbrella is traced off this grid, so the grid pitch IS the settlement
 * outline's step size, and 15.6-unit steps on a 1000-unit leaf render as a visible pixel
 * staircase at every tier. At 128 the pitch is 7.8 units, which the organic smoothing in
 * ./umbrella.js then carries below the ink weight of the boundary itself. The quadrupled
 * trace is real and it is the price of an inked edge; measured, it costs a few milliseconds
 * per settlement against a render that already walks a 96² substrate five times.
 */
export const PARTITION_N = 128;

/**
 * How much ground a monumental compound reserves, in units of its own drawn `size`.
 * §42/§43 VALUE, READ OFF THE LENS: `archetypeShape` draws a hall about 2.1 × size across
 * and a cloister quad 1.9, so 1.35 × size as a radius covers the silhouette plus the close
 * or yard that belongs to it — the ground a precinct wall would have enclosed.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const COMPOUND_R = 1.35;

/**
 * How large an institution must be, in PLOT FRONTAGES, to reserve a compound before the
 * parcels are cut. §42/§43 VALUE: 1.2 frontages is a building that cannot be fitted into an
 * ordinary burgage plot, which is exactly the historical test for whether the street had to
 * be laid out around it. ⚠ UNSOAKED; rides the tuning signature.
 */
export const COMPOUND_MIN = 1.2;

/**
 * Build the fabric.
 * @param {any} settlement
 * @param {any} model             the landed buildTownMapModel output (truth)
 * @param {{ mapEdits?: any, morphologyOverride?: string, dress?: any }} [options]
 * @returns {any}
 */
export function buildFabric(settlement, model, options = {}) {
  const s = settlement || {};
  const edits = options.mapEdits || null;
  const seed = s._seed != null ? s._seed : (s.id != null ? s.id : 'town-map-seedless');
  const variant = edits && Number.isInteger(edits.layoutVariant) && edits.layoutVariant > 0
    ? Number(edits.layoutVariant) : 0;
  const seeding = { seed, variant };
  // ⭐⭐⭐ MF-ARCH-2 · §241.5b · THE REROLL SALT REACHES EVERY FORK IN THIS FILE, BY CONSTRUCTION.
  // MF-ARCH measured twelve hand-minted fork keys and **five that dropped the salt entirely**:
  // `${seed}|meander`, `${seed}|coast|i`, `${seed}|umb`, `${seed}|built-umb` and
  // `${seed}|built|wall` composed from the BARE seed, so a reroll could not reach the river's
  // meander, the settlement outline, the built outline or the wall. A sixth re-added the salt
  // BY HAND as `|v${variant}` — a third spelling of a rule that already had two. ⭐ THE CLASS:
  // **A PIN ON A COMPOSER IS NOT A PIN ON ITS CALLERS**; `fabricForkKey` obeyed the law
  // perfectly while five mechanics never called it. Every fork below goes through the one home.
  const fork = (name) => fabricForkKey(seed, name, { variant });

  const scale = tierScale(s);
  // ── §15.1 THE SPATIAL COMPILATION RECORD ────────────────────────────────────
  // ⭐⭐ ONE normalization pass compiles the dossier into typed, sourced, confidence-tagged
  // constraints, and every stage below reads THE RECORD rather than the raw dossier again.
  // See compile.js for the four-module `tradeRouteAccess` read this removes.
  const record = compileSpatialRecord(s, model, { routeLedger: options.routeLedger || null });
  const morphology = selectMorphology(s, options);
  // THE LAWFULNESS DIAL (§161m.2): the same civic-order read the morphology selector
  // uses, so a town's street plan and its supply chains tell the SAME story about how
  // well it is run — one fact, two expressions, never two independent dials.
  const lawfulness = morphology.civicOrder;
  const prosperity = String((s.economicState && s.economicState.prosperity) || 'Moderate');
  const prosperityRank = PROSPERITY_RANK[prosperity] == null ? 2 : PROSPERITY_RANK[prosperity];

  // ── STAGE 0 · THE GROUND ────────────────────────────────────────────────────
  const terrain = (model && model.meta && model.meta.terrain) || 'plains';
  const sub = buildSubstrate(s, terrain, seeding, {
    waterKind: model && model.frame && model.frame.water ? model.frame.water.kind : null,
  });

  // The watercourse: siteGenesis (through the landed model) decides WHETHER; the
  // substrate decides WHERE (the one-decider rule). A river runs in the drainage the
  // heightfield produced, so the water is in the ground that made it.
  // ⭐⭐ WHERE THE WATER RUNS is `waterMode.deriveWatercourse` — the drainage trace, the meander
  // and the traced shore, seated beside the RELATIONSHIP they are the input to (MF-PERF1).
  // The one-decider rule is unchanged: the landed model still says WHETHER, this says WHERE.
  // ⭐⭐ §5 W1 EXIT 6 · THE WATER-BLIND SEAT, and it is the ONE new derivation this exit
  // needed. See `suitability.waterBlindSeat` for the cycle it exists to break and for the
  // measurement that ruled out the landed model's anchor. It costs one extra field walk and
  // reads NOTHING the water produces, so Stage 0 stays Stage 0.
  const seatField = suitabilityField(sub, s, {
    hasWalls: !!(model && model.meta && model.meta.hasWalls),
    waterKind: model && model.frame && model.frame.water ? model.frame.water.kind : null,
    exclude: null,
  });
  const seat = waterBlindSeat(seatField);
  const water = deriveWatercourse({
    modelWater: model && model.frame ? model.frame.water : null,
    sub, seeding, builtRadius: scale.builtRadius, meanderKey: fork('meander'),
    worked: seat,
  });

  // ── STAGE 0b · THE REGIONAL ROUTE SKELETON (§15.2) ─────────────────────────
  // ⭐⭐ "THE CROSSROADS EXISTS BEFORE THE CROSSROADS TOWN." Pre-settlement corridors are
  // walked over the ground BEFORE any site is chosen, and their crossings and fords are
  // what a founding site search is looking at. See routes.js for why building the roads
  // after the town is a causality error that produces radial sunburst plans.
  // ⚠ It may read the substrate, the water and the compiled record — and NOT the nucleus,
  // which does not exist yet. That restriction is the stage's whole meaning.
  const routes = buildRouteSkeleton({
    sub, record, water, seeding, ledger: options.routeLedger || null,
  });

  const field = suitabilityField(sub, s, {
    hasWalls: !!(model && model.meta && model.meta.hasWalls),
    waterKind: water ? water.kind : null,
    // Nothing is sited in the sea. The wetness term already discourages it; the body is an
    // ABSOLUTE, because "discouraged" is not what a coastline is.
    exclude: water && water.body ? (x, y) => pointInRing(water.body, x, y) : null,
  });
  const nuclei = findNuclei(field, sub, seeding, {
    maxNuclei: scale.maxNuclei,
    // §15.2: a site on a corridor is worth more, and a site at a CROSSING more again.
    pull: corridorPull(routes, scale.builtRadius),
    // THE ROOM LAW: a founding site must hold the settlement it becomes (see findNuclei).
    // 0.62 of the built radius, not 1.0 — a coastal or riverside town legitimately runs off
    // one edge of its own leaf, and demanding the whole disc would refuse every port.
    margin: scale.builtRadius * 0.62,
    // A SECONDARY SITE must be genuinely good, not merely second: 82% of the best site's
    // score. Below that the settlement is a one-site town and clusters, which is the
    // correct map rather than a failure to reach its bound.
    secondaryFloor: 0.82,
  });
  const nucleus = nuclei[0];
  const subseeds = connectingRoads(nuclei, sub, seeding);
  const ribbons = ribbonPoints(subseeds, scale.builtRadius * 0.22);
  const waterRel = deriveWaterMode(water, nucleus, s, sub, seeding);

  // ── STAGE 1 · CONSTITUTION — roster math only, NO GEOMETRY ───────────────────
  const rawInstitutions = Array.isArray(s.institutions) ? s.institutions : [];
  const modelBuildings = (model && Array.isArray(model.buildings)) ? model.buildings : [];
  /** @type {Map<string,string>} */ const anchorToDistrict = new Map();
  /** @type {Map<string,string>} */ const anchorByName = new Map();
  for (const b of modelBuildings) {
    if (b && b.anchorKey) {
      anchorToDistrict.set(b.anchorKey, String(b.districtId || ''));
      if (b.name) anchorByName.set(String(b.name), b.anchorKey);
    }
  }
  const anchorFor = (inst) => anchorByName.get(String(inst.name || '')) || institutionKey(inst);

  const constitution = rawInstitutions.map((inst) => ({
    key: institutionKey(inst),
    category: String(classify(inst).archetype),
    districtId: anchorToDistrict.get(anchorFor(inst)) || null,
    dispersed: isDispersed(inst),
  }));
  const landedDistricts = (model && Array.isArray(model.districts) ? model.districts : [])
    .map((d) => ({ id: d.id, name: d.name, category: d.category, wealth: d.wealth, safety: d.safety }));
  const attribution = attributeInstitutions(constitution, landedDistricts, FOUNDING_QUORUM);
  const districts = landedDistricts.concat(attribution.founded);

  // ── STAGE 1b · THE COMMONS ARE RESERVED BEFORE ANYTHING GROWS (§5.0c.3) ──────
  // ⭐⭐ A GREEN IS A PLACE THE TOWN WAS NEVER ALLOWED TO BUILD, not a place it happened
  // not to reach — see commons.js's header for why the three "hope for a gap" mechanisms
  // MF-B1 tried could not work. This reads STAGE-0/1 FACTS ONLY (nucleus, extent, tier and
  // the SET of district categories), which is what keeps it inside the composition-order
  // law and inside the inertia law at the same time.
  const reserved = reserveCommons({
    nucleus: { x: nucleus.x, y: nucleus.y },
    extent: scale.builtRadius,
    tier: scale.extentTier,
    categories: districts.map((d) => String(d.category || 'other').toLowerCase()),
    sub,
    water: waterRel,
    seeding,
  });
  const commons = reserved.commons;

  // ── STAGE 2+3 · ANCHORING and GROWTH ────────────────────────────────────────
  // §15.7: the fire years the record compiled, indexed by the quarter they burned.
  const fireYears = record.get('fire-years', []);
  /** @type {Map<string, number>} */ const fireByDistrict = new Map();
  for (const f of fireYears) {
    if (!f || f.quarter == null) continue;
    const prev = fireByDistrict.get(String(f.quarter));
    // The LATEST fire is the one the grain dates from: a quarter that burned twice was
    // re-laid twice, and it is the second laying that survives.
    if (prev == null || f.year > prev) fireByDistrict.set(String(f.quarter), f.year);
  }

  const organisms = growOrganisms({
    districts,
    fireYearFor: (id) => (fireByDistrict.has(id) ? fireByDistrict.get(id) : null),
    rolls: attribution.rolls,
    tierScale: scale,
    field,
    sub,
    water: waterRel,
    reserved: (x, y, pad) => inCommons(commons, x, y, pad || 0),
    centre: { x: nucleus.x, y: nucleus.y },
    extent: scale.builtRadius,
    lawfulness,
    morphology,
    ribbons,
    seeding,
  });

  // The umbrella's inside threshold. §42/§43 VALUE, DERIVED: a cell belongs to the
  // settlement when SOME organism claims it more than weakly. Set it at the field halo's
  // own tail so the umbrella ends exactly where the organisms' influence does, rather
  // than at an independently chosen contour.
  // §42/§43 VALUE, DERIVED: a cell belongs to the settlement when some organism claims it
  // ABOVE ITS OWN TAIL. At 0.10 the halo tails of neighbouring quarters bridge every gap
  // between them and the umbrella comes back solid — no interior greens at any tier, which
  // is §5.0c.3's breathing holes silently absent. 0.30 sits above the tail and below any
  // organism's body, so a gap the organisms have NOT closed stays open and renders as the
  // common, the paddock, the garden ground it is.
  // ⭐⭐ THE QUARTER LANES ARE DERIVED ONCE AND READ THREE TIMES (§181.3a). They were
  // already here as anonymous "connective ribbons" handed straight to the partition and
  // DRAWN NOWHERE — see streets.deriveQuarterLanes for the §8.2 source-with-no-expression
  // this closes. The partition rides them (the residential matrix follows the lane, as it
  // did), the forbidden predicate now RESERVES their carriageway (so a lane is a gap in the
  // fabric rather than a stripe painted over houses), and the channel pass DRAWS them.
  // ⭐ And they BEND: a ruled segment between two anchors is a diagram of connectivity, not
  // a lane. The walk refuses steep and wet on the same terms every other road here obeys.
  const lanes = deriveQuarterLanes({ organisms, nucleus, sub, tierScale: scale, seeding });
  const bridges = lanes.map((l) => ({ line: l.line, width: l.width }));
  const partition = buildPartition(
    organisms, PARTITION_N, 0.30, bridges, commons,
    // §5.-1.4: nothing accretes across open water. See the note in organismFields.js for
    // the coastal quarter that grew 260 of its 327 cells into the sea.
    (x, y) => isInWaterRel(waterRel, x, y),
  );
  const umbrella = buildUmbrella(partition, organisms, { key: fork('umb') });
  const enclosure = enclosureRead(commons, (x, y) => {
    const i = Math.floor(x / partition.cell), j = Math.floor(y / partition.cell);
    if (i < 0 || j < 0 || i >= partition.n || j >= partition.n) return false;
    return partition.inside[j * partition.n + i] === 1;
  });

  const web = buildStreetWeb({
    organisms, umbrella, nucleus, sub, water: waterRel,
    tierScale: scale, seeding, bearings: options.bearings || null,
    routes, lanes, partition,
  });
  const forbidden = forbiddenGround(web, umbrella, waterRel, commons);

  // ── STAGE 3b · §15.3 COMPOUND RESERVATION, BEFORE PARCEL-CUTTING ────────────
  // ⭐⭐⭐ "LARGE INSTITUTIONAL COMPOUNDS RESERVE LAND BEFORE PARCEL-CUTTING; ordinary
  // institutions seat INTO already-cut compatible parcels; housing/yards fill last.
  // PARCELS NEVER BEND AROUND A HUNDRED LATE FOOTPRINTS." (§15.3, from the peer review.)
  //
  // ⛔ WHAT WAS WRONG. MF-B1b cut every parcel first and seated every institution afterwards,
  // so a cathedral precinct was drawn ON TOP OF the burgage plots that were already on that
  // ground — two buildings on one plot, and the reader sees a great church with houses
  // growing through its nave. It is also historically backwards: the precinct was walled
  // before the street was laid out, which is exactly why real cathedral closes interrupt
  // their street grids.
  //
  // ⭐ THE ORDER IS NOW THE HISTORY. The MONUMENTAL silhouettes seat first, on ground no
  // parcel has claimed; their footprints join the forbidden set; the packer then cuts the
  // fabric AROUND them, and the ragged interruption in the block ranks is the compound's
  // own doing. The ordinary institutions seat afterwards with the compounds already in
  // `preSeated`, so their §167 affinities evaluate toward them — the chandler sites himself
  // relative to the cathedral, never the reverse.
  const power = powerWeb(s);
  const landmarks = buildLandmarks({
    institutions: rawInstitutions,
    anchorFor,
    placements: anchorToDistrict,
    tierScale: scale,
    prosperityRank,
    power,
    seeding,
    // The drawing's own module — see the SIZE_MODULE note in institutions.js.
    frontage: web.plotFrontage,
  });
  // ⛔⛔ THE COMPOUND CLASS IS A LOCAL FACT, NEVER THE MONUMENTAL BUDGET — AND THE INERTIA
  // PIN CAUGHT THE DIFFERENCE THE MOMENT §15.3 LANDED.
  //
  // `monumental` is a RANK: `buildLandmarks` sorts every landmark by drawn weight and flags
  // the top `monumentalBudget`. Adding ONE institution can therefore change WHICH landmarks
  // are monumental — harmless while the flag only chose a drawn shape, and an inertia
  // violation the instant it chooses which ground is RESERVED, because the reservation
  // reaches the forbidden set and the forbidden set reaches every parcel in the settlement.
  // MEASURED: the §11.0 counterfactual ("add one chandler, every other organism byte-
  // identical") went red on `org.district.market_quarter`.
  //
  // ⭐ THE CURE IS TO ASK A LOCAL QUESTION. A cathedral reserves its close because it is
  // BIG, not because it happens to rank inside a tier's silhouette budget — so the class is
  // a threshold on the institution's OWN drawn size, a fact about that institution alone.
  // ⭐ THE CLASS: a RANK is a property of the SET; a THRESHOLD is a property of the MEMBER.
  // Any rule whose output reaches shared geometry must be the second kind.
  const compoundFloor = web.plotFrontage * COMPOUND_MIN;
  const monumental = landmarks.filter((l) => l.size >= compoundFloor);
  const ordinary = landmarks.filter((l) => l.size < compoundFloor);
  const compoundPass = seatInstitutions({
    landmarks: monumental, organisms, partition, umbrella, field, sub, water: waterRel, web,
    lawfulness, seeding, tierScale: scale, deferRepair: true,
  });
  // The compound each monumental claims: a disc at its own drawn footprint, plus its yard
  // or close. Reserved ground, not a drawn shape — the lens draws the archetype inside it.
  // ⭐⭐ MF-PERF1 · THE DISC TEST HAD FOUR LITERAL COPIES IN THIS FILE and now has one home
  // (compoundGround.js) — the same private-spelling class as `wallCircuit`'s old `n6`.
  const compounds = compoundDiscs(compoundPass.seated, COMPOUND_R);
  const cg = compoundGround(compounds);
  const forbiddenWithCompounds = cg.over(forbidden);
  // §11.2's last resort for §161e.1 — the ABSOLUTES alone, with the compounds still in.
  // Read by nothing but the dwelling guarantee; see the note at its use in parcels.js.
  const forbiddenPhysical = cg.over(forbiddenGround(web, umbrella, waterRel, commons, { streets: false }));
  // ⭐⭐⭐ THE TWO FACTORIES THAT CLOSE THE MODULE MISMATCH (MF-B4). The pack CALIBRATES the
  // plot module; before this lane the street ladder and the forbidden reservation were
  // evaluated ONCE, from the pre-calibration estimate, and MEASURED they disagreed with the
  // fabric by 2.2–2.8× at every tier above village. Handing the pack a way to re-derive both
  // at each pass's module is what makes "the channel width IS the reservation width" true of
  // the drawing rather than only of the two lines of code that read one variable.
  const widthsFor = (f) => ladderWidths(f, scale.extentTier);
  const forbiddenFor = (scaledWeb) => ({
    forbidden: cg.over(forbiddenGround(scaledWeb, umbrella, waterRel, commons)),
    forbiddenPhysical: cg.over(forbiddenGround(scaledWeb, umbrella, waterRel, commons, { streets: false })),
  });
  // ⭐⭐ §18.1 THE PRECINCT BOUNDS, before the packer — the gap decision reads them.
  const precincts = derivePrecincts({ organisms, lawfulness });

  const packed = packFabric({
    organisms, partition, umbrella, web, sub, water: waterRel, seeding,
    forbidden: forbiddenWithCompounds, forbiddenPhysical,
    widthsFor, forbiddenFor,
    prosperityRank, blockDepth: scale.blockDepth, morphology,
    tierScale: scale,
  });
  // ⭐ FROM HERE DOWN THE WEB IS THE CALIBRATED ONE. Nothing below may read the estimate.
  const fabricWeb = packed.web;

  // ── STAGE 3b · THE LEVEL-OF-DETAIL MERGE (§181.2a) ──────────────────────────
  // Distant ordinary matrix fuses into block masses at the top of the ladder, which is
  // both the reference's own overview convention and what pays for the build-out's ops.
  // ⚠ IT RUNS ON THE FABRIC, NOT IN THE LENS, because it moves a PRINTED PROMISE: the
  // cartouche's representativeness ratio is households ÷ DRAWN SHAPES, and only the
  // derivation can say what was actually drawn.
  const lod = mergeDistantMatrix({
    parcels: packed.parcels,
    centre: { x: nucleus.x, y: nucleus.y },
    tierScale: scale,
  });

  // ── STAGE 3b3 · ⭐⭐⭐ THE INVERSION (§181.2b, one level up) ─────────────────────
  // The umbrella above is the settlement's CLAIM — the union of the district organisms,
  // and the only outline that existed while the streets and the plots were being laid out.
  // From here down the leaf draws the BUILT umbrella, derived from the rank runs the packer
  // actually cut. See builtUmbrella.js for the whole derivation; the one sentence is:
  // A GAP A STREET WIDE IS INSIDE THE TOWN; A GAP WIDER THAN ANY STREET IS A GREEN.
  const growthUmbrella = umbrella;
  const growthPartition = partition;
  const inverted = deriveBuiltUmbrella({
    part: partition,
    orgs: organisms,
    blocks: packed.blocks,
    compounds,
    squares: fabricWeb.squares,
    landmarks: compoundPass.seated,
    frontage: packed.frontage,
    widths: packed.widths,
    key: fork('built-umb'),
  });
  const builtUmbrella = inverted.umbrella;
  const builtPartition = inverted.part;



  // ── STAGE 3b2 · §10.A3 THE SHANTY FRINGE ────────────────────────────────────
  // Where a POOR ward and a PRESSURE signal co-occur, the landless build outside the gates.
  // It reads the umbrella and the packed fabric, so it runs here; it emits no parcels, so
  // the §5 census claim is untouched (see the header note in parcels.js).
  // ⚠ IT READS THE BUILT UMBRELLA: "outside the gates" means outside the HOUSES, and a
  // shanty pitched in a lobe of the claim the town never reached would be a suburb of
  // nothing.
  const shanty = buildShantyFringe({
    organisms, umbrella: builtUmbrella, web: fabricWeb, sub, water: waterRel, tierScale: {
      ...scale, centreX: nucleus.x, centreY: nucleus.y,
    },
    prosperityRank, seeding, forbidden: forbiddenWithCompounds,
  });

  // ── STAGE 3c · THE STREET CHANNELS (§181.3a) ────────────────────────────────
  // ⭐⭐ THE WEB IS ASSEMBLED FROM THE FABRIC'S OWN BLOCKS, WHICH IS WHY IT RUNS HERE. The
  // settlement-scale ranks (high street, arteries, seams, quarter lanes) were all known
  // before a plot was cut; the BLOCK LANES are the streets the rank runs front onto, and a
  // rank run does not exist until the packer has cut it. Deriving them here is the
  // composition-order law obeyed, not bent: this stage reads what stage 3 produced.
  // ⭐ CONTAINMENT rides INSIDE this pass, before the stitch: no street where there is no
  // town. See containChannels for the stray pale strokes it removes, for why the high
  // street and the arteries are exempt (§2.3 continuity), and for why the order matters.
  const channels = buildStreetChannels({
    web: fabricWeb, blocks: packed.blocks, alleys: packed.alleys,
    // §17.6: the through-passages join the web as its informal LOWEST RANK. They are the
    // way from the street to the rear yards, so a web that does not carry them is a web
    // that says a terrace has no back door.
    passages: packed.passages,
    umbrella: builtUmbrella,
    tierScale: scale, accentBand: scale.accentBand,
  });
  // ⚠ STAGE 3c2 (THE CONNECTIVITY GRADE) NOW RUNS AFTER THE VOIDS ARE FACED — see its own
  //   header below (⟦SW-1c⟧). It was here, and it graded the wrong channel set.

  // ── STAGE 4 · SEATING — the ORDINARY institutions, into the cut fabric (§15.3) ──
  // ⚠ MOVED ABOVE THE GROUND LAW (MF-B5, chair directive §195.0). It reads only the built
  // partition, the built umbrella and the calibrated web, all of which exist here — and it
  // MUST run before the ground law, because from this lane on an institution has a drawn
  // BODY and that body is a footprint like any other.
  const seating = seatInstitutions({
    landmarks: ordinary, organisms, partition: builtPartition, umbrella: builtUmbrella,
    field, sub, water: waterRel, web: fabricWeb,
    lawfulness, seeding, tierScale: scale,
    preSeated: compoundPass.seated,
  });
  const seatedAll = seating.seated.concat(compoundPass.seated);

  // ── STAGE 4b · ⭐⭐⭐ §17.4 FRONTING, THEN THE DRAWN BODY (chair directives §193.3/§195.0) ──
  // The rotation was a free hash over the full turn — see institutionShapes.js for the
  // measured consequence (the b4 central cluster's "rotated blocks ignoring streets") and
  // for the pin-vacuity this closes: until now the institution's drawn shape was composed
  // inside the LENS, so neither ground-law census had ever seen it.
  const fronting = frontInstitutions({
    landmarks: seatedAll, channels: channels.channels, squares: fabricWeb.squares, seeding,
  });
  // ⭐⭐ AND THE PHYSICAL ABSOLUTE OUTRANKS THE FRONTING RULE (§161m, chair directive §195.1).
  // A quay answers to the water; the general "front your street" rule is a LOGISTICAL
  // preference and gives way. It runs AFTER the fronting pass on purpose — the absolute is
  // the last word, so it can never be overwritten by the preference.
  const moored = moorWaterBound({ landmarks: seatedAll, rel: waterRel });
  const bodies = attachSolids(seatedAll);

  // ── STAGE 5 · THE CIRCUIT — ⭐⭐⭐ MOVED AHEAD OF THE GROUND LAW (§200) ───────────
  // ⛔⛔ IT USED TO RUN AFTER, AND THAT ORDER WAS THE OWNER'S BUG. The wall was traced at
  // stage 5 and the ground laws enforced at stage 3d, so the circuit was drawn over a fabric
  // that had never been told it was coming: MEASURED, 408 drawn bodies standing inside a
  // wall band across the corpus. The trace depends on the umbrella, the inverted circuit
  // ring and the road web — never on the packed parcels — so it was always free to run
  // first, and running first is what makes the wall a CLAIM instead of an overlay.
  // ⭐ THE CLASS (§195.0's family, one surface out): AN OVERLAY DRAWN AFTER THE LAW RAN IS
  // A SURFACE NO LAW GOVERNS.
  // ⭐⭐ §11.8 / §161d.4 THE VINTAGE GATE (MF-B6). `hasWalls` comes from the landed MODEL,
  // which is NOT year-indexed, so a snapshot's truncated event list cannot reach it — the
  // gate has to be applied where the model is read. A leaf dated before the circuit's own
  // vintage carries NO CIRCUIT, and with it no gates, no ditch, no water gates, no faubourg
  // and no lean-tos. It is the single most legible drift the record can source, and the
  // whole of §11's geometry at this base (see snapshot.js's header for why: `fabricScars`
  // and `eventLog` are both absent, so the §15.7 fire-grain dating has no live source).
  // ⛔⛔ THE VINTAGE MUST COME FROM THE PRESENT-DAY RECORD, AND FINDING OUT WHY IS THE MOST
  // USEFUL THING THE SNAPSHOT MEMBER DID. `compile.deriveWallVintage` computes
  // `ageAtBuild = age × (TOWN_FLOOR / peak)` — A FRACTION OF *NOW*. Under a year projection
  // `age` becomes the snapshot's year, so the build age slides down with it and the circuit
  // is ALWAYS ALREADY BUILT: MEASURED, the year-18 leaf of a town whose wall was raised in
  // year 49 came back with its wall standing, on every leaf, silently.
  // ⭐ THE CLASS: **A FACT DERIVED AS A FRACTION OF "NOW" IS NOT A DATE, AND A SNAPSHOT
  // EXPOSES IT INSTANTLY.** The caller therefore stamps the PRESENT-DAY vintage
  // (`options.wallBuiltAtAge`) and it is held fixed across every snapshot of that settlement;
  // absent it, the present-day reading applies and nothing is gated.
  const wallStanding = wallStandingFor({ options, record, model });
  const hasWalls = wallStanding.hasWalls;
  // ⭐⭐⭐ §230 / §232 / §234 / §240 · THERE IS NO CYCLE HERE ANY MORE, AND THAT IS THE WAVE'S
  // HEADLINE. `wallCycle.js` isolated a wall↔fabric cycle into a bounded two-pass solver;
  // MF-ARCH proved the cycle was TWO VERSIONS OF ONE ARTIFACT SHARING ONE BINDING NAME, and the
  // owner's §240 epoch law supplies the missing axis. Each circuit is traced from ITS OWN
  // EPOCH'S fabric, complete before it; district space is then partitioned at the working ring
  // and published under its own name. Both steps are FORWARD edges — the solver had nothing
  // left to solve and was deleted. The lens, the ground law and every census still reach the
  // wall ONLY through `wallCircuit.js`'s accessors, so what is DRAWN and what is RESERVED
  // cannot be two things.
  // §161m.1 CIRCUIT ECONOMY — "the wall hugs the fabric tight": the body is the fabric CLOSED
  // at the wall's own economics (builtUmbrella's circuit note), never the drawn outline.
  const wallHandles = {
    hasWalls, circuitBody: inverted.circuitRing, umbrella: builtUmbrella, web: fabricWeb,
    tierScale: scale, sub, water: waterRel, frontage: packed.frontage, vintage: wallStanding.vintage,
    seeding, record, settlement: s, part: inverted.part, orgs: organisms, key: fork('built|wall'),
    bodyMask: inverted.bodyMask, wallCloseR: inverted.wallCloseR,
    glacisClear: faubourgSeriousness(lawfulness, prosperityRank) >= GLACIS_THRESHOLD,
    // ⭐⭐ §5 W2 · THE RUN CHAIN'S CAUSES. `seated` is compiled to a DECLARED input
    // (`institutionSeatsOf`) rather than read as a handle, so a seat that moved without
    // changing the count moves the circuit's hash — B8b §11.3's named seam, closed.
    seated: seatedAll,
  };
  const wallCircuit = deriveWallCircuit(circuitInputsFrom(wallHandles), wallHandles);
  const walls = wallCircuit.rings;
  // ── ⭐⭐⭐ STAGE 5a · §5 W2 · **CIRCUIT DEMOTION — THE FOSSIL LADDER** (S14, ODQ §250.5).
  //    It runs HERE, between the circuit and the ground law, for the reason the circuit itself
  //    moved above the ground law: **the old wall stops being a wall and becomes an INPUT to
  //    the street, plot and land-use stages.** A demotion that ran after §17/§200 would be an
  //    overlay drawn after the law ran — the §195.0 class this fabric has already paid for
  //    twice — and its ring street would govern ground no footprint had been told about.
  const demotion = demoteCircuits({
    node: wallCircuit, frontage: packed.frontage, seeding,
    prosperityRank, demoted: !!(scale.highWater && scale.highWater.demoted),
  });
  // ⭐⭐ THE STREET VERSION THE WALL MADE. §239.2's wall-side lanes and §250.5's demoted ring
  // streets are STREETS, not wall furniture, so they join the web every later stage reads —
  // which is what makes "the wall is always reachable" and "every gate meets the street web"
  // consequences of geometry rather than policed rules. Named as its own version because
  // `channels.channels` is the set that existed BEFORE there was a circuit.
  const streetsWalled = channels.channels
    .concat(circuitWallLanes(wallCircuit))
    .concat(demotion.ringStreets);
  // ── ⭐⭐⭐ STAGE 5a2 · ⟦§274.5a⟧ **THE FOSSILS RESERVE THEIR GROUND BEFORE THE ORDINARY FABRIC
  //    HOLDS IT.** W2 graded exit 7 — *can a reader see this town had an older wall?* — a NO on
  //    the city, and measured the cause: **the demotion ran after the packer**, so 90% of tower
  //    rounds and 90% of ditch gardens were refused by a cottage that had simply arrived first.
  //    This is the composition-order move §274.5(a) ordered, and it is the same move §200 made
  //    at MF-B8 when the wall band went above the ground law: the fossil stops being a LATE
  //    ARRIVAL contesting held ground and becomes RESERVED GROUND the ground law clips around.
  // ⚠ THE CLAIM SET IS BUILT HERE, ONCE, AND THE LATE PASSES READ THIS BINDING. It used to be
  //   composed a second time at stage 6f from the identical three parts; two constructions of
  //   one set WILL disagree eventually (`groundLaw.standingBodies`'s own banked class), so there
  //   is one binding and the value is unchanged.
  const lawClaims = streetsWalled.concat(waterClaims(waterRel)).concat(circuitClaims(wallCircuit));
  const reservation = reserveFossils({
    demotion, claims: lawClaims, institutions: seatedAll, touchEps: TOUCH_EPS,
    // ⭐ THE ONE RIGHT-OF-WAY CLIP, BUILT HERE AND HANDED OVER. See `claimClipper`'s header for
    // why the composition root owns this wiring rather than `circuitDemotion` importing it.
    clip: claimClipper(lawClaims),
    // ⭐ AND THE ONE OVERLAP PREDICATE THAT KNOWS A PARTY WALL FROM AN OVERPRINT, for the same
    // reason and by the same route. See `siteFossils`'s header for the 5-reserved-0-sited
    // measurement that made the distinction load-bearing.
    overlaps: (A, B) => overlapping(A, B, TOUCH_EPS),
  });
  // The RESERVED version of the demotion — a new artifact, never a mutation of the emitted one
  // (MF-ARCH-2's version axis; the SCC walker convicted exactly this shape once already).
  const demotionReserved = {
    ...demotion,
    dwellings: reservation.dwellings,
    gardens: reservation.gardens,
    reservationReason: reservation.reason,
    reservedRefusedDwellings: reservation.refusedDwellings,
    reservedRefusedGardens: reservation.refusedGardens,
    reservedRefusedByClaim: reservation.refusedByClaim,
    reservedRefusedByInstitution: reservation.refusedByInstitution,
    reservedRefusedBy: reservation.refusedBy,
  };
  const wallPartition = partitionAtTheWall({
    part: inverted.part, orgs: organisms, node: wallCircuit, key: fork('built|wall'),
    base: builtUmbrella,
  });
  // ⭐⭐⭐ MF-ARCH-2 · THE VERSION AXIS (ODQ §240/§241.2). `partition(E1)` — district space AS THE
  // WALL DIVIDES IT — is a NEW ARTIFACT derived from the circuit, not a mutation of the
  // partition that preceded it. Writing it back into `builtUmbrella` made two versions of one
  // fact share one binding name, which is the whole of the wall↔fabric "cycle": every consumer
  // below now NAMES the version it reads.
  const umbrellaWalled = { ...builtUmbrella, partition: wallPartition.partition };

  // ── STAGE 3d · ⭐⭐⭐ §17 + §17.4 THE GROUND LAWS (chair directives ODQ §190/§190a) ──────
  // Footprints are mutually exclusive solids and the street web is forbidden ground for
  // them. It runs HERE because it needs the FINAL, contained channel set — and it is a
  // §15.6 bounded repair with a diagnostic, never a nudge. See groundLaw.js for the
  // one-primitive design (clip to the kerb line and to the party line) and for the measured
  // root cause: the reservation was a test on the plot's CENTRE and the law is about the
  // building's BODY.
  // ⭐⭐⭐ THE WATER IS A CLAIM, NOT A MARK (chair directive §195.1). Until MF-B5 the channel
  // was drawn over a fabric that had never been told it was there, so houses stood in the
  // river. It joins the claim set as a channel of its own width, and the same clip that puts
  // a facade on the kerb puts a waterfront wall on the bank.
  // ⭐⭐⭐ §200 THE WALL BAND JOINS THE CLAIM SET (owner catch, chair directive ODQ §200).
  // A street, a watercourse and a circuit are all the same thing to a footprint: ground it
  // may not stand on. The band opens at every unbricked gate, so the road the gate exists to
  // carry is never refused. See walls.wallClaims.
  const ground = enforceGround({
    parcels: packed.parcels, masses: lod.masses, huts: shanty.huts,
    institutions: seatedAll,
    // ⚠ ⟦SW-1b⟧ THE BINDING, NOT A SECOND CONSTRUCTION. This site composed the identical
    //   three-part expression a second time; `lawClaims` is bound at stage 5a2 and the value is
    //   unchanged. Two constructions of one set WILL disagree eventually — `standingBodies`
    //   banks the class in its own header, and it had already happened here in miniature.
    channels: lawClaims,
    merged: lod.mergedKeys, frontage: packed.frontage,
    // ⭐⭐⭐ ⟦§274.5a⟧ THE RESERVED FOSSIL GROUND ENTERS AS A PRE-ACCEPTED CLAIM — already legal,
    // never clipped, and the ordinary fabric is clipped against it. That single argument IS the
    // composition-order move: the round and the garden now hold their ground at the pass that
    // decides who holds what, instead of asking for what is left four stages later.
    preAccepted: reservation.ground,
    // §5 W1 exit 2: the ground is a claim like any other, and it is asked of the BODY.
    sub,
  });
  // ⭐⭐⭐ THE VERSION AXIS AGAIN, AND HERE IT IS THE §230 DIVERGENCE MADE VISIBLE. "The parcels
  // as CUT" and "the parcels as CLIPPED BY THE LAW" are two artifacts; while they shared the
  // name `packed.parcels`, seven consumers read the second and one read the first and nothing
  // said so (MF-ARCH's divergence scan, §1.4). Each version is named; each consumer below picks.
  const parcelsLawful = ground.parcels;
  const massesLawful = ground.masses;
  const hutsLawful = ground.huts;

  // ⭐ AND THE VOIDS ARE EDGED BY THE FACADES THAT FRONT THEM (see faceTheVoids). The
  // squares and the interior greens are ROOMS the buildings make, not pale shapes lying on
  // the town. It grows into ground the packer already refused, so no plot moves — and it
  // runs AFTER the ground laws so the facades it marches to are the ones the leaf draws.
  const facedSquares = faceTheVoids({
    voids: fabricWeb.squares, parcels: parcelsLawful, landmarks: compoundPass.seated,
    frontage: packed.frontage,
  });
  const facedGreens = faceTheVoids({
    voids: umbrellaWalled.greens.map((g) => ({ polygon: g })),
    parcels: parcelsLawful, landmarks: compoundPass.seated, frontage: packed.frontage,
    capFrontages: 1.1,
  });
  // The void versions: the web and the umbrella AFTER their open ground is edged by facades.
  const facedWeb = { ...fabricWeb, squares: facedSquares.voids };
  const umbrellaFaced = { ...umbrellaWalled, greens: facedGreens.voids.map((g) => g.polygon) };

  // ── ⭐⭐⭐ STAGE 3c2 · ⟦SW-1c⟧ **THE CONNECTIVITY GRADE, TAKEN OVER THE VERSION THE LEAF
  //    PUBLISHES.** SW-1 (laneMFD1-receipt §8.4): *"any fact published as a GRADE must derive
  //    from the FINAL version."*
  // ⛔⛔ IT DID NOT. The grade was computed at stage 3c over `channels.channels` — the set that
  //    existed BEFORE there was a circuit — while the leaf publishes `streetsWalled`, which adds
  //    the circuit's wall lanes and the demotion's ring streets; and over `fabricWeb.squares`,
  //    while the leaf publishes the FACED squares. MEASURED at MF-D1 on **10 of 17 leaves**
  //    (town 19→18, city 18→17, metropolis 15→12, polycentric 26→24, year-100 19→25): a
  //    published component count, dead-end count and connected share that were true of a set the
  //    reader never sees. ⭐ THE CLASS: **a grade names its own denominator, and a grade computed
  //    before the last stage that changes that denominator is a grade about something else.**
  // ⚠ THE MOVE IS PURE. `webConnectivity` reads no stream and mints no key — it is union-find
  //   over carriageway overlap — so re-siting it changes no draw order anywhere.
  const streetWeb = webConnectivity({
    channels: streetsWalled, squares: facedWeb.squares, umbrella: umbrellaFaced,
  });

  // ⚠ STAGE 5 (THE CIRCUIT) NOW RUNS EARLIER — see its own header. It was here.

  // ── STAGE 6 · THE RELIEF PASS (§9.5b) ───────────────────────────────────────
  // The land is a character and must be DRAWN. Everything below reads the substrate that
  // every placement decision above already obeyed — so the marks and the geometry cannot
  // disagree: the hachures run down the same slope the accretion refused.
  const inTownFn = (x, y) => {
    const i = Math.floor(x / builtPartition.cell), j = Math.floor(y / builtPartition.cell);
    if (i < 0 || j < 0 || i >= builtPartition.n || j >= builtPartition.n) return false;
    return builtPartition.inside[j * builtPartition.n + i] === 1;
  };
  const relief = buildRelief({
    sub,
    inTown: inTownFn,
    inWater: (x, y) => isInWaterRel(waterRel, x, y),
    accentBand: scale.accentBand,
    seeding,
  });

  // ── STAGE 6a · §161b THE VISIBLE WORK ───────────────────────────────────────
  // The strain the §5.-1c solver recorded is finally DRAWN — sited on the ground that
  // demanded it, or NOT DRAWN and recorded. See terraform.js.
  const terraform = buildWorks({
    sub,
    works: sub.works,
    water: waterRel,
    inTown: inTownFn,
    centre: { x: nucleus.x, y: nucleus.y },
    extent: scale.builtRadius,
    accentBand: scale.accentBand,
    seeding,
  });

  // ── STAGE 6b · THE FIELD PATCHWORK (§161a, §2.2) ────────────────────────────
  // ⭐⭐ A SETTLEMENT EATS, AND WHERE IT EATS FROM IS A FACT ABOUT IT — not lens dressing.
  // See fields.js's header for the chair's fjord finding and why a hard tillage threshold
  // had to become a ranking against a demand.
  // ⚠ THE `inTown` PREDICATE IS THE UMBRELLA'S OWN RING, NOT THE PARTITION MASK. The
  // partition is a 128² grid whose cells are ~7.8 units, so a furlong centre a few units
  // outside the built edge still reads as inside and the fields retreat a whole cell from
  // the town — a visible pale collar all round the fabric. The ring is exact.
  // ⭐⭐⭐ §11.12a THE TRUE MEASURE, MINTED AND THREADED (see measure.js's header for the two
  // findings: a metric already existed inside fields.js with no home of its own, and the
  // frontage-as-rod reading it used is only a distance where the fabric is 1:1). It is
  // derived HERE — after the packer, because it needs the CALIBRATED frontage, and before
  // the fields, because the day's-work cull is its first consumer.
  const measure = deriveMeasure({
    population: Number.isFinite(s.population) ? s.population : 0,
    extentPopulation: scale.highWater ? scale.highWater.population : null,
    tier: scale.tier,
    extentTier: scale.extentTier,
    builtRadius: scale.builtRadius,
    plotFrontage: packed.frontage,
    // ⚠ THE VERSION IS NAMED, AND IT IS NOT THE ONE THE META PRINTS. `measure` runs before
    // the late passes, so it prices the ground-law pass-1 huts; the cartouche's ratio below
    // prices the FINAL, accessible set. Two consumers, two versions, both now stated.
    representationRatio: (lod.drawnShapes + hutsLawful.length) > 0
      ? scale.households / (lod.drawnShapes + hutsLawful.length)
      : scale.representationRatio,
  });

  const fields = buildFields({
    sub,
    inTown: (x, y) => {
      for (const comp of umbrellaFaced.components) if (pointInRing(comp, x, y)) return true;
      return false;
    },
    inWater: (x, y) => isInWaterRel(waterRel, x, y),
    centre: { x: nucleus.x, y: nucleus.y },
    extent: scale.builtRadius,
    population: Number.isFinite(s.population) ? s.population : 0,
    frontage: packed.frontage,
    // ⛔ THE FIELDS NO LONGER MINT THEIR OWN SCALE. `metresPerUnit` used to be
    // `5 / frontage` computed inside buildFields — the frontage-as-rod reading, wrong above
    // village by construction. It reads the ONE home now, and the day's-work reach it feeds
    // is a real distance at last. This is a DECLARED same-seed shift on every leaf.
    measure,
    accentBand: scale.accentBand,
    tier: scale.extentTier,
    // §16.2 the strips kink along the roads, and §16.3 the field lanes root where a road
    // stops being a street — so the countryside reads the SAME web the town does.
    roads: facedWeb.roads.concat(facedWeb.highStreet ? [{ line: facedWeb.highStreet }] : []),
    // §16.1 the food economy sets how much land works — compiled once at §15.1.
    foodEconomy: record.get('food-economy', 'tillage'),
    seeding,
  });
  // ⭐⭐ §195.1 THE FIELD EDGE IS THE BANK. A furlong whose seams run under the river tells
  // the reader the ploughman worked the channel; every land is clipped to the dry side.
  const fieldWater = clipFieldsToWater({ fields, rel: waterRel });

  // THE SEA'S OWN CONVENTION: lines parallel to the shore, tight at the edge and opening
  // seaward. §9.5b names the water BODY at its §5.0b mode as the thing that must read at a
  // glance, and this is the period's own way of saying "open water" in ink.
  const reliefDrawn = { ...relief, waterStrokes: waterRel.kind === 'coast' && waterRel.line
    ? waterStrokes(
      waterRel.line, 9, Math.max(6, scale.builtRadius * 0.045), -waterRel.bankSide,
      (x, y) => isInWaterRel(waterRel, x, y),
    )
    : [] };

  // ── STAGE 6c · §161c THE OUTLYING LANES ─────────────────────────────────────
  // Every institution the siting rings put OUTSIDE the fabric is joined to the road web, or
  // its refusal is named. It runs last because it needs the seated institutions, the drawn
  // outline AND the field lanes to join to. See deriveOutlyingLanes.
  const outlying = deriveOutlyingLanes({
    landmarks: seatedAll,
    umbrella: umbrellaFaced, web: facedWeb, sub, water: waterRel, seeding,
    frontage: packed.frontage, fieldLanes: fields.lanes,
  });

  // ── STAGE 6d · ⭐⭐⭐ §16.5 THE WORKSITE HABITATION LAW (chair directive ODQ §190c) ────
  // WHO lives on the land derives from the settlement's TENURE PATTERN — see habitation.js
  // for the two countrysides, and for the ODQ §194 / MF-R3 C1 cure that keeps TRUE field
  // barns on the dispersed side where history actually put them.
  // ⚠ ONE READER: `stressorKeysOf` is stateMarks' exported answer to "what state is this
  // settlement in", and the assembly asks IT rather than re-spelling `Array.isArray`. The
  // second spelling here was the same dead arm as the first (MF-INT1 §3.2.1) and the two
  // could have been cured apart, which is precisely the divergence G-34 was ruled against.
  const stressorKeys = stressorKeysOf(s);
  const danger = stressorKeys.some((k) => DANGER_STRESSORS[k] != null);
  const tenure = tenurePattern({
    relief: measuredRelief(sub),
    // ⛔⛔ ⟦§303.6 / MF-D1 RAISED-8⟧ **THIS READ `sub.workableShare`, WHICH THE SUBSTRATE HAS
    //    NEVER PUBLISHED — SO THE FALLBACK `0.6` FIRED ON 17 OF 17 LEAVES.** The consequence is
    //    not cosmetic: `tenurePattern`'s `(1 − workableShare) × 0.30` term was a CONSTANT 0.12 on
    //    every leaf in the corpus, so the workable-ground input to the nucleated/dispersed
    //    decision had never varied, and the `why` string printed "workable 0.60" everywhere. The
    //    real value exists, is computed, and ranges **0.292 … 0.769** across the corpus.
    // ⭐ THE CLASS: **A DEFAULT ON A FIELD NOBODY PUBLISHES IS NOT A FALLBACK, IT IS THE VALUE**,
    //    and a `== null` guard makes it read like a safety net. The substrate now publishes the
    //    field (`substrate.js`), so the guard is a real guard again and is kept for the one
    //    caller that could hand over a legacy substrate.
    workableShare: sub.workableShare == null ? 0.6 : sub.workableShare,
    danger,
    lawfulness,
    tier: scale.extentTier,
    seeding,
  });
  const habitation = seatWorksiteHabitation({
    fields, centre: { x: nucleus.x, y: nucleus.y }, extent: scale.builtRadius, tier: scale.extentTier,
    pattern: tenure.pattern, frontage: packed.frontage, sub, water: waterRel,
    inTown: (x, y) => {
      for (const comp of umbrellaFaced.components) if (pointInRing(comp, x, y)) return true;
      return false;
    },
    seeding,
  });
  const keepers = seatKeepers({
    landmarks: seatedAll, frontage: packed.frontage, water: waterRel,
    inTown: (x, y) => {
      for (const comp of umbrellaFaced.components) if (pointInRing(comp, x, y)) return true;
      return false;
    },
    seeding,
  });

  // ── STAGE 6e · ⭐⭐⭐ §5.0e THE FAUBOURG LAW (chair directive ODQ §190d) ──────────────
  // Extramural growth is the DEFAULT for a walled town, and it CROWDS THE GATES — never a
  // halo. The wall-foot tell rides here too: it is the cheapest one-glance order read there
  // is. It runs after the circuit because a faubourg is a fact about a GATE.
  // ⛔ THE REFUSAL PREDICATE HERE IS NOT `forbiddenWithCompounds`, AND THE FIRST SPELLING'S
  // WAS. `forbiddenGround` refuses everything OUTSIDE the umbrella — that is its job for the
  // packer — so handing it to a law whose entire subject is the ground outside the wall
  // refused every faubourg building on every leaf. ⭐ THE CLASS: A PREDICATE NAMED
  // "FORBIDDEN" ENCODES ONE STAGE'S QUESTION, and a later stage asking a DIFFERENT question
  // must not borrow it. The faubourg's own refusals are the carriageway, the common and the
  // compound — never the town's outline, which is the thing it is defined as being beyond.
  const faubourgs = buildFaubourgs({
    walls, channels: streetsWalled, umbrella: umbrellaFaced,
    frontage: packed.frontage, lawfulness, prosperityRank, sub, water: waterRel,
    accentBand: scale.accentBand, commons, compounds, seeding,
  });

  // ── STAGE 6f · ⭐⭐ THE GROUND LAW, A SECOND BOUNDED PASS OVER THE LATE BODIES ─────────
  // The faubourg, the lean-tos and the countryside steadings are FILLED BODIES, so §17 and
  // §17.4 bind them exactly as they bind a burgage plot — and the §195.0 standing rule this
  // lane wrote says so in as many words: any new filled body joins the census in the same
  // commit that draws it. They cannot ride the first pass, because a faubourg is a fact
  // about a GATE (stage 5) and a steading a fact about the FIELDS (stage 6b), both of which
  // come after it. ⭐ THE SECOND PASS IS PROVABLY IDEMPOTENT ON THE BODIES THAT ALREADY
  // PASSED: a street clip fires only on penetration and a party clip only on overlap, and
  // the first pass left neither. It is not a second chance; it is the same law reaching the
  // members that did not exist when it first ran.
  // ⚠ `lawClaims` IS BOUND AT STAGE 5a2, where the fossil reservation first needs it. Composing
  //   it a second time here is the two-constructions class; the binding is read, not rebuilt.
  const swept = sweepLateBodies({
    sub,
    huts: hutsLawful, faubourgBuildings: faubourgs.buildings, faubourgLeanTos: faubourgs.leanTos,
    dwellings: habitation.dwellings.concat(keepers.dwellings),
    parcels: parcelsLawful, masses: massesLawful, mergedKeys: lod.mergedKeys,
    institutions: seatedAll, claims: lawClaims, frontage: packed.frontage,
    // ⟦§274.5a⟧ THE RESERVATION IS SENIOR TO THE LATE BODIES TOO. A reservation the first pass
    // honours and the second overwrites is not a reservation — it is a delay, and the faubourg
    // and the steadings would take exactly the ground the round and the garden just kept.
    fossils: reservation.ground,
  });

  // ── STAGE 5b · §195.1 THE WORKS THE CROSSING IMPLIES ────────────────────────
  // A street that crosses water carries a BRIDGE; a circuit that meets water closes with a
  // WATER GATE. Both run last because both are facts about the FINAL channel set and the
  // FINAL circuit — see waterWorks.js for why the water had to become a claim first.
  const bridges2 = deriveBridges({
    rel: waterRel, channels: streetsWalled, frontage: packed.frontage,
  });
  const waterGates = deriveWaterGates({ walls, rel: waterRel, seeding, extent: scale.builtRadius });

  const centre = organismCentroid(organisms);
  const outline = umbrellaFaced.components[0] || [];

  // ── STAGE 7 · ⭐⭐ §12 THE IMMERSION SUITE and §10 THE STATE EXPRESSIONS ───────────────
  // Both DERIVE HERE and DRAW IN THE LENS — the §195.0 law, applied before it could be
  // broken again: a mark composed at render time is a mark no census can see. They run last
  // because every one of them is a fact about the FINISHED leaf (the umbrella it annotates,
  // the roads its event marks stand on, the gates its camps invest).
  const metaSoFar = {
    tier: scale.tier, extentTier: scale.extentTier, builtRadius: scale.builtRadius,
    plotFrontage: packed.frontage, centre, relief: measuredRelief(sub), hasWalls,
    waterMode: waterRel.mode, populationPeaks: record.get('population-peaks', 0),
  };
  const immersion = buildImmersion({
    fabric: {
      meta: metaSoFar, measure, umbrella: umbrellaFaced, water: waterRel,
      web: facedWeb, parcels: parcelsLawful,
    },
    settlement: s, seeding, year: options.year,
  });
  // ── STAGE 7b · ⭐⭐ §18.4 MARKET COLONIZATION — the middle rows, as a §11 DRIFT FORM. The
  // rows are FILLED BODIES and they join the §195.0 census in the same commit that draws
  // them: they ride the third ground-law pass below with the §10 state bodies.
  const colonize = marketColonization({
    squares: facedWeb.squares,
    channels: streetsWalled,
    // ⛔ THE SAME CLASS AS THE WALL VINTAGE, ONE STAGE LATER: a threshold expressed as a
    // SHARE OF THE SETTLEMENT'S LIFE is a fraction of *now*, so under a snapshot it slides
    // with the year and the market is colonised at every age including its first. The
    // caller stamps the PRESENT-DAY age and the threshold becomes a fixed year.
    year: options.year,
    age: Number.isFinite(options.presentAge) ? options.presentAge : presentYear(s),
    lawfulness,
    frontage: packed.frontage, tier: scale.tier,
    seedKey: fork('colonize'), hashUnit,
  });

  // §10 THE STATE EXPRESSIONS — the calm-ink markers, and the FILLED bodies among them go
  // through the ground law like every other body (see the third pass below).
  const stateMarks = deriveStateMarks({
    settlement: s, meta: metaSoFar, walls, umbrella: umbrellaFaced,
    web: { ...facedWeb, channels: streetsWalled },
    parcels: parcelsLawful, landmarks: seatedAll, seeding, prosperityRank, lawfulness,
  });
  // ⚠⚠ THE THIRD GROUND-LAW PASS, and it exists for exactly the reason the second one does:
  // a siege camp and an inn belt are FILLED BODIES, and §195.0's standing rule says any new
  // filled body is swept in the same commit that draws it. The standing town enters
  // PRE-ACCEPTED, so this pass only ever clips the newcomers.
  // ⭐ THE MIDDLE ROWS JOIN THE STATE BODIES IN ONE SWEEP. They are the same KIND of thing —
  // a late filled body that did not exist when the first two passes ran — so they take the
  // same law in the same pass rather than growing a fourth.
  // The §10 marks AS THE LAW LEFT THEM — a new artifact, never a rebinding of `stateMarks`.
  const stateSweep = sweepStateBodies({
    sub,
    bodies: stateMarks.bodies, rows: colonize.rows,
    parcels: parcelsLawful, masses: massesLawful, mergedKeys: lod.mergedKeys,
    institutions: seatedAll, huts: swept.huts,
    faubourgBuildings: swept.buildings, faubourgLeanTos: swept.leanTos,
    dwellings: habitation.dwellings.concat(keepers.dwellings),
    claims: lawClaims, frontage: packed.frontage,
    // ⟦§274.5a⟧ and senior to the §10 state bodies and the §18.4 middle rows, for the same reason.
    fossils: reservation.ground,
  });
  const stateMarksSwept = { ...stateMarks, ...stateSweep };

  // ── STAGE 3e · ⭐⭐⭐ §202 THE UNIVERSAL ACCESS LAW (owner order, chair directive ODQ §202)
  // "Every building has to have at least some space to get through to our streets, whether
  // that's directly or through an alley that's connected to the street."
  //
  // ⭐ IT RUNS LAST BECAUSE ACCESS IS A PROPERTY OF THE FINISHED LEAF. A body that had a way
  // out when it was placed can be sealed by the faubourg, a §10 camp or a colonized market
  // row arriving after it, so the question can only be asked once every drawn body exists.
  // MEASURED before the repass: 187 landlocked bodies across the corpus, and 38 after the
  // §200 wall cure had already freed the rest (the wall claim moved the fabric off the
  // circuit and opened the intervallum lane behind it).
  // ⭐⭐ AND WITH IT THE WAVE-EIGHT CENSUSES (§205 A the water right-of-way, §203 the zones,
  // GAP-B the density gradient, GAP-C the street classes) — all of them questions about a
  // FINISHED leaf, all of them asked in one seam. See leafCensus.censusLeaf for why the
  // decomposition is here rather than in this file (MF-B7's 797/800 hazard, planned).
  const closing = censusLeaf({
    parcels: parcelsLawful, masses: massesLawful, huts: swept.huts,
    faubourgBuildings: swept.buildings, faubourgLeanTos: swept.leanTos,
    frontage: packed.frontage, mergedKeys: lod.mergedKeys,
    seatedAll, channels: streetsWalled, walls, web: facedWeb, wallCircuit,
    waterRel, scale, organisms, builtUmbrella: umbrellaFaced, grid: growthPartition, nucleus, morphology,
    bridges: bridges2.bridges, meetings: bridges2.meetings, waterGates: walls.reduce((a, w) => a.concat(w.waterGates || []), []),
  });
  const { access, accessAudit, permeability } = closing;
  // ⭐ THE LAST VERSION OF EVERY BODY FAMILY — what the leaf DRAWS, named once and published.
  const drawn = closing.accessible;
  // ── ⭐⭐⭐ STAGE 5b · §250.5 · **THE FOSSILS ARE SITED AGAINST THE FABRIC THAT SURVIVED.** A
  //    demoted tower's round and a filled-ditch garden strip are the LAST things to arrive, so
  //    they take the ground that is left — and where there is none, that is the fate ladder's
  //    quarried rung arriving as geometry. The subject is the DRAWN set, so this pass's output
  //    can join the drawn censuses in the same commit that draws it (§195.0).
  const demotionSited = sitedDemotion({
    // ⟦§274.5a⟧ THE SUBJECT IS THE **RESERVED** SET, NOT THE EMITTED ONE. A fossil the senior
    // claims already refused is not offered ground twice, and a fossil that holds a reservation
    // should now clear this pass — which is what makes the residual number a FINDING.
    demotion: demotionReserved, claims: lawClaims, touchEps: TOUCH_EPS,
    overlaps: (A, B) => overlapping(A, B, TOUCH_EPS),
    drawn, lod, habitation, keepers, seatedAll, stateMarks,
  });
  const shantyDrawn = { ...shanty, huts: drawn.huts };
  const lodDrawn = { ...lod, masses: drawn.masses };
  const faubourgsDrawn = {
    ...faubourgs, buildings: drawn.faubourgBuildings, leanTos: drawn.faubourgLeanTos,
  };

  // ⭐⭐⭐ MF-ARCH · THE FABRIC IS PUBLISHED THROUGH ITS GOVERNED ACCESSORS. `walls` is no
  // longer a plain array on this literal: it is a VERIFYING GETTER onto the circuit node's
  // rings (see wallCircuit.publishCircuitRings for why the guard belongs at the ONE
  // publication point rather than at the unboundedly many read sites).
  // ⭐⭐ §297.4b · THE RAW-HANDLE GUARD, EXTENDED PAST THE WALL. `water` and `parcels` are
  //   published through verifying accessors, exactly as `walls` already is. The GETTERS below
  //   sit in this literal at the keys' own positions, so the published key ORDER is unmoved and
  //   the §234 publication arm still reads `publishCircuitRings({…}, wallCircuit)` literally.
  //   ⚠ `channels` is DECLINED and the reason is a number: two of its three true reads are off
  //   `leafCensus.js`'s synthetic `accessFabric`, which no publication guard can reach.
  const governed = governFabricSurfaces({ water: waterRel, parcels: drawn.parcels });
  return publishCircuitRings({
    meta: {
      seed: String(seed),
      variant,
      name: s.name || '',
      tier: scale.tier,
      extentTier: scale.extentTier,
      population: Number.isFinite(s.population) ? s.population : 0,
      prosperity,
      prosperityRank,
      terrain,
      landform: sub.family,
      declaredTerrain: sub.declaredTerrain,
      forcedReconciliation: sub.forced,
      strain: sub.strain,
      strainedFacts: sub.strained,
      visibleWorks: sub.works,
      // §15.7 SUBSTRATE IMPERFECTION: the resource sites, and HOW FAR each sits from the
      // handiest ground that could have carried it. The land supports the settlement; it
      // does not look laid out for it.
      resourceSites: (sub.resourceSites || []).map((r) => ({
        key: r.key, needs: r.needs, rank: r.rank,
        displacement: Math.round(r.displacement),
        fitLoss: Math.round(r.fitLoss * 1000) / 1000,
      })),
      substrateImperfection: (sub.resourceSites || []).length
        ? Math.round(((sub.resourceSites || []).reduce((a, r) => a + r.rank, 0)
          / (sub.resourceSites || []).length) * 100) / 100
        : 0,
      reconciliation: sub.reconciliation,
      relief: measuredRelief(sub),
      // ⭐⭐ §5 W1 EXIT 1: EVERY LEAF PUBLISHES A RELIEF FIELD, NOT A SCALAR. `relief` above
      // is kept because the cartouche prints it and every earlier figure is quoted against
      // it; `reliefField` is the shape of the ground the scalar was standing in for. Derived
      // on every read, never stored (§161 LAYER ZERO) — see substrate.reliefField.
      reliefField: reliefFieldOf(sub),
      // ⭐⭐⭐ §5 W1 EXIT 1 · THE §161a CONSISTENCY READING, OVER EVERY RESOURCE INPUT — not
      // over `terrainType` alone. Derived, never stored. See substrate.resourceCoherence for
      // why it must not re-use `siteResources`' own fit expression.
      resourceCoherence: (() => {
        const c = resourceCoherence(sub);
        return { coherent: c.coherent, checked: c.checked, status: c.status, reason: c.reason,
          incoherent: c.rows.filter((r) => !r.ok).map((r) => ({ key: r.key, needs: r.needs, why: r.why })) };
      })(),
      // ⭐⭐⭐ §5 W1 EXIT 2 · THE `buildable` REFUSAL MASK'S OWN SUMMARY. Derived, never
      // stored — the ground refuses, and this row says how much and why. ⚠ The DRAWN-BODY
      // census is NOT here and that is deliberate: all four standing drawn censuses in this
      // programme are harness/test instruments (`MFARCH2-drawn.mjs`, `districtStraddlers`),
      // because a per-body sweep on a metropolis is a census's cost and not a build's. See
      // `groundRefusal.refusalCensus`, which is the instrument, and its note on why it must
      // not inherit the enforcement's predicate.
      buildable: (() => {
        const m = buildableMask(sub);
        return {
          refusedCells: m.refusedCells, cragCells: m.cragCells, wetCells: m.wetCells,
          share: Math.round(m.share * 10000) / 10000, grade: m.grade, reason: m.reason,
        };
      })(),
      // ⭐⭐⭐ §5 W1 EXIT 3 · THE WATER BEARING, DERIVED FROM SUBSTRATE GEOMETRY. `null` on a
      // dry leaf — a leaf with no water has no bearing, and 0° would be a fabricated one.
      waterBearing: waterBearingOf(waterRel, sub),
      // §5 W1 exit 6: the seat the water's detail scale was damped at, and how far it fell
      // from the nucleus actually found — published so the approximation is auditable.
      waterfrontSeat: {
        x: Math.round(seat.x * 10) / 10, y: Math.round(seat.y * 10) / 10,
        score: Math.round(seat.score * 1000) / 1000,
        offNucleus: Math.round(Math.sqrt((seat.x - nuclei[0].x) ** 2 + (seat.y - nuclei[0].y) ** 2) * 10) / 10,
        builtRadius: Math.round(scale.builtRadius * 10) / 10,
        reason: seat.reason,
      },
      // §5 W1 exit 6: the coastline's two measured scales, carried out of the shore trace.
      shoreScales: (waterRel && waterRel.scales) || null,
      builtRadius: scale.builtRadius,
      roofs: scale.roofs,
      households: scale.households,
      // ⭐⭐ GAP-A/T-01 THE GRAIN, derived and reported so it can be graded rather than
      // believed: the DERIVED cells across, the tier's measured band, and the count the
      // drawing actually achieved.
      grainCellsAcross: Math.round(scale.cellsAcross * 10) / 10,
      grainBand: scale.grainBand,
      grainReason: scale.grainReason,
      grainModulesAcross: Math.round((2 * scale.builtRadius / Math.max(0.01, packed.frontage)) * 10) / 10,
      representative: scale.representative,
      // ⭐⭐ THE PRINTED RATIO IS RECOMPUTED ON WHAT IS ACTUALLY DRAWN (§181.2a). The tier
      // grammar's own `representationRatio` is households ÷ the roof TARGET; after the LOD
      // merge the leaf carries fewer shapes than that, and printing the pre-merge figure
      // would be a promise the drawing does not keep. `drawnShapes` is the denominator the
      // reader can count.
      // ⚠ THE SHANTY HUTS ARE DWELLINGS, so they join the denominator of a ratio that
      // counts dwelling shapes. They are NOT parcels, so the §5 census claim never sees
      // them — the two counts answer two questions and this is the only place they meet.
      representationRatio: (lod.drawnShapes + drawn.huts.length) > 0
        ? scale.households / (lod.drawnShapes + drawn.huts.length)
        : scale.representationRatio,
      drawnShapes: lod.drawnShapes + drawn.huts.length,
      shantyHuts: drawn.huts.length,
      shantyReason: shanty.reason,
      lodMerged: lod.mergedKeys.size,
      lodMasses: drawn.masses.length,
      lodReason: lod.reason,
      accentBand: scale.accentBand,
      wardLabels: scale.wardLabels,
      morphology: morphology.band,
      morphologyOrder: morphology.order,
      morphologyReason: morphology.reason,
      foundingKind: morphology.foundingKind,
      lawfulness,
      waterMode: waterRel.mode,
      waterReason: waterRel.reason,
      nucleusCount: nuclei.length,
      polycentric: umbrella.polycentric || nuclei.length > 1,
      circularity: outline.length ? circularity(outline) : 0,
      highWater: scale.highWater,
      hasWalls,
      plotFrontage: packed.frontage,
      // §11.12a THE TRUE MEASURE — the numbers the chrome prints and the pins assert.
      metresPerUnit: Math.round(measure.metresPerUnit * 10000) / 10000,
      trueBuiltRadiusM: Math.round(measure.trueBuiltRadiusM),
      frameMetres: Math.round(measure.frameM),
      impliedFrontageM: Math.round(measure.impliedFrontageM * 100) / 100,
      measureDensity: measure.density,
      measureTenureOk: measure.tenureOk,
      measureUnit: measure.unit.name,
      measureUnitPending: measure.unit.pending,
      measureReason: measure.reason,
      // §181.2b/MF-B4: how far the DISCOVERED module sits from the estimate the provisional
      // street web was laid out in. 1.0 means the estimate was right; the corpus ran
      // 0.35–1.08 before this lane and the ladder never heard about it.
      moduleDrift: packed.moduleDrift,
      streetWidths: packed.widths,
      // §161e.1: quarters the packer left empty and the guarantee had to PLANT into.
      plantedDwellings: packed.plantedDwellings || 0,
      encroachedDwellings: packed.encroachedDwellings || 0,
      centre,
      seatingSatisfaction: seating.satisfaction,
      physicalViolations: seating.physicalViolations,
      // §15.6: every repair and every failure is REPORTED — silent nonsense is forbidden.
      seatingRepairs: (seating.repairs || []).length,
      seatingRepairsByTier: countBy((seating.repairs || []).map((r) => r.tier)),
      seatingUnrepaired: (seating.unrepaired || []).length,
      foundedDistricts: attribution.founded.map((d) => d.id),
      matrixInstitutions: attribution.matrix.length,
      nonBuildingInstitutions: (landmarks.nonBuilding || []).length,
      compoundsReserved: compounds.length,
      firedQuarters: [...fireByDistrict.keys()].sort(compareKeys),
      commonsReserved: commons.length,
      commonsEnclosed: enclosure.filter((e) => e.enclosed).length,
      greens: umbrellaFaced.greens.length,
      // §181.2b ONE LEVEL UP, measured on every leaf.
      builtUmbrellaReason: inverted.reason,
      groundLawStreetClips: ground.streetClips,
      groundLawPartyClips: ground.partyClips,
      groundLawDropped: ground.dropped,
      groundLawDwellingsLost: ground.dwellingsLost,
      groundLawReason: ground.reason,
      groundLawInstitutionParts: ground.instPartsLost,
      groundLawInstitutionBodies: ground.instBodiesEmptied,
      groundLawDemoted: ground.demoted,
      groundLawDemotedBy: ground.demotedBy,
      // ⭐⭐⭐ §202 / §201 B / §161m.4 — the access law's own record.
      accessRepair: access.reason,
      accessShrunk: access.shrunk,
      accessDropped: access.dropped,
      // §202's ladder, published so it can be AUDITED rather than believed — see the note
      // on `freed` in accessLaw.js. `accessFreed` is BUILDINGS (sealed at entry, not sealed
      // at exit); `accessShrunk` is OPERATIONS; the two are no longer subtractable by accident.
      accessFreed: access.freed,
      accessSealedAtEntry: access.sealedAtEntry,
      accessSealedPerRound: access.sealedPerRound.join(','),
      landlocked: accessAudit.landlocked.length,
      landlockedKeys: accessAudit.landlocked.slice(0, 8),
      orphanStreets: accessAudit.orphanStreets.length,
      orphanStreetKeys: accessAudit.orphanStreets.slice(0, 8),
      openComponents: accessAudit.openComponents,
      accessReachedShare: accessAudit.reachedShare,
      circuitPermeable: permeability.permeable,
      circuitStreetComponents: permeability.comps,
      circuitMainShare: permeability.share,
      // ⭐⭐⭐ §205 A THE WATER RIGHT-OF-WAY — the claim's own width beside what stands in it.
      riverClaimWidth: closing.claims.length ? Math.round(closing.claims[0].width * 10) / 10 : 0,
      riverDrawnWidth: waterRel && waterRel.width ? Math.round(waterRel.width * 10) / 10 : 0,
      waterCrossings: closing.water.crossings,
      waterExempt: closing.water.exempt,
      waterExemptions: closing.water.byExemption,
      waterViolations: closing.water.violations.length,
      waterViolationKeys: closing.water.violations.slice(0, 6).map((v) => v.key),
      waterReasonROW: closing.water.reason,
      // ⭐⭐⭐ §203 THE ZONES — containment three ways, and the T-05 fill band per quarter.
      zoneOutside: closing.zones.outside,
      zoneMajorityOutside: closing.zones.majorityOutside,
      zoneOffBand: closing.zones.offBand,
      zoneUnwashed: closing.zones.unwashed,
      zoneUnwashedBodies: closing.zones.unwashedBodies,
      zoneClickCoverage: closing.zones.clickCoverage,
      zoneFill: closing.zones.fill,
      zoneReason: closing.zones.reason,
      // ⭐⭐ GAP-B / GAP-C.
      radialDensityFalloff: closing.radial.falloff,
      radialDensityBand: closing.radial.band,
      radialDensityVerdict: closing.radial.verdict,
      radialDensityReason: closing.radial.reason,
      streetClasses: closing.streets.classes,
      streetClassCount: closing.streets.count,
      streetClassRatios: closing.streets.ratios,
      streetP97overP50: closing.streets.p97overP50,
      streetMarketVoid: closing.streets.marketVoid,
      streetClassReason: closing.streets.reason,
      // §17.4 THE FRONTING DERIVATION, measured rather than asserted.
      frontedInstitutions: fronting.fronted,
      freeRotationInstitutions: fronting.free,
      frontedByRank: fronting.byRank,
      frontingReason: fronting.reason,
      mooredInstitutions: moored.moored,
      mooringReason: moored.reason,
      bridges: bridges2.bridges.length,
      bridgeReason: bridges2.reason,
      waterGates: waterGates.gates,
      waterGateReason: waterGates.reason,
      fieldsClippedToWater: fieldWater.clipped,
      fieldsDrownedDropped: fieldWater.dropped,
      fieldHedgesDrowned: fieldWater.hedgesDrowned,
      fieldWaterReason: fieldWater.reason,
      // §16.5 THE WORKSITE HABITATION LAW.
      tenurePattern: tenure.pattern,
      tenureScore: tenure.score,
      tenureReason: tenure.reason,
      countryDwellings: habitation.dwellings.length,
      countryDwellingKinds: habitation.counts,
      habitationReason: habitation.reason,
      keeperDwellings: keepers.dwellings.length,
      keeperKinds: keepers.counts,
      keeperReason: keepers.reason,
      // §5.0e THE FAUBOURG LAW.
      faubourgBuildings: drawn.faubourgBuildings.length,
      faubourgGates: faubourgs.gates,
      faubourgLeanTos: drawn.faubourgLeanTos.length,
      faubourgInns: faubourgs.inns || 0,
      // §18.1 THE PRECINCTS.
      precincts: precincts.precincts.length,
      precinctReason: precincts.reason,
      glacisClear: faubourgs.glacisClear,
      faubourgReason: faubourgs.reason,
      // §11 THE SNAPSHOT AXIS, measured rather than asserted.
      snapshotYear: Number.isFinite(options.year) ? options.year : presentYear(s),
      settlementAge: presentYear(s),
      wallStanding: hasWalls,
      wallVintageReason: wallStanding.reason,
      // ⭐⭐ ODQ §240 · THE EPOCH LADDER, REPORTED so it can be graded rather than believed.
      epochs: wallCircuit.epochs ? wallCircuit.epochs.length : 1,
      epochCircuits: walls.length,
      epochExtents: (wallCircuit.epochs || []).map((e) => Math.round(e.extent * 1000) / 1000),
      epochReason: wallCircuit.epochReason || 'unwalled — one epoch',
      // ⭐⭐⭐ G-42 (§257.3a) · THE **FABRIC** EPOCH COUNT, on EVERY leaf, walled or not. Before
      // this wave an unwalled leaf read 1 BY CONSTRUCTION — six of sixteen — and no per-epoch
      // criterion in W4 was testable below the wall line.
      fabricEpochs: wallCircuit.epochs ? wallCircuit.epochs.length : 1,
      fabricEpochKinds: (wallCircuit.epochs || []).map((e) => e.kind),
      // ⭐⭐⭐ G-42 · THE FABRIC EPOCHS, THE RUN CHAIN AND THE FOSSIL LADDER, reported so they
      // can be GRADED rather than believed. The rows live with the modules that derive them
      // (`wallRuns.wallMeta`) — the input record belongs with the node that declares it, and the
      // 800-line domain ceiling is what made me put it there rather than inline.
      ...wallMeta(walls, demotionSited),
      marketColonized: colonize.rows.length,
      marketColonizationReason: colonize.reason,
      groundLawSecondPass: swept.reason,
      institutionSolids: bodies.solids,
      institutionReach: bodies.maxReachOfSize,
      institutionBodyReason: bodies.reason,
      voidsFaced: facedSquares.moved + facedGreens.moved,
      voidsFacedReason: `${facedSquares.reason}; greens: ${facedGreens.reason}`,
      claimCells: inverted.growthCells,
      builtCells: inverted.keptCells,
      builtOfClaim: Math.round((1000 * inverted.keptCells) / Math.max(1, inverted.growthCells)) / 1000,
      reliefReason: relief.reason,
      worksDrawn: terraform.works.length,
      workMarks: terraform.marks,
      worksSkipped: terraform.skipped,
      worksReason: terraform.reason,
      routeSource: routes.source,
      routeCorridors: routes.corridors.length,
      routeCrossings: routes.crossings.length,
      routeReason: routes.reason,
      constraintsDefaulted: record.defaulted,
      wallVintage: record.get('wall-built-year', null),
      populationPeaks: record.get('population-peaks', 0),
      foodEconomy: record.get('food-economy', 'tillage'),
      fieldFurlongs: fields.furlongs,
      fieldParcels: fields.parcels.length,
      fieldDemandMet: Math.round(fields.demandMet * 1000) / 1000,
      fieldArableShare: Math.round(fields.arableShare * 1000) / 1000,
      fieldArableCells: fields.arableCells,
      fieldDryCells: fields.dryCells,
      fieldGapsFilled: fields.gapsFilled,
      fieldNonConvex: fields.nonConvex,
      fieldCoverage: Math.round(fields.coverage * 1000) / 1000,
      fieldInteriorCoverage: Math.round(fields.interiorCoverage * 1000) / 1000,
      fieldEdgeFurlongs: fields.edgeFurlongs,
      fieldClippedLands: fields.clippedLands,
      fieldLanes: fields.lanes.length,
      outlyingLanes: outlying.lanes.length,
      // §17.6 THE ALLEY-GAP LAW, counted by the reason each gap carries.
      passages: packed.passages.length,
      passageReasons: countBy(packed.passages.map((p) => p.reason)),
      closedSlots: packed.slots.length,
      slotReasons: countBy(packed.slots.map((p) => p.reason)),
      outlyingRefused: outlying.refused,
      outlyingReason: outlying.reason,
      fieldHedges: fields.hedges.length,
      fieldTillageFactor: fields.tillageFactor,
      fieldTerracedShare: Math.round(fields.terracedShare * 1000) / 1000,
      fieldReason: fields.reason,
      seaShare: waterRel.body ? Math.round((absArea(waterRel.body) / (VIEW * VIEW)) * 1000) / 1000 : 0,
      // §181.3a THE STREET WEB, measured rather than asserted.
      streetChannels: streetsWalled.length,
      streetRanks: countBy(streetsWalled.map((c) => c.rank)),
      streetUncontained: channels.dropped,
      streetSplit: channels.split,
      streetComponents: streetWeb.components,
      streetGates: streetWeb.gates,
      streetGatesConnected: streetWeb.gatesConnected,
      streetConnectedShare: Math.round(streetWeb.connectedShare * 1000) / 1000,
      streetDeadEnds: streetWeb.deadEnds,
      streetStranded: streetWeb.stranded,
      streetEdgeEnds: streetWeb.edgeEnds,
      streetStitched: channels.stitched,
      streetReason: `${channels.reason}. ${channels.containReason}. ${streetWeb.reason}`,
      notes: attribution.notes.concat(seating.notes, reserved.notes),
    },
    record,
    routes,
    // §11.12a: the whole minted measure, so the chrome reads ONE object rather than
    // re-deriving a scale from the meta's rounded copies.
    measure,
    // §12 and §10, DERIVED IN THE FABRIC (the §195.0 law) and drawn by the lens.
    immersion,
    stateMarks: stateMarksSwept,
    substrate: sub,
    suitability: field,
    nuclei,
    subseeds,
    get water() { return governed.water.read(); },
    commons,
    compounds,
    enclosure,
    // The connective ribbons, carried out so a counterfactual can rebuild the partition
    // WITHOUT the commons and show that the greens are the reservation's doing.
    // ⛔⛔ RENAMED AT MF-B6, AND THE OLD NAME WAS SILENTLY DESTROYING THIS FIELD. MF-B5 added
    // `bridges: bridges2.bridges` (the §195.1 WATER bridges) to this same object literal, and
    // a DUPLICATE KEY IN AN OBJECT LITERAL KEEPS THE LAST BINDING — so the ribbons vanished
    // from the record and every reader of `fabric.bridges` got water bridges. The only reader
    // was the §5.0c.3 greens counterfactual, which rebuilds the partition with
    // `withCommons.bridges || []`: on a leaf whose streets cross no water it rebuilt with NO
    // RIBBONS AT ALL, so the arm varied two things and isolated neither. ⭐ THE CLASS:
    // **A DUPLICATE KEY IN AN OBJECT LITERAL IS A SILENT DELETION, AND WHERE THE DELETED
    // FIELD'S ONLY READER IS A COUNTERFACTUAL, NOTHING REDS.**
    ribbons: bridges,
    // ⭐⭐ §205 A · THE WATER CENSUS'S OWN FINDING, PUBLISHED WHOLE (MF-W0).
    //
    // ⛔ THE META CARRIES COUNTS AND THE **FIRST SIX** VIOLATION KEYS, and a truncated list
    // cannot answer the question the law is graded on — *what share of the convictions the
    // deriver is structurally unable to exempt*. MF-W1 had to reach the finding through a
    // private probe spliced into a disposable tip, and its own receipt records why the
    // alternative was worse: a decomposition rebuilt from the fabric's PUBLISHED surfaces was
    // **wrong on six leaves**, because `fabric.landmarks` is `seating.seated` while the census
    // walks `seatedAll`. ⭐ THE CLASS: **A FIGURE THAT CAN ONLY BE DECOMPOSED BY A PRIVATE
    // PROBE IS A FIGURE NOBODY CAN AUDIT** — so the census's finding is published, once, from
    // the census's own hand, and every later wave measures the same subject the meta counts.
    // ⚠ It is a REPORT, not a law surface: nothing in the pipeline reads it back.
    waterCensus: closing.water,
    relief: reliefDrawn,
    terraform,
    fields,
    outlyingLanes: outlying.lanes,
    bridges: bridges2.bridges,
    habitation: habitation.dwellings.concat(keepers.dwellings),
    faubourgs: faubourgsDrawn,
    organisms,
    precincts: precincts.precincts,
    partition: builtPartition,
    umbrella: umbrellaFaced,
    // The CLAIM, carried out whole so a counterfactual can measure the inversion and a
    // consumer that genuinely needs the growth outline (nothing does today) can find it.
    growthUmbrella,
    growthPartition: partition,
    web: facedWeb,
    channels: streetsWalled,
    // ⭐⭐⭐ §250.5 · THE FOSSIL LADDER'S OWN GEOMETRY, published as its own artifact so a
    // census can ask "what did the superseded circuit emit" without re-deriving anything.
    // ⚠ THE **SITED** VERSION — what the leaf draws, after the fabric that grew over the old
    // circuit took its ground back (see `siteFossils`). The emitted version is not published:
    // nothing downstream wants "the fossils before the town was in the way".
    demotion: demotionSited,
    streetWeb,
    alleys: packed.alleys,
    passages: packed.passages,
    slots: packed.slots,
    blocks: packed.blocks,
    get parcels() { return governed.parcels.read(); },
    shanty: shantyDrawn,
    lod: lodDrawn,
    landmarks: seating.seated,
    nonBuilding: landmarks.nonBuilding || [],
    // ⚠ `walls` IS DEFINED BELOW AS A VERIFYING GETTER, not here as a plain array. Re-adding
    // it to this literal would restore the raw handle the accessor exists to remove.

    // ⭐⭐⭐ §230/§234 · THE CIRCUIT NODE ITSELF. `walls` is its `rings` — carried out under the
    // old name so the lens's tower/gate/ditch reads are untouched — but every question about
    // WHERE THE WALL IS (what is stroked, what is reserved, which side of it a point lies on)
    // must be asked of this node through wallCircuit.js's accessors, which verify its content
    // hash. A consumer that re-derives from `walls[].polygon` is publishing a second reading.
    wallCircuit,
    power,
  }, wallCircuit);
}

/** Count occurrences by key — the §15.6 repair diagnostics, summarized for the meta. */
function countBy(list) {
  /** @type {Record<string, number>} */ const out = {};
  for (const k of list.slice().sort()) out[k] = (out[k] || 0) + 1;
  return out;
}

/** Even-odd point-in-ring — the sea body is emphatically not convex. */
function pointInRing(poly, x, y) { return pointInPolygon(x, y, poly); }

/** Sort helper re-exported for consumers that must iterate the fabric deterministically. */
export { compareKeys };

/** Convenience: the watercourse's drawn banks, for the render lens. */
export function waterBanks(water) {
  if (!water || !water.line || water.kind !== 'river') return null;
  return { left: offsetLine(water.line, water.width / 2), right: offsetLine(water.line, -water.width / 2) };
}

/** Convenience: is a point on a road? Used by the ground dress to keep fields off lanes. */
export function onRoad(web, x, y, pad) {
  for (const rd of web.roads) if (distToPolyline(x, y, rd.line) < pad) return true;
  return false;
}

/** Re-exported so a caller can fork the same way the fabric does. */
export { fabricRng };
