/**
 * advanceCampaignWorldCloudPending.test.js — Round-2 (High): callers must CONSUME
 * the world-pulse persistence outcome.
 *
 * The round-1 persist guard made flushWorldPulsePersist return an explicit
 * { ok, ... } outcome and stop pushing the campaign snapshot on a failed write.
 * But the world-pulse MUTATORS (advanceCampaignWorld / applyWorldPulseProposal /
 * recordPartyImpact) DISCARDED that outcome and returned the raw pulse result
 * unchanged. So a failed persist still resolved to an ok-looking result, and
 * WorldMap showed a 'Realm advanced' success toast — contradicting the retryable
 * campaignSyncError banner the same failure raised, and inviting the DM to
 * re-advance (double tick).
 *
 * These pins prove the result now carries the persistence outcome:
 *  - FORWARD: a settlement write failure tags result.cloudPending = true (so the
 *    caller renders the honest cloud-pending notice, not an unqualified success).
 *  - INVERSE: every settlement lands but the campaign upsert rejects → still tags
 *    cloudPending (the swallowed rejection no longer reads as success), and the
 *    advance does NOT throw (no bare 'could not advance' that invites a re-advance).
 *  - HAPPY PATH: a fully-persisted advance leaves cloudPending unset.
 *
 * The tick still advances LOCALLY in every case (the advance is real; only the
 * cloud is behind) — the contract is "applied locally, retry/reload reconciles".
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Cloud is CONFIGURED here (unlike the other world-pulse tests) so the persist
// tail genuinely runs the settlement + campaign writes we want to fail.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: true },
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
      isConfigured: true,
    },
  };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { saves } from '../../src/lib/saves.js';
import { campaigns as campaignService } from '../../src/lib/campaigns.js';
import { primeCampaignSync } from '../../src/lib/campaignSync.js';

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
  auth: { user: { id: '11111111-1111-4111-8111-111111111111' }, tier: 'free', loading: false },
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
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createCampaignSlice(...a),
    ...createCampaignWorldPulseSlice(...a),
  })));
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
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Ashford',
      phase: 'canon',
      settlement: settlement('Ashford'),
      campaignState: { phase: 'canon', eventLog: [], locks: {}, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
    state.campaigns = [{
      id: '33333333-3333-4333-8333-333333333333',
      name: 'Realm',
      settlementIds: ['22222222-2222-4222-8222-222222222222'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
}

const CAMPAIGN_ID = '33333333-3333-4333-8333-333333333333';

describe('advanceCampaignWorld consumes the persistence outcome (cloud-pending)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
    campaignService.upsert.mockImplementation(c => Promise.resolve(c?.id));
    saves.update.mockResolvedValue(undefined);
    primeCampaignSync([]);
  });

  test('FORWARD: a settlement write failure tags result.cloudPending and surfaces the banner (no false success)', async () => {
    const store = makeStore();
    seedCanonized(store);

    // The member settlement write rejects — the persist tail must leave the
    // campaign cloud-pending and the mutator must tell the caller so.
    saves.update.mockRejectedValue(new Error('network'));

    const result = await store.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    // The advance is real LOCALLY (the contract: applied locally, reload reconciles).
    expect(result).toBeTruthy();
    expect(result.ok).not.toBe(false);
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);
    // The caller-consumed outcome: NOT an unqualified success.
    expect(result.cloudPending).toBe(true);
    // The retryable banner was raised — the honest, single source of the failure.
    expect(store.getState().campaignSyncError).toBeTruthy();
    // The campaign snapshot was NOT pushed to the cloud (guarded by the round-1 fix).
    expect(campaignService.upsert).not.toHaveBeenCalled();
  });

  test('INVERSE: settlements land but the campaign upsert rejects — tags cloudPending, does NOT throw (no double-advance bait)', async () => {
    const store = makeStore();
    seedCanonized(store);

    saves.update.mockResolvedValue(undefined);                 // every settlement lands
    campaignService.upsert.mockRejectedValue(new Error('campaign upsert rejected'));

    // Load-bearing: the advance MUST resolve, not reject. A rejection would reach
    // WorldMap's "could not advance" toast over an already-committed local tick and
    // invite a re-advance (double tick).
    const result = await store.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    expect(result).toBeTruthy();
    expect(result.ok).not.toBe(false);
    expect(store.getState().campaigns[0].worldState.tick).toBe(1); // advanced locally
    expect(result.cloudPending).toBe(true);                        // honest, not success
    expect(store.getState().campaignSyncError).toBeTruthy();       // retryable banner up
    expect(campaignService.upsert).toHaveBeenCalled();             // it WAS attempted
  });

  test('HAPPY PATH: a fully-persisted advance leaves cloudPending unset', async () => {
    const store = makeStore();
    seedCanonized(store);

    saves.update.mockResolvedValue(undefined);
    campaignService.upsert.mockImplementation(c => Promise.resolve(c?.id));

    const result = await store.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    expect(result).toBeTruthy();
    expect(result.ok).not.toBe(false);
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);
    // No persistence failure → no cloud-pending tag, no banner.
    expect(result.cloudPending).toBeUndefined();
    expect(store.getState().campaignSyncError).toBeNull();
    expect(campaignService.upsert).toHaveBeenCalled();
  });
});
