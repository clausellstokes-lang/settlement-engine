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

import { deriveAllActiveConditions, withActiveCondition } from '../activeConditions.js';

const WORLD_CONDITION_SOURCE_PREFIXES = Object.freeze(['WORLD_PULSE', 'WORLD_STRESSOR', 'PARTY_ACTION', 'REGIONAL']);

/** True when a condition was authored by the regional pulse / party action. */
export function isWorldAuthoredCondition(condition) {
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
