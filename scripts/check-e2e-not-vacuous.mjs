#!/usr/bin/env node
/**
 * check-e2e-not-vacuous.mjs — CI anti-vacuity ratchet for the Playwright gate.
 *
 * The trust bug this guards against: a REQUIRED CI check counted GREEN while
 * running ZERO assertions. Concretely, the "Audit mobile pointer targets" step
 * ran `playwright test … --project=mobile-safari` and Playwright exits 0 even
 * when every test was SKIPPED (the mobile spec carries a
 * `test.skip(({ isMobile }) => !isMobile)` guard, so a fat-fingered/renamed
 * project — e.g. `--project=chromium` — silently skips all of it and still exits
 * 0). The step turned green having launched no real assertion.
 *
 * This script is the ratchet. Two enforcement modes, both fail-CLOSED:
 *
 *   --list             Static guard. Parses `playwright test --list
 *                      --reporter=json` and asserts every project named on the
 *                      command line resolves to >0 discovered specs. Catches a
 *                      renamed/typo'd project, a moved spec file, a testDir
 *                      change — anything that would make discovery vacuous.
 *
 *   --results <file>   Runtime guard. Parses a Playwright JSON report and
 *                      asserts the run actually EXECUTED tests: stats.expected
 *                      (the passed/real count) must be >0 and the run must not be
 *                      all-skipped. This is the one that catches the live bug —
 *                      `expected:0, skipped:N` (every test skipped) is a hard
 *                      failure here even though Playwright itself exited 0.
 *
 * The pure decision functions are exported so a vitest test can exercise the
 * real logic against forged JSON (mirrors decideDeploy in scripts/
 * vercel-ignore-build.mjs). The CLI is a thin shell around them.
 *
 * Wired into .github/workflows/ci.yml's e2e job (after each Playwright step) so
 * no future Playwright job can be green-on-nothing.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

/**
 * @typedef {{ ok: boolean, reason: string, byProject: Record<string, number> }} ListVerdict
 */

/**
 * Walk a Playwright `--list --reporter=json` payload and count discovered specs
 * per project. A spec carries one `tests[]` entry per project it runs under, so
 * the per-project tally is the sum of those entries across every spec.
 *
 * @param {any} listJson  Parsed JSON from `playwright test --list --reporter=json`.
 * @param {string[]} requiredProjects  Projects that MUST have >0 specs.
 * @returns {ListVerdict}
 */
export function verifyListedSpecs(listJson, requiredProjects) {
  /** @type {Record<string, number>} */
  const byProject = {};
  /** @param {any} suite */
  const walk = (suite) => {
    for (const spec of suite?.specs || []) {
      for (const t of spec?.tests || []) {
        const p = t?.projectName ?? '';
        byProject[p] = (byProject[p] || 0) + 1;
      }
    }
    for (const child of suite?.suites || []) walk(child);
  };
  for (const suite of listJson?.suites || []) walk(suite);

  const missing = requiredProjects.filter((p) => !(byProject[p] > 0));
  if (missing.length) {
    return {
      ok: false,
      reason: `no specs discovered for project(s): ${missing.join(', ')} — a renamed/typo'd project or a moved spec would make this step green-on-nothing`,
      byProject,
    };
  }
  return { ok: true, reason: `discovered specs for: ${requiredProjects.join(', ')}`, byProject };
}

/**
 * @typedef {{ ok: boolean, reason: string, stats: { expected: number, skipped: number, unexpected: number, flaky: number } }} ResultsVerdict
 */

/**
 * Assert a Playwright JSON RUN report actually executed real tests. The live bug
 * is an all-skipped run that still exits 0 (`expected:0, skipped:N`). We require:
 *   - stats.expected > 0      (at least one test PASSED for real)
 *   - stats.unexpected === 0  (no failures — belt-and-suspenders; the run's own
 *                              exit code already covers this, but assert it)
 * An all-skipped or zero-execution run is a HARD failure here.
 *
 * @param {any} resultsJson  Parsed JSON from a Playwright run (`--reporter=json`).
 * @returns {ResultsVerdict}
 */
export function verifyRunExecuted(resultsJson) {
  const s = resultsJson?.stats || {};
  const stats = {
    expected: Number(s.expected) || 0,
    skipped: Number(s.skipped) || 0,
    unexpected: Number(s.unexpected) || 0,
    flaky: Number(s.flaky) || 0,
  };
  if (stats.expected <= 0) {
    return {
      ok: false,
      reason:
        `Playwright run executed 0 real tests (expected=${stats.expected}, skipped=${stats.skipped}) — ` +
        'a required check exited green having run ZERO assertions. Refusing to count this as a pass.',
      stats,
    };
  }
  if (stats.unexpected > 0) {
    return { ok: false, reason: `Playwright run had ${stats.unexpected} failing test(s)`, stats };
  }
  return { ok: true, reason: `Playwright run executed ${stats.expected} test(s)`, stats };
}

/**
 * Run `playwright test … --list --reporter=json` and parse it. Isolated so tests
 * can call verifyListedSpecs() directly without spawning a browser toolchain.
 *
 * @param {string[]} playwrightArgs  Args appended after `playwright test`.
 * @returns {any}  Parsed JSON.
 */
function listSpecs(playwrightArgs) {
  const out = execFileSync(
    'npx',
    ['playwright', 'test', ...playwrightArgs, '--list', '--reporter=json'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] },
  );
  return JSON.parse(out);
}

// ── CLI ───────────────────────────────────────────────────────────────────────
// Only run the CLI when invoked directly, not when imported by a test.
const invokedDirectly =
  process.argv[1] && import.meta.url === `file://${process.argv[1]}`;

if (invokedDirectly) {
  const argv = process.argv.slice(2);
  const fail = (msg) => {
    console.error(`E2E anti-vacuity check FAILED: ${msg}`);
    process.exit(1);
  };

  if (argv.includes('--results')) {
    // --results <report.json>  — runtime guard against an all-skipped green run.
    const file = argv[argv.indexOf('--results') + 1];
    if (!file) fail('--results requires a path to a Playwright JSON report');
    let json;
    try {
      json = JSON.parse(readFileSync(file, 'utf8'));
    } catch (e) {
      fail(`could not read/parse Playwright report at ${file}: ${/** @type {Error} */ (e).message}`);
    }
    const verdict = verifyRunExecuted(json);
    if (!verdict.ok) fail(verdict.reason);
    console.log(`E2E anti-vacuity check OK: ${verdict.reason}.`);
  } else {
    // --list mode (default). Everything before `--projects` is passed to
    // Playwright for discovery; `--projects a,b` lists the required projects.
    const projIdx = argv.indexOf('--projects');
    if (projIdx < 0) fail('usage: check-e2e-not-vacuous.mjs <playwright args> --projects <a,b> | --results <report.json>');
    const required = argv[projIdx + 1]?.split(',').map((s) => s.trim()).filter(Boolean) || [];
    if (!required.length) fail('--projects requires at least one project name');
    const playwrightArgs = argv.slice(0, projIdx);
    let json;
    try {
      json = listSpecs(playwrightArgs);
    } catch (e) {
      fail(`could not list Playwright specs: ${/** @type {Error} */ (e).message}`);
    }
    const verdict = verifyListedSpecs(json, required);
    if (!verdict.ok) fail(verdict.reason);
    const summary = required.map((p) => `${p}=${verdict.byProject[p]}`).join(', ');
    console.log(`E2E anti-vacuity check OK: ${summary} spec(s) discovered.`);
  }
}
