/**
 * tests/generators/fishRowOnWater.test.js — F3 FOOD-WORDS unit 3 (the chair's ruling,
 * 2026-11-04): a licensed fishing row on water IS a fish source. The food record is the one home
 * of the food sources, so it counts the evidence the roster carries: where the water fact
 * (domain/tradeRouteSemantics.js :: waterAccessKind) is not 'none' and a fishing row stands (a
 * Fisher's landing, a fishery, a fish market), fish is a source even when the terrain rolled no
 * fishing_grounds / river_fish resource. A Fishmonger is a trader, not a catch.
 * Red before the cure: soak1k-890, a port village with a Fisher's landing and a Fishmonger, had
 * no fish source, so the Fishmonger's "The trade that carries fish from the net to the table."
 * read as a claim the record denied.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { foodWordsFindings } from '../../src/domain/coherence/foodWordsFindings.js';
import { waterAccessKind } from '../../src/domain/tradeRouteSemantics.js';

describe('a fishing row on water is a fish source', () => {
  beforeAll(async () => { await ensureLaws(); });
  it('soak1k-890: the port village\'s record holds fish, and the Fishmonger\'s line is licensed by it', () => {
    const { settlement: s, config } = birth(890);
    expect(waterAccessKind(config.terrainType, config.tradeRouteAccess)).toBe('maritime');
    expect(s.economicState.foodSecurity.foodRecord.foodSources).toContain('fish');
    const fishmonger = s.institutions.find((/** @type {any} */ x) => x.name === 'Fishmonger');
    expect(foodWordsFindings(s, fishmonger.desc)).toEqual([]);
  });
  it('soak1k-116 and soak1k-152: an inland Fish market is no catch', () => {
    for (const i of [116, 152]) {
      const { settlement: s, config } = birth(i);
      expect(waterAccessKind(config.terrainType, config.tradeRouteAccess), `soak1k-${i} is inland`).toBe('none');
      expect(s.institutions.some((/** @type {any} */ x) => x.name === 'Fish market'), `soak1k-${i} keeps a Fish market`).toBe(true);
      expect(s.economicState.foodSecurity.foodRecord.foodSources, `soak1k-${i}'s record holds no fish`).not.toContain('fish');
    }
  });
});
