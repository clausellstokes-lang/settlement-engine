/**
 * emailLifecycle.js — Tier 8.5 client-side lifecycle hooks.
 *
 * Thin wrapper over the `send-email` edge function. Each helper here
 * corresponds to one TEMPLATES key in emailTemplates.js and assembles
 * the right payload from whatever store/auth state the caller has.
 *
 * Every helper is fire-and-forget. Email failures must never block a
 * user action — a save that succeeded shouldn't roll back because the
 * confirmation email's SMTP timed out. Errors are logged in DEV and
 * swallowed in PROD.
 *
 * Where to call each:
 *   notifyWelcome         — App.jsx, on first successful auth state change
 *                            from anon → signed-in
 *   notifySaved           — saves.js, after a save succeeds
 *   notifyExported        — utils/generateSettlementPDF.js, after
 *                            successful PDF emit (only once per dossier)
 *   notifyCreditLow       — creditsSlice.js, after spend if balance
 *                            crosses below threshold (5 by default)
 *   notifyFounderThankYou — stripe-webhook side-effect after founder
 *                            purchase processes (this one is server-side)
 *   notifyCapWarning      — anonGenCounter.js, when anon hits the cap
 *                            (clients only — server has no email
 *                            address for an anon yet)
 */

import { supabase, isConfigured } from './supabase.js';

const FN_NAME = 'send-email';

/**
 * Internal: invoke the send-email edge function. Returns null on
 * failure (no throw). All callers are fire-and-forget.
 */
async function send(template, payload, recipient = null) {
  if (!isConfigured) {
    if (import.meta?.env?.DEV) {

      console.info(`[emailLifecycle] supabase not configured — would send ${template}`, payload);
    }
    return null;
  }
  try {
    const { data, error } = await supabase.functions.invoke(FN_NAME, {
      body: { template, payload, recipient },
    });
    if (error) {
      if (import.meta?.env?.DEV) {

        console.warn(`[emailLifecycle] ${template} send failed:`, error.message);
      }
      return null;
    }
    return data;
  } catch (e) {
    if (import.meta?.env?.DEV) {

      console.warn(`[emailLifecycle] ${template} threw:`, e.message);
    }
    return null;
  }
}

// ── Public helpers ─────────────────────────────────────────────────────────

/** Welcome email — first signup. Authenticated call; server reads
 *  the recipient from auth.uid() so we don't pass the address. */
export function notifyWelcome({ displayName = 'there' } = {}) {
  return send('welcome', { displayName });
}

/** Save confirmation — fires once per fresh save (not on re-save). */
export function notifySaved({ displayName, settlementName, tier }) {
  return send('save_confirmation', {
    displayName: displayName || 'there',
    settlementName: settlementName || 'Untitled settlement',
    tier: tier || 'settlement',
  });
}

/** Export confirmation — after PDF emit. Same fire-and-forget shape. */
export function notifyExported({ displayName, settlementName, tier }) {
  return send('export_confirmation', {
    displayName: displayName || 'there',
    settlementName: settlementName || 'Untitled settlement',
    tier: tier || 'settlement',
  });
}

/** Credit-low warning — call only when balance crosses below threshold. */
export function notifyCreditLow({ displayName, balance, narrativeCost = 3, dailyLifeCost = 4 }) {
  return send('credit_low', {
    displayName: displayName || 'there',
    balance:     String(balance ?? 0),
    narrativeCost: String(narrativeCost),
    dailyLifeCost: String(dailyLifeCost),
  });
}

/** Founder thank-you. Fires server-side after Stripe webhook upgrades
 *  the user; here we expose the client-side helper for completeness
 *  but in practice this should be called from the stripe-webhook
 *  edge function, not from the client. */
export function notifyFounderThankYou({ displayName } = {}) {
  return send('founder_thank_you', { displayName: displayName || 'there' });
}

/** Anonymous cap warning — emailable only when the user has actually
 *  given us an address. For now this surfaces in the cap-hit UI as a
 *  "want to be reminded?" form; the helper exists for that path. */
export function notifyCapWarning({ recipient, capUsed, capTotal }) {
  if (!recipient) return Promise.resolve(null);
  return send('cap_warning', {
    capUsed:  String(capUsed ?? 3),
    capTotal: String(capTotal ?? 3),
  }, recipient);
}
