/**
 * townCartography/cartographyTuning.js — TOWN_CARTOGRAPHY_TUNING (TC-2).
 *
 * The authored data table behind the skeleton synthesis, shaped like
 * SETTLEMENT_LIFECYCLE_TUNING: one frozen object, every number named, every band
 * keyed by the canonical tier vocabulary. Taste iterates HERE, not in the
 * algorithms (DESIGN_TOWN_CARTOGRAPHY §4/§10 — "flavor logic is authored tables").
 *
 * ── THE ITERATION CAPS ARE A CONTRACT, NOT A SAFETY NET (design §7) ───────────
 * Space colonization and footprint packing are the two known rabbit holes in this
 * genre. Every loop in the skeleton stages is bounded by a number in this file,
 * and `maximumSynthesisWork(tier)` composes those numbers into ONE declared
 * worst-case step budget that a test asserts against the measured `work` receipt
 * of the LARGEST LEGAL TOWN. A cap that is merely "big enough in practice" is a
 * safety net; a cap whose total is an asserted number is a contract, and this is
 * the second kind.
 *
 * ── WHY NO STYLE KNOB (A-10, binding) ────────────────────────────────────────
 * There is deliberately no "chaos" or "organic-ness" dial here. Order and chaos
 * are DERIVED from the settlement's own governance/economy state by
 * cartographyMorphology.js; this table only says how far the derived reading is
 * allowed to move the geometry. A knob would let two settlements with identical
 * governance draw differently, which is precisely the coherence A-10 forbids.
 *
 * ZERO IMPORTS BY DESIGN: a tuning table that pulls in a module can never be the
 * leaf that a lazy chunk safely imports (the lowDiscrepancy.js precedent).
 *
 * @enforced-by tests/domain/townCartographySkeleton.test.js
 */

/**
 * The canonical tier ladder, lowest first. Re-declared rather than imported from
 * data/constants.js for the same first-paint reason lowDiscrepancy.js states: this
 * leaf must stay import-free so a lazy cartography chunk can never re-parent an
 * eager closure through it. The six names are frozen product vocabulary.
 * @type {ReadonlyArray<string>}
 */
export const CARTOGRAPHY_TIERS = Object.freeze([
  'thorp', 'hamlet', 'village', 'town', 'city', 'metropolis',
]);

/** The LARGEST LEGAL TOWN: the tier every cap is asserted against. */
export const LARGEST_LEGAL_TIER = CARTOGRAPHY_TIERS[CARTOGRAPHY_TIERS.length - 1];

/**
 * Tier index, clamped into the ladder. An unknown tier reads as 'village' rather
 * than throwing: a remnant grade or a custom label must still draw a map, and the
 * middle of the ladder is the honest default for an unrecognized settlement.
 * @param {unknown} tier
 * @returns {number}
 */
export function cartographyTierIndex(tier) {
  const index = CARTOGRAPHY_TIERS.indexOf(String(tier || '').toLowerCase());
  return index >= 0 ? index : CARTOGRAPHY_TIERS.indexOf('village');
}

