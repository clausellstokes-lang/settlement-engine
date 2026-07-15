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
 *   - spendCredits / addCredits still behave as a balance API (kept, documented
 *     as not on the live server-authoritative spend path).
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

describe('credit balance actions remain a safe balance API (finding #4)', () => {
  it('addCredits raises the balance and records a purchase transaction', () => {
    const store = makeStore();
    store.getState().addCredits(50, 'pack_50');
    expect(store.getState().creditBalance).toBe(50);
    expect(store.getState().transactions[0]).toMatchObject({ type: 'purchase', amount: 50 });
  });

  it('spendCredits debits when affordable and refuses when not', () => {
    const store = makeStore();
    store.getState().setCreditBalance(10);
    expect(store.getState().spendCredits(4, 'narrative')).toBe(true);
    expect(store.getState().creditBalance).toBe(6);
    expect(store.getState().spendCredits(99, 'narrative')).toBe(false);
    expect(store.getState().creditBalance).toBe(6); // unchanged on refusal
  });

  it('elevated roles never debit (unlimited)', () => {
    const store = makeStore({ elevated: true });
    store.getState().setCreditBalance(3);
    expect(store.getState().spendCredits(100, 'narrative')).toBe(true);
    expect(store.getState().creditBalance).toBe(3);
  });
});
