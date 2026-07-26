/**
 * seaLanes.test.js — Phase 5.5 mover wave M8: SEA LANES MATERIALIZED (§4j).
 *
 * The pure-engine + read-layer behaviour suite. Port eligibility (geography ∧
 * institution, pure/deterministic); the cheap high-capacity edge set; the ISOLATION
 * INVERSION (an island port is a hub); PIRACY = the M1 danger term on the port
 * nodes a sea route traverses; STORM season raises lane cost; the SHIP-CREW carrier
 * (fast port-to-port rumors); REFUGEE sea passage (a sea-reachable port becomes a
 * migration candidate); NAVAL BLOCKADE parity (a port needs BOTH land AND sea cut to
 * starve); NO fleet combat; and the DORMANT byte-identity (a seaLanes-null digest
 * reads no lanes).
 */
import { describe, expect, it } from 'vitest';

import {
  buildSpatialDigest,
  derivePortEligibility,
  hasWaterAccessInstitution,
  waterAccessInstitutionNames,
  isCoastalCell,
  isRiverCell,
  buildSeaLanes,
  SEA_LANE_CAPACITY,
  SEA_COST_PER_DIST,
} from '../../src/domain/spatial/index.js';
import {
  activeSeaLanes, isPort, pathCost, hopWeeks, distanceWeight, candidateRoutes,
  seaLaneNeighbourMap, calibration,
} from '../../src/domain/spatial/distanceRead.js';
import { chooseRoute, scoreRoute } from '../../src/domain/spatial/embattlement.js';
import { rankSupplySources, advanceSupplyShipments, supplyInterdictionLevel, linkKey } from '../../src/domain/spatial/supplyShipments.js';
import { advanceRumorLedgers, RUMOR_CARRIER_SHIP } from '../../src/domain/spatial/rumorNetwork.js';
import { makeGridPack, placePortSettlements, makeIslandPack, placeSettlements, makeDisconnectedWaterPack, makePortCoastPack, makeIsthmusPack } from '../fixtures/spatialPackFixtures.js';

const DOCK = [{ name: 'Docks/port facilities' }];

function goldenPortDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placePortSettlements(pack, { nCoastal: 3, nRiver: 2, nInland: 3 });
  return { pack, placements, digest: buildSpatialDigest({ pack, placements, seaLanes: true }) };
}

