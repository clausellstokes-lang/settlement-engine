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
 * hamlet read 3.77 against its R of 3. The 60,000 anchor is the catalogue's measured ceiling, 93
 * (the chair's ruling of 2026-11-04, rung-1 pins: 120 was unreachable as authored).
 *
 * ⛔ THE SEVEN NUMBERS ARE THE OWNER'S VETO POINT (§8 item 2). A lane that measures a band end
 * outside the budget reports the figure; it does not move an anchor.
 */

import { institutionalCatalog, institutionRowGuards, isFabricRow, isRareRow } from './institutionalCatalog.js';
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
  // 120 → 93 (the chair's ruling, 2026-11-04, rung-1 pins unit 3): 120 was unreachable as
  // authored. Measured at d207c81/751c05c (X46-3 report §9): the metropolis catalogue saturates at
  // realised(4) = 77.92 optional houses + R 15 = 92.92, so 93 is the catalogue's ceiling (its target
  // 78 sits 0.08 above realised(4): d reads 4 at 60,000 either way). The metropolis roll runs past
  // 100,000 (x46-1b's tail); beyond 60,000 the curve is flat at this ceiling by design.
  [60000, 93],
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
// Every non-required, non-fabric, non-route-required, non-rare row's chance (`isDensityExempt`) is multiplied by d (the product clamped to [0, 1]
// per row: `scaleChance`) in assembleInstitutions, the cascade and the faction pass. d is a pure
// function of (tier, population), computed once before the first draw, and it never adds or
// removes a draw; outcome gates later in the roll and the cascade's count move on some seeds
// because the gated rolls changed (the chair's wording, 2026-11-04).
//
// THE TARGET GIVES WAY (the chair's ruling, 2026-11-04, RUNG1B-F6: "neither the exemptions nor the
// anchors give way; the TARGET does"). PINS' route-required and rare rows draw at their authored
// chance whatever d is, so at the band bottoms a target that counted them sat below realised(0) and d
// read 0 (thorp 5–6, village 75–99; tests/generators/institutionBudgetDensity.test.js red at the
// composed tip). Now, per settlement, X = Σ the draw's own chance over the exempt, non-required,
// non-fabric rows that can stand there (assembleInstitutions.js :: exemptHouseExpectation — an
// expectation: no draw, no table), the factor answers target_scalable = expectedHousesAt(P) − R − X,
// and the realised curve is measured over the SCALABLE rows only (drawn at a scaled chance; not
// required, fabric, exempt, a coherence repair or toggle-forced), so realised(0) = 0 by construction.
// d = 0 exactly where nothing is left (target_scalable ≤ 0), pinned by tier in the density test. The
// seven anchors are untouched.

/**
 * THE REALISED CURVE (the chair's rulings, 2026-11-04): per tier, at the band's geometric
 * midpoint, `points` = [d, realised(d)] for d = 0, 0.25, 0.5, 1, 1.5, 2, 3, 4 — all MEASURED
 * (the chair's ruling: d = 0 reads the unscaled coherence repairs; d = 3 and 4 show where the
 * authored catalogue saturates, and a target above realised(4) is that tier's CEILING) — realised(d) the mean
 * SCALABLE house count over `seeds` settlements (the certification matrix's cells) with the density
 * factor forced to d, after the cascade and the faction pass: rows drawn at a scaled chance (source
 * generated, cascade or faction_boost) that are not required, fabric or density-exempt (RUNG1B-F6;
 * before it, every non-fabric house minus R_tier, so realised(0) carried the exempt draws and the
 * repairs). Measured by
 * `X46_FORCE_D=1 node --import ./scripts/audit/institution-budget-force-d.mjs
 * scripts/audit/institution-budget-measure.mjs --calibrate 200`. `catalogueE` is the authored
 * sum it was measured beside. A registered tuning table.
 * @type {Readonly<Record<string, Readonly<{ midpoint: number, seeds: number, catalogueE: number, points: ReadonlyArray<readonly [number, number]> }>>>}
 */
export const INSTITUTION_BUDGET_REALISED = Object.freeze({
  // Re-measured 2026-11-04 on the SCALABLE definition (RUNG1B-F6), same eight d, cells, seeds and script as U10.
  thorp:      { midpoint: 12, seeds: 200, catalogueE: 5.35, points: [[0, 0], [0.25, 0.855], [0.5, 1.475], [1, 2.355], [1.5, 2.995], [2, 3.5], [3, 4.155], [4, 4.535]] },
  hamlet:     { midpoint: 45, seeds: 200, catalogueE: 9.05, points: [[0, 0], [0.25, 2.55], [0.5, 5.075], [1, 8.77], [1.5, 11.405], [2, 13.175], [3, 15.025], [4, 16.26]] },
  village:    { midpoint: 173, seeds: 200, catalogueE: 21.29, points: [[0, 0], [0.25, 7.175], [0.5, 14.285], [1, 24.29], [1.5, 31.08], [2, 35.335], [3, 40.345], [4, 42.895]] },
  town:       { midpoint: 866, seeds: 200, catalogueE: 38.81, points: [[0, 0], [0.25, 14.58], [0.5, 27.54], [1, 44.62], [1.5, 54.875], [2, 61.375], [3, 67.08], [4, 69.475]] },
  city:       { midpoint: 5477, seeds: 200, catalogueE: 51.05, points: [[0, 0], [0.25, 18.09], [0.5, 32.025], [1, 49.975], [1.5, 59.165], [2, 64.54], [3, 68.065], [4, 68.81]] },
  metropolis: { midpoint: 27386, seeds: 200, catalogueE: 59.27, points: [[0, 0], [0.25, 21.35], [0.5, 37.74], [1, 57.04], [1.5, 66.965], [2, 71.62], [3, 74.82], [4, 75.545]] },
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
 * The settlement's density factor: the d at which the realised SCALABLE curve meets
 * target_scalable = expectedHousesAt(population) − R_tier − exempt, linear between the table's
 * points and clamped to its first and last d. `exempt` is X, the settlement's own expected draws of
 * the density-exempt rows that can stand there (assembleInstitutions.js :: exemptHouseExpectation;
 * 0 when a caller has no settlement to read). 0 where nothing is left above the required and exempt
 * rows (target_scalable ≤ 0); 1 (the authored chances) where the population is unknown or the tier has
 * no curve — a headless call with no settlement scale is never re-scaled.
 * @param {string} tier
 * @param {number | null | undefined} population
 * @param {number} [exempt] X, the expected exempt houses (non-finite or negative reads 0)
 * @returns {number}
 */
export function densityFactor(tier, population, exempt = 0) {
  const terms = TERMS[tier];
  if (!terms || terms.points.length < 2 || typeof population !== 'number' || !Number.isFinite(population)) return 1;
  const { points } = terms;
  const X = Number.isFinite(exempt) && exempt > 0 ? exempt : 0;
  const target = expectedHousesAt(population) - terms.R - X;
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
 * THE AUTHORED RARITY (the chair's addendum, 2026-11-04): a row the catalogue marks `rare`
 * (`isRareRow`; the metropolis Dragon resident) is exempt the same way — its chance is a rarity,
 * and at d up to 4 the 0.06 dragon sat in 34 of 80 high-magic metropolises.
 * @param {string} tier @param {string} name
 * @returns {boolean} true when the factor does not apply to the row (fabric, route-required or rare)
 */
export function isDensityExempt(tier, name) {
  if (isFabricRow(tier, name) || isRareRow(tier, name)) return true;
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
