#!/usr/bin/env node
/**
 * Runs the maintained whole-world soak across an explicit horizon/realm-size
 * matrix and emits one aggregate evidence receipt.
 *
 * This is deliberately an evidence collector, not a manifest writer. The
 * composed soak proves mechanics and emits normalized behavioral observations
 * for the predeclared certification oracle. Worker duration remains
 * host-sensitive evidence, and the Node transport must not be mislabeled as
 * browser Web Worker timing. A successful matrix still never writes the product
 * manifest: a source-bound human Chronicle review is required, then an operator
 * separately reviews and publishes the candidate entry.
 */

import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateBehavioralCertification } from '../../src/domain/certification/behavioralContract.js';
import { CERTIFICATION_REQUIRED_PROPERTY_KEYS } from '../../src/domain/certification/certificationSchema.js';

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
    cells: Object.freeze([
      Object.freeze({ years: 1, settlements: 4, seedIndices: Object.freeze([1]) }),
      Object.freeze({ years: 1, settlements: 30, seedIndices: Object.freeze([1]) }),
    ]),
  }),
  weekly: Object.freeze({
    description: 'Thirty-year useful-horizon regression at the representative 12-settlement scale.',
    cells: Object.freeze([
      Object.freeze({ years: 30, settlements: 12, seedIndices: Object.freeze([1]) }),
    ]),
  }),
  release: Object.freeze({
    description: 'Orthogonal pre-launch evidence: scale sweep, useful-horizon breadth, and century endurance.',
    cells: Object.freeze([
      // Scale is measured cheaply and independently of duration.
      Object.freeze({ years: 1, settlements: 4, seedIndices: Object.freeze([1]) }),
      Object.freeze({ years: 1, settlements: 12, seedIndices: Object.freeze([1]) }),
      Object.freeze({ years: 1, settlements: 24, seedIndices: Object.freeze([1]) }),
      Object.freeze({ years: 1, settlements: 30, seedIndices: Object.freeze([1]) }),
      // The useful product horizon gets two independent representative seeds.
      Object.freeze({ years: 30, settlements: 12, seedIndices: Object.freeze([1, 2]) }),
      // Endurance is a duration question, exercised at small and representative scale.
      Object.freeze({ years: 100, settlements: 4, seedIndices: Object.freeze([1]) }),
      Object.freeze({ years: 100, settlements: 12, seedIndices: Object.freeze([2]) }),
    ]),
  }),
  research: Object.freeze({
    description: 'Three-hundred-year attractor study; informative, never a launch gate.',
    cells: Object.freeze([
      Object.freeze({ years: 300, settlements: 12, seedIndices: Object.freeze([1]) }),
    ]),
  }),
});

