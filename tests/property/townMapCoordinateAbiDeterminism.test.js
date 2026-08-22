/**
 * tests/property/townMapCoordinateAbiDeterminism.test.js — MF-T2B's replay companion.
 *
 * The family's two-file acceptance shape (the domain matrix plus a determinism companion,
 * following `townMapParcelRegistryDeterminism.test.js`). One literal `describe`, one
 * straight-line `test`, and the loop runs INSIDE the named test — the SP-D idiom, so the census
 * credits the file rather than parking it.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  canonicalBytes,
  isNegativeZeroText,
  pointQ,
  reconcilesToTopologyText,
  ringQ,
  ringText,
  topologyTextOf,
  withinAbiBounds,
  worldQ,
} from '../../src/domain/townMap/fabric/coordinateAbi.js';
import {
  absArea,
  area,
  bounds,
  clipHalfPlaneAgainstNormal,
  distToSegment,
  offsetLine,
  pointInPolygon,
  pointLocateRing,
  polygonIntersectionArea,
  properCross,
  q6,
  segIntersect,
  triangulateSimple,
  triangulationIsSound,
} from '../../src/domain/townMap/fabric/exactGeometry.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * The nondeterminism vocabulary. A leaf that reaches any of these decides from something other
 * than its arguments, and a same-seed world stops being a starting world forever.
 */
const NONDETERMINISM_TOKENS = Object.freeze([
  'Date', 'Math.random', 'Intl', 'toLocale', 'performance', 'crypto',
]);

const LEAF_PATHS = Object.freeze([
  'src/domain/townMap/fabric/coordinateAbi.js',
  'src/domain/townMap/fabric/exactGeometry.js',
]);

/**
 * U+001F, the ABI's field separator. It is NAMED here because the character does not print: a
 * bare literal inside the pins below would read as line noise, and reading as line noise is how
 * four of them were dropped from the module in the first place (ODQ §372).
 */
const ABI_FIELD_SEPARATOR = '\u001f';

const RING = Object.freeze([[0, 0], [1.5, 0], [1.5, 2.25], [0, 2.25]]);
const SQUARE = Object.freeze([[0, 0], [10, 0], [10, 10], [0, 10]]);
const OVERLAP = Object.freeze([[5, 5], [15, 5], [15, 15], [5, 15]]);

