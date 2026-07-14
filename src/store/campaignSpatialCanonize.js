/**
 * campaignSpatialCanonize.js — the lazily-loaded BODY of the entitled spatial
 * canonize (Phase 5.5 KEYSTONE).
 *
 * Split out of campaignWorldPulseSlice so the capture + digest build + size guard
 * + persist — AND the whole src/domain/spatial graph this statically pulls — stay
 * OUT of the first-paint entry closure. The slice keeps only the cheap synchronous
 * gates (in-flight / entitlement / generated-map) + a single dynamic import of
 * this module, mirroring the proven loadWorldEngine / campaignAdvanceSession lazy-
 * body pattern. Because this helper statically imports the pure spatial module,
 * Rollup co-locates both behind the dynamic boundary → neither reaches first paint
 * (verified by tests/build/vendorPdfLazy.test.js's entry-closure ratchet).
 *
 * The entitlement read stays at the STORE call site in the slice (the domain is
 * tier-blind); this body assumes the gates already passed and just does the work.
 */
import {
  buildSpatialDigest,
  SPATIAL_GEOMETRY_VERSION,
  COST_LAW_VERSION,
  SEASONAL_OVERLAY_VERSION,
} from '../domain/spatial/index.js';
import { canonizeWorldState, deepFreeze } from '../domain/worldPulse/worldState.js';
import { cacheCampaignState, syncCampaignSnapshot, findActiveCampaign } from './campaignSliceShared.js';
import { track, EVENTS } from '../lib/analytics.js';
import { captureSpatialPack as liveCaptureSpatialPack } from '../lib/spatialPackCapture.js';

// Hard ceiling on the frozen digest so a spatial canonize can never bloat a save
// with megabytes of canon data. The dense-array digest holds a realistic ~8k-cell
// / 30-settlement map at ~87KB; this cap is a generous ~2× the ~200KB soft ruling,
// a safety net for pathological cell counts (the action no-ops over it rather than
// persisting a bloater).
const SPATIAL_DIGEST_MAX_BYTES = 400_000;

/**
 * Capture pack.cells ONCE, build the frozen digest in the pure module, and persist
 * it under the marker. Re-canonize BUMPS spatialCanonVersion. A null capture (the
 * deferred live-iframe seam) writes NOTHING — a byte-invisible typed no-op.
 *
 * @param {{ set: Function, get: Function, campaignId: string,
 *   options?: { captureSpatialPack?: (ctx:{campaignId:string, get:Function}) =>
 *     Promise<{pack:any, placements:Array<{id:any,cellId:any}>}|null> } }} args
 * @returns {Promise<{ok:boolean, reason?:string, spatialCanonVersion?:number, digestBytes?:number}>}
 */
export async function runSpatialCanonize({ set, get, campaignId, options = {} }) {
  // The LIVE read-only iframe capture is the default (ITEM 0 — the keystone's
  // deferred seam, now wired); tests inject a deterministic fixture capture. When
  // no map view is mounted the live capture returns null ⇒ a byte-invisible no-op
  // reported as `spatial_capture_unavailable`.
  const capture = typeof options.captureSpatialPack === 'function'
    ? options.captureSpatialPack
    : liveCaptureSpatialPack;
  const captured = await capture({ campaignId, get });
  if (!captured || !captured.pack) return { ok: false, reason: 'spatial_capture_unavailable' };
  const digest = buildSpatialDigest({
    pack: captured.pack,
    placements: captured.placements,
    spatialGeometryVersion: SPATIAL_GEOMETRY_VERSION,
    costLawVersion: COST_LAW_VERSION,
    // SEASONS-B (M3): a NEW canon lights the seasonal-road overlay (per-season ×
    // per-terrain cost law) under overlayVersion SEASONAL_OVERLAY_VERSION — the
    // §V.1 receipted re-canonize. Existing saved canons keep their frozen v1 (no
    // overlay) and read with no seasonal modulation (dormant, byte-identical).
    overlayVersion: SEASONAL_OVERLAY_VERSION,
    seasonalRoads: true,
    // SEA LANES (M8): a NEW canon lights the sea-lane edge set — port eligibility
    // (geography ∧ a water-access institution from the placement roster) + the cheap
    // water edges (§4j). The receipted re-canonize RE-DERIVES ports on founding
    // events (a new harbour changes the settlement's destiny). A realm with <2
    // eligible ports (no coastal/river settlement with a dock) leaves the slot null —
    // dormant, byte-identical. Existing saved canons keep their frozen (null) slot.
    seaLanes: true,
    // TELEPORT BLOCS (M9c): a NEW canon lights the teleport edge set — the clique of
    // settlements holding a teleport-capable institution (a teleportation circle / planar
    // gate on the placement roster), magic-gated + geography-independent (§4e). The
    // receipted re-canonize RE-DERIVES the bloc on founding events (a new circle changes
    // a settlement's destiny). A realm with <2 circle-holders leaves the slot null —
    // dormant, byte-identical. Existing saved canons keep their frozen (null) slot.
    teleport: true,
  });
  const digestBytes = JSON.stringify(digest).length;
  if (digestBytes > SPATIAL_DIGEST_MAX_BYTES) {
    return { ok: false, reason: 'spatial_digest_too_large', digestBytes };
  }
  // Freeze the digest at its authoring seam (performance-scale-2/3): it is authored
  // ONCE here and never recomputed, so ensureWorldState may share it BY REFERENCE
  // instead of deep-cloning it ~11×/tick — the deep freeze enforces the never-written
  // contract and gives every distanceRead route memo a stable digest identity. Byte-
  // neutral (freeze changes no enumerable value); the size guard above already ran on
  // the same object.
  deepFreeze(digest);
  let campaignPersist = /** @type {any} */ (null);
  let nextVersion = 0;
  const now = new Date().toISOString();
  set((/** @type {any} */ stateDraft) => {
    const c = findActiveCampaign(stateDraft.campaigns, campaignId);
    if (!c) return;
    // Ensure canonizedAt is stamped (a spatial canonize IS a canonize), then fold
    // in the marker + digest. The marker BUMPS on every re-canonize.
    const ws = canonizeWorldState(c.worldState, now, c);
    const priorVersion = Number.isInteger(ws.spatialCanonVersion) ? ws.spatialCanonVersion : 0;
    nextVersion = priorVersion + 1;
    c.worldState = { ...ws, spatialCanonVersion: nextVersion, spatialDigest: digest };
    c.updatedAt = now;
    campaignPersist = cacheCampaignState(stateDraft);
  });
  if (!campaignPersist) return { ok: false, reason: 'not_found' };
  track(EVENTS.WORLD_CANONIZED, { settlement_count: digest.settlementIds.length });
  await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
  return { ok: true, spatialCanonVersion: nextVersion, digestBytes };
}
