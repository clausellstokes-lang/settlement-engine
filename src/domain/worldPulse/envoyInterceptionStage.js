/**
 * envoyInterceptionStage.js — WR-7b's collision, custody, and parlay stages.
 *
 * `envoyPulse.js` composes; this leaf holds the four stages it composes and
 * owns none of them. Every stage projects from ONE pre-mutation cut of both
 * ledgers to the same tick boundary before either commits movement, and each
 * stage moves an errand at most one transition per tick — a row that changes
 * state here is never re-read by a later stage on the same pulse.
 *
 * No ledger is written here directly: the errand writer, the army column
 * writer, the hold writer, and the plant envelope each keep their own single
 * writer, and this leaf only sequences them under the ruled precedence.
 */

import { armyTransitLedger } from '../spatial/armyTransit.js';
import {
  adaptArmyCommandPictureToEnvoyEpisode,
  applyArmyEnvoyIntent,
  applyEnvoyInterceptionDecision,
  projectArmiesForEnvoyEncounters,
} from './armyTransitKernel.js';
import { attachEnvoyPictureTarget } from './brokerageServicesPlant.js';
import {
  buildEnvoyRoutePlan,
  syncEnvoyNpcTransit,
} from './envoyDiplomacy.js';
import { selectEnvoyEncounters } from './envoyEncounter.js';
import {
  agreeEnvoyTerms,
  beginEnvoyReturn,
  envoyContinuationForHold,
  envoyEncounterForErrand,
  envoyEvidenceFor,
  envoyErrandsOf,
  envoyOfferEpisodeKey,
  markEnvoyIntercepted,
  negotiateEnvoyParlay,
  projectEnvoyForEncounter,
  recordEnvoyParlayRefusal,
  resolveEnvoyInterception,
} from './envoyErrand.js';
import { openForeignGuestHold } from './foreignGuestHold.js';
import { NEGOTIATION_SUBJECT_BANDS } from './negotiationPictures.js';
import { npcLedgerOf } from './npcLedger.js';
import {
  ensureRelationshipState,
  getRelationshipSettlements,
  relationshipKeyFromEdge,
} from './relationshipState.js';
import { readWarSeatBooks } from './warSeatBooks.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function wholeTick(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function compareCodepoint(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function stableParts(parts) {
  return parts.map((value) => `${String(value).length}:${String(value)}`).join('|');
}

function snapshotItem(snapshot, id) {
  const key = text(id);
  if (!key) return null;
  if (snapshot?.byId instanceof Map) return snapshot.byId.get(key) || null;
  return (Array.isArray(snapshot?.settlements) ? snapshot.settlements : [])
    .find((row) => text(asObject(row).id) === key) || null;
}

function edgeForPair(regionalGraph, leftId, rightId) {
  const wanted = [text(leftId), text(rightId)].sort(compareCodepoint);
  if (!wanted[0] || !wanted[1] || wanted[0] === wanted[1]) return null;
  const edges = Array.isArray(asObject(regionalGraph).edges)
    ? asObject(regionalGraph).edges
    : [];
  return edges.find((raw) => {
    const pair = getRelationshipSettlements(raw);
    return JSON.stringify([text(pair.from), text(pair.to)].sort(compareCodepoint))
      === JSON.stringify(wanted);
  }) || null;
}

/**
 * Freeze the venue law at collision time. A settlement is eligible only when
 * it is the interceptor's own/allied hall or a place that interceptor actually
 * occupies. A non-settlement node must carry the exact route id.
 */
function legalEncounterVenue({ worldState, snapshot, regionalGraph, nodeId, actorId, routeId }) {
  const node = text(nodeId);
  const actor = text(actorId);
  const route = text(routeId);
  if (!node || !actor) return null;
  if (snapshotItem(snapshot, node)) {
    const occupation = asObject(asObject(worldState).occupations)[node];
    if (text(asObject(occupation).occupierId) === actor) {
      return {
        encounterRef: { id: node, kind: 'occupied_enemy_settlement' },
        holdRef: { kind: 'settlement', settlementId: node },
      };
    }
    if (node === actor) {
      return {
        encounterRef: { id: node, kind: 'allied_hall' },
        holdRef: { kind: 'settlement', settlementId: node },
      };
    }
    const edge = edgeForPair(regionalGraph, actor, node);
    const relationshipKey = edge ? relationshipKeyFromEdge(edge) : '';
    const relationship = edge
      ? ensureRelationshipState(edge, asObject(asObject(worldState).relationshipStates)[relationshipKey])
      : null;
    if (relationship?.relationshipType === 'allied') {
      return {
        encounterRef: { id: node, kind: 'allied_hall' },
        holdRef: { kind: 'settlement', settlementId: node },
      };
    }
    return null;
  }
  if (!route) return null;
  return {
    encounterRef: { id: node, kind: 'field_node' },
    holdRef: { kind: 'route_node', nodeId: node, routeId: route },
  };
}

