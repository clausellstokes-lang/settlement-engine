/**
 * tests/build/ciCheckParity.test.js — `npm run check` ↔ ci.yml parity.
 *
 * The local gate (`npm run check`) and the CI `check` job are hand-maintained
 * DUPLICATES: the package.json `check` script chains the validate/typecheck/lint/
 * test/build steps, and the ci.yml `check` job re-lists the same steps as separate
 * `run: npm run <step>` lines. Nothing tied them together, so a step added to the
 * local gate but forgotten in CI (or vice-versa) would drift silently — a
 * regression could pass `npm run check` locally yet never run in CI, or run in CI
 * while a contributor's local gate skipped it.
 *
 * This pins the parity in BOTH directions for the steps the two surfaces share:
 *   - every `npm run <step>` in the `check` script runs in the ci.yml `check` job;
 *   - every `npm run <step>` in the ci.yml `check` job is in the `check` script.
 * Adding a step to one surface without the other turns this RED.
 *
 * (CI runs MORE than `check` — the post-build vendor-pdf anti-vacuity step, plus
 * the separate e2e and deno-tests jobs. Those are CI-only by design and live
 * outside the `check` job, so this parity is scoped to the `check` job's
 * `npm run` steps, not the whole workflow.)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The `npm run <step>` step names chained in the package.json `check` script. */
function checkScriptSteps() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const check = pkg.scripts.check;
  return check
    .split('&&')
    .map((s) => s.trim())
    .map((s) => s.match(/^npm run (\S+)$/)?.[1])
    .filter(Boolean);
}

/** The `npm run <step>` step names invoked by the ci.yml `check` job. */
function ciCheckJobSteps() {
  const ci = parse(readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8'));
  const steps = ci.jobs.check.steps ?? [];
  const names = [];
  for (const step of steps) {
    const run = typeof step.run === 'string' ? step.run : '';
    // A step's `run:` may itself chain commands; pull every `npm run <step>`.
    for (const m of run.matchAll(/npm run (\S+)/g)) names.push(m[1]);
  }
  return names;
}

describe('npm run check ↔ ci.yml check-job parity', () => {
  it('every `npm run` step in the check script also runs in the ci.yml check job', () => {
    const scriptSteps = checkScriptSteps();
    const ciSteps = new Set(ciCheckJobSteps());
    expect(scriptSteps.length, 'check script should chain npm-run steps').toBeGreaterThan(0);
    for (const step of scriptSteps) {
      expect(
        ciSteps.has(step),
        `local gate runs "npm run ${step}" but the ci.yml check job does not — CI would skip it`,
      ).toBe(true);
    }
  });

  it('every `npm run` step in the ci.yml check job is part of the check script', () => {
    const scriptSteps = new Set(checkScriptSteps());
    const ciSteps = ciCheckJobSteps();
    expect(ciSteps.length, 'ci.yml check job should run npm-run steps').toBeGreaterThan(0);
    for (const step of ciSteps) {
      expect(
        scriptSteps.has(step),
        `ci.yml check job runs "npm run ${step}" but the local check script does not — local gate would skip it`,
      ).toBe(true);
    }
  });
});
