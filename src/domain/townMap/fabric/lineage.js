/**
 * domain/townMap/fabric/lineage.js — THE KEY SPACES (§11.0's other half).
 *
 * `fabricRng` needs a STABLE ENTITY KEY for everything it draws. This module is the
 * single authority on what those keys are. Four key spaces exist; two are landed and
 * two are minted here.
 *
 * | space       | source                                    | stability                    |
 * |-------------|-------------------------------------------|------------------------------|
 * | institution | `anchorForInstitution` (anchors.js:50-57) | LANDED, roster-drift-proof   |
 * | district    | `spatialLayout.quarters[].id`             | LANDED                       |
 * | parcel      | organism key + deterministic ordinal      | MINTED HERE                  |
 * | road        | endpoint key pair + rank                  | MINTED HERE                  |
 *
 * ⭐⭐ IDENTITY IS NOT ADDRESS (the §167 organic-relocation law, honoured at the seam).
 * An institution's key is derived from WHAT IT IS — its catalog id, else its local uid,
 * else its name slug — and never from WHERE IT SITS. That separation is what lets a
 * later drift member move a smithy across the street without the fabric treating it as
 * a demolition plus a new building: identity persists, ADDRESS is an event-dated
 * attribute of the identity. Encoding the parcel into the institution key would be
 * cheap now and unaffordable to undo later, so it is forbidden here by construction:
 * `institutionKey` does not take a position argument and cannot be given one.
 *
 * The mirror obligation holds for parcels: a PARCEL's identity is its lineage inside
 * its organism (which block, which strip, which depth cut), not its coordinates — so a
 * parcel keeps its identity when the street it fronts shifts by a metre, and a
 * subdivided plot's halves declare their descent from it.
 *
 * PURITY: no Date, no Math.random, no localeCompare — keys are built with codepoint
 * comparisons and template strings only.
 */

/** Characters admitted in a key segment. Anything else becomes '-', so a key is always
 * greppable and can never carry a separator that breaks the key grammar. */
const KEY_SAFE_RE = /[^a-z0-9._-]+/g;

/** Bound on one key segment: long enough for a real catalog id or a long name slug,
 * short enough that a key never becomes the largest string in the model. */
const SEGMENT_MAX = 72;

/**
 * Normalize any identifier to a key segment: lowercased, bounded, separator-safe.
 * Deterministic and locale-independent (`toLowerCase` on ASCII-safe output only after
 * the class filter, so no locale-specific casing rule can reach the result).
 * @param {unknown} raw @returns {string}
 */
export function keySegment(raw) {
  const s = typeof raw === 'string' ? raw : raw == null ? '' : String(raw);
  const lowered = s.toLowerCase().replace(KEY_SAFE_RE, '-').replace(/^-+|-+$/g, '');
  return lowered.slice(0, SEGMENT_MAX) || 'unnamed';
}

/**
 * THE INSTITUTION KEY — identity, never address.
 *
 * Mirrors the landed anchor precedence (anchors.js): catalogId → localUid → name slug.
 * That order is roster-drift-proof: a catalog entry keeps its id when the roster is
 * reshuffled, a custom institution keeps its uid, and a name-only record at least keeps
 * its name. The fabric therefore re-derives the SAME shape for the same institution
 * across regenerations, years and roster edits.
 *
 * ⛔ Takes no position and must never take one — see the identity-is-not-address note.
 * @param {{ catalogId?: unknown, localUid?: unknown, name?: unknown, id?: unknown }} institution
 * @returns {string}
 */
export function institutionKey(institution) {
  const inst = institution || {};
  const catalogId = typeof inst.catalogId === 'string' && inst.catalogId ? inst.catalogId : '';
  if (catalogId) return `inst.${keySegment(catalogId)}`;
  const localUid = typeof inst.localUid === 'string' && inst.localUid ? inst.localUid : '';
  if (localUid) return `inst.uid.${keySegment(localUid)}`;
  const id = typeof inst.id === 'string' && inst.id ? inst.id : '';
  if (id) return `inst.id.${keySegment(id)}`;
  return `inst.name.${keySegment(inst.name)}`;
}

/**
 * THE INSTANCE KEY — one identity, N bodies (§6's multiplicity classes).
 *
 * A catalog record like 'Bakers (5-15)' is ONE institution with ONE clickable anchor
 * that renders as N shapes distributed through the fabric. Each shape needs its own
 * stream (so the five bakeries are not five copies of one drawing) while every one of
 * them still resolves to the single identity above. The ordinal is the distinguisher
 * and it is positional-in-the-instance-list, never positional-in-space.
 * @param {string} instKey @param {number} ordinal @returns {string}
 */
