/**
 * tests/generators/regenRngRestore.test.js — nested-regen RNG save/restore.
 *
 * regenNPCsPipeline / regenHistoryPipeline set an active seeded RNG for the
 * duration of the reroll and clear it in a finally. They used to clear it to
 * NULL unconditionally, assuming generation is never nested — so a regen called
 * from inside an outer seeded run would wipe the outer RNG, silently dropping
 * the rest of that run's draws to the Math.random() fallback. The fix saves the
 * prior RNG (setActiveRng returns it) and restores it. These tests reproduce the
 * re-entrant case: an outer RNG must survive a nested regen.
 */

import { describe, it, expect } from 'vitest';
import { setActiveRng, clearActiveRng, getActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { regenNPCsPipeline, regenHistoryPipeline } from '../../src/generators/generateSettlementPipeline.js';

const SETTLEMENT = {
  tier: 'village',
  institutions: [{ name: 'Common Field', category: 'Economy' }, { name: 'Village Granary', category: 'Economy' }],
  powerStructure: { factions: [] },
  economicState: {},
  economicViability: {},
};
const CONFIG = { culture: 'germanic', tier: 'village' };

describe('regen pipelines restore the prior active RNG (re-entrancy)', () => {
  it('regenNPCsPipeline restores an outer RNG instead of clearing to null', () => {
    const outer = createPRNG('outer-run');
    setActiveRng(outer);
    try {
      regenNPCsPipeline(SETTLEMENT, CONFIG, { seed: 'nested' });
      // Old behaviour: clearActiveRng() → getActiveRng() === null here.
      expect(getActiveRng()).toBe(outer);
    } finally {
      clearActiveRng();
    }
  });

  it('regenHistoryPipeline restores an outer RNG instead of clearing to null', () => {
    const outer = createPRNG('outer-run');
    setActiveRng(outer);
    try {
      regenHistoryPipeline(SETTLEMENT, CONFIG, { seed: 'nested' });
      expect(getActiveRng()).toBe(outer);
    } finally {
      clearActiveRng();
    }
  });

  it('still clears to null when there was no outer RNG (non-nested path)', () => {
    clearActiveRng();
    regenNPCsPipeline(SETTLEMENT, CONFIG, { seed: 'standalone' });
    expect(getActiveRng()).toBeNull();
  });
});
