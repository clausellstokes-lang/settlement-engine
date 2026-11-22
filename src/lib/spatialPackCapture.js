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
import { resolveSettlementTerrain } from '../domain/resolveTerrain.js';
import { normalizeSpatialPack, nearestCellTo } from '../domain/spatial/spatialDigest.js';
import { buildCaptureSidecar } from '../domain/spatial/captureSidecar.js';

/**
 * A placement row on its way to the digest, plus the stored coordinates SEAM-2 needs
 * to re-derive its cell. `x`/`y` are transport only — they are stripped before the
 * row reaches buildSpatialDigest, and `mapState.placements` is never written.
 * @typedef {{ id:string, cellId:number|null, x:number, y:number, institutions:any[],
 *   magicExists?:boolean, terrainType?:string }} StagedPlacement
 */

/**
 * The stored cellId as an INTEGER CELL INDEX, or null when the row does not carry one.
 *
 * ⚠ W-SEAM SEAM-2, and this line is the whole of SEAM-0's finding. The previous guard
 * was `const cellId = Number(pl?.cellId); if (!Number.isInteger(cellId)) continue;` —
 * which reads as "drop rows without a cell", and is how the review and the verification
 * appendix both read it. It is not what it does: `Number(null) === 0` and
 * `Number.isInteger(0) === true`, so every `cellId: null` row — which is EVERY placement
 * an Instant World composes — was silently admitted as MAP CELL 0. The canonize then
 * succeeded, stamped spatialCanonVersion 1, and froze a digest holding either zero
 * settlements (cell 0 in the ocean) or exactly one with the rest recorded `shared_cell`:
 * the whole realm collapsed onto index 0, permanently, under freeze-first.
 *
 * A missing cell is now null and stays null, and the resolution pass below decides what
 * to do about it in the open.
 * @param {unknown} raw @returns {number|null}
 */
function storedCellIdOf(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  if (typeof raw === 'boolean') return null;
  const n = Number(raw);
  return Number.isInteger(n) ? n : null;
}

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
 * @returns {StagedPlacement[]}
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
  // W-SEAM SEAM-1 (S3): the settlement's OWN declared terrain, read through the one
  // reader, travels with the placement exactly as the institution roster and the
  // magic truth do — so the digest can compare it against the geography under the
  // cell and receipt the disagreement. Read-only; terrainType is never written back.
  /** @type {Map<string, string>} */
  const terrainById = new Map();
  for (const s of savedSettlements) {
    const id = s?.id != null ? String(s.id) : '';
    if (!id) continue;
    const insts = s?.settlement?.institutions;
    if (Array.isArray(insts)) institutionsById.set(id, insts);
    const declaredTerrain = resolveSettlementTerrain(s);
    if (declaredTerrain) terrainById.set(id, declaredTerrain);
    // PRESENT-guarded: magicLedger's neutral default for an UN-GENERATED settlement is
    // itself magicExists:false, so an unguarded read would declare every config-less
    // legacy row mundane. Only a settlement that actually carries a magic axis AND
    // asserts magic absent is stamped.
    const ledger = magicLedger(s?.settlement);
    if (ledger.present && ledger.magicExists === false) mundaneIds.add(id);
  }
  /** @type {StagedPlacement[]} */
  const out = [];
  for (const burgId of Object.keys(placements).sort()) {
    const pl = placements[burgId];
    const id = pl?.settlementId != null ? String(pl.settlementId) : '';
    if (!id) continue;
    const cellId = storedCellIdOf(pl?.cellId);
    if (inRealm && !inRealm.has(id)) continue; // scope the digest to THIS realm's settlements
    const row = /** @type {StagedPlacement} */ (
      { id, cellId, x: Number(pl?.x), y: Number(pl?.y), institutions: institutionsById.get(id) || [] });
    // Additive ONLY when magic is asserted absent — an unstamped row keeps the exact
    // pre-MG shape, so no existing capture, canon or golden moves a byte.
    if (mundaneIds.has(id)) row.magicExists = false;
    // Same additive discipline (SEAM-1/S3): stamped only when the settlement actually
    // declares a terrain. A config-less legacy row carries no key, so the digest's
    // agreement receipt stays empty and the digest bytes are unchanged.
    const declaredTerrain = terrainById.get(id);
    if (declaredTerrain) row.terrainType = declaredTerrain;
    out.push(row);
  }
  return out;
}

