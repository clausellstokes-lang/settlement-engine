// pulseKernel — the pure one-week simulation kernel. `simulateCampaignWorldPulse`
// bumps the tick +1, re-seeds its PRNG from the world seed, and composes the full
// per-tick world advance (stressors, corruption, war/trade/occupation/religion
// layers, candidate rolls, apply pass, memory ratchets, pulse record). It is the
// kernel the multi-tick interval orchestrator (advanceInterval.js) runs N times.
// Imports the shared compactors / clone / interval helpers from pulseHelpers.js
// and never imports advanceInterval.js (keeps the chain acyclic).
import { createPRNG } from '../../kernel/prng.js';
import { advanceTime } from '../timeProgression.js';
import { withActiveCondition } from '../activeConditions.js';
import { buildWorldSnapshot } from './worldSnapshot.js';
import { ensureWorldState, advanceWorldCalendar, appendPulseHistory, pulseIdFor, seasonForTick } from './worldState.js';
import { ageRoamingStressors } from './stressors.js';
import { recordWarResolutionIncidents } from './stressorDynamics.js';
import { coupVerdictOutcomes, isCoupResidualOutcome } from './coup.js';
import { evaluateWarLayer, stripSuppressedDeployResidue } from './warDeployment.js';
import { evaluateMobilization } from './mobilization.js';
import { mobilizationEffects } from './mobilizationEffects.js';
import { evaluateTradeWar } from './tradeWar.js';
import { advanceReligionStates, buildFaithReach } from './religiousContest.js';
import { realmPietyMult } from './piety.js';
import { projectReligionStateOntoSettlement, applyDivineMandate } from './religionState.js';
import { advanceMartialReadiness, buildThreatByCid } from './martialReadiness.js';
import { advanceConquestFeeds } from './conquestFeeds.js';
import { advanceMercenaryMarket } from './mercenaryMarket.js';
import { isSubsystemActive } from './subsystemActivation.js';
import { deploymentReturnOutcomes } from './deploymentReturn.js';
import { evaluateOccupations } from './occupation.js';
import { addRegionalChannels, setRegionalChannelStatus } from '../region/graph.js';
import { aftermathNewsEntries, graduationNewsEntries, recordGraduationsIntoHistory } from './stressorAftermath.js';
import { advanceFoodStockpile, blockadeFor, famineFor } from './foodStockpile.js';
import { seasonalContextFor, seasonalBoundaryEntries, seasonalThawEntries } from './seasons.js';
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
import { advanceRumorLedgers } from '../spatial/rumorNetwork.js';
import { advanceEmbattlement, rampThreat, embattlementActive } from '../spatial/embattlement.js';
import { activeSpatialDigest, activeSeasonalOverlay } from '../spatial/distanceRead.js';
import { advanceSettlementSupply } from './supplyKernel.js';
import { warFrontsInto } from './warFrontReads.js';
import { advanceBeliefMaps, beliefMisjudgmentNewsEntries } from './beliefMap.js';
import { synthesizeRealmEvents, synthesizePantheonArcs } from './realmEvents.js';
import { appendWizardNewsEntries } from '../region/index.js';
import { evaluatePopulationDynamics } from './populationDynamics.js';
import { evaluateTierResourceDynamics } from './tierResourceDynamics.js';
import { evaluateInstitutionLifecycle } from './institutionLifecycle.js';
import { evaluateMoralInstitutionPressure, evaluateMoralInstitutionFounding } from './moralInstitutionPressure.js';
import { advanceInstitutionTolerance } from './institutionTolerance.js';
import { advanceCauseLifecycle, projectCauseLifecycleOntoSettlement, causeLifecycleNewsEntries } from './causeLifecycle.js';
import { normalizeSimulationRules, isFaithSpreadEnabled } from './simulationRules.js';
import { deriveDecisionTier } from './decisionTier.js';
import { wallClockNow, assertNowPinnedInTest } from '../clock.js';
import { clone, saveId, compactOutcomeForHistory, compactImpactDigest, usableTickInterval } from './pulseHelpers.js';
import { assertNoResidueLeak } from './residueStripGuard.js';

/**
 * RESIDUE-STRIP REGISTRY (machine-enforced; replaces the old prose checklist).
 * @enforced-by tests/domain/residueStripRegistry.test.js
 *
 * Each entry is a simulation layer that banks OUT-OF-BAND ledger/graph residue while
 * running, which the pause/resume + dismiss byte-equivalence invariant requires be
 * stripped for every suppressed major. In the kernel each site carries a matching
 * `@residue-strip: <id>` marker; tests/domain/residueStripRegistry.test.js fails the
 * gate if the markers and this list drift apart — so a NEW residue-banking layer can
 * no longer silently ship without a strip + a registry entry, and a deleted strip is
 * caught. `coveredBy` names the pause/dismiss equivalence test that pins the site's
 * byte-equivalence (null = a KNOWN, TRACKED coverage gap — the meta-test asserts it
 * against an explicit allowlist, so an uncovered site is VISIBLE and acknowledged
 * rather than silently unverified, which was the whole problem the review flagged).
 *
 * @type {ReadonlyArray<{ id: string, banks: string, coveredBy: string|null }>}
 */
export const RESIDUE_STRIP_SITES = Object.freeze([
  { id: 'war_mobilization',      banks: 'warPosture ramp + information_flow signal channels', coveredBy: 'worldPulseDeferMajorResidue.test.js' },
  { id: 'strategy_deploy',       banks: 'deployment seed + war_front channel + deploy-tick exhaustion ratchet + conscription/levy debits', coveredBy: 'warConservationDismiss.test.js' },
  { id: 'conquest',              banks: 'occupation seed + conquest disposition ratchet',     coveredBy: 'worldPulseDeferMajorResidue.test.js' },
  { id: 'occupation_vassalized', banks: 'vassal promotion + advance-win disposition residue', coveredBy: 'worldPulseDeferMajorResidue.test.js' },
]);

// The upward pressure to mobilize: a settlement RAMPS its war posture
// when it faces a hostile-axis neighbour (rival / cold_war / hostile). Returns a
// memoized `(id) => boolean` over the pre-tick edges + relationshipStates. Pure,
// codepoint-stable (the result is a set membership test, order-free).
const MOBILIZATION_HOSTILE_TYPES = new Set(['hostile', 'cold_war', 'rival']);
/** @param {any} snapshot */
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

/** @param {any} snapshot @param {any} localSettlements */
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

/** @param {any} worldState @param {any} campaign @param {any} interval */
function nextWorldStateForPulse(worldState, campaign, interval) {
  const current = ensureWorldState(worldState, campaign);
  const tick = current.tick + 1;
  return {
    ...current,
    tick,
    calendar: advanceWorldCalendar(current.calendar, interval),
  };
}

/**
 * @param {Object} [args]
 * @param {any} [args.campaign]
 * @param {any[]} [args.saves]
 * @param {string} [args.interval]
 * @param {boolean} [args.commit]
 * @param {string} [args.now]
 * @param {boolean} [args.deferMajors] Advance-scaling Stage 3 PAUSE: when true,
 *   this tick applies its MINORS only (auto-resolved as usual) and WITHHOLDS the
 *   structural MAJORS from the settlement/world apply pass — they are surfaced on
 *   `deferredMajors` for the orchestrator to either auto-resolve (autoresolve ON)
 *   or park for a DM decision (autoresolve OFF). The pulseRecord still records the
 *   FULL selected set (majors included as an annotation), so the committed
 *   pulseHistory is byte-identical to the autoresolve-ON path; only the MUTATION of
 *   the majors is deferred to `applyDeferredMajorDecisions`. Default false ⇒ the
 *   legacy single-pass behavior, byte-identical to today.
 * @param {ReadonlySet<string>|null} [args.dismissMajorIds] Advance-scaling Stage 3
 *   RESUME: the ids of structural majors the DM DISMISSED. On the resume re-run of
 *   a paused tick (deferMajors OFF, full single-pass apply), these are EXCLUDED from
 *   the apply set — so a dismissed war/coup/government-change never lands, while
 *   every other major auto-resolves to recommended. EMPTY/null ⇒ no exclusion, so a
 *   resume that dismissed nothing re-runs BYTE-IDENTICALLY to the autoresolve-ON
 *   tick (the equivalence invariant). Inert on the non-resume path.
 */
