/**
 * tests/store/simulationRulesCascade.test.js — the living-world dependency
 * cascade at the updateCampaignSimulationRules write seam.
 *
 * RELATIONSHIP DRIFT ⊃ WAR: war is a relationship dynamic (hostile edges
 * escalate into fronts), so the War layer cannot run while inter-settlement
 * relationship drift is frozen. The cascade is enforced at the write seam —
 * NOT in normalizeSimulationRules — matching the existing war→strategy
 * coupling's documented discipline (engine-direct callers and saved campaigns
 * stay untouched until the DM actually changes a rule). Pins:
 *
 *   (1) turning drift OFF cascades War AND Strategy off in the same write;
 *   (2) trying to turn War ON while drift is off is refused (war stays off);
 *   (3) turning War on with drift on still auto-activates Strategy (the
 *       pre-existing coupling survives the new cascade);
 *   (4) turning drift back ON does not resurrect War by itself (the DM
 *       re-arms war deliberately).
 */
import { beforeEach, describe, test, expect, vi } from 'vitest';
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
      saveCached: vi.fn((list, ownerId = 'anon') => { cached.set(ownerId, clone(list)); }),
      isConfigured: false,
      upsert: vi.fn(() => Promise.resolve(null)),
      remove: vi.fn(() => Promise.resolve()),
    },
  };
});

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
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
  auth: { user: null, tier: 'free', loading: false },
  config: {},
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
});

function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createSettlementSlice(...a),
    ...createCampaignSlice(...a),
    ...createCampaignRegionalSlice(...a),
    ...createCampaignWorldPulseSlice(...a),
  })));
}

function seed(store, simulationRules = {}) {
  store.setState(state => {
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: [],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 's', tick: 0, simulationRules },
    }];
  });
}

const rulesOf = store => store.getState().campaigns[0].worldState.simulationRules;

describe('relationship drift ⊃ war at the write seam', () => {
  beforeEach(() => {
    installLocalStorage();
  });

  test('(1) turning drift OFF cascades War and Strategy off in the same write', async () => {
    const store = makeStore();
    seed(store, { relationshipDynamicsEnabled: true, warLayerEnabled: true, settlementStrategyEnabled: true });
    await store.getState().updateCampaignSimulationRules('camp-1', { relationshipDynamicsEnabled: false });
    const rules = rulesOf(store);
    expect(rules.relationshipDynamicsEnabled).toBe(false);
    expect(rules.warLayerEnabled).toBe(false);
    expect(rules.settlementStrategyEnabled).toBe(false);
  });

  test('(2) War cannot be turned ON while drift is off (the write lands, war stays off)', async () => {
    const store = makeStore();
    seed(store, { relationshipDynamicsEnabled: false });
    await store.getState().updateCampaignSimulationRules('camp-1', { warLayerEnabled: true });
    const rules = rulesOf(store);
    expect(rules.warLayerEnabled).toBe(false);
    expect(rules.settlementStrategyEnabled).toBe(false);
  });

  test('(3) with drift on, War still auto-activates Strategy (pre-existing coupling intact)', async () => {
    const store = makeStore();
    seed(store, { relationshipDynamicsEnabled: true });
    await store.getState().updateCampaignSimulationRules('camp-1', { warLayerEnabled: true });
    const rules = rulesOf(store);
    expect(rules.warLayerEnabled).toBe(true);
    expect(rules.settlementStrategyEnabled).toBe(true);
  });

  test('(4) turning drift back ON does not resurrect War by itself', async () => {
    const store = makeStore();
    seed(store, { relationshipDynamicsEnabled: true, warLayerEnabled: true, settlementStrategyEnabled: true });
    await store.getState().updateCampaignSimulationRules('camp-1', { relationshipDynamicsEnabled: false });
    await store.getState().updateCampaignSimulationRules('camp-1', { relationshipDynamicsEnabled: true });
    const rules = rulesOf(store);
    expect(rules.relationshipDynamicsEnabled).toBe(true);
    expect(rules.warLayerEnabled).toBe(false);           // the DM re-arms war deliberately
    expect(rules.settlementStrategyEnabled).toBe(false);
  });
});
