/**
 * houseActs.js — TR-2 THE HOUSE: WHAT A MERCHANT HOUSE DOES (docs/DESIGN_FP_TRADE.md §TR-2;
 * docs/DESIGN_FP_ARCH_TR.md §4 TR-2; the compiled block #24; RULINGS-OVER-THE-DRAFTS R-32).
 *
 * THE CLOSED VERB SET AND ITS THRESHOLD CHOOSER. A house acts at FACTION grain (Law One: no
 * micro-agents), and what it may do is a CLOSED vocabulary rather than a plan. The chooser
 * reads the house's OWN books (banded holdings, banded credit, typed interests), its appetite
 * band and the band its settlement's own fortune points at, and answers ONE verb or nothing.
 * It never names a victim, a partner or a road: T4's no-hidden-governor law. WHERE an act
 * lands is the existing machinery's business the day a wiring wave executes it; the house
 * steers physics and never owns a physics lane.
 *
 * ⛔ IMPORT-PINNED TO NOTHING. This leaf imports no module at all — no relationship graph, no
 * target list, no roster, no belief map. tests/domain/houseLedgerTr2.test.js pins the import
 * list EMPTY and drives a guard-the-guard positive control at a legitimate truth reader, so a
 * hidden governor planted here reds by name (the zero-import appraisal-leaf geometry of L3).
 *
 * ⭐ THE VOCABULARY IS THE FOUR VERBS WHOSE WAVE HAS LANDED. The design's closed set also
 * names `corner_attempt` (TR-6), `venture_stake` (TR-7) and `petition_pact` (TR-5); each is
 * APPENDED by its own wave, because a verb in this list is a word a DM can direct (L10 (e):
 * save-data contract) and a direction must bind to what is built. Appending is growth; a
 * rename or a removal is a vocabulary move the decree resolver withdraws on.
 *
 * ⭐ THE DIRECTION IS DEFINED HERE AND COMPOSED ELSEWHERE (L10 (b)(ii), J-EM-2, R-32).
 * `direct-house` is a settlement-scale DIRECTION row in `operations.js`'s own
 * `OpTypeDeclaration` shape, its verb list imported from this module; the chair composes it
 * into `directions.js :: DIRECTION_OP_TYPES` at the merge. Formation, the ruin latch and a
 * rename stay LATCHES (no seal, by design). The chooser takes no direction at this wave: the
 * chair's amendment of 2026-09-23 measured that no transport carries an applied direction to
 * a pulse layer today, so the consumer lands when U123 composes that transport.
 *
 * PURE, TOTAL, ZERO-DRAW: no rng, no clock, no store, no mutation. Garbage answers nothing.
 */

/**
 * The house's act vocabulary at TR-2, in codepoint order. Frozen and literal-typed.
 */
export const HOUSE_ACT_VERBS = Object.freeze(/** @type {const} */ ([
  'extend_credit', 'relief_grant', 'sponsor_caravan', 'take_route_interest',
]));

/**
 * The typed interest each act opens on the house's own books, keyed by the verb. A live
 * interest is what keeps a house above its settlement's fortune (the growth arm); a lapsed
 * one lets it fall back (no wealth ratchet).
 * @type {Readonly<Record<string, string>>}
 */
export const HOUSE_ACT_INTEREST = Object.freeze({
  extend_credit: 'credit',
  relief_grant: 'relief',
  sponsor_caravan: 'caravan',
  take_route_interest: 'route',
});

/** The typed interest kinds, codepoint-sorted, derived from the verb table. */
export const HOUSE_INTEREST_KINDS = Object.freeze(
  [...new Set(Object.values(HOUSE_ACT_INTEREST))].sort(),
);

/** The holdings band ladder, low to high. `broken` is the ruin rung. */
export const HOUSE_HOLDINGS_BANDS = Object.freeze(/** @type {const} */ ([
  'broken', 'thin', 'steady', 'prosperous', 'dominant',
]));

/** The credit band ladder, low to high. */
export const HOUSE_CREDIT_BANDS = Object.freeze(/** @type {const} */ ([
  'overdrawn', 'tight', 'sound', 'flush',
]));

/** The appetite band ladder, low to high (the SP-4a house instance, banded). */
export const HOUSE_APPETITE_BANDS = Object.freeze(/** @type {const} */ ([
  'wary', 'measured', 'bold',
]));

/**
 * THE ACT THRESHOLDS — raw-authored tuning, owner-signed at the soak redo (THE PROMISE;
 * §7's band families). Each is a band INDEX on the ladder named beside it, so a threshold
 * can only ever name a rung the ladder has.
 */
export const HOUSE_ACT_TUNING = Object.freeze({
  /** relief: the town's fortune points at or below `thin`… */
  reliefTownAtMost: 1,
  /** …and the house holds at least `prosperous`. */
  reliefHoldingsAtLeast: 3,
  /** a route interest wants at least `steady` holdings… */
  routeHoldingsAtLeast: 2,
  /** …and at least a `measured` appetite. */
  routeAppetiteAtLeast: 1,
  /** a caravan wants at least `steady` holdings. */
  caravanHoldingsAtLeast: 2,
  /** credit wants at least `sound` credit… */
  creditAtLeast: 2,
  /** …and a `bold` appetite. */
  creditAppetiteAtLeast: 2,
});

