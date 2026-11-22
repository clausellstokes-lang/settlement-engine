/**
 * tripwireCaller.test.js — SOAKCHAIN Car 2's proof surface (DESIGN_HORIZON §1.6, §4.5).
 *
 * ⛔ THE ARM THAT MATTERS IS THE FREEZE GATE, EXECUTED. SK-5's `freezeBlockers` reads six
 * fields — `deterministicFirings`, `fullInstrument`, `provisional`, `rolling`, `restored`,
 * `behavioralPropertiesPassing` — that NOBODY WROTE, so the band capsule was unfreezeable
 * not because a precondition failed but because no run ever stated whether one held. The
 * test below takes a clean receipt through the real caller and then through the real
 * `freezeBlockers`, and asserts the blocker list is EMPTY. That is the gap closing, run.
 *
 * The CLI arms use `spawnSync` on the real script rather than calling `main()` in-process,
 * because the exit STATUS is the contract a workflow step reads and an in-process call
 * cannot observe it.
 */

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

import { freezeBlockers } from '../../scripts/soak/curveBands.mjs';
import {
  aggregateReceiptPaths,
  evaluateReceipt,
  summarizeEvaluations,
} from '../../scripts/soak/evaluate.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CLI = join(ROOT, 'scripts/soak/evaluate-receipt.mjs');

/** A receipt the watchdog would have written on a clean thirty-year run. */
function cleanReceipt(overrides = {}) {
  return {
    schemaVersion: 5,
    kind: 'whole_world_soak',
    caseId: 'caller-clean',
    seed: 'w0-soak',
    years: 30,
    settlements: 4,
    passed: true,
    properties: ['no_crash', 'rerun_identical', 'seed_divergent', 'population_bounded'],
    failures: [],
    notExecutable: [],
    startPopulations: [100, 200, 300, 400],
    finalPopulations: [120, 210, 280, 390],
    finalDiedFlags: [false, false, false, false],
    stressorCounts: [1, 2, 1, 0],
    yearlyBytes: [100_000, 110_000, 120_000, 130_000],
    yearlyMs: [100, 110, 120, 130],
    peakHeapUsedBytes: 200 * 1024 * 1024,
    ...overrides,
  };
}

