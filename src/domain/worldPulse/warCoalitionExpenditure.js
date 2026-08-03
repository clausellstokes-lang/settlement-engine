/**
 * warCoalitionExpenditure.js — WR-6's derived bill for an allied war edge.
 *
 * A coalition member owns an ordinary deployment.  The only thing that makes
 * that deployment coalition business is its valid `joinLedger` anchor; sharing
 * a target is not membership.  The bill below is a current-episode read over
 * facts the war and home-front engines already own.  It stores no running total,
 * invents no named casualty, and does not reconstruct food movements that pulse
 * history did not retain.
 */

import { clamp01 } from '../../kernel/math.js';
import { readWarHomeFront, warHomeFrontBand } from './warCosts.js';
import { stablePart } from './stablePart.js';
import { joinAnchorOf, warCoalitionActive } from './warCoalitionLedger.js';

export const COALITION_REIMBURSEMENT_KIND = 'coalition_reimbursement';

export const COALITION_EXPENDITURE_TUNING = Object.freeze({
  POPULATION_W: 0.25,
  ATTRITION_W: 0.25,
  FORCE_LOSS_W: 0.15,
  HOME_FRONT_W: 0.25,
  TERRITORY_W: 0.10,
  POPULATION_FULL_AT: 0.12,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number|null} */
function finiteNonNegative(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

/** @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** Exact WR-6 feature gate.  Partial lighting is the dark path. */
export function coalitionLedgerActive(worldState) {
  return warCoalitionActive(worldState);
}

/**
 * Read the one unambiguous alliance-obligation anchor on a deployment.
 * Malformed, future-dated, or multi-origin ledgers fail closed.
 *
 * @param {unknown} deployment
 * @param {unknown} [partyId]
 * @param {unknown} [throughTick]
 * @returns {ReturnType<typeof joinAnchorOf>}
 */
export function coalitionJoinAnchor(deployment, partyId = null, throughTick = Number.POSITIVE_INFINITY) {
  const anchor = joinAnchorOf(deployment, partyId == null ? null : String(partyId));
  if (!anchor) return null;
  const ceiling = Number(throughTick);
  if (Number.isFinite(ceiling) && anchor.joinedTick > ceiling) return null;
  return anchor;
}

/**
 * Coalition members connected to `partyId` for one target.  Edges exist only
 * where the joined deployment has a valid anchor and the caller still owns a
 * live deployment against that same target.  The result is the codepoint-sorted
 * connected component; unrelated same-target attackers never enter it.
 *
 * @param {unknown} deployments
 * @param {unknown} partyId
 * @param {unknown} targetId
 * @param {unknown} [tick]
 * @returns {string[]}
 */
export function coalitionMembersForParty(deployments, partyId, targetId, tick = Number.POSITIVE_INFINITY) {
  const rows = asObject(deployments);
  const party = String(partyId || '');
  const target = String(targetId || '');
  if (!party || !target || String(asObject(rows[party]).targetId || '') !== target) return [];
  /** @type {Map<string, Set<string>>} */
  const graph = new Map();
  const link = (/** @type {string} */ a, /** @type {string} */ b) => {
    if (!graph.has(a)) graph.set(a, new Set());
    if (!graph.has(b)) graph.set(b, new Set());
    /** @type {Set<string>} */ (graph.get(a)).add(b);
    /** @type {Set<string>} */ (graph.get(b)).add(a);
  };
  for (const joinedId of Object.keys(rows).sort()) {
    const joined = asObject(rows[joinedId]);
    if (String(joined.targetId || '') !== target) continue;
    const anchor = coalitionJoinAnchor(joined, joinedId, tick);
    if (!anchor) continue;
    if (String(asObject(rows[anchor.callerId]).targetId || '') !== target) continue;
    link(joinedId, anchor.callerId);
  }
  if (!graph.has(party)) return [party];
  const seen = new Set([party]);
  const queue = [party];
  while (queue.length) {
    const current = /** @type {string} */ (queue.shift());
    for (const next of [...(graph.get(current) || [])].sort()) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return [...seen].sort();
}

/** @param {unknown} snapshot @param {string} id */
function settlementFor(snapshot, id) {
  const row = asObject(asObject(snapshot).byId instanceof Map
    ? /** @type {Map<string, unknown>} */ (asObject(snapshot).byId).get(id)
    : null);
  return asObject(row.settlement || asObject(row.save).settlement);
}

/**
 * Current, attributable expenditure for one joined party.
 *
 * Missing historical food/cast facts are not guessed: `completeness` says what
 * the live episode could establish.  Healed attrition and evicted occupations
 * are current zero by design, not retroactive cumulative claims.
 *
 * @param {{worldState?:unknown,snapshot?:unknown,partyId:unknown,targetId:unknown,
 *   deployment?:unknown,tick?:unknown}} args
 * @returns {null|{partyId:string,callerId:string,targetId:string,joinedTick:number,
 *   pressure01:number,band:string,components:Record<string,unknown>,
 *   completeness:Record<string,boolean>,receipt:Record<string,unknown>}}
 */
export function readCoalitionExpenditure({
  worldState = null,
  snapshot = null,
  partyId,
  targetId,
  deployment = null,
  tick = null,
} = {}) {
  if (!coalitionLedgerActive(worldState)) return null;
  const state = asObject(worldState);
  const party = String(partyId || '');
  const target = String(targetId || '');
  const record = Object.keys(asObject(deployment)).length
    ? asObject(deployment)
    : asObject(asObject(state.deployments)[party]);
  if (!party || !target || party === target || String(record.targetId || '') !== target) return null;
  const now = finiteNonNegative(tick ?? state.tick);
  if (now == null) return null;
  const anchor = coalitionJoinAnchor(record, party, now);
  if (!anchor) return null;

  const settlement = settlementFor(snapshot, party);
  const deployed = finiteNonNegative(record.deployedPopulation);
  const sourceRows = asObject(record.leviedPopulationBySource);
  const sourced = Object.values(sourceRows)
    .map(finiteNonNegative)
    .filter((value) => value != null)
    .reduce((sum, value) => sum + Number(value), 0);
  const ownDeployed = deployed == null ? 0 : Math.max(0, deployed - sourced);
  const livePopulation = finiteNonNegative(settlement.population);
  const populationShare01 = deployed != null && livePopulation != null
    ? clamp01(ownDeployed / Math.max(1, ownDeployed + livePopulation))
    : 0;
  const population01 = clamp01(populationShare01 / COALITION_EXPENDITURE_TUNING.POPULATION_FULL_AT);

  const maxStrength = finiteNonNegative(record.maxStartStrength);
  const currentStrength = finiteNonNegative(record.currentEffectiveStrength);
  const accumulated = finiteNonNegative(record.accumulatedAttrition);
  const forceLoss01 = maxStrength != null && maxStrength > 0 && currentStrength != null
    ? clamp01(1 - currentStrength / maxStrength)
    : 0;
  const attrition01 = accumulated == null ? forceLoss01 : clamp01(accumulated);

  // Rebase the existing WR-4 attribution window on the real join tick.  This
  // changes no underlying fact and prevents pre-entry damage entering the bill.
  const homeFront = readWarHomeFront({
    actorId: party,
    deployment: {
      ...record,
      sinceTick: anchor.joinedTick,
      deploymentAge: Math.max(0, now - anchor.joinedTick),
    },
    worldState: state,
    snapshot: /** @type {any} */ (snapshot),
  });

  const occupations = asObject(state.occupations);
  const targetOccupation = asObject(occupations[target]);
  const targetOccupationSince = finiteNonNegative(targetOccupation.sinceTick);
  const held = String(targetOccupation.occupierId || '') === party
    && targetOccupationSince != null
    && targetOccupationSince >= anchor.joinedTick
    ? [target]
    : [];
  const homeOccupation = asObject(occupations[party]);
  const homeOccupationSince = finiteNonNegative(homeOccupation.sinceTick);
  const occupiedBy = homeOccupationSince != null
    && homeOccupationSince >= anchor.joinedTick
    ? String(homeOccupation.occupierId || '')
    : '';
  const territorialExposure01 = held.length || occupiedBy ? 1 : 0;

  const T = COALITION_EXPENDITURE_TUNING;
  const pressure01 = round4(clamp01(
    population01 * T.POPULATION_W
    + attrition01 * T.ATTRITION_W
    + forceLoss01 * T.FORCE_LOSS_W
    + homeFront.score01 * T.HOME_FRONT_W
    + territorialExposure01 * T.TERRITORY_W,
  ));
  const band = warHomeFrontBand(pressure01);
  const completeness = {
    population: deployed != null && livePopulation != null,
    force: maxStrength != null && currentStrength != null,
    homeFront: Object.keys(settlement).length > 0,
    territory: true,
    storesHistorical: false,
    namedCast: false,
  };
  const components = {
    population: { band: warHomeFrontBand(population01), source: 'deployment.deployedPopulation', complete: completeness.population },
    attrition: { band: warHomeFrontBand(attrition01), source: 'deployment.accumulatedAttrition', complete: accumulated != null || completeness.force },
    force: { band: warHomeFrontBand(forceLoss01), source: 'deployment.currentEffectiveStrength', complete: completeness.force },
    homeFront: { band: homeFront.band, durationBand: homeFront.durationBand, source: 'warCosts.readWarHomeFront', complete: completeness.homeFront },
    territory: { band: warHomeFrontBand(territorialExposure01), heldSettlementIds: held, ...(occupiedBy ? { occupiedBy } : {}), source: 'worldState.occupations', complete: true },
  };
  return {
    partyId: party,
    callerId: anchor.callerId,
    targetId: target,
    joinedTick: anchor.joinedTick,
    pressure01,
    band,
    components,
    completeness,
    receipt: {
      id: `coalition-expenditure.${stablePart(party)}.${stablePart(target)}.${Math.floor(now)}`,
      kind: 'coalition_expenditure_read',
      tick: Math.floor(now),
      settlementId: party,
      callerId: anchor.callerId,
      counterpartId: anchor.callerId,
      targetId: target,
      joinedTick: anchor.joinedTick,
      band,
      componentBands: Object.fromEntries(
        Object.entries(components).map(([key, value]) => [key, String(asObject(value).band || 'quiet')]),
      ),
      incompleteEvidence: Object.keys(completeness).filter((key) => completeness[key] !== true).sort(),
    },
  };
}

/**
 * Build the exact callback WR-1 accepts.  A non-coalition deployment returns
 * `undefined`, deliberately selecting WR-1's existing fallback arithmetic.
 *
 * @param {{worldState?:unknown,snapshot?:unknown,tick?:unknown}} args
 * @returns {(partyId:string,targetId:string,deployment:Record<string,unknown>)=>number|undefined}
 */
export function coalitionSunkCostPressureFor({ worldState = null, snapshot = null, tick = null } = {}) {
  return (partyId, targetId, deployment) => readCoalitionExpenditure({
    worldState,
    snapshot,
    partyId,
    targetId,
    deployment,
    tick,
  })?.pressure01;
}
