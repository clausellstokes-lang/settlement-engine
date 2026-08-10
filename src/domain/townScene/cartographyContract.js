/**
 * domain/townScene/cartographyContract.js — THE TOWN-CARTOGRAPHY CONTRACT (TC-1,
 * docs/DESIGN_TOWN_CARTOGRAPHY.md §3, §7, and amendments A-1, A-3, A-8..A-11).
 *
 * THE ONE LAW (design §1) decides this file's shape: the cartography layers are a
 * SYNTHESIS STAGE INSIDE the TownSceneManifest, never a parallel generator. So the
 * four layers are an ADDITIVE, all-or-nothing block hung off the existing manifest,
 * validated by the existing contract validator, serialized by the existing canonical
 * serializer, and digested by the existing digest. Nothing here mints a second
 * settlement truth, and every reference this block carries has to resolve back into
 * a record the manifest ALREADY publishes.
 *
 * ── WHY ONE NESTED KEY RATHER THAN FOUR TOP-LEVEL ONES ───────────────────────
 * Design §3 draws the extension as four sibling layers. Two of the four names it
 * uses are ALREADY TAKEN at the manifest's top level by records of a different
 * shape: `buildings` (the 3D scene buildings, with shapeFamily/lodFamily/headingStep)
 * and, inside `streets`, `gates` and `bridges` (the wall openings and the water
 * crossings the terrain network already compiles). Two different record shapes under
 * one key would be the exact fork the ONE LAW forbids, one level down. So the four
 * layers live under a single additive top-level key, `cartography`, which
 *   - keeps the addition to ONE optional key (an old manifest still validates
 *     unchanged, a new one is a strict superset),
 *   - gives the block its own schemaVersion without touching the manifest's
 *     (TOWN_SCENE_SCHEMA_VERSION stays 1, so no recorded golden moves), and
 *   - makes the street layer REFERENCE the existing gates and bridges by id
 *     instead of restating them, which is the ONE LAW applied to geometry.
 *
 * ── CLOSED VOCABULARIES (the FINITE-SEMANTICS LAW) ───────────────────────────
 * Every categorical field in this block draws from a frozen list exported here.
 * Ward kinds in particular are NOT a new vocabulary: they are the estate's twelve
 * district categories verbatim, because a ward is a district drawn in ink, and a
 * ward kind no district could carry would be a second truth about the same place.
 * The producer binding is asserted in tests/domain/townSceneCartography.test.js
 * against districtProfile.js, which this module deliberately does not import: that
 * module pulls the faction, causal, condition and threat derivations behind it, and
 * the scene chunk has no business carrying them.
 *
 * ── NO COLOUR, EVER (A-9) ────────────────────────────────────────────────────
 * The manifest carries tone INTENSITY in permille and never a colour value. Colour
 * derives from src/design/tokens.js at paint time. The validator enforces that by
 * rejecting any string in the block that reads as a raw colour, so the map cannot
 * smuggle hex through a data layer any more than through a stylesheet.
 *
 * ── NO FLOATS, NO SEEDS ──────────────────────────────────────────────────────
 * Integer plan coordinates only (the interiors discipline), scalars in permille
 * (the house idiom the existing districtProfile/wall/scar records already use), and
 * the per-building style selector is a bounded TOKEN rather than a seed: the
 * manifest's constitutional no-seed law is what makes it safe to hand a compiled
 * manifest to a player-facing renderer.
 *
 * Pure and headless: no store, no clock, no randomness, no I/O. Zero any-casts.
 *
 * @enforced-by tests/domain/townSceneCartography.test.js,
 *   tests/property/townCartographyDormancyGolden.test.js
 */

/**
 * Bumped only on a breaking change to the cartography block's shape. v2 (TC-3) made
 * `name` REQUIRED on every street and ward row. There is deliberately NO v1
 * compatibility path: a TownSceneManifest is a DERIVED artifact, rebuilt from the
 * settlement on every compile, so a v1 block can only come from a stale cache that
 * must be recompiled rather than migrated. Accepting both versions would create the
 * second schema key the ONE LAW forbids.
 */
