import { createPRNG } from '../../generators/prng.js';
import { advanceTime } from '../timeProgression.js';
import { buildWorldSnapshot } from './worldSnapshot.js';
import { ensureWorldState, advanceWorldCalendar, appendPulseHistory, pulseIdFor } from './worldState.js';
import { ageRoamingStressors } from './stressors.js';
import { deriveSettlementPressures, pressureIndex } from './pressureModel.js';
import { ensureAllRelationshipStates, relaxRelationshipStates } from './relationshipEvolution.js';
import { ensureNpcStates, relaxNpcStates } from './npcAgency.js';
import { ensureFactionStates, relaxFactionStates, seatNpcsIntoFactions } from './factionCompetition.js';
import { evaluateWorldPulseRules, rollCandidates, volatilityMultiplier } from './candidateEvents.js';
import { applyWorldPulseOutcomes } from './applyWorldPulse.js';
import { synthesizeRealmEvents } from './realmEvents.js';
import { appendWizardNewsEntries } from '../region/index.js';

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
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
  const rng = createPRNG(`${startingWorldState.rngSeed}::tick:${startingWorldState.tick + 1}::${tickInterval}`);
  let worldState = nextWorldStateForPulse(startingWorldState, campaign, tickInterval);
  let snapshot = buildWorldSnapshot({ campaign, saves, worldState });

  worldState = ensureAllRelationshipStates(worldState, snapshot);
  worldState = ensureNpcStates(worldState, snapshot, rng.fork('npc-state'));
  worldState = ensureFactionStates(worldState, snapshot, rng.fork('faction-state'));
  // Mean-reversion: relax momentum / heat / resentment toward baseline each
  // tick so quiet periods cool the world down instead of ratcheting it up.
  worldState = relaxNpcStates(worldState);
  worldState = relaxRelationshipStates(worldState);
  worldState = relaxFactionStates(worldState);
  // Seat NPCs into their factions so internalSeats reflect who holds power.
  worldState = seatNpcsIntoFactions(worldState);
  snapshot = buildWorldSnapshot({ campaign: { ...campaign, worldState }, saves, worldState });

  const agedStressors = ageRoamingStressors(worldState.stressors, snapshot, rng.fork('stressors'), { tick: worldState.tick, now });
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

  const postTimeSaves = saves.map(save => {
    const id = saveId(save);
    if (!localSettlements.has(id)) return save;
    return { ...save, settlement: localSettlements.get(id) };
  });
  const postTimeCampaign = { ...campaign, worldState, regionalGraph: snapshot.regionalGraph };
  const postTimeSnapshot = buildWorldSnapshot({ campaign: postTimeCampaign, saves: postTimeSaves, worldState });
  const pressures = deriveSettlementPressures(postTimeSnapshot);
  const pIndex = pressureIndex(pressures);
  const candidates = evaluateWorldPulseRules(postTimeSnapshot, {
    pressures,
    pressureIndex: pIndex,
    tick: worldState.tick,
  });
  const { selected, rollExplanations } = rollCandidates(
    [...agedStressors.residualOutcomes, ...candidates],
    rng.fork('candidate-rolls'),
    { maxAuto: 7, maxProposals: 5, volatility: volatilityMultiplier(worldState.volatility) },
  );

  const settlementMap = buildSettlementMap(postTimeSnapshot, localSettlements);
  const applied = applyWorldPulseOutcomes({
    snapshot: postTimeSnapshot,
    worldState,
    regionalGraph: postTimeSnapshot.regionalGraph,
    wizardNews: campaign?.wizardNews,
    settlementMap,
    outcomes: selected,
    tick: worldState.tick,
    now,
  });

  const pulseRecord = {
    id: pulseIdFor(campaign?.id, worldState.tick),
    tick: worldState.tick,
    interval: tickInterval,
    committed: commit,
    createdAt: now,
    calendar: applied.worldState.calendar,
    candidateCount: candidates.length,
    selectedCount: selected.length,
    autoAppliedCount: applied.autoApplied.length,
    proposalCount: applied.proposals.length,
    resolvedStressors: agedStressors.resolved.map(stressor => ({
      id: stressor.id,
      type: stressor.type,
      label: stressor.label,
      resolutionChance: stressor.resolutionChance,
      resolutionRoll: stressor.resolutionRoll,
    })),
    rollExplanations,
    timeTicks: timeTicks.map(t => ({ saveId: t.saveId, summary: t.tick.summary })),
  };
  // Realm-scope arcs: promote stressors shared across many settlements into
  // named realm-wide Wizard News ("The Great Hunger", "The War").
  const realmEntries = synthesizeRealmEvents({ worldState: applied.worldState, tick: worldState.tick, now });
  const wizardNews = realmEntries.length ? appendWizardNewsEntries(applied.wizardNews, realmEntries) : applied.wizardNews;
  const finalWorldState = appendPulseHistory(applied.worldState, pulseRecord);

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
    candidates,
    selected,
    rollExplanations,
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
