/**
 * domain/display/stateProse/generalStateProseCandidates.js — the General desk's MODIFIER
 * CANDIDATES (ARCH-COMPOSED-PROSE §4.1, M-F7).
 *
 * WHAT THIS IS. A composed unit is a spine sentence plus, at most, the modifiers the state
 * actually earns. The spine key is the desk's own key function; the MODIFIERS are offered by
 * this leaf, one explicit call per modifier pool, in the order the desk wants them offered.
 * The composer ranks and bounds them; this file only says which ones fired.
 *
 * ⛔ WHY A SIBLING LEAF AND NOT THE DESK ITSELF. `generalStateProse.js` stands at 699
 * effective lines under an 800 ceiling, and a candidate function per pool would red the size
 * baseline mid-wave — a wave that then has to choose between finishing a block and staying
 * green. The six leaves take that growth instead, one per desk, so the desks keep their one
 * law and the authoring wave has somewhere to land.
 *
 * ⛔ EXPLICIT CALLS, NEVER AN ITERATION OVER `pools` (P-F12). A pool key is not a predicate.
 * Iterating a block's pools to build candidates would offer every key the projector happens
 * to have emitted — including the numeric-looking ones the annex refuses and every spine in
 * the block — and the composer's audience and attach filters would be asked to do a job the
 * desk never did. Each row below is one authored call to one pool's own predicate.
 *
 * ⭐ ONE POOL FIRES HERE, AND IT IS THE TASTE'S (TASTE car M-3; ARCH §6.5). Cars 3b-3g routed
 * the desks through the composer with an EMPTY list, and car 9 authors the wave's modifiers
 * off the census's CUT list; this dock authors the one the taste measures.
 *
 * ⛔ AND IT NEEDED A READING THE DESK WAS NOT BEING HANDED. ARCH §6.5 says in terms that
 * `purse: short` "needs `economicGates` in the general desk's readings — a caller line at
 * `generalDeskRead.js`", and that caller line is this car's. The gate SPINES on the defense
 * tab (DS-DEF-11's WALLED-STRAINED reads it) and is free to MODIFY on overview, which is
 * exactly what the echo bound permits and what makes this the architecture's own worked
 * example of a fact that travels between tabs.
 *
 * The desk composes at 11 of the 31 routed call sites (car 3g), the largest desk of the six.
 *
 * PURE HEADLESS LEAF: no imports, no state, no clock, no RNG.
 *
 * @enforced-by tests/domain/composeStateProse.test.js
 * @enforced-by tests/lint/composeStateProseFence.test.js
 * @enforced-by tests/lint/proseTasteCandidates.walker.test.js
 */

/**
 * DS-GEN-3's purse predicate: the economic-upkeep GATE on the military stack, PRESENT and
 * below one.
 *
 * ⛔ PRESENT IS HALF THE PREDICATE, AND THE HALF THAT IS EASY TO DROP. `defenseGenerator.js`
 * writes `economicGates.military` only under `hasAnyDefense`, so an absent gate is ABSENCE and
 * not 1.0; a bare `< 1` on `undefined` is false by luck rather than by reading, and the same
 * guard is what makes the census call this read `measured` rather than `default`. The shipped
 * `wallRationalePoolKey` spells it the same way and this is deliberately its twin.
 * @param {Record<string, unknown>} readings the general desk's own readings bag
 * @returns {boolean}
 */
function purseIsShort(readings) {
  const gates = /** @type {{military?: unknown}|null|undefined} */ (
    /** @type {any} */ (readings).economicGates);
  const gate = gates?.military;
  return typeof gate === 'number' && Number.isFinite(gate) && gate < 1;
}

/**
 * One modifier pool the state earned, as the composer takes it.
 * @typedef {object} StateProseCandidate
 * @property {string} key the modifier pool key, in the SAME block as the spine
 * @property {0|1} [change] the typed CHANGE flag — true only from a PERSISTED band (a
 *   condition's `direction: worsening`, `populationTrend.band`), never from a clock
 *   comparison, which would move composed text with no fact having moved (P-F8)
 */

/**
 * The General desk's modifier candidates for one block, in offer order.
 *
 * @param {string} blockId the block being composed, e.g. 'DS-GEN-3'
 * @param {Record<string, unknown>|null|undefined} readings the desk's own readings for
 *   this town. NULLABLE BY DECLARATION (SEAM car 3f-0): a desk hands over a reading it
 *   ALREADY HOLDS, under the name it already has, and several of those are nullable at
 *   their own call sites. The alternative measured worse: a desk that wrapped its locals
 *   in a fresh object literal to satisfy a narrower type minted every one of those names
 *   into the wiring census's PRODUCER INDEX, which reads an object-literal key under
 *   `src/domain/**` as a WRITE, and the census's `absent` column moved on rows belonging
 *   to other desks. The guard below is the contract, and this type is what makes it live
 *   rather than a branch the declared type says can never be taken.
 * @returns {ReadonlyArray<StateProseCandidate>} the keys that fired, in offer order
 */
export function generalStateProseCandidates(blockId, readings) {
  /** @type {StateProseCandidate[]} */
  const fired = [];
  // FAIL-CLOSED: a caller with no block or no readings gets silence, never a guess.
  if (!blockId || !readings || typeof readings !== 'object') return Object.freeze(fired);
  // ── THE EXPLICIT CALLS ────────────────────────────────────────────────────────────
  // One line per modifier pool, against the pool's own annex-declared READS path and nothing
  // else. The composer filters by audience and by the pool's attach set; a second copy of
  // `poolMeta.attach` here would be a second home for the same set.
  if (blockId === 'DS-GEN-3' && purseIsShort(readings)) {
    fired.push({ key: 'purse: short', change: 0 });
  }
  return Object.freeze(fired);
}
