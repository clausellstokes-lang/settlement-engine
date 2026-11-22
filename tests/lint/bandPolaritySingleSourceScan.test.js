/**
 * bandPolaritySingleSourceScan.test.js — the STRUCTURAL guard behind the G9/G10
 * polarity fix (Wave R-5b batch 1, item #3; atlas derived-influenceable G9/G10).
 *
 * WHY A SCAN AND NOT ONLY BEHAVIOUR PINS. G9 was not one bug; it was a habitat.
 * The polarity fact was declared in three places and read at band time by none,
 * and four separate call sites banded a four-dimension value through the bare
 * higher-is-better ladder (`bandFor`) — the derivation, two authored-delta
 * re-band mirrors, and the delta sentence. Behaviour pins catch the four sites
 * that exist today; this scan removes the habitat, so a FIFTH site cannot be
 * written the old way. G10's half does the same for the causal band WORD: the
 * function that re-phrases an inverted band had zero callers for its whole life
 * precisely because nothing insisted on it.
 *
 * WHAT IS ENFORCED
 *   1. Outside bands.js itself, no src module imports `bandFor` from
 *      domain/state/bands.js. The four-dimension band goes through
 *      `bandForDimension`, which carries the polarity.
 *   2. The polarity table is declared exactly once under src/ (bands.js), and no
 *      module re-declares a per-dimension `higherIsBetter` map beside it.
 *   3. Every surface that prints a causal band word routes it through
 *      `causalBandWord`; a renderer may not print a raw `band` for the 16
 *      substrate variables.
 *   4. The lower-is-better word table is TOTAL over CAUSAL_BANDS, and no other
 *      module spells those words. The first cut froze only the three problem
 *      bands, so the benign end fell through to the raw word and the pill read
 *      "Criminal opportunity · ADEQUATE"; totality is what stops a band from
 *      having no word at all.
 *
 * The scan reads SOURCE (it is a habitat guard, not a behaviour assertion) and
 * is deliberately anchored to named files, so a moved file reds here rather than
 * silently dropping out of the denominator.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const SRC = join(ROOT, 'src');

/** Every .js/.jsx file under src/, repo-relative with forward slashes. */
function srcFiles() {
  /** @type {string[]} */
  const out = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(js|jsx)$/.test(entry)) out.push(relative(ROOT, p).replace(/\\/g, '/'));
    }
  })(SRC);
  return out.sort();
}

const FILES = srcFiles();
const read = (rel) => readFileSync(join(ROOT, rel), 'utf-8');

/**
 * Import statements that pull from domain/state/bands.js, with their bindings.
 * Both spellings are matched deliberately: siblings inside domain/state import
 * `./bands.js`, everyone else `.../state/bands.js`. Matching only the second
 * would blind the scan to the module closest to the defect (deriveSystemState).
 * domain/qualitativeBands.js is a DIFFERENT module that also exports a
 * `bandFor` — the `/bands.js` suffix boundary excludes it.
 */
function bandsImportBindings(code) {
  /** @type {string[]} */
  const names = [];
  for (const m of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"](?:\.\/|[^'"]*\/state\/)bands\.js['"]/g)) {
    for (const raw of m[1].split(',')) {
      const name = raw.trim().split(/\s+as\s+/)[0].trim();
      if (name) names.push(name);
    }
  }
  return names;
}

