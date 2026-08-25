import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/ai.js', () => ({
  generateNarrative: vi.fn(async (_type, _settlement, _settlementId, opts = {}) => {
    opts.onField?.('dawn', 'Dawn text');
    return {
      result: { dawn: 'Dawn text', morning: 'Morning text', midday: 'Midday text', evening: 'Evening text', night: 'Night text' },
      creditsRemaining: 96,
      type: 'dailyLife',
    };
  }),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(async () => ({})) },
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

function stubSlice(_set, _get) {
  const campaign = {
    id: 'camp.1',
    settlementIds: ['save.a', 'save.b'],
    worldState: {
      tick: 9,
      relationshipStates: {
        'edge.save.a.save.b': {
          relationshipType: 'cold_war',
          resentment: 0.78,
          fear: 0.64,
          tradeBalance: 0.18,
          recentIncidents: [{ tick: 8, type: 'sanctions', severity: 0.74 }],
        },
      },
      pulseHistory: [],
    },
    regionalGraph: {
      nodes: [],
      edges: [{ id: 'edge.save.a.save.b', from: 'save.a', to: 'save.b', relationshipType: 'cold_war' }],
      channels: [],
      queuedImpacts: [],
    },
  };
  return {
    settlement,
    savedSettlements: [
      { id: 'save.a', name: 'Ashford', phase: 'canon', settlement, aiData: {} },
      { id: 'save.b', name: 'Briarwatch', phase: 'canon', settlement: { ...settlement, id: 'save.b', name: 'Briarwatch' }, aiData: {} },
    ],
    campaigns: [campaign],
    auth: { modelPreference: 'anthropic_claude_opus_4_8' },
    creditBalance: 100,
    isElevated: () => false,
    isPremium: () => true,
    setPurchaseModalOpen: () => {},
    updateSavedSettlement: vi.fn(),
    getCampaignForSettlement: (saveId) => campaign.settlementIds.includes(saveId) ? campaign : null,
    getCampaignWorldState: () => campaign.worldState,
    getCampaignRegionalGraph: () => campaign.regionalGraph,
    _appendChronicleEntry: async () => {},
  };
}

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createAiSlice(...a) })));
}

describe('aiSlice Daily Life relationship memory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('requestDailyLife sends sanitized campaign relationship memory when available', async () => {
    const store = makeStore();

    await store.getState().requestDailyLife('save.a');

    expect(generateNarrative).toHaveBeenCalledWith(
      'dailyLife',
      settlement,
      'save.a',
      expect.objectContaining({
        relationshipMemoryContext: expect.objectContaining({
          relationships: expect.arrayContaining([
            expect.objectContaining({
              otherSettlementName: 'Briarwatch',
              relationshipType: 'cold_war',
            }),
          ]),
        }),
      }),
    );
    const opts = generateNarrative.mock.calls[0][3];
    expect(JSON.stringify(opts.relationshipMemoryContext)).not.toMatch(/dailyLifeWeight|memoryScore|weight/);
  });
});
