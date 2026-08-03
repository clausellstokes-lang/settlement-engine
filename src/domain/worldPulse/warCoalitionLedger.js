/**
 * WR-6 coalition persistence law.
 *
 * The only deployment addition is one closed join anchor in `joinLedger`.
 * No membership list and no stored expenditure total is permitted here.
 */

import { getSpatialLedger } from '../spatial/distanceRead.js';
import { isWarReasonType } from './warReasonTaxonomy.js';
import { allianceRowForAnchor, canonicalAllianceRows } from './warCoalitionGraph.js';

export const COALITION_JOIN_CAUSE = 'alliance_obligation';
export const COALITION_CALL_ARCHIVE_CAP = 24;

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** Exact activation: every constituent law must be explicitly lit. */
export function warCoalitionActive(worldStateOrRules) {
  const root = asObject(worldStateOrRules);
  const rules = Object.keys(asObject(root.simulationRules)).length ? asObject(root.simulationRules) : root;
  return rules.warLayerEnabled === true
    && rules.warTerminationEnabled === true
    && rules.peaceEngineEnabled === true
    && rules.coalitionLedgerEnabled === true;
}

/** Stable identity for one caller/candidate/enemy deployment episode. */
export function coalitionCallIdFor({ callerId, partyId, enemyId, callerDeploymentSinceTick }) {
  return ['coalition_call', callerId, partyId, enemyId, Math.max(0, Math.floor(Number(callerDeploymentSinceTick) || 0))]
    .map(String).join('.');
}

/** Strictly sanitize the one closed join anchor. */
export function normalizeJoinAnchor(raw, deploymentPartyId = null, deploymentTargetId = null, deploymentSinceTick = null) {
  const row = asObject(raw);
  const strings = {};
  for (const key of [
    'callId', 'partyId', 'callerId', 'enemyId', 'originAttackerId',
    'allianceRelationshipKey',
  ]) {
    const value = typeof row[key] === 'string' ? row[key].trim() : '';
    if (!value) return null;
    strings[key] = value;
  }
  if (row.cause !== COALITION_JOIN_CAUSE) return null;
  const joinedTick = Number(row.joinedTick);
  const callerDeploymentSinceTick = Number(row.callerDeploymentSinceTick);
  const originSinceTick = Number(row.originSinceTick);
  if (![joinedTick, callerDeploymentSinceTick, originSinceTick]
    .every((value) => Number.isInteger(value) && value >= 0)) return null;
  const sourceCauseTypes = Array.isArray(row.sourceCauseTypes)
    ? [...new Set(row.sourceCauseTypes.map(String))]
      .filter((type) => isWarReasonType(type) && type !== COALITION_JOIN_CAUSE)
      .sort()
    : [];
  if (!sourceCauseTypes.length) return null;
  if (strings.partyId === strings.callerId || strings.partyId === strings.enemyId
    || strings.callerId === strings.enemyId) return null;
  if (deploymentPartyId != null && strings.partyId !== String(deploymentPartyId)) return null;
  if (deploymentTargetId != null && strings.enemyId !== String(deploymentTargetId)) return null;
  if (deploymentSinceTick != null && (!Number.isInteger(Number(deploymentSinceTick))
    || joinedTick !== Number(deploymentSinceTick))) return null;
  if (strings.originAttackerId !== strings.callerId && strings.originAttackerId !== strings.enemyId) return null;
  if (originSinceTick !== callerDeploymentSinceTick) return null;
  if (joinedTick < callerDeploymentSinceTick) return null;
  if (strings.callId !== coalitionCallIdFor({
    callerId: strings.callerId,
    partyId: strings.partyId,
    enemyId: strings.enemyId,
    callerDeploymentSinceTick,
  })) return null;
  return {
    callId: strings.callId,
    partyId: strings.partyId,
    callerId: strings.callerId,
    enemyId: strings.enemyId,
    joinedTick,
    callerDeploymentSinceTick,
    originAttackerId: strings.originAttackerId,
    originSinceTick,
    allianceRelationshipKey: strings.allianceRelationshipKey,
    sourceCauseTypes,
    cause: COALITION_JOIN_CAUSE,
  };
}

