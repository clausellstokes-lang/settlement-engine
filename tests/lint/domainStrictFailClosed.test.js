/**
 * domainStrictFailClosed.test.js — the ratchet must fail CLOSED when tsc can't run.
 *
 * scripts/check-domain-strict.mjs folds tsc's stdout+stderr into one string and
 * counts the `error TSxxxx` lines. A tsc that FAILS TO RUN (bad config, missing
 * binary, OOM) exits non-zero with no parseable diagnostics — which used to count
 * as zero errors, read as "no regressions", and GREEN the gate on a broken
 * typecheck. These reproduce that failure mode via the DOMAIN_STRICT_TSC_CMD
 * override and assert the script now exits non-zero instead.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = join(ROOT, 'scripts/check-domain-strict.mjs');

function run(tscCmd) {
  return spawnSync('node', [SCRIPT], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, DOMAIN_STRICT_TSC_CMD: tscCmd },
  });
}

describe('check-domain-strict fails closed on tsc execution failure', () => {
  it('exits non-zero when tsc cannot run (non-zero exit, no parseable diagnostics)', () => {
    // A command that exits non-zero with output that carries no `error TSxxxx`
    // line — exactly what a failed-to-run tsc looks like. Pre-fix this counted
    // zero errors and exited 0 (false green).
    const r = run('node -e "console.error(\'Cannot find module typescript\'); process.exit(1)"');
    expect(r.status).not.toBe(0);
    expect(`${r.stdout}${r.stderr}`).toMatch(/failed to run|failing closed/i);
  });

  it('exits non-zero on a hard crash with no diagnostics at all', () => {
    // OOM / segfault shape: non-zero exit, empty output, zero domain errors.
    const r = run('node -e "process.exit(137)"');
    expect(r.status).not.toBe(0);
  });

  it('does NOT fail closed when tsc actually ran and emitted a real diagnostic', () => {
    // A genuine type-error run: non-zero exit but a parseable `error TSxxxx`
    // line present. This must take the normal ratchet path, not the fail-closed
    // path — proves the guard distinguishes "ran with errors" from "didn't run".
    const fakeErr = 'src/somewhere.ts(1,1): error TS2304: Cannot find name foo.';
    const r = run(`node -e "console.log('${fakeErr}'); process.exit(1)"`);
    expect(`${r.stdout}${r.stderr}`).not.toMatch(/failed to run/i);
  });
});
