/**
 * domain/coherence/defenseWordsFindings.js — does the page claim a defence the place lacks?
 *
 * A standalone check (lane DEFENSE, 2026-11-03): given a settlement and the text a reader
 * sees for it, return one finding for every sentence that names a garrison, soldiers, walls,
 * a hospital, a Guard Captain or a Garrison Commander where `defenseFactsOf` says the thing
 * is not there, and every sentence that says the place has no food put by while the engine
 * holds months of it. `[]` is the coherent answer.
 *
 * ⚠ A SENTENCE THAT DENIES THE THING IS TRUE, NOT A FINDING. "No walls or garrison", "well
 * short of a hospital", "could keep soldiers and does not" all state the absence the facts
 * record, so a term is excused when a denial word stands before it in the same clause, or
 * the clause goes on to deny it. The denial reading is deliberately narrow; a sentence it
 * cannot read is a finding, and the cure is plainer words, not a wider excuse.
 *
 * Pure: no randomness, no clock.
 */

import { defenseFactsOf } from '../defense/defenseFacts.js';

/**
 * @typedef {object} DefenseWordsFinding
 * @property {string} term the word the sentence used
 * @property {string} needs what the place would need for the sentence to be true
 * @property {string} sentence the offending sentence
 */

/**
 * @typedef {object} DefenseTerm
 * @property {string} term
 * @property {RegExp} re
 * @property {string} needs
 * @property {(f: import('../defense/defenseFacts.js').DefenseFacts) => boolean} holds
 */

/** @type {ReadonlyArray<DefenseTerm>} */
const TERMS = Object.freeze([
  { term: 'Garrison Commander', re: /\bGarrison Commander\b/g, needs: 'a garrison', holds: (f) => f.hasGarrison },
  { term: 'Guard Captain', re: /\bGuard Captain\b/g, needs: 'a garrison, watch or militia', holds: (f) => f.hasGarrison || f.hasWatch || f.hasMilitia },
  { term: 'garrison', re: /\bgarrison(?:s|ed)?\b(?! Commander)/gi, needs: 'a garrison', holds: (f) => f.hasGarrison },
  { term: 'soldiers', re: /\bsoldiers?\b/gi, needs: 'a garrison or a hired company', holds: (f) => f.hasGarrison || f.hasMercenary },
  { term: 'walls', re: /\b(?:walls|walled)\b/gi, needs: 'walls, a palisade or earthworks', holds: (f) => f.hasWalls },
  { term: 'hospital', re: /\bhospitals?\b/gi, needs: 'a hospital', holds: (f) => f.hasHospital },
  {
    term: 'no food stored',
    re: /\bno food reserves\b|\bholds no food\b|\bkeeps no food\b|\bno food buffer\b|\bnothing put by\b/gi,
    needs: 'no stored food in the record',
    holds: (f) => !(typeof f.storedFoodMonths === 'number' && f.storedFoodMonths > 0),
  },
]);

/** Denial words that, standing before the term in the same clause, state its absence. */
const DENIAL_BEFORE = /\b(?:no|not|nor|without|never|lacks?|lacking|than|from having)\b[^.;:!?]{0,48}$/i;
/** A clause that names the term and then denies keeping it ("could keep soldiers and does not"). */
const DENIAL_AFTER = /^[^.;:!?]{0,12}\band (?:does|do|did) not\b/i;
/** Terms whose own words are the denial: never excused by a denial word. */
const SELF_DENYING = new Set(['no food stored']);

/*
 * ⚠ A TERM THAT MAKES NO CLAIM ABOUT THIS PLACE'S DEFENCE IS NOT A FINDING (MATCHER, PROSE-2, 2026-11-20, the
 * chair's ruling of 18:19 UTC). A plot's wall, two quarters walled apart, a discharged soldier, clothing sold for
 * soldiers, garrison duty hired out by the day: none says this place has walls, a garrison or soldiers standing. Each
 * reading below is one named rule, with the measured sentence it answers (GEN11-FIELDS, seeds `hxd-<size>-0..49`).
 * Like the denial reading it is DELIBERATELY NARROW: a use none of them reads stays a finding, and every use of the
 * term in the sentence must be read (one claim beside an excused use is still a claim).
 */

