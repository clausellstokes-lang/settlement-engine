/**
 * instantWorldSlice — the thin store seam for one-click Instant World generation
 * (W-R2 INSTANT WORLD). Mirrors the campaignSpatialCanonize slice: this action is
 * a single dynamic import of the lazy body, so the composer + region graph +
 * settlement generator it pulls never enter the first-paint entry closure
 * (zero-eager pin).
 *
 * TIER-BLIND by design: the premium gate wraps the interface entry (the Instant
 * World card), not this action — tier never reaches the composer. In-flight guard
 * only, so a double-click can't mint two realms from one intent.
 */
import { preloadCampaignRuntime } from './campaignRuntimeBridge.js';
import {
  captureCampaignSession,
  isCurrentCampaignSession,
} from './campaignSliceShared.js';

const authChangedBeforeCommit = () => ({
  ok: false,
  reason: 'auth_session_changed',
  message: 'Your account changed before any realm settlements were created.',
});
const loadInstantWorldBody = () => import('./instantWorldBody.js');

async function runInstantWorldAction({
  set,
  get,
  preloadRuntime,
  loadBody,
}, basicConfig = {}, options = {}) {
  if (get().instantWorldBusy) return { ok: false, reason: 'in_flight' };
  const session = captureCampaignSession(get());
  set(state => { state.instantWorldBusy = true; });
  try {
    // Every path (including the global Surveyor) crosses this boundary before
    // runInstantWorld can persist a member. The post-await fence prevents an
    // intent begun under account A from being re-authorized under account B.
    await preloadRuntime(set, get);
    if (!isCurrentCampaignSession(get(), session)) return authChangedBeforeCommit();
    const { runInstantWorld } = await loadBody();
    if (!isCurrentCampaignSession(get(), session)) return authChangedBeforeCommit();
    return await runInstantWorld({
      set,
      get,
      basicConfig,
      options,
      expectedSession: session,
    });
  } catch {
    return { ok: false, reason: 'error' };
  } finally {
    set(state => { state.instantWorldBusy = false; });
  }
}

export const createInstantWorldSlice = (set, get) => ({
  /** True while a compose+persist is running (drives the card's busy state). */
  instantWorldBusy: false,

  /**
   * Compose a staged realm from the four basic knobs and land the user in it.
   * `magic` ('yes' | 'no', MG-1) is the pre-generation question's answer; it is
   * projected into every member's config at mint, never consulted afterwards.
   * @param {{ realmSize?:string, tone?:string, mapKind?:string, magic?:string }} [basicConfig]
   * @param {{ seed?:string, name?:string }} [options]
   * @returns {Promise<{ ok:boolean, reason?:string, campaignId?:string, seed?:string, settlementCount?:number }>}
   */
  instantWorld: (basicConfig = {}, options = {}) => runInstantWorldAction({
    set,
    get,
    preloadRuntime: preloadCampaignRuntime,
    loadBody: loadInstantWorldBody,
  }, basicConfig, options),
});

/** Dependency-injected constructor for preflight ordering/failure tests. */
export function createInstantWorldSliceWithDependencies(set, get, dependencies) {
  return {
    instantWorldBusy: false,
    instantWorld: (basicConfig = {}, options = {}) => runInstantWorldAction({
      set,
      get,
      preloadRuntime: dependencies.preloadRuntime,
      loadBody: dependencies.loadBody,
    }, basicConfig, options),
  };
}
