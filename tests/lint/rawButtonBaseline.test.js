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
 *   - the total raw-button DEBT can never grow.
 *
 * Debt is measured as the COUNT of raw <button> occurrences, not the number of
 * files. File count is not split-invariant — decomposing a god-component
 * relocates its existing buttons into new sibling files (Track C), which would
 * trip a file-count ceiling even though no NEW button was written. Occurrence
 * count IS split-invariant: it only drops when a button is migrated onto the
 * Button/IconButton primitive (design-a11y.3). New raw buttons are still blocked
 * two ways — a new non-baselined file errors under no-raw-button, and adding a
 * button to a baselined file pushes the occurrence count over the ceiling here.
 *
 * The detector regex `/<button[\s/>]/` is verified to match exactly the same file
 * set the AST rule flags (multi-line opening tags included).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
// Committed max raw-button occurrence count — lower it as buttons migrate onto
// the primitive; never raise it. (Splitting files does NOT change this number.)
// SB5 (2026-07-21): tightened 50 → 45, the count MEASURED on this tree — the
// slack banked by earlier migrations is now locked so no new raw button can
// spend it. Migrating the 45 grandfathered buttons themselves is a burn-down
// lane (each swap changes rendered chrome — border/minHeight/padding — so it
// is per-surface craft work, not a mechanical sweep).
// LANE VT (2026-08-03): tightened 45 → 44, and NOT by a migration. The detector
// is a source match, so it had been counting a DOCSTRING — NavRibbon.jsx's note
// about why the focus ring survives the clip wrote the JSX tag out longhand and
// spent the last unit of the budget. The sentence now says it in prose, and the
// unit it was holding is locked here rather than left as headroom a genuinely new
// raw button could quietly spend. (This is the ratchet's own honesty rule read in
// the direction it is usually read the other way round: the ceiling follows the
// MEASURED count, whichever way the measurement moved.)
const BUTTON_BUDGET = 44;

const BUTTON_FILE_RE = /<button[\s/>]/;
const BUTTON_OCC_RE = /<button[\s/>]/g;
const isPrimitive = (rel) => /^src\/components\/primitives\//.test(rel);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.jsx$/.test(e)) out.push(p);
  }
  return out;
}

const srcFiles = walk(join(ROOT, 'src'))
  .map(p => relative(ROOT, p).replace(/\\/g, '/'))
  .filter(rel => !isPrimitive(rel));

const currentRawButtonFiles = srcFiles
  .filter(rel => BUTTON_FILE_RE.test(readFileSync(join(ROOT, rel), 'utf8')))
  .sort();

const currentButtonCount = srcFiles.reduce((n, rel) => {
  const m = readFileSync(join(ROOT, rel), 'utf8').match(BUTTON_OCC_RE);
  return n + (m ? m.length : 0);
}, 0);

const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.raw-button-baseline.json'), 'utf8')).sort();

describe('raw-button baseline ratchet (A+ enforcement.5)', () => {
  test('baseline exactly matches the files that still use a raw <button>', () => {
    // Mismatch directions: a NEW violator missing from the baseline (lint also
    // catches it), or a STALE baseline entry whose file was migrated (remove it).
    expect(baseline).toEqual(currentRawButtonFiles);
  });

  test('total raw-button debt never grows past its committed budget', () => {
    expect(currentButtonCount).toBeLessThanOrEqual(BUTTON_BUDGET);
  });
});
