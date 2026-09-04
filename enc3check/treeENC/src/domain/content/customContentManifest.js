/**
 * Stable client adapter for the generated custom-content manifest.
 *
 * This module is intentionally human-authored while the large data object behind it is
 * generated. Consumers import this path, never the generated file. That keeps category
 * admission, field truth, and compiler-version negotiation on one API without pulling
 * React, icons, colors, the store, or any transport into the lazy custom-content graph.
 */

import {
  CUSTOM_CONTENT_MANIFEST,
  CUSTOM_CONTENT_MANIFEST_VERSION,
} from './customContentManifest.generated.js';
import {
  admitCustomContentDefinitionShape,
  isCustomContentSystemField,
} from './customContentAdmission.js';

/**
 * @typedef {'mechanical'|'presentation'} ContentEffectKind
 * @typedef {'always'|'conditional'} ContentActivationKind
 * @typedef {{
 *   key:string,
 *   type:'boolean'|'enum'|'string'|'string-or-string-list',
 *   required?:boolean,
 *   minLength?:number,
 *   maxLength?:number,
 *   maxItems?:number,
 *   itemMaxLength?:number,
 *   values?:readonly string[],
 *   mechanicalValues?:readonly unknown[],
 *   mechanicalValueAliases?:Readonly<Record<string, unknown>>,
 *   fallbackEffect?:ContentEffectKind,
 *   effect:ContentEffectKind,
 *   activation:ContentActivationKind,
 *   condition?:string,
 *   consumers:readonly string[],
 * }} ContentFieldSpec
 * @typedef {{
 *   key:string,
 *   label:string,
 *   singular:string,
 *   authorable:boolean,
 *   fields:readonly ContentFieldSpec[],
 * }} ContentCategorySpec
 * @typedef {{
 *   kind:'mechanical'|'flavor'|'unsupported',
 *   effectKind:ContentEffectKind|'unsupported',
 *   activation:{kind:ContentActivationKind, when?:string}|null,
 *   displayKind:'mechanical'|'conditional'|'presentation'|'unsupported',
 *   consumers?:string[],
 *   reason?:string,
 * }} ContentFieldLabel
 * @typedef {{
 *   allowSystemFields?:boolean,
 *   requireRequired?:boolean,
 * }} ContentAdmissionOptions
 */

const CONTENT_CATEGORIES = /** @type {readonly ContentCategorySpec[]} */ (
  CUSTOM_CONTENT_MANIFEST.categories
);

/** @type {Map<string, ContentCategorySpec>} */
const CATEGORY_BY_KEY = new Map(
  CONTENT_CATEGORIES.map((category) => [category.key, category]),
);

/** @type {Map<string, Map<string, ContentFieldSpec>>} */
const FIELD_BY_CATEGORY = new Map(
  CONTENT_CATEGORIES.map((category) => [
    category.key,
    new Map(category.fields.map((field) => [field.key, field])),
  ]),
);

export { CUSTOM_CONTENT_MANIFEST, CUSTOM_CONTENT_MANIFEST_VERSION };

/** Buckets that accept authored definitions. Discovered projections are excluded. */
export const AUTHORABLE_CONTENT_BUCKETS = Object.freeze(
  [.../** @type {readonly string[]} */ (CUSTOM_CONTENT_MANIFEST.authorableBuckets)],
);

const AUTHORABLE_BUCKET_SET = new Set(AUTHORABLE_CONTENT_BUCKETS);

/**
 * Return an immutable category contract, or null for an unknown bucket.
 *
 * @param {unknown} bucket
 * @returns {ContentCategorySpec|null}
 */
export function getCustomContentCategory(bucket) {
  return typeof bucket === 'string' ? CATEGORY_BY_KEY.get(bucket) || null : null;
}

/**
 * Return the category-specific field contract, or null when the pair is
 * unknown.
 *
 * @param {unknown} bucket
 * @param {unknown} field
 * @returns {ContentFieldSpec|null}
 */