export function instanceKey(instKey, ordinal) {
  return `${instKey}#${Math.max(0, Math.trunc(ordinal))}`;
}

/**
 * THE DISTRICT / ORGANISM KEY. The landed district id when there is one; otherwise a
 * category-plus-ordinal key for a fabric-founded organism (§161l's FOUNDING RULE mints
 * districts that the dossier implies but has not named — the smelting quarter its
 * smelters found).
 * @param {{ id?: unknown, category?: unknown }} district @param {number} [ordinal]
 * @returns {string}
 */
export function organismKey(district, ordinal = 0) {
  const d = district || {};
  const id = typeof d.id === 'string' && d.id ? d.id : '';
  if (id) return `org.${keySegment(id)}`;
  return `org.founded.${keySegment(d.category || 'commons')}.${Math.max(0, Math.trunc(ordinal))}`;
}

/**
 * THE PARCEL LINEAGE KEY — minted here, and the reason a plot can have a biography.
 *
 * A parcel's identity is its DESCENT: which organism it belongs to, which block of that
 * organism, which strip of that block, and which depth cut of that strip. All four are
 * derivation ordinals, so the key is stable under any change that does not alter the
 * derivation ABOVE it — the whole point of a lineage.
 *
 * Consequences a later drift member depends on:
 *   • §11.4's PARCEL CONSOLIDATION (two plots become one fine house) can name its
 *     parents, because both parents have names.
 *   • §11.4's PARCEL SUBDIVISION (the fine house splits into tenements) mints children
 *     under `subdivide`, so the tenements declare descent from the house.
 *   • §161g's ruin ring can hold a parcel's identity while it is roofless, and hand the
 *     same identity back when it is re-tenanted.
 * @param {string} orgKey @param {number} block @param {number} strip @param {number} depth
 * @returns {string}
 */
export function parcelKey(orgKey, block, strip, depth) {
  const b = Math.max(0, Math.trunc(block));
  const s = Math.max(0, Math.trunc(strip));
  const d = Math.max(0, Math.trunc(depth));
  return `${orgKey}/p.${b}.${s}.${d}`;
}

/** A child parcel minted by subdividing an existing one (§11.4 falling prosperity).
 * @param {string} parentParcelKey @param {number} ordinal @returns {string} */
export function subdividedParcelKey(parentParcelKey, ordinal) {
  return `${parentParcelKey}+s${Math.max(0, Math.trunc(ordinal))}`;
}

/**
 * THE ROAD IDENTITY KEY — minted here.
 *
 * A road is identified by the PAIR OF THINGS IT CONNECTS plus its rank, with the
 * endpoints written in codepoint order so the same road derives the same key regardless
 * of which end the caller walked from. That is what lets §11.3's road grammar thicken a
 * lane into a highway, or thin it down the ladder to a field-boundary ghost, without
 * the road ever becoming a different road.
 * @param {string} endpointA @param {string} endpointB @param {string} [rank]
 * @returns {string}
 */
export function roadKey(endpointA, endpointB, rank = 'lane') {
  const a = keySegment(endpointA), b = keySegment(endpointB);
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return `road.${keySegment(rank)}.${lo}~${hi}`;
}

/** A named point a road can terminate at — a gate, a nucleus, a frame edge, a landing.
 * @param {string} kind @param {string|number} id @returns {string} */
export function nodeKey(kind, id) { return `${keySegment(kind)}.${keySegment(id)}`; }

/**
 * A codepoint comparator for key ordering. Every iteration in the fabric that feeds a
 * draw or lands in output is sorted with this first — the landed deterministic-sort
 * discipline, restated locally so this module has no cross-domain import.
 * @param {string} a @param {string} b @returns {number}
 */
export function compareKeys(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

/**
 * THE CHANGE YEAR of an entity — the second half of the inertia fork.
 *
 * Same entity + same facts + same year ⇒ same bytes, forever. A rebuild, a founding or
 * a razing stamps a NEW year, which re-rolls that one entity's detail and nothing
 * else's. Absent any dated evidence the answer is 0 — the settlement's own beginning —
 * which is the honest reading (we know it was there, we do not know when it changed)
 * and keeps every settlement with no history byte-stable.
 * @param {{ year?: unknown, foundedYear?: unknown, changedYear?: unknown } | null | undefined} record
 * @returns {number}
 */
export function changeYearOf(record) {
  const r = record || {};
  for (const v of [r.changedYear, r.foundedYear, r.year]) {
    if (Number.isFinite(v)) return Math.trunc(Number(v));
  }
  return 0;
}
