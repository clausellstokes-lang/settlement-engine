/**
 * armyTransitKernel.js — the M5 ARMY-TRANSIT + FIELD COMBAT kernel adapter (Phase 5.5).
 *
 * The pure engine (spatial/armyTransit.js) owns the mechanics (position stepping, the
 * clamped field-battle sigmoid, collision detection, the courier umbilical, retreat
 * routing); THIS thin adapter supplies the LIVE reads and writes the outcomes back:
 *
 *   • DERIVE + ADVANCE: every committed deployment (the war layer's one-army ledger)
 *     is an army with a POSITION. A fresh campaign seeds a march record origin→target
 *     (planMarch over the frozen digest, the M1 danger re-score); an ongoing one
 *     advances its position. An army still EN ROUTE is a reinforcement/marching column
 *     (collision-eligible); once it lands it is besieging (at the walls).
 *   • COLLISIONS → FIELD BATTLES: every HOSTILE pair of in-transit armies whose
 *     remaining paths cross meets in the open (O(armies²), bounded — armies are FEW).
 *     The §5 clamped resolver decides it; BOUNDED attrition mauls the loser (never
 *     annihilates) and it RETREATS home by the danger re-score. The reduced strength
 *     writes back onto the deployment (a mauled army besieges weaker).
 *   • THE COURIER UMBILICAL: an army whose route home is CUT (its home besieged) grows
 *     belief-staleness — info-starved, it mis-assesses. INACTIVE (omniscient) ⇒ no fog.
 *
 * AGGREGATE, NAMED-NPC-SAFE (owner boundary): this moves strength/size NUMBERS only.
 * It reads no npc roster and returns no npc mutation — a commander is only ever FLAGGED
 * at-risk (a DM hook), never removed.
 *
 * DORMANT (constitutional): a no-op without the spatial-canon marker (armyTransitActive
 * false) — an aspatial world keeps the war layer's exact path (byte-identical), no
 * `armyTransit` ledger key. The ledger nests under the FP-R `spatialLedgers` namespace
 * ⇒ ZERO eager first-paint bytes. Pure + deterministic; the caller threads the tick +
 * the pulse rng (the battle fork).
 */

import {
  armyTransitActive, armyTransitLedger, armyRecordOf, stepArmyPosition, hasArrived,
  planMarch, detectCollisions, assertArmyBound, resolveFieldBattle,
  stepBeliefStaleness, ARMY_ROLES, retreatRoute, currentRegion, armyMarchWeeks,
  umbilicalFog, staleAssessment, normalizeArmyEnvoyIntent,
  normalizeArmyInterceptionDecision, ARMY_INTERCEPTION_DECISION_SCHEMA_VERSION,
} from '../spatial/armyTransit.js';
import { setSpatialLedger, dropSpatialLedger, getSpatialLedger, hopWeeks } from '../spatial/distanceRead.js';
import { belief, beliefsActive, strengthOfBand } from './beliefMap.js';
import { warFrontsInto } from './warFrontReads.js';
import { formatCount } from '../formatNumber.js';
import { defenseLedger } from '../defenseLedger.js';
import { factionArchetype } from '../factionArchetypes.js';
import { governingFactionOf } from '../rulingPower.js';
import { relationshipKeyFromEdge, getRelationshipSettlements } from './relationshipState.js';
import { envoyDiplomacyActive } from './envoyErrand.js';
import {
  applyNegotiationPictureMutation,
  createNegotiationPicture,
  NEGOTIATION_SUBJECT_BANDS,
  normalizeNegotiationPicture,
  normalizeParlayTermSheet,
} from './negotiationPictures.js';
import { readWarSeatBooks } from './warSeatBooks.js';
import { stampDeploymentRecall } from './warIntent.js';

/** @typedef {import('../spatial/distanceRead.js').SpatialDigest} SpatialDigest */
/** @typedef {import('../spatial/armyTransit.js').ArmyTransitRecord} ArmyTransitRecord */
/** @typedef {{ targetId?: string|number, sinceTick?: number, currentEffectiveStrength?: number,
 *   readiness?: number, supplyIntegrity?: number, deployedQuality?: number,
 *   recalled?: { cause?: string, tick?: number } }} DeploymentRecord */
/** @typedef {{ id?: string|number, name?: string, settlement?: { name?: string },
 *   causal?: { scores?: { economic_capacity?: number } } }} SnapItem */
/** @typedef {{ settlements?: SnapItem[], byId?: { get?: (id: string) => SnapItem | undefined } }} Snapshot */
/** @typedef {{ channels?: Array<{ type?: string, status?: string, from?: string|number, to?: string|number }> }} Graph */
/** @typedef {{ fork?: (key: string) => { random: () => number } }} Rng */

// spatial-engine-4: the umbilical-fog level at/above which a field battle is fought
// "half-blind" — the losing/marching column's couriers are cut deep enough that it
// mis-assessed the enemy. A DM-legible receipt is stamped; the PHYSICS stay TRUE
// (the true strengths always resolve the battle). Bounded (fog ∈ [0, UMBILICAL_MAX_DRIFT]).
const FOUGHT_BLIND_FOG = 0.3;

export const ARMY_ENVOY_INTENT_TUNING = Object.freeze({ PRIVATE_BOOK_MIN: 0.42, DECISION_MARGIN: 0.16, IMPRISON_MALICE_MIN: 0.67 });

export const ARMY_ENCOUNTER_PROJECTION_PHASE = 'pre_mutation';
const ENCOUNTER_VENUE_KINDS = new Set(['allied_hall', 'occupied_enemy_settlement', 'field_node']);

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} f @returns {number} */
function num(v, f) { return typeof v === 'number' && Number.isFinite(v) ? v : f; }

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 && value.trim() === value ? value : '';
}

