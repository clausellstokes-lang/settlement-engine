/**
 * worldPulseProposalPersist.test.js — High (data-integrity): the NON-ADVANCING
 * world-pulse writes must persist last-write-wins, not under the forward guard.
 *
 * advanceCampaignWorld advances worldState.tick, so its atomic persist passes the
 * POST-advance tick as expectedTick and the cloud (a tick behind) accepts it. But
 * applyWorldPulseProposal and recordPartyImpact mutate the world + member
 * settlements WITHOUT bumping the tick — the snapshot's tick EQUALS the cloud's
 * current tick. The forward stale-tick guard advances only when the stored tick is
 * strictly BEHIND expectedTick; on that tie the RPC returns { applied:false,
 * reason:'stale_tick' }, which the persist tail reads as success — so NOTHING is
 * written, yet the caller is told it succeeded. The applied proposal + settlement
 * deltas then vanish on reload.
 *
 * The fix routes both non-advancing writes through the SAME last-write-wins path
 * undo uses (expectedTick = null), so 069 skips the forward guard and the write
 * lands unconditionally. These pins RECORD the expectedTick the atomic RPC was
 * called with and assert it is null for apply-proposal and record-party-impact.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Cloud is CONFIGURED so the persist tail genuinely runs the atomic RPC whose
// expectedTick argument these pins inspect.
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
      // The atomic world-pulse write the persist tail routes the whole write-set
      // through. A real stale_tick tie would return { applied:false } here.
      persistWorldPulseAdvance: vi.fn(() => Promise.resolve({ applied: true, settlementsWritten: 1, settlementsRequested: 1 })),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: true,
    },
  };
});

// Tick-agnostic seam; the literals stay single-tick so mock the multi-tick flag off.
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => false),
}));

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
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
    activeConditions: [],
  };
}

const CAMPAIGN_ID = '33333333-3333-4333-8333-333333333333';
const SAVE_ID = '22222222-2222-4222-8222-222222222222';

// A pending proposal whose stored outcome materializes a famine condition — the
// manual Apply path resolves the SAME outcome (byte-identical to autoresolve).
const PROPOSAL = {
  id: 'world_proposal.5.condition.ashford.test',
  status: 'pending',
  tick: 5,
  severity: 0.8,
  headline: 'Famine pressure may take hold',
  summary: 'Food pressure has crossed a threshold.',
  reasons: ['test'],
  outcome: {
    id: 'candidate.condition.food.ashford.5',
    type: 'condition',
    candidateType: 'food_pressure',
    targetSaveId: SAVE_ID,
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

function seedCanonized(store, { proposals = [] } = {}) {
  store.setState(state => {
    state.savedSettlements = [{
      id: SAVE_ID,
      name: 'Ashford',
      phase: 'canon',
      settlement: settlement('Ashford'),
      campaignState: { phase: 'canon', eventLog: [], locks: {}, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
    state.campaigns = [{
      id: CAMPAIGN_ID,
      name: 'Realm',
      settlementIds: [SAVE_ID],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 5, entries: [] },
      // Tick is 5 — the cloud already holds tick 5. A non-advancing write keeps it
      // at 5, so a forward guard (strictly-behind) would tie and drop the write.
      worldState: { rngSeed: 'store-seed', tick: 5, canonizedAt: '2026-01-01T00:00:00.000Z', proposals },
    }];
  });
}

describe('non-advancing world-pulse writes persist last-write-wins (expectedTick = null)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
    campaignService.persistWorldPulseAdvance.mockResolvedValue({ applied: true, settlementsWritten: 1, settlementsRequested: 1 });
    primeCampaignSync([]);
  });

  test('applyWorldPulseProposal calls the atomic RPC with expectedTick = null (NOT the current tick)', async () => {
    const store = makeStore();
    seedCanonized(store, { proposals: [PROPOSAL] });

    const applied = await store.getState().applyWorldPulseProposal(CAMPAIGN_ID, PROPOSAL.id);

    // The apply landed locally (the proposal is marked applied + the condition shows).
    expect(applied).toBeTruthy();
    expect(store.getState().campaigns[0].worldState.proposals[0].status).toBe('applied');
    // The atomic RPC was the write path.
    expect(campaignService.persistWorldPulseAdvance).toHaveBeenCalledTimes(1);
    const arg = campaignService.persistWorldPulseAdvance.mock.calls[0][0];
    expect(arg.campaignId).toBe(CAMPAIGN_ID);
    // The fix: a non-advancing write is last-write-wins, NOT guarded by the current
    // tick — else the cloud's tied tick 5 would reject it as stale and drop the apply.
    expect(arg.expectedTick).toBeNull();
    expect(arg.expectedTick).not.toBe(5);
  });

  test('recordPartyImpact calls the atomic RPC with expectedTick = null (NOT the current tick)', async () => {
    const store = makeStore();
    seedCanonized(store);

    const result = await store.getState().recordPartyImpact(CAMPAIGN_ID, {
      kind: 'impose_condition',
      settlementId: SAVE_ID,
      archetype: 'famine',
      label: 'The party triggered a famine',
    });

    expect(result).toBeTruthy();
    expect(campaignService.persistWorldPulseAdvance).toHaveBeenCalledTimes(1);
    const arg = campaignService.persistWorldPulseAdvance.mock.calls[0][0];
    expect(arg.campaignId).toBe(CAMPAIGN_ID);
    // A party impact is a discrete injection, not a time advance — last-write-wins.
    expect(arg.expectedTick).toBeNull();
    expect(arg.expectedTick).not.toBe(5);
  });
});
