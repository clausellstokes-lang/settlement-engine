/**
 * seasonalFoodYear.test.js — SEASONS-A items 2-4: the renewable cycle shape,
 * the biome amplitudes, the seeded inter-annual variance bands, and the gated
 * granary arithmetic in advanceFoodStockpile — including the constitutional
 * flag-off identity (`seasonal` absent ⇒ the legacy output, byte-for-byte).
 */
import { describe, expect, test } from 'vitest';

import {
  SEASONS_TUNING,
  seasonalBoundaryEntries,
  seasonalContextFor,
  seasonalSeverityFor,
  seasonalSwingPts,
  seasonalUnitSwing,
} from '../../src/domain/worldPulse/seasons.js';
import { seasonForTick } from '../../src/domain/worldPulse/worldState.js';
import { advanceFoodStockpile } from '../../src/domain/worldPulse/foodStockpile.js';

const clock = (season, weekOfSeason) => ({ season, weekOfSeason });

function settlementWith(foodSecurity, patch = {}) {
  return {
    name: 'Testford',
    tier: 'town',
    population: 1500,
    institutions: [{ name: 'Granary', status: 'active' }],
    economicState: { foodSecurity: { dailyNeed: 3000, dailyProduction: 3000, ...foodSecurity } },
    config: { terrainType: 'plains' },
    ...patch,
  };
}

describe('the annual shape (owner §4i: abundant → winter depleted → spring replenish)', () => {
  test('winter is depletion, deepest in late winter; harvest peaks early autumn', () => {
    expect(seasonalUnitSwing('winter', 1)).toBeCloseTo(-0.5);
    expect(seasonalUnitSwing('winter', 13)).toBeCloseTo(-1.0);
    expect(seasonalUnitSwing('autumn', 1)).toBeCloseTo(1.0);
    expect(seasonalUnitSwing('autumn', 13)).toBeCloseTo(0.3);
    // spring RAMPS from the hungry-gap tail back toward abundance
    expect(seasonalUnitSwing('spring', 1)).toBeCloseTo(-0.6);
    expect(seasonalUnitSwing('spring', 13)).toBeCloseTo(0.2);
    expect(seasonalUnitSwing('summer', 13)).toBeCloseTo(0.9);
  });

  test('the growing year banks more than a NORMAL winter draws (one bad year is absorbable)', () => {
    // Integrate the year at temperate amplitude with the granary constants:
    // inflow uses fillRate; drawdown targets the Pressured band (rationFloor).
    const A = SEASONS_TUNING.defaultAmplitude;
    let bank = 0;
    let draw = 0;
    for (let w = 0; w < 52; w += 1) {
      const c = seasonForTick(w);
      const pts = seasonalUnitSwing(c.season, c.weekOfSeason) * A;
      if (pts > 0) bank += (pts / 100) * (3 / 13) * 0.6;      // STOCKPILE_TUNING.fillRate
      if (pts < 0) draw += (Math.max(0, -pts - 5) / 100) * (3 / 13); // rationFloorPct 5
    }
    expect(bank).toBeGreaterThan(draw);           // a balanced town survives a normal year
    expect(bank - draw).toBeLessThan(0.35);       // …but does not trivially outrun a bad one
    // a HARD winter (depletion ×1.4) draws more than the year banks — the granary
    // buffer (not the year's own harvest) is what carries the town: one bad year
    // is absorbable only WITH stores, and two in a row are the crisis.
    let hardDraw = 0;
    for (let w = 0; w < 52; w += 1) {
      const c = seasonForTick(w);
      let pts = seasonalUnitSwing(c.season, c.weekOfSeason) * A;
      if (c.season === 'winter') pts *= SEASONS_TUNING.hardWinterDepletionMult;
      if (pts < 0) hardDraw += (Math.max(0, -pts - 5) / 100) * (3 / 13);
    }
    expect(hardDraw).toBeGreaterThan(bank);
  });

  test('biome amplitude: mountain harsh, temperate standard, coastal milder', () => {
    const w = clock('winter', 13);
    const mountain = seasonalSwingPts(w, 'mountain', null);
    const plains = seasonalSwingPts(w, 'plains', null);
    const coastal = seasonalSwingPts(w, 'coastal', null);
    expect(mountain).toBeLessThan(plains);
    expect(plains).toBeLessThan(coastal);
    expect(coastal).toBeLessThan(0);
    // unknown terrain reads temperate
    expect(seasonalSwingPts(w, null, null)).toBeCloseTo(plains);
  });
});

