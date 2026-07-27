/**
 * Pure preview plans for versioned custom-content commands.
 *
 * A preview is the exact mutation proposal. Its SHA-256 fingerprint is reviewed
 * by the client, carried in the application command, and recomputed inside the
 * migration-185 PostgreSQL RPC before any row is locked or written.
 */

import {
  authoredDataOf,
  validateVersionedContent,
} from './customContentVersioning.js';
import {
  canonicalContentJson,
  detachContentJson,
  fingerprintContent,
  isPlainContentRecord,
} from './contentFingerprint.js';
import {
  admitCustomContentDefinitionShape,
} from './customContentAdmission.js';
import {
  admitContentEnvironmentRevision,
} from './contentEnvironmentRevision.js';
import {
  parseContentPack,
  prepareImport as prepareContentPackImport,
} from '../../lib/contentPacks.js';

export const CUSTOM_CONTENT_COMMAND_SCHEMA_VERSION = 1;

// RETIRED 2026-07-27 (owner ruling R-5b item #6, capability-atlas gap
// "op-but-no-exposure"): `content.definition.mass-update` was a strict synonym of
// create-revision at every layer — same entries[] budget, same server branches,
// zero product callers — so bulk append ships today as a multi-entry
// create-revision (1..MAX_ENTRIES). Migration 185 still names the retired string
// in its shared kind lists; that is inert server vocabulary no client can emit
// (in-place edits to a committed migration are owner-gated).
export const CUSTOM_CONTENT_COMMAND_KIND = Object.freeze({
  CREATE_REVISION: 'content.definition.create-revision',
  ARCHIVE: 'content.definition.archive',
  RESTORE: 'content.definition.restore',
  PACK_IMPORT: 'content.pack.import',
  ENVIRONMENT_MIGRATE: 'content.environment.migrate',
});

const KNOWN_KINDS = /** @type {Set<string>} */ (
  new Set(Object.values(CUSTOM_CONTENT_COMMAND_KIND))
);
const ENTRY_COMMAND_KINDS = /** @type {Set<string>} */ (new Set([
  CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
  CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT,
]));
const LIFECYCLE_COMMAND_KINDS = /** @type {Set<string>} */ (new Set([
  CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE,
  CUSTOM_CONTENT_COMMAND_KIND.RESTORE,
]));
const MAX_ENTRIES = 1_000;

/**
 * @typedef {{
 *   definitionId:string|null,
 *   expectedHeadRevisionId:string|null,
 *   packEntryId:string|null,
 *   category:string,
 *   data:Record<string, unknown>,
 * }} NormalizedCommandEntry
 * @typedef {{
 *   packId:string,
 *   packVersion:string,
 *   name:string,
 *   manifestHash:string,
 *   expectedActivePackVersion:string|null,
 *   expectedActiveManifestHash:string|null,
 *   importPlanHash:string|null,
 *   manifest:Record<string, unknown>,
 * }} CommandPack
 * @typedef {{
 *   admitItem?:(
 *     (category:string, item:Record<string, unknown>) =>
 *       boolean|{ok:boolean, errors?:string[]}
 *   )|null,
 * }} ContentValidationOptions
 */

/** @param {unknown} value @param {string} field @returns {string} */
function requiredText(value, field) {
  if (typeof value !== 'string' || !value.trim() || value.length > 240) {
    throw new TypeError(`${field} is required and must stay within 240 characters.`);
  }
  return value.trim();
}

/**
 * @template T
 * @param {T[]} entries
 * @param {{valueOf:(entry:T)=>unknown, label:string}} options
 */
function rejectDuplicateEntryIdentity(entries, { valueOf, label }) {
  /** @type {Set<string>} */
  const seen = new Set();
  for (const [index, entry] of entries.entries()) {
    const value = valueOf(entry);
    if (value == null) continue;
    const identity = String(value);
    if (seen.has(identity)) {
      throw new TypeError(`entries[${index}] repeats ${label} "${identity}".`);
    }
    seen.add(identity);
  }
}

/**
 * @param {unknown} entry
 * @param {number} index
 * @param {ContentValidationOptions} options
 * @returns {NormalizedCommandEntry}
 */
