#!/usr/bin/env node
/**
 * check-writer-reach.mjs — THE WRITER-WITH-NO-READER RATCHET (HORIZON §7, §1.10).
 *
 * Builds the observed corpus ONCE, derives the customer-surface closures, scans
 * every in-closure file for reads of every written key, grades each written
 * identity, and compares the DARK set against the frozen register. A DARK
 * identity that is neither a hand-authored ROW nor a member of the banked cohort
 * is a VIOLATION at ceiling 0 — "generated and silently unshown" is the defect
 * this instrument exists to refuse.
 *
 * ── THE DOORS ────────────────────────────────────────────────────────────────
 *   (no flag) / --report / --report-to=<path outside the repo>
 *        Measure and report. Never writes the baseline. The HOLD line prints the
 *        outstanding pending-surface debt so every landing sees it.
 *        ⚠ The charter spells this `--report[=<path>]`. `parseExactFlags` cannot
 *        express an OPTIONAL value: a `value` flag refuses the bare form and a
 *        `flag` refuses a value. Two names is the honest spelling inside the
 *        estate's own closed-vocabulary parser; inventing a third parser to match
 *        a prose spelling would be the worse trade.
 *   --write
 *        SHRINK-ONLY re-freeze. Refuses growth and refuses a missing baseline.
 *        Folds identities that are no longer DARK (or no longer written) OUT of
 *        the banked cohort. It can never absorb a new dark identity.
 *   --genesis --charter=§NNN
 *        Once, chair-signed. REFUSES if a baseline already exists — a second
 *        genesis is how a ratchet is silently reset. Banks the cohort WHOLE so
 *        the walker lands GREEN: a walker born red is a walker someone disables.
 *   --rebank --charter=§NNN
 *        THE ONE GOVERNED GROWTH DOOR, for the MIN_ROWS-crossing detonation
 *        class: a shape crossing 40 rows floods hundreds of identities at once
 *        and no row-by-row door can absorb it. Appends a `rebankHistory` row.
 *
 * ⚠ NOT IN `package.json`. The gate authority is the vitest walker, exactly as
 * OSR's own `check:observed-shape-readers` is not in the `check` chain — build
 * efficiency §7: no chain step, no conditional arm. Zero `package.json` bytes.
 *
 * ⚠ NO `UPDATE_*` ENV SPELLING ANYWHERE. GOLDEN's Arm 2 censuses
 * `process.env.UPDATE_[A-Z_]*`; this instrument's doors are CLI flags, OSR's own
 * spelling (ODQ §858).
 *
 * @see docs/DESIGN_HORIZON.md §7, §1.10   (the charter; on the ledger line)
 */
import {
  closeSync, constants, existsSync, fsyncSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SURFACE_CLASSES, COUNTING_CLASSES, REPORT_ONLY_CLASSES, SURFACE_ROOTS, SURFACE_CLOSURE_STOP,
  WEB_DISPLAY_DIRS, buildIndex, MIN_ROWS, edgeMapOf, surfaceClosures, scanSurfaceReads,
  judgeWriters, keysToShapesOf, writerIdentity, formatReach, reviewableDark,
  shapesDigestOf, verdictDigestOf, detectorDigestOf, canonicalJson,
} from './lib/writer-reach-scan.mjs';
import {
  WRITER_DARK_REGISTER, assertWriterDarkRegister, assertWriterDarkRegisterEvidence,
  pendingSurfaceBacklog, registerDigestOf,
} from './lib/writer-dark-register.mjs';
import { buildObservedCorpus } from './lib/observed-shape-corpus.mjs';
import { buildLitDialCorpus, dialGatedOf } from './lib/writer-reach-lit-corpus.mjs';
import { sourceFiles } from './check-observed-shape-readers.mjs';
import { parseExactFlags, planExternalArtifactOutputs, publishJsonExclusive } from './lib/governed-artifact-io.mjs';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const BASELINE_PATH = 'scripts/.writer-reach-baseline.json';
export const SCHEMA = 1;

