#!/usr/bin/env node
/**
 * preproof-train.mjs — parallel pre-proof for train members (DBE §2.7, ODQ §74.3).
 *
 * WHAT IT IS: wall-clock compression only. Each train member's declared focused
 * battery runs concurrently in its own detached throwaway worktree. A green here
 * is NEVER landing proof — the assembled train re-runs every battery at its
 * member commit and seals with the one bare terminal gate. A red here is an
 * early truncation signal.
 *
 * LAWS THIS FILE IS BUILT AROUND (each earned by a recorded incident):
 *  - never touches gate-mutex.sh, never runs `npm run check*` (the self-deadlock
 *    class) — batteries are explicit vitest file lists, nothing wider;
 *  - never pkill (a sibling's pkill returns other lanes' workers as SKIPS) —
 *    signal cleanup kills ONLY this run's own process groups, by pid;
 *  - temp worktrees live OUTSIDE the repo — enforced on REALPATHS with
 *    path.relative, so neither a shared prefix nor a symlink can lie about
 *    containment — and member names obey /^[A-Za-z0-9._-]+$/ so no plan can
 *    steer a worktree or a log through `..` into the repo;
 *  - worktree removal and prune are AWAITED on every exit path (normal, red,
 *    signal, crash, timeout) and each removal's exit is checked — a nonzero
 *    removal prints a stale-registration warning instead of vanishing;
 *  - ⛔ THE SHUTDOWN/MAIN PAIRING IS LOAD-BEARING AND MUST NOT BE SPLIT. ONE
 *    shared in-flight cleanup promise AND a `signalled` flag consulted before
 *    the main path's verdict exit. Either half alone re-opens the race the
 *    laneREFF re-sweep caught: the signal path's group-kill RESOLVES the main
 *    path's battery awaits, the main path resumes, and its verdict exit
 *    preempts the still-awaiting signal path — exit 1 with stale registrations
 *    and a "truncation signal" naming a member killed by our own SIGTERM;
 *  - every child exit is captured directly from the process handle, never
 *    through a shell pipe;
 *  - the node_modules symlink is a PLAIN symlink — writes PASS THROUGH to the
 *    executor tree's real directory. Cache isolation is therefore NOT a
 *    property of the link (laneREFF R-D8) and is bought separately below;
 *  - ⭐ CACHE ISOLATION (R-D8, executed cure): vitest 4 resolves its cache to
 *    Vite's `cacheDir`, which defaults to `<root>/node_modules/.vite` — and
 *    that path resolves THROUGH the symlink into the executor tree, so N
 *    concurrent members plus any executor-tree run would share one physical
 *    cache. Each member therefore runs under a generated override config,
 *    written OUTSIDE the worktree, that re-exports the member's own
 *    `vite.config.js` with an explicit `root` and a per-member absolute
 *    `cacheDir` under the run root. ⚠ MEASURED, so no one inherits a rosier
 *    claim: the override adds NO entry to the throwaway tree's own status, but
 *    the tree is not porcelain-empty either — `git status` there reports
 *    `?? node_modules`, because `.gitignore`'s `node_modules/` pattern matches
 *    a DIRECTORY and the link step necessarily creates a SYMLINK. The tree is
 *    removed with `--force`, so nothing survives the run;
 *  - ⭐ A RED IS ONLY A RED IF THE BATTERY ACTUALLY RAN. vitest exits 1 both for
 *    a failing test and for a STARTUP error (a bad reporter name, an unloadable
 *    config, no matching test files) — so the exit code alone cannot carry the
 *    truncation signal the whole harness exists to emit. Each battery therefore
 *    also writes a machine-readable JSON result, and a nonzero exit is graded a
 *    battery RED only when that result exists and names at least one executed
 *    test. Anything else is `phase: 'startup'` and exit 2. This was found by
 *    executing the harness against the estate: the pre-landing draft passed
 *    `--reporter=basic`, which vitest 4 removed, and every estate run would have
 *    reported "1 RED — early truncation signal" for a reporter typo;
 *  - ⭐ EVERY BATTERY IS TIMED (R-H1): `plan.timeoutMs` is REQUIRED. A wedged
 *    vitest process — not a hung test; the estate's `testTimeout` only covers
 *    in-test hangs — would otherwise hold the serial executor slot forever. The
 *    ceiling is the plan author's MEASURED obligation, never a constant this
 *    harness invents;
 *  - invocation belongs to the serial executor slot (worktree add/remove writes
 *    shared .git metadata) — the plan file records who held the slot.
 *
 * PLAN FILE (JSON):
 * {
 *   "repo":     "/abs/path/to/build/worktree",
 *   "tmpRoot":  "/abs/path/outside/repo",
 *   "jobs":     4,
 *   "timeoutMs": 1800000,
 *   "members":[
 *     { "name":"WC-0A", "ref":"<sha-or-ref>",
 *       "battery":["tests/domain/foo.test.js","tests/lint/bar.walker.test.js"] }
 *   ]
 * }
 *
 * USAGE: node scripts/preproof-train.mjs <plan.json>
 * EXIT: 0 = every member battery ran and passed;
 *       1 = every member battery RAN, at least one red (early truncation signal);
 *       2 = any setup/parse/harness/timeout failure — battery verdicts
 *           incomplete, NO truncation signal implied.
 */

