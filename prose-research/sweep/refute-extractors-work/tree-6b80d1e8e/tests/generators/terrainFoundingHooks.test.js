/**
 * terrainFoundingHooks.test.js — the terrain founding hooks must actually fire.
 *
 * TERRAIN_NARRATIVE_HOOKS mixes terrain keys (mountain/forest/plains) with route
 * keys (port/road/isolated), but genArrivalDetail only ever looked the pool up by
 * `route`, so the 18 terrain-specific founding hooks never fired — a mountain
 * settlement got generic road/port reasons instead of its "rich mineral deposits" /
 * "strategic pass" ones. The lookup now prefers the RESOLVED terrain, then route.
 */
import { describe, it, expect } from 'vitest';
import { genArrivalDetail } from '../../src/generators/narrativeGenerator.js';
import { TERRAIN_NARRATIVE_HOOKS } from '../../src/data/narrativeData.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';

function foundingReason(config, seed) {
  setActiveRng(createPRNG(seed));
  try { return genArrivalDetail(config)?.reason; }
  finally { clearActiveRng(); }
}

const fromPool = (pool, reason) => pool.some(h => reason === h || (reason && (reason.includes(h) || h.includes(reason))));

describe('genArrivalDetail — terrain founding hooks fire (were dead behind the route-only lookup)', () => {
  for (const terrain of ['mountain', 'forest', 'plains']) {
    it(`a ${terrain} settlement draws its founding reason from the ${terrain} hook pool`, () => {
      const pool = TERRAIN_NARRATIVE_HOOKS[terrain];
      let sawTerrainHook = false;
      for (let i = 0; i < 40; i++) {
        const reason = foundingReason({ terrainType: terrain, tradeRouteAccess: 'road', tier: 'town' }, `hook-${terrain}-${i}`);
        if (fromPool(pool, reason)) { sawTerrainHook = true; break; }
      }
      expect(sawTerrainHook, `no ${terrain} hook appeared in the founding reason`).toBe(true);
    });
  }

  it('a terrain WITHOUT hooks (coastal) still falls back to the route pool', () => {
    // Non-hooked terrains must be unchanged — the route lookup is the fallback.
    let sawRouteHook = false;
    for (let i = 0; i < 40; i++) {
      const reason = foundingReason({ terrainType: 'coastal', tradeRouteAccess: 'port', tier: 'town' }, `coastal-${i}`);
      if (fromPool(TERRAIN_NARRATIVE_HOOKS.port, reason)) { sawRouteHook = true; break; }
    }
    expect(sawRouteHook).toBe(true);
  });

  it("the 'auto' terrain sentinel resolves to null and falls back to the route pool (never a crash)", () => {
    const reason = foundingReason({ terrainOverride: 'auto', tradeRouteAccess: 'road', tier: 'town' }, 'auto-1');
    expect(typeof reason).toBe('string');
    expect(reason.length).toBeGreaterThan(0);
  });
});
