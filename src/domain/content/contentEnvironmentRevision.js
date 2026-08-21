/**
 * Immutable content-environment revision authority.
 *
 * This module owns construction, strict reconstruction, deterministic diffing,
 * and account-library revision creation. Campaign bindings consume this
 * authority but live in a separate module, keeping persistence hydration free
 * of standalone library-resolution and lifecycle-planning code.
 */

import {
  isAuthorableContentCategory,
} from './customContentVersioning.js';
import {
  isReviewedDerivedContentCategory,
  PERSISTED_RUNTIME_CONTENT_CATEGORIES,
  reviewedSupplyChainRevisionEntry,
} from './reviewedSupplyChainPersistence.js';
import {
  canonicalContentJson,
  detachContentJson,
  fingerprintContent,
  isPlainContentRecord,
} from './contentFingerprint.js';
import {
  validateUserContentTunables,
} from './userContentTunableAdmission.js';
import { validateUserVisualSelection } from './userVisualSelection.js';
import { compareCodepoint } from '../deterministicSort.js';
import {
  legacyDefinitionEntry,
} from './contentEnvironmentLibrary.js';
import {
  CONTENT_ENVIRONMENT_SCHEMA_VERSION,
  VANILLA_CONTENT_ENVIRONMENT,
  VANILLA_ENVIRONMENT_ID,
  VANILLA_ENVIRONMENT_REVISION_ID,
} from './contentEnvironmentDefaults.js';

export {
  CONTENT_ENVIRONMENT_SCHEMA_VERSION,
  VANILLA_CONTENT_ENVIRONMENT,
  VANILLA_ENVIRONMENT_ID,
  VANILLA_ENVIRONMENT_REVISION_ID,
};

const MAX_DIRECT_DEFINITIONS = 2_000;
const MAX_REVISION_NUMBER = 2_147_483_647;
const SHA256_RE = /^[0-9a-f]{64}$/;

/**
 * @typedef {Record<string, unknown>} ContentRecord
 * @typedef {Readonly<{
 *   packId:string,
 *   packVersionId:string,
 *   manifestHash:string,
 *   order:number,
 * }>} ContentPackBinding
 * @typedef {Readonly<{
 *   definitionId:string,
 *   revisionId:string,
 *   contentHash:string,
 *   category:string,
 * }>} DirectDefinitionReference
 * @typedef {Readonly<{
 *   schemaVersion:number,
 *   environmentId:string,
 *   environmentRevisionId:string,
 *   revisionNumber:number,
 *   source:string,
 *   packVersions:ReadonlyArray<ContentPackBinding>,
 *   directDefinitions:ReadonlyArray<DirectDefinitionReference>,
 *   tunables:Readonly<Record<string, number|boolean>>,
 *   visualSelection:Readonly<Record<string, string>>,
 *   environmentHash:string,
 *   createdAt:string|null,
 * }>} ContentEnvironmentRevision
 * @typedef {{
 *   environmentId:unknown,
 *   environmentRevisionId:unknown,
 *   revisionNumber?:unknown,
 *   packVersions?:unknown,
 *   directDefinitions?:unknown,
 *   tunables?:unknown,
 *   visualSelection?:unknown,
 *   source?:unknown,
 *   createdAt?:unknown,
 * }} ContentEnvironmentRevisionInput
 * @typedef {{
 *   environmentId?:string,
 *   environmentRevisionId?:string,
 *   revisionNumber?:number,
 *   tunables?:Record<string, number|boolean>,
 *   visualSelection?:Record<string, string>,
 *   source?:string,
 *   createdAt?:string|null,
 * }} LibraryEnvironmentOptions
 * @typedef {{path:string, beforePresent:boolean, afterPresent:boolean,
 *   before:unknown, after:unknown}} EnvironmentChange
 * @typedef {{ok:true, environment:ContentEnvironmentRevision,
 *   reason?:undefined, message?:undefined} |
 *   {ok:false, reason:string, message?:string,
 *   environment?:undefined}} EnvironmentAdmission
 */

/**
 * @param {unknown} value
 * @param {string} field
 */
function cleanSha256(value, field) {
  if (typeof value !== 'string' || !SHA256_RE.test(value)) {
    throw new TypeError(`${field} must be a lowercase SHA-256 fingerprint.`);
  }
  return value;
}