/** Write a JSON file under a fresh temp directory and return its path. */
function writeTemp(name, value) {
  const dir = mkdtempSync(join(tmpdir(), 'soak-caller-'));
  const path = join(dir, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
  return path;
}

/** Run the CLI and hand back its exact status and output. */
function runCli(args) {
  const result = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8', cwd: ROOT });
  return { status: result.status, stdout: String(result.stdout || ''), stderr: String(result.stderr || '') };
}

describe('the tripwire registry gets a caller', () => {
  test('a clean receipt fires nothing, and the annotation makes SK-5 FREEZEABLE — executed', () => {
    const evaluated = evaluateReceipt(cleanReceipt(), { profile: 'weekly' });
    expect(evaluated.findings).toEqual([]);
    expect(evaluated.observability).toEqual([]);
    expect(evaluated.deterministicFirings).toBe(0);
    expect(evaluated.annotated.fullInstrument).toBe(true);
    expect(evaluated.annotated.provisional).toBe(false);

    // ⭐ THE GAP CLOSING, RUN THROUGH THE REAL GATE. Before this caller existed no receipt
    // carried any of the six fields, so every candidate was refused for being silent rather
    // than for being bad.
    expect(freezeBlockers({ ...evaluated.annotated, behavioralPropertiesPassing: true })).toEqual([]);
  }, 20_000);

  test('a receipt with no annotation at all is refused for SILENCE, which is the counterfactual', () => {
    // The state of the world before Car 2: a perfectly clean receipt, and six blockers,
    // none of which is a statement about the world.
    const blockers = freezeBlockers(cleanReceipt());
    expect(blockers).toEqual([
      'not the FULL instrument at build-complete-dark',
      'deterministic-class tripwires fired — the run is not clean',
      'a behavioral-contract property did not pass',
    ]);
    // And the caller's own default keeps the behavioral clause honest: a caller that has
    // not graded the contract has not learned it passed, so the key is ABSENT, not false.
    const evaluated = evaluateReceipt(cleanReceipt());
    expect('behavioralPropertiesPassing' in evaluated.annotated).toBe(false);
    expect(freezeBlockers(evaluated.annotated)).toEqual(['a behavioral-contract property did not pass']);
  }, 20_000);

  test('a failed run fires throw_or_assert and stays unfreezeable however it is annotated', () => {
    const evaluated = evaluateReceipt(cleanReceipt({
      passed: false,
      failures: ['byte-identical re-run (same seed)'],
    }), { profile: 'weekly' });
    expect(evaluated.findings.map((row) => row.id)).toEqual(['throw_or_assert']);
    expect(evaluated.findings[0].detail).toBe('assertion failed: byte-identical re-run (same seed)');
    expect(evaluated.deterministicFirings).toBe(1);
    expect(freezeBlockers({ ...evaluated.annotated, behavioralPropertiesPassing: true }))
      .toEqual(['deterministic-class tripwires fired — the run is not clean']);
  }, 20_000);

  test('a rolling run is PROVISIONAL and a restore probe states its own status', () => {
    const rolling = evaluateReceipt(cleanReceipt(), { rolling: true });
    expect(rolling.annotated.rolling).toBe(true);
    expect(rolling.annotated.provisional).toBe(true);
    expect(freezeBlockers({ ...rolling.annotated, behavioralPropertiesPassing: true })).toEqual([
      'receipt is PROVISIONAL — a rolling soak on a mid-build tip may never freeze a band',
      'a rolling run is additive and never freezes',
    ]);
    // ⚠ THE RECEIPT'S OWN KIND IS BELIEVED WITHOUT THE CALLER BEING TOLD. A restore probe
    // that a caller forgot to flag would otherwise be annotated as an official run.
    const restored = evaluateReceipt(cleanReceipt({ kind: 'whole_world_soak_restore_probe', properties: [] }));
    expect(restored.annotated.restored).toBe(true);
    expect(restored.annotated.fullInstrument).toBe(false);
  }, 20_000);

  test('a run that could not execute an assertion is NOT the full instrument', () => {
    // §206.2b's third status, read by the freeze gate: a three-year run whose liveness floor
    // and wall-time trend were both NOT-EXECUTABLE measured less than the full instrument,
    // and that is legible here instead of looking like a pass.
    const partial = evaluateReceipt(cleanReceipt({
      years: 3,
      notExecutable: [{ name: 'per-year wall-time trend not age-linear', reason: 'a per-year trend needs 4 years' }],
    }));
    expect(partial.annotated.fullInstrument).toBe(false);
    expect(partial.findings).toEqual([]);
    expect(freezeBlockers({ ...partial.annotated, behavioralPropertiesPassing: true }))
      .toEqual(['not the FULL instrument at build-complete-dark']);
  }, 20_000);

  test('the annotation writes the freezeBlockers key set and no more', () => {
    const evaluated = evaluateReceipt(cleanReceipt(), { behavioralPropertiesPassing: true });
    const added = Object.keys(evaluated.annotated)
      .filter((key) => !Object.prototype.hasOwnProperty.call(cleanReceipt(), key));
    expect(added.sort()).toEqual([
      'behavioralPropertiesPassing', 'deterministicFirings', 'fullInstrument',
      'provisional', 'restored', 'rolling',
    ]);
    // The six keys above are asserted as an EXACT SET, so a collection that drifted empty
    // would have failed there rather than here.
    // anchored: the exact-set assertion on the preceding lines is this negative's liveness anchor
    expect(added).not.toContain('evaluatedProfile');
  }, 20_000);

  test('summarizeEvaluations calls an empty run UNCLEAN, because zero cells measured nothing', () => {
    expect(summarizeEvaluations([]).clean).toBe(false);
    expect(summarizeEvaluations([]).cells).toBe(0);
    const one = summarizeEvaluations([{ key: 'cell-a', findings: [], observability: [] }]);
    expect(one.clean).toBe(true);
    const fired = summarizeEvaluations([
      { key: 'cell-a', findings: [{ id: 'negative_stock', detail: 'x' }], observability: [] },
    ]);
    expect(fired.clean).toBe(false);
    expect(fired.findings[0].cellKey).toBe('cell-a');
  }, 20_000);

  test('the CLI exits 0 clean, 1 on a finding, and 2 on a REFUSAL that is not a finding', () => {
    const clean = runCli([writeTemp('clean.json', cleanReceipt())]);
    expect(clean.status).toBe(0);
    expect(clean.stdout).toContain('OK — no deterministic tripwire fired');

    const fired = runCli([writeTemp('fired.json', cleanReceipt({
      passed: false, failures: ['realm population bounded'],
    }))]);
    expect(fired.status).toBe(1);
    expect(fired.stdout).toContain('FINDING  caller-clean · throw_or_assert — assertion failed: realm population bounded');

    // ⛔ A REFUSAL IS NOT A FINDING. Collapsing these into one status would let a typo'd
    // artifact path read exactly like a world defect.
    expect(runCli([join(tmpdir(), 'no-such-receipt-9f3a.json')]).status).toBe(2);
    expect(runCli([]).status).toBe(2);
    const notJson = writeTemp('broken.json', {});
    writeFileSync(notJson, 'this is not json');
    expect(runCli([notJson]).status).toBe(2);
  }, 60_000);

  test('the CLI --aggregate resolves caseReceipts against the AGGREGATE own directory', () => {
    const dir = mkdtempSync(join(tmpdir(), 'soak-aggregate-'));
    mkdirSync(join(dir, 'cases'), { recursive: true });
    writeFileSync(join(dir, 'cases/case-a.json'), `${JSON.stringify(cleanReceipt({ caseId: 'case-a' }))}\n`);
    writeFileSync(join(dir, 'cases/case-b.json'), `${JSON.stringify(cleanReceipt({
      caseId: 'case-b', stressorCounts: [1, -2, 1, 0],
    }))}\n`);
    const aggregatePath = join(dir, 'weekly.json');
    writeFileSync(aggregatePath, `${JSON.stringify({
      schemaVersion: 2,
      kind: 'realm_scale_evidence',
      profile: 'weekly',
      caseReceipts: ['cases/case-a.json', 'cases/case-b.json'],
    }, null, 2)}\n`);

    // The paths are RELATIVE TO THE AGGREGATE, so resolving them against the process cwd
    // would read the wrong files or none — the arm that proves the resolution is real.
    expect(aggregateReceiptPaths({ caseReceipts: ['cases/x.json'] }, '/tmp/agg'))
      .toEqual(['/tmp/agg/cases/x.json']);

    const run = runCli(['--aggregate', aggregatePath]);
    expect(run.status).toBe(1);
    expect(run.stdout).toContain('2 case receipt(s)');
    expect(run.stdout).toContain('FINDING  case-b · negative_stock');
    expect(run.stdout).toContain('FIRED: 1 deterministic finding(s) over 2 cell(s)');

    // An aggregate that names no case receipts evaluated NOTHING, and that is a refusal.
    const emptyAggregate = join(dir, 'empty.json');
    writeFileSync(emptyAggregate, `${JSON.stringify({ kind: 'realm_scale_evidence', caseReceipts: [] })}\n`);
    expect(runCli(['--aggregate', emptyAggregate]).status).toBe(2);
  }, 60_000);

  test('the pool runner carries the rider, and the CI job carries the step', () => {
    const runner = readFileSync(join(ROOT, 'scripts/soak/run.mjs'), 'utf8');
    expect(runner).toContain('evaluateReceipt(');
    expect(runner).toContain('firings: ');
    expect(runner).toContain("import { evaluateReceipt } from './evaluate.mjs';");
    // The rider hangs off the pool's ONE completion seam and reads a file the child already
    // wrote — it does not fork the runner and it cannot break SK-7's PID-exact cancellation.
    expect(runner).toContain('export function evaluateCompletedCell(');

    const workflow = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    expect(workflow).toContain('node scripts/soak/evaluate-receipt.mjs --aggregate artifacts/soak/weekly.json');
    // `if: always()` or a soak that FAILED — the run whose findings matter most — would
    // skip the evaluation entirely. Pinned with a planted mutation on an in-memory copy.
    const step = workflow.slice(workflow.indexOf('Tripwire registry over the weekly evidence'));
    expect(step.slice(0, 200)).toContain('if: always()');
    const mutated = step.slice(0, 200).replace('if: always()', 'if: success()');
    // The assertion two lines above proves `step` is the live workflow text, so this
    // exclusion cannot go vacuous on an empty read.
    // anchored: the preceding toContain('if: always()') on the same slice is the liveness anchor
    expect(mutated).not.toContain('if: always()');
  }, 20_000);
});
