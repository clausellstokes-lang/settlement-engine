/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import RelationshipEdges from '../../src/components/map/RelationshipEdges.jsx';

// A store stub the selector-based useStore reads from. Each test rebuilds it.
let STORE = {};

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(STORE),
}));
vi.mock('../../src/store', () => ({
  useStore: selector => selector(STORE),
}));

function buildStore({ showGm, channels }) {
  return {
    savedSettlements: [],
    mapState: {
      placements: {
        b_a: { settlementId: 'a', x: 10, y: 10 },
        b_b: { settlementId: 'b', x: 90, y: 90 },
        b_c: { settlementId: 'c', x: 50, y: 50 },
      },
      layers: { relationshipFilter: null, regionalShowGm: showGm },
    },
    campaigns: [{ id: 'camp', regionalGraph: { channels } }],
    activeCampaignId: 'camp',
    geometryVersion: 1,
  };
}

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('war/faith map overlay visibility (§S3)', () => {
  test('a PUBLIC war_front is drawn even for a non-DM view', () => {
    STORE = buildStore({
      showGm: false,
      channels: [{ id: 'wf', type: 'war_front', status: 'confirmed', from: 'a', to: 'c', visibility: 'public' }],
    });
    const { container } = render(<svg><RelationshipEdges /></svg>);
    expect(container.querySelector('.sf-war_front')).toBeTruthy();
  });

  test('a GM religious_authority channel is NOT drawn for a non-DM view', () => {
    STORE = buildStore({
      showGm: false,
      channels: [{ id: 'ra', type: 'religious_authority', status: 'confirmed', from: 'a', to: 'b', visibility: 'gm' }],
    });
    const { container } = render(<svg><RelationshipEdges /></svg>);
    expect(container.querySelector('.sf-religious_authority')).toBeNull();
  });

  test('the SAME GM religious_authority channel IS drawn for the DM view', () => {
    STORE = buildStore({
      showGm: true,
      channels: [{ id: 'ra', type: 'religious_authority', status: 'confirmed', from: 'a', to: 'b', visibility: 'gm' }],
    });
    const { container } = render(<svg><RelationshipEdges /></svg>);
    expect(container.querySelector('.sf-religious_authority')).toBeTruthy();
  });

  test('a HIDDEN war_front is never drawn (even for the DM view)', () => {
    STORE = buildStore({
      showGm: true,
      channels: [{ id: 'wf', type: 'war_front', status: 'confirmed', from: 'a', to: 'c', visibility: 'hidden' }],
    });
    const { container } = render(<svg><RelationshipEdges /></svg>);
    expect(container.querySelector('.sf-war_front')).toBeNull();
  });

  test('inert (renders nothing) when there are no war/faith channels and no neighbours', () => {
    STORE = buildStore({ showGm: true, channels: [] });
    const { container } = render(<svg><RelationshipEdges /></svg>);
    expect(container.querySelector('.sf-relationship-edges')).toBeNull();
  });
});
