/**
 * lib/pricingMoments.js — Trigger pricing prompts at value moments,
 * not at first visit.
 *
 * The audit's pricing-funnel critique: don't ask users to pay before
 * they understand the core value. Apple HIG agrees. The current app
 * shows pricing prompts in places that aren't tied to user intent
 * (modal walls). This module replaces that with a small registry of
 * "moments" — first canonize, first AI use, first canon export, cloud
 * save — each with its own copy and a per-moment cooldown.
 *
 * Cooldown: 24h per moment per user (localStorage). The same
 * canonize-completion-prompt won't fire again the next morning, but
 * the next user-visible moment (their first export, say) is a fresh
 * trigger and a different copy.
 *
 * Premium users are skipped entirely — they've already converted.
 * Anonymous users see all moments. Free authenticated users see the
 * upgrade pitch.
 *
 * Wiring: call `triggerPricingMoment(reason, openModal)` from the
 * relevant store handlers (canonize, applyEvent on first AI use,
 * markExported with phase==='canon', etc.). The opener is injected so
 * the lib stays decoupled from any specific modal implementation.
 */

import { COPY } from '../copy/strings.js';

const COOLDOWN_MS = 24 * 60 * 60 * 1000;   // 24 hours
const STORAGE_PREFIX = 'sf:pricing_moment:';

/** @typedef {'first_canonize'|'first_ai_use'|'first_canon_export'|'cloud_save'} MomentReason */

/**
 * Try to fire a pricing moment. Silently no-ops if:
 *   - the user is already premium
 *   - the same moment fired within the cooldown window
 *   - localStorage is unavailable (older browsers, private mode)
 *
 * @param {MomentReason} reason
 * @param {(content: { headline:string, body:string, reason:MomentReason }) => void} openModal
 * @param {{ tier?: string, force?: boolean }} [opts]
 *   tier: pass the user's current tier to skip premium users
 *   force: skip the cooldown (used by tests / power features)
 */
export function triggerPricingMoment(reason, openModal, opts = {}) {
  if (typeof openModal !== 'function') return false;
  if (opts.tier === 'premium' || opts.tier === 'developer' || opts.tier === 'admin') return false;

  const content = COPY.pricing.moments[reason];
  if (!content) {
    console.warn(`[pricingMoments] unknown reason: ${reason}`);
    return false;
  }

  if (!opts.force && wasRecentlyTriggered(reason)) return false;
  markTriggered(reason);

  try {
    openModal({ ...content, reason });
    return true;
  } catch (e) {
    console.warn('[pricingMoments] openModal threw:', e);
    return false;
  }
}

/** Force-reset a moment's cooldown — exposed for testing and "show me
 *  again" affordances in settings. */
export function resetPricingMoment(reason) {
  try { localStorage.removeItem(STORAGE_PREFIX + reason); } catch {}
}

/** Reset all moments — useful on sign-out so the next user starts fresh. */
export function resetAllPricingMoments() {
  if (typeof localStorage === 'undefined') return;
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
    }
  } catch {}
}

function wasRecentlyTriggered(reason) {
  try {
    const last = Number(localStorage.getItem(STORAGE_PREFIX + reason)) || 0;
    return Date.now() - last < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markTriggered(reason) {
  try { localStorage.setItem(STORAGE_PREFIX + reason, String(Date.now())); } catch {}
}
