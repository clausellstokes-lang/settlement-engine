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
    expect(envoy.textContent).toMatch(/Envoy of A, trade/);
  });
});

// ── DESK-2 — the word→map hover glow (a sibling one-ring layer) ──────────────
describe('HoverGlowLayer — the word→map hover glow', () => {
  test('idle / unplaced hover ⇒ renders nothing; a placed hover ⇒ one glow at the placement', async () => {
    const { default: HoverGlowLayer } = await import('../../src/components/map/HoverGlowLayer.jsx');

    STORE = { hoveredSettlementId: null, mapState: { placements: PLACEMENTS, viewport: { scale: 1 } } };
    const idle = render(<svg><HoverGlowLayer /></svg>);
    expect(idle.container.querySelector('[data-testid="hover-glow"]')).toBeNull();
    idle.unmount();

    STORE = { hoveredSettlementId: 'ghost', mapState: { placements: PLACEMENTS, viewport: { scale: 1 } } };
    const unplaced = render(<svg><HoverGlowLayer /></svg>);
    expect(unplaced.container.querySelector('[data-testid="hover-glow"]')).toBeNull();
    unplaced.unmount();

    STORE = { hoveredSettlementId: 'b', mapState: { placements: PLACEMENTS, viewport: { scale: 1 } } };
    const lit = render(<svg><HoverGlowLayer /></svg>);
    const glow = lit.container.querySelector('[data-testid="hover-glow"]');
    expect(glow).not.toBeNull();
    // The glow sits at the hovered settlement's own placement, never a hit target.
    expect(glow.getAttribute('pointer-events')).toBe('none');
    expect(glow.querySelector('circle').getAttribute('cx')).toBe('90');
    expect(glow.querySelector('circle').getAttribute('cy')).toBe('90');
  });
});

// ── POLIS-3 — travel rings: hopWeeks-banded settlement groupings ─────────────
describe('TravelRingsLayer — banded halos from the selected settlement', () => {
  test('travelBandOf is the closed vocabulary; unreachable is its own honest null', async () => {
    const { travelBandOf, TRAVEL_BANDS } = await import('../../src/components/map/TravelRingsLayer.jsx');
    expect(TRAVEL_BANDS.map(b => b.id)).toEqual(['week', 'fortnight', 'month', 'far']);
    expect(travelBandOf(1).id).toBe('week');
    expect(travelBandOf(2).id).toBe('fortnight');
    expect(travelBandOf(4).id).toBe('month');
    expect(travelBandOf(9).id).toBe('far');
    expect(travelBandOf(null)).toBeNull();
  });

  test('no selection ⇒ nothing; no spatial canon ⇒ nothing; selected + canon ⇒ one banded halo per OTHER settlement', async () => {
    const { default: TravelRingsLayer } = await import('../../src/components/map/TravelRingsLayer.jsx');
    const base = {
      savedSettlements: IDS.map(id => ({ id, settlement: { name: id.toUpperCase() } })),
      mapState: { placements: PLACEMENTS, viewport: { scale: 1 } },
      campaigns: [{ id: 'camp', settlementIds: IDS, worldState: { tick: 5, spatialCanonVersion: 1, spatialDigest: DIGEST } }],
      activeCampaignId: 'camp',
    };

    STORE = { ...base, selectedSettlementId: null };
    const idle = render(<svg><TravelRingsLayer /></svg>);
    expect(idle.container.querySelector('[data-testid="travel-rings-overlay"]')).toBeNull();
    idle.unmount();

    STORE = { ...base, selectedSettlementId: 'a', campaigns: [{ id: 'camp', settlementIds: IDS, worldState: { tick: 5 } }] };
    const dark = render(<svg><TravelRingsLayer /></svg>);
    expect(dark.container.querySelector('[data-testid="travel-rings-overlay"]')).toBeNull();
    dark.unmount();

    STORE = { ...base, selectedSettlementId: 'a' };
    const lit = render(<svg><TravelRingsLayer /></svg>);
    const overlay = lit.container.querySelector('[data-testid="travel-rings-overlay"]');
    expect(overlay).not.toBeNull();
    expect(overlay.getAttribute('pointer-events')).toBe('none');
    const halos = [...overlay.querySelectorAll('[data-travel-band]')];
    expect(halos.length).toBe(2); // b and c — never the anchor itself
    for (const halo of halos) {
      // Every halo wears a band from the closed vocabulary (or the honest
      // unreachable), and its tip is a sentence anchored on the observer.
      expect(['week', 'fortnight', 'month', 'far', 'unreachable']).toContain(halo.getAttribute('data-travel-band'));
      expect(halo.getAttribute('aria-label')).toMatch(/from A|no road reaches it from A/);
    }
  });
});
