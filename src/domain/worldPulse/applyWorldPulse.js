import { withActiveCondition } from '../activeConditions.js';
import {
  advanceRegionalImpacts,
  advanceWizardNewsFeed,
  appendWizardNewsEntries,
  deriveWizardNewsEntriesFromGraphChange,
  ensureRegionalGraph,
  propagateRegionalEvent,
  syncRelationshipChannelBundle,
} from '../region/index.js';
import { applyRelationshipPatch, relationshipKeyFromEdge } from './relationshipEvolution.js';
import { refreshRelationshipMemory } from './relationshipMemory.js';
import { resolveRelationshipHierarchy } from './relationshipHierarchy.js';
import { applyNpcPatch } from './npcAgency.js';
import { applyFactionPatch } from './factionCompetition.js';
import { proposalIdFor, updateProposalStatus, upsertProposal } from './worldState.js';
import { applyPopulationOutcomeToSettlement } from './populationDynamics.js';
import { applyResourceOutcomeToSettlement, applyTierOutcomeToSettlement } from './tierResourceDynamics.js';
import { normalizeSimulationRules, propagationDepthForRules } from './simulationRules.js';

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function clamp01(value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

function newsEntryForOutcome(outcome, tick, status = 'applied') {
  const major = outcome.applyMode === 'proposal' || outcome.severity >= 0.72 || (outcome.affectedSettlementIds || []).length >= 3;
  return {
    id: `wizard_news.${tick}.world_pulse.${status}.${outcome.id}`,
    tick,
    scope: (outcome.affectedSettlementIds || []).length >= 3 ? 'realm' : outcome.relationshipKey ? 'regional' : 'settlement',
    significance: major ? 'major' : 'notable',
    score: Math.round(clamp01(outcome.severity) * 80) + (major ? 18 : 0),
    headline: outcome.headline || 'World pulse update',
    summary: outcome.summary || '',
    kind: status === 'proposal' ? 'queued' : 'applied',
    impactKind: outcome.candidateType || outcome.type,
    channelType: null,
    severity: outcome.severity,
    settlementIds: outcome.affectedSettlementIds || [outcome.targetSaveId].filter(Boolean),
    impactIds: [],
    channelIds: [],
    sourceEventId: outcome.id,
    tags: ['world_pulse', outcome.type, outcome.candidateType, status].filter(Boolean),
    reasons: outcome.reasons || [],
  };
}

function affectedSaveIdsForOutcome(outcome) {
  const ids = new Set();
  for (const delta of outcome.populationDeltas || []) {
    if (delta?.saveId) ids.add(String(delta.saveId));
  }
  if (outcome.targetSaveId && (outcome.condition || outcome.tierChange || outcome.resourcePatch)) {
    ids.add(String(outcome.targetSaveId));
  }
  return [...ids];
}

function applyOutcomeToSettlement(settlement, outcome, saveId) {
  if (!settlement || !outcome) return settlement;
  let next = settlement;
  if (outcome.populationDeltas?.length) {
    next = applyPopulationOutcomeToSettlement(next, outcome, saveId);
  }
  if (outcome.tierChange && String(outcome.targetSaveId) === String(saveId)) {
    next = applyTierOutcomeToSettlement(next, outcome);
  }
  if (outcome.resourcePatch && String(outcome.targetSaveId) === String(saveId)) {
    next = applyResourceOutcomeToSettlement(next, outcome);
  }
  if (outcome.condition && String(outcome.targetSaveId) === String(saveId)) {
    next = withActiveCondition(next, outcome.condition);
  }
  return next;
}

function settlementChanged(beforeSettlement, afterSettlement) {
  if (beforeSettlement === afterSettlement) return false;
  try {
    return JSON.stringify(beforeSettlement) !== JSON.stringify(afterSettlement);
  } catch {
    return true;
  }
}

function saveLike(entry, settlement) {
  return {
    id: String(entry.saveId),
    name: entry.save?.name || settlement?.name || String(entry.saveId),
    settlement,
  };
}

function applyRelationshipLabelToGraph(graph, outcome, now) {
  if (outcome.proposalPayload?.kind !== 'relationship_label_change') return graph;
  const { relationshipKey, toType } = outcome.proposalPayload;
  return {
    ...graph,
    edges: (graph.edges || []).map(edge => {
      if (relationshipKeyFromEdge(edge) !== relationshipKey) return edge;
      return {
        ...edge,
        relationshipType: toType,
        type: edge.type === edge.relationshipType || !edge.type ? toType : edge.type,
        updatedAt: now,
      };
    }),
  };
}

function relationshipEdgeForOutcome(graph, outcome) {
  const key = outcome.proposalPayload?.relationshipKey || outcome.relationshipKey;
  if (!key) return null;
  return (graph.edges || []).find(edge => relationshipKeyFromEdge(edge) === key) || null;
}

/**
 * @param {Object} [args]
 * @param {any} [args.snapshot]
 * @param {any} [args.worldState]
 * @param {any} [args.regionalGraph]
 * @param {any} [args.wizardNews]
 * @param {Map<string, any>} [args.settlementMap]
 * @param {any[]} [args.outcomes]
 * @param {number} [args.tick]
 * @param {string} [args.now]
 * @param {boolean} [args.advanceNewsTick]
 * @param {boolean} [args.advanceRegionalImpacts]
 * @param {any} [args.simulationRules]
 */
export function applyWorldPulseOutcomes({
  snapshot,
  worldState,
  regionalGraph,
  wizardNews,
  settlementMap,
  outcomes = [],
  tick,
  now,
  advanceNewsTick = true,
  advanceRegionalImpacts: shouldAdvanceRegionalImpacts = true,
  simulationRules = null,
} = {}) {
  let graph = ensureRegionalGraph(regionalGraph || snapshot.regionalGraph);
  let state = worldState;
  const rules = normalizeSimulationRules(simulationRules || worldState?.simulationRules || snapshot?.worldState?.simulationRules);
  const propagationDepth = propagationDepthForRules(rules);
  let feed = !advanceNewsTick
    ? (wizardNews || snapshot.campaign?.wizardNews)
    : advanceWizardNewsFeed(wizardNews || snapshot.campaign?.wizardNews, 1);
  const settlementUpdates = new Map(settlementMap ? [...settlementMap.entries()] : []);
  const autoApplied = [];
  const proposals = [];
  const newsEntries = [];

  for (const outcome of outcomes) {
    if (outcome.applyMode === 'proposal') {
      const proposal = {
        id: proposalIdFor(outcome, tick),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        tick,
        outcome: clone(outcome),
        headline: outcome.headline,
        summary: outcome.summary,
        severity: outcome.severity,
        reasons: outcome.reasons || [],
      };
      state = upsertProposal(state, proposal);
      proposals.push(proposal);
      newsEntries.push(newsEntryForOutcome(outcome, tick, 'proposal'));
      continue;
    }

    for (const saveId of affectedSaveIdsForOutcome(outcome)) {
      const entry = settlementUpdates.get(String(saveId));
      if (!entry) continue;
      const beforeSettlement = entry.settlement;
      const afterSettlement = applyOutcomeToSettlement(beforeSettlement, outcome, saveId);
      if (!settlementChanged(beforeSettlement, afterSettlement)) continue;
      settlementUpdates.set(String(saveId), { ...entry, settlement: afterSettlement });
      if (propagationDepth > 0) {
        const beforeGraph = graph;
        const propagation = propagateRegionalEvent({
          graph,
          beforeSettlement: saveLike(entry, beforeSettlement),
          afterSettlement: saveLike(entry, afterSettlement),
          event: {
            id: outcome.id,
            type: 'WORLD_PULSE',
            targetId: saveId,
            payload: {
              severity: outcome.severity,
              candidateType: outcome.candidateType,
              outcomeType: outcome.type,
            },
          },
          activeSettlementId: outcome.targetSaveId || saveId,
          visibleSettlementIds: snapshot.settlements.map(item => item.id),
          maxDepth: propagationDepth,
          now,
        });
        graph = propagation.graph;
        newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeGraph, graph, { tick, createdAt: now }));
      }
    }

    if (outcome.relationshipKey && outcome.relationshipPatch) {
      state = applyRelationshipPatch(state, outcome, now);
      graph = applyRelationshipLabelToGraph(graph, outcome, now);
      if (outcome.proposalPayload?.kind === 'relationship_label_change') {
        const edge = relationshipEdgeForOutcome(graph, outcome);
        if (edge) {
          graph = syncRelationshipChannelBundle(graph, edge, outcome.proposalPayload.toType, {
            now,
            status: 'confirmed',
            outcomeId: outcome.id,
            relationshipKey: outcome.proposalPayload.relationshipKey,
            reason: outcome.proposalPayload.reason,
          });
          if (outcome.proposalPayload.toType === 'vassal') {
            const hierarchy = resolveRelationshipHierarchy({
              worldState: state,
              regionalGraph: graph,
              vassalEdge: edge,
              now,
              tick,
            });
            state = hierarchy.worldState;
            graph = hierarchy.regionalGraph;
            for (const change of hierarchy.changes) {
              graph = syncRelationshipChannelBundle(graph, change.edge, change.toType, {
                now,
                status: 'confirmed',
                outcomeId: outcome.id,
                relationshipKey: change.relationshipKey,
                reason: change.reason,
              });
            }
          }
        }
      }
    }
    if (outcome.type === 'npc') state = applyNpcPatch(state, outcome);
    if (outcome.type === 'faction') state = applyFactionPatch(state, outcome);
    if (outcome.type === 'stressor' && outcome.stressor) {
      const byId = new Map((state.stressors || []).map(stressor => [stressor.id, stressor]));
      byId.set(outcome.stressor.id, { ...outcome.stressor, createdAt: now, updatedAt: now });
      state = { ...state, stressors: [...byId.values()] };
    }
    autoApplied.push(outcome);
    newsEntries.push(newsEntryForOutcome(outcome, tick, 'applied'));
  }

  if (shouldAdvanceRegionalImpacts && propagationDepth > 0) {
    const beforeRegionalAdvance = graph;
    graph = advanceRegionalImpacts(graph, 1, { currentTick: tick });
    newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeRegionalAdvance, graph, { tick, createdAt: now }));
  }
  feed = appendWizardNewsEntries(feed, newsEntries);
  state = refreshRelationshipMemory(state, graph, snapshot, { currentTick: tick });

  return {
    worldState: state,
    regionalGraph: graph,
    wizardNews: feed,
    settlementUpdates: [...settlementUpdates.values()],
    autoApplied,
    proposals,
    newsEntries,
  };
}

