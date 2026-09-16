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
 * subcells that are, by construction, inside it and non-overlapping — and the
 * subdivision RECURSES, so the cells form an unbounded tree rather than a set of
 * four slots (see THE CELL ADDRESS below). A footprint is a cell of that tree,
 * optionally corner-truncated, scaled toward its own rounded centroid, so it is
 * inside by construction; the integer ROUNDING is then re-checked against the
 * PARCEL with `scenePointInPolygon`, on every vertex AND the anchor. The shrink
 * ladder is a FIXED three-rung `for`, not a retry loop: there is no clipping, no
 * positional jitter, no overlap repair and no "try again with a smaller box"
 * anywhere in this file.
 *
 * ── THE CELL ADDRESS, AND THE TWO DEFECTS IT REMOVES THE HABITAT OF (CG-2) ───
 * The packer used to take a mod-4 SLOT, and the layer kept TWO counters over the
 * same parcel: `flagshipsAt` for round-1 institutions and `occupancy` for everything
 * else. Both leak the same way — the fifth flagship on a parcel wrapped onto slot 0,
 * and an instance or dwelling started again at slot 0 over a flagship that had taken
 * it. Because a footprint is a PURE FUNCTION of (parcel, slot, shrink), those two
 * leaks did not crowd a parcel: they drew buildings at IDENTICAL COORDINATES, one
 * exactly on top of another. Measured over the 504-row calibration corpus at
 * 79b78881c: 26.42% of 53,420 drawn buildings shared a footprint vertex-for-vertex
 * with another building in the same settlement; 5,932 of 5,932 duplicate groups lay
 * entirely inside a SINGLE parcel; 4,518 parcels held more buildings than the four
 * slots the old theorem afforded, the worst holding 29. A stacked pair is not a
 * cosmetic repeat: `cartographyProperty.js` subtracts member footprints from the
 * parcel ring under an EVEN-ODD fill, so two identical holes cancel and the yard
 * under a stacked pair renders as solid ground.
 *
 * So the slot became an ADDRESS. Index 0..3 are the four depth-1 subcells — the same
 * four cells the old packer had — 4..19 the sixteen depth-2 cells, 20..83 the
 * sixty-four depth-3 cells, and so on to FOOTPRINT_CELL_MAX_DEPTH. (The CELL at 0..3
 * is unchanged; the FOOTPRINT drawn in it is not, because the form dress below moves
 * every row. This wave shifts same-seed output at every tier and the calibration
 * suite's shift record states exactly what moved.) There is ONE ledger now, and a
 * flagship consumes a cell from it. A flagship is still exempt from the per-parcel
 * BAND and from the total cap — a canonical institution always appears — but exemption
 * from a band was never a licence to be issued a cell another building already holds.
 *
 * ── THE FORM IS DRESS, LIKE THE HEIGHT AND THE AGE (CG-2) ────────────────────
 * A unique cell fixes WHERE a building stands, not WHAT SHAPE it is: subcells 0, 1
 * and 2 of any triangle are exact TRANSLATES of one another and subcell 3 is their
 * point reflection (20,000 of 20,000 integer triangles), so one cell tree at four
 * class shrinks is a one-shape vocabulary. The footprint is therefore DRESSED — a
 * size step and an optional truncated corner, off one `sceneDigest` of the same
 * (digest, subject, instance) the height and age nudges already read, under its own
 * ASPECT key so a form step cannot alias an age step. The vocabulary BANDS BY TIER
 * (FOOTPRINT_FORM_VARIANTS): a thorp draws three sizes of one triangle because a
 * thorp genuinely is a dozen of the same cottage, a metropolis twelve forms.
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

import { clamp } from '../../kernel/math.js';
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
 * THE FORM ASPECT of that one domain, and why it is a FIELD rather than a second
 * label. TC-4's determinism scan pins ONE `carto:` label per leaf, and it is right to:
 * a sprawl of labels is how a digest domain quietly becomes a fork family. The form
 * stamp needs separation from the age/height stamp all the same — both read the same
 * (digest, subject, instance) triple, so sharing a digest would make a building's
 * SHAPE a function of its age nudge and the map would grow a correlation nobody
 * designed. A distinct key in the digest OBJECT gives exactly that separation without
 * a second label: `sceneDigest` hashes the whole named input, so the two calls cannot
 * collide.
 */
const FORM_ASPECT = 'form';

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
 * THE FORM STAMP for one subject: which of the tier's `variants` dressed footprints
 * this building takes. `variants` is a multiple of three, so `% 3` is the size step
 * (−1 | 0 | +1) and `/ 3` the cut slot (0 = uncut, 1..3 = truncate that corner) with
 * neither axis starved of the other.
 * @param {unknown} digest @param {string} subject @param {number} instance
 * @param {number} variants
 * @returns {{ sizeStep: number, corner: number }}
 */
function formOf(digest, subject, instance, variants) {
  const stamp = Number.parseInt(sceneDigest({
    domain: DRESS_DOMAIN, aspect: FORM_ASPECT, digest, subject, instance,
  }).slice(-8), 16);
  const variant = (Number.isFinite(stamp) ? stamp : 0) % Math.max(1, variants);
  return { sizeStep: (variant % 3) - 1, corner: Math.floor(variant / 3) };
}

/**
 * THE MEDIAL SUBDIVISION of one integer triangle, in the fixed order the address
 * digits below index: `[v0,m01,m20]`, `[v1,m12,m01]`, `[v2,m20,m12]`, `[m01,m12,m20]`.
 * Each is inside its parent by construction, so a cell at ANY depth is inside the
 * parcel by induction — which is the whole containment theorem, unchanged by CG-2.
 * @param {PlanPoint[]} triangle
 * @returns {PlanPoint[][]}
 */
function medialSubcells(triangle) {
  /** @param {PlanPoint} a @param {PlanPoint} b @returns {PlanPoint} */
  const mid = (a, b) => [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)];
  const [v0, v1, v2] = triangle;
  const [m01, m12, m20] = [mid(v0, v1), mid(v1, v2), mid(v2, v0)];
  return [[v0, m01, m20], [v1, m12, m01], [v2, m20, m12], [m01, m12, m20]];
}

