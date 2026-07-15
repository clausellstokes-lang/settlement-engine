/**
 * aiSlice.narrativeFoldsDailyLife.test.js
 *
 * The narrative run now produces daily life under its single spend. From the
 * store's perspective:
 *   - one requestNarrative call sets BOTH aiSettlement and aiDailyLife
 *   - generateNarrative is called exactly ONCE with type 'narrative'
 *     (no second 'dailyLife' call, so no second credit charge)
 *   - the bundled daily life persists onto the save's ai_data
 *   - streamed `dailyLife.<beat>` fields fill aiDailyLife progressively
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/ai.js', () => ({
  generateNarrative: vi.fn(async (_type, _settlement, _settlementId, opts = {}) => {
    // Stream a narrative field then the daily-life beats, as the real edge
    // function does for a bundled narrative run.
    opts.onField?.('thesis', 'A town that remembers its debts.');
    opts.onField?.('dailyLife.dawn', 'Dawn breaks over Ashford.');
    return {
      result: { thesis: 'A town that remembers its debts.', name: 'Ashford' },
      dailyLife: {
        dawn: 'Dawn breaks over Ashford.',
        morning: 'The market opens.',
        midday: 'Midday lull.',
        evening: 'The tavern fills.',
        night: 'The watch walks.',
      },
      creditsRemaining: 97,
      type: 'narrative',
      partialFailure: false,
      failedFields: [],
      succeededFields: ['dailyLife.dawn'],
    };
  }),
}));

const savesUpdate = vi.fn(async () => ({}));
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: (...a) => savesUpdate(...a) },
}));

import { generateNarrative } from '../../src/lib/ai.js';
import { createAiSlice } from '../../src/store/aiSlice.js';

const settlement = {
  id: 'save.a',
  name: 'Ashford',
  tier: 'town',
  population: 2200,
  activeConditions: [],
  institutions: [],
  npcs: [],
};

function stubSlice() {
  return {
    settlement,
    savedSettlements: [
      { id: 'save.a', name: 'Ashford', phase: 'canon', settlement, aiData: {} },
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

describe('aiSlice — narrative run folds in daily life', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('a single requestNarrative sets both aiSettlement and aiDailyLife', async () => {
    const store = makeStore();

    await store.getState().requestNarrative('save.a');

    const st = store.getState();
    expect(st.aiSettlement).toMatchObject({ thesis: 'A town that remembers its debts.' });
    expect(st.aiDailyLife).toEqual({
      dawn: 'Dawn breaks over Ashford.',
      morning: 'The market opens.',
      midday: 'Midday lull.',
      evening: 'The tavern fills.',
      night: 'The watch walks.',
    });
  });

  test('generateNarrative is called once with type narrative (no second dailyLife spend)', async () => {
    const store = makeStore();

    await store.getState().requestNarrative('save.a');

    expect(generateNarrative).toHaveBeenCalledTimes(1);
    expect(generateNarrative.mock.calls[0][0]).toBe('narrative');
    // The post-run balance reflects exactly ONE charge.
    expect(store.getState().creditBalance).toBe(97);
  });

  test('bundled daily life is persisted onto the save ai_data', async () => {
    const store = makeStore();

    await store.getState().requestNarrative('save.a');

    expect(savesUpdate).toHaveBeenCalled();
    const persisted = savesUpdate.mock.calls
      .map((c) => c[1]?.aiData)
      .find((d) => d && d.aiDailyLife);
    expect(persisted).toBeTruthy();
    expect(persisted.aiDailyLife).toMatchObject({ dawn: 'Dawn breaks over Ashford.' });
    expect(persisted.aiSettlement).toMatchObject({ thesis: 'A town that remembers its debts.' });
  });

  test('streamed dailyLife.<beat> fields fill aiDailyLife progressively', async () => {
    // A streamed beat should land on state even before the final result swap.
    const store = makeStore();
    generateNarrative.mockImplementationOnce(async (_t, _s, _id, opts = {}) => {
      opts.onField?.('dailyLife.dawn', 'Streamed dawn.');
      // assert mid-stream state from inside the mock
      expect(store.getState().aiDailyLife).toMatchObject({ dawn: 'Streamed dawn.' });
      return {
        result: { thesis: 'T' },
        dailyLife: { dawn: 'Streamed dawn.' },
        creditsRemaining: 97,
        type: 'narrative',
        partialFailure: false,
        failedFields: [],
        succeededFields: [],
      };
    });

    await store.getState().requestNarrative('save.a');
    expect(store.getState().aiDailyLife).toMatchObject({ dawn: 'Streamed dawn.' });
  });
});
