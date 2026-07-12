/**
 * campaignWorldPulseSpatialCanon.test.js — Phase 5.5 KEYSTONE, the entitled
 * spatial-canonize seam at the STORE.
 *
 * Proves the gates that keep the installed base byte-identical and the entitlement
 * at the call site (the manager's PART 1 §1.2 sensitive reads):
 *   - not premium ⇒ not_entitled, NOTHING written (no marker, no digest);
 *   - imported / custom-backdrop map ⇒ not_generated_map, nothing written;
 *   - capture unavailable (the deferred live-iframe seam) ⇒ typed no-op,
 *     byte-invisible (the plain worldState is untouched);
 *   - an INJECTED capture ⇒ a frozen digest is written under the marker;
 *     re-canonize BUMPS spatialCanonVersion and re-derives;
 *   - the PLAIN canonizeCampaignWorld never stamps a spatial marker (the aspatial
 *     path stays byte-identical).
 *
 * The entitlement is read at the store call site (get().auth?.tier) — the domain
 * module stays tier-blind (asserted structurally in spatialDigest.invariants).
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

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

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
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
  // Slices this seam reads that aren't composed here: seed them directly.
  auth: { tier: 'premium' },
  mapState: { customBackdrop: null },
  setPurchaseModalOpen: () => {}, setActivePricingMoment: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a), ...createCampaignWorldPulseSlice(...a) })));
}

function settlement(name) {
  return {
    name, tier: 'town', population: 1500,
    config: { tradeRouteAccess: 'road', priorityEconomy: 20 },
    institutions: [], economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: { publicLegitimacy: { score: 30, label: 'Contested' }, factions: [], conflicts: [] },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }], activeConditions: [],
  };
}

function seedStore(store) {
  store.setState(state => {
    state.savedSettlements = [{
      id: 'ashford', name: 'Ashford', phase: 'canon',
      settlement: settlement('Ashford'), campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph(), wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'keystone-store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
}

// A capture that returns a deterministic fixture pack + placements.
function fixtureCapture(count = 6) {
  const pack = makeGridPack({ cols: 18, rows: 14 });
  const placements = placeSettlements(pack, count);
  return async () => ({ pack, placements });
}

describe('KEYSTONE — entitled spatial canonize at the store', () => {
  beforeEach(() => { installLocalStorage(); localStorage.removeItem('sf_campaigns'); });

  test('non-premium ⇒ not_entitled, nothing written', async () => {
    const store = makeStore();
    seedStore(store);
    store.setState(state => { state.auth = { tier: 'free' }; });
    const before = JSON.stringify(store.getState().campaigns[0].worldState);
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: fixtureCapture() });
    expect(result).toEqual({ ok: false, reason: 'not_entitled' });
    expect(JSON.stringify(store.getState().campaigns[0].worldState)).toBe(before);
  });

  test('imported / custom-backdrop map ⇒ not_generated_map, nothing written', async () => {
    const store = makeStore();
    seedStore(store);
    store.setState(state => { state.mapState = { customBackdrop: { imageUrl: 'blob:imported' } }; });
    const before = JSON.stringify(store.getState().campaigns[0].worldState);
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: fixtureCapture() });
    expect(result).toEqual({ ok: false, reason: 'not_generated_map' });
    expect(JSON.stringify(store.getState().campaigns[0].worldState)).toBe(before);
  });

  test('capture unavailable (default) ⇒ byte-invisible no-op', async () => {
    const store = makeStore();
    seedStore(store);
    const before = JSON.stringify(store.getState().campaigns[0].worldState);
    // No injected capture ⇒ the default returns null (deferred live-iframe seam).
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1');
    expect(result).toEqual({ ok: false, reason: 'spatial_capture_unavailable' });
    expect(JSON.stringify(store.getState().campaigns[0].worldState)).toBe(before);
    expect(store.getState().campaigns[0].worldState.spatialCanonVersion).toBeUndefined();
    expect(store.getState().campaigns[0].worldState.spatialDigest).toBeUndefined();
  });

  test('injected capture ⇒ frozen digest written under the marker; re-canonize bumps + re-derives', async () => {
    const store = makeStore();
    seedStore(store);
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: fixtureCapture(6) });
    expect(result.ok).toBe(true);
    expect(result.spatialCanonVersion).toBe(1);
    const ws = store.getState().campaigns[0].worldState;
    expect(ws.spatialCanonVersion).toBe(1);
    expect(ws.spatialDigest).toBeTruthy();
    expect(ws.spatialDigest.settlementIds.length).toBe(6);
    expect(ws.spatialDigest.reserved).toEqual({ airField: null, seaLanes: null, seasonalOverlay: null, teleportEdges: null });
    // canonizedAt is stamped too (a spatial canonize IS a canonize).
    expect(ws.canonizedAt).toBeTruthy();

    // Re-canonize with more settlements ⇒ version bumps, digest re-derives.
    const again = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: fixtureCapture(9) });
    expect(again.spatialCanonVersion).toBe(2);
    const ws2 = store.getState().campaigns[0].worldState;
    expect(ws2.spatialCanonVersion).toBe(2);
    expect(ws2.spatialDigest.settlementIds.length).toBe(9);
  });

  test('the PLAIN canonizeCampaignWorld never stamps a spatial marker', async () => {
    const store = makeStore();
    seedStore(store);
    await store.getState().canonizeCampaignWorld('camp-1');
    const ws = store.getState().campaigns[0].worldState;
    expect(ws.spatialCanonVersion).toBeUndefined();
    expect(ws.spatialDigest).toBeUndefined();
  });
});
