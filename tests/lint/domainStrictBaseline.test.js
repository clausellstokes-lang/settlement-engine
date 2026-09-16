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
 * The baseline IS the burn-down worklist — every non-zero entry is a domain file
 * still owed strict @param/shape annotations.
 */
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
// The burn-down was COMPLETE (Wave B, 2026-07-09): 4,649 → 0 across 133 files,
// golden byte-identical (annotations only). The ceiling was a hard ZERO.
//
// (2026-08-03 — CHAIR RULING R-BLD-9, ONE-TIME re-baseline to MEASURED TRUTH,
// 0 → 1329 across 75 files. NOT a burn-down reversal and NOT a widening of the
// law: the war waves (envoy/interception/coalition/peace-terms/negotiation, the
// disposition + lineage + herald readers) landed ~1,299 inherited strict errors
// while this ceiling stayed frozen at a fiction of zero. A ratchet whose
// baseline is a fiction enforces NOTHING — every file read as an unbounded
// regression, so the whole gate had to be ignored to commit anything, which is
// strictly worse than a truthful ceiling. Same banked-debt-ledger repair as
// R-BLD-6 (size) and the any-cast ratchet: freeze the census as MEASURED, keep
// the law shrink-only, and owe the burn-down as scheduled work.
//
// The law that survives intact, and is what makes this safe:
//   - per-file shrink-only — a baselined file may never worsen (check-domain-
//     strict.mjs compares each file against its own entry, never the total);
//   - the ZERO-CEILING LAW FOR NEW WORK — a domain file absent from the
//     baseline gets an allowance of 0 (`base[file] ?? 0`), so anything written
//     from here on must be strict-clean;
//   - deletion-at-zero — a burned-down or deleted file's entry is dropped by
//     `--update` and can never be re-earned.
// Measured on a CLEAN worktree at HEAD 23d118eb (committed bytes only): three
// untracked Lane-P files were live in the shared tree at measurement time and
// are deliberately NOT baselined — in-flight work does not get banked.
//
// The burn-down of these 1,329 is owed at THE STRICT BURN-DOWN WAVE, queued
// first-class. Monotone-DOWN from here; never raise past 1329.
//
// COROLLARY (R-BLD-9, from the cycle-8 verifier's Finding A): a decomposition
// split must be strict-NEUTRAL by PER-FILE MAP — debt may move between members
// of the split family, never onto a non-family file, and the total must not
// rise. Burn-clean is explicitly NOT required mid-split: coupling a typing
// change into a behavior-identity commit weakens both proofs. Debt burns at the
// wave, not in the split.
const CEILING = 1329;

const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.domain-strict-baseline.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const strictCfg = JSON.parse(readFileSync(join(ROOT, 'tsconfig.domain-strict.json'), 'utf8'));

