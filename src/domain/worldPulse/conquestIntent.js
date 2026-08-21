/**
 * conquestIntent.js — WR-8 amendment N3: CAPABILITY NEVER IMPLIES INTENT.
 *
 * A realm that could take its neighbour is not thereby a realm that means to.
 * This leaf answers only the second question — does this court WANT a conquest —
 * and it answers it from character: the martial disposition WR-2 already learns,
 * the realm's own history of conquest, its own moral nature, its patron deity's
 * nature, and THE ENEMY'S BELIEVED NATURE.
 *
 * THE STRUCTURAL GUARANTEE IS THE SIGNATURE. `readConquestIntent` does not accept
 * a feasibility read at all. Not as an optional argument, not as a tiebreak.
 * There is no expression in this module through which capability could reach
 * intent, so "capability never implies intent" is a fact about the function's
 * inputs rather than a promise about its body — and the pin that proves it is
 * two identical intent rows under opposite feasibilities.
 *
 * THE MORAL DISCRIMINATOR is the interesting one, and it is where the I4
 * deception road lands. A good realm presses conquest against a believed EVIL
 * neighbour and refuses it against a decent one — so the single most valuable
 * thing an enemy can plant in a righteous court is a lie about who its neighbour
 * serves. That road reaches CONQUEST INTENT AND STOPS THERE (scoping ruled
 * 2026-08-02): amendment R2 closed it for the razing, and the punitive intent is
 * not reachable from this module by any input at all — `punish` is declared in
 * the vocabulary so the taxonomy is whole, and an exhaustive walk of the intent
 * table proves no combination of inputs ever returns it.
 *
 * MERCY IS A RECEIPT, NOT A GAP. When a court that COULD have taken everything
 * refuses because of what it believes the other side to be, that refusal is
 * published in its own words. A silence there would read as the machinery
 * failing to fire.
 *
 * K3 GOVERNS. Pinned in `envoyK3BeliefSeam.test.js` at ZERO IMPORTS alongside the
 * feasibility composite: every input is an already-banded word some belief or
 * disposition machinery produced, and assembling them is the stage's job.
 *
 * PURE: no rng, no wall-clock, no mutation, no state. Strict-clean.
 */

/**
 * THE THREE INTENTS, plus the absence of one. `punish` is amendment R's, is
 * evil-exclusive at initiation, and is UNREACHABLE from this module — it is
 * listed so the vocabulary is closed and so the walk that proves its
 * unreachability has something to name.
 */
export const CONQUEST_INTENTS = Object.freeze(['none', 'terms', 'conquer', 'punish']);

/**
 * What the I4 deception road can reach, stated as data so a pin can assert it
 * rather than a reader having to trust a paragraph. Planting a lie moves a
 * court's BELIEVED ENEMY NATURE, and the furthest that can carry it is here.
 */
export const DECEPTION_REACHABLE_INTENTS = Object.freeze(['conquer']);

/** The pressure ladder, borrowed verbatim (WR-2's martial channel bands). */
export const CONQUEST_MARTIAL_BANDS = Object.freeze([
  'unknown', 'quiet', 'present', 'pressing', 'decisive',
]);

/** How often this realm has done it before. */
export const CONQUEST_HISTORY_BANDS = Object.freeze([
  'unknown', 'never', 'once', 'repeated', 'habitual',
]);

/**
 * The moral ladder, borrowed verbatim from `warSeatBooks`' own `moralityBand`
 * spelling so a seat read and an intent read speak one language (J-WR-10).
 */
export const CONQUEST_NATURE_BANDS = Object.freeze([
  'unknown', 'benevolent', 'balanced', 'malicious',
]);

/** A patron may also be absent, which is not the same as unknown. */
export const CONQUEST_PATRON_BANDS = Object.freeze([
  'unknown', 'none', 'benevolent', 'balanced', 'malicious',
]);

/** The verdicts the moral discriminator can return, closed. */
export const CONQUEST_MORAL_VERDICTS = Object.freeze([
  'unknown', 'refused_the_decent', 'sanctioned_against_evil', 'indifferent',
]);

