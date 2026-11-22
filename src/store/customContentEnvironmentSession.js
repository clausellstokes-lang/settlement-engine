/**
 * Standalone custom-content environment lifecycle for the Zustand store.
 *
 * This session owns preview, activation, rollback, hydration, and exact
 * historical resolution. The main slice continues to own editable definitions;
 * separating the two makes the critical distinction between moving authoring
 * heads and the immutable runtime environment visible in the module structure.
 */

import { customContentService } from '../lib/customContent.js';
import {
  CONTENT_ENVIRONMENT_SCHEMA_VERSION,
  VANILLA_CONTENT_ENVIRONMENT,
  VANILLA_ENVIRONMENT_REVISION_ID,
} from '../domain/content/contentEnvironmentDefaults.js';

const environmentResolutionCache = new Map();
/** @type {Promise<typeof import('../domain/content/contentEnvironment.js')>|null} */
let environmentDomainPromise = null;

function loadEnvironmentDomain() {
  if (!environmentDomainPromise) {
    environmentDomainPromise = import(
      '../domain/content/contentEnvironment.js'
    );
  }
  return environmentDomainPromise;
}

function ownerIdFromState(state) {
  return state?.auth?.user?.id ? String(state.auth.user.id) : 'anon';
}

/**
 * Exact environment snapshots are immutable, so successful resolutions may be
 * cached by owner and environment hash. Failures are deliberately not cached:
 * an unavailable remote snapshot may become available after a retry.
 *
 * @param {any} state
 * @param {any} environment
 */
export async function resolveContentEnvironmentForState(state, environment) {
  if (typeof customContentService.resolveContentEnvironment !== 'function') {
    return {
      ok: false,
      reason: 'content_environment_resolver_unavailable',
    };
  }
  const ownerId = ownerIdFromState(state);
  const environmentHash = String(environment?.environmentHash || '');
  const cacheKey = `${ownerId}\u0000${environmentHash}`;
  if (environmentHash && environmentResolutionCache.has(cacheKey)) {
    return environmentResolutionCache.get(cacheKey);
  }
  const resolution = await customContentService.resolveContentEnvironment(
    environment,
    { ownerId },
  );
  if (resolution?.ok === true && environmentHash) {
    environmentResolutionCache.set(cacheKey, resolution);
  }
  return resolution;
}

export function clearContentEnvironmentResolutionCache() {
  environmentResolutionCache.clear();
}

/**
 * @param {{
 *   set:(recipe:(state:any)=>void)=>void,
 *   get:()=>any,
 *   emptyContent:Record<string, unknown[]>,
 *   makeFailure:(reason:string, status?:string)=>Readonly<Record<string, any>>,
 * }} options
 */
