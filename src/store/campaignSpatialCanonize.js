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
import { kmScaleForCanonize } from '../domain/spatial/modeSpeeds.js';
import { canonizeWorldState, deepFreeze } from '../domain/worldPulse/worldState.js';
import { cacheCampaignState, syncCampaignSnapshot, findActiveCampaign } from './campaignSliceShared.js';
import { track, EVENTS } from '../lib/analytics.js';
import { extractCanonizeUsage } from '../lib/spatialCanonizeUsage.js';
import { realmShape } from '../lib/constructionUsage.js';
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
 *   sessionFence?: any, isSessionCurrent?: (sessionFence:any)=>boolean,
 *   options?: { captureSpatialPack?: (ctx:{campaignId:string, get:Function}) =>
 *     Promise<{pack:any, placements:Array<{id:any,cellId:any}>,
 *       cellResolution?:Array<{id:string, from:number|null, to:number|null, reason:string}>,
 *       sidecar?:object|null}|null>, kmScale?: number } }} args
 *   The injected capture's reply is declared HERE as well as at its producer, because the
 *   seam is a dependency injection: a test double supplies this shape without ever reaching
 *   `captureSpatialPack`. SEAM-3's `sidecar` is optional on BOTH sides for that reason — an
 *   older double that predates the stamp is still a valid capture.
 *   WY-1's `kmScale` is the creation flow's supply of the map's own km scale for the FIRST
 *   canonize; a re-canonize ignores it and carries the prior digest's value forward.
 * @returns {Promise<{ok:boolean, reason?:string, spatialCanonVersion?:number, digestBytes?:number,
 *   kmScaleReceipt?: import('../domain/spatial/modeSpeeds.js').KmScaleHealReceipt}>}
 */
