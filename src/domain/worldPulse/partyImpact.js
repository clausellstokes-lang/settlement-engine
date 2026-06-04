/**
 * domain/worldPulse/partyImpact.js — the party as a first-class actor.
 *
 * The world pulse advances autonomously, but in a TTRPG the *party* is the main
 * causal force. This module lets the DM inject the consequences of party action
 * ("broke the siege of Ashford", "brokered a truce", "assassinated the patron")
 * as authoritative inputs that resolve or redirect stressors, shift inter-
 * settlement relationships, clear or impose active conditions, and move NPC /
 * faction state.
 *
 * Design notes:
 *  - Party impacts are CANON by construction — the DM is declaring what
 *    happened. So they auto-apply (no probabilistic roll) and relationship
 *    label changes apply immediately rather than queuing as proposals.
 *  - They reuse the existing apply pipeline (`applyWorldPulseOutcomes`) so
 *    regional propagation, condition materialization, and Wizard News all come
 *    for free. Stressor resolution and condition clearing are *removals*, which
 *    the outcome pipeline can't express, so those are applied directly here and
 *    their lingering consequences (residual aftereffects, recovery conditions)
 *    flow back through as normal outcomes.
 *  - Every effect is tagged `party`-sourced and carries the DM's note as a
 *    reason, so the audit trail (Wizard News) distinguishes "the world did this"
 *    from "the table did this".
 *  - Pure + deterministic: no rolls, no `new Date()` — the caller threads `now`.
 */

import { ensureWorldState, stablePart } from './worldState.js';
import { buildWorldSnapshot } from './worldSnapshot.js';
import { resolveStressorById, adjustStressorSeverityById } from './stressors.js';
import { ensureRelationshipState } from './relationshipEvolution.js';
import { applyWorldPulseOutcomes } from './applyWorldPulse.js';
import { deriveAllActiveConditions, deriveActiveCondition } from '../activeConditions.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

/**
 * Catalog of party impact kinds. `targets` documents the fields the DM must
 * supply; `defaultMagnitude` is the decisiveness (0..1) when unspecified. This
 * is exported so a UI can render the picker and validate input.
 */
export const PARTY_IMPACT_KINDS = Object.freeze({
  resolve_stressor:    { targets: ['stressorId'],               defaultMagnitude: 1.0,  label: 'Resolve a crisis', note: 'The party ended an active stressor (broke the siege, cured the plague).' },
  ease_stressor:       { targets: ['stressorId'],               defaultMagnitude: 0.4,  label: 'Ease a crisis',    note: 'The party blunted but did not end a stressor.' },
  worsen_stressor:     { targets: ['stressorId'],               defaultMagnitude: 0.4,  label: 'Worsen a crisis',  note: 'The party (or their failure) deepened a stressor.' },
  broker_relationship: { targets: ['relationshipKey'],          defaultMagnitude: 0.6,  label: 'Broker peace',     note: 'The party de-escalated a relationship between two settlements.' },
  inflame_relationship:{ targets: ['relationshipKey'],          defaultMagnitude: 0.6,  label: 'Inflame a feud',   note: 'The party escalated a relationship between two settlements.' },
  clear_condition:     { targets: ['settlementId', 'condition'],defaultMagnitude: 1.0,  label: 'Resolve a condition', note: 'The party removed an active condition from a settlement.' },
  impose_condition:    { targets: ['settlementId', 'archetype'],defaultMagnitude: 0.6,  label: 'Cause a condition', note: 'The party caused a new active condition.' },
  bolster_faction:     { targets: ['settlementId', 'factionId'],defaultMagnitude: 0.5,  label: 'Empower a faction', note: 'The party strengthened a faction\'s standing.' },
  undermine_faction:   { targets: ['settlementId', 'factionId'],defaultMagnitude: 0.5,  label: 'Undermine a faction', note: 'The party weakened a faction\'s standing.' },
  empower_npc:         { targets: ['settlementId', 'npcId'],    defaultMagnitude: 0.5,  label: 'Aid an NPC',        note: 'The party advanced an NPC\'s position.' },
  remove_npc:          { targets: ['settlementId', 'npcId'],    defaultMagnitude: 1.0,  label: 'Remove an NPC',     note: 'The party removed a key NPC (killed, exiled, captured).' },
});