export function getCustomContentField(bucket, field) {
  if (typeof bucket !== 'string' || typeof field !== 'string') return null;
  return FIELD_BY_CATEGORY.get(bucket)?.get(field) || null;
}

/**
 * True only for a bucket that accepts authored content.
 *
 * @param {unknown} bucket
 * @returns {boolean}
 */
export function isAuthorableContentBucket(bucket) {
  return typeof bucket === 'string' && AUTHORABLE_BUCKET_SET.has(bucket);
}

/**
 * Canonicalize the one open-string field whose runtime consumer recognizes a
 * registered vocabulary through both keys and display labels. Keeping this
 * resolver beside effect classification prevents the review UI from claiming
 * that `Healing`, `HEALING`, or `Food & Drink` is presentation-only while the
 * service generator routes it into a mechanical availability/capacity bucket.
 * Other bounded-mechanics fields remain exact: their consumers do not accept
 * aliases or case variants.
 *
 * @param {ContentFieldSpec|null} field
 * @param {unknown} value
 * @returns {unknown}
 */
function canonicalMechanicalValue(field, value) {
  if (
    typeof value === 'string'
    && field?.mechanicalValueAliases
  ) {
    const alias = value.trim().toLowerCase();
    return field.mechanicalValueAliases[alias] ?? value;
  }
  return value;
}

/**
 * @param {string|null} categoryKey
 * @param {ContentFieldSpec|null} field
 * @param {unknown} value
 * @returns {ContentEffectKind|undefined}
 */
function effectiveEffect(categoryKey, field, value) {
  const mechanicalValue = canonicalMechanicalValue(
    field,
    value,
  );
  if (
    field?.effect === 'mechanical'
    && Array.isArray(field.mechanicalValues)
    && !field.mechanicalValues.includes(mechanicalValue)
  ) {
    return field.fallbackEffect || 'presentation';
  }
  return field?.effect;
}

/**
 * @param {string|null} categoryKey
 * @param {ContentFieldSpec|null} field
 * @param {unknown} value
 * @returns {'mechanical'|'conditional'|'presentation'|'unsupported'}
 */
function displayKindFor(categoryKey, field, value) {
  if (!field) return 'unsupported';
  if (effectiveEffect(categoryKey, field, value) === 'presentation') {
    return 'presentation';
  }
  return field.activation === 'conditional' ? 'conditional' : 'mechanical';
}

/**
 * @param {string|null} categoryKey
 * @param {ContentFieldSpec|null} field
 * @param {unknown} value
 * @returns {'mechanical'|'flavor'|'unsupported'}
 */
function legacyKindFor(categoryKey, field, value) {
  if (!field) return 'unsupported';
  return effectiveEffect(categoryKey, field, value) === 'presentation'
    ? 'flavor'
    : 'mechanical';
}

/**
 * @param {string|null} categoryKey
 * @param {ContentFieldSpec|null} field
 * @param {string|undefined} reason
 * @param {unknown} [value]
 * @returns {ContentFieldLabel}
 */
function fieldLabel(categoryKey, field, reason, value) {
  if (!field) {
    return {
      kind: 'unsupported',
      effectKind: 'unsupported',
      activation: null,
      displayKind: 'unsupported',
      ...(reason ? { reason } : {}),
    };
  }
  const effectKind = effectiveEffect(categoryKey, field, value) ?? field.effect;
  const activationKind = effectKind === 'presentation' ? 'always' : field.activation;
  return {
    // `kind` keeps the first Surveyor review surface compatible while the richer,
    // truthful axes are adopted by every caller.
    kind: legacyKindFor(categoryKey, field, value),
    effectKind,
    activation: {
      kind: activationKind,
      ...(activationKind === 'conditional' && field.condition ? { when: field.condition } : {}),
    },
    displayKind: displayKindFor(categoryKey, field, value),
    consumers: effectKind === 'presentation' && field.effect === 'mechanical'
      ? []
      : [...field.consumers],
  };
}

