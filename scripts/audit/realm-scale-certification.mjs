#!/usr/bin/env node
/**
 * Runs the maintained whole-world soak across an explicit horizon/realm-size
 * matrix and emits one aggregate evidence receipt.
 *
 * This is deliberately an evidence collector, not a manifest writer. The
 * composed soak currently proves determinism, bounded population, finite
 * arithmetic, the byte/cost envelope, and actual execution in an isolated Node
 * worker thread. Worker duration remains host-sensitive evidence, and the Node
 * transport must not be mislabeled as browser Web Worker timing. The soak
 * reports stasis but does not yet prove the full rhythm/no-stasis contract, so
 * a successful matrix must not silently promote itself to product certification.
 */

import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const WHOLE_WORLD_SOAK = resolve(ROOT, 'scripts/audit/whole-world-soak.mjs');

/**
 * Profiles separate fast regression evidence from expensive release and
 * research work. Release is the complete pre-launch grid; the 300-year profile
 * remains research evidence rather than a launch promise.
 */
export const REALM_SCALE_PROFILES = Object.freeze({
  smoke: Object.freeze({
    description: 'Fast shape check at the smallest and supported maximum realm sizes.',
    horizons: Object.freeze([1]),
    settlements: Object.freeze([4, 30]),
    seedsPerCell: 1,
  }),
  weekly: Object.freeze({
    description: 'Thirty-year useful-horizon evidence across the supported scale curve.',
    horizons: Object.freeze([30]),
    settlements: Object.freeze([4, 12, 24, 30]),
    seedsPerCell: 1,
  }),
  release: Object.freeze({
    description: 'Pre-launch evidence for short, useful, and century horizons at every scale band.',
    horizons: Object.freeze([1, 30, 100]),
    settlements: Object.freeze([4, 12, 24, 30]),
    seedsPerCell: 3,
  }),
  research: Object.freeze({
    description: 'Three-hundred-year attractor study; informative, never a launch gate.',
    horizons: Object.freeze([300]),
    settlements: Object.freeze([12]),
    seedsPerCell: 3,
  }),
});

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

function readArg(argv, name, fallback = null) {
  const index = argv.indexOf(`--${name}`);
  return index >= 0 && argv[index + 1] != null ? argv[index + 1] : fallback;
}

function safeSlug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * @param {string} profileName
 * @param {string} [seedPrefix]
 */
export function buildRealmScalePlan(profileName, seedPrefix = 'realm-scale') {
  const profile = REALM_SCALE_PROFILES[profileName];
  if (!profile) {
    const available = Object.keys(REALM_SCALE_PROFILES).join(', ');
    throw new Error(
      `Unknown profile "${profileName}". Expected one of: ${available}.`,
    );
  }

  const cases = [];
  for (const years of profile.horizons) {
    for (const settlements of profile.settlements) {
      for (let seedIndex = 1; seedIndex <= profile.seedsPerCell; seedIndex += 1) {
        const id = `${profileName}-${years}y-${settlements}s-seed${seedIndex}`;
        cases.push({
          id,
          years,
          settlements,
          seed: `${safeSlug(seedPrefix)}-${id}`,
        });
      }
    }
  }
  return {
    profile: profileName,
    description: profile.description,
    cases,
  };
}

/**
 * Linear interpolation percentile. Timing evidence is observational, so a
 * transparent small-sample calculation is preferable to a statistics dependency.
 * @param {number[]} values
 * @param {number} percentile
 */
export function percentileOf(values, percentile) {
  const sorted = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const position = (sorted.length - 1) * percentile;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  const fraction = position - lower;
  return sorted[lower] + ((sorted[upper] - sorted[lower]) * fraction);
}

/**
 * @param {Array<Record<string, unknown>>} receipts
 */
