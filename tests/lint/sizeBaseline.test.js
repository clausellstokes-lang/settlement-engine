/**
 * sizeBaseline.test.js — the size-ratchet honesty pin (code-quality-architecture-1 + -3).
 *
 * scripts/.size-baseline.json freezes the per-file max-lines ceiling of every file
 * that legitimately exceeds its LAYER ceiling today. eslint.config.js generates a
 * per-file `max-lines: ['error', { max }]` override from each entry (replacing the
 * old `max-lines: 'off'` grandfathers, which allowed UNBOUNDED growth — pulseKernel
 * grew +28% effective before this froze it). eslint enforces the "grew past frozen"
 * direction. This test enforces the other three properties the eslint override alone
 * cannot, so the baseline can never drift permissively:
 *
 *   1. EXACT SET — the baseline's keys equal the set of files that ACTUALLY exceed
 *      their layer ceiling right now. A new offender missing from the baseline fails
 *      (eslint also reds it via the layer rule); a stale entry whose file fell under
 *      its layer ceiling fails ("delete its entry" — the win is banked in the ceiling).
 *   2. ABOVE FAILS — a baselined file whose effective count now EXCEEDS its frozen
 *      number fails (redundant with eslint, kept as a self-contained proof).
 *   3. BELOW DEMANDS RATCHET-DOWN — a baselined file that SHRANK below its frozen
 *      number fails, forcing the number to be LOWERED so the reduction is locked
 *      (eslint would silently pass the smaller file under the stale larger ceiling).
 *
 * Measurement uses eslint's OWN Linter with the SAME rule + languageOptions the real
 * flat config uses (espree, ecmaFeatures.jsx), so this test and eslint.config.js can
 * never disagree about a file's effective line count — the enforcer and the measurer
 * are the same engine.
 *
 * TO COMPLY when this reds:
 *   - grew a file → decompose it back under its number (do NOT raise the number).
 *   - shrank a file (still over its layer ceiling) → LOWER its number here to the new
 *     count printed in the failure.
 *   - shrank a file UNDER its layer ceiling → DELETE its entry (ceiling now guards it).
 *   - a NEW file over its layer ceiling → decompose it, or (last resort, burn-down)
 *     add it with its current count and a reason.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { Linter } from 'eslint';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const linter = new Linter({ configType: 'flat' });

// Mirror the real flat config's parse surface so .jsx effective counts match eslint
// exactly (espree + ecmaFeatures.jsx — eslint.config.js base languageOptions).
const LANG = { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } };

/** Effective line count under eslint's max-lines(skipBlankLines,skipComments). */
function effectiveLines(absPath) {
  const code = readFileSync(absPath, 'utf8');
  const msgs = linter.verify(code, {
    languageOptions: LANG,
    rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] },
  });
  const fatal = msgs.find((m) => m.fatal);
  if (fatal) throw new Error(`parse error in ${absPath}: ${fatal.message}`);
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  // No message ⇒ the file is ≤ 1 effective line (max:1 not exceeded).
  return m ? Number(String(m.message).match(/\((\d+)\)/)[1]) : 1;
}

// The per-layer max-lines ceilings — MIRRORS eslint.config.js. Keep in lockstep with
// the layer rules there (components/src-root-jsx 600; generators/domain/store/pdf/lib/
// hooks/utils + src-root .js 800). Returns null for files no max-lines rule covers.
function ceilingFor(rel) {
  if (/^src\/components\/.*\.jsx$/.test(rel)) return 600;
  if (/^src\/[^/]+\.jsx$/.test(rel)) return 600;              // src-root .jsx (App.jsx …)
  if (/^src\/[^/]+\.js$/.test(rel)) return 800;               // src-root .js
  if (/^src\/generators\/.*\.js$/.test(rel)) return 800;
  if (/^src\/domain\/.*\.js$/.test(rel)) return 800;
  if (/^src\/(store|pdf|lib|hooks|utils)\/.*\.(js|jsx)$/.test(rel)) return 800;
  return null;
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const rawBaseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.size-baseline.json'), 'utf8'));
const baseline = Object.fromEntries(Object.entries(rawBaseline).filter(([k]) => !k.startsWith('_')));

// Every covered source file → its effective count (measured once).
const coveredFiles = walk(join(ROOT, 'src'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .filter((rel) => /\.(js|jsx)$/.test(rel) && !/\.test\./.test(rel) && ceilingFor(rel) != null)
  .sort();
const measured = new Map(coveredFiles.map((rel) => [rel, effectiveLines(join(ROOT, rel))]));

describe('size-ratchet baseline honesty (code-quality-architecture-1 + -3)', () => {
  test('baseline keys == the set of files that actually exceed their layer ceiling', () => {
    const overCeiling = coveredFiles.filter((rel) => measured.get(rel) > ceilingFor(rel)).sort();
    const baselineKeys = Object.keys(baseline).sort();
    // A mismatch is either a NEW offender missing from the baseline (decompose it, or
    // add it as a burn-down entry) or a STALE entry whose file fell under its ceiling
    // (delete it — the layer ceiling now guards it).
    expect(baselineKeys).toEqual(overCeiling);
  });

  test('every baselined file exists and is a covered source file', () => {
    for (const rel of Object.keys(baseline)) {
      expect(measured.has(rel), `${rel} is in the size baseline but is not a covered source file (moved/deleted, or wrong layer)`).toBe(true);
    }
  });

  test('each frozen number equals the file\'s current effective count (above fails, below ratchets down)', () => {
    const drift = [];
    for (const [rel, frozen] of Object.entries(baseline)) {
      const actual = measured.get(rel);
      if (actual === undefined) continue; // reported by the existence test above
      if (actual > frozen) drift.push(`${rel}: grew to ${actual} > frozen ${frozen} — decompose it back under ${frozen}; never raise the number`);
      else if (actual < frozen) drift.push(`${rel}: shrank to ${actual} < frozen ${frozen} — LOWER its number here to ${actual} to lock the win`);
    }
    expect(drift).toEqual([]);
  });
});
