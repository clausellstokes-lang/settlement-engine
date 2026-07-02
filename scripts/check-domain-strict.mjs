#!/usr/bin/env node
/**
 * check-domain-strict.mjs — strict-typecheck ratchet for the domain kernel.
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
// DOMAIN_STRICT_BASELINE overrides the baseline path so the ratchet semantics
// (esp. the --update lower-only contract) are testable against a temp file
// without clobbering the committed baseline — same testability rationale as the
// DOMAIN_STRICT_TSC_CMD override below.
const BASELINE = process.env.DOMAIN_STRICT_BASELINE || path.join(ROOT, 'scripts', '.domain-strict-baseline.json');
const UPDATE = process.argv.includes('--update');

// Run the strict domain typecheck. tsc exits non-zero when there are errors;
// we parse stdout regardless, so don't let execSync throw on that.
//
// But a non-zero exit means two very different things: tsc RAN and found type
// errors (normal — parse them), or tsc FAILED TO RUN (bad config, missing
// binary, OOM). The catch folds stdout+stderr into one string either way, and a
// failed-to-run tsc emits no parseable `error TSxxxx` lines — so the count comes
// out empty, reads as "no regressions", and greens the gate on a broken
// typecheck. We must tell the two apart and fail CLOSED on execution failure.
// The TSCMD override exists so the failure path is testable without breaking tsc.
const TSCMD = process.env.DOMAIN_STRICT_TSC_CMD || 'npx tsc --noEmit -p tsconfig.domain-strict.json';
let out;
let tscRan = true; // exit 0 ⇒ tsc ran clean
try {
  out = execSync(TSCMD, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (e) {
  out = `${e.stdout || ''}${e.stderr || ''}`;
  // tsc ran iff its output carries at least one recognizable diagnostic line.
  // No `error TS` line on a non-zero exit ⇒ tsc never produced a typecheck.
  tscRan = /error TS\d+:/.test(out);
}

if (!tscRan) {
  console.error('[domain-strict] tsc failed to run (no parseable diagnostics) — failing closed; this is NOT a clean typecheck.');
  console.error(out.trim().slice(0, 2000) || '(no output captured)');
  process.exit(2);
}

// tscRan is necessary but not sufficient: config-load failures ALSO print
// `error TSxxxx:` lines (TS18003 "no inputs found", TS5083 "cannot read file",
// tsconfig syntax errors located in the .json itself) — so they pass the sniff
// above, yet no source file was ever typechecked, the per-file count comes out
// 0, and the gate would green on nothing. Classify every diagnostic: a REAL
// typecheck diagnostic is located in a source file (`file(line,col): error TS`
// where file is not a .json config). Any other `error TS` line is a
// config-level failure ⇒ the typecheck did not run over the domain ⇒ fail
// CLOSED, same as a tsc that never started.
const FILE_DIAG = /^(.+?)\((\d+),(\d+)\): error TS\d+/;
const configErrors = [];
for (const raw of out.split('\n')) {
  const line = raw.trim();
  if (!/error TS\d+:/.test(line)) continue;
  const m = FILE_DIAG.exec(line);
  if (!m || m[1].endsWith('.json')) configErrors.push(line);
}
if (configErrors.length) {
  console.error('[domain-strict] tsc reported config-level errors — the strict typecheck never ran over the domain; failing closed; this is NOT a clean typecheck.');
  console.error(configErrors.slice(0, 20).join('\n'));
  process.exit(2);
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

if (UPDATE) {
  // A ratchet only TIGHTENS. `--update` re-baselines after a burn-down, so the
  // new ceiling may only stay equal or drop — never RISE. Writing a higher total
  // here would silently widen the allowance (the exact thing the gate forbids on
  // a normal run), turning the re-baseline into a debt-laundering backdoor. So
  // refuse to raise: if a baseline exists, the new total must be ≤ the old one.
  if (fs.existsSync(BASELINE)) {
    const prev = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
    if (typeof prev.total === 'number' && total > prev.total) {
      console.error(
        `[domain-strict] refusing to RAISE the ceiling: new total ${total} > baseline ${prev.total}. ` +
          `--update may only LOWER the ratchet (the debt can shrink, never grow). ` +
          `Fix or annotate the +${total - prev.total} new strict error(s) instead of widening the baseline.`,
      );
      process.exit(1);
    }
  }
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
