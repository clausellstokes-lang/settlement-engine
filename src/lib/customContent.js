/**
 * Eager-safe facade for custom-content persistence.
 *
 * The Zustand store is part of first paint, but custom-content admission and
 * ledger machinery is needed only when the account hydrates or the user opens
 * an authoring workflow. Keeping this facade free of domain imports preserves
 * that boundary while retaining the service's stable public API.
 */

import { isConfigured } from './supabase.js';

export { EMPTY_CUSTOM_CONTENT } from './customContentEmpty.js';

/** @type {Promise<typeof import('./customContentServiceRuntime.js')>|null} */
let runtimePromise = null;

function loadRuntime() {
  if (!runtimePromise) {
    runtimePromise = import('./customContentServiceRuntime.js');
  }
  return runtimePromise;
}

/**
 * @param {string} method
 * @param {unknown[]} args
 */
async function callRuntime(method, args) {
  const { customContentService: runtime } = await loadRuntime();
  const operation = runtime[method];
  if (typeof operation !== 'function') {
    throw new TypeError(`Unknown custom-content service operation "${method}".`);
  }
  return operation(...args);
}

const operation = method => (...args) => callRuntime(method, args);

export const customContentService = Object.freeze({
  list: operation('list'),
  listCustomContentRevisions: operation('listCustomContentRevisions'),
  loadArchivedCustomContent: operation('loadArchivedCustomContent'),
  listContentEnvironmentRevisions: operation(
    'listContentEnvironmentRevisions',
  ),
  loadActiveContentEnvironment: operation('loadActiveContentEnvironment'),
  resolveContentEnvironment: operation('resolveContentEnvironment'),
  loadContentPackState: operation('loadContentPackState'),
  executeCommand: operation('executeCommand'),
  executeReviewedSupplyChainCommand: operation(
    'executeReviewedSupplyChainCommand',
  ),
  resolveReviewedSupplyChainIdentity: operation(
    'resolveReviewedSupplyChainIdentity',
  ),
  add: operation('add'),
  update: operation('update'),
  delete: operation('delete'),
  archive: operation('archive'),
  restore: operation('restore'),
  bulkInsert: operation('bulkInsert'),
  importPack: operation('importPack'),
  exportArchive: operation('exportArchive'),
  importArchive: operation('importArchive'),
  localExportArchive: operation('localExportArchive'),
  localImportArchive: operation('localImportArchive'),
  localClearAfterArchive: operation('localClearAfterArchive'),
  localClearArchivesAfterSnapshot: operation(
    'localClearArchivesAfterSnapshot',
  ),
  localList: operation('localList'),
  localClear: operation('localClear'),
  readLocalForMigration: operation('readLocalForMigration'),
  isConfigured,
});
