/**
 * Semantic graph proof for canonical custom-content archives.
 */

import {
  admitContentEnvironmentRevision,
} from '../domain/content/contentEnvironment.js';
import {
  resolveContentEnvironmentSnapshot,
} from '../domain/content/contentEnvironmentResolution.js';
import {
  contentRevisionHash,
} from '../domain/content/customContentVersioning.js';
import {
  admitReviewedSupplyChain,
  isReviewedDerivedContentCategory,
  reviewedSupplyChainContentHash,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  canonicalContentJson,
  fingerprintContent,
  isPlainContentRecord,
} from '../domain/content/contentFingerprint.js';
import {
  ARCHIVE_CONTENT_CATEGORIES,
  COMMAND_RECEIPT_KEYS,
  CUSTOM_CONTENT_ARCHIVE_LIMITS,
  DEFINITION_KEYS,
  PACK_KEYS,
  PACK_MAPPING_KEYS,
  PACK_VERSION_ENTRY_KEYS,
  PACK_VERSION_KEYS,
  PROVENANCE_KEYS,
  REVISION_KEYS,
  SOURCE_KEYS,
  assertExactArchiveKeys,
  canonicalArchiveTimestamp,
  requiredArchiveHash,
  requiredArchiveText,
} from './customContentArchiveContract.js';
import {
  validateArchivePackManifest,
} from './customContentArchivePack.js';
import {
  validateReviewedSupplyChainArchiveGraph,
} from './customContentArchiveReviewedChains.js';

const CONTENT_CATEGORY_SET = new Set(ARCHIVE_CONTENT_CATEGORIES);

/**
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).JsonRecord} JsonRecord
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchiveDefinition} ArchiveDefinition
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchiveRevision} ArchiveRevision
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchivePack} ArchivePack
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchivePackVersion} ArchivePackVersion
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchivePackMapping} ArchivePackMapping
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchivePackVersionEntry} ArchivePackVersionEntry
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchiveCommandReceipt} ArchiveCommandReceipt
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchiveSource} ArchiveSource
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchiveProvenance} ArchiveProvenance
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).CustomContentArchiveLedger} CustomContentArchiveLedger
 */

/** @param {unknown} value @param {string} field */
function nullableArchiveText(value, field) {
  return value == null ? null : requiredArchiveText(value, field);
}

/**
 * @param {unknown} value
 * @param {string} field
 * @returns {ArchiveSource}
 */
export function validateArchiveSource(value, field) {
  assertExactArchiveKeys(value, SOURCE_KEYS, field);
  return {
    type: requiredArchiveText(value.type, `${field}.type`),
    key: requiredArchiveText(value.key, `${field}.key`),
    exportedAt: canonicalArchiveTimestamp(
      value.exportedAt,
      `${field}.exportedAt`,
    ),
    ledgerFingerprint: requiredArchiveHash(
      value.ledgerFingerprint,
      `${field}.ledgerFingerprint`,
    ),
  };
}

/**
 * Wrapper fields are canonical; `receipt` is deliberately opaque application
 * provenance whose JSON meaning is retained without field-level rewriting.
 *
 * @param {unknown} values
 * @param {string} field
 * @returns {ArchiveCommandReceipt[]}
 */
export function validateArchiveCommandReceipts(values, field) {
  if (
    !Array.isArray(values)
    || values.length > CUSTOM_CONTENT_ARCHIVE_LIMITS.commandReceipts
  ) {
    throw new TypeError(`${field} exceeds archive receipt bounds.`);
  }
  /** @type {Set<string>} */
  const commandIds = new Set();
  return values.map((value, index) => {
    const path = `${field}[${index}]`;
    assertExactArchiveKeys(value, COMMAND_RECEIPT_KEYS, path);
    const commandId = requiredArchiveText(value.commandId, `${path}.commandId`);
    if (commandIds.has(commandId)) {
      throw new TypeError(`${field} repeats commandId "${commandId}".`);
    }
    commandIds.add(commandId);
    requiredArchiveHash(value.fingerprint, `${path}.fingerprint`);
    if (!isPlainContentRecord(value.receipt)) {
      throw new TypeError(`${path}.receipt must be an opaque JSON object.`);
    }
    return /** @type {ArchiveCommandReceipt} */ (value);
  });
}

/**
 * @param {unknown} values
 * @returns {ArchiveProvenance[]}
 */
