/**
 * One-way import of the historical flat local custom-content projection.
 *
 * Legacy rows had no owner-wide localUid constraint. This adapter preserves a
 * valid unique value when possible and assigns a deterministic fallback for
 * blank, oversized, or colliding values before immutable revisions are minted.
 */

import {
  authoredDataOf,
  contentRevisionHash,
} from '../domain/content/customContentVersioning.js';
import {
  REVIEWED_SUPPLY_CHAIN_CATEGORY,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  detachContentJson,
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';
import {
  localPackEntryKey,
  migrateLegacyLocalPackEntryKeys,
  parseLocalPackEntryKey,
} from './customContentLocalPackKeys.js';

function quarantineLegacyReviewedChain(ledger, source, index) {
  const quarantine = {
    schemaVersion: 1,
    reason: 'legacy_reviewed_supply_chain_requires_review',
    legacyProjectionIndex: index,
    source: detachContentJson(source),
  };
  const fingerprint = fingerprintContent(quarantine);
  const commandId =
    `legacy:reviewed-supply-chain-quarantine:${fingerprint}`;
  if (ledger.commandReceipts[commandId]) return false;
  ledger.commandReceipts[commandId] = {
    fingerprint,
    receipt: {
      ok: true,
      status: 'applied',
      commandId,
      reason: 'legacy_reviewed_supply_chain_quarantined',
      replayed: false,
      result: { quarantine },
      perEntry: [],
    },
  };
  return true;
}

/** @param {unknown} packId @param {unknown} packVersion */
function packVersionIdentity(packId, packVersion) {
  return JSON.stringify([String(packId || ''), String(packVersion || '')]);
}

/**
 * Read the exact version address represented by one local pack-version key.
 * Current ledgers carry both fields on the pack row; the key fallback preserves
 * recovery for older projections.
 *
 * @param {Record<string, any>} ledger
 * @param {string} key
 */
function localPackVersionAddress(ledger, key) {
  const pack = ledger.packs?.[key];
  const separator = key.lastIndexOf('@');
  return {
    packId: String(
      pack?.packId || (separator >= 0 ? key.slice(0, separator) : key),
    ),
    packVersion: String(
      pack?.packVersion || (separator >= 0 ? key.slice(separator + 1) : ''),
    ),
  };
}

/**
 * Preserve an unprovable revisioned artifact as one durable recovery receipt,
 * then remove every ledger edge that would otherwise leave false authority or
 * a dangling constitutional reference.
 *
 * @param {Record<string, any>} ledger
 * @param {Record<string, any>} definition
 */
function quarantineRevisionedReviewedDefinition(ledger, definition) {
  const revisions = Object.values(ledger.revisions || {}).filter(
    revision => revision?.definitionId === definition.id,
  );
  const revisionIds = new Set(revisions.map(revision => revision.id));
  const affectedVersionKeys = new Set();
  const affectedVersionIdentities = new Set();
  const affectedEntryKeys = new Set();
  for (const [mappingKey, definitionId] of Object.entries(
    ledger.packEntryDefinitions || {},
  )) {
    if (definitionId !== definition.id) continue;
    affectedEntryKeys.add(mappingKey);
  }
  for (const [key, entries] of Object.entries(
    ledger.packVersionEntries || {},
  )) {
    if (
      !Array.isArray(entries)
      || !entries.some(entry => (
        entry?.definitionId === definition.id
        || revisionIds.has(entry?.revisionId)
      ))
    ) continue;
    const address = localPackVersionAddress(ledger, key);
    affectedVersionKeys.add(key);
    affectedVersionIdentities.add(
      packVersionIdentity(address.packId, address.packVersion),
    );
    for (const entry of entries) {
      affectedEntryKeys.add(
        localPackEntryKey(address.packId, entry?.packEntryId),
      );
    }
  }

  const referencedPackState = {
    packs: {},
    packVersionEntries: {},
    packEntryDefinitions: {},
    packEntryRevisions: {},
    activePacks: {},
  };
  for (const [key, pack] of Object.entries(ledger.packs || {})) {
    if (affectedVersionKeys.has(key)) {
      referencedPackState.packs[key] = pack;
    }
  }
  for (const [key, entries] of Object.entries(
    ledger.packVersionEntries || {},
  )) {
    if (affectedVersionKeys.has(key)) {
      referencedPackState.packVersionEntries[key] = entries;
    }
  }
  for (const [key, definitionId] of Object.entries(
    ledger.packEntryDefinitions || {},
  )) {
    if (
      definitionId === definition.id
      || affectedEntryKeys.has(key)
    ) {
      referencedPackState.packEntryDefinitions[key] = definitionId;
    }
  }
  for (const [key, revisionId] of Object.entries(
    ledger.packEntryRevisions || {},
  )) {
    if (
      revisionIds.has(revisionId)
      || affectedEntryKeys.has(key)
    ) {
      referencedPackState.packEntryRevisions[key] = revisionId;
    }
  }
  for (const [packId, activation] of Object.entries(
    ledger.activePacks || {},
  )) {
    if (affectedVersionIdentities.has(packVersionIdentity(
      packId,
      activation?.packVersion,
    ))) {
      referencedPackState.activePacks[packId] = activation;
    }
  }

  // Environment revisions form immutable, gapless histories. Removing an
  // affected revision therefore invalidates every later revision in that same
  // history even when a later snapshot no longer names the quarantined pack.
  // Preserve the valid prefix and quarantine the affected suffix.
  const affectedEnvironmentRevisionById = new Map();
  const directlyAffectedEnvironmentKeys = new Set();
  for (const [key, environment] of Object.entries(
    ledger.environments || {},
  )) {
    const referencesDefinition =
      environment?.directDefinitions?.some(reference => (
        reference?.definitionId === definition.id
        || revisionIds.has(reference?.revisionId)
      ));
    const referencesAffectedPack =
      environment?.packVersions?.some(reference => (
        affectedVersionIdentities.has(packVersionIdentity(
          reference?.packId,
          reference?.packVersionId,
        ))
      ));
    if (!referencesDefinition && !referencesAffectedPack) continue;
    directlyAffectedEnvironmentKeys.add(key);
    const environmentId = String(environment?.environmentId || '');
    const revisionNumber = Number(environment?.revisionNumber);
    const previous = affectedEnvironmentRevisionById.get(environmentId);
    if (
      Number.isInteger(revisionNumber)
      && (previous == null || revisionNumber < previous)
    ) {
      affectedEnvironmentRevisionById.set(environmentId, revisionNumber);
    }
  }
  const referencedEnvironments = [];
  for (const [key, environment] of Object.entries(
    ledger.environments || {},
  )) {
    const firstAffectedRevision = affectedEnvironmentRevisionById.get(
      String(environment?.environmentId || ''),
    );
    if (
      !directlyAffectedEnvironmentKeys.has(key)
      && (
        firstAffectedRevision == null
        || Number(environment?.revisionNumber) < firstAffectedRevision
      )
    ) {
      continue;
    }
    referencedEnvironments.push(environment);
    delete ledger.environments[key];
    if (ledger.activeEnvironmentRevisionId === key) {
      ledger.activeEnvironmentRevisionId = null;
    }
  }
  const payload = {
    schemaVersion: 1,
    reason: 'legacy_reviewed_supply_chain_lifecycle_untrusted',
    definition: detachContentJson(definition),
    revisions: detachContentJson(revisions),
    referencedPackState: detachContentJson(referencedPackState),
    referencedEnvironments: detachContentJson(referencedEnvironments),
  };
  const fingerprint = fingerprintContent(payload);
  const commandId =
    `legacy:reviewed-supply-chain-generation-quarantine:${fingerprint}`;
  ledger.commandReceipts[commandId] = {
    fingerprint,
    receipt: {
      status: 'applied',
      reason: 'legacy_reviewed_supply_chain_generation_quarantined',
      result: { quarantine: payload },
      perEntry: [],
    },
  };

  delete ledger.definitions[definition.id];
  for (const revisionId of revisionIds) delete ledger.revisions[revisionId];
  const survivingEntryKeys = new Set();
  for (const [key, entries] of Object.entries(
    ledger.packVersionEntries || {},
  )) {
    if (affectedVersionKeys.has(key) || !Array.isArray(entries)) continue;
    const address = localPackVersionAddress(ledger, key);
    for (const entry of entries) {
      survivingEntryKeys.add(
        localPackEntryKey(address.packId, entry?.packEntryId),
      );
    }
  }
  for (const [key, definitionId] of Object.entries(
    ledger.packEntryDefinitions || {},
  )) {
    if (
      definitionId === definition.id
      || (
        affectedEntryKeys.has(key)
        && !survivingEntryKeys.has(key)
      )
    ) {
      delete ledger.packEntryDefinitions[key];
    }
  }
  for (const [key, revisionId] of Object.entries(
    ledger.packEntryRevisions || {},
  )) {
    const parsed = parseLocalPackEntryKey(key);
    if (
      revisionIds.has(revisionId)
      || !ledger.packEntryDefinitions[key]
      || (
        parsed
        && Object.hasOwn(
          referencedPackState.activePacks,
          parsed.packId,
        )
      )
    ) {
      delete ledger.packEntryRevisions[key];
    }
  }
  for (const key of affectedVersionKeys) {
    delete ledger.packs[key];
    delete ledger.packVersionEntries[key];
  }
  for (const packId of Object.keys(referencedPackState.activePacks)) {
    delete ledger.activePacks[packId];
  }
}

/**
 * A local command receipt and the revisions it describes occupy the same
 * caller-writable storage boundary. An older receipt can therefore aid
 * recovery, but cannot prove that a human review occurred or mint a lifecycle
 * generation retroactively. Every reviewed definition without the explicit
 * generation introduced by the durable command lane is quarantined. A present
 * but invalid generation is equally untrusted.
 *
 * @param {Record<string, any>} ledger
 */
function migrateReviewedLifecycleGenerations(ledger) {
  const candidates = Object.values(ledger.definitions || {}).filter(
    definition => (
      definition?.category === REVIEWED_SUPPLY_CHAIN_CATEGORY
      && (
        !Number.isInteger(definition.reviewedLifecycleVersion)
        || definition.reviewedLifecycleVersion < 1
        || definition.reviewedLifecycleVersion > 2_147_483_647
      )
    ),
  );
  if (candidates.length === 0) return false;
  for (const definition of candidates) {
    quarantineRevisionedReviewedDefinition(ledger, definition);
  }
  return true;
}

function localDefinitionId(category, item) {
  if (item.definitionId || item.id) return String(item.definitionId || item.id);
  const hash = contentRevisionHash(category, {
    ...item,
    localUid: item.localUid || null,
  });
  return `local-definition:${hash}`;
}

function backfillLocalUid(source, definitionId, category, usedLocalUids) {
  const candidate = typeof source.localUid === 'string'
    ? source.localUid.trim()
    : '';
  if (
    candidate
    && candidate.length <= 240
    && !usedLocalUids.has(candidate)
  ) {
    usedLocalUids.add(candidate);
    return candidate;
  }

  let attempt = 0;
  let fallback;
  do {
    fallback = `bf_${fingerprintContent({
      category,
      definitionId,
      attempt,
    }).slice(0, 32)}`;
    attempt += 1;
  } while (usedLocalUids.has(fallback));
  usedLocalUids.add(fallback);
  return fallback;
}

export function backfillLegacyCustomContentLedger(ledger, grouped) {
  let changed = migrateLegacyLocalPackEntryKeys(ledger);
  const usedLocalUids = new Set(
    Object.values(ledger.definitions || {})
      .map(definition => String(definition?.localUid || '').trim())
      .filter(Boolean),
  );
  changed = migrateReviewedLifecycleGenerations(ledger) || changed;
  for (const [category, items] of Object.entries(grouped)) {
    if (!Array.isArray(items)) continue;
    for (const [index, source] of items.entries()) {
      if (category === REVIEWED_SUPPLY_CHAIN_CATEGORY) {
        // The flat mirror was caller-writable and carries no dedicated command
        // receipt. Even an exact-looking confirmed graph is therefore
        // self-signed legacy input, not review authority. Keep its bytes in the
        // compatibility snapshot for recovery; rediscovery plus the dedicated
        // command is the only path that may mint a reviewed revision.
        changed = quarantineLegacyReviewedChain(
          ledger,
          source,
          index,
        ) || changed;
        continue;
      }
      if (!source || typeof source !== 'object') continue;
      const definitionId = localDefinitionId(category, source);
      if (ledger.definitions[definitionId]) continue;
      const localUid = backfillLocalUid(
        source,
        definitionId,
        category,
        usedLocalUids,
      );
      const data = authoredDataOf({ ...source, localUid });
      const contentHash = contentRevisionHash(category, data);
      const revisionId = source.revisionId
        || `legacy-revision:${fingerprintContent({ definitionId, contentHash })}`;
      const createdAt = source.createdAt || source.updatedAt || null;
      ledger.definitions[definitionId] = {
        id: definitionId,
        category,
        localUid,
        headRevisionId: revisionId,
        archivedAt: source.archivedAt || null,
        createdAt,
        updatedAt: source.updatedAt || createdAt,
        legacyContentId: source.id || null,
      };
      ledger.revisions[revisionId] = {
        id: revisionId,
        definitionId,
        category,
        revisionNumber: Number(source.revisionNumber) || 1,
        parentRevisionId: null,
        contentHash,
        data,
        createdAt,
      };
      changed = true;
    }
  }
  return changed;
}