// Relationship de-/escalation ladder, worst → best.
const RELATIONSHIP_LADDER = ['hostile', 'cold_war', 'rival', 'neutral', 'trade_partner', 'allied'];

function ladderShift(fromType, steps) {
  const idx = RELATIONSHIP_LADDER.indexOf(fromType);
  const start = idx === -1 ? RELATIONSHIP_LADDER.indexOf('neutral') : idx;
  const next = Math.max(0, Math.min(RELATIONSHIP_LADDER.length - 1, start + steps));
  return RELATIONSHIP_LADDER[next];
}

function partyReasons(action, extra = []) {
  return [
    action.label ? `Party action: ${action.label}` : 'A party action reshaped the campaign.',
    ...(action.note ? [action.note] : []),
    ...extra,
  ];
}

function baseOutcome(action, kind, fields) {
  return {
    id: `party.${stablePart(kind)}.${stablePart(action.id || action.label || kind)}.${fields.targetSaveId || fields.relationshipKey || 'realm'}`,
    applyMode: 'auto',
    partySourced: true,
    candidateType: `party_${kind}`,
    ruleId: `party_${kind}`,
    ruleFamily: 'party',
    severity: clamp01(fields.severity ?? 0.5),
    headline: action.label || fields.headline || 'Party action',
    summary: action.note || fields.summary || '',
    reasons: partyReasons(action, fields.reasons || []),
    ...fields,
  };
}

/** Find an NPC/faction world-state key for a settlement + raw id or name. */
function resolveStateKey(states = {}, settlementId, rawId) {
  const want = stablePart(rawId);
  const sid = String(settlementId);
  for (const [key, state] of Object.entries(states)) {
    if (String(state.settlementId) !== sid) continue;
    if (key === rawId) return key;
    if (key === `${sid}:${want}`) return key;
    if (stablePart(state.name) === want || stablePart(state.npcId || state.factionId) === want) return key;
  }
  return `${sid}:${want}`; // best-effort synthetic key
}

/**
 * Build the world-pulse outcomes for a single party action, plus any direct
 * worldState/settlement mutations that the outcome pipeline can't express
 * (stressor resolution, condition removal).
 *
 * @param {any} action
 * @param {{ worldState?: any, snapshot?: any, tick?: number, now?: (string|null) }} [options]
 * @returns {{ outcomes: any[], worldState: any, settlementOverrides: Map<string, any>, ok: boolean }}
 */
