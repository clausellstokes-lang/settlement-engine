/**
 * Validate the optional immutable-definition identity shared by TownScene
 * canonical references and custom-definition provenance rows.
 *
 * This boundary accepts the explicit id/revision/hash triplet and the older
 * version/fingerprint aliases. Keeping the compatibility vocabulary in one
 * helper prevents the scene validator from gradually assigning different
 * meanings to the same authored identity.
 */

import { isCustomDefinitionVersion } from './customBuildingPresentation.js';

const STRING_IDENTITY_FIELDS = Object.freeze([
  'definitionId',
  'revisionId',
  'contentHash',
  'definitionFingerprint',
]);

/**
 * @param {Record<string, unknown>} record
 * @param {string} path
 * @param {string[]} errors
 */
export function validateCustomDefinitionReference(record, path, errors) {
  for (const field of STRING_IDENTITY_FIELDS) {
    if (
      Object.prototype.hasOwnProperty.call(record, field)
      && (typeof record[field] !== 'string' || record[field].length === 0)
    ) {
      errors.push(`${path}.${field} must be a non-empty string`);
    }
  }
  if (
    Object.prototype.hasOwnProperty.call(record, 'definitionVersion')
    && !isCustomDefinitionVersion(record.definitionVersion)
  ) {
    errors.push(
      `${path}.definitionVersion must be a non-negative integer or non-empty string`,
    );
  }
}
