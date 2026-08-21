/**
 * domain/townMap/fabric/tierGrammar.js — §5 THE TIER GRAMMAR, §161f CONTINUOUS SCALE,
 * and THE HIGH-WATER LAW.
 *
 * The map must make tier legible AT A GLANCE — a thorp is an incident in the
 * countryside, a metropolis is a world with countryside at its edges. But tiers are
 * BANDS, NEVER STEPS (§161f): a city of 10,000 and a city of 20,000 are two different
 * magnitudes wearing one name, and no quantity here may quantize to the tier when the
 * population can grade it. Every function below takes the population and returns a
 * continuous value; the tier only sets the band it moves inside.
 *
 * ⭐⭐ THE HIGH-WATER LAW: BUILT EXTENT derives from the HISTORICAL MAXIMUM population;
 * OCCUPANCY derives from the CURRENT one. A city that peaked at 20,000 and holds 10,000
 * today has the STREETS of 20,000 and the LIFE of 10,000. A stable 10,000 city and a
 * shrunken 20,000-peak city carry the same souls and completely different biographies,
 * and the map has to tell them apart — that difference is the whole of §161g's elegy.
 *
 * ⛔ THE MEASURED LIMIT, AND HOW IT IS HANDLED HONESTLY. `settlement.populationHistory`
 * is an ELEVEN-ENTRY RING BUFFER — all four writers `.slice(-11)` — so it supports a
 * TREND and cannot support a historical maximum. A city that peaked two centuries ago
 * carries no record of its peak there. ⭐ But a high-water signal exists on EVERY
 * settlement with no history at all: `settlement.tier` and `popToTier(population)` are
 * SEPARATE fields that CAN DISAGREE, and a stored `tier: 'city'` over a thorp-scale
 * population is a recorded demotion readable in one comparison.
 *
 * So the deriver takes the max of what it can actually see, DECLARES ITS WINDOW, and
 * where the window cannot reach the true peak the deficit is UNDERSTATED, NEVER
 * INVENTED — the ruin ring simply renders smaller, or not at all. That is the
 * degradation law applied to time, and it keeps the extent claim inside §8.2.
 *
 * PURITY: pure reads and arithmetic. No draws, no Date, no Math.random.
 */

/** Tier order, low to high — the local spelling of the landed TIER_ORDER. */
export const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

/**
 * ⭐ AVG_HOUSEHOLD — THE CHAIR-SIGNED CONSTANT the §5 building bands derive from.
 *
 * §5 claims the fabric is 1:1 with the housing census at village scale and below. That
 * is a TRUTH CLAIM, and it needs a household size to be checkable. NO HOUSEHOLD CENSUS
 * EXISTS anywhere in the estate — zero household machinery — so the bands cannot be
 * independently chosen numbers; they must DERIVE as buildings = f(population,
 * AVG_HOUSEHOLD).
 *
 * The value is 5: it is the value at which the engine's own POPULATION_RANGES map onto
 * the charter's building bands, and it sits inside the historically attested 4.5–5.5
 * band for pre-industrial European households. It is signed HERE, once, and every band
 * below reads it rather than restating a number.
 * ⚠ OWNER-SIGNED VALUE. Changing it moves every settlement's roof count.
 */
export const AVG_HOUSEHOLD = 5;

/**
 * The floor on drawn roofs at the bottom of the ladder. A 12-soul thorp is ~2 households
 * and two rectangles is not a settlement — it is a punctuation mark. The floor is a
 * LEGIBILITY constant and it is deliberately NOT laundered into AVG_HOUSEHOLD, because
 * the household size is a truth claim and this is a drawing decision.
 */
export const MIN_LEGIBLE_ROOFS = 4;

/**
 * ⭐⭐⭐ THE 1:1 RECONCILIATION (§181.2b, chair order) — AT THE CENSUS TIERS THE EXTENT
 * DERIVES FROM THE ROOFS, AND THE AREA-SHARE DERIVATION IS REMOVED.
 *
 * ⛔ THE DEFECT, STATED EXACTLY. At thorp/hamlet/village the charter makes TWO claims
 * about the same settlement and MF-B1b let them run on separate rails:
 *   • §5's footprint column says the built extent is a SHARE OF THE FRAME'S AREA;
 *   • §5's 1:1 law says the roof count is POPULATION ÷ AVG_HOUSEHOLD.
 * Nothing reconciled them, so a village's umbrella was sized for far more fabric than its
 * household count could ever supply. MEASURED at the base: the village exemplar's plots
 * (yards included) covered **0.152** of its own umbrella against **0.353** at town and
 * **0.407** at metropolis — 101 buildings sitting in one arc of a large pale blob, which
 * is precisely the leaf the chair convicted. hf3's village is a TIGHT CLUSTER on a
 * crossroads; ours was a sparse one.
 *
 * ⭐⭐ THE CURE IS A DIRECTION OF DERIVATION, NOT A NUMBER. Where the fabric claims to be
 * the housing census, the housing census is the SOURCE and the extent is the RESULT:
 *
 *     population → households (÷ AVG_HOUSEHOLD) → roofs
 *              → plots (PLOT_MODULE² × PLOT_DEPTH_RATIO)
 *              → built area (÷ PLOT_PACKING)
 *              → the umbrella's radius
 *
 * Above village the direction REVERSES and §5's area share leads, because there the map
 * is explicitly REPRESENTATIVE: the fabric shows a city's worth of fabric and the
 * cartouche prints the ratio. Two different claims, two different derivations, each
 * honest about which way it runs — that is the reconciliation.
 *
 * ⭐ AND IT IS WHY THE MODULE IS THE FIXED END. A plot frontage is a REAL UNIT (a rod,
 * ≈5 m) and it is also the drawn module the whole leaf is measured in, so at the census
 * tiers it is a LEGIBILITY constant chosen once per tier — the map ZOOMS with the tier,
 * exactly as §5's amendment says — and the extent follows it. Below, the values and the
 * arithmetic that produced them.
 */

