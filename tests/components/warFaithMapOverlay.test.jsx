/** @vitest-environment jsdom */
/**
 * tests/components/warFaithMapOverlay.test.jsx — UX Phase 5 spatial war/faith glyphs.
 *
 * Pins the deliverables for WarFaithMapOverlay (deployment arrows, siege rings +
 * coalition badge, occupation shading, trade-war prize), and — critically — that
 * the siege glyph honors channel VISIBILITY exactly like the war_front edge
 * (a `gm` siege is drawn only for the DM view; a `public` one always; `hidden`
 * never), mirroring the §S3 warFaithOverlay visibility test.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import WarFaithMapOverlay from '../../src/components/map/WarFaithMapOverlay.jsx';

let STORE = {};
vi.mock('../../src/store/index.js', () => ({ useStore: selector => selector(STORE) }));
vi.mock('../../src/store', () => ({ useStore: selector => selector(STORE) }));

const PLACEMENTS = {
  b_a: { settlementId: 'a', x: 10, y: 10 },
  b_b: { settlementId: 'b', x: 90, y: 90 },
  b_c: { settlementId: 'c', x: 50, y: 50 },
};

function buildStore({ showGm = true, worldState = {}, regionalGraph = null, savedSettlements = [], warFaith } = {}) {
  return {
    savedSettlements,
    mapState: { placements: PLACEMENTS, layers: { regionalShowGm: showGm, ...(warFaith === undefined ? {} : { warFaith }) } },
    campaigns: [{ id: 'camp', settlementIds: ['a', 'b', 'c'], worldState, regionalGraph }],
    activeCampaignId: 'camp',
    geometryVersion: 1,
  };
}

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('WarFaithMapOverlay — self-gating', () => {
  test('renders nothing when there is no campaign', () => {
    STORE = { savedSettlements: [], mapState: { placements: PLACEMENTS, layers: {} }, campaigns: [], activeCampaignId: null, geometryVersion: 1 };
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('[data-testid="war-faith-overlay"]')).toBeNull();
  });

  test('renders nothing for a peaceful (no live war state) campaign', () => {
    STORE = buildStore({ worldState: {}, regionalGraph: { channels: [] } });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('[data-testid="war-faith-overlay"]')).toBeNull();
  });
});

describe('WarFaithMapOverlay — glyphs', () => {
  test('a deployment lights an arrow + a siege ring with a coalition badge', () => {
    STORE = buildStore({
      worldState: { deployments: { a: { targetId: 'b', sinceTick: 1, role: 'siege' } } },
      regionalGraph: { channels: [{ id: 'wf', type: 'war_front', status: 'confirmed', from: 'a', to: 'b', visibility: 'public' }] },
    });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('.sf-deployment-arrow')).toBeTruthy();
    expect(container.querySelector('.sf-siege-ring')).toBeTruthy();
    expect(container.querySelector('.sf-coalition-badge')).toBeTruthy();
  });

  test('occupation shading appears on a conquered node', () => {
    STORE = buildStore({
      worldState: { deployments: { a: { targetId: 'b' } } },
      savedSettlements: [{ id: 'b', settlement: { powerStructure: { previousGovernments: [{ label: 'Old', cause: 'conquest', tick: 3 }] } } }],
      regionalGraph: { channels: [] },
    });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('.sf-occupation')).toBeTruthy();
  });

  test('a trade-war prize glyph appears on the contested buyer', () => {
    STORE = buildStore({
      worldState: { tradeWarState: { 'b:grain': { winnerId: 'a', incumbentId: 'c', lastFlipTick: 2 } } },
      regionalGraph: { channels: [] },
    });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('.sf-trade-prize')).toBeTruthy();
  });

  test('the warFaith layer toggle hides everything when off', () => {
    STORE = buildStore({
      warFaith: false,
      worldState: { deployments: { a: { targetId: 'b' } } },
      regionalGraph: { channels: [{ id: 'wf', type: 'war_front', status: 'confirmed', from: 'a', to: 'b', visibility: 'public' }] },
    });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('[data-testid="war-faith-overlay"]')).toBeNull();
  });
});

describe('WarFaithMapOverlay — siege visibility is law', () => {
  // A siege fronted only by a GM war_front (no deployment) is GM-tier; deployments
  // are public-tier, so to test gm-only we use a war_front with NO deployment.
  const gmSiege = {
    worldState: {},
    regionalGraph: { channels: [{ id: 'wf', type: 'war_front', status: 'confirmed', from: 'a', to: 'b', visibility: 'gm' }] },
  };

  test('a GM siege is NOT drawn for a non-DM view', () => {
    STORE = buildStore({ showGm: false, ...gmSiege });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('.sf-siege-ring')).toBeNull();
  });

  test('the SAME GM siege IS drawn for the DM view', () => {
    STORE = buildStore({ showGm: true, ...gmSiege });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('.sf-siege-ring')).toBeTruthy();
  });

  test('a PUBLIC siege is drawn even for a non-DM view', () => {
    STORE = buildStore({
      showGm: false,
      worldState: {},
      regionalGraph: { channels: [{ id: 'wf', type: 'war_front', status: 'confirmed', from: 'a', to: 'b', visibility: 'public' }] },
    });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('.sf-siege-ring')).toBeTruthy();
  });
});

describe('WarFaithMapOverlay — mobilization glyph visibility is law (F1)', () => {
  test('an OVERT mobilizer draws a mobilization glyph in any view', () => {
    STORE = buildStore({
      showGm: false,
      worldState: { warPosture: { a: { state: 'mobilized', progress: 1, sinceTick: 0, covert: false } } },
      regionalGraph: { channels: [] },
    });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('.sf-mobilization')).toBeTruthy();
    expect(container.querySelector('.sf-mobilization-covert')).toBeNull();
  });

  test('a COVERT mobilizer is NOT drawn for a non-DM view', () => {
    STORE = buildStore({
      showGm: false,
      worldState: { warPosture: { a: { state: 'war_preparation', progress: 0.5, sinceTick: 0, covert: true } } },
      regionalGraph: { channels: [] },
    });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    // No mobilization glyph at all (the only mobilizer is covert).
    expect(container.querySelector('.sf-mobilization')).toBeNull();
    expect(container.querySelector('[data-testid="war-faith-overlay"]')).toBeNull();
  });

  test('the SAME covert mobilizer IS drawn for the DM view, flagged covert', () => {
    STORE = buildStore({
      showGm: true,
      worldState: { warPosture: { a: { state: 'war_preparation', progress: 0.5, sinceTick: 0, covert: true } } },
      regionalGraph: { channels: [] },
    });
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('.sf-mobilization-covert')).toBeTruthy();
  });
});
