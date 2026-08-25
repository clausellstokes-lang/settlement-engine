/**
 * spatialLedgerCoverage.walker.test.js — the spatialUsage ledger-coverage walker
 * (lib-infra-copy-1).
 *
 * The registration convention that stops the spatial-usage telemetry from silently
 * lagging the engine (it had gone blind to ~15 waves — naval, epidemic, disinfo,
 * upswing, momentum, … — before this). Every spatialLedgers key a domain kernel WRITES
 * (via the setSpatialLedger accessor) must be classified in src/lib/spatialUsage.js as
 * either TRACKED (surfaced as a mover) or EXEMPT (a documented non-mover). This walker
 * source-scans the write sites and asserts the written-key set EQUALS the union of the
 * two manifest lists — so a new wave that mints a ledger key REDS this gate until its
 * author consciously tracks it (add it to MOVER_PRESENCE + TRACKED_LEDGER_KEYS) or
 * exempts it (add it to EXEMPT_LEDGER_KEYS with a reason).
 *
 * Discovery is automatic (scan), registration is manual (the two lists), and this test
 * forces them to move together — the manifest-walker idiom (structural prevention §2).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { TRACKED_LEDGER_KEYS, EXEMPT_LEDGER_KEYS } from '../../src/lib/spatialUsage.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DOMAIN = join(ROOT, 'src', 'domain');

// The accessor DEFINITION writes a VARIABLE key (`setSpatialLedger(worldState, key, …)`);
// exclude it so the scan sees only the literal-key CALL SITES.
const ACCESSOR_DEF = 'src/domain/spatial/distanceRead.js';

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

// Match `setSpatialLedger(<firstArg>, '<key>'` where the key is a string literal.
// [^,] spans newlines, so multi-line calls are covered; the accessor def uses a bare
// identifier `key` (no quotes) and is excluded by file anyway.
const WRITE_RE = /setSpatialLedger\s*\(\s*[^,]+,\s*['"]([A-Za-z][A-Za-z0-9_]*)['"]/g;

function writtenLedgerKeys() {
  const keys = new Set();
  for (const abs of walk(DOMAIN)) {
    const rel = relative(ROOT, abs).replace(/\\/g, '/');
    if (rel === ACCESSOR_DEF) continue;
    const src = readFileSync(abs, 'utf8');
    for (const m of src.matchAll(WRITE_RE)) keys.add(m[1]);
  }
  return [...keys].sort();
}

describe('spatialUsage ledger-coverage walker (lib-infra-copy-1)', () => {
  const written = writtenLedgerKeys();
  const classified = [...new Set([...TRACKED_LEDGER_KEYS, ...Object.keys(EXEMPT_LEDGER_KEYS)])].sort();

  test('the scan finds ledger writes (non-vacuous)', () => {
    expect(written.length).toBeGreaterThan(10);
  });

  test('every written spatialLedgers key is TRACKED or EXEMPT (and no phantom classifications)', () => {
    // Exact set equality, both directions:
    //  - a written key missing from both lists (a new wave's untracked ledger) fails
    //    → add it to MOVER_PRESENCE + TRACKED_LEDGER_KEYS, or to EXEMPT_LEDGER_KEYS.
    //  - a classified key no longer written by any kernel (renamed/removed) fails
    //    → delete its stale entry from whichever list holds it.
    expect(classified).toEqual(written);
  });

  test('TRACKED and EXEMPT are disjoint (a key is one or the other, never both)', () => {
    const overlap = TRACKED_LEDGER_KEYS.filter((k) => k in EXEMPT_LEDGER_KEYS);
    expect(overlap).toEqual([]);
  });
});
