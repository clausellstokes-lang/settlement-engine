/**
 * Locked orchestration for local custom-content archive export/import.
 *
 * Storage mechanics are injected by the ledger module; archive semantics stay
 * in the canonical contract and remap modules.
 */

import {
  buildCustomContentArchive,
} from './customContentArchive.js';
import {
  prepareCustomContentArchiveImport,
} from './customContentArchiveImport.js';
import {
  applyArchiveTransferToLocalLedger,
  findLocalArchiveSemanticReplay,
} from './customContentLocalArchive.js';
import {
  withCustomContentLocalLock,
  withCustomContentLocalLocks,
} from './customContentLocalMutex.js';

/**
 * @typedef {{
 *   load:(ownerId:string)=>Record<string, any>,
 *   persist:(ledger:Record<string, any>, ownerId:string)=>void,
 *   clear:(ownerId:string)=>void,
 *   safeOwnerKey:(ownerId:string)=>string,
 *   now:()=>string,
 * }} LocalArchiveStorage
 */

function archiveOptions(ledger, ownerId, options, storage) {
  return {
    sourceKey: options.sourceKey
      || `local:${storage.safeOwnerKey(ownerId)}`,
    sourceType: options.sourceType || 'browser-local',
    exportedAt: Object.hasOwn(options, 'exportedAt')
      ? options.exportedAt
      : new Date().toISOString(),
    auditProvenance: Object.values(ledger.archiveImports || {}),
  };
}

export async function exportLockedLocalArchive(
  options,
  storage,
) {
  const ownerId = options.ownerId || options.ownerKey || 'anon';
  return withCustomContentLocalLock(ownerId, () => {
    const ledger = storage.load(ownerId);
    return buildCustomContentArchive(
      ledger,
      archiveOptions(ledger, ownerId, options, storage),
    );
  });
}

export async function clearLockedLocalArchive(
  expectedLedgerFingerprint,
  options,
  storage,
) {
  const ownerId = options.ownerId || options.ownerKey || 'anon';
  return withCustomContentLocalLock(ownerId, () => {
    const ledger = storage.load(ownerId);
    const current = buildCustomContentArchive(ledger, {
      ...archiveOptions(ledger, ownerId, options, storage),
      exportedAt: null,
    });
    if (current.source.ledgerFingerprint !== expectedLedgerFingerprint) {
      return false;
    }
    storage.clear(ownerId);
    return true;
  });
}

/**
 * Compare every source snapshot before clearing any of them. A merged cutover
 * therefore cannot clear one dependency namespace and leave another behind
 * when a concurrent tab appends to either ledger.
 *
 * @param {Array<{
 *   ownerId:string,
 *   ledgerFingerprint:string,
 *   sourceKey?:string,
 *   sourceType?:string,
 * }>} snapshots
 * @param {LocalArchiveStorage} storage
 */
export async function clearLockedLocalArchivesAfterSnapshots(
  snapshots,
  storage,
) {
  if (!Array.isArray(snapshots) || snapshots.length === 0) {
    throw new TypeError('At least one local archive snapshot is required.');
  }
  const normalized = snapshots.map((snapshot) => ({
    ownerId: snapshot.ownerId || 'anon',
    ledgerFingerprint: String(snapshot.ledgerFingerprint || ''),
    sourceKey: snapshot.sourceKey,
    sourceType: snapshot.sourceType,
  }));
  if (
    new Set(normalized.map(snapshot => snapshot.ownerId)).size
    !== normalized.length
  ) {
    throw new TypeError('Local archive snapshot owners must be unique.');
  }
  return withCustomContentLocalLocks(
    normalized.map(snapshot => snapshot.ownerId),
    () => {
      for (const snapshot of normalized) {
        const ledger = storage.load(snapshot.ownerId);
        const current = buildCustomContentArchive(ledger, {
          ...archiveOptions(
            ledger,
            snapshot.ownerId,
            snapshot,
            storage,
          ),
          exportedAt: null,
        });
        if (
          current.source.ledgerFingerprint
          !== snapshot.ledgerFingerprint
        ) {
          return false;
        }
      }
      for (const snapshot of normalized) storage.clear(snapshot.ownerId);
      return true;
    },
  );
}

export async function importLockedLocalArchive(
  archive,
  options,
  storage,
) {
  const ownerId = options.ownerId || options.ownerKey || 'anon';
  const prepared = prepareCustomContentArchiveImport(archive, {
    destinationOwnerId: String(ownerId),
    sourceKey: options.sourceKey,
    activationPolicy: options.activationPolicy,
  });
  return withCustomContentLocalLock(ownerId, () => {
    const ledger = storage.load(ownerId);
    const prior = ledger.commandReceipts?.[prepared.commandId];
    if (prior) {
      if (prior.fingerprint !== prepared.fingerprint) {
        throw Object.assign(new Error('Archive import command id conflict.'), {
          code: 'command_id_conflict',
        });
      }
      return {
        ...prior.receipt,
        replayed: true,
      };
    }
    const semanticReplay = findLocalArchiveSemanticReplay(ledger, prepared);
    if (semanticReplay) return semanticReplay;
    const applied = applyArchiveTransferToLocalLedger(
      ledger,
      prepared,
      storage.now(),
    );
    try {
      // Admission of the prospective destination is the aggregate quota and
      // graph preflight. Two individually valid archives cannot be combined
      // into a ledger that its owner can no longer export.
      buildCustomContentArchive(
        applied.ledger,
        {
          ...archiveOptions(
            applied.ledger,
            ownerId,
            options,
            storage,
          ),
          exportedAt: null,
        },
      );
    } catch (error) {
      throw Object.assign(
        new Error(
          error instanceof Error
            ? error.message
            : 'Archive exceeds destination graph limits.',
        ),
        { code: 'custom_content_archive_destination_invalid' },
      );
    }
    storage.persist(applied.ledger, ownerId);
    return applied.receipt;
  });
}
