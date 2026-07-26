/**
 * Account ownership pins for the durable persistence outbox.
 *
 * A browser can host several accounts over its lifetime. Pending writes must
 * remain with the account that created them, never replay while auth is
 * unresolved/signed out, and survive an initialization race in which an enqueue
 * lands before the session check completes.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  activateOutboxOwner,
  attemptOps,
  drainReady,
  enqueue,
  loadMirror,
  peekOps,
  peekPayloads,
  resetOutbox,
  setOutboxScheduler,
} from '../../src/store/outbox.js';

const ownerKey = ownerId => `sf_outbox_v2:${encodeURIComponent(ownerId)}`;
const payloadKey = ownerId => `sf_outbox_payloads_v2:${encodeURIComponent(ownerId)}`;

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => (data.has(String(key)) ? data.get(String(key)) : null),
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
  return data;
}

function seedOwnerMirror(ownerId, saveId, payload = { source: ownerId }) {
  const key = `${saveId}:data`;
  localStorage.setItem(ownerKey(ownerId), JSON.stringify({
    version: 2,
    ownerId,
    ops: [{
      id: `${saveId}::data::0`,
      saveId,
      kind: 'data',
      payloadKey: key,
      payloadFingerprint: null,
      attempts: 0,
      status: 'queued',
      enqueuedAt: 1,
      nextAttemptAt: 0,
      differential: false,
      ownerId,
      ownerPending: false,
    }],
  }));
  localStorage.setItem(payloadKey(ownerId), JSON.stringify({
    version: 2,
    ownerId,
    payloads: { [key]: payload },
  }));
}

beforeEach(() => {
  installLocalStorage();
  setOutboxScheduler(null);
  resetOutbox();
});

afterEach(() => {
  resetOutbox();
  delete globalThis.localStorage;
});

describe('owner-scoped outbox lifecycle', () => {
  test('does not load or replay a durable mirror before its authenticated owner is known', async () => {
    seedOwnerMirror('owner-a', 'a-save');
    const runner = vi.fn(async () => true);

    expect(loadMirror()).toBe(0);
    expect(peekOps()).toEqual([]);
    await drainReady(runner);
    expect(runner).not.toHaveBeenCalled();

    activateOutboxOwner(null);
    await drainReady(runner);
    expect(runner).not.toHaveBeenCalled();

    activateOutboxOwner('owner-a');
    await drainReady(runner);
    expect(runner).toHaveBeenCalledTimes(1);
    expect(runner.mock.calls[0][1]).toEqual({ source: 'owner-a' });
  });

  test('keeps account mirrors isolated across sign-out and account switches', () => {
    activateOutboxOwner('owner-a');
    enqueue({
      saveId: 'a-save',
      kind: 'data',
      payload: { source: 'owner-a' },
      fingerprint: null,
    });

    activateOutboxOwner(null);
    expect(peekOps()).toEqual([]);
    activateOutboxOwner('owner-b');
    expect(peekOps()).toEqual([]);
    enqueue({
      saveId: 'b-save',
      kind: 'data',
      payload: { source: 'owner-b' },
      fingerprint: null,
    });

    expect(localStorage.getItem(ownerKey('owner-a'))).not.toBeNull();
    expect(localStorage.getItem(ownerKey('owner-b'))).not.toBeNull();
    expect(peekOps().map(op => op.saveId)).toEqual(['b-save']);

    activateOutboxOwner('owner-a');
    expect(peekOps().map(op => op.saveId)).toEqual(['a-save']);
    expect(peekPayloads()['a-save:data']).toEqual({ source: 'owner-a' });
    expect(peekPayloads()['b-save:data']).toBeUndefined();
  });

  test('an account switch cannot drain the previous owner payload', async () => {
    activateOutboxOwner('owner-a');
    enqueue({
      saveId: 'shared-save-id',
      kind: 'data',
      payload: { source: 'owner-a' },
      fingerprint: null,
    });
    activateOutboxOwner('owner-b');

    const runner = vi.fn(async () => true);
    await drainReady(runner);
    expect(runner).not.toHaveBeenCalled();

    enqueue({
      saveId: 'shared-save-id',
      kind: 'data',
      payload: { source: 'owner-b' },
      fingerprint: null,
    });
    await drainReady(runner);
    expect(runner).toHaveBeenCalledTimes(1);
    expect(runner.mock.calls[0][1]).toEqual({ source: 'owner-b' });

    activateOutboxOwner('owner-a');
    await drainReady(runner);
    expect(runner).toHaveBeenCalledTimes(2);
    expect(runner.mock.calls[1][1]).toEqual({ source: 'owner-a' });
  });

  test('scheduled retries from a detached owner are inert', async () => {
    const scheduled = [];
    setOutboxScheduler(fn => scheduled.push(fn));
    activateOutboxOwner('owner-a');
    const op = enqueue({
      saveId: 'a-save',
      kind: 'data',
      payload: { source: 'owner-a' },
      fingerprint: null,
    });
    const runner = vi.fn(async () => false);
    await attemptOps([op], runner);
    expect(runner).toHaveBeenCalledTimes(1);
    expect(scheduled).toHaveLength(1);

    activateOutboxOwner('owner-b');
    scheduled[0]();
    await Promise.resolve();
    await Promise.resolve();

    expect(runner).toHaveBeenCalledTimes(1);
    expect(peekOps()).toEqual([]);
  });

  test('a queued backoff becomes ready after detach and reattach instead of losing its timer', async () => {
    setOutboxScheduler(() => {});
    activateOutboxOwner('owner-a');
    const op = enqueue({
      saveId: 'a-save',
      kind: 'data',
      payload: { source: 'owner-a' },
      fingerprint: null,
    });
    await attemptOps([op], async () => false);
    expect(peekOps()[0]).toMatchObject({ status: 'queued' });
    expect(peekOps()[0].nextAttemptAt).toBeGreaterThan(0);

    activateOutboxOwner('owner-b');
    activateOutboxOwner('owner-a');

    const runner = vi.fn(async () => true);
    await drainReady(runner);
    expect(runner).toHaveBeenCalledTimes(1);
    expect(peekOps()).toEqual([]);
  });

  test('an old-owner inflight result cannot prune a new owner payload with the same key', async () => {
    activateOutboxOwner('owner-a');
    const oldOp = enqueue({
      saveId: 'shared-save-id',
      kind: 'data',
      payload: { source: 'owner-a' },
      fingerprint: null,
    });
    let settleOld;
    const oldPending = attemptOps([oldOp], () => new Promise(resolve => {
      settleOld = resolve;
    }));
    await Promise.resolve();

    activateOutboxOwner('owner-b');
    enqueue({
      saveId: 'shared-save-id',
      kind: 'data',
      payload: { source: 'owner-b' },
      fingerprint: null,
    });
    settleOld(true);
    const oldResult = await oldPending;

    expect(oldResult[0]).toMatchObject({ ok: false, ownerMismatch: true });
    expect(peekPayloads()['shared-save-id:data']).toEqual({ source: 'owner-b' });
    const runner = vi.fn(async () => true);
    await drainReady(runner);
    expect(runner.mock.calls[0][1]).toEqual({ source: 'owner-b' });
  });

  test('reattaching an owner keeps its original same-key request ahead of newer writes', async () => {
    activateOutboxOwner('owner-a');
    const first = enqueue({
      saveId: 'shared-save-id',
      kind: 'data',
      payload: { revision: 1 },
      fingerprint: null,
    });
    const landed = [];
    let settleFirst;
    const firstAttempt = attemptOps([first], async (_op, payload) => {
      await new Promise(resolve => {
        settleFirst = resolve;
      });
      landed.push(payload.revision);
      return true;
    });
    await Promise.resolve();

    activateOutboxOwner('owner-b');
    activateOutboxOwner('owner-a');
    const second = enqueue({
      saveId: 'shared-save-id',
      kind: 'data',
      payload: { revision: 2 },
      fingerprint: null,
    });
    const secondAttempt = attemptOps([second], async (_op, payload) => {
      landed.push(payload.revision);
      return true;
    });

    await Promise.resolve();
    expect(landed).toEqual([]);
    settleFirst();
    await Promise.all([firstAttempt, secondAttempt]);

    expect(landed).toEqual([1, 2]);
    expect(peekOps()).toEqual([]);
  });

  test('initial owner activation merges durable work without dropping a same-session enqueue', async () => {
    seedOwnerMirror('owner-a', 'disk-save', { source: 'disk' });
    enqueue({
      saveId: 'session-save',
      kind: 'data',
      payload: { source: 'session' },
      fingerprint: null,
    });

    activateOutboxOwner('owner-a');
    expect(peekOps().map(op => op.saveId).sort()).toEqual(['disk-save', 'session-save']);
    expect(peekPayloads()['session-save:data']).toEqual({ source: 'session' });

    const seen = [];
    await drainReady(async (_op, payload) => {
      seen.push(payload.source);
      return true;
    });
    expect(seen.sort()).toEqual(['disk', 'session']);
  });

  test('fails closed by scrubbing legacy unscoped mirrors instead of assigning them to a user', () => {
    localStorage.setItem('sf_outbox_v1', JSON.stringify({ version: 1, ops: [{ saveId: 'legacy' }] }));
    localStorage.setItem('sf_outbox_payloads_v1', JSON.stringify({ version: 1, payloads: { legacy: {} } }));

    activateOutboxOwner('owner-a');

    expect(peekOps()).toEqual([]);
    expect(localStorage.getItem('sf_outbox_v1')).toBeNull();
    expect(localStorage.getItem('sf_outbox_payloads_v1')).toBeNull();
  });
});
