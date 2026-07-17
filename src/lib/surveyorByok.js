/**
 * lib/surveyorByok.js — the BYOK MANAGEMENT SURFACE client transport (#29).
 *
 * Thin per-domain wrappers (the codebase idiom — no central rpc.js) over the
 * Surveyor key + governor RPCs and the surveyor-byok verify edge function. The key
 * PLAINTEXT lives only in the browser for the instant the user pastes it, travels to
 * the vault via surveyor_byok_set over TLS, and is NEVER read back (the vault has no
 * select path); this module never stores or logs it. Dynamic-imported by the lazy
 * account section, so it contributes ZERO first-paint bytes.
 */

import { supabase, isConfigured } from './supabase.js';

/** Anthropic keys look like `sk-ant-…`. A PREFIX HINT ONLY (never a block — the
 *  verify-by-test-call is the real check). Returns a warning string, or null. */
export function keyPrefixHint(provider, key) {
  const k = typeof key === 'string' ? key.trim() : '';
  if (!k) return null;
  if ((provider || 'anthropic') === 'anthropic' && !k.startsWith('sk-ant-')) {
    return 'That doesn’t look like an Anthropic key (they start with “sk-ant-”). You can still save and verify it.';
  }
  return null;
}

/** The caller's OWN key-health rows (never the key). [] when unconfigured. */
export async function getByokStatus(provider = null) {
  if (!isConfigured) return [];
  const { data, error } = await supabase.rpc('surveyor_byok_status', { p_provider: provider });
  if (error) throw new Error(error.message || 'Could not read key status.');
  return Array.isArray(data) ? data : (data ? [data] : []);
}

/** Store / rotate the user's key. Resets health to 'unverified' server-side. */
export async function setByokKey(provider, key) {
  if (!isConfigured) throw new Error('Sign in first.');
  const { data, error } = await supabase.rpc('surveyor_byok_set', { p_provider: provider || 'anthropic', p_key: key });
  if (error) throw new Error(error.message || 'Could not save the key.');
  return data === true;
}

/** Delete the user's key (the §3 deletion requirement). */
export async function clearByokKey(provider = 'anthropic') {
  if (!isConfigured) throw new Error('Sign in first.');
  const { data, error } = await supabase.rpc('surveyor_byok_clear', { p_provider: provider });
  if (error) throw new Error(error.message || 'Could not remove the key.');
  return data === true;
}

/**
 * VERIFY-BY-TEST-CALL: a minimal authenticated ping through the edge proves the stored
 * key before it is ever shown as healthy, and — on a healthy key — returns the model
 * dropdown (key list-models ∩ adapter set, each with its retention class). The result
 * shape mirrors the edge: { ok, health, models?, verifiedAt?, message?, doors? }.
 */
export async function verifyByokKey(provider = 'anthropic') {
  if (!isConfigured) throw new Error('Sign in first.');
  const { data, error } = await supabase.functions.invoke('surveyor-byok', { body: { action: 'verify', provider } });
  if (error) {
    let message = error.message || 'Verification failed.';
    try { const ctx = await error.context?.json?.(); if (ctx?.error) message = ctx.error; } catch { /* keep generic */ }
    return { ok: false, health: 'unverified', message };
  }
  return data || { ok: false, health: 'unverified', message: 'Verification failed.' };
}

/** The caller's governor settings (model prefs + caps + warn + pause), or defaults. */
export async function getSurveyorSettings() {
  if (!isConfigured) return null;
  const { data, error } = await supabase.rpc('surveyor_settings_get');
  if (error) throw new Error(error.message || 'Could not read AI settings.');
  return data || null;
}

/** Patch-merge the caller's governor settings (validated/clamped server-side). */
export async function setSurveyorSettings(patch) {
  if (!isConfigured) throw new Error('Sign in first.');
  const { data, error } = await supabase.rpc('surveyor_settings_set', { p_patch: patch });
  if (error) throw new Error(error.message || 'Could not save AI settings.');
  return data || null;
}

/** The maintained per-model $/Mtok ESTIMATE table (labelled estimate). */
export async function getPriceEstimates() {
  if (!isConfigured) return {};
  const { data, error } = await supabase.rpc('surveyor_price_estimates');
  if (error) throw new Error(error.message || 'Could not read price estimates.');
  return data || {};
}

/** The caller's OWN AI usage rows (read-own RLS) since `sinceDays` ago, for the meter. */
export async function getUsageEvents(sinceDays = 30) {
  if (!isConfigured) return [];
  const sinceIso = new Date(Date.now() - Math.max(1, sinceDays) * 86400_000).toISOString();
  const { data, error } = await supabase
    .from('ai_usage_events')
    .select('feature, model, provider, input_tokens, output_tokens, tokens_estimated, estimated_cost_usd, ok, created_at')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message || 'Could not read usage.');
  return Array.isArray(data) ? data : [];
}

/**
 * Estimate USD from token counts + the maintained price table (labelled ESTIMATE —
 * providers expose no balance API). Pure, so the dashboard and any preflight share it.
 * @param {Array} events @param {object} prices @param {string} provider
 */
export function estimateUsd(events, prices, provider = 'anthropic') {
  const pp = (prices && prices[provider]) || {};
  const def = pp.default || { in: 0, out: 0 };
  let usd = 0;
  for (const e of (Array.isArray(events) ? events : [])) {
    const m = pp[e.model] || def;
    usd += ((Number(e.input_tokens) || 0) / 1e6) * (Number(m.in) || 0)
         + ((Number(e.output_tokens) || 0) / 1e6) * (Number(m.out) || 0);
  }
  return usd;
}
