/**
 * localeCompareGuard.test.js — F13 determinism pin.
 *
 * String.prototype.localeCompare collates through the host ICU/CLDR tables, so a
 * sort that feeds rng draw order or persisted output can order non-ASCII strings
 * DIFFERENTLY across devices/locales — breaking SettlementForge's same-seed /
 * every-device / every-locale replay contract. eslint.config.js bans localeCompare
 * in src/generators/** + src/domain/** (the seeded producer trees) and points at
 * domain/deterministicSort.js (compareCodepoint / byNameCodepoint).
 *
 * This pin backs that ban up as a source scan (so a regression reds the gate even
 * if lint is skipped) AND asserts the eslint rule itself stays wired into BOTH
 * determinism blocks — the two must never drift apart.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
// F6/[determinism-constitution-3] extended the ban to the remaining sim-path dirs.
const TREES = ['src/generators', 'src/domain', 'src/workers', 'src/kernel'];

// A .localeCompare( CALL (not the word in a comment/message). The bare-word
// mentions in doc comments have no '(' after them, so this matches only calls.
const CALL_RE = /\.localeCompare\s*\(/;

function walkJs(dir, acc) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkJs(full, acc);
    else if (name.endsWith('.js') || name.endsWith('.jsx')) acc.push(full);
  }
  return acc;
}

describe('localeCompare determinism guard (F13)', () => {
  test('src/generators/** + src/domain/** + src/workers/** + src/kernel/** contain ZERO localeCompare calls', () => {
    const offenders = [];
    for (const tree of TREES) {
      for (const file of walkJs(join(ROOT, tree), [])) {
        const src = readFileSync(file, 'utf8');
        if (CALL_RE.test(src)) offenders.push(relative(ROOT, file));
      }
    }
    expect(offenders, `use compareCodepoint from domain/deterministicSort.js instead:\n${offenders.join('\n')}`).toEqual([]);
  });

  test('the sanctioned comparator module exists and is dependency-free', () => {
    const src = readFileSync(join(ROOT, 'src/domain/deterministicSort.js'), 'utf8');
    expect(src).toMatch(/export const compareCodepoint/);
    expect(src).toMatch(/export const byNameCodepoint/);
    // domain-kernel style: no imports (pure, self-contained).
    expect(src).not.toMatch(/^\s*import\s/m);
    // Must NOT itself reach for localeCompare.
    expect(CALL_RE.test(src)).toBe(false);
  });

  test('eslint.config.js bans localeCompare in the generators, domain, workers, and kernel determinism blocks', () => {
    const cfg = readFileSync(join(ROOT, 'eslint.config.js'), 'utf8');
    // The ban selector appears once per determinism block: generators + domain +
    // workers + kernel(non-prng) + kernel/prng.js = 5.
    const hits = cfg.match(/callee\.property\.name='localeCompare'/g) || [];
    expect(hits.length).toBe(5);
    // Every block is scoped to its tree/file.
    expect(cfg).toContain("files: ['src/generators/**/*.js']");
    expect(cfg).toContain("files: ['src/domain/**/*.js']");
    expect(cfg).toContain("files: ['src/workers/**/*.js']");
    expect(cfg).toContain("files: ['src/kernel/**/*.js']");
    expect(cfg).toContain("files: ['src/kernel/prng.js']");
    // The ban message routes authors to the sanctioned comparator.
    expect(cfg).toMatch(/deterministicSort\.js/);
  });
});
