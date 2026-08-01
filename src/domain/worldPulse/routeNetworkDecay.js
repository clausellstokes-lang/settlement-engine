/**
 * routeNetworkDecay.js — THE SLOW VERDICT (W-J slice J3; binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §7, with §1 Law 4, Law 5, §5's dual-benefit
 * mercy, §5b's loss feedback, and §6's "roads are earned").
 *
 * THIS MODULE IS THE SINGLE WRITER OF `grade`. Every promotion, every demotion,
 * and (through this module's `withEdgeGrade`, imported rather than duplicated)
 * the destruction cascade and the revival warm start in
 * routeNetworkDecayLifecycle.js all pass through one function, which is why the
 * garrison floor and the hidden floor can be stated once and hold everywhere
 * instead of being re-remembered at four call sites.
 *
 * ── THERE IS NO REMOVAL PATH HERE, AND THAT IS LAW 5 ────────────────────────
 * NOTHING IS FORGOTTEN. The ladder's bottom rung is `hidden`, and `hidden` steps
 * nowhere: a road the realm stopped walking becomes an overgrown remnant that
 * holds the door open for a revival, never an absence. The design's word
 * "removal" is spelled, mechanically, as the last demotion. So the pin that no
 * edge with charter history ever reaches absence is not a promise about careful
 * coding; it is a statement about a function that does not exist.
 *
 * ── THE LADDER RUNS BOTH WAYS, AND CANNOT FLAP ──────────────────────────────
 * §6 says roads are earned and grade promotion follows sustained usage; §7 says
 * sustained under-use plus a failing objective steps the grade down on long
 * dwells. Those are one ladder, and the anti-flap guarantee is STRUCTURAL rather
 * than tuned: promotion requires RECENT traffic (inside ACTIVE_WINDOW_TICKS) and
 * demotion requires PROLONGED SILENCE (past DEMOTE_DWELL_TICKS), and the window
 * is far inside the dwell, so the two conditions can never both hold. A world
 * whose demand oscillates therefore cannot walk an edge up and down; it can only
 * hold it where the slower of the two clocks last left it.
 *
 * A second trap this closes: the usage tally NEVER DECREASES (it is J2's exact
 * integer accumulator, and an accumulator that fell would be a lie about what
 * walked). A promotion rule reading the tally alone would re-promote a just-
 * demoted edge on the very next pass, forever. Requiring recent traffic is what
 * makes the tally a measure of a road's history and the window a measure of its
 * present, which are different questions.
 *
 * ── WHAT THE LADDER READS IS WHAT ARRIVED, NOT WHAT SET OUT ─────────────────
 * §5b's feedback lands here. A dangerous road's usage is discounted by its loss
 * rate before the ladder reads it, so greed that keeps losing caravans starves
 * its own road honestly. The ledger keeps the true count; only this reading is
 * discounted (see `survivingUsageTally`).
 *
 * ── THE DUAL-BENEFIT MERCY IS A COUNTERFACTUAL ──────────────────────────────
 * §5: a system-critical edge resists removal while an endpoint struggles. The
 * question is not whether the edge serves an unserved want today (it cannot,
 * being the thing that serves them) but whether taking it away would strand one.
 * `scoreEdgeRemoval` already asks it that way, and this module reads its verdict
 * rather than re-deriving one.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store.
 */

import { buildMaterialIndex } from './routeNetworkFlowsMaterial.js';
import {
  ROUTE_OBJECTIVE_TUNING,
  isSystemCritical,
  scoreEdgeRemoval,
  scoreMaterialObjective,
} from './routeNetworkFlowsObjective.js';
import {
  corridorDanger01,
  dangerLossRate01,
  survivingUsageTally,
} from './routeNetworkCharterDanger.js';
import {
  ROUTE_CHARTER_TUNING,
  effectiveCorridorCost01,
  strategicNeedRank,
} from './routeNetworkCharter.js';
import {
  ROUTE_GRADES,
  emptyRouteNetwork,
  isLifecycleImmune,
  readRouteNetwork,
  routeLifecycleActive,
  writeRouteNetwork,
} from './routeNetworkLedger.js';

