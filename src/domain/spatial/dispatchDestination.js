/**
 * dispatchDestination.js — FP TR-3 BELIEVED MARKETS: THE WHERE COMPOSER, the wrong-market
 * tellable, and the `direct-trade` direction row (docs/DESIGN_FP_TRADE.md §3 Seam Three and
 * §TR-3; docs/DESIGN_FP_ARCH_TR.md §4 TR-3; the compiled block #25; R-5, R-33).
 *
 * WHAT CHANGES WHEN THE FLAG IS LIT. A caravan already decides WHETHER on belief (M6c's believed
 * deterrent), and the loop that sends caravans walks its destination links in codepoint order:
 * when an origin's finite stock cannot serve every market that wants it, the market whose key
 * sorts first is served first. Lit, the loop walks in the order this composer returns: the
 * markets the SUPPLYING court believes dearest in that good's class come first, a tie between
 * two believed markets goes to the one in the deeper TRUE need, and the loop's own codepoint
 * order breaks what is left. "They chose the market they had heard of over the market they could
 * see." Whether each caravan then goes is still the EV's call (`dispatchDecision`), untouched.
 *
 * ⛔⛔ THE TWO SCARCITIES ARE NEVER MERGED (Seam Three, T1 and T8 made structural). This is one
 * of the two WHITELISTED THIN COMPOSERS the seam names (the other is TR-6's corner composer, not
 * yet built). It reads believed dearness on the BELIEF side (worldPulse/beliefScarcity.js) and
 * the need premium on the TRUTH side (dispatchEV.js :: needPremium, a physical-need read that
 * never touches a scarcity band), and no expression in this file combines the two. The order is
 * LEXICOGRAPHIC: belief decides, truth only breaks a belief tie, so neither value is ever
 * averaged, summed or blended into the other. The acceptance file's no-merge token scan convicts
 * any single expression that mixes a believed value with a need or truth value by arithmetic,
 * and a deliberately seeded band-average proves the scan bites. Every other module imports ONE
 * side; the co-import census in the same file admits exactly this one.
 *
 * ⛔ THE LOOP'S THREE NEED-PREMIUM SITES ARE NOT TOUCHED. The EV, the EV spill and the besieged
 * trickle keep reading the truth-side need premium verbatim. This composer decides only the
 * ORDER the loop visits destinations in, through dispatchEV.js's destination-consumer seam
 * (`dispatchDestinationOrder`), which admits a permutation of the loop's own keys and nothing
 * else: a WHERE can reorder the queue, never create, drop or duplicate a caravan.
 *
 * ⛔ DARK BY DEFAULT: `believedMarketsEnabled` is VIRTUAL (L2), read BY NAME with the strict
 * `=== true` idiom in `believedMarketsActive`, the one gate. Dark, commodityFlow.js never calls
 * this module and the loop walks the codepoint order it always walked, byte-identical. A single
 * conjunct, on TR-2's reading: SP-B's scarcity family and TR-1 are LIGHTING-ORDER preconditions
 * the trade contract judges (`tradeConvergenceContract.js :: TRADE_FLAG_LIGHTING_ROWS`), never a
 * door here. Lit over a dark family the composer hears nothing, every market ties on belief and
 * the truth-side need alone orders the queue, which is the configuration that table refuses.
 *
 * T-1, THE WRONG-MARKET TELLABLE ("The caravans came for the famine and found the harvest."). A
 * caravan that lands and leaves its market in the truth-side SURPLUS band (the commodity band,
 * decided in commodityFlow.js where the stock lives) is handed here; if its origin STILL believes
 * that market dear in the good's class, this answers the evidence naming BOTH bands side by side,
 * the belief that sent it and the glut it found. Returned, never persisted: the TR volume's
 * lifecycle line is "NO new persisted state; receipts only".
 *
 * THE EDITOR (R-33, R-5; L10). `direct-trade` is the trade card's WHERE act, one of the several
 * acts R-5's single `directTrade` door offers: a settlement-scale DIRECTION row in operations.js's
 * own `OpTypeDeclaration` shape, its good-class vocabulary imported from the goods catalog, and
 * `requires.world: ['openRoute']`, the EXISTING live predicate (no new row). (a) FORKS: none; the
 * order is a deterministic sort and draws nothing. THE COUNTERPARTY (L10 (c)) is REAL-ONLY: the
 * option reader offers only the settlements an open trade route joins to the card's own, and a
 * phantom destination is refused with a reason that routes it to the off-stage open-trade act.
 * No transport carries an applied direction to a pulse layer today (the chair's amendment of
 * 2026-09-23), so the row is DEFINED and proven headless.
 * TR-3-c: the consumer lands when U123 composes the direction transport.
 *
 * PURE: no Date, no Math.random, no store, no mutation of inputs, zero draws.
 *
 * @enforced-by tests/domain/believedMarketsTr3.test.js
 */

