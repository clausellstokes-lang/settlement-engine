/**
 * generationClient.test.js — the main-thread transport for off-thread generation.
 *
 * Four contracts, and the third is the one that earns the file:
 *  1. THE IN-THREAD PATHS. Flag off, no Worker (Node / vitest / SSR), or a
 *     factory that refuses: each runs the caller's in-thread core and REPORTS
 *     WHICH, so a green suite can never be mistaken for a green worker.
 *  2. THE WORKER PROTOCOL. A foreign requestId is ignored, a differing contract
 *     sentinel REJECTS (a retry would fetch the same stale script), a pipeline
 *     throw REJECTS (the in-thread path would throw identically), and a late
 *     packet after settling changes nothing.
 *  3. THE TRANSPORT-FAILURE TAXONOMY. onerror, onmessageerror and the per-step
 *     liveness watchdog are infrastructural, so they run in-thread ONCE. The
 *     watchdog re-arms on every step, so a long pipeline that keeps reporting
 *     never trips it, and a mid-run failure must not commit a DOUBLED history.
 *  4. CANCEL. An AbortSignal rejects with an AbortError and terminates.
 *
 * The Worker doubles are hand-written classes on `globalThis.Worker`, the
 * advanceWorkerClient.test.js idiom: a real Worker would need a bundler, and a
 * double that the test drives packet-by-packet is what makes the taxonomy
 * testable at all.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { runGeneration } from '../../src/lib/generationClient.js';
import {
  GENERATION_ERROR_KIND,
  GENERATION_PROTOCOL_VERSION,
  GENERATION_REQUEST_KIND,
  GENERATION_RESULT_KIND,
  GENERATION_STEP_KIND,
  GENERATION_STEP_WATCHDOG_MS,
  GENERATION_WORKER_CONTRACT,
} from '../../src/lib/generationProtocol.js';

const ORIG_WORKER = globalThis.Worker;
afterEach(() => {
  if (ORIG_WORKER === undefined) delete globalThis.Worker;
  else globalThis.Worker = ORIG_WORKER;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const requestFor = (requestId = 'gen-1') => ({
  kind: GENERATION_REQUEST_KIND,
  v: GENERATION_PROTOCOL_VERSION,
  op: 'settlement',
  requestId,
  payload: { fullConfig: { settType: 'town' }, seed: 'seed-a' },
});

/** A Worker double the test drives by hand. Records posts, exposes the handlers. */
function makeWorkerDouble() {
  const state = { posted: [], terminated: 0, instance: null };
  class WorkerDouble {
    constructor() {
      this.onmessage = null;
      this.onerror = null;
      this.onmessageerror = null;
      state.instance = this;
    }
    postMessage(data) { state.posted.push(data); }
    terminate() { state.terminated += 1; }
    emit(packet) { this.onmessage?.({ data: packet }); }
  }
  state.factory = () => new WorkerDouble();
  return state;
}

const stepPacket = (requestId, id, index) => ({
  kind: GENERATION_STEP_KIND,
  requestId,
  workerContract: GENERATION_WORKER_CONTRACT,
  step: { id, index, summary: `${id} done` },
});

const resultPacket = (requestId, result) => ({
  kind: GENERATION_RESULT_KIND,
  requestId,
  workerContract: GENERATION_WORKER_CONTRACT,
  result,
});

