/**
 * domain/display/stateProse/powerStateProseCandidates.js — the Power desk's MODIFIER
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
 * ⭐ REACHABLE FROM NOTHING AT THIS CAR. The list is EMPTY: car 3a lands the seam, cars 3b–3g
 * route the desks through the composer with empty candidate lists, and car 9 authors the
 * modifiers block by block off the census's CUT list. An empty list composes to the kernel's
 * own draw, which is what makes the routing provable by a manifest that cannot move.
 *
 * The desk composes at 7 of the 31 routed call sites (car 3e).
 *
 * PURE HEADLESS LEAF: no imports, no state, no clock, no RNG.
 *
 * @enforced-by tests/domain/composeStateProse.test.js
 * @enforced-by tests/lint/composeStateProseFence.test.js
 */

/**
 * One modifier pool the state earned, as the composer takes it.
 * @typedef {object} StateProseCandidate
 * @property {string} key the modifier pool key, in the SAME block as the spine
 * @property {0|1} [change] the typed CHANGE flag — true only from a PERSISTED band (a
 *   condition's `direction: worsening`, `populationTrend.band`), never from a clock
 *   comparison, which would move composed text with no fact having moved (P-F8)
 */

/**
 * The Power desk's modifier candidates for one block, in offer order.
 *
 * @param {string} blockId the block being composed, e.g. 'DS-POW-1'
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
export function powerStateProseCandidates(blockId, readings) {
  /** @type {StateProseCandidate[]} */
  const fired = [];
  // FAIL-CLOSED: a caller with no block or no readings gets silence, never a guess.
  if (!blockId || !readings || typeof readings !== 'object') return Object.freeze(fired);
  // ── THE EXPLICIT CALLS ────────────────────────────────────────────────────────────
  // One line per modifier pool, authored by car 9 against the census's own predicate, e.g.
  //   if (blockId === 'DS-POW-1' && musterIsShort(readings)) fired.push({ key: 'muster: short', change: 0 });
  // EMPTY AT THIS CAR, by design, and asserted empty by the suite.
  return Object.freeze(fired);
}
