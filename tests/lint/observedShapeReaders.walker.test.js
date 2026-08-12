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
 * ── ⭐⭐ THE AUTHORITY THIS FILE DRIVES IS THE HEURISTIC LEG (schema 4) ────────
 *
 * It used to drive the EXACT resolver over the whole estate. It cannot any more,
 * and the reason is measured, not stylistic: a full-tree exact scan WALLS at
 * `src/data/constants.js:56` on `abstract-state growth steps 16385 > 16384`
 * (~4.2 min on a 12 GB heap; at a default heap the process OOMs before the
 * growth budget can even fire). `budgetFailure` THROWS and nothing catches it,
 * so the `beforeAll` hook here exploded — and vitest reports that as a FAILED
 * suite whose every test is a SKIP. Twenty-four tests silently drained into the
 * skip ceiling. That is precisely the hole CR-TRFZ-4 was built to expose, and
 * this file was its motivating instance.
 *
 * CR-OSR-FREEZE-1/2/3-R1 retired full-tree exact resolution as an ambition and
 * made the governed heuristic (`legacy-leaf`) detector the standing authority.
 * So this walker drives THAT detector, against the schema-4 leaf identity
 * `<key> on <shape>` with a per-file MULTIPLICITY. MEASURED at this tree: the
 * live scan costs ~3.3 s (the exact one cost 13.4–15.9 s when it completed at
 * all), 2,083 files, 120,442 reads, 9,265 resolved, 2,196 findings across 397
 * files / 1,527 identities.
 *
 * ⚠ WHAT DID NOT CHANGE: every mutant below. All seven planted probes were
 * RE-MEASURED under the leaf detector before this file was rewired, and each
 * reports byte-identically to what it reported under the exact one — the five
 * positives fire, both negative controls stay silent. A detector swap that
 * quietly weakened the instrument would have shown up there first.
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
 * ⚠ THE ACCEPTANCE RUN IS NOT RE-EXECUTED HERE. It needs a second checkout of a
 * historical sha, and this program's concurrency law refuses a second worktree.
 * What runs on every gate instead is the LIVE instrument plus the planted
 * mutants below, which drive the identical detector.
 *
 * ── ⚠⚠ THE INVENTORY IS CORPUS-SENSITIVE, AND NOT ONLY WHERE YOU EDITED ──────
 * The layering repair at 67f8a58e once turned this walker red in ELEVEN files,
 * NINE of which that commit never touched, their source byte-identical across
 * it. MEASURED then: the corpus and the reads were IDENTICAL; only RESOLVED
 * moved (12,411 -> 12,433). Perturbing the scanned file SET re-grounds
 * receivers. The heuristic leg is if anything MORE corpus-sensitive, because it
 * grounds a receiver by a name prior over the observed shape set: as the corpus
 * gains shapes, a name that had a single home acquires several and stops
 * resolving at all.
 *
 * WHAT THAT MEANS FOR YOU. Do not read a row as a confirmed defect without
 * checking the site. And expect this walker to red on any commit that adds or
 * moves source files, in files that commit never touched: that is this property,
 * not a regression you caused.
 *
 * ── WHAT THIS FILE PINS ─────────────────────────────────────────────────────
 *   1. STATIC — the baseline is internally consistent, every row names a real
 *      file, and the frozen thresholds match the script's own constants.
 *   2. EXECUTED CORPUS — the producers are RUN (once, shared by every assertion
 *      below) and the corpus is proved to have observed the four shapes the
 *      three defects live on, with the exact key ABSENCES that make the class
 *      real. An empty corpus greens everything; this is the pin that makes every
 *      other green here mean something.
 *   3. EXECUTED MUTANTS — synthetic readers of keys PROVEN to have no writer are
 *      planted into the scanned set and the walker MUST report them, with
 *      negative controls (observed keys, array surface) that must stay silent.
 *      A walker that stays green under its own mutant is not a walker.
 *   4. EXECUTED GROWTH LAW — the shrink-only comparison is driven against a
 *      LIVE-DERIVED inventory in both directions: clean is green, and a single
 *      planted finding reds with its identity named. A growth rule that only
 *      exists in a test TITLE constrains nothing.
 *   5. EXECUTED SWAP MUTANT — the one that beat the ratchet's FIRST form.
 *   6. THE CR-OSR-FREEZE-7 UI COHORT — derived from the live scan, pinned at its
 *      MEASURED size, and proved to be under enforcement rather than excluded.
 *
 * ── ⚠⚠ WHY THE INVENTORY IS CONTENT-ADDRESSED (the swap that beat form one) ──
 * The first spelling froze ONE NUMBER per file. A number cannot tell a defect
 * from its neighbour: a verifier drove it live on `src/domain/rulingPower.js`
 * (ceiling 10) and showed that REMOVING one real finding and ADDING a different
 * one leaves the count unchanged — so a fresh reader-without-a-writer lands and
 * the ratchet reports nothing. The inventory freezes the finding IDENTITY with
 * its multiplicity, and a NEW identity in an already-listed file has ceiling 0
 * exactly as a new file does. That exact mutant is driven twice below —
 * synthetically, and against the LIVE rulingPower.js findings at constant count.
 */
