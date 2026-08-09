import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
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