describe('M8 — PORT ELIGIBILITY = geography ∧ institutions (pure, derived)', () => {
  it('the water-access catalog enumeration is non-empty and includes docks + shipyard', () => {
    const names = waterAccessInstitutionNames();
    expect(names.length).toBeGreaterThan(1);
    expect(names).toContain('Docks/port facilities');
    expect(names).toContain('Shipyard');
  });

  it('a landlocked settlement can NEVER buy its way onto the water (geography necessary)', () => {
    const { digest } = goldenPortDigest();
    const ports = new Set(digest.reserved.seaLanes.ports);
    // The inland settlements (p005..p007) carry a dock but sit off navigable water.
    expect(ports.has('p005')).toBe(false);
    expect(ports.has('p006')).toBe(false);
    expect(ports.has('p007')).toBe(false);
  });

  it('a coastal/river settlement WITHOUT a dock is a beach, not a port (institution sufficient)', () => {
    const pack = makeGridPack({ cols: 24, rows: 18 });
    // Same coastal/river cells, but strip the institutions ⇒ geography holds, capability fails.
    const withDocks = placePortSettlements(pack, { nCoastal: 3, nRiver: 2, nInland: 0 });
    const stripped = withDocks.map((p) => ({ id: p.id, cellId: p.cellId })); // no institutions
    const digest = buildSpatialDigest({ pack, placements: stripped, seaLanes: true });
    expect(digest.reserved.seaLanes).toBeNull(); // <2 ports ⇒ dormant slot
  });

  it('derivePortEligibility is a PURE deterministic function of geometry + roster', () => {
    const pack0 = makeGridPack({ cols: 24, rows: 18 });
    const cells = { ...pack0.cells, cellCount: pack0.cells.h.length };
    const seeds = [{ id: 'b', cellId: 6 }, { id: 'a', cellId: 6 }];
    const roster = { a: DOCK, b: [] };
    const e1 = derivePortEligibility(cells, seeds, roster);
    const e2 = derivePortEligibility(cells, [...seeds].reverse(), roster);
    expect(JSON.stringify(e1)).toBe(JSON.stringify(e2)); // order-independent, codepoint-sorted
    // cell 6 is a coastal seat; 'a' has a dock ⇒ port, 'b' has none ⇒ not.
    const byId = Object.fromEntries(e1.map((r) => [r.id, r]));
    expect(byId.a.coastal).toBe(true);
    expect(byId.a.port).toBe(true);
    expect(byId.b.port).toBe(false);
  });

  it('hasWaterAccessInstitution matches names, ids, and string rows; rejects non-maritime', () => {
    expect(hasWaterAccessInstitution([{ name: 'Docks/port facilities' }])).toBe(true);
    expect(hasWaterAccessInstitution(['Shipyard'])).toBe(true);
    expect(hasWaterAccessInstitution([{ name: 'Granary' }])).toBe(false);
    expect(hasWaterAccessInstitution([])).toBe(false);
    expect(hasWaterAccessInstitution(null)).toBe(false);
  });

  it('does not derive water access from a current custom presentation name', () => {
    const customDock = {
      name: 'Docks/port facilities',
      source: 'custom',
      isCustom: true,
      customDefinitionCategory: 'institutions',
      customDefinitionId: 'definition:institutions:dock-namesake',
    };

    expect(hasWaterAccessInstitution([customDock])).toBe(false);
    // A provenance-free legacy row keeps the historical name fallback.
    expect(hasWaterAccessInstitution([{ name: 'Docks/port facilities' }]))
      .toBe(true);
  });

  it('geography helpers read the frozen pack: coast = ocean neighbour, river = r!=0', () => {
    const pack = makeGridPack({ cols: 24, rows: 18 });
    const cells = { ...pack.cells, cellCount: pack.cells.h.length };
    expect(isCoastalCell(cells, 6)).toBe(true);   // borders the ocean bay
    expect(isRiverCell(cells, 216)).toBe(true);   // on the river course
    expect(isCoastalCell(cells, 216)).toBe(false); // river, not coast
  });

  it('re-derives on a founding event: a NEW dock lights a port + the edge set (a re-canonize)', () => {
    const pack = makeGridPack({ cols: 24, rows: 18 });
    // Two coastal settlements: initially only ONE has a dock ⇒ <2 ports ⇒ null slot.
    const coastalCells = [6, 30];
    const before = [
      { id: 'a', cellId: coastalCells[0], institutions: DOCK },
      { id: 'b', cellId: coastalCells[1], institutions: [] },
    ];
    expect(buildSpatialDigest({ pack, placements: before, seaLanes: true }).reserved.seaLanes).toBeNull();
    // 'b' FOUNDS a harbour ⇒ the re-canonize now derives TWO ports + a lane.
    const after = before.map((p) => (p.id === 'b' ? { ...p, institutions: DOCK } : p));
    const lit = buildSpatialDigest({ pack, placements: after, seaLanes: true }).reserved.seaLanes;
    expect(lit).toBeTruthy();
    expect(lit.ports).toEqual(['a', 'b']);
    expect(lit.edges.length).toBe(1);
  });
});