function behavioralControlsFor(profileName, years, settlements, seedIndex) {
  if (profileName === 'release') {
    const releaseProbes = new Set(['30:12:1', '30:12:2', '100:4:1']);
    if (releaseProbes.has(`${years}:${settlements}:${seedIndex}`)) {
      return { neighborYears: 30, dark: true };
    }
  }
  if (profileName === 'research' && years === 300 && seedIndex === 1) {
    return { neighborYears: 300, dark: false };
  }
  return null;
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const sumFinite = (values) => values.reduce((total, value) => (
  total + (Number.isFinite(Number(value)) ? Number(value) : 0)
), 0);

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
  for (const cell of profile.cells) {
    const { years, settlements } = cell;
    for (const seedIndex of cell.seedIndices) {
      const id = `${profileName}-${years}y-${settlements}s-seed${seedIndex}`;
      const behavioralControls = behavioralControlsFor(
        profileName,
        years,
        settlements,
        seedIndex,
      );
      cases.push({
        id,
        years,
        settlements,
        seed: `${safeSlug(seedPrefix)}-${id}`,
        ...(behavioralControls ? { behavioralControls } : {}),
      });
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
    receipt?.schemaVersion === 4
    && receipt?.kind === 'whole_world_soak'
    && receipt?.passed === true
    && receipt?.behavioral?.schemaVersion === 1
    && receipt?.behavioral?.kind === 'whole_world_behavioral_observation'
    && Array.isArray(receipt?.behavioral?.yearly)
    && receipt.behavioral.yearly.length === receipt?.years
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
 * `git ls-files --cached` includes tracked paths deleted in a dirty worktree.
 * A source-bound soak must fingerprint the live checkout, not try to read a
 * cached path that no longer exists.
 *
 * @param {string} listed
 */
export function liveSourceFilesFromGitListing(listed) {
  return [...new Set(String(listed).split('\n').filter(Boolean))]
    .filter((file) => existsSync(resolve(ROOT, file)))
    .sort();
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
  const files = liveSourceFilesFromGitListing(listed);
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

function loadHumanReview(path) {
  if (!path) return { review: null, evidence: null };
  const absoluteReviewPath = resolve(String(path));
  try {
    const reviewText = readFileSync(absoluteReviewPath, 'utf8');
    return {
      review: JSON.parse(reviewText),
      evidence: {
        path: relative(ROOT, absoluteReviewPath),
        sha256: sha256(reviewText),
        loadError: null,
      },
    };
  } catch (error) {
    return {
      review: null,
      evidence: {
        path: relative(ROOT, absoluteReviewPath),
        sha256: null,
        loadError: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

function evidenceDigestFor(receipts) {
  const evidence = receipts.map((receipt) => ({
    caseId: receipt.caseId,
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
    behavioral: receipt.behavioral,
  }));
  return sha256(JSON.stringify(evidence));
}

function buildCertificationSoakCandidate({
  behavioralCertification,
  receipts,
  evidenceDigest,
  source,
  runAt,
  humanReviewEvidence,
}) {
  const candidateProperties = CERTIFICATION_REQUIRED_PROPERTY_KEYS.filter((key) => (
    ['no_crash', 'rerun_identical', 'seed_divergent', 'population_bounded']
      .includes(key)
    || behavioralCertification.propertiesEarned.includes(key)
  ));
  if (!behavioralCertification.passed
      || candidateProperties.length !== CERTIFICATION_REQUIRED_PROPERTY_KEYS.length
      || !humanReviewEvidence?.sha256) {
    return null;
  }
  return {
    years: 100,
    seedsTested: new Set(receipts.map((receipt) => receipt.seed)).size,
    ticksAdvanced: sumFinite(receipts.map((receipt) => receipt.ticksAdvanced)),
    properties: candidateProperties,
    runAt,
    buildHash: source.commit,
    behavioralContractVersion: behavioralCertification.schemaVersion,
    evidenceDigest,
    humanChronicleReviewDigest: humanReviewEvidence.sha256,
  };
}

/**
 * @param {string[]} [argv]
 */
export async function runRealmScaleCertification(argv = process.argv.slice(2)) {
  const profileName = String(readArg(argv, 'profile', 'smoke'));
  const seedPrefix = String(readArg(argv, 'seed-prefix', 'realm-scale'));
  const dryRun = argv.includes('--dry-run');
  const reviewExisting = argv.includes('--review-existing');
  const humanReviewPath = readArg(argv, 'human-review', '');
  const source = readSourceIdentity();
  const plan = buildRealmScalePlan(profileName, seedPrefix);
  const defaultOutput = resolve(ROOT, 'artifacts/soak', `${profileName}.json`);
  const output = resolve(String(readArg(argv, 'output', defaultOutput)));
  const caseDirectory = resolve(dirname(output), `${safeSlug(profileName)}.cases`);

  if (reviewExisting) {
    if (!existsSync(output)) {
      throw new Error(`Cannot review missing realm-scale evidence: ${output}`);
    }
    const existing = JSON.parse(readFileSync(output, 'utf8'));
    if (existing?.kind !== 'realm_scale_evidence' || existing?.profile !== profileName) {
      throw new Error(
        `Existing evidence is not a ${profileName} realm-scale aggregate.`,
      );
    }
    if (!sourceIdentityMatches(existing.source, source)) {
      throw new Error(
        'Current source identity does not match the existing evidence; human review cannot rebind stale evidence.',
      );
    }
    const existingReceipts = (existing.caseReceipts || []).map((path) => (
      JSON.parse(readFileSync(resolve(dirname(output), path), 'utf8'))
    ));
    const {
      review: existingHumanReview,
      evidence: existingHumanReviewEvidence,
    } = loadHumanReview(humanReviewPath);
    const behavioralCertification = evaluateBehavioralCertification({
      profile: profileName,
      complete: existing.mechanicalPassed === true,
      source: existing.source,
      receipts: existingReceipts,
      humanReview: existingHumanReview,
    });
    const reviewed = {
      ...existing,
      behavioralCertification,
      humanReviewEvidence: existingHumanReviewEvidence,
      certificationSoakCandidate: buildCertificationSoakCandidate({
        behavioralCertification,
        receipts: existingReceipts,
        evidenceDigest: existing.evidenceDigest,
        source: existing.source,
        runAt: existing.completedAt,
        humanReviewEvidence: existingHumanReviewEvidence,
      }),
      reviewedAt: new Date().toISOString(),
      claimBoundary: {
        ...existing.claimBoundary,
        certificationWritten: false,
        manifestEntryEligible: behavioralCertification.passed,
        reason: behavioralCertification.claimBoundary,
      },
    };
    writeJsonAtomically(output, reviewed);
    console.log(`realm-scale behavioral review: ${output}`);
    console.log(
      behavioralCertification.passed
        ? 'eligible for operator-reviewed manifest entry'
        : `not eligible: ${[
            ...behavioralCertification.failures,
            ...behavioralCertification.humanChronicleReview.errors,
          ].join(', ')}`,
    );
    if (!behavioralCertification.passed) process.exitCode = 1;
    return reviewed;
  }

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
      const soakArgs = [
        '--years', String(testCase.years),
        '--settlements', String(testCase.settlements),
        '--seed', testCase.seed,
        '--case-id', testCase.id,
        '--receipt', caseReceiptPath,
      ];
      if (testCase.behavioralControls?.neighborYears) {
        soakArgs.push(
          '--neighbor-control-years',
          String(testCase.behavioralControls.neighborYears),
        );
      }
      if (testCase.behavioralControls?.dark) soakArgs.push('--dark-control');
      await runSoak(soakArgs);
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
  const mechanicalPassed = complete
    && receipts.every((receipt) => receipt.passed === true);
  const {
    review: humanReview,
    evidence: humanReviewEvidence,
  } = loadHumanReview(humanReviewPath);
  const behavioralCertification = evaluateBehavioralCertification({
    profile: profileName,
    complete: mechanicalPassed,
    source,
    receipts,
    humanReview,
  });
  const passed = mechanicalPassed
    && (profileName !== 'release' || behavioralCertification.automatedPassed);
  const evidenceDigest = evidenceDigestFor(receipts);
  const completedAt = new Date().toISOString();
  const certificationSoakCandidate = buildCertificationSoakCandidate({
    behavioralCertification,
    receipts,
    evidenceDigest,
    source,
    runAt: completedAt,
    humanReviewEvidence,
  });
  const aggregate = {
    schemaVersion: 2,
    kind: 'realm_scale_evidence',
    profile: profileName,
    description: plan.description,
    source,
    sourceAtCompletion,
    sourceStable,
    complete,
    mechanicalPassed,
    passed,
    casesPlanned: plan.cases.length,
    casesCompleted: receipts.length,
    matrix: plan.cases,
    summary: summarizeRealmScaleReceipts(receipts),
    evidenceDigest,
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
    behavioralCertification,
    humanReviewEvidence,
    certificationSoakCandidate,
    completedAt,
    claimBoundary: {
      certificationWritten: false,
      manifestEntryEligible: behavioralCertification.passed,
      reason: behavioralCertification.claimBoundary,
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
