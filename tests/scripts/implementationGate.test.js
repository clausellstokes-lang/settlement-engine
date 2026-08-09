import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  aggregateExit,
  checkStepsFromPackage,
  classifyVitestCommand,
  diagnosticGroups,
  logicBearingPaths,
  parseCliArgs,
  packetPlan,
  runCli,
  runPacketPlan,
} from '../../scripts/implementation-gate.mjs';

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

  it('fails closed if build and dist verification are separated or missing', () => {
    expect(() => diagnosticGroups(['lint', 'build'])).toThrow(/verify:dist after build/);
    expect(() => diagnosticGroups(['verify:dist', 'build'])).toThrow(/verify:dist after build/);
  });

  it('parses every CLI mode strictly before doing work', () => {
    expect(parseCliArgs(['packet', 'IA-1'])).toEqual({ mode: 'packet', id: 'IA-1' });
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
