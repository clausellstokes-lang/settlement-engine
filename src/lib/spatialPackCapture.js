/**
 * spatialPackCapture.js — the LIVE, read-only pack.cells capture (Phase 5.5
 * MODULATION, ITEM 0: the keystone's deferred live seam, now wired).
 *
 * The keystone froze its digest against INJECTED fixture packs; this is its first
 * real consumer, so it wires the one-shot READ-ONLY capture from the mounted FMG
 * iframe. At an entitled spatial canonize the store calls captureSpatialPack; we:
 *   1. reach the live map bridge (spatialCaptureRegistry — the World Map registers
 *      it on mount);
 *   2. do a READ-ONLY RPC (`getSpatialPack`) that copies the terrain cell arrays
 *      out of the iframe — it MUTATES NOTHING (the pure digest builder runs here,
 *      parent-side, never over the bridge);
 *   3. read the campaign's placements (settlementId → cellId) from map state;
 *   4. hand { pack, placements } to the pure keystone extractor (buildSpatialDigest,
 *      called by the store) — we do NOT re-implement extraction.
 *
 * EXTRACTION-DETERMINISM (the brief's open question): the pack is STATIC in iframe
 * memory once the map is generated, so two reads are byte-identical. We capture
 * TWICE and compare as runtime evidence; the FREEZE-FIRST ruling holds regardless
 * (the digest is authored once at canonize and never recomputed — the keystone
 * invariant), so even a hypothetical mismatch canonizes the FIRST capture.
 *
 * Lazy-only (imported solely from the dynamically-loaded campaignSpatialCanonize
 * body) ⇒ zero first-paint weight. Tier-blind: the entitlement gate is upstream at
 * the store call site.
 */

import { getSpatialCaptureBridge } from './spatialCaptureRegistry.js';
import { findActiveCampaign } from '../store/campaignSliceShared.js';
import { magicLedger } from '../domain/magicLedger.js';

/**
 * The campaign's settlement placements as the digest builder consumes them:
 * [{ id: settlementId, cellId, institutions, magicExists }], scoped to the campaign's
 * settlements when known. The `institutions` roster (M8) is the port-eligibility
 * CAPABILITY read — the digest derives a port from geography ∧ a water-access
 * institution, so the roster travels WITH the placement. A settlement without a roster
 * row carries an empty list (never a port).
 *
 * MG-3a (leak L1): `magicExists` travels the same way — the digest's teleport bloc is
 * magic-gated, and the ONE authority on a settlement's magic is its own config
 * (MG-LAW-1), read through the canonical `magicLedger` accessor rather than a hand-rolled
 * config poke. Only an explicit false is stamped; an un-generated or magical settlement
 * carries no flag, so every existing canon re-derives byte-identically.
 * Read-only projection; no mutation of state.
 * @param {any} state @param {string} campaignId
 * @returns {Array<{id:string, cellId:number, institutions:any[], magicExists?:boolean}>}
 */
function placementsFor(state, campaignId) {
  const placements = state?.mapState?.placements || {};
  const campaign = findActiveCampaign(state?.campaigns, campaignId);
  const inRealm = Array.isArray(campaign?.settlementIds) && campaign.settlementIds.length
    ? new Set(campaign.settlementIds.map(String))
    : null;
  // Index each settlement's institution roster by settlement id (the M8 capability read)
  // and its magic truth (the MG-3a gate).
  const savedSettlements = Array.isArray(state?.savedSettlements) ? state.savedSettlements : [];
  /** @type {Map<string, any[]>} */
  const institutionsById = new Map();
  /** @type {Set<string>} */
  const mundaneIds = new Set();
  for (const s of savedSettlements) {
    const id = s?.id != null ? String(s.id) : '';
    if (!id) continue;
    const insts = s?.settlement?.institutions;
    if (Array.isArray(insts)) institutionsById.set(id, insts);
    // PRESENT-guarded: magicLedger's neutral default for an UN-GENERATED settlement is
    // itself magicExists:false, so an unguarded read would declare every config-less
    // legacy row mundane. Only a settlement that actually carries a magic axis AND
    // asserts magic absent is stamped.
    const ledger = magicLedger(s?.settlement);
    if (ledger.present && ledger.magicExists === false) mundaneIds.add(id);
  }
  /** @type {Array<{id:string, cellId:number, institutions:any[], magicExists?:boolean}>} */
  const out = [];
  for (const burgId of Object.keys(placements).sort()) {
    const pl = placements[burgId];
    const id = pl?.settlementId != null ? String(pl.settlementId) : '';
    const cellId = Number(pl?.cellId);
    if (!id || !Number.isInteger(cellId)) continue;
    if (inRealm && !inRealm.has(id)) continue; // scope the digest to THIS realm's settlements
    const row = /** @type {{id:string, cellId:number, institutions:any[], magicExists?:boolean}} */ (
      { id, cellId, institutions: institutionsById.get(id) || [] });
    // Additive ONLY when magic is asserted absent — an unstamped row keeps the exact
    // pre-MG shape, so no existing capture, canon or golden moves a byte.
    if (mundaneIds.has(id)) row.magicExists = false;
    out.push(row);
  }
  return out;
}

/**
 * Capture the live pack + placements, or null when unavailable (no map view open,
 * no ready bridge, empty pack, or no placements) — the store then reports
 * `spatial_capture_unavailable` cleanly.
 * @param {{ campaignId: string, get: Function }} ctx
 * @returns {Promise<{ pack: any, placements: Array<{id:string, cellId:number}> } | null>}
 */
export async function captureSpatialPack({ campaignId, get }) {
  const bridge = getSpatialCaptureBridge();
  if (!bridge || typeof bridge.getSpatialPack !== 'function' || !bridge.isReady) return null;

  let reply;
  try {
    reply = await bridge.getSpatialPack();
  } catch (_) {
    return null; // bridge timeout / iframe gone ⇒ treat as unavailable
  }
  const pack = reply?.pack;
  if (!pack?.cells?.h?.length || !pack?.cells?.c?.length) return null;

  // Determinism evidence: a second read of the same static pack must match. The
  // digest is frozen from the FIRST capture regardless (freeze-first).
  try {
    const second = await bridge.getSpatialPack();
    const identical = JSON.stringify(second?.pack?.cells) === JSON.stringify(pack.cells);
    if (!identical) {
      console.warn('[spatialPackCapture] two captures of the same map differ — freezing the FIRST (freeze-first ruling).');
    }
  } catch (_) { /* the second read is evidence-only; a failure never blocks canonize */ }

  const placements = placementsFor(get?.(), campaignId);
  if (!placements.length) return null; // nothing placed ⇒ nothing to map
  return { pack, placements };
}
