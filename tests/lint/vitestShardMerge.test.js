/**
 * tests/lint/vitestShardMerge.test.js — the sharded test ratchet's two scripts (CI-SHARD, 2026-11-19).
 *
 * scripts/merge-vitest-shard-reports.mjs merges the six shard reports that
 * scripts/test-ratchet-shard.mjs writes, and the ratchet then judges the merge with --from-log.
 * A merge that let a shard go missing, let a file run twice, or carried a green `success` over a
 * runner that failed would hand the ratchet a report it cannot tell from an honest one. So every
 * refusal is DRIVEN here with small synthetic reports shaped like a real vitest 4 report (the
 * fields were read from one, not from memory), each against a clean control that merges, and
 * one merge is checked to be lossless entry by entry.
 */
import {
  mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync, readdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  afterEach, describe, expect, test,
} from 'vitest';
import {
  mergeShardReports, runMerge, shardReportNameOf, SUMMED_FIELDS, parseMergeArgs,
} from '../../scripts/merge-vitest-shard-reports.mjs';
import {
  exitFileOf, logFileOf, parseShardArgs, runShard, shardCommandOf,
} from '../../scripts/test-ratchet-shard.mjs';
import { runnerCommandOf, runnerEnvOf } from '../../scripts/check-test-ratchet.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const temporary = [];
afterEach(() => {
  while (temporary.length) rmSync(temporary.pop(), { recursive: true, force: true });
});
const tempDir = (label) => {
  const dir = mkdtempSync(join(tmpdir(), `shard-merge-${label}-`));
  temporary.push(dir);
  return dir;
};

/** One suite entry, in the shape vitest 4.1.8's JSON reporter writes. */
function suite(file, tests, { status, startTime = 1000 } = {}) {
  const failed = tests.some((t) => t.status === 'failed');
  return {
    assertionResults: tests.map(({ title, status: s }) => ({
      ancestorTitles: ['group'],
      fullName: `group ${title}`,
      status: s,
      title,
      duration: 1.5,
      failureMessages: s === 'failed' ? [`AssertionError: ${title}`] : [],
      meta: {},
      tags: [],
    })),
    startTime,
    endTime: startTime + 10,
    status: status || (failed ? 'failed' : 'passed'),
    message: '',
    name: join(ROOT, file),
  };
}

/** A whole report over its suites, every counter computed from the rows. */
function report(suites, { startTime = 1000, success } = {}) {
  const rows = suites.flatMap((s) => s.assertionResults);
  const count = (status) => rows.filter((r) => r.status === status).length;
  const failedSuites = suites.filter((s) => s.status === 'failed').length;
  return {
    numTotalTestSuites: suites.length * 2,
    numPassedTestSuites: (suites.length - failedSuites) * 2,
    numFailedTestSuites: failedSuites,
    numPendingTestSuites: 0,
    numTotalTests: rows.length,
    numPassedTests: count('passed'),
    numFailedTests: count('failed'),
    numPendingTests: count('pending') + count('skipped'),
    numTodoTests: count('todo'),
    snapshot: {
      added: 0, failure: false, filesAdded: 0, filesRemoved: 0, filesRemovedList: [], filesUnmatched: 0,
      filesUpdated: 0, matched: 1, total: 1, unchecked: 0, uncheckedKeysByFile: [], unmatched: 0, updated: 0, didUpdate: false,
    },
    startTime,
    success: success ?? count('failed') === 0,
    testResults: suites,
  };
}

/** Three honest shards: shard 2 holds a (banked-style) red, so its runner exited 1. */
function honestShards() {
  return [
    { report: report([suite('tests/a/one.test.js', [{ title: 'a1', status: 'passed' }, { title: 'a2', status: 'passed' }])], { startTime: 3000 }), exit: 0 },
    {
      report: report([
        suite('tests/b/two.test.js', [{ title: 'b1', status: 'failed' }, { title: 'b2', status: 'skipped' }], { startTime: 1000 }),
        suite('tests/b/three.test.js', [{ title: 'b3', status: 'passed' }], { startTime: 1000 }),
      ], { startTime: 1000 }),
      exit: 1,
    },
    { report: report([suite('tests/c/four.test.js', [{ title: 'c1', status: 'todo' }, { title: 'c2', status: 'passed' }])], { startTime: 2000 }), exit: 0 },
  ];
}

/** Write shards into a fresh directory the way test-ratchet-shard.mjs does. */
function writeShards(shards, { count = shards.length, label = 'dir' } = {}) {
  const dir = tempDir(label);
  shards.forEach(({ report: r, exit, raw }, i) => {
    const file = join(dir, shardReportNameOf(i + 1, count));
    if (raw !== undefined) writeFileSync(file, raw);
    else if (r !== null) writeFileSync(file, JSON.stringify(r));
    if (exit !== undefined) {
      writeFileSync(exitFileOf(file), JSON.stringify({ shard: i + 1, count, exit, signal: null }));
    }
  });
  return dir;
}

