/**
 * observedShapeReaders.walker.test.js — THE READER-WITH-NO-WRITER RATCHET, pinned
 * and PROVEN against the three defects that motivated it.
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────
 * A reader asks a record for a key NO WRITER EVER PRODUCES, and it is invisible
 * because the read is DEFENSIVELY GUARDED — `governing?.id`, `String(x.foo ||
 * '')`, `containers.find(r => Array.isArray(r.exports))`. It cannot throw. It
 * degrades to a default, and the arm behind it is structurally dead on every
 * generated world, forever, silently. Three were found by accident in one week,
 * during a typecheck census that was looking for something else:
 *
 *   TCD-1  `.id` on a RulingFaction at 9 sites (rulingPower.js, warSeatBooks.js
 *          ×2, applyWorldPulse.js). 0 of 78 generated faction rows carry `id`.
 *          Consequence: a NEWS ADDRESS LAW address-chain gap.
 *   TCD-2  `ownExportsOf` probed `exports` on economicState / economy / trade.
 *          Two of those containers do not exist; the third never carries
 *          `exports`. The `'known'` arm was structurally dead.
 *   TCD-3  `satellite.foundingTier` — no writer at all.
 *
 * The recorded `faction-key-defect-class` is a fourth instance. Nobody knew how
 * many more there were. This file is the answer and the standing guard.
 *
 * ── THE ACCEPTANCE, EXECUTED, AND WHY IT IS THE WHOLE POINT ──────────────────
 * A walker that cannot rediscover the defects that motivated it is vacuous. So
 * the instrument was driven at eca65c8a — a PRE-FIX sha where all three still
 * exist — in an integrity-counted `git archive` (6,168 tracked paths in, 6,168
 * extracted), with the corpus DERIVED INSIDE THAT ARCHIVE so both halves of the
 * measurement belong to one commit. It reported all three:
 *
 *   TCD-1  src/domain/rulingPower.js:225        `faction?.id`     @factions
 *          + 31 further `.id`-on-a-faction reads across 12 modules
 *   TCD-2  envoyNegotiationPictureBuilder.js:137 `settlement.economy`  @settlement
 *                                          :138 `settlement.trade`    @settlement
 *                                          :140 `row.exports`         @economicState
 *                                          :142 `container.exports`   @economicState
 *   TCD-3  lineageMemberBirth.js:178            `satellite.foundingTier` @steadings
 *
 * AT HEAD THE DIFFERENCE IS THE SIBLING LANE'S REPAIRS: TCD-1 landed at
 * 9ecec2a2, TCD-2 at b19038ec, TCD-3 in the working tree during this lane. The
 * `foundingTier` read is GONE from the estate at the freeze sha, the four
 * envoyNegotiation rows are gone, and the inventory fell from 3,221 (eca65c8a)
 * to 3,236 at 3800bcb6 across a tree that also GREW — the two are not directly
 * comparable file-for-file, which is exactly why the ratchet is PER-FILE.
 *
 * ── ⚠⚠ THE INVENTORY IS MODULE-GRAPH-SENSITIVE. RE-FROZEN 2026-08-07 AT ec525a59,
 * AND THE CAUSE IS NOT THE ONE IT LOOKS LIKE ────────────────────────────────
 * The layering repair at 67f8a58e added two modules and `git mv`'d a third, and
 * this walker went red with findings in ELEVEN files — NINE of which that commit
 * never touched (persistMerge.js, relationshipState.js, generationContracts.js,
 * pulseFingerprint.js, main.jsx, conditionGrammar.js among them). Their source is
 * byte-identical across the commit. MEASURED, both sides derived inside
 * integrity-counted `git archive`s of committed shas:
 *
 *   corpus     IDENTICAL — same shape count, same `plotHooks` rows and keys, same
 *              meta. The producers observed exactly the same world.
 *   reads      IDENTICAL — the scan saw the same member reads on both sides.
 *   RESOLVED   12,411 -> 12,433. That is the whole delta.
 *
 * So no new dead arm was written. Perturbing the scanned file SET re-grounded
 * receivers: some reads newly resolved, and some re-resolved to a DIFFERENT shape
 * (envoyErrandParlay's `encounters` moved from `npcs` to `settlement` — the same
 * read, a different answer). ⚠ SOME OF WHAT THAT ADMITTED IS VISIBLY IMPLAUSIBLE:
 * `config on plotHooks` / `displayPrefs on plotHooks` in persistMerge.js and
 * `a|b|from|to on npcs` in relationshipState.js read as MIS-GROUNDED receivers,
 * not as dead arms. They are frozen because the gate must be green and because
 * they are indistinguishable, from inside this instrument, from the legacy debt
 * already here — NOT because anyone verified they are real.
 *
 * WHAT THAT MEANS FOR YOU. Do not read a row as a confirmed defect without
 * checking the site. And expect this walker to red again on any commit that adds
 * or moves source files, in files that commit never touched: that is this
 * property, not a regression you caused. The standing cure — grounding a receiver
 * by declaration rather than by a name prior over the live module set — is a
 * resolver redesign and is CHAIR-SIZED, deliberately deferred here, documented so
 * it is not re-found as a bug.
 *
 * ⚠ THE ACCEPTANCE RUN IS NOT RE-EXECUTED HERE. It needs a second checkout of a
 * historical sha, and this program's concurrency law refuses a second worktree.
 * What runs on every gate instead is the LIVE instrument plus the planted mutant
 * below, which drives the identical detector.
 *
 * ── WHAT THIS FILE PINS ─────────────────────────────────────────────────────
 *   1. STATIC — the baseline is internally consistent, every row names a real
 *      file, and the frozen `minRows` matches the script's own constant.
 *   2. EXECUTED CORPUS — the producers are RUN (≈45s, once, shared by every
 *      assertion below) and the corpus is proved to have observed the four
 *      shapes the three defects live on, with the exact key ABSENCES that make
 *      the class real. An empty corpus greens everything; this is the pin that
 *      makes every other green here mean something.
 *   3. EXECUTED MUTANT — a synthetic reader of a key PROVEN to have no writer is
 *      planted into the scanned set and the walker MUST report it, with a
 *      negative control (an observed key on the same shape) that must stay
 *      silent. A walker that stays green under its own mutant is not a walker.
 *   4. EXECUTED RATCHET FAILURES — every failure path of the comparison (growth,
 *      a vanished row, a collapsed corpus) is driven and asserted non-empty.
 *   5. EXECUTED SWAP MUTANT — the one that beat the ratchet's FIRST form. See
 *      below.
 *   6. FILE-SCOPED PARAMETER MEMO — same-position helpers in separate files
 *      resolve independently rather than inheriting each other's shape.
 *
 * ── ⚠⚠ WHY THE INVENTORY IS CONTENT-ADDRESSED (the swap that beat form one) ──
 * The first spelling froze ONE NUMBER per file. A number cannot tell a defect
 * from its neighbour: a verifier drove it live on `src/domain/rulingPower.js`
 * (ceiling 10) and showed that REMOVING one real finding and ADDING a different
 * one leaves the count unchanged — so a fresh reader-without-a-writer lands and
 * the ratchet reports nothing. The inventory now freezes the finding IDENTITY
 * (`<key> on <shape|shape>`) with its multiplicity, and a NEW identity in an
 * already-listed file has ceiling 0 exactly as a new file does. That exact
 * mutant is driven twice below — synthetically, and against the LIVE
 * rulingPower.js findings at constant count.
 */
