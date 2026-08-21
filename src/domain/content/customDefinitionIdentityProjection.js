/**
 * Canonical projection for immutable custom-definition identity.
 *
 * Runtime definitions carry persistence-oriented names (`definitionId`,
 * `revisionId`, `contentHash`). Generated settlement entities use explicit
 * `customDefinition*` names so consumers never confuse their own entity id
 * with the authored definition that produced them.
 *
 * Keep this projection deliberately narrow. It may copy identity and revision
 * metadata, but it must never copy arbitrary authored fields into a generated
 * entity.
 */

const MAX_IDENTITY_LENGTH = 240;

export const CUSTOM_DEFINITION_IDENTITY_KEYS = Object.freeze([
  'customDefinitionId',
  'customDefinitionRevisionId',
  'customDefinitionContentHash',
  'customDefinitionVersion',
  'customDefinitionFingerprint',
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function boundedText(value) {
  if (typeof value !== 'string') return '';
  const normalized = value.trim();
  return normalized && normalized.length <= MAX_IDENTITY_LENGTH
    ? normalized
    : '';
}

/** @param {unknown} value @returns {number|string|null} */
function definitionVersion(value) {
  if (Number.isSafeInteger(value) && Number(value) >= 0) return Number(value);
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized && normalized.length <= 64 ? normalized : null;
}

/**
 * Project one definition's exact identity into generated-entity field names.
 * Compatibility aliases are read so legacy settlements and current immutable
 * revisions converge on one output shape.
 *
 * @param {unknown} value
 * @returns {Record<string, string|number>}
 */
export function projectCustomDefinitionIdentity(value) {
  const source = record(value);
  const nested = record(source.customDefinition);
  /** @type {Record<string, string|number>} */
  const projected = {};

  const definitionId = boundedText(
    source.customDefinitionId
      ?? nested.definitionId
      ?? source.definitionId,
  );
  if (definitionId) projected.customDefinitionId = definitionId;

  const revisionId = boundedText(
    source.customDefinitionRevisionId
      ?? nested.revisionId
      ?? source.revisionId,
  );
  if (revisionId) projected.customDefinitionRevisionId = revisionId;

  const contentHash = boundedText(
    source.customDefinitionContentHash
      ?? nested.contentHash
      ?? source.contentHash,
  );
  if (contentHash) projected.customDefinitionContentHash = contentHash;

  const version = definitionVersion(
    source.customDefinitionVersion
      ?? nested.version
      ?? source.revisionNumber
      ?? nested.revisionNumber
      ?? source.definitionVersion
      ?? source._schemaVersion,
  );
  if (version !== null) projected.customDefinitionVersion = version;

  const fingerprint = boundedText(
    source.customDefinitionFingerprint
      ?? nested.fingerprint
      ?? source.definitionFingerprint
      ?? contentHash,
  );
  if (fingerprint) projected.customDefinitionFingerprint = fingerprint;

  return projected;
}

/**
 * Remove exact identity when two definitions collapse onto the same display
 * entity. Omitting a receipt is safer than attributing a same-name merge to an
 * arbitrary authored definition.
 *
 * @param {Record<string, unknown>} target
 */
export function clearCustomDefinitionIdentity(target) {
  for (const key of CUSTOM_DEFINITION_IDENTITY_KEYS) delete target[key];
}

/**
 * Enrich a generated entity with one projected identity.
 *
 * Callers own the ambiguity set because a later same-name definition must not
 * re-add identity after a conflict. The return value lets the orchestration
 * layer make that decision without persisting bookkeeping fields.
 *
 * @param {Record<string, unknown>} target
 * @param {unknown} source
 * @returns {'absent'|'enriched'|'same'|'conflict'}
 */
export function mergeCustomDefinitionIdentity(target, source) {
  const incoming = projectCustomDefinitionIdentity(source);
  const incomingId = boundedText(incoming.customDefinitionId);
  if (!incomingId) return 'absent';

  const currentId = boundedText(target.customDefinitionId);
  if (currentId && currentId !== incomingId) {
    clearCustomDefinitionIdentity(target);
    return 'conflict';
  }
  if (currentId) {
    const currentRevisionId = boundedText(target.customDefinitionRevisionId);
    const incomingRevisionId = boundedText(
      incoming.customDefinitionRevisionId,
    );
    const currentContentHash = boundedText(
      target.customDefinitionContentHash,
    );
    const incomingContentHash = boundedText(
      incoming.customDefinitionContentHash,
    );
    if (
      (
        currentRevisionId
        && incomingRevisionId
        && currentRevisionId !== incomingRevisionId
      )
      || (
        currentContentHash
        && incomingContentHash
        && currentContentHash !== incomingContentHash
      )
    ) {
      // A stable definition may have many immutable revisions. Same definition
      // identity does not make two different heads interchangeable: retaining
      // either revision would fabricate exact provenance for the merged entity.
      clearCustomDefinitionIdentity(target);
      return 'conflict';
    }
  }

  Object.assign(target, incoming);
  return currentId ? 'same' : 'enriched';
}
