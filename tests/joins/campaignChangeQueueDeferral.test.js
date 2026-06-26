/**
 * campaignChangeQueueDeferral.test.js — Phase 4b.
 *
 * The change-queue is now enabled for CANON campaign members. A member commit:
 *   1. applies the settlement-LOCAL change immediately (the clock-bound
 *      short-circuit is bypassed during the flush — flushApplyLocalOnly), and
 *   2. DEFERS the cross-settlement REGIONAL propagation: the impacts are computed
 *      at commit and parked on worldState.deferredImpacts — NOT enqueued into the
 *      live regionalGraph.queuedImpacts — for the NEXT Advance to fold in.
 *
 * These pin the spec's load-bearing guarantees:
 *   • a member commit applies LOCAL but does NOT propagate regionally until advance
 *   • Advance folds the deferred impacts into queuedImpacts EXACTLY ONCE (no double)
 *   • the commit persists atomically via the 069 RPC (one persistWorldPulseAdvance,
 *     expectedTick = null, no tick bump)
 *   • the standalone (non-member) path is unchanged (single-row persist, immediate)
 *   • the Realm cue counts the settlements with pending propagation
 */

import { beforeEach, describe, test, expect, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// 069 RPC seam: assert ONE atomic write per member commit with expectedTick=null.
const persistWorldPulseAdvance = vi.fn(() => Promise.resolve({ applied: true }));
const savesUpdate = vi.fn(() => Promise.resolve(true));

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: (...a) => savesUpdate(...a), isConfigured: true },
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
      persistWorldPulseAdvance: (...a) => persistWorldPulseAdvance(...a),
      isConfigured: true,
    },
  };
});

import { campaigns as campaignService } from '../../src/lib/campaigns.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { createChangeQueueSlice, registerLinkExecutor, registerBatchCommit } from '../../src/store/changeQueueSlice.js';
import { addRegionalChannels, ensureRegionalGraph, normalizeGoodsList } from '../../src/domain/region/index.js';
import { pendingPropagationSettlements } from '../../src/components/settlements/RealmStrip.jsx';

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
  auth: { user: { id: 'u1' }, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
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

/** A supplier member that exports grain (the source of a propagated shock). */
function supplierFixture(name = 'supplier') {
  return {
    id: `settlement.${name}`,
    name,
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', monsterThreat: 'safe' },
    institutions: [{ id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' }],
    economicState: { primaryExports: ['Bulk grain and foodstuffs'], primaryImports: [], activeChains: [] },
    powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
    npcs: [],
    activeConditions: [],
    neighbourNetwork: [],
  };
}

function buyerFixture(name = 'buyer') {
  return {
    id: `settlement.${name}`,
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road', monsterThreat: 'safe' },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Grain and malt'], activeChains: [] },
    powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
    npcs: [],
    activeConditions: [],
    neighbourNetwork: [],
  };
}

function memberSave(id, settlement) {
  return {
    id,
    name: id,
    tier: 'town',
    settlement,
    seed: `${id}-seed`,
    campaignState: {
      phase: 'canon', eventLog: [], systemState: null, locks: {},
      generatedAt: '2026-01-01T00:00:00.000Z',
      editedAt: '2026-01-01T00:00:00.000Z',
      canonizedAt: '2026-01-01T00:00:00.000Z',
      lastExportAt: null,
    },
  };
}

/** A confirmed grain-dependency channel supplier → buyer so a supplier export
 *  shock actually propagates a regional impact onto the buyer. */
function confirmedGraph() {
  const goods = normalizeGoodsList(['Grain']);
  return addRegionalChannels(ensureRegionalGraph(), [
    { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods, status: 'confirmed', strength: 1, confidence: 1 },
  ]);
}

function seedCampaign(store, { worldCanon = true } = {}) {
  store.setState(state => {
    state.savedSettlements = [
      memberSave('supplier', supplierFixture('supplier')),
      memberSave('buyer', buyerFixture('buyer')),
    ];
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: ['supplier', 'buyer'],
      regionalGraph: confirmedGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: 'clock-seed', tick: 0,
        canonizedAt: worldCanon ? '2026-01-01T00:00:00.000Z' : null,
      },
    }];
  });
  store.getState().hydrateFromSave(store.getState().savedSettlements[0]);
  return store;
}

