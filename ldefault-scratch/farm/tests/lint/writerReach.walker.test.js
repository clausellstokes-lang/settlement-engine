/**
 * writerReach.walker.test.js — THE WRITER-WITH-NO-READER RATCHET, and the gate
 * authority for WRWALKER (HORIZON §7, §1.10, §18.1).
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────
 * OSR's walker asks the reader question: does this read find a key some writer
 * produces? This file asks its DUAL: is this GENERATED FACT ever shown? The
 * engine writes 6,520 identities on every world. If a key reaches no customer
 * surface — no component, no display read model, no PDF, no world book, no
 * Foundry module, no Herald — then the work that produced it is invisible, and
 * "generated and silently unshown" is a defect with ceiling 0.
 *
 * The two instruments share ONE corpus builder and ONE identity grammar, so
 * `writerIdentity` is pinned EQUAL to OSR's `identityOf` here, and the frozen
 * `corpusMeta` is pinned EQUAL to OSR's frozen `corpusMeta`. They are one builder
 * and TWO executions, so the `shapesDigest` pin is also here: nine equal COUNTS
 * can be satisfied by two runs whose key sets differ, and counts-equal is not
 * shapes-equal.
 *
 * ── ⭐ THE SPLIT, AND WHY THE COUNTING CLASS IS NARROW ───────────────────────
 * Car 0 measured the design's single `web` class at 1,562 of 2,143 src files
 * with 380 of 437 `src/domain/worldPulse` files inside it. A class that wide
 * answers "is this key's NAME mentioned in three quarters of the codebase". So
 * `web` split: `web-display` (components, display read models, the PDF tree)
 * COUNTS; `web-transitive` is REPORTED. The tally moved 608/5,033/879 to
 * 547/4,647/1,326 and the kernel leak-through stopped being a STOP, because no
 * `worldPulse` file is under a display dir by construction. That last sentence
 * is a TEST below, not a belief.
 *
 * ── ⚠⚠ THE SCAN BUDGET IS THE POINT OF THE ARCHITECTURE ─────────────────────
 * A full-tree scan is ~0.6 s and the corpus build is ~8.5 s. This file runs
 * EXACTLY TWO scans — one live, one over the planted mutants — and `scansRun` is
 * pinned. A mutant suite that scans per plant would cost minutes per gate. When
 * a new mutant is needed, add it to the ONE planted pass and judge it with a
 * different closure set; `judgeWriters` is cheap and pure. SHARE THE SCAN — do
 * NOT raise the timeout.
 *
 * The `beforeAll` budget is 300_000, re-priced from the volume's 900_000 against
 * Car 0's measurement: the corpus builds in 8.3 s solo and ~26.5 s under 8-way
 * concurrency. 300 s is more than ten times the saturation figure. If it is ever
 * approached, CUT WORK — a budget sized against a figure this tree does not
 * reproduce is a self-imposed constant nobody re-asked.
 *
 * @see docs/DESIGN_HORIZON.md §7, §1.10, §18.1  (the charter; on the ledger line)
 * @see scripts/check-writer-reach.mjs           (the doors: report/write/genesis/rebank)
 * @enforced-by this walker
 */
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, test, beforeAll } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import {
  SURFACE_CLASSES, COUNTING_CLASSES, REPORT_ONLY_CLASSES, SURFACE_ROOTS, SURFACE_CLOSURE_STOP,
  WEB_DISPLAY_DIRS, BUILTIN_MEMBERS, NEWS_TAG_PATTERNS, MIN_ROWS,
  osrBuiltinMembersFromSource, writerIdentity, buildIndex, edgeMapOf, surfaceClosures,
  scanSurfaceReads, judgeWriters, keysToShapesOf, formatReach, parseReach, reviewableDark,
  shapesDigestOf, verdictDigestOf, detectorDigestOf, importEdgesOf, resolveSpecifier, reachFrom,
  crossJoin, surfaceClassesOf,
} from '../../scripts/lib/writer-reach-scan.mjs';
import {
  WRITER_DARK_REGISTER, DARK_REASONS, CANONICAL_FIELDS,
  assertWriterDarkRegister, assertWriterDarkRegisterEvidence, pendingSurfaceBacklog, registerDigestOf,
} from '../../scripts/lib/writer-dark-register.mjs';
import {
  measure, liveViewOf, compareDark, cohortOf, reportOf, run, BASELINE_PATH, SENTINEL_FLOOR,
} from '../../scripts/check-writer-reach.mjs';
import { identityOf, sourceFiles, writeShapesIn } from '../../scripts/check-observed-shape-readers.mjs';
import { scanReaders as scanLegacyReaders } from '../../scripts/lib/legacy-reader-shape-scan.mjs';
import { dialGatedOf } from '../../scripts/lib/writer-reach-lit-corpus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (path) => readFileSync(join(ROOT, path), 'utf8');
const rel = (file) => (file.startsWith(ROOT) ? file.slice(ROOT.length + 1) : file).split('\\').join('/');

const baseline = JSON.parse(read(BASELINE_PATH));
const osrBaseline = JSON.parse(read('scripts/.observed-shape-readers-baseline.json'));

/**
 * THE DIAL-GATED INVENTORY, frozen EXACT (Car 3). Every identity a world generated
 * at the LIT dials writes that an otherwise identical shipped world does not. The
 * set-equality law over `generation-dial` ROWS is OWED and blocked (clause W cannot
 * admit either of the two drafted rows: one key is written by ASSIGNMENT and the
 * other through a CONSTANT-named computed key, and neither is one of OSR's four
 * measured write spellings). Until that chair-signed widening lands, THIS is the
 * ratchet: an exact frozen roster, so a new dial-gated key reds BY NAME rather than
 * waiting for a law that cannot yet be stated.
 * ⭐ 2026-09-05, THE DESK LANDING (§900): `source on stressors` LEFT the dial-gated set by measurement — the
 * walker's own diff at 460a63bca (expected 31, received 30; confounded 55 → 54; `both controls` 31 → 30). The
 * composed tip's corpus configs now carry `stressTypes` (writer-reach's register froze `stressTypes on _config` as
 * a new LIT identity at register car 2), so `resolveStress.js:65` stamps `source: 'forced'` in the CONTROL world
 * too, and the key is ordinary rather than dial-gated. A shrink, taken as the walker measured it; no row rowed.
 */
const FROZEN_DIAL_GATED = Object.freeze([
  'affects on stressors',
  'agenda on factions',
  'archetype on factions',
  'authority on factions',
  'contestsNiche on factions',
  'controls on factions',
  'customContentRoster on settlement',
  'customDefinitionCategory on factions',
  'customDefinitionCategory on stressors',
  'customDefinitionCategory on traditions',
  'densityRungRole on members',
  'densityRungRole on npcs',
  'description on stressors',
  'disablesGoods on stressors',
  'disablesInstitutions on stressors',
  'epithet on traditions',
  'importance on members',
  'isCustom on factions',
  'isCustom on stressors',
  'isCustom on traditions',
  'localUid on factions',
  'localUid on stressors',
  'localUid on traditions',
  'methods on factions',
  'motifAct on traditions',
  'motifElement on traditions',
  'name on stressors',
  'scale on factions',
  'source on factions',
  'source on traditions',
]);

/** The synthetic key every mutant is built on. No real module writes or reads it. */
const PLANTED_KEY = '__plantedWrittenKey';

/**
 * ⚠⚠ EXACTLY TWO full-tree scans, both inside `beforeAll` hooks. Pinned below.
 * Every mutant judgement re-runs `judgeWriters` over the SECOND scan's reads with
 * a different closure set — pure, cheap, and free of another tree walk.
 */
let scansRun = 0;
const countedScan = (args) => { scansRun += 1; return scanSurfaceReads(args); };

/**
 * Car 2's cross-join needs OSR's RAW findings, which come from OSR's own scanner,
 * not this instrument's. It is a separate ~2.8 s pass and it is counted separately
 * below, so the WRWALKER budget above stays exactly what it claims to be. Memoised:
 * the two cross-join arms share the one pass.
 */
let osrScansRun = 0;
let osrFindings = null;
const ensureOsrScan = () => {
  if (osrFindings) return osrFindings;
  osrScansRun += 1;
  osrFindings = scanLegacyReaders({
    files: sourceFiles(ROOT), shapes: live.corpus.shapes, arrayShapes: live.corpus.arrayShapes,
    singleHome: live.corpus.singleHome, rootShapes: live.corpus.rootShapes, minRows: MIN_ROWS, root: ROOT,
  }).findings;
  return osrFindings;
};

/** @type {Awaited<ReturnType<typeof measure>>} */
let live;
let liveView;
let liveReport;
let liveEvidence;

beforeAll(async () => {
  live = await measure({ root: ROOT, scan: countedScan });
  liveView = liveViewOf(live);
  liveReport = reportOf(live);
  liveEvidence = await assertWriterDarkRegisterEvidence(WRITER_DARK_REGISTER, {
    root: ROOT,
    verdicts: live.verdicts,
    closures: Object.fromEntries(SURFACE_CLASSES.map((cls) => [
      cls, new Set([...live.closures[cls]].map(rel)),
    ])),
    pendingCeiling: baseline.pendingSurfaceCeiling,
    dialGated: live.dialGated,
  });
}, 300_000);