const merge = (dir, count) => mergeShardReports({ dir, count, root: ROOT });

describe('merge-vitest-shard-reports — the lossless merge', () => {
  test('keeps every entry as written, sums every counter, takes the earliest start', () => {
    const shards = honestShards();
    const result = merge(writeShards(shards), 3);
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    const { merged } = result;
    // Every testResults entry, byte for byte, in shard order.
    expect(merged.testResults).toEqual(shards.flatMap((s) => s.report.testResults));
    expect(merged.testResults).toHaveLength(4);
    for (const field of SUMMED_FIELDS) {
      expect(merged[field], field).toBe(shards.reduce((n, s) => n + s.report[field], 0));
    }
    expect(merged.numTotalTests).toBe(7);
    expect(merged.numFailedTests).toBe(1);
    expect(merged.startTime).toBe(1000);
    expect(merged.snapshot.matched).toBe(3);
    expect(merged.snapshot.failure).toBe(false);
    expect(merged.snapshot.filesRemovedList).toEqual([]);
    // Nothing the merge does not own is invented, and nothing is dropped.
    expect(Object.keys(merged).sort()).toEqual(Object.keys(shards[0].report).sort());
    // A banked-style red is NOT a merge refusal (the ratchet judges it), but success is false.
    expect(merged.success).toBe(false);
  });

  test('success is true only when every report says success AND every runner exited 0', () => {
    const green = () => [
      { report: report([suite('tests/a/one.test.js', [{ title: 'a1', status: 'passed' }])]), exit: 0 },
      { report: report([suite('tests/b/two.test.js', [{ title: 'b1', status: 'passed' }])]), exit: 0 },
    ];
    expect(merge(writeShards(green()), 2).merged.success).toBe(true);
    // One report that says failure: false, though every runner exited 0.
    const oneRed = green();
    oneRed[1].report.success = false;
    const r = merge(writeShards(oneRed), 2);
    expect(r.ok).toBe(true);
    expect(r.merged.success).toBe(false);
  });

  test('the CLI writes the merged report outside the tree and nothing on a refusal', () => {
    const dir = writeShards(honestShards());
    const out = join(tempDir('out'), 'merged.json');
    expect(runMerge(['--count', '3', '--dir', dir, '--out', out], ROOT)).toBe(0);
    expect(JSON.parse(readFileSync(out, 'utf8')).testResults).toHaveLength(4);

    const refusedOut = join(tempDir('out'), 'merged.json');
    expect(runMerge(['--count', '4', '--dir', dir, '--out', refusedOut], ROOT)).toBe(1);
    expect(existsSync(refusedOut), 'a refused merge wrote a report').toBe(false);
    expect(readdirSync(dirname(refusedOut))).toEqual([]);

    expect(runMerge(['--count', '3', '--dir', dir, '--out', join(ROOT, 'merged.json')], ROOT)).toBe(2);
    expect(existsSync(join(ROOT, 'merged.json'))).toBe(false);
    expect(parseMergeArgs(['--count', '0', '--dir', dir, '--out', out]).error).toMatch(/positive integer/);
    expect(parseMergeArgs(['--dir', dir, '--out', out]).error).toMatch(/--count is required/);
  });
});

