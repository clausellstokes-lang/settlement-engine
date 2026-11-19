#!/usr/bin/env node
/**
 * merge-vitest-shard-reports.mjs — merge the test ratchet's shard reports into ONE vitest JSON
 * report for the ratchet's read-only verdict (CI-SHARD, 2026-11-19).
 *
 *   node scripts/merge-vitest-shard-reports.mjs --count <n> --dir <shard dir> --out <merged.json>
 *
 * <shard dir> holds what scripts/test-ratchet-shard.mjs wrote for every shard i of n:
 * `shard-<i>-of-<n>.json` (the runner's report) and `shard-<i>-of-<n>.json.exit.json` (its exit).
 * The merged report is then judged by `npm run test:ratchet -- --from-log <merged.json>`, the same
 * census, ceilings and scope sentinel as the serial run.
 *
 * ── IT FAILS CLOSED, each case with its own message, and writes NOTHING when it does ─────────
 *   · a shard's report is missing, or unparseable, or not a vitest report;
 *   · the number of reports in the directory is not the declared count;
 *   · a test file appears in two shards (or twice in one);
 *   · a shard holds zero files;
 *   · a shard's exit file is missing or unreadable, or names another shard;
 *   · a shard's runner exited non-zero while its report says success;
 *   · a report carries a field this merge does not know how to merge losslessly.
 * Every refusal is printed, not only the first, and the exit code is 1.
 *
 * ── IT MERGES LOSSLESSLY ────────────────────────────────────────────────────
 * Every `testResults` entry is kept exactly as the runner wrote it, in shard order. The numeric
 * totals are summed; the snapshot summary's numbers are summed, its flags OR-ed and its lists
 * concatenated; `startTime` is the earliest. `success` is true ONLY if every shard's report says
 * success AND every shard's runner exited 0. That matters because `--from-log` takes the runner's
 * exit from `report.success` (scripts/check-test-ratchet.mjs, the FROM_LOG branch).
 *
 * ⚠ ONE THING THE MERGE CANNOT KEEP, stated so it is not rediscovered. The ratchet's
 * `collapsedSuitesOf` NAMES a dead suite by its clock: start and end equal to the REPORT's
 * startTime. Each shard has its own startTime, and the merged report carries only the earliest,
 * so a dead suite in any shard but the earliest is not NAMED by that arm. The DETECTION is
 * unaffected: the count disagreement (`pendingGapOf`) is computed from the summed counters and
 * the rows, both exact, and it still reds the gate. Only the naming aid (and its subtraction from
 * the skip ceiling) is lost, which can only make a collapsed run redder, never greener. Each
 * shard's own startTime is printed below, so a reader can name the suite by hand.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizePath } from './check-test-ratchet.mjs';
import { exitFileOf, isInside } from './test-ratchet-shard.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The report file name of shard `index` of `count`. Exported so the CI step and tests agree. */
export const shardReportNameOf = (index, count) => `shard-${index}-of-${count}.json`;
const REPORT_NAME = /^shard-(\d+)-of-(\d+)\.json$/;

/** The vitest JSON report's summed counters (measured on a vitest 4.1.8 report). */
export const SUMMED_FIELDS = Object.freeze([
  'numTotalTestSuites', 'numPassedTestSuites', 'numFailedTestSuites', 'numPendingTestSuites',
  'numTotalTests', 'numPassedTests', 'numFailedTests', 'numPendingTests', 'numTodoTests',
]);
const KNOWN_FIELDS = new Set([...SUMMED_FIELDS, 'snapshot', 'startTime', 'success', 'testResults']);

/** Merge the snapshot summaries: numbers summed, flags OR-ed, lists concatenated. */
function mergeSnapshots(snapshots, refuse) {
  const merged = {};
  for (const { shard, snapshot } of snapshots) {
    if (snapshot === undefined) continue;
    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
      refuse(`shard ${shard}: \`snapshot\` is not an object, so it cannot be merged losslessly`);
      continue;
    }
    for (const [key, value] of Object.entries(snapshot)) {
      if (typeof value === 'number') merged[key] = (merged[key] ?? 0) + value;
      else if (typeof value === 'boolean') merged[key] = Boolean(merged[key]) || value;
      else if (Array.isArray(value)) merged[key] = [...(merged[key] ?? []), ...value];
      else refuse(`shard ${shard}: snapshot.${key} is neither a number, a flag nor a list, so it cannot be merged losslessly`);
    }
  }
  return merged;
}

/**
 * Read and merge the shard reports in `dir`. Never throws on bad input and never writes.
 * @returns {{ ok: boolean, errors: string[], merged: object|null, shards: object[] }}
 */
