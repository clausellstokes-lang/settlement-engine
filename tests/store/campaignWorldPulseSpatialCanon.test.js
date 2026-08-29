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
import {
  registerSpatialCaptureBridge,
  unregisterSpatialCaptureBridge,
} from '../../src/lib/spatialCaptureRegistry.js';
import { makeGridPack, placeSettlements, placePortSettlements, placeTeleportSettlements } from '../fixtures/spatialPackFixtures.js';

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

// A capture whose placements carry water-access institutions on coastal/river cells
// (the M8 port-eligibility CAPABILITY read) ⇒ the live canonize LIGHTS the sea lanes.
function portCapture() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placePortSettlements(pack, { nCoastal: 3, nRiver: 2, nInland: 3 });
  return async () => ({ pack, placements });
}

// A capture whose placements carry a teleport-capable institution (a teleportation
// circle) on ≥2 settlements (the M9c capability read) ⇒ the live canonize LIGHTS the
// teleport bloc edge set.
function teleportCapture() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeTeleportSettlements(pack, { nCircle: 3, nPlain: 4 });
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
    // SEASONS-B (M3): a NEW live canon LIGHTS the seasonal-road overlay under
    // overlayVersion 2 (the §V.1 receipted re-canonize). The OTHER three reserved
    // slots stay null (their own waves light them). Existing SAVED canons keep
    // their frozen v1 (no overlay) and read dormant — byte-identical.
    expect(ws.spatialDigest.overlayVersion).toBe(2);
    expect(ws.spatialDigest.reserved.airField).toBeNull();
    // SEA LANES (M8): the live canon opts into seaLanes too, but THIS capture's
    // placements carry no water-access institutions ⇒ no eligible ports ⇒ the slot
    // stays null (the dormancy floor). A port-carrying capture lights it (below).
    expect(ws.spatialDigest.reserved.seaLanes).toBeNull();
    expect(ws.spatialDigest.reserved.teleportEdges).toBeNull();
    expect(ws.spatialDigest.reserved.seasonalOverlay).toBeTruthy();
    expect(ws.spatialDigest.reserved.seasonalOverlay.version).toBe(2);
    expect(ws.spatialDigest.reserved.seasonalOverlay.seasonTerrainCost.winter.mountain).toBeGreaterThan(1);
    // canonizedAt is stamped too (a spatial canonize IS a canonize).
    expect(ws.canonizedAt).toBeTruthy();

    // Re-canonize with more settlements ⇒ version bumps, digest re-derives.
    const again = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: fixtureCapture(9) });
    expect(again.spatialCanonVersion).toBe(2);
    const ws2 = store.getState().campaigns[0].worldState;
    expect(ws2.spatialCanonVersion).toBe(2);
    expect(ws2.spatialDigest.settlementIds.length).toBe(9);
  });

  test('an advance that starts during capture wins; the stale spatial digest is not committed', async () => {
    const store = makeStore();
    seedStore(store);
    const before = JSON.stringify(store.getState().campaigns[0].worldState);
    let releaseCapture;
    let markCaptureEntered;
    const captureBlocked = new Promise((resolve) => {
      releaseCapture = resolve;
    });
    const captureEntered = new Promise((resolve) => {
      markCaptureEntered = resolve;
    });
    const pack = makeGridPack({ cols: 18, rows: 14 });
    const placements = placeSettlements(pack, 6);
    const canonizing = store.getState().canonizeCampaignWorldSpatial('camp-1', {
      captureSpatialPack: async () => {
        markCaptureEntered();
        await captureBlocked;
        return { pack, placements };
      },
    });

    // Simulate the advance's synchronous reservation while the capture awaits.
    await captureEntered;
    store.setState((state) => {
      state.advanceInFlight = ['camp-1'];
    });
    releaseCapture();

    await expect(canonizing).resolves.toEqual({ ok: false, reason: 'advance_in_flight' });
    expect(JSON.stringify(store.getState().campaigns[0].worldState)).toBe(before);
  });

  test('BIOME TRUTH (V-6): the virtual biomeTruthEnabled flag LIGHTS the biomes sub-digest; absent ⇒ no key', async () => {
    const store = makeStore();
    seedStore(store);
    // DARK (flag absent from simulationRules): the injected canon carries NO biomes key ⇒
    // byte-identical to the pre-V-6 canon (the same posture as every existing saved canon).
    await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: fixtureCapture(6) });
    expect('biomes' in store.getState().campaigns[0].worldState.spatialDigest).toBe(false);
    // LIGHT the virtual flag on the campaign worldState ⇒ a re-canonize freezes the biome
    // sub-digest into the canon (per-settlement biome id + terrain class).
    store.setState(state => { state.campaigns[0].worldState.simulationRules = { biomeTruthEnabled: true }; });
    const lit = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: fixtureCapture(6) });
    expect(lit.ok).toBe(true);
    const ws = store.getState().campaigns[0].worldState;
    expect(ws.spatialDigest.biomes, 'the biome sub-digest materializes when the flag is lit').toBeTruthy();
    expect(ws.spatialDigest.biomes.version).toBe(1);
    expect(Object.keys(ws.spatialDigest.biomes.bySettlement).length).toBe(6);
  });

  test('SEA LANES (M8): a port-carrying capture LIGHTS the seaLanes slot (the opt-in)', async () => {
    const store = makeStore();
    seedStore(store);
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: portCapture() });
    expect(result.ok).toBe(true);
    const ws = store.getState().campaigns[0].worldState;
    const seaLanes = ws.spatialDigest.reserved.seaLanes;
    // ≥2 eligible ports (geography ∧ institution) ⇒ the frozen sea edge set materializes.
    expect(seaLanes).toBeTruthy();
    expect(seaLanes.version).toBe(1);
    expect(seaLanes.ports.length).toBeGreaterThanOrEqual(2);
    // A SPARSE, water-reachability-constrained edge set (not the O(P²) clique).
    expect(seaLanes.edges.length).toBeGreaterThan(0);
    expect(seaLanes.edges.length).toBeLessThanOrEqual((seaLanes.ports.length * (seaLanes.ports.length - 1)) / 2);
    expect(seaLanes.stormSeasonCost.winter).toBeGreaterThan(seaLanes.stormSeasonCost.summer);
    // The other reserved slots + geometry axes are unchanged by lighting sea lanes.
    expect(ws.spatialDigest.reserved.airField).toBeNull();
    expect(ws.spatialDigest.reserved.teleportEdges).toBeNull();
    expect(ws.spatialDigest.spatialGeometryVersion).toBe(1);
    expect(ws.spatialDigest.costLawVersion).toBe(1);
  });

  test('TELEPORT BLOCS (M9c): a circle-carrying capture LIGHTS the teleportEdges slot (the opt-in)', async () => {
    const store = makeStore();
    seedStore(store);
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: teleportCapture() });
    expect(result.ok).toBe(true);
    const ws = store.getState().campaigns[0].worldState;
    const teleport = ws.spatialDigest.reserved.teleportEdges;
    // ≥2 circle-holders (a teleport-capable institution) ⇒ the frozen bloc edge set
    // materializes — the CLIQUE OF THE WILLING (every holder adjacent to every other).
    expect(teleport).toBeTruthy();
    expect(teleport.version).toBe(1);
    expect(teleport.nodes.length).toBe(3);
    // A full clique among 3 holders = 3 edges (rarity is the bound — no O(P²) concern).
    expect(teleport.edges.length).toBe(3);
    expect(teleport.edges.every(e => e.cost >= 1 && e.capacity >= 1)).toBe(true);
    // Only the circle-holders (t000..t002) are bloc nodes; the plain settlements are not.
    expect(teleport.nodes).toEqual(['t000', 't001', 't002']);
    // The other reserved slots + geometry axes are unchanged by lighting teleport.
    expect(ws.spatialDigest.reserved.airField).toBeNull();
    // This capture's placements carry no water-access institution ⇒ seaLanes stays null.
    expect(ws.spatialDigest.reserved.seaLanes).toBeNull();
    expect(ws.spatialDigest.spatialGeometryVersion).toBe(1);
    expect(ws.spatialDigest.costLawVersion).toBe(1);
  });

  test('SEAM-0: composer-shaped placements canonize a FALSE canon, not a lockout', async () => {
    // W-SEAM SEAM-0 — the end-to-end consequence of the coercion pinned at the
    // capture seam (tests/lib/spatialPackCapture.test.js). An Instant World's
    // placements carry `cellId: null` + a nominal-canvas x/y (pinned at the mint
    // site in tests/lib/instantWorld/composeInstantWorld.test.js). Because
    // `Number(null) === 0`, EVERY member is seeded at map cell 0 — so the canonize
    // does not refuse. It SUCCEEDS, stamps spatialCanonVersion 1 (the gate CTA flips
    // to "Geography mapped ✓"), and freezes a digest that describes a realm that
    // does not exist: with cell 0 in the ocean, ZERO settlements survive; with cell 0
    // on land, exactly ONE does and the rest are `shared_cell`.
    //
    // ⚠ PINS A DEFECT DELIBERATELY — the reproduce half of a reproduce-then-clear
    // pair. SEAM-2 re-resolves the cell from the stored x/y and re-records these
    // expectations in the same act.
    const store = makeStore();
    seedStore(store);
    store.setState(state => {
      state.savedSettlements = ['ashford', 'brackwell', 'corran'].map(id => ({
        id, name: id, phase: 'canon',
        settlement: settlement(id), campaignState: { phase: 'canon', eventLog: [], locks: {} },
      }));
      state.campaigns[0].settlementIds = ['ashford', 'brackwell', 'corran'];
      state.mapState = {
        customBackdrop: null,
        placements: {
          iw_b0: { settlementId: 'ashford', x: 500, y: 300, cellId: null },
          iw_b1: { settlementId: 'brackwell', x: 326, y: 163, cellId: null },
          iw_b2: { settlementId: 'corran', x: 368, y: 329, cellId: null },
        },
      };
    });

    // (a) cell 0 is OCEAN (makeGridPack's default top-left bay) ⇒ a canon of NOTHING.
    const oceanPack = makeGridPack({ cols: 18, rows: 14 });
    expect(oceanPack.cells.h[0]).toBeLessThan(20);
    registerSpatialCaptureBridge({ isReady: true, getSpatialPack: async () => ({ pack: oceanPack }) });
    const drowned = await store.getState().canonizeCampaignWorldSpatial('camp-1');
    unregisterSpatialCaptureBridge();

    expect(drowned.ok).toBe(true);
    expect(drowned.spatialCanonVersion).toBe(1);
    const dws = store.getState().campaigns[0].worldState;
    expect(dws.spatialDigest.settlementIds).toEqual([]);
    expect(dws.spatialDigest.skippedSettlements.map(r => r.reason)).toEqual(['not_land', 'not_land', 'not_land']);

    // (b) cell 0 is LAND ⇒ the whole realm collapses onto that ONE cell.
    const landPack = makeGridPack({ cols: 18, rows: 14, bay: false });
    expect(landPack.cells.h[0]).toBeGreaterThanOrEqual(20);
    registerSpatialCaptureBridge({ isReady: true, getSpatialPack: async () => ({ pack: landPack }) });
    const collapsed = await store.getState().canonizeCampaignWorldSpatial('camp-1');
    unregisterSpatialCaptureBridge();

    expect(collapsed.ok).toBe(true);
    const cws = store.getState().campaigns[0].worldState;
    expect(cws.spatialDigest.settlementIds).toEqual(['ashford']);
    expect(cws.spatialDigest.skippedSettlements).toEqual([
      { id: 'brackwell', reason: 'shared_cell' },
      { id: 'corran', reason: 'shared_cell' },
    ]);
  });

  test('SEAM-1: a successful canonize lowers the session divergence signal', async () => {
    // W-SEAM SEAM-1 (S1). The signal says "terrain tools were used since this realm's
    // geography was frozen". A canonize refreezes it, so the warning must not survive
    // the act that answers it. The field lives OUTSIDE mapState (mapSlice, session
    // only), so nothing persisted moves — asserted here as well.
    const store = makeStore();
    seedStore(store);
    store.setState(state => { state.geographyMayHaveDiverged = true; });
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: fixtureCapture(6) });
    expect(result.ok).toBe(true);
    expect(store.getState().geographyMayHaveDiverged).toBe(false);
    const ws = store.getState().campaigns[0].worldState;
    expect('geographyMayHaveDiverged' in ws).toBe(false);
    expect('geographyMayHaveDiverged' in store.getState().campaigns[0]).toBe(false);
  });

  test('SEAM-1: a contradicted terrain lands a capture-receipt row in the frozen digest', async () => {
    // The S3 seam end to end: the settlement declares itself coastal, the fixture grid
    // seats it inland, and the frozen canon now SAYS SO instead of carrying the
    // disagreement silently forever. The receipt reports; terrainType is never rewritten.
    const store = makeStore();
    seedStore(store);
    store.setState(state => {
      state.savedSettlements = [{
        id: 'ashford', name: 'Ashford', phase: 'canon',
        settlement: {
          ...settlement('Ashford'),
          config: { tradeRouteAccess: 'road', priorityEconomy: 20, terrainType: 'coastal' },
        },
        campaignState: { phase: 'canon', eventLog: [], locks: {} },
      }];
    });
    const pack = makeGridPack({ cols: 18, rows: 14 });
    // An interior land cell: not the shore, so `coastal` is refuted by the ground.
    const interior = 9 * 18 + 9;
    expect(pack.cells.h[interior]).toBeGreaterThanOrEqual(20);
    registerSpatialCaptureBridge({ isReady: true, getSpatialPack: async () => ({ pack }) });
    store.setState(state => {
      state.mapState = {
        customBackdrop: null,
        placements: { b1: { settlementId: 'ashford', x: 0, y: 0, cellId: interior } },
      };
    });
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1');
    unregisterSpatialCaptureBridge();

    expect(result.ok).toBe(true);
    const digest = store.getState().campaigns[0].worldState.spatialDigest;
    expect(digest.captureReceipt.terrainDisagreements).toEqual([
      { id: 'ashford', configTerrain: 'coastal', mapTerrain: digest.captureReceipt.terrainDisagreements[0].mapTerrain },
    ]);
    expect(digest.captureReceipt.terrainDisagreements[0].mapTerrain).not.toBe('coastal');
    // The dossier is untouched — the receipt reports, it never repairs.
    expect(store.getState().savedSettlements[0].settlement.config.terrainType).toBe('coastal');
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
