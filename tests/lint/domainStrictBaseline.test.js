/**
 * domainStrictBaseline.test.js — A+ domain.7 ratchet pin.
 *
 * tsconfig.domain-strict.json turns strict + noImplicitAny ON over the domain
 * kernel; scripts/check-domain-strict.mjs pins the current per-file error count
 * as a ceiling and fails the gate on any regression. This pin keeps the baseline
 * + its wiring HONEST:
 *   - the strict config actually flips both strictness knobs;
 *   - the baseline's `total` equals the sum of its per-file counts (no drift);
 *   - the ratchet is wired into `npm run check` (so a strict regression reds the gate);
 *   - the committed ceiling never rises (you may burn it down, never pad it).
 *
 * The 4649-error baseline IS the burn-down worklist — every non-zero entry is a
 * domain file still owed strict @param/shape annotations.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CEILING = 4649; // committed max strict-error count — lower as the domain is annotated; never raise

const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.domain-strict-baseline.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const strictCfg = JSON.parse(readFileSync(join(ROOT, 'tsconfig.domain-strict.json'), 'utf8'));

describe('domain strict-typecheck ratchet (A+ domain.7)', () => {
  test('the strict config flips strict + noImplicitAny on the domain', () => {
    expect(strictCfg.compilerOptions.strict).toBe(true);
    expect(strictCfg.compilerOptions.noImplicitAny).toBe(true);
    expect(strictCfg.extends).toBe('./tsconfig.json');
  });

  test("baseline.total equals the sum of its per-file counts (no stale drift)", () => {
    const sum = Object.values(baseline.files).reduce((a, b) => a + b, 0);
    expect(baseline.total).toBe(sum);
  });

  test('every baselined file is a src/domain file with a positive count', () => {
    for (const [file, n] of Object.entries(baseline.files)) {
      expect(file.startsWith('src/domain/'), `${file} is outside the domain`).toBe(true);
      expect(n, `${file} has a non-positive baseline`).toBeGreaterThan(0);
    }
  });

  test('the ratchet is wired into `npm run check`', () => {
    expect(pkg.scripts['typecheck:domain:strict']).toContain('check-domain-strict.mjs');
    expect(pkg.scripts.check).toContain('typecheck:domain:strict');
  });

  test('CI enforces the strict ratchet too (finding F35 — CI must not diverge from the local gate)', () => {
    const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    expect(ci, 'ci.yml must run the strict ratchet').toContain('typecheck:domain:strict');
    // Deploy must be gated behind the full green gate (no green, no deploy).
    // Subset assertion, not an exact list: ADDING gates (e.g. coverage-floors)
    // strengthens the deploy gate and must never fail this pin; only REMOVING
    // one of the required three should.
    expect(ci).toMatch(/deploy:/);
    const needs = ci.match(/deploy:[\s\S]*?needs:\s*\[([^\]]+)\]/);
    expect(needs, 'deploy job must declare needs').toBeTruthy();
    const gates = needs[1].split(',').map((s) => s.trim());
    for (const required of ['check', 'e2e', 'deno-tests']) {
      expect(gates, `deploy must be gated on ${required}`).toContain(required);
    }
  });

  test('the committed strict-error ceiling never rises (ratchet is monotone-down)', () => {
    expect(baseline.total).toBeLessThanOrEqual(CEILING);
  });
});
