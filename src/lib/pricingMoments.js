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
 *
 * ── LD-7: SCOPE IS A CONDITION OF FIRING ─────────────────────────────────────
 * THE POPUP SCOPE LAW (lib/momentScope.js) says a popup that travels must say so
 * in its registration, never by accident of mount point. That is only true if an
 * UNDECLARED moment cannot reach a surface at all, so this function refuses one
 * exactly the way it already refuses an unknown reason: warn, return false, fire
 * nothing. The render gate in PricingMomentCard is the second door, kept because a
 * store rehydrated from an older build could still be holding a moment this build
 * no longer declares.
 *
 * ⚠️ THE REFUSAL COMES BEFORE `markTriggered`. A moment refused for want of a
 * declaration must not burn its 24h cooldown — the cure for the refusal is to add
 * the declaration, and a burnt cooldown would hide the fix for a day.
 */

import { tx } from '../copy/index.js';
import { momentIsDeclared } from './momentScope.js';

const COOLDOWN_MS = 24 * 60 * 60 * 1000;   // 24 hours
const STORAGE_PREFIX = 'sf:pricing_moment:';

/** @typedef {'first_canonize'|'first_ai_use'|'first_canon_export'|'cloud_save'|'first_save'|'third_save'|'first_pdf_export'|'regen_burst'|'map_clicked'|'map_realm_teaser'|'weekly_user'|'welcome_credit'|'anon_cap_hit'|'founder_eligible'|'first_advance_attempt'|'war_layer_curiosity'|'pantheon_preview'} MomentReason */

/**
 * Try to fire a pricing moment. Silently no-ops if:
 *   - the user is already premium
 *   - the same moment fired within the cooldown window
 *   - localStorage is unavailable (older browsers, private mode)
 *
 * ...or the reason carries no `scope` declaration in lib/momentScope.js.
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

  const content = tx(`moments.${reason}`);
  if (!content) {
    console.warn(`[pricingMoments] unknown reason: ${reason}`);
    return false;
  }

  // LD-7 law 3, enforced rather than reviewed. A moment with no row in
  // MOMENT_SCOPES has not said where it lives, so it does not open.
  if (!momentIsDeclared(reason)) {
    console.warn(`[pricingMoments] refusing '${reason}': no scope declared in lib/momentScope.js.`
      + ' Every moment declares the surface it belongs to (LD-7, the popup scope law).');
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
