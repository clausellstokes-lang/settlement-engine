import { createPRNG } from '../../generators/prng.js';
import { advanceTime } from '../timeProgression.js';
import { buildWorldSnapshot } from './worldSnapshot.js';
import { ensureWorldState, advanceWorldCalendar, appendPulseHistory, pulseIdFor } from './worldState.js';
import { ageRoamingStressors } from './stressors.js';
import { deriveSettlementPressures, pressureIndex } from './pressureModel.js';
import { ensureAllRelationshipStates, relaxRelationshipStates } from './relationshipEvolution.js';
import { refreshRelationshipMemory } from './relationshipMemory.js';
import { ensureNpcStates, relaxNpcStates, advanceNpcCorruption, mirrorCorruptionOntoSettlement } from './npcAgency.js';
import { applyCorruptionImpairments } from './corruptionImpair.js';
import { ensureFactionStates, relaxFactionStates, seatNpcsIntoFactions } from './factionCompetition.js';
import { evaluateWorldPulseRules, rollCandidates, volatilityMultiplier } from './candidateEvents.js';
import { applyWorldPulseOutcomes } from './applyWorldPulse.js';
import { synthesizeRealmEvents } from './realmEvents.js';
import { appendWizardNewsEntries } from '../region/index.js';
import { evaluatePopulationDynamics } from './populationDynamics.js';
import { evaluateTierResourceDynamics } from './tierResourceDynamics.js';
import { normalizeSimulationRules } from './simulationRules.js';

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function compactNpcPatch(patch = null) {
  if (!patch) return null;
  return {
    shortGoal: patch.shortGoal || null,
    longGoal: patch.longGoal || null,
    contextSignature: patch.contextSignature || null,
    contextTier: patch.contextTier || null,
    dotRank: patch.dotRank ?? null,
    factionSeat: patch.factionSeat || null,
    lastAction: patch.lastAction || null,
  };
}

function compactOutcomeForHistory(outcome = {}) {
  return {
    id: outcome.id,
    type: outcome.type || null,
    candidateType: outcome.candidateType || null,
    ruleId: outcome.ruleId || null,
    ruleFamily: outcome.ruleFamily || null,
    targetSaveId: outcome.targetSaveId || null,
    relationshipKey: outcome.relationshipKey || null,
    npcId: outcome.npcId || null,
    factionId: outcome.factionId || null,
    severity: outcome.severity ?? null,
    probability: outcome.probability ?? null,
    roll: outcome.roll ?? null,
    applyMode: outcome.applyMode || null,
    headline: outcome.headline || 'World pulse outcome',
    summary: outcome.summary || '',
    reasons: (outcome.reasons || []).slice(0, 4),
    metadata: clone(outcome.metadata || null),
    populationDeltas: clone(outcome.populationDeltas || null),
    tierChange: clone(outcome.tierChange || null),
    resourcePatch: clone(outcome.resourcePatch || null),
    proposalPayload: clone(outcome.proposalPayload || null),
    npcPatch: compactNpcPatch(outcome.npcPatch),
    relationshipPatch: clone(outcome.relationshipPatch || null),
    stressor: outcome.stressor
      ? {
          id: outcome.stressor.id,
          type: outcome.stressor.type,
          label: outcome.stressor.label,
          severity: outcome.stressor.severity,
          affectedSettlementIds: clone(outcome.stressor.affectedSettlementIds || []),
        }
      : null,
  };
}

