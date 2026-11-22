/**
 * referralRedeem.js — client surface for the referral + redeem-code system
 * (migration 107).
 *
 * Money-path discipline: nothing here moves value. This module only
 *   (a) records a referral INTENT (a pending row the Stripe webhook later
 *       grants server-side, on the first real payment),
 *   (b) asks the read-only `validate_redeem_code` RPC whether a code is live
 *       (the RPC deliberately never returns the coupon id or credit amount),
 *   (c) carries a validated code from the Account page to the purchase
 *       surfaces so it can ride along on `startCheckout`.
 * The create-checkout edge function re-validates and RESERVES the code
 * authoritatively; whatever the client sends is advisory input, never trusted.
 */

import { supabase, isConfigured } from './supabase.js';

// ── Pending redeem-code handoff (Account page → purchase surfaces) ──────────
// sessionStorage, not localStorage: the code should survive the SPA view
// switch (Account → Pricing) and an accidental reload, but must not pin
// itself to the browser forever. Reservation burns once-per-user server-side,
// so a stale code resurfacing weeks later would only produce a confusing
// "already redeemed" notice at checkout.
const PENDING_CODE_KEY = 'sf_pending_redeem_code';

/** Stash a code for the next checkout on this visit. @param {string} code */
export function setPendingRedeemCode(code) {
  try { sessionStorage.setItem(PENDING_CODE_KEY, code); }
  catch { /* storage unavailable — the user can retype at checkout */ }
}

/** @returns {string} the stashed code, or '' when none / storage unavailable */
export function getPendingRedeemCode() {
  try { return sessionStorage.getItem(PENDING_CODE_KEY) || ''; }
  catch { return ''; }
}

/** Drop the stashed code (called once checkout has consumed it). */
export function clearPendingRedeemCode() {
  try { sessionStorage.removeItem(PENDING_CODE_KEY); }
  catch { /* ignore */ }
}

// ── Read-only redeem-code validator ─────────────────────────────────────────

/**
 * Ask the server whether a redeem code is live for THIS caller. Anti-
 * enumeration by design: unknown / inactive / expired / exhausted all read
 * `invalid_code`; only the caller's own prior redemption reads `already_used`.
 *
 * @param {string} code — matched exactly server-side (case preserved).
 * @returns {Promise<{ valid: boolean, kind: 'free_month'|'credits'|null,
 *   reason: null|'invalid_code'|'already_used'|'account_inactive'|'not_configured' }>}
 * @throws on transport failure — callers show a "try once more" note.
 */
export async function validateRedeemCode(code) {
  if (!isConfigured) return { valid: false, kind: null, reason: 'not_configured' };
  const trimmed = typeof code === 'string' ? code.trim() : '';
  if (!trimmed) return { valid: false, kind: null, reason: 'invalid_code' };

  const { data, error } = await supabase.rpc('validate_redeem_code', { p_code: trimmed });
  if (error) throw error;
  return {
    valid:  Boolean(data?.valid),
    kind:   data?.kind ?? null,
    reason: data?.reason ?? null,
  };
}

// ── Referral intent ─────────────────────────────────────────────────────────

/**
 * Record "this signed-in user was referred by the holder of that account
 * number". Creates a PENDING referral row; the reward is granted (or not)
 * entirely server-side when the first real payment lands. A rejection here
 * must never block a purchase — callers surface the reason as a note and
 * carry on.
 *
 * @param {string} accountNumber — the referrer's `SF-XXXXXXX` handle; the RPC
 *   normalizes with upper(btrim()) so case/whitespace are forgiven.
 * @returns {Promise<{ ok: boolean, reason: string|null, referralId: string|null }>}
 * @throws on transport failure.
 */
export async function recordReferralIntent(accountNumber) {
  if (!isConfigured) return { ok: false, reason: 'not_configured', referralId: null };
  const value = typeof accountNumber === 'string' ? accountNumber.trim() : '';
  if (!value) return { ok: false, reason: 'unknown_account_number', referralId: null };

  const { data, error } = await supabase.rpc('record_referral_intent', { p_referrer_account_number: value });
  if (error) throw error;
  return {
    ok:         Boolean(data?.ok),
    reason:     data?.reason ?? null,
    referralId: data?.referral_id ?? null,
  };
}

/**
 * Has this user already been referred (any status)? Drives the "Referred by
 * someone?" field's visibility: a user with ANY prior referral row never sees
 * it again — the seat is spent (or pending) and re-asking would only produce
 * an `already_referred` rejection.
 *
 * RLS (107) lets a user SELECT referral rows they are party to, so this reads
 * the table directly rather than burning an RPC round-trip.
 *
 * @param {string} userId
 * @returns {Promise<boolean>}
 * @throws on transport failure — callers hide the field (fail-quiet).
 */
export async function hasPriorReferral(userId) {
  if (!isConfigured || !userId) return false;
  const { data, error } = await supabase.from('referrals').select('id').eq('referee_user_id', userId).limit(1);
  if (error) throw error;
  return Array.isArray(data) && data.length > 0;
}
