/**
 * domain/worldPulse/reconcile.js — pulse ↔ local reconciliation policy.
 *
 * The pulse applies conditions to a settlement as `activeConditions` (never
 * silent field edits). But the DM can later regenerate or edit that settlement
 * locally. Policy: **world/party-authored conditions survive a local
 * regeneration; locally-authored conditions are owned by the regenerator.**
 *
 * World-authored conditions are identified by provenance — their
 * `triggeredAt.sourceEventType` (WORLD_PULSE…, WORLD_STRESSOR…, PARTY_ACTION…,
 * REGIONAL…) or a `causes[].source` of `world_pulse`. This module exposes the
 * predicate + a `preserveWorldConditions` helper the regeneration path can call
 * to re-attach them.
 */

import { deriveAllActiveConditions, isEventSourcedCondition, withActiveCondition } from '../activeConditions.js';

const WORLD_CONDITION_SOURCE_PREFIXES = Object.freeze(['WORLD_PULSE', 'WORLD_STRESSOR', 'PARTY_ACTION', 'REGIONAL']);

/** True when a condition was authored by the regional pulse / party action. */
export function isWorldAuthoredCondition(condition) {
  // EVENT-promoted conditions are never world-authored — they survive
  // regeneration through their own seam (config.eventConditions →
  // reapplyEventConditions), and carrying them here would CLOBBER evolved
  // state by id (a RESOLVE_STRESSOR wind-down replaced with the stale prior
  // copy on the very next applyEvent reconcile). Must run BEFORE the
  // archetype check below: REFUGEE_WAVE and APPLY_STRESSOR legitimately
  // promote `regional_*` archetypes with event provenance.
  if (isEventSourcedCondition(condition)) return false;
  // `regional_*` archetypes are otherwise produced by the regional engine
  // (propagation.js / flows.js). This is
  // the reliable signal — propagation stamps `sourceEventType` as the change
  // kind (route_cut, regional_wave, …) and `causes[].source` as the channel
  // id, neither of which carries a world/party prefix.
  if (String(condition?.archetype || '').startsWith('regional_')) return true;
  const src = String(condition?.triggeredAt?.sourceEventType || '');
  if (WORLD_CONDITION_SOURCE_PREFIXES.some(p => src.startsWith(p))) return true;
  return (condition?.causes || []).some(c => {
    const s = String(c?.source || '');
    return s === 'world_pulse' || s.startsWith('world_') || s.startsWith('party');
  });
}

/** The world/party-authored conditions currently on a settlement. */
export function worldAuthoredConditions(settlement) {
  return deriveAllActiveConditions(settlement).filter(isWorldAuthoredCondition);
}

/**
 * Carry world/party-authored conditions from `prior` onto a freshly
 * `regenerated` settlement so a local reroll/edit doesn't erase pulse + party
 * consequences. Locally-authored conditions on `regenerated` are kept; world-
 * authored ones the regeneration dropped are re-attached (idempotent by id).
 *
 * @param {Object} regenerated  the freshly regenerated/edited settlement
 * @param {Object} prior        the settlement before regeneration
 * @returns {Object} a new settlement
 */
export function preserveWorldConditions(regenerated, prior) {
  if (!regenerated || !prior) return regenerated;
  const carried = worldAuthoredConditions(prior);
  if (!carried.length) return regenerated;
  let next = regenerated;
  for (const condition of carried) {
    next = withActiveCondition(next, condition);
  }
  return next;
}