export function mergeShardReports({ dir, count, root = ROOT }) {
  const errors = [];
  const refuse = (line) => errors.push(line);
  if (!Number.isInteger(count) || count < 1) {
    return { ok: false, errors: [`the declared shard count must be a positive integer (got ${JSON.stringify(count)})`], merged: null, shards: [] };
  }
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch (error) {
    return { ok: false, errors: [`the shard directory cannot be read: ${dir} (${error.message})`], merged: null, shards: [] };
  }

  // THE COUNT: every report-shaped file in the directory, whatever shard it claims to be.
  const reportNames = names.filter((name) => REPORT_NAME.test(name)).sort();
  if (reportNames.length !== count) {
    refuse(`the directory holds ${reportNames.length} shard report(s), but the declared count is ${count}:`
      + ` [${reportNames.join(', ') || 'none'}]`);
  }
  const foreign = reportNames.filter((name) => {
    const [, i, n] = REPORT_NAME.exec(name);
    return Number(n) !== count || Number(i) < 1 || Number(i) > count;
  });
  if (foreign.length) refuse(`report(s) that are not shard 1..${count} of ${count}: ${foreign.join(', ')}`);

  const shards = [];
  const fileOwner = new Map();
  const reports = [];
  for (let index = 1; index <= count; index += 1) {
    const name = shardReportNameOf(index, count);
    const reportPath = path.join(dir, name);
    const row = { shard: index, report: reportPath };
    shards.push(row);

    // THE EXIT FILE: what the runner itself returned. Read first, judged after the report.
    const exitPath = exitFileOf(reportPath);
    let exitRecord = null;
    if (!fs.existsSync(exitPath)) {
      refuse(`shard ${index}: its exit file is MISSING (${exitPath}) — the runner's exit is unknown, so the shard is not judged`);
    } else {
      try {
        exitRecord = JSON.parse(fs.readFileSync(exitPath, 'utf8'));
      } catch (error) {
        refuse(`shard ${index}: its exit file is UNPARSEABLE (${error.message}): ${exitPath}`);
      }
      if (exitRecord && (exitRecord.shard !== index || exitRecord.count !== count)) {
        refuse(`shard ${index}: its exit file names shard ${JSON.stringify(exitRecord.shard)} of ${JSON.stringify(exitRecord.count)}`);
        exitRecord = null;
      } else if (exitRecord && exitRecord.exit !== null && !Number.isInteger(exitRecord.exit)) {
        refuse(`shard ${index}: its exit file carries no integer exit (${JSON.stringify(exitRecord.exit)})`);
        exitRecord = null;
      }
    }
    row.exit = exitRecord ? exitRecord.exit : undefined;
    row.signal = exitRecord ? exitRecord.signal : undefined;

    if (!fs.existsSync(reportPath)) {
      refuse(`shard ${index}: its report is MISSING (${reportPath}) — every file of that shard would leave the run unmeasured`);
      continue;
    }
    let report;
    try {
      report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    } catch (error) {
      refuse(`shard ${index}: its report is UNPARSEABLE (${error.message}): ${reportPath}`);
      continue;
    }
    if (!report || typeof report !== 'object' || Array.isArray(report) || !Array.isArray(report.testResults)) {
      refuse(`shard ${index}: its report is not a vitest JSON report (no \`testResults\` list): ${reportPath}`);
      continue;
    }
    const unknown = Object.keys(report).filter((key) => !KNOWN_FIELDS.has(key));
    if (unknown.length) {
      refuse(`shard ${index}: its report carries field(s) this merge cannot merge losslessly: ${unknown.join(', ')}`);
    }
    for (const field of [...SUMMED_FIELDS, 'startTime']) {
      if (typeof report[field] !== 'number' || !Number.isFinite(report[field])) {
        refuse(`shard ${index}: its report's \`${field}\` is not a number (${JSON.stringify(report[field])})`);
      }
    }
    if (typeof report.success !== 'boolean') {
      refuse(`shard ${index}: its report's \`success\` is not a flag (${JSON.stringify(report.success)})`);
    }
    if (report.testResults.length === 0) {
      refuse(`shard ${index}: its report holds ZERO test files — an empty shard proves nothing ran there`);
    }
    for (const suite of report.testResults) {
      const file = normalizePath(suite?.name || suite?.file || '(unnamed suite)', root);
      const owner = fileOwner.get(file);
      if (owner !== undefined) {
        refuse(owner === index
          ? `${file} appears TWICE in shard ${index}`
          : `${file} appears in TWO shards: ${owner} and ${index} — the shards are not a partition`);
      } else fileOwner.set(file, index);
    }
    if (exitRecord && exitRecord.exit !== 0 && report.success === true) {
      refuse(`shard ${index}: the runner exited ${exitRecord.exit === null ? `on signal ${exitRecord.signal}` : exitRecord.exit}`
        + ' while its report says success — the report does not describe how the run ended (an error outside any test?)');
    }
    row.files = report.testResults.length;
    row.tests = report.numTotalTests;
    row.failed = report.numFailedTests;
    row.success = report.success;
    row.startTime = report.startTime;
    reports.push({ index, report, exit: exitRecord ? exitRecord.exit : undefined });
  }

  if (errors.length) return { ok: false, errors, merged: null, shards };

  const merged = {};
  for (const field of SUMMED_FIELDS) merged[field] = reports.reduce((n, { report }) => n + report[field], 0);
  const snapshots = reports.map(({ index, report }) => ({ shard: index, snapshot: report.snapshot }));
  if (snapshots.some(({ snapshot }) => snapshot !== undefined)) merged.snapshot = mergeSnapshots(snapshots, refuse);
  merged.startTime = Math.min(...reports.map(({ report }) => report.startTime));
  merged.success = reports.every(({ report, exit }) => report.success === true && exit === 0);
  merged.testResults = reports.flatMap(({ report }) => report.testResults);
  if (errors.length) return { ok: false, errors, merged: null, shards };
  return { ok: true, errors, merged, shards };
}

