/**
 * lib/founderSeats.js - Tier 7.6 live seat counter.
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
 * Caching: each call hits the network. The pricing page mounts once
 * per visit, so this is fine. If the surface is added to the
 * homepage hero, switch to a 5-minute in-memory cache.
 *
 * Failure mode: any error returns null. The pricing page hides the
 * counter line when null so a transient backend hiccup doesn't break
 * the page.
 */

import { supabase, isConfigured } from './supabase.js';

/**
 * Cap from the Founder Lifetime SKU contract. Mirrors the copy in
 * src/copy/en.js#seatsRemaining and the contract in
 * docs/abuse-model.md.
 */
export const FOUNDER_SEAT_CAP = 500;

/**
 * Returns the current taken-seat count.
 *
 * @returns {Promise<number | null>}  null on any error / not-configured.
 */
export async function fetchFounderSeatsTaken() {
  if (!isConfigured) return null;
  try {
    const { data, error } = await supabase.rpc('founder_seats_taken');
    if (error) {
      console.warn('[founderSeats] RPC error', error);
      return null;
    }
    const n = Number(data);
    if (!Number.isFinite(n) || n < 0) return null;
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
