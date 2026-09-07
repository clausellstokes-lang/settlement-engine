/**
 * dossierClaimStash.js — the same-device retro auto-upgrade voucher (migration
 * 108).
 *
 * PRODUCT RULE (user-locked, SAME-DEVICE + SAME-SETTLEMENT + AUTOMATIC only):
 *   When an ANONYMOUS buyer pays $2.99 for a one-time dossier download and LATER,
 *   on the SAME browser, creates an account and saves THAT SAME settlement, its
 *   durable re-download right attaches automatically. There is no cross-device
 *   claim, no email matching, no user-facing claim UI. If this stash is gone
 *   (cleared browser, different device), the one-shot stays a one-shot.
 *
 * This stash is SEPARATE from pendingDossier.js on purpose:
 *   · pendingDossier holds the whole settlement across the Stripe round-trip and
 *     is CLEARED once the buyer downloads their PDF.
 *   · this claim stash must SURVIVE that download so a sign-up minutes or hours
 *     later can still find the purchase proof. It stores only the small proof
 *     material (token + session id) plus a stable identifier of the purchased
 *     settlement, never the whole dossier.
 *
 * Shape (versioned key):
 *   { checkoutToken, sessionId?, settlementId, settlementName, purchasedAt }
 *
 * `settlementId` is the settlement's stable `_seed` (the deterministic
 * generation seed the pipeline attaches to every settlement); `settlementName`
 * is a human fallback used only when a seed is somehow absent. The silent
 * post-save hook matches a freshly saved settlement against these before it ever
 * calls the claim endpoint, so a non-matching save never fires a claim.
 *
 * Stored on a VERSIONED key so a future shape change can be introduced without
 * mis-reading an old blob (an unknown version reads as absent and is cleared).
 */

const KEY = 'sf.dossierClaim.v1';
// Long enough that a buyer can pay today and sign up tomorrow, but bounded so a
// stale voucher on a shared machine cannot linger indefinitely.
const TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

/** Derive the stable identifier of a settlement (the generation seed). */
export function settlementIdentity(settlement) {
  if (!settlement || typeof settlement !== 'object') return { settlementId: null, settlementName: null };
  const seed = settlement._seed;
  return {
    settlementId: typeof seed === 'string' && seed ? seed : (typeof seed === 'number' ? String(seed) : null),
    settlementName: typeof settlement.name === 'string' && settlement.name ? settlement.name : null,
  };
}

/**
 * Record a retro-claim voucher for an anonymous one-time purchase, keyed to the
 * purchased settlement. Called at checkout time (before the Stripe redirect), so
 * the session id is not known yet — it is bound later by attachDossierClaimSession
 * on the success page.
 *
 * @param {{ settlement: object, checkoutToken: string }} args
 * @returns {boolean} true when stored.
 */
export function stashDossierClaim({ settlement, checkoutToken }) {
  if (typeof window === 'undefined') return false;
  if (typeof checkoutToken !== 'string' || checkoutToken.length < 24) return false;
  const { settlementId, settlementName } = settlementIdentity(settlement);
  // Nothing to match on later — do not stash a voucher we could never resolve.
  if (!settlementId && !settlementName) return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({
      checkoutToken,
      sessionId: null,
      settlementId,
      settlementName,
      purchasedAt: Date.now(),
    }));
    return true;
  } catch {
    return false; // private mode / quota — the one-shot still works, just no auto-upgrade
  }
}

/**
 * Read the claim voucher, or null. Clears stale (>TTL) or malformed entries as a
 * side effect.
 * @returns {{ checkoutToken: string, sessionId: string|null, settlementId: string|null, settlementName: string|null, purchasedAt: number }|null}
 */
export function readDossierClaim() {
  if (typeof window === 'undefined') return null;
  let raw;
  try { raw = window.localStorage.getItem(KEY); } catch { return null; }
  if (!raw) return null;

  let parsed;
  try { parsed = JSON.parse(raw); } catch { clearDossierClaim(); return null; }

  if (
    !parsed
    || typeof parsed.checkoutToken !== 'string'
    || parsed.checkoutToken.length < 24
    || typeof parsed.purchasedAt !== 'number'
    || (!parsed.settlementId && !parsed.settlementName)
  ) {
    clearDossierClaim();
    return null;
  }
  if (Date.now() - parsed.purchasedAt > TTL_MS) {
    clearDossierClaim();
    return null;
  }
  return parsed;
}

/**
 * Bind the Stripe session id to the existing claim voucher (called on the
 * success page, where the id arrives in the URL). Without a session id the
 * voucher can never be claimed, so this is the step that arms it.
 * @param {string} sessionId
 * @returns {boolean}
 */
export function attachDossierClaimSession(sessionId) {
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) return false;
  const voucher = readDossierClaim();
  if (!voucher) return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...voucher, sessionId }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Whether a just-saved settlement matches the stashed voucher's purchased
 * settlement. Same-settlement means same generation seed; the name is a fallback
 * only when neither side carries a seed.
 * @param {object} settlement
 * @param {{ settlementId: string|null, settlementName: string|null }} voucher
 * @returns {boolean}
 */
export function claimMatchesSettlement(settlement, voucher) {
  if (!settlement || !voucher) return false;
  const { settlementId, settlementName } = settlementIdentity(settlement);
  if (voucher.settlementId && settlementId) {
    return voucher.settlementId === settlementId;
  }
  // Seed-less fallback: match on name only when NEITHER side has a seed, so a
  // seed mismatch can never be papered over by a coincidental name collision.
  if (!voucher.settlementId && !settlementId && voucher.settlementName && settlementName) {
    return voucher.settlementName === settlementName;
  }
  return false;
}

/** Clear the voucher (on successful claim, or 'already claimed'). */
export function clearDossierClaim() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
}
