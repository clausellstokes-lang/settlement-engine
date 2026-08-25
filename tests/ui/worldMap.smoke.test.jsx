/**
 * @vitest-environment jsdom
 *
 * tests/ui/worldMap.smoke.test.jsx — partial-refactor lock-in.
 *
 * WorldMap.jsx had three pure sub-components (ModeSwitch, IconButton,
 * legacyPlacementsArray) extracted into src/components/map/* and its
 * debounced map-autosave selector+effect lifted into
 * src/hooks/useMapAutosave.js. This is a behaviour-preserving move, so the
 * regression net is: WorldMap still mounts and renders without throwing,
 * wiring the extracted imports back together correctly. If a relative-path or
 * import broke in the split, the render below throws and this test fails.
 *
 * WorldMap reads ~45 store selectors and several module-scope side effects on
 * mount (bridge lifecycle, saves hydration, analytics). We mock the store with
 * sane defaults and stub the side-effecting libs so the mount path stays quiet
 * and self-contained. The lazy children are wrapped in <Suspense fallback={null}>,
 * so the initial synchronous render only exercises the top toolbar — which is
 * exactly where ModeSwitch + IconButton live.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

// Bridge lifecycle runs on mount (createBridgeSingleton → bridge.start()/.on()).
// Stub it so no postMessage/iframe wiring is pulled into the test.
vi.mock('../../src/lib/mapBridge.js', () => ({
  createBridgeSingleton: () => ({
    on: () => () => {},
    call: () => Promise.resolve(),
    destroy: () => {},
    isReady: false,
  }),
}));

// Analytics is fire-and-forget; keep the mount path quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// A mount effect calls savesService.list(); return zero saves.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { list: vi.fn(() => Promise.resolve([])) },
}));

// MAP_OPENED analytics computes road edges off the live store; stub to [].
vi.mock('../../src/lib/roadNetwork.js', () => ({
  computeRoadEdges: () => [],
}));

// Store mock. A single mutable object drives every selector. mapState carries
// the empty defaults WorldMap expects (placements/labels/markers/forests/layers).
const storeState = {
  // map mode + status
  mapMode: 'view',
  setMapMode: vi.fn(),
  mapReady: false,
  mapLoading: false,
  mapError: null,
  setMapReady: vi.fn(),
  setMapLoading: vi.fn(),
  setMapError: vi.fn(),
  setSelectedBurgId: vi.fn(),
  setDraggingOver: vi.fn(),
  isDraggingOver: false,
  // placement actions
  addPlacement: vi.fn(),
  removePlacementLocal: vi.fn(),
  clearAllPlacementsLocal: vi.fn(),
  replaceAllPlacements: vi.fn(),
  replaceMapState: vi.fn(),
  resetMapState: vi.fn(),
  setMapSnapshot: vi.fn(),
  bumpGeometryVersion: vi.fn(),
  setMapBackdrop: vi.fn(),
  clearMapBackdrop: vi.fn(),
  // map state (empty defaults)
  mapState: {
    placements: {},
    labels: [],
    markers: [],
    forests: [],
    customBackdrop: null,
    layers: {
      nativeStateBorders: false,
      nativeCultureRegions: false,
      nativeBiomes: false,
    },
    seed: null,
    viewport: { scale: 1 },
  },
  // saves / auth
  savedSettlements: [],
  savedSettlementsLoaded: true,
  setSavedSettlements: vi.fn(),
  auth: { tier: 'anon', user: null },
  isElevated: () => false,
  // campaigns
  campaigns: [],
  activeCampaignId: null,
  setActiveCampaign: vi.fn(),
  saveCampaignMap: vi.fn(),
  clearCampaignMap: vi.fn(),
  getCampaignMapState: vi.fn(() => null),
  advanceCampaignWorld: vi.fn(),
  undoLastPulse: vi.fn(),
  pulseUndoStack: [],
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

describe('WorldMap — partial-refactor smoke', () => {
  test('mounts without throwing and renders the toolbar', () => {
    let WorldMap;
    let didRender = false;
    let container;
    return import('../../src/components/WorldMap.jsx').then((mod) => {
      WorldMap = mod.default;
      // WorldMap should import as a function component.
      expect(typeof WorldMap).toBe('function');
      ({ container } = render(<WorldMap onNavigate={() => {}} />));
      didRender = true;
      // Mount succeeded — the DOM exists and the component produced output.
      expect(document.body).toBeTruthy();
      expect(container.firstChild).not.toBeNull();
      // The synchronous render path includes ModeSwitch's mode buttons.
      expect(container.querySelectorAll('button').length).toBeGreaterThan(0);
      expect(didRender).toBe(true);
    });
  });
});
