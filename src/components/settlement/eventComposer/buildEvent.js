/**
 * eventComposer/buildEvent.js — pure event-assembly extracted from the inline
 * buildEvent() closure in EventComposer.jsx (behavior-preserving decomposition).
 * Given the active event type plus the composer's form state, it returns the
 * { id, type, targetId, payload, cause, ... } event the preview/apply pipeline
 * consumes. No React, no store — the parent threads its useState values in as one
 * `form` object.
 *
 * Behaviour is byte-identical to the old inline closure for every kind the host
 * already emitted (apply results depend only on the payload applyEvent commits).
 * The ONLY additions are the W5.7 BACKED-kind branches, each verified against a
 * mutate.js handler before it was added:
 *   - ADD_NPC descriptive traits        → addNpc (mutateEntities.js:409-413)
 *   - IMPOSE_CORRUPTION scope           → imposeCorruption (:725, default 'individual' = old no-op)
 *   - APPLY_STRESSOR instigator block   → applyStressor (mutateWorld.js:546-548)
 *   - SHIFT_TIER direction              → shiftTier (mutateEntities.js:920)
 *   - SET_PRIMARY_DEITY / IMPOSE_CULT   → setPrimaryDeity / imposeCult (mutate.js:106-107)
 *
 * The builder emits NO unbacked kinds: every type it produces maps to a mutate.js
 * handler (mutate.js MUTATION_HANDLERS). Deterministic-id shape (ev_${Date.now()}…)
 * kept exactly — the timeline/undo key by it.
 */

import { inferImportance } from '../../../domain/entities/npcs.js';
import { rolesForInstitution, importanceForRole, influenceForImportance } from '../../../domain/roles/roleCatalog.js';
import { buildTargetOptions, labelOfTarget } from './helpers.js';
import { RELATIONSHIP_OPTIONS, CUSTOM_RESOURCE_OPTION, STRESSOR_SEVERITY_VALUES, RELIEF_MAGNITUDE_VALUES } from './EventComposerConstants.js';
import { resolveDeityForEvent } from './EventComposerDeityField.jsx';

/** Mint a compose-session event id — the EXISTING id shape (ev_ + wall clock +
 *  random suffix; the timeline/undo key), minted ONCE per composition (Composer
 *  V2 §5 IDENTITY): dial turns never re-mint, so preview → apply → undo key one
 *  stable id. The host re-mints on apply / add-to-batch / verb change. */
