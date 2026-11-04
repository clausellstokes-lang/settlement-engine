/**
 * data/institutionBudget.js — THE INSTITUTION BUDGET (X-46 car 3, docs/DESIGN_X46_SCALE_TRAIN.md §4).
 *
 * THE ONE LAW (§2): scale is a property of the population, and the tier chooses the kinds. Under
 * the owner's overlapping bands a large hamlet and a small village are the same size, so they
 * must draw the same NUMBER of houses; the tier decides only WHICH rows are on the shelf. This
 * file is the one curve every house count reads; nothing else in the engine carries a count by
 * tier.
 *
 * THE CURVE: the expected number of HOUSES (non-fabric rows, required and optional together) at
 * seven anchor populations, log-linear between them (linear in ln population), held flat outside
 * the first and last anchor. The first anchors (5 → 1.5, 30 → 3, 100 → 6, 400 → 14, 2,500 → 35,
 * 15,000 → 75, 60,000 → 120) met the chair's proposed budget (ODQ ledger, 2026-11-02: 1–3 / 2–6 /
 * 5–14 / 12–35 / 30–75 / 70+) and put it BELOW the catalogue's required baseline at the bottom of
 * three bands, so no optional thorp row could ever roll. THE CHAIR'S RULING (2026-11-04, option
 * C): a budget cannot sit below the catalogue's required baseline — every band's minimum exceeds
 * its tier's required non-fabric houses by at least one; the chair's 3 / 4 / 8 / 16 / 36 / 76 /
 * 120, with the 30-person anchor raised by the least whole house (4 → 5) because the 20-person
 * hamlet read 3.77 against its R of 3.
 *
 * ⛔ THE SEVEN NUMBERS ARE THE OWNER'S VETO POINT (§8 item 2). A lane that measures a band end
 * outside the budget reports the figure; it does not move an anchor.
 */

import { institutionalCatalog, institutionRowGuards, isFabricRow } from './institutionalCatalog.js';
import { POPULATION_RANGES } from './constants.js';

/**
 * [population, expected houses], ascending by population. A registered tuning table
 * (tests/lint/.tuning-register.json, declared draft; unit `people` → `count`).
 * @type {ReadonlyArray<readonly [number, number]>}
 */
export const INSTITUTION_BUDGET_ANCHORS = Object.freeze([
  [5, 3],
  [30, 5],
  [100, 8],
  [400, 16],
  [2500, 36],
  [15000, 76],
  [60000, 120],
]);
for (const anchor of INSTITUTION_BUDGET_ANCHORS) Object.freeze(anchor);

/**
 * The expected number of houses for a settlement of `population` people: log-linear between the
 * two anchors that bracket it, the end anchor's figure outside the table. A non-finite or
 * non-positive population reads the first anchor.
 * @param {number} population
 * @returns {number}
 */
export function expectedHousesAt(population) {
  const anchors = INSTITUTION_BUDGET_ANCHORS;
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (!Number.isFinite(population) || population <= first[0]) return first[1];
  if (population >= last[0]) return last[1];
  for (let i = 1; i < anchors.length; i += 1) {
    const [p1, h1] = anchors[i];
    if (population > p1) continue;
    const [p0, h0] = anchors[i - 1];
    const t = Math.log(population / p0) / Math.log(p1 / p0);
    return h0 + (h1 - h0) * t;
  }
  return last[1];
}

