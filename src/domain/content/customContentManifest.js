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
 *   charset?:CustomContentCharsetWall|null,
 * }} ContentAdmissionOptions
 * @typedef {{
 *   validate:(bucket:string, definition:Record<string, unknown>) =>
 *     {rejections:Array<Record<string, unknown>>, marks:Array<Record<string, unknown>>},
 *   enforcement:'report'|'refuse',
 *   table:Record<string, unknown>,
 * }} CustomContentCharsetWall
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

  const labelled = { ...admission, fieldLabels };
  if (!options.charset) return labelled;
  return withCharsetVerdict(labelled, options.charset, category.key, valueRecord);
}

// -- THE CHARSET WALL AT THE AUTHORING CHOKEPOINTS ---------------------------
// Shape and length admission above answers "is this a legal value". It never
// asks "can this product DRAW it", so a name carrying a codepoint no registered
// face covers passes every wall and then prints as a substitute glyph in a paid
// dossier. The charset leaf answers that question from a derived table.
//
// TWO LAWS SHAPE THE WIRING BELOW, and both are structural rather than advisory.
//
// 1. THE LEAF IS NEVER STATICALLY IMPORTED. It lives in its own `custom-charset`
//    chunk. Fourteen modules statically import this file, and this file sits in
//    the static closure of an entry-owned dynamic import, so a static edge from
//    here would list the new chunk's filename in the ENTRY's own
//    `__vite__mapDeps` array and cost first-paint bytes for a leaf first paint
//    never runs. `loadCustomContentCharsetWall` below is the only edge, and it
//    is dynamic. Pinned by tests/lint/customContentCharsetWiring.test.js.
// 2. THE WALL IS A VALUE, NOT AN AMBIENT. Callers hand an admitted wall in
//    through `options.charset`. That is what lets the RESTORE lanes be blind by
//    construction rather than by remembering to pass a flag: a lane that never
//    loads a wall cannot consult one, and the account-import lane never loads
//    one. See `isAuthoringContentSource`.

/**
 * Command source types that are RESTORE rather than authoring.
 *
 * An import of a user's own account export replays content the product already
 * accepted. Refusing it would delete a paying user's library, so the wall never
 * runs on this lane whatever the policy says. Ruled by the owner at CS-9.
 */
export const RESTORE_CONTENT_SOURCE_TYPES = Object.freeze(['account-export']);

/**
 * Does this command source author new content, or restore existing content.
 *
 * @param {{type?:string}|null|undefined} source the command's source envelope
 * @returns {boolean} true when the lane is authoring
 */
export function isAuthoringContentSource(source) {
  const type = typeof source?.type === 'string' ? source.type : 'manual';
  return !RESTORE_CONTENT_SOURCE_TYPES.includes(type);
}

/**
 * Load the charset wall. THE ONLY EDGE from this module to the charset leaf,
 * and it is dynamic so the leaf's chunk stays out of the entry's dep map.
 *
 * The optional table argument exists for tests that must prove the `refuse`
 * behaviour without lighting the manifest door.
 *
 * @param {unknown} [table] a table to use instead of the generated one
 * @returns {Promise<CustomContentCharsetWall>} the wall
 */
export async function loadCustomContentCharsetWall(table) {
  const leaf = await import('./customContentCharset.js');
  const resolved = table === undefined
    ? leaf.CUSTOM_CONTENT_CHARSET
    : /** @type {typeof leaf.CUSTOM_CONTENT_CHARSET} */ (table);
  const policy = resolved.policy || { enforcement: 'report' };
  return Object.freeze({
    /**
     * @param {string} bucket the bucket
     * @param {Record<string, unknown>} definition the definition
     */
    validate: (bucket, definition) => (
      leaf.validateCustomContentCharset(bucket, definition, resolved)
    ),
    enforcement: /** @type {'report'|'refuse'} */ (
      policy.enforcement === 'refuse' ? 'refuse' : 'report'
    ),
    table: resolved,
  });
}

/**
 * Admit one definition through shape admission AND the charset wall.
 *
 * Under `report` the verdict is byte-identical to `admitCustomContentDefinition`
 * and the findings ride beside it on `charset`. Under `refuse` a non-empty
 * findings list makes `ok` false and appends one house-shaped error per finding.
 *
 * @param {unknown} bucket the content bucket
 * @param {unknown} value the authored definition
 * @param {ContentAdmissionOptions} [options] admission options
 * @returns {Promise<ReturnType<typeof admitCustomContentDefinition>>} the admission
 */
export async function admitAuthoredCustomContentDefinition(bucket, value, options = {}) {
  const charset = options.charset || await loadCustomContentCharsetWall();
  return admitCustomContentDefinition(bucket, value, { ...options, charset });
}

/**
 * Fold a charset verdict into an admission result.
 *
 * The return is declared as the admission's OWN type rather than a widened
 * record, because every consumer of `admitCustomContentDefinition` reads the
 * shape admission's fields and none of them should lose those types to a wall
 * that only ever ADDS keys beside them.
 *
 * @template {Record<string, unknown>} T
 * @param {T} admission the shape admission
 * @param {CustomContentCharsetWall} wall the loaded wall
 * @param {unknown} bucket the bucket
 * @param {unknown} value the definition
 * @returns {T} the admission with its charset verdict
 */
function withCharsetVerdict(admission, wall, bucket, value) {
  const verdict = wall.validate(
    String(bucket),
    /** @type {Record<string, unknown>} */ (value),
  );
  const rejections = Object.freeze(verdict.rejections.slice());
  const marks = Object.freeze(verdict.marks.slice());
  if (wall.enforcement !== 'refuse' || rejections.length === 0) {
    return /** @type {T} */ ({ ...admission, charset: rejections, charsetMarks: marks });
  }
  const errors = Array.isArray(admission.errors) ? admission.errors.slice() : [];
  for (const rejection of rejections) {
    errors.push({
      code: rejection.code,
      bucket: String(bucket),
      field: rejection.field,
    });
  }
  return /** @type {T} */ ({
    ...admission,
    ok: false,
    errors,
    charset: rejections,
    charsetMarks: marks,
  });
}

/**
 * The only schema descriptor a client may send to the edge. The server owns its
 * generated manifest and treats this value solely as a compatibility handshake.
 */
export function buildContentVocabulary() {
  return { manifestVersion: CUSTOM_CONTENT_MANIFEST_VERSION };
}
