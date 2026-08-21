/**
 * crashForensics.js — R-14: the reproduction coordinates of the active world.
 *
 * Determinism makes every crash locally reproducible from four small values:
 * seed + tick + flags_on + build hash. This helper reads the first three off the
 * live store state (the build hash is `import.meta.env.VITE_RELEASE`, captured by
 * errorReporter directly). It reads ONLY scalars — a seed string, a tick integer,
 * flag names — never a settlement, an NPC, a save, or anything user-authored: the
 * prop-hygiene law holds at the forensics boundary too. errorReporter whitelists
 * the result again (belt and suspenders), so even a future edit here that returned
 * more could not leak it.
 *
 * Registered at store boot via setCrashForensics(() => buildCrashForensics(getState())).
 * Pure + total: never throws (errorReporter must never be able to fail from here).
 */

// Import from the LEAN resolution core, not lib/flags.js: this keeps the
// ~4.5 KB flag-description registry OUT of the eager crash-forensics closure
// while flags_on stays synchronously readable at crash time (R-14 contract).
import { getAllFlags } from './flagRegistry.js';

/**
 * The active campaign, if any — read defensively (the store shape is owned
 * elsewhere; this must survive a partially-initialized or foreign state).
 * @param {any} state
 * @returns {any}
 */
function activeCampaign(state) {
  const id = state?.activeCampaignId;
  if (id == null) return null;
  const list = Array.isArray(state?.campaigns) ? state.campaigns : [];
  return list.find((c) => c && c.id === id) || null;
}

/**
 * Build the world-reproduction coordinates from the store state.
 *   • seed  — the sim replay seed (campaign worldState.rngSeed), falling back to
 *             the last settlement-generation seed, then the campaign map seed.
 *   • tick  — the active campaign's world clock (absent outside a campaign).
 *   • flags_on — the sorted names of every flag currently resolved ON.
 * @param {any} state
 * @returns {{ seed: (string|number|null), tick: (number|null), flags_on: string[] }}
 */
export function buildCrashForensics(state) {
  /** @type {string|number|null} */
  let seed = null;
  /** @type {number|null} */
  let tick = null;
  try {
    const c = activeCampaign(state);
    const ws = c && typeof c.worldState === 'object' ? c.worldState : null;
    /** @type {unknown} */
    let candidate = null;
    if (ws && ws.rngSeed != null) candidate = ws.rngSeed;
    else if (state && state.lastSeed != null) candidate = state.lastSeed;
    else if (c && c.map && c.map.seed != null) candidate = c.map.seed;
    if (typeof candidate === 'string' || typeof candidate === 'number') seed = candidate;
    if (ws && typeof ws.tick === 'number' && Number.isFinite(ws.tick)) tick = ws.tick;
  } catch { /* forensics is best-effort; never throw into the error reporter */ }

  let flags_on = [];
  try {
    const all = getAllFlags();
    flags_on = Object.keys(all).filter((name) => all[name] === true).sort();
  } catch { /* flag read is best-effort */ }

  return { seed, tick, flags_on };
}
