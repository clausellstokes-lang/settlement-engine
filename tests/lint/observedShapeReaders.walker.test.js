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
  MIN_ROWS, sourceFiles, inventoryOf, compare, sentinelOf, sentinelFailures, ratchetMessage,
} from '../../scripts/check-observed-shape-readers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.observed-shape-readers-baseline.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

/** The producers run ONCE for the whole file. Every executed pin reads this. */
let corpus = null;
let live = null;

beforeAll(async () => {
  corpus = await buildObservedCorpus();
  live = scanReaders({
    files: sourceFiles(ROOT),
    shapes: corpus.shapes,
    arrayShapes: corpus.arrayShapes,
    singleHome: corpus.singleHome,
    rootShapes: corpus.rootShapes,
    minRows: MIN_ROWS,
    root: ROOT,
  });
}, 300_000);

describe('reader-with-no-writer ratchet: the frozen inventory', () => {
  test('the baseline is internally consistent and every row is a real file', () => {
    const rows = Object.entries(baseline.inventory);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.reduce((n, [, c]) => n + c, 0)).toBe(baseline.total);
    expect(rows.every(([, c]) => Number.isInteger(c) && c > 0)).toBe(true);
    const missing = rows.map(([f]) => f).filter((f) => !existsSync(join(ROOT, f)));
    expect(missing).toEqual([]);
    // Forward slashes only: a backslashed key reads differently on POSIX and
    // Windows CI — spurious reds on one, unlimited headroom on the other.
    expect(rows.filter(([f]) => f.includes('\\'))).toEqual([]);
  });

  test('the frozen threshold and sha are recorded, and match the script', () => {
    expect(baseline.minRows).toBe(MIN_ROWS);
    expect(baseline.frozenAtSha).toMatch(/^[0-9a-f]{7,40}$/);
    expect(baseline.frozen).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(baseline.sentinel.usableShapes).toBeGreaterThan(0);
    expect(baseline.sentinel.totalKeys).toBeGreaterThan(0);
    expect(baseline.sentinel.resolvedReads).toBeGreaterThan(0);
  });

  test('the failure message names the rule, the fix, and the only legal shrink', () => {
    const msg = ratchetMessage('src/x.js', 3, 1, ['id on factions']);
    expect(msg).toContain('frozen ceiling is 1');
    expect(msg).toContain('id on factions');
    expect(msg).toContain('TO COMPLY');
    expect(msg).toContain('LOWER this file');
    expect(msg).toContain('Never raise a number');
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
  /** A self-contained module planted into the scanned set. It imports nothing,
   *  so it resolves through the ROOT NAME PRIOR alone — the same rule the estate
   *  uses — and it is written to a temp dir, never into the shared `src/` tree. */
  function plant(body) {
    const dir = mkdtempSync(join(tmpdir(), 'osr-mutant-'));
    const file = join(dir, 'plantedProbe.js');
    writeFileSync(file, body);
    const out = scanReaders({
      files: [...sourceFiles(ROOT), file],
      shapes: corpus.shapes,
      arrayShapes: corpus.arrayShapes,
      singleHome: corpus.singleHome,
      rootShapes: corpus.rootShapes,
      minRows: MIN_ROWS,
      root: ROOT,
    });
    return out.findings.filter((f) => f.file.endsWith('plantedProbe.js'));
  }

  test('THE MUTANT REDS: a planted reader of a key with no writer is reported', () => {
    const hits = plant('export function probe(settlement) {\n'
      + '  return settlement.__noWriterEverWritesThisKey;\n'
      + '}\n');
    expect(hits.length).toBe(1);
    expect(hits[0].key).toBe('__noWriterEverWritesThisKey');
    expect(hits[0].shapes).toEqual(['settlement']);
  });

  test('THE MUTANT SHAPE-CHECKS: the SAME key is silent on a shape that carries it', () => {
    // `tier` exists on BOTH `settlement` and `steadings`; `population` exists on
    // both too. A detector that merely disliked unusual key names would flag the
    // negative control as well — this is the discrimination pin.
    const hits = plant('export function probe(settlement) {\n'
      + '  return [settlement.tier, settlement.population, settlement.economicState];\n'
      + '}\n');
    expect(hits).toEqual([]);
  });

  test('THE MUTANT REACHES A NESTED SHAPE, not just the root', () => {
    const hits = plant('export function probe(settlement) {\n'
      + '  const ps = settlement.powerStructure;\n'
      + '  const rows = ps.factions;\n'
      + '  return rows.map((faction) => faction.id);\n'
      + '}\n');
    expect(hits.map((h) => h.key)).toEqual(['id']);
    expect(hits[0].shapes).toEqual(['factions']);
  });

  test('THE MUTANT CROSSES A HELPER: a parameter sentinel does not kill the chain', () => {
    // The path that let TCD-3 escape the FIRST spelling of this scanner. Inside
    // `inner`, `bag` resolves to a PARAMETER SENTINEL, not a shape; a receiver
    // check that treated the sentinel as "grounded" looked up `shapes['@param0']`,
    // found nothing, and silently discarded the whole chain. `factions` has more
    // than one home, so it cannot be recovered by the ungrounded rule — this
    // probe is only reported while the sentinel is handled correctly.
    const hits = plant('function inner(bag) { return bag.powerStructure.factions; }\n'
      + 'export function probe(settlement) {\n'
      + '  return inner(settlement).map((faction) => faction.id);\n'
      + '}\n');
    expect(hits.map((h) => h.key)).toEqual(['id']);
    expect(hits[0].shapes).toEqual(['factions']);
  });

  test('THE MUTANT IS SILENT ON AN ARRAY: array surface is never a domain key', () => {
    const hits = plant('export function probe(settlement) {\n'
      + '  const rows = settlement.powerStructure.factions;\n'
      + '  return rows.length + rows.filter(Boolean).length;\n'
      + '}\n');
    expect(hits).toEqual([]);
  });

  test('RATCHET FAILURE PATHS: growth, a vanished row, and a collapsed corpus each red', () => {
    const findings = [
      { file: 'src/domain/rulingPower.js', line: 1, key: 'id', shapes: ['factions'] },
      { file: 'src/domain/rulingPower.js', line: 2, key: 'id', shapes: ['factions'] },
    ];
    // (a) over the ceiling
    expect(compare(findings, { inventory: { 'src/domain/rulingPower.js': 1 } }).violations).toHaveLength(1);
    // (b) exactly at the ceiling — the control that keeps (a) honest
    expect(compare(findings, { inventory: { 'src/domain/rulingPower.js': 2 } }).violations).toEqual([]);
    // (c) an UNBASELINED file has ceiling ZERO — the law for all new work
    expect(compare([{ file: 'src/brand/new.js', line: 1, key: 'k', shapes: ['settlement'] }], { inventory: {} }).violations)
      .toHaveLength(1);
    // (d) a row whose file is gone is fatal, not merely bankable
    expect(compare([], { inventory: { 'src/does/not/exist.js': 3 } }).stale).toHaveLength(1);
    // (e) a shrink is BANKABLE, never a failure — a sibling lane's landed fix
    //     must not red this gate.
    const shrunk = compare([], { inventory: { 'src/domain/rulingPower.js': 5 } });
    expect(shrunk.violations).toEqual([]);
    expect(shrunk.bankable).toHaveLength(1);
    // (f) a collapsed corpus is refused
    expect(sentinelFailures({ usableShapes: 1, totalKeys: 1, resolvedReads: 1 }, baseline.sentinel).length)
      .toBeGreaterThanOrEqual(3);
    expect(sentinelFailures(baseline.sentinel, baseline.sentinel)).toEqual([]);
  });

  test('inventoryOf counts per file and nothing else', () => {
    expect(inventoryOf([
      { file: 'b.js', line: 1, key: 'x', shapes: ['s'] },
      { file: 'a.js', line: 1, key: 'x', shapes: ['s'] },
      { file: 'b.js', line: 2, key: 'y', shapes: ['s'] },
    ])).toEqual({ 'a.js': 1, 'b.js': 2 });
  });
});