function holdVenueFromEncounter(encounter) {
  const row = asObject(encounter);
  const venue = asObject(row.venueRef);
  const venueId = text(row.venueId);
  if (text(venue.id) !== venueId) return null;
  if (['allied_hall', 'occupied_enemy_settlement'].includes(text(venue.kind))) {
    return { kind: 'settlement', settlementId: venueId };
  }
  const routeId = text(row.routeId);
  return text(venue.kind) === 'field_node' && routeId
    ? { kind: 'route_node', nodeId: venueId, routeId }
    : null;
}

function h1OwnsEncounterVenue(worldState, errand, holdVenue) {
  const ledger = npcLedgerOf(worldState);
  const npcId = text(errand?.npcId);
  const venue = asObject(holdVenue);
  if (!npcId) return false;
  if (venue.kind === 'settlement') {
    const placed = asObject(ledger.placed[npcId]);
    return text(placed.hostSettlementId) === text(venue.settlementId)
      && Object.keys(asObject(placed.transit)).length === 0
      && Object.keys(asObject(placed.residency)).length === 0
      && placed.whereaboutsUnknown !== true;
  }
  const roamer = asObject(ledger.roamers[npcId]);
  const encounter = asObject(Array.isArray(errand?.encounters) ? errand.encounters.at(-1) : null);
  const prior = asObject(encounter.priorPosition);
  const transit = asObject(roamer.transit);
  return venue.kind === 'route_node'
    && text(venue.nodeId) === text(encounter.venueId)
    && text(transit.fromId) === text(prior.fromId)
    && text(transit.toId) === text(prior.toId)
    && roamer.whereaboutsUnknown !== true;
}

function h1OwnsActiveLeg(worldState, errand) {
  const ledger = npcLedgerOf(worldState);
  const npcId = text(errand?.npcId);
  const position = asObject(errand?.positionRef);
  const journeyLegs = (Array.isArray(errand?.legs) ? errand.legs : [])
    .map(asObject)
    .filter((leg) => text(leg.journey) === text(position.journey));
  const leg = journeyLegs[Number(position.legIndex)];
  const transit = asObject(asObject(ledger.roamers[npcId]).transit);
  return !!npcId && !!leg
    && text(transit.fromId) === text(leg.fromId)
    && text(transit.toId) === text(leg.toId)
    && wholeTick(transit.departTick) === wholeTick(leg.departTick)
    && wholeTick(transit.arrivalTick) === wholeTick(leg.arrivalTick);
}

function armyPictureForErrand(armyRecord, errand, tick) {
  const offer = asObject(errand?.offer);
  const payload = asObject(offer.proposalPayload);
  return adaptArmyCommandPictureToEnvoyEpisode(armyRecord, {
    relationshipKey: text(offer.relationshipKey),
    offererId: text(payload.offererId),
    targetId: text(payload.targetId),
    frontOwnerId: text(payload.peaceFrontOwnerId),
    frontSinceTick: wholeTick(payload.peaceFrontSinceTick),
    adaptedTick: tick,
  });
}

function commissionedPlantRows(value) {
  return (Array.isArray(value) ? value : [])
    .map((plant, index) => ({ plant, index, key: text(asObject(plant).key) }))
    .filter((row) => row.key)
    .sort((left, right) => compareCodepoint(left.key, right.key) || left.index - right.index);
}

/**
 * Attach already-paid I4 work to one physically reachable envoy before the
 * encounter census. This does not mint a plant or charge twice: the brokerage
 * producer supplied the envelope and this stage only adds its exact target.
 */
