/**
 * determinismUnderWorkers.test.js — SK-1's proof surface (sk-a; ODQ §141.1).
 *
 * ⛔ NO SOAK RUNS HERE (§145.2). The three claims SK-1 makes are all decidable without
 * one, and each is pinned with the counterfactual that would otherwise let it go vacuous:
 *
 *   1  POOL INDEPENDENCE — the grid is a pure function of the config; a mutant that
 *      seeds it from the core count must red.
 *   2  THE COMPARISON SURFACE — spelled as an EXCLUSION, so a receipt field added later
 *      is COMPARED until somebody deliberately excludes it. The mutant here is a
 *      field-added-later case, and an allowlist implementation would pass it silently.
 *   3  THE SUBSTRATE — an archive extracted inside a repository is REFUSED, and the
 *      refusal's condition (`git rev-parse` SUCCEEDING) is the lie mode, not the throw.
 */

import { describe, expect, it } from 'vitest';

import {
  PER_WORLD_RSS_BAND_BYTES,
  VOLATILE_RECEIPT_FIELDS,
  cellKey,
  compareRuns,
  comparisonSurface,
  grid,
  workerCount,
} from '../../scripts/soak/pool.mjs';
import { archivePlan, assertOutsideRepository, runIdentity } from '../../scripts/soak/archive.mjs';
import { planRun, workerEnv } from '../../scripts/soak/run.mjs';

const CONFIG = Object.freeze({
  seeds: ['w0-soak', 'w0-soak-b', 'w0-soak-c'],
  years: 30,
  settlements: 4,
  rows: [
    { id: 'maximal-lawful', rules: { espionageEnabled: true } },
    { id: 'dark-control', rules: {} },
  ],
});

/** A receipt shaped like the real one, with both a stable half and a volatile half. */
const receipt = (overrides = {}) => ({
  schemaVersion: 5,
  seed: 'w0-soak',
  years: 3,
  yearlyHashes: ['h1', 'h2', 'h3'],
  finalHash: 'h3',
  properties: ['no_crash', 'rerun_identical'],
  yearlyMs: [100, 110, 120],
  heapUsedBytes: 12345,
  peakHeapUsedBytes: 54321,
  structuredCloneMs: 4.2,
  runDurationsMs: { primary: 1, replay: 2, divergent: 3 },
  completedAt: '2026-08-16T00:00:00.000Z',
  isolatedWorker: {
    response: { jsonSha256: 'abc' },
    timingsMs: { coldStartToTerminal: 9 },
    runtime: { workerThreadId: 1, parentThreadId: 0, transport: 'worker_threads' },
  },
  ...overrides,
});