/** @param {unknown} value @returns {value is Record<string, unknown>} a plain object */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * The index of a band word on its ladder, or -1 when it is not a rung.
 * @param {readonly string[]} ladder @param {unknown} word @returns {number}
 */
export function bandIndex(ladder, word) {
  return typeof word === 'string' ? ladder.indexOf(word) : -1;
}

/**
 * The interest kinds that are LIVE at `tick` — opened no more than `termTicks` ago.
 * @param {unknown} interests the books' interest rows @param {number} tick @param {number} termTicks
 * @returns {readonly string[]} codepoint-sorted, unique
 */
export function liveInterestKinds(interests, tick, termTicks) {
  const rows = Array.isArray(interests) ? interests : [];
  /** @type {Set<string>} */
  const live = new Set();
  for (const row of rows) {
    if (!isPlainObject(row) || typeof row.kind !== 'string') continue;
    const since = typeof row.sinceTick === 'number' && Number.isFinite(row.sinceTick) ? row.sinceTick : null;
    if (since !== null && tick - since < termTicks) live.add(row.kind);
  }
  return Object.freeze([...live].sort());
}

/**
 * THE THRESHOLD CHOOSER. One verb, or `null`, from the house's own books and bands.
 *
 * The rules run in a fixed order and the FIRST that holds answers, so two runs over one
 * input answer alike (codepoint order is never consulted because no candidate list exists).
 * A verb whose interest is already live is never re-taken, which is what throttles a house
 * to one act per interest per term without a clock of its own.
 *
 * @param {{ books?: unknown, appetite?: unknown, townBand?: unknown,
 *   liveInterests?: readonly string[] }} input
 * @returns {string|null} a member of HOUSE_ACT_VERBS, or null
 */
export function chooseHouseAct(input) {
  const bag = isPlainObject(input) ? input : {};
  const books = isPlainObject(bag.books) ? bag.books : {};
  const holdings = bandIndex(HOUSE_HOLDINGS_BANDS, books.holdings);
  const credit = bandIndex(HOUSE_CREDIT_BANDS, books.credit);
  const appetite = bandIndex(HOUSE_APPETITE_BANDS, bag.appetite);
  const town = typeof bag.townBand === 'number' && Number.isInteger(bag.townBand) ? bag.townBand : -1;
  const live = new Set(Array.isArray(bag.liveInterests) ? bag.liveInterests : []);
  if (holdings < 0) return null;
  const t = HOUSE_ACT_TUNING;
  const open = (/** @type {string} */ verb) => !live.has(HOUSE_ACT_INTEREST[verb]);
  if (town >= 0 && town <= t.reliefTownAtMost && holdings >= t.reliefHoldingsAtLeast && open('relief_grant')) {
    return 'relief_grant';
  }
  if (holdings >= t.routeHoldingsAtLeast && appetite >= t.routeAppetiteAtLeast && open('take_route_interest')) {
    return 'take_route_interest';
  }
  if (holdings >= t.caravanHoldingsAtLeast && open('sponsor_caravan')) return 'sponsor_caravan';
  if (credit >= t.creditAtLeast && appetite >= t.creditAppetiteAtLeast && open('extend_credit')) {
    return 'extend_credit';
  }
  return null;
}

/** The one direction type this module defines (R-32: "Direct the house."). */
export const HOUSE_DIRECTION_TYPE = 'direct-house';

/**
 * THE DIRECTION ROW, in `operations.js`'s eleven-field `OpTypeDeclaration` shape, so EM-C1's
 * `resolveDecree` reads it as an `opTypes` catalogue without a translation. The target kind
 * follows the record: a house IS a faction with the merchant archetype and books, so the
 * direction addresses a `faction`. `requires.world` names this wave's own predicate,
 * `houseStanding` (houseLedger.js), which the chair composes into `WORLD_CONDITIONS`.
 * @type {Readonly<Record<string, import('../edit/operations.js').OpTypeDeclaration>>}
 */
export const HOUSE_DIRECTION_OP_TYPES = Object.freeze({
  [HOUSE_DIRECTION_TYPE]: Object.freeze({
    target: /** @type {const} */ ('faction'),
    payload: Object.freeze({
      act: Object.freeze({ kind: /** @type {const} */ ('enum'), values: HOUSE_ACT_VERBS, required: true }),
      houseId: Object.freeze({ kind: /** @type {const} */ ('ref'), required: true }),
    }),
    stage: /** @type {const} */ ('home'),
    consequence: /** @type {const} */ ('home'),
    requires: Object.freeze({ world: Object.freeze(['houseStanding']), registry: Object.freeze([]) }),
    enables: Object.freeze([]),
    relatedTo: Object.freeze([]),
    conflictsWith: Object.freeze([]),
    duration: null,
    guards: Object.freeze([]),
    guardsStated: 'No guard is wired here. The verbs are the house own closed set, so a direction can only name an act the chooser can play, and whether a house stands to take it is the houseStanding condition rather than a guard.',
  }),
});
