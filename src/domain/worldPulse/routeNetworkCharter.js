/**
 * routeNetworkCharter.js — THE CHARTER (W-J slice J3; binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §6, with §1 Law 3, Law 4, §5, §5b, §5c).
 *
 * §6 is DEMAND-THEN-EVENT, and the order of those two words is the design. J2
 * counted what walked; this module asks whether what walked has earned a road,
 * and when it has, it PROPOSES rather than builds. Law 3 forbids silent drift:
 * there is no path here that adds an edge to the world without an event carrying
 * a full address chain and a reason denominated in goods, people, or strategy.
 *
 * ── THE THREE GATES, IN ORDER ───────────────────────────────────────────────
 * A charter needs all three of §6's conditions, and each is a separate function
 * so the receipt can name which one refused:
 *   1. ACCUMULATED DEMAND crosses the FORMATION threshold, per dominant class.
 *   2. THE MATERIAL OBJECTIVE clears its bar, priced with §5b's danger and §5c's
 *      detour premium folded into the cost term the objective already has.
 *   3. THE EXPEDITION-WORTH CEILING passes. Some places are simply too far for
 *      any expedition to be worth it, and §0 calls that character rather than
 *      failure. This gate is why isolation survives a century of wanting.
 *
 * ── CHARTERS RE-DERIVE, SO THEY CAN WAIT ────────────────────────────────────
 * §6 is explicit that the guaranteed-admission rules from the coup precedent do
 * NOT apply here. That is not a detail: the coup verdict is a ONE-SHOT, its
 * trigger consumed in the tick that produced it, so an unadmitted verdict is a
 * deletion. A charter is the opposite. Its trigger is a corridor demand ledger
 * that persists, accumulates, and will still be there next season. An unadmitted
 * charter therefore loses nothing at all: the corridor keeps its tally, the
 * evaluation runs again, and the road is chartered when the DM has attention for
 * it. This module emits proposal outcomes with NO one-shot marker, so
 * `admitGuaranteedProposalOutcomes` rations them under the ordinary cap, and the
 * pin drives a saturated docket to prove the refusal is real rather than assumed.
 *
 * ── THE EDGE IS EARNED, NOT GRANTED ─────────────────────────────────────────
 * On acceptance the edge materializes at 'track'. Not road, not highway: §6 says
 * roads are earned and grade promotion follows sustained usage, which is the
 * decay ladder's other direction (routeNetworkDecay.js). A charter buys the right
 * to be walked; being walked is what buys the rest.
 *
 * ── MILITARY CHARTERS SKIP THE FIRST GATE ONLY ──────────────────────────────
 * §6's last sentence: strategy buys roads demand has not worn yet. A power-
 * initiated military charter is therefore exempt from gate 1 and from gate 1
 * ALONE. It still pays the expedition-worth ceiling (an army cannot march to a
 * place no expedition can reach) and it still proposes through the docket like
 * everything else. The strategic need itself is the WAR LAYER's to write; this
 * module reads the rows it is handed rather than inventing a war-layer read it
 * does not own, and the wiring of that read is J4's.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store. Corridors are
 * evaluated in codepoint order, so the verdict list is a function of the world
 * and never of enumeration order.
 */

import { clamp01 } from '../../kernel/math.js';
import { MAX_HOP_WEEKS, activeSpatialDigest, hopWeeks } from '../spatial/distanceRead.js';
import { genesisPairMode } from './routeNetworkGenesis.js';
import { buildMaterialIndex } from './routeNetworkFlowsMaterial.js';
import {
  ROUTE_OBJECTIVE_TUNING,
  corridorCost01,
  scoreMaterialObjective,
} from './routeNetworkFlowsObjective.js';
import { edgeIdForPair } from './routeNetworkFlows.js';
import {
  clearsRiskPremium,
  corridorDanger01,
  dangerAdjustedCost01,
  defersForEmbattlement,
} from './routeNetworkCharterDanger.js';
import { deriveBypass } from './routeNetworkCharterBypass.js';
import {
  corridorId as corridorIdOf,
  emptyRouteNetwork,
  readRouteNetwork,
  routeEdge,
  routeEdgeId,
  routeLifecycleActive,
  withCorridors,
  withRouteEdges,
  withoutCorridors,
  writeRouteNetwork,
} from './routeNetworkLedger.js';

