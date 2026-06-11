import { withActiveCondition } from '../activeConditions.js';
import {
  advanceRegionalImpacts,
  appendWizardNewsEntries,
  deriveWizardNewsEntriesFromGraphChange,
  ensureRegionalGraph,
  ensureWizardNewsFeed,
  propagateRegionalEvent,
  syncRelationshipChannelBundle,
} from '../region/index.js';
import { applyRelationshipPatch, relationshipKeyFromEdge } from './relationshipEvolution.js';
import { refreshRelationshipMemory } from './relationshipMemory.js';
import { resolveRelationshipHierarchy } from './relationshipHierarchy.js';
import { applyNpcPatch, npcId } from './npcAgency.js';
import { windDownSponsoredStressors } from './stressorDynamics.js';
import { npcCorruptibleFlaw, corruptionVectorForFlaw } from '../corruption.js';
import { applyFactionPatch } from './factionCompetition.js';
import { proposalIdFor, updateProposalStatus, upsertProposal } from './worldState.js';
import { applyPopulationOutcomeToSettlement } from './populationDynamics.js';
import { applyResourceOutcomeToSettlement, applyTierOutcomeToSettlement } from './tierResourceDynamics.js';
import { applyInstitutionLifecycleOutcome } from './institutionLifecycle.js';
import { normalizeSimulationRules, propagationDepthForRules } from './simulationRules.js';
import { transferRulingPower } from '../rulingPower.js';

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
  if (outcome.targetSaveId && (outcome.condition || outcome.tierChange || outcome.resourcePatch || outcome.institutionPatch || outcome.powerTransfer)) {
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
  if (outcome.institutionPatch && String(outcome.targetSaveId) === String(saveId)) {
    next = applyInstitutionLifecycleOutcome(next, outcome);
  }
  // A coup verdict (or any future power_transfer outcome) reshapes the
  // governing seat through the same domain path the CHANGE_RULING_POWER
  // canon event uses. A transfer that no longer applies (the named faction
  // is gone, or already governs) safely no-ops; the condition below still
  // records the turmoil.
  if (outcome.powerTransfer && String(outcome.targetSaveId) === String(saveId)) {
    const result = transferRulingPower(next, outcome.powerTransfer.toPowerName, {
      cause: outcome.powerTransfer.cause || 'coup',
      tick: outcome.powerTransfer.tick ?? null,
      losers: outcome.powerTransfer.losers || [],
    });
    if (!result.error) next = result.settlement;
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

const IMPORTANCE_RANK = Object.freeze({ pillar: 3, key: 2, notable: 1 });

/**
 * A betrayal stressor's birth seeds the traitor its variant implies — ONE
 * corrupted NPC, dependent on already-existing factors: there must be an
 * NPC with a corruptible flaw to turn (no flaw, no traitor). Unlike the
 * organic corruption loop this does NOT require a criminal institution —
 * the patron is the foreign sponsor (or the conspiracy itself), recorded on
 * corruptTies.foreignPatron. Deterministic pick: most notable eligible NPC,
 * name as tiebreak. Covert by design: no news entry — the DM finds the
 * corrupt flag in the dossier, the table finds it the hard way.
 */
function seedBetrayalTraitor({ state, settlementUpdates, saveId, originContext, now }) {
  const sid = String(saveId || '');
  const entry = settlementUpdates.get(sid);
  const npcs = entry?.settlement?.npcs;
  if (!Array.isArray(npcs) || !npcs.length) return state;
  const eligible = npcs
    .map((npc, index) => ({ npc, index, flaw: npcCorruptibleFlaw(npc) }))
    .filter(c => c.flaw && c.npc.corrupt !== true && !c.npc.ousted);
  if (!eligible.length) return state;
  // Codepoint tiebreak, NOT localeCompare: this sort decides WHICH NPC turns
  // traitor, and default-locale collation can reorder accented names across
  // machines, breaking replay determinism.
  eligible.sort((a, b) => {
    const rank = (IMPORTANCE_RANK[b.npc.importance] || 0) - (IMPORTANCE_RANK[a.npc.importance] || 0);
    if (rank) return rank;
    const an = String(a.npc.name || '');
    const bn = String(b.npc.name || '');
    return an < bn ? -1 : an > bn ? 1 : 0;
  });
  const chosen = eligible[0];
  const foreign = ['foreign_sponsored', 'abandoned_agent'].includes(originContext.variant);
  const vector = foreign ? 'forbidden_patron' : corruptionVectorForFlaw(chosen.flaw);
  const corruptTies = {
    criminalInstitution: null,
    thievesGuild: null,
    foreignPatron: originContext.sponsorSettlementId || originContext.formerSponsorSettlementId || null,
    conspiracy: originContext.variant,
  };
  const nextNpcs = npcs.map((npc, index) => (index === chosen.index
    ? { ...npc, corrupt: true, corruptionVector: vector, corruptTies }
    : npc));
  settlementUpdates.set(sid, { ...entry, settlement: { ...entry.settlement, npcs: nextNpcs } });
  // Mirror into npcStates immediately so the same-tick world view agrees
  // (ensureNpcStates treats the settlement boolean as authoritative anyway).
  const id = npcId(sid, chosen.npc, chosen.index);
  const st = state.npcStates?.[id];
  if (!st) return state;
  return {
    ...state,
    npcStates: {
      ...state.npcStates,
      [id]: {
        ...st,
        corruption: true,
        corruptionProfile: { corrupted: true, vector },
        corruptionHeat: Math.max(st.corruptionHeat || 0, 0.3),
      },
    },
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
  // worldState.tick is the authoritative clock: SYNC currentTick to it (not
  // +1) so a manual impact-advance press cannot permanently skew which tick
  // this pulse's entries (all stamped with `tick`) group and ground under.
  let feed = ensureWizardNewsFeed(wizardNews || snapshot.campaign?.wizardNews);
  if (advanceNewsTick) {
    feed = {
      ...feed,
      currentTick: Number.isFinite(tick) ? Math.max(0, Math.floor(tick)) : feed.currentTick + 1,
    };
  }
  const settlementUpdates = new Map(settlementMap ? [...settlementMap.entries()] : []);
  const autoApplied = [];
  const proposals = [];
  const newsEntries = [];

  // Time advances BEFORE this tick's propagation queues: the previous pulse's
  // delayed impacts mature now, while impacts the loop below queues stay
  // un-aged until the NEXT pulse — delayTicks:1 means "next tick", never
  // "later this same tick" (the party/proposal paths already pass
  // advanceRegionalImpacts:false for the same reason).
  if (shouldAdvanceRegionalImpacts && propagationDepth > 0) {
    const beforeRegionalAdvance = graph;
    graph = advanceRegionalImpacts(graph, 1, { currentTick: tick });
    newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeRegionalAdvance, graph, { tick, createdAt: now }));
  }

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
      // Capture the pre-change label: the wind-down handshake below needs to
      // know the edge WAS hostile before this outcome rewrote it.
      const beforeEdge = relationshipEdgeForOutcome(graph, outcome);
      const beforeType = beforeEdge ? String(beforeEdge.relationshipType || beforeEdge.type || '') : null;
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
        // Wars end when the WAR ends: a hostile edge de-escalating winds down
        // the siege/wartime/betrayal stressors that hostility sponsored,
        // instead of leaving them to bleed out at 0.02/tick while the former
        // belligerents trade politely.
        if (beforeType === 'hostile' && outcome.proposalPayload.toType !== 'hostile') {
          const wind = windDownSponsoredStressors(state, beforeEdge || edge, {
            tick,
            now,
            toType: outcome.proposalPayload.toType,
          });
          state = wind.worldState;
          for (const stressor of wind.woundDown) {
            newsEntries.push({
              id: `wizard_news.${tick}.wind_down.${stressor.id}`,
              tick,
              scope: 'regional',
              significance: 'notable',
              score: 52,
              headline: `${stressor.label} winds down`,
              summary: 'The hostility that drove it has ended; the pressure is collapsing.',
              kind: 'applied',
              impactKind: 'stressor_wind_down',
              channelType: null,
              severity: stressor.severity,
              settlementIds: stressor.affectedSettlementIds || [],
              impactIds: [],
              channelIds: [],
              sourceEventId: outcome.id,
              tags: ['world_pulse', 'stressor', 'wind_down'],
              reasons: ['The sponsoring relationship de-escalated.'],
            });
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
      // A betrayal's birth seeds the traitor its variant implies (one corrupt
      // NPC, gated on an existing corruptible flaw — no flaw, no traitor).
      if (outcome.stressor.type === 'betrayal'
          && String(outcome.candidateType || '').startsWith('stressor_birth')
          && outcome.stressor.originContext) {
        state = seedBetrayalTraitor({
          state,
          settlementUpdates,
          saveId: outcome.targetSaveId,
          originContext: outcome.stressor.originContext,
          now,
        });
      }
    }
    autoApplied.push(outcome);
    newsEntries.push(newsEntryForOutcome(outcome, tick, 'applied'));
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
    // updatedAt threaded explicitly: updateProposalStatus falls back to the
    // wall clock for it, which would break replay-identical worldState.
    worldState: updateProposalStatus(campaign.worldState, proposalId, 'applied', { appliedAt: now, updatedAt: now }),
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
  result.worldState = updateProposalStatus(result.worldState, proposalId, 'applied', { appliedAt: now, updatedAt: now });
  return result;
}
