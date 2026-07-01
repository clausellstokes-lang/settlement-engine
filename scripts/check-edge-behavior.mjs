#!/usr/bin/env node
/**
 * check-edge-behavior.mjs — the pre-push edge-function gate step.
 *
 * `npm run check` deliberately EXCLUDES the Deno edge tests to stay in lockstep with
 * the CI `check` job (tests/build/ciCheckParity). So the only behavioral proof of the
 * money/auth edge path (signature verification, spend/refund, admin authz) used to
 * live solely in CI's separate deno-tests job. The husky pre-push hook ran
 * `deno task test:edge` inline but NOT the type-check. This script — invoked by
 * pre-push — consolidates both legs: `deno task check:edge` (type-check the production
 * sources) + `deno task test:edge` (execute the behavioral suite), so a broken edge
 * function is caught before it leaves the machine.
 *
 * Fail-OPEN on a missing toolchain, by design: a contributor without deno installed
 * is not blocked — it SKIPS with a loud notice, and CI's deno-tests job still gates
 * the actual deploy. So it strengthens the pre-push gate for anyone with deno without
 * breaking anyone without it.
 */
import { spawnSync } from 'node:child_process';

function hasDeno() {
  const probe = spawnSync('deno', ['--version'], { stdio: 'ignore' });
  return !probe.error && probe.status === 0;
}

if (!hasDeno()) {
  console.warn('[check:edge-behavior] deno not found on PATH — SKIPPING edge behavioral tests.');
  console.warn('[check:edge-behavior] Install deno to run them locally; CI\'s deno-tests job still gates deploy.');
  process.exit(0);
}

for (const task of ['check:edge', 'test:edge']) {
  const r = spawnSync('deno', ['task', task], { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`\n[check:edge-behavior] \`deno task ${task}\` FAILED — edge behavior is broken.`);
    process.exit(r.status || 1);
  }
}
console.log('[check:edge-behavior] edge behavioral tests passed.');
