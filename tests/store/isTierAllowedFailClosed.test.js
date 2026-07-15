/**
 * tests/store/isTierAllowedFailClosed.test.js — B11-store finding #12 (hardened).
 *
 * isTierAllowed is a PERMISSION GATE: it decides whether the user's account tier
 * permits generating a given settlement size. The earlier implementation gated
 * via `TIER_RANK[settlementTier] <= TIER_RANK[maxTier]` and was then "fixed" to
 * fail OPEN for any tier absent from TIER_RANK — returning true for the
 * 'random'/'custom' sentinels but ALSO for typos, undefined, and any tampered
 * value. Fail-open in a permission gate is a hole.
 *
 * The gate now fails CLOSED: only known ranked tiers (compared against the
 * user's max) and the explicitly-allowlisted wizard sentinels ('random' /
 * 'custom') pass. Every other unranked value — undefined, typos, tampered
 * strings — is denied.
 */
import { describe, it, expect } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createAuthSlice } from '../../src/store/authSlice.js';

function makeStore() {
  return create(immer((...a) => ({ ...createAuthSlice(...a) })));
}

describe('isTierAllowed fails CLOSED for unknown tiers (finding #12)', () => {
  it('still gates RANKED tiers by the user max (anon caps at town)', () => {
    const store = makeStore();
    // anon maxAllowedTier is 'town' (rank 3).
    expect(store.getState().isTierAllowed('thorp')).toBe(true);   // 0 <= 3
    expect(store.getState().isTierAllowed('hamlet')).toBe(true);  // 1 <= 3
    expect(store.getState().isTierAllowed('town')).toBe(true);    // 3 <= 3
    expect(store.getState().isTierAllowed('city')).toBe(false);   // 4 <= 3 -> no
    expect(store.getState().isTierAllowed('capital')).toBe(false); // 5 <= 3 -> no
    expect(store.getState().isTierAllowed('metropolis')).toBe(false); // 5 <= 3
  });

  it('a higher-tier account gates ranked tiers by ITS larger max', () => {
    const store = makeStore();
    store.setState(s => { s.auth.tier = 'free'; }); // free maxAllowedTier = metropolis
    expect(store.getState().isTierAllowed('city')).toBe(true);       // 4 <= 5
    expect(store.getState().isTierAllowed('capital')).toBe(true);    // 5 <= 5
    expect(store.getState().isTierAllowed('metropolis')).toBe(true); // 5 <= 5
  });

  it('ALLOWS the legitimate wizard sentinels (random/custom)', () => {
    const store = makeStore();
    // These are real <option> values in ConfigurationPanel and are NOT subject
    // to the size paywall — configSlice.setSettlementType relies on them passing.
    expect(store.getState().isTierAllowed('random')).toBe(true);
    expect(store.getState().isTierAllowed('custom')).toBe(true);
  });

  it('fails CLOSED for unknown / tampered / undefined tiers', () => {
    const store = makeStore();
    expect(store.getState().isTierAllowed('not-a-tier')).toBe(false);
    expect(store.getState().isTierAllowed('METROPOLIS')).toBe(false); // case-mismatch
    expect(store.getState().isTierAllowed('admin')).toBe(false);      // role string, not a tier
    expect(store.getState().isTierAllowed('')).toBe(false);
    expect(store.getState().isTierAllowed(undefined)).toBe(false);
    expect(store.getState().isTierAllowed(null)).toBe(false);
    expect(store.getState().isTierAllowed(42)).toBe(false);
    expect(store.getState().isTierAllowed({})).toBe(false);
  });

  it('fails CLOSED even if the resolved max tier is somehow unranked', () => {
    const store = makeStore();
    // Defense-in-depth: stub maxAllowedTier to an unranked value and confirm the
    // gate denies rather than comparing a real rank against undefined.
    const orig = store.getState().maxAllowedTier;
    store.setState(s => { s.maxAllowedTier = () => 'not-a-real-tier'; });
    expect(store.getState().isTierAllowed('thorp')).toBe(false); // unranked max -> deny
    store.setState(s => { s.maxAllowedTier = orig; });
  });

  it('elevated roles bypass the gate entirely (including unknown values)', () => {
    const store = makeStore();
    store.setState(s => { s.auth.role = 'admin'; });
    expect(store.getState().isTierAllowed('metropolis')).toBe(true);
    expect(store.getState().isTierAllowed('random')).toBe(true);
    expect(store.getState().isTierAllowed('not-a-tier')).toBe(true);
    expect(store.getState().isTierAllowed(undefined)).toBe(true);
    store.setState(s => { s.auth.role = 'developer'; });
    expect(store.getState().isTierAllowed('not-a-tier')).toBe(true);
  });
});