/** A trade-route cut on the supplier — drops the grain export, the regional
 *  shock that propagates to the buyer. */
const cutRouteEvent = (id = 'ev-cut') => ({
  id,
  type: 'CUT_TRADE_ROUTE',
  targetId: 'road',
  payload: { which: 'road', label: 'Mountain Pass' },
  cause: 'player_action',
});

const worldOf = store => store.getState().campaigns[0].worldState;
const graphOf = store => store.getState().campaigns[0].regionalGraph;

beforeEach(() => {
  installLocalStorage();
  localStorage.clear();
  persistWorldPulseAdvance.mockClear().mockResolvedValue({ applied: true });
  savesUpdate.mockClear().mockResolvedValue(true);
  registerLinkExecutor(null);
  registerBatchCommit(null);
});

describe('Phase 4b — campaign-member commit applies LOCAL, defers REGIONAL', () => {
  test('the queue is enabled for a clock-bound canon member, and the commit applies the local change', async () => {
    const store = seedCampaign(makeStore());
    expect(store.getState().isSettlementClockBound('supplier')).toBe(true);

    // Stage an event (queued, not applied).
    store.getState().queueChange('supplier', {
      type: 'event', humanLabel: 'Cut the pass',
      payload: { event: cutRouteEvent() },
    });
    expect(store.getState().eventLog).toHaveLength(0);
    // Nothing redirected to the world-pulse pending queue.
    expect(worldOf(store).pendingEvents || []).toHaveLength(0);

    const res = await store.getState().flushQueue('supplier');
    expect(res.ok).toBe(true);

    // LOCAL change applied now (logged on this settlement), NOT queued to the pulse.
    expect(store.getState().eventLog.length).toBeGreaterThanOrEqual(1);
    expect(worldOf(store).pendingEvents || []).toHaveLength(0);
  });

  test('the regional ripple is DEFERRED — impacts land on deferredImpacts, NOT on the live queuedImpacts', async () => {
    const store = seedCampaign(makeStore());
    const queuedBefore = (graphOf(store).queuedImpacts || []).length;

    store.getState().queueChange('supplier', {
      type: 'event', humanLabel: 'Cut the pass', payload: { event: cutRouteEvent() },
    });
    await store.getState().flushQueue('supplier');

    // The deferred bucket holds the regional impacts…
    const deferred = worldOf(store).deferredImpacts || [];
    expect(deferred.length).toBeGreaterThan(0);
    // …and the LIVE queuedImpacts is UNCHANGED at commit (the double-propagation
    // guard: nothing was enqueued into the graph, so there is nothing to double).
    expect((graphOf(store).queuedImpacts || []).length).toBe(queuedBefore);
  });

  test('the commit persists atomically via the 069 RPC (one call, expectedTick=null, no single-row persist, no tick bump)', async () => {
    const store = seedCampaign(makeStore());

    store.getState().queueChange('supplier', {
      type: 'event', humanLabel: 'Cut the pass', payload: { event: cutRouteEvent() },
    });
    savesUpdate.mockClear();
    const res = await store.getState().flushQueue('supplier');
    expect(res.ok).toBe(true);

    // Exactly ONE atomic RPC write for the commit.
    expect(persistWorldPulseAdvance).toHaveBeenCalledTimes(1);
    const arg = persistWorldPulseAdvance.mock.calls[0][0];
    // R2: a commit is NOT an advance — expectedTick must be null (last-write-wins).
    expect(arg.expectedTick).toBeNull();
    // The campaign snapshot carries the deferred-impact marker, and does NOT bump
    // the tick (still 0 — the next real Advance will be tick 1).
    expect(arg.campaign.worldState.tick).toBe(0);
    expect((arg.campaign.worldState.deferredImpacts || []).length).toBeGreaterThan(0);
    // The single-row persistSaveUpdate fast path was NOT used for a member commit.
    expect(savesUpdate).not.toHaveBeenCalled();
  });
});