/** The sentinel floor: a closure or a population that collapsed greens everything. */
export const SENTINEL_FLOOR = 0.9;

const FLAGS = Object.freeze({
  '--report': { kind: 'flag', name: 'report' },
  '--report-to': { kind: 'value', name: 'reportTo' },
  '--write': { kind: 'flag', name: 'write' },
  '--genesis': { kind: 'flag', name: 'genesis' },
  '--rebank': { kind: 'flag', name: 'rebank' },
  '--charter': { kind: 'value', name: 'charter' },
});

const CONFLICTS = [['--write', '--genesis', '--rebank']];

const headSha = (root) => execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();

/**
 * THE MEASUREMENT. One corpus, one index, one edge map, one scan — everything the
 * doors share. `scansRun` is returned so the walker can pin that the gate does
 * exactly the scans it budgeted for.
 */
export async function measure({
  root = ROOT, corpus = null, files = null, scan = scanSurfaceReads, withDialCorpus = true,
} = {}) {
  const observed = corpus ?? await buildObservedCorpus();
  const sources = files ?? sourceFiles(root);
  const index = buildIndex(sources);
  const edgesByFile = edgeMapOf(index);
  const { closures, web, liveComponents } = surfaceClosures({ edgesByFile, root });
  const keysToShapes = keysToShapesOf(observed);
  const union = new Set();
  for (const cls of SURFACE_CLASSES) for (const file of closures[cls]) union.add(file);

  const { PUBLIC_TOPLEVEL_KEYS, NPC_PUBLIC_KEYS } = await import(join(root, 'src/domain/display/publicSafe.js'));
  const allowlist = new Set([
    ...PUBLIC_TOPLEVEL_KEYS.map((key) => writerIdentity(key, 'settlement')),
    ...NPC_PUBLIC_KEYS.map((key) => writerIdentity(key, 'npcs')),
  ]);

  const { reads, stats } = scan({
    index, corpus: observed, files: [...union], root, keysToShapes,
  });
  const judged = judgeWriters({ corpus: observed, closures, reads, root, allowlist });

  // ⭐ THE DIAL CORPORA (Car 3's arm, made a first-class part of the measurement by
  // Car 4). Clause W now reads `dialGated` as the WRITE PROOF for every
  // generation-dial row, and a missing set CONVICTS rather than excusing — so the
  // doors must carry the measurement, not hope a caller supplies it. Two producer-1
  // runs, about 1.3 s beside an 8.5 s corpus build.
  let litShapes = null;
  let controlShapes = null;
  let dialConfigKeys = [];
  let dialGated = null;
  if (withDialCorpus) {
    const lit = await buildLitDialCorpus({ root });
    const control = await buildLitDialCorpus({ root, rollDials: false });
    litShapes = lit.shapes;
    controlShapes = control.shapes;
    dialConfigKeys = lit.dialConfigKeys;
    dialGated = dialGatedOf(litShapes, [controlShapes, observed.shapes], judged.knownShapes, dialConfigKeys);
  }

  return {
    root, corpus: observed, index, edgesByFile, closures, web, liveComponents, union,
    reads, scanStats: stats, allowlist, litShapes, controlShapes, dialConfigKeys, dialGated, ...judged,
  };
}

/** The DARK cohort, as banked: identity, key, shape, rows — never the reader lists. */
export function cohortOf(verdicts) {
  return [...verdicts.values()]
    .filter((row) => row.verdict === 'DARK')
    .map(({ identity, key, shape, rows }) => ({ identity, key, shape, rows }))
    .sort((a, b) => (a.identity < b.identity ? -1 : 1));
}

/**
 * THE COMPARISON — the four ways the live tree can disagree with the register.
 *
 * violation — a DARK identity neither registered nor banked. Ceiling 0. This is
 *             the defect: a new generated fact nobody shows.
 * stale     — a banked identity that is now LIT or no longer written. Folded out
 *             by `--write`, which may only SHRINK the cohort.
 * struck    — a REGISTERED row whose identity is now LIT. A code edit: bank the
 *             win, strike the row, and `registerDigest` moves with it.
 * sentinel  — `population.judged` or any closure below 0.9x its frozen size. An
 *             empty closure would green everything; the vacuity OSR's own
 *             sentinel refuses.
 */