describe('MF-T2B coordinate-ABI determinism', () => {
  test('A5 · every published function replays byte-identically and no nondeterminism token is reachable from either leaf', () => {
    /** Every call the ABI and its geometry closure publish, as zero-argument thunks. */
    const calls = [
      () => worldQ(-1 / 128),
      () => worldQ(123.456789),
      () => worldQ(Number.POSITIVE_INFINITY),
      () => topologyTextOf(worldQ(-123.456789)),
      () => withinAbiBounds(1286630000),
      () => isNegativeZeroText(-1e-7),
      () => reconcilesToTopologyText(-1 / 128),
      () => pointQ([1.5, -2.25]),
      () => ringQ(RING),
      () => ringText(RING),
      () => canonicalBytes('COORDINATE_ABI', 1, ['unit-registry', 'provenance'], 'body-text'),
      () => canonicalBytes('COORDINATE_ABI', 1, null, ''),
      () => q6(-1 / 128),
      () => area(SQUARE),
      () => absArea([...SQUARE].reverse()),
      () => bounds(SQUARE),
      () => pointInPolygon(5, 5, SQUARE),
      () => pointLocateRing(SQUARE, 0, 5),
      () => distToSegment(0, 5, 0, 0, 10, 0),
      () => properCross([0, 0], [10, 10], [0, 10], [10, 0]),
      () => segIntersect([0, 0], [10, 10], [0, 10], [10, 0]),
      () => offsetLine([[0, 0], [10, 0]], 2),
      () => clipHalfPlaneAgainstNormal(SQUARE, 5, 0, 1, 0),
      () => triangulateSimple(SQUARE),
      () => triangulationIsSound(SQUARE, triangulateSimple(SQUARE)),
      () => polygonIntersectionArea(SQUARE, OVERLAP),
    ];
    expect(calls, 'the replay roster emptied — a passing replay over nothing').toHaveLength(26);
    for (const call of calls) {
      const first = JSON.stringify(call());
      const second = JSON.stringify(call());
      expect(second, `a replayed call diverged from its first result: ${first}`).toBe(first);
    }
    // The geometry answers are pinned rather than merely stable, so a leaf that replays a WRONG
    // constant cannot pass this arm by being consistently wrong.
    expect(polygonIntersectionArea(SQUARE, OVERLAP)).toBe(25);
    expect(triangulationIsSound(SQUARE, triangulateSimple(SQUARE))).toBe(true);
    expect(ringText(RING)).toBe('0,0;1500000,0;1500000,2250000;0,2250000');
    // ⭐⭐ THE FIELD-SEPARATOR PIN, RE-RECORDED — ODQ §372 / §387, member MF-T2Bf. The line this
    // replaces asserted the SEPARATOR-LESS string, and that is how the defect survived a landing:
    // the landed `canonicalBytes` had dropped all four U+001F separators the sealed source uses,
    // and a pin over the wrong bytes is green forever. DECLARED CAUSE: INJECTIVITY RESTORATION.
    // Nothing about the encoding was retuned: the sealed encoding was restored, and the function's
    // OUTPUT is byte-identical to the sealed source again. Only the SOURCE SPELLING differs — the
    // escape form, because `tests/lint/controlBytes.test.js` bans the raw byte the sealed file
    // carries, which is the same ratchet that forced the re-spelling that dropped them.
    expect(canonicalBytes('K', 2, null, 'x'))
      .toBe(`abi:1${ABI_FIELD_SEPARATOR}kind:K${ABI_FIELD_SEPARATOR}schema:2`
        + `${ABI_FIELD_SEPARATOR}deps:[]${ABI_FIELD_SEPARATOR}body:x`);
    // ⛔ THE INJECTIVITY WITNESS, AS MACHINERY RATHER THAN AS THE COMMENT ABOVE. Two DISTINCT
    // (kind, schemaVersion, deps, body) tuples that the separator-less encoding mapped onto ONE
    // string. The first assertion is the POSITIVE CONTROL: strip the separators back out and both
    // encodings ARE the single pre-cure string, named as a literal so the control cannot drift
    // into comparing the deriver with itself. The second assertion is the cure.
    const collideA = canonicalBytes('CANONICAL_SPATIAL', 1, ['a'], ']body:b');
    const collideB = canonicalBytes('CANONICAL_SPATIAL', 1, ['a]body:'], 'b');
    const preCureBytes = 'abi:1kind:CANONICAL_SPATIALschema:1deps:[a]body:]body:b';
    const stripped = [collideA, collideB].map((b) => b.split(ABI_FIELD_SEPARATOR).join(''));
    expect(stripped, 'the pair stopped colliding without the separators — the witness rotted')
      .toEqual([preCureBytes, preCureBytes]);
    expect(collideA).not.toBe(collideB);

    const sources = LEAF_PATHS.map((path) => readFileSync(resolve(REPO_ROOT, path), 'utf8'));
    expect(sources.every((src) => src.length > 2000), 'a leaf read empty — the scan rotted')
      .toBe(true);
    // ⭐ THE POSITIVE CONTROL, ASSERTED BEFORE THE ABSENCE. A planted occurrence must be SEEN, or
    // the empty result below is an empty scanner rather than a pure leaf.
    const planted = `${sources[0]}\nconst stamped = ${'Date'}.now();`;
    expect(NONDETERMINISM_TOKENS.filter((token) => planted.includes(token))).toEqual(['Date']);
    const reachable = NONDETERMINISM_TOKENS
      .filter((token) => sources.some((src) => src.includes(token)));
    // anchored: the planted control two lines up proves this exact filter convicts, so an empty list is purity and not a broken scan
    expect(reachable, `a nondeterminism token is reachable from a fabric leaf: ${reachable.join(', ')}`)
      .toEqual([]);
  });
});
