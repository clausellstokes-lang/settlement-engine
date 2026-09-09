/**
 * domain/display/stateProse/defenseStateProseCandidates.js — the Defense desk's MODIFIER
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
 * ⭐ SIX POOLS FIRE HERE, AND THEY ARE THE TASTE'S (TASTE car M-3; ARCH §6.3-§6.4). Cars 3b-3g
 * routed the desks through the composer with an EMPTY list, and car 9 authors the wave's
 * modifiers off the census's CUT list; this dock authors the six the taste measures, and only
 * those. Each row below is one authored call to one pool's own predicate, in offer order.
 *
 * The desk composes at 9 of the 31 routed call sites (car 3f).
 *
 * ⛔ THE ONE IMPORT, AND THE MEASUREMENT THAT ADMITTED IT. `compromisedSecurityInstitutions`
 * lives in `src/domain/corruption.js`, and ARCH §5.3 makes the closure of that module into a
 * desk a MEASURED question with a refusal above the 293,079 B precedent (the weight
 * `viewModelPrimitives.js` would have cost `defenseScoreBands.js`). Measured at this car by
 * walking the relative-import graph and summing file bytes, the method the desk's own §1690
 * note uses: the import adds SIX files / 150,985 B — corruption.js 39,558, settlement.schema.js
 * 77,413, lib/entities.js 11,787, prosperityRank.js 7,589, npcTraitWeights.js 7,332,
 * entityTags.js 7,306 — which is 51.5 per cent of the precedent and UNDER it, so the read is
 * ADMITTED and the figure is written here rather than in a receipt nobody opens beside the
 * import. The desk's own closure is 17 files / 403,401 B before it.
 *
 * HEADLESS LEAF: one import, no state, no clock, no RNG.
 *
 * @enforced-by tests/domain/composeStateProse.test.js
 * @enforced-by tests/lint/composeStateProseFence.test.js
 * @enforced-by tests/lint/proseTasteCandidates.walker.test.js
 */
import { compromisedSecurityInstitutions } from '../../corruption.js';
import { measuredMonsterFamily } from './defenseStateProse.js';

/**
 * DS-DEF-11's country predicate: the threat tier normalises to a family the country PRESSES.
 * `measuredMonsterFamily` returns null for an absent or unrecognised tier, and an absent
 * reading is SILENCE and never `false` (the card's own `absent` clause).
 * @param {Record<string, unknown>} readings the settlement, as this desk is handed it
 * @returns {boolean}
 */
function countryIsPressed(readings) {
  const config = /** @type {{monsterThreat?: unknown}|null|undefined} */ (
    /** @type {any} */ (readings).config);
  const family = measuredMonsterFamily(config?.monsterThreat);
  return family === 'plagued' || family === 'frontier';
}

/**
 * DS-DEF-2's stock reading: the live food-security LABEL, or '' where the settlement carries
 * none. The label is a closed six-value ladder and the two pools name three of them.
 * @param {Record<string, unknown>} readings
 * @returns {string}
 */
function foodSecurityLabel(readings) {
  const eco = /** @type {{foodSecurity?: {label?: unknown}|null}|null|undefined} */ (
    /** @type {any} */ (readings).economicState);
  const label = eco?.foodSecurity?.label;
  return typeof label === 'string' ? label : '';
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
 * The Defense desk's modifier candidates for one block, in offer order.
 *
 * @param {string} blockId the block being composed, e.g. 'DS-DEF-11'
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
export function defenseStateProseCandidates(blockId, readings) {
  /** @type {StateProseCandidate[]} */
  const fired = [];
  // FAIL-CLOSED: a caller with no block or no readings gets silence, never a guess.
  if (!blockId || !readings || typeof readings !== 'object') return Object.freeze(fired);
  // ── THE EXPLICIT CALLS ────────────────────────────────────────────────────────────
  // One line per modifier pool, against the pool's own annex-declared READS path and nothing
  // else. The composer does the rest: it filters by AUDIENCE first, then by the pool's attach
  // set, then ranks and bounds. A candidate function that filtered by attach here would be
  // keeping a second copy of `poolMeta.attach`.
  if (blockId === 'DS-DEF-11') {
    // `settlement.config.monsterThreat` -> the corpus FAMILY word. The two country pools are
    // ONE predicate offered TWICE, because ARCH's T-F3 makes a relation that flips with the
    // spine's polarity two pools with DISJOINT attach sets rather than one pool that spans
    // both; the composer's attach filter picks whichever the drawn spine admits, and on a
    // given town exactly one of them can seat.
    if (countryIsPressed(readings)) {
      fired.push({ key: 'country: pressed (walled)', change: 0 });
      fired.push({ key: 'country: pressed (unwalled)', change: 0 });
    }
    // `compromised.revealed` / `compromised.covert` — ONE call, both limbs, because the
    // reader is a single pass over the roster and asking it twice would double the walk on
    // every town for a fact that answers both questions at once.
    const compromised = compromisedSecurityInstitutions(readings);
    if ((compromised.revealed || []).length > 0) fired.push({ key: 'watch: bought (revealed)', change: 0 });
    // ⛔ NOT AUDIENCE-FILTERED HERE, AND THAT IS THE LAW RATHER THAN AN OMISSION. ARCH §4.2
    // step 2 filters candidates by audience INSIDE the composer, before the attach filter and
    // before any budget is spent, precisely so that nothing a covert piece does — including
    // what it prevented — is observable on the player face. A leaf that dropped the key here
    // would be a SECOND audience filter, and the two could disagree.
    if ((compromised.covert || []).length > 0) fired.push({ key: 'watch: bought (covert)', change: 0 });
  }
  if (blockId === 'DS-DEF-2') {
    // `settlement.economicState.foodSecurity.label` — the STOCK behind the building the
    // disaster row names. The two labels are EXCLUSIVE, so at most one of these can fire.
    const food = foodSecurityLabel(readings);
    if (food === 'Deficit' || food === 'Deficit \u00d7 Active Famine') {
      fired.push({ key: 'stores: short', change: 0 });
    }
    if (food === 'Import-Dependent') fired.push({ key: 'stores: import-fed', change: 0 });
  }
  return Object.freeze(fired);
}
