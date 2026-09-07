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
// W-COIN-3 — the SAME coffers reading warCosts uses, and the same by-name flag door.
import { coffersRead, treasuryActive } from './treasury.js';
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

/**
 * W-COIN-3 — THE SIBLING SIX-WEIGHT SET, used ONLY on a tick where the crown's purse is
 * actually observed. The five-weight set above is FROZEN and untouched, which is what
 * keeps every dark world — and every lit world whose ledger is younger than the
 * observation window, and every party with no army in the field — reading its coalition
 * pressure byte-identically to the day before this car landed.
 *
 * ⚠ A SIBLING SET RATHER THAN A SIXTH KEY ON THE EXISTING ONE, deliberately: adding
 * `COFFERS_W` to the frozen object would leave the five old weights summing to 0.85
 * whenever coffers was unobserved, silently deflating every unobserved read. Two closed
 * sets, each summing to exactly 1, and a test that asserts both do.
 *
 * The five are shaved PROPORTIONALLY to make room, so the relative standing of population,
 * attrition, force, home front and territory is unchanged — money is added to the picture
 * without re-ranking what was already in it. TUNING-SIGNATURE-ADJACENT, every value.
 */
export const COALITION_EXPENDITURE_TUNING_WITH_COFFERS = Object.freeze({
  POPULATION_W: 0.22,
  ATTRITION_W: 0.21,
  FORCE_LOSS_W: 0.13,
  HOME_FRONT_W: 0.21,
  TERRITORY_W: 0.08,
  COFFERS_W: 0.15,
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
 * @param {{worldState?:unknown,snapshot?:unknown,partyId?:unknown,targetId?:unknown,
 *   deployment?:unknown,tick?:unknown}} [args]
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

  // W-COIN-3 — THE COFFERS TERM, through the SAME reading warCosts uses (one question,
  // one expression) and behind the same by-name flag door. Unobserved ⇒ the frozen
  // five-weight set runs exactly as before, so this is additive-zero on every world the
  // treasury has nothing true to say about.
  const coffers = treasuryActive(state.simulationRules)
    ? coffersRead(/** @type {Parameters<typeof coffersRead>[0]} */ (settlement), record, now)
    : null;
  const T = coffers?.observed ? COALITION_EXPENDITURE_TUNING_WITH_COFFERS : COALITION_EXPENDITURE_TUNING;
  const pressure01 = round4(clamp01(
    population01 * T.POPULATION_W
    + attrition01 * T.ATTRITION_W
    + forceLoss01 * T.FORCE_LOSS_W
    + homeFront.score01 * T.HOME_FRONT_W
    + territorialExposure01 * T.TERRITORY_W
    + (coffers?.observed ? coffers.score01 * COALITION_EXPENDITURE_TUNING_WITH_COFFERS.COFFERS_W : 0),
  ));
  const band = warHomeFrontBand(pressure01);
  const completeness = {
    population: deployed != null && livePopulation != null,
    force: maxStrength != null && currentStrength != null,
    homeFront: Object.keys(settlement).length > 0,
    territory: true,
    storesHistorical: false,
    namedCast: false,
    // FALSE until the ledger has history: a newly-opened empty treasury must never be
    // read as a court that has been proven broke (the completeness idiom, applied to the
    // one component whose emptiness has two completely different causes).
    //
    // ⛔ THE KEY IS ABSENT ENTIRELY ON A DARK WORLD, not present-and-false. `completeness`
    // is part of this read's returned record, and A KEY IS A BYTE: writing `coffers: false`
    // unconditionally would have changed the shape of every dark campaign's coalition read
    // while every unit fixture stayed green. Present-and-false is the LIT world's honest
    // "not yet"; absent is the dark world's "there is no such question here".
    ...(coffers ? { coffers: coffers.observed } : {}),
  };
  const components = {
    population: { band: warHomeFrontBand(population01), source: 'deployment.deployedPopulation', complete: completeness.population },
    attrition: { band: warHomeFrontBand(attrition01), source: 'deployment.accumulatedAttrition', complete: accumulated != null || completeness.force },
    force: { band: warHomeFrontBand(forceLoss01), source: 'deployment.currentEffectiveStrength', complete: completeness.force },
    homeFront: { band: homeFront.band, durationBand: homeFront.durationBand, source: 'warCosts.readWarHomeFront', complete: completeness.homeFront },
    territory: { band: warHomeFrontBand(territorialExposure01), heldSettlementIds: held, ...(occupiedBy ? { occupiedBy } : {}), source: 'worldState.occupations', complete: true },
    // W-COIN-3 — present only when the purse is observed, for the same key-is-a-byte
    // reason as the completeness row above. Unlike readWarHomeFront's aggregate this one
    // is weighted rather than averaged, so an absent component does not dilute — but a
    // present one on a dark world would still be a shape change nobody asked for.
    ...(coffers?.observed ? {
      coffers: { band: warHomeFrontBand(coffers.score01), source: 'economicState.treasury.coin', complete: true },
    } : {}),
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
