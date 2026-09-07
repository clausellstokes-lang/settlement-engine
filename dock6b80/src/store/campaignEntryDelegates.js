import {
  campaignRuntimeActionsFor,
  preloadCampaignRuntime,
  requireCampaignRuntimeAction,
} from './campaignRuntimeBridge.js';

const ownerOf = state => String(state?.auth?.user?.id || 'anon');

function captureSession(state) {
  return {
    ownerId: ownerOf(state),
    generation: Number(state?.campaignSessionGeneration) || 0,
  };
}

function sessionIsCurrent(state, session) {
  return ownerOf(state) === session.ownerId
    && (Number(state?.campaignSessionGeneration) || 0) === session.generation;
}

/** A stable, synchronous delegate. Route preloading is responsible for readiness. */
export const campaignActionDelegate = (get, actionName) => (...args) => (
  requireCampaignRuntimeAction(get, actionName)(...args)
);

/**
 * loadCampaigns is the one legitimate cold action: App invokes it from the auth
 * effect. Fence the owner before importing so a sign-out cannot hydrate stale
 * rows while the runtime chunk is in flight.
 */
export const campaignLoadDelegate = (
  set,
  get,
  preload = preloadCampaignRuntime,
) => {
  let inFlight = null;
  return (...args) => {
    const session = captureSession(get());
    if (
      inFlight
      && inFlight.session.ownerId === session.ownerId
      && inFlight.session.generation === session.generation
    ) return inFlight.promise;

    const promise = preload(set, get)
      .then(actions => {
        if (!sessionIsCurrent(get(), session)) return get().campaigns;
        return actions.loadCampaigns(...args);
      })
      .catch(error => {
        // App intentionally fire-and-forgets this Promise. A chunk transport
        // failure must therefore resolve to the current safe cache, exactly as
        // the implementation body's hydration/network failures do. The bridge
        // already cleared its rejected record, so a later call remains retryable.
        if (sessionIsCurrent(get(), session)) {
          console.warn('[campaignSlice] campaign runtime load failed', error);
        }
        return get().campaigns;
      });
    inFlight = { promise, session };
    promise.then(() => {
      if (inFlight?.promise === promise) inFlight = null;
    });
    return promise;
  };
};

export function readyCampaignAction(get, actionName) {
  const action = campaignRuntimeActionsFor(get)?.[actionName];
  return typeof action === 'function' ? action : null;
}