import { readFileSync, existsSync, writeFileSync, mkdtempSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, test, beforeAll } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { buildObservedCorpus } from '../../scripts/lib/observed-shape-corpus.mjs';
import { scanReaders } from '../../scripts/lib/reader-shape-scan.mjs';
import {
  MIN_ROWS, ORIGIN_MIN_ROWS, BASELINE_SCHEMA, sourceFiles, inventoryOf, identityOf, rowOf,
  compare, sentinelOf, sentinelFailures, ratchetMessage,
} from '../../scripts/check-observed-shape-readers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.observed-shape-readers-baseline.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const SITE_CONTEXT = '1'.repeat(64);
const SITE_EXPRESSION = '2'.repeat(64);
const exactSite = (key, ordinal = 0) => (
  `v2|owner=function%3Atest|context=${SITE_CONTEXT}|expr=${SITE_EXPRESSION}`
  + `|ordinal=${ordinal}|kind=dot|key=${encodeURIComponent(key)}`
);
const exactFinding = (file, line, key, shape, origin = `test/${shape}`, ordinal = 0) => ({
  file, line, pos: line, site: exactSite(key, ordinal), key, shapes: [shape], origins: [origin],
  text: `row.${key}`,
});
const exactIdentity = (key, shape, origin = `test/${shape}`, ordinal = 0) => (
  `${key} on ${shape} @ ${origin} # ${exactSite(key, ordinal)}`
);