/** WALLED THING: `walled` qualifies a plot, a compound, holdings, a waystation or an enclosure FOR someone, the thing's own wall. "A walled plot gated against livestock", "Stone-walled holdings climbing a south-facing hillside", "Walled compounds, tiled roofs…", "A walled waystation offering merchants…", "A stout walled enclosure for the desert merchant". */
const WALLED_THING_AFTER = /^\s+(?:plots?|compounds?|holdings|waystations?|enclosures?\s+for)\b/i;
/** WALLED APART: two parts of the place walled off from each other, no wall round it. "The merchant quarter and the labourers' quarter remain walled apart". */
const WALLED_APART_AFTER = /^\s+apart\b/i;
/** LOW WALLS DIVIDE: low walls that divide one space from another inside the place. "gates, low walls, and planted courtyards divide public from household space". */
const LOW_BEFORE = /\blow\s+$/i;
const DIVIDE_AFTER = /^[^.;:!?]{0,40}\bdivide\b[^.;:!?]{0,20}\bfrom\b/i;
/** A ROOM'S WALLS: the walls are covered with papers, a room's walls. "The walls are covered with charts weighted down by stones." */
const ROOM_WALLS_AFTER = /^\s+are\s+covered\s+with\s+(?:charts|maps|papers|notes|drawings)\b/i;
/** A SOLDIER'S PAST: a discharged, failed, former or retired soldier is a person's history, not a force here. "a discharged soldier who liked the view", "a failed soldier received a land grant", "Where retired soldiers and sellswords do their drinking." */
const SOLDIER_PAST_BEFORE = /\b(?:discharged|failed|former|retired)\s+$/i;
/** A SOLDIER'S DRESS: a person dressed the soldier's way. "soldier's practical dress with officer's insignia". */
const SOLDIER_DRESS_AFTER = /^'s\s+(?:\w+\s+)?(?:dress|clothes|clothing|garb)\b/i;
/** CLOTHING FOR SOLDIERS: goods sold for a trade. "Practical clothing for soldiers and servants." */
const GOODS_FOR_BEFORE = /\b(?:clothing|clothes|dress|garb)\s+for\s+$/i;
/** A SOLDIER AMONG CUSTOMERS: a soldier listed between a merchant and a traveller, someone a trade serves. "for any merchant, soldier, or traveller needing a new mount", "serving merchants, soldiers, and travellers". */
const CUSTOMER_BEFORE = /\bmerchants?,\s+$/i;
const CUSTOMER_AFTER = /^,?\s+(?:and|or)\s+travell?ers?\b/i;
/** GARRISON DUTY HIRED OUT: garrison duty or contracts as work a hired company sells. "Hire trained soldiers for military campaigns, garrison duty, and escorts.", "Offers caravan escort, garrison contracts, and short-term military hire". */
const GARRISON_WORK_AFTER = /^\s+(?:duty|contracts?)\b/i;
const HIRE_IN_SENTENCE = /\bhire\b/i;
// No hospital reading (the chair's ruling of 18:46): "May operate hospital/school." and "It may keep a hospital or a
// school." where no hospital stands are a real fault, cured in the data rows (WORDING-CURE), never excused here.

/** The matched word itself: the adjective, the plural noun, the one soldier. */
const WALLED_WORD = /^walled$/i;
const WALLS_WORD = /^walls$/i;
const ONE_SOLDIER_WORD = /^soldier$/i;

/**
 * The named readings, by term: true when this use of the term claims nothing about the place's defence.
 * @type {Readonly<Record<string, (before: string, word: string, after: string, sentence: string) => boolean>>}
 */
const NOT_A_CLAIM = Object.freeze({
  walls: (before, word, after) => (
    WALLED_WORD.test(word) && (WALLED_THING_AFTER.test(after) || WALLED_APART_AFTER.test(after))
    || WALLS_WORD.test(word) && LOW_BEFORE.test(before) && DIVIDE_AFTER.test(after)
    || WALLS_WORD.test(word) && ROOM_WALLS_AFTER.test(after)
  ),
  soldiers: (before, word, after) => (
    SOLDIER_PAST_BEFORE.test(before)
    || ONE_SOLDIER_WORD.test(word) && SOLDIER_DRESS_AFTER.test(after)
    || GOODS_FOR_BEFORE.test(before)
    || CUSTOMER_BEFORE.test(before) && CUSTOMER_AFTER.test(after)
  ),
  garrison: (_before, _word, after, sentence) => GARRISON_WORK_AFTER.test(after) && HIRE_IN_SENTENCE.test(sentence),
});

/** @param {string} text @returns {string[]} */
function sentencesOf(text) {
  return String(text ?? '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Every sentence of `renderedText` that claims a defence, a hospital or an empty store the
 * settlement's own record contradicts.
 *
 * @param {{ institutions?: unknown, economicState?: unknown } | null | undefined} settlement
 * @param {string | ReadonlyArray<string>} renderedText
 * @returns {DefenseWordsFinding[]}
 */
export function defenseWordsFindings(settlement, renderedText) {
  const facts = defenseFactsOf(settlement);
  const text = Array.isArray(renderedText) ? renderedText.join('\n') : String(renderedText ?? '');
  /** @type {DefenseWordsFinding[]} */
  const findings = [];
  for (const sentence of sentencesOf(text)) {
    for (const { term, re, needs, holds } of TERMS) {
      if (holds(facts)) continue;
      re.lastIndex = 0;
      /** @type {RegExpExecArray | null} */
      let m;
      while ((m = re.exec(sentence))) {
        const denied = !SELF_DENYING.has(term)
          && (DENIAL_BEFORE.test(sentence.slice(0, m.index))
            || DENIAL_AFTER.test(sentence.slice(m.index + m[0].length)));
        if (denied) continue;
        const reading = Object.hasOwn(NOT_A_CLAIM, term) ? NOT_A_CLAIM[term] : null;
        if (reading && reading(sentence.slice(0, m.index), m[0], sentence.slice(m.index + m[0].length), sentence)) continue;
        findings.push({ term, needs, sentence });
        break;
      }
    }
  }
  return findings;
}