export function summarizeRealmScaleReceipts(receipts) {
  const yearlyMs = receipts.flatMap((receipt) => (
    Array.isArray(receipt.yearlyMs)
      ? receipt.yearlyMs.filter(Number.isFinite)
      : []
  ));
  const yearlyRealmBytes = receipts.flatMap((receipt) => (
    Array.isArray(receipt.yearlyRealmBytes)
      ? receipt.yearlyRealmBytes.filter(Number.isFinite)
      : []
  ));
  const cloneMs = receipts
    .map((receipt) => Number(receipt.structuredCloneMs))
    .filter(Number.isFinite);
  const heapBytes = receipts
    .map((receipt) => Number(receipt.peakHeapUsedBytes))
    .filter(Number.isFinite);
  const isolatedWorkers = receipts
    .map((receipt) => receipt.isolatedWorker)
    .filter((measurement) => (
      measurement?.kind === 'isolated_advance_worker_measurement'
      && measurement?.actualExecution === true
      && measurement?.nonVacuous === true
    ));
  const workerRoundTripMs = isolatedWorkers
    .map((measurement) => Number(measurement.timingsMs?.requestToTerminal))
    .filter(Number.isFinite);
  const workerHandlerMs = isolatedWorkers
    .map((measurement) => Number(
      measurement.timingsMs?.workerHandlerToTerminalPost,
    ))
    .filter(Number.isFinite);

  return {
    casesPassed: receipts.filter((receipt) => receipt.passed === true).length,
    casesMeasured: receipts.length,
    yearlyMs: {
      p50: percentileOf(yearlyMs, 0.50),
      p95: percentileOf(yearlyMs, 0.95),
      max: yearlyMs.length ? Math.max(...yearlyMs) : null,
    },
    realmBytes: {
      p50: percentileOf(yearlyRealmBytes, 0.50),
      p95: percentileOf(yearlyRealmBytes, 0.95),
      max: yearlyRealmBytes.length ? Math.max(...yearlyRealmBytes) : null,
    },
    structuredCloneMs: {
      p50: percentileOf(cloneMs, 0.50),
      p95: percentileOf(cloneMs, 0.95),
      max: cloneMs.length ? Math.max(...cloneMs) : null,
    },
    isolatedWorker: {
      transport: isolatedWorkers.length ? 'node:worker_threads' : null,
      casesMeasured: isolatedWorkers.length,
      browserWebWorkerMeasured: false,
      requestToTerminalMs: {
        p50: percentileOf(workerRoundTripMs, 0.50),
        p95: percentileOf(workerRoundTripMs, 0.95),
        max: workerRoundTripMs.length ? Math.max(...workerRoundTripMs) : null,
      },
      workerHandlerToTerminalPostMs: {
        p50: percentileOf(workerHandlerMs, 0.50),
        p95: percentileOf(workerHandlerMs, 0.95),
        max: workerHandlerMs.length ? Math.max(...workerHandlerMs) : null,
      },
    },
    peakHeapUsedBytes: heapBytes.length ? Math.max(...heapBytes) : null,
  };
}

/**
 * Fail closed on the worker-evidence portion of a child receipt.
 *
 * Schema version alone is insufficient: a hand-edited or truncated v3 receipt
 * must not count as an actual isolate measurement. Output parity, distinct
 * thread identity, a complete one-year progress sequence, and honest transport
 * labels are all part of the admissible shape.
 *
 * @param {Record<string, unknown>} receipt
 */
export function isPassingWholeWorldReceipt(receipt) {
  const worker = receipt?.isolatedWorker;
  const properties = new Set(
    Array.isArray(receipt?.properties) ? receipt.properties : [],
  );
  return (
    receipt?.schemaVersion === 3
    && receipt?.kind === 'whole_world_soak'
    && receipt?.passed === true
    && properties.has('isolated_worker_executed')
    && properties.has('isolated_worker_output_identical')
    && worker?.kind === 'isolated_advance_worker_measurement'
    && worker?.actualExecution === true
    && worker?.nonVacuous === true
    && worker?.runtime?.transport === 'node:worker_threads'
    && worker?.runtime?.browserWebWorker === false
    && worker?.runtime?.productionBrowserTransportMeasured === false
    && Number(worker?.runtime?.workerThreadId) > 0
    && worker?.runtime?.workerThreadId !== worker?.runtime?.parentThreadId
    && worker?.response?.progressMessages === 52
    && worker?.response?.lastProgress?.ticksDone === 52
    && worker?.response?.jsonSha256 === receipt?.directFirstResultSha256
    && Number(worker?.timingsMs?.requestToTerminal) > 0
    && Number(worker?.timingsMs?.workerHandlerToTerminalPost) > 0
  );
}