/**
 * ROUTE_LIFECYCLE_TUNING, the decay half (§12: every entry a band).
 *
 * DEMOTE_DWELL_TICKS is a year and a half of silence at one-week ticks. §7 says
 * long dwells, and Law 4 says infrastructure has sunk cost; a road does not stop
 * being a road because a season was quiet.
 *
 * ACTIVE_WINDOW_TICKS is a season. It is the promotion side's freshness test and
 * the structural half of the anti-flap guarantee (see the header): it is far
 * inside DEMOTE_DWELL_TICKS, so no edge can satisfy both rules.
 *
 * PROMOTE_TALLY is a CUMULATIVE ladder keyed by the grade being climbed TO,
 * because the tally itself is cumulative. Reaching road takes twice the traffic
 * that earned the track; reaching highway takes rather more than twice again,
 * which is what makes a highway the realm's spine rather than its third-busiest
 * lane.
 *
 * WARM_START_BONUS is §7's "the old road remembers": the objective credit a
 * hidden corridor carries when a resettled remnant re-asks whether the way is
 * worth having. It is a bonus, never an automatic revival, so a rebirth in a
 * place the realm genuinely no longer needs stays honestly unconnected.
 *
 * @type {Readonly<Record<string, unknown>>}
 */
export const ROUTE_DECAY_TUNING = Object.freeze({
  DEMOTE_DWELL_TICKS: 78,
  PROMOTE_DWELL_TICKS: 52,
  ACTIVE_WINDOW_TICKS: 13,
  PROMOTE_TALLY: Object.freeze({ road: 96, highway: 240 }),
  GARRISON_FLOOR_GRADE: 'road',
  WARM_START_BONUS: 0.2,
  // The two dials `demoteDwellFor` turns. SUNK_COST_BONUS is what a road earns by
  // having genuinely been walked; MIN_DEMOTE_DWELL_TICKS is the floor no amount of
  // loss may cut through, so even a road that loses everything gets most of a year
  // to prove otherwise.
  SUNK_COST_BONUS: 0.5,
  MIN_DEMOTE_DWELL_TICKS: 39,
});

/** The conditional edge key this module is the single writer of. @type {string} */
export const GRADE_STEP_KEY = 'gradeStep';

/** The candidateType a grade PROMOTION mints. @type {string} */
export const PROMOTION_CANDIDATE_TYPE = 'route_promoted';

/** The candidateType an ordinary grade DEMOTION mints. @type {string} */
export const DEMOTION_CANDIDATE_TYPE = 'route_demoted';

/**
 * The candidateType the LAST demotion mints. §7 calls the abandonment of a
 * chartered route Herald-worthy mourning, and a separate word is how the Herald
 * knows to mourn rather than to report a maintenance downgrade.
 * @type {string}
 */
export const ABANDONMENT_CANDIDATE_TYPE = 'route_abandoned';

/** The candidateType a warm-started revival mints. @type {string} */
export const REVIVAL_CANDIDATE_TYPE = 'route_revived';

/**
 * The closed verdict vocabulary. Every hold names the rule that held it, because
 * a demotion that did not happen is the tuning pass's most useful reading.
 * @type {ReadonlyArray<string>}
 */
export const DECAY_VERDICTS = Object.freeze([
  'promote', 'demote', 'abandon', 'hold', 'garrison_floor', 'mercy', 'floor', 'busy',
]);

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
 * The ladder rank of a grade: 0 is hidden, 3 is highway. An unrecognized grade
 * ranks as hidden, which is fail-closed in the only direction that matters here:
 * a word this module does not know can never be promoted out of the remnant rung
 * by accident.
 *
 * @param {string|null|undefined} grade
 * @returns {number}
 */
export function gradeRank(grade) {
  const index = ROUTE_GRADES.indexOf(String(grade));
  return index < 0 ? 0 : ROUTE_GRADES.length - 1 - index;
}

