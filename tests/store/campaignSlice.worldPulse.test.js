import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => {
        cached.set(ownerId, clone(campaigns));
      }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

const stubSlice = () => ({
  savedSettlements: [],
  settlement: null,
  activeSaveId: null,
  phase: 'draft',
  eventLog: [],
  locks: {},
  generatedAt: null,
  editedAt: null,
  canonizedAt: null,
  lastExportAt: null,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a) })));
}

function settlement(name) {
  return {
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road', priorityEconomy: 20 },
    institutions: [],
    economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 30, label: 'Contested' },
      factions: [{ faction: 'Merchant League', category: 'economy', power: 70 }],
      conflicts: [],
    },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.72 }],
  };
}

describe('campaignSlice world pulse', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('preview does not mutate campaign state while advance persists a pulse', async () => {
    const store = makeStore();
    store.setState(state => {
      state.savedSettlements = [{
        id: 'ashford',
        name: 'Ashford',
        phase: 'canon',
        settlement: settlement('Ashford'),
        campaignState: { phase: 'canon', eventLog: [], locks: {} },
      }];
      state.campaigns = [{
        id: 'camp-1',
        name: 'Realm',
        settlementIds: ['ashford'],
        regionalGraph: ensureRegionalGraph(),
        wizardNews: { currentTick: 0, entries: [] },
        worldState: { rngSeed: 'store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
      }];
    });

    const preview = store.getState().previewCampaignWorldPulse('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });
    expect(preview.tick).toBe(1);
    expect(store.getState().campaigns[0].worldState.tick).toBe(0);

    const draftPreview = store.getState().previewCampaignWorldPulse('camp-1', 'one_month', {
      now: '2026-01-01T00:00:00.000Z',
      simulationRules: { propagationMode: 'local', intensity: 'conservative', migrationFlowsEnabled: false },
    });
    expect(draftPreview.worldState.simulationRules).toMatchObject({
      propagationMode: 'local',
      intensity: 'conservative',
      migrationFlowsEnabled: false,
      presetId: 'custom',
    });
    expect(store.getState().campaigns[0].worldState.simulationRules).toBeUndefined();

    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });
    const campaign = store.getState().campaigns[0];

    expect(result.tick).toBe(1);
    expect(campaign.worldState.tick).toBe(1);
    expect(campaign.worldState.pulseHistory).toHaveLength(1);
    expect(campaign.wizardNews.currentTick).toBe(1);
    expect(store.getState().savedSettlements[0].campaignState.worldPulse.lastTick).toBe(1);
  });

  test('retained inactive campaigns reject ordinary store mutations', async () => {
    const store = makeStore();
    store.setState(state => {
      state.campaigns = [{
        id: 'retained-campaign',
        name: 'Retained Realm',
        accessState: 'inactive_plan',
        settlementIds: ['ashford'],
        collapsed: false,
        regionalGraph: ensureRegionalGraph(),
        wizardNews: { currentTick: 0, entries: [] },
        worldState: { rngSeed: 'retained', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
      }];
    });

    store.getState().toggleCampaignCollapsed('retained-campaign');
    store.getState().renameCampaign('retained-campaign', 'Changed');
    store.getState().clearCampaignWizardNews('retained-campaign');

    expect(store.getState().previewCampaignWorldPulse('retained-campaign')).toBeNull();
    expect(store.getState().campaigns[0]).toMatchObject({
      name: 'Retained Realm',
      collapsed: false,
      accessState: 'inactive_plan',
    });
  });

  test('proposal apply and dismiss update world state', async () => {
    const store = makeStore();
    const proposal = {
      id: 'world_proposal.1.condition.ashford.test',
      status: 'pending',
      tick: 1,
      severity: 0.8,
      headline: 'Famine pressure may take hold',
      summary: 'Food pressure has crossed a threshold.',
      reasons: ['test'],
      outcome: {
        id: 'candidate.condition.food.ashford.1',
        type: 'condition',
        candidateType: 'food_pressure',
        targetSaveId: 'ashford',
        severity: 0.8,
        headline: 'Famine pressure may take hold',
        summary: 'Food pressure has crossed a threshold.',
        reasons: ['test'],
        condition: {
          archetype: 'famine',
          severity: 0.8,
          label: 'Famine pressure',
          description: 'Food scarcity is public.',
          duration: { elapsedTicks: 0, expiresAtTicks: 8 },
        },
      },
    };

    store.setState(state => {
      state.savedSettlements = [{
        id: 'ashford',
        name: 'Ashford',
        phase: 'canon',
        settlement: settlement('Ashford'),
        campaignState: { phase: 'canon', eventLog: [], locks: {} },
      }];
      state.campaigns = [{
        id: 'camp-1',
        name: 'Realm',
        settlementIds: ['ashford'],
        regionalGraph: ensureRegionalGraph(),
        wizardNews: { currentTick: 1, entries: [] },
        worldState: { rngSeed: 'store-seed', tick: 1, proposals: [proposal] },
      }];
    });

    const applied = await store.getState().applyWorldPulseProposal('camp-1', proposal.id);
    expect(applied).toBeTruthy();
    expect(store.getState().campaigns[0].worldState.proposals[0].status).toBe('applied');
    expect(store.getState().savedSettlements[0].settlement.activeConditions.some(c => c.archetype === 'famine')).toBe(true);

    store.setState(state => {
      state.campaigns[0].worldState.proposals = [{ ...proposal, id: 'world_proposal.dismiss', status: 'pending' }];
    });

    const dismissed = await store.getState().dismissWorldPulseProposal('camp-1', 'world_proposal.dismiss');
    expect(dismissed.status).toBe('dismissed');
  });
});
