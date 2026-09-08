/**
 * domainWallClock.test.js — A+ domain.4 (the wall-clock determinism guard).
 *
 * The domain kernel must be a pure function of its inputs: it threads an explicit
 * `now` from the caller and reads real wall-clock time only at a documented seam,
 * src/domain/clock.js (wallClockNow/wallClockMs) — the same single-entry pattern
 * rngContext/prng give randomness. A no-arg `new Date()` or `Date.now()` anywhere
 * else re-introduces non-determinism that same-seed replay and snapshot tests
 * cannot see.
 *
 * This is the source-regex guard backing the eslint domain block: it survives even
 * if ESLint is skipped, and it is deliberately dependency-light — it only reads
 * files from disk and scans the text. It strips comments before scanning, so a
 * file may still MENTION new Date()/Date.now() in prose. Parsing calls such as
 * `new Date(at)` are deterministic-given-input and intentionally allowed; only the
 * no-arg readers are forbidden.
 *
 * @enforced-by this test + eslint.config.js (src/domain/** no-restricted-syntax)
 */

import { describe, test, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const DOMAIN_DIR = resolve(process.cwd(), 'src', 'domain');
const CLOCK_FILE = join(DOMAIN_DIR, 'clock.js');

/** Recursively collect every executable .js file under src/domain (excluding tests). */
function domainFiles(dir = DOMAIN_DIR) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === '__tests__') continue;
      out.push(...domainFiles(full));
    } else if (/\.js$/.test(entry) && !/\.test\.js$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Remove line comments (`// …`) and block comments (`/* … *\/`) so we scan CODE
 * only. Strings are not stripped — a literal "new Date()" inside a string is
 * vanishingly unlikely in this layer and would itself be suspicious.
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
}

// No-arg `new Date()` (any whitespace, no argument) and `Date.now()`.
const WALL_CLOCK_RE = /new\s+Date\s*\(\s*\)|Date\s*\.\s*now\s*\(\s*\)/;

describe('domain wall-clock determinism (clock.js is the sole sanctioned reader)', () => {
  const files = domainFiles();

  test('there is at least one domain file to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  test('no src/domain file except clock.js reads wall-clock in code', () => {
    const offenders = [];
    for (const file of files) {
      if (file === CLOCK_FILE) continue; // the one documented seam
      const code = stripComments(readFileSync(file, 'utf-8'));
      if (WALL_CLOCK_RE.test(code)) {
        offenders.push(relative(process.cwd(), file));
      }
    }
    expect(offenders).toEqual([]);
  });

  test('clock.js exports both wallClockNow and wallClockMs (the seam is real, not vacuous)', () => {
    const src = readFileSync(CLOCK_FILE, 'utf-8');
    expect(/export\s+const\s+wallClockNow\b/.test(src)).toBe(true);
    expect(/export\s+const\s+wallClockMs\b/.test(src)).toBe(true);
  });
});
