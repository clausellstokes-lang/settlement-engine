/**
 * peopleLedger.js — THE CONSERVATION CONSTITUTION, MADE EXECUTABLE (WC-0A).
 *
 * `DESIGN_FP_ARCH_WC.md` §0.2 is the war-circulation volume's spine and its most binding
 * internal law. This module is that section as a frozen object graph: the closed pools,
 * the residency TAGS, the fifteen counting events with their exact debit/credit
 * signatures, the four tag events, the three declared sinks beside the one declared
 * source, the closed selection vocabulary the tag arms name, and the derived
 * block-touching set.
 *
 * A PERSON IS A COUNT, NOT A NAME (CR-WC-2). Every count lives in EXACTLY ONE pool at
 * every tick, carries at most one cohort tag plus an optional free-lance overlay, and
 * moves only through a named event.
 *
 * ⭐⭐ `EVENT_SIGNATURES` IS THE ONE OBJECT THE LAW AND THE MOVERS BOTH READ — never a
 * fixture mirror of it. WC-6's conservation walker derives its checks from this frozen
 * object; the movers obey it; a mover that diverges REDS instead of drifting. That is the
 * whole reason the signatures live in `src/` rather than in the walker: a walker holding
 * its own copy of the law can only ever agree with itself.
 *
 * ⭐ AND THE BLOCK-TOUCHING SET IS DERIVED FROM THAT OBJECT, NOT LISTED BESIDE IT
 * (§1.2.2). The share, blend, comradeship and drift integrals update on every
 * `COUNT_EVENTS` member whose signature names the `block` pool on EITHER side, computed
 * here at module load. A hand-kept second list is the two-arity failure §7.A.8's sibling
 * correction closes — and, worse, a fixture built BY the deriver can never see a dead arm,
 * which is why this member's acceptance case asserts the DERIVATION and its mutant
 * replaces the derived set with a literal identical to today's.
 *
 * ⚠ TWO SIGNATURES ARE INTRA-POOL AND A POOL-LEVEL LAW CANNOT SEE THEM. `defect` is
 * block -> block' and `merge` is free_unit -> free_unit': the pool SUMS do not move, so a
 * pool-level-only walker would pass over a merge that silently dropped a block. Both
 * therefore carry `keyLevel: true` in the signature, so WC-6 derives the right check
 * rather than inventing it.
 *
 * ⚠ `birth` HAS NO PRODUCER YET, AND THAT IS THE POINT. Before the volume's round 3 it was
 * a bare term in the walker law with no signature, no wave and no coverage, so an invented
 * birth was invisible by construction. It gets its signature here; WC-6 gets the
 * birth-inflation mutant. A walker that can see a stolen death and not an invented birth is
 * a guard with one eye.
 *
 * ⚠ ZERO IMPORTS, DELIBERATELY, and a needed import is a STOP rather than a registry edit.
 * ⚠ DARK-COMPLETE BY ABSENCE OF CALLERS: nothing under `src/` imports this module at this
 * member. The first movers arrive at WC-1 and after.
 *
 * ⛔ NO NUMBER IN THIS FILE IS A TUNING VALUE. Every literal is an enumerated member of a
 * vocabulary this module lands. There is no curve, band, threshold or weight here — WC-0's
 * "TUNING: none" holds.
 *
 * PURE: no rng, no clock, no store, no world read.
 */

/**
 * The closed pools. A pool HOLDS people. `census` is `settlement.population`, the existing
 * integer; `block` is an origin-tagged block inside a deployed army; `column` is an
 * in-transit column, travelClass-discriminated, military and demographic columns being ONE
 * object class; `free_unit` is a fissioned independent unit.
 * @type {ReadonlyArray<string>}
 */
export const POOLS = Object.freeze(['block', 'census', 'column', 'free_unit']);

/**
 * The closed residency tags. ⛔ LABELS ON CENSUS MEMBERS, NOT POOLS (CR-WC-20): a veteran
 * shed at Thornhold is a Thornhold resident who is ALSO tagged. A person carries AT MOST
 * ONE `cohort` and OPTIONALLY the `free_lance` overlay — the multiplicity law that
 * replaced an earlier "any number" phrase which falsified the ledger's own totality law.
 * @type {ReadonlyArray<string>}
 */
