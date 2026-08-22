/**
 * tests/property/townMapSolidLegalityDeterminism.test.js — MF-T2F's replay companion.
 *
 * The family's two-file acceptance shape (the domain matrix plus this determinism companion,
 * following `townMapMassPartDeterminism.test.js`). One literal `describe`, one straight-line
 * `test`, and every loop runs INSIDE the named test — the SP-D idiom, so the census credits the
 * file rather than parking it.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { solidPartQ } from '../../src/domain/townMap/fabric/massPart.js';
import {
  exactRatioQ,
  sharedFootprintAreaExactQ,
} from '../../src/domain/townMap/fabric/exactIntersectionArea.js';
import {
  dualRunLegality,
  footprintIsAnswerable,
  intervalOverlapVerdict,
  planEraSolid,
  solidOverlap,
} from '../../src/domain/townMap/fabric/solidLegality.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF_PATHS = Object.freeze([
  'src/domain/townMap/fabric/exactIntersectionArea.js',
  'src/domain/townMap/fabric/solidLegality.js',
]);

/**
 * The nondeterminism vocabulary. A leaf that reaches any of these decides from something other
 * than its arguments, and a same-seed world stops being a starting world forever. `Math` is in
 * the list because this member's whole charter is that floating point may not decide legality.
 */
const NONDETERMINISM_TOKENS = Object.freeze([
  'Date', 'Math.', 'Intl', 'toLocale', 'performance', 'crypto', 'random',
]);

/** Drop whole-line comments; the leaves carry their reasoning in docblocks that NAME these
 *  tokens, and a scan of the prose would convict the explanation instead of the code. */
const codeOf = (source) => source.split('\n')
  .filter((line) => !/^\s*(?:\/\/|\/\*|\*)/.test(line))
  .join('\n');

describe('MF-T2F solid legality determinism', () => {
  test('A8 · every published answer replays byte-identically and no float or clock is reachable in either leaf', () => {
    const SUPPORT = 'support:terrain:t1';
    const square = (side = 10000) => [[0, 0], [side, 0], [side, side], [0, side]];
    const m = 1286630001;
    const sliver = () => [[0, 0], [m - 1, m], [m, m + 1]];
    const wide = () => square(94906267);
    const lShape = () => [[0, 0], [10000, 0], [10000, 4000], [4000, 4000], [4000, 10000], [0, 10000]];
    const notch = () => [[5000, 5000], [9000, 5000], [9000, 9000], [5000, 9000]];
    const part = (partId, baseQ, topQ, footprint) => solidPartQ({
      partId, supportSurfaceId: SUPPORT, footprint, vertical: { baseQ, topQ },
    });

    /** Every published call of this member, as zero-argument thunks over the A1/A5 fixtures. */
    const calls = [
      () => solidOverlap(part('part:hall', 0, 5000, square()), part('part:solar', 5000, 9000, square())),
      () => solidOverlap(part('part:hall', 0, 5000, square()), part('part:cellar', 4250, 9000, square())),
      () => solidOverlap(part('part:hall', 0, 5000, square()), planEraSolid('part:ghost', SUPPORT, square())),
      () => solidOverlap(part('part:sliver-a', 0, 3000, sliver()), part('part:sliver-b', 0, 3000, sliver())),
      () => solidOverlap(part('part:wide-a', 0, 3000, wide()), part('part:wide-b', 0, 3000, wide())),
      () => solidOverlap(part('part:range', 0, 5000, lShape()), part('part:tucked', 0, 5000, notch())),
      () => sharedFootprintAreaExactQ(sliver(), sliver(), 'a', 'b'),
      () => sharedFootprintAreaExactQ(lShape(), notch(), 'a', 'b'),
      () => exactRatioQ(-4n, -6n),
      () => planEraSolid('part:ghost', SUPPORT, square()),
      () => intervalOverlapVerdict(part('part:range', 0, 5000, lShape()), part('part:tucked', 0, 5000, notch())),
      () => dualRunLegality([
        part('part:range', 0, 5000, lShape()),
        part('part:tucked', 0, 5000, notch()),
        part('part:plot', 0, 5000, square()),
      ], null),
    ];
    expect(calls, 'the replay roster emptied — a passing replay over nothing').toHaveLength(12);
    const asText = (value) => JSON.stringify(value, (key, item) => (typeof item === 'bigint' ? `${item}n` : item));
    for (const call of calls) {
      const first = asText(call());
      const second = asText(call());
      expect(second, `a replayed call diverged from its first result: ${first}`).toBe(first);
      expect(first.length, 'a replayed call returned nothing to compare').toBeGreaterThan(1);
    }

    // The answers are PINNED as well as stable, so a leaf that replays a wrong shape cannot pass
    // this arm by being consistently wrong.
    expect(asText(calls[3]())).toBe('{"kind":"VOLUME","sharedAreaQ":{"numQ":"1n","denQ":"2n"},'
      + '"sharedHeightQ":"3000n","sharedVolumeQ":{"numQ":"1500n","denQ":"1n"},"verdict":"OVERLAPPING"}');
    expect(asText(calls[8]())).toBe('{"numQ":"2n","denQ":"3n"}');
    expect(calls[10]()).toBe('OVERLAPPING');

    // PURITY: each answer is a fresh frozen object, never a shared singleton a caller could come
    // to depend on by identity.
    expect(calls[0]()).not.toBe(calls[0]());
    expect(footprintIsAnswerable(square())).toBe(true);

    // …and the caller's own input is never captured by reference into a published record.
    const mutable = square();
    const built = planEraSolid('part:ghost', SUPPORT, mutable);
    mutable[0][0] = 999999;
    expect(built.footprint[0][0]).toBe(0);

    for (const leafPath of LEAF_PATHS) {
      const source = readFileSync(resolve(REPO_ROOT, leafPath), 'utf8');
      expect(source.length, `${leafPath} read empty — the scan rotted`).toBeGreaterThan(2000);
      // ⭐ CONTROL ONE: the RAW file really does contain the vocabulary, in the docblocks that
      // explain why the code avoids it. Without this arm the comment stripper below could be
      // deleting nothing and the scan would look clean for the wrong reason.
      const raw = NONDETERMINISM_TOKENS.filter((token) => source.includes(token));
      expect(raw.length, `${leafPath} names none of the vocabulary even in prose`)
        .toBeGreaterThan(0);
      // ⭐ CONTROL TWO: a token planted in CODE is seen by the very filter used below.
      const planted = `${codeOf(source)}\nconst stamped = ${'Date'}.now();`;
      expect(NONDETERMINISM_TOKENS.filter((token) => planted.includes(token)))
        .toContain('Date');
      const reachable = NONDETERMINISM_TOKENS.filter((token) => codeOf(source).includes(token));
      // anchored: control one proves the stripper had work to do and control two proves this exact filter convicts a planted token, so an empty list is purity and not a broken scan
      expect(reachable, `${leafPath} reaches a float or clock token: ${reachable.join(', ')}`)
        .toEqual([]);
    }
  });
});