import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, realpathSync, symlinkSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

const MEMBER_NAME_RE = /^[A-Za-z0-9._-]+$/;

function refuse(msg) {
  console.error(`[preproof] ${msg} — refused.`);
  process.exit(2);
}

const planPath = process.argv[2];
if (!planPath) {
  console.error('usage: node scripts/preproof-train.mjs <plan.json>');
  process.exit(2);
}

let plan;
try {
  plan = JSON.parse(readFileSync(planPath, 'utf8'));
} catch (e) {
  refuse(`cannot read/parse ${planPath}: ${e.message}`);
}

// ── Plan-shape law: every malformed plan dies HERE, as exit 2, before any
//    worktree exists — a crash further down would masquerade as a verdict.
if (typeof plan.repo !== 'string' || plan.repo.length === 0) refuse('plan.repo missing or not a string');
if (typeof plan.tmpRoot !== 'string' || plan.tmpRoot.length === 0) refuse('plan.tmpRoot missing or not a string');
const jobsRaw = plan.jobs ?? 4;
if (typeof jobsRaw !== 'number' || !Number.isFinite(jobsRaw)) refuse(`plan.jobs ${JSON.stringify(jobsRaw)} is not a finite number`);
// R-H1: REQUIRED, not defaulted. A default would be an unmeasured constant
// inside the one artefact whose whole point is that every figure was measured.
if (typeof plan.timeoutMs !== 'number' || !Number.isFinite(plan.timeoutMs) || plan.timeoutMs <= 0) {
  refuse(`plan.timeoutMs ${JSON.stringify(plan.timeoutMs)} is not a positive finite number of milliseconds — an untimed battery can wedge the executor slot forever; the ceiling is the plan author's measured obligation`);
}
if (!Array.isArray(plan.members) || plan.members.length === 0) refuse('plan has no members');
const seenNames = new Set();
for (const m of plan.members) {
  if (typeof m.name !== 'string' || !MEMBER_NAME_RE.test(m.name) || m.name === '.' || m.name === '..') {
    refuse(`member name ${JSON.stringify(m.name)} violates the charset law /^[A-Za-z0-9._-]+$/ (path traversal foreclosed)`);
  }
  if (seenNames.has(m.name)) refuse(`duplicate member name ${m.name} — worktree paths would collide`);
  seenNames.add(m.name);
  if (typeof m.ref !== 'string' || m.ref.length === 0) refuse(`member ${m.name} lacks a ref`);
  if (!Array.isArray(m.battery) || m.battery.length === 0) refuse(`member ${m.name} has an empty battery`);
  for (const b of m.battery) {
    if (typeof b !== 'string' || b.length === 0) refuse(`member ${m.name}: battery entry ${JSON.stringify(b)} is not a path string`);
  }
}