describe('merge-vitest-shard-reports — every refusal fails closed with its own message', () => {
  /** Assert a refusal: not ok, no merged report, and the named message present. */
  const refused = (result, pattern) => {
    expect(result.ok).toBe(false);
    expect(result.merged).toBe(null);
    expect(result.errors.some((e) => pattern.test(e)), `no refusal matched ${pattern}:\n${result.errors.join('\n')}`).toBe(true);
  };

  test('control: the honest shards merge (so each refusal below is caused by its plant)', () => {
    expect(merge(writeShards(honestShards()), 3).ok).toBe(true);
  });

  test('a shard report that is MISSING', () => {
    const shards = honestShards();
    shards[1].report = null;
    refused(merge(writeShards(shards), 3), /shard 2: its report is MISSING/);
  });

  test('a shard report that is UNPARSEABLE', () => {
    const shards = honestShards();
    shards[2].raw = '{"numTotalTests": 3, "testResults": [';
    refused(merge(writeShards(shards), 3), /shard 3: its report is UNPARSEABLE/);
  });

  test('a shard report that is JSON but not a vitest report', () => {
    const shards = honestShards();
    shards[0].raw = JSON.stringify({ hello: 'world' });
    refused(merge(writeShards(shards), 3), /shard 1: its report is not a vitest JSON report/);
  });

  test('the number of reports is not the declared count', () => {
    // Four reports on disk, declared count 3: the extra one is counted AND named.
    const shards = [...honestShards(), { report: report([suite('tests/d/five.test.js', [{ title: 'd', status: 'passed' }])]), exit: 0 }];
    const dir = writeShards(shards, { count: 3 });
    const result = merge(dir, 3);
    refused(result, /the directory holds 4 shard report\(s\), but the declared count is 3/);
    refused(result, /not shard 1\.\.3 of 3: shard-4-of-3\.json/);
    // …and a report of a DIFFERENT count in place of a missing one is not accepted either.
    const swapped = writeShards(honestShards());
    rmSync(join(swapped, shardReportNameOf(3, 3)));
    writeFileSync(join(swapped, 'shard-3-of-4.json'), JSON.stringify(honestShards()[2].report));
    refused(merge(swapped, 3), /not shard 1\.\.3 of 3: shard-3-of-4\.json/);
  });

  test('a test file that appears in TWO shards', () => {
    const shards = honestShards();
    shards[2].report.testResults.push(suite('tests/a/one.test.js', [{ title: 'a1', status: 'passed' }]));
    refused(merge(writeShards(shards), 3), /tests\/a\/one\.test\.js appears in TWO shards: 1 and 3/);
  });

  test('a test file that appears twice in ONE shard', () => {
    const shards = honestShards();
    shards[0].report.testResults.push(suite('tests/a/one.test.js', [{ title: 'a1', status: 'passed' }]));
    refused(merge(writeShards(shards), 3), /tests\/a\/one\.test\.js appears TWICE in shard 1/);
  });

  test('a shard that holds ZERO files', () => {
    const shards = honestShards();
    shards[2].report = report([]);
    refused(merge(writeShards(shards), 3), /shard 3: its report holds ZERO test files/);
  });

  test('a shard whose exit file is MISSING', () => {
    const shards = honestShards();
    delete shards[0].exit;
    refused(merge(writeShards(shards), 3), /shard 1: its exit file is MISSING/);
  });

  test('a shard whose exit file is unreadable or names another shard', () => {
    const shards = honestShards();
    const dir = writeShards(shards);
    writeFileSync(exitFileOf(join(dir, shardReportNameOf(2, 3))), 'not json');
    refused(merge(dir, 3), /shard 2: its exit file is UNPARSEABLE/);
    const dir2 = writeShards(honestShards());
    writeFileSync(exitFileOf(join(dir2, shardReportNameOf(2, 3))), JSON.stringify({ shard: 1, count: 3, exit: 0 }));
    refused(merge(dir2, 3), /shard 2: its exit file names shard 1 of 3/);
  });

  test('a shard whose runner exited NON-ZERO while its report says success', () => {
    const shards = honestShards();
    shards[0].exit = 1; // shard 1's report says success: true
    refused(merge(writeShards(shards), 3), /shard 1: the runner exited 1 while its report says success/);
    const killed = honestShards();
    killed[2].exit = null; // a signal kill records no exit status
    const dir = writeShards(killed);
    writeFileSync(exitFileOf(join(dir, shardReportNameOf(3, 3))), JSON.stringify({ shard: 3, count: 3, exit: null, signal: 'SIGKILL' }));
    refused(merge(dir, 3), /shard 3: the runner exited on signal SIGKILL while its report says success/);
  });

  test('a report field the merge cannot merge losslessly, or a counter that is not a number', () => {
    const shards = honestShards();
    shards[1].report.coverageMap = {};
    refused(merge(writeShards(shards), 3), /shard 2: its report carries field\(s\) this merge cannot merge losslessly: coverageMap/);
    const noCounter = honestShards();
    delete noCounter[0].report.numPendingTests;
    refused(merge(writeShards(noCounter), 3), /shard 1: its report's `numPendingTests` is not a number/);
  });

  test('a snapshot summary, an exit or a success flag of the wrong shape', () => {
    const badSnapshot = honestShards();
    badSnapshot[0].report.snapshot = [];
    refused(merge(writeShards(badSnapshot), 3), /shard 1: `snapshot` is not an object/);
    const badSnapshotField = honestShards();
    badSnapshotField[1].report.snapshot.added = 'three';
    refused(merge(writeShards(badSnapshotField), 3), /shard 2: snapshot\.added is neither a number, a flag nor a list/);
    const badExit = writeShards(honestShards());
    writeFileSync(exitFileOf(join(badExit, shardReportNameOf(1, 3))), JSON.stringify({ shard: 1, count: 3, exit: '0' }));
    refused(merge(badExit, 3), /shard 1: its exit file carries no integer exit \("0"\)/);
    const badSuccess = honestShards();
    badSuccess[2].report.success = 'true';
    refused(merge(writeShards(badSuccess), 3), /shard 3: its report's `success` is not a flag/);
  });

  test('a missing directory and a bad count refuse rather than throw', () => {
    refused(merge(join(tempDir('gone'), 'nope'), 3), /the shard directory cannot be read/);
    refused(merge(writeShards(honestShards()), 0), /declared shard count must be a positive integer/);
  });
});

describe('test-ratchet-shard — the ratchet\'s own runner, one shard of it', () => {
  test('the command is the ratchet\'s source-phase runner command with --shard appended', () => {
    const out = '/tmp/x/shard-2-of-6.json';
    expect(shardCommandOf(2, 6, out)).toBe(`${runnerCommandOf({ outputFile: out })} --shard=2/6`);
    expect(shardCommandOf(2, 6, out)).toBe(
      'npx vitest run --exclude="tests/build/**" --reporter=json --outputFile="/tmp/x/shard-2-of-6.json" --shard=2/6',
    );
  });

  test('the runner environment is the ratchet\'s source-phase environment', () => {
    const env = runnerEnvOf({ outputFile: '/tmp/r.json' }, { KEEP: '1', VERIFY_DIST: '1', VERIFY_ENGINE_REMOTE_DIST: '1' });
    expect(env).toEqual({ KEEP: '1', TEST_RATCHET_OUTPUT_FILE: '/tmp/r.json' });
    const dist = runnerEnvOf({ verifyDist: true, outputFile: '/tmp/d.json' }, { KEEP: '1' });
    expect(dist).toEqual({
      KEEP: '1', TEST_RATCHET_OUTPUT_FILE: '/tmp/d.json', VERIFY_DIST: '1', VERIFY_ENGINE_REMOTE_DIST: '1',
    });
  });

  test('argv refusals: count, order, and a report path inside the repository', () => {
    const out = join(tempDir('args'), 'r.json');
    expect(parseShardArgs(['1', '6', out]).error).toBeUndefined();
    expect(parseShardArgs(['0', '6', out]).error).toMatch(/positive integers/);
    expect(parseShardArgs(['7', '6', out]).error).toMatch(/larger than count/);
    expect(parseShardArgs(['1', '6']).error).toMatch(/expected 3 arguments/);
    expect(parseShardArgs(['1', '6', join(ROOT, 'r.json')]).error).toMatch(/inside the repository/);
  });

  /** A fake runner, through the ratchet's own TEST_RATCHET_RUN_CMD seam. */
  function withFakeRunner(body, fn) {
    const dir = tempDir('fake');
    const script = join(dir, 'fake-vitest.mjs');
    writeFileSync(script, body);
    const saved = { cmd: process.env.TEST_RATCHET_RUN_CMD, dist: process.env.VERIFY_DIST };
    process.env.TEST_RATCHET_RUN_CMD = `node ${JSON.stringify(script)}`;
    process.env.VERIFY_DIST = '1';
    try {
      return fn(dir);
    } finally {
      if (saved.cmd === undefined) delete process.env.TEST_RATCHET_RUN_CMD; else process.env.TEST_RATCHET_RUN_CMD = saved.cmd;
      if (saved.dist === undefined) delete process.env.VERIFY_DIST; else process.env.VERIFY_DIST = saved.dist;
    }
  }

  test('a red runner that wrote its report: the shard exits 0 and records exit 1 beside it', () => {
    withFakeRunner([
      "import fs from 'node:fs';",
      "fs.writeFileSync(process.env.TEST_RATCHET_OUTPUT_FILE, JSON.stringify({ sawVerifyDist: process.env.VERIFY_DIST ?? null }));",
      "console.log('fake vitest ran');",
      'process.exit(1);',
    ].join('\n'), (dir) => {
      const out = join(dir, 'shards', 'shard-2-of-6.json');
      mkdirSync(dirname(out), { recursive: true });
      expect(runShard(['2', '6', out])).toBe(0);
      // The runner was spawned with the SOURCE-phase environment: VERIFY_DIST stripped.
      expect(JSON.parse(readFileSync(out, 'utf8')).sawVerifyDist).toBe(null);
      const exit = JSON.parse(readFileSync(exitFileOf(out), 'utf8'));
      expect(exit).toMatchObject({ shard: 2, count: 6, exit: 1, signal: null });
      expect(readFileSync(logFileOf(out), 'utf8')).toContain('fake vitest ran');
    });
  }, 20_000);

  test('a runner that wrote NO report: the shard exits 1 and still records the exit', () => {
    withFakeRunner('process.exit(3);', (dir) => {
      const out = join(dir, 'shard-1-of-6.json');
      expect(runShard(['1', '6', out])).toBe(1);
      expect(existsSync(out)).toBe(false);
      expect(JSON.parse(readFileSync(exitFileOf(out), 'utf8')).exit).toBe(3);
    });
  }, 20_000);
});
