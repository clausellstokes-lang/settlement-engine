/**
 * WR-7b's pure encounter census.
 *
 * This leaf never moves an envoy or an army.  Its callers hand it both ledgers
 * already projected from the same pre-mutation cut to the same tick.  Exact
 * node equality is the whole collision law: a shared route, segment, or future
 * destination is not an encounter.
 */

import {
  independentLiveWarCauseTypes,
  joinAnchorOf,
} from './warCoalitionLedger.js';

export const ENVOY_PROJECTION_PHASE = 'pre_mutation';
export const ENVOY_ENCOUNTER_KINDS = Object.freeze([
  'field_parlay',
  'war_continue',
  'private_goal',
]);
export const ENVOY_PRIVATE_GOALS = Object.freeze([
  'plant',
  'imprison',
  'terms_shop',
]);
export const ENVOY_ENCOUNTER_VENUE_KINDS = Object.freeze([
  'allied_hall',
  'occupied_enemy_settlement',
  'field_node',
]);

const JOURNEYS = new Set(['outbound', 'return']);
const PRIVATE_GOALS = new Set(ENVOY_PRIVATE_GOALS);
const VENUE_KINDS = new Set(ENVOY_ENCOUNTER_VENUE_KINDS);
const PRIORITY = Object.freeze({ private_goal: 0, field_parlay: 1, war_continue: 2 });

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function wholeTick(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function stableParts(parts) {
  return parts.map((value) => {
    const part = String(value);
    return `${part.length}:${part}`;
  }).join('|');
}

function venueRefOf(value) {
  if (value == null) return null;
  const row = asObject(value);
  const id = text(row.id);
  const kind = text(row.kind);
  if (!id || !VENUE_KINDS.has(kind)) return null;
  return { id, kind };
}

function normalizeProjectedEnvoy(raw, tick) {
  const row = asObject(raw);
  const errandId = text(row.errandId);
  const npcId = text(row.npcId);
  const fromId = text(row.fromId || row.from);
  const toId = text(row.toId || row.to);
  const relationshipKey = text(row.relationshipKey);
  const episodeKey = text(row.episodeKey);
  const nodeId = text(row.nodeId);
  const journey = text(row.journey);
  const projectedTick = wholeTick(row.projectedTick);
  const projectionPhase = text(row.projectionPhase);
  const routeId = text(row.routeId);
  const venueRef = venueRefOf(row.venueRef);
  if (!errandId || !npcId || !fromId || !toId || fromId === toId
    || !relationshipKey || !episodeKey || !nodeId || !JOURNEYS.has(journey)
    || projectedTick !== tick || projectionPhase !== ENVOY_PROJECTION_PHASE
    || (row.venueRef != null && (!venueRef || venueRef.id !== nodeId))) return null;
  return {
    errandId,
    npcId,
    fromId,
    toId,
    relationshipKey,
    episodeKey,
    nodeId,
    journey,
    projectedTick,
    projectionPhase,
    ...(routeId ? { routeId } : {}),
    ...(venueRef ? { venueRef } : {}),
    ...(row.termsBearing === true ? { termsBearing: true } : {}),
  };
}

/**
 * Invalid intent disables only the claimed intent arm.  It cannot manufacture
 * a private action, but an independently true target-army field parlay remains
 * visible to the census.
 */
function normalizeIntent(raw) {
  if (raw == null) return null;
  const row = asObject(raw);
  const kind = text(row.kind);
  const intentId = text(row.intentId);
  if (kind === 'war_continue') {
    if (row.privateGoals != null || row.privateGoal != null) return null;
    return { kind, ...(intentId ? { intentId } : {}) };
  }
  if (kind !== 'private_goal' || !Array.isArray(row.privateGoals)
    || row.privateGoals.length !== 1 || row.privateGoal != null) return null;
  const privateGoal = text(row.privateGoals[0]);
  if (!PRIVATE_GOALS.has(privateGoal)) return null;
  if (privateGoal !== 'plant') {
    return { kind, privateGoal, ...(intentId ? { intentId } : {}) };
  }
  const plantLineageId = text(row.plantLineageId);
  const plantTargetErrandId = text(row.plantTargetErrandId);
  return {
    kind,
    privateGoal,
    plantEligible: row.plantEligible === true && !!plantLineageId,
    ...(plantLineageId ? { plantLineageId } : {}),
    ...(plantTargetErrandId ? { plantTargetErrandId } : {}),
    ...(intentId ? { intentId } : {}),
  };
}

function normalizeProjectedArmy(raw, tick) {
  const row = asObject(raw);
  const armyId = text(row.armyId);
  const actorId = text(row.actorId || row.ownerId);
  const targetId = text(row.targetId);
  const nodeId = text(row.nodeId);
  const projectedTick = wholeTick(row.projectedTick);
  const projectionPhase = text(row.projectionPhase);
  const routeId = text(row.routeId);
  const venueRef = venueRefOf(row.venueRef);
  if (!armyId || !actorId || !targetId || actorId === targetId || !nodeId
    || projectedTick !== tick || projectionPhase !== ENVOY_PROJECTION_PHASE
    || (row.venueRef != null && (!venueRef || venueRef.id !== nodeId))) return null;
  const intent = normalizeIntent(row.intent);
  return {
    armyId,
    actorId,
    targetId,
    nodeId,
    projectedTick,
    projectionPhase,
    ...(routeId ? { routeId } : {}),
    ...(venueRef ? { venueRef } : {}),
    ...(intent ? { intent } : {}),
  };
}

/** Identical duplicates collapse; conflicting aliases for one id all fail closed. */
function uniqueRows(rows, normalize, idOf) {
  const seen = new Map();
  for (const raw of Array.isArray(rows) ? rows : []) {
    const row = normalize(raw);
    if (!row) continue;
    const id = idOf(row);
    const encoded = JSON.stringify(row);
    const prior = seen.get(id);
    if (!prior) seen.set(id, { encoded, row, conflicted: false });
    else if (prior.encoded !== encoded) prior.conflicted = true;
  }
  return [...seen.values()]
    .filter((entry) => !entry.conflicted)
    .map((entry) => entry.row);
}

function candidateOrder(a, b) {
  return (PRIORITY[a.kind] - PRIORITY[b.kind])
    || codepoint(a.actorId, b.actorId)
    || codepoint(a.armyId, b.armyId)
    || codepoint(a.errandId, b.errandId)
    || codepoint(a.id, b.id);
}

function encounterCandidate(envoy, army, tick, kind, privateGoal = '') {
  const id = `envoy_encounter:${stableParts([
    tick,
    envoy.errandId,
    army.actorId,
    army.armyId,
    kind,
    privateGoal,
    envoy.nodeId,
  ])}`;
  const intent = asObject(army.intent);
  return {
    id,
    kind,
    tick,
    errandId: envoy.errandId,
    npcId: envoy.npcId,
    actorId: army.actorId,
    armyId: army.armyId,
    nodeId: envoy.nodeId,
    journey: envoy.journey,
    relationshipKey: envoy.relationshipKey,
    episodeKey: envoy.episodeKey,
    ...(privateGoal ? { privateGoal } : {}),
    ...(envoy.routeId ? { routeId: envoy.routeId } : {}),
    ...(envoy.venueRef ? { venueRef: { ...envoy.venueRef } } : {}),
    ...(privateGoal === 'plant' ? {
      plantEligibility: 'confirmed',
      plantLineageId: intent.plantLineageId,
    } : {}),
    provenance: {
      temporalCut: { projectedTick: tick, projectionPhase: ENVOY_PROJECTION_PHASE },
      envoyPosition: {
        errandId: envoy.errandId,
        npcId: envoy.npcId,
        nodeId: envoy.nodeId,
        ...(envoy.routeId ? { routeId: envoy.routeId } : {}),
        ...(envoy.venueRef ? { venueRef: { ...envoy.venueRef } } : {}),
      },
      armyPosition: {
        armyId: army.armyId,
        actorId: army.actorId,
        nodeId: army.nodeId,
        ...(army.routeId ? { routeId: army.routeId } : {}),
        ...(army.venueRef ? { venueRef: { ...army.venueRef } } : {}),
      },
      ...(text(intent.intentId) ? { intentId: text(intent.intentId) } : {}),
    },
  };
}

/**
 * Enumerate every eligible collision from one already-projected temporal cut.
 * Candidate order is the arbitration order and therefore part of the contract.
 *
 * @param {{projectedEnvoys?:unknown[],projectedArmies?:unknown[],tick:unknown}} args
 */
export function censusEnvoyEncounterCandidates({ projectedEnvoys = [], projectedArmies = [], tick } = {}) {
  const at = wholeTick(tick);
  if (at == null) return [];
  const envoys = uniqueRows(
    projectedEnvoys,
    (row) => normalizeProjectedEnvoy(row, at),
    (row) => row.errandId,
  );
  const armies = uniqueRows(
    projectedArmies,
    (row) => normalizeProjectedArmy(row, at),
    (row) => row.armyId,
  );
  const candidates = [];
  for (const envoy of envoys) {
    for (const army of armies) {
      if (army.nodeId !== envoy.nodeId || army.actorId === envoy.fromId) continue;
      const intent = asObject(army.intent);
      if (intent.kind === 'private_goal') {
        const privateGoal = text(intent.privateGoal);
        const plantTargetsThisErrand = privateGoal !== 'plant'
          || text(intent.plantTargetErrandId) === envoy.errandId;
        if (privateGoal && (privateGoal !== 'plant' || intent.plantEligible === true)
          && plantTargetsThisErrand) {
          candidates.push(encounterCandidate(envoy, army, at, 'private_goal', privateGoal));
          continue;
        }
      }
      if (army.actorId === envoy.toId) {
        candidates.push(encounterCandidate(envoy, army, at, 'field_parlay'));
        continue;
      }
      if (army.actorId !== envoy.toId && intent.kind === 'war_continue') {
        candidates.push(encounterCandidate(envoy, army, at, 'war_continue'));
      }
    }
  }
  return candidates.sort(candidateOrder);
}

/** Exactly one deterministic encounter per envoy and tick. */
export function selectEnvoyEncounters(args = {}) {
  const selected = new Map();
  for (const candidate of censusEnvoyEncounterCandidates(args)) {
    if (!selected.has(candidate.errandId)) selected.set(candidate.errandId, candidate);
  }
  return [...selected.values()].sort((a, b) => codepoint(a.errandId, b.errandId));
}

function relationshipKeyIndex(rows) {
  const index = new Map();
  for (const raw of Array.isArray(rows) ? rows : []) {
    const row = asObject(raw);
    const partyId = text(row.partyId);
    const targetId = text(row.targetId);
    const relationshipKey = text(row.relationshipKey);
    if (!partyId || !targetId || partyId === targetId || !relationshipKey) continue;
    const pairId = selfParlayPairId(partyId, targetId);
    if (!index.has(pairId)) index.set(pairId, relationshipKey);
    else if (index.get(pairId) !== relationshipKey) index.set(pairId, null);
  }
  return index;
}

/** Stable unordered bilateral identity, independent of graph authoring order. */
export function selfParlayPairId(aId, bId) {
  const a = text(aId);
  const b = text(bId);
  if (!a || !b || a === b) return '';
  const pair = [a, b].sort(codepoint);
  return `war_pair:${stableParts(pair)}`;
}

/** Stable identity for the member's exact joined deployment episode. */
export function selfParlayEpisodeId({ partyId, targetId, frontSinceTick, joinCallId } = {}) {
  const party = text(partyId);
  const target = text(targetId);
  const since = wholeTick(frontSinceTick);
  const callId = text(joinCallId);
  if (!party || !target || party === target || since == null || !callId) return '';
  return `self_parlay_episode:${stableParts([party, target, since, callId])}`;
}

/**
 * Census the corrected kind (c): proactive genesis, never a collision.  A
 * joined member qualifies only on its exact current anchored episode and only
 * while its directed edge has no positive cause of its own.
 *
 * @param {{worldState?:unknown,relationshipRows?:unknown[]}} args
 */
export function censusProactiveSelfParlays({ worldState, relationshipRows = [] } = {}) {
  const state = asObject(worldState);
  const deployments = asObject(state.deployments);
  const relationshipKeys = relationshipKeyIndex(relationshipRows);
  const candidates = [];
  for (const partyId of Object.keys(deployments).sort(codepoint)) {
    const deployment = asObject(deployments[partyId]);
    const targetId = text(deployment.targetId);
    const frontSinceTick = wholeTick(deployment.sinceTick);
    if (!targetId || partyId === targetId || frontSinceTick == null || deployment.recalled != null) continue;
    const anchor = joinAnchorOf(deployment, partyId);
    if (!anchor) continue;
    if (independentLiveWarCauseTypes(
      state,
      partyId,
      targetId,
      { deployment, requireJoinAnchor: true },
    ).length) continue;
    const pairId = selfParlayPairId(partyId, targetId);
    const relationshipKey = relationshipKeys.get(pairId);
    if (!relationshipKey) continue;
    const episodeId = selfParlayEpisodeId({
      partyId,
      targetId,
      frontSinceTick,
      joinCallId: anchor.callId,
    });
    if (!episodeId) continue;
    candidates.push({
      id: `self_parlay:${stableParts([partyId, targetId, relationshipKey, episodeId])}`,
      kind: 'self_parlay',
      genesis: 'proactive',
      partyId,
      targetId,
      callerId: anchor.callerId,
      joinedTick: anchor.joinedTick,
      relationshipKey,
      frontSinceTick,
      pairId,
      episodeId,
      joinCallId: anchor.callId,
    });
  }
  return candidates.sort((a, b) => codepoint(a.partyId, b.partyId)
    || codepoint(a.targetId, b.targetId)
    || codepoint(a.id, b.id));
}
