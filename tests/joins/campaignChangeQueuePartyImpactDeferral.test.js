/**
 * campaignChangeQueuePartyImpactDeferral.test.js — Phase 4b party-impact atomicity.
 *
 * REPRODUCING regression for the "party-impact escapes flush suppression" bug.
 *
 * The bug: during a CANON campaign-member change-queue flush (flushApplyLocalOnly
 * + flushSuppressPersist both set), a partyCaused event replayed through applyEvent
 * reached the party-impact branch of rippleEventThroughWorld, which was NOT gated by
 * skipRegional. It fired recordPartyImpact, which does its OWN out-of-band BACKWARD
 * cloud write (flushWorldPulsePersist → persistWorldPulseAdvance, expectedTick=null) —
 * a write the flush's single atomic commit never owned and its rollback never
 * reverted. So a member commit of a party-caused event did an extra, un-revertable
 * cloud write; on a FAILED commit the local state rolled back but the party impact
 * had already been force-written to the cloud (a phantom).
 *
 * The fix gates the party-impact branch with skipRegional (so it does NOT fire during
 * a flush) and instead DEFERS the impact onto worldState.deferredPartyImpacts, which
 * the NEXT Advance drains through the same recordPartyImpact replay it uses for
 * queued party-caused events — landing it in the atomic advance, rolled back with the
 * flush on failure.
 *
 * These tests fail before the fix (recordPartyImpact fires during the flush, the
 * out-of-band persist escapes, and a failed commit leaves the impact stashed) and
 * pass after.
 */

import { beforeEach, describe, test, expect, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// 069 RPC seam — both the flush's atomic commit AND recordPartyImpact's out-of-band
// backward persist route through this. The bug shows up as an EXTRA call.
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

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { createChangeQueueSlice, registerLinkExecutor, registerBatchCommit } from '../../src/store/changeQueueSlice.js';
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
  auth: { user: { id: 'u1' }, tier: 'free', loading: false },
  config: { settType: 'town' },
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

/** A member with a named NPC the party can kill (a world-scale analog → remove_npc
 *  party impact). */
function memberFixture(name = 'keep') {
  return {
    id: `settlement.${name}`,
    name,
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', monsterThreat: 'safe' },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: [], activeChains: [] },
    powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
    npcs: [
      { id: 'npc.warden', name: 'Warden Aldric', role: 'Warden', status: 'active' },
    ],
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

function seedCampaign(store) {
  store.setState(state => {
    state.savedSettlements = [memberSave('keep', memberFixture('keep'))];
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: ['keep'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: 'clock-seed', tick: 0,
        canonizedAt: '2026-01-01T00:00:00.000Z',
      },
    }];
  });
  store.getState().hydrateFromSave(store.getState().savedSettlements[0]);
  return store;
}

/** A party-caused KILL_NPC — the world-scale analog that maps to a remove_npc party
 *  impact (mapEventToPartyImpact). targetId = the NPC id. */
const killNpcEvent = (id = 'ev-kill') => ({
  id,
  type: 'KILL_NPC',
  targetId: 'npc.warden',
  partyCaused: true,
  description: 'The party slew the Warden.',
  payload: { npcId: 'npc.warden' },
  cause: 'player_action',
});

const worldOf = store => store.getState().campaigns[0].worldState;

beforeEach(() => {
  installLocalStorage();
  localStorage.clear();
  persistWorldPulseAdvance.mockClear().mockResolvedValue({ applied: true });
  savesUpdate.mockClear().mockResolvedValue(true);
  registerLinkExecutor(null);
  registerBatchCommit(null);
});

describe('Phase 4b — a party-caused event in a member flush does NOT escape via an out-of-band persist', () => {
  test('recordPartyImpact is NOT fired during the flush; exactly ONE atomic commit write', async () => {
    const store = seedCampaign(makeStore());
    expect(store.getState().isSettlementClockBound('keep')).toBe(true);

    // Spy on recordPartyImpact — the bug fires it (out-of-band) during the flush.
    const recordSpy = vi.spyOn(store.getState(), 'recordPartyImpact');

    store.getState().queueChange('keep', {
      type: 'event', humanLabel: 'Slay the Warden', payload: { event: killNpcEvent() },
    });

    const res = await store.getState().flushQueue('keep');
    // Drain any microtasks the (fire-and-forget) out-of-band ripple would queue.
    await Promise.resolve();
    await Promise.resolve();

    expect(res.ok).toBe(true);
    // The party impact was DEFERRED, not recorded live — recordPartyImpact never ran.
    expect(recordSpy).not.toHaveBeenCalled();
    // Exactly ONE atomic RPC write for the commit (no extra out-of-band backward write).
    expect(persistWorldPulseAdvance).toHaveBeenCalledTimes(1);
    // The impact is parked for the next Advance.
    expect((worldOf(store).deferredPartyImpacts || []).length).toBe(1);
    expect(worldOf(store).deferredPartyImpacts[0].kind).toBe('remove_npc');
  });

  test('a FAILED commit leaves NO party impact behind (deferred bucket rolled back, queue retryable)', async () => {
    const store = seedCampaign(makeStore());
    const deferredBefore = (worldOf(store).deferredPartyImpacts || []).length;

    store.getState().queueChange('keep', {
      type: 'event', humanLabel: 'Slay the Warden', payload: { event: killNpcEvent() },
    });

    // The atomic member-commit RPC FAILS — the flush must roll the whole world-state
    // back, including the deferred party-impact bucket.
    persistWorldPulseAdvance.mockRejectedValueOnce(new Error('cloud down'));

    const res = await store.getState().flushQueue('keep');
    await Promise.resolve();
    await Promise.resolve();

    expect(res.ok).toBe(false);
    // No phantom party impact: the deferred bucket is back to its pre-flush size.
    expect((worldOf(store).deferredPartyImpacts || []).length).toBe(deferredBefore);
    // And the queue survives, so the commit is retryable from a clean base.
    expect(store.getState().listQueuedChanges('keep')).toHaveLength(1);
  });

  test('the deferred party impact is drained + recorded by the NEXT Advance, exactly once', async () => {
    const store = seedCampaign(makeStore());

    store.getState().queueChange('keep', {
      type: 'event', humanLabel: 'Slay the Warden', payload: { event: killNpcEvent() },
    });
    await store.getState().flushQueue('keep');
    expect((worldOf(store).deferredPartyImpacts || []).length).toBe(1);

    // The next Advance drains + records the deferred impact, then clears the bucket.
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    expect(worldOf(store).deferredPartyImpacts || []).toHaveLength(0);

    // A SECOND advance finds nothing to drain — structurally no double-record.
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-03-01T00:00:00.000Z' });
    expect(worldOf(store).deferredPartyImpacts || []).toHaveLength(0);
  });
});
