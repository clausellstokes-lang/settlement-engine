/**
 * settlementSlice ⇄ campaignSlice stressor bridge — the coup-wave seam that
 * had zero tests: an authored APPLY_STRESSOR on a CANON settlement inside a
 * campaign must ALSO register the crisis as a roaming world-pulse stressor
 * (settlementSlice.applyEvent → campaignSlice.injectCampaignStressor), so the
 * pulse ages it instead of it living only on the dossier.
 *
 * Contracts pinned here:
 *   1. The roaming type is alias-mapped through GEN_TO_PULSE_TYPE (authoring
 *      'under_siege' registers type 'siege') at the authored severity, keyed
 *      world_stressor.<type>.<saveId>.
 *   2. Re-applying upserts by stable id — no stacking — and the LOCAL stress
 *      entry agrees with the roaming twin's new severity.
 *   3. A custom stressor with no roaming analog registers under its own key
 *      (normalizeStressor tolerates unknown types).
 *   4. Draft (non-canon) settlements register nothing.
 *
 * Same store assembly as campaignSlice.worldPulse.test.js (mocked lib/saves +
 * lib/campaigns, local localStorage) plus the settlementSlice stubs from
 * settlementSlice.test.js.
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

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
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

// Minimal companion stubs so settlementSlice's reads don't crash (mirrors
// settlementSlice.test.js; campaigns/setCampaignRegionalGraph come from the
// REAL campaignSlice here — the bridge under test).
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
    ...createSettlementSlice(...a),
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

function saveFor(phase) {
  return {
    id: 'ashford',
    name: 'Ashford',
    tier: 'town',
    settlement: fixture(),
    seed: 'bridge-seed',
    campaignState: {
      phase,
      eventLog: [],
      systemState: null,
      locks: {},
      generatedAt: '2026-01-01T00:00:00.000Z',
      editedAt: '2026-01-01T00:00:00.000Z',
      canonizedAt: phase === 'canon' ? '2026-01-01T00:00:00.000Z' : null,
      lastExportAt: null,
    },
  };
}

function applyStressorEvent(store, { id, type, label, severity }) {
  return store.getState().applyEvent({
    id,
    type: 'APPLY_STRESSOR',
    targetId: type,
    payload: { stressorType: type, label, severity },
    cause: 'player_action',
  });
}

function seedStore(store, phase = 'canon') {
  const save = saveFor(phase);
  store.setState(state => {
    state.savedSettlements = [save];
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      // The IMMEDIATE applyEvent→world bridge fires on settlement-canon +
      // membership; it never required world canonization. Keep the world
      // un-canonized so this settlement stays non-clock-bound and its events
      // resolve at author time. (Once the WORLD is canonized the settlement is
      // clock-bound and events queue to the pulse — the drain-time injection is
      // covered in tests/joins/campaignClockQueue.test.js.)
      worldState: { rngSeed: 'bridge-seed', tick: 0, canonizedAt: null },
    }];
  });
  store.getState().hydrateFromSave(save);
  return store;
}

describe('APPLY_STRESSOR → roaming world-pulse registration', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('a canon authored stressor registers alias-mapped at the authored severity', () => {
    const store = seedStore(makeStore(), 'canon');
    applyStressorEvent(store, { id: 'ev-bridge-1', type: 'under_siege', label: 'Under Siege', severity: 0.8 });

    const stressors = store.getState().campaigns[0].worldState.stressors || [];
    expect(stressors).toHaveLength(1);
    expect(stressors[0]).toMatchObject({
      id: 'world_stressor.siege.ashford',
      type: 'siege',                       // alias-mapped, NOT 'under_siege'
      label: 'Under Siege',
      severity: 0.8,
      originSettlementId: 'ashford',
      affectedSettlementIds: ['ashford'],
      status: 'active',
    });
  });

  test('re-applying upserts (no stacking) and the local entry agrees', () => {
    const store = seedStore(makeStore(), 'canon');
    applyStressorEvent(store, { id: 'ev-bridge-2a', type: 'under_siege', label: 'Under Siege', severity: 0.8 });
    applyStressorEvent(store, { id: 'ev-bridge-2b', type: 'under_siege', label: 'Under Siege', severity: 0.4 });

    const stressors = store.getState().campaigns[0].worldState.stressors || [];
    expect(stressors).toHaveLength(1);
    expect(stressors[0].id).toBe('world_stressor.siege.ashford');
    expect(stressors[0].severity).toBe(0.4);

    // The settlement-side entry upserted to the same authored severity — the
    // dossier and the roaming twin tell the DM the same story.
    const local = (store.getState().settlement.stress || []).filter(s => s.type === 'under_siege');
    expect(local).toHaveLength(1);
    expect(local[0].severity).toBe(0.4);
  });

  test('a custom stressor with no roaming analog registers under its own key', () => {
    const store = seedStore(makeStore(), 'canon');
    applyStressorEvent(store, { id: 'ev-bridge-3', type: 'dragon_tax', label: 'Dragon Tax', severity: 0.6 });

    const stressors = store.getState().campaigns[0].worldState.stressors || [];
    expect(stressors).toHaveLength(1);
    expect(stressors[0]).toMatchObject({
      id: 'world_stressor.dragon_tax.ashford',
      type: 'dragon_tax',
      label: 'Dragon Tax',
      severity: 0.6,
    });
  });

  test('a draft (non-canon) settlement registers nothing', () => {
    const store = seedStore(makeStore(), 'draft');
    applyStressorEvent(store, { id: 'ev-bridge-4', type: 'under_siege', label: 'Under Siege', severity: 0.8 });

    expect(store.getState().campaigns[0].worldState.stressors || []).toHaveLength(0);
    // The settlement mutation itself still applied (draft edits mutate, they
    // just don't write the timeline or the world).
    expect((store.getState().settlement.stress || []).some(s => s.type === 'under_siege')).toBe(true);
  });
});

// Editor roster wave — the INVERSE bridge: an authored RESOLVE_STRESSOR on a
// canon settlement resolves the roaming twin through the same directed path
// the party-impact hook uses (resolveStressorById), leaving the echo under the
// stable id and queueing the residual aftermath as pending world-pulse
// proposals. Draft settlements touch nothing in the world.
describe('RESOLVE_STRESSOR → roaming twin resolution', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  function resolveStressorEvent(store, { id, type, label }) {
    return store.getState().applyEvent({
      id,
      type: 'RESOLVE_STRESSOR',
      targetId: type,
      payload: { stressorType: type, label },
      cause: 'player_action',
    });
  }

  test('resolving an authored stressor ends the roaming twin with residuals', () => {
    const store = seedStore(makeStore(), 'canon');
    applyStressorEvent(store, { id: 'ev-res-1a', type: 'under_siege', label: 'Under Siege', severity: 0.8 });
    resolveStressorEvent(store, { id: 'ev-res-1b', type: 'under_siege', label: 'Under Siege' });

    const ws = store.getState().campaigns[0].worldState;
    // No active crisis remains; the echo lingers under the SAME stable id
    // (a re-ignition overwrites it instead of stacking beside it).
    expect((ws.stressors || []).filter(s => s.status === 'active')).toHaveLength(0);
    const echo = (ws.stressors || []).find(s => s.id === 'world_stressor.siege.ashford');
    expect(echo?.status).toBe('residual');
    // The residual aftermath is queued as a pending proposal carrying the
    // stressor_residual condition (the shape applyWorldPulseProposal consumes).
    const residuals = (ws.proposals || []).filter(p =>
      p.status === 'pending' && p.outcome?.condition?.archetype === 'stressor_residual');
    expect(residuals).toHaveLength(1);
    expect(residuals[0].outcome.targetSaveId).toBe('ashford');
    // And the settlement-side entry is gone — both representations agree.
    expect((store.getState().settlement.stress || []).some(s => s.type === 'under_siege')).toBe(false);
  });

  test('resolving an unregistered type leaves the world untouched', () => {
    const store = seedStore(makeStore(), 'canon');
    applyStressorEvent(store, { id: 'ev-res-2a', type: 'under_siege', label: 'Under Siege', severity: 0.8 });
    resolveStressorEvent(store, { id: 'ev-res-2b', type: 'famine', label: 'Famine' });

    const ws = store.getState().campaigns[0].worldState;
    expect((ws.stressors || []).filter(s => s.status === 'active')).toHaveLength(1);
    expect(ws.proposals || []).toHaveLength(0);
  });

  test('a draft (non-canon) settlement resolves nothing in the world', () => {
    const store = seedStore(makeStore(), 'draft');
    // Seed the roaming stressor directly (the inject bridge is canon-only).
    store.getState().injectCampaignStressor('camp-1', {
      type: 'siege',
      originSettlementId: 'ashford',
      affectedSettlementIds: ['ashford'],
      severity: 0.8,
    });
    resolveStressorEvent(store, { id: 'ev-res-3', type: 'under_siege', label: 'Under Siege' });

    const ws = store.getState().campaigns[0].worldState;
    expect((ws.stressors || []).filter(s => s.status === 'active')).toHaveLength(1);
    expect(ws.proposals || []).toHaveLength(0);
  });
});
