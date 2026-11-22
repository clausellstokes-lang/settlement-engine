#!/usr/bin/env node
/**
 * check-domain-strict.mjs — A+ domain.7 strict-typecheck ratchet.
 *
 * The domain is the pure kernel every other layer trusts and the layer best
 * positioned to be strict. Turning strict + noImplicitAny ON over src/domain
 * surfaces ~5k pre-existing errors (mostly missing @param annotations) — a real
 * burn-down, too large to land at zero in one move. So this is a RATCHET, not a
 * boolean: it pins the current per-file error count as a ceiling and FAILS the
 * gate if any domain file gains a strict error or a new domain file lands with
 * one. The debt can only shrink. Run with `--update` to re-baseline after a
 * burn-down (the count must not increase).
 *
 * Mirrors the forked-color baseline ratchet (scripts/.forked-color-baseline.json)
 * — exact-set governance + a ceiling that only ratchets down.
 *
 * Wired into `npm run check` via `npm run typecheck:domain:strict`.
 *
 * ⚠ THIS IS THE SECOND OF TWO TYPECHECKERS IN THE CHAIN. Step 9 is
 * `typecheck:ratchet` over `tsconfig.full.json`; this is step 10 over
 * `tsconfig.domain-strict.json`. THEY DISAGREE. A typecheck figure quoted without
 * naming its config reads as total and is not: the 2026-08-06 idiom sweep
 * (eca65c8a -> 1977db07) introduced 0 rows under the full config and 31 under this
 * one, and two of those 31 crossed a per-file ceiling and reddened this step — in a
 * file (peaceTerms.js) that appears in NO commit of that sweep, because JSDoc added
 * elsewhere narrows inferred types that flow into files nobody opened.
 * See CONTRIBUTING.md, "THE TWO-TYPECHECKER RECEIPT LAW", before quoting any
 * introduced/removed count from either checker.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
// DOMAIN_STRICT_BASELINE / DOMAIN_STRICT_TSC_CMD are TESTABILITY seams (ported
// master fix): the fail-closed meta-test injects a fake tsc + temp baseline so
// the failure paths are exercisable without breaking the real toolchain.
const BASELINE = process.env.DOMAIN_STRICT_BASELINE || path.join(ROOT, 'scripts', '.domain-strict-baseline.json');
const UPDATE = process.argv.includes('--update');

// Run the strict domain typecheck. tsc exits non-zero when there are errors;
// we parse stdout regardless, so don't let execSync throw on that.
let out;
let tscExitedNonZero = false;
try {
  out = execSync(process.env.DOMAIN_STRICT_TSC_CMD || 'npx tsc --noEmit -p tsconfig.domain-strict.json', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (e) {
  tscExitedNonZero = true;
  out = `${e.stdout || ''}${e.stderr || ''}`;
}

// Count errors per src/domain file (ignore import-followed errors outside the
// domain — those belong to the non-strict full typecheck, not this scope).
// SS4 hardening: the old RE only matched cwd-relative forward-slash paths, so a
// tsc emitting absolute or backslash paths would parse to 0 domain errors while
// located diagnostics elsewhere kept the fail-closed sentinel quiet — a silent
// green. Match the src/domain segment anywhere in the located path and
// normalize, so path-format drift cannot zero the count.
const counts = {};
const RE = /(?:^|[\\/])(src[\\/]domain[\\/][^(]+\.js)\((\d+),(\d+)\): error TS/;
for (const line of out.split('\n')) {
  const m = RE.exec(line.trim());
  if (!m) continue;
  const file = m[1].split('\\').join('/');
  counts[file] = (counts[file] || 0) + 1;
}
const total = Object.values(counts).reduce((a, b) => a + b, 0);

// ── Anti-vacuity sentinel ([build-tooling-docs-3]) — "tsc actually ran" ──────
// tsc exits non-zero for BOTH "found type errors" and "could not run at all"
// (a renamed/deleted tsconfig.domain-strict.json, a broken typescript install, an
// OOM-killed run). The per-file RE above only matches `src/domain/…: error TS`
// diagnostics, so a run that never typechecked the domain parses to total=0 and
// would read as "✓ no strict-type regressions" → exit 0 — the exact green-on-
// nothing this ratchet exists to prevent. Distinguish "ran clean" from "did not
// run": if tsc exited non-zero yet produced ZERO domain diagnostics, and its
// output is either empty (binary/tsc missing) or carries a GLOBAL diagnostic —
// an `error TS…` with no `file(line,col):` prefix (TS5058 path-not-found, TS6053
// file-not-found, TS18003 no-inputs, module-resolution config failures) — the
// typecheck did not happen. Fail loudly. Guards both the check and the --update
// re-baseline (never write a 0-error baseline from a broken run).
const globalDiagnostics = out
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => /^error TS\d+:/.test(l));
// HOLE CLOSED (master merge W6): the old condition let a failed-to-run tsc with
// NON-empty, non-TS-diagnostic output ("Cannot find module typescript") slip
// through to exit 0. The discriminator is a FILE-LOCATED diagnostic
// (`file(line,col): error TS`) anywhere in the output: its presence proves tsc
// actually typechecked source (even outside the domain scope — the normal
// ratchet path handles those). Zero located diagnostics on a non-zero exit is
// either a global/config-load failure (TS18003 etc., the globalDiagnostics
// below) or a failed-to-run — both fail closed.
// A diagnostic LOCATED IN a .json config (TS5083 / tsconfig syntax errors) is
// still a config-load failure, not a typecheck — only source-file locations
// prove the domain was checked.
const locatedDiagnostics = out
  .split('\n')
  .filter((l) => /^[^\s(][^(]*\(\d+,\d+\): error TS\d+:/.test(l.trim()))
  .filter((l) => !/\.json\(\d+,\d+\):/.test(l.trim()));
if (tscExitedNonZero && locatedDiagnostics.length === 0) {
  console.error('[domain-strict] tsc failed to run against the domain (non-zero exit, zero domain diagnostics parsed) — failing closed; this ratchet verified NOTHING, not "0 errors":');
  console.error(
    globalDiagnostics.length
      ? globalDiagnostics.map((l) => `  ${l}`).join('\n')
      : `  ${(out.trim().slice(0, 2000)) || '(no tsc output at all — is typescript installed? is tsconfig.domain-strict.json present?)'}`,
  );
  console.error('\nA broken-toolchain vacuous pass is not a clean typecheck. Fix the config/install; do not ignore.');
  process.exit(1);
}

// ── Scope sentinel (SS4) — "the DOMAIN was actually in the compilation" ──────
// The fail-closed guard above proves tsc RAN; it cannot prove tsc ran OVER
// src/domain. If tsconfig.json's include (which tsconfig.domain-strict.json
// inherits) is narrowed away from the domain, tsc checks something else, any
// located diagnostic suppresses the fail-closed path, the src/domain regex
// matches nothing, and total=0 reads as a clean ratchet — the domain kernel
// silently loses its strict gate. `--listFilesOnly` resolves the file set from
// the SAME config without typechecking (cheap) and must name the domain.
// Skipped when DOMAIN_STRICT_TSC_CMD injects a fake tsc (the fail-closed
// meta-test seam); the static include pin in tests/lint/domainStrictBaseline
// covers the config shape there.
if (!process.env.DOMAIN_STRICT_TSC_CMD) {
  let listed;
  try {
    listed = execSync('npx tsc -p tsconfig.domain-strict.json --listFilesOnly', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    listed = `${e.stdout || ''}`;
  }
  if (!/[\\/]src[\\/]domain[\\/]/.test(String(listed || ''))) {
    console.error('[domain-strict] scope sentinel: tsc\'s resolved file set contains NO src/domain file — the strict ratchet is no longer checking the domain kernel.');
    console.error('Check tsconfig.domain-strict.json / tsconfig.json include+exclude; a narrowed include makes this ratchet vacuously green.');
    process.exit(1);
  }
}

if (UPDATE) {
  const sorted = Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(BASELINE, `${JSON.stringify({ total, files: sorted }, null, 2)}\n`);
  console.log(`[domain-strict] baseline updated: ${total} errors across ${Object.keys(counts).length} files.`);
  process.exit(0);
}

if (!fs.existsSync(BASELINE)) {
  console.error('[domain-strict] no baseline file — run: node scripts/check-domain-strict.mjs --update');
  process.exit(1);
}
const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
const base = baseline.files || {};

const regressions = [];
for (const [file, n] of Object.entries(counts)) {
  const allowed = base[file] ?? 0;
  if (n > allowed) regressions.push(`  ${file}: ${n} strict errors (baseline ${allowed}) — +${n - allowed}`);
}

if (regressions.length) {
  console.error('[domain-strict] strict-type regressions in the domain kernel (fix or annotate; do not widen the baseline):');
  console.error(regressions.join('\n'));
  console.error(`\nDomain strict-error ceiling is ${baseline.total}. New/worsened files must be strict-clean.`);
  process.exit(1);
}

if (total < baseline.total) {
  console.log(`[domain-strict] ✓ no regressions — and ${baseline.total - total} fewer errors than baseline (${total} < ${baseline.total}). Run \`npm run typecheck:domain:strict:update\` to tighten the ratchet.`);
} else {
  console.log(`[domain-strict] ✓ no strict-type regressions (${total} errors, ceiling ${baseline.total}).`);
}
process.exit(0);
