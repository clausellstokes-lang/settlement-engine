/**
 * domain/worldPulse/peaceTermsOverlay.js — THE E1b/E1c RELATIONSHIP WRITES.
 *
 * Every place the peace engine touches the relationship overlay, and nowhere
 * else: the compelled-alliance nudge (real loyalty, resented), the §12.3 strain →
 * resentment accrual that fuels §5 revanchism, the mediator's trust on BOTH its
 * edges, the §7 betrayal each abandoned co-besieger holds toward the deserter,
 * and the exact-once public marker for a coalition separate peace. Every write
 * rides the sanctioned applyRelationshipPatch on a REAL graph edge; a missing
 * edge is a byte-safe no-op, never a synthesized key.
 *
 * Extracted verbatim from peaceTerms.js by THE DECOMPOSITION WAVE (war tranche,
 * file 2 of 4).
 */
import { clamp01 } from '../../kernel/math.js';
import { stablePart } from './stablePart.js';
import { applyRelationshipPatch } from './relationshipEvolution.js';
import { treatyTicksPerYearOf } from './treatyClock.js';
import { PEACE_TERMS_TUNING } from './peaceTermsCatalog.js';
import { recordOf, explicitText } from './peaceTermsPrimitives.js';
import { edgeBetween, overlayStamp } from './peaceTermsGraph.js';
import { relationshipKeyFromEdge } from './relationshipState.js';
import { coalitionBetrayalCharacterRead } from './peaceTermsCoalition.js';

/** @typedef {import('./peaceTermsCatalog.js').TreatyRecord} TreatyRecord */

/**
 * Nudge the compelled-alliance overlay: pull trust up + resentment up on the
 * loser→victor edge (bounded), through the sanctioned applyRelationshipPatch
 * mechanism (the E1c overture lane). Compelled loyalty is REAL but resented — the
 * §11 defection window that reads this is a wave-3 concern. No edge ⇒ byte-safe no-op.
 * @param {Record<string, unknown>} worldState @param {Array<Record<string, unknown>>} edges
 * @param {string} loserId @param {string} victorId @param {number} magnitude @param {unknown} now
 * @returns {Record<string, unknown>}
 */
export function nudgeCompelledAlliance(worldState, edges, loserId, victorId, magnitude, now) {
  const edge = edgeBetween(edges, loserId, victorId);
  if (!edge) return worldState;
  const key = relationshipKeyFromEdge(edge);
  const current = /** @type {{ relationshipStates?: Record<string, { trust?: number, resentment?: number }> }} */ (worldState).relationshipStates?.[key];
  const m = clamp01(magnitude);
  const trust = clamp01((Number(current?.trust) || 0) + 0.15 * m);
  const resentment = clamp01((Number(current?.resentment) || 0) + 0.1 * m);
  return applyRelationshipPatch(worldState, {
    relationshipKey: key,
    relationshipPatch: { trust, resentment },
    metadata: { incidentType: 'compelled_alliance' },
    proposalPayload: null,
  }, overlayStamp(worldState, now), edge);
}

/**
 * §12.3 STRAIN → E1b resentment: bump the paying loser's resentment toward the
 * victor (bounded, per-tick), typed as a 'tribute_strain' incident so the §5
 * revanchism clock (which reads old tribute wounds under a live grudge) catches
 * it. Uses applyRelationshipPatch on the REAL edge; no edge ⇒ byte-safe no-op.
 * @param {Record<string, unknown>} worldState @param {Array<Record<string, unknown>>} edges
 * @param {string} loserId @param {string} victorId @param {number} burden01 @param {unknown} now
 * @param {TreatyRecord | null | undefined} treaty
 * @returns {Record<string, unknown>}
 */
export function accrueStrainResentment(worldState, edges, loserId, victorId, burden01, now, treaty) {
  const edge = edgeBetween(edges, loserId, victorId);
  if (!edge) return worldState;
  const key = relationshipKeyFromEdge(edge);
  const current = /** @type {{ relationshipStates?: Record<string, { resentment?: number }> }} */ (worldState).relationshipStates?.[key];
  const resentment = clamp01((Number(current?.resentment) || 0) + (PEACE_TERMS_TUNING.STRAIN_RESENTMENT_PER_YEAR / treatyTicksPerYearOf(treaty)) * clamp01(burden01));
  return applyRelationshipPatch(worldState, {
    relationshipKey: key,
    relationshipPatch: { resentment },
    metadata: { incidentType: 'tribute_strain' },
    proposalPayload: null,
  }, overlayStamp(worldState, now), edge);
}

/**
 * Bump trust on BOTH the mediator's edges (mediator↔victor and mediator↔loser)
 * — the broker earns standing in both courts (§13 / the E1 reactions machinery).
 * Typed 'mediation' incidents; missing edges are byte-safe no-ops.
 * @param {Record<string, unknown>} worldState @param {Array<Record<string, unknown>>} edges
 * @param {string} mediatorId @param {string} victorId @param {string} loserId @param {unknown} now
 * @returns {Record<string, unknown>}
 */
