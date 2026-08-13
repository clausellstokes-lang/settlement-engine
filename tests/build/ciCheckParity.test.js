/**
 * tests/build/ciCheckParity.test.js — `npm run check` ↔ parallel CI parity.
 *
 * The local gate (`npm run check`) is fail-fast. CI fans the same evidence into
 * independent validation/type/lint/test/build jobs and joins them behind the one
 * required `check` aggregate. The duplication remains machine-pinned here.
 *
 * This pins the parity in BOTH directions for the steps the two surfaces share:
 *   - every `npm run <step>` in the local chain appears in exactly one gate group;
 *   - every group step is in the local chain;
 *   - the required aggregate needs every group and runs even after a failed need.
 * Adding a step to one surface without the other turns this RED.
 *
 * Other CI-only jobs remain outside this parity surface.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { checkStepsFromPackage } from '../../scripts/implementation-gate.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const GATE_JOB_IDS = [
  'check-validation',
  'check-types',
  'check-lint',
  'check-tests',
  'check-build',
];

/** The `npm run <step>` step names chained in the package.json `check` script. */
function checkScriptSteps() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  return checkStepsFromPackage(pkg);
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
  const headerIdx = lines.findIndex((l) => (
    new RegExp(`^  ${jobName}:\\s*(?:#.*)?$`).test(l)
  ));
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

/** Extract only executable `run:` values, including YAML block scalars. */
function runCommands(job) {
  if (typeof job !== 'string') return [];
  const lines = job.split('\n');
  const commands = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = /^(\s*)(?:-\s*)?run:\s*(.*?)\s*$/.exec(lines[index]);
    if (!match) continue;
    const value = match[2];
    if (!/^[|>][+-]?$/.test(value)) {
      commands.push(value);
      continue;
    }

    const parentIndent = match[1].length;
    const block = [];
    let cursor = index + 1;
    for (; cursor < lines.length; cursor += 1) {
      const line = lines[cursor];
      const indentation = line.match(/^ */)[0].length;
      if (line.trim() && indentation <= parentIndent) break;
      block.push(line.trimStart());
    }
    commands.push(block.join('\n'));
    index = cursor - 1;
  }
  return commands;
}