export function simulateCampaignWorldPulse({ campaign, saves = [], interval = 'one_month', commit = false, now, deferMajors = false, dismissMajorIds = null } = {}) {
  // Structural pin-`now` guard: an unpinned call is reproducible-forfeiting, so in a
  // test run it throws (never silently divergent bytes); production pins `now` and
  // falls back to the wall clock only here, at the boundary.
  if (now == null) { assertNowPinnedInTest('simulateCampaignWorldPulse'); now = wallClockNow(); }
  /** @type {import('../settlement.schema.js').TickInterval} */
  const tickInterval = usableTickInterval(interval);
  // RESUME dismissal set, computed ONCE up front (before the war/occupation block).
  // A dismissed major is excluded from the apply pass below — but a CONQUEST major
  // also has OUT-OF-BAND ledger effects (evaluateOccupations seeds an occupation into
  // worldState.occupations from the conquest power_transfer), so suppressing it from
  // the apply set alone would leave a phantom occupation. We thread this set into the
  // occupation layer so a dismissed conquest never seeds an occupation in the first
  // place. EMPTY/null ⇒ no exclusion ⇒ byte-identical to the autoresolve-ON tick (the
  // equivalence invariant). Inert on the deferMajors / non-resume path.
  //
  // SEMANTICS of a dismissed conquest: the OCCUPATION + its disposition deltas are
  // rolled back, but the war-layer resolution (the besieging army's deployment clears,
  // the war_front resolves) is INTENTIONALLY kept — a dismissed conquest means "the
  // takeover didn't stick; the armies disperse", NOT "the siege rewinds and continues".
  // So: no phantom occupation / orphaned ledger (the bug), and no auto-continued siege.
  const activeDismissals = !deferMajors && dismissMajorIds && typeof dismissMajorIds.has === 'function' && dismissMajorIds.size > 0
    ? dismissMajorIds
    : null;
  // PAUSE-path residue suppression (deferMajors=true). A paused tick WITHHOLDS every
  // major from the apply pass (the deferredMajors partition below) but the war /
  // mobilization / occupation layers still ran and banked their OUT-OF-BAND ledger
  // residue — an occupation seeded from a withheld conquest, a warPosture ramp from a
  // withheld mobilization, a vassalized promotion from a withheld vassalization, the
  // conquest disposition ratchet. Left committed, a PAUSED world is internally
  // inconsistent: the occupation is written while the conquest major it came from is
  // parked for a DM decision. So the SAME residue the dismiss path suppresses for a
  // withheld major must be suppressed here for EVERY deferred major. The dismiss path
  // keys its suppression by an explicit id set; the defer path withholds ALL majors, so
  // we derive the equivalent id set from the in-block major outcomes via this predicate.
  // The two never co-fire (activeDismissals is null when deferMajors is on, and this is
  // null when off), and BOTH are inert when there is nothing to withhold — so a paused
  // world with no majors, and a resume that dismissed nothing, stay byte-identical to
  // the single-pass autoresolve-ON tick (the equivalence invariant).
  const suppressDeferredMajorResidue = deferMajors;
  // The effective suppression id set for a list of outcomes: the explicitly-dismissed
  // majors on the resume path, or EVERY major on the pause path. Returns null when
  // nothing is suppressed (so the sub-evaluators short-circuit to byte-identical).
  const residueSuppressionIds = (/** @type {any[]} */ outcomes) => {
    if (activeDismissals) return activeDismissals;
    if (!suppressDeferredMajorResidue) return null;
    const ids = new Set();
    for (const o of outcomes || []) {
      if (deriveDecisionTier(o) === 'major' && o?.id != null) ids.add(String(o.id));
    }
    return ids.size > 0 ? ids : null;
  };
  // ── RESIDUE-STRIP REGISTRY — see RESIDUE_STRIP_SITES (module scope, exported) ──
  // The pause/resume + dismiss byte-equivalence invariant depends on a manual,
  // repeated pattern: any layer that, while running, banks OUT-OF-BAND ledger/graph
  // residue (a write NOT routed through the deferred-majors apply partition) MUST,
  // for every suppressed major (residueSuppressionIds), strip that residue back out.
  // Each strip site below carries an `@residue-strip: <id>` marker; the prose list
  // that used to live here (and rot) is now the machine-enforced RESIDUE_STRIP_SITES
  // constant. @enforced-by tests/domain/residueStripRegistry.test.js — it fails the gate
  // if the markers and the registry drift apart (a new strip without a registry entry, or a deleted
  // strip), and pins which pause/dismiss equivalence test covers each site. A NEW
  // layer that banks residue must add a strip + its marker + a registry entry, or the
  // gate blocks. All strips are byte-neutral when nothing is suppressed.
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
  // The religion layer's deity→corruption / deity→capture effects are LOCAL faith
  // effects (Phase 4 W-F1): active whenever a deity is present — the activation gate
  // ALONE (≥1 settlement carries an embedded config.primaryDeitySnapshot), no rule
  // flag. This is the owner's standalone-faith doctrine (an evil patron rots its own
  // town whether or not the campaign's cross-settlement SPREAD lane is enabled).
  // Deity-free ⇒ inactive ⇒ the corruption / capture gates are unrelaxed and
  // deityDisfavor is 1.0 ⇒ byte-identical legacy.
  const religionActive = isSubsystemActive(snapshot, 'religion');
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
        warExhaustion: worldState.warExhaustion || {},
        warDispositionEnabled: simulationRules.warDispositionEnabled,
      })
    : [];

  const localSettlements = new Map();
  const settlementTickStates = { ...(worldState.settlementTickStates || {}) };
  const timeTicks = [];
  // ── SEASONS-A: the food year (design §4i), flag-gated at the CL-0 seam.
  // OFF ⇒ seasonClock stays null ⇒ every settlement's `seasonal` stays null ⇒
  // advanceFoodStockpile runs its legacy arithmetic byte-identically, no rng
  // is forked, no field is written (the dormancy-oracle discipline). ON ⇒ the
  // clock reads the ADVANCED calendar's canonical integer weeks (consistent
  // with the calendar labels the pressure model already reads), and each
  // settlement gets its biome-amplituded, variance-scaled swing. The variance
  // draw forks the tick-invariant WORLD seed (`season:<year>:<sid>`) so every
  // week of a year reads the same verdict (seasons.js).
  const seasonsOn = simulationRules.seasonsEnabled === true;
  const seasonClock = seasonsOn ? seasonForTick(worldState.calendar.elapsedWeeks) : null;
  // ── SEASONS-B (M3): WINTER ROADS. The road season is derived FREE from the
  // ADVANCED calendar (seasonForTick), INDEPENDENT of the food-year flag: seasonal
  // roads gate on the digest's seasonalOverlay, not seasonsEnabled. Threaded into
  // every spatial travel read (supply routes, rumor relays, propagation arrivals).
  // A dormant / pre-M3 digest has no overlay ⇒ every seasonal read is multiplier
  // 1.0 ⇒ byte-identical whether or not the season is threaded.
  const roadSeason = seasonForTick(worldState.calendar.elapsedWeeks).season;
  // Flag-on granary states for the season boundary markers (harvest thinness,
  // hungry-gap direness) — collected from this tick's stockpile advance.
  /** @type {Array<{ id: string, name: string, storageMonths: number, deficitPct: number }>} */
  const seasonalFoodStates = [];
  for (const item of snapshot.settlements) {
    const previousTickState = settlementTickStates[item.id] || null;
    /** @type {any} */
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
    const seasonal = seasonClock
      ? seasonalContextFor({
          rngSeed: startingWorldState.rngSeed,
          clock: seasonClock,
          settlement: result.newSettlement,
          settlementId: item.id,
        })
      : null;
    const stocked = advanceFoodStockpile(result.newSettlement, {
      interval: tickInterval,
      tick: worldState.tick,
      blockade,
      famine: famineFor(worldState.stressors, item.id),
      deployment,
      seasonal,
    });
    if (seasonsOn) {
      // The advance summary carries the post-advance granary numbers; null
      // (no food ledger / unchanged) reads as an empty, quiet granary.
      seasonalFoodStates.push({
        id: String(item.id),
        name: item.name || String(item.id),
        storageMonths: stocked.summary ? stocked.summary.storageMonths : 0,
        deficitPct: stocked.summary ? stocked.summary.effectiveDeficitPct : 0,
      });
    }
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

  // Phase 5.5 mover M2 — CARAVANS / SUPPLY-STARVATION. Before the war layer (so a
  // supply-starved besieged town's weakened hold feeds THIS tick's siege verdict via
  // M2b): advance the AGGREGATE in-transit shipment ledger over the active consuming
  // links (pre-ranked reachable producers from the frozen digest; O(K) failover; basic
  // interception; banditry on the delivered quantity), write the per-input buffers +
  // the SUPPLY-STARVED impairment onto the settlements, and the ledger onto worldState.
  // DORMANT (no spatial marker / no non-food cross-settlement links) ⇒ a no-op, nothing
  // touched — byte-identical. Food stays with foodStockpile (no double-count).
  {
    const supply = advanceSettlementSupply({
      snapshot,
      localSettlements,
      worldState,
      graph: snapshot.regionalGraph,
      digest: worldState.spatialDigest,
      tick: worldState.tick,
      tickWeeks: { one_week: 1, one_month: 4, one_season: 13, one_year: 52 }[tickInterval] || 1,
      season: roadSeason,
      rng,
      now,
    });
    if (supply.changed) worldState = supply.worldState;
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
    // RESUME dismissal: a DM-dismissed war_mobilization major must commit NOTHING — not
    // its footing condition, not its neighbour signal channels, AND not its warPosture
    // ledger entry (dropped below from effects.dismissedIds). On the dismiss path the
    // whole outcome is gone (the DM declined it), so mobilizationEffects drops it
    // wholesale via dismissedOutcomeIds.
    const effects = mobilizationEffects({
      snapshot: postTimeSnapshot,
      events: mobilization.events,
      tick: worldState.tick,
      now,
      dismissedOutcomeIds: activeDismissals,
    });
    mobilizationOutcomes = effects.outcomes;
    // @residue-strip: war_mobilization  (registered in RESIDUE_STRIP_SITES; sync-enforced)
    // PAUSE-path residue suppression: a DEFERRED war_mobilization major is still SURFACED
    // (it must reach deferredMajors so the DM can decide it on resume) and its footing
    // condition is withheld from the apply pass by the deferMajors partition below — but
    // its OUT-OF-BAND residue (the warPosture ramp + the neighbour signal channels) must
    // NOT commit, else the paused world ramps a war footing whose mobilization is parked.
    // So unlike the dismiss path (which drops the whole outcome), the defer path KEEPS the
    // footing outcome and strips only the ledger/graph residue, keyed by the settlement id
    // of each deferred footing major (war_mobilization is always a major).
    const deferredMobilizerIds = suppressDeferredMajorResidue
      ? new Set(effects.outcomes.filter(o => deriveDecisionTier(o) === 'major' && o?.targetSaveId != null).map(o => String(o.targetSaveId)))
      : null;
    // Drop the warPosture ledger key for any settlement whose war_mobilization the DM
    // dismissed (effects.dismissedIds) or whose footing major this paused tick deferred:
    // the posture ramp is a SIDE EFFECT of a major that did not (or has not yet) landed.
    // Mirrors the conquest-dismiss occupation-seed suppression. Byte-neutral otherwise.
    let nextWarPosture = mobilization.warPosture;
    if (effects.dismissedIds.length || deferredMobilizerIds?.size) {
      nextWarPosture = { ...mobilization.warPosture };
      for (const id of effects.dismissedIds) delete nextWarPosture[id];
      if (deferredMobilizerIds) for (const id of deferredMobilizerIds) delete nextWarPosture[id];
    }
    // On the pause path, also drop the deferred mobilizers' VISIBLE signal channels (the
    // information_flow mints from war_layer_mobilization) from the graph residue — they
    // are the public face of a war footing the DM has not yet ratified. The dismiss path
    // never minted them (the outcome was dropped); the defer path minted them here, so we
    // filter them out before they land on the snapshot.
    const postureGraphChannels = deferredMobilizerIds?.size
      ? effects.graphChannels.filter(c => !(c?.type === 'information_flow' && deferredMobilizerIds.has(String(c?.from))))
      : effects.graphChannels;
    // Persist the NEXT-tick posture ledger (deep-cloned via ensureWorldState's
    // conditional clone on the next read). Only materialize the key when non-empty —
    // a dormant campaign keeps NO warPosture key (byte-neutral under the oracle).
    worldState = Object.keys(nextWarPosture).length
      ? { ...worldState, warPosture: nextWarPosture }
      : (() => { const { warPosture: _drop, ...rest } = worldState; return rest; })();
    // Rebuild the snapshot so the war layer's deploy gate + the reaction rule read the
    // persisted posture AND the freshly-minted mobilization signals.
    const postureCampaign = { ...campaign, worldState, regionalGraph: postTimeSnapshot.regionalGraph };
    if (postureGraphChannels.length) {
      const signalGraph = addRegionalChannels(postTimeSnapshot.regionalGraph, postureGraphChannels, { now });
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
  let war = evaluateWarLayer({
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
    // The war-outcome suppression id set, computed ONCE up front (the dismissed majors on
    // the resume path, EVERY major on the pause path, null otherwise). Reused below for
    // the conquest occupation-seed / disposition strip AND, right here, for the SIEGE-
    // INITIATION (strategy_deploy) residue.
    const warOutcomeSuppressedIds = residueSuppressionIds(war.outcomes);
    // @residue-strip: strategy_deploy  (registered in RESIDUE_STRIP_SITES; sync-enforced)
    // SIEGE-INITIATION residue suppression: a DEFERRED or DISMISSED strategy_deploy major
    // is the campaign-altering decision to OPEN a new siege. Its apply outcome is a
    // settlement no-op (withheld from / excluded from the apply pass by the major
    // partition below), but the deploy banked OUT-OF-BAND residue this tick: the new
    // deployment SEED in war.deployments and the war_front channel mint in
    // war.graphChannels. Left committed, a paused/dismissed siege would leave an army in
    // the field + a confirmed front (the next tick reads them as a live siege, bypassing
    // the DM decision entirely) — the same "phantom out-of-band ledger" the conquest
    // dismiss fix closes. So strip BOTH for every suppressed strategy_deploy, keyed off
    // the outcome's targetSaveId (the besieger) → sourceEventTargetId (the besieged).
    // The deploy ALSO banked residue beyond the seed + front on its very first tick:
    //   • the war-exhaustion RATCHET (step 5 accrues the scar for every deployer, the
    //     fresh one included, and a war_levy strains each levied vassal's scar), and
    //   • the same-tick MINOR emissions its deployment triggered — the conserved
    //     war_conscription / war_levy population+granary DEBITS plus the
    //     war_drain / army_deployed / war_exhaustion / reinforcement_cost home
    //     conditions. These are minors, so the major partition below would still
    //     auto-apply them; left in, a dismissed deploy would ratchet a scar for a war
    //     that never opened AND permanently SINK the conscripted/levied population
    //     (the debit commits while the deployedPopulation bank that would credit the
    //     survivors home is stripped with the deployment).
    // So a suppressed deploy strips ALL of it — the seed, the front, its same-tick
    // minors, and the exhaustion ratchet (reverted to the no-deploy counterfactual via
    // revertSuppressedDeployExhaustion) — making dismiss fully conserving. A fresh
    // deployer holds no prior deployment (step 4's one-army gate), so every step-5
    // emission keyed to it this tick belongs to the dismissed deploy alone.
    // Mirrors the conquest occupation-seed suppression; byte-neutral when nothing is
    // suppressed (the autoresolve-ON path keeps the deployment + front untouched).
    // The seed/front/exhaustion/minor strip is a pure war-shape transform living beside
    // its arithmetic in warDeployment.js (stripSuppressedDeployResidue); byte-neutral when
    // nothing is suppressed. Re-seat the cleaned deployments/warExhaustion/outcomes/fronts.
    war = {
      ...war,
      ...stripSuppressedDeployResidue({
        war,
        suppressedIds: warOutcomeSuppressedIds,
        preTickWarExhaustion: worldState.warExhaustion || {},
      }),
    };
    // Persist the updated one-army ledger so it survives to the next tick. The
    // war-exhaustion scar ledger rides alongside it (non-reverting; ratcheted by the
    // evaluator, decayed slowly when armies come home) — read-last/write-next.
    worldState = { ...worldState, deployments: war.deployments, warExhaustion: war.warExhaustion };
    // Defender-attrition SPIKE (flag-gated): persist the per-target defender siege
    // ledger only when the flag produced one. Null on the default path ⇒ the key is
    // never added, so worldState stays byte-identical for every existing campaign.
    if (war.defenderSiegeLedger) {
      worldState = { ...worldState, defenderSiegeLedger: war.defenderSiegeLedger };
    }
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
    // current) and the pre-tick snapshot for home state.
    // NOTE: this deliberately re-forks the SAME 'war-layer' label as evaluateWarLayer
    // above, so the two share an identical PARENT stream. That is safe ONLY because
    // neither draws from this parent directly — evaluateWarLayer re-forks on
    // 'siege:<target>:<tick>' and deploymentReturnOutcomes re-forks on
    // 'deployment-return', so the actual draws are independent. The label cannot be
    // renamed to disambiguate (a fork label feeds the derived child seed, so changing
    // it would alter sim output for every existing campaign + break the golden master).
    // INVARIANT: if either layer is ever changed to draw from this fork directly, give
    // this call site its own distinct label first, or the two will silently correlate.
    warReturnOutcomes = deploymentReturnOutcomes({
      resolvedDeployments: war.resolvedDeployments,
      snapshot: postTimeSnapshot,
      graph: postTimeSnapshot.regionalGraph,
      rng: rng.fork('war-layer'),
      tick: worldState.tick,
      // NOTE: no warEconomy flag threaded — the homecoming credit is gated on the
      // record's BANKED deployedPopulation (whether population was actually debited),
      // not the live flag, so conservation holds under any flag combination and
      // mid-war flag changes (see deploymentReturn.js).
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
    // @residue-strip: conquest  (registered in RESIDUE_STRIP_SITES; sync-enforced)
    // A DM-DISMISSED conquest must not seed an occupation: drop any conquest
    // power_transfer the DM dismissed from the conquest set the occupation layer
    // reads, so freshConquestsFrom never seeds a phantom `contested` occupation for a
    // target the DM declined to let fall. The dismissed conquest is ALSO excluded from
    // the apply set below — the two filters together leave NO occupation/ledger residue
    // for a dismissed conquest. On the PAUSE path the SAME seed suppression applies to
    // EVERY deferred conquest major (a paused world must not seed an occupation from a
    // conquest parked for a DM decision). Byte-neutral when nothing is suppressed (the
    // array is returned unchanged by reference).
    const conquestSuppressedIds = warOutcomeSuppressedIds;
    const occupationWarOutcomes = conquestSuppressedIds
      ? war.outcomes.filter(o => !(deriveDecisionTier(o) === 'major' && conquestSuppressedIds.has(String(o.id))))
      : war.outcomes;
    const occupationArgs = {
      snapshot: postTimeSnapshot,
      worldState,
      graph: postTimeSnapshot.regionalGraph,
      deployments: war.deployments,
      warOutcomes: occupationWarOutcomes,
      returnOutcomes: warReturnOutcomes,
      tick: worldState.tick,
      rules: simulationRules,
    };
    // RESUME dismissal: a DM-dismissed occupation_vassalized must NOT strand the
    // occupation at the terminal `vassalized` rung — the state machine rolls the
    // promotion back so the vassal edge (filtered from the apply set below) and the
    // ledger + disposition stay consistent (no rung advance ⇒ no advance-win delta, and
    // the arrival one-shot never fires ⇒ the outcome is dropped). Parity with the
    // conquest-dismiss occupation suppression.
    let occupation = evaluateOccupations({ ...occupationArgs, dismissedOutcomeIds: activeDismissals });
    // @residue-strip: occupation_vassalized  (registered in RESIDUE_STRIP_SITES; sync-enforced)
    // PAUSE-path residue suppression: a DEFERRED occupation_vassalized major must NOT
    // promote the ledger to the terminal `vassalized` rung either (else the paused world
    // holds a vassalized occupation whose vassal edge — withheld from the apply pass — never
    // landed, AND banks the advance-win disposition residue). We RE-RUN the occupation
    // layer with the same in-evaluator rollback the dismiss path uses, threading the
    // would-be vassalization ids (discovered from the full first pass) as the rollback set —
    // so the LEDGER + the advance-win delta are both held back, byte-identically to the
    // dismiss path. But unlike dismiss, the major must still be SURFACED to the DM, so we
    // RE-INJECT the first pass's vassalization outcome(s): they reach deferredMajors and
    // are withheld from the apply pass by the deferMajors partition below. Inert (null)
    // when no vassalization would mint ⇒ byte-identical to the single-pass tick.
    const deferredVassalIds = suppressDeferredMajorResidue ? residueSuppressionIds(occupation.outcomes) : null;
    if (deferredVassalIds) {
      const surfacedVassalizations = occupation.outcomes.filter(
        o => o?.candidateType === 'occupation_vassalized' && deriveDecisionTier(o) === 'major',
      );
      const rolledBack = evaluateOccupations({ ...occupationArgs, dismissedOutcomeIds: deferredVassalIds });
      occupation = {
        ...rolledBack,
        // Surface the withheld vassalization majors (rolledBack omits them); their ledger
        // rung + advance-win delta come from the rolled-back run, their apply is deferred.
        outcomes: [...rolledBack.outcomes, ...surfacedVassalizations],
      };
    }
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
    // A DM-DISMISSED conquest must leave NO disposition ledger residue either: the war
    // layer banks a conqueror WIN + a conquered LOSS for each conquest it resolved (the
    // out-of-band ratchet), so a dismissed conquest would otherwise still tilt next-tick
    // confidence for a power transfer that never landed. Each conquest delta is TAGGED
    // with its source conquest's outcome id at the resolver (warDeployment), so we strip
    // EXACTLY the deltas of the dismissed conquests by that id — robust against order and
    // against an occupier banking two conquests at once OR carrying an unrelated win this
    // tick (which the old {id, outcome} match could mis-strip). On the PAUSE path the SAME
    // strip applies to EVERY deferred conquest major (the ratchet is the out-of-band side
    // effect of a withheld conquest). Reuses the conquest suppression set computed for the
    // occupation seed above. Inert when nothing is suppressed.
    if (conquestSuppressedIds) {
      const dismissedConquestIds = new Set(
        war.outcomes
          .filter(o => o?.candidateType === 'conquest'
            && deriveDecisionTier(o) === 'major'
            && conquestSuppressedIds.has(String(o.id)))
          .map(o => String(o.id)),
      );
      if (dismissedConquestIds.size) {
        pendingDispositionDeltas = pendingDispositionDeltas.filter(
          (delta) => !(delta?.sourceConquestId && dismissedConquestIds.has(String(delta.sourceConquestId))),
        );
      }
    }
  } else if ((war.resolvedDeployments || []).length) {
    // WAR-OFF WIND-DOWN: the layer is OFF but armies were still afield (a mid-
    // campaign toggle). evaluateWarLayer's OFF branch resolved every deployment
    // as a WITHDRAWAL; route the returns through the SAME machinery (conserved
    // homecomings), retire the fronts, clear the ledger. War-never-on worlds:
    // resolvedDeployments is empty ⇒ this never runs (byte-identical).
    worldState = { ...worldState, deployments: war.deployments, warExhaustion: war.warExhaustion };
    const windDownRetired = war.retiredChannels || [];
    if (windDownRetired.length) {
      let warGraph = postTimeSnapshot.regionalGraph;
      for (const channelId of windDownRetired) {
        warGraph = setRegionalChannelStatus(warGraph, channelId, 'dormant', { now });
      }
      const windDownCampaign = { ...campaign, worldState, regionalGraph: warGraph };
      postTimeSnapshot = buildWorldSnapshot({ campaign: windDownCampaign, saves: postTimeSaves, worldState });
    }
    // Same fork-label discipline as the ON path (see the NOTE above that call):
    // neither layer draws from this parent directly, so the shared label is safe.
    warReturnOutcomes = deploymentReturnOutcomes({
      resolvedDeployments: war.resolvedDeployments,
      snapshot: postTimeSnapshot,
      graph: postTimeSnapshot.regionalGraph,
      rng: rng.fork('war-layer'),
      tick: worldState.tick,
    });
  }
  // Religion dynamics: the deity contest + conversion spread +
  // religious_authority mint. Its OWN block parallel to the war block, TWO-LANE
  // gated (Phase 4 W-F1): the LOCAL lane (per-settlement pantheon evolution,
  // legitimacy, patron contest, the divine-mandate substrate) runs whenever the
  // activation gate holds (≥1 settlement carries config.primaryDeitySnapshot) — no
  // rule flag; the cross-settlement SPREAD lane (mints, carrier reach, prevalence,
  // occupation pull) is gated INSIDE advanceReligionStates by faithSpreadEnabled.
  // Activation gate false ⇒ pure no-op ⇒ byte-identical legacy (a no-deity campaign
  // is unchanged even with spread on — the evaluator short-circuits before any
  // fork/mint). See advanceReligionStates for the lane split.
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
  /** @type {Record<string, any> | null} the evolved per-settlement pantheon ledger */
  let nextReligionStates = null;
  /** @type {Record<string, import('./piety.js').PietyRecord> | null} W-F3: this tick's piety read-model per settlement */
  let nextPietyByCid = null;
  // W-F3/W-F7: the realm-piety multiplier, hoisted so amplified-site #10 (pantheon
  // arc salience, below) reads the SAME tick-start value the contest used. Default
  // 1.0 (religion inactive ⇒ no arcs anyway, and 1.0 is the neutral/byte-identical
  // value); assigned inside the active block off the pre-tick snapshot.
  let realmMult = 1;
  const religionLocalActive = isSubsystemActive(postTimeSnapshot, 'religion');
  if (religionLocalActive) {
    // Capture the PRE-conversion snapshot for seat aggregation BEFORE the contest's
    // fresh mints rebuild it. (Mints only add graph channels, not deity seats, so
    // either snapshot counts the same seats — but pinning the pre-contest one keeps
    // the aggregation provably pre-tick.)
    pantheonSeatSnapshot = postTimeSnapshot;
    // W-F3: the realm-piety multiplier g, measured at tick START off the pre-tick
    // snapshot's projected faithProfile.piety (the anti-runaway seam). Exactly 1.0 when
    // spread is off / no campaign (toggle-gated) ⇒ byte-identical.
    realmMult = realmPietyMult(postTimeSnapshot?.settlements, { spread: isFaithSpreadEnabled(simulationRules) });
    const religion = advanceReligionStates({
      snapshot: postTimeSnapshot,
      worldState,
      tick: worldState.tick,
      now,
      rules: simulationRules,
      rng,                       // DI the pulse PRNG (forked per settlement for the patron contest)
      realmMult,
    });
    religiousOutcomes = religion.outcomes;
    nextReligionStates = religion.religionStates;
    nextPietyByCid = religion.pietyByCid;
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
    rng,   // W-F4b item 2b: enables the development-fidelity term (inert without a chaotic-devout patron)
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
  // W-F8 MORAL/MARTIAL institution VIABILITY — the visible battleground. Built/torn down by
  // who holds the patron seat; gated on a patron (config.primaryDeitySnapshot) ⇒ byte-
  // identical without faith. Reads the tick-START projected piety megaphone + readiness off
  // postTimeSnapshot. Its candidates roll through rollCandidates like the economy lane's.
  // item 2b FAITH PRESCRIBES: build the cross-settlement reach (which foreign patrons reach
  // which converts, at carrier-attenuated strength) once, over the EXISTING faith carriers.
  // Empty for a deity-free / carrier-less world ⇒ the moral lane stays local ⇒ byte-identical.
  const faithReach = simulationRules.institutionLifecycleEnabled ? buildFaithReach(postTimeSnapshot) : null;
  const moralInst = evaluateMoralInstitutionPressure(worldState, postTimeSnapshot, {
    tick: worldState.tick,
    simulationRules,
    faithReach,
  });
  worldState = moralInst.worldState;
  // W-C3 item 1 MORAL FOUNDING lane — the mirror of the abolition lane: new benevolent/
  // exploitative institutions RAISED by who holds the patron seat, weighted by the moral
  // plane. Gated on a patron ⇒ byte-identical without faith; years-scale, so it never
  // fires inside a golden's few-tick window (accrues sub-floor, emits nothing).
  const moralFounding = evaluateMoralInstitutionFounding(worldState, postTimeSnapshot, {
    tick: worldState.tick,
    simulationRules,
  });
  worldState = moralFounding.worldState;
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
  const stochasticCandidates = [...candidates, ...tierResource.candidates, ...instLifecycle.candidates, ...moralInst.candidates, ...moralFounding.candidates];
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

  // Advance-scaling Stage 3 PAUSE BOUNDARY: partition the selected set into the
  // structural MAJORS (the campaign-altering subset the DM should get a say on)
  // and everything else (the MINORS, auto-resolved as usual). When deferMajors is
  // ON, only the minors are routed through this tick's apply pass; the majors are
  // returned on `deferredMajors` for the orchestrator to resolve (autoresolve ON)
  // or park (autoresolve OFF). When OFF, the partition is inert — the full set
  // applies in one pass, byte-identical to today.
  const deferredMajors = deferMajors ? selectedForApply.filter(o => deriveDecisionTier(o) === 'major') : [];
  // RESUME re-run filter: when the DM dismissed specific majors, drop them from the
  // apply set on the re-run (deferMajors OFF). Empty/null ⇒ no exclusion ⇒
  // byte-identical to the autoresolve-ON tick. `activeDismissals` (computed up front)
  // is the SAME set the occupation layer was filtered against above, so a dismissed
  // conquest is excluded from BOTH the occupation seed AND the apply set — no residue.
  const outcomesToApply = deferMajors
    ? selectedForApply.filter(o => deriveDecisionTier(o) !== 'major')
    : (activeDismissals
        ? selectedForApply.filter(o => !(deriveDecisionTier(o) === 'major' && activeDismissals.has(String(o.id))))
        : selectedForApply);

  const settlementMap = buildSettlementMap(postTimeSnapshot, localSettlements);
  const applied = applyWorldPulseOutcomes({
    snapshot: postTimeSnapshot,
    worldState,
    regionalGraph: postTimeSnapshot.regionalGraph,
    wizardNews: campaign?.wizardNews,
    settlementMap,
    outcomes: outcomesToApply,
    tick: worldState.tick,
    now,
    season: roadSeason,
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
  if (religionLocalActive && pantheonSeatSnapshot) {
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
  // Persist the evolved per-settlement pantheon ledger (religion rework) — CONDITIONAL
  // materialization: only when non-empty, so a dormant/legacy world carries no
  // religionStates key (byte-identical under the dormancy oracle).
  if (nextReligionStates && Object.keys(nextReligionStates).length) {
    memoryState = { ...memoryState, religionStates: nextReligionStates };
  }
  // W-F8 MARTIAL READINESS / STRATEGIC EXPERIENCE — READ-LAST/WRITE-NEXT, gated on active
  // religion (the faith gate keeps deity-free worlds byte-identical). Reads THIS tick's war
  // ledgers (warPosture/deployments/occupations/warExhaustion on memoryState) + the patron's
  // derived temper through the piety megaphone, ratchets readiness (structural, slow) and
  // EMAs experience (recency-sharp, fast), and CONDITIONALLY materializes the ledger — an
  // all-decayed / war-free faith world drops the key (byte-neutral under the dormancy oracle).
  /** @type {Record<string, import('./martialReadiness.js').MartialRecord>|null} */
  let nextMartialByCid = null;
  if (religionLocalActive && nextReligionStates) {
    const martial = advanceMartialReadiness({
      snapshot: pantheonSeatSnapshot || postTimeSnapshot,
      worldState: memoryState,
      religionStates: nextReligionStates,
      pietyByCid: nextPietyByCid,
      priorMartial: memoryState.martialReadiness || null,
    });
    nextMartialByCid = martial.martialByCid;
    if (nextMartialByCid && Object.keys(nextMartialByCid).length) {
      memoryState = { ...memoryState, martialReadiness: nextMartialByCid };
    } else if (memoryState.martialReadiness !== undefined) {
      const rest = { ...memoryState }; delete rest.martialReadiness; memoryState = rest;
    }
  }
  // W-C2 CONQUEST FEEDS — READ-LAST/WRITE-NEXT (post-apply), gated on the war layer (or a
  // lingering ledger to decay). A CONQUEST this tick seeds a FRESH occupation
  // (memoryState.occupations[takenId].sinceTick === tick) whose occupierId is the VICTOR;
  // each pays the victor a LOOT pulse (always) and a CAPTIVE pulse (only where a standing
  // slave-market survives the conscience gate). The ledger DECAYS every tick and drops to
  // absent when the pulses fade — a world that stops conquering returns to byte-neutral.
  if (simulationRules.warLayerEnabled || memoryState.conquestFeeds !== undefined) {
    const occLedger = memoryState.occupations || {};
    /** @type {Array<{ victorId: string, takenId: string, kind: string, severity: number }>} */
    const freshConquests = [];
    for (const o of war.outcomes || []) {
      if (o?.candidateType !== 'conquest') continue;
      const takenId = String(o.targetSaveId);
      const occ = occLedger[takenId];
      // A dismissed / deferred conquest never seeds an occupation ⇒ no feed (the occupation
      // seed already excludes it). Only THIS tick's freshly-seeded occupation qualifies.
      if (!occ || occ.occupierId == null || Number(occ.sinceTick) !== Number(worldState.tick)) continue;
      const kind = Array.isArray(o.populationDeltas) && o.populationDeltas.length ? 'sack' : 'capture';
      freshConquests.push({ victorId: String(occ.occupierId), takenId, kind, severity: Number(o.severity) || 0.6 });
    }
    const conquest = advanceConquestFeeds({
      snapshot: pantheonSeatSnapshot || postTimeSnapshot,
      priorLedger: memoryState.conquestFeeds || null,
      conquests: freshConquests,
    });
    if (conquest.conquestFeedsByCid && Object.keys(conquest.conquestFeedsByCid).length) {
      memoryState = { ...memoryState, conquestFeeds: conquest.conquestFeedsByCid };
    } else if (memoryState.conquestFeeds !== undefined) {
      const rest = { ...memoryState }; delete rest.conquestFeeds; memoryState = rest;
    }
  }
  // W-C2 MERCENARY / ADVENTURER-GUILD COMPENSATING MARKET — READ-LAST/WRITE-NEXT, gated on
  // the war layer (or a lingering ledger to clear). Where a settlement's war EXPOSURE
  // (threat index + this-tick engagement) exceeds its native CAPABILITY (readiness + supply
  // quality) AND it has local mercenary/adventurer-guild institutions, a rented-force market
  // activates — the supplement/upkeep-cost/fidelity-penalty legs the next tick's deployment
  // and economy seams read. Materializes ONLY where a market is active ⇒ byte-neutral otherwise.
  if (simulationRules.warLayerEnabled || memoryState.mercenaryMarket !== undefined) {
    const mercSnapshot = pantheonSeatSnapshot || postTimeSnapshot;
    const merc = advanceMercenaryMarket({
      snapshot: mercSnapshot,
      worldState: memoryState,
      threatByCid: buildThreatByCid(mercSnapshot, memoryState),
      martialByCid: nextMartialByCid,
    });
    if (merc.mercenaryMarketByCid && Object.keys(merc.mercenaryMarketByCid).length) {
      memoryState = { ...memoryState, mercenaryMarket: merc.mercenaryMarketByCid };
    } else if (memoryState.mercenaryMarket !== undefined) {
      const rest = { ...memoryState }; delete rest.mercenaryMarket; memoryState = rest;
    }
  }
  // W-C3 item 2a TRADE NORMALIZES TOLERANCE — READ-LAST/WRITE-NEXT, gated on the moral
  // systems (or a lingering ledger to relax). Each settlement's institution-tolerance
  // OFFSET drifts, at a multi-year half-life, toward the mass-weighted average of its trade
  // partners' effective tolerances (read from the PRIOR ledger, so this tick's founding read
  // last tick's drift). Materializes ONLY where drift is non-negligible ⇒ byte-neutral for a
  // world with no trade or all-neutral planes; the key is dropped when nothing drifts.
  if (simulationRules.institutionLifecycleEnabled || memoryState.institutionTolerance !== undefined) {
    const tolerance = advanceInstitutionTolerance({
      snapshot: pantheonSeatSnapshot || postTimeSnapshot,
      worldState: memoryState,
    });
    if (tolerance.institutionToleranceByCid && Object.keys(tolerance.institutionToleranceByCid).length) {
      memoryState = { ...memoryState, institutionTolerance: tolerance.institutionToleranceByCid };
    } else if (memoryState.institutionTolerance !== undefined) {
      const rest = { ...memoryState }; delete rest.institutionTolerance; memoryState = rest;
    }
  }
  // W-C5 CAUSE-RESOLUTION LIFECYCLE — the last simulation mechanic. READ-LAST/WRITE-NEXT,
  // post-apply: reads this tick's SETTLED compromise + condition state, LAZILY attributes a
  // real cause to each compromise on first touch (worldState-owned; generation schemas
  // unchanged), and — when an attributed cause genuinely CLEARS and HOLDS the hysteresis
  // window — evolves the compromise by exactly one of re-cause / reform / historicize (trait
  // plane + seeded fork), or overrides it via the exposure / infrastructure-death terminals.
  // The ledger is a PASSIVE annotation (no simulated quantity reads it); the only mutation is
  // REFORM clearing a tag (undo-clean). Gated so a corruption-free world with no lingering
  // ledger never enters the pass ⇒ byte-neutral under the dormancy oracle; a world whose
  // causes never resolve is exact prior bytes (the dormancy law).
  /** @type {Set<string>} conditionIds reformed this tick (tags to clear on the settlements) */
  let causeReformedIds = new Set();
  /** @type {import('./causeLifecycle.js').LifecycleEvent[]} the lifecycle events (receipts + notable-transition news) */
  let causeLifecycleEvents = [];
  const anyCompromise = Object.values(memoryState.npcStates || {}).some((/** @type {{ corruption?: boolean }} */ s) => s?.corruption === true);
  if (memoryState.causeLifecycle !== undefined || anyCompromise) {
    const lifecycle = advanceCauseLifecycle({
      snapshot: pantheonSeatSnapshot || postTimeSnapshot,
      worldState: memoryState,
      priorLedger: memoryState.causeLifecycle || null,
      rng: rng.fork('cause-resolution'),
      tick: worldState.tick,
    });
    causeLifecycleEvents = lifecycle.events;
    // Materialize the ledger only when non-empty; drop the key otherwise (dormancy oracle).
    if (lifecycle.causeLifecycleByCid && Object.keys(lifecycle.causeLifecycleByCid).length) {
      memoryState = { ...memoryState, causeLifecycle: lifecycle.causeLifecycleByCid };
    } else if (memoryState.causeLifecycle !== undefined) {
      const rest = { ...memoryState }; delete rest.causeLifecycle; memoryState = rest;
    }
    // REFORM (undo-clean): a reformed captain comes clean — clear the npcState corruption
    // (so next tick's mirror agrees) exactly as the ouster path does, minus the ouster/replace.
    if (lifecycle.reforms.length) {
      causeReformedIds = new Set(lifecycle.reforms.map((r) => r.conditionId));
      const npcStates = { ...(memoryState.npcStates || {}) };
      let mutated = false;
      for (const r of lifecycle.reforms) {
        const st = npcStates[r.conditionId];
        if (!st || st.corruption !== true) continue;
        npcStates[r.conditionId] = {
          ...st, corruption: false, corruptionProfile: { corrupted: false, vector: null }, corruptionHeat: 0,
        };
        mutated = true;
      }
      if (mutated) memoryState = { ...memoryState, npcStates };
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
    let projected = projectFactionStatesOntoSettlement(
      update.settlement, memoryState.factionStates, update.saveId, { tick: worldState.tick },
    );
    // Project the live pantheon onto config.faithProfile, then apply the DIVINE-MANDATE
    // legitimacy term — a secure/legitimate patron props the throne; a contested or
    // discredited one erodes it (feeding the coup cluster). No-op without religionStates,
    // a non-royal/theocratic government, or a deity-free settlement (byte-identical).
    if (nextReligionStates) {
      projected = projectReligionStateOntoSettlement(projected, nextReligionStates, update.saveId, nextPietyByCid, nextMartialByCid);
      projected = applyDivineMandate(projected);
    }
    // W-C5: stamp the lazy compromise-lifecycle display read-model onto compromised NPCs
    // (the generic floor reads it) + clear the tag on bearers reformed this tick. Byte-inert
    // to every mechanic (a display annotation); a no-op when no ledger/reform touches this cid.
    if (memoryState.causeLifecycle || causeReformedIds.size) {
      projected = projectCauseLifecycleOntoSettlement(
        projected, memoryState.causeLifecycle || null, update.saveId, worldState.tick, causeReformedIds,
      );
    }
    return projected === update.settlement ? update : { ...update, settlement: projected };
  });
  const pulseRecord = {
    id: pulseIdFor(campaign?.id, worldState.tick),
    tick: worldState.tick,
    interval: tickInterval,
    committed: commit,
    createdAt: now,
    calendar: memoryState.calendar,
    candidateCount: candidates.length + tierResource.candidates.length + instLifecycle.candidates.length + moralInst.candidates.length + structuralCandidates.length + coupOutcomes.length + warOutcomes.length,
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
    corruptionEvents: [...(corruption.exposures || []), ...reformEvents].slice(0, 24).map((/** @type {any} */ e) => ({
      settlementId: e.settlementId, name: e.name, kind: e.kind,
      criminalInstitution: e.criminalInstitution, homeInstitution: e.homeInstitution,
    })),
    factionCaptureEvents: (factionCapture.transitions || []).slice(0, 24).map((/** @type {any} */ t) => ({
      settlementId: t.settlementId, name: t.name, from: t.from, to: t.to,
    })),
    // W-C5: the cause-resolution-lifecycle receipts (attribution + every transition),
    // carrying the conjunction key W2 consumes. Absent when nothing moved (dormancy-neutral).
    ...(causeLifecycleEvents.length ? {
      causeLifecycleEvents: causeLifecycleEvents.slice(0, 24).map((e) => ({
        settlementId: e.cid, npcId: e.npcId, name: e.name, stage: e.stage,
        causeClass: e.causeClass, family: e.family, priorCause: e.priorCause,
        ageBand: e.ageBand, conjunctionKey: e.conjunctionKey,
      })),
    } : {}),
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
  const isFreshArcEntry = (/** @type {any} */ entry) => {
    if (!['realm', 'compound'].includes(entry.kind)) return true;
    // The feed is newest-first, so the cooldown window must be a tick filter —
    // a tail slice would inspect the OLDEST entries once the feed exceeds it.
    const recent = (applied.wizardNews?.entries || [])
      .filter((/** @type {any} */ e) => worldState.tick - (e.tick ?? -Infinity) < ARC_REEMIT_COOLDOWN_TICKS);
    return !recent.some((/** @type {any} */ e) =>
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
    // W-F7 amplified-site #10: the realm-piety multiplier (measured at tick start,
    // exactly 1.0 when spread is off ⇒ byte-identical) scales the arc's salience.
    realmMult,
  });
  const aftermathEntries = [
    ...aftermathNewsEntries(agedStressors.resolved, worldState.tick, now),
    ...graduationNewsEntries(agedStressors.graduated || [], worldState.tick, now),
  ];
  // Capture transitions reach the DM: the factionCaptureEvents
  // pulseRecord rollup above was consumed by nobody, so a faction falling to
  // (or breaking from) the underworld never surfaced in the Chronicle.
  const settlementNameFor = (/** @type {any} */ id) => {
    const entry = settlementMap.get(String(id));
    return entry?.save?.name || entry?.settlement?.name || String(id);
  };
  const captureNewsEntries = captureTransitionNewsEntries(
    factionCapture.transitions, settlementNameFor, worldState.tick, now,
  );
  // W-C5: the notable cause-lifecycle transitions reach the Chronicle (a captain re-caused,
  // reformed, historicized, exposed, or re-adjudicated). Attribution is the resting state and
  // emits no headline. Empty when nothing transitioned ⇒ byte-neutral.
  const causeLifecycleNews = causeLifecycleNewsEntries(
    causeLifecycleEvents, settlementNameFor, worldState.tick, now,
  );
  // WAVE A: the fog of war made a legible cause. When the chooser committed an
  // offensive this tick on a BELIEF that diverged from the truth beyond the band,
  // its candidate carries `metadata.misjudgment`; the house-voice receipt names
  // what was believed, what was true, and how stale the read was. Empty (byte-
  // neutral) when beliefs are dormant or every acting belief was sound.
  const beliefMisjudgmentNews = beliefMisjudgmentNewsEntries(
    selectedForApply, settlementNameFor, worldState.tick, now,
  );
  // SEASONS-A: the season boundary markers — the ONE new news kind
  // ('season_marker': harvest at the autumn boundary, hungry_gap at month 12).
  // Deterministic (no rng), realm-scope, minted only when the flag-on window
  // (prev advanced week → this advanced week) crosses a boundary. Empty
  // flag-off ⇒ byte-neutral.
  const seasonMarkerEntries = seasonsOn
    ? seasonalBoundaryEntries({
        prevWeeks: startingWorldState.calendar?.elapsedWeeks ?? 0,
        weeks: worldState.calendar.elapsedWeeks,
        tick: worldState.tick,
        now,
        foodStates: seasonalFoodStates,
      })
    : [];
  // SEASONS-B (M3): the SPRING-THAW news burst — fires on the winter→spring
  // crossing ONLY when the seasonal-road overlay is active (a world whose roads
  // actually freeze). Realm-scope, scored above the rumor notable floor so it
  // SEEDS the rumor ledger (the visible burst as the passes reopen). Gated on the
  // OVERLAY, not seasonsEnabled — winter roads are independent of the food year.
  // Empty (byte-neutral) when the overlay is dormant or no crossing this window.
  const thawDigest = activeSpatialDigest(memoryState);
  const thawEntries = activeSeasonalOverlay(thawDigest)
    ? seasonalThawEntries({
        prevWeeks: startingWorldState.calendar?.elapsedWeeks ?? 0,
        weeks: worldState.calendar.elapsedWeeks,
        tick: worldState.tick,
        now,
        settlementIds: thawDigest?.settlementIds || [],
      })
    : [];
  const newsToAppend = [...aftermathEntries, ...captureNewsEntries, ...causeLifecycleNews, ...beliefMisjudgmentNews, ...realmEntries, ...pantheonArcEntries, ...seasonMarkerEntries, ...thawEntries];
  // Thread the pinned `now` (same as applyWorldPulse's regional-news append) so the
  // feed's `updatedAt` stamps the deterministic tick time, not the wall clock. Without
  // it, any tick that surfaces kernel-side news (realm arcs, aftermath, captures,
  // pantheon) leaked wall-clock time into the composed output — a latent determinism/
  // equivalence break that only bit once an advance reached such a tick.
  const wizardNews = newsToAppend.length ? appendWizardNewsEntries(applied.wizardNews, newsToAppend, { now }) : applied.wizardNews;
  // STEP 3.5 — RUMORS & NEWS (trade carrier). AFTER the tick's feed is fully
  // composed (the seeds read the same entries the DM reads), the rumor network
  // advances one step: expire by tick-age, seed this window's significant
  // events at their witness settlements, relay due tellings one trade hop
  // (hopWeeks latency; organic degradation forks `rumor-organic:…` off THIS
  // kernel's rng confluence in 'unreliable' mode only — Perfect-but-Delayed
  // forks nothing). DORMANT (no spatial digest / infoMode omniscient) ⇒
  // changed:false ⇒ memoryState untouched, zero forks, zero new keys —
  // byte-identical. Proposal/party applies outside this kernel seed at the
  // next pulse via the module's feed lookback (idempotent per event+witness).
  {
    const rumors = advanceRumorLedgers({
      worldState: memoryState,
      feedEntries: wizardNews?.entries || [],
      graph: applied.regionalGraph,
      tick: worldState.tick,
      season: roadSeason,
      rng,
    });
    if (rumors.changed) {
      if (rumors.next) {
        memoryState = { ...memoryState, rumorLedgers: rumors.next };
      } else if ('rumorLedgers' in memoryState) {
        // Everything expired: the conditional key drops back to absent.
        const { rumorLedgers: _drained, ...rest } = memoryState;
        memoryState = rest;
      }
    }
  }
  // WAVE A — THE BELIEF MAP (read-last/write-next). AFTER the rumor network
  // advances (beliefs consume this tick's arrivals), each settlement's belief
  // model updates: cold-start seeds the declared neighbourhood to ground truth on
  // the first active tick, then per (observer, subject) it reconciles fresh
  // reports (re-anchor toward truth, degraded by fidelity, independence-weighted)
  // or decays confidence for silence — pure arithmetic, NO rng. NEXT tick's
  // chooser reads these beliefs. DORMANT (no spatial marker / infoMode omniscient)
  // ⇒ changed:false ⇒ memoryState untouched, zero new keys — byte-identical.
  {
    const beliefs = advanceBeliefMaps({
      snapshot: postTimeSnapshot,
      pressureIdx: pIndex,
      worldState: memoryState,
      tick: worldState.tick,
    });
    if (beliefs.changed) {
      if (beliefs.next) {
        memoryState = { ...memoryState, beliefMaps: beliefs.next };
      } else if ('beliefMaps' in memoryState) {
        // Everything decayed below the floor: the conditional key drops to absent.
        const { beliefMaps: _forgotten, ...rest } = memoryState;
        memoryState = rest;
      }
    }
  }
  // Phase 5.5 mover M1 — EMBATTLEMENT (read-last/write-next). AFTER war/occupation
  // resolution: each region's CONTINUOUS danger scalar advances under hysteresis
  // from its ramp inputs (occupation, active siege, war_exhaustion, high crime)
  // minus a bounded security counterforce. Routing/trade read the SCALAR (a graded
  // cost), never the internal hysteresis phase. The ramp-input READS live here (the
  // worldPulse ledgers are in hand); embattlement.js owns the pure combination +
  // the scalar/hysteresis step. DORMANT (no spatial marker) ⇒ changed:false ⇒
  // memoryState untouched, zero new keys — byte-identical.
  if (embattlementActive(memoryState)) {
    const occ = /** @type {Record<string, { state?: string }>} */ (memoryState.occupations || {});
    const exh = /** @type {Record<string, number>} */ (memoryState.warExhaustion || {});
    const graph = postTimeSnapshot.regionalGraph;
    const priorEmb = /** @type {Record<string, unknown>} */ (memoryState.embattlement || {});
    const ids = new Set([
      ...(postTimeSnapshot.settlements || []).map((/** @type {{ id?: unknown }} */ s) => String(s.id)),
      ...Object.keys(occ), ...Object.keys(exh), ...Object.keys(priorEmb),
    ]);
    /** @type {Record<string, number>} */
    const threats = {};
    for (const id of ids) {
      threats[id] = rampThreat({
        occupationState: occ[id]?.state ?? null,
        besieged: warFrontsInto(graph, id).length > 0,
        warExhaustion01: Number(exh[id]) || 0,
        crime01: pIndex.get(id, 'crime')?.score || 0,
        // Security counterforce: high defensive readiness (low defense pressure)
        // graduates a disorder-driven region out; it can't nullify a live siege
        // (SECURITY_MAX_RELIEF caps the relief in embattlement.js).
        security01: 1 - (pIndex.get(id, 'defense')?.score || 0),
      });
    }
    const emb = advanceEmbattlement({ threats, worldState: memoryState, tick: worldState.tick });
    if (emb.changed) {
      if (emb.next) {
        memoryState = { ...memoryState, embattlement: emb.next };
      } else if ('embattlement' in memoryState) {
        // Every region graduated back to calm: the conditional key drops to absent.
        const { embattlement: _cleared, ...rest } = memoryState;
        memoryState = rest;
      }
    }
  }
  const finalWorldState = appendPulseHistory(memoryState, pulseRecord);
  // G — test-gated self-check: on a PAUSED tick, every deferred major's out-of-band
  // residue must have been stripped. Read-only + NODE_ENV==='test' only (byte-neutral to
  // the simulation), so a forgotten/drifted strip in a known residue store reds a test
  // across the WHOLE suite rather than surfacing as a silent determinism drift. Inert
  // (deferredMajors is empty) on the autoresolve path.
  assertNoResidueLeak(finalWorldState, applied.regionalGraph, deferredMajors);

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
    candidates: [...coupOutcomes, ...warOutcomes, ...structuralCandidates, ...candidates, ...tierResource.candidates, ...instLifecycle.candidates, ...moralInst.candidates],
    selected: selectedForApply,
    rollExplanations: [...deterministicExplanations, ...rollExplanations],
    autoApplied: applied.autoApplied,
    proposals: applied.proposals,
    resolvedStressors: agedStressors.resolved,
    // Stage 2 SURFACE: the campaign-altering subset of this tick's selected
    // outcomes, classified on structural markers (deriveDecisionTier), NOT
    // applied-on-pause. Stage 2 still auto-resolves everything — majors[] is a
    // read-only annotation so Stages 3+ can pause on it. Behavior is unchanged.
    majors: selectedForApply.filter(outcome => deriveDecisionTier(outcome) === 'major'),
    // Advance-scaling Stage 3 PAUSE: the structural majors WITHHELD from this
    // tick's apply pass (only populated when deferMajors is on). The orchestrator
    // batches these onto `pendingMajors` and RE-DERIVES them on resume by re-running
    // this tick from its pre-tick inputs (seed replay) — so resolving them to
    // recommended is byte-identical to the single-pass autoresolve-ON apply. Empty
    // on the legacy path.
    deferredMajors,
    pulseRecord,
  };
}
