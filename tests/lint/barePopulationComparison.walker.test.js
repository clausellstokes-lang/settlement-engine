/**
 * barePopulationComparison.walker.test.js — NO BARE POPULATION NUMBER IN THE ENGINE
 * (X-46 car 2, 3b; docs/DESIGN_X46_SCALE_TRAIN.md §3b).
 *
 * Every population comparison written as `pop >= 5000` / `population < 200` was written for a
 * set of tier bands (a town 901–5,000, a city 5,001–25,000) and silently reads wrongly the day
 * the bands move: under the owner's historical bands (X-46 car 1) "pop >= 5000 is dense" became
 * a mid-sized city and "pop < 200 is thin" cut a village in half. So a site that means a TIER
 * CUT reads `src/data/constants.js :: TIER_STAMP_CUTS`, and a site whose meaning is not a tier
 * cut reads a named constant in `src/data/populationThresholds.js`; neither carries the figure
 * at the comparison. This walker pins the census at ZERO: it walks every `.js`/`.jsx` under
 * src/ (constants.js, the one home of the bands, excepted), blanks comments and string text
 * (`tests/helpers/codeOnlySource.js :: codeOnly` — a comment recalling the old `pop >= 5000`
 * is history, not a comparison), and fails naming each offending `file:line`.
 *
 * Measured at 8cc245db0 (before the cure): 17 live comparisons, causalState.js 4 and
 * capacityModel.js 13 (the brief's grep also hits four prose lines, which codeOnly blanks).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { codeOnly } from '../helpers/codeOnlySource.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** The census pattern: the design's own grep (§3b), a population name against a 3+ digit figure. */
const BARE_POPULATION_COMPARISON = /(population|pop) *(>|<|>=|<=) *[0-9][0-9_]{2,}/;

/**
 * Files exempt from the census, by path, with the reason. Only the bands' own home: no engine
 * site survives as an exception.
 * @type {Readonly<Record<string, string>>}
 */
const EXCEPTIONS = Object.freeze({
  'src/data/constants.js': 'the one home of POPULATION_RANGES and TIER_STAMP_CUTS: the bands themselves',
});

function walk(dir, out = []) {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(full);
  }
  return out;
}

/** @param {string} source @returns {number[]} 1-based lines carrying a bare comparison in CODE */
function bareComparisonLines(source) {
  return codeOnly(source).split('\n')
    .map((line, i) => (BARE_POPULATION_COMPARISON.test(line) ? i + 1 : 0))
    .filter(Boolean);
}

describe('X-46 3b: no bare population comparison in the engine', () => {
  const files = walk(SRC);

  test('the walk sees the engine (non-vacuous) and every exception is a real file', () => {
    expect(files.length).toBeGreaterThan(500);
    const rel = new Set(files.map(f => relative(ROOT, f)));
    for (const path of Object.keys(EXCEPTIONS)) expect(rel.has(path), path).toBe(true);
  });

  test('the detector convicts a bare comparison in code and spares one in prose (executed control)', () => {
    expect(bareComparisonLines('if (pop >= 5000) x();')).toEqual([1]);
    expect(bareComparisonLines('const a = 1;\nif (s.population < 200) y();')).toEqual([2]);
    expect(bareComparisonLines('// used to read pop >= 5000\nconst t = "pop >= 5000";')).toEqual([]);
    expect(bareComparisonLines('if (pop >= TIER_STAMP_CUTS.city) z();')).toEqual([]);
  });

  test('zero bare population comparisons outside the exceptions', () => {
    const offenders = [];
    for (const file of files) {
      const rel = relative(ROOT, file);
      if (EXCEPTIONS[rel]) continue;
      for (const line of bareComparisonLines(readFileSync(file, 'utf8'))) offenders.push(`${rel}:${line}`);
    }
    expect(offenders).toEqual([]);
  });
});