const MARTIAL_INPUT = Object.freeze({ quiet: 0, present: 0.3333, pressing: 0.6667, decisive: 1 });
const HISTORY_INPUT = Object.freeze({ never: 0, once: 0.35, repeated: 0.7, habitual: 1 });
const NATURE_MALICE = Object.freeze({ benevolent: 0, balanced: 0.5, malicious: 1 });

export const CONQUEST_INTENT_TUNING = Object.freeze({
  MARTIAL_W: 0.4,
  HISTORY_W: 0.25,
  OWN_NATURE_W: 0.2,
  PATRON_NATURE_W: 0.15,
  // Below this, the court wants terms rather than a conquest even where its
  // conscience would permit one. A realm can be entitled to take a neighbour and
  // simply not be in the business.
  WANT_FLOOR: 0.45,
});

/** @param {number} value @param {number} lo @param {number} hi @returns {number} */
function clamp(value, lo, hi) {
  return value < lo ? lo : value > hi ? hi : value;
}

/** @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/**
 * @param {unknown} band @param {Readonly<Record<string, number>>} table
 * @returns {number | null}
 */
function bandInput(band, table) {
  const word = text(band);
  return Object.prototype.hasOwnProperty.call(table, word) ? table[word] : null;
}

/**
 * @typedef {Object} ConquestIntentRead
 * @property {boolean} known
 * @property {string} intent          one of CONQUEST_INTENTS
 * @property {number|null} wanted01
 * @property {string} moralVerdict    one of CONQUEST_MORAL_VERDICTS
 * @property {boolean} permitted
 * @property {string} receipt
 */

/**
 * @param {string} why @returns {ConquestIntentRead}
 */
function unknownIntent(why) {
  return {
    known: false,
    intent: 'none',
    wanted01: null,
    moralVerdict: 'unknown',
    permitted: false,
    receipt: `no conquest intent can be read: ${why}.`,
  };
}

/**
 * THE CONQUEST-WANTED READ. Takes character and belief; takes NO capability.
 *
 * @param {{
 *   partyId?: unknown, counterpartId?: unknown,
 *   martialBand?: unknown, conquestHistoryBand?: unknown,
 *   ownNatureBand?: unknown, patronNatureBand?: unknown,
 *   believedEnemyNatureBand?: unknown,
 * }} input
 * @returns {ConquestIntentRead}
 */