describe('inter-annual variance — seeded per (year, settlement), bounded bands', () => {
  test('deterministic per (seed, year, settlement); differs across years/settlements/seeds', () => {
    const a = seasonalSeverityFor('seed-x', 3, 'town-a');
    expect(seasonalSeverityFor('seed-x', 3, 'town-a')).toBe(a); // stable all year
    const draws = new Set();
    for (let y = 1; y <= 40; y += 1) draws.add(String(seasonalSeverityFor('seed-x', y, 'town-a')));
    expect(draws.size).toBeGreaterThan(1); // years actually differ
  });

  test('band frequencies roughly match the documented probabilities over many draws', () => {
    let drought = 0; let hard = 0; let bountiful = 0; let normal = 0; const N = 2000;
    for (let i = 0; i < N; i += 1) {
      const v = seasonalSeverityFor('freq-seed', i, 's');
      if (v === 'drought') drought += 1;
      else if (v === 'hard_winter') hard += 1;
      else if (v === 'bountiful') bountiful += 1;
      else normal += 1;
    }
    expect(drought / N).toBeGreaterThan(0.08); expect(drought / N).toBeLessThan(0.16);
    expect(hard / N).toBeGreaterThan(0.08); expect(hard / N).toBeLessThan(0.16);
    expect(bountiful / N).toBeGreaterThan(0.08); expect(bountiful / N).toBeLessThan(0.16);
    expect(normal / N).toBeGreaterThan(0.55);
  });

  test('variance reshapes the right face of the year and stays bounded', () => {
    const winter = clock('winter', 13);
    const harvest = clock('autumn', 3);
    expect(seasonalSwingPts(winter, 'plains', 'hard_winter'))
      .toBeCloseTo(seasonalSwingPts(winter, 'plains', null) * SEASONS_TUNING.hardWinterDepletionMult);
    expect(seasonalSwingPts(harvest, 'plains', 'drought'))
      .toBeCloseTo(seasonalSwingPts(harvest, 'plains', null) * SEASONS_TUNING.droughtReplenishMult);
    expect(seasonalSwingPts(harvest, 'plains', 'bountiful'))
      .toBeCloseTo(seasonalSwingPts(harvest, 'plains', null) * SEASONS_TUNING.bountifulReplenishMult);
    // a drought does NOT deepen winter; a hard winter does NOT touch the harvest
    expect(seasonalSwingPts(winter, 'plains', 'drought')).toBeCloseTo(seasonalSwingPts(winter, 'plains', null));
    expect(seasonalSwingPts(harvest, 'plains', 'hard_winter')).toBeCloseTo(seasonalSwingPts(harvest, 'plains', null));
    // bounded: no swing exceeds amplitude × the largest multiplier
    const bound = 40 * SEASONS_TUNING.hardWinterDepletionMult;
    for (let w = 0; w < 52; w += 1) {
      const c = seasonForTick(w);
      for (const v of [null, 'drought', 'hard_winter', 'bountiful']) {
        expect(Math.abs(seasonalSwingPts(c, 'mountain', v))).toBeLessThanOrEqual(bound + 1e-9);
      }
    }
  });
});

describe('the granary arithmetic under the flag (advanceFoodStockpile + seasonal)', () => {
  const ctx = (season, weekOfSeason, { terrain = 'plains', variance = null } = {}) => ({
    season,
    weekOfYear: 1,
    weekOfSeason,
    year: 1,
    variance,
    swingPts: seasonalSwingPts(clock(season, weekOfSeason), terrain, variance),
  });

  test('CONSTITUTIONAL: seasonal absent/null is byte-identical to the legacy call', () => {
    const base = settlementWith({ surplusPct: 12, deficitPct: 0, storageMonths: 2, importDependency: 0.2, resilienceScore: 60 });
    const legacy = advanceFoodStockpile(base, { interval: 'one_week', tick: 5 });
    const explicitNull = advanceFoodStockpile(base, { interval: 'one_week', tick: 5, seasonal: null });
    expect(JSON.stringify(explicitNull)).toBe(JSON.stringify(legacy));
    // and no seasonal key ever appears on the legacy record
    expect(legacy.settlement.economicState.foodSecurity.stockpile).not.toHaveProperty('season');
    expect(legacy.settlement.economicState.foodSecurity.stockpile).not.toHaveProperty('seasonalSwingPct');
  });

  test('harvest banks: an autumn boost fills the granary even for a balanced town', () => {
    const base = settlementWith({ surplusPct: 0, deficitPct: 0, storageMonths: 1, importDependency: 0, resilienceScore: 55 });
    const { settlement, summary } = advanceFoodStockpile(base, {
      interval: 'one_week', tick: 30, seasonal: ctx('autumn', 2),
    });
    expect(summary.storageMonths).toBeGreaterThan(1);
    expect(summary.effectiveDeficitPct).toBe(0);
    const sp = settlement.economicState.foodSecurity.stockpile;
    expect(sp.season).toBe('autumn');
    expect(sp.seasonalSwingPct).toBeGreaterThan(0);
  });

  test('winter draws down: the depletion becomes a deficit the drawdown answers from stores', () => {
    const base = settlementWith({ surplusPct: 0, deficitPct: 0, storageMonths: 2, importDependency: 0, resilienceScore: 55 });
    const { summary } = advanceFoodStockpile(base, {
      interval: 'one_week', tick: 45, seasonal: ctx('winter', 10),
    });
    expect(summary.storageMonths).toBeLessThan(2);            // stores spent
    expect(summary.reliefPct).toBeGreaterThan(0);             // …to relieve the winter cut
    expect(summary.effectiveDeficitPct).toBeLessThanOrEqual(6); // rationed toward Pressured
  });

  test('the hungry gap emerges: an EMPTY granary in late winter shows the unrelieved deficit', () => {
    const base = settlementWith({ surplusPct: 0, deficitPct: 0, storageMonths: 0, importDependency: 0, resilienceScore: 40 });
    const { summary } = advanceFoodStockpile(base, {
      interval: 'one_week', tick: 50, seasonal: ctx('winter', 13),
    });
    // late winter at temperate amplitude cuts 30% of need; nothing to release
    expect(summary.effectiveDeficitPct).toBeGreaterThanOrEqual(25);
  });

  test('a structural surplus absorbs the winter shortfall before it becomes unmet need', () => {
    const base = settlementWith({ surplusPct: 40, deficitPct: 0, storageMonths: 1, importDependency: 0, resilienceScore: 60 });
    const { summary } = advanceFoodStockpile(base, {
      interval: 'one_week', tick: 45, seasonal: ctx('winter', 5, { terrain: 'coastal' }),
    });
    expect(summary.effectiveDeficitPct).toBe(0);   // surplus 40 > coastal winter cut
    expect(summary.storageMonths).toBeGreaterThan(1); // the REMAINDER still banks
  });

  test('composition: the seasonal cut lands on the SAME ledger as a blockade', () => {
    const base = settlementWith({ surplusPct: 0, deficitPct: 0, storageMonths: 0, importDependency: 0.4, resilienceScore: 50 });
    const blockade = { type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['x'] };
    const noSeason = advanceFoodStockpile(base, { interval: 'one_week', tick: 45, blockade });
    const withSeason = advanceFoodStockpile(base, { interval: 'one_week', tick: 45, blockade, seasonal: ctx('winter', 13) });
    expect(withSeason.summary.effectiveDeficitPct).toBeGreaterThan(noSeason.summary.effectiveDeficitPct);
  });
});

