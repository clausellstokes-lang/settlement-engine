#!/usr/bin/env node
/**
 * test-ratchet-shard.mjs — run ONE shard of the test ratchet's source phase (CI-SHARD, 2026-11-19).
 *
 *   node scripts/test-ratchet-shard.mjs <index> <count> <report.json>
 *
 * ── WHY ─────────────────────────────────────────────────────────────────────
 * The ratchet's serial run outgrew its CI job: 113m45s to 132m33s on the last four runs of the
 * line, two of them cut at the 135-minute cap. CI now runs the source phase as six shards and
 * judges the union once (.github/workflows/ci.yml, jobs `check-tests-shard` and `check-tests`).
 *
 * ── WHAT THIS RUNS, AND WHAT IT DOES NOT DECIDE ─────────────────────────────
 * The ratchet's OWN runner command (`runnerCommandOf`, never a hand copy of its flags) with
 * `--shard=<index>/<count>` appended, spawned with the ratchet's OWN runner environment
 * (`runnerEnvOf`) and the same spawn options `run` uses. So a shard holds exactly the files that
 * vitest's own sequencer gives that index of the serial file set, and runs them exactly as the
 * serial ratchet would.
 *
 * ⛔ THIS IS NOT A VERDICT. vitest exits non-zero on ANY red, including the census's banked rows,
 * so a shard's exit code cannot say whether the gate is green. This script records the runner's
 * exit beside the report (`<report.json>.exit.json`) and exits 0 whenever the runner wrote a
 * report. The verdict is `npm run test:ratchet -- --from-log <merged report>` over the merge of
 * every shard (scripts/merge-vitest-shard-reports.mjs), which fails CLOSED on a missing report or
 * exit file, a missing shard, an overlap, an empty shard, and an exit that contradicts its report.
 * This script exits non-zero only when it was called wrongly or the runner wrote NO report.
 *
 * ⚠ THE REPORT LIVES OUTSIDE THE REPOSITORY, as the ratchet's own does (its header: a report
 * path inside the tree has overwritten tracked files before). A path inside the tree is refused.
 *
 * TEST_RATCHET_RUN_CMD, the ratchet's injected-runner seam, is honoured with the same meaning:
 * when set it REPLACES the runner command, and the runner is still handed the report path in
 * TEST_RATCHET_OUTPUT_FILE. CI never sets it.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runnerCommandOf, runnerEnvOf } from './check-test-ratchet.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The exit file written beside a shard's report. Exported so the merge reads the SAME name. */
export const exitFileOf = (reportFile) => `${reportFile}.exit.json`;

/** The runner output file written beside a shard's report (for the reader; nothing judges it). */
export const logFileOf = (reportFile) => `${reportFile}.log`;

/** Whether `target` resolves inside `root` (the repository). */
export function isInside(root, target) {
  const rel = path.relative(path.resolve(root), path.resolve(target));
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

/** The exact shard command: the ratchet's source-phase runner command plus `--shard`. */
export function shardCommandOf(index, count, outputFile) {
  return `${runnerCommandOf({ outputFile })} --shard=${index}/${count}`;
}

/**
 * Validate the argv. Returns `{ index, count, reportFile }` or `{ error }`.
 * @param {string[]} argv
 */
export function parseShardArgs(argv, root = ROOT) {
  if (argv.length !== 3) return { error: `expected 3 arguments (<index> <count> <report.json>), got ${argv.length}` };
  const [rawIndex, rawCount, rawReport] = argv;
  if (!/^[1-9]\d*$/.test(rawIndex) || !/^[1-9]\d*$/.test(rawCount)) {
    return { error: `index and count must be positive integers (got ${JSON.stringify(rawIndex)} and ${JSON.stringify(rawCount)})` };
  }
  const index = Number(rawIndex);
  const count = Number(rawCount);
  if (index > count) return { error: `index ${index} is larger than count ${count}` };
  const reportFile = path.resolve(rawReport);
  if (isInside(root, reportFile)) {
    return { error: `the report path is inside the repository (${reportFile}); write it outside the tree` };
  }
  return { index, count, reportFile };
}

/**
 * Run one shard. Returns the process exit code (0 when the runner wrote a report, whatever its
 * own exit). Never calls process.exit, so a test can drive it in-process.
 */
export function runShard(argv) {
  const args = parseShardArgs(argv);
  if (args.error) {
    console.error(`[test-ratchet-shard] ${args.error}`);
    console.error('  usage: node scripts/test-ratchet-shard.mjs <index> <count> <report.json outside the repository>');
    return 2;
  }
  const { index, count, reportFile } = args;
  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  for (const stale of [reportFile, exitFileOf(reportFile), logFileOf(reportFile)]) fs.rmSync(stale, { force: true });

  const command = process.env.TEST_RATCHET_RUN_CMD || shardCommandOf(index, count, reportFile);
  const startedAt = new Date().toISOString();
  const t0 = Date.now();
  let exit = 0;
  let signal = null;
  let output;
  try {
    output = execSync(command, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 256 * 1024 * 1024,
      env: runnerEnvOf({ verifyDist: false, outputFile: reportFile }),
    });
  } catch (e) {
    exit = Number.isInteger(e.status) ? e.status : null;
    signal = e.signal || null;
    output = `${e.stdout || ''}${e.stderr || ''}`;
  }
  const seconds = Math.round((Date.now() - t0) / 1000);
  fs.writeFileSync(logFileOf(reportFile), output || '');
  fs.writeFileSync(exitFileOf(reportFile), `${JSON.stringify({
    shard: index, count, exit, signal, seconds, startedAt, command,
  }, null, 2)}\n`);

  const reported = fs.existsSync(reportFile);
  console.log(`[test-ratchet-shard] shard ${index}/${count}: runner exit ${exit === null ? `none (signal ${signal})` : exit}`
    + ` after ${seconds}s; report ${reported ? 'written' : 'ABSENT'}: ${reportFile}`);
  console.log('  This exit is NOT the verdict: the verdict job merges every shard and runs the ratchet once.');
  if (!reported) {
    console.error('[test-ratchet-shard] the runner wrote NO REPORT — this shard measured nothing. Runner output (tail):');
    console.error((output || '(no output at all — is vitest installed?)').trim().slice(-4000));
    return 1;
  }
  return 0;
}

const invokedDirectly = process.argv[1]
  && path.relative(process.argv[1], fileURLToPath(import.meta.url)) === '';
if (invokedDirectly) process.exit(runShard(process.argv.slice(2)));
