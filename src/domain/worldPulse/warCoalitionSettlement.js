/**
 * warCoalitionSettlement.js — WR-6 collective liability, pairwise payment.
 *
 * This leaf plans one aggregate settlement, apportions it among losers, divides
 * the proceeds among winners, and executes only ordinary pairwise grain moves.
 * Every bilateral closure must carry the same explicit coalitionSettlementId;
 * missing or mixed identities fail closed instead of inventing a congress.
 *
 * Caller-to-member reimbursement is a separate internal transfer.  What grain
 * actually reaches the member is paid; any real, measured remainder is folded
 * into the existing obligations substrate as `coalition_reimbursement` with no
 * second decay charge.  Forgiveness has its own helper and never masquerades as
 * payment.
 */

import { clamp01 } from '../../kernel/math.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { foldObligations, obligationKey, REACTION_TUNING } from '../spatial/generosityReactions.js';
import {
  applyTreatyFoodDeltas,
  computeTreatyGrainDraw,
  freshestSettlement,
  TREATY_TRANSFER_TUNING,
} from './treatyTransfer.js';
import {
  COALITION_REIMBURSEMENT_KIND,
  coalitionJoinAnchor,
  coalitionLedgerActive,
  readCoalitionExpenditure,
} from './warCoalitionExpenditure.js';
import {
  coalitionAftermathDispositionDeltas,
  coalitionSettlementDispositionDeltas,
  dispositionTreatyLearningActive,
} from './treatyDisposition.js';
import { warHomeFrontBand } from './warCosts.js';
import { stablePart } from './stablePart.js';
import {
  applyRelationshipPatch,
  coalitionSettlementActionWasRecorded,
  relationshipKeyFromEdge,
} from './relationshipEvolution.js';