export function prepareEnvoyPlantTargets({ worldState, tick, commissionedPlants }) {
  let state = worldState;
  const plants = Array.isArray(commissionedPlants) ? [...commissionedPlants] : [];
  if (!plants.length) return { worldState: state, commissionedPlants: plants };
  const projectedEnvoys = envoyErrandsOf(state)
    .map((errand) => projectEnvoyForEncounter(errand, tick))
    .filter(Boolean);
  const projectedArmies = projectArmiesForEnvoyEncounters(state, tick);
  const usedArmies = new Set();
  const usedEnvoys = new Set();
  for (const row of commissionedPlantRows(plants)) {
    const plant = asObject(row.plant);
    const record = asObject(plant.record);
    const receipt = asObject(plant.receipt);
    const lineageId = text(record.lineageId);
    const hostId = text(record.liarId);
    const audienceId = text(record.audienceId);
    const subjectId = text(record.subjectId);
    if (!lineageId || !hostId || !audienceId || !subjectId
      || wholeTick(record.seededTick) !== wholeTick(tick)) continue;
    const matches = [];
    for (const army of projectedArmies) {
      if (text(army.actorId) !== hostId || usedArmies.has(text(army.armyId))) continue;
      for (const envoy of projectedEnvoys) {
        if (text(envoy.nodeId) !== text(army.nodeId)
          || text(envoy.fromId) !== audienceId || usedEnvoys.has(text(envoy.errandId))) continue;
        const errand = envoyErrandsOf(state).find((candidate) => candidate.id === envoy.errandId);
        const picture = asObject(errand?.negotiationPicture);
        const subject = (Array.isArray(picture.subjects) ? picture.subjects : [])
          .map(asObject)
          .find((candidate) => text(candidate.settlementId) === subjectId);
        const ladder = NEGOTIATION_SUBJECT_BANDS.strengthBand;
        const bandIndex = ladder.indexOf(text(subject?.strengthBand));
        const direction = Number(record.assertedBand) < Number(record.trueBand) ? 'fall' : 'rise';
        const nextIndex = bandIndex + (direction === 'fall' ? -1 : 1);
        if (!errand || bandIndex <= 0 || nextIndex <= 0 || nextIndex >= ladder.length) continue;
        matches.push({ army, envoy, errand, direction });
      }
    }
    matches.sort((left, right) => compareCodepoint(text(left.army.armyId), text(right.army.armyId))
      || compareCodepoint(text(left.envoy.errandId), text(right.envoy.errandId)));
    const chosen = matches[0];
    if (!chosen) continue;
    const target = {
      kind: 'envoy_picture',
      errandId: text(chosen.errand.id),
      npcId: text(chosen.errand.npcId),
      pictureId: text(asObject(chosen.errand.negotiationPicture).id),
      episodeKey: envoyOfferEpisodeKey(chosen.errand.offer),
      subjectId,
      field: 'strengthBand',
      direction: chosen.direction,
      commissionerId: text(receipt.patronId),
      purpose: 'intercepted_envoy_appraisal',
    };
    const targeted = attachEnvoyPictureTarget(row.plant, target);
    const expected = asObject(armyTransitLedger(state))[text(chosen.army.armyId)];
    if (!targeted || !expected) continue;
    const intent = {
      kind: 'private_goal',
      intentId: `army_envoy_intent:${stableParts([
        chosen.army.armyId, chosen.envoy.errandId, lineageId, tick,
      ])}`,
      privateGoals: ['plant'],
      plantEligible: true,
      plantLineageId: lineageId,
      plantTargetErrandId: text(chosen.envoy.errandId),
    };
    const applied = applyArmyEnvoyIntent({
      worldState: state,
      armyId: text(chosen.army.armyId),
      expectedRecord: expected,
      intent,
    });
    if (!applied.changed) continue;
    state = applied.worldState;
    plants[row.index] = targeted;
    usedArmies.add(text(chosen.army.armyId));
    usedEnvoys.add(text(chosen.envoy.errandId));
  }
  return { worldState: state, commissionedPlants: plants };
}

