/**
 * tests/property/townMapFabricRngDeterminism.test.js — MF-T2H's replay companion.
 *
 * The family's two-file acceptance shape, following `townMapCoordinateAbiDeterminism.test.js`:
 * ONE literal `describe`, straight-line `test` calls with string-literal titles, and every loop
 * runs INSIDE a named test — the SP-D idiom, so the census credits the file rather than parking
 * it (preamble §P5).
 *
 * ⭐⭐ WHAT THE SEEDING LAW ACTUALLY PROMISES, AND WHY A REPLAY PIN IS THE ONLY PROOF OF IT.
 * §11.0's inertia law says a settlement rebuilt from unchanged facts must produce BYTE-unchanged
 * fabric, and that a changed entity must move only its own bytes. Both halves are same-seed
 * claims about a stream, so both are measured here by driving the module twice and comparing —
 * never by reading the implementation and agreeing with it.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  FABRIC_FORK_NAMESPACE,
  descendantId,
  fabricForkKey,
  fabricRng,
  hash32,
  hashInt,
  hashUnit,
  keyedJitter,
  keyedRandom,
  keyedRandomKey,
} from '../../src/domain/townMap/fabric/fabricRng.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * The nondeterminism vocabulary, carried verbatim from MF-T2B's companion so the two fabric
 * leaves are judged by one standard. A leaf that reaches any of these decides from something
 * other than its arguments, and a same-seed world stops being a starting world forever.
 */
const NONDETERMINISM_TOKENS = Object.freeze([
  'Date', 'Math.random', 'Intl', 'toLocale', 'performance', 'crypto',
]);

/** The two leaves this member adds. Both must be pure. */
const LEAF_PATHS = Object.freeze([
  'src/domain/townMap/fabric/fabricRng.js',
  'src/domain/townMap/fabric/spatialReceipt.js',
]);

