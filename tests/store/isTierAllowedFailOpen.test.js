/**
 * tests/store/isTierAllowedFailOpen.test.js — B11-store finding #12.
 *
 * isTierAllowed gated via `TIER_RANK[settlementTier] <= TIER_RANK[maxTier]`.
 * For a tier absent from TIER_RANK (the 'random'/'custom' sentinels, or any
 * unknown value), the lookup is undefined and `undefined <= n` evaluates to
 * false — silently clamping a sentinel to DISALLOWED. The live caller guards
 * the sentinels first, so there was no active bug, but the gate was unsafe in
 * isolation. The fix fails OPEN for unranked tiers while still gating ranked
 * ones.
 */
import { describe, it, expect } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createAuthSlice } from '../../src/store/authSlice.js';

function makeStore() {
  return create(immer((...a) => ({ ...createAuthSlice(...a) })));
}

describe('isTierAllowed fail-open for unranked tiers (finding #12)', () => {
  it('still gates RANKED tiers by the user max (anon caps at town)', () => {
    const store = makeStore();
    // anon maxAllowedTier is 'town' (rank 3).
    expect(store.getState().isTierAllowed('hamlet')).toBe(true);  // 1 <= 3
    expect(store.getState().isTierAllowed('town')).toBe(true);    // 3 <= 3
    expect(store.getState().isTierAllowed('city')).toBe(false);   // 4 <= 3 -> no
    expect(store.getState().isTierAllowed('metropolis')).toBe(false); // 5 <= 3
  });

  it('fails OPEN for sentinel/unknown tiers instead of silently clamping false', () => {
    const store = makeStore();
    expect(store.getState().isTierAllowed('random')).toBe(true);
    expect(store.getState().isTierAllowed('custom')).toBe(true);
    expect(store.getState().isTierAllowed('not-a-tier')).toBe(true);
    expect(store.getState().isTierAllowed(undefined)).toBe(true);
  });

  it('elevated roles bypass the gate entirely', () => {
    const store = makeStore();
    store.setState(s => { s.auth.role = 'admin'; });
    expect(store.getState().isTierAllowed('metropolis')).toBe(true);
    expect(store.getState().isTierAllowed('random')).toBe(true);
  });
});