/** Repository-wide deterministic codepoint order. */
function codepoint(/** @type {string} */ left, /** @type {string} */ right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** Collision-free serialization for persisted/projection identities. */
function stableParts(parts) {
  return parts.map((value) => `${String(value).length}:${String(value)}`).join('|');
}

/**
 * The 0..1 economic funding backing an army, from the origin's economic_capacity
 * score. Neutral 0.5 when unknown.
 * @param {Snapshot} snapshot @param {string} originId @returns {number}
 */
function fundingOf(snapshot, originId) {
  const item = snapshot?.byId?.get?.(String(originId));
  const score = item?.causal?.scores?.economic_capacity;
  return Number.isFinite(score) ? clamp01(Number(score) / 100) : 0.5;
}

/** The display name for an id. @param {Snapshot} snapshot @param {string} id @returns {string} */
function nameOf(snapshot, id) {
  const item = snapshot?.byId?.get?.(String(id));
  return item?.name || item?.settlement?.name || String(id);
}

/** @param {Snapshot|unknown} snapshot @param {string} id */
function snapshotItem(snapshot, id) {
  const shaped = /** @type {Snapshot & { byId?: unknown }} */ (snapshot || {});
  if (shaped.byId instanceof Map) return shaped.byId.get(id) || null;
  if (shaped.byId && typeof shaped.byId === 'object'
    && typeof /** @type {{get?:unknown}} */ (shaped.byId).get === 'function') {
    return /** @type {{get:(key:string)=>unknown}} */ (shaped.byId).get(id) || null;
  }
  return Array.isArray(shaped.settlements)
    ? shaped.settlements.find((item) => String(asObject(item).id ?? '') === id) || null
    : null;
}

/** @param {unknown} item */
function settlementOf(item) {
  const row = asObject(item);
  const nested = asObject(row.settlement);
  return Object.keys(nested).length ? nested : row;
}

/** @param {unknown} graph @param {string} left @param {string} right */
function relationshipKeyForPair(graph, left, right) {
  const rows = Array.isArray(asObject(graph).edges) ? asObject(graph).edges : [];
  const wanted = [left, right].sort(codepoint);
  const matches = rows.filter((raw) => {
    const pair = getRelationshipSettlements(raw);
    return JSON.stringify([String(pair.from || ''), String(pair.to || '')].sort(codepoint))
      === JSON.stringify(wanted);
  }).sort((a, b) => codepoint(relationshipKeyFromEdge(a), relationshipKeyFromEdge(b)));
  return matches.length ? relationshipKeyFromEdge(matches[0]) : '';
}

/** @param {number} value */
function negotiationStrengthBand(value) {
  const score = clamp01(value);
  return score < 0.2 ? 'spent' : score < 0.4 ? 'strained' : score < 0.6 ? 'ready' : score < 0.8 ? 'strong' : 'dominant';
}

/** @param {number} value */
function storesBand(value) {
  const score = clamp01(value);
  return score < 0.2 ? 'bare' : score < 0.45 ? 'thin' : score < 0.75 ? 'stocked' : 'deep';
}

/** @param {number} value */
function pressureBand(value) {
  const score = clamp01(value);
  return score < 0.2 ? 'quiet' : score < 0.5 ? 'present' : score < 0.8 ? 'pressing' : 'decisive';
}

/** @param {Record<string, unknown>} books */
function alignmentPressBand(books) {
  const continueBias = clamp01(num(books.continueBias01, 0.5));
  const peaceBias = clamp01(num(books.peaceBias01, 0.5));
  const malice = clamp01(num(books.malice01, 0.5));
  const margin = continueBias - peaceBias;
  if (margin <= -0.2) return 'merciful';
  if (margin <= 0.08) return 'measured';
  if (margin >= 0.35 || malice >= 0.8) return 'punitive';
  return 'hard';
}

/** @param {unknown} item */
function governingArchetypeOf(item) {
  const settlement = settlementOf(item);
  const governing = governingFactionOf(
    /** @type {Parameters<typeof governingFactionOf>[0]} */ (settlement),
  );
  if (!governing) return 'unknown';
  const kind = factionArchetype(governing);
  return ['merchant', 'military', 'religious'].includes(kind) ? kind : 'other';
}

/** @param {unknown} item @returns {{exportKnowledge:'known'|'unknown',exports:string[]}} */
function exportPictureOf(item) {
  const economic = asObject(settlementOf(item).economicState);
  if (!Array.isArray(economic.exports)) return { exportKnowledge: 'unknown', exports: [] };
  const exports = [...new Set(economic.exports.map((raw) => {
    if (typeof raw === 'string') return raw.trim();
    const row = asObject(raw);
    return text(row.name || row.good || row.resource || row.label);
  }).filter(Boolean))].sort(codepoint);
  return { exportKnowledge: 'known', exports };
}

/** @param {string} armyId @param {number} departTick @param {number} arrivalTick @param {string[]} path */
function armyRouteId(armyId, departTick, arrivalTick, path) {
  return `army_route:${stableParts([armyId, departTick, arrivalTick, ...path])}`;
}

/**
 * Byte-identical to envoyOfferEpisodeKey's five-part address.  Keeping this
 * helper explicit lets a target/interceptor column be lawfully re-addressed to
 * the travelling offer's front without changing a single observed band.
 * @param {{relationshipKey?:unknown, offererId?:unknown, targetId?:unknown,
 *   frontOwnerId?:unknown, frontSinceTick?:number}} [args]
 */
export function armyNegotiationEpisodeKey({
  relationshipKey,
  offererId,
  targetId,
  frontOwnerId,
  frontSinceTick,
} = {}) {
  const relationship = text(relationshipKey);
  const offerer = text(offererId);
  const target = text(targetId);
  const owner = text(frontOwnerId);
  const since = Number(frontSinceTick);
  if (!relationship || !offerer || !target || offerer === target
    || ![offerer, target].includes(owner) || !Number.isInteger(since) || since < 0) return '';
  return stableParts([relationship, offerer, target, owner, since]);
}

/**
 * The bounded aggregate court read for one encounter intent.  An explicit intent
 * is authoritative only when it passes the strict single-goal schema; malformed
 * explicit input fails closed instead of falling through to a different action.
 * Plant is never inferred here: a court book cannot invent an exact envoy target
 * or paid-disinformation lineage.
 * @param {{armyId?:unknown,targetId?:unknown,frontSinceTick?:unknown,books?:unknown,
 *   authoredIntent?:unknown}} [args]
 */
export function deriveArmyEnvoyIntent({
  armyId,
  targetId,
  frontSinceTick,
  books = {},
  authoredIntent,
} = {}) {
  if (authoredIntent !== undefined) return normalizeArmyEnvoyIntent(authoredIntent);
  const actor = text(String(armyId ?? ''));
  const target = text(String(targetId ?? ''));
  const since = Number(frontSinceTick);
  if (!actor || !target || actor === target || !Number.isInteger(since) || since < 0) return null;
  const read = asObject(books);
  const privateBook = clamp01(num(read.seatWeight01, 0) + num(read.patronWeight01, 0));
  const continueBias = clamp01(num(read.continueBias01, 0.5));
  const peaceBias = clamp01(num(read.peaceBias01, 0.5));
  const malice = clamp01(num(read.malice01, 0.5));
  let privateGoal = '';
  if (privateBook >= ARMY_ENVOY_INTENT_TUNING.PRIVATE_BOOK_MIN
    && peaceBias - continueBias >= ARMY_ENVOY_INTENT_TUNING.DECISION_MARGIN) {
    privateGoal = 'terms_shop';
  } else if (privateBook >= ARMY_ENVOY_INTENT_TUNING.PRIVATE_BOOK_MIN
    && continueBias - peaceBias >= ARMY_ENVOY_INTENT_TUNING.DECISION_MARGIN
    && malice >= ARMY_ENVOY_INTENT_TUNING.IMPRISON_MALICE_MIN) {
    privateGoal = 'imprison';
  }
  const authority = text(read.authoritySignature) || 'realm';
  const kind = privateGoal ? 'private_goal' : 'war_continue';
  const intentId = `army_envoy_intent:${stableParts([actor, target, since, authority, kind, privateGoal])}`;
  return normalizeArmyEnvoyIntent(privateGoal
    ? { kind, intentId, privateGoals: [privateGoal] }
    : { kind, intentId });
}

/** @param {string} observerId @param {string} subjectId @param {Record<string, unknown>} worldState @param {unknown} subjectItem */
function observedCounterpartStrength(observerId, subjectId, worldState, subjectItem) {
  const resolved = belief(observerId, subjectId, worldState);
  if (resolved.source === 'unknown') return null;
  if (resolved.source === 'belief') return strengthOfBand(resolved.record.strengthBand);
  const defense = defenseLedger(
    /** @type {Parameters<typeof defenseLedger>[0]} */ (settlementOf(subjectItem)),
  );
  return defense.present ? clamp01(defense.military / 100) : null;
}

/**
 * Freeze a scalar-free two-subject picture when a deployment first gains a
 * physical transit row.  Missing readings stay omitted so the picture schema
 * writes `unknown`; an ongoing row is never rebuilt from live truth.
 */
function createArmyCommandPicture({ snapshot, worldState, graph, record, deployment, tick, books }) {
  const armyId = String(record.armyId);
  const targetId = String(record.destId);
  const sinceTick = Number(deployment.sinceTick);
  const relationshipKey = relationshipKeyForPair(graph || asObject(snapshot).regionalGraph, armyId, targetId);
  if (!relationshipKey || !Number.isInteger(sinceTick) || sinceTick < 0) return null;
  const ownItem = snapshotItem(snapshot, armyId);
  const targetItem = snapshotItem(snapshot, targetId);
  const ownDefense = defenseLedger(
    /** @type {Parameters<typeof defenseLedger>[0]} */ (settlementOf(ownItem)),
  );
  const liveStrength = typeof deployment.currentEffectiveStrength === 'number'
    && Number.isFinite(deployment.currentEffectiveStrength)
    ? clamp01(deployment.currentEffectiveStrength / 100)
    : ownDefense.present ? clamp01(ownDefense.military / 100) : null;
  const liveStores = typeof deployment.supplyIntegrity === 'number'
    && Number.isFinite(deployment.supplyIntegrity)
    ? clamp01(deployment.supplyIntegrity)
    : typeof deployment.foodReserve === 'number' && Number.isFinite(deployment.foodReserve)
      ? clamp01(deployment.foodReserve)
      : null;
  const exhaustionLedger = asObject(worldState.warExhaustion);
  const exhaustion = Object.prototype.hasOwnProperty.call(exhaustionLedger, armyId)
    && typeof exhaustionLedger[armyId] === 'number' && Number.isFinite(exhaustionLedger[armyId])
    ? clamp01(Number(exhaustionLedger[armyId]))
    : null;
  const counterpartStrength = observedCounterpartStrength(armyId, targetId, worldState, targetItem);
  const ownExports = exportPictureOf(ownItem);
  const ownSubject = {
    settlementId: armyId,
    ...(liveStrength == null ? {} : { strengthBand: negotiationStrengthBand(liveStrength) }),
    ...(liveStores == null ? {} : { storesBand: storesBand(liveStores) }),
    threatBand: 'pressing',
    ...(exhaustion == null ? {} : { warExhaustionBand: pressureBand(exhaustion) }),
    governingArchetype: governingArchetypeOf(ownItem),
    alignmentPressBand: alignmentPressBand(books),
    ...ownExports,
  };
  const targetSubject = {
    settlementId: targetId,
    ...(counterpartStrength == null ? {} : { strengthBand: negotiationStrengthBand(counterpartStrength) }),
  };
  const episodeKey = armyNegotiationEpisodeKey({
    relationshipKey,
    offererId: armyId,
    targetId,
    frontOwnerId: armyId,
    frontSinceTick: sinceTick,
  });
  const authority = text(books.authoritySignature);
  return createNegotiationPicture({
    id: `army_picture:${stableParts([armyId, targetId, sinceTick])}`,
    carrier: { kind: 'army', id: armyId },
    partyId: armyId,
    counterpartId: targetId,
    relationshipKey,
    episodeKey,
    frontOwnerId: armyId,
    frontSinceTick: sinceTick,
    capturedTick: tick,
    causeStatus: deployment.recalled ? 'dissolved' : 'live',
    subjects: [ownSubject, targetSubject],
    evidenceIds: authority ? [`hall:${stableParts([armyId, authority, sinceTick])}`] : [],
  });
}

/**
 * Re-address an existing frozen column picture to one exact travelling offer.
 * The adapter copies only the already-frozen qualitative subjects and names the
 * source picture as its evidence.  It reads no snapshot, belief, court, front,
 * holding, road, or current strength, so orientation repair cannot become a
 * disguised live-truth refresh.
 *
 * @param {unknown} record
 * @param {{relationshipKey?:unknown, offererId?:unknown, targetId?:unknown,
 *   frontOwnerId?:unknown, frontSinceTick?:unknown, adaptedTick?:number}} [args]
 */
export function adaptArmyCommandPictureToEnvoyEpisode(record, {
  relationshipKey,
  offererId,
  targetId,
  frontOwnerId,
  frontSinceTick,
  adaptedTick,
} = {}) {
  const row = armyRecordOf(record);
  const picture = normalizeNegotiationPicture(row?.commandPicture);
  const relationship = text(relationshipKey);
  const offerer = text(offererId);
  const target = text(targetId);
  const owner = text(frontOwnerId);
  const since = Number(frontSinceTick);
  const at = Number(adaptedTick);
  const episodeKey = armyNegotiationEpisodeKey({
    relationshipKey: relationship,
    offererId: offerer,
    targetId: target,
    frontOwnerId: owner,
    frontSinceTick: since,
  });
  if (!row || !picture || !episodeKey || relationship !== picture.relationshipKey
    || JSON.stringify([offerer, target].sort(codepoint))
      !== JSON.stringify([String(picture.partyId), String(picture.counterpartId)].sort(codepoint))
    || picture.partyId !== row.originId || picture.counterpartId !== row.destId
    || !Number.isInteger(at) || at < Number(picture.lastChangedTick) || at < since) return null;
  if (picture.episodeKey === episodeKey
    && picture.frontOwnerId === owner
    && Number(picture.frontSinceTick) === since) return picture;
  return createNegotiationPicture({
    id: `army_picture_adapter:${stableParts([picture.id, episodeKey, at])}`,
    carrier: { ...asObject(picture.carrier) },
    partyId: picture.partyId,
    counterpartId: picture.counterpartId,
    relationshipKey: relationship,
    episodeKey,
    frontOwnerId: owner,
    frontSinceTick: since,
    capturedTick: at,
    causeStatus: picture.causeStatus,
    subjects: /** @type {Array<Record<string, unknown>>} */ (picture.subjects)
      .map((subject) => ({ ...asObject(subject), exports: [.../** @type {string[]} */ (asObject(subject).exports)] })),
    evidenceIds: [String(picture.id)],
  });
}

/**
 * Apply one battle/hall observation to a column picture.  The requested
 * direction is converted to exactly one adjacent closed rung; duplicate source,
 * stale clock, unknown starting band, or malformed picture returns the original
 * record reference.
 *
 * @param {unknown} record
 * @param {{sourceId?:unknown, kind?:string, tick?:number, subjectId?:unknown,
 *   field?:string, direction?:string}} [args]
 */
export function applyArmyCommandPictureEvidence(record, {
  sourceId,
  kind,
  tick,
  subjectId,
  field,
  direction,
} = {}) {
  const picture = normalizeNegotiationPicture(asObject(record).commandPicture);
  const source = text(sourceId);
  const subject = text(subjectId);
  const fieldName = text(field);
  const move = text(direction);
  const at = Number(tick);
  const ladder = NEGOTIATION_SUBJECT_BANDS[fieldName];
  const currentSubject = picture && Array.isArray(picture.subjects)
    ? picture.subjects.find((row) => asObject(row).settlementId === subject)
    : null;
  const fromBand = currentSubject ? text(asObject(currentSubject)[fieldName]) : '';
  const fromIndex = ladder ? ladder.indexOf(fromBand) : -1;
  const delta = move === 'rise' ? 1 : move === 'fall' ? -1 : 0;
  const toIndex = fromIndex + delta;
  if (!picture || !source || !subject || !['battle', 'hall'].includes(kind)
    || !Number.isInteger(at) || at < 0 || !ladder || fromBand === 'unknown'
    || !delta || fromIndex < 0 || toIndex < 0 || toIndex >= ladder.length) return record;
  const nextPicture = applyNegotiationPictureMutation(picture, {
    id: `army_picture_mutation:${stableParts([picture.id, source, subject, fieldName])}`,
    pictureId: picture.id,
    episodeKey: picture.episodeKey,
    sourceId: source,
    kind,
    tick: at,
    subjectId: subject,
    field: fieldName,
    fromBand,
    toBand: ladder[toIndex],
    direction: move,
  });
  return nextPicture === picture ? record : { ...asObject(record), commandPicture: nextPicture };
}

/** @param {ArmyTransitRecord} record @param {number} tick @param {{venueRef?:unknown}} [options] */
export function projectArmyForEnvoyEncounter(record, tick, { venueRef = null } = {}) {
  const normalized = armyRecordOf(record);
  const at = Number(tick);
  if (!normalized || !Number.isInteger(at) || at < 0) return null;
  const projected = stepArmyPosition(normalized, at);
  const nodeId = currentRegion(projected);
  if (!nodeId || !projected.armyId || !projected.originId || !projected.destId
    || projected.originId === projected.destId) return null;
  const intent = normalizeArmyEnvoyIntent(projected.envoyIntent);
  const venue = asObject(venueRef);
  const venueId = text(venue.id);
  const venueKind = text(venue.kind);
  const exactVenue = venueId === nodeId && ENCOUNTER_VENUE_KINDS.has(venueKind)
    ? { id: venueId, kind: venueKind }
    : null;
  return {
    armyId: projected.armyId,
    actorId: projected.originId,
    targetId: projected.destId,
    nodeId,
    projectedTick: at,
    projectionPhase: ARMY_ENCOUNTER_PROJECTION_PHASE,
    routeId: armyRouteId(projected.armyId, projected.departTick, projected.arrivalTick, projected.path),
    ...(exactVenue ? { venueRef: exactVenue } : {}),
    ...(intent ? { intent } : {}),
  };
}

/**
 * Project every column from one read cut.  This function never calls the writer;
 * the ordinary later army pass still advances each row exactly once.
 */
export function projectArmiesForEnvoyEncounters(worldState, tick, { venueRefFor = null } = {}) {
  if (!envoyDiplomacyActive(worldState)) return [];
  const ledger = armyTransitLedger(worldState) || {};
  return Object.keys(ledger).sort(codepoint).map((armyId) => {
    const row = ledger[armyId];
    const projected = projectArmyForEnvoyEncounter(row, tick, {
      venueRef: typeof venueRefFor === 'function'
        ? venueRefFor(currentRegion(stepArmyPosition(row, tick)), row)
        : null,
    });
    return projected;
  }).filter(Boolean);
}

/**
 * Build the collision hostility predicate. TWO in-transit armies are hostile
 * combatants when each is marching against the OTHER's home (A.dest === B.origin OR
 * B.dest === A.origin) — the two-power border war whose columns cross. (Richer
 * factional hostility is M9.) Co-besiegers of the SAME target are ALLIES (never a
 * self-battle).
 *
 * W-CONVERGENCE INTERCEPT (design §3/§4): the optional `contestSideOf` lookup extends
 * the predicate with "opposing sides of the SAME internal contest" — an interceptor
 * moves against a column bound for a coup it opposes. ABSENT the lookup (the aspatial /
 * dormant caller — detectCollisions passes only `records`) the predicate is UNCHANGED
 * ⇒ byte-identical (the intervener-vs-intervener aspatial case resolves directly via
 * resolveFieldBattle in convergence.js; this seam is the spatial column-collision path).
 * @param {Record<string, ArmyTransitRecord>} records
 * @param {((armyId: string) => { contest: string, side: string } | null) | null} [contestSideOf]
 * @returns {(aId: string, bId: string) => boolean}
 */
function hostilePairFor(records, contestSideOf = null) {
  return (/** @type {string} */ aId, /** @type {string} */ bId) => {
    if (aId === bId) return false;
    const a = records[aId];
    const b = records[bId];
    if (!a || !b) return false;
    // A RETREATING column is not seeking battle — it is routing home mauled. Exclude it
    // (spatial-engine-3) so a beaten pair fights ONCE per encounter, never battle-per-tick.
    if (a.role === ARMY_ROLES.RETREAT || b.role === ARMY_ROLES.RETREAT) return false;
    if (a.destId === b.originId || b.destId === a.originId) return true;
    // INTERCEPT: opposing sides of the same contest cross swords before the walls.
    if (typeof contestSideOf === 'function') {
      const ca = contestSideOf(aId);
      const cb = contestSideOf(bId);
      if (ca && cb && ca.contest === cb.contest && ca.side !== cb.side) return true;
    }
    return false;
  };
}

// Exported for the convergence INTERCEPT pin (the seam is byte-identical without the
// contestSideOf lookup — the existing detectCollisions caller passes only `records`).
export { hostilePairFor };

/**
 * The effective-strength inputs for a transit record at a field battle: fatigue rises
 * with march progress; ground advantage falls with it (an army early in its march is
 * near home ground). @param {ArmyTransitRecord} rec
 * @returns {{ armyId: string, size: number, readiness: number, supplyQuality: number, funding: number, groundAdvantage01: number, fatigue01: number }}
 */
function battleInputs(rec) {
  return {
    armyId: rec.armyId,
    size: rec.strength,
    readiness: rec.readiness,
    supplyQuality: rec.supplyQuality,
    funding: rec.funding,
    groundAdvantage01: clamp01(1 - rec.position01),
    fatigue01: rec.position01,
  };
}

/**
 * A field-battle wizard-news entry (house voice, AGGREGATE — no npc named as a
 * casualty). Deterministic id from the sorted pair + tick. When `blind` is set (the
 * courier umbilical fog crossed FOUGHT_BLIND_FOG for a combatant — spatial-engine-4), a
 * "fought half-blind" receipt is stamped: the mis-assessment is the DM-legible CAUSE
 * while the true strengths still resolved the outcome (the physics are real).
 * @param {{ winnerId: string, loserId: string, region: string }} battle
 * @param {Snapshot} snapshot @param {number} tick @param {string|null} now
 * @param {number} loserBefore @param {number} loserAfter
 * @param {{ blind?: boolean, loserFog?: number, loserBelievedFoe?: number }} [fog]
 * @returns {Record<string, unknown>}
 */
function fieldBattleNews(battle, snapshot, tick, now, loserBefore, loserAfter, fog = {}) {
  const winner = nameOf(snapshot, battle.winnerId);
  const loser = nameOf(snapshot, battle.loserId);
  const lost = Math.max(0, Math.round(loserBefore - loserAfter));
  const pair = [battle.winnerId, battle.loserId].sort();
  const reasons = [`A crossing-path collision in ${nameOf(snapshot, battle.region)}'s approaches.`];
  if (fog.blind) {
    reasons.push(`${loser} fought half-blind — its couriers home were cut, so it mis-read the enemy's strength (believed ~${formatCount(Math.max(0, Math.round(Number(fog.loserBelievedFoe) || 0)))}).`);
  }
  return {
    id: `wizard_news.${tick}.field_battle.${pair[0]}.${pair[1]}`,
    tick,
    scope: 'regional',
    significance: 'notable',
    score: 62,
    headline: `${winner}'s army breaks ${loser}'s in the field`,
    summary: `The marching hosts of ${winner} and ${loser} met between settlements. ${winner} held the field; ${loser}'s column falls back mauled${lost > 0 ? ` (${formatCount(lost)} strength lost)` : ''} to regroup.`,
    kind: 'applied',
    impactKind: 'field_battle',
    channelType: null,
    severity: 0.55,
    settlementIds: [battle.winnerId, battle.loserId],
    impactIds: [],
    channelIds: [],
    sourceEventId: `field_battle.${pair[0]}.${pair[1]}.${tick}`,
    tags: fog.blind ? ['world_pulse', 'war', 'field_battle', 'fought_blind'] : ['world_pulse', 'war', 'field_battle'],
    reasons,
    createdAt: now,
  };
}

/**
 * Advance the army-transit layer one tick: derive/advance transit records from the
 * live deployments, resolve crossing-path field battles (bounded), advance the courier
 * umbilical, persist the ledger, and write mauled strengths back onto the deployments.
 * DORMANT (no marker) ⇒ { worldState, changed:false, newsEntries:[] } — byte-identical.
 *
 * @param {Object} args
 * @param {Snapshot} args.snapshot
 * @param {Record<string, unknown> & { spatialCanonVersion?: unknown, deployments?: Record<string, DeploymentRecord>, spatialLedgers?: unknown }} args.worldState
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {Graph|null|undefined} args.graph
 * @param {Rng|null|undefined} args.rng
 * @param {string|null} [args.season]
 * @param {number} args.tick
 * @param {string|null} [args.now]
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, newsEntries: Array<Record<string, unknown>> }}
 */
export function advanceArmyTransit({ snapshot, worldState, digest, graph, rng, season = null, tick, now = null }) {
  if (!armyTransitActive(worldState) || !digest) {
    return { worldState, changed: false, newsEntries: [] };
  }
  const nowTick = Math.max(0, Math.floor(num(tick, 0)));
  const deployments = /** @type {Record<string, DeploymentRecord>} */ (worldState.deployments && typeof worldState.deployments === 'object' ? worldState.deployments : {});
  const rawPrior = asObject(getSpatialLedger(worldState, 'armyTransit'));
  const prior = armyTransitLedger(worldState) || {};
  const umbilicalActive = beliefsActive(worldState);
  const envoyLayerActive = envoyDiplomacyActive(worldState);

  // ── DERIVE + ADVANCE: one transit record per committed deployment (army). ──────
  /** @type {Record<string, ArmyTransitRecord>} */
  const records = {};
  for (const armyId of Object.keys(deployments).sort()) {
    const dep = deployments[armyId];
    const targetId = dep && dep.targetId != null ? String(dep.targetId) : '';
    if (!targetId) continue;
    const priorRec = prior[armyId] || null;
    const rawPriorRec = asObject(rawPrior[armyId]);
    const readiness = clamp01(num(dep.readiness, 0.5));
    const strength = Math.max(0, num(dep.currentEffectiveStrength, 0));
    const supplyQuality = clamp01(num(dep.supplyIntegrity, num(dep.deployedQuality, 1)));
    const funding = fundingOf(snapshot, armyId);
    const books = envoyLayerActive
      ? readWarSeatBooks({ worldState, snapshot, actorId: armyId, opponentId: targetId })
      : null;
    const rawPriorHasIntent = Object.prototype.hasOwnProperty.call(rawPriorRec, 'envoyIntent');
    const normalizedPriorIntent = rawPriorHasIntent
      ? normalizeArmyEnvoyIntent(rawPriorRec.envoyIntent)
      : null;
    let authoredIntent;
    if (Object.prototype.hasOwnProperty.call(dep || {}, 'envoyIntent')) authoredIntent = dep.envoyIntent;
    else if (rawPriorHasIntent && !normalizedPriorIntent) authoredIntent = rawPriorRec.envoyIntent;
    else if (normalizedPriorIntent?.privateGoals?.[0] === 'plant') authoredIntent = normalizedPriorIntent;
    const envoyIntent = envoyLayerActive
      ? deriveArmyEnvoyIntent({
        armyId,
        targetId,
        frontSinceTick: dep.sinceTick,
        books,
        ...(authoredIntent === undefined ? {} : { authoredIntent }),
      })
      : null;
    // A NEW campaign (no prior record, or the prior aimed elsewhere) seeds a march.
    if (!priorRec || priorRec.destId !== targetId || priorRec.originId !== String(armyId)) {
      const plan = planMarch(digest, worldState, armyId, targetId, readiness, null, num(dep.sinceTick, nowTick), season);
      if (!plan) continue; // unreachable/unmapped — no transit (the aspatial war layer still runs)
      const seedCore = {
        armyId, role: ARMY_ROLES.MARCH, originId: String(armyId), destId: targetId,
        path: plan.path, departTick: plan.departTick, arrivalTick: plan.arrivalTick,
        position01: 0, strength, readiness, supplyQuality, funding,
        beliefStaleness: 0, lastTick: nowTick,
      };
      const commandPicture = envoyLayerActive
        ? createArmyCommandPicture({
          snapshot,
          worldState,
          graph,
          record: seedCore,
          deployment: dep,
          tick: nowTick,
          books: asObject(books),
        })
        : null;
      const seeded = armyRecordOf({
        ...seedCore,
        ...(commandPicture ? { commandPicture } : {}),
        ...(envoyIntent ? { envoyIntent } : {}),
      });
      if (seeded) records[armyId] = stepArmyPosition(seeded, nowTick);
      continue;
    }
    // ONGOING: advance the position, refresh the live strength/quality/funding, and
    // re-role a still-marching column as a reinforcement (it rides the SAME ledger).
    let commandPicture = null;
    let carriedTermSheet = null;
    let interceptionDecision = null;
    if (envoyLayerActive) {
      if (Object.prototype.hasOwnProperty.call(rawPriorRec, 'commandPicture')) {
        commandPicture = normalizeNegotiationPicture(priorRec.commandPicture);
      } else {
        commandPicture = createArmyCommandPicture({
          snapshot,
          worldState,
          graph,
          record: priorRec,
          deployment: dep,
          tick: nowTick,
          books: asObject(books),
        });
      }
      carriedTermSheet = priorRec.carriedTermSheet == null
        ? null
        : normalizeParlayTermSheet(priorRec.carriedTermSheet);
      interceptionDecision = priorRec.interceptionDecision == null
        ? null
        : normalizeArmyInterceptionDecision(priorRec.interceptionDecision);
      const validCarryPair = interceptionDecision?.kind === 'carry_terms' && carriedTermSheet && interceptionDecision.termSheetId === carriedTermSheet.id;
      if (carriedTermSheet && !validCarryPair) carriedTermSheet = null;
      if (interceptionDecision?.kind === 'carry_terms' && !validCarryPair) interceptionDecision = null;
    }
    const activePrior = envoyLayerActive
      ? (() => {
        const { commandPicture: _commandPicture, envoyIntent: _envoyIntent, carriedTermSheet: _carriedTermSheet, interceptionDecision: _interceptionDecision, ...core } = priorRec;
        return {
          ...core,
          ...(commandPicture ? { commandPicture } : {}),
          ...(envoyIntent ? { envoyIntent } : {}),
          ...(carriedTermSheet ? { carriedTermSheet } : {}),
          ...(interceptionDecision ? { interceptionDecision } : {}),
        };
      })()
      : priorRec;
    const advanced = stepArmyPosition({ ...activePrior, strength, readiness, supplyQuality, funding }, nowTick);
    const arrived = hasArrived(advanced, nowTick);
    records[armyId] = { ...advanced, role: arrived ? ARMY_ROLES.MARCH : ARMY_ROLES.REINFORCEMENT };
  }

  // ── COURIER UMBILICAL: staleness grows while the route home is cut (home besieged).
  for (const armyId of Object.keys(records)) {
    const rec = records[armyId];
    const routeCut = warFrontsInto(graph || {}, rec.originId).length > 0;
    records[armyId] = { ...rec, beliefStaleness: stepBeliefStaleness(rec.beliefStaleness, routeCut, umbilicalActive) };
  }

  // ── COLLISIONS → FIELD BATTLES (O(armies²), bounded). Armies are FEW (one per
  // settlement, the belief-envelope 5–30); past the design bound (assertArmyBound) the
  // O(n²) scan is SKIPPED rather than run (the ledger still persists, positions
  // advanced) — a graceful degrade, never a blow-up. ────────────────────────────────
  const armyCount = Object.keys(records).length;
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  const collisions = assertArmyBound(armyCount) ? detectCollisions(records, hostilePairFor(records)) : [];
  /** @type {Record<string, number>} */
  const mauled = {}; // armyId → new strength (write-back to deployments)
  /** @type {Set<string>} armies that RETREATED this tick → their deployment withdraws next tick. */
  const retreated = new Set();
  for (const col of collisions) {
    const a = records[col.aId];
    const b = records[col.bId];
    if (!a || !b) continue;
    // spatial-engine-4: the umbilical fog degrades each army's READ of the OTHER's
    // strength (an info-starved column mis-assesses). The TRUE strengths still resolve
    // the battle (the physics are real, byte-exact); the fog is stamped as the DM-legible
    // CAUSE on the news receipt below — no longer write-only dead state.
    const aFog = umbilicalFog(a.beliefStaleness);
    const bFog = umbilicalFog(b.beliefStaleness);
    const result = resolveFieldBattle({ a: battleInputs(a), b: battleInputs(b), rng, tick: nowTick });
    const loserRec = result.loserId === a.armyId ? a : b;
    const foeRec = result.loserId === a.armyId ? b : a;
    const loserFog = result.loserId === a.armyId ? aFog : bFog;
    // The loser's fogged read of the enemy's strength (anchored on its own count when
    // its couriers are cut) — consumes staleAssessment; informational only.
    const loserBelievedFoe = staleAssessment(foeRec.strength, loserRec.strength, loserRec.beliefStaleness);
    const blind = aFog >= FOUGHT_BLIND_FOG || bFog >= FOUGHT_BLIND_FOG;
    const loserBefore = loserRec.strength;
    const loserAfter = result.strengthDelta[result.loserId];
    // Persist the mauled strengths onto the transit records AND queue the write-back.
    for (const id of [result.winnerId, result.loserId]) {
      const ns = result.strengthDelta[id];
      if (records[id] && Number.isFinite(ns)) {
        records[id] = { ...records[id], strength: ns };
        mauled[id] = ns;
      }
    }
    // WR-7b: one battle is one exact observation source in each column's own
    // frozen picture.  The victor marks the foe down one rung; the beaten column
    // marks the foe up one.  Unknown remains unknown and duplicate same-tick
    // collision evidence is rejected by the picture writer.
    if (envoyLayerActive) {
      const pair = [result.winnerId, result.loserId].sort(codepoint);
      const sourceId = `field_battle:${stableParts([pair[0], pair[1], nowTick])}`;
      const winner = records[result.winnerId];
      const loser = records[result.loserId];
      if (winner) {
        records[result.winnerId] = /** @type {ArmyTransitRecord} */ (applyArmyCommandPictureEvidence(winner, {
          sourceId,
          kind: 'battle',
          tick: nowTick,
          subjectId: result.loserId,
          field: 'strengthBand',
          direction: 'fall',
        }));
      }
      if (loser) {
        records[result.loserId] = /** @type {ArmyTransitRecord} */ (applyArmyCommandPictureEvidence(loser, {
          sourceId,
          kind: 'battle',
          tick: nowTick,
          subjectId: result.winnerId,
          field: 'strengthBand',
          direction: 'rise',
        }));
      }
    }
    // spatial-engine-3: the loser RETREATS home mauled (the M5 spec) instead of grinding
    // on toward its objective and re-fighting the same pair every tick. Re-plan its
    // transit record as a RETREAT routed HOME by the M1 danger re-score (retreatRoute),
    // and flag its deployment for withdrawal — next tick the war layer executes the
    // recall through the SAME resolvedDeployments → deploymentReturn homecoming a
    // feasibility-collapse uses, so the beaten army leaves the field (no phantom siege).
    const beaten = records[result.loserId];
    if (beaten && deployments[result.loserId]) {
      const from = currentRegion(beaten);
      const homeId = beaten.originId;
      const scored = (from && homeId) ? retreatRoute(digest, worldState, from, homeId, null, season) : null;
      if (scored && Array.isArray(scored.path) && scored.path.length) {
        const base = hopWeeks(digest, from, homeId, season);
        const weeks = Number.isFinite(base) ? Math.max(1, armyMarchWeeks(Number(base), beaten.readiness)) : 1;
        const retreatRec = armyRecordOf({
          ...beaten,
          role: ARMY_ROLES.RETREAT,
          originId: homeId,
          destId: homeId,
          path: scored.path.map(String),
          departTick: nowTick,
          arrivalTick: nowTick + weeks,
          position01: 0,
          lastTick: nowTick,
        });
        if (retreatRec) {
          records[result.loserId] = retreatRec;
          retreated.add(result.loserId);
        }
      }
    }
    newsEntries.push(fieldBattleNews(
      { winnerId: result.winnerId, loserId: result.loserId, region: col.region },
      snapshot, nowTick, now, loserBefore, loserAfter,
      { blind, loserFog, loserBelievedFoe },
    ));
  }

  // ── PERSIST. Drop the whole ledger when no army is afield (sparse → byte-safe). ─
  const nextOrNull = Object.keys(records).length ? records : null;
  const changedLedger = JSON.stringify(prior && Object.keys(prior).length ? prior : null) !== JSON.stringify(nextOrNull);
  let nextWorldState = worldState;
  if (changedLedger) {
    nextWorldState = nextOrNull
      ? setSpatialLedger(worldState, 'armyTransit', nextOrNull)
      : dropSpatialLedger(worldState, 'armyTransit');
  }
  // Write mauled strengths back onto the deployments (a battered army besieges weaker),
  // and flag every RETREATING loser's deployment for withdrawal (spatial-engine-3): the
  // war layer's recall pass (warDeployment.js) resolves a `recalled` deployment as a
  // homecoming next tick. An absent `recalled` stamp everywhere else ⇒ byte-identical.
  if (Object.keys(mauled).length || retreated.size) {
    /** @type {Record<string, DeploymentRecord>} */
    const nextDeployments = { ...deployments };
    for (const id of Object.keys(mauled)) {
      if (nextDeployments[id]) nextDeployments[id] = { ...nextDeployments[id], currentEffectiveStrength: mauled[id] };
    }
    for (const id of retreated) {
      if (nextDeployments[id]) nextDeployments[id] = { ...nextDeployments[id], recalled: { cause: 'field_battle_retreat', tick: nowTick } };
    }
    nextWorldState = { ...nextWorldState, deployments: nextDeployments };
  }
  const changed = changedLedger || Object.keys(mauled).length > 0 || retreated.size > 0;
  return { worldState: nextWorldState, changed, newsEntries };
}

/**
 * Canonicalize a row at an army-writer boundary.  The spatial leaf detaches
 * sidecars without importing the world-pulse schemas; this is where their exact
 * authorities are enforced before persistence or stale-row comparison.
 * @param {unknown} value
 * @returns {ArmyTransitRecord|null}
 */
function canonicalArmyWriterRecord(value) {
  const raw = asObject(value);
  const base = armyRecordOf(raw);
  if (!base) return null;
  const picture = raw.commandPicture == null ? null : normalizeNegotiationPicture(raw.commandPicture);
  const intent = raw.envoyIntent == null ? null : normalizeArmyEnvoyIntent(raw.envoyIntent);
  const sheet = raw.carriedTermSheet == null ? null : normalizeParlayTermSheet(raw.carriedTermSheet);
  const decision = raw.interceptionDecision == null
    ? null
    : normalizeArmyInterceptionDecision(raw.interceptionDecision);
  if ((raw.commandPicture != null && !picture)
    || (raw.envoyIntent != null && !intent)
    || (raw.carriedTermSheet != null && !sheet)
    || (raw.interceptionDecision != null && !decision)) return null;
  if ((sheet && (!decision || decision.kind !== 'carry_terms' || decision.termSheetId !== sheet.id))
    || (decision?.kind === 'carry_terms' && (!sheet || decision.termSheetId !== sheet.id))) return null;
  if (picture && (asObject(picture.carrier).kind !== 'army'
    || asObject(picture.carrier).id !== base.armyId
    || picture.partyId !== base.originId
    || picture.counterpartId !== base.destId)) return null;
  const {
    commandPicture: _commandPicture,
    envoyIntent: _envoyIntent,
    carriedTermSheet: _carriedTermSheet,
    interceptionDecision: _interceptionDecision,
    ...core
  } = base;
  return /** @type {ArmyTransitRecord} */ ({
    ...core,
    ...(picture ? { commandPicture: picture } : {}),
    ...(intent ? { envoyIntent: intent } : {}),
    ...(sheet ? { carriedTermSheet: sheet } : {}),
    ...(decision ? { interceptionDecision: decision } : {}),
  });
}

/** @param {unknown} left @param {unknown} right */
function sameCanonicalRow(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

/**
 * Sole aggregate-column writer for a deliberately prepared encounter intent.
 * This is chiefly the exact-target plant seam: ordinary intent is derived from
 * court books during the normal army pass, while an information commission must
 * name a lineage and one real envoy before it can become eligible.
 * @param {{worldState?:Record<string,unknown>, armyId?:unknown, expectedRecord?:unknown,
 *   intent?:unknown}} [args]
 */
export function applyArmyEnvoyIntent({ worldState, armyId, expectedRecord, intent } = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, record: null, reason: 'dark' };
  }
  const id = text(String(armyId ?? ''));
  const rawLedger = asObject(getSpatialLedger(worldState, 'armyTransit'));
  const current = canonicalArmyWriterRecord(rawLedger[id]);
  const expected = canonicalArmyWriterRecord(expectedRecord);
  const normalizedIntent = normalizeArmyEnvoyIntent(intent);
  if (!id || !current || current.armyId !== id || !expected || !normalizedIntent) {
    return { worldState, changed: false, record: current, reason: 'invalid_authority' };
  }
  if (!sameCanonicalRow(current, expected)) {
    return { worldState, changed: false, record: current, reason: 'stale_record' };
  }
  if (sameCanonicalRow(current.envoyIntent, normalizedIntent)) {
    return { worldState, changed: false, record: current, reason: 'duplicate' };
  }
  const nextRecord = canonicalArmyWriterRecord({ ...current, envoyIntent: normalizedIntent });
  if (!nextRecord) return { worldState, changed: false, record: current, reason: 'invalid_result' };
  const nextWorldState = setSpatialLedger(worldState, 'armyTransit', {
    ...rawLedger,
    [id]: nextRecord,
  });
  return { worldState: nextWorldState, changed: true, record: nextRecord, reason: 'applied' };
}

