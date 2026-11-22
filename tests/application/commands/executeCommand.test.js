import { describe, expect, test, vi } from 'vitest';
import { makeCommandEnvelope } from '../../../src/application/commands/commandEnvelope.js';
import { createCommandRegistry } from '../../../src/application/commands/commandRegistry.js';
import {
  createCommandExecutor,
  createMemoryCommandJournal,
} from '../../../src/application/commands/executeCommand.js';

function command(params = { value: 1 }, extra = {}) {
  return makeCommandEnvelope({
    commandId: 'cmd:test:execute',
    kind: 'test.counter.apply',
    provenance: 'manual',
    ownerRef: { accountId: 'owner-1' },
    targets: { saveId: 'save-1' },
    expected: { revision: 'rev-1' },
    params,
    ...extra,
  });
}

function harness(apply, overrides = {}) {
  const registry = createCommandRegistry([{
    kind: 'test.counter.apply',
    description: 'Counter test.',
    targetScope: 'save',
    delivery: 'local',
    atomicity: 'single-target',
    validate: () => ({ ok: true }),
    preflight: () => ({ ok: true }),
    apply,
    ...overrides,
  }]);
  return createCommandExecutor({
    registry,
    journal: createMemoryCommandJournal(),
    clock: () => '2026-07-24T12:00:00.000Z',
  });
}

const context = (extra = {}) => ({
  ownerId: 'owner-1',
  saveId: 'save-1',
  revision: 'rev-1',
  ...extra,
});

describe('command executor replay and freshness', () => {
  test('concurrent and sequential replay execute the writer exactly once', async () => {
    let release;
    const wait = new Promise((resolve) => { release = resolve; });
    const apply = vi.fn(async () => {
      await wait;
      return { ok: true, status: 'applied', result: { count: 1 } };
    });
    const executor = harness(apply);

    const first = executor.execute(command(), context());
    const concurrent = executor.execute(command(), context());
    release();
    const [a, b] = await Promise.all([first, concurrent]);
    const later = await executor.execute(command(), context());

    expect(apply).toHaveBeenCalledTimes(1);
    expect(a.status).toBe('applied');
    expect(b).toMatchObject({ status: 'applied', replayed: true });
    expect(later).toMatchObject({ status: 'applied', replayed: true });
  });

  // ⭐ SPELLED OUT, NOT TABLE-DRIVEN. A `test.each` callback that takes parameters parks
  // the WHOLE FILE out of the estate's lighting census (the walker's TEST_CONTEXT_PARAM
  // rule), so this suite's stale-context refusals — the executor's freshness contract —
  // were invisible to every title-keyed instrument. The three rows are carried verbatim.
  // ⚠ NO TOTALITY GUARD IS AUTHORED HERE, AND THE OMISSION IS DELIBERATE: the three
  // reasons are the command context's own closed freshness triple (ownerId / saveId /
  // revision), not an open discovered roster, and a guard over a closed three-key literal
  // would be the self-referential-pin class (list == list). The real obligation — a
  // fourth freshness dimension owes a fourth spelled case — is docketed as
  // CR-EST-FRESHTRIPLE where it will be found, rather than faked with a vacuous assertion.
  test('refuses stale context: owner_changed', async () => {
    const apply = vi.fn();
    const receipt = await harness(apply).execute(command(), context({ ownerId: 'owner-2' }));
    expect(receipt).toMatchObject({ status: 'stale', reason: 'owner_changed' });
    expect(apply).not.toHaveBeenCalled();
  });

  test('refuses stale context: save_changed', async () => {
    const apply = vi.fn();
    const receipt = await harness(apply).execute(command(), context({ saveId: 'save-2' }));
    expect(receipt).toMatchObject({ status: 'stale', reason: 'save_changed' });
    expect(apply).not.toHaveBeenCalled();
  });

  test('refuses stale context: revision_changed', async () => {
    const apply = vi.fn();
    const receipt = await harness(apply).execute(command(), context({ revision: 'rev-2' }));
    expect(receipt).toMatchObject({ status: 'stale', reason: 'revision_changed' });
    expect(apply).not.toHaveBeenCalled();
  });

  test('same id with different behavior fails closed instead of replaying', async () => {
    const apply = vi.fn(() => ({ ok: true, status: 'applied' }));
    const executor = harness(apply);
    await executor.execute(command({ value: 1 }), context());
    const conflict = await executor.execute(command({ value: 2 }), context());
    expect(conflict).toMatchObject({
      status: 'failed',
      reason: 'command_id_conflict',
    });
    expect(apply).toHaveBeenCalledTimes(1);
  });

  test('an ambiguous writer throw becomes reconcile-required and never auto-retries', async () => {
    const apply = vi.fn(() => { throw new Error('network answer lost'); });
    const executor = harness(apply);
    const first = await executor.execute(command(), context());
    const replay = await executor.execute(command(), context());
    expect(first).toMatchObject({
      status: 'reconcile-required',
      reason: 'network answer lost',
      needsReconciliation: true,
    });
    expect(replay).toMatchObject({
      status: 'reconcile-required',
      replayed: true,
    });
    expect(apply).toHaveBeenCalledTimes(1);
  });

  test('partial outcomes remain explicit and carry the full lifecycle', async () => {
    const executor = harness(() => ({
      ok: false,
      status: 'partial',
      reason: 'one_target_failed',
      result: { applied: ['a'], failed: ['b'] },
    }));
    const receipt = await executor.execute(command(), context());
    expect(receipt).toMatchObject({
      status: 'partial',
      ok: false,
      reason: 'one_target_failed',
      result: { applied: ['a'], failed: ['b'] },
    });
    expect(receipt.transitions.map((entry) => entry.status)).toEqual([
      'received',
      'validating',
      'validated',
      'applying',
      'partial',
    ]);
  });
});