describe('M8 — the SEA/RIVER EDGE SET (cheap, high-capacity, sparse + reachable)', () => {
  it('a SPARSE (not O(P²) clique) high-capacity edge set that keeps each water body connected', () => {
    const { digest } = goldenPortDigest();
    const lanes = activeSeaLanes(digest);
    expect(lanes.ports.length).toBeGreaterThanOrEqual(2);
    // Sparse: far fewer than the clique's P(P-1)/2 (the size fix); every edge cheap + high-capacity.
    expect(lanes.edges.length).toBeLessThan((lanes.ports.length * (lanes.ports.length - 1)) / 2 + 1);
    for (const e of lanes.edges) {
      expect(e.capacity).toBe(SEA_LANE_CAPACITY);
      expect(e.cost).toBeGreaterThan(0);
      expect(e.between[0] < e.between[1]).toBe(true); // codepoint-ordered pair
    }
    // Every listed port participates in at least one lane (a lone port is not listed).
    const inEdge = new Set(lanes.edges.flatMap((e) => e.between));
    for (const p of lanes.ports) expect(inEdge.has(p)).toBe(true);
  });

  it('water is CHEAPER than land for the same span — a sea lane beats the land haul', () => {
    // Two coastal ports connected by a sea lane; the water route is cheaper than land.
    const { digest } = goldenPortDigest();
    const lanes = activeSeaLanes(digest);
    const edge = lanes.edges[0];
    const [a, b] = edge.between;
    const landRow = digest.distanceMatrix[a] || {};
    const landCost = landRow[b];
    const seaCost = pathCost(digest, a, b); // sea-aware (min of land + sea)
    if (landCost != null) expect(seaCost).toBeLessThanOrEqual(landCost);
    expect(seaCost).toBeGreaterThan(0);
  });

  it('SOAK — a large port-heavy realm (≥90 ports) stays UNDER the digest cap (no clique blow-up)', () => {
    const SPATIAL_DIGEST_MAX_BYTES = 400_000; // runSpatialCanonize's cap
    const { pack, placements } = makePortCoastPack(95);
    const digest = buildSpatialDigest({ pack, placements, seaLanes: true });
    const lanes = activeSeaLanes(digest);
    expect(lanes.ports.length).toBe(95);
    // Sparse: bounded well below the clique's 95·94/2 = 4465 edges.
    expect(lanes.edges.length).toBeLessThan(95 * 4); // ≤ MST + K·P
    expect(JSON.stringify(digest).length).toBeLessThan(SPATIAL_DIGEST_MAX_BYTES);
  });

  it('SOAK — WATER-PATH pricing: a lane around a peninsula prices the long sail, not the chord', () => {
    const { pack, placements } = makeIsthmusPack();
    const digest = buildSpatialDigest({ pack, placements, seaLanes: true });
    const lanes = activeSeaLanes(digest);
    expect(lanes).toBeTruthy();
    expect(lanes.edges.length).toBe(1); // two island ports, one water body (around the peninsula)
    // The straight-line chord between the ports would UNDER-price the sail; the actual
    // cost reflects the long water path around the peninsula (well above the chord).
    const chordCells = 4; // (0,1)→(4,1) = 4 cells × spacing 50 = 200 units
    const chordCost = Math.round(chordCells * 50 * SEA_COST_PER_DIST);
    expect(lanes.edges[0].cost).toBeGreaterThan(chordCost * 1.5);
  });

  it('SOAK — DISCONNECTED water: an inland river port gets NO lane to a coastal port', () => {
    const { pack, placements } = makeDisconnectedWaterPack();
    const digest = buildSpatialDigest({ pack, placements, seaLanes: true });
    const lanes = activeSeaLanes(digest);
    // The two COASTAL ports share the sea ⇒ a lane; the river port is on separate water ⇒ NO lane.
    expect(lanes).toBeTruthy();
    expect(lanes.ports.sort()).toEqual(['coastA', 'coastB']); // the river port is not connected
    for (const e of lanes.edges) {
      expect(e.between).not.toContain('river'); // no phantom cross-water / cross-land lane
    }
    // No route reaches the river port over water (it is a hermit — geography, not a bug).
    expect(pathCost(digest, 'coastA', 'river')).toBe(digest.distanceMatrix.coastA?.river ?? null);
  });
});