/**
 * ── THE DECLARED HEADROOM (BAND 21, owner-signed 2026-08-23) ─────────────────
 *
 * How much room above the MEASURED WORST CASE a settlement's map is allowed. One
 * number, declared once, driving every cap that has to admit real generator output.
 *
 * It exists because the alternative was measured and found to be the defect. The
 * three caps below used to be three hand-authored tables, each calibrated against a
 * twenty-row synthetic fixture whose institution counts were written down as
 * constants — so no row could exceed a cap, every cap looked green, and 287 of the
 * 504 real settlements in tests/fixtures/cartographyCalibrationCorpus.js could not
 * draw a map at all. Re-authoring three numbers to fit that corpus would have
 * inherited exactly the luck that produced the originals; deriving them from it
 * behind ONE declared parameter does not.
 *
 * ── THE VALUE IS MEASURED, AND THE CRITERION IS STATED ───────────────────────
 * THE RULE: the headroom is at least the largest factor by which a demonstrably
 * SMALLER version of this same corpus under-measures its own maximum. That is the
 * one thing the corpus can honestly say about how far short of a true ceiling it
 * might fall, and it is exactly the lesson of the two earlier samples that disagreed
 * in both directions — a sampled maximum is not a ceiling.
 *
 * MEASURED over the 504-row corpus: each of the twelve seed slices is a corpus of the
 * same shape and one twelfth the size, and the worst of them under-measures its
 * tier's maximum by a factor of 1.6000 (`hamlet`: one seed's slice reads 15 canonical
 * institutions where the whole corpus reads 24). The other five tiers read 1.3750,
 * 1.4138, 1.2400, 1.1702 and 1.1667, and the per-row byte figure moves far less
 * (worst 1.0658). So 1600 permille, which is that number to the permille.
 *
 * ⚠ AND THE CORPUS IS NOT CONVERGED, which is why the rule is a floor and not a
 * decoration: the twelve-seed growth curve was still RISING at the eleventh seed
 * (`metropolis` 59 → 63), and deleting any single seed costs up to 8.33% of a tier's
 * maximum (`hamlet` 24 → 22). Three tiers reach their maximum on exactly one seed.
 * `tests/domain/townCartographyCalibration.test.js` W6 re-measures the ratio from the
 * manifest on every run and reds if this number ever falls below it.
 *
 * Permille, matching DWELLING_HEIGHT_PERMILLE and FOOTPRINT_SHRINK_PERMILLE.
 */
export const CARTOGRAPHY_HEADROOM_PERMILLE = 1600;

/**
 * THE CALIBRATION GROUND — the measured worst cases the caps are DERIVED FROM.
 *
 * Every number here is a reading of what the REAL pipeline produces over the 504-row
 * calibration corpus, never a target and never a taste choice. They are frozen in
 * source so the derivation is a pure function a reader can evaluate by hand, and the
 * calibration suite re-measures them against the corpus manifest on every run: a
 * generator that starts producing more than one of these reds rather than silently
 * outgrowing the caps derived from it.
 *
 * @see tests/domain/townCartographyCalibration.test.js — the suite that owns them
 */
export const CARTOGRAPHY_CALIBRATION = Object.freeze({
  /** The largest canonical institution roster the pipeline produced, per tier. */
  MAX_INSTITUTIONS: Object.freeze({
    thorp: 12, hamlet: 25, village: 41, town: 63, city: 56, metropolis: 65,
  }),
  /**
   * The largest UTF-8 bytes-per-emitted-row the TC-4 layer produced, over every tier.
   * This is the number the old authored `TC4_ROW_BYTES_BAND: 400` guessed at — it was
   * calibrated "against a measured worst case of 374 B/row at THORP", the smallest
   * tier's fixture, and the real rows run larger, which is why four tiers overran
   * their byte band by one to three percent with the count caps removed entirely.
   *
   * 450 is the whole corpus's worst row, and it falls at THORP — the tier whose block
   * carries the fewest rows to amortize the serializer's wrapper over. The per-tier
   * readings are 450 / 440 / 438 / 412 / 412 / 402, so the spread across the ladder is
   * twelve percent and one scalar is the honest shape for it.
   *
   * IT MOVED 443 -> 450 AT CG-2, and the cause is stated rather than absorbed: a
   * dressed footprint may be a CORNER-TRUNCATED cell, which is a quadrilateral, and a
   * fourth plan point costs a row about seven bytes. Every tier moved UP by four to
   * ten bytes and none moved down, which is exactly the signature a fourth vertex on
   * roughly two rows in three should leave. The derived band rises with it
   * (ceil(450 x 1.6) = 720 from 709), which only ever loosens a ceiling.
   */
  MAX_BUILDING_ROW_BYTES: 448,
  /** The corpus this was read from. A row count that moves invalidates the reading. */
  CORPUS_ROWS: 504,
});

/**
 * THE DWELLING TARGET, hoisted out of the tuning table because the building cap is
 * derived FROM it. Authored INTENT — how many dwellings a tier's map wants to draw —
 * and deliberately NOT headroomed: the headroom above belongs to measured worst
 * cases, and multiplying an intent by a safety factor is a category error.
 * @type {Readonly<Record<string, number>>}
 */
const DWELLING_TARGET = Object.freeze({
  thorp: 8, hamlet: 16, village: 32, town: 64, city: 120, metropolis: 160,
});

