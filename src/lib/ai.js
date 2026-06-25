/**
 * ai.js — AI narrative generation service.
 *
 * Streams results from the generate-narrative edge function via NDJSON.
 *
 * For `type: 'narrative'`, the stream emits per-refinement-pass snapshots
 * keyed by dotted path (e.g. `institutions`, `powerStructure.factions`).
 * Each snapshot is the FULL refined value for that path; the client
 * writes it into a result object at that path. At the end, the server
 * sends a full `aiSettlement` object as the authoritative final state.
 *
 * The narrative run ALSO folds in daily life: it streams the dawn→night
 * beats as `dailyLife.<beat>` per-field messages and returns the assembled
 * `dailyLife` object in the final `done` (and on the return value). Daily
 * life is generated under the SINGLE narrative spend — no extra charge.
 * The separate `type: 'dailyLife'` call still works for back-compat callers.
 *
 * Per-pass errors are reported via `onField(field, null, error)` but
 * are NOT fatal — the server keeps the raw data for any failed pass,
 * so the client's final `result` still has something sensible at that
 * path (just unrefined). Top-level errors (thesis failure, auth, credit
 * check) ARE fatal and throw.
 *
 * Falls back to a mock for local dev without Supabase configured.
 */

import { supabase, isConfigured } from './supabase.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Stream watchdog budgets. A stalled half-open stream (TCP connection alive,
// no bytes arriving) used to wedge ALL AI actions until a page reload because
// `reader.read()` never resolves. Two independent deadlines guard against it:
//   • OVERALL — a hard ceiling on the whole request, including a model that
//     streams slowly-but-steadily forever.
//   • IDLE    — reset on every chunk read; fires when no bytes have arrived for
//     this long, catching the half-open stall mid-stream.
// On either trip we abort the fetch; the read loop then rejects with an
// AbortError the caller maps to a clean, retryable error.
const STREAM_OVERALL_TIMEOUT_MS = 180000; // 3 min ceiling for a full run
const STREAM_IDLE_TIMEOUT_MS = 45000;     // 45s with no chunk = treat as stalled

// Derive the localStorage key the supabase client uses to persist its session.
// The client key defaults to `sb-<project-ref>-auth-token`. If
// VITE_SUPABASE_URL is `https://<project-ref>.supabase.co`, the project ref is
// the first subdomain. We compute this eagerly so the fallback doesn't
// hard-code the project ref.
const AUTH_TOKEN_LS_KEY = (() => {
  try {
    const host = new URL(SUPABASE_URL).host;
    const ref = host.split('.')[0];
    return ref ? `sb-${ref}-auth-token` : null;
  } catch { return null; }
})();

/**
 * Get a usable access token without deadlocking on supabase-js's cross-tab
 * auth lock. Strategy: race `supabase.auth.getSession()` against a 2s timeout;
 * on timeout, read the token straight out of localStorage (skipping the
 * auto-refresh path). The noop-lock change in `supabase.js` should prevent
 * the hang in the first place — this is belt-and-suspenders for any future
 * regression (supabase-js upgrade, stale tab, etc.).
 */
async function getAccessTokenSafe() {
  // Read the persisted token from a given store, validating expiry.
  const readFrom = (store) => {
    if (!AUTH_TOKEN_LS_KEY || !store) return null;
    try {
      const raw = store.getItem(AUTH_TOKEN_LS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const token = parsed?.access_token;
      const expAt = parsed?.expires_at; // seconds since epoch
      if (!token) return null;
      if (typeof expAt === 'number' && expAt * 1000 < Date.now()) return null;
      return token;
    } catch { return null; }
  };
  // "Remember me off" routes the supabase auth token to sessionStorage (see the
  // storage adapter in supabase.js), so the fallback must check BOTH stores or a
  // session-only user on a slow getSession() gets a spurious "not signed in".
  const readLS = () => {
    let ls = null, ss = null;
    try { ls = typeof localStorage !== 'undefined' ? localStorage : null; } catch { /* sandboxed */ }
    try { ss = typeof sessionStorage !== 'undefined' ? sessionStorage : null; } catch { /* sandboxed */ }
    return readFrom(ss) || readFrom(ls);
  };

  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('getSession_timeout')), 2000)),
    ]);
    const token = result?.data?.session?.access_token;
    if (token) return token;
  } catch (_) { /* fall through to LS */ }
  return readLS();
}

