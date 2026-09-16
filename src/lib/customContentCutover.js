/**
 * Pure policy for the browser-local → premium-cloud authority transition.
 *
 * Persistence and session fencing remain in the store/service layers. Keeping
 * the state predicate and explicit activation policy here leaves the store
 * action readable and gives tests a deterministic seam.
 */

import {
  mergeCustomContentArchives,
} from './customContentArchiveMerge.js';

/** @param {Record<string, any>} archive */
export function archiveHasConstitutionalState(archive) {
  const ledger = archive?.ledger || {};
  return [
    'definitions',
    'revisions',
    'packs',
    'packVersions',
    'packEntryDefinitions',
    'packVersionEntries',
    'environments',
    'commandReceipts',
  ].some(key => Array.isArray(ledger[key]) && ledger[key].length > 0)
    || ledger.activeEnvironmentRevisionId != null
    || (
      Array.isArray(archive?.auditProvenance)
      && archive.auditProvenance.length > 0
    );
}

/** @param {Record<string, any>} receipt */
export function archiveImportWasConfirmed(receipt) {
  return receipt?.ok === true
    && receipt.status === 'applied'
    && receipt.persistence?.state === 'confirmed';
}

/**
 * @param {unknown[]} archives ordered anonymous first, signed-in owner second
 * @param {{sourceKey:string, activeEnvironmentRevisionId:string|null}} options
 */
export function mergeLocalCustomContentArchivesForCutover(
  archives,
  options,
) {
  return mergeCustomContentArchives(archives, {
    sourceKey: options.sourceKey,
    sourceType: 'browser-local-premium-cutover',
    exportedAt: null,
    activeEnvironmentRevisionId: options.activeEnvironmentRevisionId,
  });
}
