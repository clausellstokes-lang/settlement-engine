/**
 * seasonalOverlayGolden.test.js — the committed SEASONS-B (M3) overlay digest
 * GOLDEN (a NEW golden, distinct from spatialDigestGolden's overlay-null pin).
 *
 * The SAME fixed fixture map as spatialDigestGolden, but canonized WITH the
 * seasonal-road overlay lit (`seasonalRoads:true`) ⇒ a sha256-pinned digest that
 * carries the frozen per-season × per-terrain cost law under overlayVersion 2.
 * A change to the overlay table, its version, the slot shape, or the underlying
 * geometry trips this. Because the digest is a pure function of the frozen pack +
 * placements + the frozen overlay, the hash is stable across machines and runs.
 *
 * This is the wave's reviewed NEW golden — the EXISTING spatialDigestGolden (the
 * overlay-null canon) is untouched + byte-identical (dormancy).
 *
 * Capture/refresh (only for an APPROVED overlay change):
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/seasonalOverlayGolden.test.js
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'seasonal-overlay-golden.json');
const UPDATE = process.env.UPDATE_GOLDEN === '1';

function goldenDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, 8);
  return buildSpatialDigest({ pack, placements, seasonalRoads: true, overlayVersion: 2 });
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

describe('SEASONS-B — seasonal overlay digest golden', () => {
  it('the fixed fixture map hashes to the committed overlay digest', () => {
    const digest = goldenDigest();
    const hash = hashOf(digest);
    const record = {
      hash,
      settlements: digest.settlementIds.length,
      cellCount: digest.cellCount,
      gates: digest.gates.length,
      overlayVersion: digest.overlayVersion,
      seasonalOverlayVersion: digest.reserved.seasonalOverlay.version,
      bytes: JSON.stringify(digest).length,
    };
    if (UPDATE || !existsSync(MANIFEST)) {
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, Object.keys(record).sort(), 2) + '\n');
    }
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(hash).toBe(pinned.hash);
    expect(record.settlements).toBe(pinned.settlements);
    expect(record.gates).toBe(pinned.gates);
    expect(record.overlayVersion).toBe(2);
    expect(record.seasonalOverlayVersion).toBe(2);
  });

  it('the overlay golden is reproducible — a second build hashes identically', () => {
    expect(hashOf(goldenDigest())).toBe(hashOf(goldenDigest()));
  });

  it('the seasonal overlay canon leaves the OTHER reserved slots null + geometry versions unchanged', () => {
    const d = goldenDigest();
    expect(d.spatialGeometryVersion).toBe(1); // geometry is unchanged by the overlay
    expect(d.costLawVersion).toBe(1);          // the BASE cost law is unchanged
    expect(d.reserved.airField).toBeNull();
    expect(d.reserved.seaLanes).toBeNull();
    expect(d.reserved.teleportEdges).toBeNull();
  });
});
