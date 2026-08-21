/**
 * townCartography/cartographyBuildings.js — TC-4, THE PACKING AND THE DRESS.
 *
 * THE ONE LAW (DESIGN_TOWN_CARTOGRAPHY §1) again decides this file's shape: the
 * buildings layer is a PROJECTION of canonical facts, never a second building
 * generator. Every institution row traces to a scene building the manifest already
 * publishes, through the TC-3b binding receipt consumed VERBATIM — this leaf never
 * re-binds, because a second binder could disagree with the first and the map would
 * fork from the dossier. Dwellings are population-derived filler with NO parallel
 * identity: their ids resolve to nothing outside this block, by design (design §3).
 *
 * ── CONTAINMENT IS A THEOREM, THEN A CHECKED PREDICATE ───────────────────────
 * A parcel is a TC-3b integer triangle. Its MEDIAL SUBDIVISION gives exactly four
 * subcells that are, by construction, inside it and non-overlapping — which is why
 * BUILDINGS_PER_PARCEL can never exceed four. A footprint is that subcell scaled
 * toward its own rounded centroid, so it is inside by construction; the integer
 * ROUNDING is then re-checked against the PARCEL with `scenePointInPolygon`, on
 * every vertex AND the anchor. The shrink ladder is a FIXED three-rung `for`, not a
 * retry loop: there is no clipping, no jitter, no overlap repair and no "try again
 * with a smaller box" anywhere in this file.
 *
 * A dwelling that cannot pack is SKIPPED — fill is best-effort. An institution that
 * cannot pack is NAMED, because a canonical fact that silently vanished would fork
 * the map from the dossier, which is the exact failure the ONE LAW exists to prevent.
 *
 * ── THE CANONICAL COUNT IS NEVER LOST ────────────────────────────────────────
 * A-8's resolved multiplicity is the canonical fact; the map draws what FITS. When
 * ward capacity binds, the shortfall rides `receipts.overflowCount` and the resolved
 * number stays in `receipts.multiplicity`, so a later surface reports the truth even
 * where the geometry could not. Instances distribute ROUND-ROBIN — one instance per
 * anchor per round — so a single high-count institution cannot starve the rest.
 *
 * The emission rounds are ONE loop: round 1 is the flagship round (the bound parcel,
 * cap-exempt, because a canonical institution always appears), and rounds 2..N are
 * the instance rounds (probed, cap-bound). Splitting them into two loops would mean
 * two copies of the row construction, and the first divergence between the copies
 * would be a flagship that dressed differently from its own instances.
 *
 * ── NO DRAW LIVES HERE ───────────────────────────────────────────────────────
 * Every choice is a `sceneDigest` of named inputs; this leaf roots no stream and
 * forks no label. Its dress domain is single-colon-separated and never spells the
 * reserved `::`, which would alias a fork CHAIN (kernel/prng.js's delimiter
 * contract). Identity is APPEND-STABLE: an instance id is a pure function of
 * (anchorKey, ordinal) and a dwelling id of (ward id, slot), so growth appends
 * N+1 and never reindexes 1..N (A-8's NPC positional-id lesson).
 *
 * Pure and headless: no store, no clock, no randomness, no I/O, no module-scope
 * mutable state, no settlement institution roster, no map edit.
 *
 * @enforced-by tests/domain/townCartographyBuildings.test.js
 * @enforced-by tests/domain/townCartographyDeterminism.test.js
 */

import { scenePointInPolygon, scenePolygonArea } from '../townScene/sceneCompilePrimitives.js';
import { sceneDigest, stableSceneStringify } from '../townScene/stableScene.js';
import { slugify } from '../townMap/anchors.js';
import { resolveInstitutionMultiplicity } from './cartographyMultiplicity.js';
import { byCodepoint, generatedProvenance, list, planPolygon, premise, record, roundedMean } from './cartographyPlan.js';
import { CARTOGRAPHY_TIERS, TOWN_CARTOGRAPHY_TUNING, cartographyBand, cartographyTierIndex } from './cartographyTuning.js';

const T = TOWN_CARTOGRAPHY_TUNING;

/** The ONE dress domain. A digest domain, never a PRNG fork label. */
const DRESS_DOMAIN = 'carto:building-dress';

