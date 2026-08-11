#!/usr/bin/env node
/**
 * check-observed-shape-readers.mjs — THE READER-WITH-NO-WRITER RATCHET.
 *
 * THE CLASS. A reader asks a record for a key NO WRITER EVER PRODUCES. Because
 * the read is defensively guarded (`x?.id`, `String(x.foo || '')`,
 * `containers.find(r => Array.isArray(r.exports))`), it does not throw — it
 * degrades to a default, and the arm behind it is structurally dead forever.
 * Nothing reds. Three were found by accident in one week
 * (TCD-1 `.id` on a RulingFaction, TCD-2 `exports` on economicState/economy/
 * trade, TCD-3 `satellite.foundingTier`), plus the recorded
 * `faction-key-defect-class`. Nobody knew how many more there were. This is the
 * machinery that answers that question and keeps answering it.
 *
 * HOW IT DECIDES. Two halves, both derived, neither transcribed:
 *   scripts/lib/observed-shape-corpus.mjs  EXECUTES the real producers across a
 *     multi-seed corpus and histograms the keys each record shape ACTUALLY
 *     carries. Types are not consulted: they were wrong or silent on all three.
 *   scripts/lib/legacy-reader-shape-scan.mjs   THE GATE AUTHORITY (schema 4).
 *     The governed, byte-frozen heuristic detector: it grounds each receiver by
 *     a name prior over the observed shape set and reports reads whose key
 *     appears in NO run. Fast, total, and it terminates on every tree.
 *   scripts/lib/reader-shape-scan.mjs      THE TARGETED EXACT INSTRUMENT.
 *     Resolves each property read to the exact executed origin its receiver
 *     holds. Reachable only through `--scan-only --scan-mode=exact-origin`,
 *     because full-tree exact resolution walls (CR-OSR-FREEZE-1).
 *
 * ⚠ UNION, NEVER INTERSECTION. A key present in ANY seed is written. Only a key
 * present in NO seed is a finding. Situational keys (`modifier`, `isGoverning`,
 * `modifiers`, `legitimacyCrisis`) appear in some seeds only; treating absence
 * in one run as evidence would flood the report and get this turned off.
 *
 * SHRINK-ONLY, AND CONTENT-ADDRESSED. The estate has pre-existing violations
 * beyond the three, and fixing them is a separate wave. The frozen inventory is
 * a per-file, PER-FINDING-IDENTITY ceiling.
 *
 * ⚠⚠ WHY IDENTITIES AND NOT COUNTS. The first spelling froze one NUMBER per
 * file, and a number cannot tell a defect from its neighbour. A verifier drove
 * it live on `src/domain/rulingPower.js` (ceiling 10): remove one real finding,
 * add a different one, and the count is unchanged — so a FRESH reader-without-a-
 * writer lands GREEN behind a ratchet that reports nothing. A per-file count is
 * blind to IDENTITY SWAP by construction. The inventory therefore freezes the
 * finding IDENTITY — under schema 4, `<key> on <shape>` with its multiplicity.
 * A NEW identity in an already-listed file has ceiling 0 and REDS even when the
 * file's TOTAL does not move, exactly as a new file does.
 *
 * ⚠ THE IDENTITY DELIBERATELY EXCLUDES THE LINE NUMBER. Lines churn on every
 * unrelated edit above them; a line-keyed baseline would red on whitespace and
 * be deleted within a week.
 *
 * A file over any of its numbers fails, a file with no row has ceiling 0, and a
 * fixed site is banked by LOWERING or DELETING its identity row. Never raise one.
 *
 * USAGE
 *   node scripts/check-observed-shape-readers.mjs            gate (exit 1 on growth)
 *   node scripts/check-observed-shape-readers.mjs --report   list every finding
 *   node scripts/check-observed-shape-readers.mjs --write    re-freeze (deliberate)
 *   node scripts/check-observed-shape-readers.mjs --scan-only
 *     --scan-mode=legacy-leaf --json=<external-p>
 *                        write the governed HEURISTIC artifact (the schema-4
 *                        authority; executes the corpus fresh)
 *   node scripts/check-observed-shape-readers.mjs --scan-only --json=<external-p>
 *                        write a TARGETED exact governed artifact
 *   node scripts/check-observed-shape-readers.mjs --scan-only
 *     --scan-mode=legacy-leaf --corpus-artifact=<exact-p> --json=<external-p>
 *                        pin both legs to ONE executed corpus (optional)
 *   node scripts/check-observed-shape-readers.mjs --scan-only --json=<external-p>
 *     --progress 2> <external-progress.jsonl>     emit durable JSONL read progress
 * Artifact outputs are always outside the repository and never overwrite.
 * OSR_SUBJECT_SHA/OSR_SCANNER_SHA are accepted only for immutable Git-less
 * historical archives; authoritative current scans bind directly to clean HEAD.
 */
import { execFileSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import {
  closeSync, constants, existsSync, fsyncSync, lstatSync, openSync, readFileSync,
  readdirSync, renameSync, statSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { buildObservedCorpus } from './lib/observed-shape-corpus.mjs';
import {
  assertBaselineRow,
  BASELINE_SCHEMA,
  MIN_ROWS,
  ORIGIN_MIN_ROWS,
  RETIRED_EXACT_BASELINE_SCHEMA,
  validateSchema4Baseline,
} from './lib/observed-shape-baseline.mjs';
import {
  parseExactFlags,
  planExternalArtifactOutputs,
  publishJsonExclusive,
} from './lib/governed-artifact-io.mjs';
import {
  artifactBaselineSchemaOf,
  artifactIdentityOf,
  artifactInventoryOf,
  assertHealthyScanProvenance,
  canonicalJson,
  createScanArtifact,
  digestOf,
  fileManifestFromEntries,
  fileManifestOf,
  governedLegacyAlgorithmOf,
  scanSentinelOf,
  validateScanArtifact,
} from './lib/observed-shape-governance.mjs';
import { scanReaders as scanLegacyReaders } from './lib/legacy-reader-shape-scan.mjs';
import { scanReaders } from './lib/reader-shape-scan.mjs';
import { validateMigrationBundle } from './migrate-observed-shape-readers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE = join(ROOT, 'scripts/.observed-shape-readers-baseline.json');

/**
 * 1 = one COUNT per file (retired: blind to identity swap).
 * 2 = per leaf-name identity, ungoverned envelope (the migration predecessor).
 * 3 = per path-qualified executed origin identity (RETIRED — see below).
 * 4 = per leaf-name identity in the GOVERNED envelope. THE LIVE AUTHORITY.
 */
export { BASELINE_SCHEMA, MIN_ROWS, ORIGIN_MIN_ROWS, RETIRED_EXACT_BASELINE_SCHEMA };

/**
 * ⭐⭐ CR-OSR-FREEZE-1/2/3-R1 — THE GATE AUTHORITY IS THE HEURISTIC LEG.
 *
 * After four measured walls (the original never-terminating read, prototypes P1
 * and P2, and the `src/data/constants.js:56` growth wall at 16,385 > 16,384),
 * full-tree EXACT resolution is retired as an ambition. The exact instrument
 * survives for TARGETED per-read/per-file probes — reachable only through
 * `--scan-only --scan-mode=exact-origin`, where it is proven — and the governed
 * heuristic (`legacy-leaf`) detector becomes the standing full-tree authority
 * that the gate, `--report` and `--write` all drive.
 *
 * ⚠ CONSEQUENCE, STATED SO IT IS NEVER READ AS AN ACCIDENT: the heuristic leg is
 * handed the UNFILTERED file census and carries NO scope exclusion, so
 * `src/components/` — excluded from EXACT resolution by CR-OSR-SCOPE-1 — is now
 * under direct gate enforcement. CR-OSR-SCOPE-1's exclusion binds the EXACT
 * instrument ONLY. That is CR-OSR-FREEZE-7's intended answer to the freeze
 * docket's open question, and it RAISES coverage rather than reducing it.
 */
export const BASELINE_SCAN_MODE = 'legacy-leaf';

/**
 * A shape seen fewer times than this is too thin to judge a read against.
 * MEASURED, not guessed (at eca65c8a, the pre-fix sha where all three ground
 * truths still exist): 8 → 4,969 findings; 40 → 3,221; 120 → 3,084; 400 →
 * 2,604 but TCD-3 ESCAPES, because the SatelliteRecord shape carries 222 rows
 * and a threshold above that blinds the walker to the defect that motivated it.
 * 40 keeps a 5.5× margin under the thinnest ground truth while dropping a third
 * of the noise — the trade this number exists to make.
 */
export const SCAN_CONFIG = Object.freeze({
  corpusGraphSchema: 2,
  minRows: MIN_ROWS,
  originMinRows: ORIGIN_MIN_ROWS,
});

/** Scanner contents are separate provenance from the source tree under test. */
export function scannerToolFiles(root = ROOT) {
  return [
    'package.json',
    'package-lock.json',
    'scripts/check-observed-shape-readers.mjs',
    'scripts/lib/governed-artifact-io.mjs',
    'scripts/lib/legacy-reader-shape-scan.mjs',
    'scripts/lib/observed-shape-baseline.mjs',
    'scripts/lib/observed-shape-corpus.mjs',
    'scripts/lib/observed-shape-governance.mjs',
    'scripts/lib/reader-shape-scan.mjs',
    'scripts/migrate-observed-shape-readers.mjs',
    'tests/fixtures/spatialPackFixtures.js',
  ].map((file) => join(root, file));
}

/** Every `.js`/`.jsx` under `src/` — the whole app, not just `src/domain`: the
 *  recorded SP-D repair proved a law scoped to one subtree leaves the UI layer,
 *  where a defect actually reaches a player, entirely unscanned. */
export const isObservedShapeScanPath = (path) => (
  /\.(js|jsx)$/.test(path) && !path.endsWith('.generated.js')
);

export const isObservedShapeSubjectPath = (path) => /\.(js|jsx|json)$/.test(path);

/**
 * ⭐⭐ CR-OSR-SCOPE-1 (Fable chair, 2026-08-09, vetoable) — THE DECLARED UI-LAYER
 * EXCLUSION FROM **EXACT** RESOLUTION. Verbatim from the ruling:
 *
 *   "The exact scanner's mission is guarding domain generation shapes; UI
 *    components (src/components/**) are downstream projections of those shapes,
 *    still covered by the heuristic leg. After three measured walls (the
 *    original never-terminating read, P1/P2 both rejected, and now a
 *    genuine-growth budget failure at a UI read), the marginal value of exact
 *    resolution inside the UI layer does not justify a fourth analyzer round.
 *    The exclusion must be DECLARED MACHINERY, never silent."
 *
 * The third wall is `src/components/SettlementsPanel.jsx:359`
 * (`updatedSaves.filter(...).map(s => s.id)` through the 959-line
 * `factionRename.js`): a BOUNDED verdict in ~145 s that fails the 16,384
 * abstract-state growth budget. `budgetFailure` THROWS, and nothing catches it
 * in the scan loop, so that one UI read aborts the WHOLE full-tree exact scan.
 *
 * WHY THIS IS MACHINERY AND NOT A COMMENT:
 *   · SCOPE PREFIX, never a per-file list — a per-file list rots the moment a
 *     component is renamed and then silently excludes nothing (or something
 *     else). One prefix cannot rot.
 *   · EXACT IDENTITY + SHRINK-ONLY — the frozen ceiling for this list is pinned
 *     in tests/lint/readerShapeResolver.test.js as a SUBSET check, so ADDING any
 *     entry reds. Shrinking (returning a scope to exact resolution) is legal.
 *   · UI-ONLY, ASSERTED AT DECLARATION — `assertExactScanExcludedScope` runs at
 *     module load, so a `src/domain/**` entry cannot be quietly added: it throws
 *     before any scan, gate, or write can begin. The predicate is TOTAL
 *     (every entry must start with an allowed UI root), never an enumeration of
 *     forbidden roots, which would fail open on the root nobody listed.
 *   · REPOSITORY-RELATIVE — never matched against an absolute path, because an
 *     absolute prefix test matches the CHECKOUT'S OWN directory name.
 *   · READ SITES ONLY — excluded files still enter the program index, so domain
 *     reads whose provenance passes through a component resolve unchanged.
 *   · RECORDED IN EVERY SCAN — `stats.excludedReadScopes` / `excludedReadFiles`
 *     travel into every artifact, and `--progress` emits them on `scan-start`.
 *
 * ⚠ THE HEURISTIC LEG IS THE OTHER HALF OF THIS RULING. `scanLegacyReaders` is
 * handed the UNFILTERED `before.files` below and MUST STAY UNFILTERED; it is
 * the coverage this exclusion leans on, and under schema 4 it is no longer a
 * fallback but the gate authority itself (see `BASELINE_SCAN_MODE`).
 *
 * ⚠⚠ THE FIGURE THAT USED TO SIT HERE WAS THE WRONG ARTIFACT'S. "88 files / 250
 * identities" is the SCHEMA-2 predecessor's `src/components/` slice, produced by
 * the EXACT detector at `ec525a59` and leaf-spelled. The schema-4 genesis
 * inventory is produced by the HEURISTIC detector and measures 53 files / 162
 * identities / 260 counts. Nothing here restates either number: `cohortOf()`
 * DERIVES it from whichever inventory it is handed, so the figure cannot rot.
 */
export const EXACT_SCAN_EXCLUDED_SCOPE = Object.freeze(['src/components/']);

/** The UI roots an exclusion may name. TOTAL positive predicate: an entry that
 *  is not under one of these is refused, so no unlisted root fails open. */
const EXACT_SCAN_EXCLUDABLE_UI_ROOTS = Object.freeze(['src/components/']);

/** Fail-closed at declaration: a DOMAIN scope cannot be quietly added. */
export function assertExactScanExcludedScope(scopes = EXACT_SCAN_EXCLUDED_SCOPE) {
  if (!Array.isArray(scopes)) {
    throw new Error('observed-shape EXACT_SCAN_EXCLUDED_SCOPE must be an array of scope prefixes');
  }
  for (const scope of scopes) {
    if (typeof scope !== 'string' || !scope.endsWith('/') || scope.startsWith('/')) {
      throw new Error(`observed-shape excluded scope must be a repository-relative directory prefix ending in "/"; received ${JSON.stringify(scope)}`);
    }
    if (!EXACT_SCAN_EXCLUDABLE_UI_ROOTS.some((root) => scope.startsWith(root))) {
      throw new Error(`observed-shape excluded scope ${JSON.stringify(scope)} is outside the UI layer.`
        + ` CR-OSR-SCOPE-1 excludes ONLY downstream UI projections (${EXACT_SCAN_EXCLUDABLE_UI_ROOTS.join(', ')});`
        + ' a domain scope would remove exact coverage from the shapes this instrument exists to guard.');
    }
  }
  return scopes;
}
assertExactScanExcludedScope();

/** True when a REPOSITORY-RELATIVE forward-slash path is excluded from exact
 *  resolution. Never pass an absolute path: see the note above. */
export const isExactScanExcludedReadPath = (relativePath) => (
  EXACT_SCAN_EXCLUDED_SCOPE.some((scope) => String(relativePath).startsWith(scope))
);

export function sourceFiles(root = ROOT) {
  const out = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (isObservedShapeScanPath(p)) out.push(p);
    }
  }(join(root, 'src')));
  return out.sort();
}