function commandOutput(command, args) {
  return execFileSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

/**
 * Fingerprints the checked-out simulation inputs, including uncommitted and
 * untracked files. A Git SHA alone is not an honest identity for a dirty soak.
 */
export function readSourceIdentity() {
  const commit = commandOutput('git', ['rev-parse', 'HEAD']);
  const status = commandOutput('git', ['status', '--porcelain=v1', '--untracked-files=all']);
  const listed = commandOutput('git', [
    'ls-files',
    '-c',
    '-o',
    '--exclude-standard',
    '--',
    'src',
    'scripts/audit',
    'package.json',
    'package-lock.json',
  ]);
  const files = [...new Set(listed.split('\n').filter(Boolean))].sort();
  const hash = createHash('sha256');
  for (const file of files) {
    const absolute = resolve(ROOT, file);
    hash.update(`${file}\0`);
    hash.update(readFileSync(absolute));
    hash.update('\0');
  }
  return {
    commit,
    dirty: status !== '',
    sourceFingerprint: hash.digest('hex'),
  };
}

/**
 * Compare the complete source identity used to attribute a long-running matrix.
 *
 * @param {{commit?: string, dirty?: boolean, sourceFingerprint?: string}} left
 * @param {{commit?: string, dirty?: boolean, sourceFingerprint?: string}} right
 */
export function sourceIdentityMatches(left, right) {
  return (
    left?.commit === right?.commit
    && left?.dirty === right?.dirty
    && left?.sourceFingerprint === right?.sourceFingerprint
  );
}

function runSoak(args) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(process.execPath, [WHOLE_WORLD_SOAK, ...args], {
      cwd: ROOT,
      env: process.env,
      stdio: 'inherit',
      shell: false,
    });
    child.once('error', rejectPromise);
    child.once('exit', (code, signal) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`Whole-world soak exited ${code ?? `for signal ${signal}`}.`));
    });
  });
}