/**
 * @typedef {import('./cartographyPlan.js').PlanPoint} PlanPoint
 * @typedef {import('./cartographyWards.js').CartographyWardRow} CartographyWardRow
 * @typedef {import('./cartographyParcels.js').CartographyParcelRow} CartographyParcelRow
 * @typedef {import('./cartographyParcels.js').InstitutionParcelBinding} InstitutionParcelBinding
 * @typedef {{ institutionRef: string, min: number, max: number, resolved: number,
 *   emitted: number }} MultiplicityReceipt
 * @typedef {{ id: string, parcelId: string, role: string, footprint: PlanPoint[],
 *   heightPermille: number, agePermille: number, condition: string, styleToken: string,
 *   provenance: import('./cartographyPlan.js').CartographyProvenance, decidedBy: string,
 *   institutionRef?: string, placement?: string, lynchElement?: string }} CartographyBuildingRow
 * @typedef {{ heightPermille: number, styleToken: string, institutionRef?: string,
 *   landmark?: boolean }} RowDress the role-specific half of a row
 */

/** @param {number} value @param {number} low @param {number} high @returns {number} */
function clamp(value, low, high) {
  return value < low ? low : value > high ? high : value;
}

/** A profile coefficient that may be absent reads zero, never NaN.
 *  @param {unknown} value @returns {number} */
function coefficient(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/**
 * The dress stamp for one subject, as a −1 | 0 | +1 step. The domain separation is
 * what keeps a height nudge from aliasing an age nudge.
 * @param {unknown} digest @param {string} subject @param {number} instance
 * @returns {number}
 */
function jitterOf(digest, subject, instance) {
  const stamp = Number.parseInt(sceneDigest({
    domain: DRESS_DOMAIN, digest, subject, instance,
  }).slice(-8), 16);
  return (Number.isFinite(stamp) ? stamp : 0) % 3 - 1;
}

/**
 * PACK ONE FOOTPRINT into subcell `index` of a parcel, by the fixed shrink ladder.
 *
 * The four subcells are the medial subdivision `[v0,m01,m20]`, `[v1,m12,m01]`,
 * `[v2,m20,m12]`, `[m01,m12,m20]`; each is inside the parcel by construction, which
 * is the theorem BUILDINGS_PER_PARCEL <= 4 states. Returns null when no rung yields a
 * positive-area polygon whose every vertex AND anchor passes the exact predicate.
 *
 * @param {PlanPoint[]} parcel the parcel triangle
 * @param {number} index which medial subcell, 0..3
 * @param {number} start the class shrink permille
 * @returns {PlanPoint[] | null}
 */
function packFootprint(parcel, index, start) {
  /** @param {PlanPoint} a @param {PlanPoint} b @returns {PlanPoint} */
  const mid = (a, b) => [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)];
  const [v0, v1, v2] = parcel;
  const [m01, m12, m20] = [mid(v0, v1), mid(v1, v2), mid(v2, v0)];
  const subcell = [[v0, m01, m20], [v1, m12, m01], [v2, m20, m12], [m01, m12, m20]][index];
  /** @type {PlanPoint} */
  const anchor = [roundedMean(subcell.map((p) => p[0])), roundedMean(subcell.map((p) => p[1]))];
  if (!scenePointInPolygon(anchor[0], anchor[1], parcel)) return null;
  for (let step = 0; step < 3; step++) {
    const permille = Math.max(T.FOOTPRINT_SHRINK_FLOOR, start - step * T.FOOTPRINT_SHRINK_STEP);
    /** @type {PlanPoint[]} */
    const footprint = subcell.map((vertex) => [
      anchor[0] + Math.round(((vertex[0] - anchor[0]) * permille) / 1000),
      anchor[1] + Math.round(((vertex[1] - anchor[1]) * permille) / 1000),
    ]);
    let contained = scenePolygonArea(footprint) > 0;
    for (const vertex of footprint) {
      if (!scenePointInPolygon(vertex[0], vertex[1], parcel)) contained = false;
    }
    if (contained) return footprint;
  }
  return null;
}

/**
 * THE CONDITION LADDER — a FIRST-MATCH chain, and the ORDER IS LOAD-BEARING: ruin
 * outranks fire, fire outranks damage, and renewal is only readable once neglect is
 * ruled out. Reordering these rungs silently re-grades every town.
 * @param {Record<string, unknown>} profile
 * @param {number} agePermille
 * @returns {string}
 */
