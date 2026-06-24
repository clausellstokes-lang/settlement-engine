/**
 * eventComposer/buildEvent.js — pure event-assembly extracted from
 * EventComposer.jsx (behavior-preserving decomposition). Given the active
 * event type plus the composer's form state, it returns the `{ id, type,
 * targetId, payload, cause, ... }` event object the preview/apply pipeline
 * consumes. No React, no store — the parent threads its useState values in.
 */

import { inferImportance } from '../../../domain/entities/npcs.js';
import { rolesForInstitution, importanceForRole, influenceForImportance } from '../../../domain/roles/roleCatalog.js';
import { buildTargetOptions, labelOfTarget } from './helpers.js';
import { RELATIONSHIP_OPTIONS, CUSTOM_RESOURCE_OPTION } from './EventComposerConstants.js';

export function buildEvent(form) {
  const {
    type, target, effectiveTarget, settlement, phase,
    addCategory, severity, dimension,
    importance, role, institutionId,
    npcFlaw, npcTemperament, npcGoals, npcConstraint, npcSecret,
    quality, relationshipType, criminalOrg, criminalOrgs, corruptScope,
    stressorPick, powerCause,
    tradeDirection, tradeEntrepot, swapWithNpcId,
    isWarStressor, isInfiltrationStressor, instigatorNeighbour, instigatorRelationship, tradeTarget,
    partyCaused, description,
  } = form;

  const payload = {};
  if (type === 'ADD_INSTITUTION' && addCategory) payload.category = addCategory;
  if (type === 'DAMAGE_INSTITUTION') payload.severity = severity;
  if (type === 'ADD_NPC') {
    payload.importance = importance;
    if (role) payload.role = role;
    // Descriptive traits — optional, so each is written only when authored.
    // These flow through addNpc → createNpc onto the NPC in the exact shapes
    // the read card's normalizer reads back.
    if (npcFlaw.trim())        payload.flaw        = npcFlaw.trim();
    if (npcTemperament.trim()) payload.temperament = npcTemperament.trim();
    if (npcGoals.trim())       payload.goal        = npcGoals.trim();
    if (npcConstraint.trim())  payload.constraint  = npcConstraint.trim();
    if (npcSecret.trim())      payload.secret      = npcSecret.trim();
  }
  if (type === 'KILL_NPC') {
    // Derive the consequence tier from the NPC itself rather than asking the
    // DM to re-state what the dossier already knows. Both the state math
    // (registry KILL_NPC.stateDeltas) and the entity mutation read this, so
    // a pillar's death isn't silently down-graded to "notable".
    const npc = (settlement.npcs || []).find(n => String(n.id || n.name) === String(target));
    if (npc) payload.importance = npc.importance || inferImportance(npc);
  }
  if (type === 'ADD_NPC' && institutionId) {
    payload.linkedInstitutionIds = [institutionId];
  }
  if (type === 'ASSIGN_NPC_TO_ROLE') {
    payload.quality = quality;
    if (role)          payload.role = role;
    if (institutionId) payload.institutionId = institutionId;
    // Importance + influence come from the role the NPC fills (the
    // institution's role catalogue), not a separate question.
    const inst = institutionId
      ? (settlement.institutions || []).find(i => String(i.id || i.name) === String(institutionId))
      : null;
    const roleOpts = inst ? rolesForInstitution(inst) : [];
    const imp = roleOpts.length ? importanceForRole(role, roleOpts) : null;
    if (imp) {
      payload.importance = imp;
      payload.influence  = influenceForImportance(imp);
    }
  }
  if (type === 'IMPAIR_INSTITUTION' || type === 'IMPAIR_FACTION') {
    payload.dimension = dimension;
    payload.severity  = severity;
  }
  if (RELATIONSHIP_OPTIONS[type]) {
    payload.relationshipType = relationshipType || RELATIONSHIP_OPTIONS[type][0];
  }
  if (type === 'IMPOSE_CORRUPTION') {
    const org = criminalOrg || criminalOrgs[0];
    if (org) payload.criminalInstitution = org;
    payload.scope = corruptScope;
  }
  if (type === 'APPLY_STRESSOR') {
    payload.stressorType = stressorPick?.key || target.trim();
    payload.label = stressorPick?.name || labelOfTarget(target);
    // Severity is intentionally ABSENT — the domain DERIVES the onset severity
    // from the settlement's preexisting pressure (deriveStressorSeverity) when
    // the payload omits it. The DM no longer dials it in.
    if (stressorPick?.isCustom) payload.isCustom = true;
    // #1 / #3 — optional instigating neighbour. For a WAR-type stressor it sours
    // that neighbour to hostile; for an INFILTRATION stressor it sours to the
    // DM-chosen lighter relationship (rival / cold_war / hostile, default rival).
    // The handler ignores the instigator on any other stressor type.
    if ((isWarStressor || isInfiltrationStressor) && instigatorNeighbour.trim()) {
      payload.instigatorNeighbour = instigatorNeighbour.trim();
      if (isInfiltrationStressor) {
        payload.instigatorRelationship = instigatorRelationship || 'rival';
      }
    }
  }
  if (type === 'CHANGE_RULING_POWER') {
    payload.cause = powerCause || 'coup';
  }
  if (type === 'RESOLVE_STRESSOR') {
    payload.stressorType = target.trim();
    const opt = buildTargetOptions(settlement, 'stressors').find(o => o.id === target);
    if (opt) payload.label = opt.name;
  }
  if (type === 'ADD_TRADE_GOOD') {
    payload.direction = tradeDirection;
    payload.entrepot = tradeDirection === 'export' && tradeEntrepot;
    payload.label = target.trim();
  }
  if (type === 'ADD_RESOURCE' && target === CUSTOM_RESOURCE_OPTION) {
    payload.isCustom = true;
  }
  if (type === 'PROMOTE_NPC' || type === 'DEMOTE_NPC') {
    payload.swapWithNpcId = swapWithNpcId;
  }
  // #6 — OPENED_TRADE_ROUTE may target ANOTHER campaign settlement instead of a
  // pre-linked neighbour. When one is chosen it overrides the neighbour target;
  // the handler ADDS a neighbourNetwork link for it (no longer a no-op for an
  // unlinked name).
  const targetId = (type === 'OPENED_TRADE_ROUTE' && tradeTarget.trim())
    ? tradeTarget.trim()
    : effectiveTarget.trim();

  return {
    id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    targetId,
    payload,
    // Party-caused events carry a distinct cause so the timeline/Chronicle and
    // (in canon campaigns) the world engine can treat them as the table's doing.
    cause: partyCaused ? 'party_action' : (phase === 'canon' ? 'player_action' : 'authoring'),
    partyCaused: partyCaused || undefined,
    description: description.trim() || undefined,
  };
}