import { REGIONAL_CHANNEL_TYPES, activeChannelsFrom } from '../region/graph.js';
import { REGIONAL_GOOD_CATEGORIES } from '../region/goodsCatalog.js';
import {
  BELIEVED_DEAR_BANDS, believedDearnessRank, believedScarcityOf, goodClassOf,
} from '../worldPulse/beliefScarcity.js';
import { needPremium } from './dispatchEV.js';

/** @param {unknown} value @returns {value is Record<string, unknown>} a plain object */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {string} a trimmed string, or '' */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** Codepoint order, the estate's byte-stable comparator. @param {string} a @param {string} b */
function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * THE ONE GATE. The by-name strict read of the virtual flag (L2; the conjunction-gate hole is
 * why it is spelled by name).
 * @param {unknown} worldState @returns {boolean}
 */
export function believedMarketsActive(worldState) {
  const rules = isPlainObject(worldState) && isPlainObject(worldState.simulationRules)
    ? worldState.simulationRules : null;
  return !!rules && rules.believedMarketsEnabled === true;
}

/**
 * One destination the loop may visit, as the TRUTH side hands it over: its loop key, the
 * market, the good, the court whose picture decides (the link's first-ranked supplier), and the
 * market's stock and target (the physical need).
 * @typedef {{ key: string, destinationId: string, good: string, observerId: string,
 *   stock: number, target: number }} DestinationCandidate
 */

/**
 * One ranked candidate. The two reads sit in two named fields and are never folded into one.
 * @typedef {{ key: string, believedRank: number, needPremium: number }} RankedCandidate
 */

/** The BELIEF key: the market believed dearer comes first. @param {RankedCandidate} a @param {RankedCandidate} b */
function byBelief(a, b) {
  return a.believedRank - b.believedRank;
}

/** The TRUTH key, consulted only on a belief tie: the deeper need first. @param {RankedCandidate} a @param {RankedCandidate} b */
function byNeed(a, b) {
  return b.needPremium - a.needPremium;
}

/** The loop's own codepoint order, last. @param {RankedCandidate} a @param {RankedCandidate} b */
function byKey(a, b) {
  return compareCodepoint(a.key, b.key);
}

/** Belief, then truth, then the key: lexicographic, never a weighted sum. @param {RankedCandidate} a @param {RankedCandidate} b */
function byWhere(a, b) {
  return byBelief(a, b) || byNeed(a, b) || byKey(a, b);
}

/**
 * THE WHERE COMPOSER. The candidates' keys in the order the destination loop should visit them.
 * @param {readonly DestinationCandidate[]} candidates
 * @param {unknown} worldState
 * @returns {string[]}
 */
export function composeDispatchOrder(candidates, worldState) {
  /** @type {RankedCandidate[]} */
  const ranked = [];
  for (const candidate of Array.isArray(candidates) ? candidates : []) {
    const observerId = text(candidate.observerId);
    const believed = observerId
      ? believedScarcityOf(observerId, text(candidate.destinationId), goodClassOf(candidate.good), worldState)
      : null;
    ranked.push({
      key: String(candidate.key),
      believedRank: believedDearnessRank(believed ? believed.band : null),
      needPremium: needPremium(candidate.stock, candidate.target),
    });
  }
  return ranked.sort(byWhere).map((entry) => entry.key);
}

/**
 * @typedef {{ originId: string, destinationId: string, good: string, goodClass: string,
 *   believedBand: string, foundBand: string }} WrongMarketArrival
 */

/**
 * T-1, THE WRONG-MARKET ARRIVAL. The destination loop calls this ONLY for a caravan that landed
 * and left its market in the truth-side SURPLUS band (the caller's own commodity band); it
 * answers the evidence when the caravan's origin STILL believes that market dear in the good's
 * class, and null otherwise. The two bands ride side by side and are never compared by
 * arithmetic: the truth half was decided by the caller, the belief half is decided here.
 * @param {{ originId: string, destinationId: string, good: string, foundBand: string,
 *   worldState: unknown }} input
 * @returns {Readonly<WrongMarketArrival> | null}
 */
