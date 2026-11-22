/**
 * Canonical full-fidelity custom-content archive.
 *
 * This is the shared data shape for browser-local premium cutover and account
 * backup/restore. Unlike a publishing pack, it preserves lifecycle history,
 * immutable closures, environment history and canonically exact JSON receipts.
 */

import {
  makeContentEnvironmentRevision,
} from '../domain/content/contentEnvironment.js';
import {
  detachContentJson,
  fingerprintContent,
  isPlainContentRecord,
} from '../domain/content/contentFingerprint.js';
import {
  ARCHIVE_CONTENT_CATEGORIES,
  ARCHIVE_KEYS,
  CUSTOM_CONTENT_ARCHIVE_FORMAT,
  CUSTOM_CONTENT_ARCHIVE_LIMITS,
  CUSTOM_CONTENT_ARCHIVE_VERSION,
  LEDGER_KEYS,
  SOURCE_KEYS,
  assertExactArchiveKeys,
  canonicalArchiveTimestamp,
  requiredArchiveHash,
  requiredArchiveText,
  sortedArchiveValues,
} from './customContentArchiveContract.js';
import {
  buildArchivePackManifest,
} from './customContentArchivePack.js';
import {
  parseLocalPackEntryKey,
} from './customContentLocalPackKeys.js';
import {
  validateArchiveProvenance,
  validateArchiveSource,
  validateCustomContentArchiveLedger,
} from './customContentArchiveValidation.js';

export {
  CUSTOM_CONTENT_ARCHIVE_FORMAT,
  CUSTOM_CONTENT_ARCHIVE_LIMITS,
  CUSTOM_CONTENT_ARCHIVE_VERSION,
} from './customContentArchiveContract.js';

const CONTENT_CATEGORIES = new Set(ARCHIVE_CONTENT_CATEGORIES);

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
 * ).ArchiveProvenance} ArchiveProvenance
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).CustomContentArchiveLedger} CustomContentArchiveLedger
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).CustomContentArchive} CustomContentArchive
 * @typedef {{
 *   definitions?:Record<string, JsonRecord>,
 *   revisions?:Record<string, JsonRecord>,
 *   packs?:Record<string, JsonRecord>,
 *   packEntryDefinitions?:Record<string, unknown>,
 *   packVersionEntries?:Record<string, unknown>,
 *   activePacks?:Record<string, JsonRecord>,
 *   environments?:Record<string, JsonRecord>,
 *   activeEnvironmentRevisionId?:unknown,
 *   commandReceipts?:Record<string, JsonRecord>,
 * }} LocalArchiveLedger
 * @typedef {{
 *   sourceKey:string,
 *   sourceType?:string,
 *   exportedAt?:string|null,
 *   auditProvenance?:unknown[],
 * }} ArchiveSealOptions
 */

/**
 * @param {unknown} value
 * @param {string} field
 * @returns {JsonRecord}
 */
function archiveRecord(value, field) {
  if (!isPlainContentRecord(value)) {
    throw new TypeError(`${field} must be an object.`);
  }
  return /** @type {JsonRecord} */ (value);
}

/** @param {unknown} value */
function timestampOrNull(value) {
  return value == null ? null : String(value);
}

/**
 * Stable row ordering makes independently exported equivalent ledgers share a
 * fingerprint. Manifests and opaque receipt payloads are detached, not
 * rewritten.
 *
 * @param {unknown} value
 * @returns {CustomContentArchiveLedger}
 */
