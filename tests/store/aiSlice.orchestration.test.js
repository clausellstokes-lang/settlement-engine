/**
 * tests/store/aiSlice.orchestration.test.js
 *
 * The failure-handling half of the paid-AI feature, at the store level. These
 * exercise requestNarrative / requestDailyLife against a mocked transport
 * (generateNarrative) so we can drive stalls, supersessions, partial-then-fail
 * streams, and refund notices deterministically.
 *
 *   F18 — a stalled/aborted run clears aiLoading (no permanent wedge) and a
 *         retry succeeds; cancel / settlement-switch abort the in-flight
 *         AbortController and block the late result from committing.
 *   F19 — a request that resolves after the active view moved does NOT commit
 *         its prose/violations onto the settlement now on screen.
 *   F20 — a first-time generation that fails mid-stream clears the progressive
 *         partials so the dossier never presents a half-written narrative.
 *   F1  — a refund-failure notice surfaced by the transport is stored on the
 *         slice (aiRefundNotice), not dropped.
 *   + hydrateAiFromSave resets every ai-identity field (no cross-save bleed).
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/ai.js', () => ({ generateNarrative: vi.fn() }));
vi.mock('../../src/lib/saves.js', () => ({ saves: { update: vi.fn(async () => ({})) } }));
vi.mock('../../src/lib/researchCapture.js', () => ({ captureFingerprint: vi.fn() }));

import { generateNarrative } from '../../src/lib/ai.js';
import { createAiSlice } from '../../src/store/aiSlice.js';

const SAVE_ID = 'save-A';
const SETTLEMENT = { id: 's1', name: 'Testburg', population: 1200 };

// Minimal companion slices so the aiSlice reads resolve. updateSavedSettlement
// actually merges (the persist path reads it back). isElevated:true bypasses
// the credit gate so we don't have to model pricing.
const stubSlice = (set) => ({
  settlement: null,
  activeSaveId: null,
  savedSettlements: [],
  creditBalance: 100,
  auth: {},
  isElevated: () => true,
  isPremium: () => false,
  setPurchaseModalOpen: () => {},
  updateSavedSettlement: (id, partial) =>
    set(state => {
      const idx = state.savedSettlements.findIndex(s => s.id === id);
      if (idx >= 0) Object.assign(state.savedSettlements[idx], partial);
    }),
  _appendChronicleEntry: async () => {},
});

function makeStore(overrides = {}) {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createAiSlice(...a) })));
  store.setState(s => {
    s.settlement = overrides.settlement ?? SETTLEMENT;
    s.activeSaveId = overrides.activeSaveId ?? SAVE_ID;
    s.savedSettlements = overrides.savedSettlements ?? [{ id: SAVE_ID, name: 'Testburg', aiData: { chronicle: [] } }];
  });
  return store;
}

/** A generateNarrative impl that hangs until the returned `resolve` is called. */
function deferredGen() {
  let resolve, reject, capturedSignal;
  const gate = new Promise((res, rej) => { resolve = res; reject = rej; });
  generateNarrative.mockImplementation(async (_type, _settlement, _saveId, opts) => {
    capturedSignal = opts.signal;
    return gate;
  });
  return { resolve, reject, signal: () => capturedSignal };
}

beforeEach(() => { vi.clearAllMocks(); });

// ─────────────────────────────────────────────────────────────────────
// Happy path (guard must not block a normal run)
// ─────────────────────────────────────────────────────────────────────
describe('requestNarrative — normal commit', () => {
  it('commits prose, flips to the narrative view, and updates credits', async () => {
    const store = makeStore();
    generateNarrative.mockResolvedValue({
      result: { thesis: 'A finished thesis.' }, creditsRemaining: 5, partialFailure: false, failedFields: [],
    });

    await store.getState().requestNarrative(SAVE_ID);

    const s = store.getState();
    expect(s.aiSettlement).toEqual({ thesis: 'A finished thesis.' });
    expect(s.showNarrative).toBe(true);
    expect(s.aiLoading).toBe(false);
    expect(s.aiAbortController).toBeNull();
    expect(s.creditBalance).toBe(5);
  });
});

