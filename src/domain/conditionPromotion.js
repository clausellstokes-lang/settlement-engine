/**
 * domain/conditionPromotion.js — promote generation-time stressors into
 * canonical activeConditions.
 *
 * The gap this closes: a freshly generated plague / famine / siege settlement
 * used to carry the crisis ONLY as a `stressor` (a narrative/structural pressure)
 * while `activeConditions` stayed empty. The causal substrate (causalState.js)
 * and the AI overlay both read `activeConditions` by `affectedSystems` — so a town
 * generated mid-famine under-reacted, because nothing fed the substrate the crisis.
 *
 * This pass maps each *live-crisis* stressor to its condition archetype so the
 * SAME canonical condition channel that local events (mutate.js) and the world-pulse
 * layer feed is ALSO fed at generation. Ambient/low pressures (mild banditry, a slow
 * economic slump) intentionally stay as stressors only — promotion is reserved for
 * the crises a DM would expect to see reflected in food/health/order/legitimacy.
 *
 * Pure; deterministic (no RNG, no Date); idempotent — `withActiveCondition`
 * replaces by stable id, so re-running promotion never duplicates a condition.
 */

import { withActiveCondition } from './activeConditions.js';
import { canonStressors } from './canonicalAccessors.js';

// Ordered stressor (type/name) fragment -> condition archetype. First match wins.
// Keyed off the canonical archetype vocabulary in activeConditions.js so the
// promoted conditions map 1:1 to the substrate's affectedSystems and the
// factionRelationshipUpdate delta templates.
const STRESSOR_ARCHETYPE_RULES = Object.freeze([
  { re: /plague|disease|pox|fever|outbreak|pestilence/i,        archetype: 'plague' },
  { re: /famine|starv|drought|crop failure|food shortage|blight/i, archetype: 'famine' },
  { re: /siege|besieg|blockad/i,                                archetype: 'war_pressure' },
  { re: /\bwar\b|warfront|invasion|incursion|hostilit/i,        archetype: 'war_pressure' },
  { re: /occupation|occupied|vassal|tribute|annex/i,            archetype: 'vassal_extraction' },
  { re: /refugee|migrant|displac|exodus/i,                      archetype: 'regional_migration_pressure' },
  { re: /rebellion|revolt|uprising|insurrection|mutiny/i,       archetype: 'rebellion' },
]);

/** @returns {string|null} the condition archetype this stressor promotes to, or null. */
export function archetypeForStressor(stressor) {
  const text = `${stressor?.type || ''} ${stressor?.name || ''}`.trim();
  if (!text) return null;
  for (const { re, archetype } of STRESSOR_ARCHETYPE_RULES) {
    if (re.test(text)) return archetype;
  }
  return null;
}

/**
 * Return a new settlement with an activeCondition for every live-crisis stressor.
 * No-op (returns the input) when there are no promotable stressors.
 *
 * @param {Object} settlement
 * @returns {Object}
 */
export function promoteStressorsToConditions(settlement) {
  if (!settlement) return settlement;
  // Collapse to ONE condition per archetype, keeping the highest severity. Two
  // distinct stressors that map to the same archetype (e.g. "plague" + "fever
  // outbreak" -> plague) describe one crisis; emitting two conditions would
  // double-penalize the same affectedSystems in the causal substrate. Keyed off
  // the archetype (not the stressor label) so the condition id is stable and the
  // promotion stays idempotent. Order-independent.
  const byArchetype = new Map();
  for (const stressor of canonStressors(settlement)) {
    const archetype = archetypeForStressor(stressor);
    if (!archetype) continue;
    const severity = typeof stressor?.severity === 'number' ? stressor.severity : null;
    const label = stressor?.name || stressor?.type || archetype;
    const prev = byArchetype.get(archetype);
    if (!prev || (severity != null && (prev.severity == null || severity > prev.severity))) {
      byArchetype.set(archetype, { severity, label });
    }
  }
  let next = settlement;
  for (const [archetype, { severity, label }] of byArchetype) {
    next = withActiveCondition(next, {
      archetype,
      // Carry the strongest stressor severity when present; else the catalog
      // default (deriveActiveCondition fills it from the archetype template).
      severity: severity == null ? undefined : severity,
      triggeredAt: { sourceEventType: 'GENERATION', sourceEventTargetId: archetype },
      causes: [{ source: 'generation', detail: `Settlement generated under stressor "${label}".` }],
    });
  }
  return next;
}