export function buildPartyImpactOutcomes(action, { worldState, snapshot, tick = 0, now = null } = {}) {
  const state = ensureWorldState(worldState);
  const kind = action?.kind;
  const spec = PARTY_IMPACT_KINDS[kind];
  if (!spec) return { outcomes: [], worldState: state, settlementOverrides: new Map(), ok: false };

  const magnitude = clamp01(action.magnitude ?? spec.defaultMagnitude);
  const outcomes = [];
  const settlementOverrides = new Map();
  let nextState = state;

  switch (kind) {
    case 'resolve_stressor': {
      const { stressors, residualOutcomes, found } = resolveStressorById(state.stressors, action.stressorId, { tick, now, reason: action.label });
      if (!found) return { outcomes: [], worldState: state, settlementOverrides, ok: false };
      nextState = { ...state, stressors };
      // The crisis ended; its scars linger as residual conditions (auto).
      for (const residual of residualOutcomes) {
        outcomes.push({ ...residual, partySourced: true, candidateType: 'party_stressor_residual', reasons: partyReasons(action, residual.reasons || []) });
      }
      break;
    }

    case 'ease_stressor':
    case 'worsen_stressor': {
      const delta = (kind === 'ease_stressor' ? -1 : 1) * (0.18 + magnitude * 0.42);
      const { stressors, changed } = adjustStressorSeverityById(state.stressors, action.stressorId, delta, { now });
      if (!changed) return { outcomes: [], worldState: state, settlementOverrides, ok: false };
      nextState = { ...state, stressors };
      break;
    }

    case 'broker_relationship':
    case 'inflame_relationship': {
      const key = action.relationshipKey;
      if (!key) return { outcomes: [], worldState: state, settlementOverrides, ok: false };
      const current = ensureRelationshipState({}, state.relationshipStates?.[key]);
      const fromType = current.relationshipType;
      const broker = kind === 'broker_relationship';
      const steps = (broker ? 1 : -1) * Math.max(1, Math.round(magnitude * 2));
      const toType = ladderShift(fromType, steps);
      const m = magnitude;
      const patch = broker
        ? {
            trust: clamp01(current.trust + 0.12 * m),
            resentment: clamp01(current.resentment - 0.16 * m),
            fear: clamp01(current.fear - 0.16 * m),
            pactStrength: clamp01(current.pactStrength + 0.06 * m),
          }
        : {
            trust: clamp01(current.trust - 0.16 * m),
            resentment: clamp01(current.resentment + 0.18 * m),
            fear: clamp01(current.fear + 0.14 * m),
          };
      outcomes.push(baseOutcome(action, kind, {
        type: 'relationship',
        relationshipKey: key,
        severity: 0.4 + m * 0.4,
        relationshipPatch: { ...patch, trajectory: broker ? 'thawing' : 'deteriorating' },
        proposalPayload: toType !== fromType
          ? { kind: 'relationship_label_change', relationshipKey: key, fromType, toType, reason: action.label || `Party ${broker ? 'brokered' : 'inflamed'} relations.` }
          : null,
        metadata: { incidentType: `party_${kind}`, fromType, toType },
        reasons: [`Relationship shifts ${fromType.replace(/_/g, ' ')} → ${toType.replace(/_/g, ' ')}.`],
      }));
      break;
    }

    case 'clear_condition': {
      const target = snapshot?.byId?.get?.(String(action.settlementId));
      const settlement = target?.settlement;
      if (!settlement) return { outcomes: [], worldState: state, settlementOverrides, ok: false };
      // Derive to canonical (stable ids) first so removal works even when the
      // stored conditions were raw / id-less.
      const all = deriveAllActiveConditions(settlement);
      const existing = all.find(c => c.id === action.condition || c.archetype === action.condition);
      const cleared = existing
        ? { ...settlement, activeConditions: all.filter(c => c.id !== existing.id) }
        : { ...settlement, activeConditions: all };
      settlementOverrides.set(String(action.settlementId), cleared);
      // Optional recovery condition (e.g. a lifted siege leaves a recovering town).
      if (action.recoveryArchetype) {
        outcomes.push(baseOutcome(action, kind, {
          type: 'condition',
          targetSaveId: action.settlementId,
          severity: 0.3,
          condition: deriveActiveCondition({
            archetype: action.recoveryArchetype,
            severity: 0.3,
            status: 'easing',
            triggeredAt: { tick, sourceEventType: 'PARTY_ACTION', sourceEventTargetId: action.settlementId },
          }),
          reasons: [`A resolved crisis leaves the settlement recovering (${String(action.recoveryArchetype).replace(/_/g, ' ')}).`],
        }));
      }
      break;
    }

    case 'impose_condition': {
      outcomes.push(baseOutcome(action, kind, {
        type: 'condition',
        targetSaveId: action.settlementId,
        severity: magnitude,
        condition: deriveActiveCondition({
          archetype: action.archetype,
          severity: magnitude,
          status: magnitude >= 0.7 ? 'worsening' : 'stable',
          triggeredAt: { tick, sourceEventType: 'PARTY_ACTION', sourceEventTargetId: action.settlementId },
        }),
      }));
      break;
    }

    case 'bolster_faction':
    case 'undermine_faction': {
      const key = resolveStateKey(state.factionStates, action.settlementId, action.factionId);
      const cur = state.factionStates?.[key] || {};
      const up = kind === 'bolster_faction';
      const m = magnitude;
      outcomes.push(baseOutcome(action, kind, {
        type: 'faction',
        targetSaveId: action.settlementId,
        factionId: key,
        severity: 0.4 + m * 0.3,
        factionPatch: {
          legitimacyClaim: clamp01((cur.legitimacyClaim || 0.2) + (up ? 1 : -1) * 0.18 * m),
          momentum: clamp01((cur.momentum || 0) + (up ? 1 : -1) * 0.16 * m),
          exhaustion: clamp01((cur.exhaustion || 0) + (up ? -0.1 : 0.12) * m),
          lastActedTick: tick,
          recentAction: kind,
        },
      }));
      break;
    }

    case 'empower_npc': {
      const key = resolveStateKey(state.npcStates, action.settlementId, action.npcId);
      const cur = state.npcStates?.[key] || {};
      outcomes.push(baseOutcome(action, kind, {
        type: 'npc',
        targetSaveId: action.settlementId,
        npcId: key,
        severity: 0.4 + magnitude * 0.3,
        npcPatch: {
          loyalty: clamp01((cur.loyalty ?? 0.5) + 0.12 * magnitude),
          momentum: clamp01((cur.momentum || 0) + 0.16 * magnitude),
          leverage: clamp01((cur.leverage || 0) + 0.1 * magnitude),
          lastActedTick: tick,
          lastAction: 'party_empowered',
        },
      }));
      break;
    }

    case 'remove_npc': {
      const key = resolveStateKey(state.npcStates, action.settlementId, action.npcId);
      const cur = state.npcStates?.[key];
      // The headline effect is a leadership void on the settlement.
      outcomes.push(baseOutcome(action, kind, {
        type: 'condition',
        targetSaveId: action.settlementId,
        severity: 0.45 + magnitude * 0.2,
        condition: deriveActiveCondition({
          archetype: 'dominant_npc_removed',
          severity: 0.45 + magnitude * 0.2,
          status: 'stable',
          triggeredAt: { tick, sourceEventType: 'PARTY_ACTION', sourceEventTargetId: action.npcId },
        }),
        reasons: [`${action.npcId} is removed from play; succession is unresolved.`],
      }));
      if (cur) {
        outcomes.push(baseOutcome(action, 'remove_npc_state', {
          type: 'npc',
          targetSaveId: action.settlementId,
          npcId: key,
          severity: 0.4,
          npcPatch: { loyalty: 0, momentum: 0, leverage: 0, removed: true, lastActedTick: tick, lastAction: 'party_removed' },
        }));
      }
      break;
    }

    default:
      return { outcomes: [], worldState: state, settlementOverrides, ok: false };
  }

  return { outcomes, worldState: nextState, settlementOverrides, ok: true };
}