/**
 * PLOT_MODULE — the DRAWN burgage frontage, view units, at the census tiers.
 *
 * §42/§43 VALUES, DERIVED FROM THE BAND rather than chosen for composition. Each is the
 * module at which `roofs × module² × PLOT_DEPTH_RATIO ÷ PLOT_PACKING` lands the tier's
 * MEDIAN population inside §5's own footprint band:
 *
 *   thorp    27 souls →  5 roofs;  band 1.4–3.0 %  ⇒ module ≈ 26  (a thorp leaf is a LANE)
 *   hamlet  220 souls → 44 roofs;  band 4.5–9.5 %  ⇒ module ≈ 16
 *   village 512 souls →102 roofs;  band 10.5–17.5 %⇒ module ≈ 15
 *
 * ⚠ THE MODULE SHRINKS UP THE LADDER, which is the zoom law made literal: a thorp's five
 * dwellings are drawn large on a leaf covering a lane; a village's hundred are drawn
 * smaller on a leaf covering a parish. Above village the module is DERIVED from the area
 * share instead (see streets.plotFrontage) and no entry exists here.
 * ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, number>>}
 */
export const PLOT_MODULE = Object.freeze({ thorp: 26, hamlet: 16, village: 15 });

/**
 * ⭐⭐ THE PLOT'S DEPTH AGAINST ITS FRONTAGE — **AND IT IS NOT ONE NUMBER, BECAUSE THE
 * BURGAGE PLOT IS AN URBAN FORM.** One home, because the extent derivation needs the
 * plot's AREA and parcels.js needs its SHAPE; two numbers would be the five-homes defect.
 *
 * ⛔ THE DEFECT THIS ROW FIXES, AND IT IS A TRUTH DEFECT BEFORE IT IS A GEOMETRY ONE.
 * MF-A3 applied ONE ratio (2.35 — the shallow end of the attested 1:4–1:8 English burgage)
 * at every tier. Burgage tenure is a BOROUGH tenure: the narrow-fronted deep strip exists
 * because urban street frontage was scarce and dear. A hamlet's houses stand on CROFTS —
 * a dwelling with its garden and stock ground about it, roughly as wide as it is deep,
 * because nothing was competing for the frontage. Drawing a thorp's five cottages as deep
 * burgage strips is drawing an urban land market onto a place that has none.
 *
 * ⭐ AND THE GEOMETRIC PAYOFF IS EXACTLY WHAT MF-B1b's CLAMP HAZARD PREDICTED. The 2.35
 * ratio on a thorp module produced a plot 61 units deep inside a settlement of radius 82,
 * so `plotDepth` hit the `builtRadius × 0.34` clamp and the plot's aspect ratio was
 * silently rewritten by the clamp — the very class MF-B1b recorded ("clamp the SHAPE, not
 * one of its measurements"). Giving the small tiers their own true ratio means the clamp
 * never binds and no aspect is decided by a guard.
 * ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, number>>}
 */
// ⭐⭐ THE URBAN RUNGS RAISED 2.35 → 4.20 (T-08, MEASURED). MF-A3's 2.35 was the shallow end
// of the attested 1:4–1:8 English burgage, taken because "anything past ~3.2 renders as a
// corridor at plan scale". MF-S1 MEASURED the corpus's own plots on the hf72 and hf56 native
// crops: **depth : width ≈ 4–6 : 1**, with the building at the street end taking 30–45% of the
// depth and the rest toft. So the reference draws the corridor, and it draws it because that
// IS the shape of borough tenure — the narrow deep strip exists because street frontage was
// scarce and dear.
// ⭐ AND THE LEGIBILITY OBJECTION DISSOLVES AT THE NEW GRAIN RATHER THAN BEING OVERRULED. The
// 2.35 note was written when a town's frontage was 7–11 view units and a 4:1 plot would have
// run 40 units deep across a 600-unit settlement. At the T-01 grain the module is ~6 units, so
// a 4.2:1 plot is ~26 units — a quarter of a block, exactly what hf72 shows.
// ⚠ IT IS ALSO A TERM IN THE GRAIN DERIVATION (grainRoofs' denominator): a deeper plot means
// FEWER, NARROWER plots at the same grain, which is why raising it costs the op budget
// nothing and buys the burgage read outright.
// ⚠ THE CENSUS TIERS ARE UNCHANGED AND THAT IS THE POINT (J-B2-3): a hamlet's houses stand on
// CROFTS, roughly as wide as they are deep, because nothing was competing for the frontage.
// Drawing a thorp's five cottages as deep burgage strips is drawing an urban land market onto
// a place that has none.
export const PLOT_DEPTH_RATIO = Object.freeze({
  thorp: 1.30, hamlet: 1.30, village: 1.80, town: 4.20, city: 4.20, metropolis: 4.20,
});

/** The plot depth ratio for a tier, defaulting to the urban burgage. */
export function plotDepthRatio(tier) {
  return PLOT_DEPTH_RATIO[tier] == null ? 2.35 : PLOT_DEPTH_RATIO[tier];
}

/**
 * ⭐⭐⭐ THE BUILD-OUT LADDER (§181.2a, chair order) — HOW MUCH OF A BLOCK IS BUILDING.
 *
 * ⛔ THE MEASURED GAP MF-B1b REPORTED AND DID NOT CLOSE: our blocks ran **0.40–0.46**
 * built where hf30's run **0.70–0.80**. The block ground showed through everywhere and
 * the fabric read as detached houses in a yard rather than as a town.
 *
 * ⭐⭐ AND THE CURE IS NOT ONE NUMBER, BECAUSE THE REFERENCES DISAGREE WITH EACH OTHER —
 * WHICH IS THE FINDING. hf30 is a walled CITY CORE: its burgage yards were built over
 * generations ago and its blocks are nearly solid, with small light courts. hf3 is a
 * VILLAGE: its houses stand in generous crofts with garden ground all round them, and
 * building it out to 0.75 would draw a city's land hunger onto a place that has none.
 * ⭐ **THE 70–80% BAR IS THE CITY'S BAR, AND APPLYING IT AT EVERY TIER WOULD HAVE BEEN A
 * FAITHFUL COPY OF THE WRONG REFERENCE.** Build-out is therefore a LADDER, and the ladder
 * is a statement about land value: the scarcer the frontage, the more of the yard is
 * built. Each rung is read off the reference corpus at that tier.
 *
 *  yardShare  the share of a plot's DEPTH that is open ground rather than street range.
 *  backOdds   how often the REAR of the yard carries a building too — the back-house,
 *             the workshop, the stable, the brewhouse. This is `PLOT_SHAPE.backOdds`,
 *             declared by MF-A3 and UNUSED until now: it is the historically right way to
 *             fill a block, and it is the lever MF-B1b named and held.
 *  target     the block build-out this rung is aiming at, for the receipt to check.
 * ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, { yardShare:number, backOdds:number, target:number }>>}
 */
