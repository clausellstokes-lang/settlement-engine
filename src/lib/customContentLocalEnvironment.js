/**
 * Environment and pack-closure projections over the browser-local ledger.
 *
 * The ledger owns immutable facts. These helpers derive the exact revision
 * snapshots and pack closure needed by the pure domain resolver without
 * teaching the command writer about runtime compilation.
 */

import {
  resolveContentEnvironmentSnapshot,
} from '../domain/content/contentEnvironmentResolution.js';
import { compareCodepoint } from '../domain/deterministicSort.js';
import {
  parseLocalPackEntryKey,
} from './customContentLocalPackKeys.js';

/**
 * @param {unknown} packId
 * @param {unknown} packVersion
 */
export function localPackVersionKey(packId, packVersion) {
  return `${String(packId)}@${String(packVersion)}`;
}

/**
 * @param {Record<string, any>} ledger
 * @param {any} environment
 */
export function resolveEnvironmentFromLocalLedger(ledger, environment) {
  const directDefinitions = Array.isArray(environment?.directDefinitions)
    ? environment.directDefinitions
    : [];
  const revisions = directDefinitions.flatMap(reference => {
    const revision = ledger.revisions?.[reference?.revisionId];
    return revision ? [revision] : [];
  });
  const packVersions = Array.isArray(environment?.packVersions)
    ? environment.packVersions
    : [];
  const closures = packVersions.flatMap(binding => {
    const key = localPackVersionKey(binding?.packId, binding?.packVersionId);
    const pack = ledger.packs?.[key];
    if (
      !pack
      || !Object.hasOwn(ledger.packVersionEntries || {}, key)
    ) return [];
    return [{
      packId: pack.packId,
      packVersionId: pack.packVersion,
      manifestHash: pack.manifestHash,
      entries: ledger.packVersionEntries[key],
    }];
  });
  return resolveContentEnvironmentSnapshot(
    environment,
    revisions,
    closures,
  );
}

/**
 * Older v1 ledgers predate explicit per-version pack closure. Reconstruct every
 * closure still present in immutable command receipts, then fall back to the
 * active mapping only for the active version. An unreconstructable historical
 * version remains absent so environment resolution fails honestly.
 *
 * @param {Record<string, any>} ledger
 */
export function backfillLocalPackVersionEntries(ledger) {
  if (!ledger.packVersionEntries || typeof ledger.packVersionEntries !== 'object') {
    ledger.packVersionEntries = {};
  }
  let changed = false;

  for (const record of Object.values(ledger.commandReceipts || {})) {
    const receipt = record?.receipt;
    const pack = receipt?.result?.pack;
    const perEntry = receipt?.perEntry;
    if (
      !pack?.packId
      || !pack?.packVersion
      || !Array.isArray(perEntry)
    ) continue;
    const key = localPackVersionKey(pack.packId, pack.packVersion);
    if (Object.hasOwn(ledger.packVersionEntries, key)) continue;
    ledger.packVersionEntries[key] = perEntry.map((entry, ordinal) => ({
      packEntryId: entry.packEntryId,
      definitionId: entry.definitionId,
      revisionId: entry.revisionId,
      category: entry.category,
      ordinal,
    }));
    changed = true;
  }

  for (const [key, pack] of Object.entries(ledger.packs || {})) {
    if (
      Object.hasOwn(ledger.packVersionEntries, key)
      || !pack?.packId
      || !pack?.packVersion
    ) continue;
    const active = ledger.activePacks?.[pack.packId];
    if (
      active?.packVersion !== pack.packVersion
      || active?.manifestHash !== pack.manifestHash
    ) continue;
    const entries = Object.entries(ledger.packEntryDefinitions || {})
      .flatMap(([mappingKey, definitionId]) => {
        const parsed = parseLocalPackEntryKey(mappingKey);
        return parsed?.packId === String(pack.packId)
          ? [{ mappingKey, definitionId, packEntryId: parsed.packEntryId }]
          : [];
      })
      .sort((left, right) => compareCodepoint(
        left.mappingKey,
        right.mappingKey,
      ))
      .flatMap(({ mappingKey, definitionId, packEntryId }, ordinal) => {
        const definition = ledger.definitions?.[String(definitionId)];
        const revisionId = ledger.packEntryRevisions?.[mappingKey];
        if (!definition || !revisionId) return [];
        return [{
          packEntryId,
          definitionId,
          revisionId,
          category: definition.category,
          ordinal,
        }];
      });
    ledger.packVersionEntries[key] = entries;
    changed = true;
  }
  return changed;
}
