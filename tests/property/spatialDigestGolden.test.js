/**
 * spatialDigestGolden.test.js — the committed KEYSTONE digest GOLDEN (§V.5).
 *
 * One fixed fixture map (a deterministic synthetic pack — see spatialPackFixtures)
 * ⇒ a sha256-pinned spatial digest. A tuning-constant nudge in the cost table, a
 * quantization-scale change, a tie-break drift, a Dijkstra/territory bug, or a
 * schema/key-order change trips this. Because the digest is a pure function of the
 * frozen pack + placements (no iframe, no Date, no rng), the hash is stable across
 * machines and runs.
 *
 * Capture/refresh (only for an APPROVED digest change):
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/spatialDigestGolden.test.js
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'spatial-digest-golden.json');
const UPDATE = process.env.UPDATE_GOLDEN === '1';

// The fixed golden map: a mid-size terrain grid with 8 dispersed settlements —
// enough to exercise territory boundaries, multi-hop routes, gates, and every
// terrain class, but small enough to keep the fixture legible.
function goldenDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, 8);
  return buildSpatialDigest({ pack, placements });
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

describe('KEYSTONE — spatial digest golden', () => {
  it('the fixed fixture map hashes to the committed digest', () => {
    const digest = goldenDigest();
    const hash = hashOf(digest);
    // Legible metadata beside the hash so a diff shows WHAT the pin covers.
    const record = {
      hash,
      settlements: digest.settlementIds.length,
      cellCount: digest.cellCount,
      landCellCount: digest.landCellCount,
      gates: digest.gates.length,
      spatialGeometryVersion: digest.spatialGeometryVersion,
      costLawVersion: digest.costLawVersion,
      overlayVersion: digest.overlayVersion,
      bytes: JSON.stringify(digest).length,
    };
    if (UPDATE) {
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, Object.keys(record).sort(), 2) + '\n');
    }
    // Fail-closed ([test-quality-3]): a missing manifest must NOT self-mint a fresh
    // green pin. A merge/checkout that drops the fixture reds here — with regen
    // instructions — instead of laundering digest/cost-law drift into a new pin.
    expect(
      existsSync(MANIFEST),
      'spatial-digest-golden.json missing — for an APPROVED digest change run: UPDATE_GOLDEN=1 npx vitest run tests/property/spatialDigestGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(hash).toBe(pinned.hash);
    // The meta guards against a silent shape drift that happened to re-hash.
    expect(record.settlements).toBe(pinned.settlements);
    expect(record.cellCount).toBe(pinned.cellCount);
    expect(record.gates).toBe(pinned.gates);
  });

  it('the golden is reproducible — a second build hashes identically', () => {
    expect(hashOf(goldenDigest())).toBe(hashOf(goldenDigest()));
  });
});