/**
 * Apply a party action to a campaign. Returns the same result shape as
 * `advanceCampaignWorld` (worldState, regionalGraph, wizardNews,
 * settlementUpdates, autoApplied, …) so the store can persist it identically.
 * Returns null when the action is invalid or affects nothing.
 *
 * @param {Object} [args]
 * @param {any} [args.campaign]
 * @param {any[]} [args.saves]
 * @param {any} [args.action]   { kind, settlementId?, relationshipKey?, stressorId?, npcId?, factionId?, magnitude?, label?, note? }
 * @param {(string|null)} [args.now]
 */
export function applyPartyImpact({ campaign, saves = [], action, now = null } = {}) {
  if (!action || !PARTY_IMPACT_KINDS[action.kind]) return null;
  const worldState = ensureWorldState(campaign?.worldState, campaign);
  const tick = worldState.tick;
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });

  const built = buildPartyImpactOutcomes(action, { worldState, snapshot, tick, now });
  if (!built.ok) return null;

  // Settlement map for the apply pipeline; apply any direct condition removals.
  const settlementMap = new Map();
  for (const item of snapshot.settlements) {
    const override = built.settlementOverrides.get(String(item.id));
    settlementMap.set(String(item.id), {
      saveId: String(item.id),
      save: item.save,
      settlement: override || item.settlement,
    });
  }

  const result = applyWorldPulseOutcomes({
    snapshot,
    worldState: built.worldState,
    regionalGraph: snapshot.regionalGraph,
    wizardNews: campaign?.wizardNews,
    settlementMap,
    outcomes: built.outcomes,
    tick,
    now,
    // Party impacts are a discrete injection, not a time advance.
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: built.worldState?.simulationRules,
  });

  return {
    ...result,
    campaignId: campaign?.id,
    tick,
    partyAction: action,
    settlementUpdates: (result.settlementUpdates || []).map(update => ({
      ...update,
      settlement: update.settlement == null ? update.settlement : JSON.parse(JSON.stringify(update.settlement)),
    })),
  };
}