// ── Containment law, on REALPATHS: resolve() is lexical, so a symlinked
//    tmpRoot could point inside the repo, and startsWith() would falsely
//    refuse a sibling dir sharing the repo's prefix. realpath + path.relative
//    closes both holes (laneREFF P4b/P4c, executed).
let repo;
let tmpRootReal;
try { repo = realpathSync(resolve(plan.repo)); } catch (e) { refuse(`plan.repo does not resolve: ${e.message}`); }
try {
  mkdirSync(resolve(plan.tmpRoot), { recursive: true });
  tmpRootReal = realpathSync(resolve(plan.tmpRoot));
} catch (e) { refuse(`plan.tmpRoot does not resolve: ${e.message}`); }
const relTmp = relative(repo, tmpRootReal);
if (relTmp === '' || (!relTmp.startsWith('..') && !isAbsolute(relTmp))) {
  refuse(`tmpRoot resolves inside the repo (${tmpRootReal})`);
}
const jobs = Math.max(1, Math.floor(jobsRaw));
const timeoutMs = Math.floor(plan.timeoutMs);
const runId = `preproof-${Date.now()}`;
const runRoot = join(tmpRootReal, runId);
mkdirSync(runRoot, { recursive: true });

// ── Child + worktree tracking for cleanup. Batteries are spawned DETACHED so
//    each owns a process group, and signal cleanup kills the GROUP (npx →
//    vitest → workers), never anything outside this run.
const worktrees = [];
const liveGroups = new Set(); // pids of detached battery process groups
let aborting = false;

/** SIGKILL one child's whole process group, falling back to the pid alone. */
function killTree(child, signal) {
  if (!child?.pid) return;
  try { process.kill(-child.pid, signal); } catch { try { process.kill(child.pid, signal); } catch { /* already gone */ } }
}

/**
 * Run a command, capture stdout+stderr to a log file, resolve with its exit
 * code and whether the per-battery timeout fired.
 */
function run(cmd, args, { cwd, logFile, detached = false, timeout = 0 }) {
  return new Promise((resolveExit) => {
    const chunks = [];
    let child;
    let timer = null;
    let timedOut = false;
    try {
      child = spawn(cmd, args, { cwd, env: process.env, detached });
    } catch (err) {
      writeFileSync(logFile, String(err));
      resolveExit({ exit: 2, timedOut: false });
      return;
    }
    if (detached && child.pid) liveGroups.add(child.pid);
    if (timeout > 0) {
      timer = setTimeout(() => {
        timedOut = true;
        chunks.push(Buffer.from(`\n[preproof] TIMEOUT after ${timeout} ms — killing the process group.\n`));
        killTree(child, 'SIGKILL');
      }, timeout);
    }
    child.stdout.on('data', (d) => chunks.push(d));
    child.stderr.on('data', (d) => chunks.push(d));
    child.on('close', (code, signal) => {
      if (timer) clearTimeout(timer);
      if (detached && child.pid) liveGroups.delete(child.pid);
      writeFileSync(logFile, Buffer.concat(chunks));
      resolveExit({ exit: signal ? 128 : code ?? 2, timedOut });
    });
    child.on('error', (err) => {
      if (timer) clearTimeout(timer);
      if (detached && child.pid) liveGroups.delete(child.pid);
      writeFileSync(logFile, String(err));
      resolveExit({ exit: 2, timedOut });
    });
  });
}

/** Run quietly (cleanup plumbing), resolve with exit code; never throws. */
function runQuiet(cmd, args) {
  return new Promise((resolveExit) => {
    let child;
    try { child = spawn(cmd, args, { stdio: 'ignore' }); } catch { resolveExit(2); return; }
    child.on('close', (code, signal) => resolveExit(signal ? 128 : code ?? 2));
    child.on('error', () => resolveExit(2));
  });
}

