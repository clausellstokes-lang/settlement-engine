/**
 * faithFieldDormancyFence.test.js — W-FAITH F3c act 2's dormancy proof.
 *
 * ⚠ READ THIS FIRST, BECAUSE THIS FENCE IS SHAPED LIKE `espionageDormancyFence`'s
 * FENCE 1 AND NOT LIKE THE USUAL DORMANCY PIN, AND THE DIFFERENCE IS DELIBERATE.
 * Every other dormancy fence in this estate guards a subsystem that RUNS and is
 * gated. This car's subsystem does not run at all: it lands two pure leaves and
 * NOTHING under `src/` imports either of them. That is the WR-10 dark-instrument
 * shape, and it makes the usual "drive the engine dark, compare the world to
 * itself" pin VACUOUS — it would compare a world to itself through a code path that
 * does not exist, and would stay green if the whole layer were deleted.
 *
 * So the claim is stated at the level where it actually lives:
 *
 *   FENCE 1 — THE IMPORT-CLOSURE CENSUS (own-footprint). No production module under
 *     `src/` imports the faith-field set. For a subsystem with no caller this is
 *     STRICTLY STRONGER than a state pin: a state pin passes on a quiet fixture,
 *     while this fails the moment a caller exists — which is exactly the commit that
 *     owes a real fence. Its guard-the-guard is a POSITIVE CONTROL: the detector must
 *     FIND the imports that do exist (this file's, and the unit tests').
 *     ⚠ ITS LIMIT, STATED: it sees static `from '…'` specifiers only. A dynamic
 *     `await import()` would cross it unseen, exactly as it crosses the coupling
 *     inclusion ratchet's own scan.
 *
 *   FENCE 2 — THE PURITY PIN. The leaves read no clock, no rng and no global state,
 *     so a future caller cannot make them a source of nondeterminism.
 *
 *   FENCE 3 — THE IDENTITY PIN. Reading the field never mutates what it read, so a
 *     caller wiring it into the pulse cannot ghost a settlement.
 *
 * ⛔ WHEN F4c LANDS A CALLER, FENCE 1 IS **REPLACED** BY A DRIVEN BYTE-IDENTITY
 * GOLDEN IN THE SAME COMMIT — never deleted, and never merely loosened. A fence kept
 * past the thing it fences is a false claim with a passing status (F3c act 1's J5).
 */
import { describe, test, expect } from 'vitest';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { faithFieldOf, faithChannelMult, FAITH_CHANNELS } from '../../src/domain/worldPulse/faithField.js';
import { faithWitnessEntries } from '../../src/domain/worldPulse/faithWitnessSource.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The module set this car landed, as import specifiers a scan can look for. */
const FAITH_FIELD_SET = Object.freeze([
  'worldPulse/faithField.js',
  'worldPulse/faithWitnessSource.js',
]);

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));
const TEST_FILES = walk(join(ROOT, 'tests'))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));

