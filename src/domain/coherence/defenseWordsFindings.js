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
        findings.push({ term, needs, sentence });
        break;
      }
    }
  }
  return findings;
}