describe('writer-with-no-reader ratchet: the frozen register', () => {
  test('the baseline is CONTENT-ADDRESSED, names the corpus and the detector it judged with, and every registered identity parses', () => {
    expect(baseline.schema).toBe(1);
    expect(baseline.frozenAtSha).toMatch(/^[0-9a-f]{40}$/);
    expect(typeof baseline.charter).toBe('string');
    expect(baseline.charter).toMatch(/§\d+/);
    expect(baseline.minRows).toBe(MIN_ROWS);
    for (const field of ['shapesDigest', 'detectorDigest', 'verdictDigest', 'registerDigest']) {
      expect(baseline[field], `${field} must be a sha256`).toMatch(/^[0-9a-f]{64}$/);
    }
    expect(baseline.stopSet).toEqual([...SURFACE_CLOSURE_STOP]);
    expect(baseline.webDisplayDirs).toEqual([...WEB_DISPLAY_DIRS]);
    expect(baseline.countingClasses).toEqual([...COUNTING_CLASSES]);
    expect(baseline.reportOnlyClasses).toEqual([...REPORT_ONLY_CLASSES]);
    expect(Array.isArray(baseline.rebankHistory)).toBe(true);
    for (const row of baseline.darkUnregistered) {
      expect(row.identity).toBe(`${row.key} on ${row.shape}`);
      expect(row.rows).toBeGreaterThanOrEqual(MIN_ROWS);
    }
    const banked = baseline.darkUnregistered.map((row) => row.identity);
    expect(new Set(banked).size, 'the banked cohort carries no duplicate identity').toBe(banked.length);
    for (const row of WRITER_DARK_REGISTER) {
      expectAbsentWithAnchor(
        banked, row.identity, baseline.darkUnregistered[0].identity,
        'a hand-authored row is never ALSO banked — one identity, one door',
      );
    }
  });

  test('the frozen corpusMeta EQUALS the observed-shape register corpusMeta — one corpus, two walkers', () => {
    const keys = Object.keys(osrBaseline.corpusMeta).sort();
    expect(keys.length).toBe(9);
    expect(Object.keys(baseline.corpusMeta).sort()).toEqual(keys);
    for (const key of keys) {
      expect(baseline.corpusMeta[key], `corpusMeta.${key} must equal OSR's frozen value`)
        .toBe(osrBaseline.corpusMeta[key]);
    }
  });

  test('the frozen shapesDigest EQUALS the in-process digest of corpus.shapes — two executions of one builder are one corpus by bit, not by count', () => {
    expect(shapesDigestOf(live.corpus.shapes)).toBe(baseline.shapesDigest);
    for (const key of Object.keys(osrBaseline.corpusMeta)) {
      expect(live.corpus.meta[key], `live corpusMeta.${key} still equals OSR's frozen value`)
        .toBe(osrBaseline.corpusMeta[key]);
    }
  });

  test('the surface roots are real files, every counting class has a non-empty closure, and the STOP set is disjoint from every root', () => {
    for (const [cls, roots] of Object.entries(SURFACE_ROOTS)) {
      for (const root of roots) {
        expect(() => read(root), `${cls} root ${root} must be a real file`).not.toThrow();
        expect(
          SURFACE_CLOSURE_STOP.some((prefix) => root.startsWith(prefix)),
          `${cls} root ${root} must not itself be inside the STOP set`,
        ).toBe(false);
      }
    }
    for (const cls of COUNTING_CLASSES) {
      expect(live.closures[cls].size, `the ${cls} closure must not be empty`).toBeGreaterThan(0);
    }
    expect(NEWS_TAG_PATTERNS.length).toBeGreaterThan(0);
  });

  test('web-display and web-transitive partition the web closure exactly, web-display contains no src/domain/worldPulse file, and only COUNTING_CLASSES count toward LIT', () => {
    const display = new Set([...live.closures['web-display']].map(rel));
    const transitive = new Set([...live.closures['web-transitive']].map(rel));
    const whole = new Set([...live.web].map(rel));
    expect(display.size + transitive.size).toBe(whole.size);
    for (const file of display) expect(transitive.has(file), `${file} is in both halves`).toBe(false);
    for (const file of whole) {
      expect(display.has(file) || transitive.has(file), `${file} is in neither half`).toBe(true);
    }
    const pulseInDisplay = [...display].filter((f) => f.startsWith('src/domain/worldPulse/'));
    expect(pulseInDisplay, 'no worldPulse file may be under a display dir — the leak is REPORTED, never counted')
      .toEqual([]);
    for (const file of display) {
      expect(WEB_DISPLAY_DIRS.some((prefix) => file.startsWith(prefix)), `${file} is not under a display dir`)
        .toBe(true);
    }
    expect([...COUNTING_CLASSES, ...REPORT_ONLY_CLASSES].sort()).toEqual([...SURFACE_CLASSES].sort());
    for (const cls of COUNTING_CLASSES) {
      expect(REPORT_ONLY_CLASSES.includes(cls), `${cls} cannot both count and be report-only`).toBe(false);
    }
    expect(REPORT_ONLY_CLASSES).toEqual(['web-transitive', 'json-export']);
  });

  test("the local BUILTIN_MEMBERS twin equals OSR's module-private set byte for byte, and no written key collides with it", () => {
    const osr = osrBuiltinMembersFromSource(read('scripts/lib/legacy-reader-shape-scan.mjs'));
    expect(osr.size).toBe(72);
    expect([...BUILTIN_MEMBERS].sort()).toEqual([...osr].sort());
    const written = new Set();
    for (const [shape, record] of Object.entries(live.corpus.shapes)) {
      if (record.rows < MIN_ROWS) continue;
      for (const key of record.keys) written.add(key);
      expect(typeof shape).toBe('string');
    }
    const collisions = [...written].filter((key) => osr.has(key)).sort();
    expect(collisions, 'a written key inside the builtin set would be silently unscannable').toEqual([]);
  });

  test('the declared DARK register is structurally lawful and every row is live-verified', () => {
    expect(() => assertWriterDarkRegister()).not.toThrow();
    expect(WRITER_DARK_REGISTER.length).toBe(6);
    expect(liveEvidence.map((row) => row.identity).sort())
      .toEqual(WRITER_DARK_REGISTER.map((row) => row.identity).sort());
    for (const row of liveEvidence) {
      expect(row.spellings.length, `${row.identity}: clause W produced no evidence`).toBeGreaterThan(0);
      expect(row.writeProof, `${row.identity}: clause W recorded no write proof`).toBeTruthy();
    }
    expect(registerDigestOf()).toBe(baseline.registerDigest);
    expect(pendingSurfaceBacklog().length).toBe(baseline.pendingSurfaceCeiling);
    expect(DARK_REASONS).toEqual(['dark-by-construction', 'engine-internal', 'pending-surface']);
  });

  test('the surfaceReach grammar round-trips: parse(format(reach)) equals reach for every LIT identity', () => {
    const frozen = baseline.surfaceReach;
    let checked = 0;
    for (const row of live.verdicts.values()) {
      if (row.verdict === 'THIN') continue;
      const formatted = formatReach(row.reach);
      expect(frozen[row.identity], `${row.identity} is missing from the frozen surfaceReach`).toBe(formatted);
      expect(formatReach(parseReach(formatted)), `${row.identity} does not round-trip`).toBe(formatted);
      if (row.verdict === 'LIT') checked += 1;
    }
    expect(checked).toBe(liveView.population.lit);
    expect(Object.keys(frozen).length).toBe(live.verdicts.size);
    // The frozen map is the thing Car 2 hands CHARSET and READERREVIEW, so its SIZE
    // is a STOP of its own: never ship a multi-megabyte register.
    expect(JSON.stringify(frozen).length, 'surfaceReach must stay under 1 MB').toBeLessThan(1_000_000);
  });

  test('CHARSET_SURFACES mirrors SURFACE_CLASSES minus news and minus web-transitive — the six RENDERING classes, pinned for the day CHARSET Car 1 lands', () => {
    // §1.10 states CHARSET_SURFACES as SIX, "SURFACE_CLASSES minus `news` and minus
    // `web-transitive`", and §1.11 gives `json-export` its own charset arithmetic
    // ("web-display/foundry/json-export unbounded minus the bans"). The pin the same
    // sentence SPELLS — filter(c => c !== 'news' && !REPORT_ONLY_CLASSES.includes(c))
    // — yields FIVE, because REPORT_ONLY_CLASSES carries json-export as well as
    // web-transitive. The cardinality and the arithmetic agree with each other and
    // disagree with the spelling, so the SIX is pinned here and the contradiction is
    // reported rather than silently resolved in code. CHARSET Car 1 will code to one
    // of the two and red on the other; this is the target it must match.
    const renderingClasses = SURFACE_CLASSES.filter((cls) => cls !== 'news' && cls !== 'web-transitive');
    expect(renderingClasses).toEqual([
      'web-display', 'dossier-pdf', 'campaign-pdf', 'world-book', 'foundry', 'json-export',
    ]);
    expect(renderingClasses.length).toBe(6);
    expect(SURFACE_CLASSES.filter((cls) => cls !== 'news' && !REPORT_ONLY_CLASSES.includes(cls)).length)
      .toBe(5);
    expect(renderingClasses.every((cls) => SURFACE_CLASSES.includes(cls))).toBe(true);
    // `surfaceClassesOf` is the accessor CHARSET and READERREVIEW consume (§7.4).
    const lit = surfaceClassesOf('name on settlement', live.verdicts);
    expect(lit.verdict).toBe('LIT');
    expect(lit.formatted).toBe(formatReach(lit.reach));
    expect(surfaceClassesOf('no such identity at all', live.verdicts)).toBeNull();
  });

  test("the identity grammar is OSR's: writerIdentity(k, s) equals identityOf(a canonical six-field legacy finding carrying key k and shapes [s]), and the bare two-field form is refused", () => {
    const key = 'prosperity';
    const shape = 'economicState';
    const canonical = { file: 'src/probe.js', key, line: 1, pos: 0, shapes: [shape], text: `x.${key}` };
    expect(identityOf(canonical)).toBe(`${key} on ${shape}`);
    expect(writerIdentity(key, shape)).toBe(identityOf(canonical));
    let refusal = null;
    try { identityOf({ key, shapes: [shape] }); } catch (error) { refusal = error.message; }
    expect(refusal, 'the volume\u2019s two-field shorthand is prose, not code').toContain('noncanonical fields'); // anchored: refusal is asserted non-null on the line below, so a silent accept cannot pass
    expect(refusal).toContain('["key","shapes"]');
  });
});

