import { createPRNG } from '../../generators/prng.js';
import { advanceTime } from '../timeProgression.js';
import { withActiveCondition } from '../activeConditions.js';
import { buildWorldSnapshot } from './worldSnapshot.js';
import { ensureWorldState, advanceWorldCalendar, appendPulseHistory, pulseIdFor } from './worldState.js';
import { ageRoamingStressors } from './stressors.js';
import { recordWarResolutionIncidents } from './stressorDynamics.js';
import { coupVerdictOutcomes, isCoupResidualOutcome } from './coup.js';
import { evaluateWarLayer } from './warDeployment.js';
import { evaluateMobilization } from './mobilization.js';
import { mobilizationEffects } from './mobilizationEffects.js';
import { evaluateTradeWar } from './tradeWar.js';
import { evaluateReligiousContest } from './religiousContest.js';
import { isSubsystemActive } from './subsystemActivation.js';
import { deploymentReturnOutcomes } from './deploymentReturn.js';
import { evaluateOccupations } from './occupation.js';
import { addRegionalChannels, setRegionalChannelStatus } from '../region/graph.js';
import { aftermathNewsEntries, graduationNewsEntries, recordGraduationsIntoHistory } from './stressorAftermath.js';
import { advanceFoodStockpile, blockadeFor, famineFor } from './foodStockpile.js';
import { applyBlockadeTransportImpairment } from './blockadeTransport.js';
import { deriveSettlementPressures, pressureIndex } from './pressureModel.js';
import { ensureAllRelationshipStates, relaxRelationshipStates } from './relationshipEvolution.js';
import { ensureNpcStates, pruneNpcStates, relaxNpcStates, advanceNpcCorruption, mirrorCorruptionOntoSettlement } from './npcAgency.js';
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
import { applyDispositionDeltas, dispositionFactorMap } from './dispositionLedger.js';
import { advancePantheon, collectFaithDeltas } from './pantheon.js';
import { computeDispositionFactorMap } from './disposition.js';
import { computeTradeSalienceMap, computeSecondaryStatusOverlay } from './tradeSalience.js';
import { collectDispositionDeltas } from './dispositionDeltas.js';
import { applyWorldPulseOutcomes } from './applyWorldPulse.js';
import { synthesizeRealmEvents, synthesizePantheonArcs } from './realmEvents.js';
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

