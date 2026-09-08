/**
 * config/livePricing.js — LAZY-ONLY live AI-pricing read path (brief §C-1).
 *
 * The server is the authority on the CURRENT per-model credit schedule: the
 * get_ai_pricing() RPC (migrations 114/131/170) returns the live cost table, and
 * spend_credits charges from the same config. After a reprice deploy an old
 * cached client still ships the PREVIOUS src/config/pricing.js constants while
 * the server already charges the new ones — so a display that reads live config
 * follows whatever the server actually charges, with the shipped constants as a
 * graceful fallback when the RPC is absent/undeployed/offline.
 *
 * This is a read-and-display helper only. The server precheck (generate-narrative
 * CREDIT_COSTS) and the spend_credits RPC remain the authoritative charge; a
 * stale display can never over/under-charge.
 *
 * ⚠️ LAZY LAW — mirrors config/pricingDisplay.js. src/config/pricing.js rides the
 * EAGER first-paint entry closure (a hard byte ceiling with a tiny margin), and
 * this module additionally pulls in the supabase client. NEVER import it from an
 * eager first-paint surface — only from a component already behind a lazy()
 * boundary (e.g. the lazily-loaded pricing page / account panels). Keeping it out
 * of the eager graph is the whole reason it is a separate leaf.
 */
import { supabase, isConfigured } from '../lib/supabase.js';
import {
  _clearLiveAiPricing,
  _setLiveAiPricing,
  getAiCostForModel,
  DEFAULT_MODEL_PREFERENCE,
  normalizeModelPreference,
} from './pricing.js';

// One memoized fetch per page load — the schedule changes at most once per deploy,
// so a single call is plenty and a resolved-null result stops us from re-hitting a
// missing/undeployed RPC (no console spew, no retry storm).
let _pricingPromise = null;

/**
 * Fetch the live credit-cost schedule from get_ai_pricing(). Resolves to the RPC
 * payload — `{ creditCosts: { <profileKey>: { narrative, dailyLife, progression } },
 * chronicle, updatedAt, models, ... }` — or to `null` on ANY failure (RPC missing
 * or undeployed, backend not configured, network/auth error). NEVER throws and
 * NEVER logs, so an undeployed server is silent and callers just use the shipped
 * constants.
 * @returns {Promise<object|null>}
 */
export function fetchLivePricing() {
  if (_pricingPromise) return _pricingPromise;
  _pricingPromise = (async () => {
    if (!isConfigured || !supabase || typeof supabase.rpc !== 'function') return null;
    try {
      const { data, error } = await supabase.rpc('get_ai_pricing');
      if (error || !data || typeof data !== 'object') return null;
      _setLiveAiPricing(data);
      return data;
    } catch {
      return null;
    }
  })();
  return _pricingPromise;
}

/** Test/HMR seam: forget the memoized fetch so the next call re-reads the RPC. */
export function _resetLivePricingCache() {
  _pricingPromise = null;
  _clearLiveAiPricing();
}

/**
 * Resolve a feature's credit cost under a model preference, PREFERRING the live
 * schedule when present and valid, else the shipped constant. `live` is the
 * payload from fetchLivePricing() (or null). Validated integer 1..12; any miss or
 * malformation falls back to getAiCostForModel — so the return is always a real
 * price, live or shipped.
 * @param {string} feature 'narrative' | 'dailyLife' | 'progression'
 * @param {string} [modelPreference] a model key/alias; defaults to the Opus default
 * @param {object|null} [live] fetchLivePricing() payload
 */
export function resolveLiveAiCost(feature, modelPreference, live) {
  const profile = normalizeModelPreference(modelPreference || DEFAULT_MODEL_PREFERENCE);
  const v = live && live.creditCosts && live.creditCosts[profile]
    ? live.creditCosts[profile][feature]
    : undefined;
  if (Number.isInteger(v) && v >= 1 && v <= 12) return v;
  return getAiCostForModel(feature, modelPreference);
}

/** Standard-schedule (default Opus profile) cost, preferring live else constant. */
export function resolveLiveStandardCost(feature, live) {
  return resolveLiveAiCost(feature, DEFAULT_MODEL_PREFERENCE, live);
}