describe('writer-with-no-reader ratchet: the EXECUTED corpus and the closures', () => {
  test('the producers ran and the write population is not empty', () => {
    expect(Object.keys(live.corpus.shapes).length).toBe(osrBaseline.corpusMeta.shapeCount);
    expect(live.verdicts.size).toBe(baseline.population.judged);
    expect(live.verdicts.size).toBeGreaterThan(3000);
    expect(live.knownShapes.size).toBe(baseline.population.knownShapes);
    expect(live.thinKeys).toBe(baseline.population.thinKeys);
    const dark = liveView.population.dark;
    expect(dark / live.verdicts.size, 'the DARK share must stay under the 60 % STOP').toBeLessThan(0.6);
  });

  test('THE PREMISE HOLDS: a written key the probe measured DARK is written, and its shape carries a liveness anchor', () => {
    const row = live.verdicts.get('isolationSupport on settlement');
    expect(row.verdict).toBe('DARK');
    expect(row.readers.R).toEqual([]);
    expect(row.readers.N).toEqual([]);
    const settlementKeys = live.corpus.shapes.settlement.keys;
    expectAbsentWithAnchor(
      settlementKeys.filter((key) => live.verdicts.get(`${key} on settlement`).verdict !== 'DARK'),
      'isolationSupport', 'name',
      'the settlement shape is genuinely alive — `name` is LIT — so `isolationSupport` is dark by measurement, not by an empty scan',
    );
    expect(live.verdicts.get('name on settlement').verdict).toBe('LIT');
  });

  test('the web closure contains the lazily-imported tabs — a dynamic import of an extensionless .jsx target is an edge', () => {
    const whole = new Set([...live.web].map(rel));
    expect(whole.has('src/components/dossier/dossierLazyTabs.js')).toBe(true);
    // The `.jsx`-spelled dynamic import, and the EXTENSIONLESS one beside it. OSR's
    // own `resolveSpec` resolves the literal only and would follow neither, which is
    // exactly the blindness ODQ §880.5 recorded; the five-suffix resolution cures it.
    expect(whole.has('src/components/new/tabs/FaithTab.jsx')).toBe(true);
    expect(whole.has('src/components/new/SummaryTab.jsx')).toBe(true);
    const registry = read('src/components/dossier/dossierLazyTabs.js');
    expect(registry).toContain("import('../new/tabs/FaithTab.jsx')");
    expect(registry).toContain("import('../new/SummaryTab')");
  });

  test('the dossier-pdf closure contains the view model and the sections, and the campaign-pdf and world-book closures are disjoint from src/pdf', () => {
    const dossier = new Set([...live.closures['dossier-pdf']].map(rel));
    expect(dossier.has('src/pdf/SettlementPDF.jsx')).toBe(true);
    expect(dossier.has('src/pdf/lib/viewModel.js')).toBe(true);
    for (const cls of ['campaign-pdf', 'world-book']) {
      const files = [...live.closures[cls]].map(rel).filter((f) => f.startsWith('src/pdf/'));
      expect(files, `${cls} is a jsPDF surface and must not pull in the @react-pdf tree`).toEqual([]);
    }
  });

  test('the worker construction edge is followed: pdfRender.worker.js reaches SettlementPDF.jsx', () => {
    const dossier = new Set([...live.closures['dossier-pdf']].map(rel));
    expect(dossier.has('src/utils/pdfRender.worker.js')).toBe(true);
    expect(dossier.has('src/pdf/SettlementPDF.jsx')).toBe(true);
    expect(read('src/utils/generateSettlementPDF.js')).toContain('import.meta.url');
  });

  test('no closure enters the STOP set', () => {
    const violations = [];
    for (const cls of SURFACE_CLASSES) {
      for (const file of live.closures[cls]) {
        const path = rel(file);
        if (SURFACE_CLOSURE_STOP.some((prefix) => path.startsWith(prefix))) violations.push(`${cls}: ${path}`);
      }
    }
    expect(violations, 'the engine boundary is load-bearing at the file level').toEqual([]);
  });
});

