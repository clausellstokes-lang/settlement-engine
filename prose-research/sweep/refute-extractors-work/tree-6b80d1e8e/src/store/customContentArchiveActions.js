/**
 * Store orchestration for full custom-content archive transfer.
 *
 * The archive contract, deterministic remap, and persistence authorities live
 * in lib/. This module coordinates those capabilities with the current auth
 * session and Zustand projections. Keeping the vertical here prevents the
 * general custom-content slice from becoming the owner of transfer protocol,
 * retry, compare-and-swap, and hydration policy at once.
 */

import { customContentService } from '../lib/customContent.js';
import {
  invalidateCustomDepsIfLoaded,
} from '../lib/customContentSource.js';

const MIGRATED_FLAG_PREFIX = 'sf_custom_content_migrated:';
/** @type {Promise<typeof import('../lib/customContentCutover.js')>|null} */
let cutoverPolicyPromise = null;

function loadCutoverPolicy() {
  if (!cutoverPolicyPromise) {
    cutoverPolicyPromise = import('../lib/customContentCutover.js');
  }
  return cutoverPolicyPromise;
}

/** @param {string} ownerId */
function migrationFlag(ownerId) {
  const safeOwner = String(ownerId || 'anon')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${MIGRATED_FLAG_PREFIX}${safeOwner}`;
}

/**
 * @param {{
 *   set:Function,
 *   get:Function,
 *   emptyContent:Record<string, unknown[]>,
 *   normalizeGrouped:(value:unknown)=>Record<string, unknown[]>,
 *   ownerIdFromState:(state:unknown)=>string,
 *   commandFailure:(reason:string,status?:string)=>Record<string, unknown>,
 * }} dependencies
 */
export function createCustomContentArchiveActions({
  set,
  get,
  emptyContent,
  normalizeGrouped,
  ownerIdFromState,
  commandFailure,
}) {
  /** @type {{ownerId:string,promise:Promise<unknown>}|null} */
  let activeCutover = null;

  return {
    /**
     * Export the complete owner ledger. This is a data-rights read and
     * deliberately bypasses the premium authoring gate.
     */
    exportCustomContentArchive: async (options = {}) => {
      const ownerId = ownerIdFromState(get());
      const archive = await customContentService.exportArchive({
        ...options,
        ownerId,
      });
      if (ownerIdFromState(get()) !== ownerId) {
        throw Object.assign(
          new Error(
            'The signed-in account changed while custom content was exporting.',
          ),
          { code: 'auth_session_changed' },
        );
      }
      return archive;
    },

    /**
     * Restore one constitutional archive through the service's single atomic
     * command, then refresh every editable/read-only projection.
     */
    importCustomContentArchive: async (archive, options = {}) => {
      const ownerId = ownerIdFromState(get());
      if (
        ownerId === 'anon'
        || typeof get().canUseCustomContent !== 'function'
        || !get().canUseCustomContent()
      ) {
        return commandFailure('custom_content_requires_premium');
      }
      const { archiveImportWasConfirmed } = await loadCutoverPolicy();
      const receipt = await customContentService.importArchive(archive, {
        ...options,
        ownerId,
      });
      if (ownerIdFromState(get()) !== ownerId) {
        return commandFailure('auth_session_changed', 'stale');
      }
      const importConfirmed = archiveImportWasConfirmed(receipt);
      set(state => {
        state.customContentLastCommandReceipt = receipt;
        if (importConfirmed) state.customContentRevisionHistory = {};
      });
      if (!importConfirmed) return receipt;

      if (customContentService.isConfigured) {
        await get().loadCustomContentFromCloud();
      } else {
        const grouped = await customContentService.list({ ownerId });
        if (ownerIdFromState(get()) !== ownerId) {
          return commandFailure('auth_session_changed', 'stale');
        }
        set(state => {
          state.customContent = normalizeGrouped({
            ...emptyContent,
            ...grouped,
          });
          state.customContentSyncedAt = new Date().toISOString();
        });
        await get().loadCustomContentEnvironments();
      }
      await get().loadArchivedCustomContent();
      if (ownerIdFromState(get()) !== ownerId) {
        return commandFailure('auth_session_changed', 'stale');
      }
      invalidateCustomDepsIfLoaded();
      return receipt;
    },

    /**
     * Move both pre-account and signed-in browser ledgers into one cloud graph.
     *
     * The upload is one idempotent archive command. Local authorities are
     * cleared only after a confirmed receipt through one all-owner CAS, so a
     * concurrent edit, account switch, ambiguous response, or process restart
     * can retry without losing history or splitting dependency namespaces.
     */
    migrateLocalCustomContentToCloud: async () => {
      if (!customContentService.isConfigured) return undefined;
      if (!get().canUseCustomContent?.()) return undefined;
      const ownerId = ownerIdFromState(get());
      if (ownerId === 'anon') return undefined;
      const flag = migrationFlag(ownerId);

      if (activeCutover?.ownerId === ownerId) {
        return activeCutover.promise;
      }
      const promise = (async () => {
        try {
          const {
            archiveHasConstitutionalState,
            archiveImportWasConfirmed,
            mergeLocalCustomContentArchivesForCutover,
          } = await loadCutoverPolicy();
          if (
            typeof customContentService.localExportArchive !== 'function'
            || typeof customContentService.localClearArchivesAfterSnapshot
              !== 'function'
          ) {
            throw new Error(
              'The full local custom-content transfer service is unavailable.',
            );
          }
          const sourceOwners = ['anon', ownerId];
          const archives = await Promise.all(sourceOwners.map(
            sourceOwnerId => customContentService.localExportArchive({
              ownerId: sourceOwnerId,
              exportedAt: null,
            }),
          ));
          if (ownerIdFromState(get()) !== ownerId) {
            return commandFailure('auth_session_changed', 'stale');
          }
          const snapshots = archives.map((archive, index) => ({
            ownerId: sourceOwners[index],
            ledgerFingerprint: archive.source.ledgerFingerprint,
          }));
          const hasState = archives.some(archiveHasConstitutionalState);
          let receipt = {
            ok: true,
            status: 'applied',
            reason: null,
            persistence: {
              state: 'confirmed',
              authority: 'no-local-content',
            },
          };

          if (hasState) {
            const sourceKey = `browser-cutover:${ownerId}`;
            const mergedArchive = mergeLocalCustomContentArchivesForCutover(
              archives,
              {
                sourceKey,
                // The signed-in local environment is more specific than the
                // anonymous one. The merge still requires an explicit choice.
                activeEnvironmentRevisionId:
                  archives[1].ledger.activeEnvironmentRevisionId
                  ?? archives[0].ledger.activeEnvironmentRevisionId
                  ?? null,
              },
            );
            receipt = await customContentService.importArchive(mergedArchive, {
              ownerId,
              sourceKey,
              purpose: 'premium-cutover',
              // The server proves emptiness under the owner lock. Existing
              // cloud constitution wins; an empty account adopts local
              // active pack/environment pointers.
              activationPolicy: 'adopt-if-empty',
            });
            if (ownerIdFromState(get()) !== ownerId) {
              return commandFailure('auth_session_changed', 'stale');
            }
            set(state => {
              state.customContentLastCommandReceipt = receipt;
            });
            if (!archiveImportWasConfirmed(receipt)) {
              set(state => {
                state.customContentError = receipt?.reason
                  || 'The custom-content transfer is awaiting reconciliation.';
              });
              return receipt;
            }
          }

          const cleared = await (
            customContentService.localClearArchivesAfterSnapshot(snapshots)
          );
          if (ownerIdFromState(get()) !== ownerId) {
            return commandFailure('auth_session_changed', 'stale');
          }
          if (!cleared) {
            const stale = commandFailure(
              'custom_content_local_snapshot_changed',
              'stale',
            );
            set(state => {
              state.customContentLastCommandReceipt = stale;
              state.customContentError =
                'Local custom content changed during cloud transfer. It will retry safely.';
            });
            return stale;
          }

          // The checkpoint is observability only. It must never suppress a
          // later anonymous session that needs transfer into the same owner.
          try {
            localStorage.setItem(flag, '1');
          } catch {
            // Storage policy cannot change a confirmed cloud transfer.
          }
          if (hasState) await get().loadCustomContentFromCloud();
          return receipt;
        } catch (error) {
          console.error('migrateLocalCustomContentToCloud failed:', error);
          if (ownerIdFromState(get()) === ownerId) {
            set(state => {
              state.customContentError = error instanceof Error
                ? error.message
                : 'Local custom content could not be transferred.';
            });
          }
          return commandFailure(
            error?.code || error?.message || 'custom_content_cutover_failed',
          );
        }
      })();
      activeCutover = { ownerId, promise };
      try {
        return await promise;
      } finally {
        if (activeCutover?.promise === promise) activeCutover = null;
      }
    },
  };
}