import { readFileSync, existsSync, writeFileSync, mkdtempSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, test, beforeAll } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { buildObservedCorpus } from '../../scripts/lib/observed-shape-corpus.mjs';
import { scanReaders as scanLegacyReaders } from '../../scripts/lib/legacy-reader-shape-scan.mjs';
import {
  applyDomGlobalReceiverFilter, applyExplainedWriterFilter, applyLanguageSurfaceFilter,
  applyShapeFamilyFilter,
  BASELINE_SCAN_MODE, BASELINE_SCHEMA, cohortOf, compare, EXACT_SCAN_EXCLUDED_SCOPE,
  identityOf, inventoryOf, isExactScanExcludedReadPath, MIN_ROWS, ORIGIN_MIN_ROWS,
  ratchetMessage, rowOf, sentinelFailures, sentinelOf, sourceFiles, UNREVIEWED_UI_COHORT,
} from '../../scripts/check-observed-shape-readers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.observed-shape-readers-baseline.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

/** A heuristic-leaf finding: six keys exactly, no `site` and no `origins`. */
const leafFinding = (file, pos, key, shape) => ({
  file, line: 1, pos, key, shapes: [shape], text: `row.${key}`,
});
const leafIdentity = (key, shape) => `${key} on ${shape}`;

/** The producers run ONCE for the whole file. Every executed pin reads this. */
let corpus = null;
let live = null;
/** The estate's file list, walked ONCE — every scan below reuses it. */
let estate = null;

/**
 * ⚠⚠ THE SCAN BUDGET — why this file counts its own full-tree scans.
 *
 * This file used to run SIX full-tree scans — one live, plus one per mutant —
 * and five of them ran INSIDE TEST BODIES against the bare global
 * `testTimeout: 20000` (vite.config.js). The exact scan cost 13,447–15,904 ms
 * under full-suite contention: a 1.26x worst-case margin, and it did not hold.
 * Three full-suite runs at ONE sha produced 0, 2 and 5 failures, all TIMEOUTS
 * with no assertion diff (`Error: STACK_TRACE_ERROR`, 21,173–26,069 ms). A flaky
 * gate is worse than a red one — it teaches everyone to re-run until green and
 * it silently invalidates every census taken through it.
 *
 * The cure was the one the cost demanded: cut the work, do not buy headroom. The
 * scans happen TWICE, both inside `beforeAll` hooks, and `scansRun` is pinned
 * below so re-introducing a per-test scan reds instead of flaking. The heuristic
 * detector is far cheaper (~3.3 s MEASURED), but the discipline stays: a cheap
 * scan multiplied by twenty is not cheap.
 *
 * ── ⚠⚠ THE HOOK BUDGET WAS SIZED AGAINST THE SOLO FIGURE AND WAS A LATENT FLAKE
 * The budget was 300 s because this header believed "the corpus build alone is
 * ~47 s". That 47 s is the SOLO cost. MEASURED 2026-08-11 with the full suite
 * running in parallel, which is the only condition the gate ever runs this in:
 *
 *     buildObservedCorpus()   251,002 ms      ← 84% of the old 300 s budget
 *     the detector scan        11,675 ms
 *     the two schema-5 filters    108 ms      ← 0.04% of the total
 *     ────────────────────────────────────
 *     top-level beforeAll     ~263,700 ms
 *
 * A 300 s budget over a 264 s job is a 1.14x margin — the same shape as the 1.26x
 * margin recorded above, which "did not hold" — and it duly did not hold here
 * either: the hook timed out at 306,759 ms in a full `npm run check`, taking all
 * 27 tests out of the census as SKIPS, which the test ratchet's scope sentinel
 * correctly refuses as vacuous.
 *
 * ⚠ THIS IS A RE-SIZING AGAINST A MEASUREMENT, NOT HEADROOM-BUYING, and the
 * distinction is the whole reason the numbers are above rather than described.
 * There is no work left to cut: the corpus build IS this walker's premise, the
 * scan count is already pinned at two, and the filters that were ADDED in the
 * same change are 0.04% of the cost — arithmetically incapable of being what
 * tipped it. 900 s is 3.4x the measured contended cost, so a genuine collapse
 * (a corpus that stops terminating) still reds rather than hanging the gate.
 */
let scansRun = 0;

/**
 * The one place the detector is called. `extraFiles` are planted probes.
 *
 * ⭐⭐ THE WALKER MUST MEASURE WHAT THE GATE MEASURES — the walker-census law. Under
 * schema 6 the frozen inventory is the detector's output NARROWED by FOUR declared
 * post-filters, so a walker that compared the RAW detector output against it would
 * report every filtered row as a violation and stay red forever, and whoever
 * silenced it would have disabled the guard rather than fixed the walker. All four
 * filters are therefore applied HERE, in the same order `run()` applies them.
 *
 * ⛔ THE STANDING HAZARD THIS COMPOSITION IS: it is COMPOSED BY HAND, so a mint
 * that adds a filter to `run()` and not to this line leaves a walker that greens
 * on rows the gate clears — a disabled guard that reports success. Any change to
 * the chain in `run()` is a change HERE, in the SAME commit, and the arithmetic
 * pin below is what turns a forgotten one into a red instead of a silent pass.
 *
 * ⚠ `stats` passes through all four filters BY IDENTITY, so `live.stats` is still
 * the DETECTOR's reach and the anti-vacuity arm below keeps measuring the detector
 * rather than the filters. That is the property that stops a threshold from ever
 * being tuned into hiding a corpus that stopped observing.
 */
