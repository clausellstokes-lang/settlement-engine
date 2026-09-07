/**
 * habitVocabulary.test.js — HB-0's vocabulary battery.
 *
 * The two arrays are a permutation pair, and that is the whole point of the file: a
 * CODEPOINT-SORTED totality and a SEMANTIC precedence order look interchangeable and are
 * not. Reading the sorted array's index as a precedence rank inverts the meaning — the
 * same trap the espionage math names in-source about its mission grades — so the pair is
 * asserted to be a permutation and the two orders are asserted to DIFFER.
 *
 * The hold ladder is asserted DERIVED rather than equal to a transcription: there is no
 * second array in the tree to keep equal to a first, so what has to be proved is that the
 * projection still comes off the live source table and that the source table is still
 * ordered by threshold — because the rank is the index, and a reorder upstream would
 * invert every doctrine sheet in the world in silence.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  CIRCUMSTANCE_CLASSES,
  CIRCUMSTANCE_PRECEDENCE,
  HABIT_CLASS_CEILING,
  HABIT_HOLD_BANDS,
  HOLD_RANK,
  TOTAL_FALLBACK_CLASS,
  holdRankOf,
  isCircumstanceClass,
} from '../../src/domain/worldPulse/habit/habitVocabulary.js';
import { DISPOSITION_CHANNEL_TUNING } from '../../src/domain/worldPulse/dispositionLedger.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const VOCABULARY_HOME = 'src/domain/worldPulse/habit/habitVocabulary.js';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }))
  .sort((a, b) => (a.rel < b.rel ? -1 : 1));

/** Files spelling any class token as a quoted string literal. */
function filesSpellingClass() {
  const res = CIRCUMSTANCE_CLASSES.map((word) => new RegExp(`['"\`]${word}['"\`]`));
  return SRC_FILES.filter(({ src }) => res.some((re) => re.test(src))).map(({ rel }) => rel);
}

describe('HB-0 — the circumstance vocabulary and the borrowed hold ladder', () => {
  test('the class set is closed at twelve and sits at or under the owner-signed ceiling', () => {
    // TWO assertions, deliberately, not one. The count catches drift; the ceiling refuses
    // it and tells whoever adds a thirteenth class that they are standing at an owner gate.
    expect(CIRCUMSTANCE_CLASSES).toHaveLength(12);
    expect(
      CIRCUMSTANCE_CLASSES.length,
      'the circumstance vocabulary grew past HABIT_CLASS_CEILING, which is OWNER-SIGNED:'
      + ' growth is by owner-signed addition only, never by an implementer adding a line',
    ).toBeLessThanOrEqual(HABIT_CLASS_CEILING);
    expect(HABIT_CLASS_CEILING).toBe(12);
  });

  test('the sorted totality and the semantic precedence order are permutations of each other', () => {
    expect([...CIRCUMSTANCE_PRECEDENCE].sort()).toEqual([...CIRCUMSTANCE_CLASSES].sort());
    expect(new Set(CIRCUMSTANCE_PRECEDENCE).size).toBe(CIRCUMSTANCE_PRECEDENCE.length);
    expect(new Set(CIRCUMSTANCE_CLASSES).size).toBe(CIRCUMSTANCE_CLASSES.length);
  });

  test('the two orders DIFFER, so an index into one can never be read as a rank in the other', () => {
    expect([...CIRCUMSTANCE_CLASSES]).toEqual([...CIRCUMSTANCE_CLASSES].sort());
    // anchored: the permutation equality in the case above proves both arrays hold the
    // same twelve members, so this inequality measures ORDER and cannot go vacuous on an
    // emptied or drifted collection.
    expect([...CIRCUMSTANCE_PRECEDENCE]).not.toEqual([...CIRCUMSTANCE_PRECEDENCE].sort());
  });

  test('the total fallback is the LAST member of the precedence order, so the classifier is total', () => {
    expect(CIRCUMSTANCE_PRECEDENCE[CIRCUMSTANCE_PRECEDENCE.length - 1]).toBe(TOTAL_FALLBACK_CLASS);
    expect(isCircumstanceClass(TOTAL_FALLBACK_CLASS)).toBe(true);
    expect(isCircumstanceClass('ordinary')).toBe(false);
  });

  test('the hold ladder is DERIVED from the live channel table, rung for rung', () => {
    const projected = DISPOSITION_CHANNEL_TUNING.BANDS.map((band) => String(band.name));
    expect([...HABIT_HOLD_BANDS]).toEqual(projected);
    expect(HABIT_HOLD_BANDS.length).toBeGreaterThan(1);
  });

  test('the channel table is threshold-ASCENDING, which is the only thing that makes the index a rank', () => {
    const thresholds = DISPOSITION_CHANNEL_TUNING.BANDS.map((band) => Number(band.maxExclusive));
    for (let i = 1; i < thresholds.length; i += 1) {
      expect(
        thresholds[i - 1],
        'the borrowed channel ladder is no longer ordered by threshold — the derived hold'
        + ' rank is the INDEX, so a reorder upstream inverts every doctrine sheet silently',
      ).toBeLessThan(thresholds[i]);
    }
  });

  test('HOLD_RANK is the index, and an unknown rung THROWS rather than defaulting', () => {
    HABIT_HOLD_BANDS.forEach((name, index) => {
      expect(HOLD_RANK[name]).toBe(index);
      expect(holdRankOf(name)).toBe(index);
    });
    expect(() => holdRankOf('unbanded')).toThrow(/unknown hold rung/);
  });

  test('no module but the vocabulary leaf spells a circumstance-class token', () => {
    const spelling = filesSpellingClass();
    // Guard the guard: the scan must find the home before its emptiness elsewhere means
    // anything. A scan that stopped matching would report no offenders and prove nothing.
    expect(SRC_FILES.length).toBeGreaterThan(500);
    expect(spelling).toContain(VOCABULARY_HOME);
    expect(
      spelling.filter((rel) => rel !== VOCABULARY_HOME),
      'a module outside the vocabulary leaf spells a circumstance class as a literal —'
      + ' import the vocabulary rather than re-typing a class token',
    ).toEqual([]);
  });
});
