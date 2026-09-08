/** @vitest-environment jsdom */
/**
 * Map display identity-boundary tests.
 *
 * Persisted campaigns, saves, and placements can carry the same identifier as
 * either a number or a string. These tests render the real map read surfaces
 * and prove that comparison normalizes type without rewriting the canonical id
 * returned to callbacks. Nonmatching ids are the negative controls.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const { useStore, ctx } = vi.hoisted(() => {
  const state = {};
  const store = selector => selector(state);
  store.getState = () => state;
  store.subscribe = () => () => {};
  return { useStore: store, ctx: { state } };
});

vi.mock('../../src/store/index.js', () => ({ useStore }));
vi.mock('../../src/store', () => ({ useStore }));
vi.mock('../../src/components/gallery/MapShareEditor.jsx', () => ({
  default: ({ campaign, members }) => (
    <div data-testid="map-share-editor">
      <span>{campaign.name}</span>
      {members.map(member => <span key={member.name}>{member.name}</span>)}
    </div>
  ),
}));
vi.mock('../../src/components/primitives/useDialogFocusTrap.js', () => ({
  useDialogFocusTrap: () => ({ current: null }),
}));
vi.mock('../../src/domain/display/timelineTrack.js', () => ({
  buildTimelineTrack: () => ({}),
  frameAtTick: () => ({
    tick: 3,
    deltas: {},
    pulses: [{ settlementId: 7, severity: 0.5 }],
  }),
}));
vi.mock('../../src/domain/display/viewerSecrets.js', () => ({
  viewerSeesDmSecrets: () => true,
}));

import MapShareEditorOverlay from '../../src/components/map/MapShareEditorOverlay.jsx';
import PlacementDetailCard from '../../src/components/map/PlacementDetailCard.jsx';
import QuickInspector from '../../src/components/map/QuickInspector.jsx';
import TimelapseLayer from '../../src/components/map/TimelapseLayer.jsx';

function resetState() {
  Object.assign(ctx.state, {
    activeCampaignId: null,
    campaigns: [],
    savedSettlements: [],
    auth: { user: { id: 'owner-1' } },
    hoveredSettlementId: null,
    selectedSettlementId: null,
    selectedBurgId: null,
    mapState: { placements: {} },
    timelapseTick: null,
    geometryVersion: 0,
    clearSelectedSettlementId: vi.fn(),
    clearSelectedBurgId: vi.fn(),
    removePlacementLocal: vi.fn(),
  });
}

beforeEach(resetState);
afterEach(cleanup);

describe('map view id boundaries', () => {
  test('a string active id resolves one numeric-id campaign and one mixed-id member', () => {
    Object.assign(ctx.state, {
      activeCampaignId: '42',
      campaigns: [{ id: 42, name: 'The Reach', settlementIds: [7] }],
      savedSettlements: [{
        id: '7',
        name: 'Aldermoor',
        phase: 'canon',
        settlement: { name: 'Aldermoor' },
      }],
    });

    render(<MapShareEditorOverlay open onClose={() => {}} />);

    expect(screen.getByTestId('map-share-editor')).toBeTruthy();
    expect(screen.getAllByText('The Reach')).toHaveLength(1);
    expect(screen.getAllByText('Aldermoor')).toHaveLength(1);
  });

  test('a numeric hover id resolves the equivalent string-id save once', () => {
    Object.assign(ctx.state, {
      hoveredSettlementId: 7,
      savedSettlements: [{
        id: '7',
        name: 'Aldermoor',
        settlement: { name: 'Aldermoor', tier: 'large_town', population: 1200 },
      }],
    });

    render(<QuickInspector />);

    expect(screen.getAllByText('Aldermoor')).toHaveLength(1);
    expect(screen.getByText(/Large town/)).toBeTruthy();
    expect(screen.queryByText(/large_town/i)).toBeNull();
  });

  test('a numeric selection opens and removes its string-id save placement', () => {
    const onOpenDetail = vi.fn();
    Object.assign(ctx.state, {
      selectedSettlementId: 7,
      savedSettlements: [{
        id: '7',
        name: 'Aldermoor',
        settlement: { name: 'Aldermoor', tier: 'large_town', population: 1200 },
      }],
      mapState: { placements: { burgA: { settlementId: '7', x: 10, y: 20 } } },
    });

    render(<PlacementDetailCard onOpenDetail={onOpenDetail} />);
    expect(screen.getAllByText('Aldermoor')).toHaveLength(1);
    expect(screen.getByText(/Large town/)).toBeTruthy();
    expect(screen.queryByText(/large_town/i)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenDetail).toHaveBeenCalledOnce();
    expect(onOpenDetail).toHaveBeenCalledWith(7);

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(ctx.state.removePlacementLocal).toHaveBeenCalledWith('burgA');
  });

  test('a numeric pulse appears once on its string-id placement', () => {
    Object.assign(ctx.state, {
      activeCampaignId: '42',
      campaigns: [{ id: 42, worldState: {} }],
      timelapseTick: 3,
      mapState: { placements: { burgA: { settlementId: '7', x: 10, y: 20 } } },
    });

    const { container } = render(<svg><TimelapseLayer /></svg>);
    expect(screen.getByTestId('timelapse-overlay')).toBeTruthy();
    expect(container.querySelectorAll('circle')).toHaveLength(1);
  });
});