export const TOWN_CARTOGRAPHY_SCHEMA_VERSION = 2;

/** The virtual simulation-rule key the whole program ships behind (design §8). */
export const TOWN_CARTOGRAPHY_RULE_KEY = 'townCartographyEnabled';

/** The single additive top-level manifest key the four layers live under. */
export const TOWN_CARTOGRAPHY_MANIFEST_KEY = 'cartography';

/** The block's exact key set. All four layers, or none: a partial block is invalid. */
export const TOWN_CARTOGRAPHY_BLOCK_KEYS = Object.freeze([
  'buildings',
  'parcels',
  'schemaVersion',
  'streets',
  'wards',
]);

/** The street layer's exact key set. Gates and bridges are REFERENCES, never copies. */
export const TOWN_CARTOGRAPHY_STREET_KEYS = Object.freeze([
  'arterials',
  'bridgeRefs',
  'gateRefs',
  'lanes',
]);

/**
 * WARD KINDS — the estate's twelve district categories, verbatim (districtProfile.js
 * DISTRICT_CATEGORIES). Sorted here because every cartography vocabulary is sorted;
 * the producer binding is an exact-set-both-ways test, so order is free.
 * @type {ReadonlyArray<string>}
 */
export const TOWN_CARTOGRAPHY_WARD_KINDS = Object.freeze([
  'arcane', 'civic', 'craft', 'criminal', 'foreign', 'industrial',
  'merchant', 'military', 'noble', 'other', 'religious', 'residential',
]);

/** Street classes (design §3, §4.2): field-followed arterials, colonized lanes. */
export const TOWN_CARTOGRAPHY_STREET_CLASSES = Object.freeze(['arterial', 'lane']);

/** A footprint is either a projection of a catalog institution, or population fill. */
export const TOWN_CARTOGRAPHY_BUILDING_ROLES = Object.freeze(['dwelling', 'institution']);

/**
 * BUILDING CONDITION — a closed, ORDERED ladder (design §3, §4.5: condition derives
 * from stressors and war state). Index is meaning: 0 is best, last is worst, so a
 * consumer may compare rungs without a second table.
 * @type {ReadonlyArray<string>}
 */
export const TOWN_CARTOGRAPHY_CONDITIONS = Object.freeze([
  'pristine', 'sound', 'worn', 'damaged', 'burned', 'ruined',
]);

/**
 * PROVENANCE KINDS (design §3, A-1). `generated` carries no ref; `pulse` carries the
 * tick reference that caused the change; `user_edit` carries the map-edit ANCHOR
 * string, which is the vocabulary the existing edit projection already speaks (map
 * edits are anchor-keyed, never coordinate-keyed). An edit's provenance outranks
 * synthesis: the field and skeleton stages treat user geometry as a boundary
 * condition and never overwrite it.
 * @type {ReadonlyArray<string>}
 */
export const TOWN_CARTOGRAPHY_PROVENANCE_KINDS = Object.freeze([
  'generated', 'pulse', 'user_edit',
]);

/** A-8 COHESION PLACEMENT — the closed placement vocabulary a cohesion score maps to. */
export const TOWN_CARTOGRAPHY_PLACEMENT_MODES = Object.freeze([
  'clustered', 'dispersed_chaotic', 'dispersed_orderly', 'district',
]);

/**
 * A-10 URBAN MORPHOLOGY LAW — the determination chain's geometry-deciding layers.
 * `tokens` (colour) is deliberately absent: it decides paint, never geometry, so a
 * geometry record may never claim it. The chain is TOTAL: every ward, parcel and
 * building traces to exactly one of these.
 * @type {ReadonlyArray<string>}
 */
