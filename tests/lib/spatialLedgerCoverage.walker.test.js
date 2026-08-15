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
// ADDRESS MOVED 2026-08-07 (F29 first-paint repair): the four namespace accessors were
// extracted VERBATIM out of the 1,080-line distanceRead.js digest reader into this
// zero-import leaf, because importing any symbol from the digest reader pulled ~53 kB of
// geography onto the first-paint critical path. distanceRead.js now only RE-EXPORTS them
// and holds no accessor definition, so it is no longer the file to exclude — this is a
// pointer correction, not a widened exemption (still exactly ONE file skipped).
const ACCESSOR_DEF = 'src/domain/spatial/spatialLedgerAccess.js';

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

// A ledger-key CONSTANT definition: `const NAME_LEDGER = 'value'` / `NAME_KEY` /
// `NAME_LEDGER_KEY` (optionally exported). Some kernels key a setSpatialLedger write by
// an imported constant (INTEL_TRANSFERS_LEDGER, EMBASSY_LEDGER_KEY, …) rather than an
// inline literal; we resolve those to their string value so the scan is not blind to
// them — the walker had gone blind to intelTransfers/intelCooldown/roadsEmbassies for
// exactly this reason (lifecycle-1).
const CONST_DEF_RE = /(?:export\s+)?const\s+([A-Z][A-Z0-9_]*(?:_LEDGER|_KEY|_LEDGER_KEY))\s*=\s*['"]([A-Za-z][A-Za-z0-9_]*)['"]/g;

function ledgerKeyConstants() {
  const map = new Map();
  for (const abs of walk(DOMAIN)) {
    const src = readFileSync(abs, 'utf8');
    for (const m of src.matchAll(CONST_DEF_RE)) map.set(m[1], m[2]);
  }
  return map;
}

// Match `setSpatialLedger(<firstArg>, <key>` where <key> is EITHER a quoted string
// literal OR an UPPER_SNAKE constant identifier. The first arg is [\s\S]+? (non-greedy)
// rather than the old [^,]+ so a comma INSIDE the first arg — e.g. the JSDoc cast
// `/** @type {Record<string,unknown>} */ (worldState)` at npcGrowthKernel — no longer
// hides the call (the old regex stopped at that comma and never reached 'npcGrowth').
// Non-greedy stops at the FIRST quoted/constant key, which is always a real call, so no
// literal-keyed call is skipped; the exact-set test below is the safety net. (lifecycle-1)
const WRITE_LITERAL_RE = /setSpatialLedger\s*\(\s*[\s\S]+?,\s*['"]([A-Za-z][A-Za-z0-9_]*)['"]/g;
const WRITE_CONST_RE = /setSpatialLedger\s*\(\s*[\s\S]+?,\s*([A-Z][A-Za-z0-9_]*)\s*[,)]/g;

function writtenLedgerKeys() {
  const consts = ledgerKeyConstants();
  const keys = new Set();
  for (const abs of walk(DOMAIN)) {
    const rel = relative(ROOT, abs).replace(/\\/g, '/');
    if (rel === ACCESSOR_DEF) continue;
    const src = readFileSync(abs, 'utf8');
    for (const m of src.matchAll(WRITE_LITERAL_RE)) keys.add(m[1]);
    // A constant-keyed write: resolve the identifier to its defined string value.
    for (const m of src.matchAll(WRITE_CONST_RE)) {
      const resolved = consts.get(m[1]);
      if (resolved) keys.add(resolved);
    }
  }
  return [...keys].sort();
}

describe('spatialUsage ledger-coverage walker (lib-infra-copy-1)', () => {
  const written = writtenLedgerKeys();
  const classified = [...new Set([...TRACKED_LEDGER_KEYS, ...Object.keys(EXEMPT_LEDGER_KEYS)])].sort();

  test('the scan finds ledger writes (non-vacuous)', () => {
    expect(written.length).toBeGreaterThan(10);
  });

  // lifecycle-1 REVERT-PROOF: the hardened walker must SEE the four writes the old
  // regex was blind to — three keyed by an exported constant (intelTransfers /
  // intelCooldown / roadsEmbassies) and one hidden behind a comma-bearing JSDoc cast
  // (npcGrowth). If the constant-resolution or comma-tolerant first-arg matching is
  // reverted, this reds (and the exact-set test below reds in the other direction if
  // their manifest classification is removed).
  test('resolves constant-keyed + comma-first-arg ledger writes (intel/embassy/npcGrowth)', () => {
    for (const k of ['intelTransfers', 'intelCooldown', 'roadsEmbassies', 'npcGrowth']) {
      expect(written, `the walker must SEE the ${k} write (constant / comma-first-arg idiom)`).toContain(k);
    }
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
