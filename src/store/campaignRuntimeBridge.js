/**
 * Retryable, per-store bridge between eager campaign delegates and the cold
 * campaign runtime. A runtime is installed only after all three slice factories
 * have completed, preserving a single atomic public action boundary.
 */

const loadProductionRuntime = () => import('./campaignRuntime.js');

export class CampaignRuntimeNotReadyError extends Error {
  constructor(actionName) {
    super(
      `Campaign runtime action "${actionName}" was called before its view preload completed`,
    );
    this.name = 'CampaignRuntimeNotReadyError';
    this.actionName = actionName;
  }
}

/**
 * Factory exported for deterministic bridge tests. Production uses the singleton
 * below; each store remains isolated by its get-function identity.
 */
export function createCampaignRuntimeBridge(loadRuntime = loadProductionRuntime) {
  const records = new WeakMap();

  function recordFor(set, get) {
    let record = records.get(get);
    if (!record) {
      record = { set, promise: null, actions: null };
      records.set(get, record);
    } else if (record.set !== set) {
      throw new Error('Campaign runtime store registered with a different set function');
    }
    return record;
  }

  function actionsFor(get) {
    return records.get(get)?.actions || null;
  }

  function requireAction(get, actionName) {
    const action = actionsFor(get)?.[actionName];
    if (typeof action !== 'function') throw new CampaignRuntimeNotReadyError(actionName);
    return action;
  }

  function preload(set, get) {
    const record = recordFor(set, get);
    if (record.actions) return Promise.resolve(record.actions);
    if (record.promise) return record.promise;

    let runtimeLoad;
    try {
      runtimeLoad = loadRuntime();
    } catch (error) {
      return Promise.reject(error);
    }
    record.promise = Promise.resolve(runtimeLoad)
      .then(runtimeModule => ({
        runtimeModule,
        runtime: runtimeModule.createCampaignRuntimeActions(set, get),
      }))
      .then(({ runtimeModule, runtime }) => {
        if (
          runtime?.sentinel !== runtimeModule.CAMPAIGN_RUNTIME_LAZY_SENTINEL
          || runtime?.bodySentinels !== runtimeModule.CAMPAIGN_RUNTIME_BODY_SENTINELS
          || !runtime.actions
          || typeof runtime.actions !== 'object'
        ) {
          throw new Error('Campaign runtime capsule failed its installation contract');
        }
        record.actions = runtime.actions;
        if (runtime.outboxStatus) {
          set(state => { state.outboxStatus = runtime.outboxStatus; });
        }
        return record.actions;
      })
      .catch(error => {
        record.actions = null;
        record.promise = null;
        throw error;
      });
    return record.promise;
  }

  return Object.freeze({ actionsFor, preload, requireAction });
}

const campaignRuntimeBridge = createCampaignRuntimeBridge();

export const campaignRuntimeActionsFor = get => campaignRuntimeBridge.actionsFor(get);

export const preloadCampaignRuntime = (set, get) => campaignRuntimeBridge.preload(set, get);

export const requireCampaignRuntimeAction = (get, actionName) => (
  campaignRuntimeBridge.requireAction(get, actionName)
);

/** Preload through a Zustand store API before resolving a campaign-capable view. */
export const preloadCampaignRuntimeForStore = store => (
  preloadCampaignRuntime(store.setState, store.getState)
);