/** The producers run ONCE for the whole file. Every executed pin reads this. */
let corpus = null;
let live = null;
/** The estate's file list, walked ONCE — every scan below reuses it. */
let estate = null;

/**
 * ⚠⚠ THE SCAN BUDGET — why this file counts its own full-tree scans.
 *
 * `scanReaders` is not cheap and is not meant to be: it runs
 * `ts.createSourceFile` over EVERY `src/**` file and then walks the whole tree
 * three times. MEASURED at bd5e49f6 on an 8-core machine, inside a full-suite
 * run: ONE scan costs 13,447–15,904 ms.
 *
 * This file used to run SIX of them — one live, plus one per mutant — and the
 * five mutant scans ran INSIDE TEST BODIES, against the bare global
 * `testTimeout: 20000` (vite.config.js). That is a worst-case margin of
 * 20,000 / 15,904 = 1.26x, and it did not hold: three full-suite runs at ONE
 * sha produced 0, 2 and 5 failures, all of them TIMEOUTS with no assertion diff
 * (`Error: STACK_TRACE_ERROR`, durations 21,173–26,069 ms). A flaky gate is
 * worse than a red one — it teaches everyone to re-run until green and it
 * silently invalidates every census taken through it.
 *
 * Every OTHER test in the estate that runs longer than 8s carries its own
 * explicit test-level timeout (30s–240s; the house precedent is stated at
 * tests/joins/ordering.test.js:289). These five were the only heavy tests in
 * the suite running on the default. The cure is the one the cost demanded: cut
 * the work, do not buy headroom. The scans now happen TWICE, both inside
 * `beforeAll` hooks with explicit 300s HOOK timeouts, and `scansRun` is pinned
 * below so that re-introducing a per-test scan reds instead of flaking.
 */
let scansRun = 0;

/** The one place `scanReaders` is called. `extraFiles` are planted probes. */
function scanEstateWith(extraFiles = []) {
  scansRun += 1;
  return scanReaders({
    files: extraFiles.length ? [...estate, ...extraFiles] : estate,
    graph: corpus.graph,
    minRows: ORIGIN_MIN_ROWS,
    root: ROOT,
  });
}

beforeAll(async () => {
  corpus = await buildObservedCorpus();
  estate = sourceFiles(ROOT);
  live = scanEstateWith();
}, 300_000);

