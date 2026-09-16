/**
 * warCosts.js — WR-4's pure comparative-cost trajectory read.
 *
 * The pulse receipt already supplies the temporal memory: compare its prior
 * actor-side BELIEVED balance band with the current one.  A court whose balance
 * is improving expects later terms to cost less; a worsening court expects them
 * to cost more.  First observation, missing history, or an unchanged band is
 * deliberately EVEN and emits no deciding receipt.
 *
 * Truth is kept in a separate diagnostic function.  It can expose a mistaken
 * court after the fact, but cannot become a hidden input to the behavioral
 * comparison.  This leaf owns no state, performs no roll, and imports no writer.
 */

import { clamp01 } from '../../kernel/math.js';
import { readRouteNetwork } from './routeNetworkLedger.js';
import { storageCapacityMonths } from './foodStockpile.js';
import {
  institutionStatusRef,
  readInstitutionStatusLedger,
} from './institutionStatusModel.js';
import { normalizeRelationshipType } from './relationshipState.js';

/** Ordered weakest-to-strongest; order is the trajectory and is codepoint-independent. */
export const WAR_COST_BALANCE_BANDS = Object.freeze([
  'far_behind',
  'behind',
  'matched',
  'ahead',
  'far_ahead',
]);

/** The complete WR-4 trajectory vocabulary. */
export const WAR_COST_TRAJECTORIES = Object.freeze(['losing', 'even', 'winning']);

/** Closed magnitude of an observed directional band step. */
export const WAR_COST_TRAJECTORY_MARGIN_BANDS = Object.freeze(['narrow', 'clear']);

/** Closed home-front pressure vocabulary, shared by the aggregate and five reads. */
export const WAR_HOME_FRONT_BANDS = Object.freeze([
  'quiet',
  'present',
  'pressing',
  'decisive',
]);

/** Closed duration vocabulary. Duration scales evidence; it never supplies evidence. */
export const WAR_HOME_FRONT_DURATION_BANDS = Object.freeze([
  'opening',
  'sustained',
  'protracted',
]);

/** Owner-retunable cutoffs over the peace engine's internal -1..1 advantage. */
export const WAR_COSTS_TUNING = Object.freeze({
  FAR_BEHIND_AT: -0.45,
  MATCHED_LOW: -0.08,
  MATCHED_HIGH: 0.08,
  FAR_AHEAD_AT: 0.45,
  HOME_PRESENT_AT: 0.12,
  HOME_PRESSING_AT: 0.38,
  HOME_DECISIVE_AT: 0.68,
  HANDS_FULL_AT: 0.12,
  INSTITUTIONS_FULL_AT: 0.5,
  MARKET_LOSS_WEIGHT: 0.5,
  DURATION_SUSTAINED_AT: 8,
  DURATION_PROTRACTED_AT: 24,
  DURATION_GAIN_PER_TICK: 0.025,
  DURATION_GAIN_CAP: 1,
});

const BALANCE_INDEX = new Map(WAR_COST_BALANCE_BANDS.map((band, index) => [band, index]));
const TRAJECTORY_SET = new Set(WAR_COST_TRAJECTORIES);
const BELIEF_STATE_READ = 'believed_balance_band_history';
const TRUTH_STATE_READ = 'true_balance_band_history';

const WINNING_COMPARISON = Object.freeze({
  endNowCost: 'higher',
  endLaterCost: 'lower',
  preferredTiming: 'later',
  pressure: 'continue',
});

const LOSING_COMPARISON = Object.freeze({
  endNowCost: 'lower',
  endLaterCost: 'higher',
  preferredTiming: 'now',
  pressure: 'sue',
});

/** @param {unknown} value @returns {number} */
function finiteAdvantage(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return value < -1 ? -1 : value > 1 ? 1 : value;
}

/**
 * Close the peace engine's actor-side advantage into the five receipt-safe
 * balance bands.  Invalid input fails neutral rather than inventing direction.
 *
 * @param {unknown} advantage internal self-minus-foe advantage, normally -1..1
 * @returns {'far_behind'|'behind'|'matched'|'ahead'|'far_ahead'}
 */
