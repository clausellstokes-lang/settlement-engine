/**
 * customContentSlice — First-paint custom-content state and action facade.
 *
 * Boot needs the owner-local projection, immutable vanilla environment, and a
 * handful of synchronous reads. Authoring, archive transfer, environment
 * resolution, and cloud hydration are all asynchronous workflows; their
 * implementation lives in customContentSliceRuntime.js and loads on first use.
 *
 * This boundary is behavioral, not merely a bundler hint:
 *   - every public action exists synchronously when the Zustand store is built;
 *   - asynchronous actions keep their existing Promise contract;
 *   - one memoized runtime action set preserves per-store coordinators;
 *   - synchronous generation reads only already-admitted environment state.
 */

import { migrateCustomContent } from '../domain/customContentMigrations.js';
import {
  CONTENT_ENVIRONMENT_SCHEMA_VERSION,
  VANILLA_CONTENT_ENVIRONMENT,
  VANILLA_ENVIRONMENT_REVISION_ID,
} from '../domain/content/contentEnvironmentDefaults.js';

const LOCAL_KEY = 'sf_custom_content';
const LOCAL_KEY_PREFIX = 'sf_custom_content:';

const EMPTY = Object.freeze({
  institutions: Object.freeze([]),
  services: Object.freeze([]),
  resources: Object.freeze([]),
  stressors: Object.freeze([]),
  tradeGoods: Object.freeze([]),
  deities: Object.freeze([]),
  factions: Object.freeze([]),
  traditions: Object.freeze([]),
  supplyChains: Object.freeze([]),
  tradeRoutes: Object.freeze([]),
  powerPresets: Object.freeze([]),
  defensePresets: Object.freeze([]),
});

/** @param {string} ownerId */
function scopedLocalKey(ownerId = 'anon') {
  const owner = String(ownerId || 'anon');
  if (owner === 'anon') return LOCAL_KEY;
  return `${LOCAL_KEY_PREFIX}${owner.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

/** @param {string} ownerId */
function localLoad(ownerId = 'anon') {
  try {
    return JSON.parse(localStorage.getItem(scopedLocalKey(ownerId)) || '{}');
  } catch {
    return {};
  }
}

/**
 * Older local rows predate stable dependency identifiers. Backfill those
 * identifiers deterministically when possible, matching the deferred runtime.
 *
 * @param {Record<string, unknown>} grouped
 */
function backfillLocalUids(grouped) {
  if (!grouped || typeof grouped !== 'object') return grouped;
  for (const [category, value] of Object.entries(grouped)) {
    if (!Array.isArray(value)) continue;
    if (category === 'supplyChains') {
      // Reviewed-derived artifacts are rehydrated from the deferred immutable
      // ledger. First paint must never trust the historical flat mirror.
      grouped[category] = [];
      continue;
    }
    for (const item of value) {
      if (!item || item.localUid) continue;
      item.localUid = item.id
        ? `bf_${item.id}`
        : `lu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    }
    grouped[category] = value;
  }
  return grouped;
}

/** @param {string} ownerId */
function loadAll(ownerId = 'anon') {
  const raw = localLoad(ownerId);
  return backfillLocalUids(migrateCustomContent({
    ...emptyContent(),
    ...raw,
  }));
}

function emptyContent() {
  return Object.fromEntries(
    Object.keys(EMPTY).map(category => [category, []]),
  );
}

/** @type {Promise<typeof import('./customContentSliceRuntime.js')>|null} */
let runtimePromise = null;

function loadRuntime() {
  if (!runtimePromise) {
    runtimePromise = import('./customContentSliceRuntime.js');
  }
  return runtimePromise;
}

/**
 * Invoke one deferred action through the memoized per-module runtime.
 *
 * @param {string} actionName
 * @param {Function} set
 * @param {Function} get
 * @param {unknown[]} args
 */
function invokeDeferredAction(actionName, set, get, args) {
  return loadRuntime().then(module => (
    module.invokeCustomContentRuntimeAction(actionName, set, get, args)
  ));
}

/**
 * These compatibility actions delegate to another registered mutation or
 * perform a read/preview/export. They do not form new primitive mutation
 * boundaries, so the operation census intentionally excludes them.
 */
const DEFERRED_DELEGATING_ACTIONS = Object.freeze([
  'addCustomItem',
  'updateCustomItem',
  'deleteCustomItem',
  'saveReviewedSupplyChain',
  'removeReviewedSupplyChain',
  'restoreCustomItem',
  'rollbackCustomItem',
  'getInstalledContentPackState',
  'previewCustomContentEnvironmentMigration',
  'migrateCustomContentEnvironment',
  'resetCustomContentEnvironmentToVanilla',
  'exportCustomContentArchive',
]);