export function compareDark(live, frozen, register = WRITER_DARK_REGISTER) {
  const registered = new Set(register.map((row) => row.identity));
  const banked = new Set(frozen.darkUnregistered.map((row) => row.identity));
  const liveDark = new Set(live.cohort.map((row) => row.identity));
  const liveJudged = new Set(live.judgedIdentities);

  const violations = live.cohort
    .filter((row) => !registered.has(row.identity) && !banked.has(row.identity))
    .map((row) => row.identity)
    .sort();

  const stale = [...banked]
    .filter((identity) => !liveDark.has(identity))
    .map((identity) => ({
      identity,
      now: liveJudged.has(identity) ? (live.verdictOf.get(identity) ?? 'UNKNOWN') : 'NO LONGER WRITTEN',
    }))
    .sort((a, b) => (a.identity < b.identity ? -1 : 1));

  // ⚠ REASON-AWARE, for the same reason clause S is (ledger §882.15). A
  // generation-dial row's identity is EXPECTED to be missing from the dark cohort —
  // that absence IS the dormancy it claims — so reading it as "struck" would report
  // every correct dial row as a win to bank. What IS a finding for such a row is
  // PRESENCE: the dial has rolled and a shipped world now writes the key.
  const isDialRow = (row) => row.reason === 'dark-by-construction' && row.door?.kind === 'generation-dial';
  const struck = register
    .filter((row) => (isDialRow(row) ? liveJudged.has(row.identity) : !liveDark.has(row.identity)))
    .map((row) => ({
      identity: row.identity,
      reason: row.reason,
      now: liveJudged.has(row.identity) ? (live.verdictOf.get(row.identity) ?? 'UNKNOWN') : 'NO LONGER WRITTEN',
      dialRolled: isDialRow(row) && liveJudged.has(row.identity),
    }));

  const sentinel = [];
  if (live.population.judged < frozen.population.judged * SENTINEL_FLOOR) {
    sentinel.push(`judged population COLLAPSED: ${live.population.judged} against a frozen`
      + ` ${frozen.population.judged} (floor ${Math.ceil(frozen.population.judged * SENTINEL_FLOOR)}).`
      + ' An empty population greens every identity at once.');
  }
  for (const cls of SURFACE_CLASSES) {
    const frozenSize = frozen.closureSizes[cls];
    const liveSize = live.closureSizes[cls];
    if (typeof frozenSize !== 'number') continue;
    if (liveSize < frozenSize * SENTINEL_FLOOR) {
      sentinel.push(`the ${cls} closure COLLAPSED: ${liveSize} files against a frozen ${frozenSize}`
        + ` (floor ${Math.ceil(frozenSize * SENTINEL_FLOOR)}). An empty closure greens everything it should judge.`);
    }
  }
  return { violations, stale, struck, sentinel };
}

/** The live half of a comparison, shaped for `compareDark`. */
export function liveViewOf(measured) {
  const cohort = cohortOf(measured.verdicts);
  const verdictOf = new Map([...measured.verdicts.values()].map((row) => [row.identity, row.verdict]));
  return {
    cohort,
    verdictOf,
    judgedIdentities: [...measured.verdicts.keys()],
    population: {
      judged: measured.verdicts.size,
      lit: [...measured.verdicts.values()].filter((r) => r.verdict === 'LIT').length,
      litName: [...measured.verdicts.values()].filter((r) => r.verdict === 'LIT-NAME').length,
      dark: cohort.length,
      thinKeys: measured.thinKeys,
      thinShapes: measured.thinShapes,
      knownShapes: measured.knownShapes.size,
    },
    closureSizes: Object.fromEntries(SURFACE_CLASSES.map((cls) => [cls, measured.closures[cls].size])),
  };
}