export function wrongMarketArrival({ originId, destinationId, good, foundBand, worldState }) {
  const origin = text(originId);
  const destination = text(destinationId);
  const goodClass = goodClassOf(good);
  if (!origin || !destination || origin === destination || !goodClass || !text(foundBand)) return null;
  const believed = believedScarcityOf(origin, destination, goodClass, worldState);
  const believedBand = believed.known && believed.band ? believed.band : '';
  if (!BELIEVED_DEAR_BANDS.includes(believedBand)) return null;
  return Object.freeze({
    originId: origin, destinationId: destination, good: String(good), goodClass,
    believedBand, foundBand: text(foundBand),
  });
}

/** The one direction type this module defines (R-33: the trade card's WHERE act). */
export const TRADE_DIRECTION_TYPE = 'direct-trade';

/**
 * THE DIRECTION ROW, in `operations.js`'s eleven-field `OpTypeDeclaration` shape, so EM-C1's
 * `resolveDecree` reads it as an `opTypes` catalogue without a translation. It addresses the
 * card's own settlement; the destination is a ref the option reader below judges, and the good
 * class is the goods catalog's own closed list, imported, so not one word of vocabulary is
 * spelled here (`directions.js`'s law). The chair composes the row into
 * `directions.js :: DIRECTION_OP_TYPES` at the merge.
 * @type {Readonly<Record<string, import('../edit/operations.js').OpTypeDeclaration>>}
 */
export const TRADE_DIRECTION_OP_TYPES = Object.freeze({
  [TRADE_DIRECTION_TYPE]: Object.freeze({
    target: /** @type {const} */ ('settlement'),
    payload: Object.freeze({
      destination: Object.freeze({ kind: /** @type {const} */ ('ref'), required: true }),
      goodClass: Object.freeze({ kind: /** @type {const} */ ('enum'), values: REGIONAL_GOOD_CATEGORIES, required: true }),
    }),
    stage: /** @type {const} */ ('home'),
    consequence: /** @type {const} */ ('home'),
    requires: Object.freeze({ world: Object.freeze(['openRoute']), registry: Object.freeze([]) }),
    enables: Object.freeze([]),
    relatedTo: Object.freeze([]),
    conflictsWith: Object.freeze([]),
    duration: null,
    guards: Object.freeze([]),
    guardsStated: 'No guard is wired here. The good classes are the goods catalog own closed list, and whether a destination may be named at all is the option reader below, which offers only a real market an open trade road reaches.',
  }),
});

/** The one channel type an open trade road is, read out of the regional graph's own list. */
const TRADE_ROUTE = REGIONAL_CHANNEL_TYPES.filter((type) => type === 'trade_route')[0] || '';

/**
 * The reason a destination outside the options is refused, and it names where a partner off the
 * map goes instead: the off-stage open-trade act, the one road design §13 gives a phantom.
 */
export const DIRECT_TRADE_REFUSAL = 'Only a market an open trade road reaches can be directed here; a partner off the map is traded with off stage, through open-trade.';

/**
 * THE OPTION READER for `direct-trade`'s destination (L10 (c): real-only). The destinations a
 * card may name are the REAL settlements a confirmed trade route joins to the card's own, read
 * through the `openRoute` predicate's first reader (`region/graph.js :: activeChannelsFrom`),
 * codepoint-ordered and unique. A phantom card, a missing graph and garbage all answer none.
 * @param {unknown} record the card's subject settlement @param {unknown} campaignState
 * @returns {readonly string[]}
 */
export function directTradeDestinations(record, campaignState) {
  const id = isPlainObject(record) && record.id != null ? String(record.id) : '';
  const graph = isPlainObject(campaignState) && isPlainObject(campaignState.regionalGraph)
    ? campaignState.regionalGraph : null;
  if (!id || !graph || !TRADE_ROUTE) return Object.freeze([]);
  const reached = new Set();
  for (const channel of activeChannelsFrom(/** @type {import('../region/graph.js').RegionGraph} */ (graph), id, { types: [TRADE_ROUTE] })) {
    const to = isPlainObject(channel) && channel.to != null ? String(channel.to) : '';
    if (to && to !== id) reached.add(to);
  }
  return Object.freeze([...reached].sort(compareCodepoint));
}

/**
 * Whether a `direct-trade` may name `destination`: null when it is one of the option reader's
 * real markets, the refusal reason otherwise. A phantom destination, whether its id or its
 * minimal record is handed in, is refused without a throw and routed by the reason line to the
 * off-stage open-trade act.
 * @param {unknown} destination @param {unknown} record @param {unknown} campaignState
 * @returns {string | null}
 */
export function directTradeRefusal(destination, record, campaignState) {
  const id = typeof destination === 'string' ? destination : '';
  return id && directTradeDestinations(record, campaignState).includes(id) ? null : DIRECT_TRADE_REFUSAL;
}
