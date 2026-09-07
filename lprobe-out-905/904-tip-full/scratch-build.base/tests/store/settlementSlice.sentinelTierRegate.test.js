/**
 * tests/store/settlementSlice.sentinelTierRegate.test.js — sentinel tier re-gate.
 *
 * authSlice deliberately lets the 'random'/'custom' settType sentinels through
 * isTierAllowed (the settlement's size isn't known until the engine resolves
 * it) on the documented promise that the ROLLED tier is "re-gated at
 * generation". That re-gate was missing: generateSettlement's pre-gate skipped
 * both sentinels and nothing checked the RESOLVED tier afterward, so an anon
 * (max 'town') could mint a metropolis by typing a custom population or
 * rolling Random. These tests pin the re-gate: a sentinel generation whose
 * resolved tier exceeds the user's cap returns null and commits nothing, while
 * an in-cap sentinel generation still lands.
 *
 * The harness mirrors settlementSlice.test.js / pendingEditsQueueReset.test.js:
 * a real zustand store built from createSettlementSlice plus minimal stubs.
 * isTierAllowed reproduces authSlice's exact semantics (sentinel allowlist +
 * ranked fail-closed comparison) at the ANON cap ('town').
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';

// Mirrors authSlice's TIER_RANK + ALLOWED_UNRANKED_TIERS with maxTier 'town'
// (the anonymous cap). Fail-closed on unknown values, exactly like the real gate.
const TIER_RANK = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, capital: 5, metropolis: 5 };
const anonTierAllowed = (tier) => {
  if (tier === 'random' || tier === 'custom') return true;
  const rank = TIER_RANK[tier];
  return rank !== undefined && rank <= TIER_RANK.town;
};

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: {
    settType: 'custom',
    population: 30000, // metropolis-sized — individual tests override
    culture: 'germanic',
    tradeRouteAccess: 'road',
    monsterThreat: 'frontier',
    selectedStressesRandom: false,
    selectedStresses: [],
  },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  aiSettlement: null,
  aiDailyLife: null,
  aiDataVersion: null,
  aiSourceFingerprint: null,
  showNarrative: false,
  isTierAllowed: anonTierAllowed,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

describe('generateSettlement — sentinel ("random"/"custom") tier re-gate', () => {
  let store;
  beforeEach(() => { store = makeStore(); });

  test('custom population above the tier cap is blocked AFTER resolution (returns null, commits nothing)', async () => {
    store.setState(s => { s.config.settType = 'custom'; s.config.population = 30000; }); // → metropolis
    const result = await store.getState().generateSettlement();
    expect(result).toBeNull();
    // Nothing committed: no settlement, no seed, no pipeline history.
    expect(store.getState().settlement).toBeNull();
    expect(store.getState().lastSeed).toBeNull();
    expect(store.getState().pipelineHistory).toEqual([]);
  });

  test('custom population inside the tier cap still generates', async () => {
    store.setState(s => { s.config.settType = 'custom'; s.config.population = 800; }); // → village
    const result = await store.getState().generateSettlement();
    expect(result).not.toBeNull();
    expect(result.tier).toBe('village');
    expect(store.getState().settlement).toBe(result);
  });

  test('a blocked sentinel generation does not clobber the on-screen settlement', async () => {
    store.setState(s => { s.config.settType = 'custom'; s.config.population = 800; });
    const first = await store.getState().generateSettlement();
    expect(first).not.toBeNull();

    store.setState(s => { s.config.population = 30000; });
    const blocked = await store.getState().generateSettlement();
    expect(blocked).toBeNull();
    expect(store.getState().settlement).toBe(first);
  });

  test('ranked settTypes above the cap are still blocked by the pre-gate', async () => {
    store.setState(s => { s.config.settType = 'city'; });
    const result = await store.getState().generateSettlement();
    expect(result).toBeNull();
    expect(store.getState().settlement).toBeNull();
  });
});