/**
 * DERIVE THE THREE COUPLED CAPS from one calibration and one headroom.
 *
 * Pure, total over CARTOGRAPHY_TIERS, and exported so a test can drive it with a
 * hypothetical calibration instead of only reading the one table below — which is
 * what makes this machinery rather than three re-authored literals.
 *
 * THE INVARIANT IS STRUCTURAL, NOT ASSERTED. Every bound institution draws a
 * FLAGSHIP, and cartographyBuildings.js exempts flagships from the total cap (a
 * canonical institution always appears, or the map forks from the dossier). A
 * binding cap above the building cap therefore promises more flagships than the
 * layer may emit and blows the derived byte budget by construction. Adding a
 * positive dwelling target to the binding cap makes `bindings <= buildings` true by
 * arithmetic; no value of the calibration or the headroom can violate it.
 *
 * @param {{ MAX_INSTITUTIONS: Readonly<Record<string, number>>,
 *   MAX_BUILDING_ROW_BYTES: number }} calibration the measured worst cases
 * @param {number} headroomPermille the declared room above them
 * @returns {Readonly<{ bindings: Readonly<Record<string, number>>,
 *   buildings: Readonly<Record<string, number>>, rowBytes: number }>}
 */
export function deriveCartographyCaps(calibration, headroomPermille) {
  /** @param {number} measured @returns {number} */
  const withHeadroom = (measured) => Math.ceil((measured * headroomPermille) / 1000);
  /** @type {Record<string, number>} */
  const bindings = {};
  /** @type {Record<string, number>} */
  const buildings = {};
  for (const tier of CARTOGRAPHY_TIERS) {
    bindings[tier] = withHeadroom(calibration.MAX_INSTITUTIONS[tier]);
    buildings[tier] = bindings[tier] + DWELLING_TARGET[tier];
  }
  return Object.freeze({
    bindings: Object.freeze(bindings),
    buildings: Object.freeze(buildings),
    rowBytes: withHeadroom(calibration.MAX_BUILDING_ROW_BYTES),
  });
}

/** The caps in force: the derivation above, evaluated once at the declared inputs. */
const DERIVED_CAPS = deriveCartographyCaps(
  CARTOGRAPHY_CALIBRATION, CARTOGRAPHY_HEADROOM_PERMILLE,
);