describe('writer-with-no-reader ratchet: the live judgment', () => {
  test('the scan reached the tree and credited a real share of surface reads at grade R', () => {
    expect(live.scanStats.files).toBe(live.union.size);
    expect(live.scanStats.files).toBeGreaterThan(1000);
    expect(live.scanStats.sites).toBeGreaterThan(10000);
    expect(live.scanStats.rGrades).toBeGreaterThan(1000);
    expect(live.scanStats.resolvedReceivers).toBeGreaterThan(1000);
    expect(liveView.population.lit).toBeGreaterThan(0);
    expect(liveView.population.litName).toBeGreaterThan(0);
  });

  test('every DARK identity is REGISTERED or BANKED — the shrink-only comparison is clean', () => {
    const comparison = compareDark(liveView, baseline);
    expect(comparison.violations, 'a DARK identity nobody rowed or banked is ceiling 0').toEqual([]);
    expect(comparison.sentinel).toEqual([]);
  });

  test('no registered row is LIT — a row that outlives its darkness must be STRUCK (bank the win)', () => {
    const comparison = compareDark(liveView, baseline);
    expect(comparison.struck.map((row) => row.identity)).toEqual([]);
    for (const row of WRITER_DARK_REGISTER) {
      if (row.door?.kind === 'generation-dial') {
        // A dial row's identity is EXPECTED absent: no shipped world writes it, and
        // that absence IS the dormancy. Presence is what would convict it.
        expect(live.verdicts.has(row.identity), `${row.identity} must be ABSENT: the dial is still dark`)
          .toBe(false);
        continue;
      }
      expect(live.verdicts.get(row.identity)?.verdict, `${row.identity} must still be DARK`).toBe('DARK');
    }
  });

  test('the banked cohort is exact — a member now LIT or no longer written is stale, never silently spent', () => {
    const comparison = compareDark(liveView, baseline);
    expect(comparison.stale.map((row) => row.identity)).toEqual([]);
    const cohort = cohortOf(live.verdicts);
    expect(cohort.length).toBe(baseline.population.dark);
    // Only the registered rows that are actually IN the dark cohort come out of the
    // bank. The two generation-dial rows are not written by any shipped world, so
    // they were never in it — the arithmetic has to say so or it would drift by two.
    const registeredAndDark = WRITER_DARK_REGISTER
      .filter((row) => cohort.some((entry) => entry.identity === row.identity));
    expect(registeredAndDark.length).toBe(4);
    expect(baseline.darkUnregistered.length).toBe(cohort.length - registeredAndDark.length);
    expect(reviewableDark(cohort).length).toBe(baseline.reviewableDarkCount);
    expect(reviewableDark(cohort).length).toBeLessThan(cohort.length);
  });

  test('the population sentinel: judged and every counting closure hold above 90 % of the register', () => {
    expect(SENTINEL_FLOOR).toBe(0.9);
    expect(liveView.population.judged).toBeGreaterThanOrEqual(baseline.population.judged * SENTINEL_FLOOR);
    for (const cls of SURFACE_CLASSES) {
      expect(liveView.closureSizes[cls], `${cls} closure collapsed`)
        .toBeGreaterThanOrEqual(baseline.closureSizes[cls] * SENTINEL_FLOOR);
    }
    const collapsed = { ...liveView, population: { ...liveView.population, judged: 1 } };
    expect(compareDark(collapsed, baseline).sentinel.length, 'a collapsed population must RED, not green')
      .toBeGreaterThan(0);
  });

  test('THE CROSS-JOIN NAMES THE CULTURE CLASS: a synthetic OSR finding "culture on settlement" in generateCampaignPDF.js joined with the written "culture on config" reports a shape-mismatched key on campaign-pdf', () => {
    // The SYNTHETIC plant stays beside the live arm as the discrimination proof: it
    // shows the join fires on a reader/writer shape mismatch inside a counting
    // closure, independently of whatever the tree happens to contain today.
    const planted = crossJoin({
      osrFindings: [{
        file: 'src/utils/generateCampaignPDF.js', key: 'culture', line: 1, pos: 0,
        shapes: ['settlement'], text: 'settlement.culture',
      }],
      corpus: live.corpus, closures: live.closures, root: ROOT,
    });
    expect(planted.map((row) => `${row.key} ${row.readerShape} <- ${row.writerShape}`).sort())
      .toEqual(['culture settlement <- _config', 'culture settlement <- config']);
    // …and the same finding OUTSIDE every counting closure joins nothing.
    const outside = crossJoin({
      osrFindings: [{
        file: 'src/generators/steps/resolveConfig.js', key: 'culture', line: 1, pos: 0,
        shapes: ['settlement'], text: 'settlement.culture',
      }],
      corpus: live.corpus, closures: live.closures, root: ROOT,
    });
    expect(outside).toEqual([]);
  });

  test('THE CULTURE CLASS IS STILL LIVE: the dossier view model and the quick guide read culture on settlement and npcs while the writer is config — six rows, exact, a review-backlog wiring finding', () => {
    // PAIDFIX repair 1 struck the three generateCampaignPDF.js sites and the campaign
    // PDF IS gone from this join. Two readers remain, and the readers’ SHAPE is what
    // is wrong, not the writer’s. When the review fixes them this arm re-records to
    // EMPTY with an anchor: bank the win, never loosen the assertion.
    const rows = crossJoin({
      osrFindings: ensureOsrScan(), corpus: live.corpus, closures: live.closures, root: ROOT,
    });
    const culture = rows.filter((row) => row.key === 'culture')
      .map((row) => `${row.file} | ${row.readerShape} <- ${row.writerShape}`).sort();
    expect(culture).toEqual([
      'src/domain/summary/settlementQuickGuide.js | settlement <- _config',
      'src/domain/summary/settlementQuickGuide.js | settlement <- config',
      'src/pdf/lib/viewModel.js | npcs <- _config',
      'src/pdf/lib/viewModel.js | npcs <- config',
      'src/pdf/lib/viewModel.js | settlement <- config',
      'src/pdf/lib/viewModel.js | settlement <- _config',
    ].sort());
    expectAbsentWithAnchor(
      culture.map((row) => row.split(' | ')[0]), 'src/utils/generateCampaignPDF.js',
      'src/pdf/lib/viewModel.js',
      'the campaign PDF left this join at PAIDFIX repair 1 and the view model did not — a win already banked, beside a debt still open',
    );
    // The join as SPECIFIED is spec-faithful and unusable as a bare alert, which is
    // why Car 2 asserts named classes exactly and REPORTS the rest grouped by key.
    expect(rows.length).toBeGreaterThan(5000);
    const byKey = new Map();
    for (const row of rows) byKey.set(row.key, (byKey.get(row.key) ?? 0) + 1);
    expect([...byKey].sort((a, b) => b[1] - a[1])[0][0]).toBe('id');
    expect(osrScansRun, 'the cross-join shares ONE OSR pass across both arms').toBe(1);
  }, 120_000);

  test("the web-only gap report lists identities LIT on web-display with no paid-PDF reach, and the recon's culture case is no longer among them", () => {
    const gap = liveReport.webOnlyGap;
    expect(gap.length).toBeGreaterThan(0);
    for (const identity of gap) {
      const row = live.verdicts.get(identity);
      expect(row.verdict).toBe('LIT');
      expect(row.reach['web-display']).toBeTruthy();
      expect(row.reach['dossier-pdf']).toBeFalsy();
      expect(row.reach['campaign-pdf']).toBeFalsy();
      expect(row.reach['world-book']).toBeFalsy();
    }
    // `culture on config` reaches all three paid surfaces at grade R, so the recon’s
    // case is a WIN already banked and must not reappear in this report.
    const cultureReach = live.verdicts.get('culture on config').reach;
    expect(cultureReach['campaign-pdf']).toBe('R');
    expect(cultureReach['dossier-pdf']).toBe('R');
    expect(cultureReach['world-book']).toBe('R');
    expectAbsentWithAnchor(gap, 'culture on config', gap[0],
      'the gap report is non-empty, so culture’s absence from it is a measurement and not an empty list');
  });

  test('pendingSurfaceBacklog returns exactly the pending-surface rows, sorted by surface then identity', () => {
    const backlog = pendingSurfaceBacklog();
    expect(backlog.map((row) => row.identity)).toEqual([
      'isolationSupport on settlement',
      'magicDependent on isolationSupport',
      'requiredCapacity on isolationSupport',
    ]);
    for (const row of backlog) {
      expect(row.surface).toBe('web-display');
      expect(COUNTING_CLASSES).toContain(row.surface);
      expect(row.car).toMatch(/§\d+/);
      expect(() => read(row.carArtifact)).not.toThrow();
      expect(live.verdicts.get(row.identity).verdict).toBe('DARK');
    }
    const sorted = [...backlog].sort((a, b) => (a.surface === b.surface
      ? (a.identity < b.identity ? -1 : 1) : (a.surface < b.surface ? -1 : 1)));
    expect(backlog).toEqual(sorted);
    expect(backlog.length).toBe(baseline.pendingSurfaceCeiling);
    expect(liveReport.pendingSurfaceBacklog).toEqual(backlog);
  });

  test('the export allowlist arm reaches json-export at grade A for exactly the allowlisted keys, and json-export does not count toward LIT', () => {
    const graded = [...live.verdicts.values()].filter((row) => row.reach['json-export'] === 'A');
    for (const row of graded) expect(live.allowlist.has(row.identity)).toBe(true);
    // The arm is EXACTLY the allowlist intersected with the judged population. It is
    // not the allowlist's size: five allowlisted keys are never written on `settlement`
    // by any generated world at this tree, so no identity exists for them to grade.
    // That gap is a REPORT, not a defect of this instrument — an export allowlist
    // naming keys the engine does not produce is a finding for the review's backlog.
    const unwritten = [...live.allowlist].filter((identity) => !live.verdicts.has(identity)).sort();
    expect(graded.length).toBe(live.allowlist.size - unwritten.length);
    expect(unwritten).toEqual([
      'crossSettlementConflicts on settlement',
      'dailyLife on settlement',
      'interSettlementRelationships on settlement',
      'neighbourNetwork on settlement',
      'thesis on settlement',
    ]);
    expect(REPORT_ONLY_CLASSES).toContain('json-export');
    const onlyExport = [...live.verdicts.values()]
      .filter((row) => row.verdict === 'LIT' && COUNTING_CLASSES.every((cls) => row.reach[cls] !== 'R'));
    expect(onlyExport, 'no identity may be LIT on the export arm alone').toEqual([]);
  });
});