describe('runGeneration — the in-thread paths', () => {
  it('runs the fallback with outcome in-thread:flag-off when the flag is off, even where Worker exists', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const fallback = vi.fn(() => ({ settlement: { name: 'Fallowmere' } }));

    const { result, outcome } = await runGeneration(requestFor(), {
      flagOn: false, fallback, workerFactory: double.factory,
    });

    expect(outcome).toBe('in-thread:flag-off');
    expect(result).toEqual({ settlement: { name: 'Fallowmere' } });
    expect(fallback).toHaveBeenCalledOnce();
    expect(double.instance).toBe(null);
  });

  it('runs the fallback with outcome in-thread:no-worker when Worker is undefined (Node / vitest / SSR)', async () => {
    delete globalThis.Worker;
    const fallback = vi.fn(() => ({ settlement: { name: 'Grimhollow' } }));

    const { outcome } = await runGeneration(requestFor(), { flagOn: true, fallback });

    expect(outcome).toBe('in-thread:no-worker');
    expect(fallback).toHaveBeenCalledOnce();
  });

  it('runs the fallback with outcome in-thread:construct-failed when the worker factory throws', async () => {
    globalThis.Worker = class { };
    const fallback = vi.fn(() => ({ settlement: { name: 'Stonewater' } }));

    const { outcome } = await runGeneration(requestFor(), {
      flagOn: true,
      fallback,
      workerFactory: () => { throw new Error('blocked by CSP'); },
    });

    expect(outcome).toBe('in-thread:construct-failed');
    expect(fallback).toHaveBeenCalledOnce();
  });

  it('forwards every step the fallback emits to onStep, in order', async () => {
    delete globalThis.Worker;
    const seen = [];
    const fallback = (_request, onStep) => {
      onStep({ id: 'terrain', index: 0, summary: 'hills' });
      onStep({ id: 'people', index: 1, summary: '11 souls' });
      return { settlement: {}, pipelineHistory: [{ id: 'terrain' }, { id: 'people' }] };
    };

    const { outcome } = await runGeneration(requestFor(), {
      flagOn: true, fallback, onStep: (step) => seen.push(step.id),
    });

    expect(outcome).toBe('in-thread:no-worker');
    expect(seen).toEqual(['terrain', 'people']);
  });
});

describe('runGeneration — the worker protocol', () => {
  it('resolves with the worker result and outcome worker, relaying each step event to onStep in order', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const seen = [];
    const fallback = vi.fn();

    const pending = runGeneration(requestFor('gen-7'), {
      flagOn: true, fallback, workerFactory: double.factory, onStep: (s) => seen.push(s.id),
    });
    double.instance.emit(stepPacket('gen-7', 'terrain', 0));
    double.instance.emit(stepPacket('gen-7', 'people', 1));
    double.instance.emit(resultPacket('gen-7', { settlement: { name: 'Ashenford' } }));

    const { result, outcome } = await pending;
    expect(outcome).toBe('worker');
    expect(result).toEqual({ settlement: { name: 'Ashenford' } });
    expect(seen).toEqual(['terrain', 'people']);
    expect(fallback).toHaveBeenCalledTimes(0);
    expect(double.posted).toEqual([requestFor('gen-7')]);
  });

  it('ignores a packet whose requestId is not this request\'s', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const seen = [];

    const pending = runGeneration(requestFor('gen-8'), {
      flagOn: true, fallback: vi.fn(), workerFactory: double.factory, onStep: (s) => seen.push(s.id),
    });
    double.instance.emit(stepPacket('gen-OTHER', 'foreign', 0));
    double.instance.emit(resultPacket('gen-OTHER', { settlement: { name: 'Wrong' } }));
    double.instance.emit(resultPacket('gen-8', { settlement: { name: 'Right' } }));

    const { result } = await pending;
    expect(result).toEqual({ settlement: { name: 'Right' } });
    expect(seen).toEqual([]);
  });

  it('rejects with code protocol_mismatch when the worker contract sentinel differs, and does not fall back', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const fallback = vi.fn();

    const pending = runGeneration(requestFor('gen-9'), {
      flagOn: true, fallback, workerFactory: double.factory,
    });
    double.instance.emit({
      kind: GENERATION_RESULT_KIND,
      requestId: 'gen-9',
      workerContract: 'settlementforge:generation:worker-v0-stale',
      result: { settlement: {} },
    });

    await expect(pending).rejects.toMatchObject({ code: 'protocol_mismatch' });
    expect(fallback).toHaveBeenCalledTimes(0);
    expect(double.terminated).toBe(1);
  });

  it('rejects with code pipeline_threw on a generation.error packet, and does not fall back', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const fallback = vi.fn();

    const pending = runGeneration(requestFor('gen-10'), {
      flagOn: true, fallback, workerFactory: double.factory,
    });
    double.instance.emit(stepPacket('gen-10', 'terrain', 0));
    double.instance.emit({
      kind: GENERATION_ERROR_KIND,
      requestId: 'gen-10',
      workerContract: GENERATION_WORKER_CONTRACT,
      code: 'pipeline_threw',
      stepId: 'people',
      message: 'the roster step threw',
      stack: 'Error: the roster step threw',
    });

    await expect(pending).rejects.toMatchObject({
      code: 'pipeline_threw',
      stepId: 'people',
      message: 'the roster step threw',
    });
    expect(fallback).toHaveBeenCalledTimes(0);
  });

  it('ignores a late packet after the request has settled', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;

    const pending = runGeneration(requestFor('gen-11'), {
      flagOn: true, fallback: vi.fn(), workerFactory: double.factory,
    });
    double.instance.emit(resultPacket('gen-11', { settlement: { name: 'First' } }));
    const { result } = await pending;

    // A worker that posts after we committed to an answer must not be able to
    // change it, and must not throw either.
    double.instance.emit(resultPacket('gen-11', { settlement: { name: 'Second' } }));
    expect(result).toEqual({ settlement: { name: 'First' } });
    expect(double.terminated).toBe(1);
  });
});