function conditionOf(profile, agePermille) {
  const C = T.CONDITION_THRESHOLDS;
  const war = Math.max(coefficient(profile.warScar), coefficient(profile.occupation));
  const neglect = coefficient(profile.neglect);
  if (coefficient(profile.abandonment) >= C.RUINED_ABANDONMENT_FLOOR / 1000) return 'ruined';
  if (war >= C.BURNED_WAR_FLOOR / 1000) return 'burned';
  if (war >= C.DAMAGED_WAR_FLOOR / 1000) return 'damaged';
  if (neglect >= C.WORN_NEGLECT_FLOOR / 1000 || agePermille >= C.WORN_AGE_FLOOR) return 'worn';
  if (Math.max(coefficient(profile.repair), coefficient(profile.construction))
    >= C.PRISTINE_RENEWAL_FLOOR / 1000 && neglect < C.PRISTINE_NEGLECT_CEILING / 1000) return 'pristine';
  return 'sound';
}

/**
 * COMPILE THE TC-4 BUILDINGS LAYER.
 *
 * @param {object} input
 * @param {unknown} input.buildings the manifest's canonical scene buildings
 * @param {unknown} input.semantics the manifest's semantics table (the labels)
 * @param {CartographyWardRow[]} input.wards
 * @param {CartographyParcelRow[]} input.parcels
 * @param {InstitutionParcelBinding[]} input.institutionBindings the TC-3b receipt
 * @param {unknown} input.settlement the audience-projected settlement
 * @param {string} input.digest the manifest's mapModelDigest
 * @param {string} input.tier the canonical tier
 * @param {string} input.placement the derived cohesion placement
 * @param {number|null|undefined} input.fabricAccumulation01 the morphology evidence
 * @returns {{ buildings: CartographyBuildingRow[], receipts: Readonly<{
 *   buildingCount: number, institutionCount: number, instanceCount: number,
 *   dwellingCount: number, multiplicity: MultiplicityReceipt[], overflowCount: number,
 *   bytes: number, byteBudget: number, withinBudget: boolean }> }}
 */
