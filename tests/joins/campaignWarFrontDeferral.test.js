/**
 * campaignWarFrontDeferral.test.js — #2.2 (deferred war-front seed).
 *
 * #2 seeds a cross-settlement WAR FRONT eagerly on the IMMEDIATE ripple path: a
 * DM-authored siege/occupation stressor naming a campaign-member instigator mints
 * a light deployment + a war_front (war-layer provenance) instigator → target,
 * which the war layer resolves on the next Advance. But a CLOCK-BOUND campaign
 * member commits through the change-queue, which runs applyEvent under
 * `flushApplyLocalOnly` → rippleEventThroughWorld with skipRegional, so the #2
 * seed is SKIPPED. #2.2 closes that gap by DEFERRING the seed: the commit stashes
 * a war-front intent on worldState.deferredWarFronts, and the next Advance drains
 * it into a real seedCampaignWarFront call EXACTLY ONCE — BEFORE evaluateWarLayer
 * — so the same Advance reads + processes the siege, identical to the immediate
 * path one tick earlier.
 *
 * Pinned here:
 *   1. A clock-bound member siege commit does NOT seed on commit (no deployment,
 *      no war_front) — it parks the intent on worldState.deferredWarFronts.
 *   2. The next Advance DRAINS the bucket → seeds the deployment + war_front
 *      (war-layer provenance) + posture, and CLEARS the bucket.
 *   3. The same Advance feeds the seeded siege through the war layer (the
 *      deployment is enriched / the front is live + processed this tick).
 *   4. A SECOND Advance seeds nothing (exactly-once: the bucket is empty).
 *   5. The IMMEDIATE-ripple (non-clock-bound) path still seeds eagerly on commit
 *      — byte-unchanged.
 *
 * Harness mirrors campaignChangeQueueDeferral.test.js (real flushQueue + Advance)
 * crossed with siegeInstigatorWarFront.test.js (the instigator neighbour link).
 */

