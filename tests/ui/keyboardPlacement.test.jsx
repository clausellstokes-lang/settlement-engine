/**
 * @vitest-environment jsdom
 *
 * tests/ui/keyboardPlacement.test.jsx — Enforcer E-I pin (bar 9, ACCESSIBILITY).
 *
 * THE pin: a keyboard-driven placement ROUND-TRIPS TO THE STORE through the
 * pointer path's own gates — no second commit path.
 *
 *   • Image mode: arrows steer the fractional target; Enter inverse-projects
 *     (the drop handler's math) and commits through the REAL addPlacement gate
 *     (a live mapSlice store, not a mock) — the placement lands with the exact
 *     projected coordinates and success is announced politely.
 *   • FMG mode: Enter calls bridge.placeSettlement with numeric screen coords
 *     (the seam WorldMap.handleDrop uses); the simulated fmg:settlementPlaced
 *     echo commits through the same real gate; the control confirms the
 *     round-trip via the reply's burgId before announcing.
 *   • Gate refusal (no campaign) speaks the shared PLACEMENT_REJECT_COPY and
 *     mutates nothing; Escape cancels and announces.
 *   • Stage wiring: a palette card's Enter arms the session inside the map
 *     container, focus lands on it, and Escape returns focus to the card.
 */

import React, { createRef } from 'react';
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor, act } from '@testing-library/react';

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
vi.mock('../../src/lib/roadNetwork.js', () => ({ computeRoadEdges: () => [] }));
vi.mock('../../src/lib/flags.js', () => ({ flag: () => false }));

