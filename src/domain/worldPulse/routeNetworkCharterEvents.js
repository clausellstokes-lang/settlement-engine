/**
 * routeNetworkCharterEvents.js — THE CHARTER'S EVENTS (W-J slice J3; binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §1 Law 3, §6, §10, and the NEWS ADDRESS LAW).
 *
 * Law 3: EVENTS, NEVER SILENT DRIFT. routeNetworkCharter.js decides; this module
 * is the only place a decision becomes something the world can see. Keeping the
 * two apart is what lets the tuning pass ask what the numbers say without minting
 * anything, and it is why the evaluator carries no knowledge of the docket's
 * shape or the Herald's.
 *
 * ── IT EMITS INTO MACHINERY IT DOES NOT OWN ────────────────────────────────
 * The proposal outcomes here are shaped for `proposalAdmission.js` exactly as it
 * already is: `applyMode: 'proposal'` with no `recordMode`, so
 * `requiresProposalAdmission` sees them; no one-shot ruleId, so
 * `admitGuaranteedProposalOutcomes` RATIONS them under the ordinary cap; and a
 * `targetSaveId` where `settlementKeyOf` looks for one, so the per-settlement
 * lane counts them against the right seat. Not one line of that file changes to
 * accept a charter, which is the test of whether an emitter is well shaped.
 *
 * ── CHARTERS ARE NOT GUARANTEED-ADMISSION, AND THAT IS DELIBERATE ──────────
 * §6 says the coup precedent's guaranteed admission does NOT apply. The
 * membership criterion in `ONE_SHOT_VERDICT_RULE_IDS` is whether a trigger can
 * re-derive, and a charter's trigger is a corridor demand ledger that persists
 * and keeps accumulating. An unadmitted charter loses nothing: next season the
 * same corridor is evaluated again, with more demand behind it. So a charter
 * waits its turn behind the DM's attention, and the pin drives a saturated docket
 * to prove the wait is real.
 *
 * ── THE NEWS ADDRESS LAW ───────────────────────────────────────────────────
 * Every item carries the full address chain (both endpoints by id AND by name), a
 * typed action, the affected settlements named, and a recorded reason denominated
 * in goods, people or strategy. No arithmetic reaches the reader: the game-grade
 * rule is that a formula is TRANSLATED, never shown, so the reasons say what
 * moved and never what it scored.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store.
 */

import { clamp01 } from '../../kernel/math.js';
import {
  CHARTER_CANDIDATE_TYPE,
  CHARTER_NEWS_TYPE,
  ROUTE_CHARTER_TUNING,
} from './routeNetworkCharter.js';

/** @typedef {import('./routeNetworkCharter.js').CharterVerdict} CharterVerdict */

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

/** The severity band a charter carries into the docket and the Herald alike.
 *  @param {CharterVerdict} verdict @returns {number} */
function charterSeverity(verdict) {
  return round4(clamp01(Number(ROUTE_CHARTER_TUNING.SEVERITY_FLOOR)
    + Number(ROUTE_CHARTER_TUNING.SEVERITY_PER_SCORE) * clamp01(Number(verdict.score))));
}

/**
 * THE PROPOSAL OUTCOME (§6: a charter PROPOSES through the docket).
 *
 * Shaped for the machinery that already exists rather than for this slice: it is
 * `applyMode: 'proposal'` with no `recordMode`, so `requiresProposalAdmission`
 * sees it, it carries no one-shot ruleId, so `admitGuaranteedProposalOutcomes`
 * rations it, and it keys its per-settlement lane off `targetSaveId` the way
 * `settlementKeyOf` expects. NOTHING about the docket is rewritten to accept it.
 *
 * THE MAJOR-CLASS QUESTION, recorded rather than decided here. §6 says a charter
 * is major-class when realm-shaping, and the estate's canonical classifier is
 * `deriveDecisionTier`, which keys on a frozen set of candidateTypes inside the
 * docket machinery this slice may not rewrite. So the outcome carries the honest
 * signal (`realmShaping`, plus `laneHint`) and the registration of
 * `route_chartered` as campaign-altering is left to the wiring slice that owns
 * that file. Until then a charter rations in the MINOR lane, which is the
 * conservative direction: it consumes none of the four places reserved for major
 * choices.
 *
 * @param {CharterVerdict} verdict
 * @param {{ tick: number, names?: Record<string, string> }} context
 * @returns {Record<string, unknown>|null} null when the verdict did not charter
 */
export function charterProposalOutcome(verdict, context) {
  if (!verdict || !verdict.charters) return null;
  const tick = tickOf(context && context.tick);
  const names = asRecord(context && context.names);
  const nameOf = (/** @type {string} */ id) => String(names[id] || id);
  return Object.freeze({
    id: `routecharter:${verdict.corridorId}:${verdict.mode}:${tick}`,
    candidateType: CHARTER_CANDIDATE_TYPE,
    type: 'route_charter',
    applyMode: 'proposal',
    ruleFamily: 'route_lifecycle',
    targetSaveId: verdict.a,
    settlementIds: Object.freeze([verdict.a, verdict.b]),
    settlementNames: Object.freeze([nameOf(verdict.a), nameOf(verdict.b)]),
    severity: charterSeverity(verdict),
    realmShaping: verdict.realmShaping,
    laneHint: verdict.realmShaping ? 'major' : 'minor',
    tick,
    proposalPayload: Object.freeze({
      kind: 'route_charter',
      a: verdict.a,
      b: verdict.b,
      mode: verdict.mode,
      grade: String(ROUTE_CHARTER_TUNING.CHARTER_GRADE),
      flavor: verdict.flavor,
      dominantFlowClass: verdict.dominantFlowClass,
      reasonGoods: verdict.reasonGoods,
      byPowerRef: verdict.byPowerRef,
      riskPremium: verdict.riskPremium,
      settlementId: verdict.a,
    }),
    reasons: Object.freeze(charterReasons(verdict, nameOf)),
  });
}

