/**
 * aiNarrativeBundlesDailyLife.test.js
 *
 * The narrative run now folds daily life in under the SINGLE narrative spend.
 * These tests pin the client-side streaming contract for that fold:
 *   - daily-life beats stream as `dailyLife.<beat>` and land on the returned
 *     `dailyLife` object (NOT mixed into the narrative `result`)
 *   - the final `done` carries an authoritative `dailyLife` payload
 *   - a single run yields both narrative + daily life (one credit charge,
 *     reflected by a single `creditsRemaining`)
 *   - a per-beat failure is non-fatal (the run still completes)
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Force the configured (non-mock) code path so we exercise the real NDJSON
// reader rather than mockGenerate.
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: { access_token: 'tok' } } })),
    },
  },
}));

import { generateNarrative } from '../../src/lib/ai.js';

function ndjsonResponse(lines) {
  const body = lines.map((l) => JSON.stringify(l)).join('\n') + '\n';
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(body));
      controller.close();
    },
  });
  return { ok: true, body, status: 200, _stream: stream };
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function setFetchLines(lines) {
  const r = ndjsonResponse(lines);
  fetch.mockResolvedValue({
    ok: true,
    status: 200,
    body: r._stream,
    text: async () => '',
  });
}

const settlement = { id: 's1', name: 'Ashford', institutions: [] };

describe('narrative run folds in daily life (single spend)', () => {
  test('daily-life beats route to dailyLife, not into the narrative result', async () => {
    setFetchLines([
      { status: 'started', type: 'narrative', totalFields: 10 },
      { field: 'thesis', value: 'A town that remembers its debts.' },
      { field: 'institutions', value: [{ name: 'The Watch' }] },
      { field: 'dailyLife.dawn', value: 'Dawn breaks.' },
      { field: 'dailyLife.morning', value: 'The market opens.' },
      { field: 'dailyLife.midday', value: 'Midday lull.' },
      { field: 'dailyLife.evening', value: 'The tavern fills.' },
      { field: 'dailyLife.night', value: 'The watch walks.' },
      {
        done: true,
        result: { thesis: 'A town that remembers its debts.', institutions: [{ name: 'The Watch' }] },
        dailyLife: {
          dawn: 'Dawn breaks.', morning: 'The market opens.', midday: 'Midday lull.',
          evening: 'The tavern fills.', night: 'The watch walks.',
        },
        creditsRemaining: 7,
        type: 'narrative',
        partialFailure: false,
        failedFields: [],
        succeededFields: ['institutions', 'dailyLife.dawn'],
      },
    ]);

    const fields = [];
    const out = await generateNarrative('narrative', settlement, 's1', {
      onField: (f, v) => fields.push([f, v]),
    });

    // Daily life is its own object and complete.
    expect(out.dailyLife).toEqual({
      dawn: 'Dawn breaks.', morning: 'The market opens.', midday: 'Midday lull.',
      evening: 'The tavern fills.', night: 'The watch walks.',
    });
    // The narrative result is NOT polluted with daily-life beats.
    expect(out.result.dawn).toBeUndefined();
    expect(out.result.dailyLife).toBeUndefined();
    expect(out.result.thesis).toBe('A town that remembers its debts.');
    // One run -> one credit charge reflected by a single creditsRemaining.
    expect(out.creditsRemaining).toBe(7);
    // Beats still forwarded to onField for progress UI.
    expect(fields).toContainEqual(['dailyLife.dawn', 'Dawn breaks.']);
  });

  test('a failed daily-life beat is non-fatal; the run still completes', async () => {
    setFetchLines([
      { field: 'thesis', value: 'Thesis.' },
      { field: 'dailyLife.dawn', value: 'Dawn.' },
      { field: 'dailyLife.morning', error: 'provider 529' },
      {
        done: true,
        result: { thesis: 'Thesis.' },
        dailyLife: { dawn: 'Dawn.' },
        creditsRemaining: 7,
        type: 'narrative',
        partialFailure: true,
        failedFields: ['dailyLife.morning'],
      },
    ]);

    const errors = [];
    const out = await generateNarrative('narrative', settlement, 's1', {
      onField: (f, _v, err) => { if (err) errors.push([f, err]); },
    });

    expect(out.dailyLife).toEqual({ dawn: 'Dawn.' });
    expect(out.partialFailure).toBe(true);
    expect(out.failedFields).toContain('dailyLife.morning');
    expect(errors).toContainEqual(['dailyLife.morning', 'provider 529']);
  });

  test('a __proto__ daily-life beat is rejected and does not corrupt the dailyLife prototype', async () => {
    setFetchLines([
      { field: 'thesis', value: 'Thesis.' },
      // Crafted beat name targeting the prototype chain — untrusted server input.
      // Pre-fix this assigns dailyLife['__proto__'] = {...}, re-pointing the
      // returned object's prototype so `injected` leaks as an inherited prop
      // (and Object.getPrototypeOf is no longer Object.prototype).
      { field: 'dailyLife.__proto__', value: { injected: true } },
      { field: 'dailyLife.dawn', value: 'Dawn.' },
      {
        done: true,
        result: { thesis: 'Thesis.' },
        creditsRemaining: 7,
        type: 'narrative',
      },
    ]);

    const fields = [];
    const out = await generateNarrative('narrative', settlement, 's1', {
      onField: (f, v) => fields.push([f, v]),
    });

    // The crafted beat did not re-point the prototype: dailyLife stays a plain
    // object and no inherited `injected` property leaks through.
    expect(Object.getPrototypeOf(out.dailyLife)).toBe(Object.prototype);
    expect(out.dailyLife.injected).toBeUndefined();
    // Object.prototype itself is untouched for good measure.
    expect(({}).injected).toBeUndefined();
    // The legitimate beat still landed; the crafted one was dropped.
    expect(out.dailyLife).toEqual({ dawn: 'Dawn.' });
    // The crafted beat is DROPPED entirely — never forwarded to the consumer,
    // so the slice can't write it into aiDailyLife state either. The legit beat
    // is still forwarded for progress UI.
    expect(fields).toContainEqual(['dailyLife.dawn', 'Dawn.']);
    expect(fields.some(([f]) => f === 'dailyLife.__proto__')).toBe(false);
  });

  test('every beat failing yields a null dailyLife (server sends {})', async () => {
    setFetchLines([
      { field: 'thesis', value: 'Thesis.' },
      { field: 'dailyLife.dawn', error: 'x' },
      {
        done: true,
        result: { thesis: 'Thesis.' },
        dailyLife: {},
        creditsRemaining: 7,
        type: 'narrative',
        partialFailure: true,
        failedFields: ['dailyLife.dawn'],
      },
    ]);

    const out = await generateNarrative('narrative', settlement, 's1', {});
    expect(out.dailyLife).toBeNull();
  });
});
