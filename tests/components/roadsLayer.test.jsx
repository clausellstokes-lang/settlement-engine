/** @vitest-environment jsdom */
/**
 * roadsLayer.test.jsx — THE ROADS OVERLAY's half of WEAVE NET-1.
 *
 * `computeRoadEdges` decides WHICH pairs get a road; this layer is the only place
 * the `preferSea` flag on those pairs reaches anybody — it is packed into the
 * `settlementEngine:computeRoadNetwork` payload and it is what makes the iframe's
 * A* consider a water route at all. So the question "is this settlement a port?"
 * is answered HERE, and NET-1 changes the answer.
 *
 * BEFORE: the port claim came from the settlement's own
 * `config.tradeRouteAccess === 'port'` — an INSTITUTIONAL claim a settlement makes
 * about itself, which a landlocked town can make as easily as a harbour.
 * AFTER: where the campaign carries a FROZEN SPATIAL CANON, the canon's sea-lane
 * graph is authoritative (its `ports` list is the set of nodes the lanes actually
 * connect — geography ∧ institution ∧ navigability), read through the one
 * `distanceRead.isPort` law every engine seam already uses.
 *
 * The three cases that matter are all pinned below, against a REAL digest built
 * from the port-coast fixture rather than a hand-written stand-in:
 *   1. no canon                 ⇒ the institutional read, unchanged (the dormancy bar);
 *   2. canon present            ⇒ the canon's answer, including where it DISAGREES;
 *   3. canon without sea lanes  ⇒ treated as no canon, not as "no ports anywhere".
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { activeSeaLanes } from '../../src/domain/spatial/distanceRead.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { makePortCoastPack } from '../fixtures/spatialPackFixtures.js';
import RoadsLayer from '../../src/components/map/RoadsLayer.jsx';

let STORE = {};
vi.mock('../../src/store/index.js', () => ({ useStore: selector => selector(STORE) }));
vi.mock('../../src/store', () => ({ useStore: selector => selector(STORE) }));

// A real coast pack: rows 0-2 ocean, row 3 all coast. Twenty dock-bearing
// placements sit on row 3, so the built sea-lane graph genuinely connects them.
const COAST = makePortCoastPack(20);
const SEA_DIGEST = buildSpatialDigest({
  pack: COAST.pack, placements: COAST.placements, seaLanes: true,
});
const LANDLOCKED_DIGEST = buildSpatialDigest({
  pack: COAST.pack, placements: COAST.placements,   // no seaLanes ⇒ the key stays null
});

/** Two of the fixture's real port ids, plus one settlement the canon never saw. */
const PORT_A = 'p000';
const PORT_B = 'p001';
const STRANGER = 'zz-not-in-canon';

// Geometry chosen so the two real ports are DIRECTLY linked (a short side the
// Urquhart pass keeps) while the stranger sits far off, so both the agreeing and
// the disagreeing case are observable on the same render.
const PLACEMENTS = {
  bA: { settlementId: PORT_A, x: 0, y: 0 },
  bB: { settlementId: PORT_B, x: 100, y: 0 },
  bZ: { settlementId: STRANGER, x: 50, y: 500 },
};

/** Every settlement claims 'port' institutionally — so the canon can only ever
 *  narrow the answer, which is exactly the discrimination we want to observe. */
const SAVES = [PORT_A, PORT_B, STRANGER].map(id => ({
  id,
  settlement: {
    tier: 'city', name: id, config: { tradeRouteAccess: 'port' }, neighbourNetwork: [],
  },
}));

function buildStore(worldState) {
  return {
    savedSettlements: SAVES,
    mapState: { placements: PLACEMENTS, seed: 'seed-1', layers: {} },
    campaigns: [{ id: 'camp', settlementIds: [PORT_A, PORT_B, STRANGER], worldState }],
    activeCampaignId: 'camp',
    geometryVersion: 1,
  };
}

/** Render the layer with a stub bridge and return the edge payload it sent. */
async function payloadFor(worldState) {
  STORE = buildStore(worldState);
  const calls = [];
  const bridge = {
    isReady: true,
    call: (type, data) => { calls.push({ type, data }); return Promise.resolve({ paths: {} }); },
  };
  render(<svg><RoadsLayer bridge={bridge} /></svg>);
  await waitFor(() => expect(calls.length).toBeGreaterThan(0));
  expect(calls[0].type).toBe('settlementEngine:computeRoadNetwork');
  return calls[0].data.edges;
}

const seaPairs = (edges) => edges.filter(e => e.preferSea).map(e => e.id).sort();

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('RoadsLayer — the port definition the iframe is asked to route (WEAVE NET-1)', () => {
  test('with NO spatial canon the institutional claim still decides (the dormancy bar)', async () => {
    const edges = await payloadFor({ tick: 3 });
    expect(edges.length).toBeGreaterThan(0);
    // All three claim 'port', so every emitted pair prefers sea — the pre-NET-1
    // behaviour, unchanged.
    expect(seaPairs(edges)).toEqual(edges.map(e => e.id).sort());
  });

  test('with a FROZEN CANON the sea-lane graph decides, and it DISAGREES with the claim', async () => {
    const edges = await payloadFor({
      tick: 3, spatialCanonVersion: 1, spatialDigest: SEA_DIGEST,
    });
    expect(edges.length).toBeGreaterThan(0);
    // The stranger is not a node of the frozen sea graph, so no pair touching it
    // may ask for a water route however loudly its config claims 'port'.
    const strangerEdges = edges.filter(e => e.id.includes('bZ'));
    expect(strangerEdges.length).toBeGreaterThan(0);
    for (const e of strangerEdges) expect(e.preferSea).toBe(false);
    // …while the two real ports still do — otherwise the assertion above would
    // pass just as well against a canon read that answered false for everything.
    const portPair = edges.find(e => e.id === 'road_bA|bB');
    expect(portPair).toBeTruthy();
    expect(portPair.preferSea).toBe(true);
  });

  test('a canon whose sea lanes are DORMANT is not read as "nowhere is a port"', async () => {
    // The digest exists and is active, but carries no sea-lane graph. Reading its
    // (absent) port list as authoritative would silently kill every sea route on
    // a perfectly valid campaign; the layer must fall back to the claim instead.
    const edges = await payloadFor({
      tick: 3, spatialCanonVersion: 1, spatialDigest: LANDLOCKED_DIGEST,
    });
    expect(edges.length).toBeGreaterThan(0);
    expect(seaPairs(edges)).toEqual(edges.map(e => e.id).sort());
  });

  test('the fixture canon really does hold a sea graph (anti-vacuity for the two above)', () => {
    // Read through the dormancy gate, not at a hand-written address.
    const lanes = activeSeaLanes(SEA_DIGEST);
    expect(lanes).toBeTruthy();
    expect(lanes.ports).toContain(PORT_A);
    expect(lanes.ports).toContain(PORT_B);
    // PORT_B is the liveness anchor: it is minted by the SAME buildSpatialDigest
    // sea-lane pass as any id the stranger would have to travel to get in, so a
    // ports list that drifted away or emptied reds here instead of passing.
    expectAbsentWithAnchor(lanes.ports, STRANGER, PORT_B, 'frozen sea-graph node set');
    expect(activeSeaLanes(LANDLOCKED_DIGEST)).toBeNull();
  });
});