function normalizePortableLedger(value) {
  const ledger = archiveRecord(value, 'ledger');
  assertExactArchiveKeys(ledger, LEDGER_KEYS, 'ledger');
  const arrays = [
    'definitions',
    'revisions',
    'packs',
    'packVersions',
    'packEntryDefinitions',
    'packVersionEntries',
    'environments',
    'commandReceipts',
  ];
  for (const field of arrays) {
    if (!Array.isArray(ledger[field])) {
      throw new TypeError(`ledger.${field} must be an array.`);
    }
  }
  const definitions = /** @type {ArchiveDefinition[]} */ (ledger.definitions);
  const revisions = /** @type {ArchiveRevision[]} */ (ledger.revisions);
  const packs = /** @type {ArchivePack[]} */ (ledger.packs);
  const packVersions =
    /** @type {ArchivePackVersion[]} */ (ledger.packVersions);
  const mappings =
    /** @type {ArchivePackMapping[]} */ (ledger.packEntryDefinitions);
  const entries =
    /** @type {ArchivePackVersionEntry[]} */ (ledger.packVersionEntries);
  const environments = /** @type {JsonRecord[]} */ (ledger.environments);
  const receipts =
    /** @type {ArchiveCommandReceipt[]} */ (ledger.commandReceipts);
  return {
    schemaVersion: Number(ledger.schemaVersion),
    definitions: sortedArchiveValues(definitions, row => row.id),
    revisions: sortedArchiveValues(revisions, row => [
      row.definitionId,
      String(row.revisionNumber).padStart(12, '0'),
      row.id,
    ].join('\u0000')),
    packs: sortedArchiveValues(packs, row => row.packId),
    packVersions: sortedArchiveValues(packVersions, row => (
      `${row.packId}\u0000${row.packVersion}`
    )),
    packEntryDefinitions: sortedArchiveValues(mappings, row => (
      `${row.packId}\u0000${row.packEntryId}`
    )),
    packVersionEntries: sortedArchiveValues(entries, row => [
      row.packId,
      row.packVersion,
      String(row.ordinal).padStart(12, '0'),
      row.packEntryId,
    ].join('\u0000')),
    environments: sortedArchiveValues(environments, row => [
      String(row.environmentId || ''),
      String(row.revisionNumber || '').padStart(12, '0'),
      String(row.environmentRevisionId || ''),
    ].join('\u0000')),
    activeEnvironmentRevisionId:
      ledger.activeEnvironmentRevisionId == null
        ? null
        : String(ledger.activeEnvironmentRevisionId),
    commandReceipts: sortedArchiveValues(receipts, row => row.commandId),
  };
}

/**
 * Seal an already-portable graph. This is the authority reused by archive
 * merging so manifests and canonically exact receipt payloads are preserved.
 *
 * @param {unknown} portableLedgerValue
 * @param {ArchiveSealOptions} options
 * @returns {Readonly<CustomContentArchive>}
 */
export function sealCustomContentArchive(portableLedgerValue, options) {
  const ledger = normalizePortableLedger(portableLedgerValue);
  const source = {
    type: requiredArchiveText(
      options?.sourceType || 'browser-local',
      'source.type',
    ),
    key: requiredArchiveText(options?.sourceKey, 'source.key'),
    exportedAt: canonicalArchiveTimestamp(
      options?.exportedAt === undefined
        ? new Date().toISOString()
        : options.exportedAt,
      'source.exportedAt',
    ),
    ledgerFingerprint: fingerprintContent(ledger, {
      maxNodes: CUSTOM_CONTENT_ARCHIVE_LIMITS.maxNodes,
    }),
  };
  const auditProvenance = sortedArchiveValues(
    /** @type {ArchiveProvenance[]} */ (
      Array.isArray(options?.auditProvenance)
        ? options.auditProvenance
        : []
    ),
    row => String(row.archiveFingerprint || ''),
  );
  const core = {
    format: CUSTOM_CONTENT_ARCHIVE_FORMAT,
    formatVersion: CUSTOM_CONTENT_ARCHIVE_VERSION,
    source,
    ledger,
    auditProvenance,
  };
  const archive = {
    ...core,
    archiveFingerprint: fingerprintContent(core, {
      maxNodes: CUSTOM_CONTENT_ARCHIVE_LIMITS.maxNodes,
    }),
  };
  const admission = validateCustomContentArchive(archive);
  if (admission.ok === false) {
    throw new TypeError(admission.message || admission.reason);
  }
  return admission.archive;
}

/**
 * @param {LocalArchiveLedger} ledger
 * @returns {{
 *   definitions:ArchiveDefinition[],
 *   revisions:ArchiveRevision[],
 *   definitionIds:Set<string>,
 *   revisionById:Map<string, ArchiveRevision>,
 * }}
 */
