/**
 * lib/founderTransferClient.js — the account Seat-transfer panel's data layer
 * (DESIGN_MONEY_WAVE §6.3/§6.4, slice M-6f). Every call routes through the
 * `founder-transfer` edge function (the DB state machine is service-role only —
 * the client never touches founder_transfer_* tables directly), so the master
 * switch, the single-session gate, and 125-velocity all apply per request.
 *
 * READS fail closed and never throw (the founderLineage / autoReloadClient idiom):
 * the whole flow is KEY-INERT until the owner flips 'founder_transfers'.enabled, so
 * pre-launch `fetchTransferStatus()` returns { cases: [], available:false } and the
 * panel renders the §12 "coming under the published terms" line instead of controls.
 * WRITES throw a coded Error (the recovery idiom) so the panel can branch on the
 * server's stable {error, reason} without knowing transport details.
 *
 * ZERO EAGER: imported LAZILY from the (already-lazy) account panel.
 */
import { supabase, isConfigured } from './supabase.js';

const FN = 'founder-transfer';

/** supabase.functions.invoke surfaces a non-2xx as `error` with the JSON body on
 *  error.context; normalize to the server's { error, reason } shape (else null). */
async function readInvokeError(error) {
  try {
    const body = await error?.context?.json?.();
    if (body && typeof body === 'object') return body;
  } catch {
    // No JSON body (network error / opaque response) — fall through to status.
  }
  const status = error?.context?.status;
  if (status === 429) return { error: 'rate_limited' };
  if (status === 503) return { error: 'feature_unavailable' };
  return null;
}

/** A throwing action call: returns the ok body, or throws a coded Error. */
async function callAction(action, extra = {}, fallbackMsg = 'The transfer request could not be completed.') {
  if (!isConfigured) {
    const err = new Error('Transfers are not configured in this environment.');
    err.code = 'feature_unavailable';
    throw err;
  }
  const { data, error } = await supabase.functions.invoke(FN, { body: { action, ...extra } });
  if (error) {
    const body = await readInvokeError(error);
    const err = new Error(body?.reason || body?.error || fallbackMsg);
    err.code = body?.error || 'request_failed';
    err.reason = body?.reason || null;
    throw err;
  }
  return data || {};
}

/**
 * Read the caller's live/recent transfer cases (the my_transfer_case_status
 * projection). NEVER throws. `available:false` means the feature is dark (master
 * switch off / unconfigured / errored) — the panel then shows the promise line.
 * @returns {Promise<{ cases: Array<object>, available: boolean }>}
 */
export async function fetchTransferStatus() {
  if (!isConfigured) return { cases: [], available: false };
  try {
    const { data, error } = await supabase.functions.invoke(FN, { body: { action: 'status' } });
    // Any error (master switch off, unconfigured, outage) → dark: the panel shows
    // the §12 promise line instead of controls. No error branching needed.
    if (error) return { cases: [], available: false };
    return { cases: Array.isArray(data?.cases) ? data.cases : [], available: true };
  } catch {
    return { cases: [], available: false };
  }
}

/** Outgoing: anomaly-checked open + emailed 'initiate' code. @returns {{case_id}} */
export function initiateTransfer({ toEmail, payoutForm }) {
  return callAction('initiate', { to_email: toEmail, payout_form: payoutForm });
}

/** Outgoing: verify the initiate code → the nominee is emailed their invitation. */
export function confirmInitiate({ caseId, code }) {
  return callAction('confirm_initiate', { case_id: caseId, code });
}

/** Incoming: find the confirmed invitation for this account → emailed verify code. */
export function nomineeAcceptStart() {
  return callAction('nominee_accept_start', {});
}

/** Incoming: verify → bind → the case-bound Stripe checkout session. @returns {{url}} */
export function nomineeConfirm({ caseId, code }) {
  return callAction('nominee_confirm', { case_id: caseId, code });
}

/** Either party: abort by authed session, or by the session-independent email token. */
export function abortTransfer({ caseId, token }) {
  return callAction('abort', token ? { case_id: caseId, token } : { case_id: caseId });
}

/** Outgoing: re-open a parked ('held') cash election to account credits. */
export function reelectPayout({ caseId }) {
  return callAction('reelect_payout', { case_id: caseId });
}

/** Outgoing: start Stripe Connect Express onboarding for a cash payout. @returns {{url}} */
export function payoutOnboarding() {
  return callAction('payout_onboarding', {});
}
