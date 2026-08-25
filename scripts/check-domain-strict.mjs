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
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const BASELINE = path.join(ROOT, 'scripts', '.domain-strict-baseline.json');
const UPDATE = process.argv.includes('--update');

// Run the strict domain typecheck. tsc exits non-zero when there are errors;
// we parse stdout regardless, so don't let execSync throw on that.
let out;
let tscExitedNonZero = false;
try {
  out = execSync('npx tsc --noEmit -p tsconfig.domain-strict.json', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (e) {
  tscExitedNonZero = true;
  out = `${e.stdout || ''}${e.stderr || ''}`;
}

// Count errors per src/domain file (ignore import-followed errors outside the
// domain — those belong to the non-strict full typecheck, not this scope).
const counts = {};
const RE = /^(src\/domain\/[^(]+\.js)\((\d+),(\d+)\): error TS/;
for (const line of out.split('\n')) {
  const m = RE.exec(line.trim());
  if (!m) continue;
  counts[m[1]] = (counts[m[1]] || 0) + 1;
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
if (tscExitedNonZero && total === 0 && (globalDiagnostics.length > 0 || out.trim() === '')) {
  console.error('[domain-strict] tsc DID NOT RUN against the domain (non-zero exit, zero domain diagnostics parsed) — this ratchet verified NOTHING, not "0 errors":');
  console.error(
    globalDiagnostics.length
      ? globalDiagnostics.map((l) => `  ${l}`).join('\n')
      : '  (no tsc output at all — is typescript installed? is tsconfig.domain-strict.json present?)',
  );
  console.error('\nA broken-toolchain vacuous pass is not a clean typecheck. Fix the config/install; do not ignore.');
  process.exit(1);
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
