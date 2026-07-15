/**
 * #2 — SIEGE/OCCUPATION INSTIGATOR → cross-settlement war deployment.
 *
 * When a DM authors a WAR-type stressor (siege / occupation / ...) on a CANON
 * campaign member and names an INSTIGATING neighbour that is ALSO a campaign
 * member, the immediate applyEvent → rippleEventThroughWorld bridge seeds a war
 * deployment instigator → THIS settlement: a LIGHT deployment record on
 * worldState.deployments[instigator] plus a war_front channel with war-layer
 * provenance on the campaign graph. The war layer resolves it on the next Advance,
 * exactly as it would an organically-opened siege.
 *
 * Pinned here:
 *   1. War layer ON + campaign-member instigator → deployment record + war_front
 *      (with war-layer provenance) seeded instigator → target.
 *   2. The seeded front is a LIVE war-layer front (war-layer evidence), not a
 *      phantom relationship front.
 *   3. War layer OFF → no-op (no deployment, no war_front) — the dormancy oracle
 *      is preserved.
 *   4. The one-army invariant holds: a second siege authored on a DIFFERENT target
 *      does NOT overwrite the instigator's existing deployment.
 *   5. A non-member (unlinked) instigator falls back to settlement-local only — no
 *      cross-settlement deployment.
 *
 * Same store assembly as settlementSlice.stressorBridge.test.js.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
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

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
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
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createCampaignSlice(...a),
    ...createCampaignRegionalSlice(...a),
    ...createCampaignWorldPulseSlice(...a),
    ...createSettlementSlice(...a),
  })));
}

// The TARGET settlement (this dossier) — a town whose neighbourNetwork names the
// instigator by the partner save id, exactly as the link composer stamps it.
function targetSettlement(neighbours = []) {
  return {
    tier: 'town', name: 'Thornmere', population: 1800,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [{ id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' }],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [{ id: 'faction.council', name: 'Council' }], conflicts: [] },
    npcs: [], activeConditions: [],
    neighbourNetwork: neighbours,
  };
}

function targetSave(neighbours) {
  return {
    id: 'thornmere', name: 'Thornmere', tier: 'town',
    settlement: targetSettlement(neighbours), seed: 'siege-seed',
    campaignState: {
      phase: 'canon', eventLog: [], systemState: null, locks: {},
      generatedAt: '2026-01-01T00:00:00.000Z', editedAt: '2026-01-01T00:00:00.000Z',
      canonizedAt: '2026-01-01T00:00:00.000Z', lastExportAt: null,
    },
  };
}

function instigatorSave() {
  return {
    id: 'ironhold', name: 'Ironhold', tier: 'city',
    settlement: {
      tier: 'city', name: 'Ironhold', population: 45000,
      config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
      institutions: [], economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: { factions: [{ id: 'faction.war', name: 'War Council' }], conflicts: [] },
      npcs: [], activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

// The instigator is linked as a HOSTILE neighbour carrying the partner SAVE id.
const HOSTILE_LINK = { id: 'ironhold', linkId: 'link_thornmere_ironhold', name: 'Ironhold', relationshipType: 'hostile' };

function seedStore(store, { warLayerEnabled, neighbours = [HOSTILE_LINK] } = {}) {
  const target = targetSave(neighbours);
  store.setState(state => {
    state.savedSettlements = [target, instigatorSave()];
    state.campaigns = [{
      id: 'camp-war', name: 'Realm', settlementIds: ['thornmere', 'ironhold'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 4, entries: [] },
      worldState: {
        rngSeed: 'siege-seed', tick: 4, canonizedAt: null,
        simulationRules: { warLayerEnabled },
      },
    }];
  });
  store.getState().hydrateFromSave(target);
  return store;
}

function authorSiege(store, { instigatorNeighbour, stressorType = 'siege', id = 'ev-siege' } = {}) {
  return store.getState().applyEvent({
    id, type: 'APPLY_STRESSOR', targetId: stressorType,
    payload: {
      stressorType, label: 'Siege', severity: 0.8,
      ...(instigatorNeighbour ? { instigatorNeighbour } : {}),
    },
    cause: 'player_action',
  });
}

const deploymentsOf = store => store.getState().campaigns[0].worldState.deployments || {};
const warFrontsOf = store => (store.getState().campaigns[0].regionalGraph.channels || [])
  .filter(c => c.type === 'war_front');

describe('#2 siege instigator → cross-settlement war front', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('war layer ON + campaign-member instigator seeds a deployment + war_front instigator → target', () => {
    const store = seedStore(makeStore(), { warLayerEnabled: true });
    authorSiege(store, { instigatorNeighbour: 'Ironhold' });

    const deployments = deploymentsOf(store);
    expect(deployments.ironhold).toMatchObject({ targetId: 'thornmere', role: 'siege' });

    const fronts = warFrontsOf(store);
    const front = fronts.find(c => String(c.from) === 'ironhold' && String(c.to) === 'thornmere');
    expect(front).toBeTruthy();
    // The front carries WAR-LAYER provenance, so the read-side siege gate reads it
    // as a real siege rather than a phantom relationship front.
    expect(hasWarLayerEvidence(front.evidence)).toBe(true);

    // The instigator now reads as deployed in the posture ledger.
    expect(store.getState().campaigns[0].worldState.warPosture?.ironhold?.state).toBe('deployed');
  });

  test('war layer OFF is a no-op: no deployment, no war_front (dormancy oracle preserved)', () => {
    const store = seedStore(makeStore(), { warLayerEnabled: false });
    authorSiege(store, { instigatorNeighbour: 'Ironhold' });

    expect(deploymentsOf(store)).toEqual({});
    expect(warFrontsOf(store)).toHaveLength(0);
  });

  test('the one-army invariant holds: a second siege does not overwrite the live deployment', () => {
    const store = seedStore(makeStore(), { warLayerEnabled: true });
    authorSiege(store, { instigatorNeighbour: 'Ironhold', id: 'ev-siege-a' });
    const first = deploymentsOf(store).ironhold;
    expect(first).toMatchObject({ targetId: 'thornmere' });

    // Re-author another siege naming the same instigator — the engine's one-army
    // ledger must not be overwritten (still targeting thornmere, untouched).
    authorSiege(store, { instigatorNeighbour: 'Ironhold', id: 'ev-siege-b' });
    expect(deploymentsOf(store).ironhold).toEqual(first);
  });

  test('a non-member (unlinked) instigator falls back to settlement-local only', () => {
    // No neighbour link → the instigator name resolves to no campaign member, so
    // no deployment is seeded (the settlement-local hostile flip still happened in
    // mutate, but there is no cross-settlement army).
    const store = seedStore(makeStore(), { warLayerEnabled: true, neighbours: [] });
    authorSiege(store, { instigatorNeighbour: 'Nowhere' });
    expect(deploymentsOf(store)).toEqual({});
    expect(warFrontsOf(store)).toHaveLength(0);
  });
});