export function accrueMediationTrust(worldState, edges, mediatorId, victorId, loserId, now) {
  let state = worldState;
  for (const otherId of [victorId, loserId]) {
    const edge = edgeBetween(edges, mediatorId, otherId);
    if (!edge) continue;
    const key = relationshipKeyFromEdge(edge);
    const current = /** @type {{ relationshipStates?: Record<string, { trust?: number }> }} */ (state).relationshipStates?.[key];
    const trust = clamp01((Number(current?.trust) || 0) + PEACE_TERMS_TUNING.MEDIATION_TRUST_W);
    state = applyRelationshipPatch(state, {
      relationshipKey: key,
      relationshipPatch: { trust },
      metadata: { incidentType: 'mediation' },
      proposalPayload: null,
    }, overlayStamp(state, now), edge);
  }
  return state;
}

/**
 * §7 THE EXIT'S PRICE: mint betrayal on every abandoned co-besieger's edge to
 * the deserter. Each WR-6 incident is exact-once and prices the resentment bump
 * and trust loss through the abandoned ally's character. Missing edges are
 * no-ops; the WR-6-dark legacy path preserves the original fixed effects.
 *
 * @param {Record<string, unknown>} worldState
 * @param {Array<Record<string, unknown>>} edges
 * @param {string} deserterId
 * @param {string[]} abandoned
 * @param {unknown} now
 * @param {string} [sourceOutcomeId]
 * @param {Record<string, unknown>|null} [snapshot]
 * @returns {Record<string, unknown>}
 */
export function accrueBetrayal(
  worldState,
  edges,
  deserterId,
  abandoned,
  now,
  sourceOutcomeId = '',
  snapshot = null,
) {
  let state = worldState;
  for (const allyId of abandoned) {
    const edge = edgeBetween(edges, allyId, deserterId);
    if (!edge) continue;
    const key = relationshipKeyFromEdge(edge);
    const current = /** @type {{ relationshipStates?: Record<string, { resentment?: number, trust?: number, recentIncidents?:Array<{outcomeId?:unknown}> }> }} */ (state).relationshipStates?.[key];
    const eventId = explicitText(sourceOutcomeId)
      ? `${sourceOutcomeId}:coalition_betrayal:${deserterId}:${allyId}`
      : '';
    if (eventId && current?.recentIncidents?.some((row) => String(row?.outcomeId || '') === eventId)) continue;
    const character = eventId
      ? coalitionBetrayalCharacterRead({ worldState: state, snapshot, allyId, deserterId })
      : { multiplier: 1 };
    const multiplier = Number(character.multiplier) || 1;
    const resentment = clamp01(
      (Number(current?.resentment) || 0) + PEACE_TERMS_TUNING.BETRAYAL_RESENTMENT_W * multiplier,
    );
    const trust = clamp01(
      (Number(current?.trust) || 0) * (1 - PEACE_TERMS_TUNING.CREDIBILITY_HIT * multiplier),
    );
    state = applyRelationshipPatch(state, {
      ...(eventId ? { id: eventId } : {}),
      relationshipKey: key,
      relationshipPatch: { resentment, trust },
      metadata: { incidentType: 'coalition_betrayal' },
      proposalPayload: null,
    }, overlayStamp(state, now), edge);
  }
  return state;
}

/** Persist the public exit fact before emitting it so a mint-window replay is silent. */
export function markCoalitionSeparatePeace(worldState, relationshipKey, peaceOutcomeId, tick, now, context, /** @type {{ from?: unknown, to?: unknown, id?: unknown }|null} */ edge = null) {
  const sourceId = explicitText(peaceOutcomeId);
  const key = explicitText(relationshipKey);
  const departingId = explicitText(recordOf(context).departingId);
  const enemyId = explicitText(recordOf(context).enemyId);
  const at = Number(tick);
  if (!sourceId || !key || !departingId || !enemyId || departingId === enemyId
    || !Number.isInteger(at) || at < 0) return { worldState, first: false };
  const closureId = `coalition_exit.${stablePart(departingId)}.${stablePart(enemyId)}`;
  const actionId = `${sourceId}.${closureId}.separate_peace`;
  const current = recordOf(recordOf(worldState.relationshipStates)[key]);
  if (Array.isArray(current.coalitionSettlements)
    && current.coalitionSettlements.some((row) => explicitText(recordOf(row).actionId) === actionId)) {
    return { worldState, first: false };
  }
  const nextState = applyRelationshipPatch(worldState, {
    id: `${sourceId}:coalition_separate_peace`,
    relationshipKey: key,
    relationshipPatch: {},
    metadata: {
      incidentType: 'coalition_separate_peace',
      coalitionSettlement: {
        actionId,
        coalitionSettlementId: sourceId,
        closureId,
        relationshipKey: key,
        fromId: departingId,
        toId: enemyId,
        action: 'separate_peace',
        tick: at,
        status: 'recorded',
      },
    },
    severity: 0.55,
    proposalPayload: null,
  }, overlayStamp(worldState, now), edge);
  const next = recordOf(recordOf(nextState.relationshipStates)[key]);
  const recorded = Array.isArray(next.coalitionSettlements)
    && next.coalitionSettlements.some((row) => explicitText(recordOf(row).actionId) === actionId);
  return { worldState: nextState, first: recorded };
}
