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

// ── THE TRACKED → MOVER TOTAL MAPPING ──────────────────────────────────────────────
// ⛔ THE FAILS-OPEN HABITAT THIS CLOSES. The exact-set arm below pins
// `written === TRACKED ∪ EXEMPT`, and nothing in the estate binds a TRACKED key to a
// live MOVER_PRESENCE row. So a key can sit in TRACKED_LEDGER_KEYS — asserting "this
// IS surfaced as a mover" — while the mover row that surfaces it has been deleted,
// and every arm here stays green while the telemetry emits nothing. That is not
// hypothetical: deleting a mover row leaves this walker and two sibling suites 28/28
// green, which is the standing spatial-ledger-manifest classification hazard with its
// receipt executed.
//
// ⚠ SOURCE-SCANNED, NOT EXPORTED, AND THAT IS DELIBERATE. `MOVER_PRESENCE` is a local
// const inside `extractSpatialUsage`. Exporting it to make this assertion easy would
// widen `spatialUsage.js`'s public type surface for a test's convenience — the
// recorded size-ratchet lesson. The scan reads the array's own rows instead, and the
// non-vacuity arm below fails closed if the scan ever finds nothing.
const SPATIAL_USAGE = join(ROOT, 'src', 'lib', 'spatialUsage.js');

/** The mover NAMES declared by `MOVER_PRESENCE`, read out of the module's source. */
export function moverPresenceNames(src) {
  const start = src.indexOf('const MOVER_PRESENCE = [');
  if (start === -1) throw new Error('spatialLedgerCoverage: MOVER_PRESENCE array not found — re-point this scan');
  let depth = 0;
  let end = src.indexOf('[', start);
  for (let i = end; i < src.length; i += 1) {
    if (src[i] === '[') depth += 1;
    else if (src[i] === ']') { depth -= 1; if (depth === 0) { end = i; break; } }
  }
  const body = src.slice(src.indexOf('[', start) + 1, end);
  return [...body.matchAll(/\[\s*'([A-Za-z_][A-Za-z0-9_]*)'\s*,/g)].map((m) => m[1]);
}

// THE KEY-TRANSLATION TABLE. MOVER_PRESENCE rows are keyed by the DERIVED signal name
// the telemetry emits, not by the ledger key that feeds them, so a bare set comparison
// would be meaningless. Every row below names the ledger key it maps and the mover row
// that carries it; a TRACKED key with no row here is a red, and so is a row naming a
// key that is no longer TRACKED.
const TRACKED_TO_MOVER = Object.freeze({
  embattlement: 'embattlement',
  supplyShipments: 'caravans',          // also feeds the `smuggle` row
  migration: 'migration',
  armyTransit: 'field_combat',
  entrepots: 'entrepots',
  tradeFlow: 'trade_flow',
  rumorLedgers: 'rumor',
  beliefMaps: 'belief',
  moralDrift: 'moral_drift',
  dispatchWillingness: 'dispatch_refusal',
  spatialArrivals: 'propagation',
  navalTransit: 'naval',
  epidemic: 'epidemic',
  disinfo: 'disinfo',
  credibility: 'credibility',
  upswing: 'upswing',
  commitments: 'momentum',
  interventions: 'intervention',
  exposedCorruption: 'corruption_exposed',
  satellites: 'satellites',
  campaignPlans: 'war_campaign',
  routeNetwork: 'route_network',
  demographicPlans: 'demographic_plans',
  pactProposals: 'pact_formation',
  missionCreditEvents: 'mission_credit',
  habits: 'habit_conditioning',
});

// Mover rows that carry NO tracked ledger key of their own, recorded by name with the
// reason, so a NEW unexplained mover reds instead of being absorbed silently.
const MOVERS_WITHOUT_TRACKED_KEY = Object.freeze({
  smuggle: 'a second reading of supplyShipments (the smuggling subset), not a ledger of its own',
  approval_queue: 'counted off worldState.proposals, which is not a spatialLedgers key at all',
});

/** Every TRACKED key that does not reach a LIVE mover row, named with its reason. */
export function orphanedTrackedKeys(trackedKeys, moverNames, table = TRACKED_TO_MOVER) {
  const live = new Set(moverNames);
  const orphans = [];
  for (const key of trackedKeys) {
    const mover = table[key];
    if (!mover) { orphans.push(`${key} — TRACKED but absent from the key-translation table`); continue; }
    if (!live.has(mover)) orphans.push(`${key} — maps to mover row '${mover}', which no longer exists`);
  }
  return orphans;
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

  // ── THE EMISSION BINDING ─────────────────────────────────────────────────────────
  const moverNames = moverPresenceNames(readFileSync(SPATIAL_USAGE, 'utf8'));

  test('the MOVER_PRESENCE scan finds rows (non-vacuous — a broken scan must not read as clean)', () => {
    // Fail closed. Every arm below is satisfied for free by an empty scan, so the
    // scan's own liveness is asserted first.
    expect(moverNames.length).toBeGreaterThan(20);
    expect(new Set(moverNames).size, 'MOVER_PRESENCE declares a duplicate row name').toBe(moverNames.length);
  });

  test('every TRACKED ledger key reaches a LIVE mover row (total mapping, no fails-open)', () => {
    // TRACKED means "surfaced as a mover". Without this, the claim is unbacked: the
    // mover row can be deleted and the exact-set arm above stays green while the
    // telemetry emits nothing for that key.
    expect(orphanedTrackedKeys(TRACKED_LEDGER_KEYS, moverNames), 'TRACKED keys with no live mover row')
      .toEqual([]);
  });

  test('the key-translation table carries no stale row (both directions)', () => {
    const tracked = new Set(TRACKED_LEDGER_KEYS);
    const stale = Object.keys(TRACKED_TO_MOVER).filter((k) => !tracked.has(k));
    expect(stale, 'translation rows naming a key that is no longer TRACKED').toEqual([]);
  });

  test('every mover row is either a TRACKED key\'s target or a recorded exception', () => {
    // The other direction: a NEW mover row that belongs to no tracked key must be
    // named with its reason rather than drifting in unexplained.
    const targets = new Set(Object.values(TRACKED_TO_MOVER));
    const unexplained = moverNames.filter(
      (name) => !targets.has(name) && !(name in MOVERS_WITHOUT_TRACKED_KEY),
    );
    expect(unexplained, 'mover rows belonging to no TRACKED key and carrying no reason').toEqual([]);
  });
});