/** The grade at a ladder rank. @param {number} rank @returns {string} */
export function gradeAtRank(rank) {
  const clamped = Math.max(0, Math.min(ROUTE_GRADES.length - 1, Math.floor(rank)));
  return ROUTE_GRADES[ROUTE_GRADES.length - 1 - clamped];
}

/** One rung down, floored at hidden (Law 5). @param {string} grade @returns {string} */
export function stepGradeDown(grade) {
  return gradeAtRank(gradeRank(grade) - 1);
}

/** One rung up, capped at highway. @param {string} grade @returns {string} */
export function stepGradeUp(grade) {
  return gradeAtRank(gradeRank(grade) + 1);
}

/**
 * THE GARRISON FLOOR (§7's asymmetry). An edge carrying a live strategic need at
 * or above the garrison band is maintained by the power that needs it, so the
 * ladder may not put it below `road` regardless of what trade says.
 *
 * IT IS A FLOOR, NOT A BRAKE, and that is a JUDGMENT the design's own wording
 * invites: §7 says such an edge does not decay below road, and a floor that let
 * an existing track sit under it would not be a floor. So a live garrison also
 * RAISES a weaker edge to road, once, without the usage dwell. The army maintains
 * the road it garrisons; it does not wait for merchants to earn it.
 *
 * @param {{ strategicNeed?: unknown }|null|undefined} edge
 * @returns {string|null} the floor grade, or null when no live need
 */
export function garrisonFloorGrade(edge) {
  const need = edge && typeof edge === 'object' ? edge.strategicNeed : null;
  if (strategicNeedRank(/** @type {string} */ (need))
    < strategicNeedRank(String(ROUTE_CHARTER_TUNING.MILITARY_CHARTER_BAND))) return null;
  return String(ROUTE_DECAY_TUNING.GARRISON_FLOOR_GRADE);
}

/**
 * THE ONE GRADE WRITER. Returns the successor edge, or the SAME REFERENCE when
 * the grade did not move, so a no-op sweep cannot mint objects and defeat an
 * upstream change detector.
 *
 * The garrison floor is applied HERE rather than at the call sites, which is what
 * makes it hold for the destruction cascade and the revival warm start as well as
 * for the ordinary ladder.
 *
 * @param {import('./routeNetworkLedger.js').RouteEdge} edge
 * @param {string} grade
 * @param {{ tick: number, direction: string, reason: string }} step
 * @returns {import('./routeNetworkLedger.js').RouteEdge}
 */
export function withEdgeGrade(edge, grade, step) {
  const floor = garrisonFloorGrade(edge);
  const wanted = floor && gradeRank(grade) < gradeRank(floor) ? floor : String(grade);
  if (wanted === String(edge.grade)) return edge;
  return {
    ...edge,
    grade: wanted,
    // Conditional, drop-when-absent at birth: a network that has never stepped a
    // grade serializes with no gradeStep key at all, so the J1 genesis golden
    // cannot move because this module exists.
    [GRADE_STEP_KEY]: Object.freeze({
      tick: tickOf(step.tick),
      direction: String(step.direction),
      reason: String(step.reason),
    }),
  };
}

/**
 * The last tick anything happened to this edge: traffic, a grade step, or the
 * charter that made it. DERIVED, so the dwell clock costs no persisted key: J2
 * already stamps `usage.lastTick` when a flow walks the road, and the charter
 * already records the tick it was struck.
 *
 * @param {import('./routeNetworkLedger.js').RouteEdge} edge
 * @returns {number}
 */
export function lastActivityTick(edge) {
  const usage = asRecord(asRecord(edge).usage);
  const step = asRecord(asRecord(edge)[GRADE_STEP_KEY]);
  const charter = asRecord(asRecord(edge).charter);
  return Math.max(tickOf(usage.lastTick), tickOf(step.tick), tickOf(charter.tick));
}

/** The last tick TRAFFIC walked this edge, ignoring administrative steps.
 *  @param {import('./routeNetworkLedger.js').RouteEdge} edge @returns {number|null} */