describe('reader-with-no-writer ratchet: the frozen inventory', () => {
  test('the baseline is CONTENT-ADDRESSED, internally consistent, and every row is a real file', () => {
    expect(baseline.schema, 'schema 1 was the count-only form — blind to an identity swap').toBe(BASELINE_SCHEMA);
    const rows = Object.entries(baseline.inventory);
    expect(rows.length).toBeGreaterThan(0);
    // Every row is an identity map, never a bare count. This is the pin that
    // refuses a hand-edit back to the form the swap mutant beat.
    expect(rows.filter(([, r]) => typeof r !== 'object' || r === null || Array.isArray(r))).toEqual([]);
    const ids = rows.flatMap(([, r]) => Object.entries(r));
    expect(ids.reduce((n, [, c]) => n + c, 0)).toBe(baseline.total);
    expect(ids.length).toBe(baseline.identities);
    expect(ids.every(([, c]) => Number.isInteger(c) && c > 0)).toBe(true);
    // An identity is `<key> on <shape|shape>` — the spelling the script mints.
    expect(ids.filter(([id]) => !/^[^\s]+ on \S/.test(id))).toEqual([]);
    const missing = rows.map(([f]) => f).filter((f) => !existsSync(join(ROOT, f)));
    expect(missing).toEqual([]);
    // Forward slashes only: a backslashed key reads differently on POSIX and
    // Windows CI — spurious reds on one, unlimited headroom on the other.
    expect(rows.filter(([f]) => f.includes('\\'))).toEqual([]);
  });

  test('the retired count-only row form is REFUSED, not silently accepted', () => {
    // Accepting `10` as a row would restore "any ten findings you like" — the
    // exact headroom the swap mutant exploited.
    expect(() => rowOf(10, 'src/x.js')).toThrow(/RETIRED count-only form/);
    expect(rowOf({ 'id on factions @ test/factions': 2 }, 'src/x.js'))
      .toEqual({ 'id on factions @ test/factions': 2 });
  });

  test('the frozen threshold and sha are recorded, and match the script', () => {
    expect(baseline.minRows).toBe(MIN_ROWS);
    expect(baseline.originMinRows).toBe(ORIGIN_MIN_ROWS);
    expect(baseline.frozenAtSha).toMatch(/^[0-9a-f]{7,40}$/);
    expect(baseline.frozen).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(baseline.sentinel.usableShapes).toBeGreaterThan(0);
    expect(baseline.sentinel.totalKeys).toBeGreaterThan(0);
    expect(baseline.sentinel.resolvedReads).toBeGreaterThan(0);
  });

  test('the failure message names the rule, the fix, and the only legal shrink', () => {
    const msg = ratchetMessage('src/x.js', [
      { identity: exactIdentity('id', 'factions'), count: 3, ceiling: 1 },
      { identity: exactIdentity('foundingTier', 'steadings'), count: 1, ceiling: 0 },
    ]);
    expect(msg).toContain('frozen ceiling is 1');
    expect(msg).toContain(exactIdentity('id', 'factions'));
    // A NEW identity must be named as new, not as growth — the swap's tell.
    expect(msg).toContain(`NEW      ${exactIdentity('foundingTier', 'steadings')}`);
    expect(msg).toContain('TO COMPLY');
    expect(msg).toContain('LOWER this file');
    expect(msg).toContain('Never raise a number');
  });

  test('identityOf is the key, exact executed origin, and NEVER the line number', () => {
    expect(identityOf(exactFinding('a.js', 7, 'id', 'factions')))
      .toBe(exactIdentity('id', 'factions'));
    expect(identityOf(exactFinding('a.js', 9, 'id', 'factions')))
      .toBe(exactIdentity('id', 'factions'));
    expect(identityOf({
      file: 'a.js', line: 1, pos: 1, site: exactSite('x'), key: 'x', text: 'row.x',
      shapes: ['b'], origins: ['root/b'],
    })).toBe(exactIdentity('x', 'b', 'root/b'));
  });

  test('the report/refreeze entry point is reachable as a named script', () => {
    expect(pkg.scripts['check:observed-shape-readers']).toContain('check-observed-shape-readers.mjs');
  });
});

