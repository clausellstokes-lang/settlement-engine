/** @vitest-environment jsdom */
/**
 * travelersLayer.test.jsx — THE TRAVELERS OVERLAY (R-6; DESIGN_THE_ROADS §13). Pins the three
 * sub-layers (armies / migrant columns / named-NPC envoys), the sub-layer filter, and the
 * dormancy constitution: the ARMY + MIGRANT sub-layers render over live ledgers with NO flag,
 * while the ENVOY sub-layer appears only when the roads ledger is present. Zero mutation.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import TravelersLayer from '../../src/components/map/TravelersLayer.jsx';

let STORE = {};
vi.mock('../../src/store/index.js', () => ({ useStore: selector => selector(STORE) }));
vi.mock('../../src/store', () => ({ useStore: selector => selector(STORE) }));

const IDS = ['a', 'b', 'c'];
const PLACEMENTS = {
  b_a: { settlementId: 'a', x: 10, y: 10 },
  b_b: { settlementId: 'b', x: 90, y: 90 },
  b_c: { settlementId: 'c', x: 50, y: 50 },
};
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();

const armyLedger = { 'a>b': { armyId: 'a', originId: 'a', destId: 'b', role: 'march', path: ['a', 'c', 'b'], departTick: 0, arrivalTick: 10, position01: 0.5 } };
const migrationLedger = { 'a:b:0': { originId: 'a', destId: 'b', arrivals: 40, departTick: 0, arrivalTick: 10 } };
const roadsLedger = { missions: { 'road.a.a:m.0': { id: 'road.a.a:m.0', npcKey: 'a:m', npcName: 'Envoy', homeId: 'a', destId: 'b', purpose: { kind: 'trade', ref: 'b' }, phase: 'outbound', path: ['a', 'c', 'b'], departTick: 0, legArrivalTick: 8 } } };

function buildStore({ worldState = {}, travelersFilter, authed = true, savedSettlements = IDS.map(id => ({ id, settlement: { name: id.toUpperCase() } })) } = {}) {
  return {
    savedSettlements,
    mapState: { placements: PLACEMENTS, layers: { travelers: true, ...(travelersFilter === undefined ? {} : { travelersFilter }) } },
    campaigns: [{ id: 'camp', settlementIds: IDS, worldState }],
    activeCampaignId: 'camp',
    geometryVersion: 1,
    auth: authed ? { user: { id: 'u1' } } : { user: null }, // §15: owner session sees the overlay
  };
}
const litWorld = (extra = {}) => ({ tick: 5, calendar: { elapsedWeeks: 5 }, spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: { armyTransit: armyLedger, migration: migrationLedger, ...extra } });

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('TravelersLayer — sub-layers (§13)', () => {
  test('renders nothing with no campaign', () => {
    STORE = { savedSettlements: [], mapState: { placements: PLACEMENTS, layers: { travelers: true } }, campaigns: [], activeCampaignId: null, geometryVersion: 1 };
    const { container } = render(<svg><TravelersLayer /></svg>);
    expect(container.querySelector('[data-testid="travelers-overlay"]')).toBeNull();
  });

  test('seeded fixtures render all three sub-layers when the roads ledger is present', () => {
    STORE = buildStore({ worldState: litWorld({ roads: roadsLedger }) });
    const { container } = render(<svg><TravelersLayer /></svg>);
    expect(container.querySelectorAll('[data-traveler="armies"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-traveler="migrants"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-traveler="envoys"]').length).toBeGreaterThan(0);
  });

  test('DARK world (no roads ledger) still renders army + migrant sub-layers, NO envoys', () => {
    STORE = buildStore({ worldState: litWorld() }); // no `roads` key
    const { container } = render(<svg><TravelersLayer /></svg>);
    expect(container.querySelectorAll('[data-traveler="armies"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-traveler="migrants"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-traveler="envoys"]').length).toBe(0);
  });

  test('the sub-layer filter hides the unselected kinds', () => {
    STORE = buildStore({ worldState: litWorld({ roads: roadsLedger }), travelersFilter: ['armies'] });
    const { container } = render(<svg><TravelersLayer /></svg>);
    expect(container.querySelectorAll('[data-traveler="armies"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-traveler="migrants"]').length).toBe(0);
    expect(container.querySelectorAll('[data-traveler="envoys"]').length).toBe(0);
  });

  test('an empty/aspatial world renders nothing', () => {
    STORE = buildStore({ worldState: { tick: 0, spatialLedgers: {} } });
    const { container } = render(<svg><TravelersLayer /></svg>);
    expect(container.querySelector('[data-testid="travelers-overlay"]')).toBeNull();
  });

  test('§15 SECRETS SEAM: an unauthenticated (non-owner) context renders NOTHING (fail closed)', () => {
    STORE = buildStore({ worldState: litWorld({ roads: roadsLedger }), authed: false });
    const { container } = render(<svg><TravelersLayer /></svg>);
    expect(container.querySelector('[data-testid="travelers-overlay"]')).toBeNull();
  });

  test('army marker carries a banner + ETA tooltip; envoy carries purpose', () => {
    STORE = buildStore({ worldState: litWorld({ roads: roadsLedger }) });
    const { container } = render(<svg><TravelersLayer /></svg>);
    const army = container.querySelector('[data-traveler="armies"] title');
    expect(army.textContent).toMatch(/army on the march, ETA 5w/);
    const envoy = container.querySelector('[data-traveler="envoys"] title');
    expect(envoy.textContent).toMatch(/Envoy of A — trade/);
  });
});
