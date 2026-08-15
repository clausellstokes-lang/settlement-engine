/**
 * Deterministic destination projection for a canonical custom-content archive.
 *
 * Source identities remain immutable canonical-JSON provenance inside the
 * archived artifact. The receiving account gets a separate deterministic
 * namespace. Every graph edge and authored `custom:<localUid>` dependency is
 * rewritten through one explicit identity map before server admission.
 */

import {
  makeContentEnvironmentRevision,
} from '../domain/content/contentEnvironment.js';
import {
  contentRevisionHash,
} from '../domain/content/customContentVersioning.js';
import {
  isReviewedDerivedContentCategory,
  remapReviewedSupplyChain,
  reviewedSupplyChainContentHash,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  detachContentJson,
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';
import { PACK_DEP_FIELDS } from './contentPacks.js';
import {
  CUSTOM_CONTENT_ARCHIVE_LIMITS,
  validateCustomContentArchive,
} from './customContentArchive.js';
import {
  buildArchivePackManifest,
} from './customContentArchivePack.js';

/**
 * @typedef {Record<string, unknown>} JsonRecord
 * @typedef {{
 *   sourceId:string,
 *   destinationId:string,
 *   destinationContentHash?:string,
 *   destinationRevisionNumber?:number,
 *   destinationEnvironmentHash?:string,
 * }} IdMapping
 * @typedef {{
 *   definitionIds:IdMapping[],
 *   revisionIds:IdMapping[],
 *   localUids:IdMapping[],
 *   packIds:IdMapping[],
 *   environmentIds:IdMapping[],
 *   environmentRevisionIds:IdMapping[],
 * }} CustomContentArchiveIdentityMap
 * @typedef {{
 *   environmentId:string,
 *   environmentRevisionId:string,
 *   revisionNumber:number,
 *   source:string,
 *   packVersions:Array<{
 *     packId:string, packVersionId:string, manifestHash:string, order:number,
 *   }>,
 *   directDefinitions:Array<{
 *     definitionId:string, revisionId:string, contentHash:string,
 *     category:string,
 *   }>,
 *   tunables:Record<string, number|boolean>,
 *   visualSelection:Record<string, string>,
 *   createdAt:string|null,
 * }} ArchiveEnvironment
 */

const IMPORT_SCHEMA_VERSION = 1;
const ACTIVATION_POLICIES = new Set(['preserve', 'adopt-if-empty']);

/** @param {string} hash */
function uuidFromHash(hash) {
  const characters = hash.slice(0, 32).split('');
  characters[12] = '5';
  characters[16] = (
    (Number.parseInt(characters[16], 16) & 0x3) | 0x8
  ).toString(16);
  const hex = characters.join('');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}

/**
 * @param {string} destinationOwnerId
 * @param {string} sourceKey
 * @param {string} kind
 * @param {unknown} sourceId
 */
function destinationHash(destinationOwnerId, sourceKey, kind, sourceId) {
  return fingerprintContent({
    schemaVersion: IMPORT_SCHEMA_VERSION,
    destinationOwnerId,
    sourceKey,
    kind,
    sourceId: String(sourceId),
  });
}

/**
 * @param {string} destinationOwnerId
 * @param {string} sourceKey
 * @param {string} kind
 * @param {unknown} sourceId
 */
function destinationUuid(destinationOwnerId, sourceKey, kind, sourceId) {
  return uuidFromHash(destinationHash(
    destinationOwnerId,
    sourceKey,
    kind,
    sourceId,
  ));
}

/**
 * @param {string} prefix
 * @param {string} destinationOwnerId
 * @param {string} sourceKey
 * @param {unknown} sourceId
 */
function destinationText(prefix, destinationOwnerId, sourceKey, sourceId) {
  return `${prefix}:${destinationHash(
    destinationOwnerId,
    sourceKey,
    prefix,
    sourceId,
  ).slice(0, 48)}`;
}

/**
 * @param {unknown} value
 * @param {Map<string, string>} localUidMap
 */
function rewriteDependencyValue(value, localUidMap) {
  const rewrite = (entry) => {
    if (typeof entry !== 'string' || !entry.startsWith('custom:')) return entry;
    const mapped = localUidMap.get(entry.slice('custom:'.length));
    return mapped ? `custom:${mapped}` : entry;
  };
  return Array.isArray(value) ? value.map(rewrite) : rewrite(value);
}

/**
 * @param {JsonRecord} source
 * @param {string} destinationLocalUid
 * @param {Map<string, string>} localUidMap
 */
function remapRevisionData(source, destinationLocalUid, localUidMap) {
  const data = /** @type {JsonRecord} */ (detachContentJson(source));
  data.localUid = destinationLocalUid;
  for (const field of PACK_DEP_FIELDS) {
    if (!Object.hasOwn(data, field)) continue;
    data[field] = rewriteDependencyValue(data[field], localUidMap);
  }
  return data;
}

/**
 * @param {Array<IdMapping>} mappings
 */
function mappingLookup(mappings) {
  return new Map(mappings.map(mapping => [
    mapping.sourceId,
    mapping.destinationId,
  ]));
}

/**
 * @param {Map<string, string>} mapping
 * @param {unknown} sourceId
 * @param {string} field
 */
function mappedIdentity(mapping, sourceId, field) {
  const destination = mapping.get(String(sourceId));
  if (!destination) {
    throw new TypeError(`${field} has no deterministic destination identity.`);
  }
  return destination;
}

/**
 * Prepare one complete, content-addressed import command.
 *
 * @param {unknown} archiveValue
 * @param {{
 *   destinationOwnerId:string,
 *   sourceKey?:string,
 *   activationPolicy?:'preserve'|'adopt-if-empty',
 * }} options
 */
export function prepareCustomContentArchiveImport(archiveValue, options) {
  const admission = validateCustomContentArchive(archiveValue);
  if (admission.ok === false) {
    throw new TypeError(admission.message || admission.reason);
  }
  const archive = admission.archive;
  const ledger = archive.ledger;
  const destinationOwnerId = String(options?.destinationOwnerId || '').trim();
  if (!destinationOwnerId || destinationOwnerId.length > 240) {
    throw new TypeError('A destination owner id is required.');
  }
  const archiveSourceKey = String(archive.source.key || '').trim();
  const requestedSourceKey = options?.sourceKey == null
    ? archiveSourceKey
    : String(options.sourceKey).trim();
  if (requestedSourceKey !== archiveSourceKey) {
    throw new TypeError(
      'Archive import sourceKey must match the sealed archive source.',
    );
  }
  const sourceKey = archiveSourceKey;
  if (!sourceKey || sourceKey.length > 240) {
    throw new TypeError('The archive source key is invalid.');
  }
  const activationPolicy = String(
    options?.activationPolicy || 'preserve',
  );
  if (!ACTIVATION_POLICIES.has(activationPolicy)) {
    throw new TypeError('The custom-content activation policy is invalid.');
  }
  const includesReviewedArtifacts = ledger.revisions.some(revision => (
    isReviewedDerivedContentCategory(revision.category)
  ));

  /** @type {CustomContentArchiveIdentityMap} */
  const identityMap = {
    definitionIds: ledger.definitions.map(definition => ({
      sourceId: String(definition.id),
      destinationId: destinationUuid(
        destinationOwnerId,
        sourceKey,
        'definition',
        definition.id,
      ),
    })),
    revisionIds: ledger.revisions.map((revision) => {
      const mapping = {
        sourceId: String(revision.id),
        destinationId: destinationUuid(
          destinationOwnerId,
          sourceKey,
          'revision',
          revision.id,
        ),
      };
      return includesReviewedArtifacts
        ? {
            ...mapping,
            destinationRevisionNumber: revision.revisionNumber,
          }
        : mapping;
    }),
    localUids: ledger.definitions.map(definition => ({
      sourceId: String(definition.localUid),
      destinationId: destinationText(
        'lu_import',
        destinationOwnerId,
        sourceKey,
        definition.localUid,
      ),
    })),
    packIds: ledger.packs.map(pack => ({
      sourceId: String(pack.packId),
      destinationId: destinationText(
        'imported-pack',
        destinationOwnerId,
        sourceKey,
        pack.packId,
      ),
    })),
    environmentIds: [...new Set(ledger.environments.map(
      environment => String(environment.environmentId),
    ))].map(environmentId => ({
      sourceId: environmentId,
      destinationId: destinationText(
        'imported-environment',
        destinationOwnerId,
        sourceKey,
        environmentId,
      ),
    })),
    environmentRevisionIds: ledger.environments.map(environment => ({
      sourceId: String(environment.environmentRevisionId),
      destinationId: destinationText(
        'imported-environment-revision',
        destinationOwnerId,
        sourceKey,
        environment.environmentRevisionId,
      ),
    })),
  };
  const definitionIds = mappingLookup(identityMap.definitionIds);
  const revisionIds = mappingLookup(identityMap.revisionIds);
  const revisionNumbers = new Map(identityMap.revisionIds.map(mapping => [
    mapping.sourceId,
    Number(mapping.destinationRevisionNumber),
  ]));
  const localUids = mappingLookup(identityMap.localUids);
  const packIds = mappingLookup(identityMap.packIds);
  const environmentIds = mappingLookup(identityMap.environmentIds);
  const environmentRevisionIds = mappingLookup(
    identityMap.environmentRevisionIds,
  );

  const definitions = ledger.definitions.map(definition => ({
    id: mappedIdentity(definitionIds, definition.id, 'definition.id'),
    category: definition.category,
    localUid: mappedIdentity(
      localUids,
      definition.localUid,
      'definition.localUid',
    ),
    headRevisionId: mappedIdentity(
      revisionIds,
      definition.headRevisionId,
      'definition.headRevisionId',
    ),
    archivedAt: definition.archivedAt || null,
    createdAt: definition.createdAt || null,
    updatedAt: definition.updatedAt || null,
    legacyContentId: null,
  }));
  const remappedAuthorableRevisionBySourceId = new Map();
  for (const revision of ledger.revisions) {
    if (isReviewedDerivedContentCategory(revision.category)) continue;
    const sourceDefinition = ledger.definitions.find(definition => (
      String(definition.id) === String(revision.definitionId)
    ));
    if (!sourceDefinition) {
      throw new TypeError('Archive revision definition is unavailable.');
    }
    const localUid = mappedIdentity(
      localUids,
      sourceDefinition.localUid,
      'revision.data.localUid',
    );
    const data = remapRevisionData(revision.data, localUid, localUids);
    const contentHash = contentRevisionHash(revision.category, data);
    remappedAuthorableRevisionBySourceId.set(String(revision.id), {
      data,
      contentHash,
    });
  }
  const destinationContentHashes = new Map(
    [...remappedAuthorableRevisionBySourceId].map(([sourceId, revision]) => [
      sourceId,
      revision.contentHash,
    ]),
  );
  const revisions = ledger.revisions.map(revision => {
    const sourceDefinition = ledger.definitions.find(definition => (
      String(definition.id) === String(revision.definitionId)
    ));
    if (!sourceDefinition) {
      throw new TypeError('Archive revision definition is unavailable.');
    }
    const remappedAuthorable = remappedAuthorableRevisionBySourceId.get(
      String(revision.id),
    );
    const data = isReviewedDerivedContentCategory(revision.category)
      ? remapReviewedSupplyChain(revision.data, {
          localUids,
          definitionIds,
          revisionIds,
          revisionNumbers,
          contentHashes: destinationContentHashes,
        })
      : remappedAuthorable?.data;
    if (!data) {
      throw new TypeError('Archive revision could not be remapped.');
    }
    const contentHash = isReviewedDerivedContentCategory(revision.category)
      ? reviewedSupplyChainContentHash(data)
      : remappedAuthorable.contentHash;
    destinationContentHashes.set(String(revision.id), contentHash);
    const identity = identityMap.revisionIds.find(mapping => (
      mapping.sourceId === String(revision.id)
    ));
    if (identity) identity.destinationContentHash = contentHash;
    return {
      schemaVersion: 1,
      id: mappedIdentity(revisionIds, revision.id, 'revision.id'),
      definitionId: mappedIdentity(
        definitionIds,
        revision.definitionId,
        'revision.definitionId',
      ),
      category: revision.category,
      revisionNumber: revision.revisionNumber,
      parentRevisionId: revision.parentRevisionId == null
        ? null
        : mappedIdentity(
            revisionIds,
            revision.parentRevisionId,
            'revision.parentRevisionId',
          ),
      contentHash,
      data,
      createdAt: revision.createdAt || null,
    };
  });
  const destinationRevisionBySourceId = new Map(
    ledger.revisions.map((revision, index) => [
      String(revision.id),
      revisions[index],
    ]),
  );

  const packVersionEntries = ledger.packVersionEntries.map(entry => ({
    packId: mappedIdentity(packIds, entry.packId, 'packEntry.packId'),
    packVersion: entry.packVersion,
    packEntryId: entry.packEntryId,
    definitionId: mappedIdentity(
      definitionIds,
      entry.definitionId,
      'packEntry.definitionId',
    ),
    revisionId: mappedIdentity(
      revisionIds,
      entry.revisionId,
      'packEntry.revisionId',
    ),
    category: entry.category,
    ordinal: entry.ordinal,
  }));
  const packVersions = ledger.packVersions.map(version => {
    const mappedPackId = mappedIdentity(
      packIds,
      version.packId,
      'packVersion.packId',
    );
    const entries = packVersionEntries
      .filter(entry => (
        entry.packId === mappedPackId
        && entry.packVersion === version.packVersion
      ))
      .sort((left, right) => Number(left.ordinal) - Number(right.ordinal));
    const importPlanHash = fingerprintContent({
      schemaVersion: 1,
      packId: mappedPackId,
      packVersion: version.packVersion,
      entries: entries.map(entry => ({
        packEntryId: entry.packEntryId,
        category: entry.category,
        data: revisions.find(revision => revision.id === entry.revisionId)?.data,
      })),
    });
    const destinationRevisionById = new Map(
      revisions.map(revision => [revision.id, revision]),
    );
    const manifest = buildArchivePackManifest({
      packId: mappedPackId,
      packVersion: version.packVersion,
      name: String(version.manifest.name || mappedPackId),
      storedManifestHash: version.manifestHash,
      sourceManifest: version.manifest,
      createdAt: version.createdAt,
      entries,
      revisionById: destinationRevisionById,
    });
    return {
      packId: mappedPackId,
      packVersion: version.packVersion,
      manifestHash: manifest.manifestHash,
      importPlanHash,
      manifest,
      createdAt: version.createdAt || null,
    };
  });
  const destinationPackVersionBySourceKey = new Map(
    ledger.packVersions.map((version, index) => [
      `${version.packId}\u0000${version.packVersion}`,
      packVersions[index],
    ]),
  );

  const revisionsBySourceHash = new Map();
  for (const sourceRevision of ledger.revisions) {
    const destination = destinationRevisionBySourceId.get(
      String(sourceRevision.id),
    );
    revisionsBySourceHash.set(
      `${sourceRevision.definitionId}\u0000${sourceRevision.id}`,
      destination,
    );
  }
  const environments = ledger.environments.map((rawEnvironment) => {
    const environment = /** @type {ArchiveEnvironment} */ (rawEnvironment);
    const directDefinitions = environment.directDefinitions.map(reference => {
      const destination = revisionsBySourceHash.get(
        `${reference.definitionId}\u0000${reference.revisionId}`,
      );
      if (!destination) {
        throw new TypeError(
          'Environment direct revision has no destination mapping.',
        );
      }
      return {
        definitionId: destination.definitionId,
        revisionId: destination.id,
        contentHash: destination.contentHash,
        category: destination.category,
      };
    });
    return makeContentEnvironmentRevision({
      environmentId: mappedIdentity(
        environmentIds,
        environment.environmentId,
        'environment.environmentId',
      ),
      environmentRevisionId: mappedIdentity(
        environmentRevisionIds,
        environment.environmentRevisionId,
        'environment.environmentRevisionId',
      ),
      revisionNumber: environment.revisionNumber,
      source: environment.source,
      packVersions: environment.packVersions.map((binding, index) => ({
        packId: mappedIdentity(
          packIds,
          binding.packId,
          'environment.packVersion.packId',
        ),
        packVersionId: binding.packVersionId,
        manifestHash: destinationPackVersionBySourceKey.get(
          `${binding.packId}\u0000${binding.packVersionId}`,
        )?.manifestHash || binding.manifestHash,
        order: index,
      })),
      directDefinitions,
      tunables: environment.tunables,
      visualSelection: environment.visualSelection,
      createdAt: environment.createdAt || null,
    });
  });
  for (const [index, environment] of environments.entries()) {
    identityMap.environmentRevisionIds[index].destinationEnvironmentHash =
      environment.environmentHash;
  }
  const transfer = {
    schemaVersion: IMPORT_SCHEMA_VERSION,
    definitions,
    revisions,
    packs: ledger.packs.map(pack => ({
      ...pack,
      packId: mappedIdentity(packIds, pack.packId, 'pack.packId'),
      activeManifestHash: pack.activePackVersion == null
        ? null
        : destinationPackVersionBySourceKey.get(
            `${pack.packId}\u0000${pack.activePackVersion}`,
          )?.manifestHash || null,
    })),
    packVersions,
    packEntryDefinitions: ledger.packEntryDefinitions.map(mapping => ({
      ...mapping,
      packId: mappedIdentity(packIds, mapping.packId, 'packMapping.packId'),
      definitionId: mappedIdentity(
        definitionIds,
        mapping.definitionId,
        'packMapping.definitionId',
      ),
    })),
    packVersionEntries,
    environments,
    activeEnvironmentRevisionId:
      ledger.activeEnvironmentRevisionId == null
        ? null
        : mappedIdentity(
            environmentRevisionIds,
            ledger.activeEnvironmentRevisionId,
            'activeEnvironmentRevisionId',
          ),
  };
  const bundle = {
    schemaVersion: IMPORT_SCHEMA_VERSION,
    activationPolicy,
    sourceArchive: archive,
    transfer,
    identityMap,
  };
  const fingerprint = fingerprintContent(bundle, {
    maxNodes: CUSTOM_CONTENT_ARCHIVE_LIMITS.maxNodes,
  });
  const commandId = `content-archive-import:${fingerprint}`;
  return Object.freeze({
    archive,
    transfer: Object.freeze(transfer),
    identityMap: Object.freeze(identityMap),
    bundle: Object.freeze(bundle),
    commandId,
    fingerprint,
  });
}