/** One record or none; malformed/multiple ledgers never become facts. */
export function joinAnchorOf(deployment, partyId = null) {
  const row = asObject(deployment);
  if (!Array.isArray(row.joinLedger) || row.joinLedger.length !== 1
    || !Number.isInteger(Number(row.sinceTick)) || Number(row.sinceTick) < 0) return null;
  return normalizeJoinAnchor(row.joinLedger[0], partyId, row.targetId, row.sinceTick);
}

/**
 * The positive, independently-owned causes currently standing on one exact
 * deployment edge.  `alliance_obligation` is deliberately absent: it is the
 * borrowed permission to enter the war, never a reason the joined court owns.
 *
 * A supplied deployment is only a witness for the current persisted episode;
 * stale target/since rows cannot lend a later front their causes.  Any row that
 * claims coalition membership must also carry one valid closed join anchor.
 * Root callers may request `foundingOnly` to retain WR-6's stricter rule that a
 * coalition call remains grounded in a cause pinned when that root marched.
 *
 * @param {unknown} worldState
 * @param {unknown} partyId
 * @param {unknown} enemyId
 * @param {{deployment?:unknown,requireJoinAnchor?:boolean,foundingOnly?:boolean}} [options]
 * @returns {string[]}
 */
export function independentLiveWarCauseTypes(
  worldState,
  partyId,
  enemyId,
  { deployment = null, requireJoinAnchor = false, foundingOnly = false } = {},
) {
  const state = asObject(worldState);
  const party = typeof partyId === 'string' ? partyId.trim() : '';
  const enemy = typeof enemyId === 'string' ? enemyId.trim() : '';
  if (!party || !enemy || party === enemy) return [];

  const current = asObject(asObject(state.deployments)[party]);
  const witness = deployment == null ? current : asObject(deployment);
  const currentSince = Number(current.sinceTick);
  const witnessSince = Number(witness.sinceTick);
  if (!Object.keys(current).length
    || current.recalled != null
    || String(current.targetId || '') !== enemy
    || !Number.isInteger(currentSince) || currentSince < 0
    || String(witness.targetId || '') !== enemy
    || witnessSince !== currentSince) return [];

  const currentHasJoinClaim = Object.prototype.hasOwnProperty.call(current, 'joinLedger');
  const witnessHasJoinClaim = Object.prototype.hasOwnProperty.call(witness, 'joinLedger');
  const currentAnchor = joinAnchorOf(current, party);
  const witnessAnchor = joinAnchorOf(witness, party);
  if ((currentHasJoinClaim && !currentAnchor)
    || (witnessHasJoinClaim && !witnessAnchor)
    || (requireJoinAnchor && (!currentAnchor || !witnessAnchor))
    || (!!currentAnchor !== !!witnessAnchor)
    || (currentAnchor
      && JSON.stringify(currentAnchor) !== JSON.stringify(witnessAnchor))) return [];

  const ledger = asObject(getSpatialLedger(state, 'warReasons'));
  const reasons = asObject(asObject(ledger[`${party}>${enemy}`]).reasons);
  const positive = Object.keys(reasons)
    .filter((type) => isWarReasonType(type)
      && type !== COALITION_JOIN_CAUSE
      && Number(asObject(reasons[type]).score) > 0);
  if (!foundingOnly) return [...new Set(positive)].sort();

  const founding = new Set((Array.isArray(current.casusReasons) ? current.casusReasons : [])
    .map((row) => String(asObject(row).type || ''))
    .filter((type) => type && type !== COALITION_JOIN_CAUSE));
  return [...new Set(positive.filter((type) => founding.has(type)))].sort();
}

/**
 * Durable witness for the anchored coalition around one closing bilateral edge.
 * This pure read is deliberately homed below peaceTerms so the relationship
 * writer can preserve it at acceptance time, before a later war pass removes
 * the recalled deployment.
 *
 * @param {unknown} worldState
 * @param {unknown} aId
 * @param {unknown} bId
 * @param {unknown} tick
 * @param {unknown} [expectedDepartingId]
 * @returns {null|{departingId:string,enemyId:string,callerId:string,
 *   abandoned:string[],members:string[],joinAnchor?:Record<string,unknown>}}
 */