export function markSharedCutEncounters({ worldState, snapshot, regionalGraph, tick }) {
  const startErrands = envoyErrandsOf(worldState);
  const projectedEnvoys = startErrands
    .map((errand) => projectEnvoyForEncounter(errand, tick))
    .filter(Boolean);
  const projectedArmies = projectArmiesForEnvoyEncounters(worldState, tick);
  const projectedArmyById = new Map(projectedArmies.map((row) => [text(row.armyId), row]));
  const startArmyById = asObject(armyTransitLedger(worldState));
  const selected = selectEnvoyEncounters({ projectedEnvoys, projectedArmies, tick });
  let state = worldState;
  const evidence = [];
  for (const rawEncounter of selected) {
    const encounter = asObject(rawEncounter);
    const startErrand = startErrands.find((row) => row.id === text(encounter.errandId));
    const projectedArmy = projectedArmyById.get(text(encounter.armyId));
    const armyRecord = startArmyById[text(encounter.armyId)];
    if (!startErrand || !projectedArmy || !armyRecord) continue;
    // A war-continuation order must concern this envoy's actual bilateral war;
    // an unrelated D->E march cannot stop an A->B peace carrier merely because
    // the nodes happen to coincide.
    if (encounter.kind === 'war_continue'
      && ![text(startErrand.from), text(startErrand.to)].includes(text(projectedArmy.targetId))) {
      continue;
    }
    const venue = legalEncounterVenue({
      worldState,
      snapshot,
      regionalGraph,
      nodeId: encounter.nodeId,
      actorId: encounter.actorId,
      routeId: encounter.routeId,
    });
    const interceptorPicture = armyPictureForErrand(armyRecord, startErrand, tick);
    if (!venue || !interceptorPicture) continue;
    const current = envoyErrandsOf(state).find((row) => row.id === startErrand.id);
    if (!current || JSON.stringify(current) !== JSON.stringify(startErrand)) continue;
    const marked = markEnvoyIntercepted({
      worldState: state,
      errandId: current.id,
      encounter: { ...encounter, venueRef: venue.encounterRef },
      interceptorPicture,
      expectedErrand: current,
      tick,
    });
    if (!marked.changed || !marked.errand) continue;
    const synced = syncEnvoyNpcTransit(marked.worldState, marked.errand, tick, venue.holdRef);
    if (!h1OwnsEncounterVenue(synced, marked.errand, venue.holdRef)) continue;
    state = synced;
    evidence.push(...marked.evidence);
  }
  return { worldState: state, evidence, startErrands };
}

function freshContinuationRoute(worldState, encounter, tick, season) {
  const row = asObject(encounter);
  const journey = text(row.priorJourney);
  return buildEnvoyRoutePlan({
    worldState,
    fromId: text(row.venueId),
    toId: text(row.destinationId),
    tick,
    journey: /** @type {'outbound'|'return'} */ (journey),
    season,
  });
}

function holdCauseForEncounter(encounter) {
  const row = asObject(encounter);
  if (row.kind === 'war_continue') return 'war_continuation';
  if (row.privateGoal === 'imprison') return 'private_imprisonment';
  if (row.privateGoal === 'terms_shop') return 'terms_shopping';
  return 'parlay_refused';
}

function holdInterruptedEnvoy({ worldState, errand, encounter, holdVenue, tick, cause }) {
  const held = resolveEnvoyInterception({
    worldState,
    errandId: errand.id,
    encounterId: encounter.id,
    resolution: 'held',
    expectedErrand: errand,
    tick,
  });
  if (!held.changed || !held.errand) return null;
  const continuation = envoyContinuationForHold(held.errand, encounter.id);
  if (!continuation) return null;
  const opened = openForeignGuestHold({
    worldState: held.worldState,
    hold: {
      schemaVersion: 1,
      id: `foreign_guest_hold:${stableParts([encounter.id, errand.npcId])}`,
      npcId: text(errand.npcId),
      errandId: text(errand.id),
      encounterId: text(encounter.id),
      captorId: text(encounter.interceptorId),
      venueId: text(encounter.venueId),
      venueRef: holdVenue,
      heldSinceTick: tick,
      cause,
      continuation,
    },
  });
  if (!opened.changed || !opened.hold) return null;
  const synced = syncEnvoyNpcTransit(opened.worldState, held.errand, tick, holdVenue);
  if (!h1OwnsEncounterVenue(synced, held.errand, holdVenue)) return null;
  return { worldState: synced, errand: held.errand, evidence: held.evidence, hold: opened.hold };
}

function armyChoosesCarriedTerms({ worldState, snapshot, errand, encounter }) {
  if (!errand.termSheet) return false;
  const books = readWarSeatBooks({
    worldState,
    snapshot,
    actorId: text(encounter.interceptorId),
    opponentId: text(errand.from),
  });
  return Number(books.peaceBias01) >= Number(books.continueBias01);
}

function foldedPlantTargetsErrand(worldState, armyRecord, errand) {
  const intent = asObject(armyRecord?.envoyIntent);
  const lineageId = text(intent.plantLineageId);
  if (intent.kind !== 'private_goal' || !Array.isArray(intent.privateGoals)
    || intent.privateGoals.length !== 1 || intent.privateGoals[0] !== 'plant'
    || intent.plantEligible !== true || text(intent.plantTargetErrandId) !== text(errand.id)
    || !lineageId) return false;
  const disinfo = asObject(asObject(asObject(worldState).spatialLedgers).disinfo);
  return Object.values(disinfo).map(asObject).some((record) => (
    text(record.lineageId) === lineageId
    && text(asObject(record.envoyTarget).errandId || asObject(record.plantProvenance).errandId) === text(errand.id)
  )) || Object.values(disinfo).map(asObject).some((record) => text(record.lineageId) === lineageId);
}

