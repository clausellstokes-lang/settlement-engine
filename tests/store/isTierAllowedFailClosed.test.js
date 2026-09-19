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
 *
 * ⛔ THE GATE IS A RANGE SINCE §934.34 (car e7c85a66b), AND THIS FILE HAD NOT BEEN
 * TOLD. `TIER_GATE.anon.minTier` became 'hamlet' — a thorpe requires an account — so
 * `isTierAllowed('thorp')` at an anonymous visitor went from true to false while the
 * arm below still asserted the old answer with the old arithmetic in its comment
 * ("0 <= 3"). The floor is asserted here now, in both directions, because a
 * permission gate with an unpinned bound is half a gate.
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
    // anon is a RANGE: minAllowedTier 'hamlet' (rank 1) .. maxAllowedTier 'town' (rank 3).
    expect(store.getState().isTierAllowed('thorp')).toBe(false);  // 0 >= 1 -> no (§934.34)
    expect(store.getState().isTierAllowed('hamlet')).toBe(true);  // 1 in [1, 3]
    expect(store.getState().isTierAllowed('town')).toBe(true);    // 3 in [1, 3]
    expect(store.getState().isTierAllowed('city')).toBe(false);   // 4 <= 3 -> no
    expect(store.getState().isTierAllowed('capital')).toBe(false); // 5 <= 3 -> no
    expect(store.getState().isTierAllowed('metropolis')).toBe(false); // 5 <= 3
  });

  it('names WHICH bound refused, because the two owe opposite sentences', () => {
    // ⛔ A RANGE REFUSES FOR TWO REASONS AND THE READER MUST BE TOLD THE RIGHT ONE. With
    // one boolean the gate could only raise the ceiling's copy, which told an anonymous
    // visitor asking for a thorpe that it was "past what this account forges".
    const store = makeStore();
    expect(store.getState().isTierBelowFloor('thorp'), 'the floor refusal is not named as one').toBe(true);
    expect(store.getState().isTierBelowFloor('hamlet')).toBe(false); // the floor itself is allowed
    expect(store.getState().isTierBelowFloor('city'), 'a CEILING refusal must not read as a floor one').toBe(false);
    // A free account has no floor above rung 0, so nothing is ever below it.
    store.setState(s => { s.auth.tier = 'free'; });
    expect(store.getState().isTierBelowFloor('thorp')).toBe(false);
  });

  it('the floor question fails CLOSED exactly as the range does', () => {
    const store = makeStore();
    // Sentinels, unknown tokens and an unranked floor all answer "not a floor refusal",
    // which leaves the ceiling's sentence where it stood before the floor had its own.
    for (const value of ['random', 'custom', 'not-a-tier', '', undefined, null, 42, {}]) {
      expect(store.getState().isTierBelowFloor(value), String(value)).toBe(false);
    }
    const orig = store.getState().minAllowedTier;
    store.setState(s => { s.minAllowedTier = () => 'not-a-real-tier'; });
    expect(store.getState().isTierBelowFloor('thorp')).toBe(false);
    store.setState(s => { s.minAllowedTier = orig; });
    // …and an elevated role bypasses the floor with the ceiling.
    store.setState(s => { s.auth.role = 'admin'; });
    expect(store.getState().isTierBelowFloor('thorp')).toBe(false);
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
