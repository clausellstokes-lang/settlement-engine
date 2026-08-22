/**
 * tests/property/townMapBoundaryNoderDeterminism.test.js — MF-T2D's replay companion.
 *
 * The family's two-file acceptance shape (a domain matrix plus a determinism companion),
 * matching `townMapCoordinateAbiDeterminism.test.js`. One literal `describe`, one straight-line
 * `test`, and every loop runs INSIDE the named test — the SP-D idiom, so the census credits the
 * file rather than parking it.
 *
 * ⭐ TWO THINGS ARE PROVEN HERE THAT THE DOMAIN MATRIX CANNOT. First, the noder REPLAYS: the
 * same input produces byte-identical published bytes, which is what makes a same-seed world a
 * starting world forever. Second, the published record is PLAIN JSON — no BigInt survives to
 * the surface, even though every orientation sign inside is computed in BigInt — because a
 * BigInt on the record would make the whole thing unserialisable and the replay arm vacuous.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  ARRANGEMENT_QUANTUM_LADDER,
  nodeBoundarySegments,
} from '../../src/domain/townMap/fabric/boundaryNoder.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * The nondeterminism vocabulary. A leaf that reaches any of these decides from something other
 * than its arguments, and a same-seed world stops being a starting world forever.
 */
const NONDETERMINISM_TOKENS = Object.freeze([
  'Date', 'Math.random', 'Intl', 'toLocale', 'performance', 'crypto',
]);

const LEAF_PATHS = Object.freeze(['src/domain/townMap/fabric/boundaryNoder.js']);

/** @param {number[]} a @param {number[]} b @param {string} [role] @param {string} [sourceId] */
function segment(a, b, role = 'wall_face', sourceId = 'fixture') {
  return { a, b, role, sourceId };
}

describe('MF-T2D boundary noder determinism', () => {
  test('A7 · every noding replays byte-identically, the published record is plain JSON, and no nondeterminism token is reachable from the leaf', () => {
    const squares = [];
    for (const [x, z] of [[0, 0], [2000, 2000]]) {
      squares.push(
        segment([x, z], [x + 4000, z]), segment([x + 4000, z], [x + 4000, z + 4000]),
        segment([x + 4000, z + 4000], [x, z + 4000]), segment([x, z + 4000], [x, z]),
      );
    }
    /** Every published behaviour the member has, as zero-argument thunks. */
    const calls = [
      () => nodeBoundarySegments({ settlementId: 'noder-replay', segments: squares }),
      () => nodeBoundarySegments({ settlementId: 'noder-replay', segments: [] }),
      () => nodeBoundarySegments({
        settlementId: 'noder-replay',
        segments: [segment([0, 0], [4000, 0]), segment([2000, 0], [2000, -2000])],
      }),
      () => nodeBoundarySegments({
        settlementId: 'noder-replay',
        segments: [segment([0, 0], [2000, 0]), segment([1000, 0], [3000, 0])],
      }),
      () => nodeBoundarySegments({
        settlementId: 'noder-replay',
        segments: [
          segment([0, 0], [9007199000, 1000]), segment([1000, -1000], [-9007189000, 9007198000]),
        ],
      }),
      () => ARRANGEMENT_QUANTUM_LADDER,
    ];
    expect(calls, 'the replay roster emptied — a passing replay over nothing').toHaveLength(6);
    for (const call of calls) {
      const first = JSON.stringify(call());
      const second = JSON.stringify(call());
      expect(second, `a replayed call diverged from its first result: ${first}`).toBe(first);
      expect(first, 'a published record did not survive serialisation — a BigInt reached the'
        + ' surface, which would make every replay assertion above vacuous').toBeTypeOf('string');
    }
    // Pinned rather than merely stable, so a leaf that replays a WRONG answer cannot pass by
    // being consistently wrong.
    expect(JSON.parse(JSON.stringify(calls[0]())).boundaries).toHaveLength(12);
    expect(calls[2]().residualProperCrossings).toBe(0);
    expect(calls[3]().duplicatesDropped).toBe(1);
    expect(ARRANGEMENT_QUANTUM_LADDER).toEqual([1000, 5000, 25000]);

    // The output is order-free in its SET of boundaries: the same geometry supplied in the
    // reverse order publishes the same ids, because ids digest geometry rather than position.
    const forward = nodeBoundarySegments({ settlementId: 'noder-replay', segments: squares });
    const reversed = nodeBoundarySegments({
      settlementId: 'noder-replay', segments: [...squares].reverse(),
    });
    expect(reversed.boundaries.map((row) => row.boundaryId))
      .toEqual(forward.boundaries.map((row) => row.boundaryId));

    const sources = LEAF_PATHS.map((path) => readFileSync(resolve(REPO_ROOT, path), 'utf8'));
    expect(sources.every((src) => src.length > 2000), 'a leaf read empty — the scan rotted')
      .toBe(true);
    // ⭐ THE POSITIVE CONTROL, ASSERTED BEFORE THE ABSENCE. A planted occurrence must be SEEN,
    // or the empty result below is an empty scanner rather than a pure leaf.
    const planted = `${sources[0]}\nconst stamped = ${'Date'}.now();`;
    expect(NONDETERMINISM_TOKENS.filter((token) => planted.includes(token))).toEqual(['Date']);
    const reachable = NONDETERMINISM_TOKENS
      .filter((token) => sources.some((src) => src.includes(token)));
    // anchored: the planted control two lines up proves this exact filter convicts, so an empty list is purity and not a broken scan
    expect(reachable, `a nondeterminism token is reachable from the noder leaf: ${reachable.join(', ')}`)
      .toEqual([]);
  });
});
