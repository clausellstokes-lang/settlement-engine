/**
 * Portable identity reconciliation for account export/import.
 *
 * A content pack deliberately mints fresh definition and revision identities
 * in the receiving account. Campaign bindings are immutable, self-contained
 * snapshots, but copying their old identity fields unchanged would leave two
 * incompatible namespaces in one restored account. This module joins pack
 * source identities to durable import receipts, rewrites local dependency
 * addresses, and rebuilds every binding so all hashes cover the receiving
 * account's identities.
 *
 * Historical revisions that are embedded in a campaign but are no longer the
 * editable account head cannot be recreated as mutable library history through
 * a pack import. They receive deterministic, import-scoped identities and stay
 * embedded in the immutable binding. Their data remains executable and their
 * identifiers no longer pretend to address the source account.
 */

import {
  admitCampaignContentBinding,
  makeCampaignContentBinding,
} from '../domain/content/contentEnvironment.js';
import {
  admitCampaignContentBindingHistory,
} from '../domain/content/campaignContentLifecycle.js';
import {
  authoredDataOf,
  contentRevisionHash,
} from '../domain/content/customContentVersioning.js';
import {
  isReviewedDerivedContentCategory,
  PERSISTED_RUNTIME_CONTENT_CATEGORIES,
  remapReviewedSupplyChain,
  reviewedSupplyChainContentHash,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  fingerprintContent,
  isPlainContentRecord,
} from '../domain/content/contentFingerprint.js';
import {
  PACK_DEP_FIELDS,
} from './contentPacks.js';
import {
  accountContentRevisionKey as revisionKey,
  accountPackSourceIdentities,
  inspectAccountContentReferences,
} from './accountContentReferenceInspection.js';

export {
  accountPackSourceIdentities,
  inspectAccountContentReferences,
};

const IDENTITY_SCHEMA_VERSION = 1;
const IMPORT_SOURCE = 'account-import';

