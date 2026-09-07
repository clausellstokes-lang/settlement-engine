/**
 * lib/autoReloadClient.js — the account auto-reload panel's data layer
 * (DESIGN_MONEY_WAVE §4.6 / #13). Reads settings + attempt status through the
 * owner-SELECT RLS policies; writes settings via set_auto_reload_settings().
 *
 * Reads FAIL CLOSED and never throw (the founderLineage idiom) — the tables are
 * written-not-applied until the owner's db push, so pre-deploy every read returns
 * the OFF defaults. The write DOES surface errors (it's a user action). Zero eager:
 * imported LAZILY from the (already-lazy) account panel.
 *
 * NOTE (M-3e judgment, vetoable): the panel is COMPONENT-LOCAL (self-fetch), not
 * store-backed — matching the Past-purchases panel (§3) and avoiding the
 * operationRegistry + compendium-regen + EXEMPT_CEILING machinery new store actions
 * would trip (owner-flagged heavyweight). §4.6 names store actions "or equivalent";
 * this is the equivalent. Flip to store actions if cross-surface reactivity is wanted.
 */
import { supabase, isConfigured } from './supabase.js';

/** The OFF defaults (mirror the 158 settings-table defaults). */
export const AUTO_RELOAD_DEFAULTS = Object.freeze({
  enabled: false,
  thresholdCredits: 5,
  targetCredits: 25,
  monthlyCapCents: 4000,
});

/** Settable ranges (mirror the table CHECKs / set_auto_reload_settings validation). */
export const AUTO_RELOAD_LIMITS = Object.freeze({
  threshold: { min: 1, max: 500 },
  target: { min: 2, max: 1000 },
  capCents: { min: 500, max: 20000 },
});

/** UTC 'YYYY-MM' — the month_bucket the DB stamps (to_char(now() at utc)). */
export function currentMonthBucket(d = new Date()) {
  return d.toISOString().slice(0, 7);
}

/**
 * Fetch the caller's auto-reload settings. Never throws; returns the OFF defaults
 * (with exists:false) when absent/unconfigured/errored.
 * @returns {Promise<{enabled:boolean, thresholdCredits:number, targetCredits:number, monthlyCapCents:number, exists:boolean}>}
 */
export async function fetchAutoReloadSettings() {
  const fallback = { ...AUTO_RELOAD_DEFAULTS, exists: false };
  if (!isConfigured) return fallback;
  try {
    const { data, error } = await supabase
      .from('credit_auto_reload_settings')
      .select('enabled, threshold_credits, target_credits, monthly_cap_cents')
      .maybeSingle();
    if (error) { console.debug('[autoReload] settings unavailable', error?.message ?? error); return fallback; }
    if (!data) return fallback;
    return {
      enabled: Boolean(data.enabled),
      thresholdCredits: Number(data.threshold_credits) || AUTO_RELOAD_DEFAULTS.thresholdCredits,
      targetCredits: Number(data.target_credits) || AUTO_RELOAD_DEFAULTS.targetCredits,
      monthlyCapCents: Number(data.monthly_cap_cents) || AUTO_RELOAD_DEFAULTS.monthlyCapCents,
      exists: true,
    };
  } catch (e) {
    console.debug('[autoReload] settings error', e);
    return fallback;
  }
}

/**
 * Fetch this month's spent-so-far + any open attempt. Never throws.
 * @returns {Promise<{thisMonthSpentCents:number, openAttempt:{state:string, creditsDelta:number, amountCents:number}|null}>}
 */
export async function fetchAutoReloadStatus() {
  const empty = { thisMonthSpentCents: 0, openAttempt: null };
  if (!isConfigured) return empty;
  try {
    const bucket = currentMonthBucket();
    const { data, error } = await supabase
      .from('credit_auto_reload_attempts')
      .select('state, amount_cents, credits_delta, month_bucket')
      .order('created_at', { ascending: false });
    if (error || !Array.isArray(data)) { if (error) console.debug('[autoReload] status unavailable', error?.message ?? error); return empty; }
    const counted = new Set(['succeeded', 'pending', 'requires_action']);
    const thisMonthSpentCents = data
      .filter((r) => r.month_bucket === bucket && counted.has(r.state))
      .reduce((sum, r) => sum + (Number(r.amount_cents) || 0), 0);
    const open = data.find((r) => r.state === 'pending' || r.state === 'requires_action') || null;
    return {
      thisMonthSpentCents,
      openAttempt: open ? { state: open.state, creditsDelta: Number(open.credits_delta) || 0, amountCents: Number(open.amount_cents) || 0 } : null,
    };
  } catch (e) {
    console.debug('[autoReload] status error', e);
    return empty;
  }
}

/**
 * Persist the caller's settings via set_auto_reload_settings(). THROWS on failure
 * (a user action — the panel surfaces the message).
 * @param {{enabled:boolean, thresholdCredits:number, targetCredits:number, monthlyCapCents:number}} s
 */
export async function saveAutoReloadSettings(s) {
  if (!isConfigured) throw new Error('Payments are not configured in this environment.');
  const { error } = await supabase.rpc('set_auto_reload_settings', {
    p_enabled: Boolean(s.enabled),
    p_threshold: s.thresholdCredits,
    p_target: s.targetCredits,
    p_cap: s.monthlyCapCents,
  });
  if (error) throw new Error(error.message || 'Could not save auto-reload settings.');
  return true;
}
