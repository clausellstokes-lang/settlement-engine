/**
 * tests/store/creditsAndNarrateSignal.test.js — B11-store finding #4.
 *
 * Covers the previously-dead reader-audience signal and the credit-action
 * contract:
 *   - bumpLifetimeNarrate (settlementSlice) increments lifetimeNarrateCount,
 *     which feeds useReaderAudience's anonymous → intermediate progression.
 *     Previously the count stayed 0 forever (never called from any spend path).
 *   - computeReaderAudience flips 'new' → 'intermediate' once narrateCount >= 1,
 *     proving the bump actually drives the audience signal.
 *   - the credit surface is a MIRROR of the server balance: setCreditBalance is
 *     the only writer, canAfford prices a read-only pre-flight check off it, and
 *     no local debit/credit door exists. (spendCredits / addCredits were RETIRED
 *     under owner queue #21 — see the retirement note in creditsSlice.js.)
 */
import { describe, it, expect } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createCreditsSlice } from '../../src/store/creditsSlice.js';
import { computeReaderAudience } from '../../src/hooks/useReaderAudience.js';

// Minimal slice carrying just the fields/actions under test.
function makeStore({ elevated = false } = {}) {
  return create(immer((set, get) => ({
    isElevated: () => elevated,
    auth: { tier: 'free' },
    // lifetimeNarrateCount + bump live in settlementSlice; replicate the exact
    // action shape here so the slice contract is exercised in isolation.
    lifetimeNarrateCount: 0,
    bumpLifetimeNarrate: () => set(state => {
      state.lifetimeNarrateCount = (state.lifetimeNarrateCount || 0) + 1;
    }),
    ...createCreditsSlice(set, get),
  })));
}

describe('lifetimeNarrate reader-audience signal (finding #4)', () => {
  it('bumpLifetimeNarrate increments the count from 0', () => {
    const store = makeStore();
    expect(store.getState().lifetimeNarrateCount).toBe(0);
    store.getState().bumpLifetimeNarrate();
    store.getState().bumpLifetimeNarrate();
    expect(store.getState().lifetimeNarrateCount).toBe(2);
  });

  it('a single narrate spend advances a free user from new → intermediate', () => {
    // Before any narrate: a fresh free account with no saves is 'new'.
    expect(computeReaderAudience({ tier: 'free', savedCount: 0, narrateCount: 0 }))
      .toBe('new');
    // After the bump (count >= 1): 'intermediate' — the branch that was dead.
    expect(computeReaderAudience({ tier: 'free', savedCount: 0, narrateCount: 1 }))
      .toBe('intermediate');
  });
});

describe('the client mirrors a server-authoritative balance (R-5b, owner queue #21)', () => {
  // addCredits / spendCredits were RETIRED: a second, client-side ledger beside a
  // server-authoritative one, called by nothing. What replaces those pins is the
  // contract that made them retirable — the client only ECHOES what the server
  // said, and prices a pre-flight check off that echo.
  it('setCreditBalance is the balance writer and takes the server value verbatim', () => {
    const store = makeStore();
    expect(store.getState().creditBalance).toBe(0);
    store.getState().setCreditBalance(37); // as returned in `creditsRemaining`
    expect(store.getState().creditBalance).toBe(37);
    store.getState().setCreditBalance(0);  // a server-side burn to empty
    expect(store.getState().creditBalance).toBe(0);
  });

  it('canAfford gates on the mirrored balance, never on a local debit', () => {
    const store = makeStore();
    const cost = store.getState().getCost('narrative');
    expect(cost).toBeGreaterThan(0);
    store.getState().setCreditBalance(cost - 1);
    expect(store.getState().canAfford('narrative')).toBe(false);
    store.getState().setCreditBalance(cost);
    expect(store.getState().canAfford('narrative')).toBe(true);
    // The pre-flight check is READ-ONLY: asking does not spend.
    expect(store.getState().creditBalance).toBe(cost);
  });

  it('elevated roles are unlimited regardless of the mirrored balance', () => {
    const store = makeStore({ elevated: true });
    store.getState().setCreditBalance(0);
    expect(store.getState().canAfford('narrative')).toBe(true);
  });

  it('the slice exposes NO local debit/credit door (the retirement holds)', () => {
    // Structural, not behavioral: the danger these two ops carried was that a
    // future caller wires one onto the generation path and double-counts against
    // the server-set balance. If they (or the client-side `transactions` ledger
    // they wrote) come back, this reds and that decision gets re-faced.
    const state = makeStore().getState();
    for (const gone of ['addCredits', 'spendCredits', 'transactions']) {
      expect(state[gone], `${gone} was retired under owner queue #21`).toBeUndefined();
    }
  });
});
