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

/**
 * The measured capability tiers, weakest first. MIRRORS the edge's PROBE_TIERS
 * (supabase/functions/surveyor-byok/probeCore.ts) and migration 191's check
 * constraint. Working names; the owner has not made the taste pick yet.
 */
export const PROBE_TIERS = Object.freeze(['scout', 'journeyman', 'master']);

/** The short chip label for a measured tier, or null when a key was never probed. */
export function probeTierLabel(tier) {
  switch (tier) {
    case 'master': return 'Master';
    case 'journeyman': return 'Journeyman';
    case 'scout': return 'Scout';
    default: return null;
  }
}

/**
 * ONE PLAIN SENTENCE for what a key demonstrated (the legibility law: a reader gets a
 * sentence, never a score formula). Derived only from the stored tier, which is itself
 * the pass count of three sample filing tasks, so the sentence can state what happened
 * without quoting arithmetic at anybody.
 * @param {{ probe_tier?: string|null }|null|undefined} row a surveyor_byok_status row
 */
export function probeTierSentence(row) {
  switch (row?.probe_tier) {
    case 'master':
      return 'This model filed all three sample requests correctly, so Surveyor can hand it the longer, more involved work.';
    case 'journeyman':
      return 'This model filed two of the three sample requests correctly, so Surveyor will give it ordinary work and keep the most involved requests simple.';
    case 'scout':
      return 'This model filed at most one of the three sample requests correctly, so Surveyor will keep what it asks for short and simple.';
    default:
      return 'This key has not run a capability check yet, so Surveyor treats it cautiously.';
  }
}

/** A probe version is a semver triple and nothing else (migration 191's column check).
 *  Anything else reads as "no version recorded" rather than as a label to show. */
const PROBE_VERSION_RE = /^\d+\.\d+\.\d+$/;

/**
 * Normalize one status row so the probe fields are always present and typed, even when
 * the deployed database predates migration 191 (an older schema simply returns no such
 * columns, and an absent column must read as "never probed", not as undefined).
 *
 * TWO GENERATIONS OF ABSENCE are handled here, not one. A pre-191 database returns none
 * of the probe columns; a database carrying an EARLIER DRAFT of 191 returns the tier trio
 * but not the wave L-7a pair (probe_version, probe_profile). Both must read as honest
 * absence, because the settings surface and the coaching lane alike have to tell "not
 * recorded" apart from "recorded as nothing".
 *
 * The profile is shape-screened rather than trusted: the client never renders it as prose
 * and only ever counts verdicts, so a blob that is not a verdict list reads as absent.
 * @param {Record<string, unknown>|null|undefined} row
 */
export function normalizeByokRow(row) {
  if (!row || typeof row !== 'object') return null;
  const tier = typeof row.probe_tier === 'string' && PROBE_TIERS.includes(row.probe_tier)
    ? row.probe_tier : null;
  const profile = /** @type {{tasks?: unknown}|null|undefined} */ (row.probe_profile);
  const usableProfile = profile && typeof profile === 'object' && !Array.isArray(profile)
    && Array.isArray(profile.tasks) ? profile : null;
  return {
    ...row,
    probe_tier: tier,
    probe_checked_at: typeof row.probe_checked_at === 'string' ? row.probe_checked_at : null,
    probe_model: typeof row.probe_model === 'string' && row.probe_model ? row.probe_model : null,
    probe_version: typeof row.probe_version === 'string' && PROBE_VERSION_RE.test(row.probe_version)
      ? row.probe_version : null,
    probe_profile: usableProfile,
  };
}

/** The caller's OWN key-health + measured-tier rows (never the key). [] when unconfigured. */
export async function getByokStatus(provider = null) {
  if (!isConfigured) return [];
  const { data, error } = await supabase.rpc('surveyor_byok_status', { p_provider: provider });
  if (error) throw new Error(error.message || 'Could not read key status.');
  const rows = Array.isArray(data) ? data : (data ? [data] : []);
  return rows.map(normalizeByokRow).filter(Boolean);
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

/**
 * THE COMPETENCY PROBE: run three sample filing tasks on the stored key and record the
 * tier they demonstrate. Costs no credits (it does spend the user's own provider
 * tokens), takes a rate-limit unit per task, and grades by the engine's own schema
 * walls, never by anything the model says about itself. The result shape mirrors the
 * edge: { ok, tier, passes?, model?, probeVersion?, tasks?, message?, doors? }. The same
 * per-task verdicts the answer carries as `tasks` are also persisted as the key's
 * probe_profile (wave L-7a), which is what later reads back as deterministic coaching.
 */
export async function probeByokKey(provider = 'anthropic') {
  if (!isConfigured) throw new Error('Sign in first.');
  const { data, error } = await supabase.functions.invoke('surveyor-byok', { body: { action: 'probe', provider } });
  if (error) {
    let message = error.message || 'The capability check could not run.';
    try { const ctx = await error.context?.json?.(); if (ctx?.error) message = ctx.error; } catch { /* keep generic */ }
    return { ok: false, tier: null, message };
  }
  return data || { ok: false, tier: null, message: 'The capability check could not run.' };
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
