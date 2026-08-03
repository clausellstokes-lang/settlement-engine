/**
 * lib/founderLineage.js — the public Founder seat-lineage read for the /founders page.
 *
 * Companion to lib/founderSeats.js (which counts taken seats for the pricing page).
 * This module fetches the PUBLIC lineage projection — seat number, the holder's
 * opted-in display name, held-since, prior opted names, and an opt-in gallery link —
 * via the `list_founder_seats_public()` RPC drafted in migration 137.
 *
 * FAIL-CLOSED, by design and by deploy-state. The 137 migration is a DRAFT that is
 * written-not-applied (awaiting owner sign-off), so the RPC does not exist in prod
 * yet. Any error — not-configured, missing RPC, transient hiccup — returns an EMPTY
 * lineage. The page then renders the dignified all-unclaimed pre-launch state from
 * its own 1..30 skeleton. Nothing about a holder is ever surfaced except what the
 * server projection already deemed public (opted-in + moderation-approved).
 *
 * ⚠️ ORPHANED 2026-08-03 — NO PRODUCT SURFACE READS THIS MODULE ANY MORE.
 * Its only consumer was components/founders/FoundersPage.jsx, the seat-LINEAGE
 * page of the transferable-seat design, which THE FOUNDERS' HALL superseded
 * (docs/DESIGN_FOUNDERS_HALL.md §1/§2: chairs are granted not sold, and bound to
 * one founder permanently, so a lineage of prior holders describes a mechanic
 * that no longer exists). The Hall reads lib/foundersHall.js instead.
 *
 * IT IS LEFT IN PLACE ON PURPOSE, NOT BY OVERSIGHT. Retiring it is part of the
 * §4 TRANSFER-MACHINERY RETIREMENT — migration 160's cases, the transfer flows,
 * founderLineage's transfer arcs — which the design orders as ITS OWN COMMIT
 * under the op-retirement cascade checklist (five frozen artifacts; every anchor
 * dry-run first). Deleting it here would have taken half of that cascade in a
 * commit that could not sweep the other half. tests/lib/founderLineage.test.js
 * keeps it honest until the retirement lands.
 *
 * Zero eager: nothing imports this module statically.
 */

import { supabase, isConfigured } from './supabase.js';
import { FOUNDER_SEAT_CAP } from './founderSeats.js';

/**
 * A single public seat row as the page consumes it.
 * @typedef {Object} FounderSeatPublic
 * @property {number}   seatId       1..cap
 * @property {string=}  displayName  the holder's opted-in, approved display name (absent ⇒ unclaimed/unnamed)
 * @property {string=}  gallerySlug  opt-in representative public gallery world slug (absent ⇒ no link)
 * @property {string=}  heldSince    ISO date the current holder took the seat
 * @property {string[]} priorNames   prior opted display names, most-recent-first
 */

/**
 * Fetch the public Founder lineage. Never throws; returns [] on any failure so the
 * page always renders (fail-closed to the all-unclaimed state).
 *
 * @returns {Promise<FounderSeatPublic[]>}
 */
export async function fetchFounderLineage() {
  if (!isConfigured) return [];
  try {
    const { data, error } = await supabase.rpc('list_founder_seats_public');
    if (error) {
      // Pre-deploy the RPC is absent; that is the expected pre-launch path, not an
      // incident. Log at debug volume and fall back to the empty (all-unclaimed) view.
      console.debug('[founderLineage] projection unavailable', error?.message ?? error);
      return [];
    }
    if (!Array.isArray(data)) return [];
    return data
      .map(normalizeRow)
      .filter((r) => r && Number.isInteger(r.seatId) && r.seatId >= 1 && r.seatId <= FOUNDER_SEAT_CAP);
  } catch (e) {
    console.debug('[founderLineage] unexpected error', e);
    return [];
  }
}

/** Map a raw RPC row (snake_case) to the page shape, dropping anything unexpected. */
function normalizeRow(row) {
  if (!row || typeof row !== 'object') return null;
  const seatId = Number(row.seat_id);
  if (!Number.isFinite(seatId)) return null;
  const displayName = cleanStr(row.display_name);
  const gallerySlug = cleanStr(row.gallery_slug);
  const heldSince = cleanStr(row.held_since);
  const priorNames = Array.isArray(row.prior_names)
    ? row.prior_names.map(cleanStr).filter(Boolean)
    : [];
  return {
    seatId,
    ...(displayName ? { displayName } : {}),
    ...(gallerySlug ? { gallerySlug } : {}),
    ...(heldSince ? { heldSince } : {}),
    priorNames,
  };
}

/** Trim to a non-empty string, or return null. */
function cleanStr(v) {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length ? t : null;
}

/**
 * Build the full 1..cap seat skeleton and overlay any live lineage rows onto it, so
 * the page renders all `cap` seats whether or not the backend has data yet. Seats with
 * no live row (or no opted-in holder) render as unclaimed.
 *
 * @param {FounderSeatPublic[]} lineage
 * @param {number} [cap]
 * @returns {FounderSeatPublic[]} exactly `cap` rows, seat 1..cap ascending
 */
export function buildSeatLineage(lineage, cap = FOUNDER_SEAT_CAP) {
  const byId = new Map();
  for (const row of lineage || []) {
    if (row && Number.isInteger(row.seatId)) byId.set(row.seatId, row);
  }
  const out = [];
  for (let seatId = 1; seatId <= cap; seatId += 1) {
    out.push(byId.get(seatId) || { seatId, priorNames: [] });
  }
  return out;
}

/** A seat is "held" when the projection surfaced an opted-in display name for it. */
export function isSeatHeld(seat) {
  return Boolean(seat && seat.displayName);
}
