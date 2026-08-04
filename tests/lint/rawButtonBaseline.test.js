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
// LANE PW (2026-08-03): tightened 44 → 42 on a CENSUS TRUE-UP, not a budget
// change — two rows had drifted in OPPOSITE directions and cancelled in the file
// count while leaving the exact-set test red:
//   · src/components/HowToUse.jsx left the baseline. Its two raw buttons were
//     migrated onto the primitive at d6c5af8e (the About page split); the file has
//     read ZERO ever since, so the entry was a STALE grandfather — exactly the
//     second mismatch direction the test above names. Debt effect: none (0 → 0).
//   · src/components/founders/ChairPlate.jsx did NOT enter the baseline, because
//     it does not offend. It arrived at 531a8488 (the Founders' Hall) already
//     built on the Button primitive, and its two detector hits were both PROSE —
//     a docstring sentence and a JSX comment, each spelling the tag longhand to
//     argue that the primitive is mandatory here. Baselining it would have
//     grandfathered a NON-violator and, because eslint-plugin-jsx-hygiene reads
//     this very JSON to build its exemption set, would have switched
//     jsx-hygiene/no-raw-button OFF for the Hall's most formal control — a
//     genuinely new raw button could then have landed there unflagged. So the two
//     sentences were reworded instead (the LANE VT cure directly above, applied a
//     second time), the file left the detector's set, and the 2 units it was
//     holding are LOCKED here rather than left as spendable headroom.
// Attribution note: the drift was first reported against aaa6f3a4, but that
// commit is not the cause — HowToUse.jsx already measured 0 at aaa6f3a4^.
// The two causing commits are d6c5af8e and 531a8488, both 2026-08-03.
// TWICE NOW the detector has counted prose (NavRibbon at LANE VT, ChairPlate
// here). The habitat cure — teaching the detector to strip comments, which is
// what the AST rule it claims to mirror already does — is chair-gated and
// reported, not taken here: it would move the measurement basis for 3 further
// files that carry prose mentions ALONGSIDE real raw buttons.
const BUTTON_BUDGET = 42;

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