/**
 * THE CELL AT ADDRESS `index`. Depth d holds 4^d cells and starts at (4^d − 4)/3, so
 * 0..3 are the depth-1 subcells the pre-CG-2 slots named, 4..19 depth 2,
 * 20..83 depth 3. The descent is a BOUNDED `for` over FOOTPRINT_CELL_MAX_DEPTH, never
 * a `while`: an address past the tree returns null rather than wrapping, because
 * wrapping is precisely the defect this replaced.
 * @param {PlanPoint[]} parcel
 * @param {number} index
 * @returns {PlanPoint[] | null}
 */
function cellAt(parcel, index) {
  if (!Number.isInteger(index) || index < 0) return null;
  let offset = 0;
  let span = 4;
  let depth = 0;
  for (let level = 1; level <= T.FOOTPRINT_CELL_MAX_DEPTH; level++) {
    if (depth === 0 && index < offset + span) depth = level;
    if (depth === 0) {
      offset += span;
      span *= 4;
    }
  }
  if (depth === 0) return null;
  // The base-4 digits of the local index, gathered least-significant first and then
  // descended most-significant first. Written as two integer loops rather than one
  // with a `4 ** step` place value: TC-2's purity scan bans `**` outright, because
  // exponentiation is implementation-approximated and would fork the same seed across
  // engines while every same-engine golden stayed green.
  let local = index - offset;
  /** @type {number[]} */
  const digits = [];
  for (let step = 0; step < depth; step++) {
    digits.push(local % 4);
    local = Math.floor(local / 4);
  }
  let cell = parcel;
  for (let step = depth - 1; step >= 0; step--) cell = medialSubcells(cell)[digits[step]];
  return cell;
}

