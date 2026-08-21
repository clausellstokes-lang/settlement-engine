/**
 * aiSpendAlarm.js — the PURE evaluator for the daily AI-spend ALARM (R-28).
 *
 * WHY THIS EXISTS (and how it differs from the spend CAP)
 *   Migration 079 already ships the HARD spend CAP (`check_ai_spend_cap` — a
 *   fail-closed kill-switch that BLOCKS AI calls once the daily/monthly provider
 *   COGS ceiling is reached). A kill-switch is the last line: by the time it
 *   fires you have already spent the whole cap. The ALARM is the EARLY line — it
 *   watches the same running spend (summed in `ai_usage_events.estimated_cost_usd`)
 *   and raises a heads-up when spend crosses a WARNING fraction of the cap, so an
 *   operator hears about an unusual burn while there is still headroom to act.
 *
 *   The alarm NEVER blocks anything. It only classifies (ok / warning / critical)
 *   and — when a destination is configured — dispatches a notification. The cap
 *   remains the only thing that can stop a spend.
 *
 * SHAPE MIRRORS THE ADMIN-ERRORS SEAM
 *   Migration 167's `report_client_error_alert()` returns a { threshold,
 *   over_threshold } summary that "drives the always-visible banner ... and is the
 *   substrate for an optional cron→send-email ops alert." This evaluator is the
 *   spend-side twin of that shape: a threshold read, an over-threshold verdict,
 *   and a machine-readable summary an ops dispatcher can act on.
 *
 * KEY/CONFIG-INERT (the Turnstile pattern) — the inert half lives in the
 *   dispatcher (`scripts/ai-spend-alarm.mjs`), gated on the AI_SPEND_ALARM_WEBHOOK
 *   key exactly as `verifyTurnstile` gates on TURNSTILE_SECRET_KEY. THIS module is
 *   pure arithmetic over its arguments: no I/O, no env read, no transport. It is
 *   the always-safe substrate both the dispatcher and the tests exercise.
 *
 * PURITY / BUDGET: pure, no side effects, no eager importer (read only by the
 *   daily script + tests) — zero first-paint bytes, like autoTunableRegistry.js.
 */

/** The alarm levels, ascending in severity. `ok` = below every warning band. */
export const ALARM_LEVELS = Object.freeze(['ok', 'warning', 'critical']);

/**
 * PROPOSED default thresholds, as FRACTIONS of the respective spend cap. Both are
 * soak-vetoable and operator-overridable (the dispatcher reads an optional override
 * from AI_SPEND_ALARM_THRESHOLDS). Chosen so the warning gives real headroom (a
 * quarter of the cap still unspent) and the critical band fires just before the
 * fail-closed cap would start blocking.
 * @type {{ warning: number, critical: number }}
 */
export const DEFAULT_SPEND_ALARM_THRESHOLDS = Object.freeze({ warning: 0.75, critical: 0.9 });

/**
 * Coerce a value to a finite non-negative number, else `fallback`. Spend/cap inputs
 * arrive from JSON (the RPC snapshot) so a garbled field must never throw or read as
 * a huge number — it reads as the safe fallback.
 * @param {unknown} v @param {number} fallback
 * @returns {number}
 */
function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * Normalize a thresholds object to two finite fractions in (0, 1], warning ≤ critical.
 * A malformed override falls back to the PROPOSED defaults rather than disabling the
 * alarm (fail toward noticing, mirroring the cap's fail-toward-protection default).
 * @param {unknown} thresholds
 * @returns {{ warning: number, critical: number }}
 */
export function normalizeThresholds(thresholds) {
  const t = thresholds && typeof thresholds === 'object' ? /** @type {Record<string, unknown>} */ (thresholds) : {};
  const inUnit = (/** @type {unknown} */ v, /** @type {number} */ d) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 && n <= 1 ? n : d;
  };
  let warning = inUnit(t.warning, DEFAULT_SPEND_ALARM_THRESHOLDS.warning);
  let critical = inUnit(t.critical, DEFAULT_SPEND_ALARM_THRESHOLDS.critical);
  if (warning > critical) warning = critical; // never warn ABOVE the critical band
  return { warning, critical };
}

/**
 * Classify one spend/cap pair against the thresholds. A zero/absent cap means "no
 * ceiling configured" → the fraction is undefined and the level is `ok` (nothing to
 * measure against; the cap RPC's own `enabled:false` path is the operator opting out).
 * @param {number} spend @param {number} cap @param {{ warning: number, critical: number }} thr
 * @returns {{ fraction: number | null, level: 'ok'|'warning'|'critical' }}
 */
