/**
 * localeFormatGuard.test.js — locale-FORMATTING determinism pin.
 *
 * Sibling of localeCompareGuard.test.js (F13). localeCompare was banned first;
 * the Phase-3 re-grade found the formatting half of the same class still open:
 * toLocaleString() persisted output in the foodBalance viability warnings, so
 * the "same" settlement hashed differently on a de_DE host ("8.000") than on
 * an en_US one ("8,000"). eslint.config.js now bans toLocaleString /
 * toLocaleDateString / toLocaleTimeString / Intl.* in src/generators/** +
 * src/domain/** and points at domain/formatNumber.js (formatCount).
 *
 * This pin backs that ban up as a source scan (so a regression reds the gate
 * even if lint is skipped) AND asserts the eslint rule itself stays wired into
 * BOTH determinism blocks — the two must never drift apart. The CI leg that
 * runs the golden suite under LANG=tr_TR.UTF-8 is the end-to-end proof; this
 * is the cheap edit-time tripwire.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
// F6/[determinism-constitution-3] extended the ban to the remaining sim-path dirs.
const TREES = ['src/generators', 'src/domain', 'src/workers', 'src/kernel'];

// Locale-formatting CALLS (not the words in comments/messages — a call has an
// opening paren) plus any member access on the Intl namespace.
const CALL_RE = /\.toLocale(String|DateString|TimeString)\s*\(|\bIntl\s*\./;

function walkJs(dir, acc) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkJs(full, acc);
    else if (name.endsWith('.js') || name.endsWith('.jsx')) acc.push(full);
  }
  return acc;
}

// Strip comments so doc mentions of the banned names don't trip the scan.
const codeOf = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

describe('locale-formatting determinism guard', () => {
  test('src/generators/** + src/domain/** + src/workers/** + src/kernel/** contain ZERO locale-formatting calls', () => {
    const offenders = [];
    for (const tree of TREES) {
      for (const file of walkJs(join(ROOT, tree), [])) {
        if (CALL_RE.test(codeOf(readFileSync(file, 'utf8')))) {
          offenders.push(relative(ROOT, file));
        }
      }
    }
    expect(
      offenders,
      `use formatCount from domain/formatNumber.js instead:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  test('the sanctioned formatter module exists and is dependency-free', () => {
    const src = readFileSync(join(ROOT, 'src/domain/formatNumber.js'), 'utf8');
    expect(src).toMatch(/export function formatCount/);
    // domain-kernel style: no imports (pure, self-contained).
    expect(src).not.toMatch(/^\s*import\s/m);
    // Must NOT itself format through the host locale.
    expect(CALL_RE.test(codeOf(src))).toBe(false);
  });

  // ── §69.4 / §113.2: THE DISPLAY TREES, AND WHY THIS IS A DIFFERENT DETECTOR ──
  //
  // ⛔ THE OBVIOUS EXTENSION IS THE WRONG ONE, AND IT WAS MEASURED BEFORE IT WAS
  // REFUSED. Adding 'src/components' and 'src/pdf' to TREES above reds 33 files,
  // and 26 of them carry only the EXPLICIT `'en-US'` renders the Wave-4h ruling
  // expressly sanctions. That is precisely the red-a-green-tree failure §69.4
  // exists to prevent: the display layer is where locale formatting LEGITIMATELY
  // enters (the audit's own boundary table says so), so the sim-path ban cannot
  // simply be widened onto it.
  //
  // What is forbidden on a display surface is the BARE form — no locale argument,
  // or `undefined` as the first argument, which is the same host-locale read in a
  // costume. That is the line the ruling actually drew: a de-DE reader was shown
  // "8.000" where an en-US reader saw "8,000", for the same seeded world.
  const DISPLAY_TREES = ['src/components', 'src/pdf'];
  const BARE_CALL_RE = /\.toLocale(?:String|DateString|TimeString)\s*\(\s*(?:\)|undefined\b)/;

  test('the bare-form detector discriminates (positive control): it catches the two host-locale spellings and admits the explicit one', () => {
    // Without this the arm below reports "no offenders" identically whether the
    // trees are clean or the regex stopped matching anything at all.
    expect(BARE_CALL_RE.test('d.toLocaleString()')).toBe(true);
    expect(BARE_CALL_RE.test('d.toLocaleDateString( )')).toBe(true);
    expect(BARE_CALL_RE.test("d.toLocaleString(undefined, { dateStyle: 'medium' })")).toBe(true);
    // …and the sanctioned form is ADMITTED, which is the half that makes this a
    // different detector from the sim-path ban rather than a stricter one.
    expect(BARE_CALL_RE.test("d.toLocaleString('en-US')")).toBe(false);
    expect(BARE_CALL_RE.test("d.toLocaleString('en-US', { dateStyle: 'medium' })")).toBe(false);
    expect(BARE_CALL_RE.test("n.toLocaleString('en-GB')")).toBe(false);
  });

  test('src/components/** + src/pdf/** contain ZERO BARE-locale calls (the explicit form stays sanctioned)', () => {
    const offenders = [];
    for (const tree of DISPLAY_TREES) {
      for (const file of walkJs(join(ROOT, tree), [])) {
        if (BARE_CALL_RE.test(codeOf(readFileSync(file, 'utf8')))) offenders.push(relative(ROOT, file));
      }
    }
    expect(
      offenders,
      '\nA display surface reads the HOST locale, so the same seeded world renders'
      + ' differently for different readers.\nCounts: formatCount from'
      + " src/domain/formatNumber.js. Dates: name the locale explicitly ('en-US').\n"
      + `${offenders.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the sanctioned EXPLICIT form is genuinely present in those trees, so the arm above is not vacuous', () => {
    // If the display trees contained no locale formatting at all, "zero bare
    // calls" would be true for a reason that has nothing to do with this ban —
    // and the arm would keep passing after somebody deleted the whole class.
    let explicit = 0;
    for (const tree of DISPLAY_TREES) {
      for (const file of walkJs(join(ROOT, tree), [])) {
        const src = codeOf(readFileSync(file, 'utf8'));
        explicit += (src.match(/\.toLocale(?:String|DateString|TimeString)\s*\(\s*'/g) || []).length;
      }
    }
    expect(explicit, 'no explicit locale render survives; the bare-form ban has no subject')
      .toBeGreaterThan(0);
  });

  test('eslint.config.js bans locale formatting in the generators, domain, workers, and kernel determinism blocks', () => {
    const cfg = readFileSync(join(ROOT, 'eslint.config.js'), 'utf8');
    // Each ban selector appears once per determinism block: generators + domain +
    // workers + kernel(non-prng) + kernel/prng.js = 5.
    for (const method of ['toLocaleString', 'toLocaleDateString', 'toLocaleTimeString']) {
      const hits = cfg.match(new RegExp(`callee\\.property\\.name='${method}'`, 'g')) || [];
      expect(hits.length, `${method} ban selector count`).toBe(5);
    }
    // Intl is banned as both `new Intl.X(...)` and `Intl.X(...)` per block: 2 × 5 = 10.
    const intlHits = cfg.match(/callee\.object\.name='Intl'/g) || [];
    expect(intlHits.length).toBe(10);
    // The ban message routes authors to the sanctioned formatter.
    expect(cfg).toMatch(/formatNumber\.js/);
  });
});