/**
 * The reader-facing reasons a charter carries. Denominated in goods, people or
 * strategy, because §5's receipt law says a band step names what moved it, and
 * the NEWS ADDRESS LAW says a news item records its reason rather than implying
 * one. No formula reaches this text: the game-grade rule is that the reader is
 * told what happened and why, never the arithmetic.
 *
 * @param {CharterVerdict} verdict
 * @param {(id: string) => string} nameOf
 * @returns {Array<string>}
 */
export function charterReasons(verdict, nameOf) {
  /** @type {Array<string>} */
  const reasons = [];
  const from = nameOf(verdict.a);
  const to = nameOf(verdict.b);
  if (verdict.dominantFlowClass === 'goods') {
    const goods = verdict.reasonGoods.slice(0, 2).join(' and ');
    reasons.push(goods
      ? `Traders have worn a way between ${from} and ${to} carrying ${goods}.`
      : `Traders have worn a way between ${from} and ${to}.`);
  } else if (verdict.dominantFlowClass === 'population') {
    reasons.push(`Enough feet have crossed between ${from} and ${to} to make a path a road.`);
  } else if (verdict.dominantFlowClass === 'military') {
    reasons.push(verdict.byPowerRef
      ? `A standing strategic need binds ${from} to ${to}.`
      : `Columns and garrisons have kept the way between ${from} and ${to} in use.`);
  }
  if (verdict.realmShaping) {
    reasons.push('The realm cannot close this material loop by any other road.');
  }
  if (verdict.riskPremium) {
    reasons.push('The profit is worth the danger, and the caravans will pay for it.');
  }
  return reasons;
}

/**
 * @typedef {Object} CharterNewsItem
 * @property {string} id
 * @property {string} candidateType
 * @property {string} targetSaveId
 * @property {ReadonlyArray<string>} settlementIds
 * @property {ReadonlyArray<string>} settlementNames
 * @property {string} headline
 * @property {string} summary
 * @property {ReadonlyArray<string>} reasons
 * @property {number} severity
 * @property {number} tick
 */

/**
 * THE HERALD ITEM (§6, §10, and the NEWS ADDRESS LAW). Full address chain (both
 * endpoints by id AND by name), a typed action, and a recorded reason. Built in
 * the shape the existing address-chain machinery already reads, so the item gets
 * a correct navigable chain from code that exists rather than from a second
 * projection this slice would have to keep in agreement.
 *
 * @param {CharterVerdict} verdict
 * @param {{ tick: number, names?: Record<string, string> }} context
 * @returns {CharterNewsItem|null}
 */
export function charterHeraldItem(verdict, context) {
  if (!verdict || !verdict.charters) return null;
  const tick = tickOf(context && context.tick);
  const names = asRecord(context && context.names);
  const nameOf = (/** @type {string} */ id) => String(names[id] || id);
  const from = nameOf(verdict.a);
  const to = nameOf(verdict.b);
  const water = verdict.mode === 'water';
  return Object.freeze({
    id: `routecharter.news:${verdict.corridorId}:${verdict.mode}:${tick}`,
    candidateType: CHARTER_NEWS_TYPE,
    targetSaveId: verdict.a,
    settlementIds: Object.freeze([verdict.a, verdict.b]),
    settlementNames: Object.freeze([from, to]),
    headline: water
      ? `A sea lane is chartered between ${from} and ${to}`
      : `A road is chartered between ${from} and ${to}`,
    summary: `The way opens as a track, and it will be as good a road as it is walked.`,
    reasons: Object.freeze(charterReasons(verdict, nameOf)),
    severity: charterSeverity(verdict),
    tick,
  });
}

/**
 * @typedef {Object} CharterEmissions
 * @property {ReadonlyArray<Record<string, unknown>>} proposals  the docket outcomes
 * @property {ReadonlyArray<CharterNewsItem>} news               the Herald items
 */

/**
 * TURN A SWEEP'S VERDICTS INTO EVENTS (Law 3). One pass, in the order the
 * evaluator produced, so a docket that admits by stable identity and a Herald
 * that reads in sequence see the same world.
 *
 * A verdict that did not charter emits NOTHING, on purpose. A refusal is a
 * reading the tuning pass wants and a reader does not: nobody needs a headline
 * saying a road was considered.
 *
 * @param {ReadonlyArray<CharterVerdict>} verdicts
 * @param {{ tick: number, names?: Record<string, string> }} context
 * @returns {CharterEmissions}
 */
export function charterEmissions(verdicts, context) {
  /** @type {Array<Record<string, unknown>>} */
  const proposals = [];
  /** @type {Array<CharterNewsItem>} */
  const news = [];
  for (const verdict of Array.isArray(verdicts) ? verdicts : []) {
    const outcome = charterProposalOutcome(verdict, context);
    if (outcome) proposals.push(outcome);
    const item = charterHeraldItem(verdict, context);
    if (item) news.push(item);
  }
  return { proposals: Object.freeze(proposals), news: Object.freeze(news) };
}
