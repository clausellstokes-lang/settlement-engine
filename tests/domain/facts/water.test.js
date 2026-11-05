/**
 * tests/domain/facts/water.test.js — CENSUS-1 wave 0, fact 4: THE WATER HOME.
 *
 * RED-FIRST. The First Landing tradition element ("Landfall") kept a base weight of 1.5 in the
 * founding draw and 0.25 in the addition draw wherever the place had no water, so a plains town on
 * a road founded itself on a landing — the cause of reader:traditions-water (15.8% at CENSUS-0).
 * The first arm was red at the window tip through `deriveFoundingTraditions` alone.
 *
 * THIS UNIT MOVES BIRTHS BY ITS CAUSE (the lane brief's one exception): the traditions are drawn
 * at display, so the golden master's 525 records do not move; 12 of soak1k-0..59's rendered pages
 * do (inland places whose element draw re-weighted).
 *
 * @enforced-by npx vitest run tests/domain/facts/water.test.js
 */
import { describe, expect, it } from 'vitest';
import { deriveFoundingTraditions } from '../../../src/domain/traditions/genesis.js';

const elementsOf = (config, n) => {
  const seen = new Set();
  for (let i = 0; i < n; i += 1) {
    for (const t of deriveFoundingTraditions({ _seed: `water-${i}`, tier: 'city', population: 9000, config })) {
      seen.add(t.coreMotif?.element);
    }
  }
  return seen;
};

describe('the water home (CENSUS-1 fact 4)', () => {
  it('RED-FIRST: no place without water founds or adds a First Landing', () => {
    expect(elementsOf({ terrainType: 'plains', tradeRouteAccess: 'road' }, 150).has('first-landing')).toBe(false);
    expect(elementsOf({ terrainType: 'hills', tradeRouteAccess: 'isolated' }, 150).has('first-landing')).toBe(false);
  });

  it('RED-FIRST (CENSUS-1c unit 6, the vocabulary rulings §6): no place without water founds or adds a Tide or a River tradition', () => {
    for (const cfg of [{ terrainType: 'plains', tradeRouteAccess: 'road' }, { terrainType: 'hills', tradeRouteAccess: 'isolated' }, { terrainType: 'desert', tradeRouteAccess: 'road' }]) {
      const els = elementsOf(cfg, 200);
      expect(els.has('tide'), JSON.stringify(cfg)).toBe(false);
      expect(els.has('river'), JSON.stringify(cfg)).toBe(false);
    }
  });

  it('a coastal or riverside place still can', () => {
    expect(elementsOf({ terrainType: 'coastal', tradeRouteAccess: 'port' }, 200).has('tide')).toBe(true);
    expect(elementsOf({ terrainType: 'riverside', tradeRouteAccess: 'river' }, 200).has('river')).toBe(true);
  });

  it('a place on the coast, a river or a port route still can', () => {
    expect(elementsOf({ terrainType: 'coastal', tradeRouteAccess: 'port' }, 60).has('first-landing')).toBe(true);
    expect(elementsOf({ terrainType: 'hills', tradeRouteAccess: 'port' }, 60).has('first-landing')).toBe(true);
    expect(elementsOf({ terrainType: 'plains', tradeRouteAccess: 'river' }, 60).has('first-landing')).toBe(true);
  });

  it('the one reader is waterAccessKind over the terrain home', async () => {
    const { waterOf } = await import('../../../src/domain/facts/water.js');
    expect(waterOf({ config: { terrainType: 'coastal', tradeRouteAccess: 'road' } }).kind).toBe('maritime');
    expect(waterOf({ config: { terrainType: 'riverside', tradeRouteAccess: 'port' } }).kind).toBe('river');
    expect(waterOf({ config: { terrainType: 'hills', tradeRouteAccess: 'port' } })).toMatchObject({ kind: 'maritime', navigable: true, coast: true });
    expect(waterOf({ config: { terrainType: 'desert' } })).toMatchObject({ kind: 'none', navigable: false });
    expect(waterOf({ terrain: 'Coastal' }).kind).toBe('maritime');
  });
});