describe('Phase 4b — Advance folds the deferred ripple EXACTLY ONCE', () => {
  test('the next Advance moves deferredImpacts into queuedImpacts once, then clears the bucket; a SECOND advance adds nothing', async () => {
    const store = seedCampaign(makeStore());

    store.getState().queueChange('supplier', {
      type: 'event', humanLabel: 'Cut the pass', payload: { event: cutRouteEvent() },
    });
    await store.getState().flushQueue('supplier');
    const deferredCount = (worldOf(store).deferredImpacts || []).length;
    expect(deferredCount).toBeGreaterThan(0);
    const queuedBefore = (graphOf(store).queuedImpacts || []).length;

    // First advance: the deferred impacts fold into queuedImpacts and the bucket clears.
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    expect(worldOf(store).deferredImpacts || []).toHaveLength(0);
    const queuedAfterFirst = (graphOf(store).queuedImpacts || []).length;
    expect(queuedAfterFirst).toBeGreaterThanOrEqual(queuedBefore + deferredCount);

    // Second advance: nothing left to fold — the deferred bucket stays empty and
    // the fold contributes NO new impacts (exactly-once guarantee).
    const idsAfterFirst = new Set((graphOf(store).queuedImpacts || []).map(i => i.id));
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-03-01T00:00:00.000Z' });
    expect(worldOf(store).deferredImpacts || []).toHaveLength(0);
    // Every impact id present after the first advance's fold is still there (none
    // duplicated); the fold did not re-introduce the deferred set a second time.
    for (const id of idsAfterFirst) {
      const count = (graphOf(store).queuedImpacts || []).filter(i => i.id === id).length;
      expect(count).toBe(1);
    }
  });
});

describe('Phase 4b — standalone path preserved', () => {
  test('a non-clock-bound (standalone) commit uses the single-row persist and never touches the 069 RPC', async () => {
    const store = seedCampaign(makeStore(), { worldCanon: false });
    expect(store.getState().isSettlementClockBound('supplier')).toBe(false);

    store.getState().queueChange('supplier', {
      type: 'event', humanLabel: 'Cut the pass', payload: { event: cutRouteEvent() },
    });
    savesUpdate.mockClear();
    persistWorldPulseAdvance.mockClear();
    const res = await store.getState().flushQueue('supplier');
    expect(res.ok).toBe(true);

    // Standalone: ONE single-row persist, NOT the campaign-commit RPC.
    expect(savesUpdate).toHaveBeenCalledTimes(1);
    expect(persistWorldPulseAdvance).not.toHaveBeenCalled();
    // No deferred bucket created — the standalone path is byte-unchanged.
    expect(worldOf(store).deferredImpacts).toBeUndefined();
  });
});

describe('Phase 4b — LOCAL/anon mode persists the committed settlement row', () => {
  test('with no cloud RPC, the member commit writes each affected save row (survives reload) and never calls the 069 RPC', async () => {
    // Local/anon mode: campaignService.persistWorldPulseAdvance is absent, so the
    // commit must fall through to the per-row persist or the local edit is lost on
    // reload. Temporarily strip the RPC seam to model the unconfigured client.
    const realRpc = campaignService.persistWorldPulseAdvance;
    delete campaignService.persistWorldPulseAdvance;
    try {
      const store = seedCampaign(makeStore());
      expect(store.getState().isSettlementClockBound('supplier')).toBe(true);

      store.getState().queueChange('supplier', {
        type: 'event', humanLabel: 'Cut the pass', payload: { event: cutRouteEvent() },
      });
      savesUpdate.mockClear();
      persistWorldPulseAdvance.mockClear();

      const res = await store.getState().flushQueue('supplier');
      expect(res.ok).toBe(true);

      // The local apply still happened on THIS settlement…
      expect(store.getState().eventLog.length).toBeGreaterThanOrEqual(1);
      // …and the committed settlement row was persisted (savesService.update) so a
      // reload reconstructs it — this is the bug the verifier caught.
      expect(savesUpdate).toHaveBeenCalled();
      const persistedSupplier = savesUpdate.mock.calls.some(
        ([id]) => String(id) === 'supplier',
      );
      expect(persistedSupplier).toBe(true);
      // No cloud RPC in local mode.
      expect(persistWorldPulseAdvance).not.toHaveBeenCalled();
      // The regional ripple is STILL deferred (the local-mode fix does not change
      // the defer-until-advance contract).
      expect((worldOf(store).deferredImpacts || []).length).toBeGreaterThan(0);
    } finally {
      campaignService.persistWorldPulseAdvance = realRpc;
    }
  });
});

