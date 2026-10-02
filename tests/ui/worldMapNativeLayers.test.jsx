/**
 * @vitest-environment jsdom
 *
 * tests/ui/worldMapNativeLayers.test.jsx — A SAVED NATIVE FMG LAYER IS PUSHED INTO
 * THE FRAME AGAIN EVERY TIME THE FRAME'S MAP IS REPLACED.
 *
 * Observed 2026-10-02 (the landing realm re-cut): an Instant World campaign saved
 * with `layers.nativeBiomes: true` opened with the Layers panel's "Biomes" ON and no
 * biome painted. WorldMap pushed the three native flags (state borders, culture
 * regions, biomes) into the FMG iframe only on [bridgeReady, flag]; the materialize
 * hook then regenerated the world, FMG's undraw() emptied #biomes, and nothing
 * pushed again (CONFIRMED in Chromium by e2e/realm-native-layers.spec.js). A snapshot
 * load replaces the frame's whole SVG, so every native layer's display comes from
 * the snapshot instead of the campaign's saved flags.
 *
 * The cure re-pushes every native flag, read LIVE from the store, on the bridge's
 * own "this is a new map" push events (`mapReset`, `snapshotLoaded`, a re-announced
 * `ready`). This file drives WorldMap against a fake bridge that answers like the
 * frame does (reply first, then the push event one macrotask later) and pins every
 * lifecycle path:
 *   1. first open: the three flags go out once each, with the saved values;
 *   2. an Instant World's materialization (pendingMapGen → resetMap) re-pushes them;
 *   3. a saved snapshot's load re-pushes them;
 *   4. Regenerate re-pushes the POST-reset flags, never the stale pre-reset ones;
 *   5. a later toggle pushes exactly the toggled layer;
 *   6. ordinary push traffic (viewport, burgList) re-pushes nothing.
 * Arms 2 and 3 are red on the pre-cure WorldMap; 1, 4, 5 and 6 pin what must not move.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { act, render, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';

afterEach(() => { cleanup(); });

vi.mock('../../src/hooks/useIsMobile.js', () => ({
  __esModule: true,
  default: () => false,
  getIsMobile: () => false,
}));

/**
 * The fake bridge. One ordered `log` records every command WorldMap sends, so an arm
 * can ask "what was pushed AFTER the map was replaced". resetMap / loadSnapshot
 * resolve first and post their push event one macrotask later, which is the frame's
 * own order (public/map/sf-bridge.js replies, then postToParent's the event).
 */
const harness = { bridge: null };
function makeFakeBridge() {
  const listeners = new Map();
  const log = [];
  const emit = (event, data = {}) => {
    for (const cb of [...(listeners.get(event) || [])]) cb(data);
  };
  const command = (name, pushEvent) => vi.fn((arg) => {
    log.push({ name, arg });
    return Promise.resolve({}).then((reply) => {
      if (pushEvent) setTimeout(() => emit(pushEvent, {}), 0);
      return reply;
    });
  });
  const bridge = {
    isReady: true,
    log,
    emit,
    on(event, cb) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(cb);
      return () => listeners.get(event)?.delete(cb);
    },
    call: vi.fn((type, payload) => {
      log.push({ name: type, arg: payload });
      return Promise.resolve({});
    }),
    destroy: () => listeners.clear(),
    setTemplate: command('setTemplate'),
    resetMap: command('resetMap', 'mapReset'),
    loadSnapshot: command('loadSnapshot', 'snapshotLoaded'),
    clearAllPlacements: command('clearAllPlacements'),
    restorePlacements: command('restorePlacements'),
    setViewport: command('setViewport'),
    fitMap: command('fitMap'),
  };
  harness.bridge = bridge;
  return bridge;
}

vi.mock('../../src/lib/mapBridge.js', () => ({
  createBridgeSingleton: () => makeFakeBridge(),
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: { list: vi.fn(() => Promise.resolve([])) },
}));

vi.mock('../../src/lib/roadNetwork.js', () => ({
  computeRoadEdges: () => [],
}));

vi.mock('../../src/components/map/RealmInspector.jsx', () => ({
  default: () => null,
}));

const CAMPAIGN_ID = 'camp-layers';
/** The store's defaults for the three native flags (src/store/mapSlice.js DEFAULT_LAYERS). */
const DEFAULT_NATIVE = Object.freeze({ nativeStateBorders: true, nativeCultureRegions: false, nativeBiomes: false });
/** setFmgLayer's layer key for each flag (public/map/sf-bridge.js LAYER_MAP). */
const LAYER_OF = Object.freeze({ nativeStateBorders: 'stateBorders', nativeCultureRegions: 'cultures', nativeBiomes: 'biomes' });