export const RESIDENCY_TAGS = Object.freeze(['cohort', 'free_lance']);

/**
 * The fifteen counting events, codepoint-sorted and order-free. ⭐ `return` was SPLIT into
 * `depart` + `arrive_home` because a two-hop row in a one-debit-one-credit table is a law
 * that exempts itself. `merge` is the sibling-unit arm that had no event and therefore no
 * road before the volume's round 3.
 * @type {ReadonlyArray<string>}
 */
export const COUNT_EVENTS = Object.freeze([
  'arrival', 'arrive_home', 'defect', 'depart', 'dispatch', 'dm_removed', 'enlist',
  'fell', 'fission', 'merge', 'mortality', 'muster', 'orphan', 'rejoin', 'shed',
]);

/**
 * The subset of `COUNT_EVENTS` that debits census and therefore CARRIES A TAG ARM.
 * ⛔ Derived membership is asserted at module load below: this list and the set of
 * signatures carrying a `tag` arm must agree exactly.
 * @type {ReadonlyArray<string>}
 */
export const CENSUS_DEBITING = Object.freeze(['dispatch', 'enlist', 'mortality', 'muster']);

/**
 * The four tag events. They move NO counts and are inert to the conservation identity;
 * they are named anyway, because an unnamed branch is how a defect hides. `untag` is the
 * one named retirement and subsumes the earlier `absorb`; `reclass` is the only producer
 * of `shed_column` and migrates a LEDGER KEY with the counts held, because an unannounced
 * delete-and-recreate is the count-dropping shape WC-6 exists to catch.
 * @type {ReadonlyArray<string>}
 */
export const TAG_EVENTS = Object.freeze(['brigand', 'demobilize', 'reclass', 'untag']);

/**
 * ⭐ THE DECLARED ENDPOINTS OF THE IDENTITY, SINKS AND SOURCES IN THE SAME FROZEN OBJECT
 * (§0.2). The identity subtracts exactly the three sinks and adds exactly the one source;
 * anything else moving a count is a hole. Exporting them together is what makes an
 * un-sourced credit as visible as an un-sunk debit.
 */
export const CONSERVATION_ENDPOINTS = Object.freeze({
  SINKS: Object.freeze(['dm_removed', 'fell', 'mortality']),
  SOURCES: Object.freeze(['birth']),
});

/**
 * The closed selection vocabulary every tag arm names. Minted at WC-0 because before the
 * volume's round 3 the selection was a typed bucket said three times in prose and declared
 * nowhere — and since the walker derives its check from the SAME object the movers obey,
 * an invented shape becomes law silently.
 * @type {ReadonlyArray<string>}
 */
export const TAG_SELECTIONS = Object.freeze(['pro_rata', 'untag_only', 'veterans_first']);

/** The two non-pool endpoints a signature may name. */
const SINK = 'SINK';
const SOURCE = 'SOURCE';

/**
 * @typedef {object} TagArm
 * @property {string} selection a REQUIRED `TAG_SELECTIONS` member.
 * @property {ReadonlyArray<string>} rows the `RESIDENCY_TAGS` rows the arm debits.
 */

/**
 * @typedef {object} EventSignature
 * @property {ReadonlyArray<string>|'SOURCE'} debit one debit arm; several admissible source
 *   pools mean one occurrence debits exactly one of them, never several at once.
 * @property {string} credit one credit arm: a pool, or the declared `SINK`.
 * @property {TagArm} [tag] present exactly on the census-debiting events.
 * @property {boolean} [keyLevel] the intra-pool events, whose conservation check is per-key.
 * @property {string} [restore] `arrive_home`'s credit-back from the banked composition.
 */

/** @param {...string} pools */
const from = (...pools) => Object.freeze(pools);

/**
 * @param {string} selection
 * @param {ReadonlyArray<string>} rows
 * @returns {TagArm}
 */
const tagArm = (selection, rows) => Object.freeze({ selection, rows: Object.freeze(rows) });