export function coalitionClosureWitness(worldState, aId, bId, tick, expectedDepartingId = null) {
  if (!warCoalitionActive(worldState)) return null;
  const state = asObject(worldState);
  const deployments = asObject(state.deployments);
  const numericTick = Number(tick);
  const now = Number.isFinite(numericTick)
    ? Math.max(0, Math.floor(numericTick))
    : Number.POSITIVE_INFINITY;
  const pair = [String(aId || ''), String(bId || '')];
  if (!pair[0] || !pair[1] || pair[0] === pair[1]) return null;
  const expected = typeof expectedDepartingId === 'string' ? expectedDepartingId.trim() : '';
  if (expected && !pair.includes(expected)) return null;
  const departingCandidates = expected ? [expected] : pair;
  const anchorAt = (deployment, partyId) => {
    const anchor = joinAnchorOf(deployment, partyId);
    return anchor && anchor.joinedTick <= now ? anchor : null;
  };
  /** @type {Array<{departingId:string,enemyId:string,callerId:string,
   * abandoned:string[],joinAnchor?:Record<string,unknown>}>} */
  const candidates = [];
  for (const departingId of departingCandidates) {
    const enemyId = departingId === pair[0] ? pair[1] : pair[0];
    const own = asObject(deployments[departingId]);
    const ownAnchor = String(own.targetId || '') === enemyId
      ? anchorAt(own, departingId)
      : null;
    if (ownAnchor) {
      const abandoned = Object.keys(deployments).sort().filter((memberId) => {
        if (memberId === departingId || memberId === enemyId) return false;
        const member = asObject(deployments[memberId]);
        if (memberId === ownAnchor.callerId) return String(member.targetId || '') === enemyId;
        const anchor = anchorAt(member, memberId);
        return !!anchor
          && String(member.targetId || '') === enemyId
          && anchor.callerId === ownAnchor.callerId
          && anchor.originSinceTick === ownAnchor.originSinceTick;
      });
      if (abandoned.length) candidates.push({
        departingId,
        enemyId,
        callerId: ownAnchor.callerId,
        abandoned,
        joinAnchor: ownAnchor,
      });
      continue;
    }
    const enemy = asObject(deployments[enemyId]);
    const ownSince = Number(own.sinceTick);
    const enemySince = Number(enemy.sinceTick);
    const offensiveRoot = String(own.targetId || '') === enemyId && Number.isInteger(ownSince);
    const defensiveRoot = String(enemy.targetId || '') === departingId && Number.isInteger(enemySince);
    if (!offensiveRoot && !defensiveRoot) continue;
    const originEpisodes = [
      ...(offensiveRoot ? [{ attackerId: departingId, sinceTick: ownSince }] : []),
      ...(defensiveRoot ? [{ attackerId: enemyId, sinceTick: enemySince }] : []),
    ];
    const abandoned = Object.keys(deployments).sort().filter((memberId) => {
      if (memberId === departingId || memberId === enemyId) return false;
      const member = asObject(deployments[memberId]);
      const anchor = anchorAt(member, memberId);
      return !!anchor
        && String(member.targetId || '') === enemyId
        && anchor.callerId === departingId
        && originEpisodes.some((episode) => (
          anchor.originAttackerId === episode.attackerId
          && anchor.originSinceTick === episode.sinceTick
        ));
    });
    if (abandoned.length) candidates.push({
      departingId,
      enemyId,
      callerId: departingId,
      abandoned,
    });
  }
  if (candidates.length !== 1) return null;
  const found = candidates[0];
  return { ...found, members: [found.departingId, ...found.abandoned].sort() };
}

/** Current directed war reasons without importing the war-reason mover back. */
function liveReasonTypes(worldState, fromId, toId) {
  const ledger = asObject(getSpatialLedger(worldState, 'warReasons'));
  const entry = asObject(ledger[`${fromId}>${toId}`]);
  const reasons = asObject(entry.reasons);
  return new Set(Object.keys(reasons).filter((type) => Number(asObject(reasons[type]).score) > 0));
}