function writeJsonAtomically(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.${process.pid}.tmp`;
  writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  renameSync(temp, path);
}

function evidenceDigestFor(receipts) {
  const evidence = receipts.map((receipt) => ({
    seed: receipt.seed,
    years: receipt.years,
    settlements: receipt.settlements,
    passed: receipt.passed,
    properties: receipt.properties,
    finalHash: receipt.finalHash,
    directFirstResultSha256: receipt.directFirstResultSha256,
    yearlyBytes: receipt.yearlyBytes,
    yearlyRealmBytes: receipt.yearlyRealmBytes,
    yearlyMs: receipt.yearlyMs,
    structuredCloneMs: receipt.structuredCloneMs,
    isolatedWorker: receipt.isolatedWorker,
    peakHeapUsedBytes: receipt.peakHeapUsedBytes,
  }));
  return sha256(JSON.stringify(evidence));
}

/**
 * @param {string[]} [argv]
 */
export async function runRealmScaleCertification(argv = process.argv.slice(2)) {
  const profileName = String(readArg(argv, 'profile', 'smoke'));
  const seedPrefix = String(readArg(argv, 'seed-prefix', 'realm-scale'));
  const dryRun = argv.includes('--dry-run');
  const source = readSourceIdentity();
  const plan = buildRealmScalePlan(profileName, seedPrefix);
  const defaultOutput = resolve(ROOT, 'artifacts/soak', `${profileName}.json`);
  const output = resolve(String(readArg(argv, 'output', defaultOutput)));
  const caseDirectory = resolve(dirname(output), `${safeSlug(profileName)}.cases`);

  if (dryRun) {
    const dryReceipt = {
      schemaVersion: 1,
      kind: 'realm_scale_plan',
      ...plan,
      source,
      complete: false,
      note: 'Dry run only. No simulation was executed and no product claim was earned.',
    };
    writeJsonAtomically(output, dryReceipt);
    return dryReceipt;
  }

  mkdirSync(caseDirectory, { recursive: true });
  const receipts = [];
  const failures = [];
  for (const testCase of plan.cases) {
    const sourceBeforeCase = readSourceIdentity();
    if (!sourceIdentityMatches(source, sourceBeforeCase)) {
      failures.push({
        caseId: testCase.id,
        message: 'Source identity changed before this case began; the matrix is not attributable.',
      });
      break;
    }

    const caseReceiptPath = resolve(caseDirectory, `${safeSlug(testCase.id)}.json`);
    rmSync(caseReceiptPath, { force: true });
    console.log(`\n# realm-scale case ${testCase.id}`);
    try {
      await runSoak([
        '--years', String(testCase.years),
        '--settlements', String(testCase.settlements),
        '--seed', testCase.seed,
        '--receipt', caseReceiptPath,
      ]);
      const receipt = JSON.parse(readFileSync(caseReceiptPath, 'utf8'));
      if (!isPassingWholeWorldReceipt(receipt)) {
        throw new Error('The child receipt was missing, stale, or did not pass.');
      }
      const sourceAfterCase = readSourceIdentity();
      if (!sourceIdentityMatches(source, sourceAfterCase)) {
        throw new Error(
          'Source identity changed while this case ran; mixed-code evidence is invalid.',
        );
      }
      receipts.push(receipt);
    } catch (error) {
      failures.push({
        caseId: testCase.id,
        message: error instanceof Error ? error.message : String(error),
      });
      break;
    }
  }

  const sourceAtCompletion = readSourceIdentity();
  const sourceStable = sourceIdentityMatches(source, sourceAtCompletion);
  if (!sourceStable && !failures.some((failure) => failure.caseId === 'source_identity')) {
    failures.push({
      caseId: 'source_identity',
      message: 'Source identity changed before aggregate finalization; the matrix is not attributable.',
    });
  }

  const complete =
    sourceStable
    && failures.length === 0
    && receipts.length === plan.cases.length;
  const aggregate = {
    schemaVersion: 1,
    kind: 'realm_scale_evidence',
    profile: profileName,
    description: plan.description,
    source,
    sourceAtCompletion,
    sourceStable,
    complete,
    passed: complete && receipts.every((receipt) => receipt.passed === true),
    casesPlanned: plan.cases.length,
    casesCompleted: receipts.length,
    matrix: plan.cases,
    summary: summarizeRealmScaleReceipts(receipts),
    evidenceDigest: evidenceDigestFor(receipts),
    caseReceipts: receipts.map((receipt) => {
      const seedSuffix = receipt.seed.split('-').at(-1);
      const receiptName = safeSlug(
        `${profileName}-${receipt.years}y-${receipt.settlements}s-${seedSuffix}`,
      );
      return relative(
        dirname(output),
        resolve(caseDirectory, `${receiptName}.json`),
      );
    }),
    failures,
    completedAt: new Date().toISOString(),
    claimBoundary: {
      certificationWritten: false,
      reason: 'This matrix does not yet prove the full rhythm and no-stasis property set.',
      workerTiming:
        'Worker duration is an actual Node worker_threads isolate measurement, not browser Web Worker or field-device timing.',
    },
  };
  writeJsonAtomically(output, aggregate);
  console.log(`\nrealm-scale evidence: ${output}`);
  console.log(`source: ${source.commit}${source.dirty ? ' (dirty; fingerprint bound)' : ''}`);
  console.log(`digest: ${aggregate.evidenceDigest}`);
  if (!aggregate.passed) process.exitCode = 1;
  return aggregate;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  runRealmScaleCertification().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