describe('determinism under workers', () => {
  it('POOL INDEPENDENCE — the grid is a pure function of the config, never of N', () => {
    const once = grid(CONFIG);
    expect(once.length).toBe(6);
    expect(once.map((cell) => cell.key)).toEqual([
      'w0-soak::30::4::maximal-lawful', 'w0-soak::30::4::dark-control',
      'w0-soak-b::30::4::maximal-lawful', 'w0-soak-b::30::4::dark-control',
      'w0-soak-c::30::4::maximal-lawful', 'w0-soak-c::30::4::dark-control',
    ]);
    // The plan at N = 1, 3 and 8 produces the IDENTICAL ordered cell list, receipt paths
    // included: only the worker count moves.
    const plans = [1, 3, 8].map((cores) => planRun({
      config: CONFIG,
      host: { freeMemBytes: 64 * 1024 * 1024 * 1024, cpus: cores },
      identity: { sourceSha: 'deadbeef' },
      receiptDir: '/soak/receipts',
    }));
    expect(plans.map((plan) => plan.workers)).toEqual([1, 2, 6]);
    for (const plan of plans) {
      expect(plan.cells.map((cell) => cell.key)).toEqual(once.map((cell) => cell.key));
      expect(plan.cells.map((cell) => cell.receipt)).toEqual(plans[0].cells.map((cell) => cell.receipt));
    }
    // THE MUTANT — a grid seeded from the host instead of the config. It must produce a
    // DIFFERENT enumeration, which is what makes arm 1 an assertion rather than a wish.
    const hostSeeded = (cores) => grid({ ...CONFIG, seeds: CONFIG.seeds.slice(0, cores) });
    expect(hostSeeded(1).map((cell) => cell.key)).not.toEqual(once.map((cell) => cell.key));
    expect(hostSeeded(3).map((cell) => cell.key)).toEqual(once.map((cell) => cell.key));
  });

  it('THE WORKER BAND is computed from the host and floors at 1', () => {
    expect(PER_WORLD_RSS_BAND_BYTES).toBe(800 * 1024 * 1024);
    // §141.1's own measurement, quoted: ~8-way with peak RSS per world under 800 MB.
    expect(workerCount({ freeMemBytes: 16 * 1024 * 1024 * 1024, cpus: 10 })).toBe(9);
    // Memory binds before cores do.
    expect(workerCount({ freeMemBytes: 2 * 1024 * 1024 * 1024, cpus: 16 })).toBe(2);
    // A host with neither still runs — serially, never zero-width.
    expect(workerCount({ freeMemBytes: 1, cpus: 1 })).toBe(1);
    expect(cellKey({ seed: 's', years: 1, settlements: 2, rowId: 'r' })).toBe('s::1::2::r');
    expect(Object.keys(workerEnv()).sort()).toEqual(['HOME', 'LANG', 'NODE_ENV', 'PATH', 'TZ']);
  });

  it('THE COMPARISON SURFACE — every receipt key not named VOLATILE is compared', () => {
    expect([...VOLATILE_RECEIPT_FIELDS]).toEqual([
      'yearlyMs', 'structuredCloneMs', 'heapUsedBytes', 'peakHeapUsedBytes',
      'runDurationsMs', 'completedAt',
      'isolatedWorker.timingsMs',
      'isolatedWorker.runtime.workerThreadId',
      'isolatedWorker.runtime.parentThreadId',
      'isolatedWorker.runtime.transport',
    ]);
    // Two runs differing ONLY in host observability are the same run.
    const inPool = receipt();
    const solo = receipt({
      yearlyMs: [900, 901, 902], heapUsedBytes: 1, peakHeapUsedBytes: 2,
      structuredCloneMs: 99, completedAt: '2027-01-01T00:00:00.000Z',
      runDurationsMs: { primary: 9, replay: 9, divergent: 9 },
      isolatedWorker: {
        response: { jsonSha256: 'abc' },
        timingsMs: { coldStartToTerminal: 4000 },
        runtime: { workerThreadId: 7, parentThreadId: 3, transport: 'other' },
      },
    });
    expect(compareRuns(inPool, solo)).toEqual([]);
    // The nested volatile paths really were stripped, and the nested STABLE sibling
    // survived — otherwise the arm above would pass by deleting too much.
    const surface = comparisonSurface(inPool);
    expect(surface.isolatedWorker).toEqual({ response: { jsonSha256: 'abc' }, runtime: {} });
    expect(Object.prototype.hasOwnProperty.call(surface, 'yearlyMs')).toBe(false);
    expect(surface.finalHash).toBe('h3');

    // A MID-RUN DIVERGENCE THAT RECONVERGES is the case a final-hash comparison misses.
    // ⭐ BOTH ARMS CONVICT IT, AND THAT IS THE POINT OF HAVING BOTH: the receipt arm
    // can only say WHICH FIELD moved, while the sequence arm names the YEAR — which is
    // what a fix lane needs to localize. `finalHash` is identical across the pair, so a
    // final-hash comparison would have certified these two runs as the same run.
    const reconverged = receipt({ yearlyHashes: ['h1', 'DIFFERENT', 'h3'] });
    expect(reconverged.finalHash).toBe(inPool.finalHash);
    expect(compareRuns(inPool, reconverged)).toEqual([
      'composite hash diverged at year 2',
      'receipt differs outside the volatile list: yearlyHashes',
    ]);

    // ⚠ THE EXCLUSION-NOT-ALLOWLIST MUTANT. A field added to the receipt LATER must be
    // compared by default. An allowlist implementation would return [] here.
    const withNewField = receipt({ aFieldAddedLater: 'left' });
    const withNewFieldMoved = receipt({ aFieldAddedLater: 'right' });
    expect(compareRuns(withNewField, withNewFieldMoved))
      .toEqual(['receipt differs outside the volatile list: aFieldAddedLater']);
    // …and naming it volatile is what it takes to stop watching it — a deliberate act.
    expect(compareRuns(withNewField, withNewFieldMoved, [...VOLATILE_RECEIPT_FIELDS, 'aFieldAddedLater']))
      .toEqual([]);

    // AN EMPTY SEQUENCE IS A FINDING, NOT A PASS. Two receipts with no hashes at all
    // would compare equal and certify nothing.
    expect(compareRuns(receipt({ yearlyHashes: [] }), receipt({ yearlyHashes: [] })))
      .toContain('yearly hash sequence is empty on one side — the comparison would be vacuous');
  });

  it('THE SUBSTRATE — archives only, and an archive inside a repository is REFUSED', () => {
    const plan = archivePlan({ tip: 'abc123', directory: '/scratch/soak-abc123' });
    expect(plan.map((step) => step.argv[0])).toEqual(['git', 'tar', 'npm']);
    expect(plan[0].argv).toEqual(['git', 'archive', '--format=tar', 'abc123']);
    // The archive installs from its OWN lockfile, so a dependency bump cannot silently
    // change the substrate a replay runs on (the recorded mint-trigger law).
    expect(plan[2].argv).toEqual(['npm', 'ci', '--ignore-scripts']);
    for (const step of plan) expect(step.why.length).toBeGreaterThan(20);

    // ⛔ THE CONDITIONAL LIE MODE. `git rev-parse` SUCCEEDING is the failure: it means
    // the extraction landed inside some repository, where source identity would be
    // computed from THAT repository's index while the files come from the archive.
    const inside = assertOutsideRepository('/anywhere', () => '/some/other/repo\n');
    expect(inside.length).toBe(1);
    expect(inside[0]).toContain('is inside the git repository at /some/other/repo');
    // The THROW is the pass — that is what "outside any repository" looks like from
    // inside a process.
    expect(assertOutsideRepository('/anywhere', () => { throw new Error('not a git repository'); })).toEqual([]);

    const identity = runIdentity({
      tip: 'abc123', profile: 'cert-30', horizon: 30, scale: 4,
      startedAtIso: '2026-08-16T00:00:00.000Z',
    });
    expect(identity.sourceSha).toBe('abc123');
    expect(identity.substrate).toBe('git-archive');
  });
});
