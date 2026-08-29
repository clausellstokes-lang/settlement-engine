import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const SCRIPT = resolve(ROOT, 'scripts/gate-mutex.sh');
const tempRoots = [];
const children = new Set();

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'gate-mutex-test-'));
  tempRoots.push(root);
  return {
    root,
    lock: join(root, 'vitest.lock'),
    firstDone: join(root, 'first-done'),
    secondEntered: join(root, 'second-entered'),
  };
}

function lockEnv(lock, extra = {}) {
  return {
    ...process.env,
    GATE_MUTEX_LOCK_DIR: lock,
    GATE_MUTEX_MAX_POLLS: '30',
    GATE_MUTEX_POLL_SECONDS: '0.02',
    // The unique temp lock is the complete fixture boundary. Ambient Vitest
    // processes from other agents on the shared machine are not part of it.
    GATE_MUTEX_LEGACY_SCAN: '0',
    ...extra,
  };
}

function run(lock, args, extra = {}) {
  return spawnSync('sh', [SCRIPT, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: lockEnv(lock, extra),
  });
}

function start(lock, args, extra = {}) {
  const child = spawn('sh', [SCRIPT, ...args], {
    cwd: ROOT,
    env: lockEnv(lock, extra),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  children.add(child);
  return child;
}

function resultOf(child) {
  return new Promise((resolveResult, reject) => {
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', (code, signal) => {
      children.delete(child);
      resolveResult({ code, signal, stdout, stderr });
    });
  });
}

async function waitFor(predicate, label, timeoutMs = 2000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 10));
  }
  throw new Error(`timed out waiting for ${label}`);
}