function emptyMapState(layers) {
  return {
    fmgSnapshot: null, seed: null, customBackdrop: null,
    placements: {}, labels: [], markers: [], forests: [],
    layers: { ...DEFAULT_NATIVE, ...layers },
    viewport: { cx: 0, cy: 0, scale: 1, width: 0, height: 0 },
  };
}

const storeState = {};

/**
 * @param {object} campaignMapState the campaign's persisted mapState
 * The map slice already holds the campaign's map (replaceMapState is synchronous and
 * lands before any bridge command the open sends), and the two map-wide writers do
 * what the real slice does to `mapState.layers`.
 */
function resetStore(campaignMapState) {
  Object.keys(storeState).forEach((key) => { delete storeState[key]; });
  Object.assign(storeState, {
    mapMode: 'view', setMapMode: vi.fn(),
    mapReady: false, mapLoading: false, mapError: null,
    setMapReady: vi.fn(), setMapLoading: vi.fn(), setMapError: vi.fn(),
    setSelectedBurgId: vi.fn(), setDraggingOver: vi.fn(), isDraggingOver: false,
    addPlacement: vi.fn(), removePlacementLocal: vi.fn(), clearAllPlacementsLocal: vi.fn(),
    replaceMapState: vi.fn((next) => { storeState.mapState = emptyMapState(next?.layers); }),
    resetMapState: vi.fn(() => { storeState.mapState = emptyMapState({}); }),
    setMapSnapshot: vi.fn(), bumpGeometryVersion: vi.fn(),
    setMapBackdrop: vi.fn(), clearMapBackdrop: vi.fn(), flagGeographyDiverged: vi.fn(),
    toggleLayer: vi.fn(),
    mapState: emptyMapState(campaignMapState.layers),
    savedSettlements: [], savedSettlementsLoaded: true, savedSettlementsOwnerId: 'user-1',
    savedSettlementsHydrationGeneration: 0, setSavedSettlements: vi.fn(),
    auth: { tier: 'premium', user: { id: 'user-1' }, loading: false },
    isElevated: () => false,
    campaigns: [{ id: CAMPAIGN_ID, name: 'Painted Reach', settlementIds: [], mapState: campaignMapState, worldState: { tick: 0, proposals: [] } }],
    campaignsLoaded: true, lastActiveCampaignId: null,
    activeCampaignId: CAMPAIGN_ID, setActiveCampaign: vi.fn(),
    saveCampaignMap: vi.fn(), clearCampaignMap: vi.fn(),
    getCampaignMapState: vi.fn(() => campaignMapState),
    advanceCampaignWorld: vi.fn(), resolveIntervalMajors: vi.fn(), undoLastPulse: vi.fn(),
    canonizeCampaignWorld: vi.fn(), canonizeCampaignWorldSpatial: vi.fn(),
    updateCampaignSimulationRules: vi.fn(), setPurchaseModalOpen: vi.fn(), setActivePricingMoment: vi.fn(),
    advanceInFlight: [], pulseUndoStack: [], proposalUndoStack: [], geographyMayHaveDiverged: false,
  });
}

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

async function mountAndConnect() {
  const WorldMap = (await import('../../src/components/WorldMap.jsx')).default;
  const view = render(<WorldMap onNavigate={() => {}} />);
  const bridge = harness.bridge;
  expect(bridge, 'WorldMap built no bridge').toBeTruthy();
  // The frame announces itself: useMapBridge flips bridgeReady.
  await act(async () => { bridge.emit('ready', { seed: 'boot', templates: [] }); });
  return { bridge, ...view };
}

/** The setFmgLayer commands in `log` from index `from` on, as { layer, visible }. */
function layerPushes(log, from = 0) {
  return log.slice(from)
    .filter((entry) => entry.name === 'settlementEngine:setFmgLayer')
    .map((entry) => ({ layer: entry.arg.layer, visible: entry.arg.visible }));
}

/** What the frame must end up showing for each layer, given the store's flags. */
function expectedPushes(layers) {
  return Object.entries(LAYER_OF).map(([flag, layer]) => ({ layer, visible: !!layers[flag] }));
}

/** Let the push event (one macrotask after the reply) land and its RPCs go out. */
async function settle() {
  await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 20); }); });
}

