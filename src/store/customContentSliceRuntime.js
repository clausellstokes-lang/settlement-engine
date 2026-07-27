/**
 * customContentSliceRuntime — Deferred custom-content orchestration.
 *
 * Owns the active and archived author-library projections while immutable
 * definitions, revisions, packs, and environments remain authoritative in the
 * selected persistence ledger.
 *
 * This module coordinates manifest admission, owner-scoped hydration, the
 * application-command boundary, environment projection, and compatibility
 * mirrors. It never projects a mutation merely because a writer was invoked:
 * only an explicit applied receipt from a confirmed authority may update the
 * visible library. Older local snapshots are migration input and an offline
 * mirror, not a second mutable source of truth.
 */

import { customContentService } from '../lib/customContent.js';
import {
  createCustomContentArchiveActions,
} from './customContentArchiveActions.js';
import { migrateCustomContent } from '../domain/customContentMigrations.js';
import { invalidateCustomDepsIfLoaded } from '../lib/customContentSource.js';
import {
  clearContentEnvironmentResolutionCache,
  createCustomContentEnvironmentActions,
  resolveContentEnvironmentForState,
} from './customContentEnvironmentSession.js';
import {
  createReviewedSupplyChainActions,
} from './customContentReviewedSupplyChainActions.js';

// ── Canonical validation chokepoint ──────────────────────────────────────────
// The generated manifest adapter loads only when a write reaches this boundary.
// Every category therefore receives the same admission rules without pulling
// the vocabulary graph into first paint. Version metadata is stripped before
// admission, and only the manifest-clean definition may proceed.
async function admissionFor(category, item) {
  const [
    { admitCustomContentDefinitionShape },
    { authoredDataOf },
  ] = await Promise.all([
    import('../domain/content/customContentAdmission.js'),
    import('../domain/content/customContentVersioning.js'),
  ]);
  let authored;
  try {
    authored = authoredDataOf(item);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Invalid custom content.',
    };
  }
  const admission = admitCustomContentDefinitionShape(category, authored, {
    allowSystemFields: true,
  });
  if (admission.ok) return { ok: true, definition: admission.definition };
  const error = admission.errors.map(entry => (
    entry.field
      ? `${entry.field}: ${entry.code}`
      : entry.code
  )).join(' ');
  return { ok: false, error };
}

const LOCAL_KEY = 'sf_custom_content';
const LOCAL_KEY_PREFIX = 'sf_custom_content:';

function scopedLocalKey(ownerId = 'anon') {
  const owner = String(ownerId || 'anon');
  if (owner === 'anon') return LOCAL_KEY;
  return `${LOCAL_KEY_PREFIX}${owner.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

function ownerIdFromState(state) {
  return state?.auth?.user?.id ? String(state.auth.user.id) : 'anon';
}

function localLoad(ownerId = 'anon') {
  try {
    return JSON.parse(localStorage.getItem(scopedLocalKey(ownerId)) || '{}');
  } catch { return {}; }
}

function localWrite(content, ownerId = 'anon') {
  localStorage.setItem(scopedLocalKey(ownerId), JSON.stringify(content));
}

const EMPTY = {
  institutions: [],
  services: [],
  resources: [],
  stressors: [],
  tradeGoods: [],
  deities: [],
  factions: [],
  traditions: [],
  supplyChains: [],
  tradeRoutes: [],
  powerPresets: [],
  defensePresets: [],
};

/**
 * Ensure every item in a category bucket has a stable `localUid`. Mutates
 * in place. Called when hydrating from local or cloud so older rows get a
 * deterministic ref id derived from their existing `id`.
 */
function backfillLocalUids(grouped, options = {}) {
  if (!grouped || typeof grouped !== 'object') return grouped;
  for (const cat of Object.keys(grouped)) {
    if (cat === 'supplyChains' && options.allowReviewed !== true) {
      // A flat compatibility mirror has no immutable command provenance. Only
      // an authoritative ledger/service projection may hydrate reviewed data.
      grouped[cat] = [];
      continue;
    }
    const arr = grouped[cat];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (item && !item.localUid) {
        // Derive from id when present so the same row gets the same uid on
        // subsequent loads. Prefix with `bf_` to distinguish from fresh uids.
        item.localUid = item.id ? `bf_${item.id}` : `lu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      }
    }
  }
  return grouped;
}

