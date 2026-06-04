import { evaluateFactionRules } from './factionCompetition.js';
import { evaluateNpcRules } from './npcAgency.js';
import { evaluateRelationshipRules } from './relationshipEvolution.js';
import { evaluateStressorRules, stressorCandidateForPressure } from './stressors.js';
import { deriveFlowCandidates } from './flows.js';
import { normalizeSimulationRules } from './simulationRules.js';

function stablePart(value) {
  return String(value || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/**
 * World volatility scales every candidate's roll probability. `normal` is 1.0
 * (a no-op, so default behavior — and the determinism fixtures — are
 * unchanged); `calm` dampens the world, `turbulent` makes events more likely.
 * A DM-facing dial set on campaign.worldState.volatility.
 */
export const VOLATILITY_MULTIPLIERS = Object.freeze({
  calm: 0.6,
  normal: 1.0,
  turbulent: 1.6,
});

export function volatilityMultiplier(volatility) {
  return VOLATILITY_MULTIPLIERS[volatility] ?? 1.0;
}

function pressureConditionCandidate(pressure, tick) {
  if (!pressure || pressure.score < 0.5) return null;
  const archetypeByKind = {
    food: 'famine',
    disease: 'plague',
    conflict: 'war_pressure',
    trade: 'regional_route_disruption',
    legitimacy: 'faction_challenge',
    crime: 'regional_criminal_pressure',
  };
  const labelByKind = {
    food: 'Famine pressure',
    disease: 'Disease outbreak',
    conflict: 'Wartime pressure',
    trade: 'Trade route strain',
    legitimacy: 'Legitimacy challenge',
    crime: 'Criminal pressure',
  };
  const archetype = archetypeByKind[pressure.kind];
  if (!archetype) return null;
  return {
    id: `candidate.condition.${stablePart(pressure.kind)}.${stablePart(pressure.settlementId)}.${tick}`,
    type: 'condition',
    candidateType: `${pressure.kind}_pressure`,
    ruleId: `organic_settlement_${pressure.kind}_pressure`,
    ruleFamily: 'organic_drift',
    targetSaveId: pressure.settlementId,
    severity: pressure.score,
    probability: Math.min(0.42, 0.06 + pressure.score * 0.3),
    applyMode: pressure.score >= 0.72 ? 'proposal' : 'auto',
    headline: `${labelByKind[pressure.kind]} may take hold`,
    summary: `${pressure.settlementName} shows enough ${pressure.label.toLowerCase()} for a new condition to emerge.`,
    reasons: [
      ...pressure.reasons,
      'Organic settlement drift is conservative: pressure must pass a gate before it can roll.',
    ],
    condition: {
      archetype,
      label: labelByKind[pressure.kind],
      description: `${labelByKind[pressure.kind]} emerged from accumulated campaign pressure.`,
      severity: pressure.score,
      status: pressure.score >= 0.7 ? 'worsening' : 'stable',
      duration: { elapsedTicks: 0, expiresAtTicks: pressure.score >= 0.75 ? 10 : 6 },
      triggeredAt: { tick, sourceEventType: 'WORLD_PULSE_PRESSURE', sourceEventTargetId: pressure.settlementId },
      affectedSystems: ['public_legitimacy', 'trade_connectivity'],
      causes: pressure.reasons.map(reason => ({ source: 'world_pulse', effect: pressure.kind, reason })),
    },
    metadata: {
      pressureKind: pressure.kind,
      pressureScore: pressure.score,
    },
    conflictTags: [`settlement:${pressure.settlementId}:organic:${pressure.kind}`],
  };
}

function candidateIdentity(candidate) {
  return [
    candidate.type,
    candidate.candidateType,
    candidate.targetSaveId || candidate.relationshipKey || candidate.factionId || candidate.npcId || candidate.id,
  ].join(':');
}

function exclusiveTags(candidate) {
  return (candidate.conflictTags || []).filter(tag =>
    /^label:/.test(tag)
    || /:government_change$/.test(tag)
    || /:institution:/.test(tag)
    || /:stressor_birth$/.test(tag)
    || /^stressor:[^:]+:[^:]+$/.test(tag)
    || /^npc:[^:]+$/.test(tag)
    || /^faction:[^:]+$/.test(tag)
  );
}

export function resolveCandidateConflicts(candidates = [], budgets = {}) {
  const maxCandidates = budgets.maxCandidates ?? 90;
  const maxPerSettlement = budgets.maxPerSettlement ?? 14;
  const maxRelationshipLabelProposals = budgets.maxRelationshipLabelProposals ?? 4;
  const maxGovernmentChallenges = budgets.maxGovernmentChallenges ?? 2;
  const maxNpcProposals = budgets.maxNpcProposals ?? 6;

  const deduped = new Map();
  for (const candidate of candidates.filter(Boolean)) {
    const key = candidate.id || candidateIdentity(candidate);
    const previous = deduped.get(key);
    if (!previous || (candidate.severity || 0) > (previous.severity || 0)) deduped.set(key, candidate);
  }

  const sorted = [...deduped.values()].sort((a, b) => {
    const modeA = a.applyMode === 'proposal' ? 0.02 : 0;
    const modeB = b.applyMode === 'proposal' ? 0.02 : 0;
    return (b.severity + modeB) - (a.severity + modeA);
  });

  const selected = [];
  const usedTags = new Map();
  const perSettlement = new Map();
  let labelProposalCount = 0;
  let governmentChallengeCount = 0;
  let npcProposalCount = 0;

  for (const candidate of sorted) {
    if (selected.length >= maxCandidates) break;
    const settlementKey = candidate.targetSaveId || candidate.metadata?.settlementId || 'realm';
    const settlementCount = perSettlement.get(settlementKey) || 0;
    if (settlementCount >= maxPerSettlement) continue;

    if (candidate.proposalPayload?.kind === 'relationship_label_change' && labelProposalCount >= maxRelationshipLabelProposals) continue;
    if (candidate.proposalPayload?.kind === 'government_change' && governmentChallengeCount >= maxGovernmentChallenges) continue;
    if (candidate.proposalPayload?.kind === 'npc_action' && npcProposalCount >= maxNpcProposals) continue;

    const tags = exclusiveTags(candidate);
    const blocker = tags.map(tag => usedTags.get(tag)).find(Boolean);
    if (blocker) continue;

    selected.push({
      ...candidate,
      conflictResolution: {
        selected: true,
        exclusiveTags: tags,
      },
    });
    for (const tag of tags) usedTags.set(tag, candidate.id || candidateIdentity(candidate));
    perSettlement.set(settlementKey, settlementCount + 1);
    if (candidate.proposalPayload?.kind === 'relationship_label_change') labelProposalCount += 1;
    if (candidate.proposalPayload?.kind === 'government_change') governmentChallengeCount += 1;
    if (candidate.proposalPayload?.kind === 'npc_action') npcProposalCount += 1;
  }

  return selected.sort((a, b) => b.severity - a.severity);
}

export function evaluateWorldPulseRules(snapshot, context = {}) {
  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const pressures = context.pressures || [];
  const pressureIndex = context.pressureIndex;
  const rules = normalizeSimulationRules(context.simulationRules || snapshot?.worldState?.simulationRules);
  const candidates = [];

  if (rules.emergentEventsEnabled) {
    candidates.push(
      ...pressures
        .map(pressure => pressureConditionCandidate(pressure, tick))
        .filter(Boolean),
    );
  }
  if (rules.stressorsEnabled) {
    candidates.push(...evaluateStressorRules(snapshot, pressureIndex, { ...context, tick, pressures, simulationRules: rules }));
  }
  if (rules.relationshipDynamicsEnabled) {
    candidates.push(...evaluateRelationshipRules(snapshot, pressureIndex, { ...context, tick, simulationRules: rules }));
  }
  if (rules.npcAgencyEnabled) {
    candidates.push(...evaluateNpcRules(snapshot, pressureIndex, { ...context, tick, simulationRules: rules }));
  }
  if (rules.factionCompetitionEnabled) {
    candidates.push(...evaluateFactionRules(snapshot, pressureIndex, { ...context, tick, simulationRules: rules }));
  }
  if (!['off', 'local'].includes(rules.propagationMode) && (rules.migrationFlowsEnabled || rules.tradeFlowsEnabled)) {
    candidates.push(...deriveFlowCandidates(snapshot, { tick }).filter(candidate => {
      if (candidate.metadata?.flowKind === 'population') return rules.migrationFlowsEnabled;
      if (candidate.metadata?.flowKind === 'trade') return rules.tradeFlowsEnabled;
      return true;
    }));
  }

  return resolveCandidateConflicts(candidates, context.budgets || {});
}

export function generateWorldPulseCandidates({ pressures = [], relationshipCandidates = [], npcCandidates = [], factionCandidates = [], tick = 0 } = {}) {
  const candidates = [];
  for (const pressure of pressures) {
    const condition = pressureConditionCandidate(pressure, tick);
    if (condition) candidates.push(condition);
    const stressor = stressorCandidateForPressure(pressure, tick);
    if (stressor) candidates.push(stressor);
  }
  candidates.push(...relationshipCandidates, ...npcCandidates, ...factionCandidates);
  return resolveCandidateConflicts(candidates);
}

export function rollCandidates(candidates = [], rng, options = {}) {
  const maxAuto = options.maxAuto ?? 6;
  const maxProposals = options.maxProposals ?? 5;
  // World volatility scales pass probability (default 1.0 = unchanged).
  const volatility = Number.isFinite(options.volatility) ? options.volatility : 1;
  const selected = [];
  const rollExplanations = [];
  let autoCount = 0;
  let proposalCount = 0;

  for (const candidate of candidates) {
    if (candidate.applyMode === 'auto' && autoCount >= maxAuto) continue;
    if (candidate.applyMode === 'proposal' && proposalCount >= maxProposals) continue;
    const roll = rng.random();
    const probability = Math.max(0, Math.min(1, (candidate.probability ?? 0) * volatility));
    const passed = roll <= probability;
    const explanation = {
      candidateId: candidate.id,
      candidateType: candidate.candidateType,
      ruleId: candidate.ruleId || null,
      ruleFamily: candidate.ruleFamily || null,
      targetSaveId: candidate.targetSaveId || null,
      relationshipKey: candidate.relationshipKey || null,
      npcId: candidate.npcId || null,
      factionId: candidate.factionId || null,
      severity: candidate.severity,
      probability,
      roll,
      passed,
      gates: candidate.reasons || [],
      applyMode: candidate.applyMode,
      proposalPayload: candidate.proposalPayload || null,
      conflictResolution: candidate.conflictResolution || null,
    };
    rollExplanations.push(explanation);
    if (!passed) continue;
    selected.push({ ...candidate, roll });
    if (candidate.applyMode === 'proposal') proposalCount += 1;
    else autoCount += 1;
  }

  return { selected, rollExplanations };
}
