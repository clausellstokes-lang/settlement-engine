#!/usr/bin/env node
/** Worktree-local seals/evidence outside Git status. @enforced-by tests/scripts/implementationSession.test.js */
import { execFileSync, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import {
  chmodSync, closeSync, existsSync, fsyncSync, linkSync, lstatSync, mkdirSync, openSync,
  readFileSync, readlinkSync, readdirSync, renameSync, rmdirSync, statSync, unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PACKET_AUTHORITY_NOTICE, buildCodingCapsule, canonicalSerialize, loadPacketManifest,
  parsePacketHeader, sha256, validatePacketManifest, verifyCodingCapsule,
} from './implementation-packets.mjs';
export const SESSION_SCHEMA_VERSION = 1;
const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_MANIFEST_PATH = 'docs/implementation/PACKET_MANIFEST.json';
const ID_TOKEN = /^[A-Za-z0-9][A-Za-z0-9+._-]*$/;
function gitBuffer(rootDir, args) {
  return execFileSync('git', args, {
    cwd: rootDir, encoding: 'buffer', stdio: ['ignore', 'pipe', 'pipe'],
  });
}
function gitText(rootDir, args) { return gitBuffer(rootDir, args).toString('utf8').trim(); }
function repositoryPath(rootDir, path) {
  const root = resolve(rootDir);
  const absolute = resolve(root, ...String(path).split('/'));
  if (absolute !== root && !absolute.startsWith(`${root}/`)) {
    throw new Error(`repository path escapes root: ${String(path)}`);
  }
  return absolute;
}
function pathExists(path) {
  try { lstatSync(path); return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}
function fileState(rootDir, path) {
  const absolute = repositoryPath(rootDir, path);
  if (!pathExists(absolute)) return { exists: false, type: 'missing', mode: null, sha256: null };
  const stat = lstatSync(absolute);
  const mode = stat.mode.toString(8);
  if (stat.isSymbolicLink()) return { exists: true, type: 'symlink', mode, sha256: sha256(readlinkSync(absolute)) };
  if (stat.isFile()) return { exists: true, type: 'file', mode, sha256: sha256(readFileSync(absolute)) };
  if (stat.isDirectory()) return { exists: true, type: 'directory', mode, sha256: null };
  return { exists: true, type: 'other', mode, sha256: null };
}
function ensurePrivateDirectory(path) { mkdirSync(path, { recursive: true, mode: 0o700 }); chmodSync(path, 0o700); }
function fsyncDirectory(path) {
  const descriptor = openSync(path, 'r');
  try { fsyncSync(descriptor); } finally { closeSync(descriptor); }
}
function integrityEnvelope(payload) {
  const body = { schemaVersion: SESSION_SCHEMA_VERSION, payload };
  return { ...body, integrityDigest: sha256(canonicalSerialize(body)) };
}
function envelopeText(payload) { return `${JSON.stringify(integrityEnvelope(payload), null, 2)}\n`; }
function writeTemporary(file, text) {
  ensurePrivateDirectory(dirname(file));
  const temporary = join(dirname(file), `.${randomUUID()}.tmp`);
  let descriptor;
  try {
    descriptor = openSync(temporary, 'wx', 0o600);
    writeFileSync(descriptor, text, 'utf8');
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = undefined;
    return temporary;
  } catch (error) {
    if (descriptor != null) closeSync(descriptor);
    if (pathExists(temporary)) unlinkSync(temporary);
    throw error;
  }
}
function writeImmutable(file, payload) {
  if (existsSync(file)) throw new Error(`immutable session evidence already exists: ${file}`);
  const temporary = writeTemporary(file, envelopeText(payload));
  try {
    linkSync(temporary, file);
    fsyncDirectory(dirname(file));
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
  }
  return file;
}
function writeReplaceable(file, payload) {
  const temporary = writeTemporary(file, envelopeText(payload));
  try {
    renameSync(temporary, file);
    fsyncDirectory(dirname(file));
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
  }
  return file;
}
function readEnvelope(file) {
  const parsed = JSON.parse(readFileSync(file, 'utf8'));
  if (!parsed || parsed.schemaVersion !== SESSION_SCHEMA_VERSION
    || !Object.hasOwn(parsed, 'payload') || typeof parsed.integrityDigest !== 'string') {
    throw new Error(`invalid session envelope: ${file}`);
  }
  const expected = sha256(canonicalSerialize({
    schemaVersion: parsed.schemaVersion,
    payload: parsed.payload,
  }));
  if (parsed.integrityDigest !== expected) throw new Error(`session integrity mismatch: ${file}`);
  if ((statSync(file).mode & 0o077) !== 0) throw new Error(`session evidence is not private: ${file}`);
  return { payload: parsed.payload, digest: parsed.integrityDigest };
}
function parseStatus(rawStatus, rootDir) {
  const rows = rawStatus.toString('utf8').split('\0');
  const entries = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (!row) continue;
    if (row.length < 4 || row[2] !== ' ') throw new Error(`unrecognized Git status row: ${row}`);
    const code = row.slice(0, 2);
    const path = row.slice(3);
    const renamed = /[RC]/.test(code);
    const originalPath = renamed ? rows[++index] || null : null;
    if (renamed && !originalPath) throw new Error(`incomplete Git rename status for ${path}`);
    const indexBytes = gitBuffer(rootDir, ['--literal-pathspecs', 'ls-files', '--stage', '-z', '--', path]);
    const originalIndexBytes = originalPath
      ? gitBuffer(rootDir, ['--literal-pathspecs', 'ls-files', '--stage', '-z', '--', originalPath])
      : Buffer.alloc(0);
    entries.push({
      code,
      path,
      originalPath,
      pathState: fileState(rootDir, path),
      originalState: originalPath ? fileState(rootDir, originalPath) : null,
      indexDigest: sha256(indexBytes),
      originalIndexDigest: originalPath ? sha256(originalIndexBytes) : null,
    });
  }
  return entries.sort((left, right) => {
    const a = `${left.path}\0${left.originalPath || ''}`;
    const b = `${right.path}\0${right.originalPath || ''}`;
    return a < b ? -1 : a > b ? 1 : 0;
  });
}
function readRepositoryIdentity(rootDir) {
  const root = resolve(rootDir);
  const topLevel = resolve(gitText(root, ['rev-parse', '--show-toplevel']));
  if (topLevel !== root) throw new Error(`session root must be Git worktree root: ${topLevel}`);
  const gitDir = resolve(gitText(root, ['rev-parse', '--path-format=absolute', '--git-dir']));
  const branch = gitText(root, ['symbolic-ref', '--quiet', '--short', 'HEAD']);
  const head = gitText(root, ['rev-parse', '--verify', 'HEAD']);
  if (!branch || !head) throw new Error('Git worktree has no branch or HEAD');
  return { rootDir: root, gitDir, branch, head };
}
export function inspectImplementationWorktree(rootDir = DEFAULT_ROOT) {
  const identity = readRepositoryIdentity(rootDir);
  const rawStatus = gitBuffer(identity.rootDir, [
    'status', '--porcelain=v1', '-z', '--untracked-files=all',
  ]);
  const rawIndex = gitBuffer(identity.rootDir, ['ls-files', '--stage', '-z']);
  const dirtyEntries = parseStatus(rawStatus, identity.rootDir);
  const snapshotBody = {
    head: identity.head,
    branch: identity.branch,
    indexDigest: sha256(rawIndex),
    statusDigest: sha256(rawStatus),
    dirtyEntries,
  };
  return {
    ...identity,
    ...snapshotBody,
    fingerprint: sha256(canonicalSerialize(snapshotBody)),
  };
}
function assertAncestorAndSubstrate(rootDir, packet, capsule, head) {
  const ancestry = spawnSync('git', ['merge-base', '--is-ancestor', packet.verifiedBase, head], {
    cwd: rootDir,
    encoding: 'utf8',
    shell: false,
  });
  if (ancestry.status !== 0) {
    throw new Error(`verified base is not an ancestor of HEAD: ${packet.verifiedBase}`);
  }
  if (head === packet.verifiedBase) return;
  const substrate = [...new Set([
    ...packet.changeManifest.filter((row) => row.action !== 'CREATE').map((row) => row.path),
    ...packet.requiredSymbols.map((row) => row.path),
    ...(packet.retiredSymbols ?? []).map((row) => row.path),
  ])].sort();
  if (!substrate.length) return;
  const changed = gitBuffer(rootDir, [
    '--literal-pathspecs', 'diff', '--name-only', '-z', `${packet.verifiedBase}..${head}`, '--', ...substrate,
  ]).toString('utf8').split('\0').filter(Boolean);
  if (changed.length) {
    throw new Error(`verified-base descendant changed declared substrate: ${changed.join(', ')}`);
  }
  const capsulePaths = new Set(capsule.fileHashes.map((row) => row.path));
  for (const path of substrate) {
    if (!capsulePaths.has(path)) throw new Error(`capsule omitted declared substrate: ${path}`);
  }
}
function assertTargetPreflight(rootDir, packet) {
  for (const row of packet.changeManifest) {
    const absolute = repositoryPath(rootDir, row.path);
    const status = gitBuffer(rootDir, [
      '--literal-pathspecs', 'status', '--porcelain=v1', '-z', '--untracked-files=all', '--', row.path,
    ]);
    if (row.action === 'CREATE') {
      if (pathExists(absolute) || status.length || gitBuffer(rootDir, ['--literal-pathspecs', 'ls-files', '-z', '--', row.path]).length) {
        throw new Error(`CREATE target must be absent and Git-clean: ${row.path}`);
      }
    } else if (status.length) {
      throw new Error(`non-CREATE target must be Git-clean: ${row.path}`);
    }
  }
}
function capsuleAuthority(capsule) {
  return {
    id: capsule.id,
    status: capsule.status,
    packetPath: capsule.packetPath,
    verifiedBase: capsule.verifiedBase,
    verifiedBranch: capsule.verifiedBranch,
    authorityNotice: capsule.authorityNotice,
    packetMarkdown: capsule.packetMarkdown,
    changeManifest: capsule.changeManifest,
    requiredSymbols: capsule.requiredSymbols.map(({ path, symbol }) => ({ path, symbol })),
    retiredSymbols: capsule.retiredSymbols.map(({ path, symbol }) => ({ path, symbol })),
    acceptanceCases: capsule.acceptanceCases,
    checks: capsule.checks,
    filePaths: capsule.fileHashes.map((row) => row.path).sort(),
  };
}
function manifestAuthority(manifest, packet, packetText) {
  const header = parsePacketHeader(packetText);
  return {
    id: packet.id,
    status: packet.status,
    packetPath: packet.packetPath,
    verifiedBase: packet.verifiedBase,
    verifiedBranch: header.verifiedBranch,
    authorityNotice: PACKET_AUTHORITY_NOTICE,
    packetMarkdown: {
      text: packetText,
      byteLength: Buffer.byteLength(packetText, 'utf8'),
      sha256: sha256(Buffer.from(packetText, 'utf8')),
    },
    changeManifest: packet.changeManifest.map(({ action, path }) => ({ action, path })),
    requiredSymbols: packet.requiredSymbols.map(({ path, symbol }) => ({ path, symbol })),
    retiredSymbols: (packet.retiredSymbols ?? []).map(({ path, symbol }) => ({ path, symbol })),
    acceptanceCases: packet.acceptanceCases.map(({ id, case: caseText }) => ({ id, case: caseText })),
    checks: packet.checks.map((argv) => [...argv]),
    filePaths: [...new Set([
      manifest.indexPath,
      packet.packetPath,
      ...packet.changeManifest.map((row) => row.path),
      ...packet.requiredSymbols.map((row) => row.path),
      ...(packet.retiredSymbols ?? []).map((row) => row.path),
    ])].sort(),
  };
}
function assertCapsuleMatchesManifest(capsule, manifest, packet, packetText) {
  const expected = manifestAuthority(manifest, packet, packetText);
  if (canonicalSerialize(capsuleAuthority(capsule)) !== canonicalSerialize(expected)) {
    throw new Error(`stored capsule authority disagrees with live manifest for ${packet.id}`);
  }
}
function loadLiveAuthority(rootDir, manifestPath, packetId) {
  const manifest = loadPacketManifest({ rootDir, manifestPath });
  const validation = validatePacketManifest(manifest, { rootDir });
  if (!validation.ok) throw new Error(`packet manifest is invalid:\n${validation.errors.join('\n')}`);
  const packet = manifest.packets.find((row) => row.id === packetId);
  if (!packet) throw new Error(`unknown implementation packet: ${packetId}`);
  if (packet.status !== 'READY') throw new Error(`packet ${packetId} is not READY`);
  const packetBytes = readFileSync(repositoryPath(rootDir, packet.packetPath));
  const packetText = packetBytes.toString('utf8');
  const manifestBytes = readFileSync(repositoryPath(rootDir, manifestPath));
  const indexBytes = readFileSync(repositoryPath(rootDir, manifest.indexPath));
  return { manifest, packet, packetText, packetBytes, manifestBytes, indexBytes };
}
function sessionPaths(rootDir, packetId) {
  if (!ID_TOKEN.test(packetId)) throw new Error(`invalid implementation packet ID: ${packetId}`);
  const identity = readRepositoryIdentity(rootDir);
  const sessionDir = join(identity.gitDir, 'implementation-sessions', packetId);
  return {
    ...identity,
    id: packetId,
    sessionDir,
    dispatchPath: join(sessionDir, 'dispatch.json'),
    sealPath: join(sessionDir, 'seal.json'),
    statePath: join(sessionDir, 'state.json'),
    runsDir: join(sessionDir, 'runs'),
    lockDir: join(sessionDir, 'run.lock'),
  };
}
function targetPathsOf(capsule) { return new Set(capsule.changeManifest.map((row) => row.path)); }
function entryPaths(entry) { return [entry.path, entry.originalPath].filter(Boolean); }
function bindTargetStates(snapshot, session) {
  const gitFingerprint = snapshot.fingerprint; const targetStates = session.dispatch.capsule.changeManifest.map((row) => ({ action: row.action, path: row.path, state: fileState(session.rootDir, row.path) }));
  return { ...snapshot, gitFingerprint, targetStates, fingerprint: sha256(canonicalSerialize({ gitFingerprint, targetStates })) };
}
function diffStats(rootDir, capsule, snapshot) {
  const targets = [...targetPathsOf(capsule)].sort();
  const output = targets.length
    ? gitText(rootDir, ['--literal-pathspecs', 'diff', '--numstat', 'HEAD', '--', ...targets])
    : '';
  let added = 0;
  let deleted = 0;
  let binaryFiles = 0;
  for (const line of output.split('\n').filter(Boolean)) {
    const [left, right] = line.split('\t', 3);
    if (left === '-' || right === '-') binaryFiles += 1;
    else {
      added += Number(left) || 0;
      deleted += Number(right) || 0;
    }
  }
  const baseline = new Map(capsule.fileHashes.map((row) => [row.path, row])); const targetStateChanges = (snapshot.targetStates || []).filter(({ path, state }) => state.exists !== baseline.get(path)?.exists || state.sha256 !== baseline.get(path)?.sha256).map(({ path }) => path);
  const changedPaths = [...new Set([...snapshot.dirtyEntries
    .flatMap(entryPaths).filter((path) => targets.includes(path)), ...targetStateChanges])].sort();
  const untracked = new Set([...snapshot.dirtyEntries.filter((entry) => entry.code === '??' && targets.includes(entry.path)).map(({ path }) => path), ...(snapshot.targetStates || []).filter(({ action, state }) => action === 'CREATE' && state.exists).map(({ path }) => path)]);
  for (const path of untracked) {
    const bytes = readFileSync(repositoryPath(rootDir, path));
    if (bytes.includes(0)) binaryFiles += 1;
    else added += bytes.toString('utf8').split('\n').length - (bytes.at(-1) === 10 ? 1 : 0);
  }
  return { files: changedPaths.length, added, deleted, binaryFiles, untracked: untracked.size, changedPaths };
}
function assertCurrentAuthority(session) {
  const live = loadLiveAuthority(session.rootDir, session.manifestPath, session.id);
  if (sha256(live.manifestBytes) !== session.seal.authority.manifestSha256
    || sha256(live.packetBytes) !== session.seal.authority.packetSha256
    || sha256(live.indexBytes) !== session.seal.authority.indexSha256) {
    throw new Error(`implementation authority drifted for ${session.id}`);
  }
  assertCapsuleMatchesManifest(session.dispatch.capsule, live.manifest, live.packet, live.packetText);
  return live;
}
export function createImplementationSession(options = {}) {
  const rootDir = resolve(options.rootDir ?? DEFAULT_ROOT);
  const packetId = options.packetId ?? options.packet?.id;
  const manifestPath = options.manifestPath ?? DEFAULT_MANIFEST_PATH;
  const live = loadLiveAuthority(rootDir, manifestPath, packetId);
  const capsule = buildCodingCapsule(live.manifest, packetId, { rootDir });
  verifyCodingCapsule(capsule);
  if (options.capsule && canonicalSerialize(options.capsule) !== canonicalSerialize(capsule)) {
    throw new Error('supplied coding capsule disagrees with live dispatch capsule');
  }
  assertCapsuleMatchesManifest(capsule, live.manifest, live.packet, live.packetText);
  const snapshot = inspectImplementationWorktree(rootDir);
  const targetStates = capsule.changeManifest.map((row) => ({ action: row.action, path: row.path, state: fileState(rootDir, row.path) }));
  if (snapshot.branch !== capsule.verifiedBranch) {
    throw new Error(`dispatch branch mismatch: expected ${capsule.verifiedBranch}, found ${snapshot.branch}`);
  }
  assertAncestorAndSubstrate(rootDir, live.packet, capsule, snapshot.head);
  assertTargetPreflight(rootDir, live.packet);
  const paths = sessionPaths(rootDir, packetId);
  if (existsSync(paths.sessionDir)) throw new Error(`implementation session already exists: ${packetId}`);
  ensurePrivateDirectory(paths.sessionDir);
  ensurePrivateDirectory(paths.runsDir);
  const targets = targetPathsOf(capsule);
  const foreignEntries = snapshot.dirtyEntries.filter(
    (entry) => entryPaths(entry).every((path) => !targets.has(path)),
  );
  const dispatch = { schemaVersion: SESSION_SCHEMA_VERSION, id: packetId, capsule };
  const dispatchPath = writeImmutable(paths.dispatchPath, dispatch);
  const dispatchDigest = readEnvelope(dispatchPath).digest;
  const seal = {
    schemaVersion: SESSION_SCHEMA_VERSION,
    id: packetId,
    manifestPath,
    gitDir: paths.gitDir,
    verifiedBase: capsule.verifiedBase,
    branch: snapshot.branch,
    head: snapshot.head,
    capsuleDigest: capsule.capsuleDigest,
    dispatchDigest,
    authority: {
      manifestSha256: sha256(live.manifestBytes),
      packetSha256: sha256(live.packetBytes),
      indexSha256: sha256(live.indexBytes),
    },
    targetStates,
    initialSnapshot: snapshot,
    foreignEntries,
  };
  writeImmutable(paths.sealPath, seal);
  const session = openImplementationSession({ rootDir, packetId, capsule }); const finalSnapshot = assertImplementationScope(session).snapshot; if (finalSnapshot.gitFingerprint !== snapshot.fingerprint || canonicalSerialize(finalSnapshot.targetStates) !== canonicalSerialize(seal.targetStates)) throw new Error('worktree moved during implementation dispatch'); return session;
}
export function openImplementationSession(options = {}) {
  const rootDir = resolve(options.rootDir ?? DEFAULT_ROOT);
  const packetId = options.packetId ?? options.packet?.id;
  const paths = sessionPaths(rootDir, packetId);
  const dispatchEnvelope = readEnvelope(paths.dispatchPath);
  const sealEnvelope = readEnvelope(paths.sealPath);
  const dispatch = dispatchEnvelope.payload;
  const seal = sealEnvelope.payload;
  if (dispatch.id !== packetId || seal.id !== packetId) throw new Error('session packet identity mismatch');
  verifyCodingCapsule(dispatch.capsule);
  if (options.capsule
    && canonicalSerialize(options.capsule) !== canonicalSerialize(dispatch.capsule)) {
    throw new Error('session capsule disagrees with requested capsule');
  }
  if (seal.capsuleDigest !== dispatch.capsule.capsuleDigest
    || seal.dispatchDigest !== dispatchEnvelope.digest
    || seal.gitDir !== paths.gitDir) {
    throw new Error(`implementation seal disagrees with dispatch for ${packetId}`);
  }
  const session = {
    ...paths,
    manifestPath: seal.manifestPath,
    dispatch,
    dispatchDigest: dispatchEnvelope.digest,
    seal,
    sealDigest: sealEnvelope.digest,
  };
  assertCurrentAuthority(session);
  return session;
}
export function assertImplementationScope(session) {
  try {
    assertCurrentAuthority(session);
    const snapshot = bindTargetStates(inspectImplementationWorktree(session.rootDir), session);
    if (snapshot.head !== session.seal.head || snapshot.branch !== session.seal.branch) {
      throw new Error(`sealed HEAD or branch drifted for ${session.id}`);
    }
    const targets = targetPathsOf(session.dispatch.capsule);
    const currentForeign = [];
    for (const entry of snapshot.dirtyEntries) {
      const paths = entryPaths(entry);
      const targetCount = paths.filter((path) => targets.has(path)).length;
      if (targetCount > 0 && targetCount !== paths.length) {
        throw new Error(`Git status row crosses implementation scope: ${paths.join(' -> ')}`);
      }
      if (targetCount === 0) currentForeign.push(entry);
    }
    if (canonicalSerialize(currentForeign) !== canonicalSerialize(session.seal.foreignEntries)) {
      throw new Error(`sealed foreign work drifted for ${session.id}`);
    }
    return { snapshot, diffStats: diffStats(session.rootDir, session.dispatch.capsule, snapshot) };
  } catch (error) {
    if (!error.sessionInspection) {
      try {
        const snapshot = bindTargetStates(inspectImplementationWorktree(session.rootDir), session);
        error.sessionInspection = {
          snapshot,
          diffStats: diffStats(session.rootDir, session.dispatch.capsule, snapshot),
        };
      } catch {
        error.sessionInspection = null;
      }
    }
    throw error;
  }
}
function processDefinitelyDead(pid) {
  if (!Number.isInteger(pid) || pid <= 1) return false;
  try {
    process.kill(pid, 0);
    return false;
  } catch (error) {
    if (error?.code === 'ESRCH') return true;
    return false;
  }
}
export function acquireSessionRunLock(session, options = {}) {
  ensurePrivateDirectory(session.sessionDir);
  const claim = () => {
    mkdirSync(session.lockDir, { mode: 0o700 });
    const owner = { pid: process.pid, nonce: randomUUID() };
    writeImmutable(join(session.lockDir, 'owner.json'), owner);
    return { session, owner, lockDir: session.lockDir };
  };
  try {
    return claim();
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error;
  }
  if (!options.allowDeadOwnerRecovery) throw new Error(`implementation session is already running: ${session.id}`);
  let existing;
  try {
    existing = readEnvelope(join(session.lockDir, 'owner.json')).payload;
  } catch {
    throw new Error(`implementation session lock ownership is unreadable: ${session.id}`);
  }
  if (!processDefinitelyDead(existing.pid)) {
    throw new Error(`implementation session lock owner is live or uncertain: ${session.id}`);
  }
  renameSync(session.lockDir, `${session.lockDir}.dead-${randomUUID()}`);
  fsyncDirectory(session.sessionDir);
  return claim();
}
export function releaseSessionRunLock(lock) {
  const ownerPath = join(lock.lockDir, 'owner.json');
  const current = readEnvelope(ownerPath).payload;
  if (current.pid !== lock.owner.pid || current.nonce !== lock.owner.nonce) {
    throw new Error('implementation session lock ownership changed');
  }
  unlinkSync(ownerPath);
  rmdirSync(lock.lockDir);
  fsyncDirectory(dirname(lock.lockDir));
}
export function planDigestOf(plan) {
  const projection = plan.map((step) => ({
    id: step.id,
    declaredArgv: [...(step.declaredArgv ?? step.argv)],
    effectiveArgv: [...(step.effectiveArgv ?? step.argv)],
  }));
  return sha256(canonicalSerialize(projection));
}
export function allocateSessionRun(session, options = {}) {
  const plan = options.plan;
  if (!Array.isArray(plan) || !plan.length) throw new Error('session run requires a non-empty plan');
  ensurePrivateDirectory(session.runsDir);
  const ordinals = readdirSync(session.runsDir)
    .map((name) => Number(/^([0-9]{6})-/.exec(name)?.[1]))
    .filter(Number.isInteger);
  const runOrdinal = (ordinals.length ? Math.max(...ordinals) : 0) + 1;
  const runId = `${String(runOrdinal).padStart(6, '0')}-${randomUUID()}`;
  const runDir = join(session.runsDir, runId);
  mkdirSync(runDir, { mode: 0o700 });
  const stepsDir = join(runDir, 'steps');
  mkdirSync(stepsDir, { mode: 0o700 });
  const digest = planDigestOf(plan);
  writeImmutable(join(runDir, 'plan.json'), {
    runId,
    runOrdinal,
    mode: options.mode,
    sealDigest: session.sealDigest,
    planDigest: digest,
    plan,
  });
  return {
    session,
    runId,
    runOrdinal,
    runDir,
    stepsDir,
    heartbeatPath: join(runDir, 'heartbeat.json'),
    plan,
    planDigest: digest,
    mode: options.mode,
  };
}
export function writeSessionHeartbeat(run, value) {
  if ((value?.phase ?? value?.status) !== 'RUNNING' || (value.status && value.status !== 'RUNNING')) throw new Error('heartbeat phase must be RUNNING');
  const state = readSessionState(run.session);
  if (state?.runId !== run.runId || state.runOrdinal !== run.runOrdinal || state.status !== 'RUNNING' || !Number.isInteger(value.ordinal) || run.plan[value.ordinal]?.id !== value.stepId || readdirSync(run.stepsDir).some((name) => name.startsWith(`${String(value.ordinal).padStart(4, '0')}-`))) throw new Error('heartbeat step is invalid or terminal');
  return writeReplaceable(run.heartbeatPath, {
    ...value,
    runId: run.runId,
    runOrdinal: run.runOrdinal,
  });
}
export function publishStepReceipt(run, value) {
  const ordinal = value.ordinal;
  if (!Number.isInteger(ordinal) || ordinal < 0) throw new Error('step receipt requires an ordinal');
  if (run.plan[ordinal]?.id !== value.stepId || canonicalSerialize(value.declaredArgv) !== canonicalSerialize(run.plan[ordinal].declaredArgv ?? run.plan[ordinal].argv) || canonicalSerialize(value.effectiveArgv) !== canonicalSerialize(run.plan[ordinal].effectiveArgv ?? run.plan[ordinal].argv)) throw new Error('step receipt disagrees with run plan');
  const safeId = String(value.stepId || 'step').replace(/[^A-Za-z0-9._-]/g, '_');
  const file = join(run.stepsDir, `${String(ordinal).padStart(4, '0')}-${safeId}.json`);
  writeImmutable(file, {
    ...value,
    runId: run.runId,
    runOrdinal: run.runOrdinal,
    planDigest: run.planDigest,
    sealDigest: run.session.sealDigest,
  });
  return file;
}
export function readStepReceipts(session) {
  if (!existsSync(session.runsDir)) return [];
  const receipts = [];
  try {
    for (const runName of readdirSync(session.runsDir).sort()) {
      const stepsDir = join(session.runsDir, runName, 'steps');
      if (!existsSync(stepsDir)) continue;
      for (const name of readdirSync(stepsDir).sort()) {
        if (!name.endsWith('.json')) continue;
        receipts.push(readEnvelope(join(stepsDir, name)).payload);
      }
    }
  } catch {
    return [];
  }
  return receipts;
}
export function writeSessionState(session, value) { return writeReplaceable(session.statePath, value); }
export function readSessionState(session) {
  try { return readEnvelope(session.statePath).payload; } catch { return null; }
}
function validDiffStats(value) { return Number.isInteger(value?.files) && Number.isFinite(value.added) && Number.isFinite(value.deleted) && Number.isInteger(value.binaryFiles) && Number.isInteger(value.untracked) && Array.isArray(value.changedPaths); }
export function deriveResumeProjection(options) {
  const plan = options.plan;
  const latest = new Map();
  for (const receipt of options.receipts || []) {
    if (receipt.planDigest !== options.planDigest
      || receipt.sealDigest !== options.sealDigest
      || receipt.pre?.snapshot?.fingerprint !== options.currentFingerprint
      || receipt.post?.snapshot?.fingerprint !== options.currentFingerprint) continue;
    const previous = latest.get(receipt.stepId);
    if (!previous || receipt.runOrdinal > previous.runOrdinal
      || (receipt.runOrdinal === previous.runOrdinal && receipt.ordinal > previous.ordinal)) {
      latest.set(receipt.stepId, receipt);
    }
  }
  const completed = [];
  const failed = [];
  const blocked = [];
  const remaining = [];
  const selected = [];
  for (const step of plan) {
    const receipt = latest.get(step.id);
    if (step.id === 'validate-packets') {
      remaining.push(step.id);
      selected.push(step.id);
    } else if (receipt?.ordinal === plan.indexOf(step) && receipt.status === 'PASSED' && receipt.exitCode === 0 && receipt.signal === null && receipt.spawnError === null && receipt.orchestrationError === null && receipt.requestedSignal === null && Number.isFinite(receipt.elapsedMs) && receipt.elapsedMs >= 0 && receipt.pre?.scopeOk === true && receipt.post?.scopeOk === true && validDiffStats(receipt.pre.diffStats) && validDiffStats(receipt.post.diffStats) && canonicalSerialize(receipt.declaredArgv) === canonicalSerialize(step.declaredArgv ?? step.argv) && canonicalSerialize(receipt.effectiveArgv) === canonicalSerialize(step.effectiveArgv ?? step.argv)) completed.push(step.id);
    else {
      selected.push(step.id);
      if (!receipt) remaining.push(step.id);
      else if (receipt.status === 'BLOCKED') blocked.push(step.id);
      else failed.push(step.id);
    }
  }
  return { completed, failed, blocked, remaining, selected };
}
export function runImplementationSessionCli(argv, options = {}) {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  try {
    if (argv.length !== 2 || argv[0] !== 'dispatch' || !ID_TOKEN.test(argv[1])) {
      throw new Error('usage: implementation-session.mjs dispatch <ID>');
    }
    const session = createImplementationSession({
      rootDir: options.rootDir ?? DEFAULT_ROOT,
      packetId: argv[1],
    });
    stdout.write(`${JSON.stringify({
      id: session.id,
      sessionDir: session.sessionDir,
      sealDigest: session.sealDigest,
      capsule: session.dispatch.capsule,
    }, null, 2)}\n`);
    return 0;
  } catch (error) {
    stderr.write(`[implementation-session] ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = runImplementationSessionCli(process.argv.slice(2));
}