// ── ANTI-VACUITY CONTROLS (§75 idiom) ──────────────────────────────────────────────
// ⛔ The mapping arm asserts an empty orphan list, which is exactly what a broken scan
// also produces. These arms operate on FIXTURE inputs — never by mutating the real
// module mid-run — so the detector's discrimination is executed rather than assumed.
describe('spatialUsage ledger-coverage walker — the mapping actually bites', () => {
  const FIXTURE_MOVERS = ['embattlement', 'caravans', 'field_combat', 'habit_conditioning'];
  const FIXTURE_TABLE = Object.freeze({
    embattlement: 'embattlement',
    supplyShipments: 'caravans',
    armyTransit: 'field_combat',
    habits: 'habit_conditioning',
  });
  const FIXTURE_TRACKED = ['embattlement', 'supplyShipments', 'armyTransit', 'habits'];

  test('CONTROL — the intact fixture reports no orphan', () => {
    expect(orphanedTrackedKeys(FIXTURE_TRACKED, FIXTURE_MOVERS, FIXTURE_TABLE)).toEqual([]);
  });

  test('MUTANT — deleting a mover row orphans its TRACKED key BY NAME', () => {
    // The recorded hazard, executed: a TRACKED key whose mover row is gone. Before
    // this arm existed the walker and two sibling suites stayed green through exactly
    // this deletion.
    const withoutHabits = FIXTURE_MOVERS.filter((n) => n !== 'habit_conditioning');
    const orphans = orphanedTrackedKeys(FIXTURE_TRACKED, withoutHabits, FIXTURE_TABLE);
    expect(orphans).toHaveLength(1);
    expect(orphans[0]).toContain('habits');
    expect(orphans[0]).toContain('habit_conditioning');
  });

  test('MUTANT — a TRACKED key with no translation row is named, not silently skipped', () => {
    const orphans = orphanedTrackedKeys([...FIXTURE_TRACKED, 'brandNewLedger'], FIXTURE_MOVERS, FIXTURE_TABLE);
    expect(orphans).toHaveLength(1);
    expect(orphans[0]).toMatch(/brandNewLedger .* absent from the key-translation table/);
  });

  test('the MOVER_PRESENCE scan fails CLOSED when its anchor moves', () => {
    expect(() => moverPresenceNames('export const nothing = 1;\n')).toThrow(/MOVER_PRESENCE array not found/);
  });

  test('the MOVER_PRESENCE scan reads a fixture array exactly', () => {
    const fixture = [
      'const MOVER_PRESENCE = [',
      "  ['alpha', counts.a],",
      "  ['beta', counts.b],   // a trailing comment",
      '];',
    ].join('\n');
    expect(moverPresenceNames(fixture)).toEqual(['alpha', 'beta']);
  });
});
