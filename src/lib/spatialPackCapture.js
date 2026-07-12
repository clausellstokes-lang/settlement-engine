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

/**
 * The campaign's settlement placements as the digest builder consumes them:
 * [{ id: settlementId, cellId }], scoped to the campaign's settlements when known.
 * @param {any} state @param {string} campaignId @returns {Array<{id:string, cellId:number}>}
 */
function placementsFor(state, campaignId) {
  const placements = state?.mapState?.placements || {};
  const campaign = findActiveCampaign(state?.campaigns, campaignId);
  const inRealm = Array.isArray(campaign?.settlementIds) && campaign.settlementIds.length
    ? new Set(campaign.settlementIds.map(String))
    : null;
  /** @type {Array<{id:string, cellId:number}>} */
  const out = [];
  for (const burgId of Object.keys(placements).sort()) {
    const pl = placements[burgId];
    const id = pl?.settlementId != null ? String(pl.settlementId) : '';
    const cellId = Number(pl?.cellId);
    if (!id || !Number.isInteger(cellId)) continue;
    if (inRealm && !inRealm.has(id)) continue; // scope the digest to THIS realm's settlements
    out.push({ id, cellId });
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