/**
 * ROUTE_LIFECYCLE_TUNING, the charter half (§12: every entry a band).
 *
 * FORMATION_TALLY and REMOVAL_TALLY are LAW 4's HYSTERESIS PAIR, and they live
 * side by side in one constant precisely so nobody can move one without seeing
 * the other. Formation is more than six times removal: infrastructure has sunk
 * cost, and a realm that charters at the same pressure it abandons at would build
 * a network that flickers. The decay ladder imports REMOVAL_TALLY from here
 * rather than declaring its own, so the pair can never drift apart.
 *
 * The formation number is expressed in the same integer units J2 accrues in: 48
 * is `established` on the band ladder, so a corridor charters only once its
 * traffic has been reported as established rather than merely stirring.
 *
 * EVAL_CADENCE_TICKS is why this is a multi-year event rather than a weekly one.
 * A corridor is looked at four times a year at one-week ticks; between looks it
 * accumulates. CHARTER_COOLDOWN_TICKS is the anti-flap dwell a pair serves after
 * ANY lifecycle decision about it, in either direction.
 *
 * EXPEDITION_WORTH_WEEKS is §0's isolation-as-fate, as a number: a corridor whose
 * one-way travel time exceeds a season and a half is beyond what any expedition
 * is worth, whatever the demand says. MEASURED, so the band is honest about what
 * it binds on: candidate corridors are k-nearest by construction, and a realm of
 * two dozen seats runs about four weeks at the median and nine at the extreme, so
 * on a connected realm this ceiling almost never fires. Where it DOES fire is the
 * case the design actually names: a pair the frozen geometry cannot connect at
 * all reads the unreachable rung (52 weeks) and stays isolated however much the
 * two ends want each other. OBJECTIVE_BAR is the ordinary material bar;
 * the risk-premium bar in the danger leaf is always strictly above it, which is
 * what makes the greed override a purchase rather than an exemption.
 *
 * @type {Readonly<Record<string, unknown>>}
 */
export const ROUTE_CHARTER_TUNING = Object.freeze({
  FORMATION_TALLY: 48,
  REMOVAL_TALLY: 7,
  EVAL_CADENCE_TICKS: 13,
  CHARTER_COOLDOWN_TICKS: 52,
  EXPEDITION_WORTH_WEEKS: 20,
  OBJECTIVE_BAR: 0.12,
  CHARTER_GRADE: 'track',
  MILITARY_CHARTER_BAND: 'garrison',
  SEVERITY_FLOOR: 0.3,
  SEVERITY_PER_SCORE: 0.4,
});

/**
 * The closed STRATEGIC NEED vocabulary (§3's `strategicNeed?: band`, §7's garrison
 * asymmetry). Ordered weakest to strongest. `none` is the absence reading and is
 * never persisted.
 * @type {ReadonlyArray<string>}
 */
export const ROUTE_STRATEGIC_BANDS = Object.freeze(['none', 'watch', 'garrison', 'front']);

/** The candidateType a chartered route mints. @type {string} */
export const CHARTER_CANDIDATE_TYPE = 'route_chartered';

/** The typed action the Herald item carries (the address chain's event kind). @type {string} */
export const CHARTER_NEWS_TYPE = 'route_chartered';

/**
 * The charter flavor each dominant flow class buys (§3's flavor vocabulary).
 * `genesis` and `user` are deliberately unreachable from here: the first is the
 * network the realm was born with and the second is the DM's own hand.
 * @type {Readonly<Record<string, string>>}
 */
