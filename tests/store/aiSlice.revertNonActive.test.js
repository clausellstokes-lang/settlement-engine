/**
 * aiSlice.revertNonActive.test.js
 *
 * Regression: revertCurrentToRaw nulled the GLOBAL narrative view
 * (aiSettlement, aiDailyLife, showNarrative, ...) for ANY saveId, with no
 * active-save guard. Reverting a NON-active save therefore blanked the prose
 * of whatever settlement was currently on screen.
 *
 * The fix captures the on-screen save at entry and only clears the global
 * view when activeSaveId still points at the reverted save (the file's
 * stillActive convention). The persisted raw write to the target's ai_data
 * happens regardless.
 *
 * These tests put save B on screen with prose, revert the non-active save A,
 * and assert B's view survives while A is still persisted to raw.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const savesUpdate = vi.fn(async () => ({}));
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: (...a) => savesUpdate(...a) },
}));

import { createAiSlice } from '../../src/store/aiSlice.js';

function stubSlice() {
  return {
    activeSaveId: 'save.b',
    savedSettlements: [
      { id: 'save.a', name: 'Ashford', aiData: { aiSettlement: { thesis: 'A-thesis' } } },
      { id: 'save.b', name: 'Brackwell', aiData: { aiSettlement: { thesis: 'B-thesis' } } },
    ],
    updateSavedSettlement: vi.fn(),
    _appendChronicleEntry: vi.fn(async () => {}),
  };
}

function makeStore() {
  // stubSlice spreads LAST so its mocked deps (savedSettlements, the no-op
  // _appendChronicleEntry, updateSavedSettlement) win over createAiSlice's real
  // definitions. The on-screen prose is set afterwards via setState (the real
  // flow where a narrative run populates the view).
  return create(immer((...a) => ({ ...createAiSlice(...a), ...stubSlice(...a) })));
}

/** Put save B's prose on screen, as if B were narrated and is being viewed. */
function showSaveBProse(store) {
  store.setState((s) => {
    s.activeSaveId = 'save.b';
    s.aiSettlement = { thesis: 'B-thesis', name: 'Brackwell' };
    s.aiDailyLife = { dawn: 'B-dawn', night: 'B-night' };
    s.aiDataVersion = 123;
    s.aiSourceFingerprint = 'b-fp';
    s.showNarrative = true;
  });
}

describe('aiSlice — active-save guard on revertCurrentToRaw', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('reverting a NON-active save leaves the on-screen view intact', async () => {
    const store = makeStore();
    showSaveBProse(store);

    await store.getState().revertCurrentToRaw('save.a');

    const st = store.getState();
    // B is still on screen — its prose must survive A's revert.
    expect(st.activeSaveId).toBe('save.b');
    expect(st.aiSettlement).toMatchObject({ thesis: 'B-thesis' });
    expect(st.aiDailyLife).toMatchObject({ dawn: 'B-dawn' });
    expect(st.showNarrative).toBe(true);

    // A is still persisted to raw (revert took effect on the save).
    const persistedToA = savesUpdate.mock.calls.find((c) => c[0] === 'save.a');
    expect(persistedToA).toBeTruthy();
    expect(persistedToA[1].aiData.aiSettlement).toBeNull();
    expect(persistedToA[1].aiData.narrativeMode).toBe('raw');
  });

  test('reverting the ACTIVE save clears the on-screen view as before', async () => {
    const store = makeStore();
    showSaveBProse(store);

    await store.getState().revertCurrentToRaw('save.b');

    const st = store.getState();
    expect(st.aiSettlement).toBeNull();
    expect(st.aiDailyLife).toBeNull();
    expect(st.showNarrative).toBe(false);
    expect(st.aiDataVersion).toBeNull();
    expect(st.aiSourceFingerprint).toBeNull();
  });
});
