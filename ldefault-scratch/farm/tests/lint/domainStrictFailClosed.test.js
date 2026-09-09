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
    expect(`${r.stdout}${r.stderr}`).not.toMatch(/failed to run|failing closed/i);
  });

  it('fails closed on a config-level error with no file location (TS18003 no-inputs shape)', () => {
    // A config-load failure ALSO prints `error TSxxxx:` — so it passes the
    // "did tsc run" sniff — but it carries no `file(line,col):` location and
    // yields zero per-file counts. Pre-fix this greened the gate (baseline 0)
    // on a typecheck that never ran over the domain.
    const fakeErr = 'error TS18003: No inputs were found in config file tsconfig.domain-strict.json.';
    const r = run(`node -e "console.error('${fakeErr}'); process.exit(1)"`);
    expect(r.status).not.toBe(0);
    expect(`${r.stdout}${r.stderr}`).toMatch(/config-level|failing closed/i);
  });

  it('fails closed on a diagnostic located in the tsconfig .json itself (TS5083/syntax shape)', () => {
    // Config syntax errors DO carry a file(line,col) location — but on the
    // .json config, not a source file. Still no typecheck happened, so the
    // gate must fail closed, not count zero domain errors and green.
    const fakeErr = 'tsconfig.domain-strict.json(3,5): error TS1005: expected.';
    const r = run(`node -e "console.error('${fakeErr}'); process.exit(1)"`);
    expect(r.status).not.toBe(0);
    expect(`${r.stdout}${r.stderr}`).toMatch(/config-level|failing closed/i);
  });

  it('does NOT fail closed when real file diagnostics and no config errors are present', () => {
    // Mixed realistic output: several source-file diagnostics, none config-level.
    // Must take the normal ratchet path (here: 0 domain errors vs baseline).
    const lines = [
      'src/somewhere.ts(1,1): error TS2304: Cannot find name foo.',
      'src/other.js(9,2): error TS7006: Parameter x implicitly has an any type.',
    ].join('\\n');
    const r = run(`node -e "console.log('${lines}'); process.exit(1)"`);
    expect(`${r.stdout}${r.stderr}`).not.toMatch(/failed to run|failing closed/i);
  });
});
