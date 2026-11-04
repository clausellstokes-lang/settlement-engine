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
// d = (expectedHousesAt(pop) − R_tier) / E_tier, where R_tier is the tier block's number of
// required HOUSES (read from the catalogue at module load, fabric excluded) and E_tier the
// REALISED optional house count at the band's geometric midpoint: `INSTITUTION_BUDGET_REALISED`
// below (the chair's ruling, 2026-11-04). The catalogue's own sum (Σ baseChance over the
// non-required, non-fabric rows whose stated population floor the midpoint reaches) is still read
// at load as `catalogueE`, and the table records the sum it was calibrated beside, so a catalogue
// change that moves the sum is caught (tests/generators/institutionBudgetDensity.test.js).
// Every non-required, non-fabric row's chance is multiplied by d (the product clamped to [0, 1]
// per row: `scaleChance`) in assembleInstitutions, the cascade and the faction pass. d is a pure
// function of (tier, population), computed once before the first draw, and it never adds,
// removes or re-orders a draw: a seed's draws are the same draws at different chances.

/**
 * THE REALISED E (the chair's ruling, 2026-11-04, X46-3 hand-back ruling 1): per tier, the mean
 * non-fabric house count at the band's geometric midpoint with the density factor ≡ 1 — after the
 * cascade and the faction pass, with the priority and resource multipliers — minus R_tier, over
 * `seeds` settlements (the certification matrix's cells), measured by
 * `scripts/audit/institution-budget-measure.mjs --calibrate 200` at d0a3202 (the fabric tag, no
 * factor). `catalogueE` is the authored sum it was measured beside. A registered tuning table.
 * @type {Readonly<Record<string, Readonly<{ midpoint: number, seeds: number, catalogueE: number, measuredE: number }>>>}
 */
export const INSTITUTION_BUDGET_REALISED = Object.freeze({
  thorp:      { midpoint: 12,    seeds: 200, catalogueE: 5.35,  measuredE: 3.29 },
  hamlet:     { midpoint: 45,    seeds: 200, catalogueE: 9.05,  measuredE: 9.775 },
  village:    { midpoint: 173,   seeds: 200, catalogueE: 21.29, measuredE: 26.045 },
  town:       { midpoint: 866,   seeds: 200, catalogueE: 38.81, measuredE: 46.24 },
  city:       { midpoint: 5477,  seeds: 200, catalogueE: 51.05, measuredE: 51.67 },
  metropolis: { midpoint: 30000, seeds: 200, catalogueE: 59.27, measuredE: 58.65 },
});
for (const row of Object.values(INSTITUTION_BUDGET_REALISED)) Object.freeze(row);

/** @type {Readonly<Record<string, Readonly<{ R: number, E: number, catalogueE: number, midpoint: number }>>>} */
const TERMS = (() => {
  /** @type {Record<string, Readonly<{ R: number, E: number, catalogueE: number, midpoint: number }>>} */
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
    const E = INSTITUTION_BUDGET_REALISED[tier]?.measuredE ?? catalogueE;
    out[tier] = Object.freeze({ R, E, catalogueE, midpoint });
  }
  return Object.freeze(out);
})();

/**
 * The tier block's budget terms: R (required houses), E (the realised optional houses at the
 * band's geometric midpoint), catalogueE (the authored sum there) and that midpoint. Null for a
 * tier the catalogue does not hold.
 * @param {string} tier
 * @returns {Readonly<{ R: number, E: number, catalogueE: number, midpoint: number }> | null}
 */
export function tierBudgetTerms(tier) {
  return TERMS[tier] ?? null;
}

/**
 * The settlement's density factor: (expectedHousesAt(population) − R_tier) / E_tier, never below
 * zero. 1 (the authored chances) where the population is unknown or the tier has no terms — a
 * headless call with no settlement scale is never re-scaled.
 * @param {string} tier
 * @param {number | null | undefined} population
 * @returns {number}
 */
export function densityFactor(tier, population) {
  const terms = TERMS[tier];
  if (!terms || !(terms.E > 0) || typeof population !== 'number' || !Number.isFinite(population)) return 1;
  return Math.max(0, (expectedHousesAt(population) - terms.R) / terms.E);
}

/**
 * A row's chance at density `d`: the product clamped to [0, 1].
 * @param {number} chance @param {number} d
 * @returns {number}
 */
export function scaleChance(chance, d) {
  return Math.min(1, Math.max(0, chance * d));
}