/** Parse `--count <n> --dir <dir> --out <file>` (either `--flag value` or `--flag=value`). */
export function parseMergeArgs(argv) {
  const values = {};
  for (let i = 0; i < argv.length; i += 1) {
    const match = /^--(count|dir|out)(?:=(.*))?$/.exec(argv[i]);
    if (!match) return { error: `unknown argument ${JSON.stringify(argv[i])}` };
    const value = match[2] !== undefined ? match[2] : argv[++i];
    if (value === undefined || value === '' || value.startsWith('--')) return { error: `--${match[1]} needs a value` };
    if (values[match[1]] !== undefined) return { error: `--${match[1]} was given twice` };
    values[match[1]] = value;
  }
  for (const key of ['count', 'dir', 'out']) if (values[key] === undefined) return { error: `--${key} is required` };
  if (!/^[1-9]\d*$/.test(values.count)) return { error: `--count must be a positive integer (got ${JSON.stringify(values.count)})` };
  return { count: Number(values.count), dir: path.resolve(values.dir), out: path.resolve(values.out) };
}

/** The CLI. Returns an exit code; never calls process.exit. */
export function runMerge(argv, root = ROOT) {
  const args = parseMergeArgs(argv);
  if (args.error) {
    console.error(`[merge-shards] ${args.error}`);
    console.error('  usage: node scripts/merge-vitest-shard-reports.mjs --count <n> --dir <shard dir> --out <merged.json>');
    return 2;
  }
  if (isInside(root, args.out)) {
    console.error(`[merge-shards] the merged report path is inside the repository (${args.out}); write it outside the tree.`);
    return 2;
  }
  const result = mergeShardReports({ dir: args.dir, count: args.count, root });
  for (const s of result.shards) {
    console.log(`  shard ${s.shard}/${args.count}: files ${s.files ?? '?'} · tests ${s.tests ?? '?'} · failed ${s.failed ?? '?'}`
      + ` · report success ${s.success ?? '?'} · runner exit ${s.exit === undefined ? '?' : s.exit}`
      + ` · startTime ${s.startTime ?? '?'}`);
  }
  if (!result.ok) {
    console.error(`[merge-shards] REFUSED — ${result.errors.length} reason(s); no merged report was written, so no verdict can be taken:`);
    for (const line of result.errors) console.error(`  ✗ ${line}`);
    return 1;
  }
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  const tmp = `${args.out}.partial`;
  fs.writeFileSync(tmp, JSON.stringify(result.merged));
  fs.renameSync(tmp, args.out);
  const m = result.merged;
  console.log(`[merge-shards] merged ${args.count} shard(s): ${m.testResults.length} files, ${m.numTotalTests} tests,`
    + ` ${m.numFailedTests} failed, success ${m.success} → ${args.out}`);
  console.log('  This is not the verdict either: the ratchet judges this report next (--from-log).');
  return 0;
}

const invokedDirectly = process.argv[1]
  && path.relative(process.argv[1], fileURLToPath(import.meta.url)) === '';
if (invokedDirectly) process.exit(runMerge(process.argv.slice(2)));