/** Static `from '…'` specifiers; comments and strings NOT blanked (a specifier IS a string). */
const IMPORT_RE = /(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g;

/**
 * Which files import any member of the faith-field set.
 * @param {Array<{rel: string, src: string}>} files
 * @returns {string[]}
 */
function importersOf(files) {
  /** @type {string[]} */
  const hits = [];
  for (const { rel, src } of files) {
    // The set's own members may import each other legitimately; the census is about
    // consumers OUTSIDE the set.
    if (FAITH_FIELD_SET.some((member) => rel.endsWith(member))) continue;
    for (const match of src.matchAll(IMPORT_RE)) {
      if (FAITH_FIELD_SET.some((member) => match[1].endsWith(member))) { hits.push(rel); break; }
    }
  }
  return hits.sort();
}

describe('FENCE 1 — the import-closure census (own-footprint, for a car with no caller)', () => {
  test('NO production module imports the faith-field set', () => {
    // Anchored: the positive control below proves this detector finds real importers,
    // so the emptiness here is a MEASUREMENT rather than a broken scan.
    expect(
      importersOf(SRC_FILES),
      'the faith field gained a caller — this fence is now the WRONG fence: replace it with a driven byte-identity golden in the commit that added the caller (W-FAITH F4c)',
    ).toEqual([]);
  });

  test('guard the guard: the detector DOES find the importers that exist', () => {
    const testImporters = importersOf(TEST_FILES);
    expect(testImporters.length, 'the scan found nothing anywhere — it is broken, not clean').toBeGreaterThan(1);
    expect(testImporters).toContain('tests/domain/faithFieldEquation.test.js');
    expect(testImporters).toContain('tests/domain/faithWitnessSource.test.js');
    // ⭐ THIS FILE IS IN THAT LIST TOO, and that is correct: it imports both leaves
    // at the top. A fence that excluded itself would be one silent edit away from
    // scanning nothing.
    expect(testImporters).toContain('tests/property/faithFieldDormancyFence.test.js');
  });

  test('guard the guard, negative arm: a fabricated importer IS detected', () => {
    // The positive control above could pass on a scan that merely matched filenames.
    // This one proves the detector reads IMPORT SYNTAX: a file whose text names the
    // module without importing it must NOT be reported.
    const decoy = [
      { rel: 'src/fake/mentions.js', src: '// worldPulse/faithField.js is mentioned in a comment\nconst s = "worldPulse/faithField.js";\n' },
      { rel: 'src/fake/real.js', src: "import { faithFieldOf } from '../domain/worldPulse/faithField.js';\n" },
    ];
    expect(importersOf(decoy)).toEqual(['src/fake/real.js']);
  });
});

describe('FENCE 2 — the purity pin: no clock, no rng, no global state', () => {
  const SOURCES = FAITH_FIELD_SET.map((member) => ({
    member,
    src: readFileSync(join(ROOT, 'src/domain', member), 'utf8'),
  }));

  test.each(SOURCES)('$member reads no wall-clock and no rng', ({ src }) => {
    // Comment-stripped so a prose mention of Math.random cannot red this.
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/[^\n]*/g, '$1');
    expect(code).not.toMatch(/Math\.random/);
    expect(code).not.toMatch(/Date\.now|new Date\b/);
    expect(code).not.toMatch(/performance\.now/);
  });

  test('the same inputs give the same reading, every time', () => {
    const st = {
      deities: { 'd.a': { deityRef: 'd.a', snapshot: { rankAxis: 'major', boonChannel: 'trade', boonStrength: 'firm' }, share: 60, standing: 'ascendant' } },
      patronRef: 'd.a',
    };
    const s = { id: 's', config: {} };
    const first = faithFieldOf(s, st);
    for (let i = 0; i < 25; i += 1) expect(faithFieldOf(s, st)).toEqual(first);
  });
});

describe('FENCE 3 — the identity pin: reading never writes', () => {
  test('neither leaf mutates the settlement or the religion state it reads', () => {
    const settlement = { id: 's.probe', config: { magicLevel: 'medium', faithProfile: { piety: { composite: 1.2 } } } };
    const religionState = {
      deities: {
        'd.a': { deityRef: 'd.a', snapshot: { rankAxis: 'major', name: 'A', boonChannel: 'harvest', boonStrength: 'heavy', characterAxes: 'MERCY:virtue:marked' }, share: 70, standing: 'ascendant', suppressed: false },
        'd.b': { deityRef: 'd.b', snapshot: { rankAxis: 'cult', name: 'B', baneChannel: 'sea', baneStrength: 'faint' }, share: 30, standing: 'cult', suppressed: false },
      },
      patronRef: 'd.a',
    };
    const before = JSON.stringify({ settlement, religionState });

    faithFieldOf(settlement, religionState);
    for (const ch of FAITH_CHANNELS) faithChannelMult(settlement, religionState, ch);
    faithWitnessEntries({ settlement, religionState, npc: { id: 'npc_1', name: 'Ada' }, dweltTicks: 52, eventId: 'e.1' });

    expect(JSON.stringify({ settlement, religionState })).toBe(before);
  });

  test('the reading itself is a fresh object each call — no shared mutable receipt', () => {
    const s = { id: 's', config: {} };
    const a = faithFieldOf(s, null);
    const b = faithFieldOf(s, null);
    expect(a).not.toBe(b);
    expect(a.channels).not.toBe(b.channels);
    expect(a).toEqual(b);
  });
});