export function validateArchiveProvenance(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('auditProvenance must be an array.');
  }
  /** @type {Map<string, string>} */
  const meaningByFingerprint = new Map();

  /** @param {unknown[]} records @param {string} field */
  const visit = (records, field) => records.map((value, index) => {
    const path = `${field}[${index}]`;
    assertExactArchiveKeys(value, PROVENANCE_KEYS, path);
    const fingerprint = requiredArchiveHash(
      value.archiveFingerprint,
      `${path}.archiveFingerprint`,
    );
    const meaning = canonicalContentJson(value, {
      maxNodes: CUSTOM_CONTENT_ARCHIVE_LIMITS.maxNodes,
    });
    const priorMeaning = meaningByFingerprint.get(fingerprint);
    if (priorMeaning != null && priorMeaning !== meaning) {
      throw new TypeError(
        `Imported audit provenance conflicts at "${fingerprint}".`,
      );
    }
    if (priorMeaning == null) {
      meaningByFingerprint.set(fingerprint, meaning);
      if (
        meaningByFingerprint.size
        > CUSTOM_CONTENT_ARCHIVE_LIMITS.auditProvenance
      ) {
        throw new TypeError(
          'Imported audit provenance exceeds its total bound.',
        );
      }
    }
    validateArchiveSource(value.source, `${path}.source`);
    validateArchiveCommandReceipts(
      value.commandReceipts,
      `${path}.commandReceipts`,
    );
    if (!Array.isArray(value.auditProvenance)) {
      throw new TypeError(`${path}.auditProvenance must be an array.`);
    }
    visit(value.auditProvenance, `${path}.auditProvenance`);
    return /** @type {ArchiveProvenance} */ (value);
  });
  return visit(values, 'auditProvenance');
}

/** @param {CustomContentArchiveLedger} ledger */
function validateDefinitionsAndRevisions(ledger) {
  if (
    !Array.isArray(ledger.definitions)
    || ledger.definitions.length > CUSTOM_CONTENT_ARCHIVE_LIMITS.definitions
    || !Array.isArray(ledger.revisions)
    || ledger.revisions.length > CUSTOM_CONTENT_ARCHIVE_LIMITS.revisions
  ) {
    throw new TypeError('Archive definition or revision bounds were exceeded.');
  }

  /** @type {Map<string, ArchiveDefinition>} */
  const definitionById = new Map();
  /** @type {Set<string>} */
  const localUids = new Set();
  for (const [index, value] of ledger.definitions.entries()) {
    const field = `ledger.definitions[${index}]`;
    assertExactArchiveKeys(value, DEFINITION_KEYS, field);
    const definition = /** @type {ArchiveDefinition} */ (value);
    const id = requiredArchiveText(definition.id, `${field}.id`);
    const localUid = requiredArchiveText(
      definition.localUid,
      `${field}.localUid`,
    );
    if (
      !CONTENT_CATEGORY_SET.has(definition.category)
      || definitionById.has(id)
      || localUids.has(localUid)
    ) {
      throw new TypeError(
        'Archive definition identity is invalid or duplicated.',
      );
    }
    requiredArchiveText(
      definition.headRevisionId,
      `${field}.headRevisionId`,
    );
    nullableArchiveText(definition.legacyContentId, `${field}.legacyContentId`);
    canonicalArchiveTimestamp(definition.archivedAt, `${field}.archivedAt`);
    canonicalArchiveTimestamp(definition.createdAt, `${field}.createdAt`);
    canonicalArchiveTimestamp(definition.updatedAt, `${field}.updatedAt`);
    definitionById.set(id, definition);
    localUids.add(localUid);
  }

  /** @type {Map<string, ArchiveRevision>} */
  const revisionById = new Map();
  /** @type {Map<string, ArchiveRevision[]>} */
  const revisionsByDefinition = new Map();
  for (const [index, value] of ledger.revisions.entries()) {
    const field = `ledger.revisions[${index}]`;
    assertExactArchiveKeys(value, REVISION_KEYS, field);
    const revision = /** @type {ArchiveRevision} */ (value);
    const id = requiredArchiveText(revision.id, `${field}.id`);
    const definitionId = requiredArchiveText(
      revision.definitionId,
      `${field}.definitionId`,
    );
    const definition = definitionById.get(definitionId);
    if (
      revision.schemaVersion !== 1
      || !definition
      || revisionById.has(id)
      || revision.category !== definition.category
      || !Number.isInteger(revision.revisionNumber)
      || revision.revisionNumber < 1
      || !isPlainContentRecord(revision.data)
      || (
        !isReviewedDerivedContentCategory(revision.category)
        && revision.data.localUid !== definition.localUid
      )
    ) {
      throw new TypeError('Archive revision identity or lineage is invalid.');
    }
    nullableArchiveText(
      revision.parentRevisionId,
      `${field}.parentRevisionId`,
    );
    const artifactAdmission = isReviewedDerivedContentCategory(
      revision.category,
    )
      ? admitReviewedSupplyChain(revision.data)
      : null;
    if (
      artifactAdmission
      && artifactAdmission.ok === false
    ) {
      throw new TypeError(
        'Archive reviewed artifact failed exact schema admission.',
      );
    }
    const contentHash = isReviewedDerivedContentCategory(revision.category)
      ? reviewedSupplyChainContentHash(revision.data)
      : contentRevisionHash(revision.category, revision.data);
    if (
      requiredArchiveHash(revision.contentHash, `${field}.contentHash`)
      !== contentHash
    ) {
      throw new TypeError(
        'Archive revision content hash does not match its data.',
      );
    }
    canonicalArchiveTimestamp(revision.createdAt, `${field}.createdAt`);
    revisionById.set(id, revision);
    const chain = revisionsByDefinition.get(definitionId) || [];
    chain.push(revision);
    revisionsByDefinition.set(definitionId, chain);
  }

  for (const definition of definitionById.values()) {
    const chain = revisionsByDefinition.get(definition.id) || [];
    chain.sort((left, right) => left.revisionNumber - right.revisionNumber);
    if (chain.length === 0) {
      throw new TypeError('Every archived definition must have a revision.');
    }
    for (const [index, revision] of chain.entries()) {
      const expectedNumber = index + 1;
      const expectedParent = index === 0 ? null : chain[index - 1].id;
      if (
        revision.revisionNumber !== expectedNumber
        || revision.parentRevisionId !== expectedParent
      ) {
        throw new TypeError(
          'Archive revision history must be one contiguous 1..N chain.',
        );
      }
    }
    if (definition.headRevisionId !== chain[chain.length - 1].id) {
      throw new TypeError(
        'Archive definition head must be its maximum contiguous revision.',
      );
    }
  }
  validateReviewedSupplyChainArchiveGraph({
    definitions: ledger.definitions,
    revisions: ledger.revisions,
    definitionById,
    revisionById,
  });
  return { definitionById, revisionById };
}

