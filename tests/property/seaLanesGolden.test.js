/**
 * seaLanesGolden.test.js — the committed SEA LANES (M8) digest GOLDEN (a NEW golden,
 * distinct from spatialDigestGolden's seaLanes-null pin).
 *
 * A fixed fixture map with coastal + river PORTS (settlements on navigable water
 * carrying a water-access institution) canonized WITH the sea lanes lit
 * (`seaLanes:true`) ⇒ a sha256-pinned digest that carries the frozen port set +
 * cheap high-capacity water edge set + storm-season law under the reserved seaLanes
 * slot (version 1). A change to the port-derivation rule, the sea cost constants,
 * the storm table, the slot shape, or the underlying geometry trips this. Because
 * the digest is a pure function of the frozen pack + placements (+ their roster),
 * the hash is stable across machines and runs.
 *
 * This is the wave's reviewed NEW golden — the EXISTING spatialDigestGolden +
 * seasonalOverlayGolden (the seaLanes-null canons) are untouched + byte-identical
 * (dormancy).
 *
 * Capture/refresh (only for an APPROVED sea-lane change):
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/seaLanesGolden.test.js
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placePortSettlements } from '../fixtures/spatialPackFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'sea-lanes-golden.json');
const UPDATE = process.env.UPDATE_GOLDEN === '1';

function goldenDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placePortSettlements(pack, { nCoastal: 3, nRiver: 2, nInland: 3 });
  return buildSpatialDigest({ pack, placements, seaLanes: true });
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

describe('SEA LANES — sea-lane digest golden', () => {
  it('the fixed fixture map hashes to the committed sea-lane digest', () => {
    const digest = goldenDigest();
    const hash = hashOf(digest);
    const seaLanes = digest.reserved.seaLanes;
    const record = {
      hash,
      settlements: digest.settlementIds.length,
      cellCount: digest.cellCount,
      gates: digest.gates.length,
      ports: seaLanes.ports.length,
      edges: seaLanes.edges.length,
      seaLaneVersion: seaLanes.version,
      bytes: JSON.stringify(digest).length,
    };
    if (UPDATE) {
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, Object.keys(record).sort(), 2) + '\n');
    }
    // Fail-closed ([test-quality-3]): a missing manifest must NOT self-mint a fresh
    // green pin. A merge/checkout that drops the fixture reds here — with regen
    // instructions — instead of laundering drift into a new pin.
    expect(
      existsSync(MANIFEST),
      'sea-lanes-golden.json missing — for an APPROVED change run: UPDATE_GOLDEN=1 npx vitest run tests/property/seaLanesGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(hash).toBe(pinned.hash);
    expect(record.settlements).toBe(pinned.settlements);
    expect(record.ports).toBe(pinned.ports);
    expect(record.edges).toBe(pinned.edges);
    expect(record.seaLaneVersion).toBe(1);
  });

  it('the sea-lane golden is reproducible — a second build hashes identically', () => {
    expect(hashOf(goldenDigest())).toBe(hashOf(goldenDigest()));
  });

  it('the sea-lane canon leaves the OTHER reserved slots null + geometry versions unchanged', () => {
    const d = goldenDigest();
    // Sea lanes are a SEPARATE edge set: the frozen land geometry + cost law + the
    // seasonal overlay axis are all unchanged by lighting them.
    expect(d.spatialGeometryVersion).toBe(1);
    expect(d.costLawVersion).toBe(1);
    expect(d.overlayVersion).toBe(1); // this golden opts into seaLanes ONLY (not seasonalRoads)
    expect(d.reserved.airField).toBeNull();
    expect(d.reserved.seasonalOverlay).toBeNull();
    expect(d.reserved.teleportEdges).toBeNull();
    // The seaLanes slot itself is populated: ≥2 ports + a SPARSE, water-reachability-
    // constrained edge set (not the O(P²) clique — the size fix).
    expect(d.reserved.seaLanes).toBeTruthy();
    expect(d.reserved.seaLanes.ports.length).toBeGreaterThanOrEqual(2);
    expect(d.reserved.seaLanes.edges.length).toBeGreaterThan(0);
    expect(d.reserved.seaLanes.edges.length).toBeLessThanOrEqual(
      (d.reserved.seaLanes.ports.length * (d.reserved.seaLanes.ports.length - 1)) / 2,
    );
    expect(d.reserved.seaLanes.stormSeasonCost.winter).toBeGreaterThan(d.reserved.seaLanes.stormSeasonCost.summer);
  });

  it('the SAME fixture map WITHOUT the opt-in keeps seaLanes null (byte-frozen dormancy)', () => {
    const pack = makeGridPack({ cols: 24, rows: 18 });
    const placements = placePortSettlements(pack, { nCoastal: 3, nRiver: 2, nInland: 3 });
    const dormant = buildSpatialDigest({ pack, placements }); // no seaLanes opt-in
    expect(dormant.reserved.seaLanes).toBeNull();
  });
});
