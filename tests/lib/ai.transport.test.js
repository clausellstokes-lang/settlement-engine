/**
 * tests/lib/ai.transport.test.js — generateNarrative NDJSON transport.
 *
 * Covers the failure-handling half of the paid-AI feature at the wire level:
 *
 *   F18 — the stream is abortable. An AbortSignal is passed to fetch, an
 *         external cancel tears the stream down, and an idle watchdog aborts a
 *         stalled stream (so `await reader.read()` can't hang forever). Both
 *         aborts surface as name === 'AbortError' so the slice classifies them
 *         as 'aborted'.
 *
 *   F1  — a `{ refund: 'failed', spend_id, reason, supportNote }` line is
 *         delivered to onRefundFailure rather than silently dropped.
 *
 *   plus the existing truncation guard (a stream with no `done` marker throws).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// isConfigured must be true so generateNarrative takes the real fetch path
// (not the local-dev mock). A stub token source satisfies getAccessTokenSafe.
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: { getSession: vi.fn(async () => ({ data: { session: { access_token: 'test-token' } } })) },
  },
}));

import { generateNarrative } from '../../src/lib/ai.js';

const SETTLEMENT = { id: 's1', name: 'Testburg' };

/** A reader that yields the given string chunks, then done. */
function chunksReader(chunks) {
  let i = 0;
  const enc = new TextEncoder();
  return {
    read: async () =>
      i < chunks.length
        ? { done: false, value: enc.encode(chunks[i++]) }
        : { done: true, value: undefined },
    cancel: () => {},
  };
}

/** A reader that never resolves until the fetch's signal aborts, then rejects
 *  with an AbortError — exactly how a real fetch body behaves on abort. */
function stalledReader(signal) {
  return {
    read: () =>
      new Promise((_resolve, reject) => {
        const fail = () => {
          const e = new Error('The operation was aborted.');
          e.name = 'AbortError';
          reject(e);
        };
        if (signal.aborted) return fail();
        signal.addEventListener('abort', fail, { once: true });
      }),
    cancel: () => {},
  };
}

function mockFetchYielding(chunks) {
  return vi.fn(async (_url, opts) => ({
    ok: true,
    body: { getReader: () => chunksReader(chunks) },
    text: async () => '',
    _opts: opts,
  }));
}

beforeEach(() => { vi.clearAllMocks(); });
afterEach(() => { delete global.fetch; });

describe('generateNarrative transport — abort / watchdog (F18)', () => {
  it('passes an AbortSignal to fetch', async () => {
    global.fetch = mockFetchYielding(['{"done":true,"result":{"ok":1}}\n']);
    await generateNarrative('narrative', SETTLEMENT, 's1', {});
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const opts = global.fetch.mock.calls[0][1];
    expect(opts.signal).toBeDefined();
    expect(typeof opts.signal.aborted).toBe('boolean');
  });

  it('idle watchdog aborts a stalled stream with a classified AbortError', async () => {
    global.fetch = vi.fn(async (_url, opts) => ({
      ok: true,
      body: { getReader: () => stalledReader(opts.signal) },
    }));

    const err = await generateNarrative('narrative', SETTLEMENT, 's1', { idleTimeoutMs: 30 })
      .then(() => null, (e) => e);

    expect(err).toBeTruthy();
    expect(err.name).toBe('AbortError'); // → errorKindFromError classifies 'aborted'
    expect(err.message).toMatch(/stalled/i);
  });

  it('an external cancel signal tears the stream down (AbortError, "cancelled")', async () => {
    global.fetch = vi.fn(async (_url, opts) => ({
      ok: true,
      body: { getReader: () => stalledReader(opts.signal) },
    }));

    const external = new AbortController();
    // Cancel shortly after the read starts; idle watchdog (default 60s) won't fire.
    setTimeout(() => external.abort(), 15);

    const err = await generateNarrative('narrative', SETTLEMENT, 's1', { signal: external.signal })
      .then(() => null, (e) => e);

    expect(err).toBeTruthy();
    expect(err.name).toBe('AbortError');
    expect(err.message).toMatch(/cancel/i);
  });

  it('an already-aborted external signal aborts immediately', async () => {
    global.fetch = vi.fn(async (_url, opts) => ({
      ok: true,
      body: { getReader: () => stalledReader(opts.signal) },
    }));
    const external = new AbortController();
    external.abort();

    const err = await generateNarrative('narrative', SETTLEMENT, 's1', { signal: external.signal })
      .then(() => null, (e) => e);

    expect(err).toBeTruthy();
    expect(err.name).toBe('AbortError');
  });
});

describe('generateNarrative transport — refund-failure notice (F1)', () => {
  it('delivers a refund-failed message to onRefundFailure instead of dropping it', async () => {
    global.fetch = mockFetchYielding([
      '{"refund":"failed","spend_id":"sp_123","reason":"rpc_unavailable","supportNote":"Reference sp_123 to support"}\n',
      '{"done":true,"result":{"thesis":"done"}}\n',
    ]);

    const onRefundFailure = vi.fn();
    const out = await generateNarrative('narrative', SETTLEMENT, 's1', { onRefundFailure });

    expect(onRefundFailure).toHaveBeenCalledTimes(1);
    expect(onRefundFailure.mock.calls[0][0]).toEqual({
      status: 'failed',
      spendId: 'sp_123',
      reason: 'rpc_unavailable',
      supportNote: 'Reference sp_123 to support',
    });
    // The stream still completes normally around the refund notice.
    expect(out.result).toEqual({ thesis: 'done' });
  });

  it('tolerates a refund message with missing optional fields', async () => {
    global.fetch = mockFetchYielding([
      '{"refund":"failed"}\n',
      '{"done":true,"result":{}}\n',
    ]);
    const onRefundFailure = vi.fn();
    await generateNarrative('narrative', SETTLEMENT, 's1', { onRefundFailure });
    expect(onRefundFailure).toHaveBeenCalledWith({
      status: 'failed', spendId: null, reason: null, supportNote: null,
    });
  });
});

describe('generateNarrative transport — completion / truncation', () => {
  it('returns the authoritative result and dispatches field callbacks', async () => {
    global.fetch = mockFetchYielding([
      '{"field":"thesis","value":"A town."}\n',
      '{"done":true,"result":{"thesis":"A town.","x":1},"creditsRemaining":4}\n',
    ]);
    const onField = vi.fn();
    const out = await generateNarrative('narrative', SETTLEMENT, 's1', { onField });
    expect(onField).toHaveBeenCalledWith('thesis', 'A town.');
    expect(out.result).toEqual({ thesis: 'A town.', x: 1 });
    expect(out.creditsRemaining).toBe(4);
  });

  it('throws when the stream ends without a done marker (truncated)', async () => {
    global.fetch = mockFetchYielding(['{"field":"thesis","value":"partial"}\n']);
    const err = await generateNarrative('narrative', SETTLEMENT, 's1', {})
      .then(() => null, (e) => e);
    expect(err).toBeTruthy();
    expect(err.message).toMatch(/completion marker|truncat/i);
  });
});
