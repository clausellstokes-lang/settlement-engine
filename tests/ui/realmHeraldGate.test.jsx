/**
 * @vitest-environment jsdom
 *
 * tests/ui/realmHeraldGate.test.jsx — THE HERALD WAITS FOR THE FIRST ADVANCE.
 *
 * Owner order (2026-09-17): "The herald should only appear after the first advanced
 * time on the map." The chair's ruling: the desktop Herald panel and its toolbar
 * toggle stay hidden on a campaign whose realm clock has never moved, appear once
 * the first advance has happened, and stay available from then on, including after
 * a reload. What the Herald carried that a GM needs before that first advance stays
 * reachable elsewhere; this file pins the two relocations it owns:
 *   - the living-world controls (with Map geography) ride the Advance dialog while
 *     the realm has never advanced;
 *   - anon and free viewers, whose locked Herald teaser used to open on entry, still
 *     get the `map_realm_teaser` pricing moment on entry, once auth has settled.
 *
 * WorldMap is mounted on the desktop branch against a mutable store mock (the
 * worldMap.smoke idiom). RealmInspector is stubbed to a test id so the assertion is
 * about whether WorldMap mounts the Herald at all, not about the Herald's contents.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { act, render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
});

vi.mock('../../src/hooks/useIsMobile.js', () => ({
  __esModule: true,
  default: () => false,
  getIsMobile: () => false,
}));

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

const moments = vi.hoisted(() => ({ triggerPricingMoment: vi.fn() }));
vi.mock('../../src/lib/pricingMoments.js', () => moments);

vi.mock('../../src/components/map/RealmInspector.jsx', () => ({
  default: ({ section }) => <aside data-testid="realm-inspector" data-section={section}>The Herald</aside>,
}));

import { writeHeraldCommandSession } from '../../src/components/map/heraldCommandSession.js';

const CAMPAIGN_ID = 'camp-herald';

function campaignAt(tick) {
  return {
    id: CAMPAIGN_ID,
    name: 'Tidewater Reach',
    settlementIds: [],
    mapState: null,
    worldState: { tick, calendar: { elapsedWeeks: tick, month: 1, year: 1, season: 'spring' }, proposals: [] },
  };
}

const storeState = {};

function resetStore({ tier = 'premium', tick = 0, loading = false } = {}) {
  const premium = tier === 'premium';
  Object.keys(storeState).forEach((key) => { delete storeState[key]; });
  Object.assign(storeState, {
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
    replaceMapState: vi.fn(),
    resetMapState: vi.fn(),
    setMapSnapshot: vi.fn(),
    bumpGeometryVersion: vi.fn(),
    setMapBackdrop: vi.fn(),
    clearMapBackdrop: vi.fn(),
    flagGeographyDiverged: vi.fn(),
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
    savedSettlementsOwnerId: premium ? 'user-1' : null,
    savedSettlementsHydrationGeneration: 0,
    setSavedSettlements: vi.fn(),
    auth: { tier, user: premium ? { id: 'user-1' } : null, loading },
    isElevated: () => false,
    campaigns: premium ? [campaignAt(tick)] : [],
    campaignsLoaded: true,
    lastActiveCampaignId: null,
    activeCampaignId: premium ? CAMPAIGN_ID : null,
    setActiveCampaign: vi.fn(),
    saveCampaignMap: vi.fn(),
    clearCampaignMap: vi.fn(),
    getCampaignMapState: vi.fn(() => null),
    advanceCampaignWorld: vi.fn(),
    resolveIntervalMajors: vi.fn(),
    undoLastPulse: vi.fn(),
    canonizeCampaignWorld: vi.fn(),
    canonizeCampaignWorldSpatial: vi.fn(),
    updateCampaignSimulationRules: vi.fn(),
    setPurchaseModalOpen: vi.fn(),
    setActivePricingMoment: vi.fn(),
    advanceInFlight: [],
    pulseUndoStack: [],
    proposalUndoStack: [],
    geographyMayHaveDiverged: false,
  });
}

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

async function loadWorldMap() {
  return (await import('../../src/components/WorldMap.jsx')).default;
}

const TOGGLE = /^Toggle the Realm Inspector/;

/**
 * ⛔ EVERY WAIT BELOW CROSSES A `React.lazy` BOUNDARY, SO EVERY WAIT CARRIES A BUDGET.
 * `RealmInspector` (WorldMap.jsx) and `LivingWorldGates` (WorldMapOverlays.jsx) are both
 * `lazy(() => import(...))`, and a Suspense boundary resolves on the module graph's own
 * clock, not the render's. Testing Library's DEFAULT find timeout is 1,000 ms, which is
 * generous alone and not generous at all on a box running the whole suite in parallel:
 * this file reddened intermittently at two DIFFERENT arms across five 12-file batches, and
 * the whole-suite run reddened it at the `living-world-gates` arm, while every solo run of
 * the file passed. That is load, not code. The sibling Herald suite already answers exactly
 * this shape with an explicit budget (`heraldMobileCompanion.test.jsx`, `{ timeout: 3000 }`).
 * A PER-WAIT BUDGET, NEVER A BANK: the number below is the ceiling on ONE lazy chunk
 * arriving, not a per-file grace that would hide a genuinely absent element.
 */
