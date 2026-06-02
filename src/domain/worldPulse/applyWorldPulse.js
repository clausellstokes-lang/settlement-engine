import { withActiveCondition } from '../activeConditions.js';
import {
  advanceRegionalImpacts,
  advanceWizardNewsFeed,
  appendWizardNewsEntries,
  deriveWizardNewsEntriesFromGraphChange,
  ensureRegionalGraph,
  propagateRegionalEvent,
} from '../region/index.js';
import { applyRelationshipPatch, relationshipKeyFromEdge } from './relationshipEvolution.js';
import { applyNpcPatch } from './npcAgency.js';
import { applyFactionPatch } from './factionCompetition.js';
import { proposalIdFor, updateProposalStatus, upsertProposal } from './worldState.js';

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

function applyOutcomeToSettlement(settlement, outcome) {
  if (!settlement || !outcome?.condition) return settlement;
  return withActiveCondition(settlement, outcome.condition);
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
} = {}) {
  let graph = ensureRegionalGraph(regionalGraph || snapshot.regionalGraph);
  let state = worldState;
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

    const beforeGraph = graph;
    const target = outcome.targetSaveId ? settlementUpdates.get(String(outcome.targetSaveId)) : null;
    if (target && outcome.condition) {
      const beforeSettlement = target.settlement;
      const afterSettlement = applyOutcomeToSettlement(beforeSettlement, outcome);
      settlementUpdates.set(String(outcome.targetSaveId), { ...target, settlement: afterSettlement });
      const propagation = propagateRegionalEvent({
        graph,
        beforeSettlement,
        afterSettlement,
        event: { id: outcome.id, type: 'WORLD_PULSE', targetId: outcome.targetSaveId, payload: { severity: outcome.severity } },
        activeSettlementId: outcome.targetSaveId,
        visibleSettlementIds: snapshot.settlements.map(item => item.id),
        maxDepth: 2,
      });
      graph = propagation.graph;
      newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeGraph, graph, { tick, createdAt: now }));
    }

    if (outcome.relationshipKey && outcome.relationshipPatch) {
      state = applyRelationshipPatch(state, outcome, now);
      graph = applyRelationshipLabelToGraph(graph, outcome, now);
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

  if (shouldAdvanceRegionalImpacts) {
    const beforeRegionalAdvance = graph;
    graph = advanceRegionalImpacts(graph, 1, { currentTick: tick });
    newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeRegionalAdvance, graph, { tick, createdAt: now }));
  }
  feed = appendWizardNewsEntries(feed, newsEntries);

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
  });
  result.worldState = updateProposalStatus(result.worldState, proposalId, 'applied', { appliedAt: now });
  return result;
}