afterEach(() => {
  for (const child of children) child.kill('SIGKILL');
  children.clear();
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('gate-mutex --run atomic ownership', () => {
  it('excludes a second caller until release and preserves each child status', async () => {
    const f = fixture();
    const first = start(f.lock, [
      '--run', '--', 'sh', '-c',
      'sleep 0.20; printf done > "$FIRST_DONE"; exit 7',
    ], { FIRST_DONE: f.firstDone });
    const firstResult = resultOf(first);

    await waitFor(() => existsSync(join(f.lock, 'pid')), 'first lock acquisition');

    const second = start(f.lock, [
      '--run', '--', 'sh', '-c',
      'test -f "$FIRST_DONE" && printf entered > "$SECOND_ENTERED"',
    ], { FIRST_DONE: f.firstDone, SECOND_ENTERED: f.secondEntered });
    const secondResult = resultOf(second);

    await new Promise((resolveWait) => setTimeout(resolveWait, 60));
    expect(existsSync(f.secondEntered)).toBe(false);

    const [firstExit, secondExit] = await Promise.all([firstResult, secondResult]);
    expect(firstExit.code, `${firstExit.stdout}\n${firstExit.stderr}`).toBe(7);
    expect(secondExit.code, `${secondExit.stdout}\n${secondExit.stderr}`).toBe(0);
    expect(readFileSync(f.secondEntered, 'utf8')).toBe('entered');
    expect(existsSync(f.lock)).toBe(false);
  });

  it('reclaims a dead owner immediately even when the caller permits zero polls', () => {
    const f = fixture();
    mkdirSync(f.lock);
    writeFileSync(join(f.lock, 'pid'), '99999999\n');

    const result = run(
      f.lock,
      ['--run', '--', 'sh', '-c', 'exit 23'],
      { GATE_MUTEX_MAX_POLLS: '0', GATE_MUTEX_POLL_SECONDS: '0' },
    );

    expect(result.status).toBe(23);
    expect(result.stdout).toMatch(/acquired atomic lock/i);
    expect(existsSync(f.lock)).toBe(false);
  });

  // ── THE OWNERLESS WINDOW (ODQ §351.2 / §364 R1) ────────────────────────────────────
  // A creator killed between `mkdir "$LOCK_DIR"` and its pid write leaves a directory
  // with no readable owner. Every recovery arm demanded a readable DEAD owner, so that
  // directory was permanently unreapable: describe_lock reported "an unreadable owner"
  // forever and every --run caller polled to GAVE UP (exit 3). Age is the only evidence
  // such a directory can produce, so the reap is grace-guarded — and the fresh arms
  // below are what keep the guard honest, since a lock inside its (millisecond)
  // acquisition window must never be stolen.
  const backdate = (target) => {
    const old = new Date(Date.now() - 6 * 60 * 60 * 1000);
    utimesSync(target, old, old);
  };

  it('reaps an aged ownerless lock left by a creator killed mid-acquisition', () => {
    const f = fixture();
    mkdirSync(f.lock);
    backdate(f.lock);

    const result = run(
      f.lock,
      ['--run', '--', 'sh', '-c', 'exit 23'],
      { GATE_MUTEX_MAX_POLLS: '0', GATE_MUTEX_POLL_SECONDS: '0' },
    );

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(23);
    expect(result.stdout).toMatch(/acquired atomic lock/i);
    expect(existsSync(f.lock)).toBe(false);
  });

  it('never reaps a fresh ownerless lock still inside its acquisition window', () => {
    const f = fixture();
    mkdirSync(f.lock);

    const result = run(
      f.lock,
      ['--run', '--', 'sh', '-c', 'exit 23'],
      { GATE_MUTEX_MAX_POLLS: '0', GATE_MUTEX_POLL_SECONDS: '0' },
    );

    expect(result.status).toBe(3);
    expect(result.stdout).toMatch(/GAVE UP/i);
    expect(existsSync(f.lock)).toBe(true);
    expect(existsSync(join(f.lock, 'pid'))).toBe(false);
  });

  it('reaps an aged ownerless reaper guard that would otherwise block every recovery', () => {
    const f = fixture();
    const reaper = `${f.lock}.reaper`;
    mkdirSync(f.lock);
    writeFileSync(join(f.lock, 'pid'), '99999999\n');
    mkdirSync(reaper);
    backdate(reaper);

    // Two polls: the first reclaims the guard (acquire_reaper reports failure by
    // design after a recovery), the second acquires it and reclaims the dead lock.
    const result = run(
      f.lock,
      ['--run', '--', 'sh', '-c', 'exit 23'],
      { GATE_MUTEX_MAX_POLLS: '2', GATE_MUTEX_POLL_SECONDS: '0' },
    );

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(23);
    expect(existsSync(f.lock)).toBe(false);
    expect(existsSync(reaper)).toBe(false);
  });

  it('never reaps a fresh reaper guard, leaving the dead lock for its own owner', () => {
    const f = fixture();
    const reaper = `${f.lock}.reaper`;
    mkdirSync(f.lock);
    writeFileSync(join(f.lock, 'pid'), '99999999\n');
    mkdirSync(reaper);

    const result = run(
      f.lock,
      ['--run', '--', 'sh', '-c', 'exit 23'],
      { GATE_MUTEX_MAX_POLLS: '2', GATE_MUTEX_POLL_SECONDS: '0' },
    );

    expect(result.status).toBe(3);
    expect(result.stdout).toMatch(/GAVE UP/i);
    expect(existsSync(reaper)).toBe(true);
    expect(readFileSync(join(f.lock, 'pid'), 'utf8').trim()).toBe('99999999');
  });

  it('never removes a lock whose ownership changed before cleanup', () => {
    const f = fixture();
    const result = run(f.lock, [
      '--run', '--', 'sh', '-c',
      'printf "%s\\n" "$FOREIGN_PID" > "$GATE_MUTEX_LOCK_DIR/pid"',
    ], { FOREIGN_PID: String(process.pid) });

    expect(result.status).toBe(0);
    expect(result.stderr).toMatch(/ownership changed/i);
    expect(readFileSync(join(f.lock, 'pid'), 'utf8').trim()).toBe(String(process.pid));
    expect(existsSync(f.lock)).toBe(true);
  });
});

describe('gate-mutex compatibility modes', () => {
  it('preserves inspect and bounded --wait behavior for a live owner', () => {
    const f = fixture();
    mkdirSync(f.lock);
    writeFileSync(join(f.lock, 'pid'), `${process.pid}\n`);

    const held = run(f.lock, []);
    expect(held.status).toBe(1);
    expect(held.stdout).toMatch(new RegExp(`HELD.*PID ${process.pid}`, 'i'));

    const waited = run(f.lock, ['--wait'], { GATE_MUTEX_MAX_POLLS: '0' });
    expect(waited.status).toBe(3);
    expect(waited.stdout).toMatch(/GAVE UP/i);

    rmSync(f.lock, { recursive: true, force: true });
    const free = run(f.lock, []);
    expect(free.status).toBe(0);
    expect(free.stdout).toMatch(/FREE/i);
  });
});

// ── LOCK IDENTITY (ODQ §747.4(1)) ────────────────────────────────────────────────────
// The double-acquisition of 2026-08-29 was NOT a failure of atomicity: `mkdir` is atomic,
// but only per path. The default lock path read `${TMPDIR:-/tmp}/settlementforge-vitest-
// gate.lock`, and macOS hands each launch context its own per-user TMPDIR — so a lane
// whose shell carried `TMPDIR=/var/folders/…` and a lane whose shell resolved to `/tmp`
// locked two physically different directories, each printed "acquired atomic lock", and
// the two populations were never mutually excluded. The invariant this pins is therefore
// about the lock's IDENTITY, not its acquisition, and it is asserted against the SOURCE:
// running the script on its real default would contend with (and briefly block) a live
// gate on this box, which is exactly the thing a test must not do.
describe('gate-mutex lock identity — the default path is caller-environment INDEPENDENT', () => {
  const source = readFileSync(SCRIPT, 'utf8');
  const defaultLine = source
    .split('\n')
    .find((line) => line.startsWith('LOCK_DIR='));

  it('the default LOCK_DIR expression exists and is a single assignment', () => {
    expect(defaultLine, 'LOCK_DIR is no longer assigned at the top level of the script')
      .toBeDefined();
    expect(source.split('\n').filter((l) => l.startsWith('LOCK_DIR=')))
      .toHaveLength(1);
  });

  it('the default LOCK_DIR never reads TMPDIR — two callers can never lock two directories', () => {
    // The anti-vacuity half: the assertion must be reading a line that really names the
    // env override and a concrete path, not an empty string that trivially lacks TMPDIR.
    expect(defaultLine).toContain('GATE_MUTEX_LOCK_DIR');
    expect(defaultLine).toContain('settlementforge-vitest-gate');
    expect(
      /TMPDIR/.test(defaultLine),
      'the default lock path derives from TMPDIR again — two launch contexts will lock two'
      + ' different directories and the gate mutex will silently stop excluding them',
    ).toBe(false);
  });

  it('the acquisition line names the directory it locked and BOTH poll counters', () => {
    // The legibility half of the same defect: the old line printed only the atomic
    // counter and printed AFTER the legacy wait, so a seven-minute wait still reported
    // "after 0 poll(s)" — and it never said which directory it had locked, the one datum
    // that would have made the split diagnosable from any two logs.
    const f = fixture();
    const result = run(f.lock, ['--run', '--', 'sh', '-c', 'exit 0']);

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(result.stdout).toContain(`acquired atomic lock at ${f.lock}`);
    expect(result.stdout).toMatch(/atomic poll\(s\) \+ \d+ legacy poll\(s\)/);
  });
});