/**
 * Generate an AI narrative for a settlement.
 * @param {'narrative' | 'dailyLife' | 'progression'} type
 * @param {object} settlement
 * @param {string} [settlementId]
 * @param {object} [opts]
 * @param {(field: string, value: unknown, error?: string) => void} [opts.onField] - called as each field streams in (error set on per-pass failure)
 * @param {(status: object) => void} [opts.onStatus] - called for status/phase events
 * @param {Array<string|number>} [opts.pinnedNpcIds] - NPC ids the DM pinned; the server drops them from the `npcs` pass so they round-trip unchanged.
 * @param {string} [opts.aiGuidance] - DM-approved guidance sent to the model. Private DM Notes are never sent.
 * @param {object|null} [opts.relationshipMemoryContext] - dailyLife only: compact campaign relationship posture digest.
 * @param {object|null} [opts.chronicleContext] - narrative + dailyLife: compact weighted Chronicle digest (recent + party-caused events).
 * @param {string} [opts.changeType] - progression only: classifyChange key (e.g. 'addStressor')
 * @param {string} [opts.changeLabel] - progression only: human-readable label chronicled with the run
 * @param {object|null} [opts.priorNarrative] - progression only: the previous aiSettlement (refined)
 * @param {object|null} [opts.priorDailyLife] - progression only: the previous aiDailyLife (reserved for future)
 * @returns {Promise<{ result: object, dailyLife?: object|null, creditsRemaining: number|null, type: string, partialFailure?: boolean, failedFields?: string[], succeededFields?: string[] }>}
 */
