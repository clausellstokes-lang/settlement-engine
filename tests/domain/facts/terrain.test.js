/**
 * tests/domain/facts/terrain.test.js — CENSUS-1 wave 0, fact 13: THE TERRAIN-CLASS HOME.
 * The reader battery and the soak's checks read the terrain through two different fallback chains
 * (the checks read a top-level `terrain` BEFORE `config.terrainOverride`, the battery after it);
 * both now read this one. A definition test: the checks' private `hasWater` is covered by the soak.
 * @enforced-by npx vitest run tests/domain/facts/terrain.test.js
 */
import { describe, expect, it } from 'vitest';
import { terrainOf, routeOf } from '../../../src/domain/coherence/readerBattery.js';

describe('the terrain-class home (CENSUS-1 fact 13)', () => {
  it('one chain: terrainType, terrainOverride, terrain, resourceAnalysis.terrain', async () => {
    const { terrainClassOf } = await import('../../../src/domain/facts/terrain.js');
    const cases = [
      { config: { terrainType: 'hills', terrainOverride: 'coastal' } },
      { config: { terrainOverride: 'coastal' }, terrain: 'forest' },
      { terrain: 'Forest', resourceAnalysis: { terrain: 'desert' } },
      { resourceAnalysis: { terrain: 'desert' } },
      {},
    ];
    expect(cases.map(terrainClassOf)).toEqual(['hills', 'coastal', 'forest', 'desert', '']);
    expect(cases.map(terrainOf)).toEqual(cases.map(terrainClassOf));
    expect(routeOf({ config: { tradeRouteAccess: 'Port' } })).toBe('port');
  });
});
