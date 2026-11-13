/**
 * domain/display/prosperityInCrisis.js — WHAT THE PLACE IS IN ORDINARY YEARS, AND WHAT THE CRISIS
 * IN FORCE HAS MADE OF IT, IN ONE PLAIN SENTENCE (the chair's ruling 1(a) on REVIEW-UPKEEP-2,
 * 2026-11-13).
 *
 * The record carries two prosperity words: `economicState.prosperity`, the one every page prints,
 * which a crisis in force caps or steps down (`generators/economy/prosperity.js`, its stress
 * penalties), and `economicState.prosperityStanding`, the same word read with no crisis in force
 * (written at birth, COHERENCE-UPKEEP-5 R3), read through its one reader `facts/keep.js ::
 * standingLabelOf`. Where the two differ, every surface that prints the
 * first says both, in the owner's kept form (record 328):
 *
 *     "Comfortable before the famine; Struggling while it lasts."
 *
 * ⭐ ONE HOME. This is the sentence's only writer: the screen reads it here, the PDF view model and
 * the Foundry journal read it through `dossierViewModel.js :: deriveProsperityPosture` (the parity
 * contract's `prosperity.inCrisis` row), and the realm register reads it for its line.
 *
 * ⭐ THE CRISIS'S PLAIN NAME is the estate's one crisis noun (`crisis/crisisHooks.js :: CRISIS_NOUN`,
 * "In the siege, …"), never a second vocabulary; a kind it does not know (a DM's own crisis) is
 * "the crisis". SEVERAL CRISES IN FORCE are all named, in the record's order, because the second
 * word is by definition the place with NONE of them; the nouns are listed ("the famine and the
 * siege") and the clause turns plural ("while they last").
 *
 * ⛔ IT SAYS NOTHING unless all of this holds: both words are on the six-word ladder
 * (`prosperityRank.js :: PROSPERITY_LABELS`), the printed word is the LOWER of the two (a crisis
 * only ever lowers it), and at least one crisis is in force. So a calm place, a record saved before
 * the second word existed, and a place whose crisis has ended all print exactly what they printed.
 * The sentence names no figure and none of the model's working.
 *
 * Pure: no store, no React, no rng.
 */
import { PROSPERITY_LABELS } from '../prosperityRank.js';
import { activeCrisisTypes, crisisKindOf } from '../facts/crisisKind.js';
import { CRISIS_NOUN } from '../crisis/crisisHooks.js';
import { standingLabelOf } from '../facts/keep.js';

/** The noun of last resort, the one `crisisHooks.js` falls back to. */
const PLAIN_NOUN = 'crisis';
/** The crisis nouns that are plural ("the raids … while they last"). */
const PLURAL_NOUNS = Object.freeze(new Set(['raids']));
/**
 * The crises that are an EVENT and not a spell of time (COHERENCE-UPKEEP-6, the chair's ruling D(i)): a betrayal
 * or a conversion happened and does not last, so where every crisis named is one, the clause reads "since".
 */
const EVENT_KINDS = Object.freeze(new Set(['recently_betrayed', 'religious_conversion']));
/** The word the sentence explains, which leads it where it sits apart from its word (the PDF; ruling D(iii)). */
const LEAD_WORD = 'Prosperity';

/** @param {string[]} items @returns {string} "a", "a and b", "a, b and c" */
const listOf = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

/**
 * The sentence, or null where it must say nothing.
 * @param {{ economicState?: { prosperity?: unknown, prosperityStanding?: unknown } | null } | null | undefined} settlement
 * @returns {string | null}
 */
export function prosperityInCrisisLine(settlement) {
  const eco = settlement?.economicState;
  const shown = eco?.prosperity;
  const standing = standingLabelOf(eco); // the one reader of the standing label (the printed one on an older record: then equal, so silent)
  if (typeof shown !== 'string' || typeof standing !== 'string') return null;
  const below = PROSPERITY_LABELS.indexOf(shown);
  const above = PROSPERITY_LABELS.indexOf(standing);
  if (below < 0 || above < 0 || below >= above) return null;
  /** @type {string[]} */
  const nouns = [];
  let events = true;
  for (const type of activeCrisisTypes(settlement)) {
    const kind = crisisKindOf(type);
    const noun = (kind && CRISIS_NOUN[kind]) || PLAIN_NOUN;
    if (!nouns.includes(noun)) nouns.push(noun);
    if (!kind || !EVENT_KINDS.has(kind)) events = false;
  }
  if (!nouns.length) return null;
  const plural = nouns.length > 1 || PLURAL_NOUNS.has(nouns[0]);
  const after = events ? 'since' : `while ${plural ? 'they last' : 'it lasts'}`;
  return `${standing} before ${listOf(nouns.map((n) => `the ${n}`))}; ${shown} ${after}.`;
}

/**
 * The sentence led by the word it explains, for a page where it sits apart from that word (the PDF's cover,
 * Overview and Economics strips; the chair's ruling D(iii)). Null where there is no sentence.
 * @param {string | null | undefined} line @returns {string | null}
 */
export function prosperityInCrisisLed(line) {
  return line ? `${LEAD_WORD}: ${line}` : null;
}
