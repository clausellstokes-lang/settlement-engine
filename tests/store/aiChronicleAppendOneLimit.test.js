/**
 * aiChronicleAppendOneLimit.test.js — V4 of lane TIER-PARITY-FIX (2026-11-09, the owner's tier
 * law): the store facade appends under ONE chronicle limit with no tier read. Red at the base:
 * a free account's sixth canon regeneration rotated the oldest narration to `summary` and
 * nulled its prose; a premium account's did not.
 */
import { describe, expect, test, vi } from 'vitest';

vi.mock('../../src/store/campaignSliceShared.js', () => ({ persistSaveUpdate: vi.fn(async () => {}) }));

import { appendChronicleEntryAction } from '../../src/store/aiChronicleAppend.js';

function storeFor(tier) {
  const save = { id: 's1', campaignState: { canonizedAt: '2026-01-01T00:00:00.000Z', phase: 'canon' }, phase: 'canon', aiData: { chronicle: [] } };
  const state = {
    savedSettlements: [save],
    activeSaveId: 's1',
    isElevated: () => false,
    isPremium: () => tier === 'premium',
    updateSavedSettlement: (id, patch) => { Object.assign(save, patch); },
  };
  return { get: () => state, save };
}

describe('the chronicle facade keeps every narration whatever the tier (V4)', () => {
  test('eight appends: free and premium both keep eight FULL entries', async () => {
    for (const tier of ['free', 'premium']) {
      const { get, save } = storeFor(tier);
      for (let i = 0; i < 8; i += 1) {
        await appendChronicleEntryAction(get, 's1', { reason: 'initial', aiSettlement: { thesis: `T${i}` }, aiDailyLife: { d: i } });
      }
      expect(save.aiData.chronicle).toHaveLength(8);
      expect(save.aiData.chronicle.map((e) => e.mode), tier).toEqual(Array(8).fill('full'));
    }
  });
});