function compactImpactDigest(entries = []) {
  return entries
    .filter(Boolean)
    .map(entry => ({
      id: entry.id,
      headline: entry.headline || 'World pulse impact',
      summary: entry.summary || '',
      kind: entry.kind || 'queued',
      scope: entry.scope || 'regional',
      significance: entry.significance || 'notable',
      score: entry.score ?? 0,
      impactKind: entry.impactKind || null,
      channelType: entry.channelType || null,
      severity: entry.severity ?? null,
      settlementIds: clone(entry.settlementIds || []),
      impactIds: clone(entry.impactIds || []),
      channelIds: clone(entry.channelIds || []),
      tags: clone((entry.tags || []).slice(0, 8)),
      reasons: clone((entry.reasons || []).slice(0, 4)),
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 18);
}

function saveId(save) {
  return String(save?.id || save?.settlement?.id || save?.name || 'unknown');
}

function buildSettlementMap(snapshot, localSettlements) {
  const map = new Map();
  for (const item of snapshot.settlements) {
    map.set(String(item.id), {
      saveId: String(item.id),
      save: item.save,
      settlement: localSettlements.get(String(item.id)) || item.settlement,
    });
  }
  return map;
}

function nextWorldStateForPulse(worldState, campaign, interval) {
  const current = ensureWorldState(worldState, campaign);
  const tick = current.tick + 1;
  return {
    ...current,
    tick,
    calendar: advanceWorldCalendar(current.calendar, interval),
  };
}

const VALID_INTERVALS = new Set(['one_week', 'one_month', 'one_season', 'one_year']);

/** @returns {import('../settlement.schema.js').TickInterval} */
function usableTickInterval(interval) {
  return VALID_INTERVALS.has(interval) ? interval : 'one_month';
}

/**
 * @param {Object} [args]
 * @param {any} [args.campaign]
 * @param {any[]} [args.saves]
 * @param {string} [args.interval]
 * @param {boolean} [args.commit]
 * @param {string} [args.now]
 */
export function simulateCampaignWorldPulse({ campaign, saves = [], interval = 'one_month', commit = false, now = new Date().toISOString() } = {}) {
  /** @type {import('../settlement.schema.js').TickInterval} */
  const tickInterval = usableTickInterval(interval);
  const startingWorldState = ensureWorldState(campaign?.worldState, campaign);
  const simulationRules = normalizeSimulationRules(startingWorldState.simulationRules);
  const rng = createPRNG(`${startingWorldState.rngSeed}::tick:${startingWorldState.tick + 1}::${tickInterval}`);
  let worldState = { ...nextWorldStateForPulse(startingWorldState, campaign, tickInterval), simulationRules };
  let snapshot = buildWorldSnapshot({ campaign, saves, worldState });

  worldState = ensureAllRelationshipStates(worldState, snapshot);
  worldState = ensureNpcStates(worldState, snapshot, rng.fork('npc-state'));
  worldState = ensureFactionStates(worldState, snapshot, rng.fork('faction-state'));
  // Mean-reversion: relax momentum / heat / resentment toward baseline each
  // tick so quiet periods cool the world down instead of ratcheting it up.
  worldState = relaxNpcStates(worldState);
  worldState = relaxRelationshipStates(worldState);
  worldState = relaxFactionStates(worldState);
  // §corruption Phase 1b — per-tick onset + organic exposure over npcStates.
  // Clean eligible NPCs turn under crime pressure; corrupt NPCs are exposed
  // (demoted / ousted) by security + prosperity. Exposure events name the tied
  // criminal + home institutions for the impairment pass (1b-ii).
  const corruption = advanceNpcCorruption(worldState, snapshot, rng.fork('corruption'), { tick: worldState.tick });
  worldState = corruption.worldState;
  // Seat NPCs into their factions so internalSeats reflect who holds power.
  worldState = seatNpcsIntoFactions(worldState);
  worldState = refreshRelationshipMemory(worldState, snapshot.regionalGraph, snapshot, { currentTick: worldState.tick });
  snapshot = buildWorldSnapshot({ campaign: { ...campaign, worldState }, saves, worldState });

  const agedStressors = simulationRules.stressorsEnabled
    ? ageRoamingStressors(worldState.stressors, snapshot, rng.fork('stressors'), { tick: worldState.tick, now })
    : { stressors: worldState.stressors || [], resolved: [], residualOutcomes: [] };
  worldState = { ...worldState, stressors: agedStressors.stressors };

  const localSettlements = new Map();
  const settlementTickStates = { ...(worldState.settlementTickStates || {}) };
  const timeTicks = [];
  for (const item of snapshot.settlements) {
    const previousTickState = settlementTickStates[item.id] || null;
    const result = advanceTime(item.settlement, { interval: tickInterval, previousTickState });
    localSettlements.set(String(item.id), result.newSettlement);
    settlementTickStates[item.id] = result.nextTickState;
    timeTicks.push({ saveId: item.id, tick: result.tick });
  }
  worldState = { ...worldState, settlementTickStates };

  // §corruption Phase 1b-ii — mirror tick-evolved corruption back onto each
  // settlement's NPCs (so the dossier reflects corruption gained/shed during
  // ticks) and apply the scandal impairment from any exposures this tick to the
  // tied criminal + home institution/faction. Flows through settlementMap →
  // settlementUpdates → persistence. (Replacement NPC lands in 1b-ii-c.)
  for (const sid of [...localSettlements.keys()]) {
    let s = mirrorCorruptionOntoSettlement(localSettlements.get(sid), worldState.npcStates, String(sid));
    const exps = (corruption.exposures || []).filter((e) => String(e.settlementId) === String(sid));
    if (exps.length) s = applyCorruptionImpairments(s, exps, { now });
    localSettlements.set(sid, s);
  }

  const postTimeSaves = saves.map(save => {
    const id = saveId(save);
    if (!localSettlements.has(id)) return save;
    return { ...save, settlement: localSettlements.get(id) };
  });
  const postTimeCampaign = { ...campaign, worldState, regionalGraph: snapshot.regionalGraph };
  const postTimeSnapshot = buildWorldSnapshot({ campaign: postTimeCampaign, saves: postTimeSaves, worldState });
  const pressures = deriveSettlementPressures(postTimeSnapshot);
  const pIndex = pressureIndex(pressures);
  const tierResource = evaluateTierResourceDynamics(worldState, postTimeSnapshot, pIndex, {
    tick: worldState.tick,
    interval: tickInterval,
    simulationRules,
  });
  worldState = tierResource.worldState;
  const structuralCandidates = evaluatePopulationDynamics(postTimeSnapshot, pIndex, {
    tick: worldState.tick,
    interval: tickInterval,
    simulationRules,
  });
  const candidates = evaluateWorldPulseRules(postTimeSnapshot, {
    pressures,
    pressureIndex: pIndex,
    tick: worldState.tick,
    interval: tickInterval,
    simulationRules,
  });
  const stochasticCandidates = [...candidates, ...tierResource.candidates];
  const { selected, rollExplanations } = rollCandidates(
    [...agedStressors.residualOutcomes, ...stochasticCandidates],
    rng.fork('candidate-rolls'),
    { maxAuto: 7, maxProposals: 5, volatility: volatilityMultiplier(worldState.volatility) },
  );
  const deterministicExplanations = structuralCandidates.map(candidate => ({
    candidateId: candidate.id,
    candidateType: candidate.candidateType,
    ruleId: candidate.ruleId || null,
    ruleFamily: candidate.ruleFamily || null,
    targetSaveId: candidate.targetSaveId || null,
    relationshipKey: candidate.relationshipKey || null,
    npcId: candidate.npcId || null,
    factionId: candidate.factionId || null,
    severity: candidate.severity,
    probability: 1,
    roll: 0,
    passed: true,
    gates: candidate.reasons || [],
    applyMode: candidate.applyMode,
    proposalPayload: candidate.proposalPayload || null,
    conflictResolution: { selected: true, deterministic: true },
  }));
  const selectedForApply = [...structuralCandidates, ...selected];

  const settlementMap = buildSettlementMap(postTimeSnapshot, localSettlements);
  const applied = applyWorldPulseOutcomes({
    snapshot: postTimeSnapshot,
    worldState,
    regionalGraph: postTimeSnapshot.regionalGraph,
    wizardNews: campaign?.wizardNews,
    settlementMap,
    outcomes: selectedForApply,
    tick: worldState.tick,
    now,
    simulationRules,
  });

  const memoryState = refreshRelationshipMemory(applied.worldState, applied.regionalGraph, postTimeSnapshot, { currentTick: worldState.tick });
  const pulseRecord = {
    id: pulseIdFor(campaign?.id, worldState.tick),
    tick: worldState.tick,
    interval: tickInterval,
    committed: commit,
    createdAt: now,
    calendar: memoryState.calendar,
    candidateCount: candidates.length + tierResource.candidates.length + structuralCandidates.length,
    selectedCount: selectedForApply.length,
    autoAppliedCount: applied.autoApplied.length,
    proposalCount: applied.proposals.length,
    selectedOutcomes: selectedForApply.slice(0, 24).map(compactOutcomeForHistory),
    impactDigest: compactImpactDigest(applied.newsEntries),
    resolvedStressors: agedStressors.resolved.map(stressor => ({
      id: stressor.id,
      type: stressor.type,
      label: stressor.label,
      resolutionChance: stressor.resolutionChance,
      resolutionRoll: stressor.resolutionRoll,
    })),
    rollExplanations: [...deterministicExplanations, ...rollExplanations],
    timeTicks: timeTicks.map(t => ({ saveId: t.saveId, summary: t.tick.summary })),
    corruptionEvents: (corruption.exposures || []).slice(0, 24).map(e => ({
      settlementId: e.settlementId, name: e.name, kind: e.kind,
      criminalInstitution: e.criminalInstitution, homeInstitution: e.homeInstitution,
    })),
  };
  // Realm-scope arcs: promote stressors shared across many settlements into
  // named realm-wide Wizard News ("The Great Hunger", "The War").
  const realmEntries = synthesizeRealmEvents({ worldState: memoryState, tick: worldState.tick, now });
  const wizardNews = realmEntries.length ? appendWizardNewsEntries(applied.wizardNews, realmEntries) : applied.wizardNews;
  const finalWorldState = appendPulseHistory(memoryState, pulseRecord);

  return {
    campaignId: campaign?.id,
    interval: tickInterval,
    tick: finalWorldState.tick,
    calendar: finalWorldState.calendar,
    worldState: finalWorldState,
    regionalGraph: applied.regionalGraph,
    wizardNews,
    settlementUpdates: applied.settlementUpdates.map(update => ({
      ...update,
      settlement: clone(update.settlement),
    })),
    candidates: [...structuralCandidates, ...candidates, ...tierResource.candidates],
    selected: selectedForApply,
    rollExplanations: [...deterministicExplanations, ...rollExplanations],
    autoApplied: applied.autoApplied,
    proposals: applied.proposals,
    resolvedStressors: agedStressors.resolved,
    pulseRecord,
  };
}

export function previewCampaignWorldPulse(args = {}) {
  return simulateCampaignWorldPulse({ ...args, commit: false });
}

export function advanceCampaignWorld(args = {}) {
  return simulateCampaignWorldPulse({ ...args, commit: true });
}
