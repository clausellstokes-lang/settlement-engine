/**
 * townCartography/cartographyParcels.js — TC-3b, THE CARVING AND THE BINDING.
 *
 * THE ONE LAW (DESIGN_TOWN_CARTOGRAPHY §1) decides this file's whole shape: the
 * cartography layers are a SYNTHESIS STAGE INSIDE the TownSceneManifest, never a
 * parallel town generator. TC-3a lowered each canonical district into a ward; this
 * leaf carves INSIDE that already-validated ward and never partitions space a second
 * time. A second district graph, a street-face partitioner, or general polygon
 * clipping would be exactly the fork the ONE LAW exists to prevent.
 *
 * ── WHY CENTROID FANS RATHER THAN A REAL SUBDIVISION ─────────────────────────
 * A convex ward, its own canonical centroid, and each edge split into exactly three
 * integer segments give a triangle fan whose members are, by construction, inside
 * the ward, non-overlapping, and integer. That buys containment as a THEOREM rather
 * than as a retry loop: there is no clipping, no jitter, no overlap repair and no
 * "try again with a smaller box" anywhere in this file, which is why the work here
 * is bounded by vertex count alone. The premises the theorem needs — convexity, an
 * interior centroid, a vertex cap — are checked ONCE, by TC-3a's ward lowering, and
 * a source that fails one throws there rather than being repaired into a shape the
 * dossier never agreed to.
 *
 * ── THE BINDING IS A RECEIPT, NOT A RECORD (TC-4's input) ────────────────────
 * `bindCanonicalInstitutionsToParcels` answers "which parcel would this canonical
 * institution take?" and nothing else. TC-3 does not persist the answer: the
 * cartography block still emits `buildings: []`, because a building record needs the
 * footprint packing and multiplicity carriers that are TC-4's subject. Keeping the
 * function pure, exported, and at its exact TC-3 signature means TC-4 consumes the
 * SAME decision rather than re-deriving a second one that could disagree.
 *
 * The choice is made PER ANCHOR, from a digest of the anchor itself, so it is
 * independent of roster order and of how many other institutions exist: adding an
 * institution can never reassign one that was already placed.
 *
 * ── NO DRAW LIVES HERE ───────────────────────────────────────────────────────
 * The naming left with TC-3a, and it took the PRNG with it. Every choice below is a
 * `sceneDigest` of named inputs, so this leaf roots no stream, forks no label, and
 * consumes nobody's entropy. `carto:institution-parcel` is therefore a digest DOMAIN,
 * not a fork label — single-colon-separated, and never spelling the reserved `::`.
 *
 * Pure and headless: no store, no clock, no randomness, no I/O, no module-scope
 * mutable state. Zero any-casts.
 *
 * @enforced-by tests/domain/townCartographyParcels.test.js
 * @enforced-by tests/domain/townCartographyDeterminism.test.js
 */

import { scenePolygonArea } from '../townScene/sceneCompilePrimitives.js';
import { sceneDigest, stableSceneStringify } from '../townScene/stableScene.js';
import {
  byCodepoint,
  generatedProvenance,
  list,
  planPolygon,
  premise,
  record,
  roundedMean,
  sourceDistricts,
} from './cartographyPlan.js';
import { TOWN_CARTOGRAPHY_TUNING, cartographyBand } from './cartographyTuning.js';

const T = TOWN_CARTOGRAPHY_TUNING;

/** The ONE selection domain. A digest domain, never a PRNG fork label. */
const INSTITUTION_PARCEL_DOMAIN = 'carto:institution-parcel';

/**
 * @typedef {import('./cartographyPlan.js').PlanPoint} PlanPoint
 * @typedef {import('./cartographyWards.js').CartographyWardRow} CartographyWardRow
 * @typedef {{ id: string, wardId: string, polygon: PlanPoint[], anchor: PlanPoint,
 *   provenance: import('./cartographyPlan.js').CartographyProvenance,
 *   decidedBy: string }} CartographyParcelRow
 * @typedef {{ institutionRef: string, anchorKey: string, parcelId: string,
 *   placement: string, decidedBy: string }} InstitutionParcelBinding
 * @typedef {{ row: CartographyParcelRow, edge: number, segment: number }} ParcelCandidate
 */

