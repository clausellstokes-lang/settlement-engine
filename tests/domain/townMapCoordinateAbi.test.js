/**
 * tests/domain/townMapCoordinateAbi.test.js — MF-T2B acceptance matrix.
 *
 * The versioned integer coordinate ABI (ODQ §287.5 / SPEC §10.4) and the widening of
 * `requireCanonicalInt`'s DEFAULT parameters from the fixture-era `0..1000` to the ABI's
 * envelope. ODQ §303.5: D1's versioned ABI wins on the integer wall, and the ported record
 * shapes re-parameterize onto it.
 *
 * ⭐ EVERY FIGURE BELOW WAS EXECUTED AND PRINTED BEFORE THIS FILE EXISTED. The one that
 * mattered: the compiled draft asked A6 to assert `topologyTextOf(worldQ(v)) === q6(v)`
 * unqualified over a table spanning zeros. Run, that identity holds on 15 of 17 rows — a
 * coordinate that rounds to zero from BELOW is published by `toFixed` as `"-0.000000"` while an
 * integer has one zero. A6 therefore asserts the identity AND its exception set, both as
 * positives, instead of quietly dropping the rows that would have refuted it.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  ANGLE_TABLE_SIZE,
  COORDINATE_ABI,
  COORDINATE_ABI_SCHEMA_VERSION,
  COORDINATE_ABI_VERSION,
  GEOMETRY_QUANTUM,
  HEIGHT_QUANTUM,
  MAX_WORLD_UNITS,
  ROUNDING_RULE,
  heightQ,
  isNegativeZeroText,
  pointQ,
  reconcilesToTopologyText,
  ringQ,
  ringText,
  topologyTextOf,
  withinAbiBounds,
  worldQ,
} from '../../src/domain/townMap/fabric/coordinateAbi.js';
import { q6 } from '../../src/domain/townMap/fabric/exactGeometry.js';
import {
  FABRIC_COORDINATE_ABI,
  requireCanonicalInt,
} from '../../src/domain/townMap/fabric/foundation.js';

/** The two leaves this member adds, as repository-relative paths. */
const NEW_LEAVES = Object.freeze([
  'src/domain/townMap/fabric/coordinateAbi.js',
  'src/domain/townMap/fabric/exactGeometry.js',
]);

/** The fabric directory the port pours into — the only place a reference is lawful today. */
const FABRIC_DIR = 'src/domain/townMap/fabric/';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/** Every `.js`/`.jsx` file under src/, repository-relative, sorted. @returns {string[]} */
function sourceFiles() {
  const root = resolve(REPO_ROOT, 'src');
  /** @type {string[]} */ const out = [];
  /** @param {string} dir */
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(full);
      else if (/\.jsx?$/.test(entry.name)) out.push(`src${full.slice(root.length)}`);
    }
  };
  walk(root);
  return out.sort();
}

/** The fixture-era wall, spelled locally so A7 can compare against it rather than describe it. */
function requireCanonicalIntNarrow(value, label, min = 0, max = 1000) {
  if (!Number.isSafeInteger(value) || Number(value) < min || Number(value) > max) {
    throw new TypeError(`${label} must be an integer in ${min}..${max}`);
  }
  return Number(value);
}

/**
 * The A6 table: negatives, zeros, both signs of round-to-zero, an exact sixth-decimal tie in
 * both signs, and both edges of the envelope. Seventeen rows, fixed.
 */
const RECONCILIATION_TABLE = Object.freeze([
  0, 1, -1, 0.5, -0.5, 1 / 128, -1 / 128, 1e-7, -1e-7, 0.0000005, -0.0000005,
  123.456789, -123.456789, 1000, -1000, MAX_WORLD_UNITS, -MAX_WORLD_UNITS,
]);