export const BUILD_OUT = Object.freeze({
  thorp:      { yardShare: 0.60, backOdds: 0.20, backDepth: 0.34, depthJitter: 0.66, target: 0.34 },
  hamlet:     { yardShare: 0.58, backOdds: 0.30, backDepth: 0.38, depthJitter: 0.66, target: 0.40 },
  // ⚠⚠ THE VILLAGE RUNG RE-DERIVED, AND THE CAUSE IS THE LADDER RATHER THAN THE VILLAGE.
  // T-08 raised the URBAN depth ratio to the measured 4.20 and deliberately left the crofts
  // at 1.80 (a croft is not a burgage — J-B2-3). That widens the urban BLOCK without widening
  // the village's, so the same yard shares put the village's block build-out within 12% of the
  // city's and the ladder's whole counterfactual — "a city builds out and a village
  // deliberately does not" — nearly inverted. MEASURED: village 0.393 against city 0.444.
  // ⭐ THE CURE IS THE REFERENCE'S OWN. hf3's village houses stand in GENEROUS CROFTS with
  // garden ground all round them; hf17 shows the density gradient INSIDE a village, abutting
  // on the high street and detached at the edges. A bigger yard share is what that is.
  village:    { yardShare: 0.60, backOdds: 0.36, backDepth: 0.42, depthJitter: 0.60, target: 0.42 },
  // ⭐⭐ THE URBAN YARD SHARES RAISED WITH THE DEPTH RATIO, AND THE BUILDING KEPT THE SAME
  // ABSOLUTE DEPTH. T-08 measures the street range at **30–45% of the plot's depth**. At the
  // old 2.35:1 with yardShare 0.42 the range took 49–67% of the depth — a stubby block, not a
  // burgage. At 4.20:1 with yardShare 0.62 it takes 24–52% (mean ~0.38, inside the measured
  // band) and comes out ~1.6 frontages deep, which is within a few per cent of what it was.
  // ⭐ THE READ CHANGES ENTIRELY EVEN THOUGH THE RANGE DID NOT: what appears is the TOFT —
  // the long yard behind, with the back range at the bottom of it. That is the structure the
  // corpus repeats in 13 of 49 plates and the one b6 had no expression for at all.
  town:       { yardShare: 0.62, backOdds: 0.78, backDepth: 0.72, depthJitter: 0.30, target: 0.62 },
  city:       { yardShare: 0.58, backOdds: 0.92, backDepth: 0.90, depthJitter: 0.16, target: 0.74 },
  // ⛔⛔ THE METROPOLIS YARD WAS CLOSED AT MF-B6 AND THE CHANGE WAS REVERTED, MEASURED.
  // The band target said "densify the metropolis", so the yard went 0.24 → 0.18 — a
  // historically exact move (the metropolitan burgage yard WAS built over) that should have
  // added 8% to the drawn street range. MEASURED, it added 0.9%, and the parcel share of the
  // built umbrella FELL 0.4 points. ⭐⭐ TWO REASONS, BOTH WORTH KEEPING:
  //   (a) THE DENOMINATOR IS DERIVED FROM THE NUMERATOR. The built umbrella is the union of
  //       the rank runs the packer cut and the blocks are cut from the plot depths, so a
  //       deeper plot grows both shares' denominators with their numerators. MEASURED:
  //       parcel/umbrella 0.3160 → 0.3118, block build-out 0.548 → 0.553.
  //   (b) CLOSING THE YARD STARVES THE BACK RANGE. `backRoom = yardDepth − wingRun`, so the
  //       ground the street range takes is ground the back-house loses: the two densification
  //       mechanisms compete for the SAME yard and the dial moves built area from one body to
  //       the other rather than adding any.
  // ⭐ THE CLASS: **A SHARE WHOSE DENOMINATOR THE NUMERATOR DERIVES IS A FIXED POINT, AND NO
  // TUNING DIAL CAN MOVE IT.** The value stands at 0.24 and the band is answered by the
  // measurement rather than by a signature entry that buys nothing.
  metropolis: { yardShare: 0.55, backOdds: 0.95, backDepth: 0.94, depthJitter: 0.14, target: 0.78 },
});

/**
 * The build-out rung for a tier, PROSPERITY-GRADED. §7's prosperity law says a prosperous
 * settlement IN-FILLS density and a struggling one renders derelict parcels; that is the
 * same quantity this table sets, so it is read here rather than expressed twice.
 * @param {string} tier @param {number} prosperityRank 0..5
 */
export function buildOutRung(tier, prosperityRank) {
  const row = BUILD_OUT[tier] || BUILD_OUT.town;
  const p = Number.isFinite(prosperityRank) ? prosperityRank : 2;
  // ±0.06 of yard across the whole prosperity ladder, centred on Moderate (rank 2).
  const shift = (p - 2) * 0.030;
  return {
    yardShare: Math.max(0.14, Math.min(0.70, row.yardShare - shift)),
    backOdds: Math.max(0, Math.min(0.92, row.backOdds + shift * 1.6)),
    backDepth: Math.max(0.20, Math.min(0.90, row.backDepth + shift * 1.2)),
    // ⭐ THE DEPTH SPREAD IS ALSO A TIER FACT, and it is the LAST term in the build-out
    // ratio's denominator. A block's back boundary is a straight back lane; the plots
    // inside it vary, and the block ground the SHALLOW ones leave behind is unbuilt by
    // definition. In a laid-out borough rank the depths were regularized to that lane
    // (measured: a ±0.33 spread costs the ratio ~0.10 against a ±0.15 one); in a village
    // the depths are as irregular as the ownership, which is why the spread WIDENS down
    // the ladder rather than being one number for tidiness.
    depthJitter: row.depthJitter,
    target: row.target,
  };
}