function resumeInterruptedEnvoy({ worldState, errand, encounter, holdVenue, tick, season, plantResumed = false }) {
  const routePlan = freshContinuationRoute(worldState, encounter, tick, season);
  if (!routePlan) return null;
  const resumed = resolveEnvoyInterception({
    worldState,
    errandId: errand.id,
    encounterId: encounter.id,
    resolution: plantResumed ? 'plant_resumed' : 'resumed',
    routePlan,
    expectedErrand: errand,
    tick,
  });
  if (!resumed.changed || !resumed.errand) return null;
  const synced = syncEnvoyNpcTransit(resumed.worldState, resumed.errand, tick, holdVenue);
  return h1OwnsActiveLeg(synced, resumed.errand)
    ? { worldState: synced, errand: resumed.errand, evidence: resumed.evidence }
    : null;
}

/** Resolve only rows that entered this tick already intercepted. */
export function resolveStartInterceptions({
  worldState,
  startErrands,
  snapshot,
  tick,
  season,
}) {
  let state = worldState;
  const evidence = [];
  const eligible = (Array.isArray(startErrands) ? startErrands : [])
    .filter((errand) => errand.state === 'intercepted')
    .sort((left, right) => compareCodepoint(text(left.id), text(right.id)));
  for (const startErrand of eligible) {
    const current = envoyErrandsOf(state).find((row) => row.id === startErrand.id);
    const encounter = current ? envoyEncounterForErrand(current) : null;
    if (!current || !encounter || wholeTick(encounter.encounteredTick) == null
      || Number(encounter.encounteredTick) > Number(tick) - 1) continue;
    const holdVenue = holdVenueFromEncounter(encounter);
    if (!holdVenue) continue;
    if (encounter.kind === 'field_parlay') {
      const parlay = resolveEnvoyInterception({
        worldState: state,
        errandId: current.id,
        encounterId: encounter.id,
        resolution: 'parlaying',
        expectedErrand: current,
        tick,
      });
      if (!parlay.changed || !parlay.errand) continue;
      const synced = syncEnvoyNpcTransit(parlay.worldState, parlay.errand, tick, holdVenue);
      if (!h1OwnsEncounterVenue(synced, parlay.errand, holdVenue)) continue;
      state = synced;
      evidence.push(...parlay.evidence);
      if (asObject(encounter.venueRef).kind === 'occupied_enemy_settlement') {
        const occupied = envoyEvidenceFor(parlay.errand, 'parlay_at_an_occupied_venue', tick, {
          encounterId: encounter.id,
          interceptorId: encounter.interceptorId,
          thirdPartyId: encounter.interceptorId,
          armyId: encounter.armyId,
          venueId: encounter.venueId,
        });
        if (occupied) evidence.push(occupied);
      }
      continue;
    }
    if (encounter.privateGoal === 'plant') {
      const army = asObject(armyTransitLedger(state))[text(encounter.armyId)];
      const resumed = resumeInterruptedEnvoy({
        worldState: state,
        errand: current,
        encounter,
        holdVenue,
        tick,
        season,
        plantResumed: foldedPlantTargetsErrand(state, army, current),
      });
      if (resumed) {
        state = resumed.worldState;
        evidence.push(...resumed.evidence);
      }
      continue;
    }
    if (encounter.privateGoal === 'terms_shop') {
      const expectedArmy = asObject(armyTransitLedger(state))[text(encounter.armyId)];
      if (!expectedArmy) continue;
      const carryTerms = armyChoosesCarriedTerms({ worldState: state, snapshot, errand: current, encounter });
      const decision = applyEnvoyInterceptionDecision({
        worldState: state,
        armyId: text(encounter.armyId),
        expectedRecord: expectedArmy,
        decision: {
          kind: carryTerms ? 'carry_terms' : 'hold_mission',
          encounterId: text(encounter.id),
          errandId: text(current.id),
          ...(carryTerms ? { termSheet: current.termSheet } : {}),
        },
        tick,
      });
      if (!decision.changed) continue;
      const result = carryTerms
        ? resumeInterruptedEnvoy({
            worldState: decision.worldState,
            errand: current,
            encounter,
            holdVenue,
            tick,
            season,
          })
        : holdInterruptedEnvoy({
            worldState: decision.worldState,
            errand: current,
            encounter,
            holdVenue,
            tick,
            cause: 'terms_shopping',
          });
      if (!result) continue;
      state = result.worldState;
      evidence.push(...result.evidence);
      const dilemma = envoyEvidenceFor(result.errand, 'interceptor_dilemma', tick, {
        encounterId: encounter.id,
        interceptorId: encounter.interceptorId,
        thirdPartyId: encounter.interceptorId,
        armyId: encounter.armyId,
        venueId: encounter.venueId,
      });
      if (dilemma) evidence.push(dilemma);
      continue;
    }
    const held = holdInterruptedEnvoy({
      worldState: state,
      errand: current,
      encounter,
      holdVenue,
      tick,
      cause: holdCauseForEncounter(encounter),
    });
    if (held) {
      state = held.worldState;
      evidence.push(...held.evidence);
    }
  }
  return { worldState: state, evidence };
}

