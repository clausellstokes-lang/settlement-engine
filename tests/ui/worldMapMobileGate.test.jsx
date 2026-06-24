/**
 * @vitest-environment jsdom
 *
 * tests/ui/worldMapMobileGate.test.jsx — Realm defer-to-desktop (mobile pass).
 *
 * The Realm is a desktop map-editing canvas with no touch path, so on phones
 * (useIsMobile, the 640 breakpoint) WorldMap drops the whole editing workspace
 * and renders RealmMobileGate instead: an honest "best on desktop" wall plus the
 * one read-friendly component, the read-only Realm Dashboard.
 *
 * This locks in three properties:
 *   1. On mobile, the gate wall renders (the desktop toolbar/map does NOT).
 *   2. On mobile, the read path renders — anon sees the locked teaser dashboard.
 *   3. On desktop, the gate does NOT render and the desktop toolbar DOES — i.e.
 *      the mobile branch is fully guarded and leaves the desktop tree untouched.
 *
 * The store + side-effecting libs are stubbed exactly as in worldMap.smoke; the
 * only added control is useIsMobile, mocked per-test so we can flip the branch
 * without a jsdom matchMedia dance.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, screen, waitFor } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Reactive mobile flag — driven per test via mockIsMobile.
let mobileFlag = false;
vi.mock('../../src/hooks/useIsMobile.js', () => ({
  __esModule: true,
  default: () => mobileFlag,
  getIsMobile: () => mobileFlag,
}));

// Bridge lifecycle runs on mount; stub it so no postMessage/iframe wiring loads.
vi.mock('../../src/lib/mapBridge.js', () => ({
  createBridgeSingleton: () => ({
    on: () => () => {},
    call: () => Promise.resolve(),
    destroy: () => {},
    isReady: false,
  }),
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

// The locked dashboard fires a pricing moment via a dynamic import; stub it so
// the mount path stays quiet and self-contained.
vi.mock('../../src/lib/pricingMoments.js', () => ({
  triggerPricingMoment: vi.fn(),
}));

const storeState = {
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
  mapState: {
    placements: {},
    labels: [],
    markers: [],
    forests: [],
    customBackdrop: null,
    layers: { nativeStateBorders: false, nativeCultureRegions: false, nativeBiomes: false },
    seed: null,
    viewport: { scale: 1 },
  },
  savedSettlements: [],
  savedSettlementsLoaded: true,
  setSavedSettlements: vi.fn(),
  auth: { tier: 'anon', user: null },
  isElevated: () => false,
  campaigns: [],
  activeCampaignId: null,
  setActiveCampaign: vi.fn(),
  saveCampaignMap: vi.fn(),
  clearCampaignMap: vi.fn(),
  getCampaignMapState: vi.fn(() => null),
  advanceCampaignWorld: vi.fn(),
  undoLastPulse: vi.fn(),
  pulseUndoStack: [],
  setActivePricingMoment: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

async function renderWorldMap() {
  const mod = await import('../../src/components/WorldMap.jsx');
  return render(<mod.default onNavigate={() => {}} />);
}

describe('WorldMap — Realm defer-to-desktop (mobile)', () => {
  beforeEach(() => { mobileFlag = false; });

  test('mobile: renders the defer-to-desktop gate and the read-only dashboard, not the desktop map toolbar', async () => {
    mobileFlag = true;
    const { container } = await renderWorldMap();

    // The gate wall is the mobile root.
    const gate = await screen.findByTestId('realm-mobile-gate');
    expect(gate).toBeTruthy();
    expect(screen.getByText(/best explored on desktop/i)).toBeTruthy();

    // The read path renders — anon gets the locked teaser dashboard.
    await waitFor(() => expect(screen.getByTestId('realm-dashboard-locked')).toBeTruthy());

    // The desktop editing workspace is gone: no campaign <select>, no map iframe.
    expect(container.querySelector('iframe')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
  });

  test('desktop: the mobile gate does NOT render and the desktop workspace mounts', async () => {
    mobileFlag = false;
    const { container } = await renderWorldMap();

    expect(screen.queryByTestId('realm-mobile-gate')).toBeNull();
    // Desktop renders the toolbar (synchronous), so buttons exist.
    expect(container.querySelectorAll('button').length).toBeGreaterThan(0);
  });
});