function projectDefinitions(ledger) {
  // Archive construction is a lossless authority boundary. Unsupported rows
  // must stop export rather than disappear from the sealed subset: cutover may
  // clear the source ledger after a confirmed import of this exact graph.
  const definitions = Object.values(ledger.definitions || {})
    .map((rawValue, index) => {
      const value = archiveRecord(
        rawValue,
        `localLedger.definitions[${index}]`,
      );
      const category = String(value.category || '');
      if (!CONTENT_CATEGORIES.has(category)) {
        throw new TypeError(
          `Local definition "${String(value.id || index)}" has unsupported `
          + `category "${category}" and cannot be archived losslessly.`,
        );
      }
      return {
        id: String(value.id),
        category,
        localUid: String(value.localUid),
        headRevisionId: String(value.headRevisionId),
        archivedAt: timestampOrNull(value.archivedAt),
        createdAt: timestampOrNull(value.createdAt),
        updatedAt: timestampOrNull(value.updatedAt),
        legacyContentId: value.legacyContentId == null
          ? null
          : String(value.legacyContentId),
      };
    });
  const definitionIds = new Set(definitions.map(row => row.id));
  const revisions = Object.values(ledger.revisions || {})
    .map((rawValue, index) => {
      const value = archiveRecord(
        rawValue,
        `localLedger.revisions[${index}]`,
      );
      const definitionId = String(value.definitionId || '');
      if (!definitionIds.has(definitionId)) {
        throw new TypeError(
          `Local revision "${String(value.id || index)}" references missing `
          + `definition "${definitionId}" and cannot be archived losslessly.`,
        );
      }
      return {
        schemaVersion: 1,
        id: String(value.id),
        definitionId,
        category: String(value.category),
        revisionNumber: Number(value.revisionNumber),
        parentRevisionId: value.parentRevisionId == null
          ? null
          : String(value.parentRevisionId),
        contentHash: String(value.contentHash),
        data: archiveRecord(value.data, 'revision.data'),
        createdAt: timestampOrNull(value.createdAt),
      };
    });
  return {
    definitions,
    revisions,
    definitionIds,
    revisionById: new Map(revisions.map(row => [row.id, row])),
  };
}

/**
 * @param {LocalArchiveLedger} ledger
 * @param {Set<string>} definitionIds
 * @returns {{
 *   mappings:ArchivePackMapping[],
 *   entries:ArchivePackVersionEntry[],
 * }}
 */
function projectPackEdges(ledger, definitionIds) {
  // Preserve the same fail-closed law for relationships. Filtering one dangling
  // edge would make an otherwise valid archive fingerprint certify data that no
  // longer represents the source authority.
  const mappings = Object.entries(ledger.packEntryDefinitions || {})
    .map(([mappingKey, rawDefinitionId]) => {
      const definitionId = String(rawDefinitionId || '');
      if (!definitionIds.has(definitionId)) {
        throw new TypeError(
          `Local pack mapping "${mappingKey}" references missing definition `
          + `"${definitionId}" and cannot be archived losslessly.`,
        );
      }
      const parsedKey = parseLocalPackEntryKey(mappingKey);
      if (!parsedKey) {
        throw new TypeError(
          `Local pack mapping "${mappingKey}" has an invalid identity key.`,
        );
      }
      const { packId, packEntryId } = parsedKey;
      return { packId, packEntryId, definitionId };
    });
  const entries = Object.entries(ledger.packVersionEntries || {})
    .flatMap(([key, rawEntries]) => {
      const split = key.lastIndexOf('@');
      const packId = split >= 0 ? key.slice(0, split) : key;
      const packVersion = split >= 0 ? key.slice(split + 1) : '';
      if (!Array.isArray(rawEntries)) {
        throw new TypeError(
          `Local pack version "${key}" must contain an entry array.`,
        );
      }
      return rawEntries.map((rawEntry, index) => {
        const entry = archiveRecord(
          rawEntry,
          `localLedger.packVersionEntries["${key}"][${index}]`,
        );
        const definitionId = String(entry.definitionId || '');
        if (!definitionIds.has(definitionId)) {
          throw new TypeError(
            `Local pack entry "${String(entry.packEntryId || index)}" in `
            + `"${key}" references missing definition "${definitionId}" and `
            + 'cannot be archived losslessly.',
          );
        }
        return {
          packId,
          packVersion,
          packEntryId: String(entry.packEntryId),
          definitionId,
          revisionId: String(entry.revisionId),
          category: String(entry.category),
          ordinal: Number(entry.ordinal),
        };
      });
    });
  return { mappings, entries };
}

/**
 * @param {LocalArchiveLedger} ledger
 * @param {ArchivePackVersionEntry[]} entries
 * @param {Map<string, ArchiveRevision>} revisionById
 */