/**
 * ⭐⭐ THE SIGNATURES. One debit ARM and one credit ARM each — never a two-hop row. A debit
 * arm may admit several source pools (a `fell` may take a block, a free unit or a column),
 * but any single occurrence debits exactly one of them.
 *
 * ⛔ THE TAG ARM IS PART OF THE SIGNATURE, not a convention beside it. A mover that debits
 * census without running its arm diverges from this object and reds. Before the arms were
 * named, `muster`, `dispatch` and `enlist` were free to take people OUT of census while
 * their tag rows stood still — which made LAW 1 red on designed behaviour and made WC-16's
 * field-or-garrison pin arithmetically inert.
 *
 * @type {Readonly<Record<string, EventSignature>>}
 */
export const EVENT_SIGNATURES = Object.freeze({
  arrival: Object.freeze({ debit: from('column'), credit: 'block' }),
  // ⛔ `arrive_home` CREDITS census, so it is not a CENSUS_DEBITING member and names NO
  //    TAG_SELECTIONS member. Its arm restores exactly the origin rows the muster debited,
  //    from the composition banked onto the block — the arm that keeps origin immutable
  //    across a muster-and-return cycle (§1.13.1). Giving it a selection would invent a
  //    mapping the volume does not state; WC-16's round-trip pin is what proves it.
  arrive_home: Object.freeze({
    debit: from('column'),
    credit: 'census',
    restore: 'banked_composition',
  }),
  birth: Object.freeze({ debit: SOURCE, credit: 'census' }),
  defect: Object.freeze({ debit: from('block'), credit: 'block', keyLevel: true }),
  depart: Object.freeze({ debit: from('block'), credit: 'column' }),
  dispatch: Object.freeze({
    debit: from('census'),
    credit: 'column',
    tag: tagArm('veterans_first', ['cohort', 'free_lance']),
  }),
  dm_removed: Object.freeze({ debit: from('block', 'free_unit'), credit: SINK }),
  enlist: Object.freeze({
    debit: from('census'),
    credit: 'block',
    tag: tagArm('untag_only', ['cohort', 'free_lance']),
  }),
  fell: Object.freeze({ debit: from('block', 'column', 'free_unit'), credit: SINK }),
  fission: Object.freeze({ debit: from('block'), credit: 'free_unit' }),
  merge: Object.freeze({ debit: from('free_unit'), credit: 'free_unit', keyLevel: true }),
  mortality: Object.freeze({
    debit: from('census'),
    credit: SINK,
    tag: tagArm('pro_rata', ['cohort', 'free_lance']),
  }),
  muster: Object.freeze({
    debit: from('census'),
    credit: 'block',
    tag: tagArm('veterans_first', ['cohort', 'free_lance']),
  }),
  orphan: Object.freeze({ debit: from('block'), credit: 'free_unit' }),
  rejoin: Object.freeze({ debit: from('free_unit'), credit: 'block' }),
  shed: Object.freeze({ debit: from('column', 'free_unit'), credit: 'census' }),
});

/**
 * The tag events' own signatures. `untag`'s kind set is asserted EQUAL to `RESIDENCY_TAGS`
 * at module load, so a new tag cannot be minted without a retirement for it.
 *
 * @type {Readonly<Record<string, { effect: string, kinds?: ReadonlyArray<string> }>>}
 */
export const TAG_EVENT_SIGNATURES = Object.freeze({
  brigand: Object.freeze({ effect: 'free_unit_state' }),
  demobilize: Object.freeze({ effect: 'credit_tag', kinds: Object.freeze(['free_lance']) }),
  reclass: Object.freeze({ effect: 'column_key_migration' }),
  untag: Object.freeze({ effect: 'retire_tag', kinds: Object.freeze(['cohort', 'free_lance']) }),
});

/** @param {string} message @returns {never} */
const fail = (message) => {
  throw new TypeError(`peopleLedger: ${message}`);
};

/** @param {ReadonlyArray<string>} a @param {ReadonlyArray<string>} b */
const sameSet = (a, b) => {
  const left = [...a].sort();
  const right = [...b].sort();
  return left.length === right.length && left.every((x, i) => right[i] === x);
};