export function createCustomContentEnvironmentActions({
  set,
  get,
  emptyContent,
  makeFailure,
}) {
  return {
    /**
     * Runtime input consumed by standalone generation.
     *
     * Admission and exact revision resolution happen before these fields enter
     * state. This synchronous read therefore projects the already-reviewed
     * snapshot without pulling the environment compiler into first paint.
     */
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
          ? { ...emptyContent }
          : state.activeContentEnvironmentContent || { ...emptyContent },
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

    /**
     * Read the exact installed pack pointer and affected definition heads used
     * by import preview CAS. Apply still rechecks every value transactionally.
     */
    getInstalledContentPackState: async packId => (
      customContentService.loadContentPackState(packId, {
        ownerId: ownerIdFromState(get()),
      })
    ),

    /** Build the deterministic diff and exact command fingerprint before apply. */
    previewCustomContentEnvironmentMigration: async nextEnvironment => {
      const {
        admitContentEnvironmentRevision,
        diffContentEnvironmentRevisions,
      } = await loadEnvironmentDomain();
      const admission = admitContentEnvironmentRevision(nextEnvironment);
      if (admission.ok === false) {
        return {
          ok: false,
          reason: admission.message || admission.reason,
          changes: [],
          previewFingerprint: null,
        };
      }
      let resolution;
      try {
        resolution = await resolveContentEnvironmentForState(
          get(),
          admission.environment,
        );
      } catch (error) {
        return {
          ok: false,
          reason: error instanceof Error
            ? error.message
            : 'content_environment_resolution_unavailable',
          changes: [],
          previewFingerprint: null,
        };
      }
      if (resolution?.ok !== true) {
        return {
          ok: false,
          reason: resolution?.reason
            || 'content_environment_resolution_failed',
          changes: [],
          previewFingerprint: null,
        };
      }
      const { previewCustomContentCommand } = await import(
        '../domain/content/customContentCommands.js'
      );
      const preview = previewCustomContentCommand({
        kind: 'content.environment.migrate',
        environment: admission.environment,
        expectedActiveEnvironmentRevisionId:
          get().activeContentEnvironment?.environmentRevisionId
          || VANILLA_ENVIRONMENT_REVISION_ID,
        entries: [],
      });
      return {
        ok: true,
        environment: admission.environment,
        changes: diffContentEnvironmentRevisions(
          get().activeContentEnvironment,
          admission.environment,
        ),
        previewFingerprint: preview.fingerprint,
        expectedActiveEnvironmentRevisionId:
          preview.plan.expectedActiveEnvironmentRevisionId,
        resolvedDefinitionCount: Object.values(
          resolution.customContent || {},
        ).reduce((total, items) => (
          total + (Array.isArray(items) ? items.length : 0)
        ), 0),
        plan: preview.plan,
      };
    },

    /** Activate one reviewed immutable environment revision durably. */
    migrateCustomContentEnvironment: async (nextEnvironment, options = {}) => {
      const preview = await get()
        .previewCustomContentEnvironmentMigration(nextEnvironment);
      if (!preview.ok) return makeFailure(preview.reason);
      if (
        options.previewFingerprint
        && options.previewFingerprint !== preview.previewFingerprint
      ) {
        return makeFailure('content_environment_preview_stale', 'stale');
      }
      return get().applyCustomContentCommand({
        kind: 'content.environment.migrate',
        environment: preview.environment,
        expectedActiveEnvironmentRevisionId:
          preview.expectedActiveEnvironmentRevisionId,
        previewFingerprint: preview.previewFingerprint,
        source: {
          type: options.sourceType || 'manual',
          ref: preview.environment.environmentRevisionId,
        },
      });
    },

    /** Vanilla is an explicit activation, not an ad-hoc state wipe. */
    resetCustomContentEnvironmentToVanilla: (options = {}) => (
      get().migrateCustomContentEnvironment(
        VANILLA_CONTENT_ENVIRONMENT,
        options,
      )
    ),

    /**
     * Roll back by re-activating an immutable prior revision. No environment
     * row is mutated or discarded.
     */
    rollbackCustomContentEnvironment: async (
      environmentRevisionId,
      options = {},
    ) => {
      let history = get().customContentEnvironmentHistory || [];
      let target = history.find(environment => (
        environment.environmentRevisionId === environmentRevisionId
      ));
      if (!target) {
        history = await customContentService.listContentEnvironmentRevisions({
          ownerId: ownerIdFromState(get()),
        });
        set(state => {
          state.customContentEnvironmentHistory = history;
        });
        target = history.find(environment => (
          environment.environmentRevisionId === environmentRevisionId
        ));
      }
      if (!target) {
        return makeFailure(
          'content_environment_revision_unavailable',
          'stale',
        );
      }
      return get().migrateCustomContentEnvironment(target, options);
    },

    /** Hydrate environment history and the durable active pointer. */
    loadCustomContentEnvironments: async () => {
      const ownerId = ownerIdFromState(get());
      try {
        const {
          admitContentEnvironmentRevision,
        } = await loadEnvironmentDomain();
        const [history, active] = await Promise.all([
          customContentService.listContentEnvironmentRevisions({ ownerId }),
          customContentService.loadActiveContentEnvironment({ ownerId }),
        ]);
        if (ownerIdFromState(get()) !== ownerId) return [];
        const admitted = admitContentEnvironmentRevision(
          active || VANILLA_CONTENT_ENVIRONMENT,
        );
        if (admitted.ok === false) {
          throw Object.assign(
            new Error(
              admitted.message
              || admitted.reason
              || 'Active content environment failed admission.',
            ),
            { code: admitted.reason || 'content_environment_invalid' },
          );
        }
        const admittedHistory = (Array.isArray(history) ? history : [])
          .flatMap(environment => {
            const candidate = admitContentEnvironmentRevision(environment);
            return candidate.ok ? [candidate.environment] : [];
          });
        const resolution = await resolveContentEnvironmentForState(
          get(),
          admitted.environment,
        );
        if (resolution?.ok !== true) {
          throw Object.assign(
            new Error(
              resolution?.message
              || resolution?.reason
              || 'Active content environment could not be resolved.',
            ),
            {
              code: resolution?.reason
                || 'content_environment_resolution_failed',
            },
          );
        }
        set(state => {
          state.customContentEnvironmentHistory = admittedHistory;
          state.activeContentEnvironment = admitted.environment;
          state.activeContentEnvironmentContent =
            resolution.customContent || { ...emptyContent };
          state.customContentEnvironmentHydrated = true;
          state.customContentEnvironmentError = null;
        });
        return admittedHistory;
      } catch (error) {
        if (ownerIdFromState(get()) === ownerId) {
          set(state => {
            state.customContentEnvironmentHydrated = false;
            state.customContentEnvironmentError = error instanceof Error
              ? error.message
              : 'Content environment hydration failed.';
          });
        }
        throw error;
      }
    },
  };
}
