/**
 * grazingQuarrelOneHome.walker.test.js — THE GRAZING FLAG HAS ONE HOME (the tenth chair's RULING G43, 2026-11-26: "THE CURE
 * IS ONE HOME, NOT A SECOND COPY BROUGHT UP TO DATE").
 *
 * The cascade's last quarrel (`src/data/powerSiblings.js :: noGrazingQuarrelOf`) is computed from the birth's own inputs in
 * ONE function, `src/generators/power/governanceLabelRoster.js :: noGrazingQuarrelOfBirth` (WORDS-2 E3's arguments: the
 * leading home food source, the native ground keys, the terrain, the route), and both sites read it there: the power step
 * (`rulingStructure.js`) and the late replay's settled roster (`governanceLabelRosterOf`). The fault it closes: BIRTH-1 D3
 * COPIED the power step's inline call in its old argument shape, and E3 rewrote only the original, so the replay would have
 * undone E3's rule (G13; G19 (1)).
 *
 * WHAT IT SEES (code only: comments and strings out, `tests/helpers/codeOnlySource.js :: codeOnly`), in any `.js`, `.jsx` or
 * `.mjs` file under `src/`: a CALL of `noGrazingQuarrelOf(` (its declaration `function noGrazingQuarrelOf(` is not a call;
 * `noGrazingQuarrelOfBirth(` is another name). THE LIST: exactly one calling line, in the one home. A second call anywhere
 * reds, a call that leaves the home reds.
 * WHAT IT DOES NOT SEE: a call through an alias (`import { noGrazingQuarrelOf as q }`) or through a namespace object; the
 * second arm (the home is the only file that imports or re-exports the name) closes the alias's door at its import.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { codeOnly } from '../helpers/codeOnlySource.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
/** A line that CALLS the quarrel's writer (never its declaration, never the home's own longer name). */
const CALLS = /(?<!function\s+)\bnoGrazingQuarrelOf\s*\(/;
/** A named import (or re-export) of the writer, over however many lines its braces take (the alias's door). */
const IMPORTS = /\b(?:import|export)\s*\{[^}]*\bnoGrazingQuarrelOf\b(?!Birth)[^}]*\}\s*from\b/g;

/** THE ONE HOME: the only file of `src` that calls (and imports) `noGrazingQuarrelOf`, at its exact count. */
const ONE_HOME = Object.freeze({ 'src/generators/power/governanceLabelRoster.js': 1 });

/** The count of calling lines in a source, code only. @param {string} src */
const quarrelCallsIn = (src) => codeOnly(src).split('\n').filter((l) => CALLS.test(l)).length;
/** The count of named imports (or re-exports) of the writer in a source, code only (the names are code; only the specifier is blanked). @param {string} src */
const quarrelImportsIn = (src) => (codeOnly(src).match(IMPORTS) || []).length;

describe('the grazing flag has one home: noGrazingQuarrelOf is called from exactly one place in src', () => {
  const walk = (/** @type {string} */ d, /** @type {string[]} */ o = []) => {
    for (const e of readdirSync(d)) { const p = join(d, e); if (statSync(p).isDirectory()) walk(p, o); else if (/\.(js|jsx|mjs)$/.test(e)) o.push(p); }
    return o;
  };
  /** @type {Record<string, number>} */ const calls = {};
  /** @type {Record<string, number>} */ const imports = {};
  for (const f of walk(join(ROOT, 'src'))) {
    const src = readFileSync(f, 'utf8');
    const rel = relative(ROOT, f).replace(/\\/g, '/');
    const n = quarrelCallsIn(src);
    if (n) calls[rel] = n;
    const m = quarrelImportsIn(src);
    if (m) imports[rel] = m;
  }

  it('the predicate is not vacuous: a planted call counts; the declaration, the home\'s name, a comment and a string do not', () => {
    expect(quarrelCallsIn('const q = noGrazingQuarrelOf({ leadingFood });')).toBe(1);
    expect(quarrelCallsIn('const f = { noGrazingQuarrel: noGrazingQuarrelOf ({ grounds }) };')).toBe(1);
    expect(quarrelCallsIn('export function noGrazingQuarrelOf({ leadingFood = null }) {')).toBe(0);
    expect(quarrelCallsIn('const q = noGrazingQuarrelOfBirth(config, economicState);')).toBe(0);
    expect(quarrelCallsIn('const q = 1; // noGrazingQuarrelOf({ grounds })')).toBe(0);
    expect(quarrelCallsIn("const k = 'noGrazingQuarrelOf({ grounds })';")).toBe(0);
    expect(quarrelImportsIn("import { A, noGrazingQuarrelOf } from '../../data/powerSiblings.js';")).toBe(1);
    expect(quarrelImportsIn("import {\n  A,\n  noGrazingQuarrelOf as q,\n} from '../../data/powerSiblings.js';")).toBe(1);
    expect(quarrelImportsIn("export { noGrazingQuarrelOf } from '../../data/powerSiblings.js';")).toBe(1);
    expect(quarrelImportsIn("import { noGrazingQuarrelOfBirth } from './governanceLabelRoster.js';")).toBe(0);
  });

  it('exactly one line of src calls noGrazingQuarrelOf, in the one home', () => {
    expect(calls).toEqual(ONE_HOME);
  });

  it('the one home is the only importer of noGrazingQuarrelOf (no alias calls it unseen)', () => {
    expect(imports).toEqual(ONE_HOME);
  });
});