import { beforeEach, describe, test, expect, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

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

// Multi-tick is GA (default-on in flags.js). This file pins the LEGACY single-tick
// war-front deferral integration (drain + enrich over ONE coarse tick); mock the
// flag OFF so its assertions stay byte-exact.
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(name => (name === 'advanceMultiTick' ? false : false)),
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { createChangeQueueSlice, registerLinkExecutor, registerBatchCommit } from '../../src/store/changeQueueSlice.js';
import { ensureRegionalGraph, hasWarLayerEvidence } from '../../src/domain/region/index.js';

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

// The instigator is linked as a HOSTILE neighbour carrying the partner SAVE id —
// exactly how the link composer stamps it.
const HOSTILE_LINK = { id: 'ironhold', linkId: 'link_thornmere_ironhold', name: 'Ironhold', relationshipType: 'hostile' };

// The TARGET (this dossier) — a small, weak victim so the war layer has a plausible
// siege matchup, with a neighbourNetwork naming the instigator by partner save id.
function targetSettlement(neighbours = [HOSTILE_LINK]) {
  return {
    tier: 'village', name: 'Thornmere', population: 280,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [{ id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' }],
    economicState: { prosperity: 'Struggling', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 24, label: 'Fragile' },
      factions: [
        { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
        { faction: 'Hedge Wardens', category: 'military', power: 22 },
      ],
      conflicts: [],
    },
    npcs: [{ id: 'reeve_thornmere', name: 'Reeve Thornmere', importance: 'key' }],
    activeConditions: [],
    neighbourNetwork: neighbours,
  };
}

// The INSTIGATOR — a large city, the aggressor.
function instigatorSettlement() {
  return {
    tier: 'city', name: 'Ironhold', population: 45000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [], economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 60, label: 'Stable' },
      factions: [{ faction: 'War Council', category: 'military', power: 78, isGoverning: true }],
      conflicts: [],
    },
    npcs: [{ id: 'reeve_ironhold', name: 'Reeve Ironhold', importance: 'key' }],
    activeConditions: [],
    neighbourNetwork: [],
  };
}

function memberSave(id, settlement) {
  return {
    id, name: id, tier: settlement.tier, settlement, seed: `${id}-seed`,
    campaignState: {
      phase: 'canon', eventLog: [], systemState: null, locks: {},
      generatedAt: '2026-01-01T00:00:00.000Z', editedAt: '2026-01-01T00:00:00.000Z',
      canonizedAt: '2026-01-01T00:00:00.000Z', lastExportAt: null,
    },
  };
}

function seedCampaign(store, { warLayerEnabled = true, worldCanon = true, neighbours = [HOSTILE_LINK] } = {}) {
  store.setState(state => {
    state.savedSettlements = [
      memberSave('thornmere', targetSettlement(neighbours)),
      memberSave('ironhold', instigatorSettlement()),
    ];
    state.campaigns = [{
      id: 'camp-war', name: 'Realm', settlementIds: ['thornmere', 'ironhold'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 4, entries: [] },
      worldState: {
        rngSeed: 'war-seed', tick: 4,
        canonizedAt: worldCanon ? '2026-01-01T00:00:00.000Z' : null,
        simulationRules: { warLayerEnabled },
      },
    }];
  });
  // Open the TARGET dossier (the besieged settlement whose DM authors the siege).
  store.getState().hydrateFromSave(store.getState().savedSettlements[0]);
  return store;
}

const siegeEvent = (id = 'ev-siege', instigatorNeighbour = 'Ironhold') => ({
  id, type: 'APPLY_STRESSOR', targetId: 'siege',
  payload: { stressorType: 'siege', label: 'Siege', severity: 0.8, instigatorNeighbour },
  cause: 'player_action',
});

const worldOf = store => store.getState().campaigns[0].worldState;
const graphOf = store => store.getState().campaigns[0].regionalGraph;
const deploymentsOf = store => worldOf(store).deployments || {};
const warFrontsOf = store => (graphOf(store).channels || []).filter(c => c.type === 'war_front');

beforeEach(() => {
  installLocalStorage();
  localStorage.clear();
  persistWorldPulseAdvance.mockClear().mockResolvedValue({ applied: true });
  savesUpdate.mockClear().mockResolvedValue(true);
  registerLinkExecutor(null);
  registerBatchCommit(null);
});

describe('#2.2 — clock-bound member siege DEFERS the war-front seed', () => {
  test('the commit does NOT seed on commit; it parks the intent on worldState.deferredWarFronts', async () => {
    const store = seedCampaign(makeStore());
    expect(store.getState().isSettlementClockBound('thornmere')).toBe(true);

    store.getState().queueChange('thornmere', {
      type: 'event', humanLabel: 'Ironhold besieges Thornmere',
      payload: { event: siegeEvent() },
    });
    const res = await store.getState().flushQueue('thornmere');
    expect(res.ok).toBe(true);

    // NOTHING seeded eagerly: no deployment, no war_front (the immediate #2 block
    // ran with skipRegional and was bypassed).
    expect(deploymentsOf(store)).toEqual({});
    expect(warFrontsOf(store)).toHaveLength(0);

    // The intent is PARKED on the deferred bucket, resolved to the partner SAVE id.
    const parked = worldOf(store).deferredWarFronts || [];
    expect(parked).toHaveLength(1);
    expect(parked[0]).toMatchObject({ instigatorId: 'ironhold', targetId: 'thornmere', stressorType: 'siege' });
    // sinceTick captured the campaign tick at commit (4).
    expect(parked[0].sinceTick).toBe(4);
  });

  test('the deferred war-front rides the 069 campaign snapshot (so it survives a reload)', async () => {
    const store = seedCampaign(makeStore());
    store.getState().queueChange('thornmere', {
      type: 'event', humanLabel: 'Ironhold besieges Thornmere', payload: { event: siegeEvent() },
    });
    await store.getState().flushQueue('thornmere');

    expect(persistWorldPulseAdvance).toHaveBeenCalledTimes(1);
    const arg = persistWorldPulseAdvance.mock.calls[0][0];
    expect((arg.campaign.worldState.deferredWarFronts || []).length).toBe(1);
    // A commit is not an advance — the tick is unchanged.
    expect(arg.campaign.worldState.tick).toBe(4);
  });

  test('a non-member (unlinked) instigator parks nothing — settlement-local only', async () => {
    const store = seedCampaign(makeStore(), { neighbours: [] });
    store.getState().queueChange('thornmere', {
      type: 'event', humanLabel: 'A nameless host', payload: { event: siegeEvent('ev-x', 'Nowhere') },
    });
    const res = await store.getState().flushQueue('thornmere');
    expect(res.ok).toBe(true);
    expect(worldOf(store).deferredWarFronts || []).toHaveLength(0);
    expect(deploymentsOf(store)).toEqual({});
  });

  test('war layer OFF parks nothing (the dormancy oracle is preserved)', async () => {
    const store = seedCampaign(makeStore(), { warLayerEnabled: false });
    store.getState().queueChange('thornmere', {
      type: 'event', humanLabel: 'Ironhold besieges Thornmere', payload: { event: siegeEvent() },
    });
    const res = await store.getState().flushQueue('thornmere');
    expect(res.ok).toBe(true);
    expect(worldOf(store).deferredWarFronts || []).toHaveLength(0);
    expect(deploymentsOf(store)).toEqual({});
  });
});

describe('#2.2 — the next Advance drains the deferred seed EXACTLY ONCE', () => {
  test('Advance seeds the deployment + war_front (war-layer provenance) + posture, then clears the bucket', async () => {
    const store = seedCampaign(makeStore());
    store.getState().queueChange('thornmere', {
      type: 'event', humanLabel: 'Ironhold besieges Thornmere', payload: { event: siegeEvent() },
    });
    await store.getState().flushQueue('thornmere');
    expect((worldOf(store).deferredWarFronts || []).length).toBe(1);

    await store.getState().advanceCampaignWorld('camp-war', 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    // The bucket is drained + cleared (exactly-once).
    expect(worldOf(store).deferredWarFronts || []).toHaveLength(0);

    // A war_front instigator → target was seeded WITH war-layer provenance — the
    // siege gate reads it as a real front, not a phantom relationship one. (It may
    // be 'confirmed' or, if the same Advance's war layer already resolved it,
    // 'dormant' — either way the channel exists with war-layer evidence.)
    const front = warFrontsOf(store).find(c => String(c.from) === 'ironhold' && String(c.to) === 'thornmere');
    expect(front).toBeTruthy();
    expect(hasWarLayerEvidence(front.evidence)).toBe(true);
  });

  test('a SECOND Advance seeds nothing (exactly-once: the bucket is empty)', async () => {
    const store = seedCampaign(makeStore());
    store.getState().queueChange('thornmere', {
      type: 'event', humanLabel: 'Ironhold besieges Thornmere', payload: { event: siegeEvent() },
    });
    await store.getState().flushQueue('thornmere');

    await store.getState().advanceCampaignWorld('camp-war', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    const frontsAfterFirst = warFrontsOf(store).filter(c => String(c.from) === 'ironhold' && String(c.to) === 'thornmere');
    expect(frontsAfterFirst.length).toBe(1);

    // Second advance: nothing left to drain — no NEW war_front instigator → target
    // is minted (the deferred bucket is empty; the one-army invariant also holds).
    await store.getState().advanceCampaignWorld('camp-war', 'one_month', { now: '2026-03-01T00:00:00.000Z' });
    expect(worldOf(store).deferredWarFronts || []).toHaveLength(0);
    const frontsAfterSecond = warFrontsOf(store).filter(c => String(c.from) === 'ironhold' && String(c.to) === 'thornmere');
    // No duplicate front was minted by a second drain.
    expect(frontsAfterSecond.length).toBe(1);
  });

  test('the seeded siege is fed through the war layer THIS Advance (the deployment is read + enriched)', async () => {
    const store = seedCampaign(makeStore());
    store.getState().queueChange('thornmere', {
      type: 'event', humanLabel: 'Ironhold besieges Thornmere', payload: { event: siegeEvent() },
    });
    await store.getState().flushQueue('thornmere');

    await store.getState().advanceCampaignWorld('camp-war', 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    // The deployment ledger carries Ironhold's army, and — the load-bearing fact —
    // the war layer's pre-tick pass ENRICHED the light seed via ensureStatefulRecord:
    // a freshly-seeded light record has ONLY { targetId, sinceTick, role }, but after
    // the war layer reads it this Advance it gains the stateful siege fields
    // (currentEffectiveStrength, deploymentAge, objective). Their presence proves the
    // seeded deployment was fed THROUGH evaluateWarLayer this same Advance — not just
    // parked. (With this strong-attacker / weak-victim matchup the siege is HELD, so
    // the deployment persists rather than resolving in one tick.)
    const dep = deploymentsOf(store).ironhold;
    expect(dep).toBeTruthy();
    expect(dep.targetId).toBe('thornmere');
    expect(Number.isFinite(dep.currentEffectiveStrength)).toBe(true);
    expect(dep.deploymentAge).toBeGreaterThanOrEqual(1);

    // The war_front it seeded is a LIVE, confirmed siege the war layer is holding.
    const front = warFrontsOf(store).find(c => String(c.from) === 'ironhold' && String(c.to) === 'thornmere');
    expect(front).toBeTruthy();
    expect(front.status).toBe('confirmed');
    expect(hasWarLayerEvidence(front.evidence)).toBe(true);
  });
});

describe('#2.2 — the IMMEDIATE (non-clock-bound) path is unchanged', () => {
  test('a standalone (non-canon) member siege still seeds EAGERLY on commit (byte-unchanged)', async () => {
    // worldCanon:false → the settlement is NOT clock-bound, so the commit runs the
    // IMMEDIATE ripple path (skipRegional:false) and #2 seeds eagerly.
    const store = seedCampaign(makeStore(), { worldCanon: false });
    expect(store.getState().isSettlementClockBound('thornmere')).toBe(false);

    // Author the siege directly (immediate applyEvent — not a deferred flush).
    store.getState().applyEvent(siegeEvent());

    // Seeded immediately: deployment + war_front, and NOTHING parked on the
    // deferred bucket (the immediate path never stashes).
    expect(deploymentsOf(store).ironhold).toMatchObject({ targetId: 'thornmere', role: 'siege' });
    const front = warFrontsOf(store).find(c => String(c.from) === 'ironhold' && String(c.to) === 'thornmere');
    expect(front).toBeTruthy();
    expect(hasWarLayerEvidence(front.evidence)).toBe(true);
    expect(worldOf(store).deferredWarFronts).toBeUndefined();
  });
});