function projectPacks(ledger, entries, revisionById) {
  /** @type {ArchivePackVersion[]} */
  const packVersions = [];
  /** @type {Map<string, ArchivePackVersion>} */
  const versionByKey = new Map();
  for (const stored of Object.values(ledger.packs || {})) {
    const packId = String(stored.packId);
    const packVersion = String(stored.packVersion);
    const closure = entries.filter(entry => (
      entry.packId === packId && entry.packVersion === packVersion
    ));
    const manifest = buildArchivePackManifest({
      packId,
      packVersion,
      name: String(stored.name || packId),
      storedManifestHash: String(stored.manifestHash || ''),
      sourceManifest: stored.manifest || stored,
      createdAt: timestampOrNull(stored.createdAt),
      entries: closure,
      revisionById,
    });
    const version = {
      packId,
      packVersion,
      manifestHash: manifest.manifestHash,
      importPlanHash: fingerprintContent({
        schemaVersion: 1,
        packId,
        packVersion,
        entries: [...closure]
          .sort((left, right) => left.ordinal - right.ordinal)
          .map(entry => ({
            packEntryId: entry.packEntryId,
            category: entry.category,
            data: revisionById.get(entry.revisionId)?.data,
          })),
      }),
      manifest,
      createdAt: timestampOrNull(stored.createdAt),
    };
    packVersions.push(version);
    versionByKey.set(`${packId}\u0000${packVersion}`, version);
  }

  for (const [packId, rawActivation] of Object.entries(
    ledger.activePacks || {},
  )) {
    const activation = archiveRecord(
      rawActivation,
      `localLedger.activePacks["${packId}"]`,
    );
    const version = versionByKey.get(
      `${packId}\u0000${String(activation.packVersion || '')}`,
    );
    if (!version) {
      throw new TypeError(
        `Active local pack "${packId}" references an unavailable version and `
        + 'cannot be archived losslessly.',
      );
    }
  }

  /** @type {Map<string, ArchivePack>} */
  const packById = new Map();
  for (const version of packVersions) {
    if (packById.has(version.packId)) continue;
    const active = ledger.activePacks?.[version.packId] || null;
    const activeVersion = active == null
      ? null
      : versionByKey.get(
          `${version.packId}\u0000${String(active.packVersion)}`,
        ) || null;
    packById.set(version.packId, {
      packId: version.packId,
      name: String(version.manifest.name || version.packId),
      activePackVersion: activeVersion?.packVersion || null,
      activeManifestHash: activeVersion?.manifestHash || null,
      createdAt: version.createdAt,
      updatedAt: version.createdAt,
    });
  }
  return {
    packs: [...packById.values()],
    packVersions,
    versionByKey,
  };
}

/**
 * @param {LocalArchiveLedger} ledger
 * @param {Map<string, ArchivePackVersion>} versionByKey
 */
function projectEnvironments(ledger, versionByKey) {
  return Object.values(ledger.environments || {}).map((value) => {
    const environment = archiveRecord(value, 'environment');
    const packVersions = Array.isArray(environment.packVersions)
      ? environment.packVersions.map((rawBinding, index) => {
          const binding = archiveRecord(rawBinding, 'environment.packVersion');
          const version = versionByKey.get(
            `${String(binding.packId)}\u0000${String(binding.packVersionId)}`,
          );
          return {
            packId: String(binding.packId),
            packVersionId: String(binding.packVersionId),
            manifestHash: version?.manifestHash || String(binding.manifestHash),
            order: index,
          };
        })
      : [];
    return makeContentEnvironmentRevision({
      environmentId: environment.environmentId,
      environmentRevisionId: environment.environmentRevisionId,
      revisionNumber: Number(environment.revisionNumber),
      source: environment.source,
      packVersions,
      directDefinitions: environment.directDefinitions,
      tunables: environment.tunables,
      visualSelection: environment.visualSelection,
      createdAt: environment.createdAt == null
        ? null
        : String(environment.createdAt),
    });
  });
}

/** @param {LocalArchiveLedger} ledger */
function projectReceipts(ledger) {
  return Object.entries(ledger.commandReceipts || {}).map(
    ([commandId, rawRecord]) => {
      const record = archiveRecord(rawRecord, 'commandReceipt');
      return {
        commandId,
        fingerprint: String(record.fingerprint || ''),
        receipt: archiveRecord(record.receipt, 'commandReceipt.receipt'),
      };
    },
  );
}

/**
 * Convert the object-indexed local authority into portable canonical arrays.
 *
 * @param {LocalArchiveLedger} ledger
 * @param {ArchiveSealOptions} options
 */
