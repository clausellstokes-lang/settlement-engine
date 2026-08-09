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
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { validatePacketManifest } from './implementation-packets.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOGIC_EXTENSIONS = new Set(['.cjs', '.js', '.jsx', '.mjs', '.ts', '.tsx']);
const PACKET_ID = /^[A-Za-z0-9][A-Za-z0-9+._-]*$/;
const CLI_USAGE = 'usage: implementation-gate.mjs <packet <ID>|quick [--base <ref>]|diagnose>';

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

/** Parse every mode before any filesystem or child-process work. */
export function parseCliArgs(args) {
  if (!Array.isArray(args) || args.some((arg) => typeof arg !== 'string')) {
    throw new Error(CLI_USAGE);
  }
  const [mode, ...rest] = args;
  if (mode === 'packet') {
    if (rest.length !== 1 || !PACKET_ID.test(rest[0])) {
      throw new Error(`packet mode requires exactly one bounded ID\n${CLI_USAGE}`);
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

export function aggregateExit(results) {
  return results.some((result) => Number(result.exitCode) !== 0) ? 1 : 0;
}

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
  const command = classifyVitestCommand(argv) === 'raw'
    ? ['sh', 'scripts/gate-mutex.sh', '--run', '--', ...argv]
    : argv;
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
  if (command.mode === 'packet') {
    const manifest = readManifest(root);
    const validation = validatePacketManifest(manifest, { rootDir: root });
    if (!validation.ok) {
      throw new Error(`packet manifest is invalid and non-dispatchable:\n${validation.errors.join('\n')}`);
    }
    const packet = manifest.packets.find((entry) => entry.id === command.id);
    if (!packet) throw new Error(`unknown implementation packet: ${command.id}`);
    process.stdout.write('[implementation-gate] packet check is an inner loop; `npm run check` remains the landing gate.\n');
    const results = runPacketPlan(packetPlan(packet, root), { cwd: root });
    printSummary(results, `packet ${command.id}`);
    return aggregateExit(results);
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
    process.exitCode = runCli();
  } catch (error) {
    console.error(`[implementation-gate] ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 2;
  }
}
