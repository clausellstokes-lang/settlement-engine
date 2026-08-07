#!/usr/bin/env node
/**
 * check-full-typecheck.mjs — the FULL-TREE typecheck ratchet (gate restoration).
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 * `npm run typecheck` (`tsc --noEmit -p tsconfig.full.json`) is a BOOLEAN gate at
 * zero errors, and it is step 9 of the 14-step `&&` chain in `npm run check`. It
 * went red on 2026-08-02 at 7796954e and stayed red. Because the chain is `&&`,
 * everything BEHIND step 9 stopped running with it:
 *
 *     … validate:mcp-server && typecheck && typecheck:domain:strict
 *                             ^^^^^^^^^ red here since 2026-08-02
 *       && lint && test && build && verify:dist      <-- ALL DARK
 *
 * So the outage was never "the types are wrong". It was that the repo's lint,
 * its ~20k-test vitest suite, its production build and its first-paint
 * dist-contract ratchet had not run as part of the gate for four days and ~368
 * commits. Same shape in CI: the `check` job's steps are sequential and a failed
 * step ends the job, so CI's lint/test/build/verify:dist were dark too.
 *
 * ── THE JUDGMENT THIS ENCODES (stated so it can be vetoed) ──────────────────
 * A ratchet that tolerates N errors is WEAKER than a boolean gate demanding
 * zero. But a boolean gate nobody can pass tolerates INFINITY — and hides every
 * step behind it. A truthful ceiling that can only shrink restores four dark
 * gate steps today and still forbids the next regression. That trade is the
 * whole design; if the owner prefers the boolean, revert this and burn the 188.
 *
 * ── WHAT IT ENFORCES ────────────────────────────────────────────────────────
 * A PER-FILE error ceiling that only ratchets DOWN, keyed on every file-located
 * diagnostic tsc emits (not a scoped subset — an error anywhere tsc reports it is
 * governed). A file ABSENT from the baseline has an allowance of ZERO, so new
 * work must be typecheck-clean. `--update` re-freezes the census and can only be
 * run downward in practice, because the pins in
 * tests/lint/fullTypecheckRatchet.test.js cap the committed total.
 *
 * Mirrors scripts/check-domain-strict.mjs (the domain-strict variant of exactly
 * this pattern) and carries its hard-won hardening — anti-vacuity sentinel,
 * scope sentinel, path-format normalization, env-var testability seams — each of
 * which exists because it was needed. It STRENGTHENS two of them: the scope
 * sentinel checks the resolved file set against the baseline's own membership
 * rather than a single directory probe, and that sentinel has its own injectable
 * seam so its failure paths are exercised by a meta-test
 * (tests/lint/fullTypecheckFailClosed.test.js) instead of merely asserted.
 *
 * ── USAGE ───────────────────────────────────────────────────────────────────
 *   npm run typecheck:ratchet          # the gate step (wired into `npm run check`)
 *   npm run typecheck:ratchet:update   # re-freeze after a burn-down
 *   npm run typecheck                  # UNFILTERED tsc — what burn lanes read
 *
 * `npm run typecheck` stays a raw command on purpose: a burn lane needs the whole
 * list, not the ratchet's verdict.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

// TESTABILITY SEAMS (ported from check-domain-strict.mjs, plus a third).
// The fail-closed meta-test injects a fake tsc, a fake --listFilesOnly and a temp
// baseline so every failure path is EXERCISED without touching the real
// toolchain or the committed baseline. A ratchet whose failure paths are never
// run is a ratchet nobody has proven works.
const BASELINE = process.env.FULL_TYPECHECK_BASELINE
  || path.join(ROOT, 'scripts', '.full-typecheck-baseline.json');
const TSC_CMD = process.env.FULL_TYPECHECK_TSC_CMD;
const LIST_CMD = process.env.FULL_TYPECHECK_LISTFILES_CMD;
const UPDATE = process.argv.includes('--update');

// The scope sentinel costs a second (cheap, ~2s) tsc resolution pass. Skip it
// when only the tsc seam is injected — the fake tsc's diagnostics say nothing
// about a real file set, and the dedicated sentinel tests inject BOTH seams.
const SCOPE_SENTINEL_ON = !TSC_CMD || !!LIST_CMD;

/**
 * Normalize a tsc-emitted path to a repo-relative POSIX path.
 *
 * PATH-FORMAT HARDENING (inherited from check-domain-strict.mjs SS4, generalized):
 * tsc may emit cwd-relative, absolute, or backslash paths depending on how it is
 * invoked. A parser that only understands one spelling silently counts ZERO and
 * the ratchet goes vacuously green. Accept all three.
 */