/**
 * W-SEAM SEAM-2 — CAPTURE-TIME CELL RE-RESOLUTION.
 *
 * A placement's cellId is minted ONCE, at drop, by the iframe's `findCell(mapPt)`,
 * and then stored forever. Nothing ever re-derives it, so it goes stale silently the
 * moment the pack is re-graphed (a terrain edit, a snapshot of a different vintage, a
 * future fork upgrade) — and a stale index that happens to land on another valid land
 * cell passes every check and seeds territory, distances, gates and port eligibility
 * at the WRONG PLACE, frozen forever. And a placement with no cellId at all (every
 * Instant World member) had no path to a cell whatsoever.
 *
 * So: re-derive every cell from the stored x/y against the pack being captured in the
 * same breath, through the ONE resolution law (`nearestCellTo` — the same helper the
 * territory view will seed its flood from, per A1.2 §9).
 *
 * ⚠ THE COORDINATE-FRAME PROBLEM, and it is not hypothetical (A1 binding (b)).
 * Stored x/y are only meaningful if they are in the CAPTURED PACK's map space. For a
 * dropped placement they are: sf-bridge converts screen→map with `screenToMap` and then
 * calls `findCell` on the result. For a COMPOSER-MINTED placement they are NOT known to
 * be: `worldPlan.js` scatters sites in a NOMINAL 1000×600 canvas, FMG's own map space is
 * `graphWidth`×`graphHeight` (window-derived), and `useInstantWorldMaterialize` explicitly
 * does not re-place ("the staged settlement placements are React overlays … untouched").
 * Nothing in the row records which frame it is in.
 *
 * THE WITNESS RULE. Rather than guess — or invent an affine transform between the two,
 * which would be a silent geometric fabrication — the capture looks for evidence. A
 * placement that carries BOTH finite x/y AND a stored in-range cellId is a candidate
 * witness; if `nearestCellTo` reproduces that stored cellId from those coordinates, the
 * frame is CONFIRMED for this capture, because the stored id was minted by findCell over
 * this same `cells.p`. One witness is enough. With no witness, NOTHING is remapped and
 * the unresolved rows are receipted `frame_unverified`.
 *
 * WHAT THIS CAR DOES AND DOES NOT DO:
 *   - a row with NO stored cell + a verified frame ⇒ USE the derived cell (`cell_derived`).
 *     This is what lets a placement whose findCell failed at drop reach the canon at all.
 *   - a row WITH a stored cell that the coordinates disagree with ⇒ REPORT ONLY
 *     (`cell_remapped`). The seed cell is NOT switched. Switching a canon's seed is a
 *     louder act that owes its own declaration, and it is not this car's.
 *   - a row with no stored cell and no verified frame ⇒ DROPPED, receipted
 *     `frame_unverified`. The realm then refuses to canonize instead of freezing a lie.
 *
 * The receipts say "re-derived", never "cured" (A1.2 §5): no provenance stamp exists to
 * prove the pack in hand is the geometry these coordinates came from. That is SEAM-3.
 * `mapState.placements` is never written — this is a read-only projection.
 *
 * @param {StagedPlacement[]} staged
 * @param {any} rawPack the captured pack (pre-normalize)
 * @returns {{ placements: Array<{id:string, cellId:number, institutions:any[]}>,
 *   cellResolution: Array<{id:string, from:number|null, to:number|null, reason:string}> }}
 */