/**
 * THE CANDIDATE FAN for one ward, in natural (edge, then segment) order. The edge
 * and segment indices ride ALONGSIDE the row rather than inside it, so the emitted
 * parcel keeps exactly the contract's key set and the ordering rules below never
 * have to re-parse an id to recover what produced it.
 *
 * The two-digit zero-padded edge index in the id is load-bearing: it keeps codepoint
 * id order equal to numeric edge order up to MAXIMUM_WARD_VERTICES. The segment
 * index is deliberately NOT padded — it is bounded by PARCEL_EDGE_DIVISIONS.
 *
 * @param {CartographyWardRow} ward
 * @param {PlanPoint} centroid
 * @returns {ParcelCandidate[]}
 */
function carveCandidates(ward, centroid) {
  const divisions = T.PARCEL_EDGE_DIVISIONS;
  /** @type {ParcelCandidate[]} */
  const candidates = [];
  for (let edge = 0; edge < ward.polygon.length; edge++) {
    const a = ward.polygon[edge];
    const b = ward.polygon[(edge + 1) % ward.polygon.length];
    /** @type {PlanPoint[]} */
    const cuts = [];
    for (let k = 0; k <= divisions; k++) {
      cuts.push([
        Math.round((a[0] * (divisions - k) + b[0] * k) / divisions),
        Math.round((a[1] * (divisions - k) + b[1] * k) / divisions),
      ]);
    }
    for (let segment = 0; segment < divisions; segment++) {
      /** @type {PlanPoint[]} */
      const polygon = [[centroid[0], centroid[1]], cuts[segment], cuts[segment + 1]];
      if (scenePolygonArea(polygon) === 0) continue;
      candidates.push({
        edge,
        segment,
        row: {
          id: `parcel:${ward.id}:e${String(edge).padStart(2, '0')}:s${segment}`,
          wardId: ward.id,
          polygon,
          anchor: [
            roundedMean(polygon.map((point) => point[0])),
            roundedMean(polygon.map((point) => point[1])),
          ],
          provenance: generatedProvenance(),
          decidedBy: 'state',
        },
      });
    }
  }
  return candidates;
}

/**
 * A-8 applied to selection ORDER: the same fan, read in the order the settlement's
 * own derived cohesion says. Nothing here changes a coordinate — only which of the
 * bounded candidates the ward keeps.
 *
 * `dispersed_orderly` is the DEFAULT ARM rather than an enumerated case, so the
 * fallback is total: a placement vocabulary that grows later cannot fail open.
 *
 * @param {ParcelCandidate[]} candidates
 * @param {string} placement
 * @param {string} digest
 * @param {string} wardId
 * @returns {ParcelCandidate[]}
 */
function orderCandidates(candidates, placement, digest, wardId) {
  if (placement === 'district') return candidates;
  if (placement === 'clustered') {
    if (candidates.length === 0) return candidates;
    const stamp = Number.parseInt(sceneDigest({ digest, wardId }).slice(-8), 16);
    const offset = (Number.isFinite(stamp) ? stamp : 0) % candidates.length;
    return candidates.slice(offset).concat(candidates.slice(0, offset));
  }
  if (placement === 'dispersed_chaotic') {
    return [...candidates].sort((left, right) => {
      const a = sceneDigest({ digest, wardId, parcelId: left.row.id });
      const b = sceneDigest({ digest, wardId, parcelId: right.row.id });
      return byCodepoint(a, b) || byCodepoint(left.row.id, right.row.id);
    });
  }
  // `dispersed_orderly`, and the total fallback for any unknown placement: read one
  // segment index across every edge before returning for the next.
  return [...candidates].sort((left, right) => (
    left.segment - right.segment
    || left.edge - right.edge
  ));
}