function scanEstateWith(extraFiles = []) {
  scansRun += 1;
  const raw = scanLegacyReaders({
    files: extraFiles.length ? [...estate, ...extraFiles] : estate,
    shapes: corpus.shapes,
    arrayShapes: corpus.arrayShapes,
    singleHome: corpus.singleHome,
    rootShapes: corpus.rootShapes,
    minRows: MIN_ROWS,
    root: ROOT,
  });
  const family = applyShapeFamilyFilter({ scanMode: BASELINE_SCAN_MODE, corpus, scan: raw });
  const domGlobals = applyDomGlobalReceiverFilter({
    scanMode: BASELINE_SCAN_MODE, corpus, scan: family,
  });
  const language = applyLanguageSurfaceFilter({
    scanMode: BASELINE_SCAN_MODE, corpus, scan: domGlobals,
  });
  return {
    ...applyExplainedWriterFilter({ scanMode: BASELINE_SCAN_MODE, scan: language }),
    raw,
  };
}

beforeAll(async () => {
  corpus = await buildObservedCorpus();
  estate = sourceFiles(ROOT);
  live = scanEstateWith();
}, 900_000);

describe('reader-with-no-writer ratchet: the frozen inventory', () => {
  test('the baseline is CONTENT-ADDRESSED, internally consistent, and every row is a real file', () => {
    expect(baseline.schema, 'schema 1 was the count-only form — blind to an identity swap;'
      + ' schema 3 was the RETIRED exact per-site form, which no full-tree scan can produce;'
      + ' schema 4 was the RETIRED UNFILTERED leaf form; schema 5 was the RETIRED leaf form'
      + ' narrowed by M6 and M8/M9 alone, whose rows still include the browser-surface and'
      + ' language-surface reads the declared M11 and M12 post-filters explain')
      .toBe(BASELINE_SCHEMA);
    const rows = Object.entries(baseline.inventory);
    expect(rows.length).toBeGreaterThan(0);
    // Every row is an identity map, never a bare count. This is the pin that
    // refuses a hand-edit back to the form the swap mutant beat.
    expect(rows.filter(([, r]) => typeof r !== 'object' || r === null || Array.isArray(r))).toEqual([]);
    const ids = rows.flatMap(([, r]) => Object.entries(r));
    expect(ids.reduce((n, [, c]) => n + c, 0)).toBe(baseline.total);
    expect(ids.length).toBe(baseline.identities);
    expect(ids.every(([, c]) => Number.isInteger(c) && c > 0)).toBe(true);
    // An identity is `<key> on <shape>` — the spelling the script mints, and
    // never the retired exact one, which carries ` @ origin # site`.
    expect(ids.filter(([id]) => !/^\S+ on \S+$/.test(id))).toEqual([]);
    const missing = rows.map(([f]) => f).filter((f) => !existsSync(join(ROOT, f)));
    expect(missing).toEqual([]);
    // Forward slashes only: a backslashed key reads differently on POSIX and
    // Windows CI — spurious reds on one, unlimited headroom on the other.
    expect(rows.filter(([f]) => f.includes('\\'))).toEqual([]);
  });

  test('the retired count-only row form is REFUSED, and multiplicity is ACCEPTED', () => {
    // Accepting `10` as a row would restore "any ten findings you like" — the
    // exact headroom the swap mutant exploited.
    expect(() => rowOf(10, 'src/x.js')).toThrow(/RETIRED count-only form/);
    // A leaf identity legitimately covers several reads in one file.
    expect(rowOf({ [leafIdentity('id', 'factions')]: 2 }, 'src/x.js'))
      .toEqual({ [leafIdentity('id', 'factions')]: 2 });
    // ⚠⚠ And the RETIRED exact spelling cannot be smuggled into a schema-4 row.
    expect(() => rowOf({ 'id on factions @ root/factions # v2|x': 1 }, 'src/x.js'))
      .toThrow(/heuristic identity is malformed/);
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
      { identity: leafIdentity('id', 'factions'), count: 3, ceiling: 1 },
      { identity: leafIdentity('foundingTier', 'steadings'), count: 1, ceiling: 0 },
    ]);
    expect(msg).toContain('frozen ceiling is 1');
    expect(msg).toContain(leafIdentity('id', 'factions'));
    // A NEW identity must be named as new, not as growth — the swap's tell.
    expect(msg).toContain(`NEW      ${leafIdentity('foundingTier', 'steadings')}`);
    expect(msg).toContain('TO COMPLY');
    expect(msg).toContain('LOWER this file');
    expect(msg).toContain('Never raise a number');
  });

  test('identityOf is the key on the observed shape, and NEVER the line number', () => {
    expect(identityOf(leafFinding('src/a.js', 7, 'id', 'factions')))
      .toBe(leafIdentity('id', 'factions'));
    expect(identityOf(leafFinding('src/a.js', 9, 'id', 'factions')))
      .toBe(leafIdentity('id', 'factions'));
    expect(identityOf(leafFinding('src/a.js', 1, 'x', 'b'))).toBe(leafIdentity('x', 'b'));
    // The RETIRED exact finding shape is refused outright rather than
    // leaf-spelled: a schema-3 artifact cannot be folded into this inventory.
    expect(() => identityOf({
      ...leafFinding('src/a.js', 1, 'x', 'b'), site: 'v2|x', origins: ['root/b'],
    })).toThrow(/legacy finding has noncanonical fields/);
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
    expect(live.findings.length).toBeGreaterThan(0);
  });

  test('SHRINK-ONLY: no file exceeds its frozen ceiling, and no row has vanished', () => {
    const { violations, stale } = compare(live.findings, baseline);
    // The counts assert FIRST so a red here is readable: the arrays hold whole
    // multi-line ratchet messages and their diff is unreadable at scale.
    // ⛔ THE CURE FOR A RED HERE IS THE GOVERNED RE-FREEZE, NEVER A HAND-EDIT: `baselineOf` derives
    // `inventory`, `total` and `identities` from ONE scan, together. The message carries the rest.
    expect(
      { violations: violations.length, stale: stale.length },
      'the live heuristic inventory must exactly match the frozen one. A lawful shrink is'
      + ' `node scripts/check-observed-shape-readers.mjs --write` on a clean tree — it re-derives'
      + ' inventory, total and identities together and refuses anything that is not a shrink.'
      + ' NEVER hand-edit a row: that throws "observed-shape baseline totals are inconsistent"'
      + ' out of validateLeafBaseline (scripts/lib/observed-shape-baseline.mjs).',
    ).toEqual({ violations: 0, stale: 0 });
    expect(violations).toEqual([]);
    expect(stale).toEqual([]);
  });

  test('ANTI-VACUITY: the corpus and the resolver have not collapsed', () => {
    expect(sentinelFailures(sentinelOf(corpus, live.stats, BASELINE_SCAN_MODE), baseline.sentinel))
      .toEqual([]);
    // ⚠⚠ THE SENTINEL IS BUILT FROM THE DETECTOR'S OWN STATS, NOT THE FILTERED
    // SCAN'S. Both schema-5 post-filters pass `stats` through BY IDENTITY, and
    // that is the property being asserted: if a filter ever recomputed stats from
    // its own output, every clearing would lower the anti-vacuity floor and the
    // floor would stop meaning "the corpus is still observing".
    expect(live.stats).toBe(live.raw.stats);
  });

  /**
   * ⭐⭐⭐ ALL FOUR SCHEMA-6 POST-FILTERS ARE NON-VACUOUS ON THE LIVE ESTATE.
   *
   * A filter that clears nothing is indistinguishable from a filter that is not
   * wired in — and the whole of schema 6 is the claim that these four narrow the
   * detector's output. So the narrowing is asserted against the REAL tree, in
   * both directions: the filtered set is strictly smaller than the raw one, the
   * gap is exactly the four filters' own reported clearings, and each filter's
   * own founding case is shown present in the raw scan and absent afterwards.
   *
   * ⛔ THE ARITHMETIC LINE IS THE GUARD ON THE HAND-COMPOSED CHAIN ABOVE. If a
   * later mint adds a fifth filter to `run()` and forgets this file, the walker
   * measures a LARGER set than the gate, the sum stops closing, and this reds —
   * which is the only reason a hand-composed chain is tolerable at all.
   */
  test('the schema-6 post-filters NARROW the live scan, and by exactly what they report', () => {
    expect(live.familyFilter.applied).toBe(true);
    expect(live.domGlobals.applied).toBe(true);
    expect(live.languageSurface.applied).toBe(true);
    expect(live.explainedWriters.applied).toBe(true);
    expect(live.findings.length).toBeLessThan(live.raw.findings.length);
    // The arithmetic closes with nothing left over: raw − each filter = live.
    const clearedTotal = live.familyFilter.cleared + live.domGlobals.cleared
      + live.languageSurface.cleared + live.explainedWriters.cleared;
    expect(live.raw.findings.length - clearedTotal).toBe(live.findings.length);
    // Each is independently NON-VACUOUS — a zero here is a filter that is not
    // reaching the estate, which the sum above cannot distinguish from absence.
    expect(live.familyFilter.cleared).toBeGreaterThan(0);
    expect(live.domGlobals.cleared).toBeGreaterThan(0);
    expect(live.languageSurface.cleared).toBeGreaterThan(0);
    expect(live.explainedWriters.cleared).toBeGreaterThan(0);

    // ⭐ EACH FILTER'S FOUNDING CASE, PRESENT RAW AND ABSENT FILTERED. Without
    // the raw half these are "the identity is not in the set", which is also
    // true of every identity that never existed.
    const founding = {
      familyFilter: 'populationDeltas on outcome',
      domGlobals: 'replaceState on history',
      languageSurface: 'toLocaleString on history',
      explainedWriters: 'neighbourNetwork on settlement',
    };
    for (const [filter, identity] of Object.entries(founding)) {
      expect(live.raw.findings.some((f) => identityOf(f) === identity),
        `${identity} is absent from the RAW scan — ${filter}'s control is vacuous`).toBe(true);
      expect(live.findings.some((f) => identityOf(f) === identity),
        `${identity} survived ${filter}`).toBe(false);
      expect(live[filter].clearedIdentities).toContain(identity);
    }
    // The explained-writer set is EXACT, because it is the one filter whose
    // membership is hand-declared rather than derived from a rule.
    expect([...live.explainedWriters.clearedIdentities].sort()).toEqual([
      'factions on locks',
      'neighbourNetwork on settlement',
      'stresses on settlement',
      'worldPulse on campaignState',
    ]);
    // M11 names the receiver it fired on, so a filter that started matching
    // something other than a host global would be visible rather than merely
    // arithmetically larger.
    expect(live.domGlobals.receivers).toEqual(['window']);
    expect(live.languageSurface.clearedIdentities).toEqual(['toLocaleString on history']);

    // ⚠ SAID AS DISJOINTNESS RATHER THAN AS BARE EXCLUSIONS. An unanchored
    // exclusion would pass just as happily if a filter had drifted to clearing
    // NOTHING — it would outlive the very regression it is written to catch. The
    // non-emptiness assertions above are the liveness anchor, and disjointness is
    // the stronger claim anyway: two filters that both claim an identity mean one
    // is redundant and the reported arithmetic stops being additive. It is also
    // the measured property that makes the chain ORDER immaterial.
    const claimed = [
      live.familyFilter.clearedIdentities, live.domGlobals.clearedIdentities,
      live.languageSurface.clearedIdentities, live.explainedWriters.clearedIdentities,
    ].flat();
    expect(claimed.length, 'two schema-6 filters both claim the same identity')
      .toBe(new Set(claimed).size);
  });

  /**
   * ⭐⭐ CR-OSR-FREEZE-7 — THE UNREVIEWED-UI COHORT, MEASURED AT THIS TREE.
   *
   * Making the heuristic leg the gate authority pulls `src/components/` into
   * direct enforcement. The literal below is the MEASURED figure for the live
   * scan, not a transcription from the ruling — CR-OSR-FREEZE-4-R1 records that
   * the ruling's "88 files / 250 identities" was the SCHEMA-2 predecessor's
   * slice, produced by a DIFFERENT detector, and a pin written to it would red
   * on first measurement.
   *
   * It is pinned against the LIVE SCAN rather than the frozen baseline on
   * purpose: it is then green immediately and stays green across the genesis,
   * so it never becomes a second number a freeze has to remember to move.
   *
   * ⭐ MOVED 2026-08-11 BY REPAIR, NOT BY DRIFT: 53/162/260 → 53/153/249. The
   * UI-cohort triage's display repairs deleted NINE reader identities that no
   * writer had ever produced — `campaignId on save` (ProvenanceBlock, 2 reads),
   * `port`/`tradeRouteAccess on settlement` (PlacementsLayer, 1 each),
   * `culture`/`cultureName`/`terrain on settlement` (PlacementDetailCard, 1
   * each) and `decreed`(2)/`source`(1)/`visibility`(1) `on stressors`
   * (heraldFeed) — eleven reads across nine identities. The file count is
   * unchanged because no file lost ALL of its rows. This is the cohort SHRINKING
   * as rows are triaged and cured, which is the direction the ratchet exists to
   * permit; the frozen inventory's matching nine rows are deleted by the
   * `--write` re-freeze, which only runs from a committed tree.
   *
   * ⭐ MOVED AGAIN 2026-08-11 BY THE DOMAIN-SIDE REPAIR, SAME DIRECTION:
   * 53/153/249 → 53/152/248. Exactly ONE cohort row went, and it is the only one
   * that COULD: of the seven identities that lane deleted, six live outside
   * `src/components/` (`__adjudicationPending`/`__forecast`/`__resolution on
   * stressors` in domain/realm/heraldRouting.js, `evidenceId on outcome` in
   * domain/worldPulse/warCoalitionEvidence.js, and `title on currentTensions` in
   * generators/aiLayer.js and generators/narrative/siegeCapability.js). The
   * seventh, `title on currentTensions` in components/new/dailyLifeLogic.js, is
   * the cohort member: one identity, one read, hence −1/−1. `files` holds at 53
   * because dailyLifeLogic keeps its other three rows — the whole-file drop in
   * this repair was siegeCapability.js, which is not a cohort path.
   *
   * ⭐ MOVED AGAIN 2026-08-11 BY THE OWNER-RULED DISPLAY LANE, SAME DIRECTION:
   * 53/152/248 → 53/150/246. The owner ruled that NOTHING INTRINSICALLY MAKES A
   * SETTLEMENT A CAPITAL — the closest in-system analog is an overlord — so the
   * two `capital on settlement` / `isCapital on settlement` rows in
   * components/map/PlacementsLayer.jsx are not an unwired feature but a concept
   * ABSENT FROM THE WORLD MODEL, and both were deleted. One read each, hence
   * −2 identities / −2 counts, and BOTH are cohort members because
   * PlacementsLayer.jsx is a `src/components/` path. `files` holds at 53 because
   * that file keeps its other four rows (`ancientRuin on history` 2,
   * `lifecycleStatus on config` 2, `lifecycleStatus on settlement` 1,
   * `settlement on settlement` 3) — this repair dropped no file entirely.
   * ⚠ THE TWO DELETIONS WERE ALSO DEAD A SECOND, INDEPENDENT TIME: TierIcon's
   * gold fill was unreachable AND its `tierFor` allowlists six tiers with the
   * size-tier token absent, so the flag sense and the tier sense could never
   * cross-wire. The frozen inventory's matching two rows are deleted by the
   * `--write` re-freeze, which only runs from a committed tree.
   *
   * ⭐⭐ MOVED BY THE SCHEMA-5 MINT (2026-08-11), AND THIS TIME BY THE INSTRUMENT
   * RATHER THAN BY A REPAIR: 53/150/246 → 51/128/193. `live` is now the FILTERED
   * scan, because schema 5's inventory is the filtered set and a walker measuring
   * something else is not a walker. ⚠ THE RAW READING IS UNCHANGED at 53/150/246 —
   * asserted directly below on `live.raw`, so the delta is provably the filters
   * and provably not drift in the estate.
   *
   * ⭐ DERIVED TWICE, INDEPENDENTLY, AND THE TWO AGREE EXACTLY. Once by taking
   * `cohortOf` of the filtered inventory (51/128/193), and once by summing the
   * CLEARED reads that sit under a cohort path straight off the finding arrays:
   * 53 reads over 22 (file, identity) addresses, spanning `neighbourNetwork on
   * settlement` plus seventeen `… on stressors` family rows. 150 − 22 = 128 and
   * 246 − 53 = 193 close on the nose, and `files` drops 53 → 51 because exactly
   * two cohort files lost ALL of their rows. Had anything else moved in this
   * window the two derivations would have disagreed.
   *
   * ⭐ MOVED AGAIN 2026-08-11 BY THE H9 REPAIR, SAME DIRECTION, BOTH READINGS:
   * filtered 51/128/193 → 51/127/192 and raw 53/150/246 → 53/149/245. `recentEvents
   * on settlement` was deleted at BOTH of its reader sites in one change —
   * components/OutputContainer.jsx (the cohort member, 1 read) and
   * store/aiChronicleContext.js (1 read, outside `src/components/` and so invisible
   * to these two figures). ONE identity, ONE read, hence −1/−1 on each reading, and
   * `files` holds at 51 because OutputContainer keeps its other five rows
   * (`canonizedAt on campaignState` 1, `primaryDeitySnapshot on config` 2,
   * `startedAt on campaignState` 1, `worldPulse on campaignState` 1, `worldState on
   * campaignState` 2). BOTH readings move by the same −1/−1, which is the property
   * this pair exists to expose: the drop is the estate genuinely shrinking, not the
   * filters clearing more.
   * ⚠ THE SAME CHANGE REPAIRED aiChronicleContext's world lane (CR-S6-6) by pointing
   * it at the campaign's worldState.pulseHistory, and that added ZERO identities —
   * measured, not assumed: the run that produced the two figures above reported
   * `violations: 0`. The new reads are spelled the way the already-clean sibling
   * spells them (a call-result receiver, which the name prior does not ground).
   * ⚠⚠ `worldPulse on campaignState` DELIBERATELY SURVIVES in both files. It is the
   * legacy per-save fallback the dossier Chronicle also kept, so the repair does not
   * silently narrow behaviour for a save that happens to carry the old shape.
   * ⛔ THE FROZEN INVENTORY STILL CARRIES THE TWO DELETED ROWS, so SHRINK-ONLY reads
   * `stale: 2` until a `--write` re-freeze — which only runs from a committed tree
   * with a clean `src/`, and was BLOCKED at this commit by a concurrent lane's
   * uncommitted src/generators/factionRoles.js. Owed, not forgotten. (Discharged at
   * `33487c77`, the re-freeze that deleted exactly those two rows.)
   *
   * ⭐⭐ MOVED BY THE SCHEMA-6 MINT (2026-08-11), BY THE INSTRUMENT AGAIN AND NOT BY
   * A REPAIR: filtered 51/127/192 → 49/123/185, raw UNCHANGED at 53/149/245. The two
   * new post-filters and the three new explained-writer entries clear FOUR cohort
   * identities and SEVEN cohort reads between them — `replaceState on history` in
   * CompendiumPanel.jsx (2 reads, M11), `toLocaleString on history` in
   * WhatChangedPanel.jsx (2, M12), `stresses on settlement` in EventComposer.jsx (2,
   * M8) and `worldPulse on campaignState` in OutputContainer.jsx (1, M9). `files`
   * drops by exactly 2 because CompendiumPanel and WhatChangedPanel lose ALL of
   * their rows while EventComposer and OutputContainer keep others.
   * ⚠ THE RAW READING HOLDING STILL AT 53/149/245 IS THE POINT OF PINNING BOTH: it
   * proves the estate did not move and the delta is provably the instrument.
   */
  test('the UNREVIEWED-UI cohort is ENFORCED, banked, and exactly its measured size', () => {
    const cohort = cohortOf(inventoryOf(live.findings));
    expect(cohort).toMatchObject({ files: 49, identities: 123, counts: 185 });
    // ⚠⚠ THE RAW READING IS PINNED BESIDE THE FILTERED ONE. Without this the
    // cohort figure could fall for two completely different reasons — the filters
    // clearing more, or the estate genuinely shrinking — and a single number
    // cannot tell them apart. Pinning both makes the delta attributable.
    expect(cohortOf(inventoryOf(live.raw.findings)))
      .toMatchObject({ files: 53, identities: 149, counts: 245 });
    expect(UNREVIEWED_UI_COHORT.tag).toBe('UNREVIEWED-UI');
    expect(UNREVIEWED_UI_COHORT.scopes).toEqual([...EXACT_SCAN_EXCLUDED_SCOPE]);

    // ⚠⚠ THE COHORT IS UNDER ENFORCEMENT, NOT EXCLUDED — and these two claims
    // are the whole content of CR-OSR-FREEZE-7's answer to the freeze docket.
    // The same paths the EXACT instrument refuses to resolve are paths this
    // authority reports findings in.
    expect(cohort.paths.length).toBeGreaterThan(0);
    expect(cohort.paths.every((path) => isExactScanExcludedReadPath(path))).toBe(true);
    const uiFindings = live.findings.filter((f) => isExactScanExcludedReadPath(f.file));
    expect(uiFindings.length).toBe(cohort.counts);
    // NEGATIVE CONTROL: the cohort is a strict SUBSET — the domain layer is not
    // being counted into it, so a cohort that swallowed the tree would red.
    expect(cohort.counts).toBeLessThan(live.findings.length);
    expect(live.findings.some((f) => f.file.startsWith('src/domain/'))).toBe(true);
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
   *  and no estate module can resolve into the temp dir, so no probe can reach
   *  another. Findings partition by file, and every expectation below is
   *  byte-for-byte the expectation it carried when each probe bought its own
   *  full-tree scan — which is what made this file flake — AND byte-for-byte
   *  what each reported under the exact detector before the schema-4 rewire. */
  const PROBES = {
    // Both `inspect` declarations begin at source-file position 0. The
    // resolver's parameter memo is keyed `${file}:${fn.pos}:${index}:${prop}`
    // (legacy-reader-shape-scan.mjs:477), so `fn.pos` ALONE would alias these
    // two entries even though one call site supplies `settlement` and the other
    // supplies `save`. The `file` component is the only thing separating them.
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
  }, 900_000);

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
    // THE DETERMINISM RATCHET. See the scan-budget note at the top of this file.
    // If this number grows, a per-test scan has come back. SHARE the scan — do
    // NOT raise a timeout to cover it, and do NOT baseline the resulting
    // failure: a timeout frozen into scripts/.test-ratchet-baseline.json is a
    // phantom that can never be burned down.
    expect(scansRun, 'a full-tree scan was added — share it instead of buying headroom').toBe(2);
  });

  /**
   * ⭐⭐ THE GROWTH LAW, DRIVEN LIVE AND IN BOTH DIRECTIONS.
   *
   * ⚠⚠ A GROWTH RULE THAT LIVES IN A TEST TITLE CONSTRAINS NOTHING. The recorded
   * instance: a census arm titled "never grew" asserted no SIZE at all, and
   * planted growth passed 16/16 GREEN. So this pin does not read the frozen
   * baseline — that comparison belongs to the shrink-only test above and is
   * whatever the freeze state makes it. It derives the inventory FROM THE LIVE
   * SCAN, proves the clean comparison is empty, and then proves that ONE planted
   * finding reds WITH ITS IDENTITY NAMED. Both halves execute at every sha,
   * before and after any freeze.
   */
  test('THE GROWTH LAW IS EXECUTED: a live-derived inventory is green, and ONE planted read reds', () => {
    const frozen = { inventory: inventoryOf(live.findings) };
    const clean = compare(live.findings, frozen);
    expect(clean.violations).toEqual([]);
    expect(clean.stale).toEqual([]);
    // The control is not vacuous: the live scan really did find things.
    expect(Object.keys(frozen.inventory).length).toBeGreaterThan(100);

    const planted = [
      ...live.findings,
      leafFinding('src/domain/rulingPower.js', 10_000_001, '__plantedGrowthKey', 'factions'),
    ];
    const grown = compare(planted, frozen);
    expect(grown.violations).toHaveLength(1);
    expect(grown.violations[0]).toContain('src/domain/rulingPower.js');
    expect(grown.violations[0]).toContain(leafIdentity('__plantedGrowthKey', 'factions'));
    expect(grown.violations[0]).toContain('ceiling 0');
    expect(grown.stale).toEqual([]);

    // …and growth of an EXISTING identity's multiplicity reds too, which a
    // per-identity presence check (rather than a count check) would miss.
    const subject = Object.entries(frozen.inventory)
      .flatMap(([file, row]) => Object.entries(row).map(([id, count]) => ({ file, id, count })))
      .find(({ file }) => file.startsWith('src/'));
    const duplicated = [
      ...live.findings,
      leafFinding(subject.file, 10_000_002, subject.id.split(' on ')[0], subject.id.split(' on ')[1]),
    ];
    const overcount = compare(duplicated, frozen);
    expect(overcount.violations).toHaveLength(1);
    expect(overcount.violations[0]).toContain(`frozen ceiling is ${subject.count}`);
  });

  test('RATCHET FAILURE PATHS: growth, a vanished row, and a collapsed corpus each red', () => {
    const RP = 'src/domain/rulingPower.js';
    const findings = [
      leafFinding(RP, 1, 'id', 'factions'),
      leafFinding(RP, 2, 'id', 'factions'),
    ];
    const inventory = inventoryOf(findings);
    // (a) a multiplicity above the frozen row
    expect(compare(findings, { inventory: { [RP]: { [leafIdentity('id', 'factions')]: 1 } } }).violations)
      .toHaveLength(1);
    // (b) the exact inventory — the control that keeps (a) honest
    expect(compare(findings, { inventory }).violations).toEqual([]);
    // (c) an UNBASELINED file has ceiling ZERO — the law for all new work
    expect(compare([leafFinding('src/brand/new.js', 1, 'k', 'settlement')], { inventory: {} }).violations)
      .toHaveLength(1);
    // (d) a row whose file is gone is fatal, not merely bankable
    expect(compare([], { inventory: { 'src/does/not/exist.js': { [leafIdentity('k', 's')]: 1 } } }).stale)
      .toHaveLength(1);
    // (e) an unbanked shrink is stale: the schema-4 inventory has no headroom.
    const shrunk = compare([findings[0]], { inventory });
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
      leafFinding(RP, 1, 'id', 'factions'),
      leafFinding(RP, 2, 'id', 'factions'),
    ];
    const frozen = { inventory: inventoryOf(held) };
    // CONTROL — same identities, same count: green.
    expect(compare(held, frozen).violations).toEqual([]);
    // MUTANT — one finding REMOVED, a different one ADDED. The file's total is
    // identical, so the retired count-only ratchet was green here.
    const swapped = [held[0], leafFinding(RP, 2, 'foundingTier', 'steadings')];
    expect(swapped.length, 'the mutant must hold the count constant or it proves nothing').toBe(held.length);
    const out = compare(swapped, frozen);
    expect(out.violations).toHaveLength(1);
    expect(out.violations[0]).toContain(leafIdentity('foundingTier', 'steadings'));
    expect(out.violations[0]).toContain('ceiling 0');
    // and the departed multiplicity is stale, not swallowed silently
    expect(out.stale.join('\n')).toContain(leafIdentity('id', 'factions'));
  });

  test('⚠⚠ THE SWAP MUTANT, LIVE: rulingPower.js swapped at constant count against the REAL scan', () => {
    // The verifier drove exactly this against the real frozen inventory. It is
    // repeated here on live findings so the proof re-executes on every gate.
    // ⚠ The frozen side is the LIVE-DERIVED inventory, not the baseline file:
    // the swap property must hold at every sha, including one where the baseline
    // is mid-migration and the shrink-only comparison above is legitimately red.
    const RP = 'src/domain/rulingPower.js';
    const rows = live.findings.filter((f) => f.file === RP);
    expect(rows.length, `${RP} carries no findings — pick another live subject`).toBeGreaterThan(0);
    const others = live.findings.filter((f) => f.file !== RP);
    const frozen = { inventory: inventoryOf(live.findings) };
    // the tree as it stands is green against its own inventory
    expect(compare(live.findings, frozen).violations).toEqual([]);
    // drop one real finding, add one that no writer produces: SAME COUNT
    const swapped = [
      ...rows.slice(1),
      leafFinding(RP, 10_000_003, '__swappedInNoWriterKey', 'settlement'),
    ];
    expect(swapped.length).toBe(rows.length);
    const out = compare([...others, ...swapped], frozen);
    expect(out.violations, 'a constant-count identity swap MUST red — this is the whole cure').toHaveLength(1);
    expect(out.violations[0]).toContain(leafIdentity('__swappedInNoWriterKey', 'settlement'));
  });

  test('inventoryOf counts per file AND per identity', () => {
    expect(inventoryOf([
      leafFinding('src/b.js', 1, 'x', 's'),
      leafFinding('src/a.js', 1, 'x', 's'),
      leafFinding('src/b.js', 2, 'y', 's'),
      leafFinding('src/b.js', 3, 'x', 's'),
    ])).toEqual({
      'src/a.js': { [leafIdentity('x', 's')]: 1 },
      'src/b.js': {
        [leafIdentity('x', 's')]: 2,
        [leafIdentity('y', 's')]: 1,
      },
    });
  });
});