describe('reader-with-no-writer ratchet: the EXECUTED corpus', () => {
  test('the producers ran and the corpus is not empty', () => {
    expect(corpus.meta.generations).toBeGreaterThanOrEqual(8);
    expect(corpus.meta.seeds).toBeGreaterThanOrEqual(3);   // a single seed is vacuous here
    expect(corpus.meta.pulseIntervals).toBeGreaterThan(0);
    expect(corpus.meta.steadingsMinted).toBeGreaterThan(0);
    expect(corpus.meta.simulationFlagsLit).toBeGreaterThan(20);
    expect(Object.keys(corpus.shapes).length).toBeGreaterThan(100);
  });

  test('THE PREMISE HOLDS: the four shapes the three defects live on were observed, and the keys are genuinely absent', () => {
    // Positive half — the census REACHED these shapes with real volume. Without
    // this, every absence below is the absence of everything.
    for (const name of ['factions', 'economicState', 'settlement', 'steadings']) {
      expect(corpus.shapes[name], `${name} was never observed — the corpus stopped measuring`).toBeTruthy();
      expect(corpus.shapes[name].rows).toBeGreaterThanOrEqual(MIN_ROWS);
      expect(corpus.shapes[name].keys.length).toBeGreaterThan(3);
    }
    // Negative half — the class's premise, measured, not assumed. Every absence
    // carries a LIVENESS ANCHOR: a sibling key the producers DO write on the
    // SAME shape, travelling the same walk. Without it "the key is absent" and
    // "the shape drifted away and the census measured nothing" are the same
    // green — which is the exact vacuity this whole walker exists to refuse.
    expectAbsentWithAnchor(corpus.shapes.factions.keys, 'id', 'name', 'TCD-1');
    expectAbsentWithAnchor(corpus.shapes.economicState.keys, 'exports', 'primaryExports', 'TCD-2');
    expectAbsentWithAnchor(corpus.shapes.settlement.keys, 'economy', 'economicState', 'TCD-2');
    expectAbsentWithAnchor(corpus.shapes.settlement.keys, 'trade', 'economicState', 'TCD-2');
    expectAbsentWithAnchor(corpus.shapes.steadings.keys, 'foundingTier', 'tier', 'TCD-3');
  });

  test('id-keyed maps are TRANSPARENT, so a parent id never enters a key set', () => {
    // `spatialLedgers.satellites` is `{ [parentId]: ParentSatellites }` and its
    // `steadings` is `{ [satId]: SatelliteRecord }`. If the dictionary detector
    // regressed, these shapes would carry engine-minted ids as "keys" and every
    // real read of them would be reported.
    expect(corpus.shapes.satellites.keys).toEqual(expect.arrayContaining(['steadings']));
    expect(corpus.shapes.satellites.keys.some((k) => k.startsWith('steading.'))).toBe(false);
    expect(corpus.shapes.steadings.keys.some((k) => k.includes('.'))).toBe(false);
    expect(corpus.shapes.steadings.keys).toEqual(expect.arrayContaining(['id', 'parentId', 'population']));
  });
});

describe('reader-with-no-writer ratchet: the live scan', () => {
  test('the scan reached the tree and resolved a real share of its reads', () => {
    expect(live.stats.files).toBeGreaterThan(500);
    expect(live.stats.reads).toBeGreaterThan(10_000);
    expect(live.stats.resolved).toBeGreaterThan(1_000);
  });

  test('SHRINK-ONLY: no file exceeds its frozen ceiling, and no row has vanished', () => {
    const { violations, stale } = compare(live.findings, baseline);
    expect(violations).toEqual([]);
    expect(stale).toEqual([]);
  });

  test('ANTI-VACUITY: the corpus and the resolver have not collapsed', () => {
    expect(sentinelFailures(sentinelOf(corpus, live.stats), baseline.sentinel)).toEqual([]);
  });
});

