/**
 * errorCopyBaseline.test.js — the register-of-failures ratchet (Vision V-H, R-23).
 *
 * User-facing error strings belong in the copy register (src/copy/en.js `errors.*`,
 * reached via t()), not hardcoded in components — so every failure speaks in one
 * voice and the i18n door stays open. scripts/.error-copy-baseline.json freezes the
 * component files that STILL surface a hardcoded error literal through the three
 * user-facing idioms below. This pin keeps that baseline HONEST and MONOTONE:
 *   - it must equal the set of files that actually still contain such a literal — a
 *     NEW hardcoded error in a clean file fails here (and the file must join the
 *     list only as a deliberate burn-down entry), and a migrated file that fell to
 *     zero must be struck from the list;
 *   - the total literal DEBT can never grow past its committed budget.
 *
 * The detector matches the SURFACING idiom with a DIRECT string-literal argument:
 *   set<X>Error('…') / set<X>Notice('…'),  showToast('error', '…'),  fallbackTitle="…".
 * It deliberately does NOT match the migrated form  set*Error(t('errors.x'))  (the
 * quote is not adjacent to the paren), the dynamic  set*Error(e.message || 'x')  form,
 * or console.error — so routing a literal through t() is exactly what lowers the count.
 * Debt is an OCCURRENCE count (split-invariant: decomposing a file relocates literals,
 * it never adds one; only a t()-migration drops the number).
 *
 * TO COMPLY when this reds:
 *   - migrated the last literal out of a file → remove its entry AND lower BUDGET by
 *     the number you migrated (lock the win).
 *   - a NEW hardcoded error literal → route it through t('errors.*') instead; only as
 *     a last-resort burn-down do you add the file here and raise nothing.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Committed max hardcoded user-facing error-literal occurrences under
// src/components — lower it as literals migrate onto t('errors.*'); never raise it.
// Quintuple-fold seams: WizardNewsPanel ×2 migrated onto t('errors.chronicleFail'),
// struck from the baseline; vision-c's CorpusFactoryPanel ×2 (an unbudgeted fold-
// composition arrival) migrated onto t('errors.corpus*') in the same pass. Budget
// lowered 53 → 51 to lock the WizardNewsPanel win.
// SB5 (2026-07-21): GalleryReportDialog, ExportDraftButton and GalleryHubPage
// migrated onto t('errors.reportSendFail'/'pdfExportFail'/'signInToVote' + the
// dynamic-fallback siblings) and struck from the baseline. Budget 51 → 48.
const ERROR_LITERAL_BUDGET = 48;

// Detector idioms (see header). File-test = "does any idiom appear"; occurrence
// count = total matches. Fresh RegExp per pass so the /g lastIndex never leaks.
const IDIOMS = [
  () => /\bset[A-Za-z]*(?:Error|Notice)\(\s*['"`]/g,
  () => /showToast\(\s*['"]error['"]\s*,\s*['"`]/g,
  () => /\bfallbackTitle\s*=\s*["']/g,
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

const srcFiles = walk(join(ROOT, 'src/components'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'));

function occurrences(code) {
  return IDIOMS.reduce((n, mk) => {
    const m = code.match(mk());
    return n + (m ? m.length : 0);
  }, 0);
}

const currentOffenderFiles = srcFiles
  .filter((rel) => occurrences(readFileSync(join(ROOT, rel), 'utf8')) > 0)
  .sort();

const currentCount = srcFiles.reduce(
  (n, rel) => n + occurrences(readFileSync(join(ROOT, rel), 'utf8')),
  0,
);

const baseline = JSON.parse(
  readFileSync(join(ROOT, 'scripts/.error-copy-baseline.json'), 'utf8'),
).sort();

describe('error-copy register ratchet (Vision V-H, R-23)', () => {
  test('baseline exactly matches the files that still hardcode a user-facing error literal', () => {
    // Mismatch directions: a NEW offender missing from the baseline (route it
    // through t('errors.*')), or a STALE entry whose file was migrated (strike it).
    expect(baseline).toEqual(currentOffenderFiles);
  });

  test('total hardcoded error-literal debt never grows past its committed budget', () => {
    expect(currentCount).toBeLessThanOrEqual(ERROR_LITERAL_BUDGET);
  });
});
