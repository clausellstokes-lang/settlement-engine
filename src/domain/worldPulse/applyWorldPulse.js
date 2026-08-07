
import { clamp01 } from '../../kernel/math.js';
import { withActiveCondition } from '../activeConditions.js';
import { advanceRegionalImpacts, appendWizardNewsEntries, deriveWizardNewsEntriesFromGraphChange, ensureRegionalGraph, ensureWizardNewsFeed, legacyRegionalConditionId, propagateRegionalEvent, setRegionalImpactStatus, syncRelationshipChannelBundle } from '../region/index.js';
import { deityIdOf } from './pantheon.js';
import { queueRegionalImpacts, addRegionalChannels, mintDirectedChannel } from '../region/graph.js';
import { activeSpatialDigest, getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { parkArrivals, drainDueArrivals } from '../spatial/spatialArrival.js';
import { storageCapacityMonths } from './foodStockpile.js';
import { applyRelationshipPatch, relationshipKeyFromEdge } from './relationshipEvolution.js';
import { applyWarIntentOutcome, stampDeploymentRecall } from './warIntent.js';
import { ensureRelationshipEdgeSeed } from './relationshipEdgeSeed.js';
import { refreshRelationshipMemory } from './relationshipMemory.js';
import { resolveRelationshipHierarchy } from './relationshipHierarchy.js';
import { applyNpcPatch } from './npcAgency.js';
import { windDownSponsoredStressors } from './stressorDynamics.js';
import { applyFactionPatch } from './factionCompetition.js';
import { proposalIdFor, updateProposalStatus, upsertProposal } from './worldState.js';
import { applyPopulationOutcomeToSettlement } from './populationDynamics.js';
import { applyResourceOutcomeToSettlement, applyTierOutcomeToSettlement } from './tierResourceDynamics.js';
import { applyResourceMembershipOutcomeToSettlement } from './resourceDynamicsKernel.js';
import { applySettlementLifecycleOutcomeToSettlement } from './settlementLifecycleFirstClass.js';
import { applyInstitutionLifecycleOutcome } from './institutionLifecycle.js';
import { normalizeSimulationRules, propagationDepthForRules } from './simulationRules.js';
import { resolveProposalToOutcome } from './decisionTier.js';
import { applyRealmVerbOrder, buildRealmVerbOutcome, REALM_VERB_PAYLOAD_KIND } from './realmVerbExecution.js';
import { pendingActorMajorFor } from './actorMajorApproval.js';
import { recordProposalProvenance } from './provenanceKernel.js';
import {
  isStateOnlyOutcome,
  isSuppressionOnlyOutcome,
  proposalRequiresRecordModeSupersession,
  RECORD_MODE_PROPOSAL_VERSION,
} from './pulseHelpers.js';
import { wallClockNow } from '../clock.js';
import {
  isDriftOnlyOutcome,
  isMetronomeRepeat,
  newsEntryForOutcome,
  reconcileSupersededProposalNews,
  stateOnlyRumorSeedsFromHistory,
} from './worldPulseFeedCuration.js';
import {
  authorityTransferEpochFor,
  governingFactionOf,
  nameOf,
  transferRulingPower,
} from '../rulingPower.js';
import { isBilateralPeaceOffer, readWarPeaceDecision } from './warPeaceDecision.js';
import { applyWarPeaceRefusal } from './warPeaceRefusal.js';
import { applyWarDecisionPolitics, warDemandForInstaller } from './warPoliticalLoop.js';
import { appendNpcLadderSeatTransition, seatTransitionGoverningFactionId } from './npcLadderKernel.js';
import { buildWorldSnapshot } from './worldSnapshot.js';
import { rulingSeatNidOf } from './gratitudeBonds.js';
import { warRulingNewsEntries } from './warRulingsNews.js';
import {
  governmentTransitionRulingEvidence,
  peaceDecisionRulingEvidence,
} from './warRulingsEvidence.js';
import { warCoalitionEvidenceFromOutcome } from './warCoalitionEvidence.js';
import { warCoalitionNewsEntries } from './warCoalitionNews.js';
import {
  allianceCallWasDecided,
  coalitionObligationRead,
  joinAnchorOf,
} from './warCoalitionLedger.js';
import { warFrontsInto } from './warFrontReads.js';
import { treatyBlocksWar } from './treatyEnforcement.js';
import { coalitionJoinFeasibility } from './warDeployment.js';
import { envoyDiplomacyActive } from './envoyErrand.js';
import {
  dispatchAcceptedPeaceEnvoy,
  envoyReturnAcceptance,
} from './envoyDiplomacy.js';
import { envoyNewsEntries } from './envoyNews.js';
import { clone, affectedSaveIdsForOutcome, settlementChanged, saveLike } from './applyWorldPulsePrimitives.js';
import { relationshipOutcomeDisposition, openCoalitionEnemyRelationship, applyRelationshipLabelToGraph, relationshipEdgeForOutcome, roleOrientedEdge, writeRelationshipLabelToNeighbourNetworks, cascadeNewsEntry } from './applyWorldPulseRelationshipGraph.js';
import { FACTION_PAYLOAD_KINDS, applyFactionPayloadEffect } from './applyWorldPulseFactionRoster.js';
import { installOccupationAuthority } from './applyWorldPulseOccupationAuthority.js';
import { mergeStressorUpsert } from './applyWorldPulseStressorMerge.js';
import { seedBetrayalTraitor } from './applyWorldPulseBetrayal.js';
// THE TYPE SURFACE IS PART OF THE PUBLIC SURFACE (R-BLD-9 / the file-2 lesson):
// these aliases are re-declared in every member of the family that names them, so a
// split never silently drops a typedef and lands strict errors on a consumer.
/** @typedef {import('./pulseShapes.js').WorldState} PulseWorldState */
/** @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {import('../settlement.schema.js').SimFaction} SimFaction */
/** @typedef {import('../settlement.schema.js').SimInstitution} SimInstitution */

// Conserved granary transfer (war sack food seizure). `foodStockpileDeltas` carries a
// per-settlement storageMonths change (target loses, victor gains) the same way
// populationDeltas carries a per-settlement population change, so it applies through the
// standard per-outcome pass and is atomic with the conquest's defer/dismiss. Clamped to
// [0, granary capacity]; a settlement with no food ledger is a safe no-op.
function applyFoodStockpileOutcomeToSettlement(/** @type {any} */ settlement, /** @type {any} */ outcome, /** @type {any} */ saveId) {
  const fs = settlement?.economicState?.foodSecurity;
  if (!fs || !Number.isFinite(Number(fs.storageMonths))) return settlement;
  const deltaMonths = (outcome.foodStockpileDeltas || [])
    .filter((/** @type {any} */ d) => String(d?.saveId) === String(saveId))
    .reduce((/** @type {number} */ sum, /** @type {any} */ d) => sum + (Number(d?.deltaMonths) || 0), 0);
  if (!deltaMonths) return settlement;
  const cap = storageCapacityMonths(settlement);
  const nextMonths = Math.round(Math.max(0, Math.min(cap, Number(fs.storageMonths) + deltaMonths)) * 10) / 10;
  if (nextMonths === Number(fs.storageMonths)) return settlement;
  return {
    ...settlement,
    economicState: {
      ...settlement.economicState,
      foodSecurity: { ...fs, storageMonths: nextMonths },
    },
  };
}

function applyOutcomeToSettlement(/** @type {any} */ settlement, /** @type {any} */ outcome, /** @type {any} */ saveId) {
  if (!settlement || !outcome) return settlement;
  let next = settlement;
  if (outcome.populationDeltas?.length) {
    next = applyPopulationOutcomeToSettlement(next, outcome, saveId);
  }
  if (outcome.foodStockpileDeltas?.length) {
    next = applyFoodStockpileOutcomeToSettlement(next, outcome, saveId);
  }
  if (outcome.tierChange && String(outcome.targetSaveId) === String(saveId)) {
    next = applyTierOutcomeToSettlement(next, outcome);
  }
  if (outcome.resourcePatch && String(outcome.targetSaveId) === String(saveId)) {
    next = applyResourceOutcomeToSettlement(next, outcome);
  }
  // W-DISCOVERY: an organic discovery/removal writes roster MEMBERSHIP (append/remove
  // config.nearbyResources) + the regen-surviving resourceEdits delta + the surgical
  // production reconcile + the typed resource_strike/vein_exhausted condition.
  if (outcome.resourceMembership && String(outcome.targetSaveId) === String(saveId)) {
    next = applyResourceMembershipOutcomeToSettlement(next, outcome);
  }
  // W-LIFECYCLE: terminal death (remnant grade from the LIVE peakTier — the
  // scarcity law at the writer; institutions clear; NPCs gain dispersal stamps
  // only — fates unresolved) / resettlement (first-class rebirth on the old cell;
  // peakTier restarts). Runs AFTER populationDeltas so the writer's zero is the
  // exactness backstop over the receipted debit.
  if (outcome.lifecyclePatch && String(outcome.targetSaveId) === String(saveId)) {
    next = applySettlementLifecycleOutcomeToSettlement(next, outcome);
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
    // A CONQUEST (the war layer) installs a foreign occupation authority —
    // a power that does NOT exist among the target's own factions. transferRulingPower
    // can only promote an EXISTING faction, so seed the occupation authority as a
    // new non-governing power first; the transfer then crowns it. Gated on
    // cause === 'conquest' so every pre-existing (coup) transfer is byte-identical.
    if (outcome.powerTransfer.cause === 'conquest') {
      next = installOccupationAuthority(next, outcome.powerTransfer.toPowerName);
      // Occupation parity: a GENERATION-occupied town carries the
      // vassal_extraction condition (conditionPromotion maps the 'occupied' stress
      // into it), so a PULSE-conquered town must too — that condition is what the
      // substrate (deriveCausalState), the pressure model, AND population flight all
      // read as "occupation." Stamp it alongside the conquest's war_pressure so the
      // two faces of an occupation (military strain + economic extraction) both land.
      // Idempotent by id (withActiveCondition replaces same-id), so a re-fired
      // conquest never double-stamps. Conquest-only ⇒ a coup is byte-identical.
      next = withActiveCondition(next, {
        archetype: 'vassal_extraction',
        severity: clamp01(0.55 + (outcome.severity || 0) * 0.15),
        triggeredAt: {
          tick: outcome.powerTransfer.tick ?? null,
          sourceEventType: 'WAR_LAYER_CONQUEST',
          sourceEventTargetId: String(saveId),
        },
        causes: [{
          source: outcome.powerTransfer.toPowerName,
          effect: 'occupation_extraction',
          reason: `${outcome.powerTransfer.toPowerName} extracts wealth, troops, and authority from the conquered settlement.`,
        }],
      });
    }
    const result = transferRulingPower(next, outcome.powerTransfer.toPowerName, {
      cause: outcome.powerTransfer.cause || 'coup',
      tick: outcome.powerTransfer.tick ?? null,
      losers: outcome.powerTransfer.losers || [],
    });
    if (!result.error) next = result.settlement;
  }
  // A religious conversion RE-EMBEDS the winning neighbour's EXISTING deity
  // snapshot onto the convert's config.primaryDeitySnapshot so the
  // conversion STICKS (the pulse/derivers read only the snapshot, never the
  // store/customContent). We re-pick the exact snapshot fields (never spread the
  // raw record) — the SAME field set SET_PRIMARY_DEITY embeds — so a re-embed is
  // structurally identical to an assign and carries no wall-clock stamp.
  if (outcome.deityReembed?.snapshot && String(outcome.targetSaveId) === String(saveId)) {
    next = reEmbedPrimaryDeity(next, outcome.deityReembed.snapshot);
  }
  if (outcome.condition && String(outcome.targetSaveId) === String(saveId)) {
    next = withActiveCondition(next, outcome.condition);
  }
  return next;
}

/**
 * Re-embed a deity snapshot onto a settlement's config (the conversion commit).
 * Re-picks the exact embed field set (mirrors mutate.setPrimaryDeity) so a
 * conversion is structurally identical to a DM assign — never leaking a foreign
 * field or wall-clock stamp into the embedded record.
 *
 * FULL PARITY (T4 ONE-REGEN batch): the ONE deliberate asymmetry is gone. This
 * writer used to drop `lawAxis`, so an organically converted settlement read
 * chaos01 0.5 no matter which god took the altar, while the identical deity
 * assigned by a DM read its true law coordinate. The axis is now carried, and
 * conversion is structurally identical to a DM assign on EVERY axis. The lift
 * re-arms for every chaos01 reader (deityAxes.chaos01 → deriveTemper, stance,
 * piety, legitimacy, contest, tolerance, disposition, and the law_order term),
 * so a seeded advance that commits a conversion whose winning snapshot carries
 * a NON-neutral lawAxis moves — the declared drift of that batch. An absent
 * lawAxis still embeds 'neutral', so legacy converts read exactly as before.
 *
 * IDENTITY: the committed ref is `deityIdOf(snapshot)` — the SAME id the pantheon
 * ledger keys the same snapshot by (pantheon.collectFaithDeltas), so config and
 * ledger can never split identity. Two rots were removed here (R-5b item 13c):
 * the old chain fell back to `config.primaryDeityRef` (the OUSTED patron's ref,
 * stamped onto the WINNER's snapshot) and then to a `converted:<slug>` namespace
 * that neither the account mint (`deity:<scope>:<slug>`) nor the pool namespace
 * (`deity:core:`) recognized. Both fallbacks were unreachable for every
 * disciplined writer (all stamp `_deityRef`); the only behavior delta is on a
 * pre-discipline legacy local save, whose ref-less snapshot now keys by
 * `deity:<name>` or, name-less, refuses the commit rather than inventing an
 * identity.
 */
function reEmbedPrimaryDeity(/** @type {any} */ settlement, /** @type {any} */ snapshot) {
  const ref = settlement && snapshot ? deityIdOf(snapshot) : null;
  if (!ref) return settlement;
  // NET-ZERO SHAPE (size-ratchet discipline): the embed is named and the config
  // is built in the return, so restoring lawAxis below costs the file no
  // effective line. Behavior is identical — same keys, same freeze, same order.
  const embed = Object.freeze({
    _deityRef: ref,
    name: String(snapshot.name || ''),
    alignmentAxis: snapshot.alignmentAxis || 'neutral',
    temperamentAxis: snapshot.temperamentAxis || 'neutral',
    rankAxis: snapshot.rankAxis || 'minor',
    // lawAxis: the SAME default discipline both DM writers use (mutateEntities
    // setPrimaryDeity/imposeCult) — a legacy 3-axis deity carries none ⇒
    // 'neutral', which reads chaos01 0.5, the no-signal midpoint. Restored at
    // T4: this was the one deliberate writer asymmetry.
    lawAxis: snapshot.lawAxis || 'neutral',
    ...(snapshot.domain ? { domain: String(snapshot.domain) } : {}),
  });
  return { ...settlement, config: { ...(settlement.config || {}), primaryDeityRef: ref, primaryDeitySnapshot: embed } };
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
 * @param {string|null} [args.season]  SEASONS-B (M3): the current road season, so
 *   parked cross-settlement propagation arrivals lengthen in winter (info runs
 *   cold). Null / no overlay ⇒ geometric latency, byte-identical.
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
  season = null,
  advanceNewsTick = true,
  advanceRegionalImpacts: shouldAdvanceRegionalImpacts = true,
  simulationRules = null,
} = {}) {
  let graph = ensureRegionalGraph(regionalGraph || snapshot.regionalGraph, { now });
  let state = worldState;
  const rules = normalizeSimulationRules(simulationRules || worldState?.simulationRules || snapshot?.worldState?.simulationRules);
  const propagationDepth = propagationDepthForRules(rules);
  // worldState.tick is the authoritative clock: SYNC currentTick to it (not
  // +1) so a manual impact-advance press cannot permanently skew which tick
  // this pulse's entries (all stamped with `tick`) group and ground under.
  let feed = ensureWizardNewsFeed(wizardNews || snapshot.campaign?.wizardNews, { now });
  if (advanceNewsTick) {
    feed = {
      ...feed,
      currentTick: Number.isFinite(tick) ? Math.max(0, Math.floor(/** @type {number} */ (tick))) : feed.currentTick + 1,
    };
  }
  const settlementUpdates = new Map(settlementMap ? [...settlementMap.entries()] : []);
  const autoApplied = [];
  const proposals = [];
  const newsEntries = [];
  const envoyEvidence = [];
  const lapsedOutcomeIds = [];
  // Direct state-only headlines stay off every public/raw-news surface, but the
  // rumor/belief plane historically consumed those entries as simulation input.
  // Preserve that exact seed on an internal return lane.
  const rumorSeedEntries = [];
  const priorHiddenRumorSeeds = stateOnlyRumorSeedsFromHistory(
    state?.pulseHistory,
    feed.entries,
  );
  // SPATIAL (5.5-M item 4): the propagation ARRIVAL front. The digest is present
  // ONLY under the entitled spatial-canon marker ⇒ null keeps every step below on
  // the aspatial instant-propagation path (byte-identical). When present, this
  // tick's cross-settlement impacts are PARKED (delayed by travel distance) and
  // previously-parked, now-due arrivals are RELEASED at tick start.
  const spatialDigest = activeSpatialDigest(state);
  let spatialArrivals = /** @type {import('../spatial/spatialArrival.js').ArrivalLedger | undefined} */ (
    spatialDigest ? getSpatialLedger(state, 'spatialArrivals') : undefined);
  // Stressor ids already written by an EARLIER outcome in this same apply
  // pass. A second outcome touching the same id (escalate after spread,
  // multi-target spread of one record) must field-MERGE with the first write,
  // not clobber it — otherwise spread targets vanish and escalate/spread revert
  // each other order-dependently. The merge is commutative, so the persisted
  // record reflects every reported event regardless of iteration order.
  const stressorWrittenThisPass = new Set();

  // Time advances BEFORE this tick's propagation queues: the previous pulse's
  // delayed impacts mature now, while impacts the loop below queues stay
  // un-aged until the NEXT pulse — delayTicks:1 means "next tick", never
  // "later this same tick" (the party/proposal paths already pass
  // advanceRegionalImpacts:false for the same reason).
  if (shouldAdvanceRegionalImpacts && propagationDepth > 0) {
    const beforeRegionalAdvance = graph;
    graph = advanceRegionalImpacts(graph, 1, { currentTick: tick, now });
    // SPATIAL: release the cross-settlement impacts that have ARRIVED this tick
    // (parked on earlier ticks) into the regional queue — the existing machinery
    // then materializes them + dates their Wizard News at this ARRIVAL tick.
    if (spatialDigest) {
      const drain = drainDueArrivals(spatialArrivals, tick ?? 0);
      spatialArrivals = drain.next;
      if (drain.due.length) graph = queueRegionalImpacts(graph, drain.due, { now });
    }
    newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeRegionalAdvance, graph, { tick, createdAt: now }));
  }

  // The visible roster is invariant for the whole tick — `snapshot.settlements`
  // is never reassigned in this pass — so it is derived ONCE here rather than
  // re-mapped inside the per-outcome / per-affected-save propagation loop below.
  const visibleSettlementIds = (snapshot.settlements || []).map((/** @type {any} */ item) => item.id);

  for (let outcome of outcomes) {
    // suppression_only is allowed to win candidate conflict arbitration, but it
    // is never an event and must be inert even if a caller accidentally forwards
    // it past the roll seam.
    if (isSuppressionOnlyOutcome(outcome)) continue;
    const stateOnly = isStateOnlyOutcome(outcome);
    // state_only denotes a background mechanical refresh, not a DM decision.
    // Authority routing may have turned an originally-auto stochastic candidate
    // into a proposal; restore the mechanical lane here so the outcome still
    // reaches the existing reducers and the authoritative autoApplied audit.
    if (stateOnly && outcome.applyMode !== 'auto') outcome = { ...outcome, applyMode: 'auto' };
    if (outcome.applyMode === 'proposal') {
      const proposal = {
        id: proposalIdFor(outcome, tick),
        status: 'pending',
        recordModeVersion: RECORD_MODE_PROPOSAL_VERSION,
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

    // M9d — THE WAR INITIATE/RESOLVE SPLIT (apply side). A strategy_deploy that carries
    // a `siege_initiation` payload is a DM-Driven war-initiation whose deployment seed +
    // war_front were WITHHELD by evaluateWarLayer (the mint is HELD under dm_only /
    // recommendations). Reaching apply as 'auto' means the DM APPROVED it (the proposal
    // resolver forces applyMode:'auto'), so re-mint the held siege NOW: install the seeded
    // deployment record on worldState.deployments and mint the war_front on the graph.
    // The next war tick reads a live siege and resolves it through the UNCHANGED
    // resolveSiegeVerdict path. LEGACY war initiations carry no such payload (they minted
    // inline in evaluateWarLayer), so this branch never fires ⇒ byte-identical. Guarded on
    // an absent existing record so a re-applied proposal can't double-seed an army.
    if (outcome.proposalPayload?.kind === 'siege_initiation') {
      const pay = outcome.proposalPayload;
      const besieger = String(pay.besieger);
      let deployment = pay.deployment ? clone(pay.deployment) : null;
      const coalitionAnchor = pay.coalition ? joinAnchorOf(deployment, besieger) : null;
      if (pay.coalition) {
        const liveSnapshot = { ...snapshot, regionalGraph: graph, worldState: state };
        const armyFree = !(state.deployments && state.deployments[besieger]);
        const callAlreadyDecided = !!coalitionAnchor && allianceCallWasDecided(
          state.relationshipStates?.[coalitionAnchor.allianceRelationshipKey],
          coalitionAnchor.callId,
          coalitionAnchor.allianceRelationshipKey,
        );
        const partiesLive = !!coalitionAnchor
          && liveSnapshot.byId?.has?.(coalitionAnchor.partyId)
          && liveSnapshot.byId?.has?.(coalitionAnchor.callerId)
          && liveSnapshot.byId?.has?.(coalitionAnchor.enemyId);
        const interventions = getSpatialLedger(state, 'interventions');
        const activelyIntervening = Object.values(
          interventions && typeof interventions === 'object' ? interventions : {},
        ).some((row) => String(row?.interId || '') === besieger);
        const homeBesieged = warFrontsInto(graph, besieger).length > 0;
        const occupierId = String(state.occupations?.[besieger]?.occupierId || '');
        const occupiedAgainstAnother = !!occupierId
          && occupierId !== String(coalitionAnchor?.enemyId || '');
        const treatyBlocked = !!coalitionAnchor && treatyBlocksWar(
          state,
          coalitionAnchor.partyId,
          coalitionAnchor.enemyId,
          tick,
        );
        const returnedThisTick = (Array.isArray(state.pulseHistory) ? state.pulseHistory : [])
          .some((pulse) => Number(pulse?.tick) === Number(tick)
            && Array.isArray(pulse?.warReturnedSettlementIds)
            && pulse.warReturnedSettlementIds.map(String).includes(besieger));
        const obligation = coalitionAnchor
          ? coalitionObligationRead({
              worldState: state,
              snapshot: liveSnapshot,
              partyId: besieger,
              deployment,
            })
          : { active: false };
        const joinFeasible = coalitionAnchor
          ? coalitionJoinFeasibility(
              liveSnapshot,
              state,
              coalitionAnchor.partyId,
              coalitionAnchor.enemyId,
            ).allowed
          : false;
        if (!armyFree || callAlreadyDecided || !partiesLive || activelyIntervening || homeBesieged
          || returnedThisTick
          || occupiedAgainstAnother || treatyBlocked || !joinFeasible || !obligation.active) {
          lapsedOutcomeIds.push(String(outcome.id || ''));
          continue;
        }
        // Approval may happen several ticks after the proposal. The army joins
        // NOW, not retroactively at the question's creation tick. Retime every
        // joined fact together while preserving the exact root-episode call id.
        const appliedTick = Math.max(0, Math.floor(Number(tick) || 0));
        const joinedAnchor = { ...coalitionAnchor, joinedTick: appliedTick };
        deployment = {
          ...deployment,
          sinceTick: appliedTick,
          deploymentAge: 0,
          joinLedger: [joinedAnchor],
          ...(Array.isArray(deployment.casusReasons)
            ? {
                casusReasons: deployment.casusReasons.map((reason) => (
                  reason?.type === 'alliance_obligation'
                    ? { ...reason, atTick: appliedTick }
                    : reason
                )),
              }
            : {}),
        };
        outcome = {
          ...outcome,
          proposalPayload: {
            ...pay,
            deployment,
            coalition: joinedAnchor,
          },
          metadata: {
            ...(outcome.metadata || {}),
            ...(outcome.metadata?.allianceCall
              ? { allianceCall: { ...outcome.metadata.allianceCall, tick: appliedTick } }
              : {}),
            ...(Array.isArray(outcome.metadata?.coalitionEvidence)
              ? {
                  coalitionEvidence: outcome.metadata.coalitionEvidence.map((row) => ({
                    ...row,
                    tick: appliedTick,
                    ...(Object.hasOwn(row || {}, 'joinedTick') ? { joinedTick: appliedTick } : {}),
                  })),
                }
              : {}),
          },
        };
      }
      if (deployment && !(state.deployments && state.deployments[besieger])) {
        state = { ...state, deployments: { ...(state.deployments || {}), [besieger]: deployment } };
      }
      if (pay.warFront) {
        const frontChannel = /** @type {import('../region/graph.js').RegionChannel} */ (mintDirectedChannel({ ...pay.warFront, now }));
        graph = addRegionalChannels(graph, [frontChannel], { now });
      }
      // Falls through: the strategy_deploy itself is a settlement-state no-op (its home
      // conditions re-upsert on the NEXT war tick once the deployment is live).
    }

    // W-COMPOSER-2 — THE REALM VERB ARM. An APPROVED realm_verb_order resolves
    // through its wave's own kernel function (force ≡ organic), re-gated against
    // the CURRENT world: a lapsed order REFUSES VISIBLY (news pushed by the arm)
    // and never enters the applied ledger (the sanctioned pre-mutation continue,
    // like the proposal arm above). The lifecycle pair substitutes the ORGANIC
    // outcome (settlement_terminal_death / settlement_resettled) and falls
    // through the standard lane below — zero new apply paths for them.
    if (outcome.proposalPayload?.kind === REALM_VERB_PAYLOAD_KIND) {
      const armed = applyRealmVerbOrder({ state, snapshot, settlementUpdates, outcome, tick: tick ?? 0, now: now ?? null });
      state = armed.worldState;
      newsEntries.push(...armed.newsEntries);
      if (armed.refusal) continue;
      if (armed.settlementPatches) {
        for (const [sid, patched] of armed.settlementPatches) {
          const entry = settlementUpdates.get(String(sid));
          if (entry) settlementUpdates.set(String(sid), { ...entry, settlement: patched });
        }
      }
      if (armed.substituteOutcome) outcome = armed.substituteOutcome;
    }

    // WR-5 G2 — BILATERAL PEACE. Approval of the stored strategy proposal is
    // the suing court's yes. Before any settlement, relationship, graph, recall,
    // or treaty-facing mutation occurs, ask the named target court through the
    // same four-term evaluator. A stale offer with no live war fails closed. A
    // refusal substitutes a priced fact and deliberately skips the existing
    // label-change path, leaving hostility and both deployments intact.
    const warRulingsLit = state?.simulationRules?.warLayerEnabled === true
      && state?.simulationRules?.warTerminationEnabled === true;
    if (isBilateralPeaceOffer(outcome) && warRulingsLit) {
      const priorDisposition = relationshipOutcomeDisposition(state, outcome);
      if (priorDisposition === 'same') continue;
      if (priorDisposition === 'superseded') {
        lapsedOutcomeIds.push(String(outcome.id || ''));
        continue;
      }
      const decisionSnapshot = { ...snapshot, regionalGraph: graph, worldState: state };
      const transportMarker = outcome.metadata?.envoyTransportReturn;
      const transportedDecision = transportMarker
        ? envoyReturnAcceptance(state, outcome, graph)
        : null;
      // A return marker is engine-only authority. A malformed, stale, or
      // non-home marker may never bypass the live bilateral evaluator.
      if (transportMarker && !transportedDecision) {
        lapsedOutcomeIds.push(String(outcome.id || ''));
        continue;
      }
      const peaceDecision = transportedDecision || readWarPeaceDecision({
        worldState: state,
        snapshot: decisionSnapshot,
        outcome,
        tick,
      });
      if (!peaceDecision) {
        lapsedOutcomeIds.push(String(outcome.id || ''));
        continue;
      }
      if (!peaceDecision.accepted) {
        newsEntries.push(...warRulingNewsEntries({
          evidence: peaceDecisionRulingEvidence({ outcome, decision: peaceDecision, tick }),
          snapshot,
          now,
        }));
        const priced = applyWarPeaceRefusal({
          worldState: state,
          settlementUpdates: [...settlementUpdates.values()],
          regionalGraph: graph,
          outcome,
          decision: peaceDecision,
          tick,
          now,
        });
        state = priced.worldState;
        // The offerer chose peace; the target chose continued war. Each court's
        // own opposition gets an independent, typed organizing grievance.
        state = applyWarDecisionPolitics({
          worldState: state, snapshot,
          actorId: peaceDecision.offererId,
          targetId: peaceDecision.targetId,
          actualAction: 'peace',
          decisionId: `${String(outcome.id)}:offerer`,
          tick,
        }).worldState;
        state = applyWarDecisionPolitics({
          worldState: state, snapshot,
          actorId: peaceDecision.targetId,
          targetId: peaceDecision.offererId,
          actualAction: 'continue',
          decisionId: `${String(outcome.id)}:target`,
          tick,
        }).worldState;
        if (priced.settlementUpdates !== null) {
          for (const entry of priced.settlementUpdates) {
            if (entry?.saveId != null) settlementUpdates.set(String(entry.saveId), entry);
          }
        }
        newsEntries.push(...warRulingNewsEntries({
          evidence: priced.evidence,
          snapshot,
          now,
        }));
        autoApplied.push({
          ...outcome,
          candidateType: 'peace_refused',
          relationshipKey: null,
          relationshipPatch: null,
          proposalPayload: null,
          metadata: {
            ...(outcome.metadata || {}),
            peaceDecision: peaceDecision.receipt,
          },
        });
        continue;
      }
      // WR-7a replaces only the TRANSPORT. The exact WR-5 ruling above is
      // frozen onto one H1 person, while every settlement/relationship/graph,
      // politics, stressor, recall, and treaty-facing mutation remains below
      // this interception point. Auto and proposal approvals converge here.
      if (!transportedDecision && envoyDiplomacyActive(state)) {
        const dispatched = dispatchAcceptedPeaceEnvoy({
          worldState: state,
          snapshot: decisionSnapshot,
          outcome,
          decision: peaceDecision,
          tick,
          season,
        });
        const existingActive = dispatched.reason === 'duplicate_episode'
          && dispatched.errand
          && !['home', 'lost'].includes(String(dispatched.errand.state));
        if (dispatched.changed || existingActive) {
          state = dispatched.worldState;
          envoyEvidence.push(...dispatched.evidence);
          newsEntries.push(...envoyNewsEntries({
            evidence: dispatched.evidence,
            snapshot: { ...decisionSnapshot, worldState: state },
            now,
          }));
          autoApplied.push({
            ...outcome,
            recordMode: 'state_only',
            candidateType: 'envoy_dispatched',
            relationshipKey: null,
            relationshipPatch: null,
            proposalPayload: null,
            metadata: {
              ...(outcome.metadata || {}),
              envoyErrandId: dispatched.errand?.id || null,
            },
          });
          continue;
        }
        lapsedOutcomeIds.push(String(outcome.id || ''));
        continue;
      }
      newsEntries.push(...warRulingNewsEntries({
        evidence: peaceDecisionRulingEvidence({ outcome, decision: peaceDecision, tick }),
        snapshot,
        now,
      }));
      state = applyWarDecisionPolitics({
        worldState: state, snapshot,
        actorId: peaceDecision.offererId,
        targetId: peaceDecision.targetId,
        actualAction: 'peace',
        decisionId: `${String(outcome.id)}:offerer`,
        tick,
      }).worldState;
      state = applyWarDecisionPolitics({
        worldState: state, snapshot,
        actorId: peaceDecision.targetId,
        targetId: peaceDecision.offererId,
        actualAction: 'peace',
        decisionId: `${String(outcome.id)}:target`,
        tick,
      }).worldState;
      // Imported/proposal metadata is not transport authority. Only the exact
      // persisted home errand validated above may place a carried sheet on the
      // relationship incident consumed by the sole treaty writer.
      const {
        carriedTermSheet: _untrustedCarriedTermSheet,
        ...trustedOutcomeMetadata
      } = outcome.metadata || {};
      outcome = {
        ...outcome,
        relationshipPatch: {
          ...(outcome.relationshipPatch || {}),
          peaceDecisionOutcomeId: String(outcome.id || ''),
          peaceDecisionTick: Number.isFinite(Number(transportedDecision ? tick : outcome.generatedAtTick ?? tick))
            ? Math.max(0, Math.floor(Number(transportedDecision ? tick : outcome.generatedAtTick ?? tick)))
            : 0,
          peaceDecision: 'accepted',
        },
        metadata: {
          ...trustedOutcomeMetadata,
          peaceDecision: peaceDecision.receipt,
          ...(transportedDecision?.carriedTermSheet
            ? { carriedTermSheet: transportedDecision.carriedTermSheet }
            : {}),
          ...(peaceDecision.coalitionPeaceExpenditures?.length
            ? { coalitionPeaceExpenditures: peaceDecision.coalitionPeaceExpenditures }
            : {}),
        },
      };
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
          event: /** @type {any} */ ({
            id: outcome.id,
            type: 'WORLD_PULSE',
            targetId: saveId,
            payload: {
              severity: outcome.severity,
              candidateType: outcome.candidateType,
              outcomeType: outcome.type,
            },
          }),
          activeSettlementId: outcome.targetSaveId || saveId,
          visibleSettlementIds,
          maxDepth: propagationDepth,
          now,
          // SPATIAL: under the marker, DON'T queue impacts instantly — park the
          // cross-settlement ones so they arrive hopWeeks later (news at arrival).
          queueImpacts: !spatialDigest,
        });
        graph = propagation.graph;
        if (spatialDigest) {
          const parked = parkArrivals(spatialArrivals, propagation.impacts, { digest: spatialDigest, tick: tick ?? 0, season });
          spatialArrivals = parked.next;
          // LOCAL / unmapped / unreachable impacts have no travel time ⇒ queue now
          // (the aspatial instant path); only genuine cross-settlement hops delay.
          if (parked.passthrough.length) graph = queueRegionalImpacts(graph, parked.passthrough, { now });
        }
        newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeGraph, graph, { tick, createdAt: now }));
      }
    }

    if (outcome.relationshipKey && outcome.relationshipPatch) {
      // WR-0c: trade-war rivals can share a buyer without having a pair edge.
      // Materialize only that explicitly declared identity before the ordinary
      // relationship writers apply the hostile transition below.
      graph = ensureRelationshipEdgeSeed(graph, outcome, now);
      // Capture the pre-change label: the wind-down handshake below needs to
      // know the edge WAS hostile before this outcome rewrote it.
      const beforeEdge = relationshipEdgeForOutcome(graph, outcome);
      const beforeType = beforeEdge ? String(beforeEdge.relationshipType || beforeEdge.type || '') : null;
      const beforeRelationshipWrite = state;
      state = applyRelationshipPatch(state, outcome, now, beforeEdge);
      if (state !== beforeRelationshipWrite && outcome.metadata?.coalitionEnemyRelationship) {
        const coalitionWarEdge = openCoalitionEnemyRelationship({
          worldState: state,
          regionalGraph: graph,
          outcome,
          settlementUpdates,
          tick,
          now,
        });
        state = coalitionWarEdge.worldState;
        graph = coalitionWarEdge.regionalGraph;
      }
      graph = applyRelationshipLabelToGraph(graph, outcome, now);
      if (outcome.proposalPayload?.kind === 'relationship_label_change') {
        const edge = relationshipEdgeForOutcome(graph, outcome);
        if (edge) {
          // Both consumers below treat edge.from as the senior side — resolve
          // the JUST-PATCHED state's seniority stamps first.
          const orientedEdge = roleOrientedEdge(edge, state.relationshipStates?.[outcome.relationshipKey]);
          graph = syncRelationshipChannelBundle(graph, orientedEdge, outcome.proposalPayload.toType, {
            now,
            status: 'confirmed',
            outcomeId: outcome.id,
            relationshipKey: outcome.proposalPayload.relationshipKey,
            reason: outcome.proposalPayload.reason,
          });
          writeRelationshipLabelToNeighbourNetworks({
            settlementUpdates,
            edge: orientedEdge,
            toType: outcome.proposalPayload.toType,
            tick,
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
              const orientedChangeEdge = roleOrientedEdge(change.edge, state.relationshipStates?.[change.relationshipKey]);
              graph = syncRelationshipChannelBundle(graph, orientedChangeEdge, change.toType, {
                now,
                status: 'confirmed',
                outcomeId: outcome.id,
                relationshipKey: change.relationshipKey,
                reason: change.reason,
              });
              writeRelationshipLabelToNeighbourNetworks({
                settlementUpdates,
                edge: orientedChangeEdge,
                toType: change.toType,
                tick,
              });
            }
            // Every flipped third-party edge emits Wizard News (one entry per
            // cascade change, naming both settlements + the flip).
            const settlementNameById = new Map((snapshot.settlements || [])
              .map((/** @type {any} */ item) => [String(item.id), item.name || item.settlement?.name || String(item.id)]));
            const nameFor = (/** @type {any} */ id) => settlementNameById.get(String(id)) || String(id ?? 'unknown');
            // The cascadeChanges shape and the legacy hierarchy.changes shape
            // share fromType/toType/reason but key the edge differently — the
            // union defeats the checker, so normalize through `any` here.
            const cascades = /** @type {any[]} */ (
              Array.isArray(hierarchy.cascadeChanges) && hierarchy.cascadeChanges.length
                ? hierarchy.cascadeChanges
                : hierarchy.changes
            );
            for (const cascade of cascades) {
              const edgeKey = cascade.edgeKey || cascade.relationshipKey;
              const cascadeEdge = cascade.edge
                || (graph.edges || []).find(item => relationshipKeyFromEdge(item) === edgeKey)
                || null;
              newsEntries.push(cascadeNewsEntry({ cascade, edge: cascadeEdge, nameFor, outcome, tick }));
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
          // war-3 — SUE-FOR-PEACE GRIPS THE PHYSICAL WAR. The hostility that sponsored
          // the siege just de-escalated; wind down the DEPLOYMENTS too, not only the
          // stressor twins. Either party besieging the other has its army marched home
          // next tick (deploymentReturn), so ONE peace ends BOTH war representations
          // instead of the war-layer siege grinding on to a conquest the label forbade.
          const peaceEdge = beforeEdge || edge;
          if (peaceEdge && peaceEdge.from != null && peaceEdge.to != null) {
            state = stampDeploymentRecall(state, peaceEdge.from, peaceEdge.to, 'sue_for_peace', tick);
            state = stampDeploymentRecall(state, peaceEdge.to, peaceEdge.from, 'sue_for_peace', tick);
          }
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
    // W-I I3 — THE FACTION PATCH APPLIES BY PAYLOAD, NOT BY TAXONOMY. This guard used to
    // read `outcome.type === 'faction'` alone, which coupled a PAYLOAD's application to an
    // unrelated classification field: an outcome could carry a fully-formed factionPatch
    // and have it silently dropped for being filed under some other type. BYTE-IDENTICAL
    // for every pre-existing producer, by census: the only authors of factionPatch in the
    // estate are factionCompetition's candidateBase (which hardcodes type 'faction') and
    // partyImpact's bolster/undermine outcomes (likewise), so the added disjunct is never
    // the reason this line fires today. It is the reason the brokerage services can charge
    // a patron power an in-world price while still filing as knowledge rather than as
    // politics, which is what the starved-lane cure needs. applyFactionPatch is itself
    // total (no factionId ⇒ the worldState is returned unchanged), so a stray patch with
    // no addressee is a no-op rather than a write.
    if (outcome.type === 'faction' || outcome.factionPatch) state = applyFactionPatch(state, outcome);
    // war-4 — EMERGENCY RECALL EXECUTES. The strategy chooser's return_home hard
    // override (a besieged home / imperilled vassal recalling its committed army)
    // carries metadata.recallTargetId but was previously inert theater. Stamp the
    // withdrawal order onto the army's live deployment so the war layer marches it
    // home NEXT tick (deploymentReturn → siege relief) instead of the order re-firing
    // every tick. No matching deployment ⇒ byte-identical no-op.
    if (outcome.candidateType === 'strategy_return_home' && outcome.metadata?.recallTargetId != null) {
      state = stampDeploymentRecall(state, outcome.targetSaveId, outcome.metadata.recallTargetId, 'return_home', tick);
    }
    // JOIN 1 — THE RESOLVED MARCH REACHES THE OPENER (warIntent.js). The recall arm
    // directly above is the same seam in the other direction: a chooser decision that
    // used to be pure theater, deposited as state the war layer consumes. Here the
    // chooser's `deploy` move deposits an ORDER naming the target its seat resolved
    // on; warDeployment step 4 — still the ONE opener — reads it next tick, tries that
    // target FIRST and waives only the CONQUEST_MARGIN pre-filter for it (never the
    // feasibility gate, never the posture gate). The shared join accepts both the
    // chooser contract and `metadata.warIntent` from non-chooser producers (trade
    // escalation), and retires an earlier order when the opener obeys it.
    // Same-tick producer/opener order remains commutative inside the apply pass.
    state = applyWarIntentOutcome(state, outcome, tick ?? 0);
    // war-2 — APPROVED FACTION PROPOSALS APPLY FOR REAL. A DM-facing faction payload
    // moves real settlement state (the government read-path, the named institution, the
    // roster power scalars), additive on top of applyFactionPatch above.
    if (FACTION_PAYLOAD_KINDS.has(outcome.proposalPayload?.kind)) {
      const sid = String(outcome.proposalPayload.settlementId ?? outcome.targetSaveId ?? '');
      const entry = settlementUpdates.get(sid);
      if (entry?.settlement) {
        const installerFactionId = String(outcome.proposalPayload.factionId || outcome.factionId || '');
        const ladderRecord = getSpatialLedger(state, 'npcLadder')?.[sid];
        const fromRulerId = rulingSeatNidOf(ladderRecord, entry.settlement);
        const inheritedWarDemand = outcome.proposalPayload.kind === 'government_change'
          && installerFactionId
          && typeof outcome.proposalPayload.warDecisionId === 'string'
          && outcome.proposalPayload.warDecisionId
          ? warDemandForInstaller(state, entry.settlement, sid, installerFactionId, {
              decisionId: outcome.proposalPayload.warDecisionId,
              carriedDemand: outcome.proposalPayload.warDemand,
            })
          : null;
        const nextSettlement = applyFactionPayloadEffect(entry.settlement, outcome, state, { now, tick });
        if (nextSettlement !== entry.settlement) {
          settlementUpdates.set(sid, { ...entry, settlement: nextSettlement });
          // WR-5 H/D — an approved government transfer and an organic ladder
          // succession converge on the ladder's one bounded transition writer.
          // The old governing court is still required to recover the organizing
          // grievance above; after transfer, the same ladder resolves the new seat.
          if (outcome.proposalPayload.kind === 'government_change' && warRulingsLit) {
            // transferRulingPower preserves the governing body while changing
            // the authority behind it. An id-backed ladder resolves that same
            // seat directly; a legacy name-keyed ladder cannot follow the body
            // rename, so the known pre-transfer holder remains the truthful
            // seat instead of becoming a fabricated vacancy.
            const toRulerId = rulingSeatNidOf(ladderRecord, nextSettlement) || fromRulerId;
            const governingFaction = governingFactionOf(nextSettlement);
            // ONE SPELLING with the organic-succession writer (npcLadderKernel).
            // The old `governingFaction?.id || installerFactionId` recorded the
            // INSTALLER under the governing field on every generated world,
            // because no powerStructure row carries `.id`; installerFactionId is
            // still emitted below under its own honest name.
            //
            // ⚠ DECLARED PERSISTED-VALUE SHIFT (measured 2026-08-07, omitted from
            // TCD-1's own "DECLARED GOLDEN SHIFT" section and recorded here so it
            // cannot ride silently). This is NOT a new field appearing: it is a
            // NEW VALUE in a field that was already being persisted. Measured over
            // 30 real generated worlds (5 tiers × 6 seeds) driven through this very
            // apply mouth, the change is TOTAL — 30 of 30 rows, never a subset:
            //     before  `hamlet-7100:merchant_guilds`  installerFactionId, in
            //             factionCompetition's `${saveId}:${stablePart(name)}` space
            //     after   `fac.merchant_council`         ladderFactionKey of the body
            //             that HOLDS the seat, in the ladder's `fac.<slug>` space
            // It is doubly a change. THE SUBJECT MOVES: transferRulingPower seats a
            // NEW governing body derived from the challenger's preference, and the
            // post-transfer holder shares a name with neither the prior holder (0/30)
            // nor the installer (0/30) — "Feudal Stewardship" + installer "Merchant
            // Guilds" ⇒ "Merchant Council". So the old value named a body that does
            // not hold the seat. THE ID SPACE MOVES: the two spaces are disjoint, so
            // no reader could ever have accepted both, and the ladder's own organic
            // writer was already on `fac.` — this composer was the lone outlier.
            // Pinned by tests/domain/warSeatBooksFactionAddress.test.js (PIN-3).
            const governingFactionId = seatTransitionGoverningFactionId(governingFaction);
            const governingFactionName = governingFaction ? nameOf(governingFaction) : '';
            const seatTransition = {
              id: `applied:${String(outcome.id || '')}`,
              fromRulerId,
              toRulerId,
              cause: 'government_change',
              tick: Number.isFinite(Number(tick)) ? Number(tick) : 0,
              authorityEpoch: authorityTransferEpochFor(nextSettlement),
              ...(installerFactionId ? { installerFactionId } : {}),
              ...(outcome.metadata?.factionName
                ? { installerFactionName: String(outcome.metadata.factionName) }
                : {}),
              ...(governingFactionId ? { governingFactionId } : {}),
              ...(governingFactionName ? { governingFactionName } : {}),
              ...(inheritedWarDemand ? { warDemand: inheritedWarDemand } : {}),
            };
            const beforeTransition = state;
            state = appendNpcLadderSeatTransition(state, sid, seatTransition);
            if (state !== beforeTransition) {
              newsEntries.push(...warRulingNewsEntries({
                evidence: governmentTransitionRulingEvidence({
                  transition: seatTransition,
                  outcome,
                }),
                snapshot,
                now,
              }));
            }
          }
        }
      }
    }
    if (outcome.type === 'stressor' && outcome.stressor) {
      const byId = new Map((state.stressors || []).map((/** @type {any} */ stressor) => [stressor.id, stressor]));
      // Birth time is sacred: escalation/spread re-upserts the same record,
      // so the FIRST createdAt wins (the crisis was born once) while
      // updatedAt moves with every touch.
      const prior = byId.get(outcome.stressor.id);
      // Force the commutative field-merge when an earlier outcome in THIS pass
      // already wrote this id: a pre-tick record's createdAt !== now, so without
      // this flag the second collision would last-write-win, dropping the first
      // write's spread targets / reverting its severity.
      const merged = mergeStressorUpsert(prior, outcome.stressor, now, stressorWrittenThisPass.has(outcome.stressor.id), tick);
      stressorWrittenThisPass.add(outcome.stressor.id);
      byId.set(outcome.stressor.id, merged);
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
        });
      }
    }
    autoApplied.push(outcome);
    // WR-6: an alliance call is carried through the ordinary outcome/proposal
    // lane, but once it actually applies its reader face belongs to the governed
    // coalition corpus. Proposal creation continued above, so a held call cannot
    // speak as joined/refused before approval. If typed identities are incomplete
    // the projector fails closed and the ordinary outcome prose remains available.
    const coalitionNews = warCoalitionNewsEntries({
      evidence: warCoalitionEvidenceFromOutcome(outcome),
      snapshot,
      now,
    });
    // FEED curation only: autoApplied above records every applied outcome.
    // Pulse history then partitions public selections from bounded mechanical
    // and consequence receipts; record mode changes visibility, not mechanics.
    const appliedEntry = newsEntryForOutcome(outcome, tick, 'applied');
    if (coalitionNews.length) {
      newsEntries.push(...coalitionNews);
    } else if (stateOnly) {
      if (!isDriftOnlyOutcome(outcome)
          || !isMetronomeRepeat(
            appliedEntry,
            [...feed.entries, ...priorHiddenRumorSeeds, ...newsEntries, ...rumorSeedEntries],
            tick,
          )) {
        rumorSeedEntries.push({ ...appliedEntry, recordMode: 'state_only' });
      }
    } else {
      if (!isDriftOnlyOutcome(outcome)
          || !isMetronomeRepeat(appliedEntry, [...feed.entries, ...newsEntries], tick)) {
        newsEntries.push(appliedEntry);
      }
    }
  }

  // Ghost applied impacts: a materialized regional condition expires locally
  // (time progression drops it), but the impact row stayed 'applied' forever —
  // map markers, inbox Resolve buttons, and the feed kept asserting pressure
  // that no longer exists. Now that this tick's settlement updates are final,
  // an 'applied' impact whose TARGET is in this pulse and whose condition is
  // gone flips to 'resolved' (the derivation below emits the resolved entry,
  // so the DM reads the pressure easing instead of resolving a ghost).
  // Targets absent from this pulse's saves are left alone — absence from the
  // pulse is not evidence of expiry. Pulse-only: party/proposal injections
  // pass advanceRegionalImpacts:false and never reconcile.
  if (shouldAdvanceRegionalImpacts) {
    const beforeReconcile = graph;
    for (const impact of beforeReconcile.queuedImpacts) {
      if (impact.status !== 'applied') continue;
      const entry = settlementUpdates.get(String(impact.targetSettlementId));
      if (!entry?.settlement) continue;
      const conditionId = impact.conditionId || legacyRegionalConditionId(impact);
      const conditions = Array.isArray(entry.settlement.activeConditions) ? entry.settlement.activeConditions : [];
      if (conditions.some((/** @type {any} */ condition) => condition?.id === conditionId)) continue;
      // `now` threads through to updatedAt too, not just resolvedAt — replay
      // stamps no wall-clock time anywhere on the reconciled row.
      graph = setRegionalImpactStatus(graph, impact.id, 'resolved', { resolvedAt: now }, { now });
    }
    if (graph !== beforeReconcile) {
      newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeReconcile, graph, { tick, createdAt: now }));
    }
  }

  feed = appendWizardNewsEntries(feed, newsEntries, { now });
  state = refreshRelationshipMemory(state, graph, snapshot, { currentTick: tick });

  // SPATIAL: fold the arrival queue back onto worldState — PRESENT only under the
  // marker while impacts are in transit, DROPPED (dormant / byte-identical) when
  // empty or on the aspatial path. ensureWorldState's conditional-ledger pass then
  // clones it like every other conditional key.
  if (spatialDigest) {
    const nextArrivals = spatialArrivals && Object.keys(spatialArrivals).length ? spatialArrivals : null;
    if (nextArrivals) {
      state = setSpatialLedger(state, 'spatialArrivals', nextArrivals);
    } else {
      state = dropSpatialLedger(state, 'spatialArrivals');
    }
  }

  return {
    worldState: state,
    regionalGraph: graph,
    wizardNews: feed,
    settlementUpdates: [...settlementUpdates.values()],
    autoApplied,
    proposals,
    newsEntries,
    ...(lapsedOutcomeIds.length ? { lapsedOutcomeIds } : {}),
    ...(rumorSeedEntries.length ? { rumorSeedEntries } : {}),
    ...(envoyEvidence.length ? { envoyEvidence } : {}),
  };
}