/**
 * ⭐ PLOT_PACKING — the share of a settlement's own umbrella that its PLOTS (building plus
 * yard) actually cover. §42/§43 VALUE, **MEASURED, NOT ASSUMED** — and the measurement is
 * the point, because this is the factor that decides whether the roofs fill their extent.
 *
 * The obvious spelling is the one MF-B1's `plotFrontage` already carried: 0.58, "the share
 * of a built disc that is plots". It is an ARCHITECT'S figure and this fabric does not
 * achieve it, because the umbrella is the union of the organisms' INFLUENCE FIELDS while
 * the plots are cut on the block grid inside their reach — the two are not the same set,
 * and the difference is the settlement's own connective ground. MEASURED at this base over
 * the exemplar corpus: **0.353 town · 0.283 city · 0.407 metropolis**. The census tiers are
 * held to the middle of what the fabric demonstrably achieves.
 *
 * ⛔ USING THE ARCHITECT'S 0.58 HERE WOULD RE-CREATE THE DEFECT IN THE OPPOSITE DIRECTION:
 * the extent would come out 1.5× too small for its roofs, the packer would overflow its
 * own umbrella, and the ragged-edge cull would eat the surplus — a village drawn correctly
 * dense and a THIRD of its households silently missing. A derivation constant that is not
 * measured on the geometry it derives for is a wish.
 * ⚠ RE-MEASURE with `laneMFB2-probe.mjs` whenever the block grid, the reach or the
 * member bands move.
 *
 * ⚠ IT IS PER-TIER BECAUSE THE MEASUREMENT IS PER-TIER. The umbrella is the union of the
 * organisms' influence fields, and a two-organism hamlet's union covers far less of its
 * own extent disc than a five-organism town's does (measured: 0.41 against 0.84). One
 * global factor would therefore starve the bottom of the ladder to fit the top — which is
 * exactly what a single 0.38 did on the first cut: the hamlet came back with 14 plots
 * against 44 households, and the thorp with ONE. Each row is the value at which its
 * tier's yield lands on the census.
 * @type {Readonly<Record<string, number>>}
 */
export const PLOT_PACKING = Object.freeze({ thorp: 0.143, hamlet: 0.22, village: 0.41 });

/**
 * §5 TIER GRAMMAR as numbers. Every column is consumed downstream:
 *
 *  footprintLo/Hi — the settlement's share of the frame AREA at the BOTTOM and TOP of
 *      the tier's population band; the actual value interpolates (§161f). CHARTER
 *      AMENDMENT MF-A3: §5's literal 90:10 → 15:85 walk cannot be read as area at the
 *      bottom of the ladder — a thorp holding ~6 dwellings at 10% of the frame renders
 *      each dwelling ~61 units across and the map reads as five fields. The walk's SHAPE
 *      is preserved (countryside dominant at the bottom, city-fills-frame at the top) on
 *      a curve that keeps a dwelling legible AS a dwelling at every tier: the map ZOOMS
 *      with the tier.
 *  organismsLo/Hi — §5.0c.2's DECIDED LOBE COUNT, tier-bounded: thorp/hamlet nest
 *      everything in ONE cluster, a village typically 1–2, a town 2–4, a city many.
 *  nuclei — the §5.-1 site search's bound. Polycentric form is a TOWN-AND-UP shape:
 *      below that the settlement is one place by definition.
 *  monumental — §5's "Landmarks" column read as a MONUMENTAL SILHOUETTE BUDGET, never
 *      an institution cap (MF-A2). The engine emits 8 institutions for a 27-soul thorp;
 *      §8.1 says every one keeps its anchor, so the surplus renders as ordinary
 *      searchable fabric rather than being dropped.
 *  accentBand — §9.3's rationed accent density.
 *  blockDepth — how many plot-depths a block runs; the street web's recurrence interval.
 *  census1to1 — whether the fabric claims 1:1 with the housing census at this tier.
 *  wardLabels — whether the tier HAS quarters to label. Labelling a hamlet's four
 *      cottages "RELIGIOUS QUARTER" is a tier lie.
 * @type {Readonly<Record<string, any>>}
 */
export const TIER_PROFILE = Object.freeze({
  thorp:      { pop: [1, 60],       footprint: [0.014, 0.030], organisms: [1, 1],  nuclei: 1, monumental: 1,  accentBand: 1.00, blockDepth: 1, census1to1: true,  wardLabels: false, square: 'well' },
  hamlet:     { pop: [61, 400],     footprint: [0.045, 0.095], organisms: [2, 2],  nuclei: 1, monumental: 2,  accentBand: 1.00, blockDepth: 1, census1to1: true,  wardLabels: false, square: 'green' },
  village:    { pop: [401, 900],    footprint: [0.105, 0.175], organisms: [1, 2],  nuclei: 1, monumental: 4,  accentBand: 0.92, blockDepth: 2, census1to1: true,  wardLabels: true,  square: 'green' },
  town:       { pop: [901, 8000],   footprint: [0.210, 0.360], organisms: [4, 6],  nuclei: 2, monumental: 11, accentBand: 0.78, blockDepth: 2, census1to1: false, wardLabels: true,  square: 'market' },
  city:       { pop: [8001, 40000], footprint: [0.390, 0.540], organisms: [7, 9],  nuclei: 3, monumental: 18, accentBand: 0.58, blockDepth: 3, census1to1: false, wardLabels: true,  square: 'market-plural' },
  metropolis: { pop: [40001, 200000], footprint: [0.580, 0.720], organisms: [7, 9], nuclei: 3, monumental: 26, accentBand: 0.44, blockDepth: 3, census1to1: false, wardLabels: true,  square: 'market-plural' },
});

