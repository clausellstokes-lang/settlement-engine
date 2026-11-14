/**
 * tests/generators/originChannelsRead.test.js — R2-CODE-A-4, round three's #7 and the increment's ww-3 and ww-29
 * (`narrativeGenerator.js :: generateSettlementReason`'s `supportChannels`, spliced into
 * `settlementOriginProse.js :: ORIGIN_POOLS['isolated.deficit']`):
 * - #7, rr2s-thorp-calm-rand-1: "The shortfall is met through carriage by magic, the caravans that still come, the roads
 *   in a good season, or the favour of a patron…" where the isolation receipt holds only the local foodshed and seasonal
 *   access and the page says "No food comes into Sahlfort by trade".
 * - ww-3 (rww-thorp-calm-1) and ww-29 (rww-hamlet-famine-1): the same fixed list beside "Reliance on magic: None".
 * RULED: the list is read from the record's own isolation receipt; a shortfall the food record brings nothing in for
 * names no channel and says what the record holds.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { supportChannelsOf, holdingsOf } from '../../src/generators/narrative/settlementOriginProse.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const CHANNEL_WORDS = /carriage by magic|caravans|favour of a patron|roads in a good season|tracks in a good season|carts from the country/;

describe('the channels are the receipt\'s own', () => {
  it('one phrase a path that carries food in from outside, none for a path the receipt lacks', () => {
    expect(supportChannelsOf({ paths: [{ type: 'local_foodshed' }, { type: 'seasonal_access', evidence: ['inferred:local tracks only'] }] }))
      .toBe('the tracks in a good season');
    expect(supportChannelsOf({ paths: [{ type: 'seasonal_access', evidence: ['institution:Caravanserai'] }, { type: 'patronage' }] }))
      .toBe('the caravans that still come or the favour of a patron');
    expect(supportChannelsOf({ paths: [{ type: 'magical_transit' }, { type: 'hinterland' }, { type: 'seasonal_access' }, { type: 'patronage' }] }))
      .toBe('carriage by magic, carts from the country around it, the tracks in a good season, or the favour of a patron');
    expect(supportChannelsOf({ paths: [{ type: 'local_foodshed' }, { type: 'reserves' }] })).toBe(null);
  });
  it('what the record holds', () => {
    expect(holdingsOf({ paths: [{ type: 'local_foodshed' }, { type: 'reserves' }] })).toBe('what it has in store and what it produces itself');
    expect(holdingsOf({ paths: [{ type: 'local_foodshed' }] })).toBe('what it produces itself');
  });
});

describe("the readers' towns, born as the app births them", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed */
  const born = (seed) => {
    const m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:rww|rr2s)-(\w+)-([a-z_+]+)-(?:rand-)?\d+$/));
    return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
  };
  it('nothing comes in, and no channel is named (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(['rr2s-thorp-calm-rand-1', 'rww-thorp-calm-1', 'rww-hamlet-famine-1'], (seed) => {
      const s = born(seed);
      expect(s.config.tradeRouteAccess, `${seed}: isolated`).toBe('isolated');
      expect(s.economicState.foodSecurity.importCoverage, `${seed}: nothing comes in`).toBe(0);
      expect(s.settlementReason[0], `${seed}: gets by on what it has`).toMatch(/gets by on what/);
      expect(CHANNEL_WORDS.test(s.settlementReason[0]), `${seed}: ${s.settlementReason[0]}`).toBe(false);
    }), 'nothing comes in, and no channel is named');
  });
  it('rww-village-famine-1: food comes in, and the receipt\'s own channels are named', () => {
    const s = born('rww-village-famine-1');
    expect(s.economicState.foodSecurity.importCoverage).toBeGreaterThan(0);
    expect(s.settlementReason[0]).toContain('carts from the country around it or the tracks in a good season');
    expect(/carriage by magic|patron|caravans/.test(s.settlementReason[0])).toBe(false);
  });
});
