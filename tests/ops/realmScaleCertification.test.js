import { readFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildRealmScalePlan,
  isPassingWholeWorldReceipt,
  liveSourceFilesFromGitListing,
  percentileOf,
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
      schemaVersion: 3,
      kind: 'whole_world_soak',
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
    };
  }

  it('keeps regression, release, and research profiles explicit', () => {
    const smoke = buildRealmScalePlan('smoke');
    const weekly = buildRealmScalePlan('weekly');
    const release = buildRealmScalePlan('release');
    const research = buildRealmScalePlan('research');

    expect(smoke.cases.map(({ years, settlements }) => [years, settlements]))
      .toEqual([[1, 4], [1, 30]]);
    expect(weekly.cases).toHaveLength(4);
    expect(new Set(weekly.cases.map((entry) => entry.settlements)))
      .toEqual(new Set([4, 12, 24, 30]));
    expect(release.cases).toHaveLength(36);
    expect(new Set(release.cases.map((entry) => entry.years)))
      .toEqual(new Set([1, 30, 100]));
    expect(research.cases).toHaveLength(3);
    expect(research.cases.every((entry) => entry.years === 300 && entry.settlements === 12)).toBe(true);
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
