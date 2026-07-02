/**
 * advanceWorkerClient.test.js — the main-thread transport for the off-thread advance.
 *
 * Two contracts:
 *  1. FALLBACK: with no `Worker` (Node/vitest/SSR) or a failed spawn, it runs the
 *     in-thread `fallback` unchanged — this is what keeps every headless sim test
 *     (golden master, conservation) running the pure function with no Worker.
 *  2. WORKER PROTOCOL: with a Worker, it relays per-tick progress (and re-dispatches
 *     the toolbar CustomEvent), resolves with the worker's result, and rejects on
 *     a worker error — matching the in-thread throw the caller already handles.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { runAdvanceInterval } from '../../src/lib/advanceWorkerClient.js';

const ORIG_WORKER = globalThis.Worker;
afterEach(() => {
  if (ORIG_WORKER === undefined) delete globalThis.Worker;
  else globalThis.Worker = ORIG_WORKER;
  vi.restoreAllMocks();
});

describe('runAdvanceInterval — fallback', () => {
  it('runs the in-thread fallback when Worker is undefined (Node/tests/SSR)', async () => {
    delete globalThis.Worker;
    const payload = { interval: 'one_year', now: 't' };
    const fallback = vi.fn((p) => ({ ok: true, echoed: p }));
    const result = await runAdvanceInterval(payload, { fallback });
    expect(fallback).toHaveBeenCalledOnce();
    expect(fallback).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ ok: true, echoed: payload });
  });

  it('falls back to in-thread when constructing the Worker throws', async () => {
    globalThis.Worker = class { constructor() { throw new Error('blocked'); } };
    const fallback = vi.fn(() => 'sync-result');
    const result = await runAdvanceInterval({ interval: 'one_month' }, { fallback });
    expect(result).toBe('sync-result');
    expect(fallback).toHaveBeenCalledOnce();
  });
});

describe('runAdvanceInterval — worker protocol', () => {
  // Minimal fake Worker: captures the posted message, lets the test drive
  // onmessage/onerror, and records terminate().
  function installFakeWorker() {
    const instances = [];
    globalThis.Worker = class {
      constructor(url, opts) { this.url = url; this.opts = opts; this.posted = []; this.terminated = false; instances.push(this); }
      postMessage(m) { this.posted.push(m); }
      terminate() { this.terminated = true; }
      emit(data) { this.onmessage?.({ data }); }
      emitError(err) { this.onerror?.({ error: err }); }
    };
    return instances;
  }

  it('relays progress, re-dispatches the toolbar event, resolves with the result, and terminates', async () => {
    const instances = installFakeWorker();
    // The re-dispatch is a browser concern; stub the DOM-event globals so the node
    // env can exercise it (Node may lack globalThis.dispatchEvent/CustomEvent).
    const dispatched = [];
    const hadDispatch = 'dispatchEvent' in globalThis;
    const hadCustomEvent = 'CustomEvent' in globalThis;
    globalThis.dispatchEvent = (e) => { dispatched.push(e); return true; };
    globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
    try {
      const onProgress = vi.fn();
      const fallback = vi.fn(() => { throw new Error('fallback must not run when a Worker exists'); });

      const p = runAdvanceInterval({ interval: 'one_year', now: 't' }, { fallback, customContent: { x: 1 }, onProgress });
      const w = instances[0];
      expect(w.posted[0]).toEqual({ payload: { interval: 'one_year', now: 't' }, customContent: { x: 1 } });

      w.emit({ type: 'progress', detail: { ticksDone: 1, ticksTotal: 48, interval: 'one_year' } });
      w.emit({ type: 'result', result: { composed: true, tick: 48 } });

      const result = await p;
      expect(result).toEqual({ composed: true, tick: 48 });
      expect(onProgress).toHaveBeenCalledWith({ ticksDone: 1, ticksTotal: 48, interval: 'one_year' });
      expect(dispatched.some(e => e.type === 'settlementforge:advance-progress')).toBe(true);
      expect(w.terminated).toBe(true);
      expect(fallback).not.toHaveBeenCalled();
    } finally {
      if (!hadDispatch) delete globalThis.dispatchEvent;
      if (!hadCustomEvent) delete globalThis.CustomEvent;
    }
  });

  it('rejects (and terminates) when the worker reports an error', async () => {
    const instances = installFakeWorker();
    const p = runAdvanceInterval({ interval: 'one_month' }, { fallback: () => 'nope' });
    const w = instances[0];
    w.emit({ type: 'error', message: 'kernel exploded', stack: 'x' });
    await expect(p).rejects.toThrow(/kernel exploded/);
    expect(w.terminated).toBe(true);
  });

  it('rejects on a worker onerror event', async () => {
    const instances = installFakeWorker();
    const p = runAdvanceInterval({ interval: 'one_month' }, { fallback: () => 'nope' });
    instances[0].emitError(new Error('worker crashed'));
    await expect(p).rejects.toThrow(/worker crashed/);
    expect(instances[0].terminated).toBe(true);
  });
});
