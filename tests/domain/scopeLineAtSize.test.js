/**
 * R2-CODE-B item 5 — THE CULTURE SCOPE LINE AT THE PLACE'S SIZE (the cold list REVIEW-W2A-3,
 * f385d487b: MEDIUM #323 "built in masonry around a civic square" for a hamlet of 41; #365 "built
 * around kin districts and an assembly ground, on pasture" for a forest hamlet of 53; #498 "in
 * quarters by trade and kin" for a village of 105; #816 "built around the agora" where no market
 * stands). The chair's size ruling of 2026-11-13: streets, an agora, a civic or market square,
 * masonry, neighbourhoods and suburbs are a size error in a thorp or a hamlet; quarters and
 * districts (wards) below the middling population band.
 */
import { describe, expect, test } from 'vitest';
import { cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { populationBandOf } from '../../src/domain/facts/populationBand.js';

const TINY_WORDS = /\bstreets\b|\bagora\b|civic square|market square|masonry|neighbourhood|suburb|plaza/i;
const SMALL_WORDS = /\bquarters\b|\bdistricts?\b|\bwards\b/i;
const town = (key, label, tier, population, extra = {}) => ({
  name: 'X', _seed: 's1', tier, population, culturalIdentity: { key, label },
  config: { terrainType: 'forest', tradeRouteAccess: 'road', nearbyResources: [] },
  institutions: [{ name: 'Dwellings (5-25)' }], economicState: { compound: { inst: { hasMarket: false } } }, ...extra,
});

describe('the scope line says nothing a place of its size lacks', () => {
  test('six small places of six cultures', () => {
    const TABLE = [
    ['latin', 'Latin-inspired', 'hamlet', 41],
    ['celtic', 'Celtic-inspired', 'hamlet', 53],
    ['south_asian', 'South-Asian-inspired', 'village', 105],
    ['greek', 'Greek-inspired', 'village', 300],
    ['east_asian', 'East-Asian-inspired', 'village', 200],
    ['mesoamerican', 'Mesoamerican-inspired', 'thorp', 20],
    ];
    for (const [key, label, tier, pop] of TABLE) {
      const line = cultureScopeLine(town(key, label, tier, pop));
      expect(line.startsWith(label), line).toBe(true);
      const bad = (/^(thorp|hamlet)$/.test(tier) && TINY_WORDS.test(line)) || SMALL_WORDS.test(line) || /agora/.test(line) || /pasture/.test(line);
      expect(bad, line).toBe(false);
    }
  });
  test('a town keeps its masonry square, and its kin districts', () => {
    expect(cultureScopeLine(town('latin', 'Latin-inspired', 'town', 3000))).toContain('built in masonry around a civic square');
    expect(cultureScopeLine(town('celtic', 'Celtic-inspired', 'town', 3000))).toContain('kin districts');
  });
  test('generated small places: no scope line carries a word of the wrong size', () => {
    const wrong = [];
    let read = 0;
    const CULTURES = ['latin', 'celtic', 'south_asian', 'greek', 'east_asian', 'mesoamerican'];
    for (let i = 0; i < 36; i++) {
      const s = generateSettlementPipeline({ settType: ['thorp', 'hamlet', 'village'][i % 3], culture: CULTURES[i % 6] }, null, { seed: `r2b-scope-${i}`, customContent: {} });
      const line = cultureScopeLine(s);
      if (!line) continue;
      read += 1;
      const tiny = ['thorp', 'hamlet'].includes(s.tier);
      if ((tiny && TINY_WORDS.test(line)) || (populationBandOf(s) === 'small' && SMALL_WORDS.test(line))) wrong.push(`r2b-scope-${i} ${s.tier} ${s.population}: ${line}`);
    }
    expect(read).toBeGreaterThan(20);
    expect(wrong).toEqual([]);
  });
});