// ── THE MECHANISM (§4): one density factor per settlement ────────────────────────────────────
//
// R_tier is the tier block's number of required HOUSES (read from the catalogue at module load,
// fabric excluded). The design's first form, d = (expectedHousesAt(pop) − R) / E, is replaced by
// the chair's rulings of 2026-11-04: E is what is actually DRAWN (the hand-back's ruling 1), and
// because the drawn count is not linear in d (it SATURATES — concave: chances cap at 1, the
// cascade adds; the addendum's ruling 2, the chair's "convex" corrected by the chair) d is the
// INVERSE of a measured curve — `INSTITUTION_BUDGET_REALISED[tier].points`, realised(d) at eight
// measured d, 0 to 4 — at the target expectedHousesAt(pop) − R, linear between points and
// clamped to the table's ends (d = 0 and d = 4). The catalogue's own sum (Σ baseChance over the non-required,
// non-fabric rows whose stated population floor the midpoint reaches) is still read at load as
// `catalogueE`, and the table records the sum it was calibrated beside, so a catalogue change
// that moves the sum reds tests/generators/institutionBudgetDensity.test.js.
// Every non-required, non-fabric, non-route-required row's chance (`isDensityExempt`) is multiplied by d (the product clamped to [0, 1]
// per row: `scaleChance`) in assembleInstitutions, the cascade and the faction pass. d is a pure
// function of (tier, population), computed once before the first draw, and it never adds or
// removes a draw; outcome gates later in the roll and the cascade's count move on some seeds
// because the gated rolls changed (the chair's wording, 2026-11-04).

/**
 * THE REALISED CURVE (the chair's rulings, 2026-11-04): per tier, at the band's geometric
 * midpoint, `points` = [d, realised(d)] for d = 0, 0.25, 0.5, 1, 1.5, 2, 3, 4 — all MEASURED
 * (the chair's ruling: d = 0 reads the unscaled coherence repairs; d = 3 and 4 show where the
 * authored catalogue saturates, and a target above realised(4) is that tier's CEILING) — realised(d) the mean
 * non-fabric house count over `seeds` settlements (the certification matrix's cells) with the
 * density factor forced to d, after the cascade and the faction pass, minus R_tier. Measured by
 * `X46_FORCE_D=1 node --import ./scripts/audit/institution-budget-force-d.mjs
 * scripts/audit/institution-budget-measure.mjs --calibrate 200`. `catalogueE` is the authored
 * sum it was measured beside. A registered tuning table.
 * @type {Readonly<Record<string, Readonly<{ midpoint: number, seeds: number, catalogueE: number, points: ReadonlyArray<readonly [number, number]> }>>>}
 */
export const INSTITUTION_BUDGET_REALISED = Object.freeze({
  thorp:      { midpoint: 12, seeds: 200, catalogueE: 5.35, points: [[0, 0.66], [0.25, 1.635], [0.5, 2.34], [1, 3.29], [1.5, 3.865], [2, 4.335], [3, 4.95], [4, 5.305]] },
  hamlet:     { midpoint: 45, seeds: 200, catalogueE: 9.05, points: [[0, 0.66], [0.25, 3.345], [0.5, 5.99], [1, 9.775], [1.5, 12.41], [2, 14.135], [3, 15.915], [4, 17.105]] },
  village:    { midpoint: 173, seeds: 200, catalogueE: 21.29, points: [[0, 0.68], [0.25, 8.195], [0.5, 15.665], [1, 26.045], [1.5, 32.995], [2, 37.25], [3, 42.28], [4, 44.825]] },
  town:       { midpoint: 866, seeds: 200, catalogueE: 38.81, points: [[0, 0.75], [0.25, 15.555], [0.5, 28.765], [1, 46.24], [1.5, 56.565], [2, 63.1], [3, 68.87], [4, 71.335]] },
  city:       { midpoint: 5477, seeds: 200, catalogueE: 51.05, points: [[0, 0.08], [0.25, 19.03], [0.5, 33.33], [1, 51.67], [1.5, 61.02], [2, 66.495], [3, 69.905], [4, 70.685]] },
  metropolis: { midpoint: 30000, seeds: 200, catalogueE: 59.27, points: [[0, 0.09], [0.25, 22.81], [0.5, 39.4], [1, 58.65], [1.5, 69], [2, 74.08], [3, 77.155], [4, 77.92]] },
});
for (const row of Object.values(INSTITUTION_BUDGET_REALISED)) {
  for (const point of row.points) Object.freeze(point);
  Object.freeze(row.points);
  Object.freeze(row);
}

/** @typedef {Readonly<{ R: number, E: number, catalogueE: number, midpoint: number, points: ReadonlyArray<readonly [number, number]> }>} TierTerms */