export function lastTrafficTick(edge) {
  const usage = asRecord(asRecord(edge).usage);
  return usage.lastTick == null ? null : tickOf(usage.lastTick);
}

/**
 * THE USAGE THAT ARRIVED (§5b's feedback applied). The edge's exact tally,
 * discounted by the loss rate its believed danger and its grade impose.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   edge: import('./routeNetworkLedger.js').RouteEdge,
 *   season?: string|null,
 * }} input
 * @returns {{ tally: Record<string, number>, peak: number, lossRate01: number, danger01: number }}
 */
export function survivingEdgeUsage(input) {
  const edge = input.edge;
  const usage = asRecord(asRecord(edge).usage);
  const reading = corridorDanger01({
    worldState: input.worldState,
    a: String(edge.a),
    b: String(edge.b),
    grade: String(edge.grade),
    season: input.season || null,
  });
  const lossRate01 = dangerLossRate01(reading.danger01, String(edge.grade));
  const tally = survivingUsageTally(
    /** @type {Record<string, number>} */ (asRecord(usage.tally)), lossRate01,
  );
  let peak = 0;
  for (const key of Object.keys(tally).sort()) {
    if (tally[key] > peak) peak = tally[key];
  }
  return { tally, peak, lossRate01, danger01: reading.danger01 };
}

/**
 * THE SILENCE A ROAD IS ALLOWED BEFORE THE LADDER JUDGES IT, and the two things
 * that move it. This function is where Law 4's REMOVAL_TALLY and §5b's loss rate
 * both do their work, and it exists because the first shape of the demotion arm
 * put them in a CONJUNCTION that could never be true.
 *
 * That bug is worth recording, because it is the estate's recorded
 * unreachable-predicate class in a fresh instance. The rule read "hold when the
 * tally is above the removal bar AND traffic is more recent than the dwell",
 * placed after a guard that had already established the opposite: silence longer
 * than the dwell implies traffic older than the dwell, so the second clause was
 * false whenever the first was reached. It would have passed every test that
 * never happened to need it, and Law 4's removal threshold would have been a
 * constant nothing read.
 *
 * The honest shapes, both live and both testable:
 *   SUNK COST (Law 4): a road that was genuinely WALKED (its discounted traffic
 *   cleared the removal bar) is allowed a longer silence than one that never
 *   really carried anything. Infrastructure has sunk cost, and the sunk cost is
 *   the use, not the paperwork.
 *   THE LOSS FEEDBACK (§5b): a road that loses its caravans is judged SOONER, in
 *   proportion to what it loses. That is how greed starves its own road: not by
 *   an extra rule, but by shortening the patience the ladder shows it.
 *
 * @param {number} peakUsage   the DISCOUNTED peak class tally (what arrived)
 * @param {number} lossRate01  the fraction the road loses in transit
 * @returns {number} whole ticks
 */
export function demoteDwellFor(peakUsage, lossRate01) {
  const base = Number(ROUTE_DECAY_TUNING.DEMOTE_DWELL_TICKS);
  const walked = Number(peakUsage) >= Number(ROUTE_CHARTER_TUNING.REMOVAL_TALLY);
  const sunkCost = walked ? 1 + Number(ROUTE_DECAY_TUNING.SUNK_COST_BONUS) : 1;
  const loss = Math.min(1, Math.max(0, Number(lossRate01) || 0));
  return Math.max(
    Number(ROUTE_DECAY_TUNING.MIN_DEMOTE_DWELL_TICKS),
    Math.round(base * sunkCost * (1 - loss)),
  );
}

/**
 * @typedef {Object} DecayVerdict
 * @property {string} edgeId
 * @property {string} a @property {string} b
 * @property {string} verdict   one of DECAY_VERDICTS
 * @property {string} from      the grade before
 * @property {string} to        the grade after (equal to `from` on a hold)
 * @property {boolean} steps    the one-word reading of `verdict`
 * @property {boolean} abandons true only on the step that lands on hidden
 * @property {number} quietTicks
 * @property {number} peakUsage the danger-discounted peak class tally
 * @property {number} score     the danger-and-detour-adjusted material score
 * @property {number} lossRate01
 * @property {boolean} systemCritical
 * @property {boolean} lifecycleImmune
 */

