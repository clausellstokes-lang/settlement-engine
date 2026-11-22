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
import { makeGridPack, placeSettlements, placePortSettlements, placeTeleportSettlements, makeLakePack } from '../fixtures/spatialPackFixtures.js';
import { realmReach } from '../../src/domain/spatial/distanceRead.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { capturePulseSnapshot } from '../../src/store/campaignPulseHelpers.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { hydratePersistedCampaignWorld } from '../../src/store/campaignHydration.js';
import { campaigns as campaignService } from '../../src/lib/campaigns.js';

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

// W-CAP CAP-1/CAP-3: a capture carrying the WIDENED surface (flux + the pack→grid index
// + the GRID-indexed climate), which is what a real live capture hands over since CAP-1.
function climateCapture(count = 6) {
  const pack = makeGridPack({ cols: 18, rows: 14, capture: true });
  const placements = placeSettlements(pack, count);
  return async () => ({ pack, placements });
}

// W-CAP CAP-4: a capture whose map holds an INTERIOR water body (one that touches no map
// edge) beside a frame-touching ocean strip ⇒ the live canonize freezes a lake.
function lakeCapture(count = 4) {
  const pack = makeLakePack({});
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

  test('CLIMATE TRUTH (CAP-3): the virtual climateTruthEnabled flag LIGHTS the climate sub-digest; absent ⇒ no key', async () => {
    const store = makeStore();
    seedStore(store);
    // DARK (flag absent from simulationRules): even a capture that CARRIES the grid climate
    // freezes NO climate key. The capture surface being wider is not the gate; the flag is.
    await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: climateCapture(6) });
    expect('climate' in store.getState().campaigns[0].worldState.spatialDigest).toBe(false);
    // LIGHT it ⇒ a re-canonize freezes the per-settlement band + the readings behind it.
    store.setState(state => { state.campaigns[0].worldState.simulationRules = { climateTruthEnabled: true }; });
    const lit = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: climateCapture(6) });
    expect(lit.ok).toBe(true);
    const ws = store.getState().campaigns[0].worldState;
    expect(ws.spatialDigest.climate, 'the climate sub-digest materializes when the flag is lit').toBeTruthy();
    expect(ws.spatialDigest.climate.version).toBe(1);
    expect(Object.keys(ws.spatialDigest.climate.bySettlement).length).toBe(6);
    for (const row of Object.values(ws.spatialDigest.climate.bySettlement)) {
      expect(['harsh', 'standard', 'mild', 'unknown']).toContain(row.band);
    }
    // The two canon-freeze options are INDEPENDENT: lighting climate does not light biomes.
    expect('biomes' in ws.spatialDigest).toBe(false);
  });

  test('CLIMATE TRUTH (CAP-3): a lit flag over a capture with NO grid climate freezes `unknown`, not a guess', async () => {
    // The honest-absence arm. An older map (or a capture predating CAP-1's widening) has no
    // grid climate at all; the canon must record that it does not know, and must still
    // record it under its own version so a later re-canonize can tell the two apart.
    const store = makeStore();
    seedStore(store);
    store.setState(state => { state.campaigns[0].worldState.simulationRules = { climateTruthEnabled: true }; });
    const lit = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: fixtureCapture(6) });
    expect(lit.ok).toBe(true);
    const climate = store.getState().campaigns[0].worldState.spatialDigest.climate;
    expect(climate.version).toBe(1);
    for (const row of Object.values(climate.bySettlement)) {
      expect(row).toEqual({ band: 'unknown', temp: null, prec: null });
    }
  });

  test('LAKE TYPOLOGY (CAP-4): a capture with INTERIOR water freezes the lake sub-digest; frame-touching water does not', async () => {
    const store = makeStore();
    seedStore(store);
    // The ordinary fixture map's only water is an ocean BAY in the corner, which reaches
    // the map frame — so a real canonize over it freezes NO lakes key at all. That is the
    // dormancy floor, and it is what makes the positive arm below mean something.
    await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: fixtureCapture(6) });
    expect('lakes' in store.getState().campaigns[0].worldState.spatialDigest).toBe(false);
    // A capture whose map holds an INTERIOR body freezes it, typed from the water budget.
    const lit = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: lakeCapture(4) });
    expect(lit.ok).toBe(true);
    const lakes = store.getState().campaigns[0].worldState.spatialDigest.lakes;
    expect(lakes, 'the interior body reaches the canon').toBeTruthy();
    expect(lakes.version).toBe(1);
    expect(lakes.bodies.length).toBe(1);
    expect(lakes.bodies[0].subtype).toBe('freshwater');
    expect(lakes.bodies[0].shoreline.length).toBeGreaterThan(0);
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
    // v2 since W-CAP CAP-2 (the river-navigability port rule). A NEW canon stamps the law
    // that derived it; an existing canon keeps its own frozen version forever.
    expect(seaLanes.version).toBe(2);
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

  // Three realm members, placed the way the Instant World composer places them:
  // `cellId: null` and a nominal-canvas x/y (pinned at the mint site in
  // tests/lib/instantWorld/composeInstantWorld.test.js).
  const seedComposerShapedRealm = (store) => {
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
  };

  test('SEAM-0/SEAM-2: composer-shaped placements now REFUSE instead of freezing a false canon', async () => {
    // W-SEAM SEAM-0 measured the end-to-end consequence of the `Number(null) === 0`
    // coercion at the capture seam: the canonize did NOT refuse. It SUCCEEDED, stamped
    // spatialCanonVersion 1 (the CTA flips to "Geography mapped ✓"), and froze a digest
    // describing a realm that does not exist — with cell 0 in the ocean, settlementIds
    // was EMPTY and all three members were recorded `not_land`; with cell 0 on land,
    // exactly one seeded it and the rest were `shared_cell`. Under freeze-first that is
    // permanent.
    //
    // SEAM-2 is the CLEAR half. The null stays null; no placement can witness that these
    // nominal coordinates belong to the captured pack's frame; so nothing is remapped,
    // nothing is admitted, and the store refuses with a typed reason the CTA can explain.
    // Nothing is written either way.
    const store = makeStore();
    seedStore(store);
    seedComposerShapedRealm(store);
    const before = JSON.stringify(store.getState().campaigns[0].worldState);

    for (const pack of [makeGridPack({ cols: 18, rows: 14 }), makeGridPack({ cols: 18, rows: 14, bay: false })]) {
      registerSpatialCaptureBridge({ isReady: true, getSpatialPack: async () => ({ pack }) });
      const result = await store.getState().canonizeCampaignWorldSpatial('camp-1');
      unregisterSpatialCaptureBridge();
      expect(result).toEqual({ ok: false, reason: 'spatial_placements_unresolved' });
      expect(JSON.stringify(store.getState().campaigns[0].worldState)).toBe(before);
      expect(store.getState().campaigns[0].worldState.spatialCanonVersion).toBeUndefined();
      expect(store.getState().campaigns[0].worldState.spatialDigest).toBeUndefined();
    }
  });

  test('SEAM-2: one anchored placement witnesses the frame and re-derives the rest, on the receipt', async () => {
    // The cure the refusal above points at: the DM drags ONE member into place, which
    // records a real cell for real map coordinates. That row now witnesses the frame, so
    // the other two resolve from their own stored coordinates — and the canon says so.
    const store = makeStore();
    seedStore(store);
    seedComposerShapedRealm(store);
    const pack = makeGridPack({ cols: 18, rows: 14, bay: false, spacing: 40 });
    const anchorCell = 5 * 18 + 5; // p = [200, 200]
    store.setState(state => {
      state.mapState.placements.iw_b0 = {
        settlementId: 'ashford', x: 200, y: 200, cellId: anchorCell,
      };
      // The other two now carry coordinates in the SAME map space.
      state.mapState.placements.iw_b1 = { settlementId: 'brackwell', x: 280, y: 200, cellId: null };
      state.mapState.placements.iw_b2 = { settlementId: 'corran', x: 200, y: 320, cellId: null };
    });

    registerSpatialCaptureBridge({ isReady: true, getSpatialPack: async () => ({ pack }) });
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1');
    unregisterSpatialCaptureBridge();

    expect(result.ok).toBe(true);
    const digest = store.getState().campaigns[0].worldState.spatialDigest;
    // All three reached the canon, each on its OWN cell — not collapsed onto one.
    expect(digest.settlementIds).toEqual(['ashford', 'brackwell', 'corran']);
    expect(digest.skippedSettlements).toEqual([]);
    // And the canon records that two of those cells were RE-DERIVED, never claiming
    // they were "cured" — no provenance stamp exists to prove the pack in hand is the
    // geometry those coordinates came from. That is SEAM-3.
    expect(digest.captureReceipt.cellResolution).toEqual([
      { id: 'brackwell', from: null, to: 5 * 18 + 7, reason: 'cell_derived' },
      { id: 'corran', from: null, to: 8 * 18 + 5, reason: 'cell_derived' },
    ]);
    // The store's own placement rows are untouched — SEAM-2 never writes mapState.
    expect(store.getState().mapState.placements.iw_b1.cellId).toBeNull();
    expect(store.getState().mapState.placements.iw_b2.cellId).toBeNull();
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

// ── FP WY-1 THE SCALE CHARTER — the km-scale datum's canonize lifecycle ─────────────────
// The datum rides the ONE canonize body (runSpatialCanonize): creation-supplied on the first
// canonize, RE-RECEIVED from the prior digest on every receipted re-canonize (the rebuild
// path), healed to absent with a receipt when refused, persisted through the campaign cache,
// and captured whole by the pulse ring. docs/DESIGN_FP_ARCH_WY.md §1a.1 and §5 WY-1.

/** One fixed geometry, with an optional founding edit that leaves the geometry untouched. */
function scaleCapture({ founding = false } = {}) {
  const pack = makeGridPack({ cols: 18, rows: 14 });
  const placements = placeSettlements(pack, 6).map((row, i) => (
    founding && i === 2 ? { ...row, institutions: ['Temple of the Dawn'] } : row));
  return async () => ({ pack, placements });
}

describe('FP WY-1 — the km-scale datum through the canonize body', () => {
  beforeEach(() => { installLocalStorage(); localStorage.removeItem('sf_campaigns'); });

  test('WY-1 A4 CREATE: a first canonize stamps the creation-supplied scale; without a supply the digest carries no key', async () => {
    const store = makeStore();
    seedStore(store);
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: scaleCapture(), kmScale: 4 });
    expect(result.ok).toBe(true);
    expect(store.getState().campaigns[0].worldState.spatialDigest.kmScale).toBe(4);
    // anchored: the same result object carries ok/spatialCanonVersion, so a missing receipt is the no-heal case
    expect(result).not.toHaveProperty('kmScaleReceipt');

    const dark = makeStore();
    seedStore(dark);
    const plain = await dark.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: scaleCapture() });
    expect(plain.ok).toBe(true);
    // anchored: the scaled store above carries the key through the same body, so this absence is the dark arm
    expect(dark.getState().campaigns[0].worldState.spatialDigest).not.toHaveProperty('kmScale');
  });

  test('WY-1 A4 REGENERATE: a receipted re-canonize after a founding edit RE-RECEIVES the scale — kmScale and the week spectrum identical, version bumped', async () => {
    const store = makeStore();
    seedStore(store);
    await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: scaleCapture(), kmScale: 4 });
    const first = store.getState().campaigns[0].worldState;
    const again = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: scaleCapture({ founding: true }) });
    expect(again.ok).toBe(true);
    const second = store.getState().campaigns[0].worldState;
    expect(second.spatialCanonVersion).toBe(first.spatialCanonVersion + 1);
    // anchored: the version bump one line up proves a rebuild ran, so a distinct object is the fresh digest
    expect(second.spatialDigest).not.toBe(first.spatialDigest);
    expect(second.spatialDigest.kmScale).toBe(4);
    expect(realmReach(second.spatialDigest)).toEqual(realmReach(first.spatialDigest));
    expect(realmReach(second.spatialDigest).kmScale).toBe(4);
    // A supply on a re-canonize is ignored: the prior digest's value is the one carried.
    await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: scaleCapture(), kmScale: 9 });
    expect(store.getState().campaigns[0].worldState.spatialDigest.kmScale).toBe(4);
  });

  test('WY-1 A4 NO MINT: a re-canonize of an unscaled world never mints a scale, even when one is supplied', async () => {
    const store = makeStore();
    seedStore(store);
    await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: scaleCapture() });
    const again = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: scaleCapture(), kmScale: 4 });
    expect(again.spatialCanonVersion).toBe(2);
    // anchored: the CREATE arm above stamps a supplied scale through this body, so this absence is the no-mint rule
    expect(store.getState().campaigns[0].worldState.spatialDigest).not.toHaveProperty('kmScale');
  });

  test('WY-1 A4 IMPORT HEAL: a prior digest carrying a refused scale re-canonizes to ABSENT, and the result carries the receipt', async () => {
    const store = makeStore();
    seedStore(store);
    const pack = makeGridPack({ cols: 18, rows: 14 });
    const imported = { ...buildSpatialDigest({ pack, placements: placeSettlements(pack, 6) }), kmScale: 'far' };
    store.setState(state => {
      state.campaigns[0].worldState = { ...state.campaigns[0].worldState, spatialCanonVersion: 1, spatialDigest: imported };
    });
    const result = await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: scaleCapture(), kmScale: 4 });
    expect(result.ok).toBe(true);
    expect(result.kmScaleReceipt).toEqual({ kind: 'kmScale_healed_to_absent', from: 'prior_digest', refusal: 'not_a_number', rawType: 'string' });
    // anchored: the receipt above names the refused value, so the missing key is the heal, not a lost write
    expect(store.getState().campaigns[0].worldState.spatialDigest).not.toHaveProperty('kmScale');
  });

  test('WY-1 A4 PERSIST: the canonize writes the datum into the campaign cache, and the cold hydration reads it back', async () => {
    const store = makeStore();
    seedStore(store);
    campaignService.cache.mockClear();
    await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: scaleCapture(), kmScale: 4 });
    const cachedCalls = campaignService.cache.mock.calls;
    expect(cachedCalls.length).toBeGreaterThan(0);
    const persisted = JSON.parse(JSON.stringify(cachedCalls.at(-1)[0])).find(c => c.id === 'camp-1');
    expect(persisted.worldState.spatialDigest.kmScale).toBe(4);
    const hydrated = hydratePersistedCampaignWorld(persisted);
    expect(hydrated.worldState.spatialDigest.kmScale).toBe(4);
    expect(realmReach(hydrated.worldState.spatialDigest)).toEqual(realmReach(store.getState().campaigns[0].worldState.spatialDigest));
  });

  test('WY-1 A4 UNDO: the pulse ring captures the datum whole, and the ring\'s restore normalizer carries it back', async () => {
    const store = makeStore();
    seedStore(store);
    await store.getState().canonizeCampaignWorldSpatial('camp-1', { captureSpatialPack: scaleCapture(), kmScale: 4 });
    const state = store.getState();
    const campaign = state.campaigns[0];
    const snapshot = capturePulseSnapshot(state, campaign, '2026-01-02T00:00:00.000Z');
    expect(snapshot.worldState.spatialDigest.kmScale).toBe(4);
    // The restore chokepoint (restorePulseSnapshotOnDraft) re-normalizes the snapshot's world
    // through ensureWorldState; this is that same call over the same snapshot.
    const restored = ensureWorldState(snapshot.worldState, campaign);
    expect(restored.spatialDigest.kmScale).toBe(4);
    expect(JSON.stringify(restored.spatialDigest)).toBe(JSON.stringify(campaign.worldState.spatialDigest));
  });
});