/** @type {Readonly<Record<string, TierTerms>>} */
const TERMS = (() => {
  /** @type {Record<string, TierTerms>} */
  const out = {};
  for (const [tier, block] of Object.entries(institutionalCatalog)) {
    const band = POPULATION_RANGES[tier];
    const midpoint = band ? Math.sqrt(band.min * band.max) : Number.NaN;
    let R = 0;
    let catalogueE = 0;
    for (const group of Object.values(block)) {
      for (const [name, row] of Object.entries(group)) {
        if (isFabricRow(tier, name)) continue;
        if (row.required) { R += 1; continue; }
        const floor = institutionRowGuards(tier, name)?.minPopulation;
        if (typeof floor === 'number' && midpoint < floor) continue;
        catalogueE += typeof row.baseChance === 'number' ? row.baseChance : 0;
      }
    }
    const points = INSTITUTION_BUDGET_REALISED[tier]?.points ?? [];
    // E, for the report: realised(1), the optional houses drawn at the authored chances.
    const atOne = points.find(([d]) => d === 1);
    out[tier] = Object.freeze({ R, E: atOne ? atOne[1] : catalogueE, catalogueE, midpoint, points });
  }
  return Object.freeze(out);
})();

/**
 * The tier block's budget terms: R (required houses), E (realised(1)), catalogueE (the authored
 * sum at the midpoint), the midpoint and the realised curve's points. Null for a tier the
 * catalogue does not hold.
 * @param {string} tier
 * @returns {TierTerms | null}
 */
export function tierBudgetTerms(tier) {
  return TERMS[tier] ?? null;
}

/**
 * The settlement's density factor: the d at which the realised curve meets
 * expectedHousesAt(population) − R_tier, linear between the table's points and clamped to its
 * first and last d. 1 (the authored chances) where the population is unknown or the tier has no
 * curve — a headless call with no settlement scale is never re-scaled.
 * @param {string} tier
 * @param {number | null | undefined} population
 * @returns {number}
 */
export function densityFactor(tier, population) {
  const terms = TERMS[tier];
  if (!terms || terms.points.length < 2 || typeof population !== 'number' || !Number.isFinite(population)) return 1;
  const { points } = terms;
  const target = expectedHousesAt(population) - terms.R;
  const [firstD, firstR] = points[0];
  if (target <= firstR) return firstD;
  for (let i = 1; i < points.length; i += 1) {
    const [d0, r0] = points[i - 1];
    const [d1, r1] = points[i];
    if (target <= r1) return d0 + ((d1 - d0) * (target - r0)) / (r1 - r0);
  }
  return points[points.length - 1][0];
}

/**
 * THE ROUTE-REQUIRED EXEMPTION (the chair's ruling, 2026-11-04, rung-1 pins unit 2): a row the
 * catalogue marks `tradeRouteRequired` or `terrainRequired` is the place's definition where its
 * route or terrain admits it — the docks and the harbour master of a port, the ferry of a river
 * crossing, the woodcutters of a forest — and the density factor never scales it, as it never
 * scales a required or a fabric row: it rolls at its authored chance (d ≡ 1) at every population.
 * Measured before the ruling: a port-route city's harbour master starved at the factor while d ≡ 1
 * seated it (tests/joins/subsumption.test.js, "port-route city keeps its docks alongside the
 * harbour master"). A row that only names `terrainAccess` is not marked and is scaled.
 * @param {string} tier @param {string} name
 * @returns {boolean} true when the factor does not apply to the row (fabric or route-required)
 */
export function isDensityExempt(tier, name) {
  if (isFabricRow(tier, name)) return true;
  const block = institutionalCatalog[tier];
  if (!block) return false;
  for (const group of Object.values(block)) {
    const row = group[name];
    if (row) return !!(row.tradeRouteRequired?.length || row.terrainRequired?.length);
  }
  return false;
}

/**
 * A row's chance at density `d`: the product clamped to [0, 1].
 * @param {number} chance @param {number} d
 * @returns {number}
 */
export function scaleChance(chance, d) {
  return Math.min(1, Math.max(0, chance * d));
}
