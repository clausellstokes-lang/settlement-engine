/**
 * domain/intent/opVocabulary.js — the CLIENT builder of the intent-compiler's TOOL SCHEMA
 * (Surveyor S3, DESIGN_AI_CONTROL_SURFACE §2 stage 3).
 *
 * The op registry IS the tool schema. Mirroring S1's retrieval architecture (the client
 * builds the bundle and POSTs it; the edge validates shape + membership), the client
 * builds the op-VOCABULARY descriptor here from the SAME registries the manual UI uses —
 * the 40-type canon-event registry (src/domain/events/registry.js) + the 12 party-impact
 * kinds (src/domain/worldPulse/partyImpactKinds.js) — and POSTs it to the interpret-session
 * edge, which grounds the compiler on it and rejects any op outside it (the schema wall).
 *
 * PURITY / BUDGET: no transport, no side effects, no eager importer. Read only by the lazy
 * interpret panel/transport (rides the AiAnalystPanel lazy chunk), so it costs ZERO eager
 * bytes. It emits only registered type strings — never engine internals.
 */

import { EVENT_TYPES } from '../events/registry.js';
import { PARTY_IMPACT_KINDS } from '../worldPulse/partyImpactKinds.js';

/**
 * The identity-mutating canon-event types — those that remove, replace, or re-seat a NAMED
 * entity. Under a CANONIZED campaign phase these need explicit DM consent (the CANON_IDENTITY
 * protected flag). A frozen subset of EVENT_TYPES; the pin asserts every member is a real
 * registered type (so a rename in the registry can never leave a stale identity guard).
 */
export const IDENTITY_EVENT_TYPES = Object.freeze([
  'KILL_NPC', 'PROMOTE_NPC', 'DEMOTE_NPC', 'ASSIGN_NPC_TO_ROLE', 'KILL_LEADER',
  'DESTROY_SETTLEMENT', 'CHANGE_RULING_POWER', 'REMOVE_INSTITUTION',
]);

/**
 * Build the op-vocabulary descriptor the client POSTs to interpret-session. Pure.
 * @returns {{ canonEventTypes: string[], partyImpactKinds: string[], identityEventTypes: string[] }}
 */
export function buildOpVocabulary() {
  const canonEventTypes = [...EVENT_TYPES];
  const canonSet = /** @type {Set<string>} */ (new Set(canonEventTypes));
  return {
    canonEventTypes,
    partyImpactKinds: Object.keys(PARTY_IMPACT_KINDS),
    // Keep only identity types that are actually registered (defensive against drift).
    identityEventTypes: IDENTITY_EVENT_TYPES.filter((t) => canonSet.has(t)),
  };
}

/** True iff an entity carries a DM authorship / lock marker (the protected-target signal).
 *  @param {any} entity @returns {boolean} */
function isProtectedEntity(entity) {
  return !!entity && typeof entity === 'object' &&
    (entity._authored === true || entity.locked === true || entity.pinned === true);
}

/** Collect the ids of protected entities in a collection (NPCs / institutions / factions).
 *  @param {any[]} list @returns {string[]} */
function protectedIdsIn(list) {
  /** @type {string[]} */
  const ids = [];
  for (const e of Array.isArray(list) ? list : []) {
    if (isProtectedEntity(e) && (typeof e.id === 'string' || typeof e.id === 'number')) ids.push(String(e.id));
  }
  return ids;
}

/**
 * Build the PROTECTED CONTEXT the client POSTs alongside the vocabulary — the ids of
 * hand-authored/locked entities + whether the campaign is canonized. The compiler flags any
 * op grazing these so the review UI raises a consent barrier. Pure.
 *
 * @param {{ npcs?: any[], institutions?: any[], factions?: any[] }|null} settlement
 * @param {string} [phase] the settlement's lifecycle phase ('draft' | 'canon')
 * @returns {{ protectedTargets: string[], identityLockedPhase: boolean }}
 */
export function buildProtectedContext(settlement, phase) {
  /** @type {any} */
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const protectedTargets = [
    ...protectedIdsIn(s.npcs),
    ...protectedIdsIn(s.institutions),
    ...protectedIdsIn(s.factions),
  ];
  return {
    protectedTargets: [...new Set(protectedTargets)],
    identityLockedPhase: phase === 'canon',
  };
}