export function warCostBalanceBand(advantage) {
  const value = finiteAdvantage(advantage);
  if (value <= WAR_COSTS_TUNING.FAR_BEHIND_AT) return 'far_behind';
  if (value < WAR_COSTS_TUNING.MATCHED_LOW) return 'behind';
  if (value <= WAR_COSTS_TUNING.MATCHED_HIGH) return 'matched';
  if (value < WAR_COSTS_TUNING.FAR_AHEAD_AT) return 'ahead';
  return 'far_ahead';
}

/** @param {unknown} value @returns {value is typeof WAR_COST_BALANCE_BANDS[number]} */
function isBalanceBand(value) {
  return typeof value === 'string' && BALANCE_INDEX.has(value);
}

/**
 * @param {unknown} priorBand
 * @param {unknown} currentBand
 * @returns {{observed:boolean,trajectory:'losing'|'even'|'winning',trajectoryMarginBand:null|'narrow'|'clear'}}
 */
function trajectoryFromBands(priorBand, currentBand) {
  if (!isBalanceBand(priorBand) || !isBalanceBand(currentBand)) {
    return { observed: false, trajectory: 'even', trajectoryMarginBand: null };
  }
  const prior = BALANCE_INDEX.get(priorBand);
  const current = BALANCE_INDEX.get(currentBand);
  if (prior === current) {
    return { observed: true, trajectory: 'even', trajectoryMarginBand: null };
  }
  return {
    observed: true,
    trajectory: current > prior ? 'winning' : 'losing',
    trajectoryMarginBand: Math.abs(Number(current) - Number(prior)) >= 2
      ? 'clear'
      : 'narrow',
  };
}

/**
 * Find the newest persisted WR-1 receipt for this directed war pair.  History
 * order is normally chronological, but imported histories are not trusted: the
 * receipt's own finite tick decides newest, and `beforeTick` is a strict upper
 * bound so the current pulse cannot become its own prior.
 *
 * @param {unknown} worldState
 * @param {unknown} attackerId
 * @param {unknown} targetId
 * @param {unknown} [beforeTick]
 * @param {unknown} [atOrAfterTick] optional lower bound for the current
 *   deployment episode; prevents a fresh war between the same pair from
 *   inheriting the prior war's trajectory.
 * @returns {Record<string, unknown>|null}
 */
export function priorWarCostReceipt(
  worldState,
  attackerId,
  targetId,
  beforeTick = undefined,
  atOrAfterTick = undefined,
) {
  const state = asObject(worldState);
  const history = Array.isArray(state.pulseHistory) ? state.pulseHistory : [];
  const attacker = String(attackerId ?? '');
  const target = String(targetId ?? '');
  if (!attacker || !target) return null;
  const ceiling = typeof beforeTick === 'number' && Number.isFinite(beforeTick)
    ? beforeTick
    : Number.POSITIVE_INFINITY;
  const floor = typeof atOrAfterTick === 'number' && Number.isFinite(atOrAfterTick)
    ? atOrAfterTick
    : Number.NEGATIVE_INFINITY;
  /** @type {Record<string, unknown>|null} */
  let newest = null;
  let newestTick = Number.NEGATIVE_INFINITY;
  for (const rawPulse of history) {
    const pulse = asObject(rawPulse);
    const receipts = Array.isArray(pulse.warTerminationReads) ? pulse.warTerminationReads : [];
    for (const rawReceipt of receipts) {
      const receipt = asObject(rawReceipt);
      const tick = receipt.tick;
      if (receipt.kind !== 'war_termination_read'
        || String(receipt.attackerId ?? '') !== attacker
        || String(receipt.targetId ?? '') !== target
        || typeof tick !== 'number'
        || !Number.isFinite(tick)
        || tick < floor
        || tick >= ceiling
        || tick < newestTick) continue;
      newest = receipt;
      newestTick = tick;
    }
  }
  return newest;
}