/**
 * TRUNCATE one corner of a cell into a quadrilateral — the chamfer that gives the
 * form vocabulary a second axis. Both new vertices are convex combinations of the
 * cell's OWN vertices, so a cut cell is inside the cell and therefore inside the
 * parcel: containment stays a theorem rather than becoming a check that happens to
 * pass. `corner` 0 means no cut at all, so the triangle keeps its place in the
 * vocabulary and a tier with three variants never draws a quadrilateral.
 * @param {PlanPoint[]} cell a triangle
 * @param {number} corner 0 = uncut, 1..3 = truncate vertex corner−1
 * @returns {PlanPoint[]}
 */
function cutCorner(cell, corner) {
  if (corner <= 0) return cell;
  const k = (corner - 1) % 3;
  const [p0, p1, p2] = [cell[k], cell[(k + 1) % 3], cell[(k + 2) % 3]];
  const cut = T.FOOTPRINT_CORNER_CUT_PERMILLE;
  /** @param {PlanPoint} a @param {PlanPoint} b @returns {PlanPoint} */
  const along = (a, b) => [
    a[0] + Math.round(((b[0] - a[0]) * cut) / 1000),
    a[1] + Math.round(((b[1] - a[1]) * cut) / 1000),
  ];
  return [along(p0, p1), p1, p2, along(p0, p2)];
}

/**
 * PACK ONE FOOTPRINT into the cell at `index` of a parcel, by the fixed shrink ladder.
 *
 * Returns null when the address is past the tree, or when no rung yields a
 * positive-area polygon whose every vertex AND anchor passes the exact predicate.
 *
 * @param {PlanPoint[]} parcel the parcel triangle
 * @param {number} index the medial cell ADDRESS, 0-based and unbounded
 * @param {number} start the dressed shrink permille
 * @param {number} corner 0 = uncut, 1..3 = truncate that corner
 * @returns {PlanPoint[] | null}
 */