/**
 * Shared bounded identifier normalization for environment and binding
 * envelopes. Exported only to prevent those two authorities from drifting.
 *
 * @param {unknown} value
 * @param {string} field
 */
export function cleanContentIdentifier(value, field) {
  if (
    typeof value !== 'string'
    || value.length === 0
    || value !== value.trim()
    || [...value].length > 240
  ) {
    throw new TypeError(`${field} is invalid.`);
  }
  return value;
}

/** @param {unknown} value */
function cleanCreatedAt(value) {
  if (value == null) return null;
  if (
    typeof value !== 'string'
    || value.length === 0
    || value !== value.trim()
    || [...value].length > 100
  ) {
    throw new TypeError('createdAt must be a bounded timestamp string or null.');
  }
  return value;
}

/**
 * @param {ContentRecord} value
 * @param {Set<string>} allowedKeys
 * @param {string} field
 */
function rejectUnknownKeys(value, allowedKeys, field) {
  const unknown = Object.keys(value).filter(key => !allowedKeys.has(key));
  if (unknown.length > 0) {
    throw new TypeError(
      `${field} contains unsupported fields: ${unknown.join(', ')}.`,
    );
  }
}

/**
 * @param {unknown} value
 * @returns {ReadonlyArray<ContentPackBinding>}
 */
function normalizePackVersions(value) {
  if (!Array.isArray(value) || value.length > 64) {
    throw new TypeError('packVersions must be a bounded array.');
  }
  const seen = new Set();
  return value.map((entry, index) => {
    if (!isPlainContentRecord(entry)) {
      throw new TypeError(`packVersions[${index}] must be an object.`);
    }
    const record = /** @type {ContentRecord} */ (entry);
    rejectUnknownKeys(
      record,
      new Set(['packId', 'packVersionId', 'manifestHash', 'order']),
      `packVersions[${index}]`,
    );
    const packId = cleanContentIdentifier(
      record.packId,
      `packVersions[${index}].packId`,
    );
    const packVersionId = cleanContentIdentifier(
      record.packVersionId,
      `packVersions[${index}].packVersionId`,
    );
    if (record.order != null && record.order !== index) {
      throw new TypeError(`packVersions[${index}].order must equal ${index}.`);
    }
    if (seen.has(packId)) {
      throw new TypeError(`Duplicate pack binding "${packId}".`);
    }
    seen.add(packId);
    return Object.freeze({
      packId,
      packVersionId,
      manifestHash: cleanSha256(
        record.manifestHash,
        `packVersions[${index}].manifestHash`,
      ),
      order: index,
    });
  });
}

/**
 * @param {unknown} value
 * @returns {ReadonlyArray<DirectDefinitionReference>}
 */
function normalizeDirectDefinitions(value) {
  if (!Array.isArray(value) || value.length > MAX_DIRECT_DEFINITIONS) {
    throw new TypeError('directDefinitions must be a bounded array.');
  }
  const seen = new Set();
  return value.map((entry, index) => {
    if (!isPlainContentRecord(entry)) {
      throw new TypeError(`directDefinitions[${index}] must be an object.`);
    }
    const record = /** @type {ContentRecord} */ (entry);
    rejectUnknownKeys(
      record,
      new Set(['definitionId', 'revisionId', 'contentHash', 'category']),
      `directDefinitions[${index}]`,
    );
    const definitionId = cleanContentIdentifier(
      record.definitionId,
      `directDefinitions[${index}].definitionId`,
    );
    if (seen.has(definitionId)) {
      throw new TypeError(`Duplicate definition binding "${definitionId}".`);
    }
    seen.add(definitionId);
    return Object.freeze({
      definitionId,
      revisionId: cleanContentIdentifier(
        record.revisionId,
        `directDefinitions[${index}].revisionId`,
      ),
      contentHash: cleanSha256(
        record.contentHash,
        `directDefinitions[${index}].contentHash`,
      ),
      category: (() => {
        const category = String(record.category || '');
        if (
          !isAuthorableContentCategory(category)
          && !isReviewedDerivedContentCategory(category)
        ) {
          throw new TypeError(
            `directDefinitions[${index}].category is unsupported.`,
          );
        }
        return category;
      })(),
    });
  });
}