/** @param {unknown} value */
function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value */
function plainRecord(value) {
  return isPlainContentRecord(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * A stable namespace makes retries and repeated imports of the same artifact
 * converge on the same embedded identities. Receipt-backed identities still
 * use the durable IDs returned by the receiving account.
 *
 * @param {unknown} pack
 * @param {unknown} campaigns
 */
export function accountContentImportNamespace(pack, campaigns) {
  const bindingHashes = [];
  for (const campaign of Array.isArray(campaigns) ? campaigns : []) {
    const current = admitCampaignContentBinding(campaign?.contentBinding);
    if (current.ok) bindingHashes.push(current.binding.bindingHash);
    const history = admitCampaignContentBindingHistory(
      campaign?.contentBindingHistory,
    );
    if (history.ok) {
      bindingHashes.push(...history.history.map(binding => binding.bindingHash));
    }
  }
  bindingHashes.sort();
  const packRecord = isPlainContentRecord(pack)
    ? /** @type {Record<string, unknown>} */ (pack)
    : {};
  return `account-content:${fingerprintContent({
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    sourceFingerprint:
      cleanText(packRecord.archiveFingerprint)
      || cleanText(packRecord.manifestHash)
      || null,
    bindingHashes,
  }).slice(0, 32)}`;
}

/**
 * @typedef {{
 *   namespace:string,
 *   definitionIds:Map<string, string>,
 *   revisionIds:Map<string, string>,
 *   localUids:Map<string, string>,
 *   packIds:Map<string, string>,
 *   environmentIds:Map<string, string>,
 *   environmentRevisionIds:Map<string, string>,
 *   revisionContentHashes:Map<string, string>,
 *   revisionNumbers:Map<string, number>,
 *   environmentHashes:Map<string, string>,
 *   archiveBacked:boolean,
 *   importedData:Map<string, {data:Record<string, unknown>,
 *     definitionId:string,revisionId:string}>,
 *   diagnostics:Readonly<Record<string, unknown>>,
 * }} AccountContentIdentityMap
 */

/**
 * Join the reviewed pack plan to the durable command receipt. The pack entry ID
 * is the only safe join key; array order is diagnostic convenience, never
 * identity.
 *
 * @param {{
 *   namespace:string,
 *   pack?:unknown,
 *   prepared?:unknown,
 *   receipt?:unknown,
 * }} input
 * @returns {{ok:true, identityMap:AccountContentIdentityMap}
 *   | {ok:false, error:string, diagnostics:Readonly<Record<string, unknown>>}}
 */
export function buildImportedAccountContentIdentityMap(input) {
  const namespace = cleanText(input?.namespace);
  if (!namespace) {
    return {
      ok: false,
      error: 'The account-content import namespace is missing.',
      diagnostics: Object.freeze({ code: 'content_identity_namespace_missing' }),
    };
  }

  const sourceByPackEntry = new Map(
    accountPackSourceIdentities(input.pack).map(identity => [
      identity.packEntryId,
      identity,
    ]),
  );
  const preparedRecord = isPlainContentRecord(input?.prepared)
    ? /** @type {Record<string, unknown>} */ (input.prepared)
    : {};
  const receiptRecord = isPlainContentRecord(input?.receipt)
    ? /** @type {Record<string, unknown>} */ (input.receipt)
    : {};
  const preparedItems = Array.isArray(preparedRecord.items)
    ? preparedRecord.items
    : [];
  const receiptRows = Array.isArray(receiptRecord.perEntry)
    ? receiptRecord.perEntry
    : [];
  const definitionIds = /** @type {Map<string, string>} */ (new Map());
  const revisionIds = /** @type {Map<string, string>} */ (new Map());
  const localUids = /** @type {Map<string, string>} */ (new Map());
  const importedData = /** @type {Map<string, {
   *   data:Record<string, unknown>,definitionId:string,revisionId:string,
   * }>} */ (new Map());
  const errors = /** @type {Array<Record<string, unknown>>} */ ([]);
  const preparedEntryIds = new Set(
    preparedItems.map(item => cleanText(item?.packEntryId)).filter(Boolean),
  );
  const receiptByPackEntry = new Map();
  for (const row of receiptRows) {
    const packEntryId = cleanText(row?.packEntryId);
    if (!packEntryId) {
      errors.push({ code: 'content_identity_receipt_entry_missing' });
      continue;
    }
    if (receiptByPackEntry.has(packEntryId)) {
      errors.push({
        code: 'content_identity_receipt_entry_duplicate',
        packEntryId,
      });
      continue;
    }
    if (!preparedEntryIds.has(packEntryId)) {
      errors.push({
        code: 'content_identity_receipt_entry_unexpected',
        packEntryId,
      });
      continue;
    }
    receiptByPackEntry.set(packEntryId, row);
  }
  const receivingDefinitions = new Map();

  for (const item of preparedItems) {
    const packEntryId = cleanText(item?.packEntryId);
    const source = sourceByPackEntry.get(packEntryId);
    const receipt = receiptByPackEntry.get(packEntryId);
    const definitionId = cleanText(receipt?.definitionId);
    const revisionId = cleanText(receipt?.revisionId);
    if (!source || !definitionId || !revisionId) {
      errors.push({
        code: 'content_identity_receipt_incomplete',
        packEntryId: packEntryId || null,
      });
      continue;
    }
    const priorDefinitionId = definitionIds.get(source.sourceDefinitionId);
    if (priorDefinitionId && priorDefinitionId !== definitionId) {
      errors.push({
        code: 'content_identity_definition_ambiguous',
        sourceDefinitionId: source.sourceDefinitionId,
      });
      continue;
    }
    definitionIds.set(source.sourceDefinitionId, definitionId);
    const priorSourceDefinition = receivingDefinitions.get(definitionId);
    if (
      priorSourceDefinition
      && priorSourceDefinition !== source.sourceDefinitionId
    ) {
      errors.push({
        code: 'content_identity_receiving_definition_ambiguous',
        definitionId,
      });
      continue;
    }
    receivingDefinitions.set(definitionId, source.sourceDefinitionId);
    const key = revisionKey(
      source.sourceDefinitionId,
      source.sourceRevisionId,
      source.contentHash,
    );
    revisionIds.set(key, revisionId);
    if (source.sourceLocalUid && cleanText(item?.item?.localUid)) {
      localUids.set(source.sourceLocalUid, cleanText(item.item.localUid));
    }
    importedData.set(key, {
      data: /** @type {Record<string, unknown>} */ (authoredDataOf(item.item)),
      definitionId,
      revisionId,
    });
  }

  const diagnostics = Object.freeze({
    preparedEntries: preparedItems.length,
    receiptEntries: receiptRows.length,
    mappedDefinitions: definitionIds.size,
    mappedRevisions: revisionIds.size,
    errors: Object.freeze(errors.map(error => Object.freeze(error))),
  });
  if (errors.length > 0) {
    return {
      ok: false,
      error: 'The custom-content receipt could not be joined to every imported entry.',
      diagnostics,
    };
  }
  return {
    ok: true,
    identityMap: {
      namespace,
      definitionIds,
      revisionIds,
      localUids,
      packIds: new Map(),
      environmentIds: new Map(),
      environmentRevisionIds: new Map(),
      revisionContentHashes: new Map(),
      revisionNumbers: new Map(),
      environmentHashes: new Map(),
      archiveBacked: false,
      importedData,
      diagnostics,
    },
  };
}

/**
 * Convert the archive importer's plain, serializable identity receipt into the
 * Map-backed lookup used while rebuilding portable campaign bindings.
 *
 * Archive imports already remap every revision payload transactionally, so the
 * campaign projection can rebuild from its own embedded data and the same
 * definition/revision/localUid maps. No mutable destination head is consulted.
 *
 * @param {{namespace:string, identityMap?:unknown}} input
 * @returns {{ok:true, identityMap:AccountContentIdentityMap}
 *   | {ok:false, error:string, diagnostics:Readonly<Record<string, unknown>>}}
 */
export function buildImportedAccountArchiveIdentityMap(input) {
  const namespace = cleanText(input?.namespace);
  const record = plainRecord(input?.identityMap);
  if (!namespace) {
    return {
      ok: false,
      error: 'The account-content import namespace is missing.',
      diagnostics: Object.freeze({ code: 'content_identity_namespace_missing' }),
    };
  }

  /**
   * @param {unknown} value
   * @param {string} field
   */
  const stringMap = (value, field) => {
    const mapped = new Map();
    const pairs = Array.isArray(value)
      ? value.map((rawMapping) => {
          const mapping = plainRecord(rawMapping);
          return [mapping.sourceId, mapping.destinationId];
        })
      : Object.entries(plainRecord(value));
    for (const [rawFrom, rawTo] of pairs) {
      const from = cleanText(rawFrom);
      const to = cleanText(rawTo);
      if (!from || !to || mapped.has(from)) {
        throw new TypeError(`${field} contains an invalid identity pair.`);
      }
      mapped.set(from, to);
    }
    return mapped;
  };

  try {
    const definitionIds = stringMap(record.definitionIds, 'definitionIds');
    const revisionIds = stringMap(record.revisionIds, 'revisionIds');
    const localUids = stringMap(record.localUids, 'localUids');
    const packIds = stringMap(record.packIds, 'packIds');
    const environmentIds = stringMap(
      record.environmentIds,
      'environmentIds',
    );
    const environmentRevisionIds = stringMap(
      record.environmentRevisionIds,
      'environmentRevisionIds',
    );
    const revisionContentHashes = new Map();
    const revisionNumbers = new Map();
    for (const rawMapping of Array.isArray(record.revisionIds)
      ? record.revisionIds
      : []) {
      const mapping = plainRecord(rawMapping);
      const sourceId = cleanText(mapping.sourceId);
      const destinationContentHash = cleanText(
        mapping.destinationContentHash,
      );
      if (sourceId && destinationContentHash) {
        revisionContentHashes.set(sourceId, destinationContentHash);
      }
      const destinationRevisionNumber = Number(
        mapping.destinationRevisionNumber,
      );
      if (
        sourceId
        && Number.isInteger(destinationRevisionNumber)
        && destinationRevisionNumber > 0
      ) {
        revisionNumbers.set(sourceId, destinationRevisionNumber);
      }
    }
    const environmentHashes = new Map();
    for (const rawMapping of Array.isArray(record.environmentRevisionIds)
      ? record.environmentRevisionIds
      : []) {
      const mapping = plainRecord(rawMapping);
      const sourceId = cleanText(mapping.sourceId);
      const destinationEnvironmentHash = cleanText(
        mapping.destinationEnvironmentHash,
      );
      if (sourceId && destinationEnvironmentHash) {
        environmentHashes.set(sourceId, destinationEnvironmentHash);
      }
    }
    const diagnostics = Object.freeze({
      mappedDefinitions: definitionIds.size,
      mappedRevisions: revisionIds.size,
      mappedLocalUids: localUids.size,
      mappedPacks: packIds.size,
      mappedEnvironments: environmentRevisionIds.size,
      mappedRevisionHashes: revisionContentHashes.size,
      mappedRevisionNumbers: revisionNumbers.size,
      mappedEnvironmentHashes: environmentHashes.size,
      source: 'custom-content-archive',
    });
    return {
      ok: true,
      identityMap: {
        namespace,
        definitionIds,
        revisionIds,
        localUids,
        packIds,
        environmentIds,
        environmentRevisionIds,
        revisionContentHashes,
        revisionNumbers,
        environmentHashes,
        archiveBacked: true,
        importedData: new Map(),
        diagnostics,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error
        ? error.message
        : 'The custom-content archive identity receipt is invalid.',
      diagnostics: Object.freeze({
        code: 'content_archive_identity_receipt_invalid',
      }),
    };
  }
}

/** @param {string} namespace @param {string} sourceDefinitionId */
function embeddedDefinitionId(namespace, sourceDefinitionId) {
  return `imported-definition:${fingerprintContent({
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    namespace,
    sourceDefinitionId,
  }).slice(0, 40)}`;
}

/**
 * @param {string} namespace
 * @param {string} sourceDefinitionId
 * @param {string} sourceRevisionId
 * @param {string} contentHash
 */
function embeddedRevisionId(
  namespace,
  sourceDefinitionId,
  sourceRevisionId,
  contentHash,
) {
  return `imported-revision:${fingerprintContent({
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    namespace,
    sourceDefinitionId,
    sourceRevisionId,
    contentHash,
  }).slice(0, 40)}`;
}

/** @param {string} namespace @param {string} sourceDefinitionId */
function embeddedLocalUid(namespace, sourceDefinitionId) {
  return `lu_account_${fingerprintContent({
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    namespace,
    sourceDefinitionId,
  }).slice(0, 24)}`;
}

/**
 * @param {string} namespace
 * @param {string} sourceEnvironmentId
 * @param {string} sourceEnvironmentHash
 */
function embeddedEnvironmentId(
  namespace,
  sourceEnvironmentId,
  sourceEnvironmentHash,
) {
  return `imported-environment:${fingerprintContent({
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    namespace,
    sourceEnvironmentId,
    sourceEnvironmentHash,
  }).slice(0, 40)}`;
}

/**
 * @param {string} namespace
 * @param {string} sourceEnvironmentRevisionId
 * @param {string} sourceEnvironmentHash
 */
function embeddedEnvironmentRevisionId(
  namespace,
  sourceEnvironmentRevisionId,
  sourceEnvironmentHash,
) {
  return `imported-environment-revision:${fingerprintContent({
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    namespace,
    sourceEnvironmentRevisionId,
    sourceEnvironmentHash,
  }).slice(0, 40)}`;
}

/**
 * Pack release versions and manifest hashes are portable immutable facts. Only
 * the account-local pack id changes.
 *
 * @param {Record<string, any>} sourceEnvironment
 * @param {AccountContentIdentityMap} identityMap
 */
function remapBindingPackVersions(sourceEnvironment, identityMap) {
  if (!identityMap.archiveBacked) return [];
  return (sourceEnvironment.packVersions || []).map((binding, index) => {
    const packId = identityMap.packIds.get(String(binding.packId));
    if (!packId) {
      throw Object.assign(
        new Error(
          `The archive receipt did not map content pack "${binding.packId}".`,
        ),
        { code: 'campaign_content_pack_identity_incomplete' },
      );
    }
    return {
      packId,
      packVersionId: binding.packVersionId,
      manifestHash: binding.manifestHash,
      order: Number.isInteger(binding.order) ? binding.order : index,
    };
  });
}

/**
 * @param {unknown} value
 * @param {Map<string, string>} localUidMap
 */
function remapDependencyValue(value, localUidMap) {
  const remap = (candidate) => {
    if (typeof candidate !== 'string' || !candidate.startsWith('custom:')) {
      return candidate;
    }
    const sourceLocalUid = candidate.slice('custom:'.length);
    const importedLocalUid = localUidMap.get(sourceLocalUid);
    return importedLocalUid ? `custom:${importedLocalUid}` : candidate;
  };
  return Array.isArray(value) ? value.map(remap) : remap(value);
}

/**
 * Rebuild one binding in the receiving identity namespace.
 *
 * @param {unknown} rawBinding
 * @param {AccountContentIdentityMap} identityMap
 */
export function remapAccountCampaignContentBinding(rawBinding, identityMap) {
  const admitted = admitCampaignContentBinding(rawBinding);
  if (!admitted.ok) {
    return {
      ok: false,
      error: admitted.message || admitted.reason,
      code: 'campaign_content_binding_invalid',
    };
  }
  const sourceBinding = admitted.binding;
  const localUidMap = new Map(identityMap.localUids);
  if (!identityMap.archiveBacked) {
    for (const definition of sourceBinding.resolvedDefinitions) {
      const sourceLocalUid = cleanText(definition.data.localUid);
      if (sourceLocalUid && !localUidMap.has(sourceLocalUid)) {
        localUidMap.set(
          sourceLocalUid,
          embeddedLocalUid(identityMap.namespace, definition.definitionId),
        );
      }
    }
  }

  const grouped = Object.fromEntries(
    PERSISTED_RUNTIME_CONTENT_CATEGORIES.map(category => [category, []]),
  );
  let receiptBackedRevisions = 0;
  let embeddedRevisions = 0;
  for (const source of sourceBinding.resolvedDefinitions) {
    const key = revisionKey(
      source.definitionId,
      source.revisionId,
      source.contentHash,
    );
    const receiptBacked = identityMap.importedData.get(key) || null;
    const receiptDefinitionId = identityMap.definitionIds.get(
      source.definitionId,
    );
    const receiptRevisionId = identityMap.revisionIds.get(key)
      || identityMap.revisionIds.get(source.revisionId);
    if (
      identityMap.archiveBacked
      && (!receiptDefinitionId || !receiptRevisionId)
    ) {
      return {
        ok: false,
        error:
          'The archive receipt did not map every campaign content revision.',
        code: 'campaign_content_revision_identity_incomplete',
      };
    }
    const definitionId = receiptDefinitionId
      || embeddedDefinitionId(identityMap.namespace, source.definitionId);
    const revisionId = receiptRevisionId
      || embeddedRevisionId(
        identityMap.namespace,
        source.definitionId,
        source.revisionId,
        source.contentHash,
      );
    if (
      isReviewedDerivedContentCategory(source.category)
      && !identityMap.archiveBacked
    ) {
      return {
        ok: false,
        error:
          'Reviewed supply chains require a full archive identity receipt.',
        code: 'reviewed_supply_chain_archive_identity_required',
      };
    }
    /** @type {Record<string, any>} */
    let data = receiptBacked
      ? { ...receiptBacked.data }
      : isReviewedDerivedContentCategory(source.category)
        ? /** @type {Record<string, any>} */ (remapReviewedSupplyChain(
            source.data,
            {
              localUids: localUidMap,
              definitionIds: identityMap.definitionIds,
              revisionIds: identityMap.revisionIds,
              revisionNumbers: identityMap.revisionNumbers,
              contentHashes: identityMap.revisionContentHashes,
            },
          ))
        : { ...authoredDataOf(source.data) };
    if (!isReviewedDerivedContentCategory(source.category)) {
      const sourceLocalUid = cleanText(source.data.localUid);
      if (sourceLocalUid) {
        const mappedLocalUid = localUidMap.get(sourceLocalUid);
        if (identityMap.archiveBacked && !mappedLocalUid) {
          return {
            ok: false,
            error:
              'The archive receipt did not map every campaign local identity.',
            code: 'campaign_content_local_identity_incomplete',
          };
        }
        data.localUid = mappedLocalUid;
      }
      for (const field of PACK_DEP_FIELDS) {
        if (!Object.hasOwn(data, field)) continue;
        data[field] = remapDependencyValue(data[field], localUidMap);
      }
    }
    let destinationContentHash = null;
    if (identityMap.archiveBacked) {
      destinationContentHash = identityMap.revisionContentHashes.get(
        source.revisionId,
      );
      const rebuiltContentHash = isReviewedDerivedContentCategory(
        source.category,
      )
        ? reviewedSupplyChainContentHash(data)
        : contentRevisionHash(source.category, data);
      if (
        !destinationContentHash
        || rebuiltContentHash !== destinationContentHash
      ) {
        return {
          ok: false,
          error:
            'The archive receipt content hash does not match the rebuilt campaign revision.',
          code: 'campaign_content_revision_hash_mismatch',
        };
      }
    }
    const destinationRevisionNumber = isReviewedDerivedContentCategory(
      source.category,
    )
      ? identityMap.revisionNumbers.get(source.revisionId)
      : null;
    if (
      isReviewedDerivedContentCategory(source.category)
      && (
        !Number.isInteger(destinationRevisionNumber)
        || Number(destinationRevisionNumber) < 1
      )
    ) {
      return {
        ok: false,
        error:
          'The archive receipt did not preserve reviewed-chain revision order.',
        code: 'reviewed_supply_chain_revision_number_incomplete',
      };
    }
    grouped[source.category].push({
      ...data,
      definitionId,
      revisionId,
      ...(isReviewedDerivedContentCategory(source.category)
        ? {
            revisionNumber: destinationRevisionNumber,
            contentHash: destinationContentHash,
          }
        : {}),
    });
    if (receiptBacked) receiptBackedRevisions += 1;
    else embeddedRevisions += 1;
  }

  try {
    const sourceEnvironment = sourceBinding.environment;
    const packVersions = remapBindingPackVersions(
      sourceEnvironment,
      identityMap,
    );
    const mappedEnvironmentId = identityMap.archiveBacked
      ? identityMap.environmentIds.get(sourceEnvironment.environmentId)
      : null;
    const mappedEnvironmentRevisionId = identityMap.archiveBacked
      ? identityMap.environmentRevisionIds.get(
          sourceEnvironment.environmentRevisionId,
        )
      : null;
    const mappedEnvironmentHash = identityMap.archiveBacked
      ? identityMap.environmentHashes.get(
          sourceEnvironment.environmentRevisionId,
        )
      : null;
    const mappedEnvironmentOptions = {
      source: sourceEnvironment.source,
      environmentId: mappedEnvironmentId,
      environmentRevisionId: mappedEnvironmentRevisionId,
      revisionNumber: sourceEnvironment.revisionNumber,
      packVersions,
      tunables: sourceBinding.environment.tunables,
      visualSelection: sourceBinding.environment.visualSelection,
    };
    let binding = null;
    let environmentIdentity = 'embedded';
    const mappedEnvironmentParts = [
      mappedEnvironmentId,
      mappedEnvironmentRevisionId,
      mappedEnvironmentHash,
    ].filter(Boolean).length;
    if (mappedEnvironmentParts > 0 && mappedEnvironmentParts < 3) {
      return {
        ok: false,
        error:
          'The archive receipt contains a partial campaign environment identity.',
        code: 'campaign_content_environment_identity_incomplete',
      };
    }
    if (
      mappedEnvironmentId
      && mappedEnvironmentRevisionId
      && mappedEnvironmentHash
    ) {
      const mappedCandidate = makeCampaignContentBinding(
        grouped,
        mappedEnvironmentOptions,
      );
      if (
        mappedCandidate.environment.environmentHash === mappedEnvironmentHash
      ) {
        binding = mappedCandidate;
        environmentIdentity = 'archive-receipt';
      } else {
        return {
          ok: false,
          error:
            'The archive receipt environment hash does not match the rebuilt campaign environment.',
          code: 'campaign_content_environment_hash_mismatch',
        };
      }
    }
    if (!binding) {
      // Campaign-only cutoffs are not necessarily standalone environment rows
      // in the owner ledger. Give those immutable snapshots a deterministic
      // imported identity; never copy a source account's foreign key.
      binding = makeCampaignContentBinding(grouped, {
        source: IMPORT_SOURCE,
        environmentId: embeddedEnvironmentId(
          identityMap.namespace,
          sourceEnvironment.environmentId,
          sourceEnvironment.environmentHash,
        ),
        environmentRevisionId: embeddedEnvironmentRevisionId(
          identityMap.namespace,
          sourceEnvironment.environmentRevisionId,
          sourceEnvironment.environmentHash,
        ),
        revisionNumber: sourceEnvironment.revisionNumber,
        packVersions,
        tunables: sourceEnvironment.tunables,
        visualSelection: sourceEnvironment.visualSelection,
      });
    }
    const verified = admitCampaignContentBinding(binding);
    if (!verified.ok) {
      return {
        ok: false,
        error: verified.message || verified.reason,
        code: 'campaign_content_binding_remap_invalid',
      };
    }
    return {
      ok: true,
      binding: verified.binding,
      diagnostics: Object.freeze({
        receiptBackedRevisions,
        embeddedRevisions,
        packVersions: packVersions.length,
        environmentIdentity,
      }),
    };
  } catch (error) {
    const errorCode = error && typeof error === 'object'
      ? cleanText(/** @type {Record<string, unknown>} */ (error).code)
      : '';
    return {
      ok: false,
      error: error instanceof Error
        ? error.message
        : 'The campaign content binding could not be remapped.',
      code: errorCode || 'campaign_content_binding_remap_failed',
    };
  }
}

/**
 * Rebuild and re-admit a bounded history. Hash-equivalent snapshots can converge
 * after source-account identities are removed; retain the first and report the
 * deterministic deduplication rather than constructing an invalid history.
 *
 * @param {unknown} rawHistory
 * @param {AccountContentIdentityMap} identityMap
 */
export function remapAccountCampaignContentBindingHistory(
  rawHistory,
  identityMap,
) {
  const admitted = admitCampaignContentBindingHistory(rawHistory);
  if (!admitted.ok) {
    return {
      ok: false,
      error: admitted.message || admitted.reason,
      code: 'campaign_content_binding_history_invalid',
    };
  }
  const history = [];
  const seen = new Set();
  let deduplicated = 0;
  for (const binding of admitted.history) {
    const remapped = remapAccountCampaignContentBinding(binding, identityMap);
    if (!remapped.ok) return remapped;
    if (seen.has(remapped.binding.bindingHash)) {
      deduplicated += 1;
      continue;
    }
    seen.add(remapped.binding.bindingHash);
    history.push(remapped.binding);
  }
  const verified = admitCampaignContentBindingHistory(history);
  if (!verified.ok) {
    return {
      ok: false,
      error: verified.message || verified.reason,
      code: 'campaign_content_binding_history_remap_invalid',
    };
  }
  return {
    ok: true,
    history: verified.history,
    diagnostics: Object.freeze({ deduplicated }),
  };
}
