/**
 * tests/domain/temporalGates.w0.test.js — Phase 5.5 W0 Lane B (temporal audit
 * hardening; see docs/TEMPORAL_AUDIT.md).
 *
 * Two gates the audit added:
 *
 *   1. SIM-PATH WALL-CLOCK BACKSTOP — the source-regex guard extended past
 *      src/domain (domainWallClock.test.js) to the two remaining sim-path
 *      directories: src/workers (the advance worker runs the same kernel code —
 *      an ambient wall-clock read there forks worker vs main-thread bytes) and
 *      src/kernel (rngContext/prng must stay the ONLY sanctioned
 *      non-determinism seams; prng.js generateSeed is the one exemption — it
 *      mints fresh seeds from ambient entropy BY DESIGN). Mirrors the eslint
 *      block added beside the domain one, and survives even if lint is skipped.
 *
 *   2. CALENDAR-MIRROR DRIFT GUARDS — the 4-4-5 calendar's interval→weeks table
 *      is single-sourced in worldState.js (INTERVAL_WEEKS {1,4,13,52});
 *      foodStockpile.js and populationDynamics.js carry documented LOCAL COPIES
 *      (each stays a leaf to avoid an import cycle through worldState). The
 *      audit found those two mirrors had NO drift guard (ageBands and the hooks
 *      ADVANCE_TICKS mirror already have theirs) — a silent edit to one copy
 *      would fork the granary/population month-arithmetic off the canonical
 *      grid. These pins make the mirrors un-driftable without a failing test.
 */

import { describe, expect, test } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

import { INTERVAL_WEEKS } from '../../src/domain/worldPulse/worldState.js';

// ── 1. Sim-path wall-clock backstop (workers + kernel) ───────────────────────

const ROOT = process.cwd();
const SCAN_DIRS = [resolve(ROOT, 'src', 'workers'), resolve(ROOT, 'src', 'kernel')];
// The documented ambient-entropy seam: generateSeed() (prng.js) mints fresh
// seeds from Date.now()+Math.random() by design.
const EXEMPT = new Set([resolve(ROOT, 'src', 'kernel', 'prng.js')]);

/** Recursively collect every executable .js file under a dir (excluding tests). */
function jsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === '__tests__') continue;
      out.push(...jsFiles(full));
    } else if (/\.js$/.test(entry) && !/\.test\.js$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/** Strip line + block comments so only CODE is scanned (domainWallClock's rule). */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
}

// No-arg `new Date()` and `Date.now()` — parsing calls (new Date(value)) are
// deterministic-given-input and intentionally allowed.
const WALL_CLOCK_RE = /new\s+Date\s*\(\s*\)|Date\s*\.\s*now\s*\(\s*\)/;

describe('sim-path wall-clock backstop — src/workers + src/kernel', () => {
  const files = SCAN_DIRS.flatMap((dir) => jsFiles(dir));

  test('there is at least one worker/kernel file to check (anti-vacuity)', () => {
    expect(files.length).toBeGreaterThan(0);
    // The exemption target actually exists — a renamed prng.js must fail here
    // rather than silently widening the scan.
    expect(files.some((f) => EXEMPT.has(f))).toBe(true);
  });

  test('no worker/kernel file except prng.js reads wall-clock in code', () => {
    const offenders = [];
    for (const file of files) {
      if (EXEMPT.has(file)) continue;
      const code = stripComments(readFileSync(file, 'utf-8'));
      if (WALL_CLOCK_RE.test(code)) {
        offenders.push(relative(ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });
});

// ── 2. Calendar-mirror drift guards ──────────────────────────────────────────

describe('4-4-5 calendar mirrors — the local INTERVAL_WEEKS copies cannot drift', () => {
  test('the canonical table is the integer-week law: {1, 4, 13, 52}', () => {
    expect({ ...INTERVAL_WEEKS }).toEqual({ one_week: 1, one_month: 4, one_season: 13, one_year: 52 });
    for (const weeks of Object.values(INTERVAL_WEEKS)) {
      expect(Number.isInteger(weeks)).toBe(true);
    }
  });

  // The two mirrors are module-private, so the guard reads the SOURCE and pins
  // the literal against the canonical table (the ageBands pattern: the copy is
  // allowed to exist for leaf-ness, but a drifted value must fail CI).
  const MIRROR_FILES = [
    'src/domain/worldPulse/foodStockpile.js',
    'src/domain/worldPulse/populationDynamics.js',
  ];

  function mirrorTableOf(file) {
    const src = readFileSync(resolve(ROOT, file), 'utf-8');
    const m = src.match(/const INTERVAL_WEEKS = Object\.freeze\(\{([\s\S]*?)\}\);/);
    expect(m, `${file} carries its documented local INTERVAL_WEEKS mirror`).toBeTruthy();
    /** @type {Record<string, number>} */
    const table = {};
    for (const entry of m[1].matchAll(/(\w+):\s*(\d+)/g)) {
      table[entry[1]] = Number(entry[2]);
    }
    return table;
  }

  test.each(MIRROR_FILES)('%s mirrors the single-source table exactly', (file) => {
    expect(mirrorTableOf(file)).toEqual({ ...INTERVAL_WEEKS });
  });

  test('the week→month conversion both mirrors use is the exact 4-4-5 ratio (12/52 = 3/13)', () => {
    // months = weeks × 3 / 13: a one_year advance consumes exactly 12 months.
    expect((INTERVAL_WEEKS.one_year * 3) / 13).toBe(12);
    // The season and month steps stay on the same exact grid (no float drift
    // at the year boundary: 13 four-week months = 52 weeks = 12 label-months).
    expect((INTERVAL_WEEKS.one_season * 3) / 13).toBe(3);
    expect(13 * INTERVAL_WEEKS.one_month).toBe(INTERVAL_WEEKS.one_year);
  });
});
