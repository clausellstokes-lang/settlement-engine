import { execFileSync } from 'node:child_process';
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
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
  });

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
  });

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
  });

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
  });

  it('rejects sealed HEAD and authority drift', () => {
    const headDrift = makeRepo();
    const headSession = create(headDrift);
    git(headDrift.root, ['commit', '--allow-empty', '-q', '-m', 'move head']);
    expect(() => assertImplementationScope(headSession)).toThrow(/HEAD or branch drifted/);

    const authorityDrift = makeRepo();
    const authoritySession = create(authorityDrift);
    write(authorityDrift.root, INDEX_PATH, `${readFileSync(join(authorityDrift.root, INDEX_PATH))}\n`);
    expect(() => assertImplementationScope(authoritySession)).toThrow(/authority drifted/);
  });

  it('fails closed on malformed Git inspection and missing or corrupt seals', () => {
    const notGit = realpathSync(mkdtempSync(join(tmpdir(), 'implementation-session-not-git-')));
    roots.push(notGit);
    expect(() => inspectImplementationWorktree(notGit)).toThrow();
    const repo = makeRepo(); const session = create(repo);
    writeFileSync(session.sealPath, '{');
    expect(() => openImplementationSession({ rootDir: repo.root, packetId: 'IA-2T' })).toThrow();
    unlinkSync(session.sealPath);
    expect(() => openImplementationSession({ rootDir: repo.root, packetId: 'IA-2T' })).toThrow();
  });

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
  });

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
  });

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
  });

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
  });
});
