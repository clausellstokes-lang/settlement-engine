/**
 * Lossless merge for owner-scoped browser archives.
 *
 * A pre-cloud account can have both an anonymous ledger and a signed-in local
 * ledger. Importing those ledgers independently would create two destination
 * namespaces, so an authored dependency in one ledger could no longer resolve
 * an identity from the other. This module first joins both source graphs, then
 * lets the archive importer derive one coherent destination identity map.
 *
 * Immutable identity collisions fail closed. We never rename a colliding
 * definition, revision, pack, environment, or receipt because doing so would
 * manufacture lineage that did not exist in either source ledger.
 */

import {
  canonicalContentJson,
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';
import {
  sealCustomContentArchive,
  validateCustomContentArchive,
} from './customContentArchive.js';

const MERGE_CONFLICT = 'custom_content_archive_merge_conflict';

/**
 * @param {string} label
 * @param {string} key
 * @returns {never}
 */
function conflict(label, key) {
  throw Object.assign(
    new Error(`${label} "${key}" conflicts across local archives.`),
    { code: MERGE_CONFLICT },
  );
}

/**
 * Insert an immutable record, admitting an exact replay but rejecting a second
 * meaning for the same identity.
 *
 * @param {Map<string, any>} target
 * @param {string} key
 * @param {any} value
 * @param {string} label
 */
function insertExact(target, key, value, label) {
  if (!target.has(key)) {
    target.set(key, value);
    return;
  }
  if (canonicalContentJson(target.get(key)) !== canonicalContentJson(value)) {
    conflict(label, key);
  }
}

/**
 * Detect aliases that collide even when their primary record ids differ.
 *
 * @param {Map<string, string>} target
 * @param {string} alias
 * @param {string} identity
 * @param {string} label
 */
function claimAlias(target, alias, identity, label) {
  const prior = target.get(alias);
  if (prior && prior !== identity) conflict(label, alias);
  target.set(alias, identity);
}

/** @param {Record<string, any>} pack */
function immutablePackIdentity(pack) {
  return {
    ...pack,
    activePackVersion: null,
    activeManifestHash: null,
    // The row timestamp follows the selected activation pointer; it is not an
    // authored release identity and therefore cannot make two closures differ.
    updatedAt: null,
  };
}

/**
 * @param {unknown[]} archiveValues
 * @param {{
 *   sourceKey?:string,
 *   sourceType?:string,
 *   exportedAt?:string|null,
 *   activeEnvironmentRevisionId?:string|null,
 * }} [options]
 */
export function mergeCustomContentArchives(archiveValues, options = {}) {
  const admittedByFingerprint = new Map();
  for (const value of archiveValues) {
    const admission = validateCustomContentArchive(value);
    if (admission.ok === false) {
      throw new TypeError(admission.message || admission.reason);
    }
    admittedByFingerprint.set(
      admission.archive.archiveFingerprint,
      admission.archive,
    );
  }
  const archives = [...admittedByFingerprint.values()];
  if (archives.length === 0) {
    throw new TypeError('At least one custom-content archive is required.');
  }

  const definitions = new Map();
  const definitionByLocalUid = new Map();
  const revisions = new Map();
  const revisionByLineage = new Map();
  const packs = new Map();
  const immutablePacks = new Map();
  const packVersions = new Map();
  const packEntryDefinitions = new Map();
  const packVersionEntries = new Map();
  const environments = new Map();
  const environmentByLineage = new Map();
  const commandReceipts = new Map();
  const sourceActiveEnvironments = new Set();

  for (const archive of archives) {
    const ledger = archive.ledger;
    for (const definition of ledger.definitions) {
      const definitionId = String(definition.id);
      insertExact(definitions, definitionId, definition, 'Definition');
      claimAlias(
        definitionByLocalUid,
        String(definition.localUid),
        definitionId,
        'Definition local uid',
      );
    }
    for (const revision of ledger.revisions) {
      const revisionId = String(revision.id);
      insertExact(revisions, revisionId, revision, 'Revision');
      claimAlias(
        revisionByLineage,
        `${revision.definitionId}\u0000${revision.revisionNumber}`,
        revisionId,
        'Definition revision number',
      );
    }
    for (const pack of ledger.packs) {
      const packId = String(pack.packId);
      insertExact(
        immutablePacks,
        packId,
        immutablePackIdentity(pack),
        'Pack',
      );
      // Inputs are ordered anon first and signed-in owner second. Activation is
      // intentionally the only last-writer policy: every release remains
      // immutable, while the more specific owner scope selects what is active.
      const prior = packs.get(packId);
      packs.set(packId, {
        ...(prior || pack),
        activePackVersion: pack.activePackVersion,
        activeManifestHash: pack.activeManifestHash,
        updatedAt: pack.updatedAt,
      });
    }
    for (const version of ledger.packVersions) {
      insertExact(
        packVersions,
        `${version.packId}\u0000${version.packVersion}`,
        version,
        'Pack version',
      );
    }
    for (const mapping of ledger.packEntryDefinitions) {
      insertExact(
        packEntryDefinitions,
        `${mapping.packId}\u0000${mapping.packEntryId}`,
        mapping,
        'Pack entry',
      );
    }
    for (const entry of ledger.packVersionEntries) {
      insertExact(
        packVersionEntries,
        [
          entry.packId,
          entry.packVersion,
          entry.packEntryId,
        ].join('\u0000'),
        entry,
        'Pack closure entry',
      );
    }
    for (const environment of ledger.environments) {
      const revisionId = String(environment.environmentRevisionId);
      insertExact(
        environments,
        revisionId,
        environment,
        'Environment revision',
      );
      claimAlias(
        environmentByLineage,
        `${environment.environmentId}\u0000${environment.revisionNumber}`,
        revisionId,
        'Environment revision number',
      );
    }
    for (const record of ledger.commandReceipts) {
      insertExact(
        commandReceipts,
        String(record.commandId),
        record,
        'Command receipt',
      );
    }
    if (ledger.activeEnvironmentRevisionId != null) {
      sourceActiveEnvironments.add(
        String(ledger.activeEnvironmentRevisionId),
      );
    }
  }

  const hasExplicitEnvironmentChoice = Object.hasOwn(
    options,
    'activeEnvironmentRevisionId',
  );
  if (sourceActiveEnvironments.size > 1 && !hasExplicitEnvironmentChoice) {
    throw Object.assign(
      new Error(
        'Local archives disagree about the active content environment; '
        + 'an explicit activeEnvironmentRevisionId is required.',
      ),
      { code: 'custom_content_archive_active_environment_choice_required' },
    );
  }
  const activeEnvironmentRevisionId = hasExplicitEnvironmentChoice
    ? options.activeEnvironmentRevisionId
    : [...sourceActiveEnvironments][0] || null;
  if (
    activeEnvironmentRevisionId != null
    && !environments.has(String(activeEnvironmentRevisionId))
  ) {
    throw Object.assign(
      new Error('The selected active content environment is not in the merge.'),
      { code: 'custom_content_archive_active_environment_unavailable' },
    );
  }

  const sourceFingerprints = archives
    .map(archive => archive.source.ledgerFingerprint)
    .sort();
  const sourceKey = options.sourceKey || `merged-local:${fingerprintContent({
    schemaVersion: 1,
    sourceFingerprints,
  }).slice(0, 40)}`;
  return sealCustomContentArchive({
    schemaVersion: 1,
    definitions: [...definitions.values()],
    revisions: [...revisions.values()],
    packs: [...packs.values()],
    packVersions: [...packVersions.values()],
    packEntryDefinitions: [...packEntryDefinitions.values()],
    packVersionEntries: [...packVersionEntries.values()],
    environments: [...environments.values()],
    activeEnvironmentRevisionId:
      activeEnvironmentRevisionId == null
        ? null
        : String(activeEnvironmentRevisionId),
    commandReceipts: [...commandReceipts.values()],
  }, {
    sourceKey,
    sourceType: options.sourceType || 'browser-local-merge',
    exportedAt: Object.hasOwn(options, 'exportedAt')
      ? options.exportedAt
      : new Date().toISOString(),
    auditProvenance: archives.map(archive => ({
      archiveFingerprint: archive.archiveFingerprint,
      source: archive.source,
      commandReceipts: archive.ledger.commandReceipts,
      auditProvenance: archive.auditProvenance,
    })),
  });
}
