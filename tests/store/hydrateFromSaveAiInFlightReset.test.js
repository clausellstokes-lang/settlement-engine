/**
 * tests/store/hydrateFromSaveAiInFlightReset.test.js — Store cluster finding #3.
 *
 * Switching settlements via hydrateFromSave could leave the PREVIOUS settlement's
 * in-flight AI flags (aiLoading / aiRegenerating) — and a stale aiError — set on
 * the newly-opened settlement. A request against the old settlement can still be
 * resolving when the user switches saves; the switch orphans that request's
 * completion (it re-checks activeSaveId), so the spinner/dimmed-content/error
 * state would otherwise never clear on its own.
 *
 * The fix clears aiLoading / aiRegenerating / aiError inside hydrateFromSave.
 * These tests pin that reset.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town' },
  // AI session slots normally owned by aiSlice — present so hydrateFromSave can
  // reset them on the shared store, including the in-flight flags under test.
  aiSettlement: null,
  aiDailyLife: null,
  aiDataVersion: null,
  aiSourceFingerprint: null,
  showNarrative: false,
  aiLoading: false,
  aiRegenerating: false,
  aiError: null,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

function bareSettlement(name) {
  return { name, tier: 'town', population: 1000, institutions: [], powerStructure: { factions: [] }, npcs: [] };
}

const saveA = {
  id: 'save-a',
  settlement: bareSettlement('Mossbridge'),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
};

const saveB = {
  id: 'save-b',
  settlement: bareSettlement('Stoneford'),
  campaignState: { phase: 'draft', eventLog: [], locks: {} },
};

describe('hydrateFromSave clears in-flight AI flags (finding #3)', () => {
  let store;
  beforeEach(() => { store = makeStore(); });

  test('a switch mid-generation clears aiLoading / aiRegenerating / aiError', () => {
    store.getState().hydrateFromSave(saveA);
    // Simulate a narrate request in flight against save A, plus a prior error.
    store.setState({ aiLoading: true, aiRegenerating: true, aiError: 'boom' });

    // Open save B while A's request is "still resolving".
    store.getState().hydrateFromSave(saveB);

    expect(store.getState().aiLoading).toBe(false);
    expect(store.getState().aiRegenerating).toBe(false);
    expect(store.getState().aiError).toBeNull();
  });

  test('the reset is unconditional — even hydrating the SAME save clears them', () => {
    store.getState().hydrateFromSave(saveA);
    store.setState({ aiLoading: true, aiRegenerating: false, aiError: 'stale toast' });
    store.getState().hydrateFromSave(saveA);
    expect(store.getState().aiLoading).toBe(false);
    expect(store.getState().aiRegenerating).toBe(false);
    expect(store.getState().aiError).toBeNull();
  });
});