/**
 * Stable uid that survives Supabase round-trip.
 *
 * The Supabase row's `id` column is rewritten from a local string to a cloud
 * UUID after `add()` resolves — that breaks any dependency reference stored
 * by `id`. `localUid` lives inside the JSONB body, so it stays put. Used by
 * the customRegistry resolver as the canonical reference for custom items.
 */
function makeLocalUid() {
  return `lu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function makeDefinitionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const local = makeLocalUid().replace(/^lu_/, '');
  return `local-definition:${local}`;
}

function commandFailure(reason, status = 'failed') {
  return Object.freeze({
    ok: false,
    status,
    commandId: null,
    reason,
    persistence: Object.freeze({ state: 'not-required' }),
    result: null,
    perEntry: Object.freeze([]),
  });
}

function createDeferredEnvironmentActions(set, get) {
  const {
    getActiveCustomContentRuntime,
    ...deferredActions
  } = createCustomContentEnvironmentActions({
    set,
    get,
    emptyContent: EMPTY,
    makeFailure: commandFailure,
  });
  if (typeof getActiveCustomContentRuntime !== 'function') {
    throw new Error('Custom-content environment runtime read is unavailable.');
  }
  return deferredActions;
}

export const createCustomContentRuntimeActions = (set, get) => {
  return {
  // ── Generic CRUD ──────────────────────────────────────────────────────────
  // Compatibility wrappers below await this command boundary. Local projection
  // changes only after the durable RPC/local-ledger receipt says `applied`.

  /**
   * Execute one reviewed custom-content mutation through the application command
   * boundary and migration-185 RPC/local immutable ledger.
   *
   * @param {{
   *   kind?:string,
   *   entries?:Array<{category:string,item?:object,data?:object,
   *     definitionId?:string|null,expectedHeadRevisionId?:string|null,
   *     packEntryId?:string|null}>,
   *   source?:{type?:string,ref?:string|null,pack?:object|null},
   *   previewFingerprint?:string|null,
   *   expected?:object,
   *   definitionId?:string|null,
   *   environment?:object|null,
   *   expectedActiveEnvironmentRevisionId?:string|null,
   * }} request
   */
  applyCustomContentCommand: async (request = {}) => {
    const source = request.source || { type: 'manual' };
    const kind = String(request.kind || '');
    const rawEntries = Array.isArray(request.entries) ? request.entries : [];
    const entries = [];
    const lifecycleHead = (
      kind === 'content.definition.archive'
      || kind === 'content.definition.restore'
    )
      ? Object.values(get().customContent || {})
        .flat()
        .find(item => String(item?.definitionId || item?.id)
          === String(request.definitionId))
        || Object.values(get().customContentArchived || {})
          .flat()
          .find(item => String(item?.definitionId || item?.id)
            === String(request.definitionId))
        || null
      : null;
    for (const entry of rawEntries) {
      const category = String(entry?.category || '');
      const data = entry?.data || entry?.item || {};
      const admission = await admissionFor(category, data);
      if (!admission.ok) {
        const receipt = commandFailure(admission.error);
        set(state => {
          state.customContentError = admission.error;
          state.customContentLastCommandReceipt = receipt;
        });
        return receipt;
      }
      // Single-kind since content.definition.mass-update retired (R-5b #6);
      // create-revision carries every multi-entry batch.
      const needsDefinitionId = kind === 'content.definition.create-revision';
      entries.push({
        definitionId: entry.definitionId
          || (needsDefinitionId ? makeDefinitionId() : null),
        expectedHeadRevisionId: entry.expectedHeadRevisionId || null,
        packEntryId: entry.packEntryId || null,
        category,
        data: admission.definition,
      });
    }

    const [
      { previewCustomContentCommand },
      { customContentCommand },
      { executeSessionCommand },
    ] = await Promise.all([
      import('../domain/content/customContentCommands.js'),
      import('../application/commands/adapters/customContentApply.js'),
      import('../application/commands/sessionCommandRuntime.js'),
    ]);

    let preview;
    try {
      preview = previewCustomContentCommand({
        kind,
        definitionId: request.definitionId || null,
        expectedHeadRevisionId: request.expected?.headRevisionId
          || request.expected?.revision
          || null,
        expectedActiveEnvironmentRevisionId:
          request.expectedActiveEnvironmentRevisionId || null,
        pack: source.pack || null,
        environment: request.environment || null,
        entries,
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Invalid content command.';
      const receipt = commandFailure(reason);
      set(state => {
        state.customContentError = reason;
        state.customContentLastCommandReceipt = receipt;
      });
      return receipt;
    }
    if (
      request.previewFingerprint
      && request.previewFingerprint !== preview.fingerprint
    ) {
      const receipt = commandFailure(
        'The reviewed content preview is stale.',
        'stale',
      );
      set(state => {
        state.customContentError = receipt.reason;
        state.customContentLastCommandReceipt = receipt;
      });
      return receipt;
    }

    let resolvedEnvironment = null;
    if (kind === 'content.environment.migrate') {
      try {
        resolvedEnvironment = await resolveContentEnvironmentForState(
          get(),
          preview.plan.environment,
        );
      } catch (error) {
        resolvedEnvironment = {
          ok: false,
          reason: error instanceof Error
            ? error.message
            : 'content_environment_resolution_unavailable',
        };
      }
      if (!resolvedEnvironment?.ok) {
        const failure = commandFailure(
          resolvedEnvironment?.reason
            || 'content_environment_resolution_failed',
          'stale',
        );
        set(state => {
          state.customContentEnvironmentError = resolvedEnvironment?.message
            || failure.reason;
          state.customContentLastCommandReceipt = failure;
        });
        return failure;
      }
    }

    const ownerId = ownerIdFromState(get());
    const accountId = customContentService.isConfigured && ownerId !== 'anon'
      ? ownerId
      : null;
    const command = customContentCommand(preview, {
      ...(accountId ? { accountId } : { ownerKey: ownerId }),
      source,
      expected: request.expected || {},
    });
    /** @type {any} */
    let writerReceipt = null;
    const receipt = await executeSessionCommand(command, {
      ...(accountId ? { ownerId } : { ownerKey: ownerId }),
      sourceFingerprint: preview.fingerprint,
      revision: request.expected?.revision || null,
      journalScope: get,
      actions: {
        applyCustomContentCommand: async () => {
          writerReceipt = await customContentService.executeCommand(preview, {
            commandId: command.commandId,
            ownerId,
          });
          return writerReceipt;
        },
      },
    });
    const result = writerReceipt?.result || receipt.result || null;
    const perEntry = writerReceipt?.perEntry
      || result?.perEntry
      || [];
    const publicReceipt = Object.freeze({
      ...receipt,
      persistence: Object.freeze({ ...(receipt.persistence || {}) }),
      result,
      perEntry: Object.freeze([...perEntry]),
    });

    if (
      publicReceipt.ok === true
      && publicReceipt.status === 'applied'
      && publicReceipt.persistence?.state === 'confirmed'
    ) {
      set(state => {
        if (kind === 'content.definition.archive') {
          for (const category of Object.keys(state.customContent)) {
            if (!Array.isArray(state.customContent[category])) continue;
            state.customContent[category] = state.customContent[category]
              .filter(item => String(item.definitionId || item.id)
                !== String(request.definitionId));
          }
          const archived = result?.archivedItems?.[0] || (
            lifecycleHead
              ? {
                  ...lifecycleHead,
                  archivedAt: new Date().toISOString(),
                }
              : null
          );
          const category = perEntry[0]?.category;
          if (archived && category) {
            const bucket = state.customContentArchived[category] || [];
            state.customContentArchived[category] = [
              archived,
              ...bucket.filter(item => String(item.definitionId || item.id)
                !== String(request.definitionId)),
            ];
          }
        } else if (kind === 'content.definition.restore') {
          for (const category of Object.keys(state.customContentArchived)) {
            state.customContentArchived[category] = (
              state.customContentArchived[category] || []
            ).filter(item => String(item.definitionId || item.id)
              !== String(request.definitionId));
          }
        } else if (
          kind === 'content.environment.migrate'
          && result?.environment
        ) {
          state.activeContentEnvironment = result.environment;
          state.activeContentEnvironmentContent =
            resolvedEnvironment?.customContent || { ...EMPTY };
          state.customContentEnvironmentHistory = [
            result.environment,
            ...state.customContentEnvironmentHistory.filter(environment => (
              environment.environmentRevisionId
              !== result.environment.environmentRevisionId
            )),
          ];
          state.customContentEnvironmentHydrated = true;
          state.customContentEnvironmentError = null;
        }
        for (const item of result?.items || []) {
          const entry = entries.find(candidate => (
            String(candidate.definitionId || '')
              === String(item.definitionId || item.id || '')
            || candidate.packEntryId
              === perEntry.find(row => (
                String(row.definitionId) === String(item.definitionId || item.id)
              ))?.packEntryId
          ));
          const category = entry?.category
            || perEntry.find(row => (
              String(row.definitionId) === String(item.definitionId || item.id)
            ))?.category;
          if (!category) continue;
          if (!Array.isArray(state.customContent[category])) {
            state.customContent[category] = [];
          }
          const index = state.customContent[category].findIndex(existing => (
            String(existing.definitionId || existing.id)
              === String(item.definitionId || item.id)
          ));
          const currentItem = index >= 0
            ? state.customContent[category][index]
            : null;
          if (
            kind === 'content.pack.import'
            && publicReceipt.replayed === true
            && currentItem?.revisionId
            && String(currentItem.revisionId) !== String(item.revisionId)
          ) {
            // Replaying an old immutable pack command must not visually rewind a
            // definition whose head advanced afterward. The ledger/database did
            // not mutate on replay, so retaining the current projection is the
            // only truthful client state.
            continue;
          }
          if (index >= 0) state.customContent[category][index] = item;
          else state.customContent[category].unshift(item);
        }
        localWrite(state.customContent, ownerIdFromState(state));
        state.customContentError = null;
        state.customContentLastCommandReceipt = publicReceipt;
      });
      invalidateCustomDepsIfLoaded();
    } else {
      set(state => {
        state.customContentError = publicReceipt.reason
          || 'Custom content was not applied.';
        state.customContentLastCommandReceipt = publicReceipt;
      });
    }
    return publicReceipt;
  },

  ...createReviewedSupplyChainActions({
    set,
    get,
    ownerIdFromState,
    localWrite,
    commandFailure,
  }),

  /**
   * Compatibility create wrapper. It now waits for the same durable command
   * receipt as bulk import and Surveyor; no optimistic success is reported.
   */
  addCustomItem: async (category, item) => {
    const receipt = await get().applyCustomContentCommand({
      kind: 'content.definition.create-revision',
      entries: [{ category, item }],
      source: { type: 'manual', ref: null },
    });
    return receipt.ok ? receipt.result?.items?.[0] : null;
  },

  /** Compatibility edit wrapper with exact expected-head compare-and-swap. */
  updateCustomItem: async (category, id, partial) => {
    const existing = (get().customContent[category] || [])
      .find(item => String(item.definitionId || item.id) === String(id));
    if (!existing) return null;
    const receipt = await get().applyCustomContentCommand({
      kind: 'content.definition.create-revision',
      entries: [{
        category,
        definitionId: existing.definitionId || existing.id,
        expectedHeadRevisionId: existing.revisionId || null,
        item: { ...existing, ...partial },
      }],
      source: { type: 'manual', ref: String(existing.definitionId || existing.id) },
      expected: { revision: existing.revisionId || null },
    });
    return receipt.ok ? receipt.result?.items?.[0] : null;
  },

  /**
   * Compatibility delete wrapper. "Delete" now means archive; the local active
   * projection changes only after archive persistence is confirmed.
   */
  deleteCustomItem: async (category, id) => {
    const existing = (get().customContent[category] || [])
      .find(item => String(item.definitionId || item.id) === String(id));
    if (!existing) {
      const admission = await admissionFor(category, { name: 'admission-probe' });
      return admission.ok
        ? commandFailure('definition_unavailable', 'stale')
        : commandFailure(admission.error);
    }
    return get().applyCustomContentCommand({
      kind: 'content.definition.archive',
      definitionId: existing.definitionId || existing.id,
      source: { type: 'manual', ref: String(existing.definitionId || existing.id) },
      expected: {
        revision: existing.revisionId || null,
        headRevisionId: existing.revisionId || null,
      },
    });
  },

  /** Restore an archived definition through the same expected-head command. */
  restoreCustomItem: (category, id, expectedHeadRevisionId = null) => (
    get().applyCustomContentCommand({
      kind: 'content.definition.restore',
      definitionId: id,
      source: { type: 'manual', ref: String(id) },
      expected: {
        revision: expectedHeadRevisionId,
        headRevisionId: expectedHeadRevisionId,
        category,
      },
    })
  ),

  /**
   * Read one definition's immutable history, newest first. History is kept
   * outside the active generator projection so inspection never changes play.
   */
  listCustomContentRevisions: async (definitionId) => {
    const ownerId = ownerIdFromState(get());
    const revisions = await customContentService
      .listCustomContentRevisions(definitionId, { ownerId });
    if (ownerIdFromState(get()) !== ownerId) return [];
    set(state => {
      state.customContentRevisionHistory[String(definitionId)] = revisions;
    });
    return revisions;
  },

  /**
   * Append a new head whose authored data matches a selected historical
   * revision. The old head is never moved or overwritten; rollback therefore
   * remains an auditable forward revision with normal expected-head CAS.
   */
  rollbackCustomItem: async (
    category,
    definitionId,
    targetRevisionId,
    expectedHeadRevisionId = null,
  ) => {
    const history = await get().listCustomContentRevisions(definitionId);
    const target = history.find(revision => (
      String(revision.id) === String(targetRevisionId)
    ));
    if (!target) return commandFailure('target_revision_unavailable', 'stale');
    const active = (get().customContent[category] || []).find(item => (
      String(item.definitionId || item.id) === String(definitionId)
    ));
    const currentHead = expectedHeadRevisionId
      || active?.revisionId
      || history.find(revision => revision.isHead)?.id
      || null;
    return get().applyCustomContentCommand({
      kind: 'content.definition.create-revision',
      entries: [{
        category,
        definitionId,
        expectedHeadRevisionId: currentHead,
        data: target.data,
      }],
      source: {
        type: 'manual',
        ref: `rollback:${definitionId}:${targetRevisionId}`,
      },
      expected: {
        revision: currentHead,
        headRevisionId: currentHead,
      },
    });
  },

  /** Load archived heads without reintroducing them into active generation. */
  loadArchivedCustomContent: async () => {
    const ownerId = ownerIdFromState(get());
    set(state => {
      state.customContentArchivedLoading = true;
      state.customContentError = null;
    });
    try {
      const archived = await customContentService.loadArchivedCustomContent({
        ownerId,
      });
      if (ownerIdFromState(get()) !== ownerId) return { ...EMPTY };
      const grouped = backfillLocalUids(migrateCustomContent({
        ...EMPTY,
        ...archived,
      }), { allowReviewed: true });
      set(state => {
        state.customContentArchived = grouped;
        state.customContentArchivedLoading = false;
      });
      return grouped;
    } catch (error) {
      if (ownerIdFromState(get()) === ownerId) {
        set(state => {
          state.customContentArchivedLoading = false;
          state.customContentError = error instanceof Error
            ? error.message
            : 'Archived custom content could not be loaded.';
        });
      }
      return { ...EMPTY };
    }
  },

  ...createDeferredEnvironmentActions(set, get),

  ...createCustomContentArchiveActions({
    set,
    get,
    emptyContent: EMPTY,
    normalizeGrouped: grouped => backfillLocalUids(
      migrateCustomContent({
        ...EMPTY,
        ...(grouped && typeof grouped === 'object' ? grouped : {}),
      }),
      { allowReviewed: true },
    ),
    ownerIdFromState,
    commandFailure,
  }),

  // ── Cloud sync ─────────────────────────────────────────────────────────────

  /**
   * Hydrate customContent from the cloud (premium / elevated only).
   * Call this after auth state resolves to a premium user.
   */
  loadCustomContentFromCloud: async () => {
    // The local authority used when Supabase is absent is still not "cloud
    // sync." Keep the entitlement check above both service implementations so
    // a grandfathered free owner can read their offline revisions without the
    // store falsely stamping those revisions as synchronized.
    if (!get().canUseCustomContent?.()) return;
    if (!customContentService.isConfigured) {
      const ownerId = ownerIdFromState(get());
      const grouped = await customContentService.list({ ownerId });
      if (ownerIdFromState(get()) !== ownerId) return;
      const merged = backfillLocalUids(migrateCustomContent({
        ...EMPTY,
        ...grouped,
      }), { allowReviewed: true });
      set(state => {
        state.customContent = merged;
        state.customContentError = null;
        state.customContentSyncedAt = new Date().toISOString();
      });
      localWrite(merged, ownerId);
      await get().loadCustomContentEnvironments();
      invalidateCustomDepsIfLoaded();
      return;
    }
    const ownerId = ownerIdFromState(get());
    set(state => { state.customContentLoading = true; state.customContentError = null; });
    try {
      const grouped = await customContentService.list();
      const merged = backfillLocalUids(
        migrateCustomContent({ ...EMPTY, ...grouped }),
        { allowReviewed: true },
      );
      if (ownerIdFromState(get()) !== ownerId) return;
      set(state => {
        state.customContent = merged;
        state.customContentLoading = false;
        state.customContentSyncedAt = new Date().toISOString();
      });
      let environmentHydrated = false;
      try {
        await get().loadCustomContentEnvironments();
        environmentHydrated = (
          ownerIdFromState(get()) === ownerId
          && get().customContentEnvironmentHydrated === true
        );
      } catch (error) {
        console.warn('content environment hydration failed:', error);
      }
      if (ownerIdFromState(get()) !== ownerId) return;
      if (environmentHydrated) {
        get().pinLegacyCampaignContentBindings?.(merged);
      }
      // Force the generator's custom-content registry to re-read. The registry
      // caches by a (count : latest-updatedAt) key, which can't detect a cloud
      // sync that swaps items WITHOUT changing the count or bumping the latest
      // updatedAt — the next generation would otherwise use a stale registry.
      // Via the seam (de-eager): a no-op while the lazy registry module hasn't
      // loaded — exact, because its FIRST build always reads the live source.
      invalidateCustomDepsIfLoaded();
      // Mirror to local for offline read-only access on this device
      localWrite(get().customContent, ownerId);
    } catch (err) {
      console.error('loadCustomContentFromCloud failed:', err);
      // Offline / cloud-unreachable: fall back to the owner-scoped local mirror
      // written on a prior successful sync, so a signed-in user keeps their
      // custom content offline instead of seeing nothing. Guard on the same
      // owner; show the stale-but-available content with no error.
      let restored = false;
      try {
        if (ownerIdFromState(get()) === ownerId) {
          const mirror = localLoad(ownerId);
          if (mirror && Object.keys(mirror).length > 0) {
            const merged = backfillLocalUids(migrateCustomContent({ ...EMPTY, ...mirror }));
            set(state => {
              state.customContent = merged;
              state.customContentLoading = false;
              state.customContentError = null;
            });
            let environmentHydrated = false;
            try {
              await get().loadCustomContentEnvironments();
              environmentHydrated = (
                ownerIdFromState(get()) === ownerId
                && get().customContentEnvironmentHydrated === true
              );
            } catch (environmentError) {
              console.warn(
                'content environment hydration failed during mirror restore:',
                environmentError,
              );
            }
            if (environmentHydrated) {
              get().pinLegacyCampaignContentBindings?.(merged);
            }
            // Same wholesale-replace stale-key concern as the cloud path above.
            invalidateCustomDepsIfLoaded();
            restored = true;
          }
        }
      } catch (mirrorErr) {
        console.warn('custom-content local mirror restore failed:', mirrorErr);
      }
      if (!restored) {
        set(state => {
          state.customContentLoading = false;
          state.customContentError = err.message;
        });
      }
    }
  },

  };
};

/**
 * One runtime action set per Zustand store.
 *
 * The public slice loads this module only when an asynchronous custom-content
 * operation begins. Caching the composed actions preserves stateful runtime
 * coordinators such as the archive cutover lock without making their code part
 * of first paint.
 *
 * @type {WeakMap<Function, ReturnType<typeof createCustomContentRuntimeActions>>}
 */
const runtimeActionsByStore = new WeakMap();

/**
 * Invoke one deferred action by its public store name.
 *
 * @param {string} actionName
 * @param {Function} set
 * @param {Function} get
 * @param {unknown[]} args
 * @returns {unknown}
 */
export function invokeCustomContentRuntimeAction(
  actionName,
  set,
  get,
  args,
) {
  let actions = runtimeActionsByStore.get(get);
  if (!actions) {
    actions = createCustomContentRuntimeActions(set, get);
    runtimeActionsByStore.set(get, actions);
  }
  const action = actions[actionName];
  if (typeof action !== 'function') {
    throw new Error(`Unknown custom-content runtime action: ${actionName}`);
  }
  return action(...args);
}

/** Clear memoized exact-environment resolutions after an account reset. */
export function clearCustomContentRuntimeCaches() {
  clearContentEnvironmentResolutionCache();
}