/**
 * @param {Object} [args]
 * @param {any} [args.campaign]
 * @param {any[]} [args.saves]
 * @param {string} [args.proposalId]
 * @param {string} [args.now]
 * @param {string|null} [args.adjudicatedBy] FULL AUTO-RESOLVE provenance (realm
 *   directive 7 / J-D7, worldPulse/autoAdjudication.js). A ruling rendered by the
 *   ENGINE — because the DM's auto-resolve toggle said the realm rules on its own —
 *   stamps `adjudicatedBy` onto the proposal ROW's terminal status transition, so a
 *   retrospective read of the docket can always answer "who ruled this?". The DM's
 *   own hand-Apply passes NOTHING: the ABSENCE of the key is the DM's signature and
 *   the pre-existing row shape, so this whole parameter is byte-neutral when unused
 *   (`null` ⇒ every patch below spreads an empty object). Additive + absent-tolerant:
 *   a legacy row simply lacks the key, and no migration is owed.
 */
export function applyWorldPulseProposal({ campaign, saves = [], proposalId, now = wallClockNow(), adjudicatedBy = null } = {}) {
  const proposal = (campaign?.worldState?.proposals || []).find((/** @type {any} */ item) => item.id === proposalId);
  if (!proposal || proposal.status !== 'pending') return null;
  // A pre-v4 proposal can be approved before the next pulse gets a chance to
  // reconcile it. Fail closed at the final apply mouth: retain the durable row
  // as a superseded tombstone, but apply no stale state and publish no headline.
  if (proposalRequiresRecordModeSupersession(proposal)) {
    const tick = campaign?.worldState?.tick || proposal.tick || 0;
    const reconciled = reconcileSupersededProposalNews(
      updateProposalStatus(campaign.worldState, proposalId, 'superseded', {
        supersededAt: now,
        supersededAtTick: tick,
        supersessionReason: 'record_mode_upgrade_apply_guard',
        updatedAt: now, ...(adjudicatedBy ? { adjudicatedBy } : {}),
      }),
      campaign?.wizardNews,
    );
    return {
      worldState: reconciled.worldState,
      regionalGraph: ensureRegionalGraph(campaign?.regionalGraph, { now }),
      wizardNews: reconciled.wizardNews,
      settlementUpdates: [],
      autoApplied: [],
      proposals: [],
      newsEntries: [],
      proposalDisposition: 'superseded',
    };
  }
  // The deterministic resolver (Stage 2): the stored outcome, applyMode forced to
  // 'auto', no fresh RNG draw. Auto-resolving is byte-identical to this manual
  // Apply path because both route the SAME resolved outcome through
  // applyWorldPulseOutcomes.
  const outcome = resolveProposalToOutcome(proposal.outcome);
  const settlementMap = new Map((saves || []).map(save => [String(save.id || save.settlement?.id), { saveId: String(save.id || save.settlement?.id), save, settlement: save.settlement || save }]));
  const adjudicationGraph = ensureRegionalGraph(campaign?.regionalGraph, { now });
  // Manual approval must read the same causal/system/active-condition snapshot
  // as an organic pulse. The former hand-built three-field items silently erased
  // pressure evidence and could make the same target court refuse manually after
  // accepting in autoresolve.
  const snapshot = buildWorldSnapshot({
    campaign: {
      ...campaign,
      settlementIds: [...settlementMap.keys()],
      regionalGraph: adjudicationGraph,
      worldState: campaign.worldState,
    },
    // The proposal queue already scopes these saves as campaign participants;
    // preserve that historical behavior while using the canonical derivation.
    saves: (saves || []).map((save) => ({ ...save, phase: 'canon' })),
    worldState: campaign.worldState,
    regionalGraph: adjudicationGraph,
  });
  const result = applyWorldPulseOutcomes({
    snapshot,
    // Keep the docket pending until the live-world applicator returns a terminal
    // disposition. Pre-stamping `appliedAt` made a lapsed offer claim both
    // "applied" and "superseded" in the same durable row.
    worldState: campaign.worldState,
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
  if (Array.isArray(result.lapsedOutcomeIds)
    && result.lapsedOutcomeIds.includes(String(outcome.id || ''))) {
    const tick = campaign.worldState?.tick || proposal.tick || 0;
    // A lapsed bilateral question is a docket transition only. The generic
    // applicator performs end-of-pass maintenance even when its sole outcome
    // fails closed (notably relationship-memory refresh), so never use that
    // speculative world as the tombstone base. Otherwise clicking a stale
    // offer could materialize relationship posture/scalars without applying
    // the offer, and the superseded store lane intentionally has no undo entry.
    const reconciled = reconcileSupersededProposalNews(
      updateProposalStatus(campaign.worldState, proposalId, 'superseded', {
        supersededAt: now,
        supersededAtTick: tick,
        supersessionReason: outcome.proposalPayload?.kind === 'siege_initiation'
          && outcome.proposalPayload?.coalition
          ? 'coalition_join_lapsed'
          : 'bilateral_peace_lapsed',
        updatedAt: now,
        ...(adjudicatedBy ? { adjudicatedBy } : {}),
      }),
      campaign.wizardNews,
    );
    return {
      ...result,
      worldState: reconciled.worldState,
      regionalGraph: adjudicationGraph,
      wizardNews: reconciled.wizardNews,
      settlementUpdates: [],
      autoApplied: [],
      proposals: [],
      newsEntries: [],
      proposalDisposition: 'superseded',
    };
  }
  // W-COMPOSER-2 lapse honesty: a realm-verb order whose gates refused at apply is stamped 'refused'
  // (visible in the queue's history), never 'applied' — the §10 phantom-hole law at the proposal
  // mouth. Organic outcomes are untouched. correctness-4: the SAME provenance writer the organic tick
  // uses now records the decree's cause-edges too (flag-gated in recordProposalProvenance ⇒ byte-
  // identical when dark), so a DM-approved decree leaves a recorded-causality entry, not only pulses.
  const wasRefused = Array.isArray(result.newsEntries) && result.newsEntries.some((/** @type {NonNullable<SimSettlement['config']>} */ n) => n && n.impactKind === 'realm_verb_refused');
  result.worldState = recordProposalProvenance(updateProposalStatus(result.worldState, proposalId, wasRefused ? 'refused' : 'applied', { appliedAt: now, updatedAt: now, ...(adjudicatedBy ? { adjudicatedBy } : {}) }), result, campaign.worldState?.tick || proposal.tick || 0);
  return result;
}

/**
 * W-COMPOSER-2 — mint a DM realm-verb order as a PENDING PROPOSAL through the
 * EXACT sim mint lane (the applyMode:'proposal' arm of applyWorldPulseOutcomes:
 * proposalIdFor + upsertProposal + the proposal news entry), so a DM-minted
 * realm proposal is record-identical to a sim-minted one. Approval then rides
 * the standing applyWorldPulseProposal → the realm verb arm. Dedup: one
 * pending order per (candidateType, acting settlement) — the M10a
 * pendingActorMajorFor guard.
 * @param {Object} [io]
 * @param {SimSettlement['config']} [io.campaign] @param {NonNullable<SimSettlement['config']>[]} [io.saves]
 * @param {string} [io.verb] @param {NonNullable<SimSettlement['config']>} [io.args]
 * @param {string} [io.now]
 * @returns {{ ok: true, result: NonNullable<SimSettlement['config']>, proposalId: string|null }
 *         | { ok: false, code: string, prose: string }}
 */
export function mintRealmVerbProposal({ campaign, saves = [], verb = '', args = {}, now = wallClockNow() } = {}) {
  const worldState = campaign?.worldState || {};
  const tick = worldState.tick || 0;
  const settlementMap = new Map((saves || []).map(save => [String(save.id || save.settlement?.id), { saveId: String(save.id || save.settlement?.id), save, settlement: save.settlement || save }]));
  const snapshot = {
    campaign,
    regionalGraph: ensureRegionalGraph(campaign?.regionalGraph, { now }),
    settlements: [...settlementMap.values()].map(item => ({ id: item.saveId, settlement: item.settlement, name: item.settlement?.name || item.save?.name || item.saveId })),
  };
  const built = buildRealmVerbOutcome({ verb, args, worldState, snapshot, tick });
  if (built.ok !== true) return built;
  // BOUNDED BY CONSTRUCTION (LAW 1): the DM mint refuses when the verb's own
  // manifest predicate refuses — the composer never queues a knowably-doomed
  // order. (The mover RE-MINTS bypass this — the mover's own gates already ran.)
  const gate = built.predicate;
  if (gate && !gate.available) {
    return { ok: false, code: 'predicate_refused', prose: gate.reasons.join(' ') || 'The order is not available in the current world.' };
  }
  if (pendingActorMajorFor(worldState, built.outcome.candidateType, built.outcome.targetSaveId)) {
    return { ok: false, code: 'order_already_pending', prose: 'An identical order already awaits your word in the proposals queue.' };
  }
  const result = applyWorldPulseOutcomes({
    snapshot,
    worldState,
    regionalGraph: campaign?.regionalGraph,
    wizardNews: campaign?.wizardNews,
    settlementMap,
    outcomes: [built.outcome],
    tick,
    now,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: worldState.simulationRules,
  });
  return { ok: true, result, proposalId: result.proposals[0]?.id || null };
}
