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

/**
 * Slice ci.yml down to the body of ONE top-level job by name.
 *
 * We parse the YAML with targeted string scanning rather than importing a YAML
 * package: `yaml` is not a declared dependency, so importing it made this
 * load-bearing parity test depend on an undeclared module (it happened to
 * resolve transitively). We only need the `run:` lines of the `check` job's
 * steps, which is cheap to extract by hand.
 *
 * Jobs are the 2-space-indented keys under `jobs:` (e.g. `  check:`). A job's
 * body runs from its header line until the next line indented ≤ 2 spaces that
 * isn't blank/comment — i.e. the next job header. This isolates the `check`
 * job from the sibling `e2e` / `deno-tests` / `redeploy` jobs so their commands
 * never bleed into the parity check.
 */
function jobBody(yaml, jobName) {
  const lines = yaml.split('\n');
  const headerIdx = lines.findIndex((l) => new RegExp(`^  ${jobName}:\\s*$`).test(l));
  if (headerIdx === -1) return null;
  const body = [];
  for (let i = headerIdx + 1; i < lines.length; i += 1) {
    const line = lines[i];
    // A non-blank line indented by 2 spaces or fewer starts the next job.
    if (line.trim() !== '' && /^ {0,2}\S/.test(line)) break;
    body.push(line);
  }
  return body.join('\n');
}

/**
 * The `npm run <step>` step names invoked by the ci.yml `check` job.
 *
 * A step's `run:` may chain commands, and CI runs MORE than `npm run` steps in
 * the check job (e.g. `npm ci`, `npm audit …`, and the post-build
 * `npx vitest …` anti-vacuity step). We pull only the `npm run <step>` tokens,
 * matching what the package.json `check` script chains — `npm ci` / `npm audit`
 * are intentionally excluded (they are `npm ci`/`npm audit`, not `npm run <x>`),
 * as is the `npx vitest` post-build step, which is CI-only by design.
 */
function ciCheckJobSteps() {
  const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
  const body = jobBody(ci, 'check');
  expect(body, 'ci.yml must declare a top-level `check:` job').toBeTruthy();
  // Strip comments so a `# … npm run check …` doc-comment can't be mistaken for
  // an executed step. None of the real `run:` commands contain a literal `#`,
  // so dropping full-line comments and trailing ` #…` is safe here: a full-line
  // comment (first non-space char `#`) becomes empty; a trailing ` #…` is cut.
  const runnable = body
    .split('\n')
    .map((line) => {
      if (/^\s*#/.test(line)) return '';
      return line.replace(/\s+#.*$/, '');
    })
    .join('\n');
  const names = [];
  // `npm run <step>` — the step name is the first bare token after `run`.
  // `run:` chains (`&&`) and multi-line `run: |` blocks are both covered
  // because matchAll scans the whole job body, not a single line.
  for (const m of runnable.matchAll(/\bnpm run ([A-Za-z0-9:_-]+)/g)) names.push(m[1]);
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