describe('M8 — routing consistency (the v1 model: sea shortcuts trips INVOLVING a port)', () => {
  it('a landlocked↔landlocked pair is LAND-ONLY in BOTH paths — cost(season) is monotone over cost(null)', () => {
    const { digest } = goldenPortDigest();
    const ports = new Set(digest.reserved.seaLanes.ports);
    // Two non-port (landlocked) settlements that are land-reachable to each other.
    const inland = digest.settlementIds.filter((id) => !ports.has(id));
    let a = null; let b = null;
    for (const x of inland) for (const y of inland) {
      if (x < y && digest.distanceMatrix[x]?.[y] != null) { a = x; b = y; break; }
      if (a) break;
    }
    expect(a && b).toBeTruthy();
    const land = digest.distanceMatrix[a][b];
    // Fast path (no season): the frozen LAND distance EXACTLY — no sea shortcut for an inland pair.
    expect(pathCost(digest, a, b)).toBe(land);
    // Seasonal path: still land-based ⇒ monotone (a season only ADDS cost, never a sea shortcut).
    expect(pathCost(digest, a, b, 'winter')).toBeGreaterThanOrEqual(land);
    expect(pathCost(digest, a, b, 'summer')).toBeGreaterThanOrEqual(land);
  });

  it('DOMINATION — a sea lane whose LAND route is already cheaper is NEVER emitted (storm-attribution guard)', () => {
    // A dominated sea lane would let a hop travelled by LAND be charged the sea storm
    // law; pruning it at build time prevents that. Drive the landCost accessor directly.
    const isl = makeIslandPack();
    const cells = isl.pack.cells;
    const pack = { h: cells.h, r: cells.r, c: cells.c, p: cells.p, cellCount: cells.h.length };
    const seeds = isl.placements.map((pl) => ({ id: pl.id, cellId: pl.cellId }));
    const roster = Object.fromEntries(isl.placements.map((pl) => [pl.id, pl.institutions]));
    // Land free ⇒ every water lane is dominated ⇒ NO edge set (dormant).
    expect(buildSeaLanes(pack, seeds, roster, () => 0)).toBeNull();
    // Land unreachable (∞, the island truth) ⇒ the water lane is non-dominated ⇒ emitted.
    expect(buildSeaLanes(pack, seeds, roster, () => Infinity)).toBeTruthy();
  });
});

describe('M8 — ISOLATION INVERSION (an island port is a HUB, not a hermit)', () => {
  it('an island unreachable by LAND becomes reachable + weighted over WATER', () => {
    const { pack, placements } = makeIslandPack();
    const landOnly = buildSpatialDigest({ pack, placements });                 // no sea lanes
    const withSea = buildSpatialDigest({ pack, placements, seaLanes: true });   // sea lanes lit
    // Land-only: the island is a disconnected territory (no route).
    expect(pathCost(landOnly, 'main', 'isle')).toBeNull();
    expect(distanceWeight(landOnly, 'main', 'isle')).toBeCloseTo(0.35, 5); // floored (unreachable)
    // Sea-lit: reachable over water, a finite hop, both are ports.
    expect(pathCost(withSea, 'main', 'isle')).toBeGreaterThan(0);
    expect(hopWeeks(withSea, 'main', 'isle')).toBeGreaterThanOrEqual(1);
    expect(distanceWeight(withSea, 'main', 'isle')).toBeGreaterThan(0.35);
    expect(isPort(withSea, 'main')).toBe(true);
    expect(isPort(withSea, 'isle')).toBe(true);
    // The chosen route runs over the sea lane.
    const routes = candidateRoutes(withSea, 'main', 'isle');
    expect(routes.length).toBe(1);
    expect(routes[0].path).toEqual(['main', 'isle']);
  });
});

describe('M8 — PIRACY = the M1 danger term on the lanes (reuse the scoreRoute seam)', () => {
  it('an embattled (pirate-infested) port raises danger on a sea route through it', () => {
    const { pack, placements } = makeIslandPack();
    const digest = buildSpatialDigest({ pack, placements, seaLanes: true });
    const m = calibration(digest).medianPrimaryHopCost;
    const clean = scoreRoute(['main', 'isle'], { spatialCanonVersion: 1 }, 1200, 1, m);
    const pirate = scoreRoute(['main', 'isle'], {
      spatialCanonVersion: 1,
      spatialLedgers: { embattlement: { isle: { level: 0.8, phase: 'embattled', sinceTick: 0, lastTick: 0 } } },
    }, 1200, 1, m);
    expect(clean.danger).toBe(0);
    expect(pirate.danger).toBeCloseTo(0.8, 5);
    expect(pirate.dangerCost).toBeGreaterThan(0);
    expect(pirate.effectiveCost).toBeGreaterThan(clean.effectiveCost);
  });
});