/**
 * A writer's returned row is its INTENT; the ledger reader is the authority.
 * A row the reader rejects is dropped on the next read, silently taking the
 * whole errand with it, so every stage adopts a world only after reading its
 * own write back.
 */
function readBack(result, errandId) {
  if (!result?.changed || !result.errand) return null;
  return envoyErrandsOf(result.worldState).find((row) => text(row.id) === errandId) || null;
}

/** The origin `beginEnvoyReturn` will itself derive, mirrored so the plan matches. */
function parlayReturnOriginId(errand) {
  const latest = Array.isArray(errand.encounters) ? asObject(errand.encounters.at(-1)) : {};
  return text(latest.id) && text(latest.id) === text(errand.parlayId)
    ? text(latest.venueId)
    : text(errand.to);
}

/**
 * Draft once, then depart once. A parlay that matured on an earlier tick gets
 * exactly one drafting attempt under the two FROZEN pictures; the separately
 * priced mandatory return departs on a later tick, carrying the agreed sheet or
 * nothing at all. Retries and compromise are WR-7c's, so a recorded refusal is
 * never re-drafted here.
 */
export function resolveMaturedParlays({ worldState, tick, season }) {
  let state = worldState;
  const evidence = [];
  const eligible = envoyErrandsOf(state)
    .filter((errand) => errand.state === 'parlaying')
    .map((errand) => text(errand.id))
    .sort(compareCodepoint);
  for (const errandId of eligible) {
    const current = envoyErrandsOf(state).find((row) => text(row.id) === errandId);
    const parlayTick = current ? wholeTick(current.parlayTick) : null;
    if (!current || current.state !== 'parlaying' || parlayTick == null
      || Number(tick) < parlayTick + 1) continue;
    // (1) THE ONE DRAFT. Both frozen pictures are read by the negotiator; this
    // stage only persists the verdict through the errand writer.
    if (!current.termSheet && !current.parlayRefusal) {
      const attempt = negotiateEnvoyParlay({ errand: current, tick });
      const drafted = attempt.agreed && attempt.termSheet
        ? agreeEnvoyTerms({
            worldState: state,
            errandId,
            termSheet: attempt.termSheet,
            expectedErrand: current,
            tick,
          })
        : recordEnvoyParlayRefusal({
            worldState: state,
            errandId,
            expectedErrand: current,
            attempt,
            tick,
          });
      if (drafted.changed && readBack(drafted, errandId)) {
        state = drafted.worldState;
        evidence.push(...drafted.evidence);
      }
      // One transition per envoy per tick: the return is priced next pulse.
      continue;
    }
    // (2) THE MANDATORY RETURN, separately priced from the parlay venue.
    const routePlan = buildEnvoyRoutePlan({
      worldState: state,
      fromId: parlayReturnOriginId(current),
      toId: text(current.from),
      tick,
      journey: 'return',
      season,
    });
    if (!routePlan) continue;
    const returned = beginEnvoyReturn({ worldState: state, errandId, routePlan, tick });
    const persisted = readBack(returned, errandId);
    if (!persisted) continue;
    const synced = syncEnvoyNpcTransit(returned.worldState, persisted, tick);
    if (!h1OwnsActiveLeg(synced, persisted)) continue;
    state = synced;
    evidence.push(...returned.evidence);
  }
  return { worldState: state, evidence };
}