describe('writer-with-no-reader ratchet: the register doors convict what they cannot verify', () => {
  const rowOf = (identity) => WRITER_DARK_REGISTER.find((row) => row.identity === identity);
  const convicts = async (entries, options = {}) => {
    let message = null;
    try {
      await assertWriterDarkRegisterEvidence(entries, { root: ROOT, ...options });
    } catch (error) { message = error.message; }
    expect(message, 'the door must CONVICT, and it stayed silent').not.toBeNull();
    return message;
  };

  test('dark-by-construction (simulation-flag): the M13 clauses convict a lit flag, a non-virtual flag, and a writer that stopped writing', async () => {
    const flagRow = {
      identity: 'treasury on economicState', key: 'treasury', shape: 'economicState',
      writer: 'src/domain/worldPulse/treasury.js', reason: 'dark-by-construction',
      door: { kind: 'simulation-flag', flag: 'treasuryEnabled' },
      lighting: 'x'.repeat(90), car: '§7 the probe', charter: '§7 the probe',
    };
    const reused = [];
    await assertWriterDarkRegisterEvidence([flagRow], {
      root: ROOT,
      virtualEvidence: (entries) => { reused.push(...entries); return entries; },
    });
    expect(reused.map((row) => row.flag), 'the M13 machinery is REUSED, never re-implemented')
      .toEqual(['treasuryEnabled']);
    const thrown = await convicts([flagRow], {
      virtualEvidence: () => { throw new Error('observed-shape virtual-dormant writer is UNVERIFIABLE (clause 4): [4b, a preset light]'); },
    });
    expect(thrown).toContain('clause 4');
    const stopped = await convicts([{ ...flagRow, key: 'noSuchKeyIsEverWritten' }]);
    expect(stopped).toContain('clause W');
    expect(stopped).toContain('no longer writes');
  });

  test('dark-by-construction (generation-dial): a dial already at its lit version convicts the row', async () => {
    const dialRow = {
      identity: 'densityRungRole on npcs', key: 'densityRungRole', shape: 'npcs',
      writer: 'src/generators/density/applyDensityLaw.js', reason: 'dark-by-construction',
      door: {
        kind: 'generation-dial', configKey: '_densityLawVersion',
        dialModule: 'src/domain/density/densityLaw.js', dialExport: 'NEW_SETTLEMENT_DENSITY_LAW_VERSION',
        litModule: 'src/domain/density/densityLaw.js', litExport: 'REGISTER_VII_DENSITY_LAW_VERSION',
      },
      lighting: 'x'.repeat(90), car: '§7 the probe', charter: '§7 the probe',
    };
    // A PROPERTY spelling, because `x.k = v` is an assignment and not one of the four
    // write shapes OSR measures — clause W would fire first and mask the dial arm.
    const readSource = (path) => (
      path === dialRow.writer ? 'const npc = { densityRungRole: role };\n' : read(path)
    );
    const same = await convicts([dialRow], {
      readSource,
      dialGated: new Set([dialRow.identity]),
      importModule: async () => ({
        NEW_SETTLEMENT_DENSITY_LAW_VERSION: 2, REGISTER_VII_DENSITY_LAW_VERSION: 2,
      }),
    });
    expect(same).toContain('D-dial');
    expect(same).toContain('already EQUALS');
    const notGated = await convicts([dialRow], {
      readSource,
      importModule: async () => ({
        NEW_SETTLEMENT_DENSITY_LAW_VERSION: 1, REGISTER_VII_DENSITY_LAW_VERSION: 2,
      }),
      dialGated: new Set(['some other identity']),
    });
    expect(notGated).toContain('dormancy claim is a BIT claim');
  });

  test('engine-internal: a consumer that does not read the key convicts; a consumer whose read is only in a comment or a string convicts (code-only)', async () => {
    const row = rowOf('cultureProfileKey on config');
    expect(row.consumer.file).toBe('src/generators/generateSettlementPipeline.js');
    const missing = await convicts([{ ...row, consumer: { ...row.consumer, file: 'src/no/such/file.js' } }]);
    expect(missing).toContain('clause E');
    expect(missing).toContain('does not exist');
    const absent = await convicts([{
      ...row, consumer: { ...row.consumer, file: 'src/domain/display/publicSafe.js' },
    }]);
    expect(absent).toContain('clause E');
    expect(absent).toContain('does not READ');
    const stringOnly = await convicts([row], {
      readSource: (path) => (path === row.consumer.file
        ? "const ALLOWED = 'cultureProfileKey customTradeGoods'; // cultureProfileKey lives here\n"
        : read(path)),
    });
    expect(stringOnly).toContain('citation law');
    const realConsumer = await assertWriterDarkRegisterEvidence([row], { root: ROOT });
    expect(realConsumer[0].identity).toBe(row.identity);
  });

  test('engine-internal: a consumer inside a counting closure convicts — that identity would be LIT', async () => {
    const row = rowOf('cultureProfileKey on config');
    const inClosure = await convicts([row], {
      closures: { 'web-display': new Set([row.consumer.file]) },
    });
    expect(inClosure).toContain('clause E');
    expect(inClosure).toContain('web-display');
    expect(inClosure).toContain('would be LIT');
  });

  test('pending-surface: an uncited car convicts; a cited car on a surface the identity already reaches convicts; a car that resolves to no in-tree artifact convicts', async () => {
    const row = rowOf('isolationSupport on settlement');
    expect(COUNTING_CLASSES).toContain(row.surface);
    const noArtifact = await convicts([{ ...row, carArtifact: 'docs/THIS_DOC_DOES_NOT_EXIST.md' }]);
    expect(noArtifact).toContain('clause P');
    expect(noArtifact).toContain('does not exist in this tree');
    // `.npmrc` exists and names neither `isolationSupport` nor `settlement`; `package.json`
    // would NOT convict, because the package name carries the word `settlement`.
    const unrelated = await convicts([{ ...row, carArtifact: '.npmrc' }]);
    expect(unrelated).toContain('citation that does not mention its subject');
    const alreadyReached = await convicts([row], {
      verdicts: new Map([[row.identity, { verdict: 'DARK', reach: { 'web-display': 'N' } }]]),
    });
    expect(alreadyReached).toContain('not pending');
    expect(() => assertWriterDarkRegister([{ ...row, surface: 'web-transitive' }]))
      .toThrow(/not\s+a COUNTING class/);
  });

  test('pending-surface: a row beyond the genesis-banked population is refused — the cohort ceiling shrinks and only --rebank --charter grows it', async () => {
    const row = rowOf('isolationSupport on settlement');
    // A FIFTH pending row, built so that ONLY the ceiling can fire: its writer is
    // injected (clause W passes), its car artifact is real and names its shape
    // (clause P passes), and `verdicts` is omitted so clause S does not run. If the
    // ceiling did not exist, this row would sail through every other door — which is
    // precisely why the ceiling exists: banking a row disarms the ratchet.
    const fifth = {
      ...row,
      identity: 'syntheticPendingKey on settlement',
      key: 'syntheticPendingKey',
      writer: 'src/generators/steps/probeWriter.js',
    };
    const grown = await convicts([...WRITER_DARK_REGISTER, fifth], {
      pendingCeiling: baseline.pendingSurfaceCeiling,
      dialGated: live.dialGated,
      readSource: (path) => (
        path === fifth.writer ? 'const s = { syntheticPendingKey: 1 };\n' : read(path)
      ),
    });
    expect(grown).toContain('pending-surface population GREW');
    expect(grown).toContain('shrink-only');
    expect(grown).toContain('--rebank --charter');
    expect(baseline.pendingSurfaceCeiling).toBe(pendingSurfaceBacklog().length);
  });

  test('clause S: a row whose identity is LIT is convicted with the strike instruction', async () => {
    const row = rowOf('cultureProfileKey on config');
    const lit = await convicts([row], {
      verdicts: new Map([[row.identity, { verdict: 'LIT', reach: { 'web-display': 'R' } }]]),
    });
    expect(lit).toContain('BANK THE WIN');
    expect(lit).toContain('strike the row');
    const absent = await convicts([row], { verdicts: new Map() });
    expect(absent).toContain('clause S');
    expect(absent).toContain('not in the judged population');
  });

  test('the structural law refuses a malformed, duplicated, wrong-reason, or foreign-field row', () => {
    // The row is named, never indexed: WRITER_DARK_REGISTER[0] changed reason when
    // Car 4 admitted the dial rows, and an index would have quietly re-pointed every
    // arm below at a row with a different canonical field set.
    const row = WRITER_DARK_REGISTER.find((entry) => entry.identity === 'cultureProfileKey on config');
    const dialRow = WRITER_DARK_REGISTER.find((entry) => entry.identity === 'densityRungRole on npcs');
    expect(row.reason).toBe('engine-internal');
    expect(dialRow.reason).toBe('dark-by-construction');
    expect(() => assertWriterDarkRegister([{ ...row, reason: 'because-i-said-so' }])).toThrow(/unknown reason/);
    expect(() => assertWriterDarkRegister([{ ...row, extraField: 1 }])).toThrow(/noncanonical fields/);
    expect(() => assertWriterDarkRegister([row, row])).toThrow(/DUPLICATED/);
    expect(() => assertWriterDarkRegister([{ ...row, identity: 'no-on-separator' }])).toThrow(/identity/);
    expect(() => assertWriterDarkRegister([{ ...row, shape: 'somethingElse' }])).toThrow(/does not name its own key/);
    expect(() => assertWriterDarkRegister([{ ...row, writer: 'scripts/notSrc.mjs' }])).toThrow(/repo-relative src/);
    expect(() => assertWriterDarkRegister([{ ...row, charter: 'no section here' }])).toThrow(/chartering section/);
    // BOTH prose fields carry the 80-character floor, each on the reason that owns it.
    expect(() => assertWriterDarkRegister([{ ...row, why: 'too short' }])).toThrow(/at least 80 characters/);
    expect(() => assertWriterDarkRegister([{ ...dialRow, lighting: 'too short' }]))
      .toThrow(/at least 80 characters/);
    // And each reason refuses the OTHER's prose field as foreign.
    const { why: _why, ...dialShaped } = row;
    expect(() => assertWriterDarkRegister([{ ...dialShaped, reason: 'dark-by-construction' }]))
      .toThrow(/noncanonical fields/);
    // The generation-dial door's own structure is law too.
    expect(() => assertWriterDarkRegister([{ ...dialRow, door: { ...dialRow.door, configKey: 'noUnderscore' } }]))
      .toThrow(/configKey must start with/);
    expect(() => assertWriterDarkRegister([{ ...dialRow, door: { ...dialRow.door, dialModule: 'src/lib/x.js' } }]))
      .toThrow(/must live under src\/domain/);
    expect(Object.keys(CANONICAL_FIELDS).sort()).toEqual([...DARK_REASONS].sort());
    for (const entry of WRITER_DARK_REGISTER) {
      expect(Object.keys(entry).sort().join(',')).toBe(CANONICAL_FIELDS[entry.reason]);
    }
  });

  test('the two generation-dial rows are LIVE-VERIFIED, and NEITHER writer writes in any of OSR’s four spellings — the executed bit is the write proof', () => {
    const dialRows = WRITER_DARK_REGISTER.filter((row) => row.door?.kind === 'generation-dial');
    expect(dialRows.map((row) => row.identity).sort())
      .toEqual(['customContentRoster on settlement', 'densityRungRole on npcs']);
    // THE WHOLE REASON FOR THE RULING, asserted rather than asserted-about: the text
    // probe finds NOTHING at either writer. `customContentRoster` is written by an
    // ASSIGNMENT and `densityRungRole` through a COMPUTED PROPERTY KEY behind
    // RUNG_ROLE_FIELD, and OSR's four spellings (property, quoted, shorthand,
    // token-in-string-literal) see neither. A clause that read only that probe
    // convicted both as "the writer stopped writing", which is false.
    for (const row of dialRows) {
      expect(writeShapesIn(read(row.writer), row.key), `${row.identity}: the text probe must find NOTHING`)
        .toEqual([]);
      expect(live.dialGated.has(row.identity), `${row.identity} must be in the measured dialGated set`).toBe(true);
    }
    expect(read('src/generators/generateSettlementPipeline.js'))
      .toContain('finalCtx.settlement.customContentRoster = livingContentRoster;');
    expect(read('src/generators/density/applyDensityLaw.js')).toContain('[RUNG_ROLE_FIELD]:');
    // And the evidence the live run recorded names the proof it actually used.
    for (const row of liveEvidence.filter((entry) => dialRows.some((d) => d.identity === entry.identity))) {
      expect(row.writeProof).toBe('dialGated membership (executed: present lit, absent dark)');
    }
    for (const row of liveEvidence.filter((entry) => !dialRows.some((d) => d.identity === entry.identity))) {
      expect(row.writeProof).toMatch(/^source text \(/);
    }
  });

  test('THE WIDENING IS NARROW: a generation-dial identity that is NOT dial-gated still convicts at clause W', async () => {
    // The plant the ruling asks for. This row is spelled exactly like a real dial
    // row — same reason, same door shape, a writer that writes by ASSIGNMENT and so
    // is invisible to the text probe — and it differs in ONE respect: it is not in
    // the measured dialGated set. If the widening had swallowed the clause, this
    // would sail through. It must convict.
    const notGated = {
      identity: 'plantedAssignmentKey on settlement', key: 'plantedAssignmentKey', shape: 'settlement',
      writer: 'src/generators/generateSettlementPipeline.js', reason: 'dark-by-construction',
      door: {
        kind: 'generation-dial', configKey: '_livingContentLawVersion',
        dialModule: 'src/domain/content/livingContentLaw.js',
        dialExport: 'NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION',
        litModule: 'src/domain/content/livingContentLawVersion.js',
        litExport: 'ROSTER_LIVING_CONTENT_LAW_VERSION',
      },
      lighting: 'x'.repeat(90), car: '§7 the probe', charter: '§7 the probe',
    };
    const readAssignment = (path) => (path === notGated.writer
      ? 'ctx.settlement.plantedAssignmentKey = value;\n' : read(path));
    // Its write is invisible to the probe, exactly like the two real rows…
    expect(writeShapesIn('ctx.settlement.plantedAssignmentKey = value;\n', notGated.key)).toEqual([]);
    // …and it convicts anyway, because it is not dial-gated.
    const message = await convicts([notGated], {
      readSource: readAssignment, dialGated: live.dialGated,
    });
    expect(message).toContain('clause W');
    expect(message).toContain('not in the measured dialGated set');
    expect(message).toContain('BIT claim');
    // The ONLY thing that separates it from a row that passes is membership.
    const admitted = await assertWriterDarkRegisterEvidence([notGated], {
      root: ROOT,
      readSource: readAssignment,
      dialGated: new Set([...live.dialGated, notGated.identity]),
    });
    expect(admitted[0].writeProof).toBe('dialGated membership (executed: present lit, absent dark)');
  });

  test('THE WIDENING IS REASON-SCOPED: an engine-internal row whose writer writes only by assignment still convicts at clause W', async () => {
    // The second half of narrowness. The same invisible write, on a row whose REASON
    // is not generation-dial, gains nothing: the text probe still governs, because
    // an engine-internal row's key IS written by a shipped world and the probe is
    // the right instrument for it.
    const row = WRITER_DARK_REGISTER.find((entry) => entry.identity === 'cultureProfileKey on config');
    const message = await convicts([row], {
      readSource: (path) => (path === row.writer
        ? 'ctx.config.cultureProfileKey = culturalIdentity.key;\n' : read(path)),
      dialGated: live.dialGated,
    });
    expect(message).toContain('clause W');
    expect(message).toContain('no longer writes');
    expect(message).toContain('a row about nothing');
    // …and a pending-surface row is governed by the probe too.
    const pending = WRITER_DARK_REGISTER.find((entry) => entry.identity === 'isolationSupport on settlement');
    const pendingMessage = await convicts([pending], {
      readSource: (path) => (path === pending.writer
        ? 'ctx.settlement.isolationSupport = finding;\n' : read(path)),
      dialGated: live.dialGated,
    });
    expect(pendingMessage).toContain('clause W');
  });

  test('clause S is REASON-AWARE: a dial row is EXPECTED absent from the judged population, and a dial that has ROLLED convicts with its own instruction', async () => {
    const row = WRITER_DARK_REGISTER.find((entry) => entry.identity === 'densityRungRole on npcs');
    // Absent is CORRECT for this reason — the old clause S convicted exactly this
    // and would have convicted every correct dial row.
    const clean = await assertWriterDarkRegisterEvidence([row], {
      root: ROOT, dialGated: live.dialGated, verdicts: live.verdicts,
    });
    expect(clean[0].identity).toBe(row.identity);
    expect(live.verdicts.has(row.identity)).toBe(false);
    // PRESENT and DARK: the dial rolled, and the row must retire rather than be kept.
    const rolled = await convicts([row], {
      dialGated: live.dialGated,
      verdicts: new Map([[row.identity, { verdict: 'DARK', reach: {} }]]),
    });
    expect(rolled).toContain('the dial has ROLLED');
    expect(rolled).toContain('judged normally');
    // PRESENT and LIT: bank the win instead.
    const lit = await convicts([row], {
      dialGated: live.dialGated,
      verdicts: new Map([[row.identity, { verdict: 'LIT', reach: { 'web-display': 'R' } }]]),
    });
    expect(lit).toContain('BANK THE WIN');
    // And the ratchet's own comparison says the same thing rather than reporting
    // every correct dial row as a win to bank.
    expect(compareDark(liveView, baseline).struck).toEqual([]);
  });

  test('a generation-dial row with NO measured dialGated set convicts — an absent measurement is not an acquittal', async () => {
    const row = WRITER_DARK_REGISTER.find((entry) => entry.identity === 'customContentRoster on settlement');
    const message = await convicts([row], { verdicts: live.verdicts });
    expect(message).toContain('clause W');
    expect(message).toContain('no measured dialGated set was supplied');
    expect(message).toContain('not an acquittal');
    // The doors carry the measurement themselves, which is why the live run passes.
    expect(live.dialGated, 'measure() must build the dial corpora for the doors').toBeInstanceOf(Set);
    expect(live.dialGated.size).toBe(30);
  });

  test('a second --genesis over an existing baseline is refused', async () => {
    await expect(run(['--genesis', '--charter=§7 the probe'], {
      root: ROOT, baselineExists: () => true, log: () => {},
      writeBaseline: () => { throw new Error('the genesis door WROTE over an existing baseline'); },
    })).rejects.toThrow(/--genesis REFUSED/);
    await expect(run(['--genesis'], { root: ROOT, log: () => {} })).rejects.toThrow(/require --charter/);
    await expect(run(['--write'], {
      root: ROOT, baselineExists: () => false, log: () => {},
    })).rejects.toThrow(/refuse to mint a baseline/);
    await expect(run(['--report'], {
      root: ROOT, baselineExists: () => false, log: () => {},
    })).rejects.toThrow(/nothing to ratchet against/);
  });
});

describe('writer-with-no-reader ratchet: the MUTANTS', () => {
  let plantDir;
  let plantPaths;
  let mutantReads;
  let mutantCorpus;
  let plantClosureOf;

  beforeAll(async () => {
    plantDir = mkdtempSync(join(tmpdir(), 'wrw-mutants-'));
    const write = (name, body) => {
      const path = join(plantDir, name);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, body, 'utf8');
      return path;
    };

    // THE PLANTS. Each probe is addressed by its own file, so a mutant that fires
    // in the wrong place is visible as the wrong path, not as a passing test.
    plantPaths = {
      groundedWebReader: write('groundedWebReader.js',
        `export const show = (settlement) => settlement.${PLANTED_KEY};\n`),
      nameOnlyReader: write('nameOnlyReader.js',
        `export const show = (anything) => anything.${PLANTED_KEY};\n`),
      dossierReader: write('dossierReader.js',
        `export const draw = (settlement) => settlement.${PLANTED_KEY};\n`),
      stopReader: write('stopReader.js',
        `export const internal = (settlement) => settlement.${PLANTED_KEY};\n`),
    };

    // The write side: a synthetic key spread onto a COPY of corpus.shapes. The
    // product tree is never touched and the real corpus is never edited.
    mutantCorpus = {
      ...live.corpus,
      shapes: {
        ...live.corpus.shapes,
        settlement: {
          ...live.corpus.shapes.settlement,
          keys: [...live.corpus.shapes.settlement.keys, PLANTED_KEY],
        },
      },
    };

    // ONE extra scan: the real in-closure files PLUS every plant, with each plant
    // reported at a synthetic repo-relative path so closure membership per mutant
    // is a set choice rather than another tree walk.
    const plantRel = new Map([
      [plantPaths.groundedWebReader, 'src/components/planted/groundedWebReader.js'],
      [plantPaths.nameOnlyReader, 'src/components/planted/nameOnlyReader.js'],
      [plantPaths.dossierReader, 'src/pdf/planted/dossierReader.js'],
      [plantPaths.stopReader, 'src/generators/planted/stopReader.js'],
    ]);
    const files = [...sourceFiles(ROOT), ...Object.values(plantPaths)];
    const index = buildIndex(files);
    const keysToShapes = keysToShapesOf(mutantCorpus);
    mutantReads = countedScan({
      index,
      corpus: mutantCorpus,
      files: [...live.union, ...Object.values(plantPaths)],
      root: ROOT,
      keysToShapes,
      relOverride: (file) => plantRel.get(file)
        ?? ((file.startsWith(ROOT) ? file.slice(ROOT.length + 1) : file).split('\\').join('/')),
    });

    // Judge with an arbitrary closure set. Pure and cheap: no scan.
    plantClosureOf = (admitted = []) => {
      const closures = {};
      for (const cls of SURFACE_CLASSES) closures[cls] = new Set(live.closures[cls]);
      for (const [cls, path] of admitted) closures[cls].add(join(ROOT, path));
      return judgeWriters({
        corpus: mutantCorpus, closures, reads: mutantReads.reads, root: ROOT, allowlist: live.allowlist,
      });
    };
  }, 300_000);

  const plantedVerdict = (judged) => judged.verdicts.get(`${PLANTED_KEY} on settlement`);

  test('THE PARTITION HOLDS: each planted probe is addressed by its own file', () => {
    const entry = mutantReads.reads.get(`${PLANTED_KEY} on settlement`);
    expect([...entry.R].sort()).toEqual(['src/components/planted/groundedWebReader.js', 'src/pdf/planted/dossierReader.js', 'src/generators/planted/stopReader.js'].sort());
    expect([...entry.N].sort()).toEqual([
      'src/components/planted/groundedWebReader.js',
      'src/components/planted/nameOnlyReader.js',
      'src/generators/planted/stopReader.js',
      'src/pdf/planted/dossierReader.js',
    ]);
    expect(new Set(Object.values(plantPaths)).size).toBe(4);
  });

  test('THE MUTANT REDS: a synthetic written key on a judged shape with no reader is DARK, unregistered, ceiling 0', () => {
    const judged = plantClosureOf([]);
    expect(plantedVerdict(judged).verdict).toBe('DARK');
    const view = { ...liveViewOf({ ...live, verdicts: judged.verdicts, thinKeys: live.thinKeys, thinShapes: live.thinShapes, knownShapes: judged.knownShapes }) };
    const comparison = compareDark(view, baseline);
    expect(comparison.violations).toEqual([`${PLANTED_KEY} on settlement`]);
  });

  test('THE MUTANT LIGHTS AT GRADE R: a planted web root reading settlement.__plantedWrittenKey', () => {
    const judged = plantClosureOf([['web-display', 'src/components/planted/groundedWebReader.js']]);
    const row = plantedVerdict(judged);
    expect(row.verdict).toBe('LIT');
    expect(row.reach['web-display']).toBe('R');
  });

  test('THE MUTANT LIGHTS AT GRADE N ONLY: the same key read on an unresolvable receiver', () => {
    const judged = plantClosureOf([['web-display', 'src/components/planted/nameOnlyReader.js']]);
    const row = plantedVerdict(judged);
    expect(row.verdict).toBe('LIT-NAME');
    expect(row.reach['web-display']).toBe('N');
  });

  test('THE STOP HOLDS: the same read planted at a src/generators path lights nothing', () => {
    const judged = plantClosureOf([]);
    expect(plantedVerdict(judged).verdict).toBe('DARK');
    const stopPath = 'src/generators/planted/stopReader.js';
    const entry = mutantReads.reads.get(`${PLANTED_KEY} on settlement`);
    expect(entry.R.has(stopPath), 'the read exists at the generators path').toBe(true);
    for (const cls of SURFACE_CLASSES) {
      const closure = new Set([...live.closures[cls]].map(rel));
      expect(closure.has(stopPath), `${cls} must never contain a generators file`).toBe(false);
    }
  });

  test('THE CLASS MAP DISCRIMINATES: a read planted in the dossier-pdf root set lights dossier-pdf and not campaign-pdf', () => {
    const judged = plantClosureOf([['dossier-pdf', 'src/pdf/planted/dossierReader.js']]);
    const row = plantedVerdict(judged);
    expect(row.verdict).toBe('LIT');
    expect(row.reach['dossier-pdf']).toBe('R');
    expect(row.reach['campaign-pdf']).toBeUndefined();
    expect(row.reach['world-book']).toBeUndefined();
  });

  test('EVERY EDGE KIND IS FOLLOWED: static, export-from, import(), new URL(…, import.meta.url), require, and the extensionless .jsx specifier', () => {
    const dir = mkdtempSync(join(tmpdir(), 'wrw-edges-'));
    const put = (name, body) => {
      const path = join(dir, name);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, body, 'utf8');
      return path;
    };
    const target = put('target.js', 'export const value = 1;\n');
    const jsxTarget = put('tabs/FaithProbe.jsx', 'export default () => null;\n');
    const chains = {
      static: put('a-static.js', "import { value } from './target.js';\nexport default value;\n"),
      exportFrom: put('b-export.js', "export { value } from './target.js';\n"),
      dynamic: put('c-dynamic.js', "export const load = () => import('./target.js');\n"),
      workerUrl: put('d-url.js', "export const w = new URL('./target.js', import.meta.url);\n"),
      require: put('e-require.js', "const t = require('./target.js');\nexport default t;\n"),
      extensionless: put('f-extensionless.js', "export const load = () => import('./tabs/FaithProbe');\n"),
    };
    const index = buildIndex([target, jsxTarget, ...Object.values(chains)]);
    const edges = edgeMapOf(index);
    for (const [kind, file] of Object.entries(chains)) {
      const expected = kind === 'extensionless' ? jsxTarget : target;
      expect([...(edges.get(file) ?? [])], `${kind} edge was not followed`).toEqual([expected]);
      expect([...reachFrom([file], edges)].sort()).toEqual([file, expected].sort());
    }
    expect(resolveSpecifier(chains.extensionless, './tabs/FaithProbe', index.sources)).toBe(jsxTarget);
    expect(resolveSpecifier(chains.static, 'typescript', index.sources)).toBeNull();
    expect(importEdgesOf(index.sources.get(target), target, index.sources).size).toBe(0);
  });

  test('THE SWAP MUTANT: a new dark identity at constant count reds with its identity named', () => {
    const judged = plantClosureOf([]);
    const swapped = new Map(judged.verdicts);
    const victim = baseline.darkUnregistered[0].identity;
    swapped.delete(victim);
    const view = liveViewOf({
      ...live, verdicts: swapped, knownShapes: judged.knownShapes,
    });
    expect(view.population.dark).toBe(baseline.population.dark);
    const comparison = compareDark(view, baseline);
    expect(comparison.violations).toEqual([`${PLANTED_KEY} on settlement`]);
    expect(comparison.stale.map((row) => row.identity)).toEqual([victim]);
  });

  test('THE GROWTH LAW IS EXECUTED: a live-derived register is green and ONE planted dark identity reds', async () => {
    expect(compareDark(liveView, baseline).violations).toEqual([]);
    const judged = plantClosureOf([]);
    const view = liveViewOf({ ...live, verdicts: judged.verdicts, knownShapes: judged.knownShapes });
    let refusal = null;
    try {
      await run(['--write'], {
        root: ROOT, log: () => {}, measured: { ...live, verdicts: judged.verdicts, knownShapes: judged.knownShapes },
        writeBaseline: () => { throw new Error('--write GREW the cohort'); },
      });
    } catch (error) { refusal = error.message; }
    expect(refusal).toContain('--write REFUSED');
    expect(refusal).toContain(`${PLANTED_KEY} on settlement`);
    expect(view.population.dark).toBe(baseline.population.dark + 1);
  });

  test('\u26a0\u26a0 THE SCAN BUDGET: exactly TWO full-tree scans, never one per mutant', async () => {
    expect(scansRun, 'a mutant suite that scans per plant costs minutes per gate').toBe(2);
    expect(live.scanStats.files).toBe(live.union.size);
    expect(mutantReads.stats.files).toBe(live.union.size + 4);
    // AND a door that is going to REFUSE must refuse before it measures. This arm
    // exists because the refusal tests above once spent a full corpus build and a
    // full-tree scan on their way to a guard the flags had already decided — 25 s
    // per refusal, and a scan this very budget could not see, because `run` calls
    // the scanner directly rather than through the counter above.
    const before = scansRun;
    let refused = null;
    try {
      await run(['--report'], {
        root: ROOT, baselineExists: () => false, log: () => {},
        measured: (() => { throw new Error('the refusing door MEASURED before it refused'); }),
      });
    } catch (error) { refused = error.message; }
    expect(refused).toContain('nothing to ratchet against');
    expect(scansRun, 'a refusing door must not spend a scan').toBe(before);
  });
});