/**
 * Construct and fingerprint one immutable environment revision.
 *
 * @param {ContentEnvironmentRevisionInput} input
 * @returns {ContentEnvironmentRevision}
 */
export function makeContentEnvironmentRevision({
  environmentId,
  environmentRevisionId,
  revisionNumber = 1,
  packVersions = [],
  directDefinitions = [],
  tunables = {},
  visualSelection = {},
  source = 'personal',
  createdAt = null,
}) {
  const normalized = {
    schemaVersion: CONTENT_ENVIRONMENT_SCHEMA_VERSION,
    environmentId: cleanContentIdentifier(environmentId, 'environmentId'),
    environmentRevisionId: cleanContentIdentifier(
      environmentRevisionId,
      'environmentRevisionId',
    ),
    revisionNumber: Number(revisionNumber),
    source: cleanContentIdentifier(String(source || 'personal'), 'source'),
    packVersions: normalizePackVersions(packVersions),
    directDefinitions: normalizeDirectDefinitions(directDefinitions),
    tunables: (() => {
      const validation = validateUserContentTunables(tunables);
      if (!validation.ok) {
        const keys = validation.rejected.map(entry => entry.key).join(', ');
        throw new TypeError(`tunables contains unsupported values: ${keys}.`);
      }
      return Object.freeze(validation.tunables);
    })(),
    visualSelection: (() => {
      const validation = validateUserVisualSelection(visualSelection);
      if (!validation.ok) {
        const keys = validation.rejected.map(entry => entry.key).join(', ');
        throw new TypeError(
          `visualSelection contains unsupported values: ${keys}.`,
        );
      }
      return Object.freeze(validation.selection);
    })(),
  };
  if (
    !Number.isInteger(normalized.revisionNumber)
    || normalized.revisionNumber < 1
    || normalized.revisionNumber > MAX_REVISION_NUMBER
  ) {
    throw new TypeError(
      'Environment revision number must be a positive 32-bit integer.',
    );
  }
  const environmentHash = fingerprintContent(normalized);
  return Object.freeze({
    ...normalized,
    environmentHash,
    createdAt: cleanCreatedAt(createdAt),
  });
}

/**
 * Reconstruct and hash-check an untrusted environment revision.
 *
 * @param {unknown} value
 * @returns {EnvironmentAdmission}
 */
export function admitContentEnvironmentRevision(value) {
  try {
    if (!isPlainContentRecord(value)) {
      return { ok: false, reason: 'content_environment_not_object' };
    }
    if (value.schemaVersion !== CONTENT_ENVIRONMENT_SCHEMA_VERSION) {
      return { ok: false, reason: 'content_environment_version_unsupported' };
    }
    const record = /** @type {ContentRecord} */ (value);
    const environment = makeContentEnvironmentRevision(
      /** @type {ContentEnvironmentRevisionInput} */ (record),
    );
    if (
      !SHA256_RE.test(String(record.environmentHash || ''))
      || record.environmentHash !== environment.environmentHash
    ) {
      return { ok: false, reason: 'content_environment_hash_mismatch' };
    }
    // Persisted constitutional data must round-trip byte-for-byte. This rejects
    // unknown fields and noncanonical values that construction can normalize.
    if (canonicalContentJson(record) !== canonicalContentJson(environment)) {
      return { ok: false, reason: 'content_environment_shape_mismatch' };
    }
    return { ok: true, environment };
  } catch (error) {
    return {
      ok: false,
      reason: 'content_environment_invalid',
      message: error instanceof Error
        ? error.message
        : 'Invalid content environment.',
    };
  }
}

// The eager default carries a precomputed hash so it remains a zero-dependency
// first-paint leaf. Prove that constant against the same reconstruction and
// canonical hash check used for imported or persisted revisions.
const vanillaEnvironmentAdmission = admitContentEnvironmentRevision(
  VANILLA_CONTENT_ENVIRONMENT,
);
if (!vanillaEnvironmentAdmission.ok) {
  throw new Error(
    `Built-in vanilla environment identity is invalid: ${
      vanillaEnvironmentAdmission.reason
    }.`,
  );
}

/**
 * Deterministic, review-facing environment diff.
 *
 * @param {unknown} previous
 * @param {unknown} next
 * @returns {ReadonlyArray<EnvironmentChange>}
 */