function normalizeEntry(entry, index, options) {
  if (!isPlainContentRecord(entry)) {
    throw new TypeError(`entries[${index}] must be an object.`);
  }
  const category = requiredText(entry.category, `entries[${index}].category`);
  let data = authoredDataOf(entry.data || entry.item || {});
  const validation = validateVersionedContent(category, data, options);
  if (!validation.ok) {
    throw new TypeError(`entries[${index}]: ${validation.errors.join(' ')}`);
  }
  const admission = admitCustomContentDefinitionShape(category, data, {
    allowSystemFields: true,
  });
  if (!admission.ok) {
    const errors = admission.errors.map((rawError) => {
      const error = /** @type {{code:string, field?:string}} */ (rawError);
      return error.field ? `${error.field}: ${error.code}` : error.code;
    });
    throw new TypeError(`entries[${index}]: ${errors.join(' ')}`);
  }
  data = /** @type {Record<string, unknown>} */ (admission.definition);
  return {
    definitionId: entry.definitionId
      ? requiredText(entry.definitionId, `entries[${index}].definitionId`)
      : null,
    expectedHeadRevisionId: entry.expectedHeadRevisionId
      ? requiredText(
          entry.expectedHeadRevisionId,
          `entries[${index}].expectedHeadRevisionId`,
        )
      : null,
    packEntryId: entry.packEntryId
      ? requiredText(entry.packEntryId, `entries[${index}].packEntryId`)
      : null,
    category,
    data,
  };
}

/**
 * Create a detached, immutable command plan and its review fingerprint.
 *
 * @param {unknown} input
 * @param {ContentValidationOptions} [options]
 */