/**
 * ⛔ THE `organisms` COLUMN IS A MEASUREMENT, NOT AN ASPIRATION (corrected MF-B1b).
 *
 * It feeds ONE consumer: the inertia-safe divisor that decides how large a share of the
 * settlement's extent each quarter takes (see growOrganism's note — the divisor must be a
 * TIER fact, because dividing by the LIVE count would couple every quarter to every other
 * and destroy the locality pin). A divisor is only safe if it is also TRUE: MF-B1 carried
 * the charter's ASPIRATIONAL ward bands (§5's "10–14 wards" at metropolis) into a slot that
 * needed the count the engine actually emits, so every organism was sized for a settlement
 * with more quarters than would ever appear, and the union came back short of its own §5
 * footprint band. Measured over 10 seeds per tier at this base: the engine emits 1 / 2 / 2 /
 * 3–4 / 6–7 / 5–6 districts, which §5.0c multiplicity expands to 1 / 2 / 2 / 5 / 8 / 8
 * ORGANISMS — and organisms are what the divisor counts.
 *
 * ⭐ THE CHARTER'S WARD BANDS ARE NOT WRONG, THEY ARE A DIFFERENT QUANTITY. §5's table
 * counts the WARDS a reader should be able to see; this counts the district organisms the
 * dossier constitutes. That the two disagree at the top of the ladder is a finding for the
 * chair (the engine emits FEWER districts at metropolis than at city), not something this
 * column may paper over — a divisor that lies to protect a table produces a metropolis
 * drawn at two thirds of its own extent, which is exactly what was measured.
 * ⚠ RE-MEASURE THIS COLUMN whenever district constitution changes; `laneMFB1b-cal.mjs` is
 * the probe that produced it.
 */
export const ORGANISM_BAND_SOURCE = 'measured, 10 seeds/tier at 6b337fb1 — see the note above';

/** The frame's usable radius — the placement extent the landed model already uses. */
export const FRAME_R = 470;

/**
 * ⛔ THE FOOTPRINT RADIUS, DERIVED CORRECTLY — and the arithmetic slip worth recording.
 *
 * `footprint` is a share of the FRAME'S AREA (the 1000×1000 leaf), so the radius of a disc
 * covering that share is sqrt(footprint × VIEW² / π), NOT `FRAME_R × sqrt(footprint)`. The
 * second spelling is the obvious one and it is wrong by a constant: it produces a disc of
 * π·FRAME_R²·footprint = 0.69 × the intended area, so EVERY tier renders about 30% smaller
 * than its own band says, and the error is invisible because it is proportional — the
 * whole ladder shrinks together and still looks internally consistent.
 * Measured before the cure: a metropolis whose band asks for 58–72% of the frame covered
 * 17.9%. This is the class of defect that survives review precisely because nothing looks
 * out of place relative to anything else.
 */
export const FOOTPRINT_R = 564;      // = sqrt(1e6 / π), rounded to the unit

/** The leaf's own area, in view units. The denominator every footprint share is taken
 * against — named once so a share and a radius can never be compared against different
 * frames by accident. */
export const VIEW_AREA = 1000 * 1000;

/** Clamp. */
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

/**
 * ⭐⭐⭐ GAP-A · THE GRAIN DERIVATION (MF-S1 T-01/T-02, chair directive ODQ §209).
 *
 * ⛔ WHAT §5's TABLE SAID AND WHY IT IS REPLACED. The tier table carries BUILDING-COUNT
 * BANDS (150–400 town, 400–900 city, 900–1,600 metropolis). MF-S1 measured the reference
 * corpus and found them low BY AN ORDER OF MAGNITUDE: a town at 60 cells across with ~60%
 * block fill implies ≈2,200 parcels, not 150–400. The counts were never measured against
 * anything; the corpus's GRAIN was.
 *
 * ⭐⭐ THE UNIT IS CELLS ACROSS THE SETTLEMENT, NOT BUILDINGS ON THE LEAF, and that is the
 * whole correction. MF-S1: "the corpus makes tier legible at a glance chiefly by GRAIN, and
 * grain is cells across the settlement, not building size in absolute units." A thorp is ten
 * buildings wide and that is the whole of it; a metropolis is a hundred and thirteen.
 *
 * ⭐⭐⭐ AND THE CURVE IS CONTINUOUS IN POPULATION, WHICH IS WHAT DISSOLVES THE INVERSION.
 * MF-B6/B7's walk went town 26 → city 20 → metropolis 21 — it INVERTED at town→city and
 * flatlined above, the single most consequential failure on record. A per-tier CONSTANT can
 * always invert at a seam, because two neighbouring tiers' constants are chosen separately.
 * A MONOTONE FUNCTION OF POPULATION CANNOT: the walk is monotone by construction and no
 * tuning pass can make it otherwise. That is §161f's own law ("tiers are bands, never
 * steps") doing the work a hand-set table could not.
 *
 * THE BANDS ARE MEASURED [M] (MF-S1 §2.2 T-01, as corrected by the §244 fold), n in brackets:
 *   thorp 8–14 ⚠[UNVALIDATED-BY-INSTRUMENT] · hamlet 18–26 ⚠[UNVALIDATED-BY-INSTRUMENT] ·
 *   village 30–50 [5] · town 45–80 [8] · city 60–95 [5] · metropolis 80–120 [9]
 *
 * ⚠ THE ATLAS'S OWN EXPONENT (cells ≈ 5.7 × pop^0.27, R² 0.80) IS NOT USED AS THE
 * DERIVATION. Its `cells_across` values are [M] but its POPULATIONS are [E] eye estimates —
 * hybrid evidence — and MF-S1 says in terms that the BAND ENDPOINTS rest on measurement
 * alone and are the binding target. So the endpoints bind here and the curve interpolates
 * between them; the exponent is a cross-check, not a home.
 *
 * ⭐⭐ MF-W0 / G-33 · **THE METROPOLIS RUNG WAS STALE AND THIS TABLE WAS THE STALE COPY**
 * (conflict C-2, ODQ §262.3). It carried **100–130 on n=1** — hf34 measured on MF-S1's own
 * window — while the corrected ATLAS T-01 re-pinned it to **80–120 on n=9** (§244.5). The
 * generator was aiming at a superseded number. ⚠⚠ **THE RE-PIN MOVES THE METROPOLIS TARGET
 * *DOWN*, WHICH SHRINKS THE REPORTED MISS FOR A LEGITIMATE REASON**, and it moves the CITY
 * rung too because the city→metropolis SEAM is the mean of the two facing endpoints. Both are
 * declared as one-time shifts with this cause; neither is a tuning change.
 *
 * ⚠⚠ AND THE TWO LOW RUNGS ARE **UNVALIDATED-BY-INSTRUMENT, NOT WITHDRAWN** (conflict C-3, and
 * ODQ §257.3(b) ruled it). ATLAS T-01 ⛔ WITHDREW thorp (8–14) and hamlet (18–26) because **the
 * INSTRUMENT cannot measure at that tier — it counts hedges as buildings** — not because the
 * derivation is wrong; a generator must still produce something below village, and deleting
 * the rungs would leave `cells(pop)` undefined there while inventing replacements would be
 * tuning wearing measurement's clothes. ⭐ **THE RULE, and it is general: A WITHDRAWN GRADING
 * TARGET MAY REMAIN A GENERATION INPUT — it is simply not GRADED.** No verdict may be issued
 * against these two rungs, and `GRAIN_VALIDATED` below is what a grader must consult so that
 * "it generates" can never be mistaken for "it measures well". The roof-count instrument
 * restores validation when it exists.
 * @type {Readonly<Record<string, [number, number]>>}
 */
