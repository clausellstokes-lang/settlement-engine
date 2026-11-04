/**
 * X-46 car 3 — THE MECHANISM (docs/DESIGN_X46_SCALE_TRAIN.md §4): one density factor per
 * settlement, d = (expectedHousesAt(pop) − R_tier) / E_tier, multiplying every non-required,
 * non-fabric row's chance in assembleInstitutions, the cascade and the faction pass. R_tier and
 * E_tier are re-read from the catalogue (fabric excluded; E at the band's geometric midpoint).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { INSTITUTION_BUDGET_REALISED, densityFactor, expectedHousesAt, scaleChance, tierBudgetTerms } from '../../src/data/institutionBudget.js';
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

describe('X-46 car 3 — the density factor', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('reads R_tier (required houses) from the catalogue and records E_tier\'s catalogue sum beside it, fabric excluded', () => {
    expect(TIER_ORDER.map((t) => tierBudgetTerms(t).R)).toEqual([2, 3, 6, 11, 15, 15]);
    for (const tier of TIER_ORDER) {
      const { R, E } = readTerms(tier);
      expect(tierBudgetTerms(tier).R).toBe(R);
      expect(tierBudgetTerms(tier).catalogueE).toBeCloseTo(E, 9);
      // A catalogue change that moves the authored sum reds here: the realised E is then stale
      // and is re-measured (scripts/audit/institution-budget-measure.mjs --calibrate 200).
      expect(INSTITUTION_BUDGET_REALISED[tier].catalogueE, tier).toBeCloseTo(E, 2);
    }
  });

  // THE CHAIR'S RULINGS (2026-11-04). Hand-back ruling 1: E is what is actually DRAWN, not the
  // authored chances. Addendum ruling 2: the realised count is convex in d (chances cap at 1, the
  // cascade adds), so a one-point midpoint calibration overshoots at the band's top. The table is
  // realised(d) at five d (200 seeds each at the band's geometric midpoint, non-fabric houses after
  // the cascade and the faction pass, minus R), and d(pop) is its INVERSE at the target
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

  it('d(pop) is the inverse of realised(d) at expectedHousesAt(pop) − R, clamped to the table\'s ends', () => {
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
      const { min, max } = POPULATION_RANGES[tier];
      for (let k = 0; k <= 10; k += 1) {
        const P = Math.round(min * (max / min) ** (k / 10));
        const target = expectedHousesAt(P) - R;
        const d = densityFactor(tier, P);
        expect(d).toBeGreaterThan(0); // every target is ≥ 1 house (U9) and above realised(0)
        expect(d).toBeLessThanOrEqual(4);
        if (target >= points[points.length - 1][1]) expect(d).toBe(4); // the tier's ceiling
        else expect(realisedAt(points, d)).toBeCloseTo(target, 9);
      }
    }
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
