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

/**
 * ⚠ `has_hooks` AND `has_supply_chains` WERE FALSE ON EVERY GENERATION EVER FIRED.
 *
 * The fingerprint read `s.plotHooks || s.hooks` and `s.supplyChains` — three keys
 * that NO writer in this repo produces on a settlement ROOT. So `hook_count_band`
 * and `chain_count_band` were pinned at the zero band and both coherence booleans
 * were pinned false, for every settlement, in every milestone event.
 *
 * ⚠ WHY THIS COUNTS THE ADDRESSES INLINE INSTEAD OF CALLING THE CANONICAL
 * COLLECTOR. `domain/dossier/plotHooks.collectPlotHooks` is the canonical hook
 * surface and every other repaired reader now calls it — but this module's
 * contract, stated in its own header, is "dependency-light: imports only
 * analytics.js … so it can be dynamic-imported at each store waypoint without
 * cold-start cost", and the collector pulls the traditions prose, the hook-theme
 * vocabulary, the prose seams and the retention layer behind it. A telemetry BAND
 * does not need canonical dedupe or priority ordering, only an honest count, so
 * the invariant wins. The address list below is the collector's own settlement-
 * scope list; if a hook address is added there, add it here too.
 *
 * @param {Record<string, any>} s
 * @returns {number}
 */
function liveHookCount(s) {
  let n = arr(s.economicViability?.plotHooks).length
    + arr(s.economicState?.safetyProfile?.plotHooks).length;
  for (const npc of arr(s.npcs)) n += arr(npc?.plotHooks).length;
  for (const conflict of arr(s.conflicts)) n += arr(conflict?.plotHooks).length;
  for (const tension of arr(s.history?.currentTensions)) n += arr(tension?.plotHooks).length;
  for (const event of arr(s.history?.historicalEvents)) n += arr(event?.plotHooks).length;
  return n;
}

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
  const hooks = liveHookCount(s);
  // ⚠ NO `|| s.economy?.activeChains` FALLBACK. deriveAllSupplyChainStates carries
  // one, but `settlement.economy` is ITSELF a writerless root key (banked in the
  // observed-shape inventory for four other files), so copying that precedence
  // chain here would have traded one dead read for another — which the reader
  // ratchet caught as growth. `economicState.activeChains` is the live address.
  const chains = arr(s.economicState?.activeChains).length;
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