export const GRAIN_BAND = Object.freeze({
  thorp: [8, 14], hamlet: [18, 26], village: [30, 50],
  town: [45, 80], city: [60, 95], metropolis: [80, 120],
});

/**
 * ⭐ WHICH RUNGS MAY BE GRADED (C-3 / §257.3b). A rung marked `false` is a GENERATION input
 * with no measured target behind it; grading against it measures the instrument, not the
 * fabric. ⚠ A census that reads `GRAIN_BAND` without reading this is issuing a verdict the
 * atlas withdrew.
 * @type {Readonly<Record<string, boolean>>}
 */
export const GRAIN_VALIDATED = Object.freeze({
  thorp: false, hamlet: false, village: true, town: true, city: true, metropolis: true,
});

/**
 * ⭐ THE SEAM VALUES — the grain at each tier boundary, and the ONE construction that makes
 * the curve continuous while still binding to the measured endpoints.
 *
 * The bands do not meet: the thorp's ceiling is 14 and the hamlet's floor is 18. Reading
 * each tier's own endpoints literally would put a JUMP at every seam — a 60-soul thorp at 14
 * and a 61-soul hamlet at 18 — which is exactly the discontinuity §161f forbids ("a 5,000-soul
 * town and a 5,001-soul city wear near-identical frames"). The seam takes the MEAN of the two
 * bands' facing endpoints, so the curve is continuous, monotone, and never leaves the union
 * of the two bands it joins.
 * @type {ReadonlyArray<number>}
 */
export const GRAIN_SEAMS = Object.freeze((() => {
  const s = [GRAIN_BAND.thorp[0]];
  for (let i = 0; i + 1 < TIERS.length; i++) {
    s.push((GRAIN_BAND[TIERS[i]][1] + GRAIN_BAND[TIERS[i + 1]][0]) / 2);
  }
  s.push(GRAIN_BAND.metropolis[1]);
  return s;
})());

/**
 * THE DERIVED GRAIN: how many plot modules a reader crosses walking the settlement's width.
 * Continuous and strictly increasing in population; equal to the band floor at the very
 * bottom of the ladder and the band ceiling at the very top.
 * @param {number} population @param {string} [tier] the EXTENT tier (defaults to derived)
 * @returns {number}
 */
export function grainCellsAcross(population, tier) {
  const t = tier && TIER_PROFILE[tier] ? tier : tierForPopulation(population);
  const i = TIERS.indexOf(t);
  const lo = GRAIN_SEAMS[i], hi = GRAIN_SEAMS[i + 1];
  return lo + (hi - lo) * bandPosition(population, t);
}

/**
 * ⭐⭐ THE ROOF COUNT FALLS OUT OF THE GRAIN — the direction of derivation §5's amendment
 * asks for ("replace the count bands with a grain derivation and let parcel count fall out
 * of grain × footprint area").
 *
 * THE ARITHMETIC, stated so it can be checked rather than trusted. A scan across the
 * settlement crosses `cells` modules. Each module is one plot frontage `f`; each plot covers
 * `f² × depthRatio` of ground; the settlement's built ground is `fill` of a disc of radius R.
 *   cells = 2R·fill / f          (the scan crosses built ground only)
 *   N     = fill·πR² / (f²·dr)
 * Eliminating both R and f — and they DO both cancel, which is why this is a derivation and
 * not a fit — gives
 *   N = π · cells² / (4 · fill · dr)
 * ⭐ THE CHECK MF-S1 ITSELF SUPPLIES: a town at 60 cells and ~60% fill returns 2,176. The
 * atlas, reasoning independently, wrote "≈2,200 parcels". The derivation reproduces the
 * atlas's own arithmetic to within 1%.
 *
 * `fill` is the tier's own BUILD_OUT target — the share of a block that is building — which
 * is already the measured quantity this fabric aims at and is within a few points of the
 * corpus's `dense_share_in_core` at every tier. One home, not two.
 * @param {number} cells @param {string} tier @returns {number}
 */
export function grainRoofs(cells, tier) {
  const rung = BUILD_OUT[tier] || BUILD_OUT.town;
  const n = (3.141592653589793 * cells * cells) / (4 * rung.target * plotDepthRatio(tier));
  return Math.max(150, Math.round(n));
}

/** The tier a population falls in — the local spelling of the landed popToTier, kept
 * here so the fabric layer can compare a STORED tier against a DERIVED one without
 * importing a generation-side module into a render-time projection.
 * @param {number} population @returns {string} */
export function tierForPopulation(population) {
  const p = Number.isFinite(population) ? Number(population) : 0;
  for (const t of TIERS) {
    const prof = TIER_PROFILE[t];
    if (p <= prof.pop[1]) return t;
  }
  return 'metropolis';
}