describe('M8 — STORM SEASON raises the cheap sea route (M3 composes)', () => {
  it('winter storms price up + slow a sea lane; summer is the calm sailing season', () => {
    const { pack, placements } = makeIslandPack();
    const digest = buildSpatialDigest({ pack, placements, seaLanes: true });
    const summer = pathCost(digest, 'main', 'isle', 'summer');
    const winter = pathCost(digest, 'main', 'isle', 'winter');
    expect(winter).toBeGreaterThan(summer);
    expect(hopWeeks(digest, 'main', 'isle', 'winter')).toBeGreaterThan(hopWeeks(digest, 'main', 'isle', 'summer'));
    // Slow, not sever: a winter sea hop is still finite (rescuable).
    expect(Number.isFinite(winter)).toBe(true);
  });
});

describe('M8 — the SHIP-CREW rumor carrier (fast port-to-port, skips the land chain)', () => {
  it('a rumor reaches a sea-only-connected port with NO trade edge between them', () => {
    const { pack, placements } = makeIslandPack();
    const digest = buildSpatialDigest({ pack, placements, seaLanes: true });
    // main → isle is a ship-carrier neighbour.
    expect(seaLaneNeighbourMap(digest).get('main')).toEqual([{ neighbourId: 'isle', edgeId: 'sea.isle.main' }]);
    const worldState = { spatialCanonVersion: 1, spatialDigest: digest, simulationRules: { infoMode: 'perfect_delayed' } };
    const feedEntries = [{
      id: 'ev1', tick: 0, significance: 'major', score: 90, severity: 0.7,
      scope: 'regional', impactKind: 'raid', settlementIds: ['main'], sourceEventId: 'ev1',
    }];
    const out = advanceRumorLedgers({ worldState, feedEntries, graph: { channels: [] }, tick: 0 });
    expect(out.changed).toBe(true);
    // The island port heard it — carried by ship (no land/trade edge exists).
    const isleLedger = out.next.isle;
    expect(isleLedger).toBeTruthy();
    const record = Object.values(isleLedger)[0];
    expect(record.carrier).toBe(RUMOR_CARRIER_SHIP);
    expect(record.framing).toContain('ship');
    expect(record.arrivalTick).toBe(hopWeeks(digest, 'main', 'isle')); // fast lane latency
  });

  it('the ship lane is dormant on a pre-M8 (seaLanes-null) digest ⇒ no ship relays', () => {
    const pack = makeGridPack({ cols: 18, rows: 14 });
    const digest = buildSpatialDigest({ pack, placements: placeSettlements(pack, 5) }); // no sea lanes
    expect([...seaLaneNeighbourMap(digest).keys()].length).toBe(0);
  });
});

describe('M8 — REFUGEE SEA PASSAGE (a sea-reachable port joins M4 destination choice)', () => {
  it('a sea-only destination is now a reachable migration candidate (the funded sail)', () => {
    const { pack, placements } = makeIslandPack();
    const landOnly = buildSpatialDigest({ pack, placements });
    const withSea = buildSpatialDigest({ pack, placements, seaLanes: true });
    // migrationKernel filters reachable destinations by `pathCost(digest, origin, dest) != null`.
    // Land-only: the island is NOT a candidate; sea-lit: it IS (refugees take ship).
    expect(pathCost(landOnly, 'main', 'isle')).toBeNull();
    expect(pathCost(withSea, 'main', 'isle')).toBeGreaterThan(0);
  });
});