export function compileTownBuildingLayers(input) {
  const tier = input.tier;
  const perParcel = cartographyBand(T.BUILDINGS_PER_PARCEL, tier);
  const totalCap = cartographyBand(T.MAXIMUM_CARTOGRAPHY_BUILDINGS, tier);
  const bindings = input.institutionBindings;
  const settlement = record(input.settlement);
  const span = /** @type {Readonly<Record<string, ReadonlyArray<number>>>} */ (T.MULTIPLICITY.POPULATION_SPAN)[CARTOGRAPHY_TIERS[cartographyTierIndex(tier)]];
  const population = typeof settlement.population === 'number' ? settlement.population : span[0];
  const popWithin01 = clamp((population - span[0]) / (span[1] - span[0]), 0, 1);
  const fabric01 = typeof input.fabricAccumulation01 === 'number' ? input.fabricAccumulation01 : null;

  /** @type {Map<string, Record<string, unknown>>} */
  const canonicalById = new Map();
  for (const raw of list(input.buildings)) {
    const row = record(raw);
    if (typeof row.semanticId === 'string') canonicalById.set(row.semanticId, row);
  }
  /** @type {Map<string, unknown>} */
  const labelById = new Map();
  for (const raw of list(input.semantics)) {
    const row = record(raw);
    if (row.entityKind === 'building' && typeof row.sceneId === 'string') labelById.set(row.sceneId, row.label);
  }
  const parcelById = new Map(input.parcels.map((parcel) => [parcel.id, parcel]));
  /** @type {Map<string, CartographyParcelRow[]>} */
  const wardParcels = new Map();
  for (const parcel of [...input.parcels].sort((a, b) => byCodepoint(a.id, b.id))) {
    const siblings = wardParcels.get(parcel.wardId) || [];
    siblings.push(parcel);
    wardParcels.set(parcel.wardId, siblings);
  }

  /** Non-flagship occupancy per parcel; flagships are exempt (§6.3a3).
   *  @type {Map<string, number>} */
  const occupancy = new Map();
  /** @type {Map<string, number>} the flagship arrival ordinal, per parcel */
  const flagshipsAt = new Map();
  /** @type {Map<string, Record<string, unknown>>} the ward's first bound profile */
  const wardProfile = new Map();
  /** @type {CartographyBuildingRow[]} */
  const rows = [];
  /** @type {MultiplicityReceipt[]} */
  const multiplicity = [];
  /** @type {Set<number>} anchors whose ward filled up; their emission has ended */
  const exhausted = new Set();

  // A-8: resolve every canonical count FIRST, so the round ceiling is known and the
  // receipt carries the resolved number even for an anchor that never gets to emit.
  let ceiling = 1;
  for (const binding of bindings) {
    const counted = resolveInstitutionMultiplicity({
      label: labelById.get(binding.institutionRef),
      population,
      tier,
      prosperity: record(settlement.economicState).prosperity,
      digest: input.digest,
      anchorKey: binding.anchorKey,
    });
    multiplicity.push({ institutionRef: binding.institutionRef, ...counted, emitted: 0 });
    ceiling = Math.max(ceiling, counted.resolved);
  }

  /**
   * DRESS ONE ROW from existing typed facts (design §4.5). Returns null when the
   * footprint could not be packed — the caller decides whether that is a skip
   * (dwelling, best-effort) or a named premise error (institution, canonical).
   *
   * The conditional keys are DROPPED, never nulled: the contract requires
   * `institutionRef`/`placement` present iff institution, and `lynchElement` only on
   * a landmark, so an always-present key carrying null would fail validation.
   *
   * @param {CartographyParcelRow} parcel @param {number} subcell @param {number} shrink
   * @param {string} id @param {string} subject @param {number} instance
   * @param {Record<string, unknown>} profile @param {RowDress} dress
   * @returns {CartographyBuildingRow | null}
   */
  const dressRow = (parcel, subcell, shrink, id, subject, instance, profile, dress) => {
    const footprint = packFootprint(parcel.polygon, subcell, shrink);
    if (!footprint) return null;
    const jitter = jitterOf(input.digest, subject, instance);
    const institution = typeof dress.institutionRef === 'string';
    // A dark fabric layer contributes NO term (the fabricRead law): an institution
    // falls back to its own history mark, never to a 0.5 that would invent evidence.
    const history01 = coefficient(profile.historyMark) / 15;
    const agePermille = clamp(Math.round(1000 * (institution
      ? 0.5 * history01 + 0.5 * (fabric01 ?? history01)
      : fabric01 ?? 0.5)) + 50 * jitter, 0, 1000);
    return {
      id,
      parcelId: parcel.id,
      role: institution ? 'institution' : 'dwelling',
      footprint,
      heightPermille: dress.heightPermille,
      agePermille,
      condition: conditionOf(profile, agePermille),
      styleToken: dress.styleToken,
      provenance: generatedProvenance(),
      // A-10: prominence decides institutional space, feel decides dwelling grain.
      decidedBy: institution ? 'prominence' : 'feel',
      ...(institution ? { institutionRef: dress.institutionRef, placement: input.placement } : {}),
      ...(dress.landmark ? { lynchElement: 'landmark' } : {}),
    };
  };

  // ── (a) INSTITUTIONS — round 1 is the flagships, rounds 2..N the instances ────
  for (let k = 1; k <= ceiling; k++) {
    for (let index = 0; index < bindings.length; index++) {
      const slot = multiplicity[index];
      if (k > slot.resolved || exhausted.has(index)) continue;
      const binding = bindings[index];
      const bound = parcelById.get(binding.parcelId);
      if (!bound) throw premise(`institution ${binding.institutionRef} names parcel ${binding.parcelId}, which this block did not carve`);
      /** @type {CartographyParcelRow | null} */
      let parcel = null;
      let subcell = 0;
      if (k === 1) {
        // The flagship takes its BOUND parcel and is exempt from the occupancy cap:
        // a canonical institution always appears, or the map forks from the dossier.
        const arrived = flagshipsAt.get(bound.id) || 0;
        flagshipsAt.set(bound.id, arrived + 1);
        if (!wardProfile.has(bound.wardId)) {
          wardProfile.set(bound.wardId, record(record(canonicalById.get(binding.institutionRef)).conditionProfile));
        }
        parcel = bound;
        subcell = arrived % 4;
      } else if (rows.length < totalCap) {
        const siblings = wardParcels.get(bound.wardId) || [];
        const at = siblings.findIndex((row) => row.id === bound.id);
        for (let step = 0; step < siblings.length; step++) {
          const candidate = siblings[(at + k - 1 + step) % siblings.length];
          if (!parcel && (occupancy.get(candidate.id) || 0) < perParcel) parcel = candidate;
        }
        if (!parcel) exhausted.add(index);
        if (parcel) {
          subcell = occupancy.get(parcel.id) || 0;
          occupancy.set(parcel.id, subcell + 1);
        }
      }
      if (!parcel) continue;
      // Flagship and instance differ ONLY by the ordinal: the id's instance number,
      // the dress stamp, and the landmark test (A-10.3 — only a PROMINENT flagship
      // is a Lynch landmark). One construction, so the two can never diverge.
      const canonical = record(canonicalById.get(binding.institutionRef));
      const area = scenePolygonArea(planPolygon(canonical.footprint));
      const bands = T.INSTITUTION_PROMINENCE_AREA_PLAN2;
      const grade = area >= bands.large ? 'large' : area >= bands.medium ? 'medium' : 'small';
      const row = dressRow(parcel, subcell, T.FOOTPRINT_SHRINK_PERMILLE[grade],
        `carto:building:${slugify(binding.anchorKey).slice(0, 90)}:i${String(k).padStart(2, '0')}`,
        binding.anchorKey, k, record(canonical.conditionProfile), {
          heightPermille: clamp(Math.round((1000 * (coefficient(canonical.heightCm)
            / (coefficient(canonical.planUnitCm) || 1))) / T.HEIGHT_PLAN_CEILING), 0, 1000),
          styleToken: `${slugify(canonical.shapeFamily)}.${slugify(canonical.skinId)}`,
          institutionRef: binding.institutionRef,
          landmark: k === 1 && area >= bands.large,
        });
      if (!row && k === 1) throw premise(`institution ${binding.institutionRef} cannot pack inside parcel ${parcel.id}`);
      if (row) {
        rows.push(row);
        slot.emitted += 1;
      }
    }
  }

  // ── (b) DWELLING FILL — ward-local, slot-bounded, best-effort (D-5) ──────────
  const dwellingBand = cartographyBand(T.DWELLING_TARGET, tier);
  const dwellingHeight = cartographyBand(T.DWELLING_HEIGHT_PERMILLE, tier);
  for (const ward of [...input.wards].sort((a, b) => byCodepoint(a.id, b.id))) {
    const siblings = wardParcels.get(ward.id) || [];
    let free = 0;
    for (const parcel of siblings) free += perParcel - (occupancy.get(parcel.id) || 0);
    const target = Math.min(free, Math.round((((dwellingBand * (500 + 500 * popWithin01)) / 1000) * ward.tonePermille) / 1000));
    // Absent per-row facts, a dwelling reads the ward's first bound institution's
    // profile — the nearest canonical evidence — and all-zero where none bound.
    const profile = record(wardProfile.get(ward.id));
    let emitted = 0;
    for (const parcel of siblings) {
      for (let subcell = occupancy.get(parcel.id) || 0; subcell < perParcel; subcell++) {
        if (emitted >= target || rows.length >= totalCap) continue;
        const ordinal = emitted + 1;
        const row = dressRow(parcel, subcell, T.FOOTPRINT_SHRINK_PERMILLE.dwelling,
          `carto:dwelling:${ward.id}:${String(ordinal).padStart(3, '0')}`,
          ward.id, ordinal, profile, {
            heightPermille: clamp(dwellingHeight
              + 20 * jitterOf(input.digest, ward.id, ordinal), 0, 1000),
            styleToken: `dwelling.${slugify(ward.kind)}`,
          });
        occupancy.set(parcel.id, subcell + 1);
        if (row) {
          rows.push(row);
          emitted += 1;
        }
      }
    }
  }

  rows.sort((left, right) => byCodepoint(left.id, right.id));
  /** @type {Set<string>} */
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.id)) throw premise(`duplicate building id ${row.id}`);
    seen.add(row.id);
  }
  let overflowCount = 0;
  for (const slot of multiplicity) overflowCount += slot.resolved - slot.emitted;
  const dwellingCount = rows.filter((row) => row.role === 'dwelling').length;
  const bytes = new TextEncoder().encode(stableSceneStringify({ buildings: rows })).byteLength;
  const byteBudget = totalCap * T.TC4_ROW_BYTES_BAND;
  if (bytes > byteBudget) {
    throw premise(`the TC-4 layer measures ${bytes} bytes against the ${tier} band of ${byteBudget}`);
  }
  return {
    buildings: rows,
    receipts: Object.freeze({
      buildingCount: rows.length,
      institutionCount: multiplicity.length,
      instanceCount: rows.length - dwellingCount - multiplicity.length,
      dwellingCount,
      multiplicity, overflowCount,
      bytes, byteBudget,
      withinBudget: bytes <= byteBudget,
    }),
  };
}