export const TOWN_CARTOGRAPHY_DECIDING_LAYERS = Object.freeze([
  'feel', 'lynch', 'prominence', 'state',
]);

/** A-10.3 — the five Lynch elements the synthesis aims at and the rubric verifies. */
export const TOWN_CARTOGRAPHY_LYNCH_ELEMENTS = Object.freeze([
  'district', 'edge', 'landmark', 'node', 'path',
]);

/**
 * A-3 BYTE BUDGET — the per-tier budget slot NAMES this program will carry. The
 * NUMBERS are deliberately absent at TC-1: A-3 says they are measured at TC-2 and
 * ratchet-pinned then, and authoring a number nobody measured would be the overclaim
 * the evidence law forbids. Declared here so the slot has one spelling.
 * @type {ReadonlyArray<string>}
 */
export const TOWN_CARTOGRAPHY_BUDGET_KEYS = Object.freeze([
  'maximumParcels', 'maximumStreetVertices', 'maximumWards',
]);

/**
 * THE TOTALITY REGISTRY — every closed vocabulary this contract owns, in one place,
 * so a walker can census them and a new vocabulary cannot enter unregistered.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const TOWN_CARTOGRAPHY_VOCABULARIES = Object.freeze({
  buildingRoles: TOWN_CARTOGRAPHY_BUILDING_ROLES,
  conditions: TOWN_CARTOGRAPHY_CONDITIONS,
  decidingLayers: TOWN_CARTOGRAPHY_DECIDING_LAYERS,
  lynchElements: TOWN_CARTOGRAPHY_LYNCH_ELEMENTS,
  placementModes: TOWN_CARTOGRAPHY_PLACEMENT_MODES,
  provenanceKinds: TOWN_CARTOGRAPHY_PROVENANCE_KINDS,
  streetClasses: TOWN_CARTOGRAPHY_STREET_CLASSES,
  wardKinds: TOWN_CARTOGRAPHY_WARD_KINDS,
});

/**
 * @typedef {{ kind: string, ref: string|null }} CartographyProvenance
 *
 * @typedef {{
 *   id: string,
 *   classKind: string,
 *   name: string,
 *   polyline: Array<[number, number]>,
 *   widthPlan: number,
 *   provenance: CartographyProvenance,
 *   decidedBy: string,
 * }} CartographyStreet
 *
 * @typedef {{
 *   id: string,
 *   kind: string,
 *   name: string,
 *   polygon: Array<[number, number]>,
 *   tonePermille: number,
 *   districtId: string|null,
 *   lynchElement: string,
 *   provenance: CartographyProvenance,
 *   decidedBy: string,
 * }} CartographyWard
 *
 * @typedef {{
 *   id: string,
 *   wardId: string,
 *   polygon: Array<[number, number]>,
 *   anchor: [number, number],
 *   provenance: CartographyProvenance,
 *   decidedBy: string,
 * }} CartographyParcel
 *
 * CONDITIONAL KEYS, declared on the OWNING typedef and DROPPED when empty:
 *   institutionRef  present only when role is `institution`; it must resolve
 *                   through the manifest's own semantics table, which is what makes
 *                   "the map and the dossier cannot disagree" structural.
 *   placement       present only when role is `institution` (A-8: a dwelling has no
 *                   cohesion class, so recording one would invent a fact).
 *   lynchElement    present only for a LANDMARK (A-10.3); an ordinary footprint is
 *                   not a Lynch element and must not claim to be.
 * @typedef {{
 *   id: string,
 *   parcelId: string,
 *   role: string,
 *   footprint: Array<[number, number]>,
 *   heightPermille: number,
 *   agePermille: number,
 *   condition: string,
 *   styleToken: string,
 *   provenance: CartographyProvenance,
 *   decidedBy: string,
 *   institutionRef?: string,
 *   placement?: string,
 *   lynchElement?: string,
 * }} CartographyBuilding
 *
 * @typedef {{
 *   schemaVersion: number,
 *   streets: {
 *     arterials: CartographyStreet[],
 *     lanes: CartographyStreet[],
 *     gateRefs: string[],
 *     bridgeRefs: string[],
 *   },
 *   wards: CartographyWard[],
 *   parcels: CartographyParcel[],
 *   buildings: CartographyBuilding[],
 * }} TownCartography
 */