describe('domain strict-typecheck ratchet (A+ domain.7)', () => {
  test('the strict config flips strict + noImplicitAny on the domain', () => {
    expect(strictCfg.compilerOptions.strict).toBe(true);
    expect(strictCfg.compilerOptions.noImplicitAny).toBe(true);
    expect(strictCfg.extends).toBe('./tsconfig.json');
  });

  test('the strict config\'s EFFECTIVE include still covers src/domain (scope cannot silently narrow)', () => {
    // SS4: the ratchet script's fail-closed sentinel proves tsc ran, not that it
    // ran over the domain — check-domain-strict.mjs's --listFilesOnly sentinel
    // guards that at runtime; this pins the config shape statically. The strict
    // config inherits include/exclude from tsconfig.json (it declares neither),
    // so what gets strict-checked is whatever the BASE include says.
    const base = JSON.parse(readFileSync(join(ROOT, 'tsconfig.json'), 'utf8'));
    const include = strictCfg.include ?? base.include ?? [];
    expect(
      include.some((g) => /^src\/domain\//.test(g)),
      `neither tsconfig.domain-strict.json nor tsconfig.json includes src/domain — the strict ratchet would check nothing of the kernel (include: ${JSON.stringify(include)})`,
    ).toBe(true);
    const exclude = [...(strictCfg.exclude ?? []), ...(strictCfg.include ? [] : base.exclude ?? [])];
    expect(
      exclude.some((g) => /src\/domain(?:$|\/)/.test(g)),
      'an exclude entry carves src/domain out of the strict scope',
    ).toBe(false);
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

// ── R-BLD-9: the re-baseline's safety clauses, executed not asserted ─────────
// Re-freezing at a MEASURED census (0 → 1329) is only safe because the checker
// enforces three clauses: per-file shrink-only, an allowance of ZERO for any
// domain file absent from the baseline (`base[file] ?? 0`), and no credit for
// slack elsewhere in the total. Those clauses were previously untested — the
// all-zero baseline made them indistinguishable from "everything must be zero",
// so a future edit could delete the `?? 0` and nothing would red. With a
// non-zero baseline banked they are the ONLY thing standing between new work
// and a free debt allowance, so they get executed pins. Both testability seams
// (DOMAIN_STRICT_TSC_CMD, DOMAIN_STRICT_BASELINE) are injected, so these never
// touch the real toolchain or the committed baseline.
describe('R-BLD-9 — the banked baseline still enforces the zero-ceiling law', () => {
  const SCRIPT = join(ROOT, 'scripts/check-domain-strict.mjs');
  const TMP = mkdtempSync(join(tmpdir(), 'domain-strict-rbld9-'));

  /** Fake tsc emitting one located diagnostic per entry of `diagnostics`. */
  function fakeTsc(diagnostics) {
    const body = diagnostics.map((d) => `console.log(${JSON.stringify(d)});`).join('');
    return `node -e "${body.replace(/"/g, '\\"')} process.exit(1)"`;
  }

  /** Run the ratchet against an injected baseline + injected tsc output. */
  function runAgainst(baselineFiles, diagnostics) {
    const total = Object.values(baselineFiles).reduce((a, b) => a + b, 0);
    const file = join(TMP, `baseline-${Math.random().toString(36).slice(2)}.json`);
    writeFileSync(file, JSON.stringify({ total, files: baselineFiles }, null, 2));
    return spawnSync('node', [SCRIPT], {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, DOMAIN_STRICT_TSC_CMD: fakeTsc(diagnostics), DOMAIN_STRICT_BASELINE: file },
    });
  }

  const err = (f, line) => `src/domain/${f}(${line},1): error TS7006: Parameter x implicitly has an 'any' type.`;

  test('a NEW domain file (absent from the baseline) may carry ZERO strict errors', () => {
    // The zero-ceiling law for new work. If `base[file] ?? 0` ever became
    // `?? Infinity` (or the total-only comparison the banked number invites),
    // this greens and every new file inherits a free allowance.
    const r = runAgainst({ 'src/domain/banked.js': 40 }, [err('brandNew.js', 1)]);
    expect(r.status, `${r.stdout}${r.stderr}`).not.toBe(0);
    expect(`${r.stdout}${r.stderr}`).toMatch(/brandNew\.js/);
  });

  test('a NEW file gets no credit from unused slack elsewhere in the banked total', () => {
    // 1 new error against a 40-error banked total is still a regression: the
    // comparison is PER FILE, never "total <= baseline.total".
    const r = runAgainst({ 'src/domain/banked.js': 40 }, [err('brandNew.js', 1)]);
    expect(r.status).not.toBe(0);
  });

  test('a baselined file AT its banked count passes (debt is banked, not forgiven-then-refused)', () => {
    const r = runAgainst({ 'src/domain/banked.js': 2 }, [err('banked.js', 1), err('banked.js', 2)]);
    expect(r.status, `${r.stdout}${r.stderr}`).toBe(0);
  });

  test('a baselined file ABOVE its banked count fails (per-file shrink-only)', () => {
    const r = runAgainst({ 'src/domain/banked.js': 1 }, [err('banked.js', 1), err('banked.js', 2)]);
    expect(r.status, `${r.stdout}${r.stderr}`).not.toBe(0);
    expect(`${r.stdout}${r.stderr}`).toMatch(/banked\.js: 2 strict errors \(baseline 1\)/);
  });

  test('a baselined file BELOW its banked count passes and advertises the ratchet-down', () => {
    const r = runAgainst({ 'src/domain/banked.js': 5 }, [err('banked.js', 1)]);
    expect(r.status, `${r.stdout}${r.stderr}`).toBe(0);
    expect(`${r.stdout}${r.stderr}`).toMatch(/fewer errors than baseline|tighten the ratchet/);
  });
});
