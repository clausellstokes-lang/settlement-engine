/**
 * tests/lib/savesTimeout.test.js — hang guard on saves.js update/delete/count/reactivate legs.
 *
 * Locks (the saves.js sibling of campaignsTimeout.test.js):
 *   • supabaseUpdate, supabaseDelete, supabaseCount, and
 *     supabaseReactivateFreeSettlement are withTimeout-guarded like the
 *     list/save/mutateBatch legs in the same file, so a stalled call REJECTS
 *     with a TimeoutError instead of pending forever. Unguarded, a hang wedged
 *     the caller's in-flight state (edit spinner / delete confirm / save-limit
 *     check / reactivate) with no recovery short of a page refresh.
 *   • The guard rejects (never resolves), so a timed-out write is never
 *     mistaken for a successful one.
 *   • Legs that settle normally still resolve (the wrapper changes the failure
 *     mode only, not the happy path), and a settled error still throws.
 *   • update() with an empty patch stays a network-free no-op.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/** A supabase query-builder stand-in: every chain method returns the builder,
 *  and awaiting it never settles (a stalled network leg). */
function hangingBuilder() {
  const builder = {};
  for (const method of ['select', 'order', 'upsert', 'insert', 'update', 'delete', 'eq', 'single']) {
    builder[method] = () => builder;
  }
  builder.then = () => {}; // thenable that never calls its callbacks
  return builder;
}

/** Same chain shape, but awaiting it settles with `result`. */
function resolvingBuilder(result) {
  const builder = {};
  for (const method of ['select', 'order', 'upsert', 'insert', 'update', 'delete', 'eq', 'single']) {
    builder[method] = () => builder;
  }
  builder.then = (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected);
  return builder;
}

async function loadSaves(supabaseMock) {
  vi.resetModules();
  vi.doMock('../../src/lib/supabase.js', async (importOriginal) => {
    const actual = await importOriginal(); // real withTimeout + TimeoutError
    return { ...actual, isConfigured: true, supabase: supabaseMock };
  });
  const { saves } = await import('../../src/lib/saves.js');
  return saves;
}

/** Kick off `run`, advance fake time past every timeout, assert TimeoutError. */
async function expectTimeout(run, ms) {
  const promise = run();
  const assertion = expect(promise).rejects.toMatchObject({ name: 'TimeoutError', isTimeout: true });
  await vi.advanceTimersByTimeAsync(ms);
  await assertion;
}

describe('saves.js update/delete legs reject on a stalled call instead of hanging', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('update() times out when the row update never settles', async () => {
    const saves = await loadSaves({ from: () => hangingBuilder() });
    await expectTimeout(() => saves.update('s1', { name: 'Renamed' }), 20000);
  });

  it('delete() times out when the row delete never settles', async () => {
    const saves = await loadSaves({ from: () => hangingBuilder() });
    await expectTimeout(() => saves.delete('s1'), 20000);
  });

  it('update() still resolves normally when the query settles in time', async () => {
    const saves = await loadSaves({ from: () => resolvingBuilder({ error: null }) });
    await expect(saves.update('s1', { name: 'Renamed' })).resolves.toBeUndefined();
  });

  it('delete() still resolves normally when the query settles in time', async () => {
    const saves = await loadSaves({ from: () => resolvingBuilder({ error: null }) });
    await expect(saves.delete('s1')).resolves.toBeUndefined();
  });

  it('update() still throws a settled supabase error (guard does not swallow it)', async () => {
    const err = { message: 'row not found' };
    const saves = await loadSaves({ from: () => resolvingBuilder({ error: err }) });
    await expect(saves.update('s1', { name: 'Renamed' })).rejects.toBe(err);
  });

  it('update() with an empty patch is a network-free no-op (never touches supabase)', async () => {
    const from = vi.fn(() => hangingBuilder());
    const saves = await loadSaves({ from });
    await expect(saves.update('s1', {})).resolves.toBeUndefined();
    expect(from).not.toHaveBeenCalled();
  });

  it('count() times out when the count query never settles', async () => {
    const saves = await loadSaves({ from: () => hangingBuilder() });
    await expectTimeout(() => saves.count(), 20000);
  });

  it('count() still resolves the count when the query settles in time', async () => {
    const saves = await loadSaves({ from: () => resolvingBuilder({ count: 7, error: null }) });
    await expect(saves.count()).resolves.toBe(7);
  });

  it('reactivateFreeSettlement() times out when the RPC never settles', async () => {
    const saves = await loadSaves({ rpc: () => hangingBuilder() });
    await expectTimeout(() => saves.reactivateFreeSettlement('s1'), 20000);
  });

  it('reactivateFreeSettlement() still resolves the RPC result when it settles in time', async () => {
    const result = { ok: true };
    const saves = await loadSaves({ rpc: () => resolvingBuilder({ data: result, error: null }) });
    await expect(saves.reactivateFreeSettlement('s1')).resolves.toBe(result);
  });
});
