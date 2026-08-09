import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { EventEmitter } from 'node:events';
import { describe, expect, it } from 'vitest';
import {
  aggregateExit,
  checkStepsFromPackage,
  classifyVitestCommand,
  diagnosticGroups,
  effectiveArgv,
  logicBearingPaths,
  parseCliArgs,
  packetPlan,
  resultPassed,
  runCli,
  runArgvAsync,
  runPacketPlan,
  runSealedPacketPlan,
} from '../../scripts/implementation-gate.mjs';

const packetFixture = (checks = []) => ({
  id: 'X-1', status: 'READY', changeManifest: [], checks,
});

function childResult(argv, patch = {}) {
  return { declaredArgv: [...argv], effectiveArgv: effectiveArgv(argv), exitCode: 0,
    signal: null, spawnError: null, orchestrationError: null, elapsedMs: 1, ...patch };
}

function sessionHarness({ fingerprints = ['exact'], priorState = null,
  receipts = [], reusable = [] } = {}) {
  let inspection = 0;
  const published = [];
  const states = [];
  const projections = [];
  const session = { sealDigest: 'seal' };
  const api = {
    planDigestOf: () => 'plan',
    openImplementationSession: () => session,
    acquireSessionRunLock: () => ({ lock: true }),
    releaseSessionRunLock: () => {},
    assertImplementationScope: () => ({
      snapshot: { fingerprint: fingerprints[Math.min(inspection++, fingerprints.length - 1)] },
      diffStats: {},
    }),
    readSessionState: () => priorState,
    readStepReceipts: () => receipts,
    deriveResumeProjection: (input) => {
      projections.push(input);
      return { completed: reusable, selected: [] };
    },
    allocateSessionRun: (opened) => ({ runId: 'run', session: opened, planDigest: 'plan' }),
    publishStepReceipt: (_run, receipt) => published.push(receipt),
    writeSessionHeartbeat: () => {},
    writeSessionState: (_opened, state) => states.push(state),
  };
  return { api, published, states, projections, inspectionCount: () => inspection };
}

