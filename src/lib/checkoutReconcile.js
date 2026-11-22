/**
 * checkoutReconcile.js — Post-Stripe-return entitlement reconciliation (F23).
 *
 * The browser must NOT declare a purchase successful from the `?checkout=success`
 * URL alone: that param is attacker-spoofable, and — more importantly for a
 * legitimate buyer — it RACES the Stripe webhook that actually grants the
 * entitlement (credits / premium tier). The old App code toasted "Credits
 * added!" from the URL and fired exactly two balance fetches, so a buyer whose
 * webhook lagged saw success while every tier gate still treated them as free,
 * and a permanently-failed webhook left the client silent forever.
 *
 * This module (a) confirms the session server-side, then (b) POLLS the real
 * entitlement with backoff until it lands, and reports one honest outcome:
 *   - SUCCESS    — entitlement confirmed (toast success)
 *   - PROCESSING — paid/verified but the grant hasn't landed within the window
 *                  (show a persistent "processing, refresh in a minute" notice
 *                   with a session reference — NOT a false success)
 *   - FAILED     — the server says this is not a genuine paid purchase for this
 *                  user (show the terminal support card)
 *
 * It is deliberately dependency-injected and side-effect-free beyond the
 * callbacks it's handed, so App.jsx stays a thin caller and the state machine is
 * unit-testable without a browser, network, or timers.
 */

export const OUTCOME = Object.freeze({
  SUCCESS: 'success',
  PROCESSING: 'processing',
  FAILED: 'failed',
});

export function isCreditProduct(product) {
  return typeof product === 'string' && /^credits_/.test(product);
}

export function isPremiumProduct(product) {
  return product === 'premium' || product === 'founder_lifetime';
}

const DEFAULT_ATTEMPTS = 5;
const DEFAULT_BASE_DELAY_MS = 900;

/**
 * Reconcile a returned checkout against the real entitlement.
 *
 * @param {{ product?: string, sessionId?: string }} result — parsed from the URL.
 * @param {object} deps
 * @param {(sessionId: string) => Promise<{verified:boolean, product?:string, status?:string}>} deps.verifySession
 *        Server confirmation; may throw an Error with `.transient` set.
 * @param {() => Promise<number>} [deps.fetchCreditBalance]
 * @param {() => Promise<string>}  [deps.fetchTier]
 * @param {number} [deps.baselineBalance]  Credit balance captured before polling.
 * @param {(n: number) => void} [deps.onCreditBalance]  Applied on every fresh read.
 * @param {() => (void|Promise<void>)} [deps.onEntitlement]  Fired once on SUCCESS.
 * @param {number} [deps.attempts]
 * @param {number} [deps.baseDelayMs]
 * @param {(ms: number) => Promise<void>} [deps.sleep]
 * @returns {Promise<{outcome:string, product?:string, sessionId?:string}>}
 */
export async function reconcileCheckout(result, deps) {
  const {
    verifySession,
    fetchCreditBalance,
    fetchTier,
    baselineBalance = 0,
    onCreditBalance,
    onEntitlement,
    attempts = DEFAULT_ATTEMPTS,
    baseDelayMs = DEFAULT_BASE_DELAY_MS,
    sleep = ms => new Promise(r => setTimeout(r, ms)),
  } = deps || {};

  const product = result?.product;
  const sessionId = result?.sessionId;
  const credit = isCreditProduct(product);
  const premium = isPremiumProduct(product);

  // 1. Server-side verification. A definitive "not your paid session" is
  //    terminal; a transient failure (429/5xx/network) is NOT — we still poll
  //    the entitlement, which is the ground truth.
  /** @type {{verified: boolean, product?: string, status?: string, transient?: boolean}} */
  let verify;
  if (typeof sessionId === 'string' && sessionId && typeof verifySession === 'function') {
    try {
      verify = await verifySession(sessionId);
    } catch (e) {
      verify = { verified: false, transient: !!(e && e.transient) };
    }
  } else {
    // No session id to verify (shouldn't happen for a real Stripe return).
    verify = { verified: false, transient: true };
  }
  if (verify && verify.verified === false && !verify.transient) {
    return { outcome: OUTCOME.FAILED, product, sessionId };
  }

  const succeed = async () => {
    try { await onEntitlement?.(); } catch { /* refresh best-effort */ }
    return { outcome: OUTCOME.SUCCESS, product, sessionId };
  };

  // 2. Poll the actual entitlement with linear backoff.
  for (let i = 0; i < attempts; i++) {
    await sleep(baseDelayMs * (i + 1));
    try {
      if (credit && typeof fetchCreditBalance === 'function') {
        const bal = await fetchCreditBalance();
        if (typeof bal === 'number') {
          onCreditBalance?.(bal);
          if (bal > baselineBalance) return await succeed();
        }
      } else if (premium && typeof fetchTier === 'function') {
        const tier = await fetchTier();
        if (tier === 'premium') return await succeed();
      } else if (verify?.verified) {
        // Unknown/other product: a verified paid session is success enough.
        return await succeed();
      }
    } catch {
      // Transient read error — keep polling.
    }
  }

  // 3. Timed out. For credits, a server-verified paid session means the money is
  //    real and the balance already reflects it (or will, idempotently) — that's
  //    SUCCESS even if it didn't exceed a baseline captured after a fast webhook.
  //    For premium the TIER GATE is what matters; if it hasn't flipped we must
  //    NOT claim success — report PROCESSING so the UI stays honest.
  if (credit && verify?.verified) return await succeed();
  return { outcome: OUTCOME.PROCESSING, product, sessionId };
}
