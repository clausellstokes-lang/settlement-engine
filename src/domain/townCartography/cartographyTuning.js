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
  MAXIMUM_INSTITUTION_BINDINGS: Object.freeze({
    thorp: 8, hamlet: 12, village: 20, town: 32, city: 64, metropolis: 96,
  }),
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
  // <= 4 ALWAYS: a parcel is a triangle and its medial subdivision has exactly four
  // subcells, so a fifth building per parcel has nowhere to stand (§6.3c's theorem).
  BUILDINGS_PER_PARCEL: Object.freeze({
    thorp: 1, hamlet: 2, village: 2, town: 3, city: 4, metropolis: 4,
  }),
  MAXIMUM_CARTOGRAPHY_BUILDINGS: Object.freeze({
    thorp: 12, hamlet: 24, village: 48, town: 96, city: 176, metropolis: 240,
  }),
  DWELLING_TARGET: Object.freeze({
    thorp: 8, hamlet: 16, village: 32, town: 64, city: 120, metropolis: 160,
  }),
  DWELLING_HEIGHT_PERMILLE: Object.freeze({
    thorp: 100, hamlet: 120, village: 140, town: 180, city: 220, metropolis: 260,
  }),
  FOOTPRINT_SHRINK_PERMILLE: Object.freeze({ large: 660, medium: 540, small: 420, dwelling: 300 }),
  FOOTPRINT_SHRINK_STEP: 160,             // the fixed 3-entry ladder: p, p−160, p−320
  FOOTPRINT_SHRINK_FLOOR: 120,
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
  // pin somebody has to remember to write. This is the one authored number: the
  // per-row UTF-8 ceiling, against a measured worst case of 374 B/row at thorp. The
  // identity slug caps at 90 characters, so observed ids are already near-worst.
  // It still fires exactly when it should — per-row bloat beyond 400 B.
  TC4_ROW_BYTES_BAND: 400,
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
