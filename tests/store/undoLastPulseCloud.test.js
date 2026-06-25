/**
 * undoLastPulseCloud.test.js — Round-4 (High regression): undoLastPulse must REACH
 * the cloud in CLOUD (isConfigured:true) mode.
 *
 * Round-3 wired the atomic persist RPC (migration 069) into flushWorldPulsePersist,
 * passing p_expected_tick = the campaign's current (post-advance) tick so a duplicate
 * FORWARD re-apply is a no-op (stale_tick). But undoLastPulse routes its revert
 * through the SAME flushWorldPulsePersist: an undo restores a PRIOR (LOWER) tick, so
 * it was passing that lower tick as the guard's expectedTick. The cloud's stored tick
 * is HIGHER (post-advance), so v_current_tick >= p_expected_tick → the RPC returns
 * applied:false / stale_tick, which the client reads as cloud-coherent SUCCESS. NET:
 * undo reverted LOCAL state but NEVER the cloud, so on reload the undone advance was
 * resurrected and local drifted.
 *
 * The fix threads backward:true from undoLastPulse → flushWorldPulsePersist, which
 * sends expectedTick = NULL (last-write-wins) so 069 skips the forward guard and the
 * reverted snapshot lands. The forward advance path is UNCHANGED — it still passes the
 * post-advance tick, so a stale double-advance is still rejected.
 *
 * Every OTHER undo test runs isConfigured:false (local mode, unconditional revert), so
 * this cloud path was the coverage gap. These pins close it.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Cloud is CONFIGURED so the persist tail genuinely routes through the atomic RPC.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: true },
}));

// FAITHFUL 069 guard model: track the cloud's STORED tick as mutable state (not a
// constant) so a LEGITIMATE forward advance (cloud behind, expectedTick ahead) APPLIES
// and bumps the stored tick, while a stale re-advance (expectedTick not ahead of stored)
// is rejected. A null expectedTick is last-write-wins (the undo path), applying
// unconditionally and snapping the stored tick to the campaign's reverted value.
// vi.hoisted so the (hoisted) vi.mock factory below can close over it; a reset hook
// lets beforeEach / a test start from a known cloud tick.
const cloudGuard = vi.hoisted(() => ({ tick: 0 }));
function __resetCloudStoredTick(tick = 0) { cloudGuard.tick = tick; }

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
      // The atomic advance write. The store mirrors 069's stale-tick guard so we
      // can assert the FORWARD guard stays intact while UNDO bypasses it.
      persistWorldPulseAdvance: vi.fn(({ campaign, expectedTick }) => {
        // 069's guard: a non-null expectedTick applies only if stored < expectedTick.
        if (expectedTick != null && cloudGuard.tick >= expectedTick) {
          return Promise.resolve({ applied: false, reason: 'stale_tick', currentTick: cloudGuard.tick, expectedTick });
        }
        // Applied — the cloud snaps to the write's tick (forward: expectedTick; undo
        // last-write-wins: the reverted campaign's tick).
        const writtenTick = expectedTick != null ? expectedTick : Number(campaign?.worldState?.tick);
        if (Number.isFinite(writtenTick)) cloudGuard.tick = writtenTick;
        return Promise.resolve({ applied: true, settlementsWritten: 1, settlementsRequested: 1 });
      }),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: true,
    },
  };
});

// Multi-tick is GA (default-on in flags.js). This file pins the LEGACY cloud-undo
// persistence guard; its forward tick literals (tick===1, expectedTick===1) and the
// in-mock STORED_AFTER_ADVANCE constant are single-tick, so mock the flag OFF to keep
// them byte-exact. (The undo's null-expectedTick contract under test is tick-agnostic.)
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(name => (name === 'advanceMultiTick' ? false : false)),
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
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.72 }],
  };
}

const CAMPAIGN_ID = '33333333-3333-4333-8333-333333333333';

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
      id: CAMPAIGN_ID,
      name: 'Realm',
      settlementIds: ['22222222-2222-4222-8222-222222222222'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
}

describe('undoLastPulse reaches the cloud in CLOUD mode (round-4 regression)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
    campaignService.persistWorldPulseAdvance.mockClear();
    __resetCloudStoredTick(0); // fresh cloud — no advance has landed yet
    primeCampaignSync([]);
  });

  test('(a) UNDO of a cloud-persisted advance reaches the cloud: the RPC is called with a NULL expected tick (last-write-wins) and APPLIES (not stale_tick)', async () => {
    const store = makeStore();
    seedCanonized(store);

    // Forward advance — persists to the cloud (tick 0 → 1) with the post-advance
    // tick as the guard.
    await store.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);

    // The forward advance passed a non-null expected tick (the guard is live).
    const fwdCall = campaignService.persistWorldPulseAdvance.mock.calls.at(-1)[0];
    expect(fwdCall.expectedTick).toBe(1);

    campaignService.persistWorldPulseAdvance.mockClear();

    // Undo — restores the prior (lower) tick 0.
    const undone = await store.getState().undoLastPulse(CAMPAIGN_ID);
    expect(undone).toBe(true);
    expect(store.getState().campaigns[0].worldState.tick).toBe(0);

    // The undo REACHED the cloud: the atomic RPC was called exactly once...
    expect(campaignService.persistWorldPulseAdvance).toHaveBeenCalledTimes(1);
    const undoCall = campaignService.persistWorldPulseAdvance.mock.calls[0][0];
    // ...with a NULL expected tick (last-write-wins), NOT the lower restored tick
    // that the forward guard would reject as stale.
    expect(undoCall.expectedTick).toBeNull();
    // And it actually APPLIED — the reverted snapshot landed, not stale_tick.
    const result = await campaignService.persistWorldPulseAdvance.mock.results[0].value;
    expect(result.applied).toBe(true);
    expect(result.reason).toBeUndefined();

    // No persistence failure surfaced — the undo is cloud-coherent, not pending.
    expect(store.getState().campaignSyncError).toBeNull();
  });

  test('(b) the FORWARD guard is still intact: a stale double-advance (expected tick not ahead of stored) is rejected as stale_tick', async () => {
    // Precondition: the cloud already holds tick 1 (a prior advance landed).
    __resetCloudStoredTick(1);
    // A forward advance whose expected tick is NOT ahead of the already-stored cloud
    // tick (1) must be rejected by the guard — proving the fix did not loosen the
    // forward path into unconditional last-write-wins.
    const stale = await campaignService.persistWorldPulseAdvance({
      campaignId: CAMPAIGN_ID,
      campaign: { id: CAMPAIGN_ID, worldState: { tick: 1 } },
      settlementUpdates: [],
      expectedTick: 1, // stored (1) >= expected (1) → stale
    });
    expect(stale.applied).toBe(false);
    expect(stale.reason).toBe('stale_tick');

    // A genuine forward advance (expected ahead of stored) still applies.
    const forward = await campaignService.persistWorldPulseAdvance({
      campaignId: CAMPAIGN_ID,
      campaign: { id: CAMPAIGN_ID, worldState: { tick: 2 } },
      settlementUpdates: [],
      expectedTick: 2, // stored (1) < expected (2) → applies
    });
    expect(forward.applied).toBe(true);
  });
});
