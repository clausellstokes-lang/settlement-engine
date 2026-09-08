#!/usr/bin/env node
/**
 * Fast implementation feedback without weakening the final `npm run check` gate.
 *
 * - `packet <id>` runs the packet validator, both global type ratchets, targeted
 *   lint, and the packet's closed argv-form focused checks.
 * - `quick [--base <ref>]` performs the same static preflight over changed files.
 * - `diagnose` runs every canonical check group, keeps build + verify:dist paired,
 *   collects all group exits, and returns non-zero after the complete diagnosis.
 *
 * @enforced-by tests/scripts/implementationGate.test.js
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { validatePacketManifest } from './implementation-packets.mjs';
import {
  acquireSessionRunLock, allocateSessionRun, assertImplementationScope,
  deriveResumeProjection, openImplementationSession, planDigestOf, publishStepReceipt,
  readSessionState, readStepReceipts, releaseSessionRunLock, writeSessionHeartbeat,
  writeSessionState,
} from './implementation-session.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOGIC_EXTENSIONS = new Set(['.cjs', '.js', '.jsx', '.mjs', '.ts', '.tsx']);
const PACKET_ID = /^[A-Za-z0-9][A-Za-z0-9+._-]*$/;
const CLI_USAGE = 'usage: implementation-gate.mjs <packet <ID>|resume <ID>|quick [--base <ref>]|diagnose>';

function executableName(token) {
  return String(token || '').replace(/\\/g, '/').split('/').pop().toLowerCase();
}

function isVitestToken(token) {
  return /^vitest(?:@[^/\\\s]+)?(?:\.(?:mjs|cjs|js|cmd|exe))?$/i.test(executableName(token));
}

/**
 * Classify the argv boundary that owns Vitest serialization. Package scripts
 * such as `npm run test:ratchet` classify as `none`: those scripts own their
 * mutex internally. An explicit gate-mutex prefix is already serialized and
 * must never be wrapped a second time.
 */
export function classifyVitestCommand(argv) {
  if (!Array.isArray(argv) || argv.length === 0 || argv.some((token) => typeof token !== 'string')) {
    return 'none';
  }

  const first = executableName(argv[0]);
  const second = executableName(argv[1]);
  const shellPrefix = ['sh', 'bash', 'dash', 'zsh'].includes(first)
    && second === 'gate-mutex.sh'
    && argv[2] === '--run'
    && argv[3] === '--';
  const directPrefix = first === 'gate-mutex.sh' && argv[1] === '--run' && argv[2] === '--';
  if (shellPrefix || directPrefix) return 'already-held';

  if (isVitestToken(argv[0])) return 'raw';
  if (['npx', 'npx.cmd', 'bunx', 'bunx.exe'].includes(first)) {
    return argv.slice(1).some(isVitestToken) ? 'raw' : 'none';
  }
  if (['npm', 'npm.cmd'].includes(first) && ['exec', 'x'].includes(argv[1])) {
    return argv.slice(2).some(isVitestToken) ? 'raw' : 'none';
  }
  if (['pnpm', 'pnpm.cmd', 'yarn', 'yarn.cmd'].includes(first)) {
    return argv.slice(1).some(isVitestToken) ? 'raw' : 'none';
  }
  if (['node', 'node.exe'].includes(first)) {
    const script = argv.slice(1).find((token) => !token.startsWith('-'));
    return isVitestToken(script) ? 'raw' : 'none';
  }
  return 'none';
}

export function effectiveArgv(argv) {
  return classifyVitestCommand(argv) === 'raw' ? [
    'sh', 'scripts/gate-mutex.sh', '--run', '--', ...argv,
  ] : [...argv];
}

/** Parse every mode before any filesystem or child-process work. */
export function parseCliArgs(args) {
  if (!Array.isArray(args) || args.some((arg) => typeof arg !== 'string')) {
    throw new Error(CLI_USAGE);
  }
  const [mode, ...rest] = args;
  if (mode === 'packet' || mode === 'resume') {
    if (rest.length !== 1 || !PACKET_ID.test(rest[0])) {
      throw new Error(`${mode} mode requires exactly one bounded ID\n${CLI_USAGE}`);
    }
    return { mode, id: rest[0] };
  }
  if (mode === 'quick') {
    if (rest.length === 0) return { mode, base: 'HEAD' };
    if (
      rest.length !== 2
      || rest[0] !== '--base'
      || !rest[1]
      || rest[1].startsWith('-')
      || /[\0\s]/.test(rest[1])
    ) {
      throw new Error(`quick mode accepts only an optional --base <ref> pair\n${CLI_USAGE}`);
    }
    return { mode, base: rest[1] };
  }
  if (mode === 'diagnose') {
    if (rest.length !== 0) throw new Error(`diagnose mode accepts no arguments\n${CLI_USAGE}`);
    return { mode };
  }
  throw new Error(CLI_USAGE);
}

