/**
 * tests/store/advanceCampaignWorldRefactor.test.js — B11-store findings #2/#3.
 *
 * advanceCampaignWorld used to run the entire (pure, heavy) world-pulse
 * simulation INSIDE the Immer producer, and re-cloned every member save a second
 * time as the simulation's input. The refactor lifts the pure compute OUT of the
 * producer (compute the plain result first, then a commit set()), reusing the
 * single set of input clones — WITHOUT an await between the two set() calls, so
 * the action stays atomic w.r.t. other actions and behaviour is preserved.
 *
 * These tests pin the externally-observable behaviour the split must preserve:
 *   - a canonized world advances + persists exactly as before,
 *   - the pre-pulse undo snapshot is still captured and reverses the advance,
 *   - a non-canonized world is still blocked WITHOUT committing a tick.
 */
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
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, clone(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
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
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a), ...createCampaignWorldPulseSlice(...a) })));
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

function seedCanonized(store) {
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
}

describe('advanceCampaignWorld two-phase refactor (findings #2/#3)', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('advances + persists a pulse exactly as before (pure compute hoisted out of set)', async () => {
    const store = makeStore();
    seedCanonized(store);

    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });

    expect(result).toBeTruthy();
    expect(result.tick).toBe(1);
    const campaign = store.getState().campaigns[0];
    expect(campaign.worldState.tick).toBe(1);
    expect(campaign.wizardNews.currentTick).toBe(1);
    expect(store.getState().savedSettlements[0].campaignState.worldPulse.lastTick).toBe(1);
  });

  test('captures a pre-pulse snapshot that reverses the advance (commit-phase ran)', async () => {
    const store = makeStore();
    seedCanonized(store);

    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(true);
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);

    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(true);
    // Reversed back to the pre-pulse tick captured in phase 1's snapshot.
    expect(store.getState().campaigns[0].worldState.tick).toBe(0);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
  });

  test('a non-canonized world is blocked WITHOUT committing a tick or an undo snapshot', async () => {
    const store = makeStore();
    store.setState(state => {
      state.savedSettlements = [{
        id: 'ashford', name: 'Ashford', phase: 'draft',
        settlement: settlement('Ashford'),
        campaignState: { phase: 'draft', eventLog: [], locks: {} },
      }];
      state.campaigns = [{
        id: 'camp-1', name: 'Realm', settlementIds: ['ashford'],
        regionalGraph: ensureRegionalGraph(),
        wizardNews: { currentTick: 0, entries: [] },
        worldState: { rngSeed: 'store-seed', tick: 0 }, // no canonizedAt
      }];
    });

    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });

    expect(result).toEqual({ ok: false, reason: 'world_not_canonized' });
    expect(store.getState().campaigns[0].worldState.tick).toBe(0);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
  });

  test('repeated advances each push one undo snapshot and walk the tick forward', async () => {
    const store = makeStore();
    seedCanonized(store);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    expect(store.getState().campaigns[0].worldState.tick).toBe(2);
    // Two snapshots retained — multi-step undo walks back tick by tick.
    await store.getState().undoLastPulse('camp-1');
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);
    await store.getState().undoLastPulse('camp-1');
    expect(store.getState().campaigns[0].worldState.tick).toBe(0);
  });
});
