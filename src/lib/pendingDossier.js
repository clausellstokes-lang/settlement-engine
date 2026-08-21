/**
 * pendingDossier.js — Stash anonymous settlements across a Stripe round-trip.
 *
 * The single-dossier flow is:
 *   1. Anonymous user generates a settlement on the homepage hero.
 *   2. They click "Buy this dossier" ($2.99). Before redirecting to
 *      Stripe, we stash the in-memory settlement to localStorage AND
 *      (server-side) into dossier_purchases via create-checkout.
 *   3. Stripe collects payment + email, then redirects back with
 *      `?checkout=success&product=single_dossier&session_id=…&dt=<token>`.
 *   4. The success page verifies the paid session and renders the dossier —
 *      preferring the server-returned settlement, with this stash as fallback.
 *
 * Why a KEYED MAP, not one slot (findings F21):
 *   The old single-slot store stranded buyers three ways —
 *     (a) a second "Buy" click OVERWROTE the first (paid) stash + token, so the
 *         first, already-paid session could never be matched back to its dossier;
 *     (b) a >24h TTL purge on read DELETED a paid-but-not-yet-downloaded stash;
 *     (c) a cancelled checkout reloaded into an app that had lost the artifact.
 *   This module keys every stash by its one-time checkoutToken (so concurrent
 *   purchases never collide), NEVER TTL-purges a PAID stash (one whose sessionId
 *   is set — payment is proven, the dossier is owed), and LRU-evicts only
 *   UNPAID stashes when the small cap is reached.
 *
 * Storage shape (v2):
 *   { v: 2, entries: { [checkoutToken]: { settlement, checkoutToken, sessionId, stashedAt } } }
 *
 * A stash is "paid" once its sessionId is bound (Stripe returned). Unpaid
 * stashes older than the TTL are treated as stale and cleared on read; the TTL
 * must be at least as long as a Stripe Checkout session lives (~24h).
 */

const KEY = 'sf.pendingDossier';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours — matches Stripe's session lifetime
const MAX_ENTRIES = 5;              // small cap; unpaid entries are LRU-evicted

/**
 * Create a one-time, high-entropy checkout token. Returns a hex/UUID string
 * of at least 24 chars (the server + stash both require that length).
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

function isPaid(entry) {
  return typeof entry?.sessionId === 'string' && entry.sessionId.startsWith('cs_');
}

function isValidEntry(entry) {
  return !!entry
    && entry.settlement
    && typeof entry.checkoutToken === 'string'
    && entry.checkoutToken.length >= 24
    && typeof entry.stashedAt === 'number';
}

function isExpiredUnpaid(entry) {
  return !isPaid(entry) && (Date.now() - entry.stashedAt > TTL_MS);
}

/** Read + normalize the store, migrating the legacy single-object shape. */
function readStore() {
  if (typeof window === 'undefined') return { entries: {} };
  let raw;
  try { raw = window.localStorage.getItem(KEY); } catch { return { entries: {} }; }
  if (!raw) return { entries: {} };

  let parsed;
  try { parsed = JSON.parse(raw); } catch { return { entries: {} }; }

  if (parsed && parsed.entries && typeof parsed.entries === 'object') {
    return { entries: { ...parsed.entries } };
  }
  // Legacy v1: a single { settlement, checkoutToken, sessionId, stashedAt }.
  if (parsed && parsed.settlement && typeof parsed.checkoutToken === 'string') {
    return {
      entries: {
        [parsed.checkoutToken]: {
          settlement: parsed.settlement,
          checkoutToken: parsed.checkoutToken,
          sessionId: parsed.sessionId ?? null,
          stashedAt: typeof parsed.stashedAt === 'number' ? parsed.stashedAt : Date.now(),
        },
      },
    };
  }
  return { entries: {} };
}

/** Persist the store, removing the key entirely when empty. Returns success. */
function writeStore(store) {
  if (typeof window === 'undefined') return false;
  try {
    if (!store.entries || Object.keys(store.entries).length === 0) {
      window.localStorage.removeItem(KEY);
      return true;
    }
    window.localStorage.setItem(KEY, JSON.stringify({ v: 2, entries: store.entries }));
    return true;
  } catch {
    return false; // private mode or quota — caller can decide how to recover
  }
}

