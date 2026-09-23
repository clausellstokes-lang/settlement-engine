/**
 * directives.js — THE DIRECTOR'S PINS, PURE (EM-E4, wave 3; design §16, §18 and §19
 * rulings 1, 3, 4 and 7; the chair's judgment 265).
 *
 * "The DM never writes the outcome into the world. The DM PINS THE PROCESS'S DECISION,
 * and the simulation plays the consequences by its own rules" (design §16). This leaf is
 * the whole of that idea in code: it reads a `pin-fork` op, judges it against the fork's
 * OWN outcome words, folds the due pins into one bag, and hands a fork the pinned outcome
 * instead of its draw. It writes nothing, reads no clock, takes no draw and mints no id.
 *
 * ⛔ THE PIN SHAPE IS `chooseOrPin`'s, AND THAT IS A RULING, NOT A PREFERENCE (judgment
 * 265 (b); EM-P0's acceptance A3). `chooseOrPinFork` DOES NOT ADVANCE THE STREAM when a
 * pin is present: in pinned mode nothing draws where the record holds the output. The
 * generator's `chooseOrPin` keys by the RECORD PATH a chooser writes; this one keys by the
 * REGISTERED FORK ID, because the simulation's forks are registered by id in
 * `HABIT_FORK_REGISTRY` and a pulse fork writes no single record path.
 *
 * ⛔ THE VOCABULARY IS AN ARGUMENT, AND THAT IS MEASURED RATHER THAN CHOSEN — the third
 * time this estate has had to reach for the shape, after `resolveDecree`'s catalogues and
 * `makeGuardRuleSet`'s injected writers. Two separate measurements force it here. FIRST,
 * the words live beside their forks: `TRADITION_OUTCOME` in the traditions kernel,
 * `SIEGE_VERDICT_BANDS` in the siege verdict. Importing them would put those modules, and
 * `HABIT_FORK_REGISTRY` with them, inside the closure of whatever imports this leaf; the
 * fork registry has ZERO `src/` importers today, and the tick hook that consults these
 * pins is reached from `simulateCampaignWorldPulse`, so the import would make a 26 KB
 * classification table eager in the pulse for nothing. A byte rise is the owner's.
 * SECOND, `couplingInclusion.walker.test.js` holds `decreeHook.js` as an argued SUBSTRATE
 * whose `reads` is `[]` and MEASURES that declaration against the live import graph; the
 * one import this leaf's consumer may take is another unlayered edit leaf, which is what
 * this file is. So the caller that already holds a fork's words hands them in, and the
 * words are never re-spelled anywhere.
 *
 * ⛔ A CATALOGUE ENTRY IS A LIST OF WORDS, AND THERE IS EXACTLY ONE READING RULE.
 * `TRADITION_OUTCOME` is a frozen KEY-to-word object and `SIEGE_VERDICT_BANDS` a frozen
 * BAND-to-falls object, so no single accessor reads both correctly. Rather than mint a
 * classifier that guesses which half of an object is the vocabulary — the second-home
 * mistake — this leaf accepts ONE shape, a non-empty array of names, and each caller
 * states its own reading of its own export at the one place it hands the words over.
 *
 * ⛔ IT NEVER REFUSES OUT LOUD AND NEVER THROWS, exactly as EM-C1's registry does not.
 * `resolvePinFork` JUDGES and returns EM-C1's own `Resolution`; the caller that withdraws
 * on a refusal is the one refusal site for that act (design §12). The refusal kinds are
 * `RESOLUTION_MISSING_KINDS`' own `fork` and `outcome`, the two members EM-C1's header
 * reserved for this member by name, so no word is minted here either.
 *
 * ⛔ WHAT THIS LEAF DOES NOT DECIDE. It holds no fork-to-change-family table: design §19
 * ruling 2 says a pin that bypasses the approval queue is a second write path, so
 * `pinApplyMode` computes NOTHING of its own and can answer only what the injected
 * `authorityFor` answers. Its one owned behaviour is the FAIL-SAFE: a pin whose authority
 * cannot be read is a proposal, never an auto-apply.
 */

/** @typedef {import('./registry.js').Decree} Decree */
/** @typedef {import('./registry.js').Resolution} Resolution */

import { RESOLUTION_MISSING_KINDS } from './registry.js';

/**
 * The one directive op type this member binds (design §16: "One op type, `pin-fork`, over
 * different forks"). The op catalogue's row is EM-B1b's; this is the word the tick reads.
 */