/**
 * WHERE IN ITS BAND a population sits, 0..1. This is §161f's whole mechanism: every
 * continuous quantity below is `lo + (hi − lo) × bandPosition`. The position is taken on
 * a SQUARE-ROOT scale because population bands are geometric (a town spans 900→8,000)
 * and a linear read would leave four fifths of every band crowded at the bottom.
 * @param {number} population @param {string} tier @returns {number}
 */
export function bandPosition(population, tier) {
  const prof = TIER_PROFILE[tier] || TIER_PROFILE.village;
  const [lo, hi] = prof.pop;
  const p = clamp(Number.isFinite(population) ? Number(population) : lo, lo, hi);
  if (hi <= lo) return 0;
  return clamp(Math.sqrt((p - lo) / (hi - lo)), 0, 1);
}

/** Interpolate a tier's [lo, hi] column at this population. @returns {number} */
export function gradeBand(column, population, tier) {
  const prof = TIER_PROFILE[tier] || TIER_PROFILE.village;
  const band = prof[column];
  if (!Array.isArray(band)) return band;
  const t = bandPosition(population, tier);
  return band[0] + (band[1] - band[0]) * t;
}

/**
 * @typedef {Object} HighWater
 * @property {number} population   the historical maximum this deriver can SEE
 * @property {string} tier         the tier that population implies
 * @property {string} window       what the deriver could actually look at — DECLARED
 * @property {boolean} demoted     is the settlement below its own high water?
 * @property {number} deficit      0..1, how much of its extent is no longer occupied
 * @property {string[]} evidence
 */

/**
 * THE HIGH-WATER DERIVER — and its declared window.
 *
 * Sources, in the order they are trusted:
 *   1. `settlement.tier` vs `popToTier(population)` — a DISAGREEMENT is a recorded
 *      demotion, available on every settlement, needing no history at all.
 *   2. `populationHistory[].population` — a real maximum, but only over the last ELEVEN
 *      entries. The window is stated in the result so no consumer can mistake it for
 *      the settlement's whole life.
 *   3. dated loss records (`calamityHistory` exodus stamps) — each one is population
 *      that WAS here, so the pre-loss level is recoverable by addition.
 *
 * ⚠ The result UNDERSTATES rather than invents. Where the window cannot reach the true
 * peak, the deficit is smaller than the truth and the ruin ring renders smaller — never
 * a peak asserted from nothing.
 * @param {any} settlement @returns {HighWater}
 */
export function deriveHighWater(settlement) {
  const s = settlement || {};
  const current = Number.isFinite(s.population) ? Number(s.population) : 0;
  const derivedTier = tierForPopulation(current);
  /** @type {string[]} */ const evidence = [];
  let peak = current;
  /** @type {string[]} */ const windows = [];

  // 1 — the stored tier disagreeing with the derived one.
  const storedTier = typeof s.tier === 'string' && TIER_PROFILE[s.tier] ? s.tier : null;
  if (storedTier && TIERS.indexOf(storedTier) > TIERS.indexOf(derivedTier)) {
    const floor = TIER_PROFILE[storedTier].pop[0];
    if (floor > peak) peak = floor;
    evidence.push(`stored tier '${storedTier}' over a ${derivedTier}-scale population — a recorded demotion`);
    windows.push('tier/population disagreement (no history needed)');
  }

  // 2 — the population-history ring, whatever it can still see.
  const history = Array.isArray(s.populationHistory) ? s.populationHistory : [];
  if (history.length) {
    let seen = 0;
    for (const h of history) if (Number.isFinite(h && h.population) && Number(h.population) > seen) seen = Number(h.population);
    if (seen > peak) {
      peak = seen;
      evidence.push(`populationHistory maximum ${seen}`);
    }
    windows.push(`populationHistory: the last ${history.length} recorded changes ONLY (the ring caps at 11 — an older peak is invisible here)`);
  } else {
    windows.push('populationHistory: absent');
  }

  // 3 — dated losses. Each exodus is population that used to be present.
  const calamity = Array.isArray(s.calamityHistory) ? s.calamityHistory : [];
  if (calamity.length) {
    let lost = 0;
    for (const c of calamity) if (Number.isFinite(c && c.exodus)) lost += Number(c.exodus);
    if (lost > 0 && current + lost > peak) {
      peak = current + lost;
      evidence.push(`${calamity.length} dated loss record(s) totalling ${lost} souls`);
    }
    windows.push(`calamityHistory: ${calamity.length} dated loss record(s)`);
  }

  const peakTier = tierForPopulation(peak);
  const deficit = peak > 0 ? clamp(1 - current / peak, 0, 1) : 0;
  return {
    population: peak,
    tier: peakTier,
    window: windows.join('; '),
    demoted: deficit > 0.08,
    deficit,
    evidence,
  };
}

/**
 * @typedef {Object} TierScale
 * @property {string} tier            the OCCUPANCY tier (current population)
 * @property {string} extentTier      the EXTENT tier (high water)
 * @property {number} footprint       share of the frame the BUILT EXTENT covers
 * @property {number} builtRadius     the extent's effective radius, view units
 * @property {number|null} plotModule the FIXED drawn module at a census tier, else null
 * @property {string} extentSource    which of the two derivations produced the extent
 * @property {[number, number]} organismBand
 * @property {number} maxNuclei
 * @property {number} monumentalBudget
 * @property {number} accentBand
 * @property {number} blockDepth
 * @property {boolean} census1to1
 * @property {boolean} wardLabels
 * @property {string} squareKind
 * @property {number} roofs           drawn roofs (occupancy)
 * @property {number} households      the true household count (occupancy)
 * @property {boolean} representative
 * @property {number} representationRatio
 * @property {HighWater} highWater
 */

/**
 * The whole tier reading for one settlement — extent from the high water, life from the
 * present. This is the ONE place the two are separated, so nothing downstream can
 * accidentally size a street web to a shrunken population.
 * @param {any} settlement @returns {TierScale}
 */