/** Drop malformed entries and expired UNPAID entries. Returns true if changed. */
function pruneStale(store) {
  let changed = false;
  for (const [token, entry] of Object.entries(store.entries)) {
    if (!isValidEntry(entry) || isExpiredUnpaid(entry)) {
      delete store.entries[token];
      changed = true;
    }
  }
  return changed;
}

function mostRecent(entries) {
  const list = Object.values(entries).filter(isValidEntry).sort((a, b) => b.stashedAt - a.stashedAt);
  return list[0] || null;
}

/**
 * Stash a settlement keyed by its checkoutToken. When the cap is reached, only
 * UNPAID stashes are evicted (oldest first) — a paid stash is never dropped.
 * Returns true on success, false if inputs are invalid or storage is unavailable.
 */
export function stashPendingDossier(settlement, checkoutToken, sessionId = null) {
  if (!settlement) return false;
  if (typeof checkoutToken !== 'string' || checkoutToken.length < 24) return false;
  if (typeof window === 'undefined') return false;

  const store = readStore();
  pruneStale(store);

  const isNew = !store.entries[checkoutToken];
  if (isNew && Object.keys(store.entries).length >= MAX_ENTRIES) {
    const unpaidOldestFirst = Object.values(store.entries)
      .filter(e => !isPaid(e))
      .sort((a, b) => a.stashedAt - b.stashedAt);
    while (Object.keys(store.entries).length >= MAX_ENTRIES && unpaidOldestFirst.length) {
      const victim = unpaidOldestFirst.shift();
      delete store.entries[victim.checkoutToken];
    }
  }

  store.entries[checkoutToken] = {
    settlement,
    checkoutToken,
    sessionId: (typeof sessionId === 'string' && sessionId) ? sessionId : null,
    stashedAt: Date.now(),
  };
  return writeStore(store);
}

/**
 * Retrieve the stash for a specific checkoutToken, or null. Expires an UNPAID
 * stash past the TTL on read; a PAID stash is returned regardless of age.
 */
export function readPendingDossierByToken(token) {
  if (typeof window === 'undefined') return null;
  if (typeof token !== 'string' || !token) return null;
  const store = readStore();
  const entry = store.entries[token];
  if (!isValidEntry(entry)) return null;
  if (isExpiredUnpaid(entry)) {
    delete store.entries[token];
    writeStore(store);
    return null;
  }
  return { ...entry };
}

/**
 * The most-recently stashed restorable dossier (paid or unpaid-within-TTL), or
 * null. Used for the generic "current pending dossier" read and for
 * restore-on-cancel. Clears stale UNPAID entries as a side effect.
 */
export function readPendingDossier() {
  if (typeof window === 'undefined') return null;
  const store = readStore();
  if (pruneStale(store)) writeStore(store);
  const entry = mostRecent(store.entries);
  return entry ? { ...entry } : null;
}

/** Alias with an intention-revealing name for the restore-on-cancel path. */
export function readRestorablePendingDossier() {
  return readPendingDossier();
}

/**
 * Bind Stripe's returned session ID to a stash, marking it PAID (and thus
 * TTL-immune). Targets the given `token` when supplied; otherwise the most-recent
 * UNPAID stash (back-compat for the single-purchase flow). Returns success.
 */
export function attachPendingDossierCheckout(sessionId, token = null) {
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) return false;
  const store = readStore();
  pruneStale(store);

  let target = null;
  if (token && store.entries[token]) {
    target = store.entries[token];
  } else if (!token) {
    const unpaidNewestFirst = Object.values(store.entries)
      .filter(e => !isPaid(e))
      .sort((a, b) => b.stashedAt - a.stashedAt);
    target = unpaidNewestFirst[0] || null;
  }
  if (!target) return false;
  target.sessionId = sessionId;
  return writeStore(store);
}

/**
 * Clear a stash. With a `token`, removes just that entry (e.g. after its PDF is
 * downloaded); with no argument, clears ALL stashes (full reset).
 */
export function clearPendingDossier(token = null) {
  if (typeof window === 'undefined') return;
  if (token == null) {
    try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
    return;
  }
  const store = readStore();
  if (store.entries[token]) {
    delete store.entries[token];
    writeStore(store);
  }
}