export function diffContentEnvironmentRevisions(previous, next) {
  const beforeAdmission = admitContentEnvironmentRevision(
    previous || VANILLA_CONTENT_ENVIRONMENT,
  );
  const afterAdmission = admitContentEnvironmentRevision(next);
  if (!afterAdmission.ok) {
    throw new TypeError(afterAdmission.message || afterAdmission.reason);
  }
  const before = beforeAdmission.ok
    ? beforeAdmission.environment
    : VANILLA_CONTENT_ENVIRONMENT;
  const after = afterAdmission.environment;
  /** @type {EnvironmentChange[]} */
  const changes = [];

  /**
   * @param {unknown} left
   * @param {unknown} right
   * @param {string} path
   */
  function walk(left, right, path) {
    if (Object.is(left, right)) return;
    if (
      left !== undefined
      && right !== undefined
      && fingerprintContent(left) === fingerprintContent(right)
    ) {
      return;
    }
    if (isPlainContentRecord(left) && isPlainContentRecord(right)) {
      const keys = [...new Set([
        ...Object.keys(left),
        ...Object.keys(right),
      ])].sort(compareCodepoint);
      for (const key of keys) {
        walk(left[key], right[key], path ? `${path}.${key}` : key);
      }
      return;
    }
    changes.push(Object.freeze({
      path,
      beforePresent: left !== undefined,
      afterPresent: right !== undefined,
      before: left === undefined ? null : detachContentJson(left),
      after: right === undefined ? null : detachContentJson(right),
    }));
  }

  walk(before, after, '');
  return Object.freeze(changes);
}

/**
 * Enumerate the exact active heads represented by a grouped account library.
 *
 * @param {unknown} customContent
 * @returns {ReadonlyArray<DirectDefinitionReference>}
 */
export function directDefinitionReferencesFromLibrary(customContent) {
  /** @type {DirectDefinitionReference[]} */
  const references = [];
  const seenDefinitionIds = new Set();
  const library = isPlainContentRecord(customContent)
    ? /** @type {ContentRecord} */ (customContent)
    : {};
  for (const category of PERSISTED_RUNTIME_CONTENT_CATEGORIES) {
    const items = Array.isArray(library[category]) ? library[category] : [];
    for (const item of items) {
      if (!item) continue;
      const record = isPlainContentRecord(item)
        ? /** @type {ContentRecord} */ (item)
        : null;
      if (record?.archivedAt) continue;
      const entry = isReviewedDerivedContentCategory(category)
        ? reviewedSupplyChainRevisionEntry(item)
        : legacyDefinitionEntry(category, item);
      if (seenDefinitionIds.has(entry.definitionId)) {
        throw new TypeError(
          `Duplicate library definition "${entry.definitionId}".`,
        );
      }
      seenDefinitionIds.add(entry.definitionId);
      references.push({
        definitionId: entry.definitionId,
        revisionId: entry.revisionId,
        contentHash: entry.contentHash,
        category,
      });
    }
  }
  references.sort((left, right) => (
    compareCodepoint(left.definitionId, right.definitionId)
    || compareCodepoint(left.category, right.category)
  ));
  return Object.freeze(
    references.map(reference => Object.freeze(reference)),
  );
}

/**
 * Construct a content-addressed personal environment from exact library heads.
 *
 * @param {unknown} customContent
 * @param {LibraryEnvironmentOptions} [options]
 * @returns {ContentEnvironmentRevision}
 */
export function makeLibraryContentEnvironmentRevision(
  customContent,
  options = {},
) {
  const directDefinitions = directDefinitionReferencesFromLibrary(customContent);
  const identity = fingerprintContent({
    directDefinitions: [...directDefinitions],
    tunables: options.tunables || {},
    visualSelection: options.visualSelection || {},
  });
  return makeContentEnvironmentRevision({
    environmentId: options.environmentId || 'personal:authored-library',
    environmentRevisionId: options.environmentRevisionId
      || `personal:authored-library:${identity}`,
    revisionNumber: options.revisionNumber || 1,
    directDefinitions: [...directDefinitions],
    tunables: options.tunables || {},
    visualSelection: options.visualSelection || {},
    source: options.source || 'personal',
    createdAt: options.createdAt || null,
  });
}