describe('runGeneration — the transport-failure taxonomy', () => {
  it('falls back to the in-thread path exactly once on worker.onerror, with outcome in-thread:transport-failed', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const fallback = vi.fn(() => ({ settlement: { name: 'Recovered' } }));

    const pending = runGeneration(requestFor('gen-12'), {
      flagOn: true, fallback, workerFactory: double.factory,
    });
    double.instance.onerror(new Error('module failed to load'));
    double.instance.onerror(new Error('and again'));

    const { result, outcome } = await pending;
    expect(outcome).toBe('in-thread:transport-failed');
    expect(result).toEqual({ settlement: { name: 'Recovered' } });
    expect(fallback).toHaveBeenCalledTimes(1);
  });

  it('falls back exactly once on worker.onmessageerror', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const fallback = vi.fn(() => ({ settlement: { name: 'Recovered' } }));

    const pending = runGeneration(requestFor('gen-13'), {
      flagOn: true, fallback, workerFactory: double.factory,
    });
    double.instance.onmessageerror({ type: 'messageerror' });
    double.instance.onmessageerror({ type: 'messageerror' });

    const { outcome } = await pending;
    expect(outcome).toBe('in-thread:transport-failed');
    expect(fallback).toHaveBeenCalledTimes(1);
  });

  it('falls back exactly once when no step arrives within the liveness watchdog (fake timers)', async () => {
    vi.useFakeTimers();
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const fallback = vi.fn(() => ({ settlement: { name: 'Unwedged' } }));

    const pending = runGeneration(requestFor('gen-14'), {
      flagOn: true, fallback, workerFactory: double.factory,
    });
    vi.advanceTimersByTime(GENERATION_STEP_WATCHDOG_MS + 1);

    const { outcome } = await pending;
    expect(outcome).toBe('in-thread:transport-failed');
    expect(fallback).toHaveBeenCalledTimes(1);
  });

  it('re-arms the watchdog on every step event so a long pipeline with live steps never trips it', async () => {
    vi.useFakeTimers();
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const fallback = vi.fn();

    const pending = runGeneration(requestFor('gen-15'), {
      flagOn: true, fallback, workerFactory: double.factory,
    });
    // Fourteen steps, each landing just inside the window. Total elapsed time is
    // far past a total-run deadline, which is exactly the point: this is a
    // liveness watchdog, not a deadline.
    for (let i = 0; i < 14; i += 1) {
      vi.advanceTimersByTime(GENERATION_STEP_WATCHDOG_MS - 1);
      double.instance.emit(stepPacket('gen-15', `step-${i}`, i));
    }
    double.instance.emit(resultPacket('gen-15', { settlement: { name: 'Longhaul' } }));

    const { outcome } = await pending;
    expect(outcome).toBe('worker');
    expect(fallback).toHaveBeenCalledTimes(0);
  });

  it('terminates the worker on every settle path', async () => {
    globalThis.Worker = class { };

    const resolved = makeWorkerDouble();
    const okPending = runGeneration(requestFor('gen-16'), {
      flagOn: true, fallback: vi.fn(), workerFactory: resolved.factory,
    });
    resolved.instance.emit(resultPacket('gen-16', { settlement: {} }));
    await okPending;

    const errored = makeWorkerDouble();
    const errPending = runGeneration(requestFor('gen-17'), {
      flagOn: true, fallback: vi.fn(), workerFactory: errored.factory,
    });
    errored.instance.emit({
      kind: GENERATION_ERROR_KIND,
      requestId: 'gen-17',
      workerContract: GENERATION_WORKER_CONTRACT,
      code: 'pipeline_threw',
      message: 'threw',
    });
    await errPending.catch(() => {});

    const failed = makeWorkerDouble();
    const transportPending = runGeneration(requestFor('gen-18'), {
      flagOn: true, fallback: () => ({ settlement: {} }), workerFactory: failed.factory,
    });
    failed.instance.onerror(new Error('boom'));
    await transportPending;

    expect([resolved.terminated, errored.terminated, failed.terminated]).toEqual([1, 1, 1]);
  });

  it('a transport failure after N steps yields exactly one pipelineHistory of the full length: relayed rows are discarded, the result packet\'s list wins', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const fullHistory = Array.from({ length: 14 }, (_unused, i) => ({ id: `step-${i}`, summary: null }));
    const relayed = [];
    // The in-thread re-run emits ALL fourteen steps again, so a caller that
    // pushed one row per relayed step would commit twenty-one. The authoritative
    // list is the one the core returns.
    const fallback = (_request, onStep) => {
      fullHistory.forEach((row, index) => onStep({ id: row.id, index, summary: null }));
      return { settlement: {}, pipelineHistory: fullHistory };
    };

    const pending = runGeneration(requestFor('gen-19'), {
      flagOn: true, fallback, workerFactory: double.factory, onStep: (s) => relayed.push(s.id),
    });
    for (let i = 0; i < 7; i += 1) double.instance.emit(stepPacket('gen-19', `step-${i}`, i));
    double.instance.onerror(new Error('wedged after seven'));

    const { result, outcome } = await pending;
    expect(outcome).toBe('in-thread:transport-failed');
    expect(relayed.length).toBe(21);
    expect(result.pipelineHistory.length).toBe(14);
  });
});

describe('runGeneration — cancel', () => {
  it('rejects with an AbortError and terminates the worker when the signal fires mid-run', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const controller = new AbortController();
    const fallback = vi.fn();

    const pending = runGeneration(requestFor('gen-20'), {
      flagOn: true, fallback, workerFactory: double.factory, signal: controller.signal,
    });
    double.instance.emit(stepPacket('gen-20', 'terrain', 0));
    controller.abort();

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    expect(double.terminated).toBe(1);
    expect(fallback).toHaveBeenCalledTimes(0);
  });

  it('rejects immediately with an AbortError when the signal is already aborted, constructing no worker', async () => {
    const double = makeWorkerDouble();
    globalThis.Worker = double.factory;
    const controller = new AbortController();
    controller.abort();
    const fallback = vi.fn();

    await expect(runGeneration(requestFor('gen-21'), {
      flagOn: true, fallback, workerFactory: double.factory, signal: controller.signal,
    })).rejects.toMatchObject({ name: 'AbortError' });

    expect(double.instance).toBe(null);
    expect(fallback).toHaveBeenCalledTimes(0);
  });
});