/** @param {CartographyParcelRow} parcel @returns {number} */
function parcelArea(parcel) {
  return scenePolygonArea(parcel.polygon);
}

/**
 * A-8 PROMINENCE: a larger institution may only take a larger parcel. The eligible
 * count rounds UP and never falls below one, so a ward with a single parcel still
 * houses its cathedral.
 * @param {CartographyParcelRow[]} sorted parcels, largest first
 * @param {number} footprintArea
 * @returns {CartographyParcelRow[]}
 */
function eligibleParcels(sorted, footprintArea) {
  const bands = T.INSTITUTION_PROMINENCE_AREA_PLAN2;
  if (footprintArea >= bands.large) {
    return sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 3)));
  }
  if (footprintArea >= bands.medium) {
    return sorted.slice(0, Math.max(1, Math.ceil((sorted.length * 2) / 3)));
  }
  return sorted;
}

/**
 * BIND THE CANONICAL INSTITUTIONS TO PARCELS — a pure, total receipt for TC-4.
 *
 * Only rows the manifest already projected are eligible: generated fabric is not an
 * institution, and a row without a semantic id, an anchor or a district cannot be
 * addressed. Nothing here is persisted; nothing here reads the settlement roster.
 *
 * @param {object} input
 * @param {unknown} input.buildings canonical scene buildings
 * @param {CartographyWardRow[]} input.wards
 * @param {CartographyParcelRow[]} input.parcels
 * @param {string} input.digest the manifest's mapModelDigest
 * @param {string} input.placement the derived cohesion placement
 * @returns {InstitutionParcelBinding[]}
 */
export function bindCanonicalInstitutionsToParcels(input) {
  /** @type {Map<string, CartographyWardRow>} */
  const wardByDistrict = new Map();
  for (const ward of input.wards) {
    if (typeof ward.districtId === 'string') wardByDistrict.set(ward.districtId, ward);
  }
  /** @type {Map<string, CartographyParcelRow[]>} */
  const byWard = new Map();
  for (const parcel of input.parcels) {
    const rows = byWard.get(parcel.wardId) || [];
    rows.push(parcel);
    byWard.set(parcel.wardId, rows);
  }
  /** @type {InstitutionParcelBinding[]} */
  const bindings = [];
  for (const raw of list(input.buildings)) {
    const row = record(raw);
    if (row.generatedFabric === true) continue;
    const institutionRef = row.semanticId;
    const anchorKey = row.anchorKey;
    const districtId = row.districtId;
    if (typeof institutionRef !== 'string' || typeof anchorKey !== 'string') continue;
    if (typeof districtId !== 'string') continue;
    const ward = wardByDistrict.get(districtId);
    if (!ward) throw premise(`canonical institution ${institutionRef} names district ${districtId}, which lowered to no ward`);
    const sorted = [...(byWard.get(ward.id) || [])]
      .sort((left, right) => parcelArea(right) - parcelArea(left) || byCodepoint(left.id, right.id));
    if (sorted.length === 0) throw premise(`canonical institution ${institutionRef} lands in ${ward.id}, which carved no parcel`);
    const eligible = eligibleParcels(sorted, scenePolygonArea(planPolygon(row.footprint)));
    /** @param {CartographyParcelRow} parcel @returns {string} */
    const stampFor = (parcel) => sceneDigest({
      domain: INSTITUTION_PARCEL_DOMAIN,
      digest: input.digest,
      anchorKey,
      institutionRef,
      parcelId: parcel.id,
    });
    let chosen = eligible[0];
    let chosenStamp = stampFor(chosen);
    for (let index = 1; index < eligible.length; index++) {
      const parcel = eligible[index];
      const stamp = stampFor(parcel);
      const order = byCodepoint(stamp, chosenStamp) || byCodepoint(parcel.id, chosen.id);
      if (order < 0) {
        chosen = parcel;
        chosenStamp = stamp;
      }
    }
    bindings.push({
      institutionRef,
      anchorKey,
      parcelId: chosen.id,
      placement: input.placement,
      decidedBy: 'prominence',
    });
  }
  return bindings.sort((left, right) => (
    byCodepoint(left.institutionRef, right.institutionRef)
    || byCodepoint(left.anchorKey, right.anchorKey)
  ));
}

