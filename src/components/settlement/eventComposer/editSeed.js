/**
 * eventComposer/editSeed.js — THE MUTABLE DOCKET's edit seeding (W-COMPOSER-2
 * §10, owner law: "each queued commit is editable or cancelable").
 *
 * The reverse of buildEvent: a QUEUED event → the composer-intent whose fields
 * repopulate the form (dials populated, identity preserved). Editing reopens
 * the composition with the SAME compose-session id (the event has not applied,
 * so no undo/PRNG lineage exists yet); re-staging replaces the queue entry in
 * place (updateQueuedEvent) and re-validates against the CURRENT state like
 * any queued intention (the drain's veto channel is the final gate).
 *
 * Field coverage mirrors buildEvent's payload writers verbatim; a payload key
 * with no form twin (derived values like KILL_NPC importance) is deliberately
 * NOT seeded — buildEvent re-derives it on re-stage, which is the honest path.
 */

import { STRESSOR_SEVERITY_VALUES, RELIEF_MAGNITUDE_VALUES } from './EventComposerConstants.js';

/** The band word for an engine number (nearest key; exact when authored by the
 * composer). @param {Record<string, number>} words @param {unknown} value @param {string} fallback */
function wordFor(words, value, fallback) {
  const v = Number(value);
  if (!Number.isFinite(v)) return fallback;
  let best = fallback;
  let bestDist = Infinity;
  for (const [word, n] of Object.entries(words)) {
    const d = Math.abs(n - v);
    if (d < bestDist) { best = word; bestDist = d; }
  }
  return best;
}

/**
 * Build the composer intent that reopens a queued event for editing.
 * @param {Record<string, any>} event  the queued event ({ id, type, targetId, payload, ... })
 * @param {{ campaignId: string, queueId: string }} queueRef
 * @returns {Record<string, any>} the stageComposerIntent payload
 */
export function eventToComposerIntent(event, { campaignId, queueId }) {
  const type = String(event?.type || '');
  const p = event?.payload && typeof event.payload === 'object' ? event.payload : {};
  /** @type {Record<string, any>} */
  const fields = {};

  if (event?.description) fields.description = String(event.description);
  if (event?.cause && event.cause !== 'player_action' && event.cause !== 'party_action' && event.cause !== 'authoring') {
    fields.causeOverride = String(event.cause);
  }
  if (event?.partyCaused) fields.partyCaused = true;

  // The per-type payload → form twins (buildEvent's writers, reversed).
  if (p.category != null) fields.addCategory = String(p.category);
  if (type === 'ADD_NPC' || type === 'ASSIGN_NPC_TO_ROLE') {
    if (p.importance != null) fields.importance = String(p.importance);
    if (p.role != null) fields.role = String(p.role);
    if (p.quality != null) fields.quality = String(p.quality);
    const linked = Array.isArray(p.linkedInstitutionIds) ? p.linkedInstitutionIds[0] : p.institutionId;
    if (linked != null) fields.institutionId = String(linked);
    if (p.flaw) fields.npcFlaw = String(p.flaw);
    if (p.temperament) fields.npcTemperament = String(p.temperament);
    if (p.goal) fields.npcGoals = String(p.goal);
    if (p.constraint) fields.npcConstraint = String(p.constraint);
    if (p.secret) fields.npcSecret = String(p.secret);
  }
  if (p.relationshipType != null) fields.relationshipType = String(p.relationshipType);
  if (type === 'IMPOSE_CORRUPTION') {
    if (p.leash?.kind === 'foreign_settlement' && p.leash.settlementId != null) {
      fields.corruptBeneficiary = `foreign:${p.leash.settlementId}`;
    } else if (p.criminalInstitution != null) {
      fields.criminalOrg = String(p.criminalInstitution);
    }
    if (p.scope != null) fields.corruptScope = String(p.scope);
  }
  if (type === 'APPLY_STRESSOR') {
    fields.stressorSeverity = wordFor(STRESSOR_SEVERITY_VALUES, p.severity, 'moderate');
    // Seed the stressorPick twin so a re-staged edit keeps the AUTHORED label
    // (buildEvent re-derives labelOfTarget(key) otherwise, de-casing a catalog
    // stressor's name) and its isCustom marker (components-dossier-library-7).
    fields.stressorPick = { key: String(p.stressorType || event?.targetId || ''), name: p.label, isCustom: !!p.isCustom };
    if (p.instigatorNeighbour) fields.instigatorNeighbour = String(p.instigatorNeighbour);
    if (p.instigatorRelationship) fields.instigatorRelationship = String(p.instigatorRelationship);
  }
  if (type === 'CHANGE_RULING_POWER' && p.cause != null) fields.powerCause = String(p.cause);
  if (type === 'ADD_TRADE_GOOD') {
    if (p.direction != null) fields.tradeDirection = String(p.direction);
    fields.tradeEntrepot = p.entrepot === true;
  }
  if (type === 'PROMOTE_NPC' || type === 'DEMOTE_NPC') {
    if (p.swapWithNpcId != null) fields.swapWithNpcId = String(p.swapWithNpcId);
  }
  if (type === 'FORCE_RELIEF' || type === 'OFFER_CREDIT') {
    fields.reliefMagnitude = wordFor(RELIEF_MAGNITUDE_VALUES, p.magnitude, 'measured');
  }
  if (type === 'SHIFT_TIER' && p.direction != null) fields.tierDirection = String(p.direction);
  // The two deity verbs invert DIFFERENTLY (buildEvent asymmetry —
  // components-dossier-library-2). SET_PRIMARY_DEITY removal clears the ref
  // (deityRef == null); IMPOSE_CULT removal KEEPS the cult ref and marks the
  // snapshot null ({ deityRef: cultRef, snapshot: null }). Keying IMPOSE_CULT's
  // remove on `deityRef == null` (as SET_PRIMARY_DEITY does) mis-seeded a queued
  // cult REMOVAL as an imposition — a silent intent inversion on re-stage.
  if (type === 'SET_PRIMARY_DEITY') {
    if (p.deityRef != null) fields.deityRef = String(p.deityRef);
    if (p.deityRef == null) fields.deityMode = 'remove';
  } else if (type === 'IMPOSE_CULT') {
    if (p.snapshot == null) {
      fields.deityMode = 'remove';
      if (p.deityRef != null) fields.cultRemoveRef = String(p.deityRef);
    } else if (p.deityRef != null) {
      fields.deityRef = String(p.deityRef);
    }
  }

  // Target: APPLY/RESOLVE_STRESSOR compose against the stressor key; everything
  // else against the event's targetId.
  const target = (type === 'APPLY_STRESSOR' || type === 'RESOLVE_STRESSOR')
    ? String(p.stressorType || event?.targetId || '')
    : (event?.targetId != null ? String(event.targetId) : '');

  return {
    type,
    target,
    fields,
    // Edit identity (§10): the SAME compose-session id; re-stage replaces the
    // queue entry in place.
    editQueue: { campaignId: String(campaignId), queueId: String(queueId), eventId: String(event?.id || '') },
  };
}
