/**
 * campaignRegionalSlice × changeQueueSlice — the crisis-twin persist must not
 * escape the flush's atomic commit/rollback.
 *
 * The bug pinned here: during a change-queue flush, the replay's
 * rippleEventThroughWorld reaches injectCampaignStressor /
 * resolveCampaignStressor (the crisis-twin half stays IMMEDIATE), and those
 * actions eagerly called persistCampaignState — a whole-campaigns-array write
 * to the local cache (+ cloud sync) MID-flush. A FAILED flush then rolled back
 * memory only (changeQueueSlice's preCampaign snapshot), so the persisted copy
 * kept the phantom twin — and any deferred buckets riding in the same snapshot
 * — which resurrected on reload. The fix gates the persist on
 * flushSuppressPersist (the same R2 seam applyEvent and the stashDeferred*
 * actions already honour): during a flush the twin mutation stays local and the
 * flush owns persistence; off a flush behaviour is byte-unchanged.
 *
 * Store assembly mirrors settlementSlice.stressorBridge.test.js (real
 * settlement + campaign + regional + worldPulse slices, mocked lib/saves +
 * lib/campaigns, local localStorage) plus the real changeQueueSlice so the
 * flush under test is the live one. The member campaign is canon-settlement /
 * UN-canonized-world — non-clock-bound, so events stage on the change queue
 * (EventComposer's live wiring) and the flush replays them with the full
 * immediate ripple.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// The flush's end-of-batch write is savesService.update under persistSaveUpdate;
// mock it so we can drive a persist failure. Hoisted before the slice imports.
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

// The campaign cache seam (persistCampaigns → localWrite → campaignService.cache).
// loadCached is the reload-facing read: whatever is in here after a failed flush
// is what a reload would resurrect.
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

import { saves } from '../../src/lib/saves.js';
import { campaigns as campaignService } from '../../src/lib/campaigns.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { createChangeQueueSlice } from '../../src/store/changeQueueSlice.js';
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
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createCampaignSlice(...a),
    ...createCampaignRegionalSlice(...a),
    ...createCampaignWorldPulseSlice(...a),
    ...createSettlementSlice(...a),
    ...createChangeQueueSlice(...a),
  })));
}

function fixture() {
  return {
    tier: 'town',
    name: 'Ashford',
    population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [
      { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
    ],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [{ id: 'faction.council', name: 'Council' }], conflicts: [] },
    npcs: [],
    activeConditions: [],
  };
}

function saveFor() {
  return {
    id: 'ashford',
    name: 'Ashford',
    tier: 'town',
    settlement: fixture(),
    seed: 'flush-seed',
    campaignState: {
      phase: 'canon',
      eventLog: [],
      systemState: null,
      locks: {},
      generatedAt: '2026-01-01T00:00:00.000Z',
      editedAt: '2026-01-01T00:00:00.000Z',
      canonizedAt: '2026-01-01T00:00:00.000Z',
      lastExportAt: null,
    },
  };
}

function stressorEvent(id) {
  return {
    id,
    type: 'APPLY_STRESSOR',
    targetId: 'under_siege',
    payload: { stressorType: 'under_siege', label: 'Under Siege', severity: 0.8 },
    cause: 'player_action',
  };
}

const TWIN_ID = 'world_stressor.siege.ashford';

/** Canon settlement in an UN-canonized campaign — member, NOT clock-bound. */
function seedStore(store) {
  const save = saveFor();
  store.setState(state => {
    state.savedSettlements = [save];
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'flush-seed', tick: 0, canonizedAt: null },
    }];
  });
  store.getState().hydrateFromSave(save);
  return store;
}

function cachedTwin() {
  const snapshot = campaignService.loadCached('anon') || [];
  const camp = snapshot.find(c => c.id === 'camp-1');
  return (camp?.worldState?.stressors || []).find(s => s.id === TWIN_ID) || null;
}

describe('crisis-twin persist vs the change-queue flush (R2)', () => {
  beforeEach(() => {
    installLocalStorage();
    vi.clearAllMocks();
    saves.update.mockImplementation(() => Promise.resolve());
  });

  test('a FAILED flush leaves NO phantom twin in the persisted campaign copy (and memory rolls back)', async () => {
    const store = seedStore(makeStore());
    store.getState().queueChange('ashford', {
      type: 'event',
      humanLabel: 'Apply Under Siege',
      payload: { event: stressorEvent('ev-flush-fail') },
    });
    // The end-of-batch settlement persist fails → the flush throws + rolls back.
    saves.update.mockImplementationOnce(() => Promise.reject(new Error('offline')));

    const result = await store.getState().flushQueue('ashford');
    expect(result.ok).toBe(false);

    // Memory rollback (pre-existing changeQueueSlice contract) still holds.
    const memStressors = store.getState().campaigns[0].worldState?.stressors || [];
    expect(memStressors.find(s => s.id === TWIN_ID)).toBeUndefined();

    // THE FIX: the mid-flush injectCampaignStressor must NOT have persisted the
    // campaigns snapshot — a reload (loadCached) must not resurrect the twin the
    // rollback just removed. Before the fix this cache held the phantom.
    expect(cachedTwin()).toBeNull();
    expect(campaignService.cache).not.toHaveBeenCalled();

    // The queue survives for retry (existing contract, sanity).
    expect(store.getState().changeQueues.ashford).toHaveLength(1);
  });

  test('a SUCCESSFUL flush still lands the roaming twin in memory', async () => {
    const store = seedStore(makeStore());
    store.getState().queueChange('ashford', {
      type: 'event',
      humanLabel: 'Apply Under Siege',
      payload: { event: stressorEvent('ev-flush-ok') },
    });

    const result = await store.getState().flushQueue('ashford');
    expect(result.ok).toBe(true);

    const memStressors = store.getState().campaigns[0].worldState?.stressors || [];
    expect(memStressors.find(s => s.id === TWIN_ID)).toMatchObject({
      id: TWIN_ID,
      type: 'siege',
      status: 'active',
      originSettlementId: 'ashford',
    });
    expect(store.getState().changeQueues.ashford).toBeUndefined();
  });

  test('OFF a flush the immediate apply persists the twin exactly as before (no over-suppression)', () => {
    const store = seedStore(makeStore());
    // Non-clock-bound canon member: a direct applyEvent applies immediately and
    // the twin persists eagerly (flushSuppressPersist is false).
    store.getState().applyEvent(stressorEvent('ev-direct'));

    expect(cachedTwin()).toMatchObject({ id: TWIN_ID, type: 'siege', status: 'active' });
  });
});
