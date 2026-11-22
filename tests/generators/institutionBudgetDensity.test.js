/**
 * X-46 car 3 — THE MECHANISM (docs/DESIGN_X46_SCALE_TRAIN.md §4): one density factor per
 * settlement, multiplying every non-required, non-fabric, non-exempt row's chance in
 * assembleInstitutions, the cascade and the faction pass: the inverse of the realised SCALABLE curve
 * at expectedHousesAt(pop) − R_tier − X (RUNG1B-F6). R_tier and E_tier are re-read from the
 * catalogue (fabric excluded; E at the band's geometric midpoint).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { INSTITUTION_BUDGET_REALISED, densityFactor, expectedHousesAt, isDensityExempt, scaleChance, tierBudgetTerms } from '../../src/data/institutionBudget.js';
import { institutionalCatalog, institutionRowGuards, isFabricInstitution, isFabricRow } from '../../src/data/institutionalCatalog.js';
import { POPULATION_RANGES, TIER_ORDER } from '../../src/data/constants.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/** The terms, read here independently of the module. */
function readTerms(tier) {
  const mid = Math.sqrt(POPULATION_RANGES[tier].min * POPULATION_RANGES[tier].max);
  let R = 0; let E = 0;
  for (const group of Object.values(institutionalCatalog[tier])) {
    for (const [name, row] of Object.entries(group)) {
      if (isFabricRow(tier, name)) continue;
      if (row.required) { R += 1; continue; }
      const floor = institutionRowGuards(tier, name)?.minPopulation;
      if (typeof floor === 'number' && mid < floor) continue;
      E += row.baseChance || 0;
    }
  }
  return { R, E };
}

/** Houses (non-fabric roster rows) of `n` settlements of `tier` born at exactly `P` people. */
function housesAt(tier, P, n) {
  const saved = { ...POPULATION_RANGES[tier] };
  POPULATION_RANGES[tier] = { min: P, max: P };
  try {
    return Array.from({ length: n }, (_, k) => {
      const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier }), null, { seed: `x46-density-${tier}-${P}-${k}` });
      expect(s.population).toBe(P);
      return s.institutions.filter((i) => !isFabricInstitution(i)).length;
    });
  } finally { POPULATION_RANGES[tier] = saved; }
}
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

const ROUTES = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass', 'none'];
const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
/** The largest authored exempt expectation a tier can hold: over every route × terrain, Σ baseChance of the
 * non-required, non-fabric, density-exempt rows whose route and terrain gates pass (read here, independently). */
function xMaxAuthored(tier) {
  let best = 0;
  for (const route of ROUTES) for (const terrain of TERRAINS) {
    let x = 0;
    for (const group of Object.values(institutionalCatalog[tier])) {
      for (const [name, row] of Object.entries(group)) {
        if (row.required || isFabricRow(tier, name) || !isDensityExempt(tier, name)) continue;
        if (row.tradeRouteRequired && !row.tradeRouteRequired.includes(route) && !(row.terrainAccess || []).includes(terrain)) continue;
        if (row.terrainRequired && !row.terrainRequired.includes(terrain)) continue;
        if (row.forbiddenTradeRoutes?.includes(route)) continue;
        x += row.baseChance || 0;
      }
    }
    best = Math.max(best, x);
  }
  return best;
}
/** Read 2026-11-04 (thorp and village at river/forest; town and up at river/desert).
 *  Re-keyed by identity 2026-11-04 at the rung-1 landing (LANDING-2): F6 read 1.89 / 2.05 / 2.17 / 2.23 at its
 *  own lane tip; composed onto the window branch (6d84aa834) the same function reads 2.04 / 2.13 / 2.57 / 2.73,
 *  because the window carries exempt rows F6's base did not. Measured at 6d84aa834 and at the landed tip
 *  alike; no draw moved (the constant is the test's reading of the catalogue, not a dial). */
const X_MAX_AUTHORED = Object.freeze({ thorp: 1.27, hamlet: 1, village: 2.04, town: 2.13, city: 2.57, metropolis: 2.73 });

// Re-keyed by identity 2026-11-04 (rung-1 pins, unit 1): the realised table was calibrated at
// x46-3's own base, metropolis catalogue sum 59.27. Composed onto the window branch, one authored
// chance beneath it moved: 'Dragon resident' 0.1 → 0.06 (the dragon licence joined the exotic
// scaler, chair ruling round 3 item 2), so the composed catalogue reads 59.23. Each move is named
// here by row and pinned at its current value; the table's recorded sum is checked against the
// catalogue PLUS the named moves, so any OTHER change still reds and still calls for --calibrate.
// Re-keyed by identity 2026-11-04 (the rung-1 landing, LANDING-2): RUNG1B-F1 (5e9ffb220) added the
// 'Village watch' row at village 0.2 after the calibration (absent before, so 0 -> 0.2), named the same way.
const CATALOGUE_MOVES_SINCE_CALIBRATION = Object.freeze({
  village: [['Village watch', 0, 0.2]],
  metropolis: [['Dragon resident', 0.1, 0.06]],
});