/**
 * @param {CustomContentArchiveLedger} ledger
 * @param {Map<string, ArchiveDefinition>} definitionById
 * @param {Map<string, ArchiveRevision>} revisionById
 */
function validatePacks(ledger, definitionById, revisionById) {
  if (
    !Array.isArray(ledger.packs)
    || ledger.packs.length > CUSTOM_CONTENT_ARCHIVE_LIMITS.packs
    || !Array.isArray(ledger.packVersions)
    || ledger.packVersions.length > CUSTOM_CONTENT_ARCHIVE_LIMITS.packVersions
    || !Array.isArray(ledger.packEntryDefinitions)
    || !Array.isArray(ledger.packVersionEntries)
    || ledger.packEntryDefinitions.length
      > CUSTOM_CONTENT_ARCHIVE_LIMITS.packEntries
    || ledger.packVersionEntries.length
      > CUSTOM_CONTENT_ARCHIVE_LIMITS.packEntries
  ) {
    throw new TypeError('Archive pack bounds were exceeded.');
  }

  /** @type {Map<string, ArchivePack>} */
  const packById = new Map();
  for (const [index, value] of ledger.packs.entries()) {
    const field = `ledger.packs[${index}]`;
    assertExactArchiveKeys(value, PACK_KEYS, field);
    const pack = /** @type {ArchivePack} */ (value);
    const packId = requiredArchiveText(pack.packId, `${field}.packId`);
    if (packById.has(packId)) {
      throw new TypeError('Archive pack identity is duplicated.');
    }
    requiredArchiveText(pack.name, `${field}.name`);
    if (
      (pack.activePackVersion == null) !== (pack.activeManifestHash == null)
    ) {
      throw new TypeError('Archive active pack pointer is incomplete.');
    }
    nullableArchiveText(
      pack.activePackVersion,
      `${field}.activePackVersion`,
    );
    if (pack.activeManifestHash != null) {
      requiredArchiveHash(
        pack.activeManifestHash,
        `${field}.activeManifestHash`,
      );
    }
    canonicalArchiveTimestamp(pack.createdAt, `${field}.createdAt`);
    canonicalArchiveTimestamp(pack.updatedAt, `${field}.updatedAt`);
    packById.set(packId, pack);
  }

  /** @type {Map<string, ArchivePackVersion>} */
  const versionByKey = new Map();
  for (const [index, value] of ledger.packVersions.entries()) {
    const field = `ledger.packVersions[${index}]`;
    assertExactArchiveKeys(value, PACK_VERSION_KEYS, field);
    const version = /** @type {ArchivePackVersion} */ (value);
    const key = `${requiredArchiveText(
      version.packId,
      `${field}.packId`,
    )}\u0000${requiredArchiveText(
      version.packVersion,
      `${field}.packVersion`,
    )}`;
    if (
      !packById.has(version.packId)
      || versionByKey.has(key)
      || !isPlainContentRecord(version.manifest)
    ) {
      throw new TypeError('Archive pack version is invalid or duplicated.');
    }
    requiredArchiveHash(version.manifestHash, `${field}.manifestHash`);
    requiredArchiveHash(version.importPlanHash, `${field}.importPlanHash`);
    canonicalArchiveTimestamp(version.createdAt, `${field}.createdAt`);
    versionByKey.set(key, version);
  }

  /** @type {Map<string, ArchivePackMapping>} */
  const mappingByKey = new Map();
  for (const [index, value] of ledger.packEntryDefinitions.entries()) {
    const field = `ledger.packEntryDefinitions[${index}]`;
    assertExactArchiveKeys(value, PACK_MAPPING_KEYS, field);
    const mapping = /** @type {ArchivePackMapping} */ (value);
    const key = `${requiredArchiveText(
      mapping.packId,
      `${field}.packId`,
    )}\u0000${requiredArchiveText(
      mapping.packEntryId,
      `${field}.packEntryId`,
    )}`;
    const definitionId = requiredArchiveText(
      mapping.definitionId,
      `${field}.definitionId`,
    );
    const definition = definitionById.get(definitionId);
    if (
      !packById.has(mapping.packId)
      || !definition
      || isReviewedDerivedContentCategory(definition.category)
      || mappingByKey.has(key)
    ) {
      throw new TypeError(
        'Archive pack-entry mapping is invalid or duplicated.',
      );
    }
    mappingByKey.set(key, mapping);
  }

  /** @type {Map<string, ArchivePackVersionEntry[]>} */
  const entriesByVersion = new Map();
  /** @type {Set<string>} */
  const entryKeys = new Set();
  for (const [index, value] of ledger.packVersionEntries.entries()) {
    const field = `ledger.packVersionEntries[${index}]`;
    assertExactArchiveKeys(value, PACK_VERSION_ENTRY_KEYS, field);
    const entry = /** @type {ArchivePackVersionEntry} */ (value);
    const versionKey = `${requiredArchiveText(
      entry.packId,
      `${field}.packId`,
    )}\u0000${requiredArchiveText(
      entry.packVersion,
      `${field}.packVersion`,
    )}`;
    const packEntryId = requiredArchiveText(
      entry.packEntryId,
      `${field}.packEntryId`,
    );
    const entryKey = `${versionKey}\u0000${packEntryId}`;
    const definition = definitionById.get(requiredArchiveText(
      entry.definitionId,
      `${field}.definitionId`,
    ));
    const revision = revisionById.get(requiredArchiveText(
      entry.revisionId,
      `${field}.revisionId`,
    ));
    if (
      !versionByKey.has(versionKey)
      || entryKeys.has(entryKey)
      || !definition
      || !revision
      || revision.definitionId !== definition.id
      || entry.category !== definition.category
      || isReviewedDerivedContentCategory(entry.category)
      || mappingByKey.get(
        `${entry.packId}\u0000${entry.packEntryId}`,
      )?.definitionId !== definition.id
      || !Number.isInteger(entry.ordinal)
      || entry.ordinal < 0
    ) {
      throw new TypeError('Archive pack-version entry is invalid.');
    }
    entryKeys.add(entryKey);
    const entries = entriesByVersion.get(versionKey) || [];
    entries.push(entry);
    entriesByVersion.set(versionKey, entries);
  }

  for (const [versionKey, version] of versionByKey.entries()) {
    const entries = entriesByVersion.get(versionKey) || [];
    entries.sort((left, right) => left.ordinal - right.ordinal);
    if (
      entries.length === 0
      || entries.some((entry, index) => entry.ordinal !== index)
    ) {
      throw new TypeError(
        'Archive pack versions require a nonempty contiguous closure.',
      );
    }
    const importPlanHash = fingerprintContent({
      schemaVersion: 1,
      packId: version.packId,
      packVersion: version.packVersion,
      entries: entries.map(entry => ({
        packEntryId: entry.packEntryId,
        category: entry.category,
        data: revisionById.get(entry.revisionId)?.data,
      })),
    });
    if (version.importPlanHash !== importPlanHash) {
      throw new TypeError(
        'Archive pack import-plan hash does not match its ordered closure.',
      );
    }
    validateArchivePackManifest(version, entries, revisionById);
  }
  for (const pack of packById.values()) {
    if (pack.activePackVersion == null) continue;
    const active = versionByKey.get(
      `${pack.packId}\u0000${pack.activePackVersion}`,
    );
    if (!active || active.manifestHash !== pack.activeManifestHash) {
      throw new TypeError('Archive active pack version is unavailable.');
    }
  }
  return { versionByKey, entriesByVersion };
}