// The upward pressure to mobilize: a settlement RAMPS its war posture
// when it faces a hostile-axis neighbour (rival / cold_war / hostile). Returns a
// memoized `(id) => boolean` over the pre-tick edges + relationshipStates. Pure,
// codepoint-stable (the result is a set membership test, order-free).
const MOBILIZATION_HOSTILE_TYPES = new Set(['hostile', 'cold_war', 'rival']);
function buildWantsWarLookup(snapshot) {
  const states = snapshot?.worldState?.relationshipStates || {};
  /** @type {Set<string>} */
  const wants = new Set();
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const key = rawEdge?.id || `${rawEdge?.from}->${rawEdge?.to}`;
    const relType = String(states[key]?.relationshipType || rawEdge?.relationshipType || 'neutral');
    if (!MOBILIZATION_HOSTILE_TYPES.has(relType)) continue;
    const a = String(rawEdge?.from);
    const b = String(rawEdge?.to);
    if (snapshot?.byId?.has?.(a) && snapshot?.byId?.has?.(b)) {
      wants.add(a);
      wants.add(b);
    }
  }
  return (/** @type {string} */ id) => wants.has(String(id));
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
  // Same ghost hygiene for NPC states: an NPC that leaves the roster (death,
  // ouster, rename) otherwise strands its state forever. Runs after
  // ensureNpcStates so freshly-ensured live NPCs are never pruned, and before
  // the corruption/seating passes.
  worldState = pruneNpcStates(worldState, snapshot, { tick: worldState.tick });
  // Mean-reversion: relax momentum / heat / resentment toward baseline each
  // tick so quiet periods cool the world down instead of ratcheting it up.
  worldState = relaxNpcStates(worldState);
  worldState = relaxRelationshipStates(worldState);
  worldState = relaxFactionStates(worldState);
  // Per-tick corruption onset + organic exposure over npcStates.
  // Clean eligible NPCs turn under crime pressure; corrupt NPCs are exposed
  // (demoted / ousted) by security + prosperity. Exposure events name the tied
  // criminal + home institutions for the institution-impairment pass.
  // Thieves-guild strength from LAST tick's captured
  // factions drags effective security down inside this tick's onset /
  // exposure / capture rolls (the feedback loop), bounded so it never runs away.
  let guildStrengthBy = computeGuildStrengthBy(worldState, snapshot);
  // The religion layer is ACTIVE for the deity→corruption effects only when BOTH
  // the opt-in flag AND the activation gate hold (≥1 settlement carries an
  // embedded config.primaryDeitySnapshot). false ⇒ the corruption /
  // capture gates are unrelaxed and deityDisfavor is 1.0 ⇒ byte-identical legacy.
  const religionActive = simulationRules.religionDynamicsEnabled && isSubsystemActive(snapshot, 'religion');
  const corruption = advanceNpcCorruption(worldState, snapshot, rng.fork('corruption'), { tick: worldState.tick, guildStrengthBy, religionActive });
  worldState = corruption.worldState;
  // Seat NPCs into their factions so internalSeats reflect who holds power.
  worldState = seatNpcsIntoFactions(worldState);
  // Faction capture: corrupt seat-holders pull their
  // faction up the criminalCaptureState ladder (faster the higher the seat);
  // clean factions recede toward 'none'. Runs after seating so seats are current.
  const factionCapture = advanceFactionCapture(worldState, snapshot, rng.fork('faction-capture'), { tick: worldState.tick, guildStrengthBy, religionActive });
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
    // A settlement with an active OUTBOUND deployment feeds its army from the
    // home granary. Read the one-army ledger (keyed by home save id) ONLY when the
    // war layer is on; a no-war campaign passes deployment:null ⇒ byte-identical.
    const deployment = simulationRules.warLayerEnabled
      ? (worldState.deployments?.[String(item.id)] || null)
      : null;
    const stocked = advanceFoodStockpile(result.newSettlement, {
      interval: tickInterval,
      tick: worldState.tick,
      blockade,
      famine: famineFor(worldState.stressors, item.id),
      deployment,
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

  // Mirror tick-evolved corruption back onto each settlement's NPCs (so the
  // dossier reflects corruption gained/shed during ticks) and apply the scandal
  // impairment from any exposures this tick to the tied criminal + home
  // institution/faction. Flows through settlementMap →
  // settlementUpdates → persistence. (The replacement NPC is seeded further below.)
  const reformEvents = [];
  for (const sid of [...localSettlements.keys()]) {
    let s = mirrorCorruptionOntoSettlement(localSettlements.get(sid), worldState.npcStates, String(sid));
    const exps = (corruption.exposures || []).filter((e) => String(e.settlementId) === String(sid));
    if (exps.length) s = applyCorruptionImpairments(s, exps, { now });
    // Organic reform: a corruption-impaired institution
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
    // An OUSTING is a public scandal: it enters the
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
    // Roll the worst faction capture up to the settlement's
    // criminalCaptureState (which npcStructure + the dossier already read).
    const cap = settlementCaptureState(worldState.factionStates, sid);
    if (s.powerStructure && s.powerStructure.criminalCaptureState !== cap) {
      s = { ...s, powerStructure: { ...s.powerStructure, criminalCaptureState: cap } };
    }
    // Floor the criminal faction's power + hard-cap its
    // legitimacy from the guild's strength, and stamp thievesGuildStrength.
    const gStrength = guildStrengthBy.get(String(sid));
    if (gStrength) s = applyGuildToSettlement(s, gStrength);
    // An ousted NPC is replaced by a fresh successor
    // who inherits their seat in the faction/power.
    const oustedNames = exps.filter((e) => e.kind === 'ousted').map((e) => e.name);
    if (oustedNames.length) s = replaceOustedNpcs(s, oustedNames, rng.fork(`replace:${sid}:${worldState.tick}`));
    localSettlements.set(sid, s);
  }

  // A faction crossing into/out of full 'capture' is permanent settlement
  // history (the record historyBeats reads), like a stressor echo graduating.
  // The Wizard-News side of the same transitions lands below with the aftermath
  // entries.
  if (factionCapture.transitions.length) {
    recordCaptureTransitionsIntoHistory(localSettlements, factionCapture.transitions, worldState.tick);
  }

  // Prune the npcStates of ousted-and-replaced NPCs so the
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
  let postTimeSnapshot = buildWorldSnapshot({ campaign: postTimeCampaign, saves: postTimeSaves, worldState });
  // WAR-ECONOMY MOBILIZATION POSTURE. Runs FIRST inside the gated war
  // block (so the war layer's deploy gate reads THIS tick's posture): the per-
  // settlement posture state machine ramps peace→…→mobilized, gated on disposition/
  // economy/legitimacy, and cools under strain. A settlement must reach a war-ready
  // posture (mobilized) before the war layer will let it OPEN a new siege — it cannot
  // siege from peace. The mobilization is a DETERMINISTIC classifier (no rng). It
  // stamps war_mobilization conditions (the war-economy footing cost) and mints
  // VISIBLE information_flow mobilization signals (public overt / gm covert) the
  // neighbour-reaction candidates key on. GATED + byte-neutral: the warPosture ledger
  // is CONDITIONAL (absent when no settlement leaves peace) so a no-war campaign is
  // byte-identical.
  let mobilizationOutcomes = [];
  if (simulationRules.warLayerEnabled) {
    const wantsWarFor = buildWantsWarLookup(postTimeSnapshot);
    const mobilization = evaluateMobilization({
      snapshot: postTimeSnapshot,
      worldState,
      tick: worldState.tick,
      wantsWarFor,
    });
    // Persist the NEXT-tick posture ledger (deep-cloned via ensureWorldState's
    // conditional clone on the next read). Only materialize the key when non-empty —
    // a dormant campaign keeps NO warPosture key (byte-neutral under the oracle).
    worldState = Object.keys(mobilization.warPosture).length
      ? { ...worldState, warPosture: mobilization.warPosture }
      : (() => { const { warPosture: _drop, ...rest } = worldState; return rest; })();
    const effects = mobilizationEffects({
      snapshot: postTimeSnapshot,
      events: mobilization.events,
      tick: worldState.tick,
      now,
    });
    mobilizationOutcomes = effects.outcomes;
    // Rebuild the snapshot so the war layer's deploy gate + the reaction rule read the
    // persisted posture AND the freshly-minted mobilization signals.
    const postureCampaign = { ...campaign, worldState, regionalGraph: postTimeSnapshot.regionalGraph };
    if (effects.graphChannels.length) {
      const signalGraph = addRegionalChannels(postTimeSnapshot.regionalGraph, effects.graphChannels, { now });
      postTimeSnapshot = buildWorldSnapshot({ campaign: { ...postureCampaign, regionalGraph: signalGraph }, saves: postTimeSaves, worldState });
    } else {
      postTimeSnapshot = buildWorldSnapshot({ campaign: postureCampaign, saves: postTimeSaves, worldState });
    }
  }
  // The war/deployment layer — GATED behind simulationRules.warLayerEnabled
  // (default false ⇒ pure no-op ⇒ byte-identical legacy). Reads the SINGLE pre-tick
  // postTimeSnapshot: resolves coalition sieges (a fallen target → a conquest
  // power_transfer), opens new sieges (a war-ready, confident attacker whose CURRENT-
  // capacity matchup is feasibility-PLAUSIBLE → a directed war_front mint +
  // war_drain/army_deployed home conditions), and turns each army that came home (a
  // resolved siege) into a CONTEXTUAL return outcome. The hard feasibility gate sits
  // IN FRONT of the siege RNG (deterministic), and the deploy gate requires a
  // mobilized posture — so a thorpe cannot storm a city on a lucky roll, and no one
  // sieges from peace. war_drain severity is derived from the PRE-TICK war_front count
  // INSIDE the evaluator (no intra-tick read-after-write).
  const war = evaluateWarLayer({
    snapshot: postTimeSnapshot,
    worldState,
    rng: rng.fork('war-layer'),
    tick: worldState.tick,
    now,
    rules: simulationRules,
  });
  let warReturnOutcomes = [];
  let tradeWarOutcomes = [];
  // Occupation-layer outcomes (occupation_resistance / occupation_burden /
  // war_spoils / vassalization). Empty unless the war layer is ON and an occupation
  // exists — so the conditional `occupations` ledger never materializes and the apply
  // set is byte-identical on the OFF path / a campaign with no conquests.
  /** @type {any[]} */
  let occupationOutcomes = [];
  // Disposition write-side accumulator: the id-stable win/loss deltas from the
  // contests resolved this tick (siege conquests + trade-war flips). Empty unless
  // the war layer is ON and something actually resolved — so the post-apply fold
  // is byte-neutral (applyDispositionDeltas returns the input ledger on []) on the
  // OFF path and on quiet ticks.
  /** @type {any[]} */
  let pendingDispositionDeltas = [];
  if (simulationRules.warLayerEnabled) {
    // Persist the updated one-army ledger so it survives to the next tick. The
    // war-exhaustion scar ledger rides alongside it (non-reverting; ratcheted by the
    // evaluator, decayed slowly when armies come home) — read-last/write-next.
    worldState = { ...worldState, deployments: war.deployments, warExhaustion: war.warExhaustion };
    // Land the war_front directed mints on the graph BEFORE candidate generation and
    // the apply pass, then rebuild the snapshot so downstream reads see the new front.
    // ALSO retire any war_front channels whose siege resolved this tick (conquest or
    // withdrawal): evaluateWarLayer reports them in war.retiredChannels. Dropping them
    // to 'dormant' is what stops a resolved siege from being re-discovered — and
    // re-conquered — every subsequent tick. Retirements must apply even when no new
    // fronts were minted (a siege can resolve on a tick that opens no new front).
    const retiredChannels = war.retiredChannels || [];
    if (war.graphChannels.length || retiredChannels.length) {
      let warGraph = postTimeSnapshot.regionalGraph;
      if (war.graphChannels.length) {
        warGraph = addRegionalChannels(warGraph, war.graphChannels, { now });
      }
      for (const channelId of retiredChannels) {
        warGraph = setRegionalChannelStatus(warGraph, channelId, 'dormant', { now });
      }
      const mintedCampaign = { ...campaign, worldState, regionalGraph: warGraph };
      postTimeSnapshot = buildWorldSnapshot({ campaign: mintedCampaign, saves: postTimeSaves, worldState });
    }
    // Contextual returns read the POST-mint graph (so "is my home besieged?" is
    // current) and the pre-tick snapshot for home state. Forked 'deployment-return'.
    warReturnOutcomes = deploymentReturnOutcomes({
      resolvedDeployments: war.resolvedDeployments,
      snapshot: postTimeSnapshot,
      graph: postTimeSnapshot.regionalGraph,
      rng: rng.fork('war-layer'),
      tick: worldState.tick,
    });

    // The trade-war layer. The per-commodity primary-supplier contest composes
    // with the war layer inside the SAME gated block: a flip re-points C's primary
    // trade_dependency channel and (confidence-gated) either winds the defeated
    // incumbent down or escalates to a war_front the war layer picks up next tick.
    // Reads the SAME post-mint snapshot (so the war layer's fresh fronts are
    // visible) and persists its per-prize cooldown ledger onto worldState.tradeWarState.
    const tradeWar = evaluateTradeWar({
      snapshot: postTimeSnapshot,
      worldState,
      rng: rng.fork('trade-war'),
      tick: worldState.tick,
      now,
      rules: simulationRules,
    });
    worldState = { ...worldState, tradeWarState: tradeWar.tradeWarState };
    tradeWarOutcomes = tradeWar.outcomes;
    if (tradeWar.graphChannels.length) {
      const realignedGraph = addRegionalChannels(postTimeSnapshot.regionalGraph, tradeWar.graphChannels, { now });
      const realignedCampaign = { ...campaign, worldState, regionalGraph: realignedGraph };
      postTimeSnapshot = buildWorldSnapshot({ campaign: realignedCampaign, saves: postTimeSaves, worldState });
    }
    // The OCCUPATION layer. A successful conquest (war.outcomes, cause:
    // 'conquest') seeds a `contested` occupation; a deployment-return liberation
    // (warReturnOutcomes, occupation_lifted/siege_lifted) drops one. The state machine
    // then advances each occupation toward stabilization (hysteresis dwell + single-rung
    // + collapse→liberated), grows/shrinks resistance, and computes the CAPPED/DELAYED/
    // CONDITIONAL occupier benefit + burden. Reads the POST-mint graph (garrison
    // presence) + the live deployments + the pre-tick snapshot (usefulness/resistance).
    // Deterministic (no rng — the state machine is pure). The occupations ledger is
    // read-last/write-next and CONDITIONAL: absent until the first conquest.
    const occupation = evaluateOccupations({
      snapshot: postTimeSnapshot,
      worldState,
      graph: postTimeSnapshot.regionalGraph,
      deployments: war.deployments,
      warOutcomes: war.outcomes,
      returnOutcomes: warReturnOutcomes,
      tick: worldState.tick,
      rules: simulationRules,
    });
    occupationOutcomes = occupation.outcomes;
    // Only materialize the occupations key when the ledger is non-empty — a war with no
    // surviving occupation stays absent (byte-neutral under the dormancy oracle).
    if (Object.keys(occupation.occupations).length) {
      worldState = { ...worldState, occupations: occupation.occupations };
    } else if (worldState.occupations) {
      // The last occupation was liberated/collapsed this tick — drop the now-empty key
      // so the ledger returns to absent (byte-neutral) rather than lingering as `{}`.
      const { occupations: _drop, ...rest } = worldState;
      worldState = rest;
    }
    // Disposition write-side: gather this tick's resolved-contest win/loss deltas
    // (attributed at the resolver). Folded into next-tick dispositionStats below,
    // after outcomes apply — the READ-LAST/WRITE-NEXT timing discipline. The occupation
    // layer contributes its own consolidation-win / liberation-loss deltas (deterministic,
    // id-stable) alongside the war/trade contests.
    pendingDispositionDeltas = [...collectDispositionDeltas(war, tradeWar), ...occupation.dispositionDeltas];
  }
  // Religion dynamics: the deity contest + conversion spread +
  // religious_authority mint. DOUBLE-GATED, its OWN block parallel to the war
  // block: it acts ONLY when BOTH the opt-in flag religionDynamicsEnabled AND the
  // activation gate (≥1 settlement carries config.primaryDeitySnapshot) hold.
  // Either false ⇒ pure no-op (no mints, no contests, no conversions) ⇒
  // byte-identical legacy. A no-deity campaign is unchanged even with the flag on
  // (the evaluator short-circuits on the activation gate before any fork/mint).
  // Mirrors the war block: mint the religious_authority directed channels onto the
  // graph BEFORE candidate generation + apply, rebuild the snapshot so downstream
  // reads see the new faith paths, then thread the conversion outcomes (which
  // re-embed the winning deity snapshot and seed the existing
  // religious_conversion_fracture stressor for the deity-driven spread) into the
  // deterministic apply set.
  let religiousOutcomes = [];
  // Pantheon write-side accumulator: the per-deity win/loss deltas from this
  // tick's resolved conversions + the PRE-conversion snapshot seats are aggregated
  // from. Both are captured here (inside the religion block) so the post-apply
  // ratchet below sees PRE-TICK deity assignments (no intra-tick read-after-write).
  // Empty / null unless religion is active and a contest ran — so the post-apply
  // fold is a pure no-op (and the pantheon key is never materialized) otherwise.
  /** @type {any[]} */
  let pendingFaithDeltas = [];
  /** @type {any} */
  let pantheonSeatSnapshot = null;
  const religionActiveThisTick = simulationRules.religionDynamicsEnabled && isSubsystemActive(postTimeSnapshot, 'religion');
  if (religionActiveThisTick) {
    // Capture the PRE-conversion snapshot for seat aggregation BEFORE the contest's
    // fresh mints rebuild it. (Mints only add graph channels, not deity seats, so
    // either snapshot counts the same seats — but pinning the pre-contest one keeps
    // the aggregation provably pre-tick.)
    pantheonSeatSnapshot = postTimeSnapshot;
    const religion = evaluateReligiousContest({
      snapshot: postTimeSnapshot,
      worldState,
      rng: rng.fork('religious-contest'),
      tick: worldState.tick,
      now,
      rules: simulationRules,
    });
    religiousOutcomes = religion.outcomes;
    // The winner banks a win, the displaced incumbent a loss — read from the
    // PRE-TICK snapshot's deity assignments, never this tick's fresh re-embed.
    pendingFaithDeltas = collectFaithDeltas(religion, pantheonSeatSnapshot);
    if (religion.graphChannels.length) {
      const faithGraph = addRegionalChannels(postTimeSnapshot.regionalGraph, religion.graphChannels, { now });
      const faithCampaign = { ...campaign, worldState, regionalGraph: faithGraph };
      postTimeSnapshot = buildWorldSnapshot({ campaign: faithCampaign, saves: postTimeSaves, worldState });
    }
  }
  const warOutcomes = [...mobilizationOutcomes, ...war.outcomes, ...warReturnOutcomes, ...tradeWarOutcomes, ...occupationOutcomes, ...religiousOutcomes];
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
  // Read LAST-TICK disposition memory into per-settlement multipliers
  // (centered on 1.0). The next-tick WRITE (ratchet from this tick's resolved
  // contests) lands post-apply below.
  //   • Layer OFF — the history-only path: empty ledger ⇒ empty map ⇒ every
  //     candidate factor is 1.0 ⇒ BYTE-IDENTICAL legacy. We compute NO baseline.
  //   • Layer ON — the live path: blend computeAggressiveness (govBaseline +
  //     authored NPC personality + ratcheted history) per settlement. A
  //     no-signal settlement is omitted ⇒ still 1.0 (`{}`-equivalent). This map
  //     SUPERSEDES dispositionFactorMap (history is folded in via
  //     readDispositionMultiplier — they are never both applied).
  const dispositionFactor = simulationRules.warLayerEnabled
    ? computeDispositionFactorMap(postTimeSnapshot, worldState)
    : dispositionFactorMap(worldState.dispositionStats);
  // STRATEGIC TRADE → REDUCED HOSTILITY. Compute the per-edge trade-
  // salience map (a centered-on-1.0 factor that DAMPENS hostile/escalation
  // candidates when a VALUABLE trade tie exists) ONLY under the war layer — off ⇒
  // empty map ⇒ every candidate factor is 1.0 ⇒ byte-identical legacy. The
  // `salience` rollup feeds the coercion/embargo cross-cutting rule. Reads the
  // post-mint snapshot (so this tick's trade realignments are visible) and the
  // pre-tick worldState (tradeWarState recency, relationship primaries).
  const tradeSalienceResult = simulationRules.warLayerEnabled
    ? computeTradeSalienceMap(postTimeSnapshot, worldState, { tick: worldState.tick })
    : { factors: {}, salience: {} };
  const candidates = evaluateWorldPulseRules(postTimeSnapshot, {
    pressures,
    pressureIndex: pIndex,
    tick: worldState.tick,
    interval: tickInterval,
    simulationRules,
    dispositionFactor,
    tradeSalienceFactor: tradeSalienceResult.factors,
    tradeSalienceInfo: tradeSalienceResult.salience,
    // Thread a stable fork to the settlement strategy chooser (the ONLY
    // candidate rule that samples). Forked from the master pulse rng on a constant
    // key; the chooser re-forks per settlement (`strategy:<S>:<tick>`) so the draw
    // is order-free. The chooser short-circuits before touching it when OFF.
    rng: rng.fork('settlement-strategy'),
  });
  const stochasticCandidates = [...candidates, ...tierResource.candidates, ...instLifecycle.candidates];
  const { selected, rollExplanations } = rollCandidates(
    [...agedStressors.residualOutcomes.filter(o => !isCoupResidualOutcome(o)), ...stochasticCandidates],
    rng.fork('candidate-rolls'),
    { maxAuto: 7, maxProposals: 5, volatility: volatilityMultiplier(worldState.volatility) },
  );
  const deterministicExplanations = [...coupOutcomes, ...warOutcomes, ...structuralCandidates].map(candidate => ({
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
  const selectedForApply = [...coupOutcomes, ...warOutcomes, ...structuralCandidates, ...selected];

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
  let memoryState = applied.worldState;
  // Disposition write-side, the READ-LAST/WRITE-NEXT seam: fold this tick's
  // resolved-contest win/loss deltas into NEXT-tick dispositionStats. The deltas
  // were READ from contests that resolved THIS tick; the ledger they produce is
  // first READ at candidate-build NEXT tick — never mid-tick. applyDispositionDeltas
  // sorts by id (commutative, order-independent) and returns the input ledger
  // unchanged for [] — so this is byte-neutral on the OFF path / quiet ticks.
  if (pendingDispositionDeltas.length) {
    memoryState = {
      ...memoryState,
      dispositionStats: applyDispositionDeltas(memoryState.dispositionStats, pendingDispositionDeltas),
    };
  }
  // The SECONDARY-STATUS OVERLAY (compatibility-enforced). Trade
  // ties create/reinforce LAYERED secondary statuses (critical/preferred/military
  // supplier; smuggling for a battlefield primary) on each edge, OVER the primary
  // `relationshipType` (never replacing it). Derived from the post-apply primaries
  // + this tick's salience ties, every status run through the isCompatible gate
  // so a hostile primary cannot carry normal commerce. ONLY under the war layer ⇒
  // a legacy campaign never gains a `secondaryStatuses` key (byte-neutral under the
  // dormancy oracle). Anti-oscillation: an edge whose status set is unchanged keeps
  // its reference; an edge that lost all coherent statuses drops the key.
  if (simulationRules.warLayerEnabled) {
    const overlaySnapshot = buildWorldSnapshot({
      campaign: { ...campaign, worldState: memoryState, regionalGraph: applied.regionalGraph },
      saves: postTimeSaves,
      worldState: memoryState,
    });
    const overlay = computeSecondaryStatusOverlay(overlaySnapshot, memoryState, { tick: worldState.tick });
    const relationshipStates = memoryState.relationshipStates || {};
    let overlayChanged = false;
    const nextStates = { ...relationshipStates };
    for (const [key, state] of Object.entries(relationshipStates)) {
      const next = overlay[key] || null;
      const prev = state?.secondaryStatuses || null;
      // Codepoint-stable compare (both already sorted) — only rewrite on a real change.
      const same = JSON.stringify(prev) === JSON.stringify(next);
      if (same) continue;
      overlayChanged = true;
      if (next && next.length) {
        nextStates[key] = { ...state, secondaryStatuses: next };
      } else if (prev) {
        const { secondaryStatuses: _drop, ...rest } = state;
        nextStates[key] = rest;
      }
    }
    if (overlayChanged) memoryState = { ...memoryState, relationshipStates: nextStates };
  }
  // The READ-LAST/WRITE-NEXT pantheon ratchet, post-apply, mirroring
  // the dispositionStats seam directly above. ONLY when religion is active this tick
  // (the CONDITIONAL materialization: a dormant world never gains a pantheon key, so
  // a deity-free campaign stays byte-identical under the dormancy oracle). The
  // ratchet folds this tick's conversion wins/losses (commutative, sorted by
  // deityId), re-counts seatsControlled from the PRE-TICK snapshot (codepoint-sorted
  // save-id order), and re-derives each deity's tier as a LAZY VIEW with hysteresis
  // dwell + a per-tick containment cap. The tier CHANGES feed the realm-arc synthesis
  // below (Ascendancy / Twilight).
  /** @type {Array<{deityId:string, from:string, to:string}>} */
  let pantheonTierChanges = [];
  if (religionActiveThisTick && pantheonSeatSnapshot) {
    const advanced = advancePantheon({
      pantheon: memoryState.pantheon || {},
      snapshot: pantheonSeatSnapshot,
      faithDeltas: pendingFaithDeltas,
    });
    // Only materialize the pantheon key when the ledger is non-empty — an active
    // religion with no seats/deltas yet stays absent (byte-neutral under the oracle).
    if (Object.keys(advanced.pantheon).length) {
      memoryState = { ...memoryState, pantheon: advanced.pantheon };
      pantheonTierChanges = advanced.changes;
    }
  }
  // The dossier stops lying: project the per-faction live state
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
    candidateCount: candidates.length + tierResource.candidates.length + instLifecycle.candidates.length + structuralCandidates.length + coupOutcomes.length + warOutcomes.length,
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
  const realmEntries = synthesizeRealmEvents({
    worldState: memoryState,
    tick: worldState.tick,
    now,
    // The post-apply regional graph carries this tick's war_front mints, so
    // a coalition siege names its instigators + supporters and "The War" counts the
    // belligerents, not just the besieged victim. Absent ⇒ legacy victim-count.
    regionalGraph: applied.regionalGraph,
  })
    .filter(isFreshArcEntry);
  // Pantheon realm arcs: a deity crossing into 'major' ("The Ascendancy of X")
  // or falling to 'cult' ("The Twilight of X"). Derived from this tick's tier
  // CHANGES (fires once, on the crossing) — empty unless religion is active and a
  // tier actually flipped this tick. Names resolved off the pre-tick snapshot.
  const pantheonArcEntries = synthesizePantheonArcs({
    changes: pantheonTierChanges,
    snapshot: pantheonSeatSnapshot,
    tick: worldState.tick,
    now,
  });
  const aftermathEntries = [
    ...aftermathNewsEntries(agedStressors.resolved, worldState.tick, now),
    ...graduationNewsEntries(agedStressors.graduated || [], worldState.tick, now),
  ];
  // Capture transitions reach the DM: the factionCaptureEvents
  // pulseRecord rollup above was consumed by nobody, so a faction falling to
  // (or breaking from) the underworld never surfaced in the Chronicle.
  const settlementNameFor = (id) => {
    const entry = settlementMap.get(String(id));
    return entry?.save?.name || entry?.settlement?.name || String(id);
  };
  const captureNewsEntries = captureTransitionNewsEntries(
    factionCapture.transitions, settlementNameFor, worldState.tick, now,
  );
  const newsToAppend = [...aftermathEntries, ...captureNewsEntries, ...realmEntries, ...pantheonArcEntries];
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
    candidates: [...coupOutcomes, ...warOutcomes, ...structuralCandidates, ...candidates, ...tierResource.candidates, ...instLifecycle.candidates],
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
