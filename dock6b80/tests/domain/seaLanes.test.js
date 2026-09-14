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
  portPartnerAdvisory,
  PORT_ADVISORY_KINDS,
  PORT_ADVISORY_PHRASE,
  hasWaterAccessInstitution,
  waterAccessInstitutionNames,
  isCoastalCell,
  isRiverCell,
  buildSeaLanes,
  SEA_LANE_CAPACITY,
  SEA_COST_PER_DIST,
  SEA_LANE_VERSION,
  MIN_NAVIGABLE_FLUX,
  GREAT_RIVER_FLUX,
  RIVER_BANDS,
  hasFluxEvidence,
  riverBandOf,
  isNavigableBand,
  isNavigableWater,
  isOpenWater,
  navigableWaterComponents,
  frameTouchTest,
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

describe('W-CAP CAP-2 — RIVER NAVIGABILITY: a trickle is not a harbour', () => {
  // A 4-cell hand-built river reach at ascending flux, so every band is reachable from
  // ONE fixture and the cuts are read rather than inferred. All land, all on the river.
  const reach = (fluxes) => ({
    h: fluxes.map(() => 40),
    r: fluxes.map(() => 1),
    fl: [...fluxes],
    c: fluxes.map((_, i) => [i - 1, i + 1].filter((v) => v >= 0 && v < fluxes.length)),
    cellCount: fluxes.length,
  });

  it('the bands cut where FMG cuts: navigable at MIN_NAVIGABLE_FLUX, great at the width shoulder', () => {
    // 100 is FMG's own burg classifier (`cells.r[i] && cells.fl[i] >= 100` ⇒ a River burg),
    // and the great-river shoulder is where FMG's river renderer saturates its width.
    expect(MIN_NAVIGABLE_FLUX).toBe(100);
    expect(GREAT_RIVER_FLUX).toBe(7173);
    const pack = reach([0, 99, 100, GREAT_RIVER_FLUX]);
    expect(hasFluxEvidence(pack)).toBe(true);
    expect(riverBandOf(pack, 0, true)).toBe('stream');
    expect(riverBandOf(pack, 1, true)).toBe('stream');       // 99 — one short, still a trickle
    expect(riverBandOf(pack, 2, true)).toBe('river');        // exactly at the cut
    expect(riverBandOf(pack, 3, true)).toBe('great_river');
    // Only `stream` denies a hull; the vocabulary is closed and every member is used.
    expect(isNavigableBand('stream')).toBe(false);
    expect(isNavigableBand('river')).toBe(true);
    expect(isNavigableBand('great_river')).toBe(true);
    expect(isNavigableBand('unknown')).toBe(true);
    expect(isNavigableBand(null)).toBe(false);               // not on a river at all
    for (const band of ['stream', 'river', 'great_river', 'unknown']) {
      expect(RIVER_BANDS).toContain(band);
    }
  });

  it('a cell OFF the river has no band at all — null, not a bucket', () => {
    const pack = { ...reach([500, 500]), r: [0, 0] };
    expect(riverBandOf(pack, 0, true)).toBeNull();
    // …and dry land below LAND_HEIGHT is not a river either, whatever r says.
    const ocean = { ...reach([500]), h: [10] };
    expect(riverBandOf(ocean, 0, true)).toBeNull();
  });

  it('a dock on a STREAM is not a port; the SAME dock on a navigable reach is', () => {
    // The whole point of the car. Before CAP-2 both of these were ports, and the one on
    // the trickle was granted cheap high-capacity lanes to the open sea.
    const pack = reach([40, 4000]);
    const seeds = [{ id: 'trickle', cellId: 0 }, { id: 'reach', cellId: 1 }];
    const rows = derivePortEligibility(pack, seeds, { trickle: DOCK, reach: DOCK });
    const by = Object.fromEntries(rows.map((r) => [r.id, r]));
    expect(by.trickle.river).toBe(true);           // geography unchanged: it IS on a river
    expect(by.trickle.waterAccess).toBe(true);     // capability unchanged: it HAS a dock
    expect(by.trickle.riverBand).toBe('stream');
    expect(by.trickle.navigable).toBe(false);
    expect(by.trickle.port).toBe(false);           // …and yet no port, which is the change
    expect(by.reach.riverBand).toBe('river');
    expect(by.reach.port).toBe(true);
  });

  it('a COASTAL seat is untouched by flux — the sea is the sea', () => {
    // Only a river-ONLY seat can lose eligibility. A shore settlement whose creek is a
    // trickle still faces open water, and no flux reading bears on that.
    const pack = {
      h: [10, 40],                 // cell 0 ocean, cell 1 the shore
      r: [0, 1],                   // the shore cell also carries a trickle
      fl: [0, 3],
      c: [[1], [0]],
      cellCount: 2,
    };
    const rows = derivePortEligibility(pack, [{ id: 'shore', cellId: 1 }], { shore: DOCK });
    expect(rows[0].coastal).toBe(true);
    expect(rows[0].riverBand).toBe('stream');      // its creek IS a trickle…
    expect(rows[0].navigable).toBe(true);          // …and it is still a port
    expect(rows[0].port).toBe(true);
  });

  it('ABSENT flux degrades to the pre-CAP `r != 0` rule, band `unknown`', () => {
    // "Absent `fl` in old fixtures degrades to today's rule" — spelled as: no evidence
    // is not evidence of absence, so nothing loses eligibility for want of a field the
    // capture did not carry.
    const pack = { h: [40], r: [1], c: [[]], cellCount: 1 }; // no fl key at all
    expect(hasFluxEvidence(pack)).toBe(false);
    expect(riverBandOf(pack, 0, false)).toBe('unknown');
    const rows = derivePortEligibility(pack, [{ id: 'old', cellId: 0 }], { old: DOCK });
    expect(rows[0].riverBand).toBe('unknown');
    expect(rows[0].port).toBe(true);
  });

  it('an ALL-ZERO flux array degrades too — the evidence test is PER-PACK, not per-cell', () => {
    // FMG's own heightmap editor resets `pack.cells.fl` to a zero Uint16Array while the
    // river ids survive (heightmap-editor.js:371), so this pack is real. A per-cell test
    // would read every 0 as "a stream" and silently demote EVERY river port on the map —
    // a behaviour cliff triggered by an absent input rather than a measured one.
    const pack = reach([0, 0, 0]);
    expect(hasFluxEvidence(pack)).toBe(false);
    const rows = derivePortEligibility(pack, [{ id: 'a', cellId: 0 }, { id: 'b', cellId: 1 }],
      { a: DOCK, b: DOCK });
    expect(rows.map((r) => r.riverBand)).toEqual(['unknown', 'unknown']);
    expect(rows.every((r) => r.port)).toBe(true);
    // A ragged tail is the same story: past the end of fl is unknown, not a trickle.
    const ragged = { ...reach([500, 500, 500]), fl: [500] };
    expect(hasFluxEvidence(ragged)).toBe(true);
    expect(riverBandOf(ragged, 0, true)).toBe('river');
    expect(riverBandOf(ragged, 2, true)).toBe('unknown');
  });

  it('the slot stamps version 2 and its KEY SHAPE is unchanged (a law bump, not a schema break)', () => {
    const { digest } = goldenPortDigest();
    expect(SEA_LANE_VERSION).toBe(2);
    expect(digest.reserved.seaLanes.version).toBe(2);
    // The v1 shape pin, restated here: a version bump must not smuggle a key.
    expect(Object.keys(digest.reserved.seaLanes).sort())
      .toEqual(['edges', 'ports', 'stormSeasonCost', 'version']);
  });

  it('the CAPTURED fixture demotes its stream ports and keeps its navigable ones', () => {
    // End to end through the real digest builder, on the fixture pack's own river row
    // (flux rises west→east at 25/column, so the cut at 100 falls at column 4).
    const pack = makeGridPack({ cols: 24, rows: 18, capture: true });
    const riverRow = 9;
    const seat = (col) => riverRow * 24 + col;
    const seeds = [{ id: 'head', cellId: seat(1) }, { id: 'mouth', cellId: seat(20) }];
    const rows = derivePortEligibility(
      { ...pack.cells, cellCount: pack.cells.h.length },
      seeds,
      { head: DOCK, mouth: DOCK },
    );
    const by = Object.fromEntries(rows.map((r) => [r.id, r]));
    expect(by.head.riverBand, 'column 1 carries flux 25 — a trickle').toBe('stream');
    expect(by.head.port).toBe(false);
    expect(by.mouth.riverBand, 'column 20 carries flux 500').toBe('river');
    expect(by.mouth.port).toBe(true);
    // …and with the SAME geometry but no captured flux, both are ports again.
    const plain = makeGridPack({ cols: 24, rows: 18 });
    const plainRows = derivePortEligibility(
      { ...plain.cells, cellCount: plain.cells.h.length }, seeds, { head: DOCK, mouth: DOCK },
    );
    expect(plainRows.every((r) => r.port)).toBe(true);
  });
});

