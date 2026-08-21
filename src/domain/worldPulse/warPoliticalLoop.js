/**
 * warPoliticalLoop.js — WR-5 amendment H, the coalition inside the walls.
 *
 * A peace decision can organize an existing opposition faction against the
 * governing seat.  This module does not create a coup or guarantee a transfer:
 * it deposits a bounded, typed grievance through the existing faction-pair
 * writer. `factionCompetition` may later read that pressure through its normal
 * legitimacy/challenge gate, so a secure ruler can survive it.  If the opposing
 * faction eventually takes power, its exact desired war action can be carried by
 * the ladder-owned seat transition.
 */

import { factionArchetype } from '../factionArchetypes.js';
import { governingFactionOf } from '../rulingPower.js';
import { mintFactionPairIncident, selectWarDecisionIncident } from './factionPairLedger.js';
import { factionCompetitionId } from './factionCompetition.js';
import { memoryWeaveActive } from './relationshipEvolution.js';

export const WAR_POLITICAL_TUNING = Object.freeze({
  MAX_OPPOSITION_DEPOSITS: 3,
  RESENTMENT_GAIN: 0.14,
  BASE_SEVERITY: 0.36,
  POWER_SEVERITY_SPAN: 0.34,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function factionName(value) {
  const row = asObject(value);
  return String(row.faction || row.name || row.label || '').trim();
}

/** @param {Record<string, unknown>} faction @returns {number} */
function power01(faction) {
  const raw = Number(faction.power ?? faction.influence ?? faction.score ?? faction.weight);
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(1, raw > 1 ? raw / 100 : raw));
}

/** Resolve a settlement item from either snapshot index shape. */
function itemFor(snapshot, id) {
  if (snapshot?.byId instanceof Map) return snapshot.byId.get(id) || null;
  return (Array.isArray(snapshot?.settlements) ? snapshot.settlements : [])
    .find((row) => String(asObject(row).id || '') === id) || null;
}

/** The authoritative faction roster, preserving the generator's canonical order. */
function factionsOf(item) {
  const settlement = asObject(asObject(item).settlement || item);
  const power = asObject(settlement.powerStructure);
  const politics = asObject(settlement.politics);
  const raw = Array.isArray(power.factions) ? power.factions
    : Array.isArray(settlement.factions) ? settlement.factions
      : Array.isArray(politics.factions) ? politics.factions : [];
  return /** @type {Record<string, unknown>[]} */ (raw.map(asObject));
}

/**
 * A faction's stable war preference. Null means the existing evidence does not
 * entitle WR-5 to invent one. The categories reuse the estate-wide archetype
 * detector; this is no second faction ontology.
 *
 * @param {Record<string, unknown>} faction
 * @returns {'peace'|'continue'|null}
 */
export function factionWarPreference(faction) {
  const archetype = String(factionArchetype(/** @type {any} */ (faction)) || '');
  if (['military', 'noble', 'occupation', 'outsider'].includes(archetype)) return 'continue';
  if (['merchant', 'craft', 'labor', 'civic'].includes(archetype)) return 'peace';
  return null;
}

/**
 * Deposit opposition to one actual war decision through the faction-pair plane.
 * Aligned factions write nothing. Missing faction/memory machinery is a no-op.
 *
 * @param {{
 *   worldState:Record<string,unknown>,snapshot?:unknown,actorId:string,targetId:string,
 *   actualAction:'peace'|'continue',decisionId:string,tick?:unknown,
 * }} args
 * @returns {{worldState:Record<string,unknown>,deposits:Array<Record<string,unknown>>}}
 */
export function applyWarDecisionPolitics({
  worldState,
  snapshot = null,
  actorId,
  targetId,
  actualAction,
  decisionId,
  tick = null,
}) {
  const rules = asObject(worldState.simulationRules);
  if (rules.warLayerEnabled !== true
    || rules.warTerminationEnabled !== true
    || rules.factionCompetitionEnabled !== true
    || !memoryWeaveActive(worldState)) {
    return { worldState, deposits: [] };
  }
  const item = itemFor(snapshot, actorId);
  const settlement = asObject(asObject(item).settlement || item);
  const governing = governingFactionOf(/** @type {any} */ (settlement));
  if (!governing) return { worldState, deposits: [] };
  const governingRow = asObject(governing);
  const factions = factionsOf(item);
  const governingIndex = factions.indexOf(governingRow);
  const governingId = factionCompetitionId(actorId, /** @type {any} */ (governingRow), Math.max(0, governingIndex));
  const governingName = factionName(governingRow);
  if (!governingId || !governingName) return { worldState, deposits: [] };

  const candidates = factions
    .map((faction, index) => ({ faction, index }))
    .filter(({ faction }) => faction !== governingRow && faction.isGoverning !== true)
    .map(({ faction, index }) => ({ faction, index, desiredAction: factionWarPreference(faction) }))
    .filter((row) => row.desiredAction && row.desiredAction !== actualAction)
    .sort((a, b) => (power01(b.faction) - power01(a.faction))
      || (factionCompetitionId(actorId, /** @type {any} */ (a.faction), a.index)
        < factionCompetitionId(actorId, /** @type {any} */ (b.faction), b.index) ? -1 : 1))
    .slice(0, WAR_POLITICAL_TUNING.MAX_OPPOSITION_DEPOSITS);
  let state = worldState;
  /** @type {Array<Record<string,unknown>>} */
  const deposits = [];
  const atTick = Number.isFinite(Number(tick)) ? Math.max(0, Math.floor(Number(tick))) : 0;
  const weeks = Number.isFinite(Number(asObject(worldState.calendar).elapsedWeeks))
    ? Math.max(0, Math.floor(Number(asObject(worldState.calendar).elapsedWeeks)))
    : atTick;
  for (const row of candidates) {
    const oppositionId = factionCompetitionId(actorId, /** @type {any} */ (row.faction), row.index);
    const oppositionName = factionName(row.faction);
    if (!oppositionId || !oppositionName || oppositionId === governingId) continue;
    const severity = Math.max(0, Math.min(1,
      WAR_POLITICAL_TUNING.BASE_SEVERITY
        + power01(row.faction) * WAR_POLITICAL_TUNING.POWER_SEVERITY_SPAN));
    const context = {
      decisionId,
      settlementId: actorId,
      actorId,
      targetId,
      actualAction,
      desiredAction: row.desiredAction,
      factionId: oppositionId,
      factionName: oppositionName,
      governingFactionId: governingId,
      governingFactionName: governingName,
    };
    const next = mintFactionPairIncident(state, {
      a: governingId,
      b: oppositionId,
      type: 'war_decision',
      resentmentDelta: WAR_POLITICAL_TUNING.RESENTMENT_GAIN,
      sev: severity,
      tick: atTick,
      weeks,
      context,
    });
    if (next !== state) deposits.push(context);
    state = next;
  }
  return { worldState: state, deposits };
}

/**
 * Recover the newest unresolved war demand carried by the faction that is now
 * being installed. The pair ledger is the organizing grievance; the caller
 * copies this typed subset into the seat transition, never the whole incident.
 *
 * @param {Record<string,unknown>} worldState
 * @param {unknown} settlement
 * @param {string} actorId
 * @param {string} installerFactionId
 * @param {{decisionId?:unknown,carriedDemand?:unknown}|null} [binding]
 * @returns {{actorId:string,targetId:string,decisionId:string,desiredAction:'peace'|'continue'}|null}
 */
export function warDemandForInstaller(
  worldState,
  settlement,
  actorId,
  installerFactionId,
  binding = null,
) {
  const rules = asObject(worldState.simulationRules);
  if (rules.warLayerEnabled !== true || rules.warTerminationEnabled !== true) return null;
  const governing = governingFactionOf(/** @type {any} */ (asObject(settlement)));
  if (!governing) return null;
  const factions = factionsOf(settlement);
  const governingRow = asObject(governing);
  const governingId = factionCompetitionId(
    actorId,
    /** @type {any} */ (governingRow),
    Math.max(0, factions.indexOf(governingRow)),
  );
  const requestedId = binding?.decisionId == null ? null : String(binding.decisionId || '');
  if (requestedId === '') return null;
  const incident = selectWarDecisionIncident(
    worldState,
    governingId,
    installerFactionId,
    requestedId,
  );
  const carried = asObject(binding?.carriedDemand);
  const source = incident?.context || carried;
  const desired = String(source.desiredAction || '');
  const decisionId = String(source.decisionId || '');
  const targetId = String(source.targetId || '');
  if (String(source.actorId || '') !== actorId
    || (requestedId != null && decisionId !== requestedId)
    || !['peace', 'continue'].includes(desired)
    || !targetId
    || targetId === actorId
    || !decisionId) return null;
  // If the bounded pair history still holds the grievance, a persisted proposal
  // must agree with it exactly. If the ring has since evicted it, the proposal's
  // own immutable typed demand remains sufficient evidence of what was approved.
  if (incident && Object.keys(carried).length) {
    if (String(carried.actorId || '') !== actorId
      || String(carried.targetId || '') !== targetId
      || String(carried.decisionId || '') !== decisionId
      || String(carried.desiredAction || '') !== desired) return null;
  }
  return {
    actorId,
    targetId,
    decisionId,
    desiredAction: /** @type {'peace'|'continue'} */ (desired),
  };
}