export function resolvePlacementCells(staged, rawPack) {
  const pack = normalizeSpatialPack(rawPack);
  const inRange = (/** @type {number|null} */ c) => (
    c !== null && c >= 0 && c < pack.cellCount
  );
  const derivedFor = (/** @type {StagedPlacement} */ row) => (
    Number.isFinite(row.x) && Number.isFinite(row.y)
      ? nearestCellTo(row.x, row.y, pack.p, pack.cellCount)
      : null
  );

  // Pass 1 — look for a witness that the stored coordinates share the captured pack's
  // frame. A stale stored id fails to witness; another row may still succeed, so every
  // candidate is tried before the frame is called unverified.
  let frameVerified = false;
  for (const row of staged) {
    if (!inRange(row.cellId)) continue;
    if (derivedFor(row) === row.cellId) { frameVerified = true; break; }
  }

  /** @type {Array<{id:string, cellId:number, institutions:any[]}>} */
  const placements = [];
  /** @type {Array<{id:string, from:number|null, to:number|null, reason:string}>} */
  const cellResolution = [];
  for (const row of staged) {
    const { x: _x, y: _y, ...carried } = row;
    const derived = frameVerified ? derivedFor(row) : null;
    if (row.cellId !== null) {
      // An out-of-range stored id is left exactly as it is: resolveSeeds already
      // reports it as `off_map`, and duplicating that here would double-count it.
      placements.push(/** @type {any} */ ({ ...carried, cellId: row.cellId }));
      if (derived !== null && derived !== row.cellId && inRange(row.cellId)) {
        cellResolution.push({ id: row.id, from: row.cellId, to: derived, reason: 'cell_remapped' });
      }
      continue;
    }
    if (derived !== null) {
      placements.push(/** @type {any} */ ({ ...carried, cellId: derived }));
      cellResolution.push({ id: row.id, from: null, to: derived, reason: 'cell_derived' });
      continue;
    }
    cellResolution.push({ id: row.id, from: null, to: null, reason: 'frame_unverified' });
  }
  return { placements, cellResolution };
}

/**
 * Capture the live pack + placements, or null when unavailable (no map view open,
 * no ready bridge, empty pack, or no placements) — the store then reports
 * `spatial_capture_unavailable` cleanly.
 * @param {{ campaignId: string, get: Function }} ctx
 * SEAM-2 widened the reply: `cellResolution` carries what the cell re-resolution
 * noticed, and `placements` may legitimately come back EMPTY when no row could be tied
 * to a cell — the caller refuses on that (`spatial_placements_unresolved`) rather than
 * freezing a digest seeded from nothing.
 * SEAM-3 widened it again: `sidecar` stamps WHICH GEOMETRY this capture held, and is null
 * when the pack is unreadable — a capture can succeed while its stamp declines.
 * @returns {Promise<{ pack: any, placements: Array<{id:string, cellId:number}>,
 *   cellResolution: Array<{id:string, from:number|null, to:number|null, reason:string}>,
 *   sidecar: ReturnType<typeof buildCaptureSidecar> } | null>}
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

  const staged = placementsFor(get?.(), campaignId);
  if (!staged.length) return null; // nothing placed ⇒ nothing to map
  // SEAM-2: re-derive each cell from the stored coordinates against THIS pack. A realm
  // whose rows all fail to resolve returns an EMPTY placement list with its receipt
  // attached — the store refuses on that and can say WHY, instead of freezing a canon
  // built from cell 0.
  const { placements, cellResolution } = resolvePlacementCells(staged, pack);
  // W-SEAM SEAM-3: stamp WHICH GEOMETRY this capture actually held, so a later capture or
  // a headless re-canonize can PROVE the pack in hand is the one these coordinates came
  // from instead of inferring it from a witness row. The frame fields ride along when the
  // bridge reports them and are tolerated-absent otherwise. Purely additive: the sidecar
  // does not seed anything, and a canon frozen without one is untouched.
  const sidecar = buildCaptureSidecar(pack, {
    graphWidth: Number(reply?.graphWidth),
    graphHeight: Number(reply?.graphHeight),
    mapSeed: reply?.mapSeed,
    mapKind: reply?.mapKind,
  });
  return { pack, placements, cellResolution, sidecar };
}
