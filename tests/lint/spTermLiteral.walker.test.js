/**
 * spTermLiteral.walker.test.js — SP-A. THE NO-TERM-LITERAL SOURCE SCAN (seam ruling 3).
 *
 * THE SEAM THIS DEFENDS. GRAMMAR owns the treaty term catalog: term-family membership,
 * spelling and closure for ALL families live in ONE list (`peaceTermsCatalog.js`
 * TERM_CATALOG, with TERM_FAMILIES derived from it at declaration time), and GR-3 is the
 * wave that grows it. The SP program builds NOTHING against that list. The audit that
 * produced ruling R3 found a term family specced in two volumes with divergent
 * membership and spelling — a second list is how one instrument quietly becomes two.
 *
 * WHY A SCAN AND NOT A SENTENCE. `sovereigntyBundle.js`'s `catalogGrewSinceWr10()`
 * tripwire already watches the catalog's SIZE, and it must stay green until GR-3 lands;
 * when GR-3 reds it, that red is WR-10's re-widening instruction and not an SP defect.
 * What nothing watched is the other direction: an SP module quietly naming a family in a
 * literal, which grows no catalog and reds no tripwire and is exactly how the divergent
 * second spelling gets written. This scan closes that direction, and it closes it
 * against the LIVE derived family list rather than a transcription — a ninth family
 * landing in the catalog is covered the day it lands.
 *
 * THE SP MODULE SET IS A REGISTRY THAT GROWS ONE WAVE AT A TIME. Each SP wave adds its
 * own leaves here. A listed module that has moved REDS rather than silently dropping out
 * of the denominator (the filename-anchored-pin vacuity class: a relocation leaves a
 * green pin guarding nothing).
 *
 * @enforced-by itself (a source scan; no runtime coupling)
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { TERM_FAMILIES, TERM_TYPES } from '../../src/domain/worldPulse/peaceTermsCatalog.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The catalog's own home — the guard-the-guard subject, and the ONE lawful speller. */
const CATALOG_HOME = 'src/domain/worldPulse/peaceTermsCatalog.js';

/**
 * THE SP MODULE SET. Grows one wave at a time:
 *   SP-A  bandedStock.js, bandFamilies.js          (this wave)
 *   SP-B  outboundImpression.js + the axis leaf
 *   SP-C  strategicPosture.js
 *   SP-D  errandMint.js
 * A wave adding a leaf adds it HERE in the same commit, or the scan is blind to it.
 */
const SP_MODULES = Object.freeze([
  'src/domain/worldPulse/bandedStock.js',
  'src/domain/worldPulse/bandFamilies.js',
]);

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/**
 * Quoted string literals in `src` that equal one of `words`.
 * @param {string} src @param {readonly string[]} words @returns {string[]}
 */
function literalsSpoken(src, words) {
  const spoken = new Set();
  for (const m of src.matchAll(/['"`]([A-Za-z_][A-Za-z0-9_]*)['"`]/g)) {
    if (words.includes(m[1])) spoken.add(m[1]);
  }
  return [...spoken].sort();
}

describe('SP speaks no treaty-term family (seam ruling 3)', () => {
  test('the family list is LIVE and non-empty (guard the guard)', () => {
    // Derived from TERM_CATALOG at declaration time, so a ninth family is covered the
    // day it lands and no pin here carries a hand count.
    expect(TERM_FAMILIES.length).toBeGreaterThanOrEqual(8);
    expect(TERM_TYPES.length).toBeGreaterThanOrEqual(12);
    expect(TERM_FAMILIES).toContain('economic');
    expect(TERM_FAMILIES).toContain('sovereignty_transfer');
  });

  test('the scanner BITES: it finds every family literal in the catalog itself', () => {
    // The positive control. Without it, a regex that stopped matching would report every
    // SP module clean and the whole scan would pass having proved nothing.
    const spoken = literalsSpoken(read(CATALOG_HOME), TERM_FAMILIES);
    expect(spoken).toEqual([...TERM_FAMILIES].sort());
  });

  test('every registered SP module still exists at its registered path', () => {
    for (const rel of SP_MODULES) {
      expect(existsSync(join(ROOT, rel)), `${rel} moved — re-anchor SP_MODULES`).toBe(true);
    }
    expect(SP_MODULES.length, 'the SP module set emptied — the scan would be vacuous').toBeGreaterThanOrEqual(2);
  });

  test('NO SP module spells a term-family literal', () => {
    const offenders = SP_MODULES
      .map((rel) => ({ rel, spoken: literalsSpoken(read(rel), TERM_FAMILIES) }))
      .filter(({ spoken }) => spoken.length > 0);
    expect(
      offenders,
      'an SP module names a treaty-term family. GRAMMAR owns the ONE catalog list'
      + ' (peaceTermsCatalog.js); SP points at it and never carries a second one — the'
      + ' audit measured a family specced twice with divergent membership and spelling.',
    ).toEqual([]);
  });

  test('NO SP module spells a term TYPE literal either', () => {
    // The family is the ruling's subject, but a module naming `tribute` or
    // `sovereignty_transfer` has forked the catalog just as thoroughly.
    const offenders = SP_MODULES
      .map((rel) => ({ rel, spoken: literalsSpoken(read(rel), TERM_TYPES) }))
      .filter(({ spoken }) => spoken.length > 0);
    expect(offenders).toEqual([]);
  });

  test('MUTANT: an SP module that named a family WOULD be caught', () => {
    // The predicate under test, run against a planted source rather than a planted file:
    // the fix for a red must be to delete the literal, so the scan has to bite on one.
    const planted = `${read(SP_MODULES[0])}\nconst FORBIDDEN = ['${TERM_FAMILIES[0]}'];\n`;
    expect(literalsSpoken(planted, TERM_FAMILIES)).toEqual([TERM_FAMILIES[0]]);
    // …and the unmutated module is clean, which the previous test asserts for the whole
    // set; this pair is what makes the emptiness there a measurement.
    expect(literalsSpoken(read(SP_MODULES[0]), TERM_FAMILIES)).toEqual([]);
  });
});