export function readConquestIntent(input) {
  const row = recordOf(input);
  const partyId = text(row.partyId) || 'the court';
  const counterpartId = text(row.counterpartId) || 'its neighbour';
  const martial = bandInput(row.martialBand, MARTIAL_INPUT);
  if (martial == null) return unknownIntent(`${partyId} has no martial disposition on record`);
  const history = bandInput(row.conquestHistoryBand, HISTORY_INPUT);
  if (history == null) return unknownIntent(`${partyId} has no conquest history on record`);
  const ownMalice = bandInput(row.ownNatureBand, NATURE_MALICE);
  if (ownMalice == null) return unknownIntent(`${partyId}'s own nature is unread`);
  const patronWord = text(row.patronNatureBand);
  if (!CONQUEST_PATRON_BANDS.includes(patronWord) || patronWord === 'unknown') {
    return unknownIntent(`${partyId}'s patron is unread`);
  }
  // A godless court is not a neutral one. With no patron the private conscience
  // simply carries the whole weight, rather than a phantom deity voting 0.5.
  const patronMalice = patronWord === 'none' ? ownMalice : bandInput(patronWord, NATURE_MALICE);
  if (patronMalice == null) return unknownIntent(`${partyId}'s patron is unread`);
  const enemyWord = text(row.believedEnemyNatureBand);
  if (!CONQUEST_NATURE_BANDS.includes(enemyWord) || enemyWord === 'unknown') {
    return unknownIntent(`${partyId} has not formed a view of what ${counterpartId} is`);
  }

  const T = CONQUEST_INTENT_TUNING;
  const wanted01 = round4(clamp(
    T.MARTIAL_W * martial
    + T.HISTORY_W * history
    + T.OWN_NATURE_W * ownMalice
    + T.PATRON_NATURE_W * patronMalice,
    0, 1,
  ));

  // THE MORAL DISCRIMINATOR. Conscience is the STRONGER of the court's own and
  // its patron's — a benevolent god restrains a merely balanced realm, and a
  // benevolent realm is not licensed by a cruel one.
  const conscienceMalice = Math.min(ownMalice, patronMalice);
  /** @type {string} */
  let moralVerdict;
  /** @type {boolean} */
  let permitted;
  if (conscienceMalice <= 0) {
    // A good realm. It presses conquest against what it believes to be evil and
    // refuses it against the decent — which is exactly the lever I4 pulls.
    permitted = enemyWord === 'malicious';
    moralVerdict = permitted ? 'sanctioned_against_evil' : 'refused_the_decent';
  } else if (conscienceMalice >= 1) {
    // A cruel realm does not ask what the other side is.
    permitted = true;
    moralVerdict = 'indifferent';
  } else {
    // Balanced. It will not march on what it believes to be actively good, and
    // otherwise it does not treat the question as decisive.
    permitted = enemyWord !== 'benevolent';
    moralVerdict = permitted
      ? (enemyWord === 'malicious' ? 'sanctioned_against_evil' : 'indifferent')
      : 'refused_the_decent';
  }

  const intent = permitted && wanted01 >= T.WANT_FLOOR ? 'conquer' : 'terms';
  const because = moralVerdict === 'refused_the_decent'
    ? `it will not make war of conquest on a people it believes ${enemyWord}`
    : moralVerdict === 'sanctioned_against_evil'
      ? `it believes ${counterpartId} ${enemyWord} and holds the conquest righteous`
      : `it does not weigh what ${counterpartId} is`;
  const appetite = intent === 'conquer' ? 'means to take' : 'means to treat with';
  return {
    known: true,
    intent,
    wanted01,
    moralVerdict,
    permitted,
    receipt: `${partyId} ${appetite} ${counterpartId}: ${because}`
      + ` (martial ${text(row.martialBand)}, ${text(row.conquestHistoryBand)} before,`
      + ` ${text(row.ownNatureBand)} under a ${patronWord} patron).`,
  };
}

/**
 * MERCY, PUBLISHED. A court that believed a conquest in reach and refused it on
 * conscience gets to say so — "they could have taken everything and did not" is
 * a WR-8 receipt line, and the amendment asks for it by name.
 *
 * Returns null when there is nothing characterful to report: an unreadable
 * judgement, a conquest that was never in reach, or a court that simply took it.
 *
 * @param {ConquestIntentRead|null|undefined} intentRead
 * @param {{ known?: unknown, conquestReachBand?: unknown, partyId?: unknown,
 *   counterpartId?: unknown }|null|undefined} feasibilityRead
 * @returns {{ merciful: boolean, receipt: string } | null}
 */
export function conquestMercyReceipt(intentRead, feasibilityRead) {
  const intent = recordOf(intentRead);
  const feasibility = recordOf(feasibilityRead);
  if (intent.known !== true || feasibility.known !== true) return null;
  const reachBand = text(feasibility.conquestReachBand);
  const couldHave = reachBand === 'within_reach' || reachBand === 'assured';
  if (!couldHave || intent.intent !== 'terms') return null;
  if (intent.moralVerdict !== 'refused_the_decent') return null;
  const partyId = text(feasibility.partyId) || 'the victor';
  const counterpartId = text(feasibility.counterpartId) || 'the defeated';
  return {
    merciful: true,
    receipt: `${partyId} could have taken everything from ${counterpartId} and did not.`,
  };
}

/**
 * THE SCOPING LAW, EXECUTABLE. Whatever a plant does to a court's picture, the
 * furthest the deception road carries is a conquest intent — R2 closed it for
 * the razing, and the punitive intent is unreachable from this module for every
 * input, not merely discouraged.
 *
 * This exists so the claim is a function a pin can call rather than a paragraph
 * a reader must believe.
 * @param {ConquestIntentRead|null|undefined} read @returns {boolean}
 */
export function intentIsDeceptionReachable(read) {
  const row = recordOf(read);
  return DECEPTION_REACHABLE_INTENTS.includes(text(row.intent));
}