// ── MODULE-LOAD TOTALITY. §0.2 is explicit that an absent or unknown selection fails at
//    MODULE LOAD, not at the first muster: the walker derives its checks from this object,
//    so a malformed signature must never become law by being loadable.
for (const event of COUNT_EVENTS) {
  const signature = EVENT_SIGNATURES[event];
  if (!signature) fail(`${event} is a COUNT_EVENT with no signature`);
  if (!Array.isArray(signature.debit) || signature.debit.length === 0) {
    fail(`${event} has no debit arm`);
  }
  const debitPools = /** @type {ReadonlyArray<string>} */ (signature.debit);
  for (const pool of debitPools) {
    if (!POOLS.includes(pool)) fail(`${event} debits unknown pool ${JSON.stringify(pool)}`);
  }
  if (signature.credit !== SINK && !POOLS.includes(signature.credit)) {
    fail(`${event} credits unknown pool ${JSON.stringify(signature.credit)}`);
  }
  const debitsCensus = debitPools.includes('census');
  if (debitsCensus !== CENSUS_DEBITING.includes(event)) {
    fail(`${event} census-debiting membership disagrees with its signature`);
  }
  if (debitsCensus && !signature.tag) fail(`${event} debits census with no TAG ARM`);
  if (signature.tag && !TAG_SELECTIONS.includes(signature.tag.selection)) {
    fail(`${event} names selection ${JSON.stringify(signature.tag?.selection)}, which is not a TAG_SELECTIONS member`);
  }
  for (const row of signature.tag?.rows ?? []) {
    if (!RESIDENCY_TAGS.includes(row)) fail(`${event} tag arm names unknown tag ${JSON.stringify(row)}`);
  }
}
for (const event of CONSERVATION_ENDPOINTS.SINKS) {
  if (EVENT_SIGNATURES[event]?.credit !== SINK) fail(`declared sink ${event} does not credit the sink`);
}
for (const event of CONSERVATION_ENDPOINTS.SOURCES) {
  const signature = EVENT_SIGNATURES[event];
  if (signature?.debit !== SOURCE) fail(`declared source ${event} does not debit the source`);
  if (signature.tag) fail(`declared source ${event} carries a tag arm; a newborn takes no tag`);
}
if (!sameSet(TAG_EVENT_SIGNATURES.untag.kinds ?? [], RESIDENCY_TAGS)) {
  fail("untag's kind set must equal RESIDENCY_TAGS exactly — a new tag needs a retirement");
}

/**
 * ⭐ DERIVED AT MODULE LOAD, NOT LISTED. Every `COUNT_EVENTS` member whose signature names
 * the `block` pool on either side — the events the share, blend, comradeship and drift
 * integrals must update on. WC-7 later pins this equal to the movers' actual call set.
 * @type {ReadonlyArray<string>}
 */
export const BLOCK_TOUCHING_EVENTS = Object.freeze(
  COUNT_EVENTS.filter((event) => {
    const signature = EVENT_SIGNATURES[event];
    return (
      /** @type {ReadonlyArray<string>} */ (signature.debit).includes('block')
      || signature.credit === 'block'
    );
  }),
);

/**
 * The signature for a named event, throw-on-unknown.
 * @param {unknown} event one of `COUNT_EVENTS`.
 * @throws {TypeError} on any non-member — a silent default would let an unnamed movement
 *   pass the identity.
 */
export function eventSignature(event) {
  const key = /** @type {PropertyKey} */ (event);
  const signature = Object.prototype.hasOwnProperty.call(EVENT_SIGNATURES, key)
    ? EVENT_SIGNATURES[/** @type {string} */ (event)]
    : undefined;
  if (!signature) {
    fail(`unknown event ${JSON.stringify(event)} — the count-event vocabulary is closed`);
  }
  return signature;
}

/**
 * The tag selection a census-debiting event runs, throw-on-unknown.
 * @param {unknown} event one of `CENSUS_DEBITING`.
 * @throws {TypeError} on any event that does not debit census.
 */
export function tagSelectionFor(event) {
  const signature = eventSignature(event);
  if (!signature.tag) {
    fail(`${String(event)} does not debit census and runs no tag arm`);
  }
  return signature.tag.selection;
}
