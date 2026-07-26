/**
 * Compact, synchronous custom-content admission.
 *
 * Campaign creation and hydration must reject malformed definitions before
 * they enter state, but those first-paint boundaries do not need the complete
 * authoring manifest. This adapter reads the generated validation projection
 * shared with database admission. Rich labels and effect metadata remain in
 * `customContentManifest.js`, which delegates its shape checks here.
 */

import {
  CUSTOM_CONTENT_ADMISSION_MANIFEST,
  CUSTOM_CONTENT_ADMISSION_MANIFEST_VERSION,
} from './customContentAdmission.generated.js';

/**
 * Compact generated rule keys deliberately match the migration projection:
 * `t` type, `r` required, `n` minimum length, `x` maximum length,
 * `m` maximum items, `i` item maximum length, and `v` allowed values.
 *
 * @typedef {Readonly<{
 *   t:'boolean'|'enum'|'string'|'string-or-string-list',
 *   r?:1,
 *   n?:number,
 *   x?:number,
 *   m?:number,
 *   i?:number,
 *   v?:readonly string[],
 * }>} CompactFieldRule
 * @typedef {Readonly<Record<string, CompactFieldRule>>} CompactBucketRules
 * @typedef {{
 *   code:string,
 *   bucket:string,
 *   field?:string,
 * }} ContentAdmissionError
 * @typedef {{
 *   allowSystemFields?:boolean,
 *   requireRequired?:boolean,
 * }} ContentAdmissionOptions
 */

const BUCKET_RULES = /** @type {Readonly<Record<string, CompactBucketRules>>} */ (
  CUSTOM_CONTENT_ADMISSION_MANIFEST.buckets
);

const SYSTEM_FIELDS = new Set([
  'id',
  'localUid',
  'isCustom',
  'createdAt',
  'updatedAt',
]);

export { CUSTOM_CONTENT_ADMISSION_MANIFEST_VERSION };

/**
 * The compact projection derives this list from the canonical manifest rather
 * than maintaining a second category registry.
 */
export const ADMISSION_CONTENT_BUCKETS = Object.freeze(
  Object.keys(BUCKET_RULES),
);

/**
 * @param {unknown} bucket
 * @returns {bucket is string}
 */
export function isAdmissionContentBucket(bucket) {
  return (
    typeof bucket === 'string'
    && Object.prototype.hasOwnProperty.call(BUCKET_RULES, bucket)
  );
}

/**
 * @param {unknown} field
 * @returns {field is string}
 */
export function isCustomContentSystemField(field) {
  return typeof field === 'string' && SYSTEM_FIELDS.has(field);
}

/**
 * @param {unknown} field
 * @param {unknown} value
 * @returns {{ok:boolean, value:unknown}}
 */
function normalizeSystemField(field, value) {
  if (field !== 'localUid') return { ok: true, value };
  if (typeof value !== 'string') return { ok: false, value: null };
  const normalized = value.trim();
  if (!normalized || normalized.length > 240) {
    return { ok: false, value: null };
  }
  return { ok: true, value: normalized };
}

/** @param {unknown} value @returns {boolean} */
function valueIsPresent(value) {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * @param {unknown} value
 * @param {CompactFieldRule} rule
 * @returns {boolean}
 */
function validateString(value, rule) {
  if (typeof value !== 'string') return false;
  if (rule.n != null && value.trim().length < rule.n) return false;
  return rule.x == null || value.length <= rule.x;
}

/**
 * @param {unknown} value
 * @param {CompactFieldRule} rule
 * @returns {boolean}
 */
function validateStringList(value, rule) {
  const values = Array.isArray(value) ? value : [value];
  if (!values.every(item => typeof item === 'string')) return false;
  const strings = /** @type {string[]} */ (values);
  if (rule.m != null && strings.length > rule.m) return false;
  const itemMaxLength = rule.i;
  if (
    itemMaxLength != null
    && strings.some(item => item.length > itemMaxLength)
  ) {
    return false;
  }
  if (
    Array.isArray(rule.v)
    && strings.some(item => !rule.v?.includes(item))
  ) {
    return false;
  }
  return true;
}

/**
 * @param {unknown} value
 * @param {CompactFieldRule} rule
 * @returns {boolean}
 */
function isValidValue(value, rule) {
  if (rule.t === 'boolean') return typeof value === 'boolean';
  if (rule.t === 'enum') {
    return typeof value === 'string' && rule.v?.includes(value) === true;
  }
  if (rule.t === 'string') return validateString(value, rule);
  if (rule.t === 'string-or-string-list') {
    return validateStringList(value, rule);
  }
  return false;
}

/**
 * Admit one definition without loading presentation or effect metadata.
 *
 * The returned definition is cleaned for diagnostics, but callers must not
 * persist it unless `ok` is true. `requireRequired:false` is reserved for
 * partial-editor validation. `allowSystemFields` admits only the fixed
 * persistence envelope and never widens the authorable vocabulary.
 *
 * @param {unknown} bucket
 * @param {unknown} value
 * @param {ContentAdmissionOptions} [options]
 */
export function admitCustomContentDefinitionShape(
  bucket,
  value,
  options = {},
) {
  const admittedBucket = String(bucket ?? '');
  /** @type {Record<string, unknown>} */
  const definition = {};
  /** @type {ContentAdmissionError[]} */
  const errors = [];
  /** @type {Set<string>} */
  const providedFields = new Set();

  /**
   * Keep the response compatible with the rich manifest adapter. Shape-only
   * callers can therefore switch imports without branching on result format.
   */
  const result = () => ({
    ok: errors.length === 0,
    bucket: admittedBucket,
    definition,
    entry: definition,
    fieldLabels: [],
    errors,
  });

  if (!isAdmissionContentBucket(bucket)) {
    errors.push({ code: 'unregistered_bucket', bucket: admittedBucket });
    return result();
  }
  const fields = BUCKET_RULES[bucket];

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push({ code: 'invalid_definition', bucket: admittedBucket });
    return result();
  }

  const valueRecord = /** @type {Record<string, unknown>} */ (value);
  for (const [field, fieldValue] of Object.entries(valueRecord)) {
    providedFields.add(field);
    if (
      options.allowSystemFields === true
      && isCustomContentSystemField(field)
    ) {
      const systemField = normalizeSystemField(field, fieldValue);
      if (!systemField.ok) {
        errors.push({
          code: 'invalid_system_field',
          bucket: admittedBucket,
          field,
        });
        continue;
      }
      definition[field] = systemField.value;
      continue;
    }

    if (!Object.prototype.hasOwnProperty.call(fields, field)) {
      errors.push({
        code: 'unregistered_field',
        bucket: admittedBucket,
        field,
      });
      continue;
    }
    const rule = fields[field];
    if (!rule || !isValidValue(fieldValue, rule)) {
      errors.push({
        code: 'invalid_value',
        bucket: admittedBucket,
        field,
      });
      continue;
    }
    definition[field] = fieldValue;
  }

  if (options.requireRequired !== false) {
    for (const [field, rule] of Object.entries(fields)) {
      if (
        rule.r === 1
        && !providedFields.has(field)
        && !valueIsPresent(definition[field])
      ) {
        errors.push({
          code: 'missing_required_field',
          bucket: admittedBucket,
          field,
        });
      }
    }
  }

  return result();
}