/** A raw colour in any of the shapes a stylesheet would accept (A-9, A-11). */
const RAW_COLOUR = /(#[0-9a-fA-F]{3,8}\b)|(\b(?:rgba?|hsla?)\s*\()/;

/** A bounded, lowercase, non-invertible identity token. */
const SAFE_TOKEN = /^[a-z0-9][a-z0-9_:.-]{0,119}$/;

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return isRecord(value) ? value : {};
}

/** @param {unknown} value @returns {boolean} */
function isInteger(value) {
  return Number.isInteger(value);
}

/**
 * Exact key-set comparison against a sorted expectation.
 * @param {Record<string, unknown>} value
 * @param {ReadonlyArray<string>} expected
 * @returns {boolean}
 */
function hasExactKeys(value, expected) {
  const keys = Object.keys(value).sort();
  return keys.length === expected.length && keys.every((key, index) => key === expected[index]);
}

/**
 * @param {unknown} value
 * @param {ReadonlyArray<string>} vocabulary
 * @param {string} path
 * @param {string[]} errors
 */
function requireMember(value, vocabulary, path, errors) {
  if (typeof value !== 'string' || !vocabulary.includes(value)) {
    errors.push(`${path} must be one of: ${vocabulary.join(', ')}`);
  }
}

/**
 * A C0 control or DEL anywhere in a display name. Tested by code unit rather than by
 * a control-class regex so the rule reads the same in source as it does in review.
 * @param {string} value
 * @returns {boolean}
 */
function hasControlCharacter(value) {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code < 32 || code === 127) return true;
  }
  return false;
}

/**
 * A-5 DISPLAY NAME (schema v2). A street or ward the DM can say out loud: a trimmed,
 * bounded, control-free string. It is NOT a token — names carry the settlement's own
 * culture, so casing and non-ASCII letters are the point — and it never enters an id
 * or a geometry, which is what keeps naming out of the digest's identity.
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function requireDisplayName(value, path, errors) {
  if (typeof value !== 'string'
    || value.trim() !== value
    || value.length < 1
    || value.length > 120
    || hasControlCharacter(value)) {
    errors.push(`${path} must be a trimmed 1..120 character display name`);
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function requireToken(value, path, errors) {
  if (typeof value !== 'string' || !SAFE_TOKEN.test(value)) {
    errors.push(`${path} must be a bounded lowercase token`);
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 * @param {number} extent
 * @param {number} minimumPoints
 */
