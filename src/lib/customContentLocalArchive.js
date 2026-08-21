/**
 * Pure application of a prepared archive transfer to the local ledger shape.
 *
 * Source receipts remain nested audit provenance. The one new receipt written
 * to the destination ledger describes only the destination import transaction.
 */

import {
  canonicalContentJson,
  detachContentJson,
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';
import {
  REVIEWED_SUPPLY_CHAIN_CATEGORY,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  localPackEntryKey,
} from './customContentLocalPackKeys.js';

function assertCompatible(existing, incoming, label) {
  if (
    existing != null
    && canonicalContentJson(existing) !== canonicalContentJson(incoming)
  ) {
    throw Object.assign(
      new Error(`${label} collides with different destination content.`),
      { code: 'custom_content_archive_identity_conflict' },
    );
  }
}

function archiveIdentityConflict(message) {
  return Object.assign(new Error(message), {
    code: 'custom_content_archive_identity_conflict',
  });
}

/** @param {Record<string, any>} definition */
function nextReviewedLifecycleVersion(definition) {
  const current = Number(definition.reviewedLifecycleVersion);
  if (
    !Number.isInteger(current)
    || current < 1
    || current >= 2_147_483_647
  ) {
    throw Object.assign(
      new Error('The reviewed supply-chain lifecycle is exhausted.'),
      { code: 'reviewed_supply_chain_lifecycle_exhausted' },
    );
  }
  return current + 1;
}

/**
 * Authorable definitions have no reviewed lifecycle generation. Keeping that
 * distinction here prevents an ordinary same-source archive fast-forward from
 * entering the reviewed-only overflow guard before importedDefinition can
 * discard the irrelevant value.
 *
 * @param {Record<string, any>} definition
 */
function nextImportedLifecycleVersion(definition) {
  return definition.category === REVIEWED_SUPPLY_CHAIN_CATEGORY
    ? nextReviewedLifecycleVersion(definition)
    : null;
}

/** @param {Record<string, any>} ledger */
function destinationIsPristine(ledger) {
  return (
    Object.keys(ledger.definitions || {}).length === 0
    && Object.keys(ledger.revisions || {}).length === 0
    && Object.keys(ledger.packs || {}).length === 0
    && Object.keys(ledger.environments || {}).length === 0
    && ledger.activeEnvironmentRevisionId == null
  );
}

/**
 * Rebuild the compatibility pointer map from the activation facts that remain
 * after policy resolution. Imported pack closures must never become active
 * merely because their source archive happened to mark them active.
 *
 * @param {Record<string, any>} ledger
 */
function rebuildActivePackEntryRevisions(ledger) {
  const revisions = {};
  for (const [packId, activation] of Object.entries(
    ledger.activePacks || {},
  )) {
    const closure = ledger.packVersionEntries?.[
      `${packId}@${activation?.packVersion}`
    ];
    if (!Array.isArray(closure) || closure.length === 0) {
      throw archiveIdentityConflict(
        `Active pack "${packId}" has no immutable version closure.`,
      );
    }
    for (const entry of closure) {
      revisions[localPackEntryKey(packId, entry.packEntryId)] =
        entry.revisionId;
    }
  }
  ledger.packEntryRevisions = revisions;
}

/**
 * Export timestamps can change an archive's outer fingerprint without changing
 * its meaning. Nested provenance is part of that meaning even though it is not
 * part of the portable ledger hash, so it participates in the dedupe key.
 *
 * @param {Record<string, any>} archive
 */
function archiveProvenanceKey(archive) {
  return fingerprintContent({
    schemaVersion: 1,
    sourceKey: archive.source.key,
    sourceLedgerFingerprint: archive.source.ledgerFingerprint,
    commandReceipts: archive.ledger.commandReceipts,
    auditProvenance: archive.auditProvenance,
  });
}

/**
 * @param {Record<string, any>} provenance
 * @param {Record<string, any>} archive
 */
function archiveProvenanceMatches(provenance, archive) {
  return provenance?.source?.key === archive.source.key
    && provenance?.source?.ledgerFingerprint
      === archive.source.ledgerFingerprint
    && canonicalContentJson(provenance?.commandReceipts || [])
      === canonicalContentJson(archive.ledger.commandReceipts)
    && canonicalContentJson(provenance?.auditProvenance || [])
      === canonicalContentJson(archive.auditProvenance);
}

/**
 * Reuse a prior destination receipt when only transport metadata changed.
 * Identity remap depends on owner/source key/source identities, so an exact
 * semantic source replay has the same receiving graph and identity map.
 *
 * @param {Record<string, any>} ledger
 * @param {ReturnType<import(
 *   './customContentArchiveImport.js'
 * ).prepareCustomContentArchiveImport>} prepared
 */
export function findLocalArchiveSemanticReplay(ledger, prepared) {
  const provenance = Object.values(ledger.archiveImports || {}).find(
    record => archiveProvenanceMatches(record, prepared.archive),
  );
  if (!provenance) return null;
  const prior = Object.values(ledger.commandReceipts || {}).find((record) => {
    const result = record?.receipt?.result;
    return record?.receipt?.ok === true
      && result?.archiveFingerprint === provenance.archiveFingerprint
      && result?.sourceKey === prepared.archive.source.key
      && result?.sourceLedgerFingerprint
        === prepared.archive.source.ledgerFingerprint;
  });
  if (!prior?.receipt) return null;
  const priorReceipt = /** @type {Record<string, any>} */ (
    detachContentJson(prior.receipt)
  );
  return {
    ...priorReceipt,
    // This invocation reviewed a new transport envelope even though its
    // constitutional graph was already imported. Bind the replay response to
    // the current command; the nested result retains the originally stored
    // archive fingerprint as semantic-replay provenance.
    commandId: prepared.commandId,
    fingerprint: prepared.fingerprint,
    replayed: true,
    semanticReplay: true,
  };
}

/**
 * @param {Record<string, any>} ledger
 * @param {string} revisionId
 */
function wasProducedByArchiveImport(ledger, revisionId) {
  for (const record of Object.values(ledger.commandReceipts || {})) {
    const mappings =
      record?.receipt?.result?.identityMap?.revisionIds;
    if (
      Array.isArray(mappings)
      && mappings.some(mapping => mapping?.destinationId === revisionId)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * @param {Record<string, any>} revisions
 * @param {string} ancestorId
 * @param {string} descendantId
 */
function revisionIsAncestor(revisions, ancestorId, descendantId) {
  let cursor = revisions[descendantId] || null;
  const visited = new Set();
  while (cursor && !visited.has(String(cursor.id))) {
    if (String(cursor.id) === ancestorId) return true;
    visited.add(String(cursor.id));
    cursor = cursor.parentRevisionId
      ? revisions[String(cursor.parentRevisionId)] || null
      : null;
  }
  return false;
}

/** @param {Record<string, any>} definition */
function definitionLifecycle(definition) {
  return {
    headRevisionId: definition.headRevisionId,
    archivedAt: definition.archivedAt || null,
    updatedAt: definition.updatedAt || null,
  };
}

/**
 * Archive definitions intentionally exclude the destination's reviewed
 * lifecycle generation. It is operational CAS state, not portable authored
 * meaning, so comparisons must ignore it while destination writes preserve or
 * advance it.
 *
 * @param {Record<string, any>} definition
 */
function portableDefinition(definition) {
  const { reviewedLifecycleVersion: _operational, ...portable } = definition;
  return portable;
}

/**
 * Store a portable definition with destination-owned reviewed lifecycle state.
 *
 * @param {Record<string, any>} incoming
 * @param {number|null} lifecycleVersion
 */
function importedDefinition(incoming, lifecycleVersion) {
  return incoming.category === REVIEWED_SUPPLY_CHAIN_CATEGORY
    ? { ...incoming, reviewedLifecycleVersion: lifecycleVersion }
    : incoming;
}

/**
 * Find the imported lifecycle snapshot that established the destination's
 * current head. A missing snapshot is intentionally not guessed: receipts
 * written before this proof existed cannot authorize a later lifecycle write.
 *
 * @param {Record<string, any>} ledger
 * @param {Record<string, any>} definition
 */
function priorImportedDefinitionLifecycle(ledger, definition) {
  const records = [...Object.values(ledger.commandReceipts || {})].reverse();
  for (const record of records) {
    const lifecycle =
      record?.receipt?.result?.definitionLifecycles?.[definition.id];
    if (
      lifecycle
      && canonicalContentJson(lifecycle)
        === canonicalContentJson(definitionLifecycle(definition))
    ) {
      return lifecycle;
    }
  }
  return null;
}

/**
 * Advance one mapped definition only along its immutable source chain. Older
 * snapshots never rewind a destination, while an unrecognized local branch is
 * a definitive divergence rather than an accidental overwrite.
 *
 * @param {Record<string, any>} ledger
 * @param {Record<string, any>} incoming
 */
function mergeDefinition(ledger, incoming) {
  const existing = ledger.definitions[incoming.id] || null;
  if (!existing) {
    ledger.definitions[incoming.id] = importedDefinition(incoming, 1);
    return 'created';
  }
  const immutableIdentity = value => ({
    id: value.id,
    category: value.category,
    localUid: value.localUid,
    createdAt: value.createdAt,
    legacyContentId: value.legacyContentId,
  });
  if (
    canonicalContentJson(immutableIdentity(existing))
    !== canonicalContentJson(immutableIdentity(incoming))
  ) {
    throw archiveIdentityConflict(
      `Definition "${incoming.id}" has divergent immutable identity.`,
    );
  }
  const priorLifecycle = priorImportedDefinitionLifecycle(ledger, existing);
  const lifecycleStillImported = priorLifecycle != null
    && canonicalContentJson(definitionLifecycle(existing))
      === canonicalContentJson(priorLifecycle);
  if (existing.headRevisionId === incoming.headRevisionId) {
    if (
      canonicalContentJson(portableDefinition(existing))
      === canonicalContentJson(portableDefinition(incoming))
    ) {
      return 'unchanged';
    }
    if (!lifecycleStillImported) {
      throw archiveIdentityConflict(
        `Definition "${incoming.id}" has a locally changed lifecycle.`,
      );
    }
    if (String(incoming.updatedAt || '') > String(existing.updatedAt || '')) {
      ledger.definitions[incoming.id] = importedDefinition(
        incoming,
        nextImportedLifecycleVersion(existing),
      );
      return 'fast-forwarded';
    }
    if (String(incoming.updatedAt || '') < String(existing.updatedAt || '')) {
      return 'stale-preserved';
    }
    throw archiveIdentityConflict(
      `Definition "${incoming.id}" has divergent lifecycle state.`,
    );
  }
  if (
    revisionIsAncestor(
      ledger.revisions,
      String(existing.headRevisionId),
      String(incoming.headRevisionId),
    )
  ) {
    if (!lifecycleStillImported) {
      throw archiveIdentityConflict(
        `Definition "${incoming.id}" has a locally changed lifecycle.`,
      );
    }
    ledger.definitions[incoming.id] = importedDefinition(
      incoming,
      nextImportedLifecycleVersion(existing),
    );
    return 'fast-forwarded';
  }
  if (
    revisionIsAncestor(
      ledger.revisions,
      String(incoming.headRevisionId),
      String(existing.headRevisionId),
    )
    && wasProducedByArchiveImport(ledger, String(existing.headRevisionId))
  ) {
    return 'stale-preserved';
  }
  throw archiveIdentityConflict(
    `Definition "${incoming.id}" diverged from its imported revision chain.`,
  );
}

/**
 * @param {Record<string, unknown>} ledger
 * @param {ReturnType<import(
 *   './customContentArchiveImport.js'
 * ).prepareCustomContentArchiveImport>} prepared
 * @param {string} importedAt
 */
export function applyArchiveTransferToLocalLedger(
  ledger,
  prepared,
  importedAt,
) {
  const next = /** @type {Record<string, any>} */ (
    detachContentJson(ledger, { maxNodes: 500_000 })
  );
  const transfer = prepared.transfer;
  const activationPolicy = prepared.bundle.activationPolicy;
  const pristineDestination = destinationIsPristine(next);
  const activationAdopted =
    activationPolicy === 'adopt-if-empty' && pristineDestination;

  for (const revision of transfer.revisions) {
    assertCompatible(
      next.revisions[revision.id],
      revision,
      `Revision "${revision.id}"`,
    );
    next.revisions[revision.id] = revision;
  }
  const definitionOutcomes = {};
  for (const definition of transfer.definitions) {
    definitionOutcomes[definition.id] = mergeDefinition(next, definition);
  }
  for (const version of transfer.packVersions) {
    const key = `${version.packId}@${version.packVersion}`;
    const stored = {
      packId: version.packId,
      packVersion: version.packVersion,
      name: version.manifest.name,
      manifestHash: version.manifestHash,
      importPlanHash: version.importPlanHash,
      manifest: version.manifest,
      createdAt: version.createdAt,
    };
    assertCompatible(next.packs[key], stored, `Pack version "${key}"`);
    next.packs[key] = stored;
  }
  for (const mapping of transfer.packEntryDefinitions) {
    const key = localPackEntryKey(mapping.packId, mapping.packEntryId);
    assertCompatible(
      next.packEntryDefinitions[key],
      mapping.definitionId,
      `Pack entry "${key}"`,
    );
    next.packEntryDefinitions[key] = mapping.definitionId;
  }
  for (const entry of transfer.packVersionEntries) {
    const key = `${entry.packId}@${entry.packVersion}`;
    if (!Array.isArray(next.packVersionEntries[key])) {
      next.packVersionEntries[key] = [];
    }
    const existing = next.packVersionEntries[key].find(candidate => (
      candidate.packEntryId === entry.packEntryId
    ));
    const localEntry = {
      packEntryId: entry.packEntryId,
      definitionId: entry.definitionId,
      revisionId: entry.revisionId,
      category: entry.category,
      ordinal: entry.ordinal,
    };
    assertCompatible(existing, localEntry, `Pack closure entry "${key}"`);
    if (!existing) next.packVersionEntries[key].push(localEntry);
    next.packVersionEntries[key].sort(
      (left, right) => Number(left.ordinal) - Number(right.ordinal),
    );
  }
  for (const pack of transfer.packs) {
    if (pack.activePackVersion == null) continue;
    if (activationAdopted) {
      next.activePacks[pack.packId] = {
        packVersion: pack.activePackVersion,
        manifestHash: pack.activeManifestHash,
      };
    }
  }
  for (const environment of transfer.environments) {
    const id = environment.environmentRevisionId;
    assertCompatible(
      next.environments[id],
      environment,
      `Environment revision "${id}"`,
    );
    next.environments[id] = environment;
  }
  if (activationAdopted) {
    next.activeEnvironmentRevisionId =
      transfer.activeEnvironmentRevisionId || null;
  }
  rebuildActivePackEntryRevisions(next);

  if (!next.archiveImports || typeof next.archiveImports !== 'object') {
    next.archiveImports = {};
  }
  const provenanceKey = archiveProvenanceKey(prepared.archive);
  for (const [key, provenance] of Object.entries(next.archiveImports)) {
    if (archiveProvenanceMatches(provenance, prepared.archive)) {
      delete next.archiveImports[key];
    }
  }
  next.archiveImports[provenanceKey] = {
    archiveFingerprint: prepared.archive.archiveFingerprint,
    source: prepared.archive.source,
    commandReceipts: prepared.archive.ledger.commandReceipts,
    auditProvenance: prepared.archive.auditProvenance,
  };
  const receipt = {
    ok: true,
    status: 'applied',
    commandId: prepared.commandId,
    reason: null,
    replayed: false,
    fingerprint: prepared.fingerprint,
    persistence: {
      state: 'confirmed',
      authority: 'local-immutable-ledger',
    },
    result: {
      archiveFingerprint: prepared.archive.archiveFingerprint,
      sourceKey: prepared.archive.source.key,
      sourceLedgerFingerprint:
        prepared.archive.source.ledgerFingerprint,
      activationPolicy,
      activationAdopted,
      definitionOutcomes,
      definitionLifecycles: Object.fromEntries(
        transfer.definitions.map(definition => [
          definition.id,
          definitionLifecycle(next.definitions[definition.id]),
        ]),
      ),
      counts: {
        definitions: transfer.definitions.length,
        revisions: transfer.revisions.length,
        packs: transfer.packs.length,
        packVersions: transfer.packVersions.length,
        packEntries: transfer.packVersionEntries.length,
        environments: transfer.environments.length,
      },
      identityMap: prepared.identityMap,
      importedAt,
    },
    perEntry: [],
  };
  next.commandReceipts[prepared.commandId] = {
    fingerprint: prepared.fingerprint,
    receipt,
  };
  return { ledger: next, receipt };
}