/**
 * @param {Partial<DecayVerdict> & { edgeId: string, a: string, b: string, verdict: string, from: string }} f
 * @returns {DecayVerdict}
 */
function decayVerdictOf(f) {
  const to = f.to || f.from;
  const steps = f.verdict === 'promote' || f.verdict === 'demote' || f.verdict === 'abandon';
  return {
    edgeId: f.edgeId,
    a: f.a,
    b: f.b,
    verdict: f.verdict,
    from: f.from,
    to,
    steps,
    abandons: f.verdict === 'abandon',
    quietTicks: Number(f.quietTicks) || 0,
    peakUsage: Number(f.peakUsage) || 0,
    score: round4(Number(f.score) || 0),
    lossRate01: round4(Number(f.lossRate01) || 0),
    systemCritical: f.systemCritical === true,
    lifecycleImmune: f.lifecycleImmune === true,
  };
}

/**
 * THE MATERIAL SCORE OF AN EXISTING EDGE, priced the way the charter prices a
 * corridor. Reused rather than re-derived so an edge and the corridor it came
 * from are judged on the same scale; a road held to a different bar than the one
 * that bought it is how a network learns to flap.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   index: import('./routeNetworkFlowsMaterial.js').MaterialIndex,
 *   a: string, b: string, grade: string,
 *   season?: string|null, tick?: number,
 * }} input
 * @returns {number}
 */
export function edgeObjectiveScore(input) {
  const scored = scoreMaterialObjective({
    index: input.index,
    a: input.a,
    b: input.b,
    worldState: input.worldState,
    season: input.season || null,
  });
  const cost = effectiveCorridorCost01({
    worldState: input.worldState,
    a: input.a,
    b: input.b,
    grade: input.grade,
    season: input.season || null,
    tick: tickOf(input.tick),
  });
  const costWeight = Number(ROUTE_OBJECTIVE_TUNING.COST_WEIGHT);
  return round4(scored.score - costWeight * (cost.cost01 - scored.cost01));
}

/**
 * EVALUATE ONE EDGE (§7). Pure; writes nothing.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   members: ReadonlyArray<import('./routeNetworkFlowsMaterial.js').MaterialMember>,
 *   index: import('./routeNetworkFlowsMaterial.js').MaterialIndex,
 *   network: import('./routeNetworkLedger.js').RouteNetwork,
 *   edgeId: string,
 *   edge: import('./routeNetworkLedger.js').RouteEdge,
 *   tick: number,
 *   season?: string|null,
 * }} input
 * @returns {DecayVerdict}
 */