export async function generateNarrative(type, settlement, settlementId, opts = {}) {
  if (!isConfigured) {
    return mockGenerate(type, settlement, opts.onField);
  }

  const accessToken = await getAccessTokenSafe();
  if (!accessToken) {
    throw new Error('Not signed in. Please log in to generate narratives.');
  }

  const pinnedNpcIds = Array.isArray(opts.pinnedNpcIds)
    ? opts.pinnedNpcIds.filter(x => x != null).map(String)
    : [];

  // Build the request body. Progression carries extra fields the server needs
  // to do its diff-aware thesis + subset-of-passes run.
  const body = { type, settlement, settlementId, pinnedNpcIds };
  if (typeof opts.aiGuidance === 'string' && opts.aiGuidance.trim()) {
    body.aiGuidance = opts.aiGuidance.trim();
  }
  // NOTE: model preference is NO LONGER sent from the client. The edge function
  // resolves it server-side (forced override → profiles.model_preference →
  // global default), so a crafted request can't pick a model the user never
  // saved. The account-page <select> still persists profiles.model_preference;
  // that saved value is the authoritative input the server reads.
  if (type === 'dailyLife' && opts.relationshipMemoryContext && typeof opts.relationshipMemoryContext === 'object') {
    body.relationshipMemoryContext = opts.relationshipMemoryContext;
  }
  // §8 M3c — weighted Chronicle context (recent + party-caused events) for the
  // narrative + daily-life passes, so prose can reference what's happened.
  if ((type === 'narrative' || type === 'dailyLife') && opts.chronicleContext && typeof opts.chronicleContext === 'object') {
    body.chronicleContext = opts.chronicleContext;
  }
  if (type === 'progression') {
    body.changeType     = opts.changeType || '';
    body.changeLabel    = opts.changeLabel || '';
    body.priorNarrative = opts.priorNarrative || null;
    body.priorDailyLife = opts.priorDailyLife || null;
  }

  const url = `${SUPABASE_URL}/functions/v1/generate-narrative`;

  // Watchdog: abort the fetch if the whole run blows the overall ceiling OR if
  // the stream goes idle (no chunk) past the idle budget. The idle timer is
  // reset on every successful chunk read inside the loop below. We surface the
  // trip reason so the thrown error reads cleanly instead of a bare AbortError.
  const controller = new AbortController();
  let abortReason = null;
  let idleTimer = null;
  const overallTimer = setTimeout(() => {
    abortReason = 'overall';
    controller.abort();
  }, STREAM_OVERALL_TIMEOUT_MS);
  const armIdleWatchdog = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      abortReason = 'idle';
      controller.abort();
    }, STREAM_IDLE_TIMEOUT_MS);
  };
  const clearWatchdogs = () => {
    clearTimeout(overallTimer);
    if (idleTimer) clearTimeout(idleTimer);
  };

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    clearWatchdogs();
    // A pre-stream abort (TTFB never arrived) maps to the same retryable error
    // a mid-stream stall does; other fetch failures propagate unchanged.
    if (abortReason || e?.name === 'AbortError') {
      throw new Error('AI generation timed out (the simulator stopped responding). Please retry.', { cause: e });
    }
    throw e;
  }

  // Non-streaming error path: the function threw before streaming started.
  if (!res.ok) {
    clearWatchdogs();
    const txt = await res.text().catch(() => '');
    let msg = `HTTP ${res.status}`;
    try {
      const body = JSON.parse(txt);
      if (body?.error) msg = body.error;
    } catch { /* not JSON; keep HTTP code */ }
    throw new Error(msg);
  }

  // Streaming path: read NDJSON lines, dispatch to onField, collect final result.
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result = {};
  let dailyLife = null;
  let creditsRemaining = null;
  let finalType = type;
  let fatalError = null;
  let partialFailure = false;
  let failedFields = [];
  let succeededFields = [];
  let sawDone = false;

  // Support nested field paths like "powerStructure.factions". A server-sent
  // path is untrusted input: reject any segment that would walk the prototype
  // chain (__proto__/constructor/prototype) so a crafted field name can't
  // pollute Object.prototype through the result object.
  const setPath = (target, path, value) => {
    const keys = path.split('.');
    if (keys.some(k => k === '__proto__' || k === 'constructor' || k === 'prototype')) return;
    let ref = target;
    for (let i = 0; i < keys.length - 1; i++) {
      if (typeof ref[keys[i]] !== 'object' || ref[keys[i]] === null) ref[keys[i]] = {};
      ref = ref[keys[i]];
    }
    ref[keys[keys.length - 1]] = value;
  };

  const handleMessage = (msg) => {
    // Status / phase events (progress hints for the UI)
    if (msg.status) {
      try { opts.onStatus?.(msg); } catch (_) { /* UI error should not break stream */ }
      return;
    }

    // Terminal error (function-level, e.g. thesis failed or all passes failed)
    if (msg.error && !msg.field) {
      fatalError = new Error(msg.error);
      return;
    }

    // Per-field error — NOT fatal. Server keeps raw data for failed passes;
    // notify the UI but keep reading so the stream drains and we get `done`.
    if (msg.field && msg.error) {
      try { opts.onField?.(msg.field, null, msg.error); } catch (_) { /* UI error */ }
      return;
    }

    // Per-field success — progressive UI update (supports dotted paths).
    // Daily-life beats stream as `dailyLife.<beat>` during a narrative run;
    // collect them into a separate `dailyLife` object instead of writing them
    // into the narrative `result`, then forward to onField for progress UI.
    if (msg.field) {
      if (msg.field.startsWith('dailyLife.')) {
        const beat = msg.field.slice('dailyLife.'.length);
        if (!dailyLife || typeof dailyLife !== 'object') dailyLife = {};
        dailyLife[beat] = msg.value;
      } else {
        setPath(result, msg.field, msg.value);
      }
      try { opts.onField?.(msg.field, msg.value); } catch (_) { /* UI error should not break stream */ }
      return;
    }

    // Final success line — the server's `result` is authoritative
    if (msg.done) {
      sawDone = true;
      if (msg.result && typeof msg.result === 'object') {
        result = msg.result;
      }
      // Authoritative daily-life payload from a bundled narrative run. Prefer
      // the server's final object; fall back to the streamed-beat accumulation.
      if (msg.dailyLife && typeof msg.dailyLife === 'object') {
        dailyLife = msg.dailyLife;
      }
      if (typeof msg.creditsRemaining === 'number') creditsRemaining = msg.creditsRemaining;
      if (msg.type) finalType = msg.type;
      if (typeof msg.partialFailure === 'boolean') partialFailure = msg.partialFailure;
      if (Array.isArray(msg.failedFields)) failedFields = msg.failedFields;
      if (Array.isArray(msg.succeededFields)) succeededFields = msg.succeededFields;
    }
  };

  // Arm the idle watchdog before the first read; each successful read re-arms
  // it. A trip aborts the controller, which rejects the pending `reader.read()`.
  armIdleWatchdog();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      armIdleWatchdog(); // a chunk arrived — reset the idle countdown
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx;
      while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIdx).trim();
        buffer = buffer.slice(newlineIdx + 1);
        if (!line) continue;
        let msg;
        try { msg = JSON.parse(line); } catch { continue; }
        handleMessage(msg);
      }
    }
  } catch (e) {
    clearWatchdogs();
    // A watchdog trip (or any abort of the stream) reads as a clean, retryable
    // timeout rather than a wedged action. The caller clears its loading flag
    // and surfaces a friendly message off this throw.
    if (abortReason || e?.name === 'AbortError') {
      throw new Error('AI generation timed out (the simulator stopped responding). Please retry.', { cause: e });
    }
    throw e;
  }
  clearWatchdogs();

  // Flush any final line that wasn't newline-terminated — the `done` marker is
  // often the last line and may arrive without a trailing newline.
  const tail = buffer.trim();
  if (tail) {
    try { handleMessage(JSON.parse(tail)); } catch { /* unparseable tail = truncation */ }
  }

  if (fatalError) throw fatalError;
  // A stream that never delivered a terminal `done` was truncated mid-flight.
  // Surface it so the caller retries instead of persisting a partial (but
  // credit-charged) generation as if it were complete.
  if (!sawDone) {
    throw new Error('AI generation ended without a completion marker (truncated response). Please retry.');
  }
  // Normalize an empty daily-life accumulation to null so callers can use a
  // simple truthiness check (every beat failing yields {} from the server).
  if (dailyLife && typeof dailyLife === 'object' && Object.keys(dailyLife).length === 0) {
    dailyLife = null;
  }
  return { result, dailyLife, creditsRemaining, type: finalType, partialFailure, failedFields, succeededFields };
}