/** @param {unknown} value @returns {number} */
function finiteNonNegative(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

/** @param {unknown} value @returns {number|null} */
function finiteTimestamp(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

/** @param {unknown} value @param {number} sinceTick @param {number} throughTick */
function timestampWithinDeployment(value, sinceTick, throughTick) {
  const tick = finiteTimestamp(value);
  return tick != null && tick >= sinceTick && tick <= throughTick;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {string} a @param {string} b @returns {number} */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {unknown} value @returns {string} */
function labelOf(value) {
  if (typeof value === 'string') return value.trim();
  const row = asObject(value);
  return String(row.label || row.name || row.good || '').trim();
}

/** @param {unknown} score @returns {'quiet'|'present'|'pressing'|'decisive'} */
export function warHomeFrontBand(score) {
  const value = clamp01(Number(score) || 0);
  if (value >= WAR_COSTS_TUNING.HOME_DECISIVE_AT) return 'decisive';
  if (value >= WAR_COSTS_TUNING.HOME_PRESSING_AT) return 'pressing';
  if (value >= WAR_COSTS_TUNING.HOME_PRESENT_AT) return 'present';
  return 'quiet';
}

/** @param {unknown} age @returns {'opening'|'sustained'|'protracted'} */
export function warHomeFrontDurationBand(age) {
  const ticks = finiteNonNegative(age);
  if (ticks >= WAR_COSTS_TUNING.DURATION_PROTRACTED_AT) return 'protracted';
  if (ticks >= WAR_COSTS_TUNING.DURATION_SUSTAINED_AT) return 'sustained';
  return 'opening';
}

/** Resolve a settlement name without ever presenting a raw engine id as prose. */
function memberName(snapshot, id) {
  const key = String(id ?? '').trim();
  if (!key) return '';
  const row = asObject(snapshot?.byId?.get?.(key));
  const save = asObject(row.save);
  const settlement = asObject(row.settlement || save.settlement);
  const candidates = [settlement.name, asObject(save.settlement).name, save.name, row.name];
  for (const candidate of candidates) {
    const name = typeof candidate === 'string' ? candidate.trim() : '';
    if (name && name !== key) return name;
  }
  return '';
}

/** @param {Record<string, unknown>} settlement @param {unknown} wanted */
function authoredGood(settlement, wanted = '') {
  const economy = asObject(settlement.economicState);
  const candidates = [
    ...(Array.isArray(economy.primaryImports) ? economy.primaryImports : []),
    ...(Array.isArray(economy.primaryExports) ? economy.primaryExports : []),
  ];
  const wantedText = String(wanted || '').trim().toLowerCase();
  if (wantedText) {
    const exact = candidates.find((candidate) => {
      const row = asObject(candidate);
      return [row.id, row.key, row.slug, labelOf(candidate)]
        .some((value) => String(value || '').trim().toLowerCase() === wantedText);
    });
    const label = labelOf(exact);
    if (label) return label;
    return '';
  }
  return labelOf(candidates[0]);
}

/** @param {Record<string, unknown>} component */
function receiptComponent(component) {
  const { score01: _score, ...safe } = component;
  return safe;
}

/**
 * Read WR-4's five existing home-front signals. Every component is independently
 * optional, duration is applied exactly once to their fixed-weight aggregate, and
 * a long war with no degradation remains exact zero.
 *
 * @param {{actorId:unknown,deployment?:Record<string,unknown>|null,
 *   worldState?:Record<string,unknown>|null,
 *   snapshot?:{byId?:Map<string,unknown>,regionalGraph?:{edges?:unknown[]}}|null}} args
 * @returns {{score01:number,band:string,durationBand:string,
 *   components:Record<string,Record<string,unknown>>,
 *   receiptComponents:Record<string,Record<string,unknown>>}}
 */
export function readWarHomeFront({
  actorId,
  deployment = null,
  worldState = null,
  snapshot = null,
} = {}) {
  const actor = String(actorId || '');
  const state = asObject(worldState);
  const record = asObject(deployment);
  const sinceTick = finiteTimestamp(record.sinceTick) ?? 0;
  const stateTick = finiteTimestamp(state.tick);
  const explicitAge = finiteTimestamp(record.deploymentAge);
  const age = explicitAge != null
    ? explicitAge
    : Math.max(0, (stateTick ?? sinceTick) - sinceTick);
  const throughTick = stateTick ?? (sinceTick + age);
  const item = asObject(snapshot?.byId?.get?.(actor));
  const save = asObject(item.save);
  const settlement = asObject(item.settlement || save.settlement);

  // ROADS — only a real downward grade step during this deployment counts.
  const network = readRouteNetwork(state);
  const roads = [];
  for (const [edgeId, rawEdge] of Object.entries(asObject(network?.edges))) {
    const edge = asObject(rawEdge);
    if (String(edge.a || '') !== actor && String(edge.b || '') !== actor) continue;
    const step = asObject(edge.gradeStep);
    if (step.direction !== 'down'
      || !timestampWithinDeployment(step.tick, sinceTick, throughTick)) continue;
    const scoreByGrade = { highway: 0.2, road: 0.35, track: 0.65, hidden: 1 };
    const score01 = scoreByGrade[String(edge.grade)] ?? 0;
    const aName = memberName(snapshot, edge.a);
    const bName = memberName(snapshot, edge.b);
    roads.push({
      edgeId,
      score01,
      route: aName && bName ? `the road between ${aName} and ${bName}` : '',
    });
  }
  roads.sort((a, b) => (b.score01 - a.score01) || codepoint(a.edgeId, b.edgeId));
  const roadScore = roads[0]?.score01 || 0;

  // STORES — the live stockpile itself says whether an outbound deployment is
  // drawing on it. A low pre-war granary without that mark is not attributed here.
  const economy = asObject(settlement.economicState);
  const food = asObject(economy.foodSecurity);
  const stockpile = asObject(food.stockpile);
  const storage = Number(food.storageMonths);
  const explicitCap = Number(stockpile.capacityMonths);
  const derivedCap = Object.keys(settlement).length
    ? storageCapacityMonths(/** @type {Parameters<typeof storageCapacityMonths>[0]} */ (settlement))
    : 0;
  const capacity = Number.isFinite(explicitCap) && explicitCap > 0 ? explicitCap : derivedCap;
  const storesObserved = stockpile.deployed === true
    && Number.isFinite(storage) && capacity > 0;
  const storeScore = storesObserved ? clamp01(1 - Math.max(0, storage) / capacity) : 0;

  // HANDS — the conserved aggregate bank is the only truthful wartime people
  // source. There is deliberately no guessed named person.
  const deployedPopulation = finiteNonNegative(record.deployedPopulation);
  const leviedPopulation = Object.values(asObject(record.leviedPopulationBySource))
    .reduce((sum, count) => sum + finiteNonNegative(count), 0);
  // The aggregate bank includes allied/vassal levies so they can be returned to
  // their real homes. This actor-home read may charge only the attacker's own
  // conscripts; otherwise an army made wholly of vassal levies empties the
  // overlord's workshops on paper.
  const actorDeployedPopulation = Math.max(0, deployedPopulation - leviedPopulation);
  const homePopulation = finiteNonNegative(settlement.population);
  const deployedShare = actorDeployedPopulation > 0
    ? actorDeployedPopulation / Math.max(1, homePopulation + actorDeployedPopulation)
    : 0;
  const handsScore = clamp01(deployedShare / WAR_COSTS_TUNING.HANDS_FULL_AT);

  // INSTITUTIONS — only shell annotations whose own sinceTick falls inside this
  // deployment are attributable. Current roster marks without a clock stay silent.
  const institutions = Array.isArray(settlement.institutions)
    ? settlement.institutions.map(asObject)
    : [];
  const statusLedger = asObject(readInstitutionStatusLedger(state));
  const actorStatuses = asObject(statusLedger[actor]);
  const shells = [];
  for (const institution of institutions) {
    const ref = institutionStatusRef(institution);
    const shell = asObject(asObject(actorStatuses[ref]).shell);
    if (!Object.keys(shell).length
      || !timestampWithinDeployment(shell.sinceTick, sinceTick, throughTick)) continue;
    shells.push({ ref, name: labelOf(institution) });
  }
  shells.sort((a, b) => codepoint(a.ref, b.ref));
  const institutionScore = institutions.length
    ? clamp01((shells.length / institutions.length) / WAR_COSTS_TUNING.INSTITUTIONS_FULL_AT)
    : 0;
  const temple = shells.map((shell) => shell.name)
    .find((name) => /\b(?:temple|shrine|chapel|abbey|monastery|chantry|church|cathedral)\b/i.test(name)) || '';

  // MARKETS — use both a durable relationship turning point and the live
  // primary-supplier contest ledger. Dedupe by lost counterpart.
  const lostPartners = new Map();
  const edges = Array.isArray(snapshot?.regionalGraph?.edges) ? snapshot.regionalGraph.edges : [];
  const relStates = asObject(state.relationshipStates);
  for (const rawEdge of edges) {
    const edge = asObject(rawEdge);
    const from = String(edge.from || edge.source || edge.a || '');
    const to = String(edge.to || edge.target || edge.b || '');
    if (from !== actor && to !== actor) continue;
    const edgeKey = String(edge.id || `rel.${from}.${to}`);
    const relState = asObject(relStates[edgeKey]);
    const currentType = normalizeRelationshipType(
      String(relState.relationshipType || edge.relationshipType || ''),
    );
    const relationshipStillLost = ![
      'trade_partner', 'allied', 'patron', 'client', 'vassal',
    ].includes(currentType);
    const history = Array.isArray(relState.turningPoints)
      ? relState.turningPoints
      : Array.isArray(relState.history) ? relState.history : [];
    const lost = history.map(asObject).some((turn) => (
      timestampWithinDeployment(turn.tick, sinceTick, throughTick)
      && String(turn.fromType || '') === 'trade_partner'
      && !['trade_partner', 'allied', 'ally', 'patron', 'client', 'vassal']
        .includes(String(turn.toType || ''))
    ));
    if (lost && relationshipStillLost) {
      const otherId = from === actor ? to : from;
      if (otherId) lostPartners.set(otherId, { counterpartId: otherId, good: '' });
    }
  }
  for (const rawPrize of Object.values(asObject(state.tradeWarState))) {
    const prize = asObject(rawPrize);
    const winnerId = String(prize.winnerId || '');
    const lossTicks = asObject(prize.lostSupplierSinceTick);
    let actorLossTick = finiteTimestamp(lossTicks[actor]);
    if (actorLossTick == null
      && Array.isArray(prize.lostSupplierIds)
      && prize.lostSupplierIds.map(String).includes(actor)) {
      actorLossTick = finiteTimestamp(prize.lastFlipTick);
    }
    // Legacy first-flip rows carried the displaced supplier in incumbentId.
    if (actorLossTick == null && String(prize.incumbentId || '') === actor) {
      actorLossTick = finiteTimestamp(prize.lastFlipTick);
    }
    if (actorLossTick == null
      || !winnerId
      || winnerId === actor
      || !timestampWithinDeployment(actorLossTick, sinceTick, throughTick)) continue;
    const counterpartId = String(prize.buyerId || '');
    if (!counterpartId) continue;
    lostPartners.set(counterpartId, {
      counterpartId,
      good: authoredGood(settlement, prize.commodityId),
    });
  }
  const lost = [...lostPartners.values()].sort((a, b) => codepoint(a.counterpartId, b.counterpartId));
  const marketScore = clamp01(lost.length * WAR_COSTS_TUNING.MARKET_LOSS_WEIGHT);

  const components = {
    roads: {
      score01: roadScore,
      band: warHomeFrontBand(roadScore),
      stateRead: 'routeNetwork.edge.gradeStep',
      ...(roads[0]?.route ? { route: roads[0].route } : {}),
    },
    stores: {
      score01: storeScore,
      band: warHomeFrontBand(storeScore),
      stateRead: 'economicState.foodSecurity.storageMonths',
    },
    hands: {
      score01: handsScore,
      band: warHomeFrontBand(handsScore),
      stateRead: 'deployment.deployedPopulation|leviedPopulationBySource',
    },
    institutions: {
      score01: institutionScore,
      band: warHomeFrontBand(institutionScore),
      stateRead: 'institutionStatus.shell.sinceTick',
      ...(temple ? { temple } : {}),
    },
    markets: {
      score01: marketScore,
      band: warHomeFrontBand(marketScore),
      stateRead: 'relationship.turningPoints|tradeWarState',
      ...(lost[0]?.counterpartId ? { counterpartId: lost[0].counterpartId } : {}),
      ...(lost[0]?.good ? { good: lost[0].good } : {}),
    },
  };
  const componentScores = Object.values(components).map((component) => Number(component.score01) || 0);
  const base = componentScores.reduce((sum, value) => sum + value, 0) / componentScores.length;
  const durationGain = Math.min(
    WAR_COSTS_TUNING.DURATION_GAIN_CAP,
    age * WAR_COSTS_TUNING.DURATION_GAIN_PER_TICK,
  );
  const score01 = base === 0 ? 0 : clamp01(base * (1 + durationGain));
  return {
    score01,
    band: warHomeFrontBand(score01),
    // Age is an amplifier, never evidence.  With no attributable degradation,
    // even the duration word stays byte-identical to first contact.
    durationBand: base === 0 ? 'opening' : warHomeFrontDurationBand(age),
    components,
    receiptComponents: Object.fromEntries(
      Object.entries(components).map(([key, component]) => [key, receiptComponent(component)]),
    ),
  };
}

/** @param {'losing'|'even'|'winning'} trajectory */
function comparisonFor(trajectory) {
  if (trajectory === 'winning') return { ...WINNING_COMPARISON };
  if (trajectory === 'losing') return { ...LOSING_COMPARISON };
  return null;
}

/**
 * Behavioral comparison.  Its inputs and output are belief-only by structure;
 * no truth field is accepted or returned.
 *
 * @param {{priorBelievedBand?:unknown,currentBelievedBand?:unknown}} [args]
 * @returns {{
 *   trajectory:'losing'|'even'|'winning',
 *   trajectoryMarginBand:null|'narrow'|'clear',
 *   comparison:null|{endNowCost:'lower'|'higher',endLaterCost:'lower'|'higher',preferredTiming:'now'|'later',pressure:'sue'|'continue'},
 *   receipt:null|{kind:string,audience:'public',stateRead:string,priorBelievedBand:string,currentBelievedBand:string,trajectory:'losing'|'winning',trajectoryMarginBand:'narrow'|'clear'},
 * }}
 */
export function evaluateWarCostTrajectory({
  priorBelievedBand,
  currentBelievedBand,
} = {}) {
  const read = trajectoryFromBands(priorBelievedBand, currentBelievedBand);
  const comparison = comparisonFor(read.trajectory);
  if (!comparison) {
    return {
      trajectory: 'even',
      trajectoryMarginBand: null,
      comparison: null,
      receipt: null,
    };
  }
  return {
    trajectory: read.trajectory,
    trajectoryMarginBand: read.trajectoryMarginBand,
    comparison,
    receipt: {
      kind: `war_trajectory_${read.trajectory}`,
      audience: 'public',
      stateRead: BELIEF_STATE_READ,
      priorBelievedBand: /** @type {string} */ (priorBelievedBand),
      currentBelievedBand: /** @type {string} */ (currentBelievedBand),
      trajectory: /** @type {'losing'|'winning'} */ (read.trajectory),
      trajectoryMarginBand: /** @type {'narrow'|'clear'} */ (read.trajectoryMarginBand),
    },
  };
}

/**
 * Post-hoc truth comparison.  Kept separate from the behavioral evaluator so
 * the true field result cannot change whether the court sues or holds.
 *
 * @param {{
 *   believedTrajectory?:unknown,
 *   priorTruthBand?:unknown,
 *   currentTruthBand?:unknown,
 * }} [args]
 * @returns {{
 *   truthTrajectory:null|'losing'|'even'|'winning',
 *   misread:boolean,
 *   receipt:null|{kind:'trajectory_misread',audience:'dm-only',courtStateRead:string,truthStateRead:string,believedTrajectory:string,truthTrajectory:string,priorTruthBand:string,currentTruthBand:string},
 * }}
 */
export function compareWarCostTrajectoryTruth({
  believedTrajectory,
  priorTruthBand,
  currentTruthBand,
} = {}) {
  const truth = trajectoryFromBands(priorTruthBand, currentTruthBand);
  if (!truth.observed || !TRAJECTORY_SET.has(/** @type {string} */ (believedTrajectory))) {
    return { truthTrajectory: null, misread: false, receipt: null };
  }
  if (believedTrajectory === 'even') {
    return { truthTrajectory: truth.trajectory, misread: false, receipt: null };
  }
  const misread = believedTrajectory !== truth.trajectory;
  return {
    truthTrajectory: truth.trajectory,
    misread,
    receipt: misread
      ? {
          kind: 'trajectory_misread',
          audience: 'dm-only',
          courtStateRead: BELIEF_STATE_READ,
          truthStateRead: TRUTH_STATE_READ,
          believedTrajectory: /** @type {string} */ (believedTrajectory),
          truthTrajectory: truth.trajectory,
          priorTruthBand: /** @type {string} */ (priorTruthBand),
          currentTruthBand: /** @type {string} */ (currentTruthBand),
        }
      : null,
  };
}