/**
 * @param {CustomContentArchiveLedger} ledger
 * @param {Map<string, ArchiveRevision>} revisionById
 * @param {Map<string, ArchivePackVersionEntry[]>} entriesByVersion
 * @param {Map<string, ArchivePackVersion>} versionByKey
 */
function validateEnvironments(
  ledger,
  revisionById,
  entriesByVersion,
  versionByKey,
) {
  if (
    !Array.isArray(ledger.environments)
    || ledger.environments.length > CUSTOM_CONTENT_ARCHIVE_LIMITS.environments
  ) {
    throw new TypeError('Archive environment bounds were exceeded.');
  }
  /** @type {Map<string, JsonRecord>} */
  const environmentByRevisionId = new Map();
  /** @type {Map<string, number[]>} */
  const numbersByEnvironment = new Map();
  for (const [index, value] of ledger.environments.entries()) {
    const admission = admitContentEnvironmentRevision(value);
    if (admission.ok === false) {
      throw new TypeError(
        admission.message || admission.reason || 'Archive environment is invalid.',
      );
    }
    const environment = admission.environment;
    canonicalArchiveTimestamp(
      environment.createdAt,
      `ledger.environments[${index}].createdAt`,
    );
    if (environmentByRevisionId.has(environment.environmentRevisionId)) {
      throw new TypeError('Archive environment revision is duplicated.');
    }
    const numbers = numbersByEnvironment.get(environment.environmentId) || [];
    if (numbers.includes(environment.revisionNumber)) {
      throw new TypeError('Archive environment revision number is duplicated.');
    }
    numbers.push(environment.revisionNumber);
    numbersByEnvironment.set(environment.environmentId, numbers);

    const revisions = environment.directDefinitions.flatMap(reference => {
      const revision = revisionById.get(reference.revisionId);
      return revision ? [revision] : [];
    });
    const closures = environment.packVersions.flatMap(binding => {
      const key = `${binding.packId}\u0000${binding.packVersionId}`;
      const version = versionByKey.get(key);
      if (!version) return [];
      return [{
        packId: binding.packId,
        packVersionId: binding.packVersionId,
        manifestHash: version.manifestHash,
        entries: entriesByVersion.get(key) || [],
      }];
    });
    const resolution = resolveContentEnvironmentSnapshot(
      environment,
      revisions,
      closures,
    );
    if (resolution.ok === false) {
      throw new TypeError(
        resolution.message
        || resolution.reason
        || 'Archive environment cannot be resolved.',
      );
    }
    environmentByRevisionId.set(
      environment.environmentRevisionId,
      /** @type {JsonRecord} */ (environment),
    );
  }
  for (const numbers of numbersByEnvironment.values()) {
    numbers.sort((left, right) => left - right);
    if (numbers.some((number, index) => number !== index + 1)) {
      throw new TypeError(
        'Archive environment history must use contiguous revision numbers.',
      );
    }
  }
  if (
    ledger.activeEnvironmentRevisionId != null
    && !environmentByRevisionId.has(
      requiredArchiveText(
        ledger.activeEnvironmentRevisionId,
        'ledger.activeEnvironmentRevisionId',
      ),
    )
  ) {
    throw new TypeError('Archive active environment revision is unavailable.');
  }
  return environmentByRevisionId;
}

/**
 * @param {CustomContentArchiveLedger} ledger
 */
export function validateCustomContentArchiveLedger(ledger) {
  const { definitionById, revisionById } =
    validateDefinitionsAndRevisions(ledger);
  const { versionByKey, entriesByVersion } = validatePacks(
    ledger,
    definitionById,
    revisionById,
  );
  validateEnvironments(
    ledger,
    revisionById,
    entriesByVersion,
    versionByKey,
  );
  validateArchiveCommandReceipts(
    ledger.commandReceipts,
    'ledger.commandReceipts',
  );
  return {
    definitionById,
    revisionById,
    versionByKey,
    entriesByVersion,
  };
}