/** Read unconditional npm-run segments from actual shell command bodies. */
function npmRunStepsFromJob(job) {
  const names = [];
  for (const command of runCommands(job)) {
    const runnable = command
      .split('\n')
      .map((line) => (/^\s*#/.test(line) ? '' : line.replace(/\s+#.*$/, '')))
      .join('\n');
    for (const match of runnable.matchAll(
      /(?:^|&&|;|\n)\s*npm run ([A-Za-z0-9:_-]+)(?=\s|$)/g,
    )) names.push(match[1]);
  }
  return names;
}

/** Direct phase commands bypass package-script ownership and are never allowed in gate jobs. */
function directGateCommandsFromJob(job) {
  const escapes = [];
  for (const command of runCommands(job)) {
    const runnable = command
      .split('\n')
      .map((line) => (/^\s*#/.test(line) ? '' : line.replace(/\s+#.*$/, '')))
      .join('\n');
    for (const segment of runnable.split(/&&|\|\||;|\n|\|/)) {
      const direct = segment.trim();
      if (
        /^(?:(?:npx|npm\s+exec)\s+)?vitest\b/.test(direct)
        || /^(?:(?:npx|npm\s+exec)\s+)?vite\s+build\b/.test(direct)
        || /^node\s+scripts\/check-test-ratchet\.mjs\b/.test(direct)
      ) escapes.push(direct);
    }
  }
  return escapes;
}

/**
 * The `npm run <step>` names invoked by the parallel CI gate groups.
 *
 * A step's `run:` may chain commands, and CI runs MORE than `npm run` steps in
 * the check job (e.g. `npm ci` and `npm audit …`). We pull only the
 * `npm run <step>` tokens,
 * matching what the package.json `check` script chains — `npm ci` / `npm audit`
 * are intentionally excluded (they are `npm ci`/`npm audit`, not `npm run <x>`).
 */
function ciCheckJobSteps() {
  const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
  const bodies = GATE_JOB_IDS.map((jobName) => {
    const body = jobBody(ci, jobName);
    expect(body, `ci.yml must declare a top-level ${jobName} job`).toBeTruthy();
    return body;
  });
  return bodies.flatMap(npmRunStepsFromJob);
}

describe('npm run check ↔ parallel ci.yml gate parity', () => {
  it('every local step runs exactly once across the parallel gate jobs', () => {
    const scriptSteps = checkScriptSteps();
    const ciSteps = ciCheckJobSteps();
    expect(scriptSteps.length, 'check script should chain npm-run steps').toBeGreaterThan(0);
    expect(new Set(scriptSteps).size, 'local check must not duplicate a step').toBe(scriptSteps.length);
    for (const step of scriptSteps) {
      expect(
        ciSteps.filter((candidate) => candidate === step),
        `local gate step "npm run ${step}" must occur exactly once in parallel CI`,
      ).toHaveLength(1);
    }

    const sourceIndex = scriptSteps.indexOf('test:ratchet');
    const buildIndex = scriptSteps.indexOf('build');
    const distIndex = scriptSteps.indexOf('verify:dist');
    expect(sourceIndex, 'local source-test phase must be present').toBeGreaterThanOrEqual(0);
    expect(sourceIndex, 'local source tests must run before artifact construction').toBeLessThan(buildIndex);
    expect(buildIndex, 'local build must run before strict dist verification').toBeLessThan(distIndex);

    const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    const testsSteps = npmRunStepsFromJob(jobBody(ci, 'check-tests'));
    const buildSteps = npmRunStepsFromJob(jobBody(ci, 'check-build'));
    expect(testsSteps.filter((step) => ['test', 'test:ratchet', 'build', 'verify:dist'].includes(step)))
      .toEqual(['test:ratchet']);
    expect(buildSteps.filter((step) => ['test', 'test:ratchet', 'build', 'verify:dist'].includes(step)))
      .toEqual(['build', 'verify:dist']);
    expect(
      directGateCommandsFromJob(jobBody(ci, 'check-tests')),
      'check-tests must not bypass source-phase ownership with a raw/direct runner or build',
    ).toEqual([]);
    expect(
      directGateCommandsFromJob(jobBody(ci, 'check-build')),
      'check-build must reach build and strict dist only through their package scripts',
    ).toEqual([]);
  });

  it('every parallel gate step is part of the local check script', () => {
    const scriptSteps = new Set(checkScriptSteps());
    const ciSteps = ciCheckJobSteps();
    expect(ciSteps.length, 'parallel gate jobs should run npm-run steps').toBeGreaterThan(0);
    for (const step of ciSteps) {
      expect(
        scriptSteps.has(step),
        `parallel CI runs "npm run ${step}" but the local gate does not`,
      ).toBe(true);
    }
  });

  it('the required aggregate needs every group and cannot be skipped by a failed need', () => {
    const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    const aggregate = jobBody(ci, 'check');
    expect(aggregate).toBeTruthy();
    expect(aggregate).toMatch(/name:\s*Validate, test, build/);
    expect(aggregate).toMatch(/if:\s*always\(\)/);

    const needs = aggregate.match(/^\s*needs:\s*\[([^\]]+)\]\s*$/m)?.[1]
      .split(',').map((id) => id.trim());
    expect(needs, 'aggregate must have one explicit needs list').toEqual(GATE_JOB_IDS);

    const resultBindings = [...aggregate.matchAll(
      /^\s+([A-Z][A-Z0-9_]+):\s*\$\{\{\s*needs\.([A-Za-z0-9_-]+)\.result\s*\}\}\s*$/gm,
    )].map((match) => ({ env: match[1], job: match[2] }));
    expect(resultBindings.map(({ job }) => job)).toEqual(GATE_JOB_IDS);
    const aggregateRuns = runCommands(aggregate).join('\n');
    for (const { env } of resultBindings) {
      expect(aggregateRuns, `${env} must be consumed by the aggregate verdict`).toContain(`"$${env}"`);
    }
    expect(aggregateRuns).toMatch(/test "\$result" = success \|\| exit 1/);
  });

  it('derives parity only from executable run fields', () => {
    const synthetic = [
      '    name: npm run name-only',
      '    env:',
      '      NOTE: npm run env-only',
      '    steps:',
      '      # npm run comment-only',
      '      - run: npm run real-one',
      '      - run: |',
      '          echo "npm run quoted-only"',
      '          npm run real-two && npm run real-three',
    ].join('\n');
    expect(npmRunStepsFromJob(synthetic)).toEqual(['real-one', 'real-two', 'real-three']);

    const directEscapes = [
      '    steps:',
      '      - run: npx vitest run tests/build/',
      '      - run: vite build',
      '      - run: node scripts/check-test-ratchet.mjs --verify-dist',
    ].join('\n');
    expect(directGateCommandsFromJob(directEscapes)).toEqual([
      'npx vitest run tests/build/',
      'vite build',
      'node scripts/check-test-ratchet.mjs --verify-dist',
    ]);
  });

  it('gives the measured full-suite ratchet enough CI timeout headroom', () => {
    const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    const testsJob = jobBody(ci, 'check-tests');
    expect(testsJob).toMatch(/^\s*timeout-minutes:\s*30\s*$/m);
  });

  it('every setup-node use reads the repository runtime pin', () => {
    const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    const setupCount = (ci.match(/uses:\s*actions\/setup-node@/g) || []).length;
    const pinCount = (ci.match(/node-version-file:\s*['"]?\.nvmrc/g) || []).length;
    // LIVENESS ANCHOR. Both the absence below and the equality at the end are satisfied
    // by an EMPTY workflow (no literal versions, and 0 === 0), so the whole test would
    // survive ci.yml being renamed away. Prove the file really sets Node up first.
    expect(setupCount).toBeGreaterThan(0);
    // anchored: the workflow is proven live and setup-node-bearing by the count above
    expect(ci).not.toMatch(/node-version:\s*['"]?\d/);
    expect(pinCount).toBe(setupCount);
  });
});