const ROOT_PREFIX = `${ROOT.split('\\').join('/').replace(/\/+$/, '')}/`;
function normalizePath(raw) {
  let p = String(raw).split('\\').join('/');
  if (p.startsWith(ROOT_PREFIX)) p = p.slice(ROOT_PREFIX.length);
  return p.replace(/^\.\//, '');
}

// ── Run tsc ─────────────────────────────────────────────────────────────────
// tsc exits non-zero when there are errors; parse stdout regardless, so don't
// let execSync throw on that.
let out;
let tscExitedNonZero = false;
try {
  out = execSync(TSC_CMD || 'npx tsc --noEmit -p tsconfig.full.json', {
    cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024,
  });
} catch (e) {
  tscExitedNonZero = true;
  out = `${e.stdout || ''}${e.stderr || ''}`;
}

// A located diagnostic: `path(line,col): error TSxxxx:`. Anchored at column 0 on
// the UNTRIMMED line, because tsc indents elaboration/related-info lines — those
// are continuation prose, never a new diagnostic, and trimming would let a
// crafted message line masquerade as one.
const LOCATED_RE = /^(\S[^(]*)\((\d+),(\d+)\): error TS(\d+):/;
const lines = out.split('\n');

const located = [];
for (const line of lines) {
  const m = LOCATED_RE.exec(line);
  if (m) located.push({ file: normalizePath(m[1]), raw: line });
}
// A diagnostic located IN a config file (tsconfig syntax, TS5083) is a
// CONFIG-LOAD failure, not a typecheck: it proves nothing was checked.
const isConfigLocated = (f) => f.endsWith('.json');
const sourceLocated = located.filter((d) => !isConfigLocated(d.file));

const counts = {};
for (const d of sourceLocated) counts[d.file] = (counts[d.file] || 0) + 1;
const total = Object.values(counts).reduce((a, b) => a + b, 0);

// ── Anti-vacuity sentinel — "tsc actually ran" ──────────────────────────────
// tsc exits non-zero for BOTH "found type errors" and "could not run at all" (a
// renamed tsconfig, a broken typescript install, an OOM kill). Every parse above
// yields ZERO on a failed-to-run tsc, which would read as "no errors" -> exit 0:
// the exact green-on-nothing this ratchet exists to prevent. The discriminator is
// a SOURCE-FILE-located diagnostic anywhere in the output — its presence proves
// tsc typechecked source. Zero of those on a non-zero exit is either a
// global/config failure (TS18003 no-inputs, TS5058 path-not-found, TS6053) or a
// failed-to-run. Both FAIL CLOSED. Guards `--update` too: never write a 0-error
// baseline from a broken run.
const globalDiagnostics = lines
  .map((l) => l.trim())
  .filter((l) => /^error TS\d+:/.test(l));
if (tscExitedNonZero && sourceLocated.length === 0) {
  const configLocated = located.filter((d) => isConfigLocated(d.file));
  console.error(
    '[typecheck-ratchet] tsc FAILED TO RUN (non-zero exit, zero source-located diagnostics parsed)'
    + ' — failing closed. This ratchet verified NOTHING; it did not measure "0 errors":',
  );
  if (configLocated.length) {
    console.error('  config-level diagnostic(s) — the typecheck never started:');
    console.error(configLocated.map((d) => `    ${d.raw.trim()}`).join('\n'));
  } else if (globalDiagnostics.length) {
    console.error('  config-level diagnostic(s) — the typecheck never started:');
    console.error(globalDiagnostics.map((l) => `    ${l}`).join('\n'));
  } else {
    console.error(`  ${out.trim().slice(0, 2000) || '(no tsc output at all — is typescript installed? is tsconfig.full.json present?)'}`);
  }
  console.error('\nA broken-toolchain vacuous pass is not a clean typecheck. Fix the config/install; do not ignore.');
  process.exit(1);
}

// ── Scope sentinel — "the GOVERNED FILES were actually in the compilation" ──
// The guard above proves tsc RAN; it cannot prove tsc ran over the files this
// ratchet governs. Narrow tsconfig.full.json's `include` and tsc checks a smaller
// tree: the surviving diagnostics still suppress the fail-closed path, the
// dropped files report zero, and every ceiling passes — a silently vacuous green
// over an unchecked tree. `--listFilesOnly` resolves the file set from the SAME
// config without typechecking, and is compared against the baseline's OWN
// membership (stronger than probing for one directory).
/** @returns {string[]} repo-relative resolved files, or [] if the probe failed. */
function resolveFileSet() {
  let listed;
  try {
    listed = execSync(LIST_CMD || 'npx tsc -p tsconfig.full.json --listFilesOnly', {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024,
    });
  } catch (e) {
    listed = `${e.stdout || ''}`;
  }
  return String(listed || '')
    .split('\n')
    .map((l) => normalizePath(l.trim()))
    .filter(Boolean);
}

let resolved = null;
let resolvedSet = null;
/** Non-library files in the resolved set — the population the count floor tracks. */
const isFirstParty = (p) => !p.startsWith('node_modules/') && !p.includes('/node_modules/');
if (SCOPE_SENTINEL_ON) {
  resolved = resolveFileSet();
  resolvedSet = new Set(resolved);
  if (resolved.length === 0) {
    console.error('[typecheck-ratchet] scope sentinel: the file-set probe returned NOTHING — failing closed.');
    console.error('  `tsc -p tsconfig.full.json --listFilesOnly` produced no resolvable files, so this run');
    console.error('  cannot prove the governed tree was compiled. Fix the config/install; do not ignore.');
    process.exit(1);
  }
}

/** Root prefixes (`src/<area>/`) present in a resolved file set. */
function rootsOf(files) {
  const roots = new Set();
  for (const f of files) {
    if (!f.startsWith('src/')) continue;
    const seg = f.split('/');
    if (seg.length >= 3) roots.add(`${seg[0]}/${seg[1]}/`);
  }
  return [...roots].sort();
}

// ── --update: re-freeze the census ──────────────────────────────────────────
if (UPDATE) {
  // THE ARCHIVE-CENSUS LAW: a shared tree is LIVE — a concurrent lane's
  // UNCOMMITTED edits are in it, and a baseline measured over them banks a number
  // that belongs to no commit. (Measured 2026-08-07: the live tree read 179 while
  // the committed sha read 188 — the difference was a sibling burn lane's unlanded
  // work.) So the census is taken inside an integrity-counted `git archive` of a
  // committed sha, where `git rev-parse` cannot see the repo; FULL_TYPECHECK_SHA
  // carries the sha of the tree actually measured. Never hand-edit it in after.
  let sha = process.env.FULL_TYPECHECK_SHA || 'unknown';
  if (!process.env.FULL_TYPECHECK_SHA) {
    try {
      sha = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
    } catch { /* not a git tree — record 'unknown' rather than fail the re-baseline */ }
  }
  const firstParty = (resolved || []).filter(isFirstParty);
  const files = Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
  const payload = {
    _doc: 'Per-file ceiling for `tsc --noEmit -p tsconfig.full.json`. SHRINK-ONLY. A file absent'
      + ' from `files` has an allowance of ZERO. Regenerate with `npm run typecheck:ratchet:update`'
      + ' — never hand-edit, and never widen. See scripts/check-full-typecheck.mjs.',
    measuredAtSha: sha,
    total,
    resolvedCount: firstParty.length,
    roots: rootsOf(firstParty),
    files,
  };
  fs.writeFileSync(BASELINE, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`[typecheck-ratchet] baseline updated: ${total} errors across ${Object.keys(counts).length} file(s), measured at ${sha}.`);
  process.exit(0);
}

if (!fs.existsSync(BASELINE)) {
  console.error('[typecheck-ratchet] no baseline file — run: npm run typecheck:ratchet:update');
  process.exit(1);
}
const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
const base = baseline.files || {};

// The scope checks need the baseline, so they run here rather than above.
if (SCOPE_SENTINEL_ON) {
  const scopeFailures = [];

  // (1) EXACT MEMBERSHIP: every baselined file that still exists on disk must be
  // in the compilation. A file DELETED from disk is a legitimate ratchet-down
  // (handled below, not fatal); a file that exists but is no longer compiled is
  // the vacuity this sentinel exists for.
  for (const file of Object.keys(base)) {
    if (!fs.existsSync(path.join(ROOT, file))) continue;
    if (!resolvedSet.has(file)) {
      scopeFailures.push(`  ${file}: on disk but NOT in tsc's resolved file set — its ${base[file]} baselined error(s) are no longer being checked`);
    }
  }

  // (2) ROOT COVERAGE: an area that resolved at baseline time must still resolve.
  // Catches a wholesale `include` root removal in an area that happens to carry
  // no baselined errors today (which check (1) cannot see).
  const liveRoots = new Set(rootsOf(resolved.filter(isFirstParty)));
  for (const root of baseline.roots || []) {
    if (!liveRoots.has(root)) {
      scopeFailures.push(`  ${root}: resolved at baseline time, resolves to NOTHING now — an include/exclude narrowed the gate's scope`);
    }
  }

  // (3) COUNT FLOOR: a >10% collapse in the compiled first-party file count is a
  // scope event, not routine churn. Deliberate large deletions re-baseline.
  const liveCount = resolved.filter(isFirstParty).length;
  const floor = Math.floor((baseline.resolvedCount || 0) * 0.9);
  if (baseline.resolvedCount && liveCount < floor) {
    scopeFailures.push(`  compiled first-party file count collapsed: ${liveCount} < ${floor} (90% of the baselined ${baseline.resolvedCount}) — the gate is checking a much smaller tree than it was baselined against`);
  }

  if (scopeFailures.length) {
    console.error('[typecheck-ratchet] SCOPE SENTINEL: the gate is no longer checking what it was baselined to check — a pass here would be VACUOUS:');
    console.error(scopeFailures.join('\n'));
    console.error('\nCheck tsconfig.full.json / tsconfig.json include+exclude. If the narrowing is deliberate, re-baseline explicitly.');
    process.exit(1);
  }
}

// ── The ratchet ─────────────────────────────────────────────────────────────
// PER-FILE comparison, never `total <= baseline.total`: slack banked on one file
// must never fund a regression on another. `base[file] ?? 0` is the ZERO-CEILING
// LAW FOR NEW WORK — anything not already in debt must be typecheck-clean.
const regressions = [];
for (const [file, n] of Object.entries(counts)) {
  const allowed = base[file] ?? 0;
  if (n > allowed) regressions.push(`  ${file}: ${n} error(s) (baseline ${allowed}) — +${n - allowed}`);
}

if (regressions.length) {
  console.error('[typecheck-ratchet] TYPE REGRESSIONS against tsconfig.full.json (fix them; do not widen the baseline):');
  console.error(regressions.sort().join('\n'));
  console.error(`\nCeiling is ${baseline.total} error(s) across ${Object.keys(base).length} file(s), measured at ${baseline.measuredAtSha || 'unknown'}.`);
  console.error('New and un-baselined files must be typecheck-clean. Run `npm run typecheck` for the unfiltered list.');
  process.exit(1);
}

if (total < baseline.total) {
  console.log(
    `[typecheck-ratchet] OK — no regressions, and ${baseline.total - total} fewer error(s) than baseline `
    + `(${total} < ${baseline.total}). RATCHET DOWN: run \`npm run typecheck:ratchet:update\` to bank the win.`,
  );
} else {
  console.log(`[typecheck-ratchet] OK — no type regressions (${total} error(s), ceiling ${baseline.total}).`);
}
process.exit(0);