export function checkStepsFromPackage(pkg) {
  const script = pkg?.scripts?.check;
  if (typeof script !== 'string' || !script.trim()) {
    throw new Error('package.json has no canonical `check` script');
  }
  const steps = script.split('&&').map((part) => part.trim()).map((part) => {
    const match = /^npm run ([A-Za-z0-9:_-]+)$/.exec(part);
    if (!match) throw new Error(`unsupported check-chain command: ${part}`);
    return match[1];
  });
  if (!steps.length) throw new Error('canonical check chain is empty');
  return steps;
}

/** Group independent evidence while preserving order inside each group. */
export function diagnosticGroups(steps) {
  const groups = [];
  for (const step of steps) {
    if (step === 'verify:dist') continue;
    if (step === 'build') {
      const verifyIndex = steps.indexOf('verify:dist');
      if (verifyIndex < 0 || verifyIndex < steps.indexOf('build')) {
        throw new Error('canonical gate must keep verify:dist after build');
      }
      groups.push({ id: 'build-and-dist', steps: ['build', 'verify:dist'] });
      continue;
    }
    groups.push({ id: step.replace(/:/g, '-'), steps: [step] });
  }
  const flattened = groups.flatMap((group) => group.steps);
  if (flattened.length !== steps.length || new Set(flattened).size !== steps.length) {
    throw new Error('diagnostic grouping must cover every canonical gate step exactly once');
  }
  return groups;
}

export function resultPassed(result) {
  return result?.exitCode === 0 && !result.signal && !result.spawnError
    && !result.orchestrationError && result.invalidated !== true &&
    (!Object.hasOwn(result, 'status') || result.status === 'PASSED');
}

export function aggregateExit(results) { return results.some((result) => !resultPassed(result)) ? 1 : 0; }

export function logicBearingPaths(entries, root = ROOT) {
  return [...new Set((entries || [])
    .map((entry) => entry?.path)
    .filter((path) => typeof path === 'string' && LOGIC_EXTENSIONS.has(extname(path)))
    .filter((path) => existsSync(join(root, path))))]
    .sort((a, b) => a.localeCompare(b, 'en'));
}

export function packetPlan(packet, root = ROOT) {
  if (!packet || packet.status !== 'READY') {
    throw new Error(`packet ${packet?.id || '<unknown>'} is not READY`);
  }
  const plan = [
    {
      id: 'validate-packets',
      argv: ['node', 'scripts/implementation-packets.mjs', 'validate'],
    },
    { id: 'typecheck-full', argv: ['npm', 'run', 'typecheck:ratchet'] },
    { id: 'typecheck-domain', argv: ['npm', 'run', 'typecheck:domain:strict'] },
  ];
  const lintPaths = logicBearingPaths(packet.changeManifest, root);
  if (lintPaths.length) plan.push({ id: 'lint-manifest', argv: ['npx', 'eslint', ...lintPaths] });
  for (const [index, argv] of (packet.checks || []).entries()) {
    plan.push({ id: `focused-${index + 1}`, argv: [...argv] });
  }
  return plan;
}

function runArgv(argv, { cwd = ROOT, env = process.env } = {}) {
  const command = effectiveArgv(argv);
  const started = performance.now();
  const result = spawnSync(command[0], command.slice(1), {
    cwd,
    env,
    encoding: 'utf8',
    stdio: 'inherit',
    shell: false,
  });
  return {
    exitCode: result.status ?? 1,
    elapsedMs: Math.round(performance.now() - started),
    error: result.error ? String(result.error.message || result.error) : null,
  };
}

function serializeSpawnError(error) {
  if (!error) return null;
  return { name: typeof error.name === 'string' ? error.name : 'Error',
    message: typeof error.message === 'string' ? error.message : String(error),
    code: typeof error.code === 'string' || typeof error.code === 'number' ? error.code : null,
    errno: typeof error.errno === 'string' || typeof error.errno === 'number' ? error.errno : null,
    syscall: typeof error.syscall === 'string' ? error.syscall : null,
    path: typeof error.path === 'string' ? error.path : null };
}