export function tierScale(settlement) {
  const current = Number.isFinite(settlement?.population) ? Number(settlement.population) : 0;
  const highWater = deriveHighWater(settlement);
  const occupancyTier = typeof settlement?.tier === 'string' && TIER_PROFILE[settlement.tier]
    ? tierForPopulation(current)                         // occupancy always follows souls
    : tierForPopulation(current);
  const extentTier = highWater.tier;
  const prof = TIER_PROFILE[extentTier] || TIER_PROFILE.village;

  // OCCUPANCY: roofs from the CURRENT population.
  const households = Math.max(1, Math.round(current / AVG_HOUSEHOLD));
  const occProf = TIER_PROFILE[occupancyTier] || TIER_PROFILE.village;
  // At and below village the fabric is 1:1 with the household count (the §5 truth
  // claim, now derived rather than asserted). Above it the map renders REPRESENTATIVE
  // density and the ratio is PRINTED in the always-on cartouche — the map shows fabric,
  // the dossier shows the number.
  // ⭐⭐⭐ GAP-A: ABOVE VILLAGE THE ROOF COUNT IS THE GRAIN'S CONSEQUENCE. The old spelling
  // was `220 + 640·bandPosition + (tierIndex−3)·260` — three chosen numbers with no
  // measurement behind any of them, and MF-S1 measured the result at ×2.4–×5.4 short of the
  // corpus at every tier and INVERTING at town→city. Nothing here is chosen: the grain comes
  // from the measured bands and the count comes from the grain.
  // ⚠ AT THE CENSUS TIERS THE ROOF COUNT IS A TRUTH CLAIM AND THE GRAIN MAY NOT TOUCH IT.
  // §5 says the fabric IS the housing census at village and below; deriving roofs from grain
  // there would make the map disagree with the dossier to make a band. The grain is carried
  // at those tiers by the DRAWN PLOT SERIES instead — hf3's garden strips with their tenure
  // lines, hf10's fenced tofts — which is T-08's structure and costs no invented household.
  const cellsAcross = grainCellsAcross(current, occupancyTier);
  const roofs = occProf.census1to1
    ? Math.max(MIN_LEGIBLE_ROOFS, households)
    : grainRoofs(cellsAcross, occupancyTier);

  // ── EXTENT ────────────────────────────────────────────────────────────────────
  // ⭐⭐ TWO DERIVATIONS, AND WHICH ONE RUNS IS DECIDED BY WHICH CLAIM THE TIER MAKES
  // (§181.2b — see the PLOT_MODULE block above for the full argument).
  const module = PLOT_MODULE[extentTier];
  /** @type {string} */ let extentSource;
  let builtRadius;
  let footprint;
  if (prof.census1to1 && module) {
    // ⭐ THE ROOFS LEAD. The extent is the ground this settlement's own households need,
    // at the drawn module, at the packing the fabric actually achieves.
    //
    // ⚠ THE ROOF COUNT USED HERE IS THE HIGH WATER'S, NOT TODAY'S — otherwise the
    // high-water law would be silently repealed at exactly the tiers where a demotion is
    // most visible. A hamlet that was a village keeps the village's streets and shows the
    // village's empty plots; the deficit renders per §161g and does NOT shrink the ground.
    const extentHouseholds = Math.max(1, Math.round(highWater.population / AVG_HOUSEHOLD));
    const extentRoofs = Math.max(MIN_LEGIBLE_ROOFS, extentHouseholds);
    const plotCell = module * module * plotDepthRatio(extentTier);
    const builtArea = (extentRoofs * plotCell) / (PLOT_PACKING[extentTier] || 0.30);
    builtRadius = Math.min(FRAME_R * 0.94, Math.sqrt(builtArea / 3.141592653589793));
    // The footprint is now a RESULT that gets REPORTED, never an input. Where it lands
    // relative to §5's band is a checkable claim about the reconciliation, which is what
    // the pin in townMapFabricBuildOut.test.js asserts.
    footprint = (builtRadius * builtRadius * 3.141592653589793) / (VIEW_AREA);
    extentSource = `1:1 — ${extentRoofs} roofs × ${module}u module ÷ packing ${PLOT_PACKING}`;
  } else {
    // REPRESENTATIVE TIERS: §5's area share leads, graded on the HIGH-WATER population
    // inside the HIGH-WATER tier's band. The disc is clamped so the settlement never
    // reaches the leaf's edge — the countryside must run past it (§2.2's dressed ground).
    footprint = gradeBand('footprint', highWater.population, extentTier);
    builtRadius = Math.min(FRAME_R * 0.94, FOOTPRINT_R * Math.sqrt(footprint));
    extentSource = `§5 area share ${(footprint * 100).toFixed(1)}% (representative density)`;
  }

  return {
    tier: occupancyTier,
    extentTier,
    footprint,
    builtRadius,
    plotModule: module || null,
    extentSource,
    organismBand: [
      Math.round(gradeBand('organisms', highWater.population, extentTier)),
      prof.organisms[1],
    ],
    maxNuclei: prof.nuclei,
    monumentalBudget: prof.monumental,
    accentBand: occProf.accentBand,
    blockDepth: prof.blockDepth,
    census1to1: occProf.census1to1,
    wardLabels: occProf.wardLabels,
    squareKind: prof.square,
    roofs,
    households,
    // ⭐ T-01/T-02 THE DERIVED GRAIN, carried out so the packer can bind its module to it,
    // the cartouche can print it and the census can grade it against GRAIN_BAND.
    cellsAcross,
    grainBand: GRAIN_BAND[occupancyTier] || GRAIN_BAND.town,
    grainReason: `${occProf.census1to1 ? 'census tier: roofs are the household count and the grain rides the drawn plot series'
      : `grain ${cellsAcross.toFixed(1)} cells across → ${roofs} roofs at fill ${BUILD_OUT[occupancyTier].target}`}`
      + ` (band ${(GRAIN_BAND[occupancyTier] || GRAIN_BAND.town).join('–')}, T-01)`,
    representative: !occProf.census1to1,
    representationRatio: occProf.census1to1 ? 1 : households / Math.max(1, roofs),
    highWater,
  };
}
