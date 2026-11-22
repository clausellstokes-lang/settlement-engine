/**
 * lib/founderSeats.js — Tier 7.6 live seat counter.
 *
 * Reads the public `founder_seats_taken()` RPC introduced by migration
 * 010. Returns the number of remaining seats out of FOUNDER_SEAT_CAP.
 *
 * Why a separate module:
 *   The pricing page mounts before the user is signed in, so the
 *   read must happen via the anon client. Centralizing here means a
 *   future change (caching, batching with other unauth reads) lives
 *   in one place rather than scattered across components.
 *
 * Caching: a 5-minute in-memory cache (below). The landing tier strip and
 * the pricing page both read this; the count moves slowly, and the landing
 * is high-traffic, so a fetch on every mount would be wasteful.
 *
 * Failure mode: any error returns null. The pricing page hides the
 * counter line when null so a transient backend hiccup doesn't break
 * the page.
 */

import { supabase, isConfigured } from './supabase.js';

/**
 * How many chairs the Founders' Hall holds. It is NOT a sale cap: no chair has
 * ever been sold (ODQ §118) and create-checkout refuses `founder_lifetime`
 * outright, so the server-side seat gate that used to mirror this number is
 * gone. The remaining homes are TIERS.founder.seatLimit and tierFacts'
 * FOUNDER_SEATS, and tests/config/tierFacts.contract.test.js pins them equal.
 */
export const FOUNDER_SEAT_CAP = 30;

// 5-minute in-memory cache of the successful taken-count (see module note).
let _seatCache = null; // { at: epochMs, value: number }
const SEAT_CACHE_MS = 5 * 60 * 1000;

/**
 * Returns the current taken-seat count.
 *
 * @returns {Promise<number | null>}  null on any error / not-configured.
 */
export async function fetchFounderSeatsTaken() {
  if (!isConfigured) return null;
  if (_seatCache && (Date.now() - _seatCache.at) < SEAT_CACHE_MS) return _seatCache.value;
  try {
    const { data, error } = await supabase.rpc('founder_seats_taken');
    if (error) {
      console.warn('[founderSeats] RPC error', error);
      return null;
    }
    const n = Number(data);
    if (!Number.isFinite(n) || n < 0) return null;
    _seatCache = { at: Date.now(), value: n };  // cache only successful reads
    return n;
  } catch (e) {
    console.warn('[founderSeats] unexpected error', e);
    return null;
  }
}

/**
 * Convenience: returns the remaining seats. Clamps to [0, cap].
 *
 * @returns {Promise<number | null>}
 */
export async function fetchFounderSeatsRemaining(cap = FOUNDER_SEAT_CAP) {
  const taken = await fetchFounderSeatsTaken();
  if (taken == null) return null;
  return Math.max(0, Math.min(cap, cap - taken));
}
