/**
 * @vitest-environment jsdom
 *
 * tests/ui/placementsLayerFirstAdvance.test.jsx — H2 THE FIRST ADVANCE guard.
 *
 * The realm-map hero: on the FIRST committed advance of the session, every
 * medallion the tick TOUCHED breathes once (oc-m-inkpulse); a settlement the
 * advance left alone never pulses (the pulse marks CHANGE, not spectacle).
 * Detection is read-side off the EXISTING advance counter (the active
 * campaign's worldState.pulseHistory grows by one record per advance) against a
 * mount-time baseline — no new store field, no persisted state. This locks:
 *   • the touched medallion gains oc-m-inkpulse on the first pulseHistory rise
 *   • an untouched medallion does NOT pulse
 *   • no medallion pulses before the first advance (baseline, not spectacle)
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';

// Mutable store state shared by the mock selector; mutated to simulate the
// advance commit (a fresh worldState with a longer pulseHistory).
const { useStore, ctx } = vi.hoisted(() => {
  const state = {
    mapState: {
      placements: {
        b1: { settlementId: 's1', x: 40, y: 40, name: 'Springhaven' },
        b2: { settlementId: 's2', x: 200, y: 200, name: 'Ashford' },
      },
      viewport: { scale: 1 },
    },
    savedSettlements: [
      { id: 's1', name: 'Springhaven', tier: 'town', population: 1200 },
      { id: 's2', name: 'Ashford', tier: 'village', population: 400 },
    ],
    selectedBurgId: null,
    selectedSettlementId: null,
    activeCampaignId: 'c1',
    campaigns: [{ id: 'c1', worldState: { pulseHistory: [] } }],
    setSelectedBurgId: vi.fn(),
    setSelectedSettlementId: vi.fn(),
    updatePlacement: vi.fn(),
    setHoveredSettlementId: vi.fn(),
    clearHoveredSettlementId: vi.fn(),
  };
  const store = (selector) => selector(state);
  store.getState = () => state;
  store.subscribe = () => () => {};
  return { useStore: store, ctx: { state } };
});

vi.mock('../../src/store/index.js', () => ({ useStore }));

import PlacementsLayer from '../../src/components/map/PlacementsLayer.jsx';

const transformRef = { current: { tx: 0, ty: 0, scale: 1 } };

function renderLayer() {
  return render(
    <svg>
      <PlacementsLayer transformRef={transformRef} />
    </svg>,
  );
}

// Simulate a committed advance whose only touched settlement is s1: replace the
// worldState with a fresh object carrying one more pulseHistory record.
function commitAdvanceTouching(ids) {
  ctx.state.campaigns = [{
    id: 'c1',
    worldState: {
      pulseHistory: [
        ...ctx.state.campaigns[0].worldState.pulseHistory,
        { id: 'p1', selectedOutcomes: [{ settlementIds: ids }] },
      ],
    },
  }];
}

afterEach(() => {
  cleanup();
  ctx.state.campaigns = [{ id: 'c1', worldState: { pulseHistory: [] } }];
});

describe('PlacementsLayer — H2 THE FIRST ADVANCE (medallion ink-pulse)', () => {
  test('no medallion pulses before an advance (the baseline)', () => {
    const { container } = renderLayer();
    expect(container.querySelector('.oc-m-inkpulse')).toBeNull();
  });

  test('the first advance pulses only the medallions the tick TOUCHED', () => {
    const { container, rerender } = renderLayer();
    // First advance: touches s1 only.
    act(() => { commitAdvanceTouching(['s1']); });
    rerender(<svg><PlacementsLayer transformRef={transformRef} /></svg>);

    const s1 = container.querySelector('[data-hover-settlement-id="s1"]');
    const s2 = container.querySelector('[data-hover-settlement-id="s2"]');
    expect(s1?.classList.contains('oc-m-inkpulse')).toBe(true);   // touched → pulses
    expect(s2?.classList.contains('oc-m-inkpulse')).toBe(false);  // untouched → still
  });

  test('a second advance does NOT re-pulse (fire-once per session)', () => {
    const { container, rerender } = renderLayer();
    act(() => { commitAdvanceTouching(['s1']); });
    rerender(<svg><PlacementsLayer transformRef={transformRef} /></svg>);
    // The one-shot clears; a later advance must not fire the hero again.
    act(() => {
      ctx.state.campaigns[0].worldState = {
        pulseHistory: [
          { id: 'p1', selectedOutcomes: [{ settlementIds: ['s1'] }] },
          { id: 'p2', selectedOutcomes: [{ settlementIds: ['s2'] }] },
        ],
      };
    });
    rerender(<svg><PlacementsLayer transformRef={transformRef} /></svg>);
    // s2 (touched by the SECOND advance) must not pulse — the hero fired already.
    const s2 = container.querySelector('[data-hover-settlement-id="s2"]');
    expect(s2?.classList.contains('oc-m-inkpulse')).toBe(false);
  });
});
