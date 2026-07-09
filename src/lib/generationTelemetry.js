/**
 * generationTelemetry.js — the generation-id SPINE.
 *
 * One pseudonymous id per generation, threaded through the whole lifecycle so
 * analysis can reconstruct a single generation's journey — does a strained-
 * economy hamlet get saved? canonized? narrated? exported? — from ONE keyed
 * event timeline, without ever storing the id on the settlement object.
 *
 * Design:
 *   - `deriveGenerationId(seed, stampIso)` — a stable, non-personal id. Hashing
 *     seed + generation stamp means the SAME id recomputes after a reload (both
 *     survive on the save), yet two distinct generation sessions differ. It is
 *     TELEMETRY IDENTITY, not sim state: never fed back into the pipeline, never
 *     written onto the golden settlement. The store holds it in a field
 *     (settlementSlice.generationId) and threads it here.
 *   - `generationFingerprint(settlement)` — coarse structure ONLY: enums, bands,
 *     a bounded enum-id list, and coherence booleans. No names, no prose, no raw
 *     counts-as-ids. Built by construction to pass analytics-props-hygiene.
 *   - `recordGenerationMilestone(milestone, settlement, opts)` — fires ONE
 *     GENERATION_MILESTONE event carrying { generation_id, milestone, ...fp }.
 *
 * The five waypoints (GENERATION_MILESTONES): generate / save / canonize /
 * export / narrate. Fire-and-forget; never throws.
 *
 * Dependency-light: imports only analytics.js (already on the boot graph), so it
 * can be dynamic-imported at each store waypoint without cold-start cost.
 */

import { track, EVENTS } from './analytics.js';

export const GENERATION_MILESTONES = Object.freeze(['generate', 'save', 'canonize', 'export', 'narrate']);

/** Contract version for the generation-id spine (bump on a fingerprint shape change). */
export const GENERATION_SPINE_VERSION = 1;

const arr = (v) => (Array.isArray(v) ? v : []);
const str = (v) => (typeof v === 'string' && v.length <= 48 ? v : undefined);

/** Coarse count → band. Keeps hook/chain counts non-identifying and cell-friendly. */
export function countBand(n) {
  const x = Number(n) || 0;
  if (x <= 0) return 'none';
  if (x <= 2) return 'low';
  if (x <= 5) return 'some';
  if (x <= 10) return 'many';
  return 'lots';
}

/** FNV-1a 32-bit hex (sync, non-crypto). Fine for a pseudonymous grouping id. */
function fnv1aHex(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return ('00000000' + (h >>> 0).toString(16)).slice(-8);
}

/**
 * Derive a stable, non-personal generation id from the seed + generation stamp.
 * Both inputs survive on the save, so a reloaded settlement recomputes the SAME
 * id (the spine spans sessions); with neither, a random id is minted so the
 * milestone still keys uniquely within the session.
 * @param {string|number|null|undefined} seed
 * @param {string|null|undefined} stampIso  the generation timestamp (generatedAt)
 */
export function deriveGenerationId(seed, stampIso) {
  const basis = `${seed ?? ''}|${stampIso ?? ''}`;
  if (basis === '|') {
    try { if (typeof crypto !== 'undefined' && crypto.randomUUID) return 'g_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12); } catch { /* fall */ }
    return 'g_' + fnv1aHex(String(Math.random()) + String(Date.now()));
  }
  return 'g_' + fnv1aHex(basis);
}

/** The bounded set of stressor/condition TYPE enum ids present (catalog ids, never prose). */
function stressTypes(settlement) {
  const out = new Set();
  for (const s of arr(settlement.stressors).concat(arr(settlement.stress))) {
    const t = str(s?.type) || str(s?.archetype) || str(s?.id);
    if (t) out.add(t);
  }
  for (const c of arr(settlement.activeConditions)) {
    const t = str(c?.archetype);
    if (t) out.add(t);
  }
  return [...out].sort().slice(0, 12);
}

/**
 * Coarse structural fingerprint — BANDS / ENUMS / BOOLEANS only.
 * Shape (spec E1): tier · terrain class · stress types · prosperity band ·
 * hook-count band · chain-count band · coherence-flag booleans.
 */
export function generationFingerprint(settlement) {
  const s = settlement || {};
  const cfg = s.config || {};
  const power = s.powerStructure || {};
  const types = stressTypes(s);
  const hooks = arr(s.plotHooks || s.hooks).length;
  const chains = arr(s.supplyChains).length;
  const neighbours = arr(s.neighbourNetwork).length + arr(s.neighbours).length;
  return {
    tier: str(s.tier),
    terrain_class: str(cfg.terrainType),
    prosperity: str(s.economicState?.prosperity),
    stress_types: types,
    hook_count_band: countBand(hooks),
    chain_count_band: countBand(chains),
    // Coherence flags — did the generation actually produce a populated, wired town?
    has_factions: arr(power.factions).length > 0,
    has_conflicts: arr(power.conflicts).length > 0,
    has_stressors: types.length > 0,
    has_hooks: hooks > 0,
    has_neighbours: neighbours > 0,
    has_supply_chains: chains > 0,
  };
}

/**
 * Fire the GENERATION_MILESTONE event for one lifecycle waypoint. Fire-and-forget.
 * @param {'generate'|'save'|'canonize'|'export'|'narrate'} milestone
 * @param {Object} settlement
 * @param {Object} [opts]
 * @param {string} [opts.generationId]  the store-held id (preferred)
 * @param {string|number} [opts.seed]   fallback derivation input (reloaded saves)
 * @param {string} [opts.stampIso]      fallback derivation input (generatedAt)
 */
export function recordGenerationMilestone(milestone, settlement, opts = {}) {
  try {
    if (!GENERATION_MILESTONES.includes(milestone) || !settlement) return;
    const generationId = opts.generationId || deriveGenerationId(opts.seed, opts.stampIso);
    const fp = generationFingerprint(settlement);
    track(EVENTS.GENERATION_MILESTONE, {
      generation_id: generationId,
      milestone,
      spine_version: GENERATION_SPINE_VERSION,
      ...fp,
    });
  } catch { /* never throw — telemetry is best-effort */ }
}