export const CHARTER_FLAVOR_BY_CLASS = Object.freeze({
  goods: 'mercantile',
  population: 'migration',
  military: 'military',
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number} */
function tickOf(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

/** @param {number} value @returns {number} */
function round4(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 10000) / 10000 : 0;
}

/**
 * The rank of a strategic-need band, for the comparisons the charter bar and the
 * garrison floor both make. An unrecognized band ranks 0, which is the fail-closed
 * reading: a word this module has never heard of must not buy a road.
 *
 * @param {string|null|undefined} band
 * @returns {number}
 */
export function strategicNeedRank(band) {
  const index = ROUTE_STRATEGIC_BANDS.indexOf(String(band));
  return index < 0 ? 0 : index;
}

/**
 * THE DOMINANT FLOW CLASS of an accrual (§6: a charter names the class that
 * earned it). The largest tally wins; a tie breaks codepoint-low, so the same
 * corridor always names the same class on every machine.
 *
 * @param {{ tally?: Record<string, number> }|null|undefined} accrual
 * @returns {{ flowClass: string|null, tally: number }}
 */
export function dominantFlowClassOf(accrual) {
  const tally = asRecord(accrual && accrual.tally);
  /** @type {string|null} */
  let best = null;
  let bestTally = 0;
  for (const key of Object.keys(tally).sort()) {
    const value = Number(tally[key]);
    if (!Number.isFinite(value) || value <= 0) continue;
    if (value > bestTally) { best = key; bestTally = value; }
  }
  return { flowClass: best, tally: bestTally };
}

/**
 * THE EXPEDITION-WORTH READING (§0, §6). One-way travel time in weeks, or the
 * ceiling itself when the realm cannot get there at all. An ASPATIAL realm has no
 * travel time to read and answers 0: with no geometry, nowhere is too far, which
 * is the same reading the objective's aspatial cost takes.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string} a @param {string} b
 * @param {string|null} [season]
 * @returns {number} weeks
 */
export function expeditionWeeks(worldState, a, b, season = null) {
  const digest = activeSpatialDigest(worldState);
  if (!digest) return 0;
  const weeks = hopWeeks(digest, String(a), String(b), season);
  return weeks == null ? MAX_HOP_WEEKS : Number(weeks);
}

/**
 * @typedef {Object} CharterVerdict
 * @property {string} corridorId
 * @property {string} a @property {string} b
 * @property {string} mode
 * @property {string} verdict  one of the CHARTER_VERDICTS words
 * @property {boolean} charters  the one-word reading of `verdict`
 * @property {string|null} dominantFlowClass
 * @property {number} demandTally
 * @property {number} score        the danger-adjusted material score
 * @property {number} baseScore    the §5 score before §5b and §5c priced it
 * @property {number} cost01       the danger-and-detour-adjusted cost
 * @property {number} danger01
 * @property {number} weeks
 * @property {boolean} riskPremium  true when greed carried it through danger
 * @property {boolean} realmShaping true when it closes a loop the realm cannot close
 * @property {string} flavor
 * @property {string|null} byPowerRef
 * @property {ReadonlyArray<string>} reasonGoods
 * @property {ReadonlyArray<string>} receipts  the contributing flow sources
 */

/**
 * The closed verdict vocabulary. Every refusal names its own gate, because a
 * charter that did not happen is a fact the tuning pass needs to read.
 * @type {ReadonlyArray<string>}
 */
export const CHARTER_VERDICTS = Object.freeze([
  'charter', 'cadence', 'already_served', 'wait_demand', 'wait_objective',
  'too_far', 'deferred_embattled',
]);

/**
 * @param {Partial<CharterVerdict> & { corridorId: string, a: string, b: string, verdict: string }} fields
 * @returns {CharterVerdict}
 */
function verdictOf(fields) {
  return {
    corridorId: fields.corridorId,
    a: fields.a,
    b: fields.b,
    mode: fields.mode || 'land',
    verdict: fields.verdict,
    charters: fields.verdict === 'charter',
    dominantFlowClass: fields.dominantFlowClass == null ? null : String(fields.dominantFlowClass),
    demandTally: Number(fields.demandTally) || 0,
    score: round4(Number(fields.score) || 0),
    baseScore: round4(Number(fields.baseScore) || 0),
    cost01: round4(Number(fields.cost01) || 0),
    danger01: round4(Number(fields.danger01) || 0),
    weeks: Number(fields.weeks) || 0,
    riskPremium: fields.riskPremium === true,
    realmShaping: fields.realmShaping === true,
    flavor: fields.flavor || 'mercantile',
    byPowerRef: fields.byPowerRef == null ? null : String(fields.byPowerRef),
    reasonGoods: Object.freeze([...(fields.reasonGoods || [])].map(String)),
    receipts: Object.freeze([...(fields.receipts || [])].map(String)),
  };
}

/**
 * THE EFFECTIVE COST OF A CORRIDOR (§5 priced by §5b and §5c).
 *
 * Three terms, and each one is somebody else's law: the §5 travel cost, the §5b
 * danger surcharge read through the believed picture, and the §5c detour premium
 * a through-road pays to skirt a place the wagons fear. They compose by addition
 * on the same bounded 0..1 scale the objective already speaks, so nothing
 * downstream learns a new unit.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   a: string, b: string,
 *   grade?: string|null,
 *   season?: string|null,
 *   tick?: number,
 * }} input
 * @returns {{
 *   cost01: number, base01: number, danger: import('./routeNetworkCharterDanger.js').CorridorDangerReading,
 *   detour01: number, bypassed: boolean,
 * }}
 */
export function effectiveCorridorCost01(input) {
  const worldState = input.worldState || {};
  const a = String(input.a);
  const b = String(input.b);
  const season = input.season || null;
  const grade = input.grade || String(ROUTE_CHARTER_TUNING.CHARTER_GRADE);
  const base01 = corridorCost01(worldState, a, b, season);
  const danger = corridorDanger01({ worldState, a, b, grade, season });
  const dangered = dangerAdjustedCost01(base01, danger);
  const geometry = deriveBypass({ worldState, a, b, tick: tickOf(input.tick) });
  const detour01 = geometry.bypass ? Number(geometry.bypass.detourPremium01) : 0;
  return {
    cost01: round4(clamp01(dangered + detour01)),
    base01: round4(base01),
    danger,
    detour01: round4(detour01),
    bypassed: !!geometry.bypass,
  };
}

/**
 * EVALUATE ONE CORRIDOR (§6). Pure; writes nothing.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   index: import('./routeNetworkFlowsMaterial.js').MaterialIndex,
 *   network: import('./routeNetworkLedger.js').RouteNetwork,
 *   corridorId: string,
 *   corridor: import('./routeNetworkLedger.js').CorridorDemand,
 *   tick: number,
 *   season?: string|null,
 * }} input
 * @returns {CharterVerdict}
 */
export function evaluateCorridorCharter(input) {
  const corridor = asRecord(input.corridor);
  const a = String(corridor.a);
  const b = String(corridor.b);
  const now = tickOf(input.tick);
  const base = { corridorId: String(input.corridorId), a, b };

  // GATE 0 — THE CADENCE. A corridor is looked at on a dwell, not every pulse.
  // Cheapest possible refusal, and it is what makes a charter a multi-year event
  // rather than a weekly re-argument of the same question.
  const lastEval = tickOf(corridor.lastCharterEval);
  if (now - lastEval < Number(ROUTE_CHARTER_TUNING.EVAL_CADENCE_TICKS)) {
    return verdictOf({ ...base, verdict: 'cadence' });
  }

  // A pair a road already serves is not a corridor question at all. J2 accrues
  // onto the edge in that case, so this is belt and braces over a state that
  // should not arise; it refuses rather than minting a duplicate road.
  if (edgeIdForPair(input.network, a, b)) {
    return verdictOf({ ...base, verdict: 'already_served' });
  }

  const digest = activeSpatialDigest(input.worldState);
  const mode = genesisPairMode(digest, a, b);
  const dominant = dominantFlowClassOf(/** @type {never} */ (corridor));
  const flavor = CHARTER_FLAVOR_BY_CLASS[String(dominant.flowClass)] || 'mercantile';
  const receipts = asRecord(corridor.receipts)[String(dominant.flowClass)];

  // GATE 1 — ACCUMULATED DEMAND (Law 4's formation half).
  if (dominant.tally < Number(ROUTE_CHARTER_TUNING.FORMATION_TALLY)) {
    return verdictOf({
      ...base,
      mode,
      verdict: 'wait_demand',
      dominantFlowClass: dominant.flowClass,
      demandTally: dominant.tally,
      flavor,
      receipts: Array.isArray(receipts) ? receipts : [],
    });
  }

  // GATE 3 IS CHECKED BEFORE GATE 2, and the order is a cost decision rather than
  // a change of law: the ceiling is one frozen lookup and the objective is a walk
  // over the pair's wants, so refusing the unreachable first keeps the expensive
  // question off the corridors that could never pass anyway.
  const weeks = expeditionWeeks(input.worldState, a, b, input.season || null);
  if (weeks > Number(ROUTE_CHARTER_TUNING.EXPEDITION_WORTH_WEEKS)) {
    return verdictOf({
      ...base,
      mode,
      verdict: 'too_far',
      dominantFlowClass: dominant.flowClass,
      demandTally: dominant.tally,
      weeks,
      flavor,
      receipts: Array.isArray(receipts) ? receipts : [],
    });
  }

  // GATE 2 — THE MATERIAL OBJECTIVE, priced by §5b and §5c.
  const scored = scoreMaterialObjective({
    index: input.index, a, b, worldState: input.worldState, season: input.season || null,
  });
  const cost = effectiveCorridorCost01({
    worldState: input.worldState, a, b, season: input.season || null, tick: now,
  });
  const costWeight = Number(ROUTE_OBJECTIVE_TUNING.COST_WEIGHT);
  const score = round4(scored.score - costWeight * (cost.cost01 - scored.cost01));
  const defers = defersForEmbattlement(cost.danger);
  const greed = clearsRiskPremium(score, cost.danger);
  const clearsBar = score >= Number(ROUTE_CHARTER_TUNING.OBJECTIVE_BAR);

  const shared = {
    ...base,
    mode,
    dominantFlowClass: dominant.flowClass,
    demandTally: dominant.tally,
    score,
    baseScore: scored.score,
    cost01: cost.cost01,
    danger01: cost.danger.danger01,
    weeks,
    realmShaping: scored.unservedWants > 0,
    flavor,
    reasonGoods: scored.reasonGoods,
    receipts: Array.isArray(receipts) ? receipts : [],
  };

  // THE ORDER HERE IS §5b's SENTENCE. An ordinary charter needs a clear bar AND
  // calm ground. Greed is what carries a road through danger "anyway", so it is
  // checked second and it overrides BOTH the embattled deferral and the ordinary
  // bar, at a price that rises with the danger it is buying past.
  if (clearsBar && !defers) return verdictOf({ ...shared, verdict: 'charter' });
  if (greed) return verdictOf({ ...shared, verdict: 'charter', riskPremium: true });
  if (defers) return verdictOf({ ...shared, verdict: 'deferred_embattled' });
  return verdictOf({ ...shared, verdict: 'wait_objective' });
}

/**
 * A POWER-INITIATED MILITARY CHARTER (§6's last sentence). Strategy buys roads
 * demand has not worn yet, so gate 1 does not apply; every other gate does.
 *
 * The `need` rows are the WAR LAYER's, handed in rather than read: this module
 * does not own the war ledger's shape and inventing a reader for it here would be
 * a second opinion about what the war layer means by a garrison. J4 wires the
 * real read; the convention is the design doc's.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   network: import('./routeNetworkLedger.js').RouteNetwork,
 *   need: { a: string, b: string, band: string, byPowerRef?: string },
 *   tick: number,
 *   season?: string|null,
 * }} input
 * @returns {CharterVerdict}
 */
export function evaluateMilitaryCharter(input) {
  const need = asRecord(input.need);
  const a = String(need.a);
  const b = String(need.b);
  const base = { corridorId: corridorIdOf(a, b), a, b };
  const digest = activeSpatialDigest(input.worldState);
  const mode = genesisPairMode(digest, a, b);
  const shared = {
    ...base,
    mode,
    dominantFlowClass: 'military',
    flavor: 'military',
    byPowerRef: need.byPowerRef == null ? null : String(need.byPowerRef),
  };
  if (strategicNeedRank(/** @type {string} */ (need.band))
    < strategicNeedRank(String(ROUTE_CHARTER_TUNING.MILITARY_CHARTER_BAND))) {
    return verdictOf({ ...shared, verdict: 'wait_demand' });
  }
  if (edgeIdForPair(input.network, a, b)) {
    return verdictOf({ ...shared, verdict: 'already_served' });
  }
  const weeks = expeditionWeeks(input.worldState, a, b, input.season || null);
  if (weeks > Number(ROUTE_CHARTER_TUNING.EXPEDITION_WORTH_WEEKS)) {
    return verdictOf({ ...shared, verdict: 'too_far', weeks });
  }
  const cost = effectiveCorridorCost01({
    worldState: input.worldState, a, b, season: input.season || null, tick: tickOf(input.tick),
  });
  // A STRATEGIC NEED IS NOT DEFERRED BY DANGER, and that is the whole point of
  // the exemption: an army road is chartered BECAUSE the ground is contested. The
  // deferral in §5b waits out a war on behalf of trade, and trade is not what is
  // asking here.
  return verdictOf({
    ...shared,
    verdict: 'charter',
    cost01: cost.cost01,
    danger01: cost.danger.danger01,
    weeks,
    realmShaping: strategicNeedRank(/** @type {string} */ (need.band)) >= strategicNeedRank('front'),
  });
}

/**
 * @typedef {Object} CharterSweepResult
 * @property {Record<string, unknown>} worldState  the world with the eval cursors moved
 * @property {ReadonlyArray<CharterVerdict>} verdicts
 * @property {number} evaluated
 * @property {boolean} changed
 */

/** @param {Record<string, unknown>} worldState @returns {CharterSweepResult} */
function inertSweep(worldState) {
  return {
    worldState,
    verdicts: Object.freeze([]),
    evaluated: 0,
    changed: false,
  };
}

/**
 * EVALUATE EVERY CORRIDOR AND EVERY STRATEGIC NEED, ONE PASS (§6).
 *
 * DORMANT returns the INPUT worldState BY REFERENCE, exactly as
 * `ensureGenesisRouteNetwork` and `accrueRouteFlows` do, so wiring this into the
 * pulse on a dark world cannot perturb a single byte by object identity.
 *
 * The only world-state write this function makes is the corridor eval CURSOR, and
 * only on the corridors it actually looked at. A cursor moved by a pass that did
 * not evaluate would tell the next pass a corridor had been considered when
 * nothing considered it, which is the same mistake J2 refused to make in the
 * other direction.
 *
 * IT RETURNS VERDICTS, NOT EVENTS, and the split is deliberate. Turning a verdict
 * into a docket proposal and a Herald beat is routeNetworkCharterEvents.js's job
 * (`charterEmissions`), which lets the tuning pass ask what the numbers say
 * without also minting anything, and keeps this module free of any dependency on
 * the shape of the surfaces that read it.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   members: ReadonlyArray<import('./routeNetworkFlowsMaterial.js').MaterialMember>,
 *   tick: number,
 *   season?: string|null,
 *   strategicNeeds?: ReadonlyArray<{ a: string, b: string, band: string, byPowerRef?: string }>,
 * }} input
 * @returns {CharterSweepResult}
 */
export function evaluateRouteCharters(input) {
  const worldState = input.worldState;
  if (!routeLifecycleActive(worldState)) return inertSweep(worldState);
  const now = tickOf(input.tick);
  const season = input.season || null;
  const network = readRouteNetwork(worldState) || emptyRouteNetwork();
  const members = Array.isArray(input.members) ? input.members : [];
  const index = buildMaterialIndex({ members, network });

  /** @type {Array<CharterVerdict>} */
  const verdicts = [];
  /** @type {Record<string, import('./routeNetworkLedger.js').CorridorDemand>} */
  const cursors = {};
  const corridors = network.corridor || {};
  for (const id of Object.keys(corridors).sort()) {
    const corridor = corridors[id];
    if (!corridor || typeof corridor !== 'object') continue;
    const verdict = evaluateCorridorCharter({
      worldState, index, network, corridorId: id, corridor, tick: now, season,
    });
    if (verdict.verdict === 'cadence') continue;
    verdicts.push(verdict);
    cursors[id] = { ...corridor, lastCharterEval: now };
  }

  for (const need of Array.isArray(input.strategicNeeds) ? input.strategicNeeds : []) {
    const verdict = evaluateMilitaryCharter({ worldState, network, need, tick: now, season });
    verdicts.push(verdict);
  }

  const changed = Object.keys(cursors).length > 0;
  return {
    worldState: changed ? writeRouteNetwork(worldState, withCorridors(network, cursors)) : worldState,
    verdicts: Object.freeze(verdicts),
    evaluated: verdicts.length,
    changed,
  };
}

/**
 * @typedef {Object} CharterApplyResult
 * @property {Record<string, unknown>} worldState
 * @property {string|null} edgeId
 * @property {boolean} changed
 */

/**
 * MATERIALIZE A CHARTERED EDGE (§6's acceptance half).
 *
 * The edge enters at 'track' with provenance `chartered:<tick>`, and the corridor
 * that earned it is RETIRED in the same fold: the want has become a road, and the
 * accrual pass will now write onto the road instead. Doing both in one write is
 * what keeps a half-applied charter (a road with a live demand ledger still
 * pointing at it) from existing at all.
 *
 * IDEMPOTENT. `withRouteEdges` is explicit-wins, so re-applying the same charter
 * cannot overwrite the edge it already made, and retiring an already-retired
 * corridor is a no-op that returns the same reference.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   verdict: CharterVerdict,
 *   tick: number,
 * }} input
 * @returns {CharterApplyResult}
 */
export function applyRouteCharter(input) {
  const worldState = input.worldState;
  if (!routeLifecycleActive(worldState)) return { worldState, edgeId: null, changed: false };
  const verdict = input.verdict;
  if (!verdict || !verdict.charters) return { worldState, edgeId: null, changed: false };
  const now = tickOf(input.tick);
  const network = readRouteNetwork(worldState) || emptyRouteNetwork();
  const edgeId = routeEdgeId(verdict.a, verdict.b, verdict.mode);
  if (network.edges && network.edges[edgeId]) {
    const retired = withoutCorridors(network, [verdict.corridorId]);
    if (retired === network) return { worldState, edgeId, changed: false };
    return { worldState: writeRouteNetwork(worldState, retired), edgeId, changed: true };
  }

  const edge = routeEdge({
    a: verdict.a,
    b: verdict.b,
    grade: String(ROUTE_CHARTER_TUNING.CHARTER_GRADE),
    mode: verdict.mode,
    provenance: `chartered:${now}`,
    flavor: verdict.flavor,
    tick: now,
    dominantFlowClass: verdict.dominantFlowClass,
    byPowerRef: verdict.byPowerRef,
    reasonGoods: verdict.reasonGoods,
  });
  const folded = withoutCorridors(withRouteEdges(network, [edge]), [verdict.corridorId]);
  return { worldState: writeRouteNetwork(worldState, folded), edgeId, changed: true };
}