describe('Phase 4b — a FAILED member commit rolls back the IMMEDIATE crisis-twin state', () => {
  // The regional half is DEFERRED on a member commit, but the crisis-twin half
  // (inject/resolve directive) stays IMMEDIATE: an APPLY_STRESSOR event adds a
  // roaming twin to worldState.stressors during replay. A failed commit must
  // restore that bucket alongside the deferred/regional ones — else the rolled-back
  // settlement no longer reflects a stressor the campaign still carries.
  const applyStressorEvent = (id = 'ev-stressor') => ({
    id,
    type: 'APPLY_STRESSOR',
    targetId: 'supplier',
    payload: { stressorType: 'famine', label: 'Blighted harvest', severity: 0.7 },
    cause: 'player_action',
  });

  test('a failed persist restores worldState.stressors (no phantom crisis twin left behind)', async () => {
    const store = seedCampaign(makeStore());
    const stressorsBefore = (worldOf(store).stressors || []).length;

    store.getState().queueChange('supplier', {
      type: 'event', humanLabel: 'Authoring a famine', payload: { event: applyStressorEvent() },
    });

    // The atomic campaign-member commit RPC FAILS, so the flush must roll the
    // pre-flush campaign world-state back.
    persistWorldPulseAdvance.mockRejectedValueOnce(new Error('cloud down'));

    const res = await store.getState().flushQueue('supplier');
    expect(res.ok).toBe(false);

    // The crisis-twin the inject directive registered during replay is GONE —
    // the bucket is back to its pre-flush size (no half-staged stressor).
    expect((worldOf(store).stressors || []).length).toBe(stressorsBefore);
    // The deferred buckets are clean too (the whole commit rolled back together).
    expect(worldOf(store).deferredImpacts || []).toHaveLength(0);
    // And the queue survives, so the commit is retryable from a clean base.
    expect(store.getState().listQueuedChanges('supplier')).toHaveLength(1);
  });
});

describe('Phase 4b — the Realm cue counts settlements with pending propagation', () => {
  test('pendingPropagationCount + pendingPropagationSettlements count DISTINCT source settlements, and clear after advance', async () => {
    const store = seedCampaign(makeStore());
    // No deferred work yet → cue is zero (hidden).
    expect(store.getState().pendingPropagationCount('camp-1')).toBe(0);
    expect(pendingPropagationSettlements(worldOf(store))).toBe(0);

    store.getState().queueChange('supplier', {
      type: 'event', humanLabel: 'Cut the pass', payload: { event: cutRouteEvent() },
    });
    await store.getState().flushQueue('supplier');

    // One committing settlement (supplier) → count of 1, even with several impacts.
    expect(store.getState().pendingPropagationCount('camp-1')).toBe(1);
    expect(pendingPropagationSettlements(worldOf(store))).toBe(1);

    // The cue clears once the Advance consumes the deferred bucket.
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    expect(store.getState().pendingPropagationCount('camp-1')).toBe(0);
    expect(pendingPropagationSettlements(worldOf(store))).toBe(0);
  });
});
