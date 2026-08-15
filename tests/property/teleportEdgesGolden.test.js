/**
 * teleportEdgesGolden.test.js — the committed TELEPORT BLOCS (M9c) digest GOLDEN (a NEW
 * golden, distinct from spatialDigestGolden's teleportEdges-null pin).
 *
 * A fixed fixture map with teleport-CIRCLE settlements (settlements carrying a
 * teleport-capable institution) canonized WITH the teleport bloc lit (`teleport:true`)
 * ⇒ a sha256-pinned digest that carries the frozen circle-holder node set + the clique
 * edge set under the reserved teleportEdges slot (version 1). A change to the
 * capability-derivation rule, the edge cost/capacity constants, the clique topology, the
 * slot shape, or the underlying geometry trips this. Because the digest is a pure
 * function of the frozen pack + placements (+ their roster), the hash is stable across
 * machines and runs.
 *
 * This is the wave's reviewed NEW golden — the EXISTING spatialDigestGolden +
 * seasonalOverlayGolden + seaLanesGolden (the teleportEdges-null canons) are untouched +
 * byte-identical (dormancy).
 *
 * Capture/refresh (only for an APPROVED teleport change):
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/teleportEdgesGolden.test.js
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeTeleportSettlements } from '../fixtures/spatialPackFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'teleport-edges-golden.json');
const UPDATE = process.env.UPDATE_GOLDEN === '1';

function goldenDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeTeleportSettlements(pack, { nCircle: 4, nPlain: 4 });
  return buildSpatialDigest({ pack, placements, teleport: true });
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

describe('TELEPORT BLOCS — teleport-edge digest golden', () => {
  it('the fixed fixture map hashes to the committed teleport digest', () => {
    const digest = goldenDigest();
    const hash = hashOf(digest);
    const teleport = digest.reserved.teleportEdges;
    const record = {
      hash,
      settlements: digest.settlementIds.length,
      cellCount: digest.cellCount,
      gates: digest.gates.length,
      nodes: teleport.nodes.length,
      edges: teleport.edges.length,
      teleportVersion: teleport.version,
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
      'teleport-edges-golden.json missing — for an APPROVED change run: UPDATE_GOLDEN=1 npx vitest run tests/property/teleportEdgesGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(hash).toBe(pinned.hash);
    expect(record.settlements).toBe(pinned.settlements);
    expect(record.nodes).toBe(pinned.nodes);
    expect(record.edges).toBe(pinned.edges);
    expect(record.teleportVersion).toBe(1);
  });

  it('the teleport golden is reproducible — a second build hashes identically', () => {
    expect(hashOf(goldenDigest())).toBe(hashOf(goldenDigest()));
  });

  it('the teleport canon leaves the OTHER reserved slots null + geometry versions unchanged', () => {
    const d = goldenDigest();
    // Teleport is a SEPARATE edge set: the frozen land geometry + cost law + the seasonal
    // overlay + sea axes are all unchanged by lighting it.
    expect(d.spatialGeometryVersion).toBe(1);
    expect(d.costLawVersion).toBe(1);
    expect(d.overlayVersion).toBe(1); // this golden opts into teleport ONLY
    expect(d.reserved.airField).toBeNull();
    expect(d.reserved.seasonalOverlay).toBeNull();
    expect(d.reserved.seaLanes).toBeNull();
    // The teleportEdges slot itself is populated: ≥2 circle-holders + the CLIQUE edge
    // set (exactly N(N-1)/2 for N holders — the clique of the willing).
    const t = d.reserved.teleportEdges;
    expect(t).toBeTruthy();
    expect(t.nodes.length).toBe(4);
    expect(t.edges.length).toBe((t.nodes.length * (t.nodes.length - 1)) / 2);
    // Every edge is the cheapest possible (collapsed distance) + bounded capacity.
    expect(t.edges.every(e => e.cost >= 1)).toBe(true);
    expect(t.edges.every(e => e.capacity >= 1)).toBe(true);
  });

  it('the SAME fixture map WITHOUT the opt-in keeps teleportEdges null (byte-frozen dormancy)', () => {
    const pack = makeGridPack({ cols: 24, rows: 18 });
    const placements = placeTeleportSettlements(pack, { nCircle: 4, nPlain: 4 });
    const dormant = buildSpatialDigest({ pack, placements }); // no teleport opt-in
    expect(dormant.reserved.teleportEdges).toBeNull();
  });
});