describe('MF-T2B versioned integer coordinate ABI', () => {
  test('A1 · the widened envelope accepts an ABI-scale quantum in both signs and still refuses past the envelope', () => {
    expect(MAX_WORLD_UNITS).toBe(9007199254);
    expect(requireCanonicalInt(1286630000, 'q')).toBe(1286630000);
    expect(requireCanonicalInt(-1286630000, 'q')).toBe(-1286630000);
    expect(requireCanonicalInt(MAX_WORLD_UNITS, 'q')).toBe(MAX_WORLD_UNITS);
    // The fixture-era wall REFUSED all three, so the widening is observable rather than asserted.
    expect(() => requireCanonicalIntNarrow(1286630000, 'q')).toThrow(/must be an integer in 0\.\.1000/);
    // ⛔ A WIDENING IS NOT THE REMOVAL OF A WALL: past the envelope it still throws, and the
    // message carries the new range rather than the old one.
    expect(() => requireCanonicalInt(MAX_WORLD_UNITS + 1, 'q'))
      .toThrow(/must be an integer in -9007199254\.\.9007199254/);
    expect(() => requireCanonicalInt(-MAX_WORLD_UNITS - 1, 'q')).toThrow(TypeError);
    expect(() => requireCanonicalInt(1.5, 'q')).toThrow(TypeError);
    // Every EXPLICIT-range caller is untouched: re-parameterising a default cannot reach them.
    expect(() => requireCanonicalInt(4, 'edgeIndex', 0, 3)).toThrow(/must be an integer in 0\.\.3/);
    expect(requireCanonicalInt(3, 'edgeIndex', 0, 3)).toBe(3);
  });

  test('A2 · dormancy — nothing outside the fabric directory references either new leaf', () => {
    const files = sourceFiles();
    // ⛔⛔ THE SCAN KEYS ON THE BARE BASENAME, AND THE FIRST SPELLING DID NOT. It looked for
    // `./coordinateAbi.js`, which every LAWFUL in-directory importer happens to write — so the
    // guard-the-guard arms below passed while a planted consumer importing
    // `../townMap/fabric/coordinateAbi.js` walked straight through. The mutation sweep caught it;
    // reading would not have. A bare basename can only ADD a file to this list and never remove
    // one, so the scan over-convicts loudly (a mention in prose counts) and can never
    // under-convict silently — which is the only direction of error a dormancy pin may have.
    const referencing = files.filter((file) => {
      const src = readFileSync(resolve(REPO_ROOT, file), 'utf8');
      return NEW_LEAVES.some((leaf) => src.includes(String(leaf.split('/').pop())));
    });
    // GUARD-THE-GUARD, ASSERTED FIRST: the scan must find the KNOWN lawful references, or an
    // empty `outside` below would be an empty scan rather than a dormant leaf.
    expect(files.length, 'the src/ walk found nothing — the scan root rotted').toBeGreaterThan(500);
    expect(referencing).toContain('src/domain/townMap/fabric/foundation.js');
    expect(referencing).toContain('src/domain/townMap/fabric/index.js');
    expect(referencing).toContain('src/domain/townMap/fabric/coordinateAbi.js');
    expect(referencing).toContain('src/domain/townMap/fabric/exactGeometry.js');
    const outside = referencing.filter((file) => !file.startsWith(FABRIC_DIR));
    // anchored: the four toContain arms above prove the scan is live and correctly keyed, so an empty list here is dormancy and not a broken walk
    expect(outside, `a consumer appeared outside the fabric directory: ${outside.join(', ')}`)
      .toEqual([]);
  });

  test('A3 · counterforce — the obvious spelling disagrees on the NEGATIVE tie and agrees on its positive twin', () => {
    const tie = -1 / 128;
    expect(tie * 128, 'the fixture must be an exactly representable double').toBe(-1);
    expect(q6(tie)).toBe('-0.007813');
    expect(worldQ(tie)).toBe(-7813);
    expect(Math.round(tie * 1e6)).toBe(-7812);
    expect(worldQ(tie)).not.toBe(Math.round(tie * 1e6));
    // ⭐ THE POSITIVE CONTROL, WITHOUT WHICH THE ARM ABOVE CONVICTS NOTHING IN PARTICULAR. On the
    // same magnitude with the opposite sign the two rules AGREE, so the divergence is the SIGN
    // rule — round-half-away-from-zero versus round-half-toward-plus-infinity — and not an
    // arbitrary disagreement between two arithmetics.
    expect(q6(1 / 128)).toBe('0.007813');
    expect(worldQ(1 / 128)).toBe(7813);
    expect(Math.round((1 / 128) * 1e6)).toBe(7813);
    expect(worldQ(1 / 128)).toBe(Math.round((1 / 128) * 1e6));
    // The canonical rule is published as DATA so this asserts it rather than a comment claiming it.
    expect(ROUNDING_RULE.tieBreak).toBe('HALF_AWAY_FROM_ZERO');
    expect(ROUNDING_RULE.source).toBe('Number.prototype.toFixed');
    expect(ROUNDING_RULE.places).toBe(6);
    expect(ROUNDING_RULE.reRounded).toBe(false);
  });

  test('A4 · boundary and refusal — null rather than NaN, a throwing height door, and absent fields named absent', () => {
    // anchored: the finite control on the next line proves worldQ returns a NUMBER on live input, so these nulls are refusals and not a dead function
    expect(worldQ(1.5)).toBe(1500000);
    expect(worldQ(Infinity)).toBeNull();
    expect(worldQ(-Infinity)).toBeNull();
    expect(worldQ(Number.NaN)).toBeNull();
    expect(worldQ(MAX_WORLD_UNITS + 1)).toBeNull();
    expect(withinAbiBounds(MAX_WORLD_UNITS)).toBe(true);
    expect(withinAbiBounds(MAX_WORLD_UNITS + 1)).toBe(false);
    expect(withinAbiBounds(-MAX_WORLD_UNITS - 1)).toBe(false);
    // ⛔ THE HEIGHT DOOR IS HELD SHUT ON PURPOSE. An unexercised path that silently starts
    // working is how a lane reads a stub as a working feature.
    expect(() => heightQ()).toThrow(/SPEC §10\.16 status override/);
    expect(() => heightQ()).toThrow(/UNEXERCISED/);
    expect(pointQ(null)).toBeNull();
    expect(pointQ([1.5, Number.NaN])).toBeNull();
    expect(pointQ([1.5, -2.25])).toEqual([1500000, -2250000]);
    expect(ringQ([])).toEqual([]);
    expect(ringText([])).toBe('');
    // ABSENT, NOT STUBBED — a contentHash carrying a placeholder is a worse lie than a missing one.
    expect(COORDINATE_ABI.contentHash).toBeNull();
    expect(COORDINATE_ABI.provenanceRef).toBeNull();
    expect(COORDINATE_ABI.unitRegistryRef).toBeNull();
    // The owed y-flip is recorded honestly rather than applied.
    expect(COORDINATE_ABI.viewToWorldYFlipApplied).toBe(false);
    expect(Object.isFrozen(COORDINATE_ABI)).toBe(true);
    expect(COORDINATE_ABI.abiVersion).toBe(COORDINATE_ABI_VERSION);
    expect(COORDINATE_ABI.schemaVersion).toBe(COORDINATE_ABI_SCHEMA_VERSION);
    expect(GEOMETRY_QUANTUM).toEqual({ numerator: 1, denominator: 1000000 });
    expect(HEIGHT_QUANTUM).toEqual({ numerator: 1, denominator: 1000000 });
  });

  test('A6 · the reconciliation is an identity on 15 of 17 rows and its 2 exceptions are exactly the negative-zero spellings', () => {
    expect(RECONCILIATION_TABLE).toHaveLength(17);
    const identical = [];
    const divergent = [];
    for (const v of RECONCILIATION_TABLE) {
      expect(reconcilesToTopologyText(v), `row ${v} does not reconcile`).toBe(true);
      if (topologyTextOf(worldQ(v)) === q6(v)) identical.push(v); else divergent.push(v);
    }
    // ⭐ THE IDENTITY, AND ITS EXCEPTION SET, BOTH AS POSITIVES. Asserting the unqualified
    // identity would have forced this table to omit the two rows that refute it — a fixture built
    // to agree with its deriver.
    expect(identical).toHaveLength(15);
    expect(divergent).toEqual([-1e-7, -0.0000005]);
    expect(divergent.every((v) => isNegativeZeroText(v))).toBe(true);
    expect(identical.some((v) => isNegativeZeroText(v))).toBe(false);
    expect(q6(-1e-7)).toBe('-0.000000');
    expect(q6(1e-7)).toBe('0.000000');
    // …and the ABI has ONE zero, because an integer has one zero.
    expect(worldQ(-1e-7)).toBe(0);
    expect(Object.is(worldQ(-1e-7), -0)).toBe(false);
    expect(topologyTextOf(worldQ(-1e-7))).toBe('0.000000');
    // The angle-table size is declared locally rather than dragging a 270-line table in for one
    // integer, so its equality with the sandbox's TRIG_N is pinned here.
    expect(ANGLE_TABLE_SIZE).toBe(1024);
    expect(COORDINATE_ABI.angleTableSize).toBe(1024);
  });

  test('A7 · widening moves no byte — the version string is unmoved and every already-accepted value is returned identically', () => {
    // ⛔ THE STRING CUTOVER FITS IN NO PACKET: 157 literal digest pins across 12 test files.
    expect(FABRIC_COORDINATE_ABI).toBe('plan-q1-0-1000-v1');
    // Widening changes WHICH INPUTS THROW; it cannot change the representation of an input that
    // was already accepted. Executed over the whole fixture-era domain boundary rather than argued.
    for (const v of [0, 1, 2, 250, 499, 500, 999, 1000]) {
      expect(requireCanonicalInt(v, 'q')).toBe(requireCanonicalIntNarrow(v, 'q'));
    }
    // …and the widened envelope is a strict SUPERSET of the fixture-era one.
    const nowAccepted = [-1000, -1, 1001, 1286630000, MAX_WORLD_UNITS];
    for (const v of nowAccepted) {
      expect(() => requireCanonicalIntNarrow(v, 'q')).toThrow(TypeError);
      expect(requireCanonicalInt(v, 'q')).toBe(v);
    }
  });
});
