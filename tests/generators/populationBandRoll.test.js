/**
 * tests/generators/populationBandRoll.test.js — X-46 THE HISTORICAL SCALE, car 1 (ODQ §934.104).
 *
 * The owner's historical table, executed: twenty generated settlements per tier land inside the
 * owner's resident band for the tier the DM chose. The table is spelled here as the owner wrote
 * it (the spec), not read back from the engine, so a drift in POPULATION_RANGES reds this file
 * rather than redefining it. The owner withdrew the household count (2026-11-03: "You can
 * remove the household count."), so the record carries residents only.
 */
import { describe, expect, test } from 'vitest';

import { popToTier } from '../../src/data/constants.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const OWNER_TABLE = {
  thorp:      [5, 30],
  hamlet:     [20, 100],
  village:    [75, 400],
  town:       [300, 2500],
  city:       [2000, 15000],
  metropolis: [15000, 1000000], // the owner, 2026-11-04: the roll thins past 50,000 to 1,000,000 (car 1b)
};

const generate = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });

describe('the owner\'s table, generated', () => {
  test('twenty settlements per tier: residents inside the owner\'s band, tier as chosen, no household count', () => {
    const outside = [];
    for (const [tier, [lo, hi]] of Object.entries(OWNER_TABLE)) {
      for (let i = 0; i < 20; i++) {
        const seed = `x46-band-${tier}-${i}`;
        const record = generate({ settType: tier, tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat' }, seed);
        if (record.tier !== tier) outside.push(`${seed}: tier ${record.tier}`);
        if (!(record.population >= lo && record.population <= hi)) outside.push(`${seed}: population ${record.population}`);
        if (Object.hasOwn(record, 'households')) outside.push(`${seed}: carries households`);
      }
    }
    expect(outside).toEqual([]); // anchored: every row above is a generated record of the chosen tier
  });

  test("a 'custom' population of 60 generates a hamlet", () => {
    const record = generate({ settType: 'custom', population: 60 }, 'x46-custom-60');
    expect(record.tier).toBe('hamlet');
    expect(record.population).toBe(60);
  });

  test('the DM\'s chosen thorp keeps its tier above the stamp\'s cut: a rolled population of 25-30 stays a thorp', () => {
    const above = [];
    for (let i = 0; i < 60; i++) {
      const record = generate({ settType: 'thorp' }, `x46-thorp-cut-${i}`);
      if (record.population >= 25) above.push(record);
    }
    // The stamp would call these hamlets; the DM chose thorp, and the choice wins.
    expect(above.length).toBeGreaterThan(0);
    expect(above.map(r => popToTier(r.population))).toEqual(above.map(() => 'hamlet'));
    expect(above.map(r => r.tier)).toEqual(above.map(() => 'thorp'));
  });
});