describe('season boundary markers (the ONE new news kind)', () => {
  test('harvest fires entering autumn; hungry_gap fires entering month 12, MAJOR only when dire', () => {
    const foodStates = [
      { id: 'a', name: 'Ashford', storageMonths: 2.4, deficitPct: 0 },
      { id: 'b', name: 'Briar', storageMonths: 0.2, deficitPct: 22 },
    ];
    const harvest = seasonalBoundaryEntries({ prevWeeks: 25, weeks: 26, tick: 26, now: 'T', foodStates });
    expect(harvest).toHaveLength(1);
    expect(harvest[0].kind).toBe('season_marker');
    expect(harvest[0].impactKind).toBe('harvest');
    expect(harvest[0].significance).toBe('notable');

    const gapDire = seasonalBoundaryEntries({ prevWeeks: 46, weeks: 47, tick: 47, now: 'T', foodStates });
    expect(gapDire).toHaveLength(1);
    expect(gapDire[0].impactKind).toBe('hungry_gap');
    expect(gapDire[0].significance).toBe('major');
    expect(gapDire[0].settlementIds).toEqual(['b']);

    const gapCalm = seasonalBoundaryEntries({
      prevWeeks: 46, weeks: 47, tick: 47, now: 'T',
      foodStates: [{ id: 'a', name: 'Ashford', storageMonths: 2.4, deficitPct: 0 }],
    });
    expect(gapCalm[0].significance).toBe('notable');

    // no boundary in the window ⇒ no entries; a coarse window crossing both fires both
    expect(seasonalBoundaryEntries({ prevWeeks: 30, weeks: 31, tick: 31, now: 'T', foodStates })).toEqual([]);
    const both = seasonalBoundaryEntries({ prevWeeks: 20, weeks: 52, tick: 1, now: 'T', foodStates });
    expect(both.map((e) => e.impactKind).sort()).toEqual(['harvest', 'hungry_gap']);
  });
});

describe('seasonalContextFor — the kernel-threaded per-settlement context', () => {
  test('resolves terrain through the canonical read and carries the year-stable variance', () => {
    const c = seasonalContextFor({
      rngSeed: 'ctx-seed',
      clock: seasonForTick(40),
      settlement: settlementWith({}, { config: { terrainType: 'mountain' } }),
      settlementId: 'm1',
    });
    expect(c.season).toBe('winter');
    expect(c.swingPts).toBeLessThan(0);
    expect(c.variance).toBe(seasonalSeverityFor('ctx-seed', c.year, 'm1'));
    // mountain amplitude beats temperate at the same week
    const t = seasonalContextFor({
      rngSeed: 'ctx-seed', clock: seasonForTick(40),
      settlement: settlementWith({}), settlementId: 'm1',
    });
    expect(Math.abs(c.swingPts)).toBeGreaterThan(Math.abs(t.swingPts));
  });
});
