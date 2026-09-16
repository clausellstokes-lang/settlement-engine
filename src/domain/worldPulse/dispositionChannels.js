/**
 * dispositionChannels.js — WR-2 pulse orchestration outside the frozen kernel.
 *
 * The ledger remains the sole state writer. This leaf only joins already-resolved
 * outcome deltas, the late treaty verdict, and the transition-only news composer.
 */

import { advanceDispositionChannels, coalesceDispositionTransitions } from './dispositionLedger.js';
import { collectDispositionChannelDeltas, collectDispositionDeltas } from './dispositionDeltas.js';
import { dispositionTransitionNewsEntries } from './dispositionNews.js';
import { advanceTreaties } from './peaceTerms.js';

/** @typedef {{kind:'band_crossing'|'reversal',id:string,channel:string,fromBand:string,toBand:string,
 * fromStock01:number,toStock01:number,direction:'up'|'down',source:'decay'|'outcome'|'mixed',
 * sourceKinds:string[],sourceEventIds:string[],outcomeKinds:string[],tick:number}} DispositionTransition */

/** @param {Record<string, unknown>} worldState */
function hasDispositionState(worldState) {
  const stats = worldState?.dispositionStats;
  return Boolean(stats && typeof stats === 'object' && Object.keys(stats).length > 0);
}

/**
 * Keep the legacy collector byte-exact while mapping lit outcome producers onto
 * their authored channels.
 */
export function collectPulseDispositionDeltas(war, tradeWar, occupation, enabled) {
  return enabled === true
    ? collectDispositionChannelDeltas(war, tradeWar, occupation)
    : [...collectDispositionDeltas(war, tradeWar), ...(occupation?.dispositionDeltas || [])];
}

/**
 * @param {Record<string, unknown>} worldState
 * @param {Array<Record<string, unknown>>} deltas
 * @param {{enabled?:boolean,tick?:number,transitions?:DispositionTransition[]}} options
 */
export function advancePulseDisposition(worldState, deltas, options = {}) {
  const prior = Array.isArray(options.transitions) ? options.transitions : [];
  if (!deltas.length && !(options.enabled === true && hasDispositionState(worldState))) {
    return { worldState, transitions: prior };
  }
  const advanced = advanceDispositionChannels(
    /** @type {Record<string, any>} */ (worldState.dispositionStats || {}),
    /** @type {Array<any>} */ (deltas),
    { enabled: options.enabled === true, tick: options.tick },
  );
  return {
    worldState: { ...worldState, dispositionStats: advanced.ledger },
    transitions: coalesceDispositionTransitions([...prior, ...advanced.transitions]),
  };
}

/**
 * The treaty mover resolves after the kernel's early outcome fold. Compose the
 * late diplomatic lesson through the same writer, then narrate the complete set
 * of this tick's transitions exactly once at the treaty seam.
 *
 * @param {Parameters<typeof advanceTreaties>[0] & { dispositionEnabled?:boolean,
 *   dispositionTransitions?:DispositionTransition[] }} args
 */
export function advanceTreatiesWithDisposition(args) {
  const treaty = advanceTreaties(args);
  const baseState = treaty.changed ? treaty.worldState : args.worldState;
  const folded = advancePulseDisposition(
    baseState,
    Array.isArray(treaty.dispositionDeltas) ? treaty.dispositionDeltas : [],
    {
      enabled: args.dispositionEnabled === true,
      tick: args.tick,
      transitions: args.dispositionTransitions,
    },
  );
  const dispositionNews = args.dispositionEnabled === true
    ? dispositionTransitionNewsEntries({
      transitions: folded.transitions,
      snapshot: /** @type {{byId?:Map<string, Record<string, unknown>>}} */ (args.snapshot),
      worldState: folded.worldState,
      now: typeof args.now === 'string' ? args.now : null,
    })
    : [];
  return {
    ...treaty,
    changed: treaty.changed || folded.worldState !== baseState || dispositionNews.length > 0,
    worldState: folded.worldState,
    newsEntries: [...(treaty.newsEntries || []), ...dispositionNews],
  };
}
