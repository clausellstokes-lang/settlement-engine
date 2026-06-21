/**
 * tests/build/e2eNotVacuous.test.js — the CI anti-vacuity ratchet's own test.
 *
 * The #1 trust bug the A+ review pinned: a REQUIRED Playwright check counted
 * GREEN while running ZERO assertions (the mobile pointer-target step's
 * `test.skip(!isMobile)` guard means a renamed/typo'd project skips every test
 * and Playwright still exits 0). scripts/check-e2e-not-vacuous.mjs is the ratchet
 * that makes that impossible; this file exercises its REAL decision logic against
 * forged Playwright JSON — including the exact `expected:0, skipped:1` shape the
 * live bug produced — so a regression that re-opens the green-on-nothing hole
 * turns these tests RED.
 *
 * It also pins the CI wiring (ci.yml invokes both guards) so the script can't be
 * left present-but-unwired.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { verifyListedSpecs, verifyRunExecuted } from '../../scripts/check-e2e-not-vacuous.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// A `playwright test --list --reporter=json` payload, abbreviated to the fields
// the verifier reads. Each spec carries one `tests[]` entry per project.
const listJson = (specsPerProject) => ({
  suites: [
    {
      specs: Object.entries(specsPerProject).flatMap(([project, n]) =>
        Array.from({ length: n }, () => ({ tests: [{ projectName: project }] })),
      ),
      suites: [],
    },
  ],
});

describe('verifyListedSpecs — static discovery guard', () => {
  it('passes when every required project resolves to >0 specs', () => {
    const v = verifyListedSpecs(listJson({ chromium: 3, 'mobile-safari': 1 }), ['chromium', 'mobile-safari']);
    expect(v.ok).toBe(true);
    expect(v.byProject['mobile-safari']).toBe(1);
  });

  it('FAILS when a required project discovered ZERO specs (renamed/typo project)', () => {
    // The live failure mode: `--project=mobile-safari` resolves to nothing
    // (renamed project / moved spec) — discovery is vacuous.
    const v = verifyListedSpecs(listJson({ chromium: 3 }), ['chromium', 'mobile-safari']);
    expect(v.ok).toBe(false);
    expect(v.reason).toMatch(/mobile-safari/);
    expect(v.reason).toMatch(/green-on-nothing/);
  });

  it('FAILS on a totally empty discovery (moved testDir)', () => {
    const v = verifyListedSpecs({ suites: [] }, ['chromium']);
    expect(v.ok).toBe(false);
  });

  it('walks nested suites (file → describe → spec)', () => {
    const nested = { suites: [{ suites: [{ specs: [{ tests: [{ projectName: 'chromium' }] }] }] }] };
    expect(verifyListedSpecs(nested, ['chromium']).ok).toBe(true);
  });
});

describe('verifyRunExecuted — runtime execution guard', () => {
  it('passes when the run executed real tests', () => {
    const v = verifyRunExecuted({ stats: { expected: 4, skipped: 0, unexpected: 0, flaky: 0 } });
    expect(v.ok).toBe(true);
  });

  it('FAILS on an all-skipped run that still exited 0 (the EXACT live bug)', () => {
    // This is the precise shape Playwright emits when `test.skip(!isMobile)`
    // fires under the wrong project: expected:0, skipped:1, exit code 0.
    const v = verifyRunExecuted({ stats: { expected: 0, skipped: 1, unexpected: 0, flaky: 0 } });
    expect(v.ok).toBe(false);
    expect(v.reason).toMatch(/0 real tests/);
    expect(v.reason).toMatch(/ZERO assertions/);
  });

  it('FAILS on a zero-everything run (no tests matched but exited 0)', () => {
    expect(verifyRunExecuted({ stats: { expected: 0, skipped: 0, unexpected: 0, flaky: 0 } }).ok).toBe(false);
  });

  it('FAILS when there are unexpected failures (belt-and-suspenders)', () => {
    const v = verifyRunExecuted({ stats: { expected: 2, skipped: 0, unexpected: 1, flaky: 0 } });
    expect(v.ok).toBe(false);
    expect(v.reason).toMatch(/failing/);
  });

  it('tolerates a missing/garbled stats object by failing closed (treats as 0)', () => {
    expect(verifyRunExecuted({}).ok).toBe(false);
    expect(verifyRunExecuted({ stats: {} }).ok).toBe(false);
  });
});

describe('ci.yml wires the anti-vacuity ratchet (script cannot be present-but-unwired)', () => {
  const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');

  it('runs the static discovery guard for both Playwright projects', () => {
    expect(ci).toMatch(/check-e2e-not-vacuous\.mjs[^\n]*--projects chromium/);
    expect(ci).toMatch(/check-e2e-not-vacuous\.mjs[^\n]*--projects mobile-safari/);
  });

  it('runs the runtime guard against the chromium AND mobile JSON reports', () => {
    expect(ci).toMatch(/check-e2e-not-vacuous\.mjs --results playwright-chromium\.json/);
    expect(ci).toMatch(/check-e2e-not-vacuous\.mjs --results playwright-mobile\.json/);
  });

  it('the Playwright steps emit the JSON reports the runtime guard reads', () => {
    expect(ci).toMatch(/PLAYWRIGHT_JSON_OUTPUT_NAME: playwright-chromium\.json/);
    expect(ci).toMatch(/PLAYWRIGHT_JSON_OUTPUT_NAME: playwright-mobile\.json/);
    expect(ci).toMatch(/--reporter=github,json/);
  });
});
