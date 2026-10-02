import { execFileSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  canonicalSerialize,
  capsuleDigestOf,
  sha256,
  verifyCodingCapsule,
} from '../../scripts/implementation-packets.mjs';
import {
  acquireSessionRunLock,
  allocateSessionRun,
  assertImplementationScope,
  createImplementationSession,
  deriveResumeProjection,
  inspectImplementationWorktree,
  openImplementationSession,
  publishStepReceipt,
  readSessionState,
  readStepReceipts,
  releaseSessionRunLock,
  resealImplementationSession,
  runImplementationSessionCli,
  writeSessionHeartbeat,
  writeSessionState,
} from '../../scripts/implementation-session.mjs';

const MANIFEST_PATH = 'docs/implementation/PACKET_MANIFEST.json';
const INDEX_PATH = 'docs/implementation/INDEX.md';
const PACKET_PATH = 'docs/implementation/packets/IA-2T.md';
const roots = [];

function git(root, args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function write(root, path, value) {
  const target = join(root, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, value);
}

function packetText(status, base, branch = 'fixture') {
  return [
    '# Fixture / IA-2T — implementation contract',
    '',
    `- **Status:** \`${status}\``,
    `- **Verified base:** \`${branch}\` at \`${base}\``,
    '',
  ].join('\n');
}

function manifestOf(status, base) {
  return {
    schemaVersion: 1,
    indexPath: INDEX_PATH,
    packets: [{
      id: 'IA-2T',
      status,
      packetPath: PACKET_PATH,
      verifiedBase: base,
      changeManifest: [
        { action: 'MODIFY', path: 'scripts/target.mjs' },
        { action: 'CREATE', path: 'scripts/new-target.mjs' },
      ],
      requiredSymbols: [{ path: 'scripts/substrate.mjs', symbol: 'fixtureSubstrate' }],
      acceptanceCases: [{ id: 'A1', case: 'The bounded fixture remains valid.' }],
      checks: [['node', '--check', 'scripts/target.mjs']],
    }],
  };
}

function writeAuthority(repo, options = {}) {
  const status = options.status ?? repo.manifest.packets[0].status;
  const base = options.base ?? repo.manifest.packets[0].verifiedBase;
  const branch = options.branch ?? 'fixture';
  repo.manifest.packets[0].status = status;
  repo.manifest.packets[0].verifiedBase = base;
  write(repo.root, INDEX_PATH, [
    '| Packet | Status |',
    '|---|---|',
    `| [IA-2T](./packets/IA-2T.md) | **${status}** |`,
    '',
  ].join('\n'));
  write(repo.root, PACKET_PATH, packetText(status, base, branch));
  write(repo.root, MANIFEST_PATH, `${JSON.stringify(repo.manifest, null, 2)}\n`);
}

function makeRepo() {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'implementation-session-')));
  roots.push(root);
  git(root, ['init', '-q', '-b', 'fixture']);
  git(root, ['config', 'user.email', 'fixture@example.test']);
  git(root, ['config', 'user.name', 'Fixture']);
  write(root, 'scripts/target.mjs', 'export const target = 1;\n');
  write(root, 'scripts/substrate.mjs', 'export const fixtureSubstrate = true;\n');
  write(root, '.gitignore', 'scripts/new-target.mjs\n');
  write(root, 'foreign/staged.txt', 'staged-base\n');
  write(root, 'foreign/unstaged.txt', 'unstaged-base\n');
  git(root, ['add', '.']);
  git(root, ['commit', '-q', '-m', 'fixture base']);
  const base = git(root, ['rev-parse', 'HEAD']);
  const repo = { root, base, manifest: manifestOf('READY', base) };
  writeAuthority(repo);
  git(root, ['add', '.']);
  git(root, ['commit', '-q', '-m', 'packet authority']);
  repo.head = git(root, ['rev-parse', 'HEAD']);
  return repo;
}

