/**
 * aiStreamWatchdog.test.js
 *
 * Two client-side hardening guards on generateNarrative's NDJSON reader:
 *
 *   1. Stream watchdog (HIGH) — a stalled half-open stream (connection alive,
 *      no bytes arriving) used to wedge ALL AI actions until a page reload,
 *      because `reader.read()` never resolves and there was no timeout. The fix
 *      wires an AbortController with an overall deadline AND an idle-since-last-
 *      chunk watchdog; a trip aborts the fetch and surfaces a clean, retryable
 *      error. These tests drive fake timers past the idle budget on a stream
 *      that never delivers `done` and assert we reject instead of hanging.
 *
 *   2. Prototype-pollution guard (LOW) — a crafted dotted field path like
 *      `__proto__.polluted` used to write THROUGH Object.prototype. The fix
 *      rejects __proto__/constructor/prototype path segments before descending.
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

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  vi.useRealTimers();
});

// A reader whose read() never resolves on its own — models a half-open stalled
// stream that emits one chunk then goes silent forever (no `done`, no further
// chunks). Like a real ReadableStreamDefaultReader, an abort on the request
// signal REJECTS the pending read() with an AbortError; that is what lets the
// watchdog break the otherwise-infinite `await reader.read()`.
function stallingStreamResponse(firstChunkLines, signal) {
  const encoder = new TextEncoder();
  const firstChunk = firstChunkLines.length
    ? encoder.encode(firstChunkLines.map((l) => JSON.stringify(l)).join('\n') + '\n')
    : null;
  let delivered = false;
  return {
    ok: true,
    status: 200,
    text: async () => '',
    body: {
      getReader() {
        return {
          read() {
            if (firstChunk && !delivered) {
              delivered = true;
              return Promise.resolve({ done: false, value: firstChunk });
            }
            // Resolves only when the controller aborts — mirrors fetch's reader.
            return new Promise((_resolve, reject) => {
              const err = new Error('aborted');
              err.name = 'AbortError';
              if (signal?.aborted) { reject(err); return; }
              signal?.addEventListener('abort', () => reject(err), { once: true });
            });
          },
        };
      },
    },
  };
}

describe('generateNarrative — stream watchdog (no infinite hang)', () => {
  test('an idle stall (no chunk for the idle budget) rejects with a retryable timeout error', async () => {
    vi.useFakeTimers();
    let captured;
    vi.stubGlobal('fetch', vi.fn((_url, opts) => {
      captured = opts;
      return Promise.resolve(stallingStreamResponse([{ field: 'thesis', value: 'A start.' }], opts.signal));
    }));

    const p = generateNarrative('narrative', settlement, 's1', {});
    // Attach the rejection handler up front so the abort never goes unhandled.
    const assertion = expect(p).rejects.toThrow(/timed out|stopped responding|retry/i);
    // Let the pre-fetch await chain (getAccessTokenSafe → fetch → first read)
    // settle so the request is actually in-flight before we test the signal.
    await vi.advanceTimersByTimeAsync(10);
    // The fetch must be wired with an abort signal for the watchdog to bite.
    expect(captured?.signal).toBeInstanceOf(AbortSignal);
    // Push past the idle watchdog budget (45s) — read() never resolves, so only
    // the watchdog can end this run.
    await vi.advanceTimersByTimeAsync(46000);
    await assertion;
  });

  test('the overall deadline also aborts a stream that streams steadily but never finishes', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_url, opts) =>
      // No first chunk; read() resolves only when the overall deadline aborts.
      Promise.resolve(stallingStreamResponse([], opts.signal)),
    ));

    const p = generateNarrative('narrative', settlement, 's1', {});
    const assertion = expect(p).rejects.toThrow(/timed out|stopped responding|retry/i);
    await vi.advanceTimersByTimeAsync(10); // let fetch + first read attach
    // Past the overall ceiling (180s).
    await vi.advanceTimersByTimeAsync(181000);
    await assertion;
  }, 10000);
});

// ── Prototype-pollution guard ───────────────────────────────────────────────

function ndjsonResponse(lines) {
  const encoder = new TextEncoder();
  const body = lines.map((l) => JSON.stringify(l)).join('\n') + '\n';
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(body));
      controller.close();
    },
  });
  return { ok: true, status: 200, text: async () => '', body: stream };
}

describe('generateNarrative — prototype-pollution guard on streamed field paths', () => {
  test('a __proto__ dotted field path does not pollute Object.prototype', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(ndjsonResponse([
      { field: '__proto__.polluted', value: 'pwned' },
      { done: true, result: { thesis: 'ok' }, creditsRemaining: 1, type: 'narrative' },
    ]))));

    const out = await generateNarrative('narrative', settlement, 's1', {});
    // The crafted segment must NOT have walked the prototype chain.
    expect(({}).polluted).toBeUndefined();
    expect(Object.prototype.polluted).toBeUndefined();
    // The legit final result still lands.
    expect(out.result.thesis).toBe('ok');
    // Cleanup in case the guard regressed and this run polluted the prototype.
    delete Object.prototype.polluted;
  });
});