export function forwardChildSignal(child, signal) {
  if (!child || !signal) return false;
  if (process.platform !== 'win32' && Number.isInteger(child.pid)) {
    try {
      process.kill(-child.pid, signal);
      return true;
    } catch {
      // The group may have already closed; fall through to the direct child.
    }
  }
  try {
    return child.kill(signal);
  } catch {
    return false;
  }
}

export async function runArgvAsync(argv, options = {}) {
  if (!Array.isArray(argv) || argv.length === 0 || argv.some((token) => typeof token !== 'string')) {
    throw new Error('async argv must be a non-empty string array');
  }
  const command = effectiveArgv(argv);
  const started = performance.now();
  const heartbeatMs = Number.isFinite(options.heartbeatMs)
    ? Math.max(10, Math.floor(options.heartbeatMs))
    : 30_000;
  const spawnChild = options.spawnChild ?? spawn;

  return new Promise((resolveResult) => {
    let child;
    let spawnError = null;
    let orchestrationError = null;
    let timer = null;
    let settled = false;
    const finish = (exitCode, signal) => {
      if (settled) return;
      settled = true;
      if (timer) clearInterval(timer);
      resolveResult({
        declaredArgv: [...argv],
        effectiveArgv: command,
        exitCode: Number.isInteger(exitCode) ? exitCode : null,
        signal: typeof signal === 'string' ? signal : null,
        spawnError,
        orchestrationError,
        elapsedMs: Math.round(performance.now() - started),
      });
    };

    try {
      child = spawnChild(command[0], command.slice(1), {
        cwd: options.cwd ?? ROOT,
        env: options.env ?? process.env,
        stdio: 'inherit',
        shell: false,
        detached: options.detached ?? process.platform !== 'win32',
      });
    } catch (error) {
      spawnError = serializeSpawnError(error);
      finish(null, null);
      return;
    }

    child.once('error', (error) => {
      spawnError = serializeSpawnError(error);
    });
    child.once('close', (exitCode, signal) => finish(exitCode, signal));
    const runHook = (hook) => {
      if (!hook || orchestrationError) return;
      try {
        hook(child);
      } catch (error) {
        orchestrationError = serializeSpawnError(error);
        forwardChildSignal(child, 'SIGTERM');
      }
    };
    runHook(options.onSpawn);
    runHook(options.onHeartbeat);
    timer = setInterval(() => runHook(options.onHeartbeat), heartbeatMs);
    timer.unref?.();
  });
}

export function runPlan(plan, options = {}) {
  const results = [];
  const failFast = options.failFast !== false;
  for (const item of plan) {
    process.stdout.write(`\n[implementation-gate] ${item.id}: ${item.argv.join(' ')}\n`);
    const result = runArgv(item.argv, options);
    results.push({ id: item.id, ...result });
    if (failFast && result.exitCode !== 0) break;
  }
  return results;
}

/**
 * The child-process validator is a dispatch prerequisite, not one more
 * fail-collect datum. This closes the race in which the manifest changes after
 * synchronous validation but before the plan starts. Only its zero exit opens
 * the remaining type/lint/focused evidence plan.
 */
export function runPacketPlan(plan, options = {}, executePlan = runPlan) {
  if (!Array.isArray(plan) || plan[0]?.id !== 'validate-packets') {
    throw new Error('packet plan must begin with validate-packets');
  }
  const [validator, ...evidence] = plan;
  const prerequisiteResults = executePlan([validator], { ...options, failFast: true });
  if (
    prerequisiteResults.length !== 1
    || prerequisiteResults[0].id !== validator.id
  ) {
    throw new Error('packet validator execution returned an invalid result set');
  }
  if (prerequisiteResults[0].exitCode !== 0 || evidence.length === 0) {
    return prerequisiteResults;
  }
  return [
    ...prerequisiteResults,
    ...executePlan(evidence, { ...options, failFast: false }),
  ];
}

const SESSION_API = {
  acquireSessionRunLock, allocateSessionRun, assertImplementationScope,
  deriveResumeProjection, openImplementationSession, planDigestOf, publishStepReceipt,
  readSessionState, readStepReceipts, releaseSessionRunLock, writeSessionHeartbeat,
  writeSessionState,
};