export function mintComposeEventId() {
  return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function buildEvent(form) {
  const {
    type, target, effectiveTarget, settlement, phase,
    sessionEventId, causeOverride,
    addCategory, severity, dimension,
    importance, role, institutionId,
    npcFlaw, npcTemperament, npcGoals, npcConstraint, npcSecret,
    quality, relationshipType, criminalOrg, criminalOrgs, corruptScope, corruptBeneficiary,
    stressorPick, stressorSeverity, powerCause, reliefMagnitude,
    tradeDirection, tradeEntrepot, swapWithNpcId, tierDirection,
    customContent, deityRef, deityMode, cultRemoveRef,
    isWarStressor, isInfiltrationStressor, instigatorNeighbour, instigatorRelationship, tradeTarget,
    partyCaused, description,
  } = form;

  const payload = {};
  if (type === 'ADD_INSTITUTION' && addCategory) payload.category = addCategory;
  if (type === 'DAMAGE_INSTITUTION') payload.severity = severity;
  if (type === 'ADD_NPC') {
    payload.importance = importance;
    if (role) payload.role = role;
    // Descriptive traits — optional, so each is written only when authored; they
    // land verbatim on the NPC via addNpc → createNpc. npcGoals maps to the
    // SINGULAR payload.goal the handler reads.
    if (npcFlaw.trim())        payload.flaw        = npcFlaw.trim();
    if (npcTemperament.trim()) payload.temperament = npcTemperament.trim();
    if (npcGoals.trim())       payload.goal        = npcGoals.trim();
    if (npcConstraint.trim())  payload.constraint  = npcConstraint.trim();
    if (npcSecret.trim())      payload.secret      = npcSecret.trim();
  }
  if (type === 'KILL_NPC') {
    // Derive the consequence tier from the NPC itself rather than asking the DM to
    // re-state what the dossier already knows (registry KILL_NPC.stateDeltas and
    // the entity mutation both read this).
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
    // Importance + influence come from the role the NPC fills (the institution's
    // role catalogue), not a separate question.
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
    // W-DOCTRINE-3b §6 — THE BENEFICIARY PICKER. `corruptBeneficiary` names WHO holds the
    // leash: absent/'local' ⇒ the local underworld (today's path, BYTE-IDENTICAL — no leash
    // key, just criminalInstitution + scope); 'foreign:<settlementId>' ⇒ a foreign court, which
    // stamps a normalized foreign_settlement leash and drops the local-org requirement (the
    // channel requirement replaces it — imposeCorruption resolves the beneficiary, not a local
    // org). The beneficiary identity rides the DM-truth leash only; publicNpc never projects it.
    const foreignId = typeof corruptBeneficiary === 'string' && corruptBeneficiary.startsWith('foreign:')
      ? corruptBeneficiary.slice('foreign:'.length)
      : null;
    if (foreignId) {
      payload.leash = { kind: 'foreign_settlement', settlementId: foreignId, factionName: null, viaLocalOrg: null, covert: true };
    } else {
      const org = criminalOrg || criminalOrgs[0];
      if (org) payload.criminalInstitution = org;
    }
    // Scope: 'individual' turns only the NPC (byte-identical to the old scope-less
    // apply); 'individual_institution' also covertly compromises their home
    // institution in-chain (mutateEntities.js imposeCorruption reads payload.scope).
    payload.scope = corruptScope;
  }
  if (type === 'APPLY_STRESSOR') {
    payload.stressorType = stressorPick?.key || target.trim();
    payload.label = stressorPick?.name || labelOfTarget(target);
    // OUR floor keeps the DM-picked, word-banded severity. crisisOnset defaults
    // 0.6 when severity is omitted (it does NOT derive onset from settlement
    // pressure on OUR floor), so an omitted severity would silently drop the GM's
    // choice — kept EXACTLY as the old inline closure emitted it.
    payload.severity = STRESSOR_SEVERITY_VALUES[stressorSeverity] ?? 0.6;
    if (stressorPick?.isCustom) payload.isCustom = true;
    // Optional instigating neighbour. WAR-type sours it to hostile; INFILTRATION
    // sours it to the DM-chosen lighter relationship (default rival). The handler
    // ignores the instigator on any other stressor type.
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
  if (type === 'FORCE_RELIEF' || type === 'OFFER_CREDIT') {
    // The word-banded magnitude (FP-G3): the share of the ABOVE-FLOOR surplus the
    // decree sends — words at the table, numbers in the engine (the handler reads
    // it through sev01, clampAtCommit).
    payload.magnitude = RELIEF_MAGNITUDE_VALUES[reliefMagnitude] ?? 0.5;
  }
  // SHIFT_TIER — a one-step forced promotion/demotion. The host pre-clamps
  // tierDirection to a legal move, so the shown option and the staged event agree;
  // the handler is a no-op at the cap/floor regardless.
  if (type === 'SHIFT_TIER') {
    payload.direction = tierDirection === 'demotion' ? 'demotion' : 'promotion';
  }
  // SET_PRIMARY_DEITY / IMPOSE_CULT — resolve the frozen snapshot HERE (intent
  // time) via the OUR-floor resolver, so a deity staged from the dossier is
  // byte-identical to one assigned from the map: it mints the account-scoped
  // identity ref and keeps lawAxis in the snapshot. deityMode 'remove' clears the
  // patron / drops the named cult.
  let deityTargetId;
  if (type === 'SET_PRIMARY_DEITY') {
    if (deityMode === 'remove' || !deityRef) {
      payload.deityRef = null; payload.snapshot = null; deityTargetId = null;
    } else {
      const resolved = resolveDeityForEvent(customContent, deityRef);
      payload.deityRef = resolved?.deityRef ?? deityRef;
      payload.snapshot = resolved?.snapshot ?? null;
      deityTargetId = payload.deityRef;
    }
  } else if (type === 'IMPOSE_CULT') {
    if (deityMode === 'remove') {
      const ref = cultRemoveRef || null;
      payload.deityRef = ref; payload.snapshot = null; deityTargetId = ref;
    } else {
      const resolved = resolveDeityForEvent(customContent, deityRef);
      payload.deityRef = resolved?.deityRef ?? (deityRef || null);
      payload.snapshot = resolved?.snapshot ?? null;
      deityTargetId = payload.deityRef;
    }
  }
  // targetId ladder: SHIFT_TIER carries none (reads payload.direction); the deity
  // events carry the resolved deity ref; OPENED_TRADE_ROUTE may override with a
  // campaign-peer target (the handler adds a link for it); else the picked target.
  const targetId = type === 'SHIFT_TIER'
    ? null
    : (type === 'SET_PRIMARY_DEITY' || type === 'IMPOSE_CULT')
      ? deityTargetId
      : (type === 'OPENED_TRADE_ROUTE' && tradeTarget.trim())
        ? tradeTarget.trim()
        : effectiveTarget.trim();

  return {
    // Compose-session-stable id (§5): the host mints once per composition and
    // threads it here; the fallback mint keeps direct callers working.
    id: sessionEventId || mintComposeEventId(),
    type,
    targetId,
    payload,
    // Party-caused events carry a distinct cause so the timeline/Chronicle and
    // (in canon campaigns) the world engine can treat them as the table's doing.
    // causeOverride carries an injected composition's provenance (SuccessorPrompt
    // stages 'world_event' — the vacuum-filling is the world's doing, not the DM's).
    cause: partyCaused ? 'party_action' : (causeOverride || (phase === 'canon' ? 'player_action' : 'authoring')),
    partyCaused: partyCaused || undefined,
    description: description.trim() || undefined,
  };
}