export const TOWN_CARTOGRAPHY_TUNING = Object.freeze({
  // ── A-10 LAYER 1: STATE DECIDES ORDER VS CHAOS ──────────────────────────────
  // The weights the morphology reading composes. Each is signed against a term
  // centred on 0.5, so a settlement with no evidence at all reads exactly 0.5 and
  // draws the neutral organic town. ABSENCE IS NOT NEUTRALITY at the SOURCE (a
  // dark fabric layer contributes no term rather than a 0.5 term) but a settlement
  // with zero evidence legitimately has no opinion, which is a different claim.
  MORPHOLOGY: Object.freeze({
    LEGITIMACY_WEIGHT: 0.30,
    CONCENTRATION_WEIGHT: 0.20,
    CORRUPTION_WEIGHT: 0.30,
    UNREST_WEIGHT: 0.20,
    FABRIC_DRIFT_WEIGHT: 0.25,
    // A-10 LAYER 4: grid cores ONLY where a planned era earns them.
    PLANNING_ORDER_WEIGHT: 3,
    PLANNING_TIER_WEIGHT: 2,
    PLANNING_FABRIC_WEIGHT: 2,
    PLANNING_AGE_WEIGHT: 2,
    // Ticks of recorded age at which the age term saturates (about four decades of
    // weekly ticks). Only counted when settlement.age is a finite number.
    PLANNING_AGE_SATURATION: 2080,
    GRID_CORE_PLANNING_FLOOR: 0.62,
    GRID_CORE_TIER_INDEX: 3,
    // LAW IS A GATE, NOT A TERM. Planning maturity is a weighted mean, so age,
    // size and accumulated fabric can outvote order entirely: a maximally lawless
    // metropolis that is old and heavily built scored 0.667 planning maturity with
    // order01 at ZERO, and earned a planned grid core. A-10 layer 4 says a grid
    // core exists only where a PLANNED ERA earned it, and there is no planned era
    // without law, so order carries its own floor on top of the mean.
    GRID_CORE_ORDER_FLOOR: 0.55,
    // A-8 placement vocabulary thresholds. TC-3 owns the CONSUMPTION; the
    // derivation lives here so there is exactly one writer of the vocabulary.
    PLACEMENT_ORDER_FLOOR: 0.68,
    PLACEMENT_ORDER_MIDDLE: 0.42,
    PLACEMENT_CONCENTRATION_FLOOR: 0.5,
  }),

  // ── THE WALLED BAND (design §4.2: "walls at tier >= the walled band") ────────
  // A town is the first tier that fortifies. Below it a settlement is open ground
  // with a road through it; at and above it the wall is the Lynch EDGE the whole
  // skeleton reads against.
  WALLED_TIER_INDEX: 3,

  // ── FIELD STAGE ─────────────────────────────────────────────────────────────
  // How many raster cells the field samples for its candidate sets. The terrain
  // grid is 33x33 = 1089 cells; these are Weyl subsets of it, never strides.
  FIELD_CORE_CANDIDATES: 64,
  FIELD_ATTRACTOR_CANDIDATES: Object.freeze({
    thorp: 24, hamlet: 32, village: 48, town: 96, city: 160, metropolis: 220,
  }),
  // Slope cost per height-unit of local relief, and the flat cost of a land cell.
  FIELD_BASE_COST: 10,
  FIELD_SLOPE_COST: 6,
  // A cell within this many plan units of open water is water-adjacent: costly to
  // build on, and the reason a waterfront street runs ALONG the bank not into it.
  FIELD_WATER_MARGIN_PLAN: 26,
  FIELD_WATER_COST: 400,
  // Segment ceilings for the two boundary-condition polyline families. Capping
  // them is what makes the field's per-cell work a KNOWN number rather than a
  // function of however many vertices a river happened to be drawn with; the cap
  // is applied through the Weyl sampler so a meandering reach is thinned evenly
  // instead of having whole bends dropped in a repeating pattern.
  FIELD_WATER_SEGMENTS: 32,
  FIELD_ROAD_SEGMENTS: 48,
  // A cell within this many plan units of an approach road is already served, so
  // the field discounts it: routes ARE boundary conditions (design §4.1).
  FIELD_ROAD_MARGIN_PLAN: 40,
  FIELD_ROAD_DISCOUNT: 6,

  // ── ARTERIAL GROWTH (design §4.2) ───────────────────────────────────────────
  ARTERIAL_SEEDS: Object.freeze({
    thorp: 2, hamlet: 2, village: 3, town: 4, city: 5, metropolis: 6,
  }),
  // One growth step in plan units, and the hard step cap per arterial. 72 steps of
  // 24 units is 1728 plan units of travel: more than the 1414-unit plan diagonal,
  // so the cap can never truncate a legitimate arterial, only a runaway one.
  ARTERIAL_STEP_PLAN: 24,
  ARTERIAL_STEPS: 72,
  // Street widths in plan units. TC-1's CartographyStreet record requires a
  // positive integer widthPlan, and an arterial that draws the same width as a
  // back lane fails the Lynch reading before it fails any test: a path hierarchy
  // the eye cannot see is not a path hierarchy.
  ARTERIAL_WIDTH_PLAN: Object.freeze({
    thorp: 7, hamlet: 8, village: 9, town: 11, city: 13, metropolis: 16,
  }),
  LANE_WIDTH_PLAN: Object.freeze({
    thorp: 4, hamlet: 4, village: 5, town: 5, city: 6, metropolis: 7,
  }),
  // Arrival: growth stops once the head is inside this radius of the core node.
  ARTERIAL_ARRIVAL_PLAN: 30,
  // How hard the derived order01 reading straightens an arterial. At order01 = 1
  // the head aims purely at the core (the planned era); at order01 = 0 the local
  // contour grain and the seeded wander own the step (the organic era).
  ARTERIAL_GRAIN_WEIGHT: 0.62,
  // Seeded lateral wander, in plan units, at order01 = 0. Scaled by (1 - order01).
  ARTERIAL_WANDER_PLAN: 11,

  // ── LANE INFILL (space colonization, design §4.2) ────────────────────────────
  LANE_ITERATIONS: 24,
  LANE_NODES: Object.freeze({
    thorp: 10, hamlet: 16, village: 28, town: 72, city: 160, metropolis: 260,
  }),
  LANE_STEP_PLAN: 17,
  // Space colonization seeds from the arterials, but NOT from every vertex: an
  // arterial carries a vertex every ARTERIAL_STEP_PLAN units, so seeding from all
  // of them blankets the plan, retires most attractors on iteration zero, and the
  // infill never happens. The seed set is this fraction of the node budget, taken
  // through the Weyl sampler so the seeds are spread along each arterial rather
  // than bunched at whichever end the array starts.
  LANE_SEED_SHARE_DENOMINATOR: 4,
  // An attractor closer than this to any lane node is satisfied and retires.
  LANE_KILL_PLAN: 26,
  // An attractor further than this from every node cannot pull yet.
  LANE_INFLUENCE_PLAN: 150,
  LANE_WANDER_PLAN: 7,
  // A-10 LAYER 4: the grid core. Inside this radius of the core node, and ONLY
  // when the morphology reading says a planned era earned it, lane steps snap to
  // the settlement's own grain axes instead of wandering.
  GRID_CORE_RADIUS_PLAN: 170,

  // ── WALLS, GATES, BRIDGES (design §4.2) ─────────────────────────────────────
  // The wall ring is the built envelope's hull pushed outward by this margin.
  WALL_MARGIN_PLAN: 46,
  WALL_VERTICES: 24,
  // A gate exists only where an arterial crosses the ring, capped.
  MAX_GATES: 8,
  // A bridge exists only where a street crosses open water, capped.
  MAX_BRIDGES: 6,
  // A TC-2 defense candidate may bind to an infrastructure record the base
  // TownSceneManifest already owns only inside this plan-space radius. The
  // candidate never crosses the manifest contract itself: it is a geometric
  // witness that selects the one canonical gate/bridge id, not a second fact.
  INFRASTRUCTURE_BINDING_PLAN: 48,

  // ── BYTE BUDGET (A-3: measured at TC-2, ratchet-pinned) ─────────────────────
  // The per-tier UTF-8 ceiling for the streets layer alone, against the live
  // TOWN_SCENE_COMPILE_INPUT_MAX_BYTES cap. Metropolis fits by band, never by
  // raising the manifest cap.
  STREETS_LAYER_MAX_BYTES: Object.freeze({
    thorp: 6000, hamlet: 8000, village: 12000, town: 28000, city: 56000, metropolis: 90000,
  }),

  // ── TC-3a WARDS (design §3, A-5) ─────────────────────────────────────────────
  // A ward is a district drawn in ink, so the ward cap is a cap on the CANONICAL
  // district count this stage is willing to lower. Exceeding it is a premise error
  // rather than a truncation: silently dropping a canonical district would make the
  // map disagree with the dossier, which is the exact fork the ONE LAW forbids.
  MAXIMUM_WARDS: Object.freeze({
    thorp: 8, hamlet: 10, village: 12, town: 16, city: 24, metropolis: 48,
  }),
  // The lowering copies a district footprint verbatim, so this is a cap on the
  // SOURCE polygon, not a simplification target.
  MAXIMUM_WARD_VERTICES: 8,

  // ── TC-3b PARCELS (design §3, A-8) ───────────────────────────────────────────
  // THREE IS A LOAD-BEARING NUMBER, not a taste knob. A convex ward, its own
  // centroid, and each edge cut into exactly this many integer segments give a
  // triangle fan that is contained and non-overlapping BY CONSTRUCTION. A fourth
  // division would need the general polygon clipping this program does not own, so
  // raising it is a STOP rather than a tuning choice.
  PARCEL_EDGE_DIVISIONS: 3,
  // How many of the ward's bounded candidate fan the tier actually keeps. The fan
  // is always larger than the take, which is what makes the A-8 placement ordering
  // a real selection rather than a relabelling of the whole fan.
  PARCELS_PER_WARD: Object.freeze({
    thorp: 2, hamlet: 3, village: 4, town: 6, city: 8, metropolis: 12,
  }),
  // The binding is a synthesis-local receipt for TC-4, and this caps how many of
  // them one town may emit. Exceeding it is a premise error for the same reason the
  // ward cap is: a silently dropped institution would make the map disagree with
  // the dossier.
  // DERIVED — ceil(the measured worst-case institution roster x the declared
  // headroom). Never re-authored by hand: a tier that outgrows it is a reading that
  // moved, and the reading lives in CARTOGRAPHY_CALIBRATION above.
  MAXIMUM_INSTITUTION_BINDINGS: DERIVED_CAPS.bindings,
  // A-8 PROMINENCE, in plan-space AREA of the canonical building footprint. A large
  // institution may choose only from the ward's largest third, a medium one from
  // the largest two thirds, and anything smaller from all of them.
  INSTITUTION_PROMINENCE_AREA_PLAN2: Object.freeze({ medium: 150, large: 400 }),
  // ── BYTE BUDGET (A-3: measured, ratchet-pinned) ──────────────────────────────
  // The per-tier UTF-8 ceiling for the TC-3 layers together — the street NAMES, the
  // wards and the parcels — against the live TOWN_SCENE_COMPILE_INPUT_MAX_BYTES cap.
  // Output over the band is a premise error; the band is never raised to fit it.
  TC3_LAYER_MAX_BYTES: Object.freeze({
    thorp: 8000, hamlet: 12000, village: 18000,
    town: 32000, city: 52000, metropolis: 80000,
  }),

  // ── TC-4 BUILDINGS (design §3, §4.5, A-8 §11b) ──────────────────────────────
  // A-8's multiplicity: the catalog range is a RANGE, and the settlement's own
  // population-within-tier and prosperity decide where inside it the canonical
  // count falls. v1 is presentation-canonical and engine-inert: a resolved count
  // never feeds economy, services or any other engine math.
  MULTIPLICITY: Object.freeze({
    POPULATION_WEIGHT: 0.6,
    PROSPERITY_WEIGHT: 0.4,
    JITTER_STEPS: 3,                      // stamp % 3 − 1  ->  −1 | 0 | +1 count steps
    // THE TOWNSCENE LADDER, RE-DECLARED (the CARTOGRAPHY_TIERS precedent). The
    // producer is buildingProfiles.js's UNEXPORTED PROSPERITY_RANK, so importing it
    // is impossible without exporting townScene internals; C2 asserts this table
    // equals its producer exact-set-both-ways instead, which is how the ward-kind
    // vocabulary is already guarded against drift.
    PROSPERITY_RANK: Object.freeze({
      subsistence: 0, struggling: 1, poor: 2, moderate: 3, modest: 3,
      comfortable: 4, prosperous: 5, wealthy: 6, opulent: 6,
    }),
    PROSPERITY_RANK_SPAN: 6,
    // POPULATION_RANGES, RE-DECLARED. Importing src/data/constants.js here would
    // drag a foreign payload into the bounded compiler closure (CR-TC3B-BYTES), so
    // the mirror is guarded by C2's producer-equality assertion rather than by an
    // import edge. Drift reds a test; it never silently re-bands a town.
    POPULATION_SPAN: Object.freeze({
      thorp: Object.freeze([8, 60]), hamlet: Object.freeze([61, 400]),
      village: Object.freeze([401, 900]), town: Object.freeze([901, 5000]),
      city: Object.freeze([5001, 25000]), metropolis: Object.freeze([25001, 100000]),
    }),
  }),
  // The per-parcel occupancy BAND for instances and dwellings — a density dial, not
  // a capacity theorem. It used to read "<= 4 ALWAYS", because the packer addressed
  // a parcel's ONE medial subdivision and a fifth building had nowhere to stand.
  // CG-2 replaced that slot index with a recursive medial ADDRESS (cartographyBuildings.js
  // §CELL ADDRESS), so the tree is unbounded and the four here is taste rather than
  // arithmetic. Flagships are exempt from this band and always were; what CG-2 changed
  // is that they now CONSUME a cell rather than silently re-using one.
  BUILDINGS_PER_PARCEL: Object.freeze({
    thorp: 1, hamlet: 2, village: 2, town: 3, city: 4, metropolis: 4,
  }),
  // DERIVED — the binding cap plus the tier's dwelling target. This is a TRUNCATION
  // cap on instances and dwellings (flagships are exempt), so it is the number that
  // decides how dense a drawn map is, and raising it changes drawn output.
  MAXIMUM_CARTOGRAPHY_BUILDINGS: DERIVED_CAPS.buildings,
  DWELLING_TARGET,
  DWELLING_HEIGHT_PERMILLE: Object.freeze({
    thorp: 100, hamlet: 120, village: 140, town: 180, city: 220, metropolis: 260,
  }),
  FOOTPRINT_SHRINK_PERMILLE: Object.freeze({ large: 660, medium: 540, small: 420, dwelling: 300 }),
  FOOTPRINT_SHRINK_STEP: 160,             // the fixed 3-entry ladder: p, p−160, p−320
  FOOTPRINT_SHRINK_FLOOR: 120,
  // ── CG-2: THE FORM VOCABULARY, AND WHY IT BANDS BY TIER ──────────────────────
  // The four medial subcells of a triangle are TRANSLATES of one another (subcells
  // 0,1,2) and a point reflection (subcell 3) — proved over 20,000 integer triangles,
  // 20,000 of 20,000. So before CG-2 the footprint vocabulary of one parcel was
  // exactly ONE triangle at four class scales, and 63.30% of all drawn buildings were
  // a translate of another building in the same settlement.
  //
  // A footprint is now DRESSED from typed facts the row already carries, exactly as
  // its height and its age already are: a size step and an optional truncated corner,
  // both read off one `sceneDigest` of (digest, subject, instance). This is dress, not
  // repair — no retry, no clipping, no positional jitter, and every emitted vertex is
  // still a convex combination of the cell's own vertices, so §6.3c's containment
  // theorem is untouched.
  //
  // THE BAND IS THE POINT. `PLAN_UNIT_CM_BY_TIER` makes a thorp's plan unit 10 cm and
  // a metropolis's 80 cm: a thorp's buildings are genuinely smaller AND genuinely less
  // varied, because a thorp is a dozen of the same cottage. So a thorp gets THREE
  // forms (three sizes of the same triangle, no cut) and a metropolis TWELVE (three
  // sizes x uncut-plus-three-truncations). Every value is a multiple of 3: the size
  // step is `variant % 3` and the cut slot is `floor(variant / 3)`, so a non-multiple
  // would silently starve one size of one cut.
  FOOTPRINT_FORM_VARIANTS: Object.freeze({
    thorp: 3, hamlet: 3, village: 6, town: 9, city: 12, metropolis: 12,
  }),
  // Permille of the class shrink per size step, applied as −1 | 0 | +1. 45 is set so
  // the three sizes of one class stay inside their own class band: the tightest gap
  // between adjacent FOOTPRINT_SHRINK_PERMILLE classes is 120 (540→420), so ±45 can
  // never carry a `medium` building past a `small` one and make prominence a lie.
  FOOTPRINT_FORM_SHRINK_STEP: 45,
  // The corner truncation, as a permille of each of the two edges meeting at the cut
  // corner. A third is the classic chamfer and is the largest cut that leaves the
  // remaining trapezoid unmistakably the same building rather than a new one.
  FOOTPRINT_CORNER_CUT_PERMILLE: 340,
  // How deep the medial ADDRESS tree may be read. Depth d holds 4^d cells, so five
  // depths address 1,364 buildings inside ONE parcel; the measured corpus worst case
  // is 29, so the ceiling exists to keep the descent a bounded `for` rather than to
  // bind anything real. An index past it packs no footprint — a dwelling is skipped
  // and an institution is NAMED, exactly as a degenerate parcel already is.
  FOOTPRINT_CELL_MAX_DEPTH: 5,
  HEIGHT_PLAN_CEILING: 60,                // buildingProfiles' heightPlan clamp maximum
  // The condition ladder's first-match thresholds. ORDER IS LOAD-BEARING in the
  // chain that reads them (§6.3e); these are the floors, not the order.
  CONDITION_THRESHOLDS: Object.freeze({
    RUINED_ABANDONMENT_FLOOR: 720, BURNED_WAR_FLOOR: 720, DAMAGED_WAR_FLOOR: 450,
    WORN_NEGLECT_FLOOR: 500, WORN_AGE_FLOOR: 700,
    PRISTINE_RENEWAL_FLOOR: 600, PRISTINE_NEGLECT_CEILING: 250,
  }),
  // ── BYTE BUDGET (A-3), DERIVED — CR-TC4-BAND-1 ───────────────────────────────
  // DELIBERATELY NOT a second per-tier table. A hand-authored byte table and the
  // count cap above are two independent numbers describing the SAME output, and the
  // first authoring of them contradicted itself: the city and metropolis byte bands
  // sat BELOW what their own count caps must produce, so no row at those tiers could
  // ever fit. The budget is therefore DERIVED — MAXIMUM_CARTOGRAPHY_BUILDINGS[tier]
  // times this — which makes band-versus-cap consistency definitional instead of a
  // pin somebody has to remember to write.
  //
  // AND SO IS THE PER-ROW BAND NOW. It used to be the one authored number here, set
  // to 400 against "a measured worst case of 374 B/row at thorp" — the smallest tier
  // of a synthetic fixture. Real rows at the middle tiers run larger, so four tiers
  // overran this budget by one to three percent even with the count caps removed
  // entirely: a second calibration hiding inside a derivation. It is now
  // ceil(the measured worst-case bytes-per-row x the declared headroom), so the
  // budget is derived end to end and still fires exactly when it should — per-row
  // bloat past everything the real corpus has ever produced, with the margin B21 set.
  TC4_ROW_BYTES_BAND: DERIVED_CAPS.rowBytes,
});

