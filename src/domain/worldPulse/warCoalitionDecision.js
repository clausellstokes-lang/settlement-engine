/** WR-6 alliance-call census and bounded join/refusal decision. */

import { thresholdFactorOf } from './dispositionProfile.js';
import { readWarSeatBooks } from './warSeatBooks.js';
import { readAllianceWebRisk } from './warAllianceRisk.js';
import {
  alliesOf,
  canonicalAllianceRows,
} from './warCoalitionGraph.js';
import {
  ensureRelationshipState,
  getRelationshipSettlements,
  normalizeRelationshipEdge,
  relationshipKeyFromEdge,
} from './relationshipState.js';
import {
  allianceCallWasDecided,
  coalitionCallIdFor,
  joinAnchorOf,
  warCoalitionActive,
} from './warCoalitionLedger.js';
import { treatyEligibleWarTargets } from './warIntent.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
function codepoint(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function liveRootCauses(worldState, callerId, enemyId, deployment) {
  const ledger = asObject(asObject(worldState.spatialLedgers).warReasons);
  const reasons = asObject(asObject(ledger[`${callerId}>${enemyId}`]).reasons);
  return [...new Set((Array.isArray(deployment?.casusReasons) ? deployment.casusReasons : [])
    .map((row) => String(row?.type || ''))
    .filter((type) => type && type !== 'alliance_obligation' && Number(asObject(reasons[type]).score) > 0))]
    .sort(codepoint);
}

function truthRelationshipFor(snapshot, observerId, subjectId) {
  const edges = Array.isArray(snapshot?.regionalGraph?.edges) ? snapshot.regionalGraph.edges : [];
  const states = asObject(snapshot?.worldState?.relationshipStates);
  const matches = [];
  for (const raw of edges) {
    const edge = normalizeRelationshipEdge(raw);
    const { from, to } = getRelationshipSettlements(edge);
    const a = from != null ? String(from) : '';
    const b = to != null ? String(to) : '';
    if (!((a === observerId && b === subjectId) || (a === subjectId && b === observerId))) continue;
    const key = String(relationshipKeyFromEdge(raw));
    matches.push({ key, type: ensureRelationshipState(edge, asObject(states[key])).relationshipType });
  }
  matches.sort((a, b) => codepoint(a.key, b.key));
  return matches[0]?.type || 'neutral';
}

/**
 * One decision per otherwise-free ally.  Root deployments only may call; a
 * joined ally cannot recursively create a congress.  When several roots call
 * the same court, the strongest scored obligation wins, with call-id tiebreak.
 */
export function readCoalitionJoinDecisions({ snapshot, worldState, tick, strengthFor }) {
  if (!warCoalitionActive(worldState)) return [];
  const deployments = asObject(worldState.deployments);
  const states = asObject(worldState.relationshipStates);
  const rows = canonicalAllianceRows({ ...snapshot, worldState });
  const candidates = [];
  for (const callerId of Object.keys(deployments).sort(codepoint)) {
    const deployment = asObject(deployments[callerId]);
    if (joinAnchorOf(deployment, callerId) || deployment.recalled != null) continue;
    const rootTargetId = deployment.targetId != null ? String(deployment.targetId) : '';
    if (!snapshot?.byId?.has?.(callerId) || !snapshot?.byId?.has?.(rootTargetId)) continue;
    const sinceTick = Number(deployment.sinceTick);
    if (!rootTargetId || !Number.isInteger(sinceTick) || sinceTick < 0) continue;
    const sourceCauseTypes = liveRootCauses(worldState, callerId, rootTargetId, deployment);
    if (!sourceCauseTypes.length) continue;
    // Both courts may call: the attacking seat calls allies into its campaign;
    // the defending seat calls allies against the physical root attacker.  Both
    // calls remain anchored to this exact root deployment and its actual casus.
    const episodes = [
      { callingId: callerId, enemyId: rootTargetId },
      { callingId: rootTargetId, enemyId: callerId },
    ];
    for (const episode of episodes) {
      for (const alliance of alliesOf(rows, episode.callingId)) {
        const partyId = alliance.allyId;
        if (partyId === episode.enemyId || deployments[partyId] || !snapshot?.byId?.has?.(partyId)) continue;
        // A compact cannot make the called court violate its own honored pact.
        // Repudiation is the existing explicit verb; until then this bilateral
        // war is outside the legal call census.
        if (treatyEligibleWarTargets(worldState, partyId, [episode.enemyId], tick).length === 0) continue;
        const callId = coalitionCallIdFor({ callerId: episode.callingId, partyId, enemyId: episode.enemyId, callerDeploymentSinceTick: sinceTick });
        if (allianceCallWasDecided(asObject(states[alliance.relationshipKey]), callId, alliance.relationshipKey)) continue;
        const risk = readAllianceWebRisk({
          rows,
          observerId: partyId,
          enemyId: episode.enemyId,
          worldState,
          strengthFor,
          truthRelationshipFor: (subjectId) => truthRelationshipFor(snapshot, partyId, subjectId),
          excludeIds: [episode.callingId],
        });
        const books = readWarSeatBooks({ worldState, snapshot, actorId: partyId, opponentId: episode.enemyId });
        const relation = asObject(alliance.state);
        const obligation01 = clamp01(
          clamp01(relation.pactStrength) * 0.5
          + clamp01(relation.trust) * 0.3
          + clamp01(relation.dependency) * 0.2,
        );
        const score01 = clamp01(
          obligation01 * 0.55
          + clamp01(books.continueBias01) * 0.3
          + (1 - risk.risk01) * 0.15,
        );
        // Persisted WR-2 history is inert while its own flag is dark. WR-6 still
        // reads the already-authored WR-5 books above under its exact four-flag
        // gate, but a dormant learned stock cannot move the join threshold.
        const disposition = asObject(worldState.simulationRules).dispositionChannelsEnabled === true
          ? asObject(asObject(worldState.dispositionStats)[partyId])
          : {};
        const martial = thresholdFactorOf(disposition, 'martial').factor;
        const insular = thresholdFactorOf(disposition, 'insular').factor;
        const threshold01 = Math.max(0.35, Math.min(0.7, 0.5 * martial / insular));
        const anchor = {
          callId,
          partyId,
          callerId: episode.callingId,
          enemyId: episode.enemyId,
          joinedTick: Math.max(0, Math.floor(Number(tick) || 0)),
          callerDeploymentSinceTick: sinceTick,
          originAttackerId: callerId,
          originSinceTick: sinceTick,
          allianceRelationshipKey: alliance.relationshipKey,
          sourceCauseTypes,
          cause: 'alliance_obligation',
        };
        candidates.push({
          callId, partyId, callerId: episode.callingId, enemyId: episode.enemyId,
          relationshipKey: alliance.relationshipKey,
          relationshipState: relation,
          sourceCauseTypes,
          anchor,
          riskBand: risk.band,
          score01,
          threshold01,
          accepted: score01 >= threshold01,
          books,
        });
      }
    }
  }
  const chosen = new Map();
  for (const candidate of candidates.sort((a, b) => codepoint(a.callId, b.callId))) {
    const prior = chosen.get(candidate.partyId);
    if (!prior || candidate.score01 > prior.score01
      || (candidate.score01 === prior.score01 && codepoint(candidate.callId, prior.callId) < 0)) {
      chosen.set(candidate.partyId, candidate);
    }
  }
  return [...chosen.values()].sort((a, b) => codepoint(a.partyId, b.partyId));
}

/** Closed, id-rich relationship archive row shared by join and refusal. */
export function coalitionCallArchiveRow(decision, decisionKind, tick) {
  return {
    callId: decision.callId,
    partyId: decision.partyId,
    callerId: decision.callerId,
    enemyId: decision.enemyId,
    relationshipKey: decision.relationshipKey,
    tick: Math.max(0, Math.floor(Number(tick) || 0)),
    callerDeploymentSinceTick: decision.anchor.callerDeploymentSinceTick,
    originAttackerId: decision.anchor.originAttackerId,
    originSinceTick: decision.anchor.originSinceTick,
    decision: decisionKind,
    cause: 'alliance_obligation',
  };
}

/** Canonical evidence rows consumed by WR-6's governed-news adapter. */
export function coalitionDecisionEvidence(decision, accepted, tick) {
  const continueBias = Number(decision.books?.continueBias01);
  const peaceBias = Number(decision.books?.peaceBias01);
  const booksDirection = Number.isFinite(continueBias) && Number.isFinite(peaceBias)
    ? continueBias > peaceBias + 0.02 ? 'continue'
      : peaceBias > continueBias + 0.02 ? 'peace'
        : 'balanced'
    : 'unknown';
  const threshold = Number(decision.threshold01);
  const temperamentDirection = Number.isFinite(threshold)
    ? threshold > 0.52 ? 'guarded' : threshold < 0.48 ? 'open' : 'balanced'
    : 'unknown';
  const base = {
    tick: Math.max(0, Math.floor(Number(tick) || 0)),
    settlementId: decision.partyId,
    counterpartId: decision.callerId,
    thirdPartyId: decision.enemyId,
    callId: decision.callId,
    relationshipKey: decision.relationshipKey,
  };
  const row = (kind) => ({
    ...base,
    kind,
    id: `${decision.callId}.${kind}`,
    ...(kind === 'coalition_entry_priced' ? { band: decision.riskBand } : {}),
    ...(kind === 'coalition_joined' || kind === 'coalition_refused'
      ? {
          decision: kind === 'coalition_joined' ? 'joined' : 'refused',
          booksDirection,
          temperamentDirection,
          riskBand: decision.riskBand,
        }
      : {}),
  });
  return accepted
    ? [row('coalition_entry_priced'), row('coalition_joined'), row('casus_alliance_obligation')]
    : [row('coalition_entry_priced'), row('coalition_refused')];
}