export function buildCustomContentArchive(ledger, options) {
  const {
    definitions,
    revisions,
    definitionIds,
    revisionById,
  } = projectDefinitions(ledger);
  const {
    mappings,
    entries,
  } = projectPackEdges(ledger, definitionIds);
  const {
    packs,
    packVersions,
    versionByKey,
  } = projectPacks(ledger, entries, revisionById);
  const portableLedger = {
    schemaVersion: 1,
    definitions,
    revisions,
    packs,
    packVersions,
    packEntryDefinitions: mappings,
    packVersionEntries: entries,
    environments: projectEnvironments(ledger, versionByKey),
    activeEnvironmentRevisionId:
      ledger.activeEnvironmentRevisionId == null
        ? null
        : String(ledger.activeEnvironmentRevisionId),
    commandReceipts: projectReceipts(ledger),
  };
  return sealCustomContentArchive(portableLedger, options);
}

/**
 * Strictly admit an archive and prove every internal identity join.
 *
 * @param {unknown} value
 */
export function validateCustomContentArchive(value) {
  try {
    assertExactArchiveKeys(value, ARCHIVE_KEYS, 'archive');
    const archive = /** @type {CustomContentArchive} */ (
      detachContentJson(value, {
        maxNodes: CUSTOM_CONTENT_ARCHIVE_LIMITS.maxNodes,
      })
    );
    const byteLength = new TextEncoder().encode(JSON.stringify(archive)).length;
    if (byteLength > CUSTOM_CONTENT_ARCHIVE_LIMITS.maxBytes) {
      throw new TypeError('Custom-content archive exceeds the byte limit.');
    }
    if (
      archive.format !== CUSTOM_CONTENT_ARCHIVE_FORMAT
      || archive.formatVersion !== CUSTOM_CONTENT_ARCHIVE_VERSION
    ) {
      throw new TypeError('Custom-content archive version is unsupported.');
    }
    assertExactArchiveKeys(archive.source, SOURCE_KEYS, 'archive.source');
    assertExactArchiveKeys(archive.ledger, LEDGER_KEYS, 'archive.ledger');
    const source = validateArchiveSource(archive.source, 'archive.source');
    if (archive.ledger.schemaVersion !== 1) {
      throw new TypeError('Custom-content archive ledger is unsupported.');
    }
    const ledgerFingerprint = fingerprintContent(archive.ledger, {
      maxNodes: CUSTOM_CONTENT_ARCHIVE_LIMITS.maxNodes,
    });
    if (source.ledgerFingerprint !== ledgerFingerprint) {
      throw new TypeError('Archive ledger fingerprint does not match.');
    }
    validateArchiveProvenance(archive.auditProvenance);
    const core = {
      format: archive.format,
      formatVersion: archive.formatVersion,
      source: archive.source,
      ledger: archive.ledger,
      auditProvenance: archive.auditProvenance,
    };
    const fingerprint = fingerprintContent(core, {
      maxNodes: CUSTOM_CONTENT_ARCHIVE_LIMITS.maxNodes,
    });
    if (
      requiredArchiveHash(
        archive.archiveFingerprint,
        'archive.archiveFingerprint',
      ) !== fingerprint
    ) {
      throw new TypeError('Custom-content archive fingerprint does not match.');
    }
    validateCustomContentArchiveLedger(archive.ledger);
    return Object.freeze({
      ok: true,
      archive: Object.freeze(archive),
      fingerprint,
      byteLength,
      counts: Object.freeze({
        definitions: archive.ledger.definitions.length,
        revisions: archive.ledger.revisions.length,
        packs: archive.ledger.packs.length,
        packVersions: archive.ledger.packVersions.length,
        packEntries: archive.ledger.packVersionEntries.length,
        environments: archive.ledger.environments.length,
        commandReceipts: archive.ledger.commandReceipts.length,
      }),
    });
  } catch (error) {
    return Object.freeze({
      ok: false,
      reason: 'custom_content_archive_invalid',
      message: error instanceof Error
        ? error.message
        : 'Custom-content archive is invalid.',
    });
  }
}

/** @param {unknown} value */
export function customContentArchiveFingerprint(value) {
  const admission = validateCustomContentArchive(value);
  if (admission.ok === false) {
    throw new TypeError(admission.message || admission.reason);
  }
  return admission.fingerprint;
}
