/**
 * aiActiveSaveGuard.test.js
 *
 * Regression: requestNarrative / requestProgression await a
 * long generate call, then write the GLOBAL narrative view (aiSettlement,
 * aiDailyLife, showNarrative, ...). If the user switched settlements while the
 * call was in flight (hydrateFromSave flips activeSaveId), the resolving run
 * used to clobber the now-open settlement's view with the OTHER settlement's
 * prose — one town's AI prose bleeding onto another.
 *
 * The fix guards the global-view writes on `get().activeSaveId === saveId`
 * (the saveId the request was started for). Credit balance, loading flags, and
 * the engagement counter still commit unconditionally; persisted ai_data uses
 * the run-local bundle rather than the (now-foreign) global state.
 *
 * These tests start a request for save A, flip activeSaveId to B before the
 * mocked generate resolves, and assert A's prose does NOT overwrite B's view.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// A controllable generate: the test resolves `gate` after flipping activeSaveId
// so the success set() runs in the "switched away" world.
let gate;
let gateResolve;
function armGate() {
  gate = new Promise((res) => { gateResolve = res; });
}

vi.mock('../../src/lib/ai.js', () => ({
  generateNarrative: vi.fn(async (type) => {
    await gate; // hold until the test has flipped activeSaveId
    return {
      result: { thesis: 'A-thesis', name: 'Ashford' },
      dailyLife: { dawn: 'A-dawn', night: 'A-night' },
      creditsRemaining: 90,
      type,
      partialFailure: false,
      failedFields: [],
    };
  }),
}));

const savesUpdate = vi.fn(async () => ({}));
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: (...a) => savesUpdate(...a) },
}));

import { createAiSlice } from '../../src/store/aiSlice.js';

const settlementA = {
  id: 'save.a', name: 'Ashford', tier: 'town', population: 2200,
  activeConditions: [], institutions: [], npcs: [],
};

function stubSlice() {
  return {
    // Save A is the active, on-screen settlement when the request starts.
    activeSaveId: 'save.a',
    settlement: settlementA,
    savedSettlements: [
      { id: 'save.a', name: 'Ashford', phase: 'canon', settlement: settlementA, aiData: {} },
      { id: 'save.b', name: 'Brackwell', phase: 'canon', settlement: { id: 'save.b' }, aiData: {} },
    ],
    campaigns: [],
    auth: { modelPreference: 'anthropic_claude_opus_4_8' },
    creditBalance: 100,
    isElevated: () => false,
    isPremium: () => true,
    setPurchaseModalOpen: () => {},
    updateSavedSettlement: vi.fn(),
    getCampaignForSettlement: () => null,
    _appendChronicleEntry: async () => {},
  };
}

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createAiSlice(...a) })));
}

/** Simulate the user opening a different settlement mid-generation. */
function switchToSaveB(store) {
  store.setState((s) => {
    s.activeSaveId = 'save.b';
    // Save B has no AI prose — its on-screen view is the raw (cleared) state.
    s.aiSettlement = null;
    s.aiDailyLife = null;
    s.showNarrative = false;
  });
}

describe('aiSlice — active-save guard on AI generation success', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    armGate();
  });

  // LINEAGE NOTE (master merge W6 — OWNER FORK RECORDED). Master's switched-away
  // semantics COMMIT the run (creditBalance updates to the server's
  // creditsRemaining, and A's prose persists to A's ai_data even after the user
  // switches to B). This lineage's 'release' disposition DISCARDS the
  // switched-away run instead: the lock frees, the view stays B's, but the
  // balance is not committed and A's bundle is not persisted — the paid run's
  // output is dropped. Which model the product keeps is a PAID-SURFACE owner
  // decision (master-merge owner queue: "switched-away AI run: commit-vs-discard").
  // Until ruled, these tests pin THIS lineage's discard-on-switch behavior so a
  // silent drift in either direction is caught. Master's daily-life FOLDING
  // (narrative runs producing aiDailyLife under one spend) is the same queue's
  // second fork; this lineage keeps two separate paid actions, so no aiDailyLife
  // assertions appear on the narrative path here.

  test('requestNarrative does not overwrite the now-open settlement view', async () => {
    const store = makeStore();
    const pending = store.getState().requestNarrative('save.a');

    // User switches to save B while the generate call is still in flight.
    switchToSaveB(store);
    gateResolve();
    await pending;

    const st = store.getState();
    // B's view must stay raw — A's prose must NOT bleed in.
    expect(st.activeSaveId).toBe('save.b');
    expect(st.aiSettlement).toBeNull();
    expect(st.aiDailyLife).toBeNull();
    expect(st.showNarrative).toBe(false);
    // The lock frees either way.
    expect(st.aiLoading).toBe(false);
    // DISCARD-ON-SWITCH (this lineage): the balance is NOT committed from the
    // switched-away run, and A's bundle is NOT persisted. See the owner-fork
    // note above — master commits both.
    expect(st.creditBalance).toBe(100);
    expect(savesUpdate.mock.calls.some((c) => c[0] === 'save.a')).toBe(false);
    expect(savesUpdate.mock.calls.some((c) => c[0] === 'save.b')).toBe(false);
  });

  test('requestNarrative DOES write the view when the same save is still active', async () => {
    const store = makeStore();
    const pending = store.getState().requestNarrative('save.a');
    // No switch — resolve immediately.
    gateResolve();
    await pending;

    const st = store.getState();
    expect(st.aiSettlement).toMatchObject({ thesis: 'A-thesis' });
    expect(st.showNarrative).toBe(true);
    // Two-spend model: a narrative run does not produce daily life (see the
    // owner-fork note above).
    expect(st.aiDailyLife).toBeNull();
  });

  test('requestProgression does not overwrite the now-open settlement view', async () => {
    const store = makeStore();
    // Progression requires an existing narrative on the active save.
    store.setState((s) => { s.aiSettlement = { thesis: 'prior' }; });

    const pending = store.getState().requestProgression('save.a', {
      changeType: 'minor',
      changeLabel: 'tweak',
    });

    switchToSaveB(store);
    gateResolve();
    await pending;

    const st = store.getState();
    expect(st.aiSettlement).toBeNull();
    expect(st.showNarrative).toBe(false);
    expect(st.aiLoading).toBe(false);
    // DISCARD-ON-SWITCH (this lineage) — see the owner-fork note above.
    expect(st.creditBalance).toBe(100);
  });
});
