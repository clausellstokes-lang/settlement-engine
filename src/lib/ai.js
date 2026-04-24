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
  const readLS = () => {
    if (!AUTH_TOKEN_LS_KEY) return null;
    try {
      const raw = localStorage.getItem(AUTH_TOKEN_LS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const token = parsed?.access_token;
      const expAt = parsed?.expires_at; // seconds since epoch
      if (!token) return null;
      if (typeof expAt === 'number' && expAt * 1000 < Date.now()) return null;
      return token;
    } catch { return null; }
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
 * @param {'narrative' | 'dailyLife'} type
 * @param {object} settlement
 * @param {string} [settlementId]
 * @param {object} [opts]
 * @param {(field: string, value: unknown, error?: string) => void} [opts.onField] - called as each field streams in (error set on per-pass failure)
 * @param {(status: object) => void} [opts.onStatus] - called for status/phase events
 * @returns {{ result: object, creditsRemaining: number|null, type: string, partialFailure?: boolean, failedFields?: string[], succeededFields?: string[] }}
 */
export async function generateNarrative(type, settlement, settlementId, opts = {}) {
  if (!isConfigured) {
    return mockGenerate(type, settlement, opts.onField);
  }

  const accessToken = await getAccessTokenSafe();
  if (!accessToken) {
    throw new Error('Not signed in. Please log in to generate narratives.');
  }

  const url = `${SUPABASE_URL}/functions/v1/generate-narrative`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ type, settlement, settlementId }),
  });

  // Non-streaming error path: the function threw before streaming started.
  if (!res.ok) {
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
  let creditsRemaining = null;
  let finalType = type;
  let fatalError = null;
  let partialFailure = false;
  let failedFields = [];
  let succeededFields = [];

  // Support nested field paths like "powerStructure.factions"
  const setPath = (target, path, value) => {
    const keys = path.split('.');
    let ref = target;
    for (let i = 0; i < keys.length - 1; i++) {
      if (typeof ref[keys[i]] !== 'object' || ref[keys[i]] === null) ref[keys[i]] = {};
      ref = ref[keys[i]];
    }
    ref[keys[keys.length - 1]] = value;
  };

  /* eslint-disable no-constant-condition */
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIdx;
    while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newlineIdx).trim();
      buffer = buffer.slice(newlineIdx + 1);
      if (!line) continue;

      let msg;
      try { msg = JSON.parse(line); } catch { continue; }

      // Status / phase events (progress hints for the UI)
      if (msg.status) {
        try { opts.onStatus?.(msg); } catch (_) { /* UI error should not break stream */ }
        continue;
      }

      // Terminal error (function-level, e.g. thesis failed or all passes failed)
      if (msg.error && !msg.field) {
        fatalError = new Error(msg.error);
        continue;
      }

      // Per-field error — NOT fatal. Server keeps raw data for failed passes;
      // notify the UI but keep reading so the stream drains and we get `done`.
      if (msg.field && msg.error) {
        try { opts.onField?.(msg.field, null, msg.error); } catch (_) { /* UI error */ }
        continue;
      }

      // Per-field success — progressive UI update (supports dotted paths)
      if (msg.field) {
        setPath(result, msg.field, msg.value);
        try { opts.onField?.(msg.field, msg.value); } catch (_) { /* UI error should not break stream */ }
        continue;
      }

      // Final success line — the server's `result` is authoritative
      if (msg.done) {
        if (msg.result && typeof msg.result === 'object') {
          result = msg.result;
        }
        if (typeof msg.creditsRemaining === 'number') creditsRemaining = msg.creditsRemaining;
        if (msg.type) finalType = msg.type;
        if (typeof msg.partialFailure === 'boolean') partialFailure = msg.partialFailure;
        if (Array.isArray(msg.failedFields)) failedFields = msg.failedFields;
        if (Array.isArray(msg.succeededFields)) succeededFields = msg.succeededFields;
      }
    }
  }
  /* eslint-enable no-constant-condition */

  if (fatalError) throw fatalError;
  return { result, creditsRemaining, type: finalType, partialFailure, failedFields, succeededFields };
}

// ── Mock for local dev ──────────────────────────────────────────────────────

async function mockGenerate(type, settlement, onField) {
  const name = settlement?.name || 'this settlement';
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  if (type === 'narrative') {
    // Mock refinement architecture: thesis + a couple of refined sections
    const thesis = `${name} is a settlement that remembers its debts. The old charter is signed but the signatures mean different things to different people — and the people who know the difference are the ones who decide which doors open after dark.`;
    await delay(400);
    try { onField?.('thesis', thesis); } catch (_) {}

    // Fake institutions refinement
    const refinedSettlement = JSON.parse(JSON.stringify(settlement));
    refinedSettlement.thesis = thesis;
    if (Array.isArray(refinedSettlement.institutions)) {
      refinedSettlement.institutions = refinedSettlement.institutions.map((inst, i) => ({
        ...inst,
        description: (inst?.description || inst?.detail || 'An institution of the settlement.') +
          ' (Mock refinement — the real narrator would thread the thesis through this description.)',
      }));
      await delay(300);
      try { onField?.('institutions', refinedSettlement.institutions); } catch (_) {}
    }
    return { result: refinedSettlement, creditsRemaining: 0, type: 'narrative', partialFailure: false, failedFields: [], succeededFields: ['institutions'] };
  }

  const payload = {
    dawn:    `As the first grey light seeps over the horizon, ${name} stirs to life. A rooster crows from behind the smithy, and the night watch shuffles toward the tavern for a warm meal before sleep.`,
    morning: `The market opens with the clatter of stall frames being assembled. A queue forms at the baker's door. Children chase each other through the lanes while their parents begin the day's labors.`,
    midday:  `The sun reaches its zenith and work pauses. Folk gather in the shade of the old oak in the square, sharing bread and gossip. A traveling merchant arrives with news from distant lands.`,
    evening: `As shadows lengthen, the tavern fills with the day's stories. A bard tunes their lute in the corner. The smell of stew drifts from open windows, and lanterns are lit along the main road.`,
    night:   `${name} settles into a watchful quiet. The night patrol makes their rounds, boots crunching on gravel. Behind closed doors, families share evening prayers or whispered schemes.`,
  };
  for (const [k, v] of Object.entries(payload)) {
    await delay(300);
    try { onField?.(k, v); } catch (_) {}
  }
  return { result: payload, creditsRemaining: 0, type: 'dailyLife' };
}
