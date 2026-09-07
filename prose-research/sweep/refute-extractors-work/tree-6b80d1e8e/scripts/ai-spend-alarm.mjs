/**
 * ai-spend-alarm.mjs — the daily AI-SPEND ALARM dispatcher (R-28), WRITTEN-NOT-ENABLED.
 *
 * WHAT
 *   Reads the day's provider-spend snapshot (the exact shape `check_ai_spend_cap()`
 *   returns — migration 079), evaluates it against the PROPOSED warning/critical
 *   bands (src/domain/ops/aiSpendAlarm.js), prints the verdict, and — ONLY when a
 *   destination is configured AND a band is crossed — POSTs a plain-language ops
 *   notice to that destination. It APPLIES NOTHING and BLOCKS NOTHING: the hard
 *   cap (079) remains the only thing that can stop a spend. This is the early
 *   warning that fires while there is still headroom to act.
 *
 * KEY/CONFIG-INERT (the Turnstile pattern — verifyTurnstile.ts)
 *   Dispatch is gated on the AI_SPEND_ALARM_WEBHOOK env key exactly as Turnstile
 *   gates on TURNSTILE_SECRET_KEY. With the key UNSET (the default, pre-activation
 *   state) this script computes and prints the verdict but SENDS NOTHING — inert,
 *   no transport, no behavior for anyone. Setting the key is the whole activation.
 *
 * WRITTEN-NOT-ENABLED (the tuning-weekly.mjs precedent)
 *   Present + testable, but nothing schedules it. The MECHANISM is "a scheduled
 *   cloud routine (the existing scheduled-agent machinery — one command to create)"
 *   that (1) obtains the snapshot by calling check_ai_spend_cap() through the admin
 *   client and (2) runs this script daily. Creating that routine and setting the
 *   webhook are the OWNER's steps (see docs/ops/AI_SPEND_ALARM_RUNBOOK.md).
 *
 * INPUT (dependency-free — no pg driver bundled, mirroring check-migration-head.mjs):
 *   --snapshot <path>   JSON of { daily_spend, daily_cap, monthly_spend,
 *                       monthly_cap, enabled } (the RPC's return). The routine
 *                       obtains it from the RPC; here it is read from a file so the
 *                       script never touches the DB.
 *   Env AI_SPEND_ALARM_WEBHOOK      the POST destination (Slack/Discord/ops URL).
 *                                   Unset ⇒ inert.
 *   Env AI_SPEND_ALARM_THRESHOLDS   optional JSON { warning, critical } fractions,
 *                                   overriding the PROPOSED defaults.
 *
 * Deterministic given its inputs; safe to run any time (prints the verdict; sends
 * only when keyed AND over a band). Never throws into the caller.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { evaluateSpendAlarm, describeSpendAlarm } from '../src/domain/ops/aiSpendAlarm.js';

/** Read a --flag value from argv (returns undefined if absent). */
function argValue(flag, argv = process.argv) {
  const i = argv.indexOf(flag);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : undefined;
}

/** Parse a JSON env var, or return undefined when unset/garbled (never throws). */
export function parseJsonEnv(raw) {
  if (!raw) return undefined;
  try { return JSON.parse(raw); } catch { return undefined; }
}

/**
 * Read the spend snapshot from a file, or a zero-spend snapshot when absent. A
 * missing snapshot must read as "nothing spent yet" (level ok), never crash the job.
 * @param {string|undefined} path
 * @returns {object}
 */
export function readSnapshot(path) {
  if (!path) return { daily_spend: 0, daily_cap: 0, monthly_spend: 0, monthly_cap: 0, enabled: true };
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (err) {
    process.stderr.write(`[ai-spend-alarm] could not read ${path}: ${err.message}\n`);
    return { daily_spend: 0, daily_cap: 0, monthly_spend: 0, monthly_cap: 0, enabled: true };
  }
}

/**
 * The INERT-GATED dispatcher. Returns a result describing what it did WITHOUT ever
 * throwing. When `webhookUrl` is falsy it is INERT ({ dispatched:false,
 * enforced:false, reason:'unconfigured' }) — the Turnstile shape. When configured it
 * POSTs only if the verdict is over a band; a transport error is swallowed and
 * reported (an alarm outage must never crash the money-adjacent job).
 *
 * @param {{ verdict: ReturnType<typeof evaluateSpendAlarm>, webhookUrl?: string|null,
 *   fetchImpl?: typeof fetch, weekOf?: string }} args
 * @returns {Promise<{ dispatched: boolean, enforced: boolean, reason: string }>}
 */
export async function dispatchSpendAlarm({ verdict, webhookUrl, fetchImpl = fetch }) {
  if (!webhookUrl) return { dispatched: false, enforced: false, reason: 'unconfigured' }; // INERT
  if (!verdict || !verdict.over_threshold) return { dispatched: false, enforced: true, reason: 'within_bands' };
  const payload = {
    kind: 'ai_spend_alarm',
    level: verdict.level,
    text: describeSpendAlarm(verdict),
    daily: verdict.daily,
    monthly: verdict.monthly,
    thresholds: verdict.thresholds,
    at: new Date().toISOString(),
  };
  try {
    await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { dispatched: true, enforced: true, reason: verdict.level };
  } catch (err) {
    process.stderr.write(`[ai-spend-alarm] dispatch failed (not fatal): ${err.message}\n`);
    return { dispatched: false, enforced: true, reason: 'dispatch_error' };
  }
}

async function main() {
  const snapshot = readSnapshot(argValue('--snapshot'));
  const thresholds = parseJsonEnv(process.env.AI_SPEND_ALARM_THRESHOLDS);
  const verdict = evaluateSpendAlarm(snapshot, thresholds);
  const webhookUrl = process.env.AI_SPEND_ALARM_WEBHOOK || '';
  const outcome = await dispatchSpendAlarm({ verdict, webhookUrl });
  process.stdout.write(JSON.stringify({ verdict, outcome, summary: describeSpendAlarm(verdict) }, null, 2) + '\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