describe('W-CAP CAP-4 / D2 — ONE water flood-fill home, two views', () => {
  // D2 rules a single flood-fill home producing BOTH views, "never a third ad-hoc BFS".
  // These arms pin that the SAILING view is the one the sea lanes still use, that the two
  // views genuinely differ, and that the move changed no behaviour.
  it('the sailing view still labels navigable water — ocean AND river course, one component', () => {
    const pack = makeGridPack({ cols: 24, rows: 18 });
    const cells = { ...pack.cells, cellCount: pack.cells.h.length };
    const comp = navigableWaterComponents(cells);
    expect(comp.length).toBe(cells.cellCount);
    // The bay is water; a mid-river land cell is navigable too (that is the sailing view).
    expect(comp[0]).toBeGreaterThanOrEqual(0);
    expect(isNavigableWater(cells, 216)).toBe(true);       // on the river course
    expect(comp[216]).toBeGreaterThanOrEqual(0);
    // Land off the river belongs to no water component.
    const dryLand = cells.h.findIndex((h, i) => h >= 20 && Number(cells.r[i]) === 0);
    expect(comp[dryLand]).toBe(-1);
  });

  it('the OPEN-WATER view excludes rivers — otherwise a lake\'s outflow would weld it to the sea', () => {
    // The two views are not interchangeable and this is the reason: a river running out of
    // an interior lake reads as navigable water, so the sailing view would join lake and
    // ocean into one component and every lake on a drained continent would read as sea.
    const pack = makeGridPack({ cols: 24, rows: 18 });
    const cells = { ...pack.cells, cellCount: pack.cells.h.length };
    expect(isNavigableWater(cells, 216)).toBe(true);   // a river cell IS sailable…
    expect(isOpenWater(cells, 216)).toBe(false);       // …and is NOT a body of water
    // Ocean is both.
    expect(isNavigableWater(cells, 0)).toBe(true);
    expect(isOpenWater(cells, 0)).toBe(true);
  });

  it('the frame test errs toward OCEAN — a body it cannot prove interior is not a lake', () => {
    const pack = makeGridPack({ cols: 24, rows: 18 });
    const cells = { ...pack.cells, cellCount: pack.cells.h.length };
    const touches = frameTouchTest(cells);
    expect(touches(0), 'the corner cell touches the frame').toBe(true);
    const mid = Math.floor(cells.cellCount / 2) + 5;
    expect(touches(mid), 'a mid-map cell does not').toBe(false);
    // A degenerate pack cannot prove ANYTHING interior, so everything is frame — which is
    // the silent direction (no fabricated lakes), not the loud one.
    const degenerate = frameTouchTest({ p: [], cellCount: 0 });
    expect(degenerate(0)).toBe(true);
  });

  it('the extraction changed NO sea-lane behaviour — the golden port digest is intact', () => {
    // The behavioural half of "extract, don't duplicate": seaLanes now imports the shared
    // labeller, and its output must be what it was. (The byte-level half is the raw-byte
    // pin block in spatialDigest.invariants.)
    const { digest } = goldenPortDigest();
    expect(digest.reserved.seaLanes).toBeTruthy();
    expect(digest.reserved.seaLanes.ports.length).toBe(5);
    expect(digest.reserved.seaLanes.edges.length).toBe(4);
    // …and the reachability constraint the shared labeller enforces still holds: the
    // disconnected-water pack gets NO lane between its sea and its separate river.
    const dw = makeDisconnectedWaterPack();
    const lanes = buildSpatialDigest({ pack: dw.pack, placements: dw.placements, seaLanes: true })
      .reserved.seaLanes;
    expect(lanes.ports).toEqual(['coastA', 'coastB']);
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

// ── WEAVE ST-4 · the two-endpoint advisory ──────────────────────────────────
describe('ST-4 — the harbours the sea graph leaves without a partner', () => {
  it('⛔ the FROZEN CANON cannot answer this question, which is why the advisory is not a digest read', () => {
    // THE FINDING THIS CAR EXISTS ON. `buildSeaLaneSet` closes with
    //   const connected = [...new Set(edges.flatMap((e) => e.between))].sort();
    // and returns THAT as `ports`. An eligible harbour with no counterpart is
    // therefore erased from the canon: absent from `ports`, false to `isPort`,
    // indistinguishable downstream from a landlocked village. This is that erasure,
    // executed, on a realm built to contain one.
    //
    // The DISCONNECTED-WATER realm holds exactly the case: two dock settlements on the
    // ocean strip, and a third on a river that never reaches it. All three are eligible
    // harbours; only the two that share a water body can ever be given a partner.
    const { pack, placements } = makeDisconnectedWaterPack();
    const cells = { ...pack.cells, cellCount: pack.cells.h.length };
    const roster = Object.fromEntries(placements.map(pl => [pl.id, pl.institutions]));
    const eligibility = derivePortEligibility(cells, placements, roster);
    const lanes = buildSeaLanes(cells, placements, roster, () => Infinity);
    const advisory = portPartnerAdvisory(eligibility, lanes);

    // The fixture really does hold the case — anti-vacuity before the claim.
    expect(advisory.harbours).toEqual(['coastA', 'coastB', 'river']);
    expect(advisory.unpartnered).toEqual(['river']);
    // …and the erasure: the stranded harbour is eligible in the derivation and ABSENT
    // from the lane set's port roster, which is the ONLY place the canon looks.
    const canonPorts = new Set((lanes?.ports || []).map(String));
    for (const id of advisory.unpartnered) {
      expect(eligibility.find(row => row.id === id)?.port).toBe(true);
      expect(canonPorts.has(id)).toBe(false);
    }
    // The whole point, said as the canon says it: a digest built from this realm calls
    // the river seat NOT A PORT, which is indistinguishable from a landlocked village.
    expect(canonPorts).toEqual(new Set(['coastA', 'coastB']));
    // The two halves partition the harbours exactly — no seat is counted twice and
    // none is dropped, which is what makes the advisory a totality rather than a list.
    expect([...advisory.partnered, ...advisory.unpartnered].sort()).toEqual(advisory.harbours);
  });

  it('speaks in world words from a closed vocabulary, and says nothing where there is nothing to say', () => {
    const { pack, placements } = goldenPortDigest();
    const roster = Object.fromEntries(placements.map(p => [p.id, p.institutions || []]));
    const cells = { ...pack.cells, cellCount: pack.cells.h.length };
    const eligibility = derivePortEligibility(cells, placements, roster);
    const lanes = buildSeaLanes(cells, placements, roster, () => Infinity);
    const advisory = portPartnerAdvisory(eligibility, lanes);

    for (const row of advisory.rows) {
      expect(PORT_ADVISORY_KINDS).toContain(row.kind);
      expect(row.phrase).toBe(PORT_ADVISORY_PHRASE[row.kind]);
      // §754.3: world words. A DM reads a sentence, not an engine reading.
      // anchored: the exact-phrase toBe two lines up pins the whole string, so this cannot pass by the phrase having gone missing or empty
      expect(row.phrase).not.toMatch(/[0-9]/);
      expect(advisory.unpartnered).toContain(row.id);
    }
    expect(advisory.rows).toHaveLength(advisory.unpartnered.length);
  });

  it('a DORMANT lane set makes EVERY harbour unpartnered, which is the useful answer', () => {
    // No water lane beat land anywhere ⇒ `buildSeaLaneSet` returns null and the canon
    // records no ports at all. That is not "no harbours"; it is "no harbour got a
    // partner", and the advisory says the second because the second is true.
    const { pack, placements } = goldenPortDigest();
    const roster = Object.fromEntries(placements.map(p => [p.id, p.institutions || []]));
    const cells = { ...pack.cells, cellCount: pack.cells.h.length };
    const eligibility = derivePortEligibility(cells, placements, roster);
    const eligible = eligibility.filter(row => row.port).map(row => row.id).sort();
    expect(eligible.length).toBeGreaterThan(0);

    // Land is free everywhere ⇒ every candidate lane is dominated and pruned.
    const dormant = portPartnerAdvisory(eligibility, buildSeaLanes(cells, placements, roster, () => 0));
    expect(dormant.harbours).toEqual(eligible);
    expect(dormant.partnered).toEqual([]);
    expect(dormant.unpartnered).toEqual(eligible);
    // Anti-vacuity: with land EXPENSIVE the same realm partners them, so the result
    // above is the domination prune and not a broken derivation.
    const live = portPartnerAdvisory(eligibility, buildSeaLanes(cells, placements, roster, () => Infinity));
    expect(live.partnered.length).toBeGreaterThan(0);
  });

  it('is total on nothing at all', () => {
    for (const [e, l] of [[null, null], [undefined, undefined], [[], null], [[{ id: 'a', port: false }], null]]) {
      const a = portPartnerAdvisory(e, l);
      expect(a.harbours).toEqual([]);
      expect(a.rows).toEqual([]);
    }
  });
});
