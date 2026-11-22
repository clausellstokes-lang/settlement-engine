/**
 * Compatibility facade for the Surveyor custom-content compiler.
 *
 * Category and field truth now live in the generated manifest behind
 * customContentManifest.js. This path remains because the lazy Surveyor transport and
 * older integrations already import it; it no longer constructs or posts authority.
 */

import {
  AUTHORABLE_CONTENT_BUCKETS,
  CUSTOM_CONTENT_MANIFEST,
  CUSTOM_CONTENT_MANIFEST_VERSION,
  buildContentVocabulary,
  classifyCustomContentField,
  getCustomContentCategory,
  getCustomContentField,
  isAuthorableContentBucket,
} from './customContentManifest.js';

export {
  AUTHORABLE_CONTENT_BUCKETS,
  CUSTOM_CONTENT_MANIFEST,
  CUSTOM_CONTENT_MANIFEST_VERSION,
  buildContentVocabulary,
  getCustomContentCategory,
  getCustomContentField,
};

/** Historical name retained for the compiler/review call sites. */
export const CONTENT_BUCKETS = AUTHORABLE_CONTENT_BUCKETS;

/**
 * True only for a category the authoring boundary accepts.
 *
 * @param {unknown} bucket
 */
export function isRegisteredBucket(bucket) {
  return isAuthorableContentBucket(bucket);
}

/**
 * @typedef {{
 *   category:{key:string},
 *   spec:NonNullable<ReturnType<typeof getCustomContentField>>,
 * }} FieldCandidate
 */

/**
 * Category-aware field classification.
 *
 * New callers must pass `(bucket, field, value)`. A two-argument legacy call is
 * admitted only when every category that owns the field has the exact same schema and
 * truth axes; ambiguous global classification fails closed.
 *
 * @param {unknown} bucketOrField
 * @param {unknown} fieldOrValue
 * @param {unknown} [maybeValue]
 */
export function classifyField(bucketOrField, fieldOrValue, maybeValue) {
  if (arguments.length >= 3) {
    if (typeof bucketOrField !== 'string' || typeof fieldOrValue !== 'string') {
      return {
        kind: 'unsupported',
        effectKind: 'unsupported',
        activation: null,
        displayKind: 'unsupported',
        reason: 'unregistered_field',
      };
    }
    return classifyCustomContentField(bucketOrField, fieldOrValue, maybeValue);
  }

  if (typeof bucketOrField !== 'string') {
    return {
      kind: 'unsupported',
      effectKind: 'unsupported',
      activation: null,
      displayKind: 'unsupported',
      reason: 'unregistered_field',
    };
  }
  const field = bucketOrField;
  /** @type {FieldCandidate[]} */
  const candidates = /** @type {Array<{key:string}>} */ (
    CUSTOM_CONTENT_MANIFEST.categories
  )
    .map((category) => ({
      category,
      spec: getCustomContentField(category.key, field),
    }))
    .filter(
      /** @returns {candidate is FieldCandidate} */
      (candidate) => candidate.spec != null,
    );

  if (candidates.length === 0) {
    return {
      kind: 'unsupported',
      effectKind: 'unsupported',
      activation: null,
      displayKind: 'unsupported',
      reason: 'unregistered_field',
    };
  }

  /** @param {FieldCandidate} candidate */
  const signature = (candidate) => JSON.stringify({
    type: candidate.spec.type,
    values: candidate.spec.values || null,
    minLength: candidate.spec.minLength || null,
    maxLength: candidate.spec.maxLength || null,
    effect: candidate.spec.effect,
    activation: candidate.spec.activation,
  });
  const first = signature(candidates[0]);
  if (!candidates.every((candidate) => signature(candidate) === first)) {
    return {
      kind: 'unsupported',
      effectKind: 'unsupported',
      activation: null,
      displayKind: 'unsupported',
      reason: 'unregistered_field',
    };
  }

  return classifyCustomContentField(candidates[0].category.key, field, fieldOrValue);
}