function sealedPlan(packet, root) {
  return packetPlan(packet, root).map((step) => ({ id: step.id,
    declaredArgv: [...step.argv], effectiveArgv: effectiveArgv(step.argv) }));
}

function scopeFailure(error) {
  return { scopeOk: false,
    snapshot: error?.sessionInspection?.snapshot ?? null,
    diffStats: error?.sessionInspection?.diffStats ?? null,
    error: error instanceof Error ? error.message : String(error) };
}

function durableState(run, status, fingerprint, completed, failed, blocked, plan) {
  const accounted = new Set([...completed, ...failed, ...blocked]);
  return { runId: run.runId, runOrdinal: run.runOrdinal, sealDigest: run.session.sealDigest,
    planDigest: run.planDigest, currentFingerprint: fingerprint, status,
    completed: [...completed], failed: [...failed], blocked: [...blocked],
    remaining: plan.map((step) => step.id).filter((id) => !accounted.has(id)) };
}

export async function runSealedPacketPlan(packet, options = {}) {
  const root = resolve(options.root ?? ROOT);
  const mode = options.mode ?? 'packet';
  const api = options.sessionApi ?? SESSION_API;
  const plan = sealedPlan(packet, root);
  const planDigest = api.planDigestOf(plan);
  const session = api.openImplementationSession({ rootDir: root, packetId: packet.id });
  const lock = api.acquireSessionRunLock(session, { allowDeadOwnerRecovery: mode === 'resume' });
  const signalBus = options.signalBus ?? process;
  const runChild = options.runChild ?? runArgvAsync;
  let currentChild = null;
  let requestedSignal = null;
  let signalForwarded = false;
  const requestSignal = (signal) => {
    if (requestedSignal) return;
    requestedSignal = signal;
    if (currentChild) signalForwarded = forwardChildSignal(currentChild, signal);
  };
  const handlers = new Map([['SIGINT', () => requestSignal('SIGINT')],
    ['SIGTERM', () => requestSignal('SIGTERM')]]);
  try {
    const initial = api.assertImplementationScope(session);
    const priorState = api.readSessionState(session);
    const canResume = mode === 'resume'
      && priorState?.sealDigest === session.sealDigest
      && priorState?.planDigest === planDigest
      && priorState?.currentFingerprint === initial.snapshot.fingerprint;
    const projection = canResume ? api.deriveResumeProjection({ plan,
      receipts: api.readStepReceipts(session),
      currentFingerprint: initial.snapshot.fingerprint, planDigest,
      sealDigest: session.sealDigest })
      : { completed: [], selected: plan.map((step) => step.id) };
    const run = api.allocateSessionRun(session, { plan, mode });
    const abandoned = priorState?.status === 'RUNNING' ? new Set(priorState.remaining || []) : new Set(); const reusable = new Set((projection.completed || []).filter((id) => !abandoned.has(id)));
    const completed = [];
    const failed = [];
    const blocked = [];
    const results = [];
    let fingerprint = initial.snapshot.fingerprint;
    let validatorPassed = false;
    for (const [signal, handler] of handlers) signalBus.on(signal, handler);

    for (let ordinal = 0; ordinal < plan.length; ordinal += 1) {
      const step = plan[ordinal];
      if (requestedSignal || (step.id !== 'validate-packets' && !validatorPassed)) {
        const scope = { scopeOk: true, snapshot: { fingerprint }, diffStats: null }; const receipt = { ordinal, stepId: step.id, declaredArgv: step.declaredArgv, effectiveArgv: step.effectiveArgv, exitCode: null, signal: null, requestedSignal, spawnError: null, orchestrationError: null, elapsedMs: 0, pre: scope, post: scope, status: 'BLOCKED' };
        api.publishStepReceipt(run, receipt);
        blocked.push(step.id);
        results.push({ id: step.id, ...receipt });
        continue;
      }

      let pre;
      try {
        pre = api.assertImplementationScope(session); if (pre.snapshot.fingerprint !== fingerprint) throw Object.assign(new Error('implementation state moved between session steps'), { sessionInspection: pre });
      } catch (error) {
        const failedScope = scopeFailure(error);
        const receipt = { ordinal, stepId: step.id,
          declaredArgv: step.declaredArgv, effectiveArgv: step.effectiveArgv,
          exitCode: null, signal: null, requestedSignal, spawnError: null,
          orchestrationError: null, elapsedMs: 0, pre: failedScope,
          post: failedScope, status: 'BLOCKED' };
        api.publishStepReceipt(run, receipt);
        blocked.push(step.id);
        results.push({ id: step.id, ...receipt });
        validatorPassed = false;
        continue;
      }
      fingerprint = pre.snapshot.fingerprint;
      if (step.id !== 'validate-packets' && reusable.has(step.id)) {
        completed.push(step.id);
        results.push({ id: step.id, status: 'PASSED', exitCode: 0, elapsedMs: 0, reused: true });
        continue;
      }
      api.writeSessionState(session, durableState(
        run, 'RUNNING', fingerprint, completed, failed, blocked, plan,
      ));
      const stepStarted = performance.now();
      const childResult = await runChild(step.declaredArgv, {
        cwd: root,
        heartbeatMs: options.heartbeatMs,
        onSpawn: (child) => {
          currentChild = child;
          if (requestedSignal && !signalForwarded) {
            signalForwarded = forwardChildSignal(child, requestedSignal);
          }
        },
        onHeartbeat: () => api.writeSessionHeartbeat(run, {
          ordinal, stepId: step.id, phase: 'RUNNING', pid: currentChild?.pid ?? null,
          elapsedMs: Math.round(performance.now() - stepStarted),
        }),
      });
      currentChild = null;
      let post;
      let postError = null;
      try {
        post = api.assertImplementationScope(session);
      } catch (error) {
        postError = error;
        post = scopeFailure(error);
      }
      const moved = !post.scopeOk && post.scopeOk !== undefined
        ? true
        : post.snapshot?.fingerprint !== pre.snapshot.fingerprint;
      const argvMoved = canonicalArgv(childResult.declaredArgv) !== canonicalArgv(step.declaredArgv)
        || canonicalArgv(childResult.effectiveArgv) !== canonicalArgv(step.effectiveArgv);
      let status = 'FAILED';
      if (requestedSignal || childResult.signal) status = 'INTERRUPTED';
      else if (postError || moved || argvMoved || childResult.orchestrationError) status = 'INVALIDATED';
      else if (childResult.exitCode === 0 && !childResult.spawnError) status = 'PASSED';
      const receipt = { ordinal, stepId: step.id,
        declaredArgv: childResult.declaredArgv, effectiveArgv: childResult.effectiveArgv,
        exitCode: childResult.exitCode, signal: childResult.signal, requestedSignal,
        spawnError: childResult.spawnError, orchestrationError: childResult.orchestrationError,
        elapsedMs: childResult.elapsedMs, pre: { ...pre, scopeOk: true },
        post: postError ? post : { ...post, scopeOk: true }, status };
      api.publishStepReceipt(run, receipt);
      results.push({ id: step.id, ...receipt });
      fingerprint = post.snapshot?.fingerprint ?? fingerprint;
      if (status === 'PASSED') completed.push(step.id);
      else if (status === 'FAILED' || status === 'INTERRUPTED') failed.push(step.id);
      else blocked.push(step.id);
      if (step.id === 'validate-packets') validatorPassed = status === 'PASSED';
      if (['INTERRUPTED', 'INVALIDATED'].includes(status)) validatorPassed = false;
      api.writeSessionState(session, durableState(
        run, status, fingerprint, completed, failed, blocked, plan,
      ));
    }
    let finalScope; try { finalScope = api.assertImplementationScope(session); } catch (error) { api.writeSessionState(session, durableState(run, 'INVALIDATED', error?.sessionInspection?.snapshot?.fingerprint ?? fingerprint, completed, failed, blocked, plan)); throw error; }
    if (finalScope.snapshot.fingerprint !== fingerprint) { api.writeSessionState(session, durableState(run, 'INVALIDATED', finalScope.snapshot.fingerprint, completed, failed, blocked, plan)); throw new Error('implementation state moved before final session receipt'); }
    const finalStatus = requestedSignal || results.some(({ status }) => status === 'INTERRUPTED') ? 'INTERRUPTED' : blocked.length ? 'BLOCKED' : failed.length ? 'FAILED' : 'PASSED';
    api.writeSessionState(session, durableState(run, finalStatus, fingerprint, completed, failed, blocked, plan));
    return results;
  } finally {
    for (const [signal, handler] of handlers) signalBus.off(signal, handler);
    api.releaseSessionRunLock(lock);
  }
}