describe('writer-with-no-reader ratchet: the lit-dial arm', () => {
  let litShapes;
  let controlShapes;
  let dialConfigKeys;
  let gated;
  let confounded;
  let packControlOnly;

  beforeAll(async () => {
    // The dial corpora are built ONCE, inside `measure`, because clause W now reads
    // `dialGated` as the write proof for every generation-dial row and the doors
    // must carry that measurement themselves. Rebuilding here would cost two more
    // producer-1 runs to reproduce a set the walker already holds.
    litShapes = live.litShapes;
    controlShapes = live.controlShapes;
    dialConfigKeys = live.dialConfigKeys;
    gated = live.dialGated;
    packControlOnly = dialGatedOf(litShapes, [controlShapes], live.knownShapes, dialConfigKeys);
    confounded = dialGatedOf(litShapes, [live.corpus.shapes], live.knownShapes, dialConfigKeys);
  }, 300_000);

  test('the lit corpus observed customContentRoster on settlement and the dark corpus did not — the MAT retro-control, executed', () => {
    expect(litShapes.settlement.keys).toContain('customContentRoster'); // anchored: the dark side is asserted absent on the next line, so a corpus that carried it everywhere would fail there
    expect(live.corpus.shapes.settlement.keys.includes('customContentRoster')).toBe(false);
    expect(controlShapes.settlement.keys.includes('customContentRoster')).toBe(false);
    expect(gated.has('customContentRoster on settlement')).toBe(true);
    // The key is written, gated and read by nothing: a textbook writer without a
    // reader that the walker's own corpus cannot see, because a dark world does not
    // write it at all. That is the whole reason this arm exists.
    expect(live.verdicts.has('customContentRoster on settlement')).toBe(false);
  });

  test('the density v2 roll is dial-gated: densityRungRole on npcs is present lit and absent dark', () => {
    expect(litShapes.npcs.keys).toContain('densityRungRole'); // anchored: the dark side is asserted absent on the next line
    expect(live.corpus.shapes.npcs.keys.includes('densityRungRole')).toBe(false);
    expect(gated.has('densityRungRole on npcs')).toBe(true);
    expect(gated.has('densityRungRole on members')).toBe(true);
    expect(live.verdicts.has('densityRungRole on npcs')).toBe(false);
  });

  test('the dial-gated set is DOUBLY CONTROLLED: the pack is not a dial and neither is the producer set, and the uncontrolled reading fires the STOP', () => {
    // §7.1 compares the lit corpus against the WALKER'S corpus, which moves two
    // variables at once and misses a third. Every reading is asserted TOGETHER so
    // the corrections are measured quantities rather than an argument.
    expect(confounded.size, 'lit vs the walker corpus: the pack counted as a dial').toBe(54);
    expect(packControlOnly.size, 'pack held constant, producer set still asymmetric').toBe(34);
    expect(gated.size, 'both controls applied').toBe(30);
    expect(confounded.size - packControlOnly.size, '23 pack-attributable, less 3 the pack control also gains (was 24/21 before source on stressors turned ordinary at §900)')
      .toBe(20);
    // The four the DARK-corpus control removes are keys a shipped world does write,
    // through producers the 16-generation producer-1 control never runs (three since Car 3;
    // `source on stressors` joined them at §900 when the corpus configs took `stressTypes`).
    expect([...packControlOnly].filter((identity) => !gated.has(identity)).sort()).toEqual([
      'description on factions', 'name on traditions', 'severity on stressors', 'source on stressors',
    ]);
    expect(gated.size, 'STOP: |dialGated| > 40 — classify per dial before rowing').toBeLessThanOrEqual(40);
    expect(confounded.size, 'the uncontrolled reading WOULD fire the STOP, which is why it is not the rule')
      .toBeGreaterThan(40);
    // An uncontrolled call is refused outright rather than answered wrongly.
    expect(() => dialGatedOf(litShapes, [], live.knownShapes, dialConfigKeys))
      .toThrow(/requires at least one CONTROL corpus/);
  });

  test('every dial-gated identity is in the frozen roster and every frozen entry is still dial-gated — a new dial-gated key reds by name', () => {
    expect([...gated].sort()).toEqual([...FROZEN_DIAL_GATED]);
    expect(FROZEN_DIAL_GATED.length).toBe(30);
    expect(new Set(FROZEN_DIAL_GATED).size).toBe(FROZEN_DIAL_GATED.length);
    for (const identity of FROZEN_DIAL_GATED) {
      expect(identity).toMatch(/^\S+ on \S+$/);
      const [, shape] = identity.split(' on ');
      expect(live.knownShapes.has(shape), `${identity} names a shape the walker does not judge`).toBe(true);
    }
    // THE DIRECTION THAT IS LIVE TODAY: no generation-dial row may exist outside the
    // gated set. It is currently empty and says so out loud, because clause W cannot
    // admit either drafted row — the debt is stated, not hidden behind a vacuous pass.
    // Car 4 admitted the two rows the chair ruled on (ledger §882.15). The law that
    // is LIVE in this direction: no generation-dial row may exist outside the gated
    // set. The reverse — every gated identity carries a row — remains OWED for the
    // other 29, and the frozen roster above is what guards them meanwhile.
    const dialRows = WRITER_DARK_REGISTER.filter((row) => row.door?.kind === 'generation-dial');
    expect(dialRows.map((row) => row.identity).sort())
      .toEqual(['customContentRoster on settlement', 'densityRungRole on npcs']);
    for (const row of dialRows) expect(gated.has(row.identity)).toBe(true);
  });

  test('the lit arm changes no draw: the walker corpus is byte-identical beside the lit one, and the dials are passed on the arm’s own configs', () => {
    expect(shapesDigestOf(live.corpus.shapes)).toBe(baseline.shapesDigest);
    // THE PROMISE: a fixed reference world is never silently re-rolled. The arm never
    // flips NEW_SETTLEMENT_*; it passes explicit versions on in-memory configs, which
    // is why the walker's corpus is untouched by a lit run in the same process.
    expect(dialConfigKeys.sort()).toEqual(['_densityLawVersion', '_livingContentLawVersion']);
    for (const key of dialConfigKeys) {
      expect(read('src/generators/generateSettlementPipeline.js')).not.toContain(`NEW_SETTLEMENT_${key}`); // anchored: the two dial keys are asserted non-empty above, so this cannot pass on an empty loop
    }
    expect(litShapes.settlement.rows).toBe(16);
    expect(controlShapes.settlement.rows).toBe(16);
  });

  test('a lit-dial identity that gains a surface reader is convicted as struck, not silently lit', async () => {
    // The row shape a widened clause W would admit, driven end to end against the
    // real doors: the dial is dark (so D-dial passes) and the identity has gained a
    // reader (so clause S convicts with the strike instruction).
    const dialRow = {
      identity: 'customContentRoster on settlement', key: 'customContentRoster', shape: 'settlement',
      writer: 'src/generators/generateSettlementPipeline.js', reason: 'dark-by-construction',
      door: {
        kind: 'generation-dial', configKey: '_livingContentLawVersion',
        dialModule: 'src/domain/content/livingContentLaw.js',
        dialExport: 'NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION',
        litModule: 'src/domain/content/livingContentLawVersion.js',
        litExport: 'ROSTER_LIVING_CONTENT_LAW_VERSION',
      },
      lighting: 'x'.repeat(90), car: '§7 the probe', charter: '§866 the MAT pick',
    };
    let message = null;
    try {
      await assertWriterDarkRegisterEvidence([dialRow], {
        root: ROOT,
        readSource: (path) => (path === dialRow.writer
          ? 'const settlement = { customContentRoster: roster };\n' : read(path)),
        verdicts: new Map([[dialRow.identity, { verdict: 'LIT', reach: { 'web-display': 'R' } }]]),
        dialGated: gated,
      });
    } catch (error) { message = error.message; }
    expect(message).toContain('BANK THE WIN');
    expect(message).toContain('strike the row');
    // And with the dials EQUAL the same row dies at D-dial instead, before clause S.
    let rolled = null;
    try {
      await assertWriterDarkRegisterEvidence([dialRow], {
        root: ROOT,
        readSource: (path) => (path === dialRow.writer
          ? 'const settlement = { customContentRoster: roster };\n' : read(path)),
        importModule: async () => ({
          NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION: 2, ROSTER_LIVING_CONTENT_LAW_VERSION: 2,
        }),
        dialGated: gated,
      });
    } catch (error) { rolled = error.message; }
    expect(rolled).toContain('D-dial');
    expect(rolled).toContain('already EQUALS');
  });
});
