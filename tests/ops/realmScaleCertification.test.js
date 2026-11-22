import { readFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  BEHAVIORAL_OBSERVATION_VERSION,
  SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS,
} from '../../src/domain/certification/behavioralContract.js';
import {
  buildRealmScalePlan,
  evidenceDigestFor,
  isPassingWholeWorldReceipt,
  liveSourceFilesFromGitListing,
  percentileOf,
  REALM_SCALE_SOURCE_PATHS,
  runRealmScaleCertification,
  sourceIdentityMatches,
  summarizeRealmScaleReceipts,
} from '../../scripts/audit/realm-scale-certification.mjs';

const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) =>
    rm(path, { recursive: true, force: true })));
});

describe('realm scale certification evidence', () => {
  function passingChildReceipt() {
    return {
      schemaVersion: 4,
      kind: 'whole_world_soak',
      years: 1,
      passed: true,
      properties: [
        'isolated_worker_executed',
        'isolated_worker_output_identical',
      ],
      directFirstResultSha256: 'a'.repeat(64),
      isolatedWorker: {
        kind: 'isolated_advance_worker_measurement',
        actualExecution: true,
        nonVacuous: true,
        runtime: {
          transport: 'node:worker_threads',
          browserWebWorker: false,
          productionBrowserTransportMeasured: false,
          parentThreadId: 0,
          workerThreadId: 1,
        },
        response: {
          progressMessages: 52,
          lastProgress: { ticksDone: 52 },
          jsonSha256: 'a'.repeat(64),
        },
        timingsMs: {
          requestToTerminal: 300,
          workerHandlerToTerminalPost: 250,
        },
      },
      behavioral: {
        schemaVersion: BEHAVIORAL_OBSERVATION_VERSION,
        kind: 'whole_world_behavioral_observation',
        yearly: [{}],
      },
    };
  }

  function passingSeedDivergenceEvidence() {
    return {
      instrument: 'event_type_total_variation_v1',
      verdict: 'PASS',
      passed: true,
      windowYears: 5,
      seeds: { baseline: 'seed-a', divergent: 'seed-b' },
      thresholds: {
        minTotalVariationDistance: 0.1,
        minShiftedEventEquivalents: 2,
      },
      totalVariationDistance: 0.2,
      shiftedEventEquivalents: 2,
      sampleTotals: { baseline: 10, divergent: 10 },
      distinctTypeTotals: { baseline: 2, divergent: 2 },
      topTypeShifts: [{
        type: 'siege',
        baselineCount: 5,
        comparisonCount: 3,
        baselineShare: 0.5,
        comparisonShare: 0.3,
        absoluteShareShift: 0.2,
      }],
      equalWindows: true,
      nonEmpty: true,
      invalidEntries: [],
      hashDiverged: false,
    };
  }

  it('keeps regression, release, and research profiles explicit', () => {
    const smoke = buildRealmScalePlan('smoke');
    const weekly = buildRealmScalePlan('weekly');
    const release = buildRealmScalePlan('release');
    const research = buildRealmScalePlan('research');

    expect(smoke.cases.map(({ years, settlements }) => [years, settlements]))
      .toEqual([[1, 4], [1, 30]]);
    expect(weekly.cases.map(({ years, settlements }) => [years, settlements]))
      .toEqual([[30, 12]]);
    expect(release.cases.map(({ years, settlements, id }) => [
      years,
      settlements,
      Number(/seed(\d+)$/.exec(id)?.[1]),
    ])).toEqual([
      [1, 4, 1],
      [1, 12, 1],
      [1, 24, 1],
      [1, 30, 1],
      [30, 12, 1],
      [30, 12, 2],
      [100, 4, 1],
      [100, 12, 2],
    ]);
    expect(research.cases).toHaveLength(1);
    expect(research.cases.every((entry) => entry.years === 300 && entry.settlements === 12)).toBe(true);
    expect(release.cases.filter((entry) => entry.behavioralControls?.dark)).toHaveLength(3);
    expect(release.cases.filter((entry) => entry.behavioralControls?.neighborYears === 30))
      .toHaveLength(3);
    expect(research.cases.filter((entry) => entry.behavioralControls?.neighborYears === 300))
      .toHaveLength(1);
  });

  it('rejects an unknown profile instead of silently choosing a cheaper run', () => {
    expect(() => buildRealmScalePlan('almost-release')).toThrow(/Unknown profile/);
  });

  it('requires commit, dirty state, and content fingerprint to remain identical', () => {
    const source = {
      commit: 'a'.repeat(40),
      dirty: true,
      sourceFingerprint: 'b'.repeat(64),
    };

    expect(sourceIdentityMatches(source, { ...source })).toBe(true);
    expect(sourceIdentityMatches(source, { ...source, commit: 'c'.repeat(40) })).toBe(false);
    expect(sourceIdentityMatches(source, { ...source, dirty: false })).toBe(false);
    expect(
      sourceIdentityMatches(source, {
        ...source,
        sourceFingerprint: 'd'.repeat(64),
      }),
    ).toBe(false);
  });

  it('fingerprints the live graph when a cached source file is deleted', () => {
    expect(liveSourceFilesFromGitListing([
      'src/generators/data/deityPool.js',
      'src/domain/worldPulse/latentPantheon.js',
      'src/domain/worldPulse/latentPantheon.js',
    ].join('\n'))).toEqual([
      'src/domain/worldPulse/latentPantheon.js',
    ]);
  });

  it('binds the maintained spatial pack fixture into the aggregate source identity', () => {
    expect(REALM_SCALE_SOURCE_PATHS)
      .toContain('tests/fixtures/spatialPackFixtures.js');
  });

  it('binds both A-4 and WR-9 observations into the aggregate evidence digest', () => {
    const receipt = {
      caseId: 'release-case',
      seedDivergence: { verdict: 'PASS', totalVariationDistance: 0.25 },
      warConvergence: { endingsMix: { terms: 3 } },
    };
    const baseline = evidenceDigestFor([receipt]);

    expect(evidenceDigestFor([{
      ...receipt,
      seedDivergence: { ...receipt.seedDivergence, verdict: 'FAIL' },
    }])).not.toBe(baseline);
    expect(evidenceDigestFor([{
      ...receipt,
      warConvergence: { endingsMix: { terms: 4 } },
    }])).not.toBe(baseline);
  });

  it('admits both supported receipt envelopes and rejects retired ones', () => {
    // v4 stays readable for the completed legacy corpus. A current v5 child is
    // admitted only with the new distribution proof; the WR-9 section is graded
    // separately by the behavioral oracle and an empty one cannot certify.
    const v4 = passingChildReceipt();
    expect(SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS).toEqual([4, 5]);
    expect(isPassingWholeWorldReceipt({ ...v4, schemaVersion: 4 })).toBe(true);
    expect(isPassingWholeWorldReceipt({
      ...v4,
      schemaVersion: 5,
      seedDivergence: passingSeedDivergenceEvidence(),
      subsystems: {
        schemaVersion: 5,
        kind: 'soak_subsystem_configuration',
        presetId: 'full_simulation',
        rules: { npcAgencyEnabled: true },
        stateKeysComplete: true,
        stateKeys: {},
      },
    })).toBe(true);
    expect(isPassingWholeWorldReceipt({ ...v4, schemaVersion: 5 })).toBe(false);
    expect(isPassingWholeWorldReceipt({ ...v4, schemaVersion: 3 })).toBe(false);
  });

  it('rejects clone-only, mislabeled, or output-divergent worker receipts', () => {
    const valid = passingChildReceipt();
    expect(isPassingWholeWorldReceipt(valid)).toBe(true);
    expect(isPassingWholeWorldReceipt({
      ...valid,
      schemaVersion: 2,
      isolatedWorker: null,
    })).toBe(false);
    expect(isPassingWholeWorldReceipt({
      ...valid,
      isolatedWorker: {
        ...valid.isolatedWorker,
        runtime: {
          ...valid.isolatedWorker.runtime,
          transport: 'browser-web-worker',
          browserWebWorker: true,
        },
      },
    })).toBe(false);
    expect(isPassingWholeWorldReceipt({
      ...valid,
      isolatedWorker: {
        ...valid.isolatedWorker,
        response: {
          ...valid.isolatedWorker.response,
          jsonSha256: 'b'.repeat(64),
        },
      },
    })).toBe(false);
  });

  it('calculates transparent percentiles and aggregate performance evidence', () => {
    expect(percentileOf([40, 10, 30, 20], 0.5)).toBe(25);
    const summary = summarizeRealmScaleReceipts([
      {
        passed: true,
        yearlyMs: [10, 20],
        yearlyRealmBytes: [100, 200],
        structuredCloneMs: 2,
        peakHeapUsedBytes: 1_000,
        isolatedWorker: {
          kind: 'isolated_advance_worker_measurement',
          actualExecution: true,
          nonVacuous: true,
          timingsMs: {
            requestToTerminal: 120,
            workerHandlerToTerminalPost: 100,
          },
        },
      },
      {
        passed: true,
        yearlyMs: [30, 40],
        yearlyRealmBytes: [300, 400],
        structuredCloneMs: 4,
        peakHeapUsedBytes: 2_000,
        isolatedWorker: {
          kind: 'isolated_advance_worker_measurement',
          actualExecution: true,
          nonVacuous: true,
          timingsMs: {
            requestToTerminal: 240,
            workerHandlerToTerminalPost: 200,
          },
        },
      },
    ]);
    expect(summary.casesPassed).toBe(2);
    expect(summary.yearlyMs).toEqual({ p50: 25, p95: 38.5, max: 40 });
    expect(summary.realmBytes.max).toBe(400);
    expect(summary.structuredCloneMs.p50).toBe(3);
    expect(summary.isolatedWorker).toEqual({
      transport: 'node:worker_threads',
      casesMeasured: 2,
      browserWebWorkerMeasured: false,
      requestToTerminalMs: { p50: 180, p95: 234, max: 240 },
      workerHandlerToTerminalPostMs: { p50: 150, p95: 195, max: 200 },
    });
    expect(summary.peakHeapUsedBytes).toBe(2_000);
  });

  it('writes a source-bound plan without pretending a dry run earned a claim', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'sf-realm-plan-'));
    temporaryDirectories.push(directory);
    const output = join(directory, 'plan.json');

    const result = await runRealmScaleCertification([
      '--profile', 'smoke',
      '--dry-run',
      '--output', output,
    ]);
    const written = JSON.parse(readFileSync(output, 'utf8'));

    expect(written).toEqual(result);
    expect(written.kind).toBe('realm_scale_plan');
    expect(written.complete).toBe(false);
    expect(written.note).toMatch(/No simulation was executed/);
    expect(written.source.commit).toMatch(/^[a-f0-9]{40}$/);
    expect(written.source.sourceFingerprint).toMatch(/^[a-f0-9]{64}$/);
  });
});
