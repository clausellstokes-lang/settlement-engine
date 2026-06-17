import { createPRNG } from '../../generators/prng.js';
import { advanceTime } from '../timeProgression.js';
import { withActiveCondition } from '../activeConditions.js';
import { buildWorldSnapshot } from './worldSnapshot.js';
import { ensureWorldState, advanceWorldCalendar, appendPulseHistory, pulseIdFor } from './worldState.js';
import { ageRoamingStressors } from './stressors.js';
import { recordWarResolutionIncidents } from './stressorDynamics.js';
import { coupVerdictOutcomes, isCoupResidualOutcome } from './coup.js';
import { aftermathNewsEntries, graduationNewsEntries, recordGraduationsIntoHistory } from './stressorAftermath.js';
import { advanceFoodStockpile, blockadeFor, famineFor } from './foodStockpile.js';
import { applyBlockadeTransportImpairment } from './blockadeTransport.js';
import { deriveSettlementPressures, pressureIndex } from './pressureModel.js';
import { ensureAllRelationshipStates, relaxRelationshipStates } from './relationshipEvolution.js';
import { ensureNpcStates, relaxNpcStates, advanceNpcCorruption, mirrorCorruptionOntoSettlement } from './npcAgency.js';
import { applyCorruptionImpairments, advanceInstitutionReform } from './corruptionImpair.js';
import {
  advanceFactionCapture, settlementCaptureState,
  captureTransitionNewsEntries, recordCaptureTransitionsIntoHistory,
} from './factionCapture.js';
import { computeGuildStrengthBy, applyGuildToSettlement } from './thievesGuild.js';
import { replaceOustedNpcs } from './successorNpc.js';
import {
  ensureFactionStates, pruneFactionStates, relaxFactionStates, seatNpcsIntoFactions,
  projectFactionStatesOntoSettlement,
} from './factionCompetition.js';
import { evaluateWorldPulseRules, rollCandidates, volatilityMultiplier } from './candidateEvents.js';
import { applyWorldPulseOutcomes } from './applyWorldPulse.js';
import { synthesizeRealmEvents } from './realmEvents.js';
import { appendWizardNewsEntries } from '../region/index.js';
import { evaluatePopulationDynamics } from './populationDynamics.js';
import { evaluateTierResourceDynamics } from './tierResourceDynamics.js';
import { evaluateInstitutionLifecycle } from './institutionLifecycle.js';
import { normalizeSimulationRules } from './simulationRules.js';
import { wallClockNow } from '../clock.js';
import { deepClone } from '../clone.js';