/**
 * Exact anchor lifecycle.  The obligation lives only while the same caller/root
 * episode, the same enemy, at least one named founding cause, and the exact
 * bilateral alliance contract all survive.
 */
export function coalitionObligationRead({ worldState, snapshot, partyId, deployment }) {
  if (!warCoalitionActive(worldState)) return { active: false, reason: 'dark', anchor: null };
  const anchor = joinAnchorOf(deployment, String(partyId));
  if (!anchor) return { active: false, reason: 'anchor_invalid', anchor: null };
  const deployments = asObject(asObject(worldState).deployments);
  const root = asObject(deployments[anchor.originAttackerId]);
  const rootTargetId = anchor.originAttackerId === anchor.callerId
    ? anchor.enemyId
    : anchor.callerId;
  if (!Object.keys(root).length
    || root.recalled != null
    || Number(root.sinceTick) !== anchor.originSinceTick
    || String(root.targetId || '') !== rootTargetId
    || joinAnchorOf(root, anchor.originAttackerId)) {
    return { active: false, reason: 'origin_episode_dissolved', anchor };
  }
  const live = liveReasonTypes(worldState, anchor.originAttackerId, rootTargetId);
  if (!anchor.sourceCauseTypes.some((type) => live.has(type))) {
    return { active: false, reason: 'origin_cause_dissolved', anchor };
  }
  const rows = canonicalAllianceRows({ ...snapshot, worldState });
  if (!allianceRowForAnchor(rows, anchor)) {
    return { active: false, reason: 'alliance_broken', anchor };
  }
  return { active: true, reason: 'obligation_live', anchor };
}

/** War-side reason projection for the joining party. */
export function allianceObligationReason(worldState, snapshot, partyId, foeId) {
  const deployment = asObject(asObject(asObject(worldState).deployments)[String(partyId)]);
  if (String(deployment.targetId || '') !== String(foeId)) return { score: 0, receipt: '' };
  const read = coalitionObligationRead({ worldState, snapshot, partyId: String(partyId), deployment });
  return read.active
    ? { score: 1, receipt: 'A sworn ally remains in the field under the same living cause.' }
    : { score: 0, receipt: '' };
}

/** Peace-side mirror: a once-anchored obligation whose exact law has ended. */
export function obligationDischargedReason(worldState, snapshot, partyId, foeId) {
  if (!warCoalitionActive(worldState)) return { score: 0, receipt: '' };
  const deployment = asObject(asObject(asObject(worldState).deployments)[String(partyId)]);
  if (String(deployment.targetId || '') !== String(foeId) || !joinAnchorOf(deployment, String(partyId))) {
    return { score: 0, receipt: '' };
  }
  const read = coalitionObligationRead({ worldState, snapshot, partyId: String(partyId), deployment });
  if (read.active) return { score: 0, receipt: '' };
  // Rupture is not service rendered.  An alliance break may end the borrowed
  // war cause, but coalition_fracture/relationship memory owns that fact; the
  // positive mirror is reserved for an origin episode/cause ending while the
  // exact compact itself still survives.  Re-read the compact explicitly:
  // origin dissolution is tested before alliance topology in the obligation
  // reader, so simultaneous root closure + rupture must not inherit the
  // origin reason and masquerade as service rendered.
  if (!read.anchor || !allianceRowForAnchor(
    canonicalAllianceRows({ ...snapshot, worldState }),
    read.anchor,
  )) return { score: 0, receipt: '' };
  return { score: 1, receipt: 'The original quarrel that carried the alliance call has ended; no borrowed cause keeps this army in the field.' };
}

/** Read a relationship's bounded exact-once call archive. */
export function allianceCallsOf(state) {
  return Array.isArray(state?.allianceCalls)
    ? state.allianceCalls.slice(-COALITION_CALL_ARCHIVE_CAP)
    : [];
}

export function allianceCallWasDecided(state, callId, relationshipKey) {
  return allianceCallsOf(state).some((row) => String(row?.callId || '') === String(callId)
    && String(row?.relationshipKey || '') === String(relationshipKey));
}