// ─────────────────────────────────────────────────────────────────────
// F19 — late completion must not overwrite a different settlement's state
// ─────────────────────────────────────────────────────────────────────
describe('F19 — superseded / view-moved runs do not commit onto the wrong view', () => {
  it('a settlement switch mid-flight (clearAiSettlement) abandons the late result', async () => {
    const store = makeStore();
    generateNarrative.mockImplementation(async () => {
      // Detail-view unmount → clearAiSettlement (abort + token bump); then the
      // next save hydrates and activeSaveId moves.
      store.getState().clearAiSettlement();
      store.setState(s => { s.activeSaveId = 'save-B'; });
      return { result: { thesis: 'A-prose' }, creditsRemaining: 7, partialFailure: false, failedFields: [] };
    });

    await store.getState().requestNarrative(SAVE_ID);

    const s = store.getState();
    expect(s.aiSettlement).toBeNull();   // A's prose did NOT land on B
    expect(s.showNarrative).toBe(false); // not force-flipped
    expect(s.aiLoading).toBe(false);     // released by clearAiSettlement
  });

  it('a run whose activeSaveId changed does not commit, and frees the lock (no wedge)', async () => {
    const store = makeStore();
    generateNarrative.mockImplementation(async () => {
      store.setState(s => { s.activeSaveId = 'save-B'; }); // view moved, token untouched
      return { result: { thesis: 'A-prose' }, creditsRemaining: 7, partialFailure: false, failedFields: [] };
    });

    await store.getState().requestNarrative(SAVE_ID);

    const s = store.getState();
    expect(s.aiSettlement).toBeNull();   // 'release' path never commits prose
    expect(s.showNarrative).toBe(false);
    expect(s.aiLoading).toBe(false);     // lock released, not wedged
  });
});

