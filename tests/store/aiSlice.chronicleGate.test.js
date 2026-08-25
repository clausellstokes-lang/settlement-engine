/**
 * tests/store/aiSlice.chronicleGate.test.js — canon gate on chronicle
 * regeneration recording (owner decision, 2026-06-11).
 *
 * Regenerations before canonization are exploratory churn, not history:
 * `_appendChronicleEntry` must early-return for `reason: 'regenerate'`
 * when the save is not canon. Every other reason ('initial',
 * 'progression', 'revert') keeps recording regardless of phase — the
 * owner scoped the gate to regenerations only.
 *
 * Unlike the other aiSlice suites (which stub `_appendChronicleEntry`),
 * these tests exercise the REAL implementation — the stub here provides
 * only the companion-slice reads (saves, tier checks, persistence).
 *
 * No staleness race to simulate: `canonize()` persists campaignState to
 * the save entry immediately (settlementSlice.persistActiveSaveLifecycle),
 * so a canonizedAt-stamped save fixture is exactly what the gate reads.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(async () => ({})) },
}));

import { saves as savesService } from '../../src/lib/saves.js';
import { createAiSlice } from '../../src/store/aiSlice.js';

const SAVE_ID = 'save.gate';

/** Draft save — never canonized. */
function draftSave() {
  return {
    id: SAVE_ID,
    name: 'Gatewatch',
    aiData: { chronicle: [] },
    campaignState: { phase: 'draft', canonizedAt: null },
  };
}

/** Canon save — canonizedAt stamped the way persistActiveSaveLifecycle writes it. */
function canonSave() {
  return {
    id: SAVE_ID,
    name: 'Gatewatch',
    aiData: { chronicle: [] },
    campaignState: { phase: 'canon', canonizedAt: '2026-06-11T12:00:00.000Z' },
  };
}

// Minimal companion slices so the real _appendChronicleEntry's reads work.
// updateSavedSettlement actually merges, so chronicle assertions can read
// the store back like the app does.
const stubSlice = (set, _get) => ({
  settlement: null,
  savedSettlements: [],
  creditBalance: 100,
  isElevated: () => false,
  isPremium: () => false,
  setPurchaseModalOpen: () => {},
  updateSavedSettlement: (id, partial) =>
    set(state => {
      const idx = state.savedSettlements.findIndex(s => s.id === id);
      if (idx >= 0) Object.assign(state.savedSettlements[idx], partial);
    }),
});

function makeStore(saveEntry) {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createAiSlice(...a) })));
  store.setState(s => {
    s.savedSettlements = [saveEntry];
    // Live narrative the entry snapshots from.
    s.aiSettlement = { thesis: 'A town holding its breath.' };
    s.aiDailyLife = { dawn: 'Mist on the gate road.' };
  });
  return store;
}

function chronicleOf(store) {
  return store.getState().savedSettlements.find(s => s.id === SAVE_ID).aiData.chronicle;
}

describe('_appendChronicleEntry canon gate on regenerations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('pre-canon regenerate records NOTHING (no entry, no persist)', async () => {
    const store = makeStore(draftSave());

    await store.getState()._appendChronicleEntry(SAVE_ID, { reason: 'regenerate' });

    expect(chronicleOf(store)).toEqual([]);
    expect(savesService.update).not.toHaveBeenCalled();
  });

  test('post-canon regenerate records an entry and persists it', async () => {
    const store = makeStore(canonSave());

    await store.getState()._appendChronicleEntry(SAVE_ID, { reason: 'regenerate' });

    const chronicle = chronicleOf(store);
    expect(chronicle).toHaveLength(1);
    expect(chronicle[0].reason).toBe('regenerate');
    expect(chronicle[0].thesis).toBe('A town holding its breath.');
    expect(savesService.update).toHaveBeenCalledWith(
      SAVE_ID,
      expect.objectContaining({
        aiData: expect.objectContaining({ chronicle: expect.any(Array) }),
      }),
    );
  });

  test('pre-canon initial still records (the gate is regenerate-only)', async () => {
    const store = makeStore(draftSave());

    await store.getState()._appendChronicleEntry(SAVE_ID, { reason: 'initial' });

    const chronicle = chronicleOf(store);
    expect(chronicle).toHaveLength(1);
    expect(chronicle[0].reason).toBe('initial');
    expect(savesService.update).toHaveBeenCalledTimes(1);
  });

  test('pre-canon progression and revert still record', async () => {
    const store = makeStore(draftSave());

    await store.getState()._appendChronicleEntry(SAVE_ID, {
      reason: 'progression',
      triggeredBy: 'Granary fire',
    });
    await store.getState()._appendChronicleEntry(SAVE_ID, {
      reason: 'revert',
      mode: 'summary',
    });

    const reasons = chronicleOf(store).map(e => e.reason);
    // Newest-first ordering.
    expect(reasons).toEqual(['revert', 'progression']);
  });

  test('phase "canon" alone (no canonizedAt) also opens the gate', async () => {
    const entry = canonSave();
    entry.campaignState = { phase: 'canon', canonizedAt: null };
    const store = makeStore(entry);

    await store.getState()._appendChronicleEntry(SAVE_ID, { reason: 'regenerate' });

    expect(chronicleOf(store)).toHaveLength(1);
  });
});