// ⛔ ONE shared in-flight cleanup promise: the signal path and the main path both
// await the SAME work, so neither can exit while removals are mid-flight. Paired
// with the `signalled` flag below — see the header; splitting the pair re-opens
// the race the re-sweep caught.
let signalled = false;
let cleanupPromise = null;
function cleanup() {
  if (!cleanupPromise) cleanupPromise = doCleanup();
  return cleanupPromise;
}
async function doCleanup() {
  aborting = true;
  for (const pid of liveGroups) {
    try { process.kill(-pid, 'SIGTERM'); } catch { try { process.kill(pid, 'SIGTERM'); } catch { /* already gone */ } }
  }
  for (const wt of worktrees) {
    const exit = await runQuiet('git', ['-C', repo, 'worktree', 'remove', '--force', wt]);
    if (exit !== 0) console.error(`[preproof] WARNING: worktree remove exit ${exit} for ${wt} — stale registration possible; run \`git -C ${repo} worktree prune\` after removing the directory`);
  }
  const pruneExit = await runQuiet('git', ['-C', repo, 'worktree', 'prune']);
  if (pruneExit !== 0) console.error(`[preproof] WARNING: worktree prune exit ${pruneExit}`);
}

async function shutdown(signal) {
  signalled = true;
  console.error(`[preproof] ${signal} — killing batteries, removing worktrees (awaited), exiting 2`);
  await cleanup();
  process.exit(2);
}
process.on('SIGINT', () => { void shutdown('SIGINT'); });
process.on('SIGTERM', () => { void shutdown('SIGTERM'); });

/**
 * The per-member vitest config. It lives OUTSIDE the worktree so it adds no
 * entry to the throwaway tree's own status, names `root` explicitly so nothing
 * depends on the cwd default, and pins an absolute per-member `cacheDir` — the
 * R-D8 isolation. A tree with no vite.config.js (a toy probe repo) gets the
 * bare override.
 */
function writeMemberConfig(member, wtDir) {
  const configPath = join(runRoot, `${member.name}.vitest.config.mjs`);
  const cacheDir = join(runRoot, `${member.name}.vite-cache`);
  const baseConfig = join(wtDir, 'vite.config.js');
  const tail = `export default { ...base, root: ${JSON.stringify(wtDir)}, cacheDir: ${JSON.stringify(cacheDir)} };\n`;
  const body = existsSync(baseConfig)
    ? `import base from ${JSON.stringify(pathToFileURL(baseConfig).href)};\n${tail}`
    : `const base = {};\n${tail}`;
  writeFileSync(configPath, body);
  return configPath;
}

/**
 * How many tests the battery actually executed, read from its own JSON result.
 * Zero — including an absent or unparseable file — means no verdict was
 * produced, so a nonzero exit is a startup failure and NOT a truncation signal.
 */
function executedTestCount(resultPath) {
  try {
    const parsed = JSON.parse(readFileSync(resultPath, 'utf8'));
    const total = Number(parsed?.numTotalTests);
    return Number.isFinite(total) ? total : 0;
  } catch {
    return 0;
  }
}

