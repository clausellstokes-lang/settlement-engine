/**
 * tests/property/townMapMassPartDeterminism.test.js — MF-T2E's replay companion.
 *
 * The family's two-file acceptance shape (the domain matrix plus this determinism companion,
 * following `townMapCoordinateAbiDeterminism.test.js`). One literal `describe`, one straight-line
 * `test`, and every loop runs INSIDE the named test — the SP-D idiom, so the census credits the
 * file rather than parking it.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  FUNCTIONAL_VOLUME_KINDS,
  MASSING_UNKNOWN_REASONS,
  MORPHOLOGY_ROLE_KINDS,
  knownMassingFact,
  massPartQ,
  solidPartQ,
  unknownMassingFact,
  verticalIntervalQ,
} from '../../src/domain/townMap/fabric/massPart.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF_PATH = 'src/domain/townMap/fabric/massPart.js';

/**
 * The nondeterminism vocabulary. A leaf that reaches any of these decides from something other
 * than its arguments, and a same-seed world stops being a starting world forever.
 */
const NONDETERMINISM_TOKENS = Object.freeze([
  'Date', 'Math.random', 'Intl', 'toLocale', 'performance', 'crypto',
]);

const SQUARE = Object.freeze([[0, 0], [10000, 0], [10000, 10000], [0, 10000]]);

describe('MF-T2E mass-part determinism', () => {
  test('A7 · every constructor replays byte-identically and no nondeterminism token is reachable from the leaf', () => {
    const square = () => SQUARE.map((point) => [...point]);
    const solidInput = () => ({
      partId: 'part:hall',
      supportSurfaceId: 'support:terrain:t1',
      footprint: square(),
      vertical: { baseQ: 0, topQ: 5000 },
    });
    const partInput = () => ({
      partId: 'part:hall',
      parentBodyId: 'body:manor',
      morphologyRole: 'MAIN_RANGE',
      functionalVolume: { status: 'KNOWN', value: 'OPEN_CLEAR' },
      solid: solidInput(),
    });

    /** Every call this member publishes, as zero-argument thunks. */
    const calls = [
      () => verticalIntervalQ(0, 5000),
      () => verticalIntervalQ(-4000, -1000),
      () => knownMassingFact('OPEN_CLEAR', FUNCTIONAL_VOLUME_KINDS, 'replay.volume'),
      () => knownMassingFact('UNINHABITED_ATTIC', FUNCTIONAL_VOLUME_KINDS, 'replay.volume'),
      () => knownMassingFact('LAND_KEEL', MORPHOLOGY_ROLE_KINDS, 'replay.role'),
      () => unknownMassingFact('NOT_OBSERVED', 'replay.volume'),
      () => unknownMassingFact('CONFLICTING_EVIDENCE', 'replay.volume'),
      () => solidPartQ(solidInput()),
      () => massPartQ(partInput()),
      () => massPartQ({
        ...partInput(),
        functionalVolume: { status: 'UNKNOWN', reason: 'WITHHELD' },
      }),
    ];
    expect(calls, 'the replay roster emptied — a passing replay over nothing').toHaveLength(10);
    for (const call of calls) {
      const first = JSON.stringify(call());
      const second = JSON.stringify(call());
      expect(second, `a replayed call diverged from its first result: ${first}`).toBe(first);
    }

    // The answers are PINNED as well as stable, so a leaf that replays a wrong shape cannot pass
    // this arm by being consistently wrong.
    expect(JSON.stringify(solidPartQ(solidInput()).vertical))
      .toBe('{"kind":"INTERVAL","baseQ":0,"topQ":5000}');
    expect(JSON.stringify(unknownMassingFact('WITHHELD', 'p')))
      .toBe('{"status":"UNKNOWN","reason":"WITHHELD"}');
    expect(MASSING_UNKNOWN_REASONS).toHaveLength(4);

    // PURITY: the published record must be a fresh object each call, never a shared frozen
    // singleton a caller could come to depend on by identity.
    expect(solidPartQ(solidInput())).not.toBe(solidPartQ(solidInput()));

    // …and the caller's own input is never captured by reference into the published record: a
    // mutation of the input array after construction must not be visible in the record.
    const mutable = solidInput();
    const built = solidPartQ(mutable);
    mutable.footprint[0][0] = 999999;
    expect(built.footprint[0][0]).toBe(0);

    const source = readFileSync(resolve(REPO_ROOT, LEAF_PATH), 'utf8');
    expect(source.length, 'the leaf read empty — the scan rotted').toBeGreaterThan(2000);
    // ⭐ THE POSITIVE CONTROL, ASSERTED BEFORE THE ABSENCE. A planted occurrence must be SEEN, or
    // the empty result below is an empty scanner rather than a pure leaf.
    const planted = `${source}\nconst stamped = ${'Date'}.now();`;
    expect(NONDETERMINISM_TOKENS.filter((token) => planted.includes(token))).toEqual(['Date']);
    const reachable = NONDETERMINISM_TOKENS.filter((token) => source.includes(token));
    // anchored: the planted control two lines up proves this exact filter convicts, so an empty list is purity and not a broken scan
    expect(reachable, `a nondeterminism token is reachable from the leaf: ${reachable.join(', ')}`)
      .toEqual([]);
  });
});