function create(repo) {
  return createImplementationSession({ rootDir: repo.root, packetId: 'IA-2T' });
}

function envelope(payload) {
  const body = { schemaVersion: 1, payload };
  return { ...body, integrityDigest: sha256(canonicalSerialize(body)) };
}

function readEnvelope(path) {
  return JSON.parse(readFileSync(path, 'utf8')).payload;
}

function receipt(stepId, ordinal, fingerprint, status) {
  const argv = ['node', '--check', 'scripts/target.mjs'];
  const diffStats = { files: 0, added: 0, deleted: 0, binaryFiles: 0, untracked: 0, changedPaths: [] };
  return {
    ordinal, stepId, status, exitCode: status === 'PASSED' ? 0 : 1,
    signal: null, spawnError: null, orchestrationError: null, requestedSignal: null,
    elapsedMs: 1, declaredArgv: argv, effectiveArgv: argv,
    pre: { scopeOk: true, diffStats, snapshot: { fingerprint } },
    post: { scopeOk: true, diffStats, snapshot: { fingerprint } },
  };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

/**
 * ⛔ THE PER-TEST BUDGETS BELOW ARE A COST CURE, NEVER DEBT (TE-BUDGET-1, 2026-08-31).
 *
 * WHY THIS FILE AND NOT ITS NEIGHBOURS. Every case here builds its OWN throwaway Git
 * repository and drives real `git` subprocesses through it, so the row's cost is
 * PROCESS-SPAWN bound, not CPU bound — and spawn cost degrades far faster under load
 * than arithmetic does. MEASURED at 853e0e9ba on 2026-08-31, one instrument, per TEST
 * (`--reporter=json`), never per file:
 *
 *   isolated, load avg 4.9 over 8 cores : worst test 3,453 ms, file span 17,660 ms
 *   contended, load avg 27 over 8 cores : worst test 9,872 ms, file span 61,912 ms
 *   ⇒ per-test contention factor 2.47x - 5.23x, the widest measured anywhere in this car.
 *
 * At 9,872 ms the worst row already spends HALF the 20,000 ms suite budget at a load the
 * estate reaches with four lanes running; the chair's recorded red for this file was at
 * load 236, roughly nine times that. So the budget is not decoration — without it this
 * row reds on a GREEN assertion and the census is then invited to bank a defect that does
 * not exist (scripts/check-test-ratchet.mjs:1074, tests/lint/testRatchet.test.js:471).
 *
 * WHY BUDGETED AND NOT CUT. The ratchet's FIRST option is to cut the row's per-run work,
 * and the obvious cut — one shared repository fixture across the ten cases — is refused
 * here rather than deferred quietly: eight of these cases MUTATE the repo (dirty trees,
 * sealed HEADs, corrupt state, foreign staged dirt), and sharing a fixture across them
 * would make each case's precondition depend on its neighbours' order. That is a
 * correctness change wearing a performance change's clothes. Docketed as a cut that needs
 * design judgment, not taken by this car.
 *
 * WHY 60_000. It is the estate's house grain for exactly this cure
 * (tests/joins/ordering.test.js:289 and twenty pglite siblings), and against this file's
 * own measurements it is 17.4x the worst ISOLATED test and 6.1x the worst CONTENDED one —
 * i.e. it absorbs another six-fold degradation on top of the contention actually
 * reproduced. ⛔ The suite-wide `testTimeout` at vite.config.js:1138 is NOT touched: raising
 * it would hide the next row and would make a genuinely hung test slower to report.
 *
 * Each row carries its OWN measured figure below, so the headroom is auditable per case
 * rather than per file, and a case that grows into its budget is visible before it reds.
 */
describe('IA-2 implementation sessions', () => {
  it('dispatches a clean READY descendant and stores a private seal outside status', () => {
    const repo = makeRepo();
    expect(repo.head).not.toBe(repo.base);
    const before = git(repo.root, ['status', '--porcelain=v1', '--untracked-files=all']);
    const session = create(repo);
    const gitDir = resolve(git(repo.root, ['rev-parse', '--path-format=absolute', '--git-dir']));

    expect(session.sessionDir.startsWith(`${gitDir}/implementation-sessions/`)).toBe(true);
    expect(session.seal).toMatchObject({
      verifiedBase: repo.base,
      branch: 'fixture',
      head: repo.head,
    });
    expect(session.seal.targetStates).toMatchObject([
      { action: 'MODIFY', path: 'scripts/target.mjs', state: { exists: true, type: 'file' } },
      { action: 'CREATE', path: 'scripts/new-target.mjs', state: { exists: false } },
    ]);
    expect(statSync(session.sessionDir).mode & 0o077).toBe(0);
    for (const path of [session.dispatchPath, session.sealPath]) {
      expect(statSync(path).mode & 0o777).toBe(0o600);
    }
    expect(git(repo.root, ['status', '--porcelain=v1', '--untracked-files=all'])).toBe(before);
  }, 60_000); // measured 1,513 ms isolated 2026-08-31 (3,730 ms at load 27) — measured budget, never debt

  it('rejects non-READY, wrong branch/base, dirty MODIFY, and existing CREATE preflight', () => {
    const blocked = makeRepo();
    writeAuthority(blocked, { status: 'BLOCKED' });
    expect(() => create(blocked)).toThrow(/not READY/);

    const wrongBranch = makeRepo();
    git(wrongBranch.root, ['switch', '-q', '-c', 'other']);
    expect(() => create(wrongBranch)).toThrow(/branch mismatch/);

    const wrongBase = makeRepo();
    writeAuthority(wrongBase, { base: 'a'.repeat(40) });
    expect(() => create(wrongBase)).toThrow(/not an ancestor/);

    const dirtyModify = makeRepo();
    write(dirtyModify.root, 'scripts/target.mjs', 'export const target = 2;\n');
    expect(() => create(dirtyModify)).toThrow(/non-CREATE target.*Git-clean/);

    const existingCreate = makeRepo();
    write(existingCreate.root, 'scripts/new-target.mjs', 'export const created = true;\n');
    expect(() => create(existingCreate)).toThrow(/CREATE target.*absent.*Git-clean/);
  }, 60_000); // measured 2,646 ms isolated 2026-08-31 (8,738 ms at load 27) — measured budget, never debt

  it('accepts an unchanged descendant but rejects descendant substrate changes', () => {
    const unchanged = makeRepo();
    const unchangedSession = create(unchanged);
    expect(unchangedSession.dispatch.capsule.retiredSymbols).toEqual([]);
    expect(verifyCodingCapsule(unchangedSession.dispatch.capsule)).toBe(true);
    expect(capsuleDigestOf(unchangedSession.dispatch.capsule))
      .toBe(unchangedSession.dispatch.capsule.capsuleDigest);

    const changed = makeRepo();
    write(changed.root, 'scripts/substrate.mjs', [
      'export const fixtureSubstrate = true;',
      'export const changedAfterVerification = true;',
      '',
    ].join('\n'));
    git(changed.root, ['add', 'scripts/substrate.mjs']);
    git(changed.root, ['commit', '-q', '-m', 'change verified substrate']);
    expect(() => create(changed)).toThrow(/descendant changed declared substrate.*substrate/);

    // A real dispatch carries a non-empty retirement row through the capsule, its digest,
    // the authority comparison and fileHashes. The target is already in the fixture's base.
    const retirement = makeRepo();
    retirement.manifest.packets[0].retiredSymbols = [{
      path: 'foreign/staged.txt',
      symbol: 'staged-base',
    }];
    writeAuthority(retirement);
    git(retirement.root, ['add', INDEX_PATH, PACKET_PATH, MANIFEST_PATH]);
    git(retirement.root, ['commit', '-q', '-m', 'declare retirement target']);
    const retirementSession = create(retirement);
    expect(retirementSession.dispatch.capsule.retiredSymbols).toEqual([
      { path: 'foreign/staged.txt', symbol: 'staged-base' },
    ]);
    expect(retirementSession.dispatch.capsule.fileHashes
      .find(({ path }) => path === 'foreign/staged.txt'))
      .toMatchObject({ path: 'foreign/staged.txt', exists: true });
    expect(verifyCodingCapsule(retirementSession.dispatch.capsule)).toBe(true);
    expect(capsuleDigestOf(retirementSession.dispatch.capsule))
      .toBe(retirementSession.dispatch.capsule.capsuleDigest);

    const retiredChanged = makeRepo();
    retiredChanged.manifest.packets[0].retiredSymbols = [{
      path: 'foreign/staged.txt',
      symbol: 'staged-base',
    }];
    writeAuthority(retiredChanged);
    git(retiredChanged.root, ['add', INDEX_PATH, PACKET_PATH, MANIFEST_PATH]);
    git(retiredChanged.root, ['commit', '-q', '-m', 'declare retirement target']);
    write(retiredChanged.root, 'foreign/staged.txt', 'staged-base\nchanged after verification\n');
    git(retiredChanged.root, ['add', 'foreign/staged.txt']);
    git(retiredChanged.root, ['commit', '-q', '-m', 'change verified retirement target']);
    expect(() => create(retiredChanged))
      .toThrow(/descendant changed declared substrate.*foreign\/staged/);
  }, 60_000); // measured 3,453 ms isolated 2026-08-31 (9,872 ms at load 27) — measured budget, never debt

  it('seals foreign staged/unstaged/untracked dirt while allowing only target edits', () => {
    const repo = makeRepo();
    write(repo.root, 'foreign/staged.txt', 'staged-dirty\n');
    git(repo.root, ['add', 'foreign/staged.txt']);
    write(repo.root, 'foreign/unstaged.txt', 'unstaged-dirty\n');
    write(repo.root, 'foreign/untracked.txt', 'untracked-dirty\n');
    const session = create(repo);

    expect(session.seal.foreignEntries.map(({ code }) => code).sort()).toEqual([' M', '??', 'M ']);
    write(repo.root, 'scripts/target.mjs', 'export const target = 2;\n');
    write(repo.root, 'scripts/new-target.mjs', 'export const created = true;\n');
    const inScope = assertImplementationScope(session);
    expect(inScope.diffStats.changedPaths).toEqual([
      'scripts/new-target.mjs',
      'scripts/target.mjs',
    ]);

    write(repo.root, 'foreign/new-path.txt', 'new dirt\n');
    expect(() => assertImplementationScope(session)).toThrow(/foreign work drifted/);
    unlinkSync(join(repo.root, 'foreign/new-path.txt'));
    write(repo.root, 'foreign/unstaged.txt', 'mutated again\n');
    expect(() => assertImplementationScope(session)).toThrow(/foreign work drifted/);
    write(repo.root, 'foreign/unstaged.txt', 'unstaged-dirty\n');
    expect(() => assertImplementationScope(session)).not.toThrow();
  }, 60_000); // measured 2,417 ms isolated 2026-08-31 (9,306 ms at load 27) — measured budget, never debt

  it('rejects sealed HEAD and authority drift', () => {
    const headDrift = makeRepo();
    const headSession = create(headDrift);
    git(headDrift.root, ['commit', '--allow-empty', '-q', '-m', 'move head']);
    expect(() => assertImplementationScope(headSession)).toThrow(/HEAD or branch drifted/);

    const authorityDrift = makeRepo();
    const authoritySession = create(authorityDrift);
    write(authorityDrift.root, INDEX_PATH, `${readFileSync(join(authorityDrift.root, INDEX_PATH))}\n`);
    expect(() => assertImplementationScope(authoritySession)).toThrow(/authority drifted/);
  }, 60_000); // measured 2,135 ms isolated 2026-08-31 (8,085 ms at load 27) — measured budget, never debt

  it('fails closed on malformed Git inspection and missing or corrupt seals', () => {
    const notGit = realpathSync(mkdtempSync(join(tmpdir(), 'implementation-session-not-git-')));
    roots.push(notGit);
    expect(() => inspectImplementationWorktree(notGit)).toThrow();
    const repo = makeRepo(); const session = create(repo);
    writeFileSync(session.sealPath, '{');
    expect(() => openImplementationSession({ rootDir: repo.root, packetId: 'IA-2T' })).toThrow();
    unlinkSync(session.sealPath);
    expect(() => openImplementationSession({ rootDir: repo.root, packetId: 'IA-2T' })).toThrow();
  }, 60_000); // measured 996 ms isolated 2026-08-31 (4,093 ms at load 27) — measured budget, never debt

  it('keeps replaceable state integrity and never reuses corrupt state', () => {
    const session = create(makeRepo());
    const good = { status: 'RUNNING', sequence: 1 };
    writeSessionState(session, good);
    expect(readSessionState(session)).toEqual(good);

    const cyclic = { status: 'RUNNING' };
    cyclic.self = cyclic;
    expect(() => writeSessionState(session, cyclic)).toThrow(/cycle/);
    expect(readSessionState(session)).toEqual(good);

    unlinkSync(session.statePath);
    expect(readSessionState(session)).toBeNull();
    writeSessionState(session, good);
    writeFileSync(session.statePath, '{"schemaVersion":1');
    expect(readSessionState(session)).toBeNull();
    writeSessionState(session, good);
    const tampered = JSON.parse(readFileSync(session.statePath, 'utf8'));
    tampered.payload.sequence = 99;
    writeFileSync(session.statePath, `${JSON.stringify(tampered)}\n`);
    expect(readSessionState(session)).toBeNull();
  }, 60_000); // measured 927 ms isolated 2026-08-31 (3,904 ms at load 27) — measured budget, never debt

  it('publishes immutable receipts and derives only latest exact-state resume evidence', () => {
    const session = create(makeRepo());
    const plan = ['validate-packets', 'alpha', 'beta', 'gamma', 'delta'].map((id) => ({
      id,
      argv: ['node', '--check', 'scripts/target.mjs'],
    }));
    const fingerprint = assertImplementationScope(session).snapshot.fingerprint;
    const first = allocateSessionRun(session, { plan, mode: 'packet' });
    publishStepReceipt(first, { ...receipt('alpha', 1, fingerprint, 'PASSED'), runId: 'forged', planDigest: 'forged', sealDigest: 'forged' });
    publishStepReceipt(first, receipt('beta', 2, fingerprint, 'FAILED'));
    publishStepReceipt(first, receipt('gamma', 3, fingerprint, 'BLOCKED'));
    expect(() => publishStepReceipt(first, receipt('alpha', 1, fingerprint, 'PASSED')))
      .toThrow(/immutable session evidence already exists/);

    const second = allocateSessionRun(session, { plan, mode: 'resume' });
    publishStepReceipt(second, receipt('beta', 2, fingerprint, 'PASSED'));
    publishStepReceipt(second, { ...receipt('delta', 4, fingerprint, 'PASSED'), exitCode: 7 });
    const projection = deriveResumeProjection({
      plan,
      receipts: readStepReceipts(session),
      planDigest: second.planDigest,
      sealDigest: session.sealDigest,
      currentFingerprint: fingerprint,
    });
    expect(projection).toEqual({
      completed: ['alpha', 'beta'],
      failed: ['delta'],
      blocked: ['gamma'],
      remaining: ['validate-packets'],
      selected: ['validate-packets', 'gamma', 'delta'],
    });

    write(session.rootDir, 'scripts/target.mjs', 'export const target = 2;\n');
    const changedFingerprint = assertImplementationScope(session).snapshot.fingerprint;
    expect(deriveResumeProjection({
      plan,
      receipts: readStepReceipts(session),
      planDigest: second.planDigest,
      sealDigest: session.sealDigest,
      currentFingerprint: changedFingerprint,
    })).toEqual({
      completed: [],
      failed: [],
      blocked: [],
      remaining: plan.map(({ id }) => id),
      selected: plan.map(({ id }) => id),
    });
  }, 60_000); // measured 1,286 ms isolated 2026-08-31 (6,722 ms at load 27) — measured budget, never debt

  it('keeps locks conservative, heartbeats RUNNING-only, and the CLI strict', () => {
    const repo = makeRepo();
    const session = create(repo);
    const lock = acquireSessionRunLock(session);
    expect(() => acquireSessionRunLock(session)).toThrow(/already running/);
    expect(() => acquireSessionRunLock(session, { allowDeadOwnerRecovery: true }))
      .toThrow(/live or uncertain/);
    releaseSessionRunLock(lock);

    mkdirSync(session.lockDir, { mode: 0o700 });
    const deadOwnerPath = join(session.lockDir, 'owner.json');
    writeFileSync(deadOwnerPath, `${JSON.stringify(envelope({ pid: 2147483646, nonce: 'dead' }))}\n`, {
      mode: 0o600,
    });
    chmodSync(deadOwnerPath, 0o600);
    expect(() => acquireSessionRunLock(session)).toThrow(/already running/);
    const recovered = acquireSessionRunLock(session, { allowDeadOwnerRecovery: true });
    releaseSessionRunLock(recovered);

    const plan = [{ id: 'alpha', argv: ['node', '--check', 'scripts/target.mjs'] }];
    const run = allocateSessionRun(session, { plan, mode: 'packet' });
    writeSessionState(session, { runId: run.runId, runOrdinal: run.runOrdinal, status: 'RUNNING' });
    writeSessionHeartbeat(run, {
      phase: 'RUNNING', status: 'RUNNING', ordinal: 0, stepId: 'alpha', sequence: 1,
      runId: 'forged', runOrdinal: 99,
    });
    expect(readEnvelope(run.heartbeatPath)).toMatchObject({
      phase: 'RUNNING',
      status: 'RUNNING',
      ordinal: 0,
      stepId: 'alpha',
      sequence: 1,
      runId: run.runId,
      runOrdinal: run.runOrdinal,
    });
    expect(readStepReceipts(session)).toEqual([]);
    expect(() => writeSessionHeartbeat(run, {
      phase: 'RUNNING', status: 'PASSED', ordinal: 0, stepId: 'alpha', sequence: 2,
    }))
      .toThrow(/heartbeat.*RUNNING/i);
    writeSessionState(session, { runId: run.runId, runOrdinal: run.runOrdinal, status: 'PASSED' });
    expect(() => writeSessionHeartbeat(run, {
      phase: 'RUNNING', status: 'RUNNING', ordinal: 0, stepId: 'alpha', sequence: 3,
    })).toThrow(/invalid or terminal/);
    writeSessionState(session, { runId: run.runId, runOrdinal: run.runOrdinal, status: 'RUNNING' });
    const fingerprint = assertImplementationScope(session).snapshot.fingerprint;
    publishStepReceipt(run, receipt('alpha', 0, fingerprint, 'PASSED'));
    expect(() => writeSessionHeartbeat(run, {
      phase: 'RUNNING', status: 'RUNNING', ordinal: 0, stepId: 'alpha', sequence: 4,
    })).toThrow(/invalid or terminal/);

    let stdout = '';
    let stderr = '';
    const streams = {
      rootDir: repo.root,
      stdout: { write: (chunk) => { stdout += String(chunk); } },
      stderr: { write: (chunk) => { stderr += String(chunk); } },
    };
    for (const argv of [[], ['dispatch'], ['resume', 'IA-2T'], ['dispatch', 'IA-2T', 'extra']]) {
      expect(runImplementationSessionCli(argv, streams), argv.join(' ')).toBe(1);
      expect(stderr).toContain('usage: implementation-session.mjs dispatch <ID>');
      stderr = '';
    }
    expect(stdout).toBe('');
  }, 60_000); // measured 1,218 ms isolated 2026-08-31 (4,479 ms at load 27) — measured budget, never debt

  /**
   * ⭐ THE SANCTIONED RE-SEAL (TOOL-22). A branch moving under a paused sealed build is
   * routine under pause-and-resume, and it deadlocks the packet at BOTH ends at once:
   * dispatch refuses because the capsule exists, while `check:packet` and `resume` refuse
   * because that capsule's sealed HEAD drifted. The two rows below are the six arms of the
   * door — the happy path with its collision rule first, then the two refusals that must
   * archive nothing at all.
   */
  it('re-seals a drifted capsule under its sealed head and never overwrites an archive', () => {
    const repo = makeRepo();
    // (a) DISPATCH — one capsule, sealed at the head it was dispatched on.
    const first = create(repo);
    const sessionsDir = dirname(first.sessionDir);
    expect(readdirSync(sessionsDir)).toEqual(['IA-2T']);
    expect(first.seal.head).toBe(repo.head);

    // (b) A SECOND PLAIN DISPATCH — refused, with its message unchanged by this door.
    expect(() => create(repo)).toThrow(/implementation session already exists: IA-2T/);

    // (c) THE BRANCH ADVANCES — the gate's own two steps in the gate's own order
    //     (implementation-gate.mjs opens the session, then asserts scope, for both `packet`
    //     and `resume`): the session still OPENS, and the scope assertion is what refuses.
    git(repo.root, ['commit', '--allow-empty', '-q', '-m', 'move head under the paused build']);
    const secondHead = git(repo.root, ['rev-parse', 'HEAD']);
    const reopened = openImplementationSession({ rootDir: repo.root, packetId: 'IA-2T' });
    expect(() => assertImplementationScope(reopened))
      .toThrow(/sealed HEAD or branch drifted for IA-2T/);

    // (d) --reseal — the prior capsule is ARCHIVED under the head IT pinned, its own seal
    //     still readable there, while the fresh capsule is sealed at the new HEAD and names
    //     where its predecessor went.
    const resealed = resealImplementationSession({ rootDir: repo.root, packetId: 'IA-2T' });
    const firstArchive = `IA-2T.sealed-at-${repo.head.slice(0, 9)}`;
    expect(readdirSync(sessionsDir).sort()).toEqual(['IA-2T', firstArchive]);
    expect(readEnvelope(join(sessionsDir, firstArchive, 'seal.json')).head).toBe(repo.head);
    expect(resealed.seal.head).toBe(secondHead);
    expect(resealed.dispatch.resealedFrom).toBe(firstArchive);
    expect(() => assertImplementationScope(resealed)).not.toThrow();

    // ⛔ THE COLLISION RULE. An archive of that head ALREADY THERE — an earlier rotation, or
    //    the chair's own hand rotation — is never replaced and never emptied. The stand-in
    //    carries a file deliberately: that is what makes an overwrite both detectable here
    //    and refusable by rename(2), so removing the `-2` suffix reds this arm rather than
    //    destroying evidence quietly.
    const secondArchive = `IA-2T.sealed-at-${secondHead.slice(0, 9)}`;
    write(sessionsDir, `${secondArchive}/rotated-by-hand.txt`, 'the chair rotated this aside\n');
    git(repo.root, ['commit', '--allow-empty', '-q', '-m', 'move head again']);
    const third = resealImplementationSession({ rootDir: repo.root, packetId: 'IA-2T' });
    expect(third.dispatch.resealedFrom).toBe(`${secondArchive}-2`);
    expect(readFileSync(join(sessionsDir, secondArchive, 'rotated-by-hand.txt'), 'utf8'))
      .toBe('the chair rotated this aside\n');
    expect(readEnvelope(join(sessionsDir, `${secondArchive}-2`, 'seal.json')).head)
      .toBe(secondHead);

    // ⛔ AND THE HARDER HALF, which is the only one that convicts the mechanism rather than
    //    the platform: an EMPTY occupant. rename(2) refuses to replace a directory that has
    //    contents, so the arm above would still red if the collision rule were deleted — for
    //    the platform's reason, not this code's. Onto an EMPTY directory the same rename
    //    SUCCEEDS and the archive is gone without a word, so only this arm proves the name is
    //    reserved before the move.
    const thirdHead = git(repo.root, ['rev-parse', 'HEAD']);
    const thirdArchive = `IA-2T.sealed-at-${thirdHead.slice(0, 9)}`;
    mkdirSync(join(sessionsDir, thirdArchive), { mode: 0o700 });
    git(repo.root, ['commit', '--allow-empty', '-q', '-m', 'move head a third time']);
    const fourth = resealImplementationSession({ rootDir: repo.root, packetId: 'IA-2T' });
    expect(fourth.dispatch.resealedFrom).toBe(`${thirdArchive}-2`);
    expect(readdirSync(join(sessionsDir, thirdArchive))).toEqual([]);
  }, 60_000); // measured budget, never debt — the file's TE-BUDGET-1 grain, four repos' worth of spawn

  it('refuses a re-seal on a dirty tree or with no capsule, and archives nothing either way', () => {
    // (e) A DIRTY TREE — refused by dispatch's OWN preflight, BEFORE any rename. The capsule
    //     and its seal are byte-for-byte what they were and the directory holds nothing new:
    //     an archive whose fresh seal cannot follow it would strand the packet with neither.
    const dirty = makeRepo();
    const session = create(dirty);
    const sessionsDir = dirname(session.sessionDir);
    const sealedBefore = readFileSync(session.sealPath, 'utf8');
    git(dirty.root, ['commit', '--allow-empty', '-q', '-m', 'move head under the paused build']);
    write(dirty.root, 'scripts/target.mjs', 'export const target = 2;\n');
    expect(() => resealImplementationSession({ rootDir: dirty.root, packetId: 'IA-2T' }))
      .toThrow(/non-CREATE target must be Git-clean: scripts\/target\.mjs/);
    expect(readdirSync(sessionsDir)).toEqual(['IA-2T']);
    expect(readFileSync(session.sealPath, 'utf8')).toBe(sealedBefore);

    // (f) NO CAPSULE — refused, naming plain dispatch as the door, and the session home is
    //     never even created.
    const fresh = makeRepo();
    expect(() => resealImplementationSession({ rootDir: fresh.root, packetId: 'IA-2T' }))
      .toThrow(/no implementation session to re-seal: IA-2T\..*dispatch IA-2T/);
    const freshGitDir = resolve(git(fresh.root, ['rev-parse', '--path-format=absolute', '--git-dir']));
    expect(existsSync(join(freshGitDir, 'implementation-sessions'))).toBe(false);
  }, 60_000); // measured budget, never debt — the file's TE-BUDGET-1 grain, two repos' worth of spawn

  it('accepts only the exact dispatch CLI form before publishing a session', () => {
    const repo = makeRepo();
    let stdout = '';
    let stderr = '';
    expect(runImplementationSessionCli(['dispatch', 'IA-2T'], {
      rootDir: repo.root,
      stdout: { write: (chunk) => { stdout += String(chunk); } },
      stderr: { write: (chunk) => { stderr += String(chunk); } },
    })).toBe(0);
    expect(JSON.parse(stdout)).toMatchObject({ id: 'IA-2T' });
    expect(stderr).toBe('');
    expect(inspectImplementationWorktree(repo.root).head).toBe(repo.head);
  }, 60_000); // measured 1,070 ms isolated 2026-08-31 (2,978 ms at load 27) — measured budget, never debt
});