function requirePointList(value, path, errors, extent, minimumPoints) {
  if (!Array.isArray(value) || value.length < minimumPoints) {
    errors.push(`${path} must carry at least ${minimumPoints} points`);
    return;
  }
  for (let index = 0; index < value.length; index++) {
    const point = value[index];
    if (!Array.isArray(point) || point.length !== 2) {
      errors.push(`${path}[${index}] must be a 2-integer plan point`);
      continue;
    }
    for (let axis = 0; axis < 2; axis++) {
      const coordinate = point[axis];
      if (!isInteger(coordinate) || Number(coordinate) < 0 || Number(coordinate) > extent) {
        errors.push(`${path}[${index}][${axis}] must be an integer from 0 to ${extent}`);
      }
    }
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function requirePermille(value, path, errors) {
  if (!isInteger(value) || Number(value) < 0 || Number(value) > 1000) {
    errors.push(`${path} must be an integer from 0 to 1000`);
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function requireProvenance(value, path, errors) {
  if (!isRecord(value) || !hasExactKeys(value, ['kind', 'ref'])) {
    errors.push(`${path} must carry exactly kind and ref`);
    return;
  }
  requireMember(value.kind, TOWN_CARTOGRAPHY_PROVENANCE_KINDS, `${path}.kind`, errors);
  if (value.kind === 'generated') {
    if (value.ref !== null) errors.push(`${path}.ref must be null for generated provenance`);
    return;
  }
  requireToken(value.ref, `${path}.ref`, errors);
}

/**
 * Sorted, unique, id-bearing rows. The manifest's own canonical-ordering law,
 * applied to the new layers so a reordered array can never digest the same.
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 * @returns {Record<string, unknown>[]}
 */
function sortedRows(value, path, errors) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return [];
  }
  /** @type {Record<string, unknown>[]} */
  const rows = [];
  /** @type {string|null} */
  let previous = null;
  /** @type {Set<string>} */
  const seen = new Set();
  for (let index = 0; index < value.length; index++) {
    const row = value[index];
    if (!isRecord(row)) {
      errors.push(`${path}[${index}] must be an object`);
      continue;
    }
    rows.push(row);
    const id = row.id;
    if (typeof id !== 'string' || !SAFE_TOKEN.test(id)) {
      errors.push(`${path}[${index}].id must be a bounded lowercase token`);
      continue;
    }
    if (previous !== null && id < previous) errors.push(`${path} must be sorted by id`);
    if (seen.has(id)) errors.push(`${path} contains duplicate id "${id}"`);
    previous = id;
    seen.add(id);
  }
  return rows;
}

/**
 * Reject a raw colour anywhere in the block (A-9: the tokens decide colour, so a
 * geometry layer that carried one would fork the palette out of the design system).
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function rejectRawColour(value, path, errors) {
  if (typeof value === 'string') {
    if (RAW_COLOUR.test(value)) errors.push(`${path} carries a raw colour; tone rides permille and colour rides design tokens`);
    return;
  }
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index++) rejectRawColour(value[index], `${path}[${index}]`, errors);
    return;
  }
  if (!isRecord(value)) return;
  for (const key of Object.keys(value)) rejectRawColour(value[key], `${path}.${key}`, errors);
}

/**
 * @param {Record<string, unknown>[]} rows
 * @param {string} path
 * @param {string} expectedClass
 * @param {string[]} errors
 * @param {number} extent
 */
function validateStreetRows(rows, path, expectedClass, errors, extent) {
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const at = `${path}[${index}]`;
    if (row.classKind !== expectedClass) errors.push(`${at}.classKind must be ${expectedClass}`);
    requireDisplayName(row.name, `${at}.name`, errors);
    requirePointList(row.polyline, `${at}.polyline`, errors, extent, 2);
    if (!isInteger(row.widthPlan) || Number(row.widthPlan) <= 0) {
      errors.push(`${at}.widthPlan must be a positive integer`);
    }
    requireProvenance(row.provenance, `${at}.provenance`, errors);
    requireMember(row.decidedBy, TOWN_CARTOGRAPHY_DECIDING_LAYERS, `${at}.decidedBy`, errors);
  }
}

/**
 * Validate one cartography block against the manifest that carries it.
 *
 * The context is what makes the referential half checkable: every gate and bridge
 * reference has to name a record the manifest already publishes, and every
 * institution reference has to resolve through the manifest's semantics table (the
 * same join the dossier reads). A reference that resolves nowhere is the fork the
 * ONE LAW exists to prevent, so it is an error rather than a warning.
 *
 * @param {unknown} value the cartography block
 * @param {{
 *   planExtent: number,
 *   gateIds: ReadonlySet<string>,
 *   bridgeIds: ReadonlySet<string>,
 *   semanticIds: ReadonlySet<string>,
 * }} context
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateTownCartography(value, context) {
  /** @type {string[]} */
  const errors = [];
  const extent = Number.isInteger(context.planExtent) ? Number(context.planExtent) : 0;
  if (!isRecord(value)) return { ok: false, errors: ['cartography must be an object'] };
  if (!hasExactKeys(value, TOWN_CARTOGRAPHY_BLOCK_KEYS)) {
    errors.push(`cartography keys must be exactly: ${TOWN_CARTOGRAPHY_BLOCK_KEYS.join(', ')}`);
  }
  if (value.schemaVersion !== TOWN_CARTOGRAPHY_SCHEMA_VERSION) {
    errors.push(`cartography.schemaVersion must be ${TOWN_CARTOGRAPHY_SCHEMA_VERSION}`);
  }
  rejectRawColour(value, 'cartography', errors);

  const streets = asRecord(value.streets);
  if (!isRecord(value.streets) || !hasExactKeys(streets, TOWN_CARTOGRAPHY_STREET_KEYS)) {
    errors.push(`cartography.streets keys must be exactly: ${TOWN_CARTOGRAPHY_STREET_KEYS.join(', ')}`);
  }
  validateStreetRows(
    sortedRows(streets.arterials, 'cartography.streets.arterials', errors),
    'cartography.streets.arterials', 'arterial', errors, extent,
  );
  validateStreetRows(
    sortedRows(streets.lanes, 'cartography.streets.lanes', errors),
    'cartography.streets.lanes', 'lane', errors, extent,
  );
  /** @param {unknown} refs @param {string} path @param {ReadonlySet<string>} known */
  const validateRefs = (refs, path, known) => {
    if (!Array.isArray(refs)) {
      errors.push(`${path} must be an array`);
      return;
    }
    /** @type {string|null} */
    let previous = null;
    for (let index = 0; index < refs.length; index++) {
      const ref = refs[index];
      if (typeof ref !== 'string' || !known.has(ref)) {
        errors.push(`${path}[${index}] must name a record the manifest already publishes`);
        continue;
      }
      if (previous !== null && ref < previous) errors.push(`${path} must be sorted`);
      previous = ref;
    }
  };
  validateRefs(streets.gateRefs, 'cartography.streets.gateRefs', context.gateIds);
  validateRefs(streets.bridgeRefs, 'cartography.streets.bridgeRefs', context.bridgeIds);

  const wards = sortedRows(value.wards, 'cartography.wards', errors);
  /** @type {Set<string>} */
  const wardIds = new Set();
  for (let index = 0; index < wards.length; index++) {
    const ward = wards[index];
    const at = `cartography.wards[${index}]`;
    if (typeof ward.id === 'string') wardIds.add(ward.id);
    requireMember(ward.kind, TOWN_CARTOGRAPHY_WARD_KINDS, `${at}.kind`, errors);
    requireDisplayName(ward.name, `${at}.name`, errors);
    requirePointList(ward.polygon, `${at}.polygon`, errors, extent, 3);
    requirePermille(ward.tonePermille, `${at}.tonePermille`, errors);
    if (ward.districtId !== null) requireToken(ward.districtId, `${at}.districtId`, errors);
    requireMember(ward.lynchElement, ['district', 'node'], `${at}.lynchElement`, errors);
    requireProvenance(ward.provenance, `${at}.provenance`, errors);
    requireMember(ward.decidedBy, TOWN_CARTOGRAPHY_DECIDING_LAYERS, `${at}.decidedBy`, errors);
  }

  const parcels = sortedRows(value.parcels, 'cartography.parcels', errors);
  /** @type {Set<string>} */
  const parcelIds = new Set();
  for (let index = 0; index < parcels.length; index++) {
    const parcel = parcels[index];
    const at = `cartography.parcels[${index}]`;
    if (typeof parcel.id === 'string') parcelIds.add(parcel.id);
    if (typeof parcel.wardId !== 'string' || !wardIds.has(parcel.wardId)) {
      errors.push(`${at}.wardId must name a ward in this block`);
    }
    requirePointList(parcel.polygon, `${at}.polygon`, errors, extent, 3);
    requirePointList([parcel.anchor], `${at}.anchor`, errors, extent, 1);
    requireProvenance(parcel.provenance, `${at}.provenance`, errors);
    requireMember(parcel.decidedBy, TOWN_CARTOGRAPHY_DECIDING_LAYERS, `${at}.decidedBy`, errors);
  }

  const buildings = sortedRows(value.buildings, 'cartography.buildings', errors);
  for (let index = 0; index < buildings.length; index++) {
    const building = buildings[index];
    const at = `cartography.buildings[${index}]`;
    if (typeof building.parcelId !== 'string' || !parcelIds.has(building.parcelId)) {
      errors.push(`${at}.parcelId must name a parcel in this block`);
    }
    requireMember(building.role, TOWN_CARTOGRAPHY_BUILDING_ROLES, `${at}.role`, errors);
    requirePointList(building.footprint, `${at}.footprint`, errors, extent, 3);
    requirePermille(building.heightPermille, `${at}.heightPermille`, errors);
    requirePermille(building.agePermille, `${at}.agePermille`, errors);
    requireMember(building.condition, TOWN_CARTOGRAPHY_CONDITIONS, `${at}.condition`, errors);
    requireToken(building.styleToken, `${at}.styleToken`, errors);
    requireProvenance(building.provenance, `${at}.provenance`, errors);
    requireMember(building.decidedBy, TOWN_CARTOGRAPHY_DECIDING_LAYERS, `${at}.decidedBy`, errors);
    const isInstitution = building.role === 'institution';
    const hasRef = Object.prototype.hasOwnProperty.call(building, 'institutionRef');
    if (isInstitution !== hasRef) {
      errors.push(`${at}.institutionRef must be present for an institution and absent for a dwelling`);
    } else if (hasRef && (typeof building.institutionRef !== 'string' || !context.semanticIds.has(building.institutionRef))) {
      errors.push(`${at}.institutionRef must resolve through the manifest semantics table`);
    }
    const hasPlacement = Object.prototype.hasOwnProperty.call(building, 'placement');
    if (isInstitution !== hasPlacement) {
      errors.push(`${at}.placement must be present for an institution and absent for a dwelling`);
    } else if (hasPlacement) {
      requireMember(building.placement, TOWN_CARTOGRAPHY_PLACEMENT_MODES, `${at}.placement`, errors);
    }
    if (Object.prototype.hasOwnProperty.call(building, 'lynchElement')) {
      requireMember(building.lynchElement, ['landmark'], `${at}.lynchElement`, errors);
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * THE DORMANCY GATE, and it is one line by design (the routeNetworkGenesis
 * precedent): the block is emitted only when the virtual rule key is explicitly
 * true. Absent, false, or a garbage rules object all read dormant, so a dark world
 * cannot materialize a layer by accident.
 *
 * @param {unknown} rules a simulation-rules object, or anything at all
 * @returns {boolean}
 */
export function townCartographyActive(rules) {
  return isRecord(rules) && rules[TOWN_CARTOGRAPHY_RULE_KEY] === true;
}

/**
 * THE SYNTHESIS STAGE'S ONE SEAM (design §1). Dark, it returns the manifest it was
 * handed BY REFERENCE — not a clone, not a rebuild — so dormancy is provable by
 * object identity rather than by a byte comparison that a future refactor could
 * satisfy while still rebuilding the world.
 *
 * @template {Record<string, unknown>} T
 * @param {T} manifest
 * @param {unknown} layers the compiled cartography block, or null when dark
 * @returns {T | (T & Record<string, unknown>)}
 */
export function attachTownCartographyLayers(manifest, layers) {
  if (layers === null || layers === undefined) return manifest;
  return { ...manifest, [TOWN_CARTOGRAPHY_MANIFEST_KEY]: layers };
}
