/**
 * aiStreamCompletionGuards.test.js
 *
 * Two completion-path guards on generateNarrative (src/lib/ai.js):
 *
 *   (2) a 2xx response with a null body throws an unmapped TypeError off
 *       `res.body.getReader()` and LEAKS both watchdog timers (the null-body
 *       check sits outside the try/catch that runs clearWatchdogs). The fix
 *       guards the null body, clears the watchdogs, and surfaces a retryable
 *       error.
 *
 *   (3) a `done` line whose `result` is missing or non-object used to mark the
 *       run complete and return an empty {} — silently persisting a blank over
 *       what should have been a real narrative (and charging a credit). The fix
 *       treats it as a fatal, retryable failure.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: { access_token: 'tok' } } })),
    },
  },
}));

import { generateNarrative } from '../../src/lib/ai.js';

const settlement = { id: 's1', name: 'Ashford', institutions: [] };

function ndjsonResponse(lines) {
  const encoder = new TextEncoder();
  const body = lines.map((l) => JSON.stringify(l)).join('\n') + '\n';
  const stream = new ReadableStream({
    start(controller) { controller.enqueue(encoder.encode(body)); controller.close(); },
  });
  return { ok: true, status: 200, text: async () => '', body: stream };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  vi.useRealTimers();
});

// ── (2) null body on a 2xx leaks watchdogs ──────────────────────────────────

describe('generateNarrative — 2xx with a null body', () => {
  test('rejects with a retryable error and does NOT leak the watchdog timers', async () => {
    vi.useFakeTimers();
    // Track only the two watchdog timers by their known durations (idle 45s,
    // overall 180s) so we ignore the unrelated 2s auth-race timer.
    const WATCHDOG_MS = new Set([45000, 180000]);
    const live = new Set();
    const realSet = global.setTimeout;
    const realClear = global.clearTimeout;
    vi.stubGlobal('setTimeout', (fn, ms, ...rest) => {
      const id = realSet(fn, ms, ...rest);
      if (WATCHDOG_MS.has(ms)) live.add(id);
      return id;
    });
    vi.stubGlobal('clearTimeout', (id) => { live.delete(id); return realClear(id); });

    // 2xx but body is null (e.g. a proxy stripped the stream).
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, status: 200, body: null, text: async () => '' })));

    const p = generateNarrative('narrative', settlement, 's1', {});
    const assertion = expect(p).rejects.toThrow(/empty response|retry/i);
    await vi.advanceTimersByTimeAsync(10);
    await assertion;
    // Both watchdogs must have been cleared. Before the fix the TypeError off
    // `res.body.getReader()` escaped before clearWatchdogs() ran, leaking them.
    expect(live.size).toBe(0);
  });
});

// ── (3) a `done` with a missing/non-object result is fatal ──────────────────

describe('generateNarrative — malformed `done` (no valid result)', () => {
  test('a done with no result key throws instead of returning an empty {}', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(ndjsonResponse([
      { status: 'started', type: 'narrative' },
      { done: true, creditsRemaining: 7, type: 'narrative' }, // no result at all
    ]))));

    await expect(generateNarrative('narrative', settlement, 's1', {}))
      .rejects.toThrow(/without a result|malformed|retry/i);
  });

  test('a done with a non-object result (e.g. a string) is also fatal', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(ndjsonResponse([
      { field: 'thesis', value: 'A real thesis streamed in.' },
      { done: true, result: 'oops not an object', creditsRemaining: 7, type: 'narrative' },
    ]))));

    // The accumulated streamed `result` must NOT pass as a clean success; the
    // malformed completion surfaces so the caller retries.
    await expect(generateNarrative('narrative', settlement, 's1', {}))
      .rejects.toThrow(/without a result|malformed|retry/i);
  });

  test('a well-formed done still returns the authoritative result (no false positive)', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(ndjsonResponse([
      { done: true, result: { thesis: 'authoritative' }, creditsRemaining: 3, type: 'narrative' },
    ]))));

    const out = await generateNarrative('narrative', settlement, 's1', {});
    expect(out.result.thesis).toBe('authoritative');
    expect(out.creditsRemaining).toBe(3);
  });
});
