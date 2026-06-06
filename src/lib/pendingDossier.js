/**
 * pendingDossier.js — Stash an anonymous settlement across a Stripe round-trip.
 *
 * The single-dossier flow is:
 *   1. Anonymous user generates a settlement on the homepage hero.
 *   2. They click "Buy this dossier" ($2.99). Before redirecting to
 *      Stripe, we stash the in-memory settlement to localStorage.
 *   3. Stripe collects payment + email, then redirects back to our
 *      site with `?checkout=success&product=single_dossier&session_id=...`.
 *   4. The success page pulls the stash back out, renders the dossier,
 *      and offers a PDF download.
 *
 * Without this stash, the unsaved settlement disappears across the
 * full-page navigation to Stripe and the user gets a paid receipt for
 * an empty dossier — the worst possible failure mode.
 *
 * Storage shape:
 *   { settlement, checkoutToken, stashedAt, sessionId? }
 *
 * Sessions older than 1 hour are treated as stale and cleared on read.
 * That's enough time for a normal Stripe checkout, and short enough
 * that a re-loaded tab from yesterday doesn't surprise the user with
 * an old dossier.
 */

const KEY = 'sf.pendingDossier';
const TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Stash the current settlement for retrieval after Stripe checkout.
 * Returns true on success, false if storage is unavailable.
 */
export function createDossierCheckoutToken() {
  const webCrypto = globalThis.crypto;
  if (typeof webCrypto?.randomUUID === 'function') {
    return webCrypto.randomUUID();
  }
  if (typeof webCrypto?.getRandomValues !== 'function') {
    throw new Error('Secure checkout is not available in this browser.');
  }
  const bytes = new Uint8Array(24);
  webCrypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function stashPendingDossier(settlement, checkoutToken, sessionId = null) {
  if (!settlement) return false;
  if (typeof checkoutToken !== 'string' || checkoutToken.length < 24) return false;
  if (typeof window === 'undefined') return false;
  try {
    const payload = {
      settlement,
      checkoutToken,
      sessionId,
      stashedAt: Date.now(),
    };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false; // private mode or quota — caller can decide how to recover
  }
}

/**
 * Retrieve a stashed dossier, or null. Clears stale entries
 * (>TTL_MS old) as a side effect.
 */
export function readPendingDossier() {
  if (typeof window === 'undefined') return null;
  let raw;
  try { raw = window.localStorage.getItem(KEY); } catch { return null; }
  if (!raw) return null;

  let parsed;
  try { parsed = JSON.parse(raw); } catch { clearPendingDossier(); return null; }

  if (
    !parsed
    || !parsed.settlement
    || typeof parsed.checkoutToken !== 'string'
    || parsed.checkoutToken.length < 24
    || typeof parsed.stashedAt !== 'number'
  ) {
    clearPendingDossier();
    return null;
  }
  if (Date.now() - parsed.stashedAt > TTL_MS) {
    clearPendingDossier();
    return null;
  }
  return parsed;
}

/** Bind Stripe's returned session ID to the existing one-time dossier stash. */
export function attachPendingDossierCheckout(sessionId) {
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) return false;
  const pending = readPendingDossier();
  if (!pending) return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...pending, sessionId }));
    return true;
  } catch {
    return false;
  }
}

/** Clear the stash (e.g., after the user has downloaded their PDF). */
export function clearPendingDossier() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
}
