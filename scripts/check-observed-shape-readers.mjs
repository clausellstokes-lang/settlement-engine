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
 *   scripts/lib/reader-shape-scan.mjs      resolves each property read in `src/`
 *     to the shape its receiver holds and reports reads whose key appears in NO
 *     run.
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
 * finding IDENTITY — `<key> on <shape> @ <executed-origin> # <semantic-site>` — as one
 * singular row. A new
 * identity in an already-listed file has ceiling 0 and REDS, exactly as a new
 * file does.
 *
 * ⚠ THE IDENTITY DELIBERATELY EXCLUDES THE LINE NUMBER. Lines churn on every
 * unrelated edit above them; a line-keyed baseline would red on whitespace and
 * be deleted within a week. The semantic site instead binds owner, control
 * ancestry, normalized expression and same-context ordinal, so duplicate reads
 * remain distinct without churning when unrelated statements or trivia move.
 *
 * A file over any of its numbers fails, a file with no row has ceiling 0, and a
 * fixed site is banked by LOWERING or DELETING its identity row. Never raise one.
 *
 * USAGE
 *   node scripts/check-observed-shape-readers.mjs            gate (exit 1 on growth)
 *   node scripts/check-observed-shape-readers.mjs --report   list every finding
 *   node scripts/check-observed-shape-readers.mjs --write    re-freeze (deliberate)
 *   node scripts/check-observed-shape-readers.mjs --scan-only --json=<external-p>
 *                                           write fresh exact governed artifact
 *   node scripts/check-observed-shape-readers.mjs --scan-only
 *     --scan-mode=legacy-leaf --corpus-artifact=<exact-p> --json=<external-p>
 *                                           write pinned legacy governed artifact
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
  BASELINE_SCHEMA,
  MIN_ROWS,
  ORIGIN_MIN_ROWS,
  parseExactBaselineIdentity,
  validateSchema3Baseline,
} from './lib/observed-shape-baseline.mjs';
import {
  parseExactFlags,
  planExternalArtifactOutputs,
  publishJsonExclusive,
} from './lib/governed-artifact-io.mjs';
import {
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
 * 2 = per leaf-name identity (retired: unrelated same-named records pooled).
 * 3 = per path-qualified executed origin identity.
 */
export { BASELINE_SCHEMA, MIN_ROWS, ORIGIN_MIN_ROWS };

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

/** The stable identity of a finding: WHICH key, on WHICH exact executed origin.
 * Never the line — see the header note on why line numbers are excluded. */
export function identityOf(finding) {
  return artifactIdentityOf('exact-origin', finding);
}

/** Per-file, per-identity counts, forward-slash normalized so the ratchet reads
 *  the same on every platform. Both levels are sorted so a re-freeze produces a
 *  reviewable diff rather than a reshuffle. */
export function inventoryOf(findings) {
  return artifactInventoryOf('exact-origin', findings);
}

/**
 * Normalize one baseline row to `{identity: ceiling}`. A BARE NUMBER is the
 * retired count-only form and is REFUSED rather than accepted: silently reading
 * `10` as "any ten findings you like" is precisely the identity-swap hole this
 * ratchet was rebuilt to close, so a hand-edit back to it must fail loudly.
 */
export function rowOf(row, file = '') {
  if (row && typeof row === 'object' && !Array.isArray(row)) {
    const entries = Object.entries(row);
    if (!entries.length) throw new Error(`observed-shape baseline: row for "${file}" is empty.`);
    for (const [identity, count] of entries) {
      parseExactBaselineIdentity(identity);
      if (count !== 1) {
        throw new Error(`observed-shape baseline: exact identity count for "${file}" must be exactly 1; received ${JSON.stringify(count)}.`);
      }
    }
    return row;
  }
  throw new Error(`observed-shape baseline: row for "${file}" is the RETIRED count-only form (${JSON.stringify(row)}).`
    + ' Rows are now {"<key> on <shape> @ <executed-origin> # <semantic-site>": count} so an identity SWAP at constant count reds.'
    + ' Re-freeze with `node scripts/check-observed-shape-readers.mjs --write`.');
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

/** The measurement that makes every green here mean something. */
export function sentinelOf(corpus, stats) {
  return scanSentinelOf('exact-origin', corpus, stats, SCAN_CONFIG);
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
        stale.push(`${file}: "${identity}" is GONE against a frozen count of ${ceiling} — delete the row now; schema 3 permits no dormant headroom.`);
      } else if (count < ceiling) {
        stale.push(`${file}: "${identity}" is ${count} against a frozen count of ${ceiling} — lower the row now; schema 3 permits no dormant headroom.`);
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
      throw new Error('observed-shape first schema-3 baseline has a different migration genesis');
    }
    committedGenesisReceipt = candidate.migrationReview;
    break;
  }
  if (!committedGenesisReceipt) {
    throw new Error('observed-shape migration receipt has no committed schema-3 genesis descendant');
  }
  if (canonicalJson(committedGenesisReceipt) !== canonicalJson(baseline.migrationReview)) {
    throw new Error('observed-shape migration receipt changed after its committed schema-3 genesis');
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
    baselineSchema: scanMode === 'legacy-leaf' ? 2 : BASELINE_SCHEMA,
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
      'READER-WITH-NO-WRITER INVENTORY — per-file, exact PER-SITE identities, SHRINK-ONLY.',
      'A row is "<key> on <shape> @ <executed-origin> # <semantic-site>": 1.',
      'Every row is singular and content-addressed; dormant headroom and identity swaps are refused.',
      'The line number is excluded so unrelated line churn does not rewrite the governed identity.',
      'Fixes may only delete rows. Detector changes require a new governed instrument migration.',
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
  validateSchema3Baseline(baseline);
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
    '--write': { kind: 'flag', name: 'write' },
    [`--migrate-schema=${BASELINE_SCHEMA}`]: { kind: 'flag', name: 'migrationFlag' },
    '--migration-review': { kind: 'value', name: 'migrationReviewPath' },
  });
  const scanMode = parsed.scanMode || 'exact-origin';
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
  if (scanMode === 'legacy-leaf' && !parsed.corpusArtifactPath) {
    throw new Error('observed-shape legacy scan requires --corpus-artifact=<validated-exact-artifact.json>');
  }
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
    validateBaseline: validateSchema3Baseline,
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
    baselineExists: () => existsSync(BASELINE),
    readBaseline: () => JSON.parse(readFileSync(BASELINE, 'utf8')),
    readBaselineText: () => readFileSync(BASELINE, 'utf8'),
    writeBaseline: writeBaselineAtomically,
    ...overrides,
  };
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
    const message = 'observed-shape detector or unscanned execution input changed since the schema-3 instrument was governed; an ordinary gate/write cannot migrate the instrument';
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
  if (command.scanMode === 'legacy-leaf') {
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
    return 0;
  }

  if (command.write) {
    if (command.migrationFlag) {
      const legacyScan = runtime.scanLegacyReaders({
        files: after.files,
        shapes: corpus.shapes,
        arrayShapes: corpus.arrayShapes,
        singleHome: corpus.singleHome,
        rootShapes: corpus.rootShapes,
        minRows: MIN_ROWS,
        root: ROOT,
      });
      const legacySentinel = scanSentinelOf('legacy-leaf', corpus, legacyScan.stats, SCAN_CONFIG);
      runtime.assertFindingSourceEvidence(legacyScan.findings, after);
      const currentArtifact = runtime.createScanArtifact(artifactArguments({
        scanMode: 'exact-origin', snapshot: after, ...authority, corpus,
        findings: scan.findings, stats: scan.stats, sentinel,
      }));
      const legacyArtifact = runtime.createScanArtifact(artifactArguments({
        scanMode: 'legacy-leaf', snapshot: after, ...authority, corpus,
        findings: legacyScan.findings, stats: legacyScan.stats, sentinel: legacySentinel,
      }));
      if (digestOf(currentArtifact) !== migrationReceipt.currentArtifactDigest
        || digestOf(legacyArtifact) !== migrationReceipt.legacyArtifactDigest
        || canonicalJson(currentArtifact) !== canonicalJson(bundle.currentArtifact)
        || canonicalJson(legacyArtifact) !== canonicalJson(bundle.legacyArtifact)) {
        throw new Error('observed-shape migration artifacts do not exactly match both fresh governed detectors');
      }
    } else {
      const maintenance = compare(scan.findings, baseline);
      if (maintenance.violations.length) {
        throw new Error('observed-shape schema-3 maintenance is shrink-only; growth or an identity swap cannot be re-frozen:\n'
          + maintenance.violations.join('\n'));
      }
      const maintenanceVacuity = sentinelFailures(sentinel, baseline.sentinel);
      if (maintenanceVacuity.length) {
        throw new Error(`observed-shape schema-3 maintenance scan is vacuous:\n${maintenanceVacuity.join('\n')}`);
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
  }
  if (!violations.length && !stale.length && !vacuity.length) {
    console.log(`observed-shape readers: ${scan.findings.length} finding(s), exactly matching the frozen inventory.`);
    return 0;
  }
  for (const violation of vacuity) console.error(`ANTI-VACUITY — ${violation}`);
  for (const violation of violations) console.error(violation);
  for (const staleRow of stale) console.error(`STALE ROW — ${staleRow}`);
  return 1;
}

const invokedDirectly = process.argv[1] && relative(process.argv[1], fileURLToPath(import.meta.url)) === '';
if (invokedDirectly) process.exit(await run(process.argv.slice(2)));
