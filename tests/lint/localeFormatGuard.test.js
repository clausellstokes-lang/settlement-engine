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