/**
 * @param {Object} [args]
 * @param {any} [args.campaign]
 * @param {any[]} [args.saves]
 * @param {string} [args.proposalId]
 * @param {string} [args.now]
 */
export function applyWorldPulseProposal({ campaign, saves = [], proposalId, now = new Date().toISOString() } = {}) {
  const proposal = (campaign?.worldState?.proposals || []).find(item => item.id === proposalId);
  if (!proposal || proposal.status !== 'pending') return null;
  const outcome = { ...(proposal.outcome || {}), applyMode: 'auto' };
  const settlementMap = new Map((saves || []).map(save => [String(save.id || save.settlement?.id), { saveId: String(save.id || save.settlement?.id), save, settlement: save.settlement || save }]));
  const snapshot = {
    campaign,
    regionalGraph: ensureRegionalGraph(campaign?.regionalGraph),
    settlements: [...settlementMap.values()].map(item => ({ id: item.saveId, settlement: item.settlement, name: item.settlement?.name || item.save?.name || item.saveId })),
  };
  const result = applyWorldPulseOutcomes({
    snapshot,
    worldState: updateProposalStatus(campaign.worldState, proposalId, 'applied', { appliedAt: now }),
    regionalGraph: campaign.regionalGraph,
    wizardNews: campaign.wizardNews,
    settlementMap,
    outcomes: [outcome],
    tick: campaign.worldState?.tick || proposal.tick || 0,
    now,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: campaign.worldState?.simulationRules,
  });
  result.worldState = updateProposalStatus(result.worldState, proposalId, 'applied', { appliedAt: now });
  return result;
}