export const COALITION_SETTLEMENT_TUNING = Object.freeze({
  LOSER_CAPACITY_W: 0.35,
  LOSER_CULPABILITY_W: 0.35,
  LOSER_FIELD_LOSS_W: 0.20,
  LOSER_CALLER_W: 0.10,
  WINNER_BLED_W: 0.50,
  WINNER_LED_W: 0.35,
  WINNER_EARLY_W: 0.15,
  EXACT_UNITS: 10000,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number|null} */
function finite01(value) {
  const number = Number(value);
  return Number.isFinite(number) ? clamp01(number) : null;
}

/** A closure census field must be present and already inside its bounded domain. */
function explicit01(value) {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= 1 ? number : null;
}

/** @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {unknown} value @returns {number|null} */
function wholeTick(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : null;
}

/** @param {unknown} value @returns {string} */
function explicitId(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} closure */
function normalizeClosure(closure) {
  const row = asObject(closure);
  const coalitionSettlementId = explicitId(row.coalitionSettlementId);
  const closureId = explicitId(row.closureId);
  const relationshipKey = explicitId(row.relationshipKey);
  const winnerId = explicitId(row.winnerId);
  const loserId = explicitId(row.loserId);
  const callerId = explicitId(row.callerId);
  const capacity01 = explicit01(row.capacity01);
  const culpability01 = explicit01(row.culpability01);
  const fieldLoss01 = explicit01(row.fieldLoss01);
  const bled01 = explicit01(row.bled01);
  const led01 = explicit01(row.led01);
  const late01 = explicit01(row.late01);
  const goodId = explicitId(row.goodId);
  const goodName = explicitId(row.goodName);
  if (!coalitionSettlementId || !closureId || !relationshipKey
    || !winnerId || !loserId || winnerId === loserId || !callerId
    || [capacity01, culpability01, fieldLoss01, bled01, led01, late01]
      .some((value) => value == null)
    || Boolean(goodId) !== Boolean(goodName)) return null;
  return {
    coalitionSettlementId,
    closureId,
    relationshipKey,
    winnerId,
    loserId,
    capacity01,
    culpability01,
    fieldLoss01,
    callerId,
    bled01,
    led01,
    late01,
    ...(goodId && goodName
      ? { goodId, goodName }
      : {}),
  };
}

/**
 * Validate the bilateral closure census.  Every closure must be legible, unique,
 * and carry the same explicit settlement identity.  No top-level fallback id is
 * copied into a missing row.
 *
 * @param {unknown} closures
 * @param {unknown} [coalitionSettlementId]
 * @returns {Array<NonNullable<ReturnType<typeof normalizeClosure>>>|null}
 */
export function validateCoalitionSettlementClosures(closures, coalitionSettlementId = '') {
  if (!Array.isArray(closures) || closures.length === 0) return null;
  const expected = explicitId(coalitionSettlementId) || explicitId(asObject(closures[0]).coalitionSettlementId);
  if (!expected) return null;
  const normalized = closures.map(normalizeClosure);
  if (normalized.some((row) => !row)) return null;
  const rows = /** @type {Array<NonNullable<ReturnType<typeof normalizeClosure>>>} */ (normalized);
  if (rows.some((row) => row.coalitionSettlementId !== expected)) return null;
  const ids = new Set(rows.map((row) => row.closureId));
  const pairs = new Set(rows.map((row) => `${row.winnerId}\u0000${row.loserId}`));
  if (ids.size !== rows.length || pairs.size !== rows.length) return null;
  // A bilateral closure may repeat a party's census facts, but may not tell a
  // more favorable version of them to a different counterparty. Aggregate
  // weights therefore exist only when every row agrees on that party's inputs.
  for (const loserId of new Set(rows.map((row) => row.loserId))) {
    const metrics = new Set(rows.filter((row) => row.loserId === loserId)
      .map((row) => JSON.stringify([
        row.capacity01, row.culpability01, row.fieldLoss01, row.callerId,
      ])));
    if (metrics.size !== 1) return null;
  }
  for (const winnerId of new Set(rows.map((row) => row.winnerId))) {
    const metrics = new Set(rows.filter((row) => row.winnerId === winnerId)
      .map((row) => JSON.stringify([row.bled01, row.led01, row.late01])));
    if (metrics.size !== 1) return null;
  }
  return [...rows].sort((a, b) => a.closureId < b.closureId ? -1 : a.closureId > b.closureId ? 1 : 0);
}

/**
 * Allocate integer units exactly. Floors land first; largest fractional
 * remainders receive the residual, with codepoint id as the final tie-break.
 *
 * @param {number} totalUnits
 * @param {Array<{id:string,weight:number}>} weighted
 * @returns {Record<string, number>}
 */
function allocateExactUnits(totalUnits, weighted) {
  const total = Math.max(0, Math.floor(totalUnits));
  const rows = weighted
    .filter((row) => row.id)
    .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  if (!rows.length) return {};
  const positive = rows.map((row) => ({ ...row, weight: Math.max(0, Number(row.weight) || 0) }));
  const weightSum = positive.reduce((sum, row) => sum + row.weight, 0);
  const denominator = weightSum > 0 ? weightSum : positive.length;
  const drafts = positive.map((row) => {
    const exact = total * (weightSum > 0 ? row.weight : 1) / denominator;
    const units = Math.floor(exact);
    return { id: row.id, units, remainder: exact - units };
  });
  let residual = total - drafts.reduce((sum, row) => sum + row.units, 0);
  const byRemainder = [...drafts].sort((a, b) =>
    (b.remainder - a.remainder) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  for (let index = 0; residual > 0; index = (index + 1) % byRemainder.length) {
    byRemainder[index].units += 1;
    residual -= 1;
  }
  return Object.fromEntries(drafts.map((row) => [row.id, row.units]));
}

/**
 * Plan one aggregate claim.  A complete winner×loser closure matrix is required
 * because every material movement must travel on an explicit bilateral closure.
 *
 * @param {{coalitionSettlementId?:unknown,closures?:unknown,aggregateClaim01?:unknown,
 *   tick?:unknown}} [args]
 * @returns {Record<string, unknown>|null}
 */
export function planCoalitionSettlement({
  coalitionSettlementId,
  closures,
  aggregateClaim01,
  tick = 0,
} = {}) {
  const settlementId = explicitId(coalitionSettlementId);
  const rows = validateCoalitionSettlementClosures(closures, settlementId);
  const claim = finite01(aggregateClaim01);
  const at = wholeTick(tick);
  if (!settlementId || !rows || claim == null || claim <= 0 || at == null) return null;
  const winners = [...new Set(rows.map((row) => row.winnerId))].sort();
  const losers = [...new Set(rows.map((row) => row.loserId))].sort();
  const pairSet = new Set(rows.map((row) => `${row.winnerId}\u0000${row.loserId}`));
  for (const winnerId of winners) {
    for (const loserId of losers) {
      if (!pairSet.has(`${winnerId}\u0000${loserId}`)) return null;
    }
  }

  const T = COALITION_SETTLEMENT_TUNING;
  const loserWeights = losers.map((loserId) => {
    const owned = rows.filter((row) => row.loserId === loserId);
    const capacity01 = Math.max(...owned.map((row) => row.capacity01));
    const culpability01 = Math.max(...owned.map((row) => row.culpability01));
    const fieldLoss01 = Math.max(...owned.map((row) => row.fieldLoss01));
    const calledAlliance = owned.some((row) => row.callerId === loserId);
    return {
      id: loserId,
      capacity01,
      culpability01,
      fieldLoss01,
      calledAlliance,
      weight: capacity01 * T.LOSER_CAPACITY_W
        + culpability01 * T.LOSER_CULPABILITY_W
        + fieldLoss01 * T.LOSER_FIELD_LOSS_W
        + (calledAlliance ? T.LOSER_CALLER_W : 0),
    };
  });
  const winnerWeights = winners.map((winnerId) => {
    const owned = rows.filter((row) => row.winnerId === winnerId);
    const bled01 = Math.max(...owned.map((row) => row.bled01));
    const led01 = Math.max(...owned.map((row) => row.led01));
    const late01 = Math.max(...owned.map((row) => row.late01));
    return {
      id: winnerId,
      bled01,
      led01,
      late01,
      weight: bled01 * T.WINNER_BLED_W
        + led01 * T.WINNER_LED_W
        + (1 - late01) * T.WINNER_EARLY_W,
    };
  });

  const totalUnits = Math.max(1, Math.round(claim * T.EXACT_UNITS));
  const loserUnits = allocateExactUnits(totalUnits, loserWeights);
  /** @type {Array<Record<string, unknown>>} */
  const transfers = [];
  for (const loserId of losers) {
    const shares = allocateExactUnits(loserUnits[loserId] || 0, winnerWeights);
    for (const winnerId of winners) {
      const closure = /** @type {NonNullable<ReturnType<typeof normalizeClosure>>} */ (
        rows.find((row) => row.winnerId === winnerId && row.loserId === loserId));
      const units = shares[winnerId] || 0;
      if (units <= 0) continue;
      transfers.push({
        coalitionSettlementId: settlementId,
        closureId: closure.closureId,
        payerId: loserId,
        payeeId: winnerId,
        units,
        amount01: round4(units / T.EXACT_UNITS),
      });
    }
  }
  const winnerUnits = Object.fromEntries(winners.map((winnerId) => [
    winnerId,
    transfers.filter((row) => row.payeeId === winnerId)
      .reduce((sum, row) => sum + Number(row.units), 0),
  ]));
  const apportionment = loserWeights.map((row) => ({
    loserId: row.id,
    amount01: round4((loserUnits[row.id] || 0) / T.EXACT_UNITS),
    share01: round4((loserUnits[row.id] || 0) / totalUnits),
    capacity01: round4(row.capacity01),
    culpability01: round4(row.culpability01),
    fieldLoss01: round4(row.fieldLoss01),
    calledAlliance: row.calledAlliance,
  }));
  const spoils = winnerWeights.map((row) => ({
    winnerId: row.id,
    amount01: round4((winnerUnits[row.id] || 0) / T.EXACT_UNITS),
    share01: round4((winnerUnits[row.id] || 0) / totalUnits),
    bled01: round4(row.bled01),
    led01: round4(row.led01),
    late01: round4(row.late01),
  }));
  const coalitionEvidence = [
    ...apportionment.filter((row) => row.amount01 > 0).map((row) => {
      const good = rows.find((closure) => closure.loserId === row.loserId);
      return {
        id: `coalition-apportionment.${stablePart(settlementId)}.${stablePart(row.loserId)}`,
        kind: 'coalition_apportionment',
        tick: at,
        coalitionSettlementId: settlementId,
        settlementId: row.loserId,
        counterpartId: winners[0],
        band: warHomeFrontBand(row.share01),
        allocationBasis: {
          capacity: warHomeFrontBand(row.capacity01),
          culpability: warHomeFrontBand(row.culpability01),
          fieldLoss: warHomeFrontBand(row.fieldLoss01),
          caller: row.calledAlliance,
        },
        ...(good?.goodId ? { goodId: good.goodId, goodName: good.goodName } : {}),
      };
    }),
    ...(winners.length > 1 ? spoils.filter((row) => row.amount01 > 0).map((row) => {
      const good = rows.find((closure) => closure.winnerId === row.winnerId);
      const peers = winners.filter((winnerId) => winnerId !== row.winnerId);
      return {
        id: `coalition-spoils.${stablePart(settlementId)}.${stablePart(row.winnerId)}`,
        kind: 'coalition_spoils_divided',
        tick: at,
        coalitionSettlementId: settlementId,
        settlementId: row.winnerId,
        counterpartId: peers[0],
        band: warHomeFrontBand(row.share01),
        allocationBasis: {
          bled: warHomeFrontBand(row.bled01),
          led: warHomeFrontBand(row.led01),
          late: warHomeFrontBand(row.late01),
        },
        ...(good?.goodId ? { goodId: good.goodId, goodName: good.goodName } : {}),
      };
    }) : []),
  ];
  return {
    coalitionSettlementId: settlementId,
    tick: at,
    aggregateClaim01: round4(totalUnits / T.EXACT_UNITS),
    totalUnits,
    closures: rows,
    apportionment,
    spoils,
    transfers,
    coalitionEvidence,
  };
}

/** @param {unknown} settlement @returns {boolean} */
function hasRealGranary(settlement) {
  const row = asObject(settlement);
  const food = asObject(asObject(row.economicState).foodSecurity);
  return Number.isFinite(Number(food.storageMonths))
    && Number.isFinite(Number(row.population))
    && Number(row.population) > 0;
}

/** The graph edge this pair's relationship key addresses, or null.
 *
 *  ⚠️ IT RETURNS THE EDGE NOW, AND THE EXISTENCE GUARD IS DERIVED FROM IT. This
 *  module already refused to archive against a pair it could not find in the
 *  graph — it simply kept the boolean and threw the edge away, which left the
 *  relationship plane's writer unable to type an unmaterialized record. One walk
 *  now yields both the proof and the truth to write with.
 *  @param {unknown} snapshot @param {string} relationshipKey @param {string} a @param {string} b */
function relationshipPairEdge(snapshot, relationshipKey, a, b) {
  const graph = asObject(asObject(snapshot).regionalGraph);
  const edges = Array.isArray(graph.edges)
    ? /** @type {Array<Record<string, unknown>>} */ (graph.edges)
    : [];
  return edges.find((edge) => {
    if (relationshipKeyFromEdge(edge) !== relationshipKey) return false;
    const from = explicitId(edge.from || edge.source || edge.a);
    const to = explicitId(edge.to || edge.target || edge.b);
    return (from === a && to === b) || (from === b && to === a);
  }) || null;
}

/** @param {Record<string, unknown>} worldState @param {string} relationshipKey @param {string} actionId */
function actionAlreadyRecorded(worldState, relationshipKey, actionId) {
  const state = asObject(asObject(worldState).relationshipStates)[relationshipKey];
  return coalitionSettlementActionWasRecorded(asObject(state), actionId);
}

/** @param {unknown} snapshot @param {string} relationshipKey @param {string} a @param {string} b */
function relationshipPairExists(snapshot, relationshipKey, a, b) {
  return relationshipPairEdge(snapshot, relationshipKey, a, b) != null;
}

/** Land one action through the relationship plane's exact-once writer.
 *  @param {Record<string, unknown>} worldState @param {unknown} row
 *  @param {string} incidentType @param {number} severity
 *  @param {{ from?: unknown, to?: unknown, id?: unknown }|null} [edge] the graph edge the action's key addresses */
function archiveSettlementAction(worldState, row, incidentType, severity, edge = null) {
  const action = asObject(row);
  const relationshipKey = explicitId(action.relationshipKey);
  const actionId = explicitId(action.actionId);
  if (!relationshipKey || !actionId
    || actionAlreadyRecorded(worldState, relationshipKey, actionId)) return null;
  const next = applyRelationshipPatch(worldState, {
    id: actionId,
    relationshipKey,
    relationshipPatch: {},
    metadata: { coalitionSettlement: action, incidentType },
    severity: clamp01(Number(severity) || 0),
    proposalPayload: null,
  }, Number(action.tick), edge);
  return next !== worldState && actionAlreadyRecorded(next, relationshipKey, actionId)
    ? next
    : null;
}

/**
 * Apply a validated aggregate plan through the existing conserved transfer
 * primitive.  No treaty or obligation is fabricated when a pair lacks real
 * settlement/granary data; its execution evidence names the incompleteness.
 *
 * @param {{worldState?:Record<string,unknown>,snapshot?:unknown,
 *   settlementUpdates?:Array<Record<string,unknown>>,plan?:unknown,closures?:unknown}} [args]
 */
export function applyCoalitionSettlement({
  // The body already REQUIRES an object here (archiveSettlementAction below takes
  // `Record<string, unknown>`), so the declared contract is made to match: without
  // the default the early returns hand back `Record<string,unknown>|undefined` and
  // that `undefined` spills into every annotated caller. All live call sites pass a
  // real state, so this default is unreachable in practice — it closes a type hole,
  // it does not add a behavior.
  //
  // ⚠ CORRECTED CENSUS, 2026-08-07 (receipt-correction lane). The receipt that
  // landed this default said "All six call sites (peaceTerms plus five in tests)".
  // THERE ARE FIVE INVOCATION SITES, not six. Re-measured at HEAD e37f9495 with a
  // full-repo grep over src/ tests/ scripts/ supabase/ docs/ — eight occurrences of
  // the symbol, of which one is this declaration and one is peaceTerms.js:129's
  // IMPORT. The five real invocations are:
  //     src/domain/worldPulse/peaceTerms.js:602            (the only production caller)
  //     tests/domain/warCoalitionSettlement.test.js:216, :247, :276, :292
  // Six is reached only by counting the import as a call site. The CONCLUSION is
  // unaffected — all five pass a real worldState — but a census quoted one high is
  // how a later lane concludes it has found every caller when it has not.
  worldState = {},
  snapshot,
  settlementUpdates = [],
  plan,
  closures,
} = {}) {
  const source = asObject(plan);
  const settlementId = explicitId(source.coalitionSettlementId);
  const supplied = validateCoalitionSettlementClosures(closures, settlementId);
  const planned = validateCoalitionSettlementClosures(source.closures, settlementId);
  if (!coalitionLedgerActive(worldState) || !settlementId || !supplied || !planned) {
    return { worldState, settlementUpdates, changed: false, coalitionEvidence: [] };
  }
  const suppliedIds = supplied.map((row) => row.closureId).sort().join('\u0000');
  const plannedIds = planned.map((row) => row.closureId).sort().join('\u0000');
  const canonical = planCoalitionSettlement({
    coalitionSettlementId: settlementId,
    closures: source.closures,
    aggregateClaim01: source.aggregateClaim01,
    tick: source.tick,
  });
  if (suppliedIds !== plannedIds
    || JSON.stringify(supplied) !== JSON.stringify(planned)
    || !canonical
    || JSON.stringify(source.transfers) !== JSON.stringify(canonical.transfers)
    || JSON.stringify(source.apportionment) !== JSON.stringify(canonical.apportionment)
    || JSON.stringify(source.spoils) !== JSON.stringify(canonical.spoils)) {
    return { worldState, settlementUpdates, changed: false, coalitionEvidence: [] };
  }
  /** @type {Map<string, number>} */
  const foodDeltas = new Map();
  /** @type {Array<Record<string, unknown>>} */
  const executionEvidence = [];
  /** @type {Array<Record<string, unknown>>} */
  const settlementActions = [];
  /** @type {Map<string, number>} */
  const actualGotByWinner = new Map();
  for (const raw of source.transfers) {
    const transfer = asObject(raw);
    const closureId = explicitId(transfer.closureId);
    const payerId = explicitId(transfer.payerId);
    const payeeId = explicitId(transfer.payeeId);
    const takeFraction = finite01(transfer.amount01);
    const closure = supplied.find((row) => row.closureId === closureId);
    if (!closure
      || transfer.coalitionSettlementId !== settlementId
      || closure.loserId !== payerId
      || closure.winnerId !== payeeId
      || !relationshipPairExists(snapshot, closure.relationshipKey, payerId, payeeId)
      || takeFraction == null) {
      return { worldState, settlementUpdates, changed: false, coalitionEvidence: [] };
    }
    const payer = freshestSettlement(settlementUpdates, /** @type {any} */ (snapshot), payerId);
    const payee = freshestSettlement(settlementUpdates, /** @type {any} */ (snapshot), payeeId);
    const complete = hasRealGranary(payer) && hasRealGranary(payee);
    if (!complete) {
      return { worldState, settlementUpdates, changed: false, coalitionEvidence: [] };
    }
    const committedDebit = -(foodDeltas.get(payerId) || 0);
    const draw = takeFraction > 0 ? computeTreatyGrainDraw({
      payer,
      payee,
      takeFraction,
      committedDebit,
      committedCredit: foodDeltas.get(payeeId) || 0,
    }) : null;
    if (draw?.lostMonths > 0) {
      foodDeltas.set(payerId, round4((foodDeltas.get(payerId) || 0) - draw.lostMonths));
      if (draw.gainedMonths > 0) {
        foodDeltas.set(payeeId, round4((foodDeltas.get(payeeId) || 0) + draw.gainedMonths));
      }
    }
    const payerPop = Math.max(0, Number(asObject(payer).population) || 0);
    const payeePop = Math.max(0, Number(asObject(payee).population) || 0);
    const intendedCaptured = Math.floor(
      Math.max(0, reimbursementCapacity(payer) - committedDebit) * takeFraction * 10,
    ) / 10 * payerPop * TREATY_TRANSFER_TUNING.CAPTURE;
    const received = Math.max(0, Number(draw?.gainedMonths) || 0) * payeePop;
    const adequacy01 = intendedCaptured > 0 ? clamp01(received / intendedCaptured) : 0;
    actualGotByWinner.set(
      payeeId,
      round4((actualGotByWinner.get(payeeId) || 0) + takeFraction * adequacy01),
    );
    const status = received <= 0
      ? 'unpaid'
      : received + 0.0001 < intendedCaptured ? 'partial' : 'paid';
    const action = {
      actionId: `${settlementId}.${closureId}.settlement_transfer`,
      coalitionSettlementId: settlementId,
      closureId,
      relationshipKey: closure.relationshipKey,
      fromId: payerId,
      toId: payeeId,
      action: 'settlement_transfer',
      tick: Number(source.tick) || 0,
      status,
    };
    if (actionAlreadyRecorded(worldState, closure.relationshipKey, action.actionId)) {
      return { worldState, settlementUpdates, changed: false, coalitionEvidence: [] };
    }
    settlementActions.push(action);
    executionEvidence.push({
      id: `coalition-transfer.${stablePart(settlementId)}.${stablePart(closureId)}`,
      kind: 'coalition_settlement_transfer',
      tick: Number(source.tick) || 0,
      coalitionSettlementId: settlementId,
      closureId,
      payerId,
      payeeId,
      complete: true,
      moved: !!draw?.lostMonths,
      status,
    });
  }
  let workingState = worldState;
  for (const action of settlementActions) {
    const archived = archiveSettlementAction(
      workingState,
      action,
      action.status === 'paid' ? 'coalition_settlement_paid' : 'coalition_settlement_unpaid',
      action.status === 'paid' ? 0.45 : 0.7,
      relationshipPairEdge(snapshot, explicitId(action.relationshipKey), explicitId(action.fromId), explicitId(action.toId)),
    );
    // The archive and material deltas are one atomic returned value. A bad or
    // replayed row aborts before any settlement update can leave this helper.
    if (!archived) {
      return { worldState, settlementUpdates, changed: false, coalitionEvidence: [] };
    }
    workingState = archived;
  }
  const nextUpdates = applyTreatyFoodDeltas(settlementUpdates, foodDeltas);
  const dispositionActive = dispositionTreatyLearningActive(worldState);
  const dispositionDeltas = [];
  if (dispositionActive) {
    for (const rawSpoils of [...canonical.spoils].sort((left, right) => (
      String(left.winnerId) < String(right.winnerId) ? -1 : String(left.winnerId) > String(right.winnerId) ? 1 : 0
    ))) {
      const winnerId = explicitId(rawSpoils.winnerId);
      const deployment = asObject(asObject(asObject(worldState).deployments)[winnerId]);
      const targetId = explicitId(deployment.targetId);
      const expenditure = targetId ? readCoalitionExpenditure({
        worldState,
        snapshot,
        partyId: winnerId,
        targetId,
        deployment,
        tick: source.tick,
      }) : null;
      const currentExpenditure01 = Number(expenditure?.pressure01);
      // Root winners have no join anchor and therefore no I2 member bill. The
      // explicit, matrix-validated bled census is their bounded spent fallback;
      // a joined winner's live expenditure remains the stronger evidence.
      const spent01 = Number.isFinite(currentExpenditure01)
        ? currentExpenditure01
        : Number(rawSpoils.bled01);
      if (!Number.isFinite(spent01) || spent01 < 0) continue;
      const got01 = clamp01(actualGotByWinner.get(winnerId) || 0);
      dispositionDeltas.push(...coalitionSettlementDispositionDeltas({
        enabled: true,
        id: winnerId,
        got01,
        spent01,
        sourceEventId: `${settlementId}.coalition_outcome.${winnerId}`,
      }));
    }
  }
  return {
    worldState: workingState,
    settlementUpdates: nextUpdates,
    changed: workingState !== worldState || nextUpdates !== settlementUpdates,
    coalitionEvidence: Array.isArray(canonical.coalitionEvidence)
      ? canonical.coalitionEvidence.map(asObject)
      : [],
    executionEvidence,
    settlementActions,
    ...(dispositionActive ? { dispositionDeltas } : {}),
  };
}

/** @param {unknown} settlement */
function reimbursementCapacity(settlement) {
  const row = asObject(settlement);
  const storage = Number(asObject(asObject(row.economicState).foodSecurity).storageMonths);
  return Number.isFinite(storage)
    ? Math.max(0, storage - TREATY_TRANSFER_TUNING.RESERVE_MONTHS)
    : 0;
}

/**
 * Pay a caller's internal coalition reimbursement to the member it called.
 * Only a live, valid join anchor can establish the debt direction.
 *
 * @param {{worldState?:Record<string,unknown>,snapshot?:unknown,
 *   settlementUpdates?:Array<Record<string,unknown>>,coalitionSettlementId?:unknown,
 *   callerId?:unknown,memberId?:unknown,targetId?:unknown,claim01?:unknown,tick?:unknown,
 *   joinAnchor?:unknown}} [args]
 */
export function applyCoalitionReimbursement({
  worldState,
  snapshot,
  settlementUpdates = [],
  coalitionSettlementId,
  callerId,
  memberId,
  targetId,
  claim01,
  tick = null,
  joinAnchor = null,
} = {}) {
  const settlementId = explicitId(coalitionSettlementId);
  const caller = explicitId(callerId);
  const member = explicitId(memberId);
  const target = explicitId(targetId);
  const claim = finite01(claim01);
  const at = wholeTick(tick ?? asObject(worldState).tick);
  const deployment = asObject(asObject(asObject(worldState).deployments)[member]);
  const liveAnchor = coalitionJoinAnchor(deployment, member, at ?? Number.NEGATIVE_INFINITY);
  const witness = asObject(joinAnchor);
  const durableAnchor = Object.keys(witness).length
    ? coalitionJoinAnchor({
        targetId: target,
        sinceTick: witness.joinedTick,
        joinLedger: [witness],
      }, member, at ?? Number.NEGATIVE_INFINITY)
    : null;
  const anchor = liveAnchor || durableAnchor;
  const unchanged = { worldState, settlementUpdates, changed: false, coalitionEvidence: [], relationshipPatches: [] };
  if (!coalitionLedgerActive(worldState)
    || !settlementId || !caller || !member || !target
    || caller === member || claim == null || claim <= 0 || at == null
    || !anchor || anchor.callerId !== caller || anchor.enemyId !== target) return unchanged;
  const relationshipKey = explicitId(anchor.allianceRelationshipKey);
  const closureId = explicitId(anchor.callId);
  const actionId = `${settlementId}.${closureId}.reimbursement`;
  if (!relationshipKey || !closureId
    || !relationshipPairExists(snapshot, relationshipKey, caller, member)
    || actionAlreadyRecorded(worldState, relationshipKey, actionId)) return unchanged;

  const payer = freshestSettlement(settlementUpdates, /** @type {any} */ (snapshot), caller);
  const payee = freshestSettlement(settlementUpdates, /** @type {any} */ (snapshot), member);
  if (!hasRealGranary(payer) || !hasRealGranary(payee)) return unchanged;

  const draw = computeTreatyGrainDraw({ payer, payee, takeFraction: claim });
  /** @type {Map<string, number>} */
  const foodDeltas = new Map();
  if (draw?.lostMonths > 0) {
    foodDeltas.set(caller, -draw.lostMonths);
    if (draw.gainedMonths > 0) foodDeltas.set(member, draw.gainedMonths);
  }
  const payerPop = Math.max(0, Number(asObject(payer).population) || 0);
  const payeePop = Math.max(0, Number(asObject(payee).population) || 0);
  const intendedCaptured = Math.floor(reimbursementCapacity(payer) * claim * 10) / 10
    * payerPop * TREATY_TRANSFER_TUNING.CAPTURE;
  const received = Math.max(0, Number(draw?.gainedMonths) || 0) * payeePop;
  const adequacy01 = intendedCaptured > 0 ? clamp01(received / intendedCaptured) : 0;
  const paid01 = round4(claim * adequacy01);
  const unpaid01 = round4(Math.max(0, claim - paid01));

  const prior = /** @type {Record<string, unknown>|null} */ (getSpatialLedger(worldState, 'obligations'));
  const repayments = paid01 > 0
    ? [{ from: caller, to: member, kind: COALITION_REIMBURSEMENT_KIND, amount: paid01 }]
    : [];
  const mints = unpaid01 > REACTION_TUNING.OBLIGATION_EPS
    ? [{
        from: caller,
        to: member,
        kind: COALITION_REIMBURSEMENT_KIND,
        magnitude: unpaid01,
        mintTick: at,
        lastTick: at,
      }]
    : [];
  const nextObligations = foldObligations(prior, { mints, repayments, now: at, decayPerTick: 0 });
  const paid = unpaid01 <= REACTION_TUNING.OBLIGATION_EPS;
  const status = paid ? 'paid' : paid01 > REACTION_TUNING.OBLIGATION_EPS ? 'partial' : 'unpaid';
  const settlementAction = {
    actionId,
    coalitionSettlementId: settlementId,
    closureId,
    relationshipKey,
    fromId: caller,
    toId: member,
    action: 'reimbursement',
    tick: at,
    status,
  };
  const archivedState = archiveSettlementAction(
    worldState,
    settlementAction,
    paid ? 'coalition_reimbursement_paid' : 'coalition_reimbursement_unpaid',
    paid ? adequacy01 : unpaid01,
    relationshipPairEdge(snapshot, relationshipKey, caller, member),
  );
  if (!archivedState) return unchanged;
  let nextState = archivedState;
  if (JSON.stringify(nextObligations || null) !== JSON.stringify(prior || null)) {
    nextState = nextObligations
      ? setSpatialLedger(nextState, 'obligations', nextObligations)
      : dropSpatialLedger(nextState, 'obligations');
  }
  const nextUpdates = applyTreatyFoodDeltas(settlementUpdates, foodDeltas);
  const kind = paid ? 'coalition_debt_paid' : 'coalition_debt_unpaid';
  const dispositionActive = dispositionTreatyLearningActive(worldState);
  const dispositionDeltas = coalitionAftermathDispositionDeltas({
    enabled: dispositionActive,
    id: member,
    outcome: paid ? 'win' : 'loss',
    magnitude: paid ? paid01 : unpaid01,
    sourceKind: paid ? 'coalition_reimbursement_paid' : 'coalition_reimbursement_unpaid',
    sourceEventId: actionId,
  });
  const evidence = {
    id: `coalition-debt.${stablePart(settlementId)}.${stablePart(caller)}.${stablePart(member)}`,
    kind,
    tick: at,
    coalitionSettlementId: settlementId,
    settlementId: member,
    counterpartId: caller,
    targetId: target,
    adequacyBand: warHomeFrontBand(adequacy01),
    claimBand: warHomeFrontBand(claim),
    obligationKind: COALITION_REIMBURSEMENT_KIND,
    paidByTransfer: paid,
  };
  return {
    worldState: nextState,
    settlementUpdates: nextUpdates,
    changed: nextState !== worldState || nextUpdates !== settlementUpdates,
    coalitionEvidence: [evidence],
    relationshipPatches: [{
      fromId: caller,
      toId: member,
      coalitionSettlementId: settlementId,
      incidentType: paid ? 'coalition_reimbursement_paid' : 'coalition_reimbursement_unpaid',
      severity: round4(paid ? adequacy01 : unpaid01),
    }],
    settlementAction,
    ...(dispositionActive ? { dispositionDeltas } : {}),
  };
}

/**
 * Forgive an existing internal reimbursement without calling it paid.  The
 * obligation is consumed through the same fold, but no food moves and the
 * evidence/incident vocabulary remains explicitly distinct.
 * @param {{worldState?:Record<string,unknown>, snapshot?:unknown,
 *   coalitionSettlementId?:unknown, callerId?:unknown, memberId?:unknown, closureId?:unknown,
 *   relationshipKey?:unknown, amount01?:number, tick?:number|null}} [args]
 */
export function forgiveCoalitionReimbursement({
  worldState,
  snapshot,
  coalitionSettlementId,
  callerId,
  memberId,
  closureId,
  relationshipKey,
  amount01 = 1,
  tick = null,
} = {}) {
  const settlementId = explicitId(coalitionSettlementId);
  const caller = explicitId(callerId);
  const member = explicitId(memberId);
  const closure = explicitId(closureId);
  const pairKey = explicitId(relationshipKey);
  const amount = finite01(amount01);
  const at = wholeTick(tick ?? asObject(worldState).tick);
  const unchanged = { worldState, changed: false, coalitionEvidence: [], relationshipPatches: [] };
  if (!coalitionLedgerActive(worldState)
    || !settlementId || !caller || !member || !closure || !pairKey || caller === member
    || amount == null || amount <= 0 || at == null) return unchanged;
  if (!Object.hasOwn(asObject(asObject(worldState).relationshipStates), pairKey)
    || !relationshipPairExists(snapshot, pairKey, caller, member)) return unchanged;
  const actionId = `${settlementId}.${closure}.forgiveness`;
  if (actionAlreadyRecorded(worldState, pairKey, actionId)) return unchanged;
  const prior = /** @type {Record<string, unknown>|null} */ (getSpatialLedger(worldState, 'obligations'));
  const key = obligationKey(caller, member, COALITION_REIMBURSEMENT_KIND);
  const liveMagnitude = finite01(asObject(prior?.[key]).magnitude);
  // V1 forgiveness is deliberately all-or-nothing. A partial request cannot
  // consume the sole exact-once action id and then falsely announce that the
  // remaining debt was forgiven.
  if (!prior || liveMagnitude == null || liveMagnitude <= REACTION_TUNING.OBLIGATION_EPS
    || amount + REACTION_TUNING.OBLIGATION_EPS < liveMagnitude) return unchanged;
  const next = foldObligations(prior, {
    mints: [],
    repayments: [{
      from: caller,
      to: member,
      kind: COALITION_REIMBURSEMENT_KIND,
      amount: liveMagnitude,
    }],
    now: at,
    decayPerTick: 0,
  });
  const settlementAction = {
    actionId,
    coalitionSettlementId: settlementId,
    closureId: closure,
    relationshipKey: pairKey,
    fromId: caller,
    toId: member,
    action: 'forgiveness',
    tick: at,
    status: 'forgiven',
  };
  const archivedState = archiveSettlementAction(
    worldState,
    settlementAction,
    'coalition_reimbursement_forgiven',
    liveMagnitude,
    relationshipPairEdge(snapshot, pairKey, caller, member),
  );
  if (!archivedState) return unchanged;
  const nextState = next
    ? setSpatialLedger(archivedState, 'obligations', next)
    : dropSpatialLedger(archivedState, 'obligations');
  return {
    worldState: nextState,
    changed: nextState !== worldState,
    coalitionEvidence: [{
      id: `coalition-debt-forgiven.${stablePart(settlementId)}.${stablePart(caller)}.${stablePart(member)}`,
      kind: 'coalition_reimbursement_forgiven',
      tick: at,
      coalitionSettlementId: settlementId,
      settlementId: member,
      counterpartId: caller,
      obligationKind: COALITION_REIMBURSEMENT_KIND,
      paidByTransfer: false,
    }],
    relationshipPatches: [{
      fromId: caller,
      toId: member,
      coalitionSettlementId: settlementId,
      incidentType: 'coalition_reimbursement_forgiven',
      severity: round4(liveMagnitude),
    }],
    settlementAction,
  };
}