function classifyPair(spend, cap, thr) {
  if (!(cap > 0)) return { fraction: null, level: 'ok' };
  const fraction = spend / cap;
  const level = fraction >= thr.critical ? 'critical' : fraction >= thr.warning ? 'warning' : 'ok';
  return { fraction, level };
}

/**
 * The more severe of two alarm levels.
 * @param {'ok'|'warning'|'critical'} a @param {'ok'|'warning'|'critical'} b
 * @returns {'ok'|'warning'|'critical'}
 */
function maxLevel(a, b) {
  return ALARM_LEVELS.indexOf(a) >= ALARM_LEVELS.indexOf(b) ? a : b;
}

/**
 * EVALUATE — the pure heart. Takes a spend snapshot in the exact shape
 * `check_ai_spend_cap()` returns ({ daily_spend, daily_cap, monthly_spend,
 * monthly_cap }) plus optional thresholds, and returns the alarm verdict. Never
 * throws, never dispatches, reads no config.
 *
 * @param {{
 *   daily_spend?: unknown, daily_cap?: unknown,
 *   monthly_spend?: unknown, monthly_cap?: unknown,
 *   enabled?: unknown,
 * }} snapshot
 * @param {unknown} [thresholds]  fraction overrides; defaults to the PROPOSED bands
 * @returns {{
 *   level: 'ok'|'warning'|'critical',
 *   over_threshold: boolean,
 *   thresholds: { warning: number, critical: number },
 *   daily: { spend: number, cap: number, fraction: number | null, level: string },
 *   monthly: { spend: number, cap: number, fraction: number | null, level: string },
 *   capEnabled: boolean,
 * }}
 */
export function evaluateSpendAlarm(snapshot, thresholds) {
  const snap = snapshot && typeof snapshot === 'object' ? snapshot : {};
  const thr = normalizeThresholds(thresholds);
  const dailySpend = num(snap.daily_spend);
  const dailyCap = num(snap.daily_cap);
  const monthlySpend = num(snap.monthly_spend);
  const monthlyCap = num(snap.monthly_cap);
  // `enabled` absent ⇒ treat the cap as active (the RPC's own default), so the alarm
  // watches by default rather than staying silent on a missing field.
  const capEnabled = snap.enabled === undefined ? true : snap.enabled === true;

  const daily = classifyPair(dailySpend, dailyCap, thr);
  const monthly = classifyPair(monthlySpend, monthlyCap, thr);
  // If the operator has explicitly disabled the cap, there is no ceiling to alarm
  // against — report `ok` but keep the fractions for visibility.
  const level = capEnabled ? maxLevel(daily.level, monthly.level) : 'ok';

  return {
    level,
    over_threshold: level !== 'ok',
    thresholds: thr,
    daily: { spend: dailySpend, cap: dailyCap, fraction: daily.fraction, level: capEnabled ? daily.level : 'ok' },
    monthly: { spend: monthlySpend, cap: monthlyCap, fraction: monthly.fraction, level: capEnabled ? monthly.level : 'ok' },
    capEnabled,
  };
}

/**
 * Render a one-line, plain-language ops summary of a verdict. Operator-facing (a
 * notification line), so it stays in the house register: no jargon, no §refs, spend
 * as dollars and share-of-cap as a percent. Pure over the verdict.
 * @param {ReturnType<typeof evaluateSpendAlarm>} verdict
 * @returns {string}
 */
export function describeSpendAlarm(verdict) {
  const pct = (/** @type {number|null} */ f) => (f == null ? 'n/a' : `${Math.round(f * 100)}%`);
  const usd = (/** @type {number} */ n) => `$${n.toFixed(2)}`;
  if (!verdict.capEnabled) {
    return `The AI spend cap is turned off, so the alarm has no ceiling to watch. Today ${usd(verdict.daily.spend)}, this month ${usd(verdict.monthly.spend)}.`;
  }
  if (verdict.level === 'ok') {
    return `AI spend is within its everyday range. Today ${usd(verdict.daily.spend)} (${pct(verdict.daily.fraction)} of the day's ceiling), this month ${usd(verdict.monthly.spend)} (${pct(verdict.monthly.fraction)}).`;
  }
  const word = verdict.level === 'critical' ? 'is close to its ceiling' : 'is running high';
  return `Heads up. AI spend ${word}. Today ${usd(verdict.daily.spend)} (${pct(verdict.daily.fraction)} of the day's ceiling), this month ${usd(verdict.monthly.spend)} (${pct(verdict.monthly.fraction)}). The hard cap still blocks any spend past the ceiling. This is the early warning before it.`;
}
