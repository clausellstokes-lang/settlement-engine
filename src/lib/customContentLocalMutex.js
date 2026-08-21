/**
 * Compatibility wrapper for the custom-content local authority.
 *
 * The generic mutex also protects other local read/compare/write documents.
 * Keeping this named wrapper preserves the ledger's public boundary and its
 * established cross-document lock identity.
 */

import {
  withLocalAuthorityLock,
  withLocalAuthorityLocks,
} from './localAuthorityMutex.js';

/**
 * @template T
 * @param {unknown} ownerId
 * @param {() => T} criticalSection
 * @returns {Promise<T>}
 */
export function withCustomContentLocalLock(ownerId, criticalSection) {
  return withLocalAuthorityLock(
    'custom-content-ledger',
    String(ownerId || 'anon'),
    criticalSection,
  );
}

/**
 * Acquire several owner-ledger locks in one stable order. The callback remains
 * synchronous, so all comparisons and writes form one local transaction.
 *
 * @template T
 * @param {unknown[]} ownerIds
 * @param {() => T} criticalSection
 * @returns {Promise<T>}
 */
export function withCustomContentLocalLocks(ownerIds, criticalSection) {
  return withLocalAuthorityLocks(
    'custom-content-ledger',
    ownerIds.map(ownerId => String(ownerId || 'anon')),
    criticalSection,
  );
}
