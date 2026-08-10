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
  // The parcel-side rows (edge divisions, per-ward counts, institution bindings,
  // prominence bands, the TC-3 byte band) are TC-3b's and are deliberately absent:
  // a constant with no reader is dead tuning.
  MAXIMUM_WARDS: Object.freeze({
    thorp: 8, hamlet: 10, village: 12, town: 16, city: 24, metropolis: 48,
  }),
  // The lowering copies a district footprint verbatim, so this is a cap on the
  // SOURCE polygon, not a simplification target.
  MAXIMUM_WARD_VERTICES: 8,
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