/** The frozen register, built from a measurement. */
export function baselineOf({ measured, charter, sha, previous = null }) {
  const live = liveViewOf(measured);
  const surfaceReach = {};
  for (const row of measured.verdicts.values()) {
    if (row.verdict === 'THIN') continue;
    surfaceReach[row.identity] = formatReach(row.reach);
  }
  return {
    _doc: [
      'WRWALKER — the writer-with-no-reader register (HORIZON §7, §1.10).',
      'Every DARK identity here is BANKED and UNREVIEWED; the hand-authored rows with',
      'their convicted reasons live in scripts/lib/writer-dark-register.mjs. The bank is',
      'SHRINK-ONLY: --write may fold members out, never in. The one growth door is',
      '--rebank --charter=§NNN, for a shape crossing MIN_ROWS and flooding the cohort.',
      'The reviewable slice is computed by RULE (reviewableDark), never hand-listed.',
    ],
    schema: SCHEMA,
    frozenAtSha: sha,
    charter,
    minRows: MIN_ROWS,
    corpusMeta: { ...measured.corpus.meta },
    shapesDigest: shapesDigestOf(measured.corpus.shapes),
    detectorDigest: detectorDigestOf(measured.root),
    verdictDigest: verdictDigestOf(measured.verdicts),
    surfaceRoots: JSON.parse(JSON.stringify(SURFACE_ROOTS)),
    webDisplayDirs: [...WEB_DISPLAY_DIRS],
    stopSet: [...SURFACE_CLOSURE_STOP],
    countingClasses: [...COUNTING_CLASSES],
    reportOnlyClasses: [...REPORT_ONLY_CLASSES],
    closureSizes: live.closureSizes,
    population: live.population,
    scanStats: { ...measured.scanStats },
    registerDigest: registerDigestOf(),
    pendingSurfaceCeiling: pendingSurfaceBacklog().length,
    reviewableDarkCount: reviewableDark(live.cohort).length,
    darkUnregistered: live.cohort.filter(
      (row) => !WRITER_DARK_REGISTER.some((entry) => entry.identity === row.identity),
    ),
    surfaceReach,
    rebankHistory: previous ? [...(previous.rebankHistory ?? [])] : [],
  };
}

/** The `--report` payload. Groups the cohort the way the review must read it. */
export function reportOf(measured) {
  const live = liveViewOf(measured);
  const reviewable = reviewableDark(live.cohort);
  const byShape = new Map();
  for (const row of reviewable) byShape.set(row.shape, (byShape.get(row.shape) ?? 0) + 1);
  const litNameOnly = [...measured.verdicts.values()]
    .filter((row) => row.verdict === 'LIT-NAME').map((row) => row.identity).sort();
  const webOnlyGap = [...measured.verdicts.values()]
    .filter((row) => row.verdict === 'LIT' && row.reach['web-display']
      && !row.reach['dossier-pdf'] && !row.reach['campaign-pdf'] && !row.reach['world-book'])
    .map((row) => row.identity).sort();
  return {
    population: live.population,
    closureSizes: live.closureSizes,
    liveComponents: measured.liveComponents,
    webWhole: measured.web.size,
    reviewableDark: reviewable.map((row) => row.identity),
    reviewableDarkByShape: [...byShape].sort((a, b) => b[1] - a[1]),
    bankedCohort: live.cohort.length,
    litNameOnly,
    litNameOnlyShare: +(100 * litNameOnly.length / live.population.judged).toFixed(2),
    webOnlyGap,
    pendingSurfaceBacklog: pendingSurfaceBacklog(),
    registerRows: WRITER_DARK_REGISTER.map((row) => ({ identity: row.identity, reason: row.reason })),
  };
}

/** The HOLD line every landing reads — the outstanding pending-surface debt, printed. */
export function holdLine(report) {
  const backlog = report.pendingSurfaceBacklog;
  const debt = backlog.length
    ? backlog.map((row) => `${row.identity} → ${row.surface} (${row.car})`).join('; ')
    : 'none';
  return `WRWALKER HOLD — judged ${report.population.judged} · LIT ${report.population.lit}`
    + ` · LIT-NAME ${report.population.litName} · DARK ${report.population.dark}`
    + ` (reviewable ${report.reviewableDark.length}) · pending-surface debt: ${debt}`;
}

