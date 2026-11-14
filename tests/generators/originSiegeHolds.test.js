/**
 * tests/generators/originSiegeHolds.test.js — R2-CODE-A-4, round two's #215 (ruled to this lane) and the increment's
 * ww-475 (`narrativeGenerator.js :: generateSettlementReason`, `settlementOriginProse.js :: ORIGIN_POOLS`):
 * the isolated shortfall's "…through carriage by magic, the caravans that still come, the roads in a good season…"
 * printed under a siege that cuts every road (rww-town-under_siege-1: "Enemies are camped around Sanctavallis, and
 * nothing comes in by road"). RULED: under a siege in force that cuts the roads no channel of trade is named as open;
 * the sentence says what the record holds (what the town has in store, what it makes itself), or it does not print.
 * The metropolis's and the city's tier lines name trade as open too ("Everything in the region is bought, sold or
 * decided here."): under a siege they say it of ordinary times.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { generateSettlementReason } from '../../src/generators/narrativeGenerator.js';

const CHANNEL_WORDS = /carriage by magic|caravans|favour of a patron|in a good season|carts from the country/;

describe('the tier lines under a siege', () => {
  it('a besieged metropolis and city name no trade as open now', () => {
    expect(generateSettlementReason('metropolis', 'road', null, { stressTypes: ['under_siege'] })[1])
      .toBe('In ordinary times everything in the region is bought, sold or decided here.');
    expect(generateSettlementReason('city', 'road', null, { stressTypes: ['under_siege'] }, { dailyNeed: 100, dailyProduction: 100, deficit: 0, rawDeficit: 0 })[1])
      .toBe('Large enough to feed itself; in ordinary times its trade brings extras, not the essentials.');
    expect(generateSettlementReason('metropolis', 'road', null, {})[1]).toBe('Everything in the region is bought, sold or decided here.');
  });
});

describe("the readers' towns, born as the app births them", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed */
  const born = (seed) => {
    const m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:rww|rpf)-(\w+)-([a-z_+]+)-\d+$/));
    return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
  };
  it('no channel is named open; what the record holds is (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(['rww-town-under_siege-1', 'rpf-town-under_siege+famine-13'], (seed) => {
      const s = born(seed);
      expect(s.config.tradeRouteAccess, `${seed}: isolated`).toBe('isolated');
      expect(s.config.stressTypes, `${seed}: under siege`).toContain('under_siege');
      expect(s.settlementReason[0], `${seed}: the siege is named`).toMatch(/siege|besieged/);
      expect(s.settlementReason[0], `${seed}: what the record holds is named`).toContain('what it has in store and what it produces itself');
      expect(CHANNEL_WORDS.test(s.settlementReason[0]), `${seed}: ${s.settlementReason[0]}`).toBe(false);
    }), 'no channel is named open; what the record holds is');
  });
  it('rww-metropolis-under_siege-1: the metropolis line says it of ordinary times', () => {
    expect(born('rww-metropolis-under_siege-1').settlementReason[1]).toBe('In ordinary times everything in the region is bought, sold or decided here.');
  });
});