export function previewCustomContentCommand(input, options = {}) {
  if (!isPlainContentRecord(input)) throw new TypeError('Command plan must be an object.');
  const kind = requiredText(input.kind, 'kind');
  if (!KNOWN_KINDS.has(kind)) throw new TypeError(`Unsupported custom-content command "${kind}".`);
  const rawEntries = input.entries || [];
  if (!Array.isArray(rawEntries) || rawEntries.length > MAX_ENTRIES) {
    throw new TypeError(`entries must be an array of at most ${MAX_ENTRIES} items.`);
  }

  const entries = rawEntries.map((entry, index) => normalizeEntry(entry, index, options));
  rejectDuplicateEntryIdentity(entries, {
    valueOf: entry => entry.definitionId,
    label: 'definitionId',
  });
  rejectDuplicateEntryIdentity(entries, {
    valueOf: entry => entry.packEntryId,
    label: 'packEntryId',
  });
  rejectDuplicateEntryIdentity(entries, {
    valueOf: entry => entry.data.localUid,
    label: 'data.localUid',
  });
  if (
    ENTRY_COMMAND_KINDS.has(kind)
    && entries.length === 0
  ) {
    throw new TypeError(`${kind} requires at least one entry.`);
  }
  if (
    LIFECYCLE_COMMAND_KINDS.has(kind)
    && (!input.definitionId || !input.expectedHeadRevisionId)
  ) {
    throw new TypeError(
      `${kind} requires a definition id and expected head revision.`,
    );
  }
  if (
    kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
    && entries.some(entry => !entry.packEntryId)
  ) {
    throw new TypeError(`${kind} requires a pack entry id for every entry.`);
  }
  if (
    kind !== CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
    && entries.some(entry => entry.packEntryId)
  ) {
    throw new TypeError(`${kind} must not carry pack entry ids.`);
  }
  /** @type {CommandPack|null} */
  let pack = null;
  if (kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT) {
    if (!isPlainContentRecord(input.pack)) {
      throw new TypeError(`${kind} requires an immutable pack version.`);
    }
    const expectedActivePackVersion = input.pack.expectedActivePackVersion == null
      ? null
      : requiredText(
          input.pack.expectedActivePackVersion,
          'pack.expectedActivePackVersion',
        );
    const expectedActiveManifestHash = input.pack.expectedActiveManifestHash == null
      ? null
      : requiredText(
          input.pack.expectedActiveManifestHash,
          'pack.expectedActiveManifestHash',
        );
    if (
      (expectedActivePackVersion == null)
      !== (expectedActiveManifestHash == null)
    ) {
      throw new TypeError(
        'pack expected-active version and manifest hash must be supplied together.',
      );
    }
    if (
      expectedActiveManifestHash != null
      && !/^[0-9a-f]{64}$/.test(expectedActiveManifestHash)
    ) {
      throw new TypeError(
        'pack.expectedActiveManifestHash must be a SHA-256 fingerprint.',
      );
    }
    if (
      !Object.hasOwn(input.pack, 'expectedActivePackVersion')
      || !Object.hasOwn(input.pack, 'expectedActiveManifestHash')
    ) {
      throw new TypeError(
        'Pack import requires the reviewed active pack version and manifest hash.',
      );
    }
    pack = {
      packId: requiredText(input.pack.packId, 'pack.packId'),
      packVersion: requiredText(input.pack.packVersion, 'pack.packVersion'),
      name: requiredText(input.pack.name, 'pack.name'),
      manifestHash: requiredText(
        input.pack.manifestHash,
        'pack.manifestHash',
      ),
      expectedActivePackVersion,
      expectedActiveManifestHash,
      importPlanHash: null,
      manifest: {},
    };
    if (!/^[0-9a-f]{64}$/.test(pack.manifestHash)) {
      throw new TypeError('pack.manifestHash must be a SHA-256 fingerprint.');
    }
    const manifestAdmission = parseContentPack(input.pack.manifest);
    if (manifestAdmission.ok === false) {
      throw new TypeError(
        `pack.manifest is invalid: ${manifestAdmission.error}`,
      );
    }
    const manifest = manifestAdmission.pack;
    if (!manifest) {
      throw new TypeError('pack.manifest did not produce an admitted pack.');
    }
    if (
      manifest.packId !== pack.packId
      || manifest.packVersion !== pack.packVersion
      || manifest.name !== pack.name
      || manifest.manifestHash !== pack.manifestHash
    ) {
      throw new TypeError(
        'pack.manifest identity does not match the reviewed pack version.',
      );
    }
    const preparedManifest = prepareContentPackImport(manifest);
    if (
      preparedManifest.rejected.length > 0
      || preparedManifest.items.length !== entries.length
    ) {
      throw new TypeError(
        'pack.manifest does not admit the reviewed import entries.',
      );
    }
    const expectedEntries = preparedManifest.items.map(entry => ({
      packEntryId: entry.packEntryId,
      category: entry.bucket,
      data: entry.item,
    }));
    const reviewedEntries = entries.map(entry => ({
      packEntryId: entry.packEntryId,
      category: entry.category,
      data: entry.data,
    }));
    if (
      canonicalContentJson(expectedEntries)
      !== canonicalContentJson(reviewedEntries)
    ) {
      throw new TypeError(
        'pack.manifest content does not match the reviewed import entries.',
      );
    }
    pack.manifest = /** @type {Record<string, unknown>} */ (
      detachContentJson(manifest)
    );
    // Installation identities and reviewed heads are compare-and-swap inputs,
    // not authored pack content. Keeping them outside this fingerprint makes a
    // same-version replay idempotent while still detecting any semantic change
    // to the ordered entries that the pack actually publishes.
    pack.importPlanHash = fingerprintContent({
      schemaVersion: CUSTOM_CONTENT_COMMAND_SCHEMA_VERSION,
      packId: pack.packId,
      packVersion: pack.packVersion,
      entries: entries.map(entry => ({
        packEntryId: entry.packEntryId,
        category: entry.category,
        data: entry.data,
      })),
    });
  } else if (input.pack != null) {
    throw new TypeError(`${kind} must not carry a pack version.`);
  }
  if (
    !ENTRY_COMMAND_KINDS.has(kind)
    && entries.length > 0
  ) {
    throw new TypeError(`${kind} must not carry definition entries.`);
  }
  let environment = null;
  let expectedActiveEnvironmentRevisionId = null;
  if (kind === CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE) {
    const admitted = admitContentEnvironmentRevision(input.environment);
    if (!admitted.ok) {
      throw new TypeError(
        admitted.message || admitted.reason || 'Invalid content environment.',
      );
    }
    environment = admitted.environment;
    expectedActiveEnvironmentRevisionId = requiredText(
      input.expectedActiveEnvironmentRevisionId,
      'expectedActiveEnvironmentRevisionId',
    );
  } else if (input.environment != null) {
    throw new TypeError(`${kind} must not carry an environment revision.`);
  } else if (input.expectedActiveEnvironmentRevisionId != null) {
    throw new TypeError(
      `${kind} must not carry an expected active environment revision.`,
    );
  }

  const plan = /** @type {Record<string, unknown>} */ (detachContentJson({
    schemaVersion: CUSTOM_CONTENT_COMMAND_SCHEMA_VERSION,
    kind,
    definitionId: input.definitionId || null,
    expectedHeadRevisionId: input.expectedHeadRevisionId || null,
    expectedActiveEnvironmentRevisionId,
    pack,
    environment,
    entries,
  }, { maxDepth: 40, maxNodes: 20_000 }));
  return Object.freeze({
    plan: Object.freeze(plan),
    fingerprint: fingerprintContent(plan),
    entries: Object.freeze(entries.map(Object.freeze)),
  });
}

/** @param {unknown} plan @param {unknown} fingerprint */
export function verifyCustomContentPreview(plan, fingerprint) {
  try {
    return fingerprintContent(plan) === String(fingerprint || '');
  } catch {
    return false;
  }
}