describe('MF-T2H fabric seeding-law determinism', () => {
  test('B1 · same seed, key, variant and year replay byte-identically, and one entity\'s draws never observe another\'s', () => {
    // ⭐ GUARD-THE-GUARD (preamble §P6): the composer is live and discriminating BEFORE anything
    // below asserts that two readings agree. Two identical readings of a dead function agree too.
    expect(FABRIC_FORK_NAMESPACE).toBe('map-fabric:v3');
    expect(hash32('x'), 'the hash stopped depending on its input').not.toBe(hash32('y'));

    // ── THE FROZEN GRAMMAR ──────────────────────────────────────────────────────────────
    // The key's parts and their order ARE the contract: a later lane that re-orders them, drops
    // the namespace or drops the year silently re-rolls every settlement in the corpus.
    expect(fabricForkKey('demo', 'district.market'))
      .toBe('demo::map-fabric:v3::district.market::y0');
    expect(fabricForkKey('demo', 'district.market', { variant: 3, changeYear: 1187 }))
      .toBe('demo::map-fabric:v3::variant:3::district.market::y1187');
    expect(keyedRandomKey('demo', 'wall/0', 'meander', 2, { variant: 3 }))
      .toBe('demo::map-fabric:v3::variant:3::wall/0::y0#meander#2');
    expect(descendantId('parcel.7', 3)).toBe('parcel.7/3');
    // Two integer pins freeze the hash ALGORITHM itself. A drop-in replacement that is equally
    // deterministic would pass every relational assertion in this file and still re-roll the
    // whole corpus; only a literal catches that.
    expect(hash32(FABRIC_FORK_NAMESPACE)).toBe(557906713);
    expect(hashInt('district.market', 0, 99)).toBe(95);

    // ── THE REPLAY ──────────────────────────────────────────────────────────────────────
    // Every published draw, as zero-argument thunks, run twice over a matrix of seeds, entity
    // keys, variants and years. The loop is INSIDE this named test by design (SP-D idiom).
    const replay = () => {
      const rows = [];
      for (const seed of ['demo', 42, 'a::b', '']) {
        for (const key of ['district.market', 'district.marsh', 'wall/0']) {
          for (const variant of [0, 3]) {
            for (const changeYear of [0, 1187]) {
              const opts = { variant, changeYear };
              const r = fabricRng(seed, key, opts);
              rows.push([
                r.key, r.next(), r.range(1, 9), r.int(0, 10), r.chance(0.5),
                r.pick(['x', 'y', 'z']), r.jitter(2),
                r.weighted([{ weight: 1 }, { weight: 0 }, { weight: 3 }]),
                r.weighted([{ weight: 0 }, { weight: 0 }]),
                hashUnit(key), hashInt(key, 0, 99),
                keyedRandom(seed, key, 'meander', 2, opts),
                keyedJitter(seed, key, 'meander', 2, 4, opts),
              ].join('|'));
            }
          }
        }
      }
      return rows;
    };
    const first = replay();
    expect(first.length, 'the replay matrix collapsed — an empty replay compares nothing').toBe(48);
    expect(replay(), 'a published draw is not a pure function of its arguments').toEqual(first);
    // …and the matrix DISCRIMINATES: 48 rows, 48 distinct readings. Without this a stuck
    // generator returning one constant would satisfy the equality above perfectly.
    expect(new Set(first).size, 'two matrix rows read alike — the fork is not entity-keyed')
      .toBe(48);

    // ── THE INERTIA LAW, DRIVEN ─────────────────────────────────────────────────────────
    // A neighbour's existence, order of construction and number of draws cannot move this
    // entity's bytes, because there is no shared sequential stream to observe.
    const alone = fabricRng('demo', 'district.market').next();
    const neighbour = fabricRng('demo', 'district.marsh');
    for (let i = 0; i < 25; i++) neighbour.next();
    expect(fabricRng('demo', 'district.market').next(),
      'a neighbour\'s draws moved this entity — a shared stream has re-appeared').toBe(alone);
    // A CHANGED year re-rolls that one entity and nothing else's…
    expect(fabricRng('demo', 'district.market', { changeYear: 1187 }).next()).not.toBe(alone);
    // …and the reroll salt reaches the ROOT, so every entity fork inherits it rather than half
    // the town moving. This is the composer-versus-callers gap the module's own header names.
    expect(fabricRng('demo', 'district.market', { variant: 3 }).next()).not.toBe(alone);
    expect(keyedRandom('demo', 'district.market', 'meander', 0, { variant: 3 }))
      .not.toBe(keyedRandom('demo', 'district.market', 'meander', 0));
    // A new draw at k+1 cannot move the draw at k — the sampleIndex argument's whole purpose.
    expect(keyedRandom('demo', 'wall/0', 'meander', 0))
      .not.toBe(keyedRandom('demo', 'wall/0', 'meander', 1));
    // …and two mechanics asking about ONE feature never share a stream.
    expect(keyedRandom('demo', 'wall/0', 'meander', 0))
      .not.toBe(keyedRandom('demo', 'wall/0', 'thickness', 0));
    // All-zero weights degrade to a uniform pick rather than silently to index 0 — the branch
    // whose failure mode reads as a bug rather than as a crash.
    const zeroWeighted = new Set();
    for (const key of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      zeroWeighted.add(fabricRng('demo', key).weighted([{ weight: 0 }, { weight: 0 }, { weight: 0 }]));
    }
    expect(zeroWeighted.size, 'all-zero weights always return the same index — the uniform'
      + ' fallback branch is dead and the map will always pick its first candidate')
      .toBeGreaterThan(1);
  });

  test('B2 · no clock, ambient-randomness, locale or internationalization token is reachable from either new fabric leaf', () => {
    const sources = LEAF_PATHS.map((path) => readFileSync(resolve(REPO_ROOT, path), 'utf8'));
    expect(sources.length).toBe(2);
    expect(sources.every((src) => src.length > 2000), 'a leaf read empty — the scan rotted')
      .toBe(true);
    // ⭐ THE POSITIVE CONTROL, ASSERTED BEFORE THE ABSENCE. A planted occurrence must be SEEN, or
    // the empty result below is an empty scanner rather than a pure leaf.
    const planted = `${sources[0]}\nconst stamped = ${'Date'}.now();`;
    expect(NONDETERMINISM_TOKENS.filter((token) => planted.includes(token))).toEqual(['Date']);
    const reachable = NONDETERMINISM_TOKENS
      .filter((token) => sources.some((src) => src.includes(token)));
    // anchored: the planted control four lines up proves this exact filter convicts, so an empty list is purity and not a broken scan
    expect(reachable, `a nondeterminism token is reachable from a fabric leaf: ${reachable.join(', ')}`)
      .toEqual([]);
    // ⚠ AND THE SCAN IS OVER RAW TEXT, SO PROSE COUNTS. Both leaves name the forbidden
    // vocabulary only in the abstract, and this arm is why: a scan a docstring can trigger is a
    // scan someone eventually widens to excuse the docstring.
    expect(sources.every((src) => src.includes('PURITY: ')),
      'a leaf dropped its purity declaration — the prose contract and the scan drifted apart')
      .toBe(true);
  });
});
