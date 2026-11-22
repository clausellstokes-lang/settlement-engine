import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
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

/** The shared pool's live registrations, by pid, tolerating an absent directory. */
function sharedPids(lock) {
  try {
    return readdirSync(`${lock}.shared`);
  } catch {
    return [];
  }
}

/**
 * A shared-tier command line. The worker cap is an ordinary argv token exactly as it
 * is in the real incantation (`npx vitest run --maxWorkers=2 <files>`); `sh -c` takes
 * the first trailing word as `$0`, so a throwaway name sits between the script and
 * the cap.
 */
function sharedArgs(script, cap = '--maxWorkers=2') {
  const tail = cap === null ? [] : [cap];
  return ['--run', '--', 'sh', '-c', script, 'shared-probe', ...tail];
}

const SHARED = { GATE_MUTEX_TIER: 'shared' };

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

// ── THE TWO TIERS (ODQ §778.2, TE-EFF-1 car 1) ───────────────────────────────────────
// ⛔ WHAT IS TIERED IS ADMISSION, NOT THE GATE. DESIGN_BUILD_EFFICIENCY §7 refuses gate
// tiering permanently and this does not touch it: every step of `npm run check` still
// runs, unconditionally, under the exclusive tier. What changes is how many runs may be
// in flight at once — and the arms below are what keep that from quietly becoming "the
// mutex stopped excluding things", which is precisely the §747.4(1) failure that cost a
// cross-log reconstruction to diagnose.
//
// EACH ARM IS WRITTEN TO BE ABLE TO FAIL, and the pair structure is deliberate: every
// permissive claim (shared runs overlap; a dead entry is reaped) is answered by a
// restrictive twin (an exclusive holder excludes them; a LIVE entry is never reaped).
// A one-sided suite here would pass just as happily against a script that admitted
// everything, which is the shape of green that this program keeps catching late.
describe('gate-mutex TIERS — shared admission, exclusive exclusion', () => {
  // ── CONTROL (a): CONCURRENCY, PROVED BY A NEGATIVE THE SERIAL CASE CANNOT SATISFY ──
  // The second run does not report "I ran"; it reports "I ran WHILE THE FIRST HAD NOT
  // FINISHED". Under any serializing implementation the marker file exists by the time
  // the second command evaluates, nothing is written, and this reds. It is the exact
  // mirror of the exclusive arm at the top of this file, with the verdict inverted.
  it('admits two SHARED runs at once — the second enters while the first is still running', async () => {
    const f = fixture();
    const first = start(
      f.lock,
      sharedArgs('sleep 0.40; printf done > "$FIRST_DONE"'),
      { ...SHARED, FIRST_DONE: f.firstDone },
    );
    const firstResult = resultOf(first);

    await waitFor(() => sharedPids(f.lock).length === 1, 'the first shared registration');

    const second = start(
      f.lock,
      sharedArgs('test -f "$FIRST_DONE" || printf overlapped > "$SECOND_ENTERED"'),
      { ...SHARED, FIRST_DONE: f.firstDone, SECOND_ENTERED: f.secondEntered },
    );
    const secondResult = resultOf(second);

    const [firstExit, secondExit] = await Promise.all([firstResult, secondResult]);
    expect(secondExit.code, `${secondExit.stdout}\n${secondExit.stderr}`).toBe(0);
    expect(firstExit.code, `${firstExit.stdout}\n${firstExit.stderr}`).toBe(0);
    expect(
      existsSync(f.secondEntered) && readFileSync(f.secondEntered, 'utf8'),
      'the second shared run did not overlap the first — the tier serialized, so it is not a'
      + ' shared tier at all',
    ).toBe('overlapped');
    expect(secondExit.stdout).toContain(`entered SHARED tier at ${f.lock}.shared`);
    // …and both deregistered, so the pool cannot leak a slot per run.
    expect(sharedPids(f.lock)).toEqual([]);
  });

  // ── CONTROL (b), FIRST DIRECTION: A LIVE EXCLUSIVE HOLDER EXCLUDES NEW SHARED ──────
  it('an EXCLUSIVE holder blocks a NEW shared entrant until it releases', async () => {
    const f = fixture();
    const first = start(f.lock, [
      '--run', '--', 'sh', '-c',
      'sleep 0.35; printf done > "$FIRST_DONE"',
    ], { FIRST_DONE: f.firstDone, GATE_MUTEX_MAX_POLLS: '400' });
    const firstResult = resultOf(first);

    await waitFor(() => existsSync(join(f.lock, 'pid')), 'the exclusive acquisition');

    const second = start(
      f.lock,
      sharedArgs('test -f "$FIRST_DONE" && printf entered > "$SECOND_ENTERED"'),
      { ...SHARED, FIRST_DONE: f.firstDone, SECOND_ENTERED: f.secondEntered, GATE_MUTEX_MAX_POLLS: '400' },
    );
    const secondResult = resultOf(second);

    // Mid-flight: the exclusive holder is still running, so the shared entrant must be
    // outside — not merely unfinished, but UNREGISTERED. Checking the pool rather than
    // the marker is what makes this an exclusion assertion instead of a timing one.
    await new Promise((resolveWait) => setTimeout(resolveWait, 120));
    expect(sharedPids(f.lock), 'a shared run registered while an exclusive holder owned the slot')
      .toEqual([]);
    expect(existsSync(f.secondEntered)).toBe(false);

    const [firstExit, secondExit] = await Promise.all([firstResult, secondResult]);
    expect(firstExit.code, `${firstExit.stdout}\n${firstExit.stderr}`).toBe(0);
    expect(secondExit.code, `${secondExit.stdout}\n${secondExit.stderr}`).toBe(0);
    // …and it was ADMITTED afterwards. Without this half the arm would pass against a
    // script that simply refused every shared run forever.
    expect(readFileSync(f.secondEntered, 'utf8')).toBe('entered');
  });

  // ── CONTROL (b), SECOND DIRECTION: THE DRAIN, AND THE NO-STARVATION ORDERING ───────
  // Two claims in one arm because they are one mechanism: the exclusive caller takes the
  // lock FIRST and drains SECOND, so (1) it waits out the shared run already in flight,
  // and (2) while it is draining, a NEW shared entrant is already excluded — which is
  // what stops a stream of small runs from holding the real gate off forever.
  it('an EXCLUSIVE request drains the shared pool, and a PENDING exclusive blocks new entrants', async () => {
    const f = fixture();
    const shared = start(
      f.lock,
      sharedArgs('sleep 0.45; printf done > "$FIRST_DONE"'),
      { ...SHARED, FIRST_DONE: f.firstDone, GATE_MUTEX_MAX_POLLS: '400' },
    );
    const sharedResult = resultOf(shared);

    await waitFor(() => sharedPids(f.lock).length === 1, 'the shared registration');

    const exclusive = start(f.lock, [
      '--run', '--', 'sh', '-c',
      'test -f "$FIRST_DONE" && printf entered > "$SECOND_ENTERED"',
    ], { FIRST_DONE: f.firstDone, SECOND_ENTERED: f.secondEntered, GATE_MUTEX_MAX_POLLS: '400' });
    const exclusiveResult = resultOf(exclusive);

    // The exclusive caller now HOLDS the lock and is draining. A third run declaring the
    // shared tier must not slip in behind it.
    await waitFor(() => existsSync(join(f.lock, 'pid')), 'the pending exclusive taking the lock');
    const latecomer = start(
      f.lock,
      sharedArgs('printf late > "$LATE_ENTERED"'),
      { ...SHARED, LATE_ENTERED: join(f.root, 'late-entered'), GATE_MUTEX_MAX_POLLS: '400' },
    );
    const latecomerResult = resultOf(latecomer);

    await new Promise((resolveWait) => setTimeout(resolveWait, 120));
    expect(sharedPids(f.lock), 'a NEW shared entrant registered behind a PENDING exclusive — the'
      + ' exclusive tier can be starved by a stream of small runs')
      .toEqual([String(shared.pid)]);

    const [sharedExit, exclusiveExit, lateExit] = await Promise.all([
      sharedResult, exclusiveResult, latecomerResult,
    ]);
    expect(sharedExit.code, `${sharedExit.stdout}\n${sharedExit.stderr}`).toBe(0);
    expect(exclusiveExit.code, `${exclusiveExit.stdout}\n${exclusiveExit.stderr}`).toBe(0);
    expect(lateExit.code, `${lateExit.stdout}\n${lateExit.stderr}`).toBe(0);
    expect(readFileSync(f.secondEntered, 'utf8'), 'the exclusive run entered BEFORE the shared'
      + ' holder finished — the pool was not drained').toBe('entered');
    // ANTI-VACUITY: the exclusive caller must have actually WAITED. A zero here would mean
    // it found an empty pool and the arm proved nothing about draining.
    expect(exclusiveExit.stdout, 'the shared-drain counter is absent or zero, so this run never'
      + ' waited for the pool and the drain is untested')
      .toMatch(/\+ [1-9]\d* shared-drain poll\(s\)\./);
  });

  // ── CONTROL (c): THE CAP IS A CONDITION OF ENTRY ──────────────────────────────────
  it('REFUSES a shared run that declares no worker cap, before any registration', () => {
    const f = fixture();
    const result = spawnSync('sh', [SCRIPT, ...sharedArgs('printf ran > "$RAN"', null)], {
      cwd: ROOT,
      encoding: 'utf8',
      env: lockEnv(f.lock, { ...SHARED, RAN: join(f.root, 'ran') }),
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(2);
    expect(result.stderr).toContain('SHARED tier REFUSED');
    expect(result.stderr).toContain('declares no worker cap');
    // The refusal is CLEAN: the child never ran and nothing was registered, so a refused
    // run cannot leave a slot behind for the drain to wait on.
    expect(existsSync(join(f.root, 'ran'))).toBe(false);
    expect(sharedPids(f.lock)).toEqual([]);
  });

  it('REFUSES a shared cap above the ceiling — a large cap is not a cap', () => {
    const f = fixture();
    const result = run(f.lock, sharedArgs('exit 0', '--maxWorkers=64'), SHARED);

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(2);
    expect(result.stderr).toContain('exceeds the ceiling');
  });

  it('ADMITS the same command once the cap is declared, in either spelling', () => {
    const f = fixture();
    const equals = run(f.lock, sharedArgs('exit 0', '--maxWorkers=2'), SHARED);
    expect(equals.status, `${equals.stdout}\n${equals.stderr}`).toBe(0);
    expect(equals.stdout).toMatch(/entered SHARED tier/);

    // The space-separated spelling is the one a hand-typed incantation reaches for, and a
    // scan that only understood `=` would refuse a perfectly capped run.
    const spaced = spawnSync('sh', [
      SCRIPT, '--run', '--', 'sh', '-c', 'exit 0', 'shared-probe', '--maxWorkers', '2',
    ], { cwd: ROOT, encoding: 'utf8', env: lockEnv(f.lock, SHARED) });
    expect(spaced.status, `${spaced.stdout}\n${spaced.stderr}`).toBe(0);
  });

  // ── THE TIER IS CONSUMED, NOT INHERITED ───────────────────────────────────────────
  // ⛔ FOUND BY DOG-FOODING THIS TIER, NOT BY REASONING ABOUT IT, which is why the arm exists.
  // Every other GATE_MUTEX_* variable is a per-session setting a lane exports once; the tier is a
  // property of ONE INVOCATION. Left exported it descends into the child, so a lane running a
  // shared-tier command whose child itself calls this script turns every nested acquisition into
  // a shared request nobody declared — and since nested calls carry no worker cap, the cap guard
  // refuses them. MEASURED, before the cure: twelve arms of this very file reddened
  // "expected 2 to be 23", because the batch wrapper's exported tier reached the spawned
  // gate-mutex processes. AN INHERITED DECLARATION IS AN INFERRED ONE, and this script's header
  // refuses inference in as many words.
  it('CONSUMES the tier rather than exporting it — a nested call inherits nothing', () => {
    const f = fixture();
    const result = run(
      f.lock,
      sharedArgs('printf "[%s]" "${GATE_MUTEX_TIER:-<unset>}" > "$SEEN"'),
      { ...SHARED, SEEN: join(f.root, 'seen') },
    );

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    // Anti-vacuity: the run really did take the shared path, so this is not passing because the
    // tier was never read in the first place.
    expect(result.stdout).toMatch(/entered SHARED tier/);
    expect(readFileSync(join(f.root, 'seen'), 'utf8'),
      'the child inherited GATE_MUTEX_TIER — every nested gate-mutex call in that subtree is now'
      + ' a shared request it never declared, and an uncapped one, so the cap guard refuses it')
      .toBe('[<unset>]');
  });

  it('REFUSES an unknown tier rather than falling back to a silent default', () => {
    const f = fixture();
    const result = run(f.lock, ['--run', '--', 'sh', '-c', 'exit 0'], { GATE_MUTEX_TIER: 'small' });
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("GATE_MUTEX_TIER must be 'exclusive' or 'shared'");
  });

  // ── CONTROL (d): THE REAP, AND THE TWIN THAT PROVES IT DISCRIMINATES ──────────────
  it('reaps a DEAD-pid shared entry so a killed targeted run cannot wedge the gate', () => {
    const f = fixture();
    mkdirSync(`${f.lock}.shared`, { recursive: true });
    writeFileSync(join(`${f.lock}.shared`, '99999999'), '99999999\n');

    // Zero polls: if the reap did not happen inside this call the drain gives up at once.
    const result = run(
      f.lock,
      ['--run', '--', 'sh', '-c', 'exit 23'],
      { GATE_MUTEX_MAX_POLLS: '0', GATE_MUTEX_POLL_SECONDS: '0' },
    );

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(23);
    expect(existsSync(join(`${f.lock}.shared`, '99999999')),
      'the dead shared entry survived the drain — a killed targeted run wedges the gate forever')
      .toBe(false);
  });

  it('NEVER reaps a LIVE shared entry — the drain waits for it instead', () => {
    const f = fixture();
    mkdirSync(`${f.lock}.shared`, { recursive: true });
    writeFileSync(join(`${f.lock}.shared`, String(process.pid)), `${process.pid}\n`);

    const result = run(
      f.lock,
      ['--run', '--', 'sh', '-c', 'exit 23'],
      { GATE_MUTEX_MAX_POLLS: '0', GATE_MUTEX_POLL_SECONDS: '0' },
    );

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(3);
    expect(result.stdout).toMatch(/GAVE UP/i);
    expect(existsSync(join(`${f.lock}.shared`, String(process.pid))),
      'a LIVE shared holder was reaped — the reap is a blanket rm, not pid evidence')
      .toBe(true);
    // …and the lock this caller took while draining is handed back, never left behind.
    expect(existsSync(f.lock)).toBe(false);
  });
});

// ── THE ALIAS FOLD (lane T9) ─────────────────────────────────────────────────
// Pinning the DEFAULT was only half the identity property, and the sibling suite
// above pins only that half. The other half is the OVERRIDE, which is what every
// lane actually uses: docs/LANE_LAW_ADDENDUM_EFF1.md §2 instructs every lane,
// twice, to export `/tmp/settlementforge-vitest-gate.lock` — a path the default
// has never been, because the default carries a `$(id -u)` suffix. So the REAL
// GATE (`npm run check:tail`, exporting nothing) and every lane's targeted run
// (exporting the documented string) locked two physically different directories,
// while the script's own comment asserted they were mutually excluded.
//
// The cure is the acquirer's alias fold, and THIS is what keeps it honest: the
// documented incantations are read OUT OF THE DOCS THEMSELVES and each is executed
// through `--print-lock-dir`, so a future lane law that names a fourth spelling
// reds here instead of quietly splitting the population again.
describe('gate-mutex lock identity — every DOCUMENTED spelling folds onto one path', () => {
  const DOC_SOURCES = ['docs/LANE_LAW_ADDENDUM_EFF1.md', 'CONTRIBUTING.md'];
  const printLockDir = (env) => {
    const result = spawnSync('sh', [SCRIPT, '--print-lock-dir'], {
      cwd: ROOT, encoding: 'utf8', env: { ...process.env, ...env },
    });
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    return result.stdout.trim();
  };
  // The bare default: the path `npm run check:tail` takes. GATE_MUTEX_LOCK_DIR must
  // be actively removed — this suite's own harness exports it for every other case.
  //
  // ⛔ REMOVED BY DESTRUCTURING, NOT BY `delete`, AND THE SPELLING IS LOAD-BEARING. The
  // first cut of this suite wrote `const bareEnv = { ...process.env };` followed by
  // `delete bareEnv.GATE_MUTEX_LOCK_DIR;` — and that ONE bare statement is not a
  // registration, so tests/lint/sovereigntyLightingContract.walker.test.js classified
  // this describe as SUITE_NOT_STRAIGHT_LINE and all four arms below as
  // TEST_UNREGISTERED. The whole FILE parked: 21 credited test titles and 4 suite titles
  // went to zero, and the four guards this suite exists to provide became unprovable
  // while still passing. Nothing but the lighting census noticed. Keep every statement in
  // this block a declaration or a registration.
  const { GATE_MUTEX_LOCK_DIR: _laneOverride, ...bareEnv } = process.env;

  const documented = [...new Set(
    DOC_SOURCES
      .filter((rel) => existsSync(resolve(ROOT, rel)))
      .flatMap((rel) => [
        ...readFileSync(resolve(ROOT, rel), 'utf8').matchAll(/GATE_MUTEX_LOCK_DIR=(\S+)/g),
      ].map((m) => m[1])),
  )];

  it('the docs really do name a lock path, and it is NOT the script default', () => {
    // The anti-vacuity half, and it is the whole point: if the docs stopped naming
    // a path, the fold arm below would pass over an empty list. And if the named
    // path were already the default, this suite would prove nothing about aliasing.
    expect(documented.length, 'no GATE_MUTEX_LOCK_DIR incantation found in the lane law — '
      + 'the fold arm below would be vacuous').toBeGreaterThanOrEqual(1);
    const bare = printLockDir(bareEnv);
    expect(documented.some((p) => p !== bare),
      'every documented path is already the default — this suite has become a tautology, '
      + 'which is fine, but delete it rather than letting it read as coverage').toBe(true);
  });

  it('every documented incantation locks the SAME directory as the bare gate', () => {
    const bare = printLockDir(bareEnv);
    expect(bare).toContain('settlementforge-vitest-gate');
    const resolved = documented.map((p) => ({ documented: p, locks: printLockDir({ GATE_MUTEX_LOCK_DIR: p }) }));
    const split = resolved.filter((r) => r.locks !== bare);
    expect(
      split,
      `\nA documented GATE_MUTEX_LOCK_DIR incantation locks a DIFFERENT directory than the`
      + ` bare gate does. Two callers following two published instructions are then not`
      + ` mutually excluded at all, and both will print that they acquired the lock. Fold the`
      + ` spelling in scripts/gate-mutex.sh's alias fold, or change the doc:\nbare gate locks`
      + ` ${bare}\n${split.map((r) => `${r.documented} locks ${r.locks}`).join('\n')}\n`,
    ).toEqual([]);
  });

  it('THE PLANTED CONTROL: the fold is a family fold, not a blanket rewrite', () => {
    const bare = printLockDir(bareEnv);
    // A path OUTSIDE the lock family must survive untouched — otherwise every
    // deliberately-isolated lock (this suite's own per-test fixtures, and any future
    // one) would silently join the real gate and the fold would be a catastrophe
    // wearing a cure's name.
    const isolated = join(tmpdir(), 'gate-mutex-fold-control', 'vitest.lock');
    expect(printLockDir({ GATE_MUTEX_LOCK_DIR: isolated })).toBe(isolated);
    // …and the family fold really is folding, in each historical spelling: the
    // documented one, a TMPDIR-derived one (the reverted default's shape), and a
    // trailing-slash one. If any of these stopped folding the arm above would go
    // quiet on a real split.
    expect(printLockDir({ GATE_MUTEX_LOCK_DIR: '/tmp/settlementforge-vitest-gate.lock' })).toBe(bare);
    expect(printLockDir({
      GATE_MUTEX_LOCK_DIR: join(tmpdir(), 'settlementforge-vitest-gate.lock'),
    })).toBe(bare);
    expect(printLockDir({ GATE_MUTEX_LOCK_DIR: '/tmp/settlementforge-vitest-gate.lock/' })).toBe(bare);
  });

  it('--print-lock-dir takes NOTHING: no lock, no reaper, no shared slot', () => {
    // A witness that ACQUIRED what it reports could not run inside the gate it
    // guards — it would contend with, and briefly block, a live gate on this box.
    // ⚠ Measured on a path this suite OWNS, never on the real lock: a live sibling
    // gate makes the real lock exist for reasons that have nothing to do with this
    // witness, and an arm that reds on a neighbour's honest work is not a guard.
    const f = fixture();
    const probe = join(f.root, 'never-acquired.lock');
    expect(printLockDir({ GATE_MUTEX_LOCK_DIR: probe })).toBe(probe);
    expect(existsSync(probe), 'the witness mode acquired the lock it only meant to name').toBe(false);
    expect(existsSync(`${probe}.reaper`)).toBe(false);
    expect(existsSync(`${probe}.shared`)).toBe(false);
    // …anchored: the same script on the same path DOES create it when actually run,
    // so the absences above measure the witness mode and not an inert path.
    expect(run(probe, ['--run', '--', 'sh', '-c', `mkdir -p '${f.root}/proof'`]).status).toBe(0);
    expect(existsSync(join(f.root, 'proof')), 'the anchor run did not run').toBe(true);
  });
});