export async function runSpatialCanonize({
  set,
  get,
  campaignId,
  options = {},
  sessionFence = null,
  isSessionCurrent = null,
}) {
  const sessionStillCurrent = () => (
    typeof isSessionCurrent !== 'function' || isSessionCurrent(sessionFence) !== false
  );
  // The LIVE read-only iframe capture is the default (ITEM 0 — the keystone's
  // deferred seam, now wired); tests inject a deterministic fixture capture. When
  // no map view is mounted the live capture returns null ⇒ a byte-invisible no-op
  // reported as `spatial_capture_unavailable`.
  const capture = typeof options.captureSpatialPack === 'function'
    ? options.captureSpatialPack
    : liveCaptureSpatialPack;
  const captured = await capture({ campaignId, get });
  if (!sessionStillCurrent()) return { ok: false, reason: 'auth_session_changed' };
  if (!captured || !captured.pack) return { ok: false, reason: 'spatial_capture_unavailable' };
  // W-SEAM SEAM-2: the capture had placements but could not establish a cell for a
  // single one of them — every row's stored coordinates are in an unverified frame and
  // no row carries a usable stored cell. Refuse, typed and visibly, rather than freeze
  // a digest seeded from nothing (before SEAM-2 this path silently canonized cell 0 for
  // every member: see the FALSE CANON finding in SEAM-0's landing act).
  if (Array.isArray(captured.placements) && captured.placements.length === 0) {
    return { ok: false, reason: 'spatial_placements_unresolved' };
  }
  // V-6 BIOME TRUTH (DARK): the additive biome sub-digest lights ONLY under the VIRTUAL
  // biomeTruthEnabled flag (ABSENT from DEFAULT_SIMULATION_RULES — the npcLadder/heirs idiom).
  // Absent ⇒ biomeTexture false ⇒ NO biomes key ⇒ byte-identical (every existing canon/golden).
  // Lit ⇒ a §V.1 receipted re-canonize freezes the per-settlement/per-leg biome into the canon.
  const priorWorldState = /** @type {{ simulationRules?: unknown, spatialDigest?: unknown }} */ (
    findActiveCampaign(get().campaigns, campaignId)?.worldState || {});
  const priorRules = /** @type {{ biomeTruthEnabled?: unknown, climateTruthEnabled?: unknown }} */ (
    priorWorldState.simulationRules || {});
  const biomeTexture = priorRules.biomeTruthEnabled === true;
  // W-CAP CAP-3 CLIMATE TRUTH (DARK): the additive climate sub-digest lights ONLY under the
  // VIRTUAL climateTruthEnabled flag, on the biomeTruthEnabled idiom above — ABSENT from
  // DEFAULT_SIMULATION_RULES, so it costs zero first-paint bytes and off-by-absence IS the
  // dormancy law. Absent ⇒ climateTexture false ⇒ NO climate key ⇒ byte-identical (every
  // existing canon/golden). Lit ⇒ a §V.1 receipted re-canonize freezes the per-settlement
  // climate band into the canon, and the seasons food year reads it in place of its
  // terrain-word proxy.
  const climateTexture = priorRules.climateTruthEnabled === true;
  // WY-1 THE SCALE CHARTER — THE CARRY-FORWARD CLAUSE (WY §1a.1, the ghost-write class):
  // this body REBUILDS the whole digest on every receipted re-canonize, so the km-scale
  // datum is RE-RECEIVED from the prior digest in this same prior-worldState read; the
  // creation flow's supply applies to the FIRST canonize only, and a re-canonize never
  // mints a scale for a legacy world. Absent stays absent (no key ⇒ byte-identical); a
  // refused value heals to absent and the result carries the receipt.
  const scale = kmScaleForCanonize({ priorDigest: priorWorldState.spatialDigest, supplied: options.kmScale });
  const digest = buildSpatialDigest({
    pack: captured.pack,
    placements: captured.placements,
    spatialGeometryVersion: SPATIAL_GEOMETRY_VERSION,
    costLawVersion: COST_LAW_VERSION,
    biomeTexture,
    climateTexture,
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
    // LAKE TYPOLOGY (W-CAP CAP-4): a NEW canon freezes the interior water bodies — the
    // non-frame-touching `h < 20` components — with their shorelines and a subtype derived
    // from FMG's own water budget. Follows the seaLanes/teleport opt-in shape rather than a
    // virtual flag: it reads only CAPTURED geometry, mints no vocabulary a DM can see, and
    // its dormancy floor is a real answer (a pack with no interior water leaves the key
    // absent). Existing saved canons keep their frozen (absent) shape.
    lakes: true,
    // W-SEAM SEAM-2: what the capture's cell re-resolution noticed, carried into the
    // additive capture receipt. Empty (the fixture path, and every realm whose stored
    // cells already agree with their coordinates) ⇒ no key ⇒ byte-identical.
    cellResolution: captured.cellResolution || null,
    // W-SEAM SEAM-3: the provenance stamp of the geometry this canon was actually built
    // against, frozen INTO the canon beside the other capture receipts. This is the
    // persistence shape Q-W1 granted; its reader is the headless re-canonize, which can
    // now ask "is this the same map?" of a record instead of of a witness row. A capture
    // that produced no stamp (the fixture path) leaves the key absent.
    sidecar: captured.sidecar || null,
    // WY-1: the admitted scale, or null (no key). See the carry-forward clause above.
    kmScale: scale.kmScale,
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
  // Capture and digest construction both yield. An advance may have started
  // after the slice's synchronous prefix, so refuse at the actual write boundary.
  if (get().isAdvanceInFlight(campaignId)) return { ok: false, reason: 'advance_in_flight' };
  if (get().getPausedAdvance(campaignId)) return { ok: false, reason: 'advance_paused' };
  if (!sessionStillCurrent()) return { ok: false, reason: 'auth_session_changed' };
  let campaignPersist = /** @type {any} */ (null);
  let nextVersion = 0;
  let realmShapeSummary = /** @type {any} */ (null);
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
    // §1.3 realm shape (topology/count/tier) off the live graph draft — flattened to
    // plain enums/bands here so it survives the producer.
    realmShapeSummary = realmShape(c.regionalGraph);
    c.updatedAt = now;
    // W-SEAM SEAM-1 (S1): this canonize just refroze the geography, so whatever the
    // terrainChanged listener saw is now accounted for. Session-only field (mapSlice,
    // outside mapState) ⇒ nothing persisted moves.
    stateDraft.geographyMayHaveDiverged = false;
    campaignPersist = cacheCampaignState(stateDraft);
  });
  if (!campaignPersist) return { ok: false, reason: 'not_found' };
  // Spatial-canonize usage: distinguishes the entitled spatial canon from a plain
  // world canonize (which carries no `spatial` prop) + records the lit map features
  // and digest size band. Coarse/id-free; this body is lazy so it costs no eager bytes.
  track(EVENTS.WORLD_CANONIZED, {
    settlement_count: digest.settlementIds.length,
    ...extractCanonizeUsage(digest, nextVersion, digestBytes),
    ...(realmShapeSummary || {}),
  // Campaign-grain subject stamp (A2 deferral / §4 market floor): the campaign uuid
  // keys the k=200-campaigns floor for the sellable topology cells. uuid-validated
  // server-side (ingest uuidOrNull → subject_id); a non-uuid campaignId is dropped.
  }, { subjectId: campaignId });
  try {
    await syncCampaignSnapshot(
      campaignPersist.snapshot,
      campaignId,
      campaignPersist,
      sessionStillCurrent,
    );
  } catch (error) {
    if (error?.code === 'auth_session_changed') {
      return { ok: false, reason: 'auth_session_changed' };
    }
    throw error;
  }
  if (!sessionStillCurrent()) return { ok: false, reason: 'auth_session_changed' };
  return {
    ok: true,
    spatialCanonVersion: nextVersion,
    digestBytes,
    ...(scale.receipt ? { kmScaleReceipt: scale.receipt } : {}),
  };
}