describe('implementation gate planning', () => {
  const steps = [
    'validate:data',
    'validate:packets',
    'typecheck:ratchet',
    'typecheck:domain:strict',
    'lint',
    'test:ratchet',
    'build',
    'verify:dist',
  ];

  it('parses only the canonical npm-run chain and covers it once', () => {
    expect(checkStepsFromPackage({
      scripts: { check: steps.map((step) => `npm run ${step}`).join(' && ') },
    })).toEqual(steps);
    expect(() => checkStepsFromPackage({ scripts: { check: 'npm run lint; true' } })).toThrow(
      /unsupported check-chain command/,
    );

    const groups = diagnosticGroups(steps);
    expect(groups.flatMap((group) => group.steps)).toEqual(steps);
    expect(groups.find((group) => group.id === 'build-and-dist')?.steps).toEqual([
      'build',
      'verify:dist',
    ]);
  });

  it('retains every failure in aggregate status', () => {
    expect(aggregateExit([{ exitCode: 0 }, { exitCode: 0 }])).toBe(0);
    expect(aggregateExit([{ exitCode: 0 }, { exitCode: 7 }, { exitCode: 0 }])).toBe(1);
    expect(resultPassed({ exitCode: null, signal: 'SIGTERM' })).toBe(false);
    expect(resultPassed({ exitCode: null, spawnError: 'ENOENT' })).toBe(false);
    expect(resultPassed({ exitCode: 0, status: 'INTERRUPTED' })).toBe(false);
    expect(resultPassed({ exitCode: 0, status: 'RUNNING' })).toBe(false);
  });

  it('builds a non-vacuous READY packet plan with both global type ratchets', () => {
    const packet = {
      id: 'X-1',
      status: 'READY',
      changeManifest: [
        { path: 'scripts/implementation-gate.mjs' },
        { path: 'tests/scripts/implementationGate.test.js' },
        { path: 'docs/implementation/INDEX.md' },
        { path: 'not-created-yet.js' },
      ],
      checks: [['npx', 'vitest', 'run', 'tests/scripts/implementationGate.test.js']],
    };
    const plan = packetPlan(packet);
    expect(plan.map((item) => item.id)).toEqual([
      'validate-packets',
      'typecheck-full',
      'typecheck-domain',
      'lint-manifest',
      'focused-1',
    ]);
    expect(plan.find((item) => item.id === 'lint-manifest').argv).toContain(
      'scripts/implementation-gate.mjs',
    );
    expect(logicBearingPaths(packet.changeManifest)).not.toContain('not-created-yet.js');
    expect(() => packetPlan({ ...packet, status: 'BLOCKED' })).toThrow(/not READY/);
  });

  it('runs child validation as a hard prerequisite, then fail-collects remaining evidence', () => {
    const plan = [
      { id: 'validate-packets', argv: ['node', 'validate'] },
      { id: 'typecheck-full', argv: ['npm', 'run', 'typecheck'] },
      { id: 'focused-1', argv: ['npx', 'vitest', 'run', 'tests/focused.test.js'] },
    ];
    const blockedCalls = [];
    const blocked = runPacketPlan(plan, { cwd: '/fixture' }, (items, options) => {
      blockedCalls.push({ ids: items.map(({ id }) => id), failFast: options.failFast });
      return items.map(({ id }) => ({ id, exitCode: 7, elapsedMs: 1 }));
    });
    expect(blockedCalls).toEqual([{ ids: ['validate-packets'], failFast: true }]);
    expect(blocked).toEqual([{ id: 'validate-packets', exitCode: 7, elapsedMs: 1 }]);

    const openCalls = [];
    const collected = runPacketPlan(plan, { cwd: '/fixture' }, (items, options) => {
      openCalls.push({ ids: items.map(({ id }) => id), failFast: options.failFast });
      return items.map(({ id }) => ({
        id,
        exitCode: id === 'typecheck-full' ? 5 : 0,
        elapsedMs: 1,
      }));
    });
    expect(openCalls).toEqual([
      { ids: ['validate-packets'], failFast: true },
      { ids: ['typecheck-full', 'focused-1'], failFast: false },
    ]);
    expect(collected.map(({ id, exitCode }) => [id, exitCode])).toEqual([
      ['validate-packets', 0],
      ['typecheck-full', 5],
      ['focused-1', 0],
    ]);
  });

  it('hard-blocks after validator failure but fail-collects ordinary evidence failures', async () => {
    const packet = packetFixture([['node', 'focused-one']]);
    const blockedHarness = sessionHarness();
    const blockedCalls = [];
    const blocked = await runSealedPacketPlan(packet, {
      root: process.cwd(), sessionApi: blockedHarness.api, signalBus: new EventEmitter(),
      runChild: async (argv) => {
        blockedCalls.push(argv);
        return childResult(argv, { exitCode: 9 });
      },
    });
    expect(blockedCalls).toHaveLength(1);
    expect(blocked.map(({ status }) => status)).toEqual([
      'FAILED', 'BLOCKED', 'BLOCKED', 'BLOCKED',
    ]);
    expect(blockedHarness.published.map(({ status }) => status)).toEqual(['FAILED', 'BLOCKED', 'BLOCKED', 'BLOCKED']);

    const openHarness = sessionHarness();
    const openCalls = [];
    const collected = await runSealedPacketPlan(packet, {
      root: process.cwd(), sessionApi: openHarness.api, signalBus: new EventEmitter(),
      runChild: async (argv) => {
        openCalls.push(argv);
        return childResult(argv, { exitCode: openCalls.length === 2 ? 5 : 0 });
      },
    });
    expect(openCalls).toHaveLength(4);
    expect(collected.map(({ status }) => status)).toEqual([
      'PASSED', 'FAILED', 'PASSED', 'PASSED',
    ]);
  });

  it('invalidates evidence on post-step fingerprint motion and blocks later children', async () => {
    const harness = sessionHarness({ fingerprints: ['before', 'before', 'after'] });
    const calls = [];
    const results = await runSealedPacketPlan(packetFixture([['node', 'focused-one']]), {
      root: process.cwd(), sessionApi: harness.api, signalBus: new EventEmitter(),
      runChild: async (argv) => {
        calls.push(argv);
        return childResult(argv, { declaredArgv: ['node', 'actual-child-argv'] });
      },
    });
    expect(calls).toHaveLength(1);
    expect(results.map(({ status }) => status)).toEqual([
      'INVALIDATED', 'BLOCKED', 'BLOCKED', 'BLOCKED',
    ]);
    expect(harness.published[0]).toMatchObject({
      stepId: 'validate-packets', status: 'INVALIDATED',
      declaredArgv: ['node', 'actual-child-argv'],
      pre: { snapshot: { fingerprint: 'before' } },
      post: { snapshot: { fingerprint: 'after' } },
    });
  });

  it('resume reruns validation, reuses exact passes, and reruns an abandoned current step', async () => {
    const receipts = [{ stepId: 'typecheck-full', status: 'PASSED',
      post: { snapshot: { fingerprint: 'exact' } } }];
    const harness = sessionHarness({
      priorState: { sealDigest: 'seal', planDigest: 'plan', currentFingerprint: 'exact', status: 'RUNNING', remaining: ['typecheck-domain'] },
      receipts,
      reusable: ['typecheck-full', 'typecheck-domain'],
    });
    const calls = [];
    const results = await runSealedPacketPlan(packetFixture([['node', 'focused-one']]), {
      root: process.cwd(), mode: 'resume', sessionApi: harness.api,
      signalBus: new EventEmitter(),
      runChild: async (argv) => {
        calls.push(argv);
        return childResult(argv);
      },
    });
    expect(calls[0]).toEqual(['node', 'scripts/implementation-packets.mjs', 'validate']);
    expect(calls).not.toContainEqual(['npm', 'run', 'typecheck:ratchet']);
    expect(calls).toHaveLength(3);
    expect(results.find(({ id }) => id === 'typecheck-full')).toMatchObject({
      status: 'PASSED', reused: true,
    });
    expect(harness.projections).toEqual([expect.objectContaining({
      currentFingerprint: 'exact', planDigest: 'plan', sealDigest: 'seal', receipts,
    })]);
    expect(harness.inspectionCount()).toBeGreaterThan(7);
  });

  it('fails closed if build and dist verification are separated or missing', () => {
    expect(() => diagnosticGroups(['lint', 'build'])).toThrow(/verify:dist after build/);
    expect(() => diagnosticGroups(['verify:dist', 'build'])).toThrow(/verify:dist after build/);
  });

  it('parses every CLI mode strictly before doing work', () => {
    expect(parseCliArgs(['packet', 'IA-1'])).toEqual({ mode: 'packet', id: 'IA-1' });
    expect(parseCliArgs(['resume', 'IA-1'])).toEqual({ mode: 'resume', id: 'IA-1' });
    expect(parseCliArgs(['quick'])).toEqual({ mode: 'quick', base: 'HEAD' });
    expect(parseCliArgs(['quick', '--base', 'origin/main'])).toEqual({
      mode: 'quick',
      base: 'origin/main',
    });
    expect(parseCliArgs(['diagnose'])).toEqual({ mode: 'diagnose' });

    for (const argv of [
      [],
      ['packet'],
      ['packet', 'IA-1', 'extra'],
      ['resume'],
      ['resume', 'IA-1', 'extra'],
      ['quick', '--base'],
      ['quick', '--base', '--not-a-ref'],
      ['quick', '--unknown', 'HEAD'],
      ['diagnose', 'extra'],
      ['unknown'],
    ]) {
      expect(() => parseCliArgs(argv), argv.join(' ')).toThrow(/usage|requires|accepts/);
    }
  });

  it('classifies raw, versioned, and already-held Vitest argv without substring guesses', () => {
    for (const argv of [
      ['vitest', 'run'],
      ['npx', 'vitest', 'run'],
      ['npx', '--yes', 'vitest@4.1.8', 'run'],
      ['/repo/node_modules/.bin/vitest', 'run'],
      ['node', '/repo/node_modules/vitest/vitest.mjs', 'run'],
      ['npm', 'exec', '--', 'vitest@4', 'run'],
    ]) {
      expect(classifyVitestCommand(argv), argv.join(' ')).toBe('raw');
    }

    expect(classifyVitestCommand([
      'sh', 'scripts/gate-mutex.sh', '--run', '--', 'npx', 'vitest@4.1.8', 'run',
    ])).toBe('already-held');
    expect(classifyVitestCommand([
      '/repo/scripts/gate-mutex.sh', '--run', '--', 'npx', 'vitest', 'run',
    ])).toBe('already-held');

    for (const argv of [
      ['npm', 'run', 'test:ratchet'],
      ['npm', 'run', 'test', '--', 'vitest'],
      ['node', 'scripts/check-test-ratchet.mjs'],
      ['node', 'scripts/tool.mjs', 'vitest'],
      ['npx', 'eslint', 'tests/vitest-contract.test.js'],
    ]) {
      expect(classifyVitestCommand(argv), argv.join(' ')).toBe('none');
    }
  });

  it('runs async argv with exact effective command, heartbeats, and spawn-result fidelity', async () => {
    expect(effectiveArgv(['npx', 'vitest', 'run', 'tests/focused.test.js'])).toEqual([
      'sh', 'scripts/gate-mutex.sh', '--run', '--',
      'npx', 'vitest', 'run', 'tests/focused.test.js',
    ]);
    let heartbeats = 0;
    const passed = await runArgvAsync(
      ['node', '-e', 'setTimeout(() => {}, 25)'],
      {
        cwd: process.cwd(),
        detached: false,
        heartbeatMs: 10,
        onHeartbeat: () => { heartbeats += 1; },
      },
    );
    expect(passed).toMatchObject({
      declaredArgv: ['node', '-e', 'setTimeout(() => {}, 25)'],
      effectiveArgv: ['node', '-e', 'setTimeout(() => {}, 25)'],
      exitCode: 0,
      signal: null,
      spawnError: null,
      orchestrationError: null,
    });
    expect(heartbeats).toBeGreaterThan(0);

    const missing = await runArgvAsync(['implementation-command-does-not-exist'], {
      cwd: process.cwd(),
      detached: false,
    });
    expect(missing.exitCode).not.toBe(0);
    expect(missing.spawnError).toMatchObject({ code: 'ENOENT' });
    expect(resultPassed(missing)).toBe(false);

    const signalHarness = sessionHarness(); const signalBus = new EventEmitter(); const forwarded = [];
    const interrupted = await runSealedPacketPlan(packetFixture(), {
      root: process.cwd(), sessionApi: signalHarness.api, signalBus,
      runChild: async (argv, { onSpawn }) => {
        onSpawn({ kill: (signal) => { forwarded.push(signal); return true; } });
        signalBus.emit('SIGTERM'); signalBus.emit('SIGTERM'); return childResult(argv);
      },
    });
    expect(forwarded).toEqual(['SIGTERM']);
    expect(interrupted.map(({ status }) => status)).toEqual(['INTERRUPTED', 'BLOCKED', 'BLOCKED']);
    expect(signalHarness.states.at(-1)).toMatchObject({ status: 'INTERRUPTED' });
  });

  it('makes an invalid packet manifest non-dispatchable before any declared argv runs', () => {
    const root = mkdtempSync(join(tmpdir(), 'implementation-gate-invalid-'));
    const marker = join(root, 'focused-command-ran');
    try {
      mkdirSync(join(root, 'docs/implementation'), { recursive: true });
      writeFileSync(join(root, 'docs/implementation/PACKET_MANIFEST.json'), JSON.stringify({
        schemaVersion: 1,
        indexPath: 'docs/implementation/INDEX.md',
        packets: [{
          id: 'X-1',
          status: 'READY',
          packetPath: 'docs/implementation/packets/X-1.md',
          verifiedBase: 'a'.repeat(40),
          changeManifest: [],
          requiredSymbols: [],
          acceptanceCases: [],
          checks: [[
            'node',
            '-e',
            `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran')`,
          ]],
        }],
      }));

      expect(() => runCli(['packet', 'X-1'], root)).toThrow(/invalid and non-dispatchable/);
      expect(existsSync(marker)).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