const T = TOWN_CARTOGRAPHY_TUNING;

/**
 * Read a per-tier band with a clamped tier. Every band in this file is total over
 * CARTOGRAPHY_TIERS, so this never falls through to a default.
 * @param {Readonly<Record<string, number>>} band
 * @param {unknown} tier
 * @returns {number}
 */
export function cartographyBand(band, tier) {
  return band[CARTOGRAPHY_TIERS[cartographyTierIndex(tier)]];
}

/**
 * THE DECLARED WORST-CASE STEP BUDGET for one tier.
 *
 * This is the number tests/domain/townCartographySkeleton.test.js asserts the
 * measured `work` receipt against for the largest legal town. It is composed from
 * the caps above rather than guessed, so raising any cap without re-deriving this
 * bound is impossible: the bound moves with it, and the test measures the real run.
 *
 *   field       — every raster cell tests its 4 neighbours plus every capped water
 *                 and road segment, then one pass over each candidate set. This is
 *                 why the segment ceilings exist: without them the field's work is
 *                 a function of river vertex counts and no bound is derivable.
 *   arterials   — seeds x steps.
 *   lanes       — iterations x nodes x attractors (the space-colonization square,
 *                 the genre's actual rabbit hole).
 *   defenses    — hull passes over the node cloud plus the crossing scans.
 *
 * @param {unknown} tier
 * @param {number} rasterCells the field raster's cell count (33 x 33 today)
 * @returns {number}
 */
export function maximumSynthesisWork(tier, rasterCells) {
  const cells = Math.max(0, Math.floor(rasterCells));
  const attractors = cartographyBand(T.FIELD_ATTRACTOR_CANDIDATES, tier);
  const nodes = cartographyBand(T.LANE_NODES, tier);
  const seeds = cartographyBand(T.ARTERIAL_SEEDS, tier);
  const perCell = 4 + T.FIELD_WATER_SEGMENTS + T.FIELD_ROAD_SEGMENTS;
  const field = cells * perCell + T.FIELD_CORE_CANDIDATES + attractors;
  const arterials = seeds * T.ARTERIAL_STEPS;
  const lanes = T.LANE_ITERATIONS * nodes * attractors;
  const nodeCloud = nodes + seeds * T.ARTERIAL_STEPS;
  // Hull: a monotone chain is two linear passes over a sorted cloud; the sort is
  // counted as one pass per element per its log factor, bounded here by 5 passes.
  const defenses = nodeCloud * 5 + T.MAX_GATES * T.WALL_VERTICES + T.MAX_BRIDGES * nodeCloud;
  return field + arterials + lanes + defenses;
}