describe('X-46 car 3 — the density factor', () => {
  it('the catalogue moves named since the calibration are the catalogue\'s current chances', () => {
    for (const [tier, moves] of Object.entries(CATALOGUE_MOVES_SINCE_CALIBRATION)) {
      for (const [name, , after] of moves) {
        const row = Object.values(institutionalCatalog[tier]).map((g) => g[name]).find(Boolean);
        expect(row?.baseChance, `${tier}|${name}`).toBe(after);
      }
    }
  });

  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('reads R_tier (required houses) from the catalogue and records E_tier\'s catalogue sum beside it, fabric excluded', () => {
    expect(TIER_ORDER.map((t) => tierBudgetTerms(t).R)).toEqual([2, 3, 6, 11, 15, 15]);
    for (const tier of TIER_ORDER) {
      const { R, E } = readTerms(tier);
      expect(tierBudgetTerms(tier).R).toBe(R);
      expect(tierBudgetTerms(tier).catalogueE).toBeCloseTo(E, 9);
      // A catalogue change that moves the authored sum reds here: the realised E is then stale
      // and is re-measured (scripts/audit/institution-budget-measure.mjs --calibrate 200).
      const moved = (CATALOGUE_MOVES_SINCE_CALIBRATION[tier] || []).reduce((sum, [, before, after]) => sum + (before - after), 0);
      expect(INSTITUTION_BUDGET_REALISED[tier].catalogueE, tier).toBeCloseTo(E + moved, 2);
    }
  });

  // THE CHAIR'S RULINGS (2026-11-04). Hand-back ruling 1: E is what is actually DRAWN, not the
  // authored chances. Addendum ruling 2: the realised count is convex in d (chances cap at 1, the
  // cascade adds), so a one-point midpoint calibration overshoots at the band's top. The table is
  // realised(d) at eight d (200 seeds each at the band's geometric midpoint, after the cascade and the
  // faction pass; since RUNG1B-F6 the SCALABLE rows only), and d(pop) is its INVERSE at the target
  // expectedHousesAt(pop) − R, linear between points, clamped at the table's ends. Ruling on the
  // clamp (2026-11-04): MEASURE, never assume — d = 0 is a measured point (the unscaled repairs),
  // and d = 3 and 4 extend the top; a target above realised(4) clamps at 4 and is the ceiling.
  it('holds realised(d) at d = 0, 0.25, 0.5, 1, 1.5, 2, 3, 4 per tier, 200 seeds each, increasing in d', () => {
    for (const tier of TIER_ORDER) {
      const row = INSTITUTION_BUDGET_REALISED[tier];
      expect(row.seeds).toBe(200);
      expect(row.midpoint).toBe(Math.round(tierBudgetTerms(tier).midpoint));
      expect(row.points.map(([d]) => d)).toEqual([0, 0.25, 0.5, 1, 1.5, 2, 3, 4]);
      for (let i = 1; i < row.points.length; i += 1) expect(row.points[i][1], `${tier} realised increases`).toBeGreaterThan(row.points[i - 1][1]);
      expect(tierBudgetTerms(tier).E).toBe(row.points[3][1]); // realised(1), for the report
    }
  });

  // THE CHAIR'S RULING (2026-11-04, RUNG1B-F6, "neither the exemptions nor the anchors give way; the TARGET
  // does"). The factor cannot move a required, route-required or rare row, so the target the factor answers
  // for is what is left of the anchor after them: target_scalable = expectedHousesAt(P) − R_tier − X, X the
  // settlement's own expected draws of the exempt rows (assembleInstitutions.js :: exemptHouseExpectation).
  // realised(d) is measured over the SCALABLE rows only, so realised(0) = 0 by construction, and the floor
  // is: d ≥ 0 everywhere, d > 0 wherever target_scalable > 0. (Before: "every target ≥ 1 house (U9) and
  // above realised(0)", red at thorp 5–6 and village 75–99 since PINS' exempt rows drew at d = 0.)
  it('d(pop, X) is the inverse of realised_scalable(d) at expectedHousesAt(pop) − R − X; 0 exactly where nothing is left; clamped at 4', () => {
    const realisedAt = (points, d) => {
      for (let i = 1; i < points.length; i += 1) {
        const [d0, r0] = points[i - 1]; const [d1, r1] = points[i];
        if (d <= d1) return r0 + ((r1 - r0) * (d - d0)) / (d1 - d0);
      }
      return points[points.length - 1][1];
    };
    for (const tier of TIER_ORDER) {
      const { R } = tierBudgetTerms(tier);
      const { points } = INSTITUTION_BUDGET_REALISED[tier];
      expect(points[0], `${tier} realised_scalable(0)`).toEqual([0, 0]);
      const { min, max } = POPULATION_RANGES[tier];
      for (const X of [0, X_MAX_AUTHORED[tier] / 2, X_MAX_AUTHORED[tier], 3]) {
        for (let k = 0; k <= 10; k += 1) {
          const P = Math.round(min * (max / min) ** (k / 10));
          const target = expectedHousesAt(P) - R - X;
          const d = densityFactor(tier, P, X);
          expect(d, `${tier} @ ${P}, X ${X}`).toBeGreaterThanOrEqual(0);
          expect(d).toBeLessThanOrEqual(4);
          if (target <= 0) expect(d, `${tier} @ ${P}, X ${X}: nothing left to scale`).toBe(0);
          else expect(d, `${tier} @ ${P}, X ${X}: target ${target}`).toBeGreaterThan(0);
          if (target >= points[points.length - 1][1]) expect(d).toBe(4); // the tier's ceiling
          else if (target > 0) expect(realisedAt(points, d)).toBeCloseTo(target, 9);
        }
      }
      // With no exempt row standing (X = 0) every population of every band has room: d > 0 (U9 holds).
      for (let P = min; P <= Math.min(max, 20000); P += P < 1000 ? 1 : 25) expect(densityFactor(tier, P), `${tier} @ ${P}`).toBeGreaterThan(0);
    }
  });

  // THE d = 0 POPULATIONS, PINNED (the chair's ruling (5)): the band bottoms where the anchor leaves no
  // room above the required rows and the exempt rows' largest authored expectation (the route × terrain
  // that admits the most exempt rows, authored chances, neutral sliders: X_MAX_AUTHORED). A future anchor,
  // R or exempt-row change moves these and reds here. Read 2026-11-04 at the RUNG1B-F6 tip.
  // X is read without a draw against the empty roster, which is the draw's own chance only while no
  // exempt row can lose its roll to the roster: no exclusive group, exclusion condition or row guard.
  it('no density-exempt row carries an exclusive group, an exclusion condition or a row guard (X is draw-free)', () => {
    const carrying = [];
    for (const tier of TIER_ORDER) {
      for (const group of Object.values(institutionalCatalog[tier])) {
        for (const [name, row] of Object.entries(group)) {
          if (row.required || isFabricRow(tier, name) || !isDensityExempt(tier, name)) continue;
          if (row.exclusiveGroup || row.exclusionConditions?.length || institutionRowGuards(tier, name)) carrying.push(`${tier}|${name}`);
        }
      }
    }
    expect(carrying).toEqual([]);
  });

  it('pins the d = 0 populations by tier at the largest authored X', () => {
    expect(TIER_ORDER.map((tier) => Number(xMaxAuthored(tier).toFixed(4)))).toEqual(TIER_ORDER.map((tier) => X_MAX_AUTHORED[tier]));
    /** @type {Record<string, [number, number, number] | null>} */
    const zero = {};
    for (const tier of TIER_ORDER) {
      const { min, max } = POPULATION_RANGES[tier];
      const ps = [];
      for (let P = min; P <= Math.min(max, 20000); P += 1) if (densityFactor(tier, P, X_MAX_AUTHORED[tier]) === 0) ps.push(P);
      zero[tier] = ps.length ? [ps[0], ps[ps.length - 1], ps.length] : null;
    }
    // Re-keyed 2026-11-04 (LANDING-2) with X_MAX_AUTHORED above: village [75, 95, 21] -> [75, 100, 26] at X 2.04.
    expect(zero).toEqual({ thorp: [5, 6, 2], hamlet: null, village: [75, 100, 26], town: null, city: null, metropolis: null });
  });

  it('is 1 where no population is known; scaleChance clamps the product to [0, 1]', () => {
    expect(densityFactor('town', null)).toBe(1);
    expect(densityFactor('nowhere', 500)).toBe(1);
    expect(scaleChance(0.6, 2)).toBe(1);
    expect(scaleChance(0.6, 0)).toBe(0);
    expect(scaleChance(0.5, 0.5)).toBe(0.25);
  });

  it('the step function is gone: a 2,500-person town draws more than twice the houses of a 300-person town', () => {
    const small = mean(housesAt('town', 300, 12));
    const large = mean(housesAt('town', 2500, 12));
    expect(large).toBeGreaterThan(2 * small);
  }, 120_000);

  // The design's promise is 10% (§4), measured by scripts/audit/institution-budget-measure.mjs at
  // 40 seeds a side; at this tip it reads 11.4% at 400 (before: 43.9%). This guard pins the cure's
  // direction at twelve seeds a side, not the promise: under a quarter, where the tier step was 44%.
  it('the overlap agrees: a 400-person village and a 400-person town draw within a quarter of each other', () => {
    const village = mean(housesAt('village', 400, 12));
    const town = mean(housesAt('town', 400, 12));
    expect(Math.abs(village - town) / Math.max(village, town)).toBeLessThan(0.25);
  }, 120_000);
});