export const createCustomContentSlice = (set, get) => {
  const deferredDelegatingActions = Object.fromEntries(
    DEFERRED_DELEGATING_ACTIONS.map(actionName => [
      actionName,
      (...args) => invokeDeferredAction(actionName, set, get, args),
    ]),
  );

  return {
    customContent: loadAll('anon'),
    customContentLoading: false,
    customContentError: null,
    customContentSyncedAt: null,
    customContentLastCommandReceipt: null,
    customContentArchived: emptyContent(),
    customContentArchivedLoading: false,
    customContentRevisionHistory: {},
    activeContentEnvironment: VANILLA_CONTENT_ENVIRONMENT,
    activeContentEnvironmentContent: emptyContent(),
    customContentEnvironmentHistory: [],
    customContentEnvironmentHydrated: false,
    customContentEnvironmentError: null,

    ...deferredDelegatingActions,

    // Keep primitive mutation boundaries explicit in this facade. Besides
    // making the public surface readable, the structural operation census can
    // still prove that every deferred writer is registered after its heavy
    // implementation moves behind import().
    applyCustomContentCommand: (...args) => (
      invokeDeferredAction('applyCustomContentCommand', set, get, args)
    ),
    applyReviewedSupplyChainCommand: (...args) => (
      invokeDeferredAction(
        'applyReviewedSupplyChainCommand',
        set,
        get,
        args,
      )
    ),
    listCustomContentRevisions: (...args) => (
      invokeDeferredAction('listCustomContentRevisions', set, get, args)
    ),
    loadArchivedCustomContent: (...args) => (
      invokeDeferredAction('loadArchivedCustomContent', set, get, args)
    ),
    rollbackCustomContentEnvironment: (...args) => (
      invokeDeferredAction('rollbackCustomContentEnvironment', set, get, args)
    ),
    loadCustomContentEnvironments: (...args) => (
      invokeDeferredAction('loadCustomContentEnvironments', set, get, args)
    ),
    importCustomContentArchive: (...args) => (
      invokeDeferredAction('importCustomContentArchive', set, get, args)
    ),
    migrateLocalCustomContentToCloud: (...args) => (
      invokeDeferredAction('migrateLocalCustomContentToCloud', set, get, args)
    ),
    loadCustomContentFromCloud: (...args) => (
      invokeDeferredAction('loadCustomContentFromCloud', set, get, args)
    ),

    getActiveCustomContentRuntime: () => {
      const state = get();
      const environment = state.activeContentEnvironment
        || VANILLA_CONTENT_ENVIRONMENT;
      const vanilla = environment.environmentRevisionId
        === VANILLA_ENVIRONMENT_REVISION_ID;
      return Object.freeze({
        schemaVersion: CONTENT_ENVIRONMENT_SCHEMA_VERSION,
        environment,
        customContent: vanilla
          ? emptyContent()
          : state.activeContentEnvironmentContent || emptyContent(),
        tunables: environment.tunables || {},
        visualSelection: environment.visualSelection || {},
        resolution: Object.freeze({
          ok: true,
          mode: vanilla ? 'vanilla' : 'reviewed',
          reason: null,
          failures: Object.freeze([]),
        }),
      });
    },

    getCustomItems: category => get().customContent[category] || [],

    getCustomContentCount: () => Object.values(get().customContent)
      .reduce((sum, items) => sum + (items?.length || 0), 0),

    clearCloudCustomContent: () => {
      set(state => {
        state.customContent = loadAll();
        state.customContentLoading = false;
        state.customContentSyncedAt = null;
        state.customContentError = null;
        state.customContentArchived = emptyContent();
        state.customContentRevisionHistory = {};
        state.activeContentEnvironment = VANILLA_CONTENT_ENVIRONMENT;
        state.activeContentEnvironmentContent = emptyContent();
        state.customContentEnvironmentHistory = [];
        state.customContentEnvironmentHydrated = false;
        state.customContentEnvironmentError = null;
      });
      // Resolution entries are owner-keyed and immutable. The deferred runtime
      // clears its memo only if it was loaded; no eager import is needed.
      runtimePromise
        ?.then(module => {
          module.clearCustomContentRuntimeCaches?.();
        })
        .catch(() => {
          // The initiating action already owns/report its chunk-load failure.
          // Account reset must remain synchronous and cannot create a second
          // unhandled rejection while clearing optional runtime caches.
        });
    },
  };
};