describe('band polarity — one source, no bare ladder', () => {
  test('the scan sees a real denominator (guard the guard)', () => {
    expect(FILES.length).toBeGreaterThan(500);
    expect(FILES).toContain('src/domain/state/bands.js');
    expect(FILES).toContain('src/domain/state/deriveSystemState.js');
  });

  test('no src module imports the bare `bandFor` from state/bands.js', () => {
    const offenders = FILES
      .filter((rel) => rel !== 'src/domain/state/bands.js')
      .filter((rel) => bandsImportBindings(read(rel)).includes('bandFor'));
    expect(
      offenders,
      'these modules band a four-dimension value through the bare higher-is-better '
      + 'ladder; use bandForDimension(key, value) so the three lower-is-better '
      + 'dimensions are not printed inverted (atlas G9)',
    ).toEqual([]);
  });

  test('the four call sites that band a dimension all route through bandForDimension', () => {
    // Named, so a rename or a move reds here instead of vanishing from the scan.
    const banders = [
      'src/domain/state/deriveSystemState.js',
      'src/domain/state/compareSystemState.js',
      'src/domain/events/eventPipeline.js',
      'src/domain/events/batch.js',
    ];
    for (const rel of banders) {
      expect(FILES, `${rel} moved — re-anchor this scan`).toContain(rel);
      const code = read(rel);
      expect(code, `${rel} no longer bands anything`).toMatch(/bandForDimension\(/);
      expect(bandsImportBindings(code)).not.toContain('bandFor');
    }
  });

  test('the per-dimension polarity table is declared exactly once under src/', () => {
    const declarers = FILES.filter((rel) => /\bDIM_POLARITY\s*=/.test(read(rel)));
    expect(declarers).toEqual(['src/domain/state/bands.js']);
  });

  test('no module re-declares a per-dimension higherIsBetter map', () => {
    // The three stale copies (SystemStateBar DIM_META, the PDF DIM_META,
    // livingWorldSignals dims[]) each declared polarity and then ignored it.
    const offenders = FILES.filter((rel) => /higherIsBetter\s*:/.test(read(rel)));
    expect(
      offenders,
      'polarity belongs to bands.js DIM_POLARITY; a local copy is how G9 survived '
      + 'three declarations without a single reader',
    ).toEqual([]);
  });
});

describe('causal band word — every renderer routes through causalBandWord', () => {
  const RENDERERS = [
    'src/components/new/tabs/SubstrateTab.jsx',
    'src/pdf/sections/SystemStateSnapshot.jsx',
    'src/components/map/ChronicleScrollback.jsx',
    'src/components/primitives/RegenerationDeltaCard.jsx',
  ];

  test('the named renderers still exist (guard the guard)', () => {
    for (const rel of RENDERERS) expect(FILES).toContain(rel);
  });

  test.each(RENDERERS)('%s imports and calls causalBandWord', (rel) => {
    const code = read(rel);
    expect(code).toMatch(/causalBandWord/);
    expect(code).toMatch(/import\s*\{[^}]*causalBandWord/);
  });

  test('causalBandWord has real callers outside its own module (it once had none)', () => {
    const callers = FILES
      .filter((rel) => rel !== 'src/domain/causalState.js')
      .filter((rel) => /causalBandWord\s*\(/.test(read(rel)));
    expect(callers.length).toBeGreaterThanOrEqual(RENDERERS.length);
    for (const rel of RENDERERS) expect(callers).toContain(rel);
  });

  test('the lower-is-better band-word table is declared once and covers the WHOLE ladder', () => {
    // It used to be the frozen THREE (collapsed/critical/strained), which closed
    // only the problem end. A benign band fell through to the raw word, so the
    // lone lower-is-better variable printed "Criminal opportunity · ADEQUATE" —
    // read by a human as the crime being adequate. Totality against CAUSAL_BANDS
    // is the structural cure: a sixth band cannot be added without a word, and a
    // word cannot be dropped back out.
    const code = read('src/domain/causalState.js');
    const m = code.match(/LOWER_IS_BETTER_BAND_TERM\s*=\s*Object\.freeze\(\{([^}]*)\}/);
    expect(m, 'the lower-is-better band-word table moved or changed shape').toBeTruthy();
    const keys = [...m[1].matchAll(/^\s*(\w+)\s*:/gm)].map((x) => x[1]).sort();
    const bandsBlock = code.match(/CAUSAL_BANDS\s*=\s*Object\.freeze\(\[([^\]]*)\]/);
    expect(bandsBlock, 'CAUSAL_BANDS moved — re-anchor this scan').toBeTruthy();
    const bands = [...bandsBlock[1].matchAll(/'([a-z]+)'/g)].map((x) => x[1]).sort();
    expect(bands.length, 'the band vocabulary parsed empty (guard the guard)').toBe(5);
    expect(keys, 'every causal band needs a lower-is-better word; a fall-through prints the raw band, which reads inverted').toEqual(bands);
  });

  test('no module re-declares its own lower-is-better wording beside the table', () => {
    // The habitat half: the words live in causalState.js, so a surface cannot
    // quietly grow a second (drifting) vocabulary the way DIM_META did for
    // polarity. The threshold is TWO distinct words, not one: 'Acute' is also a
    // threat-severity label in domain/qualitativeBands.js (an unrelated ladder),
    // and a single shared adjective is a coincidence. A copy of THIS vocabulary
    // brings several of its words with it.
    const WORDS = ['Rampant', 'Acute', 'Elevated', 'Contained', 'Negligible'];
    const offenders = FILES
      .filter((rel) => rel !== 'src/domain/causalState.js')
      .filter((rel) => {
        const code = read(rel);
        return WORDS.filter((w) => code.includes(`'${w}'`)).length >= 2;
      });
    expect(offenders, 'lower-is-better band words belong to causalState.js LOWER_IS_BETTER_BAND_TERM').toEqual([]);
  });
});