describe('M8 — NAVAL BLOCKADE parity (a port needs BOTH land AND sea cut to starve)', () => {
  // A besieged port with a LAND producer and a SEA producer. Cutting land alone
  // leaves the sea feeding it (not starving); cutting the sea TOO starves it — the
  // "land AND sea" rule, emergent through the supply layer's sea routing.
  function portSupplyDigest() {
    // Mainland cols 0..2 (land-connected), ocean col 3, island cols 4..5.
    const cols = 6, rows = 3, n = cols * rows;
    const h = new Array(n), biome = new Array(n).fill(4), r = new Array(n).fill(0), p = new Array(n), c = new Array(n);
    const idx = (col, row) => row * cols + col;
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const i = idx(col, row); p[i] = [col * 50, row * 50]; h[i] = col === 3 ? 10 : 40;
    }
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const i = idx(col, row); const nb = [];
      if (col > 0) nb.push(idx(col - 1, row)); if (col < cols - 1) nb.push(idx(col + 1, row));
      if (row > 0) nb.push(idx(col, row - 1)); if (row < rows - 1) nb.push(idx(col, row + 1));
      c[i] = nb;
    }
    const placements = [
      { id: 'port', cellId: idx(2, 1), institutions: DOCK },      // besieged coastal port
      { id: 'seasrc', cellId: idx(4, 1), institutions: DOCK },    // island producer (sea only)
      { id: 'landsrc', cellId: idx(0, 1), institutions: [] },     // mainland producer (land only, no dock)
    ];
    return buildSpatialDigest({ pack: { cells: { h, biome, r, p, c } }, placements, seaLanes: true });
  }

  function starving(digest, severed) {
    const rankedSources = rankSupplySources(digest, 'port', ['landsrc', 'seasrc']);
    const worldState = { spatialCanonVersion: 1, spatialDigest: digest };
    const links = [{ settlementId: 'port', institutionId: 'smithy', input: 'iron', rankedSources, bufferWeeks: 0, critical: true }];
    const out = advanceSupplyShipments({
      links, worldState, digest, tick: 5,
      sourceSeveredFor: (_dest, srcId) => severed.has(srcId),
      hostileToDestinationFor: () => false,
      riskToleranceFor: () => 1,
    });
    return supplyInterdictionLevel(out.next ? { spatialCanonVersion: 1, spatialLedgers: { supplyShipments: out.next } } : { spatialCanonVersion: 1 }, 'port');
  }

  it('both sources reachable (land + sea); land cut alone ⇒ sea feeds it; land AND sea cut ⇒ starves', () => {
    const digest = portSupplyDigest();
    // The port can reach BOTH producers (one by land, one by sea).
    const ranked = rankSupplySources(digest, 'port', ['landsrc', 'seasrc']).map((r) => r.sourceId).sort();
    expect(ranked).toEqual(['landsrc', 'seasrc']);
    expect(starving(digest, new Set())).toBe(0);                 // fed
    expect(starving(digest, new Set(['landsrc']))).toBe(0);      // land cut — the SEA keeps it fed
    expect(starving(digest, new Set(['landsrc', 'seasrc']))).toBe(1); // land AND sea cut — starves
  });
});

describe('M8 — the seaLanes SLOT mints no battle (W-NAVY fleet combat lives elsewhere) + DORMANT byte-identity', () => {
  it('the seaLanes SLOT stays battle-free + byte-frozen — fleet combat rides navalTransit, NOT this slot', () => {
    // SCOPE SUPERSESSION (W-NAVY, design §0): the owner's naval laws superseded M8's
    // "NO FLEET COMBAT" boundary — but HOW honors this frozen slot. The seaLanes slot
    // itself still mints NO battle/combat structure (its exact keys are byte-frozen below);
    // convoys, sea battles, and blockades live in the NAVAL LAYER's separate
    // spatialLedgers.navalTransit ledger, never here. This assertion is UNCHANGED.
    const { digest } = goldenPortDigest();
    const lanes = digest.reserved.seaLanes;
    expect(Object.keys(lanes).sort()).toEqual(['edges', 'ports', 'stormSeasonCost', 'version']);
    for (const e of lanes.edges) expect(Object.keys(e).sort()).toEqual(['between', 'capacity', 'cost']);
  });

  it('a seaLanes-null digest reads NO lanes (the sea reads are inert)', () => {
    const pack = makeGridPack({ cols: 18, rows: 14 });
    const digest = buildSpatialDigest({ pack, placements: placeSettlements(pack, 6) }); // dormant
    expect(activeSeaLanes(digest)).toBeNull();
    expect(isPort(digest, 's000')).toBe(false);
    expect(seaLaneNeighbourMap(digest).size).toBe(0);
    // pathCost/hopWeeks fall to the frozen land reads exactly.
    const withSeasonNull = pathCost(digest, 's000', 's001');
    expect(withSeasonNull).toBe(digest.distanceMatrix.s000?.s001 ?? withSeasonNull);
  });

  it('buildSeaLanes returns null below the 2-port floor (dormancy floor)', () => {
    const pack = makeGridPack({ cols: 12, rows: 10 });
    const cells = { ...pack.cells, cellCount: pack.cells.h.length };
    expect(buildSeaLanes(cells, [{ id: 'a', cellId: 6 }], { a: DOCK })).toBeNull();
    expect(buildSeaLanes(cells, [], {})).toBeNull();
  });
});