function canonicalArgv(argv) { return Array.isArray(argv) ? JSON.stringify(argv) : ''; }

function readManifest(root = ROOT) {
  return JSON.parse(readFileSync(join(root, 'docs/implementation/PACKET_MANIFEST.json'), 'utf8'));
}

function readPackage(root = ROOT) {
  return JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
}

function changedPaths(root, base) {
  const tracked = spawnSync('git', ['diff', '--name-only', '--diff-filter=ACMR', base, '--'], {
    cwd: root,
    encoding: 'utf8',
    shell: false,
  });
  if (tracked.status !== 0) throw new Error(tracked.stderr || `git diff failed for ${base}`);
  const untracked = spawnSync('git', ['ls-files', '--others', '--exclude-standard'], {
    cwd: root,
    encoding: 'utf8',
    shell: false,
  });
  if (untracked.status !== 0) throw new Error(untracked.stderr || 'git ls-files failed');
  return [...new Set(`${tracked.stdout}\n${untracked.stdout}`.split(/\r?\n/).filter(Boolean))];
}

function printSummary(results, label) {
  process.stdout.write(`\n[implementation-gate] ${label} summary\n`);
  for (const result of results) {
    process.stdout.write(`  ${result.id}: exit ${result.exitCode}, ${result.elapsedMs} ms\n`);
  }
}