function clone(value) {
  return value == null ? value : deepClone(value);
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
    institutionPatch: clone(outcome.institutionPatch || null),
    proposalPayload: clone(outcome.proposalPayload || null),
    npcPatch: compactNpcPatch(outcome.npcPatch),
    relationshipPatch: clone(outcome.relationshipPatch || null),
    powerTransfer: clone(outcome.powerTransfer || null),
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
export function simulateCampaignWorldPulse({ campaign, saves = [], interval = 'one_month', commit = false, now = wallClockNow() } = {}) {
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
  // Ghost hygiene: faction ids are name-keyed, so a coup-renamed governing
  // faction strands its old state forever (the capture rollup keeps scanning
  // it; rivals[] keeps pointing at it). Prune states absent from the roster
  // for FACTION_STATE_PRUNE_GRACE_TICKS, preserving live capture arcs.
  worldState = pruneFactionStates(worldState, snapshot, { tick: worldState.tick });
  // Mean-reversion: relax momentum / heat / resentment toward baseline each
  // tick so quiet periods cool the world down instead of ratcheting it up.
  worldState = relaxNpcStates(worldState);
  worldState = relaxRelationshipStates(worldState);
  worldState = relaxFactionStates(worldState);
  // §corruption Phase 1b — per-tick onset + organic exposure over npcStates.
  // Clean eligible NPCs turn under crime pressure; corrupt NPCs are exposed
  // (demoted / ousted) by security + prosperity. Exposure events name the tied
  // criminal + home institutions for the impairment pass (1b-ii).
  // §corruption Phase 3 — thieves-guild strength from LAST tick's captured
  // factions; it drags effective security down inside this tick's onset /
  // exposure / capture rolls (the feedback loop), bounded so it never runs away.
  let guildStrengthBy = computeGuildStrengthBy(worldState, snapshot);
  const corruption = advanceNpcCorruption(worldState, snapshot, rng.fork('corruption'), { tick: worldState.tick, guildStrengthBy });
  worldState = corruption.worldState;
  // Seat NPCs into their factions so internalSeats reflect who holds power.
  worldState = seatNpcsIntoFactions(worldState);
  // §corruption Phase 2 — faction capture: corrupt seat-holders pull their
  // faction up the criminalCaptureState ladder (faster the higher the seat);
  // clean factions recede toward 'none'. Runs after seating so seats are current.
  const factionCapture = advanceFactionCapture(worldState, snapshot, rng.fork('faction-capture'), { tick: worldState.tick, guildStrengthBy });
  worldState = factionCapture.worldState;
  // Recompute guild strength from the UPDATED capture states for this tick's
  // settlement mirror (power floor + legitimacy cap below).
  guildStrengthBy = computeGuildStrengthBy(worldState, snapshot);
  // Posture/memory stamping happens ONCE per pulse, inside
  // applyWorldPulseOutcomes (after this tick's outcomes have landed). The
  // pre-aging refresh that used to live here wrote values nothing read before
  // they were superseded in the same pulse.
  snapshot = buildWorldSnapshot({ campaign: { ...campaign, worldState }, saves, worldState });

  const agedStressors = simulationRules.stressorsEnabled
    ? ageRoamingStressors(worldState.stressors, snapshot, rng.fork('stressors'), { tick: worldState.tick, now })
    : { stressors: worldState.stressors || [], resolved: [], residualOutcomes: [], graduated: [] };
  worldState = { ...worldState, stressors: agedStressors.stressors };
  // The mirror of the wind-down handshake: a sponsored war-stressor resolving
  // writes an incident back onto the relationship edge, feeding the
  // relationship memory layer.
  if (agedStressors.resolved.length) {
    worldState = recordWarResolutionIncidents(worldState, snapshot.regionalGraph, agedStressors.resolved, worldState.tick);
  }
  // Coup verdicts: a coup_detat RESOLVING is the verdict moment. The contest
  // (rulingPower) runs against live settlement state and yields deterministic
  // outcomes — a coup_suppressed condition, or a power_transfer (proposal when
  // the governing faction is locked). The coup's generic residual outcome is
  // dropped below; the verdict's own condition carries the aftermath.
  const coupOutcomes = simulationRules.stressorsEnabled
    ? coupVerdictOutcomes({
        resolved: agedStressors.resolved,
        snapshot,
        rng: rng.fork('coup-verdict'),
        tick: worldState.tick,
      })
    : [];

  const localSettlements = new Map();
  const settlementTickStates = { ...(worldState.settlementTickStates || {}) };
  const timeTicks = [];
  for (const item of snapshot.settlements) {
    const previousTickState = settlementTickStates[item.id] || null;
    const result = advanceTime(item.settlement, { interval: tickInterval, previousTickState });
    // The granary moves: surplus fills it, deficits draw it down (rationed),
    // mild hardship tithes into it, an active siege/occupation cuts the
    // import share of need (magical transport relieves the cut only up to its
    // channel throughput — teleport 0.30 of need, besieged airship 0.15, per
    // FOOD_IMPORT_RATES), and a campaign-emergent famine cuts production —
    // blockades and crop failures both literally eat the stores.
    const blockade = blockadeFor(worldState.stressors, item.id);
    const stocked = advanceFoodStockpile(result.newSettlement, {
      interval: tickInterval,
      tick: worldState.tick,
      blockade,
      famine: famineFor(worldState.stressors, item.id),
    });
    // Siege vs the airship dock: blockade-running impairs the dock itself —
    // a visible 'access' impairment while the siege grips, lifted when it ends.
    const sieged = applyBlockadeTransportImpairment(stocked.settlement, blockade, { now });
    localSettlements.set(String(item.id), sieged);
    // Merge rather than replace: advanceTime only returns { clockStages }, but
    // this entry also carries cross-tick drift streaks (tierDrift,
    // economyDrift) written by later evaluators — a wholesale assignment wiped
    // them every pulse, so streak-gated candidates could never fire.
    settlementTickStates[item.id] = { ...(previousTickState || {}), ...result.nextTickState };
    timeTicks.push({ saveId: item.id, tick: result.tick });
  }
  // Prune tick-state for settlements no longer in the campaign: stale entries
  // would serialize forever, and a REUSED save id must not inherit a dead
  // settlement's drift streaks. Deterministic — derived purely from the snapshot.
  const liveTickStateIds = new Set(snapshot.settlements.map(item => String(item.id)));
  for (const key of Object.keys(settlementTickStates)) {
    if (!liveTickStateIds.has(key)) delete settlementTickStates[key];
  }
  worldState = { ...worldState, settlementTickStates };
  // Echoes that faded below living memory this tick graduate into each
  // affected settlement's PERMANENT history (the record historyBeats reads) —
  // campaign events finally become "the defining crisis" / "recent disruption".
  if (agedStressors.graduated?.length) {
    recordGraduationsIntoHistory(localSettlements, agedStressors.graduated, worldState.tick);
  }

  // §corruption Phase 1b-ii — mirror tick-evolved corruption back onto each
  // settlement's NPCs (so the dossier reflects corruption gained/shed during
  // ticks) and apply the scandal impairment from any exposures this tick to the
  // tied criminal + home institution/faction. Flows through settlementMap →
  // settlementUpdates → persistence. (Replacement NPC lands in 1b-ii-c.)
  const reformEvents = [];
  for (const sid of [...localSettlements.keys()]) {
    let s = mirrorCorruptionOntoSettlement(localSettlements.get(sid), worldState.npcStates, String(sid));
    const exps = (corruption.exposures || []).filter((e) => String(e.settlementId) === String(sid));
    if (exps.length) s = applyCorruptionImpairments(s, exps, { now });
    // §corruption duality — organic reform: a corruption-impaired institution
    // whose corrupt insiders are gone gets a security-scaled chance to clean
    // house, lifting the patronage drag and the proximity penalty. Runs
    // BEFORE this tick's impairments would matter (next tick reads them).
    const reform = advanceInstitutionReform(s, rng.fork(`reform:${sid}:${worldState.tick}`));
    if (reform.reformed.length) {
      s = reform.settlement;
      for (const r of reform.reformed) {
        reformEvents.push({ settlementId: String(sid), name: r.name, kind: 'institution_reformed', criminalInstitution: null, homeInstitution: r.name });
      }
    }
    // §corruption duality — an OUSTING is a public scandal: it enters the
    // causal loop as a corruption_exposed condition (ruling_authority and
    // legitimacy take the hit), not just a status annotation.
    const oustedExps = exps.filter((e) => e.kind === 'ousted');
    if (oustedExps.length) {
      s = withActiveCondition(s, {
        archetype: 'corruption_exposed',
        severity: Math.min(0.8, 0.4 + oustedExps.length * 0.1),
        triggeredAt: { tick: worldState.tick, sourceEventType: 'ORGANIC_CORRUPTION_EXPOSURE', sourceEventTargetId: oustedExps[0].npcId },
        causes: oustedExps.map((e) => ({ source: e.npcId, effect: 'corruption_scandal', reason: `${e.name} was publicly ousted for corruption.` })),
      });
    }
    // §corruption Phase 2 — roll the worst faction capture up to the settlement's
    // criminalCaptureState (which npcStructure + the dossier already read).
    const cap = settlementCaptureState(worldState.factionStates, sid);
    if (s.powerStructure && s.powerStructure.criminalCaptureState !== cap) {
      s = { ...s, powerStructure: { ...s.powerStructure, criminalCaptureState: cap } };
    }
    // §corruption Phase 3 — floor the criminal faction's power + hard-cap its
    // legitimacy from the guild's strength, and stamp thievesGuildStrength.
    const gStrength = guildStrengthBy.get(String(sid));
    if (gStrength) s = applyGuildToSettlement(s, gStrength);
    // §corruption Phase 1b-ii-c — an ousted NPC is replaced by a fresh successor
    // who inherits their seat in the faction/power.
    const oustedNames = exps.filter((e) => e.kind === 'ousted').map((e) => e.name);
    if (oustedNames.length) s = replaceOustedNpcs(s, oustedNames, rng.fork(`replace:${sid}:${worldState.tick}`));
    localSettlements.set(sid, s);
  }

  // Wave 7 #3 — a faction crossing into/out of full 'capture' is permanent
  // settlement history (the record historyBeats reads), like a stressor echo
  // graduating. The Wizard-News side of the same transitions lands below with
  // the aftermath entries.
  if (factionCapture.transitions.length) {
    recordCaptureTransitionsIntoHistory(localSettlements, factionCapture.transitions, worldState.tick);
  }

  // §corruption 1b-ii-c — prune the npcStates of ousted-and-replaced NPCs so the
  // phantom doesn't keep holding a faction seat after its settlement NPC is gone.
  const oustedIds = new Set((corruption.exposures || []).filter((e) => e.kind === 'ousted').map((e) => e.npcId));
  if (oustedIds.size) {
    const npcStates = { ...worldState.npcStates };
    let pruned = false;
    for (const id of oustedIds) { if (npcStates[id]) { delete npcStates[id]; pruned = true; } }
    if (pruned) worldState = { ...worldState, npcStates };
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
  // Institution lifecycle — economic growth/decline of supply-chain
  // institutions, gated on the economyDrift streaks tracked alongside
  // tierDrift. Candidates flow through rollCandidates like tier/resource drift.
  const instLifecycle = evaluateInstitutionLifecycle(worldState, postTimeSnapshot, pIndex, {
    tick: worldState.tick,
    interval: tickInterval,
    simulationRules,
  });
  worldState = instLifecycle.worldState;
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
  const stochasticCandidates = [...candidates, ...tierResource.candidates, ...instLifecycle.candidates];
  const { selected, rollExplanations } = rollCandidates(
    [...agedStressors.residualOutcomes.filter(o => !isCoupResidualOutcome(o)), ...stochasticCandidates],
    rng.fork('candidate-rolls'),
    { maxAuto: 7, maxProposals: 5, volatility: volatilityMultiplier(worldState.volatility) },
  );
  const deterministicExplanations = [...coupOutcomes, ...structuralCandidates].map(candidate => ({
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
  const selectedForApply = [...coupOutcomes, ...structuralCandidates, ...selected];

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

  // applied.worldState already carries this tick's posture/memory stamp:
  // applyWorldPulseOutcomes refreshes ONCE after outcomes land (the same
  // inputs this duplicate call used to re-derive byte-identically).
  const memoryState = applied.worldState;
  // Wave 7 #2 — the dossier stops lying: project the per-faction live state
  // (capture rung, momentum band, rivals, institution control) onto each
  // settlement's powerStructure.factions. Seam choice: HERE, after
  // applyWorldPulseOutcomes, not inside applyWorldPulse — the projection must
  // read the post-outcome factionStates (this tick's factionPatches and
  // capture transitions included), and this file owns the pulse sequencing.
  // Identity no-op per settlement: an untouched roster keeps its reference.
  const settlementUpdates = applied.settlementUpdates.map(update => {
    const projected = projectFactionStatesOntoSettlement(
      update.settlement, memoryState.factionStates, update.saveId, { tick: worldState.tick },
    );
    return projected === update.settlement ? update : { ...update, settlement: projected };
  });
  const pulseRecord = {
    id: pulseIdFor(campaign?.id, worldState.tick),
    tick: worldState.tick,
    interval: tickInterval,
    committed: commit,
    createdAt: now,
    calendar: memoryState.calendar,
    candidateCount: candidates.length + tierResource.candidates.length + instLifecycle.candidates.length + structuralCandidates.length + coupOutcomes.length,
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
    graduatedStressors: (agedStressors.graduated || []).map(stressor => ({
      id: stressor.id,
      type: stressor.type,
      label: stressor.label,
    })),
    rollExplanations: [...deterministicExplanations, ...rollExplanations],
    timeTicks: timeTicks.map(t => ({ saveId: t.saveId, summary: t.tick.summary })),
    corruptionEvents: [...(corruption.exposures || []), ...reformEvents].slice(0, 24).map(e => ({
      settlementId: e.settlementId, name: e.name, kind: e.kind,
      criminalInstitution: e.criminalInstitution, homeInstitution: e.homeInstitution,
    })),
    factionCaptureEvents: (factionCapture.transitions || []).slice(0, 24).map(t => ({
      settlementId: t.settlementId, name: t.name, from: t.from, to: t.to,
    })),
  };
  // Realm-scope arcs: promote stressors shared across many settlements into
  // named realm-wide Wizard News ("The Great Hunger", "The War"), plus the
  // aftermath record — resolutions ("X has passed") and echo graduations
  // ("X passes into history") both land in the chronicle feed.
  // Arc entries (realm + compound) re-derive every tick while the condition
  // holds; throttle re-emission so a 30-tick famine arc doesn't flood the
  // capped feed with 30 near-identical headlines. Re-emit when membership
  // changes or after the cooldown lapses (keeps long arcs visible).
  const ARC_REEMIT_COOLDOWN_TICKS = 6;
  const isFreshArcEntry = (entry) => {
    if (!['realm', 'compound'].includes(entry.kind)) return true;
    // The feed is newest-first, so the cooldown window must be a tick filter —
    // a tail slice would inspect the OLDEST entries once the feed exceeds it.
    const recent = (applied.wizardNews?.entries || [])
      .filter(e => worldState.tick - (e.tick ?? -Infinity) < ARC_REEMIT_COOLDOWN_TICKS);
    return !recent.some(e =>
      e.impactKind === entry.impactKind
      && JSON.stringify((e.settlementIds || []).slice().sort()) === JSON.stringify((entry.settlementIds || []).slice().sort()));
  };
  const realmEntries = synthesizeRealmEvents({ worldState: memoryState, tick: worldState.tick, now })
    .filter(isFreshArcEntry);
  const aftermathEntries = [
    ...aftermathNewsEntries(agedStressors.resolved, worldState.tick, now),
    ...graduationNewsEntries(agedStressors.graduated || [], worldState.tick, now),
  ];
  // Wave 7 #3 — capture transitions reach the DM: the factionCaptureEvents
  // pulseRecord rollup above was consumed by nobody, so a faction falling to
  // (or breaking from) the underworld never surfaced in the Chronicle.
  const settlementNameFor = (id) => {
    const entry = settlementMap.get(String(id));
    return entry?.save?.name || entry?.settlement?.name || String(id);
  };
  const captureNewsEntries = captureTransitionNewsEntries(
    factionCapture.transitions, settlementNameFor, worldState.tick, now,
  );
  const newsToAppend = [...aftermathEntries, ...captureNewsEntries, ...realmEntries];
  const wizardNews = newsToAppend.length ? appendWizardNewsEntries(applied.wizardNews, newsToAppend) : applied.wizardNews;
  const finalWorldState = appendPulseHistory(memoryState, pulseRecord);

  return {
    campaignId: campaign?.id,
    interval: tickInterval,
    tick: finalWorldState.tick,
    calendar: finalWorldState.calendar,
    worldState: finalWorldState,
    regionalGraph: applied.regionalGraph,
    wizardNews,
    settlementUpdates: settlementUpdates.map(update => ({
      ...update,
      settlement: clone(update.settlement),
    })),
    candidates: [...coupOutcomes, ...structuralCandidates, ...candidates, ...tierResource.candidates, ...instLifecycle.candidates],
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