export function evaluateEdgeDecay(input) {
  const edge = input.edge;
  const now = tickOf(input.tick);
  const from = String(edge.grade);
  const a = String(edge.a);
  const b = String(edge.b);
  const base = { edgeId: String(input.edgeId), a, b, from, lifecycleImmune: isLifecycleImmune(edge) };
  const usage = survivingEdgeUsage({ worldState: input.worldState, edge, season: input.season || null });
  const trafficTick = lastTrafficTick(edge);
  const quietTicks = now - lastActivityTick(edge);
  const shared = {
    ...base,
    quietTicks,
    peakUsage: usage.peak,
    lossRate01: usage.lossRate01,
  };

  // THE GARRISON FLOOR, asked FIRST because it is an invariant rather than a
  // preference: a live strategic need settles the question before the ladder gets
  // to argue about trade at all (§7's asymmetry).
  const floor = garrisonFloorGrade(edge);
  if (floor && gradeRank(from) < gradeRank(floor)) {
    return decayVerdictOf({ ...shared, verdict: 'garrison_floor', to: floor });
  }

  // ── THE PROMOTION ARM: recent traffic, a cumulative tally, and a dwell. ──
  const fresh = trafficTick != null
    && (now - trafficTick) <= Number(ROUTE_DECAY_TUNING.ACTIVE_WINDOW_TICKS);
  if (fresh && gradeRank(from) < gradeRank('highway')) {
    const target = stepGradeUp(from);
    const bar = /** @type {Record<string, number>} */ (ROUTE_DECAY_TUNING.PROMOTE_TALLY)[target];
    const dwellOk = (now - tickOf(asRecord(asRecord(edge)[GRADE_STEP_KEY]).tick))
      >= Number(ROUTE_DECAY_TUNING.PROMOTE_DWELL_TICKS);
    if (Number.isFinite(bar) && usage.peak >= bar && dwellOk) {
      return decayVerdictOf({ ...shared, verdict: 'promote', to: target });
    }
    return decayVerdictOf({ ...shared, verdict: 'busy' });
  }
  if (fresh) return decayVerdictOf({ ...shared, verdict: 'busy' });

  // ── THE DEMOTION ARM: prolonged silence AND a failing objective. ──
  if (gradeRank(from) <= gradeRank('hidden')) {
    return decayVerdictOf({ ...shared, verdict: 'floor' });
  }
  if (quietTicks < demoteDwellFor(usage.peak, usage.lossRate01)) {
    return decayVerdictOf({ ...shared, verdict: 'hold' });
  }
  const score = edgeObjectiveScore({
    worldState: input.worldState,
    index: input.index,
    a,
    b,
    grade: from,
    season: input.season || null,
    tick: now,
  });
  if (score >= Number(ROUTE_CHARTER_TUNING.OBJECTIVE_BAR)) {
    return decayVerdictOf({ ...shared, verdict: 'hold', score });
  }

  // THE DUAL-BENEFIT MERCY (§5), asked as the counterfactual it is.
  const counterfactual = scoreEdgeRemoval({
    members: input.members,
    network: input.network,
    edgeId: String(input.edgeId),
    worldState: input.worldState,
    season: input.season || null,
  });
  if (isSystemCritical(counterfactual)) {
    return decayVerdictOf({ ...shared, verdict: 'mercy', score, systemCritical: true });
  }

  const to = stepGradeDown(from);
  return decayVerdictOf({
    ...shared,
    verdict: to === 'hidden' ? 'abandon' : 'demote',
    to,
    score,
  });
}

/**
 * @typedef {Object} DecaySweepResult
 * @property {Record<string, unknown>} worldState
 * @property {ReadonlyArray<DecayVerdict>} verdicts
 * @property {ReadonlyArray<Record<string, unknown>>} news
 * @property {number} stepped
 * @property {boolean} changed
 */

/** @param {Record<string, unknown>} worldState @returns {DecaySweepResult} */
function inertDecay(worldState) {
  return {
    worldState,
    verdicts: Object.freeze([]),
    news: Object.freeze([]),
    stepped: 0,
    changed: false,
  };
}

/**
 * THE HERALD ITEM for one grade step (§7: every step is an event with receipts;
 * an abandonment is mourning). Full address chain, typed action, recorded reason.
 *
 * @param {DecayVerdict} verdict
 * @param {{ tick: number, names?: Record<string, string> }} context
 * @returns {Record<string, unknown>|null}
 */