/**
 * COMPILE THE TC-3b LAYERS. A bounded carve inside every ward TC-3a lowered, plus
 * the binding receipt TC-4 will consume and the exact per-tier byte measurement.
 *
 * The ward-to-centroid map is derived through the SAME shared `sourceDistricts` the
 * ward layer used, so the two stages cannot disagree about which district is which.
 * A ward whose id is absent from that map is skipped for carving.
 *
 * `streets` is TC-3a's NAMED container and is read for one purpose only: the byte
 * receipt's `streetNames` projection. Nothing here renames or re-emits a street.
 *
 * @param {object} input
 * @param {unknown} input.districts the manifest's canonical districts
 * @param {CartographyWardRow[]} input.wards TC-3a's lowered wards
 * @param {unknown} input.streets TC-3a's named street container
 * @param {unknown} input.buildings the manifest's canonical scene buildings
 * @param {string} input.digest the manifest's mapModelDigest
 * @param {string} input.tier the canonical tier
 * @param {string} input.placement the derived cohesion placement
 * @returns {{ parcels: CartographyParcelRow[],
 *   institutionBindings: InstitutionParcelBinding[],
 *   receipts: Readonly<{ parcelCount: number, bindingCount: number,
 *     candidateCount: number, bytes: number, byteBudget: number,
 *     withinBudget: boolean }> }}
 */
export function compileTownParcelLayers(input) {
  /** @type {Map<string, PlanPoint>} */
  const centroids = new Map(
    sourceDistricts(input.districts).map((district) => [`ward:${district.id}`, district.centroid]),
  );
  const perWard = cartographyBand(T.PARCELS_PER_WARD, input.tier);
  /** @type {CartographyParcelRow[]} */
  const parcels = [];
  let candidateCount = 0;
  for (const ward of input.wards) {
    const centroid = centroids.get(ward.id);
    if (!centroid) continue;
    const candidates = carveCandidates(ward, centroid);
    candidateCount += candidates.length;
    const ordered = orderCandidates(candidates, input.placement, input.digest, ward.id);
    for (const candidate of ordered.slice(0, perWard)) parcels.push(candidate.row);
  }
  parcels.sort((left, right) => byCodepoint(left.id, right.id));

  const institutionBindings = bindCanonicalInstitutionsToParcels({
    buildings: input.buildings,
    wards: input.wards,
    parcels,
    digest: input.digest,
    placement: input.placement,
  });
  const bindingCap = cartographyBand(T.MAXIMUM_INSTITUTION_BINDINGS, input.tier);
  if (institutionBindings.length > bindingCap) {
    throw premise(`${institutionBindings.length} institution bindings exceed the ${input.tier} cap of ${bindingCap}`);
  }

  const container = record(input.streets);
  const streetNames = [...list(container.arterials), ...list(container.lanes)]
    .map((raw) => record(raw))
    .map((street) => ({ id: street.id, name: street.name }));
  const bytes = new TextEncoder()
    .encode(stableSceneStringify({ streetNames, wards: input.wards, parcels })).byteLength;
  const byteBudget = cartographyBand(T.TC3_LAYER_MAX_BYTES, input.tier);
  if (bytes > byteBudget) {
    throw premise(`the TC-3 layers measure ${bytes} bytes against the ${input.tier} band of ${byteBudget}`);
  }

  return {
    parcels,
    institutionBindings,
    receipts: Object.freeze({
      parcelCount: parcels.length,
      bindingCount: institutionBindings.length,
      candidateCount,
      bytes,
      byteBudget,
      withinBudget: bytes <= byteBudget,
    }),
  };
}