// ── THE DOORS ───────────────────────────────────────────────────────────────

export async function run(argv = [], overrides = {}) {
  const flags = parseExactFlags(argv, FLAGS, { conflicts: CONFLICTS });
  const root = overrides.root ?? ROOT;
  const baselinePath = join(root, BASELINE_PATH);
  const log = overrides.log ?? ((line) => console.log(line));
  const exists = overrides.baselineExists ?? (() => existsSync(baselinePath));
  const readBaseline = overrides.readBaseline ?? (() => JSON.parse(readFileSync(baselinePath, 'utf8')));
  const writeBaseline = overrides.writeBaseline ?? ((value) => writeBaselineAtomically(baselinePath, value));

  if ((flags.genesis || flags.rebank) && !flags.charter) {
    throw new Error('writer-reach: --genesis and --rebank require --charter=§NNN. An ungoverned bank is not a bank.');
  }
  if (flags.genesis && exists()) {
    throw new Error(`writer-reach: --genesis REFUSED — ${BASELINE_PATH} already exists. A second genesis is how a`
      + ' ratchet is silently reset; use --write to shrink, or --rebank --charter=§NNN for the governed growth door.');
  }
  if ((flags.write || flags.rebank) && !exists()) {
    throw new Error(`writer-reach: ${BASELINE_PATH} is missing. --write and --rebank refuse to mint a baseline;`
      + ' run --genesis --charter=§NNN once, chair-signed.');
  }
  // ⚠ EVERY CHEAP REFUSAL COMES BEFORE THE MEASUREMENT. A door that is going to
  // refuse must refuse in milliseconds, not after an 8.5 s corpus build and a
  // full-tree scan — otherwise a mistyped flag costs half a minute, and (worse) a
  // refusal path silently spends a scan the budget pin cannot see.
  if (!flags.genesis && !exists()) {
    throw new Error(`writer-reach: ${BASELINE_PATH} is missing, so there is nothing to ratchet against.`
      + ' Run --genesis --charter=§NNN once, chair-signed. A comparison with no frozen half is not a green.');
  }

  assertWriterDarkRegister();
  const measured = overrides.measured ?? await measure({ root });
  const live = liveViewOf(measured);
  const report = reportOf(measured);

  await assertWriterDarkRegisterEvidence(WRITER_DARK_REGISTER, {
    root,
    verdicts: measured.verdicts,
    closures: Object.fromEntries(SURFACE_CLASSES.map((cls) => [
      cls, new Set([...measured.closures[cls]].map((f) => (f.startsWith(root) ? f.slice(root.length + 1) : f))),
    ])),
    pendingCeiling: exists() ? readBaseline().pendingSurfaceCeiling : null,
    dialGated: measured.dialGated,
  });

  if (flags.genesis) {
    const baseline = baselineOf({ measured, charter: flags.charter, sha: headSha(root) });
    writeBaseline(baseline);
    log(`writer-reach GENESIS — ${baseline.population.judged} identities judged, ${baseline.population.dark} DARK`
      + ` (${baseline.reviewableDarkCount} reviewable), ${WRITER_DARK_REGISTER.length} registered rows,`
      + ` cohort banked WHOLE under ${flags.charter}.`);
    log(holdLine(report));
    return { ok: true, action: 'genesis', baseline, report };
  }

  const frozen = readBaseline();
  const comparison = compareDark(live, frozen);

  if (flags.write || flags.rebank) {
    const growth = comparison.violations;
    if (growth.length && !flags.rebank) {
      throw new Error(`writer-reach: --write REFUSED — it may only SHRINK the banked cohort, and ${growth.length}`
        + ` identities are DARK, unregistered and unbanked:\n  ${growth.slice(0, 20).join('\n  ')}`
        + `${growth.length > 20 ? `\n  … and ${growth.length - 20} more` : ''}\n`
        + 'Each is a generated fact no customer surface shows. Light it, row it, or --rebank --charter=§NNN if a'
        + ' shape crossed MIN_ROWS and flooded the cohort.');
    }
    const next = baselineOf({ measured, charter: frozen.charter, sha: headSha(root), previous: frozen });
    if (flags.rebank) {
      next.rebankHistory = [...(frozen.rebankHistory ?? []), {
        charter: flags.charter,
        sha: next.frozenAtSha,
        admitted: growth,
        previousCohort: frozen.darkUnregistered.length,
        cohort: next.darkUnregistered.length,
      }];
    }
    writeBaseline(next);
    log(`writer-reach ${flags.rebank ? 'REBANK' : 'WRITE'} — cohort ${frozen.darkUnregistered.length} →`
      + ` ${next.darkUnregistered.length}; ${comparison.stale.length} stale folded out;`
      + ` ${comparison.struck.length} registered rows now lit.`);
    log(holdLine(report));
    return { ok: true, action: flags.rebank ? 'rebank' : 'write', baseline: next, comparison, report };
  }

  if (flags.reportTo) {
    const plan = planExternalArtifactOutputs({ root, outputs: [flags.reportTo] });
    publishJsonExclusive(plan, report);
    log(`writer-reach report → ${flags.reportTo}`);
  }
  log(holdLine(report));

  const failures = [
    ...comparison.sentinel,
    ...comparison.violations.map((identity) => (
      `DARK and unregistered: ${identity} — the engine writes it on every world and no counting surface reads it.`
      + ' Ceiling 0: light it, add a row naming its door, or bank it through the governed door.'
    )),
    ...comparison.struck.map((row) => (row.dialRolled
      ? `THE DIAL HAS ROLLED: ${row.identity} is registered ${row.reason} but a shipped world now writes it`
        + ` (judged ${row.now}). Retire the generation-dial row and let the identity be judged normally.`
      : `BANK THE WIN — strike the row: ${row.identity} is registered ${row.reason} but is now ${row.now}.`
        + ' A registered row that outlives its darkness is an exemption nobody is watching.'
    )),
    ...comparison.stale.map((row) => (
      `STALE bank member: ${row.identity} is now ${row.now}. Fold it out with --write; a banked identity that`
      + ' quietly stopped being dark is a ceiling nobody spent.'
    )),
  ];
  if (failures.length) {
    return { ok: false, action: 'report', report, comparison, failures };
  }
  return { ok: true, action: 'report', report, comparison, failures: [] };
}

