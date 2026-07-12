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
  OVERLAY_VERSION,
} from '../domain/spatial/index.js';
import { canonizeWorldState } from '../domain/worldPulse/worldState.js';
import { cacheCampaignState, syncCampaignSnapshot, findActiveCampaign } from './campaignSliceShared.js';
import { track, EVENTS } from '../lib/analytics.js';

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
  const capture = typeof options.captureSpatialPack === 'function'
    ? options.captureSpatialPack
    : async () => null;
  const captured = await capture({ campaignId, get });
  if (!captured || !captured.pack) return { ok: false, reason: 'spatial_capture_unavailable' };
  const digest = buildSpatialDigest({
    pack: captured.pack,
    placements: captured.placements,
    spatialGeometryVersion: SPATIAL_GEOMETRY_VERSION,
    costLawVersion: COST_LAW_VERSION,
    overlayVersion: OVERLAY_VERSION,
  });
  const digestBytes = JSON.stringify(digest).length;
  if (digestBytes > SPATIAL_DIGEST_MAX_BYTES) {
    return { ok: false, reason: 'spatial_digest_too_large', digestBytes };
  }
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