/** @param {unknown} value @param {ContentFieldSpec} field @returns {boolean} */
function validateString(value, field) {
  if (typeof value !== 'string') return false;
  if (field.minLength != null && value.trim().length < field.minLength) return false;
  return field.maxLength == null || value.length <= field.maxLength;
}

/** @param {unknown} value @param {ContentFieldSpec} field @returns {boolean} */
function validateStringList(value, field) {
  const values = Array.isArray(value) ? value : [value];
  if (!values.every((item) => typeof item === 'string')) return false;
  const strings = /** @type {string[]} */ (values);
  if (field.maxItems != null && strings.length > field.maxItems) return false;
  const itemMaxLength = field.itemMaxLength;
  if (itemMaxLength != null && strings.some((item) => item.length > itemMaxLength)) {
    return false;
  }
  const allowedValues = field.values;
  if (
    Array.isArray(allowedValues)
    && strings.some((item) => !allowedValues.includes(item))
  ) {
    return false;
  }
  return true;
}

/** @param {unknown} value @param {ContentFieldSpec} field @returns {boolean} */
function isValidValue(value, field) {
  if (field.type === 'boolean') return typeof value === 'boolean';
  if (field.type === 'enum') {
    return typeof value === 'string' && field.values?.includes(value) === true;
  }
  if (field.type === 'string') return validateString(value, field);
  if (field.type === 'string-or-string-list') return validateStringList(value, field);
  return false;
}

/**
 * Classify and validate a field against its category-specific contract.
 *
 * The return shape deliberately carries both the old `kind` and the two authoritative
 * axes. New presentation code should render `displayKind`.
 *
 * @param {unknown} bucket
 * @param {unknown} field
 * @param {unknown} value
 * @returns {ContentFieldLabel}
 */
export function classifyCustomContentField(bucket, field, value) {
  const spec = getCustomContentField(bucket, field);
  const categoryKey = typeof bucket === 'string' ? bucket : null;
  if (!spec) return fieldLabel(categoryKey, null, 'unregistered_field');
  if (!isValidValue(value, spec)) {
    return fieldLabel(categoryKey, null, 'invalid_value');
  }
  return fieldLabel(categoryKey, spec, undefined, value);
}

/**
 * Admit one complete custom-content definition.
 *
 * Unknown buckets, unknown fields, invalid values, and missing required fields all
 * make `ok` false. The returned definition is wall-cleaned for diagnostics, but callers
 * must never persist it unless `ok` is true.
 *
 * `requireRequired:false` is reserved for partial-editor validation. `allowSystemFields`
 * admits only the fixed persistence envelope; it never widens authorable fields.
 *
 * @param {unknown} bucket
 * @param {unknown} value
 * @param {ContentAdmissionOptions} [options]
 */
export function admitCustomContentDefinition(bucket, value, options = {}) {
  const category = getCustomContentCategory(bucket);
  const admission = admitCustomContentDefinitionShape(bucket, value, options);
  /** @type {Array<{field:string} & ContentFieldLabel>} */
  const fieldLabels = [];

  if (!category || category.authorable !== true) {
    return admission;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return admission;
  }

  const valueRecord = /** @type {Record<string, unknown>} */ (value);
  for (const [field, fieldValue] of Object.entries(valueRecord)) {
    if (
      options.allowSystemFields === true
      && isCustomContentSystemField(field)
    ) {
      continue;
    }
    const classification = classifyCustomContentField(
      category.key,
      field,
      fieldValue,
    );
    fieldLabels.push({ field, ...classification });
  }

  return {
    ...admission,
    fieldLabels,
  };
}

/**
 * The only schema descriptor a client may send to the edge. The server owns its
 * generated manifest and treats this value solely as a compatibility handshake.
 */
export function buildContentVocabulary() {
  return { manifestVersion: CUSTOM_CONTENT_MANIFEST_VERSION };
}