/**
 * Write the in-repo baseline atomically — an exclusive temp file, fsync, rename,
 * fsync of the directory. OSR's own idiom: a half-written register is a ratchet
 * that greens on a crash. `planExternalArtifactOutputs` cannot be used here: it
 * REFUSES any output inside the repository by design, which is exactly right for
 * the `--report-to` artifact and exactly wrong for the register itself.
 */
export function writeBaselineAtomically(path, value) {
  const temporary = `${path}.tmp`;
  let fd;
  try {
    fd = openSync(temporary, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL, 0o644);
    writeFileSync(fd, `${JSON.stringify(value, null, 1)}\n`, 'utf8');
    fsyncSync(fd);
    closeSync(fd);
    fd = undefined;
    renameSync(temporary, path);
    const directory = openSync(dirname(path), constants.O_RDONLY);
    try { fsyncSync(directory); } finally { closeSync(directory); }
  } finally {
    if (fd !== undefined) closeSync(fd);
    if (existsSync(temporary)) unlinkSync(temporary);
  }
  return path;
}

/** The report grammar the walker and Car 2 both read. */
export { canonicalJson };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  run(process.argv.slice(2))
    .then((result) => {
      if (!result.ok) {
        for (const failure of result.failures) console.error(`  ✗ ${failure}`);
        process.exitCode = 1;
      }
    })
    .catch((error) => { console.error(error.message); process.exitCode = 1; });
}