async function preproofMember(member) {
  const started = Date.now();
  if (aborting) {
    return { name: member.name, exit: 2, phase: 'aborted', ms: 0, log: '(none)' };
  }
  const wtDir = join(runRoot, member.name);
  const setupLog = join(runRoot, `${member.name}.setup.log`);
  const batteryLog = join(runRoot, `${member.name}.battery.log`);

  const add = await run(
    'git', ['-C', repo, 'worktree', 'add', '--detach', wtDir, member.ref],
    { cwd: repo, logFile: setupLog, timeout: timeoutMs },
  );
  if (add.exit !== 0) {
    return {
      name: member.name,
      exit: 2,
      phase: add.timedOut ? 'worktree-add-timeout' : 'worktree-add',
      ms: Date.now() - started,
      log: setupLog,
    };
  }
  worktrees.push(wtDir);

  // The throwaway tree borrows the executor worktree's own modules via a plain
  // symlink (writes pass through — see the header law). The battery must
  // resolve vitest LOCALLY: without this check, npx could fetch a foreign
  // vitest from the network and return a wrong-toolchain green.
  const nm = join(repo, 'node_modules');
  if (existsSync(nm) && !existsSync(join(wtDir, 'node_modules'))) {
    symlinkSync(nm, join(wtDir, 'node_modules'), 'dir');
  }
  if (!existsSync(join(wtDir, 'node_modules', '.bin', 'vitest'))) {
    writeFileSync(setupLog, 'local vitest not resolvable at node_modules/.bin/vitest — refusing to let npx fall back to a network fetch');
    return { name: member.name, exit: 2, phase: 'toolchain', ms: Date.now() - started, log: setupLog };
  }

  const configPath = writeMemberConfig(member, wtDir);
  const resultPath = join(runRoot, `${member.name}.results.json`);
  const battery = await run(
    'npx', [
      'vitest', 'run',
      '--config', configPath,
      '--reporter=dot', '--reporter=json', `--outputFile.json=${resultPath}`,
      ...member.battery,
    ],
    { cwd: wtDir, logFile: batteryLog, detached: true, timeout: timeoutMs },
  );
  if (battery.timedOut) {
    return { name: member.name, exit: 2, phase: 'timeout', ms: Date.now() - started, log: batteryLog };
  }
  if (battery.exit !== 0 && executedTestCount(resultPath) === 0) {
    return { name: member.name, exit: 2, phase: 'startup', ms: Date.now() - started, log: batteryLog };
  }
  return { name: member.name, exit: battery.exit, phase: 'battery', ms: Date.now() - started, log: batteryLog };
}

/** Bounded-concurrency map: at most `jobs` members in flight. */
async function mapBounded(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length && !aborting) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

let results;
try {
  results = await mapBounded(plan.members, jobs, preproofMember);
} catch (err) {
  console.error(`[preproof] harness failure: ${err?.stack ?? err}`);
  await cleanup();
  process.exit(2);
}
await cleanup();
if (signalled) {
  // The signal path owns the exit class; batteries that died to OUR group-kill
  // are not verdicts. Cleanup above is the SAME awaited promise the handler
  // holds, so worktree metadata is already clean here.
  console.error('[preproof] run was signalled — battery verdicts incomplete, NO truncation signal implied.');
  process.exit(2);
}

console.log(`\n[preproof] run ${runId} — ${plan.members.length} member(s), jobs=${jobs}, timeoutMs=${timeoutMs}`);
console.log('| member | phase | exit | seconds | log |');
console.log('|---|---|---:|---:|---|');
for (const r of results.filter(Boolean)) {
  console.log(`| ${r.name} | ${r.phase} | ${r.exit} | ${(r.ms / 1000).toFixed(1)} | ${r.log} |`);
}
const rows = results.filter(Boolean);
const setupFailures = rows.filter((r) => r.phase !== 'battery');
const reds = rows.filter((r) => r.phase === 'battery' && r.exit !== 0);
if (setupFailures.length || rows.length !== plan.members.length) {
  console.log(`[preproof] HARNESS/SETUP FAILURE for: ${setupFailures.map((r) => `${r.name}(${r.phase})`).join(', ') || '(missing verdicts)'} — battery verdicts incomplete, NO truncation signal implied.`);
  process.exit(2);
}
console.log(reds.length === 0
  ? '[preproof] ALL GREEN — advisory only; landing proof still runs at member commits.'
  : `[preproof] ${reds.length} RED — early truncation signal for: ${reds.map((r) => r.name).join(', ')}`);
process.exit(reds.length === 0 ? 0 : 1);
