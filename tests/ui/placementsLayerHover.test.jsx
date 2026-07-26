/**
 * @vitest-environment jsdom
 *
 * tests/ui/placementsLayerHover.test.jsx — guard for the QuickInspector
 * hover-peek emission from the realm-map placement icons.
 *
 * THE GAP THIS LOCKS: QuickInspector's hover-peek could only ever fire from
 * the SettlementPalette list cards. The realm-map placement icons never
 * emitted setHoveredSettlementId, even though QuickInspector's docstring long
 * claimed the emit "lives in MapOverlay (placement marker handlers)" — a claim
 * true on no lineage. PlacementsLayer now wires the emission; this locks it so
 * it can't silently drop again.
 *
 * Asserts:
 *   • a mouse pointer entering a placement icon emits setHoveredSettlementId(id)
 *   • leaving clears it
 *   • a touch pointer does NOT emit (hover is meaningless on touch)
 *   • starting a drag clears any hover-peek (pointer capture would swallow the
 *     pairing pointerleave that would otherwise clear it)
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

// One superset store drives every selector PlacementsLayer reads, plus the
// getState()/subscribe() surface its useViewportScale hook touches. Built via
// vi.hoisted so the vi.mock factory (hoisted to top) can close over it.
const { useStore, ctx } = vi.hoisted(() => {
  const spies = {
    setHovered: vi.fn(),
    clearHovered: vi.fn(),
    setSelectedBurg: vi.fn(),
    setSelectedSettlement: vi.fn(),
    updatePlacement: vi.fn(),
  };
  const state = {
    mapState: {
      placements: { b1: { settlementId: 's1', x: 100, y: 100, name: 'Springhaven' } },
      viewport: { scale: 1 },
    },
    savedSettlements: [{ id: 's1', name: 'Springhaven', tier: 'town', population: 1200 }],
    selectedBurgId: null,
    selectedSettlementId: null,
    activeCampaignId: null,
    campaigns: [],
    setSelectedBurgId: spies.setSelectedBurg,
    setSelectedSettlementId: spies.setSelectedSettlement,
    updatePlacement: spies.updatePlacement,
    setHoveredSettlementId: spies.setHovered,
    clearHoveredSettlementId: spies.clearHovered,
  };
  const store = (selector) => selector(state);
  store.getState = () => state;
  store.subscribe = () => () => {};
  return { useStore: store, ctx: { spies, state } };
});

vi.mock('../../src/store/index.js', () => ({ useStore }));

import PlacementsLayer from '../../src/components/map/PlacementsLayer.jsx';

const transformRef = { current: { tx: 0, ty: 0, scale: 1 } };

// PlacementsLayer returns a bare <g>, so mount it inside an <svg>.
function renderLayer() {
  return render(
    <svg>
      <PlacementsLayer transformRef={transformRef} />
    </svg>,
  );
}

beforeEach(() => {
  // Shared state object — reset selection between tests.
  ctx.state.selectedBurgId = null;
  ctx.state.selectedSettlementId = null;
  ctx.state.mapState.placements = {
    b1: { settlementId: 's1', x: 100, y: 100, name: 'Springhaven' },
  };
  ctx.state.savedSettlements = [
    { id: 's1', name: 'Springhaven', tier: 'town', population: 1200 },
  ];
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('PlacementsLayer — QuickInspector hover-peek emission', () => {
  test('a numeric placement resolves the equivalent string-id save for its label', () => {
    ctx.state.mapState.placements = {
      b7: { settlementId: 7, x: 100, y: 100, name: 'Stale fallback' },
    };
    ctx.state.savedSettlements = [
      { id: '7', name: 'Aldermoor', tier: 'town', population: 1200 },
    ];

    const { container } = renderLayer();
    expect(container.querySelector('[data-hover-settlement-id="7"]')).toBeTruthy();
    expect(container.textContent).toContain('Aldermoor');
    expect(container.textContent).not.toContain('Stale fallback');
  });

  test('a mouse pointer entering a placement icon emits the hover-peek', () => {
    const { container } = renderLayer();
    const icon = container.querySelector('[data-hover-settlement-id="s1"]');
    expect(icon).toBeTruthy();
    fireEvent.pointerEnter(icon, { pointerType: 'mouse' });
    expect(ctx.spies.setHovered).toHaveBeenCalledWith('s1');
  });

  test('leaving a placement icon clears the hover-peek', () => {
    const { container } = renderLayer();
    const icon = container.querySelector('[data-hover-settlement-id="s1"]');
    fireEvent.pointerLeave(icon, { pointerType: 'mouse' });
    expect(ctx.spies.clearHovered).toHaveBeenCalled();
  });

  test('a touch pointer does NOT emit a hover-peek', () => {
    const { container } = renderLayer();
    const icon = container.querySelector('[data-hover-settlement-id="s1"]');
    fireEvent.pointerEnter(icon, { pointerType: 'touch' });
    expect(ctx.spies.setHovered).not.toHaveBeenCalled();
  });

  test('starting a drag on the selected icon clears any hover-peek', () => {
    // A drag only begins on an already-selected icon (avoids hijacking a fresh
    // click). Select it, then a pointerdown on the icon's drag group must clear.
    ctx.state.selectedSettlementId = 's1';
    const { container } = renderLayer();
    const wrapper = container.querySelector('[data-hover-settlement-id="s1"]');
    // TierIcon's translate group (the wrapper's first descendant <g>) carries
    // the drag pointer handlers.
    const iconGroup = wrapper.querySelector('g');
    fireEvent.pointerDown(iconGroup, { button: 0, pointerId: 1, clientX: 100, clientY: 100 });
    expect(ctx.spies.clearHovered).toHaveBeenCalled();
  });
});