function packFootprint(parcel, index, start, corner) {
  const cell = cellAt(parcel, index);
  if (!cell) return null;
  const form = cutCorner(cell, corner);
  /** @type {PlanPoint} */
  const anchor = [roundedMean(form.map((p) => p[0])), roundedMean(form.map((p) => p[1]))];
  if (!scenePointInPolygon(anchor[0], anchor[1], parcel)) return null;
  for (let step = 0; step < 3; step++) {
    const permille = Math.max(T.FOOTPRINT_SHRINK_FLOOR, start - step * T.FOOTPRINT_SHRINK_STEP);
    /** @type {PlanPoint[]} */
    const footprint = form.map((vertex) => [
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
  const formVariants = cartographyBand(T.FOOTPRINT_FORM_VARIANTS, tier);
  const bindings = input.institutionBindings;
  const settlement = record(input.settlement);
  const span = /** @type {Readonly<Record<string, ReadonlyArray<number>>>} */ (T.MULTIPLICITY.POPULATION_SPAN)[CARTOGRAPHY_TIERS[cartographyTierIndex(tier)]];
  // ⛔ THE GUARD IS `Number.isFinite`, NEVER `typeof` ALONE, and the conjunct is
  // load-bearing rather than belt-and-braces: `typeof NaN === 'number'` is TRUE, so a
  // bare typeof test admits NaN and ±Infinity as populations. A NaN population makes
  // `popWithin01` NaN, which makes the dwelling `target` below NaN, which makes
  // `emitted >= target` FALSE for EVERY value of `emitted` — so the per-ward dwelling
  // cap FAILED OPEN rather than binding. Measured on a thorp (span 8..60, tone 500,
  // eight free parcels): population 34 emits 3 dwellings and NaN emitted 8, while
  // +Infinity read as the band ceiling (4) and −Infinity as the band floor (2). The
  // estate already refuses a non-finite population at the corpus door
  // (`refuseNonFiniteWorld`, scripts/review/readerCorpus.mjs); this leaf now agrees
  // with that reading instead of quietly drawing a town out of one. Same shape as
  // `coefficient` above, which is this file's own already-correct spelling.
  const population = typeof settlement.population === 'number' && Number.isFinite(settlement.population)
    ? settlement.population : span[0];
  const popWithin01 = clamp((population - span[0]) / (span[1] - span[0]), 0, 1);
  // The same guard one field along, because a non-finite fabric reading is ABSENT
  // evidence and not evidence of an ancient town: `null` here routes to the fabricRead
  // law's honest fallback, exactly as a dark fabric layer does. +Infinity used to drive
  // `agePermille` to the 1000 ceiling (every building 'worn'), and NaN did not merely
  // mis-grade — it reached `stableSceneStringify`'s finite check at the byte measure and
  // THREW, taking the whole cartography compile down with it.
  const fabric01 = typeof input.fabricAccumulation01 === 'number' && Number.isFinite(input.fabricAccumulation01)
    ? input.fabricAccumulation01 : null;

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

  /**
   * THE ONE CELL LEDGER, over EVERY emitted building — flagships included (CG-2).
   * A flagship is exempt from the per-parcel BAND and from the total cap; it is not
   * exempt from the ledger, because the two-counter split it used to enjoy handed the
   * same cell address to a flagship and to whatever came next, and the packer draws
   * the same footprint for the same address. The value is the NEXT free address, so
   * it may legitimately exceed `perParcel` on a parcel that flagships over-subscribe.
   * @type {Map<string, number>}
   */
  const occupancy = new Map();
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
    // THE FORM, dressed from the row's own facts. The size step is clamped to the
    // shrink FLOOR and to 1000 so a dressed start can never invert the ladder.
    const form = formOf(input.digest, subject, instance, formVariants);
    const start = clamp(
      shrink + T.FOOTPRINT_FORM_SHRINK_STEP * form.sizeStep, T.FOOTPRINT_SHRINK_FLOOR, 1000,
    );
    const footprint = packFootprint(parcel.polygon, subcell, start, form.corner);
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
        // The flagship takes its BOUND parcel and is exempt from the occupancy BAND:
        // a canonical institution always appears, or the map forks from the dossier.
        // It draws its cell from the ONE ledger all the same — an exemption from a
        // density band is not a licence to stand on top of the building next door.
        if (!wardProfile.has(bound.wardId)) {
          wardProfile.set(bound.wardId, record(record(canonicalById.get(binding.institutionRef)).conditionProfile));
        }
        parcel = bound;
        subcell = occupancy.get(bound.id) || 0;
        occupancy.set(bound.id, subcell + 1);
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
          // ⛔ THE DIVISOR FLOOR IS `Math.max`, NEVER `|| 1`, and the difference is the
          // whole guard: `|| 1` is a FALSY screen, so it substitutes 1 for the values
          // `coefficient` has ALREADY mapped to 0 and lets every tiny POSITIVE unit
          // through untouched. A denormal `planUnitCm` therefore divided rather than
          // floored, and the quotient was +Infinity — absent from the `>= 0`/`<= 1000`
          // reading below because a comparison against a non-finite is simply FALSE, so
          // the clamp stopped clamping and the ceiling was reached by saturation rather
          // than by measurement. `sceneBuildingFabric.js` owns the same quantity one
          // module along and already spells it `/ Math.max(1, planUnitCm)`; this line is
          // now the same intent in the same words. Same shape as `coefficient` and the
          // population guard above — this file's own already-correct spellings.
          heightPermille: clamp(Math.round((1000 * (coefficient(canonical.heightCm)
            / Math.max(1, coefficient(canonical.planUnitCm)))) / T.HEIGHT_PLAN_CEILING), 0, 1000),
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
    // CLAMPED AT ZERO, and the clamp is load-bearing (CG-2): a parcel that flagships
    // over-subscribe now carries an occupancy ABOVE the band, and an unclamped term
    // would let one crowded parcel borrow free slots away from its own siblings.
    let free = 0;
    for (const parcel of siblings) free += Math.max(0, perParcel - (occupancy.get(parcel.id) || 0));
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