describe('reader-with-no-writer ratchet: the MUTANTS', () => {
  /** Self-contained modules planted into the scanned set. Each imports nothing,
   *  so each resolves through the ROOT NAME PRIOR alone — the same rule the
   *  estate uses — and each is written to a temp dir, never into the shared
   *  `src/` tree.
   *
   *  ⚠⚠ ALL SEVEN ARE SCANNED IN ONE PASS, and that changes NO probe's answer.
   *  They are seven separate FILES: nothing imports them, they import nothing,
   *  and `resolveSpec` only follows RELATIVE specifiers that land inside the
   *  scanned set, so no estate module can resolve into the temp dir and no probe
   *  can reach another. `declaredFns`/`imports`/`reExports` are per-file maps and
   *  `bindings` is keyed by scope node, so `probe` and `inner` in one file are
   *  invisible to the next. Findings partition by file, and every expectation
   *  below is byte-for-byte the expectation it carried when each probe bought
   *  its own full-tree scan — which is what made this file flake. */
  const PROBES = {
    // Both `inspect` declarations begin at source-file position 0. `fn.pos` alone
    // therefore aliases their parameter memo entries even though one call site
    // supplies `settlement` and the other supplies `save`.
    paramMemoSettlement: 'function inspect(value) { return value.__memoSettlement; }\n'
      + 'export function probe(settlement) { return inspect(settlement); }\n',
    paramMemoSave: 'function inspect(value) { return value.__memoSave; }\n'
      + 'export function probe(save) { return inspect(save); }\n',
    noWriter: 'export function probe(settlement) {\n'
      + '  return settlement.__noWriterEverWritesThisKey;\n'
      + '}\n',
    // `tier` exists on BOTH `settlement` and `steadings`; `population` exists on
    // both too. A detector that merely disliked unusual key names would flag the
    // negative control as well — this is the discrimination pin.
    observedKeys: 'export function probe(settlement) {\n'
      + '  return [settlement.tier, settlement.population, settlement.economicState];\n'
      + '}\n',
    nested: 'export function probe(settlement) {\n'
      + '  const ps = settlement.powerStructure;\n'
      + '  const rows = ps.factions;\n'
      + '  return rows.map((faction) => faction.id);\n'
      + '}\n',
    // The path that let TCD-3 escape the FIRST spelling of this scanner. Inside
    // `inner`, `bag` resolves to a PARAMETER SENTINEL, not a shape; a receiver
    // check that treated the sentinel as "grounded" looked up `shapes['@param0']`,
    // found nothing, and silently discarded the whole chain. `factions` has more
    // than one home, so it cannot be recovered by the ungrounded rule — this
    // probe is only reported while the sentinel is handled correctly.
    helper: 'function inner(bag) { return bag.powerStructure.factions; }\n'
      + 'export function probe(settlement) {\n'
      + '  return inner(settlement).map((faction) => faction.id);\n'
      + '}\n',
    arraySurface: 'export function probe(settlement) {\n'
      + '  const rows = settlement.powerStructure.factions;\n'
      + '  return rows.length + rows.filter(Boolean).length;\n'
      + '}\n',
  };

  /** probe name -> that probe's OWN findings, from the single combined scan. */
  let planted = null;

  const hitsFor = (name) => {
    expect(planted, 'the combined plant scan did not run — every mutant below would be vacuous').not.toBe(null);
    return planted[name];
  };

  beforeAll(() => {
    const dir = mkdtempSync(join(tmpdir(), 'osr-mutant-'));
    const basenames = Object.fromEntries(Object.keys(PROBES).map((name) => [name, `probe_${name}.js`]));
    for (const [name, body] of Object.entries(PROBES)) writeFileSync(join(dir, basenames[name]), body);
    const out = scanEstateWith(Object.values(basenames).map((b) => join(dir, b)));
    planted = Object.fromEntries(Object.keys(PROBES)
      .map((name) => [name, out.findings.filter((f) => f.file.endsWith(basenames[name]))]));
  }, 300_000);

  test('THE PARTITION HOLDS: each probe was planted and is addressed by its own file', () => {
    // Without this, a basename typo would hand every mutant an EMPTY array and
    // the two negative controls below would pass on nothing at all — the exact
    // vacuity the single-scan refactor could have introduced.
    expect(Object.keys(planted).sort()).toEqual(Object.keys(PROBES).sort());
    expect(hitsFor('noWriter').length + hitsFor('nested').length + hitsFor('helper').length)
      .toBe(3);
  });

  test('THE PARAMETER MEMO IS FILE-SCOPED: same-position helpers keep distinct shapes', () => {
    expect(PROBES.paramMemoSettlement.indexOf('function inspect')).toBe(0);
    expect(PROBES.paramMemoSave.indexOf('function inspect')).toBe(0);
    expect(hitsFor('paramMemoSettlement').map(({ key, shapes }) => ({ key, shapes })))
      .toEqual([{ key: '__memoSettlement', shapes: ['settlement'] }]);
    expect(hitsFor('paramMemoSave').map(({ key, shapes }) => ({ key, shapes })))
      .toEqual([{ key: '__memoSave', shapes: ['save'] }]);
  });

  test('THE MUTANT REDS: a planted reader of a key with no writer is reported', () => {
    const hits = hitsFor('noWriter');
    expect(hits.length).toBe(1);
    expect(hits[0].key).toBe('__noWriterEverWritesThisKey');
    expect(hits[0].shapes).toEqual(['settlement']);
  });

  test('THE MUTANT SHAPE-CHECKS: the SAME key is silent on a shape that carries it', () => {
    expect(hitsFor('observedKeys')).toEqual([]);
  });

  test('THE MUTANT REACHES A NESTED SHAPE, not just the root', () => {
    const hits = hitsFor('nested');
    expect(hits.map((h) => h.key)).toEqual(['id']);
    expect(hits[0].shapes).toEqual(['factions']);
  });

  test('THE MUTANT CROSSES A HELPER: a parameter sentinel does not kill the chain', () => {
    const hits = hitsFor('helper');
    expect(hits.map((h) => h.key)).toEqual(['id']);
    expect(hits[0].shapes).toEqual(['factions']);
  });

  test('THE MUTANT IS SILENT ON AN ARRAY: array surface is never a domain key', () => {
    expect(hitsFor('arraySurface')).toEqual([]);
  });

  test('⚠⚠ THE SCAN BUDGET: exactly TWO full-tree scans, never one per mutant', () => {
    // THE DETERMINISM RATCHET. See the scan-budget note at the top of this file:
    // one `scanReaders` costs 13,447–15,904 ms under full-suite contention, and
    // six of them — five inside test bodies on the bare 20,000 ms default — is a
    // 1.26x margin that produced 0, 2 and 5 timeout failures across three runs
    // at ONE sha. Both surviving scans live in `beforeAll` hooks with explicit
    // 300s hook timeouts.
    //
    // If this number grows, a per-test scan has come back. SHARE the scan — do
    // NOT raise a timeout to cover it, and do NOT baseline the resulting
    // failure: a timeout frozen into scripts/.test-ratchet-baseline.json is a
    // phantom that can never be burned down.
    expect(scansRun, 'a full-tree scan was added — share it instead of buying headroom').toBe(2);
  });

  test('RATCHET FAILURE PATHS: growth, a vanished row, and a collapsed corpus each red', () => {
    const RP = 'src/domain/rulingPower.js';
    const findings = [
      exactFinding(RP, 1, 'id', 'factions'),
      exactFinding(RP, 2, 'id', 'factions', 'test/factions', 1),
    ];
    const exactInventory = inventoryOf(findings);
    // (a) one exact site absent from the frozen inventory
    expect(compare(findings, { inventory: { [RP]: { [exactIdentity('id', 'factions')]: 1 } } }).violations)
      .toHaveLength(1);
    // (b) exact site inventory — the control that keeps (a) honest
    expect(compare(findings, { inventory: exactInventory }).violations).toEqual([]);
    // (c) an UNBASELINED file has ceiling ZERO — the law for all new work
    expect(compare([exactFinding('src/brand/new.js', 1, 'k', 'settlement')], { inventory: {} }).violations)
      .toHaveLength(1);
    // (d) a row whose file is gone is fatal, not merely bankable
    expect(compare([], { inventory: { 'src/does/not/exist.js': { [exactIdentity('k', 's')]: 1 } } }).stale)
      .toHaveLength(1);
    // (e) an unbanked shrink is stale: exact schema-3 inventory has no headroom.
    const shrunk = compare([findings[0]], { inventory: exactInventory });
    expect(shrunk.violations).toEqual([]);
    expect(shrunk.stale).toHaveLength(1);
    // (f) a collapsed corpus is refused
    expect(sentinelFailures({ usableShapes: 1, totalKeys: 1, resolvedReads: 1 }, baseline.sentinel).length)
      .toBeGreaterThanOrEqual(3);
    expect(sentinelFailures(baseline.sentinel, baseline.sentinel)).toEqual([]);
  });

  test('⚠⚠ THE SWAP MUTANT: a NEW identity at CONSTANT COUNT reds (the defect form one let land)', () => {
    const RP = 'src/domain/rulingPower.js';
    const held = [
      exactFinding(RP, 1, 'id', 'factions'),
      exactFinding(RP, 2, 'id', 'factions', 'test/factions', 1),
    ];
    const frozen = { inventory: inventoryOf(held) };
    // CONTROL — same identities, same count: green.
    expect(compare(held, frozen).violations).toEqual([]);
    // MUTANT — one finding REMOVED, a different one ADDED. The file's total is
    // identical, so the retired count-only ratchet was green here.
    const swapped = [held[0], exactFinding(RP, 2, 'foundingTier', 'steadings')];
    expect(swapped.length, 'the mutant must hold the count constant or it proves nothing').toBe(held.length);
    const out = compare(swapped, frozen);
    expect(out.violations).toHaveLength(1);
    expect(out.violations[0]).toContain('foundingTier on steadings @ test/steadings');
    expect(out.violations[0]).toContain('ceiling 0');
    // and the departed site is stale, not swallowed silently
    expect(out.stale.join('\n')).toContain(exactIdentity('id', 'factions', 'test/factions', 1));
  });

  test('⚠⚠ THE SWAP MUTANT, LIVE: rulingPower.js swapped at constant count against the REAL baseline', () => {
    // The verifier drove exactly this against the real frozen inventory. It is
    // repeated here on live findings so the proof re-executes on every gate.
    const RP = 'src/domain/rulingPower.js';
    const rows = live.findings.filter((f) => f.file === RP);
    expect(rows.length, `${RP} carries no findings — pick another live subject`).toBeGreaterThan(0);
    const others = live.findings.filter((f) => f.file !== RP);
    // the tree as it stands is green
    expect(compare(live.findings, baseline).violations).toEqual([]);
    // drop one real finding, add one that no writer produces: SAME COUNT
    const swapped = [
      ...rows.slice(1),
      exactFinding(RP, 1, '__swappedInNoWriterKey', 'settlement', 'settlement'),
    ];
    expect(swapped.length).toBe(rows.length);
    const out = compare([...others, ...swapped], baseline);
    expect(out.violations, 'a constant-count identity swap MUST red — this is the whole cure').toHaveLength(1);
    expect(out.violations[0]).toContain('__swappedInNoWriterKey on settlement @ settlement');
  });

  test('inventoryOf counts per file AND per identity', () => {
    expect(inventoryOf([
      exactFinding('b.js', 1, 'x', 's'),
      exactFinding('a.js', 1, 'x', 's'),
      exactFinding('b.js', 2, 'y', 's'),
      exactFinding('b.js', 3, 'x', 's', 'test/s', 1),
    ])).toEqual({
      'a.js': { [exactIdentity('x', 's')]: 1 },
      'b.js': {
        [exactIdentity('x', 's')]: 1,
        [exactIdentity('x', 's', 'test/s', 1)]: 1,
        [exactIdentity('y', 's')]: 1,
      },
    });
  });
});
