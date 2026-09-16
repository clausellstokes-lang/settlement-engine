/**
 * domain/townMap/anchors.js — stable identity anchors for the town-map model.
 *
 * The town map places a building for every institution and a polygon for every
 * district. Those placements — and the cosmetic mapEdits deltas that later nudge
 * them (SM-3) — must key on an identity that SURVIVES roster drift: a settlement
 * regenerated at the same seed, or edited in the dossier, reshuffles the
 * institutions array, so an array index is a false identity. The stable anchors
 * are the catalog/custom identity slugs the generator already mints.
 *
 * Anchor precedence for an institution:  catalogId → localUid → name-slug.
 * Anchor for a district:                 its already-stable `district.<snake>` id.
 *
 * Pure + deterministic + locale-free: the name-slug fallback is a plain ASCII
 * regex replace (no localeCompare / toLocale*), so the same name slugs to the
 * same key on every device — a hard requirement for same-seed byte identity.
 */

const NON_ALNUM = /[^a-z0-9]+/g;
const EDGE_DASHES = /^-+|-+$/g;

/**
 * Codepoint-safe slug: lowercased, every non-alphanumeric run collapsed to a
 * single '-', with leading/trailing dashes trimmed. `toLowerCase` (NOT the
 * locale-sensitive `toLocaleLowerCase`) plus an ASCII-only character class keeps
 * this a pure, table-free function of its input.
 * @param {unknown} value
 * @returns {string}
 */
export function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(NON_ALNUM, '-')
    .replace(EDGE_DASHES, '');
}

/**
 * @typedef {Object} AnchorableInstitution
 * @property {string} [name]
 * @property {string} [catalogId]  catalog identity anchor (regen-stable slug)
 * @property {string} [localUid]   custom-content identity anchor
 */

/**
 * Stable identity anchor for an institution. Namespaced by source so a catalog
 * id can never collide with a custom uid or a name slug.
 * @param {AnchorableInstitution | null | undefined} inst
 * @returns {string}
 */
export function anchorForInstitution(inst) {
  const catalogId = inst?.catalogId;
  if (typeof catalogId === 'string' && catalogId !== '') return `cat:${catalogId}`;
  const localUid = inst?.localUid;
  if (typeof localUid === 'string' && localUid !== '') return `uid:${localUid}`;
  return `name:${slugify(inst?.name)}`;
}

/**
 * @typedef {Object} AnchorableDistrict
 * @property {string} [id]  the derived `district.<snake>` id
 */

/**
 * Stable identity anchor for a district — its derived id, which is already a
 * `district.<snake>` slug of the quarter name (see districtProfile).
 * @param {AnchorableDistrict | null | undefined} district
 * @returns {string}
 */
export function anchorForDistrict(district) {
  return String(district?.id ?? '');
}