export function gradeStepHeraldItem(verdict, context) {
  if (!verdict || !verdict.steps) return null;
  const tick = tickOf(context && context.tick);
  const names = asRecord(context && context.names);
  const nameOf = (/** @type {string} */ id) => String(names[id] || id);
  const from = nameOf(verdict.a);
  const to = nameOf(verdict.b);
  const candidateType = verdict.verdict === 'promote'
    ? PROMOTION_CANDIDATE_TYPE
    : verdict.abandons ? ABANDONMENT_CANDIDATE_TYPE : DEMOTION_CANDIDATE_TYPE;
  const headline = verdict.verdict === 'promote'
    ? `The way between ${from} and ${to} is kept as a ${verdict.to}`
    : verdict.abandons
      ? `The road between ${from} and ${to} is abandoned`
      : `The way between ${from} and ${to} falls to a ${verdict.to}`;
  /** @type {Array<string>} */
  const reasons = [];
  if (verdict.verdict === 'promote') {
    reasons.push('Steady traffic has earned the upkeep.');
  } else {
    reasons.push(`Nothing has walked the way in ${verdict.quietTicks} weeks.`);
    if (verdict.lossRate01 > 0) reasons.push('What did set out did not all arrive.');
    if (verdict.lifecycleImmune) {
      reasons.push('The route stands on the record, and it will not be struck from it.');
    }
  }
  return Object.freeze({
    id: `routegrade.news:${verdict.edgeId}:${tick}`,
    candidateType,
    targetSaveId: verdict.a,
    settlementIds: Object.freeze([verdict.a, verdict.b]),
    settlementNames: Object.freeze([from, to]),
    headline,
    summary: verdict.abandons
      ? 'The way is not struck from the map. It is only overgrown, and it remembers.'
      : `The way is now a ${verdict.to}.`,
    reasons: Object.freeze(reasons),
    severity: verdict.abandons ? 0.45 : 0.25,
    tick,
  });
}

/**
 * SWEEP THE LADDER OVER THE WHOLE LIVED NETWORK (§7).
 *
 * DORMANT returns the INPUT worldState BY REFERENCE, as every entry point in this
 * program does, so wiring it into a dark pulse cannot perturb a byte.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   members: ReadonlyArray<import('./routeNetworkFlowsMaterial.js').MaterialMember>,
 *   tick: number,
 *   season?: string|null,
 *   names?: Record<string, string>,
 * }} input
 * @returns {DecaySweepResult}
 */
export function sweepRouteDecay(input) {
  const worldState = input.worldState;
  if (!routeLifecycleActive(worldState)) return inertDecay(worldState);
  const now = tickOf(input.tick);
  // The totality normalizer erases the value type the caller declared, and the Herald
  // item's context states it; re-asserted here rather than widening that contract.
  const names = /** @type {Record<string, string>} */ (asRecord(input.names));
  const network = readRouteNetwork(worldState) || emptyRouteNetwork();
  const members = Array.isArray(input.members) ? input.members : [];
  const index = buildMaterialIndex({ members, network });
  const edges = network.edges || {};

  /** @type {Array<DecayVerdict>} */
  const verdicts = [];
  /** @type {Record<string, import('./routeNetworkLedger.js').RouteEdge>} */
  const next = {};
  let stepped = 0;

  for (const id of Object.keys(edges).sort()) {
    const edge = edges[id];
    next[id] = edge;
    if (!edge || typeof edge !== 'object') continue;
    const verdict = evaluateEdgeDecay({
      worldState, members, index, network, edgeId: id, edge, tick: now, season: input.season || null,
    });
    verdicts.push(verdict);
    if (verdict.verdict === 'garrison_floor' || verdict.steps) {
      const moved = withEdgeGrade(edge, verdict.to, {
        tick: now,
        direction: gradeRank(verdict.to) > gradeRank(verdict.from) ? 'up' : 'down',
        reason: verdict.verdict,
      });
      if (moved !== edge) { next[id] = moved; stepped += 1; }
    }
  }

  /** @type {Array<Record<string, unknown>>} */
  const news = [];
  for (const verdict of verdicts) {
    const item = gradeStepHeraldItem(verdict, { tick: now, names });
    if (item) news.push(item);
  }

  if (stepped === 0) {
    return { worldState, verdicts: Object.freeze(verdicts), news: Object.freeze(news), stepped: 0, changed: false };
  }
  return {
    worldState: writeRouteNetwork(worldState, { edges: next, corridor: network.corridor || {} }),
    verdicts: Object.freeze(verdicts),
    news: Object.freeze(news),
    stepped,
    changed: true,
  };
}
