/**
 * tests/helpers/housePresumptions.js — THE DETECTOR OF KIND H1, THE DESCRIPTION'S PRESUMPTION (BAR4-HOUSES, BRIEF-BAR4
 * amendment K1, 2026-11-16): a pure function over a town's RECORD and the lines it PRINTS of two writers, a house's stock
 * description (`institutions[].desc` of the live roster, as the Institutions tab prints it) and the foodways line (the one
 * reader, `domain/foodways.js :: foodwaysLineOf`, as the Economics tab, the PDF and the Foundry journal print it), that
 * returns EVERY instance of the kind: the line, and the settled fact that makes it false.
 *
 * It reads the settled facts, never the words of one sentence a reader met: each CLASS below is a family of presumption
 * WORDS (every line of the two pools that speaks them, read off the pools' own texts) and the STATE that makes them false:
 *   sex      a description with he / his / him / she / her presumes its holder's sex: false where a person holding that
 *            house (`npcs[].institution.key`) is of the other sex (REVIEW-BAR-4 C37943);
 *   timber   "timber to hand", "sited near timber" presume timber the town works: false where `timber at hand` is
 *            (`facts/timberAtHand.js`, the atom's one reader) (C40862);
 *   answers  "answers to no one", "no higher lord", "no overlord" presume a body no one commands: false under an
 *            occupation (the crisis home's `occupied`, or an occupier ruling) (C39560);
 *   market   a foodways line's market and its vendors (`foodways.js :: MARKET_WORDS`, its sellers) presume the market
 *            trading: false under a siege, which stops what comes in to sell (C19810);
 *   store    "stretch the harvest through winter", "fills the winter", "carries it through the lean months" presume food in
 *            store: false where the food record's band is famine or deficit (C47050, C48079; the measure's rule 3);
 *   source   the composer's one-source frame ("Its own food is …") presumes its source is the town's own food: false where a
 *            live house of the roster is a subsistence holding (`foodLand.js :: hasSubsistence`'s four names, by native
 *            name) and the food record holds no grain (C33207: the frame against the roster; the chair's ruling FW1).
 *
 * NAMED EXCLUSIONS (lines the words reach that are TRUE in the state, each with its reason; never noise):
 *   EXCLUDED_TRUE below.
 *
 * Pure: no randomness, no clock, no write. Imports the tree's own readers only.
 */
import { foodwaysLineOf, MARKET_WORDS } from '../../src/domain/foodways.js';
import { crisisOf } from '../../src/domain/facts/crisisKind.js';
import { timberAtHandOf } from '../../src/domain/facts/timberAtHand.js';
import { rulerKindOf } from '../../src/domain/facts/rulerKind.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { nativeSemanticName } from '../../src/domain/content/customContentSemanticAuthority.js';

/** The pronouns of a holder, by the sex they presume. */
const MALE = /\b(?:he|his|him|himself)\b/i;
const FEMALE = /\b(?:she|her|hers|herself)\b/i;
const TIMBER = /\btimber to hand\b|\bsited near timber\b/i;
const ANSWERS = /\banswers to no one\b|\banswering to no higher lord\b|\bno higher lord\b|\bno overlord above it\b/i;
const SELLERS = /\b(?:vendors?|stalls?|hawkers?)\b/i;
const STORE = /\bstretch the harvest through winter\b|\bfills the winter\b|\bcarries it through the lean months\b/i;
const ONE_FRAME = /^(?:Its own food is|What it puts on the table itself is) /;
/** A subsistence holding of the roster (`foodLand.js :: hasSubsistence`'s names), read by its native name. */
const TILLS = /subsistence|common field|household farm|farming community/;

/**
 * NAMED EXCLUSIONS: a line the class's words reach that is TRUE in the state the class reads, and why.
 * @type {ReadonlyArray<Readonly<{ cls: string, text: RegExp, why: string }>>}
 */
export const EXCLUDED_TRUE = Object.freeze([
  Object.freeze({ cls: 'answers', text: /answering to no assassins guild/i, why: 'a contract killer answers to no guild of assassins: no government is spoken of, and no occupation changes it' }),
]);

/** @param {string} cls @param {string} line */
const excluded = (cls, line) => EXCLUDED_TRUE.some((e) => e.cls === cls && e.text.test(line));

/**
 * @typedef {{ cls: 'sex'|'timber'|'answers'|'market'|'store'|'source', writer: 'house'|'foodways', house?: string, line: string, state: string }} Instance
 */

/**
 * THE DETECTOR. Every instance of kind H1 in one town.
 * @param {any} record the settled record
 * @param {{ printed?: (line: string) => boolean, foodwaysLine?: string }} [options] where a dump is at hand, an instance counts
 *   only where its line prints in it (the census's reading); absent, every line the record carries for those surfaces is
 *   taken as printed. `foodwaysLine`: the foodways line as a page printed it (a dump's, an older tree's), read in place of
 *   the reader's
 * @returns {Instance[]}
 */
export function housePresumptionsOf(record, options = {}) {
  const printed = options.printed || (() => true);
  /** @type {Instance[]} */
  const out = [];
  const crisis = crisisOf(record);
  const occupied = crisis.has('occupied') || rulerKindOf(record) === 'occupier';
  const siege = crisis.has('under_siege') || record?.economicState?.foodSecurity?.hasSiege === true;
  const band = record?.economicState?.foodSecurity?.foodRecord?.band;
  const sources = record?.economicState?.foodSecurity?.foodRecord?.foodSources;
  const houses = liveInstitutions(record);
  const npcs = Array.isArray(record?.npcs) ? record.npcs : [];
  for (const inst of houses) {
    const line = typeof inst?.desc === 'string' ? inst.desc : '';
    if (!line || !printed(line)) continue;
    const house = String(inst.name);
    const holders = npcs.filter((n) => n?.institution?.key === inst.name);
    const male = MALE.test(line); const female = FEMALE.test(line);
    if ((male && holders.some((n) => n.gender === 'female')) || (female && holders.some((n) => n.gender === 'male'))) {
      out.push({ cls: 'sex', writer: 'house', house, line, state: `holder ${holders.map((n) => `${n.name} (${n.gender})`).join(', ')}` });
    }
    if (TIMBER.test(line) && timberAtHandOf(record) !== true && !excluded('timber', line)) out.push({ cls: 'timber', writer: 'house', house, line, state: 'no timber at hand' });
    if (ANSWERS.test(line) && occupied && !excluded('answers', line)) out.push({ cls: 'answers', writer: 'house', house, line, state: 'occupied' });
  }
  const food = options.foodwaysLine ?? (foodwaysLineOf(record) || '');
  if (food && printed(food)) {
    if ((MARKET_WORDS.test(food) || SELLERS.test(food)) && siege && !excluded('market', food)) out.push({ cls: 'market', writer: 'foodways', line: food, state: 'under siege' });
    if (STORE.test(food) && (band === 'famine' || band === 'deficit') && !excluded('store', food)) out.push({ cls: 'store', writer: 'foodways', line: food, state: `food band ${band}` });
    if (ONE_FRAME.test(food) && Array.isArray(sources) && !sources.includes('grain') && !sources.includes('mill')) {
      const tiller = houses.find((i) => TILLS.test(nativeSemanticName(i).toLowerCase()));
      if (tiller) out.push({ cls: 'source', writer: 'foodways', line: food, state: `no grain in the food record beside the ${tiller.name} ("${tiller.desc}")` });
    }
  }
  return out;
}