export function runCli(args = process.argv.slice(2), root = ROOT) {
  const command = parseCliArgs(args);
  if (command.mode === 'packet' || command.mode === 'resume') {
    const manifest = readManifest(root);
    const validation = validatePacketManifest(manifest, { rootDir: root });
    if (!validation.ok) {
      throw new Error(`packet manifest is invalid and non-dispatchable:\n${validation.errors.join('\n')}`);
    }
    const packet = manifest.packets.find((entry) => entry.id === command.id);
    if (!packet) throw new Error(`unknown implementation packet: ${command.id}`);
    process.stdout.write('[implementation-gate] sealed packet evidence is an inner loop; `npm run check` remains the landing gate.\n');
    return runSealedPacketPlan(packet, { root, mode: command.mode }).then((results) => {
      printSummary(results, `${command.mode} ${command.id}`);
      return aggregateExit(results);
    });
  }

  if (command.mode === 'quick') {
    const entries = changedPaths(root, command.base).map((path) => ({ path }));
    const lintPaths = logicBearingPaths(entries, root);
    const plan = [
      { id: 'validate-packets', argv: ['node', 'scripts/implementation-packets.mjs', 'validate'] },
      { id: 'typecheck-full', argv: ['npm', 'run', 'typecheck:ratchet'] },
      { id: 'typecheck-domain', argv: ['npm', 'run', 'typecheck:domain:strict'] },
    ];
    if (lintPaths.length) plan.push({ id: 'lint-changed', argv: ['npx', 'eslint', ...lintPaths] });
    process.stdout.write('[implementation-gate] QUICK IS NON-AUTHORITATIVE: it does not replace focused tests or `npm run check`.\n');
    const results = runPlan(plan, { cwd: root, failFast: false });
    printSummary(results, 'quick');
    return aggregateExit(results);
  }

  if (command.mode === 'diagnose') {
    const steps = checkStepsFromPackage(readPackage(root));
    const groups = diagnosticGroups(steps);
    const results = [];
    process.stdout.write('[implementation-gate] diagnostic mode collects all group failures; `npm run check` remains authoritative.\n');
    for (const group of groups) {
      const started = performance.now();
      let exitCode = 0;
      for (const step of group.steps) {
        const result = runArgv(['npm', 'run', step], { cwd: root });
        if (result.exitCode !== 0) {
          exitCode = result.exitCode;
          break;
        }
      }
      results.push({
        id: group.id,
        exitCode,
        elapsedMs: Math.round(performance.now() - started),
      });
    }
    printSummary(results, 'diagnose');
    return aggregateExit(results);
  }

  throw new Error(CLI_USAGE);
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  try {
    const result = runCli();
    if (result && typeof result.then === 'function') {
      result.then(
        (exitCode) => { process.exitCode = exitCode; },
        (error) => {
          console.error(`[implementation-gate] ${error instanceof Error ? error.message : String(error)}`);
          process.exitCode = 2;
        },
      );
    } else process.exitCode = result;
  } catch (error) {
    console.error(`[implementation-gate] ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 2;
  }
}
