/**
 * simHelpers.js — shared helpers for the simulation eval-fixture corpus.
 *
 * These tests are the SEMANTIC complement to the golden-master hashes:
 *   - the golden hashes pin the exact BYTES of a generation (structure/prose);
 *   - these fixtures pin the MEANING — the qualitative invariants a DM relies
 *     on, and the cross-surface coherence that makes the pieces explain each
 *     other (the same fact showing up in economy AND stress AND hooks AND the
 *     causal substrate). A regression that keeps the bytes valid but makes the
 *     sim quietly lie to the DM (a "famine" with a surplus food balance, a
 *     "corrupt trade town" with no criminal faction) slips past the hashes and
 *     is caught here.
 *
 * Everything here reads the PURE pipeline: generateSettlementPipeline with an
 * explicit `customContent: {}` so the run is fully headless and deterministic —
 * no store, no React, no app-injected custom content. Seeds are pinned
 * constants so a "reliably produces scenario X" claim stays reproducible
 * forever.
 */

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/**
 * Generate one settlement through the pure, headless pipeline.
 * customContent:{} pins generation to a clean state (independent of any store).
 */
export function gen(config, seed) {
  return generateSettlementPipeline(config, null, { seed, customContent: {} });
}

/** Normalize the stress container (null | object | array) to an array of entries. */
export function stressEntries(s) {
  const st = s?.stress;
  if (!st) return [];
  return Array.isArray(st) ? st.filter(Boolean) : [st];
}

/** The stress-type keys present on a settlement (e.g. ['famine']). */
export function stressTypes(s) {
  return stressEntries(s).map((e) => e?.type).filter(Boolean);
}

/**
 * Prosperity band ordering. Struggling/Subsistence are the floor (crisis /
 * bare-survival), Wealthy the ceiling. Used to assert "prosperity capped ≤ X".
 * Mirrors the LABELS/BASE tables in src/generators/economy/prosperity.js.
 */
export const PROSPERITY_RANK = Object.freeze({
  Struggling: 0,
  Subsistence: 0,
  Poor: 1,
  Moderate: 2,
  Comfortable: 3,
  Prosperous: 4,
  Wealthy: 5,
});

export function prosperityRank(label) {
  const r = PROSPERITY_RANK[label];
  return r === undefined ? 2 : r; // unknown → treat as Moderate (neutral)
}

/** The power-structure factions array. */
export function factionsOf(s) {
  return s?.powerStructure?.factions || [];
}

/** True if any faction carries the given category (e.g. 'criminal', 'religious', 'magic'). */
export function hasFactionCategory(s, category) {
  return factionsOf(s).some((f) => f.category === category);
}

/** Rank (0 = most powerful) of the first faction with the given category, or -1. */
export function factionCategoryRank(s, category) {
  return factionsOf(s).findIndex((f) => f.category === category);
}

/** Institution display names. */
export function institutionNames(s) {
  return (s?.institutions || []).map((i) => i?.name || '');
}

/** activeConditions archetypes (e.g. ['famine'], ['war_pressure']). */
export function conditionArchetypes(s) {
  return (s?.activeConditions || []).map((c) => c?.archetype).filter(Boolean);
}

/** All simulationTrace targetIds (the causal receipts). */
export function traceTargetIds(s) {
  return (s?.simulationTrace || []).map((t) => t?.targetId).filter(Boolean);
}

/** True if any receipt's targetId matches the pattern. */
export function hasReceipt(s, re) {
  return traceTargetIds(s).some((id) => re.test(id));
}

/**
 * Every plot-hook string a DM would read for a settlement: the per-NPC
 * plotHooks (the population's hooks) plus the settlement-level crime plotHooks.
 * This is the surface the anti-repetition envelope measures.
 */
export function collectNpcHooks(s) {
  const npcHooks = (s?.npcs || []).flatMap((n) => (Array.isArray(n?.plotHooks) ? n.plotHooks : []));
  return npcHooks;
}

/** The lowercased NPC role strings (for arcane/religious role detection). */
export function npcRoles(s) {
  return (s?.npcs || []).map((n) => String(n?.role || ''));
}