const LAZY_CHUNK = Object.freeze({ timeout: 5000 });

describe('THE HERALD WAITS FOR THE FIRST ADVANCE (owner order 2026-09-17)', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    moments.triggerPricingMoment.mockClear();
  });

  test('a never-advanced realm shows no Herald and no toggle, even with a remembered open Herald; Advance stays', async () => {
    resetStore({ tick: 0 });
    writeHeraldCommandSession(CAMPAIGN_ID, { open: true, section: 'dashboard' });
    const WorldMap = await loadWorldMap();
    render(<WorldMap onNavigate={() => {}} />);

    expect(screen.getByRole('button', { name: /Advance Realm/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: TOGGLE })).toBeNull();
    await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 30); }); });
    expect(screen.queryByTestId('realm-inspector')).toBeNull();
  });

  test('an advanced realm offers the toggle, and the toggle opens the Herald', async () => {
    resetStore({ tick: 2 });
    const WorldMap = await loadWorldMap();
    render(<WorldMap onNavigate={() => {}} />);

    expect(screen.queryByTestId('realm-inspector')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: TOGGLE }));
    expect(await screen.findByTestId('realm-inspector', {}, LAZY_CHUNK)).toBeTruthy();
  });

  test('the Herald appears as soon as the first advance commits (the advance flow already asked for it)', async () => {
    resetStore({ tick: 0 });
    writeHeraldCommandSession(CAMPAIGN_ID, { open: true, section: 'dashboard' });
    const WorldMap = await loadWorldMap();
    const view = render(<WorldMap onNavigate={() => {}} />);
    await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 30); }); });
    expect(screen.queryByTestId('realm-inspector')).toBeNull();

    storeState.campaigns = [campaignAt(1)];
    view.rerender(<WorldMap onNavigate={() => {}} />);

    expect(await screen.findByTestId('realm-inspector', {}, LAZY_CHUNK)).toBeTruthy();
    expect(screen.getByRole('button', { name: TOGGLE })).toBeTruthy();
  });

  test('a reload of a realm that has advanced before brings the remembered Herald back', async () => {
    resetStore({ tick: 3 });
    writeHeraldCommandSession(CAMPAIGN_ID, { open: true, section: 'trade' });
    const WorldMap = await loadWorldMap();
    render(<WorldMap onNavigate={() => {}} />);

    const herald = await screen.findByTestId('realm-inspector', {}, LAZY_CHUNK);
    expect(herald.getAttribute('data-section')).toBe('trade');
  });

  test('before the first advance the Advance dialog carries the living-world controls; after it, it does not', async () => {
    resetStore({ tick: 0 });
    const WorldMap = await loadWorldMap();
    const first = render(<WorldMap onNavigate={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Advance Realm/ }));
    const gates = await screen.findByTestId('living-world-gates', {}, LAZY_CHUNK);
    expect(screen.getByTestId('advance-living-world').contains(gates)).toBe(true);
    expect(screen.getByTestId('spatial-canon-gate')).toBeTruthy();
    first.unmount();

    resetStore({ tick: 4 });
    render(<WorldMap onNavigate={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Advance Realm/ }));
    expect(await screen.findByRole('dialog', {}, LAZY_CHUNK)).toBeTruthy();
    await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 30); }); });
    expect(screen.queryByTestId('advance-living-world')).toBeNull();
    expect(screen.queryByTestId('living-world-gates')).toBeNull();
  });

  test('anon: no Herald on entry, and the Cartographer teaser moment still fires once auth has settled', async () => {
    resetStore({ tier: 'anon', loading: true });
    const WorldMap = await loadWorldMap();
    const view = render(<WorldMap onNavigate={() => {}} />);
    await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 30); }); });
    expect(moments.triggerPricingMoment).not.toHaveBeenCalled();

    storeState.auth = { tier: 'anon', user: null, loading: false };
    view.rerender(<WorldMap onNavigate={() => {}} />);

    await waitFor(() => expect(moments.triggerPricingMoment).toHaveBeenCalledTimes(1));
    expect(moments.triggerPricingMoment).toHaveBeenCalledWith('map_realm_teaser', storeState.setActivePricingMoment, { tier: 'anon' });
    expect(screen.queryByTestId('realm-inspector')).toBeNull();
    expect(screen.queryByRole('button', { name: TOGGLE })).toBeNull();

    view.rerender(<WorldMap onNavigate={() => {}} />);
    await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 30); }); });
    expect(moments.triggerPricingMoment).toHaveBeenCalledTimes(1);
  });

  test('premium: the entry moment never fires', async () => {
    resetStore({ tick: 0 });
    const WorldMap = await loadWorldMap();
    render(<WorldMap onNavigate={() => {}} />);
    await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 30); }); });
    expect(moments.triggerPricingMoment).not.toHaveBeenCalled();
  });
});