describe('a saved native FMG layer survives every replacement of the frame\'s map', () => {
  beforeEach(() => { harness.bridge = null; });

  test('1. first open: each native flag is pushed once, with the saved value', async () => {
    const saved = { schemaVersion: 2, fmgSnapshot: null, seed: null, layers: { nativeBiomes: true, nativeCultureRegions: true, nativeStateBorders: false } };
    resetStore(saved);
    const { bridge } = await mountAndConnect();
    await settle();
    const firstOpen = layerPushes(bridge.log);
    expect(firstOpen).toHaveLength(3);
    expect(firstOpen).toEqual(expect.arrayContaining(expectedPushes(saved.layers)));
  });

  test('2. an Instant World materialized after the bridge is up gets its saved biomes back (the observed bug)', async () => {
    const saved = {
      schemaVersion: 2, pendingMapGen: true, fmgSnapshot: null,
      seed: 'landing-lf-033-v26', mapKind: 'volcano',
      layers: { nativeBiomes: true },
    };
    resetStore(saved);
    const { bridge } = await mountAndConnect();
    await waitFor(() => expect(bridge.resetMap).toHaveBeenCalledWith('landing-lf-033-v26'));
    const regenAt = bridge.log.findIndex((entry) => entry.name === 'resetMap');
    await settle();
    const after = layerPushes(bridge.log, regenAt + 1);
    expect(after, 'nothing re-pushed the saved layers into the regenerated map').toEqual(
      expect.arrayContaining(expectedPushes(storeState.mapState.layers)),
    );
    expect(after).toContainEqual({ layer: 'biomes', visible: true });
  });

  test('3. a saved snapshot\'s load is followed by the campaign\'s own flags, whatever the snapshot\'s SVG carried', async () => {
    const saved = {
      schemaVersion: 2, fmgSnapshot: '<the FMG .map text>', seed: 'saved-seed',
      layers: { nativeBiomes: true, nativeCultureRegions: true, nativeStateBorders: false },
    };
    resetStore(saved);
    const { bridge } = await mountAndConnect();
    await waitFor(() => expect(bridge.loadSnapshot).toHaveBeenCalledWith('<the FMG .map text>'));
    const loadAt = bridge.log.findIndex((entry) => entry.name === 'loadSnapshot');
    await settle();
    const after = layerPushes(bridge.log, loadAt + 1);
    expect(after, 'nothing re-pushed the saved layers into the loaded snapshot').toEqual(
      expect.arrayContaining(expectedPushes(saved.layers)),
    );
  });

  test('4. Regenerate re-pushes the POST-reset flags, never the stale ones the reset just cleared', async () => {
    const saved = { schemaVersion: 2, fmgSnapshot: null, seed: null, layers: { nativeBiomes: true, nativeCultureRegions: true, nativeStateBorders: false } };
    resetStore(saved);
    const { bridge } = await mountAndConnect();
    await settle();

    fireEvent.click(screen.getByRole('button', { name: /^More/ }));
    fireEvent.click(await screen.findByRole('button', { name: 'Regenerate' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Regenerate' }));
    await waitFor(() => expect(bridge.resetMap).toHaveBeenCalled());
    const regenAt = bridge.log.findIndex((entry) => entry.name === 'resetMap');
    await settle();

    expect(storeState.resetMapState).toHaveBeenCalled();
    const after = layerPushes(bridge.log, regenAt + 1);
    // The LAST push per layer is what the frame shows; it must be the reset value.
    const last = Object.fromEntries(after.map(({ layer, visible }) => [layer, visible]));
    expect(last).toEqual(Object.fromEntries(expectedPushes(DEFAULT_NATIVE).map(({ layer, visible }) => [layer, visible])));
  });

  test('5. a later toggle pushes exactly the toggled layer', async () => {
    const saved = { schemaVersion: 2, fmgSnapshot: null, seed: null, layers: { nativeBiomes: true } };
    resetStore(saved);
    const { bridge, rerender } = await mountAndConnect();
    await settle();
    const before = bridge.log.length;

    storeState.mapState = { ...storeState.mapState, layers: { ...storeState.mapState.layers, nativeBiomes: false } };
    const WorldMap = (await import('../../src/components/WorldMap.jsx')).default;
    rerender(<WorldMap onNavigate={() => {}} />);
    await settle();

    expect(layerPushes(bridge.log, before)).toEqual([{ layer: 'biomes', visible: false }]);
  });

  test('6. ordinary push traffic (viewport pans, burg lists) re-pushes nothing', async () => {
    const saved = { schemaVersion: 2, fmgSnapshot: null, seed: null, layers: { nativeBiomes: true } };
    resetStore(saved);
    const { bridge } = await mountAndConnect();
    await settle();
    const before = bridge.log.length;

    await act(async () => {
      bridge.emit('viewport', { cx: 1, cy: 2, scale: 3 });
      bridge.emit('burgList', { burgs: [] });
      bridge.emit('placementsRestored', { restored: 0 });
    });
    await settle();

    expect(layerPushes(bridge.log, before)).toEqual([]);
  });
});