// A LIVE store built from the real mapSlice — addPlacement here is the
// authoritative gate itself (campaign / canon / no-duplicate), so a green
// round-trip below is executed proof, not mock theater. Non-reactive selector
// reads are fine: the control reads addPlacement once and polls getState.
vi.mock('../../src/store/index.js', async () => {
  const { create } = await import('zustand');
  const { immer } = await import('zustand/middleware/immer');
  const { createMapSlice } = await import('../../src/store/mapSlice.js');
  const store = create(immer((...a) => ({ ...createMapSlice(...a) })));
  const useStore = (sel) => sel(store.getState());
  useStore.getState = store.getState;
  useStore.setState = store.setState;
  useStore.subscribe = store.subscribe;
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import KeyboardPlacementControl from '../../src/components/map/KeyboardPlacementControl.jsx';
import { WorldMapStage } from '../../src/components/map/WorldMapStage.jsx';

afterEach(cleanup);

const SAVE = { id: 'ash', name: 'Ashford', tier: 'Town', settlement: { population: 1200, tier: 'Town' } };

function seedStore({ campaign = true } = {}) {
  useStore.setState((s) => {
    s.activeCampaignId = campaign ? 'camp-1' : null;
    s.campaigns = campaign ? [{ id: 'camp-1', name: 'The March' }] : [];
    s.savedSettlements = [{ ...SAVE, campaignState: { phase: 'canon' } }];
    s.mapState.placements = {};
    s.mapState.customBackdrop = null;
  });
}

const containerRef = () => ({
  current: { getBoundingClientRect: () => ({ width: 1000, height: 500, left: 0, top: 0 }) },
});

function renderControl(over = {}) {
  const props = {
    save: SAVE,
    imageMode: true,
    bridgeRef: { current: null },
    iframeRef: { current: null },
    containerRef: containerRef(),
    transformRef: { current: { tx: 0, ty: 0, scale: 1 } },
    announce: vi.fn(),
    onDone: vi.fn(),
    ...over,
  };
  const utils = render(<KeyboardPlacementControl {...props} />);
  return { ...utils, props, session: screen.getByTestId('keyboard-placement-session') };
}

describe('E-I — keyboard placement round-trips to the store (bar 9)', () => {
  beforeEach(() => seedStore());

  test('image mode: arrows steer, Enter commits through the REAL addPlacement gate', async () => {
    const { props, session } = renderControl();
    expect(document.activeElement).toBe(session);
    expect(props.announce).toHaveBeenCalledWith(expect.stringMatching(/Placing Ashford/));
    fireEvent.keyDown(session, { key: 'ArrowRight' });                  // fx 0.52
    expect(props.announce).toHaveBeenCalledWith('Target at 52% across, 50% down.');
    fireEvent.keyDown(session, { key: 'ArrowDown', shiftKey: true });   // fy 0.60
    fireEvent.keyDown(session, { key: 'Enter' });
    await waitFor(() => expect(props.announce).toHaveBeenCalledWith('Ashford placed on the map.'));
    const placed = Object.values(useStore.getState().mapState.placements);
    expect(placed).toHaveLength(1);
    expect(placed[0].settlementId).toBe('ash');
    expect(placed[0].x).toBeCloseTo(520, 6);   // (0.52 × 1000 − tx) / scale
    expect(placed[0].y).toBeCloseTo(300, 6);   // (0.60 × 500 − ty) / scale
    expect(props.onDone).toHaveBeenCalledTimes(1);
  });

  test('FMG mode: Enter routes through bridge.placeSettlement and the echoed gate commit', async () => {
    const placeSettlement = vi.fn(async ({ settlementId, x, y, cellId }) => {
      // Simulate the iframe: reply carries the burgId; the fmg:settlementPlaced
      // echo commits through the store's authoritative gate (as useMapBridge does).
      const burgId = 'sf_echo_1';
      useStore.getState().addPlacement({ burgId, settlementId, x, y, cellId: cellId ?? 7, via: 'drop' });
      return { burgId };
    });
    const { props, session } = renderControl({
      imageMode: false,
      bridgeRef: { current: { placeSettlement } },
      iframeRef: containerRef(),
    });
    fireEvent.keyDown(session, { key: 'Enter' });
    await waitFor(() => expect(props.announce).toHaveBeenCalledWith('Ashford placed on the map.'));
    expect(placeSettlement).toHaveBeenCalledTimes(1);
    const args = placeSettlement.mock.calls[0][0];
    expect(args.settlementId).toBe('ash');
    expect(args.x).toBe(500);   // 0.5 × 1000 screen px — handleDrop's coordinate space
    expect(args.y).toBe(250);   // 0.5 × 500
    expect(useStore.getState().mapState.placements.sf_echo_1).toMatchObject({ settlementId: 'ash' });
    expect(props.onDone).toHaveBeenCalledTimes(1);
  });

  test('gate refusal speaks the shared reject copy and mutates nothing', async () => {
    seedStore({ campaign: false });
    const { props, session } = renderControl();
    fireEvent.keyDown(session, { key: 'Enter' });
    await waitFor(() => expect(props.announce).toHaveBeenCalledWith(
      'Select a campaign before placing settlements on the map.',
    ));
    expect(Object.keys(useStore.getState().mapState.placements)).toHaveLength(0);
    expect(props.onDone).not.toHaveBeenCalled(); // the session stays for correction
  });

  test('Escape cancels: announced, nothing placed, session ends', () => {
    const { props, session } = renderControl();
    fireEvent.keyDown(session, { key: 'ArrowLeft' });
    fireEvent.keyDown(session, { key: 'Escape' });
    expect(props.announce).toHaveBeenCalledWith('Placement cancelled.');
    expect(props.onDone).toHaveBeenCalledTimes(1);
    expect(Object.keys(useStore.getState().mapState.placements)).toHaveLength(0);
  });
});

describe('E-I — stage wiring: the palette card arms the session over the map', () => {
  beforeEach(() => seedStore());

  const stageProps = (over = {}) => ({
    showingWizardNews: false,
    showingWorldPulse: false,
    showingPantheon: false,
    activeCampaign: { id: 'camp-1', name: 'The March' },
    activeSaves: [SAVE],
    mapContainerRef: createRef(),
    handleDragOver: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDrop: vi.fn(),
    iframeRef: createRef(),
    bridgeReady: true,
    // MapOverlay mounts alongside the session when bridgeReady — quiet stub.
    bridgeRef: {
      current: {
        placeSettlement: vi.fn(async () => ({ burgId: 'sf_x' })),
        on: () => () => {},
        call: () => Promise.resolve({}),
        isReady: true,
      },
    },
    overlayTransformRef: { current: null },
    onNavigate: vi.fn(),
    showLayersPanel: false,
    setShowLayersPanel: vi.fn(),
    mapReloadKey: 0,
    onReloadMap: vi.fn(),
    onCreateCampaign: vi.fn(),
    onSelectCampaign: vi.fn(),
    hasCampaigns: true,
    ...over,
  });

  test('Enter on a palette card mounts the focused session; Escape returns focus to the card', async () => {
    render(<WorldMapStage {...stageProps()} />);
    const card = await screen.findByRole('button', { name: /Ashford/i });
    card.focus();
    fireEvent.keyDown(card, { key: 'Enter' });
    const session = await screen.findByTestId('keyboard-placement-session');
    await waitFor(() => expect(document.activeElement).toBe(session));
    // The session announces through the palette's ONE live region (F28/E-I).
    const live = document.querySelector('[aria-live="polite"]');
    expect(live.textContent).toMatch(/Placing Ashford/i);
    fireEvent.keyDown(session, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByTestId('keyboard-placement-session')).toBeNull());
    expect(live.textContent).toMatch(/Placement cancelled/i);
    expect(document.activeElement).toBe(card);
  });

  test('with the bridge not ready (and no image backdrop), arming is refused politely', async () => {
    render(<WorldMapStage {...stageProps({ bridgeReady: false })} />);
    const card = await screen.findByRole('button', { name: /Ashford/i });
    fireEvent.keyDown(card, { key: 'Enter' });
    await act(async () => {}); // flush the announce state write
    expect(screen.queryByTestId('keyboard-placement-session')).toBeNull();
    expect(document.querySelector('[aria-live="polite"]').textContent)
      .toMatch(/still loading/i);
  });
});