export const PIN_FORK_TYPE = 'pin-fork';

/**
 * The payload fields a `pin-fork` carries, in `compareCodepoint` order of their names.
 * A pin names a REGISTERED FORK and an OUTCOME from that fork's own vocabulary; the TICK
 * is the entry's own `when` (design §16), which is why no third field lives here.
 */
export const PIN_FORK_FIELDS = Object.freeze(/** @type {const} */ (['forkId', 'outcome']));

/** The refusal kind for a fork that is unnamed, unregistered or carries no vocabulary. */
const MISSING_FORK = RESOLUTION_MISSING_KINDS[1];
/** The refusal kind for a word outside the fork's declared vocabulary. */
const MISSING_OUTCOME = RESOLUTION_MISSING_KINDS[3];

/** The apply mode a pin takes when its authority cannot be read. */
const PROPOSAL = 'proposal';

/** One frozen empty bag, so a tick with no pin allocates nothing and compares alike. */
const NO_PINS = /** @type {Readonly<Record<string, string>>} */ (Object.freeze({}));

/** @param {unknown} value @returns {value is Record<string, unknown>} a plain object, never an array and never null */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {value is string} a non-empty string */
function isName(value) {
  return typeof value === 'string' && value.length > 0;
}

/** @param {string} missing @param {string} was @returns {Resolution} */
function refusal(missing, was) {
  return /** @type {Resolution} */ (Object.freeze({ ok: false, missing, was }));
}

/**
 * ONE ENTRY'S PIN, or nothing. Total on garbage: an entry whose op is not a `pin-fork`,
 * or whose payload does not carry two non-empty strings, reads as no pin at all. It does
 * NOT judge the words against a vocabulary, because that judgment needs the catalogue and
 * a reader that conflated "not a pin" with "a pin naming a word that moved" would silently
 * drop the second (design §20.3's whole point).
 *
 * @param {unknown} entry a registry entry, or a bare op-bearing bag
 * @returns {{ forkId: string, outcome: string }|null}
 */
export function pinForkOf(entry) {
  if (!isPlainObject(entry)) return null;
  const op = isPlainObject(entry.op) ? entry.op : entry;
  if (op.type !== PIN_FORK_TYPE) return null;
  const payload = isPlainObject(op.payload) ? op.payload : {};
  const forkId = payload[PIN_FORK_FIELDS[0]];
  const outcome = payload[PIN_FORK_FIELDS[1]];
  if (!isName(forkId) || !isName(outcome)) return null;
  return Object.freeze({ forkId, outcome });
}

/**
 * The fork's declared outcome words, or nothing. A catalogue entry that is not a non-empty
 * array of non-empty strings is NO vocabulary: design §19 ruling 1 offers a pin only over
 * a row with a declared vocabulary, and a half-shaped entry is exactly the "measurement
 * owed" case rather than a fork with fewer words.
 *
 * @param {unknown} catalogue `{ [forkId]: readonly string[] }`, handed in by the caller
 * @param {unknown} forkId
 * @returns {readonly string[]|null}
 */
export function forkVocabularyOf(catalogue, forkId) {
  if (!isPlainObject(catalogue) || !isName(forkId)) return null;
  if (!Object.hasOwn(catalogue, forkId)) return null;
  const words = catalogue[forkId];
  if (!Array.isArray(words) || words.length === 0) return null;
  return words.every(isName) ? /** @type {readonly string[]} */ (words) : null;
}

/**
 * JUDGE ONE `pin-fork` OP against the live vocabularies (design §19 ruling 1). PURE and
 * TOTAL: it judges and never writes, so a caller may run it at STAGE TIME — where the
 * seal's own pop-up already closes the vocabulary by construction, offering the fork's own
 * outcomes as the choices — and the tick may run it again over an entry whose vocabulary
 * moved between the two (design §20.3). The order of the two judgments is fixed, fork
 * before outcome, so two runs over one op answer alike.
 *
 * An op that is not a `pin-fork` is SILENCE (`ok: true`): the caller selects, this judges,
 * and every other op type belongs to a member that owns its own words.
 *
 * @param {unknown} op @param {unknown} catalogue
 * @returns {Resolution}
 */