// ── Mock for local dev ──────────────────────────────────────────────────────

async function mockGenerate(type, settlement, onField) {
  const name = settlement?.name || 'this settlement';
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  if (type === 'narrative') {
    // Mock refinement architecture: thesis + a couple of refined sections
    const thesis = `${name} is a settlement that remembers its debts. The old charter is signed but the signatures mean different things to different people. The people who know the difference are the ones who decide which doors open after dark.`;
    await delay(400);
    try { onField?.('thesis', thesis); } catch (_) {}

    // Fake institutions refinement
    const refinedSettlement = JSON.parse(JSON.stringify(settlement));
    refinedSettlement.thesis = thesis;
    if (Array.isArray(refinedSettlement.institutions)) {
      refinedSettlement.institutions = refinedSettlement.institutions.map((inst, _i) => ({
        ...inst,
        description: (inst?.description || inst?.detail || 'An institution of the settlement.') +
          ' (Mock refinement. The real narrator would thread the thesis through this description.)',
      }));
      await delay(300);
      try { onField?.('institutions', refinedSettlement.institutions); } catch (_) {}
    }
    // The narrative run folds in daily life — mock the bundled beats so local
    // dev mirrors production (one narrative action, narrative + daily life).
    const mockDaily = mockDailyLifePayload(name);
    for (const [beat, v] of Object.entries(mockDaily)) {
      await delay(120);
      try { onField?.(`dailyLife.${beat}`, v); } catch (_) {}
    }
    return { result: refinedSettlement, dailyLife: mockDaily, creditsRemaining: 0, type: 'narrative', partialFailure: false, failedFields: [], succeededFields: ['institutions'] };
  }

  const payload = mockDailyLifePayload(name);
  for (const [k, v] of Object.entries(payload)) {
    await delay(300);
    try { onField?.(k, v); } catch (_) {}
  }
  return { result: payload, dailyLife: payload, creditsRemaining: 0, type: 'dailyLife' };
}

/** Deterministic daily-life prose for local dev (no Supabase). */
function mockDailyLifePayload(name) {
  return {
    dawn:    `As the first grey light seeps over the horizon, ${name} stirs to life. A rooster crows from behind the smithy, and the night watch shuffles toward the tavern for a warm meal before sleep.`,
    morning: `The market opens with the clatter of stall frames being assembled. A queue forms at the baker's door. Children chase each other through the lanes while their parents begin the day's labors.`,
    midday:  `The sun reaches its zenith and work pauses. Folk gather in the shade of the old oak in the square, sharing bread and gossip. A traveling merchant arrives with news from distant lands.`,
    evening: `As shadows lengthen, the tavern fills with the day's stories. A bard tunes their lute in the corner. The smell of stew drifts from open windows, and lanterns are lit along the main road.`,
    night:   `${name} settles into a watchful quiet. The night patrol makes their rounds, boots crunching on gravel. Behind closed doors, families share evening prayers or whispered schemes.`,
  };
}
