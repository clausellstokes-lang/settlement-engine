/**
 * aiSlice.midSwitchBleed.test.js — two cross-save bleed bugs.
 *
 * Both guard the same invariant: ONE save's narrative must never be written
 * under ANOTHER save's id when the active settlement changes out from under a
 * long-running action.
 *
 * (1) _appendChronicleEntry built the entry from the LIVE store
 *     `aiSettlement`/`aiDailyLife`, not from the run's own result. If the user
 *     switched active settlements mid-generation, the wrong settlement's prose
 *     was chronicled under this save. Fix: the long-running callers thread the
 *     run's OWN prose through opts; the live view is only trusted when it
 *     belongs to this save.
 *
 * (2) applyCosmeticRename's session-view guard was `aiSettlement || aiDailyLife`
 *     (too broad), so renaming a NON-active save overwrote whatever narrative
 *     happened to be on screen. Fix: guard on `activeSaveId === saveId`.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(async () => ({})) },
}));

import { createAiSlice } from '../../src/store/aiSlice.js';

const SAVE_A = 'save.a';
const SAVE_B = 'save.b';

function canonSave(id, name) {
  return {
    id,
    name,
    aiData: { chronicle: [] },
    campaignState: { phase: 'canon', canonizedAt: '2026-06-11T12:00:00.000Z' },
  };
}

const stubSlice = (set) => ({
  settlement: null,
  activeSaveId: null,
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

function makeStore() {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createAiSlice(...a) })));
  store.setState(s => {
    s.savedSettlements = [canonSave(SAVE_A, 'Ashford'), canonSave(SAVE_B, 'Brindle')];
  });
  return store;
}

function chronicleOf(store, id) {
  return store.getState().savedSettlements.find(s => s.id === id).aiData.chronicle;
}

describe('_appendChronicleEntry — mid-generation switch must not bleed prose (finding 1)', () => {
  beforeEach(() => vi.clearAllMocks());

  test('threaded run prose is chronicled even after the active save switches away', async () => {
    const store = makeStore();
    // The user has switched to save B; the LIVE view now holds B's narrative.
    store.setState(s => {
      s.activeSaveId = SAVE_B;
      s.aiSettlement = { thesis: 'Brindle, a town on the wrong river.' };
      s.aiDailyLife = { dawn: 'Brindle dawn.' };
    });

    // Save A's run finished and threads its OWN prose through opts.
    await store.getState()._appendChronicleEntry(SAVE_A, {
      reason: 'initial',
      aiSettlement: { thesis: 'Ashford, a town that remembers its debts.' },
      aiDailyLife: { dawn: 'Ashford dawn.' },
    });

    const a = chronicleOf(store, SAVE_A);
    expect(a).toHaveLength(1);
    // Must be A's prose — NOT the live B view.
    expect(a[0].thesis).toBe('Ashford, a town that remembers its debts.');
    expect(a[0].aiSettlement).toMatchObject({ thesis: 'Ashford, a town that remembers its debts.' });
    expect(a[0].aiDailyLife).toMatchObject({ dawn: 'Ashford dawn.' });
  });

  test('without threaded prose, a non-active save does NOT snapshot the live (other-save) view', async () => {
    const store = makeStore();
    // On screen: save B's narrative. We append to A with NO threaded source.
    store.setState(s => {
      s.activeSaveId = SAVE_B;
      s.aiSettlement = { thesis: 'Brindle, a town on the wrong river.' };
      s.aiDailyLife = { dawn: 'Brindle dawn.' };
    });

    await store.getState()._appendChronicleEntry(SAVE_A, { reason: 'initial' });

    const a = chronicleOf(store, SAVE_A);
    expect(a).toHaveLength(1);
    // The live view belongs to B, so A's entry must not carry B's prose.
    expect(a[0].thesis).toBe('');
    expect(a[0].aiSettlement).toBeNull();
    expect(a[0].aiDailyLife).toBeNull();
  });

  test('without threaded prose, the active save still snapshots the live view (revert path)', async () => {
    const store = makeStore();
    store.setState(s => {
      s.activeSaveId = SAVE_A;
      s.aiSettlement = { thesis: 'Ashford live.' };
      s.aiDailyLife = { dawn: 'Ashford dawn.' };
    });

    await store.getState()._appendChronicleEntry(SAVE_A, { reason: 'revert', mode: 'summary' });

    const a = chronicleOf(store, SAVE_A);
    expect(a).toHaveLength(1);
    // Summary-at-birth keeps thesis but nulls heavy fields — the point here is
    // it read the LIVE view (thesis preserved), proving the active-save path works.
    expect(a[0].thesis).toBe('Ashford live.');
    expect(a[0].mode).toBe('summary');
  });
});

describe('applyCosmeticRename — non-active rename must not touch on-screen prose (finding 2)', () => {
  beforeEach(() => vi.clearAllMocks());

  function withNarrative(id, name, thesis) {
    const s = canonSave(id, name);
    s.aiData = {
      ...s.aiData,
      aiSettlement: { thesis, name },
      aiDailyLife: { dawn: `${name} at dawn.` },
    };
    return s;
  }

  test('renaming a NON-active save leaves the on-screen narrative untouched', async () => {
    const store = create(immer((...a) => ({ ...stubSlice(...a), ...createAiSlice(...a) })));
    store.setState(s => {
      s.savedSettlements = [
        withNarrative(SAVE_A, 'Ashford', 'Ashford holds the ford.'),
        withNarrative(SAVE_B, 'Brindle', 'Brindle guards Brindle bridge.'),
      ];
      // Save A is on screen.
      s.activeSaveId = SAVE_A;
      s.aiSettlement = { thesis: 'Ashford holds the ford.', name: 'Ashford' };
      s.aiDailyLife = { dawn: 'Ashford at dawn.' };
    });

    // Rename targets the NON-active save B.
    await store.getState().applyCosmeticRename({
      saveId: SAVE_B,
      oldName: 'Brindle',
      newName: 'Caldmoor',
    });

    const st = store.getState();
    // The on-screen (A) view must be byte-identical — B's rename can't bleed in.
    expect(st.aiSettlement).toMatchObject({ thesis: 'Ashford holds the ford.', name: 'Ashford' });
    expect(st.aiDailyLife).toMatchObject({ dawn: 'Ashford at dawn.' });
    // But save B's PERSISTED ai_data still got renamed.
    const bData = st.savedSettlements.find(s => s.id === SAVE_B).aiData;
    expect(bData.aiSettlement.name).toBe('Caldmoor');
    expect(bData.aiDailyLife.dawn).toBe('Caldmoor at dawn.');
  });

  test('renaming the ACTIVE save still updates the on-screen narrative', async () => {
    const store = create(immer((...a) => ({ ...stubSlice(...a), ...createAiSlice(...a) })));
    store.setState(s => {
      s.savedSettlements = [withNarrative(SAVE_A, 'Ashford', 'Ashford holds the ford.')];
      s.activeSaveId = SAVE_A;
      s.aiSettlement = { thesis: 'Ashford holds the ford.', name: 'Ashford' };
      s.aiDailyLife = { dawn: 'Ashford at dawn.' };
    });

    await store.getState().applyCosmeticRename({
      saveId: SAVE_A,
      oldName: 'Ashford',
      newName: 'Wexford',
    });

    const st = store.getState();
    expect(st.aiSettlement.name).toBe('Wexford');
    expect(st.aiSettlement.thesis).toBe('Wexford holds the ford.');
    expect(st.aiDailyLife.dawn).toBe('Wexford at dawn.');
  });
});
