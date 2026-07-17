/**
 * domain/content/contentVocabulary.js — the CLIENT builder of the S4 CUSTOM-CONTENT
 * compiler's TOOL SCHEMA (Surveyor S4, DESIGN_AI_CONTROL_SURFACE §2 stage 4 /
 * DESIGN_CONTENT_PLANE §0–§1b). The content-plane twin of opVocabulary.js.
 *
 * THE LAW (DESIGN_CONTENT_PLANE §0): the AI's imagination is unbounded, but what CONCLUDES
 * into the system is TYPED — "no content type = no landing", the op-registry philosophy
 * extended from actions to content. The boundary object is the schema. Mirroring S1/S3, the
 * CLIENT builds the content VOCABULARY here from the SAME source of truth the manual
 * compendium uses (customContentSchema.js) and POSTs it; the custom-content edge grounds the
 * compiler on it and the schema wall rejects anything outside it.
 *
 * THE SCHEMA WALL, two layers:
 *   1. BUCKET REGISTRATION — a drafted entry lands only in one of the registered content
 *      buckets (institutions / services / resources / stressors / tradeGoods / factions /
 *      deities). A bucket outside this set is UNSUPPORTED (no content type = no landing).
 *   2. FIELD LABELLING (the S4 honesty rule) — each field of a valid entry is MECHANICAL
 *      (a bounded taxonomy the engine reads → real effect), FLAVOR (free/descriptive text
 *      → kept, no mechanical effect), or UNSUPPORTED (a field the schema has no primitive
 *      for → surfaced honestly, never invented into a fake mechanic).
 *
 * PURITY / BUDGET: no transport, no side effects, no eager importer. Read only by the lazy
 * custom-content panel/transport (rides the AiAnalystPanel lazy chunk) ⇒ ZERO eager bytes.
 * Emits only registered field/bucket/enum strings — never engine internals.
 */

import {
  CONTENT_GROUP_KEYS, CRITICALITY_KEYS, ECONOMIC_WEIGHT_KEYS, DEFENSE_ROLE_KEYS,
  POWER_AUTHORITY_KEYS, FOOD_IMPACT_KEYS, SATISFIES_KEYS,
  DEITY_ALIGNMENT_KEYS, DEITY_TEMPER_KEYS, DEITY_TIER_KEYS, DEITY_LAW_KEYS,
  TIER_ORDER,
} from '../customContentSchema.js';

/**
 * The registered content buckets — the S4 schema wall's op-type set. A drafted entry whose
 * bucket is outside this list can NEVER land (no content type = no landing). Frozen; the pin
 * asserts it matches the customContentSlice buckets so a new bucket cannot leave a stale wall.
 */
export const CONTENT_BUCKETS = Object.freeze([
  'institutions', 'services', 'resources', 'stressors', 'tradeGoods', 'factions', 'deities',
]);
const _BUCKET_SET = new Set(CONTENT_BUCKETS);

/**
 * The MECHANICAL fields — those the engine reads through a BOUNDED taxonomy, so a value
 * outside the set has no primitive (dies at the wall). Sourced from customContentSchema.js
 * (the single source of truth the compendium + generation already share). `true` marks a
 * bounded BOOLEAN toggle (magical/criminal fold into the tag set → real effect).
 * @type {Readonly<Record<string, readonly string[] | true>>}
 */
export const MECHANICAL_FIELDS = Object.freeze({
  group:           CONTENT_GROUP_KEYS,
  criticality:     CRITICALITY_KEYS,
  economicWeight:  ECONOMIC_WEIGHT_KEYS,
  defenseRole:     DEFENSE_ROLE_KEYS,
  powerAuthority:  POWER_AUTHORITY_KEYS,
  foodImpact:      FOOD_IMPACT_KEYS,
  satisfies:       SATISFIES_KEYS,
  alignmentAxis:   DEITY_ALIGNMENT_KEYS,
  temperamentAxis: DEITY_TEMPER_KEYS,
  rankAxis:        DEITY_TIER_KEYS,
  lawAxis:         DEITY_LAW_KEYS,
  tierMin:         TIER_ORDER,
  tierMax:         TIER_ORDER,
  magical:         true,
  criminal:        true,
});

/**
 * The FLAVOR fields — recognised descriptive/free-text fields the engine keeps but reads no
 * bounded mechanic from (name, prose, tags, and the per-bucket descriptive dials). Kept on
 * the entry, labelled flavor. Any field that is NEITHER mechanical NOR flavor is UNSUPPORTED
 * — a hallucinated mechanic with no primitive, surfaced honestly (never invented).
 */
export const FLAVOR_FIELDS = Object.freeze([
  'name', 'label', 'description', 'portfolio', 'tags', 'note', 'blurb',
  'severity', 'affects', 'archetype', 'condition', 'subtype',
]);
const _FLAVOR_SET = new Set(FLAVOR_FIELDS);

/** True iff `bucket` is a registered content type (fail-closed on non-strings).
 *  @param {unknown} bucket */
export function isRegisteredBucket(bucket) {
  return typeof bucket === 'string' && _BUCKET_SET.has(bucket);
}

/**
 * Classify one field of a drafted entry (the S4 honesty rule). Pure.
 *   'mechanical'  — a bounded field whose value is in-set (or a valid boolean toggle).
 *   'flavor'      — a recognised descriptive field, kept with no mechanical effect.
 *   'unsupported' — a bounded field with an out-of-set value, OR an unregistered field.
 * @param {string} field
 * @param {unknown} value
 * @returns {{ kind: 'mechanical'|'flavor'|'unsupported', reason?: 'invalid_value'|'unregistered_field' }}
 */
export function classifyField(field, value) {
  const spec = Object.prototype.hasOwnProperty.call(MECHANICAL_FIELDS, field) ? MECHANICAL_FIELDS[field] : undefined;
  if (spec !== undefined) {
    if (spec === true) {
      return (typeof value === 'boolean') ? { kind: 'mechanical' } : { kind: 'unsupported', reason: 'invalid_value' };
    }
    const v = typeof value === 'string' ? value : String(value ?? '');
    return spec.includes(v) ? { kind: 'mechanical' } : { kind: 'unsupported', reason: 'invalid_value' };
  }
  if (_FLAVOR_SET.has(field)) return { kind: 'flavor' };
  return { kind: 'unsupported', reason: 'unregistered_field' };
}

/**
 * The content-vocabulary descriptor the client POSTs to the custom-content edge.
 * @typedef {{
 *   buckets: string[],
 *   mechanicalFields: Record<string, readonly string[] | true>,
 *   flavorFields: string[],
 *   tierOrder: readonly string[],
 * }} ContentVocabulary
 */

/**
 * Build the content-vocabulary descriptor the client POSTs to the custom-content edge. Pure.
 * The edge grounds the compiler on it and enforces the wall against it.
 * @returns {ContentVocabulary}
 */
export function buildContentVocabulary() {
  return {
    buckets: [...CONTENT_BUCKETS],
    mechanicalFields: MECHANICAL_FIELDS,
    flavorFields: [...FLAVOR_FIELDS],
    tierOrder: TIER_ORDER,
  };
}