/** Complete JavaScript subject inputs. The scan omits generated JS and cannot
 * parse JSON, while executed producers may consume both; all are still bound. */
export function subjectFiles(root = ROOT) {
  const out = [];
  (function walk(d) {
    for (const entry of readdirSync(d)) {
      const path = join(d, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (isObservedShapeSubjectPath(path)) out.push(path);
    }
  }(join(root, 'src')));
  return out.sort();
}

export function executionInputFiles(root = ROOT) {
  return [...new Set([...subjectFiles(root), ...scannerToolFiles(root)])].sort();
}

/** The stable identity of a finding under the BASELINE AUTHORITY: WHICH key, on
 * WHICH observed shape. Never the line — see the header note on why line numbers
 * are excluded. Targeted exact probes address findings through
 * `artifactIdentityOf('exact-origin', …)` instead; that spelling is the RETIRED
 * schema-3 definition and cannot enter a schema-4 inventory. */
export function identityOf(finding) {
  return artifactIdentityOf(BASELINE_SCAN_MODE, finding);
}

/** Per-file, per-identity counts, forward-slash normalized so the ratchet reads
 *  the same on every platform. Both levels are sorted so a re-freeze produces a
 *  reviewable diff rather than a reshuffle. */
export function inventoryOf(findings) {
  return artifactInventoryOf(BASELINE_SCAN_MODE, findings);
}

/**
 * Normalize one baseline row to `{identity: multiplicity}`. A BARE NUMBER is the
 * retired count-only form and is REFUSED rather than accepted: silently reading
 * `10` as "any ten findings you like" is precisely the identity-swap hole this
 * ratchet was rebuilt to close, so a hand-edit back to it must fail loudly.
 *
 * ⭐ CR-OSR-FREEZE-8: this used to carry its OWN copy of the row law, untested,
 * beside the copy inside the envelope validator. It now delegates to the single
 * home in `observed-shape-baseline.mjs` so the two cannot drift.
 */
export function rowOf(row, file = '') {
  return assertBaselineRow(row, file);
}

/**
 * ⭐⭐ CR-OSR-FREEZE-7 — THE UNREVIEWED-UI COHORT, BANKED AS MACHINERY.
 *
 * Making the heuristic leg the gate authority pulls `src/components/` into
 * direct enforcement. Those rows enter the genesis REVIEWED-AS-A-COHORT rather
 * than individually triaged, and the ruling is explicit that they must stay
 * QUERYABLE and never be silently absorbed. So the cohort is a derivation over
 * whatever inventory it is handed — never a transcribed number that can rot
 * away from the artifact it describes — and it is printed on every human-facing
 * run beside the scope notice.
 */
export const UNREVIEWED_UI_COHORT = Object.freeze({
  tag: 'UNREVIEWED-UI',
  ruling: 'CR-OSR-FREEZE-7',
  scopes: EXACT_SCAN_EXCLUDED_SCOPE,
});

/** Files / identities / counts of one inventory restricted to `scopes`. */
export function cohortOf(inventory, scopes = UNREVIEWED_UI_COHORT.scopes) {
  const files = Object.keys(inventory || {})
    .filter((file) => scopes.some((scope) => file.startsWith(scope)))
    .sort();
  let identities = 0;
  let counts = 0;
  for (const file of files) {
    for (const count of Object.values(inventory[file])) {
      identities += 1;
      counts += count;
    }
  }
  return { files: files.length, identities, counts, paths: files };
}

/** Say the cohort out loud wherever the scope notice is said. */
export function cohortNotice(inventory, cohort = UNREVIEWED_UI_COHORT) {
  const { files, identities, counts } = cohortOf(inventory, cohort.scopes);
  return `${cohort.ruling} ${cohort.tag} cohort (${cohort.scopes.join(', ')}):`
    + ` ${files} file(s) / ${identities} identit(ies) / ${counts} read(s), banked in the`
    + ' frozen inventory and awaiting per-row triage. These are ENFORCED, not excluded:'
    + ' CR-OSR-SCOPE-1 removes them from EXACT resolution only.';
}

/** The failure message IS the documentation — see "ratchet kindness". */
export function ratchetMessage(file, rows) {
  const detail = rows.map(({ identity, count, ceiling }) => (ceiling === 0
    ? `    NEW      ${identity} — ${count} read(s); this file has no frozen row for it (ceiling 0)`
    : `    OVER     ${identity} — ${count} read(s); frozen ceiling is ${ceiling}`)).join('\n');
  return `${file}: read(s) of a key no writer produces, outside the frozen inventory:\n${detail}\n`
    + '  A guarded read of a key the real generator never writes cannot throw — it\n'
    + '  degrades to a default, and the arm behind it is dead on every generated world.\n'
    + '  A NEW row means a fresh one landed even if this file\'s TOTAL did not move: the\n'
    + '  inventory is addressed by finding IDENTITY, not by count, so a swap cannot hide.\n'
    + '  TO COMPLY: read a key the producer actually writes, or delete the dead arm.\n'
    + '    The authority is a real run, not a typedef: `node scripts/check-observed-shape-readers.mjs --report`\n'
    + '    prints the shape and the keys it was observed carrying.\n'
    + '  TO SHRINK: fixed a site? LOWER this file\'s number for that identity in\n'
    + '    scripts/.observed-shape-readers-baseline.json (delete the row when it reaches 0).\n'
    + '    Never raise a number, never add a file, never add an identity.';
}

/** Say the scope reduction out loud on every human-facing run. A silent
 *  exclusion is the failure mode CR-OSR-SCOPE-1 exists to prevent. */
export function excludedScopeNotice(scopes, stats) {
  if (!scopes?.length) return 'scan scope: the WHOLE scanned tree (no declared exclusion).';
  return `⚠ DECLARED SCOPE EXCLUSION (CR-OSR-SCOPE-1): read sites under ${scopes.join(', ')}`
    + ` were NOT exactly resolved — ${stats?.excludedReadFiles ?? 0} of ${stats?.files ?? 0} indexed`
    + ' file(s). They remain in the program index and are covered by the heuristic'
    + ' (legacy-leaf) detector, which is handed the unfiltered file list.';
}

/**
 * The measurement that makes every green here mean something.
 *
 * ⚠ THE MODE IS EXPLICIT AND DEFAULTS TO THE EXACT INSTRUMENT, not to the gate
 * authority. The two sentinels are different RECORDS — `exact-origin` carries
 * thirteen fields including the origin and traversal-loss counters,
 * `legacy-leaf` carries three — so a caller comparing one against a baseline
 * frozen from the other silently compares nothing. Callers that mean the
 * baseline authority pass `BASELINE_SCAN_MODE` and say so.
 */
export function sentinelOf(corpus, stats, scanMode = 'exact-origin') {
  return scanSentinelOf(scanMode, corpus, stats, SCAN_CONFIG);
}

/**
 * ANTI-VACUITY. This walker's real failure mode is not a false finding — it is a
 * corpus that quietly stops observing. A renamed simulation flag, a producer
 * that throws and is swallowed, a shape that stops being reached: every one of
 * them EMPTIES the observed key sets, and an empty corpus makes the ratchet
 * green while proving nothing. So the frozen figures are floored at 90%, the
 * `fullTypecheckRatchet` scope-sentinel idiom one layer up.
 */
export function sentinelFailures(sentinel, frozen) {
  if (!frozen) return [];
  const out = [];
  for (const [k, floorPct] of [
    ['usableShapes', 0.9], ['totalKeys', 0.9], ['usableOrigins', 0.9],
    ['originKeys', 0.9], ['transitions', 0.9], ['resolvedReads', 0.9],
    ['resolvedOrigins', 0.9],
  ]) {
    const floor = Math.floor((frozen[k] || 0) * floorPct);
    if (frozen[k] && sentinel[k] < floor) {
      out.push(`${k}: ${sentinel[k]} < ${floor} (90% of the frozen ${frozen[k]}) — the corpus or the resolver`
        + ' collapsed, so a pass here would be VACUOUS. Fix the producer/scan before touching the inventory.');
    }
  }
  if ((sentinel.depthTruncations || 0) !== 0) {
    out.push(`depthTruncations: ${sentinel.depthTruncations} — the corpus walker or resolver silently abandoned a provenance path; remove the depth cause rather than baseline it.`);
  }
  if ((sentinel.cycleCuts || 0) !== 0) {
    out.push(`cycleCuts: ${sentinel.cycleCuts} — a corpus identity cycle or resolver recursion was cut; repair the producer/resolver rather than baseline the provenance loss.`);
  }
  return out;
}

/** Compare a fresh scan against the frozen inventory. */
export function compare(findings, baseline) {
  const inv = inventoryOf(findings);
  const violations = [];
  for (const [file, ids] of Object.entries(inv)) {
    const frozen = file in baseline.inventory ? rowOf(baseline.inventory[file], file) : {};
    const over = [];
    for (const [identity, count] of Object.entries(ids)) {
      const ceiling = frozen[identity] ?? 0;
      if (count > ceiling) over.push({ identity, count, ceiling });
    }
    if (over.length) violations.push(ratchetMessage(file, over));
  }
  // Schema 3 is an exact inventory, not a ceiling with dormant headroom. A row
  // whose file vanished OR whose multiplicity fell is stale and must be removed
  // in the same reviewed maintenance change; otherwise a later identity swap can
  // spend the abandoned count while appearing to remain under the old ceiling.
  const stale = [];
  for (const [file, row] of Object.entries(baseline.inventory)) {
    if (!existsSync(join(ROOT, file))) {
      stale.push(`${file}: deleted or moved — remove its row from the baseline.`);
      continue;
    }
    const now = inv[file] || {};
    for (const [identity, ceiling] of Object.entries(rowOf(row, file))) {
      const count = now[identity] || 0;
      if (count === 0 && ceiling !== 0) {
        stale.push(`${file}: "${identity}" is GONE against a frozen count of ${ceiling} — delete the row now; schema 4 permits no dormant headroom.`);
      } else if (count < ceiling) {
        stale.push(`${file}: "${identity}" is ${count} against a frozen count of ${ceiling} — lower the row now; schema 4 permits no dormant headroom.`);
      }
    }
  }
  return { inventory: inv, violations, stale };
}

export function corpusPayloadOf(parsed) {
  if (parsed?.kind !== 'observed-shape-reader-scan') return parsed;
  validateScanArtifact(parsed);
  return parsed.corpus;
}

async function corpusFor() {
  if (process.env.OSR_CORPUS) {
    throw new Error('OSR_CORPUS is retired for authoritative scans; execute producers fresh or use the reviewed bundle corpus during migration freeze');
  }
  return buildObservedCorpus();
}

function headShaFor() {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
}

function repositoryHeadFor() {
  try {
    return headShaFor();
  } catch {
    return null;
  }
}

function gitShaFor(envName) {
  const supplied = envName ? process.env[envName]?.trim() : null;
  if (supplied) return supplied;
  return headShaFor();
}

function dirtyInputsFor() {
  if (!repositoryHeadFor()) return null;
  // A bounded pathspec avoids macOS ARG_MAX on the ~2k scanned source files.
  // Requiring all of src/ clean is slightly stricter than the scan exclusion for
  // generated files, and intentionally easier to audit than parsing full status.
  const paths = [
    'src',
    'scripts/.observed-shape-readers-baseline.json',
    ...scannerToolFiles().map((file) => relative(ROOT, file).split('\\').join('/')),
  ];
  return execFileSync(
    'git',
    ['status', '--short', '--untracked-files=all', '--', ...paths],
    { cwd: ROOT, encoding: 'utf8' },
  ).trim();
}

function gitBlobBytesByOid(objectIds) {
  const uniqueIds = [...new Set(objectIds)];
  const output = execFileSync('git', ['cat-file', '--batch'], {
    cwd: ROOT,
    input: `${uniqueIds.join('\n')}\n`,
    maxBuffer: 256 * 1024 * 1024,
  });
  const blobs = new Map();
  let offset = 0;
  for (const expectedOid of uniqueIds) {
    const headerEnd = output.indexOf(0x0a, offset);
    if (headerEnd < 0) throw new Error('git cat-file returned a truncated observed-shape blob header');
    const header = output.subarray(offset, headerEnd).toString('utf8');
    const match = /^([0-9a-f]{40}) blob (\d+)$/.exec(header);
    if (!match || match[1] !== expectedOid) {
      throw new Error(`git cat-file returned unexpected observed-shape blob provenance: ${header}`);
    }
    const size = Number(match[2]);
    const contentStart = headerEnd + 1;
    const contentEnd = contentStart + size;
    if (!Number.isSafeInteger(size) || size < 0 || contentEnd >= output.length
      || output[contentEnd] !== 0x0a) {
      throw new Error(`git cat-file returned a truncated observed-shape blob: ${expectedOid}`);
    }
    blobs.set(expectedOid, output.subarray(contentStart, contentEnd));
    offset = contentEnd + 1;
  }
  if (offset !== output.length) {
    throw new Error('git cat-file returned trailing observed-shape blob data');
  }
  return blobs;
}

/** Reconstruct the exact manifests from a commit, including ignored-file and
 * executable-bit authority that `git status` alone cannot prove. */
function committedInputManifestsFor(subjectSha) {
  const detectorPaths = scannerToolFiles()
    .map((file) => relative(ROOT, file).split('\\').join('/'));
  const listing = execFileSync('git', [
    'ls-tree', '-r', '-z', '-l', '--full-tree', subjectSha, '--', 'src', ...detectorPaths,
  ], {
    cwd: ROOT,
    maxBuffer: 32 * 1024 * 1024,
  });
  const rows = listing.toString('utf8').split('\0').filter(Boolean).map((row) => {
    const match = /^([0-7]{6}) blob ([0-9a-f]{40})\s+(\d+)\t([^\0]+)$/s.exec(row);
    if (!match || !['100644', '100755'].includes(match[1])) {
      throw new Error(`observed-shape committed input is not a regular file: ${JSON.stringify(row)}`);
    }
    return {
      mode: match[1], oid: match[2], declaredSize: Number(match[3]), path: match[4],
    };
  });
  const byPath = new Map(rows.map((row) => [row.path, row]));
  if (byPath.size !== rows.length) {
    throw new Error('observed-shape committed input tree repeats a path');
  }
  const missingDetector = detectorPaths.filter((path) => !byPath.has(path));
  if (missingDetector.length) {
    throw new Error(`observed-shape subject commit omits governed detector input(s): ${missingDetector.join(', ')}`);
  }
  const blobs = gitBlobBytesByOid(rows.map((row) => row.oid));
  const entries = rows.map(({ mode, oid, declaredSize, path }) => {
    const content = blobs.get(oid);
    if (!content || content.length !== declaredSize) {
      throw new Error(`observed-shape committed blob size mismatch: ${path}`);
    }
    return {
      path,
      type: 'file',
      mode,
      size: content.length,
      sha256: createHash('sha256').update(content).digest('hex'),
    };
  });
  const sourceEntries = entries.filter((entry) => (
    entry.path.startsWith('src/') && isObservedShapeSubjectPath(entry.path)
  ));
  const detectorSet = new Set(detectorPaths);
  const detectorEntries = entries.filter((entry) => detectorSet.has(entry.path));
  const scanEntries = sourceEntries.filter((entry) => isObservedShapeScanPath(entry.path));
  if (!sourceEntries.length || !scanEntries.length
    || detectorEntries.length !== detectorPaths.length) {
    throw new Error('observed-shape subject commit has an incomplete source or detector tree');
  }
  return {
    scanTree: fileManifestFromEntries(scanEntries),
    sourceTree: fileManifestFromEntries(sourceEntries),
    detectorTree: fileManifestFromEntries(detectorEntries),
    executionTree: fileManifestFromEntries([...sourceEntries, ...detectorEntries]),
  };
}

function validateBaselineHistory(baseline) {
  const subjectSha = baseline.migrationReview.subjectSha;
  try {
    execFileSync('git', ['cat-file', '-e', `${subjectSha}^{commit}`], { cwd: ROOT });
    execFileSync('git', ['merge-base', '--is-ancestor', subjectSha, 'HEAD'], { cwd: ROOT });
  } catch (error) {
    throw new Error('observed-shape migration genesis is not a committed ancestor of current HEAD', { cause: error });
  }
  const baselinePath = relative(ROOT, BASELINE).split('\\').join('/');
  let predecessorText;
  try {
    predecessorText = execFileSync('git', ['show', `${subjectSha}:${baselinePath}`], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch (error) {
    throw new Error('observed-shape migration genesis commit lacks its predecessor baseline', { cause: error });
  }
  let predecessor;
  try {
    predecessor = JSON.parse(predecessorText);
  } catch (error) {
    throw new Error('observed-shape committed predecessor baseline is not valid JSON', { cause: error });
  }
  if (sha256Text(predecessorText) !== baseline.migrationReview.predecessorBaselineTextSha256
    || digestOf(predecessor) !== baseline.migrationReview.predecessorBaselineDigest
    || digestOf(predecessor.inventory) !== baseline.migrationReview.predecessorInventoryDigest) {
    throw new Error('observed-shape migration receipt does not match the predecessor baseline committed at its genesis SHA');
  }
  const genesis = committedInputManifestsFor(subjectSha);
  for (const [manifestName, receiptName] of [
    ['scanTree', 'scanTreeDigest'],
    ['sourceTree', 'sourceTreeDigest'],
    ['detectorTree', 'detectorTreeDigest'],
    ['executionTree', 'executionTreeDigest'],
  ]) {
    if (genesis[manifestName].digest !== baseline.migrationReview[receiptName]) {
      throw new Error(`observed-shape migration receipt ${receiptName} does not reconstruct from its genesis commit`);
    }
  }
  const receiptCommits = execFileSync('git', [
    'rev-list', '--reverse', '--ancestry-path', `${subjectSha}..HEAD`, '--', baselinePath,
  ], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  let committedGenesisReceipt = null;
  for (const commit of receiptCommits) {
    let candidate;
    try {
      candidate = JSON.parse(execFileSync('git', ['show', `${commit}:${baselinePath}`], {
        cwd: ROOT,
        encoding: 'utf8',
        maxBuffer: 16 * 1024 * 1024,
      }));
    } catch {
      continue;
    }
    if (candidate?.schema !== BASELINE_SCHEMA) continue;
    if (candidate.migrationReview?.subjectSha !== subjectSha) {
      throw new Error(`observed-shape first schema-${BASELINE_SCHEMA} baseline has a different migration genesis`);
    }
    committedGenesisReceipt = candidate.migrationReview;
    break;
  }
  if (!committedGenesisReceipt) {
    throw new Error(`observed-shape migration receipt has no committed schema-${BASELINE_SCHEMA} genesis descendant`);
  }
  if (canonicalJson(committedGenesisReceipt) !== canonicalJson(baseline.migrationReview)) {
    throw new Error(`observed-shape migration receipt changed after its committed schema-${BASELINE_SCHEMA} genesis`);
  }
  return baseline;
}

function inputSnapshot(runtime) {
  const files = runtime.sourceFiles();
  const subject = runtime.subjectFiles();
  const detector = runtime.scannerToolFiles();
  const execution = runtime.executionInputFiles();
  return {
    files,
    subject,
    detector,
    execution,
    headSha: runtime.repositoryHeadFor(),
    dirty: runtime.dirtyInputsFor(),
    baselineTextSha256: runtime.baselineExists()
      ? sha256Text(runtime.readBaselineText())
      : null,
    scanTree: runtime.fileManifestOf(ROOT, files),
    sourceTree: runtime.fileManifestOf(ROOT, subject),
    detectorTree: runtime.fileManifestOf(ROOT, detector),
    executionTree: runtime.fileManifestOf(ROOT, execution),
  };
}

function assertStableSnapshot(before, after, { requireClean = false } = {}) {
  const stableView = (snapshot) => ({
    files: snapshot.files.map((file) => resolve(file)),
    subject: snapshot.subject.map((file) => resolve(file)),
    detector: snapshot.detector.map((file) => resolve(file)),
    execution: snapshot.execution.map((file) => resolve(file)),
    headSha: snapshot.headSha,
    baselineTextSha256: snapshot.baselineTextSha256,
    scanTree: snapshot.scanTree,
    sourceTree: snapshot.sourceTree,
    detectorTree: snapshot.detectorTree,
    executionTree: snapshot.executionTree,
  });
  if (canonicalJson(stableView(before)) !== canonicalJson(stableView(after))) {
    throw new Error('observed-shape inputs or HEAD changed while the scan was running; discard the evidence and retry');
  }
  if (before.dirty !== after.dirty) {
    throw new Error('observed-shape input dirtiness changed while the scan was running; discard the evidence and retry');
  }
  if (requireClean && (before.dirty || after.dirty)) {
    throw new Error(`observed-shape evidence requires clean committed inputs:\n${after.dirty || before.dirty}`);
  }
  return after;
}

function assertAuthoritativeSnapshot(snapshot, runtime) {
  const subjectSha = runtime.subjectShaFor();
  const scannerSha = runtime.scannerShaFor();
  if (snapshot.headSha) {
    if (subjectSha !== snapshot.headSha || scannerSha !== snapshot.headSha) {
      throw new Error('observed-shape current evidence must bind subject and scanner to clean current HEAD');
    }
    const committed = runtime.committedInputManifestsFor(snapshot.headSha);
    for (const name of ['scanTree', 'sourceTree', 'detectorTree', 'executionTree']) {
      if (canonicalJson(snapshot[name]) !== canonicalJson(committed[name])) {
        throw new Error(`observed-shape current ${name} is not the exact committed HEAD input tree`);
      }
    }
  } else if (!process.env.OSR_SUBJECT_SHA || !process.env.OSR_SCANNER_SHA) {
    throw new Error('Git-less observed-shape evidence requires explicit OSR_SUBJECT_SHA and OSR_SCANNER_SHA');
  }
  if (snapshot.dirty) {
    throw new Error(`observed-shape evidence requires clean committed inputs:\n${snapshot.dirty}`);
  }
  return { subjectSha, scannerSha };
}

function artifactArguments({
  scanMode, snapshot, subjectSha, scannerSha, corpus, findings, stats, sentinel,
}) {
  return {
    scanMode,
    baselineSchema: artifactBaselineSchemaOf(scanMode),
    subjectSha,
    scannerSha,
    scanTree: snapshot.scanTree,
    sourceTree: snapshot.sourceTree,
    detectorTree: snapshot.detectorTree,
    executionTree: snapshot.executionTree,
    scanConfig: SCAN_CONFIG,
    ...(scanMode === 'legacy-leaf'
      ? { legacyAlgorithm: governedLegacyAlgorithmOf(snapshot.detectorTree) }
      : {}),
    corpus,
    findings,
    stats,
    sentinel,
    inventory: artifactInventoryOf(scanMode, findings),
  };
}

function assertArtifactMatchesSnapshot(artifact, snapshot, { subjectSha, scannerSha } = {}) {
  validateScanArtifact(artifact);
  const expected = {
    scanTree: snapshot.scanTree,
    sourceTree: snapshot.sourceTree,
    detectorTree: snapshot.detectorTree,
    executionTree: snapshot.executionTree,
  };
  for (const [name, manifest] of Object.entries(expected)) {
    if (canonicalJson(artifact[name]) !== canonicalJson(manifest)) {
      throw new Error(`observed-shape artifact ${name} does not match the live immutable inputs`);
    }
  }
  if ((subjectSha && artifact.provenance.subjectSha !== subjectSha)
    || (scannerSha && artifact.provenance.scannerSha !== scannerSha)) {
    throw new Error('observed-shape artifact SHA provenance does not match the live immutable inputs');
  }
  return artifact;
}

function assertFindingSourceEvidence(findings, snapshot) {
  const fileByPath = new Map(snapshot.files.map((file) => [
    relative(ROOT, file).split('\\').join('/'), file,
  ]));
  const contents = new Map();
  for (const finding of findings) {
    const path = fileByPath.get(finding.file);
    if (!path) throw new Error(`observed-shape finding is outside the live scan tree: ${finding.file}`);
    let source = contents.get(path);
    if (source === undefined) {
      source = readFileSync(path, 'utf8');
      contents.set(path, source);
    }
    if (!Number.isSafeInteger(finding.pos) || finding.pos < 0 || finding.pos >= source.length) {
      throw new Error(`observed-shape finding position is outside its bound source: ${finding.file}:${finding.pos}`);
    }
    const line = source.slice(0, finding.pos).split('\n').length;
    if (finding.line !== line) {
      throw new Error(`observed-shape finding line does not match its exact source position: ${finding.file}:${finding.pos}`);
    }
    const normalizedWindow = source
      .slice(Math.max(0, finding.pos - 240), Math.min(source.length, finding.pos + 480))
      .replace(/\s+/g, ' ')
      .trim();
    if (!normalizedWindow.includes(finding.text)) {
      throw new Error(`observed-shape finding text is not present around its exact source position: ${finding.file}:${finding.pos}`);
    }
    const kind = finding.site?.match(/\|kind=(dot|element)\|/)?.[1];
    if (kind === 'dot' && source.slice(finding.pos, finding.pos + finding.key.length) !== finding.key) {
      throw new Error(`observed-shape dot finding position does not name its key: ${finding.file}:${finding.pos}`);
    }
  }
  return findings;
}

function unscannedInputDigestOf(snapshot) {
  const scanned = new Set(snapshot.scanTree.entries.map((entry) => entry.path));
  return digestOf(snapshot.sourceTree.entries.filter((entry) => !scanned.has(entry.path)));
}

function baselineOf({ snapshot, headSha, corpus, stats, sentinel, findings, migrationReview }) {
  const inventory = inventoryOf(findings);
  const manifests = {
    scanTree: snapshot.scanTree,
    sourceTree: snapshot.sourceTree,
    detectorTree: snapshot.detectorTree,
    executionTree: snapshot.executionTree,
  };
  const baseline = {
    _doc: [
      'READER-WITH-NO-WRITER INVENTORY — per-file HEURISTIC-LEAF identities, SHRINK-ONLY.',
      'A row is "<key> on <shape>": multiplicity, produced by the governed legacy-leaf detector.',
      'Content-addressed per identity: dormant headroom and identity swaps are refused, so a NEW',
      'identity in an already-listed file reds exactly as a new file does, even at constant count.',
      'The line number is excluded so unrelated line churn does not rewrite the governed identity.',
      'Fixes may only lower or delete rows. Detector changes require a new governed instrument migration.',
      'The RETIRED schema-3 exact "<key> on <shape> @ <origin> # <site>" spelling cannot enter this file.',
    ],
    schema: BASELINE_SCHEMA,
    frozen: new Date().toISOString().slice(0, 10),
    frozenAtSha: headSha,
    minRows: MIN_ROWS,
    originMinRows: ORIGIN_MIN_ROWS,
    corpusMeta: corpus.meta,
    scanStats: stats,
    sentinel,
    total: findings.length,
    identities: Object.values(inventory).reduce((sum, row) => sum + Object.keys(row).length, 0),
    inventory,
    migrationReview,
    manifests,
    scannerProvenance: {
      scanTreeDigest: manifests.scanTree.digest,
      sourceTreeDigest: manifests.sourceTree.digest,
      detectorDigest: manifests.detectorTree.digest,
      executionTreeDigest: manifests.executionTree.digest,
      unscannedInputDigest: unscannedInputDigestOf(manifests),
    },
    digests: {
      corpusMeta: digestOf(corpus.meta),
      scanStats: digestOf(stats),
      sentinel: digestOf(sentinel),
      inventory: digestOf(inventory),
      manifests: digestOf(manifests),
      migrationReview: digestOf(migrationReview),
    },
  };
  validateSchema4Baseline(baseline);
  return baseline;
}

const sha256Text = (text) => createHash('sha256').update(text).digest('hex');

function writeBaselineAtomically(value, expectedText) {
  const targetStat = lstatSync(BASELINE);
  if (!targetStat.isFile() || targetStat.isSymbolicLink()) {
    throw new Error('observed-shape baseline target must remain a regular non-symlink file');
  }
  const lock = `${BASELINE}.write-lock`;
  const temporary = `${BASELINE}.tmp-${process.pid}-${randomBytes(10).toString('hex')}`;
  let lockFd;
  let temporaryFd;
  try {
    lockFd = openSync(lock, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL, 0o600);
    if (readFileSync(BASELINE, 'utf8') !== expectedText) {
      throw new Error('observed-shape predecessor baseline changed after validation; refusing replacement');
    }
    temporaryFd = openSync(
      temporary,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL,
      0o644,
    );
    writeFileSync(temporaryFd, `${canonicalJson(value, 1)}\n`, 'utf8');
    fsyncSync(temporaryFd);
    closeSync(temporaryFd);
    temporaryFd = undefined;
    renameSync(temporary, BASELINE);
    const directoryFd = openSync(dirname(BASELINE), constants.O_RDONLY);
    try {
      fsyncSync(directoryFd);
    } finally {
      closeSync(directoryFd);
    }
  } finally {
    if (temporaryFd !== undefined) closeSync(temporaryFd);
    if (lockFd !== undefined) closeSync(lockFd);
    if (existsSync(temporary)) unlinkSync(temporary);
    if (existsSync(lock)) unlinkSync(lock);
  }
}

export function frozenDetectorDigestOf(baseline) {
  const topLevel = baseline?.scannerProvenance?.detectorDigest || null;
  const migration = baseline?.migrationReview?.currentDetectorDigest || null;
  if (topLevel && migration && topLevel !== migration) {
    throw new Error('observed-shape baseline scanner provenance disagrees with its migration receipt');
  }
  return topLevel || migration;
}

/** Parse the bounded scan-only mode before executing its expensive inputs. */
export function commandOf(argv = []) {
  const parsed = parseExactFlags(argv, {
    '--scan-only': { kind: 'flag', name: 'scanOnly' },
    '--scan-mode': { kind: 'value', name: 'scanMode' },
    '--corpus-artifact': { kind: 'value', name: 'corpusArtifactPath' },
    '--json': { kind: 'value', name: 'jsonPath' },
    '--report': { kind: 'flag', name: 'report' },
    '--progress': { kind: 'flag', name: 'progress' },
    '--write': { kind: 'flag', name: 'write' },
    [`--migrate-schema=${BASELINE_SCHEMA}`]: { kind: 'flag', name: 'migrationFlag' },
    '--migration-review': { kind: 'value', name: 'migrationReviewPath' },
  });
  // ⚠⚠ THE GATE'S MODE IS NOT A DEFAULT — IT IS THE BASELINE AUTHORITY.
  // `--scan-mode` remains a `--scan-only` affordance for targeted EXACT probes;
  // every baseline-bearing mode (gate, --report, --write, --migrate-schema)
  // drives `BASELINE_SCAN_MODE`, because the frozen inventory is spelled in that
  // mode's identities and a gate running the other detector would compare two
  // different alphabets and report the whole tree as new.
  const scanMode = parsed.scanOnly ? (parsed.scanMode || 'exact-origin') : BASELINE_SCAN_MODE;
  if (!['exact-origin', 'legacy-leaf'].includes(scanMode)) {
    throw new Error(`observed-shape --scan-mode is unsupported: ${JSON.stringify(scanMode)}`);
  }
  if (parsed.scanOnly && !parsed.jsonPath) {
    throw new Error('observed-shape --scan-only requires a nonempty --json=<artifact-path>');
  }
  if (!parsed.scanOnly && (parsed.jsonPath || parsed.scanMode || parsed.corpusArtifactPath)) {
    throw new Error('observed-shape --json, --scan-mode, and --corpus-artifact are only valid with --scan-only');
  }
  if (parsed.scanOnly && (parsed.write || parsed.report
    || parsed.migrationFlag || parsed.migrationReviewPath)) {
    throw new Error('observed-shape --scan-only cannot be combined with baseline/report modes');
  }
  // ⚠⚠ THE LEGACY LEG CAN EXECUTE ITS OWN CORPUS. It used to REQUIRE
  // `--corpus-artifact=<validated exact-origin artifact>`, which made the
  // heuristic leg unrunnable the moment the exact leg stopped being able to
  // finish a full-tree scan: the only artifact it would accept was one that can
  // no longer be produced. `--corpus-artifact` stays supported — pinning both
  // legs to ONE executed corpus is exactly what the migration reconciliation
  // needs — but it is now an OPTION, not a precondition. Without it the legacy
  // leg executes the producers fresh, the same way the exact leg always has.
  if (scanMode === 'exact-origin' && parsed.corpusArtifactPath) {
    throw new Error('observed-shape exact-origin scan executes the corpus fresh and forbids --corpus-artifact');
  }
  if (parsed.migrationFlag && (!parsed.write || !parsed.migrationReviewPath)) {
    throw new Error(`observed-shape --migrate-schema=${BASELINE_SCHEMA} requires --write and a nonempty --migration-review=<bundle.json>`);
  }
  if (parsed.migrationReviewPath && (!parsed.write || !parsed.migrationFlag)) {
    throw new Error('observed-shape --migration-review is only valid for an explicit schema migration write');
  }
  if (parsed.write && parsed.report) throw new Error('observed-shape --write and --report are conflicting modes');
  return {
    ...parsed,
    mode: parsed.scanOnly ? 'scan-only' : 'gate',
    scanMode,
  };
}

export async function run(argv = [], overrides = {}) {
  const command = commandOf(argv);
  const runtime = {
    corpusFor,
    sourceFiles,
    subjectFiles,
    executionInputFiles,
    scanReaders,
    scanLegacyReaders,
    fileManifestOf,
    scannerToolFiles,
    subjectShaFor: () => gitShaFor('OSR_SUBJECT_SHA'),
    scannerShaFor: () => gitShaFor('OSR_SCANNER_SHA'),
    headShaFor,
    repositoryHeadFor,
    dirtyInputsFor,
    assertHealthyScanProvenance,
    createScanArtifact,
    validateScanArtifact,
    assertFindingSourceEvidence,
    validateBaseline: validateSchema4Baseline,
    validateBaselineHistory,
    committedInputManifestsFor,
    validateMigrationBundle,
    planArtifactOutput: (path, inputs, protectedPaths) => planExternalArtifactOutputs({
      root: ROOT, outputs: [path], inputs, protectedPaths,
    })[0],
    writeArtifact: (plan, artifact) => publishJsonExclusive(plan, artifact, {
      stringify: (value) => canonicalJson(value, 2),
    }),
    readJson: (path) => JSON.parse(readFileSync(path, 'utf8')),
    writeProgress: (event) => process.stderr.write(`${JSON.stringify(event)}\n`),
    baselineExists: () => existsSync(BASELINE),
    readBaseline: () => JSON.parse(readFileSync(BASELINE, 'utf8')),
    readBaselineText: () => readFileSync(BASELINE, 'utf8'),
    writeBaseline: writeBaselineAtomically,
    ...overrides,
  };
  const emitProgress = command.progress
    ? (event) => runtime.writeProgress({ at: new Date().toISOString(), ...event })
    : null;
  const readBaselineEnvelope = () => {
    if (overrides.readBaseline && !overrides.readBaselineText) {
      const value = runtime.readBaseline();
      return { value, text: `${canonicalJson(value, 1)}\n` };
    }
    const text = runtime.readBaselineText();
    return { value: JSON.parse(text), text };
  };

  let baseline = null;
  let baselineText = null;
  let bundle = null;
  let migrationReceipt = null;
  if (command.mode === 'gate') {
    if (!runtime.baselineExists()) throw new Error('observed-shape baseline is missing');
    ({ value: baseline, text: baselineText } = readBaselineEnvelope());
    if (command.migrationFlag) {
      if (baseline.schema === BASELINE_SCHEMA) {
        throw new Error(`observed-shape baseline is already schema ${BASELINE_SCHEMA}; a migration review cannot authorize ordinary maintenance.`);
      }
      bundle = runtime.readJson(command.migrationReviewPath);
      migrationReceipt = runtime.validateMigrationBundle(bundle);
      if (digestOf(baseline) !== migrationReceipt.predecessorBaselineDigest
        || canonicalJson(baseline) !== canonicalJson(bundle.predecessorBaseline)
        || sha256Text(baselineText) !== migrationReceipt.predecessorBaselineTextSha256) {
        throw new Error('observed-shape migration bundle is not bound to the exact predecessor baseline bytes and content');
      }
    } else if (baseline.schema !== BASELINE_SCHEMA) {
      if (command.write) {
        throw new Error(`observed-shape baseline schema ${JSON.stringify(baseline.schema)} cannot be overwritten by schema ${BASELINE_SCHEMA}. Run the governed migration report and pass --migrate-schema=${BASELINE_SCHEMA} explicitly.`);
      }
      console.error(`observed-shape baseline: schema ${JSON.stringify(baseline.schema)} — expected ${BASELINE_SCHEMA}.`
        + ' Build and review the governed migration bundle, then explicitly re-freeze with'
        + ` --write --migrate-schema=${BASELINE_SCHEMA} --migration-review=<bundle.json>.`);
      return 1;
    } else {
      runtime.validateBaseline(baseline);
      runtime.validateBaselineHistory(baseline);
    }
  }

  const before = inputSnapshot(runtime);
  if (baselineText != null && sha256Text(baselineText) !== before.baselineTextSha256) {
    throw new Error('observed-shape baseline changed between admission and input snapshot; retry from one immutable predecessor');
  }
  let authority = null;
  if (command.mode === 'scan-only' || command.write) {
    authority = assertAuthoritativeSnapshot(before, runtime);
  }
  if (baseline?.schema === BASELINE_SCHEMA
    && (baseline.scannerProvenance.detectorDigest !== before.detectorTree.digest
      || baseline.scannerProvenance.unscannedInputDigest !== unscannedInputDigestOf(before))) {
    const message = `observed-shape detector or unscanned execution input changed since the schema-${BASELINE_SCHEMA} instrument was governed; an ordinary gate/write cannot migrate the instrument`;
    if (command.write) throw new Error(message);
    console.error(message);
    return 1;
  }

  let outputPlan = null;
  if (command.mode === 'scan-only') {
    outputPlan = runtime.planArtifactOutput(
      command.jsonPath,
      command.corpusArtifactPath ? [command.corpusArtifactPath] : [],
      [BASELINE, ...before.execution],
    );
  }

  let corpus;
  emitProgress?.({ phase: 'corpus-start', scanMode: command.scanMode });
  if (command.corpusArtifactPath) {
    const inputCorpusArtifact = runtime.readJson(command.corpusArtifactPath);
    runtime.validateScanArtifact(inputCorpusArtifact);
    if (inputCorpusArtifact.scanMode !== 'exact-origin') {
      throw new Error('observed-shape legacy detector requires a validated exact-origin corpus artifact');
    }
    assertArtifactMatchesSnapshot(inputCorpusArtifact, before, authority);
    corpus = inputCorpusArtifact.corpus;
  } else if (command.migrationFlag) {
    assertArtifactMatchesSnapshot(bundle.currentArtifact, before, authority);
    assertArtifactMatchesSnapshot(bundle.legacyArtifact, before, authority);
    corpus = bundle.currentArtifact.corpus;
  } else {
    corpus = await runtime.corpusFor();
  }
  emitProgress?.({
    phase: 'corpus-complete',
    scanMode: command.scanMode,
    origins: Object.keys(corpus.graph?.origins || {}).length,
  });

  // The heuristic (legacy-leaf) leg is deliberately handed the UNFILTERED file
  // list: it is the coverage CR-OSR-SCOPE-1's UI exclusion leans on.
  const excludedReadScopes = command.scanMode === 'legacy-leaf'
    ? []
    : assertExactScanExcludedScope();
  emitProgress?.({
    phase: 'scan-start',
    scanMode: command.scanMode,
    files: before.files.length,
    excludedReadScopes,
  });
  const scan = command.scanMode === 'legacy-leaf'
    ? runtime.scanLegacyReaders({
      files: before.files,
      shapes: corpus.shapes,
      arrayShapes: corpus.arrayShapes,
      singleHome: corpus.singleHome,
      rootShapes: corpus.rootShapes,
      minRows: MIN_ROWS,
      root: ROOT,
    })
    : runtime.scanReaders({
      files: before.files,
      graph: corpus.graph,
      minRows: ORIGIN_MIN_ROWS,
      root: ROOT,
      excludedReadScopes,
      onReadStart: emitProgress
        ? (read) => emitProgress({ phase: 'read-start', ...read })
        : null,
    });
  emitProgress?.({
    phase: 'scan-complete',
    scanMode: command.scanMode,
    findings: scan.findings.length,
    reads: scan.stats.reads,
    excludedReadFiles: scan.stats.excludedReadFiles ?? 0,
  });
  runtime.assertFindingSourceEvidence(scan.findings, before);
  const sentinel = scanSentinelOf(command.scanMode, corpus, scan.stats, SCAN_CONFIG);
  runtime.assertHealthyScanProvenance({
    scanMode: command.scanMode,
    corpus,
    stats: scan.stats,
    sentinel,
    scanConfig: SCAN_CONFIG,
  });
  const after = inputSnapshot(runtime);
  assertStableSnapshot(before, after, { requireClean: command.mode === 'scan-only' || command.write });

  if (command.mode === 'scan-only') {
    const artifact = runtime.createScanArtifact(artifactArguments({
      scanMode: command.scanMode,
      snapshot: after,
      ...authority,
      corpus,
      findings: scan.findings,
      stats: scan.stats,
      sentinel,
    }));
    runtime.writeArtifact(outputPlan, artifact);
    console.log(`observed-shape ${command.scanMode} artifact: ${scan.findings.length} finding(s) written to ${command.jsonPath}`);
    console.log(excludedScopeNotice(excludedReadScopes, scan.stats));
    return 0;
  }

  if (command.write) {
    if (command.migrationFlag) {
      // ⭐⭐ ONE DETECTOR, RE-EXECUTED. The schema-2 -> schema-3 freeze ran BOTH
      // detectors here and required each to reproduce its own bundled artifact.
      // Schema 4's authority IS the governed heuristic detector, so there is no
      // second artifact to reproduce — and demanding one would require a
      // full-tree EXACT scan, which cannot complete (the measured
      // `src/data/constants.js:56` growth wall). The bundle still carries both
      // `legacyArtifact` and `currentArtifact` so nothing downstream changes
      // shape; under schema 4 they are the SAME artifact, and this is the pin
      // that refuses a bundle where they are not.
      const heuristicArtifact = runtime.createScanArtifact(artifactArguments({
        scanMode: BASELINE_SCAN_MODE, snapshot: after, ...authority, corpus,
        findings: scan.findings, stats: scan.stats, sentinel,
      }));
      const heuristicDigest = digestOf(heuristicArtifact);
      const heuristicText = canonicalJson(heuristicArtifact);
      if (heuristicDigest !== migrationReceipt.legacyArtifactDigest
        || heuristicDigest !== migrationReceipt.currentArtifactDigest
        || heuristicText !== canonicalJson(bundle.legacyArtifact)
        || heuristicText !== canonicalJson(bundle.currentArtifact)) {
        throw new Error('observed-shape migration artifacts do not exactly match the fresh governed heuristic detector');
      }
    } else {
      const maintenance = compare(scan.findings, baseline);
      if (maintenance.violations.length) {
        throw new Error(`observed-shape schema-${BASELINE_SCHEMA} maintenance is shrink-only; growth or an identity swap cannot be re-frozen:\n`
          + maintenance.violations.join('\n'));
      }
      const maintenanceVacuity = sentinelFailures(sentinel, baseline.sentinel);
      if (maintenanceVacuity.length) {
        throw new Error(`observed-shape schema-${BASELINE_SCHEMA} maintenance scan is vacuous:\n${maintenanceVacuity.join('\n')}`);
      }
      migrationReceipt = baseline.migrationReview;
    }
    const finalSnapshot = inputSnapshot(runtime);
    assertStableSnapshot(after, finalSnapshot, { requireClean: true });
    const next = baselineOf({
      snapshot: finalSnapshot,
      headSha: authority.subjectSha,
      corpus,
      stats: scan.stats,
      sentinel,
      findings: scan.findings,
      migrationReview: migrationReceipt,
    });
    runtime.writeBaseline(next, baselineText);
    console.log(`froze ${scan.findings.length} finding(s) / ${next.identities} identit(ies) across ${Object.keys(next.inventory).length} file(s)`);
    return 0;
  }

  const { violations, stale } = compare(scan.findings, baseline);
  const vacuity = sentinelFailures(sentinel, baseline.sentinel);
  if (command.report) {
    for (const finding of scan.findings) {
      console.log(`${finding.file}:${finding.line}  ${finding.key}  on ${finding.shapes.join('|')}   ${finding.text}`);
    }
    console.log(`\n${scan.findings.length} finding(s); scan reached ${scan.stats.resolved}/${scan.stats.reads} reads across ${scan.stats.files} files`);
    console.log(excludedScopeNotice(excludedReadScopes, scan.stats));
    console.log(cohortNotice(inventoryOf(scan.findings)));
  }
  if (!violations.length && !stale.length && !vacuity.length) {
    console.log(`observed-shape readers: ${scan.findings.length} finding(s), exactly matching the frozen inventory.`);
    console.log(cohortNotice(baseline.inventory));
    return 0;
  }
  for (const violation of vacuity) console.error(`ANTI-VACUITY — ${violation}`);
  for (const violation of violations) console.error(violation);
  for (const staleRow of stale) console.error(`STALE ROW — ${staleRow}`);
  return 1;
}

const invokedDirectly = process.argv[1] && relative(process.argv[1], fileURLToPath(import.meta.url)) === '';
if (invokedDirectly) process.exit(await run(process.argv.slice(2)));