/**
 * Apply the interceptor dilemma with full-row optimistic authority.  Carrying
 * exact terms is permitted only if the existing deployment recall writer accepts
 * a real withdrawal order; holding the mission changes no position or mission
 * field.  Neither arm drafts, merges, values, or materializes the sheet.
 * @param {{worldState?:Record<string,unknown>, armyId?:unknown, expectedRecord?:unknown,
 *   decision?:unknown, tick?:number}} [args]
 */
export function applyEnvoyInterceptionDecision({
  worldState,
  armyId,
  expectedRecord,
  decision,
  tick,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, record: null, reason: 'dark' };
  }
  const id = text(String(armyId ?? ''));
  const at = Number(tick);
  const rawLedger = asObject(getSpatialLedger(worldState, 'armyTransit'));
  const current = canonicalArmyWriterRecord(rawLedger[id]);
  const expected = canonicalArmyWriterRecord(expectedRecord);
  const authored = asObject(decision);
  const kind = text(authored.kind);
  const encounterId = text(authored.encounterId);
  const errandId = text(authored.errandId);
  const hasAuthoredId = Object.prototype.hasOwnProperty.call(authored, 'id');
  const authoredId = authored.id == null ? '' : text(authored.id);
  const hasSheet = Object.prototype.hasOwnProperty.call(authored, 'termSheet');
  const allowedKeys = new Set(['id', 'kind', 'encounterId', 'errandId', 'termSheet']);
  const unknownKey = Object.keys(authored).some((key) => !allowedKeys.has(key));
  const termSheet = hasSheet ? normalizeParlayTermSheet(authored.termSheet) : null;
  if (!id || !Number.isInteger(at) || at < 0 || !current || current.armyId !== id
    || !expected || !['carry_terms', 'hold_mission'].includes(kind)
    || !encounterId || !errandId || unknownKey || (hasAuthoredId && !authoredId)
    || (hasSheet && !termSheet) || (kind === 'carry_terms' && !termSheet)
    || (termSheet && (termSheet.encounterId !== encounterId || termSheet.errandId !== errandId
      || Number(termSheet.agreedTick) > at))) {
    return { worldState, changed: false, record: current, reason: 'invalid_authority' };
  }
  if (!sameCanonicalRow(current, expected)) {
    return { worldState, changed: false, record: current, reason: 'stale_record' };
  }
  const persistedDecision = normalizeArmyInterceptionDecision({
    schemaVersion: ARMY_INTERCEPTION_DECISION_SCHEMA_VERSION,
    id: authoredId || `army_interception_decision:${stableParts([id, encounterId, errandId, kind, at])}`,
    kind,
    tick: at,
    encounterId,
    errandId,
    ...(termSheet ? { termSheetId: termSheet.id } : {}),
  });
  if (!persistedDecision) {
    return { worldState, changed: false, record: current, reason: 'invalid_decision' };
  }
  if (current.interceptionDecision) {
    const duplicate = sameCanonicalRow(current.interceptionDecision, persistedDecision)
      && (kind !== 'carry_terms' || sameCanonicalRow(current.carriedTermSheet, termSheet));
    return { worldState, changed: false, record: current, reason: duplicate ? 'duplicate' : 'already_decided' };
  }
  if (kind === 'carry_terms' && current.carriedTermSheet) {
    return { worldState, changed: false, record: current, reason: 'already_carrying_terms' };
  }

  let recalledWorld = worldState;
  if (kind === 'carry_terms') {
    recalledWorld = stampDeploymentRecall(
      worldState,
      current.originId,
      current.destId,
      'envoy_terms_carried_home',
      at,
    );
    if (recalledWorld === worldState) {
      return { worldState, changed: false, record: current, reason: 'recall_unavailable' };
    }
  }
  const nextRecord = canonicalArmyWriterRecord({
    ...current,
    interceptionDecision: persistedDecision,
    ...(termSheet && kind === 'carry_terms' ? { carriedTermSheet: termSheet } : {}),
  });
  if (!nextRecord) return { worldState, changed: false, record: current, reason: 'invalid_result' };
  const nextWorldState = setSpatialLedger(recalledWorld, 'armyTransit', {
    ...rawLedger,
    [id]: nextRecord,
  });
  return { worldState: nextWorldState, changed: true, record: nextRecord, reason: 'applied' };
}
