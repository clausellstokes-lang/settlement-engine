/**
 * rawButtonBaseline.test.js — A+ enforcement.5 ratchet pin.
 *
 * scripts/.raw-button-baseline.json grandfathers the files that still use the raw
 * `<button>` JSX element instead of the Button/IconButton primitive. The
 * jsx-hygiene/no-raw-button lint rule exempts exactly those files (plus the
 * primitives themselves). This pin keeps the baseline HONEST and MONOTONE:
 *   - it must equal the set of files that actually still contain a raw <button>
 *     (no new violator escapes via the baseline; no stale entry lingers after a
 *     file is migrated onto the primitive);
 *   - it can never grow past its committed ceiling (you may shrink it, not pad it).
 *
 * The detector regex `/<button[\s/>]/` is verified to match exactly the same file
 * set the AST rule flags (multi-line opening tags included).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_CEILING = 118; // committed max — lower it as files migrate; never raise it

const BUTTON_RE = /<button[\s/>]/;
const isPrimitive = (rel) => /^src\/components\/primitives\//.test(rel);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.jsx$/.test(e)) out.push(p);
  }
  return out;
}

const currentRawButtonFiles = walk(join(ROOT, 'src'))
  .map(p => relative(ROOT, p).replace(/\\/g, '/'))
  .filter(rel => !isPrimitive(rel))
  .filter(rel => BUTTON_RE.test(readFileSync(join(ROOT, rel), 'utf8')))
  .sort();

const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.raw-button-baseline.json'), 'utf8')).sort();

describe('raw-button baseline ratchet (A+ enforcement.5)', () => {
  test('baseline exactly matches the files that still use a raw <button>', () => {
    // Mismatch directions: a NEW violator missing from the baseline (lint also
    // catches it), or a STALE baseline entry whose file was migrated (remove it).
    expect(baseline).toEqual(currentRawButtonFiles);
  });

  test('baseline never grows past its committed ceiling', () => {
    expect(baseline.length).toBeLessThanOrEqual(BASELINE_CEILING);
  });
});