// ─────────────────────────────────────────────────────────────────────
// F20 — first-time failure must not leave partial output presented as complete
// ─────────────────────────────────────────────────────────────────────
describe('F20 — first-time failure clears progressive partials', () => {
  it('narrative: aiSettlement is null after a partial-then-truncated first run', async () => {
    const store = makeStore();
    generateNarrative.mockImplementation(async (_t, _s, _id, opts) => {
      opts.onField('thesis', 'partial thesis');
      opts.onField('institutions', [{ id: 'i1' }]);
      // Confirm the partials were actually written into the live store first.
      expect(store.getState().aiSettlement).not.toBeNull();
      throw new Error('AI generation ended without a completion marker (truncated response) — please retry.');
    });

    await store.getState().requestNarrative(SAVE_ID);

    const s = store.getState();
    expect(s.aiSettlement).toBeNull();           // phantom fragment cleared
    expect(s.showNarrative).toBe(false);
    expect(s.aiLoading).toBe(false);
    expect(s.aiError).toMatch(/completion marker|truncat/i);
  });

  it('daily life: aiDailyLife is null after a partial-then-failed first run', async () => {
    const store = makeStore();
    generateNarrative.mockImplementation(async (_t, _s, _id, opts) => {
      opts.onField('dawn', 'grey light');
      expect(store.getState().aiDailyLife).not.toBeNull();
      throw new Error('daily life failed');
    });

    await store.getState().requestDailyLife(SAVE_ID);

    const s = store.getState();
    expect(s.aiDailyLife).toBeNull();
    expect(s.aiLoading).toBe(false);
    expect(s.aiError).toMatch(/daily life failed/i);
  });

  it('regenerate failure keeps the prior narrative intact', async () => {
    const store = makeStore();
    store.setState(s => { s.aiSettlement = { thesis: 'PRIOR' }; }); // isRegenerate = true
    generateNarrative.mockRejectedValue(new Error('regen failed'));

    await store.getState().requestNarrative(SAVE_ID);

    expect(store.getState().aiSettlement).toEqual({ thesis: 'PRIOR' });
    expect(store.getState().aiLoading).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────
// F18 — abort / stall does not wedge; cancel + switch abort the controller
// ─────────────────────────────────────────────────────────────────────
describe('F18 — abort / stall clears the loading lock and allows retry', () => {
  it('a stalled run (AbortError) clears aiLoading and a retry then succeeds', async () => {
    const store = makeStore();
    const abortErr = Object.assign(
      new Error('AI generation stalled — the server stopped responding partway through. Please try again.'),
      { name: 'AbortError' },
    );
    generateNarrative.mockRejectedValueOnce(abortErr);

    await store.getState().requestNarrative(SAVE_ID);
    expect(store.getState().aiLoading).toBe(false);        // guard no longer wedged
    expect(store.getState().aiError).toMatch(/stalled/i);

    // Retry — `if (aiLoading) return` no longer blocks the next request.
    generateNarrative.mockResolvedValueOnce({
      result: { thesis: 'Recovered' }, creditsRemaining: 3, partialFailure: false, failedFields: [],
    });
    await store.getState().requestNarrative(SAVE_ID);
    expect(store.getState().aiSettlement).toEqual({ thesis: 'Recovered' });
    expect(generateNarrative).toHaveBeenCalledTimes(2);
  });

  it('cancelAiGeneration aborts the controller and blocks the late result', async () => {
    const store = makeStore();
    const { resolve, signal } = deferredGen();

    const inflight = store.getState().requestNarrative(SAVE_ID);
    expect(store.getState().aiLoading).toBe(true); // the sync prefix (guards + set(aiLoading) + abort stamp) still runs synchronously
    // FP-2a: lib/ai.js is now dynamic-imported (settlementSlice loadEngine pattern),
    // so the transport (generateNarrative) is invoked one microtask later — yield so
    // it receives the controller signal before we assert on it. The abort CONTRACT is
    // unchanged (controller + signal are stamped synchronously; late results discarded).
    await new Promise((r) => setTimeout(r));
    expect(signal()).toBeDefined();

    store.getState().cancelAiGeneration();
    expect(store.getState().aiLoading).toBe(false);  // lock released
    expect(signal().aborted).toBe(true);             // fetch signal aborted

    // The transport eventually resolves; the late result must be discarded.
    resolve({ result: { thesis: 'Late' }, creditsRemaining: 1, partialFailure: false, failedFields: [] });
    await inflight;
    expect(store.getState().aiSettlement).toBeNull();
    expect(store.getState().showNarrative).toBe(false);
  });

  it('clearAiSettlement aborts the in-flight controller and supersedes the run', async () => {
    const store = makeStore();
    const { resolve, signal } = deferredGen();

    const inflight = store.getState().requestNarrative(SAVE_ID);
    expect(store.getState().aiLoading).toBe(true);
    // FP-2a: yield for the dynamic-imported transport call (see the cancel test above).
    await new Promise((r) => setTimeout(r));

    store.getState().clearAiSettlement();
    expect(signal().aborted).toBe(true);
    expect(store.getState().aiLoading).toBe(false);

    resolve({ result: { thesis: 'Late' }, creditsRemaining: 0, partialFailure: false, failedFields: [] });
    await inflight;
    expect(store.getState().aiSettlement).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────
// F1 — refund-failure notice is captured, not dropped
// ─────────────────────────────────────────────────────────────────────
describe('F1 — refund-failure notice surfaces on the slice', () => {
  it('stores the notice from onRefundFailure even when the run then fails', async () => {
    const store = makeStore();
    const notice = { status: 'failed', spendId: 'sp_9', reason: 'rpc_down', supportNote: 'Reference sp_9' };
    generateNarrative.mockImplementation(async (_t, _s, _id, opts) => {
      opts.onRefundFailure(notice);
      throw new Error('all passes failed');
    });

    await store.getState().requestNarrative(SAVE_ID);

    expect(store.getState().aiRefundNotice).toEqual(notice);

    store.getState().clearAiRefundNotice();
    expect(store.getState().aiRefundNotice).toBeNull();
  });

  it('a new run clears a stale refund notice at start', async () => {
    const store = makeStore();
    store.setState(s => { s.aiRefundNotice = { status: 'failed', spendId: 'old' }; });
    generateNarrative.mockResolvedValue({
      result: { thesis: 'x' }, creditsRemaining: 2, partialFailure: false, failedFields: [],
    });

    await store.getState().requestNarrative(SAVE_ID);
    expect(store.getState().aiRefundNotice).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────
// hydrateAiFromSave — no cross-save identity bleed
// ─────────────────────────────────────────────────────────────────────
describe('hydrateAiFromSave — resets every ai-identity field', () => {
  it('does not inherit the previous view aiViolations / aiRefundNotice / aiPartialFailure', () => {
    const store = makeStore();
    store.setState(s => {
      s.aiSettlement = { thesis: 'OLD' };
      s.aiViolations = { ok: false, violations: [{ kind: 'invented_entity' }], summary: {} };
      s.aiRefundNotice = { status: 'failed', spendId: 'sp_old' };
      s.aiPartialFailure = { failedFields: ['npcs'] };
      s.showNarrative = true;
    });

    store.getState().hydrateAiFromSave({
      id: 'save-Z',
      aiData: {
        aiSettlement: { thesis: 'NEW' },
        aiDailyLife: { dawn: 'x' },
        narrativeMode: 'narrated',
        narrativeGeneratedAt: '2026-01-01T00:00:00.000Z',
        narrativeSourceFingerprint: 'fp',
      },
    });

    const s = store.getState();
    expect(s.aiSettlement).toEqual({ thesis: 'NEW' });
    expect(s.aiDailyLife).toEqual({ dawn: 'x' });
    expect(s.aiViolations).toBeNull();      // previous report must not bleed
    expect(s.aiRefundNotice).toBeNull();
    expect(s.aiPartialFailure).toBeNull();
    expect(s.showNarrative).toBe(true);
  });

  it('opening a save with no narrative clears prior prose + violations', () => {
    const store = makeStore();
    store.setState(s => {
      s.aiSettlement = { thesis: 'OLD' };
      s.aiViolations = { ok: false, violations: [], summary: {} };
      s.showNarrative = true;
    });

    store.getState().hydrateAiFromSave({ id: 'save-empty', aiData: {} });

    const s = store.getState();
    expect(s.aiSettlement).toBeNull();
    expect(s.aiViolations).toBeNull();
    expect(s.showNarrative).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────
// store-3 — requestDailyLife double-click cannot double-charge
// ─────────────────────────────────────────────────────────────────────
describe('store-3 — requestDailyLife double-click cannot double-charge', () => {
  it('two SYNCHRONOUS clicks fire the paid transport exactly once (the second is blocked by the sync lock)', async () => {
    const store = makeStore();
    const { resolve } = deferredGen();

    // Fire two clicks back-to-back with NO await between them. The fix makes the whole
    // prefix — credit check, F18/F19 token/abort stamp, set(aiLoading:true) — run
    // SYNCHRONOUSLY: the buildDailyLifeRelationshipMemory await moved PAST the lock, so
    // the second click hits `if (aiLoading) return` and never reaches the transport.
    // (Pre-fix, the memory-build await ran BEFORE the lock, so the second click slipped
    // through and both fired paid generateNarrative requests — the double-charge.)
    const p1 = store.getState().requestDailyLife(SAVE_ID);
    const p2 = store.getState().requestDailyLife(SAVE_ID);

    // Let p1 progress through its awaits (loadAiLib + the null relationship-memory build)
    // to the deferred transport; p2 already returned at the aiLoading guard.
    await new Promise(r => setTimeout(r, 30));
    expect(generateNarrative).toHaveBeenCalledTimes(1);

    resolve({ result: { dawn: 'x' }, creditsRemaining: 4 });
    await Promise.all([p1, p2]);
    expect(generateNarrative).toHaveBeenCalledTimes(1);
  });
});
