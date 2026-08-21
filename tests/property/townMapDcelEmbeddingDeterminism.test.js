/**
 * tests/property/townMapDcelEmbeddingDeterminism.test.js — MF-T2C's replay companion.
 *
 * The family's two-file acceptance shape (a domain matrix plus a determinism companion, following
 * `townMapCoordinateAbiDeterminism.test.js`). One literal `describe`, one straight-line `test`,
 * and the loops run INSIDE the named test — the SP-D idiom, so the census credits the file rather
 * than parking it.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { compileOrthogonalCrossPlanarDcel } from '../../src/domain/townMap/fabric/dcel.js';
import {
  derivePlanarDcelEmbedding,
  locateFace,
} from '../../src/domain/townMap/fabric/dcelEmbedding.js';
import {
  PLANAR_DCEL_ID,
  makeSettlementBoundaryArrangement,
} from '../fixtures/townMapSettlementFabricFixtures.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * The nondeterminism vocabulary. A leaf that reaches any of these decides from something other
 * than its arguments, and a same-seed world stops being a starting world forever.
 */
const NONDETERMINISM_TOKENS = Object.freeze([
  'Date', 'Math.random', 'Intl', 'toLocale', 'performance', 'crypto',
]);

const LEAF_PATHS = Object.freeze([
  'src/domain/townMap/fabric/dcelEmbedding.js',
  'src/domain/townMap/fabric/dcel.js',
]);

const SURFACE = Object.freeze({ kind: 'PLANAR_SURFACE', leafIndex: 0 });
const ABI_M = 1286630001;

/** @param {string} boundaryId @param {number[]} from @param {number[]} to */
function boundary(boundaryId, from, to) {
  const ascending = (from[0] - to[0] || from[1] - to[1]) < 0;
  return { boundaryId, support: SURFACE, geometry: ascending ? [from, to] : [to, from] };
}

/** @param {Array<Record<string,unknown>>} boundaries */
function embed(boundaries) {
  return derivePlanarDcelEmbedding({
    coordinateAbiVersion: 'plan-q1-0-1000-v1',
    settlementId: 'mf-t2c-settlement',
    arrangementRef: { artifactId: 'mf-t2c-arrangement', contentHash: 'mf-t2c-hash' },
    boundaries,
  });
}

/** @param {string} prefix @param {number} x0 @param {number} y0 @param {number} x1 @param {number} y1 */
function square(prefix, x0, y0, x1, y1) {
  return [
    boundary(`${prefix}0`, [x0, y0], [x1, y0]), boundary(`${prefix}1`, [x1, y0], [x1, y1]),
    boundary(`${prefix}2`, [x1, y1], [x0, y1]), boundary(`${prefix}3`, [x0, y1], [x0, y0]),
  ];
}

/** BigInt-safe deep serialization — `JSON.stringify` throws on a BigInt, and a comparison that
 *  throws is not a comparison. @param {unknown} value */
function replayText(value) {
  return JSON.stringify(value, (_key, item) => (typeof item === 'bigint' ? `${item}n` : item));
}

describe('MF-T2C planar-embedding determinism', () => {
  test('A7 · every fixture replays byte-identically and no nondeterminism token is reachable from either edited leaf', () => {
    const nested = () => [...square('o', 0, 0, 100, 100), ...square('i', 40, 40, 60, 60)];
    /** Every fixture the acceptance matrix exercises, as zero-argument thunks. */
    const calls = [
      () => embed([
        boundary('a0', [0, 0], [ABI_M - 1, ABI_M]),
        boundary('a1', [ABI_M - 1, ABI_M], [ABI_M, ABI_M + 1]),
        boundary('a2', [0, 0], [ABI_M, ABI_M + 1]),
      ]),
      () => embed([boundary('c0', [0, 0], [10, 0]), boundary('c1', [10, 0], [10, 10])]),
      () => embed([...square('p', 0, 0, 10, 10), ...square('q', 100, 0, 110, 10)]),
      () => embed(nested()),
      () => locateFace(embed(nested()), [50, 50]),
      () => locateFace(embed(nested()), [20, 20]),
      () => locateFace(embed(nested()), [40, 50]),
      () => locateFace(embed(nested()), [500, 500]),
      () => locateFace(embed(nested()), [0.5, 0]),
    ];
    expect(calls, 'the replay roster emptied — a passing replay over nothing').toHaveLength(9);
    for (const call of calls) {
      const first = replayText(call());
      const second = replayText(call());
      expect(second, `a replayed call diverged from its first result: ${first}`).toBe(first);
    }
    // …and the roster is pinned rather than merely stable, so a kernel that replays a WRONG answer
    // cannot pass this arm by being consistently wrong.
    expect(replayText(embed(nested()).outerFaceIds.length)).toBe('2');
    expect(locateFace(embed(nested()), [40, 50]).kind).toBe('BOUNDARY');
    expect(locateFace(embed(nested()), [0.5, 0]).faceId).toBeNull();

    // ⭐ THE SEALED ARTIFACT IS COMPARED BY ITS OWN contentHash, twice over — the seal is the one
    // surface where a replay divergence would move bytes a consumer already depends on.
    const fixture = makeSettlementBoundaryArrangement();
    const seal = () => compileOrthogonalCrossPlanarDcel({
      artifactId: PLANAR_DCEL_ID,
      foundation: fixture.foundation,
      frontageSubdivision: fixture.frontageSubdivision,
      streetGeometry: fixture.geometry,
      boundaryArrangement: fixture.arrangement,
    });
    const sealed = seal();
    expect(typeof sealed.contentHash, 'the seal published no content hash to compare').toBe('string');
    expect(seal().contentHash).toBe(sealed.contentHash);

    const sources = LEAF_PATHS.map((path) => readFileSync(resolve(REPO_ROOT, path), 'utf8'));
    expect(sources.every((src) => src.length > 2000), 'a leaf read empty — the scan rotted')
      .toBe(true);
    // ⭐ THE POSITIVE CONTROL, ASSERTED BEFORE THE ABSENCE. A planted occurrence must be SEEN, or
    // the empty result below is an empty scanner rather than a pure leaf.
    const planted = `${sources[0]}\nconst stamped = ${'Da'}${'te'}.now();`;
    expect(NONDETERMINISM_TOKENS.filter((token) => planted.includes(token))).toEqual(['Date']);
    const reachable = NONDETERMINISM_TOKENS
      .filter((token) => sources.some((src) => src.includes(token)));
    // anchored: the planted control two lines up proves this exact filter convicts, so an empty list is purity and not a broken scan
    expect(reachable, `a nondeterminism token is reachable from a fabric leaf: ${reachable.join(', ')}`)
      .toEqual([]);
  });
});