export function resolvePinFork(op, catalogue) {
  const bag = isPlainObject(op) ? op : {};
  if (bag.type !== PIN_FORK_TYPE) return /** @type {Resolution} */ (Object.freeze({ ok: true }));
  const payload = isPlainObject(bag.payload) ? bag.payload : {};
  const forkId = payload[PIN_FORK_FIELDS[0]];
  if (!isName(forkId)) return refusal(MISSING_FORK, '');
  const words = forkVocabularyOf(catalogue, forkId);
  if (!words) return refusal(MISSING_FORK, forkId);
  const outcome = payload[PIN_FORK_FIELDS[1]];
  if (!isName(outcome) || !words.includes(outcome)) {
    return refusal(MISSING_OUTCOME, isName(outcome) ? outcome : '');
  }
  return /** @type {Resolution} */ (Object.freeze({ ok: true }));
}

/**
 * THE PIN BAG for one tick, from the entries the caller has already found DUE and put in
 * the registry's own reading order. Only a pin that RESOLVES enters: a fork with no
 * declared vocabulary and a word outside one are both refused here, so the fork itself is
 * never reached by a pin the world cannot mean (design §19 ruling 1).
 *
 * TWO PINS ON ONE FORK IN ONE TICK: the LATER entry wins, which is not a new rule but the
 * contention guard's own reading of two waiting acts that set one fact, applied to the
 * sequence the tick is about to run. The guard has already offered the DM the alternative.
 *
 * ⛔ At zero resolved pins it returns ONE shared frozen bag, so a tick that holds no
 * directive allocates nothing and every consult on it is a miss by reference.
 *
 * @param {unknown} entries @param {unknown} catalogue
 * @returns {Readonly<Record<string, string>>}
 */
export function forkPinsFor(entries, catalogue) {
  const rows = Array.isArray(entries) ? entries : [];
  /** @type {Record<string, string>} */
  const pins = {};
  let held = 0;
  for (const row of rows) {
    const pin = pinForkOf(row);
    if (!pin) continue;
    const op = isPlainObject(row) && isPlainObject(row.op) ? row.op : row;
    if (resolvePinFork(op, catalogue).ok !== true) continue;
    pins[pin.forkId] = pin.outcome;
    held += 1;
  }
  return held === 0 ? NO_PINS : Object.freeze(pins);
}

/**
 * THE CONSULT, in `chooseOrPin`'s exact shape (judgment 265 (b); EM-P0's A3). A fork whose
 * id is pinned takes the pinned outcome and DOES NOT DRAW; one that is not pinned draws on
 * its own stream exactly as today. The draw is a thunk rather than a value for that single
 * reason: an evaluated argument would consume the draw on the pinned path and every
 * downstream draw in the tick would shift under a pin that was supposed to stand in for it.
 *
 * @template T
 * @param {unknown} pins @param {string} forkId @param {() => T} draw
 * @returns {T|string}
 */
export function chooseOrPinFork(pins, forkId, draw) {
  if (isPlainObject(pins) && Object.hasOwn(pins, forkId)) {
    const held = pins[forkId];
    if (isName(held)) return held;
  }
  return draw();
}

/**
 * THE ONE ROUTE A PIN'S WRITE MAY TAKE (design §19 ruling 2: "a `pin-fork` that bypasses
 * the approval queue is a second write path"). `authorityFor` is INJECTED for the reason
 * the vocabularies are, and this verb adds NO rule of its own: whatever the estate's own
 * policy answers for that change family is the answer, including the `routine` reading of
 * `ACTOR_INITIATED_MAJOR_TYPES`.
 *
 * ⛔ ITS ONE OWNED BEHAVIOUR IS THE FAIL-SAFE. A caller that hands no authority reader gets
 * `proposal`, never `auto`: an unroutable pin waits for the table rather than writing the
 * world unseen, which is design §9's tie-break (a false warning costs less trust than a
 * missing one) applied to the write itself.
 *
 * @param {unknown} authorityFor the estate's own reader, `(rules, changeType, legacyMode) => string`
 * @param {unknown} rules @param {unknown} changeType @param {unknown} [legacyMode]
 * @returns {string}
 */
export function pinApplyMode(authorityFor, rules, changeType, legacyMode) {
  if (typeof authorityFor !== 'function' || !isName(changeType)) return PROPOSAL;
  const mode = /** @type {(a: unknown, b: string, c: string) => unknown} */ (authorityFor)(
    rules, changeType, isName(legacyMode) ? legacyMode : PROPOSAL,
  );
  return isName(mode) ? mode : PROPOSAL;
}
